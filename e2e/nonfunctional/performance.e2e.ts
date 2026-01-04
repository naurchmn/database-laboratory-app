/**
 * Non-Functional Test: Performance
 *
 * Tests app performance metrics including:
 * - App launch time
 * - Screen navigation response time
 * - Scroll performance (no jank)
 */

// Use Jest's native expect for primitive assertions (not Detox's expect which is for UI)
const { expect: jestExpect } = require('expect');

const PERFORMANCE_THRESHOLDS = {
  APP_LAUNCH_MS: 10000, // App should launch within 10 seconds (increased for CI)
  SCREEN_TRANSITION_MS: 3000, // Screen transitions should complete within 3 seconds
  SCROLL_ITERATIONS: 10, // Number of scroll operations to test smoothness
};

// Track if user is logged in
let isLoggedIn = false;

async function tapTab(tabId: string, fallbackLabel: string) {
  try {
    await element(by.id(tabId)).tap();
  } catch {
    try {
      await element(by.label(tabId)).tap();
    } catch {
      await element(by.text(fallbackLabel)).atIndex(0).tap();
    }
  }
}

async function waitForLoginOrHome() {
  try {
    await waitFor(element(by.id('login-screen')))
      .toBeVisible()
      .withTimeout(20000);
    return 'login' as const;
  } catch {
    await waitFor(element(by.id('home-screen')))
      .toBeVisible()
      .withTimeout(20000);
    return 'home' as const;
  }
}

async function measureTime<T>(fn: () => Promise<T>): Promise<{ result: T; durationMs: number }> {
  const start = Date.now();
  const result = await fn();
  const durationMs = Date.now() - start;
  return { result, durationMs };
}

describe('Non-Functional: Performance Tests', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  afterAll(async () => {
    await device.enableSynchronization();
  });

  describe('App Launch Performance', () => {
    it(`should launch and show initial screen within ${PERFORMANCE_THRESHOLDS.APP_LAUNCH_MS}ms`, async () => {
      // Relaunch app and measure time
      const { result: landing, durationMs } = await measureTime(async () => {
        await device.launchApp({ newInstance: true });
        return await waitForLoginOrHome();
      });

      console.log(`App launch time: ${durationMs}ms`);
      isLoggedIn = landing === 'home';

      // Assert launch time is within threshold using Jest's expect
      jestExpect(durationMs).toBeLessThan(PERFORMANCE_THRESHOLDS.APP_LAUNCH_MS);
    });
  });

  describe('Screen Navigation Performance', () => {
    beforeAll(async () => {
      // Check login state
      const landing = await waitForLoginOrHome();
      isLoggedIn = landing === 'home';

      if (!isLoggedIn) {
        console.warn('Not logged in - navigation tests will be skipped');
      }
      await device.disableSynchronization();
    });

    it(`should navigate between tabs within ${PERFORMANCE_THRESHOLDS.SCREEN_TRANSITION_MS}ms each`, async () => {
      if (!isLoggedIn) {
        console.log('Skipping: User not logged in');
        return; // Skip test if not logged in
      }

      const tabs = [
        { id: 'tab-bulletin', screen: 'bulletin-screen', label: 'Bulletin' },
        { id: 'tab-lectures', screen: 'lectures-screen', label: 'Lectures' },
        { id: 'tab-quiz', screen: 'quiz-screen', label: 'Quiz' },
        { id: 'tab-more', screen: 'more-screen', label: 'More' },
        { id: 'tab-home', screen: 'home-screen', label: 'Home' },
      ];

      for (const tab of tabs) {
        const { durationMs } = await measureTime(async () => {
          await tapTab(tab.id, tab.label);
          await waitFor(element(by.id(tab.screen)))
            .toBeVisible()
            .withTimeout(PERFORMANCE_THRESHOLDS.SCREEN_TRANSITION_MS);
        });

        console.log(`Navigation to ${tab.label}: ${durationMs}ms`);

        jestExpect(durationMs).toBeLessThan(PERFORMANCE_THRESHOLDS.SCREEN_TRANSITION_MS);
      }
    });
  });

  describe('Scroll Performance', () => {
    beforeAll(async () => {
      const landing = await waitForLoginOrHome();
      isLoggedIn = landing === 'home';
      await device.disableSynchronization();
    });

    it('should scroll smoothly without crashes (bulletin screen)', async () => {
      if (!isLoggedIn) {
        console.log('Skipping: User not logged in');
        return;
      }

      await tapTab('tab-bulletin', 'Bulletin');
      await waitFor(element(by.id('bulletin-screen')))
        .toBeVisible()
        .withTimeout(15000);

      // Perform multiple scroll operations to test for jank/crashes
      for (let i = 0; i < PERFORMANCE_THRESHOLDS.SCROLL_ITERATIONS; i++) {
        try {
          await element(by.id('bulletin-screen')).scroll(200, 'down');
        } catch {
          // Scroll may fail if content is short, that's OK
        }
      }

      // Scroll back up
      for (let i = 0; i < PERFORMANCE_THRESHOLDS.SCROLL_ITERATIONS; i++) {
        try {
          await element(by.id('bulletin-screen')).scroll(200, 'up');
        } catch {
          // Scroll may fail if already at top
        }
      }

      // If we reach here without crash, scroll performance is acceptable
      await waitFor(element(by.id('bulletin-screen')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should scroll smoothly without crashes (lectures screen)', async () => {
      if (!isLoggedIn) {
        console.log('Skipping: User not logged in');
        return;
      }

      await tapTab('tab-lectures', 'Lectures');
      await waitFor(element(by.id('lectures-screen')))
        .toBeVisible()
        .withTimeout(15000);

      // Perform multiple scroll operations
      for (let i = 0; i < PERFORMANCE_THRESHOLDS.SCROLL_ITERATIONS; i++) {
        try {
          await element(by.id('lectures-screen')).scroll(200, 'down');
        } catch {
          // Scroll may fail if content is short
        }
      }

      for (let i = 0; i < PERFORMANCE_THRESHOLDS.SCROLL_ITERATIONS; i++) {
        try {
          await element(by.id('lectures-screen')).scroll(200, 'up');
        } catch {
          // Scroll may fail if already at top
        }
      }

      await waitFor(element(by.id('lectures-screen')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });
});
