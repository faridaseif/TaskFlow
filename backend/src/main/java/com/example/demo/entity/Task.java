package com.example.demo.entity;

import com.example.demo.pattern.observer.Observer;
import com.example.demo.pattern.observer.Subject;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task extends BaseEntity implements Subject {

    @Column(unique = true, nullable = false)
    private String ticketId;

    private String project;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    private String assignee;

    private LocalDate dueDate;

    // Transient list for Observer pattern (not saved to DB)
    @Transient
    @Builder.Default
    private List<Observer> observers = new ArrayList<>();

    @Override
    public void addObserver(Observer observer) {
        if (this.observers == null) {
            this.observers = new ArrayList<>();
        }
        if (!this.observers.contains(observer)) {
            this.observers.add(observer);
        }
    }

    @Override
    public void removeObserver(Observer observer) {
        if (this.observers != null) {
            this.observers.remove(observer);
        }
    }

    @Override
    public void notifyObservers() {
        if (this.observers != null) {
            for (Observer observer : observers) {
                observer.update(this);
            }
        }
    }
}
