package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;

public class UpdateProfileRequest {
    @NotBlank
    private String currentEmail;
    
    @NotBlank
    private String name;
    
    @NotBlank
    @Email
    private String email;

    // Getters and Setters
    public String getCurrentEmail() { return currentEmail; }
    public void setCurrentEmail(String currentEmail) { this.currentEmail = currentEmail; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
