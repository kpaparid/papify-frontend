import Collection from '@/features/collection';
import { useIsFocused } from '@react-navigation/native';
import React from 'react';
export default function CollectionPage() {
  const isFocused = useIsFocused();
  return isFocused && <Collection />;
}
