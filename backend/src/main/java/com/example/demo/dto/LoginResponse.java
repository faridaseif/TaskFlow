package com.example.demo.dto;

import com.example.demo.entity.Role;
import java.time.LocalDateTime;

public class LoginResponse {
    private boolean success;
    private String message;
    private Role role;
    private String email;
    private String name;
    private LocalDateTime signupDate;
    
    public LoginResponse(boolean success, String message, Role role, String email, String name, LocalDateTime signupDate) {
        this.success = success;
        this.message = message;
        this.role = role;
        this.email = email;
        this.name = name;
        this.signupDate = signupDate;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public Role getRole() {
        return role;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public LocalDateTime getSignupDate() {
        return signupDate;
    }
}
