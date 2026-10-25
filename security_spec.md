# FluentLoop Reading — Firestore Security Specification (Phase 0 TDD)

## 1. Data Invariants

1. **Default-Deny Catch-All**: Any path not explicitly matched is unconditionally denied (`allow read, write: if false;`).
2. **Administrator Authority (`isAdmin`)**: Only verified administrators (`exists(/databases/$(database)/documents/admins/$(request.auth.uid))` or the bootstrapped owner email `megritarek19@gmail.com` with `request.auth.token.email_verified == true`) can create, update, or delete lessons in `/lessons/{lessonId}` or read unpublished (`draft` / `archived`) lessons.
3. **Public Lesson Visibility**: Unauthenticated visitors and standard learners may only `get` or `list` `/lessons/{lessonId}` documents where `resource.data.status == 'published'`.
4. **User Profile Isolation (`/users/{userId}`)**: A learner can only read, create, or update their own `/users/{userId}` document (`request.auth.uid == userId`), and `incoming().uid == request.auth.uid`. No self-assigned admin role fields are permitted (`hasOnly` strict key enforcement).
5. **Attempt Ownership & Immutability (`/attempts/{attemptId}`)**: Every attempt must belong to `request.auth.uid` (`incoming().userId == request.auth.uid`). `list` queries are strictly constrained by `resource.data.userId == request.auth.uid || isAdmin()`. Once an attempt reaches `status == 'completed'`, standard users cannot mutate `userId`, `lessonId`, or `createdAt`.
6. **Personal Vocabulary Ownership (`/vocabulary/{vocabId}`)**: Every saved vocabulary record must belong to `request.auth.uid` (`incoming().userId == request.auth.uid`). `list` queries enforce `resource.data.userId == request.auth.uid || isAdmin()`.
7. **Temporal Integrity**: Every `create` operation requires `incoming().createdAt == request.time && incoming().updatedAt == request.time`. Every `update` operation requires `incoming().updatedAt == request.time && incoming().createdAt == existing().createdAt`.
8. **Path Variable & Volumetric Hardening**: All document IDs must satisfy `isValidId(id)` (`^[a-zA-Z0-9_\-]+$`, max 128 chars) and all string fields enforce explicit `.size()` bounds matching `firebase-blueprint.json`.

---

## 2. The "Dirty Dozen" Payloads

1. **Shadow Field Injection on UserProfile**: Creating `/users/user_1` with `{ ..., "isAdmin": true }` -> Rejected by `hasOnly`.
2. **Cross-User Profile Read (PII / Privacy Leak)**: Authenticated `user_2` attempting `get(/users/user_1)` -> Rejected by `request.auth.uid == userId || isAdmin()`.
3. **Unverified Email Spoof of Bootstrapped Admin**: Token with `email: "megritarek19@gmail.com"` and `email_verified: false` attempting `create` on `/lessons/lesson_1` -> Rejected by `request.auth.token.email_verified == true`.
4. **Draft Lesson Scraping by Learner**: Standard user attempting `get` or `list` on `/lessons/draft_lesson` where `status == 'draft'` -> Rejected by `resource.data.status == 'published' || isAdmin()`.
5. **Identity Spoofing on Attempt Creation**: `user_1` creating `/attempts/att_1` with `userId: "user_2"` -> Rejected by `data.userId == request.auth.uid`.
6. **Unauthorized Blanket List on Attempts**: `user_1` executing unconstrained `list(/attempts)` without `where('userId', '==', 'user_1')` -> Rejected by `resource.data.userId == request.auth.uid`.
7. **Immutable Field Tampering on Attempt Update**: `user_1` updating `/attempts/att_1` to change `lessonId` or `createdAt` -> Rejected by `affectedKeys().hasOnly(...)` and immutable checks.
8. **Value Poisoning on Attempt Accuracy**: `user_1` updating `/attempts/att_1` with `accuracy: 999` or string `"100%"` -> Rejected by `isValidAttempt(incoming())` (`data.accuracy >= 0 && data.accuracy <= 100`).
9. **ID Poisoning Attack**: Creating `/vocabulary/bad$id!with/slashes` or >128 char ID -> Rejected by `isValidId(vocabId)`.
10. **Denial-of-Wallet Oversized String**: Creating `/vocabulary/voc_1` with a 50,000-character `simpleDefinition` -> Rejected by `data.simpleDefinition.size() <= 600`.
11. **Forged Client Timestamp**: Creating `/vocabulary/voc_1` with a past/future `createdAt` instead of `request.time` -> Rejected by `incoming().createdAt == request.time`.
12. **Privilege Escalation via `/admins` Write**: Standard user attempting to create `/admins/user_1` -> Rejected by `allow write: if false;` on `/admins/{adminId}`.
