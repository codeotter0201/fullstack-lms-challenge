package com.waterball.lms.controller;

import com.waterball.lms.model.dto.AuthResponse;
import com.waterball.lms.model.dto.LoginRequest;
import com.waterball.lms.model.dto.RegisterRequest;
import com.waterball.lms.model.dto.UserDTO;
import com.waterball.lms.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "認證相關 API")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "註冊新用戶", description = "使用 email 和密碼註冊新帳號")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    @Operation(summary = "用戶登入", description = "使用 email 和密碼登入")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @Operation(summary = "取得當前用戶資訊", description = "需要 JWT Token")
    public ResponseEntity<UserDTO> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        UserDTO user = authService.getCurrentUser(email);
        return ResponseEntity.ok(user);
    }
}
