package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.username}")
    private String dbUser;

    @Value("${spring.datasource.password}")
    private String dbPass;

    // 1. READ: Return all users (including password) as JSON for the dashboard
    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<Map<String, Object>> userList = new ArrayList<>();
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            String sql = "SELECT id, username, email, password, role FROM users"; // Added password column here
            try (Connection conn = DriverManager.getConnection(dbUrl, dbUser, dbPass);
                 Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery(sql)) {
                
                while (rs.next()) {
                    Map<String, Object> user = new HashMap<>();
                    user.put("id", rs.getInt("id"));
                    user.put("username", rs.getString("username"));
                    user.put("email", rs.getString("email"));
                    user.put("password", rs.getString("password")); // Added password to response map
                    user.put("role", rs.getString("role"));
                    userList.add(user);
                }
            }
            return ResponseEntity.ok(userList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 2. CREATE: Add a new user[cite: 2]
    @PostMapping("/users/create")
    public ResponseEntity<Map<String, String>> createUser(
            @RequestParam String username,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String role) {
        
        Map<String, String> response = new HashMap<>();
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            String sql = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";
            try (Connection conn = DriverManager.getConnection(dbUrl, dbUser, dbPass);
                 PreparedStatement stmt = conn.prepareStatement(sql)) {
                
                stmt.setString(1, username.trim());
                stmt.setString(2, email.trim());
                stmt.setString(3, password);
                stmt.setString(4, role.trim());
                
                stmt.executeUpdate();
                response.put("status", "SUCCESS");
                response.put("message", "User created successfully!");
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("message", "Error creating user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 3. UPDATE: Edit existing user details (with optional password update)[cite: 2]
    @PostMapping("/users/update")
    public ResponseEntity<Map<String, String>> updateUser(
            @RequestParam int id,
            @RequestParam String username,
            @RequestParam String email,
            @RequestParam String role,
            @RequestParam(required = false) String password) {
        
        Map<String, String> response = new HashMap<>();
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            
            boolean updatePassword = (password != null && !password.trim().isEmpty());
            String sql = updatePassword 
                ? "UPDATE users SET username = ?, email = ?, role = ?, password = ? WHERE id = ?"
                : "UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?";
                
            try (Connection conn = DriverManager.getConnection(dbUrl, dbUser, dbPass);
                 PreparedStatement stmt = conn.prepareStatement(sql)) {
                
                stmt.setString(1, username.trim());
                stmt.setString(2, email.trim());
                stmt.setString(3, role.trim());
                
                if (updatePassword) {
                    stmt.setString(4, password);
                    stmt.setInt(5, id);
                } else {
                    stmt.setInt(4, id);
                }
                
                int rowsUpdated = stmt.executeUpdate();
                if (rowsUpdated > 0) {
                    response.put("status", "SUCCESS");
                    response.put("message", "User updated successfully!");
                    return ResponseEntity.ok(response);
                } else {
                    response.put("status", "FAILED");
                    response.put("message", "User not found.");
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                }
            }
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("message", "Error updating user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 4. DELETE: Remove a user by ID[cite: 2]
    @DeleteMapping("/users/delete/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable int id) {
        Map<String, String> response = new HashMap<>();
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            String sql = "DELETE FROM users WHERE id = ?";
            try (Connection conn = DriverManager.getConnection(dbUrl, dbUser, dbPass);
                 PreparedStatement stmt = conn.prepareStatement(sql)) {
                
                stmt.setInt(1, id);
                int rowsDeleted = stmt.executeUpdate();
                
                if (rowsDeleted > 0) {
                    response.put("status", "SUCCESS");
                    response.put("message", "User deleted successfully!");
                    return ResponseEntity.ok(response);
                } else {
                    response.put("status", "FAILED");
                    response.put("message", "User record not found.");
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                }
            }
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("message", "Error deleting user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
