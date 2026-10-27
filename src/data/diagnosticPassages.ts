import { ReadingLesson } from '../types/reading';
import { getEditorialIllustrationUri, getPassageIllustrationAlt } from '../utils/illustrations';

/**
 * Dedicated 15-Passage Diagnostic Content Bank (3 per CEFR level: A1, A2, B1, B2, C1).
 *
 * Each learner receives AT MOST 3 of these short passages during a placement assessment.
 * Each diagnostic passage has 6 objectively gradable questions (targeting 12–18 questions total).
 * Passages are 150–320 words so the entire placement check takes ~5–8 minutes.
 */
const RAW_DIAGNOSTIC_PASSAGES: ReadingLesson[] = [
  // ============================================================================
  // A1 DIAGNOSTIC PASSAGES (3)
  // ============================================================================
  {
    id: 'diag-a1-1-community-bicycle-workshop',
    title: 'The Neighbourhood Bicycle Workshop',
    level: 'A1',
    topic: 'Economics and society',
    status: 'published',
    isDiagnostic: true,
    diagnosticBand: 'foundation',
    estimatedMinutes: 2,
    wordCount: 168,
    introduction:
      'Read this short text about a local workshop where neighbours learn to repair bicycles.',
    illustrationUrl: getEditorialIllustrationUri(
      'diag-a1-1-community-bicycle-workshop',
      'Economics and society',
      'A1'
    ),
    illustrationAlt: 'Illustration of a neighbourhood bicycle repair workshop',
    passage: [
      'Every Saturday morning, a small garage on Oak Street opens its doors to the public. Inside, two mechanics named Sam and Layla run a free bicycle workshop for people in the neighbourhood. They keep pumps, wrenches, and spare tyres on a long wooden table.',
      'Visitors bring old or broken bicycles to the workshop. Instead of fixing the bikes alone, Sam and Layla show each visitor how to do the repair step by step. For example, children learn how to patch a flat tyre and oil a dry chain. Using the tools is free, and visitors only pay a few coins if they need a new part.',
      'Last year, the workshop helped repair more than two hundred bicycles. Many residents now ride to work or school instead of taking the bus, which saves money and keeps the street quiet.',
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'diag-a1-1-v1',
        word: 'spare',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Extra and kept ready to replace something broken.',
        contextMeaning: 'Extra tyres kept in the workshop for repairs.',
        originalSentence: 'They keep pumps, wrenches, and spare tyres on a long wooden table.',
        exampleSentence: 'Always carry a spare tube on a long bike trip.',
      },
      {
        id: 'diag-a1-1-v2',
        word: 'residents',
        partOfSpeech: 'noun',
        simpleDefinition: 'People who live in a particular area.',
        contextMeaning: 'People who live near Oak Street.',
        originalSentence:
          'Many residents now ride to work or school instead of taking the bus, which saves money and keeps the street quiet.',
        exampleSentence: 'Local residents planted trees along the path.',
      },
    ],
    questions: [
      {
        id: 'diag-a1-1-q1',
        type: 'multiple_choice',
        prompt: 'When does the bicycle workshop open?',
        options: [
          'Every Saturday morning',
          'Every Sunday afternoon',
          'Every weekday evening',
          'Once a month on Friday',
        ],
        correctAnswer: 'Every Saturday morning',
        explanation: 'Paragraph 1 states that the garage opens every Saturday morning.',
        passageEvidence:
          'Every Saturday morning, a small garage on Oak Street opens its doors to the public.',
        difficulty: 'foundation',
      },
      {
        id: 'diag-a1-1-q2',
        type: 'true_false_not_given',
        prompt: 'Sam and Layla repair the bicycles while the owners wait outside.',
        options: ['True', 'False', 'Not Given'],
        correctAnswer: 'False',
        explanation:
          'Paragraph 2 explains that instead of fixing the bikes alone, Sam and Layla show each visitor how to do the repair.',
        passageEvidence:
          'Instead of fixing the bikes alone, Sam and Layla show each visitor how to do the repair step by step.',
        difficulty: 'foundation',
      },
      {
        id: 'diag-a1-1-q3',
        type: 'multiple_choice',
        prompt: 'When do visitors have to pay money at the workshop?',
        options: [
          'When they borrow a wrench',
          'When they need a new part',
          'When they enter the garage',
          'When they pump air into a tyre',
        ],
        correctAnswer: 'When they need a new part',
        explanation:
          'Paragraph 2 says using the tools is free and visitors only pay if they need a new part.',
        passageEvidence:
          'Using the tools is free, and visitors only pay a few coins if they need a new part.',
        difficulty: 'core',
      },
      {
        id: 'diag-a1-1-q4',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 1, what does the word "spare" mean in "spare tyres"?',
        options: [
          'Extra tyres kept for replacement',
          'Very heavy metal wheels',
          'Expensive racing tyres',
          'Broken rubber tubes',
        ],
        correctAnswer: 'Extra tyres kept for replacement',
        explanation: 'Spare tyres are extra tyres kept ready to replace damaged ones.',
        passageEvidence: 'They keep pumps, wrenches, and spare tyres on a long wooden table.',
        difficulty: 'core',
      },
      {
        id: 'diag-a1-1-q5',
        type: 'true_false_not_given',
        prompt: 'The workshop repaired over two hundred bicycles last year.',
        options: ['True', 'False', 'Not Given'],
        correctAnswer: 'True',
        explanation:
          'Paragraph 3 states that last year the workshop helped repair more than two hundred bicycles.',
        passageEvidence: 'Last year, the workshop helped repair more than two hundred bicycles.',
        difficulty: 'foundation',
      },
      {
        id: 'diag-a1-1-q6',
        type: 'multiple_choice',
        prompt: 'What is the main benefit of the workshop for the neighbourhood?',
        options: [
          'It teaches people to fix their own bikes so they can ride more often.',
          'It sells new mountain bikes at half price.',
          'It trains professional racing cyclists for competitions.',
          'It replaces all buses in the city with bicycles.',
        ],
        correctAnswer: 'It teaches people to fix their own bikes so they can ride more often.',
        explanation:
          'The passage describes how teaching neighbours to repair bikes helps them ride to work or school.',
        passageEvidence:
          'Many residents now ride to work or school instead of taking the bus, which saves money and keeps the street quiet.',
        difficulty: 'core',
      },
    ],
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'diag-a1-2-rooftop-herb-garden',
    title: 'Growing Herbs on a School Roof',
    level: 'A1',
    topic: 'Education and learning',
    status: 'published',
    isDiagnostic: true,
    diagnosticBand: 'core',
    estimatedMinutes: 2,
    wordCount: 174,
    introduction:
      'Read this short passage about primary school students who grow fresh herbs on their school roof.',
    illustrationUrl: getEditorialIllustrationUri(
      'diag-a1-2-rooftop-herb-garden',
      'Education and learning',
      'A1'
    ),
    illustrationAlt: 'Illustration of wooden plant boxes on a school rooftop',
    passage: [
      'Riverview Primary School sits in the middle of a busy city, so it does not have a grass playground. Two years ago, the science teacher, Mr. Patel, built ten wooden plant boxes on the flat school roof. Each class received one box to care for during the school year.',
      'The students planted easy herbs such as mint, basil, and parsley. Every Tuesday and Thursday, two students from each class carry small watering cans up to the roof. They also measure the height of the plants with a ruler and write the numbers in a notebook.',
      'When the herbs are tall and green, the school kitchen uses them to make fresh soup and salad for lunch. Students say the food tastes better when they help grow the ingredients themselves.',
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'diag-a1-2-v1',
        word: 'ingredients',
        partOfSpeech: 'noun',
        simpleDefinition: 'Different foods used together to make a dish.',
        contextMeaning: 'The fresh herbs used to cook school lunches.',
        originalSentence:
          'Students say the food tastes better when they help grow the ingredients themselves.',
        exampleSentence: 'Tomatoes and basil are key ingredients in this sauce.',
      },
    ],
    questions: [
      {
        id: 'diag-a1-2-q1',
        type: 'multiple_choice',
        prompt: 'Why did the school put plant boxes on the roof?',
        options: [
          'Because the school is in a busy city and has no grass playground',
          'Because the kitchen had no room for a refrigerator',
          'Because the roof was leaking when it rained',
          'Because birds needed a place to sleep at night',
        ],
        correctAnswer: 'Because the school is in a busy city and has no grass playground',
        explanation:
          'Paragraph 1 explains that the school sits in a busy city and does not have a grass playground.',
        passageEvidence:
          'Riverview Primary School sits in the middle of a busy city, so it does not have a grass playground.',
        difficulty: 'foundation',
      },
      {
        id: 'diag-a1-2-q2',
        type: 'multiple_choice',
        prompt: 'How often do the students water the herbs?',
        options: [
          'Twice a week, on Tuesday and Thursday',
          'Every morning before class',
          'Only on rainy weekends',
          'Once a month in summer',
        ],
        correctAnswer: 'Twice a week, on Tuesday and Thursday',
        explanation: 'Paragraph 2 states that students water the herbs every Tuesday and Thursday.',
        passageEvidence:
          'Every Tuesday and Thursday, two students from each class carry small watering cans up to the roof.',
        difficulty: 'foundation',
      },
      {
        id: 'diag-a1-2-q3',
        type: 'true_false_not_given',
        prompt: 'Students record the height of their plants in a notebook.',
        options: ['True', 'False', 'Not Given'],
        correctAnswer: 'True',
        explanation:
          'Paragraph 2 says they measure the height of the plants with a ruler and write the numbers in a notebook.',
        passageEvidence:
          'They also measure the height of the plants with a ruler and write the numbers in a notebook.',
        difficulty: 'foundation',
      },
      {
        id: 'diag-a1-2-q4',
        type: 'true_false_not_given',
        prompt: 'The school sells the herbs to local supermarkets.',
        options: ['True', 'False', 'Not Given'],
        correctAnswer: 'False',
        explanation:
          'Paragraph 3 states that the school kitchen uses the herbs to make soup and salad for lunch.',
        passageEvidence:
          'When the herbs are tall and green, the school kitchen uses them to make fresh soup and salad for lunch.',
        difficulty: 'core',
      },
      {
        id: 'diag-a1-2-q5',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 3, what does the word "ingredients" mean?',
        options: [
          'Foods used to prepare a meal',
          'Garden tools kept on the roof',
          'Science notebooks for students',
          'Wooden boxes filled with soil',
        ],
        correctAnswer: 'Foods used to prepare a meal',
        explanation: 'Ingredients are the food items used to make dishes like soup and salad.',
        passageEvidence:
          'Students say the food tastes better when they help grow the ingredients themselves.',
        difficulty: 'core',
      },
      {
        id: 'diag-a1-2-q6',
        type: 'multiple_choice',
        prompt: 'How do the students feel about the school lunch now?',
        options: [
          'They think it tastes better because they helped grow the herbs.',
          'They prefer eating sweet desserts instead of soup.',
          'They think watering the plants takes too much time.',
          'They want to stop growing parsley.',
        ],
        correctAnswer: 'They think it tastes better because they helped grow the herbs.',
        explanation:
          'The final sentence states that students say the food tastes better when they help grow the ingredients.',
        passageEvidence:
          'Students say the food tastes better when they help grow the ingredients themselves.',
        difficulty: 'core',
      },
    ],
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'diag-a1-3-desert-fog-nets',
    title: 'Catching Water from Morning Fog',
    level: 'A1',
    topic: 'Environmental science',
    status: 'published',
    isDiagnostic: true,
    diagnosticBand: 'stretch',
    estimatedMinutes: 2,
    wordCount: 182,
    introduction:
      'Read this short text about how mountain villages collect clean water from thick morning fog.',
    illustrationUrl: getEditorialIllustrationUri(
      'diag-a1-3-desert-fog-nets',
      'Environmental science',
      'A1'
    ),
    illustrationAlt: 'Illustration of mesh fog nets on a misty hill',
    passage: [
      'In some dry mountain villages in Peru and Morocco, it almost never rains. However, thick white fog rolls in from the ocean nearly every morning. For many years, families had to walk several kilometres to fetch water from deep wells.',
      'Today, villagers stretch tall plastic nets between wooden poles on the tops of hills. When the wind pushes the damp fog through the fine net, tiny drops of water stick to the mesh. As the drops grow heavier, they slide down into a plastic pipe at the bottom of the net.',
      'The pipe carries the clean water directly into large storage tanks near the village houses. A single net can collect hundreds of litres of water on a foggy day without using any electricity.',
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'diag-a1-3-v1',
        word: 'damp',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Slightly wet.',
        contextMeaning: 'Air filled with tiny drops of moisture.',
        originalSentence:
          'When the wind pushes the damp fog through the fine net, tiny drops of water stick to the mesh.',
        exampleSentence: 'The grass was damp after the cool night.',
      },
    ],
    questions: [
      {
        id: 'diag-a1-3-q1',
        type: 'multiple_choice',
        prompt: 'Where does the morning fog in these villages come from?',
        options: ['From the ocean', 'From hot desert rivers', 'From melting snow', 'From deep wells'],
        correctAnswer: 'From the ocean',
        explanation: 'Paragraph 1 states that thick white fog rolls in from the ocean.',
        passageEvidence: 'However, thick white fog rolls in from the ocean nearly every morning.',
        difficulty: 'foundation',
      },
      {
        id: 'diag-a1-3-q2',
        type: 'multiple_choice',
        prompt: 'Where do villagers put the plastic nets?',
        options: [
          'On the tops of hills',
          'At the bottom of deep valleys',
          'Inside their kitchen roofs',
          'Underneath the ocean waves',
        ],
        correctAnswer: 'On the tops of hills',
        explanation:
          'Paragraph 2 explains that villagers stretch tall plastic nets between wooden poles on the tops of hills.',
        passageEvidence:
          'Today, villagers stretch tall plastic nets between wooden poles on the tops of hills.',
        difficulty: 'foundation',
      },
      {
        id: 'diag-a1-3-q3',
        type: 'true_false_not_given',
        prompt: 'The fog nets need electric pumps to push water into the village tanks.',
        options: ['True', 'False', 'Not Given'],
        correctAnswer: 'False',
        explanation:
          'Paragraph 3 states that the nets collect water without using any electricity.',
        passageEvidence:
          'A single net can collect hundreds of litres of water on a foggy day without using any electricity.',
        difficulty: 'core',
      },
      {
        id: 'diag-a1-3-q4',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 2, what does the word "damp" mean?',
        options: ['Slightly wet', 'Very hot', 'Completely dry', 'Loud and windy'],
        correctAnswer: 'Slightly wet',
        explanation: 'Damp means slightly wet or holding moisture.',
        passageEvidence:
          'When the wind pushes the damp fog through the fine net, tiny drops of water stick to the mesh.',
        difficulty: 'core',
      },
      {
        id: 'diag-a1-3-q5',
        type: 'multiple_choice',
        prompt: 'What happens when the water drops on the net grow heavier?',
        options: [
          'They slide down into a pipe at the bottom of the net.',
          'They blow back toward the ocean.',
          'They freeze into solid ice on the poles.',
          'They break the wooden poles.',
        ],
        correctAnswer: 'They slide down into a pipe at the bottom of the net.',
        explanation:
          'Paragraph 2 states that as the drops grow heavier, they slide down into a plastic pipe.',
        passageEvidence:
          'As the drops grow heavier, they slide down into a plastic pipe at the bottom of the net.',
        difficulty: 'core',
      },
      {
        id: 'diag-a1-3-q6',
        type: 'multiple_choice',
        prompt: 'Why is the fog net system helpful for families in the village?',
        options: [
          'It brings water close to their homes so they do not have to walk far to wells.',
          'It stops fog from covering the mountain roads in winter.',
          'It creates electricity for street lights.',
          'It helps fishermen catch more fish in the ocean.',
        ],
        correctAnswer:
          'It brings water close to their homes so they do not have to walk far to wells.',
        explanation:
          'Paragraph 1 notes families used to walk several kilometres to wells, while Paragraph 3 shows pipes carry water to tanks near the houses.',
        passageEvidence:
          'The pipe carries the clean water directly into large storage tanks near the village houses.',
        difficulty: 'challenging',
      },
    ],
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-01-10T00:00:00.000Z',
  },

  // ============================================================================
  // A2 DIAGNOSTIC PASSAGES (3)
  // ============================================================================
  {
    id: 'diag-a2-1-floating-libraries',
    title: 'Floating Book Boats on River Islands',
    level: 'A2',
    topic: 'Education and learning',
    status: 'published',
    isDiagnostic: true,
    diagnosticBand: 'foundation',
    estimatedMinutes: 2,
    wordCount: 196,
    introduction:
      'Read this passage about wooden boats that bring books and solar-powered computers to river communities.',
    illustrationUrl: getEditorialIllustrationUri(
      'diag-a2-1-floating-libraries',
      'Education and learning',
      'A2'
    ),
    illustrationAlt: 'Illustration of a wooden library boat docked along a river',
    passage: [
      'During the monsoon season in Bangladesh, heavy rain causes rivers to flood the surrounding land for months. Many villages sit on low river islands that can only be reached by boat. When the water rises, roads disappear and children often cannot travel to school or visit a town library.',
      'To solve this problem, a local architect designed flat-bottomed wooden boats that work as floating libraries and classrooms. Each boat carries around five hundred books in waterproof shelves, along with four laptop computers powered by solar panels on the roof.',
      'A library boat stops at three different villages each week. When it docks at a riverbank, students climb aboard for two hours of reading lessons and basic computer practice. Adults also borrow agricultural guides and storybooks to read at home until the boat returns the following week.',
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'diag-a2-1-v1',
        word: 'waterproof',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Not allowing water to pass through.',
        contextMeaning: 'Shelves built to keep books dry during heavy rain.',
        originalSentence:
          'Each boat carries around five hundred books in waterproof shelves, along with four laptop computers powered by solar panels on the roof.',
        exampleSentence: 'She wore a waterproof jacket in the storm.',
      },
    ],
    questions: [
      {
        id: 'diag-a2-1-q1',
        type: 'multiple_choice',
        prompt: 'Why is it difficult for children on river islands to attend school during the monsoon season?',
        options: [
          'Flooding covers the roads and isolates the islands.',
          'The weather is too dry for boats to move.',
          'All teachers move to the capital city in summer.',
          'Bridges are closed for painting every week.',
        ],
        correctAnswer: 'Flooding covers the roads and isolates the islands.',
        explanation:
          'Paragraph 1 explains that heavy rain causes rivers to flood and roads disappear.',
        passageEvidence:
          'When the water rises, roads disappear and children often cannot travel to school or visit a town library.',
        difficulty: 'foundation',
      },
      {
        id: 'diag-a2-1-q2',
        type: 'multiple_choice',
        prompt: 'How do the laptop computers on the boat get electricity?',
        options: [
          'From solar panels on the boat roof',
          'From cables connected to village houses',
          'From wind turbines on the riverbank',
          'From a noisy petrol generator',
        ],
        correctAnswer: 'From solar panels on the boat roof',
        explanation:
          'Paragraph 2 states that the four laptop computers are powered by solar panels on the roof.',
        passageEvidence:
          'Each boat carries around five hundred books in waterproof shelves, along with four laptop computers powered by solar panels on the roof.',
        difficulty: 'foundation',
      },
      {
        id: 'diag-a2-1-q3',
        type: 'true_false_not_given',
        prompt: 'Only school-age children are allowed to use the books from the boat.',
        options: ['True', 'False', 'Not Given'],
        correctAnswer: 'False',
        explanation:
          'Paragraph 3 states that adults also borrow agricultural guides and storybooks.',
        passageEvidence:
          'Adults also borrow agricultural guides and storybooks to read at home until the boat returns the following week.',
        difficulty: 'core',
      },
      {
        id: 'diag-a2-1-q4',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 2, what does "waterproof" mean?',
        options: [
          'Protected so water cannot enter or damage items',
          'Made from floating river plants',
          'Painted the colour of river water',
          'Easy to fold and carry by hand',
        ],
        correctAnswer: 'Protected so water cannot enter or damage items',
        explanation: 'Waterproof means preventing water from entering and wetting the books.',
        passageEvidence: 'Each boat carries around five hundred books in waterproof shelves...',
        difficulty: 'core',
      },
      {
        id: 'diag-a2-1-q5',
        type: 'multiple_choice',
        prompt: 'How long can adults keep the books they borrow?',
        options: [
          'Until the boat returns the following week',
          'For two hours while the boat is docked',
          'Until the monsoon season ends',
          'For one full school year',
        ],
        correctAnswer: 'Until the boat returns the following week',
        explanation:
          'Paragraph 3 explains that adults borrow books to read at home until the boat returns the following week.',
        passageEvidence:
          'Adults also borrow agricultural guides and storybooks to read at home until the boat returns the following week.',
        difficulty: 'core',
      },
      {
        id: 'diag-a2-1-q6',
        type: 'multiple_choice',
        prompt: 'What is the main idea of this passage?',
        options: [
          'Solar-powered library boats bring education and books to flood-affected villages.',
          'Bangladesh is building new highways across all river islands.',
          'Children prefer laptop games to printed storybooks.',
          'Monsoon rains have stopped occurring in South Asia.',
        ],
        correctAnswer:
          'Solar-powered library boats bring education and books to flood-affected villages.',
        explanation:
          'The passage focuses on how floating library boats deliver books and lessons to villages cut off by seasonal floods.',
        passageEvidence:
          'To solve this problem, a local architect designed flat-bottomed wooden boats that work as floating libraries and classrooms.',
        difficulty: 'core',
      },
    ],
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'diag-a2-2-roman-concrete-harbours',
    title: 'Why Ancient Roman Sea Walls Still Stand',
    level: 'A2',
    topic: 'History and archaeology',
    status: 'published',
    isDiagnostic: true,
    diagnosticBand: 'core',
    estimatedMinutes: 2,
    wordCount: 205,
    introduction:
      'Read this passage about how volcanic ash helped ancient Roman harbour walls survive for two thousand years.',
    illustrationUrl: getEditorialIllustrationUri(
      'diag-a2-2-roman-concrete-harbours',
      'History and archaeology',
      'A2'
    ),
    illustrationAlt: 'Illustration of ancient Roman stone harbour arches in the sea',
    passage: [
      'Modern concrete sea walls often begin to crack after only fifty years because salty ocean waves slowly weaken the steel bars inside them. Yet along the coast of Italy, concrete harbour walls built by the ancient Romans more than two thousand years ago are still standing strong.',
      'For centuries, engineers wondered why Roman marine concrete lasted so long. By studying small rock samples under powerful microscopes, researchers discovered that Roman builders mixed volcanic ash from near Naples with lime and seawater. They then packed this wet mixture into wooden moulds underwater.',
      'Instead of damaging the wall, seawater actually triggered a slow chemical reaction with the volcanic ash. Over time, tiny new minerals grew inside every crack, making the ancient concrete harder rather than weaker.',
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'diag-a2-2-v1',
        word: 'triggered',
        partOfSpeech: 'verb',
        simpleDefinition: 'Caused something to start happening.',
        contextMeaning: 'Started a chemical change inside the concrete.',
        originalSentence:
          'Instead of damaging the wall, seawater actually triggered a slow chemical reaction with the volcanic ash.',
        exampleSentence: 'The warm rain triggered the seeds to sprout.',
      },
    ],
    questions: [
      {
        id: 'diag-a2-2-q1',
        type: 'multiple_choice',
        prompt: 'Why do many modern concrete sea walls crack after about fifty years?',
        options: [
          'Salty ocean water weakens the steel bars inside them.',
          'Volcanic ash makes modern concrete too soft.',
          'Wooden moulds rot inside modern harbours.',
          'Large ships hit the walls every day.',
        ],
        correctAnswer: 'Salty ocean water weakens the steel bars inside them.',
        explanation:
          'Paragraph 1 states that salty ocean waves slowly weaken the steel bars inside modern concrete walls.',
        passageEvidence:
          'Modern concrete sea walls often begin to crack after only fifty years because salty ocean waves slowly weaken the steel bars inside them.',
        difficulty: 'foundation',
      },
      {
        id: 'diag-a2-2-q2',
        type: 'multiple_choice',
        prompt: 'Which special material did Roman builders mix with lime and seawater?',
        options: ['Volcanic ash', 'Iron filings', 'Crushed glass', 'River clay'],
        correctAnswer: 'Volcanic ash',
        explanation:
          'Paragraph 2 explains that Roman builders mixed volcanic ash from near Naples with lime and seawater.',
        passageEvidence:
          '...researchers discovered that Roman builders mixed volcanic ash from near Naples with lime and seawater.',
        difficulty: 'foundation',
      },
      {
        id: 'diag-a2-2-q3',
        type: 'true_false_not_given',
        prompt: 'Seawater made the Roman harbour walls weaker over time.',
        options: ['True', 'False', 'Not Given'],
        correctAnswer: 'False',
        explanation:
          'Paragraph 3 explains that seawater reacted with the ash to grow new minerals that made the concrete harder.',
        passageEvidence:
          'Over time, tiny new minerals grew inside every crack, making the ancient concrete harder rather than weaker.',
        difficulty: 'core',
      },
      {
        id: 'diag-a2-2-q4',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 3, what does the word "triggered" mean?',
        options: [
          'Started or caused a process to happen',
          'Prevented a chemical change',
          'Measured the weight of',
          'Washed away completely',
        ],
        correctAnswer: 'Started or caused a process to happen',
        explanation: 'Triggered means caused the chemical reaction to start.',
        passageEvidence:
          'Instead of damaging the wall, seawater actually triggered a slow chemical reaction with the volcanic ash.',
        difficulty: 'core',
      },
      {
        id: 'diag-a2-2-q5',
        type: 'multiple_choice',
        prompt: 'How did scientists find out why the Roman concrete was so strong?',
        options: [
          'They examined small samples of the rock under microscopes.',
          'They found a wooden ship carrying wet lime.',
          'They rebuilt an entire harbour in Naples.',
          'They interviewed local fishermen.',
        ],
        correctAnswer: 'They examined small samples of the rock under microscopes.',
        explanation:
          'Paragraph 2 notes that researchers studied small rock samples under powerful microscopes.',
        passageEvidence:
          'By studying small rock samples under powerful microscopes, researchers discovered that Roman builders mixed volcanic ash...',
        difficulty: 'core',
      },
      {
        id: 'diag-a2-2-q6',
        type: 'multiple_choice',
        prompt: 'What filled the cracks inside the Roman sea walls as they aged?',
        options: [
          'Tiny new minerals formed by the chemical reaction',
          'Melted steel bars from modern repairs',
          'Dry sand blown from the beach',
          'Tree roots from nearby forests',
        ],
        correctAnswer: 'Tiny new minerals formed by the chemical reaction',
        explanation:
          'Paragraph 3 states that tiny new minerals grew inside every crack.',
        passageEvidence:
          'Over time, tiny new minerals grew inside every crack, making the ancient concrete harder rather than weaker.',
        difficulty: 'challenging',
      },
    ],
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'diag-a2-3-bumblebee-flower-signals',
    title: 'How Bumblebees Know Which Flowers to Visit',
    level: 'A2',
    topic: 'Biology and animal behaviour',
    status: 'published',
    isDiagnostic: true,
    diagnosticBand: 'stretch',
    estimatedMinutes: 2,
    wordCount: 210,
    introduction:
      'Read this passage about how flowers and bumblebees use tiny electrical signals to save time.',
    illustrationUrl: getEditorialIllustrationUri(
      'diag-a2-3-bumblebee-flower-signals',
      'Biology and animal behaviour',
      'A2'
    ),
    illustrationAlt: 'Illustration of a bumblebee approaching a bright flower',
    passage: [
      'Bright petals and sweet scents attract bumblebees to garden flowers from a distance. However, making sweet nectar takes time, so a flower that was just visited by one bee may be empty for the next twenty minutes. Visiting empty flowers wastes valuable energy for a hungry bee.',
      'Biologists at the University of Bristol discovered that bees have a clever way to avoid empty blooms. As a bumblebee flies through the air, its fast-moving wings build up a tiny positive electrical charge, much like rubbing a balloon against a wool sweater. Meanwhile, flowers rooted in damp soil carry a slight negative charge.',
      'When a bee lands on a flower to drink nectar, it leaves part of its positive charge behind on the petals for a short time. Approaching bees can sense this changed electrical field with the tiny hairs on their bodies, telling them to fly on to another blossom.',
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'diag-a2-3-v1',
        word: 'valuable',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Very useful or important; not to be wasted.',
        contextMeaning: 'Energy that a bee needs to survive and fly.',
        originalSentence: 'Visiting empty flowers wastes valuable energy for a hungry bee.',
        exampleSentence: 'Clean water is a valuable resource in dry regions.',
      },
    ],
    questions: [
      {
        id: 'diag-a2-3-q1',
        type: 'multiple_choice',
        prompt: 'Why is a flower often empty right after a bee visits it?',
        options: [
          'Because the flower needs about twenty minutes to make more nectar',
          'Because the petals fall off after one visit',
          'Because the wind blows the nectar onto the soil',
          'Because flowers only make nectar at night',
        ],
        correctAnswer: 'Because the flower needs about twenty minutes to make more nectar',
        explanation:
          'Paragraph 1 states that making sweet nectar takes time, so a recently visited flower may be empty for twenty minutes.',
        passageEvidence:
          'However, making sweet nectar takes time, so a flower that was just visited by one bee may be empty for the next twenty minutes.',
        difficulty: 'foundation',
      },
      {
        id: 'diag-a2-3-q2',
        type: 'multiple_choice',
        prompt: 'How does a flying bumblebee build up a positive electrical charge?',
        options: [
          'By moving its wings rapidly through the air',
          'By drinking salty water from damp soil',
          'By rubbing its legs against tree bark',
          'By resting inside a warm hive',
        ],
        correctAnswer: 'By moving its wings rapidly through the air',
        explanation:
          'Paragraph 2 explains that as a bumblebee flies through the air, its fast-moving wings build up a tiny positive electrical charge.',
        passageEvidence:
          'As a bumblebee flies through the air, its fast-moving wings build up a tiny positive electrical charge...',
        difficulty: 'core',
      },
      {
        id: 'diag-a2-3-q3',
        type: 'true_false_not_given',
        prompt: 'Unvisited flowers rooted in damp soil have a slight negative electrical charge.',
        options: ['True', 'False', 'Not Given'],
        correctAnswer: 'True',
        explanation:
          'Paragraph 2 states that flowers rooted in damp soil carry a slight negative charge.',
        passageEvidence: 'Meanwhile, flowers rooted in damp soil carry a slight negative charge.',
        difficulty: 'core',
      },
      {
        id: 'diag-a2-3-q4',
        type: 'multiple_choice',
        prompt: 'What part of a bee senses the electrical field of a flower?',
        options: ['The tiny hairs on its body', 'Its compound eyes', 'Its back legs', 'Its stinger'],
        correctAnswer: 'The tiny hairs on its body',
        explanation:
          'Paragraph 3 states that approaching bees sense the changed electrical field with the tiny hairs on their bodies.',
        passageEvidence:
          'Approaching bees can sense this changed electrical field with the tiny hairs on their bodies...',
        difficulty: 'core',
      },
      {
        id: 'diag-a2-3-q5',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 3, which word is used as a synonym for "flower"?',
        options: ['blossom', 'charge', 'soil', 'sweater'],
        correctAnswer: 'blossom',
        explanation: 'At the end of Paragraph 3, "another blossom" means another flower.',
        passageEvidence: '...telling them to fly on to another blossom.',
        difficulty: 'core',
      },
      {
        id: 'diag-a2-3-q6',
        type: 'multiple_choice',
        prompt: 'How does the electrical change help both the bee and the flower?',
        options: [
          'Bees save energy by skipping empty flowers until more nectar is ready.',
          'The electrical charge heats the petals during cold nights.',
          'It keeps rain from washing away the flower petals.',
          'It turns bitter nectar into sweet honey instantly.',
        ],
        correctAnswer: 'Bees save energy by skipping empty flowers until more nectar is ready.',
        explanation:
          'The passage explains that sensing the temporary charge lets bees avoid empty blooms and save energy.',
        passageEvidence:
          'Biologists at the University of Bristol discovered that bees have a clever way to avoid empty blooms.',
        difficulty: 'challenging',
      },
    ],
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-01-10T00:00:00.000Z',
  },

  // ============================================================================
  // B1 DIAGNOSTIC PASSAGES (3) — Initial Reference Level
  // ============================================================================
  {
    id: 'diag-b1-1-urban-sponge-parks',
    title: 'Sponge Cities: Designing Streets That Drink Rain',
    level: 'B1',
    topic: 'Architecture and urban development',
    status: 'published',
    isDiagnostic: true,
    diagnosticBand: 'foundation',
    estimatedMinutes: 3,
    wordCount: 224,
    introduction:
      'Read this passage about how modern cities replace concrete drains with porous parks and wetlands to prevent flooding.',
    illustrationUrl: getEditorialIllustrationUri(
      'diag-b1-1-urban-sponge-parks',
      'Architecture and urban development',
      'B1'
    ),
    illustrationAlt: 'Illustration of a green urban park absorbing rainwater alongside city buildings',
    passage: [
      'For over a century, urban planners treated rainwater as a nuisance that needed to be removed as quickly as possible. Cities covered soil with waterproof asphalt and built concrete pipes to rush stormwater straight into nearby rivers. However, when intense summer storms strike, these rigid pipe networks often overflow, flooding streets and basements while leaving city soil parched during dry months.',
      'In response, engineers in cities such as Wuhan, Rotterdam, and Portland have adopted the "sponge city" approach. Instead of sealing the ground, planners install permeable pavements, sunken neighborhood gardens, and restored urban wetlands that absorb rainfall like a giant sponge. Water filters slowly through layers of gravel, sand, and plant roots, which naturally trap oil and road pollutants.',
      'Once stored underground, this purified water recharges local aquifers and can be pumped back up to irrigate street trees or cool public plazas during heatwaves. By slowing water down rather than fighting it, sponge infrastructure reduces flood damage and lowers summer temperatures at the same time.',
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'diag-b1-1-v1',
        word: 'permeable',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Allowing liquids or gases to pass through.',
        contextMeaning: 'Pavements with tiny gaps that let rainwater soak into the ground.',
        originalSentence:
          'Instead of sealing the ground, planners install permeable pavements, sunken neighborhood gardens, and restored urban wetlands that absorb rainfall like a giant sponge.',
        exampleSentence: 'Sandy soil is much more permeable than heavy clay.',
      },
      {
        id: 'diag-b1-1-v2',
        word: 'parched',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Extremely dry because of heat and lack of rain.',
        contextMeaning: 'City soil left completely dry because stormwater was piped away.',
        originalSentence:
          'However, when intense summer storms strike, these rigid pipe networks often overflow, flooding streets and basements while leaving city soil parched during dry months.',
        exampleSentence: 'The parched fields turned green again after the autumn rain.',
      },
    ],
    questions: [
      {
        id: 'diag-b1-1-q1',
        type: 'multiple_choice',
        prompt: 'What was the traditional urban planning goal for dealing with rainwater?',
        options: [
          'To channel it away from the city as quickly as possible through pipes',
          'To store it on apartment rooftops for drinking water',
          'To let it sit on asphalt roads until it evaporated',
          'To pump it directly into underground metro tunnels',
        ],
        correctAnswer: 'To channel it away from the city as quickly as possible through pipes',
        explanation:
          'Paragraph 1 states that planners treated rainwater as a nuisance to be removed as quickly as possible via concrete pipes.',
        passageEvidence:
          'Cities covered soil with waterproof asphalt and built concrete pipes to rush stormwater straight into nearby rivers.',
        difficulty: 'foundation',
      },
      {
        id: 'diag-b1-1-q2',
        type: 'true_false_not_given',
        prompt: 'Traditional concrete pipe systems prevent city soil from becoming dry in summer.',
        options: ['True', 'False', 'Not Given'],
        correctAnswer: 'False',
        explanation:
          'Paragraph 1 explains that sealing the ground and piping water away leaves city soil parched during dry months.',
        passageEvidence:
          '...flooding streets and basements while leaving city soil parched during dry months.',
        difficulty: 'core',
      },
      {
        id: 'diag-b1-1-q3',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 2, what does "permeable" mean in the phrase "permeable pavements"?',
        options: [
          'Allowing water to soak through into the ground',
          'Built from recycled steel beams',
          'Painted bright colours to reflect sunlight',
          'Strong enough to support heavy cargo trucks',
        ],
        correctAnswer: 'Allowing water to soak through into the ground',
        explanation:
          'Paragraph 2 contrasts sealing the ground with installing permeable pavements that absorb rainfall.',
        passageEvidence:
          'Instead of sealing the ground, planners install permeable pavements, sunken neighborhood gardens, and restored urban wetlands that absorb rainfall like a giant sponge.',
        difficulty: 'core',
      },
      {
        id: 'diag-b1-1-q4',
        type: 'multiple_choice',
        prompt: 'How is rainwater cleaned in a sponge city?',
        options: [
          'It filters through gravel, sand, and plant roots that trap pollutants.',
          'It is boiled in large underground heating tanks.',
          'Workers add chlorine tablets to every street drain.',
          'Sunlight destroys oil before the water touches the pavement.',
        ],
        correctAnswer: 'It filters through gravel, sand, and plant roots that trap pollutants.',
        explanation:
          'Paragraph 2 states that water filters slowly through layers of gravel, sand, and plant roots, which naturally trap oil and road pollutants.',
        passageEvidence:
          'Water filters slowly through layers of gravel, sand, and plant roots, which naturally trap oil and road pollutants.',
        difficulty: 'core',
      },
      {
        id: 'diag-b1-1-q5',
        type: 'multiple_choice',
        prompt: 'According to Paragraph 3, how can stored rainwater help cities during heatwaves?',
        options: [
          'It can be pumped up to water street trees and cool public plazas.',
          'It can generate hydroelectric power for air conditioners.',
          'It can replace fuel in public buses.',
          'It can be frozen into blocks of ice for markets.',
        ],
        correctAnswer: 'It can be pumped up to water street trees and cool public plazas.',
        explanation:
          'Paragraph 3 explains that stored water can be pumped back up to irrigate street trees or cool public plazas during heatwaves.',
        passageEvidence:
          'Once stored underground, this purified water recharges local aquifers and can be pumped back up to irrigate street trees or cool public plazas during heatwaves.',
        difficulty: 'core',
      },
      {
        id: 'diag-b1-1-q6',
        type: 'multiple_choice',
        prompt: 'What is the author’s main point in comparing traditional drains with sponge cities?',
        options: [
          'Working with natural water absorption solves both flooding and urban drought.',
          'Concrete pipes are cheaper to maintain than parks.',
          'Only coastal cities in Europe can build urban wetlands.',
          'Asphalt roads should be banned in all residential areas.',
        ],
        correctAnswer:
          'Working with natural water absorption solves both flooding and urban drought.',
        explanation:
          'The passage shows that slowing and absorbing rainwater prevents storm overflows while saving water for dry heatwaves.',
        passageEvidence:
          'By slowing water down rather than fighting it, sponge infrastructure reduces flood damage and lowers summer temperatures at the same time.',
        difficulty: 'challenging',
      },
    ],
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'diag-b1-2-sleep-spindles-memory',
    title: 'How the Sleeping Brain Organizes New Memories',
    level: 'B1',
    topic: 'Psychology and human behaviour',
    status: 'published',
    isDiagnostic: true,
    diagnosticBand: 'core',
    estimatedMinutes: 3,
    wordCount: 230,
    introduction:
      'Read this passage about how brief bursts of brain activity during sleep transfer facts into long-term memory.',
    illustrationUrl: getEditorialIllustrationUri(
      'diag-b1-2-sleep-spindles-memory',
      'Psychology and human behaviour',
      'B1'
    ),
    illustrationAlt: 'Illustration of brain wave patterns during sleep memory consolidation',
    passage: [
      'Students who stay awake all night before an examination often find that facts they reviewed at midnight vanish by morning. Neuroscientists now know that sleep is not a passive rest period for the brain. Instead, it is an active filing session during which new experiences are sorted and moved into permanent storage.',
      'During the day, a brain region called the hippocampus acts like a temporary notepad, quickly recording new names, formulas, and events. However, the hippocampus has limited space. During light non-rapid eye movement (NREM) sleep, the brain produces brief, one-second bursts of electrical activity known as sleep spindles. These spindles transfer the day’s important memories from the hippocampus to the neocortex, the outer layer of the brain that holds long-term knowledge.',
      'This nightly transfer accomplishes two things at once: it protects useful knowledge from being forgotten and clears the temporary notepad so the learner can absorb fresh information the next morning.',
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'diag-b1-2-v1',
        word: 'passive',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Inactive; not taking an active part in doing something.',
        contextMeaning: 'Simply resting without doing any mental work.',
        originalSentence:
          'Neuroscientists now know that sleep is not a passive rest period for the brain.',
        exampleSentence: 'Reading critically is an active skill, not a passive habit.',
      },
    ],
    questions: [
      {
        id: 'diag-b1-2-q1',
        type: 'multiple_choice',
        prompt: 'Why does the author compare the hippocampus to a "temporary notepad"?',
        options: [
          'Because it quickly records new information during the day but has limited capacity',
          'Because it erases all memories every twenty minutes',
          'Because it only stores visual images and not words',
          'Because it is located on the outer surface of the skull',
        ],
        correctAnswer:
          'Because it quickly records new information during the day but has limited capacity',
        explanation:
          'Paragraph 2 explains that the hippocampus quickly records new names, formulas, and events, but has limited space.',
        passageEvidence:
          'During the day, a brain region called the hippocampus acts like a temporary notepad, quickly recording new names, formulas, and events. However, the hippocampus has limited space.',
        difficulty: 'foundation',
      },
      {
        id: 'diag-b1-2-q2',
        type: 'multiple_choice',
        prompt: 'What is the role of "sleep spindles" during NREM sleep?',
        options: [
          'They help move memories from the hippocampus to the neocortex.',
          'They wake the person up when loud noises occur.',
          'They block the neocortex from receiving electrical signals.',
          'They create vivid dreams during the final minutes of sleep.',
        ],
        correctAnswer: 'They help move memories from the hippocampus to the neocortex.',
        explanation:
          'Paragraph 2 states that sleep spindles transfer the day’s important memories from the hippocampus to the neocortex.',
        passageEvidence:
          'These spindles transfer the day’s important memories from the hippocampus to the neocortex...',
        difficulty: 'core',
      },
      {
        id: 'diag-b1-2-q3',
        type: 'true_false_not_given',
        prompt: 'Long-term knowledge is stored in the neocortex.',
        options: ['True', 'False', 'Not Given'],
        correctAnswer: 'True',
        explanation:
          'Paragraph 2 describes the neocortex as the outer layer of the brain that holds long-term knowledge.',
        passageEvidence:
          '...the neocortex, the outer layer of the brain that holds long-term knowledge.',
        difficulty: 'foundation',
      },
      {
        id: 'diag-b1-2-q4',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 1, what does the word "passive" mean?',
        options: [
          'Inactive and doing no work',
          'Extremely noisy and stressful',
          'Brief and unpredictable',
          'Carefully planned in advance',
        ],
        correctAnswer: 'Inactive and doing no work',
        explanation:
          'Paragraph 1 contrasts "a passive rest period" with "an active filing session."',
        passageEvidence:
          'Neuroscientists now know that sleep is not a passive rest period for the brain. Instead, it is an active filing session...',
        difficulty: 'core',
      },
      {
        id: 'diag-b1-2-q5',
        type: 'multiple_choice',
        prompt: 'In addition to saving memories, what is the second benefit of the nightly memory transfer?',
        options: [
          'It frees up space in the hippocampus to learn new things the next day.',
          'It allows students to sleep for fewer hours.',
          'It increases eyesight sharpness in the morning.',
          'It stops the brain from using glucose at night.',
        ],
        correctAnswer: 'It frees up space in the hippocampus to learn new things the next day.',
        explanation:
          'Paragraph 3 states that the transfer clears the temporary notepad so the learner can absorb fresh information the next morning.',
        passageEvidence:
          '...and clears the temporary notepad so the learner can absorb fresh information the next morning.',
        difficulty: 'core',
      },
      {
        id: 'diag-b1-2-q6',
        type: 'multiple_choice',
        prompt: 'What can be inferred about studying all night without sleeping?',
        options: [
          'Without sleep spindles, the brain struggles to transfer new facts into permanent storage.',
          'The neocortex works twice as fast when a student stays awake.',
          'Facts studied at midnight are stored directly in the neocortex.',
          'NREM sleep only helps athletes, not academic students.',
        ],
        correctAnswer:
          'Without sleep spindles, the brain struggles to transfer new facts into permanent storage.',
        explanation:
          'Because sleep spindles during NREM sleep move facts from temporary to permanent storage, skipping sleep leaves those facts vulnerable to vanishing.',
        passageEvidence:
          'Students who stay awake all night before an examination often find that facts they reviewed at midnight vanish by morning.',
        difficulty: 'challenging',
      },
    ],
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'diag-b1-3-kelp-forests-coasts',
    title: 'Underwater Kelp Forests and Coastal Protection',
    level: 'B1',
    topic: 'Environmental science',
    status: 'published',
    isDiagnostic: true,
    diagnosticBand: 'stretch',
    estimatedMinutes: 3,
    wordCount: 238,
    introduction:
      'Read this passage about how giant underwater seaweeds shelter marine life and soften destructive storm waves.',
    illustrationUrl: getEditorialIllustrationUri(
      'diag-b1-3-kelp-forests-coasts',
      'Environmental science',
      'B1'
    ),
    illustrationAlt: 'Illustration of tall underwater kelp blades swaying in coastal currents',
    passage: [
      'Along cool, nutrient-rich coastlines from California to Tasmania, giant kelp grows from rocky seafloors toward the sunlit surface. Unlike land plants, kelp does not have deep roots to absorb nutrients from soil; instead, it anchors itself to boulders with a claw-like structure called a holdfast and absorbs minerals directly from the surrounding water through its blades.',
      'Under ideal conditions, giant kelp can grow up to fifty centimetres a day, forming dense underwater canopies that shelter young fish, crabs, and sea otters. Beyond supporting biodiversity, these submerged forests act as natural breakwaters. When powerful ocean swells pass through a thick stand of kelp, the flexible stalks create friction that slows water currents and reduces wave height before the water crashes against coastal cliffs.',
      'However, warming ocean temperatures and overpopulations of sea urchins—spiny creatures that chew through kelp holdfasts—have destroyed large sections of kelp forest in recent decades, prompting marine biologists to replant resilient kelp strains along vulnerable shores.',
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'diag-b1-3-v1',
        word: 'submerged',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Completely underwater.',
        contextMeaning: 'Kelp forests growing beneath the surface of the sea.',
        originalSentence:
          'Beyond supporting biodiversity, these submerged forests act as natural breakwaters.',
        exampleSentence: 'The diver explored the submerged rocks near the bay.',
      },
    ],
    questions: [
      {
        id: 'diag-b1-3-q1',
        type: 'multiple_choice',
        prompt: 'How does giant kelp take in the minerals it needs to grow?',
        options: [
          'Directly from the surrounding seawater through its blades',
          'Through deep roots buried in muddy ocean soil',
          'By trapping small crabs inside its holdfast',
          'From rainwater floating on the ocean surface',
        ],
        correctAnswer: 'Directly from the surrounding seawater through its blades',
        explanation:
          'Paragraph 1 explains that kelp absorbs minerals directly from the surrounding water through its blades.',
        passageEvidence:
          '...and absorbs minerals directly from the surrounding water through its blades.',
        difficulty: 'foundation',
      },
      {
        id: 'diag-b1-3-q2',
        type: 'multiple_choice',
        prompt: 'What is the function of a kelp plant’s "holdfast"?',
        options: [
          'To anchor the kelp securely to rocky boulders on the seafloor',
          'To float the blades up toward the sunlight',
          'To poison sea urchins that approach the forest',
          'To store fresh water during low tide',
        ],
        correctAnswer: 'To anchor the kelp securely to rocky boulders on the seafloor',
        explanation:
          'Paragraph 1 states that kelp anchors itself to boulders with a claw-like structure called a holdfast.',
        passageEvidence:
          '...instead, it anchors itself to boulders with a claw-like structure called a holdfast...',
        difficulty: 'foundation',
      },
      {
        id: 'diag-b1-3-q3',
        type: 'multiple_choice',
        prompt: 'How do kelp forests help protect coastal cliffs from erosion?',
        options: [
          'Their flexible stalks create friction that slows currents and reduces wave height.',
          'They build hard limestone walls along the beach.',
          'They warm the water so winter storms cannot form.',
          'They push sand from the deep ocean onto the cliffs.',
        ],
        correctAnswer:
          'Their flexible stalks create friction that slows currents and reduces wave height.',
        explanation:
          'Paragraph 2 explains that the flexible stalks create friction that slows water currents and reduces wave height.',
        passageEvidence:
          'When powerful ocean swells pass through a thick stand of kelp, the flexible stalks create friction that slows water currents and reduces wave height...',
        difficulty: 'core',
      },
      {
        id: 'diag-b1-3-q4',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 2, what does the word "submerged" mean?',
        options: ['Located beneath the surface of the water', 'Planted by human farmers', 'Dried by the sun', 'Frozen during winter'],
        correctAnswer: 'Located beneath the surface of the water',
        explanation: 'Submerged means underwater.',
        passageEvidence:
          'Beyond supporting biodiversity, these submerged forests act as natural breakwaters.',
        difficulty: 'core',
      },
      {
        id: 'diag-b1-3-q5',
        type: 'true_false_not_given',
        prompt: 'Sea urchins damage kelp forests by chewing through the holdfasts that keep the kelp attached to rocks.',
        options: ['True', 'False', 'Not Given'],
        correctAnswer: 'True',
        explanation:
          'Paragraph 3 describes sea urchins as spiny creatures that chew through kelp holdfasts.',
        passageEvidence:
          '...and overpopulations of sea urchins—spiny creatures that chew through kelp holdfasts—have destroyed large sections of kelp forest...',
        difficulty: 'core',
      },
      {
        id: 'diag-b1-3-q6',
        type: 'multiple_choice',
        prompt: 'Why is damage to a kelp holdfast so destructive to the entire kelp plant?',
        options: [
          'Once detached from its rock anchor, the kelp can no longer stay in place in the forest.',
          'The holdfast is the only part of the kelp that receives sunlight.',
          'Cutting the holdfast stops the kelp from absorbing minerals through its roots.',
          'Sea otters only eat the holdfast of the plant.',
        ],
        correctAnswer:
          'Once detached from its rock anchor, the kelp can no longer stay in place in the forest.',
        explanation:
          'Because the holdfast anchors the plant to boulders, chewing through it detaches the entire kelp stalk.',
        passageEvidence:
          '...it anchors itself to boulders with a claw-like structure called a holdfast...',
        difficulty: 'challenging',
      },
    ],
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-01-10T00:00:00.000Z',
  },

  // ============================================================================
  // B2 DIAGNOSTIC PASSAGES (3)
  // ============================================================================
  {
    id: 'diag-b2-1-jevons-efficiency-paradox',
    title: 'The Efficiency Paradox: Why Saving Energy Can Increase Consumption',
    level: 'B2',
    topic: 'Economics and society',
    status: 'published',
    isDiagnostic: true,
    diagnosticBand: 'foundation',
    estimatedMinutes: 3,
    wordCount: 256,
    introduction:
      'Read this analytical passage about why technological improvements in fuel efficiency often lead to higher overall resource use.',
    illustrationUrl: getEditorialIllustrationUri(
      'diag-b2-1-jevons-efficiency-paradox',
      'Economics and society',
      'B2'
    ),
    illustrationAlt: 'Illustration of industrial steam engines and modern energy demand curves',
    passage: [
      'Intuition suggests that when engineers invent a machine that uses half as much fuel to perform a task, society’s total fuel consumption should fall. Yet in 1865, the English economist William Stanley Jevons observed the exact opposite in British coal mines. After James Watt introduced a far more efficient steam engine, coal consumption across Britain surged rather than declined. Because the new engines burned less coal per hour, operating steam power became cheap enough for hundreds of new factories, railways, and textile mills to adopt it.',
      'Modern economists call this phenomenon the "rebound effect." When fuel-efficient cars reduce the cost of driving a kilometre, commuters often choose to live farther from work or take additional weekend road trips. Similarly, when solid-state LED lighting cut electricity costs per bulb by eighty percent, municipalities and homeowners responded by illuminating building facades, gardens, and highways that had previously remained dark.',
      'Consequently, climate policy analysts argue that technological efficiency alone rarely lowers total emissions unless paired with conservation caps or energy pricing that prevents lower unit costs from stimulating runaway demand.',
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'diag-b2-1-v1',
        word: 'surged',
        partOfSpeech: 'verb',
        simpleDefinition: 'Increased suddenly and strongly.',
        contextMeaning: 'Rose sharply across Britain instead of falling.',
        originalSentence:
          'After James Watt introduced a far more efficient steam engine, coal consumption across Britain surged rather than declined.',
        exampleSentence: 'Electricity demand surged during the July heatwave.',
      },
      {
        id: 'diag-b2-1-v2',
        word: 'stimulating',
        partOfSpeech: 'verb',
        simpleDefinition: 'Encouraging something to grow, develop, or become more active.',
        contextMeaning: 'Triggering higher consumer demand because prices per unit dropped.',
        originalSentence:
          'Consequently, climate policy analysts argue that technological efficiency alone rarely lowers total emissions unless paired with conservation caps or energy pricing that prevents lower unit costs from stimulating runaway demand.',
        exampleSentence: 'Lower interest rates aimed at stimulating housing construction.',
      },
    ],
    questions: [
      {
        id: 'diag-b2-1-q1',
        type: 'multiple_choice',
        prompt: 'What did William Stanley Jevons notice after James Watt improved the efficiency of the steam engine?',
        options: [
          'Total coal use in Britain rose sharply because steam power became cheaper to adopt.',
          'British coal mines closed because factories needed only half as much fuel.',
          'Textile mills switched from steam engines back to waterwheels.',
          'The price of coal doubled within five years.',
        ],
        correctAnswer:
          'Total coal use in Britain rose sharply because steam power became cheaper to adopt.',
        explanation:
          'Paragraph 1 states that coal consumption surged because cheaper operating costs led hundreds of new factories and railways to adopt steam power.',
        passageEvidence:
          'After James Watt introduced a far more efficient steam engine, coal consumption across Britain surged rather than declined.',
        difficulty: 'foundation',
      },
      {
        id: 'diag-b2-1-q2',
        type: 'multiple_choice',
        prompt: 'Why does the author mention LED lighting in Paragraph 2?',
        options: [
          'To illustrate how lower operating costs encourage people to use lighting in more places',
          'To show that modern electronics never experience the rebound effect',
          'To prove that street lighting uses more energy than commuter cars',
          'To explain how James Watt illuminated nineteenth-century factories',
        ],
        correctAnswer:
          'To illustrate how lower operating costs encourage people to use lighting in more places',
        explanation:
          'Paragraph 2 uses LED bulbs as a modern example of the rebound effect: cutting cost per bulb led people to light areas that were previously kept dark.',
        passageEvidence:
          'Similarly, when solid-state LED lighting cut electricity costs per bulb by eighty percent, municipalities and homeowners responded by illuminating building facades, gardens, and highways that had previously remained dark.',
        difficulty: 'core',
      },
      {
        id: 'diag-b2-1-q3',
        type: 'true_false_not_given',
        prompt: 'Fuel-efficient vehicles always reduce the total distance that commuters choose to drive.',
        options: ['True', 'False', 'Not Given'],
        correctAnswer: 'False',
        explanation:
          'Paragraph 2 states that when fuel-efficient cars reduce the cost of driving, commuters often choose to live farther from work or take additional trips.',
        passageEvidence:
          'When fuel-efficient cars reduce the cost of driving a kilometre, commuters often choose to live farther from work or take additional weekend road trips.',
        difficulty: 'core',
      },
      {
        id: 'diag-b2-1-q4',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 1, the word "surged" is closest in meaning to:',
        options: [
          'increased rapidly',
          'remained constant',
          'fluctuated slightly',
          'disappeared gradually',
        ],
        correctAnswer: 'increased rapidly',
        explanation:
          'In Paragraph 1, "surged rather than declined" contrasts a sharp rise with a decline.',
        passageEvidence:
          'After James Watt introduced a far more efficient steam engine, coal consumption across Britain surged rather than declined.',
        difficulty: 'core',
      },
      {
        id: 'diag-b2-1-q5',
        type: 'multiple_choice',
        prompt: 'According to Paragraph 3, what must accompany efficiency improvements to achieve real reductions in total emissions?',
        options: [
          'Conservation caps or energy pricing that curb demand growth',
          'Faster highway networks for suburban commuters',
          'Government subsidies that make electricity free at night',
          'Replacing all LED bulbs with traditional filament lamps',
        ],
        correctAnswer: 'Conservation caps or energy pricing that curb demand growth',
        explanation:
          'Paragraph 3 states that technological efficiency must be paired with conservation caps or energy pricing.',
        passageEvidence:
          '...unless paired with conservation caps or energy pricing that prevents lower unit costs from stimulating runaway demand.',
        difficulty: 'core',
      },
      {
        id: 'diag-b2-1-q6',
        type: 'multiple_choice',
        prompt: 'Which statement best summarizes the "rebound effect" described in the passage?',
        options: [
          'Efficiency lowers the cost per use, which often prompts users to consume more of the resource overall.',
          'Consumers reject new technologies whenever initial installation prices are too high.',
          'Industrial machines lose efficiency as their mechanical parts wear out over time.',
          'Energy prices automatically rise whenever fuel consumption drops.',
        ],
        correctAnswer:
          'Efficiency lowers the cost per use, which often prompts users to consume more of the resource overall.',
        explanation:
          'Across coal engines, cars, and LEDs, greater efficiency reduces unit cost and stimulates wider or heavier consumption.',
        passageEvidence: 'Modern economists call this phenomenon the "rebound effect."',
        difficulty: 'challenging',
      },
    ],
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'diag-b2-2-bilingual-executive-control',
    title: 'Cognitive Control and the Bilingual Brain',
    level: 'B2',
    topic: 'Psychology and human behaviour',
    status: 'published',
    isDiagnostic: true,
    diagnosticBand: 'core',
    estimatedMinutes: 3,
    wordCount: 262,
    introduction:
      'Read this passage about how managing two active languages shapes attention and cognitive flexibility.',
    illustrationUrl: getEditorialIllustrationUri(
      'diag-b2-2-bilingual-executive-control',
      'Psychology and human behaviour',
      'B2'
    ),
    illustrationAlt: 'Illustration of neural pathways connecting two language networks',
    passage: [
      'Early twentieth-century educators frequently warned that raising children with two languages would confuse them and slow their academic progress. Modern neuroimaging has overturned that assumption by revealing a surprising fact: when a bilingual person speaks one language, the other language does not switch off. Instead, both lexical systems remain simultaneously active in the brain, requiring constant mental selection to prevent words from the unused language from intruding.',
      'This continuous juggling act relies on the brain’s "executive control network," a set of prefrontal regions responsible for focusing attention, ignoring distractions, and switching rapidly between competing rules. Because bilingual speakers exercise this network thousands of times a day, functional MRI studies often show that they resolve conflicting visual tasks with less prefrontal effort than monolingual peers.',
      'Researchers caution, however, that this advantage is not a blanket increase in general intelligence. Rather, it is most pronounced in tasks demanding selective attention under interference, and its strength depends heavily on how frequently a speaker switches between languages in daily life.',
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'diag-b2-2-v1',
        word: 'intruding',
        partOfSpeech: 'verb',
        simpleDefinition: 'Entering a situation or place where one is not wanted.',
        contextMeaning: 'Unwanted words from the second language slipping into speech.',
        originalSentence:
          'Instead, both lexical systems remain simultaneously active in the brain, requiring constant mental selection to prevent words from the unused language from intruding.',
        exampleSentence: 'Thick windows kept street noise from intruding into the library.',
      },
    ],
    questions: [
      {
        id: 'diag-b2-2-q1',
        type: 'multiple_choice',
        prompt: 'What have modern neuroimaging studies revealed about how a bilingual brain processes language?',
        options: [
          'Both languages stay active at the same time even when only one is being spoken.',
          'One hemisphere of the brain completely shuts down while the other speaks.',
          'Bilingual speakers store all vocabulary in a single combined word list.',
          'The brain deletes childhood vocabulary to make room for a second language.',
        ],
        correctAnswer:
          'Both languages stay active at the same time even when only one is being spoken.',
        explanation:
          'Paragraph 1 states that when a bilingual person speaks one language, the other does not switch off; both lexical systems remain simultaneously active.',
        passageEvidence:
          'Instead, both lexical systems remain simultaneously active in the brain, requiring constant mental selection...',
        difficulty: 'foundation',
      },
      {
        id: 'diag-b2-2-q2',
        type: 'multiple_choice',
        prompt: 'Why does speaking two languages train the brain’s executive control network?',
        options: [
          'Because the speaker must continually select the target language and suppress the competing one',
          'Because bilingual dictionaries contain twice as many grammatical tenses',
          'Because pronunciation requires stronger vocal cord muscles',
          'Because bilinguals read aloud more often than monolinguals',
        ],
        correctAnswer:
          'Because the speaker must continually select the target language and suppress the competing one',
        explanation:
          'Paragraphs 1 and 2 explain that keeping both languages active requires constant mental selection and inhibition of the unused language.',
        passageEvidence:
          '...requiring constant mental selection to prevent words from the unused language from intruding.',
        difficulty: 'core',
      },
      {
        id: 'diag-b2-2-q3',
        type: 'true_false_not_given',
        prompt: 'Researchers conclude that bilingualism raises a person’s overall intelligence across every cognitive skill.',
        options: ['True', 'False', 'Not Given'],
        correctAnswer: 'False',
        explanation:
          'Paragraph 3 explicitly states that this advantage is not a blanket increase in general intelligence.',
        passageEvidence:
          'Researchers caution, however, that this advantage is not a blanket increase in general intelligence.',
        difficulty: 'core',
      },
      {
        id: 'diag-b2-2-q4',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 1, what does the word "intruding" mean?',
        options: [
          'Breaking in or interfering where it is not wanted',
          'Being forgotten over time',
          'Translating accurately into writing',
          'Sounding quieter than normal speech',
        ],
        correctAnswer: 'Breaking in or interfering where it is not wanted',
        explanation:
          'Intruding refers to words from the non-target language slipping in uninvited.',
        passageEvidence:
          '...requiring constant mental selection to prevent words from the unused language from intruding.',
        difficulty: 'core',
      },
      {
        id: 'diag-b2-2-q5',
        type: 'multiple_choice',
        prompt: 'According to Paragraph 2, what did functional MRI studies show when bilinguals performed conflicting visual tasks?',
        options: [
          'They resolved the tasks using less effort in the prefrontal cortex than monolinguals.',
          'They took twice as long to identify visual shapes.',
          'They relied on their auditory cortex instead of visual regions.',
          'They showed no brain activity in the prefrontal regions.',
        ],
        correctAnswer:
          'They resolved the tasks using less effort in the prefrontal cortex than monolinguals.',
        explanation:
          'Paragraph 2 states that functional MRI studies show they resolve conflicting visual tasks with less prefrontal effort than monolingual peers.',
        passageEvidence:
          '...functional MRI studies often show that they resolve conflicting visual tasks with less prefrontal effort than monolingual peers.',
        difficulty: 'core',
      },
      {
        id: 'diag-b2-2-q6',
        type: 'multiple_choice',
        prompt: 'Which bilingual speaker would likely show the strongest executive control benefit according to Paragraph 3?',
        options: [
          'Someone who switches regularly between two languages throughout each day',
          'Someone who learned a second language in childhood but never uses it now',
          'Someone who only reads translated novels in their native language',
          'Someone who memorizes word lists without speaking',
        ],
        correctAnswer: 'Someone who switches regularly between two languages throughout each day',
        explanation:
          'Paragraph 3 notes that the strength of the benefit depends heavily on how frequently a speaker switches between languages in daily life.',
        passageEvidence:
          '...and its strength depends heavily on how frequently a speaker switches between languages in daily life.',
        difficulty: 'challenging',
      },
    ],
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'diag-b2-3-mycorrhizal-forest-networks',
    title: 'Underground Fungal Markets: Resource Trading Beneath the Forest Floor',
    level: 'B2',
    topic: 'Biology and animal behaviour',
    status: 'published',
    isDiagnostic: true,
    diagnosticBand: 'stretch',
    estimatedMinutes: 3,
    wordCount: 274,
    introduction:
      'Read this passage about how underground fungi and plant roots negotiate nutrient exchanges like biological markets.',
    illustrationUrl: getEditorialIllustrationUri(
      'diag-b2-3-mycorrhizal-forest-networks',
      'Biology and animal behaviour',
      'B2'
    ),
    illustrationAlt: 'Illustration of tree roots intertwined with glowing underground fungal threads',
    passage: [
      'Beneath nearly every woodland floor lies a microscopic trading network formed by mycorrhizal fungi. These thread-like organisms cannot photosynthesize, so they depend on green plants for carbon-rich sugars. In return, fungal filaments—which are far thinner than plant roots—spread through tiny soil pores to harvest phosphorus and nitrogen, delivering these scarce minerals back to the host tree.',
      'While popular accounts sometimes portray this underground network as a purely selfless family where trees generously feed their neighbours, evolutionary biologists have uncovered a much more calculated "biological market." By tracking radioactive isotopes of carbon and phosphorus in laboratory root systems, researchers found that both plants and fungi actively monitor exchange rates.',
      'When a fungal partner supplies abundant phosphorus, the plant rewards that specific fungus with extra carbon. Conversely, if a fungus hoards minerals or lives in nutrient-poor soil, the plant restricts sugar delivery to that root tip. Even more remarkably, fungi can move phosphorus toward regions where plants are scarce, holding out for a higher carbon price when competition among trees increases.',
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'diag-b2-3-v1',
        word: 'hoards',
        partOfSpeech: 'verb',
        simpleDefinition: 'Keeps a large amount of something valuable for oneself instead of sharing.',
        contextMeaning: 'Holds back soil minerals instead of trading them to the plant.',
        originalSentence:
          'Conversely, if a fungus hoards minerals or lives in nutrient-poor soil, the plant restricts sugar delivery to that root tip.',
        exampleSentence: 'The squirrel hoards acorns inside hollow oak trees.',
      },
    ],
    questions: [
      {
        id: 'diag-b2-3-q1',
        type: 'multiple_choice',
        prompt: 'Why must mycorrhizal fungi partner with green plants to survive?',
        options: [
          'They cannot perform photosynthesis to make their own carbon-rich sugars.',
          'Their filaments are too thick to enter soil pores.',
          'They need tree bark to protect them from sunlight.',
          'They cannot absorb nitrogen without plant leaves.',
        ],
        correctAnswer: 'They cannot perform photosynthesis to make their own carbon-rich sugars.',
        explanation:
          'Paragraph 1 explains that mycorrhizal fungi cannot photosynthesize, so they depend on green plants for carbon-rich sugars.',
        passageEvidence:
          'These thread-like organisms cannot photosynthesize, so they depend on green plants for carbon-rich sugars.',
        difficulty: 'foundation',
      },
      {
        id: 'diag-b2-3-q2',
        type: 'multiple_choice',
        prompt: 'How do evolutionary biologists’ findings differ from popular stories about underground forest networks?',
        options: [
          'They show the relationship operates like a calculated market rather than purely selfless sharing.',
          'They prove that fungi actually kill host trees within a single season.',
          'They show that only pine trees connect to fungal threads.',
          'They demonstrate that phosphorus moves through the air rather than soil.',
        ],
        correctAnswer:
          'They show the relationship operates like a calculated market rather than purely selfless sharing.',
        explanation:
          'Paragraph 2 contrasts popular accounts of a "purely selfless family" with evidence of a calculated "biological market."',
        passageEvidence:
          'While popular accounts sometimes portray this underground network as a purely selfless family where trees generously feed their neighbours, evolutionary biologists have uncovered a much more calculated "biological market."',
        difficulty: 'core',
      },
      {
        id: 'diag-b2-3-q3',
        type: 'multiple_choice',
        prompt: 'How did researchers trace the movement of nutrients between roots and fungi?',
        options: [
          'By tracking radioactive isotopes of carbon and phosphorus',
          'By dyeing tree sap bright blue in outdoor forests',
          'By weighing fallen leaves at the end of autumn',
          'By listening to acoustic vibrations in the soil',
        ],
        correctAnswer: 'By tracking radioactive isotopes of carbon and phosphorus',
        explanation:
          'Paragraph 2 states that researchers tracked radioactive isotopes of carbon and phosphorus in laboratory root systems.',
        passageEvidence:
          'By tracking radioactive isotopes of carbon and phosphorus in laboratory root systems, researchers found that both plants and fungi actively monitor exchange rates.',
        difficulty: 'core',
      },
      {
        id: 'diag-b2-3-q4',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 3, what does the word "hoards" mean?',
        options: [
          'Keeps back for itself instead of sharing',
          'Dissolves quickly in water',
          'Produces through sunlight',
          'Transports to nearby rivers',
        ],
        correctAnswer: 'Keeps back for itself instead of sharing',
        explanation:
          'Hoards means holding onto the minerals rather than delivering them to the plant.',
        passageEvidence:
          'Conversely, if a fungus hoards minerals or lives in nutrient-poor soil, the plant restricts sugar delivery to that root tip.',
        difficulty: 'core',
      },
      {
        id: 'diag-b2-3-q5',
        type: 'true_false_not_given',
        prompt: 'Plants give the same amount of sugar to every fungal partner regardless of how much phosphorus the fungus provides.',
        options: ['True', 'False', 'Not Given'],
        correctAnswer: 'False',
        explanation:
          'Paragraph 3 states that plants reward fungi that supply abundant phosphorus with extra carbon and restrict sugar to fungi that provide little.',
        passageEvidence:
          'When a fungal partner supplies abundant phosphorus, the plant rewards that specific fungus with extra carbon.',
        difficulty: 'core',
      },
      {
        id: 'diag-b2-3-q6',
        type: 'multiple_choice',
        prompt: 'What strategy do fungi use to obtain a higher "carbon price" from plants?',
        options: [
          'They move phosphorus to areas where high demand among competing plants drives up carbon rewards.',
          'They sever all connections with trees during sunny summer months.',
          'They convert nitrogen into sugar inside their own filaments.',
          'They only partner with dead tree stumps.',
        ],
        correctAnswer:
          'They move phosphorus to areas where high demand among competing plants drives up carbon rewards.',
        explanation:
          'Paragraph 3 explains that fungi move phosphorus toward regions where scarcity and competition among trees yield a higher carbon price.',
        passageEvidence:
          'Even more remarkably, fungi can move phosphorus toward regions where plants are scarce, holding out for a higher carbon price when competition among trees increases.',
        difficulty: 'challenging',
      },
    ],
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-01-10T00:00:00.000Z',
  },

  // ============================================================================
  // C1 DIAGNOSTIC PASSAGES (3)
  // ============================================================================
  {
    id: 'diag-c1-1-algorithmic-epistemic-bubbles',
    title: 'Epistemic Bubbles Versus Echo Chambers in Digital Information Networks',
    level: 'C1',
    topic: 'Psychology and human behaviour',
    status: 'published',
    isDiagnostic: true,
    diagnosticBand: 'foundation',
    estimatedMinutes: 3,
    wordCount: 288,
    introduction:
      'Read this C1 passage examining the philosophical distinction between accidental information omission and active distrust in online networks.',
    illustrationUrl: getEditorialIllustrationUri(
      'diag-c1-1-algorithmic-epistemic-bubbles',
      'Psychology and human behaviour',
      'C1'
    ),
    illustrationAlt: 'Illustration of interconnected digital nodes and isolated information clusters',
    passage: [
      'In contemporary media scholarship, the terms "epistemic bubble" and "echo chamber" are routinely conflated, yet the philosopher C. Thi Nguyen argues that they describe two structurally distinct mechanisms of intellectual isolation. An epistemic bubble is a social network in which relevant opposing viewpoints are left out largely by omission. It forms through ordinary selective exposure: individuals follow like-minded colleagues, and recommendation algorithms prioritize content similar to past clicks. Crucially, members of an epistemic bubble are merely uninformed about rival arguments rather than inoculated against them; exposing them to credible outside evidence can readily shatter the bubble.',
      'An echo chamber, by contrast, is an epistemic structure that actively discredits all outside sources before they are even heard. Rather than relying on mere omission, an echo chamber cultivates a sharp asymmetry of trust: insiders are elevated as uniquely reliable, while external institutions, scientists, or journalists are framed as malicious or compromised. Consequently, when members of an echo chamber encounter contrary factual evidence, that very rebuttal is reinterpreted as proof of the outside world’s hostility, reinforcing insiders’ loyalty to the group.',
      'Distinguishing these two phenomena has urgent practical implications. While algorithmic diversity feeds can remedy an epistemic bubble by supplying missing perspectives, the same intervention often backfires inside an echo chamber, where trust must be rebuilt socially before raw factual corrections can take hold.',
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'diag-c1-1-v1',
        word: 'conflated',
        partOfSpeech: 'verb',
        simpleDefinition: 'Combined or treated as the same thing when they are actually different.',
        contextMeaning: 'Used interchangeably by writers despite having different meanings.',
        originalSentence:
          'In contemporary media scholarship, the terms "epistemic bubble" and "echo chamber" are routinely conflated, yet the philosopher C. Thi Nguyen argues that they describe two structurally distinct mechanisms of intellectual isolation.',
        exampleSentence: 'Public debate often conflated weather fluctuations with long-term climate trends.',
      },
      {
        id: 'diag-c1-1-v2',
        word: 'inoculated',
        partOfSpeech: 'verb',
        simpleDefinition: 'Protected or trained in advance to resist an outside influence.',
        contextMeaning: 'Pre-trained to reject outside arguments before hearing them.',
        originalSentence:
          'Crucially, members of an epistemic bubble are merely uninformed about rival arguments rather than inoculated against them; exposing them to credible outside evidence can readily shatter the bubble.',
        exampleSentence: 'Critical thinking courses inoculated students against misleading statistics.',
      },
    ],
    questions: [
      {
        id: 'diag-c1-1-q1',
        type: 'multiple_choice',
        prompt: 'According to C. Thi Nguyen, what is the primary mechanism that creates an "epistemic bubble"?',
        options: [
          'The accidental or algorithmic omission of competing viewpoints from a person’s network',
          'A deliberate campaign to accuse all outside scientists of fraud',
          'Government censorship of academic journals',
          'A refusal to use digital recommendation platforms',
        ],
        correctAnswer:
          'The accidental or algorithmic omission of competing viewpoints from a person’s network',
        explanation:
          'Paragraph 1 defines an epistemic bubble as a network where opposing viewpoints are left out largely by omission via selective exposure and algorithms.',
        passageEvidence:
          'An epistemic bubble is a social network in which relevant opposing viewpoints are left out largely by omission.',
        difficulty: 'core',
      },
      {
        id: 'diag-c1-1-q2',
        type: 'multiple_choice',
        prompt: 'How do members of an echo chamber typically respond when presented with outside factual evidence?',
        options: [
          'They treat the contrary evidence as confirmation that outside sources are hostile or untrustworthy.',
          'They immediately abandon their group’s beliefs.',
          'They realize they had simply never heard the opposing argument before.',
          'They delete their social media accounts to avoid further debate.',
        ],
        correctAnswer:
          'They treat the contrary evidence as confirmation that outside sources are hostile or untrustworthy.',
        explanation:
          'Paragraph 2 states that when echo chamber members encounter contrary evidence, that rebuttal is reinterpreted as proof of outside hostility, reinforcing loyalty.',
        passageEvidence:
          'Consequently, when members of an echo chamber encounter contrary factual evidence, that very rebuttal is reinterpreted as proof of the outside world’s hostility, reinforcing insiders’ loyalty to the group.',
        difficulty: 'core',
      },
      {
        id: 'diag-c1-1-q3',
        type: 'true_false_not_given',
        prompt: 'Exposing people in an epistemic bubble to credible outside information is generally ineffective.',
        options: ['True', 'False', 'Not Given'],
        correctAnswer: 'False',
        explanation:
          'Paragraph 1 states that exposing members of an epistemic bubble to credible outside evidence can readily shatter the bubble.',
        passageEvidence:
          '...exposing them to credible outside evidence can readily shatter the bubble.',
        difficulty: 'core',
      },
      {
        id: 'diag-c1-1-q4',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 1, what does the word "conflated" mean?',
        options: [
          'Treated as identical despite important differences',
          'Dismissed as outdated by modern scholars',
          'Measured using mathematical models',
          'Restricted to philosophical journals',
        ],
        correctAnswer: 'Treated as identical despite important differences',
        explanation:
          'Conflated means blending two distinct concepts together as if they were the same.',
        passageEvidence:
          'In contemporary media scholarship, the terms "epistemic bubble" and "echo chamber" are routinely conflated, yet the philosopher C. Thi Nguyen argues that they describe two structurally distinct mechanisms...',
        difficulty: 'core',
      },
      {
        id: 'diag-c1-1-q5',
        type: 'multiple_choice',
        prompt: 'Why can introducing diverse viewpoints into an online feed backfire for someone inside an echo chamber?',
        options: [
          'Because pre-existing distrust of outsiders causes them to use the new viewpoints to strengthen group loyalty',
          'Because algorithms cannot identify opposing political articles',
          'Because epistemic bubbles never form on social media platforms',
          'Because insiders have no access to the internet',
        ],
        correctAnswer:
          'Because pre-existing distrust of outsiders causes them to use the new viewpoints to strengthen group loyalty',
        explanation:
          'Paragraphs 2 and 3 explain that because echo chambers pre-emptively discredit outsiders, exposure to contrary feeds reinforces loyalty unless trust is rebuilt first.',
        passageEvidence:
          'While algorithmic diversity feeds can remedy an epistemic bubble by supplying missing perspectives, the same intervention often backfires inside an echo chamber...',
        difficulty: 'challenging',
      },
      {
        id: 'diag-c1-1-q6',
        type: 'multiple_choice',
        prompt: 'What is the fundamental difference between an epistemic bubble and an echo chamber?',
        options: [
          'An epistemic bubble lacks coverage of outside views, whereas an echo chamber systematically undermines trust in outside voices.',
          'An epistemic bubble occurs only in print media, whereas an echo chamber occurs only online.',
          'An echo chamber is easy to dissolve with facts, whereas an epistemic bubble is permanent.',
          'An epistemic bubble is created intentionally by leaders, whereas an echo chamber forms by accident.',
        ],
        correctAnswer:
          'An epistemic bubble lacks coverage of outside views, whereas an echo chamber systematically undermines trust in outside voices.',
        explanation:
          'The passage contrasts omission of coverage (epistemic bubble) with active pre-emptive distrust of external sources (echo chamber).',
        passageEvidence:
          'Rather than relying on mere omission, an echo chamber cultivates a sharp asymmetry of trust...',
        difficulty: 'challenging',
      },
    ],
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'diag-c1-2-paleoclimate-ice-cores',
    title: 'Reading Ancient Atmospheres: Isotopic Proxies in Polar Ice Cores',
    level: 'C1',
    topic: 'Environmental science',
    status: 'published',
    isDiagnostic: true,
    diagnosticBand: 'core',
    estimatedMinutes: 3,
    wordCount: 294,
    introduction:
      'Read this C1 passage on how glaciologists reconstruct prehistoric temperatures and greenhouse gas concentrations from polar ice.',
    illustrationUrl: getEditorialIllustrationUri(
      'diag-c1-2-paleoclimate-ice-cores',
      'Environmental science',
      'C1'
    ),
    illustrationAlt: 'Illustration of deep cylindrical ice cores extracted from an Antarctic glacier',
    passage: [
      'Direct instrumental records of global temperature extend back barely a century and a half. To reconstruct climate fluctuations across hundreds of millennia, paleoclimatologists rely on deep ice cores drilled from the Antarctic and Greenland ice sheets. As annual snowfalls accumulate without melting, the weight of fresh layers compresses older snow into porous "firn" and eventually seals it into solid glacial ice, trapping microscopic bubbles of the ancient atmosphere inside.',
      'While the trapped gas bubbles provide direct samples of prehistoric carbon dioxide and methane, determining the temperature at the time the snow fell requires a subtle chemical proxy: the ratio of heavy oxygen-18 (18O) to lighter oxygen-16 (16O) in the ice crystals themselves. Water molecules containing the heavier 18O isotope condense and fall as precipitation more readily as air cools on its journey from tropical oceans toward the poles. During colder glacial epochs, most heavy oxygen precipitates out over mid-latitude oceans before reaching Antarctica, leaving polar snow depleted in 18O.',
      'A crucial complication, however, is that snow traps air bubbles only after decades or centuries of compaction at the base of the firn layer. Consequently, the gas inside a bubble is measurably younger than the ice crystal surrounding it—a chronological offset known as the gas-ice age difference that researchers must model carefully when determining whether temperature shifts preceded or followed ancient carbon dioxide rises.',
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'diag-c1-2-v1',
        word: 'proxy',
        partOfSpeech: 'noun',
        simpleDefinition: 'A measurable clue used to stand in for something that cannot be measured directly.',
        contextMeaning: 'Using oxygen isotope ratios in ice to calculate ancient air temperatures.',
        originalSentence:
          'While the trapped gas bubbles provide direct samples of prehistoric carbon dioxide and methane, determining the temperature at the time the snow fell requires a subtle chemical proxy: the ratio of heavy oxygen-18 (18O) to lighter oxygen-16 (16O) in the ice crystals themselves.',
        exampleSentence: 'Tree-ring width serves as a reliable proxy for summer rainfall.',
      },
    ],
    questions: [
      {
        id: 'diag-c1-2-q1',
        type: 'multiple_choice',
        prompt: 'How do polar ice cores preserve direct samples of prehistoric greenhouse gases?',
        options: [
          'The weight of accumulating snow compresses porous firn into solid ice, sealing tiny air bubbles inside.',
          'Volcanic ash freezes carbon dioxide onto the surface of tropical oceans.',
          'Oxygen isotopes decay into methane inside the bedrock beneath Antarctica.',
          'Meltwater carries atmospheric gases down through cracks in the glacier.',
        ],
        correctAnswer:
          'The weight of accumulating snow compresses porous firn into solid ice, sealing tiny air bubbles inside.',
        explanation:
          'Paragraph 1 explains that the weight of fresh snow compresses older snow into firn and then solid ice, trapping microscopic bubbles of the ancient atmosphere.',
        passageEvidence:
          '...the weight of fresh layers compresses older snow into porous "firn" and eventually seals it into solid glacial ice, trapping microscopic bubbles of the ancient atmosphere inside.',
        difficulty: 'core',
      },
      {
        id: 'diag-c1-2-q2',
        type: 'multiple_choice',
        prompt: 'Why does Antarctic snow formed during a cold glacial epoch contain less heavy oxygen-18?',
        options: [
          'Heavier water molecules condense and fall as rain or snow earlier along the path toward the poles.',
          'Colder polar winds blow heavy oxygen molecules back toward the equator.',
          'Oxygen-18 only forms in the atmosphere during warm interglacial summers.',
          'Glacial ice crystals push heavy oxygen into the trapped air bubbles.',
        ],
        correctAnswer:
          'Heavier water molecules condense and fall as rain or snow earlier along the path toward the poles.',
        explanation:
          'Paragraph 2 states that heavier 18O water molecules condense more readily as air cools, so during colder epochs most heavy oxygen precipitates out over mid-latitude oceans before reaching Antarctica.',
        passageEvidence:
          'During colder glacial epochs, most heavy oxygen precipitates out over mid-latitude oceans before reaching Antarctica, leaving polar snow depleted in 18O.',
        difficulty: 'challenging',
      },
      {
        id: 'diag-c1-2-q3',
        type: 'true_false_not_given',
        prompt: 'An air bubble trapped in an ice core is the exact same age as the ice crystal immediately surrounding it.',
        options: ['True', 'False', 'Not Given'],
        correctAnswer: 'False',
        explanation:
          'Paragraph 3 states that because snow traps air bubbles only after decades or centuries of compaction, the gas inside a bubble is measurably younger than the surrounding ice.',
        passageEvidence:
          'Consequently, the gas inside a bubble is measurably younger than the ice crystal surrounding it...',
        difficulty: 'core',
      },
      {
        id: 'diag-c1-2-q4',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 2, what does the word "proxy" mean?',
        options: [
          'An indirect physical indicator used to estimate a past condition',
          'A mechanical drill used in sub-zero temperatures',
          'A direct thermometer reading taken by satellites',
          'A computer simulation that replaces field sampling',
        ],
        correctAnswer: 'An indirect physical indicator used to estimate a past condition',
        explanation:
          'A proxy is an indirect measurable indicator (the 18O/16O ratio) used to determine past temperature.',
        passageEvidence:
          '...determining the temperature at the time the snow fell requires a subtle chemical proxy: the ratio of heavy oxygen-18 (18O) to lighter oxygen-16 (16O)...',
        difficulty: 'core',
      },
      {
        id: 'diag-c1-2-q5',
        type: 'multiple_choice',
        prompt: 'Why is modeling the "gas-ice age difference" essential for paleoclimatologists?',
        options: [
          'To determine accurately whether past temperature changes happened before or after carbon dioxide changes',
          'To prevent trapped methane from escaping when the ice core is sliced',
          'To calculate how fast modern glaciers are sliding into the ocean',
          'To measure the exact depth of the Greenland bedrock',
        ],
        correctAnswer:
          'To determine accurately whether past temperature changes happened before or after carbon dioxide changes',
        explanation:
          'Paragraph 3 explains that researchers must model this chronological offset when determining whether temperature shifts preceded or followed ancient CO2 rises.',
        passageEvidence:
          '...a chronological offset known as the gas-ice age difference that researchers must model carefully when determining whether temperature shifts preceded or followed ancient carbon dioxide rises.',
        difficulty: 'challenging',
      },
      {
        id: 'diag-c1-2-q6',
        type: 'multiple_choice',
        prompt: 'Which distinction does the passage draw between measuring ancient greenhouse gases and measuring ancient temperatures in ice cores?',
        options: [
          'Greenhouse gases are sampled directly from trapped air bubbles, whereas temperatures must be inferred indirectly from ice isotopes.',
          'Temperatures are measured from trapped air bubbles, whereas greenhouse gases are measured from oxygen isotopes in the ice.',
          'Both greenhouse gases and temperatures can only be estimated through computer models.',
          'Direct instrumental thermometers have measured Antarctic ice cores for hundreds of millennia.',
        ],
        correctAnswer:
          'Greenhouse gases are sampled directly from trapped air bubbles, whereas temperatures must be inferred indirectly from ice isotopes.',
        explanation:
          'Paragraph 2 explicitly contrasts direct gas samples in trapped bubbles with the indirect isotopic proxy in the ice crystals needed for temperature.',
        passageEvidence:
          'While the trapped gas bubbles provide direct samples of prehistoric carbon dioxide and methane, determining the temperature at the time the snow fell requires a subtle chemical proxy...',
        difficulty: 'challenging',
      },
    ],
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'diag-c1-3-baumol-cost-disease',
    title: 'Baumol’s Cost Disease: Why Labour-Intensive Services Grow More Expensive',
    level: 'C1',
    topic: 'Economics and society',
    status: 'published',
    isDiagnostic: true,
    diagnosticBand: 'stretch',
    estimatedMinutes: 3,
    wordCount: 302,
    introduction:
      'Read this C1 passage explaining why healthcare, education, and live performing arts rise in cost faster than manufactured goods.',
    illustrationUrl: getEditorialIllustrationUri(
      'diag-c1-3-baumol-cost-disease',
      'Economics and society',
      'C1'
    ),
    illustrationAlt: 'Illustration of a string quartet and modern manufacturing automation',
    passage: [
      'Over the past half-century, the real price of manufactured goods—from laptops and solar panels to household appliances—has fallen dramatically, even as the price of university tuition, hospital care, and live orchestral concerts has climbed faster than general inflation. Critics frequently blame this divergence on administrative bloat or inefficiency in the service sector. Yet in the 1960s, the economists William Baumol and William Bowen demonstrated that rising service costs are an inevitable mathematical consequence of rapid productivity growth in manufacturing.',
      'To illustrate their thesis, Baumol and Bowen contrasted an automobile factory with a string quartet performing a forty-minute Beethoven composition. In manufacturing, automation and materials science allow a single worker to produce many more cars per hour than in 1960, pushing up factory wages while lowering the cost per vehicle. By contrast, a Beethoven quartet still requires four musicians playing for forty minutes; attempting to "increase productivity" by playing twice as fast or firing two violinists would destroy the product itself.',
      'Nevertheless, orchestras, schools, and hospitals compete in the same broader labour market as high-growth tech and manufacturing firms. To attract and retain skilled musicians, teachers, and nurses, service institutions must raise wages roughly in line with economy-wide income growth—even though their output per hour remains fixed. Paradoxically, however, because society as a whole grows wealthier through manufacturing gains, consumers can afford to spend a larger share of their income on these human-intensive services despite their rising relative price.',
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'diag-c1-3-v1',
        word: 'divergence',
        partOfSpeech: 'noun',
        simpleDefinition: 'A situation in which two things develop in opposite directions.',
        contextMeaning: 'The growing gap between falling factory prices and rising service prices.',
        originalSentence:
          'Critics frequently blame this divergence on administrative bloat or inefficiency in the service sector.',
        exampleSentence: 'There was a sharp divergence between urban and rural prices.',
      },
    ],
    questions: [
      {
        id: 'diag-c1-3-q1',
        type: 'multiple_choice',
        prompt: 'What common explanation for rising healthcare and education costs do Baumol and Bowen challenge?',
        options: [
          'That rising costs are primarily caused by administrative waste or institutional inefficiency',
          'That manufactured goods have become too expensive for ordinary households',
          'That musicians and nurses work fewer hours per week than in 1960',
          'That automation has slowed down in the automobile industry',
        ],
        correctAnswer:
          'That rising costs are primarily caused by administrative waste or institutional inefficiency',
        explanation:
          'Paragraph 1 contrasts critics who blame administrative bloat or inefficiency with Baumol and Bowen’s thesis that rising service costs stem from manufacturing productivity growth.',
        passageEvidence:
          'Critics frequently blame this divergence on administrative bloat or inefficiency in the service sector. Yet in the 1960s, the economists William Baumol and William Bowen demonstrated that rising service costs are an inevitable mathematical consequence...',
        difficulty: 'core',
      },
      {
        id: 'diag-c1-3-q2',
        type: 'multiple_choice',
        prompt: 'Why do Baumol and Bowen use the example of a Beethoven string quartet?',
        options: [
          'To show an activity where human time is part of the product and cannot be cut without ruining quality',
          'To argue that classical music is less popular than modern cinema',
          'To prove that musical instruments have become cheaper to manufacture',
          'To demonstrate how orchestras can double their output per hour',
        ],
        correctAnswer:
          'To show an activity where human time is part of the product and cannot be cut without ruining quality',
        explanation:
          'Paragraph 2 explains that a quartet requires four musicians for forty minutes, and cutting labour time or players would destroy the product.',
        passageEvidence:
          'By contrast, a Beethoven quartet still requires four musicians playing for forty minutes; attempting to "increase productivity" by playing twice as fast or firing two violinists would destroy the product itself.',
        difficulty: 'core',
      },
      {
        id: 'diag-c1-3-q3',
        type: 'multiple_choice',
        prompt: 'Why must wages in schools and hospitals rise even when their output per hour stays the same?',
        options: [
          'Because they must compete for educated workers against sectors where rising productivity has pushed up wages',
          'Because government laws require service wages to double every decade',
          'Because teachers and nurses produce twice as many lessons and surgeries per hour',
          'Because manufacturing firms pay subsidies directly to orchestras',
        ],
        correctAnswer:
          'Because they must compete for educated workers against sectors where rising productivity has pushed up wages',
        explanation:
          'Paragraph 3 explains that service institutions compete in the same broader labour market as high-growth firms and must raise wages to attract and retain skilled staff.',
        passageEvidence:
          'To attract and retain skilled musicians, teachers, and nurses, service institutions must raise wages roughly in line with economy-wide income growth—even though their output per hour remains fixed.',
        difficulty: 'challenging',
      },
      {
        id: 'diag-c1-3-q4',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 1, what does the word "divergence" refer to?',
        options: [
          'The opposite price trends of cheaper manufactured goods and more expensive services',
          'The disagreement between William Baumol and William Bowen',
          'The gap between inflation in Europe and inflation in North America',
          'The difference between university tuition and hospital bills',
        ],
        correctAnswer:
          'The opposite price trends of cheaper manufactured goods and more expensive services',
        explanation:
          'Divergence refers to the split described in the first sentence: falling real prices of manufactured goods versus rising prices of services.',
        passageEvidence:
          'Critics frequently blame this divergence on administrative bloat or inefficiency in the service sector.',
        difficulty: 'core',
      },
      {
        id: 'diag-c1-3-q5',
        type: 'true_false_not_given',
        prompt: 'According to Paragraph 3, rising relative prices for services mean that society can no longer afford education and healthcare.',
        options: ['True', 'False', 'Not Given'],
        correctAnswer: 'False',
        explanation:
          'Paragraph 3 states that because society grows wealthier overall from manufacturing gains, consumers can afford to spend a larger share of income on these services despite their rising relative price.',
        passageEvidence:
          'Paradoxically, however, because society as a whole grows wealthier through manufacturing gains, consumers can afford to spend a larger share of their income on these human-intensive services despite their rising relative price.',
        difficulty: 'challenging',
      },
      {
        id: 'diag-c1-3-q6',
        type: 'multiple_choice',
        prompt: 'What is the central paradox of Baumol’s cost disease?',
        options: [
          'High productivity growth in one part of the economy drives up the relative cost of human-intensive services, while simultaneously making society rich enough to afford them.',
          'Automating factories makes manufactured goods more expensive than handmade items.',
          'Reducing the number of teachers in a school increases the cost per student.',
          'Technological progress lowers wages in both manufacturing and performing arts.',
        ],
        correctAnswer:
          'High productivity growth in one part of the economy drives up the relative cost of human-intensive services, while simultaneously making society rich enough to afford them.',
        explanation:
          'The passage demonstrates that manufacturing productivity raises economy-wide wages (making services relatively costlier) while also increasing total societal wealth.',
        passageEvidence:
          'Yet in the 1960s, the economists William Baumol and William Bowen demonstrated that rising service costs are an inevitable mathematical consequence of rapid productivity growth in manufacturing.',
        difficulty: 'challenging',
      },
    ],
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-01-10T00:00:00.000Z',
  },
];

export const DIAGNOSTIC_PASSAGES: ReadingLesson[] = RAW_DIAGNOSTIC_PASSAGES.map((passage) => ({
  ...passage,
  illustrationUrl: getEditorialIllustrationUri(passage.id, passage.topic, passage.level),
  illustrationAlt: getPassageIllustrationAlt(passage.id, passage.illustrationAlt),
}));

