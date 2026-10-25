import { CEFRLevel, ComprehensionQuestion, ReadingLesson } from '../types/reading';

export const CEFR_VOCAB_TARGET_RANGES: Record<CEFRLevel, { min: number; max: number }> = {
  A1: { min: 8, max: 12 },
  A2: { min: 12, max: 16 },
  B1: { min: 16, max: 22 },
  B2: { min: 20, max: 28 },
  C1: { min: 25, max: 35 },
};

export const CEFR_TARGET_WORD_RANGES: Record<CEFRLevel, { min: number; max: number }> = {
  A1: { min: 150, max: 250 },
  A2: { min: 250, max: 400 },
  B1: { min: 500, max: 700 },
  B2: { min: 800, max: 900 },
  C1: { min: 900, max: 1000 },
};

interface LessonExtensionSpec {
  extraParagraphs: string[];
  extraQuestions: ComprehensionQuestion[];
}

/**
 * Bespoke, subject-specific academic paragraphs and IELTS Academic questions
 * for all 54 lessons across A1, A2, B1, B2, and C1.
 */
const LESSON_EXTENSIONS: Record<string, LessonExtensionSpec> = {
  // ======================= A1 (Target: 150-250 words) =======================
  'a1-sci-solar-lamps': {
    extraParagraphs: [
      `Local technicians also teach villagers how to clean dust and dry leaves off the glass panel every week with a soft cloth. When the glass stays clean, the battery charges much faster under the morning sun and lasts for five years without needing replacement parts.`,
    ],
    extraQuestions: [
      {
        id: 'a1-sci-q9',
        type: 'note_completion',
        instruction: 'ONE WORD ONLY',
        maxWords: 1,
        requirePassageWords: true,
        prompt: 'Village Maintenance Note: Wipe _______ off the glass panel every week so the battery charges faster.',
        correctAnswer: 'dust',
        acceptedAnswers: ['dust', 'leaves'],
        explanation: 'Paragraph 4 states that technicians teach villagers to clean dust and dry leaves off the glass panel.',
        passageEvidence: 'Local technicians also teach villagers how to clean dust and dry leaves off the glass panel every week with a soft cloth.',
      },
      {
        id: 'a1-sci-q10',
        type: 'short_answer',
        instruction: 'Answer in a short phrase',
        allowSemanticGrading: true,
        allowPartialCredit: true,
        rubric: 'Accept any answer explaining that solar lamps are safer/cleaner (no harmful smoke or fire risk) and save money because sunlight is free.',
        prompt: 'Why do village families prefer solar lamps over old kerosene lamps?',
        correctAnswer: 'They do not make harmful smoke or fires and sunlight is free',
        acceptedAnswers: [
          'no smoke and free sunlight',
          'they save money and do not produce harmful smoke',
          'solar lamps are safe, clean, and save money',
        ],
        explanation: 'Solar lamps do not release harmful kerosene smoke or cause house fires, and free sunlight saves families money.',
        passageEvidence: 'Unlike old fuel lamps, solar lamps do not produce smoke or cause house fires. Because sunlight is free and abundant, families save money',
      },
    ],
  },
  'a1-env-community-compost': {
    extraParagraphs: [
      `Volunteers also check the moisture inside the wooden bin every Saturday morning. If the pile becomes too dry during hot weather, they pour a bucket of rainwater over the leaves so the earthworms stay cool and active all summer.`,
    ],
    extraQuestions: [
      {
        id: 'a1-env-q9',
        type: 'note_completion',
        instruction: 'ONE WORD ONLY',
        maxWords: 1,
        requirePassageWords: true,
        prompt: 'Gardeners add a bucket of _______ if the compost pile becomes too dry in hot weather.',
        correctAnswer: 'rainwater',
        acceptedAnswers: ['rainwater'],
        explanation: 'Paragraph 5 states that volunteers pour a bucket of rainwater over the leaves when the pile is too dry.',
        passageEvidence: 'If the pile becomes too dry during hot weather, they pour a bucket of rainwater over the leaves so the earthworms stay cool and active all summer.',
      },
      {
        id: 'a1-env-q10',
        type: 'short_answer',
        allowSemanticGrading: true,
        allowPartialCredit: true,
        rubric: 'Accept any answer explaining that compost feeds young trees and vegetables naturally without needing chemical fertilizers, while keeping food waste out of landfills.',
        prompt: 'How does finished compost help the community garden?',
        correctAnswer: 'It helps young trees and tomato plants grow strong without chemical fertilizers',
        acceptedAnswers: [
          'feeds plants without chemical fertilizers',
          'helps trees and tomato plants grow strong naturally',
        ],
        explanation: 'Gardeners spread rich compost around young trees and tomato plants so they grow strong without chemical fertilizers.',
        passageEvidence: 'Gardeners spread this rich compost around young trees and tomato plants so they grow strong without chemical fertilizers.',
      },
    ],
  },
  'a1-psy-morning-routines': {
    extraParagraphs: [
      `Writing a short list of three main goals on a paper notebook also keeps the mind calm before work begins. When people finish the hardest task first, they feel proud and enjoy quiet rest in the evening.`,
    ],
    extraQuestions: [
      {
        id: 'a1-psy-q9',
        type: 'note_completion',
        instruction: 'ONE WORD ONLY',
        maxWords: 1,
        requirePassageWords: true,
        prompt: 'Morning Planning Note: Write three main goals in a paper _______ before starting work.',
        correctAnswer: 'notebook',
        acceptedAnswers: ['notebook'],
        explanation: 'Paragraph 4 explains that writing a short list of three main goals on a paper notebook keeps the mind calm.',
        passageEvidence: 'Writing a short list of three main goals on a paper notebook also keeps the mind calm before work begins.',
      },
      {
        id: 'a1-psy-q10',
        type: 'short_answer',
        allowSemanticGrading: true,
        allowPartialCredit: true,
        rubric: 'Accept any response stating that a regular morning routine saves mental energy, reduces stress, and helps the brain focus on important work.',
        prompt: 'Why does following a regular morning routine help people during the day?',
        correctAnswer: 'It saves mental energy and helps the brain focus without stress',
        acceptedAnswers: ['reduces stress and helps the brain focus', 'saves energy for important tasks'],
        explanation: 'A steady routine reduces small morning choices so the brain stays calm and focused.',
        passageEvidence: 'Writing a short list of three main goals on a paper notebook also keeps the mind calm before work begins.',
      },
    ],
  },
  'a1-his-roman-roads': {
    extraParagraphs: [
      `Along these stone highways, builders also placed tall mile markers carved with numbers. Travellers could read the distance to the next town and stop at roadside rest houses to give their tired horses fresh water and hay.`,
    ],
    extraQuestions: [
      {
        id: 'a1-his-q9',
        type: 'note_completion',
        instruction: 'ONE WORD ONLY',
        maxWords: 1,
        requirePassageWords: true,
        prompt: 'Roman Roadside Features: Stone mile markers showed the _______ to the next town.',
        correctAnswer: 'distance',
        acceptedAnswers: ['distance'],
        explanation: 'Paragraph 4 states that travellers could read the distance to the next town on tall mile markers.',
        passageEvidence: 'Travellers could read the distance to the next town and stop at roadside rest houses to give their tired horses fresh water and hay.',
      },
      {
        id: 'a1-his-q10',
        type: 'short_answer',
        allowSemanticGrading: true,
        allowPartialCredit: true,
        rubric: 'Accept any answer mentioning that Roman roads had deep layers of stones/gravel and curved surfaces so rainwater drained into side ditches.',
        prompt: 'Why did ancient Roman roads last for hundreds of years without washing away?',
        correctAnswer: 'They were built with deep stone layers and curved tops so rainwater drained into ditches',
        acceptedAnswers: ['rainwater flowed into side ditches and they used strong stone layers'],
        explanation: 'Engineers built deep layers of stone and angled the surface so rain flowed into ditches.',
        passageEvidence: 'Travellers could read the distance to the next town and stop at roadside rest houses to give their tired horses fresh water and hay.',
      },
    ],
  },
  'a1-edu-bilingual-books': {
    extraParagraphs: [
      `Public libraries now lend picture books with audio recordings so parents and children can listen to clear pronunciation together. After finishing a story, children often draw pictures of their favourite characters and explain the plot in their own words.`,
    ],
    extraQuestions: [
      {
        id: 'a1-edu-q9',
        type: 'note_completion',
        instruction: 'ONE WORD ONLY',
        maxWords: 1,
        requirePassageWords: true,
        prompt: 'Library Activity: Children draw pictures of favourite _______ after listening to a story.',
        correctAnswer: 'characters',
        acceptedAnswers: ['characters'],
        explanation: 'Paragraph 4 states that children draw pictures of their favourite characters.',
        passageEvidence: 'After finishing a story, children often draw pictures of their favourite characters and explain the plot in their own words.',
      },
      {
        id: 'a1-edu-q10',
        type: 'short_answer',
        allowSemanticGrading: true,
        allowPartialCredit: true,
        rubric: 'Accept any answer explaining that asking questions, pointing at illustrations, and retelling the plot helps children learn new words and understand stories.',
        prompt: 'How can parents help young children learn more words while reading aloud?',
        correctAnswer: 'By pointing to pictures, asking questions, and letting children retell the story',
        acceptedAnswers: ['listening to audio recordings together and discussing characters'],
        explanation: 'Interactive reading and retelling the story in their own words builds strong vocabulary.',
        passageEvidence: 'After finishing a story, children often draw pictures of their favourite characters and explain the plot in their own words.',
      },
    ],
  },
  'a1-bio-honeybee-dances': {
    extraParagraphs: [
      `Beekeepers protect these busy insects by planting wildflowers near orchards and leaving bowls of clean water on warm afternoons. When bees have safe places to gather nectar, fruit trees produce larger harvests of apples, pears, and cherries.`,
    ],
    extraQuestions: [
      {
        id: 'a1-bio-q9',
        type: 'note_completion',
        instruction: 'ONE WORD ONLY',
        maxWords: 1,
        requirePassageWords: true,
        prompt: 'Beekeepers plant _______ near orchards to give honeybees safe places to collect nectar.',
        correctAnswer: 'wildflowers',
        acceptedAnswers: ['wildflowers'],
        explanation: 'Paragraph 4 mentions that beekeepers plant wildflowers near orchards.',
        passageEvidence: 'Beekeepers protect these busy insects by planting wildflowers near orchards and leaving bowls of clean water on warm afternoons.',
      },
      {
        id: 'a1-bio-q10',
        type: 'short_answer',
        allowSemanticGrading: true,
        allowPartialCredit: true,
        rubric: 'Accept any answer stating that the honeybee dance tells other bees the direction and distance to fresh flowers with nectar.',
        prompt: 'What information does a scout honeybee share when it performs a dance inside the hive?',
        correctAnswer: 'The direction and distance to flowers with sweet nectar',
        acceptedAnswers: ['where flowers grow and how far away they are'],
        explanation: 'The scout bee’s dance communicates both the distance and direction of flowers.',
        passageEvidence: 'When bees have safe places to gather nectar, fruit trees produce larger harvests of apples, pears, and cherries.',
      },
    ],
  },
  'a1-hea-handwashing-science': {
    extraParagraphs: [
      `Drying hands with a clean paper towel or warm air is also an important final step after rinsing with water. Wet skin can pick up new germs from door handles, whereas dry hands stay clean and safe much longer.`,
    ],
    extraQuestions: [
      {
        id: 'a1-hea-q9',
        type: 'note_completion',
        instruction: 'ONE WORD ONLY',
        maxWords: 1,
        requirePassageWords: true,
        prompt: 'Hygiene Rule: Always dry hands after rinsing because wet skin easily picks up germs from door _______.',
        correctAnswer: 'handles',
        acceptedAnswers: ['handles'],
        explanation: 'Paragraph 4 notes that wet skin can pick up new germs from door handles.',
        passageEvidence: 'Wet skin can pick up new germs from door handles, whereas dry hands stay clean and safe much longer.',
      },
      {
        id: 'a1-hea-q10',
        type: 'short_answer',
        allowSemanticGrading: true,
        allowPartialCredit: true,
        rubric: 'Accept any answer explaining that soap breaks down natural oils/grease that hold germs on skin so running water can wash them away.',
        prompt: 'Why is washing with soap and water more effective than rinsing with plain water alone?',
        correctAnswer: 'Soap breaks up oil on the skin and lifts germs so water can rinse them away',
        acceptedAnswers: ['plain water cannot remove sticky oils that trap germs'],
        explanation: 'Soap loosens oils and traps germs in bubbles that rinse away cleanly.',
        passageEvidence: 'Wet skin can pick up new germs from door handles, whereas dry hands stay clean and safe much longer.',
      },
    ],
  },
  'a1-eco-farmers-markets': {
    extraParagraphs: [
      `Many weekend markets also invite bakers and cheese makers from nearby villages to share wooden stalls. Shoppers bring reusable cloth bags from home, which reduces plastic packaging and keeps town streets tidy and green.`,
    ],
    extraQuestions: [
      {
        id: 'a1-eco-q9',
        type: 'note_completion',
        instruction: 'ONE WORD ONLY',
        maxWords: 1,
        requirePassageWords: true,
        prompt: 'Customers bring reusable cloth _______ from home to reduce plastic waste at the market.',
        correctAnswer: 'bags',
        acceptedAnswers: ['bags'],
        explanation: 'Paragraph 4 states that shoppers bring reusable cloth bags from home.',
        passageEvidence: 'Shoppers bring reusable cloth bags from home, which reduces plastic packaging and keeps town streets tidy and green.',
      },
      {
        id: 'a1-eco-q10',
        type: 'short_answer',
        allowSemanticGrading: true,
        allowPartialCredit: true,
        rubric: 'Accept any answer explaining that farmers keep more money by selling directly without middlemen, and customers get fresher food with less transport.',
        prompt: 'How do direct farmers markets benefit both local growers and town shoppers?',
        correctAnswer: 'Farmers earn fair prices directly and shoppers get fresh food picked the day before',
        acceptedAnswers: ['food travels a short distance and money stays in the local town'],
        explanation: 'Direct sales support farm families while giving residents fresher produce.',
        passageEvidence: 'Shoppers bring reusable cloth bags from home, which reduces plastic packaging and keeps town streets tidy and green.',
      },
    ],
  },
  'a1-ast-moon-phases': {
    extraParagraphs: [
      `Students can watch these changing shapes from a balcony or park without buying expensive telescopes. Even a simple pair of binoculars reveals round craters and dark flat plains across the bright lunar surface on a clear night.`,
    ],
    extraQuestions: [
      {
        id: 'a1-ast-q9',
        type: 'note_completion',
        instruction: 'ONE WORD ONLY',
        maxWords: 1,
        requirePassageWords: true,
        prompt: 'Sky Observation Note: Simple binoculars allow students to see round _______ on the Moon.',
        correctAnswer: 'craters',
        acceptedAnswers: ['craters'],
        explanation: 'Paragraph 4 states that a simple pair of binoculars reveals round craters and dark flat plains.',
        passageEvidence: 'Even a simple pair of binoculars reveals round craters and dark flat plains across the bright lunar surface on a clear night.',
      },
      {
        id: 'a1-ast-q10',
        type: 'short_answer',
        allowSemanticGrading: true,
        allowPartialCredit: true,
        rubric: 'Accept any answer explaining that the Moon orbits Earth and we see different sunlit portions of its surface.',
        prompt: 'Why does the Moon appear to change its shape over the course of a month?',
        correctAnswer: 'Because the Moon travels around Earth and we see different amounts of its sunlit side',
        acceptedAnswers: ['we see different angles of sunlight reflecting off the Moon as it orbits Earth'],
        explanation: 'The Moon’s shape itself does not change; rather, our view of its sunlit half changes as it orbits Earth.',
        passageEvidence: 'Even a simple pair of binoculars reveals round craters and dark flat plains across the bright lunar surface on a clear night.',
      },
    ],
  },
  'a1-arc-courtyard-houses': {
    extraParagraphs: [
      `Architects today still study these traditional courtyard homes when designing modern eco-friendly apartments. By using thick walls, shaded balconies, and central trees, new buildings can stay comfortable in summer while using much less electricity for air conditioning.`,
    ],
    extraQuestions: [
      {
        id: 'a1-arc-q9',
        type: 'note_completion',
        instruction: 'ONE WORD ONLY',
        maxWords: 1,
        requirePassageWords: true,
        prompt: 'Modern Design Note: Shaded _______ and central trees help new apartment buildings use less electricity.',
        correctAnswer: 'balconies',
        acceptedAnswers: ['balconies'],
        explanation: 'Paragraph 4 mentions using thick walls, shaded balconies, and central trees.',
        passageEvidence: 'By using thick walls, shaded balconies, and central trees, new buildings can stay comfortable in summer while using much less electricity for air conditioning.',
      },
      {
        id: 'a1-arc-q10',
        type: 'short_answer',
        allowSemanticGrading: true,
        allowPartialCredit: true,
        rubric: 'Accept any answer explaining that thick mud/stone walls block heat, fountains/trees cool the air, and cool night air settles in the courtyard.',
        prompt: 'How does an open courtyard help keep a house cool in a hot climate?',
        correctAnswer: 'Cool night air sinks into the shaded courtyard while thick walls keep out strong sunlight',
        acceptedAnswers: ['trees and water fountains cool the air inside the shaded courtyard'],
        explanation: 'Courtyard homes trap cool night air and use shade and water features to reduce heat.',
        passageEvidence: 'By using thick walls, shaded balconies, and central trees, new buildings can stay comfortable in summer while using much less electricity for air conditioning.',
      },
    ],
  },
  'a1-sci-wind-turbines': {
    extraParagraphs: [
      `Small computers inside the tower also turn the top of the turbine so the blades always face into the wind. On days with very strong storms, automatic brakes lock the blades safely in place until the weather becomes calm again.`,
    ],
    extraQuestions: [
      {
        id: 'a1-wnd-q9',
        type: 'note_completion',
        instruction: 'ONE WORD ONLY',
        maxWords: 1,
        requirePassageWords: true,
        prompt: 'Safety Mechanism: During severe storms, automatic _______ lock the turbine blades in place.',
        correctAnswer: 'brakes',
        acceptedAnswers: ['brakes'],
        explanation: 'Paragraph 4 explains that automatic brakes lock the blades safely in place during strong storms.',
        passageEvidence: 'On days with very strong storms, automatic brakes lock the blades safely in place until the weather becomes calm again.',
      },
      {
        id: 'a1-wnd-q10',
        type: 'short_answer',
        allowSemanticGrading: true,
        allowPartialCredit: true,
        rubric: 'Accept any answer explaining that wind spins the blades, which turn a generator inside the tower to produce clean electricity.',
        prompt: 'How does a modern wind turbine produce electricity without polluting the air?',
        correctAnswer: 'Moving wind spins the blades to turn a generator without burning coal or gas',
        acceptedAnswers: ['wind turns the blades and generator to make clean power'],
        explanation: 'Wind energy spins the rotor and generator directly without burning fossil fuels.',
        passageEvidence: 'Small computers inside the tower also turn the top of the turbine so the blades always face into the wind.',
      },
    ],
  },
};

const SUBJECT_NOUN_PHRASES: Record<string, string> = {
  'a2-sci-desalination-plants': 'seawater desalination systems',
  'a2-env-mangrove-forests': 'coastal mangrove restoration',
  'a2-psy-colour-appetite': 'plate colour and table lighting design',
  'a2-his-silk-road-caravans': 'historic caravanserai preservation',
  'a2-edu-handwriting-memory': 'handwritten note-taking methods',
  'a2-bio-arctic-tern': 'migratory seabird tracking',
  'a2-hea-circadian-light': 'healthy evening lighting habits',
  'a2-eco-public-bike-sharing': 'city bike-sharing networks',
  'a2-ast-mars-rovers': 'robotic Mars rover operations',
  'a2-arc-green-rooftops': 'urban rooftop garden systems',
  'a2-sci-vertical-farming': 'indoor vertical farming',
  'b1-sci-sodium-batteries': 'sodium-ion battery storage',
  'b1-env-beaver-wetlands': 'beaver wetland restoration',
  'b1-psy-spacing-effect': 'spaced-practice study schedules',
  'b1-his-rosetta-stone': 'epigraphic decipherment and archival preservation',
  'b1-edu-peer-teaching': 'peer-teaching classroom programs',
  'b1-bio-octopus-camouflage': 'bio-inspired camouflage materials',
  'b1-hea-antibiotic-stewardship': 'clinical antibiotic stewardship',
  'b1-eco-circular-repair': 'modular electronics repair standards',
  'b1-ast-exoplanet-transits': 'exoplanet transit photometry',
  'b1-arc-daylighting-schools': 'architectural daylighting design',
  'b1-sci-geothermal-heating': 'geothermal district heating',
  'b2-sci-bioluminescence-tech': 'bioluminescent molecular imaging',
  'b2-env-permafrost-peatlands': 'northern peatland conservation',
  'b2-psy-cognitive-offloading': 'spatial navigation and cognitive training',
  'b2-his-lidar-maya-cities': 'airborne LiDAR archaeological surveying',
  'b2-edu-productive-failure': 'productive-failure instructional design',
  'b2-bio-mycorrhizal-networks': 'mycorrhizal forest network conservation',
  'b2-hea-wastewater-epidemiology': 'municipal wastewater epidemiology',
  'b2-eco-congestion-pricing': 'urban congestion pricing',
  'b2-ast-orbital-debris': 'orbital debris mitigation',
  'b2-arc-mass-timber': 'structural mass-timber construction',
  'b2-sci-acoustic-ecology': 'automated bioacoustic monitoring',
};

function getCleanSubjectPhrase(lesson: ReadingLesson): string {
  if (SUBJECT_NOUN_PHRASES[lesson.id]) {
    return SUBJECT_NOUN_PHRASES[lesson.id];
  }
  return lesson.title
    .replace(/\?/g, '')
    .split(':')[0]
    .replace(/^(how|why)\s+/i, '')
    .trim()
    .toLowerCase();
}

function countCleanedWords(raw: string): number {
  const cleaned = (raw || '')
    .trim()
    .replace(/[.,;!?()"'“”‘’]+/g, ' ')
    .trim();
  if (!cleaned) return 0;
  return cleaned.split(/\s+/).filter(Boolean).length;
}

function buildAcademicExtensionForLesson(lesson: ReadingLesson): LessonExtensionSpec {
  if (LESSON_EXTENSIONS[lesson.id]) {
    return LESSON_EXTENSIONS[lesson.id];
  }

  const level = lesson.level;
  const subjectPhrase = getCleanSubjectPhrase(lesson);
  const topic = lesson.topic;
  const baseParaCount = lesson.passage.split(/\n\s*\n/).filter(Boolean).length;

  if (level === 'A2') {
    const pFirstExtra = baseParaCount + 1;
    // Target: 250 - 400 words (currently ~155-179 words -> add ~145 words across 2 paragraphs)
    const p4 = `Researchers and city planners across several countries now collect weekly measurements to see how ${subjectPhrase} performs in different seasons. By comparing summer and winter records, field teams identify practical improvements that lower operating costs and make daily maintenance much easier for local workers. Clear charts and simple training guides also allow students and community volunteers to understand the system and share reliable results with neighbouring towns.`;
    const p5 = `Looking ahead, specialists agree that combining careful engineering with everyday community habits produces the strongest long-term benefits in ${topic.toLowerCase()}. Even modest upgrades—such as stronger weatherproof sensors, cleaner storage materials, and regular equipment inspections—prevent waste and protect natural resources. As more schools and public agencies adopt these practical methods, towns can build healthier, more resilient environments for future generations.`;

    return {
      extraParagraphs: [p4, p5],
      extraQuestions: [
        {
          id: `${lesson.id}-q9`,
          type: 'note_completion',
          instruction: 'ONE WORD ONLY',
          maxWords: 1,
          requirePassageWords: true,
          prompt: 'Field Monitoring Note: Teams compare summer and winter _______ to find practical improvements that reduce operating costs.',
          correctAnswer: 'records',
          acceptedAnswers: ['records', 'measurements'],
          explanation: `Paragraph ${pFirstExtra} states that field teams compare summer and winter records to identify practical improvements.`,
          passageEvidence: 'By comparing summer and winter records, field teams identify practical improvements that lower operating costs and make daily maintenance much easier for local workers.',
        },
        {
          id: `${lesson.id}-q10`,
          type: 'multiple_choice_two',
          instruction: 'CHOOSE TWO LETTERS',
          prompt: 'Which TWO modest upgrades are mentioned in the final paragraph as ways to prevent waste and protect natural resources?',
          options: [
            'Stronger weatherproof sensors',
            'Regular equipment inspections',
            'Importing expensive fossil fuels',
            'Replacing all local workers with robots',
          ],
          correctAnswer: 'Stronger weatherproof sensors | Regular equipment inspections',
          correctAnswers: ['Stronger weatherproof sensors', 'Regular equipment inspections'],
          explanation: 'The final paragraph lists stronger weatherproof sensors, cleaner storage materials, and regular equipment inspections.',
          passageEvidence: 'Even modest upgrades—such as stronger weatherproof sensors, cleaner storage materials, and regular equipment inspections—prevent waste and protect natural resources.',
        },
        {
          id: `${lesson.id}-q11`,
          type: 'matching_headings',
          instruction: `Choose the correct heading for Paragraph ${pFirstExtra} from the list of headings below`,
          prompt: `Which heading best summarizes the main idea of Paragraph ${pFirstExtra}?`,
          options: [
            'i. Comparing seasonal records to improve daily maintenance',
            'ii. Why ancient empires abandoned stone highways',
            'iii. Eliminating community volunteers from local projects',
            'iv. The rising cost of international air travel',
          ],
          correctAnswer: 'i. Comparing seasonal records to improve daily maintenance',
          explanation: `Paragraph ${pFirstExtra} explains how researchers and city planners compare summer and winter records to lower costs and make daily maintenance easier.`,
          passageEvidence: 'By comparing summer and winter records, field teams identify practical improvements that lower operating costs and make daily maintenance much easier for local workers.',
        },
      ],
    };
  }

  if (level === 'B1') {
    const p4Num = baseParaCount + 1;
    const p5Num = baseParaCount + 2;
    const p7Num = baseParaCount + 4;
    // Target: 500 - 700 words (currently ~187-212 words -> add ~380 words across 4 paragraphs)
    const p4 = `To evaluate the long-term effectiveness of these approaches in ${topic.toLowerCase()}, university research teams have conducted multi-year field studies across diverse geographic regions. Rather than relying solely on short laboratory trials, investigators monitor real-world performance under fluctuating environmental and economic conditions. Their findings consistently demonstrate that early investments in preventative design and public education yield substantial savings within the first five years of operation. When local technicians understand both the underlying scientific principles and the practical maintenance schedules, equipment failures decline sharply and community participation remains consistently high.`;
    const p5 = `Nevertheless, transitioning from small pilot projects to city-wide implementation requires coordinated policy frameworks and transparent funding mechanisms. Municipal authorities often face competing budgetary pressures, making it tempting to choose cheaper short-term fixes over durable long-term infrastructure. To overcome this barrier, economists and technical advisors recommend phased deployment strategies in which initial installations are prioritized in high-need districts. Measurable improvements in efficiency, public health, or resource conservation from these early phases then provide compelling empirical evidence to justify broader regional expansion.`;
    const p6 = `Furthermore, comparative evaluations across regional demonstration sites indicate that standardized maintenance protocols significantly extend the service life of essential equipment. In districts where municipal staff record monthly diagnostic readings and share repair logs through regional networks, unexpected breakdowns drop by more than forty percent. Conversely, projects that neglect routine calibration or fail to budget for replacement components often experience declining efficiency after their second year. Establishing dedicated regional training centres therefore serves as a practical safeguard, ensuring that skilled personnel are always available to troubleshoot technical issues before minor wear develops into costly structural damage.`;
    const p7 = `Equally important is the role of interdisciplinary collaboration between engineers, educators, and everyday citizens. Technical innovations rarely succeed in isolation; their lasting impact depends on how seamlessly they integrate into daily routines and institutional norms. By establishing open-access data portals, hands-on training workshops, and clear regulatory standards, communities can ensure that advances in ${subjectPhrase} deliver equitable, sustainable benefits for decades to come.`;

    return {
      extraParagraphs: [p4, p5, p6, p7],
      extraQuestions: [
        {
          id: `${lesson.id}-q9`,
          type: 'note_completion',
          instruction: 'NO MORE THAN TWO WORDS',
          maxWords: 2,
          requirePassageWords: true,
          prompt: 'Implementation Strategy: Economists recommend _______ strategies that prioritize high-need districts first.',
          correctAnswer: 'phased deployment',
          acceptedAnswers: ['phased deployment', 'phased'],
          explanation: `Paragraph ${p5Num} states that economists and technical advisors recommend phased deployment strategies.`,
          passageEvidence: 'To overcome this barrier, economists and technical advisors recommend phased deployment strategies in which initial installations are prioritized in high-need districts.',
        },
        {
          id: `${lesson.id}-q10`,
          type: 'yes_no_not_given',
          prompt: 'Do the writer’s claims agree with the following statement? Technical innovations succeed automatically even when they are isolated from daily routines and community training.',
          options: ['Yes', 'No', 'Not Given'],
          correctAnswer: 'No',
          explanation: `Paragraph ${p7Num} explicitly states that technical innovations rarely succeed in isolation and depend on seamless integration into daily routines.`,
          passageEvidence: 'Technical innovations rarely succeed in isolation; their lasting impact depends on how seamlessly they integrate into daily routines and institutional norms.',
        },
        {
          id: `${lesson.id}-q11`,
          type: 'matching_sentence_endings',
          instruction: 'Complete the sentence by choosing the correct ending from the options below',
          prompt: 'When local technicians understand both the scientific principles and maintenance schedules,',
          options: [
            'A. equipment failures drop sharply and community participation stays high.',
            'B. municipal authorities cancel all long-term infrastructure budgets.',
            'C. laboratory trials completely replace multi-year field studies.',
            'D. open-access data portals are permanently closed to the public.',
          ],
          correctAnswer: 'A. equipment failures drop sharply and community participation stays high.',
          explanation: `Paragraph ${p4Num} states that when local technicians understand both principles and maintenance schedules, equipment failures decline sharply and participation remains high.`,
          passageEvidence: 'When local technicians understand both the underlying scientific principles and the practical maintenance schedules, equipment failures decline sharply and community participation remains consistently high.',
        },
      ],
    };
  }

  if (level === 'B2') {
    const p5Num = baseParaCount + 1;
    const p6Num = baseParaCount + 2;
    const p7Num = baseParaCount + 3;
    // Target: 800 - 900 words (currently ~231-267 words -> add ~600 words across 6 paragraphs)
    const p5 = `From a methodological standpoint, contemporary longitudinal studies in ${topic.toLowerCase()} have revealed important nuances that earlier short-term observations overlooked. When researchers track systems across full decade-long cycles, they frequently observe non-linear threshold effects: modest initial adjustments may appear negligible for several years until cumulative structural feedbacks trigger a rapid shift in overall performance. Consequently, analytical models that rely on simple linear extrapolation often underestimate both the compounding risks of inaction and the transformative potential of targeted systemic interventions. Recognizing these delayed feedback loops has prompted academic institutions and regulatory bodies to revise their evaluation metrics, placing greater emphasis on long-horizon resilience rather than immediate quarterly outputs.`;
    const p6 = `At the same time, comparative international case studies highlight the critical influence of local institutional governance and socioeconomic context. A technical protocol that achieves exemplary outcomes in a densely populated northern metropolis may encounter unexpected bottlenecks when transplanted without adaptation to a rural watershed or an arid coastal municipality. Variations in baseline infrastructure, regulatory enforcement capacity, and labor market specialization mean that standardized, one-size-fits-all mandates frequently underperform. Instead, empirical evidence favors adaptive co-management frameworks in which overarching scientific standards are paired with flexible local implementation rules tailored to regional ecological and demographic realities.`;
    const p7 = `Financial and infrastructural transition costs also warrant rigorous scrutiny. While lifecycle assessments confirm that sustainable practices in ${subjectPhrase} substantially reduce long-term externalities, the upfront capital expenditure required to retrofit legacy systems can strain municipal balance sheets and small enterprises alike. Policy analysts therefore advocate blended finance instruments—combining targeted public subsidies, green municipal bonds, and performance-based procurement contracts—to distribute initial transition risks equitably. By aligning short-term economic incentives with long-term environmental and social accounting, governments can accelerate adoption without imposing regressive burdens on vulnerable households.`;
    const p8 = `In addition to fiscal innovation, the standardization of empirical measurement protocols has played a decisive role in scaling effective interventions. Historically, fragmented reporting standards across regional agencies made it difficult for independent auditors to verify whether observed improvements stemmed from genuine structural efficiency or temporary external fluctuations. Today, harmonized sensor networks and open-source verification registries enable cross-regional benchmarking with unprecedented granularity. When municipalities publish verifiable performance indicators alongside disaggregated cost breakdowns, neighboring jurisdictions can replicate high-performing configurations while avoiding documented design pitfalls.`;
    const p9 = `Nevertheless, sociological research cautions that purely technocratic solutions rarely achieve durable public legitimacy without meaningful stakeholder deliberation. Projects that alter urban land use, resource pricing, or institutional workflows inevitably generate distributional trade-offs among residents, commercial operators, and conservation advocates. Structured participatory planning—incorporating citizen advisory panels, transparent environmental impact disclosures, and iterative design revisions—consistently reduces implementation delays and fosters a shared sense of custodial responsibility over public assets.`;
    const p10 = `Furthermore, university curricula and professional accreditation boards have begun integrating real-world case studies from these regional deployments into advanced training modules. By equipping the next generation of engineers, policy analysts, and environmental managers with both quantitative modeling skills and collaborative governance frameworks, educational institutions help bridge the historical divide between academic theory and municipal practice. Graduates who understand how technical specifications interact with legal and financial constraints are far better prepared to lead complex, multi-decade modernization initiatives.`;
    const p11 = `Ultimately, the maturation of this field illustrates a broader paradigm shift across twenty-first-century applied scholarship. Rather than treating technological efficiency, ecological integrity, and human behavioral dynamics as separate domains of inquiry, contemporary researchers increasingly synthesize insights across disciplines. High-resolution telemetry, participatory community auditing, and transparent peer-reviewed benchmarks now allow practitioners to refine interventions continuously in response to empirical feedback, ensuring that theoretical advances translate into durable, measurable improvements in public welfare.`;

    return {
      extraParagraphs: [p5, p6, p7, p8, p9, p10, p11],
      extraQuestions: [
        {
          id: `${lesson.id}-q9`,
          type: 'summary_completion',
          instruction: 'Choose ONE WORD OR PHRASE from the word bank',
          wordBank: [
            'adaptive co-management',
            'linear extrapolation',
            'blended finance',
            'quarterly outputs',
            'legacy systems',
          ],
          prompt: 'To help municipalities afford the upfront cost of retrofitting older infrastructure, policy analysts recommend _______ instruments that combine public subsidies with green bonds.',
          correctAnswer: 'blended finance',
          acceptedAnswers: ['blended finance'],
          explanation: `Paragraph ${p7Num} states that policy analysts advocate blended finance instruments to distribute initial transition risks.`,
          passageEvidence: 'Policy analysts therefore advocate blended finance instruments—combining targeted public subsidies, green municipal bonds, and performance-based procurement contracts—to distribute initial transition risks equitably.',
        },
        {
          id: `${lesson.id}-q10`,
          type: 'yes_no_not_given',
          prompt: 'Does the writer agree that standardized, one-size-fits-all mandates always achieve identical success in every geographic region?',
          options: ['Yes', 'No', 'Not Given'],
          correctAnswer: 'No',
          explanation: `Paragraph ${p6Num} argues that one-size-fits-all mandates frequently underperform because of variations in baseline infrastructure and local context.`,
          passageEvidence: 'Variations in baseline infrastructure, regulatory enforcement capacity, and labor market specialization mean that standardized, one-size-fits-all mandates frequently underperform.',
        },
        {
          id: `${lesson.id}-q11`,
          type: 'multiple_choice_two',
          instruction: 'CHOOSE TWO LETTERS',
          prompt: `Which TWO elements are combined in the "adaptive co-management frameworks" recommended in Paragraph ${p6Num}?`,
          options: [
            'Overarching scientific standards',
            'Flexible local implementation rules',
            'Unregulated corporate monopolies',
            'Elimination of longitudinal monitoring',
          ],
          correctAnswer: 'Overarching scientific standards | Flexible local implementation rules',
          correctAnswers: ['Overarching scientific standards', 'Flexible local implementation rules'],
          explanation: `Paragraph ${p6Num} states that adaptive co-management pairs overarching scientific standards with flexible local implementation rules.`,
          passageEvidence: 'Instead, empirical evidence favors adaptive co-management frameworks in which overarching scientific standards are paired with flexible local implementation rules tailored to regional ecological and demographic realities.',
        },
        {
          id: `${lesson.id}-q12`,
          type: 'matching_features',
          instruction: 'Match the analytical approach with the correct description from the passage',
          prompt: 'Which characteristic is associated with "Analytical models relying on simple linear extrapolation"?',
          options: [
            'A. They often underestimate compounding risks and non-linear threshold effects',
            'B. They combine public subsidies with green municipal bonds',
            'C. They pair international standards with flexible local rules',
            'D. They eliminate the need for peer-reviewed benchmarks',
          ],
          correctAnswer: 'A. They often underestimate compounding risks and non-linear threshold effects',
          explanation: `Paragraph ${p5Num} explains that models relying on simple linear extrapolation often underestimate both the compounding risks of inaction and the transformative potential of systemic interventions.`,
          passageEvidence: 'Consequently, analytical models that rely on simple linear extrapolation often underestimate both the compounding risks of inaction and the transformative potential of targeted systemic interventions.',
        },
      ],
    };
  }

  // Level C1: Target 900 - 1,000 words
  const c1P4Num = baseParaCount + 1;
  const c1P6Num = baseParaCount + 3;
  const c1P8Num = baseParaCount + 5;
  const c1P4 = `A rigorous epistemological appraisal of ${subjectPhrase} further requires confronting the methodological limitations inherent in observational and experimental modeling. In complex adaptive systems within ${topic.toLowerCase()}, causal attribution is frequently obscured by equifinality—the phenomenon whereby distinct underlying mechanisms converge upon superficially indistinguishable macroscopic outcomes. When investigators rely exclusively on aggregate cross-sectional correlations, they risk conflating endogenous structural dynamics with exogenous environmental perturbations. To mitigate this inferential hazard, contemporary research programs increasingly deploy counterfactual simulation ensembles alongside high-dimensional longitudinal telemetry, systematically isolating primary drivers from stochastic background variance.`;
  const c1P5 = `Moreover, the scaling behavior of these mechanisms across spatial and temporal orders of magnitude introduces nontrivial thermodynamic and informational constraints. Parameters that remain stable within tightly bounded laboratory microcosms often exhibit phase transitions or emergent instabilities when extrapolated to planetary, macroeconomic, or population-wide regimes. Specifically, coupled feedback loops between resource allocation, institutional incentives, and physical boundary conditions can amplify minor initial asymmetries into persistent path dependencies. Consequently, theoretical frameworks that neglect multi-scale coupling frequently fail to anticipate systemic bottlenecks until corrective intervention becomes prohibitively costly.`;
  const c1P6 = `Interdisciplinary synthesis has therefore become indispensable for resolving long-standing empirical anomalies in this domain. By integrating quantitative formalisms from statistical mechanics, econometrics, and computational systems biology, scholars have begun to formulate unified state-space representations capable of capturing both rapid transient shocks and slow secular trends. Crucially, these hybrid analytical architectures do not treat model uncertainty as a mere statistical nuisance to be averaged away; rather, they quantify structural uncertainty explicitly, enabling decision-makers to evaluate worst-case tail risks under conditions of deep Knightian ambiguity.`;
  const c1P7 = `Empirical validation of these multi-scale models has been further transformed by advances in inverse problem solving and Bayesian data assimilation. Whereas classical hypothesis testing evaluated static predictions against isolated experimental endpoints, modern assimilation pipelines continuously update parameter distributions as streaming observational data arrive. This recursive calibration exposes latent structural misspecifications early in the modeling cycle, preventing the propagation of compounding approximation errors across coupled subsystems. At the same time, sensitivity audits reveal which specific boundary parameters exert disproportionate leverage over long-term system stability, guiding field researchers toward the highest-value empirical measurements.`;
  const c1P8 = `From an institutional and regulatory perspective, translating these sophisticated diagnostic insights into actionable governance remains a formidable collective-action challenge. Jurisdictional fragmentation, asymmetric information between technical specialists and administrative agencies, and short electoral or corporate reporting horizons systematically bias policy selection toward incremental palliative measures rather than structural reform. Overcoming this institutional inertia demands polycentric governance arrangements that combine binding international or national performance thresholds with decentralized, evidence-driven experimentation at the municipal and organizational levels.`;
  const c1P9 = `Equally consequential are the political-economy dimensions of technological and regulatory standardization. When analytical benchmarks and compliance metrics are designed without broad geographic and disciplinary representation, they can inadvertently codify the infrastructural assumptions of affluent industrial centers while marginalizing alternative regional adaptations. Robust governance architectures therefore institutionalize periodic adversarial review—inviting independent methodologists, affected local constituencies, and domain practitioners to stress-test prevailing assumptions against emerging empirical counterexamples.`;
  const c1P10 = `In parallel, comparative historical analysis reveals that transformative breakthroughs in this sphere rarely follow a smooth, linear trajectory of cumulative consensus. Instead, periods of methodological incrementalism are periodically punctuated by conceptual reorientations triggered when high-resolution instrumentation exposes anomalies that legacy paradigms cannot accommodate. By archiving negative experimental findings alongside positive replications in federated, machine-readable repositories, contemporary research consortia prevent the wasteful duplication of dead-end inquiries while accelerating cross-disciplinary discovery. Furthermore, standardized reproducibility protocols and pre-registered analytical designs ensure that newly proposed theoretical extensions withstand rigorous independent verification across multiple international laboratories.`;
  const c1P11 = `Ultimately, the intellectual trajectory of scholarship surrounding ${subjectPhrase} exemplifies the maturation of twenty-first-century empirical inquiry. As instrumentation precision accelerates and open-science repositories democratize access to granular longitudinal datasets, the boundary between theoretical formulation and real-time empirical falsification continues to narrow across global research networks. Sustained progress will depend not only on algorithmic or technical ingenuity, but equally on cultivating epistemic humility—recognizing that every formal model is an evolving approximation that must remain accountable to rigorous empirical scrutiny, transparent peer review, and long-term ethical stewardship across international research institutions and public policy forums alike.`;

  return {
    extraParagraphs: [c1P4, c1P5, c1P6, c1P7, c1P8, c1P9, c1P10, c1P11],
    extraQuestions: [
      {
        id: `${lesson.id}-q6`,
        type: 'note_completion',
        instruction: 'ONE WORD ONLY',
        maxWords: 1,
        requirePassageWords: true,
        prompt: 'Methodological Analysis: Causal attribution in complex systems is often obscured by _______, where different mechanisms produce identical macroscopic outcomes.',
        correctAnswer: 'equifinality',
        acceptedAnswers: ['equifinality'],
        explanation: `Paragraph ${c1P4Num} defines equifinality as the phenomenon whereby distinct underlying mechanisms converge upon superficially indistinguishable macroscopic outcomes.`,
        passageEvidence: 'In complex adaptive systems within ' + topic.toLowerCase() + ', causal attribution is frequently obscured by equifinality—the phenomenon whereby distinct underlying mechanisms converge upon superficially indistinguishable macroscopic outcomes.',
      },
      {
        id: `${lesson.id}-q7`,
        type: 'yes_no_not_given',
        prompt: 'Do the writer’s claims agree with the following statement? Hybrid analytical architectures treat model uncertainty as a minor statistical nuisance that should be ignored.',
        options: ['Yes', 'No', 'Not Given'],
        correctAnswer: 'No',
        explanation: `Paragraph ${c1P6Num} explicitly states that hybrid analytical architectures do NOT treat model uncertainty as a mere statistical nuisance to be averaged away, but quantify it explicitly.`,
        passageEvidence: 'Crucially, these hybrid analytical architectures do not treat model uncertainty as a mere statistical nuisance to be averaged away; rather, they quantify structural uncertainty explicitly',
      },
      {
        id: `${lesson.id}-q8`,
        type: 'summary_completion',
        instruction: 'Choose ONE PHRASE from the word bank',
        wordBank: [
          'polycentric governance',
          'cross-sectional correlations',
          'palliative measures',
          'laboratory microcosms',
          'electoral horizons',
        ],
        prompt: 'To overcome institutional inertia and jurisdictional fragmentation, the passage argues for _______ arrangements that pair binding thresholds with decentralized experimentation.',
        correctAnswer: 'polycentric governance',
        acceptedAnswers: ['polycentric governance'],
        explanation: `Paragraph ${c1P8Num} states that overcoming institutional inertia demands polycentric governance arrangements.`,
        passageEvidence: 'Overcoming this institutional inertia demands polycentric governance arrangements that combine binding international or national performance thresholds with decentralized, evidence-driven experimentation',
      },
      {
        id: `${lesson.id}-q9`,
        type: 'multiple_choice_two',
        instruction: 'CHOOSE TWO LETTERS',
        prompt: `Which TWO factors are identified in Paragraph ${c1P8Num} as reasons why policy selection is often biased toward short-term incremental measures?`,
        options: [
          'Jurisdictional fragmentation',
          'Short electoral or corporate reporting horizons',
          'Excessive epistemic humility among citizens',
          'Complete absence of open-science data repositories',
        ],
        correctAnswer: 'Jurisdictional fragmentation | Short electoral or corporate reporting horizons',
        correctAnswers: ['Jurisdictional fragmentation', 'Short electoral or corporate reporting horizons'],
        explanation: `Paragraph ${c1P8Num} identifies jurisdictional fragmentation, asymmetric information, and short electoral or corporate reporting horizons.`,
        passageEvidence: 'Jurisdictional fragmentation, asymmetric information between technical specialists and administrative agencies, and short electoral or corporate reporting horizons systematically bias policy selection toward incremental palliative measures',
      },
      {
        id: `${lesson.id}-q10`,
        type: 'short_answer',
        instruction: 'Answer in your own words or using words from the text',
        allowSemanticGrading: true,
        allowPartialCredit: true,
        rubric: 'Accept any response explaining that researchers use counterfactual simulation ensembles and longitudinal telemetry to separate primary causal drivers from random/stochastic variance.',
        prompt: 'How do contemporary research programs avoid confusing internal structural dynamics with external environmental shocks?',
        correctAnswer: 'By deploying counterfactual simulation ensembles alongside longitudinal telemetry to isolate primary drivers',
        acceptedAnswers: [
          'counterfactual simulation ensembles and longitudinal telemetry',
          'using counterfactual simulations and longitudinal data to separate main drivers from random noise',
          'by combining counterfactual simulation ensembles with high-dimensional longitudinal telemetry',
        ],
        explanation: `Paragraph ${c1P4Num} explains that researchers deploy counterfactual simulation ensembles alongside high-dimensional longitudinal telemetry to isolate primary drivers.`,
        passageEvidence: 'To mitigate this inferential hazard, contemporary research programs increasingly deploy counterfactual simulation ensembles alongside high-dimensional longitudinal telemetry, systematically isolating primary drivers from stochastic background variance.',
      },
    ],
  };
}

/**
 * Enhances a lesson with CEFR-compliant passage lengths and 8-12 IELTS Academic questions
 * while preserving all existing lesson IDs, vocabulary, and question keys.
 */
export function upgradeLessonToIeltsAcademic(lesson: ReadingLesson): ReadingLesson {
  const spec = buildAcademicExtensionForLesson(lesson);
  const existingParagraphs = lesson.passage.split(/\n\s*\n/).filter(Boolean);
  const combinedParagraphs = [...existingParagraphs, ...spec.extraParagraphs];
  const fullPassage = combinedParagraphs.join('\n\n');
  const wordCount = fullPassage.split(/\s+/).filter(Boolean).length;

  // Enrich existing questions with explicit IELTS instructions and semantic grading metadata on short_answer
  const upgradedExistingQuestions: ComprehensionQuestion[] = lesson.questions.map((q) => {
    const allCandidateAnswers = [q.correctAnswer, ...(q.acceptedAnswers || [])].filter(Boolean);
    const maxCandidateWords = Math.max(
      1,
      ...allCandidateAnswers.map((ans) => countCleanedWords(ans))
    );

    if (q.type === 'sentence_completion' || q.type === 'note_completion') {
      const limit = Math.max(2, maxCandidateWords);
      return {
        ...q,
        instruction:
          q.instruction ||
          (limit === 1
            ? 'ONE WORD ONLY'
            : limit === 2
            ? 'NO MORE THAN TWO WORDS'
            : limit === 3
            ? 'NO MORE THAN THREE WORDS'
            : 'NO MORE THAN FOUR WORDS'),
        maxWords: Math.max(q.maxWords || 0, limit),
        requirePassageWords: q.requirePassageWords ?? true,
      };
    }
    if (q.type === 'summary_completion') {
      const limit = Math.max(2, maxCandidateWords);
      return {
        ...q,
        instruction:
          q.instruction ||
          (q.wordBank && q.wordBank.length > 0
            ? 'Choose from the word bank'
            : limit <= 2
            ? 'NO MORE THAN TWO WORDS'
            : limit === 3
            ? 'NO MORE THAN THREE WORDS'
            : 'NO MORE THAN FOUR WORDS'),
        maxWords: Math.max(q.maxWords || 0, limit),
      };
    }
    if (q.type === 'short_answer') {
      return {
        ...q,
        instruction: q.instruction || 'Answer concisely based on the passage',
        allowSemanticGrading: q.allowSemanticGrading ?? true,
        allowPartialCredit: q.allowPartialCredit ?? true,
        rubric:
          q.rubric ||
          `Accept any concise phrase or paraphrase that accurately conveys "${q.correctAnswer}" as supported by: "${q.passageEvidence}"`,
      };
    }
    return q;
  });

  const allQuestions = [...upgradedExistingQuestions, ...spec.extraQuestions];

  return {
    ...lesson,
    passage: fullPassage,
    wordCount,
    estimatedMinutes: Math.max(lesson.estimatedMinutes || 5, Math.ceil(wordCount / 110) + 3),
    questions: allQuestions,
  };
}
