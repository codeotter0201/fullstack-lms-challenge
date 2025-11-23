package com.waterball.lms.service;

import com.waterball.lms.model.dto.CourseDTO;
import com.waterball.lms.model.dto.LessonDTO;
import com.waterball.lms.model.entity.Course;
import com.waterball.lms.model.entity.Lesson;
import com.waterball.lms.model.entity.Progress;
import com.waterball.lms.model.entity.User;
import com.waterball.lms.repository.CourseRepository;
import com.waterball.lms.repository.LessonRepository;
import com.waterball.lms.repository.ProgressRepository;
import com.waterball.lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final ProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final PurchaseService purchaseService;

    @Transactional(readOnly = true)
    public List<CourseDTO> getAllCourses(String userEmail) {
        // Public API - guests can view all published courses
        List<Course> courses = courseRepository.findAllByIsPublishedTrueOrderByDisplayOrderAsc();

        return courses.stream()
                .map(CourseDTO::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CourseDTO getCourse(Long courseId, String userEmail) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        // Public API - guests can view course info (just no video URLs in lessons)
        return CourseDTO.from(course);
    }

    @Transactional(readOnly = true)
    public List<LessonDTO> getCourseLessons(Long courseId, String userEmail) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        // Check if user has access to video content
        boolean hasAccess = false;
        Long userId = null;
        if (userEmail != null) {
            User user = userRepository.findByEmail(userEmail).orElse(null);
            if (user != null) {
                userId = user.getId();
                hasAccess = purchaseService.hasAccess(userId, courseId);
            }
        }

        List<Lesson> lessons = lessonRepository.findByCourseIdAndIsPublishedTrueOrderByDisplayOrderAsc(courseId);

        // 查詢用戶的進度 (only if authenticated)
        Map<Long, Progress> progressMap = Map.of();
        if (userId != null) {
            List<Progress> progressList = progressRepository.findByUserIdAndLessonCourseId(userId, courseId);
            progressMap = progressList.stream()
                    .collect(Collectors.toMap(p -> p.getLesson().getId(), p -> p));
        }

        final Map<Long, Progress> finalProgressMap = progressMap;
        final boolean includeVideoInfo = hasAccess;

        return lessons.stream()
                .map(lesson -> {
                    LessonDTO dto = LessonDTO.from(lesson, includeVideoInfo);
                    Progress progress = finalProgressMap.get(lesson.getId());
                    if (progress != null) {
                        dto.setProgressPercentage(progress.getProgressPercentage());
                        dto.setLastPosition(progress.getLastPosition());
                        dto.setIsCompleted(progress.getIsCompleted());
                        dto.setIsSubmitted(progress.getIsSubmitted());
                    } else {
                        dto.setProgressPercentage(0);
                        dto.setLastPosition(0);
                        dto.setIsCompleted(false);
                        dto.setIsSubmitted(false);
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LessonDTO getLesson(Long lessonId, String userEmail) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found"));

        Course course = lesson.getCourse();

        // Check if user has access to video content
        boolean hasAccess = false;
        Long userId = null;
        if (userEmail != null) {
            User user = userRepository.findByEmail(userEmail).orElse(null);
            if (user != null) {
                userId = user.getId();
                hasAccess = purchaseService.hasAccess(userId, course.getId());
            }
        }

        LessonDTO dto = LessonDTO.from(lesson, hasAccess);

        // 查詢進度 (only if authenticated)
        if (userId != null) {
            Progress progress = progressRepository.findByUserIdAndLessonId(userId, lessonId)
                    .orElse(null);

            if (progress != null) {
                dto.setProgressPercentage(progress.getProgressPercentage());
                dto.setLastPosition(progress.getLastPosition());
                dto.setIsCompleted(progress.getIsCompleted());
                dto.setIsSubmitted(progress.getIsSubmitted());
            } else {
                dto.setProgressPercentage(0);
                dto.setLastPosition(0);
                dto.setIsCompleted(false);
                dto.setIsSubmitted(false);
            }
        } else {
            dto.setProgressPercentage(0);
            dto.setLastPosition(0);
            dto.setIsCompleted(false);
            dto.setIsSubmitted(false);
        }

        return dto;
    }
}
