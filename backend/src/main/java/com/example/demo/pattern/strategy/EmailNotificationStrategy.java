package com.example.demo.pattern.strategy;

import com.example.demo.entity.User;

public class EmailNotificationStrategy implements NotificationStrategy {
    @Override
    public void send(User user, String message) {
        System.out.println("Sending Email to " + user.getEmail() + ": " + message);
        // Implementation for actual email sending would go here (e.g., JavaMailSender)
    }
}