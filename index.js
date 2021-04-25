'use strict';
const confrc = new (require('confrc')).base();
const http = require('http');
const src = new (require('statusrc')).statusrc;


const serverBase = function(){
    const start=function(){
        http.createServer(function (req, res) {
            let post = '';
            req.on('data', function (chunk) {
                post += chunk;
            });
            req.on('end', async function () {
                let json = {
                     'user-agent' : req.headers['user-agent']
                };
                if(confrc.get('reverseProxy')){
                    json.address = req.headers['x-forwarded-for'];
                }else{
                    json.address = req.connection.remoteAddress;
                }
                json.method = req.method;
                return res.end(
                    JSON.stringify(json)
                );
            });
        }).listen(
            confrc.get('httpd').port,
            confrc.get('httpd').address
        );
    };
    const end = function(res){
        res.writeHead(200);
        res.write(
            JSON.stringify({
                'result':'ok'
            })
        );
        return res.end();

    };
    start();
};

(new serverBase());

