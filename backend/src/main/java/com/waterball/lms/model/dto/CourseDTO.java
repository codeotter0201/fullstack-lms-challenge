package com.waterball.lms.model.dto;

import com.waterball.lms.model.entity.Course;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {

    private Long id;
    private String title;
    private String description;
    private String thumbnailUrl;
    private Boolean isPremium;
    private Integer totalLessons;
    private Integer displayOrder;

    public static CourseDTO from(Course course) {
        return CourseDTO.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .thumbnailUrl(course.getThumbnailUrl())
                .isPremium(course.getIsPremium())
                .totalLessons(course.getTotalLessons())
                .displayOrder(course.getDisplayOrder())
                .build();
    }
}
