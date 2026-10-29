import { ReadingLesson } from '../../types/reading';
import { getEditorialIllustrationUri, getPassageIllustrationAlt } from '../../utils/illustrations';

const rawA2ExpansionLessons: Omit<ReadingLesson, 'illustrationUrl' | 'wordCount' | 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'a2-sci-drip-irrigation',
    title: 'How Drip Irrigation Saves Water on Dry Farms',
    level: 'A2',
    topic: 'Science and technology',
    status: 'published',
    estimatedMinutes: 6,
    generationBatch: 'batch-expansion-a2',
    imageStatus: 'ready',
    introduction: 'Discover how narrow plastic tubes with tiny holes deliver water drop by drop directly to plant roots instead of wasting it in the hot sun.',
    illustrationAlt: 'Photograph of agricultural drip irrigation lines watering rows of young green crops',
    passage: [
      'In many dry parts of the world, farmers do not have enough river water or rain to grow food using traditional methods. In the past, most farms flooded whole fields with water or used large metal sprinklers that sprayed water high into the air. However, on hot and windy afternoons, more than half of that sprayed water evaporates into the air before it ever touches the soil.',
      'In the 1960s, agricultural engineers developed a much smarter method called drip irrigation. Instead of spraying water everywhere, farmers lay long, narrow plastic tubes along the rows of crops right next to the plant stems. Each tube has tiny holes called emitters spaced a few centimetres apart. When a farmer opens the main valve, water moves slowly through the tubes and drips gently onto the soil directly above the roots.',
      'Because only the soil around each vegetable plant gets wet, the wide spaces between crop rows stay completely dry. This simple change brings two major benefits. First, weeds cannot grow easily in the dry dirt between the rows, so farmers spend far less time pulling weeds by hand. Second, crops receive a steady, even supply of moisture every day without washing away valuable soil nutrients.',
      'Today, thousands of fruit orchards and vegetable farms in dry regions use drip tubes connected to small solar pumps. By delivering every drop straight to the roots, farmers can grow twice as much food while using up to fifty percent less water than old sprinkler systems. Simple mesh filters at the main water tank also stop tiny grains of sand from blocking the narrow emitters during the long growing season. Because the plastic lines last for many years with basic care, small family farms can quickly recover the cost of the equipment through higher harvests.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'a2-exp-sci-1',
        word: 'sprinklers',
        partOfSpeech: 'noun',
        simpleDefinition: 'Devices that spray water into the air to water plants or grass.',
        contextMeaning: 'Farm machines that throw water across fields through the air.',
        originalSentence: 'In the past, most farms flooded whole fields with water or used large metal sprinklers that sprayed water high into the air.',
        exampleSentence: 'The park sprinklers turned on early in the morning to water the grass.',
        synonyms: ['sprayers'],
        arabicTranslation: 'رشاشات المياه'
      },
      {
        id: 'a2-exp-sci-2',
        word: 'evaporates',
        partOfSpeech: 'verb',
        simpleDefinition: 'Changes from liquid water into invisible gas in the warm air.',
        contextMeaning: 'Dries up in the hot sun and wind before reaching the plants.',
        originalSentence: 'However, on hot and windy afternoons, more than half of that sprayed water evaporates into the air before it ever touches the soil.',
        exampleSentence: 'Water in a shallow dish evaporates quickly on a sunny windowsill.',
        synonyms: ['dries up', 'turns to vapor'],
        arabicTranslation: 'يتبخر'
      },
      {
        id: 'a2-exp-sci-3',
        word: 'agricultural',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Related to farming, growing crops, and raising farm animals.',
        contextMeaning: 'Working with farm tools and crop watering systems.',
        originalSentence: 'In the 1960s, agricultural engineers developed a much smarter method called drip irrigation.',
        exampleSentence: 'The region is famous for its rich agricultural land.',
        synonyms: ['farming'],
        arabicTranslation: 'زراعي'
      },
      {
        id: 'a2-exp-sci-4',
        word: 'emitters',
        partOfSpeech: 'noun',
        simpleDefinition: 'Small openings or nozzles that let out drops of liquid at a slow rate.',
        contextMeaning: 'The tiny holes along the plastic tube that release single drops of water.',
        originalSentence: 'Each tube has tiny holes called emitters spaced a few centimetres apart.',
        exampleSentence: 'Farmers check the emitters to make sure mud does not block the holes.',
        synonyms: ['openings', 'nozzles'],
        arabicTranslation: 'نقاطات / فتحات تنقيط'
      },
      {
        id: 'a2-exp-sci-5',
        word: 'valve',
        partOfSpeech: 'noun',
        simpleDefinition: 'A handle or device on a pipe that opens and closes to control the flow of water.',
        contextMeaning: 'The main tap that starts water flowing into the field tubes.',
        originalSentence: 'When a farmer opens the main valve, water moves slowly through the tubes and drips gently onto the soil directly above the roots.',
        exampleSentence: 'The plumber turned off the water valve under the kitchen sink.',
        synonyms: ['tap', 'control switch'],
        arabicTranslation: 'صمام'
      },
      {
        id: 'a2-exp-sci-6',
        word: 'weeds',
        partOfSpeech: 'noun',
        simpleDefinition: 'Wild plants growing where they are not wanted, taking water from farm crops.',
        contextMeaning: 'Unwanted wild plants that usually grow between rows of vegetables.',
        originalSentence: 'First, weeds cannot grow easily in the dry dirt between the rows, so farmers spend far less time pulling weeds by hand.',
        exampleSentence: 'We spent Saturday morning pulling weeds from the tomato bed.',
        synonyms: ['wild plants'],
        arabicTranslation: 'أعشاب ضارة'
      },
      {
        id: 'a2-exp-sci-7',
        word: 'moisture',
        partOfSpeech: 'noun',
        simpleDefinition: 'Small amounts of water in the soil or air that keep things damp.',
        contextMeaning: 'Water in the earth that plant roots drink to grow.',
        originalSentence: 'Second, crops receive a steady, even supply of moisture every day without washing away valuable soil nutrients.',
        exampleSentence: 'Dead leaves on the ground help keep moisture in the forest soil.',
        synonyms: ['dampness', 'water'],
        arabicTranslation: 'رطوبة'
      },
      {
        id: 'a2-exp-sci-8',
        word: 'orchards',
        partOfSpeech: 'noun',
        simpleDefinition: 'Farms or pieces of land planted with fruit trees.',
        contextMeaning: 'Fruit farms that use drip tubes to water rows of trees.',
        originalSentence: 'Today, thousands of fruit orchards and vegetable farms in dry regions use drip tubes connected to small solar pumps.',
        exampleSentence: 'Apple orchards cover the hills outside the village.',
        synonyms: ['fruit groves', 'fruit farms'],
        arabicTranslation: 'بساتين الفاكهة'
      }
    ],
    questions: [
      {
        id: 'a2-exp-sci-q1',
        type: 'true_false_not_given',
        prompt: 'On hot and windy afternoons, more than half of the water from farm sprinklers can evaporate before touching the soil.',
        correctAnswer: 'True',
        explanation: 'Paragraph 1 states that on hot and windy afternoons, more than half of that sprayed water evaporates into the air before it ever touches the soil.',
        passageEvidence: 'However, on hot and windy afternoons, more than half of that sprayed water evaporates into the air before it ever touches the soil.'
      },
      {
        id: 'a2-exp-sci-q2',
        type: 'true_false_not_given',
        prompt: 'Drip irrigation wets the wide spaces between crop rows so weeds can grow faster.',
        correctAnswer: 'False',
        explanation: 'Paragraph 3 states that the wide spaces between crop rows stay completely dry, so weeds cannot grow easily.',
        passageEvidence: 'Because only the soil around each vegetable plant gets wet, the wide spaces between crop rows stay completely dry.'
      },
      {
        id: 'a2-exp-sci-q3',
        type: 'true_false_not_given',
        prompt: 'Plastic drip tubes must be replaced every two years.',
        correctAnswer: 'Not Given',
        explanation: 'The passage explains how plastic drip tubes work, but it never states how often they must be replaced.',
        passageEvidence: 'Instead of spraying water everywhere, farmers lay long, narrow plastic tubes along the rows of crops right next to the plant stems.'
      },
      {
        id: 'a2-exp-sci-q4',
        type: 'multiple_choice',
        prompt: 'How does drip irrigation deliver water to crops?',
        options: [
          'Through tiny holes in narrow plastic tubes laid right next to plant stems',
          'By spraying water high into the air from tall metal towers',
          'By flooding the entire field with deep river water once a month',
          'By carrying buckets of water by hand to every leaf'
        ],
        correctAnswer: 'Through tiny holes in narrow plastic tubes laid right next to plant stems',
        explanation: 'Paragraph 2 explains that farmers lay narrow plastic tubes with tiny holes called emitters right next to the plant stems so water drips above the roots.',
        passageEvidence: 'Instead of spraying water everywhere, farmers lay long, narrow plastic tubes along the rows of crops right next to the plant stems.'
      },
      {
        id: 'a2-exp-sci-q5',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 2: Each tube has tiny holes called ______ spaced a few centimetres apart.',
        correctAnswer: 'emitters',
        acceptedAnswers: ['emitters'],
        explanation: 'Paragraph 2 states that each tube has tiny holes called emitters.',
        passageEvidence: 'Each tube has tiny holes called emitters spaced a few centimetres apart.'
      },
      {
        id: 'a2-exp-sci-q6',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 1, what does the word "evaporates" mean?',
        options: [
          'Turns from liquid water into gas in the warm air',
          'Freezes into solid ice on the plant leaves',
          'Sinks deep into underground rock caves',
          'Mixes with mud at the bottom of a river'
        ],
        correctAnswer: 'Turns from liquid water into gas in the warm air',
        explanation: '"Evaporates into the air" means liquid water dries up and turns into water vapor before reaching the soil.',
        passageEvidence: 'However, on hot and windy afternoons, more than half of that sprayed water evaporates into the air before it ever touches the soil.'
      },
      {
        id: 'a2-exp-sci-q7',
        type: 'short_answer',
        prompt: 'Answer with TWO WORDS from Paragraph 4: What kind of pumps are often connected to drip tubes on modern dry-region farms?',
        correctAnswer: 'solar pumps',
        acceptedAnswers: ['solar pumps', 'small solar pumps'],
        explanation: 'Paragraph 4 states that fruit orchards and vegetable farms use drip tubes connected to small solar pumps.',
        passageEvidence: 'Today, thousands of fruit orchards and vegetable farms in dry regions use drip tubes connected to small solar pumps.'
      },
      {
        id: 'a2-exp-sci-q8',
        type: 'matching_information',
        prompt: 'Which paragraph explains why drip irrigation reduces the number of weeds in a field?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4'],
        correctAnswer: 'Paragraph 3',
        explanation: 'Paragraph 3 explains that because the spaces between crop rows stay dry, weeds cannot grow easily.',
        passageEvidence: 'First, weeds cannot grow easily in the dry dirt between the rows, so farmers spend far less time pulling weeds by hand.'
      },
      {
        id: 'a2-exp-sci-q9',
        type: 'note_completion',
        prompt: 'Complete the study note with TWO WORDS from Paragraph 4: Drip irrigation uses up to ______ percent less water than old sprinkler systems.',
        correctAnswer: 'fifty',
        acceptedAnswers: ['fifty', '50', 'fifty percent'],
        explanation: 'Paragraph 4 states that farmers use up to fifty percent less water than old sprinkler systems.',
        passageEvidence: 'By delivering every drop straight to the roots, farmers can grow twice as much food while using up to fifty percent less water than old sprinkler systems.'
      },
      {
        id: 'a2-exp-sci-q10',
        type: 'multiple_choice',
        prompt: 'What is the main advantage of keeping the soil between crop rows dry?',
        options: [
          'Weeds cannot grow easily, saving farmers time and effort',
          'Tractors can drive faster at night without headlights',
          'Rainstorms never fall on the vegetable farm',
          'Plant leaves turn bright yellow in the summer'
        ],
        correctAnswer: 'Weeds cannot grow easily, saving farmers time and effort',
        explanation: 'Paragraph 3 states that weeds cannot grow easily in the dry dirt between the rows, so farmers spend far less time pulling weeds by hand.',
        passageEvidence: 'First, weeds cannot grow easily in the dry dirt between the rows, so farmers spend far less time pulling weeds by hand.'
      }
    ]
  },
  {
    id: 'a2-env-pollinator-meadows',
    title: 'Turning City Park Lawns into Wildflower Meadows',
    level: 'A2',
    topic: 'Environmental science',
    status: 'published',
    estimatedMinutes: 6,
    generationBatch: 'batch-expansion-a2',
    imageStatus: 'ready',
    introduction: 'Learn why many cities are replacing short green grass in public parks with colourful native wildflowers to help bees and butterflies survive.',
    illustrationAlt: 'Photograph of a colourful wildflower meadow blooming in an urban park',
    passage: [
      'For many decades, city parks around the world looked very similar. Most parks had wide carpets of short green grass that workers cut every week with loud petrol lawnmowers. While short grass is useful for football games and family picnics, ecologists say that plain lawns offer almost no food or shelter for wild insects.',
      'To help urban nature recover, many city councils now leave large sections of their parks uncut and plant native wildflower seeds instead. Within a single spring season, these areas grow into colourful meadows filled with clover, daisies, and purple lavender. Unlike short grass, wildflowers produce rich nectar and pollen from April until October.',
      'Scientists who study city parks have recorded dramatic changes in these new meadows. A single wildflower patch can support ten times more bumblebees, butterflies, and beetles than a mown lawn of the same size. In addition, tall stems and seed heads provide warm winter shelter for beneficial insects and food for small songbirds.',
      'Wildflower meadows also save money and reduce pollution for city governments. Because gardeners only cut a meadow once or twice a year in late autumn, park machines burn far less fuel. Furthermore, native wildflowers have deep roots that survive dry summers without extra watering, making cities greener and more lively. To help park visitors understand why the grass looks tall and untidy, workers put up wooden information signs along the walking paths and mow neat borders around wooden benches. Local primary schools also bring science classes to count colorful butterflies in the summer, turning ordinary city parks into lively outdoor nature classrooms where children and adults can watch wild pollinators thrive together every sunny afternoon. Neighbours often collect ripe flower seeds in autumn to plant in their own front gardens and window boxes.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'a2-exp-env-1',
        word: 'lawnmowers',
        partOfSpeech: 'noun',
        simpleDefinition: 'Machines with spinning blades used for cutting grass.',
        contextMeaning: 'Petrol-powered park machines used to keep grass short.',
        originalSentence: 'Most parks had wide carpets of short green grass that workers cut every week with loud petrol lawnmowers.',
        exampleSentence: 'The sound of lawnmowers filled the neighborhood on Saturday morning.',
        synonyms: ['grass cutters'],
        arabicTranslation: 'جزازات العشب'
      },
      {
        id: 'a2-exp-env-2',
        word: 'ecologists',
        partOfSpeech: 'noun',
        simpleDefinition: 'Scientists who study how plants, animals, and their environment work together.',
        contextMeaning: 'Nature scientists who study why insects struggle to survive on short lawns.',
        originalSentence: 'While short grass is useful for football games and family picnics, ecologists say that plain lawns offer almost no food or shelter for wild insects.',
        exampleSentence: 'Ecologists counted the number of frogs living in the forest pond.',
        synonyms: ['environmental scientists'],
        arabicTranslation: 'علماء البيئة'
      },
      {
        id: 'a2-exp-env-3',
        word: 'native',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Growing naturally in a place for a long time, rather than brought from another country.',
        contextMeaning: 'Local wildflowers that naturally belong to that region and suit local bees.',
        originalSentence: 'To help urban nature recover, many city councils now leave large sections of their parks uncut and plant native wildflower seeds instead.',
        exampleSentence: 'Oak trees are native to many parts of Europe.',
        synonyms: ['local', 'indigenous'],
        arabicTranslation: 'محلي / أصلي'
      },
      {
        id: 'a2-exp-env-4',
        word: 'meadows',
        partOfSpeech: 'noun',
        simpleDefinition: 'Open fields covered with tall grass and wild blooming flowers.',
        contextMeaning: 'Park areas where tall grass and wildflowers grow freely.',
        originalSentence: 'Within a single spring season, these areas grow into colourful meadows filled with clover, daisies, and purple lavender.',
        exampleSentence: 'Butterflies flew above the sunny mountain meadows.',
        synonyms: ['fields', 'grasslands'],
        arabicTranslation: 'مروج الزهور البرية'
      },
      {
        id: 'a2-exp-env-5',
        word: 'nectar',
        partOfSpeech: 'noun',
        simpleDefinition: 'A sweet liquid inside flowers that bees and butterflies drink for energy.',
        contextMeaning: 'The sweet flower food that wildflowers provide from spring to autumn.',
        originalSentence: 'Unlike short grass, wildflowers produce rich nectar and pollen from April until October.',
        exampleSentence: 'Bees visit hundreds of blossoms each day to collect sweet nectar.',
        synonyms: ['flower syrup'],
        arabicTranslation: 'رحيق الأزهار'
      },
      {
        id: 'a2-exp-env-6',
        word: 'dramatic',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Very large, sudden, and easy to notice.',
        contextMeaning: 'Big, clear increases in the number of bees and butterflies.',
        originalSentence: 'Scientists who study city parks have recorded dramatic changes in these new meadows.',
        exampleSentence: 'New train lines brought a dramatic drop in street traffic.',
        synonyms: ['striking', 'major', 'impressive'],
        arabicTranslation: 'ملحوظ / كبير جداً'
      },
      {
        id: 'a2-exp-env-7',
        word: 'beneficial',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Helpful and good for nature or people.',
        contextMeaning: 'Useful insects that pollinate plants and keep park nature healthy.',
        originalSentence: 'In addition, tall stems and seed heads provide warm winter shelter for beneficial insects and food for small songbirds.',
        exampleSentence: 'Ladybugs are beneficial insects because they protect garden plants.',
        synonyms: ['helpful', 'useful'],
        arabicTranslation: 'مفيد / نافع'
      },
      {
        id: 'a2-exp-env-8',
        word: 'pollution',
        partOfSpeech: 'noun',
        simpleDefinition: 'Dirty smoke, gases, or waste that harms the air, water, or land.',
        contextMeaning: 'Exhaust smoke and noise produced by petrol lawnmowers.',
        originalSentence: 'Wildflower meadows also save money and reduce pollution for city governments.',
        exampleSentence: 'Electric buses help reduce air pollution in busy city centers.',
        synonyms: ['contamination', 'emissions'],
        arabicTranslation: 'تلوث'
      }
    ],
    questions: [
      {
        id: 'a2-exp-env-q1',
        type: 'true_false_not_given',
        prompt: 'Plain short-grass lawns provide very little food or shelter for wild insects.',
        correctAnswer: 'True',
        explanation: 'Paragraph 1 states that plain lawns offer almost no food or shelter for wild insects.',
        passageEvidence: 'While short grass is useful for football games and family picnics, ecologists say that plain lawns offer almost no food or shelter for wild insects.'
      },
      {
        id: 'a2-exp-env-q2',
        type: 'true_false_not_given',
        prompt: 'Gardeners must cut wildflower meadows every week with petrol lawnmowers.',
        correctAnswer: 'False',
        explanation: 'Paragraph 4 states that gardeners only cut a meadow once or twice a year in late autumn.',
        passageEvidence: 'Because gardeners only cut a meadow once or twice a year in late autumn, park machines burn far less fuel.'
      },
      {
        id: 'a2-exp-env-q3',
        type: 'true_false_not_given',
        prompt: 'Purple lavender grows taller than white daisies in every city park.',
        correctAnswer: 'Not Given',
        explanation: 'Paragraph 2 mentions clover, daisies, and purple lavender, but it never compares their heights.',
        passageEvidence: 'Within a single spring season, these areas grow into colourful meadows filled with clover, daisies, and purple lavender.'
      },
      {
        id: 'a2-exp-env-q4',
        type: 'multiple_choice',
        prompt: 'How many more bumblebees and butterflies can a wildflower patch support compared to a mown lawn of the same size?',
        options: [
          'Ten times more',
          'Twice as many',
          'Slightly fewer',
          'Exactly the same number'
        ],
        correctAnswer: 'Ten times more',
        explanation: 'Paragraph 3 states that a single wildflower patch can support ten times more bumblebees, butterflies, and beetles than a mown lawn of the same size.',
        passageEvidence: 'A single wildflower patch can support ten times more bumblebees, butterflies, and beetles than a mown lawn of the same size.'
      },
      {
        id: 'a2-exp-env-q5',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 2: Unlike short grass, wildflowers produce rich ______ and pollen from April until October.',
        correctAnswer: 'nectar',
        acceptedAnswers: ['nectar'],
        explanation: 'Paragraph 2 states that wildflowers produce rich nectar and pollen.',
        passageEvidence: 'Unlike short grass, wildflowers produce rich nectar and pollen from April until October.'
      },
      {
        id: 'a2-exp-env-q6',
        type: 'vocabulary_in_context',
        prompt: 'What does the word "beneficial" mean in Paragraph 3?',
        options: [
          'Helpful and good for nature',
          'Loud and dangerous to people',
          'Too small to see without glasses',
          'Active only during heavy rain'
        ],
        correctAnswer: 'Helpful and good for nature',
        explanation: '"Beneficial insects" means insects that are helpful to the park ecosystem.',
        passageEvidence: 'In addition, tall stems and seed heads provide warm winter shelter for beneficial insects and food for small songbirds.'
      },
      {
        id: 'a2-exp-env-q7',
        type: 'short_answer',
        prompt: 'Answer with ONE OR TWO WORDS from Paragraph 3: Which animals eat the seed heads in wildflower meadows during winter?',
        correctAnswer: 'small songbirds',
        acceptedAnswers: ['small songbirds', 'songbirds', 'birds'],
        explanation: 'Paragraph 3 states that tall stems and seed heads provide food for small songbirds.',
        passageEvidence: 'In addition, tall stems and seed heads provide warm winter shelter for beneficial insects and food for small songbirds.'
      },
      {
        id: 'a2-exp-env-q8',
        type: 'matching_information',
        prompt: 'Which paragraph explains how wildflower meadows help city councils save fuel and water?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4'],
        correctAnswer: 'Paragraph 4',
        explanation: 'Paragraph 4 explains that park machines burn far less fuel and deep wildflower roots survive dry summers without extra watering.',
        passageEvidence: 'Because gardeners only cut a meadow once or twice a year in late autumn, park machines burn far less fuel.'
      },
      {
        id: 'a2-exp-env-q9',
        type: 'note_completion',
        prompt: 'Complete the study note with ONE WORD from Paragraph 4: Native wildflowers have deep ______ that survive dry summers without extra watering.',
        correctAnswer: 'roots',
        acceptedAnswers: ['roots'],
        explanation: 'Paragraph 4 states that native wildflowers have deep roots that survive dry summers without extra watering.',
        passageEvidence: 'Furthermore, native wildflowers have deep roots that survive dry summers without extra watering, making cities greener and more lively.'
      },
      {
        id: 'a2-exp-env-q10',
        type: 'multiple_choice',
        prompt: 'Why do city parks still keep some areas of short green grass?',
        options: [
          'For football games and family picnics',
          'To feed butterflies from April to October',
          'To provide winter shelter for beetles',
          'To use more petrol in park lawnmowers'
        ],
        correctAnswer: 'For football games and family picnics',
        explanation: 'Paragraph 1 notes that short grass is useful for football games and family picnics, while Paragraph 2 explains that councils convert sections of parks into meadows.',
        passageEvidence: 'While short grass is useful for football games and family picnics, ecologists say that plain lawns offer almost no food or shelter for wild insects.'
      }
    ]
  },
  {
    id: 'a2-psy-background-music-study',
    title: 'How Background Noise and Music Affect Reading Focus',
    level: 'A2',
    topic: 'Psychology and human behaviour',
    status: 'published',
    estimatedMinutes: 6,
    generationBatch: 'batch-expansion-a2',
    imageStatus: 'ready',
    introduction: 'Find out why songs with lyrics can slow down your reading comprehension while gentle instrumental music or quiet rooms help you concentrate.',
    illustrationAlt: 'Photograph of headphones resting on an open study book on a desk',
    passage: [
      'Walk into any university library or coffee shop, and you will see dozens of students wearing headphones while they read textbooks. Many learners say that listening to their favourite pop songs makes studying feel more enjoyable. However, cognitive psychologists have tested how different sounds affect the brain during reading, and their findings surprise many students.',
      'In controlled experiments, researchers asked volunteers to read difficult articles in three environments: complete silence, gentle instrumental music without voices, and popular songs with sung lyrics. Afterwards, all three groups answered comprehension questions about the articles. The results showed that students who listened to songs with lyrics scored significantly lower than the other two groups.',
      'Psychologists explain that this happens because the human brain has a single language-processing system. When you read a textbook, your brain works hard to turn written words into meaning. If a singer’s voice is playing in your ears at the same time, your brain automatically tries to process the song words too. Switching back and forth between the book and the song wastes mental energy.',
      'Does this mean students must always study in total silence? Not necessarily. Soft instrumental piano music or steady nature sounds like rainfall do not contain spoken words, so they do not compete with reading. In fact, in a noisy café or bus, gentle instrumental music can mask sudden conversations around you and help you stay focused. Psychologists recommend keeping the volume low and choosing familiar melodies with a slow, steady tempo so the music stays peacefully in the background. When learners later switch to solving simple practice math problems or organizing colorful study notes, they can enjoy listening to livelier songs, while saving quiet instrumental tracks for deep textbook reading and careful essay writing.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'a2-exp-psy-1',
        word: 'enjoyable',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Pleasant and giving happiness or fun.',
        contextMeaning: 'More pleasant than sitting in a quiet room.',
        originalSentence: 'Many learners say that listening to their favourite pop songs makes studying feel more enjoyable.',
        exampleSentence: 'Good weather made our weekend camping trip very enjoyable.',
        synonyms: ['pleasant', 'fun'],
        arabicTranslation: 'ممتع'
      },
      {
        id: 'a2-exp-psy-2',
        word: 'instrumental',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Played only on musical instruments, with no singing or spoken words.',
        contextMeaning: 'Music such as solo piano or guitar that has no human voice.',
        originalSentence: 'In controlled experiments, researchers asked volunteers to read difficult articles in three environments: complete silence, gentle instrumental music without voices, and popular songs with sung lyrics.',
        exampleSentence: 'She listens to calm instrumental music while writing essays.',
        synonyms: ['without vocals', 'wordless'],
        arabicTranslation: 'موسيقى آلية بلا غناء'
      },
      {
        id: 'a2-exp-psy-3',
        word: 'lyrics',
        partOfSpeech: 'noun',
        simpleDefinition: 'The words sung in a song.',
        contextMeaning: 'Sung words that distract the brain while trying to read a book.',
        originalSentence: 'In controlled experiments, researchers asked volunteers to read difficult articles in three environments: complete silence, gentle instrumental music without voices, and popular songs with sung lyrics.',
        exampleSentence: 'He knows all the lyrics to his favourite rock song.',
        synonyms: ['song words'],
        arabicTranslation: 'كلمات الأغنية'
      },
      {
        id: 'a2-exp-psy-4',
        word: 'comprehension',
        partOfSpeech: 'noun',
        simpleDefinition: 'The ability to understand the meaning of something you read or hear.',
        contextMeaning: 'How well volunteers understood the articles they read in the test.',
        originalSentence: 'Afterwards, all three groups answered comprehension questions about the articles.',
        exampleSentence: 'Reading every day improves your English comprehension.',
        synonyms: ['understanding'],
        arabicTranslation: 'فهم / استيعاب'
      },
      {
        id: 'a2-exp-psy-5',
        word: 'significantly',
        partOfSpeech: 'adverb',
        simpleDefinition: 'In a way that is large and clear enough to be important.',
        contextMeaning: 'By a noticeably large amount on the reading test.',
        originalSentence: 'The results showed that students who listened to songs with lyrics scored significantly lower than the other two groups.',
        exampleSentence: 'Train travel is significantly faster than driving in heavy traffic.',
        synonyms: ['considerably', 'noticeably', 'much'],
        arabicTranslation: 'بشكل ملحوظ'
      },
      {
        id: 'a2-exp-psy-6',
        word: 'automatically',
        partOfSpeech: 'adverb',
        simpleDefinition: 'Happening by itself without you choosing or trying to do it.',
        contextMeaning: 'Listening to the singer’s words even when you are trying to ignore them.',
        originalSentence: 'If a singer’s voice is playing in your ears at the same time, your brain automatically tries to process the song words too.',
        exampleSentence: 'The glass doors open automatically when a shopper walks near them.',
        synonyms: ['naturally', 'by itself'],
        arabicTranslation: 'تلقائياً'
      },
      {
        id: 'a2-exp-psy-7',
        word: 'compete',
        partOfSpeech: 'verb',
        simpleDefinition: 'To try to use the same attention or resource at the same time.',
        contextMeaning: 'To fight against the textbook words for the brain’s language system.',
        originalSentence: 'Soft instrumental piano music or steady nature sounds like rainfall do not contain spoken words, so they do not compete with reading.',
        exampleSentence: 'Small forest plants compete with tall trees for sunlight.',
        synonyms: ['clash', 'interfere'],
        arabicTranslation: 'يتنافس / يتزاحم'
      },
      {
        id: 'a2-exp-psy-8',
        word: 'mask',
        partOfSpeech: 'verb',
        simpleDefinition: 'To cover up a sound, smell, or sight so people do not notice it.',
        contextMeaning: 'To block out sudden loud talking in a busy café or bus.',
        originalSentence: 'In fact, in a noisy café or bus, gentle instrumental music can mask sudden conversations around you and help you stay focused.',
        exampleSentence: 'The sound of the ocean waves helped mask traffic noise from the road.',
        synonyms: ['cover up', 'hide', 'block'],
        arabicTranslation: 'يحجب / يغطي على'
      }
    ],
    questions: [
      {
        id: 'a2-exp-psy-q1',
        type: 'true_false_not_given',
        prompt: 'In the reading experiments, students who listened to songs with lyrics scored lower than students who read in silence.',
        correctAnswer: 'True',
        explanation: 'Paragraph 2 states that students who listened to songs with lyrics scored significantly lower than the other two groups (silence and instrumental music).',
        passageEvidence: 'The results showed that students who listened to songs with lyrics scored significantly lower than the other two groups.'
      },
      {
        id: 'a2-exp-psy-q2',
        type: 'true_false_not_given',
        prompt: 'Soft instrumental piano music contains spoken words that confuse the brain.',
        correctAnswer: 'False',
        explanation: 'Paragraph 4 states that soft instrumental piano music or steady nature sounds do not contain spoken words, so they do not compete with reading.',
        passageEvidence: 'Soft instrumental piano music or steady nature sounds like rainfall do not contain spoken words, so they do not compete with reading.'
      },
      {
        id: 'a2-exp-psy-q3',
        type: 'true_false_not_given',
        prompt: 'Listening to classical violin music helps students solve math problems twice as fast.',
        correctAnswer: 'Not Given',
        explanation: 'The passage discusses reading comprehension with silence, instrumental music, and lyrics, never math problem speed or violin music.',
        passageEvidence: 'However, cognitive psychologists have tested how different sounds affect the brain during reading, and their findings surprise many students.'
      },
      {
        id: 'a2-exp-psy-q4',
        type: 'multiple_choice',
        prompt: 'Why do songs with lyrics make reading comprehension harder?',
        options: [
          'The brain automatically tries to process the sung words and the written words using the same language system',
          'Headphones make the room too dark to see the printed textbook page',
          'Pop songs are always shorter than three minutes',
          'Singers use words that are never found in dictionaries'
        ],
        correctAnswer: 'The brain automatically tries to process the sung words and the written words using the same language system',
        explanation: 'Paragraph 3 explains that the human brain has a single language-processing system, so it automatically tries to process both the textbook words and the singer’s words.',
        passageEvidence: 'If a singer’s voice is playing in your ears at the same time, your brain automatically tries to process the song words too.'
      },
      {
        id: 'a2-exp-psy-q5',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 3: Switching back and forth between the book and the song wastes mental ______.',
        correctAnswer: 'energy',
        acceptedAnswers: ['energy'],
        explanation: 'Paragraph 3 states that switching back and forth between the book and the song wastes mental energy.',
        passageEvidence: 'Switching back and forth between the book and the song wastes mental energy.'
      },
      {
        id: 'a2-exp-psy-q6',
        type: 'vocabulary_in_context',
        prompt: 'What does the word "mask" mean in Paragraph 4?',
        options: [
          'Cover up or block out distracting sounds',
          'Record a conversation on a mobile phone',
          'Wear a paper costume at a party',
          'Turn up the volume of a television'
        ],
        correctAnswer: 'Cover up or block out distracting sounds',
        explanation: 'In Paragraph 4, "mask sudden conversations" means covering up background talking in a noisy café or bus.',
        passageEvidence: 'In fact, in a noisy café or bus, gentle instrumental music can mask sudden conversations around you and help you stay focused.'
      },
      {
        id: 'a2-exp-psy-q7',
        type: 'short_answer',
        prompt: 'Answer with ONE WORD from Paragraph 4: What nature sound is mentioned as a helpful background sound without words?',
        correctAnswer: 'rainfall',
        acceptedAnswers: ['rainfall', 'rain'],
        explanation: 'Paragraph 4 mentions steady nature sounds like rainfall.',
        passageEvidence: 'Soft instrumental piano music or steady nature sounds like rainfall do not contain spoken words, so they do not compete with reading.'
      },
      {
        id: 'a2-exp-psy-q8',
        type: 'matching_information',
        prompt: 'Which paragraph describes the three different sound environments tested in the experiment?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4'],
        correctAnswer: 'Paragraph 2',
        explanation: 'Paragraph 2 lists the three environments: complete silence, gentle instrumental music without voices, and popular songs with sung lyrics.',
        passageEvidence: 'In controlled experiments, researchers asked volunteers to read difficult articles in three environments: complete silence, gentle instrumental music without voices, and popular songs with sung lyrics.'
      },
      {
        id: 'a2-exp-psy-q9',
        type: 'note_completion',
        prompt: 'Complete the study note with ONE WORD from Paragraph 3: The human brain has a single language-processing ______.',
        correctAnswer: 'system',
        acceptedAnswers: ['system'],
        explanation: 'Paragraph 3 states that the human brain has a single language-processing system.',
        passageEvidence: 'Psychologists explain that this happens because the human brain has a single language-processing system.'
      },
      {
        id: 'a2-exp-psy-q10',
        type: 'multiple_choice',
        prompt: 'When can listening to gentle instrumental music be especially helpful for a reader?',
        options: [
          'When studying in a noisy café or bus where people are talking nearby',
          'When trying to memorize the lyrics of a new pop song',
          'When listening to a teacher speak in a classroom',
          'When taking a speaking exam in a foreign language'
        ],
        correctAnswer: 'When studying in a noisy café or bus where people are talking nearby',
        explanation: 'Paragraph 4 states that in a noisy café or bus, gentle instrumental music can mask sudden conversations around you and help you stay focused.',
        passageEvidence: 'In fact, in a noisy café or bus, gentle instrumental music can mask sudden conversations around you and help you stay focused.'
      }
    ]
  },
  {
    id: 'a2-his-ice-houses',
    title: 'How People Kept Ice Frozen All Summer Before Refrigerators',
    level: 'A2',
    topic: 'History and archaeology',
    status: 'published',
    estimatedMinutes: 6,
    generationBatch: 'batch-expansion-a2',
    imageStatus: 'ready',
    introduction: 'Explore how ancient engineers and nineteenth-century towns cut winter lake ice and stored it underground using straw and sawdust.',
    illustrationAlt: 'Photograph of a traditional brick dome ice house built into a shaded hillside',
    passage: [
      'Today, anyone can open a kitchen refrigerator to get cold milk or ice cubes on a hot July afternoon. Yet electric refrigerators only became common in family homes about one hundred years ago. Before electricity, keeping fresh meat, butter, and fruit cold during the summer required clever engineering and hard winter work.',
      'For centuries, communities in Persia, China, Europe, and North America built special storage buildings called ice houses. Builders dug a deep pit into the ground on the shady north side of a hill, where the earth stays cool all year. Above the pit, they constructed thick walls of brick or stone with a small door that faced away from the warm southern sun.',
      'During the coldest weeks of January and February, workers walked onto frozen lakes and rivers with long metal saws. They cut heavy blocks of clear ice and pulled them on wooden sleds to the ice house. Inside the pit, workers stacked the blocks tightly together like a giant solid cube. Then they packed thick layers of dry straw, hay, or wooden sawdust around the ice.',
      'Straw and sawdust trap millions of tiny pockets of still air, which stops outside heat from reaching the ice. When a block melted slightly, a drain at the bottom of the pit carried the water away so the remaining ice stayed dry and solid. Thanks to this simple insulation, stored winter ice lasted right through August. Throughout the nineteenth century, horse-drawn wagons delivered heavy ice blocks from these cool underground houses to busy city markets, local hospitals, and family home iceboxes every single morning. Only when modern electric refrigerators became affordable for ordinary households in the twentieth century did this remarkable winter harvesting trade finally disappear from frozen rivers and northern lakes.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'a2-exp-his-1',
        word: 'engineering',
        partOfSpeech: 'noun',
        simpleDefinition: 'The skill of designing and building useful structures or machines.',
        contextMeaning: 'Clever building design used to keep underground rooms cold.',
        originalSentence: 'Before electricity, keeping fresh meat, butter, and fruit cold during the summer required clever engineering and hard winter work.',
        exampleSentence: 'Building a tunnel under the river required careful engineering.',
        synonyms: ['design', 'construction'],
        arabicTranslation: 'هندسة'
      },
      {
        id: 'a2-exp-his-2',
        word: 'pit',
        partOfSpeech: 'noun',
        simpleDefinition: 'A large deep hole dug into the ground.',
        contextMeaning: 'The deep underground chamber where winter ice blocks were stored.',
        originalSentence: 'Builders dug a deep pit into the ground on the shady north side of a hill, where the earth stays cool all year.',
        exampleSentence: 'Archaeologists uncovered ancient clay pots inside a deep pit.',
        synonyms: ['hole', 'chamber', 'excavation'],
        arabicTranslation: 'حفرة عميقة'
      },
      {
        id: 'a2-exp-his-3',
        word: 'shady',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Protected from direct sunlight; cool and in shadow.',
        contextMeaning: 'On the side of a hill where the hot sun rarely shines.',
        originalSentence: 'Builders dug a deep pit into the ground on the shady north side of a hill, where the earth stays cool all year.',
        exampleSentence: 'We found a shady bench under the trees to read our books.',
        synonyms: ['shaded', 'sheltered'],
        arabicTranslation: 'ظليل'
      },
      {
        id: 'a2-exp-his-4',
        word: 'sleds',
        partOfSpeech: 'noun',
        simpleDefinition: 'Low wooden frames on smooth runners used for sliding heavy loads across snow or ice.',
        contextMeaning: 'Wooden carts that slid over snow to carry heavy ice blocks from the lake.',
        originalSentence: 'They cut heavy blocks of clear ice and pulled them on wooden sleds to the ice house.',
        exampleSentence: 'Children rode wooden sleds down the snowy hill.',
        synonyms: ['sledges'],
        arabicTranslation: 'زلاجات خشبية'
      },
      {
        id: 'a2-exp-his-5',
        word: 'stacked',
        partOfSpeech: 'verb',
        simpleDefinition: 'Placed things neatly on top of each other in a tight pile.',
        contextMeaning: 'Piled the square blocks of ice closely together inside the underground room.',
        originalSentence: 'Inside the pit, workers stacked the blocks tightly together like a giant solid cube.',
        exampleSentence: 'The librarian stacked the new books on the wooden cart.',
        synonyms: ['piled', 'arranged'],
        arabicTranslation: 'رَصّ / كدّس'
      },
      {
        id: 'a2-exp-his-6',
        word: 'sawdust',
        partOfSpeech: 'noun',
        simpleDefinition: 'Tiny powder-like bits of wood that fall when someone saws timber.',
        contextMeaning: 'Dry wood powder packed around the ice to block heat.',
        originalSentence: 'Then they packed thick layers of dry straw, hay, or wooden sawdust around the ice.',
        exampleSentence: 'The floor of the carpenter’s workshop was covered in clean sawdust.',
        synonyms: ['wood shavings'],
        arabicTranslation: 'نشارة الخشب'
      },
      {
        id: 'a2-exp-his-7',
        word: 'pockets',
        partOfSpeech: 'noun',
        simpleDefinition: 'Tiny trapped spaces filled with air or liquid inside another material.',
        contextMeaning: 'Tiny spaces of still air held between bits of straw and sawdust.',
        originalSentence: 'Straw and sawdust trap millions of tiny pockets of still air, which stops outside heat from reaching the ice.',
        exampleSentence: 'Wool sweaters keep you warm because the fibers hold tiny pockets of air.',
        synonyms: ['spaces', 'bubbles'],
        arabicTranslation: 'جيوب هوائية دقيقة'
      },
      {
        id: 'a2-exp-his-8',
        word: 'insulation',
        partOfSpeech: 'noun',
        simpleDefinition: 'Material used to stop heat, cold, or sound from passing through.',
        contextMeaning: 'The protective cover of straw and sawdust that kept summer heat away from the ice.',
        originalSentence: 'Thanks to this simple insulation, stored winter ice lasted right through August.',
        exampleSentence: 'Thick roof insulation keeps houses warm in winter and cool in summer.',
        synonyms: ['heat barrier', 'protective layer'],
        arabicTranslation: 'عزل حراري'
      }
    ],
    questions: [
      {
        id: 'a2-exp-his-q1',
        type: 'true_false_not_given',
        prompt: 'Electric refrigerators became common in family homes about one hundred years ago.',
        correctAnswer: 'True',
        explanation: 'Paragraph 1 states that electric refrigerators only became common in family homes about one hundred years ago.',
        passageEvidence: 'Yet electric refrigerators only became common in family homes about one hundred years ago.'
      },
      {
        id: 'a2-exp-his-q2',
        type: 'true_false_not_given',
        prompt: 'Builders placed the door of an ice house facing toward the warm southern sun.',
        correctAnswer: 'False',
        explanation: 'Paragraph 2 states that they constructed thick walls with a small door that faced away from the warm southern sun.',
        passageEvidence: 'Above the pit, they constructed thick walls of brick or stone with a small door that faced away from the warm southern sun.'
      },
      {
        id: 'a2-exp-his-q3',
        type: 'true_false_not_given',
        prompt: 'Persian ice houses were taller than Chinese ice houses.',
        correctAnswer: 'Not Given',
        explanation: 'Paragraph 2 mentions Persia, China, Europe, and North America, but it never compares the heights of their ice houses.',
        passageEvidence: 'For centuries, communities in Persia, China, Europe, and North America built special storage buildings called ice houses.'
      },
      {
        id: 'a2-exp-his-q4',
        type: 'multiple_choice',
        prompt: 'Why did workers pack dry straw and wooden sawdust around the ice blocks?',
        options: [
          'They trap tiny pockets of still air that stop outside heat from melting the ice',
          'They make the ice smell like fresh pine trees',
          'They turn liquid water into new ice during July',
          'They help the heavy ice blocks slide down the hill'
        ],
        correctAnswer: 'They trap tiny pockets of still air that stop outside heat from melting the ice',
        explanation: 'Paragraph 4 explains that straw and sawdust trap millions of tiny pockets of still air, which stops outside heat from reaching the ice.',
        passageEvidence: 'Straw and sawdust trap millions of tiny pockets of still air, which stops outside heat from reaching the ice.'
      },
      {
        id: 'a2-exp-his-q5',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 3: Workers cut heavy blocks of clear ice and pulled them on wooden ______ to the ice house.',
        correctAnswer: 'sleds',
        acceptedAnswers: ['sleds'],
        explanation: 'Paragraph 3 states that they pulled them on wooden sleds to the ice house.',
        passageEvidence: 'They cut heavy blocks of clear ice and pulled them on wooden sleds to the ice house.'
      },
      {
        id: 'a2-exp-his-q6',
        type: 'vocabulary_in_context',
        prompt: 'What does the word "insulation" mean in Paragraph 4?',
        options: [
          'Material that blocks heat from passing through',
          'A metal saw used for cutting frozen lakes',
          'A sunny field where farmers grow wheat',
          'An electric wire connected to a kitchen stove'
        ],
        correctAnswer: 'Material that blocks heat from passing through',
        explanation: 'In Paragraph 4, "this simple insulation" refers to the layers of straw and sawdust that prevented outside heat from reaching the ice.',
        passageEvidence: 'Thanks to this simple insulation, stored winter ice lasted right through August.'
      },
      {
        id: 'a2-exp-his-q7',
        type: 'short_answer',
        prompt: 'Answer with ONE WORD from Paragraph 4: What was at the bottom of the pit to carry melted water away?',
        correctAnswer: 'drain',
        acceptedAnswers: ['drain', 'a drain'],
        explanation: 'Paragraph 4 states that a drain at the bottom of the pit carried the water away.',
        passageEvidence: 'When a block melted slightly, a drain at the bottom of the pit carried the water away so the remaining ice stayed dry and solid.'
      },
      {
        id: 'a2-exp-his-q8',
        type: 'matching_information',
        prompt: 'Which paragraph describes how workers harvested ice from lakes and rivers in winter?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4'],
        correctAnswer: 'Paragraph 3',
        explanation: 'Paragraph 3 describes workers walking onto frozen lakes and rivers in January and February with long metal saws to cut heavy blocks of ice.',
        passageEvidence: 'During the coldest weeks of January and February, workers walked onto frozen lakes and rivers with long metal saws.'
      },
      {
        id: 'a2-exp-his-q9',
        type: 'note_completion',
        prompt: 'Complete the study note with ONE WORD from Paragraph 2: Builders dug a deep pit on the shady ______ side of a hill.',
        correctAnswer: 'north',
        acceptedAnswers: ['north'],
        explanation: 'Paragraph 2 states that builders dug a deep pit on the shady north side of a hill.',
        passageEvidence: 'Builders dug a deep pit into the ground on the shady north side of a hill, where the earth stays cool all year.'
      },
      {
        id: 'a2-exp-his-q10',
        type: 'multiple_choice',
        prompt: 'Why was it important to drain melted water away from the bottom of the ice pit?',
        options: [
          'So the remaining ice stayed dry and solid instead of melting faster in water',
          'So workers could swim inside the pit during August',
          'Because liquid water makes sawdust catch fire',
          'To water apple trees growing inside the dark pit'
        ],
        correctAnswer: 'So the remaining ice stayed dry and solid instead of melting faster in water',
        explanation: 'Paragraph 4 explains that a drain at the bottom of the pit carried the water away so the remaining ice stayed dry and solid.',
        passageEvidence: 'When a block melted slightly, a drain at the bottom of the pit carried the water away so the remaining ice stayed dry and solid.'
      }
    ]
  },
  {
    id: 'a2-edu-school-gardens',
    title: 'What Children Learn by Growing Food in School Gardens',
    level: 'A2',
    topic: 'Education and learning',
    status: 'published',
    estimatedMinutes: 6,
    generationBatch: 'batch-expansion-a2',
    imageStatus: 'ready',
    introduction: 'See how outdoor vegetable beds turn science, math, and healthy eating into hands-on adventures for primary school students.',
    illustrationAlt: 'Photograph of wooden raised vegetable beds in a sunny schoolyard garden',
    passage: [
      'In many towns, primary schools are turning empty corners of their playgrounds into lively vegetable gardens. Instead of only reading about plants in classroom textbooks, children put on gardening gloves and step outside for one hour each week. Working together in small teams, students plant seeds, water the soil, and watch green stems push up toward the sun.',
      'Teachers use the school garden as an outdoor laboratory for several subjects at once. In math lessons, students use rulers to measure how many centimetres their bean plants grow each week and draw simple bar charts. In science lessons, they observe how earthworms loosen the soil and how bees carry yellow pollen from one tomato flower to another.',
      'School gardens also change how children think about food at lunchtime. Nutrition studies show that many young children refuse to eat green vegetables on their dinner plates simply because the foods look unfamiliar. However, when students spend two months caring for their own spinach, carrots, and peas, they feel proud of the harvest and are excited to taste what they grew.',
      'Beyond academic lessons and healthy eating, tending a garden teaches patience and responsibility. A seed does not turn into a ripe carrot overnight; if a team forgets to water their bed during a hot week, the leaves quickly droop. By caring for living plants, students learn that steady daily effort brings rewarding results. Many primary schools also invite proud parents and local farmers to join special autumn harvest days, where children carefully wash the fresh vegetables and prepare simple green salads for the school kitchen. Working together in the fresh outdoor air builds strong friendships among classmates and gives every young child lasting pride in growing real food from tiny seeds.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'a2-exp-edu-1',
        word: 'laboratory',
        partOfSpeech: 'noun',
        simpleDefinition: 'A special room or place used for doing science experiments and observations.',
        contextMeaning: 'An outdoor learning space where students study nature directly.',
        originalSentence: 'Teachers use the school garden as an outdoor laboratory for several subjects at once.',
        exampleSentence: 'Students wore safety glasses in the school chemistry laboratory.',
        synonyms: ['science room', 'testing area'],
        arabicTranslation: 'مختبر'
      },
      {
        id: 'a2-exp-edu-2',
        word: 'observe',
        partOfSpeech: 'verb',
        simpleDefinition: 'To watch something carefully in order to learn about it.',
        contextMeaning: 'To watch earthworms and bees closely during outdoor science class.',
        originalSentence: 'In science lessons, they observe how earthworms loosen the soil and how bees carry yellow pollen from one tomato flower to another.',
        exampleSentence: 'We used binoculars to observe wild birds near the lake.',
        synonyms: ['watch', 'study', 'notice'],
        arabicTranslation: 'يلاحظ / يراقب'
      },
      {
        id: 'a2-exp-edu-3',
        word: 'loosen',
        partOfSpeech: 'verb',
        simpleDefinition: 'To make something less tight or less hard so air and water can move through it.',
        contextMeaning: 'To make packed garden dirt soft by tunneling through it.',
        originalSentence: 'In science lessons, they observe how earthworms loosen the soil and how bees carry yellow pollen from one tomato flower to another.',
        exampleSentence: 'Use a garden fork to loosen the hard soil before planting.',
        synonyms: ['soften', 'break up'],
        arabicTranslation: 'يفكك (التربة)'
      },
      {
        id: 'a2-exp-edu-4',
        word: 'nutrition',
        partOfSpeech: 'noun',
        simpleDefinition: 'The study of food and how healthy eating helps the body grow.',
        contextMeaning: 'Research on children’s diets and vegetable eating habits.',
        originalSentence: 'Nutrition studies show that many young children refuse to eat green vegetables on their dinner plates simply because the foods look unfamiliar.',
        exampleSentence: 'Good nutrition and regular sleep help athletes stay strong.',
        synonyms: ['healthy eating', 'diet science'],
        arabicTranslation: 'تغذية'
      },
      {
        id: 'a2-exp-edu-5',
        word: 'unfamiliar',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Not known or seen before; strange to someone.',
        contextMeaning: 'New and strange on a child’s plate, causing them to avoid eating it.',
        originalSentence: 'Nutrition studies show that many young children refuse to eat green vegetables on their dinner plates simply because the foods look unfamiliar.',
        exampleSentence: 'The map helped us find our way through the unfamiliar city.',
        synonyms: ['unknown', 'new', 'strange'],
        arabicTranslation: 'غير مألوف'
      },
      {
        id: 'a2-exp-edu-6',
        word: 'patience',
        partOfSpeech: 'noun',
        simpleDefinition: 'The ability to wait calmly for something that takes a long time.',
        contextMeaning: 'Waiting weeks for tiny seeds to grow into ripe vegetables.',
        originalSentence: 'Beyond academic lessons and healthy eating, tending a garden teaches patience and responsibility.',
        exampleSentence: 'Learning to play the violin requires practice and patience.',
        synonyms: ['calm waiting'],
        arabicTranslation: 'صبر'
      },
      {
        id: 'a2-exp-edu-7',
        word: 'droop',
        partOfSpeech: 'verb',
        simpleDefinition: 'To hang down weakly because of lack of water or strength.',
        contextMeaning: 'Bend downward when thirsty plants do not get enough water.',
        originalSentence: 'A seed does not turn into a ripe carrot overnight; if a team forgets to water their bed during a hot week, the leaves quickly droop.',
        exampleSentence: 'The cut flowers began to droop after three days in the vase.',
        synonyms: ['wilt', 'sag', 'hang down'],
        arabicTranslation: 'يذبل / يتدلى'
      },
      {
        id: 'a2-exp-edu-8',
        word: 'rewarding',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Giving a happy feeling of success because you did something worthwhile.',
        contextMeaning: 'Making students feel proud and happy when they harvest their own food.',
        originalSentence: 'By caring for living plants, students learn that steady daily effort brings rewarding results.',
        exampleSentence: 'Teaching young children to read is a very rewarding job.',
        synonyms: ['satisfying', 'worthwhile'],
        arabicTranslation: 'مُجزٍ / مُرضٍ'
      }
    ],
    questions: [
      {
        id: 'a2-exp-edu-q1',
        type: 'true_false_not_given',
        prompt: 'In math lessons, students measure how many centimetres their bean plants grow each week.',
        correctAnswer: 'True',
        explanation: 'Paragraph 2 states that in math lessons, students use rulers to measure how many centimetres their bean plants grow each week.',
        passageEvidence: 'In math lessons, students use rulers to measure how many centimetres their bean plants grow each week and draw simple bar charts.'
      },
      {
        id: 'a2-exp-edu-q2',
        type: 'true_false_not_given',
        prompt: 'Children who grow their own vegetables in school gardens refuse to taste them.',
        correctAnswer: 'False',
        explanation: 'Paragraph 3 states that when students spend two months caring for their own spinach, carrots, and peas, they feel proud of the harvest and are excited to taste what they grew.',
        passageEvidence: 'However, when students spend two months caring for their own spinach, carrots, and peas, they feel proud of the harvest and are excited to taste what they grew.'
      },
      {
        id: 'a2-exp-edu-q3',
        type: 'true_false_not_given',
        prompt: 'Students sell their school carrots at the town market on Sundays.',
        correctAnswer: 'Not Given',
        explanation: 'The passage says students taste what they grew, but it never mentions selling vegetables at a town market.',
        passageEvidence: 'However, when students spend two months caring for their own spinach, carrots, and peas, they feel proud of the harvest and are excited to taste what they grew.'
      },
      {
        id: 'a2-exp-edu-q4',
        type: 'multiple_choice',
        prompt: 'Why do many young children refuse to eat green vegetables at lunchtime, according to nutrition studies?',
        options: [
          'Because the foods look unfamiliar to them',
          'Because green vegetables are always served frozen',
          'Because children prefer to eat raw plant seeds',
          'Because school lunchrooms are too noisy'
        ],
        correctAnswer: 'Because the foods look unfamiliar to them',
        explanation: 'Paragraph 3 states that many young children refuse to eat green vegetables on their dinner plates simply because the foods look unfamiliar.',
        passageEvidence: 'Nutrition studies show that many young children refuse to eat green vegetables on their dinner plates simply because the foods look unfamiliar.'
      },
      {
        id: 'a2-exp-edu-q5',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 2: Teachers use the school garden as an outdoor ______ for several subjects at once.',
        correctAnswer: 'laboratory',
        acceptedAnswers: ['laboratory'],
        explanation: 'Paragraph 2 states that teachers use the school garden as an outdoor laboratory.',
        passageEvidence: 'Teachers use the school garden as an outdoor laboratory for several subjects at once.'
      },
      {
        id: 'a2-exp-edu-q6',
        type: 'vocabulary_in_context',
        prompt: 'What does the word "droop" mean in Paragraph 4?',
        options: [
          'Hang down weakly from lack of water',
          'Grow twice as tall overnight',
          'Turn bright blue in the sun',
          'Produce sweet red berries'
        ],
        correctAnswer: 'Hang down weakly from lack of water',
        explanation: 'In Paragraph 4, if a team forgets to water their bed during a hot week, the leaves quickly droop (hang down weakly).',
        passageEvidence: 'A seed does not turn into a ripe carrot overnight; if a team forgets to water their bed during a hot week, the leaves quickly droop.'
      },
      {
        id: 'a2-exp-edu-q7',
        type: 'short_answer',
        prompt: 'Answer with ONE WORD from Paragraph 2: Which small creatures do students observe loosening the garden soil?',
        correctAnswer: 'earthworms',
        acceptedAnswers: ['earthworms', 'worms'],
        explanation: 'Paragraph 2 states that in science lessons, they observe how earthworms loosen the soil.',
        passageEvidence: 'In science lessons, they observe how earthworms loosen the soil and how bees carry yellow pollen from one tomato flower to another.'
      },
      {
        id: 'a2-exp-edu-q8',
        type: 'matching_information',
        prompt: 'Which paragraph explains how caring for plants teaches students patience and responsibility?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4'],
        correctAnswer: 'Paragraph 4',
        explanation: 'Paragraph 4 explains that tending a garden teaches patience and responsibility because plants need steady daily care.',
        passageEvidence: 'Beyond academic lessons and healthy eating, tending a garden teaches patience and responsibility.'
      },
      {
        id: 'a2-exp-edu-q9',
        type: 'note_completion',
        prompt: 'Complete the study note with TWO WORDS from Paragraph 2: After measuring their bean plants with rulers, students draw simple ______ in math class.',
        correctAnswer: 'bar charts',
        acceptedAnswers: ['bar charts', 'charts'],
        explanation: 'Paragraph 2 states that students measure their bean plants and draw simple bar charts.',
        passageEvidence: 'In math lessons, students use rulers to measure how many centimetres their bean plants grow each week and draw simple bar charts.'
      },
      {
        id: 'a2-exp-edu-q10',
        type: 'multiple_choice',
        prompt: 'What happens if a student team forgets to water their garden bed during a hot week?',
        options: [
          'The plant leaves quickly droop',
          'Earthworms carry water to the roots in tiny cups',
          'The carrots grow faster without moisture',
          'Bees stop visiting all flowers in the town'
        ],
        correctAnswer: 'The plant leaves quickly droop',
        explanation: 'Paragraph 4 states that if a team forgets to water their bed during a hot week, the leaves quickly droop.',
        passageEvidence: 'A seed does not turn into a ripe carrot overnight; if a team forgets to water their bed during a hot week, the leaves quickly droop.'
      }
    ]
  },
  {
    id: 'a2-bio-elephant-communication',
    title: 'How Elephants Send Messages Through the Ground',
    level: 'A2',
    topic: 'Biology and animal behaviour',
    status: 'published',
    estimatedMinutes: 6,
    generationBatch: 'batch-expansion-a2',
    imageStatus: 'ready',
    introduction: 'Discover how African elephants use deep, low rumbles that travel through the earth to talk to family members kilometres away.',
    illustrationAlt: 'Photograph of a family herd of African elephants walking across open savannah grassland',
    passage: [
      'Everyone knows that elephants can make loud trumpet sounds with their long trunks when they are excited or alarmed. However, wildlife biologists have discovered that most elephant conversations happen using deep, rumbling sounds that human ears cannot hear at all. These very low sounds are called infrasound.',
      'When a female elephant wants to call her family across the dry savannah, she produces a deep rumble in her throat. This sound wave travels through the air, but it also enters the ground beneath her heavy feet. Solid earth carries low vibrations much farther than windy air does. Under good conditions, another elephant herd can detect these ground signals from up to six kilometres away.',
      'How does an elephant "hear" a message travelling through the dirt? Biologists found the answer inside the elephant’s feet and trunk. The bottom of an elephant’s foot has a thick pad of fat and special nerve endings that are extremely sensitive to tiny ground movements. In addition, vibrated waves travel up the bones of the elephant’s front legs straight to its inner ears.',
      'Researchers often see a whole group of elephants suddenly stop eating, press their feet flat against the ground, and lean forward silently. Although the savannah seems completely quiet to human visitors, the elephants are actually listening to a distant warning about lions or an invitation to a waterhole. Wildlife biologists now place sensitive ground microphones near busy waterholes to record these deep rumbles and learn what different family call patterns mean. Understanding how wild herds share news across long distances helps park rangers protect traditional elephant travel corridors and keep nearby farming villages safe when large family groups move peacefully across the dry landscape at night. Even young calves quickly learn to freeze and listen whenever their mothers sense a distant family signal.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'a2-exp-bio-1',
        word: 'alarmed',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Suddenly afraid or worried that danger is near.',
        contextMeaning: 'Frightened by a sudden threat such as a lion.',
        originalSentence: 'Everyone knows that elephants can make loud trumpet sounds with their long trunks when they are excited or alarmed.',
        exampleSentence: 'The birds flew up into the sky when they were alarmed by the loud noise.',
        synonyms: ['frightened', 'startled'],
        arabicTranslation: 'مذعور / قلق من خطر'
      },
      {
        id: 'a2-exp-bio-2',
        word: 'rumbling',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Making a deep, continuous, low rolling sound like distant thunder.',
        contextMeaning: 'Deep throat sounds made by elephants to communicate.',
        originalSentence: 'However, wildlife biologists have discovered that most elephant conversations happen using deep, rumbling sounds that human ears cannot hear at all.',
        exampleSentence: 'We heard the rumbling sound of a heavy train crossing the bridge.',
        synonyms: ['low-pitched', 'booming'],
        arabicTranslation: 'هادر / ذو صوت منخفض عميق'
      },
      {
        id: 'a2-exp-bio-3',
        word: 'infrasound',
        partOfSpeech: 'noun',
        simpleDefinition: 'Sound waves that are too low in pitch for human ears to hear.',
        contextMeaning: 'The deep, low-frequency calls elephants use over long distances.',
        originalSentence: 'These very low sounds are called infrasound.',
        exampleSentence: 'Whales and elephants both use infrasound to communicate across long distances.',
        synonyms: ['low-frequency sound'],
        arabicTranslation: 'موجات تحت صوتية'
      },
      {
        id: 'a2-exp-bio-4',
        word: 'vibrations',
        partOfSpeech: 'noun',
        simpleDefinition: 'Tiny, rapid shaking movements that travel through the ground, water, or air.',
        contextMeaning: 'Shaking waves moving through the soil from an elephant’s call.',
        originalSentence: 'Solid earth carries low vibrations much farther than windy air does.',
        exampleSentence: 'You can feel the vibrations of the speaker if you touch the wooden table.',
        synonyms: ['tremors', 'shaking waves'],
        arabicTranslation: 'اهتزازات'
      },
      {
        id: 'a2-exp-bio-5',
        word: 'detect',
        partOfSpeech: 'verb',
        simpleDefinition: 'To notice or sense something that is faint or hidden.',
        contextMeaning: 'To feel the faint ground signals sent by distant elephants.',
        originalSentence: 'Under good conditions, another elephant herd can detect these ground signals from up to six kilometres away.',
        exampleSentence: 'Trained dogs can detect hidden smells from far away.',
        synonyms: ['sense', 'notice', 'pick up'],
        arabicTranslation: 'يكتشف / يستشعر'
      },
      {
        id: 'a2-exp-bio-6',
        word: 'sensitive',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Able to feel or notice very small changes or movements.',
        contextMeaning: 'Able to feel tiny ground vibrations through the bottom of the foot.',
        originalSentence: 'The bottom of an elephant’s foot has a thick pad of fat and special nerve endings that are extremely sensitive to tiny ground movements.',
        exampleSentence: 'A cat’s whiskers are very sensitive to touch.',
        synonyms: ['responsive'],
        arabicTranslation: 'حساس'
      },
      {
        id: 'a2-exp-bio-7',
        word: 'lean',
        partOfSpeech: 'verb',
        simpleDefinition: 'To bend or shift your body weight toward one direction.',
        contextMeaning: 'To shift weight onto their front legs so vibrations travel clearly to their ears.',
        originalSentence: 'Researchers often see a whole group of elephants suddenly stop eating, press their feet flat against the ground, and lean forward silently.',
        exampleSentence: 'Do not lean against the freshly painted wall.',
        synonyms: ['tilt', 'incline'],
        arabicTranslation: 'يميل'
      },
      {
        id: 'a2-exp-bio-8',
        word: 'waterhole',
        partOfSpeech: 'noun',
        simpleDefinition: 'A natural pool or pond in a dry area where wild animals go to drink.',
        contextMeaning: 'A drinking pond on the savannah that elephants tell their family about.',
        originalSentence: 'Although the savannah seems completely quiet to human visitors, the elephants are actually listening to a distant warning about lions or an invitation to a waterhole.',
        exampleSentence: 'Zebras and giraffes gathered at the waterhole before sunset.',
        synonyms: ['oasis', 'drinking pond'],
        arabicTranslation: 'بركة ماء للحيوانات البرية'
      }
    ],
    questions: [
      {
        id: 'a2-exp-bio-q1',
        type: 'true_false_not_given',
        prompt: 'Most elephant conversations use deep rumbling sounds that human ears cannot hear.',
        correctAnswer: 'True',
        explanation: 'Paragraph 1 states that most elephant conversations happen using deep, rumbling sounds that human ears cannot hear at all.',
        passageEvidence: 'However, wildlife biologists have discovered that most elephant conversations happen using deep, rumbling sounds that human ears cannot hear at all.'
      },
      {
        id: 'a2-exp-bio-q2',
        type: 'true_false_not_given',
        prompt: 'Windy air carries low vibrations much farther than solid earth does.',
        correctAnswer: 'False',
        explanation: 'Paragraph 2 states the opposite: solid earth carries low vibrations much farther than windy air does.',
        passageEvidence: 'Solid earth carries low vibrations much farther than windy air does.'
      },
      {
        id: 'a2-exp-bio-q3',
        type: 'true_false_not_given',
        prompt: 'Baby elephants learn to make infrasound rumbles when they are two years old.',
        correctAnswer: 'Not Given',
        explanation: 'The passage explains how elephants produce and detect infrasound, but it never mentions at what age baby elephants learn to make these rumbles.',
        passageEvidence: 'When a female elephant wants to call her family across the dry savannah, she produces a deep rumble in her throat.'
      },
      {
        id: 'a2-exp-bio-q4',
        type: 'multiple_choice',
        prompt: 'How far away can another elephant herd detect ground signals under good conditions?',
        options: [
          'Up to six kilometres away',
          'Only ten metres away',
          'Up to five hundred kilometres away',
          'Only when standing in the same river'
        ],
        correctAnswer: 'Up to six kilometres away',
        explanation: 'Paragraph 2 states that under good conditions, another elephant herd can detect these ground signals from up to six kilometres away.',
        passageEvidence: 'Under good conditions, another elephant herd can detect these ground signals from up to six kilometres away.'
      },
      {
        id: 'a2-exp-bio-q5',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 1: Very low sounds that human ears cannot hear are called ______.',
        correctAnswer: 'infrasound',
        acceptedAnswers: ['infrasound'],
        explanation: 'Paragraph 1 states that these very low sounds are called infrasound.',
        passageEvidence: 'These very low sounds are called infrasound.'
      },
      {
        id: 'a2-exp-bio-q6',
        type: 'vocabulary_in_context',
        prompt: 'What does the word "detect" mean in Paragraph 2?',
        options: [
          'Notice or sense something faint',
          'Hide something deep under the sand',
          'Forget a message after a few minutes',
          'Run away from a loud thunderstorm'
        ],
        correctAnswer: 'Notice or sense something faint',
        explanation: 'In Paragraph 2, "detect these ground signals" means sensing or picking up the vibrations from far away.',
        passageEvidence: 'Under good conditions, another elephant herd can detect these ground signals from up to six kilometres away.'
      },
      {
        id: 'a2-exp-bio-q7',
        type: 'short_answer',
        prompt: 'Answer with TWO WORDS from Paragraph 3: Which bones carry vibrated waves from an elephant’s feet straight to its inner ears?',
        correctAnswer: 'front legs',
        acceptedAnswers: ['front legs', 'leg bones', 'bones'],
        explanation: 'Paragraph 3 states that vibrated waves travel up the bones of the elephant’s front legs straight to its inner ears.',
        passageEvidence: 'In addition, vibrated waves travel up the bones of the elephant’s front legs straight to its inner ears.'
      },
      {
        id: 'a2-exp-bio-q8',
        type: 'matching_information',
        prompt: 'Which paragraph explains how the bottom of an elephant’s foot senses tiny ground movements?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4'],
        correctAnswer: 'Paragraph 3',
        explanation: 'Paragraph 3 describes the thick pad of fat and special nerve endings on the bottom of an elephant’s foot.',
        passageEvidence: 'The bottom of an elephant’s foot has a thick pad of fat and special nerve endings that are extremely sensitive to tiny ground movements.'
      },
      {
        id: 'a2-exp-bio-q9',
        type: 'note_completion',
        prompt: 'Complete the study note with ONE WORD from Paragraph 4: Elephants use ground signals to share a distant warning about ______ or an invitation to a waterhole.',
        correctAnswer: 'lions',
        acceptedAnswers: ['lions'],
        explanation: 'Paragraph 4 mentions a distant warning about lions or an invitation to a waterhole.',
        passageEvidence: 'Although the savannah seems completely quiet to human visitors, the elephants are actually listening to a distant warning about lions or an invitation to a waterhole.'
      },
      {
        id: 'a2-exp-bio-q10',
        type: 'multiple_choice',
        prompt: 'Why do elephants sometimes stop eating, press their feet flat on the ground, and lean forward silently?',
        options: [
          'They are listening to ground vibrations sent by distant elephants',
          'They are sleeping in the warm afternoon sun',
          'They are cooling their feet in wet mud',
          'They are waiting for tourists to give them fruit'
        ],
        correctAnswer: 'They are listening to ground vibrations sent by distant elephants',
        explanation: 'Paragraph 4 explains that when elephants do this, they are actually listening to a distant warning or invitation travelling through the ground.',
        passageEvidence: 'Although the savannah seems completely quiet to human visitors, the elephants are actually listening to a distant warning about lions or an invitation to a waterhole.'
      }
    ]
  },
  {
    id: 'a2-hea-posture-ergonomics',
    title: 'How Desk Height and Walking Breaks Protect the Back',
    level: 'A2',
    topic: 'Public health',
    status: 'published',
    estimatedMinutes: 6,
    generationBatch: 'batch-expansion-a2',
    imageStatus: 'ready',
    introduction: 'Learn simple adjustments to your chair, computer screen, and daily routine that prevent neck and back pain when studying or working indoors.',
    illustrationAlt: 'Photograph of an ergonomic office desk setup with an adjustable monitor and chair',
    passage: [
      'A hundred years ago, most people worked on farms, in workshops, or in active jobs that kept their bodies moving all day. Today, millions of office workers and university students spend six to eight hours a day sitting in front of a laptop or desktop computer. Doctors report that sitting in a poor position for many hours is now one of the leading causes of neck and lower-back pain.',
      'When a laptop screen rests flat on a low table, the user naturally bends their head forward and rounds their shoulders to read the text. An adult human head weighs about five kilograms. When the neck bends forward at a steep angle, the muscles in the back of the neck must support nearly three times that weight. Over several hours, those muscles become tight, tired, and sore.',
      'Health specialists who study safe workspace design—a field called ergonomics—recommend three easy changes. First, raise the computer screen by placing a stack of books under it so the top of the screen is level with your eyes. Second, adjust your chair height so both feet rest flat on the floor and your knees bend at a comfortable right angle. Third, keep the keyboard close so your elbows stay relaxed beside your body.',
      'Even the best chair cannot replace regular movement. Doctors advise standing up for two minutes every half hour to walk across the room and roll your shoulders. Combining a well-adjusted desk with frequent short walks keeps the spine healthy and pain-free. Simple changes at home, such as placing a laptop on a stack of thick books and connecting a separate keyboard, can quickly improve neck posture without buying expensive office furniture. Good daily habits protect muscles and joints for years to come.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'a2-exp-hea-1',
        word: 'position',
        partOfSpeech: 'noun',
        simpleDefinition: 'The way a person’s body is sitting or standing.',
        contextMeaning: 'Posture while sitting in a chair at a desk.',
        originalSentence: 'Doctors report that sitting in a poor position for many hours is now one of the leading causes of neck and lower-back pain.',
        exampleSentence: 'Sitting in the same position on a long flight can make your legs stiff.',
        synonyms: ['posture', 'stance'],
        arabicTranslation: 'وضعية الجلوس'
      },
      {
        id: 'a2-exp-hea-2',
        word: 'steep',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Bending sharply downward or upward at a large angle.',
        contextMeaning: 'Bent far forward toward a low laptop screen.',
        originalSentence: 'When the neck bends forward at a steep angle, the muscles in the back of the neck must support nearly three times that weight.',
        exampleSentence: 'Cyclists pedaled slowly up the steep mountain road.',
        synonyms: ['sharp', 'deep'],
        arabicTranslation: 'حاد (الزاوية) / شديد الانحدار'
      },
      {
        id: 'a2-exp-hea-3',
        word: 'support',
        partOfSpeech: 'verb',
        simpleDefinition: 'To hold up the weight of something so it does not fall.',
        contextMeaning: 'To hold up the heavy weight of the head when leaning forward.',
        originalSentence: 'When the neck bends forward at a steep angle, the muscles in the back of the neck must support nearly three times that weight.',
        exampleSentence: 'Thick stone pillars support the roof of the museum.',
        synonyms: ['hold up', 'carry', 'bear'],
        arabicTranslation: 'يحمل / يسند'
      },
      {
        id: 'a2-exp-hea-4',
        word: 'sore',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Hurting or aching because a muscle has worked too hard.',
        contextMeaning: 'Painful and aching in the neck and shoulders after hours of poor posture.',
        originalSentence: 'Over several hours, those muscles become tight, tired, and sore.',
        exampleSentence: 'His legs felt sore the day after running ten kilometres.',
        synonyms: ['aching', 'painful', 'tender'],
        arabicTranslation: 'مؤلم / متقرح'
      },
      {
        id: 'a2-exp-hea-5',
        word: 'ergonomics',
        partOfSpeech: 'noun',
        simpleDefinition: 'The study of designing furniture and tools so people can work comfortably and safely.',
        contextMeaning: 'The science of arranging desks, chairs, and screens to protect the body.',
        originalSentence: 'Health specialists who study safe workspace design—a field called ergonomics—recommend three easy changes.',
        exampleSentence: 'Good office ergonomics reduces neck pain and tired eyes.',
        synonyms: ['workspace design'],
        arabicTranslation: 'هندسة العوامل البشرية (الإرغونوميكس)'
      },
      {
        id: 'a2-exp-hea-6',
        word: 'level',
        partOfSpeech: 'adjective',
        simpleDefinition: 'At the exact same height as something else.',
        contextMeaning: 'At the same height as the reader’s eyes so the neck stays straight.',
        originalSentence: 'First, raise the computer screen by placing a stack of books under it so the top of the screen is level with your eyes.',
        exampleSentence: 'Hang the picture frame so it is level with the top of the window.',
        synonyms: ['even', 'aligned'],
        arabicTranslation: 'في نفس المستوى'
      },
      {
        id: 'a2-exp-hea-7',
        word: 'adjust',
        partOfSpeech: 'verb',
        simpleDefinition: 'To change the height or position of something slightly so it fits better.',
        contextMeaning: 'To move a desk chair up or down until your feet rest flat on the floor.',
        originalSentence: 'Second, adjust your chair height so both feet rest flat on the floor and your knees bend at a comfortable right angle.',
        exampleSentence: 'You can adjust the bicycle seat to match your height.',
        synonyms: ['set', 'change', 'adapt'],
        arabicTranslation: 'يضبط / يعدّل'
      },
      {
        id: 'a2-exp-hea-8',
        word: 'spine',
        partOfSpeech: 'noun',
        simpleDefinition: 'The row of connected bones running down the middle of your back.',
        contextMeaning: 'The backbone that stays healthy when you sit well and take walking breaks.',
        originalSentence: 'Combining a well-adjusted desk with frequent short walks keeps the spine healthy and pain-free.',
        exampleSentence: 'Stretching exercises help keep your spine flexible.',
        synonyms: ['backbone'],
        arabicTranslation: 'العمود الفقري'
      }
    ],
    questions: [
      {
        id: 'a2-exp-hea-q1',
        type: 'true_false_not_given',
        prompt: 'An adult human head weighs about five kilograms.',
        correctAnswer: 'True',
        explanation: 'Paragraph 2 states that an adult human head weighs about five kilograms.',
        passageEvidence: 'An adult human head weighs about five kilograms.'
      },
      {
        id: 'a2-exp-hea-q2',
        type: 'true_false_not_given',
        prompt: 'A well-adjusted chair means you never need to stand up or walk during the day.',
        correctAnswer: 'False',
        explanation: 'Paragraph 4 states that even the best chair cannot replace regular movement, and doctors advise standing up for two minutes every half hour.',
        passageEvidence: 'Even the best chair cannot replace regular movement. Doctors advise standing up for two minutes every half hour to walk across the room and roll your shoulders.'
      },
      {
        id: 'a2-exp-hea-q3',
        type: 'true_false_not_given',
        prompt: 'Wooden chairs are better for the spine than metal chairs.',
        correctAnswer: 'Not Given',
        explanation: 'The passage explains how to adjust chair height, but it never compares wooden and metal chairs.',
        passageEvidence: 'Second, adjust your chair height so both feet rest flat on the floor and your knees bend at a comfortable right angle.'
      },
      {
        id: 'a2-exp-hea-q4',
        type: 'multiple_choice',
        prompt: 'What happens to the neck muscles when a person bends their head forward at a steep angle?',
        options: [
          'They must support nearly three times the normal weight of the head',
          'They immediately go to sleep and stop working',
          'They become twice as long within ten minutes',
          'They push the laptop screen higher on the table'
        ],
        correctAnswer: 'They must support nearly three times the normal weight of the head',
        explanation: 'Paragraph 2 explains that when the neck bends forward at a steep angle, the muscles in the back of the neck must support nearly three times that weight.',
        passageEvidence: 'When the neck bends forward at a steep angle, the muscles in the back of the neck must support nearly three times that weight.'
      },
      {
        id: 'a2-exp-hea-q5',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 3: Health specialists who study safe workspace design work in a field called ______.',
        correctAnswer: 'ergonomics',
        acceptedAnswers: ['ergonomics'],
        explanation: 'Paragraph 3 defines safe workspace design as a field called ergonomics.',
        passageEvidence: 'Health specialists who study safe workspace design—a field called ergonomics—recommend three easy changes.'
      },
      {
        id: 'a2-exp-hea-q6',
        type: 'vocabulary_in_context',
        prompt: 'What does the word "adjust" mean in Paragraph 3?',
        options: [
          'Change the height or position so it fits properly',
          'Throw an old piece of furniture into the rubbish',
          'Paint a desk a brighter colour',
          'Carry a heavy chair up the stairs'
        ],
        correctAnswer: 'Change the height or position so it fits properly',
        explanation: 'In Paragraph 3, "adjust your chair height" means changing the height of the chair so your feet rest flat on the floor.',
        passageEvidence: 'Second, adjust your chair height so both feet rest flat on the floor and your knees bend at a comfortable right angle.'
      },
      {
        id: 'a2-exp-hea-q7',
        type: 'short_answer',
        prompt: 'Answer with ONE WORD from Paragraph 3: What everyday items can you place under a computer screen to raise it to eye level?',
        correctAnswer: 'books',
        acceptedAnswers: ['books', 'a stack of books', 'stack of books'],
        explanation: 'Paragraph 3 recommends raising the computer screen by placing a stack of books under it.',
        passageEvidence: 'First, raise the computer screen by placing a stack of books under it so the top of the screen is level with your eyes.'
      },
      {
        id: 'a2-exp-hea-q8',
        type: 'matching_information',
        prompt: 'Which paragraph explains how often workers and students should stand up and walk around?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4'],
        correctAnswer: 'Paragraph 4',
        explanation: 'Paragraph 4 states that doctors advise standing up for two minutes every half hour to walk across the room.',
        passageEvidence: 'Doctors advise standing up for two minutes every half hour to walk across the room and roll your shoulders.'
      },
      {
        id: 'a2-exp-hea-q9',
        type: 'note_completion',
        prompt: 'Complete the study note with ONE WORD from Paragraph 3: Keep the keyboard close so your ______ stay relaxed beside your body.',
        correctAnswer: 'elbows',
        acceptedAnswers: ['elbows'],
        explanation: 'Paragraph 3 states "keep the keyboard close so your elbows stay relaxed beside your body."',
        passageEvidence: 'Third, keep the keyboard close so your elbows stay relaxed beside your body.'
      },
      {
        id: 'a2-exp-hea-q10',
        type: 'multiple_choice',
        prompt: 'Where should the top of your computer screen be positioned?',
        options: [
          'Level with your eyes',
          'Flat on the floor beside your feet',
          'High above your head on a bookshelf',
          'Behind your chair facing the window'
        ],
        correctAnswer: 'Level with your eyes',
        explanation: 'Paragraph 3 recommends raising the computer screen so the top of the screen is level with your eyes.',
        passageEvidence: 'First, raise the computer screen by placing a stack of books under it so the top of the screen is level with your eyes.'
      }
    ]
  },
  {
    id: 'a2-eco-returnable-glass-bottles',
    title: 'Why Deposit Systems for Glass Bottles Reduce Waste',
    level: 'A2',
    topic: 'Economics and society',
    status: 'published',
    estimatedMinutes: 6,
    generationBatch: 'batch-expansion-a2',
    imageStatus: 'ready',
    introduction: 'See how a small refundable deposit encourages shoppers to bring empty drink bottles back to the supermarket so they can be washed and refilled dozens of times.',
    illustrationAlt: 'Photograph of reusable glass beverage bottles arranged in a return crate',
    passage: [
      'Every day, millions of single-use plastic and glass drink bottles are sold in shops around the world. Even when people place empty glass bottles into household recycling bins, crushing those bottles and melting the glass in a factory furnace at 1,500 degrees Celsius uses a huge amount of energy. Economists and environmental engineers point out that washing and refilling a strong glass bottle is far cleaner than melting it down.',
      'In countries such as Germany, Denmark, and parts of Canada, supermarkets use a simple system called a bottle deposit scheme. When a customer buys a bottle of juice or mineral water, they pay a small extra deposit of about fifteen or twenty cents. This deposit is not a tax; it is a temporary payment that the customer gets back.',
      'After drinking the juice at home, the shopper brings the empty bottles back to a return machine near the supermarket entrance. The machine scans the shape and label of each bottle, moves it onto a conveyor belt, and prints a paper ticket for the full deposit amount. Shoppers can use that ticket right away to pay for their groceries or receive cash at the checkout.',
      'Behind the scenes, trucks carry the empty bottles back to the drink factory in sturdy plastic crates. There, high-pressure hot water jets wash and sterilize every bottle before machines refill it and glue on a fresh paper label. A single thick glass bottle can be refilled up to forty times before it becomes worn out, cutting energy use and street litter dramatically. When a bottle finally gets scratched or chipped after years of service, the factory crushes the clean glass and melts it down to make brand-new bottles without wasting raw materials.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'a2-exp-eco-1',
        word: 'furnace',
        partOfSpeech: 'noun',
        simpleDefinition: 'A very hot enclosed industrial oven used for melting glass or metal.',
        contextMeaning: 'The 1,500-degree factory oven used to melt crushed glass.',
        originalSentence: 'Even when people place empty glass bottles into household recycling bins, crushing those bottles and melting the glass in a factory furnace at 1,500 degrees Celsius uses a huge amount of energy.',
        exampleSentence: 'Workers wore heat-protective gloves near the glass furnace.',
        synonyms: ['kiln', 'industrial oven'],
        arabicTranslation: 'فرن صهر صناعي'
      },
      {
        id: 'a2-exp-eco-2',
        word: 'deposit',
        partOfSpeech: 'noun',
        simpleDefinition: 'A small extra sum of money paid when buying a bottle that is given back when you return the empty bottle.',
        contextMeaning: 'The fifteen or twenty cents added to the drink price and refunded upon return.',
        originalSentence: 'When a customer buys a bottle of juice or mineral water, they pay a small extra deposit of about fifteen or twenty cents.',
        exampleSentence: 'You get your twenty-cent deposit back when you return the glass bottle.',
        synonyms: ['refundable fee'],
        arabicTranslation: 'تأمين مسترد'
      },
      {
        id: 'a2-exp-eco-3',
        word: 'temporary',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Lasting for only a short time, not forever.',
        contextMeaning: 'Paid only until the shopper brings the empty bottle back to the store.',
        originalSentence: 'This deposit is not a tax; it is a temporary payment that the customer gets back.',
        exampleSentence: 'The city built a temporary wooden bridge while repairing the main road.',
        synonyms: ['short-term', 'brief'],
        arabicTranslation: 'مؤقت'
      },
      {
        id: 'a2-exp-eco-4',
        word: 'scans',
        partOfSpeech: 'verb',
        simpleDefinition: 'Uses a light beam or camera sensor to read a barcode or check an object’s shape.',
        contextMeaning: 'Checks the bottle’s shape and label inside the supermarket return machine.',
        originalSentence: 'The machine scans the shape and label of each bottle, moves it onto a conveyor belt, and prints a paper ticket for the full deposit amount.',
        exampleSentence: 'The cashier scans each item at the supermarket checkout.',
        synonyms: ['reads', 'checks'],
        arabicTranslation: 'يمسح ضوئياً'
      },
      {
        id: 'a2-exp-eco-5',
        word: 'groceries',
        partOfSpeech: 'noun',
        simpleDefinition: 'Food and household supplies bought at a supermarket.',
        contextMeaning: 'Everyday food items that shoppers can pay for using their bottle return ticket.',
        originalSentence: 'Shoppers can use that ticket right away to pay for their groceries or receive cash at the checkout.',
        exampleSentence: 'He carried two bags of groceries home from the market.',
        synonyms: ['food shopping', 'provisions'],
        arabicTranslation: 'مشتريات البقالة'
      },
      {
        id: 'a2-exp-eco-6',
        word: 'sturdy',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Strong, solid, and not easily broken.',
        contextMeaning: 'Strong enough to protect glass bottles while trucks carry them to the factory.',
        originalSentence: 'Behind the scenes, trucks carry the empty bottles back to the drink factory in sturdy plastic crates.',
        exampleSentence: 'Hikers need sturdy boots for rocky mountain paths.',
        synonyms: ['strong', 'solid', 'durable'],
        arabicTranslation: 'متين / قوي'
      },
      {
        id: 'a2-exp-eco-7',
        word: 'sterilize',
        partOfSpeech: 'verb',
        simpleDefinition: 'To clean something completely with high heat so no germs remain.',
        contextMeaning: 'To wash returned bottles with very hot water so they are completely safe to refill.',
        originalSentence: 'There, high-pressure hot water jets wash and sterilize every bottle before machines refill it and glue on a fresh paper label.',
        exampleSentence: 'Hospitals sterilize metal tools before every operation.',
        synonyms: ['sanitize', 'disinfect'],
        arabicTranslation: 'يعقّم'
      },
      {
        id: 'a2-exp-eco-8',
        word: 'litter',
        partOfSpeech: 'noun',
        simpleDefinition: 'Rubbish such as empty bottles, cans, or paper left lying on the ground in public places.',
        contextMeaning: 'Empty bottles thrown on streets or parks when there is no deposit reward.',
        originalSentence: 'A single thick glass bottle can be refilled up to forty times before it becomes worn out, cutting energy use and street litter dramatically.',
        exampleSentence: 'Volunteers picked up plastic litter along the beach.',
        synonyms: ['trash', 'rubbish', 'waste'],
        arabicTranslation: 'نفايات ملقاة في الشارع'
      }
    ],
    questions: [
      {
        id: 'a2-exp-eco-q1',
        type: 'true_false_not_given',
        prompt: 'Melting crushed glass in a factory furnace requires temperatures around 1,500 degrees Celsius.',
        correctAnswer: 'True',
        explanation: 'Paragraph 1 states that melting the glass in a factory furnace at 1,500 degrees Celsius uses a huge amount of energy.',
        passageEvidence: 'Even when people place empty glass bottles into household recycling bins, crushing those bottles and melting the glass in a factory furnace at 1,500 degrees Celsius uses a huge amount of energy.'
      },
      {
        id: 'a2-exp-eco-q2',
        type: 'true_false_not_given',
        prompt: 'A thick glass bottle can only be washed and refilled twice before it must be thrown away.',
        correctAnswer: 'False',
        explanation: 'Paragraph 4 states that a single thick glass bottle can be refilled up to forty times before it becomes worn out.',
        passageEvidence: 'A single thick glass bottle can be refilled up to forty times before it becomes worn out, cutting energy use and street litter dramatically.'
      },
      {
        id: 'a2-exp-eco-q3',
        type: 'true_false_not_given',
        prompt: 'Green glass bottles cost more to wash than clear glass bottles.',
        correctAnswer: 'Not Given',
        explanation: 'The passage explains how glass bottles are washed and sterilized, but it never mentions bottle colours or compares their washing costs.',
        passageEvidence: 'There, high-pressure hot water jets wash and sterilize every bottle before machines refill it and glue on a fresh paper label.'
      },
      {
        id: 'a2-exp-eco-q4',
        type: 'multiple_choice',
        prompt: 'Why is washing and refilling a glass bottle better than crushing it in a recycling bin?',
        options: [
          'It avoids using huge amounts of energy to melt glass at 1,500 degrees Celsius',
          'Crushed glass cannot be melted in any factory furnace',
          'Supermarkets do not sell drinks in recycled glass bottles',
          'Washing a bottle makes the juice inside taste sweeter'
        ],
        correctAnswer: 'It avoids using huge amounts of energy to melt glass at 1,500 degrees Celsius',
        explanation: 'Paragraph 1 explains that crushing and melting glass at 1,500 degrees Celsius uses a huge amount of energy, so washing and refilling is far cleaner.',
        passageEvidence: 'Economists and environmental engineers point out that washing and refilling a strong glass bottle is far cleaner than melting it down.'
      },
      {
        id: 'a2-exp-eco-q5',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 2: The extra fifteen or twenty cents is not a tax; it is a temporary ______ that the customer gets back.',
        correctAnswer: 'payment',
        acceptedAnswers: ['payment', 'deposit'],
        explanation: 'Paragraph 2 states that it is a temporary payment that the customer gets back.',
        passageEvidence: 'This deposit is not a tax; it is a temporary payment that the customer gets back.'
      },
      {
        id: 'a2-exp-eco-q6',
        type: 'vocabulary_in_context',
        prompt: 'What does the word "sterilize" mean in Paragraph 4?',
        options: [
          'Clean completely with high heat so no germs remain',
          'Break into tiny pieces with a heavy hammer',
          'Paint a bright logo on the outside of a crate',
          'Fill a bottle with cold sparkling water'
        ],
        correctAnswer: 'Clean completely with high heat so no germs remain',
        explanation: 'In Paragraph 4, high-pressure hot water jets wash and sterilize every bottle before refilling.',
        passageEvidence: 'There, high-pressure hot water jets wash and sterilize every bottle before machines refill it and glue on a fresh paper label.'
      },
      {
        id: 'a2-exp-eco-q7',
        type: 'short_answer',
        prompt: 'Answer with TWO WORDS from Paragraph 3: What does the return machine print for the shopper after scanning the empty bottles?',
        correctAnswer: 'paper ticket',
        acceptedAnswers: ['paper ticket', 'a paper ticket', 'ticket'],
        explanation: 'Paragraph 3 states that the machine prints a paper ticket for the full deposit amount.',
        passageEvidence: 'The machine scans the shape and label of each bottle, moves it onto a conveyor belt, and prints a paper ticket for the full deposit amount.'
      },
      {
        id: 'a2-exp-eco-q8',
        type: 'matching_information',
        prompt: 'Which paragraph describes what happens to the returned bottles once they reach the drink factory?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4'],
        correctAnswer: 'Paragraph 4',
        explanation: 'Paragraph 4 describes how trucks carry the bottles in crates to the factory where they are washed, sterilized, refilled, and relabelled.',
        passageEvidence: 'Behind the scenes, trucks carry the empty bottles back to the drink factory in sturdy plastic crates.'
      },
      {
        id: 'a2-exp-eco-q9',
        type: 'note_completion',
        prompt: 'Complete the study note with ONE WORD from Paragraph 4: A single thick glass bottle can be refilled up to ______ times.',
        correctAnswer: 'forty',
        acceptedAnswers: ['forty', '40'],
        explanation: 'Paragraph 4 states that a single thick glass bottle can be refilled up to forty times.',
        passageEvidence: 'A single thick glass bottle can be refilled up to forty times before it becomes worn out, cutting energy use and street litter dramatically.'
      },
      {
        id: 'a2-exp-eco-q10',
        type: 'multiple_choice',
        prompt: 'How can shoppers use the paper ticket printed by the supermarket return machine?',
        options: [
          'To pay for their groceries or receive cash at the checkout',
          'To ride the city bus home for free',
          'To visit a glass furnace factory on weekends',
          'To buy a plastic crate from the delivery truck driver'
        ],
        correctAnswer: 'To pay for their groceries or receive cash at the checkout',
        explanation: 'Paragraph 3 states that shoppers can use that ticket right away to pay for their groceries or receive cash at the checkout.',
        passageEvidence: 'Shoppers can use that ticket right away to pay for their groceries or receive cash at the checkout.'
      }
    ]
  },
  {
    id: 'a2-ast-total-solar-eclipses',
    title: 'Why Day Turns into Night During a Total Solar Eclipse',
    level: 'A2',
    topic: 'Astronomy and space exploration',
    status: 'published',
    estimatedMinutes: 6,
    generationBatch: 'batch-expansion-a2',
    imageStatus: 'ready',
    introduction: 'Learn the remarkable cosmic coincidence that allows our small Moon to block out the giant Sun for a few minutes in the middle of the day.',
    illustrationAlt: 'Photograph of the glowing white solar corona visible around the dark Moon during a total solar eclipse',
    passage: [
      'A total solar eclipse is one of the most unforgettable sights in nature. In the middle of a bright, sunny day, the sky slowly grows dark like twilight, the air becomes noticeably cooler, and daytime birds stop singing and return to their nests. For three or four minutes, a black circle covers the Sun, surrounded by a glowing white ring of light in the darkened sky.',
      'Astronomers explain that a solar eclipse happens when the Moon passes directly between the Earth and the Sun. As the Moon moves across the sky, it casts a dark round shadow onto the surface of the Earth. Only people standing inside the narrow path of this central shadow experience a total eclipse, while people in nearby towns see the Sun only partly covered.',
      'At first, it seems surprising that the tiny Moon can completely hide the giant Sun. In reality, the Sun’s diameter is about four hundred times wider than the Moon’s diameter. However, by an amazing coincidence of space, the Sun is also about four hundred times farther away from Earth than the Moon is. Because of this exact match between size and distance, both objects appear almost the exact same size in our sky.',
      'During the brief minutes of totality, scientists can study the Sun’s outer atmosphere, called the corona, which is normally hidden by the Sun’s bright glare. However, astronomers always warn observers never to look at the partial phases of an eclipse without certified eclipse glasses, because even a thin slice of direct sunlight can seriously damage human eyes. Families can also watch the eclipse safely by making a simple pinhole camera out of two pieces of white cardboard to project the Moon’s shadow onto the ground.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'a2-exp-ast-1',
        word: 'unforgettable',
        partOfSpeech: 'adjective',
        simpleDefinition: 'So special or amazing that you will always remember it.',
        contextMeaning: 'Such a striking natural event that observers remember it for life.',
        originalSentence: 'A total solar eclipse is one of the most unforgettable sights in nature.',
        exampleSentence: 'Seeing the northern lights in Iceland was an unforgettable experience.',
        synonyms: ['memorable', 'remarkable'],
        arabicTranslation: 'لا يُنسى'
      },
      {
        id: 'a2-exp-ast-2',
        word: 'twilight',
        partOfSpeech: 'noun',
        simpleDefinition: 'The soft, dim light in the sky just after sunset or before sunrise.',
        contextMeaning: 'The sudden evening-like darkness that falls during a daytime eclipse.',
        originalSentence: 'In the middle of a bright, sunny day, the sky slowly grows dark like twilight, the air becomes noticeably cooler, and daytime birds stop singing and return to their nests.',
        exampleSentence: 'Streetlamps turned on as twilight fell over the town.',
        synonyms: ['dusk', 'half-light'],
        arabicTranslation: 'الغسق / الشفق'
      },
      {
        id: 'a2-exp-ast-3',
        word: 'casts',
        partOfSpeech: 'verb',
        simpleDefinition: 'Sends or throws light or a shadow onto a surface.',
        contextMeaning: 'Throws a dark round shadow from the Moon onto the Earth.',
        originalSentence: 'As the Moon moves across the sky, it casts a dark round shadow onto the surface of the Earth.',
        exampleSentence: 'The tall oak tree casts a cool shadow across the garden.',
        synonyms: ['throws', 'projects'],
        arabicTranslation: 'يلقي (ظلاً)'
      },
      {
        id: 'a2-exp-ast-4',
        word: 'diameter',
        partOfSpeech: 'noun',
        simpleDefinition: 'The width of a round object measured straight across its center.',
        contextMeaning: 'The width of the Sun compared to the width of the Moon.',
        originalSentence: 'In reality, the Sun’s diameter is about four hundred times wider than the Moon’s diameter.',
        exampleSentence: 'The round dining table has a diameter of two metres.',
        synonyms: ['width'],
        arabicTranslation: 'قُطر الدائرة'
      },
      {
        id: 'a2-exp-ast-5',
        word: 'coincidence',
        partOfSpeech: 'noun',
        simpleDefinition: 'A surprising fact where two things match by chance.',
        contextMeaning: 'The lucky match where the Sun is 400 times wider and also 400 times farther away than the Moon.',
        originalSentence: 'However, by an amazing coincidence of space, the Sun is also about four hundred times farther away from Earth than the Moon is.',
        exampleSentence: 'By coincidence, we wore the exact same blue jacket to class.',
        synonyms: ['chance match'],
        arabicTranslation: 'مصادفة'
      },
      {
        id: 'a2-exp-ast-6',
        word: 'corona',
        partOfSpeech: 'noun',
        simpleDefinition: 'The glowing white outer atmosphere of the Sun, seen as a ring during a total eclipse.',
        contextMeaning: 'The outer layer of gas around the Sun that scientists study when the Moon blocks the bright disk.',
        originalSentence: 'During the brief minutes of totality, scientists can study the Sun’s outer atmosphere, called the corona, which is normally hidden by the Sun’s bright glare.',
        exampleSentence: 'Photographs of the eclipse showed the pearly white solar corona.',
        synonyms: ['solar halo', 'outer atmosphere'],
        arabicTranslation: 'إكليل الشمس / الهالة الشمسية'
      },
      {
        id: 'a2-exp-ast-7',
        word: 'glare',
        partOfSpeech: 'noun',
        simpleDefinition: 'A very strong, dazzling light that makes it hard to see other things.',
        contextMeaning: 'The blinding brightness of the Sun’s main surface.',
        originalSentence: 'During the brief minutes of totality, scientists can study the Sun’s outer atmosphere, called the corona, which is normally hidden by the Sun’s bright glare.',
        exampleSentence: 'Sunglasses protect drivers’ eyes from the glare of the wet road.',
        synonyms: ['blinding light', 'brightness'],
        arabicTranslation: 'وهج ساطع'
      },
      {
        id: 'a2-exp-ast-8',
        word: 'certified',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Officially tested and approved as safe to use.',
        contextMeaning: 'Specially tested to block harmful solar rays during an eclipse.',
        originalSentence: 'However, astronomers always warn observers never to look at the partial phases of an eclipse without certified eclipse glasses, because even a thin slice of direct sunlight can seriously damage human eyes.',
        exampleSentence: 'Only wear a certified helmet when riding a motorcycle.',
        synonyms: ['approved', 'tested'],
        arabicTranslation: 'معتمد / موثق السلامة'
      }
    ],
    questions: [
      {
        id: 'a2-exp-ast-q1',
        type: 'true_false_not_given',
        prompt: 'A solar eclipse happens when the Moon passes directly between the Earth and the Sun.',
        correctAnswer: 'True',
        explanation: 'Paragraph 2 states that a solar eclipse happens when the Moon passes directly between the Earth and the Sun.',
        passageEvidence: 'Astronomers explain that a solar eclipse happens when the Moon passes directly between the Earth and the Sun.'
      },
      {
        id: 'a2-exp-ast-q2',
        type: 'true_false_not_given',
        prompt: 'The Moon and the Sun have the exact same real diameter in space.',
        correctAnswer: 'False',
        explanation: 'Paragraph 3 explains that in reality, the Sun’s diameter is about four hundred times wider than the Moon’s diameter.',
        passageEvidence: 'In reality, the Sun’s diameter is about four hundred times wider than the Moon’s diameter.'
      },
      {
        id: 'a2-exp-ast-q3',
        type: 'true_false_not_given',
        prompt: 'The next total solar eclipse will be visible from Cairo in the month of May.',
        correctAnswer: 'Not Given',
        explanation: 'The passage explains how eclipses happen, but it never mentions Cairo or the month of May.',
        passageEvidence: 'Only people standing inside the narrow path of this central shadow experience a total eclipse, while people in nearby towns see the Sun only partly covered.'
      },
      {
        id: 'a2-exp-ast-q4',
        type: 'multiple_choice',
        prompt: 'Why do the Sun and the Moon appear almost the exact same size in Earth’s sky?',
        options: [
          'The Sun is about 400 times wider than the Moon, and also about 400 times farther away',
          'The Moon swells to 400 times its normal size when it passes the Sun',
          'Earth’s clouds act like a giant magnifying glass during the afternoon',
          'Both the Sun and the Moon are the exact same distance from Earth'
        ],
        correctAnswer: 'The Sun is about 400 times wider than the Moon, and also about 400 times farther away',
        explanation: 'Paragraph 3 explains that the Sun’s diameter is about four hundred times wider than the Moon’s, and the Sun is also about four hundred times farther away.',
        passageEvidence: 'However, by an amazing coincidence of space, the Sun is also about four hundred times farther away from Earth than the Moon is.'
      },
      {
        id: 'a2-exp-ast-q5',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 4: Scientists can study the Sun’s outer atmosphere, called the ______, during totality.',
        correctAnswer: 'corona',
        acceptedAnswers: ['corona'],
        explanation: 'Paragraph 4 states that scientists can study the Sun’s outer atmosphere, called the corona.',
        passageEvidence: 'During the brief minutes of totality, scientists can study the Sun’s outer atmosphere, called the corona, which is normally hidden by the Sun’s bright glare.'
      },
      {
        id: 'a2-exp-ast-q6',
        type: 'vocabulary_in_context',
        prompt: 'What does the word "twilight" mean in Paragraph 1?',
        options: [
          'The dim light in the sky just after sunset',
          'A loud storm with heavy rain and thunder',
          'The hottest hour in the middle of summer',
          'A bright rainbow after a morning shower'
        ],
        correctAnswer: 'The dim light in the sky just after sunset',
        explanation: '"Grows dark like twilight" refers to the dim evening-like light just after sunset.',
        passageEvidence: 'In the middle of a bright, sunny day, the sky slowly grows dark like twilight, the air becomes noticeably cooler, and daytime birds stop singing and return to their nests.'
      },
      {
        id: 'a2-exp-ast-q7',
        type: 'short_answer',
        prompt: 'Answer with TWO WORDS from Paragraph 4: What must observers wear to look safely at the partial phases of an eclipse?',
        correctAnswer: 'eclipse glasses',
        acceptedAnswers: ['eclipse glasses', 'certified eclipse glasses'],
        explanation: 'Paragraph 4 warns observers never to look at the partial phases without certified eclipse glasses.',
        passageEvidence: 'However, astronomers always warn observers never to look at the partial phases of an eclipse without certified eclipse glasses, because even a thin slice of direct sunlight can seriously damage human eyes.'
      },
      {
        id: 'a2-exp-ast-q8',
        type: 'matching_information',
        prompt: 'Which paragraph describes how birds and air temperature react during a total solar eclipse?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4'],
        correctAnswer: 'Paragraph 1',
        explanation: 'Paragraph 1 describes the air becoming noticeably cooler and daytime birds stopping their singing and returning to their nests.',
        passageEvidence: 'In the middle of a bright, sunny day, the sky slowly grows dark like twilight, the air becomes noticeably cooler, and daytime birds stop singing and return to their nests.'
      },
      {
        id: 'a2-exp-ast-q9',
        type: 'note_completion',
        prompt: 'Complete the study note with ONE WORD from Paragraph 2: As the Moon moves across the sky, it casts a dark round ______ onto the surface of the Earth.',
        correctAnswer: 'shadow',
        acceptedAnswers: ['shadow'],
        explanation: 'Paragraph 2 states that it casts a dark round shadow onto the surface of the Earth.',
        passageEvidence: 'As the Moon moves across the sky, it casts a dark round shadow onto the surface of the Earth.'
      },
      {
        id: 'a2-exp-ast-q10',
        type: 'multiple_choice',
        prompt: 'Why don’t people in every town on Earth see a total eclipse at the same time?',
        options: [
          'Only people standing inside the narrow path of the Moon’s central shadow see totality',
          'Total eclipses only happen at midnight when most towns are asleep',
          'Tall city buildings block the Moon from moving across the sky',
          'The Moon’s shadow only falls on the ocean and never touches land'
        ],
        correctAnswer: 'Only people standing inside the narrow path of the Moon’s central shadow see totality',
        explanation: 'Paragraph 2 explains that only people standing inside the narrow path of this central shadow experience a total eclipse.',
        passageEvidence: 'Only people standing inside the narrow path of this central shadow experience a total eclipse, while people in nearby towns see the Sun only partly covered.'
      }
    ]
  },
  {
    id: 'a2-arc-windcatchers-cooling',
    title: 'How Traditional Wind Towers Cool Desert Buildings',
    level: 'A2',
    topic: 'Architecture and urban development',
    status: 'published',
    estimatedMinutes: 6,
    generationBatch: 'batch-expansion-a2',
    imageStatus: 'ready',
    introduction: 'Discover how tall brick towers on historic rooftops in Iran and the Gulf capture high breezes to cool rooms below without using electricity.',
    illustrationAlt: 'Photograph of traditional brick windcatcher towers rising above desert rooftops in Yazd',
    passage: [
      'In desert cities such as Yazd in Iran and Dubai on the Arabian Gulf, summer afternoon temperatures often climb above forty degrees Celsius. Long before electric air conditioners were invented, local architects designed a clever rooftop structure called a windcatcher, or badgir, to keep family homes and public water reservoirs pleasantly cool.',
      'A windcatcher looks like a tall brick chimney rising several metres above the flat roof of a house. Unlike a fireplace chimney that lets smoke out, a windcatcher has tall vertical openings near the top that face the prevailing wind. High above the dusty street, the breeze is cooler and stronger than at ground level. The tower catches this moving air and directs it down a wide shaft into the living rooms below.',
      'To make the incoming air even cooler, builders often placed a shallow pool of water or an underground water channel at the bottom of the tower. As the dry desert breeze passes over the water surface, a small amount of water evaporates and absorbs heat from the air. The cooled, fresh breeze then circulates through the rooms, while warm stale air rises and escapes through a separate opening on the opposite side of the tower.',
      'Today, modern sustainable architects are studying these ancient desert towers with great interest. By combining traditional windcatcher shapes with modern solar roofs in schools, public libraries, and busy office buildings, engineers can cut summer electricity use while keeping indoor air fresh and comfortable. Unlike noisy electric air conditioners that rely on chemical coolants and heavy power grids, passive brick wind towers continue working silently even during hot afternoon power cuts. These clever, time-tested designs prove that ancient desert builders understood local wind and climate patterns remarkably well.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'a2-exp-arc-1',
        word: 'reservoirs',
        partOfSpeech: 'noun',
        simpleDefinition: 'Large tanks or underground rooms built to store drinking water for a town.',
        contextMeaning: 'Public desert water tanks kept cool by windcatcher towers.',
        originalSentence: 'Long before electric air conditioners were invented, local architects designed a clever rooftop structure called a windcatcher, or badgir, to keep family homes and public water reservoirs pleasantly cool.',
        exampleSentence: 'Mountain snow fills the city’s water reservoirs every spring.',
        synonyms: ['water tanks', 'cisterns'],
        arabicTranslation: 'خزانات مياه'
      },
      {
        id: 'a2-exp-arc-2',
        word: 'vertical',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Standing straight up and down from top to bottom.',
        contextMeaning: 'Tall upright slots near the top of the tower that catch the breeze.',
        originalSentence: 'Unlike a fireplace chimney that lets smoke out, a windcatcher has tall vertical openings near the top that face the prevailing wind.',
        exampleSentence: 'The wallpaper had thin vertical stripes of green and white.',
        synonyms: ['upright'],
        arabicTranslation: 'عمودي / رأسي'
      },
      {
        id: 'a2-exp-arc-3',
        word: 'prevailing',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Most common or blowing most often from a particular direction.',
        contextMeaning: 'The main direction from which the cool desert breeze usually blows.',
        originalSentence: 'Unlike a fireplace chimney that lets smoke out, a windcatcher has tall vertical openings near the top that face the prevailing wind.',
        exampleSentence: 'Trees on the coast lean away from the prevailing sea wind.',
        synonyms: ['main', 'usual', 'dominant'],
        arabicTranslation: 'سائد'
      },
      {
        id: 'a2-exp-arc-4',
        word: 'shaft',
        partOfSpeech: 'noun',
        simpleDefinition: 'A long vertical passage or tunnel inside a building.',
        contextMeaning: 'The upright passage inside the brick tower that guides air downward.',
        originalSentence: 'The tower catches this moving air and directs it down a wide shaft into the living rooms below.',
        exampleSentence: 'An elevator moves up and down inside a tall vertical shaft.',
        synonyms: ['passage', 'channel', 'duct'],
        arabicTranslation: 'ممر رأسي / بئر التهوية'
      },
      {
        id: 'a2-exp-arc-5',
        word: 'circulates',
        partOfSpeech: 'verb',
        simpleDefinition: 'Moves continuously around an area or through a system.',
        contextMeaning: 'Flows gently through all the rooms of the house.',
        originalSentence: 'The cooled, fresh breeze then circulates through the rooms, while warm stale air rises and escapes through a separate opening on the opposite side of the tower.',
        exampleSentence: 'A ceiling fan circulates air around the classroom.',
        synonyms: ['flows', 'moves around'],
        arabicTranslation: 'يدور / ينتشر'
      },
      {
        id: 'a2-exp-arc-6',
        word: 'stale',
        partOfSpeech: 'adjective',
        simpleDefinition: 'No longer fresh or pleasant to breathe; warm and stuffy.',
        contextMeaning: 'Indoor air that has become warm and used inside the rooms.',
        originalSentence: 'The cooled, fresh breeze then circulates through the rooms, while warm stale air rises and escapes through a separate opening on the opposite side of the tower.',
        exampleSentence: 'We opened the windows to let out the stale air after the meeting.',
        synonyms: ['stuffy', 'unfresh'],
        arabicTranslation: 'راكد / غير نقي'
      },
      {
        id: 'a2-exp-arc-7',
        word: 'escapes',
        partOfSpeech: 'verb',
        simpleDefinition: 'Gets out from an enclosed space into the open air.',
        contextMeaning: 'Leaves the building through the back opening of the wind tower.',
        originalSentence: 'The cooled, fresh breeze then circulates through the rooms, while warm stale air rises and escapes through a separate opening on the opposite side of the tower.',
        exampleSentence: 'Steam escapes through a small hole in the kettle lid.',
        synonyms: ['exits', 'goes out'],
        arabicTranslation: 'يخرج / يتسرب للخارج'
      },
      {
        id: 'a2-exp-arc-8',
        word: 'sustainable',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Designed to protect the environment by using very little energy and natural resources.',
        contextMeaning: 'Environmentally friendly building design that saves electricity.',
        originalSentence: 'Today, modern sustainable architects are studying these ancient desert towers with great interest.',
        exampleSentence: 'Solar panels and thick walls are important parts of sustainable homes.',
        synonyms: ['eco-friendly', 'green'],
        arabicTranslation: 'مستدام'
      }
    ],
    questions: [
      {
        id: 'a2-exp-arc-q1',
        type: 'true_false_not_given',
        prompt: 'High above the dusty street, the breeze is cooler and stronger than at ground level.',
        correctAnswer: 'True',
        explanation: 'Paragraph 2 states that high above the dusty street, the breeze is cooler and stronger than at ground level.',
        passageEvidence: 'High above the dusty street, the breeze is cooler and stronger than at ground level.'
      },
      {
        id: 'a2-exp-arc-q2',
        type: 'true_false_not_given',
        prompt: 'A traditional windcatcher requires an electric fan inside the brick shaft to pull air downward.',
        correctAnswer: 'False',
        explanation: 'Paragraph 1 states that windcatchers were designed long before electric air conditioners were invented, using natural wind and evaporation.',
        passageEvidence: 'Long before electric air conditioners were invented, local architects designed a clever rooftop structure called a windcatcher, or badgir, to keep family homes and public water reservoirs pleasantly cool.'
      },
      {
        id: 'a2-exp-arc-q3',
        type: 'true_false_not_given',
        prompt: 'Every house in the city of Yazd has exactly four windcatcher towers on its roof.',
        correctAnswer: 'Not Given',
        explanation: 'The passage mentions Yazd and explains how windcatchers work, but it never states how many towers each house has.',
        passageEvidence: 'In desert cities such as Yazd in Iran and Dubai on the Arabian Gulf, summer afternoon temperatures often climb above forty degrees Celsius.'
      },
      {
        id: 'a2-exp-arc-q4',
        type: 'multiple_choice',
        prompt: 'How does placing a shallow pool of water at the bottom of a windcatcher help cool the house?',
        options: [
          'As dry air passes over the water, some water evaporates and absorbs heat from the breeze',
          'Residents swim in the pool all afternoon to stay cool',
          'The water freezes into solid ice when the wind blows on it',
          'The water blocks all outdoor air from entering the living rooms'
        ],
        correctAnswer: 'As dry air passes over the water, some water evaporates and absorbs heat from the breeze',
        explanation: 'Paragraph 3 explains that as the dry desert breeze passes over the water surface, a small amount of water evaporates and absorbs heat from the air.',
        passageEvidence: 'As the dry desert breeze passes over the water surface, a small amount of water evaporates and absorbs heat from the air.'
      },
      {
        id: 'a2-exp-arc-q5',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 2: A windcatcher has tall vertical openings near the top that face the ______ wind.',
        correctAnswer: 'prevailing',
        acceptedAnswers: ['prevailing'],
        explanation: 'Paragraph 2 states that a windcatcher has tall vertical openings near the top that face the prevailing wind.',
        passageEvidence: 'Unlike a fireplace chimney that lets smoke out, a windcatcher has tall vertical openings near the top that face the prevailing wind.'
      },
      {
        id: 'a2-exp-arc-q6',
        type: 'vocabulary_in_context',
        prompt: 'What does the word "stale" mean in Paragraph 3?',
        options: [
          'Warm, stuffy, and no longer fresh to breathe',
          'Cold and blowing fast from the mountains',
          'Filled with sweet flower perfume',
          'Cleaned by an electric machine'
        ],
        correctAnswer: 'Warm, stuffy, and no longer fresh to breathe',
        explanation: 'In Paragraph 3, "warm stale air" contrasts with the "cooled, fresh breeze" entering the rooms.',
        passageEvidence: 'The cooled, fresh breeze then circulates through the rooms, while warm stale air rises and escapes through a separate opening on the opposite side of the tower.'
      },
      {
        id: 'a2-exp-arc-q7',
        type: 'short_answer',
        prompt: 'Answer with ONE WORD from Paragraph 1: What is the traditional local name for a windcatcher in Iran?',
        correctAnswer: 'badgir',
        acceptedAnswers: ['badgir'],
        explanation: 'Paragraph 1 states that local architects designed a clever rooftop structure called a windcatcher, or badgir.',
        passageEvidence: 'Long before electric air conditioners were invented, local architects designed a clever rooftop structure called a windcatcher, or badgir, to keep family homes and public water reservoirs pleasantly cool.'
      },
      {
        id: 'a2-exp-arc-q8',
        type: 'matching_information',
        prompt: 'Which paragraph explains how modern engineers are using windcatcher ideas today?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4'],
        correctAnswer: 'Paragraph 4',
        explanation: 'Paragraph 4 explains that modern sustainable architects combine traditional windcatcher shapes with solar roofs in schools, libraries, and offices.',
        passageEvidence: 'Today, modern sustainable architects are studying these ancient desert towers with great interest.'
      },
      {
        id: 'a2-exp-arc-q9',
        type: 'note_completion',
        prompt: 'Complete the study note with ONE WORD from Paragraph 2: The tower catches moving air and directs it down a wide ______ into the living rooms below.',
        correctAnswer: 'shaft',
        acceptedAnswers: ['shaft'],
        explanation: 'Paragraph 2 states that the tower directs moving air down a wide shaft into the living rooms below.',
        passageEvidence: 'The tower catches this moving air and directs it down a wide shaft into the living rooms below.'
      },
      {
        id: 'a2-exp-arc-q10',
        type: 'multiple_choice',
        prompt: 'How does warm indoor air leave a house cooled by a windcatcher?',
        options: [
          'It rises and escapes through a separate opening on the opposite side of the tower',
          'It is pumped underground into the water channel',
          'It stays trapped inside the living room until winter',
          'Workers carry it outside in large clay jars'
        ],
        correctAnswer: 'It rises and escapes through a separate opening on the opposite side of the tower',
        explanation: 'Paragraph 3 explains that warm stale air rises and escapes through a separate opening on the opposite side of the tower.',
        passageEvidence: 'The cooled, fresh breeze then circulates through the rooms, while warm stale air rises and escapes through a separate opening on the opposite side of the tower.'
      }
    ]
  }
];

export const BATCH_A2_EXPANSION_LESSONS: ReadingLesson[] = rawA2ExpansionLessons.map((lesson) => {
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
