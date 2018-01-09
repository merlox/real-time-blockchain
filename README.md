# real-time-blockchain
Not completed

// Introduction
This is based on a blockchain. Our blockchain is flexible, you don't need to download the entire chain because each block has the combined hash of all the past blocks from the biggest chain.

// How the blockchain is started
1. When you start the blockchain with "node blockchain.js" you need to specify the client that you'll connect to with "--port-client" and, optionally, you can specify the port that will be used to initiate the websockets server with: "--port-server".
- If you don't specify the server port, it will use the default 8999 as the websockets server.
- If you don't specify the client port, it won't connect to any client. You can however connect to your own node if you wish.
2. You have 2 options to start the blockchain:
- Start the websockets server "the blockchain" without connecting to any client node. In this case you aren't connected to the blockchain, you can't see the transactions from others until they connect to you. You are the genesis node of the blockchain, other nodes can connect to you openly.
- Create a server and connect, as a websockets client, to a different server. In this case you'll receive the transactions from other users and the transactions that you generate, get distributed to the other nodes in real time (the speed depends on your network and your processing power).
3. The blockchain grows when new users are connected together.

// How new nodes connect to the blockchain
All the nodes are connected with each other. When a new node gets online, he must connect to an existing server node as a client. That server node recognizes the connection and connects to that same node. Then he broadcast the connection to all the other nodes.
1. A group of nodes "A blockchain" connected all together
2. A new node comes in by connecting to one of the nodes in the blockchain
3. The server node in the blockchain that receives the connection, broadcast that new connection to all the other nodes so that they can connect to it
4. The new node receives from that server node the list of the nodes so that this new node can connect to the entire blockchain

// How the blockchain is scaled to millions of users and transactions
- Subblockchains

// How to interact with the blockchain
- You can mine with "mine". When you do it, you'll download the entire blockchain.
- You can create transactions with "transaction"
- You can download the entire blockchain manually with "download"

// The next step
1. When a single node connects to a blockchain of several users (2 or more), he'll receive the list of nodes so that he can connect to all of them.
2. And the server that you connected to, will broadcast your server ip for all the other nodes
