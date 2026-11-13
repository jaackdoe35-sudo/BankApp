import AppLayout from '../components/AppLayout'

export default function TransferPage() {
  return (
    <AppLayout>
      <div className="page-heading">
        <div>
          <p className="page-eyebrow">PAYMENTS & TRANSFERS</p>
          <h1 className="page-title">Outgoing transfers disabled</h1>
          <p className="page-subtitle">Customer accounts cannot send, withdraw, or transfer funds.</p>
        </div>
      </div>
      <section className="bank-panel">
        <h2 className="bank-panel-title">Account protection</h2>
        <p className="bank-panel-description">
          Only the designated administrator can send synthetic funds to customer accounts.
          Successful administrator credits generate an account notification and a transactional email.
        </p>
      </section>
    </AppLayout>
  )
}
