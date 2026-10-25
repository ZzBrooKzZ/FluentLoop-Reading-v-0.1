/**
 * Firestore Security Rules Verification Suite (Dirty Dozen Test Specification)
 * Verifies all 12 adversarial payloads described in security_spec.md are rejected.
 */

export interface DirtyDozenTestCase {
  id: number;
  name: string;
  collection: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  expectedResult: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_TESTS: DirtyDozenTestCase[] = [
  { id: 1, name: 'Shadow Field Injection on UserProfile (isAdmin: true)', collection: 'users', operation: 'create', expectedResult: 'PERMISSION_DENIED' },
  { id: 2, name: 'Cross-User Profile Read by Non-Owner', collection: 'users', operation: 'get', expectedResult: 'PERMISSION_DENIED' },
  { id: 3, name: 'Unverified Email Spoof of Bootstrapped Admin', collection: 'lessons', operation: 'create', expectedResult: 'PERMISSION_DENIED' },
  { id: 4, name: 'Draft Lesson Read by Non-Admin Learner', collection: 'lessons', operation: 'get', expectedResult: 'PERMISSION_DENIED' },
  { id: 5, name: 'Identity Spoofing on Attempt Creation', collection: 'attempts', operation: 'create', expectedResult: 'PERMISSION_DENIED' },
  { id: 6, name: 'Unauthorized Blanket List on Attempts', collection: 'attempts', operation: 'list', expectedResult: 'PERMISSION_DENIED' },
  { id: 7, name: 'Immutable Field Tampering on Attempt Update', collection: 'attempts', operation: 'update', expectedResult: 'PERMISSION_DENIED' },
  { id: 8, name: 'Value Poisoning on Attempt Accuracy (>100)', collection: 'attempts', operation: 'update', expectedResult: 'PERMISSION_DENIED' },
  { id: 9, name: 'ID Poisoning Attack with Invalid Characters', collection: 'vocabulary', operation: 'create', expectedResult: 'PERMISSION_DENIED' },
  { id: 10, name: 'Denial-of-Wallet Oversized String on Vocabulary', collection: 'vocabulary', operation: 'create', expectedResult: 'PERMISSION_DENIED' },
  { id: 11, name: 'Forged Client Timestamp on Creation', collection: 'vocabulary', operation: 'create', expectedResult: 'PERMISSION_DENIED' },
  { id: 12, name: 'Direct Privilege Escalation via /admins Write', collection: 'admins', operation: 'create', expectedResult: 'PERMISSION_DENIED' },
];
