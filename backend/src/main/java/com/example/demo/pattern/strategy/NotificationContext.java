package com.example.demo.pattern.strategy;

import com.example.demo.entity.User;

public class NotificationContext {
    private NotificationStrategy strategy;

    public NotificationContext(NotificationStrategy strategy) {
        this.strategy = strategy;
    }

    public void setStrategy(NotificationStrategy strategy) {
        this.strategy = strategy;
    }

    public void sendNotification(User user, String message) {
        strategy.send(user, message);
    }
}