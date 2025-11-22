package com.waterball.lms.repository;

import com.waterball.lms.model.entity.Progress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {

    Optional<Progress> findByUserIdAndLessonId(Long userId, Long lessonId);

    List<Progress> findByUserId(Long userId);

    List<Progress> findByUserIdAndLessonCourseId(Long userId, Long courseId);
}
