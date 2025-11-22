package com.waterball.lms.model.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProgressUpdateRequest {

    @NotNull(message = "Lesson ID is required")
    private Long lessonId;

    @NotNull(message = "Position is required")
    @Min(value = 0, message = "Position must be >= 0")
    private Integer position; // 當前播放位置 (秒)

    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be > 0")
    private Integer duration; // 影片總長度 (秒)
}
