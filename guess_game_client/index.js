const solanaWeb3 = require('@solana/web3.js');
const borsh = require('borsh');

// Define the GameState structure for deserialization
class GameState {
    constructor(props) {
        this.questioner = props.questioner;
        this.true_answer = props.true_answer;
        this.funds = props.funds;
    }
}

// Borsh schema
const schema = new Map([
    [GameState, { kind: 'struct', fields: [['questioner', 'pubkey'], ['true_answer', 'string'], ['funds', 'u64']] }],
]);

// Connect to the Solana Devnet
const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');

// Initialize game function
async function initializeGame(programId, payer, trueAnswer) {
    const questioner = new solanaWeb3.Keypair();

    // Airdrop to fund the questioner
    const airdropSignature = await connection.requestAirdrop(questioner.publicKey, solanaWeb3.LAMPORTS_PER_SOL);
    await connection.confirmTransaction(airdropSignature);

    const gameStateAccount = new solanaWeb3.Keypair();

    const instructionData = Buffer.from([0, ...Buffer.from(trueAnswer)]); // Instruction 0 for initialization

    const transaction = new solanaWeb3.Transaction().add(
        new solanaWeb3.TransactionInstruction({
            keys: [
                { pubkey: questioner.publicKey, isSigner: true, isWritable: true },
                { pubkey: gameStateAccount.publicKey, isSigner: false, isWritable: true },
            ],
            programId: programId,
            data: instructionData,
        })
    );

    await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [payer, gameStateAccount]);

    console.log(`Game initialized with true answer: ${trueAnswer}`);
    return { gameStateAccount, questioner };
}

// Guess function
async function guess(programId, gameStateAccount, questioner, answerer, guessAnswer) {
    const instructionData = Buffer.from([1, ...Buffer.from(guessAnswer)]); // Instruction 1 for guessing

    const transaction = new solanaWeb3.Transaction().add(
        new solanaWeb3.TransactionInstruction({
            keys: [
                { pubkey: questioner.publicKey, isSigner: true, isWritable: true },
                { pubkey: gameStateAccount.publicKey, isSigner: false, isWritable: true },
                { pubkey: answerer.publicKey, isSigner: true, isWritable: false },
            ],
            programId: programId,
            data: instructionData,
        })
    );

    const txId = await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [answerer]);
    console.log("Transaction confirmed with ID: ", txId);
}

// Example usage
(async () => {
    const payer = solanaWeb3.Keypair.generate();

    // Airdrop to fund the payer account
    const airdropSignature = await connection.requestAirdrop(payer.publicKey, solanaWeb3.LAMPORTS_PER_SOL);
    await connection.confirmTransaction(airdropSignature);

    const programId = new solanaWeb3.PublicKey('YOUR_PROGRAM_ID_HERE'); // Replace with your deployed Program ID
    const trueAnswer = "my_birthday";

    // Initialize the game
    const { gameStateAccount, questioner } = await initializeGame(programId, payer, trueAnswer);

    // Create a guess
    const answerer = solanaWeb3.Keypair.generate();
    await guess(programId, gameStateAccount, questioner, answerer, "my_birthday"); // Correct guess
})();
