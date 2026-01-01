import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { auth, storage } from '../../src/lib/firebase';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function EditProfile() {
  const [displayName, setDisplayName] = useState('');
  const [userInitial, setUserInitial] = useState('');
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

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
    if (user?.photoURL) {
      setPhotoURL(user.photoURL);
    }
  }, []);

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photos');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      await uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    if (!auth.currentUser) return;

    setUploadingPhoto(true);
    try {
      // Convert URI to blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Upload to Firebase Storage
      const storageRef = ref(storage, `profile-photos/${auth.currentUser.uid}`);
      await uploadBytes(storageRef, blob);

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Update user profile
      await updateProfile(auth.currentUser, { photoURL: downloadURL });
      setPhotoURL(downloadURL);

      Alert.alert('Success', 'Photo updated successfully');
    } catch (error) {
      console.error('Error uploading photo:', error);
      Alert.alert('Error', 'Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

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
        photoURL: photoURL || undefined,
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
            className="rounded-full justify-center items-center"
            style={{
              width: 100,
              height: 100,
              backgroundColor: photoURL ? 'transparent' : (userInitial ? '#C03694' : '#E5E7EB'),
              overflow: 'hidden',
            }}
          >
            {uploadingPhoto ? (
              <ActivityIndicator size="large" color="#C03694" />
            ) : photoURL ? (
              <Image
                source={{ uri: photoURL }}
                style={{ width: 100, height: 100 }}
                resizeMode="cover"
              />
            ) : userInitial ? (
              <Text style={{ color: 'white', fontSize: 42, fontWeight: '700' }}>
                {userInitial}
              </Text>
            ) : (
              <Ionicons name="person" size={50} color="#9CA3AF" />
            )}
          </View>
          <Pressable onPress={pickImage} disabled={uploadingPhoto}>
            <Text style={{ color: '#C03694', fontSize: 14, fontWeight: '600', marginTop: 8 }}>
              Edit Photo
            </Text>
          </Pressable>
          <Text style={{ color: '#757575', fontSize: 14, marginTop: 4 }}>
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
