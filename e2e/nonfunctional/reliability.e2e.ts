/**
 * Non-Functional Test: Reliability & Stress
 *
 * Tests app reliability under stress conditions:
 * - Repeated navigation doesn't cause crashes
 * - Multiple rapid taps are handled gracefully
 * - App recovers from background/foreground transitions
 * - Memory stability under repeated operations
 */

// Use Jest's native expect for primitive assertions
const { expect: jestExpect } = require('expect');

const STRESS_CONFIG = {
  RAPID_TAP_COUNT: 5, // Number of rapid taps to test
  NAVIGATION_CYCLES: 3, // Number of full navigation cycles
  BACKGROUND_CYCLES: 3, // Number of background/foreground cycles
};

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

function uniqueEmail() {
  const ts = Date.now();
  return `detox_stress_${ts}@example.com`;
}

async function ensureLoggedIn() {
  const landing = await waitForLoginOrHome();

  if (landing === 'login') {
    await element(by.id('auth-switch-to-register')).tap();
    await waitFor(element(by.id('register-screen')))
      .toBeVisible()
      .withTimeout(15000);

    await waitFor(element(by.id('auth-full-name')))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.id('auth-full-name')).replaceText('Stress Test User');
    await element(by.id('auth-email')).replaceText(uniqueEmail());

    await waitFor(element(by.id('auth-password')))
      .toBeVisible()
      .whileElement(by.id('auth-scroll'))
      .scroll(120, 'down');
    await element(by.id('auth-password')).replaceText('StressTest123');

    await waitFor(element(by.id('auth-submit')))
      .toBeVisible()
      .whileElement(by.id('auth-scroll'))
      .scroll(120, 'down');
    await element(by.id('auth-submit')).tap();

    await device.disableSynchronization();

    await waitFor(element(by.id('home-screen')))
      .toBeVisible()
      .withTimeout(60000);
  }

  await device.disableSynchronization();
}

describe('Non-Functional: Reliability & Stress Tests', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    await ensureLoggedIn();
  });

  afterAll(async () => {
    await device.enableSynchronization();
  });

  describe('Repeated Navigation Stress', () => {
    it(`should handle ${STRESS_CONFIG.NAVIGATION_CYCLES} full navigation cycles without crashing`, async () => {
      const tabs = [
        { id: 'tab-bulletin', screen: 'bulletin-screen', label: 'Bulletin' },
        { id: 'tab-lectures', screen: 'lectures-screen', label: 'Lectures' },
        { id: 'tab-quiz', screen: 'quiz-screen', label: 'Quiz' },
        { id: 'tab-more', screen: 'more-screen', label: 'More' },
        { id: 'tab-home', screen: 'home-screen', label: 'Home' },
      ];

      for (let cycle = 0; cycle < STRESS_CONFIG.NAVIGATION_CYCLES; cycle++) {
        console.log(`Navigation cycle ${cycle + 1}/${STRESS_CONFIG.NAVIGATION_CYCLES}`);

        for (const tab of tabs) {
          await tapTab(tab.id, tab.label);
          await waitFor(element(by.id(tab.screen)))
            .toBeVisible()
            .withTimeout(15000);
        }
      }

      // If we reach here, all navigation cycles completed successfully
      await waitFor(element(by.id('home-screen')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should handle rapid tab switching without crashes', async () => {
      const tabs = ['tab-bulletin', 'tab-lectures', 'tab-quiz', 'tab-more', 'tab-home'];

      // Rapid switching between tabs
      for (let i = 0; i < 10; i++) {
        const randomTab = tabs[Math.floor(Math.random() * tabs.length)];
        try {
          await element(by.id(randomTab)).tap();
          // Short wait to allow some processing
          await new Promise((resolve) => setTimeout(resolve, 200));
        } catch {
          // Tab might not be ready, continue
        }
      }

      // App should still be responsive
      await tapTab('tab-home', 'Home');
      await waitFor(element(by.id('home-screen')))
        .toBeVisible()
        .withTimeout(15000);
    });
  });

  describe('Rapid Tap Stress', () => {
    it('should handle multiple rapid taps on same button gracefully', async () => {
      await tapTab('tab-more', 'More');
      await waitFor(element(by.id('more-screen')))
        .toBeVisible()
        .withTimeout(15000);

      // Rapid tap on edit profile button
      for (let i = 0; i < STRESS_CONFIG.RAPID_TAP_COUNT; i++) {
        try {
          await element(by.id('more-edit-profile')).tap();
        } catch {
          // May fail if screen already changed, that's OK
        }
      }

      // Wait for whatever screen we end up on
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // App should still be functional - navigate back to known state
      try {
        await element(by.id('edit-profile-back')).tap();
      } catch {
        // Already on more screen
      }

      await waitFor(element(by.id('more-screen')))
        .toBeVisible()
        .withTimeout(15000);
    });

    it('should handle rapid taps on navigation buttons', async () => {
      await tapTab('tab-more', 'More');
      await waitFor(element(by.id('more-screen')))
        .toBeVisible()
        .withTimeout(15000);

      // Open purpose page
      await element(by.id('more-purpose')).tap();
      await waitFor(element(by.id('purpose-screen')))
        .toBeVisible()
        .withTimeout(15000);

      // Rapid tap back button
      for (let i = 0; i < STRESS_CONFIG.RAPID_TAP_COUNT; i++) {
        try {
          await element(by.id('purpose-back')).tap();
        } catch {
          // May fail if already navigated, that's OK
        }
      }

      // Should be back on more screen
      await waitFor(element(by.id('more-screen')))
        .toBeVisible()
        .withTimeout(15000);
    });
  });

  describe('Background/Foreground Reliability', () => {
    it(`should handle ${STRESS_CONFIG.BACKGROUND_CYCLES} background/foreground cycles`, async () => {
      // Ensure we're on a known screen
      await tapTab('tab-home', 'Home');
      await waitFor(element(by.id('home-screen')))
        .toBeVisible()
        .withTimeout(15000);

      for (let cycle = 0; cycle < STRESS_CONFIG.BACKGROUND_CYCLES; cycle++) {
        console.log(`Background cycle ${cycle + 1}/${STRESS_CONFIG.BACKGROUND_CYCLES}`);

        // Send app to background
        await device.sendToHome();

        // Wait a moment in background
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Bring app back to foreground
        await device.launchApp({ newInstance: false });

        // App should still show the same screen or reload properly
        try {
          await waitFor(element(by.id('home-screen')))
            .toBeVisible()
            .withTimeout(15000);
        } catch {
          // May need to re-login after background
          const landing = await waitForLoginOrHome();
          if (landing === 'login') {
            console.log('Session expired during background - this is acceptable');
          }
        }
      }

      // App should be responsive after all cycles
      const finalLanding = await waitForLoginOrHome();
      jestExpect(['home', 'login']).toContain(finalLanding);
    });
  });

  describe('Data Loading Reliability', () => {
    it('should handle repeated data loads on bulletin screen', async () => {
      for (let i = 0; i < 3; i++) {
        await tapTab('tab-bulletin', 'Bulletin');
        await waitFor(element(by.id('bulletin-screen')))
          .toBeVisible()
          .withTimeout(15000);

        // Navigate away and back to trigger reload
        await tapTab('tab-home', 'Home');
        await waitFor(element(by.id('home-screen')))
          .toBeVisible()
          .withTimeout(15000);
      }

      // Final check
      await tapTab('tab-bulletin', 'Bulletin');
      await waitFor(element(by.id('bulletin-screen')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should handle repeated data loads on lectures screen', async () => {
      for (let i = 0; i < 3; i++) {
        await tapTab('tab-lectures', 'Lectures');
        await waitFor(element(by.id('lectures-screen')))
          .toBeVisible()
          .withTimeout(15000);

        await tapTab('tab-home', 'Home');
        await waitFor(element(by.id('home-screen')))
          .toBeVisible()
          .withTimeout(15000);
      }

      await tapTab('tab-lectures', 'Lectures');
      await waitFor(element(by.id('lectures-screen')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });

  describe('Error Recovery', () => {
    it('should recover from invalid navigation attempts', async () => {
      // Try to tap non-existent elements (simulating edge cases)
      try {
        await element(by.id('non-existent-element')).tap();
      } catch {
        // Expected to fail
      }

      // App should still be responsive
      await tapTab('tab-home', 'Home');
      await waitFor(element(by.id('home-screen')))
        .toBeVisible()
        .withTimeout(15000);
    });
  });
});
