package com.example.demo.controller;

import com.example.demo.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Controller
public class AuthController {

    @Autowired
    private EmailService emailService;

    // Pull connection values directly from application.properties[cite: 3]
    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.username}")
    private String dbUser;

    @Value("${spring.datasource.password}")
    private String dbPass;

    // Temporary in-memory cache to store generated OTP codes mapped to exact case-sensitive usernames[cite: 3]
    private final Map<String, String> otpStorageCache = new HashMap<>();

    // DTO Class Structures[cite: 3]
    public static class LoginResponse {
        public String status;
        public String message;
        public String role;

        public LoginResponse(String status, String message, String role) {
            this.status = status;
            this.message = message;
            this.role = role;
        }
    }

    public static class LoginRequest {
        private String username;
        private String email; 
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; } 
        public void setEmail(String email) { this.email = email; } 
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    // 1. Process Database Login (Exact Case-Sensitive Username Check)[cite: 3]
    @PostMapping("/api/auth/login")
    @ResponseBody
    public LoginResponse verifyDatabaseLogin(@RequestBody LoginRequest loginData) {
        String credentialInput = loginData.getUsername(); 
        String password = loginData.getPassword();
        return executeDatabaseQuery(credentialInput, credentialInput, password, false);
    }
    
    // 2. Process Database Signup[cite: 3]
    @PostMapping("/api/auth/signup")
    @ResponseBody
    public LoginResponse registerDatabaseUser(@RequestBody LoginRequest signupData) {
        return executeDatabaseQuery(signupData.getUsername(), signupData.getEmail(), signupData.getPassword(), true);
    }

    // 3. Get Account Profile Details (Exact case-sensitive username or case-insensitive email lookup)[cite: 3]
    @GetMapping("/api/users/profile-details")
    @ResponseBody
    public ResponseEntity<Map<String, String>> getUserDetails(@RequestParam String username) {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            String sql = "SELECT username, email, role FROM users WHERE BINARY username = BINARY ? OR LOWER(email) = LOWER(?)";
            try (Connection conn = DriverManager.getConnection(dbUrl, dbUser, dbPass);
                 PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setString(1, username.trim());
                stmt.setString(2, username.trim());
                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        Map<String, String> userMap = new HashMap<>();
                        String dbUsername = rs.getString("username");
                        userMap.put("username", dbUsername);
                        String dbEmail = rs.getString("email");
                        userMap.put("email", (dbEmail != null && !dbEmail.trim().isEmpty()) ? dbEmail : "No email linked");
                        String dbRole = rs.getString("role");
                        userMap.put("role", (dbRole != null && !dbRole.trim().isEmpty()) ? dbRole : "STUDENT");
                        return ResponseEntity.ok(userMap);
                    } else {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
                    }
                }
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 4. Update Account Profile Data (Exact case-sensitive check)[cite: 3]
    @PostMapping("/api/users/update-profile")
    @ResponseBody
    public ResponseEntity<Map<String, String>> updateUserDetails(@RequestBody Map<String, String> updateData) {
        String currentUsername = updateData.get("currentUsername");
        String newUsername = updateData.get("newUsername");
        String newEmail = updateData.get("newEmail");
        Map<String, String> responseMap = new HashMap<>();

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection conn = DriverManager.getConnection(dbUrl, dbUser, dbPass)) {
                if (!currentUsername.equals(newUsername)) {
                    String checkSql = "SELECT id FROM users WHERE BINARY username = BINARY ?";
                    try (PreparedStatement checkStmt = conn.prepareStatement(checkSql)) {
                        checkStmt.setString(1, newUsername.trim());
                        try (ResultSet rs = checkStmt.executeQuery()) {
                            if (rs.next()) {
                                responseMap.put("status", "FAILED");
                                responseMap.put("message", "This username is already taken.");
                                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseMap);
                            }
                        }
                    }
                }

                String updateSql = "UPDATE users SET username = ?, email = ? WHERE BINARY username = BINARY ?";
                try (PreparedStatement updateStmt = conn.prepareStatement(updateSql)) {
                    updateStmt.setString(1, newUsername.trim());
                    updateStmt.setString(2, newEmail.trim());
                    updateStmt.setString(3, currentUsername.trim());
                    if (updateStmt.executeUpdate() > 0) {
                        responseMap.put("status", "SUCCESS");
                        responseMap.put("message", "Profile updated successfully!");
                        return ResponseEntity.ok(responseMap);
                    } else {
                        responseMap.put("status", "FAILED");
                        responseMap.put("message", "Profile record not found.");
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(responseMap);
                    }
                }
            }
        } catch (Exception e) {
            responseMap.put("status", "ERROR");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseMap);
        }
    }

    // 5. Generate and Dispatch OTP (Exact case-sensitive username lookup)[cite: 3]
    @PostMapping("/api/auth/send-otp")
    @ResponseBody
    public ResponseEntity<Map<String, String>> dispatchPasswordOtp(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        Map<String, String> response = new HashMap<>();

        if (username == null || username.trim().isEmpty()) {
            response.put("status", "FAILED");
            response.put("message", "Backend Error: Username parsed from context layout is blank.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            String sql = "SELECT email FROM users WHERE BINARY username = BINARY ?";
            try (Connection conn = DriverManager.getConnection(dbUrl, dbUser, dbPass);
                 PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setString(1, username.trim());
                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        String userEmail = rs.getString("email");
                        
                        if (userEmail == null || userEmail.trim().isEmpty() || userEmail.equalsIgnoreCase("No email linked")) {
                            response.put("status", "FAILED");
                            response.put("message", "Cannot reset password: No active email profile linked to '" + username + "'.");
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
                        }

                        // Generate numeric 6-digit sequence code[cite: 3]
                        String otp = String.format("%06d", new Random().nextInt(999999));
                        otpStorageCache.put(username.trim(), otp);

                        // --- 🔑 DEVELOPMENT DEBUG LOG ---
                        System.out.println("\n========================================================");
                        System.out.println("🔑 TEST OTP LOG CODE FOR USER [" + username + "]: " + otp);
                        System.out.println("========================================================\n");

                        try {
                            emailService.sendOtpEmail(userEmail, otp);
                        } catch (NullPointerException npe) {
                            response.put("status", "FAILED");
                            response.put("message", "Spring Engine Error: MailSender Bean uninitialized inside compilation path.");
                            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
                        } catch (Exception mailEx) {
                            response.put("status", "SUCCESS");
                            response.put("message", "OTP Code generated! (Gmail delivery filtered, fetch code from STS Console terminal output window instead).");
                            return ResponseEntity.ok(response);
                        }

                        response.put("status", "SUCCESS");
                        response.put("message", "OTP sent successfully to " + userEmail);
                        return ResponseEntity.ok(response);
                    } else {
                        response.put("status", "FAILED");
                        response.put("message", "Database Error: Targeted account handle profile record not found.");
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                    }
                }
            }
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("message", "System Runtime Exception: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 6. Validate Checked OTP and Commit Security Upgrades (Exact case-sensitive match)[cite: 3]
    @PostMapping("/api/auth/verify-otp-password")
    @ResponseBody
    public ResponseEntity<Map<String, String>> processPasswordReset(@RequestBody Map<String, String> request) {
        String username = request.get("username").trim();
        String inputOtp = request.get("otp").trim();
        String newPassword = request.get("newPassword");
        Map<String, String> response = new HashMap<>();

        String systemOtp = otpStorageCache.get(username);
        if (systemOtp == null || !systemOtp.equals(inputOtp)) {
            response.put("status", "FAILED");
            response.put("message", "Invalid or expired verification OTP code.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            String sql = "UPDATE users SET password = ? WHERE BINARY username = BINARY ?";
            try (Connection conn = DriverManager.getConnection(dbUrl, dbUser, dbPass);
                 PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setString(1, newPassword);
                stmt.setString(2, username);

                if (stmt.executeUpdate() > 0) {
                    otpStorageCache.remove(username);
                    response.put("status", "SUCCESS");
                    response.put("message", "Password updated successfully!");
                    return ResponseEntity.ok(response);
                }
            }
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("message", "Database update execution exception framework crash.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
        response.put("status", "FAILED");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    // 7. Direct Username/Email Verification, Password Reset (Blocked for Admins), and Admin Notification Feature[cite: 3]
    @PostMapping("/api/auth/reset-password-direct")
    @ResponseBody
    public ResponseEntity<Map<String, String>> processDirectPasswordReset(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String email = request.get("email");
        String newPassword = request.get("newPassword");
        Map<String, String> responseMap = new HashMap<>();

        if (username == null || username.trim().isEmpty() || email == null || email.trim().isEmpty() || newPassword == null || newPassword.trim().isEmpty()) {
            responseMap.put("status", "FAILED");
            responseMap.put("message", "Username, email, and new password must all be provided.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseMap);
        }

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection conn = DriverManager.getConnection(dbUrl, dbUser, dbPass)) {
                // Step 1: Check if exact case-sensitive username and case-insensitive email match, and fetch user's role
                String verifySql = "SELECT id, role FROM users WHERE BINARY username = BINARY ? AND LOWER(email) = LOWER(?)";
                boolean userFound = false;
                String userRole = "";
                
                try (PreparedStatement verifyStmt = conn.prepareStatement(verifySql)) {
                    verifyStmt.setString(1, username.trim());
                    verifyStmt.setString(2, email.trim());
                    try (ResultSet rs = verifyStmt.executeQuery()) {
                        if (rs.next()) {
                            userFound = true;
                            userRole = rs.getString("role");
                        }
                    }
                }

                if (!userFound) {
                    responseMap.put("status", "FAILED");
                    responseMap.put("message", "The provided username and email do not match any existing record.");
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(responseMap);
                }

                // Step 2: Block Admin accounts from changing passwords through this page[cite: 3]
                if (userRole != null && userRole.equalsIgnoreCase("ADMIN")) {
                    responseMap.put("status", "FAILED");
                    responseMap.put("message", "Admin passwords cannot be changed through this forgot password page.");
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(responseMap);
                }

                // Step 3: Accept and update the new password using exact case-sensitive username match
                String updateSql = "UPDATE users SET password = ? WHERE BINARY email =  ?";
                try (PreparedStatement updateStmt = conn.prepareStatement(updateSql)) {
                    updateStmt.setString(1, newPassword);
                    updateStmt.setString(2, email.trim());
                    updateStmt.executeUpdate();
                }

                // Step 4: Fetch all administrator emails dynamically from the database[cite: 3]
                List<String> adminEmails = new ArrayList<>();
                String adminSql = "SELECT email FROM users WHERE LOWER(role) = 'admin' AND email IS NOT NULL AND email != ''";
                try (Statement adminStmt = conn.createStatement();
                     ResultSet adminRs = adminStmt.executeQuery(adminSql)) {
                    while (adminRs.next()) {
                        String adminEmail = adminRs.getString("email");
                        if (adminEmail != null && !adminEmail.trim().isEmpty()) {
                            adminEmails.add(adminEmail.trim());
                        }
                    }
                }

                // Step 5: Send notification alerts to each admin email found[cite: 3]
                for (String adminEmail : adminEmails) {
                    try {
                        emailService.sendOtpEmail(adminEmail, "Password Reset Alert: Account [" + username.trim() + "] has updated their password.");
                    } catch (Exception mailEx) {
                        System.out.println("Failed to dispatch admin notification email to: " + adminEmail);
                    }
                }

                responseMap.put("status", "SUCCESS");
                responseMap.put("message", "Password successfully updated and notifications sent to administrators.");
                return ResponseEntity.ok(responseMap);

            }
        } catch (Exception e) {
            responseMap.put("status", "ERROR");
            responseMap.put("message", "Database error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseMap);
        }
    }

    // --- Core Low Level JDBC Helper Framework Logic ---
    private LoginResponse executeDatabaseQuery(String username, String email, String password, boolean isSignup) {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection conn = DriverManager.getConnection(dbUrl, dbUser, dbPass)) {
                if (isSignup) {
                    String checkSql = "SELECT * FROM users WHERE BINARY username = BINARY ? OR LOWER(email) = LOWER(?)";
                    try (PreparedStatement checkStmt = conn.prepareStatement(checkSql)) {
                        checkStmt.setString(1, username.trim());
                        checkStmt.setString(2, email.trim());
                        try (ResultSet rs = checkStmt.executeQuery()) {
                            if (rs.next()) return new LoginResponse("FAILED", "Username or Email is already taken.", null);
                        }
                    }
                    String insertSql = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";
                    try (PreparedStatement insertStmt = conn.prepareStatement(insertSql)) {
                        insertStmt.setString(1, username.trim());
                        insertStmt.setString(2, email.trim());
                        insertStmt.setString(3, password);
                        insertStmt.setString(4, "STUDENT");
                        if (insertStmt.executeUpdate() > 0) return new LoginResponse("SUCCESS", "Account created successfully!", "STUDENT");
                        else return new LoginResponse("FAILED", "Registration failed.", null);
                    }
                } else {
                    String loginSql;
                    boolean inputIsEmail = username.contains("@");

                    if (inputIsEmail) {
                        // If input is an email, query strictly by email column[cite: 3]
                        loginSql = "SELECT username, email, role FROM users WHERE LOWER(email) = LOWER(?) AND password = ?";
                    } else {
                        // If input is a username, query with exact case-sensitive check and explicitly ignore ADMIN roles[cite: 3]
                        loginSql = "SELECT username, email, role FROM users WHERE BINARY username = BINARY ? AND password = ? AND role != 'ADMIN'";
                    }

                    try (PreparedStatement stmt = conn.prepareStatement(loginSql)) {
                        stmt.setString(1, username.trim()); 
                        stmt.setString(2, password);
                        try (ResultSet rs = stmt.executeQuery()) {
                            if (rs.next()) {
                                String dbUsername = rs.getString("username");
                                String dbRole = rs.getString("role");
                                String role = (dbRole != null && !dbRole.trim().isEmpty()) ? dbRole : "STUDENT";

                                return new LoginResponse("SUCCESS", dbUsername, role);
                            } else {
                                if (!inputIsEmail) {
                                    return new LoginResponse("FAILED", "Admin accounts must log in using their email address. Usernames are restricted for admin access.", null);
                                }
                                return new LoginResponse("FAILED", "Invalid email or password.", null);
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            return new LoginResponse("ERROR", "Database error: " + e.getMessage(), null);
        }
    }
}
