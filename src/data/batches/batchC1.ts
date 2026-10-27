import { ReadingLesson } from '../../types/reading';
import { getEditorialIllustrationUri, getPassageIllustrationAlt } from '../../utils/illustrations';

const rawC1Lessons: Omit<ReadingLesson, 'illustrationUrl' | 'wordCount'>[] = [
  {
    id: 'c1-01-neuromorphic-computing',
    title: 'Neuromorphic Silicon and the Limits of Von Neumann Architecture',
    level: 'C1',
    topic: 'Science and technology',
    estimatedMinutes: 14,
    status: 'published',
    generationBatch: 'batch-5-c1',
    imageStatus: 'ready',
    introduction: 'An examination of how event-driven neuromorphic chips overcome the memory bottleneck of classical computing by emulating biological synapses.',
    createdAt: '2026-01-15T12:00:00Z',
    updatedAt: '2026-01-15T12:00:00Z',
    illustrationAlt: 'Editorial illustration of synaptic silicon circuits and neural pathways',
    passage: [
      'For nearly eight decades, digital computation has been governed by the von Neumann paradigm, an architectural separation between the central processing unit and random-access memory. While this bifurcation enabled extraordinary general-purpose programmability, it has increasingly become an energetic liability. In data-intensive artificial intelligence workloads, shuttling operands back and forth across a physical bus consumes orders of magnitude more energy than the arithmetic operations themselves—a constraint known among computer architects as the von Neumann bottleneck.',
      'Neuromorphic engineering seeks to circumvent this impediment by taking structural inspiration from the mammalian neocortex. Rather than executing sequential instructions synchronized by a global clock, neuromorphic chips consist of distributed arrays of artificial neurons and memristive synapses that co-locate memory and processing. Information is encoded not as continuous binary words, but as sparse, asynchronous voltage spikes. Consequently, a silicon neuron expends power only when a threshold event occurs, mirroring the metabolic parsimony of biological tissue, which operates on roughly twenty watts.',
      'Despite compelling demonstrations in low-latency sensory processing and robotic reflex control, formidable obstacles impede the mainstream adoption of neuromorphic hardware. Most contemporary deep-learning algorithms rely on backpropagation of continuous gradients, a mathematical procedure ill-suited to discrete, non-differentiable spike trains. Until researchers devise compilation toolchains capable of mapping arbitrary computational graphs onto spiking substrates without sacrificing accuracy, neuromorphic processors are likely to function as specialized co-processors alongside conventional silicon rather than wholesale replacements.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'v-c1-01-1',
        word: 'paradigm',
        partOfSpeech: 'noun',
        simpleDefinition: 'A standard model, pattern, or way of designing something.',
        contextMeaning: 'The foundational design model used to build almost all modern computers.',
        exampleSentence: 'The discovery shifted the dominant paradigm in modern physics.',
        synonyms: ['model', 'framework', 'standard'],
        originalSentence: 'For nearly eight decades, digital computation has been governed by the von Neumann paradigm, an architectural separation between the central processing unit and random-access memory.',
        arabicTranslation: 'نموذج فكري / إطار قياسي'
      },
      {
        id: 'v-c1-01-2',
        word: 'bifurcation',
        partOfSpeech: 'noun',
        simpleDefinition: 'The division of something into two separate parts or branches.',
        contextMeaning: 'The strict split between the processor and the memory unit inside a computer.',
        exampleSentence: 'The bifurcation of the river created two distinct ecological zones.',
        synonyms: ['division', 'split', 'separation'],
        originalSentence: 'While this bifurcation enabled extraordinary general-purpose programmability, it has increasingly become an energetic liability.',
        arabicTranslation: 'انقسام ثنائي / تشعب'
      },
      {
        id: 'v-c1-01-3',
        word: 'liability',
        partOfSpeech: 'noun',
        simpleDefinition: 'Something that causes a disadvantage or holds progress back.',
        contextMeaning: 'A design weakness that wastes large amounts of electrical power.',
        exampleSentence: 'Outdated machinery became a serious liability for the factory.',
        synonyms: ['drawback', 'disadvantage', 'burden'],
        originalSentence: 'While this bifurcation enabled extraordinary general-purpose programmability, it has increasingly become an energetic liability.',
        arabicTranslation: 'عبء / نقطة ضعف'
      },
      {
        id: 'v-c1-01-4',
        word: 'circumvent',
        partOfSpeech: 'verb',
        simpleDefinition: 'To find a clever way around an obstacle or limitation.',
        contextMeaning: 'To bypass the energy-wasting data transfer limit of traditional computer chips.',
        exampleSentence: 'Engineers designed a new valve to circumvent pressure buildup.',
        synonyms: ['bypass', 'avoid', 'overcome'],
        originalSentence: 'Neuromorphic engineering seeks to circumvent this impediment by taking structural inspiration from the mammalian neocortex.',
        arabicTranslation: 'يتحايل على / يتجاوز'
      },
      {
        id: 'v-c1-01-5',
        word: 'impediment',
        partOfSpeech: 'noun',
        simpleDefinition: 'A barrier or problem that slows down progress.',
        contextMeaning: 'The technical bottleneck caused by separating memory from calculation.',
        exampleSentence: 'Lack of funding was the main impediment to launching the satellite.',
        synonyms: ['obstacle', 'barrier', 'hindrance'],
        originalSentence: 'Neuromorphic engineering seeks to circumvent this impediment by taking structural inspiration from the mammalian neocortex.',
        arabicTranslation: 'عائق / عقبة'
      },
      {
        id: 'v-c1-01-6',
        word: 'asynchronous',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Not happening at the same predetermined time; operating independently of a central clock.',
        contextMeaning: 'Signals firing only when needed rather than waiting for a central computer clock tick.',
        exampleSentence: 'Asynchronous messaging allows team members in different time zones to collaborate.',
        synonyms: ['independent', 'uncoordinated-in-time'],
        originalSentence: 'Information is encoded not as continuous binary words, but as sparse, asynchronous voltage spikes.',
        arabicTranslation: 'غير متزامن'
      },
      {
        id: 'v-c1-01-7',
        word: 'parsimony',
        partOfSpeech: 'noun',
        simpleDefinition: 'Extreme care and economy in using resources.',
        contextMeaning: 'The brain’s remarkable ability to perform complex thinking using very little energy.',
        exampleSentence: 'Evolutionary parsimony favors biological structures that do not waste energy.',
        synonyms: ['economy', 'efficiency', 'frugality'],
        originalSentence: 'Consequently, a silicon neuron expends power only when a threshold event occurs, mirroring the metabolic parsimony of biological tissue, which operates on roughly twenty watts.',
        arabicTranslation: 'اقتصاد شديد / ترشيد'
      },
      {
        id: 'v-c1-01-8',
        word: 'formidable',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Very difficult to deal with or overcome; requiring great effort.',
        contextMeaning: 'Major technical challenges that are hard for engineers to solve.',
        exampleSentence: 'Translating ancient scripts presents a formidable challenge to linguists.',
        synonyms: ['daunting', 'difficult', 'substantial'],
        originalSentence: 'Despite compelling demonstrations in low-latency sensory processing and robotic reflex control, formidable obstacles impede the mainstream adoption of neuromorphic hardware.',
        arabicTranslation: 'هائل / صعب المراس'
      },
      {
        id: 'v-c1-01-9',
        word: 'substrates',
        partOfSpeech: 'noun',
        simpleDefinition: 'The underlying physical materials or layers on which a system operates.',
        contextMeaning: 'Physical neuromorphic chip architectures that process spiking signals.',
        exampleSentence: 'Flexible glass substrates are being tested for foldable solar panels.',
        synonyms: ['foundations', 'materials', 'platforms'],
        originalSentence: 'Until researchers devise compilation toolchains capable of mapping arbitrary computational graphs onto spiking substrates without sacrificing accuracy, neuromorphic processors are likely to function as specialized co-processors alongside conventional silicon rather than wholesale replacements.',
        arabicTranslation: 'ركائز مادية'
      }
    ],
    questions: [
      {
        id: 'q-c1-01-1',
        type: 'multiple_choice',
        prompt: 'What is the primary cause of the "von Neumann bottleneck" described in Paragraph 1?',
        options: [
          'The physical energy cost of repeatedly transferring data between separate memory and processing units',
          'The inability of central processing units to perform rapid arithmetic calculations',
          'The overheating of global clock oscillators in small mobile devices',
          'The lack of binary encoding standards for artificial intelligence'
        ],
        correctAnswer: 'The physical energy cost of repeatedly transferring data between separate memory and processing units',
        explanation: 'Paragraph 1 states that shuttling operands back and forth across a physical bus between CPU and RAM consumes orders of magnitude more energy than the arithmetic operations.',
        passageEvidence: 'In data-intensive artificial intelligence workloads, shuttling operands back and forth across a physical bus consumes orders of magnitude more energy than the arithmetic operations themselves'
      },
      {
        id: 'q-c1-01-2',
        type: 'true_false_not_given',
        prompt: 'Neuromorphic chips rely on a single global clock to synchronize every artificial neuron simultaneously.',
        options: ['True', 'False', 'Not Given'],
        correctAnswer: 'False',
        explanation: 'Paragraph 2 explicitly contrasts neuromorphic chips with global-clock systems, noting they use sparse, asynchronous voltage spikes.',
        passageEvidence: 'Rather than executing sequential instructions synchronized by a global clock, neuromorphic chips consist of distributed arrays of artificial neurons'
      },
      {
        id: 'q-c1-01-3',
        type: 'sentence_completion',
        prompt: 'Biological brain tissue is able to function on approximately twenty watts of power, demonstrating remarkable metabolic _______.',
        correctAnswer: 'parsimony',
        acceptedAnswers: ['parsimony'],
        explanation: 'Paragraph 2 refers to the "metabolic parsimony of biological tissue, which operates on roughly twenty watts."',
        passageEvidence: 'mirroring the metabolic parsimony of biological tissue, which operates on roughly twenty watts.'
      },
      {
        id: 'q-c1-01-4',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 1, the word "bifurcation" most nearly means:',
        options: [
          'Division into two separate components',
          'Sudden electrical failure',
          'Compression of digital files',
          'Doubling of calculation speed'
        ],
        correctAnswer: 'Division into two separate components',
        explanation: '"Bifurcation" refers back to the "architectural separation between the central processing unit and random-access memory."',
        passageEvidence: 'an architectural separation between the central processing unit and random-access memory. While this bifurcation enabled extraordinary general-purpose programmability'
      },
      {
        id: 'q-c1-01-5',
        type: 'multiple_choice',
        prompt: 'Why is it difficult to run standard deep-learning algorithms directly on neuromorphic hardware?',
        options: [
          'Standard deep learning depends on continuous gradients, whereas neuromorphic chips use discrete spikes',
          'Neuromorphic chips consume too much electricity for deep-learning data centers',
          'Silicon neurons cannot be manufactured using modern semiconductor lithography',
          'Robotic reflex controllers forbid the use of synaptic memory arrays'
        ],
        correctAnswer: 'Standard deep learning depends on continuous gradients, whereas neuromorphic chips use discrete spikes',
        explanation: 'Paragraph 3 explains that backpropagation uses continuous gradients, which is ill-suited to discrete, non-differentiable spike trains.',
        passageEvidence: 'Most contemporary deep-learning algorithms rely on backpropagation of continuous gradients, a mathematical procedure ill-suited to discrete, non-differentiable spike trains.'
      }
    ]
  },
  {
    id: 'c1-02-paleoclimate-proxies',
    title: 'Isotopic Paleothermometry and the Fidelity of Deep-Time Climate Proxies',
    level: 'C1',
    topic: 'Environmental science',
    estimatedMinutes: 14,
    status: 'published',
    generationBatch: 'batch-5-c1',
    imageStatus: 'ready',
    introduction: 'How geochemists reconstruct ancient ocean temperatures using oxygen isotopes in foraminifera shells while accounting for diagenetic alteration.',
    createdAt: '2026-01-15T12:00:00Z',
    updatedAt: '2026-01-15T12:00:00Z',
    illustrationAlt: 'Editorial illustration of deep ocean sediment cores and microscopic marine shells',
    passage: [
      'Direct instrumental records of atmospheric and oceanic temperature extend back scarcely a century and a half, a negligible interval when weighed against Earth’s multimillion-year climatic oscillations. To reconstruct thermal regimes of the Cenozoic Era, paleoclimatologists rely on geochemical proxies—measurable chemical signatures preserved in biogenic sediments that covary predictably with environmental parameters at the time of mineralization.',
      'Foremost among these archives are the calcium carbonate tests of benthic foraminifera, single-celled marine protists that inhabit the abyssal seafloor. As these organisms precipitate their shells from ambient seawater, the ratio of heavy oxygen-18 to light oxygen-16 incorporated into the crystal lattice is governed by thermodynamic fractionation: colder water favors the uptake of the heavier isotope. However, interpreting this isotopic signal is complicated by a confounding variable. Because continental ice sheets preferentially sequester light oxygen-16 from the hydrological cycle, an enrichment of oxygen-18 in marine sediments may reflect either abyssal cooling or an expansion of polar ice volume.',
      'Compounding this ambiguity is the hazard of post-depositional diagenesis. Over millions of years, pore-water percolation and burial pressure can induce recrystallization of delicate carbonate tests, overwriting the primary paleoenvironmental signature with the isotopic composition of deeper sediment fluids. Consequently, contemporary paleothermometry increasingly pairs oxygen isotope analysis with independent trace-element ratios—such as magnesium-to-calcium—and clumped-isotope thermometry to disentangle ice-volume artifacts from genuine thermal shifts.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'v-c1-02-1',
        word: 'negligible',
        partOfSpeech: 'adjective',
        simpleDefinition: 'So small or brief that it is barely worth considering.',
        contextMeaning: 'A tiny fraction of time compared with millions of years of Earth’s history.',
        exampleSentence: 'The temperature sensor had a negligible margin of error.',
        synonyms: ['insignificant', 'minimal', 'tiny'],
        originalSentence: 'Direct instrumental records of atmospheric and oceanic temperature extend back scarcely a century and a half, a negligible interval when weighed against Earth’s multimillion-year climatic oscillations.',
        arabicTranslation: 'ضئيل لا يُذكر'
      },
      {
        id: 'v-c1-02-2',
        word: 'oscillations',
        partOfSpeech: 'noun',
        simpleDefinition: 'Regular swings or changes back and forth between two states.',
        contextMeaning: 'Repeated cycles of warming and cooling across Earth’s history.',
        exampleSentence: 'Seasonal oscillations in rainfall affect river navigation.',
        synonyms: ['fluctuations', 'cycles', 'swings'],
        originalSentence: 'Direct instrumental records of atmospheric and oceanic temperature extend back scarcely a century and a half, a negligible interval when weighed against Earth’s multimillion-year climatic oscillations.',
        arabicTranslation: 'تذبذبات / تقلبات دورية'
      },
      {
        id: 'v-c1-02-3',
        word: 'proxies',
        partOfSpeech: 'noun',
        simpleDefinition: 'Indirect measurements used to stand in for something that cannot be measured directly.',
        contextMeaning: 'Natural chemical clues in fossils that reveal past temperatures.',
        exampleSentence: 'Tree rings serve as reliable proxies for historical rainfall.',
        synonyms: ['indicators', 'substitutes', 'surrogates'],
        originalSentence: 'To reconstruct thermal regimes of the Cenozoic Era, paleoclimatologists rely on geochemical proxies—measurable chemical signatures preserved in biogenic sediments that covary predictably with environmental parameters at the time of mineralization.',
        arabicTranslation: 'مؤشرات بديلة'
      },
      {
        id: 'v-c1-02-4',
        word: 'covary',
        partOfSpeech: 'verb',
        simpleDefinition: 'To change together in a consistent, connected way.',
        contextMeaning: 'When chemical ratios in shells shift in step with ocean temperature changes.',
        exampleSentence: 'Atmospheric pressure and altitude covary predictably.',
        synonyms: ['correlate', 'vary together'],
        originalSentence: 'To reconstruct thermal regimes of the Cenozoic Era, paleoclimatologists rely on geochemical proxies—measurable chemical signatures preserved in biogenic sediments that covary predictably with environmental parameters at the time of mineralization.',
        arabicTranslation: 'يتغير بالتلازم'
      },
      {
        id: 'v-c1-02-5',
        word: 'precipitate',
        partOfSpeech: 'verb',
        simpleDefinition: 'To form a solid substance out of a liquid solution.',
        contextMeaning: 'When marine organisms build solid mineral shells out of dissolved chemicals in seawater.',
        exampleSentence: 'Dissolved minerals precipitate around hydrothermal vents.',
        synonyms: ['crystallize', 'solidify', 'deposit'],
        originalSentence: 'As these organisms precipitate their shells from ambient seawater, the ratio of heavy oxygen-18 to light oxygen-16 incorporated into the crystal lattice is governed by thermodynamic fractionation: colder water favors the uptake of the heavier isotope.',
        arabicTranslation: 'يُرسِّب (مادة صلبة من محلول)'
      },
      {
        id: 'v-c1-02-6',
        word: 'confounding',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Causing confusion by mixing two separate effects together.',
        contextMeaning: 'An extra factor (ice volume) that makes it hard to tell what caused the oxygen ratio to change.',
        exampleSentence: 'Researchers controlled for confounding lifestyle factors in the clinical trial.',
        synonyms: ['complicating', 'misleading', 'interfering'],
        originalSentence: 'However, interpreting this isotopic signal is complicated by a confounding variable.',
        arabicTranslation: 'مُربك / متداخل'
      },
      {
        id: 'v-c1-02-7',
        word: 'sequester',
        partOfSpeech: 'verb',
        simpleDefinition: 'To take in and lock away a substance so it cannot circulate freely.',
        contextMeaning: 'When giant ice sheets trap light oxygen molecules on land for thousands of years.',
        exampleSentence: 'Peat bogs sequester massive amounts of organic carbon.',
        synonyms: ['lock away', 'isolate', 'store'],
        originalSentence: 'Because continental ice sheets preferentially sequester light oxygen-16 from the hydrological cycle, an enrichment of oxygen-18 in marine sediments may reflect either abyssal cooling or an expansion of polar ice volume.',
        arabicTranslation: 'يعزل / يحتجز'
      },
      {
        id: 'v-c1-02-8',
        word: 'diagenesis',
        partOfSpeech: 'noun',
        simpleDefinition: 'Physical and chemical changes that happen to sediments after they are buried.',
        contextMeaning: 'Chemical alteration of buried fossil shells that can ruin their original temperature record.',
        exampleSentence: 'Microscopic imaging revealed that the fossil had undergone minimal diagenesis.',
        synonyms: ['post-burial alteration', 'mineral transformation'],
        originalSentence: 'Compounding this ambiguity is the hazard of post-depositional diagenesis.',
        arabicTranslation: 'التحور الصخري بعد الترسيب'
      },
      {
        id: 'v-c1-02-9',
        word: 'disentangle',
        partOfSpeech: 'verb',
        simpleDefinition: 'To separate things that have become twisted or mixed together.',
        contextMeaning: 'To clearly separate the effect of polar ice growth from the effect of ocean temperature.',
        exampleSentence: 'Auditors worked to disentangle the company’s international accounts.',
        synonyms: ['separate', 'unravel', 'distinguish'],
        originalSentence: 'Consequently, contemporary paleothermometry increasingly pairs oxygen isotope analysis with independent trace-element ratios—such as magnesium-to-calcium—and clumped-isotope thermometry to disentangle ice-volume artifacts from genuine thermal shifts.',
        arabicTranslation: 'يفك تشابك / يفصل بين'
      }
    ],
    questions: [
      {
        id: 'q-c1-02-1',
        type: 'multiple_choice',
        prompt: 'Why is the oxygen-18 to oxygen-16 ratio in foraminifera shells considered ambiguous on its own?',
        options: [
          'Higher oxygen-18 levels can be caused by either colder ocean water or larger continental ice sheets',
          'Foraminifera only grow shells during brief volcanic eruptions',
          'Oxygen-18 decays radioactively within a few hundred years',
          'Benthic foraminifera float on the ocean surface rather than living on the seafloor'
        ],
        correctAnswer: 'Higher oxygen-18 levels can be caused by either colder ocean water or larger continental ice sheets',
        explanation: 'Paragraph 2 explains that continental ice sheets sequester light oxygen-16, so marine oxygen-18 enrichment may reflect either abyssal cooling or polar ice expansion.',
        passageEvidence: 'an enrichment of oxygen-18 in marine sediments may reflect either abyssal cooling or an expansion of polar ice volume.'
      },
      {
        id: 'q-c1-02-2',
        type: 'true_false_not_given',
        prompt: 'Post-depositional diagenesis can overwrite the original chemical signature of buried carbonate shells.',
        options: ['True', 'False', 'Not Given'],
        correctAnswer: 'True',
        explanation: 'Paragraph 3 states that pore-water percolation and burial pressure can induce recrystallization, overwriting the primary paleoenvironmental signature.',
        passageEvidence: 'overwriting the primary paleoenvironmental signature with the isotopic composition of deeper sediment fluids.'
      },
      {
        id: 'q-c1-02-3',
        type: 'sentence_completion',
        prompt: 'Scientists combine oxygen isotope measurements with trace-element ratios such as _______ to separate ice-volume effects from temperature changes.',
        correctAnswer: 'magnesium-to-calcium',
        acceptedAnswers: ['magnesium-to-calcium', 'magnesium to calcium'],
        explanation: 'Paragraph 3 states that paleothermometry pairs oxygen isotope analysis with independent trace-element ratios such as magnesium-to-calcium.',
        passageEvidence: 'pairs oxygen isotope analysis with independent trace-element ratios—such as magnesium-to-calcium'
      },
      {
        id: 'q-c1-02-4',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 2, the word "sequester" is closest in meaning to:',
        options: [
          'Capture and store away',
          'Evaporate into the upper atmosphere',
          'Warm up rapidly',
          'Dissolve into abyssal currents'
        ],
        correctAnswer: 'Capture and store away',
        explanation: '"Sequester" refers to continental ice sheets trapping light oxygen-16 out of the ocean water cycle.',
        passageEvidence: 'Because continental ice sheets preferentially sequester light oxygen-16 from the hydrological cycle'
      },
      {
        id: 'q-c1-02-5',
        type: 'multiple_choice',
        prompt: 'Under thermodynamic fractionation, what happens when seawater becomes colder?',
        options: [
          'Foraminifera shells incorporate a higher proportion of the heavier oxygen-18 isotope',
          'Foraminifera cease precipitating calcium carbonate altogether',
          'Light oxygen-16 sinks to the abyssal seafloor',
          'Magnesium completely replaces calcium in the shell lattice'
        ],
        correctAnswer: 'Foraminifera shells incorporate a higher proportion of the heavier oxygen-18 isotope',
        explanation: 'Paragraph 2 explicitly notes that "colder water favors the uptake of the heavier isotope."',
        passageEvidence: 'colder water favors the uptake of the heavier isotope.'
      }
    ]
  },
  {
    id: 'c1-03-predictive-processing-cognition',
    title: 'Predictive Processing and the Bayesian Brain Hypothesis',
    level: 'C1',
    topic: 'Psychology and human behaviour',
    estimatedMinutes: 14,
    status: 'published',
    generationBatch: 'batch-5-c1',
    imageStatus: 'ready',
    introduction: 'How contemporary cognitive neuroscience models perception not as passive feature detection, but as active hypothesis testing that minimizes prediction error.',
    createdAt: '2026-01-15T12:00:00Z',
    updatedAt: '2026-01-15T12:00:00Z',
    illustrationAlt: 'Editorial illustration of hierarchical cortical feedback loops and sensory signals',
    passage: [
      'Classical accounts of perception portrayed the cerebral cortex as a passive, feed-forward assembly line: sensory receptors transduce external stimuli into neural impulses, which ascend a hierarchy of feature detectors to construct an internal representation of the world. Over the past two decades, however, this bottom-up orthodoxy has been largely supplanted by the predictive processing framework. Under this view, the brain is an active inference engine that continuously generates top-down probabilistic models of its environment before sensory data even arrive.',
      'Central to this architecture is the minimization of prediction error. Higher cortical regions project expectations downward to lower sensory areas; ascending pathways, rather than transmitting raw perceptual content, convey only the residual discrepancy between what was predicted and what was actually encountered. When prediction errors are small, top-down priors prevail and minimal metabolic effort is expended. When a salient mismatch occurs, the error signal propagates upward, compelling the brain to revise its internal generative model.',
      'Crucially, the influence of any given error signal is modulated by "precision weighting"—the brain’s estimate of how reliable a sensory channel is relative to prior beliefs. In a fog-shrouded street, visual precision is downgraded, prompting perception to lean heavily on prior expectations; conversely, in a brightly lit unfamiliar environment, sensory precision is amplified. Disturbances in this delicate balancing act have been implicated in clinical phenomena: an over-reliance on rigid priors or an aberrant assignment of high precision to random neural noise may underlie perceptual hallucinations.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'v-c1-03-1',
        word: 'transduce',
        partOfSpeech: 'verb',
        simpleDefinition: 'To convert one form of energy or signal into another.',
        contextMeaning: 'When the eyes or ears convert light or sound waves into electrical nerve signals.',
        exampleSentence: 'Hair cells in the inner ear transduce mechanical vibrations into electrical impulses.',
        synonyms: ['convert', 'transform', 'translate'],
        originalSentence: 'Classical accounts of perception portrayed the cerebral cortex as a passive, feed-forward assembly line: sensory receptors transduce external stimuli into neural impulses, which ascend a hierarchy of feature detectors to construct an internal representation of the world.',
        arabicTranslation: 'يُحوِّل (الطاقة أو الإشارة)'
      },
      {
        id: 'v-c1-03-2',
        word: 'orthodoxy',
        partOfSpeech: 'noun',
        simpleDefinition: 'A widely accepted traditional belief or theory in a field.',
        contextMeaning: 'The older, standard textbook theory of how visual perception works.',
        exampleSentence: 'New fossil evidence challenged the prevailing orthodoxy in evolutionary biology.',
        synonyms: ['conventional wisdom', 'doctrine', 'tradition'],
        originalSentence: 'Over the past two decades, however, this bottom-up orthodoxy has been largely supplanted by the predictive processing framework.',
        arabicTranslation: 'المعتقد السائد / النظرية التقليدية'
      },
      {
        id: 'v-c1-03-3',
        word: 'supplanted',
        partOfSpeech: 'verb',
        simpleDefinition: 'Replaced an older idea, system, or thing that has become less useful.',
        contextMeaning: 'Overtaken and replaced by the newer predictive processing theory.',
        exampleSentence: 'Digital photography rapidly supplanted chemical film in journalism.',
        synonyms: ['replaced', 'succeeded', 'displaced'],
        originalSentence: 'Over the past two decades, however, this bottom-up orthodoxy has been largely supplanted by the predictive processing framework.',
        arabicTranslation: 'حلَّ محلَّ / أزاح'
      },
      {
        id: 'v-c1-03-4',
        word: 'residual',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Remaining left over after the main part has been accounted for.',
        contextMeaning: 'The leftover difference between what the brain expected and what the senses detected.',
        exampleSentence: 'Instruments measured the residual heat radiating from the volcanic rock.',
        synonyms: ['remaining', 'leftover', 'unexplained'],
        originalSentence: 'Higher cortical regions project expectations downward to lower sensory areas; ascending pathways, rather than transmitting raw perceptual content, convey only the residual discrepancy between what was predicted and what was actually encountered.',
        arabicTranslation: 'متبقٍّ'
      },
      {
        id: 'v-c1-03-5',
        word: 'discrepancy',
        partOfSpeech: 'noun',
        simpleDefinition: 'A difference or mismatch between two things that should be the same.',
        contextMeaning: 'The gap between the brain’s prediction and the actual sensory input.',
        exampleSentence: 'The auditor noticed a discrepancy between the invoice and the bank statement.',
        synonyms: ['mismatch', 'difference', 'inconsistency'],
        originalSentence: 'Higher cortical regions project expectations downward to lower sensory areas; ascending pathways, rather than transmitting raw perceptual content, convey only the residual discrepancy between what was predicted and what was actually encountered.',
        arabicTranslation: 'تفاوت / تعارض'
      },
      {
        id: 'v-c1-03-6',
        word: 'priors',
        partOfSpeech: 'noun',
        simpleDefinition: 'Existing expectations or beliefs formed from past experience before new evidence arrives.',
        contextMeaning: 'The brain’s pre-existing assumptions about what it is likely to see or hear.',
        exampleSentence: 'Bayesian statistics updates existing priors as new experimental data are collected.',
        synonyms: ['pre-existing expectations', 'baseline assumptions'],
        originalSentence: 'When prediction errors are small, top-down priors prevail and minimal metabolic effort is expended.',
        arabicTranslation: 'توقعات مسبقة / احتمالات قبلية'
      },
      {
        id: 'v-c1-03-7',
        word: 'salient',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Important, noticeable, or standing out clearly.',
        contextMeaning: 'A significant, unmistakable surprise in sensory input that cannot be ignored.',
        exampleSentence: 'The report summarized the most salient findings of the inquiry.',
        synonyms: ['prominent', 'notable', 'striking'],
        originalSentence: 'When a salient mismatch occurs, the error signal propagates upward, compelling the brain to revise its internal generative model.',
        arabicTranslation: 'بارز / لافت'
      },
      {
        id: 'v-c1-03-8',
        word: 'modulated',
        partOfSpeech: 'verb',
        simpleDefinition: 'Adjusted or regulated in strength or proportion.',
        contextMeaning: 'Tuned up or down depending on how trustworthy the sensory signal is.',
        exampleSentence: 'The immune response is modulated by chemical signaling proteins.',
        synonyms: ['regulated', 'adjusted', 'tuned'],
        originalSentence: 'Crucially, the influence of any given error signal is modulated by "precision weighting"—the brain’s estimate of how reliable a sensory channel is relative to prior beliefs.',
        arabicTranslation: 'مُعدَّل / مُنظَّم'
      },
      {
        id: 'v-c1-03-9',
        word: 'aberrant',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Departing from what is normal, usual, or expected, often in a harmful way.',
        contextMeaning: 'Faulty or abnormal weighting of random brain signals.',
        exampleSentence: 'Researchers studied how aberrant cell division leads to tumors.',
        synonyms: ['abnormal', 'atypical', 'anomalous'],
        originalSentence: 'Disturbances in this delicate balancing act have been implicated in clinical phenomena: an over-reliance on rigid priors or an aberrant assignment of high precision to random neural noise may underlie perceptual hallucinations.',
        arabicTranslation: 'شاذ / غير سوي'
      }
    ],
    questions: [
      {
        id: 'q-c1-03-1',
        type: 'multiple_choice',
        prompt: 'According to the predictive processing framework, what do ascending neural pathways primarily transmit to higher cortical areas?',
        options: [
          'Only the residual mismatch between predicted expectations and actual sensory input',
          'A complete, unedited pixel-by-pixel recording of the external environment',
          'Motor commands intended for skeletal muscles',
          'Historical memories from early childhood'
        ],
        correctAnswer: 'Only the residual mismatch between predicted expectations and actual sensory input',
        explanation: 'Paragraph 2 states that ascending pathways convey only the residual discrepancy between what was predicted and what was actually encountered.',
        passageEvidence: 'ascending pathways, rather than transmitting raw perceptual content, convey only the residual discrepancy between what was predicted and what was actually encountered.'
      },
      {
        id: 'q-c1-03-2',
        type: 'true_false_not_given',
        prompt: 'When someone walks down a foggy street with poor visibility, their brain increases the precision weight given to incoming visual signals.',
        options: ['True', 'False', 'Not Given'],
        correctAnswer: 'False',
        explanation: 'Paragraph 3 states that in a fog-shrouded street, visual precision is downgraded, prompting perception to lean heavily on prior expectations.',
        passageEvidence: 'In a fog-shrouded street, visual precision is downgraded, prompting perception to lean heavily on prior expectations'
      },
      {
        id: 'q-c1-03-3',
        type: 'sentence_completion',
        prompt: 'The brain’s estimate of how trustworthy a sensory signal is compared with prior beliefs is referred to as _______.',
        correctAnswer: 'precision weighting',
        acceptedAnswers: ['precision weighting'],
        explanation: 'Paragraph 3 defines "precision weighting" as the brain’s estimate of how reliable a sensory channel is relative to prior beliefs.',
        passageEvidence: 'modulated by "precision weighting"—the brain’s estimate of how reliable a sensory channel is relative to prior beliefs.'
      },
      {
        id: 'q-c1-03-4',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 1, the word "supplanted" is closest in meaning to:',
        options: [
          'Replaced',
          'Confirmed',
          'Simplified',
          'Forgotten'
        ],
        correctAnswer: 'Replaced',
        explanation: 'The older bottom-up orthodoxy has been replaced ("supplanted") by the predictive processing framework.',
        passageEvidence: 'this bottom-up orthodoxy has been largely supplanted by the predictive processing framework.'
      },
      {
        id: 'q-c1-03-5',
        type: 'multiple_choice',
        prompt: 'How does the passage explain the potential origin of perceptual hallucinations?',
        options: [
          'An imbalance where rigid priors dominate or high precision is mistakenly assigned to random neural noise',
          'A complete shutdown of the top-down prefrontal cortex during sleep',
          'Physical damage to the retina caused by bright light',
          'An inability of sensory receptors to transduce sound waves'
        ],
        correctAnswer: 'An imbalance where rigid priors dominate or high precision is mistakenly assigned to random neural noise',
        explanation: 'Paragraph 3 notes that over-reliance on rigid priors or aberrant assignment of high precision to random neural noise may underlie hallucinations.',
        passageEvidence: 'an over-reliance on rigid priors or an aberrant assignment of high precision to random neural noise may underlie perceptual hallucinations.'
      }
    ]
  },
  {
    id: 'c1-04-bronze-age-collapse-systems',
    title: 'Systemic Fragility and the Late Bronze Age Collapse',
    level: 'C1',
    topic: 'History and archaeology',
    estimatedMinutes: 14,
    status: 'published',
    generationBatch: 'batch-5-c1',
    imageStatus: 'ready',
    introduction: 'Why the hyper-connected palace economies of the Eastern Mediterranean around 1200 BCE disintegrated through a cascade of interlocking stressors.',
    createdAt: '2026-01-15T12:00:00Z',
    updatedAt: '2026-01-15T12:00:00Z',
    illustrationAlt: 'Editorial illustration of ancient Mediterranean trade routes and fractured ceramic tablets',
    passage: [
      'During the fourteenth and thirteenth centuries BCE, the Eastern Mediterranean hosted one of antiquity’s most cosmopolitan geopolitical networks. Mycenaean Greece, the Hittite Empire in Anatolia, New Kingdom Egypt, and the Levantine city-states were bound together by dynastic marriages, reciprocal gift exchange, and long-distance maritime trade in copper from Cyprus and tin from as far afield as Central Asia. Yet within scarcely five decades around 1200 BCE, this palace-centered civilization suffered a catastrophic, near-synchronous collapse from which literacy and monumental architecture in several regions did not recover for centuries.',
      'Earlier historiography sought a single proximate culprit—most famously the enigmatic "Sea Peoples" depicted on the mortuary temple of Ramesses III at Medinet Habu, or alternatively a cluster of devastating tectonic "earthquake storms." Contemporary archaeological synthesis, informed by complexity theory, rejects monocausal explanations. High-resolution palynological cores from Dead Sea and coastal lagoons, alongside oxygen-isotope records from speleothems, now point to a protracted megadrought lasting multiple generations that undermined the agrarian surplus on which redistributive palace bureaucracies depended.',
      'Crucially, the very hyper-specialization and tight coupling that generated prosperity during stable eras rendered these Bronze Age polities brittle under compound stress. Because palace administrations centrally requisitioned grain, textiles, and metallurgical inputs, a disruption in one node—whether famine in Anatolia, piracy severing tin shipments in the Aegean, or internal peasant rebellions—propagated rapidly across the entire network. Rather than an external invasion toppling a resilient civilization, the Late Bronze Age collapse exemplifies a systems failure in which mutually reinforcing shocks overwhelmed institutional capacity.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'v-c1-04-1',
        word: 'cosmopolitan',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Involving people, cultures, and trade connections from many different parts of the world.',
        contextMeaning: 'Internationally connected through diplomacy and trade across the Mediterranean.',
        exampleSentence: 'Alexandria was a cosmopolitan center of scholarship in the ancient world.',
        synonyms: ['internationally connected', 'worldly', 'diverse'],
        originalSentence: 'During the fourteenth and thirteenth centuries BCE, the Eastern Mediterranean hosted one of antiquity’s most cosmopolitan geopolitical networks.',
        arabicTranslation: 'عالمي الطابع / متعدد الثقافات'
      },
      {
        id: 'v-c1-04-2',
        word: 'reciprocal',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Given and received in return by two sides equally.',
        contextMeaning: 'Mutual gift exchanges between royal courts to cement alliances.',
        exampleSentence: 'The two nations signed a reciprocal trade agreement.',
        synonyms: ['mutual', 'two-way', 'shared'],
        originalSentence: 'Mycenaean Greece, the Hittite Empire in Anatolia, New Kingdom Egypt, and the Levantine city-states were bound together by dynastic marriages, reciprocal gift exchange, and long-distance maritime trade in copper from Cyprus and tin from as far afield as Central Asia.',
        arabicTranslation: 'متبادل'
      },
      {
        id: 'v-c1-04-3',
        word: 'historiography',
        partOfSpeech: 'noun',
        simpleDefinition: 'The study of how historians have written and interpreted history over time.',
        contextMeaning: 'Earlier generations of historical scholarship about the Bronze Age collapse.',
        exampleSentence: 'Modern historiography pays closer attention to climate data and ordinary workers.',
        synonyms: ['historical scholarship', 'historical writing'],
        originalSentence: 'Earlier historiography sought a single proximate culprit—most famously the enigmatic "Sea Peoples" depicted on the mortuary temple of Ramesses III at Medinet Habu, or alternatively a cluster of devastating tectonic "earthquake storms."',
        arabicTranslation: 'التأريخ / علم كتابة التاريخ'
      },
      {
        id: 'v-c1-04-4',
        word: 'proximate',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Closest in time or direct action to an event, as opposed to deeper underlying causes.',
        contextMeaning: 'A single immediate trigger blamed for the collapse.',
        exampleSentence: 'Investigators distinguished the proximate cause of the fire from long-term safety neglect.',
        synonyms: ['immediate', 'direct'],
        originalSentence: 'Earlier historiography sought a single proximate culprit—most famously the enigmatic "Sea Peoples" depicted on the mortuary temple of Ramesses III at Medinet Habu, or alternatively a cluster of devastating tectonic "earthquake storms."',
        arabicTranslation: 'مباشر / قريب'
      },
      {
        id: 'v-c1-04-5',
        word: 'monocausal',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Explaining a complex event as having only one single cause.',
        contextMeaning: 'The oversimplified idea that just one factor (such as invaders alone) destroyed the Bronze Age kingdoms.',
        exampleSentence: 'Historians rarely accept monocausal explanations for major revolutions.',
        synonyms: ['single-cause', 'one-dimensional'],
        originalSentence: 'Contemporary archaeological synthesis, informed by complexity theory, rejects monocausal explanations.',
        arabicTranslation: 'أحادي السبب'
      },
      {
        id: 'v-c1-04-6',
        word: 'protracted',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Lasting for a very long time, often longer than expected.',
        contextMeaning: 'A severe drought that stretched across several human generations.',
        exampleSentence: 'A protracted legal dispute delayed construction of the bridge.',
        synonyms: ['prolonged', 'extended', 'long-lasting'],
        originalSentence: 'High-resolution palynological cores from Dead Sea and coastal lagoons, alongside oxygen-isotope records from speleothems, now point to a protracted megadrought lasting multiple generations that undermined the agrarian surplus on which redistributive palace bureaucracies depended.',
        arabicTranslation: 'مطوَّل / ممتد'
      },
      {
        id: 'v-c1-04-7',
        word: 'polities',
        partOfSpeech: 'noun',
        simpleDefinition: 'Organized political states, kingdoms, or societies.',
        contextMeaning: 'The kingdoms and empires of the Late Bronze Age.',
        exampleSentence: 'Ancient Mesoamerica contained dozens of competing city-state polities.',
        synonyms: ['states', 'kingdoms', 'governments'],
        originalSentence: 'Crucially, the very hyper-specialization and tight coupling that generated prosperity during stable eras rendered these Bronze Age polities brittle under compound stress.',
        arabicTranslation: 'كيانات سياسية / دول'
      },
      {
        id: 'v-c1-04-8',
        word: 'brittle',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Rigid and likely to snap or shatter suddenly when put under stress.',
        contextMeaning: 'Unable to adapt flexibly when multiple crises hit at the same time.',
        exampleSentence: 'Overly centralized supply chains proved brittle during the global port closure.',
        synonyms: ['fragile', 'inflexible', 'vulnerable'],
        originalSentence: 'Crucially, the very hyper-specialization and tight coupling that generated prosperity during stable eras rendered these Bronze Age polities brittle under compound stress.',
        arabicTranslation: 'هشّ / سريع الانكسار'
      },
      {
        id: 'v-c1-04-9',
        word: 'propagated',
        partOfSpeech: 'verb',
        simpleDefinition: 'Spread outward through a system from one point to another.',
        contextMeaning: 'When a shock in one kingdom spread like a chain reaction across all trading partners.',
        exampleSentence: 'Shockwaves from the tremor propagated through the bedrock.',
        synonyms: ['spread', 'transmitted', 'cascaded'],
        originalSentence: 'Because palace administrations centrally requisitioned grain, textiles, and metallurgical inputs, a disruption in one node—whether famine in Anatolia, piracy severing tin shipments in the Aegean, or internal peasant rebellions—propagated rapidly across the entire network.',
        arabicTranslation: 'انتشر / امتدت آثاره'
      }
    ],
    questions: [
      {
        id: 'q-c1-04-1',
        type: 'multiple_choice',
        prompt: 'How does modern archaeological synthesis differ from earlier historiography regarding the Late Bronze Age collapse?',
        options: [
          'It rejects single-cause explanations in favor of an interconnected systems failure involving drought, trade disruption, and social unrest',
          'It proves that the Sea Peoples never existed and were invented in the nineteenth century',
          'It attributes the collapse exclusively to a single volcanic eruption in Central Asia',
          'It argues that literacy actually expanded during the twelfth century BCE'
        ],
        correctAnswer: 'It rejects single-cause explanations in favor of an interconnected systems failure involving drought, trade disruption, and social unrest',
        explanation: 'Paragraphs 2 and 3 explain that contemporary synthesis rejects monocausal explanations and views the collapse as a systems failure driven by megadrought, trade breakdown, and rebellions.',
        passageEvidence: 'Contemporary archaeological synthesis, informed by complexity theory, rejects monocausal explanations.'
      },
      {
        id: 'q-c1-04-2',
        type: 'true_false_not_given',
        prompt: 'Bronze production in the Eastern Mediterranean depended on copper from Cyprus and tin imported from distant regions such as Central Asia.',
        options: ['True', 'False', 'Not Given'],
        correctAnswer: 'True',
        explanation: 'Paragraph 1 explicitly mentions long-distance maritime trade in copper from Cyprus and tin from as far afield as Central Asia.',
        passageEvidence: 'long-distance maritime trade in copper from Cyprus and tin from as far afield as Central Asia.'
      },
      {
        id: 'q-c1-04-3',
        type: 'sentence_completion',
        prompt: 'Pollen cores and cave deposits indicate that a multi-generational _______ weakened the agricultural surplus supporting palace bureaucracies.',
        correctAnswer: 'megadrought',
        acceptedAnswers: ['megadrought', 'protracted megadrought'],
        explanation: 'Paragraph 2 states that records point to a protracted megadrought lasting multiple generations that undermined the agrarian surplus.',
        passageEvidence: 'now point to a protracted megadrought lasting multiple generations that undermined the agrarian surplus'
      },
      {
        id: 'q-c1-04-4',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 3, calling the Bronze Age states "brittle" means they were:',
        options: [
          'Inflexible and prone to sudden systemic breakdown under combined pressures',
          'Constructed out of weak limestone',
          'Lacking any form of written record-keeping',
          'Isolated from all foreign diplomatic contact'
        ],
        correctAnswer: 'Inflexible and prone to sudden systemic breakdown under combined pressures',
        explanation: '"Brittle" describes how hyper-specialized, tightly coupled systems shatter when exposed to compound stress.',
        passageEvidence: 'rendered these Bronze Age polities brittle under compound stress.'
      },
      {
        id: 'q-c1-04-5',
        type: 'multiple_choice',
        prompt: 'Why did a crisis in one kingdom spread so quickly to other kingdoms around 1200 BCE?',
        options: [
          'Tight coupling and centralized palace control meant that a disruption in one trade or agricultural node cascaded across the whole network',
          'All Mediterranean kingdoms shared a single ruler and capital city',
          'Paper currency lost its value across European banks',
          'Nomadic armies used railways to cross Anatolia'
        ],
        correctAnswer: 'Tight coupling and centralized palace control meant that a disruption in one trade or agricultural node cascaded across the whole network',
        explanation: 'Paragraph 3 explains that tight coupling and centralized requisitioning caused a disruption in one node to propagate rapidly across the network.',
        passageEvidence: 'a disruption in one node—whether famine in Anatolia, piracy severing tin shipments in the Aegean, or internal peasant rebellions—propagated rapidly across the entire network.'
      }
    ]
  },
  {
    id: 'c1-05-epistemic-cognition-education',
    title: 'Epistemic Cognition and the Expertise Reversal Effect in Instructional Design',
    level: 'C1',
    topic: 'Education and learning',
    estimatedMinutes: 14,
    status: 'published',
    generationBatch: 'batch-5-c1',
    imageStatus: 'ready',
    introduction: 'Why instructional scaffolding that benefits novices actively impedes advanced learners, and how learners transition toward sophisticated epistemic beliefs.',
    createdAt: '2026-01-15T12:00:00Z',
    updatedAt: '2026-01-15T12:00:00Z',
    illustrationAlt: 'Editorial illustration of cognitive scaffolding arches transitioning into open inquiry',
    passage: [
      'A foundational tenet of cognitive load theory is that human working memory is severely constrained in both capacity and duration when processing novel, unorganized information. For novice learners who lack pre-existing mental schemas in long-term memory, unguided discovery tasks frequently induce cognitive overload: working memory is exhausted by superficial search strategies, leaving scant bandwidth for schema acquisition. Consequently, explicit worked examples and step-by-step scaffolding reliably outperform open-ended problem solving during the initial stages of skill acquisition.',
      'Paradoxically, however, these very pedagogical supports cease to be neutral—and can become actively detrimental—as learners attain domain proficiency. Known as the "expertise reversal effect," this phenomenon occurs when an experienced learner, who has already consolidated complex procedures into automated long-term schemas, is forced to process redundant step-by-step explanations. Cross-referencing their internal schema against externally imposed elementary steps consumes precious working-memory resources, depressing performance relative to unassisted problem solving.',
      'Managing this transition requires more than calibrating task difficulty; it also entails cultivating "epistemic cognition"—how individuals conceive of the nature of knowledge and the process of justification. Novices often exhibit absolutist epistemic beliefs, viewing academic knowledge as a static inventory of indisputable facts dispensed by authority. Advanced inquiry, by contrast, demands an evaluativist stance: recognizing that competing theoretical claims must be weighed comparatively against empirical evidence, methodological rigor, and contextual constraints.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'v-c1-05-1',
        word: 'tenet',
        partOfSpeech: 'noun',
        simpleDefinition: 'A core principle or belief on which a theory is built.',
        contextMeaning: 'A fundamental principle of cognitive load theory.',
        exampleSentence: 'Peer review is a central tenet of modern scientific publishing.',
        synonyms: ['principle', 'foundation', 'premise'],
        originalSentence: 'A foundational tenet of cognitive load theory is that human working memory is severely constrained in both capacity and duration when processing novel, unorganized information.',
        arabicTranslation: 'مبدأ أساسي / ركيزة'
      },
      {
        id: 'v-c1-05-2',
        word: 'scant',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Very little and not enough for what is needed.',
        contextMeaning: 'Almost no remaining mental capacity for actual learning.',
        exampleSentence: 'There was scant evidence to support the witness’s claim.',
        synonyms: ['minimal', 'meager', 'insufficient'],
        originalSentence: 'For novice learners who lack pre-existing mental schemas in long-term memory, unguided discovery tasks frequently induce cognitive overload: working memory is exhausted by superficial search strategies, leaving scant bandwidth for schema acquisition.',
        arabicTranslation: 'شحيح / ضئيل جداً'
      },
      {
        id: 'v-c1-05-3',
        word: 'scaffolding',
        partOfSpeech: 'noun',
        simpleDefinition: 'Temporary instructional support given to students while they learn a new concept.',
        contextMeaning: 'Structured guidance and worked examples that help beginners solve problems.',
        exampleSentence: 'The teacher provided sentence templates as scaffolding for essay writing.',
        synonyms: ['instructional support', 'structured guidance'],
        originalSentence: 'Consequently, explicit worked examples and step-by-step scaffolding reliably outperform open-ended problem solving during the initial stages of skill acquisition.',
        arabicTranslation: 'دعم تعليمي مرحلي (سقالات معرفية)'
      },
      {
        id: 'v-c1-05-4',
        word: 'detrimental',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Causing harm, damage, or worse results.',
        contextMeaning: 'Slowing down or hurting the performance of advanced students.',
        exampleSentence: 'Chronic sleep deprivation is detrimental to memory consolidation.',
        synonyms: ['harmful', 'counterproductive', 'damaging'],
        originalSentence: 'Paradoxically, however, these very pedagogical supports cease to be neutral—and can become actively detrimental—as learners attain domain proficiency.',
        arabicTranslation: 'ضار / ذو أثر سلبي'
      },
      {
        id: 'v-c1-05-5',
        word: 'consolidated',
        partOfSpeech: 'verb',
        simpleDefinition: 'Combined and strengthened separate pieces into a single solid whole.',
        contextMeaning: 'Organized many small steps into one smooth, automatic mental skill in long-term memory.',
        exampleSentence: 'After months of practice, the violinist consolidated the complex fingering patterns.',
        synonyms: ['integrated', 'unified', 'solidified'],
        originalSentence: 'Known as the "expertise reversal effect," this phenomenon occurs when an experienced learner, who has already consolidated complex procedures into automated long-term schemas, is forced to process redundant step-by-step explanations.',
        arabicTranslation: 'دمج ورسَّخ'
      },
      {
        id: 'v-c1-05-6',
        word: 'redundant',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Unnecessary because the same thing is already provided or known.',
        contextMeaning: 'Basic explanations that an expert student already knows automatically.',
        exampleSentence: 'The editor deleted redundant adjectives from the manuscript.',
        synonyms: ['unnecessary', 'superfluous', 'repetitive'],
        originalSentence: 'Known as the "expertise reversal effect," this phenomenon occurs when an experienced learner, who has already consolidated complex procedures into automated long-term schemas, is forced to process redundant step-by-step explanations.',
        arabicTranslation: 'فائض عن الحاجة / مكرر بلا داعٍ'
      },
      {
        id: 'v-c1-05-7',
        word: 'calibrating',
        partOfSpeech: 'verb',
        simpleDefinition: 'Carefully adjusting something so it matches a specific level or requirement.',
        contextMeaning: 'Fine-tuning how difficult a learning task is for a student.',
        exampleSentence: 'Technicians spent the morning calibrating the laboratory scales.',
        synonyms: ['adjusting', 'fine-tuning', 'regulating'],
        originalSentence: 'Managing this transition requires more than calibrating task difficulty; it also entails cultivating "epistemic cognition"—how individuals conceive of the nature of knowledge and the process of justification.',
        arabicTranslation: 'معايرة / ضبط دقيق'
      },
      {
        id: 'v-c1-05-8',
        word: 'epistemic',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Relating to knowledge and how we determine whether something is true.',
        contextMeaning: 'Concerning how students understand what knowledge is and how claims are justified.',
        exampleSentence: 'Scientific literacy requires epistemic humility when data are incomplete.',
        synonyms: ['knowledge-related', 'cognitive'],
        originalSentence: 'Managing this transition requires more than calibrating task difficulty; it also entails cultivating "epistemic cognition"—how individuals conceive of the nature of knowledge and the process of justification.',
        arabicTranslation: 'معرفي / إبستمولوجي'
      },
      {
        id: 'v-c1-05-9',
        word: 'indisputable',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Impossible to doubt or argue against; completely certain.',
        contextMeaning: 'Fixed, unquestionable truths that beginners assume all textbooks contain.',
        exampleSentence: 'The satellite photographs provided indisputable proof of glacier retreat.',
        synonyms: ['unquestionable', 'undeniable', 'certain'],
        originalSentence: 'Novices often exhibit absolutist epistemic beliefs, viewing academic knowledge as a static inventory of indisputable facts dispensed by authority.',
        arabicTranslation: 'لا يقبل الجدل / قاطع'
      }
    ],
    questions: [
      {
        id: 'q-c1-05-1',
        type: 'multiple_choice',
        prompt: 'What is the "expertise reversal effect" described in Paragraph 2?',
        options: [
          'Detailed step-by-step guidance that helps beginners actually impairs advanced learners by overloading working memory with redundant information',
          'Expert professors forget how to solve elementary problems in their own academic field',
          'Beginners learn faster when given no instructions or worked examples at all',
          'Long-term memory automatically erases schemas after five years'
        ],
        correctAnswer: 'Detailed step-by-step guidance that helps beginners actually impairs advanced learners by overloading working memory with redundant information',
        explanation: 'Paragraph 2 explains that forcing experienced learners to process redundant step-by-step explanations consumes working memory and depresses performance.',
        passageEvidence: 'when an experienced learner, who has already consolidated complex procedures into automated long-term schemas, is forced to process redundant step-by-step explanations.'
      },
      {
        id: 'q-c1-05-2',
        type: 'true_false_not_given',
        prompt: 'Unguided discovery tasks are generally the most effective instructional method for complete novices learning unfamiliar material.',
        options: ['True', 'False', 'Not Given'],
        correctAnswer: 'False',
        explanation: 'Paragraph 1 states that for novice learners, unguided discovery tasks frequently induce cognitive overload, whereas worked examples outperform them.',
        passageEvidence: 'For novice learners who lack pre-existing mental schemas in long-term memory, unguided discovery tasks frequently induce cognitive overload'
      },
      {
        id: 'q-c1-05-3',
        type: 'sentence_completion',
        prompt: 'Learners with an _______ stance recognize that competing theories must be judged by comparing empirical evidence and methodological rigor.',
        correctAnswer: 'evaluativist',
        acceptedAnswers: ['evaluativist'],
        explanation: 'Paragraph 3 states that advanced inquiry demands an evaluativist stance.',
        passageEvidence: 'Advanced inquiry, by contrast, demands an evaluativist stance: recognizing that competing theoretical claims must be weighed comparatively'
      },
      {
        id: 'q-c1-05-4',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 2, the word "redundant" most nearly means:',
        options: [
          'Unnecessary because the learner has already mastered the steps',
          'Written in an unfamiliar foreign language',
          'Mathematically inaccurate',
          'Emotionally discouraging'
        ],
        correctAnswer: 'Unnecessary because the learner has already mastered the steps',
        explanation: '"Redundant" refers to elementary step-by-step instructions that are no longer needed once an expert has automated the schema.',
        passageEvidence: 'forced to process redundant step-by-step explanations.'
      },
      {
        id: 'q-c1-05-5',
        type: 'multiple_choice',
        prompt: 'How do learners with "absolutist" epistemic beliefs typically view academic knowledge?',
        options: [
          'As a fixed collection of unquestionable facts handed down by experts',
          'As a set of competing hypotheses that must be tested against empirical data',
          'As purely subjective personal opinions that cannot be evaluated',
          'As automated motor reflexes stored in the cerebellum'
        ],
        correctAnswer: 'As a fixed collection of unquestionable facts handed down by experts',
        explanation: 'Paragraph 3 states that novices with absolutist beliefs view knowledge as "a static inventory of indisputable facts dispensed by authority."',
        passageEvidence: 'viewing academic knowledge as a static inventory of indisputable facts dispensed by authority.'
      }
    ]
  },
  {
    id: 'c1-06-eusociality-inclusive-fitness',
    title: 'Kin Selection, Inclusive Fitness, and the Evolution of Eusociality',
    level: 'C1',
    topic: 'Biology and animal behaviour',
    estimatedMinutes: 14,
    status: 'published',
    generationBatch: 'batch-5-c1',
    imageStatus: 'ready',
    introduction: 'How W. D. Hamilton’s inclusive fitness theory resolved Darwin’s dilemma regarding sterile insect castes and why haplodiploidy is only part of the explanation.',
    createdAt: '2026-01-15T12:00:00Z',
    updatedAt: '2026-01-15T12:00:00Z',
    illustrationAlt: 'Editorial illustration of hymenopteran hexagonal cells and genetic relatedness pathways',
    passage: [
      'In On the Origin of Species, Charles Darwin identified the sterile worker castes of social insects as a "special difficulty" that initially appeared fatal to his theory of natural selection. If evolution operates through differential reproductive success, how could natural selection preserve morphological and behavioral traits—such as the barbed stinger of a honeybee worker—that entail obligatory sterility and self-sacrifice? For over a century, explanations relied on vague appeals to the survival of the colony as a whole.',
      'A rigorous mathematical resolution emerged in 1964 when W. D. Hamilton formulated the theory of inclusive fitness. Shifting the analytical lens from the individual organism to the gene, Hamilton demonstrated that an allele promoting altruistic behavior can proliferate if the reproductive cost to the actor is outweighed by the reproductive benefit conferred upon relatives, discounted by their coefficient of genetic relatedness. In hymenopteran insects—ants, bees, and wasps—a distinctive genetic system known as haplodiploidy, wherein males develop from unfertilized haploid eggs and females from fertilized diploid eggs, causes full sisters to share up to seventy-five percent of their genes, exceeding the fifty percent they would share with their own offspring.',
      'Subsequent empirical work, however, has tempered the claim that haplodiploidy alone drives eusociality. Several eusocial lineages, including termites, naked mole-rats, and snapping shrimp, are fully diploid, while the vast majority of haplodiploid species remain solitary. Contemporary evolutionary biology therefore views genetic relatedness as a necessary precondition that must act in concert with ecological pressures—such as the defense of high-value, expandable nests and lifetime parental monogamy—to cross the evolutionary threshold into obligate eusociality.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'v-c1-06-1',
        word: 'morphological',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Relating to the physical shape and structure of a living organism.',
        contextMeaning: 'Physical body features of worker insects, such as specialized jaws or stingers.',
        exampleSentence: 'Island birds often show rapid morphological changes in beak size.',
        synonyms: ['structural', 'anatomical', 'physical'],
        originalSentence: 'If evolution operates through differential reproductive success, how could natural selection preserve morphological and behavioral traits—such as the barbed stinger of a honeybee worker—that entail obligatory sterility and self-sacrifice?',
        arabicTranslation: 'شكلي / تشريحي'
      },
      {
        id: 'v-c1-06-2',
        word: 'obligatory',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Fixed by nature or rule so that it cannot be avoided or changed.',
        contextMeaning: 'Permanent biological inability to reproduce among sterile worker castes.',
        exampleSentence: 'Certain parasites have an obligatory dependence on a single host species.',
        synonyms: ['mandatory', 'permanent', 'inescapable'],
        originalSentence: 'If evolution operates through differential reproductive success, how could natural selection preserve morphological and behavioral traits—such as the barbed stinger of a honeybee worker—that entail obligatory sterility and self-sacrifice?',
        arabicTranslation: 'إلزامي / حتمي'
      },
      {
        id: 'v-c1-06-3',
        word: 'altruistic',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Helping others at a cost or risk to oneself.',
        contextMeaning: 'Self-sacrificing behavior by sterile workers that helps the queen’s offspring survive.',
        exampleSentence: 'Meerkat sentries display altruistic behavior when warning the group of predators.',
        synonyms: ['self-sacrificing', 'cooperative', 'unselfish'],
        originalSentence: 'Shifting the analytical lens from the individual organism to the gene, Hamilton demonstrated that an allele promoting altruistic behavior can proliferate if the reproductive cost to the actor is outweighed by the reproductive benefit conferred upon relatives, discounted by their coefficient of genetic relatedness.',
        arabicTranslation: 'إيثاري (تفضيل الغير على النفس)'
      },
      {
        id: 'v-c1-06-4',
        word: 'proliferate',
        partOfSpeech: 'verb',
        simpleDefinition: 'To increase rapidly in number or spread widely.',
        contextMeaning: 'When a gene becomes more common across future generations of a population.',
        exampleSentence: 'Algae proliferate quickly in warm, nutrient-rich lakes.',
        synonyms: ['multiply', 'spread', 'increase'],
        originalSentence: 'Shifting the analytical lens from the individual organism to the gene, Hamilton demonstrated that an allele promoting altruistic behavior can proliferate if the reproductive cost to the actor is outweighed by the reproductive benefit conferred upon relatives, discounted by their coefficient of genetic relatedness.',
        arabicTranslation: 'يتكاثر / ينتشر بكثرة'
      },
      {
        id: 'v-c1-06-5',
        word: 'conferred',
        partOfSpeech: 'verb',
        simpleDefinition: 'Given or granted a benefit, advantage, or status.',
        contextMeaning: 'Survival and reproductive advantages provided to genetic relatives.',
        exampleSentence: 'Vaccination conferred long-lasting immunity against the virus.',
        synonyms: ['granted', 'provided', 'bestowed'],
        originalSentence: 'Shifting the analytical lens from the individual organism to the gene, Hamilton demonstrated that an allele promoting altruistic behavior can proliferate if the reproductive cost to the actor is outweighed by the reproductive benefit conferred upon relatives, discounted by their coefficient of genetic relatedness.',
        arabicTranslation: 'منح / أضفى'
      },
      {
        id: 'v-c1-06-6',
        word: 'tempered',
        partOfSpeech: 'verb',
        simpleDefinition: 'Made a strong claim more moderate, balanced, or cautious.',
        contextMeaning: 'Softened the earlier claim that haplodiploid genetics alone explains social insects.',
        exampleSentence: 'Initial optimism about the drug was tempered by larger clinical trials.',
        synonyms: ['moderated', 'qualified', 'restrained'],
        originalSentence: 'Subsequent empirical work, however, has tempered the claim that haplodiploidy alone drives eusociality.',
        arabicTranslation: 'لطَّف / خفَّف من غلوّ'
      },
      {
        id: 'v-c1-06-7',
        word: 'lineages',
        partOfSpeech: 'noun',
        simpleDefinition: 'Lines of evolutionary descent from a common ancestor.',
        contextMeaning: 'Distinct evolutionary branches of animals that independently evolved eusociality.',
        exampleSentence: 'Genetic sequencing traced the divergence of mammalian lineages.',
        synonyms: ['evolutionary branches', 'ancestries'],
        originalSentence: 'Several eusocial lineages, including termites, naked mole-rats, and snapping shrimp, are fully diploid, while the vast majority of haplodiploid species remain solitary.',
        arabicTranslation: 'سلالات تطورية'
      },
      {
        id: 'v-c1-06-8',
        word: 'solitary',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Living alone rather than in cooperative colonies or groups.',
        contextMeaning: 'Insect species that live and raise young individually without worker castes.',
        exampleSentence: 'Unlike honeybees, mason bees are solitary pollinators.',
        synonyms: ['lone', 'non-social', 'independent'],
        originalSentence: 'Several eusocial lineages, including termites, naked mole-rats, and snapping shrimp, are fully diploid, while the vast majority of haplodiploid species remain solitary.',
        arabicTranslation: 'انعزالي / منفرد المعيشة'
      },
      {
        id: 'v-c1-06-9',
        word: 'precondition',
        partOfSpeech: 'noun',
        simpleDefinition: 'Something that must exist first before another result can happen.',
        contextMeaning: 'A required starting factor (high relatedness) that must combine with ecological pressures.',
        exampleSentence: 'Soil moisture is a precondition for seed germination.',
        synonyms: ['prerequisite', 'requirement', 'foundation'],
        originalSentence: 'Contemporary evolutionary biology therefore views genetic relatedness as a necessary precondition that must act in concert with ecological pressures—such as the defense of high-value, expandable nests and lifetime parental monogamy—to cross the evolutionary threshold into obligate eusociality.',
        arabicTranslation: 'شرط مسبق'
      }
    ],
    questions: [
      {
        id: 'q-c1-06-1',
        type: 'multiple_choice',
        prompt: 'Why did sterile insect castes pose a "special difficulty" for Charles Darwin’s theory of natural selection?',
        options: [
          'Sterile workers do not leave direct offspring, making it unclear how their specialized traits could be passed down',
          'Fossils of social insects appeared before the first flowering plants',
          'Honeybees were domesticated by humans rather than evolving in the wild',
          'Worker insects live much longer than queens'
        ],
        correctAnswer: 'Sterile workers do not leave direct offspring, making it unclear how their specialized traits could be passed down',
        explanation: 'Paragraph 1 explains that if evolution works through differential reproductive success, it was puzzling how selection could preserve traits entailing obligatory sterility.',
        passageEvidence: 'If evolution operates through differential reproductive success, how could natural selection preserve morphological and behavioral traits—such as the barbed stinger of a honeybee worker—that entail obligatory sterility and self-sacrifice?'
      },
      {
        id: 'q-c1-06-2',
        type: 'true_false_not_given',
        prompt: 'Every animal species that exhibits eusociality possesses a haplodiploid genetic system.',
        options: ['True', 'False', 'Not Given'],
        correctAnswer: 'False',
        explanation: 'Paragraph 3 states that several eusocial lineages, including termites, naked mole-rats, and snapping shrimp, are fully diploid.',
        passageEvidence: 'Several eusocial lineages, including termites, naked mole-rats, and snapping shrimp, are fully diploid'
      },
      {
        id: 'q-c1-06-3',
        type: 'sentence_completion',
        prompt: 'Under haplodiploidy, full sisters in hymenopteran colonies can share up to _______ percent of their genes.',
        correctAnswer: 'seventy-five',
        acceptedAnswers: ['seventy-five', '75', '75%'],
        explanation: 'Paragraph 2 states that haplodiploidy causes full sisters to share up to seventy-five percent of their genes.',
        passageEvidence: 'causes full sisters to share up to seventy-five percent of their genes'
      },
      {
        id: 'q-c1-06-4',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 3, the word "tempered" most nearly means:',
        options: [
          'Moderated or made less absolute',
          'Heated to a high temperature',
          'Completely disproved and abandoned',
          'Legally prohibited'
        ],
        correctAnswer: 'Moderated or made less absolute',
        explanation: '"Tempered" describes how later empirical findings moderated the claim that haplodiploidy alone drives eusociality.',
        passageEvidence: 'Subsequent empirical work, however, has tempered the claim that haplodiploidy alone drives eusociality.'
      },
      {
        id: 'q-c1-06-5',
        type: 'multiple_choice',
        prompt: 'According to W. D. Hamilton’s inclusive fitness theory, when can an allele for altruism spread in a population?',
        options: [
          'When the reproductive benefit to relatives, weighted by genetic relatedness, exceeds the reproductive cost to the individual',
          'Only when two different insect species merge into a single nest',
          'When the environment has no predators or food shortages',
          'When worker insects mutate to reproduce without a queen'
        ],
        correctAnswer: 'When the reproductive benefit to relatives, weighted by genetic relatedness, exceeds the reproductive cost to the individual',
        explanation: 'Paragraph 2 explains that an altruistic allele proliferates if the cost to the actor is outweighed by the benefit conferred upon relatives, discounted by relatedness.',
        passageEvidence: 'if the reproductive cost to the actor is outweighed by the reproductive benefit conferred upon relatives, discounted by their coefficient of genetic relatedness.'
      }
    ]
  },
  {
    id: 'c1-07-antimicrobial-market-failure',
    title: 'Antimicrobial Stewardship and the Economic Paradox of Novel Antibiotics',
    level: 'C1',
    topic: 'Public health',
    estimatedMinutes: 14,
    status: 'published',
    generationBatch: 'batch-5-c1',
    imageStatus: 'ready',
    introduction: 'How evolutionary resistance and volume-based pharmaceutical pricing create a market failure for last-resort antibiotics, prompting delinked subscription models.',
    createdAt: '2026-01-15T12:00:00Z',
    updatedAt: '2026-01-15T12:00:00Z',
    illustrationAlt: 'Editorial illustration of bacterial inhibition zones and public health policy frameworks',
    passage: [
      'The proliferation of multidrug-resistant pathogens represents one of the most acute threats to contemporary clinical medicine, jeopardizing routine surgical prophylaxis, neonatal care, and immunosuppressive oncology. Yet even as existing antimicrobial classes lose efficacy through horizontal gene transfer and selective evolutionary pressure, the pharmaceutical pipeline for novel mechanisms of action has atrophied. Major biotechnology firms have exited antibiotic discovery in droves, leaving fragile smaller enterprises to navigate clinical trials.',
      'At the heart of this attrition lies a structural market paradox unique to anti-infective therapeutics. In virtually every other pharmaceutical domain—such as oncology or cardiology—commercial revenue scales with prescription volume: a superior drug is deployed immediately as a first-line therapy across millions of patients. By contrast, when a breakthrough antibiotic capable of vanquishing pan-resistant bacteria receives regulatory approval, public health stewardship dictates that clinicians hold it in strict reserve as a treatment of last resort. Dispensing the drug widely would accelerate the emergence of resistance, squandering its evolutionary utility.',
      'Consequently, under conventional volume-based reimbursement, developers of novel antibiotics face a bleak financial trajectory: recouping hundreds of millions of dollars in research expenditure is virtually impossible when unit sales are deliberately suppressed and treatment courses last mere days. To rectify this misalignment between private return and public health value, health economists have pioneered "delinked" pull incentives—most notably the subscription or "Netflix-style" procurement model—whereby national health systems pay a fixed annual retainer for guaranteed access to a critical antibiotic, irrespective of the quantity actually prescribed.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'v-c1-07-1',
        word: 'prophylaxis',
        partOfSpeech: 'noun',
        simpleDefinition: 'Preventive medical treatment given to stop an infection or disease before it starts.',
        contextMeaning: 'Antibiotics given before surgery to prevent post-operative infections.',
        exampleSentence: 'Dental prophylaxis reduces the risk of bacterial complications.',
        synonyms: ['preventive treatment', 'prevention'],
        originalSentence: 'The proliferation of multidrug-resistant pathogens represents one of the most acute threats to contemporary clinical medicine, jeopardizing routine surgical prophylaxis, neonatal care, and immunosuppressive oncology.',
        arabicTranslation: 'وقاية طبية'
      },
      {
        id: 'v-c1-07-2',
        word: 'atrophied',
        partOfSpeech: 'verb',
        simpleDefinition: 'Wasted away, shrunk, or declined in strength due to lack of use or investment.',
        contextMeaning: 'The research pipeline for new antibiotics has dried up and weakened.',
        exampleSentence: 'Without public funding, regional rail infrastructure atrophied.',
        synonyms: ['declined', 'withered', 'shrunk'],
        originalSentence: 'Yet even as existing antimicrobial classes lose efficacy through horizontal gene transfer and selective evolutionary pressure, the pharmaceutical pipeline for novel mechanisms of action has atrophied.',
        arabicTranslation: 'ضَمُرَ / تضاءل'
      },
      {
        id: 'v-c1-07-3',
        word: 'attrition',
        partOfSpeech: 'noun',
        simpleDefinition: 'A gradual reduction in numbers or strength as participants drop out over time.',
        contextMeaning: 'The steady departure of pharmaceutical companies from antibiotic research.',
        exampleSentence: 'High staff attrition forced the hospital to restructure shifts.',
        synonyms: ['loss', 'erosion', 'departure'],
        originalSentence: 'At the heart of this attrition lies a structural market paradox unique to anti-infective therapeutics.',
        arabicTranslation: 'استنزاف / تناقص تدريجي'
      },
      {
        id: 'v-c1-07-4',
        word: 'vanquishing',
        partOfSpeech: 'verb',
        simpleDefinition: 'Completely defeating a powerful opponent or threat.',
        contextMeaning: 'Successfully killing bacteria that resist all other medicines.',
        exampleSentence: 'Sanitation reforms were instrumental in vanquishing waterborne cholera.',
        synonyms: ['defeating', 'overcoming', 'eradicating'],
        originalSentence: 'By contrast, when a breakthrough antibiotic capable of vanquishing pan-resistant bacteria receives regulatory approval, public health stewardship dictates that clinicians hold it in strict reserve as a treatment of last resort.',
        arabicTranslation: 'قهر / القضاء على'
      },
      {
        id: 'v-c1-07-5',
        word: 'stewardship',
        partOfSpeech: 'noun',
        simpleDefinition: 'Careful, responsible management of a valuable resource so it lasts for the future.',
        contextMeaning: 'Medical rules that restrict antibiotic use to prevent bacteria from evolving resistance.',
        exampleSentence: 'Forest stewardship ensures that timber harvesting does not destroy habitats.',
        synonyms: ['responsible management', 'safeguarding', 'conservation'],
        originalSentence: 'By contrast, when a breakthrough antibiotic capable of vanquishing pan-resistant bacteria receives regulatory approval, public health stewardship dictates that clinicians hold it in strict reserve as a treatment of last resort.',
        arabicTranslation: 'إدارة رشيدة / إشراف مسؤول'
      },
      {
        id: 'v-c1-07-6',
        word: 'squandering',
        partOfSpeech: 'verb',
        simpleDefinition: 'Wasting something precious in a reckless or foolish way.',
        contextMeaning: 'Throwing away the effectiveness of a new antibiotic by overusing it.',
        exampleSentence: 'The team was criticized for squandering an early lead.',
        synonyms: ['wasting', 'throwing away', 'depleting'],
        originalSentence: 'Dispensing the drug widely would accelerate the emergence of resistance, squandering its evolutionary utility.',
        arabicTranslation: 'تبديد / إهدار'
      },
      {
        id: 'v-c1-07-7',
        word: 'recouping',
        partOfSpeech: 'verb',
        simpleDefinition: 'Earning back money that was spent or invested earlier.',
        contextMeaning: 'Recovering the huge financial cost of discovering and testing a new drug.',
        exampleSentence: 'The solar farm succeeded in recouping its construction costs within six years.',
        synonyms: ['recovering', 'earning back', 'regaining'],
        originalSentence: 'Consequently, under conventional volume-based reimbursement, developers of novel antibiotics face a bleak financial trajectory: recouping hundreds of millions of dollars in research expenditure is virtually impossible when unit sales are deliberately suppressed and treatment courses last mere days.',
        arabicTranslation: 'استرداد (التكاليف)'
      },
      {
        id: 'v-c1-07-8',
        word: 'rectify',
        partOfSpeech: 'verb',
        simpleDefinition: 'To correct or fix something that is wrong or broken.',
        contextMeaning: 'To fix the broken economic incentives in antibiotic development.',
        exampleSentence: 'Engineers worked overnight to rectify the software configuration error.',
        synonyms: ['correct', 'remedy', 'fix'],
        originalSentence: 'To rectify this misalignment between private return and public health value, health economists have pioneered "delinked" pull incentives—most notably the subscription or "Netflix-style" procurement model—whereby national health systems pay a fixed annual retainer for guaranteed access to a critical antibiotic, irrespective of the quantity actually prescribed.',
        arabicTranslation: 'يُصحِّح / يُقوِّم'
      },
      {
        id: 'v-c1-07-9',
        word: 'irrespective',
        partOfSpeech: 'adverb',
        simpleDefinition: 'Without taking a particular factor into account; regardless.',
        contextMeaning: 'Paying the same annual fee no matter how many or how few pills are actually used.',
        exampleSentence: 'All applicants are evaluated by the same criteria, irrespective of background.',
        synonyms: ['regardless', 'independent'],
        originalSentence: 'whereby national health systems pay a fixed annual retainer for guaranteed access to a critical antibiotic, irrespective of the quantity actually prescribed.',
        arabicTranslation: 'بغض النظر عن'
      }
    ],
    questions: [
      {
        id: 'q-c1-07-1',
        type: 'multiple_choice',
        prompt: 'What is the central economic paradox facing developers of breakthrough antibiotics?',
        options: [
          'The more effective a new antibiotic is against resistant bacteria, the more strictly hospitals restrict its sales to preserve its effectiveness',
          'Antibiotics must be taken every day for a patient’s entire life, making them too expensive for insurers',
          'Bacteria no longer mutate or exchange genes in modern hospitals',
          'Clinical trials for cardiology drugs are prohibited by public health stewardship'
        ],
        correctAnswer: 'The more effective a new antibiotic is against resistant bacteria, the more strictly hospitals restrict its sales to preserve its effectiveness',
        explanation: 'Paragraph 2 explains that when a breakthrough antibiotic is approved, stewardship dictates holding it in strict reserve as a last resort, suppressing unit sales.',
        passageEvidence: 'when a breakthrough antibiotic capable of vanquishing pan-resistant bacteria receives regulatory approval, public health stewardship dictates that clinicians hold it in strict reserve as a treatment of last resort.'
      },
      {
        id: 'q-c1-07-2',
        type: 'true_false_not_given',
        prompt: 'Under a "delinked" subscription model, a pharmaceutical company’s payment depends strictly on the number of antibiotic pills prescribed each month.',
        options: ['True', 'False', 'Not Given'],
        correctAnswer: 'False',
        explanation: 'Paragraph 3 states that under delinked subscription models, health systems pay a fixed annual retainer irrespective of the quantity actually prescribed.',
        passageEvidence: 'pay a fixed annual retainer for guaranteed access to a critical antibiotic, irrespective of the quantity actually prescribed.'
      },
      {
        id: 'q-c1-07-3',
        type: 'sentence_completion',
        prompt: 'Widespread prescription of a new last-resort antibiotic would speed up bacterial resistance, thereby _______ its evolutionary usefulness.',
        correctAnswer: 'squandering',
        acceptedAnswers: ['squandering'],
        explanation: 'Paragraph 2 states that dispensing the drug widely would accelerate resistance, "squandering its evolutionary utility."',
        passageEvidence: 'Dispensing the drug widely would accelerate the emergence of resistance, squandering its evolutionary utility.'
      },
      {
        id: 'q-c1-07-4',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 1, the word "atrophied" is closest in meaning to:',
        options: [
          'Weakened and shrunk due to underinvestment',
          'Expanded rapidly across continents',
          'Become completely automated by computers',
          'Merged with agricultural fertilizer production'
        ],
        correctAnswer: 'Weakened and shrunk due to underinvestment',
        explanation: '"Atrophied" describes how the pharmaceutical pipeline for novel antibiotics has dried up as major firms exited.',
        passageEvidence: 'the pharmaceutical pipeline for novel mechanisms of action has atrophied.'
      },
      {
        id: 'q-c1-07-5',
        type: 'multiple_choice',
        prompt: 'Why is antibiotic resistance dangerous for medical fields outside infectious disease, such as oncology and surgery?',
        options: [
          'Routine surgeries and immunosuppressive cancer treatments rely on effective antibiotics to prevent life-threatening infections',
          'Antibiotics are the primary chemical used to dissolve solid tumors',
          'Surgeons use antibiotics as general anesthesia',
          'Oncology clinics manufacture all hospital disinfectants'
        ],
        correctAnswer: 'Routine surgeries and immunosuppressive cancer treatments rely on effective antibiotics to prevent life-threatening infections',
        explanation: 'Paragraph 1 notes that multidrug-resistant pathogens jeopardize routine surgical prophylaxis, neonatal care, and immunosuppressive oncology.',
        passageEvidence: 'jeopardizing routine surgical prophylaxis, neonatal care, and immunosuppressive oncology.'
      }
    ]
  },
  {
    id: 'c1-08-agglomeration-baumol-disease',
    title: 'Agglomeration Externalities and Baumol’s Cost Disease in Post-Industrial Cities',
    level: 'C1',
    topic: 'Economics and society',
    estimatedMinutes: 14,
    status: 'published',
    generationBatch: 'batch-5-c1',
    imageStatus: 'ready',
    introduction: 'How knowledge spillovers concentrate high-wage industries in metropolitan hubs while driving up the relative cost of labor-intensive local services.',
    createdAt: '2026-01-15T12:00:00Z',
    updatedAt: '2026-01-15T12:00:00Z',
    illustrationAlt: 'Editorial illustration of dense urban economic nodes and diverging productivity curves',
    passage: [
      'At the dawn of the internet era, pundits routinely prophesied the "death of distance": ubiquitous broadband connectivity would ostensibly render urban density obsolete, dispersing high-value knowledge work into low-cost rural hinterlands. Instead, the early twenty-first century witnessed a pronounced spatial concentration of innovation and capital within a handful of superstar metropolitan regions. Urban economists attribute this persistence to agglomeration externalities—productivity gains that accrue when firms and skilled workers cluster in close proximity.',
      'These externalities operate through three primary mechanisms first formalized by Alfred Marshall: thick labor markets that reduce matching friction between specialized employers and talent, shared specialized input providers, and tacit knowledge spillovers. Unlike codified data, which can be transmitted effortlessly across fiber-optic cables, tacit insights regarding emerging research paradigms or venture risk are disproportionately exchanged through serendipitous, face-to-face interactions.',
      'Yet the very productivity surges generated by tradable knowledge clusters engender acute socioeconomic strains within the host city, a dynamic illuminated by William Baumol’s theory of "cost disease." As software engineers and biotech researchers command escalating compensation, local nominal wages and commercial rents rise across the metropolitan area. Labor-intensive local services—such as municipal transit, nursing, classroom instruction, and performing arts—cannot easily substitute capital for human time without degrading quality. To retain staff against competing urban wages, these sectors must raise pay faster than their own productivity growth, driving up the real cost of essential civic amenities and exacerbating housing affordability crises.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'v-c1-08-1',
        word: 'ostensibly',
        partOfSpeech: 'adverb',
        simpleDefinition: 'As appears or is claimed on the surface, though not necessarily true in reality.',
        contextMeaning: 'According to the mistaken prediction that the internet would make cities unnecessary.',
        exampleSentence: 'The meeting was ostensibly called to discuss scheduling, but focused on budget cuts.',
        synonyms: ['supposedly', 'apparently', 'seemingly'],
        originalSentence: 'At the dawn of the internet era, pundits routinely prophesied the "death of distance": ubiquitous broadband connectivity would ostensibly render urban density obsolete, dispersing high-value knowledge work into low-cost rural hinterlands.',
        arabicTranslation: 'ظاهرياً / على ما يُزعم'
      },
      {
        id: 'v-c1-08-2',
        word: 'hinterlands',
        partOfSpeech: 'noun',
        simpleDefinition: 'Remote or rural areas far away from major cities and coastlines.',
        contextMeaning: 'Less populated country regions outside major metropolitan hubs.',
        exampleSentence: 'New rail lines connected the agricultural hinterlands to the port.',
        synonyms: ['outlying regions', 'rural areas', 'countryside'],
        originalSentence: 'ubiquitous broadband connectivity would ostensibly render urban density obsolete, dispersing high-value knowledge work into low-cost rural hinterlands.',
        arabicTranslation: 'المناطق الداخلية البعيدة / الأرياف النائية'
      },
      {
        id: 'v-c1-08-3',
        word: 'agglomeration',
        partOfSpeech: 'noun',
        simpleDefinition: 'The clustering or gathering together of many businesses and people in one area.',
        contextMeaning: 'The concentration of tech companies, universities, and skilled workers in the same city.',
        exampleSentence: 'The agglomeration of film studios in one district attracted skilled sound editors.',
        synonyms: ['clustering', 'concentration', 'grouping'],
        originalSentence: 'Urban economists attribute this persistence to agglomeration externalities—productivity gains that accrue when firms and skilled workers cluster in close proximity.',
        arabicTranslation: 'تكتل / تجمُّع حضري'
      },
      {
        id: 'v-c1-08-4',
        word: 'accrue',
        partOfSpeech: 'verb',
        simpleDefinition: 'To build up or be gained over time as a natural result of a situation.',
        contextMeaning: 'Productivity benefits that accumulate when firms locate near one another.',
        exampleSentence: 'Significant health benefits accrue from regular cardiovascular exercise.',
        synonyms: ['accumulate', 'arise', 'build up'],
        originalSentence: 'Urban economists attribute this persistence to agglomeration externalities—productivity gains that accrue when firms and skilled workers cluster in close proximity.',
        arabicTranslation: 'يتراكم / يتحقق'
      },
      {
        id: 'v-c1-08-5',
        word: 'tacit',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Understood or learned through direct experience and personal contact rather than written down in rules.',
        contextMeaning: 'Informal, unwritten know-how shared when experts talk in person.',
        exampleSentence: 'Apprentices acquire tacit knowledge by working alongside master craftspeople.',
        synonyms: ['implicit', 'unspoken', 'unwritten'],
        originalSentence: 'Unlike codified data, which can be transmitted effortlessly across fiber-optic cables, tacit insights regarding emerging research paradigms or venture risk are disproportionately exchanged through serendipitous, face-to-face interactions.',
        arabicTranslation: 'ضمني / غير مدوَّن'
      },
      {
        id: 'v-c1-08-6',
        word: 'serendipitous',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Happening by fortunate chance rather than planned scheduling.',
        contextMeaning: 'Unplanned, lucky conversations that spark new ideas when professionals work in the same neighborhood.',
        exampleSentence: 'Penicillin was discovered through a serendipitous laboratory observation.',
        synonyms: ['chance', 'fortuitous', 'unplanned'],
        originalSentence: 'tacit insights regarding emerging research paradigms or venture risk are disproportionately exchanged through serendipitous, face-to-face interactions.',
        arabicTranslation: 'وليد المصادفة السعيدة / غير مخطط له'
      },
      {
        id: 'v-c1-08-7',
        word: 'engender',
        partOfSpeech: 'verb',
        simpleDefinition: 'To cause or give rise to a feeling, situation, or problem.',
        contextMeaning: 'To create serious economic pressures inside a booming city.',
        exampleSentence: 'Transparent governance helps engender public trust.',
        synonyms: ['generate', 'produce', 'cause'],
        originalSentence: 'Yet the very productivity surges generated by tradable knowledge clusters engender acute socioeconomic strains within the host city, a dynamic illuminated by William Baumol’s theory of "cost disease."',
        arabicTranslation: 'يُولِّد / يُحدث'
      },
      {
        id: 'v-c1-08-8',
        word: 'amenities',
        partOfSpeech: 'noun',
        simpleDefinition: 'Useful public services and facilities that make a place livable.',
        contextMeaning: 'Essential city services like schools, healthcare, and public transit.',
        exampleSentence: 'The neighborhood offers excellent public amenities, including libraries and clinics.',
        synonyms: ['public services', 'facilities'],
        originalSentence: 'To retain staff against competing urban wages, these sectors must raise pay faster than their own productivity growth, driving up the real cost of essential civic amenities and exacerbating housing affordability crises.',
        arabicTranslation: 'مرافق وخدمات عامة'
      },
      {
        id: 'v-c1-08-9',
        word: 'exacerbating',
        partOfSpeech: 'verb',
        simpleDefinition: 'Making an existing problem worse or more severe.',
        contextMeaning: 'Intensifying the shortage of affordable housing in major cities.',
        exampleSentence: 'Prolonged heatwaves are exacerbating water scarcity in the basin.',
        synonyms: ['worsening', 'aggravating', 'intensifying'],
        originalSentence: 'To retain staff against competing urban wages, these sectors must raise pay faster than their own productivity growth, driving up the real cost of essential civic amenities and exacerbating housing affordability crises.',
        arabicTranslation: 'يفاقم / يزيد حدة'
      }
    ],
    questions: [
      {
        id: 'q-c1-08-1',
        type: 'multiple_choice',
        prompt: 'Why did the predicted "death of distance" fail to disperse knowledge industries out of major cities?',
        options: [
          'Firms and skilled workers gain agglomeration benefits—including thick labor markets and face-to-face tacit knowledge spillovers—from clustering together',
          'Broadband internet cables could not be installed outside metropolitan areas',
          'Rural governments banned software engineers from working remotely',
          'Manufacturing plants required access to coal mines inside city centers'
        ],
        correctAnswer: 'Firms and skilled workers gain agglomeration benefits—including thick labor markets and face-to-face tacit knowledge spillovers—from clustering together',
        explanation: 'Paragraphs 1 and 2 explain that agglomeration externalities—thick labor markets, shared inputs, and tacit knowledge spillovers—kept innovation clustered in cities.',
        passageEvidence: 'Urban economists attribute this persistence to agglomeration externalities—productivity gains that accrue when firms and skilled workers cluster in close proximity.'
      },
      {
        id: 'q-c1-08-2',
        type: 'true_false_not_given',
        prompt: 'Codified data is harder to transmit over fiber-optic cables than tacit knowledge.',
        options: ['True', 'False', 'Not Given'],
        correctAnswer: 'False',
        explanation: 'Paragraph 2 states that codified data can be transmitted effortlessly across fiber-optic cables, whereas tacit insights require face-to-face interaction.',
        passageEvidence: 'Unlike codified data, which can be transmitted effortlessly across fiber-optic cables, tacit insights regarding emerging research paradigms or venture risk are disproportionately exchanged through serendipitous, face-to-face interactions.'
      },
      {
        id: 'q-c1-08-3',
        type: 'sentence_completion',
        prompt: 'The rising relative cost of labor-intensive local services such as nursing and education in high-wage cities is explained by William Baumol’s theory of _______.',
        correctAnswer: 'cost disease',
        acceptedAnswers: ['cost disease'],
        explanation: 'Paragraph 3 identifies this dynamic as William Baumol’s theory of "cost disease."',
        passageEvidence: 'a dynamic illuminated by William Baumol’s theory of "cost disease."'
      },
      {
        id: 'q-c1-08-4',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 2, the word "tacit" most nearly means:',
        options: [
          'Unwritten and conveyed through personal experience rather than formal code',
          'Encrypted by military computers',
          'Financially unprofitable',
          'Legally binding in international courts'
        ],
        correctAnswer: 'Unwritten and conveyed through personal experience rather than formal code',
        explanation: '"Tacit" is contrasted with "codified data" and refers to unwritten insights exchanged face-to-face.',
        passageEvidence: 'Unlike codified data, which can be transmitted effortlessly across fiber-optic cables, tacit insights regarding emerging research paradigms'
      },
      {
        id: 'q-c1-08-5',
        type: 'multiple_choice',
        prompt: 'According to Baumol’s cost disease, why do local service sectors like teaching and nursing become more expensive in booming tech cities?',
        options: [
          'They cannot easily replace human labor with machines, yet must raise wages to compete with high local living costs and high-tech pay',
          'Teachers and nurses consume more electricity than data centers',
          'Local governments tax schools at a higher rate than software companies',
          'Productivity in classroom instruction doubles every six months'
        ],
        correctAnswer: 'They cannot easily replace human labor with machines, yet must raise wages to compete with high local living costs and high-tech pay',
        explanation: 'Paragraph 3 explains that labor-intensive services cannot substitute capital for human time without degrading quality, yet must raise pay to retain staff.',
        passageEvidence: 'Labor-intensive local services—such as municipal transit, nursing, classroom instruction, and performing arts—cannot easily substitute capital for human time without degrading quality. To retain staff against competing urban wages, these sectors must raise pay faster than their own productivity growth'
      }
    ]
  },
  {
    id: 'c1-09-exoplanet-biosignatures-disequilibrium',
    title: 'Atmospheric Disequilibrium and the Epistemology of Exoplanetary Biosignatures',
    level: 'C1',
    topic: 'Astronomy and space exploration',
    estimatedMinutes: 14,
    status: 'published',
    generationBatch: 'batch-5-c1',
    imageStatus: 'ready',
    introduction: 'How transmission spectroscopy searches for thermodynamic disequilibrium in exoplanet atmospheres while guarding against abiotic false positives.',
    createdAt: '2026-01-15T12:00:00Z',
    updatedAt: '2026-01-15T12:00:00Z',
    illustrationAlt: 'Editorial illustration of exoplanet transmission spectra and absorption lines',
    passage: [
      'As spaceborne observatories transition from merely cataloging terrestrial exoplanets to characterizing their atmospheres via transmission spectroscopy, astrobiology confronts a profound epistemological challenge: how to infer the presence of extraterrestrial metabolism from a handful of spectral absorption bands light-years away. Because a single molecular species rarely constitutes unambiguous proof of life, researchers draw upon a criterion first proposed by James Lovelock and Joshua Lederberg—thermodynamic chemical disequilibrium.',
      'In a lifeless planetary atmosphere governed solely by photochemistry and geology, reactive gases rapidly neutralize one another until the system settles into a low-energy equilibrium state. On Earth, however, abundant molecular oxygen coexists with reducing gases such as methane. Left unreplenished, methane would be oxidized into carbon dioxide and water within scarcely a decade; its persistent presence alongside oxygen implies a prodigious, continuous flux driven by a biosphere. Detecting such a mutually incompatible pair of gases in an exoplanetary spectrum is therefore regarded as a far more robust biosignature than detecting oxygen in isolation.',
      'Even so, abiotic processes can mimic biological disequilibrium, particularly around M-dwarf stars, whose frequent ultraviolet flares drive vigorous photochemistry. Extreme stellar radiation can split water vapor molecules in an ocean-bearing planet’s upper atmosphere; as lightweight hydrogen escapes into space, massive quantities of abiotic oxygen can accumulate without a single photosynthetic organism. Consequently, contemporary biosignature frameworks require contextual vetting: ruling out photochemical false positives by simultaneously measuring stellar UV flux, planetary volcanic outgassing indicators, and the absence of spectral features associated with abiotic oxygen buildup.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'v-c1-09-1',
        word: 'epistemological',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Relating to how we can know whether a conclusion is valid and well-supported by evidence.',
        contextMeaning: 'The scientific problem of proving that distant chemical signals actually come from living things.',
        exampleSentence: 'Particle physics faces epistemological questions when testing theories at unreachable energy scales.',
        synonyms: ['evidential', 'methodological', 'knowledge-related'],
        originalSentence: 'As spaceborne observatories transition from merely cataloging terrestrial exoplanets to characterizing their atmospheres via transmission spectroscopy, astrobiology confronts a profound epistemological challenge: how to infer the presence of extraterrestrial metabolism from a handful of spectral absorption bands light-years away.',
        arabicTranslation: 'معرفي / متعلق بنظرية المعرفة'
      },
      {
        id: 'v-c1-09-2',
        word: 'unambiguous',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Clear and unmistakable, leaving no room for doubt or alternative explanations.',
        contextMeaning: 'Definite, unmistakable proof that life exists on a planet.',
        exampleSentence: 'The treaty contained unambiguous language regarding border demarcation.',
        synonyms: ['unmistakable', 'clear-cut', 'definitive'],
        originalSentence: 'Because a single molecular species rarely constitutes unambiguous proof of life, researchers draw upon a criterion first proposed by James Lovelock and Joshua Lederberg—thermodynamic chemical disequilibrium.',
        arabicTranslation: 'واضح لا لبس فيه'
      },
      {
        id: 'v-c1-09-3',
        word: 'disequilibrium',
        partOfSpeech: 'noun',
        simpleDefinition: 'A state of chemical or physical imbalance that requires a continuous input of energy or material to maintain.',
        contextMeaning: 'When reactive gases like oxygen and methane exist together instead of canceling each other out.',
        exampleSentence: 'Living cells maintain an electrical disequilibrium across their membranes.',
        synonyms: ['imbalance', 'non-equilibrium state'],
        originalSentence: 'Because a single molecular species rarely constitutes unambiguous proof of life, researchers draw upon a criterion first proposed by James Lovelock and Joshua Lederberg—thermodynamic chemical disequilibrium.',
        arabicTranslation: 'عدم اتزان'
      },
      {
        id: 'v-c1-09-4',
        word: 'unreplenished',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Not refilled or resupplied as it gets used up.',
        contextMeaning: 'If new methane were not constantly released into the air by living organisms.',
        exampleSentence: 'Left unreplenished, the underground aquifer would dry up within a decade.',
        synonyms: ['unrefilled', 'unrenewed'],
        originalSentence: 'Left unreplenished, methane would be oxidized into carbon dioxide and water within scarcely a decade; its persistent presence alongside oxygen implies a prodigious, continuous flux driven by a biosphere.',
        arabicTranslation: 'غير متجدد الإمداد'
      },
      {
        id: 'v-c1-09-5',
        word: 'prodigious',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Extremely large or impressive in amount or scale.',
        contextMeaning: 'A huge, ongoing supply of gas being pumped into the atmosphere.',
        exampleSentence: 'The telescope processes a prodigious volume of sky-survey data every night.',
        synonyms: ['immense', 'vast', 'enormous'],
        originalSentence: 'Left unreplenished, methane would be oxidized into carbon dioxide and water within scarcely a decade; its persistent presence alongside oxygen implies a prodigious, continuous flux driven by a biosphere.',
        arabicTranslation: 'هائل / ضخم'
      },
      {
        id: 'v-c1-09-6',
        word: 'flux',
        partOfSpeech: 'noun',
        simpleDefinition: 'A continuous flow or rate of release of a substance.',
        contextMeaning: 'The steady stream of methane and oxygen released into the planetary atmosphere.',
        exampleSentence: 'Sensors measured the seasonal flux of carbon dioxide above the canopy.',
        synonyms: ['flow', 'inflow', 'output'],
        originalSentence: 'its persistent presence alongside oxygen implies a prodigious, continuous flux driven by a biosphere.',
        arabicTranslation: 'تدفُّق مستمر'
      },
      {
        id: 'v-c1-09-7',
        word: 'abiotic',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Physical or chemical, not coming from living organisms.',
        contextMeaning: 'Non-biological processes like sunlight or volcanoes that can create oxygen without life.',
        exampleSentence: 'Lightning is an abiotic source of nitrogen fixation in the atmosphere.',
        synonyms: ['non-living', 'non-biological', 'inorganic'],
        originalSentence: 'Even so, abiotic processes can mimic biological disequilibrium, particularly around M-dwarf stars, whose frequent ultraviolet flares drive vigorous photochemistry.',
        arabicTranslation: 'غير حيوي / لاأحيائي'
      },
      {
        id: 'v-c1-09-8',
        word: 'mimic',
        partOfSpeech: 'verb',
        simpleDefinition: 'To closely imitate or look like something else.',
        contextMeaning: 'When non-living chemistry produces a signal that looks just like a sign of life.',
        exampleSentence: 'Certain synthetic compounds mimic the structure of natural hormones.',
        synonyms: ['imitate', 'resemble', 'simulate'],
        originalSentence: 'Even so, abiotic processes can mimic biological disequilibrium, particularly around M-dwarf stars, whose frequent ultraviolet flares drive vigorous photochemistry.',
        arabicTranslation: 'يُحاكي / يُقلِّد'
      },
      {
        id: 'v-c1-09-9',
        word: 'vetting',
        partOfSpeech: 'noun',
        simpleDefinition: 'Careful, thorough examination and verification before accepting something as true.',
        contextMeaning: 'Checking the planet’s star and geology to rule out non-living causes of oxygen.',
        exampleSentence: 'All data sets undergo rigorous statistical vetting before publication.',
        synonyms: ['verification', 'scrutiny', 'evaluation'],
        originalSentence: 'Consequently, contemporary biosignature frameworks require contextual vetting: ruling out photochemical false positives by simultaneously measuring stellar UV flux, planetary volcanic outgassing indicators, and the absence of spectral features associated with abiotic oxygen buildup.',
        arabicTranslation: 'تمحيص / تدقيق شامل'
      }
    ],
    questions: [
      {
        id: 'q-c1-09-1',
        type: 'multiple_choice',
        prompt: 'Why is the simultaneous detection of oxygen and methane considered a stronger biosignature than detecting oxygen alone?',
        options: [
          'Oxygen and methane rapidly react to destroy each other, so their coexistence requires a huge, continuous resupply',
          'Methane can only be detected using radio telescopes on the Moon',
          'Oxygen is completely invisible to transmission spectroscopy',
          'Volcanoes absorb all carbon dioxide from a planet’s atmosphere'
        ],
        correctAnswer: 'Oxygen and methane rapidly react to destroy each other, so their coexistence requires a huge, continuous resupply',
        explanation: 'Paragraph 2 explains that methane would be oxidized within a decade unless continuously replenished alongside oxygen, signaling thermodynamic disequilibrium.',
        passageEvidence: 'Left unreplenished, methane would be oxidized into carbon dioxide and water within scarcely a decade; its persistent presence alongside oxygen implies a prodigious, continuous flux driven by a biosphere.'
      },
      {
        id: 'q-c1-09-2',
        type: 'true_false_not_given',
        prompt: 'Planetary atmospheres without life can never accumulate large amounts of molecular oxygen.',
        options: ['True', 'False', 'Not Given'],
        correctAnswer: 'False',
        explanation: 'Paragraph 3 states that extreme stellar UV radiation can split water vapor and allow lightweight hydrogen to escape, accumulating massive quantities of abiotic oxygen without life.',
        passageEvidence: 'massive quantities of abiotic oxygen can accumulate without a single photosynthetic organism.'
      },
      {
        id: 'q-c1-09-3',
        type: 'sentence_completion',
        prompt: 'Around active M-dwarf stars, ultraviolet flares can split water vapor molecules, allowing lightweight _______ to escape into space and leaving abiotic oxygen behind.',
        correctAnswer: 'hydrogen',
        acceptedAnswers: ['hydrogen'],
        explanation: 'Paragraph 3 states that "as lightweight hydrogen escapes into space, massive quantities of abiotic oxygen can accumulate."',
        passageEvidence: 'as lightweight hydrogen escapes into space, massive quantities of abiotic oxygen can accumulate'
      },
      {
        id: 'q-c1-09-4',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 3, the word "abiotic" means:',
        options: [
          'Produced by non-living physical or chemical processes',
          'Resistant to hospital antibiotics',
          'Orbiting outside the habitable zone',
          'Absorbing all infrared wavelengths'
        ],
        correctAnswer: 'Produced by non-living physical or chemical processes',
        explanation: '"Abiotic" contrasts with biological metabolism and photosynthesis, referring to non-living photochemical processes.',
        passageEvidence: 'massive quantities of abiotic oxygen can accumulate without a single photosynthetic organism.'
      },
      {
        id: 'q-c1-09-5',
        type: 'multiple_choice',
        prompt: 'What does "contextual vetting" require astrobiologists to do before claiming a biosignature detection?',
        options: [
          'Evaluate stellar UV radiation, volcanic outgassing, and photochemical indicators to rule out abiotic false positives',
          'Send a robotic sample-return lander to the exoplanet surface',
          'Wait at least one hundred years to observe seasonal vegetation changes',
          'Confirm that the exoplanet has exactly the same mass as Jupiter'
        ],
        correctAnswer: 'Evaluate stellar UV radiation, volcanic outgassing, and photochemical indicators to rule out abiotic false positives',
        explanation: 'Paragraph 3 defines contextual vetting as ruling out photochemical false positives by measuring stellar UV flux, volcanic indicators, and spectral features.',
        passageEvidence: 'ruling out photochemical false positives by simultaneously measuring stellar UV flux, planetary volcanic outgassing indicators, and the absence of spectral features associated with abiotic oxygen buildup.'
      }
    ]
  },
  {
    id: 'c1-10-embodied-carbon-adaptive-reuse',
    title: 'Embodied Carbon Accounting and the Imperative of Adaptive Architectural Reuse',
    level: 'C1',
    topic: 'Architecture and urban development',
    estimatedMinutes: 14,
    status: 'published',
    generationBatch: 'batch-5-c1',
    imageStatus: 'ready',
    introduction: 'Why operational energy efficiency is no longer sufficient for net-zero architecture, shifting focus to upfront embodied carbon and structural adaptive reuse.',
    createdAt: '2026-01-15T12:00:00Z',
    updatedAt: '2026-01-15T12:00:00Z',
    illustrationAlt: 'Editorial illustration of structural concrete frames integrated with timber adaptive reuse',
    passage: [
      'For the past three decades, sustainable architecture was preoccupied almost exclusively with operational carbon—the greenhouse gas emissions generated over a building’s lifecycle by heating, cooling, ventilation, and lighting. Through triple-glazed curtain walls, heat-recovery ventilation, and grid-scale renewable electricity, contemporary high-performance buildings have drastically curtailed their operational footprint. Yet this success has exposed a previously neglected blind spot in lifecycle assessment: embodied carbon, the upfront emissions released during the extraction, calcination, smelting, and transport of structural materials—principally Portland cement and virgin steel.',
      'Crucially, operational and embodied emissions possess asymmetrical temporal profiles. Operational savings accrue incrementally over fifty to eighty years of building occupancy; by contrast, embodied carbon is discharged into the atmosphere in an irreversible pulse before a single tenant crosses the threshold. When a structurally sound twentieth-century office building is demolished and replaced with a newly constructed "net-zero operational" tower, the upfront carbon debt incurred by pouring new concrete foundations and erecting steel frames can take three to four decades of energy savings merely to break even—far exceeding the critical window for mid-century climate stabilization.',
      'Consequently, urban policy and structural engineering are undergoing a paradigm shift toward adaptive reuse and circular construction. Rather than treating obsolescent commercial buildings as demolition candidates, architects strip structures back to their load-bearing concrete cores, extending floor plates with lightweight cross-laminated timber and retrofitting high-efficiency facades. Where new construction is unavoidable, municipal building codes increasingly mandate whole-life carbon declarations, incentivizing supplementary cementitious materials, electric-arc-furnace recycled steel, and reversible mechanical fasteners that allow structural members to be disassembled rather than pulverized at end of life.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'v-c1-10-1',
        word: 'preoccupied',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Focused almost entirely on one issue while paying little attention to others.',
        contextMeaning: 'When green building standards focused only on daily heating and lighting energy.',
        exampleSentence: 'Early aviation engineers were preoccupied with propulsion rather than cabin comfort.',
        synonyms: ['focused on', 'absorbed in', 'fixated on'],
        originalSentence: 'For the past three decades, sustainable architecture was preoccupied almost exclusively with operational carbon—the greenhouse gas emissions generated over a building’s lifecycle by heating, cooling, ventilation, and lighting.',
        arabicTranslation: 'منشغل كلياً بـ'
      },
      {
        id: 'v-c1-10-2',
        word: 'curtailed',
        partOfSpeech: 'verb',
        simpleDefinition: 'Reduced or cut back significantly.',
        contextMeaning: 'Greatly lowered the amount of energy a building uses each day.',
        exampleSentence: 'New insulation standards curtailed winter heating demand.',
        synonyms: ['reduced', 'cut back', 'decreased'],
        originalSentence: 'Through triple-glazed curtain walls, heat-recovery ventilation, and grid-scale renewable electricity, contemporary high-performance buildings have drastically curtailed their operational footprint.',
        arabicTranslation: 'قلَّص / خفَّض بشدة'
      },
      {
        id: 'v-c1-10-3',
        word: 'embodied',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Built into or locked inside the creation of a physical material or product.',
        contextMeaning: 'Carbon emissions released while manufacturing and constructing a building’s concrete and steel.',
        exampleSentence: 'Repairing electronics preserves the embodied energy used to manufacture their microchips.',
        synonyms: ['embedded', 'built-in', 'upfront'],
        originalSentence: 'Yet this success has exposed a previously neglected blind spot in lifecycle assessment: embodied carbon, the upfront emissions released during the extraction, calcination, smelting, and transport of structural materials—principally Portland cement and virgin steel.',
        arabicTranslation: 'مُتجسِّد / كامن في التصنيع'
      },
      {
        id: 'v-c1-10-4',
        word: 'asymmetrical',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Uneven or different in shape, timing, or structure between two sides.',
        contextMeaning: 'Having very different timing: upfront construction emissions happen all at once, while energy savings happen slowly over decades.',
        exampleSentence: 'The two wings of the museum have an asymmetrical layout.',
        synonyms: ['uneven', 'unbalanced', 'mismatched'],
        originalSentence: 'Crucially, operational and embodied emissions possess asymmetrical temporal profiles.',
        arabicTranslation: 'غير متماثل'
      },
      {
        id: 'v-c1-10-5',
        word: 'incrementally',
        partOfSpeech: 'adverb',
        simpleDefinition: 'Gradually, in small steps over a long period of time.',
        contextMeaning: 'Saving small amounts of energy year after year over a building’s lifespan.',
        exampleSentence: 'The city expanded its bike lane network incrementally over ten years.',
        synonyms: ['gradually', 'step by step', 'progressively'],
        originalSentence: 'Operational savings accrue incrementally over fifty to eighty years of building occupancy; by contrast, embodied carbon is discharged into the atmosphere in an irreversible pulse before a single tenant crosses the threshold.',
        arabicTranslation: 'تدريجياً / على مراحل صغيرة'
      },
      {
        id: 'v-c1-10-6',
        word: 'incurred',
        partOfSpeech: 'verb',
        simpleDefinition: 'Brought upon oneself a cost, debt, or penalty as a result of an action.',
        contextMeaning: 'Created a large upfront carbon cost by demolishing and pouring new concrete.',
        exampleSentence: 'The contractor incurred heavy fines for missing the completion deadline.',
        synonyms: ['accumulated', 'generated', 'taken on'],
        originalSentence: 'When a structurally sound twentieth-century office building is demolished and replaced with a newly constructed "net-zero operational" tower, the upfront carbon debt incurred by pouring new concrete foundations and erecting steel frames can take three to four decades of energy savings merely to break even—far exceeding the critical window for mid-century climate stabilization.',
        arabicTranslation: 'تكبَّد'
      },
      {
        id: 'v-c1-10-7',
        word: 'obsolescent',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Becoming outdated or less suitable for its original purpose, though still standing.',
        contextMeaning: 'Older office buildings whose interior layouts or mechanical systems need updating.',
        exampleSentence: 'Cities are converting obsolescent industrial warehouses into residential lofts.',
        synonyms: ['aging', 'outdated', 'outmoded'],
        originalSentence: 'Rather than treating obsolescent commercial buildings as demolition candidates, architects strip structures back to their load-bearing concrete cores, extending floor plates with lightweight cross-laminated timber and retrofitting high-efficiency facades.',
        arabicTranslation: 'آيل للتقادم'
      },
      {
        id: 'v-c1-10-8',
        word: 'retrofitting',
        partOfSpeech: 'verb',
        simpleDefinition: 'Adding modern parts, insulation, or equipment to an older structure.',
        contextMeaning: 'Upgrading an existing building frame with modern energy-efficient glass and systems.',
        exampleSentence: 'Retrofitting historic masonry buildings requires breathable insulation.',
        synonyms: ['upgrading', 'modernizing', 'renovating'],
        originalSentence: 'Rather than treating obsolescent commercial buildings as demolition candidates, architects strip structures back to their load-bearing concrete cores, extending floor plates with lightweight cross-laminated timber and retrofitting high-efficiency facades.',
        arabicTranslation: 'تحديث وتجهيز المباني القائمة'
      },
      {
        id: 'v-c1-10-9',
        word: 'pulverized',
        partOfSpeech: 'verb',
        simpleDefinition: 'Crushed or smashed into dust and rubble.',
        contextMeaning: 'Destroyed by wrecking balls and concrete crushers during demolition.',
        exampleSentence: 'Recycled glass is pulverized into fine sand for road construction.',
        synonyms: ['crushed', 'demolished', 'shattered'],
        originalSentence: 'Where new construction is unavoidable, municipal building codes increasingly mandate whole-life carbon declarations, incentivizing supplementary cementitious materials, electric-arc-furnace recycled steel, and reversible mechanical fasteners that allow structural members to be disassembled rather than pulverized at end of life.',
        arabicTranslation: 'سُحِقَ / حُوِّل إلى حطام'
      }
    ],
    questions: [
      {
        id: 'q-c1-10-1',
        type: 'multiple_choice',
        prompt: 'What is the fundamental difference between "operational carbon" and "embodied carbon" in architecture?',
        options: [
          'Operational carbon comes from ongoing daily energy use like heating and lighting, whereas embodied carbon is released upfront when manufacturing and constructing building materials',
          'Operational carbon only applies to residential homes, whereas embodied carbon only applies to bridges',
          'Embodied carbon is absorbed by triple-glazed windows over eighty years',
          'Operational carbon is produced exclusively during building demolition'
        ],
        correctAnswer: 'Operational carbon comes from ongoing daily energy use like heating and lighting, whereas embodied carbon is released upfront when manufacturing and constructing building materials',
        explanation: 'Paragraph 1 defines operational carbon as lifecycle emissions from heating/cooling/lighting and embodied carbon as upfront emissions from material extraction, manufacturing, and construction.',
        passageEvidence: 'embodied carbon, the upfront emissions released during the extraction, calcination, smelting, and transport of structural materials'
      },
      {
        id: 'q-c1-10-2',
        type: 'true_false_not_given',
        prompt: 'Demolishing a structurally sound older building to build a new energy-efficient tower immediately reduces atmospheric carbon emissions in the first year.',
        options: ['True', 'False', 'Not Given'],
        correctAnswer: 'False',
        explanation: 'Paragraph 2 explains that pouring new concrete and steel releases an immediate pulse of embodied carbon that can take 30 to 40 years of operational savings just to break even.',
        passageEvidence: 'the upfront carbon debt incurred by pouring new concrete foundations and erecting steel frames can take three to four decades of energy savings merely to break even'
      },
      {
        id: 'q-c1-10-3',
        type: 'sentence_completion',
        prompt: 'In adaptive reuse, architects often preserve the load-bearing concrete core and expand floor areas using lightweight _______.',
        correctAnswer: 'cross-laminated timber',
        acceptedAnswers: ['cross-laminated timber', 'timber'],
        explanation: 'Paragraph 3 notes that architects strip structures back to their load-bearing concrete cores, extending floor plates with lightweight cross-laminated timber.',
        passageEvidence: 'extending floor plates with lightweight cross-laminated timber'
      },
      {
        id: 'q-c1-10-4',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 1, the word "curtailed" is closest in meaning to:',
        options: [
          'Significantly reduced',
          'Doubled in size',
          'Concealed from regulators',
          'Postponed indefinitely'
        ],
        correctAnswer: 'Significantly reduced',
        explanation: '"Curtailed" describes how high-performance buildings have drastically cut their operational carbon footprint.',
        passageEvidence: 'contemporary high-performance buildings have drastically curtailed their operational footprint.'
      },
      {
        id: 'q-c1-10-5',
        type: 'multiple_choice',
        prompt: 'Why do circular construction guidelines promote the use of reversible mechanical fasteners?',
        options: [
          'They allow structural beams and components to be disassembled and reused rather than crushed into rubble at the end of a building’s life',
          'They eliminate the need for architectural blueprints',
          'They increase the temperature of Portland cement kilns',
          'They prevent tenants from opening exterior windows'
        ],
        correctAnswer: 'They allow structural beams and components to be disassembled and reused rather than crushed into rubble at the end of a building’s life',
        explanation: 'Paragraph 3 states that reversible mechanical fasteners allow structural members to be disassembled rather than pulverized at end of life.',
        passageEvidence: 'reversible mechanical fasteners that allow structural members to be disassembled rather than pulverized at end of life.'
      }
    ]
  }
];

export const BATCH_C1_LESSONS: ReadingLesson[] = rawC1Lessons.map((lesson) => {
  const wordCount = lesson.passage.split(/\s+/).filter(Boolean).length;
  return {
    ...lesson,
    wordCount,
    illustrationUrl: getEditorialIllustrationUri(lesson.id, lesson.topic, lesson.level),
    illustrationAlt: getPassageIllustrationAlt(lesson.id, lesson.illustrationAlt),
  };
});
