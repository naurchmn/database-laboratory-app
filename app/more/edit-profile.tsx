import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../../src/lib/firebase';
import { updateProfile } from 'firebase/auth';

export default function EditProfile() {
  const [displayName, setDisplayName] = useState('');
  const [userInitial, setUserInitial] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) {
      router.replace('/(auth)/login');
      return;
    }

    const user = auth.currentUser;
    if (user?.displayName) {
      setDisplayName(user.displayName);
      setUserInitial(user.displayName.charAt(0).toUpperCase());
    } else if (user?.email) {
      const emailName = user.email.split('@')[0];
      setDisplayName(emailName);
      setUserInitial(emailName.charAt(0).toUpperCase());
    }
  }, []);

  const handleSave = async () => {
    if (!auth.currentUser) return;

    if (!displayName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName.trim(),
      });
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Update initial when name changes
  useEffect(() => {
    if (displayName.trim()) {
      setUserInitial(displayName.trim().charAt(0).toUpperCase());
    }
  }, [displayName]);

  if (!auth.currentUser) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="px-5 py-4 flex-row items-center">
        <Pressable
          onPress={() => router.back()}
          style={{ paddingVertical: 6, paddingRight: 12 }}
        >
          <Ionicons name="chevron-back" size={22} color="#6D28D9" />
        </Pressable>

        <View className="flex-1">
          <Text
            className="text-center font-extrabold"
            style={{ color: '#652EC7', fontSize: 18 }}
          >
            Edit Profile
          </Text>
        </View>
        <View style={{ width: 34 }} />
      </View>

      {/* Content */}
      <View className="flex-1 px-6 pt-8">
        {/* Profile Avatar */}
        <View className="items-center mb-8">
          <View
            className="rounded-full justify-center items-center mb-3"
            style={{
              width: 100,
              height: 100,
              backgroundColor: userInitial ? '#C03694' : '#E5E7EB',
            }}
          >
            {userInitial ? (
              <Text style={{ color: 'white', fontSize: 42, fontWeight: '700' }}>
                {userInitial}
              </Text>
            ) : (
              <Ionicons name="person" size={50} color="#9CA3AF" />
            )}
          </View>
          <Text style={{ color: '#757575', fontSize: 14 }}>
            {auth.currentUser?.email}
          </Text>
        </View>

        {/* Name Input */}
        <View className="mb-6">
          <Text style={{ color: '#374151', fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
            Display Name
          </Text>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Enter your name"
            placeholderTextColor="#9CA3AF"
            style={{
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 14,
              fontSize: 16,
              color: '#1F2937',
            }}
          />
        </View>

        {/* Save Button */}
        <LinearGradient
          colors={['#F97316', '#EC4899', '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            borderRadius: 12,
            padding: 1.5,
          }}
        >
          <Pressable
            onPress={handleSave}
            disabled={loading}
            style={{
              backgroundColor: 'white',
              borderRadius: 10.5,
              paddingVertical: 14,
              alignItems: 'center',
            }}
          >
            {loading ? (
              <ActivityIndicator color="#C03694" />
            ) : (
              <Text style={{ color: '#C03694', fontSize: 16, fontWeight: '700' }}>
                Save Changes
              </Text>
            )}
          </Pressable>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}
