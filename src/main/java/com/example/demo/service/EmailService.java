package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        if (mailSender == null) {
            System.out.println("⚠️ MailSender not configured. Generated OTP is: " + otp);
            return;
        }
        
        try {
            MimeMessage message = mailSender.createMimeMessage();
            // True parameter indicates multi-part configuration framework for HTML markup
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom("your-gmail-address@gmail.com"); // Match your properties username exactly
            helper.setTo(toEmail.trim());
            helper.setSubject("🔒 Phoe Wa Lone - Verification Code: " + otp);
            
            // Structured HTML string layout looks more authentic to spam filters
            String htmlContent = "<div style='font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e6ddff; border-radius: 16px; background-color: #fafdff;'>"
                    + "<h2 style='color: #7d40e7; text-align: center;'>Phoe Wa Lone Security</h2>"
                    + "<p style='font-size: 15px; color: #1a253c;'>Hello,</p>"
                    + "<p style='font-size: 14px; color: #4a4a4a; line-height: 1.5;'>We received a request to reset your password profile. Use the following security verification code to complete your verification mapping parameters:</p>"
                    + "<div style='text-align: center; margin: 30px 0;'>"
                    + "<span style='display: inline-block; padding: 14px 32px; background-color: #e6ddff; color: #7d40e7; font-size: 28px; font-weight: 800; border-radius: 12px; letter-spacing: 4px;'>" + otp + "</span>"
                    + "</div>"
                    + "<p style='font-size: 12px; color: #777777; text-align: center; border-top: 1px solid #e6ddff; padding-top: 15px; margin-top: 30px;'>This code is valid temporarily. If you did not initiate this request, please ignore this email safely.</p>"
                    + "</div>";
            
            helper.setText(htmlContent, true); // True triggers HTML body parsing engine
            mailSender.send(message);
            System.out.println("📡 HTML MimeMessage handed off cleanly to Gmail delivery hubs.");
            
        } catch (Exception e) {
            System.out.println("❌ Failed compiling or transmitting modern mime wrapper block details.");
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
}