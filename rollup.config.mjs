import ts from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser'; // <- default import, not named
import fs from 'fs';
import path from 'path';

const config = JSON.parse(fs.readFileSync(path.resolve('./tsconfig.json'), 'utf-8'));

export default [
  {
    input: './src/background/index.ts',
    output: {
      file: './extension/MoodleGPT.js',
      format: 'iife',
      name: 'MoodleGPT',
      sourcemap: true
    },
    plugins: [
      nodeResolve({ browser: true }),
      commonjs(),
      ts(config),
      terser() // works
    ]
  },

  {
    input: './src/popup/index.ts',
    output: {
      file: './extension/popup/popup.js',
      format: 'iife',
      name: 'PopupApp',
      sourcemap: true
    },
    plugins: [nodeResolve({ browser: true }), commonjs(), ts(config), terser()]
  }
];
//# sourceMappingURL=rollup.config.mjs.map
