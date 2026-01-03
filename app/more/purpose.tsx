import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Purpose() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']} testID="purpose-screen">
      {/* Header */}
      <View className="px-5 py-4 flex-row items-center">
        <Pressable
          testID="purpose-back"
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
            About database laboratory
          </Text>
        </View>
        <View style={{ width: 34 }} />
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Image */}
        <View
          style={{
            width: '100%',
            height: 200,
            borderRadius: 12,
            overflow: 'hidden',
            marginBottom: 20,
          }}
        >
          <Image
            source={require('../../src/assets/images/LogoBasdat.png')}
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
          />
        </View>

        {/* Description Card */}
        <LinearGradient
          colors={['#F97316', '#EC4899', '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 16,
            padding: 2,
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 14,
              padding: 20,
            }}
          >
            <Text
              style={{
                color: '#374151',
                fontSize: 14,
                lineHeight: 22,
                textAlign: 'justify',
              }}
            >
              LAB BASDAT — Laboratorium yang berfokus pada riset dan pengembangan sistem basis data, meliputi kegiatan akademik, praktikum, dan penelitian mahasiswa di bidang data management.
            </Text>
            <Text
              style={{
                color: '#374151',
                fontSize: 14,
                lineHeight: 22,
                textAlign: 'justify',
                marginTop: 12,
              }}
            >
              Kegiatan meliputi asistensi kelas, praktikum, serta pengembangan riset berbasis data. Lab Basdat juga menjadi wadah bagi mahasiswa untuk mengimplementasikan konsep teori ke dalam solusi nyata di bidang teknologi informasi dan data analytics.
            </Text>
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}
