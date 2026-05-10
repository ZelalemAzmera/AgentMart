import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

interface DeveloperWallet {
  publicKey: PublicKey;
  sendTransaction: (tx: Transaction, connection: Connection) => Promise<string>;
}

interface ListAgentResult {
  signature: string;
  agentPDA: string;
}

export const handleListAgent = async (
  developerWallet: DeveloperWallet,
  agentName: string,
  description: string,
  priceInSol: number,
  programId: PublicKey
): Promise<ListAgentResult> => {
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");

  // Encode: [name_len(4) + name + desc_len(4) + desc + price(8)]
  const nameBuffer = Buffer.from(agentName, "utf-8");
  const descBuffer = Buffer.from(description, "utf-8");
  const data = Buffer.alloc(4 + nameBuffer.length + 4 + descBuffer.length + 8);
  let offset = 0;

  data.writeUInt32LE(nameBuffer.length, offset); offset += 4;
  nameBuffer.copy(data, offset);                 offset += nameBuffer.length;
  data.writeUInt32LE(descBuffer.length, offset); offset += 4;
  descBuffer.copy(data, offset);                 offset += descBuffer.length;

  const lamports = BigInt(Math.round(priceInSol * LAMPORTS_PER_SOL));
  data.writeBigUInt64LE(lamports, offset);

  // PDA = hash of ["agent", developer pubkey, agent name]
  const [agentPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("agent"), developerWallet.publicKey.toBuffer(), nameBuffer],
    programId
  );

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: developerWallet.publicKey, isSigner: true,  isWritable: true  },
      { pubkey: agentPDA,                  isSigner: false, isWritable: true  },
      { pubkey: SystemProgram.programId,   isSigner: false, isWritable: false },
    ],
    programId,
    data,
  });

  const transaction = new Transaction().add(instruction);
  transaction.feePayer = developerWallet.publicKey;
  transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

  const signature = await developerWallet.sendTransaction(transaction, connection);
  await connection.confirmTransaction(signature, "confirmed");

  return { signature, agentPDA: agentPDA.toBase58() };
};
