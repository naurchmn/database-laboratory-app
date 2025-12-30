import { Link } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import GradientText from '@/components/Global/GradientText';
import { getAnnouncements, Announcement } from '../../src/lib/firestore';

type FilterType = 'Jadwal' | 'Materi';
type SortType = 'newest' | 'oldest';
type CourseType = 'all' | 'IF2040' | 'II2250' | 'IF2250' | 'IF3140';

// Helper function to parse Indonesian date format "15 September 2025"
const parseIndonesianDate = (dateStr: string): number => {
  const monthMap: Record<string, string> = {
    'januari': '01', 'februari': '02', 'maret': '03', 'april': '04',
    'mei': '05', 'juni': '06', 'juli': '07', 'agustus': '08',
    'september': '09', 'oktober': '10', 'november': '11', 'desember': '12',
    // English months as fallback
    'january': '01', 'february': '02', 'march': '03', 'may': '05',
    'june': '06', 'july': '07', 'august': '08', 'october': '10', 'december': '12'
  };

  const parts = dateStr.split(' ');
  if (parts.length !== 3) return 0;

  const day = parts[0].padStart(2, '0');
  const month = monthMap[parts[1].toLowerCase()] || '01';
  const year = parts[2];

  return new Date(`${year}-${month}-${day}`).getTime();
};

export default function Bulletin() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('Jadwal');
  const [sortOrder, setSortOrder] = useState<SortType>('newest');
  const [courseFilter, setCourseFilter] = useState<CourseType>('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [tempSortOrder, setTempSortOrder] = useState<SortType>('newest');
  const [tempCourseFilter, setTempCourseFilter] = useState<CourseType>('all');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const filteredAnnouncements = useMemo(() => {
    let filtered = announcements.filter(
      (item) => item.category.toLowerCase() === activeFilter.toLowerCase()
    );

    // Filter by course if not 'all'
    if (courseFilter !== 'all') {
      filtered = filtered.filter((item) => item.Matkul === courseFilter);
    }

    // Sort by date using helper function
    filtered = [...filtered].sort((a, b) => {
      const dateA = parseIndonesianDate(a.date);
      const dateB = parseIndonesianDate(b.date);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [announcements, activeFilter, sortOrder, courseFilter]);

  const openFilterModal = () => {
    setTempSortOrder(sortOrder);
    setTempCourseFilter(courseFilter);
    setShowFilterModal(true);
  };

  const applyFilter = () => {
    setSortOrder(tempSortOrder);
    setCourseFilter(tempCourseFilter);
    setShowFilterModal(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
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
          Lab's bulletin
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

      {/* Fixed Filter tabs */}
      <View
        className="bg-background px-5 flex-row items-center gap-x-3"
        style={{ paddingTop: 39 + 16, paddingBottom: 10 }}
      >
        <Pressable onPress={openFilterModal}>
          <Ionicons name="options-outline" size={24} color="#6D28D9" />
        </Pressable>

        <Pressable
          onPress={() => setActiveFilter('Jadwal')}
          style={{
            backgroundColor: activeFilter === 'Jadwal' ? '#6D28D9' : 'transparent',
            borderWidth: activeFilter === 'Jadwal' ? 0 : 2,
            borderColor: '#6D28D9',
            borderRadius: 20,
            paddingHorizontal: 24,
            paddingVertical: 8,
          }}
        >
          <Text
            style={{
              color: activeFilter === 'Jadwal' ? 'white' : '#6D28D9',
              fontWeight: '600',
              fontSize: 14,
            }}
          >
            Jadwal
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveFilter('Materi')}
          style={{
            backgroundColor: activeFilter === 'Materi' ? '#6D28D9' : 'transparent',
            borderWidth: activeFilter === 'Materi' ? 0 : 2,
            borderColor: '#6D28D9',
            borderRadius: 20,
            paddingHorizontal: 24,
            paddingVertical: 8,
          }}
        >
          <Text
            style={{
              color: activeFilter === 'Materi' ? 'white' : '#6D28D9',
              fontWeight: '600',
              fontSize: 14,
            }}
          >
            Materi
          </Text>
        </Pressable>
      </View>

      {/* Scrollable content */}
      <ScrollView
        className="flex-1 bg-background px-5"
        contentContainerStyle={{
          paddingTop: 8,
          paddingBottom: 30,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center">
          {loading ? (
            <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#C03694" />
            </View>
          ) : filteredAnnouncements.length === 0 ? (
            <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#757575' }}>No {activeFilter.toLowerCase()} available</Text>
            </View>
          ) : (
            <View className="flex-col gap-y-3 w-full">
              {filteredAnnouncements.map((item) => (
                <Link key={item.id} href={`/bulletin/${item.slug}` as any} asChild>
                  <Pressable
                    className="bg-white rounded-xl overflow-hidden flex-row self-center"
                    style={{
                      width: '100%',
                      maxWidth: 380,
                      borderWidth: 1.5,
                      borderColor: '#E5E7EB',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.06,
                      shadowRadius: 3,
                      elevation: 1,
                    }}
                  >
                    {/* Left image */}
                    <Image
                      source={require('../../src/assets/images/announcement_img_1.png')}
                      style={{
                        width: 100,
                        height: 115,
                        resizeMode: 'cover',
                      }}
                    />

                    {/* Right content */}
                    <View className="flex-1 p-2 justify-between">
                      <View>
                        {/* Title and date row */}
                        <View className="flex-row justify-between items-start">
                          <Text
                            numberOfLines={1}
                            className="font-bold text-text-black flex-1"
                            style={{
                              fontSize: 14,
                              letterSpacing: -0.2,
                            }}
                          >
                            {item.alt || item.title.split(' - ')[0]}
                          </Text>
                          <Text style={{ fontSize: 9, color: '#9CA3AF', marginLeft: 4 }}>
                            {item.date}
                          </Text>
                        </View>

                        {/* Matkul badge */}
                        <View
                          className="self-start rounded-md mt-1"
                          style={{
                            backgroundColor: '#6D28D9',
                            paddingHorizontal: 6,
                            paddingVertical: 1,
                          }}
                        >
                          <Text className="text-white font-medium" style={{ fontSize: 9 }}>
                            {item.Matkul || item.category}
                          </Text>
                        </View>

                        {/* Content preview */}
                        <Text
                          numberOfLines={2}
                          className="text-gray-600 mt-1"
                          style={{
                            fontSize: 11,
                            lineHeight: 14,
                          }}
                        >
                          {item.content}
                        </Text>
                      </View>

                      {/* See more button */}
                      <View className="self-end">
                        <LinearGradient
                          colors={['#F97316', '#EC4899', '#8B5CF6']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={{
                            borderRadius: 10,
                            paddingHorizontal: 10,
                            paddingVertical: 3,
                          }}
                        >
                          <Text className="text-white font-semibold" style={{ fontSize: 10 }}>
                            See more
                          </Text>
                        </LinearGradient>
                      </View>
                    </View>
                  </Pressable>
                </Link>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View
            className="bg-white rounded-t-3xl px-6 pt-4 pb-8"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 10,
            }}
          >
            {/* Handle bar */}
            <View className="self-center mb-4" style={{ width: 40, height: 4, backgroundColor: '#D1D5DB', borderRadius: 2 }} />

            {/* Title */}
            <Text className="font-bold text-xl mb-4" style={{ color: '#C03694' }}>
              Bulletin's filter
            </Text>

            {/* Sort by section */}
            <Text className="font-semibold text-base mb-3" style={{ color: '#374151' }}>
              Sort by
            </Text>

            <View className="flex-row gap-x-3 mb-5">
              <Pressable
                onPress={() => setTempSortOrder('oldest')}
                style={{
                  borderWidth: 2,
                  borderColor: '#C03694',
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  backgroundColor: tempSortOrder === 'oldest' ? '#FCE7F3' : 'transparent',
                }}
              >
                <Text style={{ color: '#C03694', fontWeight: '500', fontSize: 13 }}>
                  Oldest to Newest
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setTempSortOrder('newest')}
                style={{
                  borderWidth: 2,
                  borderColor: '#C03694',
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  backgroundColor: tempSortOrder === 'newest' ? '#FCE7F3' : 'transparent',
                }}
              >
                <Text style={{ color: '#C03694', fontWeight: '500', fontSize: 13 }}>
                  Newest to Oldest
                </Text>
              </Pressable>
            </View>

            {/* Course section */}
            <Text className="font-semibold text-base mb-3" style={{ color: '#374151' }}>
              Course
            </Text>

            <View className="flex-row flex-wrap gap-3 mb-8">
              {(['IF2040', 'II2250', 'IF2250', 'IF3140'] as CourseType[]).map((course) => (
                <Pressable
                  key={course}
                  onPress={() => setTempCourseFilter(tempCourseFilter === course ? 'all' : course)}
                  style={{
                    borderWidth: 2,
                    borderColor: '#C03694',
                    borderRadius: 20,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    backgroundColor: tempCourseFilter === course ? '#FCE7F3' : 'transparent',
                  }}
                >
                  <Text style={{ color: '#C03694', fontWeight: '500', fontSize: 13 }}>
                    {course === 'IF2040' ? 'PBD [IF2040]' :
                     course === 'II2250' ? 'MBD [II2250]' :
                     course === 'IF2250' ? 'BD [IF2250]' :
                     'SBD [IF3140]'}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Buttons */}
            <View className="flex-row gap-x-4">
              <Pressable
                onPress={() => setShowFilterModal(false)}
                className="flex-1 items-center justify-center"
                style={{
                  borderWidth: 2,
                  borderColor: '#6D28D9',
                  borderRadius: 12,
                  paddingVertical: 12,
                }}
              >
                <Text style={{ color: '#C03694', fontWeight: '600', fontSize: 15 }}>
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                onPress={applyFilter}
                className="flex-1 items-center justify-center overflow-hidden"
                style={{
                  borderRadius: 12,
                }}
              >
                <LinearGradient
                  colors={['#F97316', '#EC4899', '#8B5CF6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    width: '100%',
                    paddingVertical: 14,
                    alignItems: 'center',
                    borderRadius: 12,
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>
                    Apply
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
