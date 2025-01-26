import { requireNativeView } from 'expo';
import * as React from 'react';

import { MoveFileViewProps } from './MoveFile.types';

const NativeView: React.ComponentType<MoveFileViewProps> =
  requireNativeView('MoveFile');

export default function MoveFileView(props: MoveFileViewProps) {
  return <NativeView {...props} />;
}
