package com.example.demo.service;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.SignupRequest;
import com.example.demo.dto.ForgotPasswordRequest;
import com.example.demo.dto.ResetPasswordRequest;
import com.example.demo.pattern.factory.UserFactory;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserFactory userFactory;

    @Autowired
    public AuthServiceImpl(UserRepository userRepository, UserFactory userFactory) {
        this.userRepository = userRepository;
        this.userFactory = userFactory;
    }

    @Override
    public LoginResponse authenticate(LoginRequest loginRequest) {
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            System.out.println("Found user in DB: " + user.getEmail() + " | Name: [" + user.getName() + "]");
            if (user.getPassword().equals(loginRequest.getPassword())) {
                return new LoginResponse(true, "Login successful", user.getRole(), user.getEmail(), user.getName(), user.getSignupDate());
            }
        }
        
        return new LoginResponse(false, "Invalid email or password", null, null, null, null);
    }

    @Override
    public LoginResponse register(SignupRequest signupRequest) {
        if (userRepository.findByEmail(signupRequest.getEmail()).isPresent()) {
            return new LoginResponse(false, "Email is already registered", null, null, null, null);
        }

        // Use Factory Pattern to create the user
        String name = signupRequest.getName();
        if (name == null || name.trim().isEmpty()) {
            name = signupRequest.getEmail().split("@")[0]; // Fallback to email prefix
        }
        
        System.out.println("Registering user with name: " + name);
        
        com.example.demo.entity.Role userRole = com.example.demo.entity.Role.USER;
        if (signupRequest.getRole() != null && signupRequest.getRole().equalsIgnoreCase("ADMIN")) {
            userRole = com.example.demo.entity.Role.ADMIN;
        }

        User newUser = userFactory.createUser(
                userRole, 
                signupRequest.getEmail(), 
                signupRequest.getPassword(),
                name
        );

        userRepository.save(newUser);

        return new LoginResponse(true, "Registration successful", newUser.getRole(), newUser.getEmail(), newUser.getName(), newUser.getSignupDate());
    }

    @Override
    public LoginResponse processForgotPassword(ForgotPasswordRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (userOptional.isPresent()) {
            return new LoginResponse(true, "Email verified. You can now reset your password.", null, request.getEmail(), null, null);
        }
        return new LoginResponse(false, "No account found with this email.", null, null, null, null);
    }

    @Override
    public LoginResponse resetPassword(ResetPasswordRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setPassword(request.getNewPassword());
            userRepository.save(user);
            return new LoginResponse(true, "Password updated successfully.", null, user.getEmail(), user.getName(), user.getSignupDate());
        }
        return new LoginResponse(false, "Could not reset password. User not found.", null, null, null, null);
    }
}
