-- V3: Add purchase and role management tables
-- This migration adds support for:
-- 1. Multi-role user management (user_roles table)
-- 2. Course purchase tracking (course_purchases table)
-- 3. Course pricing (courses.price column)

-- =============================================================================
-- 1. Create user_roles table
-- =============================================================================
CREATE TABLE user_roles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    role VARCHAR(20) NOT NULL,
    granted_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_roles_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_role
        UNIQUE (user_id, role),
    CONSTRAINT chk_role
        CHECK (role IN ('FREE', 'PAID', 'ADMIN', 'TEACHER'))
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);

COMMENT ON TABLE user_roles IS 'User role assignments - supports multiple roles per user';
COMMENT ON COLUMN user_roles.role IS 'Role type: FREE, PAID, ADMIN, TEACHER';
COMMENT ON COLUMN user_roles.granted_at IS 'When this role was granted to the user';

-- =============================================================================
-- 2. Create course_purchases table
-- =============================================================================
CREATE TABLE course_purchases (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    purchase_price DECIMAL(10,2) NOT NULL,
    purchase_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'COMPLETED',
    transaction_id VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_purchases_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_purchases_course
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_course_purchase
        UNIQUE (user_id, course_id),
    CONSTRAINT chk_payment_status
        CHECK (payment_status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')),
    CONSTRAINT chk_purchase_price
        CHECK (purchase_price >= 0)
);

CREATE INDEX idx_purchases_user_id ON course_purchases(user_id);
CREATE INDEX idx_purchases_course_id ON course_purchases(course_id);
CREATE INDEX idx_purchases_date ON course_purchases(purchase_date DESC);
CREATE INDEX idx_purchases_status ON course_purchases(payment_status);

COMMENT ON TABLE course_purchases IS 'Course purchase records - prevents duplicate purchases via unique constraint';
COMMENT ON COLUMN course_purchases.purchase_price IS 'Price at time of purchase (may differ from current course price)';
COMMENT ON COLUMN course_purchases.payment_status IS 'Payment status: PENDING, COMPLETED, FAILED, REFUNDED';
COMMENT ON COLUMN course_purchases.transaction_id IS 'External payment gateway transaction ID';

-- =============================================================================
-- 3. Add price column to courses table
-- =============================================================================
ALTER TABLE courses ADD COLUMN price DECIMAL(10,2) DEFAULT 0 NOT NULL;

COMMENT ON COLUMN courses.price IS 'Course price in TWD (0 for free courses)';

-- =============================================================================
-- 4. Migrate existing data: users.role -> user_roles
-- =============================================================================

-- Migrate all existing user roles to user_roles table
INSERT INTO user_roles (user_id, role, granted_at, created_at, updated_at)
SELECT
    id,
    role,
    created_at,
    created_at,
    updated_at
FROM users
WHERE role IS NOT NULL;

-- Add PAID role for all users who have is_premium=true
INSERT INTO user_roles (user_id, role, granted_at, created_at, updated_at)
SELECT
    id,
    'PAID',
    updated_at,
    NOW(),
    NOW()
FROM users
WHERE is_premium = true
ON CONFLICT (user_id, role) DO NOTHING;

-- Add FREE role for users who don't have any role yet
INSERT INTO user_roles (user_id, role, granted_at, created_at, updated_at)
SELECT
    id,
    'FREE',
    created_at,
    NOW(),
    NOW()
FROM users
WHERE id NOT IN (SELECT user_id FROM user_roles WHERE role = 'FREE')
ON CONFLICT (user_id, role) DO NOTHING;

-- =============================================================================
-- 5. Update test data: Set prices for existing courses
-- =============================================================================

-- Set prices for premium courses (based on V2 test data if exists)
UPDATE courses
SET price = CASE
    WHEN id = 1 THEN 2990.00  -- Java 入門課程
    WHEN id = 2 THEN 3990.00  -- Spring Boot 實戰
    WHEN id = 3 THEN 4990.00  -- 微服務架構
    ELSE price
END
WHERE is_premium = true;

-- Free courses remain at price = 0 (already set by default)
