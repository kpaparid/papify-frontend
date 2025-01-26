import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './MoveFile.types';

type MoveFileModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class MoveFileModule extends NativeModule<MoveFileModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello Papify GAMOTO! 👋';
  }
};

export default registerWebModule(MoveFileModule);
