import { test, expect } from '@playwright/test';

test.describe('E2E tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');

    // Check that the page loads
    expect(await page.title()).toBeTruthy();

    // Add more specific assertions based on your application
    const response = await page.request.get('/');
    expect(response.ok()).toBeTruthy();
  });

  test('API endpoint responds correctly', async ({ page }) => {
    const response = await page.request.get('/api/test');

    // Adjust based on your actual endpoints and expected responses
    expect(response.status()).toBeLessThan(500);
  });
});
