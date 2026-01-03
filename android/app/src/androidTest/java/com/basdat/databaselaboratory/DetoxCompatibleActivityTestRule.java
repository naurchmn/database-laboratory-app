package com.basdat.databaselaboratory;

import android.app.Activity;
import android.app.Instrumentation;
import android.content.Intent;

import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.rule.ActivityTestRule;

import java.lang.ref.WeakReference;
import java.lang.reflect.Field;

/**
 * Launches the activity without relying on ActivityTestRule's internal startActivitySync/idle waiting,
 * which can time out in Detox's launch-on-handshake flow.
 */
public class DetoxCompatibleActivityTestRule<T extends Activity> extends ActivityTestRule<T> {
  private static final long ACTIVITY_LAUNCH_TIMEOUT_MS = 45_000L;

  private final Class<T> activityClass;

  public DetoxCompatibleActivityTestRule(Class<T> activityClass) {
    super(activityClass, false, false);
    this.activityClass = activityClass;
  }

  @Override
  public T launchActivity(Intent startIntent) {
    beforeActivityLaunched();

    final Instrumentation instrumentation = InstrumentationRegistry.getInstrumentation();
    final Intent intent = (startIntent != null) ? new Intent(startIntent) : getActivityIntent();

    if (intent.getComponent() == null) {
      intent.setClass(instrumentation.getTargetContext(), activityClass);
    }

    if (Intent.ACTION_MAIN.equals(intent.getAction())) {
      intent.addCategory(Intent.CATEGORY_LAUNCHER);
    }

    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

    final Instrumentation.ActivityMonitor monitor = instrumentation.addMonitor(
      activityClass.getName(),
      null,
      false
    );
    try {
      instrumentation.getTargetContext().startActivity(intent);

      final Activity activity = instrumentation.waitForMonitorWithTimeout(monitor, ACTIVITY_LAUNCH_TIMEOUT_MS);
      if (activity == null) {
        throw new RuntimeException(
            "Could not launch intent for " + activityClass.getName() + " within " + ACTIVITY_LAUNCH_TIMEOUT_MS + "ms"
        );
      }

      setActivityOnRule(activity);
      afterActivityLaunched();
      //noinspection unchecked
      return (T) activity;
    } finally {
      instrumentation.removeMonitor(monitor);
    }
  }

  private void setActivityOnRule(Activity activity) {
    try {
      final Field activityField = ActivityTestRule.class.getDeclaredField("activity");
      activityField.setAccessible(true);
      activityField.set(this, new WeakReference<>(activity));
    } catch (Exception e) {
      throw new RuntimeException("Failed to set launched Activity on ActivityTestRule", e);
    }
  }
}
