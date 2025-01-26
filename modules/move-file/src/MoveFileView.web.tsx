import * as React from 'react';

import { MoveFileViewProps } from './MoveFile.types';

export default function MoveFileView(props: MoveFileViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
