module.exports = function(grunt) {
    grunt.initConfig({
        
        dir: {
            webapp: "public",
            dist: "dist",
            bower_components: "bower_components"
        },
        
        connect: {
            options: {
                port: 8080,
                hostname: "*"
            },

            serve: {
                options: {
                    open: {
                        target: "http://localhost:8080/index.html"
                    }
                }
            },

            src: {},

            dist: {
                options: {
                    open: {
                        target: "http://localhost:8080/build.html"
                    }
                }
            }
        },
        
        openui5_connect: {
            options: {
                resources: [
                    "<%= dir.bower_components %>/openui5-sap.ui.core/resources",
                    "<%= dir.bower_components %>/openui5-sap.m/resources",
                    "<%= dir.bower_components %>/openui5-sap.ui.layout/resources",
                    "<%= dir.bower_components %>/openui5-themelib_sap_bluecrystal/resources"
                ]
            },

            serve: {
                options: {
                    appresources: ["public"]
                }
            },

            src: {
                options: {
                    appresources: ["public"]
                }
            },
            dist: {
                options: {
                    appresources: "dist"
                }
            }
        },

        openui5_preload: {
            component: {
                options: {
                    resources: {
                        cwd: "<%= dir.webapp %>",
                        prefix: "mm"
                    },
                    dest: "<%= dir.dist %>"
                },
                components: true,
                compress: true
            }
        },

        clean: {
            dist: "<%= dir.dist %>/"
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: "<%= dir.webapp %>",
                    src: [
                        "**",
                        "!test/**"
                    ],
                    dest: "<%= dir.dist %>"
                }]
            }
        },
        
        replace: {
            example: {
                src: ["<%= dir.dist %>/*.js"],
                overwrite: true,
                replacements: [{
                    from: /(?:\$\{copyright\}|@copyright@)/g,
                    to: "Copyright 2017 c/o Jarvey"
                }]
            }
        }
    });
    
    // These plugins provide necessary tasks.
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-text-replace");
    grunt.loadNpmTasks("grunt-openui5");

    // Build task
    grunt.registerTask("build", ["clean", "openui5_preload", "copy", "replace"]);
};