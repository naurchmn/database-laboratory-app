import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getMembers, Member } from '../../src/lib/firestore';

type TabType = 'lecturer' | 'assistant';

export default function Assistants() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('lecturer');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getMembers();
        setMembers(data);
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const filteredMembers = members.filter((member) => {
    if (activeTab === 'lecturer') {
      return member.role === 'dosen';
    }
    return member.role === 'asisten';
  });

  const openEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="px-5 py-4 flex-row items-center">
        <Pressable
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
            Members
          </Text>
        </View>
        <View style={{ width: 34 }} />
      </View>

      {/* Tabs */}
      <View className="flex-row justify-center px-6 mb-6">
        <Pressable
          onPress={() => setActiveTab('lecturer')}
          style={{
            backgroundColor: activeTab === 'lecturer' ? '#6D28D9' : 'white',
            borderWidth: 2,
            borderColor: '#6D28D9',
            borderRadius: 20,
            paddingHorizontal: 24,
            paddingVertical: 10,
            marginRight: 12,
          }}
        >
          <Text
            style={{
              color: activeTab === 'lecturer' ? 'white' : '#6D28D9',
              fontWeight: '600',
              fontSize: 14,
            }}
          >
            Lecturer
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('assistant')}
          style={{
            backgroundColor: activeTab === 'assistant' ? '#6D28D9' : 'white',
            borderWidth: 2,
            borderColor: '#6D28D9',
            borderRadius: 20,
            paddingHorizontal: 24,
            paddingVertical: 10,
          }}
        >
          <Text
            style={{
              color: activeTab === 'assistant' ? 'white' : '#6D28D9',
              fontWeight: '600',
              fontSize: 14,
            }}
          >
            Assistant
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#C03694" />
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row flex-wrap justify-between">
            {filteredMembers.map((member) => (
              <View
                key={member.id}
                style={{
                  width: '48%',
                  marginBottom: 20,
                  alignItems: 'center',
                }}
              >
                {/* Profile Image */}
                <View
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: 12,
                    borderWidth: 3,
                    borderColor: '#6D28D9',
                    overflow: 'hidden',
                    backgroundColor: '#E5E7EB',
                  }}
                >
                  {member.imageUrl ? (
                    <Image
                      source={{ uri: member.imageUrl }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="flex-1 justify-center items-center">
                      <Ionicons name="person" size={60} color="#9CA3AF" />
                    </View>
                  )}
                </View>

                {/* Name */}
                <Text
                  style={{
                    color: '#1F2937',
                    fontSize: 13,
                    fontWeight: '600',
                    marginTop: 8,
                    textAlign: 'center',
                  }}
                  numberOfLines={2}
                >
                  {member.name}
                </Text>

                {/* Email (for lecturers) or Info (for assistants) */}
                {activeTab === 'lecturer' && member.email ? (
                  <Pressable
                    onPress={() => openEmail(member.email!)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 4,
                      backgroundColor: 'white',
                      borderWidth: 1,
                      borderColor: '#6D28D9',
                      borderRadius: 8,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                    }}
                  >
                    <Ionicons name="mail-outline" size={12} color="#6D28D9" />
                    <Text
                      style={{
                        color: '#6D28D9',
                        fontSize: 10,
                        marginLeft: 4,
                      }}
                      numberOfLines={1}
                    >
                      {member.email}
                    </Text>
                  </Pressable>
                ) : activeTab === 'assistant' && member.info ? (
                  <Text
                    style={{
                      color: '#757575',
                      fontSize: 12,
                      marginTop: 4,
                      textAlign: 'center',
                    }}
                  >
                    {member.info}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>

          {filteredMembers.length === 0 && (
            <View className="items-center mt-10">
              <Text style={{ color: '#757575', fontSize: 14 }}>
                No {activeTab === 'lecturer' ? 'lecturers' : 'assistants'} found
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
