const WebSocketServer = require('ws').Server
let wss
const clients = []

function init(port) {
	if(!port) port = 8999
	wss = new WebSocketServer({port})
	console.log(`Server: websockets started on port ${port}`)
	// Server websocket
	wss.on('connection', (ws) => {
		console.log('Server: connected client')
		clients.push(ws)
		ws.on('message', (message) => {
			console.log('Server: message received', message)
		})
		ws.on('close', (client) => {
			console.log('Server: closed client', client)
			clients.splice(clients.indexOf(client), 1)
		})
		ws.on('error', (err) => {
			console.log('Server: error client', client)
		})
	})
}

function sendAllMessage(message) {
	console.log('Server: sending all message')
	for(let i = 0; i < clients.length; i++) {
		// Check that the socket is open to not crash the app
		if(clients[i].readyState === clients[0].OPEN) {
			clients[i].send(message)
		}
	}
}

module.exports = {
	init,
	wss,
	sendAllMessage,
}
