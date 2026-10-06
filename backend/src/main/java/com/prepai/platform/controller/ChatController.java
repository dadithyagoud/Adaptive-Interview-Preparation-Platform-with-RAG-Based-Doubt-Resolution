package com.prepai.platform.controller;

import com.prepai.platform.dto.ChatRequest;
import com.prepai.platform.dto.ChatResponse;
import com.prepai.platform.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/ask")
    public ResponseEntity<ChatResponse> askQuestion(@Valid @RequestBody ChatRequest request) {
        ChatResponse response = chatService.processQuery(request);
        return ResponseEntity.ok(response);
    }
}
