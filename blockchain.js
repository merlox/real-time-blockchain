// 1. You can generate a transaction with the command "transaction <data> <gas>" The data is a string that is saved as it is. The gas is how many coins you want to pay to process the transaction. The higher, the more priority
// 2. The transactions are accomulated in a block {} object of transactions with a variable size. Default 20 transactions in a block
// 3. To have this running you need at least 1 user mining. To mine simply execute the command "mine start" and "mine stop". You'll see the transactions being processed
const fs = require('fs')
const { exec, execSync } = require('child_process')
const cli = require('./cli.js')
const wsServer = require('./websocketServer.js')
const wsClient = require('./websocketClient.js')
const config = {
	portServer: 8999,
	blockSize: 20,
	miner: '127.0.0.1.2'
}
let blocks = []
let unprocessedTransactions = []
let isMining = false

init()

// 1. Read the parameters when starting the blockchain
// 2. Interact with the cli
async function init() {
	let ports = cli.readParameters()
	if(ports.portClient != undefined) wsClient.init(ports.portClient)
	if(ports.portServer != undefined) config.portServer = ports.portServer
	wsServer.init(config.portServer)

	// You can stop it by typing 'exit' or ctrl + c
	while(true) {
		let answer = await cli.interactWithUser()
		processResponse(answer)
	}
}

// To generate a transaction given the data and the gas
function generateTransaction(data, gas) {
	let transaction = {
		from: '127.0.0.1', // ip of the user
		message: data,
		gas,
		minedBy: '',
		blockNumber: 0
	}

	unprocessedTransactions.push(transaction)
	const currentContent = JSON.parse(fs.readFileSync('transactions.json', 'utf-8'))
	currentContent.push(transaction)
	const stringTransaction = JSON.stringify(currentContent, null, 2)
	// Save the transaction on the file
	fs.writeFileSync('transactions.json', stringTransaction)
	// Broadcast the transaction to the ofther users connected to the node
	wsServer.sendAllMessage(stringTransaction)
	if(isMining) mineBlock()
}

// 1. Sort the unprocessedTransactions
// 2. Add those transactions to the block up to 20 transactions
function mineBlock() {
	if(unprocessedTransactions.length >= config.blockSize) {
		let block = []
		const blockNumber = blocks.length
		unprocessedTransactions.sort((a, b) => {
			return b - a
		})
		console.log('Sorted array', unprocessedTransactions)
		// Take the block of 20 transactions
		block = unprocessedTransactions.slice(0, config.blockSize)
		// Add the miner to each transaction
		for(let i = 0; i < block.length; i++) {
			block[i].minedBy = config.miner
			block[i].blockNumber = blockNumber
		}
		unprocessedTransactions.splice(0, config.blockSize)
		blocks.push(block)
		console.log('Mined block number', blockNumber)
	}
}

// Initializes mining and starts the server
function startMining() {
	console.log('Started mining')
	isMining = true
}

// To stop mining
function stopMining() {
	console.log('Stopped mining')
	isMining = false
}

// To see the unprocessed transactions
function showUnprocessedTransactions() {
	console.log(unprocessedTransactions)
}

// To see the blocks
function showBlocks() {
	console.log(blocks)
}

// To process the response from interacting with the user interface
function processResponse(response) {
	let port
	switch(response[0]) {
		case 'exit':
			console.log('bye')
			process.exit(0)
			break
		case 'connect':
			port = response[1]
			wsClient.init(port)
			break
		case 'server':
			port = response[1]
			exec(`start cmd.exe /K node blockchain.js --port-server ${port}`, (err, stdout, stderr) => {})
			break
		case 'message':
			wsServer.sendAllMessage(response[1])
			break
		case 'ping':
			wsServer.sendAllMessage('pong')
			break
		case 'bulk-clients':
			let numberOfClients = response[1]
			for(let i = 0; i < numberOfClients; i++) {
				port = 9000 + i
				wsClient.init(port)
			}
			break
		case 'bulk-servers':
			let numberOfServers = response[1]
			for(let i = 0; i < numberOfServers; i++) {
				exec(`start cmd.exe /K node blockchain.js --port-server ${9000 + i}`, (err, stdout, stderr) => {})
			}
			break
		case 'mine-start':
			startMining()
			break
		case 'mine-stop':
			stopMining()
			break
		case 'transaction':
			generateTransaction(response[1], response[2])
			break
		case 'show-transactions':
			showUnprocessedTransactions()
			break
		case 'show-blocks':
			showBlocks()
			break
	}
}
