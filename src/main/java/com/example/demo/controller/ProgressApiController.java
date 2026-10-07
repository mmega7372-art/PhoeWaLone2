package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ProgressApiController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/transaction/save")
    public ResponseEntity<?> saveTransactionProgress(@RequestBody Map<String, Object> payload) {
        String usernameOrEmail = (String) payload.get("username");
        int courseId = Integer.parseInt(payload.get("courseId").toString());
        int progressPercentage = Integer.parseInt(payload.get("progressPercentage").toString());

        try {
            // 1. Resolve the internal user 'id' using the loggedInUser string
            Integer userId = jdbcTemplate.queryForObject(
                "SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1",
                Integer.class, usernameOrEmail, usernameOrEmail
            );

            if (userId == null) {
                return ResponseEntity.badRequest().body("User session context not found in database.");
            }

            // 2. Check if a progress record already exists for this user and course
            String checkSql = "SELECT COUNT(*) FROM transaction WHERE id = ? AND course_id = ?";
            Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, userId, courseId);

            LocalDateTime now = LocalDateTime.now();

            if (count != null && count > 0) {
                // Update if the new progress is higher than what was saved previously
                String updateSql = "UPDATE transaction SET progress_percentage = ?, updated_at = ? WHERE id = ? AND course_id = ? AND progress_percentage < ?";
                jdbcTemplate.update(updateSql, progressPercentage, now, userId, courseId, progressPercentage);
            } else {
                // Insert a brand new record match matching your schema columns
                String insertSql = "INSERT INTO transaction (id, course_id, progress_percentage, created_at, updated_at) VALUES (?, ?, ?, ?, ?)";
                jdbcTemplate.update(insertSql, userId, courseId, progressPercentage, now, now);
            }

            return ResponseEntity.ok().body(Map.of("success", true, "message", "Progress updated in transaction table."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Database mapping failure: " + e.getMessage());
        }
    }

    @GetMapping("/courses/status")
    public ResponseEntity<?> getCourseStatuses(@RequestParam("username") String usernameOrEmail) {
        try {
            // Fetch progress directly from the transaction table by joining on the user's identifier
            String sql = "SELECT t.course_id, t.progress_percentage FROM transaction t " +
                         "JOIN users u ON t.id = u.id WHERE u.username = ? OR u.email = ?";
            
            var results = jdbcTemplate.queryForList(sql, usernameOrEmail, usernameOrEmail);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to retrieve progress data: " + e.getMessage());
        }
    }
}