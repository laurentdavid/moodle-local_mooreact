const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-babel');

    grunt.initConfig({
        babel: {
            options: {
                sourceMap: false,
                presets: [
                    ['@babel/preset-env', { modules: false }],
                    ['@babel/preset-react', { runtime: 'classic' }]
                ],
                sourceType: 'module',
                generatorOpts: {
                    comments: true,
                    compact: false,
                    shouldPrintComment: () => true
                }
            },
            transpilejsx: {
                files: [{
                    expand: true,
                    cwd: 'amd/src',
                    src: ['**/*.jsx'],
                    dest: 'amd/src',
                    ext: '.js'
                }]
            }
        }
    });

    // ✅ Add /* eslint-disable */ to the top of every .js file
    grunt.registerTask('addeslintdisable', 'Inject eslint-disable comment', function () {
        const files = grunt.file.expand('amd/src/**/*.js');

        files.forEach(file => {
            const content = grunt.file.read(file);
            if (!content.startsWith('/* eslint-disable */')) {
                const newContent = '/* eslint-disable */\n' + content;
                fs.writeFileSync(file, newContent, 'utf8');
                grunt.log.writeln(`Injected eslint-disable into: ${file}`);
            }
        });
    });

    // Step 1: Transpile JSX + Inject ESLint comment
    grunt.registerTask('preamd', ['babel:transpilejsx', 'addeslintdisable']);

    // Dummy default to prevent warnings
    grunt.registerTask('default', []);
};
