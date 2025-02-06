import Download from '@/features/download';
import { useIsFocused } from '@react-navigation/native';

export default function DownloadPage() {
  const isFocused = useIsFocused();
  return isFocused && <Download />;
}
