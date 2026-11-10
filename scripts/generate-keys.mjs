/**
 * Generate a minisign-compatible Ed25519 key pair for ChromaDeck update signing.
 *
 * Run: node scripts/generate-keys.mjs
 *
 * Output:
 *  - scripts/.keys/public_key.txt  -> minisign base64 public key (goes in tauri.conf.json)
 *  - scripts/.keys/public_key.raw  -> raw 32-byte public key
 *  - scripts/.keys/secret_key.raw  -> raw 32-byte secret key (KEEP OFFLINE, NEVER COMMIT)
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ALGO_NONPREHASHED = Buffer.from([0x45, 0x64]); // "Ed" = non-prehashed

// Derive an 8-byte key ID from the public key.
function deriveKeyId(pubKey) {
  return crypto.createHash("sha256").update(pubKey).digest().subarray(0, 8);
}

function encodeBase64(buf) {
  return Buffer.from(buf).toString("base64");
}

// Minisign public key = base64(algo[2] + key_id[8] + ed25519_pubkey[32])
function formatMinisignPublicKey(pubKey) {
  const keyId = deriveKeyId(pubKey);
  const payload = Buffer.concat([ALGO_NONPREHASHED, keyId, Buffer.from(pubKey)]);
  return encodeBase64(payload);
}

const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519");

// Ed25519 SPKI DER: 30 2a 30 05 06 03 2b 65 70 03 22 00 <32 bytes>
// The raw public key is the last 32 bytes.
const pubDer = Buffer.from(publicKey.export({ type: "spki", format: "der" }));
const pubKey32 = pubDer.subarray(-32);

const privDer = Buffer.from(privateKey.export({ type: "pkcs8", format: "der" }));
// PKCS8 DER for Ed25519: 30 2d 30 05 06 03 2b 65 70 04 22 00 20 <32 bytes>
// Raw private key is the last 32 bytes.
const privKey32 = privDer.subarray(-32);

const minisignPubKey = formatMinisignPublicKey(pubKey32);

const outDir = path.join(process.cwd(), "scripts", ".keys");
fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(path.join(outDir, "public_key.txt"), minisignPubKey, { encoding: "utf8" });
fs.writeFileSync(path.join(outDir, "public_key.raw"), Buffer.from(pubKey32));
fs.writeFileSync(path.join(outDir, "secret_key.raw"), Buffer.from(privKey32));

console.log("=== Ed25519 key pair generated ===");
console.log(`Public key (minisign base64): ${minisignPubKey}`);
console.log(`Secret key saved to: scripts/.keys/secret_key.raw (KEEP OFFLINE, NEVER COMMIT)`);
console.log(`Public key saved to: scripts/.keys/public_key.txt`);
console.log("");
console.log("Next steps:");
console.log("  1. Copy the public key into ChromaDeck/src-tauri/tauri.conf.json:");
console.log("     \"plugins\": { \"updater\": { \"pubkey\": \"<public key>\" } }");
console.log("  2. Use scripts/sign-manifest.mjs to sign update manifests");
console.log("  3. Never commit secret_key.raw to version control");
