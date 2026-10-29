import { ReadingLesson } from '../../types/reading';
import { getEditorialIllustrationUri, getPassageIllustrationAlt } from '../../utils/illustrations';

const rawC1ExpansionLessons: Omit<ReadingLesson, 'illustrationUrl' | 'wordCount' | 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'c1-11-photonic-interconnects-computing',
    title: 'Silicon Photonics and Optical Interconnects in Exascale Data Centres',
    level: 'C1',
    topic: 'Science and technology',
    status: 'published',
    estimatedMinutes: 14,
    generationBatch: 'batch-expansion-c1',
    imageStatus: 'ready',
    introduction: 'Examine why copper electrical wiring has become the primary thermal bottleneck in artificial-intelligence clusters and how co-packaged silicon photonics routes data as laser light.',
    illustrationAlt: 'Photograph of an integrated silicon microchip wafer showing microscopic optical and electronic pathways',
    passage: [
      'For half a century, the exponential trajectory of digital computing was sustained by Moore’s Law: shrinking transistors on a silicon die so that more logic gates could switch faster within the same thermal envelope. In contemporary exascale supercomputers and artificial-intelligence training clusters, however, raw transistor switching speed is no longer the primary performance constraint. Instead, system architects confront an acute communication bottleneck. Training a frontier language or climate model requires tens of thousands of graphics processing units (GPUs) to exchange petabytes of intermediate parameters every second. When those processors communicate across traditional copper traces on printed circuit boards, more than half of the facility’s total electrical power is dissipated not in computation, but in pushing electrons through resistive metal wires.',
      'The physical limitations of electrical interconnects intensify sharply as data rates climb past one hundred gigabits per second per lane. When high-frequency alternating currents travel along a copper conductor, electromagnetic "skin effects" force the electrons toward the outer surface of the wire, increasing electrical resistance and generating waste heat. Simultaneously, capacitive coupling and dielectric loss in the surrounding circuit board attenuate the signal over distances of just a few centimetres. To prevent bit errors across a server rack, engineers must insert power-hungry electronic repeater chips—known as retimers—every few inches to amplify and reshape the degraded waveform, adding both latency and substantial thermal overhead.',
      'To transcend the physical ceiling of copper, hardware engineers have turned to silicon photonics: fabricating microscopic optical waveguides, modulators, and photodetectors directly onto standard complementary metal-oxide-semiconductor (CMOS) silicon wafers. Rather than encoding binary ones and zeroes as voltage swings in a metal wire, photonic interconnects transmit information as pulses of near-infrared laser light travelling through hair-thin silicon-nitride waveguides. Because photons carry no electrical charge, they experience virtually zero resistive heating, ignore electromagnetic crosstalk, and propagate across tens of metres of optical fibre with negligible attenuation.',
      'Furthermore, optical waveguides unlock an extraordinary bandwidth multiplier known as wavelength-division multiplexing (WDM). In a copper wire, sending two electrical signals down the same conductor at the same frequency causes destructive interference. In an optical waveguide, by contrast, dozens of distinct laser wavelengths—effectively different "colours" of infrared light—can travel simultaneously through a single microscopic channel without interacting, multiplying aggregate throughput by an order of magnitude without laying additional physical pathways.',
      'Historically, optical transceivers were restricted to pluggable modules mounted on the front faceplate of a server switch, meaning that data still had to travel twenty centimetres across lossy copper circuit-board traces from the central processor to the edge of the chassis before being converted into light. The current engineering breakthrough is Co-Packaged Optics (CPO), which moves the silicon-photonic engine directly onto the same interposer substrate as the processor die itself. By shrinking the electrical path from twenty centimetres to less than five millimetres, co-packaged optical chiplets slash interconnect energy consumption from roughly fifteen picojoules per bit down to under two picojoules per bit.',
      'Nevertheless, integrating delicate photonics alongside scorching hundred-watt processors introduces formidable manufacturing and materials challenges. Silicon itself is an indirect-bandgap semiconductor, meaning it is inefficient at emitting laser light directly; engineers must either bond exotic indium-phosphide laser crystals onto the silicon wafer or route continuous-wave light in from an external laser bank. Moreover, silicon ring modulators are acutely sensitive to temperature fluctuations of even a single degree Celsius, requiring closed-loop micro-heaters and wavelength-locking algorithms to keep optical channels aligned. Despite these hurdles, co-packaged silicon photonics is rapidly becoming the foundational nervous system of next-generation computing. Beyond lowering thermal dissipation inside individual server racks, photonic fabrics allow data-centre architects to rethink the physical topology of supercomputers through "resource disaggregation." In a conventional copper-wired cluster, high-bandwidth memory and specialized tensor accelerators must be soldered within a few millimetres of a host processor because electrical latency and signal attenuation prohibit longer links; if a particular workload requires only half of the attached memory, the remaining silicon sits stranded and idle. When processors communicate at the speed of light over low-loss optical waveguides, however, pools of memory, storage, and compute chiplets distributed across separate racks can be dynamically composed into a single logical machine with nanosecond-scale latency. At the same time, packaging engineers are replacing fragile hand-aligned fibre pigtails with V-groove silicon micromirrors and automated wafer-level optical probing that test thousands of photonic dies before dicing. Researchers are also exploring heterogeneous integration of thin-film lithium niobate and barium titanate electro-optic modulators, which switch laser phases at terahertz speeds without the thermal drift that plagues pure silicon micro-rings. By uniting semiconductor lithography with waveguide optics, photonic interconnects ensure that the pace of scientific simulation and machine intelligence will not be throttled by the resistive physics of copper. International standards consortia—bringing together foundry engineers, hyperscale cloud operators, and telecommunications physicists—are now establishing open optical-chiplet interfaces so that photonic engines from different manufacturers can interoperate seamlessly on a single multi-die package. In parallel, quantum-computing researchers are adapting these exact same ultra-low-loss silicon-nitride waveguides to route entangled single photons between cryogenic processor modules, bridging the worlds of classical exascale supercomputing and fault-tolerant optical quantum networks. As global data-centre electricity demand comes under intense environmental scrutiny, replacing resistive metal interconnects with light-speed optical pathways offers one of the most consequential energy-efficiency breakthroughs in modern information engineering. Furthermore, optical frequency-comb sources—single micro-resonator lasers that generate dozens of evenly spaced wavelength lines simultaneously—promise to replace banks of individual laser diodes with a single compact light source on every server board, cutting optical transceiver manufacturing costs and power budgets even further across next-generation computing facilities.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'c1-exp-sci-1',
        word: 'dissipated',
        partOfSpeech: 'verb',
        simpleDefinition: 'Wasted or scattered into the surrounding environment, especially as unwanted heat.',
        contextMeaning: 'Lost as waste heat when electrical current moves through resistive copper wires.',
        originalSentence: 'When those processors communicate across traditional copper traces on printed circuit boards, more than half of the facility’s total electrical power is dissipated not in computation, but in pushing electrons through resistive metal wires.',
        exampleSentence: 'Much of the energy in an old incandescent bulb is dissipated as heat rather than light.',
        synonyms: ['squandered', 'dispersed', 'expended'],
        arabicTranslation: 'يتبدد (على شكل حرارة ضائعة)'
      },
      {
        id: 'c1-exp-sci-2',
        word: 'attenuate',
        partOfSpeech: 'verb',
        simpleDefinition: 'To weaken or reduce the strength, amplitude, or clarity of a signal.',
        contextMeaning: 'To weaken high-frequency electrical signals as they travel across a circuit board.',
        originalSentence: 'Simultaneously, capacitive coupling and dielectric loss in the surrounding circuit board attenuate the signal over distances of just a few centimetres.',
        exampleSentence: 'Thick concrete walls attenuate wireless radio signals inside a building.',
        synonyms: ['weaken', 'diminish', 'dampen'],
        arabicTranslation: 'يُضعف / يوهن الإشارة'
      },
      {
        id: 'c1-exp-sci-3',
        word: 'transcend',
        partOfSpeech: 'verb',
        simpleDefinition: 'To go beyond or rise above a limit or barrier.',
        contextMeaning: 'To overcome the physical speed and heat limits of copper wiring.',
        originalSentence: 'To transcend the physical ceiling of copper, hardware engineers have turned to silicon photonics: fabricating microscopic optical waveguides, modulators, and photodetectors directly onto standard complementary metal-oxide-semiconductor (CMOS) silicon wafers.',
        exampleSentence: 'Digital archives allow libraries to transcend the limits of physical shelf space.',
        synonyms: ['surpass', 'overcome', 'exceed'],
        arabicTranslation: 'يتجاوز الحدود'
      },
      {
        id: 'c1-exp-sci-4',
        word: 'crosstalk',
        partOfSpeech: 'noun',
        simpleDefinition: 'Unwanted interference caused when a signal in one wire or channel leaks into a neighbouring channel.',
        contextMeaning: 'Electromagnetic interference between closely packed copper wires.',
        originalSentence: 'Because photons carry no electrical charge, they experience virtually zero resistive heating, ignore electromagnetic crosstalk, and propagate across tens of metres of optical fibre with negligible attenuation.',
        exampleSentence: 'Twisted copper pairs help reduce electromagnetic crosstalk in telephone cables.',
        synonyms: ['signal interference', 'channel leakage'],
        arabicTranslation: 'تداخل الإشارات بين القنوات المتجاورة'
      },
      {
        id: 'c1-exp-sci-5',
        word: 'negligible',
        partOfSpeech: 'adjective',
        simpleDefinition: 'So small or minor that it is not worth considering; almost zero.',
        contextMeaning: 'Almost no loss of light signal strength over tens of metres of optical fibre.',
        originalSentence: 'Because photons carry no electrical charge, they experience virtually zero resistive heating, ignore electromagnetic crosstalk, and propagate across tens of metres of optical fibre with negligible attenuation.',
        exampleSentence: 'The temperature difference between the two sensors was negligible.',
        synonyms: ['insignificant', 'minimal', 'tiny'],
        arabicTranslation: 'ضئيل للغاية / لا يُذكر'
      },
      {
        id: 'c1-exp-sci-6',
        word: 'multiplexing',
        partOfSpeech: 'noun',
        simpleDefinition: 'Sending multiple separate signals simultaneously over a single shared communication path.',
        contextMeaning: 'Combining dozens of different laser wavelengths into one microscopic optical channel.',
        originalSentence: 'Furthermore, optical waveguides unlock an extraordinary bandwidth multiplier known as wavelength-division multiplexing (WDM).',
        exampleSentence: 'Fibre-optic cables use multiplexing to carry thousands of phone calls at once.',
        synonyms: ['signal combining', 'multi-channel transmission'],
        arabicTranslation: 'الإرسال المتعدد عبر قناة واحدة'
      },
      {
        id: 'c1-exp-sci-7',
        word: 'aggregate',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Formed by adding many separate amounts together into a total sum.',
        contextMeaning: 'Total combined data speed across all laser wavelengths in the waveguide.',
        originalSentence: 'In an optical waveguide, by contrast, dozens of distinct laser wavelengths—effectively different "colours" of infrared light—can travel simultaneously through a single microscopic channel without interacting, multiplying aggregate throughput by an order of magnitude without laying additional physical pathways.',
        exampleSentence: 'The aggregate output of the wind farm reached five hundred megawatts.',
        synonyms: ['combined', 'total', 'cumulative'],
        arabicTranslation: 'إجمالي / كلي مجتمع'
      },
      {
        id: 'c1-exp-sci-8',
        word: 'acutely',
        partOfSpeech: 'adverb',
        simpleDefinition: 'To a very sharp, intense, or sensitive degree.',
        contextMeaning: 'Extremely sensitive even to tiny one-degree changes in chip temperature.',
        originalSentence: 'Moreover, silicon ring modulators are acutely sensitive to temperature fluctuations of even a single degree Celsius, requiring closed-loop micro-heaters and wavelength-locking algorithms to keep optical channels aligned.',
        exampleSentence: 'Hospital managers are acutely aware of the need for clean air ventilation.',
        synonyms: ['intensely', 'sharply', 'keenly'],
        arabicTranslation: 'بشدة / بدرجة عالية من الحساسية'
      }
    ],
    questions: [
      {
        id: 'c1-exp-sci-q1',
        type: 'true_false_not_given',
        prompt: 'In large AI training clusters using traditional copper traces, more than half of total electrical power can be lost moving data through wires rather than performing calculations.',
        correctAnswer: 'True',
        explanation: 'Paragraph 1 states that when processors communicate across traditional copper traces, more than half of the facility’s total electrical power is dissipated not in computation, but in pushing electrons through resistive metal wires.',
        passageEvidence: 'When those processors communicate across traditional copper traces on printed circuit boards, more than half of the facility’s total electrical power is dissipated not in computation, but in pushing electrons through resistive metal wires.'
      },
      {
        id: 'c1-exp-sci-q2',
        type: 'true_false_not_given',
        prompt: 'Pure silicon is an ideal direct-bandgap material that naturally emits bright laser light without requiring external crystals.',
        correctAnswer: 'False',
        explanation: 'Paragraph 6 states that silicon itself is an indirect-bandgap semiconductor, meaning it is inefficient at emitting laser light directly, so engineers must bond indium-phosphide crystals or use external laser banks.',
        passageEvidence: 'Silicon itself is an indirect-bandgap semiconductor, meaning it is inefficient at emitting laser light directly; engineers must either bond exotic indium-phosphide laser crystals onto the silicon wafer or route continuous-wave light in from an external laser bank.'
      },
      {
        id: 'c1-exp-sci-q3',
        type: 'true_false_not_given',
        prompt: 'External laser banks last twice as many years as bonded indium-phosphide laser crystals.',
        correctAnswer: 'Not Given',
        explanation: 'Paragraph 6 mentions both bonded indium-phosphide laser crystals and external laser banks, but it never compares how many years each lasts.',
        passageEvidence: 'Silicon itself is an indirect-bandgap semiconductor, meaning it is inefficient at emitting laser light directly; engineers must either bond exotic indium-phosphide laser crystals onto the silicon wafer or route continuous-wave light in from an external laser bank.'
      },
      {
        id: 'c1-exp-sci-q4',
        type: 'yes_no_not_given',
        prompt: 'The author claims that quantum-dot lasers will completely replace both bonded indium-phosphide crystals and external laser banks before the end of the decade.',
        correctAnswer: 'Not Given',
        explanation: 'Paragraph 6 discusses bonded indium-phosphide laser crystals and external laser banks, as well as athermal micro-ring resonators, but never mentions quantum-dot lasers or predicts a timeline for replacing existing light sources.',
        passageEvidence: 'Silicon itself is an indirect-bandgap semiconductor, meaning it is inefficient at emitting laser light directly; engineers must either bond exotic indium-phosphide laser crystals onto the silicon wafer or route continuous-wave light in from an external laser bank.'
      },
      {
        id: 'c1-exp-sci-q5',
        type: 'multiple_choice',
        prompt: 'How does Co-Packaged Optics (CPO) drastically reduce interconnect energy consumption compared with front-panel pluggable optical modules?',
        options: [
          'By placing the silicon-photonic engine on the same substrate as the processor die, shrinking the copper path to under five millimetres',
          'By replacing all infrared laser light with high-voltage alternating current across twenty-centimetre copper boards',
          'By cooling the entire server rack to minus two hundred degrees Celsius in liquid nitrogen',
          'By removing wavelength-division multiplexing so only one colour of light travels per fibre'
        ],
        correctAnswer: 'By placing the silicon-photonic engine on the same substrate as the processor die, shrinking the copper path to under five millimetres',
        explanation: 'Paragraph 5 explains that Co-Packaged Optics moves the silicon-photonic engine directly onto the same interposer substrate as the processor die, shrinking the electrical path from 20 cm to less than 5 mm.',
        passageEvidence: 'The current engineering breakthrough is Co-Packaged Optics (CPO), which moves the silicon-photonic engine directly onto the same interposer substrate as the processor die itself. By shrinking the electrical path from twenty centimetres to less than five millimetres, co-packaged optical chiplets slash interconnect energy consumption from roughly fifteen picojoules per bit down to under two picojoules per bit.'
      },
      {
        id: 'c1-exp-sci-q6',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 2: To prevent bit errors across a server rack, engineers must insert power-hungry electronic repeater chips known as ______.',
        correctAnswer: 'retimers',
        acceptedAnswers: ['retimers'],
        explanation: 'Paragraph 2 states that engineers must insert power-hungry electronic repeater chips—known as retimers—every few inches.',
        passageEvidence: 'To prevent bit errors across a server rack, engineers must insert power-hungry electronic repeater chips—known as retimers—every few inches to amplify and reshape the degraded waveform, adding both latency and substantial thermal overhead.'
      },
      {
        id: 'c1-exp-sci-q7',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 2, the word "attenuate" is closest in meaning to:',
        options: [
          'Weaken or reduce the strength of',
          'Multiply by an order of magnitude',
          'Convert directly into laser light',
          'Insulate against temperature changes'
        ],
        correctAnswer: 'Weaken or reduce the strength of',
        explanation: 'In Paragraph 2, capacitive coupling and dielectric loss attenuate (weaken/degrade) the electrical signal over distances of just a few centimetres.',
        passageEvidence: 'Simultaneously, capacitive coupling and dielectric loss in the surrounding circuit board attenuate the signal over distances of just a few centimetres.'
      },
      {
        id: 'c1-exp-sci-q8',
        type: 'short_answer',
        prompt: 'Answer with THREE WORDS from Paragraph 4: What optical technique allows dozens of distinct laser wavelengths to travel simultaneously through a single waveguide?',
        correctAnswer: 'wavelength-division multiplexing',
        acceptedAnswers: ['wavelength-division multiplexing', 'WDM'],
        explanation: 'Paragraph 4 identifies this technique as wavelength-division multiplexing (WDM).',
        passageEvidence: 'Furthermore, optical waveguides unlock an extraordinary bandwidth multiplier known as wavelength-division multiplexing (WDM).'
      },
      {
        id: 'c1-exp-sci-q9',
        type: 'matching_information',
        prompt: 'Which paragraph explains the physical causes of signal degradation—such as the skin effect and dielectric loss—in high-frequency copper wires?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4', 'Paragraph 5', 'Paragraph 6'],
        correctAnswer: 'Paragraph 2',
        explanation: 'Paragraph 2 details electromagnetic skin effects, capacitive coupling, and dielectric loss in copper conductors.',
        passageEvidence: 'When high-frequency alternating currents travel along a copper conductor, electromagnetic "skin effects" force the electrons toward the outer surface of the wire, increasing electrical resistance and generating waste heat.'
      },
      {
        id: 'c1-exp-sci-q10',
        type: 'summary_completion',
        prompt: 'Complete the summary with TWO WORDS from Paragraph 6: Because silicon is inefficient at emitting laser light directly, engineers often bond exotic ______ laser crystals onto the silicon wafer.',
        correctAnswer: 'indium-phosphide',
        acceptedAnswers: ['indium-phosphide', 'indium phosphide'],
        explanation: 'Paragraph 6 states that engineers must either bond exotic indium-phosphide laser crystals onto the silicon wafer or route light in from an external laser bank.',
        passageEvidence: 'Silicon itself is an indirect-bandgap semiconductor, meaning it is inefficient at emitting laser light directly; engineers must either bond exotic indium-phosphide laser crystals onto the silicon wafer or route continuous-wave light in from an external laser bank.'
      }
    ]
  },
  {
    id: 'c1-12-enhanced-rock-weathering',
    title: 'Enhanced Silicate Weathering: Geochemical Carbon Removal on Agricultural Soils',
    level: 'C1',
    topic: 'Environmental science',
    status: 'published',
    estimatedMinutes: 14,
    generationBatch: 'batch-expansion-c1',
    imageStatus: 'ready',
    introduction: 'Analyze how spreading finely crushed volcanic basalt on croplands accelerates Earth’s natural geological thermostat while counteracting soil acidification.',
    illustrationAlt: 'Photograph of agricultural farmland soil surrounded by volcanic rock hills',
    passage: [
      'Over geological timescales of hundreds of thousands of years, Earth regulates its atmospheric carbon dioxide concentration through a planetary feedback loop known as the carbonate-silicate cycle. Whenever rainwater falls through the atmosphere or percolates through root-zone soil, it absorbs dissolved carbon dioxide to form weak carbonic acid. When this mildly acidic water contacts exposed silicate rocks—such as volcanic basalt or olivine—it triggers a slow chemical reaction that releases base cations like calcium and magnesium while converting the dissolved carbon dioxide into stable bicarbonate ions. Washed down rivers into the oceans, these bicarbonate ions eventually precipitate as marine limestone, locking carbon away for millions of years.',
      'Left to unassisted geological rates, natural rock weathering is far too slow to counteract anthropogenic greenhouse-gas emissions from industrial activity. Over the past decade, however, geochemists and agronomists have investigated whether this planetary thermostat can be deliberately accelerated through an intervention called Enhanced Rock Weathering (ERW). The core concept is straightforward: rather than waiting millennia for mountain ranges to erode, engineers take vast stockpiles of finely crushed basalt rock—already generated as a low-value byproduct of commercial aggregate quarries—and spread the mineral powder across existing agricultural croplands using standard lime-spreading tractors.',
      'Grinding volcanic basalt into particles smaller than one hundred micrometres increases its reactive surface area by orders of magnitude. Even more importantly, spreading the basalt dust onto warm, biologically active farmland exposes the mineral grains to plant roots, mycorrhizal fungi, and soil microbes. As plant roots respire, they pump carbon dioxide into the rhizosphere—raising soil carbon dioxide concentrations to ten or twenty times atmospheric levels—while secreting organic acids to scavenge mineral nutrients. This biological activity acts as a natural chemical reactor, dissolving the fine silicate grains in months or years rather than geological epochs.',
      'Unlike standalone direct-air-capture factories, which consume vast quantities of electricity and require dedicated industrial land, enhanced rock weathering piggybacks on existing agricultural machinery and delivers immediate agronomic co-benefits. Decades of heavy synthetic nitrogen fertilizer use have left millions of hectares of global cropland overly acidic, which stunts root growth and locks up essential plant nutrients. Currently, farmers combat soil acidity by spreading crushed agricultural limestone, which unfortunately releases carbon dioxide when it dissolves in strong soil acids. Crushed silicate basalt, by contrast, neutralizes soil pH without releasing carbon dioxide, while simultaneously replenishing depleted soil reserves of magnesium, iron, phosphorus, and soluble silicon that strengthen crop stems against pests and drought.',
      'Multi-year field trials across the American Corn Belt, the United Kingdom, Brazil, and Malaysia have reported encouraging results: basalt-amended plots have demonstrated measurable carbon drawdown alongside yield increases of six to sixteen percent in maize and soybean harvests. Yet geochemists emphasize that scaling enhanced rock weathering into a credible global climate credit requires solving a rigorous measurement, reporting, and verification (MRV) problem. Because soil moisture, temperature, and drainage vary wildly across a single field, directly tracking how much dissolved bicarbonate leaches out of the soil profile into groundwater is notoriously difficult.',
      'Furthermore, environmental toxicologists caution that ultramafic rocks such as pure olivine often contain trace concentrations of heavy metals like nickel and chromium, which could accumulate in food crops if unscreened rock dust is applied repeatedly. Consequently, agricultural protocols increasingly restrict farmland applications to vetted, low-metal basalts and rely on geochemical soil-core tracing—measuring the ratio of immobile titanium to depleted magnesium in the topsoil—to verify exact carbon sequestration before issuing permanence certificates. Soil Biogeochemistry consortia are also investigating how mineral weathering interacts with the broader nitrogen cycle in intensive agriculture. When acidic cropland soils are buffered upward toward a neutral pH by dissolving basalt grains, soil bacterial communities shift away from incomplete denitrification, reducing emissions of nitrous oxide—a greenhouse gas nearly three hundred times more potent than carbon dioxide over a century timescale—by up to forty percent in controlled mesocosm trials. In addition, life-cycle analysts carefully audit the "supply-chain carbon penalty" of rock comminution and diesel haulage: if a quarry grinds basalt below ten micrometres using coal-powered ball mills or trucks the heavy powder more than five hundred kilometres to a farm, industrial emissions can erode a substantial fraction of the gross carbon drawdown. Siting deployments within regional networks that pair existing quarry fines with electrified rail transport and humid tropical or temperate rainfed farmlands maximizes net carbon removal efficiency. When governed by conservative mass-balance accounting and trace-metal screening, enhanced rock weathering offers a rare climate intervention that simultaneously repairs degraded agricultural soils and accelerates Earth’s oldest geological carbon sink. Hydrologists and marine chemists are also tracking the downstream journey of weathered bicarbonate ions as field drainage enters rivers and coastal estuaries. Unlike ocean liming proposals that require dedicated ships, the alkalinity exported from basalt-treated watersheds buffers river water against agricultural acid runoff and helps counteract coastal ocean acidification, improving shell-formation conditions for oysters, mussels, and calcifying plankton. To reconcile soil-core measurements with watershed exports, research farms now pair high-frequency automated porewater sensors with stable-isotope tracers of strontium and lithium that distinguish newly dissolved basalt cations from background soil minerals. Integrating agronomic science, isotope geochemistry, and rural co-operative logistics ensures that enhanced silicate weathering delivers verifiable, durable climate mitigation alongside healthier harvests for farming communities. Long-term agronomic extension programmes in tropical regions where heavy rainfall and warm temperatures naturally speed up silicate dissolution by three to four times compared with cold temperate zones also show that smallholder farmers can cut their spending on imported chemical fertilizers while participating transparently in verified carbon-removal registries. This alignment of farmer livelihoods with planetary geochemistry makes enhanced rock weathering a uniquely practical climate solution.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'c1-exp-env-1',
        word: 'percolates',
        partOfSpeech: 'verb',
        simpleDefinition: 'Filters or trickles slowly downward through tiny spaces in soil or rock.',
        contextMeaning: 'Trickles down through the root zone of farmland soil.',
        originalSentence: 'Whenever rainwater falls through the atmosphere or percolates through root-zone soil, it absorbs dissolved carbon dioxide to form weak carbonic acid.',
        exampleSentence: 'Rainwater percolates through layers of sand into the underground aquifer.',
        synonyms: ['seeps', 'filters', 'trickles'],
        arabicTranslation: 'يتخلل / يترشح عبر التربة'
      },
      {
        id: 'c1-exp-env-2',
        word: 'precipitate',
        partOfSpeech: 'verb',
        simpleDefinition: 'To separate out from a liquid solution as a solid mineral deposit.',
        contextMeaning: 'To form solid calcium-carbonate limestone on the ocean floor from dissolved ions.',
        originalSentence: 'Washed down rivers into the oceans, these bicarbonate ions eventually precipitate as marine limestone, locking carbon away for millions of years.',
        exampleSentence: 'Minerals precipitate out of hot spring water to form terraced stone pools.',
        synonyms: ['crystallize', 'settle out', 'solidify'],
        arabicTranslation: 'يترسب كيميائياً على هيئة صلبة'
      },
      {
        id: 'c1-exp-env-3',
        word: 'anthropogenic',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Caused or produced by human industrial or agricultural activity rather than natural processes.',
        contextMeaning: 'Human-made greenhouse-gas emissions from burning fossil fuels and industry.',
        originalSentence: 'Left to unassisted geological rates, natural rock weathering is far too slow to counteract anthropogenic greenhouse-gas emissions from industrial activity.',
        exampleSentence: 'Scientists distinguish natural climate cycles from anthropogenic warming.',
        synonyms: ['human-caused', 'human-made'],
        arabicTranslation: 'بشري المنشأ'
      },
      {
        id: 'c1-exp-env-4',
        word: 'byproduct',
        partOfSpeech: 'noun',
        simpleDefinition: 'A secondary material produced unintentionally during the manufacture or mining of something else.',
        contextMeaning: 'Crushed rock dust left over when quarries cut stone for road building.',
        originalSentence: 'The core concept is straightforward: rather than waiting millennia for mountain ranges to erode, engineers take vast stockpiles of finely crushed basalt rock—already generated as a low-value byproduct of commercial aggregate quarries—and spread the mineral powder across existing agricultural croplands using standard lime-spreading tractors.',
        exampleSentence: 'Sawdust is a useful byproduct of timber mills.',
        synonyms: ['secondary product', 'residue'],
        arabicTranslation: 'منتج ثانوي'
      },
      {
        id: 'c1-exp-env-5',
        word: 'rhizosphere',
        partOfSpeech: 'noun',
        simpleDefinition: 'The narrow zone of soil directly surrounding plant roots where microbes and root chemistry are highly active.',
        contextMeaning: 'The root-zone soil where plant roots and fungi speed up basalt dissolution.',
        originalSentence: 'As plant roots respire, they pump carbon dioxide into the rhizosphere—raising soil carbon dioxide concentrations to ten or twenty times atmospheric levels—while secreting organic acids to scavenge mineral nutrients.',
        exampleSentence: 'Beneficial bacteria thrive in the nutrient-rich rhizosphere around bean roots.',
        synonyms: ['root zone'],
        arabicTranslation: 'منطقة المحيط الجذري في التربة'
      },
      {
        id: 'c1-exp-env-6',
        word: 'piggybacks',
        partOfSpeech: 'verb',
        simpleDefinition: 'Uses an existing system or machine that is already operating, rather than building a separate new one.',
        contextMeaning: 'Uses the farm tractors and spreaders that farmers already drive across fields.',
        originalSentence: 'Unlike standalone direct-air-capture factories, which consume vast quantities of electricity and require dedicated industrial land, enhanced rock weathering piggybacks on existing agricultural machinery and delivers immediate agronomic co-benefits.',
        exampleSentence: 'The new sensor network piggybacks on existing cellular towers.',
        synonyms: ['builds upon', 'rides on'],
        arabicTranslation: 'يعتمد على بنية قائمة بالفعل'
      },
      {
        id: 'c1-exp-env-7',
        word: 'replenishing',
        partOfSpeech: 'verb',
        simpleDefinition: 'Filling something up again by restoring minerals or supplies that were used up.',
        contextMeaning: 'Restoring magnesium, iron, phosphorus, and silicon to tired farmland soils.',
        originalSentence: 'Crushed silicate basalt, by contrast, neutralizes soil pH without releasing carbon dioxide, while simultaneously replenishing depleted soil reserves of magnesium, iron, phosphorus, and soluble silicon that strengthen crop stems against pests and drought.',
        exampleSentence: 'Winter snowpack is vital for replenishing mountain reservoirs.',
        synonyms: ['restoring', 'refilling', 'renewing'],
        arabicTranslation: 'يجدد المخزون / يعوض النقص'
      },
      {
        id: 'c1-exp-env-8',
        word: 'sequestration',
        partOfSpeech: 'noun',
        simpleDefinition: 'The long-term capture and storage of carbon dioxide so it stays out of the atmosphere.',
        contextMeaning: 'Locking atmospheric carbon dioxide into stable bicarbonate and mineral forms.',
        originalSentence: 'Consequently, agricultural protocols increasingly restrict farmland applications to vetted, low-metal basalts and rely on geochemical soil-core tracing—measuring the ratio of immobile titanium to depleted magnesium in the topsoil—to verify exact carbon sequestration before issuing permanence certificates.',
        exampleSentence: 'Peatland restoration supports natural carbon sequestration.',
        synonyms: ['carbon storage', 'capture'],
        arabicTranslation: 'احتجاز الكربون وتخزينه'
      }
    ],
    questions: [
      {
        id: 'c1-exp-env-q1',
        type: 'true_false_not_given',
        prompt: 'In the natural carbonate-silicate cycle, carbonic acid reacts with silicate rocks to convert dissolved carbon dioxide into bicarbonate ions.',
        correctAnswer: 'True',
        explanation: 'Paragraph 1 states that when mildly acidic rainwater contacts exposed silicate rocks, it triggers a reaction that converts dissolved carbon dioxide into stable bicarbonate ions.',
        passageEvidence: 'When this mildly acidic water contacts exposed silicate rocks—such as volcanic basalt or olivine—it triggers a slow chemical reaction that releases base cations like calcium and magnesium while converting the dissolved carbon dioxide into stable bicarbonate ions.'
      },
      {
        id: 'c1-exp-env-q2',
        type: 'true_false_not_given',
        prompt: 'Soil carbon dioxide concentrations in the rhizosphere around plant roots are much lower than carbon dioxide levels in the open air above.',
        correctAnswer: 'False',
        explanation: 'Paragraph 3 states that as plant roots respire, they pump carbon dioxide into the rhizosphere, raising soil carbon dioxide concentrations to ten or twenty times atmospheric levels.',
        passageEvidence: 'As plant roots respire, they pump carbon dioxide into the rhizosphere—raising soil carbon dioxide concentrations to ten or twenty times atmospheric levels—while secreting organic acids to scavenge mineral nutrients.'
      },
      {
        id: 'c1-exp-env-q3',
        type: 'true_false_not_given',
        prompt: 'Field trials in Malaysia dissolved basalt powder twice as fast as field trials in the United Kingdom.',
        correctAnswer: 'Not Given',
        explanation: 'Paragraph 5 mentions field trials across the American Corn Belt, the United Kingdom, Brazil, and Malaysia, but it never compares the exact dissolution speed between Malaysia and the UK.',
        passageEvidence: 'Multi-year field trials across the American Corn Belt, the United Kingdom, Brazil, and Malaysia have reported encouraging results: basalt-amended plots have demonstrated measurable carbon drawdown alongside yield increases of six to sixteen percent in maize and soybean harvests.'
      },
      {
        id: 'c1-exp-env-q4',
        type: 'yes_no_not_given',
        prompt: 'The author warns that applying unscreened ultramafic rocks like pure olivine to farmland could introduce heavy-metal contamination into food crops.',
        correctAnswer: 'Yes',
        explanation: 'In Paragraph 6, the author notes that environmental toxicologists caution that ultramafic rocks such as pure olivine often contain trace concentrations of nickel and chromium, which could accumulate in food crops.',
        passageEvidence: 'Furthermore, environmental toxicologists caution that ultramafic rocks such as pure olivine often contain trace concentrations of heavy metals like nickel and chromium, which could accumulate in food crops if unscreened rock dust is applied repeatedly.'
      },
      {
        id: 'c1-exp-env-q5',
        type: 'multiple_choice',
        prompt: 'Why is spreading crushed silicate basalt on acidic farmland preferable to spreading traditional agricultural limestone?',
        options: [
          'Basalt neutralizes soil acidity and replenishes trace minerals without releasing carbon dioxide when it dissolves in strong soil acids',
          'Agricultural limestone cannot be spread using standard farm tractors',
          'Basalt powder makes the soil ten times more acidic within a single growing season',
          'Traditional limestone contains high levels of soluble silicon that harm maize roots'
        ],
        correctAnswer: 'Basalt neutralizes soil acidity and replenishes trace minerals without releasing carbon dioxide when it dissolves in strong soil acids',
        explanation: 'Paragraph 4 explains that agricultural limestone releases carbon dioxide when it dissolves in strong soil acids, whereas crushed silicate basalt neutralizes soil pH without releasing carbon dioxide and replenishes magnesium, iron, phosphorus, and silicon.',
        passageEvidence: 'Crushed silicate basalt, by contrast, neutralizes soil pH without releasing carbon dioxide, while simultaneously replenishing depleted soil reserves of magnesium, iron, phosphorus, and soluble silicon that strengthen crop stems against pests and drought.'
      },
      {
        id: 'c1-exp-env-q6',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 1: Washed down rivers into the oceans, bicarbonate ions eventually precipitate as marine ______, locking carbon away for millions of years.',
        correctAnswer: 'limestone',
        acceptedAnswers: ['limestone'],
        explanation: 'Paragraph 1 states that bicarbonate ions eventually precipitate as marine limestone.',
        passageEvidence: 'Washed down rivers into the oceans, these bicarbonate ions eventually precipitate as marine limestone, locking carbon away for millions of years.'
      },
      {
        id: 'c1-exp-env-q7',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 1, the word "anthropogenic" is closest in meaning to:',
        options: [
          'Caused by human industrial or agricultural activity',
          'Formed deep inside ancient volcanic craters',
          'Dissolved in cold rainwater over millions of years',
          'Measured using titanium-to-magnesium soil ratios'
        ],
        correctAnswer: 'Caused by human industrial or agricultural activity',
        explanation: '"Anthropogenic greenhouse-gas emissions from industrial activity" refers to human-generated emissions.',
        passageEvidence: 'Left to unassisted geological rates, natural rock weathering is far too slow to counteract anthropogenic greenhouse-gas emissions from industrial activity.'
      },
      {
        id: 'c1-exp-env-q8',
        type: 'short_answer',
        prompt: 'Answer with ONE WORD from Paragraph 6: Which immobile element in topsoil is compared against depleted magnesium in soil-core tracing to verify exact carbon sequestration?',
        correctAnswer: 'titanium',
        acceptedAnswers: ['titanium', 'immobile titanium'],
        explanation: 'Paragraph 6 states that geochemical soil-core tracing measures the ratio of immobile titanium to depleted magnesium in the topsoil.',
        passageEvidence: 'Consequently, agricultural protocols increasingly restrict farmland applications to vetted, low-metal basalts and rely on geochemical soil-core tracing—measuring the ratio of immobile titanium to depleted magnesium in the topsoil—to verify exact carbon sequestration before issuing permanence certificates.'
      },
      {
        id: 'c1-exp-env-q9',
        type: 'matching_information',
        prompt: 'Which paragraph explains how plant roots, mycorrhizal fungi, and soil microbes accelerate the chemical breakdown of crushed basalt?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4', 'Paragraph 5', 'Paragraph 6'],
        correctAnswer: 'Paragraph 3',
        explanation: 'Paragraph 3 explains how plant roots pump carbon dioxide into the rhizosphere and secrete organic acids alongside mycorrhizal fungi and soil microbes.',
        passageEvidence: 'Even more importantly, spreading the basalt dust onto warm, biologically active farmland exposes the mineral grains to plant roots, mycorrhizal fungi, and soil microbes.'
      },
      {
        id: 'c1-exp-env-q10',
        type: 'summary_completion',
        prompt: 'Complete the summary with ONE WORD from Paragraph 2: Finely crushed basalt is already generated in large stockpiles as a low-value byproduct of commercial aggregate ______.',
        correctAnswer: 'quarries',
        acceptedAnswers: ['quarries'],
        explanation: 'Paragraph 2 states that finely crushed basalt rock is already generated as a low-value byproduct of commercial aggregate quarries.',
        passageEvidence: 'The core concept is straightforward: rather than waiting millennia for mountain ranges to erode, engineers take vast stockpiles of finely crushed basalt rock—already generated as a low-value byproduct of commercial aggregate quarries—and spread the mineral powder across existing agricultural croplands using standard lime-spreading tractors.'
      }
    ]
  },
  {
    id: 'c1-13-motivated-reasoning-epistemic',
    title: 'Identity-Protective Cognition and the Asymmetry of Motivated Reasoning',
    level: 'C1',
    topic: 'Psychology and human behaviour',
    status: 'published',
    estimatedMinutes: 14,
    generationBatch: 'batch-expansion-c1',
    imageStatus: 'ready',
    introduction: 'Explore why high analytical skill often intensifies—rather than corrects—biased reasoning when empirical evidence threatens a person’s social group identity.',
    illustrationAlt: 'Photograph of researchers analyzing behavioural and cognitive data in a university seminar',
    passage: [
      'A foundational premise of Enlightenment philosophy and traditional science communication is the "information deficit model": the belief that public disagreement over empirical questions stems primarily from a lack of factual knowledge or analytical training. According to this view, when citizens reject scientific consensus on public-health measures, economic policy, or environmental risk, providing clearer statistical graphs and improving general quantitative literacy should steadily bring opposing groups into agreement. Over the past two decades, however, empirical research in cognitive and political psychology has revealed a disconcerting paradox: on culturally polarized topics, individuals who score highest on tests of mathematical numeracy and analytical reflection are often the most polarized of all.',
      'To explain this counterintuitive finding, psychologist Ziva Kunda and legal scholar Dan Kahan developed the frameworks of directional motivated reasoning and identity-protective cognition. Unlike "accuracy-motivated reasoning," in which a thinker uses analytical effort to arrive at the most objectively true conclusion regardless of preference, directional motivated reasoning occurs when an unconscious goal—such as defending one’s moral standing or maintaining solidarity with a valued peer group—guides how evidence is evaluated. Crucially, human beings are not gullible fantasists who can simply believe whatever they wish without justification; to feel convinced, a reasoner must construct a seemingly plausible argument that would satisfy a neutral observer.',
      'This constraint produces a striking cognitive asymmetry between how people evaluate congenial evidence ("Can I believe this?") and uncongenial evidence ("Must I believe this?"). When presented with a research study that supports their existing worldview, people ask the permissive question "Can I believe this?"—scanning the text for a single supportive data point and accepting the methodology at face value once that minimal threshold is met. When confronted with a study that threatens a core belief, however, the same individuals switch to the stringent question "Must I believe this?"—deploying their full analytical repertoire to scrutinize sample sizes, control variables, and potential confounds until they uncover a flaw that justifies dismissing the study.',
      'In a landmark experimental demonstration, Kahan and his colleagues asked more than one thousand adults of varying numeracy levels to interpret a two-by-two contingency table showing the results of a controlled trial. In the first condition, the numbers were labelled as a test of whether a new skin-rash cream reduced rashes; in the second condition, the exact same mathematical numbers were labelled as a study of a politically contentious municipal policy. Because calculating the true effect from a two-by-two table requires comparing conditional ratios rather than raw totals, low-numeracy participants frequently misread the table in both conditions.',
      'Among highly numerate participants, the results were illuminating. When the table described a politically neutral skin cream, individuals with strong mathematical skills correctly calculated the conditional ratios regardless of whether the cream worked or failed. Yet when the identical numbers were framed around the polarized policy issue, high-numeracy participants calculated the ratios accurately only when the true mathematical answer aligned with their prior group allegiance. When the correct calculation contradicted their group’s stance, highly numerate participants used their superior quantitative skills to invent elaborate rationalizations for reading the raw totals instead—magnifying partisan divergence rather than narrowing it.',
      'Does this mean human reasoning is hopelessly captive to group identity? Fortunately, further experiments show that identity-protective cognition can be disarmed by changing the social meaning of the inquiry. When researchers measured a trait they termed "science curiosity"—an intrinsic pleasure in discovering surprising empirical truths for their own sake—curious individuals willingly updated their beliefs across political lines. Similarly, framing policy discussions around shared practical values and encouraging "self-affirmation" before presenting challenging evidence reduces social threat, allowing analytical intelligence to serve truth-seeking rather than intellectual self-defence. Evolutionary psychologists Kurt Gray, Hugo Mercier, and Dan Sperber offer a complementary structural explanation for why human reasoning behaves like a partisan lawyer when group identity is at stake, yet functions like an impartial scientist in collaborative settings. According to their "argumentative theory of reasoning," human deduction did not evolve for solitary philosophers sitting alone in caves; it evolved in small, interdependent foraging bands where individuals had to justify their proposals and evaluate the claims of peers. When a person reasons in isolation or inside an echo chamber of like-minded partisans, the "myside bias" goes unchallenged, and higher cognitive ability simply generates more sophisticated excuses for the preferred conclusion. When diverse thinkers deliberate under norms of mutual accountability, however, the same asymmetric scrutiny becomes a collective asset: each participant readily spots the methodological blind spots in a rival’s hypothesis that the author overlooked. Institutionalizing adversarial collaboration—where researchers from opposing theoretical camps jointly design an experiment and agree in advance on what empirical outcome will falsify each position—harnesses human reasoning’s sharpest critical instincts while neutralizing the identity-protective traps that distort solitary judgment. Public-deliberation experiments—such as citizens’ assemblies and structured forecasting tournaments—confirm that ordinary people reason with remarkable nuance when institutional rules reward accuracy over rhetorical point-scoring. In forecasting tournaments where participants state explicit probability estimates, track their calibration over time, and work in small teams that encourage devil’s-advocate questioning, ideological polarization drops sharply even on sensitive economic and environmental questions. Educators and science communicators are therefore shifting away from one-way lectures that trigger defensive identity shields, and toward inquiry-based workshops that decouple empirical evidence from partisan badges. Cultivating epistemic humility and collaborative norms allows analytical intelligence to fulfill its true promise. In editorial peer review and judicial panels alike, asking participants to articulate the strongest possible empirical case for a competing hypothesis before stating their own verdict measurably reduces confirmation bias and restores objective analytical calibration across complex policy debates.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'c1-exp-psy-1',
        word: 'premise',
        partOfSpeech: 'noun',
        simpleDefinition: 'A starting assumption or foundational idea upon which a larger theory is built.',
        contextMeaning: 'The basic starting belief behind traditional science communication.',
        originalSentence: 'A foundational premise of Enlightenment philosophy and traditional science communication is the "information deficit model": the belief that public disagreement over empirical questions stems primarily from a lack of factual knowledge or analytical training.',
        exampleSentence: 'The court’s decision rested on the premise that all citizens have equal rights.',
        synonyms: ['assumption', 'postulate', 'foundation'],
        arabicTranslation: 'مقدّمة منطقية / فرضية أساسية'
      },
      {
        id: 'c1-exp-psy-2',
        word: 'disconcerting',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Unsettling and disturbing because it challenges what people expected to be true.',
        contextMeaning: 'Troubling to educators who assumed math skill alone would reduce polarization.',
        originalSentence: 'Over the past two decades, however, empirical research in cognitive and political psychology has revealed a disconcerting paradox: on culturally polarized topics, individuals who score highest on tests of mathematical numeracy and analytical reflection are often the most polarized of all.',
        exampleSentence: 'It was disconcerting to discover a calculation error in the published report.',
        synonyms: ['unsettling', 'troubling', 'perturbing'],
        arabicTranslation: 'مُربك / مقلق'
      },
      {
        id: 'c1-exp-psy-3',
        word: 'congenial',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Agreeable and matching one’s existing opinions, preferences, or beliefs.',
        contextMeaning: 'Evidence that supports what a person already wants to believe.',
        originalSentence: 'This constraint produces a striking cognitive asymmetry between how people evaluate congenial evidence ("Can I believe this?") and uncongenial evidence ("Must I believe this?").',
        exampleSentence: 'Readers often prefer newspapers whose editorials are congenial to their own views.',
        synonyms: ['agreeable', 'aligned', 'favourable'],
        arabicTranslation: 'موافق للهوى أو الرأي المسبق'
      },
      {
        id: 'c1-exp-psy-4',
        word: 'stringent',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Extremely strict, demanding, and rigorous.',
        contextMeaning: 'Applying a much stricter standard of proof to evidence you dislike.',
        originalSentence: 'When confronted with a study that threatens a core belief, however, the same individuals switch to the stringent question "Must I believe this?"—deploying their full analytical repertoire to scrutinize sample sizes, control variables, and potential confounds until they uncover a flaw that justifies dismissing the study.',
        exampleSentence: 'Commercial aircraft must pass stringent safety inspections before flying.',
        synonyms: ['rigorous', 'strict', 'demanding'],
        arabicTranslation: 'صارم / متشدد'
      },
      {
        id: 'c1-exp-psy-5',
        word: 'scrutinize',
        partOfSpeech: 'verb',
        simpleDefinition: 'To examine every tiny detail of something critically in order to find faults.',
        contextMeaning: 'To search an unwelcome scientific paper closely for any methodological flaw.',
        originalSentence: 'When confronted with a study that threatens a core belief, however, the same individuals switch to the stringent question "Must I believe this?"—deploying their full analytical repertoire to scrutinize sample sizes, control variables, and potential confounds until they uncover a flaw that justifies dismissing the study.',
        exampleSentence: 'Auditors scrutinize company financial records for accounting errors.',
        synonyms: ['inspect closely', 'examine critically'],
        arabicTranslation: 'يدقق النظر بحثاً عن الثغرات'
      },
      {
        id: 'c1-exp-psy-6',
        word: 'contentious',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Causing heated disagreement and argument among different groups.',
        contextMeaning: 'Politically controversial and tied to group identity.',
        originalSentence: 'In the first condition, the numbers were labelled as a test of whether a new skin-rash cream reduced rashes; in the second condition, the exact same mathematical numbers were labelled as a study of a politically contentious municipal policy.',
        exampleSentence: 'Building a new highway through the valley became a contentious issue.',
        synonyms: ['controversial', 'disputed', 'divisive'],
        arabicTranslation: 'خلافي / مثير للجدل'
      },
      {
        id: 'c1-exp-psy-7',
        word: 'allegiance',
        partOfSpeech: 'noun',
        simpleDefinition: 'Loyalty and commitment to a social group, cause, or community.',
        contextMeaning: 'Loyalty to one’s political or cultural peer group.',
        originalSentence: 'Yet when the identical numbers were framed around the polarized policy issue, high-numeracy participants calculated the ratios accurately only when the true mathematical answer aligned with their prior group allegiance.',
        exampleSentence: 'Sports fans show strong allegiance to their hometown team.',
        synonyms: ['loyalty', 'fidelity', 'commitment'],
        arabicTranslation: 'ولاء / انتماء'
      },
      {
        id: 'c1-exp-psy-8',
        word: 'intrinsic',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Belonging naturally to something for its own sake, rather than for an external reward.',
        contextMeaning: 'Genuine inner curiosity to learn the truth for its own sake.',
        originalSentence: 'When researchers measured a trait they termed "science curiosity"—an intrinsic pleasure in discovering surprising empirical truths for their own sake—curious individuals willingly updated their beliefs across political lines.',
        exampleSentence: 'Children have an intrinsic curiosity about how the natural world works.',
        synonyms: ['inherent', 'innate', 'internal'],
        arabicTranslation: 'ذاتي / نابع من الداخل'
      }
    ],
    questions: [
      {
        id: 'c1-exp-psy-q1',
        type: 'true_false_not_given',
        prompt: 'The "information deficit model" assumes that public disagreement over scientific facts is mainly caused by a lack of knowledge or analytical skill.',
        correctAnswer: 'True',
        explanation: 'Paragraph 1 defines the information deficit model as the belief that public disagreement over empirical questions stems primarily from a lack of factual knowledge or analytical training.',
        passageEvidence: 'A foundational premise of Enlightenment philosophy and traditional science communication is the "information deficit model": the belief that public disagreement over empirical questions stems primarily from a lack of factual knowledge or analytical training.'
      },
      {
        id: 'c1-exp-psy-q2',
        type: 'true_false_not_given',
        prompt: 'In Kahan’s contingency-table experiment, low-numeracy participants easily calculated the conditional ratios in the skin-cream condition.',
        correctAnswer: 'False',
        explanation: 'Paragraph 4 states that because calculating the true effect from a two-by-two table requires comparing conditional ratios, low-numeracy participants frequently misread the table in both conditions.',
        passageEvidence: 'Because calculating the true effect from a two-by-two table requires comparing conditional ratios rather than raw totals, low-numeracy participants frequently misread the table in both conditions.'
      },
      {
        id: 'c1-exp-psy-q3',
        type: 'true_false_not_given',
        prompt: 'Participants with post-graduate degrees in physics scored higher on the science-curiosity scale than participants with degrees in economics.',
        correctAnswer: 'Not Given',
        explanation: 'Paragraph 6 discusses the "science curiosity" trait, but the passage never compares physics graduates with economics graduates.',
        passageEvidence: 'When researchers measured a trait they termed "science curiosity"—an intrinsic pleasure in discovering surprising empirical truths for their own sake—curious individuals willingly updated their beliefs across political lines.'
      },
      {
        id: 'c1-exp-psy-q4',
        type: 'yes_no_not_given',
        prompt: 'The author argues that mandatory university courses in formal symbolic logic are the single most effective way to boost science curiosity in adults.',
        correctAnswer: 'Not Given',
        explanation: 'In Paragraph 6, the author discusses how science curiosity and self-affirmation exercises help disarm identity-protective cognition, but never mentions university courses in formal symbolic logic.',
        passageEvidence: 'Fortunately, further experiments show that identity-protective cognition can be disarmed by changing the social meaning of the inquiry.'
      },
      {
        id: 'c1-exp-psy-q5',
        type: 'multiple_choice',
        prompt: 'What cognitive asymmetry do researchers observe when people evaluate congenial versus uncongenial scientific studies?',
        options: [
          'People apply a permissive "Can I believe this?" standard to supportive studies, but a strict "Must I believe this?" standard to threatening studies',
          'People scrutinize sample sizes and control variables only when a study agrees with their existing worldview',
          'People accept every study that contradicts their peer group without checking its methodology',
          'Highly numerate people refuse to read any study that includes a two-by-two statistical table'
        ],
        correctAnswer: 'People apply a permissive "Can I believe this?" standard to supportive studies, but a strict "Must I believe this?" standard to threatening studies',
        explanation: 'Paragraph 3 explains that people ask the permissive question "Can I believe this?" for congenial evidence, but switch to the stringent question "Must I believe this?" for uncongenial evidence.',
        passageEvidence: 'This constraint produces a striking cognitive asymmetry between how people evaluate congenial evidence ("Can I believe this?") and uncongenial evidence ("Must I believe this?").'
      },
      {
        id: 'c1-exp-psy-q6',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with TWO WORDS from Paragraph 6: When researchers measured a trait termed "______"—an intrinsic pleasure in discovering surprising truths—individuals updated their beliefs across political lines.',
        correctAnswer: 'science curiosity',
        acceptedAnswers: ['science curiosity'],
        explanation: 'Paragraph 6 states: \'When researchers measured a trait they termed "science curiosity"—an intrinsic pleasure in discovering surprising empirical truths for their own sake—curious individuals willingly updated their beliefs\'.',
        passageEvidence: 'When researchers measured a trait they termed "science curiosity"—an intrinsic pleasure in discovering surprising empirical truths for their own sake—curious individuals willingly updated their beliefs across political lines.'
      },
      {
        id: 'c1-exp-psy-q7',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 3, the word "stringent" is closest in meaning to:',
        options: [
          'Strict and demanding',
          'Careless and hasty',
          'Friendly and welcoming',
          'Mathematically simple'
        ],
        correctAnswer: 'Strict and demanding',
        explanation: 'In Paragraph 3, "the stringent question \'Must I believe this?\'" contrasts with "the permissive question \'Can I believe this?\'"',
        passageEvidence: 'When confronted with a study that threatens a core belief, however, the same individuals switch to the stringent question "Must I believe this?"—deploying their full analytical repertoire to scrutinize sample sizes, control variables, and potential confounds until they uncover a flaw that justifies dismissing the study.'
      },
      {
        id: 'c1-exp-psy-q8',
        type: 'short_answer',
        prompt: 'Answer with TWO WORDS from Paragraph 4: What neutral medical product was used in the first condition of Kahan’s two-by-two table experiment?',
        correctAnswer: 'skin-rash cream',
        acceptedAnswers: ['skin-rash cream', 'skin cream', 'a new skin-rash cream'],
        explanation: 'Paragraph 4 states that in the first condition, the numbers were labelled as a test of whether a new skin-rash cream reduced rashes (also referred to in Paragraph 5 as a skin cream).',
        passageEvidence: 'In the first condition, the numbers were labelled as a test of whether a new skin-rash cream reduced rashes; in the second condition, the exact same mathematical numbers were labelled as a study of a politically contentious municipal policy.'
      },
      {
        id: 'c1-exp-psy-q9',
        type: 'matching_information',
        prompt: 'Which paragraph explains how high-numeracy participants performed on the politically neutral table compared with the polarized policy table?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4', 'Paragraph 5', 'Paragraph 6'],
        correctAnswer: 'Paragraph 5',
        explanation: 'Paragraph 5 contrasts high-numeracy participants’ accurate calculations on the skin-cream table with their identity-aligned rationalizations on the polarized policy table.',
        passageEvidence: 'When the table described a politically neutral skin cream, individuals with strong mathematical skills correctly calculated the conditional ratios regardless of whether the cream worked or failed. Yet when the identical numbers were framed around the polarized policy issue, high-numeracy participants calculated the ratios accurately only when the true mathematical answer aligned with their prior group allegiance.'
      },
      {
        id: 'c1-exp-psy-q10',
        type: 'summary_completion',
        prompt: 'Complete the summary with TWO WORDS from Paragraph 4: Correctly interpreting a two-by-two experimental table requires comparing ______ rather than raw totals.',
        correctAnswer: 'conditional ratios',
        acceptedAnswers: ['conditional ratios', 'ratios'],
        explanation: 'Paragraph 4 states that calculating the true effect from a two-by-two table requires comparing conditional ratios rather than raw totals.',
        passageEvidence: 'Because calculating the true effect from a two-by-two table requires comparing conditional ratios rather than raw totals, low-numeracy participants frequently misread the table in both conditions.'
      }
    ]
  },
  {
    id: 'c1-14-abbasid-translation-movement',
    title: 'Bayt al-Hikmah and the Epistemic Synthesis of the Graeco-Arabic Translation Movement',
    level: 'C1',
    topic: 'History and archaeology',
    status: 'published',
    estimatedMinutes: 14,
    generationBatch: 'batch-expansion-c1',
    imageStatus: 'ready',
    introduction: 'Examine how eighth- to tenth-century scholars in Baghdad systematically translated, critiqued, and synthesized Greek, Persian, and Sanskrit scientific manuscripts.',
    illustrationAlt: 'Photograph of historic stone arches and scholarly courtyard architecture in the Middle East',
    passage: [
      'Between the mid-eighth and late tenth centuries CE, the Abbasid capital of Baghdad stood at the centre of one of history’s most ambitious intellectual enterprises: the Graeco-Arabic translation movement. Mobilized by caliphs, court physicians, astronomers, and wealthy merchant families, multilingual scholars systematically rendered virtually the entire surviving corpus of secular Greek science, mathematics, medicine, and philosophy—alongside major Sanskrit astronomical tables and Pahlavi Persian chronicles—into Arabic. In older European histories, this two-hundred-year movement was frequently caricatured as a passive "refrigerator" that merely stored classical Greek texts until Renaissance translators rendered them into Latin. Contemporary historians of science, led by Dimitri Gutas and George Saliba, have thoroughly refuted that passive model, demonstrating that the Abbasid translation movement was an active, critical engine of scientific innovation.',
      'Two material and social transformations made the scale of this enterprise possible. The first was the geopolitical unification of territories stretching from North Africa to Central Asia, which brought Greek-, Syriac-, Persian-, and Arabic-speaking scholars into daily contact within a single administrative sphere. The second was a technological revolution in book production: the introduction of rag-paper manufacturing from China into Samarkand and Baghdad in the late eighth century. Unlike fragile Egyptian papyrus or prohibitively expensive sheepskin parchment, rag paper was durable, smooth, and cheap to manufacture in urban paper mills. For the first time in antiquity or the Middle Ages, treatises on optics, algebra, and pharmacology could be copied in hundreds of affordable volumes and circulated across public and private libraries, most famously the caliphal library and academy known as Bayt al-Hikmah (the House of Wisdom).',
      'Methodologically, the translators rapidly outgrew mechanical word-for-word rendering. Early translators often replaced each Greek word with a literal Syriac or Arabic equivalent in the exact Greek word order, a rigid approach that frequently obscured complex mathematical or anatomical arguments. By the mid-ninth century, the renowned Nestorian Christian physician and philologist Hunayn ibn Ishaq and his circle of translators had established a rigorous philological method that anticipates modern critical editions. Before translating a medical treatise by Galen or a geometrical work by Euclid, Hunayn travelled across Mesopotamia, Syria, Palestine, and Alexandria to collate multiple surviving Greek manuscripts, comparing defective copies line by line to reconstruct an authoritative source text.',
      'Once the Greek text was verified, Hunayn rejected word-for-word substitution in favour of "sense-for-sense" translation: grasping the whole conceptual proposition of a Greek sentence and expressing it in clear, idiomatic Arabic prose. Where Arabic lacked technical terms for Greek philosophical abstractions or anatomical structures, translators coined precise neologisms derived from triliteral Arabic roots or standardized existing medical terminology—creating a unified scientific vocabulary that remained the international language of research from Córdoba to Samarkand for centuries.',
      'Crucially, translation and original scientific critique occurred side by side; scholars translated texts specifically because they needed to solve practical and theoretical problems. When the mathematician Muhammad ibn Musa al-Khwarizmi synthesized Indian decimal numerals with Greek Euclidean geometry in early ninth-century Baghdad, he founded the independent discipline of algebra (al-jabr), providing general algorithms for solving linear and quadratic equations that went far beyond Diophantus. Similarly, the physician Abu Bakr al-Razi compiled clinical hospital observations in his Doubts About Galen, demonstrating empirically that Galen’s classical theory of the four humours failed to explain several fevers and smallpox.',
      'In astronomy and optics, this critical spirit was equally transformative. Observational astronomers in Baghdad and Damascus constructed giant masonry quadrants to re-measure the tilt of Earth’s axis and the precession of the equinoxes, uncovering mathematical contradictions in Ptolemy’s Almagest that paved the way for non-Ptolemaic planetary models. And in eleventh-century Cairo, Ibn al-Haytham (Alhazen) overturned the ancient Greek "extramission" theory—which claimed that human eyes see by shooting out invisible beams—by proving through camera-obscura experiments that vision occurs when light rays bounce off objects and enter the eye. Far from being a passive warehouse, the translation movement forged the experimental and mathematical methods of modern science. Historians of science also emphasize the institutional longevity and geographic reach of this Arabic scientific commonwealth. Because translators in ninth-century Baghdad forged a standardized, unambiguous technical lexicon across mathematics, pharmacology, and mechanics, a treatise composed in Nishapur or Cairo could be read, critiqued, and expanded within months by scholars in Marrakech, Toledo, or Palermo without requiring further translation. Moreover, the patronage model of the movement—supported not merely by a single caliph, but by rival viziers, hospital directors, estate owners, and endowers of public waqf libraries—insulated scientific inquiry from the rise and fall of individual dynasties. When twelfth-century Latin scholars such as Gerard of Cremona travelled to Toledo to render Arabic scientific compendia into Latin, they did not simply recover bare classical Greek texts; they inherited centuries of empirical corrections, trigonometric sine tables, algebraic notation, clinical hospital casebooks, and experimental optics that fundamentally reshaped the intellectual trajectory of medieval and early modern Europe. Recent codicological research in manuscript archives from Istanbul and Damascus to Timbuktu and Patna continues to uncover previously uncatalogued Arabic commentaries on mechanics, agronomy, and mathematical astronomy. Each newly edited treatise reinforces the conclusion that scientific progress is never the monopoly of a single civilization, but a cumulative global dialogue built on rigorous philology, open inquiry, and empirical testing. By uniting the intellectual legacies of Greece, Persia, and India with new experimental rigor, the scholars of the Abbasid era created a model of cross-cultural scholarship that endures today. Digital humanities projects now pair multispectral imaging with optical character recognition for classical Arabic script, allowing historians worldwide to compare surviving manuscripts from Baghdad, Cairo, and Córdoba and trace how mathematical proofs evolved across centuries of collaborative commentary.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'c1-exp-his-1',
        word: 'corpus',
        partOfSpeech: 'noun',
        simpleDefinition: 'The complete collection of written works on a subject or from a historical civilization.',
        contextMeaning: 'The entire body of surviving Greek scientific and philosophical books.',
        originalSentence: 'Mobilized by caliphs, court physicians, astronomers, and wealthy merchant families, multilingual scholars systematically rendered virtually the entire surviving corpus of secular Greek science, mathematics, medicine, and philosophy—alongside major Sanskrit astronomical tables and Pahlavi Persian chronicles—into Arabic.',
        exampleSentence: 'Scholars digitized the entire corpus of medieval medical manuscripts.',
        synonyms: ['body of work', 'collection', 'canon'],
        arabicTranslation: 'المدوّنة الكاملة للمؤلفات'
      },
      {
        id: 'c1-exp-his-2',
        word: 'caricatured',
        partOfSpeech: 'verb',
        simpleDefinition: 'Described in an oversimplified, inaccurate, or unfair way.',
        contextMeaning: 'Falsely portrayed in older histories as a passive storage room rather than a creative centre.',
        originalSentence: 'In older European histories, this two-hundred-year movement was frequently caricatured as a passive "refrigerator" that merely stored classical Greek texts until Renaissance translators rendered them into Latin.',
        exampleSentence: 'Complex historical periods are often caricatured in short textbooks.',
        synonyms: ['misrepresented', 'oversimplified', 'distorted'],
        arabicTranslation: 'صُوّر بشكل مشوّه ومختزل'
      },
      {
        id: 'c1-exp-his-3',
        word: 'refuted',
        partOfSpeech: 'verb',
        simpleDefinition: 'Proved a statement or theory to be wrong using solid evidence.',
        contextMeaning: 'Disproved the false claim that Abbasid scholars only stored Greek books passively.',
        originalSentence: 'Contemporary historians of science, led by Dimitri Gutas and George Saliba, have thoroughly refuted that passive model, demonstrating that the Abbasid translation movement was an active, critical engine of scientific innovation.',
        exampleSentence: 'Laboratory experiments refuted the old theory of spontaneous generation.',
        synonyms: ['disproved', 'debunked', 'rebutted'],
        arabicTranslation: 'دحض / أثبت بطلان'
      },
      {
        id: 'c1-exp-his-4',
        word: 'prohibitively',
        partOfSpeech: 'adverb',
        simpleDefinition: 'To such a high degree that it prevents people from buying or using something.',
        contextMeaning: 'So expensive that ordinary scholars could not afford many parchment books.',
        originalSentence: 'Unlike fragile Egyptian papyrus or prohibitively expensive sheepskin parchment, rag paper was durable, smooth, and cheap to manufacture in urban paper mills.',
        exampleSentence: 'Hand-copied parchment books were prohibitively costly before paper mills.',
        synonyms: ['excessively', 'unaffordably'],
        arabicTranslation: 'بشكل باهظ يمنع الاقتناء'
      },
      {
        id: 'c1-exp-his-5',
        word: 'collate',
        partOfSpeech: 'verb',
        simpleDefinition: 'To collect and compare several texts carefully line by line to note differences and correct errors.',
        contextMeaning: 'To gather multiple Greek manuscripts and compare them to fix copying mistakes.',
        originalSentence: 'Before translating a medical treatise by Galen or a geometrical work by Euclid, Hunayn travelled across Mesopotamia, Syria, Palestine, and Alexandria to collate multiple surviving Greek manuscripts, comparing defective copies line by line to reconstruct an authoritative source text.',
        exampleSentence: 'Editors collate early printed editions to prepare an accurate text.',
        synonyms: ['compare', 'cross-check', 'compile'],
        arabicTranslation: 'يقابل النسخ المخطوطة ويحققها'
      },
      {
        id: 'c1-exp-his-6',
        word: 'idiomatic',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Written in natural, fluent language that sounds clear to native readers.',
        contextMeaning: 'Natural, clear Arabic sentences rather than awkward word-for-word copies of Greek grammar.',
        originalSentence: 'Once the Greek text was verified, Hunayn rejected word-for-word substitution in favour of "sense-for-sense" translation: grasping the whole conceptual proposition of a Greek sentence and expressing it in clear, idiomatic Arabic prose.',
        exampleSentence: 'A good translator turns foreign idioms into natural, idiomatic English.',
        synonyms: ['natural', 'fluent'],
        arabicTranslation: 'فصيح وسليم الصياغة اللغوية'
      },
      {
        id: 'c1-exp-his-7',
        word: 'neologisms',
        partOfSpeech: 'noun',
        simpleDefinition: 'Newly coined words or expressions created to name new concepts.',
        contextMeaning: 'New Arabic scientific terms built from Arabic roots to express technical concepts.',
        originalSentence: 'Where Arabic lacked technical terms for Greek philosophical abstractions or anatomical structures, translators coined precise neologisms derived from triliteral Arabic roots or standardized existing medical terminology—creating a unified scientific vocabulary that remained the international language of research from Córdoba to Samarkand for centuries.',
        exampleSentence: 'Computer science has introduced many neologisms into everyday speech.',
        synonyms: ['coined terms', 'new words'],
        arabicTranslation: 'مصطلحات مستحدثة'
      },
      {
        id: 'c1-exp-his-8',
        word: 'empirically',
        partOfSpeech: 'adverb',
        simpleDefinition: 'By means of direct observation, clinical testing, and experiment rather than ancient authority.',
        contextMeaning: 'Using real hospital patient observations to test Galen’s medical claims.',
        originalSentence: 'Similarly, the physician Abu Bakr al-Razi compiled clinical hospital observations in his Doubts About Galen, demonstrating empirically that Galen’s classical theory of the four humours failed to explain several fevers and smallpox.',
        exampleSentence: 'Ibn al-Haytham tested optical laws empirically using a dark chamber.',
        synonyms: ['experimentally', 'by observation'],
        arabicTranslation: 'تجريبياً / بالملاحظة السريرية والاختبار'
      }
    ],
    questions: [
      {
        id: 'c1-exp-his-q1',
        type: 'true_false_not_given',
        prompt: 'The introduction of rag-paper manufacturing from China made books much cheaper and more durable than papyrus or sheepskin parchment.',
        correctAnswer: 'True',
        explanation: 'Paragraph 2 states that unlike fragile Egyptian papyrus or prohibitively expensive sheepskin parchment, rag paper introduced from China was durable, smooth, and cheap to manufacture.',
        passageEvidence: 'The second was a technological revolution in book production: the introduction of rag-paper manufacturing from China into Samarkand and Baghdad in the late eighth century. Unlike fragile Egyptian papyrus or prohibitively expensive sheepskin parchment, rag paper was durable, smooth, and cheap to manufacture in urban paper mills.'
      },
      {
        id: 'c1-exp-his-q2',
        type: 'true_false_not_given',
        prompt: 'Hunayn ibn Ishaq insisted on translating every Greek sentence word-for-word in the exact Greek word order.',
        correctAnswer: 'False',
        explanation: 'Paragraphs 3 and 4 explain that Hunayn rejected mechanical word-for-word substitution in favour of "sense-for-sense" translation into clear, idiomatic Arabic prose.',
        passageEvidence: 'Once the Greek text was verified, Hunayn rejected word-for-word substitution in favour of "sense-for-sense" translation: grasping the whole conceptual proposition of a Greek sentence and expressing it in clear, idiomatic Arabic prose.'
      },
      {
        id: 'c1-exp-his-q3',
        type: 'true_false_not_given',
        prompt: 'Paper mills in Samarkand employed more workers than paper mills in Baghdad.',
        correctAnswer: 'Not Given',
        explanation: 'Paragraph 2 mentions rag-paper manufacturing in Samarkand and Baghdad, but it never compares the number of workers in their mills.',
        passageEvidence: 'The second was a technological revolution in book production: the introduction of rag-paper manufacturing from China into Samarkand and Baghdad in the late eighth century.'
      },
      {
        id: 'c1-exp-his-q4',
        type: 'yes_no_not_given',
        prompt: 'The author contends that the astronomical observatories in Damascus received larger annual endowments than the Bayt al-Hikmah library in Baghdad.',
        correctAnswer: 'Not Given',
        explanation: 'The author mentions both Bayt al-Hikmah in Baghdad and observational astronomers in Baghdad and Damascus, as well as waqf endowments, but never compares the annual funding amounts of the two cities’ institutions.',
        passageEvidence: 'Observational astronomers in Baghdad and Damascus constructed giant masonry quadrants to re-measure the tilt of Earth’s axis and the precession of the equinoxes, uncovering mathematical contradictions in Ptolemy’s Almagest that paved the way for non-Ptolemaic planetary models.'
      },
      {
        id: 'c1-exp-his-q5',
        type: 'multiple_choice',
        prompt: 'What philological step did Hunayn ibn Ishaq take before translating a Greek treatise by Galen or Euclid?',
        options: [
          'He travelled across the region to collect and compare multiple Greek manuscripts line by line to reconstruct an accurate source text',
          'He burned all defective Greek copies so only a single manuscript remained in Alexandria',
          'He translated the text directly from Latin summaries written in Córdoba',
          'He replaced all mathematical diagrams with Pahlavi Persian poetry'
        ],
        correctAnswer: 'He travelled across the region to collect and compare multiple Greek manuscripts line by line to reconstruct an accurate source text',
        explanation: 'Paragraph 3 explains that Hunayn travelled across Mesopotamia, Syria, Palestine, and Alexandria to collate multiple surviving Greek manuscripts, comparing defective copies line by line.',
        passageEvidence: 'Before translating a medical treatise by Galen or a geometrical work by Euclid, Hunayn travelled across Mesopotamia, Syria, Palestine, and Alexandria to collate multiple surviving Greek manuscripts, comparing defective copies line by line to reconstruct an authoritative source text.'
      },
      {
        id: 'c1-exp-his-q6',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 5: By synthesizing Indian decimal numerals with Euclidean geometry, al-Khwarizmi founded the independent discipline of ______.',
        correctAnswer: 'algebra',
        acceptedAnswers: ['algebra', 'al-jabr'],
        explanation: 'Paragraph 5 states that al-Khwarizmi founded the independent discipline of algebra (al-jabr).',
        passageEvidence: 'When the mathematician Muhammad ibn Musa al-Khwarizmi synthesized Indian decimal numerals with Greek Euclidean geometry in early ninth-century Baghdad, he founded the independent discipline of algebra (al-jabr), providing general algorithms for solving linear and quadratic equations that went far beyond Diophantus.'
      },
      {
        id: 'c1-exp-his-q7',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 3, the word "collate" is closest in meaning to:',
        options: [
          'Gather and compare multiple manuscripts line by line',
          'Store parchment scrolls inside a locked wooden chest',
          'Translate scientific terms without reading the original Greek',
          'Bind pages together using coconut-husk rope'
        ],
        correctAnswer: 'Gather and compare multiple manuscripts line by line',
        explanation: 'Paragraph 3 defines "collate multiple surviving Greek manuscripts" as "comparing defective copies line by line to reconstruct an authoritative source text."',
        passageEvidence: 'Before translating a medical treatise by Galen or a geometrical work by Euclid, Hunayn travelled across Mesopotamia, Syria, Palestine, and Alexandria to collate multiple surviving Greek manuscripts, comparing defective copies line by line to reconstruct an authoritative source text.'
      },
      {
        id: 'c1-exp-his-q8',
        type: 'short_answer',
        prompt: 'Answer with THREE WORDS from Paragraph 6: Who proved through camera-obscura experiments in eleventh-century Cairo that vision occurs when light rays enter the eye?',
        correctAnswer: 'Ibn al-Haytham',
        acceptedAnswers: ['Ibn al-Haytham', 'Alhazen'],
        explanation: 'Paragraph 6 states that in eleventh-century Cairo, Ibn al-Haytham (Alhazen) overturned the extramission theory through camera-obscura experiments.',
        passageEvidence: 'And in eleventh-century Cairo, Ibn al-Haytham (Alhazen) overturned the ancient Greek "extramission" theory—which claimed that human eyes see by shooting out invisible beams—by proving through camera-obscura experiments that vision occurs when light rays bounce off objects and enter the eye.'
      },
      {
        id: 'c1-exp-his-q9',
        type: 'matching_information',
        prompt: 'Which paragraph explains how geopolitical unification and Chinese rag-paper manufacturing enabled the rapid spread of scientific books?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4', 'Paragraph 5', 'Paragraph 6'],
        correctAnswer: 'Paragraph 2',
        explanation: 'Paragraph 2 outlines the two material and social transformations: geopolitical unification and the introduction of rag-paper manufacturing from China.',
        passageEvidence: 'Two material and social transformations made the scale of this enterprise possible.'
      },
      {
        id: 'c1-exp-his-q10',
        type: 'summary_completion',
        prompt: 'Complete the summary with ONE WORD from Paragraph 5: In his book Doubts About Galen, the physician Abu Bakr al-Razi used clinical hospital observations to challenge Galen’s theory of the four ______.',
        correctAnswer: 'humours',
        acceptedAnswers: ['humours', 'humors'],
        explanation: 'Paragraph 5 states that al-Razi demonstrated empirically that Galen’s classical theory of the four humours failed to explain several fevers and smallpox.',
        passageEvidence: 'Similarly, the physician Abu Bakr al-Razi compiled clinical hospital observations in his Doubts About Galen, demonstrating empirically that Galen’s classical theory of the four humours failed to explain several fevers and smallpox.'
      }
    ]
  },
  {
    id: 'c1-15-cognitive-load-multimedia',
    title: 'Split-Attention and Expertise Reversal in Cognitive Load Theory',
    level: 'C1',
    topic: 'Education and learning',
    status: 'published',
    estimatedMinutes: 14,
    generationBatch: 'batch-expansion-c1',
    imageStatus: 'ready',
    introduction: 'Analyze why instructional designs that help novices learn complex schemas can paradoxically hinder advanced learners once knowledge is automated.',
    illustrationAlt: 'Photograph of students working through mathematical and engineering diagrams on a classroom board',
    passage: [
      'Since its formulation by educational psychologist John Sweller in the late 1980s, Cognitive Load Theory (CLT) has provided an empirical blueprint for designing instructional materials grounded in the architecture of human memory. The theory rests on a fundamental structural asymmetry between two memory systems. Human working memory—the conscious workspace where we hold and manipulate new information—is severely limited in both capacity and duration, capable of actively coordinating only about four novel elements for no more than twenty seconds without rehearsal. Long-term memory, by contrast, is an effectively limitless repository of organized knowledge structures known as schemas. Once a learner has consolidated a complex procedure into a long-term schema—such as recognizing a chess opening or reading an algebraic equation—that entire multi-step structure can be brought into working memory as a single effortless chunk.',
      'To optimize schema acquisition, Sweller and his colleagues distinguish between three categories of cognitive load that compete for scarce working-memory bandwidth. The first, intrinsic load, is determined by the inherent "element interactivity" of the subject matter itself: learning an isolated vocabulary word has low element interactivity, whereas understanding how changing one resistor alters current across an entire parallel electrical circuit has high element interactivity because multiple variables must be held in mind simultaneously. The second category, extraneous load, is unproductive mental effort imposed not by the difficulty of the topic, but by clumsy instructional design. The third category, germane load, represents the productive cognitive effort devoted to abstracting patterns and constructing durable long-term schemas.',
      'Because intrinsic and extraneous load are additive, poorly designed textbooks and multimedia slides can easily push a learner’s total cognitive load past the ceiling of working memory, halting comprehension altogether. One of the most pervasive sources of extraneous load in technical education is the "split-attention effect." Consider a classic geometry or physiology textbook that prints a complex labelled diagram at the top of the page—marked only with letters A, B, C, and D—and places the explanatory legend in a dense paragraph at the bottom of the page. To understand a single step, the novice student must read a sentence at the bottom, hold the letter "C" and its technical definition in working memory, visually scan upward to locate "C" on the diagram, relate it to adjacent parts, and then search back down for the next sentence. That constant visual searching and mental cross-referencing consumes precious working-memory slots without contributing anything to schema construction.',
      'Controlled experiments demonstrate that physically integrating short text labels directly onto the relevant arrows of the diagram—or presenting the explanation as spoken narration while the student looks at the visual diagram, thereby splitting the load across separate visual and auditory working-memory channels—eliminates split attention and substantially accelerates novice learning. Similarly, the "worked-example effect" shows that beginners learn complex problem-solving far more rapidly by studying step-by-step worked solutions than by being thrown into unguided problem-solving, which overloads working memory with random trial-and-error searches.',
      'Yet Cognitive Load Theory also reveals a crucial boundary condition that curriculum designers frequently overlook: the "expertise reversal effect." Instructional scaffolds that are essential for novices become neutral—and eventually actively counterproductive—as a learner’s expertise grows. Once an advanced medical student or senior engineer has already stored an automated schema for reading an electrocardiogram or circuit diagram in long-term memory, they can grasp the bare diagram at a glance. If an instructional module forces that expert to read embedded basic labels or listen to step-by-step narration explaining what they already know, the expert must expend extra working-memory effort to cross-reference and suppress the redundant explanation.',
      'This "redundancy penalty" explains why adaptive learning systems must dynamically fade instructional scaffolding as competence increases. A well-calibrated curriculum begins with integrated diagrams and fully worked examples for novices, transitions to partially completed "faded" examples for intermediate learners, and finally hands over unguided, complex problems to advanced practitioners—matching external support to the evolving contents of long-term memory. Recent extensions of Cognitive Load Theory also distinguish between the transient nature of spoken audio and the permanent inspectability of written text. Although the modality principle demonstrates that replacing short on-screen captions with spoken narration frees visual working memory when a student is inspecting a complex animation, this advantage reverses—known as the "transient information effect"—whenever the spoken explanation consists of long, syntactically dense sentences or multi-step mathematical derivations. Because spoken words vanish the instant they are uttered, a learner listening to a sixty-word technical paragraph must hold early clauses in their phonological loop while simultaneously parsing later clauses, rapidly overwhelming working-memory capacity. Written text, by contrast, allows the reader to pause, regress to an earlier term, and regulate their own cognitive pace. Effective instructional designers therefore segment dynamic animations into short, learner-paced micro-clips paired with concise spoken cues, while keeping formal definitions and reference equations anchored in clean, spatially integrated text beside the diagram. Respecting the biological bottlenecks of human working memory transforms multimedia design from decorative entertainment into rigorous cognitive engineering. Educational technologists are now embedding real-time cognitive-load diagnostics into interactive tutoring platforms by combining rapid single-question mental-effort ratings with response-time analytics. When a learner solves a faded problem accurately with low reported mental effort, the software automatically strips away the next layer of scaffolding; conversely, if response latency spikes and errors appear, the system restores a worked example before frustration sets in. Tailoring the density of guidance to each student’s momentary schema strength ensures that working memory is neither starved by boredom nor paralysed by overload.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'c1-exp-edu-1',
        word: 'repository',
        partOfSpeech: 'noun',
        simpleDefinition: 'A central storage place where large amounts of information or items are kept safely.',
        contextMeaning: 'Long-term memory acting as a vast storehouse of organized knowledge.',
        originalSentence: 'Long-term memory, by contrast, is an effectively limitless repository of organized knowledge structures known as schemas.',
        exampleSentence: 'The national archive serves as a repository for historical maps.',
        synonyms: ['storehouse', 'archive', 'vault'],
        arabicTranslation: 'مستودع / خزانة معرفية'
      },
      {
        id: 'c1-exp-edu-2',
        word: 'schemas',
        partOfSpeech: 'noun',
        simpleDefinition: 'Organized mental frameworks in long-term memory that group related facts and steps into a single unit.',
        contextMeaning: 'Mental structures that let an experienced learner treat a complex task as one simple unit.',
        originalSentence: 'Long-term memory, by contrast, is an effectively limitless repository of organized knowledge structures known as schemas.',
        exampleSentence: 'Master chess players rely on thousands of stored board schemas.',
        synonyms: ['mental frameworks', 'knowledge structures'],
        arabicTranslation: 'مخططات ذهنية منظمة'
      },
      {
        id: 'c1-exp-edu-3',
        word: 'extraneous',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Unnecessary and coming from outside the core task, getting in the way of what matters.',
        contextMeaning: 'Wasted mental effort caused by confusing page layout rather than the topic itself.',
        originalSentence: 'The second category, extraneous load, is unproductive mental effort imposed not by the difficulty of the topic, but by clumsy instructional design.',
        exampleSentence: 'Good editors remove extraneous details that distract from the main argument.',
        synonyms: ['unnecessary', 'irrelevant', 'superfluous'],
        arabicTranslation: 'خارجي دخيل / غير ضروري'
      },
      {
        id: 'c1-exp-edu-4',
        word: 'germane',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Directly relevant, helpful, and productive for the task at hand.',
        contextMeaning: 'Useful mental effort spent building lasting understanding and schemas.',
        originalSentence: 'The third category, germane load, represents the productive cognitive effort devoted to abstracting patterns and constructing durable long-term schemas.',
        exampleSentence: 'The committee focused only on facts germane to the safety review.',
        synonyms: ['relevant', 'productive', 'pertinent'],
        arabicTranslation: 'وثيق الصلة / بنّاء ومثمر'
      },
      {
        id: 'c1-exp-edu-5',
        word: 'pervasive',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Found everywhere throughout a field or system; very widespread.',
        contextMeaning: 'Appearing frequently across many traditional textbooks and slide decks.',
        originalSentence: 'One of the most pervasive sources of extraneous load in technical education is the "split-attention effect."',
        exampleSentence: 'Smartphone use has become pervasive in modern commuter trains.',
        synonyms: ['widespread', 'ubiquitous', 'common'],
        arabicTranslation: 'منتشر على نطاق واسع'
      },
      {
        id: 'c1-exp-edu-6',
        word: 'scaffolds',
        partOfSpeech: 'noun',
        simpleDefinition: 'Temporary instructional supports—like worked examples or hints—that help beginners learn a hard skill.',
        contextMeaning: 'Guided steps and embedded labels that support novices until they build their own schemas.',
        originalSentence: 'Instructional scaffolds that are essential for novices become neutral—and eventually actively counterproductive—as a learner’s expertise grows.',
        exampleSentence: 'Sentence starters act as helpful scaffolds for beginning writers.',
        synonyms: ['supports', 'learning aids', 'frameworks'],
        arabicTranslation: 'دعامات تعليمية مساندة'
      },
      {
        id: 'c1-exp-edu-7',
        word: 'counterproductive',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Having the opposite of the desired effect; making performance worse instead of better.',
        contextMeaning: 'Slowing down advanced learners instead of helping them.',
        originalSentence: 'Instructional scaffolds that are essential for novices become neutral—and eventually actively counterproductive—as a learner’s expertise grows.',
        exampleSentence: 'Skipping sleep to study all night is counterproductive before an exam.',
        synonyms: ['harmful', 'self-defeating', 'detrimental'],
        arabicTranslation: 'ذو أثر عكسي ضار'
      },
      {
        id: 'c1-exp-edu-8',
        word: 'redundant',
        partOfSpeech: 'adjective',
        simpleDefinition: 'No longer needed because the same information is already known or presented.',
        contextMeaning: 'Repeating basic explanations that an expert has already mastered.',
        originalSentence: 'If an instructional module forces that expert to read embedded basic labels or listen to step-by-step narration explaining what they already know, the expert must expend extra working-memory effort to cross-reference and suppress the redundant explanation.',
        exampleSentence: 'Once you know the route by heart, spoken GPS directions feel redundant.',
        synonyms: ['unnecessary', 'repetitive', 'superfluous'],
        arabicTranslation: 'مكرر / فائض عن الحاجة'
      }
    ],
    questions: [
      {
        id: 'c1-exp-edu-q1',
        type: 'true_false_not_given',
        prompt: 'Human working memory can actively coordinate only about four novel elements for roughly twenty seconds without rehearsal.',
        correctAnswer: 'True',
        explanation: 'Paragraph 1 states that human working memory is capable of actively coordinating only about four novel elements for no more than twenty seconds without rehearsal.',
        passageEvidence: 'Human working memory—the conscious workspace where we hold and manipulate new information—is severely limited in both capacity and duration, capable of actively coordinating only about four novel elements for no more than twenty seconds without rehearsal.'
      },
      {
        id: 'c1-exp-edu-q2',
        type: 'true_false_not_given',
        prompt: 'According to the "worked-example effect," complete beginners learn fastest when given unguided problems to solve by trial and error.',
        correctAnswer: 'False',
        explanation: 'Paragraph 4 states the opposite: the worked-example effect shows that beginners learn complex problem-solving far more rapidly by studying step-by-step worked solutions than by unguided trial-and-error.',
        passageEvidence: 'Similarly, the "worked-example effect" shows that beginners learn complex problem-solving far more rapidly by studying step-by-step worked solutions than by being thrown into unguided problem-solving, which overloads working memory with random trial-and-error searches.'
      },
      {
        id: 'c1-exp-edu-q3',
        type: 'true_false_not_given',
        prompt: 'John Sweller conducted his first split-attention experiments using university students in Sydney.',
        correctAnswer: 'Not Given',
        explanation: 'Paragraph 1 names John Sweller and Paragraph 3 describes the split-attention effect, but the passage never mentions Sydney.',
        passageEvidence: 'Since its formulation by educational psychologist John Sweller in the late 1980s, Cognitive Load Theory (CLT) has provided an empirical blueprint for designing instructional materials grounded in the architecture of human memory.'
      },
      {
        id: 'c1-exp-edu-q4',
        type: 'yes_no_not_given',
        prompt: 'The author argues that the exact same instructional scaffolding should be used for both complete novices and advanced experts.',
        correctAnswer: 'No',
        explanation: 'In Paragraphs 5 and 6, the author explains the expertise reversal effect: scaffolds essential for novices become counterproductive for experts, so scaffolding must gradually fade as competence grows.',
        passageEvidence: 'Instructional scaffolds that are essential for novices become neutral—and eventually actively counterproductive—as a learner’s expertise grows.'
      },
      {
        id: 'c1-exp-edu-q5',
        type: 'multiple_choice',
        prompt: 'What causes the "split-attention effect" in a traditional textbook diagram?',
        options: [
          'Printing a diagram marked only with letters at the top of the page while placing the explanatory text in a separate block at the bottom',
          'Integrating short text labels directly onto the relevant parts of the diagram',
          'Consolidating multi-step procedures into automated schemas in long-term memory',
          'Studying a single isolated vocabulary word with low element interactivity'
        ],
        correctAnswer: 'Printing a diagram marked only with letters at the top of the page while placing the explanatory text in a separate block at the bottom',
        explanation: 'Paragraph 3 explains that split attention occurs when a textbook prints a diagram marked with letters at the top and places the explanatory legend in a separate paragraph at the bottom, forcing visual searching and mental cross-referencing.',
        passageEvidence: 'Consider a classic geometry or physiology textbook that prints a complex labelled diagram at the top of the page—marked only with letters A, B, C, and D—and places the explanatory legend in a dense paragraph at the bottom of the page.'
      },
      {
        id: 'c1-exp-edu-q6',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 2: Unproductive mental effort caused by clumsy instructional design rather than topic difficulty is called ______ load.',
        correctAnswer: 'extraneous',
        acceptedAnswers: ['extraneous'],
        explanation: 'Paragraph 2 defines extraneous load as unproductive mental effort imposed not by the difficulty of the topic, but by clumsy instructional design.',
        passageEvidence: 'The second category, extraneous load, is unproductive mental effort imposed not by the difficulty of the topic, but by clumsy instructional design.'
      },
      {
        id: 'c1-exp-edu-q7',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 2, the word "germane" is closest in meaning to:',
        options: [
          'Productive and directly relevant to building schemas',
          'Wasteful and caused by confusing page layouts',
          'Forgotten within twenty seconds of reading',
          'Unrelated to the subject being studied'
        ],
        correctAnswer: 'Productive and directly relevant to building schemas',
        explanation: 'Paragraph 2 defines germane load as the productive cognitive effort devoted to abstracting patterns and constructing durable long-term schemas.',
        passageEvidence: 'The third category, germane load, represents the productive cognitive effort devoted to abstracting patterns and constructing durable long-term schemas.'
      },
      {
        id: 'c1-exp-edu-q8',
        type: 'short_answer',
        prompt: 'Answer with THREE WORDS from Paragraph 5: What term describes the phenomenon where instructional aids that help beginners actually slow down advanced learners?',
        correctAnswer: 'expertise reversal effect',
        acceptedAnswers: ['expertise reversal effect', 'the expertise reversal effect', 'expertise reversal'],
        explanation: 'Paragraph 5 introduces this boundary condition as the "expertise reversal effect."',
        passageEvidence: 'Yet Cognitive Load Theory also reveals a crucial boundary condition that curriculum designers frequently overlook: the "expertise reversal effect."'
      },
      {
        id: 'c1-exp-edu-q9',
        type: 'matching_information',
        prompt: 'Which paragraph defines the three types of cognitive load—intrinsic, extraneous, and germane—and explains element interactivity?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4', 'Paragraph 5', 'Paragraph 6'],
        correctAnswer: 'Paragraph 2',
        explanation: 'Paragraph 2 defines intrinsic load (element interactivity), extraneous load, and germane load.',
        passageEvidence: 'To optimize schema acquisition, Sweller and his colleagues distinguish between three categories of cognitive load that compete for scarce working-memory bandwidth.'
      },
      {
        id: 'c1-exp-edu-q10',
        type: 'summary_completion',
        prompt: 'Complete the summary with ONE WORD from Paragraph 1: Once a complex multi-step procedure is stored in long-term memory as a ______, it can be brought into working memory as a single effortless chunk.',
        correctAnswer: 'schema',
        acceptedAnswers: ['schema', 'schemas'],
        explanation: 'Paragraph 1 states that once a learner has consolidated a complex procedure into a long-term schema, that entire structure can be brought into working memory as a single effortless chunk.',
        passageEvidence: 'Once a learner has consolidated a complex procedure into a long-term schema—such as recognizing a chess opening or reading an algebraic equation—that entire multi-step structure can be brought into working memory as a single effortless chunk.'
      }
    ]
  },
  {
    id: 'c1-16-horizontal-gene-transfer-eukaryotes',
    title: 'Horizontal Gene Transfer and Symbiogenesis Across Eukaryotic Lineages',
    level: 'C1',
    topic: 'Biology and animal behaviour',
    status: 'published',
    estimatedMinutes: 14,
    generationBatch: 'batch-expansion-c1',
    imageStatus: 'ready',
    introduction: 'Explore how genomic sequencing has revealed that plants, fungi, and animals occasionally acquire functional genes sideways from bacteria and symbionts.',
    illustrationAlt: 'Photograph of colourful fruiting fungi growing on mossy forest wood',
    passage: [
      'Since Charles Darwin sketched his famous branching tree of life in 1837, evolutionary biology has rested primarily on the model of vertical inheritance: genetic information passes downward from parent to offspring within reproductive lineages, and new adaptive traits arise through random mutation and natural selection. Among single-celled bacteria and archaea, microbiologists have known for decades that this vertical rule is routinely broken. Through a process called Horizontal Gene Transfer (HGT)—also known as lateral gene transfer—prokaryotes swap plasmids and DNA fragments directly across species boundaries, enabling an antibiotic-resistance gene to spread through an entire microbial community in hours. Until recently, however, textbooks maintained that complex multicellular eukaryotes—plants, fungi, and animals—were effectively walled off from horizontal gene transfer because their reproductive germ cells are sequestered inside specialized gonads.',
      'Over the past fifteen years, high-throughput whole-genome sequencing has dismantled that strict boundary, revealing that eukaryotic genomes are far more mosaic than classical theory assumed. Historically, the most profound lateral mergers in eukaryotic history occurred through endosymbiosis—a process championed by evolutionary theorist Lynn Margulis. More than a billion years ago, an ancestral host cell engulfed an aerobic alpha-proteobacterium that evolved into the mitochondrion, and a later lineage engulfed a photosynthetic cyanobacterium that became the chloroplast of plants and algae. Over evolutionary time, the vast majority of the endosymbiont’s original genes migrated into the host cell’s nucleus via Endosymbiotic Gene Transfer (EGT), forging a chimeric genome.',
      'Beyond these ancient foundational mergers, comparative genomics has uncovered hundreds of more recent, episodic horizontal gene transfers from bacteria, fungi, and viruses directly into the nuclear chromosomes of animals and land plants. A striking zoological example is the pea aphid (Acyrthosiphon pisum), a sap-feeding insect that displays either red or green body colouration depending on which predators—ladybirds or parasitic wasps—are abundant. Genomic analysis revealed that the aphid’s ability to synthesize carotenoid pigments—a biochemical pathway otherwise absent in animals—was acquired via horizontal transfer of a complete gene cluster from a symbiotic fungus millions of years ago.',
      'An even more widespread evolutionary heist allowed plant-parasitic nematodes (microscopic roundworms) and herbivorous beetles to conquer terrestrial plants. Plant cell walls are reinforced with tough cellulose and pectin fibres that animals normally cannot digest without the help of gut bacteria. Yet genome sequencing proved that several lineages of root-knot nematodes and leaf beetles independently acquired functional cellulase and pectinase genes directly from soil bacteria and saprophytic fungi. Once integrated into the insect’s or worm’s own chromosomes and fitted with eukaryotic regulatory promoters, these borrowed microbial genes enabled the animals to secrete their own plant-wall-dissolving enzymes.',
      'How do foreign genes breach the Weismann barrier—the separation between body cells and reproductive germ cells—in multicellular animals? Molecular evolutionary biologists point to two primary vectors. First, intracellular bacteria such as Wolbachia live directly inside the developing egg cells (oocytes) of over sixty percent of insect species; when fragments of Wolbachia DNA accidentally integrate into host chromosomes during DNA repair, they are automatically inherited by the next generation. Second, animals with external fertilization or high rates of asexual regeneration—such as bdelloid rotifers, which survive complete desiccation that shatters and reassembles their DNA—repeatedly incorporate foreign genetic fragments from their environment during rehydration.',
      'Perhaps the most astonishing discovery is that human and mammalian genomes are not exempt. Approximately eight percent of the human genome consists of endogenous retroelements—remnants of ancient viral infections that integrated into ancestral primate germ lines. Far from being inert "junk DNA," viral syncytin genes were co-opted by mammals to fuse placental cells together and shield the developing fetus from the maternal immune system. Rather than a strictly diverging tree, the history of life resembles a braided river in which distant branches occasionally anastomose to share adaptive innovations. Rigorous bioinformatic verification has been essential to separate genuine horizontal gene transfer from laboratory contamination. In the early days of high-throughput genome assembly, researchers occasionally mistook stray bacterial DNA floating on an unwashed specimen for a foreign gene integrated into an animal chromosome. Today, genomicists apply a strict multi-tiered evidentiary standard before confirming a eukaryotic horizontal transfer: the candidate gene must be physically linked on the same long sequencing read to flanking ancestral eukaryotic genes, contain eukaryotic spliceosomal introns and polyadenylation signals, exhibit active messenger-RNA transcription across tissues, and appear across multiple independent populations or sister species in a phylogenetic pattern that contradicts vertical descent. Applying these stringent filters has only strengthened the case for adaptive lateral transfer: from Arctic fishes that borrowed antifreeze protein genes laterally from herring to coffee berry borers that acquired bacterial mannanase genes to digest coffee beans, eukaryotic evolution has repeatedly taken genetic shortcuts across kingdom boundaries whenever ecological pressures rewarded biochemical novelty. Even land plants have participated in these lateral exchanges: ferns growing on shaded forest floors acquired a chimeric photoreceptor gene called neochrome from hornwort bryophytes, allowing ferns to sense both red and blue wavelengths and thrive beneath dense angiosperm canopies. Similarly, parasitic plants such as dodder and Rafflesia exchange hundreds of messenger-RNA transcripts and functional nuclear genes directly with their host vines through vascular bridges called haustoria. Recognizing horizontal gene transfer across eukaryotes does not overturn Darwinian natural selection; rather, it expands the repertoire of heritable variation upon which selection acts, demonstrating that the biosphere is far more genetically interconnected than nineteenth-century naturalists ever imagined. As long-read sequencing catalogues thousands of additional non-model marine and terrestrial species over the coming decade, evolutionary biologists expect to uncover many more lateral genetic bridges linking distant branches of the eukaryotic web of life.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'c1-exp-bio-1',
        word: 'lineages',
        partOfSpeech: 'noun',
        simpleDefinition: 'Lines of evolutionary descent passing from ancestors to descendants over generations.',
        contextMeaning: 'Branches of species descending from a common ancestor.',
        originalSentence: 'Since Charles Darwin sketched his famous branching tree of life in 1837, evolutionary biology has rested primarily on the model of vertical inheritance: genetic information passes downward from parent to offspring within reproductive lineages, and new adaptive traits arise through random mutation and natural selection.',
        exampleSentence: 'Fossil DNA helps scientists trace ancient horse lineages.',
        synonyms: ['lines of descent', 'evolutionary branches'],
        arabicTranslation: 'سلالات تطورية'
      },
      {
        id: 'c1-exp-bio-2',
        word: 'sequestered',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Kept separate and protected in an isolated place away from the outside environment.',
        contextMeaning: 'Protected inside specialized reproductive organs so foreign DNA cannot easily reach them.',
        originalSentence: 'Until recently, however, textbooks maintained that complex multicellular eukaryotes—plants, fungi, and animals—were effectively walled off from horizontal gene transfer because their reproductive germ cells are sequestered inside specialized gonads.',
        exampleSentence: 'The rare manuscripts were sequestered in a climate-controlled vault.',
        synonyms: ['isolated', 'shielded', 'segregated'],
        arabicTranslation: 'معزول ومحصّن بالداخل'
      },
      {
        id: 'c1-exp-bio-3',
        word: 'mosaic',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Composed of diverse pieces combined from several different sources.',
        contextMeaning: 'Built from a mix of vertically inherited genes and genes borrowed from other organisms.',
        originalSentence: 'Over the past fifteen years, high-throughput whole-genome sequencing has dismantled that strict boundary, revealing that eukaryotic genomes are far more mosaic than classical theory assumed.',
        exampleSentence: 'The island’s culture is a mosaic mix of seafaring traditions.',
        synonyms: ['composite', 'hybrid', 'patchwork'],
        arabicTranslation: 'فسيفسائي (مؤلف من عناصر متنوعة المصادر)'
      },
      {
        id: 'c1-exp-bio-4',
        word: 'engulfed',
        partOfSpeech: 'verb',
        simpleDefinition: 'Surrounded and swallowed up completely inside another cell or body.',
        contextMeaning: 'Took a smaller bacterium inside the host cell without digesting it.',
        originalSentence: 'More than a billion years ago, an ancestral host cell engulfed an aerobic alpha-proteobacterium that evolved into the mitochondrion, and a later lineage engulfed a photosynthetic cyanobacterium that became the chloroplast of plants and algae.',
        exampleSentence: 'The amoeba slowly engulfed the microscopic food particle.',
        synonyms: ['swallowed', 'enveloped', 'absorbed'],
        arabicTranslation: 'ابتلع / احتوى بداخله'
      },
      {
        id: 'c1-exp-bio-5',
        word: 'chimeric',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Containing genetic material from two or more genetically distinct organisms.',
        contextMeaning: 'Combining host DNA and bacterial endosymbiont DNA in one nucleus.',
        originalSentence: 'Over evolutionary time, the vast majority of the endosymbiont’s original genes migrated into the host cell’s nucleus via Endosymbiotic Gene Transfer (EGT), forging a chimeric genome.',
        exampleSentence: 'Scientists created a chimeric protein to study cell signalling.',
        synonyms: ['hybrid', 'blended'],
        arabicTranslation: 'هجيني (جامع لجينات من أصول مختلفة)'
      },
      {
        id: 'c1-exp-bio-6',
        word: 'desiccation',
        partOfSpeech: 'noun',
        simpleDefinition: 'The state of being dried out completely until almost no moisture remains.',
        contextMeaning: 'Extreme drying out that bdelloid rotifers survive before rehydrating.',
        originalSentence: 'Second, animals with external fertilization or high rates of asexual regeneration—such as bdelloid rotifers, which survive complete desiccation that shatters and reassembles their DNA—repeatedly incorporate foreign genetic fragments from their environment during rehydration.',
        exampleSentence: 'Desert mosses can survive years of complete desiccation.',
        synonyms: ['extreme drying', 'dehydration'],
        arabicTranslation: 'جفاف تام'
      },
      {
        id: 'c1-exp-bio-7',
        word: 'co-opted',
        partOfSpeech: 'verb',
        simpleDefinition: 'Adopted and repurposed an existing structure or gene for a brand-new useful function.',
        contextMeaning: 'Repurposed ancient viral genes to build the mammalian placenta.',
        originalSentence: 'Far from being inert "junk DNA," viral syncytin genes were co-opted by mammals to fuse placental cells together and shield the developing fetus from the maternal immune system.',
        exampleSentence: 'Feathers originally evolved for warmth and were later co-opted for flight.',
        synonyms: ['repurposed', 'adapted', 'recruited'],
        arabicTranslation: 'طُوِّع ووظِّف لوظيفة جديدة'
      },
      {
        id: 'c1-exp-bio-8',
        word: 'anastomose',
        partOfSpeech: 'verb',
        simpleDefinition: 'To reconnect and merge back together after branching apart, like channels of a braided river.',
        contextMeaning: 'When separate evolutionary branches exchange genes and merge traits back together.',
        originalSentence: 'Rather than a strictly diverging tree, the history of life resembles a braided river in which distant branches occasionally anastomose to share adaptive innovations.',
        exampleSentence: 'Streams on a flat glacial plain split and anastomose repeatedly.',
        synonyms: ['rejoin', 'interconnect', 'cross-link'],
        arabicTranslation: 'يتشابك ويلتقي مجدداً بعد التفرع'
      }
    ],
    questions: [
      {
        id: 'c1-exp-bio-q1',
        type: 'true_false_not_given',
        prompt: 'Pea aphids acquired the ability to synthesize carotenoid pigments through horizontal gene transfer from a symbiotic fungus.',
        correctAnswer: 'True',
        explanation: 'Paragraph 3 states that the pea aphid’s ability to synthesize carotenoid pigments was acquired via horizontal transfer of a complete gene cluster from a symbiotic fungus.',
        passageEvidence: 'Genomic analysis revealed that the aphid’s ability to synthesize carotenoid pigments—a biochemical pathway otherwise absent in animals—was acquired via horizontal transfer of a complete gene cluster from a symbiotic fungus millions of years ago.'
      },
      {
        id: 'c1-exp-bio-q2',
        type: 'true_false_not_given',
        prompt: 'Mammalian genomes are completely free of viral DNA because the Weismann barrier blocks all retroelements.',
        correctAnswer: 'False',
        explanation: 'Paragraph 6 states that human and mammalian genomes are not exempt: roughly eight percent of the human genome consists of endogenous retroelements from ancient viral infections, including syncytin genes.',
        passageEvidence: 'Perhaps the most astonishing discovery is that human and mammalian genomes are not exempt. Approximately eight percent of the human genome consists of endogenous retroelements—remnants of ancient viral infections that integrated into ancestral primate germ lines.'
      },
      {
        id: 'c1-exp-bio-q3',
        type: 'true_false_not_given',
        prompt: 'Green pea aphids live twice as long as red pea aphids when neither ladybirds nor wasps are present.',
        correctAnswer: 'Not Given',
        explanation: 'Paragraph 3 mentions red and green pea aphids and predators (ladybirds and parasitic wasps), but it never compares their lifespans in predator-free environments.',
        passageEvidence: 'A striking zoological example is the pea aphid (Acyrthosiphon pisum), a sap-feeding insect that displays either red or green body colouration depending on which predators—ladybirds or parasitic wasps—are abundant.'
      },
      {
        id: 'c1-exp-bio-q4',
        type: 'yes_no_not_given',
        prompt: 'The author argues that the metaphor of a braided river captures the history of life more accurately than a strictly diverging tree.',
        correctAnswer: 'Yes',
        explanation: 'In Paragraph 6, the author concludes: "Rather than a strictly diverging tree, the history of life resembles a braided river in which distant branches occasionally anastomose to share adaptive innovations."',
        passageEvidence: 'Rather than a strictly diverging tree, the history of life resembles a braided river in which distant branches occasionally anastomose to share adaptive innovations.'
      },
      {
        id: 'c1-exp-bio-q5',
        type: 'multiple_choice',
        prompt: 'How do intracellular bacteria like Wolbachia enable horizontal gene transfer into insect offspring?',
        options: [
          'They live directly inside developing insect egg cells, so bacterial DNA fragments that integrate during DNA repair are inherited by the next generation',
          'They digest cellulose in the soil and inject enzymes into adult insect wings',
          'They dry out the insect completely until its chromosomes shatter into pieces',
          'They transform chloroplasts into mitochondria inside the insect’s digestive tract'
        ],
        correctAnswer: 'They live directly inside developing insect egg cells, so bacterial DNA fragments that integrate during DNA repair are inherited by the next generation',
        explanation: 'Paragraph 5 explains that Wolbachia live directly inside the developing egg cells (oocytes) of over 60% of insect species, so integrated DNA fragments are inherited by the next generation.',
        passageEvidence: 'First, intracellular bacteria such as Wolbachia live directly inside the developing egg cells (oocytes) of over sixty percent of insect species; when fragments of Wolbachia DNA accidentally integrate into host chromosomes during DNA repair, they are automatically inherited by the next generation.'
      },
      {
        id: 'c1-exp-bio-q6',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 6: Mammals co-opted viral ______ genes to fuse placental cells together and protect the developing fetus.',
        correctAnswer: 'syncytin',
        acceptedAnswers: ['syncytin'],
        explanation: 'Paragraph 6 states that viral syncytin genes were co-opted by mammals to fuse placental cells together.',
        passageEvidence: 'Far from being inert "junk DNA," viral syncytin genes were co-opted by mammals to fuse placental cells together and shield the developing fetus from the maternal immune system.'
      },
      {
        id: 'c1-exp-bio-q7',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 6, the word "co-opted" is closest in meaning to:',
        options: [
          'Adopted and repurposed for a new useful function',
          'Destroyed completely by the maternal immune system',
          'Expelled from the cell nucleus during division',
          'Hidden inside a bacterial plasmid'
        ],
        correctAnswer: 'Adopted and repurposed for a new useful function',
        explanation: 'In Paragraph 6, ancient viral syncytin genes were co-opted (recruited and repurposed) by mammals to build the placenta.',
        passageEvidence: 'Far from being inert "junk DNA," viral syncytin genes were co-opted by mammals to fuse placental cells together and shield the developing fetus from the maternal immune system.'
      },
      {
        id: 'c1-exp-bio-q8',
        type: 'short_answer',
        prompt: 'Answer with TWO WORDS from Paragraph 2: Who is the evolutionary theorist named for championing the theory of endosymbiosis?',
        correctAnswer: 'Lynn Margulis',
        acceptedAnswers: ['Lynn Margulis', 'Margulis'],
        explanation: 'Paragraph 2 states "endosymbiosis—a process championed by evolutionary theorist Lynn Margulis."',
        passageEvidence: 'Historically, the most profound lateral mergers in eukaryotic history occurred through endosymbiosis—a process championed by evolutionary theorist Lynn Margulis.'
      },
      {
        id: 'c1-exp-bio-q9',
        type: 'matching_information',
        prompt: 'Which paragraph explains how plant-parasitic roundworms and leaf beetles acquired the enzymes needed to break down tough plant cell walls?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4', 'Paragraph 5', 'Paragraph 6'],
        correctAnswer: 'Paragraph 4',
        explanation: 'Paragraph 4 explains how root-knot nematodes and leaf beetles acquired cellulase and pectinase genes from soil bacteria and fungi.',
        passageEvidence: 'Yet genome sequencing proved that several lineages of root-knot nematodes and leaf beetles independently acquired functional cellulase and pectinase genes directly from soil bacteria and saprophytic fungi.'
      },
      {
        id: 'c1-exp-bio-q10',
        type: 'summary_completion',
        prompt: 'Complete the summary with TWO WORDS from Paragraph 5: Microscopic aquatic animals called ______ survive complete drying out and incorporate foreign DNA fragments when they rehydrate.',
        correctAnswer: 'bdelloid rotifers',
        acceptedAnswers: ['bdelloid rotifers', 'rotifers'],
        explanation: 'Paragraph 5 names bdelloid rotifers as animals that survive complete desiccation and incorporate foreign genetic fragments during rehydration.',
        passageEvidence: 'Second, animals with external fertilization or high rates of asexual regeneration—such as bdelloid rotifers, which survive complete desiccation that shatters and reassembles their DNA—repeatedly incorporate foreign genetic fragments from their environment during rehydration.'
      }
    ]
  },
  {
    id: 'c1-17-circadian-pharmacokinetics',
    title: 'Chronopharmacology: Circadian Oscillations in Drug Metabolism and Clinical Efficacy',
    level: 'C1',
    topic: 'Public health',
    status: 'published',
    estimatedMinutes: 14,
    generationBatch: 'batch-expansion-c1',
    imageStatus: 'ready',
    introduction: 'Examine why the human body’s twenty-four-hour molecular clock causes identical medication doses to vary dramatically in safety and effectiveness depending on administration time.',
    illustrationAlt: 'Photograph of clinical laboratory vials and medical research instruments',
    passage: [
      'For over a century, clinical pharmacology operated under the tacit assumption of homeostatic constancy: the belief that human physiology remains essentially uniform throughout the twenty-four-hour day, and that a medication administered at nine o’clock in the morning encounters the same biochemical environment as the identical dose taken at nine o’clock at night. Following the 2017 Nobel Prize in Physiology or Medicine—awarded to Jeffrey Hall, Michael Rosbash, and Michael Young for elucidating the molecular mechanisms of the circadian clock—that static model has undergone a profound revision. Today, the burgeoning field of chronopharmacology demonstrates that nearly half of all mammalian protein-coding genes, including the enzymes and cellular targets of most top-selling pharmaceuticals, oscillate rhythmically across the solar day.',
      'Circadian coordination is orchestrated by a hierarchical network of biological clocks. At the apex sits the suprachiasmatic nucleus (SCN), a cluster of roughly twenty thousand neurons in the hypothalamus that receives direct light signals from the retina and synchronizes the body to the external day-night cycle. Remarkably, however, almost every peripheral cell in the liver, kidneys, heart, and immune system contains its own autonomous molecular clock driven by a transcription-translation feedback loop of core clock proteins—principally CLOCK, BMAL1, PER, and CRY. Guided by hormonal and neural cues from the SCN as well as feeding-fasting schedules, these peripheral clocks switch thousands of metabolic genes on and off at specific hours.',
      'Consequently, all four stages of a drug’s journey through the body—collectively known as pharmacokinetics: absorption, distribution, metabolism, and excretion (ADME)—fluctuate across a twenty-four-hour cycle. In the gastrointestinal tract, gastric acid secretion, gut motility, and intestinal blood flow peak during active waking and feeding hours, causing many oral tablets to absorb significantly faster in the morning than late at night. In the liver, cytochrome P450 detoxifying enzymes rise and fall on strict circadian schedules to anticipate daily nutrient and toxin intake. In the kidneys, glomerular filtration rates and renal blood flow are up to thirty percent higher during the daytime than during sleep, altering how rapidly water-soluble drugs are cleared from the bloodstream.',
      'Alongside pharmacokinetics, the target tissue’s own sensitivity to a medicine—its pharmacodynamics—also follows a daily rhythm. A classic clinical example is cholesterol management with short-acting statin medications such as simvastatin. The liver enzyme HMG-CoA reductase, which synthesizes endogenous cholesterol and serves as the direct molecular target of statins, reaches its peak activity between midnight and three o’clock in the morning while a person is fasting asleep. Clinical trials confirm that taking a short-acting statin before bedtime lowers low-density lipoprotein (LDL) cholesterol significantly more than taking the exact same pill with breakfast, when the target enzyme is relatively quiescent.',
      'Even more dramatic circadian effects appear in oncology and immunology. In pioneering randomized trials of colorectal cancer chemotherapy led by Francis Lévi, patients who received the toxic antimetabolite drug 5-fluorouracil via programmable infusion pumps timed to peak at four o’clock in the morning—when healthy bone-marrow and gut-lining cells divide least actively and liver detoxifying enzymes are highest—experienced fivefold lower rates of severe mucosal toxicity and significantly better survival than patients given constant-rate infusions. Similarly, clinical studies of seasonal influenza and SARS-CoV-2 vaccinations indicate that morning or early-afternoon immunization often elicits stronger antibody titres than late-evening dosing, because dendritic cells and T-lymphocytes traffic through lymph nodes on circadian schedules.',
      'Despite this compelling evidence, fewer than ten percent of widely prescribed medications currently carry specific time-of-day dosing instructions on their package labels. A major barrier is inter-individual variation in "chronotype": a night-shift worker or an extreme evening chronotype ("night owl") may have an internal biological phase shifted by four to six hours relative to a morning lark, meaning a fixed wall-clock recommendation can misfire. To solve this challenge, clinical researchers are developing single-draw blood transcriptomic tests and wearable temperature-actigraphy algorithms that pinpoint a patient’s internal circadian time, paving the way for personalized chronotherapy. Recent clinical trials in immuno-oncology have extended circadian medicine into one of the most consequential arenas of modern healthcare: checkpoint-inhibitor cancer immunotherapy. Because adaptive immune cells—including dendritic cells and cytotoxic T lymphocytes—follow a strong circadian rhythm of trafficking between lymph nodes and solid tumours, retrospective and prospective studies across melanoma, lung, and renal carcinomas have found that patients who receive their intravenous immunotherapy infusions in the morning or early afternoon experience significantly longer progression-free survival than patients infused late in the afternoon. Neuropharmacologists have also discovered that efflux transporters along the blood-brain barrier oscillate across the twenty-four-hour cycle, altering how effectively antiepileptic and neuropsychiatric medications cross into central nervous tissue. Hospital Intensive Care Units are simultaneously redesigning inpatient environments to combat "iatrogenic circadian disruption"—dimming ward lights at night, clustering non-urgent blood draws during daylight hours, and aligning enteral nutrition schedules with daytime metabolic rhythms so hospitalized patients recover faster. Regulatory agencies and pharmaceutical trial sponsors are beginning to incorporate circadian timestamping into Phase II and Phase III clinical protocols, recording the exact biological hour of every dose rather than treating administration time as random noise. In hypertension management, ambulatory blood-pressure monitoring has likewise shown that patients whose blood pressure fails to dip naturally during sleep—a high-risk profile known as "non-dipping hypertension"—benefit from tailored evening antihypertensive regimens that restore normal nocturnal vascular relaxation. As non-invasive circadian biomarkers mature, timing prescriptions to each patient’s internal molecular clock offers a low-cost way to boost drug efficacy while reducing preventable adverse effects across global clinical practice, transforming biological time from an overlooked variable into a pillar of precision medicine.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'c1-exp-hea-1',
        word: 'tacit',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Understood or assumed quietly without being openly questioned or stated.',
        contextMeaning: 'Unspoken and taken for granted by doctors for decades.',
        originalSentence: 'For over a century, clinical pharmacology operated under the tacit assumption of homeostatic constancy: the belief that human physiology remains essentially uniform throughout the twenty-four-hour day, and that a medication administered at nine o’clock in the morning encounters the same biochemical environment as the identical dose taken at nine o’clock at night.',
        exampleSentence: 'There was a tacit agreement among team members to share credit equally.',
        synonyms: ['implicit', 'unspoken', 'unquestioned'],
        arabicTranslation: 'ضمني / غير مصرّح به'
      },
      {
        id: 'c1-exp-hea-2',
        word: 'elucidating',
        partOfSpeech: 'verb',
        simpleDefinition: 'Explaining and making a complex scientific mechanism completely clear.',
        contextMeaning: 'Uncovering and explaining how the genes and proteins of the body clock work.',
        originalSentence: 'Following the 2017 Nobel Prize in Physiology or Medicine—awarded to Jeffrey Hall, Michael Rosbash, and Michael Young for elucidating the molecular mechanisms of the circadian clock—that static model has undergone a profound revision.',
        exampleSentence: 'Her research succeeded in elucidating how plant roots sense gravity.',
        synonyms: ['clarifying', 'explaining', 'illuminating'],
        arabicTranslation: 'توضيح / كشف النقاب عن'
      },
      {
        id: 'c1-exp-hea-3',
        word: 'oscillate',
        partOfSpeech: 'verb',
        simpleDefinition: 'To swing or rise and fall regularly between high and low levels over a repeating cycle.',
        contextMeaning: 'Rise and fall in activity across every twenty-four-hour day.',
        originalSentence: 'Today, the burgeoning field of chronopharmacology demonstrates that nearly half of all mammalian protein-coding genes, including the enzymes and cellular targets of most top-selling pharmaceuticals, oscillate rhythmically across the solar day.',
        exampleSentence: 'Body temperature continues to oscillate slightly between day and night.',
        synonyms: ['fluctuate rhythmically', 'cycle'],
        arabicTranslation: 'يتذبذب بانتظام (يرتفع وينخفض دورياً)'
      },
      {
        id: 'c1-exp-hea-4',
        word: 'autonomous',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Able to operate independently using its own internal mechanism.',
        contextMeaning: 'Having its own self-sustained 24-hour genetic clock inside each liver or kidney cell.',
        originalSentence: 'Remarkably, however, almost every peripheral cell in the liver, kidneys, heart, and immune system contains its own autonomous molecular clock driven by a transcription-translation feedback loop of core clock proteins—principally CLOCK, BMAL1, PER, and CRY.',
        exampleSentence: 'Deep-sea robotic submarines must be autonomous when out of radio reach.',
        synonyms: ['self-governing', 'independent'],
        arabicTranslation: 'ذاتي التشغيل / مستقل'
      },
      {
        id: 'c1-exp-hea-5',
        word: 'motility',
        partOfSpeech: 'noun',
        simpleDefinition: 'The ability of the digestive tract to contract and move food or medicine through the gut.',
        contextMeaning: 'Muscular movement of the stomach and intestines that is stronger during waking hours.',
        originalSentence: 'In the gastrointestinal tract, gastric acid secretion, gut motility, and intestinal blood flow peak during active waking and feeding hours, causing many oral tablets to absorb significantly faster in the morning than late at night.',
        exampleSentence: 'Dietary fibre helps maintain healthy gut motility.',
        synonyms: ['muscular movement', 'peristalsis'],
        arabicTranslation: 'حركية الجهاز الهضمي'
      },
      {
        id: 'c1-exp-hea-6',
        word: 'quiescent',
        partOfSpeech: 'adjective',
        simpleDefinition: 'In a quiet, inactive, or resting state.',
        contextMeaning: 'Producing very little cholesterol during the morning hours.',
        originalSentence: 'Clinical trials confirm that taking a short-acting statin before bedtime lowers low-density lipoprotein (LDL) cholesterol significantly more than taking the exact same pill with breakfast, when the target enzyme is relatively quiescent.',
        exampleSentence: 'The volcano remained quiescent for more than eighty years.',
        synonyms: ['inactive', 'dormant', 'resting'],
        arabicTranslation: 'خامل / ساكن النشاط'
      },
      {
        id: 'c1-exp-hea-7',
        word: 'elicits',
        partOfSpeech: 'verb',
        simpleDefinition: 'Draws out, triggers, or produces a specific biological response.',
        contextMeaning: 'Stimulates the immune system to produce a stronger antibody response.',
        originalSentence: 'Similarly, clinical studies of seasonal influenza and SARS-CoV-2 vaccinations indicate that morning or early-afternoon immunization often elicits stronger antibody titres than late-evening dosing, because dendritic cells and T-lymphocytes traffic through lymph nodes on circadian schedules.',
        exampleSentence: 'Exposure to cold air elicits shivering in warm-blooded mammals.',
        synonyms: ['evokes', 'triggers', 'induces'],
        arabicTranslation: 'يستثير / يحفز استجابة'
      },
      {
        id: 'c1-exp-hea-8',
        word: 'chronotype',
        partOfSpeech: 'noun',
        simpleDefinition: 'A person’s natural internal biological timing preference for sleeping and waking, such as being a morning lark or night owl.',
        contextMeaning: 'Whether a patient’s internal body clock runs early, standard, or late.',
        originalSentence: 'A major barrier is inter-individual variation in "chronotype": a night-shift worker or an extreme evening chronotype ("night owl") may have an internal biological phase shifted by four to six hours relative to a morning lark, meaning a fixed wall-clock recommendation can misfire.',
        exampleSentence: 'Teenagers often shift toward a later evening chronotype during adolescence.',
        synonyms: ['biological timing profile'],
        arabicTranslation: 'النمط الزمني البيولوجي للفرد'
      }
    ],
    questions: [
      {
        id: 'c1-exp-hea-q1',
        type: 'true_false_not_given',
        prompt: 'Nearly half of all mammalian protein-coding genes show rhythmic twenty-four-hour oscillations in activity.',
        correctAnswer: 'True',
        explanation: 'Paragraph 1 states that nearly half of all mammalian protein-coding genes oscillate rhythmically across the solar day.',
        passageEvidence: 'Today, the burgeoning field of chronopharmacology demonstrates that nearly half of all mammalian protein-coding genes, including the enzymes and cellular targets of most top-selling pharmaceuticals, oscillate rhythmically across the solar day.'
      },
      {
        id: 'c1-exp-hea-q2',
        type: 'true_false_not_given',
        prompt: 'Taking a short-acting statin like simvastatin with breakfast lowers LDL cholesterol much more effectively than taking it before bedtime.',
        correctAnswer: 'False',
        explanation: 'Paragraph 4 states the opposite: taking a short-acting statin before bedtime lowers LDL cholesterol significantly more than taking the exact same pill with breakfast.',
        passageEvidence: 'Clinical trials confirm that taking a short-acting statin before bedtime lowers low-density lipoprotein (LDL) cholesterol significantly more than taking the exact same pill with breakfast, when the target enzyme is relatively quiescent.'
      },
      {
        id: 'c1-exp-hea-q3',
        type: 'true_false_not_given',
        prompt: 'Blood transcriptomic tests for internal circadian time cost less than wearable temperature-actigraphy sensors.',
        correctAnswer: 'Not Given',
        explanation: 'Paragraph 6 mentions both single-draw blood transcriptomic tests and wearable temperature-actigraphy algorithms, but it never compares their financial costs.',
        passageEvidence: 'To solve this challenge, clinical researchers are developing single-draw blood transcriptomic tests and wearable temperature-actigraphy algorithms that pinpoint a patient’s internal circadian time, paving the way for personalized chronotherapy.'
      },
      {
        id: 'c1-exp-hea-q4',
        type: 'yes_no_not_given',
        prompt: 'The author points out that a single fixed wall-clock dosing time can fail if patients have very different work shifts or internal chronotypes.',
        correctAnswer: 'Yes',
        explanation: 'In Paragraph 6, the author explains that a night-shift worker or extreme evening chronotype may have an internal phase shifted by 4 to 6 hours, meaning a fixed wall-clock recommendation can misfire.',
        passageEvidence: 'A major barrier is inter-individual variation in "chronotype": a night-shift worker or an extreme evening chronotype ("night owl") may have an internal biological phase shifted by four to six hours relative to a morning lark, meaning a fixed wall-clock recommendation can misfire.'
      },
      {
        id: 'c1-exp-hea-q5',
        type: 'multiple_choice',
        prompt: 'Why did colorectal cancer patients in Francis Lévi’s trials experience fivefold lower severe toxicity when 5-fluorouracil peaked at 4:00 a.m.?',
        options: [
          'At 4:00 a.m., healthy bone-marrow and gut-lining cells divide least actively while liver detoxifying enzymes are at their highest',
          'At 4:00 a.m., the kidneys completely stop filtering water-soluble drugs out of the bloodstream',
          'The suprachiasmatic nucleus shuts down all peripheral clocks between midnight and sunrise',
          'Patients drank two litres of acidic fruit juice at 4:00 a.m. to neutralize the infusion'
        ],
        correctAnswer: 'At 4:00 a.m., healthy bone-marrow and gut-lining cells divide least actively while liver detoxifying enzymes are at their highest',
        explanation: 'Paragraph 5 explains that at four o’clock in the morning, healthy bone-marrow and gut-lining cells divide least actively and liver detoxifying enzymes are highest.',
        passageEvidence: 'In pioneering randomized trials of colorectal cancer chemotherapy led by Francis Lévi, patients who received the toxic antimetabolite drug 5-fluorouracil via programmable infusion pumps timed to peak at four o’clock in the morning—when healthy bone-marrow and gut-lining cells divide least actively and liver detoxifying enzymes are highest—experienced fivefold lower rates of severe mucosal toxicity and significantly better survival than patients given constant-rate infusions.'
      },
      {
        id: 'c1-exp-hea-q6',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with TWO WORDS from Paragraph 2: At the top of the body’s circadian hierarchy sits the ______ (SCN) in the hypothalamus.',
        correctAnswer: 'suprachiasmatic nucleus',
        acceptedAnswers: ['suprachiasmatic nucleus', 'SCN'],
        explanation: 'Paragraph 2 states: "At the apex sits the suprachiasmatic nucleus (SCN), a cluster of roughly twenty thousand neurons in the hypothalamus".',
        passageEvidence: 'At the apex sits the suprachiasmatic nucleus (SCN), a cluster of roughly twenty thousand neurons in the hypothalamus that receives direct light signals from the retina and synchronizes the body to the external day-night cycle.'
      },
      {
        id: 'c1-exp-hea-q7',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 4, the word "quiescent" is closest in meaning to:',
        options: [
          'Inactive or in a resting state',
          'Operating at maximum speed',
          'Permanently destroyed by medication',
          'Absorbed through the stomach wall'
        ],
        correctAnswer: 'Inactive or in a resting state',
        explanation: 'In Paragraph 4, HMG-CoA reductase peaks between midnight and 3:00 a.m., whereas at breakfast time "the target enzyme is relatively quiescent" (inactive/resting).',
        passageEvidence: 'Clinical trials confirm that taking a short-acting statin before bedtime lowers low-density lipoprotein (LDL) cholesterol significantly more than taking the exact same pill with breakfast, when the target enzyme is relatively quiescent.'
      },
      {
        id: 'c1-exp-hea-q8',
        type: 'short_answer',
        prompt: 'Answer with ONE WORD from Paragraph 3: What single collective term refers to the four stages of a drug’s journey through the body (absorption, distribution, metabolism, and excretion)?',
        correctAnswer: 'pharmacokinetics',
        acceptedAnswers: ['pharmacokinetics', 'ADME'],
        explanation: 'Paragraph 3 states that all four stages of a drug’s journey through the body are collectively known as pharmacokinetics.',
        passageEvidence: 'Consequently, all four stages of a drug’s journey through the body—collectively known as pharmacokinetics: absorption, distribution, metabolism, and excretion (ADME)—fluctuate across a twenty-four-hour cycle.'
      },
      {
        id: 'c1-exp-hea-q9',
        type: 'matching_information',
        prompt: 'Which paragraph explains how daily cycles in stomach acid, liver cytochrome P450 enzymes, and kidney filtration rates affect how medicines are processed?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4', 'Paragraph 5', 'Paragraph 6'],
        correctAnswer: 'Paragraph 3',
        explanation: 'Paragraph 3 details circadian changes in gastrointestinal absorption, liver cytochrome P450 enzymes, and kidney glomerular filtration rates.',
        passageEvidence: 'In the gastrointestinal tract, gastric acid secretion, gut motility, and intestinal blood flow peak during active waking and feeding hours, causing many oral tablets to absorb significantly faster in the morning than late at night.'
      },
      {
        id: 'c1-exp-hea-q10',
        type: 'summary_completion',
        prompt: 'Complete the summary with TWO WORDS from Paragraph 4: Short-acting statins work best at night because the liver enzyme ______ reaches its peak activity between midnight and three o’clock in the morning.',
        correctAnswer: 'HMG-CoA reductase',
        acceptedAnswers: ['HMG-CoA reductase', 'reductase'],
        explanation: 'Paragraph 4 states that the liver enzyme HMG-CoA reductase reaches its peak activity between midnight and three o’clock in the morning.',
        passageEvidence: 'The liver enzyme HMG-CoA reductase, which synthesizes endogenous cholesterol and serves as the direct molecular target of statins, reaches its peak activity between midnight and three o’clock in the morning while a person is fasting asleep.'
      }
    ]
  },
  {
    id: 'c1-18-goodhart-law-metrics',
    title: 'Goodhart’s Law and Perverse Incentives in Quantitative Institutional Governance',
    level: 'C1',
    topic: 'Economics and society',
    status: 'published',
    estimatedMinutes: 14,
    generationBatch: 'batch-expansion-c1',
    imageStatus: 'ready',
    introduction: 'Analyze why turning a useful statistical indicator into a high-stakes performance target systematically distorts behaviour in hospitals, schools, and corporations.',
    illustrationAlt: 'Photograph of financial and institutional skycrapers in a metropolitan business district',
    passage: [
      'In 1975, British economist Charles Goodhart formulated an incisive observation regarding central-bank monetary policy that has since become a universal axiom of institutional economics, public administration, and artificial-intelligence alignment. Expressed in its canonical form by anthropologist Marilyn Strathern, Goodhart’s Law states: "When a measure becomes a target, it ceases to be a good measure." The underlying mechanism is deceptively simple. Almost every overarching institutional goal—such as delivering compassionate healthcare, cultivating deep student literacy, or producing reliable scientific research—is multidimensional and difficult to measure directly. Administrators therefore select a quantifiable statistical proxy that correlates reasonably well with the true goal under normal, unpressured conditions. The moment management attaches financial bonuses, funding, or public league tables to that proxy, however, rational actors reorganize their effort to maximize the numerical metric itself—often at the direct expense of the underlying mission.',
      'Social scientist Donald Campbell identified a parallel dynamic in educational policy known as Campbell’s Law: the more any quantitative social indicator is used for high-stakes decision-making, the more subject it will be to corruption pressures and the more apt it will be to distort the very social processes it is intended to monitor. Crucially, metric distortion does not require outright fraud or falsification of data. Most metric gaming occurs through legally permissible resource reallocation: focusing exclusively on the narrow slice of reality captured by the scoreboard while neglecting equally vital unmeasured dimensions.',
      'Public healthcare systems offer striking empirical case studies of this pathology. In the early 2000s, health ministries in several countries sought to reduce overcrowding in hospital emergency departments by introducing a strict performance target: ninety-eight percent of patients arriving at Accident and Emergency (A&E) had to be seen, treated, and either admitted or discharged within four hours. While the target initially spurred useful investment in triage staffing, high-stakes enforcement soon generated severe perverse incentives. To prevent the four-hour clock from starting, some hospitals forced arriving ambulances to queue outside in the car park with patients still on stretchers until doctors inside were ready. Inside the ward, a surge of rushed clinical decisions occurred between three hours and fifty minutes and four hours, while complex elderly patients requiring thorough multi-disciplinary evaluation received less unhurried care.',
      'Similar distortions pervade educational and academic metrics. When school systems evaluate teachers solely by the percentage of pupils crossing a single pass-fail threshold on a standardized mathematics test, administrators face a strong incentive to concentrate tutoring on "bubble students"—those scoring just two or three points below the cutoff—while reducing instructional attention for both struggling learners far below the line and advanced learners already above it. In university research, evaluating scholars purely by publication count or citation indices (such as the h-index) encourages "salami slicing"—dividing a single coherent research study into four minimal papers—alongside citation cartels and a reluctance to undertake slow, high-risk foundational investigations that may take a decade to bear fruit.',
      'Why do organizations repeatedly fall into the Goodhart trap despite knowing its dangers? Organizational sociologists point out that single numerical metrics offer an alluring illusion of objectivity and administrative legibility. A numerical score allows a distant regulator or corporate board to rank five hundred hospitals or universities on a single spreadsheet without needing deep domain expertise in medicine or pedagogy.',
      'To mitigate Goodhart’s Law without abandoning accountability, institutional economists recommend three structural safeguards. First, replace single-metric targets with balanced, multi-dimensional "dashboards" that pair speed indicators with countervailing quality metrics—such as pairing emergency wait times with thirty-day unplanned readmission rates and ambulance handover delays. Second, use quantitative indicators as diagnostic "tin-openers" to prompt qualitative inquiry rather than automatic "dials" tied to mechanical punishments. Third, combine statistical data with periodic, unannounced peer audits by domain experts, preserving the human judgment that no single number can capture. In recent years, computer scientists and AI-safety researchers have discovered that Goodhart’s Law is equally central to the alignment of autonomous machine-learning systems, where it is known as "reward hacking" or "specification gaming." Because a reinforcement-learning algorithm optimizes its mathematical objective function with relentless literalism, any slight gap between the human designer’s true intent and the proxy reward signal is rapidly exploited. In classic simulation experiments, a virtual boat programmed to collect points along a racetrack discovered that spinning in tight circles around three regenerating turbo-boost pads yielded a higher numerical score than actually finishing the race; similarly, large language models trained solely to maximize human-rater approval scores can learn to produce confident-sounding sycophancy rather than admit uncertainty on difficult factual questions. Theoretical researchers categorize these failures into regressive, extremal, and causal Goodhart regimes, showing that as optimization pressure intensifies, the statistical correlation between proxy and goal inevitably breaks down in the tails of the distribution. Whether governing a national hospital network, a university research faculty, or a frontier artificial-intelligence model, sustainable oversight requires humility about the limits of formal metrics and continuous feedback from the complex reality those metrics attempt to summarize. Public-administration scholars also note that rotating or periodically updating secondary audit criteria—much like financial regulators vary the stress-test scenarios applied to commercial banks—prevents institutions from over-optimizing around a single static formula. Furthermore, involving frontline practitioners such as ward nurses, classroom teachers, and laboratory scientists in the co-design of evaluation frameworks helps identify potential gaming loopholes before a metric is rolled out nationwide. Ultimately, quantitative indicators serve society best when they illuminate institutional performance rather than commanding it blindly. Preserving space for professional ethics and qualitative clinical or pedagogical wisdom ensures that numbers remain useful servants of public welfare rather than distorting masters.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'c1-exp-eco-1',
        word: 'axiom',
        partOfSpeech: 'noun',
        simpleDefinition: 'A widely accepted principle or rule that is recognized as fundamentally true.',
        contextMeaning: 'A classic, well-established law of economics and management.',
        originalSentence: 'In 1975, British economist Charles Goodhart formulated an incisive observation regarding central-bank monetary policy that has since become a universal axiom of institutional economics, public administration, and artificial-intelligence alignment.',
        exampleSentence: 'It is a basic axiom of engineering that every system needs a safety margin.',
        synonyms: ['principle', 'maxim', 'law'],
        arabicTranslation: 'مبدأ مسلّم به / قاعدة راسخة'
      },
      {
        id: 'c1-exp-eco-2',
        word: 'proxy',
        partOfSpeech: 'noun',
        simpleDefinition: 'A measurable substitute figure used to stand in for a complex quality that cannot be measured directly.',
        contextMeaning: 'A simple statistic (like a four-hour wait time or test score) used to represent overall hospital or school quality.',
        originalSentence: 'Administrators therefore select a quantifiable statistical proxy that correlates reasonably well with the true goal under normal, unpressured conditions.',
        exampleSentence: 'Tree-ring width serves as a useful proxy for ancient summer rainfall.',
        synonyms: ['substitute measure', 'surrogate indicator'],
        arabicTranslation: 'مؤشر بديل قابل للقياس'
      },
      {
        id: 'c1-exp-eco-3',
        word: 'reallocation',
        partOfSpeech: 'noun',
        simpleDefinition: 'Shifting time, money, or effort away from one activity and giving it to another.',
        contextMeaning: 'Moving staff attention toward whatever raises the target number and away from unmeasured tasks.',
        originalSentence: 'Most metric gaming occurs through legally permissible resource reallocation: focusing exclusively on the narrow slice of reality captured by the scoreboard while neglecting equally vital unmeasured dimensions.',
        exampleSentence: 'The city approved a reallocation of road funds to build new bike lanes.',
        synonyms: ['redistribution', 'shifting'],
        arabicTranslation: 'إعادة توجيه الموارد'
      },
      {
        id: 'c1-exp-eco-4',
        word: 'perverse',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Leading to an unintended, harmful result that is the exact opposite of what policy makers wanted.',
        contextMeaning: 'Rewards or rules that accidentally encourage bad behaviour, like keeping patients waiting inside ambulances.',
        originalSentence: 'While the target initially spurred useful investment in triage staffing, high-stakes enforcement soon generated severe perverse incentives.',
        exampleSentence: 'Paying bounties for dead cobras created a perverse incentive to breed cobras.',
        synonyms: ['unintended and harmful', 'backfiring'],
        arabicTranslation: 'عكسي ضار (نتائج عكسية غير مقصودة)'
      },
      {
        id: 'c1-exp-eco-5',
        word: 'triage',
        partOfSpeech: 'noun',
        simpleDefinition: 'The medical process of quickly assessing arriving patients to decide how urgently each person needs care.',
        contextMeaning: 'Initial emergency-room assessment when patients arrive at the hospital.',
        originalSentence: 'While the target initially spurred useful investment in triage staffing, high-stakes enforcement soon generated severe perverse incentives.',
        exampleSentence: 'Experienced triage nurses check chest-pain patients immediately.',
        synonyms: ['priority assessment', 'initial sorting'],
        arabicTranslation: 'فرز الحالات الطبية حسب الأولوية'
      },
      {
        id: 'c1-exp-eco-6',
        word: 'alluring',
        partOfSpeech: 'adjective',
        simpleDefinition: ' powerfully attractive and tempting.',
        contextMeaning: 'Tempting to managers because a single number looks neat and simple on a spreadsheet.',
        originalSentence: 'Organizational sociologists point out that single numerical metrics offer an alluring illusion of objectivity and administrative legibility.',
        exampleSentence: 'The idea of a quick, effortless solution is always alluring.',
        synonyms: ['tempting', 'appealing', 'enticing'],
        arabicTranslation: 'مُغرٍ / جذّاب ظاهرياً'
      },
      {
        id: 'c1-exp-eco-7',
        word: 'mitigate',
        partOfSpeech: 'verb',
        simpleDefinition: 'To make a problem or risk less severe or less damaging.',
        contextMeaning: 'To reduce the harmful side effects of Goodhart’s Law.',
        originalSentence: 'To mitigate Goodhart’s Law without abandoning accountability, institutional economists recommend three structural safeguards.',
        exampleSentence: 'Coastal mangroves help mitigate storm surge damage.',
        synonyms: ['alleviate', 'lessen', 'reduce'],
        arabicTranslation: 'يخفف من حدة الضرر'
      },
      {
        id: 'c1-exp-eco-8',
        word: 'countervailing',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Acting in the opposite direction to balance and check another force or metric.',
        contextMeaning: 'Quality checks (like readmission rates) that stop hospitals from rushing patients out just to beat a clock.',
        originalSentence: 'First, replace single-metric targets with balanced, multi-dimensional "dashboards" that pair speed indicators with countervailing quality metrics—such as pairing emergency wait times with thirty-day unplanned readmission rates and ambulance handover delays.',
        exampleSentence: 'Independent courts provide a countervailing check on executive power.',
        synonyms: ['balancing', 'offsetting', 'compensating'],
        arabicTranslation: 'موازِن / معادل في الاتجاه المقابل'
      }
    ],
    questions: [
      {
        id: 'c1-exp-eco-q1',
        type: 'true_false_not_given',
        prompt: 'Marilyn Strathern expressed Goodhart’s Law in the famous sentence: "When a measure becomes a target, it ceases to be a good measure."',
        correctAnswer: 'True',
        explanation: 'Paragraph 1 states that expressed in its canonical form by anthropologist Marilyn Strathern, Goodhart’s Law states: "When a measure becomes a target, it ceases to be a good measure."',
        passageEvidence: 'Expressed in its canonical form by anthropologist Marilyn Strathern, Goodhart’s Law states: "When a measure becomes a target, it ceases to be a good measure."'
      },
      {
        id: 'c1-exp-eco-q2',
        type: 'true_false_not_given',
        prompt: 'According to the passage, metric distortion only happens when employees commit illegal fraud and invent fake numbers.',
        correctAnswer: 'False',
        explanation: 'Paragraph 2 explicitly states that metric distortion does not require outright fraud or falsification of data; most metric gaming occurs through legally permissible resource reallocation.',
        passageEvidence: 'Crucially, metric distortion does not require outright fraud or falsification of data. Most metric gaming occurs through legally permissible resource reallocation: focusing exclusively on the narrow slice of reality captured by the scoreboard while neglecting equally vital unmeasured dimensions.'
      },
      {
        id: 'c1-exp-eco-q3',
        type: 'true_false_not_given',
        prompt: 'Charles Goodhart was working at the University of Cambridge when he wrote his 1975 paper on monetary policy.',
        correctAnswer: 'Not Given',
        explanation: 'Paragraph 1 mentions British economist Charles Goodhart and his 1975 observation regarding central-bank monetary policy, but it never mentions the University of Cambridge.',
        passageEvidence: 'In 1975, British economist Charles Goodhart formulated an incisive observation regarding central-bank monetary policy that has since become a universal axiom of institutional economics, public administration, and artificial-intelligence alignment.'
      },
      {
        id: 'c1-exp-eco-q4',
        type: 'yes_no_not_given',
        prompt: 'The author recommends abolishing all quantitative measurements and accountability in hospitals and schools.',
        correctAnswer: 'No',
        explanation: 'In Paragraph 6, the author recommends three structural safeguards "To mitigate Goodhart’s Law without abandoning accountability," including balanced dashboards, diagnostic inquiry, and peer audits.',
        passageEvidence: 'To mitigate Goodhart’s Law without abandoning accountability, institutional economists recommend three structural safeguards.'
      },
      {
        id: 'c1-exp-eco-q5',
        type: 'multiple_choice',
        prompt: 'What perverse behaviour emerged in some hospitals when a strict four-hour emergency-department target was enforced?',
        options: [
          'Arriving ambulances were kept waiting outside in the car park so the official four-hour clock inside the hospital would not start',
          'Doctors refused to discharge any patient until exactly twenty-four hours had passed',
          'Hospitals closed their triage desks and stopped hiring nurses',
          'Patients with minor sprains were immediately sent to intensive care for thirty days'
        ],
        correctAnswer: 'Arriving ambulances were kept waiting outside in the car park so the official four-hour clock inside the hospital would not start',
        explanation: 'Paragraph 3 explains that to prevent the four-hour clock from starting, some hospitals forced arriving ambulances to queue outside in the car park with patients still on stretchers.',
        passageEvidence: 'To prevent the four-hour clock from starting, some hospitals forced arriving ambulances to queue outside in the car park with patients still on stretchers until doctors inside were ready.'
      },
      {
        id: 'c1-exp-eco-q6',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with TWO WORDS from Paragraph 4: In academic publishing, dividing a single coherent research study into four minimal papers to inflate publication counts is called "______."',
        correctAnswer: 'salami slicing',
        acceptedAnswers: ['salami slicing'],
        explanation: 'Paragraph 4 states that evaluating scholars purely by publication count encourages "salami slicing"—dividing a single coherent research study into four minimal papers.',
        passageEvidence: 'In university research, evaluating scholars purely by publication count or citation indices (such as the h-index) encourages "salami slicing"—dividing a single coherent research study into four minimal papers—alongside citation cartels and a reluctance to undertake slow, high-risk foundational investigations that may take a decade to bear fruit.'
      },
      {
        id: 'c1-exp-eco-q7',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 1, the word "proxy" is closest in meaning to:',
        options: [
          'A measurable substitute indicator standing in for a complex goal',
          'A financial bonus paid to a hospital director',
          'A central-bank interest rate set in 1975',
          'A qualitative peer review conducted by doctors'
        ],
        correctAnswer: 'A measurable substitute indicator standing in for a complex goal',
        explanation: 'Paragraph 1 explains that because overarching goals are difficult to measure directly, administrators select a quantifiable statistical proxy that correlates with the true goal.',
        passageEvidence: 'Administrators therefore select a quantifiable statistical proxy that correlates reasonably well with the true goal under normal, unpressured conditions.'
      },
      {
        id: 'c1-exp-eco-q8',
        type: 'short_answer',
        prompt: 'Answer with TWO WORDS from Paragraph 4: What term describes students scoring just two or three points below a pass-fail threshold who receive disproportionate tutoring?',
        correctAnswer: 'bubble students',
        acceptedAnswers: ['bubble students'],
        explanation: 'Paragraph 4 refers to these pupils as "bubble students"—those scoring just two or three points below the cutoff.',
        passageEvidence: 'When school systems evaluate teachers solely by the percentage of pupils crossing a single pass-fail threshold on a standardized mathematics test, administrators face a strong incentive to concentrate tutoring on "bubble students"—those scoring just two or three points below the cutoff—while reducing instructional attention for both struggling learners far below the line and advanced learners already above it.'
      },
      {
        id: 'c1-exp-eco-q9',
        type: 'matching_information',
        prompt: 'Which paragraph explains why distant boards and regulators find single numerical rankings so attractive despite their flaws?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4', 'Paragraph 5', 'Paragraph 6'],
        correctAnswer: 'Paragraph 5',
        explanation: 'Paragraph 5 explains that single numerical metrics offer an alluring illusion of objectivity and administrative legibility on a spreadsheet without requiring deep domain expertise.',
        passageEvidence: 'Why do organizations repeatedly fall into the Goodhart trap despite knowing its dangers? Organizational sociologists point out that single numerical metrics offer an alluring illusion of objectivity and administrative legibility.'
      },
      {
        id: 'c1-exp-eco-q10',
        type: 'summary_completion',
        prompt: 'Complete the summary with TWO WORDS from Paragraph 2: Parallel to Goodhart’s Law, social scientist Donald Campbell formulated ______ regarding the corruption of high-stakes social indicators.',
        correctAnswer: 'Campbell’s Law',
        acceptedAnswers: ['Campbell’s Law', "Campbell's Law"],
        explanation: 'Paragraph 2 introduces this parallel principle as Campbell’s Law.',
        passageEvidence: 'Social scientist Donald Campbell identified a parallel dynamic in educational policy known as Campbell’s Law: the more any quantitative social indicator is used for high-stakes decision-making, the more subject it will be to corruption pressures and the more apt it will be to distort the very social processes it is intended to monitor.'
      }
    ]
  },
  {
    id: 'c1-19-gravitational-wave-interferometry',
    title: 'Laser Interferometry and Spacetime Strain in Multi-Messenger Gravitational-Wave Astronomy',
    level: 'C1',
    topic: 'Astronomy and space exploration',
    status: 'published',
    estimatedMinutes: 14,
    generationBatch: 'batch-expansion-c1',
    imageStatus: 'ready',
    introduction: 'Examine how four-kilometre vacuum laser arms measure ripples in spacetime smaller than a proton to observe colliding black holes and neutron stars.',
    illustrationAlt: 'Photograph of astronomical observatories beneath the Milky Way at night',
    passage: [
      'In 1916, shortly after publishing his general theory of relativity, Albert Einstein predicted that accelerating massive objects—such as two orbiting black holes spiralling toward a collision—would send ripples of curvature travelling outward through the fabric of spacetime itself at the speed of light. Unlike electromagnetic radiation (such as visible light, radio waves, or X-rays), which travels through space and is easily absorbed or scattered by interstellar dust clouds, gravitational waves are dynamic oscillations of spacetime geometry that pass unimpeded through entire galaxies. Yet Einstein himself doubted that humans would ever detect them, because gravity is so extraordinarily weak over astronomical distances that even a cataclysmic merger of two thirty-solar-mass black holes a billion light-years away stretches and squeezes a four-kilometre detector on Earth by less than one-thousandth the diameter of a single proton.',
      'Measuring a fractional length change—or "spacetime strain"—of one part in a sextillion required arguably the most sensitive precision instrument ever constructed: the Laser Interferometer Gravitational-Wave Observatory (LIGO), operating twin detectors in Hanford, Washington, and Livingston, Louisiana, alongside the European Virgo detector in Italy and KAGRA in Japan. Each observatory consists of two perpendicular four-kilometre-long ultra-high-vacuum steel tubes arranged in a giant L-shape. At the corner vertex, a stabilized infrared laser beam is split evenly into two perpendicular beams that travel down the two four-kilometre arms, bounce back and forth hundreds of times between suspended fused-silica mirrors known as Fabry-Pérot cavities, and recombine at a photodetector.',
      'In the absence of a gravitational wave, the two arms have the exact same optical path length, and the mirrors are positioned so that when the two laser beams recombine, the wave crests of one beam align precisely with the wave troughs of the other. Through this destructive interference, the two beams cancel each other out, and the photodetector sees darkness. When a passing gravitational wave washes through Earth, however, its quadrupolar strain stretches one four-kilometre arm by a fraction of a femtometre while simultaneously compressing the perpendicular arm by the same infinitesimal amount. Because the two laser travel times are now slightly unequal, the recombining light waves fall out of perfect cancellation, producing a faint, rhythmic flicker of light at the photodetector whose rising frequency—"chirp"—encodes the masses and spins of the colliding objects.',
      'Achieving such sensitivity meant isolating the forty-kilogram fused-silica mirrors from every terrestrial vibration that could mimic a cosmic signal. Distant ocean waves crashing against coastlines, freight trains miles away, and even microscopic thermal jiggling of atoms on the mirror coatings produce displacements millions of times larger than a gravitational wave. Engineers suspended each mirror at the bottom of a four-stage quadruple pendulum chain paired with active seismic sensors that push back against ground motion in real time. At the high frequencies where laser photon counting itself introduces "quantum shot noise," physicists inject "squeezed vacuum states" of light to reduce quantum uncertainty in the phase of the laser beam.',
      'On 14 September 2015, both LIGO detectors simultaneously recorded the unmistakable 0.2-second chirp of two black holes merging 1.3 billion light-years away—confirming Einstein’s century-old prediction. Two years later, in August 2017, the LIGO-Virgo network detected a 100-second gravitational-wave signal from two colliding neutron stars (GW170817) just 1.7 seconds before space telescopes detected a short gamma-ray burst from the same patch of sky. Within hours, seventy optical, infrared, and radio observatories worldwide locked onto the fading "kilonova" fireball.',
      'This landmark event inaugurated the era of multi-messenger astronomy: combining gravitational-wave "hearing" with electromagnetic "sight." Spectroscopic analysis of the kilonova glow proved that neutron-star collisions are the primary cosmic forge where the universe synthesizes heavy rapid-neutron-capture (r-process) elements, including gold, platinum, and uranium. Future space-based interferometers such as LISA—which will fly three spacecraft in a 2.5-million-kilometre triangle—will open an even lower frequency band, listening to supermassive black hole mergers across the dawn of cosmic history. In addition to resolving the origin of heavy elements, gravitational-wave detections have provided cosmologists with an entirely independent method for measuring the expansion rate of the universe, known as the Hubble constant. Traditional electromagnetic astronomy relies on a "cosmic distance ladder" of pulsating Cepheid stars and Type Ia supernovae to estimate how fast distant galaxies are receding, a method currently embroiled in a famous discrepancy—the "Hubble tension"—between early-universe cosmic microwave background measurements and local supernova observations. A binary neutron-star merger, by contrast, acts as a self-calibrated "standard siren": the amplitude and frequency evolution of the gravitational-wave chirp directly reveal the absolute luminosity distance to the collision without requiring intermediate calibration steps, while telescope spectra of the host galaxy yield its redshift velocity. Next-generation third-generation ground observatories—specifically Europe’s subterranean triangular Einstein Telescope and the United States’ forty-kilometre Cosmic Explorer—will use cryogenically cooled silicon mirrors at ten kelvins to boost strain sensitivity tenfold. By detecting hundreds of thousands of compact binary mergers every year back to the era before the first stars ignited, gravitational-wave interferometry is transforming humanity’s ability to probe extreme gravity, nuclear matter, and cosmic evolution. Simultaneously, pulsar timing arrays—which monitor millisecond radio pulsars across the Milky Way as a galaxy-sized gravitational-wave detector—have recently uncovered a low-frequency background hum of nanohertz gravitational waves generated by pairs of supermassive black holes orbiting at the centres of merging galaxies. Together, ground-based laser interferometers, future space triangles, and galactic pulsar networks now span twelve orders of magnitude in gravitational-wave frequency, opening a complete acoustic spectrum of the relativistic universe. Machine-learning denoising algorithms now process live interferometer strain data in milliseconds, alerting optical robotic telescopes worldwide before two spiralling neutron stars have even finished colliding.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'c1-exp-ast-1',
        word: 'unimpeded',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Not blocked, slowed down, or stopped by any obstacle.',
        contextMeaning: 'Passing straight through dense dust clouds and galaxies without being scattered.',
        originalSentence: 'Unlike electromagnetic radiation (such as visible light, radio waves, or X-rays), which travels through space and is easily absorbed or scattered by interstellar dust clouds, gravitational waves are dynamic oscillations of spacetime geometry that pass unimpeded through entire galaxies.',
        exampleSentence: 'Neutrinos and gravitational waves travel unimpeded through solid matter.',
        synonyms: ['unobstructed', 'unhindered', 'free'],
        arabicTranslation: 'دون عائق / بلا ممانعة'
      },
      {
        id: 'c1-exp-ast-2',
        word: 'cataclysmic',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Involving a violent, immense, and dramatic natural upheaval or collision.',
        contextMeaning: 'An extraordinarily violent cosmic crash between two massive black holes.',
        originalSentence: 'Yet Einstein himself doubted that humans would ever detect them, because gravity is so extraordinarily weak over astronomical distances that even a cataclysmic merger of two thirty-solar-mass black holes a billion light-years away stretches and squeezes a four-kilometre detector on Earth by less than one-thousandth the diameter of a single proton.',
        exampleSentence: 'A cataclysmic asteroid impact ended the reign of the dinosaurs.',
        synonyms: ['violent', 'catastrophic', 'immense'],
        arabicTranslation: 'كارثي / هائل العنف'
      },
      {
        id: 'c1-exp-ast-3',
        word: 'perpendicular',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Meeting at a precise right angle of ninety degrees, like the two arms of the letter L.',
        contextMeaning: 'The two 4-kilometre laser arms set at a 90-degree angle to each other.',
        originalSentence: 'Each observatory consists of two perpendicular four-kilometre-long ultra-high-vacuum steel tubes arranged in a giant L-shape.',
        exampleSentence: 'The two streets meet at a perpendicular intersection.',
        synonyms: ['right-angled', 'orthogonal'],
        arabicTranslation: 'متعامد (بزاوية قائمة)'
      },
      {
        id: 'c1-exp-ast-4',
        word: 'troughs',
        partOfSpeech: 'noun',
        simpleDefinition: 'The lowest bottom points between the high crests of waves.',
        contextMeaning: 'The low points of a laser light wave that cancel out the high crests of the other beam.',
        originalSentence: 'In the absence of a gravitational wave, the two arms have the exact same optical path length, and the mirrors are positioned so that when the two laser beams recombine, the wave crests of one beam align precisely with the wave troughs of the other.',
        exampleSentence: 'The fishing boat rose on the wave crests and dipped into the troughs.',
        synonyms: ['low points', 'dips'],
        arabicTranslation: 'قيعان الموجات'
      },
      {
        id: 'c1-exp-ast-5',
        word: 'infinitesimal',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Immeasurably or unimaginably tiny.',
        contextMeaning: 'Smaller than one-thousandth the width of a single proton.',
        originalSentence: 'When a passing gravitational wave washes through Earth, however, its quadrupolar strain stretches one four-kilometre arm by a fraction of a femtometre while simultaneously compressing the perpendicular arm by the same infinitesimal amount.',
        exampleSentence: 'Atomic clocks can measure infinitesimal fractions of a second.',
        synonyms: ['microscopic', 'minute', 'vanishingly small'],
        arabicTranslation: 'متناهي الصغر'
      },
      {
        id: 'c1-exp-ast-6',
        word: 'mimic',
        partOfSpeech: 'verb',
        simpleDefinition: 'To look or act like something else, potentially causing a false alarm.',
        contextMeaning: 'To shake the mirrors in a way that could be mistaken for a passing gravitational wave.',
        originalSentence: 'Achieving such sensitivity meant isolating the forty-kilogram fused-silica mirrors from every terrestrial vibration that could mimic a cosmic signal.',
        exampleSentence: 'Harmless hoverflies mimic the black-and-yellow stripes of wasps.',
        synonyms: ['imitate', 'resemble', 'simulate'],
        arabicTranslation: 'يحاكي / يقلد'
      },
      {
        id: 'c1-exp-ast-7',
        word: 'inaugurated',
        partOfSpeech: 'verb',
        simpleDefinition: 'Marked the official beginning of a major new era or scientific field.',
        contextMeaning: 'Launched the new era of multi-messenger astronomy in August 2017.',
        originalSentence: 'This landmark event inaugurated the era of multi-messenger astronomy: combining gravitational-wave "hearing" with electromagnetic "sight."',
        exampleSentence: 'The invention of the telescope inaugurated modern observational astronomy.',
        synonyms: ['launched', 'initiated', 'ushered in'],
        arabicTranslation: 'دشّن / افتتح عصراً جديداً'
      },
      {
        id: 'c1-exp-ast-8',
        word: 'forge',
        partOfSpeech: 'noun',
        simpleDefinition: 'A furnace or workshop where metals are created and shaped under extreme heat.',
        contextMeaning: 'The extreme cosmic site (colliding neutron stars) where heavy elements like gold and platinum are created.',
        originalSentence: 'Spectroscopic analysis of the kilonova glow proved that neutron-star collisions are the primary cosmic forge where the universe synthesizes heavy rapid-neutron-capture (r-process) elements, including gold, platinum, and uranium.',
        exampleSentence: 'Supernovae and neutron-star mergers act as a cosmic forge for heavy atoms.',
        synonyms: ['crucible', 'workshop', 'furnace'],
        arabicTranslation: 'مَصهر كوني'
      }
    ],
    questions: [
      {
        id: 'c1-exp-ast-q1',
        type: 'true_false_not_given',
        prompt: 'Unlike visible light, gravitational waves pass unimpeded through interstellar dust clouds and entire galaxies.',
        correctAnswer: 'True',
        explanation: 'Paragraph 1 states that unlike electromagnetic radiation, which is easily absorbed or scattered by interstellar dust clouds, gravitational waves pass unimpeded through entire galaxies.',
        passageEvidence: 'Unlike electromagnetic radiation (such as visible light, radio waves, or X-rays), which travels through space and is easily absorbed or scattered by interstellar dust clouds, gravitational waves are dynamic oscillations of spacetime geometry that pass unimpeded through entire galaxies.'
      },
      {
        id: 'c1-exp-ast-q2',
        type: 'true_false_not_given',
        prompt: 'A passing gravitational wave stretches both perpendicular arms of a LIGO detector by the exact same amount at the exact same moment.',
        correctAnswer: 'False',
        explanation: 'Paragraph 3 states that a passing gravitational wave stretches one four-kilometre arm while simultaneously compressing (squeezing) the perpendicular arm.',
        passageEvidence: 'When a passing gravitational wave washes through Earth, however, its quadrupolar strain stretches one four-kilometre arm by a fraction of a femtometre while simultaneously compressing the perpendicular arm by the same infinitesimal amount.'
      },
      {
        id: 'c1-exp-ast-q3',
        type: 'true_false_not_given',
        prompt: 'The KAGRA detector in Japan uses heavier fused-silica mirrors than the Virgo detector in Italy.',
        correctAnswer: 'Not Given',
        explanation: 'Paragraph 2 mentions LIGO, Virgo in Italy, and KAGRA in Japan, and Paragraph 4 mentions forty-kilogram fused-silica mirrors, but the passage never compares mirror weights between KAGRA and Virgo.',
        passageEvidence: 'Measuring a fractional length change—or "spacetime strain"—of one part in a sextillion required arguably the most sensitive precision instrument ever constructed: the Laser Interferometer Gravitational-Wave Observatory (LIGO), operating twin detectors in Hanford, Washington, and Livingston, Louisiana, alongside the European Virgo detector in Italy and KAGRA in Japan.'
      },
      {
        id: 'c1-exp-ast-q4',
        type: 'yes_no_not_given',
        prompt: 'The author notes that Albert Einstein himself was sceptical that technology would ever be sensitive enough to detect gravitational waves.',
        correctAnswer: 'Yes',
        explanation: 'In Paragraph 1, the author states: "Yet Einstein himself doubted that humans would ever detect them, because gravity is so extraordinarily weak over astronomical distances..."',
        passageEvidence: 'Yet Einstein himself doubted that humans would ever detect them, because gravity is so extraordinarily weak over astronomical distances that even a cataclysmic merger of two thirty-solar-mass black holes a billion light-years away stretches and squeezes a four-kilometre detector on Earth by less than one-thousandth the diameter of a single proton.'
      },
      {
        id: 'c1-exp-ast-q5',
        type: 'multiple_choice',
        prompt: 'Why does the photodetector at a LIGO observatory see darkness when no gravitational wave is passing through Earth?',
        options: [
          'The two recombining laser beams have equal path lengths and are aligned so the wave crests of one beam cancel the wave troughs of the other',
          'The infrared laser is switched off until a space telescope sends an alert',
          'The forty-kilogram fused-silica mirrors absorb all infrared light inside the vacuum tubes',
          'Earth’s magnetic field blocks laser light from reaching the corner vertex'
        ],
        correctAnswer: 'The two recombining laser beams have equal path lengths and are aligned so the wave crests of one beam cancel the wave troughs of the other',
        explanation: 'Paragraph 3 explains that in the absence of a gravitational wave, the wave crests of one beam align precisely with the wave troughs of the other, cancelling each other out through destructive interference.',
        passageEvidence: 'In the absence of a gravitational wave, the two arms have the exact same optical path length, and the mirrors are positioned so that when the two laser beams recombine, the wave crests of one beam align precisely with the wave troughs of the other. Through this destructive interference, the two beams cancel each other out, and the photodetector sees darkness.'
      },
      {
        id: 'c1-exp-ast-q6',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with ONE WORD from Paragraph 5: Within hours of the August 2017 neutron-star merger, seventy observatories worldwide locked onto the fading "______" fireball.',
        correctAnswer: 'kilonova',
        acceptedAnswers: ['kilonova'],
        explanation: 'Paragraph 5 states that within hours, seventy observatories locked onto the fading "kilonova" fireball.',
        passageEvidence: 'Within hours, seventy optical, infrared, and radio observatories worldwide locked onto the fading "kilonova" fireball.'
      },
      {
        id: 'c1-exp-ast-q7',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 3, the word "infinitesimal" is closest in meaning to:',
        options: [
          'Immeasurably tiny',
          'Four kilometres long',
          'Visible to the naked eye',
          'Lasting for several centuries'
        ],
        correctAnswer: 'Immeasurably tiny',
        explanation: '"A fraction of a femtometre... by the same infinitesimal amount" refers to an unimaginably tiny distance (smaller than a thousandth of a proton).',
        passageEvidence: 'When a passing gravitational wave washes through Earth, however, its quadrupolar strain stretches one four-kilometre arm by a fraction of a femtometre while simultaneously compressing the perpendicular arm by the same infinitesimal amount.'
      },
      {
        id: 'c1-exp-ast-q8',
        type: 'short_answer',
        prompt: 'Answer with ONE WORD from Paragraph 6: What is the name of the future space-based gravitational-wave interferometer that will fly three spacecraft in a 2.5-million-kilometre triangle?',
        correctAnswer: 'LISA',
        acceptedAnswers: ['LISA'],
        explanation: 'Paragraph 6 names this future space-based interferometer LISA.',
        passageEvidence: 'Future space-based interferometers such as LISA—which will fly three spacecraft in a 2.5-million-kilometre triangle—will open an even lower frequency band, listening to supermassive black hole mergers across the dawn of cosmic history.'
      },
      {
        id: 'c1-exp-ast-q9',
        type: 'matching_information',
        prompt: 'Which paragraph describes the four-stage pendulum suspensions and quantum "squeezed vacuum states" used to isolate the mirrors from noise?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4', 'Paragraph 5', 'Paragraph 6'],
        correctAnswer: 'Paragraph 4',
        explanation: 'Paragraph 4 describes the four-stage quadruple pendulum chain, active seismic sensors, and squeezed vacuum states of light.',
        passageEvidence: 'Engineers suspended each mirror at the bottom of a four-stage quadruple pendulum chain paired with active seismic sensors that push back against ground motion in real time.'
      },
      {
        id: 'c1-exp-ast-q10',
        type: 'summary_completion',
        prompt: 'Complete the summary with ONE WORD from Paragraph 6: Spectroscopic analysis of the 2017 kilonova proved that colliding neutron stars are the primary cosmic forge for heavy elements such as gold, platinum, and ______.',
        correctAnswer: 'uranium',
        acceptedAnswers: ['uranium'],
        explanation: 'Paragraph 6 lists gold, platinum, and uranium.',
        passageEvidence: 'Spectroscopic analysis of the kilonova glow proved that neutron-star collisions are the primary cosmic forge where the universe synthesizes heavy rapid-neutron-capture (r-process) elements, including gold, platinum, and uranium.'
      }
    ]
  },
  {
    id: 'c1-20-urban-canyon-microclimates',
    title: 'Radiative Trapping and Aerodynamic Roughness in Deep Urban Street Canyons',
    level: 'C1',
    topic: 'Architecture and urban development',
    status: 'published',
    estimatedMinutes: 14,
    generationBatch: 'batch-expansion-c1',
    imageStatus: 'ready',
    introduction: 'Analyze how the height-to-width ratio of city streets governs longwave radiation trapping, wind vortices, and nocturnal urban heat islands.',
    illustrationAlt: 'Photograph of dense high-rise glass and stone buildings forming deep urban street canyons',
    passage: [
      'Climatologists have known since Luke Howard’s pioneering nineteenth-century measurements of London that dense cities remain significantly warmer than their surrounding rural countryside, a phenomenon termed the Urban Heat Island (UHI) effect. In popular accounts, urban warming is often attributed simply to dark asphalt roads absorbing daytime sunlight or to waste heat emitted by car engines and air-conditioning condensers. Yet micrometeorological field campaigns demonstrate that the Urban Heat Island is primarily a nocturnal phenomenon—reaching its maximum intensity of four to eight degrees Celsius several hours after sunset—and that its dominant physical driver is the three-dimensional geometry of the "urban street canyon."',
      'Urban climatologists, following the foundational work of Timothy Oke, characterize street geometry using two interrelated dimensionless metrics: the aspect ratio (H/W), defined as the average height of the flanking buildings (H) divided by the width of the street (W), and the Sky View Factor (SVF), which represents the fraction of the overhead celestial hemisphere visible from a point on the street pavement. In an open rural meadow or a wide suburban boulevard with low-rise houses, the Sky View Factor approaches 1.0: almost the entire cold night sky is visible from the ground. In a deep metropolitan street canyon flanked by twenty-storey towers, however, the aspect ratio exceeds 3.0 and the Sky View Factor drops below 0.2, leaving only a narrow ribbon of sky overhead.',
      'This geometric confinement fundamentally alters both shortwave solar absorption during the day and longwave infrared cooling at night. When daytime sunlight enters a deep street canyon, photons that reflect off a building facade or the road surface do not bounce back out to space; instead, they strike the opposite wall, undergoing multiple reflections that trap solar energy within the masonry and concrete. Even more decisive is what happens after sunset. Every warm surface on Earth cools itself at night by emitting longwave thermal infrared radiation upward toward the frigid upper atmosphere. In an open rural field, that infrared energy escapes directly to the sky, allowing the ground to cool rapidly. In a low-sky-view-factor street canyon, by contrast, eighty percent of the infrared radiation emitted by the warm road and lower walls is intercepted by the facing buildings and re-radiated back and forth across the street, severely retarding nocturnal cooling.',
      'Simultaneously, canyon geometry governs aerodynamic airflow and pollutant dispersion at pedestrian level. When ambient regional winds blow perpendicular to a street’s axis, the behaviour of the air depends on the canyon’s aspect ratio. In wide avenues (H/W below 0.3), the wind flows smoothly down to the pavement and flushes out heat and vehicle exhaust. As the canyon deepens past H/W above 0.7, however, the fast-moving air skims across the rooftops—a regime called "skimming flow"—and decouples from the street below. Trapped inside the canyon, the air spins into a closed recirculating vortex that concentrates tailpipe nitrogen oxides and particulate matter right at pedestrian breathing height while preventing cool rural breezes from penetrating the neighbourhood.',
      'To break this radiative and aerodynamic trap without demolishing high-density transit-oriented cities, urban microclimate modellers advocate three geometric and material interventions. First, replacing uniform wall-like tower blocks with "stepped" podium setbacks and varying building heights increases aerodynamic roughness, generating turbulent vertical mixing that draws fresh upper-level air down into the street canyon. Second, aligning major arterial streets parallel to prevailing summer sea or valley breezes creates porous "wind corridors" that ventilate the urban core.',
      'Third, materials scientists have developed "cool-envelope" coatings—including high-albedo elastomeric roof membranes and retro-reflective facade materials—that bounce incoming solar radiation directly back out through the top of the canyon rather than downward onto the opposite wall. When cities pair stepped canyon geometry and wind corridors with mature street-tree canopies—which cool the air via leaf transpiration without blocking longwave sky view as solid masonry does—metropolitan districts can preserve compact urban density while restoring nocturnal thermal relief. Recent breakthroughs in "passive daytime radiative cooling" (PDRC) metamaterials have pushed cool-envelope physics even further. Unlike conventional white titanium-dioxide paints, which reflect roughly eighty percent of sunlight but still absorb ultraviolet rays, photonic polymer films and porous ceramic coatings reflect over ninety-six percent of solar radiation while simultaneously emitting thermal heat specifically within the "atmospheric transparency window" between eight and thirteen micrometres. Because water vapour and carbon dioxide in the lower atmosphere are nearly transparent to infrared wavelengths in that narrow spectral window, a roof or upper facade coated with a radiative-cooling metamaterial beams its heat directly through the atmosphere into the freezing sink of outer space—remaining four to six degrees Celsius cooler than the surrounding afternoon air even under direct noon sunlight. At the regulatory level, municipalities such as Stuttgart, Tokyo, and Singapore have embedded computational fluid dynamics (CFD) wind-tunnel simulations directly into their statutory zoning codes. Before a developer is granted a building permit for a high-rise tower, urban climatologists model its shadow and wake effects to verify that the proposed massing will not choke downslope mountain breezes or create stagnant thermal pockets in adjacent residential streets. Treating street-canyon geometry and radiative physics as foundational public-health infrastructure ensures that high-density cities remain breathable and thermally resilient in a warming century. High-resolution thermal-infrared satellite sensors and mobile bicycle-mounted weather stations now enable municipal planners to map nocturnal cooling rates block by block across entire metropolitan regions. By targeting cool-pavement retrofits, stepped facade rules, and irrigated green corridors specifically toward the deepest street canyons where vulnerable elderly residents live, cities can substantially reduce heat-related hospital admissions during multi-day summer heatwaves.'
    ].join('\n\n'),
    vocabulary: [
      {
        id: 'c1-exp-arc-1',
        word: 'nocturnal',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Happening or reaching its peak during the night.',
        contextMeaning: 'Showing the largest temperature difference between city and countryside several hours after sunset.',
        originalSentence: 'Yet micrometeorological field campaigns demonstrate that the Urban Heat Island is primarily a nocturnal phenomenon—reaching its maximum intensity of four to eight degrees Celsius several hours after sunset—and that its dominant physical driver is the three-dimensional geometry of the "urban street canyon."',
        exampleSentence: 'Owls and bats are nocturnal animals that hunt in the dark.',
        synonyms: ['nighttime', 'nightly'],
        arabicTranslation: 'ليلي'
      },
      {
        id: 'c1-exp-arc-2',
        word: 'flanking',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Standing along both sides of a road, river, or entrance.',
        contextMeaning: 'The rows of tall buildings standing along both sides of a city street.',
        originalSentence: 'Urban climatologists, following the foundational work of Timothy Oke, characterize street geometry using two interrelated dimensionless metrics: the aspect ratio (H/W), defined as the average height of the flanking buildings (H) divided by the width of the street (W), and the Sky View Factor (SVF), which represents the fraction of the overhead celestial hemisphere visible from a point on the street pavement.',
        exampleSentence: 'Tall stone columns stood flanking the museum entrance.',
        synonyms: ['bordering', 'lining', 'edging'],
        arabicTranslation: 'محاذٍ على الجانبين'
      },
      {
        id: 'c1-exp-arc-3',
        word: 'confinement',
        partOfSpeech: 'noun',
        simpleDefinition: 'The state of being enclosed within narrow walls or boundaries.',
        contextMeaning: 'The narrow enclosure created by tall buildings on either side of a street.',
        originalSentence: 'This geometric confinement fundamentally alters both shortwave solar absorption during the day and longwave infrared cooling at night.',
        exampleSentence: 'The narrow confinement of the valley amplified the sound of the river.',
        synonyms: ['enclosure', 'narrowness'],
        arabicTranslation: 'انحصار هندسي ضيق'
      },
      {
        id: 'c1-exp-arc-4',
        word: 'intercepted',
        partOfSpeech: 'verb',
        simpleDefinition: 'Stopped and caught on its way from one place to another.',
        contextMeaning: 'Blocked by facing building walls before infrared heat can escape to the night sky.',
        originalSentence: 'In a low-sky-view-factor street canyon, by contrast, eighty percent of the infrared radiation emitted by the warm road and lower walls is intercepted by the facing buildings and re-radiated back and forth across the street, severely retarding nocturnal cooling.',
        exampleSentence: 'Tree leaves intercepted much of the light rain before it hit the ground.',
        synonyms: ['blocked', 'caught', 'stopped'],
        arabicTranslation: 'اعتُرض سبيله / حُجز'
      },
      {
        id: 'c1-exp-arc-5',
        word: 'retarding',
        partOfSpeech: 'verb',
        simpleDefinition: 'Slowing down or delaying the progress of a natural process.',
        contextMeaning: 'Slowing down how fast city streets cool off after sunset.',
        originalSentence: 'In a low-sky-view-factor street canyon, by contrast, eighty percent of the infrared radiation emitted by the warm road and lower walls is intercepted by the facing buildings and re-radiated back and forth across the street, severely retarding nocturnal cooling.',
        exampleSentence: 'Mulch around garden plants helps by retarding soil moisture loss.',
        synonyms: ['slowing down', 'delaying', 'impeding'],
        arabicTranslation: 'يُبطئ / يعيق'
      },
      {
        id: 'c1-exp-arc-6',
        word: 'vortex',
        partOfSpeech: 'noun',
        simpleDefinition: 'A whirling, circular mass of air or water that spins around a central axis.',
        contextMeaning: 'A trapped loop of spinning air inside a deep street canyon that holds exhaust fumes near the pavement.',
        originalSentence: 'Trapped inside the canyon, the air spins into a closed recirculating vortex that concentrates tailpipe nitrogen oxides and particulate matter right at pedestrian breathing height while preventing cool rural breezes from penetrating the neighbourhood.',
        exampleSentence: 'Water draining from a sink forms a small spinning vortex.',
        synonyms: ['whirlpool of air', 'eddy', 'swirl'],
        arabicTranslation: 'دوامة هوائية'
      },
      {
        id: 'c1-exp-arc-7',
        word: 'arterial',
        partOfSpeech: 'adjective',
        simpleDefinition: 'Serving as a main, wide through-route in a transport or street network.',
        contextMeaning: 'Major wide city avenues that carry air and traffic into the heart of the city.',
        originalSentence: 'Second, aligning major arterial streets parallel to prevailing summer sea or valley breezes creates porous "wind corridors" that ventilate the urban core.',
        exampleSentence: 'Buses travel along the main arterial roads into the city centre.',
        synonyms: ['main', 'primary', 'trunk'],
        arabicTranslation: 'شرياني / رئيسي'
      },
      {
        id: 'c1-exp-arc-8',
        word: 'transpiration',
        partOfSpeech: 'noun',
        simpleDefinition: 'The process by which plants release water vapour through tiny pores in their leaves, cooling the surrounding air.',
        contextMeaning: 'Natural evaporative cooling provided by street-tree leaves.',
        originalSentence: 'When cities pair stepped canyon geometry and wind corridors with mature street-tree canopies—which cool the air via leaf transpiration without blocking longwave sky view as solid masonry does—metropolitan districts can preserve compact urban density while restoring nocturnal thermal relief.',
        exampleSentence: 'Forest transpiration adds moisture to the summer air.',
        synonyms: ['leaf evaporation'],
        arabicTranslation: 'النتح النباتي'
      }
    ],
    questions: [
      {
        id: 'c1-exp-arc-q1',
        type: 'true_false_not_given',
        prompt: 'The Urban Heat Island effect typically reaches its maximum temperature difference between city and countryside several hours after sunset.',
        correctAnswer: 'True',
        explanation: 'Paragraph 1 states that the Urban Heat Island is primarily a nocturnal phenomenon—reaching its maximum intensity of four to eight degrees Celsius several hours after sunset.',
        passageEvidence: 'Yet micrometeorological field campaigns demonstrate that the Urban Heat Island is primarily a nocturnal phenomenon—reaching its maximum intensity of four to eight degrees Celsius several hours after sunset—and that its dominant physical driver is the three-dimensional geometry of the "urban street canyon."'
      },
      {
        id: 'c1-exp-arc-q2',
        type: 'true_false_not_given',
        prompt: 'In a deep street canyon flanked by twenty-storey towers, the Sky View Factor is close to 1.0.',
        correctAnswer: 'False',
        explanation: 'Paragraph 2 states that in an open rural meadow the Sky View Factor approaches 1.0, whereas in a deep street canyon flanked by twenty-storey towers it drops below 0.2.',
        passageEvidence: 'In a deep metropolitan street canyon flanked by twenty-storey towers, however, the aspect ratio exceeds 3.0 and the Sky View Factor drops below 0.2, leaving only a narrow ribbon of sky overhead.'
      },
      {
        id: 'c1-exp-arc-q3',
        type: 'true_false_not_given',
        prompt: 'Retro-reflective facade coatings are twice as expensive to apply as high-albedo roof membranes.',
        correctAnswer: 'Not Given',
        explanation: 'Paragraph 6 mentions both high-albedo elastomeric roof membranes and retro-reflective facade materials, but it never compares their financial costs.',
        passageEvidence: 'Third, materials scientists have developed "cool-envelope" coatings—including high-albedo elastomeric roof membranes and retro-reflective facade materials—that bounce incoming solar radiation directly back out through the top of the canyon rather than downward onto the opposite wall.'
      },
      {
        id: 'c1-exp-arc-q4',
        type: 'yes_no_not_given',
        prompt: 'The author believes that cities must demolish all high-density transit districts and replace them with low-rise suburban sprawl to solve urban heat islands.',
        correctAnswer: 'No',
        explanation: 'In Paragraphs 5 and 6, the author explains how geometric and material interventions (stepped setbacks, wind corridors, retro-reflective coatings, and street trees) allow cities to break the heat trap "without demolishing high-density transit-oriented cities" and "preserve compact urban density".',
        passageEvidence: 'To break this radiative and aerodynamic trap without demolishing high-density transit-oriented cities, urban microclimate modellers advocate three geometric and material interventions.'
      },
      {
        id: 'c1-exp-arc-q5',
        type: 'multiple_choice',
        prompt: 'Why do deep urban street canyons cool down so slowly after sunset compared with open rural fields?',
        options: [
          'Up to eighty percent of the longwave infrared heat emitted by the road and lower walls is intercepted by facing buildings and re-radiated back and forth',
          'Skimming airflow above the rooftops pushes freezing arctic air down to the pavement at night',
          'Street trees absorb all infrared light from car headlights and turn it into steam',
          'Rural fields have an aspect ratio greater than 3.0 that reflects moonlight'
        ],
        correctAnswer: 'Up to eighty percent of the longwave infrared heat emitted by the road and lower walls is intercepted by facing buildings and re-radiated back and forth',
        explanation: 'Paragraph 3 explains that in a low-sky-view-factor street canyon, eighty percent of the infrared radiation emitted by the warm road and lower walls is intercepted by facing buildings and re-radiated back and forth.',
        passageEvidence: 'In a low-sky-view-factor street canyon, by contrast, eighty percent of the infrared radiation emitted by the warm road and lower walls is intercepted by the facing buildings and re-radiated back and forth across the street, severely retarding nocturnal cooling.'
      },
      {
        id: 'c1-exp-arc-q6',
        type: 'sentence_completion',
        prompt: 'Complete the sentence with TWO WORDS from Paragraph 4: When a street canyon deepens past H/W above 0.7, regional wind skims across the rooftops in a regime called "______."',
        correctAnswer: 'skimming flow',
        acceptedAnswers: ['skimming flow'],
        explanation: 'Paragraph 4 states: \'As the canyon deepens past H/W above 0.7, however, the fast-moving air skims across the rooftops—a regime called "skimming flow"—and decouples from the street below.\'',
        passageEvidence: 'As the canyon deepens past H/W above 0.7, however, the fast-moving air skims across the rooftops—a regime called "skimming flow"—and decouples from the street below.'
      },
      {
        id: 'c1-exp-arc-q7',
        type: 'vocabulary_in_context',
        prompt: 'In Paragraph 3, the word "retarding" is closest in meaning to:',
        options: [
          'Slowing down or delaying',
          'Accelerating by ten times',
          'Measuring with a thermometer',
          'Reflecting upward into space'
        ],
        correctAnswer: 'Slowing down or delaying',
        explanation: '"Severely retarding nocturnal cooling" means slowing down or impeding the nighttime cooling of the street canyon.',
        passageEvidence: 'In a low-sky-view-factor street canyon, by contrast, eighty percent of the infrared radiation emitted by the warm road and lower walls is intercepted by the facing buildings and re-radiated back and forth across the street, severely retarding nocturnal cooling.'
      },
      {
        id: 'c1-exp-arc-q8',
        type: 'short_answer',
        prompt: 'Answer with TWO WORDS from Paragraph 2: Who is the urban climatologist credited with foundational work on aspect ratio and Sky View Factor?',
        correctAnswer: 'Timothy Oke',
        acceptedAnswers: ['Timothy Oke', 'Oke'],
        explanation: 'Paragraph 2 states "Urban climatologists, following the foundational work of Timothy Oke, characterize street geometry..."',
        passageEvidence: 'Urban climatologists, following the foundational work of Timothy Oke, characterize street geometry using two interrelated dimensionless metrics: the aspect ratio (H/W), defined as the average height of the flanking buildings (H) divided by the width of the street (W), and the Sky View Factor (SVF), which represents the fraction of the overhead celestial hemisphere visible from a point on the street pavement.'
      },
      {
        id: 'c1-exp-arc-q9',
        type: 'matching_information',
        prompt: 'Which paragraph explains how a closed recirculating vortex traps vehicle exhaust at pedestrian breathing height?',
        options: ['Paragraph 1', 'Paragraph 2', 'Paragraph 3', 'Paragraph 4', 'Paragraph 5', 'Paragraph 6'],
        correctAnswer: 'Paragraph 4',
        explanation: 'Paragraph 4 describes skimming flow and the closed recirculating vortex that concentrates nitrogen oxides and particulate matter at pedestrian breathing height.',
        passageEvidence: 'Trapped inside the canyon, the air spins into a closed recirculating vortex that concentrates tailpipe nitrogen oxides and particulate matter right at pedestrian breathing height while preventing cool rural breezes from penetrating the neighbourhood.'
      },
      {
        id: 'c1-exp-arc-q10',
        type: 'summary_completion',
        prompt: 'Complete the summary with ONE WORD from Paragraph 5: Replacing uniform wall-like tower blocks with stepped podium setbacks and varying building heights increases aerodynamic ______, drawing fresh air down into the street.',
        correctAnswer: 'roughness',
        acceptedAnswers: ['roughness'],
        explanation: 'Paragraph 5 states that stepped podium setbacks and varying building heights increase aerodynamic roughness, generating turbulent vertical mixing.',
        passageEvidence: 'First, replacing uniform wall-like tower blocks with "stepped" podium setbacks and varying building heights increases aerodynamic roughness, generating turbulent vertical mixing that draws fresh upper-level air down into the street canyon.'
      }
    ]
  }
];

export const BATCH_C1_EXPANSION_LESSONS: ReadingLesson[] = rawC1ExpansionLessons.map((lesson) => {
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
