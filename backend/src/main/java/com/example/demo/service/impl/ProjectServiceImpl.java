package com.example.demo.service.impl;

import com.example.demo.service.ProjectService;
import com.example.demo.entity.Project;
import com.example.demo.entity.User;
import com.example.demo.entity.Task;
import com.example.demo.entity.TaskStatus;
import com.example.demo.entity.Priority;
import com.example.demo.repository.ProjectRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.ArrayList;

@Service
@org.springframework.transaction.annotation.Transactional
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Override
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    public Project getProjectById(Long id) {
        return projectRepository.findById(id).orElse(null);
    }

    @Override
    public Project createProject(Project project) {
        if (project.getManager() != null) {
            User manager = null;
            if (project.getManager().getId() != null) {
                manager = userRepository.findById(project.getManager().getId()).orElse(null);
            } else if (project.getManager().getEmail() != null) {
                manager = userRepository.findByEmail(project.getManager().getEmail()).orElse(null);
            }
            project.setManager(manager);
        }
        if (project.getMembers() != null) {
            List<User> fullMembers = new ArrayList<>();
            for (User m : project.getMembers()) {
                userRepository.findById(m.getId()).ifPresent(fullMembers::add);
            }
            project.setMembers(fullMembers);
        }
        return projectRepository.save(project);
    }

    @Override
    public Project updateProject(Long id, Project project) {
        Project existing = getProjectById(id);
        if (existing != null) {
            existing.setName(project.getName());
            existing.setDescription(project.getDescription());
            existing.setIcon(project.getIcon());
            existing.setFavorite(project.isFavorite());
            existing.setVisibility(project.getVisibility());
            if (project.getManager() != null) {
                User manager = null;
                if (project.getManager().getId() != null) {
                    manager = userRepository.findById(project.getManager().getId()).orElse(null);
                } else if (project.getManager().getEmail() != null) {
                    manager = userRepository.findByEmail(project.getManager().getEmail()).orElse(null);
                }
                existing.setManager(manager);
            }
            if (project.getMembers() != null) {
                List<User> fullMembers = new ArrayList<>();
                for (User m : project.getMembers()) {
                    userRepository.findById(m.getId()).ifPresent(fullMembers::add);
                }
                existing.setMembers(fullMembers);
            }
            return projectRepository.save(existing);
        }
        return null;
    }

    @Override
    public Project toggleFavorite(Long id) {
        Project existing = getProjectById(id);
        if (existing != null) {
            existing.setFavorite(!existing.isFavorite());
            return projectRepository.save(existing);
        }
        return null;
    }

    @Override
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public Project joinProject(String code, Long userId) {
        Project project = projectRepository.findByProjectCode(code)
            .orElseThrow(() -> new RuntimeException("Project not found with code: " + code));
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        if (project.getMembers() == null) {
            project.setMembers(new ArrayList<>());
        }
        
        // Add user as a member if not already joined
        boolean alreadyMember = false;
        for (User member : project.getMembers()) {
            if (member.getId().equals(user.getId())) {
                alreadyMember = true;
                break;
            }
        }
        
        if (!alreadyMember) {
            project.getMembers().add(user);
            projectRepository.save(project);
        }
        return project;
    }

    @Override
    public Project getProjectByCode(String code) {
        return projectRepository.findByProjectCode(code)
            .orElseThrow(() -> new RuntimeException("Project not found with code: " + code));
    }

    @Override
    public Project addTaskToProject(Long projectId, Task task) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (task.getTicketId() == null || task.getTicketId().isEmpty()) {
            long count = taskRepository.count();
            String ticketId;
            do {
                ticketId = "TSK-" + (101 + count);
                count++;
            } while (taskRepository.existsByTicketId(ticketId));
            task.setTicketId(ticketId);
        }
        if (task.getStatus() == null) {
            task.setStatus(TaskStatus.TO_DO);
        }
        if (task.getPriority() == null) {
            task.setPriority(Priority.MEDIUM);
        }

        task.setProjectEntity(project);
        task.setProject(project.getName());
        if (project.getTasks() == null) {
            project.setTasks(new ArrayList<>());
        }
        project.getTasks().add(task);

        return projectRepository.save(project);
    }
}