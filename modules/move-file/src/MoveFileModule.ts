import { NativeModule, requireNativeModule } from 'expo';

import { MoveFileModuleEvents } from './MoveFile.types';

declare class MoveFileModule extends NativeModule<MoveFileModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
  moveFolders(endPath: string, pathsToMove: string[]): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<MoveFileModule>('MoveFile');
