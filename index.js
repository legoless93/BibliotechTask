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
            const fileNo = file.replace('.epub', '');
            const out = outputDir + '/'+ fileNo +'/index.json';
            const epub = new EPub(curDir, curDir+'/images', curDir+'/chapters');

            fs.stat(outputDir+'/'+fileNo, (err) => {
                if(err) {
                    fs.mkdir(outputDir+'/'+fileNo, (err) => {
                        return console.log(err);
                    });
                } else {
                    console.log("Directory exists");
                }
            })

            epub.on("end", function(){

                const template = '{\n' +
                      '"title":' + ' "' + epub.metadata.title + '"\n' +
                      '"contributors":' + '["' + epub.metadata.creator + '"]\n' +
                      '}';

                fs.writeFile(out, template);
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