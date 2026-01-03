function uniqueEmail() {
  const ts = Date.now();
  return `detox_detail_${ts}@example.com`;
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


async function ensureLoggedIn() {
  const landing = await waitForLoginOrHome();

  if (landing === 'login') {
    // Register a new user
    await element(by.id('auth-switch-to-register')).tap();
    await waitFor(element(by.id('register-screen')))
      .toBeVisible()
      .withTimeout(15000);

    await waitFor(element(by.id('auth-full-name')))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.id('auth-full-name')).replaceText('Detox Detail User');
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

    // Disable sync early so waitFor isn't blocked by background network activity.
    await device.disableSynchronization();

    try {
      await waitFor(element(by.id('auth-busy')))
        .toBeVisible()
        .withTimeout(5000);
    } catch {
      // auth-busy may be too fast to catch
    }

    await waitForHomeOrAuthError(60000);
  }

  // Disable sync for Firestore
  await device.disableSynchronization();
}

describe('Detail Pages (end-to-end)', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    await ensureLoggedIn();
  });

  afterAll(async () => {
    await device.enableSynchronization();
  });

  describe('Edit Profile', () => {
    it('can open edit profile and go back', async () => {
      // Navigate to More tab
      await tapTab('tab-more', 'More');
      await waitFor(element(by.id('more-screen')))
        .toBeVisible()
        .withTimeout(15000);

      // Tap edit profile button
      await element(by.id('more-edit-profile')).tap();
      await waitFor(element(by.id('edit-profile-screen')))
        .toBeVisible()
        .withTimeout(15000);

      // Verify name input is visible
      await waitFor(element(by.id('edit-profile-name')))
        .toBeVisible()
        .withTimeout(5000);

      // Go back
      await element(by.id('edit-profile-back')).tap();
      await waitFor(element(by.id('more-screen')))
        .toBeVisible()
        .withTimeout(15000);
    });
  });

  describe('Bulletin Detail', () => {
    it('can open bulletin detail and go back', async () => {
      // Navigate to Bulletin tab
      await tapTab('tab-bulletin', 'Bulletin');
      await waitFor(element(by.id('bulletin-screen')))
        .toBeVisible()
        .withTimeout(15000);

      // Wait for content to load and tap first bulletin item
      await waitFor(element(by.id('bulletin-item-0')))
        .toBeVisible()
        .withTimeout(20000);
      await element(by.id('bulletin-item-0')).tap();

      // Verify bulletin detail screen
      await waitFor(element(by.id('bulletin-detail-screen')))
        .toBeVisible()
        .withTimeout(15000);

      // Go back
      await element(by.id('bulletin-detail-back')).tap();
      await waitFor(element(by.id('bulletin-screen')))
        .toBeVisible()
        .withTimeout(15000);
    });
  });

  describe('Lecture Detail', () => {
    it('can open lecture detail and go back', async () => {
      // Navigate to Lectures tab
      await tapTab('tab-lectures', 'Lectures');
      await waitFor(element(by.id('lectures-screen')))
        .toBeVisible()
        .withTimeout(15000);

      // Wait for content to load and tap first lecture item
      await waitFor(element(by.id('lecture-item-0')))
        .toBeVisible()
        .withTimeout(20000);
      await element(by.id('lecture-item-0')).tap();

      // Verify lecture detail screen
      await waitFor(element(by.id('lecture-detail-screen')))
        .toBeVisible()
        .withTimeout(15000);

      // Go back
      await element(by.id('lecture-detail-back')).tap();
      await waitFor(element(by.id('lectures-screen')))
        .toBeVisible()
        .withTimeout(15000);
    });
  });
});
