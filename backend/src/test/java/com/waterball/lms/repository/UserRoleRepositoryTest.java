package com.waterball.lms.repository;

import com.waterball.lms.model.entity.User;
import com.waterball.lms.model.entity.UserRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Repository tests for UserRole
 */
@DataJpaTest
@ActiveProfiles("test")
class UserRoleRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRoleRepository userRoleRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        // Create test user
        testUser = User.builder()
                .email("test@example.com")
                .password("password")
                .displayName("Test User")
                .build();
        entityManager.persist(testUser);
        entityManager.flush();
    }

    @Test
    void shouldSaveUserRole() {
        // Given
        UserRole role = UserRole.builder()
                .user(testUser)
                .role(UserRole.UserRoleType.FREE)
                .grantedAt(LocalDateTime.now())
                .build();

        // When
        UserRole saved = userRoleRepository.save(role);

        // Then
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getUser().getId()).isEqualTo(testUser.getId());
        assertThat(saved.getRole()).isEqualTo(UserRole.UserRoleType.FREE);
    }

    @Test
    void shouldFindRolesByUserId() {
        // Given
        UserRole freeRole = UserRole.builder()
                .user(testUser)
                .role(UserRole.UserRoleType.FREE)
                .grantedAt(LocalDateTime.now())
                .build();
        UserRole paidRole = UserRole.builder()
                .user(testUser)
                .role(UserRole.UserRoleType.PAID)
                .grantedAt(LocalDateTime.now())
                .build();
        entityManager.persist(freeRole);
        entityManager.persist(paidRole);
        entityManager.flush();

        // When
        List<UserRole> roles = userRoleRepository.findByUserId(testUser.getId());

        // Then
        assertThat(roles).hasSize(2);
        assertThat(roles)
                .extracting(UserRole::getRole)
                .containsExactlyInAnyOrder(
                        UserRole.UserRoleType.FREE,
                        UserRole.UserRoleType.PAID
                );
    }

    @Test
    void shouldCheckIfUserHasSpecificRole() {
        // Given
        UserRole freeRole = UserRole.builder()
                .user(testUser)
                .role(UserRole.UserRoleType.FREE)
                .grantedAt(LocalDateTime.now())
                .build();
        entityManager.persist(freeRole);
        entityManager.flush();

        // When
        boolean hasFreeRole = userRoleRepository.existsByUserIdAndRole(
                testUser.getId(), UserRole.UserRoleType.FREE);
        boolean hasPaidRole = userRoleRepository.existsByUserIdAndRole(
                testUser.getId(), UserRole.UserRoleType.PAID);

        // Then
        assertThat(hasFreeRole).isTrue();
        assertThat(hasPaidRole).isFalse();
    }

    @Test
    void shouldSupportMultipleRolesPerUser() {
        // Given
        UserRole studentRole = UserRole.builder()
                .user(testUser)
                .role(UserRole.UserRoleType.FREE)
                .grantedAt(LocalDateTime.now())
                .build();
        UserRole teacherRole = UserRole.builder()
                .user(testUser)
                .role(UserRole.UserRoleType.TEACHER)
                .grantedAt(LocalDateTime.now())
                .build();
        UserRole adminRole = UserRole.builder()
                .user(testUser)
                .role(UserRole.UserRoleType.ADMIN)
                .grantedAt(LocalDateTime.now())
                .build();

        // When
        entityManager.persist(studentRole);
        entityManager.persist(teacherRole);
        entityManager.persist(adminRole);
        entityManager.flush();

        List<UserRole> roles = userRoleRepository.findByUserId(testUser.getId());

        // Then
        assertThat(roles).hasSize(3);
        assertThat(roles)
                .extracting(UserRole::getRole)
                .containsExactlyInAnyOrder(
                        UserRole.UserRoleType.FREE,
                        UserRole.UserRoleType.TEACHER,
                        UserRole.UserRoleType.ADMIN
                );
    }

    @Test
    void shouldPreventDuplicateRoleAssignment() {
        // Given
        UserRole role1 = UserRole.builder()
                .user(testUser)
                .role(UserRole.UserRoleType.FREE)
                .grantedAt(LocalDateTime.now())
                .build();
        entityManager.persist(role1);
        entityManager.flush();

        // When/Then - Attempting to assign same role twice should fail
        UserRole duplicate = UserRole.builder()
                .user(testUser)
                .role(UserRole.UserRoleType.FREE)
                .grantedAt(LocalDateTime.now())
                .build();

        try {
            entityManager.persist(duplicate);
            entityManager.flush();
            // Should throw exception due to unique constraint
            assertThat(false).isTrue(); // Fail if no exception thrown
        } catch (Exception e) {
            // Expected - unique constraint violation
            assertThat(e).isNotNull();
        }
    }

    @Test
    void shouldDeleteSpecificRole() {
        // Given
        UserRole freeRole = UserRole.builder()
                .user(testUser)
                .role(UserRole.UserRoleType.FREE)
                .grantedAt(LocalDateTime.now())
                .build();
        UserRole paidRole = UserRole.builder()
                .user(testUser)
                .role(UserRole.UserRoleType.PAID)
                .grantedAt(LocalDateTime.now())
                .build();
        entityManager.persist(freeRole);
        entityManager.persist(paidRole);
        entityManager.flush();

        // When
        userRoleRepository.deleteByUserIdAndRole(
                testUser.getId(), UserRole.UserRoleType.FREE);
        entityManager.flush();

        // Then
        List<UserRole> remainingRoles = userRoleRepository.findByUserId(testUser.getId());
        assertThat(remainingRoles).hasSize(1);
        assertThat(remainingRoles.get(0).getRole()).isEqualTo(UserRole.UserRoleType.PAID);
    }
}
