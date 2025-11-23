import { test, expect } from '@playwright/test';
import { loginAsFreeUser } from '../../helpers/auth-helpers';
import { purchaseCourse, checkAccess } from '../../helpers/purchase-helpers';
import { getUserProfile } from '../../helpers/api-helpers';
import { getPaidCourse } from '../../fixtures/test-courses';

test.describe('Role Separation - Purchase Does Not Change User Role', () => {
  test('purchasing course does not upgrade user role', async ({ page }) => {
    await loginAsFreeUser(page);

    // Get user profile before purchase
    const userBefore = await getUserProfile(page);

    // Verify user is a free user
    expect(userBefore.isPremium).toBe(false);

    // Purchase a paid course
    const paidCourse = getPaidCourse(0);
    await purchaseCourse(page, paidCourse.id);

    // Get user profile after purchase
    const userAfter = await getUserProfile(page);

    // Verify role has NOT changed
    expect(userAfter.isPremium).toBe(false);
    expect(userAfter.isPremium).toBe(userBefore.isPremium);

    // But user DOES have access to the purchased course
    const hasAccess = await checkAccess(page, paidCourse.id);
    expect(hasAccess).toBe(true);
  });

  test('free user remains free user after multiple purchases', async ({ page }) => {
    await loginAsFreeUser(page);

    // Purchase multiple courses
    const course1 = getPaidCourse(0);
    const course2 = getPaidCourse(1);

    await purchaseCourse(page, course1.id);
    await purchaseCourse(page, course2.id);

    // Verify user role is still free
    const user = await getUserProfile(page);
    expect(user.isPremium).toBe(false);

    // But has access to both purchased courses
    expect(await checkAccess(page, course1.id)).toBe(true);
    expect(await checkAccess(page, course2.id)).toBe(true);
  });

  test('user role and course access are independent', async ({ page }) => {
    await loginAsFreeUser(page);

    const paidCourse = getPaidCourse(0);

    // Before purchase
    const userBefore = await getUserProfile(page);
    const accessBefore = await checkAccess(page, paidCourse.id);

    expect(userBefore.isPremium).toBe(false);
    expect(accessBefore).toBe(false);

    // After purchase
    await purchaseCourse(page, paidCourse.id);

    const userAfter = await getUserProfile(page);
    const accessAfter = await checkAccess(page, paidCourse.id);

    // Role unchanged, but access granted
    expect(userAfter.isPremium).toBe(userBefore.isPremium);
    expect(accessAfter).toBe(true);
  });
});
