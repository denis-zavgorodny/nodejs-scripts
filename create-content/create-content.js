module.exports = function(grunt) {
    'use strict';
    grunt.registerMultiTask('createContent', 'Create content for html files', function() {
        var done = this.async();
        var path = require('path');
        var fs = require('fs');
        var webshot = require('/usr/local/lib/node_modules/grunt/node_modules/webshot');
        var imagemagick = require('/usr/local/lib/node_modules/grunt/node_modules/imagemagick');
        var optionsWebshot = {
          siteType: 'url',
          timeout: 10000,
          screenSize: {
            width: 1024,
            height: 768
          },
            shotSize: {
            width: 1024,
            height: 'all'
          },
            userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us)'
            + ' AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
        };

        
        this.requiresConfig([ this.name, this.target, 'contentFileName' ].join('.'));
        this.requiresConfig([ this.name, this.target, 'basePath' ].join('.'));
        //this.requiresConfig([ this.name, this.target, 'wwwPath' ].join('.'));

        this.data.basePath = this.data.basePath || process.env.OLDPWD;
        this.data.wwwPath = this.data.wwwPath || '';

        var linkList = [];
        var fileShot = [];
        var linkTemplate = '<li><a href="%url%" target="_blank">%name%</a></li>';
        var that = this;
        fs.readdir(that.data.basePath, function(error, files){
            if (!fs.existsSync(that.data.basePath+'/thumb/'))
                fs.mkdirSync(that.data.basePath+'/thumb/', '0777');
            for(var key in files) {
                var _file = files[key].split('.');
                if (!that.data.wwwPath)
                    optionsWebshot.siteType = 'html';
                if (_file[1] == 'html' && files[key] != that.data.contentFileName) {
                    linkList.push(linkTemplate.replace(/%name%/g, true?"<h2>"+files[key]+"</h2><img src='"+'thumb/'+_file[0]+'.png'+"' />": files[key]).replace(/%url%/g, files[key]));
                    fileShot.push({
                        from: that.data.wwwPath?that.data.wwwPath+files[key]:that.data.basePath+'/'+files[key],
                        to: that.data.basePath+'/thumb/'+_file[0]+'.png'
                    });
                }    
            }
            var fileHTMLContent = "<!DOCTYPE html >\
                                    <html>\
                                        <head>\
                                            <meta http-equiv='content-type' content='text/html; charset=utf-8' />\
                                            <style>\
                                                ul > li img {\
                                                    width: 100%;\
                                                    display: block;\
                                                }\
                                                ul > li { \
                                                    display:-moz-inline-box; display:inline-block; *zoom: 1; *display:inline; vertical-align: top; \
                                                    width: 320px; \
                                                    margin: 10px; \
                                                } \
                                            </style>\
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


            //Стартуем скриншоты
            createShot(fileShot.pop());
        });
        function createShot(shot) {
            webshot(shot.from, shot.to, optionsWebshot, function(err) {
                if (err)
                    console.log(shot.from+'... FAIL ('+err+')');
                else {
                    console.log(shot.from+'... OK');
                    imagemagick.resize({
                      srcPath: shot.to,
                      dstPath: shot.to,
                      width:   320
                    }, function(err, stdout, stderr){
                      if (err) throw err;
                      console.log('resized '+shot.to);
                    });
                }    
                if (fileShot.length)
                    createShot(fileShot.pop());
            });        
        }

        return;
        
        
    });

    
};