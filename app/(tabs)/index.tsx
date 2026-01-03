import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../src/lib/firebase';
import { Announcement, getLatestAnnouncements } from '../../src/lib/firestore';

export default function Index() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userInitial, setUserInitial] = useState<string>('');
  const [userPhotoURL, setUserPhotoURL] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // Refresh user data when screen is focused
  useFocusEffect(
    useCallback(() => {
      const user = auth.currentUser;
      if (user?.displayName) {
        setUserName(user.displayName.split(' ')[0]); // First name only
        setUserInitial(user.displayName.charAt(0).toUpperCase());
      } else if (user?.email) {
        const emailName = user.email.split('@')[0];
        setUserName(emailName); // Use email username as fallback
        setUserInitial(emailName.charAt(0).toUpperCase());
      } else {
        setUserName(null); // Guest user
        setUserInitial('');
      }
      setUserPhotoURL(user?.photoURL || null);
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      // Fetch announcements from Firestore
      const fetchAnnouncements = async () => {
        try {
          const data = await getLatestAnnouncements(3);
          setAnnouncements(data);
        } catch (error) {
          console.error('Error fetching announcements:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchAnnouncements();
    }, [])
  );

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={['top']}
      testID="home-screen"
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
                  {userName ? `Hey ${userName}!` : 'Welcome!'}
              </Text>
              <Text className="text-gray-700 text-base font-medium mt-2">
                  {userName ? 'Welcome back' : 'Sign in to get started'}
              </Text>
          </View>

          <Link href="/more/edit-profile" asChild>
            <Pressable
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: userPhotoURL ? 'transparent' : (userInitial ? '#C03694' : '#D1D5DB'),
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 3,
                overflow: 'hidden',
              }}
            >
              {userPhotoURL ? (
                <Image
                  source={{ uri: userPhotoURL }}
                  style={{ width: 56, height: 56 }}
                  resizeMode="cover"
                />
              ) : userInitial ? (
                <Text style={{ color: 'white', fontSize: 24, fontWeight: '700' }}>
                  {userInitial}
                </Text>
              ) : (
                <Ionicons name="person" size={28} color="#9CA3AF" />
              )}
            </Pressable>
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

          {loading ? (
            <View style={{ height: 184, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#C03694" />
            </View>
          ) : announcements.length === 0 ? (
            <View style={{ height: 184, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#757575' }}>No announcements yet</Text>
            </View>
          ) : (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 10 }}
            >
              {announcements.map((item, index) => (
                <Link key={item.id || index} href={`/bulletin/${item.slug}` as any} asChild>
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

                    <View className="flex-1 px-3 py-2">
                      <View className="flex-1 gap-y-1">
                        <Text
                          adjustsFontSizeToFit={true}
                          numberOfLines={2}
                          minimumFontScale={0.7}
                          className="text-left font-semibold text-text-black"
                          style={{
                            letterSpacing: -0.2,
                            fontSize: 16,
                            lineHeight: 20,
                          }}
                        >
                          {item.title}
                        </Text>

                        <View
                          className="self-start rounded-full px-2 h-4 justify-center"
                          style={{ backgroundColor: '#6D28D9' }}
                        >
                          <Text className="text-white font-medium"
                            numberOfLines={1}
                            style={{
                              fontSize: 11,
                              letterSpacing: -0.2,
                            }}>
                            {item.Matkul || item.category}
                          </Text>
                        </View>

                        <Text className="text-text-black font-light"
                          numberOfLines={2}
                          style={{
                            fontSize: 12,
                            letterSpacing: -0.2,
                            lineHeight: 15,
                            marginTop: 2,
                          }}>
                          {item.content}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                </Link>
              ))}
            </ScrollView>
          )}
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
            <Link href="/quiz/basic" asChild>
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
            <Link href="/quiz/advanced" asChild>
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
            <Link href="/more/purpose" asChild>
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

            <Link href="/more/assistants" asChild>
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
