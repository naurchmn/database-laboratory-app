package com.basdat.databaselaboratory;

import com.wix.detox.Detox;

import org.junit.Rule;
import org.junit.Test;

public class DetoxTest {
  @Rule
  public DetoxCompatibleActivityTestRule<MainActivity> mActivityRule =
      new DetoxCompatibleActivityTestRule<>(MainActivity.class);

  @Test
  public void runDetoxTests() {
    Detox.runTests(mActivityRule);
  }
}
