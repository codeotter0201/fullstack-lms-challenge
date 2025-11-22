package com.waterball.lms.model.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProgressSubmitRequest {

    @NotNull(message = "Lesson ID is required")
    private Long lessonId;
}
