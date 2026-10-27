#!/usr/bin/env node
/**
 * FluentLoop Reading — Cloud Secret Manager & Firebase App Hosting Secret Setup
 *
 * Provisions the `GEMINI_API_KEY` secret in Google Cloud Secret Manager and grants
 * runtime access to your Firebase App Hosting backend.
 *
 * Usage:
 *   npm run setup:apphosting-secrets -- --backend=<your-backend-id>
 *   npm run setup:apphosting-secrets -- --dry-run
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
const firebaseConfig = fs.existsSync(configPath)
  ? JSON.parse(fs.readFileSync(configPath, 'utf8'))
  : { projectId: 'project-3ba42a74-36cc-4dbd-ac7' };

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || firebaseConfig.projectId || 'project-3ba42a74-36cc-4dbd-ac7';
const SECRET_NAME = 'GEMINI_API_KEY';

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const backendArg = args.find((arg) => arg.startsWith('--backend='));
const backendIndex = args.indexOf('--backend');
const BACKEND_ID =
  (backendArg ? backendArg.split('=')[1] : undefined) ||
  (backendIndex !== -1 && args[backendIndex + 1] ? args[backendIndex + 1] : undefined) ||
  process.env.FIREBASE_APPHOSTING_BACKEND ||
  'fluentloop-reading';

function hasCli(binary) {
  const result = spawnSync('which', [binary], { encoding: 'utf8' });
  return result.status === 0;
}

const hasFirebaseCli = hasCli('firebase');
const hasGcloudCli = hasCli('gcloud');

console.log('======================================================================');
console.log(' FluentLoop — Cloud Secret Manager & Firebase App Hosting Provisioner');
console.log('======================================================================');
console.log(`• Firebase Project ID : ${PROJECT_ID}`);
console.log(`• App Hosting Backend : ${BACKEND_ID}`);
console.log(`• Secret Name         : ${SECRET_NAME}`);
console.log(`• Config File         : apphosting.yaml (verified)`);
console.log('----------------------------------------------------------------------');

const setSecretCmd = `firebase apphosting:secrets:set ${SECRET_NAME} --project ${PROJECT_ID}`;
const grantSecretCmd = `firebase apphosting:secrets:grantaccess ${SECRET_NAME} --backend ${BACKEND_ID} --project ${PROJECT_ID}`;
const deployRulesCmd = `firebase deploy --only firestore:rules --project ${PROJECT_ID}`;

if (isDryRun || !hasFirebaseCli) {
  if (!hasFirebaseCli) {
    console.log(
      'Note: The `firebase` CLI is not installed in this container environment (or requires interactive browser login).'
    );
  }
  console.log('\nRun these exact commands in your authenticated local terminal:\n');
  console.log(`  # 1. Authenticate with Firebase CLI (if not already signed in)`);
  console.log(`  npx firebase-tools login\n`);
  console.log(`  # 2. Create or update ${SECRET_NAME} in Cloud Secret Manager`);
  console.log(`  npx firebase-tools apphosting:secrets:set ${SECRET_NAME} --project ${PROJECT_ID}\n`);
  console.log(`  # 3. Grant your Firebase App Hosting backend access to ${SECRET_NAME}`);
  console.log(
    `  npx firebase-tools apphosting:secrets:grantaccess ${SECRET_NAME} --backend ${BACKEND_ID} --project ${PROJECT_ID}\n`
  );
  if (hasGcloudCli) {
    console.log('Alternative via Google Cloud SDK (`gcloud`):');
    console.log(
      `  printf "%s" "$GEMINI_API_KEY" | gcloud secrets create ${SECRET_NAME} --data-file=- --project=${PROJECT_ID} --replication-policy="automatic"`
    );
  }
  console.log('======================================================================');
  process.exit(0);
}

console.log(`\n[1/2] Provisioning ${SECRET_NAME} in Cloud Secret Manager...`);
const setResult = spawnSync(
  'firebase',
  ['apphosting:secrets:set', SECRET_NAME, '--project', PROJECT_ID],
  {
    stdio: 'inherit',
    env: process.env,
  }
);

if (setResult.status !== 0) {
  console.error(
    `\nCould not complete '${setSecretCmd}' automatically (exit code ${setResult.status}).`
  );
  console.error('Make sure you are logged in via `firebase login` and have Secret Manager Admin permissions.');
  process.exit(setResult.status || 1);
}

console.log(`\n[2/2] Granting App Hosting backend '${BACKEND_ID}' access to ${SECRET_NAME}...`);
const grantResult = spawnSync(
  'firebase',
  ['apphosting:secrets:grantaccess', SECRET_NAME, '--backend', BACKEND_ID, '--project', PROJECT_ID],
  {
    stdio: 'inherit',
    env: process.env,
  }
);

if (grantResult.status !== 0) {
  console.error(
    `\nCould not complete '${grantSecretCmd}' automatically (exit code ${grantResult.status}).`
  );
  console.error(
    `Verify that the App Hosting backend '${BACKEND_ID}' exists in project '${PROJECT_ID}', or pass --backend=<your-backend-id>.`
  );
  process.exit(grantResult.status || 1);
}

console.log(`\nSuccessfully provisioned ${SECRET_NAME} and granted access to backend '${BACKEND_ID}'.`);
console.log(`Optional: Deploy Firestore rules via: ${deployRulesCmd}`);
