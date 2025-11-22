package com.waterball.lms.repository;

import com.waterball.lms.model.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findAllByIsPublishedTrueOrderByDisplayOrderAsc();

    List<Course> findAllByIsPremiumAndIsPublishedTrueOrderByDisplayOrderAsc(Boolean isPremium);
}
