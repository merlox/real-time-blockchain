const Websockets = require('ws')
let ws

function init(port) {
	if(!port) port = 8999
	ws = new Websockets(`ws://localhost:${port}`)
	console.log(`Client: websocket client connected to server ws://localhost:${port}`)
	// When a new user connects to this websockets server
	ws.on('open', (a) => {
		console.log('Client: open')
		console.log('User connected', a)
	})
	ws.on('message', (message) => {
		console.log('Client: Received message', message)
	})
	ws.on('error', (message) => {
		console.log('There was an error on the client')
	})
}

module.exports = {
	init,
	ws,
}
