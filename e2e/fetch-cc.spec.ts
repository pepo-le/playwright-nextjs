import { test, expect } from '@playwright/test';

test('Shall fetched data not visible without session token', async ({
  page,
  context,
}) => {
  await context.clearCookies();
  await page.goto('/fetch-cc');
  await expect(page.getByRole('heading')).toHaveText('Notes page by CC');
  await expect(page.getByText('Note 1')).not.toBeVisible();
});

test('Shall fetched data visible without session token', async ({ page }) => {
  await page.goto('/fetch-cc');
  await expect(page.getByRole('heading')).toHaveText('Notes page by CC');
  await expect(page.getByText('Note 1')).toBeVisible();
});
