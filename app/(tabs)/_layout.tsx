import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import MediaTrack from '@/features/media-track';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colorTheme = Colors[colorScheme ?? 'light'];

  return (
    <>
      <Tabs
        backBehavior="history"
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: colorTheme.primary,
          tabBarInactiveTintColor: colorTheme.mutedForeground,
          headerShown: false,
          tabBarButton: props => (
            <HapticTab
              {...props}
              style={[
                props.style,
                {
                  minHeight: 60,
                  borderTopWidth: 2,
                  borderTopColor: props.accessibilityState?.selected
                    ? colorTheme.primary
                    : colorTheme.muted,
                },
              ]}
            />
          ),
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {
              backgroundColor: colorTheme.background,
              display: 'none',
            },
          }),
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Explore',
            tabBarItemStyle: { display: 'none' },
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="download"
          options={{
            title: 'Download',
            tabBarItemStyle: { display: 'none' },
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="google-drive-tracks"
          options={{
            title: 'Google Drive Tracks',
            tabBarItemStyle: { display: 'none' },
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="yt-login"
          options={{
            title: 'Yt Login',
            tabBarItemStyle: { display: 'none' },
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="collectionList"
          options={{
            title: 'Collection List',
            tabBarItemStyle: { display: 'none' },

            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarItemStyle: { display: 'none' },
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="paperplane.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="collection"
          options={{
            title: 'Collection',
            tabBarItemStyle: { display: 'none' },

            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="artist"
          options={{
            title: 'Artist',
            tabBarItemStyle: { display: 'none' },
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="album"
          options={{
            title: 'Album',
            tabBarItemStyle: { display: 'none' },
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="playlist"
          options={{
            title: 'Playlist',
            tabBarItemStyle: { display: 'none' },
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
      </Tabs>
      <MediaTrack />
    </>
  );
}
