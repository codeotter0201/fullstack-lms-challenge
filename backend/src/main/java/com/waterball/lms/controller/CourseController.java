package com.waterball.lms.controller;

import com.waterball.lms.model.dto.CourseDTO;
import com.waterball.lms.model.dto.LessonDTO;
import com.waterball.lms.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@Tag(name = "Courses", description = "課程相關 API")
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    @Operation(summary = "取得所有課程列表", description = "公開 API - 所有人都可以瀏覽課程列表")
    public ResponseEntity<List<CourseDTO>> getAllCourses(Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        List<CourseDTO> courses = courseService.getAllCourses(email);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{courseId}")
    @Operation(summary = "取得課程詳情", description = "公開 API - 未購買用戶無法看到影片資訊")
    public ResponseEntity<CourseDTO> getCourse(
            @PathVariable Long courseId,
            Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        CourseDTO course = courseService.getCourse(courseId, email);
        return ResponseEntity.ok(course);
    }

    @GetMapping("/{courseId}/lessons")
    @Operation(summary = "取得課程的所有單元", description = "公開 API - 未購買用戶無法看到影片資訊")
    public ResponseEntity<List<LessonDTO>> getCourseLessons(
            @PathVariable Long courseId,
            Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        List<LessonDTO> lessons = courseService.getCourseLessons(courseId, email);
        return ResponseEntity.ok(lessons);
    }

    @GetMapping("/lessons/{lessonId}")
    @Operation(summary = "取得單元詳情", description = "公開 API - 未購買用戶無法看到影片資訊")
    public ResponseEntity<LessonDTO> getLesson(
            @PathVariable Long lessonId,
            Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        LessonDTO lesson = courseService.getLesson(lessonId, email);
        return ResponseEntity.ok(lesson);
    }
}
