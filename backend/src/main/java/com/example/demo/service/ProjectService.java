package com.example.demo.service;

import com.example.demo.entity.Project;
import com.example.demo.entity.Task;

import java.util.List;

public interface ProjectService {

    Project createProject(Project project);
    List<Project> getAllProjects();
    void deleteProject(Long id);

    Project addTaskToProject(Long projectId, Task task);
    Project getProjectById(Long id);

    Project updateProject(Long id, Project project);
    Project toggleFavorite(Long id);
    Project joinProject(String code, Long userId);
    Project getProjectByCode(String code);
}
