import { AcademicTopic, CEFRLevel } from '../types/reading';

interface TopicTheme {
  bgPrimary: string;
  bgSecondary: string;
  accentPrimary: string;
  accentSecondary: string;
  inkColor: string;
  motif: 'science' | 'environment' | 'psychology' | 'history' | 'education' | 'biology' | 'health' | 'economics' | 'astronomy' | 'architecture';
}

const TOPIC_THEMES: Record<AcademicTopic, TopicTheme> = {
  'Science and technology': {
    bgPrimary: '#0F172A',
    bgSecondary: '#1E293B',
    accentPrimary: '#38BDF8',
    accentSecondary: '#F59E0B',
    inkColor: '#E2E8F0',
    motif: 'science',
  },
  'Environmental science': {
    bgPrimary: '#064E3B',
    bgSecondary: '#065F46',
    accentPrimary: '#34D399',
    accentSecondary: '#FBBF24',
    inkColor: '#ECFDF5',
    motif: 'environment',
  },
  'Psychology and human behaviour': {
    bgPrimary: '#1E1B4B',
    bgSecondary: '#312E81',
    accentPrimary: '#F472B6',
    accentSecondary: '#FBBF24',
    inkColor: '#EEF2FF',
    motif: 'psychology',
  },
  'History and archaeology': {
    bgPrimary: '#451A03',
    bgSecondary: '#78350F',
    accentPrimary: '#F59E0B',
    accentSecondary: '#38BDF8',
    inkColor: '#FEF3C7',
    motif: 'history',
  },
  'Education and learning': {
    bgPrimary: '#172554',
    bgSecondary: '#1E3A8A',
    accentPrimary: '#60A5FA',
    accentSecondary: '#FCD34D',
    inkColor: '#EFF6FF',
    motif: 'education',
  },
  'Biology and animal behaviour': {
    bgPrimary: '#14532D',
    bgSecondary: '#166534',
    accentPrimary: '#4ADE80',
    accentSecondary: '#FB923C',
    inkColor: '#F0FDF4',
    motif: 'biology',
  },
  'Public health': {
    bgPrimary: '#0F3F4C',
    bgSecondary: '#155E75',
    accentPrimary: '#2DD4BF',
    accentSecondary: '#F87171',
    inkColor: '#ECFEFF',
    motif: 'health',
  },
  'Economics and society': {
    bgPrimary: '#1C1917',
    bgSecondary: '#292524',
    accentPrimary: '#FBBF24',
    accentSecondary: '#2DD4BF',
    inkColor: '#FAFAF9',
    motif: 'economics',
  },
  'Astronomy and space exploration': {
    bgPrimary: '#090D16',
    bgSecondary: '#1E1B4B',
    accentPrimary: '#818CF8',
    accentSecondary: '#F59E0B',
    inkColor: '#E0E7FF',
    motif: 'astronomy',
  },
  'Architecture and urban development': {
    bgPrimary: '#1E293B',
    bgSecondary: '#334155',
    accentPrimary: '#F97316',
    accentSecondary: '#38BDF8',
    inkColor: '#F8FAFC',
    motif: 'architecture',
  },
};

function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/**
 * Generates a unique, deterministic 16:9 editorial vector illustration data URI
 * with ZERO embedded text, watermarks, or logos, styled like New Yorker / Economist
 * editorial illustrations for any reading lesson.
 */
export function getEditorialIllustrationUri(
  lessonId: string,
  topic: AcademicTopic,
  level: CEFRLevel
): string {
  const theme = TOPIC_THEMES[topic] || TOPIC_THEMES['Science and technology'];
  const seed = hashSeed(`${lessonId}-${topic}-${level}`);
  const offsetX = (seed % 180) - 90;
  const offsetY = ((seed >> 4) % 80) - 40;
  const scale = 0.92 + ((seed % 20) / 100);

  let motifLayer = '';

  switch (theme.motif) {
    case 'science':
      motifLayer = `
        <g transform="translate(${600 + offsetX}, ${340 + offsetY}) scale(${scale})">
          <circle cx="0" cy="0" r="190" fill="none" stroke="${theme.accentPrimary}" stroke-width="2" stroke-dasharray="8 6" opacity="0.5"/>
          <circle cx="0" cy="0" r="135" fill="none" stroke="${theme.inkColor}" stroke-width="1.5" opacity="0.3"/>
          <ellipse cx="0" cy="0" rx="180" ry="68" transform="rotate(28)" fill="none" stroke="${theme.accentPrimary}" stroke-width="2.5" opacity="0.85"/>
          <ellipse cx="0" cy="0" rx="180" ry="68" transform="rotate(-28)" fill="none" stroke="${theme.accentSecondary}" stroke-width="2.5" opacity="0.85"/>
          <ellipse cx="0" cy="0" rx="180" ry="68" transform="rotate(90)" fill="none" stroke="${theme.inkColor}" stroke-width="1.5" opacity="0.45"/>
          <circle cx="0" cy="0" r="28" fill="${theme.accentSecondary}"/>
          <circle cx="152" cy="78" r="12" fill="${theme.accentPrimary}"/>
          <circle cx="-148" cy="-82" r="10" fill="${theme.accentPrimary}"/>
          <circle cx="0" cy="-180" r="9" fill="${theme.inkColor}"/>
        </g>
        <path d="M 100 560 L 380 420 L 620 490 L 920 310 L 1120 360" fill="none" stroke="${theme.accentPrimary}" stroke-width="2" opacity="0.4"/>
      `;
      break;

    case 'environment':
      motifLayer = `
        <circle cx="${860 + offsetX}" cy="${190 + offsetY}" r="95" fill="${theme.accentSecondary}" opacity="0.88"/>
        <path d="M 0 520 Q 300 ${390 + offsetY} 620 480 T 1200 430 L 1200 675 L 0 675 Z" fill="${theme.bgSecondary}" opacity="0.9"/>
        <path d="M 0 575 Q 380 ${470 - offsetY} 760 545 T 1200 510 L 1200 675 L 0 675 Z" fill="${theme.accentPrimary}" opacity="0.32"/>
        <g transform="translate(${480 + offsetX}, 360) scale(${scale})">
          <path d="M 0 140 L 0 -60" stroke="${theme.inkColor}" stroke-width="5" stroke-linecap="round"/>
          <path d="M 0 40 C -90 20 -110 -70 0 -130 C 110 -70 90 20 0 40 Z" fill="${theme.accentPrimary}" opacity="0.85"/>
          <path d="M 0 -10 L -45 -45 M 0 15 L 48 -22 M 0 -45 L 35 -75" stroke="${theme.bgPrimary}" stroke-width="3" stroke-linecap="round"/>
        </g>
      `;
      break;

    case 'psychology':
      motifLayer = `
        <g transform="translate(${600 + offsetX}, ${335 + offsetY}) scale(${scale})">
          <circle cx="-65" cy="0" r="145" fill="${theme.accentPrimary}" opacity="0.28"/>
          <circle cx="65" cy="0" r="145" fill="${theme.accentSecondary}" opacity="0.28"/>
          <circle cx="0" cy="-55" r="125" fill="none" stroke="${theme.inkColor}" stroke-width="2" opacity="0.55"/>
          <path d="M -140 60 C -70 -90 70 -90 140 60" fill="none" stroke="${theme.accentPrimary}" stroke-width="3"/>
          <path d="M -110 95 C -50 -30 50 -30 110 95" fill="none" stroke="${theme.accentSecondary}" stroke-width="2.5"/>
          <circle cx="-65" cy="-15" r="10" fill="${theme.inkColor}"/>
          <circle cx="65" cy="-15" r="10" fill="${theme.inkColor}"/>
          <circle cx="0" cy="-85" r="12" fill="${theme.accentSecondary}"/>
          <line x1="-65" y1="-15" x2="0" y2="-85" stroke="${theme.inkColor}" stroke-width="1.5" opacity="0.6"/>
          <line x1="65" y1="-15" x2="0" y2="-85" stroke="${theme.inkColor}" stroke-width="1.5" opacity="0.6"/>
          <line x1="-65" y1="-15" x2="65" y2="-15" stroke="${theme.inkColor}" stroke-width="1.5" opacity="0.6"/>
        </g>
      `;
      break;

    case 'history':
      motifLayer = `
        <circle cx="${320 + offsetX}" cy="200" r="85" fill="${theme.accentSecondary}" opacity="0.35"/>
        <g transform="translate(${600 + offsetX * 0.6}, 470) scale(${scale})">
          <rect x="-280" y="60" width="560" height="26" fill="${theme.accentPrimary}" opacity="0.85"/>
          <rect x="-250" y="34" width="500" height="26" fill="${theme.inkColor}" opacity="0.25"/>
          <rect x="-210" y="-170" width="38" height="204" fill="${theme.inkColor}" opacity="0.82"/>
          <rect x="-90" y="-170" width="38" height="204" fill="${theme.inkColor}" opacity="0.82"/>
          <rect x="52" y="-170" width="38" height="204" fill="${theme.inkColor}" opacity="0.82"/>
          <rect x="172" y="-140" width="38" height="174" fill="${theme.inkColor}" opacity="0.55"/>
          <polygon points="-250,-170 250,-170 0,-265" fill="${theme.accentPrimary}" opacity="0.9"/>
        </g>
      `;
      break;

    case 'education':
      motifLayer = `
        <g transform="translate(${600 + offsetX}, ${360 + offsetY}) scale(${scale})">
          <path d="M -240 80 Q -120 40 0 80 Q 120 40 240 80 L 240 -90 Q 120 -130 0 -90 Q -120 -130 -240 -90 Z" fill="${theme.bgSecondary}" stroke="${theme.accentPrimary}" stroke-width="3"/>
          <line x1="0" y1="-90" x2="0" y2="80" stroke="${theme.accentSecondary}" stroke-width="3"/>
          <circle cx="0" cy="-165" r="46" fill="${theme.accentSecondary}" opacity="0.9"/>
          <circle cx="0" cy="-165" r="78" fill="none" stroke="${theme.accentSecondary}" stroke-width="1.5" stroke-dasharray="6 6" opacity="0.6"/>
          <line x1="-180" y1="-35" x2="-45" y2="-35" stroke="${theme.inkColor}" stroke-width="3" opacity="0.5"/>
          <line x1="-180" y1="0" x2="-65" y2="0" stroke="${theme.inkColor}" stroke-width="3" opacity="0.5"/>
          <line x1="45" y1="-35" x2="180" y2="-35" stroke="${theme.inkColor}" stroke-width="3" opacity="0.5"/>
          <line x1="45" y1="0" x2="160" y2="0" stroke="${theme.inkColor}" stroke-width="3" opacity="0.5"/>
        </g>
      `;
      break;

    case 'biology':
      motifLayer = `
        <g transform="translate(${600 + offsetX}, ${335 + offsetY}) scale(${scale})">
          <circle cx="0" cy="0" r="175" fill="${theme.bgSecondary}" stroke="${theme.accentPrimary}" stroke-width="3"/>
          <circle cx="-45" cy="-30" r="52" fill="${theme.accentPrimary}" opacity="0.65"/>
          <circle cx="58" cy="42" r="38" fill="${theme.accentSecondary}" opacity="0.75"/>
          <path d="M -110 55 Q -20 120 85 15" fill="none" stroke="${theme.inkColor}" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
          <circle cx="70" cy="-65" r="16" fill="${theme.inkColor}" opacity="0.6"/>
          <circle cx="-85" cy="45" r="12" fill="${theme.accentSecondary}" opacity="0.8"/>
        </g>
      `;
      break;

    case 'health':
      motifLayer = `
        <g transform="translate(${600 + offsetX}, ${340 + offsetY}) scale(${scale})">
          <circle cx="0" cy="0" r="165" fill="${theme.bgSecondary}" stroke="${theme.accentPrimary}" stroke-width="2.5"/>
          <path d="M -260 10 L -95 10 L -55 -75 L 0 95 L 55 -45 L 90 10 L 260 10" fill="none" stroke="${theme.accentPrimary}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
          <circle cx="-55" cy="-75" r="8" fill="${theme.accentSecondary}"/>
          <circle cx="0" cy="95" r="8" fill="${theme.accentSecondary}"/>
        </g>
      `;
      break;

    case 'economics':
      motifLayer = `
        <g transform="translate(${600 + offsetX * 0.5}, 480) scale(${scale})">
          <rect x="-260" y="-90" width="64" height="90" fill="${theme.bgSecondary}" stroke="${theme.accentPrimary}" stroke-width="2"/>
          <rect x="-150" y="-150" width="64" height="150" fill="${theme.bgSecondary}" stroke="${theme.accentPrimary}" stroke-width="2"/>
          <rect x="-40" y="-210" width="64" height="210" fill="${theme.accentPrimary}" opacity="0.75"/>
          <rect x="70" y="-175" width="64" height="175" fill="${theme.bgSecondary}" stroke="${theme.accentPrimary}" stroke-width="2"/>
          <rect x="180" y="-275" width="64" height="275" fill="${theme.accentSecondary}" opacity="0.9"/>
          <path d="M -228 -120 L -118 -180 L -8 -245 L 102 -205 L 212 -310" fill="none" stroke="${theme.inkColor}" stroke-width="3.5" stroke-linecap="round"/>
          <circle cx="-228" cy="-120" r="7" fill="${theme.inkColor}"/>
          <circle cx="-8" cy="-245" r="7" fill="${theme.inkColor}"/>
          <circle cx="212" cy="-310" r="9" fill="${theme.accentSecondary}"/>
        </g>
      `;
      break;

    case 'astronomy':
      motifLayer = `
        <g transform="translate(${600 + offsetX}, ${335 + offsetY}) scale(${scale})">
          <circle cx="0" cy="0" r="220" fill="none" stroke="${theme.inkColor}" stroke-width="1" stroke-dasharray="4 8" opacity="0.4"/>
          <circle cx="0" cy="0" r="145" fill="none" stroke="${theme.accentPrimary}" stroke-width="1.5" opacity="0.6"/>
          <circle cx="0" cy="0" r="56" fill="${theme.accentSecondary}"/>
          <circle cx="145" cy="0" r="22" fill="${theme.accentPrimary}"/>
          <ellipse cx="145" cy="0" rx="42" ry="11" transform="rotate(-20 145 0)" fill="none" stroke="${theme.inkColor}" stroke-width="2"/>
          <circle cx="-155" cy="-155" r="14" fill="${theme.inkColor}" opacity="0.85"/>
          <circle cx="260" cy="-120" r="4" fill="${theme.inkColor}" opacity="0.7"/>
          <circle cx="-280" cy="90" r="5" fill="${theme.inkColor}" opacity="0.6"/>
        </g>
      `;
      break;

    case 'architecture':
    default:
      motifLayer = `
        <g transform="translate(${600 + offsetX * 0.5}, 520) scale(${scale})">
          <rect x="-310" y="-220" width="130" height="220" fill="${theme.bgSecondary}" stroke="${theme.inkColor}" stroke-width="2" opacity="0.85"/>
          <rect x="-155" y="-330" width="160" height="330" fill="${theme.accentPrimary}" opacity="0.82"/>
          <polygon points="-155,-330 5,-330 -75,-410" fill="${theme.accentSecondary}"/>
          <rect x="30" y="-265" width="145" height="265" fill="${theme.bgSecondary}" stroke="${theme.accentSecondary}" stroke-width="2"/>
          <rect x="200" y="-180" width="115" height="180" fill="${theme.inkColor}" opacity="0.22"/>
          <line x1="-420" y1="0" x2="420" y2="0" stroke="${theme.inkColor}" stroke-width="3" opacity="0.5"/>
        </g>
      `;
      break;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
    <defs>
      <linearGradient id="bg-${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${theme.bgPrimary}"/>
        <stop offset="100%" stop-color="${theme.bgSecondary}"/>
      </linearGradient>
      <pattern id="grid-${seed}" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="${theme.inkColor}" stroke-width="0.6" opacity="0.08"/>
      </pattern>
    </defs>
    <rect width="1200" height="675" fill="url(#bg-${seed})"/>
    <rect width="1200" height="675" fill="url(#grid-${seed})"/>
    ${motifLayer}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
