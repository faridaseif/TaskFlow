package com.example.demo.service;

import com.example.demo.entity.User;

public interface NotificationService {
    void notifyUser(User user, String message);
}