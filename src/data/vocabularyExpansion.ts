import { ReadingLesson, VocabularyAnnotation } from '../types/reading';

interface VocabularyAddition {
  word: string;
  partOfSpeech: string;
  simpleDefinition: string;
  contextMeaning: string;
  exampleSentence?: string;
}

const VOCABULARY_ADDITIONS: Record<string, VocabularyAddition[]> = {
  'a2-sci-desalination-plants': [
    { word: 'reverse osmosis', partOfSpeech: 'noun phrase', simpleDefinition: 'A method that uses pressure to separate salt from water.', contextMeaning: 'The modern filtering method that pushes seawater through a thin membrane.' },
    { word: 'molecules', partOfSpeech: 'noun', simpleDefinition: 'Very small groups of atoms that make up a substance.', contextMeaning: 'Tiny units of water that can pass through the membrane holes.' },
    { word: 'particles', partOfSpeech: 'noun', simpleDefinition: 'Very small pieces of matter.', contextMeaning: 'Tiny pieces of salt that the membrane stops from passing through.' },
    { word: 'remove', partOfSpeech: 'verb', simpleDefinition: 'To take something away from a place or mixture.', contextMeaning: 'To separate salt and minerals from seawater.' },
  ],
  'a2-env-mangrove-forests': [
    { word: 'coastlines', partOfSpeech: 'noun', simpleDefinition: 'The areas where land meets the sea.', contextMeaning: 'Warm shores where mangrove trees grow.' },
    { word: 'flood', partOfSpeech: 'verb', simpleDefinition: 'To cover an area with water.', contextMeaning: 'High tides cover the muddy ground around the trees.' },
    { word: 'filters', partOfSpeech: 'noun', simpleDefinition: 'Materials or devices that remove unwanted things.', contextMeaning: 'The roots stop much of the salt from moving into the leaves.' },
    { word: 'shoreline', partOfSpeech: 'noun', simpleDefinition: 'The line where land ends and water begins.', contextMeaning: 'The edge of the land that mangrove roots hold together.' },
  ],
  'a2-psy-colour-appetite': [
    { word: 'background', partOfSpeech: 'noun', simpleDefinition: 'The surface or area behind the main object.', contextMeaning: 'The white plate that makes the pink food stand out.' },
    { word: 'flavourful', partOfSpeech: 'adjective', simpleDefinition: 'Having a strong or pleasant taste.', contextMeaning: 'Tasting richer to volunteers, even though the recipe was unchanged.' },
    { word: 'edges', partOfSpeech: 'noun', simpleDefinition: 'The outer lines or borders of something.', contextMeaning: 'The borders of a serving that are hard to see when food and plate look alike.' },
    { word: 'notice', partOfSpeech: 'verb', simpleDefinition: 'To see or become aware of something.', contextMeaning: 'To see their meals more clearly because coloured plates make food stand out.' },
  ],
  'a2-his-silk-road-caravans': [
    { word: 'trade routes', partOfSpeech: 'noun phrase', simpleDefinition: 'Paths used to carry goods for buying and selling.', contextMeaning: 'The roads that connected China, Central Asia, and the Mediterranean.' },
    { word: 'protect', partOfSpeech: 'verb', simpleDefinition: 'To keep someone or something safe from harm.', contextMeaning: 'To make travel and the movement of goods safer from attacks.' },
    { word: 'surrounded by', partOfSpeech: 'phrase', simpleDefinition: 'Having something on every side.', contextMeaning: 'The courtyard had rooms along all of its sides.' },
    { word: 'storage rooms', partOfSpeech: 'noun phrase', simpleDefinition: 'Rooms used to keep things until they are needed.', contextMeaning: 'Places inside the inn where merchants kept their goods.' },
  ],
  'a2-edu-handwriting-memory': [
    { word: 'active mental work', partOfSpeech: 'noun phrase', simpleDefinition: 'Thinking effort that a person uses to understand or solve something.', contextMeaning: 'The effort of choosing key ideas and putting them in the learner’s own words.' },
    { word: 'connect', partOfSpeech: 'verb', simpleDefinition: 'To join two things or ideas together.', contextMeaning: 'To link new facts with information the student already knows.' },
    { word: 'word-for-word', partOfSpeech: 'adverb', simpleDefinition: 'Using exactly the same words as the original.', contextMeaning: 'Typing the lecture exactly as the professor says it.' },
    { word: 'diagrams', partOfSpeech: 'noun', simpleDefinition: 'Simple drawings that explain how something works.', contextMeaning: 'Small drawings students add to their notes to show ideas.' },
  ],
  'a2-bio-arctic-tern': [
    { word: 'escape', partOfSpeech: 'verb', simpleDefinition: 'To get away from a place or situation.', contextMeaning: 'To fly away from cold winter weather in search of food.' },
    { word: 'rocky islands', partOfSpeech: 'noun phrase', simpleDefinition: 'Small areas of land in water with many rocks.', contextMeaning: 'The northern places where Arctic terns lay their eggs.' },
    { word: 'straight line', partOfSpeech: 'noun phrase', simpleDefinition: 'The shortest path with no turns or curves.', contextMeaning: 'A direct route the terns do not follow across the ocean.' },
    { word: 'save energy', partOfSpeech: 'verb phrase', simpleDefinition: 'To use less strength or power.', contextMeaning: 'To make the long flight easier by travelling with ocean winds.' },
  ],
  'a2-hea-circadian-light': [
    { word: 'biological timer', partOfSpeech: 'noun phrase', simpleDefinition: 'A natural body system that controls timing.', contextMeaning: 'The brain’s body clock that helps set sleep and wake times.' },
    { word: 'sunset', partOfSpeech: 'noun', simpleDefinition: 'The time when the sun goes below the horizon.', contextMeaning: 'The time after which the brain begins preparing for sleep.' },
    { word: 'producing', partOfSpeech: 'verb', simpleDefinition: 'Making or creating something.', contextMeaning: 'Making melatonin in the brain after it becomes dark.' },
    { word: 'bedtime', partOfSpeech: 'noun', simpleDefinition: 'The time when someone usually goes to sleep.', contextMeaning: 'The time before which doctors advise switching off bright screens.' },
  ],
  'a2-eco-public-bike-sharing': [
    { word: 'last-mile problem', partOfSpeech: 'noun phrase', simpleDefinition: 'The difficulty of reaching the final place after a longer trip.', contextMeaning: 'The short distance between a train or bus stop and someone’s destination.' },
    { word: 'bike lane', partOfSpeech: 'noun phrase', simpleDefinition: 'A part of a road set aside for bicycles.', contextMeaning: 'A marked route that lets commuters ride to work.' },
    { word: 'placed', partOfSpeech: 'verb', simpleDefinition: 'Put in a particular position.', contextMeaning: 'Set outside busy buildings so people can find and borrow bicycles.' },
    { word: 'street space', partOfSpeech: 'noun phrase', simpleDefinition: 'Area on a street available for people or vehicles.', contextMeaning: 'Road and parking area that bike sharing uses less of than private cars.' },
  ],
  'a2-ast-mars-rovers': [
    { word: 'neighbour', partOfSpeech: 'noun', simpleDefinition: 'A person or place that is near another.', contextMeaning: 'Mars is one of the planets closest to Earth.' },
    { word: 'real time', partOfSpeech: 'noun phrase', simpleDefinition: 'The same moment that an event is happening.', contextMeaning: 'Immediate control of a rover, which signal delays prevent.' },
    { word: 'drilling', partOfSpeech: 'verb', simpleDefinition: 'Making a hole with a tool or machine.', contextMeaning: 'Making holes in Martian rocks so the rover can examine them.' },
    { word: 'discovery', partOfSpeech: 'noun', simpleDefinition: 'Something found or learned for the first time.', contextMeaning: 'The finding that some minerals formed in liquid water.' },
  ],
  'a2-arc-green-rooftops': [
    { word: 'absorb', partOfSpeech: 'verb', simpleDefinition: 'To take in heat, light, or liquid.', contextMeaning: 'Dark roofs take in the sun’s heat and become very warm.' },
    { word: 'uncomfortable', partOfSpeech: 'adjective', simpleDefinition: 'Not pleasant or easy to be in.', contextMeaning: 'Too hot for people to feel at ease on the top floors.' },
    { word: 'shade', partOfSpeech: 'verb', simpleDefinition: 'To block direct light from something.', contextMeaning: 'The rooftop plants cover the roof from strong summer sun.' },
    { word: 'air conditioners', partOfSpeech: 'noun', simpleDefinition: 'Machines that cool the air inside a room or building.', contextMeaning: 'Devices that work harder because dark city roofs absorb heat.' },
  ],
  'a2-sci-vertical-farming': [
    { word: 'harvest', partOfSpeech: 'noun', simpleDefinition: 'The plants or food collected from a farm.', contextMeaning: 'The crop that can be lost when frost or drought damages a farm.' },
    { word: 'trays', partOfSpeech: 'noun', simpleDefinition: 'Flat, shallow containers used to hold things.', contextMeaning: 'Containers that hold plants on the farm’s shelves.' },
    { word: 'leaves', partOfSpeech: 'noun', simpleDefinition: 'The flat green parts that grow on a plant.', contextMeaning: 'The parts of the lettuce that receive light from the lamps.' },
    { word: 'reused', partOfSpeech: 'verb', simpleDefinition: 'Used again instead of being thrown away.', contextMeaning: 'Water not drunk by the roots is collected and used again.' },
  ],  'b1-sci-sodium-batteries': [
    { word: 'depend on', partOfSpeech: 'phrasal verb', simpleDefinition: 'To need or be affected by something.', contextMeaning: 'The amount of electricity made by solar and wind power changes with the weather.' },
    { word: 'balance supply and demand', partOfSpeech: 'verb phrase', simpleDefinition: 'To make the amount available match the amount people need.', contextMeaning: 'The grid must store daytime power because homes need more electricity in the evening.' },
    { word: 'power grids', partOfSpeech: 'noun phrase', simpleDefinition: 'Networks that carry electricity from where it is made to users.', contextMeaning: 'The systems that need large batteries to move energy from day to night.' },
    { word: 'sodium atoms', partOfSpeech: 'noun phrase', simpleDefinition: 'The smallest units of the element sodium.', contextMeaning: 'These units are larger and heavier than lithium atoms, so the battery stores less energy for its weight.' },
    { word: 'mine', partOfSpeech: 'verb', simpleDefinition: 'To take valuable material from the ground.', contextMeaning: 'Getting lithium out of the earth is costly.' },
    { word: 'chemically similar', partOfSpeech: 'adjective phrase', simpleDefinition: 'Having nearly the same chemical properties.', contextMeaning: 'Sodium behaves much like lithium in a battery.' },
    { word: 'extra weight', partOfSpeech: 'noun phrase', simpleDefinition: 'Additional heaviness compared with something else.', contextMeaning: 'The added heaviness of a sodium battery matters less in a fixed battery building than in a phone.' },
    { word: 'overheating', partOfSpeech: 'noun', simpleDefinition: 'Becoming hotter than is safe or normal.', contextMeaning: 'A battery safety problem that sodium batteries are less likely to have.' },
  ],
  'b1-env-beaver-wetlands': [
    { word: 'river basins', partOfSpeech: 'noun phrase', simpleDefinition: 'Areas of land whose water flows into the same river.', contextMeaning: 'Regions where beavers had disappeared after being hunted.' },
    { word: 'narrow channels', partOfSpeech: 'noun phrase', simpleDefinition: 'Small, confined paths through which water flows.', contextMeaning: 'The tight stream paths that carried soil away before dams returned.' },
    { word: 'fertile soil', partOfSpeech: 'noun phrase', simpleDefinition: 'Earth that is rich enough to help plants grow.', contextMeaning: 'Good soil washed away by the fast streams.' },
    { word: 'front teeth', partOfSpeech: 'noun phrase', simpleDefinition: 'The teeth at the front of the mouth.', contextMeaning: 'The strong teeth beavers use to cut small trees.' },
    { word: 'leaky', partOfSpeech: 'adjective', simpleDefinition: 'Allowing some liquid to pass through a hole or gap.', contextMeaning: 'The branch-and-mud barrier slows water without stopping it completely.' },
    { word: 'hold back', partOfSpeech: 'phrasal verb', simpleDefinition: 'To keep something from moving forward.', contextMeaning: 'The ponds store rainwater and slow its movement downstream.' },
    { word: 'flash floods', partOfSpeech: 'noun phrase', simpleDefinition: 'Sudden floods that happen quickly after heavy rain.', contextMeaning: 'Fast floods that the beaver ponds help protect towns from.' },
    { word: 'firebreaks', partOfSpeech: 'noun', simpleDefinition: 'Open or damp areas that slow or stop a fire.', contextMeaning: 'Wet ground near the ponds that can slow wildfires.' },
  ],
  'b1-psy-spacing-effect': [
    { word: 'spaced practice', partOfSpeech: 'noun phrase', simpleDefinition: 'Learning by studying the same material at separate times.', contextMeaning: 'The study method that replaces one long cramming session with shorter sessions across days.' },
    { word: 'nonsense syllables', partOfSpeech: 'noun phrase', simpleDefinition: 'Short groups of sounds that do not make real words.', contextMeaning: 'The meaningless sound groups Ebbinghaus memorized to study memory.' },
    { word: 'forgetting curve', partOfSpeech: 'noun phrase', simpleDefinition: 'A pattern showing how memory fades over time.', contextMeaning: 'The pattern showing how much people forget when they do not review new information.' },
    { word: 'review', partOfSpeech: 'verb', simpleDefinition: 'To study or look at something again.', contextMeaning: 'To revisit learned information so it is less likely to disappear from memory.' },
    { word: 'long-term memory', partOfSpeech: 'noun phrase', simpleDefinition: 'Memory that keeps information for a long time.', contextMeaning: 'The lasting memory strengthened by studying on separate days.' },
    { word: 'identical', partOfSpeech: 'adjective', simpleDefinition: 'Exactly the same in every way.', contextMeaning: 'The total study time is the same even though it is divided across different days.' },
    { word: 'connections', partOfSpeech: 'noun', simpleDefinition: 'Links between things or ideas.', contextMeaning: 'Links between brain cells that become stronger with repeated recall.' },
    { word: 'locks knowledge into', partOfSpeech: 'verb phrase', simpleDefinition: 'Makes information stay firmly in memory.', contextMeaning: 'The effort of recalling answers helps knowledge remain available.' },
  ],
  'b1-his-rosetta-stone': [
    { word: 'symbols', partOfSpeech: 'noun', simpleDefinition: 'Pictures or signs that represent an idea, sound, or thing.', contextMeaning: 'The carved pictures used in ancient Egyptian writing.' },
    { word: 'script', partOfSpeech: 'noun', simpleDefinition: 'A system of written signs used by a language.', contextMeaning: 'The ancient writing system that people stopped being able to read.' },
    { word: 'represented', partOfSpeech: 'verb', simpleDefinition: 'Stood for or showed the meaning of something.', contextMeaning: 'Scholars wrongly thought each hieroglyph picture meant a whole idea.' },
    { word: 'uncovered', partOfSpeech: 'verb', simpleDefinition: 'Found something that was hidden or covered.', contextMeaning: 'Soldiers found the stone while repairing an old fort.' },
    { word: 'royal names', partOfSpeech: 'noun phrase', simpleDefinition: 'The names of kings, queens, or other royal people.', contextMeaning: 'Names such as Ptolemy and Cleopatra that Champollion matched to their hieroglyphic forms.' },
    { word: 'compared', partOfSpeech: 'verb', simpleDefinition: 'Looked at two or more things to find similarities or differences.', contextMeaning: 'Champollion matched Greek names with their forms in hieroglyphic text.' },
    { word: 'cartouches', partOfSpeech: 'noun', simpleDefinition: 'Oval frames around the names of important people in ancient Egyptian writing.', contextMeaning: 'The oval rings around royal names in the hieroglyphic text.' },
    { word: 'written history', partOfSpeech: 'noun phrase', simpleDefinition: 'The events of the past recorded in writing.', contextMeaning: 'The records of ancient Egypt that became readable after the script was understood.' },
  ],
  'b1-edu-peer-teaching': [
    { word: 'explain', partOfSpeech: 'verb', simpleDefinition: 'To make an idea clear to someone.', contextMeaning: 'To describe a chapter clearly enough that another student can understand it.' },
    { word: 'written test', partOfSpeech: 'noun phrase', simpleDefinition: 'An exam answered by writing.', contextMeaning: 'The task one group expected after reading the science passage.' },
    { word: 'prepared to teach', partOfSpeech: 'verb phrase', simpleDefinition: 'Got ready to help another person learn.', contextMeaning: 'The students who expected to explain the passage to a younger learner.' },
    { word: 'comprehension test', partOfSpeech: 'noun phrase', simpleDefinition: 'A test of how well someone understands what they read or hear.', contextMeaning: 'The surprise exam used to check understanding of the science passage.' },
    { word: 'memorize', partOfSpeech: 'verb', simpleDefinition: 'To learn something so you can remember it exactly.', contextMeaning: 'To learn separate definitions without understanding their connections.' },
    { word: 'fit together', partOfSpeech: 'phrasal verb', simpleDefinition: 'To form a connected or complete whole.', contextMeaning: 'How the ideas in a topic relate to each other.' },
    { word: 'organize', partOfSpeech: 'verb', simpleDefinition: 'To put things in a clear order.', contextMeaning: 'To arrange lesson information into a sequence that is easy to teach.' },
    { word: 'aloud', partOfSpeech: 'adverb', simpleDefinition: 'Using a voice that can be heard.', contextMeaning: 'Speaking the explanation instead of keeping it only in one’s thoughts.' },
  ],
  'b1-bio-octopus-camouflage': [
    { word: 'hard shell', partOfSpeech: 'noun phrase', simpleDefinition: 'A firm outer covering that protects an animal.', contextMeaning: 'The kind of body protection an octopus does not have.' },
    { word: 'spines', partOfSpeech: 'noun', simpleDefinition: 'Sharp, thin points on an animal or plant.', contextMeaning: 'Another physical defence that an octopus lacks.' },
    { word: 'protect', partOfSpeech: 'verb', simpleDefinition: 'To keep someone or something safe from harm.', contextMeaning: 'The octopus lacks a shell, so its colour and skin texture help keep it safe from predators.' },
    { word: 'chromatophores', partOfSpeech: 'noun', simpleDefinition: 'Tiny skin sacs that contain colour in some animals.', contextMeaning: 'Small pigment-filled sacs that let the octopus change its visible colour.' },
    { word: 'dye', partOfSpeech: 'noun', simpleDefinition: 'A substance used to give colour to something.', contextMeaning: 'The red, yellow, or brown pigment inside each small skin sac.' },
    { word: 'electrical signal', partOfSpeech: 'noun phrase', simpleDefinition: 'A message carried by electricity.', contextMeaning: 'A message from the octopus’s brain that makes the small muscles tighten.' },
    { word: 'relax', partOfSpeech: 'verb', simpleDefinition: 'To become loose or less tight.', contextMeaning: 'The muscles loosen so the pigment sac becomes smaller.' },
    { word: 'reflect', partOfSpeech: 'verb', simpleDefinition: 'To send light or sound back from a surface.', contextMeaning: 'The deeper skin layers return blue, green, and white light from the water.' },
  ],
  'b1-hea-antibiotic-stewardship': [
    { word: 'incorrectly', partOfSpeech: 'adverb', simpleDefinition: 'In a way that is wrong or not suitable.', contextMeaning: 'Using antibiotics when they are not needed or in the wrong way.' },
    { word: 'single-celled', partOfSpeech: 'adjective', simpleDefinition: 'Made of only one cell.', contextMeaning: 'The structure of bacteria, which can reproduce on their own.' },
    { word: 'reproducing', partOfSpeech: 'verb', simpleDefinition: 'Making more of the same kind of living thing.', contextMeaning: 'The process antibiotics can stop bacteria from carrying out.' },
    { word: 'cell walls', partOfSpeech: 'noun phrase', simpleDefinition: 'Firm outer layers that surround some cells.', contextMeaning: 'The protective parts of bacteria that certain antibiotics damage.' },
    { word: 'zero effect', partOfSpeech: 'noun phrase', simpleDefinition: 'No result or change at all.', contextMeaning: 'Antibiotics do not work against viruses because viruses lack cell walls.' },
    { word: 'surviving', partOfSpeech: 'adjective', simpleDefinition: 'Still alive after danger or treatment.', contextMeaning: 'Bacteria that remain after the medicine has killed weaker bacteria.' },
    { word: 'resistance genes', partOfSpeech: 'noun phrase', simpleDefinition: 'Pieces of genetic information that help germs withstand medicine.', contextMeaning: 'Genes that allow bacteria to survive antibiotics and pass that ability on.' },
    { word: 'superbugs', partOfSpeech: 'noun', simpleDefinition: 'Germs that resist medicines that once killed them.', contextMeaning: 'Bacteria that standard antibiotics can no longer treat.' },
  ],
  'b1-eco-circular-repair': [
    { word: 'stopped working', partOfSpeech: 'verb phrase', simpleDefinition: 'No longer operated as it should.', contextMeaning: 'A household device had broken and needed a repair.' },
    { word: 'replacement battery', partOfSpeech: 'noun phrase', simpleDefinition: 'A new battery used instead of an old one.', contextMeaning: 'A spare battery that can cost almost as much as a new device.' },
    { word: 'throwaway model', partOfSpeech: 'noun phrase', simpleDefinition: 'A way of making or using things that encourages replacing them instead of repairing them.', contextMeaning: 'A system that pushes consumers to buy new electronics when old ones break.' },
    { word: 'electronic waste', partOfSpeech: 'noun phrase', simpleDefinition: 'Old or unwanted electrical devices and their parts.', contextMeaning: 'Discarded products that contain materials such as copper, gold, and plastic.' },
    { word: 'repair manuals', partOfSpeech: 'noun phrase', simpleDefinition: 'Instructions that explain how to fix a product.', contextMeaning: 'Guides that manufacturers often do not provide to repair workers.' },
    { word: 'ordinary tools', partOfSpeech: 'noun phrase', simpleDefinition: 'Common tools that many people already have.', contextMeaning: 'Basic equipment that laws require to be enough to open appliances.' },
    { word: 'durable goods', partOfSpeech: 'noun phrase', simpleDefinition: 'Products made to last a long time.', contextMeaning: 'Appliances shoppers can choose because labels show how easy they are to repair.' },
    { word: 'repairability score', partOfSpeech: 'noun phrase', simpleDefinition: 'A rating showing how easy a product is to repair.', contextMeaning: 'Information on a label that helps shoppers choose easier-to-fix devices.' },
  ],
  'b1-ast-exoplanet-transits': [
    { word: 'solar systems', partOfSpeech: 'noun phrase', simpleDefinition: 'Stars and the planets and other objects that move around them.', contextMeaning: 'Systems around other stars that astronomers want to find.' },
    { word: 'photograph', partOfSpeech: 'verb', simpleDefinition: 'To make a picture using a camera.', contextMeaning: 'To capture a direct image of an exoplanet, which is very difficult.' },
    { word: 'parent star', partOfSpeech: 'noun phrase', simpleDefinition: 'The star that a planet moves around.', contextMeaning: 'The bright star whose light hides the planet’s faint reflection.' },
    { word: 'transit method', partOfSpeech: 'noun phrase', simpleDefinition: 'A way to find a planet by watching it pass in front of its star.', contextMeaning: 'The indirect technique used by space telescopes to detect exoplanets.' },
    { word: 'line up', partOfSpeech: 'phrasal verb', simpleDefinition: 'To be arranged in the same direction.', contextMeaning: 'The planet’s path must align with Earth so it crosses in front of its star.' },
    { word: 'blocks', partOfSpeech: 'verb', simpleDefinition: 'Stops light or something else from passing through.', contextMeaning: 'The planet covers a small part of its star’s light during a transit.' },
    { word: 'dims', partOfSpeech: 'verb', simpleDefinition: 'Becomes less bright.', contextMeaning: 'The star appears slightly less bright while the planet passes in front.' },
    { word: 'repeats', partOfSpeech: 'verb', simpleDefinition: 'Happens again in the same way.', contextMeaning: 'The small dip in brightness returns each time the planet completes an orbit.' },
  ],
  'b1-arc-daylighting-schools': [
    { word: 'sealed boxes', partOfSpeech: 'noun phrase', simpleDefinition: 'Closed spaces with little connection to the outside.', contextMeaning: 'Buildings designed to keep sunlight out and use electric lights instead.' },
    { word: 'eye strain', partOfSpeech: 'noun phrase', simpleDefinition: 'Tired or uncomfortable eyes after using them for a long time.', contextMeaning: 'A problem caused by working under unchanging artificial light.' },
    { word: 'glare', partOfSpeech: 'noun', simpleDefinition: 'A very bright, uncomfortable light.', contextMeaning: 'Sunlight on screens that makes it difficult to see.' },
    { word: 'reflective panels', partOfSpeech: 'noun phrase', simpleDefinition: 'Flat surfaces that send light back.', contextMeaning: 'Light shelves that bounce sunlight toward the ceiling.' },
    { word: 'incoming sunlight', partOfSpeech: 'noun phrase', simpleDefinition: 'Sunlight that is entering a place.', contextMeaning: 'The light redirected by the shelves instead of shining straight onto desks.' },
    { word: 'bounces off', partOfSpeech: 'phrasal verb', simpleDefinition: 'Hits a surface and moves away in another direction.', contextMeaning: 'The sunlight reflects from the shelf onto the ceiling.' },
    { word: 'light shelves', partOfSpeech: 'noun phrase', simpleDefinition: 'Horizontal panels that reflect sunlight into a building.', contextMeaning: 'Panels above the windows that redirect incoming light onto the ceiling.' },
    { word: 'electricity use', partOfSpeech: 'noun phrase', simpleDefinition: 'The amount of electrical power that is used.', contextMeaning: 'The power needed for lights in classrooms during the day.' },
  ],
  'b1-sci-geothermal-heating': [
    { word: 'volcanic rock', partOfSpeech: 'noun phrase', simpleDefinition: 'Rock formed from cooled material from a volcano.', contextMeaning: 'The rock engineers drill through to reach hot water and steam.' },
    { word: 'pulling apart', partOfSpeech: 'verb phrase', simpleDefinition: 'Moving away from each other.', contextMeaning: 'The slow movement of the two large plates beneath Iceland.' },
    { word: 'magma', partOfSpeech: 'noun', simpleDefinition: 'Very hot melted rock beneath the Earth’s surface.', contextMeaning: 'The underground heat source close to the surface beneath Iceland.' },
    { word: 'seeps', partOfSpeech: 'verb', simpleDefinition: 'Moves slowly through small holes or spaces.', contextMeaning: 'Rainwater gradually moves deep into the ground.' },
    { word: 'drill', partOfSpeech: 'verb', simpleDefinition: 'Make a deep hole using a special tool or machine.', contextMeaning: 'Engineers make wells through volcanic rock to reach hot water and steam.' },
    { word: 'wells', partOfSpeech: 'noun', simpleDefinition: 'Deep holes in the ground used to reach water or other resources.', contextMeaning: 'The holes engineers use to bring underground heat to the surface.' },
    { word: 'leftover', partOfSpeech: 'adjective', simpleDefinition: 'Remaining after the main part has been used.', contextMeaning: 'Hot water left after steam has turned the turbines.' },
    { word: 'greenhouses', partOfSpeech: 'noun', simpleDefinition: 'Buildings with glass walls and roofs for growing plants.', contextMeaning: 'Warm structures where farmers grow vegetables despite the cold climate.' },
  ],  'b2-sci-bioluminescence-tech': [
    { word: 'species', partOfSpeech: 'noun', simpleDefinition: 'Groups of living things that can produce young of the same kind.', contextMeaning: 'Different kinds of animals that can make their own light.' },
    { word: 'incandescent', partOfSpeech: 'adjective', simpleDefinition: 'Giving off light because it is very hot.', contextMeaning: 'A traditional bulb makes light by heating a metal wire.' },
    { word: 'chemical reaction', partOfSpeech: 'noun phrase', simpleDefinition: 'A process in which substances change and may produce new substances.', contextMeaning: 'The process glowing organisms use to release light energy.' },
    { word: 'luciferin', partOfSpeech: 'noun', simpleDefinition: 'A substance that produces light in some living things.', contextMeaning: 'The light-producing compound that reacts with oxygen in glowing species.' },
    { word: 'enzyme', partOfSpeech: 'noun', simpleDefinition: 'A substance in living things that helps a chemical process happen.', contextMeaning: 'Luciferase helps luciferin react and produce light.' },
    { word: 'oxygen', partOfSpeech: 'noun', simpleDefinition: 'A gas in the air that people and many animals need to live.', contextMeaning: 'A substance that joins the light-producing reaction.' },
    { word: 'chemical bond', partOfSpeech: 'noun phrase', simpleDefinition: 'A connection that holds atoms together in a substance.', contextMeaning: 'The connection that changes as luciferin and oxygen react.' },
    { word: 'visible photons', partOfSpeech: 'noun phrase', simpleDefinition: 'Tiny units of light that human eyes can see.', contextMeaning: 'The form in which most of the reaction’s released energy appears.' },
    { word: 'thermal waste', partOfSpeech: 'noun phrase', simpleDefinition: 'Energy lost as unwanted heat.', contextMeaning: 'Very little heat is lost when the organisms create light.' },
    { word: 'glowing proteins', partOfSpeech: 'noun phrase', simpleDefinition: 'Proteins that give off light or can be made to glow.', contextMeaning: 'Proteins that researchers use as visible tags inside living tissue.' },
    { word: 'tissue', partOfSpeech: 'noun', simpleDefinition: 'A group of living cells that work together in the body.', contextMeaning: 'The living material where researchers can observe tagged cells.' },
    { word: 'immune cells', partOfSpeech: 'noun phrase', simpleDefinition: 'Body cells that help defend against illness.', contextMeaning: 'Tagged cells researchers watch as they move toward bacteria.' },
  ],
  'b2-env-permafrost-peatlands': [
    { word: 'carbon dioxide', partOfSpeech: 'noun', simpleDefinition: 'A gas released by breathing and burning fuel, and used by plants.', contextMeaning: 'The greenhouse gas absorbed by forests and stored in peatlands.' },
    { word: 'ecosystem', partOfSpeech: 'noun', simpleDefinition: 'A community of living things and the place where they live.', contextMeaning: 'The peatland environment that stores large amounts of carbon.' },
    { word: 'sphagnum moss', partOfSpeech: 'noun phrase', simpleDefinition: 'A kind of soft moss that grows in wet places.', contextMeaning: 'The moss that forms thick carpets across peatland wetlands.' },
    { word: 'oxygen-poor', partOfSpeech: 'adjective', simpleDefinition: 'Containing very little oxygen.', contextMeaning: 'The water conditions that prevent microbes from fully breaking down plant matter.' },
    { word: 'microbes', partOfSpeech: 'noun', simpleDefinition: 'Extremely small living things, such as some bacteria.', contextMeaning: 'Tiny soil organisms that normally break down dead plants.' },
    { word: 'break down', partOfSpeech: 'phrasal verb', simpleDefinition: 'To change something into smaller or simpler parts.', contextMeaning: 'The process microbes cannot complete in the oxygen-poor bog.' },
    { word: 'plant matter', partOfSpeech: 'noun phrase', simpleDefinition: 'Material that comes from plants.', contextMeaning: 'Dead moss that settles on the bog and gradually becomes peat.' },
    { word: 'biomass', partOfSpeech: 'noun', simpleDefinition: 'The total amount of living material in an area.', contextMeaning: 'The combined plant material in all the world’s forests.' },
    { word: 'drained', partOfSpeech: 'verb', simpleDefinition: 'Had water removed from it.', contextMeaning: 'Peatland was dried to make pasture or collect peat.' },
    { word: 'oxidize', partOfSpeech: 'verb', simpleDefinition: 'To react with oxygen in a way that changes a substance.', contextMeaning: 'Dry peat carbon reacts with air and is released after microbes awaken.' },
    { word: 'conservationists', partOfSpeech: 'noun', simpleDefinition: 'People who work to protect nature and natural resources.', contextMeaning: 'People restoring bogs by blocking their old drainage channels.' },
    { word: 'submerged', partOfSpeech: 'adjective', simpleDefinition: 'Kept completely under water.', contextMeaning: 'The carbon is kept beneath water so it does not escape into the air.' },
  ],
  'b2-psy-cognitive-offloading': [
    { word: 'transferring', partOfSpeech: 'verb', simpleDefinition: 'Moving something from one place or person to another.', contextMeaning: 'Moving a mental task to a tool so the mind can focus on other thoughts.' },
    { word: 'working memory', partOfSpeech: 'noun phrase', simpleDefinition: 'The part of memory used to hold information for a short time while thinking.', contextMeaning: 'The mental space freed when a phone, list, or calculator handles a task.' },
    { word: 'mental effort', partOfSpeech: 'noun phrase', simpleDefinition: 'The thinking energy needed to do something.', contextMeaning: 'The attention people used to spend finding their way before GPS.' },
    { word: 'unfamiliar', partOfSpeech: 'adjective', simpleDefinition: 'Not known or experienced before.', contextMeaning: 'A city where a traveller has not been and must learn the route.' },
    { word: 'continuously', partOfSpeech: 'adverb', simpleDefinition: 'Without stopping or with only very short breaks.', contextMeaning: 'Updating the internal map while moving through a city.' },
    { word: 'neuroimaging', partOfSpeech: 'noun', simpleDefinition: 'Methods that create pictures of the brain.', contextMeaning: 'Brain studies showing which areas support spatial reasoning.' },
    { word: 'hippocampus', partOfSpeech: 'noun', simpleDefinition: 'A brain area important for memory and navigation.', contextMeaning: 'The brain structure linked to spatial reasoning and long-term memory.' },
    { word: 'licensed', partOfSpeech: 'adjective', simpleDefinition: 'Having official permission to do something.', contextMeaning: 'The London taxi drivers were formally allowed to drive taxis.' },
    { word: 'significantly larger', partOfSpeech: 'adjective phrase', simpleDefinition: 'Noticeably bigger by an important amount.', contextMeaning: 'The experienced drivers’ rear hippocampus measured bigger than the public’s.' },
    { word: 'obeyed', partOfSpeech: 'verb', simpleDefinition: 'Did what someone or something told them to do.', contextMeaning: 'Participants followed GPS directions instead of finding the route themselves.' },
    { word: 'sketch', partOfSpeech: 'verb', simpleDefinition: 'To draw something quickly and simply.', contextMeaning: 'To draw the route they had just travelled through a virtual neighbourhood.' },
    { word: 'internal navigation system', partOfSpeech: 'noun phrase', simpleDefinition: 'The brain’s way of working out where you are and where to go.', contextMeaning: 'The brain ability that GPS may change when people stop navigating for themselves.' },
  ],
  'b2-his-lidar-maya-cities': [
    { word: 'archaeologists', partOfSpeech: 'noun', simpleDefinition: 'People who study past societies by examining objects and places they left behind.', contextMeaning: 'Researchers searching the rainforest for remains of ancient Maya cities.' },
    { word: 'remote-sensing', partOfSpeech: 'noun', simpleDefinition: 'Collecting information about a place from a distance.', contextMeaning: 'The method LiDAR uses to map ground from an aircraft.' },
    { word: 'laser pulses', partOfSpeech: 'noun phrase', simpleDefinition: 'Very short bursts of focused light.', contextMeaning: 'The light LiDAR sends toward the ground to measure the landscape.' },
    { word: 'bounce off', partOfSpeech: 'phrasal verb', simpleDefinition: 'Hit a surface and return in another direction.', contextMeaning: 'Most laser beams reflect back after hitting the upper leaves.' },
    { word: 'fraction of a second', partOfSpeech: 'noun phrase', simpleDefinition: 'A very small part of one second.', contextMeaning: 'The brief time a laser pulse takes to return to the aircraft.' },
    { word: 'three-dimensional map', partOfSpeech: 'noun phrase', simpleDefinition: 'A map showing height, width, and depth.', contextMeaning: 'A detailed computer image of the uncovered ground surface.' },
    { word: 'house mounds', partOfSpeech: 'noun phrase', simpleDefinition: 'Raised areas of earth that mark where houses once stood.', contextMeaning: 'Remains of many previously unknown Maya homes beneath the trees.' },
    { word: 'defensive walls', partOfSpeech: 'noun phrase', simpleDefinition: 'Strong barriers built to protect a place from attack.', contextMeaning: 'Structures that the LiDAR maps found around ancient Maya areas.' },
    { word: 'terraced hillsides', partOfSpeech: 'noun phrase', simpleDefinition: 'Slopes changed into a series of flat steps for building or farming.', contextMeaning: 'Engineered hillsides that formed part of the Maya landscape.' },
    { word: 'settlements', partOfSpeech: 'noun', simpleDefinition: 'Places where people establish homes and communities.', contextMeaning: 'The towns that historians once thought were small and scattered.' },
    { word: 'metropolitan landscapes', partOfSpeech: 'noun phrase', simpleDefinition: 'Large connected urban areas with many people and buildings.', contextMeaning: 'The extensive Maya city regions revealed by the new maps.' },
    { word: 'agricultural engineering', partOfSpeech: 'noun phrase', simpleDefinition: 'Methods designed to improve how land is used to grow food.', contextMeaning: 'The water and farming systems that supported Maya cities.' },
  ],
  'b2-edu-productive-failure': [
    { word: 'direct instruction', partOfSpeech: 'noun phrase', simpleDefinition: 'A teaching method where the teacher explains a topic before practice.', contextMeaning: 'The usual order in which a formula is taught before students solve problems.' },
    { word: 'sequence', partOfSpeech: 'noun', simpleDefinition: 'An order in which things happen one after another.', contextMeaning: 'The order of teaching and practice that Kapur changes.' },
    { word: 'routine exercises', partOfSpeech: 'noun phrase', simpleDefinition: 'Regular practice tasks that follow a familiar pattern.', contextMeaning: 'Similar problems that students solve after a rule has been shown.' },
    { word: 'real-world data problem', partOfSpeech: 'noun phrase', simpleDefinition: 'A problem based on information from a practical situation.', contextMeaning: 'The challenging task students try before learning the standard formula.' },
    { word: 'invent', partOfSpeech: 'verb', simpleDefinition: 'To create something new or original.', contextMeaning: 'Students create their own ways to solve the problem.' },
    { word: 'focused struggle', partOfSpeech: 'noun phrase', simpleDefinition: 'A period of serious effort spent trying to solve a difficult problem.', contextMeaning: 'The time students spend attempting the task before the teacher explains the formula.' },
    { word: 'invented attempts', partOfSpeech: 'noun phrase', simpleDefinition: 'Solutions or methods that people create for themselves.', contextMeaning: 'The students’ own solution ideas that the teacher compares before showing the standard formula.' },
    { word: 'end-of-term assessments', partOfSpeech: 'noun phrase', simpleDefinition: 'Tests given near the end of a school or study period.', contextMeaning: 'The exams where productive-failure students later perform better.' },
    { word: 'applying', partOfSpeech: 'verb', simpleDefinition: 'Using knowledge in a particular situation.', contextMeaning: 'Using the learned idea to solve a new kind of problem.' },
    { word: 'standard formula', partOfSpeech: 'noun phrase', simpleDefinition: 'A commonly accepted rule used to solve a type of problem.', contextMeaning: 'The mathematical rule students learn after trying their own solutions.' },
    { word: 'recognize', partOfSpeech: 'verb', simpleDefinition: 'To identify or understand something because it is familiar.', contextMeaning: 'Students see why each part of the formula is needed.' },
    { word: 'meaningless', partOfSpeech: 'adjective', simpleDefinition: 'Having no clear sense or importance.', contextMeaning: 'A rule that students memorize without understanding its purpose.' },
  ],
  'b2-bio-mycorrhizal-networks': [
    { word: 'independent', partOfSpeech: 'adjective', simpleDefinition: 'Not needing or depending on others.', contextMeaning: 'The first impression that each forest tree grows separately from its neighbours.' },
    { word: 'competing', partOfSpeech: 'verb', simpleDefinition: 'Trying to get the same limited thing as someone else.', contextMeaning: 'Trees appear to struggle against nearby trees for light and space.' },
    { word: 'partnership', partOfSpeech: 'noun', simpleDefinition: 'A relationship where two sides work together.', contextMeaning: 'The connection between plant roots and fungi beneath the soil.' },
    { word: 'mycelium', partOfSpeech: 'noun', simpleDefinition: 'The network of fine threads that forms most of a fungus.', contextMeaning: 'The fungal threads that link the roots of many plants.' },
    { word: 'photosynthesis', partOfSpeech: 'noun', simpleDefinition: 'The process plants use to make food from light, water, and air.', contextMeaning: 'The process that lets trees make sugars in their leaves.' },
    { word: 'phosphorus', partOfSpeech: 'noun', simpleDefinition: 'A natural element that living things need to grow.', contextMeaning: 'A mineral the fungal threads take from the soil for the trees.' },
    { word: 'sunlit', partOfSpeech: 'adjective', simpleDefinition: 'Receiving light from the sun.', contextMeaning: 'The leaves where trees produce sugars.' },
    { word: 'mineral nutrients', partOfSpeech: 'noun phrase', simpleDefinition: 'Natural substances in soil that help living things grow.', contextMeaning: 'Useful materials that fungi gather from the soil for plants.' },
    { word: 'in return', partOfSpeech: 'phrase', simpleDefinition: 'As a response or exchange for something received.', contextMeaning: 'The fungus gives trees minerals after receiving sugars from them.' },
    { word: 'carbon sugars', partOfSpeech: 'noun phrase', simpleDefinition: 'Sugars containing carbon that plants make and use for energy.', contextMeaning: 'Food from the tree that is shared with the fungus.' },
    { word: 'isotope-tracing', partOfSpeech: 'noun', simpleDefinition: 'A way to follow substances by marking special forms of their atoms.', contextMeaning: 'The method used to track material moving through the fungal network.' },
    { word: 'fungal threads', partOfSpeech: 'noun phrase', simpleDefinition: 'Very thin strands that form much of a fungus.', contextMeaning: 'The strands that connect tree roots and carry minerals through the forest network.' },
  ],
  'b2-hea-wastewater-epidemiology': [
    { word: 'clinical testing', partOfSpeech: 'noun phrase', simpleDefinition: 'Medical tests given to people to find out whether they are ill.', contextMeaning: 'The usual way health authorities count patients with a virus.' },
    { word: 'symptoms', partOfSpeech: 'noun', simpleDefinition: 'Changes in the body that show someone may be ill.', contextMeaning: 'Signs that appear before patients visit a doctor for a test.' },
    { word: 'infected', partOfSpeech: 'adjective', simpleDefinition: 'Having a disease-causing organism inside the body.', contextMeaning: 'People carrying the virus, including some who have only mild signs.' },
    { word: 'treatment plant', partOfSpeech: 'noun phrase', simpleDefinition: 'A facility that cleans used water or waste.', contextMeaning: 'The central place where wastewater from many buildings arrives.' },
    { word: 'untreated', partOfSpeech: 'adjective', simpleDefinition: 'Not yet cleaned or processed.', contextMeaning: 'Wastewater collected before it is cleaned at the plant.' },
    { word: 'concentration', partOfSpeech: 'noun', simpleDefinition: 'The amount of a substance in a particular space or mixture.', contextMeaning: 'The quantity of viral genetic material in the wastewater sample.' },
    { word: 'population', partOfSpeech: 'noun', simpleDefinition: 'All the people or animals living in a particular area.', contextMeaning: 'The whole city whose virus levels can be estimated from one sample.' },
    { word: 'unbiased', partOfSpeech: 'adjective', simpleDefinition: 'Not unfairly favoring one side or group.', contextMeaning: 'The measure includes people whether or not they visit a clinic.' },
    { word: 'spreading', partOfSpeech: 'verb', simpleDefinition: 'Moving from one person or place to others.', contextMeaning: 'A virus is moving through more people in the city.' },
    { word: 'alert', partOfSpeech: 'verb', simpleDefinition: 'To tell someone about possible danger or a problem.', contextMeaning: 'Health departments can warn clinics when wastewater levels rise.' },
    { word: 'vaccination campaigns', partOfSpeech: 'noun phrase', simpleDefinition: 'Organized efforts to give vaccines to many people.', contextMeaning: 'Health programs targeted at neighbourhoods where an outbreak is beginning.' },
    { word: 'precisely', partOfSpeech: 'adverb', simpleDefinition: 'In an exact or carefully chosen way.', contextMeaning: 'Targeting the areas where the outbreak is starting.' },
  ],
  'b2-eco-congestion-pricing': [
    { word: 'widening', partOfSpeech: 'verb', simpleDefinition: 'Making something broader.', contextMeaning: 'Making highways broader to try to reduce traffic.' },
    { word: 'induced demand', partOfSpeech: 'noun phrase', simpleDefinition: 'Extra use that appears when something becomes easier or cheaper to use.', contextMeaning: 'More people drive after a city adds road space, so traffic returns.' },
    { word: 'rush hour', partOfSpeech: 'noun', simpleDefinition: 'The busy times when many people travel to and from work.', contextMeaning: 'The weekday periods when the city charges drivers to enter the centre.' },
    { word: 'free-for-all', partOfSpeech: 'noun', simpleDefinition: 'A situation without rules or limits.', contextMeaning: 'Road use with no price or control during the busiest times.' },
    { word: 'overhead cameras', partOfSpeech: 'noun phrase', simpleDefinition: 'Cameras mounted above an area.', contextMeaning: 'Devices that read car licence plates to charge drivers automatically.' },
    { word: 'central business district', partOfSpeech: 'noun phrase', simpleDefinition: 'The main city area with many offices and shops.', contextMeaning: 'The part of the city drivers pay to enter during busy hours.' },
    { word: 'trial', partOfSpeech: 'noun', simpleDefinition: 'A test of something before deciding whether to continue it.', contextMeaning: 'The seven-month period used to see how Stockholm’s fee worked.' },
    { word: 'price signal', partOfSpeech: 'noun phrase', simpleDefinition: 'A price that encourages people to change their choices.', contextMeaning: 'The small fee that persuades some drivers to choose other travel times or transport.' },
    { word: 'optional', partOfSpeech: 'adjective', simpleDefinition: 'Not required; a person can choose whether to do it.', contextMeaning: 'Shopping trips or commutes that drivers could make by another method.' },
    { word: 'toll', partOfSpeech: 'noun', simpleDefinition: 'A fee paid to use a road or cross a bridge.', contextMeaning: 'Money collected from drivers and used to support faster bus trips.' },
    { word: 'public opinion', partOfSpeech: 'noun phrase', simpleDefinition: 'What most people think about an issue.', contextMeaning: 'Residents’ views changed after they experienced the benefits of the fee.' },
    { word: 'permanent', partOfSpeech: 'adjective', simpleDefinition: 'Continuing for a long time without being removed.', contextMeaning: 'The system stayed in place after voters supported it.' },
  ],
  'b2-ast-orbital-debris': [
    { word: 'artificial satellite', partOfSpeech: 'noun phrase', simpleDefinition: 'A human-made object sent into space to orbit a planet.', contextMeaning: 'The first human-made object placed in Earth orbit in 1957.' },
    { word: 'low Earth orbit', partOfSpeech: 'noun phrase', simpleDefinition: 'The region of space relatively close to Earth where many satellites travel.', contextMeaning: 'The area where many working satellites and pieces of space junk circle.' },
    { word: 'fragments', partOfSpeech: 'noun', simpleDefinition: 'Small pieces broken off from something larger.', contextMeaning: 'Bits of metal and paint left by years of space launches.' },
    { word: 'hyper-velocities', partOfSpeech: 'noun', simpleDefinition: 'Extremely high speeds.', contextMeaning: 'The speeds of objects in low Earth orbit.' },
    { word: 'space junk', partOfSpeech: 'noun phrase', simpleDefinition: 'Old human-made objects and pieces left in orbit around Earth.', contextMeaning: 'The abandoned satellites, rocket parts, and fragments that create danger in orbit.' },
    { word: 'density', partOfSpeech: 'noun', simpleDefinition: 'The amount of something in a particular space.', contextMeaning: 'How many objects are crowded into a specific orbit.' },
    { word: 'shrapnel', partOfSpeech: 'noun', simpleDefinition: 'Small sharp pieces thrown out when something explodes or breaks.', contextMeaning: 'Fragments created when satellites collide.' },
    { word: 'chain reaction', partOfSpeech: 'noun phrase', simpleDefinition: 'A series of events where each one causes the next.', contextMeaning: 'One collision creates debris that can cause more collisions.' },
    { word: 'worst-case scenario', partOfSpeech: 'noun phrase', simpleDefinition: 'The most serious possible result.', contextMeaning: 'The feared future in which many satellite collisions create more debris.' },
    { word: 'track', partOfSpeech: 'verb', simpleDefinition: 'To follow the position or movement of something.', contextMeaning: 'Space agencies monitor the locations of large pieces of debris.' },
    { word: 'rocket stages', partOfSpeech: 'noun phrase', simpleDefinition: 'Sections of a rocket that are used and then separated during launch.', contextMeaning: 'Used rocket parts left in orbit after carrying a satellite into space.' },
    { word: 'burn up', partOfSpeech: 'phrasal verb', simpleDefinition: 'To be destroyed by heat while burning.', contextMeaning: 'Satellites are designed to burn harmlessly in the atmosphere at the end of their use.' },
  ],
  'b2-arc-mass-timber': [
    { word: 'reinforced concrete', partOfSpeech: 'noun phrase', simpleDefinition: 'Concrete strengthened with metal bars or mesh.', contextMeaning: 'A common strong material used with steel in city buildings.' },
    { word: 'low-carbon alternative', partOfSpeech: 'noun phrase', simpleDefinition: 'A choice that releases less carbon dioxide than the usual option.', contextMeaning: 'Wood proposed as a way to lower emissions from tall buildings.' },
    { word: 'cross-laminated timber', partOfSpeech: 'noun phrase', simpleDefinition: 'Wood made by pressing layers of boards together in different directions.', contextMeaning: 'The engineered wood used to build the new towers.' },
    { word: 'kiln-dried', partOfSpeech: 'adjective', simpleDefinition: 'Dried in a heated chamber to remove moisture.', contextMeaning: 'The boards are dried before being pressed into strong panels.' },
    { word: 'alternating', partOfSpeech: 'adjective', simpleDefinition: 'Arranged so different things take turns in a repeated order.', contextMeaning: 'The wood layers run in different directions one after another.' },
    { word: 'hydraulic presses', partOfSpeech: 'noun phrase', simpleDefinition: 'Machines that use liquid pressure to press or shape materials.', contextMeaning: 'The equipment that bonds the timber layers into panels.' },
    { word: 'carbon vault', partOfSpeech: 'noun phrase', simpleDefinition: 'A place that stores carbon for a long time.', contextMeaning: 'The building keeps carbon in its wood walls and floors as it stands.' },
    { word: 'craned into place', partOfSpeech: 'verb phrase', simpleDefinition: 'Lifted and moved into position by a crane.', contextMeaning: 'Factory-cut panels can be installed quickly at the construction site.' },
    { word: 'counterintuitively', partOfSpeech: 'adverb', simpleDefinition: 'In a way that seems opposite to what people expect.', contextMeaning: 'The fire tests show thick wood beams can behave more predictably than steel.' },
    { word: 'beam', partOfSpeech: 'noun', simpleDefinition: 'A long, strong piece that supports part of a building.', contextMeaning: 'The thick timber structure that carries the building’s load during a fire.' },
    { word: 'load', partOfSpeech: 'noun', simpleDefinition: 'The weight or force that a structure must support.', contextMeaning: 'The weight held by the beam while its outer wood burns.' },
    { word: 'soften', partOfSpeech: 'verb', simpleDefinition: 'To become less hard or firm.', contextMeaning: 'Bare steel can lose strength in the fire after becoming hot.' },
  ],
  'b2-sci-acoustic-ecology': [
    { word: 'field surveys', partOfSpeech: 'noun phrase', simpleDefinition: 'Studies carried out in the natural place being examined.', contextMeaning: 'Biologists’ traditional method of counting animals in forests and oceans.' },
    { word: 'camera traps', partOfSpeech: 'noun phrase', simpleDefinition: 'Cameras that take pictures when an animal moves nearby.', contextMeaning: 'Devices used to photograph animals that pass in front of them.' },
    { word: 'blind spots', partOfSpeech: 'noun phrase', simpleDefinition: 'Areas or things that cannot be seen or noticed.', contextMeaning: 'Animals and places that cameras fail to record.' },
    { word: 'discipline', partOfSpeech: 'noun', simpleDefinition: 'A subject or area of study.', contextMeaning: 'Bioacoustics is the scientific study of sound in nature.' },
    { word: 'soundscape', partOfSpeech: 'noun', simpleDefinition: 'All the sounds heard in a particular place.', contextMeaning: 'The complete mix of sounds recorded throughout a forest.' },
    { word: 'continuously', partOfSpeech: 'adverb', simpleDefinition: 'Without stopping or with very short breaks.', contextMeaning: 'The recorders capture forest sounds for months at a time.' },
    { word: 'frequency band', partOfSpeech: 'noun phrase', simpleDefinition: 'A range of sound pitches or wave rates.', contextMeaning: 'A separate part of the sound range used by different species.' },
    { word: 'amphibians', partOfSpeech: 'noun', simpleDefinition: 'Animals such as frogs that can live in water and on land.', contextMeaning: 'Animals that call in the quiet spaces between insect and bird sounds.' },
    { word: 'climate stress', partOfSpeech: 'noun phrase', simpleDefinition: 'Harmful pressure on living things caused by climate conditions.', contextMeaning: 'A change that can damage a forest and create gaps in its sound pattern.' },
    { word: 'pattern-recognition algorithms', partOfSpeech: 'noun phrase', simpleDefinition: 'Computer instructions that find repeated features in information.', contextMeaning: 'Software that searches long recordings for animal calls or chainsaws.' },
    { word: 'spectrograms', partOfSpeech: 'noun', simpleDefinition: 'Pictures showing how sound frequencies change over time.', contextMeaning: 'Visual graphs the algorithms examine to find calls in recordings.' },
    { word: 'alerting', partOfSpeech: 'verb', simpleDefinition: 'Warning someone so they know about a problem.', contextMeaning: 'The system warns park rangers when it detects chainsaws.' },
  ],  'c1-01-neuromorphic-computing': [
    { word: 'digital computation', partOfSpeech: 'noun phrase', simpleDefinition: 'The use of electronic systems to process information.', contextMeaning: 'Computer processing based on the long-established von Neumann design.' },
    { word: 'architectural separation', partOfSpeech: 'noun phrase', simpleDefinition: 'A design that keeps two system parts apart.', contextMeaning: 'The design keeps a computer’s processor and memory in separate units.' },
    { word: 'central processing unit', partOfSpeech: 'noun phrase', simpleDefinition: 'The main part of a computer that carries out instructions.', contextMeaning: 'The computer component separated from random-access memory.' },
    { word: 'random-access memory', partOfSpeech: 'noun phrase', simpleDefinition: 'Short-term computer memory that can be quickly read or changed.', contextMeaning: 'The memory unit that sends data across a bus to the processor.' },
    { word: 'shuttling operands', partOfSpeech: 'verb phrase', simpleDefinition: 'Moving the numbers or values used in calculations back and forth.', contextMeaning: 'Repeatedly moving calculation data between the processor and memory.' },
    { word: 'physical bus', partOfSpeech: 'noun phrase', simpleDefinition: 'A set of connections that carries data between computer parts.', contextMeaning: 'The connection data travels across between memory and the processor.' },
    { word: 'data-intensive', partOfSpeech: 'adjective', simpleDefinition: 'Using or processing a very large amount of data.', contextMeaning: 'The artificial-intelligence tasks that make data transfer especially costly.' },
    { word: 'synapses', partOfSpeech: 'noun', simpleDefinition: 'Connections through which nerve cells pass signals.', contextMeaning: 'Artificial connections in neuromorphic chips that sit beside memory and processing.' },
    { word: 'threshold event', partOfSpeech: 'noun phrase', simpleDefinition: 'An event that happens when a value reaches a set level.', contextMeaning: 'The signal that must occur before a silicon neuron uses power.' },
    { word: 'backpropagation', partOfSpeech: 'noun', simpleDefinition: 'A method that trains a neural network by sending errors backward through it.', contextMeaning: 'The common deep-learning procedure that depends on continuous gradients.' },
    { word: 'continuous gradients', partOfSpeech: 'noun phrase', simpleDefinition: 'Smoothly changing values that show how to adjust a model.', contextMeaning: 'The kind of information standard algorithms use but spike trains do not provide.' },
    { word: 'discrete', partOfSpeech: 'adjective', simpleDefinition: 'Separate and countable rather than continuous.', contextMeaning: 'The distinct spikes used by neuromorphic chips.' },
    { word: 'non-differentiable', partOfSpeech: 'adjective', simpleDefinition: 'Not having a smooth rate of change that can be calculated.', contextMeaning: 'A property of spike trains that makes standard gradient methods unsuitable.' },
    { word: 'spike trains', partOfSpeech: 'noun phrase', simpleDefinition: 'Series of brief electrical signals from nerve cells.', contextMeaning: 'The separate signals neuromorphic systems use to represent information.' },
    { word: 'compilation toolchains', partOfSpeech: 'noun phrase', simpleDefinition: 'Connected software tools that turn instructions into a form a machine can run.', contextMeaning: 'The software researchers need to map algorithms onto neuromorphic chips.' },
    { word: 'computational graphs', partOfSpeech: 'noun phrase', simpleDefinition: 'Diagrams or structures showing the operations in a calculation.', contextMeaning: 'The algorithms researchers want to transfer to spiking hardware.' },
  ],
  'c1-02-paleoclimate-proxies': [
    { word: 'instrumental records', partOfSpeech: 'noun phrase', simpleDefinition: 'Measurements collected using scientific instruments.', contextMeaning: 'Direct temperature measurements available for only a short part of Earth’s history.' },
    { word: 'chemical signatures', partOfSpeech: 'noun phrase', simpleDefinition: 'Chemical patterns that give information about how something formed.', contextMeaning: 'Evidence preserved in sediments that helps scientists reconstruct past environments.' },
    { word: 'biogenic sediments', partOfSpeech: 'noun phrase', simpleDefinition: 'Layers of material formed from the remains of living things.', contextMeaning: 'Ocean deposits that preserve chemical signs from past climates.' },
    { word: 'mineralization', partOfSpeech: 'noun', simpleDefinition: 'The process in which minerals form or become part of a material.', contextMeaning: 'The time when marine organisms incorporate oxygen isotopes into shells.' },
    { word: 'benthic foraminifera', partOfSpeech: 'noun phrase', simpleDefinition: 'Tiny single-celled organisms that live on the sea floor.', contextMeaning: 'Marine organisms whose carbonate shells preserve ancient climate information.' },
    { word: 'marine protists', partOfSpeech: 'noun phrase', simpleDefinition: 'Simple organisms with cells that live in the sea.', contextMeaning: 'The single-celled life forms that build the shells examined by scientists.' },
    { word: 'abyssal seafloor', partOfSpeech: 'noun phrase', simpleDefinition: 'The very deep floor of the ocean.', contextMeaning: 'The deep ocean habitat where the foraminifera live.' },
    { word: 'thermodynamic fractionation', partOfSpeech: 'noun phrase', simpleDefinition: 'A temperature-related process that separates forms of an element.', contextMeaning: 'The process that makes colder water favor oxygen-18 in the shells.' },
    { word: 'hydrological cycle', partOfSpeech: 'noun phrase', simpleDefinition: 'The movement of water between the air, land, and oceans.', contextMeaning: 'The system from which ice sheets remove light oxygen-16.' },
    { word: 'continental ice sheets', partOfSpeech: 'noun phrase', simpleDefinition: 'Very large, thick areas of ice covering land.', contextMeaning: 'The ice that stores light oxygen and changes the isotope pattern in seawater.' },
    { word: 'enrichment', partOfSpeech: 'noun', simpleDefinition: 'An increase in the amount of a particular substance.', contextMeaning: 'A higher proportion of oxygen-18 found in marine sediment.' },
    { word: 'pore-water percolation', partOfSpeech: 'noun phrase', simpleDefinition: 'The slow movement of water through tiny spaces in material.', contextMeaning: 'Water passing through old sediment and altering its chemical record.' },
    { word: 'burial pressure', partOfSpeech: 'noun phrase', simpleDefinition: 'Pressure created when layers of material build up above something.', contextMeaning: 'The force that can change delicate shell material over millions of years.' },
    { word: 'recrystallization', partOfSpeech: 'noun', simpleDefinition: 'The forming of a substance into new crystals.', contextMeaning: 'A change that can overwrite the original chemical signal in ancient shells.' },
    { word: 'trace-element ratios', partOfSpeech: 'noun phrase', simpleDefinition: 'Comparisons between tiny amounts of different elements.', contextMeaning: 'Independent chemical measurements paired with oxygen-isotope analysis.' },
    { word: 'clumped-isotope thermometry', partOfSpeech: 'noun phrase', simpleDefinition: 'A temperature method based on how isotopes group together in minerals.', contextMeaning: 'A second independent technique used to estimate ancient temperatures.' },
  ],
  'c1-03-predictive-processing-cognition': [
    { word: 'cerebral cortex', partOfSpeech: 'noun phrase', simpleDefinition: 'The outer layer of the brain involved in thought and perception.', contextMeaning: 'The brain area once described as a passive receiver of sensory information.' },
    { word: 'feed-forward', partOfSpeech: 'adjective', simpleDefinition: 'Moving information onward without using later results to change earlier steps.', contextMeaning: 'The older account had signals travel upward from receptors through the brain.' },
    { word: 'sensory receptors', partOfSpeech: 'noun phrase', simpleDefinition: 'Cells or structures that detect things such as light, sound, or touch.', contextMeaning: 'The parts that first turn outside events into signals for the brain.' },
    { word: 'neural impulses', partOfSpeech: 'noun phrase', simpleDefinition: 'Electrical messages that travel through nerve cells.', contextMeaning: 'Signals carrying information from the senses toward the brain.' },
    { word: 'hierarchy', partOfSpeech: 'noun', simpleDefinition: 'A system arranged in levels, from lower to higher.', contextMeaning: 'The series of brain levels through which sensory signals were thought to rise.' },
    { word: 'feature detectors', partOfSpeech: 'noun phrase', simpleDefinition: 'Systems that identify particular parts or patterns in information.', contextMeaning: 'Brain processes that were thought to build a representation from sensory signals.' },
    { word: 'bottom-up', partOfSpeech: 'adjective', simpleDefinition: 'Starting with basic details and building toward a larger understanding.', contextMeaning: 'The older model in which perception began with sensory data.' },
    { word: 'active inference engine', partOfSpeech: 'noun phrase', simpleDefinition: 'A system that actively predicts and interprets information.', contextMeaning: 'The newer view of the brain as generating expectations before sensory input arrives.' },
    { word: 'prediction error', partOfSpeech: 'noun phrase', simpleDefinition: 'The difference between what was expected and what actually happened.', contextMeaning: 'A mismatch that makes the brain revise its internal model.' },
    { word: 'ascending pathways', partOfSpeech: 'noun phrase', simpleDefinition: 'Routes that carry signals toward higher levels.', contextMeaning: 'Brain routes that send only the difference between prediction and experience.' },
    { word: 'generative model', partOfSpeech: 'noun phrase', simpleDefinition: 'An internal system that predicts how information may be produced.', contextMeaning: 'The brain’s model of the environment that it updates after surprising input.' },
    { word: 'precision weighting', partOfSpeech: 'noun phrase', simpleDefinition: 'Giving more influence to information judged to be more reliable.', contextMeaning: 'The brain’s adjustment of how much to trust a sensory signal.' },
    { word: 'sensory channel', partOfSpeech: 'noun phrase', simpleDefinition: 'A route by which information from one sense reaches the brain.', contextMeaning: 'Vision is treated as less reliable in fog than in bright conditions.' },
    { word: 'prior beliefs', partOfSpeech: 'noun phrase', simpleDefinition: 'Ideas someone already accepts before receiving new information.', contextMeaning: 'Expectations that guide perception when sensory information is weak.' },
    { word: 'random neural noise', partOfSpeech: 'noun phrase', simpleDefinition: 'Unpredictable activity in the brain that is not a meaningful signal.', contextMeaning: 'Irregular brain activity that may be wrongly treated as reliable information.' },
    { word: 'perceptual hallucinations', partOfSpeech: 'noun phrase', simpleDefinition: 'Experiences of seeing or hearing things that are not present.', contextMeaning: 'Clinical experiences that may relate to overly rigid expectations or misread signals.' },
  ],
  'c1-04-bronze-age-collapse-systems': [
    { word: 'Eastern Mediterranean', partOfSpeech: 'noun phrase', simpleDefinition: 'The eastern part of the sea between Europe, Asia, and Africa.', contextMeaning: 'The region containing the connected Bronze Age kingdoms and city-states.' },
    { word: 'geopolitical networks', partOfSpeech: 'noun phrase', simpleDefinition: 'Connections between political powers across a region.', contextMeaning: 'The relationships linking Greece, Anatolia, Egypt, and the Levant.' },
    { word: 'dynastic marriages', partOfSpeech: 'noun phrase', simpleDefinition: 'Marriages between ruling families used to strengthen political ties.', contextMeaning: 'A way the ancient kingdoms connected their royal families.' },
    { word: 'maritime trade', partOfSpeech: 'noun phrase', simpleDefinition: 'Buying and selling goods by sea.', contextMeaning: 'The exchange that moved copper and tin across the region.' },
    { word: 'near-synchronous collapse', partOfSpeech: 'noun phrase', simpleDefinition: 'A breakdown that happens at almost the same time in several places.', contextMeaning: 'The rapid fall of palace-based societies across the Eastern Mediterranean.' },
    { word: 'literacy', partOfSpeech: 'noun', simpleDefinition: 'The ability to read and write.', contextMeaning: 'A skill that disappeared for centuries in some regions after the collapse.' },
    { word: 'culprit', partOfSpeech: 'noun', simpleDefinition: 'A person or cause blamed for a problem.', contextMeaning: 'The single cause earlier historians searched for to explain the collapse.' },
    { word: 'tectonic', partOfSpeech: 'adjective', simpleDefinition: 'Related to the large plates that form the Earth’s outer layer.', contextMeaning: 'The earthquakes proposed as a possible cause of the ancient crisis.' },
    { word: 'palynological cores', partOfSpeech: 'noun phrase', simpleDefinition: 'Samples of layered material studied for ancient pollen.', contextMeaning: 'Evidence from lake or coastal deposits that helps reconstruct past drought.' },
    { word: 'speleothems', partOfSpeech: 'noun', simpleDefinition: 'Mineral formations that grow in caves, such as stalagmites.', contextMeaning: 'Cave records that preserve oxygen-isotope evidence about past climates.' },
    { word: 'agrarian surplus', partOfSpeech: 'noun phrase', simpleDefinition: 'More farmed food than people need for immediate use.', contextMeaning: 'The extra food that supported the palace systems and their workers.' },
    { word: 'redistributive', partOfSpeech: 'adjective', simpleDefinition: 'Involving the collection and later sharing of resources.', contextMeaning: 'The palace system depended on collecting and allocating food and goods.' },
    { word: 'hyper-specialization', partOfSpeech: 'noun', simpleDefinition: 'An extremely narrow division of work or production.', contextMeaning: 'A system where societies depended on highly specific roles and trade.' },
    { word: 'tight coupling', partOfSpeech: 'noun phrase', simpleDefinition: 'A strong connection where a change in one part quickly affects another.', contextMeaning: 'The close links that allowed a local disruption to spread through the network.' },
    { word: 'requisitioned', partOfSpeech: 'verb', simpleDefinition: 'Officially collected or demanded for use.', contextMeaning: 'Palace administrations gathered grain, textiles, and metal supplies.' },
    { word: 'mutually reinforcing shocks', partOfSpeech: 'noun phrase', simpleDefinition: 'Difficult events that make one another worse.', contextMeaning: 'Several crises combined and overwhelmed the kingdoms’ ability to respond.' },
  ],
  'c1-05-epistemic-cognition-education': [
    { word: 'cognitive load theory', partOfSpeech: 'noun phrase', simpleDefinition: 'A theory about how the limits of working memory affect learning.', contextMeaning: 'The framework explaining why too much new information can overwhelm beginners.' },
    { word: 'capacity', partOfSpeech: 'noun', simpleDefinition: 'The amount that something can hold or manage.', contextMeaning: 'The limited amount of information working memory can process at once.' },
    { word: 'unorganized information', partOfSpeech: 'noun phrase', simpleDefinition: 'Information that has not yet been arranged into a clear structure.', contextMeaning: 'New material that can overwhelm a beginner’s limited working memory.' },
    { word: 'mental schemas', partOfSpeech: 'noun phrase', simpleDefinition: 'Organized groups of knowledge stored in the mind.', contextMeaning: 'Structures that help experienced learners understand new information.' },
    { word: 'cognitive overload', partOfSpeech: 'noun phrase', simpleDefinition: 'A state where the mind has more information to handle than it can manage.', contextMeaning: 'The result when unguided tasks use up a beginner’s working memory.' },
    { word: 'bandwidth', partOfSpeech: 'noun', simpleDefinition: 'The amount of ability available for a task.', contextMeaning: 'The small amount of thinking capacity left for learning a schema.' },
    { word: 'schema acquisition', partOfSpeech: 'noun phrase', simpleDefinition: 'The process of building organized knowledge in the mind.', contextMeaning: 'The learning that is reduced when working memory is busy with unproductive searching.' },
    { word: 'explicit', partOfSpeech: 'adjective', simpleDefinition: 'Stated or shown clearly and directly.', contextMeaning: 'Examples that directly demonstrate how to solve a task.' },
    { word: 'worked examples', partOfSpeech: 'noun phrase', simpleDefinition: 'Examples that show each step of a solution.', contextMeaning: 'Guided demonstrations that help novices learn a new skill.' },
    { word: 'unguided discovery', partOfSpeech: 'noun phrase', simpleDefinition: 'Learning by exploring without direct help or instruction.', contextMeaning: 'An open task that may overload beginners who lack background knowledge.' },
    { word: 'pedagogical supports', partOfSpeech: 'noun phrase', simpleDefinition: 'Teaching methods or materials that help learners.', contextMeaning: 'Step-by-step explanations that can help novices but later become unnecessary.' },
    { word: 'domain proficiency', partOfSpeech: 'noun phrase', simpleDefinition: 'A high level of skill in a particular subject.', contextMeaning: 'The expertise learners gain as their knowledge becomes organized.' },
    { word: 'automated', partOfSpeech: 'adjective', simpleDefinition: 'Done with little conscious effort after practice.', contextMeaning: 'Complex procedures that an expert has stored as familiar mental schemas.' },
    { word: 'cross-referencing', partOfSpeech: 'verb', simpleDefinition: 'Checking one source or idea against another.', contextMeaning: 'Comparing the learner’s internal schema with the teacher’s step-by-step explanation.' },
    { word: 'evaluativist stance', partOfSpeech: 'noun phrase', simpleDefinition: 'A view that knowledge claims should be judged using evidence and context.', contextMeaning: 'The advanced approach of weighing theories instead of treating them as fixed facts.' },
    { word: 'methodological rigor', partOfSpeech: 'noun phrase', simpleDefinition: 'Care and strictness in how a study or investigation is carried out.', contextMeaning: 'One standard used to compare competing academic claims.' },
  ],  'c1-06-eusociality-inclusive-fitness': [
    { word: 'sterile worker castes', partOfSpeech: 'noun phrase', simpleDefinition: 'Groups of workers in a species that cannot reproduce.', contextMeaning: 'The social insects that raised a challenge for Darwin’s account of natural selection.' },
    { word: 'differential reproductive success', partOfSpeech: 'noun phrase', simpleDefinition: 'Differences in how many surviving offspring individuals produce.', contextMeaning: 'The process through which natural selection favors some traits.' },
    { word: 'self-sacrifice', partOfSpeech: 'noun', simpleDefinition: 'Giving up one’s own benefit or safety to help others.', contextMeaning: 'The worker’s behaviour that may support the survival of the colony.' },
    { word: 'analytical lens', partOfSpeech: 'noun phrase', simpleDefinition: 'A particular way of examining or thinking about an issue.', contextMeaning: 'Hamilton’s shift from studying individuals to examining genes.' },
    { word: 'allele', partOfSpeech: 'noun', simpleDefinition: 'One form of a gene.', contextMeaning: 'A gene form that may spread when it encourages behaviour helping relatives.' },
    { word: 'reproductive cost', partOfSpeech: 'noun phrase', simpleDefinition: 'A loss in the ability to produce offspring.', contextMeaning: 'The reproductive disadvantage to an individual showing altruistic behaviour.' },
    { word: 'actor', partOfSpeech: 'noun', simpleDefinition: 'The person or organism that performs an action.', contextMeaning: 'The individual whose reproductive cost is compared with relatives’ benefit.' },
    { word: 'reproductive benefit', partOfSpeech: 'noun phrase', simpleDefinition: 'An increase in the chance of producing offspring.', contextMeaning: 'The advantage relatives gain from the altruistic behaviour.' },
    { word: 'coefficient of genetic relatedness', partOfSpeech: 'noun phrase', simpleDefinition: 'A measure of how much genetic material two individuals share.', contextMeaning: 'The value used to account for how closely an actor is related to the beneficiaries.' },
    { word: 'hymenopteran insects', partOfSpeech: 'noun phrase', simpleDefinition: 'Insects such as ants, bees, and wasps.', contextMeaning: 'The group that includes species with haplodiploidy.' },
    { word: 'unfertilized', partOfSpeech: 'adjective', simpleDefinition: 'Not joined with a male reproductive cell.', contextMeaning: 'The type of egg from which male ants, bees, and wasps develop.' },
    { word: 'haploid', partOfSpeech: 'adjective', simpleDefinition: 'Having one set of chromosomes.', contextMeaning: 'The chromosome state of males in the described genetic system.' },
    { word: 'fertilized', partOfSpeech: 'adjective', simpleDefinition: 'Joined with a male reproductive cell.', contextMeaning: 'The type of egg from which female ants, bees, and wasps develop.' },
    { word: 'diploid', partOfSpeech: 'adjective', simpleDefinition: 'Having two sets of chromosomes.', contextMeaning: 'The chromosome state of females and of several other eusocial species.' },
    { word: 'parental monogamy', partOfSpeech: 'noun phrase', simpleDefinition: 'A long-term pair relationship between parents who raise offspring together.', contextMeaning: 'One ecological condition that can help a lineage develop obligate social living.' },
    { word: 'ecological pressures', partOfSpeech: 'noun phrase', simpleDefinition: 'Conditions in an environment that affect survival.', contextMeaning: 'Environmental forces that can work with genetic relatedness to support social living.' },
  ],
  'c1-07-antimicrobial-market-failure': [
    { word: 'multidrug-resistant pathogens', partOfSpeech: 'noun phrase', simpleDefinition: 'Disease-causing organisms that can survive several medicines.', contextMeaning: 'Germs threatening modern medical care because many drugs no longer kill them.' },
    { word: 'clinical medicine', partOfSpeech: 'noun phrase', simpleDefinition: 'The practice of preventing and treating illness in patients.', contextMeaning: 'The field threatened by bacteria that resist current drugs.' },
    { word: 'neonatal care', partOfSpeech: 'noun phrase', simpleDefinition: 'Medical care for newborn babies.', contextMeaning: 'One area of medicine put at risk by resistant pathogens.' },
    { word: 'lose efficacy', partOfSpeech: 'verb phrase', simpleDefinition: 'Become less able to produce the intended result.', contextMeaning: 'Existing antimicrobial drugs are becoming less effective.' },
    { word: 'horizontal gene transfer', partOfSpeech: 'noun phrase', simpleDefinition: 'The movement of genetic material between organisms of the same generation.', contextMeaning: 'A way bacteria can gain genes that help them resist medicines.' },
    { word: 'selective evolutionary pressure', partOfSpeech: 'noun phrase', simpleDefinition: 'A condition that favors organisms with a particular useful trait.', contextMeaning: 'The pressure that allows resistant pathogens to survive and spread.' },
    { word: 'pharmaceutical pipeline', partOfSpeech: 'noun phrase', simpleDefinition: 'The series of medicines a company is developing and testing.', contextMeaning: 'The flow of potential new antibiotics that has become very small.' },
    { word: 'mechanisms of action', partOfSpeech: 'noun phrase', simpleDefinition: 'The ways a drug or process produces its effect.', contextMeaning: 'How potential new antibiotics work against infections.' },
    { word: 'biotechnology firms', partOfSpeech: 'noun phrase', simpleDefinition: 'Companies that use biology to develop products or medicines.', contextMeaning: 'Businesses leaving antibiotic research because it is difficult to earn money from it.' },
    { word: 'commercial revenue', partOfSpeech: 'noun phrase', simpleDefinition: 'Money a business earns from selling goods or services.', contextMeaning: 'Income that usually rises when more patients use a successful medicine.' },
    { word: 'prescription volume', partOfSpeech: 'noun phrase', simpleDefinition: 'The number of times a medicine is prescribed.', contextMeaning: 'The measure that normally drives drug-company income.' },
    { word: 'first-line therapy', partOfSpeech: 'noun phrase', simpleDefinition: 'The first treatment usually chosen for a condition.', contextMeaning: 'A drug given broadly to patients when it is the preferred treatment.' },
    { word: 'regulatory approval', partOfSpeech: 'noun phrase', simpleDefinition: 'Official permission for a medicine to be sold or used.', contextMeaning: 'The decision that allows a new antibiotic to enter clinical use.' },
    { word: 'treatment of last resort', partOfSpeech: 'noun phrase', simpleDefinition: 'A treatment used only when other options have failed.', contextMeaning: 'The restricted role for a new antibiotic that must be protected from overuse.' },
    { word: 'volume-based reimbursement', partOfSpeech: 'noun phrase', simpleDefinition: 'Payment that depends on how many units of a product are sold or used.', contextMeaning: 'A payment system that leaves antibiotic developers with little income when use is limited.' },
    { word: 'annual retainer', partOfSpeech: 'noun phrase', simpleDefinition: 'A fixed payment made each year to keep a service available.', contextMeaning: 'The subscription payment that gives health systems access without rewarding high prescription numbers.' },
  ],
  'c1-08-agglomeration-baumol-disease': [
    { word: 'death of distance', partOfSpeech: 'noun phrase', simpleDefinition: 'The idea that communication technology makes location unimportant.', contextMeaning: 'The prediction that broadband would remove the value of living in cities.' },
    { word: 'broadband connectivity', partOfSpeech: 'noun phrase', simpleDefinition: 'Fast internet access that connects people and devices.', contextMeaning: 'The technology expected to let knowledge workers move away from cities.' },
    { word: 'urban density', partOfSpeech: 'noun phrase', simpleDefinition: 'The number of people and activities in a given city area.', contextMeaning: 'The close concentration of workers and firms that the internet was expected to make unnecessary.' },
    { word: 'spatial concentration', partOfSpeech: 'noun phrase', simpleDefinition: 'The gathering of people or activity in particular places.', contextMeaning: 'Innovation and investment gathered in a small number of large cities.' },
    { word: 'innovation', partOfSpeech: 'noun', simpleDefinition: 'A new idea, method, or product.', contextMeaning: 'New knowledge and products concentrated in metropolitan regions.' },
    { word: 'capital', partOfSpeech: 'noun', simpleDefinition: 'Money or other resources used to create economic value.', contextMeaning: 'Investment resources gathered in a few major cities.' },
    { word: 'cluster', partOfSpeech: 'verb', simpleDefinition: 'To gather closely together.', contextMeaning: 'Firms and skilled workers locate near one another.' },
    { word: 'proximity', partOfSpeech: 'noun', simpleDefinition: 'The state of being close to something.', contextMeaning: 'Close location lets firms and workers benefit from each other.' },
    { word: 'matching friction', partOfSpeech: 'noun phrase', simpleDefinition: 'Difficulty connecting people with suitable jobs or workers.', contextMeaning: 'A problem thick labor markets reduce by bringing employers and talent together.' },
    { word: 'specialized input providers', partOfSpeech: 'noun phrase', simpleDefinition: 'Suppliers offering particular goods or services needed by businesses.', contextMeaning: 'Companies in a city that serve the needs of similar firms.' },
    { word: 'codified data', partOfSpeech: 'noun phrase', simpleDefinition: 'Information recorded in a clear, organized form.', contextMeaning: 'Knowledge that can be sent easily over digital networks.' },
    { word: 'thick labor markets', partOfSpeech: 'noun phrase', simpleDefinition: 'Job markets with many employers and workers looking for suitable matches.', contextMeaning: 'Dense local job networks that make it easier for firms to find specialized talent.' },
    { word: 'venture risk', partOfSpeech: 'noun phrase', simpleDefinition: 'The possibility of losing money in a new business or investment.', contextMeaning: 'A topic where informal face-to-face knowledge can be valuable.' },
    { word: 'nominal wages', partOfSpeech: 'noun phrase', simpleDefinition: 'Pay measured in money before adjusting for changes in prices.', contextMeaning: 'Local pay rates that rise as high-paying firms compete for workers.' },
    { word: 'labor-intensive', partOfSpeech: 'adjective', simpleDefinition: 'Requiring a large amount of workers’ time.', contextMeaning: 'Services such as teaching and nursing that cannot easily replace people with machines.' },
    { word: 'commercial rents', partOfSpeech: 'noun phrase', simpleDefinition: 'Payments businesses make to use shops, offices, or other property.', contextMeaning: 'City property costs that rise alongside urban wages and put pressure on services.' },
  ],
  'c1-09-exoplanet-biosignatures-disequilibrium': [
    { word: 'spaceborne observatories', partOfSpeech: 'noun phrase', simpleDefinition: 'Scientific instruments or facilities operating in space.', contextMeaning: 'The tools observing planets and their atmospheres from above Earth.' },
    { word: 'cataloging', partOfSpeech: 'verb', simpleDefinition: 'Making an organized list of items.', contextMeaning: 'Recording which planets exist before studying their atmospheres in detail.' },
    { word: 'terrestrial exoplanets', partOfSpeech: 'noun phrase', simpleDefinition: 'Planets outside our solar system that are rocky like Earth.', contextMeaning: 'Distant rocky planets whose atmospheres are being examined.' },
    { word: 'transmission spectroscopy', partOfSpeech: 'noun phrase', simpleDefinition: 'A method that studies starlight passing through a planet’s atmosphere.', contextMeaning: 'The technique used to learn what distant exoplanet atmospheres contain.' },
    { word: 'infer', partOfSpeech: 'verb', simpleDefinition: 'To reach a conclusion from available evidence.', contextMeaning: 'To decide whether distant spectral signals indicate life.' },
    { word: 'extraterrestrial metabolism', partOfSpeech: 'noun phrase', simpleDefinition: 'Chemical processes that support life beyond Earth.', contextMeaning: 'The possible biological activity scientists hope to detect on another planet.' },
    { word: 'spectral absorption bands', partOfSpeech: 'noun phrase', simpleDefinition: 'Parts of a light spectrum where substances absorb light.', contextMeaning: 'Signals used to identify molecules in a faraway atmosphere.' },
    { word: 'molecular species', partOfSpeech: 'noun phrase', simpleDefinition: 'A particular kind of molecule.', contextMeaning: 'One gas or molecule alone rarely provides definite evidence of life.' },
    { word: 'photochemistry', partOfSpeech: 'noun', simpleDefinition: 'Chemical change caused by light.', contextMeaning: 'Atmospheric reactions that can happen without living organisms.' },
    { word: 'reactive gases', partOfSpeech: 'noun phrase', simpleDefinition: 'Gases that readily take part in chemical reactions.', contextMeaning: 'Atmospheric substances that neutralize one another on lifeless planets.' },
    { word: 'neutralize', partOfSpeech: 'verb', simpleDefinition: 'To make something have little or no effect by balancing it.', contextMeaning: 'The gases react until the atmosphere reaches a stable state.' },
    { word: 'equilibrium state', partOfSpeech: 'noun phrase', simpleDefinition: 'A balanced condition where changes largely cancel each other.', contextMeaning: 'The low-energy state an atmosphere reaches when its gases react.' },
    { word: 'reducing gases', partOfSpeech: 'noun phrase', simpleDefinition: 'Gases that can provide electrons in chemical reactions.', contextMeaning: 'Methane is one of the gases that exists alongside oxygen on Earth.' },
    { word: 'persistent presence', partOfSpeech: 'noun phrase', simpleDefinition: 'Continuing to exist over a long period.', contextMeaning: 'Methane remains in Earth’s atmosphere even though it would otherwise react away.' },
    { word: 'robust biosignature', partOfSpeech: 'noun phrase', simpleDefinition: 'A strong and dependable sign that life may be present.', contextMeaning: 'A pair of incompatible gases gives stronger evidence than oxygen alone.' },
    { word: 'ultraviolet flares', partOfSpeech: 'noun phrase', simpleDefinition: 'Sudden bursts of high-energy light from a star.', contextMeaning: 'Radiation from M-dwarf stars that can create oxygen without life.' },
  ],
  'c1-10-embodied-carbon-adaptive-reuse': [
    { word: 'operational carbon', partOfSpeech: 'noun phrase', simpleDefinition: 'Emissions caused by running a building.', contextMeaning: 'Carbon dioxide released by heating, cooling, ventilation, and lighting.' },
    { word: 'greenhouse gas emissions', partOfSpeech: 'noun phrase', simpleDefinition: 'Gases released into the air that trap heat.', contextMeaning: 'The pollution produced while buildings are used and materials are made.' },
    { word: 'lifecycle', partOfSpeech: 'noun', simpleDefinition: 'The full period from creation through use to disposal.', contextMeaning: 'The whole life of a building considered in an environmental assessment.' },
    { word: 'ventilation', partOfSpeech: 'noun', simpleDefinition: 'The movement of fresh air into and out of a building.', contextMeaning: 'One of the building systems that produces operational emissions.' },
    { word: 'grid-scale renewable electricity', partOfSpeech: 'noun phrase', simpleDefinition: 'Clean electricity produced in large amounts for the power network.', contextMeaning: 'A source used by high-performance buildings to reduce operating emissions.' },
    { word: 'operational footprint', partOfSpeech: 'noun phrase', simpleDefinition: 'The environmental impact of running something.', contextMeaning: 'The emissions from building use that modern design has reduced.' },
    { word: 'whole-life carbon declarations', partOfSpeech: 'noun phrase', simpleDefinition: 'Reports of the carbon emissions linked to a building from construction through use and disposal.', contextMeaning: 'The reports building codes require so designers account for material emissions as well as operating emissions.' },
    { word: 'upfront emissions', partOfSpeech: 'noun phrase', simpleDefinition: 'Pollution released at the beginning of a project or product’s life.', contextMeaning: 'Carbon released while construction materials are extracted, made, and moved.' },
    { word: 'extraction', partOfSpeech: 'noun', simpleDefinition: 'The act of taking a material from the ground or another source.', contextMeaning: 'The first stage of producing structural materials that releases carbon.' },
    { word: 'virgin steel', partOfSpeech: 'noun phrase', simpleDefinition: 'New steel made from raw materials rather than recycled steel.', contextMeaning: 'A structural material whose production creates embodied emissions.' },
    { word: 'temporal profiles', partOfSpeech: 'noun phrase', simpleDefinition: 'Patterns that show how something changes over time.', contextMeaning: 'Operational and embodied emissions happen on very different timelines.' },
    { word: 'occupancy', partOfSpeech: 'noun', simpleDefinition: 'The time when people live or work in a building.', contextMeaning: 'The decades over which a building’s operational carbon savings accumulate.' },
    { word: 'irreversible pulse', partOfSpeech: 'noun phrase', simpleDefinition: 'A sudden release that cannot easily be taken back.', contextMeaning: 'Embodied carbon enters the atmosphere before the building is used.' },
    { word: 'carbon debt', partOfSpeech: 'noun phrase', simpleDefinition: 'A quantity of emissions that must be offset or repaid through later savings.', contextMeaning: 'The upfront emissions from new construction that take decades of efficiency gains to balance.' },
    { word: 'break even', partOfSpeech: 'verb phrase', simpleDefinition: 'Reach a point where gains equal costs.', contextMeaning: 'The point when years of energy savings match the emissions from new construction.' },
    { word: 'load-bearing', partOfSpeech: 'adjective', simpleDefinition: 'Supporting the weight of a building or structure.', contextMeaning: 'The concrete cores architects keep when adapting an existing building.' },
  ],  'a1-sci-solar-lamps': [
    { word: 'kerosene', partOfSpeech: 'noun', simpleDefinition: 'A liquid fuel used in lamps and some engines.', contextMeaning: 'The fuel burned in the old lamps used by village families.' },
    { word: 'switch on', partOfSpeech: 'phrasal verb', simpleDefinition: 'To start a light or machine.', contextMeaning: 'Students turn on the solar lamp when evening comes.' },
  ],
  'a1-env-community-compost': [
    { word: 'banana peels', partOfSpeech: 'noun phrase', simpleDefinition: 'The soft outer coverings of bananas.', contextMeaning: 'Food waste that households can throw away or compost.' },
    { word: 'twigs', partOfSpeech: 'noun', simpleDefinition: 'Small, thin branches from a tree or bush.', contextMeaning: 'Small pieces mixed with the food scraps in the compost bin.' },
  ],
  'a1-psy-morning-routines': [
    { word: 'choices', partOfSpeech: 'noun', simpleDefinition: 'Things you decide between.', contextMeaning: 'Small decisions people make when they wake up.' },
    { word: 'habit', partOfSpeech: 'noun', simpleDefinition: 'Something you do often, usually without thinking much.', contextMeaning: 'An action that becomes easy after a person repeats it every day.' },
  ],
  'a1-his-roman-roads': [
    { word: 'network', partOfSpeech: 'noun', simpleDefinition: 'A group of connected roads, people, or things.', contextMeaning: 'Many roads joined together to link Roman cities.' },
    { word: 'distance', partOfSpeech: 'noun', simpleDefinition: 'The space between two places.', contextMeaning: 'How far travellers still had to go to the next town.' },
  ],
  'a1-edu-bilingual-books': [
    { word: 'basic words', partOfSpeech: 'noun phrase', simpleDefinition: 'Simple words used in everyday life.', contextMeaning: 'Common words children hear in daily talk at home.' },
    { word: 'spoken word', partOfSpeech: 'noun phrase', simpleDefinition: 'A word that someone says aloud.', contextMeaning: 'The word the adult says while the child looks at its picture.' },
  ],
  'a1-bio-honeybee-dances': [
    { word: 'waggle dance', partOfSpeech: 'noun phrase', simpleDefinition: 'A bee’s movement that tells other bees where food is.', contextMeaning: 'The special dance a scout bee uses to share the location of flowers.' },
    { word: 'figure-eight shape', partOfSpeech: 'noun phrase', simpleDefinition: 'A shape like the number eight lying on its side.', contextMeaning: 'The path the bee makes when it circles back during the dance.' },
  ],
  'a1-hea-handwashing-science': [
    { word: 'germs', partOfSpeech: 'noun', simpleDefinition: 'Very small living things that can make people ill.', contextMeaning: 'Bacteria and viruses that can stay on hands and objects.' },
    { word: 'plain water', partOfSpeech: 'noun phrase', simpleDefinition: 'Water with nothing added to it.', contextMeaning: 'Water by itself, which does not remove most germs from oily skin.' },
  ],
  'a1-eco-farmers-markets': [
    { word: 'transport companies', partOfSpeech: 'noun phrase', simpleDefinition: 'Businesses that move people or goods from place to place.', contextMeaning: 'Companies that take farmers’ food to warehouses and city shops.' },
    { word: 'payment', partOfSpeech: 'noun', simpleDefinition: 'Money given for something you buy or do.', contextMeaning: 'The money farmers receive when shoppers buy their food.' },
  ],
  'a1-ast-moon-phases': [
    { word: 'full moon', partOfSpeech: 'noun phrase', simpleDefinition: 'The time when the Moon looks like a complete bright circle.', contextMeaning: 'The view seen when the whole side facing Earth is lit by the Sun.' },
    { word: 'rocky ball', partOfSpeech: 'noun phrase', simpleDefinition: 'A round object made of rock.', contextMeaning: 'The Moon’s real shape, which does not change as it appears to change.' },
  ],
  'a1-arc-courtyard-houses': [
    { word: 'turned inward', partOfSpeech: 'verb phrase', simpleDefinition: 'Faced toward the inside rather than the outside.', contextMeaning: 'The houses faced their central courtyard instead of the sunny street.' },
    { word: 'thick walls', partOfSpeech: 'noun phrase', simpleDefinition: 'Walls that are wide from one side to the other.', contextMeaning: 'Heavy walls that help keep hot air and sunlight out of the home.' },
  ],
  'a1-sci-wind-turbines': [
    { word: 'windmills', partOfSpeech: 'noun', simpleDefinition: 'Machines with turning blades that use wind to do work.', contextMeaning: 'Older machines farmers used to pump water and grind wheat.' },
    { word: 'tower', partOfSpeech: 'noun', simpleDefinition: 'A tall, narrow structure.', contextMeaning: 'The high support that raises the turbine blades into stronger winds.' },
  ],};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findSentence(passage: string, word: string): string | null {
  const wordPattern = new RegExp(`\\b${escapeRegExp(word.trim())}\\b`, 'i');
  const sentences = passage.match(/[^.!?]+(?:[.!?]+["')\]]*)?/g) || [];
  return sentences.map((sentence) => sentence.trim()).find((sentence) => wordPattern.test(sentence)) || null;
}

function stableSlug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}


interface CommonVocabularyTerm {
  word: string;
  partOfSpeech: string;
  simpleDefinition: string;
  contextMeaning: string;
  arabicTranslation: string;
}

// A reviewed, offline pool for useful academic words that recur across different lessons.
// Terms are only added when they occur as whole words in the specific paragraph and are not already in the lesson.
const PARAGRAPH_VOCABULARY: CommonVocabularyTerm[] = [
  { word: 'evidence', partOfSpeech: 'noun', simpleDefinition: 'Facts or information that help show whether an idea is true.', contextMeaning: 'Measured findings or observations that support a scientific conclusion.', arabicTranslation: 'دليل / برهان علمي' },
  { word: 'researchers', partOfSpeech: 'noun', simpleDefinition: 'People who study a subject carefully to learn more about it.', contextMeaning: 'Scientists and scholars investigating how the system works in practice.', arabicTranslation: 'باحثون' },
  { word: 'research', partOfSpeech: 'noun', simpleDefinition: 'Careful study to discover or understand something.', contextMeaning: 'Systematic academic investigation and field testing.', arabicTranslation: 'بحث علمي' },
  { word: 'results', partOfSpeech: 'noun', simpleDefinition: 'The things that happen or are found after an action or study.', contextMeaning: 'Measured outcomes gathered from experiments or field trials.', arabicTranslation: 'نتائج' },
  { word: 'method', partOfSpeech: 'noun', simpleDefinition: 'A particular way of doing or studying something.', contextMeaning: 'A structured technique or procedure used to achieve a reliable outcome.', arabicTranslation: 'طريقة / منهج' },
  { word: 'process', partOfSpeech: 'noun', simpleDefinition: 'A series of actions that lead to a result.', contextMeaning: 'A step-by-step natural or technical sequence of changes.', arabicTranslation: 'عملية' },
  { word: 'system', partOfSpeech: 'noun', simpleDefinition: 'A group of connected parts that work together.', contextMeaning: 'An organized network of components operating as a whole.', arabicTranslation: 'نظام' },
  { word: 'effect', partOfSpeech: 'noun', simpleDefinition: 'A change or result caused by something.', contextMeaning: 'A measurable impact produced by a specific condition or action.', arabicTranslation: 'تأثير / أثر' },
  { word: 'factors', partOfSpeech: 'noun', simpleDefinition: 'Things that help cause or influence a result.', contextMeaning: 'Key variables or conditions that shape the final outcome.', arabicTranslation: 'عوامل' },
  { word: 'resources', partOfSpeech: 'noun', simpleDefinition: 'Useful supplies or materials that people can use.', contextMeaning: 'Valuable natural or community supplies that must be managed carefully.', arabicTranslation: 'موارد' },
  { word: 'materials', partOfSpeech: 'noun', simpleDefinition: 'The substances or parts used to make something.', contextMeaning: 'Physical substances used in construction, storage, or natural cycles.', arabicTranslation: 'مواد' },
  { word: 'environment', partOfSpeech: 'noun', simpleDefinition: 'The natural or surrounding conditions in which something exists.', contextMeaning: 'The surrounding habitat, climate, or physical setting.', arabicTranslation: 'بيئة' },
  { word: 'species', partOfSpeech: 'noun', simpleDefinition: 'A group of similar living things that can produce young together.', contextMeaning: 'A distinct biological group of plants, animals, or microbes.', arabicTranslation: 'فصيلة / نوع حيوي' },
  { word: 'surface', partOfSpeech: 'noun', simpleDefinition: 'The outside or top layer of something.', contextMeaning: 'The outer boundary or top layer exposed to air, light, or water.', arabicTranslation: 'سطح' },
  { word: 'signal', partOfSpeech: 'noun', simpleDefinition: 'A sign or message that carries information.', contextMeaning: 'A physical, chemical, or visual cue that communicates information.', arabicTranslation: 'إشارة' },
  { word: 'energy', partOfSpeech: 'noun', simpleDefinition: 'The power needed to make things work or change.', contextMeaning: 'Usable power—such as light, heat, or electricity—that drives activity.', arabicTranslation: 'طاقة' },
  { word: 'movement', partOfSpeech: 'noun', simpleDefinition: 'The act of changing position or moving from place to place.', contextMeaning: 'Physical motion or transport from one location to another.', arabicTranslation: 'حركة / تنقل' },
  { word: 'region', partOfSpeech: 'noun', simpleDefinition: 'A large area of land or part of a place.', contextMeaning: 'A specific geographical zone or district.', arabicTranslation: 'منطقة / إقليم' },
  { word: 'pattern', partOfSpeech: 'noun', simpleDefinition: 'A repeated or recognizable way in which things happen.', contextMeaning: 'A consistent, observable trend across time or space.', arabicTranslation: 'نمط' },
  { word: 'conditions', partOfSpeech: 'noun', simpleDefinition: 'The situations or circumstances in which something happens.', contextMeaning: 'Surrounding environmental, physical, or social circumstances.', arabicTranslation: 'ظروف / شروط' },
  { word: 'measure', partOfSpeech: 'verb', simpleDefinition: 'To find the size, amount, or level of something.', contextMeaning: 'To quantify or record an exact value using instruments or observations.', arabicTranslation: 'يقيس' },
  { word: 'model', partOfSpeech: 'noun', simpleDefinition: 'A simple representation that helps explain or study something.', contextMeaning: 'A theoretical or computational representation of how a system behaves.', arabicTranslation: 'نموذج' },
  { word: 'data', partOfSpeech: 'noun', simpleDefinition: 'Facts or figures collected for study.', contextMeaning: 'Recorded measurements and empirical observations used for analysis.', arabicTranslation: 'بيانات' },
  { word: 'risk', partOfSpeech: 'noun', simpleDefinition: 'The possibility that something harmful or unwanted may happen.', contextMeaning: 'Potential hazard or likelihood of damage or failure.', arabicTranslation: 'خطر / مخاطرة' },
  { word: 'benefits', partOfSpeech: 'noun', simpleDefinition: 'Helpful or useful results.', contextMeaning: 'Positive, lasting advantages for people or the environment.', arabicTranslation: 'فوائد / منافع' },
  { word: 'reduce', partOfSpeech: 'verb', simpleDefinition: 'To make something smaller or less.', contextMeaning: 'To lower the amount, cost, or intensity of something.', arabicTranslation: 'يقلل / يخفض' },
  { word: 'increase', partOfSpeech: 'verb', simpleDefinition: 'To become or make something greater in size or amount.', contextMeaning: 'To raise or expand in quantity, strength, or frequency.', arabicTranslation: 'يزيد / يرفع' },
  { word: 'support', partOfSpeech: 'verb', simpleDefinition: 'To help something continue, work, or succeed.', contextMeaning: 'To sustain or provide the conditions needed for success.', arabicTranslation: 'يدعم / يساند' },
  { word: 'structure', partOfSpeech: 'noun', simpleDefinition: 'The way the parts of something are arranged or built.', contextMeaning: 'An engineered building, biological organ, or organized arrangement.', arabicTranslation: 'بنية / هيكل' },
  { word: 'source', partOfSpeech: 'noun', simpleDefinition: 'A place or thing from which something comes.', contextMeaning: 'The origin point that supplies energy, water, or information.', arabicTranslation: 'مصدر' },
  { word: 'technology', partOfSpeech: 'noun', simpleDefinition: 'Tools and methods developed using scientific knowledge.', contextMeaning: 'Applied scientific equipment and engineering methods.', arabicTranslation: 'تكنولوجيا / تقنية' },
  { word: 'impact', partOfSpeech: 'noun', simpleDefinition: 'A strong effect or influence on something.', contextMeaning: 'A significant, lasting effect on society or the environment.', arabicTranslation: 'أثر بالغ / تأثير' },
  { word: 'function', partOfSpeech: 'noun', simpleDefinition: 'The purpose or job of a person or thing.', contextMeaning: 'The specific biological or mechanical role something performs.', arabicTranslation: 'وظيفة' },
  { word: 'response', partOfSpeech: 'noun', simpleDefinition: 'A reaction or answer to something that happens.', contextMeaning: 'An action or adjustment triggered by a change or stimulus.', arabicTranslation: 'استجابة' },
  { word: 'provide', partOfSpeech: 'verb', simpleDefinition: 'To give or make something available.', contextMeaning: 'To supply what is needed for survival, learning, or operation.', arabicTranslation: 'يزوّد / يوفّر' },
  { word: 'transfer', partOfSpeech: 'verb', simpleDefinition: 'To move something from one place or person to another.', contextMeaning: 'To pass energy, knowledge, or nutrients from one part to another.', arabicTranslation: 'ينقل / يحوّل' },
  { word: 'available', partOfSpeech: 'adjective', simpleDefinition: 'Ready to be used or obtained.', contextMeaning: 'Accessible and ready for people or organisms to use.', arabicTranslation: 'متاح / متوفر' },
  { word: 'efficient', partOfSpeech: 'adjective', simpleDefinition: 'Working well without wasting time, effort, or resources.', contextMeaning: 'Achieving strong results with minimal wasted energy or cost.', arabicTranslation: 'كفؤ / فعّال' },
  { word: 'adaptation', partOfSpeech: 'noun', simpleDefinition: 'A change that helps a living thing or system suit new conditions.', contextMeaning: 'An adjustment tailored to local environmental or practical needs.', arabicTranslation: 'تكيّف' },
  { word: 'pressure', partOfSpeech: 'noun', simpleDefinition: 'A force pushing against an area or object.', contextMeaning: 'Physical force or demanding economic and environmental strain.', arabicTranslation: 'ضغط' },
  { word: 'community', partOfSpeech: 'noun', simpleDefinition: 'People who live in the same area or share an interest.', contextMeaning: 'Local residents working together in a shared neighbourhood or town.', arabicTranslation: 'مجتمع محلي' },
  { word: 'change', partOfSpeech: 'noun', simpleDefinition: 'A difference that happens or is made.', contextMeaning: 'A noticeable shift in shape, behaviour, or condition.', arabicTranslation: 'تغيير / تحوّل' },
  { word: 'develop', partOfSpeech: 'verb', simpleDefinition: 'To grow, improve, or become more advanced.', contextMeaning: 'To build, refine, or grow over time.', arabicTranslation: 'يطوّر / ينمو' },
  { word: 'study', partOfSpeech: 'noun', simpleDefinition: 'A careful investigation of a subject or question.', contextMeaning: 'A formal research project or learning activity.', arabicTranslation: 'دراسة' },
  { word: 'area', partOfSpeech: 'noun', simpleDefinition: 'A particular part or region of a place or subject.', contextMeaning: 'A defined geographic space or field of inquiry.', arabicTranslation: 'منطقة / مساحة' },
  { word: 'cells', partOfSpeech: 'noun', simpleDefinition: 'The smallest living building blocks of plants and animals.', contextMeaning: 'Microscopic living units that make up tissues and organisms.', arabicTranslation: 'خلايا' },
  { word: 'water', partOfSpeech: 'noun', simpleDefinition: 'The clear liquid needed by people, animals, and plants.', contextMeaning: 'Essential liquid moisture used for drinking, cooling, or plant growth.', arabicTranslation: 'ماء' },
  { word: 'heat', partOfSpeech: 'noun', simpleDefinition: 'The quality of being hot or the energy that makes something warm.', contextMeaning: 'Thermal energy that raises temperature.', arabicTranslation: 'حرارة' },
  { word: 'light', partOfSpeech: 'noun', simpleDefinition: 'Brightness that lets people see.', contextMeaning: 'Natural sunlight or artificial illumination.', arabicTranslation: 'ضوء' },
  { word: 'plants', partOfSpeech: 'noun', simpleDefinition: 'Living things that usually grow in soil and make their own food using light.', contextMeaning: 'Green vegetation such as crops, trees, or rooftop gardens.', arabicTranslation: 'نباتات' },
  { word: 'animals', partOfSpeech: 'noun', simpleDefinition: 'Living creatures that can move and need food.', contextMeaning: 'Wildlife or domesticated creatures living in an ecosystem.', arabicTranslation: 'حيوانات' },
  { word: 'climate', partOfSpeech: 'noun', simpleDefinition: 'The usual weather of a place over a long period.', contextMeaning: 'Long-term regional weather and temperature patterns.', arabicTranslation: 'مناخ' },
  { word: 'memory', partOfSpeech: 'noun', simpleDefinition: 'The ability to keep and recall information.', contextMeaning: 'Mental storage and recall of learned facts or experiences.', arabicTranslation: 'ذاكرة' },
  { word: 'technicians', partOfSpeech: 'noun', simpleDefinition: 'People trained to work with practical or technical equipment.', contextMeaning: 'Skilled workers who inspect, calibrate, and repair equipment.', arabicTranslation: 'فنيون' },
  { word: 'moisture', partOfSpeech: 'noun', simpleDefinition: 'A small amount of water in something.', contextMeaning: 'Dampness in soil, air, or compost that keeps organisms alive.', arabicTranslation: 'رطوبة' },
  { word: 'earthworms', partOfSpeech: 'noun', simpleDefinition: 'Long, soft-bodied animals that live in soil.', contextMeaning: 'Helpful soil creatures that turn dead leaves into rich compost.', arabicTranslation: 'ديدان الأرض' },
  { word: 'goals', partOfSpeech: 'noun', simpleDefinition: 'Things that someone plans or hopes to achieve.', contextMeaning: 'Clear daily tasks or targets a person aims to complete.', arabicTranslation: 'أهداف' },
  { word: 'notebook', partOfSpeech: 'noun', simpleDefinition: 'A book of blank pages used for writing notes.', contextMeaning: 'A small paper pad used to write down plans or ideas.', arabicTranslation: 'دفتر ملاحظات' },
  { word: 'libraries', partOfSpeech: 'noun', simpleDefinition: 'Places where people can borrow books and other materials.', contextMeaning: 'Public reading centres that lend books and audio stories to families.', arabicTranslation: 'مكتبات' },
  { word: 'pronunciation', partOfSpeech: 'noun', simpleDefinition: 'The way a word or language is spoken.', contextMeaning: 'How words sound when spoken clearly aloud.', arabicTranslation: 'نُطق' },
  { word: 'plot', partOfSpeech: 'noun', simpleDefinition: 'The main events in a story.', contextMeaning: 'The sequence of events that happens to the characters in a book.', arabicTranslation: 'حبكة القصة' },
  { word: 'reusable', partOfSpeech: 'adjective', simpleDefinition: 'Able to be used again instead of thrown away.', contextMeaning: 'Designed to be used many times to avoid waste.', arabicTranslation: 'قابل لإعادة الاستخدام' },
  { word: 'packaging', partOfSpeech: 'noun', simpleDefinition: 'Material used to wrap or contain a product.', contextMeaning: 'Plastic or paper wrapping around goods sold in shops.', arabicTranslation: 'تغليف / عبوات' },
  { word: 'blades', partOfSpeech: 'noun', simpleDefinition: 'Flat, narrow parts that cut or turn around an axis.', contextMeaning: 'The long wing-shaped arms of a wind turbine that catch the wind.', arabicTranslation: 'شفرات' },
  { word: 'brakes', partOfSpeech: 'noun', simpleDefinition: 'Devices that slow or stop a moving machine.', contextMeaning: 'Safety locks that stop wind turbine blades from spinning in storms.', arabicTranslation: 'مكابح / فرامل' },
  { word: 'curricula', partOfSpeech: 'noun', simpleDefinition: 'The subjects and content taught in a course or school.', contextMeaning: 'University training programmes that prepare future professionals.', arabicTranslation: 'مناهج دراسية' },
  { word: 'accreditation', partOfSpeech: 'noun', simpleDefinition: 'Official recognition that an organization or course meets certain standards.', contextMeaning: 'Formal certification of professional and academic training standards.', arabicTranslation: 'اعتماد أكاديمي أو مهني' },
  { word: 'modules', partOfSpeech: 'noun', simpleDefinition: 'Separate units that form part of a larger course or system.', contextMeaning: 'Focused instructional units within an advanced university course.', arabicTranslation: 'وحدات تدريبية' },
  { word: 'quantitative', partOfSpeech: 'adjective', simpleDefinition: 'Related to amounts or numbers that can be measured.', contextMeaning: 'Based on mathematical measurements and statistical modelling.', arabicTranslation: 'كمّي / رقمي' },
  { word: 'governance', partOfSpeech: 'noun', simpleDefinition: 'The way an organization or place is directed and controlled.', contextMeaning: 'Public policy, institutional rules, and regulatory decision-making.', arabicTranslation: 'حوكمة / إدارة تنظيمية' },
  { word: 'frameworks', partOfSpeech: 'noun', simpleDefinition: 'Basic structures or sets of ideas used to organize work.', contextMeaning: 'Structured policy or analytical systems that guide decisions.', arabicTranslation: 'أُطر عمل' },
  { word: 'institutionalize', partOfSpeech: 'verb', simpleDefinition: 'To make a practice an established part of an organization.', contextMeaning: 'To build a review practice permanently into official rules.', arabicTranslation: 'يرسّخ مؤسسياً' },
  { word: 'benchmarks', partOfSpeech: 'noun', simpleDefinition: 'Standards used to compare or judge performance.', contextMeaning: 'Reference standards used to evaluate technical or policy performance.', arabicTranslation: 'معايير مرجعية' },
  { word: 'compliance', partOfSpeech: 'noun', simpleDefinition: 'The act of following a rule or requirement.', contextMeaning: 'Meeting official regulatory or environmental standards.', arabicTranslation: 'امتثال / التزام بالمعايير' },
  { word: 'metrics', partOfSpeech: 'noun', simpleDefinition: 'Measures used to assess or compare something.', contextMeaning: 'Quantitative indicators used to track progress or performance.', arabicTranslation: 'مقاييس / مؤشرات قياس' },
  { word: 'representation', partOfSpeech: 'noun', simpleDefinition: 'The presence or inclusion of different people, groups, or views.', contextMeaning: 'Fair inclusion of diverse regions and academic disciplines.', arabicTranslation: 'تمثيل' },
  { word: 'disciplinary', partOfSpeech: 'adjective', simpleDefinition: 'Related to a particular subject or field of study.', contextMeaning: 'Connected to specific academic fields of expertise.', arabicTranslation: 'تخصصي / أكاديمي' },
  { word: 'infrastructural', partOfSpeech: 'adjective', simpleDefinition: 'Related to the basic systems and structures a place depends on.', contextMeaning: 'Concerning core public utilities, transport, and physical networks.', arabicTranslation: 'متعلق بالبنية التحتية' },
  { word: 'affluent', partOfSpeech: 'adjective', simpleDefinition: 'Having a lot of money or wealth.', contextMeaning: 'Wealthy, well-funded industrial regions.', arabicTranslation: 'ثري / ميسور' },
  { word: 'marginalizing', partOfSpeech: 'verb', simpleDefinition: 'Treating a person or group as less important or keeping them out of influence.', contextMeaning: 'Pushing regional or local alternatives to the sidelines.', arabicTranslation: 'تهميش' },
  { word: 'architectures', partOfSpeech: 'noun', simpleDefinition: 'The organized designs or structures of a system.', contextMeaning: 'Complex analytical, computational, or governance designs.', arabicTranslation: 'معماريات / هياكل تصميمية' },
  { word: 'maintenance', partOfSpeech: 'noun', simpleDefinition: 'Work done to keep a machine, building, or system in good condition.', contextMeaning: 'Regular upkeep and servicing so equipment continues working reliably.', arabicTranslation: 'صيانة' },
  { word: 'inspections', partOfSpeech: 'noun', simpleDefinition: 'Careful checks to make sure something is safe and working properly.', contextMeaning: 'Scheduled checks of equipment to prevent breakdowns and waste.', arabicTranslation: 'فحوصات / عمليات تفتيش' },
  { word: 'calibration', partOfSpeech: 'noun', simpleDefinition: 'Careful adjustment of an instrument so it measures accurately.', contextMeaning: 'Fine-tuning sensors or models so their readings remain accurate.', arabicTranslation: 'معايرة' },
  { word: 'empirical', partOfSpeech: 'adjective', simpleDefinition: 'Based on real observation and measurement rather than theory alone.', contextMeaning: 'Grounded in real-world measurements and experimental evidence.', arabicTranslation: 'تجريبي / مبني على الملاحظة' },
  { word: 'longitudinal', partOfSpeech: 'adjective', simpleDefinition: 'Tracked repeatedly over a long period of time.', contextMeaning: 'Studied across many years or decades to observe long-term trends.', arabicTranslation: 'طولي / ممتد عبر الزمن' },
  { word: 'telemetry', partOfSpeech: 'noun', simpleDefinition: 'Automatic measurement and transmission of data from remote sensors.', contextMeaning: 'Continuous data streams sent from field instruments.', arabicTranslation: 'قياس عن بُعد' },
  { word: 'equifinality', partOfSpeech: 'noun', simpleDefinition: 'The principle that different causes can produce the same final result.', contextMeaning: 'When separate underlying mechanisms lead to identical surface outcomes.', arabicTranslation: 'تساوي النهايات (تعدد الأسباب لنتيجة واحدة)' },
  { word: 'stochastic', partOfSpeech: 'adjective', simpleDefinition: 'Involving random variation or probability.', contextMeaning: 'Random background noise that must be separated from true causes.', arabicTranslation: 'عشوائي / احتمالي' },
  { word: 'polycentric', partOfSpeech: 'adjective', simpleDefinition: 'Having many independent centres of decision-making that coordinate together.', contextMeaning: 'Combining national standards with local municipal experimentation.', arabicTranslation: 'متعدد المراكز' },
  { word: 'reproducibility', partOfSpeech: 'noun', simpleDefinition: 'The ability for independent researchers to repeat an experiment and get the same result.', contextMeaning: 'Verifying that scientific findings hold true across different laboratories.', arabicTranslation: 'قابلية التكرار والتحقق' },
];

/** Report source terms that do not occur in the passage or duplicate existing lesson terms. */
export function auditVocabularyAdditions(lesson: ReadingLesson): { unmatched: string[]; alreadyPresent: string[] } {
  const existing = new Set(lesson.vocabulary.flatMap((item) => [item.word, item.matchedText || ''].map((value) => value.trim().toLowerCase())));
  const seen = new Set(existing);
  const unmatched: string[] = [];
  const alreadyPresent: string[] = [];
  for (const item of VOCABULARY_ADDITIONS[lesson.id] || []) {
    const key = item.word.trim().toLowerCase();
    if (seen.has(key)) {
      alreadyPresent.push(item.word);
    } else if (!findSentence(lesson.passage, item.word)) {
      unmatched.push(item.word);
    } else {
      seen.add(key);
    }
  }
  return { unmatched, alreadyPresent };
}

function maskAlreadyAnnotatedPhrases(text: string, annotatedWords: Iterable<string>): string {
  let masked = text;
  const sorted = Array.from(annotatedWords)
    .map((w) => w.trim())
    .filter((w) => w.length > 0)
    .sort((a, b) => b.length - a.length);
  for (const phrase of sorted) {
    const pat = new RegExp(`\\b${escapeRegExp(phrase)}\\b`, 'gi');
    masked = masked.replace(pat, (m) => '_'.repeat(m.length));
  }
  return masked;
}

/** Add static, reviewed annotations and ensure vocabulary citations use complete passage sentences. Safe to apply repeatedly. */
export function addLessonVocabulary(lesson: ReadingLesson): ReadingLesson {
  let changed = false;
  const seenBaseWords = new Set<string>();
  const normalizedVocabulary: VocabularyAnnotation[] = [];

  for (const item of lesson.vocabulary) {
    const key = item.word.trim().toLowerCase();
    if (seenBaseWords.has(key)) {
      changed = true;
      continue;
    }
    seenBaseWords.add(key);
    if (item.matchedText) {
      seenBaseWords.add(item.matchedText.trim().toLowerCase());
    }
    if (item.originalSentence && lesson.passage.includes(item.originalSentence)) {
      normalizedVocabulary.push(item);
      continue;
    }
    const originalSentence = findSentence(lesson.passage, item.matchedText?.trim() || item.word.trim());
    if (!originalSentence || originalSentence === item.originalSentence) {
      normalizedVocabulary.push(item);
    } else {
      changed = true;
      normalizedVocabulary.push({ ...item, originalSentence });
    }
  }

  const additions = VOCABULARY_ADDITIONS[lesson.id] || [];
  const existingIds = new Set(normalizedVocabulary.map((item) => item.id));
  const existingWords = new Set(
    normalizedVocabulary.flatMap((item) =>
      [item.word, item.matchedText || ''].map((value) => value.trim().toLowerCase()).filter(Boolean)
    )
  );
  const added: VocabularyAnnotation[] = [];

  for (const item of additions) {
    const key = item.word.trim().toLowerCase();
    const candidateId = `${lesson.id}-vocab-more-${stableSlug(item.word)}`;
    if (!key || existingWords.has(key) || existingIds.has(candidateId)) continue;
    const maskedPassage = maskAlreadyAnnotatedPhrases(lesson.passage, existingWords);
    if (!findSentence(maskedPassage, item.word)) continue;
    const originalSentence = findSentence(lesson.passage, item.word);
    if (!originalSentence) continue;

    added.push({
      id: candidateId,
      word: item.word,
      occurrenceIndex: 0,
      partOfSpeech: item.partOfSpeech,
      simpleDefinition: item.simpleDefinition,
      contextMeaning: item.contextMeaning,
      originalSentence,
      exampleSentence: item.exampleSentence || originalSentence,
    });
    existingWords.add(key);
    existingIds.add(candidateId);
  }

  const vocabularyWithReviewedAdditions = [...normalizedVocabulary, ...added];
  const paragraphAdditions: VocabularyAnnotation[] = [];
  const paragraphs = lesson.passage
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  paragraphs.forEach((paragraph, paragraphIndex) => {
    let addedForParagraph = 0;
    for (const term of PARAGRAPH_VOCABULARY) {
      if (addedForParagraph >= 2) break;
      const key = term.word.toLowerCase();
      if (existingWords.has(key)) continue;

      const candidateId = `${lesson.id}-vocab-paragraph-${paragraphIndex + 1}-${stableSlug(term.word)}`;
      if (existingIds.has(candidateId)) continue;

      // Check that term.word appears as a standalone word in this paragraph outside of already-annotated multi-word phrases
      const maskedParagraph = maskAlreadyAnnotatedPhrases(paragraph, existingWords);
      if (!findSentence(maskedParagraph, term.word)) continue;

      const sentence = findSentence(paragraph, term.word);
      if (!sentence) continue;

      paragraphAdditions.push({
        id: candidateId,
        word: term.word,
        occurrenceIndex: 0,
        partOfSpeech: term.partOfSpeech,
        simpleDefinition: term.simpleDefinition,
        contextMeaning: term.contextMeaning,
        originalSentence: sentence,
        exampleSentence: sentence,
        arabicTranslation: term.arabicTranslation,
      });
      existingWords.add(key);
      existingIds.add(candidateId);
      addedForParagraph += 1;
    }
  });

  if (added.length || paragraphAdditions.length) changed = true;
  return changed
    ? { ...lesson, vocabulary: [...vocabularyWithReviewedAdditions, ...paragraphAdditions] }
    : lesson;
}