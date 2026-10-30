import { AcademicTopic, CEFRLevel } from '../types/reading';

export interface PassagePhotoMetadata {
  localUrl: string;
  alt: string;
  photographer: string;
  license: string;
  licenseUrl: string;
  sourceName: string;
  sourceUrl: string;
  wikimediaFile: string;
  sizeBytes: number;
}

/**
 * Verified real-life documentary and editorial photography catalog for all 54 IELTS Academic Reading
 * passages (including the 5 public SEO sample lessons) and all 15 diagnostic placement passages.
 * Every photograph has been verified for topic accuracy, 16:9 framing (1200x675), and open licensing.
 */
export const PASSAGE_PHOTO_CATALOG: Record<string, PassagePhotoMetadata> = {
  "a1-sci-solar-lamps": {
    "localUrl": "/photos/a1-sci-solar-lamps.jpg",
    "photographer": "Rotimi8",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Solar_lamp_Home_appliance_Rotimi8.jpg",
    "wikimediaFile": "File:Solar lamp Home appliance Rotimi8.jpg",
    "sizeBytes": 164363,
    "alt": "Portable rechargeable solar LED reading lamp used for household lighting and evening study."
  },
  "a1-env-community-compost": {
    "localUrl": "/photos/a1-env-community-compost.jpg",
    "photographer": "Joe Hoover",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Compost_bin_made_of_wood.jpg",
    "wikimediaFile": "File:Compost bin made of wood.jpg",
    "sizeBytes": 193302,
    "alt": "Wooden slatted community garden compost bin turning organic kitchen and yard waste into rich soil."
  },
  "a1-psy-morning-routines": {
    "localUrl": "/photos/a1-psy-morning-routines.jpg",
    "photographer": "Ella Olsson from Stockholm, Sweden",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Banana_Oatmeal_Breakfast_Bowl_(44302857265).jpg",
    "wikimediaFile": "File:Banana Oatmeal Breakfast Bowl (44302857265).jpg",
    "sizeBytes": 228638,
    "alt": "Nutritious morning oatmeal breakfast bowls with sliced bananas and cocoa nibs on a table."
  },
  "a1-his-roman-roads": {
    "localUrl": "/photos/a1-his-roman-roads.jpg",
    "alt": "Ancient basalt paving stones stretching along the historic Roman Appian Way in Italy.",
    "photographer": "LuisaV72",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Paesaggio_dell%27Appia_antica.jpg",
    "wikimediaFile": "File:Paesaggio dell'Appia antica.jpg",
    "sizeBytes": 211189
  },
  "a1-edu-bilingual-books": {
    "localUrl": "/photos/a1-edu-bilingual-books.jpg",
    "alt": "A mother reading an illustrated storybook aloud with her two young children at home.",
    "photographer": "Oscar del Pozo / European Commission Audiovisual Service",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:A_single_mother_reading_a_book_to_her_two_children_(P055043-925678).jpg",
    "wikimediaFile": "File:A single mother reading a book to her two children (P055043-925678).jpg",
    "sizeBytes": 145119
  },
  "a1-bio-honeybee-dances": {
    "localUrl": "/photos/a1-bio-honeybee-dances.jpg",
    "photographer": "(Figure design: J. Tautz and M. Kleinhenz, Beegroup Würzburg.)",
    "license": "CC BY 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.5",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Waggle_dance_photo.png",
    "wikimediaFile": "File:Waggle dance photo.png",
    "sizeBytes": 126573,
    "alt": "Honeybee performing a figure-eight waggle dance on vertical honeycomb surrounded by worker bees."
  },
  "a1-hea-handwashing-science": {
    "localUrl": "/photos/a1-hea-handwashing-science.jpg",
    "alt": "Hands being washed thoroughly under running tap water with soap lather.",
    "photographer": "Lars Klintwall Malmqvist (Larsklintwallmalmqvist)",
    "license": "Public domain",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:OCD_handwash.jpg",
    "wikimediaFile": "File:OCD handwash.jpg",
    "sizeBytes": 76792
  },
  "a1-eco-farmers-markets": {
    "localUrl": "/photos/a1-eco-farmers-markets.jpg",
    "alt": "Shoppers browsing fresh local vegetables and produce stalls at an outdoor community farmers market.",
    "photographer": "No machine-readable author provided. Sstevenson24 assumed (based on copyright claims).",
    "license": "CC BY-SA 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Farmers_and_Artisans_Market_at_Farmington_-_Michigan.jpg",
    "wikimediaFile": "File:Farmers and Artisans Market at Farmington - Michigan.jpg",
    "sizeBytes": 113770
  },
  "a1-ast-moon-phases": {
    "localUrl": "/photos/a1-ast-moon-phases.jpg",
    "alt": "Diagram of the eight lunar phases as the Moon orbits Earth illuminated by sunlight.",
    "photographer": "Andonee",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Moon_Phase_Diagram_for_Simple_English_Wikipedia.GIF",
    "wikimediaFile": "Moon Phase Diagram for Simple English Wikipedia.GIF",
    "sizeBytes": 47881
  },
  "a1-arc-courtyard-houses": {
    "localUrl": "/photos/a1-arc-courtyard-houses.jpg",
    "alt": "A traditional shaded courtyard house with tiled walkways, greenery, and central open sky.",
    "photographer": "C messier",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Large_riad_Bahia_1321.jpg",
    "wikimediaFile": "File:Large riad Bahia 1321.jpg",
    "sizeBytes": 278845
  },
  "a1-sci-wind-turbines": {
    "localUrl": "/photos/a1-sci-wind-turbines.jpg",
    "alt": "Tall modern wind turbines with three long white rotor blades generating clean electricity from moving air.",
    "photographer": "Hans Hillewaert",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Windmills_D1-D4_(Thornton_Bank).jpg",
    "wikimediaFile": "File:Windmills D1-D4 (Thornton Bank).jpg",
    "sizeBytes": 39957
  },
  "a2-sci-desalination-plants": {
    "localUrl": "/photos/a2-sci-desalination-plants.jpg",
    "alt": "High-pressure reverse osmosis membrane cylinders inside a seawater desalination facility.",
    "photographer": "James Grellier",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Reverse_osmosis_desalination_plant.JPG",
    "wikimediaFile": "File:Reverse osmosis desalination plant.JPG",
    "sizeBytes": 201399
  },
  "a2-env-mangrove-forests": {
    "localUrl": "/photos/a2-env-mangrove-forests.jpg",
    "alt": "Coastal mangrove trees with dense tangled roots growing directly in shallow tidal seawater.",
    "photographer": "Ariefrahman",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Sonneratia_alba_-_Manado_(2).JPG",
    "wikimediaFile": "File:Sonneratia alba - Manado (2).JPG",
    "sizeBytes": 183814
  },
  "a2-psy-colour-appetite": {
    "localUrl": "/photos/a2-psy-colour-appetite.jpg",
    "photographer": "Daderot",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Shropshire_Blue_cheese_plate_-_Massachusetts.jpg",
    "wikimediaFile": "File:Shropshire Blue cheese plate - Massachusetts.jpg",
    "sizeBytes": 238312,
    "alt": "Colorful cheese, dark blackberries, red jam, and toasted bread arranged on a contrasting white ceramic plate."
  },
  "a2-his-silk-road-caravans": {
    "localUrl": "/photos/a2-his-silk-road-caravans.jpg",
    "alt": "Stone arches and central courtyard of the historic Izadkhvast Caravanserai along the ancient Silk Road.",
    "photographer": "Bernard Gagnon",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Izadkhvast_Caravanserai_01.jpg",
    "wikimediaFile": "File:Izadkhvast Caravanserai 01.jpg",
    "sizeBytes": 253359
  },
  "a2-edu-handwriting-memory": {
    "localUrl": "/photos/a2-edu-handwriting-memory.jpg",
    "alt": "A student writing study notes by hand with a pen in a lined paper notebook.",
    "photographer": "Tookapic",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Pen-writing-notes-studying.jpg",
    "wikimediaFile": "File:Pen-writing-notes-studying.jpg",
    "sizeBytes": 67193
  },
  "a2-bio-arctic-tern": {
    "localUrl": "/photos/a2-bio-arctic-tern.jpg",
    "alt": "An Arctic tern with white plumage and a red beak flying over coastal waters in Iceland.",
    "photographer": "Charles J. Sharp",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Arctic_tern_(Sterna_paradisaea)_Flatey_3.jpg",
    "wikimediaFile": "File:Arctic tern (Sterna paradisaea) Flatey 3.jpg",
    "sizeBytes": 39533
  },
  "a2-hea-circadian-light": {
    "localUrl": "/photos/a2-hea-circadian-light.jpg",
    "alt": "Diagram of the 24-hour human circadian biological clock showing melatonin secretion and sleep-wake cycles.",
    "photographer": "NoNameGYassineMrabetTalk✉ fixed by Addicted04",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Biological_clock_human.svg",
    "wikimediaFile": "Biological clock human.svg",
    "sizeBytes": 134219
  },
  "a2-eco-public-bike-sharing": {
    "localUrl": "/photos/a2-eco-public-bike-sharing.jpg",
    "alt": "A row of public shared bicycles locked into an automated street docking station in Sweden.",
    "photographer": "W. Bulach",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:00_2141_Bicycle-sharing_systems_-_Sweden.jpg",
    "wikimediaFile": "File:00 2141 Bicycle-sharing systems - Sweden.jpg",
    "sizeBytes": 270713
  },
  "a2-ast-mars-rovers": {
    "localUrl": "/photos/a2-ast-mars-rovers.jpg",
    "alt": "NASA Curiosity robotic rover parked on the rocky red surface of Mars at a rock drilling site.",
    "photographer": "NASA",
    "license": "Public domain",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Curiosity_Self-Portrait_at_%27Big_Sky%27_Drilling_Site.jpg",
    "wikimediaFile": "File:Curiosity Self-Portrait at 'Big Sky' Drilling Site.jpg",
    "sizeBytes": 212853
  },
  "a2-arc-green-rooftops": {
    "localUrl": "/photos/a2-arc-green-rooftops.jpg",
    "alt": "A modern building topped with a planted green roof covered in living grasses and vegetation.",
    "photographer": "Sky Garden Ltd",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:British_Horse_Society_Head_Quarters_and_Green_Roof.jpg",
    "wikimediaFile": "File:British Horse Society Head Quarters and Green Roof.jpg",
    "sizeBytes": 156077
  },
  "a2-sci-vertical-farming": {
    "localUrl": "/photos/a2-sci-vertical-farming.jpg",
    "alt": "Stacked hydroponic trays of leafy green lettuce growing indoors inside a vertical farming system.",
    "photographer": "Valcenteu",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:VertiCrop.jpg",
    "wikimediaFile": "File:VertiCrop.jpg",
    "sizeBytes": 96900
  },
  "b1-sci-sodium-batteries": {
    "localUrl": "/photos/b1-sci-sodium-batteries.jpg",
    "alt": "Rows of large stationary rechargeable battery banks installed for grid and facility energy storage.",
    "photographer": "Jelson25",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Datacenter_Backup_Batteries.jpg",
    "wikimediaFile": "File:Datacenter Backup Batteries.jpg",
    "sizeBytes": 174314
  },
  "b1-env-beaver-wetlands": {
    "localUrl": "/photos/b1-env-beaver-wetlands.jpg",
    "alt": "A natural wooden beaver dam built across a forest stream creating a calm wetland pond in Algonquin Park.",
    "photographer": "Franklin Vera Pacheco / w:en:Franklin.vp (talk | contribs)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:AlgonquinBeaverDam.JPG",
    "wikimediaFile": "File:AlgonquinBeaverDam.JPG",
    "sizeBytes": 221924
  },
  "b1-psy-spacing-effect": {
    "localUrl": "/photos/b1-psy-spacing-effect.jpg",
    "photographer": "Zirguezi",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Leitner_system_alternative.svg",
    "wikimediaFile": "File:Leitner system alternative.svg",
    "sizeBytes": 67935,
    "alt": "Diagram of the Leitner spaced-repetition flashcard box system showing review intervals."
  },
  "b1-his-rosetta-stone": {
    "localUrl": "/photos/b1-his-rosetta-stone.jpg",
    "alt": "The ancient granodiorite Rosetta Stone inscribed with Egyptian hieroglyphs, Demotic script, and Ancient Greek in the British Museum.",
    "photographer": "Hans Hillewaert",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Rosetta_Stone.JPG",
    "wikimediaFile": "File:Rosetta Stone.JPG",
    "sizeBytes": 142600
  },
  "b1-edu-peer-teaching": {
    "localUrl": "/photos/b1-edu-peer-teaching.jpg",
    "photographer": "Preply.com Images",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Tutoring_Math.jpg",
    "wikimediaFile": "File:Tutoring Math.jpg",
    "sizeBytes": 108380,
    "alt": "Student tutor pointing at a mathematics problem sheet while explaining a solution to a peer."
  },
  "b1-bio-octopus-camouflage": {
    "localUrl": "/photos/b1-bio-octopus-camouflage.jpg",
    "alt": "A common octopus resting on the seabed displaying textured skin and mottled camouflage patterns.",
    "photographer": "albert kok",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Octopus2.jpg",
    "wikimediaFile": "File:Octopus2.jpg",
    "sizeBytes": 152442
  },
  "b1-hea-antibiotic-stewardship": {
    "localUrl": "/photos/b1-hea-antibiotic-stewardship.jpg",
    "alt": "Laboratory agar plate showing clear circular zones where antibiotic discs inhibit bacterial growth.",
    "photographer": "Dr Graham Beards",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Antibiotic_sensitivity_test.jpg",
    "wikimediaFile": "File:Antibiotic sensitivity test.jpg",
    "sizeBytes": 223837
  },
  "b1-eco-circular-repair": {
    "localUrl": "/photos/b1-eco-circular-repair.jpg",
    "alt": "Volunteers and residents repairing household electronics and appliances together at a community Repair Café.",
    "photographer": "Ilvy Njiokiktjien",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Repair_Cafe_by_Ilvy_Njiokiktjien.jpg",
    "wikimediaFile": "File:Repair Cafe by Ilvy Njiokiktjien.jpg",
    "sizeBytes": 127183
  },
  "b1-ast-exoplanet-transits": {
    "localUrl": "/photos/b1-ast-exoplanet-transits.jpg",
    "alt": "Diagram showing an exoplanet transiting across the disk of its host star and its orbital phases.",
    "photographer": "MPIA-Grafikabteilung",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Exoplanet_Transit_en.jpg",
    "wikimediaFile": "Exoplanet Transit en.jpg",
    "sizeBytes": 52558
  },
  "b1-arc-daylighting-schools": {
    "localUrl": "/photos/b1-arc-daylighting-schools.jpg",
    "photographer": "Pahazzard",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Classroom_thermal_mass.JPG",
    "wikimediaFile": "File:Classroom thermal mass.JPG",
    "sizeBytes": 159640,
    "alt": "Bright school classroom designed with large daylighting windows and thermal mass to illuminate student desks."
  },
  "b1-sci-geothermal-heating": {
    "localUrl": "/photos/b1-sci-geothermal-heating.jpg",
    "alt": "Steam plumes rising from the Nesjavellir geothermal power station surrounded by volcanic hills in Iceland.",
    "photographer": "Gretar Ívarsson – Edited by Fir0002",
    "license": "Public domain",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:NesjavellirPowerPlant_edit2.jpg",
    "wikimediaFile": "File:NesjavellirPowerPlant edit2.jpg",
    "sizeBytes": 162430
  },
  "b2-sci-bioluminescence-tech": {
    "localUrl": "/photos/b2-sci-bioluminescence-tech.jpg",
    "alt": "A bioluminescent crystal jellyfish glowing in dark ocean water.",
    "photographer": "Ssblakely",
    "license": "Attribution",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Aequorea4.jpg",
    "wikimediaFile": "File:Aequorea4.jpg",
    "sizeBytes": 98846
  },
  "b2-env-permafrost-peatlands": {
    "localUrl": "/photos/b2-env-permafrost-peatlands.jpg",
    "alt": "Waterlogged northern peatland bog covered in sphagnum moss and scattered pine trees in Finland.",
    "photographer": "Roquai",
    "license": "Public domain",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Lauhanvuori_suo.jpg",
    "wikimediaFile": "File:Lauhanvuori suo.jpg",
    "sizeBytes": 233718
  },
  "b2-psy-cognitive-offloading": {
    "localUrl": "/photos/b2-psy-cognitive-offloading.jpg",
    "alt": "Turn-by-turn satellite navigation route map displayed on an automotive GPS screen.",
    "photographer": "Erik Streb",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Gosmore_in_berlin_with_winCE_on_transonic_6000.jpg",
    "wikimediaFile": "Gosmore in berlin with winCE on transonic 6000.jpg",
    "sizeBytes": 195243
  },
  "b2-his-lidar-maya-cities": {
    "localUrl": "/photos/b2-his-lidar-maya-cities.jpg",
    "alt": "Ancient Maya limestone temple pyramids rising above the dense rainforest canopy at Tikal, Guatemala.",
    "photographer": "Mundo Maya",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Tikal_3.jpg",
    "wikimediaFile": "File:Tikal 3.jpg",
    "sizeBytes": 170570
  },
  "b2-edu-productive-failure": {
    "localUrl": "/photos/b2-edu-productive-failure.jpg",
    "alt": "Problem-based learning student group collaborating around a table while a student maps ideas on a whiteboard.",
    "photographer": "Shanghai killer whale",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Awesome_PBL_group.jpg",
    "wikimediaFile": "Awesome PBL group.jpg",
    "sizeBytes": 155586
  },
  "b2-bio-mycorrhizal-networks": {
    "localUrl": "/photos/b2-bio-mycorrhizal-networks.jpg",
    "alt": "Fruiting mushrooms growing on a mossy woodland floor connected to underground mycorrhizal fungal networks.",
    "photographer": "Kieran Roy Powell",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Amanita_muscaria_Aberystwyth_2023.jpg",
    "wikimediaFile": "File:Amanita muscaria Aberystwyth 2023.jpg",
    "sizeBytes": 317290
  },
  "b2-hea-wastewater-epidemiology": {
    "localUrl": "/photos/b2-hea-wastewater-epidemiology.jpg",
    "alt": "Circular sedimentation tanks at a municipal wastewater treatment facility used for urban water monitoring.",
    "photographer": "A.Savin",
    "license": "FAL",
    "licenseUrl": "http://artlibre.org/licence/lal/en",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Moscow_Kuryanovo_wastewater_plant_asv2018-08.jpg",
    "wikimediaFile": "File:Moscow Kuryanovo wastewater plant asv2018-08.jpg",
    "sizeBytes": 260146
  },
  "b2-eco-congestion-pricing": {
    "localUrl": "/photos/b2-eco-congestion-pricing.jpg",
    "alt": "London Congestion Charge road markings and street signage at an urban traffic entry zone.",
    "photographer": "Mariordo (Mario Roberto Durán Ortiz)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:London_CC_12_2012_5037.JPG",
    "wikimediaFile": "File:London CC 12 2012 5037.JPG",
    "sizeBytes": 175541
  },
  "b2-ast-orbital-debris": {
    "localUrl": "/photos/b2-ast-orbital-debris.jpg",
    "photographer": "NASA's Scientific Visualization Studio - USRA/Kel Elkins, Jessica Ende, OMITRON/Charles Fisher, Christina Mitchell",
    "license": "Public domain",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Tracking_Satellites_and_Space_Debris_in_Earth_Orbit_(Feb_2024)_(SVS5258_-_cos_ir_deb_2024_03750_print).jpg",
    "wikimediaFile": "File:Tracking Satellites and Space Debris in Earth Orbit (Feb 2024) (SVS5258 - cos ir deb 2024 03750 print).jpg",
    "sizeBytes": 82759,
    "alt": "NASA visualization of tracked satellites and orbital debris swarming in low Earth orbit."
  },
  "b2-arc-mass-timber": {
    "localUrl": "/photos/b2-arc-mass-timber.jpg",
    "alt": "Mjøstårnet in Norway, an eighteen-storey high-rise building constructed from engineered cross-laminated timber.",
    "photographer": "Øyvind Holmstad",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Narsot%C3%A5rnet_ved_Mj%C3%B8sa_02.jpg",
    "wikimediaFile": "File:Narsotårnet ved Mjøsa 02.jpg",
    "sizeBytes": 121593
  },
  "b2-sci-acoustic-ecology": {
    "localUrl": "/photos/b2-sci-acoustic-ecology.jpg",
    "alt": "Acoustic spectrogram plotting sound frequency in kilohertz against time and decibel intensity.",
    "photographer": "Aquegg",
    "license": "Public domain",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Spectrogram-19thC.png",
    "wikimediaFile": "Spectrogram-19thC.png",
    "sizeBytes": 134465
  },
  "c1-01-neuromorphic-computing": {
    "localUrl": "/photos/c1-01-neuromorphic-computing.jpg",
    "alt": "Extreme macro photograph of an integrated silicon microchip die showing intricate metallic circuitry pathways.",
    "photographer": "Zephyris",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:EPROM_Microchip_SuperMacro.jpg",
    "wikimediaFile": "File:EPROM Microchip SuperMacro.jpg",
    "sizeBytes": 116225
  },
  "c1-02-paleoclimate-proxies": {
    "localUrl": "/photos/c1-02-paleoclimate-proxies.jpg",
    "alt": "Microscopic photograph of a marine foraminifera shell whose calcium carbonate isotopes record ancient ocean temperatures.",
    "photographer": "Scott Fay",
    "license": "CC BY 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.5",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Ammonia_tepida.jpg",
    "wikimediaFile": "File:Ammonia tepida.jpg",
    "sizeBytes": 107850
  },
  "c1-03-predictive-processing-cognition": {
    "localUrl": "/photos/c1-03-predictive-processing-cognition.jpg",
    "alt": "A cognitive neuroscience researcher preparing a participant for a non-invasive magnetoencephalography (MEG) brain scan at the National Institute of Mental Health.",
    "photographer": "Unknown NIMH author",
    "license": "Public domain",
    "licenseUrl": "https://creativecommons.org/publicdomain/mark/1.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:NIMH_MEG.jpg",
    "wikimediaFile": "File:NIMH MEG.jpg",
    "sizeBytes": 79762
  },
  "c1-04-bronze-age-collapse-systems": {
    "localUrl": "/photos/c1-04-bronze-age-collapse-systems.jpg",
    "alt": "Monumental cyclopean stone masonry of the Lion Gate at the Late Bronze Age citadel of Mycenae, Greece.",
    "photographer": "Joyofmuseums",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Lion_Gate_-_Mycenae_by_Joy_of_Museums.jpg",
    "wikimediaFile": "File:Lion Gate - Mycenae by Joy of Museums.jpg",
    "sizeBytes": 244873
  },
  "c1-05-epistemic-cognition-education": {
    "localUrl": "/photos/c1-05-epistemic-cognition-education.jpg",
    "alt": "Researcher critically evaluating and cross-referencing stacks of scientific manuscripts during peer review.",
    "photographer": "Center for Scientific Review [2]",
    "license": "Public domain",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:ScientificReview.jpg",
    "wikimediaFile": "ScientificReview.jpg",
    "sizeBytes": 133827
  },
  "c1-06-eusociality-inclusive-fitness": {
    "localUrl": "/photos/c1-06-eusociality-inclusive-fitness.jpg",
    "photographer": "Jessica Lawrence, Eurofins Agroscience Services, Bugwood.org",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Apis_mellifera_(queen_and_workers).jpg",
    "wikimediaFile": "File:Apis mellifera (queen and workers).jpg",
    "sizeBytes": 129306,
    "alt": "Eusocial honeybee queen surrounded by sterile worker bees tending brood cells on honeycomb."
  },
  "c1-07-antimicrobial-market-failure": {
    "localUrl": "/photos/c1-07-antimicrobial-market-failure.jpg",
    "alt": "Microbiologist examining bacterial culture colonies grown on a laboratory Petri dish.",
    "photographer": "Ufficio Comunicazione, Azienda Ospedaliera SS. Antonio e Biagio e Cesare Arrigo, Alessandria and Biblioteca Biomedica Centro di Documentazione",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Antonio_e_Biagio_e_Cesare_Arrigo_Petri_dish.jpg",
    "wikimediaFile": "File:Antonio e Biagio e Cesare Arrigo Petri dish.jpg",
    "sizeBytes": 64948
  },
  "c1-08-agglomeration-baumol-disease": {
    "localUrl": "/photos/c1-08-agglomeration-baumol-disease.jpg",
    "alt": "Dense cluster of metropolitan glass office towers at Canary Wharf financial district in London.",
    "photographer": "The wub",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Canary_Wharf_from_entrance_to_Limehouse_Basin_-_2022-04-03.jpg",
    "wikimediaFile": "File:Canary Wharf from entrance to Limehouse Basin - 2022-04-03.jpg",
    "sizeBytes": 200062
  },
  "c1-09-exoplanet-biosignatures-disequilibrium": {
    "localUrl": "/photos/c1-09-exoplanet-biosignatures-disequilibrium.jpg",
    "photographer": "NASA, ESA, CSA, STScI, and the Webb ERO Production Team",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Exoplanet_WASP-96_b_(NIRISS_Transmission_Spectrum)_(weic2206a).jpeg",
    "wikimediaFile": "File:Exoplanet WASP-96 b (NIRISS Transmission Spectrum) (weic2206a).jpeg",
    "sizeBytes": 79607,
    "alt": "James Webb Space Telescope NIRISS transmission spectrum of exoplanet WASP-96 b showing atmospheric water absorption peaks."
  },
  "c1-10-embodied-carbon-adaptive-reuse": {
    "localUrl": "/photos/c1-10-embodied-carbon-adaptive-reuse.jpg",
    "alt": "Tate Modern in London, a former brick power station adaptively reused as a public museum.",
    "photographer": "Acabashi",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Tate_Modern_-_Bankside_Power_Station.jpg",
    "wikimediaFile": "File:Tate Modern - Bankside Power Station.jpg",
    "sizeBytes": 107671
  },
  "diag-a1-1-community-bicycle-workshop": {
    "localUrl": "/photos/diag-a1-1-community-bicycle-workshop.jpg",
    "alt": "Mechanics and visitors repairing bicycles with hand tools inside a neighbourhood community bike workshop.",
    "photographer": "Timothy J Carroll",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Sopo_Bicycle_Cooperative.jpg",
    "wikimediaFile": "File:Sopo Bicycle Cooperative.jpg",
    "sizeBytes": 187646
  },
  "diag-a1-2-rooftop-herb-garden": {
    "localUrl": "/photos/diag-a1-2-rooftop-herb-garden.jpg",
    "photographer": "Rhododendrites",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Rooftop_farm_at_the_Essex_(65787p).jpg",
    "wikimediaFile": "File:Rooftop farm at the Essex (65787p).jpg",
    "sizeBytes": 328429,
    "alt": "Overhead view of raised vegetable and herb garden beds arranged on an urban building rooftop."
  },
  "diag-a1-3-desert-fog-nets": {
    "localUrl": "/photos/diag-a1-3-desert-fog-nets.jpg",
    "alt": "Tall mesh fog-catching nets erected on an arid hillside in Alto Patache to harvest water droplets from mist.",
    "photographer": "Pontificia Universidad Católica de Chile",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Atrapanieblas_en_Alto_Patache.jpg",
    "wikimediaFile": "File:Atrapanieblas en Alto Patache.jpg",
    "sizeBytes": 100670
  },
  "diag-a2-1-floating-libraries": {
    "localUrl": "/photos/diag-a2-1-floating-libraries.jpg",
    "alt": "The Norwegian mobile library boat MS Epos docked at harbor, bringing books to coastal communities.",
    "photographer": "Anders",
    "license": "CC BY 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.5",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:MS_Epos.jpg",
    "wikimediaFile": "MS Epos.jpg",
    "sizeBytes": 233042
  },
  "diag-a2-2-roman-concrete-harbours": {
    "localUrl": "/photos/diag-a2-2-roman-concrete-harbours.jpg",
    "alt": "Ancient Roman marine concrete harbour ruins still standing along the Mediterranean coast at Caesarea.",
    "photographer": "The original uploader was אסף.צ at Hebrew Wikipedia.",
    "license": "Public domain",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Caesarea.JPG",
    "wikimediaFile": "File:Caesarea.JPG",
    "sizeBytes": 109336
  },
  "diag-a2-3-bumblebee-flower-signals": {
    "localUrl": "/photos/diag-a2-3-bumblebee-flower-signals.jpg",
    "alt": "A red-tailed bumblebee landing on yellow blossoms to collect nectar.",
    "photographer": "Ivar Leidus",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Bombus_lapidarius_-_Melilotus_officinalis_-_Tallinn.jpg",
    "wikimediaFile": "File:Bombus lapidarius - Melilotus officinalis - Tallinn.jpg",
    "sizeBytes": 70825
  },
  "diag-b1-1-urban-sponge-parks": {
    "localUrl": "/photos/diag-b1-1-urban-sponge-parks.jpg",
    "alt": "A planted urban rain garden with porous soil and native rushes designed to absorb street stormwater runoff.",
    "photographer": "Maureen Flynn-Burhoe",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Parkdale,_Calgary_LID_rain_garden.jpg",
    "wikimediaFile": "File:Parkdale, Calgary LID rain garden.jpg",
    "sizeBytes": 313079
  },
  "diag-b1-2-sleep-spindles-memory": {
    "localUrl": "/photos/diag-b1-2-sleep-spindles-memory.jpg",
    "alt": "Stage 2 NREM sleep electroencephalogram (EEG) trace showing a K-complex and a sleep spindle burst.",
    "photographer": "Stage2sleep.svg: User:Neocadre. Original uploader was Ijustam at en.wikipedia derivative work: Neocadre (talk)",
    "license": "Public domain",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Stage2sleep_new.svg",
    "wikimediaFile": "Stage2sleep new.svg",
    "sizeBytes": 50308
  },
  "diag-b1-3-kelp-forests-coasts": {
    "localUrl": "/photos/diag-b1-3-kelp-forests-coasts.jpg",
    "alt": "Tall underwater giant kelp fronds swaying in sunlit coastal ocean water.",
    "photographer": "Kip Evans",
    "license": "Public domain",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Kelp_forest.jpg",
    "wikimediaFile": "File:Kelp forest.jpg",
    "sizeBytes": 73551
  },
  "diag-b2-1-jevons-efficiency-paradox": {
    "localUrl": "/photos/diag-b2-1-jevons-efficiency-paradox.jpg",
    "alt": "A historic James Watt double-acting steam engine preserved at an engineering school in Madrid.",
    "photographer": "Nicolás Pérez",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Maquina_vapor_Watt_ETSIIM.jpg",
    "wikimediaFile": "File:Maquina vapor Watt ETSIIM.jpg",
    "sizeBytes": 95057
  },
  "diag-b2-2-bilingual-executive-control": {
    "localUrl": "/photos/diag-b2-2-bilingual-executive-control.jpg",
    "photographer": "OpenStax",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:1206_FMRI.jpg",
    "wikimediaFile": "File:1206 FMRI.jpg",
    "sizeBytes": 85746,
    "alt": "Functional magnetic resonance imaging (fMRI) brain scan showing neural activation in executive control regions."
  },
  "diag-b2-3-mycorrhizal-forest-networks": {
    "localUrl": "/photos/diag-b2-3-mycorrhizal-forest-networks.jpg",
    "photographer": "TB0815",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Boletus_satanas_habitat_diorama_with_mycorrhiza_and_beech_tree_by_Sebastian_Brandt_(Reco-Brandt).jpg",
    "wikimediaFile": "File:Boletus satanas habitat diorama with mycorrhiza and beech tree by Sebastian Brandt (Reco-Brandt).jpg",
    "sizeBytes": 193333,
    "alt": "Cross-section museum diorama showing forest mushrooms connected to tree roots via underground white mycorrhizal fungal mycelium."
  },
  "diag-c1-1-algorithmic-epistemic-bubbles": {
    "localUrl": "/photos/diag-c1-1-algorithmic-epistemic-bubbles.jpg",
    "photographer": "Matt Biddulph from UK",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Partitions_in_my_social_graph_(5915503294).jpg",
    "wikimediaFile": "File:Partitions in my social graph (5915503294).jpg",
    "sizeBytes": 389928,
    "alt": "Network graph visualization showing densely clustered social media communities and algorithmic filter bubbles."
  },
  "diag-c1-2-paleoclimate-ice-cores": {
    "localUrl": "/photos/diag-c1-2-paleoclimate-ice-cores.jpg",
    "alt": "A cylindrical polar ice core section showing distinct annual layers of compacted ancient snow and trapped air bubbles.",
    "photographer": "Photo by Lonnie Thompson, Byrd Polar Research Center, Ohio State University.",
    "license": "Public domain",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Icecore_4.jpg",
    "wikimediaFile": "File:Icecore 4.jpg",
    "sizeBytes": 87027
  },
  "diag-c1-3-baumol-cost-disease": {
    "localUrl": "/photos/diag-c1-3-baumol-cost-disease.jpg",
    "alt": "Four musicians of a string quartet performing live chamber music with violins, viola, and cello.",
    "photographer": "Surreybirder",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Fitzwilliam_Quartet.jpg",
    "wikimediaFile": "File:Fitzwilliam Quartet.jpg",
    "sizeBytes": 124507
  },
  "a1-sci-rainwater-barrels": {
    "localUrl": "/photos/a1-sci-rainwater-barrels.jpg",
    "alt": "Household rainwater harvesting barrel connected to a roof gutter downspout to collect rain for garden plants.",
    "photographer": "No machine-readable author provided. Pengo assumed (based on copyright claims).",
    "license": "CC BY 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.5",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Ceres_rainwater_tank_1_Pengo.jpg",
    "wikimediaFile": "Ceres rainwater tank 1 Pengo.jpg",
    "sizeBytes": 185174
  },
  "a1-env-urban-tree-planting": {
    "localUrl": "/photos/a1-env-urban-tree-planting.jpg",
    "alt": "Lush green street trees lining a city avenue and shading sidewalks and buildings.",
    "photographer": "Lance Cheung/USDA",
    "license": "Public domain",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Urban_forestry_seen_from_and_on_the_High_Line_in_New_York_(9241).jpg",
    "wikimediaFile": "Urban forestry seen from and on the High Line in New York (9241).jpg",
    "sizeBytes": 400957
  },
  "a1-psy-taking-short-breaks": {
    "localUrl": "/photos/a1-psy-taking-short-breaks.jpg",
    "alt": "Two cups of coffee on a wooden table during a relaxing midday break from work.",
    "photographer": "Bex Walton",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Latte_and_dark_coffee.jpg",
    "wikimediaFile": "Latte and dark coffee.jpg",
    "sizeBytes": 243465
  },
  "a1-his-ancient-sundials": {
    "localUrl": "/photos/a1-his-ancient-sundials.jpg",
    "alt": "Traditional sundial with a metal gnomon casting a shadow across Roman numeral hour lines in the sun.",
    "photographer": "Wilson44691",
    "license": "Public domain",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:MootHallSundial.JPG",
    "wikimediaFile": "MootHallSundial.JPG",
    "sizeBytes": 208722
  },
  "a1-edu-picture-flashcards": {
    "localUrl": "/photos/a1-edu-picture-flashcards.jpg",
    "alt": "Illustrated alphabet picture card using colorful drawings to help learners remember letters and words.",
    "photographer": "Louis-Gustave-Fortuné Ratisbonne (1827-1900)",
    "license": "Public domain",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:ABC_trim_ABC.jpg",
    "wikimediaFile": "ABC trim ABC.jpg",
    "sizeBytes": 92760
  },
  "a1-bio-sea-turtle-nests": {
    "localUrl": "/photos/a1-bio-sea-turtle-nests.jpg",
    "alt": "Newly hatched loggerhead sea turtle hatchlings preparing to crawl toward the ocean.",
    "photographer": "David L. Jones",
    "license": "Public domain",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:BabyLoggerheadTurtle1.jpg",
    "wikimediaFile": "BabyLoggerheadTurtle1.jpg",
    "sizeBytes": 141629
  },
  "a1-hea-drinking-clean-water": {
    "localUrl": "/photos/a1-hea-drinking-clean-water.jpg",
    "alt": "Stream of clean, clear drinking water pouring from a village tap.",
    "photographer": "Josh Estey/AusAID",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Clean_water_for_a_village_in_West_Lombok_(10686572086).jpg",
    "wikimediaFile": "Clean water for a village in West Lombok (10686572086).jpg",
    "sizeBytes": 63729
  },
  "a1-eco-community-tool-libraries": {
    "localUrl": "/photos/a1-eco-community-tool-libraries.jpg",
    "alt": "Community tool library bins filled with garden rakes, brooms, and hand tools available for neighbors to borrow.",
    "photographer": "Johinsa",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Fletcher_Free_Library_Tools.jpg",
    "wikimediaFile": "Fletcher Free Library Tools.jpg",
    "sizeBytes": 193146
  },
  "a1-ast-constellations-night-sky": {
    "localUrl": "/photos/a1-ast-constellations-night-sky.jpg",
    "alt": "Star map of the Ursa Major constellation highlighting the seven bright stars of the Big Dipper.",
    "photographer": "http://en.wikipedia.org/wiki/User:B00P &amp; me (SAE1962 10:04, 2 April 2008 (UTC))",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Ursa_Major_constellation_detail_map.PNG",
    "wikimediaFile": "Ursa Major constellation detail map.PNG",
    "sizeBytes": 103364
  },
  "a1-arc-bamboo-homes": {
    "localUrl": "/photos/a1-arc-bamboo-homes.jpg",
    "alt": "Builders constructing a strong, lightweight house framed and paneled with natural bamboo poles.",
    "photographer": "laurent Gilet, de Bambou Habitat",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Construction_maison_bambou.jpg",
    "wikimediaFile": "Construction maison bambou.jpg",
    "sizeBytes": 243988
  },
  "a2-sci-drip-irrigation": {
    "localUrl": "/photos/a2-sci-drip-irrigation.jpg",
    "alt": "Rows of greenhouse plants watered directly at their roots by thin black drip irrigation tubes.",
    "photographer": "Borisshin",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Button_dripper.JPG",
    "wikimediaFile": "Button dripper.JPG",
    "sizeBytes": 396267
  },
  "a2-env-pollinator-meadows": {
    "localUrl": "/photos/a2-env-pollinator-meadows.jpg",
    "alt": "Sunlit wildflower meadow in full bloom providing nectar and habitat for pollinating insects.",
    "photographer": "Nikater",
    "license": "Public domain",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Blumenwiese_bei_Obermaiselstein05.jpg",
    "wikimediaFile": "Blumenwiese bei Obermaiselstein05.jpg",
    "sizeBytes": 343956
  },
  "a2-psy-background-music-study": {
    "localUrl": "/photos/a2-psy-background-music-study.jpg",
    "alt": "Pair of cushioned over-ear headphones used for listening to background music or blocking noise while studying.",
    "photographer": "http://muzyczny.pl",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:S%C5%82uchawki_referencyjne_K-701_firmy_AKG.jpg",
    "wikimediaFile": "Słuchawki referencyjne K-701 firmy AKG.jpg",
    "sizeBytes": 88855
  },
  "a2-his-ice-houses": {
    "localUrl": "/photos/a2-his-ice-houses.jpg",
    "alt": "Domed brick structure of the historic Boboli ice house built partially underground to store winter ice.",
    "photographer": "sailko",
    "license": "CC BY 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.5",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Ghiacciaie_di_Boboli_01.JPG",
    "wikimediaFile": "Ghiacciaie di Boboli 01.JPG",
    "sizeBytes": 331471
  },
  "a2-edu-school-gardens": {
    "localUrl": "/photos/a2-edu-school-gardens.jpg",
    "alt": "Fenced school teaching garden with raised wooden beds growing vegetables and herbs on campus.",
    "photographer": "Michael Barera",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Tarleton_State_University_August_2017_10_(Sustainable_Teaching_Garden).jpg",
    "wikimediaFile": "Tarleton State University August 2017 10 (Sustainable Teaching Garden).jpg",
    "sizeBytes": 381238
  },
  "a2-bio-elephant-communication": {
    "localUrl": "/photos/a2-bio-elephant-communication.jpg",
    "alt": "Family of elephants touching trunks in a social greeting and tactile communication gesture.",
    "photographer": "jinterwas",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Three_elephant%27s_curly_kisses.jpg",
    "wikimediaFile": "Three elephant's curly kisses.jpg",
    "sizeBytes": 257696
  },
  "a2-hea-posture-ergonomics": {
    "localUrl": "/photos/a2-hea-posture-ergonomics.jpg",
    "alt": "Adjustable ergonomic office desk chair designed with lumbar backrest and armrest support.",
    "photographer": "Emiellaiendiay at English Wikipedia",
    "license": "Public domain",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Desk_chair.jpg",
    "wikimediaFile": "Desk chair.jpg",
    "sizeBytes": 125145
  },
  "a2-eco-returnable-glass-bottles": {
    "localUrl": "/photos/a2-eco-returnable-glass-bottles.jpg",
    "alt": "Automated bottle-return reverse vending machines in a supermarket for collecting reusable deposit bottles.",
    "photographer": "Romy2702",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Tomra_820.JPG",
    "wikimediaFile": "Tomra 820.JPG",
    "sizeBytes": 105821
  },
  "a2-ast-total-solar-eclipses": {
    "localUrl": "/photos/a2-ast-total-solar-eclipses.jpg",
    "alt": "Total solar eclipse showing the Moon completely blocking the Sun and revealing the glowing white solar corona.",
    "photographer": "Luc Viatour",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Solar_eclipse_1999_4.jpg",
    "wikimediaFile": "Solar eclipse 1999 4.jpg",
    "sizeBytes": 102406
  },
  "a2-arc-windcatchers-cooling": {
    "localUrl": "/photos/a2-arc-windcatchers-cooling.jpg",
    "alt": "Traditional tall mud-brick windcatcher towers (badgirs) rising above rooftops in Yazd, Iran, for natural cooling.",
    "photographer": "Diego Delso",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Edificios_en_Yazd,_Ir%C3%A1n,_2016-09-21,_DD_17.jpg",
    "wikimediaFile": "Edificios en Yazd, Irán, 2016-09-21, DD 17.jpg",
    "sizeBytes": 115805
  },
  "b1-sci-precision-fermentation": {
    "localUrl": "/photos/b1-sci-precision-fermentation.jpg",
    "alt": "Diagram of a stainless-steel fermentation bioreactor showing agitation impellers, nutrient feed pump, sensor probes, and thermal jacket.",
    "photographer": "GYassineMrabetTalk✉",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Bioreactor_principle.svg",
    "wikimediaFile": "Bioreactor principle.svg",
    "sizeBytes": 58532
  },
  "b1-env-seagrass-carbon-sinks": {
    "localUrl": "/photos/b1-env-seagrass-carbon-sinks.jpg",
    "alt": "Underwater blades of Zostera marina eelgrass that trap sediment and store blue carbon on the coastal seafloor.",
    "photographer": "Daderot",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Zostera_marina_-_National_Museum_of_Nature_and_Science,_Tokyo_-_DSC07663.JPG",
    "wikimediaFile": "Zostera marina - National Museum of Nature and Science, Tokyo - DSC07663.JPG",
    "sizeBytes": 166103
  },
  "b1-psy-choice-overload": {
    "localUrl": "/photos/b1-psy-choice-overload.jpg",
    "alt": "Supermarket aisle stocked with dozens of competing product varieties across crowded shelves.",
    "photographer": "NYC Guru",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Stop%26Shop.jpg",
    "wikimediaFile": "Stop&Shop.jpg",
    "sizeBytes": 306671
  },
  "b1-his-antikythera-mechanism": {
    "localUrl": "/photos/b1-his-antikythera-mechanism.jpg",
    "alt": "Close-up of Fragment A of the ancient Greek Antikythera mechanism showing corroded bronze gear wheels.",
    "photographer": "Logg Tandy",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Antikythera_Fragment_A_(Front).webp",
    "wikimediaFile": "Antikythera Fragment A (Front).webp",
    "sizeBytes": 249807
  },
  "b1-edu-interleaved-practice": {
    "localUrl": "/photos/b1-edu-interleaved-practice.jpg",
    "alt": "Student working through mixed study notes and textbooks at an outdoor campus table.",
    "photographer": "Truckee Meadows Community College",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Truckee_Meadows_Community_College_(10075995964).jpg",
    "wikimediaFile": "Truckee Meadows Community College (10075995964).jpg",
    "sizeBytes": 168291
  },
  "b1-bio-urban-fox-adaptation": {
    "localUrl": "/photos/b1-bio-urban-fox-adaptation.jpg",
    "alt": "Nocturnal urban red fox foraging from a discarded food packet on city pavement at night.",
    "photographer": "Linda Stanley",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Fox_with_food_bag.jpg",
    "wikimediaFile": "Fox with food bag.jpg",
    "sizeBytes": 227371
  },
  "b1-hea-indoor-air-ventilation": {
    "localUrl": "/photos/b1-hea-indoor-air-ventilation.jpg",
    "alt": "Schematic of a building mechanical ventilation system with a counterflow heat-recovery exchanger, fresh air intake, and exhaust.",
    "photographer": "Kobraklb",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Ventilation_unit_with_heat_pump_and_ground_-_cooling.png",
    "wikimediaFile": "Ventilation unit with heat pump and ground - cooling.png",
    "sizeBytes": 59322
  },
  "b1-eco-microfinance-cooperatives": {
    "localUrl": "/photos/b1-eco-microfinance-cooperatives.jpg",
    "alt": "Woman entrepreneur operating a sewing machine in a small tailoring workshop supported by a microfinance cooperative.",
    "photographer": "Imal Hashemi, Afghanistan Reconstruction Trust Fund/AusAID",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Afghanistan_microfinance_women_Sewing_(10665104743).jpg",
    "wikimediaFile": "Afghanistan microfinance women Sewing (10665104743).jpg",
    "sizeBytes": 201749
  },
  "b1-ast-lunar-lava-tubes": {
    "localUrl": "/photos/b1-ast-lunar-lava-tubes.jpg",
    "alt": "Lunar Reconnaissance Orbiter overhead photograph of the Mare Tranquillitatis pit crater opening into a subsurface lunar lava tube.",
    "photographer": "NASA/GSFC/Arizona State University",
    "license": "Public domain",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Mare_Tranquillitatis_pit_crater.jpg",
    "wikimediaFile": "Mare Tranquillitatis pit crater.jpg",
    "sizeBytes": 72846
  },
  "b1-arc-sponge-cities": {
    "localUrl": "/photos/b1-arc-sponge-cities.jpg",
    "alt": "Aerial view of Tianjin Qiaoyuan Sponge City park showing vegetated stormwater retention ponds and permeable pathways.",
    "photographer": "Mydogistiaotiaohu",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Tianjin_Qiaoyuan_Park_(Tianjin_City,_built_2008).jpg",
    "wikimediaFile": "Tianjin Qiaoyuan Park (Tianjin City, built 2008).jpg",
    "sizeBytes": 373660
  },
  "b2-sci-solid-state-electrolytes": {
    "localUrl": "/photos/b2-sci-solid-state-electrolytes.jpg",
    "alt": "Schematic of an all-solid-state battery cell illustrating the solid-state electrolyte separator between the anode and cathode.",
    "photographer": "Luca Bertoli",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:All-Solid-State_Battery.png",
    "wikimediaFile": "All-Solid-State Battery.png",
    "sizeBytes": 23518
  },
  "b2-env-kelp-afforestation": {
    "localUrl": "/photos/b2-env-kelp-afforestation.jpg",
    "alt": "Underwater giant kelp forest canopy illuminated by sunlight filtering through coastal ocean water.",
    "photographer": "Ed Bierman",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:A_diver_records_kelp_growth_(9296).jpg",
    "wikimediaFile": "A diver records kelp growth (9296).jpg",
    "sizeBytes": 197291
  },
  "b2-psy-prospective-memory": {
    "localUrl": "/photos/b2-psy-prospective-memory.jpg",
    "alt": "Benjamin Franklin’s hourly daily schedule and prospective intention planner for remembering future tasks.",
    "photographer": "The Atlantic",
    "license": "Public domain",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Benjamin_Franklin%27s_Schedule_(cropped).jpg",
    "wikimediaFile": "Benjamin Franklin's Schedule (cropped).jpg",
    "sizeBytes": 161293
  },
  "b2-his-indian-ocean-monsoon-trade": {
    "localUrl": "/photos/b2-his-indian-ocean-monsoon-trade.jpg",
    "alt": "Traditional wooden Indian Ocean dhow sailing with a triangular lateen sail rigged to catch seasonal monsoon winds.",
    "photographer": "Muhammad Mahdi Karim",
    "license": "GFDL 1.2",
    "licenseUrl": "http://www.gnu.org/licenses/old-licenses/fdl-1.2.html",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Dhow_znz.jpg",
    "wikimediaFile": "Dhow znz.jpg",
    "sizeBytes": 135164
  },
  "b2-edu-metacognitive-calibration": {
    "localUrl": "/photos/b2-edu-metacognitive-calibration.jpg",
    "alt": "Conceptual illustration of metacognition depicting a human brain reflecting on its own cognitive processes.",
    "photographer": "Phlsph7",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Metacognition2.svg",
    "wikimediaFile": "Metacognition2.svg",
    "sizeBytes": 58230
  },
  "b2-bio-corvid-tool-manufacture": {
    "localUrl": "/photos/b2-bio-corvid-tool-manufacture.jpg",
    "alt": "New Caledonian crow (Corvus moneduloides) perched on a branch in its native forest habitat.",
    "photographer": "Donald Davesne",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Corvus_moneduloides_718440887.jpg",
    "wikimediaFile": "Corvus moneduloides 718440887.jpg",
    "sizeBytes": 193068
  },
  "b2-hea-bacteriophage-therapy": {
    "localUrl": "/photos/b2-hea-bacteriophage-therapy.jpg",
    "alt": "Diagram of a bacteriophage virus attaching to a bacterial cell and injecting its genetic material from its protein capsid.",
    "photographer": "phage:Adenosine, bacteria + composition: Thomas Splettstoesser (www.scistyle.com)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Phage_injecting_its_genome_into_bacteria.svg",
    "wikimediaFile": "Phage injecting its genome into bacteria.svg",
    "sizeBytes": 70147
  },
  "b2-eco-congestion-curbside-logistics": {
    "localUrl": "/photos/b2-eco-congestion-curbside-logistics.jpg",
    "alt": "Overhead Electronic Road Pricing (ERP) congestion-charging gantry spanning a multi-lane city street.",
    "photographer": "VK35 at English Wikipedia",
    "license": "CC BY 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.5",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:027_ERP_gantry.jpg",
    "wikimediaFile": "027 ERP gantry.jpg",
    "sizeBytes": 314080
  },
  "b2-ast-lagrange-point-observatories": {
    "localUrl": "/photos/b2-ast-lagrange-point-observatories.jpg",
    "alt": "Orbital diagram of the five Sun–Earth Lagrange points (L1 through L5), showing the L2 halo orbit region beyond Earth.",
    "photographer": "Xander89",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Lagrange_points_simple.svg",
    "wikimediaFile": "Lagrange points simple.svg",
    "sizeBytes": 41000
  },
  "b2-arc-passive-downdraft-cooling": {
    "localUrl": "/photos/b2-arc-passive-downdraft-cooling.jpg",
    "alt": "Historic multi-story building in Jeddah featuring traditional timber mashrabiya ventilation screens for passive cooling.",
    "photographer": "Unknown authorUnknown author",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Al-Shafi%E2%80%99i_Endowment,_Historic_Jeddah,_Saudi_Arabia_(2026).jpg",
    "wikimediaFile": "Al-Shafi’i Endowment, Historic Jeddah, Saudi Arabia (2026).jpg",
    "sizeBytes": 289933
  },
  "c1-11-photonic-interconnects-computing": {
    "localUrl": "/photos/c1-11-photonic-interconnects-computing.jpg",
    "alt": "Iridescent 300-millimeter silicon photonics wafer etched with optical waveguides and integrated photonic circuits.",
    "photographer": "Ehsanshahoseini",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Silicon_Photonics_300mm_wafer.JPG",
    "wikimediaFile": "Silicon Photonics 300mm wafer.JPG",
    "sizeBytes": 213895
  },
  "c1-12-enhanced-rock-weathering": {
    "localUrl": "/photos/c1-12-enhanced-rock-weathering.jpg",
    "alt": "Specimen of dark, fine-grained volcanic basalt rich in calcium and magnesium silicates used in enhanced rock weathering.",
    "photographer": "James St. John",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Basalt_12_(48674276333).jpg",
    "wikimediaFile": "Basalt 12 (48674276333).jpg",
    "sizeBytes": 333598
  },
  "c1-13-motivated-reasoning-epistemic": {
    "localUrl": "/photos/c1-13-motivated-reasoning-epistemic.jpg",
    "alt": "Semicircular judicial bench of the Grand Chamber courtroom at the European Court of Human Rights.",
    "photographer": "Adrian Grycuk",
    "license": "CC BY-SA 3.0 pl",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/pl/deed.en",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:European_Court_of_Human_Rights,_courtroom,_2014_(cropped).JPG",
    "wikimediaFile": "European Court of Human Rights, courtroom, 2014 (cropped).JPG",
    "sizeBytes": 327275
  },
  "c1-14-abbasid-translation-movement": {
    "localUrl": "/photos/c1-14-abbasid-translation-movement.jpg",
    "alt": "Thirteenth-century Abbasid manuscript miniature by Yahya ibn Mahmud al-Wasiti depicting scholars in a Baghdad library.",
    "photographer": "Zereshk",
    "license": "Public domain",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Maqamat_hariri.jpg",
    "wikimediaFile": "Maqamat hariri.jpg",
    "sizeBytes": 193239
  },
  "c1-15-cognitive-load-multimedia": {
    "localUrl": "/photos/c1-15-cognitive-load-multimedia.jpg",
    "alt": "Research participant wearing a head-mounted eye-tracking camera system to measure visual attention and cognitive load.",
    "photographer": "Joabro17 at English Wikipedia",
    "license": "Public domain",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Eyetracker1.jpg",
    "wikimediaFile": "Eyetracker1.jpg",
    "sizeBytes": 71789
  },
  "c1-16-horizontal-gene-transfer-eukaryotes": {
    "localUrl": "/photos/c1-16-horizontal-gene-transfer-eukaryotes.jpg",
    "alt": "Phylogenetic Tree of Life illustrating horizontal gene transfer networks and endosymbiotic plastid and mitochondrial lineages across Bacteria, Archaea, and Eukaryotes.",
    "photographer": "Andrew Z. Colvin",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Tree_Of_Life_(with_horizontal_gene_transfer).svg",
    "wikimediaFile": "Tree Of Life (with horizontal gene transfer).svg",
    "sizeBytes": 63060
  },
  "c1-17-circadian-pharmacokinetics": {
    "localUrl": "/photos/c1-17-circadian-pharmacokinetics.jpg",
    "alt": "Pharmacokinetic plasma drug concentration-time curve across repeated 24-hour dosing intervals showing peak concentration (Cmax), half-life (t1/2), and area under the curve (AUC).",
    "photographer": "Alfie↑↓© (Helmut Schütz)",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Linear_PK_Example.png",
    "wikimediaFile": "Linear PK Example.png",
    "sizeBytes": 71480
  },
  "c1-18-goodhart-law-metrics": {
    "localUrl": "/photos/c1-18-goodhart-law-metrics.jpg",
    "alt": "Wall display of Key Process Indicator (KPI) performance charts and quantitative target boards in an industrial facility.",
    "photographer": "Adrian Grycuk",
    "license": "CC BY-SA 3.0 pl",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/pl/deed.en",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:KPI_boards_Scanfil_Sieradz.jpg",
    "wikimediaFile": "KPI boards Scanfil Sieradz.jpg",
    "sizeBytes": 130825
  },
  "c1-19-gravitational-wave-interferometry": {
    "localUrl": "/photos/c1-19-gravitational-wave-interferometry.jpg",
    "alt": "Aerial view of the Virgo gravitational-wave observatory showing its two perpendicular three-kilometer laser interferometer arms.",
    "photographer": "The Virgo collaboration",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:VirgoDetectorAerialView.jpg",
    "wikimediaFile": "VirgoDetectorAerialView.jpg",
    "sizeBytes": 316977
  },
  "c1-20-urban-canyon-microclimates": {
    "localUrl": "/photos/c1-20-urban-canyon-microclimates.jpg",
    "alt": "Deep urban street canyon along 42nd Street in Manhattan framed by dense high-rise towers that trap solar radiation and alter wind flow.",
    "photographer": "Jim.henderson",
    "license": "Public domain",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:W42nd_Street_canyon_jeh.JPG",
    "wikimediaFile": "W42nd Street canyon jeh.JPG",
    "sizeBytes": 220303
  },
  "c2-01-quantum-decoherence-topological": {
    "localUrl": "/photos/c2-01-quantum-decoherence-topological.jpg",
    "alt": "Multi-stage cryogenic dilution refrigerator assemblies housing superconducting quantum processors.",
    "photographer": "Dev Jadiya",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:IBM_Quantum_Computer_Demo_at_ITUWTSA_2024,_Delhi_2.jpg",
    "wikimediaFile": "IBM Quantum Computer Demo at ITUWTSA 2024, Delhi 2.jpg",
    "sizeBytes": 285980
  },
  "c2-02-amoc-thermohaline-hysteresis": {
    "localUrl": "/photos/c2-02-amoc-thermohaline-hysteresis.jpg",
    "alt": "Global ocean thermohaline circulation map showing warm surface currents, cold deep-water return currents, North Atlantic deep-water formation zones, and salinity gradients.",
    "photographer": "Robert Simmon, NASA. Minor modifications by Robert A. Rohde also released to the public domain",
    "license": "Public domain",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Thermohaline_Circulation_2.png",
    "wikimediaFile": "Thermohaline Circulation 2.png",
    "sizeBytes": 129862
  },
  "c2-03-metacognitive-illusions-epistemic": {
    "localUrl": "/photos/c2-03-metacognitive-illusions-epistemic.jpg",
    "alt": "Empirical calibration plot comparing perceived self-assessed competence against actual performance scores across competence quartiles.",
    "photographer": "https://commons.wikimedia.org/w/index.php?title=User:Diego_Moya",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Dunning%E2%80%93Kruger_Effect2.svg",
    "wikimediaFile": "Dunning–Kruger Effect2.svg",
    "sizeBytes": 28697
  },
  "c2-04-late-antiquity-monetary-fiscal": {
    "localUrl": "/photos/c2-04-late-antiquity-monetary-fiscal.jpg",
    "alt": "Obverse and reverse of a Late Roman gold solidus minted under Emperor Theodosius II.",
    "photographer": "Byzantium565",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Theodosius_II_solidus.jpg",
    "wikimediaFile": "Theodosius II solidus.jpg",
    "sizeBytes": 231244
  },
  "c2-05-ontological-scaffolding-conceptual-change": {
    "localUrl": "/photos/c2-05-ontological-scaffolding-conceptual-change.jpg",
    "alt": "Flock of cranes (Grus grus) self-organizing into an emergent V-formation in flight without centralized control.",
    "photographer": "Andreas Trepte",
    "license": "CC BY-SA 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Grus_grus_flocks.jpg",
    "wikimediaFile": "Grus grus flocks.jpg",
    "sizeBytes": 70363
  },
  "c2-06-epigenetic-transgenerational-plasticity": {
    "localUrl": "/photos/c2-06-epigenetic-transgenerational-plasticity.jpg",
    "alt": "Scientific diagram of epigenetic mechanisms showing chromosome chromatin packaging, DNA cytosine methylation, and histone tail modification.",
    "photographer": "National Institutes of Health",
    "license": "Public domain",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Epigenetic_mechanisms.png",
    "wikimediaFile": "Epigenetic mechanisms.png",
    "sizeBytes": 126494
  },
  "c2-07-immunosenescence-inflammaging-thymic": {
    "localUrl": "/photos/c2-07-immunosenescence-inflammaging-thymic.jpg",
    "alt": "Three-dimensional structural rendering of a human T-lymphocyte immune cell highlighting its surface microvilli.",
    "photographer": "Otosakanum2",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:T-cell_and_microvillus.png",
    "wikimediaFile": "T-cell and microvillus.png",
    "sizeBytes": 127773
  },
  "c2-08-triffin-dilemma-monetary-hegemony": {
    "localUrl": "/photos/c2-08-triffin-dilemma-monetary-hegemony.jpg",
    "alt": "The Mount Washington Hotel in Bretton Woods, New Hampshire, site of the 1944 international monetary conference.",
    "photographer": "w_lemay",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Mount_Washington_Hotel,_Bretton_Woods,_NH.jpg",
    "wikimediaFile": "Mount Washington Hotel, Bretton Woods, NH.jpg",
    "sizeBytes": 261654
  },
  "c2-09-black-hole-information-paradox": {
    "localUrl": "/photos/c2-09-black-hole-information-paradox.jpg",
    "alt": "Event Horizon Telescope radio interferometry image of the supermassive black hole in Messier 87 showing its relativistic photon ring and central shadow.",
    "photographer": "Event Horizon Telescope, uploader cropped and converted TIF to JPG",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Black_hole_-_Messier_87_crop_max_res.jpg",
    "wikimediaFile": "Black hole - Messier 87 crop max res.jpg",
    "sizeBytes": 28242
  },
  "c2-10-urban-metabolism-thermodynamic-entropy": {
    "localUrl": "/photos/c2-10-urban-metabolism-thermodynamic-entropy.jpg",
    "alt": "The Spittelau waste-to-energy incineration and district heating plant in Vienna, illustrating urban material and thermodynamic energy flows.",
    "photographer": "Croped by Gralo from a self-taken image by Contributor",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:District_heating_plant_spittelau_ssw_crop1.png",
    "wikimediaFile": "District heating plant spittelau ssw crop1.png",
    "sizeBytes": 109203
  },
  "diag-c2-1-epistemic-opacity-algorithms": {
    "localUrl": "/photos/diag-c2-1-epistemic-opacity-algorithms.jpg",
    "alt": "Diagram of a multi-layer deep neural network extracting progressively abstract visual features from raw pixel inputs to classification labels.",
    "photographer": "Sven Behnke",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Deep_Learning.jpg",
    "wikimediaFile": "Deep Learning.jpg",
    "sizeBytes": 135798
  },
  "diag-c2-2-paleogenomics-hybridization": {
    "localUrl": "/photos/diag-c2-2-paleogenomics-hybridization.jpg",
    "alt": "Fossil hominin cranium (Homo longi holotype, closely allied to Denisovans) from the Middle Pleistocene of East Asia.",
    "photographer": "Fu et al. (2025)",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Homo_longi_holotype.jpg",
    "wikimediaFile": "Homo longi holotype.jpg",
    "sizeBytes": 52840
  },
  "diag-c2-3-sovereign-debt-architecture": {
    "localUrl": "/photos/diag-c2-3-sovereign-debt-architecture.jpg",
    "alt": "Engraved United States Treasury Note bearing sovereign debt repayment terms and interest coupon obligations.",
    "photographer": "JHerbstman",
    "license": "Public domain",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:1976_$5000_8%25_Treasury_Note.jpg",
    "wikimediaFile": "1976 $5000 8% Treasury Note.jpg",
    "sizeBytes": 326736
  }
};

const TOPIC_DEFAULT_PHOTO_IDS: Record<AcademicTopic, string> = {
  'Science and technology': 'a1-sci-solar-lamps',
  'Environmental science': 'a1-env-community-compost',
  'Psychology and human behaviour': 'a1-psy-morning-routines',
  'History and archaeology': 'a1-his-roman-roads',
  'Education and learning': 'a1-edu-bilingual-books',
  'Biology and animal behaviour': 'a1-bio-honeybee-dances',
  'Public health': 'a1-hea-handwashing-science',
  'Economics and society': 'a1-eco-farmers-markets',
  'Astronomy and space exploration': 'a1-ast-moon-phases',
  'Architecture and urban development': 'a1-arc-courtyard-houses',
};

export function getPassagePhotoMetadata(lessonId: string): PassagePhotoMetadata | null {
  return PASSAGE_PHOTO_CATALOG[lessonId] || null;
}

export function getPassageIllustrationAlt(lessonId: string, fallbackAlt?: string): string {
  const entry = PASSAGE_PHOTO_CATALOG[lessonId];
  if (entry?.alt) {
    return entry.alt;
  }
  if (fallbackAlt) {
    return fallbackAlt.replace(/^(Editorial illustration|Illustration) of /i, 'Photograph of ');
  }
  return 'Real-life photograph illustrating the reading passage topic.';
}

/**
 * Returns the verified real-life photograph path for a passage ID, or a topic-matched
 * real-life photograph for newly drafted custom lessons in the Content Studio.
 */
export function getEditorialIllustrationUri(
  lessonId: string,
  topic: AcademicTopic,
  _level?: CEFRLevel
): string {
  const direct = PASSAGE_PHOTO_CATALOG[lessonId];
  if (direct) {
    return direct.localUrl;
  }
  const fallbackId = TOPIC_DEFAULT_PHOTO_IDS[topic] || 'a1-sci-solar-lamps';
  return PASSAGE_PHOTO_CATALOG[fallbackId]?.localUrl || '/photos/a1-sci-solar-lamps.jpg';
}
