package com.example.demo.controller;

import com.example.demo.dto.TaskResponseDto;
import com.example.demo.service.ProgressService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/progress")
@CrossOrigin(origins = "*")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @PutMapping("/tasks/{id}/status")
    public TaskResponseDto updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        TaskResponseDto updated = progressService.updateTaskStatus(id, status);

        if (updated == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found");
        }

        return updated;
    }

    @GetMapping("/tasks")
    public List<TaskResponseDto> getTasks() {
        return progressService.getAllTasks();
    }

    @DeleteMapping("/tasks/{id}")
    public void deleteTask(@PathVariable Long id) {
        progressService.deleteTask(id);
    }
}