package com.example.demo.controller;

import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<Void> updateRole(@PathVariable Long id, @RequestParam Role role) {
        userService.updateUserRole(id, role);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody com.example.demo.dto.ChangePasswordRequest request) {
        boolean success = userService.changePassword(request.getEmail(), request.getOldPassword(), request.getNewPassword());
        if (success) {
            return ResponseEntity.ok("Password changed successfully");
        } else {
            return ResponseEntity.status(400).body("Invalid old password");
        }
    }

    @PostMapping("/update-profile")
    public ResponseEntity<String> updateProfile(@RequestBody com.example.demo.dto.UpdateProfileRequest request) {
        boolean success = userService.updateUserDetails(request.getCurrentEmail(), request.getName(), request.getEmail());
        if (success) {
            return ResponseEntity.ok("Profile updated successfully");
        } else {
            return ResponseEntity.status(400).body("Failed to update profile");
        }
    }
}
