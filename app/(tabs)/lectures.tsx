import GradientText from '@/components/Global/GradientText';
import { Link } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Lectures() {
  return (
    <SafeAreaView className="flex-1 bg-background" 
      edges={['top']}
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
      <View
        className="flex-1 bg-background px-5 py-6"
        style={{
          paddingTop: 39 + 16,
        }}
      >
        <View className="flex-col">
          <View
            className="flex-row justify-between"
          >
            <Link href="/lectures/course1" asChild>
              <Pressable
                className="bg-white rounded-2xl border-2 border-primary-pink overflow-hidden"
                style={{
                  width:170,
                  height:170,
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
                  source={require('@/assets/images/pbd.png')}
                  style={{
                    position:'absolute',
                    top:0,
                    left:0,
                    right:0,
                    width:'100%',
                    height:110,
                    resizeMode: 'cover',
                  }}
                />
                <View style={{ marginTop: 118}}>
                  <Text 
                    className="font-extrabold text-left text-primary-pink"
                    style={{ letterSpacing: -0.2, fontSize: 15, left: 4}}  
                  >
                    IF2040{"\n"}Pemodelan Basis Data
                  </Text>
                </View>
              </Pressable>
            </Link>

            <Link href="/lectures/course2" asChild>
              <Pressable
                className="bg-white rounded-2xl border-2 border-primary-pink overflow-hidden"
                style={{
                  width:170,
                  height:170,
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
                  source={require('@/assets/images/mbd.png')}
                  style={{
                    position:'absolute',
                    top:0,
                    left:0,
                    right:0,
                    width:'100%',
                    height:110,
                    resizeMode: 'cover',
                  }}
                />
                <View style={{ marginTop: 118}}>
                  <Text 
                    className="font-extrabold text-left text-primary-pink"
                    style={{ letterSpacing: -0.2, fontSize: 15, left: 4}}  
                  >
                    II250{"\n"}Manajemen Basis Data
                  </Text>
                </View>
              </Pressable>
            </Link>
          </View>

          <View
            className="flex-row justify-between mt-6"
          >
            <Link href="/lectures/course3" asChild>
              <Pressable
                className="bg-white rounded-2xl border-2 border-primary-pink overflow-hidden"
                style={{
                  width:170,
                  height:170,
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
                  source={require('@/assets/images/bd.png')}
                  style={{
                    position:'absolute',
                    top:0,
                    left:0,
                    right:0,
                    width:'100%',
                    height:110,
                    resizeMode: 'cover',
                  }}
                />
                <View style={{ marginTop: 118}}>
                  <Text 
                    className="font-extrabold text-left text-primary-pink"
                    style={{ letterSpacing: -0.2, fontSize: 15, left: 4}}  
                  >
                    IF2240{"\n"}Basis Data
                  </Text>
                </View>
              </Pressable>
            </Link>

            <Link href="/lectures/course4" asChild>
              <Pressable
                className="bg-white rounded-2xl border-2 border-primary-pink overflow-hidden"
                style={{
                  width:170,
                  height:170,
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
                  source={require('@/assets/images/sbd.png')}
                  style={{
                    position:'absolute',
                    top:0,
                    left:0,
                    right:0,
                    width:'100%',
                    height:110,
                    resizeMode: 'cover',
                  }}
                />
                <View style={{ marginTop: 118}}>
                  <Text 
                    className="font-extrabold text-left text-primary-pink"
                    style={{ letterSpacing: -0.2, fontSize: 15, left: 4}}  
                  >
                    IF3140{"\n"}Sistem Basis Data
                  </Text>
                </View>
              </Pressable>
            </Link>
          </View>

        </View>
      </View>
    </SafeAreaView>
  );
}