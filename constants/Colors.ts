/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

const primary = '#ffd60a';
const secondary = '#0d1b2a';
const primaryForeground = '#000000';
const secondaryForeground = '#ffffff';
const background = '#000814';
const mutedForeground = '#8ea0b8'
const muted = '#334052'
export const Colors = {
  light: {
    text: '#11181C',
    background,
    tint: primary,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: primary,
    primary,
    primaryForeground,
    secondary,
    secondaryForeground,
    muted,
    mutedForeground
  },
  dark: {
    text: '#ECEDEE',
    background,
    tint: primary,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: primary,
    primary,
    primaryForeground,
    secondary,
    secondaryForeground,
    muted,
    mutedForeground
  },
};
