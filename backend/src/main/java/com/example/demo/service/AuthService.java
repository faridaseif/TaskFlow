package com.example.demo.service;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.SignupRequest;
import com.example.demo.dto.ForgotPasswordRequest;
import com.example.demo.dto.ResetPasswordRequest;

public interface AuthService {
    LoginResponse authenticate(LoginRequest loginRequest);
    LoginResponse register(SignupRequest signupRequest);
    LoginResponse processForgotPassword(ForgotPasswordRequest forgotPasswordRequest);
    LoginResponse resetPassword(ResetPasswordRequest resetPasswordRequest);
}
