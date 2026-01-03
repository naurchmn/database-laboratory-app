describe('Smoke', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('shows splash screen on launch', async () => {
    // Depending on persisted Firebase auth state (Keychain), the app may land on
    // login or directly into tabs. Accept either to keep the smoke test stable.
    try {
      await waitFor(element(by.id('login-screen')))
        .toBeVisible()
        .withTimeout(10000);
    } catch {
      await waitFor(element(by.id('home-screen')))
        .toBeVisible()
        .withTimeout(10000);
    }
  });
});
