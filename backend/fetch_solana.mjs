fetch('https://api.devnet.solana.com', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'getAccountInfo',
    params: ['Gkh5t4pgh19DgdAogGdADhzKhYpDBQynUcHvWvL9A9Yz']
  })
}).then(res => res.json()).then(data => console.log(data)).catch(console.error);
