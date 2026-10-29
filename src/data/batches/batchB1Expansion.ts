import { ReadingLesson } from '../../types/reading';
import { getEditorialIllustrationUri, getPassageIllustrationAlt } from '../../utils/illustrations';

const rawB1ExpansionLessons: Omit<ReadingLesson, 'illustrationUrl' | 'wordCount' | 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'b1-sci-precision-fermentation',
    title: 'Brewing Dairy Proteins Without Cows Through Precision Fermentation',
    level: 'B1',
    topic: 'Science and technology',
    status: 'published',
    estimatedMinutes: 9,
    generationBatch: 'batch-expansion-b1',
    imageStatus: 'ready',
    introduction: 'Explore how food scientists program microscopic yeast cells in steel tanks to produce real milk proteins without raising dairy cattle.',
    illustrationAlt: 'Photograph of stainless steel fermentation tanks inside a modern biotechnology laboratory',
    passage: [
      'For thousands of years, humans have used traditional fermentation to transform simple ingredients into bread, yoghurt, and cheese. In this natural process, microscopic organisms such as yeast or bacteria consume sugars and release useful compounds that add flavour or preserve food. Over the past decade, biotechnologists have upgraded this ancient craft into a modern technique called precision fermentation, which allows laboratories to brew specific animal proteins without raising livestock.',
      'To understand how precision fermentation works, scientists compare a yeast cell to a tiny biological factory. Researchers first look at the genetic code that tells a dairy cow how to make whey or casein, the main proteins that give milk its creamy texture and ability to melt into cheese. Using digital gene-sequencing databases, scientists copy that exact DNA instruction without harming any animals and insert it into ordinary baker’s yeast.',
      'Next, the modified yeast cells are placed inside tall stainless-steel tanks filled with warm water, plant sugars, vitamins, and minerals. Kept at a steady temperature, the yeast cells multiply rapidly and read their new genetic instructions. Instead of producing alcohol or bread gas, the yeast converts the plant sugar into pure dairy protein. After a few days, technicians filter out the yeast cells, leaving behind a clean protein powder that is chemically identical to protein from a cow.',
      'Environmental analysts believe this technology could solve several major challenges in global agriculture. Raising dairy cattle requires vast areas of pasture, huge volumes of freshwater, and feed crops that often contribute to deforestation. In addition, cows release methane, a powerful greenhouse gas, during digestion. Early life-cycle studies suggest that brewing dairy proteins in fermentation tanks uses up to ninety percent less land and significantly less water than conventional dairy farming.',
      'However, precision fermentation still faces practical hurdles before it can replace traditional dairy on supermarket shelves. Building large industrial bioreactors is expensive, and supplying enough purified plant sugar to feed billions of yeast cells requires careful energy management. Furthermore, food regulators must verify the safety and labelling of every new product. Even so, many food scientists view microbial protein brewing as a promising partner to sustainable farming. In several countries, traditional dairy cooperatives have even begun investing in fermentation start-ups rather than treating them as competitors. By blending fermented whey proteins with plant-based oat or almond milks, food makers can craft hybrid cheeses and yoghurts that offer the rich taste and nutrition of dairy with a fraction of the environmental footprint. University food-science departments are also training a new generation of bioprocess engineers to design more efficient steel tanks powered by solar and wind electricity. As renewable energy becomes cheaper and bioreactor designs improve over the coming decade, precision fermentation could help feed a growing global population while allowing vast areas of former cattle pasture to return to natural forest and wildlife habitat. Independent taste panels have also found that ice cream and cream cheese made with fermented whey perform just like farm-fresh dairy in baking and cooking tests. At the same time, rural economists are studying how farmers can grow the sugar beet, maize, and agricultural crop feedstocks needed to supply regional fermentation breweries. Sharing the economic benefits with farming communities ensures a fair transition for rural regions.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'b1-exp-sci-1',
        word: 'fermentation',
        partOfSpeech: 'noun',
        simpleDefinition: 'A chemical process in which tiny organisms like yeast break down sugar to make new substances.',
        contextMeaning: 'Using yeast cells in tanks to turn plant sugar into food proteins.',
        originalSentence: 'For thousands of years, humans have used traditional fermentation to transform simple ingredients into bread, yoghurt, and cheese.',
        exampleSentence: 'Yeast fermentation causes bread dough to rise before baking.',
        synonyms: ['brewing', 'bioprocessing'],
        arabicTranslation: 'تخمير'
      },
      {
        id: 'b1-exp-sci-2',
        word: 'microscopic',
        partOfSpeech: 'adjective',
        simpleDefinition: 'So extremely small that it can only be seen through a microscope.',
        contextMeaning: 'Tiny single-celled yeast and bacteria invisible to the naked eye.',
        originalSentence: 'In this natural process, microscopic organisms such as yeast or bacteria consume sugars and release useful compounds that add flavour or preserve food.',
        exampleSentence: 'A single drop of pond water contains thousands of microscopic organisms.',
        synonyms: ['tiny', 'minute'],
        arabicTranslation: 'مجهري'
      },
      {
        id: 'b1-exp-sci-3',
        word: 'livestock',
        partOfSpeech: 'noun',
        simpleDefinition: 'Farm animals such as cattle, sheep, and goats raised for food or milk.',
        contextMeaning: 'Dairy cows and other farm animals raised on agricultural land.',
        originalSentence: 'Over the past decade, biotechnologists have upgraded this ancient craft into a modern technique called precision fermentation, which allows laboratories to brew specific animal proteins without raising livestock.',
        exampleSentence: 'Farmers brought fresh hay into the barn to feed their livestock.',
        synonyms: ['farm animals', 'cattle'],
        arabicTranslation: 'ماشية / حيوانات المزرعة'
      },
      {
        id: 'b1-exp-sci-4',
        word: 'texture',
        partOfSpeech: 'noun',
        simpleDefinition: 'The way food or material feels in your mouth or hands, such as smooth, creamy, or rough.',
        contextMeaning: 'The smooth, rich feel that dairy proteins give to milk and cheese.',
        originalSentence: 'Researchers first look at the genetic code that tells a dairy cow how to make whey or casein, the main proteins that give milk its creamy texture and ability to melt into cheese.',
        exampleSentence: 'Fresh yoghurt has a thick and smooth texture.',
        synonyms: ['consistency', 'feel'],
        arabicTranslation: 'قوام / ملمس'
      },
      {
        id: 'b1-exp-sci-5',
        word: 'identical',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Exactly the same in every detail.',
        contextMeaning: 'Having the exact same chemical structure as protein taken from cow’s milk.',
        originalSentence: 'After a few days, technicians filter out the yeast cells, leaving behind a clean protein powder that is chemically identical to protein from a cow.',
        exampleSentence: 'The two sisters wore identical blue coats to school.',
        synonyms: ['exact same', 'indistinguishable'],
        arabicTranslation: 'مطابق تماماً'
      },
      {
        id: 'b1-exp-sci-6',
        word: 'pasture',
        partOfSpeech: 'noun',
        simpleDefinition: 'Grassland where farm animals such as cows and sheep graze.',
        contextMeaning: 'Wide grassy fields needed to raise dairy herds.',
        originalSentence: 'Raising dairy cattle requires vast areas of pasture, huge volumes of freshwater, and feed crops that often contribute to deforestation.',
        exampleSentence: 'The cows walked across the green pasture toward the stream.',
        synonyms: ['grazing land', 'meadow'],
        arabicTranslation: 'مرعى'
      },
      {
        id: 'b1-exp-sci-7',
        word: 'conventional',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Following the traditional or usual way something has been done for a long time.',
        contextMeaning: 'Standard dairy farming using cows on farms.',
        originalSentence: 'Early life-cycle studies suggest that brewing dairy proteins in fermentation tanks uses up to ninety percent less land and significantly less water than conventional dairy farming.',
        exampleSentence: 'Solar panels are cleaner than conventional coal power plants.',
        synonyms: ['traditional', 'standard'],
        arabicTranslation: 'تقليدي'
      },
      {
        id: 'b1-exp-sci-8',
        word: 'hurdles',
        partOfSpeech: 'noun',
        simpleDefinition: 'Problems or difficulties that must be solved before progress can continue.',
        contextMeaning: 'Practical challenges such as high equipment costs and safety rules.',
        originalSentence: 'However, precision fermentation still faces practical hurdles before it can replace traditional dairy on supermarket shelves.',
        exampleSentence: 'Engineers overcame several technical hurdles to launch the satellite.',
        synonyms: ['obstacles', 'challenges', 'barriers'],
        arabicTranslation: 'عقبات / تحديات'
      }
    ],
    questions: [
      {
        id: 'b1-exp-sci-q1',
        type: 'true_false_not_given',
        prompt: 'Scientists must harm dairy cows in order to copy the DNA instructions for milk proteins.',
        correctAnswer: 'False',
        explanation: 'Paragraph 2 states that using digital gene-sequencing databases, scientists copy that exact DNA instruction without harming any animals.',
        passageEvidence: 'Using digital gene-sequencing databases, scientists copy that exact DNA instruction without harming any animals and insert it into ordinary baker’s yeast.'
      },
      {
        id: 'b1-exp-sci-q2',
        type: 'true_false_not_given',
        prompt: 'The yeast cells themselves are filtered out at the end of the process, leaving behind pure protein powder.',
        correctAnswer: 'True',
        explanation: 'Paragraph 3 states that technicians filter out the yeast cells, leaving behind a clean protein powder.',
        passageEvidence: 'After a few days, technicians filter out the yeast cells, leaving behind a clean protein powder that is chemically identical to protein from a cow.'
      },
      {
        id: 'b1-exp-sci-q3',
        type: 'true_false_not_given',
        prompt: 'Ice cream made with precision-fermented whey costs less than traditional ice cream in every country.',
        correctAnswer: 'Not Given',
        explanation: 'The passage never mentions ice cream prices or compares retail costs across countries.',
        passageEvidence: 'However, precision fermentation still faces practical hurdles before it can replace traditional dairy on supermarket shelves.'
      },
      {
        id: 'b1-exp-sci-q4',
        type: 'yes_no_not_given',
        prompt: 'The author believes that precision-fermented casein will become cheaper than plant-based oat milk within the next five years.',
        correctAnswer: 'Not Given',
        explanation: 'In Paragraph 5, the author discusses the manufacturing hurdles and costs of precision fermentation, but never compares its future price with plant-based oat milk or gives a five-year forecast.',
        passageEvidence: 'However, precision fermentation still faces practical hurdles before it can replace traditional dairy on supermarket shelves.'
      },
      {
        id: 'b1-exp-sci-q5',
        type: 'multiple_choice',
        prompt: 'What role do whey and casein play in dairy products?',
        options: [
          'They are the main proteins that give milk its creamy texture and allow cheese to melt',
          'They are plant sugars used to feed baker’s yeast in steel tanks',
          'They are greenhouse gases released by cattle during digestion',
          'They are vitamins added to tap water inside laboratories'
        ],
        correctAnswer: 'They are the main proteins that give milk its creamy texture and allow cheese to melt',
        explanation: 'Paragraph 2 identifies whey and casein as the main proteins that give milk its creamy texture and ability to melt into cheese.',
        passageEvidence: 'Researchers first look at the genetic code that tells a dairy cow how to make whey or casein, the main proteins that give milk its creamy texture and ability to melt into cheese.'
      },
      {
        id: 'b1-exp-sci-q6',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 4: During digestion, cows release ______, a powerful greenhouse gas.',
        correctAnswer: 'methane',
        acceptedAnswers: ['methane'],
        explanation: 'Paragraph 4 states that cows release methane, a powerful greenhouse gas, during digestion.',
        passageEvidence: 'In addition, cows release methane, a powerful greenhouse gas, during digestion.'
      },
      {
        id: 'b1-exp-sci-q7',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 5, the word "hurdles" is closest in meaning to:',
        options: [
          'Obstacles or difficulties that must be overcome',
          'Wooden fences built around green pastures',
          'Stainless-steel tanks used for heating water',
          'Recipes for baking traditional sourdough bread'
        ],
        correctAnswer: 'Obstacles or difficulties that must be overcome',
        explanation: '"Practical hurdles" refers to technical and regulatory challenges that must be solved.',
        passageEvidence: 'However, precision fermentation still faces practical hurdles before it can replace traditional dairy on supermarket shelves.'
      },
      {
        id: 'b1-exp-sci-q8',
        type: 'short_answer',
        prompt: 'Answer with TWO WORDS from Paragraph 3: What do yeast cells convert into pure dairy protein inside the steel tanks?',
        correctAnswer: 'plant sugar',
        acceptedAnswers: ['plant sugar', 'plant sugars', 'sugars'],
        explanation: 'Paragraph 3 states that the yeast converts the plant sugar into pure dairy protein.',
        passageEvidence: 'Instead of producing alcohol or bread gas, the yeast converts the plant sugar into pure dairy protein.'
      },
      {
        id: 'b1-exp-sci-q9',
        type: 'matching_information',
        prompt: 'Which paragraph compares the land and water footprints of tank-brewed dairy protein with conventional cattle farming?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4', 'Paragraph 5'],
        correctAnswer: 'Paragraph 4',
        explanation: 'Paragraph 4 explains that brewing dairy proteins in fermentation tanks uses up to ninety percent less land and significantly less water than conventional dairy farming.',
        passageEvidence: 'Early life-cycle studies suggest that brewing dairy proteins in fermentation tanks uses up to ninety percent less land and significantly less water than conventional dairy farming.'
      },
      {
        id: 'b1-exp-sci-q10',
        type: 'summary_completion',
        prompt: 'Complete the summary with ONE WORD from Paragraph 5: Before fermented proteins become widespread, food regulators must verify the safety and ______ of every new product.',
        correctAnswer: 'labelling',
        acceptedAnswers: ['labelling', 'labeling'],
        explanation: 'Paragraph 5 states that food regulators must verify the safety and labelling of every new product.',
        passageEvidence: 'Furthermore, food regulators must verify the safety and labelling of every new product.'
      }
    ]
  },
  {
    id: 'b1-env-seagrass-carbon-sinks',
    title: 'Why Underwater Seagrass Meadows Are Vital Coastal Carbon Sinks',
    level: 'B1',
    topic: 'Environmental science',
    status: 'published',
    estimatedMinutes: 9,
    generationBatch: 'batch-expansion-b1',
    imageStatus: 'ready',
    introduction: 'Learn how flowering marine plants in shallow coastal waters trap carbon in the seafloor and shelter young fish.',
    illustrationAlt: 'Photograph of lush green underwater seagrass blades swaying in shallow coastal water',
    passage: [
      'When people think about ecosystems that absorb carbon dioxide from the atmosphere, they usually picture tropical rainforests such as the Amazon. Yet marine biologists point out that some of the planet’s most effective carbon traps lie hidden just beneath the waves along shallow coastlines. Known as seagrass meadows, these underwater prairies grow in sunlit bays and lagoons on every continent except Antarctica.',
      'Although seagrass looks like common seaweed, the two are biologically very different. Seaweed is a simple alga that clings to rocks using a holdfast and absorbs nutrients directly from the water. Seagrass, by contrast, is a true flowering plant that evolved from land grasses millions of years ago before returning to the sea. It has real roots, underground stems called rhizomes, veins, and tiny underwater flowers that release pollen into ocean currents.',
      'This dense root network gives seagrass meadows their remarkable climate power. As seagrass leaves photosynthesize in the sunlight, they draw dissolved carbon out of the seawater. More importantly, their thick blades slow down passing waves and currents, causing floating organic particles and silt to settle gently onto the seabed. Because the muddy sediment beneath a seagrass meadow contains almost no oxygen, dead leaves and trapped carbon do not rot quickly. Instead, they remain locked in the seafloor for centuries.',
      'Beyond storing "blue carbon," seagrass meadows act as essential nurseries for marine life. A single hectare of healthy seagrass can shelter tens of thousands of young cod, seahorses, crabs, and green sea turtles, protecting them from larger predators in the open ocean. At the same time, the roots bind coastal sand together and reduce shoreline erosion during winter storms.',
      'Sadly, nearly thirty percent of the world’s seagrass meadows have disappeared over the past century due to agricultural fertilizer runoff, coastal dredging, and boat anchors dragging across the seabed. Today, conservation teams and local fishing communities are restoring damaged bays by suspending small hessian bags filled with seagrass seeds along the ocean floor and replacing heavy chain moorings with eco-friendly floating buoys. Because the natural hessian cloth slowly breaks down in seawater, the sprouting seeds can push their roots directly into the muddy bottom without being washed away by strong tides. Within three to five years, these planted plots expand into continuous underwater carpets that once again clarify the murky water and attract breeding fish back to the coast. Marine biologists also partner with school volunteers and recreational divers to map recovering meadows using underwater cameras and satellite images. Meanwhile, watershed councils work upstream with farmers to plant riverside buffer zones that absorb excess chemical fertilizers before rainwater reaches the bay. Protecting and replanting coastal seagrass proves that restoring marine habitats benefits climate stability, biodiversity, and local fisheries at the same time. Local oyster farmers often place their shellfish cages near recovering seagrass beds because filter-feeding oysters remove floating algae and let more sunlight reach the young plants on the bottom. Coastal tourism operators have also joined the effort by training boat captains to anchor in sandy zones rather than dropping heavy iron chains onto fragile green meadows. Together, scientists, fishers, and farmers are showing how practical coastal stewardship can revive underwater prairies for future generations.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'b1-exp-env-1',
        word: 'prairies',
        partOfSpeech: 'noun',
        simpleDefinition: 'Wide, flat areas of land covered in grass.',
        contextMeaning: 'Large underwater fields of green seagrass covering the shallow seabed.',
        originalSentence: 'Known as seagrass meadows, these underwater prairies grow in sunlit bays and lagoons on every continent except Antarctica.',
        exampleSentence: 'Bison once roamed across the wide grassy prairies of North America.',
        synonyms: ['grasslands', 'meadows'],
        arabicTranslation: 'مروج / سهول عشبية'
      },
      {
        id: 'b1-exp-env-2',
        word: 'evolved',
        partOfSpeech: 'verb',
        simpleDefinition: 'Developed gradually over millions of years from earlier living forms.',
        contextMeaning: 'Changed slowly from ancient land grasses into marine plants.',
        originalSentence: 'Seagrass, by contrast, is a true flowering plant that evolved from land grasses millions of years ago before returning to the sea.',
        exampleSentence: 'Modern birds evolved from small feathered dinosaurs.',
        synonyms: ['developed', 'adapted'],
        arabicTranslation: 'تطور'
      },
      {
        id: 'b1-exp-env-3',
        word: 'rhizomes',
        partOfSpeech: 'noun',
        simpleDefinition: 'Horizontal underground plant stems that send out roots and new shoots.',
        contextMeaning: 'The buried stems that anchor seagrass into the muddy ocean floor.',
        originalSentence: 'It has real roots, underground stems called rhizomes, veins, and tiny underwater flowers that release pollen into ocean currents.',
        exampleSentence: 'Ginger and seagrass both spread through underground rhizomes.',
        synonyms: ['underground stems', 'rootstocks'],
        arabicTranslation: 'جذامير (سيقان أرضية)'
      },
      {
        id: 'b1-exp-env-4',
        word: 'sediment',
        partOfSpeech: 'noun',
        simpleDefinition: 'Sand, mud, and tiny bits of plant matter that settle at the bottom of water.',
        contextMeaning: 'The muddy layer on the seafloor where carbon is buried.',
        originalSentence: 'Because the muddy sediment beneath a seagrass meadow contains almost no oxygen, dead leaves and trapped carbon do not rot quickly.',
        exampleSentence: 'Rivers carry rich sediment down from the mountains to the sea.',
        synonyms: ['seabed mud', 'silt'],
        arabicTranslation: 'رواسب'
      },
      {
        id: 'b1-exp-env-5',
        word: 'nurseries',
        partOfSpeech: 'noun',
        simpleDefinition: 'Safe habitats where young animals grow and are protected from danger.',
        contextMeaning: 'Sheltered seagrass beds where young fish and crabs hide until they grow larger.',
        originalSentence: 'Beyond storing "blue carbon," seagrass meadows act as essential nurseries for marine life.',
        exampleSentence: 'Shallow coastal bays serve as nurseries for young sharks and fish.',
        synonyms: ['breeding grounds', 'shelters'],
        arabicTranslation: 'حاضنات طبيعية لصغار الكائنات'
      },
      {
        id: 'b1-exp-env-6',
        word: 'erosion',
        partOfSpeech: 'noun',
        simpleDefinition: 'The gradual wearing away of soil, sand, or rock by waves, wind, or rain.',
        contextMeaning: 'The washing away of sandy beaches and coastlines by strong ocean waves.',
        originalSentence: 'At the same time, the roots bind coastal sand together and reduce shoreline erosion during winter storms.',
        exampleSentence: 'Planting dune grass helps prevent beach erosion during storms.',
        synonyms: ['wearing away', 'soil loss'],
        arabicTranslation: 'تآكل / انجراف التربة'
      },
      {
        id: 'b1-exp-env-7',
        word: 'runoff',
        partOfSpeech: 'noun',
        simpleDefinition: 'Rainwater that flows off farmland into rivers and seas, carrying chemicals or soil.',
        contextMeaning: 'Farm water carrying excess fertilizer into coastal bays, which clouds the water and harms seagrass.',
        originalSentence: 'Sadly, nearly thirty percent of the world’s seagrass meadows have disappeared over the past century due to agricultural fertilizer runoff, coastal dredging, and boat anchors dragging across the seabed.',
        exampleSentence: 'Buffer strips of trees along rivers filter out farm runoff.',
        synonyms: ['drainage water', 'agricultural wash'],
        arabicTranslation: 'مياه الجريان السطحي الزراعي'
      },
      {
        id: 'b1-exp-env-8',
        word: 'dredging',
        partOfSpeech: 'noun',
        simpleDefinition: 'Digging out mud and sand from the bottom of a harbor or bay to make it deeper for ships.',
        contextMeaning: 'Scooping up the seafloor for shipping channels, which uproots seagrass beds.',
        originalSentence: 'Sadly, nearly thirty percent of the world’s seagrass meadows have disappeared over the past century due to agricultural fertilizer runoff, coastal dredging, and boat anchors dragging across the seabed.',
        exampleSentence: 'Port workers used a barge for dredging the shallow harbor entrance.',
        synonyms: ['seabed excavation'],
        arabicTranslation: 'تجريف قاع البحر'
      }
    ],
    questions: [
      {
        id: 'b1-exp-env-q1',
        type: 'true_false_not_given',
        prompt: 'Seagrass meadows grow along shallow coastlines on every continent except Antarctica.',
        correctAnswer: 'True',
        explanation: 'Paragraph 1 states that seagrass meadows grow in sunlit bays and lagoons on every continent except Antarctica.',
        passageEvidence: 'Known as seagrass meadows, these underwater prairies grow in sunlit bays and lagoons on every continent except Antarctica.'
      },
      {
        id: 'b1-exp-env-q2',
        type: 'true_false_not_given',
        prompt: 'Seagrass and seaweed are biologically identical and neither one has true roots.',
        correctAnswer: 'False',
        explanation: 'Paragraph 2 explains that seagrass and seaweed are biologically very different: seaweed is an alga without true roots, whereas seagrass is a true flowering plant with real roots and rhizomes.',
        passageEvidence: 'Although seagrass looks like common seaweed, the two are biologically very different.'
      },
      {
        id: 'b1-exp-env-q3',
        type: 'true_false_not_given',
        prompt: 'Green sea turtles eat more seagrass in summer than they do in winter.',
        correctAnswer: 'Not Given',
        explanation: 'Paragraph 4 mentions green sea turtles sheltered in seagrass meadows, but it never compares their summer and winter diet.',
        passageEvidence: 'A single hectare of healthy seagrass can shelter tens of thousands of young cod, seahorses, crabs, and green sea turtles, protecting them from larger predators in the open ocean.'
      },
      {
        id: 'b1-exp-env-q4',
        type: 'yes_no_not_given',
        prompt: 'The author considers underwater seagrass meadows to be among the planet’s most effective carbon traps.',
        correctAnswer: 'Yes',
        explanation: 'In Paragraph 1, the author notes that some of the planet’s most effective carbon traps lie hidden just beneath the waves in seagrass meadows.',
        passageEvidence: 'Yet marine biologists point out that some of the planet’s most effective carbon traps lie hidden just beneath the waves along shallow coastlines.'
      },
      {
        id: 'b1-exp-env-q5',
        type: 'multiple_choice',
        prompt: 'Why does organic carbon trapped in seagrass sediment stay locked away for centuries instead of rotting quickly?',
        options: [
          'Because the muddy sediment beneath a seagrass meadow contains almost no oxygen',
          'Because seawater at the bottom of shallow bays is frozen solid all year',
          'Because crabs carry the dead leaves into deep ocean trenches',
          'Because boat anchors press the mud into solid granite rock'
        ],
        correctAnswer: 'Because the muddy sediment beneath a seagrass meadow contains almost no oxygen',
        explanation: 'Paragraph 3 explains that because the muddy sediment beneath a seagrass meadow contains almost no oxygen, dead leaves and trapped carbon do not rot quickly.',
        passageEvidence: 'Because the muddy sediment beneath a seagrass meadow contains almost no oxygen, dead leaves and trapped carbon do not rot quickly.'
      },
      {
        id: 'b1-exp-env-q6',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 2: Seagrass has real roots, underground stems called ______, veins, and tiny underwater flowers.',
        correctAnswer: 'rhizomes',
        acceptedAnswers: ['rhizomes'],
        explanation: 'Paragraph 2 states that seagrass has underground stems called rhizomes.',
        passageEvidence: 'It has real roots, underground stems called rhizomes, veins, and tiny underwater flowers that release pollen into ocean currents.'
      },
      {
        id: 'b1-exp-env-q7',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 4, what does the word "nurseries" mean?',
        options: [
          'Safe habitats where young marine animals shelter and grow',
          'Underwater hospitals where divers treat injured whales',
          'Greenhouses on land where farmers grow tomato seedlings',
          'Deep ocean caves where sunlight never reaches'
        ],
        correctAnswer: 'Safe habitats where young marine animals shelter and grow',
        explanation: 'In Paragraph 4, seagrass meadows act as nurseries by sheltering tens of thousands of young cod, seahorses, and crabs from larger predators.',
        passageEvidence: 'Beyond storing "blue carbon," seagrass meadows act as essential nurseries for marine life.'
      },
      {
        id: 'b1-exp-env-q8',
        type: 'short_answer',
        prompt: 'Answer with ONE OR TWO WORDS from Paragraph 5: What kind of small bags do conservation teams fill with seagrass seeds to restore damaged bays?',
        correctAnswer: 'hessian bags',
        acceptedAnswers: ['hessian bags', 'hessian', 'small hessian bags'],
        explanation: 'Paragraph 5 states that teams restore damaged bays by suspending small hessian bags filled with seagrass seeds.',
        passageEvidence: 'Today, conservation teams and local fishing communities are restoring damaged bays by suspending small hessian bags filled with seagrass seeds along the ocean floor and replacing heavy chain moorings with eco-friendly floating buoys.'
      },
      {
        id: 'b1-exp-env-q9',
        type: 'matching_information',
        prompt: 'Which paragraph explains the biological differences between seaweed and seagrass?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4', 'Paragraph 5'],
        correctAnswer: 'Paragraph 2',
        explanation: 'Paragraph 2 contrasts seaweed (a simple alga with a holdfast) with seagrass (a true flowering plant with roots, rhizomes, and flowers).',
        passageEvidence: 'Although seagrass looks like common seaweed, the two are biologically very different.'
      },
      {
        id: 'b1-exp-env-q10',
        type: 'summary_completion',
        prompt: 'Complete the summary with ONE WORD from Paragraph 4: Seagrass roots bind coastal sand together and reduce shoreline ______ during winter storms.',
        correctAnswer: 'erosion',
        acceptedAnswers: ['erosion'],
        explanation: 'Paragraph 4 states that the roots bind coastal sand together and reduce shoreline erosion during winter storms.',
        passageEvidence: 'At the same time, the roots bind coastal sand together and reduce shoreline erosion during winter storms.'
      }
    ]
  },
  {
    id: 'b1-psy-choice-overload',
    title: 'The Paradox of Choice: Why Too Many Options Can Reduce Satisfaction',
    level: 'B1',
    topic: 'Psychology and human behaviour',
    status: 'published',
    estimatedMinutes: 9,
    generationBatch: 'batch-expansion-b1',
    imageStatus: 'ready',
    introduction: 'Examine classic psychological experiments showing why shoppers often feel happier and more decisive when choosing from six options rather than thirty.',
    illustrationAlt: 'Photograph of rows of colourful glass jam jars displayed on supermarket shelves',
    passage: [
      'In modern supermarkets and online stores, shoppers are surrounded by an extraordinary variety of products. A single grocery aisle may display forty flavours of fruit jam, fifty styles of breakfast cereal, and dozens of brands of toothpaste. Conventional economic theory assumes that expanding the number of options is always beneficial, because a wider selection increases the chance that every individual will find their exact preference.',
      'However, behavioural psychologists have demonstrated that beyond a reasonable threshold, an abundance of options can actually paralyse decision-making and lower personal satisfaction. Psychologists call this phenomenon "choice overload." One of the most famous demonstrations took place in an upscale California food market, where researchers set up a tasting booth for gourmet fruit jams on two consecutive Saturdays.',
      'During the first condition, the table displayed an extensive assortment of twenty-four different flavours of jam. Passing shoppers were intrigued by the large display, and sixty percent of them stopped to sample the spreads. In the second condition a few hours later, researchers reduced the display to just six flavours. Slightly fewer people stopped at the smaller table—about forty percent—yet the purchasing behaviour was striking. Among shoppers who saw twenty-four jams, only three percent actually bought a jar. Among those who saw just six jams, thirty percent made a purchase—ten times more.',
      'Why does a huge selection discourage people from acting? Researchers identify two psychological mechanisms. First, comparing twenty-four similar alternatives demands heavy cognitive effort; shoppers feel mentally exhausted and postpone the decision rather than risk picking the wrong jar. Second, even when people do choose from a giant list, they experience "anticipated regret." They worry that one of the twenty-three rejected options might have tasted even better, which diminishes their enjoyment of the jam they actually took home.',
      'Recognizing choice overload has practical value for educators, software designers, and businesses alike. When a restaurant trims a twenty-page menu down to a single curated page, or when a learning platform recommends three focused courses instead of a hundred, people decide with greater confidence and feel far more satisfied with their choice. Subsequent studies have shown that the same pattern appears in much bigger life decisions, such as selecting a retirement savings plan or a university degree module. When employers offered staff fifty different pension funds, participation rates actually dropped because workers kept putting off the complicated comparison; when the list was simplified to four clear options, enrolment rose sharply. Of course, psychologists note that a large catalogue still works well for experienced experts who already know the exact technical specifications they want. For everyday beginners and busy shoppers, however, thoughtful curation and clear categories are far more helpful than endless variety. Designing calmer decision environments saves mental energy for the tasks that truly matter. Online bookstores and streaming services apply the same lesson when they highlight five staff picks at the top of the screen instead of forcing visitors to scroll through thousands of unsorted titles. Teachers in secondary schools have also noticed that students write stronger research essays when they choose from four well-defined topic prompts rather than an open list of fifty subjects. Limiting unnecessary clutter gives people the clarity they need to act with purpose and enjoy what they choose.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'b1-exp-psy-1',
        word: 'assumes',
        partOfSpeech: 'verb',
        simpleDefinition: 'Accepts something as true without questioning or proving it.',
        contextMeaning: 'Takes for granted that having more choices always makes shoppers happier.',
        originalSentence: 'Conventional economic theory assumes that expanding the number of options is always beneficial, because a wider selection increases the chance that every individual will find their exact preference.',
        exampleSentence: 'The schedule assumes that the morning train will arrive on time.',
        synonyms: ['supposes', 'presumes'],
        arabicTranslation: 'يفترض'
      },
      {
        id: 'b1-exp-psy-2',
        word: 'threshold',
        partOfSpeech: 'noun',
        simpleDefinition: 'A limit or point at which a situation starts to change.',
        contextMeaning: 'The sensible number of options beyond which extra choices become overwhelming.',
        originalSentence: 'However, behavioural psychologists have demonstrated that beyond a reasonable threshold, an abundance of options can actually paralyse decision-making and lower personal satisfaction.',
        exampleSentence: 'Noise above a certain threshold can damage human hearing.',
        synonyms: ['limit', 'boundary', 'tipping point'],
        arabicTranslation: 'حدّ / عتبة'
      },
      {
        id: 'b1-exp-psy-3',
        word: 'paralyse',
        partOfSpeech: 'verb',
        simpleDefinition: 'To make someone unable to act, move, or decide.',
        contextMeaning: 'To cause shoppers to freeze up and walk away without buying anything.',
        originalSentence: 'However, behavioural psychologists have demonstrated that beyond a reasonable threshold, an abundance of options can actually paralyse decision-making and lower personal satisfaction.',
        exampleSentence: 'Fear of making a mistake can paralyse a nervous speaker.',
        synonyms: ['freeze', 'immobilize', 'block'],
        arabicTranslation: 'يشلّ (القدرة على اتخاذ القرار)'
      },
      {
        id: 'b1-exp-psy-4',
        word: 'assortment',
        partOfSpeech: 'noun',
        simpleDefinition: 'A varied group or collection of different things of the same general type.',
        contextMeaning: 'The collection of twenty-four different flavours of jam on the tasting table.',
        originalSentence: 'During the first condition, the table displayed an extensive assortment of twenty-four different flavours of jam.',
        exampleSentence: 'The bakery sells a delicious assortment of fresh pastries.',
        synonyms: ['selection', 'variety', 'collection'],
        arabicTranslation: 'تشكيلة متنوعة'
      },
      {
        id: 'b1-exp-psy-5',
        word: 'intrigued',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Very interested and curious to know more about something.',
        contextMeaning: 'Attracted and curious when seeing the large table of twenty-four jams.',
        originalSentence: 'Passing shoppers were intrigued by the large display, and sixty percent of them stopped to sample the spreads.',
        exampleSentence: 'Students were intrigued by the ancient map on the classroom wall.',
        synonyms: ['curious', 'fascinated', 'interested'],
        arabicTranslation: 'مُثار الفضول / مهتم بشدة'
      },
      {
        id: 'b1-exp-psy-6',
        word: 'postpone',
        partOfSpeech: 'verb',
        simpleDefinition: 'To delay an action or decision until a later time.',
        contextMeaning: 'To put off buying anything because choosing feels too tiring.',
        originalSentence: 'First, comparing twenty-four similar alternatives demands heavy cognitive effort; shoppers feel mentally exhausted and postpone the decision rather than risk picking the wrong jar.',
        exampleSentence: 'They decided to postpone the outdoor concert until the rain stopped.',
        synonyms: ['delay', 'put off'],
        arabicTranslation: 'يؤجل'
      },
      {
        id: 'b1-exp-psy-7',
        word: 'diminishes',
        partOfSpeech: 'verb',
        simpleDefinition: 'Makes something smaller, weaker, or less enjoyable.',
        contextMeaning: 'Reduces how happy the shopper feels with the jar of jam they chose.',
        originalSentence: 'They worry that one of the twenty-three rejected options might have tasted even better, which diminishes their enjoyment of the jam they actually took home.',
        exampleSentence: 'Reading in dim light diminishes your ability to see small print.',
        synonyms: ['reduces', 'lessens', 'lowers'],
        arabicTranslation: 'يقلل / يُضعف'
      },
      {
        id: 'b1-exp-psy-8',
        word: 'curated',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Carefully chosen and organized by an expert so only the best items are included.',
        contextMeaning: 'Thoughtfully selected so diners or learners see a manageable set of high-quality options.',
        originalSentence: 'When a restaurant trims a twenty-page menu down to a single curated page, or when a learning platform recommends three focused courses instead of a hundred, people decide with greater confidence and feel far more satisfied with their choice.',
        exampleSentence: 'The bookshop has a curated shelf of local history books.',
        synonyms: ['carefully selected', 'handpicked'],
        arabicTranslation: 'منتقى بعناية'
      }
    ],
    questions: [
      {
        id: 'b1-exp-psy-q1',
        type: 'true_false_not_given',
        prompt: 'More shoppers stopped to look at the table when it displayed twenty-four flavours of jam than when it displayed six flavours.',
        correctAnswer: 'True',
        explanation: 'Paragraph 3 states that sixty percent stopped at the 24-flavour display, whereas about forty percent stopped at the 6-flavour display.',
        passageEvidence: 'Passing shoppers were intrigued by the large display, and sixty percent of them stopped to sample the spreads. In the second condition a few hours later, researchers reduced the display to just six flavours. Slightly fewer people stopped at the smaller table—about forty percent—yet the purchasing behaviour was striking.'
      },
      {
        id: 'b1-exp-psy-q2',
        type: 'true_false_not_given',
        prompt: 'Shoppers at the twenty-four-jam table bought ten times more jars than shoppers at the six-jam table.',
        correctAnswer: 'False',
        explanation: 'Paragraph 3 states the opposite: only 3% bought from the 24-jam table, while 30% bought from the 6-jam table—ten times more at the smaller display.',
        passageEvidence: 'Among shoppers who saw twenty-four jams, only three percent actually bought a jar. Among those who saw just six jams, thirty percent made a purchase—ten times more.'
      },
      {
        id: 'b1-exp-psy-q3',
        type: 'true_false_not_given',
        prompt: 'Strawberry was the best-selling jam flavour in both conditions of the California experiment.',
        correctAnswer: 'Not Given',
        explanation: 'The passage reports the percentages of shoppers who stopped and bought jam, but it never mentions which specific flavour sold best.',
        passageEvidence: 'Among those who saw just six jams, thirty percent made a purchase—ten times more.'
      },
      {
        id: 'b1-exp-psy-q4',
        type: 'yes_no_not_given',
        prompt: 'The author claims that online shoppers experience stronger choice overload on mobile phones than on desktop computers.',
        correctAnswer: 'Not Given',
        explanation: 'The author discusses choice overload in grocery stores, restaurants, and online learning platforms, but never compares mobile phones with desktop computers.',
        passageEvidence: 'However, behavioural psychologists have demonstrated that beyond a reasonable threshold, an abundance of options can actually paralyse decision-making and lower personal satisfaction.'
      },
      {
        id: 'b1-exp-psy-q5',
        type: 'multiple_choice',
        prompt: 'What do psychologists mean by the term "anticipated regret" in Paragraph 4?',
        options: [
          'Worrying that one of the rejected options might have been better than the option chosen',
          'Forgetting to bring a reusable shopping bag to the supermarket',
          'Feeling sad when a favourite flavour of jam is sold out',
          'Wishing that a store offered fifty flavours instead of twenty-four'
        ],
        correctAnswer: 'Worrying that one of the rejected options might have been better than the option chosen',
        explanation: 'Paragraph 4 explains that buyers worry that one of the twenty-three rejected options might have tasted even better, which diminishes their enjoyment.',
        passageEvidence: 'Second, even when people do choose from a giant list, they experience "anticipated regret." They worry that one of the twenty-three rejected options might have tasted even better, which diminishes their enjoyment of the jam they actually took home.'
      },
      {
        id: 'b1-exp-psy-q6',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with TWO WORDS from Paragraph 2: Psychologists call the problem of having too many options ______.',
        correctAnswer: 'choice overload',
        acceptedAnswers: ['choice overload'],
        explanation: 'Paragraph 2 states: "Psychologists call this phenomenon \'choice overload.\'"',
        passageEvidence: 'Psychologists call this phenomenon "choice overload."'
      },
      {
        id: 'b1-exp-psy-q7',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 4, the word "diminishes" is closest in meaning to:',
        options: [
          'Reduces or lessens',
          'Doubles or increases',
          'Measures with a scale',
          'Shares with neighbors'
        ],
        correctAnswer: 'Reduces or lessens',
        explanation: '"Diminishes their enjoyment" means reduces or lessens how much they enjoy the jam they bought.',
        passageEvidence: 'They worry that one of the twenty-three rejected options might have tasted even better, which diminishes their enjoyment of the jam they actually took home.'
      },
      {
        id: 'b1-exp-psy-q8',
        type: 'short_answer',
        prompt: 'Answer with TWO WORDS from Paragraph 3: What percentage of shoppers who stopped at the six-jam display actually bought a jar?',
        correctAnswer: 'thirty percent',
        acceptedAnswers: ['thirty percent', '30 percent', '30%'],
        explanation: 'Paragraph 3 states that among those who saw just six jams, thirty percent made a purchase.',
        passageEvidence: 'Among those who saw just six jams, thirty percent made a purchase—ten times more.'
      },
      {
        id: 'b1-exp-psy-q9',
        type: 'matching_information',
        prompt: 'Which paragraph explains how restaurants and learning platforms can apply choice-overload research?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4', 'Paragraph 5'],
        correctAnswer: 'Paragraph 5',
        explanation: 'Paragraph 5 gives examples of a restaurant trimming a menu to a single curated page and a learning platform recommending three focused courses.',
        passageEvidence: 'When a restaurant trims a twenty-page menu down to a single curated page, or when a learning platform recommends three focused courses instead of a hundred, people decide with greater confidence and feel far more satisfied with their choice.'
      },
      {
        id: 'b1-exp-psy-q10',
        type: 'summary_completion',
        prompt: 'Complete the summary with ONE WORD from Paragraph 4: Comparing twenty-four similar alternatives demands heavy cognitive ______, leaving shoppers mentally exhausted.',
        correctAnswer: 'effort',
        acceptedAnswers: ['effort'],
        explanation: 'Paragraph 4 states that comparing twenty-four similar alternatives demands heavy cognitive effort.',
        passageEvidence: 'First, comparing twenty-four similar alternatives demands heavy cognitive effort; shoppers feel mentally exhausted and postpone the decision rather than risk picking the wrong jar.'
      }
    ]
  },
  {
    id: 'b1-his-antikythera-mechanism',
    title: 'The Antikythera Mechanism: Ancient Greece’s Geared Astronomical Computer',
    level: 'B1',
    topic: 'History and archaeology',
    status: 'published',
    estimatedMinutes: 9,
    generationBatch: 'batch-expansion-b1',
    imageStatus: 'ready',
    introduction: 'Discover how sponge divers in 1901 pulled a corroded bronze box from an ancient Roman shipwreck that rewrote the history of technology.',
    illustrationAlt: 'Photograph of the ancient bronze Antikythera mechanism fragment with interlocking gear wheels',
    passage: [
      'In the spring of 1901, Greek sponge divers sheltering from a storm near the tiny island of Antikythera discovered the wreck of an ancient Roman cargo ship forty-five metres beneath the Aegean Sea. Alongside marble statues, glass bowls, and bronze coins dating to the first century BCE, divers brought up a green, corroded lump of bronze about the size of a shoebox. At first, museum curators paid little attention to the encrusted object.',
      'A few months later, however, the wooden frame dried and cracked open, revealing interlocking bronze gear wheels covered in tiny Greek inscriptions. Historians were astonished. Before this discovery, scholars believed that complex geared clockwork was not invented until fourteen hundred years later in medieval European cathedral clocks. Nothing in surviving Greek or Roman texts had prepared archaeologists for a precision mechanical instrument from antiquity.',
      'For decades, the fragile fragments were too delicate to take apart physically. The breakthrough came in the early twenty-first century, when an international team of physicists, astronomers, and archaeologists scanned the eighty-two surviving pieces using high-resolution three-dimensional X-ray tomography. These detailed X-ray slices allowed researchers to read thousands of hidden characters engraved inside the machine and reconstruct its thirty meshing bronze gears.',
      'The scans proved that the Antikythera Mechanism was an ingenious hand-cranked astronomical calculator. By turning a knob on the side to select any past or future date, the user moved multiple pointers across circular dials on the front and back faces. The front dials tracked the position of the Sun and Moon through the zodiac constellations and displayed the phases of the Moon using a half-silvered, half-black rotating sphere. The back dials predicted lunar and solar eclipses decades in advance and even tracked the four-year cycle of the ancient Olympic Games.',
      'Although the identity of its maker remains uncertain, several clues link the device to the astronomical tradition of Rhodes or Syracuse, where the mathematician Archimedes once designed planetarium spheres. Whatever workshop built it, the Antikythera Mechanism proves that ancient Greek craftsmanship achieved a level of mechanical sophistication that was lost for more than a millennium. When the Roman ship sank in a storm around 60 BCE, knowledge of how to cut such intricate bronze gear trains appears to have vanished from the Mediterranean world, and comparable clockwork mechanisms did not reappear in European cathedral towns until the fourteenth century. Modern engineers who have built working brass replicas of the mechanism marvel at how tightly the ancient artisan packed more than thirty interlocking gears into a wooden case no larger than a hardcover book. Today, the fragile bronze fragments rest in climate-controlled display cases at the National Archaeological Museum in Athens, accompanied by interactive digital models that allow visitors to turn a virtual hand crank and watch ancient eclipses unfold across the dials. Researchers continue to study the tiny Greek letters engraved on the bronze casing, which served as an ancient user manual explaining eclipses and planetary cycles. Each newly deciphered word adds to our picture of how Mediterranean sailors, astronomers, and philosophers shared scientific knowledge across islands and ports. Even after more than two thousand years beneath the sea, the Antikythera Mechanism reminds us of the brilliance of ancient engineering and scientific curiosity.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'b1-exp-his-1',
        word: 'corroded',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Damaged and worn away slowly by chemical reactions with seawater or air.',
        contextMeaning: 'Turned green and rough after lying under salty seawater for two thousand years.',
        originalSentence: 'Alongside marble statues, glass bowls, and bronze coins dating to the first century BCE, divers brought up a green, corroded lump of bronze about the size of a shoebox.',
        exampleSentence: 'The old iron anchor was heavily corroded by seawater.',
        synonyms: ['rusted', 'weathered', 'oxidized'],
        arabicTranslation: 'متآكل بفعل الصدأ والمياه'
      },
      {
        id: 'b1-exp-his-2',
        word: 'curators',
        partOfSpeech: 'noun',
        simpleDefinition: 'Specialists who care for and study historical objects in a museum.',
        contextMeaning: 'Museum experts who examined the treasures brought up from the shipwreck.',
        originalSentence: 'At first, museum curators paid little attention to the encrusted object.',
        exampleSentence: 'Museum curators cleaned the ancient pottery with soft brushes.',
        synonyms: ['museum keepers', 'conservators'],
        arabicTranslation: 'أمناء المتحف'
      },
      {
        id: 'b1-exp-his-3',
        word: 'inscriptions',
        partOfSpeech: 'noun',
        simpleDefinition: 'Words or letters carved into metal, stone, or wood.',
        contextMeaning: 'Tiny Greek letters and labels engraved onto the bronze plates of the machine.',
        originalSentence: 'A few months later, however, the wooden frame dried and cracked open, revealing interlocking bronze gear wheels covered in tiny Greek inscriptions.',
        exampleSentence: 'Historians translated the Latin inscriptions on the Roman arch.',
        synonyms: ['engravings', 'carved writing'],
        arabicTranslation: 'نقوش كتابية'
      },
      {
        id: 'b1-exp-his-4',
        word: 'antiquity',
        partOfSpeech: 'noun',
        simpleDefinition: 'The distant historical past, especially the time of ancient Greece, Rome, and Egypt.',
        contextMeaning: 'The ancient Greek and Roman world more than two thousand years ago.',
        originalSentence: 'Nothing in surviving Greek or Roman texts had prepared archaeologists for a precision mechanical instrument from antiquity.',
        exampleSentence: 'Many marble temples from antiquity still stand around the Mediterranean.',
        synonyms: ['ancient times', 'the classical era'],
        arabicTranslation: 'العصور القديمة'
      },
      {
        id: 'b1-exp-his-5',
        word: 'fragile',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Easily broken or damaged; requiring very gentle handling.',
        contextMeaning: 'Too delicate to pry apart by hand without breaking the ancient bronze.',
        originalSentence: 'For decades, the fragile fragments were too delicate to take apart physically.',
        exampleSentence: 'The ancient papyrus scroll was too fragile to unroll by hand.',
        synonyms: ['delicate', 'brittle'],
        arabicTranslation: 'هش / سريع الانكسار'
      },
      {
        id: 'b1-exp-his-6',
        word: 'ingenious',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Extremely clever, original, and well-designed.',
        contextMeaning: 'Brilliantly engineered to calculate complex sky movements using bronze gears.',
        originalSentence: 'The scans proved that the Antikythera Mechanism was an ingenious hand-cranked astronomical calculator.',
        exampleSentence: 'Da Vinci sketched many ingenious flying machines in his notebooks.',
        synonyms: ['brilliant', 'inventive', 'clever'],
        arabicTranslation: 'بارع / عبقري التصميم'
      },
      {
        id: 'b1-exp-his-7',
        word: 'sophistication',
        partOfSpeech: 'noun',
        simpleDefinition: 'A high level of technical complexity, skill, and refinement.',
        contextMeaning: 'Advanced engineering skill far ahead of what historians previously expected.',
        originalSentence: 'Whatever workshop built it, the Antikythera Mechanism proves that ancient Greek craftsmanship achieved a level of mechanical sophistication that was lost for more than a millennium.',
        exampleSentence: 'The sophistication of ancient irrigation canals impressed modern engineers.',
        synonyms: ['complexity', 'advancement'],
        arabicTranslation: 'تطور تقني / براعة متقدمة'
      },
      {
        id: 'b1-exp-his-8',
        word: 'millennium',
        partOfSpeech: 'noun',
        simpleDefinition: 'A period of one thousand years.',
        contextMeaning: 'More than a thousand years between the Antikythera Mechanism and medieval European clocks.',
        originalSentence: 'Whatever workshop built it, the Antikythera Mechanism proves that ancient Greek craftsmanship achieved a level of mechanical sophistication that was lost for more than a millennium.',
        exampleSentence: 'The olive tree has stood on the hillside for nearly a millennium.',
        synonyms: ['thousand years'],
        arabicTranslation: 'ألفية (ألف عام)'
      }
    ],
    questions: [
      {
        id: 'b1-exp-his-q1',
        type: 'true_false_not_given',
        prompt: 'Before the Antikythera Mechanism was examined, historians thought complex geared clockwork first appeared in medieval European clocks.',
        correctAnswer: 'True',
        explanation: 'Paragraph 2 states that before this discovery, scholars believed complex geared clockwork was not invented until fourteen hundred years later in medieval European cathedral clocks.',
        passageEvidence: 'Before this discovery, scholars believed that complex geared clockwork was not invented until fourteen hundred years later in medieval European cathedral clocks.'
      },
      {
        id: 'b1-exp-his-q2',
        type: 'true_false_not_given',
        prompt: 'Scientists in the twenty-first century used hammers and chisels to take the eighty-two bronze pieces apart.',
        correctAnswer: 'False',
        explanation: 'Paragraph 3 explains that the fragments were too delicate to take apart physically, so scientists scanned them using non-destructive 3D X-ray tomography.',
        passageEvidence: 'For decades, the fragile fragments were too delicate to take apart physically. The breakthrough came in the early twenty-first century, when an international team of physicists, astronomers, and archaeologists scanned the eighty-two surviving pieces using high-resolution three-dimensional X-ray tomography.'
      },
      {
        id: 'b1-exp-his-q3',
        type: 'true_false_not_given',
        prompt: 'The Roman cargo ship was sailing toward Rome when it sank in a storm.',
        correctAnswer: 'Not Given',
        explanation: 'Paragraph 1 states that sponge divers discovered an ancient Roman cargo ship near Antikythera, but it never states the ship’s destination.',
        passageEvidence: 'In the spring of 1901, Greek sponge divers sheltering from a storm near the tiny island of Antikythera discovered the wreck of an ancient Roman cargo ship forty-five metres beneath the Aegean Sea.'
      },
      {
        id: 'b1-exp-his-q4',
        type: 'yes_no_not_given',
        prompt: 'The author believes that underwater robots will soon discover a second geared astronomical calculator in the Antikythera shipwreck.',
        correctAnswer: 'Not Given',
        explanation: 'Paragraph 5 discusses the uncertain identity of the maker and modern digital models and studies of the inscriptions, but never predicts that underwater robots will find a second calculator.',
        passageEvidence: 'Although the identity of its maker remains uncertain, several clues link the device to the astronomical tradition of Rhodes or Syracuse, where the mathematician Archimedes once designed planetarium spheres.'
      },
      {
        id: 'b1-exp-his-q5',
        type: 'multiple_choice',
        prompt: 'How did the Antikythera Mechanism show the phases of the Moon on its front dial?',
        options: [
          'Using a half-silvered, half-black rotating sphere',
          'By lighting small oil lamps behind glass windows',
          'By ringing a bronze bell once every twenty-eight days',
          'Using water droplets falling into a stone bowl'
        ],
        correctAnswer: 'Using a half-silvered, half-black rotating sphere',
        explanation: 'Paragraph 4 states that the front dials displayed the phases of the Moon using a half-silvered, half-black rotating sphere.',
        passageEvidence: 'The front dials tracked the position of the Sun and Moon through the zodiac constellations and displayed the phases of the Moon using a half-silvered, half-black rotating sphere.'
      },
      {
        id: 'b1-exp-his-q6',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 4: The back dials predicted lunar and solar ______ decades in advance.',
        correctAnswer: 'eclipses',
        acceptedAnswers: ['eclipses'],
        explanation: 'Paragraph 4 states that the back dials predicted lunar and solar eclipses decades in advance.',
        passageEvidence: 'The back dials predicted lunar and solar eclipses decades in advance and even tracked the four-year cycle of the ancient Olympic Games.'
      },
      {
        id: 'b1-exp-his-q7',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 5, what does the word "millennium" mean?',
        options: [
          'A period of one thousand years',
          'An ancient Greek island in the Aegean Sea',
          'A bronze tool used for cutting gear teeth',
          'A type of X-ray scanner used in museums'
        ],
        correctAnswer: 'A period of one thousand years',
        explanation: '"More than a millennium" refers to the period of more than one thousand years during which geared clockwork technology was lost.',
        passageEvidence: 'Whatever workshop built it, the Antikythera Mechanism proves that ancient Greek craftsmanship achieved a level of mechanical sophistication that was lost for more than a millennium.'
      },
      {
        id: 'b1-exp-his-q8',
        type: 'short_answer',
        prompt: 'Answer with TWO WORDS from Paragraph 1: Who discovered the ancient shipwreck near Antikythera in 1901?',
        correctAnswer: 'sponge divers',
        acceptedAnswers: ['sponge divers', 'Greek sponge divers', 'divers'],
        explanation: 'Paragraph 1 states that Greek sponge divers discovered the wreck.',
        passageEvidence: 'In the spring of 1901, Greek sponge divers sheltering from a storm near the tiny island of Antikythera discovered the wreck of an ancient Roman cargo ship forty-five metres beneath the Aegean Sea.'
      },
      {
        id: 'b1-exp-his-q9',
        type: 'matching_information',
        prompt: 'Which paragraph explains how modern 3D X-ray imaging helped researchers read hidden text inside the fragments?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4', 'Paragraph 5'],
        correctAnswer: 'Paragraph 3',
        explanation: 'Paragraph 3 describes scanning the eighty-two surviving pieces using high-resolution three-dimensional X-ray tomography.',
        passageEvidence: 'These detailed X-ray slices allowed researchers to read thousands of hidden characters engraved inside the machine and reconstruct its thirty meshing bronze gears.'
      },
      {
        id: 'b1-exp-his-q10',
        type: 'summary_completion',
        prompt: 'Complete the summary with TWO WORDS from Paragraph 4: In addition to eclipses, the back dials tracked the four-year cycle of the ancient ______.',
        correctAnswer: 'Olympic Games',
        acceptedAnswers: ['Olympic Games', 'Olympics'],
        explanation: 'Paragraph 4 states that the back dials even tracked the four-year cycle of the ancient Olympic Games.',
        passageEvidence: 'The back dials predicted lunar and solar eclipses decades in advance and even tracked the four-year cycle of the ancient Olympic Games.'
      }
    ]
  },
  {
    id: 'b1-edu-interleaved-practice',
    title: 'Why Mixing Different Problem Types Improves Long-Term Mastery',
    level: 'B1',
    topic: 'Education and learning',
    status: 'published',
    estimatedMinutes: 9,
    generationBatch: 'batch-expansion-b1',
    imageStatus: 'ready',
    introduction: 'Learn why practising several related skills in a mixed order builds stronger exam performance than repeating the same type of exercise twenty times in a row.',
    illustrationAlt: 'Photograph of a student solving geometry and algebra problems across multiple open notebooks',
    passage: [
      'Most school textbooks follow a familiar structure called blocked practice. In a geometry workbook, for example, Chapter Four might teach how to calculate the volume of a cone, followed immediately by twenty practice problems that all use the exact same cone formula. Once students finish that page, they move to Chapter Five and solve twenty problems about spheres. Blocked practice feels comfortable because after the third question, students already know which formula to apply without reading carefully.',
      'Over the past twenty years, however, educational researchers have compared blocked practice with an alternative strategy called interleaved practice. Instead of grouping exercises by topic—such as solving AAAA, then BBBB, then CCCC—interleaving mixes related problem types together in a single study session, such as ABC, CAB, BCA. This approach is used not only in mathematics, but also in learning musical scales, identifying historical art styles, and practising tennis strokes.',
      'In a landmark middle-school study, psychologists divided students into two groups over a three-month geometry unit. Both groups attended the same classroom lessons and completed the exact same homework questions, but one group practised with blocked worksheets while the other used interleaved worksheets. During daily homework, the blocked group scored higher and felt more confident. Yet when both groups took an unannounced test one month later, the interleaved group scored seventy-seven percent, compared with just thirty-eight percent for the blocked group.',
      'Why does mixing problem types double long-term test scores? Cognitive scientists point out that blocked practice lets the brain run on autopilot; students simply repeat the procedure from the previous question. On a real comprehensive exam, however, questions do not come with chapter headings telling you which formula to use. Interleaved practice forces the learner to inspect each new problem, compare it with other types, and choose the right strategy from scratch.',
      'Because this constant switching requires more mental effort, learners often underestimate how much they are learning during an interleaved session. Teachers refer to this productive struggle as a "desirable difficulty." Although progress feels slightly slower during homework, the brain builds flexible retrieval pathways that remain strong weeks and months later. Researchers have observed the exact same benefit in music conservatories, language classrooms, and sports training. When violin students alternate between three different musical scales every ten minutes instead of repeating a single scale for an hour, their fingers learn to reset posture and rhythm far more accurately. Likewise, language learners who mix past, present, and future verb tenses in one conversation exercise make fewer mistakes in real-life speaking than students who drill only one tense per week. To adopt interleaved practice at home, educational psychologists advise students to pull three or four flashcards from earlier chapters into every new study session. Embracing this extra mental challenge turns passive repetition into active problem-solving and prepares learners for unfamiliar questions. Medical schools now use the same method when training student doctors to read heart rhythms and X-rays, mixing different patient cases together rather than showing twenty identical examples in a row. Although students make a few more mistakes during early practice sessions, they become much better at spotting subtle differences under real hospital pressure. Mixing related skills builds durable understanding that lasts long after the final exam.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'b1-exp-edu-1',
        word: 'formula',
        partOfSpeech: 'noun',
        simpleDefinition: 'A mathematical rule written with symbols that shows how to calculate something.',
        contextMeaning: 'The specific math rule used to find the volume of a shape like a cone.',
        originalSentence: 'In a geometry workbook, for example, Chapter Four might teach how to calculate the volume of a cone, followed immediately by twenty practice problems that all use the exact same cone formula.',
        exampleSentence: 'Students used a simple formula to find the area of the triangle.',
        synonyms: ['equation', 'rule'],
        arabicTranslation: 'معادلة / صيغة رياضية'
      },
      {
        id: 'b1-exp-edu-2',
        word: 'interleaved',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Arranged by alternating or mixing different types of items together instead of keeping them in separate blocks.',
        contextMeaning: 'Practising several different problem types mixed together in one session.',
        originalSentence: 'Over the past twenty years, however, educational researchers have compared blocked practice with an alternative strategy called interleaved practice.',
        exampleSentence: 'An interleaved study plan mixes vocabulary, grammar, and reading exercises.',
        synonyms: ['mixed', 'alternated'],
        arabicTranslation: 'متداخل / متنوع الترتيب'
      },
      {
        id: 'b1-exp-edu-3',
        word: 'landmark',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Very important and influential in the history of a field of study.',
        contextMeaning: 'A major, well-known school experiment that proved the value of mixed practice.',
        originalSentence: 'In a landmark middle-school study, psychologists divided students into two groups over a three-month geometry unit.',
        exampleSentence: 'The scientist published a landmark paper on clean solar energy.',
        synonyms: ['groundbreaking', 'major', 'historic'],
        arabicTranslation: 'محوري / بارز الأهمية'
      },
      {
        id: 'b1-exp-edu-4',
        word: 'unannounced',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Happening without advance warning so people cannot cram the night before.',
        contextMeaning: 'Given as a surprise test one month later to measure true long-term memory.',
        originalSentence: 'Yet when both groups took an unannounced test one month later, the interleaved group scored seventy-seven percent, compared with just thirty-eight percent for the blocked group.',
        exampleSentence: 'The fire department held an unannounced safety drill at the school.',
        synonyms: ['surprise', 'unexpected'],
        arabicTranslation: 'مفاجئ / غير معلن مسبقاً'
      },
      {
        id: 'b1-exp-edu-5',
        word: 'autopilot',
        partOfSpeech: 'noun',
        simpleDefinition: 'Doing something automatically by habit without thinking carefully about it.',
        contextMeaning: 'Repeating the same math step mechanically without thinking about why it works.',
        originalSentence: 'Cognitive scientists point out that blocked practice lets the brain run on autopilot; students simply repeat the procedure from the previous question.',
        exampleSentence: 'After walking the same route for years, he could walk to work on autopilot.',
        synonyms: ['automatic habit'],
        arabicTranslation: 'تكرار آلي بلا تفكير'
      },
      {
        id: 'b1-exp-edu-6',
        word: 'comprehensive',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Covering many different topics or chapters all together.',
        contextMeaning: 'An exam that tests all chapters mixed together rather than just one single lesson.',
        originalSentence: 'On a real comprehensive exam, however, questions do not come with chapter headings telling you which formula to use.',
        exampleSentence: 'The final exam is comprehensive and covers the whole semester.',
        synonyms: ['complete', 'all-inclusive'],
        arabicTranslation: 'شامل'
      },
      {
        id: 'b1-exp-edu-7',
        word: 'underestimate',
        partOfSpeech: 'verb',
        simpleDefinition: 'To think something is smaller, weaker, or less effective than it really is.',
        contextMeaning: 'To mistakenly feel that mixed practice is not working well because it feels harder.',
        originalSentence: 'Because this constant switching requires more mental effort, learners often underestimate how much they are learning during an interleaved session.',
        exampleSentence: 'Do not underestimate how long it takes to climb the mountain.',
        synonyms: ['underrate', 'misjudge'],
        arabicTranslation: 'يقلل من تقدير'
      },
      {
        id: 'b1-exp-edu-8',
        word: 'retrieval',
        partOfSpeech: 'noun',
        simpleDefinition: 'The act of finding and bringing stored information back out of your memory.',
        contextMeaning: 'Recalling the right formula and strategy from memory during a test.',
        originalSentence: 'Although progress feels slightly slower during homework, the brain builds flexible retrieval pathways that remain strong weeks and months later.',
        exampleSentence: 'Quizzing yourself strengthens memory retrieval before an exam.',
        synonyms: ['recall', 'memory access'],
        arabicTranslation: 'استرجاع المعلومات من الذاكرة'
      }
    ],
    questions: [
      {
        id: 'b1-exp-edu-q1',
        type: 'true_false_not_given',
        prompt: 'In blocked practice, students solve many problems of the exact same type in a row before moving to the next topic.',
        correctAnswer: 'True',
        explanation: 'Paragraph 1 explains that in blocked practice, a chapter teaches one concept (like a cone) followed immediately by twenty practice problems using that exact same formula.',
        passageEvidence: 'In a geometry workbook, for example, Chapter Four might teach how to calculate the volume of a cone, followed immediately by twenty practice problems that all use the exact same cone formula.'
      },
      {
        id: 'b1-exp-edu-q2',
        type: 'true_false_not_given',
        prompt: 'On the unannounced test one month later, the blocked-practice group scored much higher than the interleaved group.',
        correctAnswer: 'False',
        explanation: 'Paragraph 3 states that one month later, the interleaved group scored 77%, compared with just 38% for the blocked group.',
        passageEvidence: 'Yet when both groups took an unannounced test one month later, the interleaved group scored seventy-seven percent, compared with just thirty-eight percent for the blocked group.'
      },
      {
        id: 'b1-exp-edu-q3',
        type: 'true_false_not_given',
        prompt: 'The middle-school geometry study took place at a school in Florida.',
        correctAnswer: 'Not Given',
        explanation: 'Paragraph 3 describes the landmark middle-school geometry study, but it never mentions Florida or the city/state where the school was located.',
        passageEvidence: 'In a landmark middle-school study, psychologists divided students into two groups over a three-month geometry unit.'
      },
      {
        id: 'b1-exp-edu-q4',
        type: 'yes_no_not_given',
        prompt: 'The author claims that interleaved practice is only effective for mathematics and cannot be used in music or sports.',
        correctAnswer: 'No',
        explanation: 'Paragraph 2 explicitly states that this approach is used not only in mathematics, but also in learning musical scales, identifying historical art styles, and practising tennis strokes.',
        passageEvidence: 'This approach is used not only in mathematics, but also in learning musical scales, identifying historical art styles, and practising tennis strokes.'
      },
      {
        id: 'b1-exp-edu-q5',
        type: 'multiple_choice',
        prompt: 'Why does interleaved practice prepare students better for a real comprehensive exam?',
        options: [
          'It trains learners to inspect each problem and choose the right strategy without relying on chapter headings',
          'It allows students to skip half of the homework questions in the textbook',
          'It guarantees that every question on the exam will use the exact same cone formula',
          'It lets the brain run on autopilot without reading the question carefully'
        ],
        correctAnswer: 'It trains learners to inspect each problem and choose the right strategy without relying on chapter headings',
        explanation: 'Paragraph 4 explains that on a real exam, questions do not come with chapter headings, and interleaved practice forces learners to inspect each problem and choose the right strategy from scratch.',
        passageEvidence: 'Interleaved practice forces the learner to inspect each new problem, compare it with other types, and choose the right strategy from scratch.'
      },
      {
        id: 'b1-exp-edu-q6',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with TWO WORDS from Paragraph 5: Teachers refer to the productive mental struggle of mixed practice as a ______.',
        correctAnswer: 'desirable difficulty',
        acceptedAnswers: ['desirable difficulty'],
        explanation: 'Paragraph 5 states: "Teachers refer to this productive struggle as a \'desirable difficulty.\'"',
        passageEvidence: 'Teachers refer to this productive struggle as a "desirable difficulty."'
      },
      {
        id: 'b1-exp-edu-q7',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 4, what does the phrase "run on autopilot" mean?',
        options: [
          'Repeat a procedure mechanically without thinking carefully',
          'Fly an airplane across the ocean during a storm',
          'Check every answer twice using a calculator',
          'Ask a classmate for help on a difficult homework page'
        ],
        correctAnswer: 'Repeat a procedure mechanically without thinking carefully',
        explanation: 'Paragraph 4 explains "run on autopilot; students simply repeat the procedure from the previous question."',
        passageEvidence: 'Cognitive scientists point out that blocked practice lets the brain run on autopilot; students simply repeat the procedure from the previous question.'
      },
      {
        id: 'b1-exp-edu-q8',
        type: 'short_answer',
        prompt: 'Answer with TWO WORDS from Paragraph 3: What was the average score of the interleaved group on the test one month later?',
        correctAnswer: 'seventy-seven percent',
        acceptedAnswers: ['seventy-seven percent', '77 percent', '77%'],
        explanation: 'Paragraph 3 states that the interleaved group scored seventy-seven percent.',
        passageEvidence: 'Yet when both groups took an unannounced test one month later, the interleaved group scored seventy-seven percent, compared with just thirty-eight percent for the blocked group.'
      },
      {
        id: 'b1-exp-edu-q9',
        type: 'matching_information',
        prompt: 'Which paragraph explains why learners often feel less confident during interleaved homework even though they are learning more?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4', 'Paragraph 5'],
        correctAnswer: 'Paragraph 5',
        explanation: 'Paragraph 5 explains that because constant switching requires more mental effort, learners often underestimate how much they are learning during an interleaved session.',
        passageEvidence: 'Because this constant switching requires more mental effort, learners often underestimate how much they are learning during an interleaved session.'
      },
      {
        id: 'b1-exp-edu-q10',
        type: 'summary_completion',
        prompt: 'Complete the summary with ONE WORD from Paragraph 5: Interleaved practice helps the brain build flexible ______ pathways that stay strong for months.',
        correctAnswer: 'retrieval',
        acceptedAnswers: ['retrieval'],
        explanation: 'Paragraph 5 states that the brain builds flexible retrieval pathways that remain strong weeks and months later.',
        passageEvidence: 'Although progress feels slightly slower during homework, the brain builds flexible retrieval pathways that remain strong weeks and months later.'
      }
    ]
  },
  {
    id: 'b1-bio-urban-fox-adaptation',
    title: 'How Red Foxes Are Adapting Their Bodies and Habits to City Life',
    level: 'B1',
    topic: 'Biology and animal behaviour',
    status: 'published',
    estimatedMinutes: 9,
    generationBatch: 'batch-expansion-b1',
    imageStatus: 'ready',
    introduction: 'Explore how red foxes living in European cities are developing shorter snouts, calmer behaviour, and new nocturnal schedules compared with rural foxes.',
    illustrationAlt: 'Photograph of a wild red fox standing alert in an urban park at dusk',
    passage: [
      'Evolution is often described as a slow process that takes millions of years in remote wilderness areas. However, evolutionary biologists studying modern cities have discovered that urban wildlife is changing before our eyes. One of the clearest examples is the red fox, which has established thriving populations in cities such as London, Glasgow, and Zurich over the past eighty years.',
      'In the countryside, red foxes hunt fast-moving prey such as field mice, rabbits, and ground birds across wide territories. In a city, by contrast, a fox’s diet comes largely from human leftovers—such as discarded takeaway meals, compost bins, and pet food left on back porches—alongside earthworms and rats in neighbourhood parks. Because food is concentrated in residential streets, an urban fox needs a territory only a fraction of the size of a rural fox’s range.',
      'Recently, researchers at the University of Glasgow and National Museums Scotland measured more than one thousand fox skulls collected from both urban and rural habitats around London. They found striking physical differences that have emerged in just a few decades. Urban foxes have noticeably shorter, wider snouts and smaller braincases than their country cousins, and the skull differences between males and females are much smaller in cities.',
      'Biologists explain that these skeletal changes match the demands of city feeding. A rural fox needs a long, narrow snout that snaps shut quickly to catch a fleeing mouse. An urban fox, however, spends more time standing stationary at a rubbish bag or compost heap, where a shorter, wider snout generates a stronger bite force to chew through tough packaging or bones. Interestingly, shorter snouts and reduced male-female differences are also classic traits of "self-domestication," seen when wild animals evolve to become calmer and less fearful around humans.',
      'Behavioural tracking confirms that city foxes have also adjusted their daily clocks. Using GPS collars, ecologists found that urban foxes rest quietly in railway embankments or garden sheds during rush hour and become active late at night when streets are empty. When crossing multi-lane roads, experienced city foxes even pause at the kerb and wait for gaps in traffic, proving how rapidly mammals can adapt to human landscapes. In addition, field experiments using puzzle boxes placed in suburban back gardens show that city foxes are significantly bolder and quicker at lifting latches or sliding lids than their shy country cousins. Living alongside human structures has rewarded curiosity and problem-solving over fear. Evolutionary biologists emphasize that these changes are unfolding over just a few dozen generations rather than millions of years. By studying urban foxes alongside city songbirds and park squirrels, scientists can watch natural selection in real time and design greener urban wildlife corridors that reduce road accidents while keeping cities and wild animals in healthy balance. Wildlife charities in British and Swiss cities also work with residents to make sure urban foxes do not become too dependent on hand-fed snacks. By securing household food bins and leaving quiet wild corners at the back of parks, neighbourhoods allow foxes to hunt natural prey such as beetles, mice, and earthworms. Observing how quickly red foxes adjust their bones, diets, and nightly routines gives urban citizens a front-row view of evolution in action.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'b1-exp-bio-1',
        word: 'thriving',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Growing strong, healthy, and successful in a particular environment.',
        contextMeaning: 'Living and reproducing very successfully inside busy cities.',
        originalSentence: 'One of the clearest examples is the red fox, which has established thriving populations in cities such as London, Glasgow, and Zurich over the past eighty years.',
        exampleSentence: 'The restored wetland now supports a thriving population of waterbirds.',
        synonyms: ['flourishing', 'prospering', 'successful'],
        arabicTranslation: 'مزدهر'
      },
      {
        id: 'b1-exp-bio-2',
        word: 'territories',
        partOfSpeech: 'noun',
        simpleDefinition: 'Areas of land that an animal or group of animals lives in and defends as its own.',
        contextMeaning: 'The hunting and living areas used by fox families.',
        originalSentence: 'In the countryside, red foxes hunt fast-moving prey such as field mice, rabbits, and ground birds across wide territories.',
        exampleSentence: 'Wolves travel many kilometres each day to patrol their territories.',
        synonyms: ['ranges', 'habitats'],
        arabicTranslation: 'مناطق نفوذ الحيوان'
      },
      {
        id: 'b1-exp-bio-3',
        word: 'discarded',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Thrown away because someone no longer wants or needs it.',
        contextMeaning: 'Leftover human food thrown into street bins or dropped on pavements.',
        originalSentence: 'In a city, by contrast, a fox’s diet comes largely from human leftovers—such as discarded takeaway meals, compost bins, and pet food left on back porches—alongside earthworms and rats in neighbourhood parks.',
        exampleSentence: 'Seagulls gathered around a discarded sandwich on the beach.',
        synonyms: ['thrown-away', 'abandoned'],
        arabicTranslation: 'مُلقى / متروك'
      },
      {
        id: 'b1-exp-bio-4',
        word: 'snouts',
        partOfSpeech: 'noun',
        simpleDefinition: 'The projecting noses and jaws of animals such as foxes, dogs, or pigs.',
        contextMeaning: 'The front jaw and nose bones of foxes, which have become shorter and wider in cities.',
        originalSentence: 'Urban foxes have noticeably shorter, wider snouts and smaller braincases than their country cousins, and the skull differences between males and females are much smaller in cities.',
        exampleSentence: 'Hedgehogs use their sensitive snouts to sniff for beetles in the grass.',
        synonyms: ['muzzles', 'jaws'],
        arabicTranslation: 'خطوم (أنوف وفكوك الحيوانات)'
      },
      {
        id: 'b1-exp-bio-5',
        word: 'fleeing',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Running away quickly to escape danger.',
        contextMeaning: 'Trying to run away from a hunting rural fox.',
        originalSentence: 'A rural fox needs a long, narrow snout that snaps shut quickly to catch a fleeing mouse.',
        exampleSentence: 'The fleeing rabbit disappeared into its underground burrow.',
        synonyms: ['escaping', 'running'],
        arabicTranslation: 'هارب'
      },
      {
        id: 'b1-exp-bio-6',
        word: 'stationary',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Standing still in one place and not moving.',
        contextMeaning: 'Standing in one spot beside a bin or compost pile rather than chasing fast prey.',
        originalSentence: 'An urban fox, however, spends more time standing stationary at a rubbish bag or compost heap, where a shorter, wider snout generates a stronger bite force to chew through tough packaging or bones.',
        exampleSentence: 'Wait until the train is completely stationary before opening the door.',
        synonyms: ['still', 'motionless'],
        arabicTranslation: 'ثابت في مكانه'
      },
      {
        id: 'b1-exp-bio-7',
        word: 'traits',
        partOfSpeech: 'noun',
        simpleDefinition: 'Distinguishing physical features or behaviour qualities passed down in living things.',
        contextMeaning: 'Physical characteristics such as shorter jaws and calmer behaviour.',
        originalSentence: 'Interestingly, shorter snouts and reduced male-female differences are also classic traits of "self-domestication," seen when wild animals evolve to become calmer and less fearful around humans.',
        exampleSentence: 'Thick white fur is one of the key traits of Arctic foxes.',
        synonyms: ['features', 'characteristics'],
        arabicTranslation: 'سمات / صفات'
      },
      {
        id: 'b1-exp-bio-8',
        word: 'embankments',
        partOfSpeech: 'noun',
        simpleDefinition: 'Sloping banks of earth or stone built beside railway tracks or rivers.',
        contextMeaning: 'Quiet, plant-covered slopes beside city train tracks where urban foxes sleep during the day.',
        originalSentence: 'Using GPS collars, ecologists found that urban foxes rest quietly in railway embankments or garden sheds during rush hour and become active late at night when streets are empty.',
        exampleSentence: 'Wildflowers and bushes grew along the steep railway embankments.',
        synonyms: ['earth banks', 'slopes'],
        arabicTranslation: 'ضفاف أو منحدرات ترابية بجانب السكك الحديدية'
      }
    ],
    questions: [
      {
        id: 'b1-exp-bio-q1',
        type: 'true_false_not_given',
        prompt: 'An urban fox requires a much larger territory than a rural fox in the countryside.',
        correctAnswer: 'False',
        explanation: 'Paragraph 2 states that because food is concentrated in residential streets, an urban fox needs a territory only a fraction of the size of a rural fox’s range.',
        passageEvidence: 'Because food is concentrated in residential streets, an urban fox needs a territory only a fraction of the size of a rural fox’s range.'
      },
      {
        id: 'b1-exp-bio-q2',
        type: 'true_false_not_given',
        prompt: 'Researchers measured more than one thousand fox skulls from urban and rural areas around London.',
        correctAnswer: 'True',
        explanation: 'Paragraph 3 states that researchers measured more than one thousand fox skulls collected from both urban and rural habitats around London.',
        passageEvidence: 'Recently, researchers at the University of Glasgow and National Museums Scotland measured more than one thousand fox skulls collected from both urban and rural habitats around London.'
      },
      {
        id: 'b1-exp-bio-q3',
        type: 'true_false_not_given',
        prompt: 'City foxes in Zurich have longer tails than city foxes in London.',
        correctAnswer: 'Not Given',
        explanation: 'The passage mentions London, Glasgow, and Zurich, and discusses skull and snout shapes, but it never mentions tail length.',
        passageEvidence: 'One of the clearest examples is the red fox, which has established thriving populations in cities such as London, Glasgow, and Zurich over the past eighty years.'
      },
      {
        id: 'b1-exp-bio-q4',
        type: 'yes_no_not_given',
        prompt: 'The author believes that evolutionary changes in wild animals can only happen over millions of years in remote wilderness areas.',
        correctAnswer: 'No',
        explanation: 'In Paragraph 1, the author states that while evolution is often described that way, urban wildlife is changing before our eyes in just a few decades.',
        passageEvidence: 'However, evolutionary biologists studying modern cities have discovered that urban wildlife is changing before our eyes.'
      },
      {
        id: 'b1-exp-bio-q5',
        type: 'multiple_choice',
        prompt: 'Why is a shorter, wider snout useful for a fox living in a city?',
        options: [
          'It produces a stronger bite force for chewing through tough food packaging and bones at stationary food sources',
          'It helps the fox swim underwater across deep city rivers',
          'It allows the fox to bark like a pet dog when people walk by',
          'It makes the fox completely invisible to street cameras at night'
        ],
        correctAnswer: 'It produces a stronger bite force for chewing through tough food packaging and bones at stationary food sources',
        explanation: 'Paragraph 4 explains that an urban fox spends more time standing stationary at a rubbish bag or compost heap, where a shorter, wider snout generates a stronger bite force to chew through tough packaging or bones.',
        passageEvidence: 'An urban fox, however, spends more time standing stationary at a rubbish bag or compost heap, where a shorter, wider snout generates a stronger bite force to chew through tough packaging or bones.'
      },
      {
        id: 'b1-exp-bio-q6',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 4: Shorter snouts and reduced male-female differences are classic traits of "self-______."',
        correctAnswer: 'domestication',
        acceptedAnswers: ['domestication', 'self-domestication'],
        explanation: 'Paragraph 4 refers to these features as classic traits of "self-domestication."',
        passageEvidence: 'Interestingly, shorter snouts and reduced male-female differences are also classic traits of "self-domestication," seen when wild animals evolve to become calmer and less fearful around humans.'
      },
      {
        id: 'b1-exp-bio-q7',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 4, the word "stationary" is closest in meaning to:',
        options: [
          'Standing still in one place',
          'Running at top speed across a field',
          'Climbing up a tall brick wall',
          'Digging a deep hole under a tree'
        ],
        correctAnswer: 'Standing still in one place',
        explanation: '"Standing stationary at a rubbish bag" means staying still in one spot rather than chasing fast-moving prey.',
        passageEvidence: 'An urban fox, however, spends more time standing stationary at a rubbish bag or compost heap, where a shorter, wider snout generates a stronger bite force to chew through tough packaging or bones.'
      },
      {
        id: 'b1-exp-bio-q8',
        type: 'short_answer',
        prompt: 'Answer with TWO WORDS from Paragraph 5: What equipment did ecologists fit onto urban foxes to track their daily movements?',
        correctAnswer: 'GPS collars',
        acceptedAnswers: ['GPS collars', 'collars'],
        explanation: 'Paragraph 5 states "Using GPS collars, ecologists found that urban foxes rest quietly..."',
        passageEvidence: 'Using GPS collars, ecologists found that urban foxes rest quietly in railway embankments or garden sheds during rush hour and become active late at night when streets are empty.'
      },
      {
        id: 'b1-exp-bio-q9',
        type: 'matching_information',
        prompt: 'Which paragraph compares the typical diet of a countryside fox with that of a city fox?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4', 'Paragraph 5'],
        correctAnswer: 'Paragraph 2',
        explanation: 'Paragraph 2 compares rural foxes hunting field mice and rabbits with city foxes eating human leftovers, compost, and pet food.',
        passageEvidence: 'In the countryside, red foxes hunt fast-moving prey such as field mice, rabbits, and ground birds across wide territories. In a city, by contrast, a fox’s diet comes largely from human leftovers—such as discarded takeaway meals, compost bins, and pet food left on back porches—alongside earthworms and rats in neighbourhood parks.'
      },
      {
        id: 'b1-exp-bio-q10',
        type: 'summary_completion',
        prompt: 'Complete the summary with ONE WORD from Paragraph 5: During daytime rush hour, urban foxes rest quietly in railway embankments or garden ______.',
        correctAnswer: 'sheds',
        acceptedAnswers: ['sheds'],
        explanation: 'Paragraph 5 states that urban foxes rest quietly in railway embankments or garden sheds during rush hour.',
        passageEvidence: 'Using GPS collars, ecologists found that urban foxes rest quietly in railway embankments or garden sheds during rush hour and become active late at night when streets are empty.'
      }
    ]
  },
  {
    id: 'b1-hea-indoor-air-ventilation',
    title: 'How Carbon Dioxide Monitors and Fresh Air Improve Classroom Alertness',
    level: 'B1',
    topic: 'Public health',
    status: 'published',
    estimatedMinutes: 9,
    generationBatch: 'batch-expansion-b1',
    imageStatus: 'ready',
    introduction: 'See why stuffy classrooms make students feel drowsy after lunch and how simple air sensors help schools maintain clear thinking.',
    illustrationAlt: 'Photograph of a bright school classroom with tall open windows for natural ventilation',
    passage: [
      'Every teacher knows the familiar afternoon slump: thirty minutes into a lesson after lunch, students begin yawning, resting their heads on their desks, and struggling to concentrate. For generations, educators blamed this drowsiness on a heavy midday meal or a boring topic. However, environmental health researchers have identified a hidden physical culprit inside many school buildings and offices: rising levels of indoor carbon dioxide.',
      'Outdoor air normally contains about 420 parts per million (ppm) of carbon dioxide. Whenever thirty students and a teacher sit inside a classroom with the windows and doors shut—especially during cold winter weather or noisy street traffic—everyone exhales carbon dioxide with every breath. Without steady ventilation to bring in outdoor air, carbon dioxide levels inside a busy classroom can easily climb past 2,000 or even 3,000 ppm within a single forty-five-minute period.',
      'At these indoor concentrations, carbon dioxide is not poisonous, and it causes no permanent harm to the lungs. Nevertheless, controlled studies at Harvard University and European public health institutes show that elevated carbon dioxide directly slows down human thinking. In double-blind experiments where office workers and students completed problem-solving tests at 600 ppm, 1,000 ppm, and 2,500 ppm, participants in the high-carbon-dioxide rooms scored up to fifty percent lower on complex decision-making and reading speed.',
      'To make invisible air quality easy to see, thousands of schools now place small digital carbon dioxide monitors on classroom walls. These sensors use traffic-light colours: green below 800 ppm, amber between 800 and 1,200 ppm, and red above 1,200 ppm. When the display turns amber, the teacher does not need to leave the windows wide open all winter. Instead, opening high top-hinged windows on opposite sides of the room for just five minutes creates a gentle cross-breeze that flushes out stale air without chilling the desks.',
      'Modern school renovations also install quiet mechanical heat-recovery ventilators. These ceiling units pull fresh outdoor air into the classroom while transferring warmth from the outgoing indoor air, keeping students both warm and mentally sharp throughout the school day. Inside the ventilator core, incoming cold winter air and outgoing warm room air pass through thin aluminium plates without ever mixing together. This clever heat exchange captures up to eighty percent of the building’s indoor warmth, so school heating bills do not rise even in freezing January weather. At the same time, fine pleated air filters inside the unit trap outdoor traffic soot and spring tree pollen before the fresh air enters the classroom. Public health studies across Europe and North America have found that schools equipped with continuous ventilation and carbon dioxide monitors also record fewer winter absences from seasonal colds and flu. Investing in clean classroom air is one of the most cost-effective ways to support both student health and academic achievement. Architects designing new community libraries and university lecture halls now treat fresh air with the same importance as good lighting and comfortable seating. Simple habits—such as airing out classrooms between lessons and keeping wall vents clear of books or posters—cost almost nothing yet bring immediate improvements in alertness. When students breathe clean, well-ventilated air all afternoon, they stay focused, finish their classwork with less fatigue, and enjoy a healthier learning environment.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'b1-exp-hea-1',
        word: 'drowsiness',
        partOfSpeech: 'noun',
        simpleDefinition: 'A feeling of being very sleepy and unable to stay fully awake.',
        contextMeaning: 'The sleepy, tired feeling students experience in a stuffy afternoon classroom.',
        originalSentence: 'For generations, educators blamed this drowsiness on a heavy midday meal or a boring topic.',
        exampleSentence: 'Warm, stuffy rooms often cause drowsiness during long meetings.',
        synonyms: ['sleepiness', 'lethargy'],
        arabicTranslation: 'نعاس / خمول'
      },
      {
        id: 'b1-exp-hea-2',
        word: 'culprit',
        partOfSpeech: 'noun',
        simpleDefinition: 'The real cause of a problem or bad situation.',
        contextMeaning: 'The hidden cause of afternoon tiredness—built-up carbon dioxide.',
        originalSentence: 'However, environmental health researchers have identified a hidden physical culprit inside many school buildings and offices: rising levels of indoor carbon dioxide.',
        exampleSentence: 'A loose wire turned out to be the culprit behind the broken lamp.',
        synonyms: ['cause', 'source'],
        arabicTranslation: 'السبب الحقيقي للمشكلة'
      },
      {
        id: 'b1-exp-hea-3',
        word: 'exhales',
        partOfSpeech: 'verb',
        simpleDefinition: 'Breathes air out from the lungs.',
        contextMeaning: 'Breathes out carbon dioxide gas into the closed classroom.',
        originalSentence: 'Whenever thirty students and a teacher sit inside a classroom with the windows and doors shut—especially during cold winter weather or noisy street traffic—everyone exhales carbon dioxide with every breath.',
        exampleSentence: 'A swimmer inhales above the water and exhales slowly underwater.',
        synonyms: ['breathes out'],
        arabicTranslation: 'يزفر (يُخرج الهواء من الرئتين)'
      },
      {
        id: 'b1-exp-hea-4',
        word: 'ventilation',
        partOfSpeech: 'noun',
        simpleDefinition: 'The movement of fresh outdoor air into a room to replace stale indoor air.',
        contextMeaning: 'Bringing clean outdoor air into a classroom through windows or air vents.',
        originalSentence: 'Without steady ventilation to bring in outdoor air, carbon dioxide levels inside a busy classroom can easily climb past 2,000 or even 3,000 ppm within a single forty-five-minute period.',
        exampleSentence: 'Good kitchen ventilation removes cooking steam and smoke.',
        synonyms: ['air circulation', 'airflow'],
        arabicTranslation: 'تهوية'
      },
      {
        id: 'b1-exp-hea-5',
        word: 'concentrations',
        partOfSpeech: 'noun',
        simpleDefinition: 'The amounts of a substance mixed into a given volume of air or liquid.',
        contextMeaning: 'Levels of carbon dioxide gas measured in the classroom air.',
        originalSentence: 'At these indoor concentrations, carbon dioxide is not poisonous, and it causes no permanent harm to the lungs.',
        exampleSentence: 'Scientists measured salt concentrations in the coastal lagoon.',
        synonyms: ['levels', 'amounts'],
        arabicTranslation: 'تركيزات'
      },
      {
        id: 'b1-exp-hea-6',
        word: 'elevated',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Higher than the normal or healthy level.',
        contextMeaning: 'Higher than normal outdoor or fresh-air carbon dioxide levels.',
        originalSentence: 'Nevertheless, controlled studies at Harvard University and European public health institutes show that elevated carbon dioxide directly slows down human thinking.',
        exampleSentence: 'Doctors checked the patient because he had an elevated heart rate.',
        synonyms: ['increased', 'high', 'raised'],
        arabicTranslation: 'مرتفع عن المعتاد'
      },
      {
        id: 'b1-exp-hea-7',
        word: 'flushes',
        partOfSpeech: 'verb',
        simpleDefinition: 'Clears something out quickly using a strong flow of air or water.',
        contextMeaning: 'Pushes warm, stale indoor air out of the classroom in a few minutes.',
        originalSentence: 'Instead, opening high top-hinged windows on opposite sides of the room for just five minutes creates a gentle cross-breeze that flushes out stale air without chilling the desks.',
        exampleSentence: 'Heavy rain flushes fallen leaves out of the roof gutters.',
        synonyms: ['clears out', 'purges', 'sweeps out'],
        arabicTranslation: 'يطرد / ينظف بتدفق سريع'
      },
      {
        id: 'b1-exp-hea-8',
        word: 'renovations',
        partOfSpeech: 'noun',
        simpleDefinition: 'Repairs and improvements made to an older building to modernize it.',
        contextMeaning: 'Upgrades to older school buildings that add modern ventilation systems.',
        originalSentence: 'Modern school renovations also install quiet mechanical heat-recovery ventilators.',
        exampleSentence: 'The library closed for two weeks during summer renovations.',
        synonyms: ['upgrades', 'refurbishments'],
        arabicTranslation: 'تجديدات المباني'
      }
    ],
    questions: [
      {
        id: 'b1-exp-hea-q1',
        type: 'true_false_not_given',
        prompt: 'Outdoor air normally contains about 420 parts per million of carbon dioxide.',
        correctAnswer: 'True',
        explanation: 'Paragraph 2 states that outdoor air normally contains about 420 parts per million (ppm) of carbon dioxide.',
        passageEvidence: 'Outdoor air normally contains about 420 parts per million (ppm) of carbon dioxide.'
      },
      {
        id: 'b1-exp-hea-q2',
        type: 'true_false_not_given',
        prompt: 'Classroom carbon dioxide levels around 2,000 ppm cause permanent damage to human lungs.',
        correctAnswer: 'False',
        explanation: 'Paragraph 3 states that at these indoor concentrations, carbon dioxide is not poisonous, and it causes no permanent harm to the lungs.',
        passageEvidence: 'At these indoor concentrations, carbon dioxide is not poisonous, and it causes no permanent harm to the lungs.'
      },
      {
        id: 'b1-exp-hea-q3',
        type: 'true_false_not_given',
        prompt: 'Digital carbon dioxide monitors run on solar batteries mounted on classroom windows.',
        correctAnswer: 'Not Given',
        explanation: 'Paragraph 4 describes digital carbon dioxide monitors on classroom walls and their traffic-light colours, but it never mentions how they are powered.',
        passageEvidence: 'To make invisible air quality easy to see, thousands of schools now place small digital carbon dioxide monitors on classroom walls.'
      },
      {
        id: 'b1-exp-hea-q4',
        type: 'yes_no_not_given',
        prompt: 'The author agrees that a heavy midday meal is the only reason students feel sleepy in afternoon classes.',
        correctAnswer: 'No',
        explanation: 'In Paragraph 1, the author notes that while educators long blamed midday meals, researchers have identified rising indoor carbon dioxide as a major physical culprit.',
        passageEvidence: 'However, environmental health researchers have identified a hidden physical culprit inside many school buildings and offices: rising levels of indoor carbon dioxide.'
      },
      {
        id: 'b1-exp-hea-q5',
        type: 'multiple_choice',
        prompt: 'What did double-blind experiments at Harvard University and European institutes reveal about rooms with 2,500 ppm of carbon dioxide?',
        options: [
          'Participants scored up to fifty percent lower on complex decision-making and reading speed',
          'Students finished their reading tests twice as fast as in fresh air',
          'Participants could not see the traffic-light colours on the wall monitor',
          'The room temperature dropped by ten degrees within forty-five minutes'
        ],
        correctAnswer: 'Participants scored up to fifty percent lower on complex decision-making and reading speed',
        explanation: 'Paragraph 3 states that participants in the high-carbon-dioxide rooms scored up to fifty percent lower on complex decision-making and reading speed.',
        passageEvidence: 'In double-blind experiments where office workers and students completed problem-solving tests at 600 ppm, 1,000 ppm, and 2,500 ppm, participants in the high-carbon-dioxide rooms scored up to fifty percent lower on complex decision-making and reading speed.'
      },
      {
        id: 'b1-exp-hea-q6',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 4: Wall sensors use traffic-light colours: green below 800 ppm, ______ between 800 and 1,200 ppm, and red above 1,200 ppm.',
        correctAnswer: 'amber',
        acceptedAnswers: ['amber'],
        explanation: 'Paragraph 4 lists the three colours: green, amber, and red.',
        passageEvidence: 'These sensors use traffic-light colours: green below 800 ppm, amber between 800 and 1,200 ppm, and red above 1,200 ppm.'
      },
      {
        id: 'b1-exp-hea-q7',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 1, the word "culprit" is closest in meaning to:',
        options: [
          'The real cause of a problem',
          'A student who arrives late to class',
          'A window at the top of a wall',
          'A healthy lunch served at school'
        ],
        correctAnswer: 'The real cause of a problem',
        explanation: '"A hidden physical culprit" means the hidden cause behind afternoon drowsiness.',
        passageEvidence: 'However, environmental health researchers have identified a hidden physical culprit inside many school buildings and offices: rising levels of indoor carbon dioxide.'
      },
      {
        id: 'b1-exp-hea-q8',
        type: 'short_answer',
        prompt: 'Answer with TWO WORDS from Paragraph 4: How long does a teacher need to open opposite top-hinged windows to flush out stale air in winter?',
        correctAnswer: 'five minutes',
        acceptedAnswers: ['five minutes', '5 minutes', 'just five minutes'],
        explanation: 'Paragraph 4 states that opening high top-hinged windows on opposite sides of the room for just five minutes creates a gentle cross-breeze.',
        passageEvidence: 'Instead, opening high top-hinged windows on opposite sides of the room for just five minutes creates a gentle cross-breeze that flushes out stale air without chilling the desks.'
      },
      {
        id: 'b1-exp-hea-q9',
        type: 'matching_information',
        prompt: 'Which paragraph explains how mechanical ceiling units keep classrooms warm while bringing in fresh outdoor air?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4', 'Paragraph 5'],
        correctAnswer: 'Paragraph 5',
        explanation: 'Paragraph 5 describes mechanical heat-recovery ventilators that transfer warmth from outgoing indoor air to incoming fresh outdoor air.',
        passageEvidence: 'These ceiling units pull fresh outdoor air into the classroom while transferring warmth from the outgoing indoor air, keeping students both warm and mentally sharp throughout the school day.'
      },
      {
        id: 'b1-exp-hea-q10',
        type: 'summary_completion',
        prompt: 'Complete the summary with ONE WORD from Paragraph 2: Without steady ______, carbon dioxide levels inside a shut classroom can climb past 2,000 ppm in forty-five minutes.',
        correctAnswer: 'ventilation',
        acceptedAnswers: ['ventilation'],
        explanation: 'Paragraph 2 states "Without steady ventilation to bring in outdoor air..."',
        passageEvidence: 'Without steady ventilation to bring in outdoor air, carbon dioxide levels inside a busy classroom can easily climb past 2,000 or even 3,000 ppm within a single forty-five-minute period.'
      }
    ]
  },
  {
    id: 'b1-eco-microfinance-cooperatives',
    title: 'How Village Savings Cooperatives Help Small Rural Businesses Grow',
    level: 'B1',
    topic: 'Economics and society',
    status: 'published',
    estimatedMinutes: 9,
    generationBatch: 'batch-expansion-b1',
    imageStatus: 'ready',
    introduction: 'Learn how self-managed neighbourhood savings groups in rural towns allow farmers and shopkeepers to borrow small sums without a commercial bank.',
    illustrationAlt: 'Photograph of rural women merchants selling fresh produce and woven goods at a village market',
    passage: [
      'In many rural villages across East Africa, South Asia, and Latin America, the nearest commercial bank branch may be fifty kilometres away down an unpaved road. Even when a farmer or tailor travels to town, traditional banks rarely lend money to low-income borrowers who do not own formal land titles or expensive property to pledge as security. Without access to a modest loan of fifty or one hundred dollars, a tailor cannot buy a second sewing machine and a farmer cannot purchase drought-resistant seeds before the rainy season.',
      'To bridge this financial gap, thousands of rural communities have organized Village Savings and Loan Associations (VSLAs). Unlike outside charity programmes, a VSLA is a self-managed cooperative formed by fifteen to twenty-five neighbours who know and trust one another. Every week, the members gather under a shade tree or in a community hall to contribute a small, agreed amount of savings into a shared fund.',
      'In traditional groups, the cash is kept inside a sturdy metal box secured with three separate padlocks. Three different members hold the keys, and a fourth person keeps the box at home, ensuring that the box can only be opened during an official weekly meeting in front of the whole group. Every deposit is recorded in a simple passbook using stamped symbols so that all members can verify the balance.',
      'Once the shared fund grows for a few months, members can apply to borrow small short-term loans for productive investments—such as buying wholesale vegetables to sell at the market, repairing a fishing net, or paying school tuition fees. Borrowers repay the loan over three months with a small service fee agreed upon by the group. Because that fee goes straight back into the shared box rather than to a distant bank, the community’s own savings grow throughout the year.',
      'At the end of a twelve-month cycle, the cooperative distributes the entire fund—including all accumulated service fees—back to the members in proportion to how much each person saved. Development economists have found that these village cooperatives achieve repayment rates above ninety-eight percent, empowering rural families to build resilient local businesses and weather unexpected medical or harvest emergencies. Beyond financial returns, the weekly meetings serve as a vital forum where neighbours share practical advice on crop rotation, bookkeeping, and market prices. In recent years, many rural savings groups have begun pairing their traditional metal lockboxes with simple mobile-phone ledgers that send automatic text receipts to every member after each meeting. This digital record helps veteran cooperatives qualify for larger credit lines from regional agricultural banks when they want to purchase shared community equipment such as solar grain mills or refrigerated milk vans. By combining neighbourly trust with transparent rules, village cooperatives prove that communities can generate lasting economic security from within. Many cooperatives also set aside a small emergency solidarity fund in a separate cloth bag inside the box. If a member’s roof is damaged by a storm or a child falls ill, the group can offer an immediate interest-free grant so the family never has to sell its farm tools or livestock. Through steady weekly saving and mutual support, rural neighbours turn modest coins into a powerful foundation for community prosperity.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'b1-exp-eco-1',
        word: 'pledge',
        partOfSpeech: 'verb',
        simpleDefinition: 'To promise property or land to a bank as security so the bank is protected if a loan is not repaid.',
        contextMeaning: 'To offer formal land or property to a bank in order to get a loan.',
        originalSentence: 'Even when a farmer or tailor travels to town, traditional banks rarely lend money to low-income borrowers who do not own formal land titles or expensive property to pledge as security.',
        exampleSentence: 'Homebuyers must pledge their house as security for a mortgage loan.',
        synonyms: ['offer as collateral', 'guarantee'],
        arabicTranslation: 'يرهن كضمان'
      },
      {
        id: 'b1-exp-eco-2',
        word: 'modest',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Fairly small in amount or size; not large or expensive.',
        contextMeaning: 'Small in dollar amount (such as fifty or one hundred dollars), yet very helpful to a village worker.',
        originalSentence: 'Without access to a modest loan of fifty or one hundred dollars, a tailor cannot buy a second sewing machine and a farmer cannot purchase drought-resistant seeds before the rainy season.',
        exampleSentence: 'She started her bakery with a modest loan from her family.',
        synonyms: ['small', 'moderate'],
        arabicTranslation: 'متواضع / صغير الحجم'
      },
      {
        id: 'b1-exp-eco-3',
        word: 'cooperative',
        partOfSpeech: 'noun',
        simpleDefinition: 'An organization or group owned and run jointly by its members, who share the benefits.',
        contextMeaning: 'The village savings group managed together by fifteen to twenty-five neighbours.',
        originalSentence: 'Unlike outside charity programmes, a VSLA is a self-managed cooperative formed by fifteen to twenty-five neighbours who know and trust one another.',
        exampleSentence: 'Local dairy farmers formed a cooperative to buy milk trucks together.',
        synonyms: ['association', 'member group'],
        arabicTranslation: 'جمعية تعاونية'
      },
      {
        id: 'b1-exp-eco-4',
        word: 'padlocks',
        partOfSpeech: 'noun',
        simpleDefinition: 'Detachable metal locks with a curved bar that fastens through a ring on a box or door.',
        contextMeaning: 'The three separate locks on the metal cash box, each opened by a different keyholder.',
        originalSentence: 'In traditional groups, the cash is kept inside a sturdy metal box secured with three separate padlocks.',
        exampleSentence: 'He fastened a heavy padlock to the garden gate.',
        synonyms: ['locks'],
        arabicTranslation: 'أقفال'
      },
      {
        id: 'b1-exp-eco-5',
        word: 'verify',
        partOfSpeech: 'verb',
        simpleDefinition: 'To check and confirm that something is accurate and true.',
        contextMeaning: 'To check that the savings total written in the passbook is correct.',
        originalSentence: 'Every deposit is recorded in a simple passbook using stamped symbols so that all members can verify the balance.',
        exampleSentence: 'Please verify your flight time before leaving for the airport.',
        synonyms: ['confirm', 'check'],
        arabicTranslation: 'يتحقق من'
      },
      {
        id: 'b1-exp-eco-6',
        word: 'wholesale',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Bought in larger quantities at a lower price so the buyer can resell the items in a market.',
        contextMeaning: 'Buying crates of vegetables from a farm supplier to sell at the village market.',
        originalSentence: 'Once the shared fund grows for a few months, members can apply to borrow small short-term loans for productive investments—such as buying wholesale vegetables to sell at the market, repairing a fishing net, or paying school tuition fees.',
        exampleSentence: 'The small shop buys rice at wholesale prices and sells it in one-kilo bags.',
        synonyms: ['bulk', 'trade-price'],
        arabicTranslation: 'بالجملة'
      },
      {
        id: 'b1-exp-eco-7',
        word: 'accumulated',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Gathered or built up gradually over a period of time.',
        contextMeaning: 'Added up inside the group’s fund over the full twelve-month cycle.',
        originalSentence: 'At the end of a twelve-month cycle, the cooperative distributes the entire fund—including all accumulated service fees—back to the members in proportion to how much each person saved.',
        exampleSentence: 'Workers cleared the accumulated snow from the school roof.',
        synonyms: ['collected', 'gathered'],
        arabicTranslation: 'متراكم'
      },
      {
        id: 'b1-exp-eco-8',
        word: 'resilient',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Strong enough to recover quickly from difficulties or unexpected problems.',
        contextMeaning: 'Able to survive bad weather or sudden expenses without failing.',
        originalSentence: 'Development economists have found that these village cooperatives achieve repayment rates above ninety-eight percent, empowering rural families to build resilient local businesses and weather unexpected medical or harvest emergencies.',
        exampleSentence: 'Growing several different crops makes a farm more resilient to drought.',
        synonyms: ['strong', 'adaptable', 'tough'],
        arabicTranslation: 'مرن / قادر على الصمود'
      }
    ],
    questions: [
      {
        id: 'b1-exp-eco-q1',
        type: 'true_false_not_given',
        prompt: 'Traditional commercial banks rarely lend money to low-income rural borrowers who lack formal land titles or property.',
        correctAnswer: 'True',
        explanation: 'Paragraph 1 states that traditional banks rarely lend money to low-income borrowers who do not own formal land titles or expensive property to pledge as security.',
        passageEvidence: 'Even when a farmer or tailor travels to town, traditional banks rarely lend money to low-income borrowers who do not own formal land titles or expensive property to pledge as security.'
      },
      {
        id: 'b1-exp-eco-q2',
        type: 'true_false_not_given',
        prompt: 'The person who keeps the metal cash box at home also holds all three keys to the padlocks.',
        correctAnswer: 'False',
        explanation: 'Paragraph 3 states that three different members hold the keys, and a fourth person keeps the box at home, so it can only be opened during an official meeting.',
        passageEvidence: 'Three different members hold the keys, and a fourth person keeps the box at home, ensuring that the box can only be opened during an official weekly meeting in front of the whole group.'
      },
      {
        id: 'b1-exp-eco-q3',
        type: 'true_false_not_given',
        prompt: 'Every village savings cooperative meets on Wednesday mornings.',
        correctAnswer: 'Not Given',
        explanation: 'Paragraph 2 states that members gather every week, and Paragraph 3 mentions an official weekly meeting, but the passage never specifies Wednesday mornings.',
        passageEvidence: 'Every week, the members gather under a shade tree or in a community hall to contribute a small, agreed amount of savings into a shared fund.'
      },
      {
        id: 'b1-exp-eco-q4',
        type: 'yes_no_not_given',
        prompt: 'The author views Village Savings and Loan Associations as effective tools that help rural families build stronger businesses.',
        correctAnswer: 'Yes',
        explanation: 'In Paragraph 5, the author highlights that these cooperatives achieve repayment rates above 98%, empowering rural families to build resilient local businesses.',
        passageEvidence: 'Development economists have found that these village cooperatives achieve repayment rates above ninety-eight percent, empowering rural families to build resilient local businesses and weather unexpected medical or harvest emergencies.'
      },
      {
        id: 'b1-exp-eco-q5',
        type: 'multiple_choice',
        prompt: 'What happens to the small service fees paid by borrowers in a Village Savings and Loan Association?',
        options: [
          'They go straight back into the shared box and are distributed to members at the end of the year',
          'They are sent to a commercial bank fifty kilometres away in the city',
          'They are used to buy three new metal boxes every week',
          'They are paid to government tax collectors at each meeting'
        ],
        correctAnswer: 'They go straight back into the shared box and are distributed to members at the end of the year',
        explanation: 'Paragraphs 4 and 5 explain that the service fee goes straight back into the shared box and is distributed back to members at the end of the twelve-month cycle.',
        passageEvidence: 'Because that fee goes straight back into the shared box rather than to a distant bank, the community’s own savings grow throughout the year.'
      },
      {
        id: 'b1-exp-eco-q6',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 3: Every deposit is recorded in a simple ______ using stamped symbols.',
        correctAnswer: 'passbook',
        acceptedAnswers: ['passbook'],
        explanation: 'Paragraph 3 states that every deposit is recorded in a simple passbook using stamped symbols.',
        passageEvidence: 'Every deposit is recorded in a simple passbook using stamped symbols so that all members can verify the balance.'
      },
      {
        id: 'b1-exp-eco-q7',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 5, what does the word "accumulated" mean?',
        options: [
          'Built up or collected gradually over time',
          'Lost during a long journey to town',
          'Borrowed from a foreign government',
          'Hidden underground in a clay pot'
        ],
        correctAnswer: 'Built up or collected gradually over time',
        explanation: '"All accumulated service fees" refers to all the service fees gathered in the fund over the twelve-month cycle.',
        passageEvidence: 'At the end of a twelve-month cycle, the cooperative distributes the entire fund—including all accumulated service fees—back to the members in proportion to how much each person saved.'
      },
      {
        id: 'b1-exp-eco-q8',
        type: 'short_answer',
        prompt: 'Answer with TWO WORDS from Paragraph 4: Over how long a period do borrowers usually repay a short-term loan to the group?',
        correctAnswer: 'three months',
        acceptedAnswers: ['three months', '3 months'],
        explanation: 'Paragraph 4 states that borrowers repay the loan over three months with a small service fee.',
        passageEvidence: 'Borrowers repay the loan over three months with a small service fee agreed upon by the group.'
      },
      {
        id: 'b1-exp-eco-q9',
        type: 'matching_information',
        prompt: 'Which paragraph explains the security system that prevents any single person from opening the cash box alone?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4', 'Paragraph 5'],
        correctAnswer: 'Paragraph 3',
        explanation: 'Paragraph 3 describes the sturdy metal box with three separate padlocks where three different members hold the keys and a fourth keeps the box.',
        passageEvidence: 'In traditional groups, the cash is kept inside a sturdy metal box secured with three separate padlocks.'
      },
      {
        id: 'b1-exp-eco-q10',
        type: 'summary_completion',
        prompt: 'Complete the summary with TWO WORDS from Paragraph 5: Development economists report that village cooperatives achieve repayment rates above ______ percent.',
        correctAnswer: 'ninety-eight',
        acceptedAnswers: ['ninety-eight', '98', 'ninety-eight percent'],
        explanation: 'Paragraph 5 states that these village cooperatives achieve repayment rates above ninety-eight percent.',
        passageEvidence: 'Development economists have found that these village cooperatives achieve repayment rates above ninety-eight percent, empowering rural families to build resilient local businesses and weather unexpected medical or harvest emergencies.'
      }
    ]
  },
  {
    id: 'b1-ast-lunar-lava-tubes',
    title: 'Why Underground Volcanic Caves Could Shelter Future Moon Bases',
    level: 'B1',
    topic: 'Astronomy and space exploration',
    status: 'published',
    estimatedMinutes: 9,
    generationBatch: 'batch-expansion-b1',
    imageStatus: 'ready',
    introduction: 'Discover why space agencies are mapping giant underground tunnels formed by ancient lunar volcanoes to protect astronauts from radiation and meteorites.',
    illustrationAlt: 'Photograph of the rocky cratered surface of the Moon viewed from lunar orbit',
    passage: [
      'As space agencies prepare to send astronauts back to the Moon for long-term scientific missions, engineers face a harsh environmental problem. Unlike Earth, the Moon has no thick atmosphere and no global magnetic field to shield its surface. Consequently, any habitat built on the open lunar plains is constantly exposed to dangerous cosmic radiation, solar storms, and tiny high-speed micrometeorites that hit the ground faster than a rifle bullet.',
      'In addition, surface temperatures on the Moon swing between extreme limits. During the two-week lunar day, sunlit rocks heat up to 120 degrees Celsius; during the two-week lunar night, the temperature plunges to minus 170 degrees Celsius. Building heavy metal domes thick enough to resist radiation, meteorite impacts, and 290-degree temperature swings would require launching hundreds of tonnes of costly shielding material from Earth.',
      'Fortunately, planetary geologists have discovered that the Moon already possesses natural underground shelters: lunar lava tubes. Billions of years ago, when the Moon was geologically active, rivers of molten basalt rock flowed across its plains. As the top layer of a lava river cooled against the vacuum of space, it hardened into a thick stone crust, while the hot liquid lava underneath kept flowing and eventually drained away. This left behind vast hollow tunnels stretching for kilometres beneath the surface.',
      'Since 2009, high-resolution cameras and radar instruments aboard Japanese and NASA lunar orbiters have photographed dozens of deep circular "skylights"—places where a section of a lava tube’s roof collapsed, opening a doorway into the cave below. In 2024, radar data from the Mare Tranquillitatis pit confirmed an accessible underground cave roughly forty-five metres wide and up to eighty metres long, lying more than a hundred metres beneath the surface.',
      'Inside such a cave, the thick basalt ceiling blocks cosmic radiation and micrometeorites completely, while the temperature stays at a steady, mild minus seventeen degrees Celsius day and night. Rather than hauling heavy armour from Earth, astronauts could lower inflatable habitat modules through a skylight and set up a safe, stable research station underground. Before human crews move in, space agencies plan to send small autonomous rovers and hopping drones down into these volcanic pits using winches and laser scanners. These robotic scouts will map the stability of the lava ceiling, test the cave floor for sharp basalt boulders, and search shadowy corners for ancient deposits of frozen water ice. Meanwhile, solar arrays mounted in the bright sunlight around the rim of the skylight above can send steady electrical power down a cable to run indoor lights and hydroponic vegetable gardens inside the cave. Turning ancient lunar lava tubes into natural shelters could make permanent scientific exploration of the Moon far safer and more affordable. To prepare for these underground missions, astronaut crews already train inside volcanic lava tubes on Earth, including caves in Iceland, Hawaii, and the Canary Islands. Walking through dark basalt tunnels in bulky spacesuits helps engineers test helmet lights, underground radio relays, and climbing ropes before launching hardware to the Moon. As international lunar programmes advance over the next decade, an ancient volcanic cave beneath the Sea of Tranquillity may well become humanity’s first permanent home beyond Earth and a gateway for deeper space exploration.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'b1-exp-ast-1',
        word: 'shield',
        partOfSpeech: 'verb',
        simpleDefinition: 'To protect someone or something from danger, heat, or harmful rays.',
        contextMeaning: 'To block cosmic radiation and tiny space rocks from hitting the Moon’s surface.',
        originalSentence: 'Unlike Earth, the Moon has no thick atmosphere and no global magnetic field to shield its surface.',
        exampleSentence: 'Ozone gas high in the sky helps shield Earth from ultraviolet rays.',
        synonyms: ['protect', 'guard', 'defend'],
        arabicTranslation: 'يحمي / يقي'
      },
      {
        id: 'b1-exp-ast-2',
        word: 'radiation',
        partOfSpeech: 'noun',
        simpleDefinition: 'High-energy rays or particles travelling through space that can harm living cells.',
        contextMeaning: 'Dangerous cosmic and solar rays that hit the unshielded lunar surface.',
        originalSentence: 'Consequently, any habitat built on the open lunar plains is constantly exposed to dangerous cosmic radiation, solar storms, and tiny high-speed micrometeorites that hit the ground faster than a rifle bullet.',
        exampleSentence: 'Spacesuits are designed to protect astronauts from solar radiation.',
        synonyms: ['cosmic rays', 'energetic particles'],
        arabicTranslation: 'إشعاع'
      },
      {
        id: 'b1-exp-ast-3',
        word: 'plunges',
        partOfSpeech: 'verb',
        simpleDefinition: 'Drops suddenly and deeply to a much lower level.',
        contextMeaning: 'Falls sharply to minus 170 degrees Celsius during the two-week lunar night.',
        originalSentence: 'During the two-week lunar day, sunlit rocks heat up to 120 degrees Celsius; during the two-week lunar night, the temperature plunges to minus 170 degrees Celsius.',
        exampleSentence: 'Desert air temperature plunges quickly after sunset.',
        synonyms: ['drops sharply', 'plummets', 'falls'],
        arabicTranslation: 'يهبط بحدة'
      },
      {
        id: 'b1-exp-ast-4',
        word: 'molten',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Melted into a hot liquid by extreme heat, such as liquid rock or metal.',
        contextMeaning: 'Liquid volcanic basalt rock that flowed across the ancient Moon.',
        originalSentence: 'Billions of years ago, when the Moon was geologically active, rivers of molten basalt rock flowed across its plains.',
        exampleSentence: 'Bright orange molten lava flowed down the side of the volcano.',
        synonyms: ['melted', 'liquid'],
        arabicTranslation: 'منصهر'
      },
      {
        id: 'b1-exp-ast-5',
        word: 'crust',
        partOfSpeech: 'noun',
        simpleDefinition: 'A hard outer layer that forms on the top of something.',
        contextMeaning: 'The solid stone roof that formed when the top of a lava river cooled.',
        originalSentence: 'As the top layer of a lava river cooled against the vacuum of space, it hardened into a thick stone crust, while the hot liquid lava underneath kept flowing and eventually drained away.',
        exampleSentence: 'The winter frost formed a thin icy crust over the snow.',
        synonyms: ['outer layer', 'shell'],
        arabicTranslation: 'قشرة صلبة'
      },
      {
        id: 'b1-exp-ast-6',
        word: 'collapsed',
        partOfSpeech: 'verb',
        simpleDefinition: 'Fell down or caved in suddenly.',
        contextMeaning: 'Fell inward, creating a round skylight opening into the underground tunnel.',
        originalSentence: 'Since 2009, high-resolution cameras and radar instruments aboard Japanese and NASA lunar orbiters have photographed dozens of deep circular "skylights"—places where a section of a lava tube’s roof collapsed, opening a doorway into the cave below.',
        exampleSentence: 'The roof of the old barn collapsed under the heavy snow.',
        synonyms: ['caved in', 'fell in'],
        arabicTranslation: 'انهار'
      },
      {
        id: 'b1-exp-ast-7',
        word: 'accessible',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Possible to reach or enter.',
        contextMeaning: 'Open enough at the pit bottom for future robots or astronauts to enter.',
        originalSentence: 'In 2024, radar data from the Mare Tranquillitatis pit confirmed an accessible underground cave roughly forty-five metres wide and up to eighty metres long, lying more than a hundred metres beneath the surface.',
        exampleSentence: 'The mountain village is only accessible by train in winter.',
        synonyms: ['reachable', 'open'],
        arabicTranslation: 'يمكن الوصول إليه'
      },
      {
        id: 'b1-exp-ast-8',
        word: 'inflatable',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Designed to be packed small for travel and then filled with air to expand to full size.',
        contextMeaning: 'Light, air-filled living modules that can be lowered into a cave and expanded.',
        originalSentence: 'Rather than hauling heavy armour from Earth, astronauts could lower inflatable habitat modules through a skylight and set up a safe, stable research station underground.',
        exampleSentence: 'Rescue teams used an inflatable rubber boat to cross the flooded river.',
        synonyms: ['air-filled', 'expandable'],
        arabicTranslation: 'قابل للنفخ'
      }
    ],
    questions: [
      {
        id: 'b1-exp-ast-q1',
        type: 'true_false_not_given',
        prompt: 'The Moon has a thick atmosphere that burns up all micrometeorites before they reach the ground.',
        correctAnswer: 'False',
        explanation: 'Paragraph 1 states that unlike Earth, the Moon has no thick atmosphere and no global magnetic field to shield its surface.',
        passageEvidence: 'Unlike Earth, the Moon has no thick atmosphere and no global magnetic field to shield its surface.'
      },
      {
        id: 'b1-exp-ast-q2',
        type: 'true_false_not_given',
        prompt: 'In 2024, radar data confirmed an accessible underground cave beneath the Mare Tranquillitatis pit.',
        correctAnswer: 'True',
        explanation: 'Paragraph 4 states that in 2024, radar data from the Mare Tranquillitatis pit confirmed an accessible underground cave roughly forty-five metres wide and up to eighty metres long.',
        passageEvidence: 'In 2024, radar data from the Mare Tranquillitatis pit confirmed an accessible underground cave roughly forty-five metres wide and up to eighty metres long, lying more than a hundred metres beneath the surface.'
      },
      {
        id: 'b1-exp-ast-q3',
        type: 'true_false_not_given',
        prompt: 'The Mare Tranquillitatis cave contains frozen underground lakes of drinking water.',
        correctAnswer: 'Not Given',
        explanation: 'The passage describes the dimensions and temperature of the Mare Tranquillitatis cave, but it never mentions frozen lakes of water inside it.',
        passageEvidence: 'In 2024, radar data from the Mare Tranquillitatis pit confirmed an accessible underground cave roughly forty-five metres wide and up to eighty metres long, lying more than a hundred metres beneath the surface.'
      },
      {
        id: 'b1-exp-ast-q4',
        type: 'yes_no_not_given',
        prompt: 'The author suggests that setting up inflatable habitats inside lunar lava tubes is more practical than launching hundreds of tonnes of heavy shielding from Earth.',
        correctAnswer: 'Yes',
        explanation: 'In Paragraphs 2 and 5, the author contrasts launching hundreds of tonnes of costly shielding from Earth with lowering inflatable habitat modules into naturally shielded caves.',
        passageEvidence: 'Rather than hauling heavy armour from Earth, astronauts could lower inflatable habitat modules through a skylight and set up a safe, stable research station underground.'
      },
      {
        id: 'b1-exp-ast-q5',
        type: 'multiple_choice',
        prompt: 'How did hollow lava tubes originally form on the Moon billions of years ago?',
        options: [
          'The top of a flowing lava river hardened into a stone crust while the hot liquid lava underneath drained away',
          'Giant underground worms dug long tunnels through the basalt rock',
          'Astronauts from earlier missions drilled deep caves using laser machines',
          'Heavy rainstorms washed away soft mud beneath the lunar mountains'
        ],
        correctAnswer: 'The top of a flowing lava river hardened into a stone crust while the hot liquid lava underneath drained away',
        explanation: 'Paragraph 3 explains that as the top layer of a lava river cooled, it hardened into a thick stone crust while the hot liquid lava underneath kept flowing and drained away.',
        passageEvidence: 'As the top layer of a lava river cooled against the vacuum of space, it hardened into a thick stone crust, while the hot liquid lava underneath kept flowing and eventually drained away.'
      },
      {
        id: 'b1-exp-ast-q6',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 4: Places where a section of a lava tube’s roof collapsed are called circular "______."',
        correctAnswer: 'skylights',
        acceptedAnswers: ['skylights'],
        explanation: 'Paragraph 4 states that orbiters have photographed dozens of deep circular "skylights".',
        passageEvidence: 'Since 2009, high-resolution cameras and radar instruments aboard Japanese and NASA lunar orbiters have photographed dozens of deep circular "skylights"—places where a section of a lava tube’s roof collapsed, opening a doorway into the cave below.'
      },
      {
        id: 'b1-exp-ast-q7',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 3, the word "molten" is closest in meaning to:',
        options: [
          'Melted into hot liquid by extreme heat',
          'Covered in cold white snow',
          'Broken into sharp dry pebbles',
          'Painted with reflective silver metal'
        ],
        correctAnswer: 'Melted into hot liquid by extreme heat',
        explanation: '"Rivers of molten basalt rock" refers to hot, liquid volcanic rock.',
        passageEvidence: 'Billions of years ago, when the Moon was geologically active, rivers of molten basalt rock flowed across its plains.'
      },
      {
        id: 'b1-exp-ast-q8',
        type: 'short_answer',
        prompt: 'Answer with TWO WORDS from Paragraph 2: How long does a single lunar day or lunar night last?',
        correctAnswer: 'two weeks',
        acceptedAnswers: ['two weeks', '2 weeks', 'two-week'],
        explanation: 'Paragraph 2 refers to the "two-week lunar day" and the "two-week lunar night".',
        passageEvidence: 'During the two-week lunar day, sunlit rocks heat up to 120 degrees Celsius; during the two-week lunar night, the temperature plunges to minus 170 degrees Celsius.'
      },
      {
        id: 'b1-exp-ast-q9',
        type: 'matching_information',
        prompt: 'Which paragraph compares the extreme surface temperature swings on the Moon with the steady temperature inside a lava tube?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4', 'Paragraph 5'],
        correctAnswer: 'Paragraph 5',
        explanation: 'Paragraph 5 explains that inside a cave, the temperature stays at a steady, mild minus seventeen degrees Celsius day and night.',
        passageEvidence: 'Inside such a cave, the thick basalt ceiling blocks cosmic radiation and micrometeorites completely, while the temperature stays at a steady, mild minus seventeen degrees Celsius day and night.'
      },
      {
        id: 'b1-exp-ast-q10',
        type: 'summary_completion',
        prompt: 'Complete the summary with ONE WORD from Paragraph 5: Inside a lunar cave, the thick ______ ceiling blocks cosmic radiation and micrometeorites completely.',
        correctAnswer: 'basalt',
        acceptedAnswers: ['basalt', 'stone'],
        explanation: 'Paragraph 5 states that the thick basalt ceiling blocks cosmic radiation and micrometeorites completely.',
        passageEvidence: 'Inside such a cave, the thick basalt ceiling blocks cosmic radiation and micrometeorites completely, while the temperature stays at a steady, mild minus seventeen degrees Celsius day and night.'
      }
    ]
  },
  {
    id: 'b1-arc-sponge-cities',
    title: 'Permeable Pavements and Sunken Parks in Flood-Resilient Sponge Cities',
    level: 'B1',
    topic: 'Architecture and urban development',
    status: 'published',
    estimatedMinutes: 9,
    generationBatch: 'batch-expansion-b1',
    imageStatus: 'ready',
    introduction: 'Explore how urban planners in China, Europe, and North America are replacing waterproof concrete with porous streets and wetlands that soak up heavy rain.',
    illustrationAlt: 'Photograph of an urban wetland park with wooden boardwalks and lush water-absorbing plants',
    passage: [
      'For more than a century, modern cities were built with a single goal for rainwater: push it away as fast as possible. Engineers covered natural soil with waterproof asphalt roads, concrete car parks, and tiled roofs, channeling every raindrop into underground concrete pipes. While this "grey infrastructure" works during gentle showers, climate change is now bringing heavier cloudbursts that overwhelm underground drains within minutes, flooding streets and basements.',
      'Paradoxically, the same cities that suffer from summer flash floods often face water shortages a few months later, because all that rainwater was rushed straight out to sea instead of refilling underground aquifers. To solve both problems at once, landscape architect Kongjian Yu and urban planners around the world have pioneered the "sponge city" model. Rather than fighting water with concrete walls, a sponge city absorbs, cleans, and stores rainwater where it falls.',
      'The transformation begins right under pedestrians’ feet. Traditional sidewalks and parking bays are replaced with permeable pavements made from porous asphalt or interlocking stone blocks with gravel gaps. When a storm hits, rainwater seeps straight through the pavement into a deep bed of crushed stone below, reducing surface runoff by up to seventy percent. Roadside kerbs are also cut with small openings so street water flows into planted ditches called bioswales.',
      'For even heavier storms, sponge cities redesign neighbourhood parks as sunken green basins. During dry weather, residents use these terraced parks for walking, jogging, and picnics along elevated wooden boardwalks. During a monsoon downpour, however, the lower lawns and reed ponds safely fill with thousands of cubic metres of stormwater. Native wetland plants and soil bacteria naturally filter out motor oil and street dust as the water slowly sinks into the ground.',
      'Cities from Wuhan and Shanghai to Rotterdam and Philadelphia have already converted hundreds of square kilometres into sponge districts. Field measurements show that green sponge parks not only prevent costly flood damage and recharge groundwater reserves, but also cool surrounding apartment blocks by several degrees during summer heatwaves. Economic comparisons further reveal that building permeable pavements, bioswales, and sunken wetland parks often costs less than digging deeper concrete storm tunnels beneath crowded city streets. During dry months, these sunken gardens serve as welcoming neighbourhood parks with jogging paths, boardwalks, and outdoor seating, only filling with water for a day or two during heavy monsoon downpours. Once the stored rainwater passes through layers of sand, gravel, and reed roots, municipal crews can reuse the filtered water to irrigate street trees, clean public buses, and supply ornamental canals. By working with natural water cycles instead of fighting against them, sponge cities turn extreme weather risks into lasting ecological and community assets. Local schools and neighbourhood groups also use these restored urban wetlands as outdoor classrooms where children can observe dragonflies, frogs, and waterbirds returning to the heart of the city. Property owners near sponge parks have seen fewer flooded basements and lower insurance costs during the rainy summer season. As coastal and inland cities alike prepare for more unpredictable rainfall in the twenty-first century, replacing hard grey concrete with living green sponges offers a practical blueprint for safer, cooler, and more welcoming urban neighbourhoods across every continent of the world.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'b1-exp-arc-1',
        word: 'waterproof',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Not allowing water to pass through at all.',
        contextMeaning: 'Hard road and roof surfaces that block rain from soaking into the ground.',
        originalSentence: 'Engineers covered natural soil with waterproof asphalt roads, concrete car parks, and tiled roofs, channeling every raindrop into underground concrete pipes.',
        exampleSentence: 'She wore a waterproof jacket during the mountain hike.',
        synonyms: ['impermeable', 'water-resistant'],
        arabicTranslation: 'مقاوم للماء / غير منفذ للماء'
      },
      {
        id: 'b1-exp-arc-2',
        word: 'overwhelm',
        partOfSpeech: 'verb',
        simpleDefinition: 'To be too much for a system to handle or hold.',
        contextMeaning: 'To fill underground drainpipes with more rainwater than they can carry.',
        originalSentence: 'While this "grey infrastructure" works during gentle showers, climate change is now bringing heavier cloudbursts that overwhelm underground drains within minutes, flooding streets and basements.',
        exampleSentence: 'Sudden holiday traffic can overwhelm small country roads.',
        synonyms: ['overload', 'swamp', 'flood'],
        arabicTranslation: 'يفوق طاقة الاستيعاب / يغمر'
      },
      {
        id: 'b1-exp-arc-3',
        word: 'aquifers',
        partOfSpeech: 'noun',
        simpleDefinition: 'Underground layers of porous rock, sand, or gravel that hold natural groundwater.',
        contextMeaning: 'Underground water reserves beneath a city that need rain to refill.',
        originalSentence: 'Paradoxically, the same cities that suffer from summer flash floods often face water shortages a few months later, because all that rainwater was rushed straight out to sea instead of refilling underground aquifers.',
        exampleSentence: 'Many towns pump clean drinking water from deep underground aquifers.',
        synonyms: ['groundwater reserves', 'water tables'],
        arabicTranslation: 'خزانات المياه الجوفية'
      },
      {
        id: 'b1-exp-arc-4',
        word: 'permeable',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Having tiny spaces or pores that allow liquid to pass through.',
        contextMeaning: 'Designed to let rainwater soak straight through the sidewalk into the ground below.',
        originalSentence: 'Traditional sidewalks and parking bays are replaced with permeable pavements made from porous asphalt or interlocking stone blocks with gravel gaps.',
        exampleSentence: 'Sandy soil is very permeable and drains quickly after rain.',
        synonyms: ['porous', 'absorbent'],
        arabicTranslation: 'منفذ للماء / مسامي'
      },
      {
        id: 'b1-exp-arc-5',
        word: 'seeps',
        partOfSpeech: 'verb',
        simpleDefinition: 'Flows or trickles slowly through small openings into a material.',
        contextMeaning: 'Soaks gently down through the porous pavement into the gravel bed.',
        originalSentence: 'When a storm hits, rainwater seeps straight through the pavement into a deep bed of crushed stone below, reducing surface runoff by up to seventy percent.',
        exampleSentence: 'Melting snow seeps slowly into the forest earth.',
        synonyms: ['trickles', 'soaks', 'percolates'],
        arabicTranslation: 'يتسرب ببطء للداخل'
      },
      {
        id: 'b1-exp-arc-6',
        word: 'bioswales',
        partOfSpeech: 'noun',
        simpleDefinition: 'Shallow, plant-filled channels beside streets designed to catch, slow, and filter rainwater.',
        contextMeaning: 'Green roadside ditches that drink up water flowing off the street.',
        originalSentence: 'Roadside kerbs are also cut with small openings so street water flows into planted ditches called bioswales.',
        exampleSentence: 'Roadside bioswales planted with native grasses keep street water out of sewers.',
        synonyms: ['planted drainage channels', 'rain gardens'],
        arabicTranslation: 'قنوات تصريف نباتية'
      },
      {
        id: 'b1-exp-arc-7',
        word: 'sunken',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Built at a lower level than the surrounding ground or streets.',
        contextMeaning: 'Lowered below street level so excess stormwater can collect safely inside the park.',
        originalSentence: 'For even heavier storms, sponge cities redesign neighbourhood parks as sunken green basins.',
        exampleSentence: 'The palace had a quiet sunken garden surrounded by stone steps.',
        synonyms: ['lowered', 'recessed'],
        arabicTranslation: 'منخفض المستوى / غائر'
      },
      {
        id: 'b1-exp-arc-8',
        word: 'boardwalks',
        partOfSpeech: 'noun',
        simpleDefinition: 'Raised wooden footpaths built over wet ground, marshes, or sand.',
        contextMeaning: 'Elevated wooden walkways that let visitors walk through sponge parks even when ponds are full.',
        originalSentence: 'During dry weather, residents use these terraced parks for walking, jogging, and picnics along elevated wooden boardwalks.',
        exampleSentence: 'Visitors walked along the wooden boardwalks above the wetland.',
        synonyms: ['wooden walkways', 'footbridges'],
        arabicTranslation: 'ممرات خشبية مرتفعة'
      }
    ],
    questions: [
      {
        id: 'b1-exp-arc-q1',
        type: 'true_false_not_given',
        prompt: 'Permeable pavements can reduce surface rainwater runoff by up to seventy percent.',
        correctAnswer: 'True',
        explanation: 'Paragraph 3 states that rainwater seeps straight through the pavement into a deep bed of crushed stone below, reducing surface runoff by up to seventy percent.',
        passageEvidence: 'When a storm hits, rainwater seeps straight through the pavement into a deep bed of crushed stone below, reducing surface runoff by up to seventy percent.'
      },
      {
        id: 'b1-exp-arc-q2',
        type: 'true_false_not_given',
        prompt: 'Sunken sponge parks are closed to the public during dry weather.',
        correctAnswer: 'False',
        explanation: 'Paragraph 4 states that during dry weather, residents use these terraced parks for walking, jogging, and picnics along elevated wooden boardwalks.',
        passageEvidence: 'During dry weather, residents use these terraced parks for walking, jogging, and picnics along elevated wooden boardwalks.'
      },
      {
        id: 'b1-exp-arc-q3',
        type: 'true_false_not_given',
        prompt: 'Rotterdam spent more money on sponge parks than Philadelphia did.',
        correctAnswer: 'Not Given',
        explanation: 'Paragraph 5 mentions Wuhan, Shanghai, Rotterdam, and Philadelphia, but it never compares how much money each city spent.',
        passageEvidence: 'Cities from Wuhan and Shanghai to Rotterdam and Philadelphia have already converted hundreds of square kilometres into sponge districts.'
      },
      {
        id: 'b1-exp-arc-q4',
        type: 'yes_no_not_given',
        prompt: 'The author points out an irony that cities suffering from summer flash floods often experience water shortages later in the year.',
        correctAnswer: 'Yes',
        explanation: 'In Paragraph 2, the author writes "Paradoxically, the same cities that suffer from summer flash floods often face water shortages a few months later" because rainwater was rushed out to sea.',
        passageEvidence: 'Paradoxically, the same cities that suffer from summer flash floods often face water shortages a few months later, because all that rainwater was rushed straight out to sea instead of refilling underground aquifers.'
      },
      {
        id: 'b1-exp-arc-q5',
        type: 'multiple_choice',
        prompt: 'How are pollutants such as motor oil and street dust removed from stormwater in a sunken sponge park?',
        options: [
          'Native wetland plants and soil bacteria naturally filter them out as the water sinks into the ground',
          'Workers pour liquid chlorine into the park ponds after every rainstorm',
          'Underground electric heaters boil the rainwater inside concrete pipes',
          'Plastic nets stretched across the street catch every drop of motor oil'
        ],
        correctAnswer: 'Native wetland plants and soil bacteria naturally filter them out as the water sinks into the ground',
        explanation: 'Paragraph 4 states that native wetland plants and soil bacteria naturally filter out motor oil and street dust as the water slowly sinks into the ground.',
        passageEvidence: 'Native wetland plants and soil bacteria naturally filter out motor oil and street dust as the water slowly sinks into the ground.'
      },
      {
        id: 'b1-exp-arc-q6',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 3: Roadside kerbs are cut with small openings so street water flows into planted ditches called ______.',
        correctAnswer: 'bioswales',
        acceptedAnswers: ['bioswales'],
        explanation: 'Paragraph 3 states that street water flows into planted ditches called bioswales.',
        passageEvidence: 'Roadside kerbs are also cut with small openings so street water flows into planted ditches called bioswales.'
      },
      {
        id: 'b1-exp-arc-q7',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 3, the word "permeable" is closest in meaning to:',
        options: [
          'Allowing liquid to pass or soak through',
          'Painted with bright yellow traffic lines',
          'Heated by underground electrical wires',
          'Made from solid waterproof steel'
        ],
        correctAnswer: 'Allowing liquid to pass or soak through',
        explanation: 'Permeable pavements are made from porous asphalt or stone blocks with gravel gaps so rainwater seeps straight through.',
        passageEvidence: 'Traditional sidewalks and parking bays are replaced with permeable pavements made from porous asphalt or interlocking stone blocks with gravel gaps.'
      },
      {
        id: 'b1-exp-arc-q8',
        type: 'short_answer',
        prompt: 'Answer with TWO WORDS from Paragraph 2: Who is the landscape architect named in the passage for pioneering the sponge city model?',
        correctAnswer: 'Kongjian Yu',
        acceptedAnswers: ['Kongjian Yu', 'Yu'],
        explanation: 'Paragraph 2 names landscape architect Kongjian Yu.',
        passageEvidence: 'To solve both problems at once, landscape architect Kongjian Yu and urban planners around the world have pioneered the "sponge city" model.'
      },
      {
        id: 'b1-exp-arc-q9',
        type: 'matching_information',
        prompt: 'Which paragraph explains why traditional waterproof roads and concrete pipes fail during heavy modern cloudbursts?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4', 'Paragraph 5'],
        correctAnswer: 'Paragraph 1',
        explanation: 'Paragraph 1 explains how waterproof asphalt and concrete channel rain into underground pipes that are overwhelmed during heavier cloudbursts.',
        passageEvidence: 'While this "grey infrastructure" works during gentle showers, climate change is now bringing heavier cloudbursts that overwhelm underground drains within minutes, flooding streets and basements.'
      },
      {
        id: 'b1-exp-arc-q10',
        type: 'summary_completion',
        prompt: 'Complete the summary with ONE WORD from Paragraph 5: In addition to preventing floods and recharging groundwater, green sponge parks cool surrounding apartment blocks during summer ______.',
        correctAnswer: 'heatwaves',
        acceptedAnswers: ['heatwaves'],
        explanation: 'Paragraph 5 states that sponge parks cool surrounding apartment blocks by several degrees during summer heatwaves.',
        passageEvidence: 'Field measurements show that green sponge parks not only prevent costly flood damage and recharge groundwater reserves, but also cool surrounding apartment blocks by several degrees during summer heatwaves.'
      }
    ]
  }
];

export const BATCH_B1_EXPANSION_LESSONS: ReadingLesson[] = rawB1ExpansionLessons.map((lesson) => {
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
