package com.SocialApp.SocialApp.features.authentication.service;

import com.SocialApp.SocialApp.features.authentication.dto.AuthenticationRequestBody;
import com.SocialApp.SocialApp.features.authentication.dto.AuthenticationResponseBody;
import com.SocialApp.SocialApp.features.authentication.model.User;
import com.SocialApp.SocialApp.features.authentication.repository.AuthenticationUserRepository;
import com.SocialApp.SocialApp.features.authentication.utilities.EmailService;
import com.SocialApp.SocialApp.features.authentication.utilities.Encoder;
import com.SocialApp.SocialApp.features.authentication.utilities.JsonWebToken;


import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;



@Service
public class AuthenticationService {
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);
    private final JsonWebToken jsonWebToken;
    private AuthenticationUserRepository authenticationUserRepository;
    private final Encoder encoder;
    private final EmailService emailService;
    private final int durationInMinutes = 2;

    @PersistenceContext
    private EntityManager entityManager;

    public AuthenticationService(JsonWebToken jsonWebToken, Encoder encoder, AuthenticationUserRepository authenticationUserRepository, EmailService emailService) {
        this.jsonWebToken = jsonWebToken;
        this.authenticationUserRepository = authenticationUserRepository;
        this.encoder = encoder;
        this.emailService = emailService;
    }

    public User getUser(String email){
        return authenticationUserRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found!"));
    }

    public static String generateEmailVerificationToken(){
        SecureRandom random = new SecureRandom();
        StringBuilder token = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            token.append(random.nextInt(10));
        }
        return token.toString();
    }

    public void sendEmailVerificationToken(String email){
        Optional<User> user = authenticationUserRepository.findByEmail(email);
        if(user.isPresent() && !user.get().getEmailVerified()){
            String emailVerificationToken = generateEmailVerificationToken();
            String hashedToken = encoder.encode(emailVerificationToken);
            user.get().setEmailVerificationToken(hashedToken);
            user.get().setEmailVerificationTokenExpiryDate(LocalDateTime.now().plusMinutes(durationInMinutes));
            authenticationUserRepository.save(user.get());
            String subject = "Email verification";
            String body = String.format("WELCOME!\n\n" +
                    "Enter this code to verify your email: " + "%s\n\n" +
                    "The code will expire in " + "%s"+ " minutes.",emailVerificationToken,durationInMinutes);
            try{
                emailService.sendEmail(email,subject,body);
            }catch (Exception e){
                logger.info("Error while sending email: "+e.getMessage());
            }
        }else {
            throw new IllegalArgumentException("Email verification token failed, or email is already verified.");
        }
    }

    public void validateEmailVerificationToken(String token, String email){
        Optional<User> user = authenticationUserRepository.findByEmail(email);
        if(user.isPresent() && encoder.matches(token, user.get().getEmailVerificationToken()) && !user.get().getEmailVerificationTokenExpiryDate().isBefore(LocalDateTime.now())){
            user.get().setEmailVerified(true);
            user.get().setEmailVerificationToken(null);
            user.get().setEmailVerificationTokenExpiryDate(null);
            authenticationUserRepository.save(user.get());
        }else if(user.isPresent() && encoder.matches(token, user.get().getEmailVerificationToken()) && user.get().getEmailVerificationTokenExpiryDate().isBefore(LocalDateTime.now())){
            throw new IllegalArgumentException("Email verification token expired.");
        }else{
            throw new IllegalArgumentException("Email verification token failed.");
        }
    }

    public void sendPasswordResetToken(String email){
        Optional<User> user = authenticationUserRepository.findByEmail(email);
        if (user.isPresent()) {
            String passwordResetToken = generateEmailVerificationToken();
            String hashedToken = encoder.encode(passwordResetToken);
            user.get().setPasswordResetToken(hashedToken);
            user.get().setPasswordResetTokenExpiryDate(LocalDateTime.now().plusMinutes(durationInMinutes));
            authenticationUserRepository.save(user.get());
            String subject = "Password Reset";
            String body = String.format("""
                    You requested a password reset.

                    Enter this code to reset your password: %s. The code will expire in %s minutes.""",
                    passwordResetToken, durationInMinutes);
            try {
                emailService.sendEmail(email, subject, body);
            } catch (Exception e) {
                logger.info("Error while sending email: {}", e.getMessage());
            }
        } else {
            throw new IllegalArgumentException("User not found.");
        }
    }

    public void resetPassword(String email, String newPassword, String token){
        Optional<User> user = authenticationUserRepository.findByEmail(email);
        if (user.isPresent() && encoder.matches(token, user.get().getPasswordResetToken())
                && !user.get().getPasswordResetTokenExpiryDate().isBefore(LocalDateTime.now())) {
            user.get().setPasswordResetToken(null);
            user.get().setPasswordResetTokenExpiryDate(null);
            user.get().setPassword(encoder.encode(newPassword));
            authenticationUserRepository.save(user.get());
        } else if (user.isPresent() && encoder.matches(token, user.get().getPasswordResetToken())
                && user.get().getPasswordResetTokenExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Password reset token expired.");
        } else {
            throw new IllegalArgumentException("Password reset token failed.");
        }
    }

    public AuthenticationResponseBody register(AuthenticationRequestBody registerRequestBody) {
        User user = authenticationUserRepository.save(new User(
                registerRequestBody.getEmail(), encoder.encode(registerRequestBody.getPassword())));

        String emailVerificationToken = generateEmailVerificationToken();
        String hashedToken = encoder.encode(emailVerificationToken);
        user.setEmailVerificationToken(hashedToken);
        user.setEmailVerificationTokenExpiryDate(LocalDateTime.now().plusMinutes(durationInMinutes));

        authenticationUserRepository.save(user);

        String subject = "Email Verification";
        String body = String.format("""

                Enter this code to verify your email: %s. The code will expire in %s minutes.""",
                emailVerificationToken, durationInMinutes);
        try {
            emailService.sendEmail(registerRequestBody.getEmail(), subject, body);
        } catch (Exception e) {
            logger.info("Error while sending email: {}", e.getMessage());
        }
        String authToken = jsonWebToken.generateToken(registerRequestBody.getEmail());
        return new AuthenticationResponseBody(authToken, "User registered successfully.");
    }


    public AuthenticationResponseBody login(AuthenticationRequestBody RequestBody){
        User user = authenticationUserRepository.findByEmail(RequestBody.getEmail()).orElseThrow(() -> new IllegalArgumentException("User not found!"));
        if(!encoder.matches(RequestBody.getPassword(),user.getPassword())){
            throw new IllegalArgumentException("Invalid password.");
        }
        String token = jsonWebToken.generateToken(RequestBody.getEmail());
        return new AuthenticationResponseBody(token,"Authentication successful");
    }

    public User updateUserProfile(Long userId, String firstName, String lastName, String username, String description){
        User user = authenticationUserRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (firstName != null) user.setFirstName(firstName);
        if (lastName != null) user.setLastName(lastName);
        if (username != null) user.setUsername(username);
        if (description != null) user.setDescription(description);
        return authenticationUserRepository.save(user);

    }

    @Transactional
    public void deleteUser(Long userId){
        User user = entityManager.find(User.class, userId);
        // remember to delete all likes from user (because of many to many relationship)
        if (user != null) {
            entityManager.createNativeQuery("DELETE FROM posts_likes WHERE user_id = :userId")
                            .setParameter("userId", userId).executeUpdate();
            authenticationUserRepository.deleteById(userId);
        }
    }
}
