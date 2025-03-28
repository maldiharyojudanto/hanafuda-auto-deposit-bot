# hanafuda-auto-deposit-bot

https://github.com/user-attachments/assets/5cfa783c-d93b-487e-9888-cb3720d9737c

# Features
- Auto deposit ETH (base), ETH (optimism), POL (Polygon)
- Transaction sync

# Requirement
- VS Code
- Node.js 18+

# How to get refresh token
- Open hanafuda website and login with Google Account
- Inspect Element (F12)
- Go to Application -> Session storage -> Click "stsTokenManager" -> copy value of "refreshToken" start with AMf-xxxxx

# How to run
- Open VS Code and Edit line 9 & 10 (Fill refreshToken and privateKey of Wallet start with 0x)
- Open terminal
- Command:
  > npm install

  > node index
- Done
