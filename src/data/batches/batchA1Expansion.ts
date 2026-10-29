import { ReadingLesson } from '../../types/reading';
import { getEditorialIllustrationUri, getPassageIllustrationAlt } from '../../utils/illustrations';

const rawA1ExpansionLessons: Omit<ReadingLesson, 'illustrationUrl' | 'wordCount' | 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'a1-sci-rainwater-barrels',
    title: 'How Rooftop Rainwater Barrels Save Fresh Water',
    level: 'A1',
    topic: 'Science and technology',
    status: 'published',
    estimatedMinutes: 4,
    generationBatch: 'batch-expansion-a1',
    imageStatus: 'ready',
    introduction: 'Learn how simple plastic barrels beside houses collect rain from roofs so families can water their gardens for free.',
    illustrationAlt: 'Photograph of a rainwater collection barrel connected to a house roof gutter',
    passage: [
      'When rain falls on a house roof, the water usually runs down a metal pipe and disappears into the street drain. However, many families now place a large plastic barrel under the roof pipe to catch and save this clean rainwater for dry days.',
      'A rainwater barrel has a simple design. At the top, a fine mesh screen covers the opening so dry leaves and small insects cannot enter the tank. Near the bottom, a brass tap allows gardeners to fill a watering can or attach a rubber hose easily.',
      'During hot summer weeks, families use this stored water for vegetables, flowers, and fruit trees instead of turning on the kitchen tap. Because rainwater is free and soft, plants grow well and households pay much lower monthly water bills while protecting local rivers. In cold winter months, homeowners simply empty the barrel and clean the inside so the plastic tank does not freeze or crack. This easy habit keeps the rainwater system ready for the next rainy spring season.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'a1-exp-sci-1',
        word: 'disappears',
        partOfSpeech: 'verb',
        simpleDefinition: 'Goes out of sight so you cannot see or use it anymore.',
        contextMeaning: 'Flows away into underground street pipes where families cannot use it.',
        originalSentence: 'When rain falls on a house roof, the water usually runs down a metal pipe and disappears into the street drain.',
        exampleSentence: 'Snow disappears quickly when the warm spring sun shines.',
        synonyms: ['vanishes', 'goes away'],
        arabicTranslation: 'يختفي'
      },
      {
        id: 'a1-exp-sci-2',
        word: 'drain',
        partOfSpeech: 'noun',
        simpleDefinition: 'A pipe or opening in the street that carries rainwater away.',
        contextMeaning: 'The street opening where roof water goes if nobody catches it.',
        originalSentence: 'When rain falls on a house roof, the water usually runs down a metal pipe and disappears into the street drain.',
        exampleSentence: 'Heavy rain flowed down the street drain during the storm.',
        synonyms: ['pipe', 'channel'],
        arabicTranslation: 'مصرف مياه'
      },
      {
        id: 'a1-exp-sci-3',
        word: 'barrel',
        partOfSpeech: 'noun',
        simpleDefinition: 'A tall round container with flat ends used for holding liquids.',
        contextMeaning: 'The large round plastic tank placed beside the house to store rainwater.',
        originalSentence: 'However, many families now place a large plastic barrel under the roof pipe to catch and save this clean rainwater for dry days.',
        exampleSentence: 'The farmer kept fresh rainwater in a blue barrel near the barn.',
        synonyms: ['drum', 'tank', 'container'],
        arabicTranslation: 'برميل'
      },
      {
        id: 'a1-exp-sci-4',
        word: 'mesh',
        partOfSpeech: 'noun',
        simpleDefinition: 'Material made of thin wires or threads with tiny spaces like a net.',
        contextMeaning: 'A net-like cover that lets water pass through while blocking leaves and bugs.',
        originalSentence: 'At the top, a fine mesh screen covers the opening so dry leaves and small insects cannot enter the tank.',
        exampleSentence: 'A wire mesh window keeps mosquitoes outside the bedroom.',
        synonyms: ['netting', 'screen'],
        arabicTranslation: 'شبكة دقيقة'
      },
      {
        id: 'a1-exp-sci-5',
        word: 'insects',
        partOfSpeech: 'noun',
        simpleDefinition: 'Very small creatures with six legs, such as ants, flies, or mosquitoes.',
        contextMeaning: 'Tiny bugs that could dirty the water if the barrel had no screen.',
        originalSentence: 'At the top, a fine mesh screen covers the opening so dry leaves and small insects cannot enter the tank.',
        exampleSentence: 'Birds eat many small insects in the garden every morning.',
        synonyms: ['bugs'],
        arabicTranslation: 'حشرات'
      },
      {
        id: 'a1-exp-sci-6',
        word: 'attach',
        partOfSpeech: 'verb',
        simpleDefinition: 'To join or fasten one thing to another thing.',
        contextMeaning: 'To connect a garden hose to the tap at the bottom of the barrel.',
        originalSentence: 'Near the bottom, a brass tap allows gardeners to fill a watering can or attach a rubber hose easily.',
        exampleSentence: 'Please attach a name tag to your school bag.',
        synonyms: ['connect', 'fasten', 'join'],
        arabicTranslation: 'يربط / يوصل'
      },
      {
        id: 'a1-exp-sci-7',
        word: 'stored',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Kept in a container or safe place so it can be used later.',
        contextMeaning: 'Saved inside the barrel from earlier rainy days.',
        originalSentence: 'During hot summer weeks, families use this stored water for vegetables, flowers, and fruit trees instead of turning on the kitchen tap.',
        exampleSentence: 'Squirrels eat their stored nuts during the cold winter months.',
        synonyms: ['saved', 'kept'],
        arabicTranslation: 'مخزّن'
      },
      {
        id: 'a1-exp-sci-8',
        word: 'households',
        partOfSpeech: 'noun',
        simpleDefinition: 'All the people who live together in one house or home.',
        contextMeaning: 'Families living in homes that collect rainwater.',
        originalSentence: 'Because rainwater is free and soft, plants grow well and households pay much lower monthly water bills while protecting local rivers.',
        exampleSentence: 'Most households in our town recycle glass bottles and paper.',
        synonyms: ['families', 'homes'],
        arabicTranslation: 'الأسر / المنازل'
      }
    ],
    questions: [
      {
        id: 'a1-exp-sci-q1',
        type: 'true_false_not_given',
        prompt: 'Without a barrel, rainwater from a roof usually flows into the street drain.',
        correctAnswer: 'True',
        explanation: 'Paragraph 1 states that when rain falls on a house roof, the water usually runs down a metal pipe and disappears into the street drain.',
        passageEvidence: 'When rain falls on a house roof, the water usually runs down a metal pipe and disappears into the street drain.'
      },
      {
        id: 'a1-exp-sci-q2',
        type: 'true_false_not_given',
        prompt: 'The mesh screen is placed near the bottom of the rainwater barrel.',
        correctAnswer: 'False',
        explanation: 'Paragraph 2 states that the fine mesh screen is at the top of the barrel, while the brass tap is near the bottom.',
        passageEvidence: 'At the top, a fine mesh screen covers the opening so dry leaves and small insects cannot enter the tank.'
      },
      {
        id: 'a1-exp-sci-q3',
        type: 'true_false_not_given',
        prompt: 'Every rainwater barrel holds exactly two hundred litres of water.',
        correctAnswer: 'Not Given',
        explanation: 'The passage describes a large plastic barrel, but it never states how many litres the barrel holds.',
        passageEvidence: 'However, many families now place a large plastic barrel under the roof pipe to catch and save this clean rainwater for dry days.'
      },
      {
        id: 'a1-exp-sci-q4',
        type: 'multiple_choice',
        prompt: 'Why is there a fine mesh screen at the top of the barrel?',
        options: [
          'To stop dry leaves and small insects from getting inside the tank',
          'To heat the rainwater during cold winter nights',
          'To paint the roof pipe a bright colour',
          'To pump water back up onto the house roof'
        ],
        correctAnswer: 'To stop dry leaves and small insects from getting inside the tank',
        explanation: 'Paragraph 2 explains that a fine mesh screen covers the opening so dry leaves and small insects cannot enter the tank.',
        passageEvidence: 'At the top, a fine mesh screen covers the opening so dry leaves and small insects cannot enter the tank.'
      },
      {
        id: 'a1-exp-sci-q5',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 2: Near the bottom, a brass ______ allows gardeners to fill a watering can.',
        correctAnswer: 'tap',
        acceptedAnswers: ['tap'],
        explanation: 'Paragraph 2 states that near the bottom, a brass tap allows gardeners to fill a watering can.',
        passageEvidence: 'Near the bottom, a brass tap allows gardeners to fill a watering can or attach a rubber hose easily.'
      },
      {
        id: 'a1-exp-sci-q6',
        type: 'vocabulary_in_context',
        prompt: 'What does the word "stored" mean in Paragraph 3?',
        options: [
          'Kept inside a container to be used later',
          'Boiled on a hot kitchen stove',
          'Frozen into solid blocks of ice',
          'Sold in small glass bottles at a shop'
        ],
        correctAnswer: 'Kept inside a container to be used later',
        explanation: 'In Paragraph 3, "stored water" refers to the rainwater saved inside the barrel for use during hot summer weeks.',
        passageEvidence: 'During hot summer weeks, families use this stored water for vegetables, flowers, and fruit trees instead of turning on the kitchen tap.'
      },
      {
        id: 'a1-exp-sci-q7',
        type: 'short_answer',
        prompt: 'Answer with ONE OR TWO WORDS from Paragraph 2: What can gardeners attach to the brass tap besides filling a watering can?',
        correctAnswer: 'rubber hose',
        acceptedAnswers: ['rubber hose', 'hose', 'a rubber hose'],
        explanation: 'Paragraph 2 says gardeners can fill a watering can or attach a rubber hose easily.',
        passageEvidence: 'Near the bottom, a brass tap allows gardeners to fill a watering can or attach a rubber hose easily.'
      },
      {
        id: 'a1-exp-sci-q8',
        type: 'matching_information',
        prompt: 'Which paragraph explains how saving rainwater helps families lower their monthly bills?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3'],
        correctAnswer: 'Paragraph 3',
        explanation: 'Paragraph 3 explains that households pay much lower monthly water bills when they use free rainwater.',
        passageEvidence: 'Because rainwater is free and soft, plants grow well and households pay much lower monthly water bills while protecting local rivers.'
      },
      {
        id: 'a1-exp-sci-q9',
        type: 'note_completion',
        prompt: 'Complete the study note with ONE WORD from Paragraph 1: Families place a large plastic barrel under the roof ______ to catch clean rainwater.',
        correctAnswer: 'pipe',
        acceptedAnswers: ['pipe'],
        explanation: 'Paragraph 1 states that families place a large plastic barrel under the roof pipe.',
        passageEvidence: 'However, many families now place a large plastic barrel under the roof pipe to catch and save this clean rainwater for dry days.'
      },
      {
        id: 'a1-exp-sci-q10',
        type: 'multiple_choice',
        prompt: 'When is stored rainwater especially useful for families?',
        options: [
          'During hot summer weeks when gardens need water',
          'Only during heavy winter snowstorms',
          'When washing dishes inside a dishwasher',
          'When repairing metal pipes on the street'
        ],
        correctAnswer: 'During hot summer weeks when gardens need water',
        explanation: 'Paragraph 3 states that during hot summer weeks, families use this stored water for vegetables, flowers, and fruit trees.',
        passageEvidence: 'During hot summer weeks, families use this stored water for vegetables, flowers, and fruit trees instead of turning on the kitchen tap.'
      }
    ]
  },
  {
    id: 'a1-env-urban-tree-planting',
    title: 'Why Neighborhoods Plant Trees Along Busy Streets',
    level: 'A1',
    topic: 'Environmental science',
    status: 'published',
    estimatedMinutes: 4,
    generationBatch: 'batch-expansion-a1',
    imageStatus: 'ready',
    introduction: 'Discover how rows of street trees cool down hot city pavements, clean the air, and make daily walks more pleasant.',
    illustrationAlt: 'Photograph of green deciduous trees planted along a sunny city sidewalk',
    passage: [
      'In many large cities, wide roads and concrete pavements get very hot under the summer sun. Walking to school or the bus stop can feel uncomfortable when there is no shade. To solve this problem, city workers and volunteers plant young trees along busy sidewalks.',
      'Street trees help a neighborhood in several important ways. First, their wide green leaves block direct sunlight and keep the pavement much cooler for walkers. Second, tree leaves trap tiny dust particles from passing cars and release fresh oxygen into the air.',
      'Trees also help during heavy rainstorms because their deep roots drink water from the soil and reduce street puddles. In addition, green branches give city birds a quiet place to build nests and rest. Planting trees makes every street cleaner, cooler, and more welcoming. Local schools and helpful neighbors often adopt a young tree outside their homes and give it two full buckets of clean water every dry week so its roots grow deep, strong, and healthy.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'a1-exp-env-1',
        word: 'pavements',
        partOfSpeech: 'noun',
        simpleDefinition: 'Hard paths beside a road where people walk.',
        contextMeaning: 'Concrete city walkways that become hot when the sun shines directly on them.',
        originalSentence: 'In many large cities, wide roads and concrete pavements get very hot under the summer sun.',
        exampleSentence: 'People walked carefully on the wet pavements after the rain.',
        synonyms: ['sidewalks', 'footpaths'],
        arabicTranslation: 'أرصفة المشاة'
      },
      {
        id: 'a1-exp-env-2',
        word: 'shade',
        partOfSpeech: 'noun',
        simpleDefinition: 'A cool dark area where something blocks direct sunlight.',
        contextMeaning: 'Cool cover under tree branches that protects walkers from hot sun.',
        originalSentence: 'Walking to school or the bus stop can feel uncomfortable when there is no shade.',
        exampleSentence: 'We sat in the shade of a big oak tree to eat lunch.',
        synonyms: ['shadow', 'shelter'],
        arabicTranslation: 'ظل'
      },
      {
        id: 'a1-exp-env-3',
        word: 'volunteers',
        partOfSpeech: 'noun',
        simpleDefinition: 'People who work to help others or the community without being paid.',
        contextMeaning: 'Helpful neighbors who join city workers to plant young trees.',
        originalSentence: 'To solve this problem, city workers and volunteers plant young trees along busy sidewalks.',
        exampleSentence: 'Ten volunteers cleaned the park on Saturday morning.',
        synonyms: ['helpers'],
        arabicTranslation: 'متطوعون'
      },
      {
        id: 'a1-exp-env-4',
        word: 'direct',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Going straight from one place to another without anything in between.',
        contextMeaning: 'Sunlight shining straight down onto the street with nothing blocking it.',
        originalSentence: 'First, their wide green leaves block direct sunlight and keep the pavement much cooler for walkers.',
        exampleSentence: 'Keep chocolate away from direct sunlight so it does not melt.',
        synonyms: ['straight', 'unblocked'],
        arabicTranslation: 'مباشر'
      },
      {
        id: 'a1-exp-env-5',
        word: 'trap',
        partOfSpeech: 'verb',
        simpleDefinition: 'To catch and hold something so it cannot escape.',
        contextMeaning: 'To catch tiny bits of street dust on the surface of leaves.',
        originalSentence: 'Second, tree leaves trap tiny dust particles from passing cars and release fresh oxygen into the air.',
        exampleSentence: 'Thick carpets can trap dust and dirt from shoes.',
        synonyms: ['catch', 'hold', 'capture'],
        arabicTranslation: 'يحبس / يلتقط'
      },
      {
        id: 'a1-exp-env-6',
        word: 'release',
        partOfSpeech: 'verb',
        simpleDefinition: 'To let something go out into the air or space around it.',
        contextMeaning: 'To send clean oxygen out from the leaves into the street air.',
        originalSentence: 'Second, tree leaves trap tiny dust particles from passing cars and release fresh oxygen into the air.',
        exampleSentence: 'Flowers release a sweet smell in the evening.',
        synonyms: ['give off', 'let out'],
        arabicTranslation: 'يطلق'
      },
      {
        id: 'a1-exp-env-7',
        word: 'puddles',
        partOfSpeech: 'noun',
        simpleDefinition: 'Small pools of rainwater on the ground.',
        contextMeaning: 'Pools of water left on sidewalks and roads after heavy rain.',
        originalSentence: 'Trees also help during heavy rainstorms because their deep roots drink water from the soil and reduce street puddles.',
        exampleSentence: 'Children wore rubber boots to jump over the puddles.',
        synonyms: ['pools'],
        arabicTranslation: 'برك ماء صغيرة'
      },
      {
        id: 'a1-exp-env-8',
        word: 'welcoming',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Pleasant and friendly, making people feel comfortable to be there.',
        contextMeaning: 'Nice and comfortable for neighbors who walk along the street.',
        originalSentence: 'Planting trees makes every street cleaner, cooler, and more welcoming.',
        exampleSentence: 'Warm lights made the small library look very welcoming.',
        synonyms: ['inviting', 'pleasant'],
        arabicTranslation: 'مرحب / مريح'
      }
    ],
    questions: [
      {
        id: 'a1-exp-env-q1',
        type: 'true_false_not_given',
        prompt: 'Concrete pavements in large cities can become very hot under the summer sun.',
        correctAnswer: 'True',
        explanation: 'Paragraph 1 states that wide roads and concrete pavements get very hot under the summer sun.',
        passageEvidence: 'In many large cities, wide roads and concrete pavements get very hot under the summer sun.'
      },
      {
        id: 'a1-exp-env-q2',
        type: 'true_false_not_given',
        prompt: 'Tree leaves put more car dust into the air.',
        correctAnswer: 'False',
        explanation: 'Paragraph 2 explains that tree leaves trap tiny dust particles from passing cars and release fresh oxygen.',
        passageEvidence: 'Second, tree leaves trap tiny dust particles from passing cars and release fresh oxygen into the air.'
      },
      {
        id: 'a1-exp-env-q3',
        type: 'true_false_not_given',
        prompt: 'Apple trees are the most popular trees for city sidewalks.',
        correctAnswer: 'Not Given',
        explanation: 'The passage talks about planting young street trees, but it never mentions apple trees or which tree species is most popular.',
        passageEvidence: 'To solve this problem, city workers and volunteers plant young trees along busy sidewalks.'
      },
      {
        id: 'a1-exp-env-q4',
        type: 'multiple_choice',
        prompt: 'How do street trees make sidewalks cooler for walkers?',
        options: [
          'Their wide green leaves block direct sunlight',
          'They blow cold wind from underground pipes',
          'They cover the road with white snow in summer',
          'They stop all buses from driving down the street'
        ],
        correctAnswer: 'Their wide green leaves block direct sunlight',
        explanation: 'Paragraph 2 states that their wide green leaves block direct sunlight and keep the pavement much cooler for walkers.',
        passageEvidence: 'First, their wide green leaves block direct sunlight and keep the pavement much cooler for walkers.'
      },
      {
        id: 'a1-exp-env-q5',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 2: Tree leaves trap tiny dust particles and release fresh ______ into the air.',
        correctAnswer: 'oxygen',
        acceptedAnswers: ['oxygen'],
        explanation: 'Paragraph 2 states that tree leaves release fresh oxygen into the air.',
        passageEvidence: 'Second, tree leaves trap tiny dust particles from passing cars and release fresh oxygen into the air.'
      },
      {
        id: 'a1-exp-env-q6',
        type: 'vocabulary_in_context',
        prompt: 'What does the word "volunteers" mean in Paragraph 1?',
        options: [
          'People who help plant trees without being paid',
          'Machines that dig holes in concrete roads',
          'Drivers who park their cars under tall trees',
          'Shopkeepers who sell garden tools and seeds'
        ],
        correctAnswer: 'People who help plant trees without being paid',
        explanation: 'Volunteers are community members who help city workers plant trees without payment.',
        passageEvidence: 'To solve this problem, city workers and volunteers plant young trees along busy sidewalks.'
      },
      {
        id: 'a1-exp-env-q7',
        type: 'short_answer',
        prompt: 'Answer with ONE OR TWO WORDS from Paragraph 3: Which part of a tree drinks water from the soil during rainstorms?',
        correctAnswer: 'deep roots',
        acceptedAnswers: ['deep roots', 'roots', 'their deep roots'],
        explanation: 'Paragraph 3 states that their deep roots drink water from the soil and reduce street puddles.',
        passageEvidence: 'Trees also help during heavy rainstorms because their deep roots drink water from the soil and reduce street puddles.'
      },
      {
        id: 'a1-exp-env-q8',
        type: 'matching_information',
        prompt: 'Which paragraph mentions how street trees help city birds?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3'],
        correctAnswer: 'Paragraph 3',
        explanation: 'Paragraph 3 mentions that green branches give city birds a quiet place to build nests and rest.',
        passageEvidence: 'In addition, green branches give city birds a quiet place to build nests and rest.'
      },
      {
        id: 'a1-exp-env-q9',
        type: 'note_completion',
        prompt: 'Complete the study note with ONE WORD from Paragraph 3: Green branches give city birds a quiet place to build ______ and rest.',
        correctAnswer: 'nests',
        acceptedAnswers: ['nests'],
        explanation: 'Paragraph 3 states that green branches give city birds a quiet place to build nests and rest.',
        passageEvidence: 'In addition, green branches give city birds a quiet place to build nests and rest.'
      },
      {
        id: 'a1-exp-env-q10',
        type: 'multiple_choice',
        prompt: 'What is the main idea of the passage?',
        options: [
          'Planting street trees cools sidewalks, cleans the air, absorbs rain, and helps birds',
          'City pavements should be painted black to absorb more summer heat',
          'Walking to the bus stop is only safe during the winter months',
          'Trees should only be planted in distant mountain forests'
        ],
        correctAnswer: 'Planting street trees cools sidewalks, cleans the air, absorbs rain, and helps birds',
        explanation: 'The passage explains the main benefits of planting street trees: cooling pavements, trapping dust, absorbing rainwater, and providing shelter for birds.',
        passageEvidence: 'Planting trees makes every street cleaner, cooler, and more welcoming.'
      }
    ]
  },
  {
    id: 'a1-psy-taking-short-breaks',
    title: 'Why Short Study Breaks Help Students Focus',
    level: 'A1',
    topic: 'Psychology and human behaviour',
    status: 'published',
    estimatedMinutes: 4,
    generationBatch: 'batch-expansion-a1',
    imageStatus: 'ready',
    introduction: 'See why pausing for five minutes of rest helps your brain remember more than studying for hours without stopping.',
    illustrationAlt: 'Photograph of a student desk with an open notebook, pencil, and a glass of water',
    passage: [
      'Many students believe that sitting at a desk for three hours without stopping is the best way to study. However, brain scientists say that our attention slowly drops after about thirty minutes of hard reading. When the brain gets tired, we read the same sentence many times without understanding it.',
      'Taking a short five-minute break every half hour solves this problem. During a good break, students stand up, stretch their arms, drink a glass of water, or look out the window at distant trees. These calm actions let the working part of the brain rest and recover.',
      'However, scientists warn that checking loud videos or social media on a phone is not a restful break. Bright phone screens give the brain too much new information at once. A quiet walk across the room refreshes the mind so students return to their books with clear focus. Setting a simple kitchen timer on the desk helps learners remember when to rest and when to begin studying again without losing track of the afternoon.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'a1-exp-psy-1',
        word: 'attention',
        partOfSpeech: 'noun',
        simpleDefinition: 'The ability to keep your mind carefully on what you are doing.',
        contextMeaning: 'A student’s ability to focus on reading a textbook.',
        originalSentence: 'However, brain scientists say that our attention slowly drops after about thirty minutes of hard reading.',
        exampleSentence: 'The teacher asked the class for their full attention.',
        synonyms: ['focus', 'concentration'],
        arabicTranslation: 'انتباه / تركيز'
      },
      {
        id: 'a1-exp-psy-2',
        word: 'understanding',
        partOfSpeech: 'verb',
        simpleDefinition: 'Knowing the meaning of words or ideas.',
        contextMeaning: 'Making sense of what a sentence in a book says.',
        originalSentence: 'When the brain gets tired, we read the same sentence many times without understanding it.',
        exampleSentence: 'Reading slowly helps with understanding new science ideas.',
        synonyms: ['grasping', 'knowing'],
        arabicTranslation: 'فهم'
      },
      {
        id: 'a1-exp-psy-3',
        word: 'stretch',
        partOfSpeech: 'verb',
        simpleDefinition: 'To push out your arms, legs, or body to full length to relax tight muscles.',
        contextMeaning: 'To reach out your arms after sitting still at a desk.',
        originalSentence: 'During a good break, students stand up, stretch their arms, drink a glass of water, or look out the window at distant trees.',
        exampleSentence: 'Cats always stretch their legs after waking up from a nap.',
        synonyms: ['extend', 'reach'],
        arabicTranslation: 'يتمدد'
      },
      {
        id: 'a1-exp-psy-4',
        word: 'distant',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Far away in space.',
        contextMeaning: 'Outside and far from the desk, which helps relax tired eyes.',
        originalSentence: 'During a good break, students stand up, stretch their arms, drink a glass of water, or look out the window at distant trees.',
        exampleSentence: 'We could see distant hills from the classroom window.',
        synonyms: ['faraway', 'remote'],
        arabicTranslation: 'بعيد'
      },
      {
        id: 'a1-exp-psy-5',
        word: 'recover',
        partOfSpeech: 'verb',
        simpleDefinition: 'To get back your energy or strength after working or feeling tired.',
        contextMeaning: 'To become fresh and ready to learn again after a short rest.',
        originalSentence: 'These calm actions let the working part of the brain rest and recover.',
        exampleSentence: 'Runners drink water to help their muscles recover after a race.',
        synonyms: ['rest', 'regain strength'],
        arabicTranslation: 'يتعافى / يستعيد نشاطه'
      },
      {
        id: 'a1-exp-psy-6',
        word: 'warn',
        partOfSpeech: 'verb',
        simpleDefinition: 'To tell someone about a problem or mistake so they can avoid it.',
        contextMeaning: 'To advise students not to use phones during their study breaks.',
        originalSentence: 'However, scientists warn that checking loud videos or social media on a phone is not a restful break.',
        exampleSentence: 'Doctors warn people not to look directly at the bright sun.',
        synonyms: ['advise', 'caution'],
        arabicTranslation: 'يحذر'
      },
      {
        id: 'a1-exp-psy-7',
        word: 'restful',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Calm and quiet, helping your body or mind relax.',
        contextMeaning: 'Giving the brain true peace and relaxation during a pause.',
        originalSentence: 'However, scientists warn that checking loud videos or social media on a phone is not a restful break.',
        exampleSentence: 'We spent a restful Sunday afternoon in the quiet garden.',
        synonyms: ['calming', 'relaxing', 'peaceful'],
        arabicTranslation: 'مريح'
      },
      {
        id: 'a1-exp-psy-8',
        word: 'refreshes',
        partOfSpeech: 'verb',
        simpleDefinition: 'Makes someone feel less tired and more energetic again.',
        contextMeaning: 'Wakes up a tired mind so studying becomes easy again.',
        originalSentence: 'A quiet walk across the room refreshes the mind so students return to their books with clear focus.',
        exampleSentence: 'A cool glass of water refreshes you on a hot afternoon.',
        synonyms: ['energizes', 'revives'],
        arabicTranslation: 'ينعش'
      }
    ],
    questions: [
      {
        id: 'a1-exp-psy-q1',
        type: 'true_false_not_given',
        prompt: 'Brain scientists say that human attention starts to drop after about thirty minutes of hard reading.',
        correctAnswer: 'True',
        explanation: 'Paragraph 1 states that brain scientists say our attention slowly drops after about thirty minutes of hard reading.',
        passageEvidence: 'However, brain scientists say that our attention slowly drops after about thirty minutes of hard reading.'
      },
      {
        id: 'a1-exp-psy-q2',
        type: 'true_false_not_given',
        prompt: 'Watching loud videos on a phone is the best way to rest the brain during a study break.',
        correctAnswer: 'False',
        explanation: 'Paragraph 3 states that checking loud videos or social media on a phone is not a restful break because it gives the brain too much new information at once.',
        passageEvidence: 'However, scientists warn that checking loud videos or social media on a phone is not a restful break.'
      },
      {
        id: 'a1-exp-psy-q3',
        type: 'true_false_not_given',
        prompt: 'Students who study in the morning get higher test scores than students who study at night.',
        correctAnswer: 'Not Given',
        explanation: 'The passage discusses study breaks, but it never compares morning and night test scores.',
        passageEvidence: 'Many students believe that sitting at a desk for three hours without stopping is the best way to study.'
      },
      {
        id: 'a1-exp-psy-q4',
        type: 'multiple_choice',
        prompt: 'What happens when a student’s brain becomes tired from reading without a break?',
        options: [
          'The student reads the same sentence many times without understanding it',
          'The student finishes the whole book in ten minutes',
          'The student remembers every word on the page easily',
          'The student’s handwriting becomes much larger'
        ],
        correctAnswer: 'The student reads the same sentence many times without understanding it',
        explanation: 'Paragraph 1 explains that when the brain gets tired, we read the same sentence many times without understanding it.',
        passageEvidence: 'When the brain gets tired, we read the same sentence many times without understanding it.'
      },
      {
        id: 'a1-exp-psy-q5',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 2: Taking a short five-minute ______ every half hour solves this problem.',
        correctAnswer: 'break',
        acceptedAnswers: ['break'],
        explanation: 'Paragraph 2 states that taking a short five-minute break every half hour solves this problem.',
        passageEvidence: 'Taking a short five-minute break every half hour solves this problem.'
      },
      {
        id: 'a1-exp-psy-q6',
        type: 'vocabulary_in_context',
        prompt: 'What does the word "recover" mean in Paragraph 2?',
        options: [
          'Get back energy after working',
          'Put a paper cover on a schoolbook',
          'Forget everything from the lesson',
          'Write a long story with a pen'
        ],
        correctAnswer: 'Get back energy after working',
        explanation: 'In Paragraph 2, "rest and recover" means letting the brain regain its energy after hard reading.',
        passageEvidence: 'These calm actions let the working part of the brain rest and recover.'
      },
      {
        id: 'a1-exp-psy-q7',
        type: 'short_answer',
        prompt: 'Answer with ONE OR TWO WORDS from Paragraph 2: What can students drink during a good study break?',
        correctAnswer: 'water',
        acceptedAnswers: ['water', 'a glass of water', 'glass of water'],
        explanation: 'Paragraph 2 mentions that students can drink a glass of water during a good break.',
        passageEvidence: 'During a good break, students stand up, stretch their arms, drink a glass of water, or look out the window at distant trees.'
      },
      {
        id: 'a1-exp-psy-q8',
        type: 'matching_information',
        prompt: 'Which paragraph explains why using a smartphone during a break is unhelpful?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3'],
        correctAnswer: 'Paragraph 3',
        explanation: 'Paragraph 3 explains that bright phone screens and social media give the brain too much new information at once.',
        passageEvidence: 'Bright phone screens give the brain too much new information at once.'
      },
      {
        id: 'a1-exp-psy-q9',
        type: 'note_completion',
        prompt: 'Complete the study note with ONE WORD from Paragraph 3: A quiet walk across the room refreshes the mind so students return to their books with clear ______.',
        correctAnswer: 'focus',
        acceptedAnswers: ['focus'],
        explanation: 'Paragraph 3 ends with the phrase "return to their books with clear focus."',
        passageEvidence: 'A quiet walk across the room refreshes the mind so students return to their books with clear focus.'
      },
      {
        id: 'a1-exp-psy-q10',
        type: 'multiple_choice',
        prompt: 'Which activity is recommended for a calm five-minute study break?',
        options: [
          'Standing up to stretch and looking out the window at distant trees',
          'Watching loud videos on social media',
          'Sitting at the desk for three hours without moving',
          'Playing a fast computer game on a bright screen'
        ],
        correctAnswer: 'Standing up to stretch and looking out the window at distant trees',
        explanation: 'Paragraph 2 recommends standing up, stretching, drinking water, or looking out the window at distant trees.',
        passageEvidence: 'During a good break, students stand up, stretch their arms, drink a glass of water, or look out the window at distant trees.'
      }
    ]
  },
  {
    id: 'a1-his-ancient-sundials',
    title: 'How Ancient Sundials Used Shadows to Tell Time',
    level: 'A1',
    topic: 'History and archaeology',
    status: 'published',
    estimatedMinutes: 4,
    generationBatch: 'batch-expansion-a1',
    imageStatus: 'ready',
    introduction: 'Explore how people in ancient Egypt and Greece measured the hours of the day by watching a shadow move across a stone circle.',
    illustrationAlt: 'Photograph of an ancient stone sundial casting a sharp triangular shadow in sunlight',
    passage: [
      'Long before people invented mechanical clocks or digital watches, ancient communities needed a reliable way to know the time of day. More than three thousand years ago, builders in Egypt and Greece created a clever tool called the sundial to measure daylight hours.',
      'A classic sundial has two simple parts: a flat round stone plate with carved numbers and a thin metal pointer in the center. The sun shines on the pointer and makes a dark shadow on the stone plate. As the sun moves across the sky from east to west, the shadow slowly moves from one number to the next.',
      'Townspeople placed sundials in sunny public squares and gardens so everyone could check the hour for markets, work, or meals. Although a sundial could not work at night or on cloudy days, it remained the world’s main timekeeper for many centuries. Today, visitors can still see many of these carved stone dials in historic parks and museum courtyards, where they still show the time whenever the sun shines brightly.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'a1-exp-his-1',
        word: 'invented',
        partOfSpeech: 'verb',
        simpleDefinition: 'Designed or made something new for the first time.',
        contextMeaning: 'Created clocks and watches for the first time in history.',
        originalSentence: 'Long before people invented mechanical clocks or digital watches, ancient communities needed a reliable way to know the time of day.',
        exampleSentence: 'Alexander Graham Bell invented the telephone.',
        synonyms: ['created', 'designed'],
        arabicTranslation: 'اخترع'
      },
      {
        id: 'a1-exp-his-2',
        word: 'reliable',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Working well every time so you can trust it.',
        contextMeaning: 'Dependable enough for people to plan their daily work and meals.',
        originalSentence: 'Long before people invented mechanical clocks or digital watches, ancient communities needed a reliable way to know the time of day.',
        exampleSentence: 'The city train is a reliable way to travel to work.',
        synonyms: ['dependable', 'trustworthy'],
        arabicTranslation: 'موثوق'
      },
      {
        id: 'a1-exp-his-3',
        word: 'carved',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Cut into stone or wood using a sharp tool.',
        contextMeaning: 'Hour numbers cut into the surface of the flat stone plate.',
        originalSentence: 'A classic sundial has two simple parts: a flat round stone plate with carved numbers and a thin metal pointer in the center.',
        exampleSentence: 'The old gate had carved wooden flowers on both sides.',
        synonyms: ['engraved', 'cut'],
        arabicTranslation: 'منحوت'
      },
      {
        id: 'a1-exp-his-4',
        word: 'pointer',
        partOfSpeech: 'noun',
        simpleDefinition: 'A thin stick or bar that points to a mark or number.',
        contextMeaning: 'The upright metal piece in the center of the sundial that makes a shadow.',
        originalSentence: 'A classic sundial has two simple parts: a flat round stone plate with carved numbers and a thin metal pointer in the center.',
        exampleSentence: 'The teacher used a wooden pointer to show countries on the map.',
        synonyms: ['rod', 'indicator'],
        arabicTranslation: 'مؤشر'
      },
      {
        id: 'a1-exp-his-5',
        word: 'shadow',
        partOfSpeech: 'noun',
        simpleDefinition: 'A dark shape made on a surface when an object blocks light.',
        contextMeaning: 'The dark line cast by the metal pointer onto the stone dial.',
        originalSentence: 'The sun shines on the pointer and makes a dark shadow on the stone plate.',
        exampleSentence: 'The tall tree made a long shadow across the grass.',
        synonyms: ['shade', 'silhouette'],
        arabicTranslation: 'ظل'
      },
      {
        id: 'a1-exp-his-6',
        word: 'squares',
        partOfSpeech: 'noun',
        simpleDefinition: 'Open public areas in the center of a town, usually surrounded by buildings.',
        contextMeaning: 'Open town spaces where everyone could see the sundial.',
        originalSentence: 'Townspeople placed sundials in sunny public squares and gardens so everyone could check the hour for markets, work, or meals.',
        exampleSentence: 'Musicians played songs in the town squares on festival days.',
        synonyms: ['plazas', 'courtyards'],
        arabicTranslation: 'ساحات عامة'
      },
      {
        id: 'a1-exp-his-7',
        word: 'timekeeper',
        partOfSpeech: 'noun',
        simpleDefinition: 'A tool or device that measures and shows the time.',
        contextMeaning: 'The main instrument people used to tell the hour of the day.',
        originalSentence: 'Although a sundial could not work at night or on cloudy days, it remained the world’s main timekeeper for many centuries.',
        exampleSentence: 'Before watches existed, the town bell was the main timekeeper.',
        synonyms: ['clock', 'timer'],
        arabicTranslation: 'أداة قياس الوقت'
      },
      {
        id: 'a1-exp-his-8',
        word: 'centuries',
        partOfSpeech: 'noun',
        simpleDefinition: 'Periods of one hundred years.',
        contextMeaning: 'Hundreds of years during which people relied on sundials.',
        originalSentence: 'Although a sundial could not work at night or on cloudy days, it remained the world’s main timekeeper for many centuries.',
        exampleSentence: 'This stone castle has stood on the hill for five centuries.',
        synonyms: ['hundreds of years', 'ages'],
        arabicTranslation: 'قرون'
      }
    ],
    questions: [
      {
        id: 'a1-exp-his-q1',
        type: 'true_false_not_given',
        prompt: 'Builders in ancient Egypt and Greece used sundials more than three thousand years ago.',
        correctAnswer: 'True',
        explanation: 'Paragraph 1 states that more than three thousand years ago, builders in Egypt and Greece created the sundial.',
        passageEvidence: 'More than three thousand years ago, builders in Egypt and Greece created a clever tool called the sundial to measure daylight hours.'
      },
      {
        id: 'a1-exp-his-q2',
        type: 'true_false_not_given',
        prompt: 'A sundial works very well at night and on cloudy days.',
        correctAnswer: 'False',
        explanation: 'Paragraph 3 states that a sundial could not work at night or on cloudy days.',
        passageEvidence: 'Although a sundial could not work at night or on cloudy days, it remained the world’s main timekeeper for many centuries.'
      },
      {
        id: 'a1-exp-his-q3',
        type: 'true_false_not_given',
        prompt: 'Greek sundials were much larger than Egyptian sundials.',
        correctAnswer: 'Not Given',
        explanation: 'The passage mentions both Egypt and Greece, but it never compares the sizes of their sundials.',
        passageEvidence: 'More than three thousand years ago, builders in Egypt and Greece created a clever tool called the sundial to measure daylight hours.'
      },
      {
        id: 'a1-exp-his-q4',
        type: 'multiple_choice',
        prompt: 'What are the two main parts of a classic sundial?',
        options: [
          'A flat round stone plate with numbers and a thin metal pointer',
          'A glass bottle filled with sand and a wooden bell',
          'Two copper wires connected to a small battery',
          'A long paper calendar and a wax candle'
        ],
        correctAnswer: 'A flat round stone plate with numbers and a thin metal pointer',
        explanation: 'Paragraph 2 states that a classic sundial has two simple parts: a flat round stone plate with carved numbers and a thin metal pointer in the center.',
        passageEvidence: 'A classic sundial has two simple parts: a flat round stone plate with carved numbers and a thin metal pointer in the center.'
      },
      {
        id: 'a1-exp-his-q5',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 2: The sun shines on the pointer and makes a dark ______ on the stone plate.',
        correctAnswer: 'shadow',
        acceptedAnswers: ['shadow'],
        explanation: 'Paragraph 2 states that the sun shines on the pointer and makes a dark shadow on the stone plate.',
        passageEvidence: 'The sun shines on the pointer and makes a dark shadow on the stone plate.'
      },
      {
        id: 'a1-exp-his-q6',
        type: 'vocabulary_in_context',
        prompt: 'What does the word "centuries" mean in Paragraph 3?',
        options: [
          'Periods of one hundred years',
          'Minutes in a single morning',
          'Small villages near a river',
          'Sharp tools for cutting stone'
        ],
        correctAnswer: 'Periods of one hundred years',
        explanation: '"Centuries" means periods of one hundred years.',
        passageEvidence: 'Although a sundial could not work at night or on cloudy days, it remained the world’s main timekeeper for many centuries.'
      },
      {
        id: 'a1-exp-his-q7',
        type: 'short_answer',
        prompt: 'Answer with ONE WORD from Paragraph 2: In which direction does the sun move across the sky after rising in the east?',
        correctAnswer: 'west',
        acceptedAnswers: ['west', 'to the west'],
        explanation: 'Paragraph 2 states that the sun moves across the sky from east to west.',
        passageEvidence: 'As the sun moves across the sky from east to west, the shadow slowly moves from one number to the next.'
      },
      {
        id: 'a1-exp-his-q8',
        type: 'matching_information',
        prompt: 'Which paragraph mentions where townspeople placed sundials so everyone could see them?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3'],
        correctAnswer: 'Paragraph 3',
        explanation: 'Paragraph 3 explains that townspeople placed sundials in sunny public squares and gardens.',
        passageEvidence: 'Townspeople placed sundials in sunny public squares and gardens so everyone could check the hour for markets, work, or meals.'
      },
      {
        id: 'a1-exp-his-q9',
        type: 'note_completion',
        prompt: 'Complete the study note with ONE WORD from Paragraph 3: Townspeople placed sundials in sunny public squares and ______.',
        correctAnswer: 'gardens',
        acceptedAnswers: ['gardens'],
        explanation: 'Paragraph 3 states that townspeople placed sundials in sunny public squares and gardens.',
        passageEvidence: 'Townspeople placed sundials in sunny public squares and gardens so everyone could check the hour for markets, work, or meals.'
      },
      {
        id: 'a1-exp-his-q10',
        type: 'multiple_choice',
        prompt: 'Why did townspeople check the sundial during the day?',
        options: [
          'To know the hour for markets, work, or meals',
          'To predict when winter snow would arrive',
          'To measure how much rain fell during the night',
          'To light a fire in the town square'
        ],
        correctAnswer: 'To know the hour for markets, work, or meals',
        explanation: 'Paragraph 3 states that everyone could check the hour for markets, work, or meals.',
        passageEvidence: 'Townspeople placed sundials in sunny public squares and gardens so everyone could check the hour for markets, work, or meals.'
      }
    ]
  },
  {
    id: 'a1-edu-picture-flashcards',
    title: 'Learning New Words with Picture Flashcards',
    level: 'A1',
    topic: 'Education and learning',
    status: 'published',
    estimatedMinutes: 4,
    generationBatch: 'batch-expansion-a1',
    imageStatus: 'ready',
    introduction: 'Find out why drawing a simple picture on a study card helps language learners remember new words faster.',
    illustrationAlt: 'Photograph of handwritten language flashcards spread on a wooden study table',
    passage: [
      'When people start learning a new language, they must remember hundreds of everyday words for food, travel, and work. Reading a long list of words on a notebook page can feel boring, and learners often forget half the list by the next day.',
      'Teachers often suggest making paper flashcards with a simple drawing on one side and the new word on the back. When you look at a drawing of an apple or a bicycle, your brain connects the word directly to a clear visual image. Furthermore, drawing the picture yourself takes extra care, which makes the memory stronger.',
      'Learners can carry a small pack of twenty cards in a coat pocket and practice for five minutes on the bus. If they remember a word easily, they place that card in a finished box at home and spend more time practicing the difficult cards. Reviewing a few cards every morning with a classmate or friend makes vocabulary study feel like an enjoyable game and builds strong confidence for speaking in class.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'a1-exp-edu-1',
        word: 'everyday',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Used or happening regularly in normal daily life.',
        contextMeaning: 'Common words that people use all the time when speaking.',
        originalSentence: 'When people start learning a new language, they must remember hundreds of everyday words for food, travel, and work.',
        exampleSentence: 'Walking to the bakery is part of my everyday morning routine.',
        synonyms: ['common', 'daily', 'ordinary'],
        arabicTranslation: 'يومي / شائع'
      },
      {
        id: 'a1-exp-edu-2',
        word: 'boring',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Not interesting or exciting.',
        contextMeaning: 'Dull and tiring when staring at a plain list of words.',
        originalSentence: 'Reading a long list of words on a notebook page can feel boring, and learners often forget half the list by the next day.',
        exampleSentence: 'The movie was so boring that I fell asleep.',
        synonyms: ['dull', 'uninteresting'],
        arabicTranslation: 'ممل'
      },
      {
        id: 'a1-exp-edu-3',
        word: 'suggest',
        partOfSpeech: 'verb',
        simpleDefinition: 'To offer a helpful idea or plan for someone to try.',
        contextMeaning: 'To recommend using picture flashcards as a study method.',
        originalSentence: 'Teachers often suggest making paper flashcards with a simple drawing on one side and the new word on the back.',
        exampleSentence: 'I suggest bringing an umbrella because the sky looks dark.',
        synonyms: ['recommend', 'advise'],
        arabicTranslation: 'يقترح'
      },
      {
        id: 'a1-exp-edu-4',
        word: 'connects',
        partOfSpeech: 'verb',
        simpleDefinition: 'Joins two things or ideas together in your mind.',
        contextMeaning: 'Links the sound and spelling of a new word to a picture.',
        originalSentence: 'When you look at a drawing of an apple or a bicycle, your brain connects the word directly to a clear visual image.',
        exampleSentence: 'A stone bridge connects the small island to the town.',
        synonyms: ['links', 'joins'],
        arabicTranslation: 'يربط'
      },
      {
        id: 'a1-exp-edu-5',
        word: 'visual',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Related to seeing or pictures.',
        contextMeaning: 'Something you can see with your eyes, such as a drawing on a card.',
        originalSentence: 'When you look at a drawing of an apple or a bicycle, your brain connects the word directly to a clear visual image.',
        exampleSentence: 'Maps and charts are helpful visual tools in geography class.',
        synonyms: ['pictured', 'seen'],
        arabicTranslation: 'بصري / مرئي'
      },
      {
        id: 'a1-exp-edu-6',
        word: 'pack',
        partOfSpeech: 'noun',
        simpleDefinition: 'A small group of cards or items held together.',
        contextMeaning: 'A stack of twenty paper flashcards carried in a pocket.',
        originalSentence: 'Learners can carry a small pack of twenty cards in a coat pocket and practice for five minutes on the bus.',
        exampleSentence: 'He bought a new pack of playing cards for the train trip.',
        synonyms: ['set', 'stack', 'bundle'],
        arabicTranslation: 'مجموعة / رزمة'
      },
      {
        id: 'a1-exp-edu-7',
        word: 'pocket',
        partOfSpeech: 'noun',
        simpleDefinition: 'A small cloth bag sewn into a coat, shirt, or trousers for carrying small things.',
        contextMeaning: 'The part of a coat where a learner keeps flashcards while traveling.',
        originalSentence: 'Learners can carry a small pack of twenty cards in a coat pocket and practice for five minutes on the bus.',
        exampleSentence: 'She kept her house key safe inside her coat pocket.',
        synonyms: ['pouch'],
        arabicTranslation: 'جيب'
      },
      {
        id: 'a1-exp-edu-8',
        word: 'difficult',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Hard to do, understand, or remember; not easy.',
        contextMeaning: 'New words that take more practice before the learner remembers them.',
        originalSentence: 'If they remember a word easily, they place that card in a finished box at home and spend more time practicing the difficult cards.',
        exampleSentence: 'The last math question on the test was very difficult.',
        synonyms: ['hard', 'challenging'],
        arabicTranslation: 'صعب'
      }
    ],
    questions: [
      {
        id: 'a1-exp-edu-q1',
        type: 'true_false_not_given',
        prompt: 'Learners often forget many words when they only read a long list in a notebook.',
        correctAnswer: 'True',
        explanation: 'Paragraph 1 states that reading a long list can feel boring, and learners often forget half the list by the next day.',
        passageEvidence: 'Reading a long list of words on a notebook page can feel boring, and learners often forget half the list by the next day.'
      },
      {
        id: 'a1-exp-edu-q2',
        type: 'true_false_not_given',
        prompt: 'Teachers recommend writing both the word and the drawing on the same side of the card.',
        correctAnswer: 'False',
        explanation: 'Paragraph 2 states that teachers suggest making paper flashcards with a simple drawing on one side and the new word on the back.',
        passageEvidence: 'Teachers often suggest making paper flashcards with a simple drawing on one side and the new word on the back.'
      },
      {
        id: 'a1-exp-edu-q3',
        type: 'true_false_not_given',
        prompt: 'Yellow paper cards work better for memory than white paper cards.',
        correctAnswer: 'Not Given',
        explanation: 'The passage talks about paper flashcards, but it never mentions card colours such as yellow or white.',
        passageEvidence: 'Teachers often suggest making paper flashcards with a simple drawing on one side and the new word on the back.'
      },
      {
        id: 'a1-exp-edu-q4',
        type: 'multiple_choice',
        prompt: 'Why does drawing the picture yourself help you remember a word?',
        options: [
          'It takes extra care and connects the word to a clear visual image',
          'It makes the paper card heavier to carry in a pocket',
          'It allows you to skip reading the word on the back',
          'It finishes a whole notebook in one afternoon'
        ],
        correctAnswer: 'It takes extra care and connects the word to a clear visual image',
        explanation: 'Paragraph 2 explains that the brain connects the word to a clear visual image and drawing the picture yourself takes extra care, which makes the memory stronger.',
        passageEvidence: 'Furthermore, drawing the picture yourself takes extra care, which makes the memory stronger.'
      },
      {
        id: 'a1-exp-edu-q5',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 3: Learners can carry a small pack of twenty cards in a coat ______.',
        correctAnswer: 'pocket',
        acceptedAnswers: ['pocket'],
        explanation: 'Paragraph 3 states that learners can carry a small pack of twenty cards in a coat pocket.',
        passageEvidence: 'Learners can carry a small pack of twenty cards in a coat pocket and practice for five minutes on the bus.'
      },
      {
        id: 'a1-exp-edu-q6',
        type: 'vocabulary_in_context',
        prompt: 'What does the word "visual" mean in Paragraph 2?',
        options: [
          'Related to seeing or pictures',
          'Related to loud music or singing',
          'Related to cooking hot food',
          'Related to running fast races'
        ],
        correctAnswer: 'Related to seeing or pictures',
        explanation: 'In Paragraph 2, "a clear visual image" refers to a picture that you see.',
        passageEvidence: 'When you look at a drawing of an apple or a bicycle, your brain connects the word directly to a clear visual image.'
      },
      {
        id: 'a1-exp-edu-q7',
        type: 'short_answer',
        prompt: 'Answer with ONE WORD from Paragraph 3: Where can learners practice their flashcards for five minutes while traveling?',
        correctAnswer: 'bus',
        acceptedAnswers: ['bus', 'on the bus', 'the bus'],
        explanation: 'Paragraph 3 states that learners can practice for five minutes on the bus.',
        passageEvidence: 'Learners can carry a small pack of twenty cards in a coat pocket and practice for five minutes on the bus.'
      },
      {
        id: 'a1-exp-edu-q8',
        type: 'matching_information',
        prompt: 'Which paragraph explains what learners do with cards they already know well?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3'],
        correctAnswer: 'Paragraph 3',
        explanation: 'Paragraph 3 explains that if they remember a word easily, they place that card in a finished box at home.',
        passageEvidence: 'If they remember a word easily, they place that card in a finished box at home and spend more time practicing the difficult cards.'
      },
      {
        id: 'a1-exp-edu-q9',
        type: 'note_completion',
        prompt: 'Complete the study note with ONE WORD from Paragraph 3: Easy cards go into a finished ______ at home so learners can focus on difficult cards.',
        correctAnswer: 'box',
        acceptedAnswers: ['box'],
        explanation: 'Paragraph 3 states that they place that card in a finished box at home.',
        passageEvidence: 'If they remember a word easily, they place that card in a finished box at home and spend more time practicing the difficult cards.'
      },
      {
        id: 'a1-exp-edu-q10',
        type: 'multiple_choice',
        prompt: 'Why do learners separate easy cards from difficult cards?',
        options: [
          'So they can spend more time practicing the difficult words',
          'So they can throw the difficult cards into the rubbish bin',
          'Because coat pockets can only hold three cards at a time',
          'Because teachers collect the finished box every morning'
        ],
        correctAnswer: 'So they can spend more time practicing the difficult words',
        explanation: 'Paragraph 3 explains that putting easy cards in a finished box lets learners spend more time practicing the difficult cards.',
        passageEvidence: 'If they remember a word easily, they place that card in a finished box at home and spend more time practicing the difficult cards.'
      }
    ]
  },
  {
    id: 'a1-bio-sea-turtle-nests',
    title: 'How Baby Sea Turtles Find the Ocean at Night',
    level: 'A1',
    topic: 'Biology and animal behaviour',
    status: 'published',
    estimatedMinutes: 4,
    generationBatch: 'batch-expansion-a1',
    imageStatus: 'ready',
    introduction: 'Learn why tiny sea turtles wait until nightfall to climb out of their sandy nests and follow the bright horizon toward the sea.',
    illustrationAlt: 'Photograph of a sea turtle hatchling crawling across beach sand toward the ocean',
    passage: [
      'Every summer, mother sea turtles swim to warm sandy beaches at night. Each mother digs a deep hole in the dry sand with her flippers, lays about one hundred round white eggs, and covers the nest carefully before returning to the sea.',
      'After two months in the warm sand, the baby turtles break open their shells. However, they do not climb out during the hot day because hungry seabirds are flying above the beach and the sun is too strong. Instead, the babies wait together under the sand until the cool night arrives.',
      'In the dark, the tiny turtles push up to the surface and look for the brightest part of the sky. Over a natural beach, the open ocean reflects soft light from the moon and stars. By crawling toward this bright water, the young turtles reach the waves safely. For this reason, coastal towns ask beach houses and hotels to turn off bright outdoor lamps at night during the summer hatching season so the baby turtles do not get lost.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'a1-exp-bio-1',
        word: 'flippers',
        partOfSpeech: 'noun',
        simpleDefinition: 'Wide flat limbs on sea animals like turtles and seals, used for swimming.',
        contextMeaning: 'The flat legs a mother sea turtle uses to swim and dig a nest in the sand.',
        originalSentence: 'Each mother digs a deep hole in the dry sand with her flippers, lays about one hundred round white eggs, and covers the nest carefully before returning to the sea.',
        exampleSentence: 'Sea turtles move their strong front flippers like wings in the water.',
        synonyms: ['fins', 'paddles'],
        arabicTranslation: 'زعانف'
      },
      {
        id: 'a1-exp-bio-2',
        word: 'nest',
        partOfSpeech: 'noun',
        simpleDefinition: 'A safe place where a bird, turtle, or other animal lays its eggs.',
        contextMeaning: 'The hole in the beach sand where the mother turtle buries her eggs.',
        originalSentence: 'Each mother digs a deep hole in the dry sand with her flippers, lays about one hundred round white eggs, and covers the nest carefully before returning to the sea.',
        exampleSentence: 'We saw three small blue eggs inside the bird’s nest.',
        synonyms: ['den', 'burrow'],
        arabicTranslation: 'عش'
      },
      {
        id: 'a1-exp-bio-3',
        word: 'shells',
        partOfSpeech: 'noun',
        simpleDefinition: 'The thin hard outer coverings around eggs.',
        contextMeaning: 'The white egg coverings that baby turtles break open when they hatch.',
        originalSentence: 'After two months in the warm sand, the baby turtles break open their shells.',
        exampleSentence: 'Chicks use their small beaks to crack their egg shells.',
        synonyms: ['egg coverings', 'casings'],
        arabicTranslation: 'قشور البيض'
      },
      {
        id: 'a1-exp-bio-4',
        word: 'hungry',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Needing or wanting food to eat.',
        contextMeaning: 'Looking for food on the beach, such as baby turtles.',
        originalSentence: 'However, they do not climb out during the hot day because hungry seabirds are flying above the beach and the sun is too strong.',
        exampleSentence: 'The hungry dog waited beside its food bowl.',
        synonyms: ['starving'],
        arabicTranslation: 'جائع'
      },
      {
        id: 'a1-exp-bio-5',
        word: 'surface',
        partOfSpeech: 'noun',
        simpleDefinition: 'The top layer of the ground, sand, or water.',
        contextMeaning: 'The top of the beach sand where the turtles come out into the night air.',
        originalSentence: 'In the dark, the tiny turtles push up to the surface and look for the brightest part of the sky.',
        exampleSentence: 'A dolphin jumped above the surface of the sea.',
        synonyms: ['top', 'ground level'],
        arabicTranslation: 'سطح'
      },
      {
        id: 'a1-exp-bio-6',
        word: 'natural',
        partOfSpeech: 'adjective',
        simpleDefinition: 'As found in nature, without bright city buildings or streetlamps.',
        contextMeaning: 'A quiet dark beach without artificial electric lights nearby.',
        originalSentence: 'Over a natural beach, the open ocean reflects soft light from the moon and stars.',
        exampleSentence: 'National parks protect natural forests and rivers.',
        synonyms: ['wild', 'unspoiled'],
        arabicTranslation: 'طبيعي'
      },
      {
        id: 'a1-exp-bio-7',
        word: 'reflects',
        partOfSpeech: 'verb',
        simpleDefinition: 'Sends light back from a shiny or wet surface.',
        contextMeaning: 'Shines moonlight and starlight back off the ocean waves.',
        originalSentence: 'Over a natural beach, the open ocean reflects soft light from the moon and stars.',
        exampleSentence: 'Calm lake water reflects the mountains like a mirror.',
        synonyms: ['mirrors', 'shines back'],
        arabicTranslation: 'يعكس'
      },
      {
        id: 'a1-exp-bio-8',
        word: 'crawling',
        partOfSpeech: 'verb',
        simpleDefinition: 'Moving forward slowly with the body close to the ground.',
        contextMeaning: 'Moving across the sand on their small flippers toward the water.',
        originalSentence: 'By crawling toward this bright water, the young turtles reach the waves safely.',
        exampleSentence: 'A small green caterpillar was crawling along the leaf.',
        synonyms: ['creeping', 'moving slowly'],
        arabicTranslation: 'يزحف'
      }
    ],
    questions: [
      {
        id: 'a1-exp-bio-q1',
        type: 'true_false_not_given',
        prompt: 'A mother sea turtle lays about one hundred eggs in a hole in the sand.',
        correctAnswer: 'True',
        explanation: 'Paragraph 1 states that each mother digs a deep hole in the dry sand and lays about one hundred round white eggs.',
        passageEvidence: 'Each mother digs a deep hole in the dry sand with her flippers, lays about one hundred round white eggs, and covers the nest carefully before returning to the sea.'
      },
      {
        id: 'a1-exp-bio-q2',
        type: 'true_false_not_given',
        prompt: 'The mother sea turtle stays on the beach for two months to guard her nest.',
        correctAnswer: 'False',
        explanation: 'Paragraph 1 states that the mother covers the nest carefully before returning to the sea right after laying her eggs.',
        passageEvidence: 'Each mother digs a deep hole in the dry sand with her flippers, lays about one hundred round white eggs, and covers the nest carefully before returning to the sea.'
      },
      {
        id: 'a1-exp-bio-q3',
        type: 'true_false_not_given',
        prompt: 'Baby sea turtles eat green seaweed during their first night in the water.',
        correctAnswer: 'Not Given',
        explanation: 'The passage explains how baby turtles reach the waves, but it never mentions what they eat in the water.',
        passageEvidence: 'By crawling toward this bright water, the young turtles reach the waves safely.'
      },
      {
        id: 'a1-exp-bio-q4',
        type: 'multiple_choice',
        prompt: 'Why do baby sea turtles wait until night to climb out of the sand?',
        options: [
          'To avoid hungry seabirds and the hot daytime sun',
          'Because the beach sand is frozen solid during the day',
          'Because their mother comes back at midnight to carry them',
          'To wait for tourists to take photographs on the beach'
        ],
        correctAnswer: 'To avoid hungry seabirds and the hot daytime sun',
        explanation: 'Paragraph 2 explains that they do not climb out during the hot day because hungry seabirds are flying above the beach and the sun is too strong.',
        passageEvidence: 'However, they do not climb out during the hot day because hungry seabirds are flying above the beach and the sun is too strong.'
      },
      {
        id: 'a1-exp-bio-q5',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 1: Each mother digs a deep hole in the dry sand with her ______.',
        correctAnswer: 'flippers',
        acceptedAnswers: ['flippers'],
        explanation: 'Paragraph 1 states that each mother digs a deep hole in the dry sand with her flippers.',
        passageEvidence: 'Each mother digs a deep hole in the dry sand with her flippers, lays about one hundred round white eggs, and covers the nest carefully before returning to the sea.'
      },
      {
        id: 'a1-exp-bio-q6',
        type: 'vocabulary_in_context',
        prompt: 'What does the word "reflects" mean in Paragraph 3?',
        options: [
          'Shines light back from a surface',
          'Drinks up all the ocean water',
          'Hides under a dark rock',
          'Makes a loud splashing sound'
        ],
        correctAnswer: 'Shines light back from a surface',
        explanation: 'In Paragraph 3, the open ocean reflects (shines back) soft light from the moon and stars.',
        passageEvidence: 'Over a natural beach, the open ocean reflects soft light from the moon and stars.'
      },
      {
        id: 'a1-exp-bio-q7',
        type: 'short_answer',
        prompt: 'Answer with TWO WORDS from Paragraph 2: How long do the eggs stay in the warm sand before hatching?',
        correctAnswer: 'two months',
        acceptedAnswers: ['two months', '2 months'],
        explanation: 'Paragraph 2 states that after two months in the warm sand, the baby turtles break open their shells.',
        passageEvidence: 'After two months in the warm sand, the baby turtles break open their shells.'
      },
      {
        id: 'a1-exp-bio-q8',
        type: 'matching_information',
        prompt: 'Which paragraph explains how moonlight helps the baby turtles find the ocean?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3'],
        correctAnswer: 'Paragraph 3',
        explanation: 'Paragraph 3 explains that the open ocean reflects soft light from the moon and stars, guiding the young turtles toward the water.',
        passageEvidence: 'Over a natural beach, the open ocean reflects soft light from the moon and stars.'
      },
      {
        id: 'a1-exp-bio-q9',
        type: 'note_completion',
        prompt: 'Complete the study note with ONE WORD from Paragraph 3: In the dark, the tiny turtles push up to the ______ and look for the brightest part of the sky.',
        correctAnswer: 'surface',
        acceptedAnswers: ['surface'],
        explanation: 'Paragraph 3 states that the tiny turtles push up to the surface.',
        passageEvidence: 'In the dark, the tiny turtles push up to the surface and look for the brightest part of the sky.'
      },
      {
        id: 'a1-exp-bio-q10',
        type: 'multiple_choice',
        prompt: 'How do the baby turtles know which way leads to the sea at night?',
        options: [
          'They crawl toward the bright light reflected on the ocean water',
          'They follow deep footprints left by beach walkers',
          'They listen to the calls of seabirds in the trees',
          'They wait for rain to wash them down the hill'
        ],
        correctAnswer: 'They crawl toward the bright light reflected on the ocean water',
        explanation: 'Paragraph 3 states that by crawling toward this bright water, the young turtles reach the waves safely.',
        passageEvidence: 'By crawling toward this bright water, the young turtles reach the waves safely.'
      }
    ]
  },
  {
    id: 'a1-hea-drinking-clean-water',
    title: 'Why Boiling and Filtering Water Keeps Families Healthy',
    level: 'A1',
    topic: 'Public health',
    status: 'published',
    estimatedMinutes: 4,
    generationBatch: 'batch-expansion-a1',
    imageStatus: 'ready',
    introduction: 'Understand how two simple kitchen habits remove invisible germs and dirt from drinking water to protect children and adults.',
    illustrationAlt: 'Photograph of clear drinking water being poured from a pitcher into a clean glass',
    passage: [
      'A glass of water from a river or an old well can look completely clear and cool. However, clear water sometimes hides tiny living germs that are too small for human eyes to see. If people drink untreated water, these germs can cause stomach pain and fever.',
      'Families around the world use two simple methods to make water safe in the kitchen. First, pouring water through a ceramic or charcoal filter removes sand, rust, and bad smells. Second, boiling the water in a clean metal pot for one full minute kills dangerous germs.',
      'After the boiled water cools down, families store it in a clean container with a tight lid so dust and flies cannot get inside. Teaching everyone to filter, boil, and cover drinking water is one of the easiest ways to keep a community strong and healthy. Parents also remind children to use a clean cup or a small tap on the water jar instead of dipping their hands inside the fresh water.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'a1-exp-hea-1',
        word: 'germs',
        partOfSpeech: 'noun',
        simpleDefinition: 'Very tiny living things that can enter the body and cause illness.',
        contextMeaning: 'Microscopic bacteria or organisms hiding in untreated river or well water.',
        originalSentence: 'However, clear water sometimes hides tiny living germs that are too small for human eyes to see.',
        exampleSentence: 'Washing your hands with soap removes germs before dinner.',
        synonyms: ['bacteria', 'microbes'],
        arabicTranslation: 'جراثيم'
      },
      {
        id: 'a1-exp-hea-2',
        word: 'untreated',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Not cleaned, boiled, or filtered to make it safe.',
        contextMeaning: 'Raw water taken straight from a river or well without cleaning.',
        originalSentence: 'If people drink untreated water, these germs can cause stomach pain and fever.',
        exampleSentence: 'Campers should never drink untreated water from mountain streams.',
        synonyms: ['uncleaned', 'raw'],
        arabicTranslation: 'غير معالج'
      },
      {
        id: 'a1-exp-hea-3',
        word: 'fever',
        partOfSpeech: 'noun',
        simpleDefinition: 'An illness sign where a person’s body becomes much hotter than normal.',
        contextMeaning: 'High body temperature caused by drinking water with germs.',
        originalSentence: 'If people drink untreated water, these germs can cause stomach pain and fever.',
        exampleSentence: 'The nurse checked the child’s temperature because he had a fever.',
        synonyms: ['high temperature'],
        arabicTranslation: 'حمى'
      },
      {
        id: 'a1-exp-hea-4',
        word: 'methods',
        partOfSpeech: 'noun',
        simpleDefinition: 'Planned ways of doing something.',
        contextMeaning: 'Practical kitchen steps—filtering and boiling—used to clean water.',
        originalSentence: 'Families around the world use two simple methods to make water safe in the kitchen.',
        exampleSentence: 'The teacher showed us two easy methods for solving the puzzle.',
        synonyms: ['ways', 'techniques'],
        arabicTranslation: 'طرق / أساليب'
      },
      {
        id: 'a1-exp-hea-5',
        word: 'filter',
        partOfSpeech: 'noun',
        simpleDefinition: 'A tool with tiny holes that lets liquid pass through while holding back dirt.',
        contextMeaning: 'A ceramic or charcoal device that catches sand and rust.',
        originalSentence: 'First, pouring water through a ceramic or charcoal filter removes sand, rust, and bad smells.',
        exampleSentence: 'A paper coffee filter keeps coffee grounds out of your cup.',
        synonyms: ['strainer', 'purifier'],
        arabicTranslation: 'مرشح / فلتر'
      },
      {
        id: 'a1-exp-hea-6',
        word: 'boiling',
        partOfSpeech: 'verb',
        simpleDefinition: 'Heating water until it is very hot and full of rising bubbles.',
        contextMeaning: 'Heating drinking water in a pot to kill germs.',
        originalSentence: 'Second, boiling the water in a clean metal pot for one full minute kills dangerous germs.',
        exampleSentence: 'She is boiling water on the stove to make green tea.',
        synonyms: ['heating'],
        arabicTranslation: 'غلي'
      },
      {
        id: 'a1-exp-hea-7',
        word: 'container',
        partOfSpeech: 'noun',
        simpleDefinition: 'An object such as a bottle, jar, or jug used for holding things.',
        contextMeaning: 'A clean water jug or pot used to hold cooled drinking water.',
        originalSentence: 'After the boiled water cools down, families store it in a clean container with a tight lid so dust and flies cannot get inside.',
        exampleSentence: 'Please put the leftover soup in a plastic container.',
        synonyms: ['vessel', 'holder', 'jug'],
        arabicTranslation: 'وعاء / حاوية'
      },
      {
        id: 'a1-exp-hea-8',
        word: 'lid',
        partOfSpeech: 'noun',
        simpleDefinition: 'A cover for the top of a pot, box, or bottle.',
        contextMeaning: 'The tight top cover that keeps dust and flies out of clean water.',
        originalSentence: 'After the boiled water cools down, families store it in a clean container with a tight lid so dust and flies cannot get inside.',
        exampleSentence: 'Put the lid on the honey jar so ants do not climb in.',
        synonyms: ['cover', 'top', 'cap'],
        arabicTranslation: 'غطاء'
      }
    ],
    questions: [
      {
        id: 'a1-exp-hea-q1',
        type: 'true_false_not_given',
        prompt: 'Water that looks clear can still contain tiny germs that make people sick.',
        correctAnswer: 'True',
        explanation: 'Paragraph 1 states that clear water sometimes hides tiny living germs that are too small for human eyes to see.',
        passageEvidence: 'However, clear water sometimes hides tiny living germs that are too small for human eyes to see.'
      },
      {
        id: 'a1-exp-hea-q2',
        type: 'true_false_not_given',
        prompt: 'Families must boil water for thirty minutes to kill dangerous germs.',
        correctAnswer: 'False',
        explanation: 'Paragraph 2 states that boiling the water in a clean metal pot for one full minute kills dangerous germs.',
        passageEvidence: 'Second, boiling the water in a clean metal pot for one full minute kills dangerous germs.'
      },
      {
        id: 'a1-exp-hea-q3',
        type: 'true_false_not_given',
        prompt: 'Glass water bottles are cheaper than metal pots in most villages.',
        correctAnswer: 'Not Given',
        explanation: 'The passage mentions a clean metal pot and a clean container, but it never compares their prices.',
        passageEvidence: 'Second, boiling the water in a clean metal pot for one full minute kills dangerous germs.'
      },
      {
        id: 'a1-exp-hea-q4',
        type: 'multiple_choice',
        prompt: 'What does a ceramic or charcoal filter remove from water?',
        options: [
          'Sand, rust, and bad smells',
          'Sugar and warm milk',
          'Ice cubes and cold air',
          'Soap bubbles from washing hands'
        ],
        correctAnswer: 'Sand, rust, and bad smells',
        explanation: 'Paragraph 2 states that pouring water through a ceramic or charcoal filter removes sand, rust, and bad smells.',
        passageEvidence: 'First, pouring water through a ceramic or charcoal filter removes sand, rust, and bad smells.'
      },
      {
        id: 'a1-exp-hea-q5',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 1: If people drink untreated water, these germs can cause stomach pain and ______.',
        correctAnswer: 'fever',
        acceptedAnswers: ['fever'],
        explanation: 'Paragraph 1 states that these germs can cause stomach pain and fever.',
        passageEvidence: 'If people drink untreated water, these germs can cause stomach pain and fever.'
      },
      {
        id: 'a1-exp-hea-q6',
        type: 'vocabulary_in_context',
        prompt: 'What does the word "untreated" mean in Paragraph 1?',
        options: [
          'Not cleaned, filtered, or boiled yet',
          'Mixed with lemon juice and honey',
          'Kept inside a refrigerator all night',
          'Bought from a supermarket shelf'
        ],
        correctAnswer: 'Not cleaned, filtered, or boiled yet',
        explanation: '"Untreated water" means raw water from a river or well that has not been cleaned to make it safe.',
        passageEvidence: 'If people drink untreated water, these germs can cause stomach pain and fever.'
      },
      {
        id: 'a1-exp-hea-q7',
        type: 'short_answer',
        prompt: 'Answer with ONE OR TWO WORDS from Paragraph 3: What should a clean water container have on top to keep dust and flies out?',
        correctAnswer: 'tight lid',
        acceptedAnswers: ['tight lid', 'lid', 'a tight lid'],
        explanation: 'Paragraph 3 states that families store cooled water in a clean container with a tight lid.',
        passageEvidence: 'After the boiled water cools down, families store it in a clean container with a tight lid so dust and flies cannot get inside.'
      },
      {
        id: 'a1-exp-hea-q8',
        type: 'matching_information',
        prompt: 'Which paragraph explains how to store water safely after it cools down?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3'],
        correctAnswer: 'Paragraph 3',
        explanation: 'Paragraph 3 explains storing cooled water in a clean container with a tight lid.',
        passageEvidence: 'After the boiled water cools down, families store it in a clean container with a tight lid so dust and flies cannot get inside.'
      },
      {
        id: 'a1-exp-hea-q9',
        type: 'note_completion',
        prompt: 'Complete the study note with ONE WORD from Paragraph 2: Boiling water in a clean metal pot for one full ______ kills dangerous germs.',
        correctAnswer: 'minute',
        acceptedAnswers: ['minute'],
        explanation: 'Paragraph 2 states "for one full minute".',
        passageEvidence: 'Second, boiling the water in a clean metal pot for one full minute kills dangerous germs.'
      },
      {
        id: 'a1-exp-hea-q10',
        type: 'multiple_choice',
        prompt: 'Why is it unsafe to judge drinking water only by how it looks?',
        options: [
          'Because germs are too small for human eyes to see even in clear water',
          'Because clean water always looks dark blue in a glass',
          'Because river water is always too hot to drink',
          'Because old wells only have water during the winter'
        ],
        correctAnswer: 'Because germs are too small for human eyes to see even in clear water',
        explanation: 'Paragraph 1 explains that a glass of water can look completely clear, yet still hide tiny living germs too small for human eyes to see.',
        passageEvidence: 'However, clear water sometimes hides tiny living germs that are too small for human eyes to see.'
      }
    ]
  },
  {
    id: 'a1-eco-community-tool-libraries',
    title: 'How Community Tool Libraries Help Neighbors Share',
    level: 'A1',
    topic: 'Economics and society',
    status: 'published',
    estimatedMinutes: 4,
    generationBatch: 'batch-expansion-a1',
    imageStatus: 'ready',
    introduction: 'See how neighborhood tool libraries work just like book libraries so families can borrow drills, ladders, and garden spades without buying them.',
    illustrationAlt: 'Photograph of organized hand tools and drills hanging on a workshop wall',
    passage: [
      'Most people need a tall ladder, an electric drill, or a garden spade only two or three times a year. Buying these expensive tools for one small home repair costs a lot of money, and the tools sit unused in a closet for months.',
      'To solve this problem, many towns now open a community tool library. It works just like a book library. Neighbors join for a small yearly fee and receive a membership card. When someone wants to fix a wooden chair or plant a tree, they borrow the right tool for one week.',
      'After finishing the job, the borrower cleans the tool and returns it to the shelf for the next neighbor. Friendly staff members check every machine to make sure it is safe to use. Sharing tools saves families money, reduces waste, and helps neighbors learn useful repair skills. Many tool libraries also hold free weekend workshops where experienced builders teach beginners how to fix broken chairs, bicycles, and garden fences safely.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'a1-exp-eco-1',
        word: 'spade',
        partOfSpeech: 'noun',
        simpleDefinition: 'A garden tool with a long handle and a flat metal blade used for digging soil.',
        contextMeaning: 'A digging tool that someone borrows when planting a tree.',
        originalSentence: 'Most people need a tall ladder, an electric drill, or a garden spade only two or three times a year.',
        exampleSentence: 'Grandfather used a steel spade to dig holes for the tomato plants.',
        synonyms: ['shovel'],
        arabicTranslation: 'مجرفة'
      },
      {
        id: 'a1-exp-eco-2',
        word: 'expensive',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Costing a lot of money.',
        contextMeaning: 'High in price, making it wasteful to buy for just one small home job.',
        originalSentence: 'Buying these expensive tools for one small home repair costs a lot of money, and the tools sit unused in a closet for months.',
        exampleSentence: 'New electric drills can be very expensive to buy.',
        synonyms: ['costly', 'high-priced'],
        arabicTranslation: 'غالي الثمن'
      },
      {
        id: 'a1-exp-eco-3',
        word: 'unused',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Not being used by anyone.',
        contextMeaning: 'Sitting untouched in a home closet for most of the year.',
        originalSentence: 'Buying these expensive tools for one small home repair costs a lot of money, and the tools sit unused in a closet for months.',
        exampleSentence: 'The old bicycle stood unused in the garage all winter.',
        synonyms: ['idle'],
        arabicTranslation: 'غير مستخدم'
      },
      {
        id: 'a1-exp-eco-4',
        word: 'fee',
        partOfSpeech: 'noun',
        simpleDefinition: 'An amount of money paid to join a club or use a service.',
        contextMeaning: 'A small yearly payment that lets a neighbor borrow tools all year.',
        originalSentence: 'Neighbors join for a small yearly fee and receive a membership card.',
        exampleSentence: 'The swimming pool charges a small entry fee on weekends.',
        synonyms: ['charge', 'payment'],
        arabicTranslation: 'رسوم'
      },
      {
        id: 'a1-exp-eco-5',
        word: 'borrow',
        partOfSpeech: 'verb',
        simpleDefinition: 'To take and use something that belongs to someone else, and give it back later.',
        contextMeaning: 'To take a tool home from the library for a week and return it after the job.',
        originalSentence: 'When someone wants to fix a wooden chair or plant a tree, they borrow the right tool for one week.',
        exampleSentence: 'Can I borrow your ruler for two minutes?',
        synonyms: ['use temporarily'],
        arabicTranslation: 'يستعير'
      },
      {
        id: 'a1-exp-eco-6',
        word: 'borrower',
        partOfSpeech: 'noun',
        simpleDefinition: 'A person who borrows something and promises to return it.',
        contextMeaning: 'The neighbor who took the tool home to finish a repair.',
        originalSentence: 'After finishing the job, the borrower cleans the tool and returns it to the shelf for the next neighbor.',
        exampleSentence: 'Each library borrower can take home four books at a time.',
        synonyms: ['member', 'user'],
        arabicTranslation: 'المستعير'
      },
      {
        id: 'a1-exp-eco-7',
        word: 'returns',
        partOfSpeech: 'verb',
        simpleDefinition: 'Gives or puts something back where it came from.',
        contextMeaning: 'Brings the clean tool back to the library shelf.',
        originalSentence: 'After finishing the job, the borrower cleans the tool and returns it to the shelf for the next neighbor.',
        exampleSentence: 'He always returns library books on time.',
        synonyms: ['brings back', 'gives back'],
        arabicTranslation: 'يُعيد'
      },
      {
        id: 'a1-exp-eco-8',
        word: 'skills',
        partOfSpeech: 'noun',
        simpleDefinition: 'Abilities to do something well after learning and practicing.',
        contextMeaning: 'Practical abilities to fix furniture or care for a garden.',
        originalSentence: 'Sharing tools saves families money, reduces waste, and helps neighbors learn useful repair skills.',
        exampleSentence: 'Cooking class taught the students useful kitchen skills.',
        synonyms: ['abilities'],
        arabicTranslation: 'مهارات'
      }
    ],
    questions: [
      {
        id: 'a1-exp-eco-q1',
        type: 'true_false_not_given',
        prompt: 'Most people use a tall ladder or an electric drill only a few times each year.',
        correctAnswer: 'True',
        explanation: 'Paragraph 1 states that most people need a tall ladder, an electric drill, or a garden spade only two or three times a year.',
        passageEvidence: 'Most people need a tall ladder, an electric drill, or a garden spade only two or three times a year.'
      },
      {
        id: 'a1-exp-eco-q2',
        type: 'true_false_not_given',
        prompt: 'Neighbors can keep a borrowed tool from the library forever.',
        correctAnswer: 'False',
        explanation: 'Paragraphs 2 and 3 explain that neighbors borrow the tool for one week and then clean and return it to the shelf.',
        passageEvidence: 'After finishing the job, the borrower cleans the tool and returns it to the shelf for the next neighbor.'
      },
      {
        id: 'a1-exp-eco-q3',
        type: 'true_false_not_given',
        prompt: 'The first community tool library opened in the city of Toronto.',
        correctAnswer: 'Not Given',
        explanation: 'The passage explains how tool libraries work in many towns, but it never mentions Toronto or where the first one opened.',
        passageEvidence: 'To solve this problem, many towns now open a community tool library.'
      },
      {
        id: 'a1-exp-eco-q4',
        type: 'multiple_choice',
        prompt: 'Why is buying expensive tools for one small repair a problem for many families?',
        options: [
          'They cost a lot of money and sit unused in a closet for months',
          'Hardware shops only sell tools to professional builders',
          'Electric drills stop working after just one day',
          'Garden spades are too heavy to carry home in a car'
        ],
        correctAnswer: 'They cost a lot of money and sit unused in a closet for months',
        explanation: 'Paragraph 1 states that buying these expensive tools costs a lot of money, and the tools sit unused in a closet for months.',
        passageEvidence: 'Buying these expensive tools for one small home repair costs a lot of money, and the tools sit unused in a closet for months.'
      },
      {
        id: 'a1-exp-eco-q5',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 2: Neighbors join for a small yearly fee and receive a membership ______.',
        correctAnswer: 'card',
        acceptedAnswers: ['card'],
        explanation: 'Paragraph 2 states that neighbors join for a small yearly fee and receive a membership card.',
        passageEvidence: 'Neighbors join for a small yearly fee and receive a membership card.'
      },
      {
        id: 'a1-exp-eco-q6',
        type: 'vocabulary_in_context',
        prompt: 'What does the word "unused" mean in Paragraph 1?',
        options: [
          'Not being used by anyone',
          'Broken into small pieces',
          'Painted a bright yellow colour',
          'Borrowed from a next-door neighbor'
        ],
        correctAnswer: 'Not being used by anyone',
        explanation: '"Sit unused in a closet" means nobody is using the tools while they stay stored away.',
        passageEvidence: 'Buying these expensive tools for one small home repair costs a lot of money, and the tools sit unused in a closet for months.'
      },
      {
        id: 'a1-exp-eco-q7',
        type: 'short_answer',
        prompt: 'Answer with TWO WORDS from Paragraph 2: How long do members usually borrow a tool for?',
        correctAnswer: 'one week',
        acceptedAnswers: ['one week', '1 week', 'a week'],
        explanation: 'Paragraph 2 states that they borrow the right tool for one week.',
        passageEvidence: 'When someone wants to fix a wooden chair or plant a tree, they borrow the right tool for one week.'
      },
      {
        id: 'a1-exp-eco-q8',
        type: 'matching_information',
        prompt: 'Which paragraph mentions what staff members do to keep the tools safe?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3'],
        correctAnswer: 'Paragraph 3',
        explanation: 'Paragraph 3 states that friendly staff members check every machine to make sure it is safe to use.',
        passageEvidence: 'Friendly staff members check every machine to make sure it is safe to use.'
      },
      {
        id: 'a1-exp-eco-q9',
        type: 'note_completion',
        prompt: 'Complete the study note with ONE WORD from Paragraph 3: After finishing the job, the borrower cleans the tool and returns it to the ______.',
        correctAnswer: 'shelf',
        acceptedAnswers: ['shelf'],
        explanation: 'Paragraph 3 states that the borrower cleans the tool and returns it to the shelf.',
        passageEvidence: 'After finishing the job, the borrower cleans the tool and returns it to the shelf for the next neighbor.'
      },
      {
        id: 'a1-exp-eco-q10',
        type: 'multiple_choice',
        prompt: 'What must a borrower do before returning a tool to the library?',
        options: [
          'Clean the tool so it is ready for the next neighbor',
          'Buy a new battery for every electric machine',
          'Paint their name on the wooden handle',
          'Keep the tool in a home closet for six months'
        ],
        correctAnswer: 'Clean the tool so it is ready for the next neighbor',
        explanation: 'Paragraph 3 states that after finishing the job, the borrower cleans the tool and returns it to the shelf.',
        passageEvidence: 'After finishing the job, the borrower cleans the tool and returns it to the shelf for the next neighbor.'
      }
    ]
  },
  {
    id: 'a1-ast-constellations-night-sky',
    title: 'How Sailors Used Star Patterns to Cross the Sea',
    level: 'A1',
    topic: 'Astronomy and space exploration',
    status: 'published',
    estimatedMinutes: 4,
    generationBatch: 'batch-expansion-a1',
    imageStatus: 'ready',
    introduction: 'Learn how ancient sailors looked up at bright star patterns in the night sky to steer their ships safely across open water.',
    illustrationAlt: 'Photograph of a starry night sky above calm dark ocean water',
    passage: [
      'When ancient sailors traveled far from land, they saw only blue water in every direction. There were no roads, hills, or street signs on the open sea. To find their way home, captains looked up at the clear sky every night and studied the stars.',
      'Long ago, people noticed that bright stars form fixed shapes in the sky called constellations. Some star groups look like a bear, a hunter, or a cross. In the northern half of the world, one special star called the North Star stays in almost the same spot all night.',
      'Whenever sailors found the North Star, they knew which way was north, south, east, and west. Even on long journeys across deep oceans, these shining star patterns worked like a giant map in the sky and guided wooden ships safely to port. Today, young campers and curious students still go outside on clear winter nights with simple paper star charts to find these famous ancient shapes above the quiet dark hills.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'a1-exp-ast-1',
        word: 'direction',
        partOfSpeech: 'noun',
        simpleDefinition: 'The way toward which someone or something looks or moves, such as north or south.',
        contextMeaning: 'Every side around the ship on the open ocean.',
        originalSentence: 'When ancient sailors traveled far from land, they saw only blue water in every direction.',
        exampleSentence: 'The wind blew the sailboat in the direction of the island.',
        synonyms: ['way', 'course'],
        arabicTranslation: 'اتجاه'
      },
      {
        id: 'a1-exp-ast-2',
        word: 'captains',
        partOfSpeech: 'noun',
        simpleDefinition: 'The leaders in charge of steering and commanding ships.',
        contextMeaning: 'Ship leaders who used the night stars to guide their vessels.',
        originalSentence: 'To find their way home, captains looked up at the clear sky every night and studied the stars.',
        exampleSentence: 'Ship captains must watch the weather carefully at sea.',
        synonyms: ['commanders', 'skippers'],
        arabicTranslation: 'قباطنة السفن'
      },
      {
        id: 'a1-exp-ast-3',
        word: 'fixed',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Staying in the same pattern or place; not changing.',
        contextMeaning: 'Keeping the same recognizable shapes in the night sky year after year.',
        originalSentence: 'Long ago, people noticed that bright stars form fixed shapes in the sky called constellations.',
        exampleSentence: 'The train runs on a fixed schedule every morning.',
        synonyms: ['unchanging', 'steady'],
        arabicTranslation: 'ثابت'
      },
      {
        id: 'a1-exp-ast-4',
        word: 'constellations',
        partOfSpeech: 'noun',
        simpleDefinition: 'Groups of stars in the sky that look like shapes or pictures and have names.',
        contextMeaning: 'Star patterns that sailors used to recognize parts of the night sky.',
        originalSentence: 'Long ago, people noticed that bright stars form fixed shapes in the sky called constellations.',
        exampleSentence: 'We learned the names of three winter constellations at the science museum.',
        synonyms: ['star patterns', 'star groups'],
        arabicTranslation: 'كوكبات نجمية'
      },
      {
        id: 'a1-exp-ast-5',
        word: 'spot',
        partOfSpeech: 'noun',
        simpleDefinition: 'A particular place or position.',
        contextMeaning: 'The exact point in the northern sky where the North Star stays.',
        originalSentence: 'In the northern half of the world, one special star called the North Star stays in almost the same spot all night.',
        exampleSentence: 'This sunny spot near the window is great for houseplants.',
        synonyms: ['place', 'point', 'position'],
        arabicTranslation: 'مكان / موضع'
      },
      {
        id: 'a1-exp-ast-6',
        word: 'journeys',
        partOfSpeech: 'noun',
        simpleDefinition: 'Long trips from one place to another.',
        contextMeaning: 'Long sea voyages across the ocean.',
        originalSentence: 'Even on long journeys across deep oceans, these shining star patterns worked like a giant map in the sky and guided wooden ships safely to port.',
        exampleSentence: 'Camels are strong animals for long desert journeys.',
        synonyms: ['trips', 'voyages', 'travels'],
        arabicTranslation: 'رحلات'
      },
      {
        id: 'a1-exp-ast-7',
        word: 'guided',
        partOfSpeech: 'verb',
        simpleDefinition: 'Showed the right way to go.',
        contextMeaning: 'Helped sailors steer their wooden ships in the right direction.',
        originalSentence: 'Even on long journeys across deep oceans, these shining star patterns worked like a giant map in the sky and guided wooden ships safely to port.',
        exampleSentence: 'A bright lighthouse guided the fishing boat through the dark.',
        synonyms: ['led', 'steered', 'directed'],
        arabicTranslation: 'أرشد / وجّه'
      },
      {
        id: 'a1-exp-ast-8',
        word: 'port',
        partOfSpeech: 'noun',
        simpleDefinition: 'A town or harbor by the sea where ships arrive and leave.',
        contextMeaning: 'The safe harbor where sailors brought their ships at the end of a voyage.',
        originalSentence: 'Even on long journeys across deep oceans, these shining star patterns worked like a giant map in the sky and guided wooden ships safely to port.',
        exampleSentence: 'The cargo ship arrived at the port early on Monday morning.',
        synonyms: ['harbor', 'dock'],
        arabicTranslation: 'ميناء'
      }
    ],
    questions: [
      {
        id: 'a1-exp-ast-q1',
        type: 'true_false_not_given',
        prompt: 'Bright stars form fixed shapes in the night sky called constellations.',
        correctAnswer: 'True',
        explanation: 'Paragraph 2 states that bright stars form fixed shapes in the sky called constellations.',
        passageEvidence: 'Long ago, people noticed that bright stars form fixed shapes in the sky called constellations.'
      },
      {
        id: 'a1-exp-ast-q2',
        type: 'true_false_not_given',
        prompt: 'The North Star moves quickly from east to west every hour.',
        correctAnswer: 'False',
        explanation: 'Paragraph 2 states that the North Star stays in almost the same spot all night.',
        passageEvidence: 'In the northern half of the world, one special star called the North Star stays in almost the same spot all night.'
      },
      {
        id: 'a1-exp-ast-q3',
        type: 'true_false_not_given',
        prompt: 'Ancient sailors carried glass telescopes on every wooden ship.',
        correctAnswer: 'Not Given',
        explanation: 'The passage says captains looked up at the clear sky and studied the stars, but it never mentions glass telescopes.',
        passageEvidence: 'To find their way home, captains looked up at the clear sky every night and studied the stars.'
      },
      {
        id: 'a1-exp-ast-q4',
        type: 'multiple_choice',
        prompt: 'Why was it difficult for ancient sailors to find their way on the open sea?',
        options: [
          'They saw only blue water in every direction with no roads or hills',
          'The ocean water was always frozen into thick white ice',
          'Wooden ships could only sail backward in the wind',
          'There were no stars in the sky above the ocean'
        ],
        correctAnswer: 'They saw only blue water in every direction with no roads or hills',
        explanation: 'Paragraph 1 explains that when sailors traveled far from land, they saw only blue water in every direction, and there were no roads, hills, or street signs.',
        passageEvidence: 'When ancient sailors traveled far from land, they saw only blue water in every direction. There were no roads, hills, or street signs on the open sea.'
      },
      {
        id: 'a1-exp-ast-q5',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 2: Some star groups look like a bear, a ______, or a cross.',
        correctAnswer: 'hunter',
        acceptedAnswers: ['hunter'],
        explanation: 'Paragraph 2 states that some star groups look like a bear, a hunter, or a cross.',
        passageEvidence: 'Some star groups look like a bear, a hunter, or a cross.'
      },
      {
        id: 'a1-exp-ast-q6',
        type: 'vocabulary_in_context',
        prompt: 'What does the word "port" mean in Paragraph 3?',
        options: [
          'A harbor town where ships arrive and leave',
          'A bright star in the northern sky',
          'A wooden oar used for rowing a small boat',
          'A heavy rainstorm over the deep ocean'
        ],
        correctAnswer: 'A harbor town where ships arrive and leave',
        explanation: 'In Paragraph 3, "guided wooden ships safely to port" means bringing ships safely to harbor on land.',
        passageEvidence: 'Even on long journeys across deep oceans, these shining star patterns worked like a giant map in the sky and guided wooden ships safely to port.'
      },
      {
        id: 'a1-exp-ast-q7',
        type: 'short_answer',
        prompt: 'Answer with TWO WORDS from Paragraph 2: Which special star stays in almost the same spot all night in the northern sky?',
        correctAnswer: 'North Star',
        acceptedAnswers: ['North Star', 'the North Star'],
        explanation: 'Paragraph 2 identifies this star as the North Star.',
        passageEvidence: 'In the northern half of the world, one special star called the North Star stays in almost the same spot all night.'
      },
      {
        id: 'a1-exp-ast-q8',
        type: 'matching_information',
        prompt: 'Which paragraph explains how finding the North Star helped sailors know all four directions?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3'],
        correctAnswer: 'Paragraph 3',
        explanation: 'Paragraph 3 states that whenever sailors found the North Star, they knew which way was north, south, east, and west.',
        passageEvidence: 'Whenever sailors found the North Star, they knew which way was north, south, east, and west.'
      },
      {
        id: 'a1-exp-ast-q9',
        type: 'note_completion',
        prompt: 'Complete the study note with ONE WORD from Paragraph 3: Shining star patterns worked like a giant ______ in the sky.',
        correctAnswer: 'map',
        acceptedAnswers: ['map'],
        explanation: 'Paragraph 3 states that these shining star patterns worked like a giant map in the sky.',
        passageEvidence: 'Even on long journeys across deep oceans, these shining star patterns worked like a giant map in the sky and guided wooden ships safely to port.'
      },
      {
        id: 'a1-exp-ast-q10',
        type: 'multiple_choice',
        prompt: 'Why was the North Star so useful to ship captains?',
        options: [
          'It stays in almost the same northern spot all night, showing every direction',
          'It shines brightly during cloudy daytime storms',
          'It changes colour when a ship is near an island',
          'It warms the ocean water around wooden ships'
        ],
        correctAnswer: 'It stays in almost the same northern spot all night, showing every direction',
        explanation: 'Paragraphs 2 and 3 explain that the North Star stays in almost the same spot all night, allowing sailors to know north, south, east, and west.',
        passageEvidence: 'Whenever sailors found the North Star, they knew which way was north, south, east, and west.'
      }
    ]
  },
  {
    id: 'a1-arc-bamboo-homes',
    title: 'Why Builders Use Strong Bamboo for Tropical Homes',
    level: 'A1',
    topic: 'Architecture and urban development',
    status: 'published',
    estimatedMinutes: 4,
    generationBatch: 'batch-expansion-a1',
    imageStatus: 'ready',
    introduction: 'Discover why tall hollow bamboo stems make cool, safe, and fast-growing building materials in warm tropical countries.',
    illustrationAlt: 'Photograph of a traditional house structure framed with natural bamboo poles',
    passage: [
      'In warm tropical countries with heavy rain, builders have used bamboo for hundreds of years to make family homes. Although bamboo looks like a tall thin tree, it is actually a giant grass that grows very fast in wet soil.',
      'A hardwood tree takes thirty years to grow tall enough for building, but a bamboo stem reaches its full height in just three or four years. Even better, when farmers cut a bamboo stem, the roots stay alive underground and send up new green shoots right away.',
      'Bamboo poles are hollow inside, which makes them light to carry but very strong. During strong winds or earthquakes, a bamboo house bends gently instead of breaking like heavy stone. Wide bamboo roofs and woven walls also let fresh air pass through, keeping rooms cool in hot weather. Modern architects now treat the dry bamboo poles with natural salt solutions so insects cannot eat the wood and the comfortable houses last for many decades.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'a1-exp-arc-1',
        word: 'tropical',
        partOfSpeech: 'adjective',
        simpleDefinition: 'From warm parts of the world near the equator where it rains a lot.',
        contextMeaning: 'Warm, rainy regions where bamboo grows naturally.',
        originalSentence: 'In warm tropical countries with heavy rain, builders have used bamboo for hundreds of years to make family homes.',
        exampleSentence: 'Bananas and mangoes grow well in tropical weather.',
        synonyms: ['warm', 'equatorial'],
        arabicTranslation: 'استوائي'
      },
      {
        id: 'a1-exp-arc-2',
        word: 'stem',
        partOfSpeech: 'noun',
        simpleDefinition: 'The main tall upright part of a plant that supports the leaves.',
        contextMeaning: 'The tall woody pole of the bamboo plant.',
        originalSentence: 'A hardwood tree takes thirty years to grow tall enough for building, but a bamboo stem reaches its full height in just three or four years.',
        exampleSentence: 'The sunflower had a thick green stem.',
        synonyms: ['stalk', 'pole', 'trunk'],
        arabicTranslation: 'ساق النبات'
      },
      {
        id: 'a1-exp-arc-3',
        word: 'shoots',
        partOfSpeech: 'noun',
        simpleDefinition: 'New young plant parts that grow up from the ground or roots.',
        contextMeaning: 'Fresh young bamboo stems growing from the living roots after cutting.',
        originalSentence: 'Even better, when farmers cut a bamboo stem, the roots stay alive underground and send up new green shoots right away.',
        exampleSentence: 'Green shoots appeared in the garden after the spring rain.',
        synonyms: ['sprouts', 'new stems'],
        arabicTranslation: 'براعم / سيقان جديدة'
      },
      {
        id: 'a1-exp-arc-4',
        word: 'hollow',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Having an empty space inside instead of being solid all the way through.',
        contextMeaning: 'Empty like a tube inside the bamboo pole, making it light to lift.',
        originalSentence: 'Bamboo poles are hollow inside, which makes them light to carry but very strong.',
        exampleSentence: 'An owl made its home inside a hollow tree trunk.',
        synonyms: ['empty inside', 'tubular'],
        arabicTranslation: 'أجوف'
      },
      {
        id: 'a1-exp-arc-5',
        word: 'earthquakes',
        partOfSpeech: 'noun',
        simpleDefinition: 'Sudden shaking movements of the ground.',
        contextMeaning: 'Times when the earth shakes and stiff stone buildings can crack.',
        originalSentence: 'During strong winds or earthquakes, a bamboo house bends gently instead of breaking like heavy stone.',
        exampleSentence: 'Engineers design bridges in Japan to stay safe during earthquakes.',
        synonyms: ['ground tremors'],
        arabicTranslation: 'زلازل'
      },
      {
        id: 'a1-exp-arc-6',
        word: 'bends',
        partOfSpeech: 'verb',
        simpleDefinition: 'Curves or moves slightly without snapping in two.',
        contextMeaning: 'Flexes safely in strong wind or ground shaking instead of falling down.',
        originalSentence: 'During strong winds or earthquakes, a bamboo house bends gently instead of breaking like heavy stone.',
        exampleSentence: 'Tall grass bends in the wind and stands up again.',
        synonyms: ['flexes', 'curves'],
        arabicTranslation: 'ينحني'
      },
      {
        id: 'a1-exp-arc-7',
        word: 'woven',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Made by crossing thin strips over and under each other.',
        contextMeaning: 'Walls made from flat strips of bamboo crossed together like a basket.',
        originalSentence: 'Wide bamboo roofs and woven walls also let fresh air pass through, keeping rooms cool in hot weather.',
        exampleSentence: 'She carried fresh fruit in a woven straw basket.',
        synonyms: ['interlaced', 'plaited'],
        arabicTranslation: 'منسوج'
      },
      {
        id: 'a1-exp-arc-8',
        word: 'fresh',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Clean, cool, and pleasant to breathe.',
        contextMeaning: 'Moving outdoor air that keeps a bamboo house comfortable.',
        originalSentence: 'Wide bamboo roofs and woven walls also let fresh air pass through, keeping rooms cool in hot weather.',
        exampleSentence: 'We opened the bedroom window to let in fresh morning air.',
        synonyms: ['clean', 'cool'],
        arabicTranslation: 'نقي / منعش'
      }
    ],
    questions: [
      {
        id: 'a1-exp-arc-q1',
        type: 'true_false_not_given',
        prompt: 'Bamboo is actually a giant grass, even though it looks like a tall thin tree.',
        correctAnswer: 'True',
        explanation: 'Paragraph 1 states that although bamboo looks like a tall thin tree, it is actually a giant grass.',
        passageEvidence: 'Although bamboo looks like a tall thin tree, it is actually a giant grass that grows very fast in wet soil.'
      },
      {
        id: 'a1-exp-arc-q2',
        type: 'true_false_not_given',
        prompt: 'When a farmer cuts a bamboo stem, the underground roots die immediately.',
        correctAnswer: 'False',
        explanation: 'Paragraph 2 states that when farmers cut a bamboo stem, the roots stay alive underground and send up new green shoots right away.',
        passageEvidence: 'Even better, when farmers cut a bamboo stem, the roots stay alive underground and send up new green shoots right away.'
      },
      {
        id: 'a1-exp-arc-q3',
        type: 'true_false_not_given',
        prompt: 'Builders paint bamboo roofs blue to keep rain away.',
        correctAnswer: 'Not Given',
        explanation: 'The passage mentions wide bamboo roofs, but it never mentions painting them blue.',
        passageEvidence: 'Wide bamboo roofs and woven walls also let fresh air pass through, keeping rooms cool in hot weather.'
      },
      {
        id: 'a1-exp-arc-q4',
        type: 'multiple_choice',
        prompt: 'How long does it take a bamboo stem to reach its full height for building?',
        options: [
          'Three or four years',
          'Thirty years',
          'One hundred years',
          'Only two days'
        ],
        correctAnswer: 'Three or four years',
        explanation: 'Paragraph 2 states that a bamboo stem reaches its full height in just three or four years.',
        passageEvidence: 'A hardwood tree takes thirty years to grow tall enough for building, but a bamboo stem reaches its full height in just three or four years.'
      },
      {
        id: 'a1-exp-arc-q5',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 3: Bamboo poles are ______ inside, which makes them light to carry.',
        correctAnswer: 'hollow',
        acceptedAnswers: ['hollow'],
        explanation: 'Paragraph 3 states that bamboo poles are hollow inside.',
        passageEvidence: 'Bamboo poles are hollow inside, which makes them light to carry but very strong.'
      },
      {
        id: 'a1-exp-arc-q6',
        type: 'vocabulary_in_context',
        prompt: 'What does the word "bends" mean in Paragraph 3?',
        options: [
          'Curves gently without breaking',
          'Melts in hot summer rain',
          'Sinks deep under the mud',
          'Turns into solid gray stone'
        ],
        correctAnswer: 'Curves gently without breaking',
        explanation: 'In Paragraph 3, a bamboo house bends gently instead of breaking during strong winds or earthquakes.',
        passageEvidence: 'During strong winds or earthquakes, a bamboo house bends gently instead of breaking like heavy stone.'
      },
      {
        id: 'a1-exp-arc-q7',
        type: 'short_answer',
        prompt: 'Answer with TWO WORDS from Paragraph 2: What takes thirty years to grow tall enough for building?',
        correctAnswer: 'hardwood tree',
        acceptedAnswers: ['hardwood tree', 'a hardwood tree'],
        explanation: 'Paragraph 2 states that a hardwood tree takes thirty years to grow tall enough for building.',
        passageEvidence: 'A hardwood tree takes thirty years to grow tall enough for building, but a bamboo stem reaches its full height in just three or four years.'
      },
      {
        id: 'a1-exp-arc-q8',
        type: 'matching_information',
        prompt: 'Which paragraph explains why bamboo houses stay safe during earthquakes?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3'],
        correctAnswer: 'Paragraph 3',
        explanation: 'Paragraph 3 explains that during strong winds or earthquakes, a bamboo house bends gently instead of breaking.',
        passageEvidence: 'During strong winds or earthquakes, a bamboo house bends gently instead of breaking like heavy stone.'
      },
      {
        id: 'a1-exp-arc-q9',
        type: 'note_completion',
        prompt: 'Complete the study note with ONE WORD from Paragraph 3: Wide bamboo roofs and woven ______ let fresh air pass through.',
        correctAnswer: 'walls',
        acceptedAnswers: ['walls'],
        explanation: 'Paragraph 3 states "Wide bamboo roofs and woven walls also let fresh air pass through".',
        passageEvidence: 'Wide bamboo roofs and woven walls also let fresh air pass through, keeping rooms cool in hot weather.'
      },
      {
        id: 'a1-exp-arc-q10',
        type: 'multiple_choice',
        prompt: 'How do woven bamboo walls help families in hot weather?',
        options: [
          'They let fresh air pass through to keep rooms cool',
          'They trap hot smoke inside the living room',
          'They block all wind so the house stays very warm',
          'They collect snow on the floor during winter'
        ],
        correctAnswer: 'They let fresh air pass through to keep rooms cool',
        explanation: 'Paragraph 3 states that wide bamboo roofs and woven walls let fresh air pass through, keeping rooms cool in hot weather.',
        passageEvidence: 'Wide bamboo roofs and woven walls also let fresh air pass through, keeping rooms cool in hot weather.'
      }
    ]
  }
];

export const BATCH_A1_EXPANSION_LESSONS: ReadingLesson[] = rawA1ExpansionLessons.map((lesson) => {
  const wordCount = lesson.passage.trim().split(/\s+/).filter(Boolean).length;
  return {
    ...lesson,
    wordCount,
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
    illustrationUrl: getEditorialIllustrationUri(lesson.id, lesson.topic, lesson.level),
    illustrationAlt: getPassageIllustrationAlt(lesson.id, lesson.illustrationAlt),
  };
});
