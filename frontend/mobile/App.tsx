import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, SafeAreaView, StatusBar, Text, View } from 'react-native';

import { AppNavigator } from './src/navigation';
import { MedicineAssistantProvider } from './src/state/MedicineAssistantProvider';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const pulse = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 720,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 720,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    pulseLoop.start();

    const timer = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: 360,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start(() => setIsLoading(false));
    }, 1400);

    return () => {
      clearTimeout(timer);
      pulseLoop.stop();
    };
  }, [fade, pulse]);

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.86, 1.12],
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <MedicineAssistantProvider>
        <AppNavigator />
      </MedicineAssistantProvider>
      {isLoading ? (
        <Animated.View
          style={{
            alignItems: 'center',
            backgroundColor: '#F5F6EF',
            bottom: 0,
            justifyContent: 'center',
            left: 0,
            opacity: fade,
            position: 'absolute',
            right: 0,
            top: 0,
          }}
        >
          <Animated.View
            style={{
              alignItems: 'center',
              backgroundColor: '#163020',
              borderRadius: 40,
              height: 80,
              justifyContent: 'center',
              transform: [{ scale: pulseScale }],
              width: 80,
            }}
          >
            <View
              style={{
                backgroundColor: '#D6E7D8',
                borderRadius: 10,
                height: 34,
                width: 12,
              }}
            />
            <View
              style={{
                backgroundColor: '#D6E7D8',
                borderRadius: 10,
                height: 12,
                position: 'absolute',
                width: 34,
              }}
            />
          </Animated.View>
          <Text style={{ color: '#163020', fontSize: 18, fontWeight: '700', marginTop: 22 }}>
            Preparing medication assistant
          </Text>
        </Animated.View>
      ) : null}
    </SafeAreaView>
  );
}
