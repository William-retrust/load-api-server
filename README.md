# Load API Server

A NestJS-based blockchain load testing API server for Ethereum transactions. This server provides endpoints to programmatically send ERC20 token transactions for load testing purposes.

## Features

- **Blockchain Integration**: Built with ethers.js for Ethereum blockchain interaction
- **ERC20 Token Transfers**: Automated token transfer functionality
- **Load Testing Support**: Designed for high-volume transaction testing
- **REST API**: Simple HTTP endpoints for transaction execution
- **Connection Pooling**: Uses agentkeepalive for optimized HTTP connections
- **Environment Configuration**: Configurable through environment variables

## Technology Stack

- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Blockchain**: Ethereum (ethers.js v5)
- **HTTP Client**: Axios with connection pooling
- **Testing**: Jest

## API Endpoints

### GET `/`
Returns a simple "Hello World!" message to verify the server is running.

### GET `/sendTx`
Executes an ERC20 token transfer transaction. This endpoint:
- Creates a signed transaction using the configured private key
- Transfers 1 token unit to the configured recipient address
- Sends the transaction to the blockchain via RPC
- Returns the transaction hash

## Configuration

The application requires the following environment variables:

```env
TO_ADDRESS=0x... # Recipient address for token transfers
TOKEN_ADDRESS=0x... # ERC20 token contract address
OWNER_PRIV_KEY=0x... # Private key of the wallet funding transactions
RPC_URL=https://... # Blockchain RPC endpoint URL
```

## Installation

```bash
# Install dependencies
npm install
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

The server will start on port 3000 by default.

## Testing

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Development

```bash
# Format code
npm run format

# Lint code
npm run lint

# Build application
npm run build
```

## Project Structure

```
src/
├── dto/                    # Data Transfer Objects
│   ├── rpc-request.ts     # RPC request structures
│   └── rpc-response.ts    # RPC response structures
├── app.controller.ts      # REST API endpoints
├── app.service.ts         # Business logic and blockchain interaction
├── app.module.ts          # Application module configuration
└── main.ts               # Application bootstrap
```

## Security Notes

⚠️ **Important Security Considerations:**

- This application handles private keys and should only be used in secure environments
- Never commit private keys to version control
- Use environment variables for all sensitive configuration
- This tool is intended for development and testing purposes only
- Ensure proper network security when running in production environments

## Load Testing Usage

This server is designed for blockchain load testing scenarios. Each call to `/sendTx` will:

1. Increment the transaction nonce automatically
2. Create a properly formatted ERC20 transfer transaction
3. Sign the transaction with the configured private key
4. Submit the transaction to the blockchain
5. Return the transaction hash for tracking

The nonce management ensures sequential transactions can be sent rapidly without conflicts.

## License

UNLICENSED - This is a private project.