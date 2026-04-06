package com.edutech.car_rental_management_system.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;

import java.util.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

   private static final String GROQ_API_KEY = "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"; // ⚠️ REPLACE THIS
   private static final String GROQ_URL     = "https://api.groq.com/openai/v1/chat/completions";
   private static final String MODEL        = "llama-3.3-70b-versatile";

    private static final String SYSTEM_PROMPT =
        "You are NOVA, a friendly assistant for CarRental — a car rental management system. " +
        "Help customers with: booking cars, driving license format (DL-XXXXXX e.g. DL-987654), " +
        "booking status (Pending/Booked/Completed), payment status (Unpaid/Paid — payment done by agent after confirmation), " +
        "viewing booking history on My Bookings page. " +
        "Booking flow: Browse Cars → Verify Driving License → Select Dates → Confirm Booking. " +
        "Keep responses short, friendly, max 3-4 sentences. Use emojis occasionally. " +
        "Only answer car rental related questions. If asked something else, politely redirect.";

    @PostMapping("/message")
    public ResponseEntity<Map<String, Object>> sendMessage(@RequestBody Map<String, Object> payload) {

        try {
            RestTemplate restTemplate = new RestTemplate();

            List<Map<String, String>> incomingMessages =
                (List<Map<String, String>>) payload.get("messages");

            List<Map<String, String>> groqMessages = new ArrayList<>();

            Map<String, String> systemMsg = new HashMap<>();
            systemMsg.put("role", "system");
            systemMsg.put("content", SYSTEM_PROMPT);
            groqMessages.add(systemMsg);

            if (incomingMessages != null) {
                groqMessages.addAll(incomingMessages);
            }

            Map<String, Object> groqPayload = new HashMap<>();
            groqPayload.put("model", MODEL);
            groqPayload.put("messages", groqMessages);
            groqPayload.put("max_tokens", 500);
            groqPayload.put("temperature", 0.7);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + GROQ_API_KEY);

            HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(groqPayload, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                GROQ_URL, request, Map.class
            );

            Map<String, Object> body = response.getBody();
            List<Map<String, Object>> choices =
                (List<Map<String, Object>>) body.get("choices");

            Map<String, Object> message =
                (Map<String, Object>) choices.get(0).get("message");

            String content = (String) message.get("content");

            // ✅ RETURN PROPER JSON
            Map<String, Object> result = new HashMap<>();
            List<Map<String, String>> contentList = new ArrayList<>();

            Map<String, String> textObj = new HashMap<>();
            textObj.put("text", content);

            contentList.add(textObj);
            result.put("content", contentList);

            return ResponseEntity.ok(result);

        } catch (HttpClientErrorException e) {
            System.err.println("Groq Client Error: " + e.getResponseBodyAsString());

            return ResponseEntity.status(e.getStatusCode())
                .body(Map.of("content", List.of(Map.of("text", "Client error 😕"))));

        } catch (HttpServerErrorException e) {
            System.err.println("Groq Server Error: " + e.getResponseBodyAsString());

            return ResponseEntity.status(e.getStatusCode())
                .body(Map.of("content", List.of(Map.of("text", "Server error 😔"))));

        } catch (Exception e) {
            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("content", List.of(Map.of("text", "Something went wrong 🚨"))));
        }
    }
}

//demo