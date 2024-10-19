
// const contractAddress = "0x1b4059582a82cBbB889888BDa85317e2B54558b4"; // Replace with your actual contract address


// app.js
let web3;
let userAccount;
let votechainContract;

const contractAddress = "0x1b4059582a82cBbB889888BDa85317e2B54558b4"; // Replace with your actual contract address
const contractABI = [
    // Your ABI here
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "proposalId",gi
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            }
        ],
        "name": "ProposalCreated",
        "type": "event"
    },
    // ... (rest of your ABI)
];

async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            console.log("Connected account:", userAccount);

            web3 = new Web3(window.ethereum);
            votechainContract = new web3.eth.Contract(contractABI, contractAddress);
            document.getElementById("connectWalletButton").innerText = "Wallet Connected";

            // Fetch proposals on connection
            fetchProposals();
        } catch (error) {
            console.error("User denied account access or other error:", error);
        }
    } else {
        alert("Please install MetaMask to use this DApp!");
        console.error("MetaMask not detected");
    }
}

async function createProposal() {
    const proposalInput = document.getElementById("proposalNameInput");
    const proposalName = proposalInput.value; 
    if (!proposalName) {
        alert("Please enter a proposal name");
        return;
    }

    try {
        await votechainContract.methods.createProposal(proposalName).send({ from: userAccount });
        console.log("Proposal created successfully");
        proposalInput.value = ""; // Clear input field
        fetchProposals(); // Refresh the list of proposals
    } catch (error) {
        console.error("Error creating proposal:", error);
    }
}

async function fetchProposals() {
    if (!votechainContract) {
        console.error("Contract not initialized. Please connect to the wallet first.");
        return;
    }

    try {
        const count = await votechainContract.methods.proposalsCount().call();
        const proposalsList = document.getElementById("proposalsList");
        proposalsList.innerHTML = ""; // Clear existing proposals

        for (let i = 0; i < count; i++) {
            const proposal = await votechainContract.methods.proposals(i).call();
            const listItem = document.createElement("li");
            listItem.textContent = `Proposal ${i + 1}: ${proposal.name} - Votes: ${proposal.voteCount}`;
            proposalsList.appendChild(listItem);
        }
    } catch (error) {
        console.error("Error fetching proposals:", error);
    }
}

// Event listeners for buttons
document.getElementById("connectWalletButton").onclick = connectWallet;
document.getElementById("createProposalButton").onclick = createProposal;

// Fetch proposals on page load
window.onload = fetchProposals;
