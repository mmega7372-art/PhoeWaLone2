package com.example.demo.controller; // Adjust package name to match your project

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // ----------------------------------------------------
    // GET Endpoint: Fetch progress for writing_courses.html
    // ----------------------------------------------------
    @GetMapping("/writing")
    public ResponseEntity<Map<String, Object>> getWritingProgress(@RequestParam("transaction_id") Long transactionId) {
        String sql = "SELECT item_key FROM user_progress WHERE transaction_id = ? AND module_name = 'WRITING' AND is_completed = 1";
        List<String> completedCourseKeys = jdbcTemplate.queryForList(sql, String.class, transactionId);

        int totalCourses = 8;
        int completedCount = completedCourseKeys.size();
        int progressPercentage = (int) Math.round(((double) completedCount / totalCourses) * 100);

        Map<String, Object> response = new HashMap<>();
        response.put("completedCourses", completedCourseKeys);
        response.put("percentage", progressPercentage);

        return ResponseEntity.ok(response);
    }

    // ----------------------------------------------------
    // PASTE YOUR POST METHOD HERE (Saves completion from alphabet.html)
    // ----------------------------------------------------
    @PostMapping("/complete-course")
    public ResponseEntity<Map<String, Object>> completeCourse(@RequestBody Map<String, Object> payload) {
        Long transactionId = Long.valueOf(payload.get("transactionId").toString());
        String courseKey = payload.get("courseKey").toString(); // e.g., 'COURSE_1'

        // Insert or update DB record
        String sql = "INSERT INTO user_progress (transaction_id, module_name, item_key, is_completed) " +
                     "VALUES (?, 'WRITING', ?, 1) " +
                     "ON DUPLICATE KEY UPDATE is_completed = 1";
                     
        jdbcTemplate.update(sql, transactionId, courseKey);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("completedCourse", courseKey);

        return ResponseEntity.ok(response);
    }
}