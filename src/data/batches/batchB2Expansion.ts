import { ReadingLesson } from '../../types/reading';
import { getEditorialIllustrationUri, getPassageIllustrationAlt } from '../../utils/illustrations';

const rawB2ExpansionLessons: Omit<ReadingLesson, 'illustrationUrl' | 'wordCount' | 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'b2-sci-solid-state-electrolytes',
    title: 'Solid-State Electrolytes and the Quest for Safer High-Density Batteries',
    level: 'B2',
    topic: 'Science and technology',
    status: 'published',
    estimatedMinutes: 12,
    generationBatch: 'batch-expansion-b2',
    imageStatus: 'ready',
    introduction: 'Examine how replacing flammable liquid electrolytes with thin ceramic or sulfide layers could double electric vehicle range while eliminating battery fires.',
    illustrationAlt: 'Photograph of stationary rechargeable battery cells and testing equipment in an energy laboratory',
    passage: [
      'Since their commercial introduction in 1991, rechargeable lithium-ion batteries have powered a global revolution in portable electronics and electric vehicles. Inside a conventional lithium-ion cell, positively charged lithium ions shuttle back and forth between two electrodes—typically a graphite anode and a metal-oxide cathode—suspended in a liquid chemical medium called an electrolyte. During charging, ions travel through the liquid electrolyte to store energy in the anode; during discharging, they flow back to the cathode while electrons power the external circuit. Although engineers have steadily improved this architecture for three decades, conventional cells are now approaching their theoretical limits of energy density.',
      'The primary obstacle to storing more energy in a smaller space lies in the liquid organic solvent used as the electrolyte. Because these liquids are volatile and highly flammable, any microscopic short circuit inside the cell can trigger rapid overheating known as thermal runaway. Furthermore, liquid electrolytes prevent engineers from replacing the bulky graphite anode with a thin foil of pure metallic lithium. Pure lithium metal can store nearly ten times more charge by weight than graphite, but when it is paired with a liquid electrolyte over repeated fast-charging cycles, lithium ions do not plate evenly onto the surface. Instead, they grow into sharp, needle-like metallic crystals called dendrites. Over time, these dendrites pierce the thin plastic separator between the electrodes, causing an internal short circuit and potential fire.',
      'To overcome both the flammability risk and the dendrite barrier, materials scientists are developing solid-state batteries. Rather than immersing the electrodes in a liquid solvent, a solid-state cell uses a paper-thin solid layer—composed of crystalline ceramics, glass-ceramics, or solid polymers—that acts simultaneously as the ion-conducting electrolyte and the physical separator. Because the solid ceramic layer contains no volatile organic liquids, it cannot leak, boil, or catch fire even if the battery casing is punctured. Equally important, a dense, rigid ceramic layer provides a mechanical barrier intended to block lithium dendrites from growing across the cell, making pure lithium-metal anodes viable.',
      'If solid-state cells can be manufactured reliably at scale, the practical benefits for electric transport will be substantial. Removing the heavy graphite scaffold and bulky cooling systems required to protect liquid packs could increase gravimetric energy density by forty to seventy percent. In practical terms, an electric saloon car could achieve a driving range of seven hundred to eight hundred kilometres on a single charge using a battery pack that weighs significantly less than today’s units, while charging from ten to eighty percent in roughly twelve minutes.',
      'Despite these advantages, translating laboratory prototypes into affordable mass production has proved remarkably difficult. Unlike a liquid electrolyte, which naturally wets every microscopic pore of an electrode surface, pressing two rigid solids together leaves tiny air gaps that obstruct ion flow. Moreover, a lithium-metal anode expands as it absorbs ions during charging and shrinks during discharging. Over hundreds of cycles, this constant volume change causes the solid ceramic layer to lose contact with the electrode or develop hairline cracks along grain boundaries. Paradoxically, lithium dendrites can still squeeze through these microscopic cracks if stacking pressure is not carefully controlled.',
      'Consequently, automotive manufacturers and battery researchers are testing hybrid designs that apply controlled spring pressure to the cell stack or introduce ultra-thin buffer interlayers made of soft metals like silver-carbon composites. While full-scale commercial deployment is likely to begin in premium vehicles and medical devices before reaching mass-market cars, solid-state chemistry represents the most significant structural redesign of rechargeable batteries in thirty years. Parallel research is also addressing the industrial manufacturing challenge of roll-to-roll ceramic processing. Traditional lithium-ion factories coat liquid electrode slurries onto copper and aluminium foils at high speeds using equipment similar to newspaper printing presses. Brittle ceramic electrolytes, by contrast, require high-temperature sintering kilns or moisture-free dry rooms because sulfide-based solid electrolytes release toxic hydrogen sulfide gas if exposed to humid air. To make factory lines safer and less capital-intensive, chemical engineers are developing flexible polymer-ceramic composite tapes that can be laminated directly onto existing production machinery without rebuilding entire gigafactories from scratch. Furthermore, solid-state architecture simplifies end-of-life battery recycling. Without hazardous organic solvents soaking the internal components, retired battery modules can be disassembled mechanically with far lower risk of thermal ignition during shredding, allowing hydrometallurgical plants to recover ninety-five percent of the lithium, nickel, and silver for reuse in next-generation vehicle fleets. As pilot lines in Japan, South Korea, Europe, and North America validate multi-year durability under freezing winter temperatures and rapid highway charging, solid-state batteries are poised to transform both electric road transport and regional renewable-energy storage. Regional aviation designers are also tracking these advances closely, because higher gravimetric energy density and non-flammable ceramic cells could soon power short-haul electric commuter aircraft between island communities and regional airports. Meanwhile, grid-scale storage operators anticipate that longer cycle life and zero thermal-runaway risk will allow solid-state battery banks to be installed safely inside dense urban substations to buffer midday solar peaks.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'b2-exp-sci-1',
        word: 'volatile',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Easily evaporating into gas at normal temperatures and quick to catch fire.',
        contextMeaning: 'Prone to vaporizing and igniting if a liquid battery cell overheats.',
        originalSentence: 'Because these liquids are volatile and highly flammable, any microscopic short circuit inside the cell can trigger rapid overheating known as thermal runaway.',
        exampleSentence: 'Chemists store volatile solvents in cool, ventilated cabinets.',
        synonyms: ['evaporative', 'unstable', 'flammable'],
        arabicTranslation: 'متطاير / سريع الاشتعال'
      },
      {
        id: 'b2-exp-sci-2',
        word: 'dendrites',
        partOfSpeech: 'noun',
        simpleDefinition: 'Tiny, branching, needle-like metal crystals that grow on an electrode during charging.',
        contextMeaning: 'Sharp lithium spikes that can poke through a battery separator and cause a short circuit.',
        originalSentence: 'Instead, they grow into sharp, needle-like metallic crystals called dendrites.',
        exampleSentence: 'Microscope images showed metallic dendrites forming on the anode surface.',
        synonyms: ['branching crystals', 'metallic needles'],
        arabicTranslation: 'تفرعات بلورية إبرية'
      },
      {
        id: 'b2-exp-sci-3',
        word: 'pierce',
        partOfSpeech: 'verb',
        simpleDefinition: 'To make a hole through a thin material with a sharp point.',
        contextMeaning: 'To poke straight through the plastic separator inside a battery cell.',
        originalSentence: 'Over time, these dendrites pierce the thin plastic separator between the electrodes, causing an internal short circuit and potential fire.',
        exampleSentence: 'A sharp thorn can easily pierce a bicycle tyre.',
        synonyms: ['puncture', 'penetrate', 'perforate'],
        arabicTranslation: 'يثقب / يخترق'
      },
      {
        id: 'b2-exp-sci-4',
        word: 'simultaneously',
        partOfSpeech: 'adverb',
        simpleDefinition: 'Happening or serving two purposes at the exact same time.',
        contextMeaning: 'Working both as the ion pathway and the physical divider at once.',
        originalSentence: 'Rather than immersing the electrodes in a liquid solvent, a solid-state cell uses a paper-thin solid layer—composed of crystalline ceramics, glass-ceramics, or solid polymers—that acts simultaneously as the ion-conducting electrolyte and the physical separator.',
        exampleSentence: 'The translator listened to the speech and spoke simultaneously.',
        synonyms: ['at the same time', 'concurrently'],
        arabicTranslation: 'في آنٍ واحد'
      },
      {
        id: 'b2-exp-sci-5',
        word: 'viable',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Capable of working successfully in practice.',
        contextMeaning: 'Safe and practical to use inside real commercial batteries.',
        originalSentence: 'Equally important, a dense, rigid ceramic layer provides a mechanical barrier intended to block lithium dendrites from growing across the cell, making pure lithium-metal anodes viable.',
        exampleSentence: 'Solar desalination has become a viable option for island towns.',
        synonyms: ['workable', 'feasible', 'practical'],
        arabicTranslation: 'قابل للتطبيق العملي'
      },
      {
        id: 'b2-exp-sci-6',
        word: 'prototypes',
        partOfSpeech: 'noun',
        simpleDefinition: 'First working test models of a new machine or product built before mass production.',
        contextMeaning: 'Small experimental solid-state battery cells built in research laboratories.',
        originalSentence: 'Despite these advantages, translating laboratory prototypes into affordable mass production has proved remarkably difficult.',
        exampleSentence: 'Engineers tested three wing prototypes inside the wind tunnel.',
        synonyms: ['test models', 'early versions'],
        arabicTranslation: 'نماذج أولية'
      },
      {
        id: 'b2-exp-sci-7',
        word: 'obstruct',
        partOfSpeech: 'verb',
        simpleDefinition: 'To block a path or make movement through it much harder.',
        contextMeaning: 'To block lithium ions from moving smoothly between the solid layers.',
        originalSentence: 'Unlike a liquid electrolyte, which naturally wets every microscopic pore of an electrode surface, pressing two rigid solids together leaves tiny air gaps that obstruct ion flow.',
        exampleSentence: 'Fallen branches can obstruct water flow in narrow streams.',
        synonyms: ['block', 'impede', 'hinder'],
        arabicTranslation: 'يعيق / يسدّ'
      },
      {
        id: 'b2-exp-sci-8',
        word: 'deployment',
        partOfSpeech: 'noun',
        simpleDefinition: 'The act of bringing a new technology into real-world use on a wide scale.',
        contextMeaning: 'Putting solid-state batteries into real cars and devices sold to the public.',
        originalSentence: 'While full-scale commercial deployment is likely to begin in premium vehicles and medical devices before reaching mass-market cars, solid-state chemistry represents the most significant structural redesign of rechargeable batteries in thirty years.',
        exampleSentence: 'The deployment of offshore wind turbines increased clean power supply.',
        synonyms: ['rollout', 'implementation'],
        arabicTranslation: 'نشر واستخدام واسع النطاق'
      }
    ],
    questions: [
      {
        id: 'b2-exp-sci-q1',
        type: 'true_false_not_given',
        prompt: 'Pure metallic lithium can store nearly ten times more charge by weight than a conventional graphite anode.',
        correctAnswer: 'True',
        explanation: 'Paragraph 2 states that pure lithium metal can store nearly ten times more charge by weight than graphite.',
        passageEvidence: 'Pure lithium metal can store nearly ten times more charge by weight than graphite, but when it is paired with a liquid electrolyte over repeated fast-charging cycles, lithium ions do not plate evenly onto the surface.'
      },
      {
        id: 'b2-exp-sci-q2',
        type: 'true_false_not_given',
        prompt: 'Pressing two rigid solid battery layers together automatically eliminates all microscopic air gaps without any special engineering.',
        correctAnswer: 'False',
        explanation: 'Paragraph 5 states that unlike a liquid electrolyte, pressing two rigid solids together leaves tiny air gaps that obstruct ion flow.',
        passageEvidence: 'Unlike a liquid electrolyte, which naturally wets every microscopic pore of an electrode surface, pressing two rigid solids together leaves tiny air gaps that obstruct ion flow.'
      },
      {
        id: 'b2-exp-sci-q3',
        type: 'true_false_not_given',
        prompt: 'Solid polymer electrolytes are cheaper to manufacture than sulfide glass-ceramics in every factory.',
        correctAnswer: 'Not Given',
        explanation: 'Paragraph 3 lists crystalline ceramics, glass-ceramics, and solid polymers, but the passage never compares their manufacturing costs.',
        passageEvidence: 'Rather than immersing the electrodes in a liquid solvent, a solid-state cell uses a paper-thin solid layer—composed of crystalline ceramics, glass-ceramics, or solid polymers—that acts simultaneously as the ion-conducting electrolyte and the physical separator.'
      },
      {
        id: 'b2-exp-sci-q4',
        type: 'yes_no_not_given',
        prompt: 'The author believes that solid-state batteries will immediately appear in low-cost mass-market cars before being used in premium vehicles.',
        correctAnswer: 'No',
        explanation: 'In Paragraph 6, the author states that commercial deployment is likely to begin in premium vehicles and medical devices before reaching mass-market cars.',
        passageEvidence: 'While full-scale commercial deployment is likely to begin in premium vehicles and medical devices before reaching mass-market cars, solid-state chemistry represents the most significant structural redesign of rechargeable batteries in thirty years.'
      },
      {
        id: 'b2-exp-sci-q5',
        type: 'multiple_choice',
        prompt: 'Why is it dangerous to use a pure lithium-metal anode with a conventional liquid electrolyte?',
        options: [
          'Lithium ions form sharp needle-like dendrites during fast charging that pierce the separator and cause short circuits',
          'Pure lithium metal dissolves completely into the liquid solvent within five minutes',
          'Liquid electrolytes freeze solid whenever they touch metallic lithium',
          'Graphite anodes are required to generate the external flow of electrons'
        ],
        correctAnswer: 'Lithium ions form sharp needle-like dendrites during fast charging that pierce the separator and cause short circuits',
        explanation: 'Paragraph 2 explains that when pure lithium metal is paired with a liquid electrolyte over repeated fast-charging cycles, ions grow into sharp metallic crystals called dendrites that pierce the separator.',
        passageEvidence: 'Instead, they grow into sharp, needle-like metallic crystals called dendrites. Over time, these dendrites pierce the thin plastic separator between the electrodes, causing an internal short circuit and potential fire.'
      },
      {
        id: 'b2-exp-sci-q6',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with TWO WORDS from Paragraph 2: Any microscopic short circuit inside a liquid cell can trigger rapid overheating known as ______.',
        correctAnswer: 'thermal runaway',
        acceptedAnswers: ['thermal runaway'],
        explanation: 'Paragraph 2 states that any microscopic short circuit can trigger rapid overheating known as thermal runaway.',
        passageEvidence: 'Because these liquids are volatile and highly flammable, any microscopic short circuit inside the cell can trigger rapid overheating known as thermal runaway.'
      },
      {
        id: 'b2-exp-sci-q7',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 3, the word "viable" is closest in meaning to:',
        options: [
          'Practical and capable of working successfully',
          'Transparent and easy to see through',
          'Impossible to manufacture in a laboratory',
          'Heavier than traditional lead-acid batteries'
        ],
        correctAnswer: 'Practical and capable of working successfully',
        explanation: '"Making pure lithium-metal anodes viable" means making them workable and safe to use in real batteries.',
        passageEvidence: 'Equally important, a dense, rigid ceramic layer provides a mechanical barrier intended to block lithium dendrites from growing across the cell, making pure lithium-metal anodes viable.'
      },
      {
        id: 'b2-exp-sci-q8',
        type: 'short_answer',
        prompt: 'Answer with ONE WORD from Paragraph 1: Which material is typically used for the anode in a conventional lithium-ion battery?',
        correctAnswer: 'graphite',
        acceptedAnswers: ['graphite', 'a graphite anode'],
        explanation: 'Paragraph 1 states that a conventional lithium-ion cell typically uses a graphite anode and a metal-oxide cathode.',
        passageEvidence: 'Inside a conventional lithium-ion cell, positively charged lithium ions shuttle back and forth between two electrodes—typically a graphite anode and a metal-oxide cathode—suspended in a liquid chemical medium called an electrolyte.'
      },
      {
        id: 'b2-exp-sci-q9',
        type: 'matching_information',
        prompt: 'Which paragraph explains why repeated expansion and shrinking of the anode can damage a solid ceramic electrolyte?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4', 'Paragraph 5', 'Paragraph 6'],
        correctAnswer: 'Paragraph 5',
        explanation: 'Paragraph 5 explains that the lithium-metal anode expands during charging and shrinks during discharging, causing the solid ceramic layer to lose contact or develop hairline cracks.',
        passageEvidence: 'Over hundreds of cycles, this constant volume change causes the solid ceramic layer to lose contact with the electrode or develop hairline cracks along grain boundaries.'
      },
      {
        id: 'b2-exp-sci-q10',
        type: 'summary_completion',
        prompt: 'Complete the summary with TWO WORDS from Paragraph 6: To improve contact between solid layers, researchers are testing ultra-thin buffer interlayers made of ______ composites.',
        correctAnswer: 'silver-carbon',
        acceptedAnswers: ['silver-carbon', 'silver-carbon composites'],
        explanation: 'Paragraph 6 mentions ultra-thin buffer interlayers made of soft metals like silver-carbon composites.',
        passageEvidence: 'Consequently, automotive manufacturers and battery researchers are testing hybrid designs that apply controlled spring pressure to the cell stack or introduce ultra-thin buffer interlayers made of soft metals like silver-carbon composites.'
      }
    ]
  },
  {
    id: 'b2-env-kelp-afforestation',
    title: 'Offshore Kelp Restoration and the Ecological Debate Over Ocean Afforestation',
    level: 'B2',
    topic: 'Environmental science',
    status: 'published',
    estimatedMinutes: 12,
    generationBatch: 'batch-expansion-b2',
    imageStatus: 'ready',
    introduction: 'Analyze why giant kelp forests recover along rocky coastlines when predators return, while artificial deep-sea kelp sinking raises scientific questions.',
    illustrationAlt: 'Photograph of giant underwater kelp fronds rising toward sunlit ocean surface water',
    passage: [
      'Along cold, nutrient-rich rocky coastlines from California and Chile to Norway and Tasmania, giant kelp macroalgae form towering underwater forests. Equipped with gas-filled bladders called pneumatocysts that hold their fronds upright toward the sunlight, giant kelp can grow up to fifty centimetres a day—roughly thirty times faster than terrestrial trees. These marine canopies support extraordinary biodiversity, sheltering hundreds of species of rockfish, abalone, and invertebrates while dampening coastal wave energy and absorbing dissolved carbon dioxide.',
      'Over the past half-century, however, many coastal kelp forests have collapsed into barren underwater deserts known as "urchin barrens." The primary driver of this collapse is a disruption in the marine food web coupled with marine heatwaves. In healthy ecosystems, top predators such as sea otters, sunflower sea stars, and large predatory fish keep populations of spiny purple sea urchins in check. When historic fur hunting, disease outbreaks, or overfishing remove those predators, sea urchin numbers explode. Marching across the seafloor in dense fronts, hungry urchins chew through the holdfasts that anchor kelp to the rock, setting entire kelp stalks adrift until only bare pink crustose algae remain.',
      'Encouragingly, marine restoration projects have demonstrated that coastal kelp ecosystems can rebound rapidly once ecological balance is restored. In Northern California, Hokkaido, and New Zealand, commercial divers and conservation groups manually remove excess sea urchins from target reefs or reintroduce captive-bred predatory sea stars while seeding the rock with microscopic kelp spores wrapped around gravel—"green gravel." Within two to three growing seasons, dense kelp canopies return, fish populations multiply, and local water chemistry becomes less acidic.',
      'Inspired by the rapid growth rate of macroalgae, several climate-engineering startups have proposed a far more ambitious intervention known as open-ocean afforestation. Rather than restoring degraded coastal reefs, these companies propose cultivating vast floating rafts of kelp across millions of square kilometres of the deep open ocean. Once the floating kelp reaches full size, mechanical harvesters would cut the biomass or sink the entire raft four thousand metres to the abyssal seafloor, where the cold, high-pressure water would theoretically trap the absorbed carbon for centuries.',
      'Yet leading oceanographers and marine ecologists have raised serious scientific objections to open-ocean kelp sinking. First, the surface waters of the open ocean are naturally low in dissolved nitrate, phosphate, and iron. Scaling up offshore kelp farms would strip those scarce nutrients away from native microscopic phytoplankton, which already form the base of the pelagic food web and drive the ocean’s natural biological carbon pump. Second, decomposing millions of tonnes of sunken kelp on the deep seafloor would consume dissolved oxygen, creating artificial dead zones that suffocate slow-growing deep-sea corals and benthic organisms.',
      'For these reasons, international scientific assessments draw a sharp distinction between coastal kelp restoration and open-ocean geoengineering. Rebuilding natural nearshore kelp forests delivers proven benefits for fisheries, biodiversity, and coastal protection, whereas industrial deep-sea sinking carries unverified carbon accounting and severe ecological risks. Unlike artificial offshore rafts that must be mechanically bundled and dropped into abyssal trenches, natural nearshore kelp forests export carbon passively as winter waves detach older fronds and ocean currents carry them into deep continental-shelf sediments. At the same time, the living coastal canopy buffers shoreline erosion, absorbs agricultural nitrogen runoff, and provides essential nursery habitat for commercial rockfish and shellfish. Alongside wild reef recovery, regenerative coastal aquaculture allows small-scale marine farmers to cultivate kelp on nearshore lines for biodegradable packaging, organic soil biostimulants, and livestock feed supplements that reduce agricultural methane emissions—displacing fossil-fuel-intensive land products without disturbing deep-sea ecosystems. To protect restored reefs against future warming, marine geneticists are establishing cryopreserved seed banks of diverse regional kelp strains that have survived recent Pacific and Atlantic heatwaves. By selecting naturally heat-tolerant local genotypes rather than introducing non-native species, conservation hatcheries give replanted canopies a stronger physiological margin during warm summers. Indigenous coastal guardians, commercial diving collectives, and university marine stations now co-manage these nearshore recovery corridors, combining traditional knowledge of seasonal reef dynamics with drone aerial mapping and underwater acoustic telemetry. Prioritizing evidence-based coastal restoration over speculative deep-ocean dumping ensures that giant kelp forests continue to sustain marine biodiversity, resilient fishing communities, and natural carbon storage along temperate shorelines worldwide. Long-term ecological monitoring across restored bays in Tasmania, British Columbia, and northern Japan also shows that recovering kelp beds raise local seawater pH during daylight hours through intense photosynthesis, giving nearby oysters, mussels, and abalone larvae a vital refuge against ocean acidification. By funding long-horizon coastal stewardship, training regional restoration divers, and enforcing strict water-quality rules along river mouths, maritime nations can secure both ecological resilience and sustainable livelihoods for coastal towns.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'b2-exp-env-1',
        word: 'terrestrial',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Living or growing on dry land rather than in the sea or air.',
        contextMeaning: 'Land-based forest trees compared with underwater kelp.',
        originalSentence: 'Equipped with gas-filled bladders called pneumatocysts that hold their fronds upright toward the sunlight, giant kelp can grow up to fifty centimetres a day—roughly thirty times faster than terrestrial trees.',
        exampleSentence: 'Elephants are the largest terrestrial mammals on Earth.',
        synonyms: ['land-based', 'earthbound'],
        arabicTranslation: 'بري (يعيش على اليابسة)'
      },
      {
        id: 'b2-exp-env-2',
        word: 'canopies',
        partOfSpeech: 'noun',
        simpleDefinition: 'The high, leafy upper layers of a forest—or an underwater kelp forest—that form a roof.',
        contextMeaning: 'The dense upper layer of floating kelp fronds near the ocean surface.',
        originalSentence: 'These marine canopies support extraordinary biodiversity, sheltering hundreds of species of rockfish, abalone, and invertebrates while dampening coastal wave energy and absorbing dissolved carbon dioxide.',
        exampleSentence: 'Monkeys travel high in the rainforest canopies.',
        synonyms: ['overstories', 'upper layers'],
        arabicTranslation: 'المظلات النباتية العلوية'
      },
      {
        id: 'b2-exp-env-3',
        word: 'barren',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Empty of plant life and unable to support rich wildlife.',
        contextMeaning: 'Stripped bare of kelp forests by overgrazing sea urchins.',
        originalSentence: 'Over the past half-century, however, many coastal kelp forests have collapsed into barren underwater deserts known as "urchin barrens."',
        exampleSentence: 'Few plants can grow on the barren volcanic rock.',
        synonyms: ['lifeless', 'desolate', 'bare'],
        arabicTranslation: 'قاحل / أجرد'
      },
      {
        id: 'b2-exp-env-4',
        word: 'adrift',
        partOfSpeech: 'adverb',
        simpleDefinition: 'Floating loose on the water without being anchored or fastened.',
        contextMeaning: 'Detached from the seabed rock after urchins chew through the base of the kelp.',
        originalSentence: 'Marching across the seafloor in dense fronts, hungry urchins chew through the holdfasts that anchor kelp to the rock, setting entire kelp stalks adrift until only bare pink crustose algae remain.',
        exampleSentence: 'The storm broke the rope and set the small wooden boat adrift.',
        synonyms: ['loose', 'unanchored', 'floating free'],
        arabicTranslation: 'عائم بلا مرساة / منجرف'
      },
      {
        id: 'b2-exp-env-5',
        word: 'rebound',
        partOfSpeech: 'verb',
        simpleDefinition: 'To recover and grow strong again after a decline or setback.',
        contextMeaning: 'To regrow quickly into healthy kelp forests once sea urchin numbers are controlled.',
        originalSentence: 'Encouragingly, marine restoration projects have demonstrated that coastal kelp ecosystems can rebound rapidly once ecological balance is restored.',
        exampleSentence: 'Fish numbers began to rebound after the bay was protected.',
        synonyms: ['recover', 'bounce back', 'revive'],
        arabicTranslation: 'يتعافى / ينهض مجدداً'
      },
      {
        id: 'b2-exp-env-6',
        word: 'cultivating',
        partOfSpeech: 'verb',
        simpleDefinition: 'Growing and tending plants or crops deliberately on a large scale.',
        contextMeaning: 'Farming giant rafts of kelp far out in the open ocean.',
        originalSentence: 'Rather than restoring degraded coastal reefs, these companies propose cultivating vast floating rafts of kelp across millions of square kilometres of the deep open ocean.',
        exampleSentence: 'Farmers have been cultivating olive trees in this valley for centuries.',
        synonyms: ['farming', 'growing', 'raising'],
        arabicTranslation: 'زراعة / استزراع'
      },
      {
        id: 'b2-exp-env-7',
        word: 'abyssal',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Relating to the deepest, darkest regions of the ocean floor, thousands of metres down.',
        contextMeaning: 'Located four thousand metres deep on the bottom of the open ocean.',
        originalSentence: 'Once the floating kelp reaches full size, mechanical harvesters would cut the biomass or sink the entire raft four thousand metres to the abyssal seafloor, where the cold, high-pressure water would theoretically trap the absorbed carbon for centuries.',
        exampleSentence: 'Strange bioluminescent fish live on the abyssal plains of the Pacific.',
        synonyms: ['deep-sea', 'deep-ocean'],
        arabicTranslation: 'سحيق (قاع المحيط العميق)'
      },
      {
        id: 'b2-exp-env-8',
        word: 'suffocate',
        partOfSpeech: 'verb',
        simpleDefinition: 'To die or suffer from a lack of oxygen to breathe.',
        contextMeaning: 'To harm deep-sea corals and bottom-dwelling creatures by using up dissolved oxygen in the water.',
        originalSentence: 'Second, decomposing millions of tonnes of sunken kelp on the deep seafloor would consume dissolved oxygen, creating artificial dead zones that suffocate slow-growing deep-sea corals and benthic organisms.',
        exampleSentence: 'Thick mud from a landslide can suffocate river fish.',
        synonyms: ['choke', 'starve of oxygen'],
        arabicTranslation: 'يختنق لنقص الأكسجين'
      }
    ],
    questions: [
      {
        id: 'b2-exp-env-q1',
        type: 'true_false_not_given',
        prompt: 'Giant kelp can grow roughly thirty times faster than land-based trees.',
        correctAnswer: 'True',
        explanation: 'Paragraph 1 states that giant kelp can grow up to fifty centimetres a day—roughly thirty times faster than terrestrial trees.',
        passageEvidence: 'Equipped with gas-filled bladders called pneumatocysts that hold their fronds upright toward the sunlight, giant kelp can grow up to fifty centimetres a day—roughly thirty times faster than terrestrial trees.'
      },
      {
        id: 'b2-exp-env-q2',
        type: 'true_false_not_given',
        prompt: 'Surface waters in the open ocean contain abundant amounts of dissolved nitrate, phosphate, and iron.',
        correctAnswer: 'False',
        explanation: 'Paragraph 5 states that the surface waters of the open ocean are naturally low in dissolved nitrate, phosphate, and iron.',
        passageEvidence: 'First, the surface waters of the open ocean are naturally low in dissolved nitrate, phosphate, and iron.'
      },
      {
        id: 'b2-exp-env-q3',
        type: 'true_false_not_given',
        prompt: 'Tasmanian kelp forests support more species of rockfish than Chilean kelp forests.',
        correctAnswer: 'Not Given',
        explanation: 'Paragraph 1 mentions California, Chile, Norway, and Tasmania, and notes that kelp canopies shelter rockfish, but it never compares species counts between Tasmania and Chile.',
        passageEvidence: 'Along cold, nutrient-rich rocky coastlines from California and Chile to Norway and Tasmania, giant kelp macroalgae form towering underwater forests.'
      },
      {
        id: 'b2-exp-env-q4',
        type: 'yes_no_not_given',
        prompt: 'The author supports coastal kelp restoration while warning against industrial open-ocean kelp sinking.',
        correctAnswer: 'Yes',
        explanation: 'In Paragraph 6, the author concludes that rebuilding natural nearshore kelp forests delivers proven benefits, whereas industrial deep-sea sinking carries unverified carbon accounting and severe ecological risks.',
        passageEvidence: 'Rebuilding natural nearshore kelp forests delivers proven benefits for fisheries, biodiversity, and coastal protection, whereas industrial deep-sea sinking carries unverified carbon accounting and severe ecological risks.'
      },
      {
        id: 'b2-exp-env-q5',
        type: 'multiple_choice',
        prompt: 'How do purple sea urchins destroy an entire stalk of giant kelp?',
        options: [
          'They chew through the holdfasts that anchor the kelp to the rock, setting the stalk adrift',
          'They climb to the ocean surface and pop the gas-filled bladders',
          'They release warm water that melts the kelp fronds',
          'They block sunlight from reaching the top of the ocean'
        ],
        correctAnswer: 'They chew through the holdfasts that anchor the kelp to the rock, setting the stalk adrift',
        explanation: 'Paragraph 2 explains that hungry urchins chew through the holdfasts that anchor kelp to the rock, setting entire kelp stalks adrift.',
        passageEvidence: 'Marching across the seafloor in dense fronts, hungry urchins chew through the holdfasts that anchor kelp to the rock, setting entire kelp stalks adrift until only bare pink crustose algae remain.'
      },
      {
        id: 'b2-exp-env-q6',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 1: Giant kelp fronds are held upright toward the sunlight by gas-filled bladders called ______.',
        correctAnswer: 'pneumatocysts',
        acceptedAnswers: ['pneumatocysts'],
        explanation: 'Paragraph 1 states that giant kelp is equipped with gas-filled bladders called pneumatocysts.',
        passageEvidence: 'Equipped with gas-filled bladders called pneumatocysts that hold their fronds upright toward the sunlight, giant kelp can grow up to fifty centimetres a day—roughly thirty times faster than terrestrial trees.'
      },
      {
        id: 'b2-exp-env-q7',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 3, the word "rebound" is closest in meaning to:',
        options: [
          'Recover and grow healthy again',
          'Sink four thousand metres to the seabed',
          'Float away into the open Pacific Ocean',
          'Turn into bare pink rock'
        ],
        correctAnswer: 'Recover and grow healthy again',
        explanation: '"Coastal kelp ecosystems can rebound rapidly" means they can recover and regrow quickly once ecological balance is restored.',
        passageEvidence: 'Encouragingly, marine restoration projects have demonstrated that coastal kelp ecosystems can rebound rapidly once ecological balance is restored.'
      },
      {
        id: 'b2-exp-env-q8',
        type: 'short_answer',
        prompt: 'Answer with TWO WORDS from Paragraph 3: What name do restoration teams give to small stones wrapped with microscopic kelp spores?',
        correctAnswer: 'green gravel',
        acceptedAnswers: ['green gravel'],
        explanation: 'Paragraph 3 states that teams seed the rock with microscopic kelp spores wrapped around gravel—"green gravel."',
        passageEvidence: 'In Northern California, Hokkaido, and New Zealand, commercial divers and conservation groups manually remove excess sea urchins from target reefs or reintroduce captive-bred predatory sea stars while seeding the rock with microscopic kelp spores wrapped around gravel—"green gravel."'
      },
      {
        id: 'b2-exp-env-q9',
        type: 'matching_information',
        prompt: 'Which paragraph explains how sinking massive amounts of kelp into the deep sea could harm native phytoplankton and deep-sea corals?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4', 'Paragraph 5', 'Paragraph 6'],
        correctAnswer: 'Paragraph 5',
        explanation: 'Paragraph 5 explains that offshore kelp farms would strip nutrients from phytoplankton and decomposing sunken kelp would consume oxygen on the seafloor, suffocating deep-sea corals.',
        passageEvidence: 'Second, decomposing millions of tonnes of sunken kelp on the deep seafloor would consume dissolved oxygen, creating artificial dead zones that suffocate slow-growing deep-sea corals and benthic organisms.'
      },
      {
        id: 'b2-exp-env-q10',
        type: 'summary_completion',
        prompt: 'Complete the summary with TWO WORDS from Paragraph 2: In healthy coastal kelp forests, top predators such as ______ and sunflower sea stars keep sea urchin numbers under control.',
        correctAnswer: 'sea otters',
        acceptedAnswers: ['sea otters', 'otters'],
        explanation: 'Paragraph 2 lists top predators such as sea otters, sunflower sea stars, and large predatory fish.',
        passageEvidence: 'In healthy ecosystems, top predators such as sea otters, sunflower sea stars, and large predatory fish keep populations of spiny purple sea urchins in check.'
      }
    ]
  },
  {
    id: 'b2-psy-prospective-memory',
    title: 'Prospective Memory: How the Brain Remembers to Carry Out Future Intentions',
    level: 'B2',
    topic: 'Psychology and human behaviour',
    status: 'published',
    estimatedMinutes: 12,
    generationBatch: 'batch-expansion-b2',
    imageStatus: 'ready',
    introduction: 'Explore the cognitive distinction between remembering past facts and remembering to perform an action at the right moment in the future.',
    illustrationAlt: 'Photograph of a person placing a handwritten reminder note beside a daily planner and keys',
    passage: [
      'When most people complain about having a poor memory, they are usually thinking of retrospective memory: the ability to recall past events, names, or facts learned in school. Yet in everyday life, more than half of all memory lapses involve a completely different cognitive system known as prospective memory—remembering to carry out a planned intention at an appropriate moment in the future. Forgetting to attach a document to an email before clicking send, walking past the postbox with a stamped letter still in your coat pocket, or forgetting to take medication after dinner are all classic failures of prospective memory.',
      'Cognitive psychologists divide prospective memory tasks into two main categories based on the cue that triggers the action. The first category is event-based prospective memory, which requires a person to perform an action when a specific external circumstance appears—such as remembering to deliver a message when you see your colleague in the hallway. The second category is time-based prospective memory, which requires initiating an action at a particular clock time or after a set interval—such as taking bread out of the oven in twenty minutes or joining an online meeting at three o’clock.',
      'Laboratory and neuroimaging studies show that time-based tasks are significantly more demanding than event-based tasks. In an event-based task, the environment provides an external prompt: seeing your colleague’s face can automatically trigger the memory of the message. In a time-based task, however, no external cue announces that twenty minutes have passed. Instead, the brain’s prefrontal cortex must actively interrupt whatever you are doing to check the clock, ramping up the frequency of time checks as the target minute approaches. If a person becomes deeply absorbed in an engaging book or complex spreadsheet, that internal monitoring loop is easily suppressed, and the deadline slips by unnoticed.',
      'According to the multiprocess framework proposed by psychologists Mark McDaniel and Gilles Einstein, the brain relies on two distinct routes to retrieve a future intention. The first route, strategic monitoring, uses conscious working-memory resources to scan the environment for cues. Because strategic monitoring is effortful, it slows down whatever ongoing activity the person is performing. The second route, spontaneous retrieval, occurs effortlessly when a strong, specific cue in the environment automatically pops the intention into conscious awareness without deliberate searching.',
      'Understanding the difference between vague monitoring and automatic cueing has led researchers to a powerful behavioural technique called "implementation intentions." Rather than forming a general goal such as "I must remember to pack my passport tomorrow," a person states a specific "if-then" plan linking a concrete situational cue to the action: "When I pour my morning coffee tomorrow, I will place my passport into my backpack." Brain-imaging experiments confirm that encoding a specific environmental trigger shifts the task from effortful prefrontal monitoring to automatic associative retrieval.',
      'Physical environmental cues work on the same principle. Placing an umbrella directly against the front door handle the night before a rainy commute, or setting a medicine bottle beside your toothbrush, turns a fragile time-based intention into an unavoidable visual encounter. In high-stakes professions such as aviation and surgery, structured cockpit checklists and pre-operative pause routines serve as institutional prospective-memory aids, ensuring that critical safety steps are never left to unaided human recall during busy moments. Cognitive ageing research further underscores why externalizing prospective cues is more effective than relying on sheer willpower. Paradoxically, laboratory studies often find that older adults perform slightly worse than twenty-year-old university students on artificial computer-based prospective memory tasks in a quiet testing booth, yet outperform younger adults in real-world tasks such as remembering to mail postcards or take scheduled medication on time. Psychologists call this the "age-prospective memory paradox." The explanation lies in metacognitive self-awareness: experienced older adults recognize that working memory is easily hijacked by daily interruptions, so they proactively construct reliable external scaffolds—such as pill organizers, calendar alerts linked to meal times, and doorway placement habits—whereas younger adults overestimate their internal attention and fail to set external triggers. Digital user-interface designers have likewise begun replacing generic smartphone notifications—which users habitually swipe away while absorbed in another task—with context-triggered reminders that activate only when a phone connects to a workplace network or arrives at a grocery store. By anchoring future actions to concrete places and routines rather than abstract clock times, human memory works with its evolutionary strengths rather than against them. Clinical neuropsychologists also apply these findings in rehabilitation programmes for patients recovering from mild traumatic brain injuries or early-stage neurological conditions. Training patients to pause for ten seconds and vividly visualize the exact physical doorway or kitchen counter where they will execute a planned task strengthens the associative link between cue and action, restoring everyday independence without exhausting fragile working-memory reserves. Even in elementary schools, teachers who ask pupils to picture themselves placing their signed permission slip into their schoolbag right after brushing their teeth see completion rates double overnight. Simple environmental engineering consistently outperforms raw mental effort.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'b2-exp-psy-1',
        word: 'retrospective',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Looking back at or recalling events and information from the past.',
        contextMeaning: 'Memory for past events, names, or facts already learned.',
        originalSentence: 'When most people complain about having a poor memory, they are usually thinking of retrospective memory: the ability to recall past events, names, or facts learned in school.',
        exampleSentence: 'Answering history trivia questions relies on retrospective memory.',
        synonyms: ['backward-looking', 'past-oriented'],
        arabicTranslation: 'استرجاعي (متعلق بالماضي)'
      },
      {
        id: 'b2-exp-psy-2',
        word: 'lapses',
        partOfSpeech: 'noun',
        simpleDefinition: 'Brief failures of concentration or memory.',
        contextMeaning: 'Everyday moments when someone forgets to do something they planned.',
        originalSentence: 'Yet in everyday life, more than half of all memory lapses involve a completely different cognitive system known as prospective memory—remembering to carry out a planned intention at an appropriate moment in the future.',
        exampleSentence: 'Even experienced drivers can have occasional lapses of attention.',
        synonyms: ['slips', 'failures', 'oversights'],
        arabicTranslation: 'هفوات / زلات الذاكرة'
      },
      {
        id: 'b2-exp-psy-3',
        word: 'prospective',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Looking forward to or concerned with actions planned for the future.',
        contextMeaning: 'Remembering to perform a planned task at the right future moment.',
        originalSentence: 'Yet in everyday life, more than half of all memory lapses involve a completely different cognitive system known as prospective memory—remembering to carry out a planned intention at an appropriate moment in the future.',
        exampleSentence: 'Remembering to return a library book on Friday is a prospective memory task.',
        synonyms: ['future-directed', 'forward-looking'],
        arabicTranslation: 'مستقبلي (تذكّر تنفيذ المهام المستقبلية)'
      },
      {
        id: 'b2-exp-psy-4',
        word: 'cue',
        partOfSpeech: 'noun',
        simpleDefinition: 'A signal, sight, or event that reminds someone to do something.',
        contextMeaning: 'A visual sight or clock time that triggers a planned action.',
        originalSentence: 'Cognitive psychologists divide prospective memory tasks into two main categories based on the cue that triggers the action.',
        exampleSentence: 'Seeing the empty milk carton was a cue to buy groceries.',
        synonyms: ['signal', 'prompt', 'trigger'],
        arabicTranslation: 'إشارة منبهة / محفز'
      },
      {
        id: 'b2-exp-psy-5',
        word: 'initiating',
        partOfSpeech: 'verb',
        simpleDefinition: 'Starting or beginning an action.',
        contextMeaning: 'Starting the planned task yourself at a specific clock time.',
        originalSentence: 'The second category is time-based prospective memory, which requires initiating an action at a particular clock time or after a set interval—such as taking bread out of the oven in twenty minutes or joining an online meeting at three o’clock.',
        exampleSentence: 'The captain is responsible for initiating the safety check before takeoff.',
        synonyms: ['starting', 'commencing', 'launching'],
        arabicTranslation: 'المبادرة ببدء الفعل'
      },
      {
        id: 'b2-exp-psy-6',
        word: 'suppressed',
        partOfSpeech: 'verb',
        simpleDefinition: 'Pushed down, quieted, or prevented from staying active.',
        contextMeaning: 'Crowded out of awareness when a person is deeply focused on a book or task.',
        originalSentence: 'If a person becomes deeply absorbed in an engaging book or complex spreadsheet, that internal monitoring loop is easily suppressed, and the deadline slips by unnoticed.',
        exampleSentence: 'Deep focus on a puzzle suppressed his awareness of the noise outside.',
        synonyms: ['inhibited', 'dampened', 'blocked'],
        arabicTranslation: 'مكبوت / مثبط'
      },
      {
        id: 'b2-exp-psy-7',
        word: 'spontaneous',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Happening naturally and automatically without conscious effort or planning at that moment.',
        contextMeaning: 'Popping into mind effortlessly as soon as you see the environmental cue.',
        originalSentence: 'The second route, spontaneous retrieval, occurs effortlessly when a strong, specific cue in the environment automatically pops the intention into conscious awareness without deliberate searching.',
        exampleSentence: 'The audience broke into spontaneous applause at the end of the song.',
        synonyms: ['automatic', 'effortless', 'unprompted'],
        arabicTranslation: 'تلقائي / عفوي'
      },
      {
        id: 'b2-exp-psy-8',
        word: 'unaided',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Done without any external tools, checklists, or help.',
        contextMeaning: 'Relying on bare human memory alone without written checklists or reminders.',
        originalSentence: 'In high-stakes professions such as aviation and surgery, structured cockpit checklists and pre-operative pause routines serve as institutional prospective-memory aids, ensuring that critical safety steps are never left to unaided human recall during busy moments.',
        exampleSentence: 'The planet Venus is bright enough to be seen with the unaided eye.',
        synonyms: ['unassisted', 'bare'],
        arabicTranslation: 'غير مدعوم بمساعدة خارجية'
      }
    ],
    questions: [
      {
        id: 'b2-exp-psy-q1',
        type: 'true_false_not_given',
        prompt: 'More than half of everyday memory lapses involve prospective memory rather than retrospective memory.',
        correctAnswer: 'True',
        explanation: 'Paragraph 1 states that in everyday life, more than half of all memory lapses involve prospective memory.',
        passageEvidence: 'Yet in everyday life, more than half of all memory lapses involve a completely different cognitive system known as prospective memory—remembering to carry out a planned intention at an appropriate moment in the future.'
      },
      {
        id: 'b2-exp-psy-q2',
        type: 'true_false_not_given',
        prompt: 'Event-based prospective memory tasks are much harder for the brain than time-based tasks because they lack external prompts.',
        correctAnswer: 'False',
        explanation: 'Paragraph 3 states the opposite: time-based tasks are significantly more demanding than event-based tasks because event-based tasks provide an external prompt.',
        passageEvidence: 'Laboratory and neuroimaging studies show that time-based tasks are significantly more demanding than event-based tasks. In an event-based task, the environment provides an external prompt: seeing your colleague’s face can automatically trigger the memory of the message.'
      },
      {
        id: 'b2-exp-psy-q3',
        type: 'true_false_not_given',
        prompt: 'Children develop retrospective memory three years earlier than prospective memory.',
        correctAnswer: 'Not Given',
        explanation: 'The passage compares retrospective and prospective memory in everyday life, but it never discusses childhood developmental ages.',
        passageEvidence: 'When most people complain about having a poor memory, they are usually thinking of retrospective memory: the ability to recall past events, names, or facts learned in school.'
      },
      {
        id: 'b2-exp-psy-q4',
        type: 'yes_no_not_given',
        prompt: 'The author approves of using external cues and checklists in high-stakes fields like aviation and surgery rather than relying solely on unaided human memory.',
        correctAnswer: 'Yes',
        explanation: 'In Paragraph 6, the author highlights how cockpit checklists and pre-operative routines serve as vital institutional aids so critical safety steps are never left to unaided human recall.',
        passageEvidence: 'In high-stakes professions such as aviation and surgery, structured cockpit checklists and pre-operative pause routines serve as institutional prospective-memory aids, ensuring that critical safety steps are never left to unaided human recall during busy moments.'
      },
      {
        id: 'b2-exp-psy-q5',
        type: 'multiple_choice',
        prompt: 'How does forming an "implementation intention" improve prospective memory?',
        options: [
          'It links a concrete "if-then" situational cue to the planned action, shifting retrieval from effortful monitoring to automatic cueing',
          'It trains the prefrontal cortex to check a wristwatch every thirty seconds',
          'It erases older retrospective memories to free up space in the brain',
          'It replaces specific physical cues with a general goal to try harder'
        ],
        correctAnswer: 'It links a concrete "if-then" situational cue to the planned action, shifting retrieval from effortful monitoring to automatic cueing',
        explanation: 'Paragraph 5 explains that an implementation intention states a specific "if-then" plan linking a concrete situational cue to the action, shifting the task from effortful prefrontal monitoring to automatic associative retrieval.',
        passageEvidence: 'Brain-imaging experiments confirm that encoding a specific environmental trigger shifts the task from effortful prefrontal monitoring to automatic associative retrieval.'
      },
      {
        id: 'b2-exp-psy-q6',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 1: The ability to recall past events, names, or facts learned in school is called ______ memory.',
        correctAnswer: 'retrospective',
        acceptedAnswers: ['retrospective'],
        explanation: 'Paragraph 1 defines retrospective memory as the ability to recall past events, names, or facts learned in school.',
        passageEvidence: 'When most people complain about having a poor memory, they are usually thinking of retrospective memory: the ability to recall past events, names, or facts learned in school.'
      },
      {
        id: 'b2-exp-psy-q7',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 4, the word "spontaneous" is closest in meaning to:',
        options: [
          'Automatic and effortless without deliberate searching',
          'Slow and exhausting for working memory',
          'Delayed by several weeks or months',
          'Written down in a formal cockpit checklist'
        ],
        correctAnswer: 'Automatic and effortless without deliberate searching',
        explanation: 'Paragraph 4 explains that spontaneous retrieval occurs effortlessly when a strong cue automatically pops the intention into awareness without deliberate searching.',
        passageEvidence: 'The second route, spontaneous retrieval, occurs effortlessly when a strong, specific cue in the environment automatically pops the intention into conscious awareness without deliberate searching.'
      },
      {
        id: 'b2-exp-psy-q8',
        type: 'short_answer',
        prompt: 'Answer with TWO WORDS from Paragraph 3: Which region of the brain must actively interrupt ongoing work to check the clock during a time-based task?',
        correctAnswer: 'prefrontal cortex',
        acceptedAnswers: ['prefrontal cortex', 'the prefrontal cortex'],
        explanation: 'Paragraph 3 states that the brain’s prefrontal cortex must actively interrupt whatever you are doing to check the clock.',
        passageEvidence: 'Instead, the brain’s prefrontal cortex must actively interrupt whatever you are doing to check the clock, ramping up the frequency of time checks as the target minute approaches.'
      },
      {
        id: 'b2-exp-psy-q9',
        type: 'matching_information',
        prompt: 'Which paragraph outlines the multiprocess framework developed by Mark McDaniel and Gilles Einstein?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4', 'Paragraph 5', 'Paragraph 6'],
        correctAnswer: 'Paragraph 4',
        explanation: 'Paragraph 4 introduces the multiprocess framework proposed by psychologists Mark McDaniel and Gilles Einstein.',
        passageEvidence: 'According to the multiprocess framework proposed by psychologists Mark McDaniel and Gilles Einstein, the brain relies on two distinct routes to retrieve a future intention.'
      },
      {
        id: 'b2-exp-psy-q10',
        type: 'summary_completion',
        prompt: 'Complete the summary with TWO WORDS from Paragraph 4: Unlike spontaneous retrieval, ______ uses conscious working-memory resources to scan the environment for cues.',
        correctAnswer: 'strategic monitoring',
        acceptedAnswers: ['strategic monitoring'],
        explanation: 'Paragraph 4 states that the first route, strategic monitoring, uses conscious working-memory resources to scan the environment for cues.',
        passageEvidence: 'The first route, strategic monitoring, uses conscious working-memory resources to scan the environment for cues.'
      }
    ]
  },
  {
    id: 'b2-his-indian-ocean-monsoon-trade',
    title: 'Monsoon Winds and Dhow Navigation in the Ancient Indian Ocean Trade Network',
    level: 'B2',
    topic: 'History and archaeology',
    status: 'published',
    estimatedMinutes: 12,
    generationBatch: 'batch-expansion-b2',
    imageStatus: 'ready',
    introduction: 'Examine how seasonal monsoon wind reversals and sewn-plank sailing vessels connected East Africa, Arabia, India, and Southeast Asia long before European steamships.',
    illustrationAlt: 'Photograph of a traditional wooden dhow sailing vessel with a triangular lateen sail on coastal water',
    passage: [
      'Long before sixteenth-century European explorers rounded the southern tip of Africa, the Indian Ocean functioned as the world’s most integrated maritime trade highway. For more than two thousand years, a dense network of port cities—stretching from Kilwa and Mombasa on the Swahili Coast through Aden, Muscat, and Hormuz in Arabia to Calicut in India and Malacca in Southeast Asia—exchanged textiles, spices, porcelain, timber, and ivory. Unlike the stormy North Atlantic, where winds blow unpredictably throughout the year, maritime commerce across the Indian Ocean was governed by a dependable atmospheric clock: the seasonal monsoon.',
      'The word "monsoon" derives from the Arabic mawsim, meaning "season," and refers to the annual reversal of wind patterns caused by differential heating between the Asian continent and the Indian Ocean. From November to March, cool, dry air flows southward from the high-pressure interior of Central Asia, generating steady northeast monsoon winds that push sailing vessels from India and the Persian Gulf toward the Arabian Peninsula and East Africa. Conversely, between May and September, the intense summer sun heats the Asian landmass, drawing warm, moisture-laden air northward from the ocean. This powerful southwest monsoon carried merchant ships swiftly back from Africa and the Red Sea to the Malabar Coast of India in a matter of weeks.',
      'To harness these seasonal winds, shipwrights around the western Indian Ocean developed a distinctive class of wooden vessels known collectively as dhows. Two engineering features set traditional dhows apart from contemporary Mediterranean or Chinese ships. First, rather than fastening hull planks to an internal skeleton with iron nails—which corroded rapidly in warm, salty tropical waters and made hulls brittle when striking coral reefs—builders stitched the teak or coconut-wood planks together using strong coir rope spun from coconut husks. These sewn hulls were remarkably flexible, absorbing the shock of heavy ocean swells without splitting.',
      'Second, dhows carried large triangular lateen sails suspended from a long, angled wooden yard. While square sails worked well only when the wind blew directly from behind, a triangular lateen sail could be pivoted around the mast, allowing captains to sail at sharper angles across the wind and manoeuvre easily into narrow harbour channels. For open-ocean navigation far from coastal landmarks, Arab, Persian, and Indian pilots relied on an astronomical instrument called the kamal: a small rectangular wooden card threaded on a knotted string. By holding the string between his teeth and aligning the bottom edge of the card with the horizon and the top edge with the North Star, a navigator could measure latitude with impressive accuracy.',
      'Because the monsoon winds dictated when ships could depart and when they had to wait several months for the return breeze, Indian Ocean ports evolved into cosmopolitan hubs of cultural exchange. Foreign merchants did not merely drop off cargo and leave the next morning; they rented warehouses, married into local families, and lived in port quarters for half the year. Through these prolonged stays, Arabic, Persian, Gujarati, and Bantu speakers shared navigation manuals, commercial law, architectural styles, and culinary traditions.',
      'Archaeological excavations at ports from Berenike on the Red Sea to Quanzhou in southern China confirm the scale of this pre-modern globalization. Shards of blue-and-white Chinese porcelain, Indian carnelian beads, and Persian glazed pottery appear side by side in medieval East African strata, demonstrating how environmental knowledge of wind cycles and ingenious naval architecture bound three continents into a shared economic world. Maritime historians also note that for more than a millennium prior to the arrival of heavily armed Portuguese carracks in 1498, this vast commercial arena operated largely without a single imperial navy attempting to monopolize sea lanes by force. Because port rulers in Calicut, Malacca, Hormuz, and Kilwa derived their state revenues from customs duties and warehouse fees, they competed to attract foreign captains by guaranteeing fair weights, transparent contract dispute courts, and safe harbourage for crews of every faith and language. Written navigational treatises—most famously the fifteenth-century prose and verse rutters of the Arab pilot Ahmad ibn Majid—codified centuries of collective observations on star altitudes, sea-snake sightings, ocean colour shifts, and coastal depth soundings. Even today, master shipwrights in Oman, Kerala, and Zanzibar preserve the heritage of sewn-plank timber joinery, reminding historians that global economic integration began not with industrial steam engines, but with sailors who learned to read the seasonal breathing of the Indian Ocean. Botanical and linguistic evidence further illustrates the depth of these maritime connections across the rim of the ocean. Everyday food crops such as bananas, taro, and Asian rice were carried westward by dhow crews to Madagascar and the East African coast, while African sorghum, millet, and aromatic frankincense resins moved eastward into Indian and Chinese markets. Along the Swahili Coast, this centuries-long commercial partnership gave rise to a vibrant urban stone-town architecture carved from coral rag and a shared maritime lingua franca that wove Arabic and Persian nautical terms into a Bantu grammatical structure. Museum replicas of sewn-plank vessels built in Oman have even sailed across the open sea to Singapore in recent decades, proving the enduring seaworthiness of ancient ocean craft.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'b2-exp-his-1',
        word: 'maritime',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Connected with the sea, ships, and ocean trade.',
        contextMeaning: 'Sea-based trade and sailing routes across the Indian Ocean.',
        originalSentence: 'Long before sixteenth-century European explorers rounded the southern tip of Africa, the Indian Ocean functioned as the world’s most integrated maritime trade highway.',
        exampleSentence: 'The city’s maritime museum displays models of ancient trading ships.',
        synonyms: ['seafaring', 'nautical', 'oceanic'],
        arabicTranslation: 'بحري / ملاحي'
      },
      {
        id: 'b2-exp-his-2',
        word: 'reversal',
        partOfSpeech: 'noun',
        simpleDefinition: 'A complete change to the opposite direction.',
        contextMeaning: 'The seasonal flip in wind direction between winter and summer.',
        originalSentence: 'The word "monsoon" derives from the Arabic mawsim, meaning "season," and refers to the annual reversal of wind patterns caused by differential heating between the Asian continent and the Indian Ocean.',
        exampleSentence: 'The tide makes a complete reversal twice every day.',
        synonyms: ['turnaround', 'shift', 'inversion'],
        arabicTranslation: 'انقلاب الاتجاه / انعكاس'
      },
      {
        id: 'b2-exp-his-3',
        word: 'shipwrights',
        partOfSpeech: 'noun',
        simpleDefinition: 'Skilled craftspeople who design and build wooden ships.',
        contextMeaning: 'Traditional boatbuilders who constructed wooden dhows along the Indian Ocean.',
        originalSentence: 'To harness these seasonal winds, shipwrights around the western Indian Ocean developed a distinctive class of wooden vessels known collectively as dhows.',
        exampleSentence: 'Master shipwrights selected seasoned teak timber for the hull.',
        synonyms: ['shipbuilders', 'boatbuilders'],
        arabicTranslation: 'صنّاع السفن'
      },
      {
        id: 'b2-exp-his-4',
        word: 'brittle',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Hard and stiff, but likely to crack or snap under sudden impact.',
        contextMeaning: 'Rigid and likely to break apart if the ship hit a hidden coral reef.',
        originalSentence: 'First, rather than fastening hull planks to an internal skeleton with iron nails—which corroded rapidly in warm, salty tropical waters and made hulls brittle when striking coral reefs—builders stitched the teak or coconut-wood planks together using strong coir rope spun from coconut husks.',
        exampleSentence: 'Dry autumn leaves become brittle and crumble in your hand.',
        synonyms: ['breakable', 'fragile', 'inflexible'],
        arabicTranslation: 'هشّ / قابل للانكسار عند الصدمة'
      },
      {
        id: 'b2-exp-his-5',
        word: 'manoeuvre',
        partOfSpeech: 'verb',
        simpleDefinition: 'To steer or move a vessel skillfully and carefully in a desired direction.',
        contextMeaning: 'To steer a sailing ship smoothly through tight harbour entrances.',
        originalSentence: 'While square sails worked well only when the wind blew directly from behind, a triangular lateen sail could be pivoted around the mast, allowing captains to sail at sharper angles across the wind and manoeuvre easily into narrow harbour channels.',
        exampleSentence: 'The pilot had to manoeuvre the boat carefully between the rocks.',
        synonyms: ['steer', 'navigate', 'guide'],
        arabicTranslation: 'يناور / يوجّه بمهارة'
      },
      {
        id: 'b2-exp-his-6',
        word: 'cosmopolitan',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Containing people, languages, and customs from many different countries.',
        contextMeaning: 'Richly diverse port cities where merchants from Africa, Arabia, India, and Asia lived together.',
        originalSentence: 'Because the monsoon winds dictated when ships could depart and when they had to wait several months for the return breeze, Indian Ocean ports evolved into cosmopolitan hubs of cultural exchange.',
        exampleSentence: 'Port cities are often cosmopolitan places with many languages and foods.',
        synonyms: ['multicultural', 'international', 'diverse'],
        arabicTranslation: 'متعدد الثقافات والأعراق'
      },
      {
        id: 'b2-exp-his-7',
        word: 'prolonged',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Continuing for a long period of time.',
        contextMeaning: 'Lasting for several months while merchants waited for the monsoon wind to reverse.',
        originalSentence: 'Through these prolonged stays, Arabic, Persian, Gujarati, and Bantu speakers shared navigation manuals, commercial law, architectural styles, and culinary traditions.',
        exampleSentence: 'The region recovered after a prolonged winter drought.',
        synonyms: ['extended', 'long-lasting', 'lengthy'],
        arabicTranslation: 'ممتد لفترة طويلة'
      },
      {
        id: 'b2-exp-his-8',
        word: 'strata',
        partOfSpeech: 'noun',
        simpleDefinition: 'Horizontal layers of soil or rock built up over historical periods at an archaeological site.',
        contextMeaning: 'Historical layers of earth excavated by archaeologists in medieval East African ports.',
        originalSentence: 'Shards of blue-and-white Chinese porcelain, Indian carnelian beads, and Persian glazed pottery appear side by side in medieval East African strata, demonstrating how environmental knowledge of wind cycles and ingenious naval architecture bound three continents into a shared economic world.',
        exampleSentence: 'Deep soil strata contained pottery from the Bronze Age.',
        synonyms: ['layers', 'levels'],
        arabicTranslation: 'طبقات أثرية / طبقات الأرض'
      }
    ],
    questions: [
      {
        id: 'b2-exp-his-q1',
        type: 'true_false_not_given',
        prompt: 'Between November and March, northeast monsoon winds blow from Asia toward the Arabian Peninsula and East Africa.',
        correctAnswer: 'True',
        explanation: 'Paragraph 2 states that from November to March, cool dry air flows southward from Central Asia, generating northeast monsoon winds that push vessels from India and the Persian Gulf toward Arabia and East Africa.',
        passageEvidence: 'From November to March, cool, dry air flows southward from the high-pressure interior of Central Asia, generating steady northeast monsoon winds that push sailing vessels from India and the Persian Gulf toward the Arabian Peninsula and East Africa.'
      },
      {
        id: 'b2-exp-his-q2',
        type: 'true_false_not_given',
        prompt: 'Traditional Indian Ocean shipwrights preferred iron nails over coconut-husk rope because iron never rusted in warm tropical waters.',
        correctAnswer: 'False',
        explanation: 'Paragraph 3 states that rather than using iron nails—which corroded rapidly in warm, salty tropical waters—builders stitched planks together using coir rope spun from coconut husks.',
        passageEvidence: 'First, rather than fastening hull planks to an internal skeleton with iron nails—which corroded rapidly in warm, salty tropical waters and made hulls brittle when striking coral reefs—builders stitched the teak or coconut-wood planks together using strong coir rope spun from coconut husks.'
      },
      {
        id: 'b2-exp-his-q3',
        type: 'true_false_not_given',
        prompt: 'A dhow carrying porcelain from Quanzhou to Kilwa typically carried a crew of exactly thirty sailors.',
        correctAnswer: 'Not Given',
        explanation: 'The passage describes dhows, ports, and cargo, but it never states the number of sailors in a crew.',
        passageEvidence: 'To harness these seasonal winds, shipwrights around the western Indian Ocean developed a distinctive class of wooden vessels known collectively as dhows.'
      },
      {
        id: 'b2-exp-his-q4',
        type: 'yes_no_not_given',
        prompt: 'The author argues that Indian Ocean ports became multicultural communities partly because merchants had to wait months for the seasonal return wind.',
        correctAnswer: 'Yes',
        explanation: 'In Paragraph 5, the author explains that because monsoon winds dictated when ships could depart and when they had to wait several months, merchants lived in port quarters for half the year, making ports cosmopolitan hubs.',
        passageEvidence: 'Because the monsoon winds dictated when ships could depart and when they had to wait several months for the return breeze, Indian Ocean ports evolved into cosmopolitan hubs of cultural exchange.'
      },
      {
        id: 'b2-exp-his-q5',
        type: 'multiple_choice',
        prompt: 'How did a navigator use a kamal to determine a ship’s latitude at sea?',
        options: [
          'By holding a knotted string in his teeth and aligning a wooden card between the horizon and the North Star',
          'By floating a magnetized iron needle inside a bowl of coconut oil',
          'By measuring the temperature of ocean currents with a glass thermometer',
          'By counting how many seconds sound took to echo off the seafloor'
        ],
        correctAnswer: 'By holding a knotted string in his teeth and aligning a wooden card between the horizon and the North Star',
        explanation: 'Paragraph 4 explains that by holding the knotted string between his teeth and aligning the bottom edge of the wooden card with the horizon and the top edge with the North Star, a navigator could measure latitude.',
        passageEvidence: 'By holding the string between his teeth and aligning the bottom edge of the card with the horizon and the top edge with the North Star, a navigator could measure latitude with impressive accuracy.'
      },
      {
        id: 'b2-exp-his-q6',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 3: Builders stitched teak or coconut-wood planks together using strong ______ rope spun from coconut husks.',
        correctAnswer: 'coir',
        acceptedAnswers: ['coir'],
        explanation: 'Paragraph 3 states that builders stitched planks together using strong coir rope spun from coconut husks.',
        passageEvidence: 'First, rather than fastening hull planks to an internal skeleton with iron nails—which corroded rapidly in warm, salty tropical waters and made hulls brittle when striking coral reefs—builders stitched the teak or coconut-wood planks together using strong coir rope spun from coconut husks.'
      },
      {
        id: 'b2-exp-his-q7',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 5, the word "cosmopolitan" is closest in meaning to:',
        options: [
          'Multicultural and bringing together people from many lands',
          'Closed to all foreign ships and outside traders',
          'Built high in the mountains far from the coast',
          'Abandoned after a single trading season'
        ],
        correctAnswer: 'Multicultural and bringing together people from many lands',
        explanation: 'In Paragraph 5, "cosmopolitan hubs of cultural exchange" refers to ports where Arabic, Persian, Gujarati, and Bantu speakers lived and traded together.',
        passageEvidence: 'Because the monsoon winds dictated when ships could depart and when they had to wait several months for the return breeze, Indian Ocean ports evolved into cosmopolitan hubs of cultural exchange.'
      },
      {
        id: 'b2-exp-his-q8',
        type: 'short_answer',
        prompt: 'Answer with TWO WORDS from Paragraph 4: What type of triangular sails did dhows carry to sail at sharper angles across the wind?',
        correctAnswer: 'lateen sails',
        acceptedAnswers: ['lateen sails', 'triangular lateen sails', 'lateen sail', 'lateen'],
        explanation: 'Paragraph 4 states that dhows carried large triangular lateen sails.',
        passageEvidence: 'Second, dhows carried large triangular lateen sails suspended from a long, angled wooden yard.'
      },
      {
        id: 'b2-exp-his-q9',
        type: 'matching_information',
        prompt: 'Which paragraph explains the physical temperature differences between land and sea that cause the monsoon winds to reverse each year?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4', 'Paragraph 5', 'Paragraph 6'],
        correctAnswer: 'Paragraph 2',
        explanation: 'Paragraph 2 explains the differential heating between the Asian continent and the Indian Ocean from November–March and May–September.',
        passageEvidence: 'The word "monsoon" derives from the Arabic mawsim, meaning "season," and refers to the annual reversal of wind patterns caused by differential heating between the Asian continent and the Indian Ocean.'
      },
      {
        id: 'b2-exp-his-q10',
        type: 'summary_completion',
        prompt: 'Complete the summary with ONE WORD from Paragraph 2: The English word "monsoon" comes from the Arabic word mawsim, which means "______."',
        correctAnswer: 'season',
        acceptedAnswers: ['season'],
        explanation: 'Paragraph 2 states: \'The word "monsoon" derives from the Arabic mawsim, meaning "season"\'.',
        passageEvidence: 'The word "monsoon" derives from the Arabic mawsim, meaning "season," and refers to the annual reversal of wind patterns caused by differential heating between the Asian continent and the Indian Ocean.'
      }
    ]
  },
  {
    id: 'b2-edu-metacognitive-calibration',
    title: 'The Illusion of Competence: Metacognitive Calibration in Self-Regulated Study',
    level: 'B2',
    topic: 'Education and learning',
    status: 'published',
    estimatedMinutes: 12,
    generationBatch: 'batch-expansion-b2',
    imageStatus: 'ready',
    introduction: 'Discover why re-reading highlighted notes creates a false sense of mastery and how delayed self-testing aligns confidence with real exam readiness.',
    illustrationAlt: 'Photograph of a university student writing practice answers in a notebook beside a textbook',
    passage: [
      'Every exam season, university professors encounter students who are genuinely bewildered by a low test grade. "I read the chapters four times and highlighted every key definition," the student explains, "and I felt completely prepared the night before." Educational psychologists do not doubt the student’s honesty or effort. Instead, they point to a well-documented cognitive trap known as the "illusion of competence"—a mismatch between how well learners think they know material and how well they can actually retrieve and apply it under exam conditions.',
      'Measuring the accuracy of a learner’s self-judgment is the focus of research on metacognitive calibration. Metacognition refers to thinking about one’s own thinking: monitoring whether a concept makes sense, predicting how well one will perform on an upcoming test, and deciding which chapters require extra study time. A well-calibrated learner accurately identifies which topics are secure and which remain shaky. A poorly calibrated learner, by contrast, confuses surface familiarity with deep comprehension and stops studying a difficult topic far too early.',
      'Why do common study habits like repeated reading and yellow highlighting distort metacognitive calibration so severely? The answer lies in the difference between recognition and recall. When a student reads a biology chapter for the third time in the same evening, the technical terms and diagrams look smooth, familiar, and easy to process. Cognitive scientists call this ease of reading "processing fluency." Because the page feels effortless to read while the book is open in front of them, the student’s brain mistakes perceptual fluency for durable memory storage. Yet recognizing a sentence when it is right before your eyes is vastly easier than generating the explanation from a blank sheet of paper.',
      'Another factor that inflates confidence is the timing of self-assessment. When students finish reading a section and immediately ask themselves whether they understood it, the exact words of the text are still echoing in their short-term working memory. Consequently, immediate judgments of learning are almost always overly optimistic. In classic experiments initiated by Thomas Nelson and Louis Narens, students who rated their comprehension immediately after reading a passage predicted their later test scores with very low accuracy.',
      'Fortunately, researchers have identified two straightforward techniques that dramatically improve metacognitive calibration. The first is the "delayed keyword test." Instead of judging your mastery right after reading a chapter, wait at least one hour—or until the next morning—so short-term memory clears. Then close the book, write down the chapter’s main headings on a blank page, and attempt to explain each concept in your own words from long-term memory. Students who use delayed recall before rating their confidence predict their actual exam performance more than twice as accurately as those who judge immediately.',
      'The second technique is Explanatory Questioning, often called the Feynman method: explaining how a process works step by step as if teaching an intelligent beginner. Whenever a learner stumbles over a transition or falls back on vague jargon, the gap in understanding becomes immediately visible while there is still time to review. By replacing passive re-reading with delayed retrieval and self-explanation, students align their confidence with reality and direct their study hours where they matter most. Longitudinal studies in medical schools and engineering faculties show that metacognitive calibration is not a fixed personality trait, but a trainable academic skill that improves rapidly with structured feedback. In courses where students record a brief confidence score from zero to one hundred percent beside each practice-quiz answer and then review a "calibration curve" comparing their predicted scores with their actual marks, overconfidence drops by half within four weeks. Learners quickly notice a recurring pattern: multiple-choice recognition questions can create a false sense of certainty when familiar keywords appear in the options, whereas open-ended short-answer prompts expose incomplete mental models right away. Furthermore, well-calibrated students allocate their revision time far more strategically during exam week. Instead of spending comforting hours re-reading early chapters they have already mastered—a common habit psychologists call "region-of-proximal-learning neglect"—they isolate the specific subtopics where their delayed recall was hesitant and focus deliberate practice on those weak links. Developing accurate self-monitoring transforms assessment from a stressful judgment into a clear diagnostic compass for lifelong learning. Classroom teachers and instructional software designers can support this habit by embedding low-stakes retrieval checkpoints at the end of every weekly module and asking learners to rate their certainty before revealing the worked solution. When students treat an incorrect prediction not as a personal failure, but as valuable diagnostic feedback showing exactly which concept needs another look, exam anxiety decreases and independent study becomes far more efficient. Ultimately, knowing what you do not yet know is the true starting point of scholarly mastery. Peer study groups that quiz one another aloud without looking at their notes also build stronger calibration than solitary silent reading. Explaining a difficult theorem or historical cause to a classmate immediately reveals whether an idea is truly understood or merely familiar, turning everyday revision into an active investigation.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'b2-exp-edu-1',
        word: 'bewildered',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Deeply confused and surprised because something unexpected happened.',
        contextMeaning: 'Shocked and puzzled by receiving a low exam mark after hours of re-reading.',
        originalSentence: 'Every exam season, university professors encounter students who are genuinely bewildered by a low test grade.',
        exampleSentence: 'Visitors were bewildered by the maze of narrow streets in the old town.',
        synonyms: ['puzzled', 'baffled', 'perplexed'],
        arabicTranslation: 'متحير بشدة / مذهول'
      },
      {
        id: 'b2-exp-edu-2',
        word: 'illusion',
        partOfSpeech: 'noun',
        simpleDefinition: 'A false impression or belief that makes something seem true when it is not.',
        contextMeaning: 'The false feeling that you have mastered a chapter just because the page looks familiar.',
        originalSentence: 'Instead, they point to a well-documented cognitive trap known as the "illusion of competence"—a mismatch between how well learners think they know material and how well they can actually retrieve and apply it under exam conditions.',
        exampleSentence: 'Mirrors in a small shop create the illusion of a much larger room.',
        synonyms: ['false impression', 'mirage', 'misconception'],
        arabicTranslation: 'وهم / انطباع خادع'
      },
      {
        id: 'b2-exp-edu-3',
        word: 'calibration',
        partOfSpeech: 'noun',
        simpleDefinition: 'The degree to which someone’s confidence or measurement matches actual reality.',
        contextMeaning: 'How closely a student’s belief about their readiness matches their real test score.',
        originalSentence: 'Measuring the accuracy of a learner’s self-judgment is the focus of research on metacognitive calibration.',
        exampleSentence: 'Regular practice quizzes improve a student’s confidence calibration.',
        synonyms: ['alignment', 'accuracy of judgment'],
        arabicTranslation: 'معايرة / دقة التقدير الذاتي'
      },
      {
        id: 'b2-exp-edu-4',
        word: 'distort',
        partOfSpeech: 'verb',
        simpleDefinition: 'To twist or skew something so it no longer gives an accurate picture.',
        contextMeaning: 'To give students a misleadingly high impression of how much they know.',
        originalSentence: 'Why do common study habits like repeated reading and yellow highlighting distort metacognitive calibration so severely?',
        exampleSentence: 'Curved glass can distort the reflection of buildings outside.',
        synonyms: ['skew', 'warp', 'misrepresent'],
        arabicTranslation: 'يشوه / يضلّل التقدير'
      },
      {
        id: 'b2-exp-edu-5',
        word: 'fluency',
        partOfSpeech: 'noun',
        simpleDefinition: 'The smoothness and ease with which the brain reads or processes information.',
        contextMeaning: 'How smooth and easy a page feels to read the third or fourth time.',
        originalSentence: 'Cognitive scientists call this ease of reading "processing fluency."',
        exampleSentence: 'Repeatedly looking at a diagram increases visual fluency without testing recall.',
        synonyms: ['ease', 'smoothness'],
        arabicTranslation: 'سلاسة المعالجة الذهنية'
      },
      {
        id: 'b2-exp-edu-6',
        word: 'optimistic',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Expecting a better result than is realistic; overly confident.',
        contextMeaning: 'Predicting a much higher exam score than one will actually achieve.',
        originalSentence: 'Consequently, immediate judgments of learning are almost always overly optimistic.',
        exampleSentence: 'Their estimate of finishing the project in two days was overly optimistic.',
        synonyms: ['overconfident', 'hopeful'],
        arabicTranslation: 'متفائل بشكل مفرط'
      },
      {
        id: 'b2-exp-edu-7',
        word: 'stumbles',
        partOfSpeech: 'verb',
        simpleDefinition: 'Hesitates, gets stuck, or makes mistakes while trying to speak or explain something.',
        contextMeaning: 'Gets stuck while trying to explain how a scientific process works out loud.',
        originalSentence: 'Whenever a learner stumbles over a transition or falls back on vague jargon, the gap in understanding becomes immediately visible while there is still time to review.',
        exampleSentence: 'If an actor stumbles over a line during rehearsal, they practice that scene again.',
        synonyms: ['hesitates', 'falters', 'trips up'],
        arabicTranslation: 'يتعثر أثناء الشرح'
      },
      {
        id: 'b2-exp-edu-8',
        word: 'jargon',
        partOfSpeech: 'noun',
        simpleDefinition: 'Technical words used by specialists that people sometimes repeat without understanding their real meaning.',
        contextMeaning: 'Textbook terms that a student repeats from memory without being able to explain them simply.',
        originalSentence: 'Whenever a learner stumbles over a transition or falls back on vague jargon, the gap in understanding becomes immediately visible while there is still time to review.',
        exampleSentence: 'Good science writers explain complex ideas in plain English without heavy jargon.',
        synonyms: ['technical terms', 'buzzwords'],
        arabicTranslation: 'مصطلحات تقنية معقدة'
      }
    ],
    questions: [
      {
        id: 'b2-exp-edu-q1',
        type: 'true_false_not_given',
        prompt: 'Re-reading a chapter several times in one evening increases "processing fluency," making the text feel smooth and familiar.',
        correctAnswer: 'True',
        explanation: 'Paragraph 3 explains that when a student reads a chapter for the third time in the same evening, the text looks smooth and easy to process, which cognitive scientists call "processing fluency."',
        passageEvidence: 'When a student reads a biology chapter for the third time in the same evening, the technical terms and diagrams look smooth, familiar, and easy to process. Cognitive scientists call this ease of reading "processing fluency."'
      },
      {
        id: 'b2-exp-edu-q2',
        type: 'true_false_not_given',
        prompt: 'Students predict their future test scores most accurately when they rate their comprehension immediately after finishing a passage.',
        correctAnswer: 'False',
        explanation: 'Paragraphs 4 and 5 state that immediate judgments are overly optimistic and have very low accuracy, whereas students who wait and use delayed recall predict their exam performance more than twice as accurately.',
        passageEvidence: 'In classic experiments initiated by Thomas Nelson and Louis Narens, students who rated their comprehension immediately after reading a passage predicted their later test scores with very low accuracy.'
      },
      {
        id: 'b2-exp-edu-q3',
        type: 'true_false_not_given',
        prompt: 'Blue ink highlighters interfere with visual reading fluency more than yellow highlighters do.',
        correctAnswer: 'Not Given',
        explanation: 'Paragraph 3 mentions yellow highlighting, but the passage never mentions blue highlighters or compares highlighter colours.',
        passageEvidence: 'Why do common study habits like repeated reading and yellow highlighting distort metacognitive calibration so severely?'
      },
      {
        id: 'b2-exp-edu-q4',
        type: 'yes_no_not_given',
        prompt: 'The author believes that students who experience the illusion of competence are usually lying about how much time they spent studying.',
        correctAnswer: 'No',
        explanation: 'In Paragraph 1, the author explicitly states that educational psychologists do not doubt the student’s honesty or effort; rather, the student fell into a cognitive trap.',
        passageEvidence: 'Educational psychologists do not doubt the student’s honesty or effort. Instead, they point to a well-documented cognitive trap known as the "illusion of competence"—a mismatch between how well learners think they know material and how well they can actually retrieve and apply it under exam conditions.'
      },
      {
        id: 'b2-exp-edu-q5',
        type: 'multiple_choice',
        prompt: 'Why does rating your understanding immediately after reading a section give a misleadingly high sense of confidence?',
        options: [
          'The exact words of the text are still held in short-term working memory, masking whether long-term storage occurred',
          'Short-term memory is completely empty right after finishing a textbook page',
          'Students always check the answer key at the back of the book before rating themselves',
          'The brain cannot read headings until twenty-four hours have passed'
        ],
        correctAnswer: 'The exact words of the text are still held in short-term working memory, masking whether long-term storage occurred',
        explanation: 'Paragraph 4 explains that immediately after reading, the exact words of the text are still echoing in short-term working memory, making immediate judgments overly optimistic.',
        passageEvidence: 'When students finish reading a section and immediately ask themselves whether they understood it, the exact words of the text are still echoing in their short-term working memory.'
      },
      {
        id: 'b2-exp-edu-q6',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 2: Thinking about one’s own thinking and monitoring whether a concept makes sense is called ______.',
        correctAnswer: 'metacognition',
        acceptedAnswers: ['metacognition'],
        explanation: 'Paragraph 2 states: "Metacognition refers to thinking about one’s own thinking".',
        passageEvidence: 'Metacognition refers to thinking about one’s own thinking: monitoring whether a concept makes sense, predicting how well one will perform on an upcoming test, and deciding which chapters require extra study time.'
      },
      {
        id: 'b2-exp-edu-q7',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 1, the word "bewildered" is closest in meaning to:',
        options: [
          'Deeply confused and surprised',
          'Delighted and proud',
          'Uninterested in university grades',
          'Relieved after finishing an exam'
        ],
        correctAnswer: 'Deeply confused and surprised',
        explanation: '"Genuinely bewildered by a low test grade" means shocked and confused because they expected a high mark.',
        passageEvidence: 'Every exam season, university professors encounter students who are genuinely bewildered by a low test grade.'
      },
      {
        id: 'b2-exp-edu-q8',
        type: 'short_answer',
        prompt: 'Answer with TWO WORDS from Paragraph 6: What alternative name is given to Explanatory Questioning, where a learner explains a process as if teaching a beginner?',
        correctAnswer: 'Feynman method',
        acceptedAnswers: ['Feynman method', 'the Feynman method'],
        explanation: 'Paragraph 6 states: "The second technique is Explanatory Questioning, often called the Feynman method".',
        passageEvidence: 'The second technique is Explanatory Questioning, often called the Feynman method: explaining how a process works step by step as if teaching an intelligent beginner.'
      },
      {
        id: 'b2-exp-edu-q9',
        type: 'matching_information',
        prompt: 'Which paragraph contrasts the ease of recognizing an open page with the harder task of recalling an explanation from a blank sheet?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4', 'Paragraph 5', 'Paragraph 6'],
        correctAnswer: 'Paragraph 3',
        explanation: 'Paragraph 3 contrasts recognition (processing fluency when the book is open) with recall (generating the explanation from a blank sheet of paper).',
        passageEvidence: 'Yet recognizing a sentence when it is right before your eyes is vastly easier than generating the explanation from a blank sheet of paper.'
      },
      {
        id: 'b2-exp-edu-q10',
        type: 'summary_completion',
        prompt: 'Complete the summary with TWO WORDS from Paragraph 5: To clear short-term memory before testing yourself, researchers recommend the "delayed ______."',
        correctAnswer: 'keyword test',
        acceptedAnswers: ['keyword test', 'delayed keyword test'],
        explanation: 'Paragraph 5 introduces the first technique as the "delayed keyword test."',
        passageEvidence: 'The first is the "delayed keyword test." Instead of judging your mastery right after reading a chapter, wait at least one hour—or until the next morning—so short-term memory clears.'
      }
    ]
  },
  {
    id: 'b2-bio-corvid-tool-manufacture',
    title: 'Compound Tool Manufacture and Causal Reasoning in New Caledonian Crows',
    level: 'B2',
    topic: 'Biology and animal behaviour',
    status: 'published',
    estimatedMinutes: 12,
    generationBatch: 'batch-expansion-b2',
    imageStatus: 'ready',
    introduction: 'Investigate how wild crows on a South Pacific island craft hooked tools and assemble multi-piece instruments to extract hidden prey.',
    illustrationAlt: 'Photograph of a black corvid bird perched on a natural wooden branch',
    passage: [
      'For much of the twentieth century, anthropologists defined tool manufacture—the deliberate shaping of raw materials into functional implements—as a uniquely human milestone, or at most a skill shared only with our closest primate relatives, such as chimpanzees. Over the past three decades, however, field biologists working on the tropical archipelago of New Caledonia in the South Pacific have overturned this assumption. Their subject is the New Caledonian crow (Corvus moneduloides), a medium-sized black forest bird whose technological sophistication rivals that of any non-human primate.',
      'In the wild, New Caledonian crows use tools daily to extract large, wood-boring beetle larvae hidden deep inside rotting candlenut trunks. Rather than merely picking up a random twig from the forest floor, the crows manufacture two distinct types of standardized tools. First, they snap live side branches from specific shrubs, strip away the leaves and bark with their beaks, and sculpt a tiny sharp crochet hook at the basal end to snag soft larvae out of narrow crevices. Second, they cut stepped, barbed probes from the stiff, saw-toothed edges of Pandanus palm leaves, leaving a neat biological "footprint" on the plant leaf that allows researchers to map regional tool traditions across different valleys.',
      'To test whether this behaviour reflects rigid genetic instinct or flexible causal reasoning, comparative psychologists at the University of Oxford and the Max Planck Institute brought wild-caught crows into temporary aviaries for controlled problem-solving experiments. In one famous study, a crow named Betty was presented with a small bucket of food sitting at the bottom of a vertical plastic tube, alongside a straight piece of garden wire. When a straight wire could not lift the bucket handle, Betty wedged the tip of the wire into a crack in the tray and pulled the other end sideways with her beak, bending a functional hook to hoist the bucket out.',
      'Even more remarkably, recent experiments have demonstrated that New Caledonian crows can construct "compound tools" by joining two or more separate parts that are individually too short to reach a food reward. In humanity’s own evolutionary record, assembling multi-component tools—such as hafting a stone spearhead onto a wooden shaft—appeared hundreds of thousands of years after simple stone flakes. Yet when researchers gave eight crows a clear box containing a food larva at the end of a long narrow track and scattered several short hollow barrels and thin plungers on the table, four of the birds spontaneously inserted a plunger into a hollow barrel without any training or demonstration.',
      'One particularly inventive crow, dubbed Mango, went further: when two combined pieces were still too short to reach the prize, he assembled chains of three and even four interlocking segments and pushed the long composite pole down the slot to retrieve the food. Control trials confirmed that the birds were not simply poking objects together at random; they only combined pieces when the food was placed beyond the reach of a single stick.',
      'Neurobiologists studying avian brains have shown that although birds lack the six-layered neocortex found in mammals, corvids possess a densely packed forebrain region called the nidopallium caudolaterale. Packed with nearly as many neurons as a small monkey’s cortex, this neural structure enables mental simulation, impulse control, and planning—proving that complex technological intelligence has evolved more than once on Earth. Field ecologists have also investigated why New Caledonian crows evolved such an extraordinary reliance on manufactured tools when most other crow species rarely use sticks in the wild. Part of the explanation lies in the ecological conditions of their island home: New Caledonia lacks woodpeckers, leaving a rich supply of protein- and fat-dense longhorn beetle larvae hidden inside decaying candlenut trees for any bird clever enough to pry them out. Moreover, unlike many songbirds that disperse from their parents a few weeks after fledging, juvenile New Caledonian crows remain with their parents for up to two years. During this extended family apprenticeship, young birds closely observe their parents’ bill movements, borrow discarded pandanus tools to practise probing bark crevices, and gradually refine their own cutting technique. Comparative studies across different valleys on Grande Terre even reveal distinct regional tool profiles—narrow, simple strips in some forests versus wide, multi-stepped designs in others—suggesting that crows pass cumulative design traditions from one generation to the next. Together, avian neurobiology and island field ecology demonstrate that cultural transmission and tool engineering are not exclusive to the primate lineage. High-speed video recordings of foraging crows in the wild further show that individuals care for their best hooked twigs as prized personal possessions. Rather than dropping a carefully sculpted hook after extracting a single beetle larva, a crow will tuck the tool securely under its foot or wedge it into a bark hole while eating, and then carry the implement in its beak to the next feeding tree. Field researchers have even observed crows modifying the curvature and shaft diameter of their hooks depending on the depth and roughness of the wood cavity they are inspecting.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'b2-exp-bio-1',
        word: 'implements',
        partOfSpeech: 'noun',
        simpleDefinition: 'Tools or instruments made to perform a specific practical job.',
        contextMeaning: 'Shaped sticks, hooks, and leaf probes crafted by crows to catch insects.',
        originalSentence: 'For much of the twentieth century, anthropologists defined tool manufacture—the deliberate shaping of raw materials into functional implements—as a uniquely human milestone, or at most a skill shared only with our closest primate relatives, such as chimpanzees.',
        exampleSentence: 'Archaeologists dug up stone farming implements from the ancient village.',
        synonyms: ['tools', 'instruments', 'utensils'],
        arabicTranslation: 'أدوات'
      },
      {
        id: 'b2-exp-bio-2',
        word: 'overturned',
        partOfSpeech: 'verb',
        simpleDefinition: 'Proved that an old belief or rule was wrong and replaced it with new evidence.',
        contextMeaning: 'Disproved the old idea that only humans and apes make complex tools.',
        originalSentence: 'Over the past three decades, however, field biologists working on the tropical archipelago of New Caledonia in the South Pacific have overturned this assumption.',
        exampleSentence: 'New telescope data overturned the old theory about how the star formed.',
        synonyms: ['disproved', 'reversed', 'refuted'],
        arabicTranslation: 'دحض / قلب الفرضية السابقة'
      },
      {
        id: 'b2-exp-bio-3',
        word: 'larvae',
        partOfSpeech: 'noun',
        simpleDefinition: 'The soft, worm-like young stage of insects such as beetles before they become adults.',
        contextMeaning: 'Large, nutritious beetle grubs hiding inside dead tree trunks.',
        originalSentence: 'In the wild, New Caledonian crows use tools daily to extract large, wood-boring beetle larvae hidden deep inside rotting candlenut trunks.',
        exampleSentence: 'Woodpeckers use their long tongues to pull insect larvae from tree bark.',
        synonyms: ['grubs', 'caterpillars'],
        arabicTranslation: 'يرقات الحشرات'
      },
      {
        id: 'b2-exp-bio-4',
        word: 'crevices',
        partOfSpeech: 'noun',
        simpleDefinition: 'Narrow cracks or deep gaps in rock or wood.',
        contextMeaning: 'Deep, narrow holes inside rotting wood where beetle grubs hide.',
        originalSentence: 'First, they snap live side branches from specific shrubs, strip away the leaves and bark with their beaks, and sculpt a tiny sharp crochet hook at the basal end to snag soft larvae out of narrow crevices.',
        exampleSentence: 'Small lizards hid inside narrow crevices in the stone wall.',
        synonyms: ['cracks', 'clefts', 'fissures'],
        arabicTranslation: 'شقوق ضيقة'
      },
      {
        id: 'b2-exp-bio-5',
        word: 'aviaries',
        partOfSpeech: 'noun',
        simpleDefinition: 'Large enclosed cages or flight rooms where birds have space to fly and behave naturally.',
        contextMeaning: 'Temporary research enclosures where wild crows solved tool puzzles before being released.',
        originalSentence: 'To test whether this behaviour reflects rigid genetic instinct or flexible causal reasoning, comparative psychologists at the University of Oxford and the Max Planck Institute brought wild-caught crows into temporary aviaries for controlled problem-solving experiments.',
        exampleSentence: 'Injured eagles recovered in spacious outdoor aviaries.',
        synonyms: ['bird enclosures', 'flight cages'],
        arabicTranslation: 'أقفاص طيور كبيرة وواسعة'
      },
      {
        id: 'b2-exp-bio-6',
        word: 'wedged',
        partOfSpeech: 'verb',
        simpleDefinition: 'Pushed or fixed something tightly into a narrow gap so it could not move.',
        contextMeaning: 'Stuck the end of the wire into a crack in the tray so she could bend it into a hook.',
        originalSentence: 'When a straight wire could not lift the bucket handle, Betty wedged the tip of the wire into a crack in the tray and pulled the other end sideways with her beak, bending a functional hook to hoist the bucket out.',
        exampleSentence: 'He wedged a wooden block under the door to keep it open.',
        synonyms: ['jammed', 'fixed tightly', 'lodged'],
        arabicTranslation: 'حشر بإحكام في شق'
      },
      {
        id: 'b2-exp-bio-7',
        word: 'hafting',
        partOfSpeech: 'noun',
        simpleDefinition: 'Attaching a sharp stone or metal blade onto a wooden handle or shaft.',
        contextMeaning: 'Joining a stone spearhead onto a wooden pole—an early human example of a compound tool.',
        originalSentence: 'In humanity’s own evolutionary record, assembling multi-component tools—such as hafting a stone spearhead onto a wooden shaft—appeared hundreds of thousands of years after simple stone flakes.',
        exampleSentence: 'Prehistoric hunters mastered the skill of hafting stone points onto wooden spears.',
        synonyms: ['mounting on a handle', 'joining'],
        arabicTranslation: 'تركيب النصل على المقبض الخشبي'
      },
      {
        id: 'b2-exp-bio-8',
        word: 'composite',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Made up of several separate parts joined together into one unit.',
        contextMeaning: 'Formed by connecting three or four short segments into one long pole.',
        originalSentence: 'One particularly inventive crow, dubbed Mango, went further: when two combined pieces were still too short to reach the prize, he assembled chains of three and even four interlocking segments and pushed the long composite pole down the slot to retrieve the food.',
        exampleSentence: 'Modern tennis rackets are made from strong composite materials.',
        synonyms: ['multi-part', 'combined', 'compound'],
        arabicTranslation: 'مركّب من عدة أجزاء'
      }
    ],
    questions: [
      {
        id: 'b2-exp-bio-q1',
        type: 'true_false_not_given',
        prompt: 'In the wild, New Caledonian crows strip leaves and bark from live twigs and sculpt a small hook at the end.',
        correctAnswer: 'True',
        explanation: 'Paragraph 2 states that they snap live side branches, strip away the leaves and bark with their beaks, and sculpt a tiny sharp crochet hook at the basal end.',
        passageEvidence: 'First, they snap live side branches from specific shrubs, strip away the leaves and bark with their beaks, and sculpt a tiny sharp crochet hook at the basal end to snag soft larvae out of narrow crevices.'
      },
      {
        id: 'b2-exp-bio-q2',
        type: 'true_false_not_given',
        prompt: 'Researchers had to train the four crows for several months before they learned how to insert a plunger into a hollow barrel.',
        correctAnswer: 'False',
        explanation: 'Paragraph 4 states that four of the birds spontaneously inserted a plunger into a hollow barrel without any training or demonstration.',
        passageEvidence: 'Yet when researchers gave eight crows a clear box containing a food larva at the end of a long narrow track and scattered several short hollow barrels and thin plungers on the table, four of the birds spontaneously inserted a plunger into a hollow barrel without any training or demonstration.'
      },
      {
        id: 'b2-exp-bio-q3',
        type: 'true_false_not_given',
        prompt: 'Female New Caledonian crows manufacture barbed Pandanus leaf probes faster than male crows do.',
        correctAnswer: 'Not Given',
        explanation: 'Paragraph 2 describes how crows cut stepped probes from Pandanus leaves, and Paragraph 3 mentions a crow named Betty and Paragraph 5 mentions Mango, but the passage never compares male and female leaf-cutting speed.',
        passageEvidence: 'Second, they cut stepped, barbed probes from the stiff, saw-toothed edges of Pandanus palm leaves, leaving a neat biological "footprint" on the plant leaf that allows researchers to map regional tool traditions across different valleys.'
      },
      {
        id: 'b2-exp-bio-q4',
        type: 'yes_no_not_given',
        prompt: 'The author concludes that a mammalian six-layered neocortex is strictly necessary for an animal to evolve complex tool-making intelligence.',
        correctAnswer: 'No',
        explanation: 'In Paragraph 6, the author explains that although birds lack the mammalian six-layered neocortex, their densely packed forebrain (nidopallium caudolaterale) enables planning and proves complex technological intelligence evolved more than once.',
        passageEvidence: 'Neurobiologists studying avian brains have shown that although birds lack the six-layered neocortex found in mammals, corvids possess a densely packed forebrain region called the nidopallium caudolaterale.'
      },
      {
        id: 'b2-exp-bio-q5',
        type: 'multiple_choice',
        prompt: 'How did researchers confirm that the crows were not simply pushing hollow barrels and plungers together by random chance?',
        options: [
          'Control trials showed the birds only combined pieces when the food was placed beyond the reach of a single stick',
          'The crows refused to touch the plungers unless a human scientist held the barrel',
          'The birds only assembled tools during the morning and took them apart at night',
          'Only crows from a single valley in New Caledonia knew how to touch plastic tubes'
        ],
        correctAnswer: 'Control trials showed the birds only combined pieces when the food was placed beyond the reach of a single stick',
        explanation: 'Paragraph 5 states that control trials confirmed the birds were not simply poking objects together at random; they only combined pieces when the food was placed beyond the reach of a single stick.',
        passageEvidence: 'Control trials confirmed that the birds were not simply poking objects together at random; they only combined pieces when the food was placed beyond the reach of a single stick.'
      },
      {
        id: 'b2-exp-bio-q6',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 3: To bend a hook in the straight wire, the crow named Betty wedged the tip into a ______ in the tray.',
        correctAnswer: 'crack',
        acceptedAnswers: ['crack'],
        explanation: 'Paragraph 3 states that Betty wedged the tip of the wire into a crack in the tray and pulled the other end sideways.',
        passageEvidence: 'When a straight wire could not lift the bucket handle, Betty wedged the tip of the wire into a crack in the tray and pulled the other end sideways with her beak, bending a functional hook to hoist the bucket out.'
      },
      {
        id: 'b2-exp-bio-q7',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 1, the word "implements" is closest in meaning to:',
        options: [
          'Tools or instruments shaped for a specific task',
          'Tropical islands in the South Pacific',
          'Feathers on the wings of a forest bird',
          'Seeds that fall from candlenut trees'
        ],
        correctAnswer: 'Tools or instruments shaped for a specific task',
        explanation: 'Paragraph 1 defines tool manufacture as "the deliberate shaping of raw materials into functional implements".',
        passageEvidence: 'For much of the twentieth century, anthropologists defined tool manufacture—the deliberate shaping of raw materials into functional implements—as a uniquely human milestone, or at most a skill shared only with our closest primate relatives, such as chimpanzees.'
      },
      {
        id: 'b2-exp-bio-q8',
        type: 'short_answer',
        prompt: 'Answer with ONE WORD from Paragraph 5: What was the name of the crow that assembled chains of three and four interlocking segments?',
        correctAnswer: 'Mango',
        acceptedAnswers: ['Mango'],
        explanation: 'Paragraph 5 names this crow Mango.',
        passageEvidence: 'One particularly inventive crow, dubbed Mango, went further: when two combined pieces were still too short to reach the prize, he assembled chains of three and even four interlocking segments and pushed the long composite pole down the slot to retrieve the food.'
      },
      {
        id: 'b2-exp-bio-q9',
        type: 'matching_information',
        prompt: 'Which paragraph describes the two distinct types of tools that New Caledonian crows manufacture in their natural forest habitat?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4', 'Paragraph 5', 'Paragraph 6'],
        correctAnswer: 'Paragraph 2',
        explanation: 'Paragraph 2 describes the hooked twigs made from live side branches and the stepped, barbed probes cut from Pandanus palm leaves.',
        passageEvidence: 'Rather than merely picking up a random twig from the forest floor, the crows manufacture two distinct types of standardized tools.'
      },
      {
        id: 'b2-exp-bio-q10',
        type: 'summary_completion',
        prompt: 'Complete the summary with TWO WORDS from Paragraph 4: Tools made by joining two or more separate parts together are known as "______."',
        correctAnswer: 'compound tools',
        acceptedAnswers: ['compound tools', 'multi-component tools'],
        explanation: 'Paragraph 4 states that New Caledonian crows can construct "compound tools" by joining two or more separate parts.',
        passageEvidence: 'Even more remarkably, recent experiments have demonstrated that New Caledonian crows can construct "compound tools" by joining two or more separate parts that are individually too short to reach a food reward.'
      }
    ]
  },
  {
    id: 'b2-hea-bacteriophage-therapy',
    title: 'Targeted Bacteriophage Therapy in the Era of Multidrug-Resistant Infections',
    level: 'B2',
    topic: 'Public health',
    status: 'published',
    estimatedMinutes: 12,
    generationBatch: 'batch-expansion-b2',
    imageStatus: 'ready',
    introduction: 'Examine how naturally occurring viruses that infect only specific bacteria are being revived as precision treatments against antibiotic-resistant superbugs.',
    illustrationAlt: 'Photograph of a microbiologist examining bacterial cultures in a laboratory Petri dish',
    passage: [
      'For nearly eighty years, chemical antibiotics such as penicillin have served as the foundation of modern medicine, turning once-fatal bacterial infections into routine, treatable conditions and making complex surgeries safe. Today, however, global health agencies warn that the world is entering a dangerous post-antibiotic crisis. Through decades of overuse in human clinics and livestock farming, several pathogenic bacteria have evolved resistance to multiple classes of drugs. When a patient contracts a "superbug" infection that no longer responds to even last-resort chemical antibiotics, doctors are increasingly turning to a century-old biological alternative: bacteriophage therapy.',
      'Bacteriophages—literally "bacteria eaters," or phages for short—are microscopic viruses that evolved in nature solely to infect and destroy bacteria. Discovered independently by Frederick Twort in 1915 and Félix d’Hérelle in 1917, phages are the most abundant biological entities on Earth, found wherever bacteria thrive, from ocean water and garden soil to the human digestive tract. Structurally, a typical phage looks like a miniature lunar lander: a geometric protein head packed with genetic material perched atop a hollow tail surrounded by spidery leg fibres.',
      'Unlike broad-spectrum chemical antibiotics, which circulate through the bloodstream and wipe out both harmful pathogens and beneficial gut microbes alike, a bacteriophage operates like a precision-guided missile. The tail fibres of a given phage recognize and bind only to specific molecular receptors on the outer surface of a single bacterial species—or even a single strain within that species. Once locked onto its target bacterium, the phage injects its genetic blueprint through its hollow tail. Within twenty to thirty minutes, the hijacked bacterium is forced to manufacture dozens of new phages until viral enzymes burst the bacterial cell wall from the inside. The newly released phages then infect neighbouring target bacteria, multiplying right at the site of infection until the last pathogen is cleared and the harmless viruses are naturally eliminated by the patient’s immune system.',
      'After penicillin became mass-produced in the 1940s, Western medicine largely abandoned phage therapy in favour of shelf-stable antibiotic pills. Yet institutes in Georgia, Poland, and Russia continued to maintain vast "phage libraries" containing thousands of catalogued viral strains. Over the past decade, high-profile compassionate-use cases in the United States, the United Kingdom, and Belgium have brought phages back into mainstream clinical research. Even more promising is an evolutionary trade-off discovered by microbiologists: when bacteria mutate their outer surface receptors to block a phage from attaching, that exact mutation often strips away the molecular pumps the bacteria use to expel chemical antibiotics—making the superbug sensitive to standard drugs once again.',
      'Nevertheless, turning living viruses into standardized hospital medicines presents unique regulatory and logistical challenges. Because each phage is so narrowly specific, a doctor cannot simply prescribe a single universal phage pill before identifying the exact bacterial strain causing a patient’s illness. Clinical laboratories must first culture the patient’s bacteria and screen them against a library of candidate phages—a process called "phage hunting" or phagogram matching—to assemble a personalized cocktail of three to five phages.',
      'To accelerate this matching process, hospital networks in Europe and North America are now combining automated robotic screening with artificial-intelligence models that predict phage-bacteria binding from genomic sequences in hours rather than days. While phages will not replace conventional antibiotics for everyday infections, combining tailored phage cocktails with existing drugs offers a powerful new defence against the world’s most stubborn pathogens. One area where this combination excels is the treatment of chronic bacterial biofilms—the slimy, protective matrices that bacteria construct on artificial knee joints, heart valves, and surgical catheters. Whereas chemical antibiotic molecules struggle to penetrate dense biofilm layers, many bacteriophages carry specialized enzymes on their tail spikes that digest the sticky polysaccharide shield and expose the dormant bacteria underneath. Bioengineers are also using CRISPR gene-editing tools to delete dormant "temperate" genes from wild phages, guaranteeing that every clinical virus follows a strictly lytic cycle that destroys its bacterial host immediately upon entry. Meanwhile, pharmaceutical formulators have engineered inhalable nebulizer mists that deliver phages directly into the lungs of cystic-fibrosis patients, as well as biodegradable hydrogel dressings that release phages slowly across chronic burn wounds. International public-health agencies and university hospital pharmacies are linking regional phage repositories through rapid cold-chain courier networks and shared genomic databases. When an intensive-care unit identifies a rare drug-resistant bacterial strain, microbiologists can query the international catalogue, verify susceptibility, and dispatch purified phage vials within twenty-four hours. Advances in spray-drying and freeze-drying also allow purified phage preparations to be stored as temperature-stable powders for over a year, expanding access to precision viral therapy in rural clinics worldwide. Regulatory authorities in Belgium, France, and the United Kingdom have further pioneered flexible "magistral preparation" frameworks that permit hospital pharmacists to compound patient-specific phage prescriptions under strict quality-control standards, bridging the gap between personalized microbiology and modern clinical safety.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'b2-exp-hea-1',
        word: 'pathogenic',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Capable of causing disease in humans, animals, or plants.',
        contextMeaning: 'Harmful disease-causing bacteria that infect patients.',
        originalSentence: 'Through decades of overuse in human clinics and livestock farming, several pathogenic bacteria have evolved resistance to multiple classes of drugs.',
        exampleSentence: 'Boiling drinking water destroys pathogenic microbes.',
        synonyms: ['disease-causing', 'infectious', 'harmful'],
        arabicTranslation: 'مُمرِض / مسبب للأمراض'
      },
      {
        id: 'b2-exp-hea-2',
        word: 'entities',
        partOfSpeech: 'noun',
        simpleDefinition: 'Distinct things or biological units that exist independently.',
        contextMeaning: 'Biological particles (viruses) found throughout nature.',
        originalSentence: 'Discovered independently by Frederick Twort in 1915 and Félix d’Hérelle in 1917, phages are the most abundant biological entities on Earth, found wherever bacteria thrive, from ocean water and garden soil to the human digestive tract.',
        exampleSentence: 'Viruses are microscopic biological entities that replicate inside host cells.',
        synonyms: ['units', 'organisms', 'forms'],
        arabicTranslation: 'كيانات / كائنات'
      },
      {
        id: 'b2-exp-hea-3',
        word: 'broad-spectrum',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Designed to kill a wide variety of different bacteria at the same time.',
        contextMeaning: 'Standard antibiotics that attack many kinds of bacteria, including helpful gut bacteria.',
        originalSentence: 'Unlike broad-spectrum chemical antibiotics, which circulate through the bloodstream and wipe out both harmful pathogens and beneficial gut microbes alike, a bacteriophage operates like a precision-guided missile.',
        exampleSentence: 'Doctors sometimes prescribe a broad-spectrum antibiotic when the exact bacterium is unknown.',
        synonyms: ['wide-ranging', 'general-purpose'],
        arabicTranslation: 'واسع الطيف'
      },
      {
        id: 'b2-exp-hea-4',
        word: 'receptors',
        partOfSpeech: 'noun',
        simpleDefinition: 'Specific chemical structures on the outside of a cell that acted like locks for matching molecules.',
        contextMeaning: 'Surface structures on a bacterium that a phage’s tail fibres grab onto.',
        originalSentence: 'The tail fibres of a given phage recognize and bind only to specific molecular receptors on the outer surface of a single bacterial species—or even a single strain within that species.',
        exampleSentence: 'Hormones attach to matching receptors on the surface of target cells.',
        synonyms: ['binding sites', 'surface locks'],
        arabicTranslation: 'مستقبلات خلوية'
      },
      {
        id: 'b2-exp-hea-5',
        word: 'hijacked',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Taken over and forced to work for an invader’s purpose.',
        contextMeaning: 'Taken over by the phage’s genetic instructions to build new viruses.',
        originalSentence: 'Within twenty to thirty minutes, the hijacked bacterium is forced to manufacture dozens of new phages until viral enzymes burst the bacterial cell wall from the inside.',
        exampleSentence: 'The virus uses the hijacked cell’s machinery to copy its own DNA.',
        synonyms: ['commandeered', 'taken over'],
        arabicTranslation: 'مختطف / مسيطر عليه'
      },
      {
        id: 'b2-exp-hea-6',
        word: 'mutate',
        partOfSpeech: 'verb',
        simpleDefinition: 'To undergo a genetic change that alters physical traits or surface structures.',
        contextMeaning: 'To change their outer surface so phages can no longer attach.',
        originalSentence: 'Even more promising is an evolutionary trade-off discovered by microbiologists: when bacteria mutate their outer surface receptors to block a phage from attaching, that exact mutation often strips away the molecular pumps the bacteria use to expel chemical antibiotics—making the superbug sensitive to standard drugs once again.',
        exampleSentence: 'Flu viruses mutate frequently from one winter to the next.',
        synonyms: ['change genetically', 'alter'],
        arabicTranslation: 'يتحور جينياً'
      },
      {
        id: 'b2-exp-hea-7',
        word: 'expel',
        partOfSpeech: 'verb',
        simpleDefinition: 'To push or force something out from inside.',
        contextMeaning: 'To pump chemical antibiotic medicine back out of the bacterial cell.',
        originalSentence: 'Even more promising is an evolutionary trade-off discovered by microbiologists: when bacteria mutate their outer surface receptors to block a phage from attaching, that exact mutation often strips away the molecular pumps the bacteria use to expel chemical antibiotics—making the superbug sensitive to standard drugs once again.',
        exampleSentence: 'Whales expel warm air and mist through their blowholes.',
        synonyms: ['eject', 'push out', 'discharge'],
        arabicTranslation: 'يطرد للخارج'
      },
      {
        id: 'b2-exp-hea-8',
        word: 'stubborn',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Very difficult to cure, remove, or defeat.',
        contextMeaning: 'Hard-to-treat bacterial infections that resist standard medicines.',
        originalSentence: 'While phages will not replace conventional antibiotics for everyday infections, combining tailored phage cocktails with existing drugs offers a powerful new defence against the world’s most stubborn pathogens.',
        exampleSentence: 'Hot water and lemon juice helped remove the stubborn stain.',
        synonyms: ['persistent', 'resistant', 'tenacious'],
        arabicTranslation: 'عنيد / مستعصٍ على العلاج'
      }
    ],
    questions: [
      {
        id: 'b2-exp-hea-q1',
        type: 'true_false_not_given',
        prompt: 'Bacteriophages were discovered independently by Frederick Twort and Félix d’Hérelle before penicillin was mass-produced in the 1940s.',
        correctAnswer: 'True',
        explanation: 'Paragraph 2 states that phages were discovered independently in 1915 and 1917, and Paragraph 4 notes that penicillin became mass-produced in the 1940s.',
        passageEvidence: 'Discovered independently by Frederick Twort in 1915 and Félix d’Hérelle in 1917, phages are the most abundant biological entities on Earth, found wherever bacteria thrive, from ocean water and garden soil to the human digestive tract.'
      },
      {
        id: 'b2-exp-hea-q2',
        type: 'true_false_not_given',
        prompt: 'A single bacteriophage strain can infect and destroy every species of bacteria in the human body.',
        correctAnswer: 'False',
        explanation: 'Paragraphs 3 and 5 explain that phages are narrowly specific, binding only to receptors on a single bacterial species or strain while leaving beneficial gut microbes unharmed.',
        passageEvidence: 'The tail fibres of a given phage recognize and bind only to specific molecular receptors on the outer surface of a single bacterial species—or even a single strain within that species.'
      },
      {
        id: 'b2-exp-hea-q3',
        type: 'true_false_not_given',
        prompt: 'The phage library in Poland contains more viral strains than the phage library in Georgia.',
        correctAnswer: 'Not Given',
        explanation: 'Paragraph 4 mentions institutes in Georgia, Poland, and Russia maintaining vast phage libraries, but it never compares the number of strains held in Poland versus Georgia.',
        passageEvidence: 'Yet institutes in Georgia, Poland, and Russia continued to maintain vast "phage libraries" containing thousands of catalogued viral strains.'
      },
      {
        id: 'b2-exp-hea-q4',
        type: 'yes_no_not_given',
        prompt: 'The author predicts that bacteriophages will completely replace conventional chemical antibiotics for all everyday infections.',
        correctAnswer: 'No',
        explanation: 'In Paragraph 6, the author explicitly states: "While phages will not replace conventional antibiotics for everyday infections, combining tailored phage cocktails with existing drugs offers a powerful new defence".',
        passageEvidence: 'While phages will not replace conventional antibiotics for everyday infections, combining tailored phage cocktails with existing drugs offers a powerful new defence against the world’s most stubborn pathogens.'
      },
      {
        id: 'b2-exp-hea-q5',
        type: 'multiple_choice',
        prompt: 'What beneficial evolutionary trade-off occurs when bacteria mutate their surface receptors to block a phage from attaching?',
        options: [
          'The mutation often removes the molecular pumps bacteria use to expel antibiotics, making them sensitive to standard drugs again',
          'The mutated bacteria transform into harmless human blood cells',
          'The bacteria lose their ability to survive at normal human body temperature',
          'The mutation causes the bacteria to glow brightly under hospital lights'
        ],
        correctAnswer: 'The mutation often removes the molecular pumps bacteria use to expel antibiotics, making them sensitive to standard drugs again',
        explanation: 'Paragraph 4 explains that when bacteria mutate their outer surface receptors to block a phage, that exact mutation often strips away the molecular pumps they use to expel chemical antibiotics.',
        passageEvidence: 'Even more promising is an evolutionary trade-off discovered by microbiologists: when bacteria mutate their outer surface receptors to block a phage from attaching, that exact mutation often strips away the molecular pumps the bacteria use to expel chemical antibiotics—making the superbug sensitive to standard drugs once again.'
      },
      {
        id: 'b2-exp-hea-q6',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 3: After all target bacteria are cleared, the harmless phages are naturally eliminated by the patient’s ______ system.',
        correctAnswer: 'immune',
        acceptedAnswers: ['immune'],
        explanation: 'Paragraph 3 states that the harmless viruses are naturally eliminated by the patient’s immune system.',
        passageEvidence: 'The newly released phages then infect neighbouring target bacteria, multiplying right at the site of infection until the last pathogen is cleared and the harmless viruses are naturally eliminated by the patient’s immune system.'
      },
      {
        id: 'b2-exp-hea-q7',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 3, the term "broad-spectrum" is closest in meaning to:',
        options: [
          'Acting against a wide variety of different bacteria at once',
          'Targeting only one specific viral enzyme',
          'Visible under bright rainbow light in a microscope',
          'Stored in cold hospital refrigerators for ten years'
        ],
        correctAnswer: 'Acting against a wide variety of different bacteria at once',
        explanation: 'Paragraph 3 contrasts broad-spectrum chemical antibiotics—which wipe out both harmful pathogens and beneficial gut microbes alike—with narrowly specific phages.',
        passageEvidence: 'Unlike broad-spectrum chemical antibiotics, which circulate through the bloodstream and wipe out both harmful pathogens and beneficial gut microbes alike, a bacteriophage operates like a precision-guided missile.'
      },
      {
        id: 'b2-exp-hea-q8',
        type: 'short_answer',
        prompt: 'Answer with TWO WORDS from Paragraph 5: What is the laboratory process of screening a patient’s bacteria against a library of candidate phages called?',
        correctAnswer: 'phage hunting',
        acceptedAnswers: ['phage hunting', 'phagogram matching'],
        explanation: 'Paragraph 5 states that this screening process is called "phage hunting" or phagogram matching.',
        passageEvidence: 'Clinical laboratories must first culture the patient’s bacteria and screen them against a library of candidate phages—a process called "phage hunting" or phagogram matching—to assemble a personalized cocktail of three to five phages.'
      },
      {
        id: 'b2-exp-hea-q9',
        type: 'matching_information',
        prompt: 'Which paragraph explains how a bacteriophage locks onto surface receptors, injects its genetic blueprint, and bursts a bacterial cell from the inside?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4', 'Paragraph 5', 'Paragraph 6'],
        correctAnswer: 'Paragraph 3',
        explanation: 'Paragraph 3 describes how the phage binds to specific molecular receptors, injects its genetic blueprint through its hollow tail, and bursts the bacterial cell wall from the inside.',
        passageEvidence: 'Once locked onto its target bacterium, the phage injects its genetic blueprint through its hollow tail. Within twenty to thirty minutes, the hijacked bacterium is forced to manufacture dozens of new phages until viral enzymes burst the bacterial cell wall from the inside.'
      },
      {
        id: 'b2-exp-hea-q10',
        type: 'summary_completion',
        prompt: 'Complete the summary with ONE WORD from Paragraph 5: Because each phage is narrowly specific, laboratories assemble a personalized ______ of three to five phages for a patient.',
        correctAnswer: 'cocktail',
        acceptedAnswers: ['cocktail'],
        explanation: 'Paragraph 5 states that laboratories assemble a personalized cocktail of three to five phages.',
        passageEvidence: 'Clinical laboratories must first culture the patient’s bacteria and screen them against a library of candidate phages—a process called "phage hunting" or phagogram matching—to assemble a personalized cocktail of three to five phages.'
      }
    ]
  },
  {
    id: 'b2-eco-congestion-curbside-logistics',
    title: 'Urban Freight Consolidation and the Economics of Last-Mile Delivery',
    level: 'B2',
    topic: 'Economics and society',
    status: 'published',
    estimatedMinutes: 12,
    generationBatch: 'batch-expansion-b2',
    imageStatus: 'ready',
    introduction: 'Analyze why the final kilometre of parcel delivery accounts for over half of shipping costs and how micro-consolidation hubs reduce urban gridlock.',
    illustrationAlt: 'Photograph of urban traffic and delivery lanes in a busy metropolitan commercial street',
    passage: [
      'In global supply-chain economics, moving ten thousand shoes in a steel shipping container across the Pacific Ocean on a cargo vessel is remarkably cheap and energy-efficient per item. The economic headache begins when those shoes reach the edge of a city and must be delivered individually to thousands of separate apartment doors. Logistics economists refer to this final stage of transport as the "last mile"—and across modern e-commerce networks, that single final kilometre frequently accounts for more than fifty percent of the total cost of shipping a parcel.',
      'The surge in next-day online shopping over the past decade has exposed a severe mismatch between residential delivery demand and twentieth-century street design. In a traditional parcel network, four or five competing courier companies dispatch large diesel vans from suburban warehouses into the same city neighbourhood every morning. Because each van carries parcels for only its own company’s customers, vehicles often circulate half-empty down narrow residential streets. Worse still, most city blocks were built with kerbside space for private cars rather than commercial loading. With nowhere legal to park, delivery drivers double-park in active traffic or cycle lanes while climbing apartment stairs, triggering cascading traffic jams behind them.',
      'Transport economists calculate that in dense districts of London, Paris, and New York, delivery vans spend up to forty percent of their working shift simply searching for kerbside space or walking between the vehicle and building entrances. Furthermore, up to fifteen percent of first-time home deliveries fail because the recipient is at work, forcing the courier to haul the package back to the depot and repeat the journey the next day. The combined result is wasted driver wages, elevated diesel emissions, and chronic street congestion.',
      'To break this bottleneck, municipal authorities and logistics firms are redesigning urban freight around two complementary innovations: micro-consolidation hubs and shared automated parcel lockers. Under a micro-consolidation model, large diesel or electric trucks do not enter the historic city centre at all. Instead, they drop off sorted crates at compact neighbourhood transfer hubs—often housed in underused underground car parks or railway arches—on the edge of low-emission zones. From these hubs, electric cargo bicycles and compact zero-emission quadricycles complete the final five hundred metres to customers’ doors.',
      'Empirical studies in Dutch, German, and British cities demonstrate that electric cargo bikes outperform conventional vans in dense urban cores. Because a cargo bike can use cycle lanes, filter past stationary traffic, and park legally on wide pavements right outside a building entrance without blocking cars, a rider completes up to twenty-five percent more stops per hour than a van driver while consuming less than a tenth of the energy. Meanwhile, installing weatherproof, carrier-agnostic parcel lockers at transit stations and supermarket forecourts allows a courier to drop off forty packages at a single stop in ten minutes, eliminating failed home visits altogether.',
      'Economists caution, however, that parcel lockers and micro-hubs only achieve their full social benefit when cities enforce "open-access" rules. If five competing courier firms each build their own exclusive locker bank on the same street corner, valuable public pavement is wasted. When municipal governments license neutral, shared infrastructure and pair it with dynamic digital kerbside booking for heavy freight, cities can cut delivery congestion by a third while keeping commerce flowing smoothly. Dynamic kerbside management uses embedded ground sensors and overhead cameras to treat the street edge as a flexible, time-shared asset rather than a permanent car park. Between six and ten in the morning, a fifty-metre bay outside a commercial high street operates strictly as a bookable loading zone for restaurant supply lorries and micro-consolidation vans; from mid-morning until evening, the same kerb space converts into cycle-freight bays and accessible passenger drop-off points, before serving evening dining terraces at night. Commercial truck operators book a fifteen-minute unloading window through a municipal smartphone platform, eliminating the thirty minutes per trip that drivers previously wasted circling city blocks in search of an illegal double-parking gap. In parallel, several port and river cities—including Amsterdam, Paris, and London—have begun shifting bulk e-commerce consolidation from ring-road motorways onto electric canal barges and off-peak commuter rail trams that feed directly into central cargo-bike depots. Integrating digital kerb pricing, shared neighbourhood lockers, and multimodal zero-emission freight demonstrates that modern cities can accommodate booming e-commerce demand while reclaiming quieter, safer streets for pedestrians. Urban air-quality monitoring in districts that have adopted shared micro-consolidation hubs also shows measurable drops in roadside nitrogen dioxide and brake-dust particulates within the first twelve months. Moreover, retail associations report that replacing rows of idling delivery vans with quiet cargo bicycles makes high-street pavements more inviting for shoppers and outdoor cafés, proving that smarter last-mile logistics strengthens both environmental health and local neighbourhood vitality. Several university campuses and hospital complexes have adopted the exact same consolidation model for internal mail and laboratory supplies, cutting daily truck movements across pedestrian walkways by more than seventy percent. Thoughtful coordination at the final kilometre turns an urban bottleneck into a model of civic efficiency.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'b2-exp-eco-1',
        word: 'logistics',
        partOfSpeech: 'noun',
        simpleDefinition: 'The detailed organization and management of moving goods from factories to customers.',
        contextMeaning: 'The planning and operation of freight and parcel transport networks.',
        originalSentence: 'Logistics economists refer to this final stage of transport as the "last mile"—and across modern e-commerce networks, that single final kilometre frequently accounts for more than fifty percent of the total cost of shipping a parcel.',
        exampleSentence: 'Efficient warehouse logistics ensures that fresh food reaches supermarkets on time.',
        synonyms: ['supply-chain management', 'freight planning'],
        arabicTranslation: 'الخدمات اللوجستية (إدارة النقل والإمداد)'
      },
      {
        id: 'b2-exp-eco-2',
        word: 'dispatch',
        partOfSpeech: 'verb',
        simpleDefinition: 'To send vehicles, workers, or parcels out to a destination for a specific job.',
        contextMeaning: 'To send delivery vans out from suburban warehouses into city streets.',
        originalSentence: 'In a traditional parcel network, four or five competing courier companies dispatch large diesel vans from suburban warehouses into the same city neighbourhood every morning.',
        exampleSentence: 'The fire station can dispatch two emergency trucks within sixty seconds.',
        synonyms: ['send out', 'deploy'],
        arabicTranslation: 'يرسل / يوفد'
      },
      {
        id: 'b2-exp-eco-3',
        word: 'cascading',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Spreading rapidly from one point to cause a chain of further problems.',
        contextMeaning: 'One blocked lane causing traffic queues that spread backward across many streets.',
        originalSentence: 'With nowhere legal to park, delivery drivers double-park in active traffic or cycle lanes while climbing apartment stairs, triggering cascading traffic jams behind them.',
        exampleSentence: 'A single delayed morning train caused cascading delays across the rail line.',
        synonyms: ['chain-reaction', 'domino-effect'],
        arabicTranslation: 'متسلسل / متتالي الأثر'
      },
      {
        id: 'b2-exp-eco-4',
        word: 'recipient',
        partOfSpeech: 'noun',
        simpleDefinition: 'The person who receives a letter, package, or award.',
        contextMeaning: 'The customer at home waiting to receive an online shopping parcel.',
        originalSentence: 'Furthermore, up to fifteen percent of first-time home deliveries fail because the recipient is at work, forcing the courier to haul the package back to the depot and repeat the journey the next day.',
        exampleSentence: 'The courier asked the recipient to sign for the package.',
        synonyms: ['receiver', 'addressee'],
        arabicTranslation: 'المستلِم'
      },
      {
        id: 'b2-exp-eco-5',
        word: 'depot',
        partOfSpeech: 'noun',
        simpleDefinition: 'A large central warehouse or garage where buses, trucks, or parcels are stored and sorted.',
        contextMeaning: 'The suburban sorting warehouse where undelivered parcels are taken back at night.',
        originalSentence: 'Furthermore, up to fifteen percent of first-time home deliveries fail because the recipient is at work, forcing the courier to haul the package back to the depot and repeat the journey the next day.',
        exampleSentence: 'City buses return to the main depot every night for cleaning.',
        synonyms: ['warehouse', 'distribution centre'],
        arabicTranslation: 'مستودع مركزي / مرآب'
      },
      {
        id: 'b2-exp-eco-6',
        word: 'consolidation',
        partOfSpeech: 'noun',
        simpleDefinition: 'Combining many separate small loads into one organized shipment or transfer point.',
        contextMeaning: 'Bringing parcels together at a local neighbourhood hub before final delivery by cargo bike.',
        originalSentence: 'To break this bottleneck, municipal authorities and logistics firms are redesigning urban freight around two complementary innovations: micro-consolidation hubs and shared automated parcel lockers.',
        exampleSentence: 'Freight consolidation reduces the number of half-empty trucks on the highway.',
        synonyms: ['combining', 'pooling', 'integration'],
        arabicTranslation: 'تجميع الشحنات وتوحيدها'
      },
      {
        id: 'b2-exp-eco-7',
        word: 'empirical',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Based on real-world observation, measurement, and experiment rather than theory alone.',
        contextMeaning: 'Measured in actual city street trials in the Netherlands, Germany, and the UK.',
        originalSentence: 'Empirical studies in Dutch, German, and British cities demonstrate that electric cargo bikes outperform conventional vans in dense urban cores.',
        exampleSentence: 'The engineers gathered empirical data from fifty city intersections.',
        synonyms: ['observational', 'real-world', 'measured'],
        arabicTranslation: 'تجريبي / مبني على القياس الواقعي'
      },
      {
        id: 'b2-exp-eco-8',
        word: 'exclusive',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Restricted to only one company or group and closed to everyone else.',
        contextMeaning: 'Usable by only a single delivery company rather than shared across all couriers.',
        originalSentence: 'If five competing courier firms each build their own exclusive locker bank on the same street corner, valuable public pavement is wasted.',
        exampleSentence: 'The hotel guests had exclusive use of the rooftop swimming pool.',
        synonyms: ['private', 'single-company', 'restricted'],
        arabicTranslation: 'حصري'
      }
    ],
    questions: [
      {
        id: 'b2-exp-eco-q1',
        type: 'true_false_not_given',
        prompt: 'Across modern e-commerce networks, the final kilometre of delivery frequently accounts for over half of the total cost of shipping a parcel.',
        correctAnswer: 'True',
        explanation: 'Paragraph 1 states that across modern e-commerce networks, that single final kilometre frequently accounts for more than fifty percent of the total cost of shipping a parcel.',
        passageEvidence: 'Logistics economists refer to this final stage of transport as the "last mile"—and across modern e-commerce networks, that single final kilometre frequently accounts for more than fifty percent of the total cost of shipping a parcel.'
      },
      {
        id: 'b2-exp-eco-q2',
        type: 'true_false_not_given',
        prompt: 'In dense city centres, conventional diesel vans complete more stops per hour than electric cargo bicycles.',
        correctAnswer: 'False',
        explanation: 'Paragraph 5 states that electric cargo bikes outperform conventional vans in dense urban cores, completing up to twenty-five percent more stops per hour than a van driver.',
        passageEvidence: 'Because a cargo bike can use cycle lanes, filter past stationary traffic, and park legally on wide pavements right outside a building entrance without blocking cars, a rider completes up to twenty-five percent more stops per hour than a van driver while consuming less than a tenth of the energy.'
      },
      {
        id: 'b2-exp-eco-q3',
        type: 'true_false_not_given',
        prompt: 'Underground car parks in Paris charge higher rent for micro-consolidation hubs than railway arches in London.',
        correctAnswer: 'Not Given',
        explanation: 'Paragraph 3 mentions London, Paris, and New York, and Paragraph 4 mentions underground car parks and railway arches, but the passage never compares their rental prices.',
        passageEvidence: 'Instead, they drop off sorted crates at compact neighbourhood transfer hubs—often housed in underused underground car parks or railway arches—on the edge of low-emission zones.'
      },
      {
        id: 'b2-exp-eco-q4',
        type: 'yes_no_not_given',
        prompt: 'The author favours shared, open-access parcel lockers over separate company-exclusive locker banks on public streets.',
        correctAnswer: 'Yes',
        explanation: 'In Paragraph 6, the author warns that if five competing firms build exclusive locker banks on the same corner, pavement is wasted, whereas licensing neutral, shared infrastructure cuts congestion.',
        passageEvidence: 'Economists caution, however, that parcel lockers and micro-hubs only achieve their full social benefit when cities enforce "open-access" rules.'
      },
      {
        id: 'b2-exp-eco-q5',
        type: 'multiple_choice',
        prompt: 'Why do delivery vans in dense cities like London and New York cause so much street congestion?',
        options: [
          'Competing vans circulate half-empty and double-park in traffic lanes because streets lack commercial loading space',
          'Cargo ships unload steel shipping containers directly onto residential sidewalks',
          'Electric cargo bikes block vans from entering suburban warehouses in the morning',
          'Traffic laws require every delivery van to drive at five kilometres per hour'
        ],
        correctAnswer: 'Competing vans circulate half-empty and double-park in traffic lanes because streets lack commercial loading space',
        explanation: 'Paragraph 2 explains that competing courier vans circulate half-empty and double-park in active traffic or cycle lanes because blocks lack commercial loading space.',
        passageEvidence: 'With nowhere legal to park, delivery drivers double-park in active traffic or cycle lanes while climbing apartment stairs, triggering cascading traffic jams behind them.'
      },
      {
        id: 'b2-exp-eco-q6',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 3: Up to fifteen percent of first-time home deliveries fail because the ______ is at work.',
        correctAnswer: 'recipient',
        acceptedAnswers: ['recipient'],
        explanation: 'Paragraph 3 states that up to fifteen percent of first-time home deliveries fail because the recipient is at work.',
        passageEvidence: 'Furthermore, up to fifteen percent of first-time home deliveries fail because the recipient is at work, forcing the courier to haul the package back to the depot and repeat the journey the next day.'
      },
      {
        id: 'b2-exp-eco-q7',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 5, the word "empirical" is closest in meaning to:',
        options: [
          'Based on real-world measurement and observation',
          'Imagined in a science-fiction story',
          'Secretly funded by diesel truck manufacturers',
          'Outdated and no longer used by economists'
        ],
        correctAnswer: 'Based on real-world measurement and observation',
        explanation: '"Empirical studies in Dutch, German, and British cities" refers to real-world field studies and measurements.',
        passageEvidence: 'Empirical studies in Dutch, German, and British cities demonstrate that electric cargo bikes outperform conventional vans in dense urban cores.'
      },
      {
        id: 'b2-exp-eco-q8',
        type: 'short_answer',
        prompt: 'Answer with TWO WORDS from Paragraph 3: Up to what percentage of their working shift do delivery van drivers in dense districts spend searching for kerbside space or walking to doors?',
        correctAnswer: 'forty percent',
        acceptedAnswers: ['forty percent', '40 percent', '40%'],
        explanation: 'Paragraph 3 states that delivery vans spend up to forty percent of their working shift simply searching for kerbside space or walking between the vehicle and building entrances.',
        passageEvidence: 'Transport economists calculate that in dense districts of London, Paris, and New York, delivery vans spend up to forty percent of their working shift simply searching for kerbside space or walking between the vehicle and building entrances.'
      },
      {
        id: 'b2-exp-eco-q9',
        type: 'matching_information',
        prompt: 'Which paragraph explains how neighbourhood transfer hubs work together with electric cargo bicycles?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4', 'Paragraph 5', 'Paragraph 6'],
        correctAnswer: 'Paragraph 4',
        explanation: 'Paragraph 4 describes large trucks dropping sorted crates at micro-consolidation hubs on the edge of low-emission zones, from which electric cargo bikes complete the final 500 metres.',
        passageEvidence: 'From these hubs, electric cargo bicycles and compact zero-emission quadricycles complete the final five hundred metres to customers’ doors.'
      },
      {
        id: 'b2-exp-eco-q10',
        type: 'summary_completion',
        prompt: 'Complete the summary with TWO WORDS from Paragraph 5: Installing weatherproof, carrier-agnostic ______ at transit stations allows a courier to drop off forty packages at a single stop.',
        correctAnswer: 'parcel lockers',
        acceptedAnswers: ['parcel lockers', 'automated parcel lockers', 'lockers'],
        explanation: 'Paragraph 5 states that installing weatherproof, carrier-agnostic parcel lockers at transit stations allows a courier to drop off forty packages at a single stop.',
        passageEvidence: 'Meanwhile, installing weatherproof, carrier-agnostic parcel lockers at transit stations and supermarket forecourts allows a courier to drop off forty packages at a single stop in ten minutes, eliminating failed home visits altogether.'
      }
    ]
  },
  {
    id: 'b2-ast-lagrange-point-observatories',
    title: 'Gravitational Equilibrium: Why Deep-Space Telescopes Orbit Lagrange Points',
    level: 'B2',
    topic: 'Astronomy and space exploration',
    status: 'published',
    estimatedMinutes: 12,
    generationBatch: 'batch-expansion-b2',
    imageStatus: 'ready',
    introduction: 'Explore the eighteenth-century celestial mechanics behind the five Lagrange points and why L2 is the premier home for infrared space telescopes.',
    illustrationAlt: 'Photograph of astronomical observatory domes beneath a clear starry night sky',
    passage: [
      'When the Hubble Space Telescope was launched in 1990, NASA placed it in low Earth orbit roughly 540 kilometres above the ground. Circling the planet every ninety-five minutes, Hubble has captured breathtaking visible-light images of galaxies and nebulae for more than three decades. Yet when engineers designed its successor—the James Webb Space Telescope (JWST)—as well as the European Space Agency’s Gaia and Euclid observatories, they did not place them in Earth orbit at all. Instead, they sent these spacecraft 1.5 million kilometres away—nearly four times the distance to the Moon—to an invisible gravitational balancing spot in space known as the Second Sun-Earth Lagrange Point, or L2.',
      'The existence of such balancing points was predicted in 1772 by the Italian-French mathematician Joseph-Louis Lagrange while studying the famous "three-body problem" of celestial mechanics. Normally, a spacecraft orbiting closer to the Sun than Earth has a shorter orbital path and travels faster, completing a lap around the Sun in less than 365 days; a spacecraft orbiting farther out than Earth travels more slowly and takes longer than a year. Lagrange calculated, however, that in any rotating system of two massive bodies—such as the Sun and the Earth—there are exactly five specific positions where the combined gravitational pull of both bodies precisely matches the centripetal force required for a small third object to orbit the Sun in lockstep with Earth.',
      'Three of these five locations—labelled L1, L2, and L3—lie along the straight line connecting the centres of the Sun and the Earth. The L1 point sits 1.5 million kilometres sunward of Earth, providing an uninterrupted view of solar flares and the solar wind; satellites stationed at L1 give Earth early warning of geomagnetic storms. The L2 point lies 1.5 million kilometres in the exact opposite direction, directly behind Earth as viewed from the Sun. The L3 point lies on the far side of the Sun’s orbit, while L4 and L5 form equilateral triangles sixty degrees ahead of and behind Earth along its orbital path.',
      'Why is the L2 point so valuable for modern infrared astronomy? Unlike visible-light telescopes, an infrared observatory like JWST is designed to detect the faint heat signatures of the universe’s earliest stars and distant exoplanet atmospheres. To sense such tiny amounts of cosmic heat, the telescope’s mirrors and detectors must be kept colder than minus 220 degrees Celsius. In low Earth orbit, a telescope is constantly bathed in intense heat radiating from Earth’s sunlit surface and the Moon, and it passes in and out of Earth’s shadow every forty-five minutes, causing thermal expansion and contraction. At L2, by contrast, the Sun, Earth, and Moon are always in the same direction behind the spacecraft. This geometry allows a single five-layer, tennis-court-sized sunshield to block heat and light from all three bodies simultaneously, keeping the telescope permanently in cold, stable shadow.',
      'Curiously, the L1, L2, and L3 points are mathematically "metastable"—comparable to balancing a marble atop a saddle. While L4 and L5 act like gravitational bowls that naturally trap asteroids and cosmic dust, a spacecraft placed directly at L2 will slowly drift away if left uncorrected. Paradoxically, mission controllers prefer it this way: because L2 does not accumulate clouds of space rocks, it is a much cleaner and safer environment for delicate mirrors.',
      'Rather than sitting motionless at the exact L2 point, space observatories fly in a wide, looping "halo orbit" around L2, ensuring that the spacecraft never slips into Earth’s shadow where its solar power panels would go dark. By firing tiny thrusters for a few seconds every three weeks, an observatory can maintain its halo orbit for decades while surveying the cosmos uninterrupted. Operating 1.5 million kilometres from Earth also imposes uncompromising engineering demands prior to launch, because no crewed servicing mission can currently travel nearly four times farther than the Moon to repair a jammed mirror or replace a faulty camera. Whereas astronauts aboard the Space Shuttle were able to visit the low-Earth-orbit Hubble Space Telescope five times to upgrade its optics, an L2 observatory such as the James Webb Space Telescope had to execute more than three hundred single-point-failure deployments—unfolding its five-layer tennis-court-sized sunshield and snapping eighteen gold-coated beryllium mirror segments into nanometre alignment—entirely by remote command. Meanwhile, solar physicists make equally vital use of the sunward L1 Lagrange point, located 1.5 million kilometres directly between Earth and the Sun. Stationed at L1, spacecraft such as SOHO and the Deep Space Climate Observatory enjoy an unbroken view of solar flares and coronal mass ejections, providing power-grid operators and satellite controllers on Earth with crucial early warning up to an hour before a geomagnetic storm strikes our planet’s magnetosphere. Future flagship missions—including the Nancy Grace Roman Space Telescope and the Habitable Worlds Observatory—are also being designed to operate in halo orbits around L2, where they will search for oxygen and water-vapour signatures in the atmospheres of rocky Earth-sized exoplanets. Two centuries after Joseph-Louis Lagrange solved a theoretical puzzle on paper, his five gravitational equilibrium points have become the busiest scientific outposts in deep space.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'b2-exp-ast-1',
        word: 'nebulae',
        partOfSpeech: 'noun',
        simpleDefinition: 'Giant clouds of glowing gas and dust in outer space where stars are born.',
        contextMeaning: 'Distant cosmic clouds photographed by space telescopes.',
        originalSentence: 'Circling the planet every ninety-five minutes, Hubble has captured breathtaking visible-light images of galaxies and nebulae for more than three decades.',
        exampleSentence: 'Telescopes revealed young stars forming inside the Orion nebulae.',
        synonyms: ['interstellar clouds', 'cosmic dust clouds'],
        arabicTranslation: 'السُدُم الفضائية'
      },
      {
        id: 'b2-exp-ast-2',
        word: 'successor',
        partOfSpeech: 'noun',
        simpleDefinition: 'A new machine, person, or system that comes after another and takes over its role.',
        contextMeaning: 'The James Webb Space Telescope, built to follow the Hubble Space Telescope.',
        originalSentence: 'Yet when engineers designed its successor—the James Webb Space Telescope (JWST)—as well as the European Space Agency’s Gaia and Euclid observatories, they did not place them in Earth orbit at all.',
        exampleSentence: 'The new high-speed train is the successor to the old diesel locomotive.',
        synonyms: ['replacement', 'next generation'],
        arabicTranslation: 'الخَلَف / الجيل التالي'
      },
      {
        id: 'b2-exp-ast-3',
        word: 'celestial',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Relating to the sky, outer space, and the movement of planets and stars.',
        contextMeaning: 'The physics of how planets, moons, and spacecraft move in space.',
        originalSentence: 'The existence of such balancing points was predicted in 1772 by the Italian-French mathematician Joseph-Louis Lagrange while studying the famous "three-body problem" of celestial mechanics.',
        exampleSentence: 'Comets and eclipses are fascinating celestial events.',
        synonyms: ['astronomical', 'heavenly', 'cosmic'],
        arabicTranslation: 'سماوي / فلكي'
      },
      {
        id: 'b2-exp-ast-4',
        word: 'lockstep',
        partOfSpeech: 'noun',
        simpleDefinition: 'Moving at the exact same rate and staying lined up together.',
        contextMeaning: 'Orbiting the Sun in exactly 365 days so the spacecraft stays aligned with Earth.',
        originalSentence: 'Lagrange calculated, however, that in any rotating system of two massive bodies—such as the Sun and the Earth—there are exactly five specific positions where the combined gravitational pull of both bodies precisely matches the centripetal force required for a small third object to orbit the Sun in lockstep with Earth.',
        exampleSentence: 'The two satellites moved in lockstep around the planet.',
        synonyms: ['synchrony', 'exact alignment'],
        arabicTranslation: 'تزامن تام في الحركة'
      },
      {
        id: 'b2-exp-ast-5',
        word: 'uninterrupted',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Continuous and never blocked or broken.',
        contextMeaning: 'Never blocked by the Earth or Moon passing in front of the view.',
        originalSentence: 'The L1 point sits 1.5 million kilometres sunward of Earth, providing an uninterrupted view of solar flares and the solar wind; satellites stationed at L1 give Earth early warning of geomagnetic storms.',
        exampleSentence: 'The hilltop tower has an uninterrupted view of the coastline.',
        synonyms: ['continuous', 'unbroken', 'unobstructed'],
        arabicTranslation: 'غير منقطع / متواصل'
      },
      {
        id: 'b2-exp-ast-6',
        word: 'signatures',
        partOfSpeech: 'noun',
        simpleDefinition: 'Distinctive patterns, signals, or traces that identify something.',
        contextMeaning: 'Faint infrared heat signals coming from distant stars and planets.',
        originalSentence: 'Unlike visible-light telescopes, an infrared observatory like JWST is designed to detect the faint heat signatures of the universe’s earliest stars and distant exoplanet atmospheres.',
        exampleSentence: 'Scientists look for chemical signatures of water in planet atmospheres.',
        synonyms: ['signals', 'traces', 'markers'],
        arabicTranslation: 'بصمات / إشارات مميزة'
      },
      {
        id: 'b2-exp-ast-7',
        word: 'accumulate',
        partOfSpeech: 'verb',
        simpleDefinition: 'To gather or collect in one place over time.',
        contextMeaning: 'To trap and build up clouds of space dust and rocks.',
        originalSentence: 'Paradoxically, mission controllers prefer it this way: because L2 does not accumulate clouds of space rocks, it is a much cleaner and safer environment for delicate mirrors.',
        exampleSentence: 'Fallen leaves accumulate in the corners of the courtyard.',
        synonyms: ['collect', 'gather', 'build up'],
        arabicTranslation: 'يتراكم / يتجمع'
      },
      {
        id: 'b2-exp-ast-8',
        word: 'thrusters',
        partOfSpeech: 'noun',
        simpleDefinition: 'Small rocket engines on a spacecraft used to make fine adjustments to its position or path.',
        contextMeaning: 'Small steering jets fired every three weeks to keep the telescope in its halo orbit.',
        originalSentence: 'By firing tiny thrusters for a few seconds every three weeks, an observatory can maintain its halo orbit for decades while surveying the cosmos uninterrupted.',
        exampleSentence: 'The astronaut fired the small thrusters to dock with the space station.',
        synonyms: ['steering rockets', 'manoeuvring jets'],
        arabicTranslation: 'محركات دفع وتوجيه صغيرة'
      }
    ],
    questions: [
      {
        id: 'b2-exp-ast-q1',
        type: 'true_false_not_given',
        prompt: 'The Second Sun-Earth Lagrange Point (L2) is located roughly 1.5 million kilometres from Earth, nearly four times farther than the Moon.',
        correctAnswer: 'True',
        explanation: 'Paragraph 1 states that engineers sent these spacecraft 1.5 million kilometres away—nearly four times the distance to the Moon—to L2.',
        passageEvidence: 'Instead, they sent these spacecraft 1.5 million kilometres away—nearly four times the distance to the Moon—to an invisible gravitational balancing spot in space known as the Second Sun-Earth Lagrange Point, or L2.'
      },
      {
        id: 'b2-exp-ast-q2',
        type: 'true_false_not_given',
        prompt: 'A spacecraft parked at L2 can turn off its thrusters forever because L2 acts like a deep gravitational bowl that traps objects permanently.',
        correctAnswer: 'False',
        explanation: 'Paragraphs 5 and 6 explain that L4 and L5 act like gravitational bowls, whereas L2 is only metastable (like a saddle) and requires firing tiny thrusters every three weeks to prevent drifting.',
        passageEvidence: 'While L4 and L5 act like gravitational bowls that naturally trap asteroids and cosmic dust, a spacecraft placed directly at L2 will slowly drift away if left uncorrected.'
      },
      {
        id: 'b2-exp-ast-q3',
        type: 'true_false_not_given',
        prompt: 'The European Space Agency’s Gaia observatory uses larger solar panels than the Euclid observatory.',
        correctAnswer: 'Not Given',
        explanation: 'Paragraph 1 mentions both Gaia and Euclid, and Paragraph 6 mentions solar power panels, but the passage never compares the size of Gaia’s and Euclid’s solar panels.',
        passageEvidence: 'Yet when engineers designed its successor—the James Webb Space Telescope (JWST)—as well as the European Space Agency’s Gaia and Euclid observatories, they did not place them in Earth orbit at all.'
      },
      {
        id: 'b2-exp-ast-q4',
        type: 'yes_no_not_given',
        prompt: 'The author considers the slight gravitational instability of L2 to be an advantage for protecting delicate telescope mirrors.',
        correctAnswer: 'Yes',
        explanation: 'In Paragraph 5, the author notes that mission controllers prefer L2’s metastable nature because L2 does not accumulate clouds of space rocks, making it cleaner and safer for delicate mirrors.',
        passageEvidence: 'Paradoxically, mission controllers prefer it this way: because L2 does not accumulate clouds of space rocks, it is a much cleaner and safer environment for delicate mirrors.'
      },
      {
        id: 'b2-exp-ast-q5',
        type: 'multiple_choice',
        prompt: 'Why is L2 far better suited for an infrared telescope like JWST than low Earth orbit?',
        options: [
          'At L2, the Sun, Earth, and Moon stay in the same direction behind the spacecraft, allowing one sunshield to block their heat simultaneously',
          'At L2, the telescope passes into Earth’s warm shadow every forty-five minutes to recharge its batteries',
          'Astronauts can easily fly up to L2 in a space shuttle every month to clean the mirrors',
          'L2 lies directly between Earth and the Sun so the mirrors stay heated to 100 degrees Celsius'
        ],
        correctAnswer: 'At L2, the Sun, Earth, and Moon stay in the same direction behind the spacecraft, allowing one sunshield to block their heat simultaneously',
        explanation: 'Paragraph 4 explains that at L2, the Sun, Earth, and Moon are always in the same direction behind the spacecraft, allowing a single five-layer sunshield to block heat and light from all three bodies simultaneously.',
        passageEvidence: 'At L2, by contrast, the Sun, Earth, and Moon are always in the same direction behind the spacecraft. This geometry allows a single five-layer, tennis-court-sized sunshield to block heat and light from all three bodies simultaneously, keeping the telescope permanently in cold, stable shadow.'
      },
      {
        id: 'b2-exp-ast-q6',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 3: Satellites stationed at the sunward ______ point give Earth early warning of geomagnetic storms.',
        correctAnswer: 'L1',
        acceptedAnswers: ['L1'],
        explanation: 'Paragraph 3 states that the L1 point sits 1.5 million kilometres sunward of Earth, and satellites stationed at L1 give Earth early warning of geomagnetic storms.',
        passageEvidence: 'The L1 point sits 1.5 million kilometres sunward of Earth, providing an uninterrupted view of solar flares and the solar wind; satellites stationed at L1 give Earth early warning of geomagnetic storms.'
      },
      {
        id: 'b2-exp-ast-q7',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 2, the phrase "in lockstep with" is closest in meaning to:',
        options: [
          'At the exact same orbital rate and staying aligned together',
          'In the opposite direction at twice the speed',
          'Colliding repeatedly along a narrow path',
          'Locked inside a metal storage container'
        ],
        correctAnswer: 'At the exact same orbital rate and staying aligned together',
        explanation: '"Orbit the Sun in lockstep with Earth" means completing an orbit of the Sun in the same 365-day period so it stays aligned with Earth.',
        passageEvidence: 'Lagrange calculated, however, that in any rotating system of two massive bodies—such as the Sun and the Earth—there are exactly five specific positions where the combined gravitational pull of both bodies precisely matches the centripetal force required for a small third object to orbit the Sun in lockstep with Earth.'
      },
      {
        id: 'b2-exp-ast-q8',
        type: 'short_answer',
        prompt: 'Answer with TWO WORDS from Paragraph 6: What type of looping path do space observatories fly around L2 so their solar panels stay in sunlight?',
        correctAnswer: 'halo orbit',
        acceptedAnswers: ['halo orbit', 'a halo orbit'],
        explanation: 'Paragraph 6 states that space observatories fly in a wide, looping "halo orbit" around L2.',
        passageEvidence: 'Rather than sitting motionless at the exact L2 point, space observatories fly in a wide, looping "halo orbit" around L2, ensuring that the spacecraft never slips into Earth’s shadow where its solar power panels would go dark.'
      },
      {
        id: 'b2-exp-ast-q9',
        type: 'matching_information',
        prompt: 'Which paragraph explains how Joseph-Louis Lagrange discovered the five gravitational balancing points in 1772?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4', 'Paragraph 5', 'Paragraph 6'],
        correctAnswer: 'Paragraph 2',
        explanation: 'Paragraph 2 describes Joseph-Louis Lagrange’s 1772 mathematical solution to the three-body problem.',
        passageEvidence: 'The existence of such balancing points was predicted in 1772 by the Italian-French mathematician Joseph-Louis Lagrange while studying the famous "three-body problem" of celestial mechanics.'
      },
      {
        id: 'b2-exp-ast-q10',
        type: 'summary_completion',
        prompt: 'Complete the summary with ONE WORD from Paragraph 4: To detect faint cosmic heat signatures, JWST’s mirrors and detectors must be kept colder than minus 220 degrees ______.',
        correctAnswer: 'Celsius',
        acceptedAnswers: ['Celsius'],
        explanation: 'Paragraph 4 states that the telescope’s mirrors and detectors must be kept colder than minus 220 degrees Celsius.',
        passageEvidence: 'To sense such tiny amounts of cosmic heat, the telescope’s mirrors and detectors must be kept colder than minus 220 degrees Celsius.'
      }
    ]
  },
  {
    id: 'b2-arc-passive-downdraft-cooling',
    title: 'Evaporative Downdraft Towers and Thermal Mass in Contemporary Arid Architecture',
    level: 'B2',
    topic: 'Architecture and urban development',
    status: 'published',
    estimatedMinutes: 12,
    generationBatch: 'batch-expansion-b2',
    imageStatus: 'ready',
    introduction: 'Examine how modern desert buildings combine misting wind towers, high-thermal-mass masonry, and night-flush ventilation to slash air-conditioning energy use.',
    illustrationAlt: 'Photograph of a shaded architectural courtyard with stone arches and cooling water channels',
    passage: [
      'Across the American Southwest, the Middle East, North Africa, and inland Australia, mechanical air conditioning commonly consumes more than sixty percent of a commercial building’s summer electricity budget. As urban populations expand and summer heatwaves intensify, relying solely on compressor-driven cooling places immense strain on electrical grids during peak afternoon hours. In response, bioclimatic architects and mechanical engineers are reviving two ancient desert physics principles—evaporative downdraft cooling and high thermal mass—and integrating them into computer-controlled public buildings.',
      'Unlike a traditional Iranian windcatcher, which depends on an external breeze to push air down a shaft, a modern passive downdraft evaporative cooling (PDEC) tower can generate its own airflow even on a completely calm, windless afternoon. At the top of a tall vertical tower, micron-scale misting nozzles spray a fine fog of water droplets into the hot, dry outdoor air entering the intake vents. Because desert air has very low relative humidity, the microscopic water droplets evaporate almost instantaneously. This phase change from liquid water to vapour absorbs a large amount of latent heat directly from the air.',
      'Basic fluid physics completes the process without a single mechanical fan. As the air at the top of the tower cools by ten to fifteen degrees Celsius, it becomes significantly denser and heavier than the warm indoor air below. Pulled downward by gravity, this column of cool, dense air sinks rapidly down the tower shaft at speeds of up to one-and-a-half metres per second and spills gently into the building’s atrium or ground-floor offices. At the same time, warm air heated by people and computers rises toward the ceiling and exits through high-level solar chimneys on the roof, creating a continuous, self-sustaining buoyancy loop.',
      'A prominent real-world demonstration of this system is the Torrent Research Centre in Ahmedabad, India, along with the Visitor Centre at Zion National Park in Utah. Over its first decade of operation, the Ahmedabad laboratory complex reduced summer cooling electricity consumption by roughly sixty-five percent compared with a conventional glass-walled air-conditioned building of equal floor area, while maintaining comfortable indoor temperatures when outdoor shade temperatures exceeded forty-two degrees Celsius.',
      'To work effectively through the hottest hours of the day, downdraft cooling is paired with a second structural strategy known as thermal mass and night-sky flushing. Instead of lightweight glass curtain walls that allow solar heat to penetrate immediately, arid-climate buildings use thick, shaded walls and exposed concrete or stone floor slabs with high heat-storage capacity. Throughout the day, these cool interior stone slabs slowly absorb excess warmth from the room. Then, once the desert sun sets and outdoor air temperatures drop sharply at night, automated louvers open to flush cool night air across the interior ceilings, discharging the stored daytime heat before sunrise.',
      'Engineers emphasize, however, that passive downdraft systems have clear climatic boundaries. Because evaporative cooling relies on dry air to absorb moisture, its effectiveness drops sharply during humid monsoon weeks when the outdoor air is already saturated with water vapour. Furthermore, in water-scarce regions, misting towers must use filtered greywater or rainwater harvesting to remain environmentally responsible. Consequently, twenty-first-century desert buildings increasingly use "hybrid" changeover systems that run passively for eight months of the year and switch to high-efficiency heat pumps only on the most humid summer afternoons. Automated rooftop weather stations continuously measure outdoor wet-bulb temperature, wind speed, and indoor carbon dioxide levels, adjusting misting pressure and motorized vent apertures minute by minute so indoor air never feels clammy. Architects have also refined the interior geometry of offices and classrooms to ensure that cool downdraft air flows unimpeded from central atriums across workspaces toward perimeter exhaust chimneys, replacing sealed suspended ceilings with vaulted acoustic concrete slabs and operable clerestory vents. In addition, integrating phase-change materials—such as bio-based wax microcapsules embedded within wall plasterboard—allows lighter modern timber or steel renovations to replicate the thermal-storage capacity of ancient thick masonry walls. Municipal building codes in several hot-arid metropolitan regions now award fast-track permitting and green-building tax credits to commercial developments that combine evaporative downdraft shafts with rooftop solar-thermal collectors and shaded courtyard microclimates. Even existing mid-century concrete office blocks and public school buildings can be retrofitted with external shading brise-soleil fins, night-purge exhaust fans, and courtyard misting shafts during routine facade upgrades, offering rapidly growing desert cities a practical pathway to keep citizens safe from extreme heat without overloading electrical grids. Post-occupancy surveys conducted across desert university campuses and municipal libraries further indicate that workers and students report higher afternoon alertness and fewer dry-eye or headache complaints in naturally ventilated downdraft buildings than in sealed mechanical-recirculation offices, demonstrating that low-energy bioclimatic architecture improves human health and daily comfort alongside carbon reduction.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'b2-exp-arc-1',
        word: 'bioclimatic',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Designed to work with the local climate and natural physics to keep a building comfortable.',
        contextMeaning: 'Architecture tailored to desert sun, wind, and temperature cycles.',
        originalSentence: 'In response, bioclimatic architects and mechanical engineers are reviving two ancient desert physics principles—evaporative downdraft cooling and high thermal mass—and integrating them into computer-controlled public buildings.',
        exampleSentence: 'Bioclimatic school designs use natural daylight and cross-breezes.',
        synonyms: ['climate-responsive', 'passive-solar'],
        arabicTranslation: 'مناخي حيوي (متوافق مع المناخ المحلي)'
      },
      {
        id: 'b2-exp-arc-2',
        word: 'instantaneously',
        partOfSpeech: 'adverb',
        simpleDefinition: 'Happening in a fraction of a second, with no noticeable delay.',
        contextMeaning: 'Evaporating right away as soon as the fine mist touches hot, dry desert air.',
        originalSentence: 'Because desert air has very low relative humidity, the microscopic water droplets evaporate almost instantaneously.',
        exampleSentence: 'Light travels across a room almost instantaneously.',
        synonyms: ['immediately', 'instantly', 'at once'],
        arabicTranslation: 'لحظياً / في الحال'
      },
      {
        id: 'b2-exp-arc-3',
        word: 'latent',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Hidden heat energy absorbed or released when a substance changes state between liquid and gas.',
        contextMeaning: 'Heat energy pulled out of the air to turn liquid mist droplets into water vapour.',
        originalSentence: 'This phase change from liquid water to vapour absorbs a large amount of latent heat directly from the air.',
        exampleSentence: 'Sweating cools the skin because evaporating moisture removes latent heat.',
        synonyms: ['phase-change', 'hidden'],
        arabicTranslation: 'كامن (الحرارة الكامنة للتبخر)'
      },
      {
        id: 'b2-exp-arc-4',
        word: 'atrium',
        partOfSpeech: 'noun',
        simpleDefinition: 'A large, tall central hall inside a building, often reaching up through several floors.',
        contextMeaning: 'The central indoor hall where cool air from the downdraft tower enters.',
        originalSentence: 'Pulled downward by gravity, this column of cool, dense air sinks rapidly down the tower shaft at speeds of up to one-and-a-half metres per second and spills gently into the building’s atrium or ground-floor offices.',
        exampleSentence: 'Employees met for coffee in the sunlit central atrium.',
        synonyms: ['central hall', 'courtyard'],
        arabicTranslation: 'بهو مركزي مرتفع'
      },
      {
        id: 'b2-exp-arc-5',
        word: 'buoyancy',
        partOfSpeech: 'noun',
        simpleDefinition: 'The natural tendency of lighter, warmer air or fluid to rise above cooler, denser air.',
        contextMeaning: 'The upward movement of warm indoor air and downward sinking of cool tower air.',
        originalSentence: 'At the same time, warm air heated by people and computers rises toward the ceiling and exits through high-level solar chimneys on the roof, creating a continuous, self-sustaining buoyancy loop.',
        exampleSentence: 'Hot-air balloons rise in the sky because of thermal buoyancy.',
        synonyms: ['upward float', 'density-driven flow'],
        arabicTranslation: 'الطفو الحراري'
      },
      {
        id: 'b2-exp-arc-6',
        word: 'louvers',
        partOfSpeech: 'noun',
        simpleDefinition: 'Angled slats or shutters in a window or vent that can tilt open and shut to control airflow.',
        contextMeaning: 'Motorized vents that open at night to let cool desert air flush through the building.',
        originalSentence: 'Then, once the desert sun sets and outdoor air temperatures drop sharply at night, automated louvers open to flush cool night air across the interior ceilings, discharging the stored daytime heat before sunrise.',
        exampleSentence: 'Wooden window louvers block direct sun while letting a breeze inside.',
        synonyms: ['shutters', 'angled vents', 'slats'],
        arabicTranslation: 'فتحات تهوية ذات شفرات مائلة'
      },
      {
        id: 'b2-exp-arc-7',
        word: 'saturated',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Holding as much moisture as possible, so no more water can evaporate into it.',
        contextMeaning: 'Already full of humidity during the rainy monsoon season.',
        originalSentence: 'Because evaporative cooling relies on dry air to absorb moisture, its effectiveness drops sharply during humid monsoon weeks when the outdoor air is already saturated with water vapour.',
        exampleSentence: 'Clothes dry very slowly when the outdoor air is saturated with moisture.',
        synonyms: ['soaked', 'moisture-filled'],
        arabicTranslation: 'مشبع بالرطوبة'
      },
      {
        id: 'b2-exp-arc-8',
        word: 'greywater',
        partOfSpeech: 'noun',
        simpleDefinition: 'Gently used household or building water from sinks and showers that is filtered and reused.',
        contextMeaning: 'Cleaned, recycled building water used in misting towers so fresh drinking water is not wasted.',
        originalSentence: 'Furthermore, in water-scarce regions, misting towers must use filtered greywater or rainwater harvesting to remain environmentally responsible.',
        exampleSentence: 'The office building uses filtered greywater to irrigate its courtyard trees.',
        synonyms: ['recycled water'],
        arabicTranslation: 'المياه الرمادية (المعاد تدويرها)'
      }
    ],
    questions: [
      {
        id: 'b2-exp-arc-q1',
        type: 'true_false_not_given',
        prompt: 'A modern passive downdraft evaporative cooling (PDEC) tower can create downward airflow even on a calm afternoon with no outdoor wind.',
        correctAnswer: 'True',
        explanation: 'Paragraph 2 states that unlike a traditional windcatcher, a modern PDEC tower can generate its own airflow even on a completely calm, windless afternoon.',
        passageEvidence: 'Unlike a traditional Iranian windcatcher, which depends on an external breeze to push air down a shaft, a modern passive downdraft evaporative cooling (PDEC) tower can generate its own airflow even on a completely calm, windless afternoon.'
      },
      {
        id: 'b2-exp-arc-q2',
        type: 'true_false_not_given',
        prompt: 'Evaporative downdraft cooling works best during humid monsoon weeks when the outdoor air is saturated with water vapour.',
        correctAnswer: 'False',
        explanation: 'Paragraph 6 states that because evaporative cooling relies on dry air to absorb moisture, its effectiveness drops sharply during humid monsoon weeks when outdoor air is already saturated.',
        passageEvidence: 'Because evaporative cooling relies on dry air to absorb moisture, its effectiveness drops sharply during humid monsoon weeks when the outdoor air is already saturated with water vapour.'
      },
      {
        id: 'b2-exp-arc-q3',
        type: 'true_false_not_given',
        prompt: 'The Visitor Centre at Zion National Park is taller than the Torrent Research Centre in Ahmedabad.',
        correctAnswer: 'Not Given',
        explanation: 'Paragraph 4 mentions both the Torrent Research Centre in Ahmedabad and the Visitor Centre at Zion National Park, but it never compares their heights.',
        passageEvidence: 'A prominent real-world demonstration of this system is the Torrent Research Centre in Ahmedabad, India, along with the Visitor Centre at Zion National Park in Utah.'
      },
      {
        id: 'b2-exp-arc-q4',
        type: 'yes_no_not_given',
        prompt: 'The author acknowledges that passive evaporative cooling has climatic limits and cannot handle every weather condition on its own.',
        correctAnswer: 'Yes',
        explanation: 'In Paragraph 6, the author notes that passive downdraft systems have clear climatic boundaries (such as high humidity and water scarcity), leading buildings to use hybrid changeover systems.',
        passageEvidence: 'Engineers emphasize, however, that passive downdraft systems have clear climatic boundaries.'
      },
      {
        id: 'b2-exp-arc-q5',
        type: 'multiple_choice',
        prompt: 'What physical force causes the cooled air at the top of a PDEC tower to move down into the building without a fan?',
        options: [
          'Gravity pulls the cooled air downward because cooling makes air denser and heavier than the warm air below',
          'High-pressure water jets push the air down through underground pipes',
          'Solar panels at the bottom of the shaft pull the air down with magnets',
          'Heavy concrete slabs press down on the roof of the tower'
        ],
        correctAnswer: 'Gravity pulls the cooled air downward because cooling makes air denser and heavier than the warm air below',
        explanation: 'Paragraph 3 explains that as air cools by 10–15°C, it becomes denser and heavier than the warm indoor air below, and gravity pulls this column of cool, dense air rapidly down the shaft.',
        passageEvidence: 'As the air at the top of the tower cools by ten to fifteen degrees Celsius, it becomes significantly denser and heavier than the warm indoor air below. Pulled downward by gravity, this column of cool, dense air sinks rapidly down the tower shaft at speeds of up to one-and-a-half metres per second and spills gently into the building’s atrium or ground-floor offices.'
      },
      {
        id: 'b2-exp-arc-q6',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with TWO WORDS from Paragraph 2: The phase change from liquid water droplets to vapour absorbs a large amount of ______ directly from the air.',
        correctAnswer: 'latent heat',
        acceptedAnswers: ['latent heat', 'heat'],
        explanation: 'Paragraph 2 states that this phase change absorbs a large amount of latent heat directly from the air.',
        passageEvidence: 'This phase change from liquid water to vapour absorbs a large amount of latent heat directly from the air.'
      },
      {
        id: 'b2-exp-arc-q7',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 6, the word "saturated" is closest in meaning to:',
        options: [
          'Completely full of moisture so no more water can evaporate into it',
          'Heated above forty-two degrees Celsius by the afternoon sun',
          'Cleaned of dust particles by micron-scale filters',
          'Blowing rapidly down a vertical brick shaft'
        ],
        correctAnswer: 'Completely full of moisture so no more water can evaporate into it',
        explanation: '"Already saturated with water vapour" means holding as much moisture as possible during humid monsoon weeks.',
        passageEvidence: 'Because evaporative cooling relies on dry air to absorb moisture, its effectiveness drops sharply during humid monsoon weeks when the outdoor air is already saturated with water vapour.'
      },
      {
        id: 'b2-exp-arc-q8',
        type: 'short_answer',
        prompt: 'Answer with TWO WORDS from Paragraph 4: By roughly what percentage did the Torrent Research Centre in Ahmedabad reduce summer cooling electricity consumption?',
        correctAnswer: 'sixty-five percent',
        acceptedAnswers: ['sixty-five percent', '65 percent', '65%'],
        explanation: 'Paragraph 4 states that the Ahmedabad laboratory complex reduced summer cooling electricity consumption by roughly sixty-five percent.',
        passageEvidence: 'Over its first decade of operation, the Ahmedabad laboratory complex reduced summer cooling electricity consumption by roughly sixty-five percent compared with a conventional glass-walled air-conditioned building of equal floor area, while maintaining comfortable indoor temperatures when outdoor shade temperatures exceeded forty-two degrees Celsius.'
      },
      {
        id: 'b2-exp-arc-q9',
        type: 'matching_information',
        prompt: 'Which paragraph explains how thick stone or concrete slabs absorb heat during the day and release it into cool outdoor air at night?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4', 'Paragraph 5', 'Paragraph 6'],
        correctAnswer: 'Paragraph 5',
        explanation: 'Paragraph 5 describes thermal mass and night-sky flushing using thick walls, exposed concrete or stone slabs, and automated louvers that open at night.',
        passageEvidence: 'To work effectively through the hottest hours of the day, downdraft cooling is paired with a second structural strategy known as thermal mass and night-sky flushing.'
      },
      {
        id: 'b2-exp-arc-q10',
        type: 'summary_completion',
        prompt: 'Complete the summary with TWO WORDS from Paragraph 3: Warm air heated by people and computers rises toward the ceiling and exits through high-level ______ on the roof.',
        correctAnswer: 'solar chimneys',
        acceptedAnswers: ['solar chimneys', 'chimneys'],
        explanation: 'Paragraph 3 states that warm air rises toward the ceiling and exits through high-level solar chimneys on the roof.',
        passageEvidence: 'At the same time, warm air heated by people and computers rises toward the ceiling and exits through high-level solar chimneys on the roof, creating a continuous, self-sustaining buoyancy loop.'
      }
    ]
  }
];

export const BATCH_B2_EXPANSION_LESSONS: ReadingLesson[] = rawB2ExpansionLessons.map((lesson) => {
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
