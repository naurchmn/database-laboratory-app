import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../src/lib/firebase';
import { getQuizzesByCategory, Quiz } from '../../src/lib/firestore';

interface UserAnswer {
  questionIndex: number;
  selectedTokens: string[];
}

interface QuizResult {
  questionIndex: number;
  isCorrect: boolean;
  userAnswer: string[];
  correctAnswer: string[];
  title: string;
}

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Collapsible Question Card Component
function QuestionReviewCard({ result, isExpanded, onToggle }: {
  result: QuizResult;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      onPress={onToggle}
      style={{
        backgroundColor: '#EB68A3',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
      }}
    >
      {/* Header - always visible */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 16,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '700', marginBottom: 4 }}>
            Question {result.questionIndex + 1}
          </Text>
          <Text style={{ color: 'white', fontSize: 14 }} numberOfLines={1}>
            {result.title}
          </Text>
        </View>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="white"
        />
      </View>

      {/* Expanded content */}
      {isExpanded && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          {/* User's Answer */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: 'white', fontSize: 12, fontWeight: '600', marginBottom: 4 }}>
              Your answer:
            </Text>
            <View style={{
              backgroundColor: 'white',
              borderRadius: 8,
              padding: 10,
            }}>
              <Text style={{ color: result.isCorrect ? '#166534' : '#991B1B', fontSize: 13 }}>
                {result.userAnswer.join(' ')}
              </Text>
            </View>
          </View>

          {/* Correct Answer */}
          <View>
            <Text style={{ color: 'white', fontSize: 12, fontWeight: '600', marginBottom: 4 }}>
              Correct answer:
            </Text>
            <View style={{
              backgroundColor: 'white',
              borderRadius: 8,
              padding: 10,
            }}>
              <Text style={{ color: '#166534', fontSize: 13 }}>
                {result.correctAnswer.join(' ')}
              </Text>
            </View>
          </View>

          {/* Status indicator */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: result.isCorrect ? '#10B981' : '#EF4444',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 8,
              }}
            >
              <Ionicons
                name={result.isCorrect ? 'checkmark' : 'close'}
                size={14}
                color="white"
              />
            </View>
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
              {result.isCorrect ? 'Correct' : 'Incorrect'}
            </Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}

export default function QuizDetail() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const { width: windowWidth } = useWindowDimensions();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [availableTokens, setAvailableTokens] = useState<string[]>([]);
  const [userAnswers, setUserAnswers] = useState<Map<number, string[]>>(new Map());
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!auth.currentUser) {
      router.replace('/(auth)/login');
      return;
    }

    const fetchQuizzes = async () => {
      try {
        const data = await getQuizzesByCategory(category || 'basic');
        setQuizzes(data);
        if (data.length > 0) {
          setAvailableTokens(shuffleArray(data[0].tokens));
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [category]);

  const currentQuiz = quizzes[currentIndex];

  // Load saved answer when switching questions
  const loadQuestionState = useCallback(() => {
    if (currentQuiz) {
      const savedAnswer = userAnswers.get(currentIndex);
      if (savedAnswer) {
        setSelectedTokens([...savedAnswer]);
        // Calculate remaining available tokens
        const usedTokens = new Set(savedAnswer);
        const remaining = currentQuiz.tokens.filter(t => !usedTokens.has(t));
        setAvailableTokens(shuffleArray(remaining));
      } else {
        setSelectedTokens([]);
        setAvailableTokens(shuffleArray(currentQuiz.tokens));
      }
    }
  }, [currentQuiz, currentIndex, userAnswers]);

  useEffect(() => {
    loadQuestionState();
  }, [currentIndex, loadQuestionState]);

  const handleTokenSelect = (token: string, index: number) => {
    const newSelected = [...selectedTokens, token];
    setSelectedTokens(newSelected);
    const newAvailable = [...availableTokens];
    newAvailable.splice(index, 1);
    setAvailableTokens(newAvailable);

    // Auto-save answer
    const newAnswers = new Map(userAnswers);
    newAnswers.set(currentIndex, newSelected);
    setUserAnswers(newAnswers);
  };

  const handleTokenRemove = (token: string, index: number) => {
    const newAvailable = [...availableTokens, token];
    setAvailableTokens(newAvailable);
    const newSelected = [...selectedTokens];
    newSelected.splice(index, 1);
    setSelectedTokens(newSelected);

    // Auto-save answer
    const newAnswers = new Map(userAnswers);
    if (newSelected.length > 0) {
      newAnswers.set(currentIndex, newSelected);
    } else {
      newAnswers.delete(currentIndex);
    }
    setUserAnswers(newAnswers);
  };

  const resetQuestion = () => {
    if (currentQuiz) {
      setSelectedTokens([]);
      setAvailableTokens(shuffleArray(currentQuiz.tokens));

      // Clear saved answer
      const newAnswers = new Map(userAnswers);
      newAnswers.delete(currentIndex);
      setUserAnswers(newAnswers);
    }
  };

  const goToQuestion = (index: number) => {
    if (!showResults) {
      setCurrentIndex(index);
    }
  };

  const goToNextQuestion = () => {
    if (currentIndex < quizzes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const submitQuiz = () => {
    // Check if all questions are answered
    const unanswered = quizzes.filter((_, idx) => !userAnswers.has(idx));
    if (unanswered.length > 0) {
      Alert.alert(
        'Incomplete Quiz',
        `You have ${unanswered.length} unanswered question(s). Please answer all questions before submitting.`,
        [{ text: 'OK' }]
      );
      return;
    }

    // Calculate results
    const quizResults: QuizResult[] = quizzes.map((quiz, idx) => {
      const userAnswer = userAnswers.get(idx) || [];
      const isCorrect =
        userAnswer.length === quiz.answer.length &&
        userAnswer.every((token, i) => token === quiz.answer[i]);

      return {
        questionIndex: idx,
        isCorrect,
        userAnswer,
        correctAnswer: quiz.answer,
        title: quiz.title,
      };
    });

    setResults(quizResults);
    setShowResults(true);
  };

  const restartQuiz = () => {
    setUserAnswers(new Map());
    setResults([]);
    setShowResults(false);
    setCurrentIndex(0);
    setExpandedCards(new Set());
    if (quizzes.length > 0) {
      setAvailableTokens(shuffleArray(quizzes[0].tokens));
    }
    setSelectedTokens([]);
  };

  const toggleCardExpansion = (index: number) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  if (!auth.currentUser) {
    return null;
  }

  const categoryTitle = category === 'basic' ? 'SQL basic' : 'SQL advanced';
  const correctCount = results.filter(r => r.isCorrect).length;
  const answeredCount = userAnswers.size;

  const answerAreaAvailableWidth = Math.max(0, windowWidth - 48 - 12);

  const selectedTokenItems = selectedTokens.map((token, index) => ({ token, index }));
  const selectedTokenRows = (() => {
    const rows: Array<Array<{ token: string; index: number }>> = [];
    let currentRow: Array<{ token: string; index: number }> = [];
    let currentWidth = 0;

    const estimateChipWidth = (token: string) => {
      const textWidth = token.length * 7.2;
      const paddingWidth = 12 * 2;
      const borderWidth = 1.5 * 2;
      return textWidth + paddingWidth + borderWidth;
    };

    const gap = 10;

    for (const item of selectedTokenItems) {
      const chipWidth = estimateChipWidth(item.token);
      const nextWidth = currentRow.length === 0 ? chipWidth : currentWidth + gap + chipWidth;

      if (currentRow.length > 0 && nextWidth > answerAreaAvailableWidth) {
        rows.push(currentRow);
        currentRow = [item];
        currentWidth = chipWidth;
      } else {
        currentRow.push(item);
        currentWidth = nextWidth;
      }
    }

    if (currentRow.length > 0) rows.push(currentRow);
    return rows;
  })();

  // Results Screen
  if (showResults) {
    const scoreMessage = correctCount === quizzes.length
      ? 'Perfect! Excellent work!'
      : correctCount >= quizzes.length / 2
      ? 'Good job! Keep practicing!'
      : 'keep learning you can do better';

    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Pink Header - now scrolls with content */}
          <View
            className="w-full bg-[#C03694] justify-center items-center"
            style={{
              height: 200,
              borderBottomLeftRadius: 40,
              borderBottomRightRadius: 40,
            }}
          >
            <Text style={{ color: 'white', fontSize: 24, fontWeight: '700' }}>
              Result
            </Text>
          </View>

          {/* Score Card - normal flow (overlaps header) */}
          <View style={{ paddingHorizontal: 24, marginTop: -60 }}>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 20,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.12,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: '#C03694', fontSize: 36, fontWeight: '700' }}>
                  {correctCount}/{quizzes.length}
                </Text>
                <Text style={{ color: '#C03694', fontSize: 14, marginTop: 4, textAlign: 'center' }}>
                  {scoreMessage}
                </Text>
              </View>
              <Image
                source={require('../../src/assets/images/illustration_quiz.png')}
                style={{ width: 80, height: 80 }}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={{ paddingHorizontal: 24, paddingTop: 20 }}>
          {/* Question Review Title */}
          <Text style={{ color: '#C03694', fontSize: 18, fontWeight: '700', marginBottom: 16 }}>
            Question Review
          </Text>

          {/* Collapsible Question Cards */}
          {results.map((result, index) => (
            <QuestionReviewCard
              key={index}
              result={result}
              isExpanded={expandedCards.has(index)}
              onToggle={() => toggleCardExpansion(index)}
            />
          ))}

          {/* Action Button */}
          <View className="mt-4">
            <Pressable
              onPress={() => router.back()}
              style={{
                backgroundColor: 'white',
                borderWidth: 2,
                borderColor: '#C03694',
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#C03694', fontSize: 16, fontWeight: '700' }}>
                Back To Quiz
              </Text>
            </Pressable>
          </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

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
            {categoryTitle}
          </Text>
        </View>
        <View style={{ width: 34 }} />
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#C03694" />
        </View>
      ) : quizzes.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Text style={{ color: '#757575', fontSize: 16, textAlign: 'center' }}>
            No quizzes available for this category.
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Question Navigation */}
          <View className="flex-row justify-center gap-x-2 px-6 mb-4">
            {quizzes.map((_, index) => {
              const hasAnswer = userAnswers.has(index);

              return (
                <Pressable
                  key={index}
                  onPress={() => goToQuestion(index)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 6,
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {currentIndex === index ? (
                    <LinearGradient
                      colors={['#F97316', '#EC4899', '#8B5CF6']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
                        {index + 1}
                      </Text>
                    </LinearGradient>
                  ) : hasAnswer ? (
                    <View
                      style={{
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#E0E7FF',
                        borderRadius: 6,
                      }}
                    >
                      <Text style={{ color: '#4F46E5', fontWeight: '600', fontSize: 16 }}>
                        {index + 1}
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 2,
                        borderColor: '#652EC7',
                        borderRadius: 6,
                      }}
                    >
                      <Text style={{ color: '#652EC7', fontWeight: '600', fontSize: 16 }}>
                        {index + 1}
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Schema Image */}
          {currentQuiz?.schemaImageUrl && (
            <View className="px-6 mb-4">
              <View
                style={{
                  backgroundColor: 'white',
                  borderWidth: 2,
                  borderColor: '#652EC7',
                  borderRadius: 12,
                  padding: 8,
                  overflow: 'hidden',
                }}
              >
                <Image
                  source={{ uri: currentQuiz.schemaImageUrl }}
                  style={{ width: '100%', height: 200 }}
                  resizeMode="contain"
                />
              </View>
            </View>
          )}

          {/* Question Text */}
          <View className="px-6 mb-4">
            <Text
              style={{
                color: '#1F2937',
                fontSize: 16,
                fontWeight: '500',
                lineHeight: 24,
              }}
            >
              {currentQuiz?.title}
            </Text>
          </View>

          {/* Answer Area */}
          <View className="px-6 mb-4">
            <View
              style={{
                paddingHorizontal: 6,
              }}
            >
              {Array.from({ length: Math.max(3, selectedTokenRows.length) }).map((_, rowIndex) => {
                const row = selectedTokenRows[rowIndex] ?? [];

                return (
                  <View
                    key={`answer-row-${rowIndex}`}
                    style={{
                      minHeight: 44,
                      paddingTop: 6,
                      paddingBottom: 10,
                      borderBottomWidth: 2,
                      borderBottomColor: '#6B7280',
                      opacity: 0.9,
                      flexDirection: 'row',
                      alignItems: 'center',
                      flexWrap: 'nowrap',
                      gap: 10,
                    }}
                  >
                    {row.map((item) => (
                      <Pressable
                        key={`selected-${item.index}`}
                        onPress={() => handleTokenRemove(item.token, item.index)}
                        style={{
                          borderWidth: 1.5,
                          borderColor: '#C03694',
                          borderRadius: 999,
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          backgroundColor: 'white',
                        }}
                      >
                        <Text
                          style={{
                            color: '#652EC7',
                            fontSize: 13,
                            fontWeight: '500',
                          }}
                        >
                          {item.token}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Divider */}
          <View className="px-6 mb-4">
            <View style={{ height: 1, backgroundColor: '#E5E7EB' }} />
          </View>

          {/* Available Tokens */}
          <View className="px-6 mb-6">
            <View className="flex-row flex-wrap gap-2">
              {availableTokens.map((token, index) => (
                <Pressable
                  key={`available-${index}`}
                  onPress={() => handleTokenSelect(token, index)}
                  style={{
                    borderWidth: 1.5,
                    borderColor: '#C03694',
                    borderRadius: 20,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    backgroundColor: 'white',
                  }}
                >
                  <Text
                    style={{
                      color: '#1E1e1e',
                      fontSize: 13,
                      fontWeight: '500',
                    }}
                  >
                    {token}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Submit Button - only show on last question when all questions are answered */}
          {currentIndex === quizzes.length - 1 && answeredCount === quizzes.length && (
            <View className="px-6 mb-4">
              <LinearGradient
                colors={['#F97316', '#EC4899', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  borderRadius: 12,
                }}
              >
                <Pressable
                  onPress={submitQuiz}
                  style={{
                    paddingVertical: 12,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 14, fontWeight: '700' }}>
                    Submit
                  </Text>
                </Pressable>
              </LinearGradient>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
