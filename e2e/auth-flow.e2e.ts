describe('Auth flow', () => {
  beforeAll(async () => {
    // Force the app into a deterministic auth route, regardless of persisted auth state.
    await device.launchApp({
      newInstance: true,
      url: 'databaselaboratory:///(auth)/login',
    });
  });

  it('can navigate login -> register -> login', async () => {
    await waitFor(element(by.id('login-screen')))
      .toBeVisible()
      .withTimeout(10000);

    await element(by.id('auth-switch-to-register')).tap();

    await waitFor(element(by.id('register-screen')))
      .toBeVisible()
      .withTimeout(10000);

    await waitFor(element(by.id('auth-full-name')))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.id('auth-switch-to-login')).tap();

    await waitFor(element(by.id('login-screen')))
      .toBeVisible()
      .withTimeout(10000);
  });
});
