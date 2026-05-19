package com.example.demo.controller;

import com.example.demo.entity.Project;
import com.example.demo.entity.Task;
import com.example.demo.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    @GetMapping("/{id}")
    public Project getProjectById(@PathVariable Long id) {
        return projectService.getProjectById(id);
    }

    @GetMapping("/code/{code}")
    public Project getProjectByCode(@PathVariable String code) {
        return projectService.getProjectByCode(code);
    }

    @PostMapping
    public Project createProject(@RequestBody Project project) {
        return projectService.createProject(project);
    }

    @PutMapping("/{id}")
    public Project updateProject(@PathVariable Long id, @RequestBody Project project) {
        return projectService.updateProject(id, project);
    }

    @PatchMapping("/{id}/favorite")
    public Project toggleFavorite(@PathVariable Long id) {
        return projectService.toggleFavorite(id);
    }

    @PostMapping("/join")
    public Project joinProject(@RequestParam String code, @RequestParam Long userId) {
        return projectService.joinProject(code, userId);
    }

    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
    }

    @PostMapping("/{id}/tasks")
    public Project addTaskToProject(
            @PathVariable Long id,
            @RequestBody Task task) {
        return projectService.addTaskToProject(id, task);
    }
}