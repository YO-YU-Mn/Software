import Animated, {
  FadeInDown,
} from 'react-native-reanimated';

export default function FadeInView({
  children,
  delay = 0,
}: any) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify()}
    >
      {children}
    </Animated.View>
  );
}