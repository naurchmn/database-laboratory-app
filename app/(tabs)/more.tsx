import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { signOut } from 'firebase/auth';
import { useCallback, useState } from 'react';
import { Image, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../src/lib/firebase';

// Gradient border button component
const GradientBorderButton = ({
  children,
  onPress,
  style,
  testID,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: object;
  testID?: string;
}) => (
  <LinearGradient
    colors={['#F97316', '#EC4899', '#8B5CF6']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={[{
      borderRadius: 12,
      padding: 1.5,
    }, style]}
  >
    <Pressable
      testID={testID}
      className="bg-white rounded-xl flex-row items-center justify-between px-3"
      style={{ height: 45 }}
      onPress={onPress}
    >
      {children}
    </Pressable>
  </LinearGradient>
);

export default function More() {
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [userInitial, setUserInitial] = useState<string>('');
  const [userPhotoURL, setUserPhotoURL] = useState<string | null>(null);

  // Refresh user data when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (!auth.currentUser) {
        router.replace('/(auth)/login');
        return;
      }

      const user = auth.currentUser;
      if (user?.displayName) {
        setUserName(user.displayName);
        setUserInitial(user.displayName.charAt(0).toUpperCase());
      } else if (user?.email) {
        const emailName = user.email.split('@')[0];
        setUserName(emailName);
        setUserInitial(emailName.charAt(0).toUpperCase());
      }
      if (user?.email) {
        setUserEmail(user.email);
      }
      if (user?.phoneNumber) {
        setUserPhone(user.phoneNumber);
      }
      setUserPhotoURL(user?.photoURL || null);
    }, [])
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const openInstagram = () => {
    Linking.openURL('https://instagram.com/wargabasdat');
  };

  const openEmail = () => {
    Linking.openURL('mailto:lab-basdat@itb.ac.id');
  };

  const openMaps = () => {
    Linking.openURL('https://maps.google.com/?q=Jl.+Ganesa+No.10,+Lb.+Siliwangi,+Kecamatan+Coblong,+Kota+Bandung,+Jawa+Barat+40132');
  };

  if (!auth.currentUser) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']} testID="more-screen">
      {/* Pink Header */}
      <View
        className="w-full bg-[#C03694] justify-end items-center"
        style={{
          height: 163,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          position: 'relative',
        }}
      >
        {/* Profile Card */}
        <View
          className="bg-white rounded-2xl flex-row items-center px-3 py-4"
          style={{
            position: 'absolute',
            left: 59,
            right: 59,
            bottom: -44,
            height: 89,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 6.8,
            elevation: 5,
          }}
        >
          {/* Profile Image / Initial */}
          <View
            className="rounded-full overflow-hidden justify-center items-center"
            style={{
              width: 60,
              height: 60,
              backgroundColor: userPhotoURL ? 'transparent' : (userInitial ? '#C03694' : '#E5E7EB'),
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.25,
              shadowRadius: 8.1,
              elevation: 3,
            }}
          >
            {userPhotoURL ? (
              <Image
                source={{ uri: userPhotoURL }}
                style={{ width: 60, height: 60 }}
                resizeMode="cover"
              />
            ) : userInitial ? (
              <Text style={{ color: 'white', fontSize: 28, fontWeight: '700' }}>
                {userInitial}
              </Text>
            ) : (
              <Ionicons name="person" size={32} color="#9CA3AF" />
            )}
          </View>

          {/* User Info */}
          <View className="flex-1 ml-3">
            <Text style={{ color: 'black', fontSize: 16, fontWeight: '700', lineHeight: 22.4 }}>
              {userName || 'Guest'}
            </Text>
            <Text style={{ color: '#757575', fontSize: 14, fontWeight: '400', lineHeight: 19.6 }}>
              {userEmail}
            </Text>
            {userPhone && (
              <Text style={{ color: '#757575', fontSize: 14, fontWeight: '400', lineHeight: 19.6 }}>
                {userPhone}
              </Text>
            )}
          </View>

          {/* Edit Icon */}
          <Pressable onPress={() => router.push('/more/edit-profile')} testID="more-edit-profile">
            <Ionicons name="create-outline" size={18} color="#444444" />
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingTop: 60, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* About us Section */}
        <Text style={{ color: '#DF3983', fontSize: 16, fontWeight: '700', lineHeight: 22.4, marginBottom: 10 }}>
          About us
        </Text>

        {/* Purpose of database laboratory */}
        <View style={{ marginBottom: 12 }}>
          <GradientBorderButton
            onPress={() => router.push('/more/purpose')}
            testID="more-purpose"
          >
            <Text style={{ color: '#C03694', fontSize: 16, fontWeight: '700', lineHeight: 22.4, flex: 1 }}>
              Purpose of database laboratory
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#FFD300" />
          </GradientBorderButton>
        </View>

        {/* Assistants and lecturers */}
        <View style={{ marginBottom: 24 }}>
          <GradientBorderButton
            onPress={() => router.push('/more/assistants')}
            testID="more-assistants"
          >
            <Text style={{ color: '#C03694', fontSize: 16, fontWeight: '700', lineHeight: 22.4, flex: 1 }}>
              Assistants and lecturers
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#FFD300" />
          </GradientBorderButton>
        </View>

        {/* Connect with us Section */}
        <Text style={{ color: '#DF3983', fontSize: 16, fontWeight: '700', lineHeight: 22.4, marginBottom: 10 }}>
          Connect with us
        </Text>

        {/* Instagram */}
        <Pressable
          className="flex-row items-center mb-3"
          onPress={openInstagram}
        >
          <Image
            source={require('../../src/assets/images/Instagram.png')}
            style={{ width: 43, height: 53 }}
            resizeMode="contain"
          />
          <Text style={{ marginLeft: 14, color: '#EB68A3', fontSize: 14, fontWeight: '500', lineHeight: 19.6 }}>
            @wargabasdat
          </Text>
        </Pressable>

        {/* Email */}
        <Pressable
          className="flex-row items-center mb-3"
          onPress={openEmail}
        >
          <Image
            source={require('../../src/assets/images/Gmail.png')}
            style={{ width: 43, height: 44 }}
            resizeMode="contain"
          />
          <Text style={{ marginLeft: 14, color: '#EB68A3', fontSize: 14, fontWeight: '500', lineHeight: 19.6 }}>
            lab-basdat@itb.ac.id
          </Text>
        </Pressable>

        {/* Location */}
        <Pressable
          className="flex-row items-start mb-6"
          onPress={openMaps}
        >
          <Image
            source={require('../../src/assets/images/Google Maps.png')}
            style={{ width: 47, height: 48 }}
            resizeMode="contain"
          />
          <Text style={{ marginLeft: 12, flex: 1, color: '#EB68A3', fontSize: 14, fontWeight: '500', lineHeight: 20, marginTop: 8 }}>
            Jl. Ganesa No.10, Lb. Siliwangi, Kecamatan Coblong, Kota Bandung, Jawa Barat 40132
          </Text>
        </Pressable>

        {/* Others Section */}
        <Text style={{ color: '#DF3983', fontSize: 16, fontWeight: '700', lineHeight: 22.4, marginBottom: 10 }}>
          Others
        </Text>

        {/* Log out */}
        <GradientBorderButton onPress={handleLogout} testID="more-logout">
          <Text style={{ color: '#C03694', fontSize: 16, fontWeight: '700', lineHeight: 22.4, flex: 1 }}>
            Log out
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#FFD300" />
        </GradientBorderButton>
      </ScrollView>
    </SafeAreaView>
  );
}
