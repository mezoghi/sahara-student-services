import { test, expect } from '@playwright/test';

test.describe('Application Flow E2E Test', () => {
  test('complete application flow: register → browse → apply → submit', async ({ page }) => {
    // Step 1: Navigate to home page
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Your Gateway to UK & US Universities');

    // Step 2: Register new user
    await page.click('text=Register');
    await expect(page).toHaveURL('/register');

    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;

    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="phone"]', '+1234567890');
    await page.fill('input[name="password"]', 'Test@12345');
    await page.fill('input[name="confirmPassword"]', 'Test@12345');
    await page.click('button[type="submit"]');

    // Should redirect to dashboard after registration
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
    await expect(page.locator('h1')).toContainText('Welcome, Test!');

    // Step 3: Browse courses
    await page.click('text=Browse Courses');
    await expect(page).toHaveURL('/courses');
    
    // Wait for courses to load
    await page.waitForSelector('.card', { timeout: 10000 });
    
    // Click on first course
    await page.click('.card >> text=View Details >> nth=0');
    await expect(page.locator('h1')).toBeVisible();

    // Step 4: Start application
    await page.click('text=Apply Now');
    
    // Should be on application page
    await expect(page.locator('h1')).toContainText('Application Form');

    // Step 5: Fill personal information (Step 1)
    await page.fill('input[name="dateOfBirth"]', '2000-01-01');
    await page.fill('input[name="nationality"]', 'British');
    await page.fill('input[name="passportNumber"]', 'AB123456');
    await page.fill('input[name="address"]', '123 Test Street');
    await page.fill('input[name="city"]', 'London');
    await page.fill('input[name="country"]', 'United Kingdom');
    await page.fill('input[name="postalCode"]', 'SW1A 1AA');

    // Save draft
    await page.click('text=Save Draft');
    await expect(page.locator('text=Draft saved successfully!')).toBeVisible({ timeout: 5000 });

    // Go to next step
    await page.click('text=Next Step');

    // Step 6: Fill academic background (Step 2)
    await page.fill('textarea[name="previousEducation"]', 'A-levels: Mathematics (A*), Physics (A), Chemistry (A)');
    await page.fill('input[name="gpa"]', '4.0');
    await page.selectOption('select[name="englishProficiency"]', 'IELTS');
    await page.fill('textarea[name="personalStatement"]', 'I am passionate about pursuing higher education in this field because...');
    await page.fill('input[name="referenceContact"]', 'reference@school.com');

    // Save and continue
    await page.click('text=Save Draft');
    await page.waitForTimeout(1000);
    await page.click('text=Next Step');

    // Step 7: Skip document upload for now
    await page.click('text=Review & Submit');

    // Step 8: Review and submit
    await expect(page.locator('h2')).toContainText('Review Your Application');
    await page.click('text=Submit Application');

    // Should show success and redirect to dashboard
    await expect(page.locator('text=Application submitted successfully!')).toBeVisible({ timeout: 5000 });
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });

    // Verify application appears in dashboard with SUBMITTED status
    await expect(page.locator('text=SUBMITTED')).toBeVisible();
  });

  test('admin can review application', async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@saharastudentservices.com');
    await page.fill('input[name="password"]', 'Admin@123');
    await page.click('button[type="submit"]');

    // Should redirect to admin dashboard
    await expect(page).toHaveURL('/admin/dashboard', { timeout: 10000 });
    await expect(page.locator('h1')).toContainText('Admin Dashboard');

    // Check stats are visible
    await expect(page.locator('text=Total Applications')).toBeVisible();
    await expect(page.locator('text=Submitted')).toBeVisible();

    // View all applications
    await page.click('text=View All Applications');
    
    // Should see applications table
    await expect(page.locator('table')).toBeVisible({ timeout: 5000 });
  });
});
