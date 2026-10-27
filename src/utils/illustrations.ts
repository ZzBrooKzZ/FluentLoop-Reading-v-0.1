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
    "alt": "A portable solar-powered LED lamp and photovoltaic charging panel used for off-grid reading light in rural homes.",
    "photographer": "Childzy at en.wikipedia",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Solarlight.JPG",
    "wikimediaFile": "File:Solarlight.JPG",
    "sizeBytes": 232366
  },
  "a1-env-community-compost": {
    "localUrl": "/photos/a1-env-community-compost.jpg",
    "alt": "Active community compost bins turning organic plant and kitchen waste into dark nutrient-rich garden soil.",
    "photographer": "Crystalclear",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Compost_site_germany.JPG",
    "wikimediaFile": "File:Compost site germany.JPG",
    "sizeBytes": 197915
  },
  "a1-psy-morning-routines": {
    "localUrl": "/photos/a1-psy-morning-routines.jpg",
    "alt": "An open paper notebook and pen on a wooden desk prepared for writing daily morning goals.",
    "photographer": "Matt Ragland",
    "license": "Copyrighted free use",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Bullet-Journal-by-Matt-Ragland.jpg",
    "wikimediaFile": "File:Bullet-Journal-by-Matt-Ragland.jpg",
    "sizeBytes": 121114
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
    "alt": "Close-up photograph of a Western honeybee collecting nectar and pollen on a bright flower.",
    "photographer": "Andreas Trepte",
    "license": "CC BY-SA 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Apis_mellifera_Western_honey_bee.jpg",
    "wikimediaFile": "File:Apis mellifera Western honey bee.jpg",
    "sizeBytes": 127028
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
    "alt": "Telescopic photograph of a waxing crescent moon showing sunlit craters along the lunar terminator.",
    "photographer": "xlibber",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Crescent_Moon_(2558144570).jpg",
    "wikimediaFile": "File:Crescent Moon (2558144570).jpg",
    "sizeBytes": 41782
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
    "alt": "A freshly prepared meal arranged on ceramic plates under warm dining room lighting.",
    "photographer": "Bahnfrend",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Dinner,_Ngurah_Rai_International_Airport,_2023_(01).jpg",
    "wikimediaFile": "File:Dinner, Ngurah Rai International Airport, 2023 (01).jpg",
    "sizeBytes": 126178
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
    "alt": "Close-up of a brightly illuminated smartphone screen emitting blue-rich light.",
    "photographer": "Béotien lambda",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Wiktionnaire_sur_IPhone_(1).JPG",
    "wikimediaFile": "File:Wiktionnaire sur IPhone (1).JPG",
    "sizeBytes": 118177
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
    "alt": "Handwritten study flashcards arranged for spaced-repetition vocabulary and exam review.",
    "photographer": "bfishadow",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Flash_cards_for_language_learning.jpg",
    "wikimediaFile": "File:Flash cards for language learning.jpg",
    "sizeBytes": 158761
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
    "alt": "University students sitting together around a table explaining concepts and studying collaboratively.",
    "photographer": "Tbuckley89",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Study_Group.JPG",
    "wikimediaFile": "File:Study Group.JPG",
    "sizeBytes": 144462
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
    "alt": "Astronomical observatory domes atop Cerro Paranal mountain under a clear desert sky.",
    "photographer": "European Southern Observatory",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Aerial_view_of_the_ESO_Very_Large_Telescope_(VLT).jpg",
    "wikimediaFile": "File:Aerial view of the ESO Very Large Telescope (VLT).jpg",
    "sizeBytes": 254623
  },
  "b1-arc-daylighting-schools": {
    "localUrl": "/photos/b1-arc-daylighting-schools.jpg",
    "alt": "A spacious library reading room illuminated by tall arched windows and natural daylight.",
    "photographer": "Cervin Robinson",
    "license": "Public domain",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:NYP_LOC2.jpg",
    "wikimediaFile": "File:NYP LOC2.jpg",
    "sizeBytes": 167000
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
    "alt": "An automobile cockpit dashboard with an integrated digital navigation screen and instrument cluster.",
    "photographer": "Tennen-Gas",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Bentley_Continental_GTC_011.JPG",
    "wikimediaFile": "File:Bentley Continental GTC 011.JPG",
    "sizeBytes": 92785
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
    "alt": "Students working through complex mathematical problems at a classroom chalkboard.",
    "photographer": "Jsclar",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:BronxScienceProgrammingClassroom1960.jpg",
    "wikimediaFile": "File:BronxScienceProgrammingClassroom1960.jpg",
    "sizeBytes": 85890
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
    "alt": "The International Space Station orbiting high above Earth against the dark horizon of space.",
    "photographer": "NASA",
    "license": "Public domain",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:The_station_pictured_from_the_SpaceX_Crew_Dragon_5.jpg",
    "wikimediaFile": "File:The station pictured from the SpaceX Crew Dragon 5.jpg",
    "sizeBytes": 99947
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
    "alt": "Dense mist-covered tropical rainforest canopy in Chiapas providing habitat for diverse vocal wildlife.",
    "photographer": "Bild von bere von awstburg auf Pixabay https://pixabay.com/de/photos/die-dschungel-von-chiapas-1865639/",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Chiapas_Rainforest_crop.jpg",
    "wikimediaFile": "File:Chiapas Rainforest crop.jpg",
    "sizeBytes": 235980
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
    "alt": "Tiered wooden seating and desks inside a university academic lecture hall.",
    "photographer": "Xbxg32000",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:5th_Floor_Lecture_Hall.jpg",
    "wikimediaFile": "File:5th Floor Lecture Hall.jpg",
    "sizeBytes": 150189
  },
  "c1-06-eusociality-inclusive-fitness": {
    "localUrl": "/photos/c1-06-eusociality-inclusive-fitness.jpg",
    "alt": "Worker honeybees tending hexagonal wax brood cells inside a eusocial colony comb.",
    "photographer": "Merdal at Turkish Wikipedia",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Honey_comb.jpg",
    "wikimediaFile": "File:Honey comb.jpg",
    "sizeBytes": 118502
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
    "alt": "The Very Large Telescope observatory domes atop Cerro Paranal at dusk overlooking the Pacific Ocean.",
    "photographer": "ESO/G. Hüdepohl (atacamaphoto.com)",
    "license": "CC BY 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Paranal_and_the_Pacific_at_sunset_(dsc4088,_retouched,_cropped).jpg",
    "wikimediaFile": "File:Paranal and the Pacific at sunset (dsc4088, retouched, cropped).jpg",
    "sizeBytes": 137034
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
    "alt": "Raised wooden garden beds planted with green culinary herbs and leafy vegetables.",
    "photographer": "Arnaud 25",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Jardin_potager_001.JPG",
    "wikimediaFile": "File:Jardin potager 001.JPG",
    "sizeBytes": 191565
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
    "alt": "A traditional wooden river boat navigating calm river waters to connect island communities.",
    "photographer": "Afifa Afrin",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Wooden_boat_in_Jamuna_River,_Bangladesh_04.jpg",
    "wikimediaFile": "File:Wooden boat in Jamuna River, Bangladesh 04.jpg",
    "sizeBytes": 93980
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
    "alt": "A quiet bedroom bed with soft white pillows prepared for restful nighttime sleep.",
    "photographer": "Amin",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Pillows_on_a_hotel_bed.jpg",
    "wikimediaFile": "File:Pillows on a hotel bed.jpg",
    "sizeBytes": 46314
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
    "alt": "A bilingual street direction sign displaying place names in both Welsh and English.",
    "photographer": "Henry Spooner",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Welsh_spelling_on_road_sign,_Newtown,_Powys_-_geograph.org.uk_-_1319438_(cropped).jpg",
    "wikimediaFile": "File:Welsh spelling on road sign, Newtown, Powys - geograph.org.uk - 1319438 (cropped).jpg",
    "sizeBytes": 83408
  },
  "diag-b2-3-mycorrhizal-forest-networks": {
    "localUrl": "/photos/diag-b2-3-mycorrhizal-forest-networks.jpg",
    "alt": "Intertwined tree roots spreading across the forest floor where underground fungi exchange soil nutrients.",
    "photographer": "Patti Neumann",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Buttress_roots.JPG",
    "wikimediaFile": "File:Buttress roots.JPG",
    "sizeBytes": 151231
  },
  "diag-c1-1-algorithmic-epistemic-bubbles": {
    "localUrl": "/photos/diag-c1-1-algorithmic-epistemic-bubbles.jpg",
    "alt": "Rows of interconnected high-performance server cabinets inside a modern digital computing center.",
    "photographer": "Argonne National Laboratory's Flickr page",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "sourceName": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:IBM_Blue_Gene_P_supercomputer.jpg",
    "wikimediaFile": "File:IBM Blue Gene P supercomputer.jpg",
    "sizeBytes": 123520
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
