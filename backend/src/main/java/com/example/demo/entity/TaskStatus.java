package com.example.demo.entity;

public enum TaskStatus {
    BACKLOG("Backlog"),
    TO_DO("To Do"),
    IN_PROGRESS("In Progress"),
    REVIEW("Review"),
    TESTING("Testing"),
    QC("QC"),
    COMPLETED("Completed");

    private final String frontendLabel;

    TaskStatus(String frontendLabel) {
        this.frontendLabel = frontendLabel;
    }

    public String getFrontendLabel() {
        return frontendLabel;
    }

    public static TaskStatus fromFrontendLabel(String label) {
        for (TaskStatus status : values()) {
            if (status.getFrontendLabel().equalsIgnoreCase(label)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown status label: " + label);
    }
}
