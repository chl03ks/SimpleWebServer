/* Modules */
var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');


var port = 3000;
// mime types object
var mimeTypes = {
    html: 'text/html',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    png: 'image/png',
    js: 'text/javascript',
    css: 'text/css'
};

http.createServer(function (req, res) {

    var uri = url.parse(req.url).pathname;
    var fileName = path.join(process.cwd(), unescape(uri));
    var stats;

    console.log('Loading ' + uri);

    try {
        stats = fs.lstatSync(fileName);
    } catch (e) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write('404 Not Found');
        res.end();
        return;
    }

    // Check if file/directory

    if(stats.isFile()){
        var mimeType = mimeTypes[path.extname(fileName).split('.').reverse()[0]];
        res.writeHead(200, {'Content-Type': mimeType});

        var fileStream = fs.createReadStream(fileName);
        fileStream.pipe(res);
    } else if (stats.isDirectory()){
        res.writeHead(302, {
            'location': 'index.html',
        });
        res.end();
    }else {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.write('500 Inernal Error');
        res.end();
    }

}).listen(port);
