import { test, expect } from '@playwright/test';

test('Verify Mobile Header and Purple Colors', async ({ page }) => {
  // Set viewport to a common mobile size
  await page.setViewportSize({ width: 375, height: 812 });

  await page.goto('http://localhost:3000');

  // Wait for content to load
  await page.waitForTimeout(2000);

  // Take a screenshot of the header area
  await page.screenshot({ path: 'mobile_header_verify.png', clip: { x: 0, y: 0, width: 375, height: 200 } });

  // Take a full page screenshot to see colors
  await page.screenshot({ path: 'mobile_full_verify.png', fullPage: true });

  // Check if "Hire Me" button in Hero has purple class (bg-purple-600)
  const heroButton = page.locator('button:has-text("Hire Me")').first();
  const heroButtonClass = await heroButton.getAttribute('class');
  console.log('Hero Button Classes:', heroButtonClass);

  // Check header logo height and padding
  const header = page.locator('header');
  const headerBox = await header.boundingBox();
  console.log('Header Bounding Box:', headerBox);

  const logo = page.locator('header img');
  const logoBox = await logo.boundingBox();
  console.log('Logo Bounding Box:', logoBox);

  // Logo should be well within header
  if (headerBox && logoBox) {
    const topPadding = logoBox.y - headerBox.y;
    const bottomPadding = (headerBox.y + headerBox.height) - (logoBox.y + logoBox.height);
    console.log(`Logo Top Padding: ${topPadding}, Bottom Padding: ${bottomPadding}`);
  }
});
