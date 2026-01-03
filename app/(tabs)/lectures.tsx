import GradientText from '@/components/Global/GradientText';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageSourcePropType, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../src/lib/firebase';
import { getLectures, Lecture } from '../../src/lib/firestore';

// Local image mapping based on document ID
const lectureImages: Record<string, ImageSourcePropType> = {
  'basis-data': require('../../src/assets/images/bd.png'),
  'manajemen-basis-data': require('../../src/assets/images/mbd.png'),
  'pemodelan-basis-data': require('../../src/assets/images/pbd.png'),
  'sistem-basis-data': require('../../src/assets/images/sbd.png'),
};

export default function Lectures() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      router.replace('/(auth)/login');
      return;
    }

    const fetchLectures = async () => {
      try {
        const data = await getLectures();
        setLectures(data);
      } catch (error) {
        console.error('Error fetching lectures:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, []);

  // Don't render if not authenticated
  if (!auth.currentUser) {
    return null;
  }

  // Render lecture cards in pairs (2 per row)
  const renderLectureRows = () => {
    const rows = [];
    for (let i = 0; i < lectures.length; i += 2) {
      rows.push(
        <View key={i} className="flex-row justify-between" style={{ marginBottom: 24 }}>
          {lectures.slice(i, i + 2).map((lecture, idx) => (
            <Link key={lecture.id} href={`/lectures/${lecture.slug}` as any} asChild>
              <Pressable
                testID={`lecture-item-${i + idx}`}
                className="bg-white rounded-2xl border-2 border-primary-pink overflow-hidden"
                style={{
                  width: 170,
                  height: 170,
                  position: 'relative',
                  justifyContent: 'flex-start',
                  padding: 0,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 13.1,
                  boxShadow: "0px 1px 0px rgba(0, 0, 0, 0.12)",
                }}
              >
                <Image
                  source={lectureImages[lecture.slug] || require('../../src/assets/images/bd.png')}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    width: '100%',
                    height: 110,
                    resizeMode: 'cover',
                  }}
                />
                <View style={{ marginTop: 118 }}>
                  <Text
                    className="font-extrabold text-left text-primary-pink"
                    style={{ letterSpacing: -0.2, fontSize: 15, left: 4 }}
                    numberOfLines={2}
                  >
                    {lecture.code}{"\n"}{lecture.title}
                  </Text>
                </View>
              </Pressable>
            </Link>
          ))}
          {/* Add empty space if odd number of lectures */}
          {i + 1 === lectures.length && <View style={{ width: 170 }} />}
        </View>
      );
    }
    return rows;
  };

  return (
    <SafeAreaView className="flex-1 bg-background"
      edges={['top']}
      testID="lectures-screen"
    >
      {/* header */}
      <View
        className="w-full bg-[#C03694] p-4 justify-center items-center"
        style={{
          height: 163,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          position: 'relative',
        }}
      >
        <Text className="text-white text-3xl font-bold">
          Lectures Overview
        </Text>

        <View
          className="box-content bg-white rounded-2xl justify-center pl-3"
          style={{
            position: 'absolute',
            left: 60,
            bottom: -39,
            width: 275,
            height: 85,
            zIndex: 20,

            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.12,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <GradientText
            textStyle={{
              fontSize: 16,
              letterSpacing: -0.2,
              width: 185,
              fontWeight: '600'
            }}
          >
            Hi there! Start your learning experience by choosing a course below
          </GradientText>

          <Image
            source={require('@/assets/images/illustration_lectures.png')}
            style={{
              width: 85,
              height: 85,
              position: 'absolute',
              right: 3,
              bottom: 0,
              top: 0,
              resizeMode: 'contain',
            }}
          />
        </View>
      </View>

      {/* isi konten */}
      <ScrollView
        className="flex-1 bg-background px-5"
        contentContainerStyle={{
          paddingTop: 39 + 16,
          paddingBottom: 30,
        }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#C03694" />
          </View>
        ) : lectures.length === 0 ? (
          <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#757575' }}>No lectures available</Text>
          </View>
        ) : (
          <View className="flex-col">
            {renderLectureRows()}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
