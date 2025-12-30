import React, { use, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import GradientText from '@/components/Global/GradientText';

type Material = {
    id: string;
    title: string;
    pdfUrl: string; //mock PDF URL
}

type Course = {
    id: string;
    title: string;
    materials: Material[];
}

// mock data
const COURSES: Record<string, Course> = {
  course1: {
    id: 'course1',
    title: 'Pemodelan Basis Data',
    materials: [
      {
        id: 'intro',
        title: 'Introduction to database',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
      {
        id: 'er',
        title: 'ER Diagram',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
      {
        id: 'sql',
        title: 'SQL',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
    ],
  },
  course2: { id: 'course2', title: 'Manajemen Basis Data', materials: [] },
  course3: { id: 'course3', title: 'Basis Data', materials: [] },
  course4: { id: 'course4', title: 'Sistem Basis Data', materials: [] },
};

function PdfPreview({ pdfUrl }: { pdfUrl: string }) {
    const viewerUrl = `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(pdfUrl)}`;

    return (
        <View
            style={{
                height: 260,
                borderRadius: 12,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: '#E5E7EB',
                backgroundColor: 'white',
            }}
        >
            <WebView
                source={{ uri: viewerUrl }}
                style={{ flex: 1 }}
                originWhitelist={['*']}
            />
        </View>
    )
}

export default function LectureDetail() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const course = COURSES[id ?? 'course1'] ?? {
        id: String(id ?? 'unknown'),
        title: 'Lecture Detail',
        materials: [],
    }

    const [query, setQuery] = useState('');
    const [openId, setOpenId] = useState<string | null>(null);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return course.materials;
        return course.materials.filter(m => m.title.toLowerCase().includes(q));
    }, [query, course.materials]);

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />
                <View
                    className="px-5 py-4 flex-row items-center">
                    <Pressable onPress={() => router.back()}
                        style={{ paddingVertical: 6, paddingRight: 12}}>
                        <Ionicons name="chevron-back" size={22} color="#6D28D9" />
                    </Pressable>

                    <View className="flex-1">
                        <Text className="text-center font-extrabold" style={{ color: '#652EC7', fontSize: 20 }}>
                            {course.title}
                        </Text>
                    </View>
                    <View style={{ width: 34 }} />
                </View>

                {/* search */}
                <View className="px-5">
                    <View
                        className="bg-white rounded-xl px-4 flex-row items-center"
                        style={{ height: 44, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 12 }}
                    >
                        <TextInput
                            value={query}
                            onChangeText={setQuery}
                            placeholder="Search materials..."
                            style={{ flex: 1, color: '#111827' }}
                        />
                        <Ionicons name="search" size={18} color="#9CA3AF" />    
                    </View>
                </View>

                {/* materials */}
                <ScrollView
                    className="flex-1 px-5"
                    contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
                >
                    {filtered.map((m) => {
                        const isOpen = openId === m.id;

                        return (
                            <View 
                                key={m.id}
                                style={{ marginBottom: 14}}
                            >
                                <Pressable
                                    onPress={() => setOpenId((prev) => (prev === m.id ? null : m.id))}
                                    className="bg-neutral-50 rounded-2xl"
                                    style={{
                                        borderWidth: 1,
                                        borderColor: isOpen ? '#F59E0B' : '#6D28D9',
                                        paddingHorizontal: 14,
                                        paddingVertical: 14,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 3,
                                        elevation: 4,
                                    }}
                                >
                                    <View className="flex-row items-center justify-between">
                                        <GradientText
                                            textStyle={{ fontSize: 16, flex: 1, fontWeight: '800' }}
                                        >
                                            {m.title}
                                        </GradientText>

                                        <Ionicons
                                            name={isOpen ? 'chevron-up' : 'chevron-down'}
                                            size={18}
                                            color="#F59E0B"
                                        />
                                    </View>

                                    {isOpen && (
                                        <View style={{ marginTop: 12 }}>
                                            <PdfPreview pdfUrl={m.pdfUrl} />
                                        </View>
                                    )}
                                </Pressable>
                            </View>
                        );
                    })}

                    {filtered.length === 0 && (
                        <Text style={{ color: '#6B7280', textAlign: 'center', marginTop: 30 }}>
                            No materials found.
                        </Text>
                    )}
                </ScrollView>
        </SafeAreaView>
    );
}