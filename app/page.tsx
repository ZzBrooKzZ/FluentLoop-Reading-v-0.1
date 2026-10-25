import React from 'react';
import App from '@/src/App';
import {
  getAllAuthoritativeLessons,
  sanitizeLessonForLearner,
} from '@/src/server/lessonRepository';

export default function HomePage() {
  // Server-side sanitization: learner pages receive lessons with private answer keys stripped
  const sanitizedLessons = getAllAuthoritativeLessons()
    .filter((l) => l.status === 'published')
    .map(sanitizeLessonForLearner);

  return <App initialSanitizedLessons={sanitizedLessons} />;
}
