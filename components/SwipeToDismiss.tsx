'use client';

import type React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  type PanResponderGestureState,
  type ViewStyle,
} from 'react-native';

interface SwipeToDismissProps {
  children: React.ReactNode;
  onDismiss: () => void;
  direction?: 'vertical' | 'horizontal';
  dismissThreshold?: number;
  animationDuration?: number;
  style?: ViewStyle;
  onSwipeStart?: () => void;
  onSwipeMove?: (gestureState: PanResponderGestureState) => void;
  onSwipeEnd?: () => void;
}

export default function SwipeToDismiss({
  children,
  onDismiss,
  direction = 'vertical',
  dismissThreshold = 0.7,
  animationDuration = 250,
  style,
  onSwipeStart,
  onSwipeMove,
  onSwipeEnd,
}) {
  const pan = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const isVertical = false;
  //   const isVertical = direction === 'vertical';
  const dimension = isVertical ? 'height' : 'width';

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const threshold = 10;
        return isVertical
          ? Math.abs(gestureState.dy) > threshold
          : Math.abs(gestureState.dx) > threshold;
      },
      onPanResponderGrant: () => {
        onSwipeStart?.();
      },
      onPanResponderMove: (_, gestureState) => {
        const value = isVertical ? gestureState.dy : gestureState.dx;
        if (value > 0) {
          pan[isVertical ? 'y' : 'x'].setValue(value);
          onSwipeMove?.(gestureState);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const value = isVertical ? gestureState.dy : gestureState.dx;
        const velocity = isVertical ? gestureState.vy : gestureState.vx;
        const shouldDismiss =
          value > dismissThreshold * (isVertical ? gestureState.dy : gestureState.dx) ||
          velocity > 0.5;

        if (shouldDismiss) {
          Animated.parallel([
            Animated.timing(pan[isVertical ? 'y' : 'x'], {
              toValue: isVertical ? 1000 : 500,
              duration: animationDuration,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: animationDuration,
              useNativeDriver: true,
            }),
          ]).start(onDismiss);
        } else {
          Animated.spring(pan[isVertical ? 'y' : 'x'], {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
        onSwipeEnd?.();
      },
    }),
  ).current;

  const resetAnimation = useCallback(() => {
    pan.setValue({ x: 0, y: 0 });
    opacity.setValue(1);
  }, [pan, opacity]);

  useEffect(() => {
    resetAnimation();
  }, [resetAnimation]);

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          transform: [isVertical ? { translateY: pan.y } : { translateX: pan.x }],
          opacity: opacity,
        },
      ]}
      {...panResponder.panHandlers}
    >
      {/* <View style={styles.handle} /> */}
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#FFFFFF',
    // borderTopWidth: 1,
    // borderTopColor: '#E5E5E5',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: -2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 5,
    // padding: 10,
    // backgroundColor: 'blue',
  },
  // handle: {
  //   width: 40,
  //   height: 4,
  //   backgroundColor: '#D1D1D6',
  //   borderRadius: 2,
  //   alignSelf: 'center',
  //   marginVertical: 8,
  // },
});
