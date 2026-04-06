package com.edutech.car_rental_management_system.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:YOUR_EMAIL@gmail.com}")
    private String from;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpEmail(String to, String subject, String otp, String purposeText) {
        String html = buildHtml(otp, purposeText);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }

    private String buildHtml(String otp, String purposeText) {
        return "<div style='font-family:Arial,sans-serif;max-width:520px;margin:auto;border:1px solid #eee;border-radius:12px;overflow:hidden'>"
                + "<div style='background:#111827;color:#fff;padding:16px 18px'>"
                + "<h2 style='margin:0;font-size:18px'>Your OTP Code</h2>"
                + "</div>"
                + "<div style='padding:18px'>"
                + "<p style='margin:0 0 10px 0'>Use this OTP for: <b>" + purposeText + "</b></p>"
                + "<div style='font-size:28px;letter-spacing:6px;font-weight:700;background:#F3F4F6;padding:14px;text-align:center;border-radius:10px'>"
                + otp
                + "</div>"
                + "<p style='margin:12px 0 0 0;color:#6B7280;font-size:12px'>Do not share this OTP with anyone.</p>"
                + "</div>"
                + "</div>";
    }
}