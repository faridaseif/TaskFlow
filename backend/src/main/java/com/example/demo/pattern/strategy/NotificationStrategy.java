package com.example.demo.pattern.strategy;

import com.example.demo.entity.User;

public interface NotificationStrategy {
    void send(User user, String message);
}