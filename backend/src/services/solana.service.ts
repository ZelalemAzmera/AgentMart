import { Connection, PublicKey, ParsedTransactionWithMeta, LAMPORTS_PER_SOL } from '@solana/web3.js';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { env } from '../config/env';
import { logger } from '../utils/logger';

class SolanaService {
  public connection: Connection;

  constructor() {
    this.connection = new Connection(env.SOLANA_RPC_URL, 'confirmed');
  }

  /**
   * Verify a cryptographic signature from a Solana wallet
   */
  public verifyWalletSignature(walletAddress: string, message: string, signature: string): boolean {
    try {
      const publicKey = new PublicKey(walletAddress);
      const signatureBytes = bs58.decode(signature);
      const messageBytes = new TextEncoder().encode(message);

      return nacl.sign.detached.verify(messageBytes, signatureBytes, publicKey.toBytes());
    } catch (error) {
      logger.error('Signature verification failed', error);
      return false;
    }
  }

  /**
   * Get the balance of a wallet in SOL
   */
  public async getWalletBalance(walletAddress: string): Promise<number> {
    try {
      const pubkey = new PublicKey(walletAddress);
      const balance = await this.connection.getBalance(pubkey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      logger.error('Failed to get balance', error);
      throw error;
    }
  }

  /**
   * Get parsed transaction details
   */
  public async getTransactionDetails(txSignature: string): Promise<ParsedTransactionWithMeta | null> {
    try {
      const tx = await this.connection.getParsedTransaction(txSignature, {
        maxSupportedTransactionVersion: 0,
      });
      return tx;
    } catch (error) {
      logger.error(`Failed to get transaction details for ${txSignature}`, error);
      return null;
    }
  }

  /**
   * Verify if a purchase transaction is valid
   */
  public async verifyPurchaseTransaction(
    txSignature: string,
    expectedSender: string,
    expectedReceiver: string,
    expectedAmountSOL: number
  ): Promise<{ valid: boolean; actualAmount?: number; error?: string }> {
    const tx = await this.getTransactionDetails(txSignature);
    
    if (!tx) {
      return { valid: false, error: 'Transaction not found on chain' };
    }

    if (tx.meta?.err) {
      return { valid: false, error: 'Transaction failed on chain' };
    }

    // Advanced verification of sender, receiver, amount requires inspecting instructions and balances.
    // For a hackathon, checking pre and post balances or specific transfer instructions is typical.
    // Here we implement a basic balance change check.
    
    try {
      const senderKey = new PublicKey(expectedSender).toString();
      const receiverKey = new PublicKey(expectedReceiver).toString();
      
      const preBalances = tx.meta?.preBalances || [];
      const postBalances = tx.meta?.postBalances || [];
      const accountKeys = tx.transaction.message.accountKeys.map(k => k.pubkey.toString());

      const senderIndex = accountKeys.indexOf(senderKey);
      const receiverIndex = accountKeys.indexOf(receiverKey);

      if (senderIndex === -1 || receiverIndex === -1) {
        return { valid: false, error: 'Sender or receiver not found in transaction' };
      }

      const senderBalanceChange = (preBalances[senderIndex] - postBalances[senderIndex]) / LAMPORTS_PER_SOL;
      const receiverBalanceChange = (postBalances[receiverIndex] - preBalances[receiverIndex]) / LAMPORTS_PER_SOL;

      // We expect sender balance to decrease by at least amount
      // and receiver balance to increase by at least amount (minus fee handling if any)
      // Note: SOL transfers might be slightly more complex due to network fees, 
      // but the receiver balance change should be exact.
      
      if (receiverBalanceChange < expectedAmountSOL) {
        return { 
          valid: false, 
          error: `Insufficient amount transferred. Expected: ${expectedAmountSOL}, Actual change: ${receiverBalanceChange}` 
        };
      }

      return { valid: true, actualAmount: receiverBalanceChange };
    } catch (error) {
      logger.error('Error verifying purchase transaction logic', error);
      return { valid: false, error: 'Failed to verify transaction structure' };
    }
  }

  // checkOnChainAccessPDA would be implemented here depending on the teammate's Rust program schema
}

export const solanaService = new SolanaService();
