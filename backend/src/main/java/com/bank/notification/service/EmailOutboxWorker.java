package com.bank.notification.service;

import com.bank.notification.email.EmailSender;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

/** Dispatches committed email-outbox records independently from financial transactions. */
@Component
public class EmailOutboxWorker {
    private static final Logger log = LoggerFactory.getLogger(EmailOutboxWorker.class);
    private static final int BATCH_LIMIT = 10;
    private static final int MAX_ATTEMPTS = 10;
    private static final RowMapper<OutboxMessage> ROW_MAPPER = EmailOutboxWorker::mapRow;

    private final JdbcTemplate jdbcTemplate;
    private final EmailSender emailSender;
    private final TransactionTemplate transactionTemplate;

    public EmailOutboxWorker(JdbcTemplate jdbcTemplate, EmailSender emailSender,
                             PlatformTransactionManager transactionManager) {
        this.jdbcTemplate = jdbcTemplate;
        this.emailSender = emailSender;
        this.transactionTemplate = new TransactionTemplate(transactionManager);
    }

    @Scheduled(fixedDelayString = "${app.mail.outbox.poll-interval-ms:30000}")
    public void dispatchPending() {
        if (!emailSender.isConfigured()) return;
        for (int i = 0; i < BATCH_LIMIT; i++) {
            OutboxMessage message = claimNext();
            if (message == null) return;
            try {
                emailSender.send(message.recipient(), message.subject(), message.body());
                jdbcTemplate.update("""
                        UPDATE email_outbox SET status='SENT', sent_at=CURRENT_TIMESTAMP,
                            locked_at=NULL, last_error=NULL WHERE id=?
                        """, message.id());
                log.info("Email outbox item {} delivered", message.id());
            } catch (Exception ex) {
                retryOrFail(message, ex);
            }
        }
    }

    private OutboxMessage claimNext() {
        return transactionTemplate.execute(status -> {
            List<OutboxMessage> rows = jdbcTemplate.query("""
                    SELECT id, recipient, subject, body, attempts FROM email_outbox
                    WHERE (status='PENDING' AND next_attempt_at <= CURRENT_TIMESTAMP)
                       OR (status='PROCESSING' AND locked_at < CURRENT_TIMESTAMP - INTERVAL '10 minutes')
                    ORDER BY created_at LIMIT 1 FOR UPDATE SKIP LOCKED
                    """, ROW_MAPPER);
            if (rows.isEmpty()) return null;
            OutboxMessage row = rows.get(0);
            int attempts = row.attempts() + 1;
            jdbcTemplate.update("""
                    UPDATE email_outbox SET status='PROCESSING', attempts=?, locked_at=CURRENT_TIMESTAMP
                    WHERE id=?
                    """, attempts, row.id());
            return new OutboxMessage(row.id(), row.recipient(), row.subject(), row.body(), attempts);
        });
    }

    private void retryOrFail(OutboxMessage message, Exception ex) {
        long delay = Math.min(3600L, 30L * (1L << Math.min(message.attempts() - 1, 7)));
        String detail = ex.getClass().getSimpleName() + ": " + String.valueOf(ex.getMessage());
        if (detail.length() > 1000) detail = detail.substring(0, 1000);
        String state = message.attempts() >= MAX_ATTEMPTS ? "FAILED" : "PENDING";
        jdbcTemplate.update("""
                UPDATE email_outbox SET status=?,
                    next_attempt_at=CURRENT_TIMESTAMP + (? * INTERVAL '1 second'),
                    locked_at=NULL, last_error=? WHERE id=?
                """, state, delay, detail, message.id());
        if ("FAILED".equals(state)) log.error("Email outbox item {} exhausted retries", message.id(), ex);
        else log.warn("Email outbox item {} will retry in {} seconds", message.id(), delay);
    }

    private static OutboxMessage mapRow(ResultSet rs, int row) throws SQLException {
        return new OutboxMessage(rs.getObject("id", UUID.class), rs.getString("recipient"),
                rs.getString("subject"), rs.getString("body"), rs.getInt("attempts"));
    }

    private record OutboxMessage(UUID id, String recipient, String subject, String body, int attempts) {}
}
