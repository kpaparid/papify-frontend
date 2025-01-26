import YouTubeLogin from '@/features/youtube-cookie';
import { useIsFocused } from '@react-navigation/native';

export default function YtLogin() {
  const isFocused = useIsFocused();
  return isFocused && <YouTubeLogin />;
}
