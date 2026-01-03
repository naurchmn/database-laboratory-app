import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAnnouncementBySlug, Announcement } from '../../src/lib/firestore';

export default function AnnouncementDetail() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      if (!slug) return;
      try {
        const data = await getAnnouncementBySlug(slug);
        setAnnouncement(data);
      } catch (error) {
        console.error('Error fetching announcement:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [slug]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center" edges={['top']}>
        <ActivityIndicator size="large" color="#C03694" />
      </SafeAreaView>
    );
  }

  if (!announcement) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center" edges={['top']}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={{ color: '#757575' }}>Announcement not found</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: '#C03694', fontWeight: '600' }}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']} testID="bulletin-detail-screen">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="px-5 py-4 flex-row items-center">
        <Pressable
          onPress={() => router.back()}
          style={{ paddingVertical: 6, paddingRight: 12 }}
          testID="bulletin-detail-back"
        >
          <Ionicons name="chevron-back" size={22} color="#6D28D9" />
        </Pressable>

        <View className="flex-1">
          <Text
            className="text-center font-extrabold"
            style={{ color: '#652EC7', fontSize: 18 }}
            numberOfLines={1}
          >
            Announcement
          </Text>
        </View>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Image */}
        <Image
          source={require('../../src/assets/images/announcement_img_1.png')}
          style={{
            width: '100%',
            height: 200,
            borderRadius: 16,
            resizeMode: 'cover',
          }}
        />

        {/* Title */}
        <Text
          className="font-bold text-text-black mt-4"
          style={{
            fontSize: 22,
            lineHeight: 28,
            letterSpacing: -0.3,
          }}
        >
          {announcement.title}
        </Text>

        {/* Matkul & Date */}
        <View className="flex-row items-center gap-x-3 mt-3">
          <View className="bg-pink-300 rounded-full px-3 py-1">
            <Text className="text-white font-medium" style={{ fontSize: 12 }}>
              {announcement.Matkul || announcement.category}
            </Text>
          </View>
          <Text style={{ fontSize: 13, color: '#6B7280' }}>
            {announcement.date}
          </Text>
        </View>

        {/* Content */}
        <Text
          className="text-text-black mt-4"
          style={{
            fontSize: 15,
            lineHeight: 24,
            letterSpacing: -0.2,
          }}
        >
          {announcement.content}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
