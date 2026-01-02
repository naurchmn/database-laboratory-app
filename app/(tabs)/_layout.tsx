import { Tabs } from 'expo-router';
import React from 'react';

import { View, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '../../src/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
    screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
            backgroundColor: colorScheme === 'dark' ? '#0a0a0a' : '#ffffff',
            height: 84,
            width: '100%',
            boxShadow: "0px -1px 6.8px rgba(0, 0, 0, 0.12)",
            elevation: 6.8,
            overflow: 'visible',
        },
        tabBarItemStyle: {
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 25, gap: 4, width: 48}}>
                <Image
                  source={
                    focused  
                      ? require('../../src/assets/images/home_icon_nav_foc.png')
                      : require('../../src/assets/images/home_icon_nav.png')
                    }
                  style={{ 
                    width: 28, height: 28, resizeMode:'contain', 
                  }}
                />
                <Text
                className={`text-[12px] ${
                  focused 
                    ? 'text-primary-pink font-semibold'  
                    : 'text-primary-gray font-medium'        
                }`}
              >
                Home
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="lectures"
        options={{
          title: 'Lectures',
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 25, gap: 4, width: 50}}>
              <Image
                source={
                  focused  
                    ? require('../../src/assets/images/lectures_icon_nav_foc.png')
                    : require('../../src/assets/images/lectures_icon_nav.png')
                  }
                style={{
                  width: 28, height: 28, resizeMode:'contain', 
                }}
              />
              <Text
                className={`text-[12px] ${
                  focused
                    ? 'text-primary-pink font-semibold'  
                    : 'text-primary-gray font-medium'        
                }`}
              >
                Lectures
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: 'Quiz',
          tabBarIcon: ({ focused }) => {
            const diamond = 60;
            const top_padding = 25;
            const icon = 28;
            const gap = 4;
            const diamondOffsetY = +22;

            return (
              <View 
                style={{ 
                width: 48,
                height: 84,
                alignItems: 'center',
                justifyContent: 'flex-start',
                position: 'relative',
              }}
              >
                <View style={{
                    shadowColor: '#000', shadowOffset: { width: 0, height: -1 }, shadowOpacity: 0.3, shadowRadius: 4,
                    elevation: 5,
                    top: -diamond / 2 + diamondOffsetY,
                  }}>
                  <LinearGradient
                    colors={['#652EC7', '#DF3983', '#FFD300']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: diamond,
                      height: diamond,
                      borderRadius: 16,
                      transform: [{ rotate: '45deg'}],
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                      <View style={{ transform: [{ rotate: '-45deg'}], alignItems: 'center', justifyContent: 'center' }}>
                          <Image
                              source={require('../../src/assets/images/quiz_icon_nav.png')}
                            style={{
                              width: icon, height: icon, resizeMode:'contain',
                            }}
                          />
                      </View>
                  </LinearGradient>
                </View>

                <Text
                  style={{
                    position: 'absolute',
                    top: 63,
                    fontSize: 12,
                    color: focused ? '#C03694' : '#757575',
                    fontWeight: focused ? '600' : '500',
                  }}
                >
                  Quiz
                </Text>
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="bulletin"
        options={{
          title: 'Bulletin',
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 25, gap: 4, width: 48}}>
              <Image
                source={
                  focused  
                      ? require('../../src/assets/images/bulletin_icon_nav_foc.png')
                      : require('../../src/assets/images/bulletin_icon_nav.png')
                  }
                style={{
                  width: 28, height: 28, resizeMode:'contain', 
                }}
              />
              <Text
                className={`text-[12px] ${
                  focused 
                    ? 'text-primary-pink font-semibold'  
                    : 'text-primary-gray font-medium'
                }`}
              >
                Bulletin
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 25, gap: 4, width: 48}}>
              <Image
                source={
                  focused  
                      ? require('../../src/assets/images/more_icon_nav_foc.png')
                      : require('../../src/assets/images/more_icon_nav.png')
                  }
                style={{
                  width: 28, height: 28, resizeMode:'contain', 
                }}
              />
              <Text
                className={`text-[12px] ${
                  focused 
                    ? 'text-primary-pink font-semibold'  
                    : 'text-primary-gray font-medium'        
                }`}
              >
                More
              </Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
