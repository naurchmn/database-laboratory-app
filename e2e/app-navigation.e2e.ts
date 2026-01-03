function uniqueEmail() {
  const ts = Date.now();
  return `detox_user_${ts}@example.com`;
}

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

async function waitForHomeOrAuthError(timeoutMs: number) {
  try {
    await waitFor(element(by.id('home-screen')))
      .toBeVisible()
      .withTimeout(timeoutMs);
    return;
  } catch (e) {
    try {
      await waitFor(element(by.id('auth-error')))
        .toBeVisible()
        .withTimeout(1000);
      const attrs: any = await element(by.id('auth-error')).getAttributes();
      throw new Error(`Auth failed: ${attrs?.text ?? JSON.stringify(attrs)}`);
    } catch {
      try {
        await waitFor(element(by.id('auth-busy')))
          .toBeVisible()
          .withTimeout(1000);
        throw new Error('Auth appears stuck (auth-busy still visible)');
      } catch {
        // ignore
      }

      throw e;
    }
  }
}


describe('App navigation (end-to-end)', () => {
  beforeAll(async () => {
    // Don't rely on deep links here: the splash route may override navigation
    // based on persisted auth state. Start normally and drive UI explicitly.
    await device.launchApp({ newInstance: true });
  });

  afterAll(async () => {
    // Ensure we don't leak disabled sync into other suites.
    await device.enableSynchronization();
  });

  it(
    'can register, navigate tabs, open More pages, and logout',
    async () => {
    const landing = await waitForLoginOrHome();

    if (landing === 'home') {
      await tapTab('tab-more', 'More');
      await waitFor(element(by.id('more-screen')))
        .toBeVisible()
        .withTimeout(15000);

      await element(by.id('more-logout')).tap();
      await waitFor(element(by.id('login-screen')))
        .toBeVisible()
        .withTimeout(20000);
    }

    // From login, move to register.
    await element(by.id('auth-switch-to-register')).tap();
    await waitFor(element(by.id('register-screen')))
      .toBeVisible()
      .withTimeout(15000);

    await waitFor(element(by.id('auth-full-name')))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.id('auth-full-name')).replaceText('Detox User');
    await element(by.id('auth-email')).replaceText(uniqueEmail());

    await waitFor(element(by.id('auth-password')))
      .toBeVisible()
      .whileElement(by.id('auth-scroll'))
      .scroll(120, 'down');
    await element(by.id('auth-password')).replaceText('DetoxPass123');

    await waitFor(element(by.id('auth-submit')))
      .toBeVisible()
      .whileElement(by.id('auth-scroll'))
      .scroll(120, 'down');
    await element(by.id('auth-submit')).tap();

    // Firestore can keep the app perpetually "busy". Disable sync early so waitFor
    // can observe UI state changes even when background network is active.
    await device.disableSynchronization();

    // Ensure the submit actually triggered (spinner shows) or navigation happens quickly.
    try {
      await waitFor(element(by.id('auth-busy')))
        .toBeVisible()
        .withTimeout(5000);
    } catch {
      // If auth is super fast, auth-busy may never appear. That's OK.
    }

    // After successful sign-up, app navigates to tabs.
    await waitForHomeOrAuthError(60000);

    // Navigate across tabs (covers core app sections).
    await tapTab('tab-bulletin', 'Bulletin');
    await waitFor(element(by.id('bulletin-screen')))
      .toBeVisible()
      .withTimeout(15000);

    await tapTab('tab-lectures', 'Lectures');
    await waitFor(element(by.id('lectures-screen')))
      .toBeVisible()
      .withTimeout(15000);

    await tapTab('tab-quiz', 'Quiz');
    await waitFor(element(by.id('quiz-screen')))
      .toBeVisible()
      .withTimeout(15000);

    await tapTab('tab-more', 'More');
    await waitFor(element(by.id('more-screen')))
      .toBeVisible()
      .withTimeout(15000);

    // Open More subpages.
    await element(by.id('more-purpose')).tap();
    await waitFor(element(by.id('purpose-screen')))
      .toBeVisible()
      .withTimeout(15000);
    await element(by.id('purpose-back')).tap();
    await waitFor(element(by.id('more-screen')))
      .toBeVisible()
      .withTimeout(15000);

    await element(by.id('more-assistants')).tap();
    await waitFor(element(by.id('members-screen')))
      .toBeVisible()
      .withTimeout(20000);
    await element(by.id('members-back')).tap();
    await waitFor(element(by.id('more-screen')))
      .toBeVisible()
      .withTimeout(15000);

    // Logout and ensure we land back on login.
    await element(by.id('more-logout')).tap();
    await waitFor(element(by.id('login-screen')))
      .toBeVisible()
      .withTimeout(20000);
    },
    180000
  );
});
