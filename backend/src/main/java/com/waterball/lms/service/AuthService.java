package com.waterball.lms.service;

import com.waterball.lms.model.dto.AuthResponse;
import com.waterball.lms.model.dto.LoginRequest;
import com.waterball.lms.model.dto.RegisterRequest;
import com.waterball.lms.model.dto.UserDTO;
import com.waterball.lms.model.entity.User;
import com.waterball.lms.repository.UserRepository;
import com.waterball.lms.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // 檢查 email 是否已存在
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // 建立新用戶
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .displayName(request.getDisplayName())
                .role(User.Role.STUDENT)
                .level(1)
                .experience(0)
                .isPremium(false)
                .build();

        user = userRepository.save(user);

        // 生成 JWT Token
        String token = jwtTokenProvider.createToken(user.getEmail(), user.getRole().name());

        return AuthResponse.of(token, UserDTO.from(user));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        // 查找用戶
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        // 驗證密碼
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        // 生成 JWT Token
        String token = jwtTokenProvider.createToken(user.getEmail(), user.getRole().name());

        return AuthResponse.of(token, UserDTO.from(user));
    }

    @Transactional(readOnly = true)
    public UserDTO getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return UserDTO.from(user);
    }
}
