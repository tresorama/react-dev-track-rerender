import { defineConfig } from 'tsup';

export default defineConfig({
  // entry: ["src/**/*@(ts|tsx)"],
  entry: ["src/index.ts"],
  format: ['esm', 'cjs'],
  outExtension({ format }) {
    return {
      js: `.${format}.js`,
    };
  },
  clean: true,
  dts: true,
  splitting: false,
  // treeshake: true,
  sourcemap: true,
  banner: (ctx) => {
    return {
      js: '"use client"',
    };
  }
});