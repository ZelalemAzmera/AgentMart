const web3 = require("@solana/web3.js");
const conn = new web3.Connection("https://api.devnet.solana.com");
conn.getAccountInfo(new web3.PublicKey("Gkh5t4pgh19DgdAogGdADhzKhYpDBQynUcHvWvL9A9Yz"))
  .then(info => console.log(info ? "Program is deployed: " + info.executable : "Program not found on devnet"))
  .catch(console.error);
