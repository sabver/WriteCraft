// spec: 005-light-dark-mode §T18 — E2E theme journeys
// Cases: switch light↔dark, persist across navigation, persist across reload, first-visit default.
//
// NOTE: Playwright creates a fresh browser context (empty localStorage) for each test by default.
// Do NOT use page.addInitScript() to clear localStorage — it fires on every navigation within
// the test, wiping the theme preference before the next page loads and breaking persistence tests.
// Instead, use page.evaluate() + page.reload() when a test needs to pre-seed a value.

import { test, expect } from '@playwright/test';

test.describe('Theme E2E journeys', () => {
  // -------------------------------------------------------------------------
  // Case 1: Switch light ↔ dark
  // -------------------------------------------------------------------------

  test('switch from light to dark updates <html class>', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /dark/i }).click();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('switch from dark back to light removes dark class', async ({ page }) => {
    // Pre-seed dark via evaluate + reload (addInitScript would re-run on every nav).
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('writecraft-theme', 'dark'));
    await page.reload();

    await page.getByRole('button', { name: /light/i }).click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  // -------------------------------------------------------------------------
  // Case 2: Persist across navigation
  // -------------------------------------------------------------------------

  test('dark theme persists when navigating to /history', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /dark/i }).click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    await page.goto('/history');
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('dark theme persists when navigating to /daily', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /dark/i }).click();

    await page.goto('/daily');
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  // -------------------------------------------------------------------------
  // Case 3: Persist across reload
  // -------------------------------------------------------------------------

  test('dark theme survives a full page reload', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /dark/i }).click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    await page.reload();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('light theme survives a full page reload after explicit switch from dark', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('writecraft-theme', 'dark'));
    await page.reload();

    await page.getByRole('button', { name: /light/i }).click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);

    await page.reload();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  // -------------------------------------------------------------------------
  // Case 4: First-visit default
  // -------------------------------------------------------------------------

  test('first visit with no saved preference defaults to light', async ({ page }) => {
    // Fresh context → empty localStorage → system preference is light (Playwright default).
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('first visit with system dark preference defaults to dark', async ({ browser }) => {
    const context = await browser.newContext({
      colorScheme: 'dark',
      storageState: { cookies: [], origins: [] },
    });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass(/dark/);
    await context.close();
  });
});
