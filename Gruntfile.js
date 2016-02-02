'use strict';

var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({
        env: {
            dev: {
                src: ['env.json']
            },
            prod: {
                src: ['env.json']
            }
        },
        'node-inspector': {
            dev: {}
        },
        concurrent: {
            dev: {
                tasks: ['nodemon', 'node-inspector'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        nodemon: {
            dev: {
                script: 'app.js'
            }
        },
        apidoc: {
            myapp: {
                src: "api/",
                dest: "documentation/",
                options: {
                    debug: true,
                    includeFilters: [ ".*\\.js$" ],
                    excludeFilters: [ "node_modules/" ]
                }
            }
        }
    });


    grunt.registerTask('dev', ['env:dev', 'apidoc', 'nodemon']);
    grunt.registerTask('prod', ['env:prod', 'apidoc', 'nodemon']);

};
