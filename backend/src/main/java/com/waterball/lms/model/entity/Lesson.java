package com.waterball.lms.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lessons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lesson extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LessonType type;

    @Column(name = "video_url")
    private String videoUrl;

    @Column(name = "video_duration")
    private Integer videoDuration; // 影片長度 (秒)

    @Column(columnDefinition = "TEXT")
    private String content; // 文章內容或其他內容

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    @Column(name = "is_published", nullable = false)
    private Boolean isPublished = true;

    @Column(name = "experience_reward", nullable = false)
    private Integer experienceReward = 200; // 完成後獲得的經驗值

    public enum LessonType {
        VIDEO,      // 影片
        ARTICLE,    // 文章
        QUIZ        // 問卷
    }
}
