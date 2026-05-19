package com.example.demo.service.impl;

import com.example.demo.dto.TaskResponseDto;
import com.example.demo.entity.Task;
import com.example.demo.pattern.observer.UserObserver;
import com.example.demo.repository.TaskRepository;
import com.example.demo.service.ProgressService;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import com.example.demo.entity.TaskStatus;

@Service
public class ProgressServiceImpl implements ProgressService {

    private final TaskRepository taskRepository;

    public ProgressServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // Convert Entity → DTO
    private TaskResponseDto mapToDTO(Task task) {
        return TaskResponseDto.builder()
                .id(task.getId())
                .ticketId(task.getTicketId())
                .project(task.getProject())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus() != null ? task.getStatus().getFrontendLabel() : null)
                .priority(task.getPriority() != null ? task.getPriority().name() : null)
                .assignee(task.getAssignee())
                .dueDate(task.getDueDate())
                .build();
    }

    @Override
    public TaskResponseDto updateTaskStatus(Long id, String status) {
        Task task = taskRepository.findById(id).orElse(null);

        if (task != null) {
            try {
                task.setStatus(TaskStatus.fromFrontendLabel(status));
            } catch (IllegalArgumentException e) {
                task.setStatus(TaskStatus.valueOf(status.toUpperCase().replace(" ", "_")));
            }

            Task saved = taskRepository.save(task);

            UserObserver observer = new UserObserver(saved.getAssignee());
            saved.addObserver(observer);
            saved.notifyObservers();

            return mapToDTO(saved);
        }

        return null;
    }

    @Override
    public List<TaskResponseDto> getAllTasks() {
        return taskRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TaskResponseDto getTaskById(Long id) {
        Task task = taskRepository.findById(id).orElse(null);
        return task != null ? mapToDTO(task) : null;
    }

    @Override
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id).orElse(null);
        if (task != null) {
            taskRepository.deleteById(id);

            UserObserver observer = new UserObserver(task.getAssignee());
            task.addObserver(observer);

            // Temporarily set title to show deletion in the notification
            task.setTitle(task.getTitle() + " (Deleted)");
            task.notifyObservers();
        }
    }
}
