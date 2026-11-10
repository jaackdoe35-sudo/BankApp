package com.bank.customer.service;

import com.bank.auth.domain.User;
import com.bank.auth.repo.UserRepository;
import com.bank.common.SecurityUtils;
import com.bank.common.event.DomainEvent;
import com.bank.common.event.EventActions;
import com.bank.common.event.EventPublisher;
import com.bank.common.exception.NotFoundException;
import com.bank.customer.domain.CustomerProfile;
import com.bank.customer.domain.KycStatus;
import com.bank.customer.dto.ProfileResponse;
import com.bank.customer.dto.UpdateProfileRequest;
import com.bank.customer.repo.CustomerProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Service
public class CustomerService {

    private final UserRepository userRepository;
    private final CustomerProfileRepository profileRepository;
    private final EventPublisher eventPublisher;

    public CustomerService(UserRepository userRepository, CustomerProfileRepository profileRepository,
                           EventPublisher eventPublisher) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(UUID userId) {
        User user = requireUser(userId);
        // Staff accounts (e.g. the seeded admin) have no customer profile; return
        // just the identity rather than 404 so they can sign in to the UI.
        CustomerProfile profile = profileRepository.findByUserId(userId).orElse(null);
        return toResponse(user, profile);
    }

    @Transactional
    public ProfileResponse updateProfile(UUID userId, UpdateProfileRequest request) {
        User user = requireUser(userId);
        CustomerProfile profile = requireProfile(userId);
        if (request.firstName() != null) profile.setFirstName(request.firstName());
        if (request.lastName() != null) profile.setLastName(request.lastName());
        if (request.dateOfBirth() != null) profile.setDateOfBirth(request.dateOfBirth());
        if (request.phone() != null) profile.setPhone(request.phone());
        if (request.addressLine1() != null) profile.setAddressLine1(request.addressLine1());
        if (request.city() != null) profile.setCity(request.city());
        if (request.country() != null) profile.setCountry(request.country());
        return toResponse(user, profile);
    }

    @Transactional(readOnly = true)
    public List<ProfileResponse> listAllProfiles() {
        Map<UUID, User> usersById = userRepository.findAll().stream()
                .collect(java.util.stream.Collectors.toMap(User::getId, Function.identity()));
        return profileRepository.findAll().stream()
                .filter(p -> usersById.containsKey(p.getUserId()))
                .map(p -> toResponse(usersById.get(p.getUserId()), p))
                .toList();
    }

    @Transactional
    public ProfileResponse setKycStatus(UUID userId, KycStatus status) {
        User user = requireUser(userId);
        CustomerProfile profile = requireProfile(userId);
        profile.setKycStatus(status);
        String action = status == KycStatus.VERIFIED ? EventActions.KYC_VERIFIED : EventActions.KYC_REJECTED;
        UUID actor = SecurityUtils.currentUserId();
        eventPublisher.publish(DomainEvent.of(action, actor, userId, "KYC", userId.toString(),
                "Your identity verification is now " + status, true));
        return toResponse(user, profile);
    }

    private User requireUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    private CustomerProfile requireProfile(UUID userId) {
        return profileRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("Profile not found"));
    }

    private ProfileResponse toResponse(User user, CustomerProfile p) {
        return new ProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getRole().name(),
                p == null ? null : p.getFirstName(),
                p == null ? null : p.getLastName(),
                p == null ? null : p.getDateOfBirth(),
                p == null ? null : p.getPhone(),
                p == null ? null : p.getAddressLine1(),
                p == null ? null : p.getCity(),
                p == null ? null : p.getCountry(),
                p == null ? null : p.getKycStatus());
    }
}
