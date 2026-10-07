package com.example.demo.repository;

import com.example.demo.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> {
    // Counts how many total lessons/rows exist under a specific level (0, 1, 2, etc.)
    long countByCourseLevel(Integer courseLevel);
}