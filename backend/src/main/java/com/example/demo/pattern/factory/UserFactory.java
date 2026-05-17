package com.example.demo.pattern.factory;

import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class UserFactory {
    
    public User createUser(Role role, String email, String password, String name) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(role);
        user.setSignupDate(LocalDateTime.now());
        return user;
    }
}
