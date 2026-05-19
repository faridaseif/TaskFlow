package com.example.demo.service.impl;

import com.example.demo.dto.TaskRequestDto;
import com.example.demo.dto.TaskResponseDto;
import com.example.demo.entity.Priority;
import com.example.demo.entity.Task;
import com.example.demo.entity.TaskStatus;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.pattern.observer.NotificationObserver;
import com.example.demo.repository.TaskRepository;
import com.example.demo.service.TaskService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final NotificationObserver notificationObserver;

    // Constructor injection
    public TaskServiceImpl(TaskRepository taskRepository, NotificationObserver notificationObserver) {
        this.taskRepository = taskRepository;
        this.notificationObserver = notificationObserver;
    }

    @Override
    public TaskResponseDto createTask(TaskRequestDto dto) {
        // Generate Ticket ID based on current count safely
        long count = taskRepository.count();
        String ticketId;
        do {
            ticketId = "TSK-" + (101 + count);
            count++;
        } while (taskRepository.existsByTicketId(ticketId));

        Task task = Task.builder()
                .ticketId(ticketId)
                .project(dto.getProject())
                .title(dto.getTitle())
                .description(dto.getDescription())
                .status(TaskStatus.fromFrontendLabel(dto.getStatus()))
                .priority(Priority.valueOf(dto.getPriority().toUpperCase()))
                .assignee(dto.getAssignee())
                .dueDate(dto.getDueDate())
                .build();

        Task savedTask = taskRepository.save(task);
        return mapToDto(savedTask);
    }

    @Override
    public List<TaskResponseDto> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public TaskResponseDto getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        return mapToDto(task);
    }

    @Override
    public TaskResponseDto updateTask(Long id, TaskRequestDto dto) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        // Register observer manually here for the pattern demonstration
        task.addObserver(notificationObserver);

        task.setProject(dto.getProject());
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setStatus(TaskStatus.fromFrontendLabel(dto.getStatus()));
        task.setPriority(Priority.valueOf(dto.getPriority().toUpperCase()));
        task.setAssignee(dto.getAssignee());
        task.setDueDate(dto.getDueDate());

        Task updatedTask = taskRepository.save(task);
        
        // Notify observers after update
        updatedTask.notifyObservers();

        return mapToDto(updatedTask);
    }

    @Override
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        taskRepository.delete(task);
    }

    // Helper method to convert Entity to DTO
    private TaskResponseDto mapToDto(Task task) {
        return TaskResponseDto.builder()
                .id(task.getId())
                .ticketId(task.getTicketId())
                .project(task.getProject())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus().getFrontendLabel())
                .priority(task.getPriority().name())
                .assignee(task.getAssignee())
                .dueDate(task.getDueDate())
                .createdAt(task.getCreatedAt())
                .build();
    }
}
