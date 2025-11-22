package com.waterball.lms.service;

import com.waterball.lms.model.dto.UserDTO;
import com.waterball.lms.model.entity.User;
import com.waterball.lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ExperienceService {

    private final UserRepository userRepository;

    /**
     * 增加經驗值並處理升級
     */
    @Transactional
    public UserDTO addExperience(User user, int experience) {
        int currentExp = user.getExperience();
        int newExp = currentExp + experience;
        user.setExperience(newExp);

        // 計算新等級
        int newLevel = calculateLevel(newExp);
        int oldLevel = user.getLevel();

        if (newLevel > oldLevel) {
            user.setLevel(newLevel);
        }

        userRepository.save(user);

        UserDTO dto = UserDTO.from(user);

        // 如果升級,可以在這裡觸發升級通知
        if (newLevel > oldLevel) {
            // TODO: 觸發升級事件/通知
        }

        return dto;
    }

    /**
     * 根據經驗值計算等級
     * 簡單演算法: 每 1000 EXP 升 1 級
     * 可以根據需求調整為更複雜的演算法
     */
    public int calculateLevel(int experience) {
        if (experience < 0) {
            return 1;
        }

        // 每 1000 EXP 升 1 級,最低 1 級
        return Math.max(1, (experience / 1000) + 1);
    }

    /**
     * 計算升到下一級所需的經驗值
     */
    public int getExpForNextLevel(int currentLevel) {
        return currentLevel * 1000;
    }

    /**
     * 計算當前等級的進度百分比
     */
    public int getLevelProgress(int experience, int level) {
        int expForCurrentLevel = (level - 1) * 1000;
        int expForNextLevel = level * 1000;
        int expInCurrentLevel = experience - expForCurrentLevel;
        int expNeeded = expForNextLevel - expForCurrentLevel;

        if (expNeeded <= 0) {
            return 100;
        }

        return Math.min(100, (expInCurrentLevel * 100) / expNeeded);
    }
}
