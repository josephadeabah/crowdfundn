// global.d.ts tells TypeScript how to handle imports for non-TS files
// Here, we declare that when we import a .css file, it should be treated as a module
// with string keys and values, allowing us to use CSS modules in our TypeScript code.
declare module '*.css';
