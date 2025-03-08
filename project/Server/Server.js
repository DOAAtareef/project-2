require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Web3 } = require('web3');

// Initialize Express App
const app = express();
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

// Connect to Ethereum (Ganache)
const web3 = new Web3("HTTP://127.0.0.1:7545");  // Ganache default endpoint
const contractAddress = "0xAce45DBbA6079dD8D8FC1317Af9B9b6379D5999E";  // Replace with deployed contract address

// ABI for the smart contract
const contractABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "temperature",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "humidity",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "DataStored",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "readings",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "temperature",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "humidity",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_temperature",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_humidity",
                "type": "uint256"
            }
        ],
        "name": "storeData",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getLatestReading",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// Create contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Ethereum Account (Replace with your Ganache account address)
const account = "0xaC88869f70d62901e8b499F5062f4F1e85a731Ff"; // Replace with your Ganache account

// API Endpoint to Store Data
app.post("/store-data", async (req, res) => {
    const { temperature, humidity } = req.body;

    // Validate incoming data
    if (temperature === undefined || humidity === undefined) {
        return res.status(400).json({ success: false, error: "Temperature or humidity missing" });
    }

    try {
        // Send the transaction to store the data on the blockchain
        const tx = await contract.methods.storeData(temperature, humidity).send({ from: account });
        res.json({ success: true, txHash: tx.transactionHash });
    } catch (error) {
        console.error("Error storing data:", error);
        res.status(500).json({ success: false, error: "Blockchain error while storing data" });
    }
});

// API Endpoint to Retrieve Latest Reading
app.get("/latest-reading", async (req, res) => {
    try {
        // Call the smart contract function to get the latest data
        const data = await contract.methods.getLatestReading().call();
        res.json({
            temperature: data[0],
            humidity: data[1],
            timestamp: new Date(data[2] * 1000).toISOString(), // Convert from Unix timestamp to ISO string
        });
    } catch (error) {
        console.error("Error fetching latest reading:", error);
        res.status(500).json({ success: false, error: "Error fetching data from blockchain" });
    }
});

// Start Server

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
