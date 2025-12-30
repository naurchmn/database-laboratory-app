import { router } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { auth } from '../../src/lib/firebase';

export default function Quiz() {
  useEffect(() => {
    if (!auth.currentUser) {
      router.replace('/(auth)/login');
    }
  }, []);

  // Don't render if not authenticated
  if (!auth.currentUser) {
    return null;
  }

  return (
    <View className="bg-background flex-1 justify-center items-center">
    </View>
  );
}