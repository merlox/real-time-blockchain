// 1. You can generate a transaction with the command "transaction <data> <gas>" The data is a string that is saved as it is. The gas is how many coins you want to pay to process the transaction. The higher, the more priority
// 2. The transactions are accomulated in a block {} object of transactions with a variable size. Default 20 transactions in a block
// 3. To have this running you need at least 1 user mining. To mine simply execute the command "mine start" and "mine stop". You'll see the transactions being processed
const fs = require('fs')
const keypress = require('keypress')
const { exec, execSync } = require('child_process')
let blocks = []
let unprocessedTransactions = []
let isMining = false
const blockSize = 20
const miner = '127.0.0.1.2'
let portServer = 8999
let portClient = 8999

readParameters()

const wsServer = require('./websocketServer.js')
const wsClient = require('./websocketClient.js')
keypress(process.stdin)
wsServer.init(portServer)
wsClient.init(portClient)
readCli()

// Reads the parameters when the user starts the blockchain
function readParameters() {
	// If you specify a port
	let portFound = process.argv.indexOf('--port-server')
	if(portFound != -1) portServer = Number(process.argv[portFound + 1])
	portFound = process.argv.indexOf('--port-client')
	if(portFound != -1) portClient = Number(process.argv[portFound + 1])
}

// Reads the optional parameters to interact with the blockchain
function readCli() {
	switch(process.argv[2]) {
		case 'mine':
			switch(process.argv[3]) {
				case 'start': startMining()
					break
				case 'stop': stopMining()
					break
				default: startMining()
			}
			break
		case 'transaction':
			if(process.argv[3] === undefined) throw new Error('-You need to specify the transaction message-')
			if(process.argv[4] === undefined) throw new Error('-You need to specify the transaction gas-')
			generateTransaction(process.argv[3], process.argv[4])
			break
		case 'show-transactions':
			showUnprocessedTransactions()
			break
		case 'show-blocks':
			showBlocks()
			break
	}
}

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
	if(unprocessedTransactions.length >= blockSize) {
		let block = []
		const blockNumber = blocks.length
		unprocessedTransactions.sort((a, b) => {
			return b - a
		})
		console.log('Sorted array', unprocessedTransactions)
		// Take the block of 20 transactions
		block = unprocessedTransactions.slice(0, blockSize)
		// Add the miner to each transaction
		for(let i = 0; i < block.length; i++) {
			block[i].minedBy = miner
			block[i].blockNumber = blockNumber
		}
		unprocessedTransactions.splice(0, blockSize)
		blocks.push(block)
		console.log('Mined block number', blockNumber)
	}
}

// Initializes mining and starts the server
function startMining() {
	console.log('Started mining')
	isMining = true
}

function stopMining() {
	console.log('Stopped mining')
	isMining = false
}

function showUnprocessedTransactions() {
	console.log(unprocessedTransactions)
}

function showBlocks() {
	console.log(blocks)
}

const numberOfServers = 500
const numberOfClients = 500
process.stdin.on('keypress', (ch, key) => {
	if(key.name == 'm') wsServer.sendAllMessage('Message - . -')
	if(key.name == 'c') {
		for(let i = 0; i < numberOfClients; i++) {
			let port = 9000 + i
			wsClient.init(port)
		}
	}
	if(key.name == 's') {
		for(let i = 0; i < numberOfServers; i++) {
			exec(`start cmd.exe /K node blockchain.js --port-server ${9000 + i}`, (err, stdout, stderr) => {})
		}
	}
})
