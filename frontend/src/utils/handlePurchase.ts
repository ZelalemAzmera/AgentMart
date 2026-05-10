import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

interface BuyerWallet {
  publicKey: PublicKey;
  sendTransaction: (tx: Transaction, connection: Connection) => Promise<string>;
}

export const handlePurchase = async (
  buyerWallet: BuyerWallet,
  agentOwnerPublicKey: PublicKey,
  amountInSol: number
): Promise<string> => {
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: buyerWallet.publicKey,
      toPubkey: agentOwnerPublicKey,
      lamports: amountInSol * LAMPORTS_PER_SOL,
    })
  );

  transaction.feePayer = buyerWallet.publicKey;
  transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

  const signature = await buyerWallet.sendTransaction(transaction, connection);
  await connection.confirmTransaction(signature, "confirmed");

  return signature;
};
