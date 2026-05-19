package com.example.demo.service;

import com.example.demo.dto.TaskResponseDto;
import java.util.List;

public interface ProgressService {

    // Update only task status
    TaskResponseDto updateTaskStatus(Long id, String status);

    // Get all tasks
    List<TaskResponseDto> getAllTasks();

    // Get single task
    TaskResponseDto getTaskById(Long id);

    // Delete task
    void deleteTask(Long id);
}
