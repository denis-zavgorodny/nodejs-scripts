module.exports = function(grunt) {
    'use strict';
    grunt.registerMultiTask('createContent', 'Create content for html files', function() {
        var done = this.async();
        var path = require('path');
        var fs = require('fs');
        this.requiresConfig([ this.name, this.target, 'contentFileName' ].join('.'));
        this.requiresConfig([ this.name, this.target, 'basePath' ].join('.'));

        this.data.basePath = this.data.basePath || process.env.OLDPWD;

        var linkList = [];
        var linkTemplate = '<li><a href="%url%" target="_blank">%name%</a></li>';
        var that = this;
        fs.readdir(that.data.basePath, function(error, files){
            for(var key in files) {
                var _file = files[key].split('.');
                if (_file[1] == 'html' && files[key] != that.data.contentFileName)
                    linkList.push(linkTemplate.replace(/%name%/g, files[key]).replace(/%url%/g, files[key]));
            }
            var fileHTMLContent = "<!DOCTYPE html >\
                                    <html>\
                                        <head>\
                                            <meta http-equiv='content-type' content='text/html; charset=utf-8' />\
                                            <style></style>\
                                        </head>\
                                        <body>\
                                            <ul>\
                                        "+linkList.join("\n\r")+"\
                                            </ul>\
                                        </body>\
                                    </html>";
            fs.writeFile(that.data.basePath+'/'+that.data.contentFileName, fileHTMLContent, function(err){
                if (err) throw err;
                console.log('It\'s saved!');
            });
        });
            
        return;
        
        
    });
};