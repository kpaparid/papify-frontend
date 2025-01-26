// Reexport the native module. On web, it will be resolved to MoveFileModule.web.ts
// and on native platforms to MoveFileModule.ts
export { default } from './src/MoveFileModule';
export { default as MoveFileView } from './src/MoveFileView';
export * from  './src/MoveFile.types';
