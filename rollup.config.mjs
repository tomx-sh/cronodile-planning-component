import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from 'rollup-plugin-typescript2';
import tslib from 'tslib';


export default {
    input: 'src/index.tsx', // entry point
    output: [
        {
            file: 'dist/package/index.js',
            format: 'cjs',
            sourcemap: true,
        },
        {
            file: 'dist/package/index.esm.js',
            format: 'esm',
            sourcemap: true,
        },
    ],
    plugins: [
        peerDepsExternal(),
        resolve(),
        commonjs(),
        typescript({
            tsconfig: 'tsconfig.json',
            useTsconfigDeclarationDir: true,
            tslib: tslib,
        }),
    ],
    external: ['react', 'react-dom', 'tslib'],
};