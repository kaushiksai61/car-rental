package com.edutech.car_rental_management_system.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private static final String GROQ_API_KEY = "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";
    private static final String GROQ_URL     = "https://api.groq.com/openai/v1/chat/completions";
    private static final String MODEL        = "llama3-8b-8192";

    private static final String SYSTEM_PROMPT =
        "You are NOVA, a friendly assistant for CarRental — a car rental management system. " +
        "Help customers with: booking cars, driving license format (DL-XXXXXX e.g. DL-987654), " +
        "booking status (Pending/Booked/Completed), payment status (Unpaid/Paid — payment done by agent after confirmation), " +
        "viewing booking history on My Bookings page. " +
        "Booking flow: Browse Cars → Verify Driving License → Select Dates → Confirm Booking. " +
        "Keep responses short, friendly, max 3-4 sentences. Use emojis occasionally. " +
        "Only answer car rental related questions. If asked something else, politely redirect.";

    @PostMapping("/message")
    public ResponseEntity<String> sendMessage(@RequestBody Map<String, Object> payload) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            List<Map<String, String>> incomingMessages =
                (List<Map<String, String>>) payload.get("messages");

            // Build messages with system prompt first
            List<Map<String, String>> groqMessages = new ArrayList<>();

            Map<String, String> systemMsg = new HashMap<>();
            systemMsg.put("role",    "system");
            systemMsg.put("content", SYSTEM_PROMPT);
            groqMessages.add(systemMsg);

            if (incomingMessages != null) {
                groqMessages.addAll(incomingMessages);
            }

            // Build Groq request payload
            Map<String, Object> groqPayload = new HashMap<>();
            groqPayload.put("model",       MODEL);
            groqPayload.put("messages",    groqMessages);
            groqPayload.put("max_tokens",  500);
            groqPayload.put("temperature", 0.7);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + GROQ_API_KEY);

            HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(groqPayload, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                GROQ_URL, request, Map.class
            );

            // Extract text from Groq response
            Map<String, Object> body    = response.getBody();
            List<Map<String, Object>> choices =
                (List<Map<String, Object>>) body.get("choices");
            Map<String, Object> message =
                (Map<String, Object>) choices.get(0).get("message");
            String content = (String) message.get("content");

            // Return in format Angular expects
            String jsonResponse = "{\"content\": [{\"text\": \""
                + content.replace("\\", "\\\\")
                         .replace("\"", "\\\"")
                         .replace("\n", "\\n")
                         .replace("\r", "")
                + "\"}]}";

            return ResponseEntity.ok(jsonResponse);

        } catch (HttpClientErrorException e) {
            System.err.println("Groq client error: " + e.getStatusCode() + " — " + e.getResponseBodyAsString());
            return ResponseEntity
                .status(e.getStatusCode())
                .body("{\"content\": [{\"text\": \"I am having trouble right now. Please try again! 🙏\"}]}");

        } catch (HttpServerErrorException e) {
            System.err.println("Groq server error: " + e.getStatusCode() + " — " + e.getResponseBodyAsString());
            return ResponseEntity
                .status(e.getStatusCode())
                .body("{\"content\": [{\"text\": \"Service is temporarily unavailable. Please try again! 🙏\"}]}");

        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("{\"content\": [{\"text\": \"I am currently unavailable. Please try again later! 🙏\"}]}");
        }
    }
}