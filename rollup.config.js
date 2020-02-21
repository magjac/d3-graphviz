import babel from 'rollup-plugin-babel';

export default [
    {
        entry: 'index.js',
        dest: 'build/d3-graphviz.js',
        format: 'umd',
        moduleName: 'd3-graphviz',
        sourceMap: (process.env.NODE_ENV != 'production'),
        external: [
            'd3-selection',
            'd3-transition',
            'd3-interpolate',
            'd3-zoom',
            'd3-dispatch',
            'd3-format',
            'd3-timer',
            'd3-path',
            '@hpcc-js/wasm',
        ],
        globals: {
            'd3-selection': 'd3',
            'd3-transition': 'd3',
            'd3-interpolate': 'd3',
            'd3-zoom': 'd3',
            'd3-dispatch': 'd3',
            'd3-format': 'd3',
            'd3-timer': 'd3',
            'd3-path': 'd3',
            '@hpcc-js/wasm': '@hpcc-js/wasm',
        },
        plugins: [
            (process.env.NODE_ENV === 'production' && babel({
                exclude: ['node_modules/**'],
            })),
        ],
    }
];
