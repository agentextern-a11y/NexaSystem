# Secure Web3 Wallet Core — Hardened Reference Architecture

## 1. Core Security Principle

This system enforces a strict non-custodial model:

- Private keys never enter application state
- Signing is delegated to external trusted providers
- UI, transaction logic, and signing are strictly separated
- All external inputs (RPC, dependencies, dApp data) are treated as untrusted

---

## 2. System Architecture

### Layers

### 1. UI Layer
- React / Next.js frontend
- Displays transaction intent only
- Collects user approval
- Never accesses private keys or signing material

### 2. Wallet Abstraction Layer
Supported providers:
- MetaMask (injected provider)
- WalletConnect v2
- Hardware wallets (Ledger/Trezor)

Interface:
- getAddress()
- signMessage()
- signTypedData()
- sendTransaction()

Constraint:
- Opaque signer object only
- No persistence of sensitive state

---

### 3. Transaction Orchestration Layer

Responsibilities:
- Build transaction objects
- Decode ABI calls
- Validate recipients
- Simulate execution before signing
- Enforce chainId correctness

Rules:
- Transactions are immutable after creation
- No UI-driven mutation allowed during signing flow

---

### 4. RPC Layer

Rules:
- Only allowlisted RPC endpoints
- No user-supplied RPC URLs
- Chain ID verification required on all responses
- Fail closed on inconsistent state

---

### 5. Security Layer (Cross-cutting)

- CSP enforcement (no unsafe-inline scripts)
- Dependency pinning (lockfile enforced)
- Input sanitization for all external data
- Signature domain enforcement (EIP-712 strict mode)
- Runtime integrity checks for critical modules

---

## 3. Data Flow (Secure Signing Lifecycle)

1. User creates transaction intent
2. System validates schema + address + chainId
3. Transaction simulation executed
4. UI renders immutable transaction preview
5. User approves or rejects
6. Signing delegated to external provider
7. Signed transaction broadcast via RPC
8. Return tx hash only (no sensitive data persisted)

---

## 4. Forbidden Patterns

The following are explicitly disallowed:

- Storing private keys in localStorage/sessionStorage
- Generating mnemonics inside frontend
- Using Math.random for cryptographic operations
- Custom signing implementations without external provider
- Unsafe RPC fallback chains
- Blind signing without calldata inspection

---

## 5. Threat Model Summary

### Primary risks:
- XSS-based key exfiltration
- Dependency supply chain attacks
- Malicious RPC response manipulation
- Phishing dApp signature requests
- UI transaction spoofing

---

## 6. Required Security Controls

### Client Security
- Strict Content Security Policy
- No inline scripts
- DOM sanitization for all external inputs

### Build Security
- Locked dependency versions
- CI-based vulnerability scanning
- No unverified postinstall scripts

### Runtime Security
- Transaction simulation before signing
- Immutable transaction objects
- Explicit user confirmation with full calldata visibility

---

## 7. Recommended Stack

- Frontend: Next.js (strict CSP mode)
- Wallet: WalletConnect v2 + MetaMask
- Signing: External provider only
- Simulation: Anvil / Hardhat fork or external simulation API
- RPC: Alchemy / Infura allowlisted endpoints

---

## 8. Security Classification

System is considered production-safe only if:

- No internal key generation exists
- No persistence of sensitive material
- All signing is externalized
- Transactions are simulated before approval
- RPC is strictly controlled and verified
