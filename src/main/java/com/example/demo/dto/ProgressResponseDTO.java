package com.example.demo.dto;

public class ProgressResponseDTO {
    private String status;
    private int progressPercentage;

    public ProgressResponseDTO() {}

    public ProgressResponseDTO(String status, int progressPercentage) {
        this.status = status;
        this.progressPercentage = progressPercentage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(int progressPercentage) {
        this.progressPercentage = progressPercentage;
    }
}