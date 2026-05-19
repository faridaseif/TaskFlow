package com.example.demo.pattern.observer;

import com.example.demo.entity.Task;

public class UserObserver implements Observer {
    private String userName;

    public UserObserver(String userName) {
        this.userName = userName;
    }

    @Override
    public void update(Task task) {
        System.out.println(
                "Notification for "
                        + userName
                        + ": Task "
                        + task.getTitle()
                        + " changed status to "
                        + task.getStatus());
    }
}
