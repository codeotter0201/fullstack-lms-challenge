package com.waterball.lms.model.dto;

import com.waterball.lms.model.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private Long id;
    private String email;
    private String displayName;
    private String avatarUrl;
    private String role;
    private Integer level;
    private Integer experience;
    private Boolean isPremium;

    public static UserDTO from(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().name())
                .level(user.getLevel())
                .experience(user.getExperience())
                .isPremium(user.getIsPremium())
                .build();
    }
}
