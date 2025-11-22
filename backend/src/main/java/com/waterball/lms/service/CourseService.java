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

    @Transactional(readOnly = true)
    public List<CourseDTO> getAllCourses(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Course> courses;
        if (user.getIsPremium()) {
            // 付費用戶可以看到所有課程
            courses = courseRepository.findAllByIsPublishedTrueOrderByDisplayOrderAsc();
        } else {
            // 免費用戶只能看到免費課程
            courses = courseRepository.findAllByIsPremiumAndIsPublishedTrueOrderByDisplayOrderAsc(false);
        }

        return courses.stream()
                .map(CourseDTO::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CourseDTO getCourse(Long courseId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        // 檢查權限
        if (course.getIsPremium() && !user.getIsPremium()) {
            throw new IllegalArgumentException("Premium course requires subscription");
        }

        return CourseDTO.from(course);
    }

    @Transactional(readOnly = true)
    public List<LessonDTO> getCourseLessons(Long courseId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        // 檢查權限
        if (course.getIsPremium() && !user.getIsPremium()) {
            throw new IllegalArgumentException("Premium course requires subscription");
        }

        List<Lesson> lessons = lessonRepository.findByCourseIdAndIsPublishedTrueOrderByDisplayOrderAsc(courseId);

        // 查詢用戶的進度
        List<Progress> progressList = progressRepository.findByUserIdAndLessonCourseId(user.getId(), courseId);
        Map<Long, Progress> progressMap = progressList.stream()
                .collect(Collectors.toMap(p -> p.getLesson().getId(), p -> p));

        return lessons.stream()
                .map(lesson -> {
                    LessonDTO dto = LessonDTO.from(lesson);
                    Progress progress = progressMap.get(lesson.getId());
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
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found"));

        Course course = lesson.getCourse();

        // 檢查權限
        if (course.getIsPremium() && !user.getIsPremium()) {
            throw new IllegalArgumentException("Premium lesson requires subscription");
        }

        LessonDTO dto = LessonDTO.from(lesson);

        // 查詢進度
        Progress progress = progressRepository.findByUserIdAndLessonId(user.getId(), lessonId)
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

        return dto;
    }
}
