import { test, expect } from '@playwright/test';

// Use environment variable for deployed URL, default to localhost
const BASE_URL = process.env.DEPLOYED_URL || 'http://localhost:8788';

test.describe('Kris Kringle Coordinator E2E Tests', () => {
  test('displays the main page with title and form', async ({ page }) => {
    await page.goto(BASE_URL);

    // Check title
    await expect(page).toHaveTitle(/Kris Kringle Coordinator/);

    // Check main heading
    const heading = page.locator('h1');
    await expect(heading).toContainText('Kris Kringle Coordinator');

    // Check that the input field exists
    const input = page.locator('#nameInput');
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute('placeholder', /Enter a name/);

    // Check that the Add button exists
    const addButton = page.locator('button', { hasText: 'Add' });
    await expect(addButton).toBeVisible();

    // Check that the Pretzel button exists but is disabled
    const pretzelButton = page.locator('#pretzelButton');
    await expect(pretzelButton).toBeVisible();
    await expect(pretzelButton).toContainText('Pretzel');
    await expect(pretzelButton).toBeDisabled();
  });

  test('allows adding participants', async ({ page }) => {
    await page.goto(BASE_URL);

    const input = page.locator('#nameInput');
    const addButton = page.locator('button', { hasText: 'Add' });
    const nameCount = page.locator('#nameCount');

    // Initially should have 0 participants
    await expect(nameCount).toHaveText('0');

    // Add first participant
    await input.fill('Alice');
    await addButton.click();
    await expect(nameCount).toHaveText('1');
    await expect(page.locator('text=Alice')).toBeVisible();

    // Add second participant
    await input.fill('Bob');
    await addButton.click();
    await expect(nameCount).toHaveText('2');
    await expect(page.locator('text=Bob')).toBeVisible();

    // Add third participant using Enter key
    await input.fill('Charlie');
    await input.press('Enter');
    await expect(nameCount).toHaveText('3');
    await expect(page.locator('text=Charlie')).toBeVisible();
  });

  test('prevents adding duplicate names', async ({ page }) => {
    await page.goto(BASE_URL);

    const input = page.locator('#nameInput');
    const addButton = page.locator('button', { hasText: 'Add' });

    // Add a name
    await input.fill('Alice');
    await addButton.click();

    // Try to add the same name again
    await input.fill('Alice');

    // Listen for alert dialog
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('already in the list');
      await dialog.accept();
    });

    await addButton.click();
  });

  test('allows deleting participants', async ({ page }) => {
    await page.goto(BASE_URL);

    const input = page.locator('#nameInput');
    const addButton = page.locator('button', { hasText: 'Add' });
    const nameCount = page.locator('#nameCount');

    // Add two participants
    await input.fill('Alice');
    await addButton.click();
    await input.fill('Bob');
    await addButton.click();

    await expect(nameCount).toHaveText('2');

    // Delete Alice
    const deleteButton = page.locator('button', { hasText: 'Delete' }).first();
    await deleteButton.click();

    await expect(nameCount).toHaveText('1');
    await expect(page.locator('text=Alice')).not.toBeVisible();
    await expect(page.locator('text=Bob')).toBeVisible();
  });

  test('enables Pretzel button with 2+ participants', async ({ page }) => {
    await page.goto(BASE_URL);

    const input = page.locator('#nameInput');
    const addButton = page.locator('button', { hasText: 'Add' });
    const pretzelButton = page.locator('#pretzelButton');

    // Initially disabled
    await expect(pretzelButton).toBeDisabled();

    // Add one participant - should still be disabled
    await input.fill('Alice');
    await addButton.click();
    await expect(pretzelButton).toBeDisabled();

    // Add second participant - should now be enabled
    await input.fill('Bob');
    await addButton.click();
    await expect(pretzelButton).toBeEnabled();
  });

  test('generates allocations when clicking Pretzel button', async ({ page }) => {
    await page.goto(BASE_URL);

    const input = page.locator('#nameInput');
    const addButton = page.locator('button', { hasText: 'Add' });
    const pretzelButton = page.locator('#pretzelButton');

    // Add participants
    const names = ['Alice', 'Bob', 'Charlie', 'Diana'];
    for (const name of names) {
      await input.fill(name);
      await addButton.click();
    }

    // Click Pretzel button
    await pretzelButton.click();

    // Results card should be visible
    const resultsCard = page.locator('#resultsCard');
    await expect(resultsCard).toBeVisible();

    // Should show "Secret Santa Assignments"
    await expect(page.locator('text=Secret Santa Assignments')).toBeVisible();

    // Each participant should have a result
    for (const name of names) {
      await expect(page.locator(`text=${name}`).first()).toBeVisible();
    }
  });

  test('allows revealing individual assignments', async ({ page }) => {
    await page.goto(BASE_URL);

    const input = page.locator('#nameInput');
    const addButton = page.locator('button', { hasText: 'Add' });
    const pretzelButton = page.locator('#pretzelButton');

    // Add participants
    await input.fill('Alice');
    await addButton.click();
    await input.fill('Bob');
    await addButton.click();

    // Generate allocations
    await pretzelButton.click();

    // Get the first result item button
    const firstResultButton = page.locator('.result-item button').first();

    // Initially, the receiver should be hidden
    const receiver = firstResultButton.locator('.receiver');
    await expect(receiver).toHaveClass(/hidden/);

    // Click to reveal
    await firstResultButton.click();
    await expect(receiver).not.toHaveClass(/hidden/);

    // Click again to hide
    await firstResultButton.click();
    await expect(receiver).toHaveClass(/hidden/);
  });

  test('allows starting over', async ({ page }) => {
    await page.goto(BASE_URL);

    const input = page.locator('#nameInput');
    const addButton = page.locator('button', { hasText: 'Add' });
    const pretzelButton = page.locator('#pretzelButton');
    const nameCount = page.locator('#nameCount');

    // Add participants and generate allocations
    await input.fill('Alice');
    await addButton.click();
    await input.fill('Bob');
    await addButton.click();
    await pretzelButton.click();

    // Results should be visible
    const resultsCard = page.locator('#resultsCard');
    await expect(resultsCard).toBeVisible();

    // Click "Start Over"
    const startOverButton = page.locator('button', { hasText: 'Start Over' });

    // Handle confirmation dialog
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('start over');
      await dialog.accept();
    });

    await startOverButton.click();

    // Results should be hidden and participants cleared
    await expect(resultsCard).toHaveClass(/hidden/);
    await expect(nameCount).toHaveText('0');
  });

  test('displays client-side processing message', async ({ page }) => {
    await page.goto(BASE_URL);

    // Check for the privacy message
    await expect(page.locator('text=All processing happens in your browser')).toBeVisible();
  });

  test('works with special characters in names', async ({ page }) => {
    await page.goto(BASE_URL);

    const input = page.locator('#nameInput');
    const addButton = page.locator('button', { hasText: 'Add' });

    // Add names with special characters
    const specialNames = ["O'Brien", "José", "Mary-Ann", "李明"];

    for (const name of specialNames) {
      await input.fill(name);
      await addButton.click();
      await expect(page.locator(`text=${name}`).first()).toBeVisible();
    }

    // Generate allocations - should work with special characters
    const pretzelButton = page.locator('#pretzelButton');
    await pretzelButton.click();

    const resultsCard = page.locator('#resultsCard');
    await expect(resultsCard).toBeVisible();
  });
});
