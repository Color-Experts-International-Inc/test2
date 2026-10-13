import { expect, test } from '@playwright/test';

test('island hydrates', async ({ page }) => {
  await page.goto('/');
  const btn = page.getByRole('button', { name: /clicked/ });
  await btn.click();
  await expect(btn).toHaveText('clicked 1');
});
