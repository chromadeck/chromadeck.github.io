/**
 * Sign a binary file (e.g. MSI installer) with minisign-compatible Ed25519.
 *
 * Usage:
 *   node scripts/sign-file.mjs <file-to-sign> [secret_key.der]
 *
 * If secret_key.der is omitted, looks for scripts/.keys/secret_key.der.
 *
 * Output: writes <file>.sig with the minisign signature block, and prints the
 * signature base64 string to embed in the update manifest.
 *
 * Minisign signature format (4 lines):
 *   untrusted comment: <comment>
 *   <base64(algo[2] + key_id[8] + signature[64])>
 *   trusted comment: <comment>
 *   <base64(global_signature[64])>
 *
 * The global signature signs: signature_bytes(64) + trusted_comment_bytes.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ALGO_NONPREHASHED = Buffer.from([0x45, 0x64]); // "Ed" = non-prehashed

function deriveKeyId(pubKey) {
  return crypto.createHash("sha256").update(pubKey).digest().subarray(0, 8);
}

function encodeBase64(buf) {
  return Buffer.from(buf).toString("base64");
}

const fileToSign = process.argv[2];
const secretKeyPath = process.argv[3] || path.join(process.cwd(), "scripts", ".keys", "secret_key.der");

if (!fileToSign) {
  console.error("Usage: node scripts/sign-file.mjs <file-to-sign> [secret_key.der]");
  process.exit(1);
}

if (!fs.existsSync(fileToSign)) {
  console.error(`File not found: ${fileToSign}`);
  process.exit(1);
}

if (!fs.existsSync(secretKeyPath)) {
  console.error(`Secret key not found: ${secretKeyPath}`);
  console.error("Run scripts/generate-keys.mjs first.");
  process.exit(1);
}

const publicKeyPath = path.join(path.dirname(secretKeyPath), "public_key.raw");

if (!fs.existsSync(publicKeyPath)) {
  console.error(`Public key not found: ${publicKeyPath}`);
  process.exit(1);
}

const fileData = fs.readFileSync(fileToSign);
const privateKeyDer = fs.readFileSync(secretKeyPath);
const publicKey = fs.readFileSync(publicKeyPath);
const keyId = deriveKeyId(publicKey);

// Sign the raw file data (non-prehashed mode signs data directly)
const privateKey = crypto.createPrivateKey({
  key: privateKeyDer,
  format: "der",
  type: "pkcs8",
});
const signature = crypto.sign(null, fileData, privateKey); // 64 bytes, Ed25519 no-prehash

// Build the signature block
const sigPayload = Buffer.concat([ALGO_NONPREHASHED, keyId, signature]);
const sigBase64 = encodeBase64(sigPayload);

const untrustedComment = "untrusted comment: signature from ChromaDeck release key";
const trustedCommentData = `trusted comment: timestamp:${Math.floor(Date.now() / 1000)}\tfile:${path.basename(fileToSign)}\tprehashed`;

// Global signature signs: signature_bytes(64) + trusted_comment_bytes
const globalSignature = crypto.sign(null, Buffer.concat([signature, Buffer.from(trustedCommentData, "utf8")]), privateKey);
const globalBase64 = encodeBase64(globalSignature);

const sigBlock = [
  untrustedComment,
  sigBase64,
  trustedCommentData,
  globalBase64,
].join("\n") + "\n";

const sigPath = fileToSign + ".sig";
fs.writeFileSync(sigPath, sigBlock, { encoding: "utf8" });

console.log(`=== File signed ===`);
console.log(`File: ${fileToSign}`);
console.log(`Signature: ${sigPath}`);
console.log("");
console.log(`Signature base64 (embed in manifest "data.signature" field):`);
console.log(sigBase64);
console.log("");
console.log("Add this to your manifest JSON:");
console.log(JSON.stringify({ signature: sigBase64 }, null, 2));
