//Create Server and listen
var http = require('http');
var server = http.createServer(function(request, response) {});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

//Create Web Socket Server
var WebSocketServer = require('websocket').server;
wsServer = new WebSocketServer({
    httpServer: server
});

//store connected clients
var count = 0;
var clients = {};
var id;

//Listen for connections
wsServer.on('request', function(r){
    //accept the connection
    //connection = r.accept('echo-protocol', r.origin);

    
    //create character in given position
    if(count == 0){
    //accept the connection
    connection = r.accept('echo-protocol', r.origin);
    //specific id for this client and increment count
    id = count++;
    //Store the connection method so we can loop through and contact all clients
    clients[id] = connection;

    //log message to show that we have a new client connected
    console.log((new Date()) + ' Connection accepted [' + id + ']');

    } else if(count == 1){
    //accept the connection
    connection = r.accept('echo-protocol', r.origin);
    //specific id for this client and increment count
    id = count++;
    //Store the connection method so we can loop through and contact all clients
    clients[id] = connection;

    //log message to show that we have a new client connected
    console.log((new Date()) + ' Connection accepted [' + id + ']');

    }else if(count == 2){
    //accept the connection
    connection = r.accept('echo-protocol', r.origin);
    //specific id for this client and increment count
    id = count++;
    //Store the connection method so we can loop through and contact all clients
    clients[id] = connection;

    //log message to show that we have a new client connected
    console.log((new Date()) + ' Connection accepted [' + id + ']');

    }else if(count == 3){
    //accept the connection
    connection = r.accept('echo-protocol', r.origin);
    //specific id for this client and increment count
    id = count++;
    //Store the connection method so we can loop through and contact all clients
    clients[id] = connection;

    //log message to show that we have a new client connected
    console.log((new Date()) + ' Connection accepted [' + id + ']');

    }else{
    //reject the connection, already four clients connected
    console.log((new Date()) + ' Connection rejected, too many clients');
    }


    // //specific id for this client and increment count
    // id = count++;
    // //Store the connection method so we can loop through and contact all clients
    // clients[id] = connection;

    // //log message to show that we have a new client connected
    // console.log((new Date()) + ' Connection accepted [' + id + ']');

    //Create an event listener for message
    connection.on('message', function(message) {
        //The string message that was sent to us
        var msgString = message.utf8Data;
        console.log((new Date()) + ' Message recieved ' + msgString);

        //Loop through all clients
        for(var i in clients){
            //send message to the client with the message
            clients[i].sendUTF(msgString);
        }
    });

    //Create an event listener for movement
    // connection.on('movement', function(keycode) {
    //     var code =  keycode.utf8Data;
    //     console.log((new Date()) + ' Movement recieved ' + code); 

    //     //loop through all clients
    //     for(var i in clients){
    //         clients[i].sendUTF(code);
    //     }

    // });

    //listen for client disconnecting
    connection.on('close', function(reasonCode, description){
        //remove the disconnected client from the client list
        delete clients[id];
        count--;
        //console log message to show which client disconnected
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });

});

