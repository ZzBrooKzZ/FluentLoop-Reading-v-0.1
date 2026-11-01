import React from 'react';
import App from '@/src/App';

export default function HomePage() {
  // Regular reading passages are never serialized into unauthenticated SSR HTML.
  // Authenticated Google learners load sanitized lessons exclusively via GET /api/lessons.
  return <App initialSanitizedLessons={[]} />;
}
