package com.waterball.lms.model.dto;

import com.waterball.lms.model.entity.Lesson;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonDTO {

    private Long id;
    private Long courseId;
    private String title;
    private String description;
    private String type;
    private String videoUrl;
    private Integer videoDuration;
    private String content;
    private Integer displayOrder;
    private Integer experienceReward;

    // 進度相關 (從 Progress 查詢後填入)
    private Integer progressPercentage;
    private Integer lastPosition;
    private Boolean isCompleted;
    private Boolean isSubmitted;

    public static LessonDTO from(Lesson lesson) {
        return from(lesson, true);
    }

    public static LessonDTO from(Lesson lesson, boolean includeVideoInfo) {
        return LessonDTO.builder()
                .id(lesson.getId())
                .courseId(lesson.getCourse().getId())
                .title(lesson.getTitle())
                .description(lesson.getDescription())
                .type(lesson.getType().name())
                .videoUrl(includeVideoInfo ? lesson.getVideoUrl() : null)
                .videoDuration(includeVideoInfo ? lesson.getVideoDuration() : null)
                .content(lesson.getContent())
                .displayOrder(lesson.getDisplayOrder())
                .experienceReward(lesson.getExperienceReward())
                .build();
    }
}
