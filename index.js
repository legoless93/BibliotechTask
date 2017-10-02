const fs = require( 'fs' );
const path = require( 'path' );
const http = require( 'http' );
const port = 3000

const EPub = require("epub");

const parDir = './TestEpubs';
const outputDir = './Output';

const requestHandler = (request, response) => {
    console.log(request.url);

    fs.readdir(parDir, (err, files) => {
        files.forEach((file, index) => {
            const curDir = parDir+'/'+file;
            const out = outputDir+'/'+file.replace('.epub', '/')+'index.json';
            const epub = new EPub(curDir, curDir+'/images', curDir+'/chapters');
            
            fs.mkdir(outputDir+'/'+file.replace('.epub', ''));
            
            epub.on("end", function(){
                
                const template = '{\n' +
                      '"title":' + ' "' + epub.metadata.title + '"\n' +
                      '"contributors":' + '["' + epub.metadata.creator + '"]\n' +
                          '}';
                
                fs.writeFile(out, template);
                
                console.log(epub.metadata.title);
                console.log(out);
            });
            
            epub.parse();
            
        })
    })

    response.end("Hello");

}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }

    console.log(`server is listening on ${port}`);
})