# Guess the Answer - Solana Smart Contract

### Overview
The **Guess the Answer** smart contract is a simple and fun blockchain application built on Solana. It allows one user (the questioner) to set a secret answer (or passcode), and another user (the answerer) to guess the answer. If the answerer provides the correct answer, they are rewarded with a specified amount of SOL transferred directly to their Solana wallet. 

This contract can be extended to use cases such as:
- Fun games and challenges (like guessing birthdays, codes, etc.)
- Escrow systems where funds are unlocked based on specific conditions
- Research experiments where users provide input to unlock results or rewards
- Betting and gambling scenarios where correct predictions yield rewards


## Table of Contents

- [Inspiration](#inspiration)

## Table of Contents

- [Inspiration](#inspiration)
This project demonstrates how to work with Solana smart contracts using Rust and interact with them using Node.js.

---

## Table of Contents

- [Inspiration](#inspiration)
- [Project Structure](#project-structure)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Future Enhancements](#future-enhancements)

---

## Inspiration

This project was inspired by the simplicity of interactive, rewarding games, and the endless potential of blockchain technology. We wanted to create an application that illustrates how blockchain can be used for something as simple as guessing a birthday or a passcode, but that can also be extended to more complex use cases like escrow systems, research data collection, and betting platforms.

The inspiration behind building this decentralized guessing game came from:
- **Blockchain Transparency**: Allowing users to interact and transfer funds without relying on centralized systems.
- **Interactive Challenges**: Enabling fun, rewarding challenges that are trustless, meaning the smart contract handles the reward mechanism.
- **Extensibility**: Building a base structure that could be used for more practical scenarios such as decentralized research, escrow, and gambling, where users can win or unlock rewards.

---

## Project Structure

```plaintext
guess_game/
│
├── src/
│   └── lib.rs      # The Rust code for the Solana smart contract
├── target/
│   └── deploy/     # The compiled binary for the smart contract
├── Cargo.toml      # Rust dependencies and project configuration
└── guess_game_client/
    ├── index.js    # The Node.js client to interact with the smart contract
    └── package.json # Dependencies for the Node.js client
```

---

## Features

- **Initialize a Game**: One user (the questioner) can create a new game by setting a true answer and locking up funds.
- **Make a Guess**: Another user (the answerer) attempts to guess the true answer. If correct, the locked funds are transferred to their wallet.
- **Decentralized**: The smart contract handles the fund transfer, ensuring no third party can interfere or manipulate the outcome.
- **Logs for Incorrect Answers**: Incorrect answers will be logged for debugging purposes.
  
---

## Setup Instructions

### Prerequisites

- Rust and Cargo installed (`rustup`)
- Solana CLI installed and configured
- Node.js installed (v14+ recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/NtemKenyor/just-guess.git
cd solana-guess-game
```

### 2. Build the Solana Program

Navigate to the root folder of the smart contract and build it:

```bash
cargo build-bpf --manifest-path=Cargo.toml --bpf-out-dir=target/deploy
```

### 3. Deploy the Solana Program

1. Fund your Solana account on Devnet:
   ```bash
   solana airdrop 2
   ```

2. Deploy the smart contract:
   ```bash
   solana program deploy target/deploy/guess_game.so
   ```

3. Note down the **Program ID** from the output.

### 4. Set Up the Node.js Client

Navigate to the `guess_game_client` directory:

```bash
cd guess_game_client
npm install
```

---

## Usage

### Initialize the Game

To initialize the game with a questioner and set the true answer, update the Program ID in the `index.js` file (from your deployment output):

```javascript
const programId = new solanaWeb3.PublicKey('YOUR_PROGRAM_ID_HERE');
```

Then run the Node.js script to initialize the game:

```bash
node index.js
```

This will:
- Initialize the game with the questioner setting a secret answer (like `my_birthday`).
- Airdrop some SOL to the questioner's account to fund the game.

### Make a Guess

To guess the answer, modify the script to attempt a guess by the answerer (update the guess in the script):

```javascript
await guess(programId, gameStateAccount, questioner, answerer, "my_birthday"); // Correct guess
```

If the guess is correct, the locked funds will be transferred to the answerer's wallet. If the guess is wrong, a log will indicate the incorrect guess.

---

## Future Enhancements

- **Multiplayer Support**: Allow multiple people to guess within a single game session.
- **Escrow Use Case**: Extend the contract to act as an escrow system, where funds are released based on specific conditions.
- **Research Surveys**: Allow users to unlock research findings by providing valid inputs.
- **Betting Platform**: Build a decentralized betting platform using the same guessing logic.

---

## Conclusion

The **Guess the Answer** smart contract project is a simple, fun, and interactive way to showcase blockchain's decentralized nature. By allowing users to set a challenge and rewarding those who correctly guess the answer, this project opens up new avenues for decentralized gaming, escrow services, and research data collection.

Feel free to fork, modify, and contribute to the project as you see fit!

---

### License

This project is open-source and available under the MIT License.
