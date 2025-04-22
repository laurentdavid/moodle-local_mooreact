const path = require('path');
const fs   = require('fs');

module.exports = function(grunt) {
    // ────────────────────────────────────────────────────────────────
    // 0) Remember plugin root
    // ────────────────────────────────────────────────────────────────
    const pluginRoot = process.cwd();

    // ────────────────────────────────────────────────────────────────
    // 1) Emulate Moodle environment so core tasks run properly
    // ────────────────────────────────────────────────────────────────
    grunt.option('component', 'local_mooreact');
    grunt.moodleEnv = grunt.moodleEnv || {};
    grunt.moodleEnv.files       = [path.join(pluginRoot, 'amd', 'src', '**', '*.js')];
    grunt.moodleEnv.amdSrc      = grunt.moodleEnv.files;
    grunt.moodleEnv.inComponent = true;
    grunt.moodleEnv.startupTasks = grunt.moodleEnv.startupTasks || [];
    // ────────────────────────────────────────────────────────────────
    // 2) Vendor React & ReactDOM by copying UMD bundles
    // ────────────────────────────────────────────────────────────────
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.config.merge({
        copy: {
            react: {
                files: [{
                    src: fs.existsSync('node_modules/react/umd/react.production.min.js')
                        ? 'node_modules/react/umd/react.production.min.js'
                        : 'node_modules/umd-react/dist/react.production.min.js',
                    dest: 'amd/build/react.min.js'
                }]
            },
            reactdom: {
                files: [{
                    src: fs.existsSync('node_modules/react-dom/umd/react-dom.production.min.js')
                        ? 'node_modules/react-dom/umd/react-dom.production.min.js'
                        : 'node_modules/umd-react/dist/react-dom.production.min.js',
                    dest: 'amd/build/react-dom.min.js'
                }]
            },
            define: {
                files: [{
                    src: 'amd/js/define-react-template.js',
                    dest: 'amd/js/define-react.js'
                }]
            }
        }
    });
    grunt.registerTask('reactvendor', ['copy:react', 'copy:reactdom', 'copy:define']);

    // ────────────────────────────────────────────────────────────────
    // 3) Configure Rollup for JSX → AMD (preamdreact)
    // ────────────────────────────────────────────────────────────────
    grunt.loadNpmTasks('grunt-rollup');
    require(pluginRoot + '/.grunt/tasks/preamdreact.js')(grunt);
    grunt.registerTask('preamdreact', ['rollup:preamdreact']);

    // ────────────────────────────────────────────────────────────────
    // 4) Wrap core javascript.js so it runs from Moodle root
    // ────────────────────────────────────────────────────────────────
    grunt.registerTask('wrap:javascript', function() {
        const done       = this.async();
        const moodleRoot = path.resolve(__dirname, '../../');
        const jsTaskFile = path.join(moodleRoot, '.grunt', 'tasks', 'javascript.js');

        if (!fs.existsSync(jsTaskFile)) {
            grunt.log.warn(`⚠️ Cannot find core JS task at ${jsTaskFile}`);
            return done();
        }

        const originalCwd = process.cwd();
        process.chdir(moodleRoot);
        require(jsTaskFile)(grunt);
        grunt.task.run('amd');
        grunt.task.run(function restore() {
            process.chdir(originalCwd);
            grunt.log.writeln(`🔄 Restored cwd to plugin root: ${originalCwd}`);
        });
        done();
    });

    // ────────────────────────────────────────────────────────────────
    // 5) High‑level build: vendor, compile JSX, then core AMD
    // ────────────────────────────────────────────────────────────────
    grunt.registerTask('build', [
        'reactvendor',    // 1) copy UMD React/ReactDOM + wrapper
        'preamdreact',    // 2) JSX → amd/src/*.js
        'wrap:javascript' // 3) core AMD build → amd/build/*.min.js
    ]);

    // Default
    grunt.registerTask('default', ['build']);
};

// =====================================================================
// amd/js/define-react-template.js
// ---------------------------------------------------------------------
// This file is used to wrap the UMD bundles as AMD modules.
// It will be copied to amd/js/define-react.js by the "define" copy task above.
// =====================================================================

// Define React as an AMD module
(function() {
    if (typeof define === 'function' && define.amd) {
        define('react', [], function() {
            return window.React;
        });
        define('react-dom/client', [], function() {
            return window.ReactDOM;
        });
    }
})();
