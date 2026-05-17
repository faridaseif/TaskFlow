package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskRequestDto {
    private String project;
    private String title;
    private String description;
    
    // Using String to match the frontend easily, will convert to Enum in service
    private String status;
    private String priority;
    
    private String assignee;
    private LocalDate dueDate;
}
