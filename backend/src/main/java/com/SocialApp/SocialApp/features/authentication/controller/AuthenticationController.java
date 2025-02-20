package com.SocialApp.SocialApp.features.authentication.controller;

import com.SocialApp.SocialApp.dto.Response;
import com.SocialApp.SocialApp.features.authentication.dto.AuthenticationRequestBody;
import com.SocialApp.SocialApp.features.authentication.dto.AuthenticationResponseBody;
import com.SocialApp.SocialApp.features.authentication.model.User;
import com.SocialApp.SocialApp.features.authentication.service.AuthenticationService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.UnsupportedEncodingException;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/login")
    public AuthenticationResponseBody loginPage(@Valid @RequestBody AuthenticationRequestBody authenticationRequestBody) {
       return authenticationService.login(authenticationRequestBody);
    }
    @PostMapping("/register")
    public AuthenticationResponseBody registerPage(@Valid @RequestBody AuthenticationRequestBody authenticationRequestBody) throws MessagingException, UnsupportedEncodingException {
        return authenticationService.register(authenticationRequestBody);
    }

    @DeleteMapping("/delete")
    public Response deleteUser(@RequestAttribute("authenticatedUser") User user){
        authenticationService.deleteUser(user.getId());
        return new Response("User deleted successfully.");
    }

    @GetMapping("/user")
    public User getUser(@RequestAttribute("authenticatedUser") User user) {
        return user;
    }

    @PutMapping("/validate-email-verification-token")
    public Response verifyEmail(@RequestParam String token, @RequestAttribute("authenticatedUser") User user){
        authenticationService.validateEmailVerificationToken(token, user.getEmail());
        return new Response("Email verified successfully!");
    }

    @GetMapping("/send-email-verification-token")
    public Response sendEmailVerificationToken(@RequestAttribute("authenticatedUser") User user){
        authenticationService.sendEmailVerificationToken(user.getEmail());
        return new Response("Email verification token sent successfully");
    }

    @PutMapping("/send-password-reset-token")
    public Response sendPasswordResetToken(@RequestParam String email){
        authenticationService.sendPasswordResetToken(email);
        return new Response("Password reset token sent successfully!");
    }

    @PutMapping("/reset-password")
    public Response resetPassword(@RequestParam String newPassword, @RequestParam String token, @RequestParam String email){
        authenticationService.resetPassword(email,newPassword, token);
        return new Response("Password reset successfully!");
    }

    @PutMapping("/profile/{id}")
    public User updateUserProfile(
            @RequestAttribute("authenticatedUser") User user,
            @PathVariable Long id,
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String description
            ){
        if(!user.getId().equals(id)){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You have no permission to update this profile.");
        }

        return authenticationService.updateUserProfile(id, firstName, lastName, username, description);
    }

}
