package com.example.demo.pattern.observer;

import com.example.demo.entity.Task;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class NotificationObserver implements Observer {

    @Override
    public void update(Task task) {
        // Foundation logic for future notifications
        log.info("Notification: Task '{}' (Ticket ID: {}) was updated. Current Status: {}", 
            task.getTitle(), task.getTicketId(), task.getStatus());
    }
}
