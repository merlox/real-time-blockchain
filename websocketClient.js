const Websockets = require('ws')
let ws

function init(port) {
	if(!port) port = 8999
	ws = new Websockets(`ws://localhost:${port}`)
	console.log('Client: websocket started')
		ws.on('open', () => {
		console.log('Client: open')
	})
	ws.on('message', (message) => {
		console.log('Client: Received message', message)
	})
}

module.exports = {
	init,
	ws,
}
