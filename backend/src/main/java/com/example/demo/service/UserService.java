package com.example.demo.service;

import com.example.demo.entity.User;
import java.util.List;

public interface UserService {
    List<User> getAllUsers();
    void deleteUser(Long id);
    void updateUserRole(Long id, com.example.demo.entity.Role role);
    boolean changePassword(String email, String oldPassword, String newPassword);
    boolean updateUserDetails(String email, String newName, String newEmail);
}
