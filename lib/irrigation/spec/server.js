'use strict';

const http = require('http');
const server = http.createServer(handleRequest);

function handleRequest(request, response){
    response.end('It Works!! Path Hit: ' + request.url);
}

server.listen(8888, function(){
  console.log("Server listening on: http://localhost:8888");
});
