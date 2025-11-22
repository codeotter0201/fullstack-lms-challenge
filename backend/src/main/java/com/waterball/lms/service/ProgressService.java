package com.waterball.lms.service;

import com.waterball.lms.model.dto.ProgressSubmitRequest;
import com.waterball.lms.model.dto.ProgressUpdateRequest;
import com.waterball.lms.model.dto.UserDTO;
import com.waterball.lms.model.entity.Lesson;
import com.waterball.lms.model.entity.Progress;
import com.waterball.lms.model.entity.User;
import com.waterball.lms.repository.LessonRepository;
import com.waterball.lms.repository.ProgressRepository;
import com.waterball.lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final ProgressRepository progressRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;
    private final ExperienceService experienceService;

    @Transactional
    public Map<String, Object> updateProgress(String userEmail, ProgressUpdateRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found"));

        // 檢查權限
        if (lesson.getCourse().getIsPremium() && !user.getIsPremium()) {
            throw new IllegalArgumentException("Premium lesson requires subscription");
        }

        // 查詢或建立進度
        Progress progress = progressRepository.findByUserIdAndLessonId(user.getId(), lesson.getId())
                .orElseGet(() -> {
                    Progress newProgress = new Progress();
                    newProgress.setUser(user);
                    newProgress.setLesson(lesson);
                    return newProgress;
                });

        // 更新進度
        progress.updateProgress(request.getPosition(), request.getDuration());
        progressRepository.save(progress);

        return Map.of(
                "lessonId", lesson.getId(),
                "progressPercentage", progress.getProgressPercentage(),
                "lastPosition", progress.getLastPosition(),
                "isCompleted", progress.getIsCompleted(),
                "isSubmitted", progress.getIsSubmitted()
        );
    }

    @Transactional
    public Map<String, Object> submitLesson(String userEmail, ProgressSubmitRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found"));

        Progress progress = progressRepository.findByUserIdAndLessonId(user.getId(), lesson.getId())
                .orElseThrow(() -> new IllegalArgumentException("Please complete the lesson first"));

        // 交付單元並獲得經驗值
        boolean success = progress.submit(lesson.getExperienceReward());

        if (!success) {
            if (progress.getIsSubmitted()) {
                throw new IllegalArgumentException("Lesson already submitted");
            } else {
                throw new IllegalArgumentException("Lesson not completed yet");
            }
        }

        progressRepository.save(progress);

        // 增加經驗值並處理升級
        UserDTO updatedUser = experienceService.addExperience(user, progress.getExperienceGained());

        return Map.of(
                "lessonId", lesson.getId(),
                "experienceGained", progress.getExperienceGained(),
                "isSubmitted", progress.getIsSubmitted(),
                "user", updatedUser
        );
    }
}
