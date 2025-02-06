import Home from '@/features/landing-page';
import { useIsFocused } from '@react-navigation/native';

export default function HomePage() {
  const isFocused = useIsFocused();
  return isFocused && <Home />;
}
