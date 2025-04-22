const path = require('path');
const fs   = require('fs');

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-rollup');

    // ────────────────────────────────────────────────────────────────
    // 1) Find the real plugin factory
    // ────────────────────────────────────────────────────────────────
    // Walk up until we find .grunt/babel-plugin-add-module-to-define.js
    let pluginFactory;
    let moodleRoot = __dirname;
    while (moodleRoot !== path.dirname(moodleRoot)) {
        if (fs.existsSync(path.join(moodleRoot, '.grunt', 'babel-plugin-add-module-to-define.js'))) {
            pluginFactory = require(path.join(moodleRoot, '.grunt', 'babel-plugin-add-module-to-define.js'));
            break;
        }
        moodleRoot = path.dirname(moodleRoot);
    }
    if (!pluginFactory) {
        throw new Error('Couldn’t locate Moodle root for add-module-to-define plugin');
    }

    // ────────────────────────────────────────────────────────────────
    // 2) Wrap it so it runs under Moodle root cwd
    // ────────────────────────────────────────────────────────────────
    const wrappedDefinePlugin = (babel) => {
        const old = process.cwd();
        process.chdir(moodleRoot);
        // call the real factory with the babel API object
        const plugin = pluginFactory(babel);
        process.chdir(old);
        return plugin;
    };

    // ────────────────────────────────────────────────────────────────
    // 3) Configure rollup:preamdreact exactly as before, but using our wrapped plugin
    // ────────────────────────────────────────────────────────────────
    grunt.config.merge({
        rollup: {
            preamdreact: {
                options: {
                    format: 'amd',
                    dir: 'amd/src/',
                    sourcemap: false,
                    treeshake: false,
                    context: 'window',
                    external: ['react','react-dom/client'],
                    output: {
                        globals: {
                            react: 'core/react',
                            'react-dom/client': 'core/react_dom'
                        }
                    },
                    plugins: [
                        require('@rollup/plugin-babel').babel({
                            babelHelpers: 'bundled',
                            babelrc: false,
                            presets: [
                                ['@babel/preset-env',    { modules: false }],
                                ['@babel/preset-react',  { runtime: 'classic' }]
                            ],
                            plugins: [
                                'system-import-transformer',
                                wrappedDefinePlugin  // ← our runtime CWD wrapper
                            ]
                        })
                    ]
                },
                files: [{
                    expand: true,
                    src: ['**/*.jsx'],
                    ext: '.js'
                }]
            }
        }
    });

    // ────────────────────────────────────────────────────────────────
    // 4) The rest of your task
    // ────────────────────────────────────────────────────────────────
    grunt.registerTask('addeslintdisable', function() {
        const files = grunt.file.expand('amd/src/**/*.js');
        files.forEach(f => {
            const c = grunt.file.read(f);
            if (!c.startsWith('/* eslint-disable */')) {
                grunt.file.write(f, '/* eslint-disable */\n' + c);
            }
        });
    });

    grunt.registerTask('preamdreact', ['rollup:preamdreact','addeslintdisable']);
};
