package com.waterball.lms.controller;

import com.waterball.lms.model.dto.ProgressSubmitRequest;
import com.waterball.lms.model.dto.ProgressUpdateRequest;
import com.waterball.lms.service.ProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
@Tag(name = "Progress", description = "學習進度相關 API")
public class ProgressController {

    private final ProgressService progressService;

    @PostMapping("/update")
    @Operation(summary = "更新學習進度", description = "每 10 秒自動儲存影片播放進度")
    public ResponseEntity<Map<String, Object>> updateProgress(
            @Valid @RequestBody ProgressUpdateRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        Map<String, Object> result = progressService.updateProgress(email, request);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/submit")
    @Operation(summary = "交付單元", description = "完成單元後點擊小圈圈,獲得經驗值")
    public ResponseEntity<Map<String, Object>> submitLesson(
            @Valid @RequestBody ProgressSubmitRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        Map<String, Object> result = progressService.submitLesson(email, request);
        return ResponseEntity.ok(result);
    }
}
