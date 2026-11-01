#!/usr/bin/env node
/**
 * FluentLoop Reading — Authoritative Phase 1 Secret Manager, App Hosting & Firestore TTL Provisioner
 *
 * Authoritative Identifiers (from firebase-applet-config.json):
 * - Google Cloud / Firebase Project ID : project-3ba42a74-36cc-4dbd-ac7
 * - Named Firestore Database ID        : ai-studio-fluentloopreadin-b84ae31b-293a-4b18-b14c-75c74171bbe6
 * - Secret Manager Secret Name         : PLACEMENT_GUEST_SECRET
 * - Firestore TTL Target               : collectionGroup=placement_sessions, field=expireAt
 *
 * Security & Operational Safeguards:
 * 1. Never overwrites or rotates an existing secret that already has an ENABLED version.
 * 2. Safely detects an existing secret container that has 0 ENABLED versions and provisions an enabled version.
 * 3. Generates missing secret material using `crypto.randomBytes(32)` (256 bits / 64 hex ASCII bytes).
 * 4. Sends exact ASCII bytes (`Buffer.from(hex, 'ascii')`) via stdin (`--data-file=-`) with ZERO trailing newline (`\r` or `\n`).
 * 5. Never prints, logs, or writes the secret value to disk.
 * 6. Fails fast (`process.exit(1)`) on any CLI, permission, secret, IAM, or TTL error instead of silently continuing.
 *
 * Usage:
 *   npm run setup:apphosting-secrets -- --backend=<your-apphosting-backend-id>
 *   npm run setup:apphosting-secrets -- --dry-run
 */

import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
if (!fs.existsSync(configPath)) {
  console.error('ERROR: firebase-applet-config.json not found in repository root.');
  process.exit(1);
}

const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const PROJECT_ID = firebaseConfig.projectId;
const FIRESTORE_DB_ID = firebaseConfig.firestoreDatabaseId;
const PLACEMENT_SECRET_NAME = 'PLACEMENT_GUEST_SECRET';
const PLACEMENT_TTL_COLLECTION_GROUP = 'placement_sessions';
const PLACEMENT_TTL_FIELD = 'expireAt';

if (!PROJECT_ID || !FIRESTORE_DB_ID) {
  console.error(
    'ERROR: firebase-applet-config.json is missing required projectId or firestoreDatabaseId.'
  );
  process.exit(1);
}

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const backendArg = args.find((arg) => arg.startsWith('--backend='));
const backendIndex = args.indexOf('--backend');
const EXPLICIT_BACKEND_ID =
  (backendArg ? backendArg.split('=')[1] : undefined) ||
  (backendIndex !== -1 && args[backendIndex + 1] ? args[backendIndex + 1] : undefined) ||
  process.env.FIREBASE_APPHOSTING_BACKEND ||
  '';

function resolveCliExecutable(baseName) {
  const candidates =
    process.platform === 'win32' ? [`${baseName}.cmd`, `${baseName}.exe`, baseName] : [baseName];
  const locator = process.platform === 'win32' ? 'where.exe' : 'which';

  for (const candidate of candidates) {
    const res = spawnSync(locator, [candidate], { encoding: 'utf8' });
    if (res.status === 0 && res.stdout) {
      const firstLine = res.stdout
        .split(/\r?\n/)
        .map((line) => line.trim())
        .find(Boolean);
      if (firstLine) {
        return firstLine;
      }
    }
  }
  return null;
}

function runCliCommand(executablePath, cliArgs, options = {}) {
  const isWinCmd =
    process.platform === 'win32' && executablePath.toLowerCase().endsWith('.cmd');
  if (isWinCmd) {
    return spawnSync('cmd.exe', ['/d', '/s', '/c', executablePath, ...cliArgs], options);
  }
  return spawnSync(executablePath, cliArgs, options);
}

const gcloudBin = resolveCliExecutable('gcloud');
const firebaseBin = resolveCliExecutable('firebase');

console.log('======================================================================');
console.log(' FluentLoop — Phase 1 Secret Manager & Firestore TTL Provisioner');
console.log('======================================================================');
console.log(`• Authoritative GCP Project ID : ${PROJECT_ID}`);
console.log(`• Named Firestore Database ID  : ${FIRESTORE_DB_ID}`);
console.log(`• Secret Manager Resource      : projects/${PROJECT_ID}/secrets/${PLACEMENT_SECRET_NAME}`);
console.log(`• Firestore TTL Target         : ${PLACEMENT_TTL_COLLECTION_GROUP}.${PLACEMENT_TTL_FIELD}`);
console.log(
  `• App Hosting Backend ID       : ${EXPLICIT_BACKEND_ID || '(require --backend=<id>)'}`
);
console.log('----------------------------------------------------------------------');

if (isDryRun) {
  console.log('\n[DRY RUN] Configuration verified. No Google Cloud changes were executed.');
  process.exit(0);
}

if (!gcloudBin) {
  console.error(
    '\nERROR: Google Cloud SDK (`gcloud`) was not found in PATH. Install and authenticate via `gcloud auth login` first.'
  );
  process.exit(1);
}

if (!firebaseBin) {
  console.error(
    '\nERROR: Firebase CLI (`firebase`) was not found in PATH. Install via `npm install -g firebase-tools` and authenticate via `firebase login` first.'
  );
  process.exit(1);
}

if (!EXPLICIT_BACKEND_ID) {
  console.error(
    `\nERROR: Missing required --backend=<YOUR_BACKEND_ID> argument.\n` +
      `First list your backend ID with:\n` +
      `  firebase apphosting:backends:list --project=${PROJECT_ID}\n` +
      `Then re-run:\n` +
      `  npm run setup:apphosting-secrets -- --backend=<YOUR_BACKEND_ID>`
  );
  process.exit(1);
}

function upload256BitSecretVersion() {
  const randomBuf = crypto.randomBytes(32);
  const hexSecret = randomBuf.toString('hex'); // Exactly 64 hex chars (256 bits), zero newline
  const payloadBuffer = Buffer.from(hexSecret, 'ascii');
  randomBuf.fill(0);

  if (payloadBuffer.byteLength !== 64) {
    payloadBuffer.fill(0);
    console.error('ERROR: Internal secret buffer length check failed.');
    process.exit(1);
  }

  const addVersionRes = runCliCommand(
    gcloudBin,
    [
      'secrets',
      'versions',
      'add',
      PLACEMENT_SECRET_NAME,
      `--project=${PROJECT_ID}`,
      '--data-file=-',
    ],
    {
      input: payloadBuffer,
      stdio: ['pipe', 'pipe', 'pipe'],
    }
  );

  payloadBuffer.fill(0);

  if (addVersionRes.status !== 0) {
    const errText = addVersionRes.stderr ? addVersionRes.stderr.toString('utf8') : '';
    console.error(
      `ERROR: Failed to upload secret version for '${PLACEMENT_SECRET_NAME}' (exit code ${addVersionRes.status}).\n${errText}`
    );
    process.exit(addVersionRes.status || 1);
  }

  console.log(
    `✓ Uploaded 256-bit (64-hex-byte, newline-free) secret version to 'projects/${PROJECT_ID}/secrets/${PLACEMENT_SECRET_NAME}'.`
  );
}

// Step 1: Inspect Secret Manager container & enabled versions (never rotate an active secret)
console.log(
  `\n[1/3] Inspecting 'projects/${PROJECT_ID}/secrets/${PLACEMENT_SECRET_NAME}' in Secret Manager...`
);
const describeRes = runCliCommand(
  gcloudBin,
  ['secrets', 'describe', PLACEMENT_SECRET_NAME, `--project=${PROJECT_ID}`, '--format=json'],
  { encoding: 'utf8' }
);

if (describeRes.status === 0) {
  // Secret container exists -> verify whether it has at least one ENABLED version
  const listVersionsRes = runCliCommand(
    gcloudBin,
    [
      'secrets',
      'versions',
      'list',
      PLACEMENT_SECRET_NAME,
      `--project=${PROJECT_ID}`,
      '--filter=state=ENABLED',
      '--format=json',
    ],
    { encoding: 'utf8' }
  );

  if (listVersionsRes.status !== 0) {
    console.error(
      `ERROR: Could not list versions for '${PLACEMENT_SECRET_NAME}':\n${listVersionsRes.stderr || ''}`
    );
    process.exit(listVersionsRes.status || 1);
  }

  let enabledVersions = [];
  try {
    enabledVersions = JSON.parse(listVersionsRes.stdout || '[]');
  } catch (err) {
    console.error(`ERROR: Failed to parse version list JSON: ${err.message}`);
    process.exit(1);
  }

  if (Array.isArray(enabledVersions) && enabledVersions.length > 0) {
    const latestEnabledName = enabledVersions[0]?.name || 'enabled-version';
    console.log(
      `✓ Secret '${PLACEMENT_SECRET_NAME}' already exists with ${enabledVersions.length} ENABLED version(s) (latest: ${latestEnabledName}).`
    );
    console.log(
      `  Skipping secret generation/rotation so existing guest placement tokens remain valid.`
    );
  } else {
    console.log(
      `• Secret container '${PLACEMENT_SECRET_NAME}' exists but has 0 ENABLED versions. Uploading initial 256-bit version...`
    );
    upload256BitSecretVersion();
  }
} else {
  const stderrMsg = describeRes.stderr || '';
  if (stderrMsg.includes('NOT_FOUND') || stderrMsg.includes('not found')) {
    console.log(
      `• Secret '${PLACEMENT_SECRET_NAME}' does not exist yet in project '${PROJECT_ID}'. Creating secret container...`
    );
    const createRes = runCliCommand(
      gcloudBin,
      [
        'secrets',
        'create',
        PLACEMENT_SECRET_NAME,
        `--project=${PROJECT_ID}`,
        '--replication-policy=automatic',
      ],
      { encoding: 'utf8' }
    );

    if (createRes.status !== 0) {
      console.error(
        `ERROR: Failed to create secret '${PLACEMENT_SECRET_NAME}' in project '${PROJECT_ID}':\n${createRes.stderr || ''}`
      );
      process.exit(createRes.status || 1);
    }

    upload256BitSecretVersion();
  } else {
    console.error(
      `ERROR: Failed to inspect secret '${PLACEMENT_SECRET_NAME}' in project '${PROJECT_ID}':\n${stderrMsg}`
    );
    process.exit(describeRes.status || 1);
  }
}

// Step 2: Grant Firebase App Hosting runtime service account access
console.log(
  `\n[2/3] Granting App Hosting backend '${EXPLICIT_BACKEND_ID}' access to '${PLACEMENT_SECRET_NAME}' in project '${PROJECT_ID}'...`
);
const grantRes = runCliCommand(
  firebaseBin,
  [
    'apphosting:secrets:grantaccess',
    PLACEMENT_SECRET_NAME,
    '--backend',
    EXPLICIT_BACKEND_ID,
    '--project',
    PROJECT_ID,
  ],
  { stdio: 'inherit' }
);

if (grantRes.status !== 0) {
  console.error(
    `\nERROR: 'firebase apphosting:secrets:grantaccess' failed with exit code ${grantRes.status}. Halting.`
  );
  process.exit(grantRes.status || 1);
}
console.log(`✓ Granted App Hosting backend '${EXPLICIT_BACKEND_ID}' runtime access to '${PLACEMENT_SECRET_NAME}'.`);

// Step 3: Enable Firestore TTL policy on collectionGroup=placement_sessions, field=expireAt
console.log(
  `\n[3/3] Configuring Firestore TTL policy on database '${FIRESTORE_DB_ID}' (${PLACEMENT_TTL_COLLECTION_GROUP}.${PLACEMENT_TTL_FIELD})...`
);
const ttlRes = runCliCommand(
  gcloudBin,
  [
    'firestore',
    'fields',
    'ttls',
    'update',
    PLACEMENT_TTL_FIELD,
    `--collection-group=${PLACEMENT_TTL_COLLECTION_GROUP}`,
    `--database=${FIRESTORE_DB_ID}`,
    '--enable-ttl',
    `--project=${PROJECT_ID}`,
  ],
  { encoding: 'utf8' }
);

if (ttlRes.status !== 0) {
  const ttlErr = ttlRes.stderr || '';
  // If TTL is already enabled or an enabling operation is already in progress on this field, report clearly
  if (ttlErr.includes('ALREADY_EXISTS') || ttlErr.includes('already enabled')) {
    console.log(
      `✓ Firestore TTL policy on '${PLACEMENT_TTL_COLLECTION_GROUP}.${PLACEMENT_TTL_FIELD}' is already enabled.`
    );
  } else {
    console.error(
      `ERROR: Failed to configure Firestore TTL policy on database '${FIRESTORE_DB_ID}':\n${ttlErr}`
    );
    process.exit(ttlRes.status || 1);
  }
} else {
  console.log(
    `✓ Firestore TTL policy enabled on database '${FIRESTORE_DB_ID}' for '${PLACEMENT_TTL_COLLECTION_GROUP}.${PLACEMENT_TTL_FIELD}'.`
  );
}

console.log('\n======================================================================');
console.log(' ✓ All Phase 1 Secret Manager, App Hosting & Firestore TTL steps succeeded.');
console.log('======================================================================');
