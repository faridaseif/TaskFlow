package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskResponseDto {
    private Long id;
    private String ticketId;
    private String project;
    private String title;
    private String description;
    
    // Converted back to string format for frontend compatibility
    private String status;
    private String priority;
    
    private String assignee;
    private LocalDate dueDate;
    private LocalDateTime createdAt;
}
