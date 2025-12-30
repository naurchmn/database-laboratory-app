import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientText from '@/components/Global/GradientText';

export default function Bulletin() {
  return (
    <SafeAreaView className="bg-background flex-1" edges={['top']}>
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
                Lab's Bulletin
              </Text>
      
              <View
                className="box-content bg-white rounded-2xl justify-center pl-3"
                style={{
                  position: 'absolute',
                  left:60,
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
                  textStyle={{ fontSize: 16,
                    letterSpacing: -0.2,
                    width: 185,
                    fontWeight: '600'
                  }}
                >
                  Find the latest updates, exam details, and learning materials all in one place
                </GradientText>
      
                <Image
                  source={require('@/assets/images/illustration_bulletin.png')}
                  style={{
                    width: 85,
                    height: 95,
                    position: 'absolute',
                    right: 3,
                    bottom: 0,
                    top: 0,
                    resizeMode: 'contain',
                  }}
                />
              </View>
            </View>
    </SafeAreaView>
  );
}