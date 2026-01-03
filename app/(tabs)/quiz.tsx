import GradientText from '@/components/Global/GradientText';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaView className="flex-1 bg-background" edges={['top']} testID="quiz-screen">
      {/* Header */}
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
          SQL quiz
        </Text>

        {/* Info Card - overlapping */}
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
            Level up your knowledge — take a quiz and reach your best score
          </GradientText>

          <Image
            source={require('../../src/assets/images/illustration_quiz.png')}
            style={{
              width: 75,
              height: 75,
              position: 'absolute',
              right: 8,
              top: 5,
            }}
            resizeMode="contain"
          />
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingTop: 39 + 16, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* SQL Basic Card */}
        <Pressable
          onPress={() => router.push('/quiz/basic')}
          style={{ marginBottom: 29 }}
        >
          <LinearGradient
            colors={['#FFA0CA', '#EB68A3']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              borderRadius: 6,
              height: 124,
              paddingHorizontal: 12,
              paddingVertical: 10,
              shadowColor: 'rgba(255, 160, 202, 0.44)',
              shadowOffset: { width: -8, height: 8 },
              shadowOpacity: 1,
              shadowRadius: 10,
              elevation: 8,
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 20,
                fontWeight: '700',
                lineHeight: 28,
                marginBottom: 7,
              }}
            >
              SQL basic
            </Text>
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                fontWeight: '400',
                lineHeight: 22.4,
              }}
            >
              A quick challenge to assess your understanding of essential SQL commands and database basics
            </Text>
          </LinearGradient>
        </Pressable>

        {/* SQL Advanced Card */}
        <Pressable
          onPress={() => router.push('/quiz/advanced')}
        >
          <LinearGradient
            colors={['#F07FCC', '#C03694']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              borderRadius: 6,
              height: 124,
              paddingHorizontal: 12,
              paddingVertical: 10,
              shadowColor: 'rgba(240, 127, 204, 0.44)',
              shadowOffset: { width: -8, height: 8 },
              shadowOpacity: 1,
              shadowRadius: 10,
              elevation: 8,
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 20,
                fontWeight: '700',
                lineHeight: 28,
                marginBottom: 13,
              }}
            >
              SQL advanced
            </Text>
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                fontWeight: '400',
                lineHeight: 22.4,
              }}
            >
              Challenge your advanced SQL skills with complex queries and optimization tasks
            </Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
