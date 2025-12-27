import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const announcements = [
  {
    id: '1',
    title: 'Materi Ujian Tengah Semester 2025/2026',
    course: 'PBD[IF2040]',
    description: 'Halo semua, berikut adalah materi yang akan diujikan pada UTS semester ini',
  },
  {
    id: '2',
    title: 'Materi Ujian Akhir Semester 2025/2026',
    course: 'BD[IF2240]',
    description: 'Halo semua, berikut adalah materi yang akan diujikan pada UAS semester ini',
  },
  {
    id: '3',
    title: 'Praktikum 3',
    course: 'MBD[II2250]',
    description: 'Praktikum 3 akan dilaksanakan pada minggu depan, jangan lupa untuk mempersiapkan diri ya!',
  },
]

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-white" 
      edges={['top']}
    >
      <View 
        className="flex-row justify-between items-center px-6 py-6 bg-white"
        style={{
          shadowColor: '#000', 
          shadowOpacity: 0.05,
          shadowRadius: 3,
          shadowOffset: { width: 0, height: 4 },
          zIndex: 10,
        }}
      >
          <View>
              <Text className="text-3xl font-bold text-primary-pink">
                  Hey User!
              </Text>
              <Text className="text-gray-700 text-base font-medium mt-2">
                  Welcome back
              </Text>
          </View>

          <Link href ="/(tabs)/more" asChild>
            <View className="w-14 h-14 bg-gray-300 rounded-full shadow-sm" />
          </Link>
      </View>

      {/* isi konten */}
      <ScrollView 
        className="flex-1 bg-background px-6 py-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >

        {/* what would you like to learn today */}
        <View className= "box-content w-full h-[120px] bg-white rounded-2xl"
          style={{
            shadowColor: '#000',
            elevation: 13.1,
            boxShadow: "0px 0px 13.1px rgba(0, 0, 0, 0.12)",
          }}>

          <Text className="text-left align-top pt-3 pl-4 font-bold text-grad-purple"
            style={{ 
              height: 70,
              width: 200,
              fontSize: 20,
              letterSpacing: -0.2,
              fontWeight: '700',
            }}
            >
            What would you like to learn today?
          </Text>

          {/* get started button */}
          <Link href="/(tabs)/lectures" asChild>
            <Pressable
              className="absolute bottom-5 left-4 bg-white rounded-xl border-2 border-violet-500 justify-center items-center"
              style={{ width: 120, height: 35 }}
            >
              <Text className="text-violet-500 font-bold text-center"
                style={{
                  fontSize: 16,
                  letterSpacing: -0.2,
                }}
                >
                Get Started
              </Text>
            </Pressable>
          </Link>

          {/* image */}
          <Image
            source={require('../../src/assets/images/illustration_home.png')}
            style={{
              width: 124,
              height: 124,
              position: 'absolute',
              right: 0,
              bottom: 0,
              top: 1,
              resizeMode: 'contain',
            }}
          />
        </View>

        {/* recent announcements */}
        <View className="mt-6">
          <Text className="text-lg font-semibold text-text-black mb-4"
            style={{
              fontSize: 16,
              letterSpacing: -0.2,
            }}
          >
            Recent announcements
          </Text>
          
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 10 }}
          >
            {announcements.map((items, index) => (
              <Link key={items.id || index} href="/(tabs)/bulletin" asChild>
                <Pressable
                  className="mr-4 bg-white rounded-xl overflow-hidden"
                  style={{
                    height: 184,
                    width: 310,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 13.1,
                    boxShadow: "0px 1px 0px rgba(0, 0, 0, 0.12)",
                  }}
                >
                  <Image
                    source={require('../../src/assets/images/announcement_img_1.png')}
                    style={{
                      width: '100%',
                      height: 75,
                      resizeMode: 'cover',
                    }}
                  />

                  <View className="flex-1 px-3 py-3">
                    <View className="flex-1 gap-y-2">
                      <Text 
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}
                        minimumFontScale={0.5}
                        className="text-left font-small text-text-black"
                        style={{
                          letterSpacing: -0.2,
                          fontSize: 14,
                        }}
                      >
                        {items.title}
                      </Text>

                      <View
                        className="self-start bg-pink-300 rounded-full px-3 h-5 justify-center"
                      >
                        <Text className="text-white font-medium"
                          numberOfLines={1}
                          style={{
                            fontSize: 14,
                            letterSpacing: -0.2,
                          }}>
                          {items.course}
                        </Text>
                      </View>

                      <Text className="text-text-black font-light"
                        numberOfLines={3}
                        style={{
                          fontSize: 14,
                          letterSpacing: -0.2,
                        }}>
                        {items.description}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </Link>
            ))}
          </ScrollView>
        </View>

        {/* quiz */}
        <View className="mt-6">
          <Text className="text-lg font-semibold text-text-black mb-4"
            style={{
              fontSize: 16,
              letterSpacing: -0.2,
            }}
          >
            Quiz yourself!
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {/* sql basics */}
            <Link href="/(tabs)/quiz" asChild>
                <Pressable
                  className="flex-1 mr-2 rounded-2xl overflow-hidden"
                  style={{
                    width: 164,
                    height: 124,
                  }}
                >
                  <LinearGradient
                    colors={['#FFA0CA', '#EB68A3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ flex: 1, borderRadius: 16}}
                  >
                    <Text className="text-white font-bold text-left"
                      style={{
                        fontSize: 20,
                        width: 90,
                        letterSpacing: -0.2,
                        marginTop: 16,
                        marginLeft: 16,
                      }}
                    >
                      SQL Basics
                    </Text>

                    <Image
                      source={require('../../src/assets/images/star_icon.png')}
                      className="right-0 bottom-0 absolute"
                    />
                  </LinearGradient>
                </Pressable>
            </Link>

            {/* advanced sql */}
            <Link href="/(tabs)/quiz" asChild>
              <Pressable
                className="flex-1 ml-2 rounded-2xl overflow-hidden"
                style={{
                  width: 164,
                  height: 124,
                }}
              >
                <LinearGradient
                    colors={['#C03694', '#F07FCC']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ flex: 1, borderRadius: 16}}
                  >
                    <Text className="text-white font-bold text-left"
                      style={{
                        fontSize: 20,
                        width: 93,
                        letterSpacing: -0.2,
                        marginTop: 16,
                        marginLeft: 16,
                      }}
                    >
                      SQL Advanced
                    </Text>

                    <Image
                      source={require('../../src/assets/images/trophy_icon.png')}
                      className="right-0 bottom-0 absolute"
                    />
                  </LinearGradient>
              </Pressable>
            </Link>
          </View>
        </View>

        {/* about us */}
        <View className="mt-6">
          <Text className="text-lg font-semibold text-text-black mb-4"
            style={{
              fontSize: 16,
              letterSpacing: -0.2,
            }}
          >
            Get to know us better!
          </Text>

          <View className="flex-column justify-between">
            <Link href="/(tabs)/more" asChild>
              <Pressable
                className="flex-1 w-full mb-2 rounded-xl overflow-hidden"
                style={{
                  shadowColor: '#000',
                  elevation: 13.1,
                  boxShadow: "0px 0px 13.1px rgba(0, 0, 0, 0.12)",
                  width: '100%',
                  height: 48,
                }}          
                >
                <LinearGradient
                  colors={['#9971E1', '#662ec7a3']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ flex: 1, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}
                >
                  <Text className="text-white font-bold text-center"
                    style={{
                      fontSize: 18,
                      letterSpacing: -0.2,
                    }}
                  >
                    What is database laboratory?
                  </Text>
                </LinearGradient>  
              </Pressable>
            </Link>

            <Link href="/(tabs)/more" asChild>
              <Pressable
                className="flex-1 w-full rounded-xl overflow-hidden"
                style={{
                  shadowColor: '#000',
                  elevation: 13.1,
                  boxShadow: "0px 0px 13.1px rgba(0, 0, 0, 0.12)",
                  width: '100%',
                  height: 48,
                }}          
                >
                <LinearGradient
                  colors={['#9971E1', '#662ec7a3']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ flex: 1, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}
                >
                  <Text className="text-white font-bold text-center"
                    style={{
                      fontSize: 18,
                      letterSpacing: -0.2,
                    }}
                  >
                    See our assistants and lecturers!
                  </Text>
                </LinearGradient>  
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
