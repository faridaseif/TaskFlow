package com.example.demo.pattern.observer;

import com.example.demo.entity.Task;

public interface Observer {
    void update(Task task);
}
