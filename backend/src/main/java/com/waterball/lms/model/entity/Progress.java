package com.waterball.lms.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "progress", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "lesson_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Progress extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Column(name = "progress_percentage", nullable = false)
    private Integer progressPercentage = 0; // 進度百分比 0-100

    @Column(name = "last_position")
    private Integer lastPosition = 0; // 上次播放位置 (秒)

    @Column(name = "is_completed", nullable = false)
    private Boolean isCompleted = false; // 是否完成 (100%)

    @Column(name = "is_submitted", nullable = false)
    private Boolean isSubmitted = false; // 是否已交付 (點擊小圈圈)

    @Column(name = "experience_gained", nullable = false)
    private Integer experienceGained = 0; // 已獲得的經驗值

    // 更新進度
    public void updateProgress(int position, int duration) {
        this.lastPosition = position;
        if (duration > 0) {
            this.progressPercentage = Math.min(100, (position * 100) / duration);
            this.isCompleted = this.progressPercentage >= 100;
        }
    }

    // 交付單元並獲得經驗值
    public boolean submit(int experienceReward) {
        if (!isSubmitted && isCompleted) {
            this.isSubmitted = true;
            this.experienceGained = experienceReward;
            return true;
        }
        return false;
    }
}
