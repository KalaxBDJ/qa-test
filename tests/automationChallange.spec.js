// @ts-check
import { test, expect } from '@playwright/test';
import Data from '../data/data.json';

test('Complete Challange', async ({ page }) => {
  await page.goto('https://www.theautomationchallenge.com');
  await login(page);
  await completeChallange(page);
  await challangeResult(page);
});

async function challangeResult(page){
  await page.getByRole('button', { name: 'Santiago', exact: true }).click();
  await expect(page.getByText('100%', { exact: true })).toBeVisible();
}

async function login(page) {
  const signUpButton = page.getByRole('button', { name: 'SIGN UP OR LOGIN' })
  await expect(signUpButton).toBeVisible();
  await signUpButton.click();
  await expect(page.getByRole('heading', { name: 'Sign up', exact: true })).toBeVisible();

  const orLoginButton = await page.getByRole('button', { name: 'OR LOGIN', exact: true })
  if (await orLoginButton.isVisible()) {
    await orLoginButton.click();
  }
  await expect(page.getByText('By signing up, I agree to the ', { exact: false })).not.toBeVisible();
  const emailInput = page.getByRole('textbox', { name: 'email', includeHidden: false })
  await expect(emailInput).toBeVisible();
  await emailInput.fill('kalaxdj@gmail.com');
  await page.getByRole('textbox', { name: 'password', includeHidden: false }).fill('seWdab-mecgep-5racpe');
  await page.getByRole('button', { name: 'LOG IN', exact: true }).click();

  // Check if the user is logged in
  await expect(page.getByRole('button', { name: 'Santiago', exact: true })).toBeVisible();
}

async function completeChallange(page) {
  // Start Challange
  await page.getByRole('button', { name: 'Start', exact: true }).click();

  // Verify if challange is started
  await expect(page.getByRole('button', { name: 'Submit', exact: true })).toBeVisible();

  for (const data of Data) {
    await fillChallangeInput(page, 'EIN', data.employer_identification_number);
    await fillChallangeInput(page, 'Sector', data.sector);
    await fillChallangeInput(page, 'Company Name', data.company_name);
    await fillChallangeInput(page, 'Automation Tool', data.automation_tool);
    await fillChallangeInput(page, 'Annual Saving', data.annual_automation_saving);
    await fillChallangeInput(page, 'Address', data.company_address);
    await fillChallangeInput(page, 'Date', data.date_of_first_project);
    await captchaValidation(page);
    await page.getByRole('button', { name: 'Submit', exact: true, includeHidden: false }).click();
  }
}

async function captchaValidation(page) {
  const captchaButton = await page.getByRole('button', { name: 'presentation', exact: true });
  if (await captchaButton.isVisible()) {
    await captchaButton.click();
    await captchaButton.waitFor({ state: 'hidden' });
  }
}

async function fillChallangeInput(page, searchText, value) {
  const visibleLabel = page.locator(`div.content:has-text("${searchText}"):visible`).first();
  await expect(visibleLabel).toBeVisible();

  const container = visibleLabel.locator(
    'xpath=ancestor::div[contains(@class, "bubble-element") and contains(@class, "Group")][1]'
  );

  const input = container.locator('input:visible').first();
  await expect(input).toBeVisible({ timeout: 5000 });

  await input.fill(value);
}
