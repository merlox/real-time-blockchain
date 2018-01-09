// In this file we'll store all the logic related with the cli interface interaction
const readline = require('readline')
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

// To interact with the user interface command line
async function interactWithUser() {
	console.log('---')
	console.log('connect <port>: To connect as a client to a websockets server')
	console.log('server <port>: To start a new separate server process in a different port')
	console.log('message <msg>: To send a message to your connected websocket clients')
	console.log('ping: To send a ping to your connected websocket clients')
	console.log('bulk-clients <start-port>: To connect to several clients starting from that port and increasing by 1')
	console.log('bulk-servers <start-port>: To start several server instances starting from that port and increasing by 1')
	console.log('mine-start: To start mining')
	console.log('mine-stop: To stop mining')
	console.log('transaction <msg> <gas>: To send a transaction with message and gas')
	console.log('show-transactions: To see the unprocessed transactions')
	console.log('show-blocks: To see the current blocks')
	console.log('exit: To close the program')

	const answer = (await question("What do you want to do now? ")).split(" ")
	return answer
}

// Promisified rl.question
function question(msg) {
	return new Promise((resolve, reject) => {
		rl.question(msg, (answer) => {
			resolve(answer)
		})
	})
}

// Reads the parameters when the user starts the blockchain
// returns {portClient, portServer}
function readParameters() {
	let portClient
	let portServer
	let portFound = process.argv.indexOf('--port-server')
	if(portFound != -1) portServer = Number(process.argv[portFound + 1])
	portFound = process.argv.indexOf('--port-client')
	if(portFound != -1) portClient = Number(process.argv[portFound + 1])

	return {portClient, portServer}
}

module.exports = {
	interactWithUser,
	readParameters
}
