package com.waterball.lms.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @deprecated Use LoginRequest instead
 */
@Deprecated
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequest {
    private String idToken;
}
