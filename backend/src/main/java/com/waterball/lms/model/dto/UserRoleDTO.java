package com.waterball.lms.model.dto;

import com.waterball.lms.model.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for user role information
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRoleDTO {

    private Long id;
    private String role;
    private LocalDateTime grantedAt;

    /**
     * Convert UserRole entity to DTO
     *
     * @param userRole UserRole entity
     * @return UserRoleDTO
     */
    public static UserRoleDTO from(UserRole userRole) {
        return UserRoleDTO.builder()
                .id(userRole.getId())
                .role(userRole.getRole().name())
                .grantedAt(userRole.getGrantedAt())
                .build();
    }
}
