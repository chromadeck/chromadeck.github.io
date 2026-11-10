/**
 * Sign a ChromaDeck update manifest with minisign-compatible Ed25519.
 *
 * Usage:
 *   node scripts/sign-manifest.mjs <manifest.json> [secret_key.raw]
 *
 * If secret_key.raw is omitted, looks for scripts/.keys/secret_key.raw.
 *
 * Output: writes <manifest.json>.sig with the minisign signature block,
 * and prints the signature base64 string to embed in the manifest.
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

const ALGO_NONPREHASHED = Buffer.from([0x45, 0x64]); // "Ed"

function deriveKeyId(pubKey) {
  return crypto.createHash("sha256").update(pubKey).digest().subarray(0, 8);
}

function encodeBase64(buf) {
  return Buffer.from(buf).toString("base64");
}

function decodeBase64(str) {
  return Buffer.from(str, "base64");
}

const manifestPath = process.argv[2];
const secretKeyPath = process.argv[3] || path.join(process.cwd(), "scripts", ".keys", "secret_key.raw");

if (!manifestPath) {
  console.error("Usage: node scripts/sign-manifest.mjs <manifest.json> [secret_key.raw]");
  process.exit(1);
}

if (!fs.existsSync(manifestPath)) {
  console.error(`Manifest not found: ${manifestPath}`);
  process.exit(1);
}

if (!fs.existsSync(secretKeyPath)) {
  console.error(`Secret key not found: ${secretKeyPath}`);
  console.error("Run scripts/generate-keys.mjs first.");
  process.exit(1);
}

const manifest = fs.readFileSync(manifestPath, "utf8");
const secretKey = fs.readFileSync(secretKeyPath);
const publicKeyPath = path.join(path.dirname(secretKeyPath), "public_key.raw");
const publicKey = fs.readFileSync(publicKeyPath);
const keyId = deriveKeyId(publicKey);

// Sign the raw manifest data (non-prehashed mode signs data directly)
const signer = crypto.createSign("ed25519");
signer.update(Buffer.from(manifest, "utf8"));
signer.end();
const signature = signer.sign(null, secretKey); // 64 bytes

// Build the signature block
const sigPayload = Buffer.concat([ALGO_NONPREHASHED, keyId, signature]);
const sigBase64 = encodeBase64(sigPayload);

const untrustedComment = "untrusted comment: signature from ChromaDeck release key";
const trustedCommentData = `trusted comment: timestamp:${Math.floor(Date.now() / 1000)}\tfile:${path.basename(manifestPath)}\tprehashed`;

// Global signature signs: signature_bytes(64) + trusted_comment_bytes
const globalSigner = crypto.createSign("ed25519");
globalSigner.update(Buffer.concat([signature, Buffer.from(trustedCommentData, "utf8")]));
globalSigner.end();
const globalSignature = globalSigner.sign(null, secretKey);
const globalBase64 = encodeBase64(globalSignature);

const sigBlock = [
  untrustedComment,
  sigBase64,
  trustedCommentData,
  globalBase64,
].join("\n") + "\n";

const sigPath = manifestPath + ".sig";
fs.writeFileSync(sigPath, sigBlock, { encoding: "utf8" });

console.log(`=== Manifest signed ===`);
console.log(`Manifest: ${manifestPath}`);
console.log(`Signature: ${sigPath}`);
console.log("");
console.log(`Signature base64 (embed in manifest "signature" field):`);
console.log(sigBase64);
console.log("");
console.log("Add this to your manifest JSON:");
console.log(JSON.stringify({ signature: sigBase64 }, null, 2));
