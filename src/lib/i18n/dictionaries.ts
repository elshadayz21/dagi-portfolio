import { Locale } from "./config";

export interface Dictionary {
  common: {
    brandName: string;
    representativeName: string;
    representativeTitle: string;
    callNow: string;
    chatWhatsapp: string;
    requestQuote: string;
    viewInventory: string;
    inStock: string;
    preOrder: string;
    outOfStock: string;
    horsepower: string;
    engine: string;
    transmission: string;
    drive: string;
    price: string;
    details: string;
    contactUs: string;
    allRightsReserved: string;
    verifiedDistributor: string;
    dutyFreeAvailable: string;
  };
  nav: {
    home: string;
    tractors: string;
    aboutDagim: string;
    serviceAreas: string;
    testimonials: string;
    contact: string;
    adminPortal: string;
  };
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    consultantIntro: string;
    talkToDagim: string;
    browseTractors: string;
    statsTractors: string;
    statsFarmers: string;
    statsRegions: string;
    statsWarranty: string;
  };
  features: {
    whyTekhaf: string;
    whyTekhafSub: string;
    f1Title: string;
    f1Desc: string;
    f2Title: string;
    f2Desc: string;
    f3Title: string;
    f3Desc: string;
    f4Title: string;
    f4Desc: string;
  };
  productsPage: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allBrands: string;
    allHPs: string;
    allAvailability: string;
    clearFilters: string;
    showingResults: string;
    noResults: string;
    requestSpecSheet: string;
  };
  contactForm: {
    title: string;
    subtitle: string;
    nameLabel: string;
    phoneLabel: string;
    emailLabel: string;
    regionLabel: string;
    productLabel: string;
    farmSizeLabel: string;
    messageLabel: string;
    submitButton: string;
    submitting: string;
    successMessage: string;
    errorMessage: string;
  };
}

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    common: {
      brandName: "Tekhaf Trading",
      representativeName: "Dagim Melese",
      representativeTitle: "Agricultural Machinery Sales Specialist",
      callNow: "Call Now",
      chatWhatsapp: "WhatsApp Dagim",
      requestQuote: "Request Price Quote",
      viewInventory: "View Tractor Inventory",
      inStock: "In Stock - Ready for Delivery",
      preOrder: "Available for Pre-Order",
      outOfStock: "Temporarily Sold Out",
      horsepower: "Horsepower",
      engine: "Engine",
      transmission: "Transmission",
      drive: "Drive Type",
      price: "Price",
      details: "View Specifications",
      contactUs: "Contact Dagim",
      allRightsReserved: "All rights reserved. Tekhaf Trading Ethiopia.",
      verifiedDistributor: "Authorized Agricultural Machinery Distributor",
      dutyFreeAvailable: "Duty-Free Purchase Advisory Available",
    },
    nav: {
      home: "Home",
      tractors: "Tractors & Machinery",
      aboutDagim: "About Dagim Melese",
      serviceAreas: "Service Areas",
      testimonials: "Farmer Stories",
      contact: "Get a Quote",
      adminPortal: "Admin CRM",
    },
    hero: {
      badge: "Tekhaf Trading • Dagim Melese Sales Portfolio",
      headline: "Trusted Tractor Solutions for Ethiopian Farmers",
      subheadline: "Commercial-grade tractors, genuine spare parts, and on-farm mechanic support across Oromia, Amhara, Sidama, Somali Region, and Addis Ababa.",
      consultantIntro: "Meet Dagim Melese, Senior Tractor Sales Consultant at Tekhaf Trading. Helping Ethiopian farmers select the right machinery with full duty-free paperwork guidance and field warranty.",
      talkToDagim: "Speak Directly with Dagim",
      browseTractors: "Explore Tractors",
      statsTractors: "Tractors Delivered",
      statsFarmers: "Satisfied Farmers",
      statsRegions: "Regions Supported",
      statsWarranty: "1-Year Field Warranty",
    },
    features: {
      whyTekhaf: "Why Ethiopian Farmers Trust Tekhaf Trading & Dagim Melese",
      whyTekhafSub: "We don't just sell tractors; we guarantee long-term productivity on your farmland.",
      f1Title: "Ethiopian Soil-Engineered Machinery",
      f1Desc: "Tractors selected specifically for Ethiopian conditions—from heavy highland black clay to dryland river basins.",
      f2Title: "Genuine Perkins & OEM Spare Parts",
      f2Desc: "Central Addis Ababa warehouse packed with filters, hydraulic components, pumps, and engine kits.",
      f3Title: "Duty-Free Exemption Guidance",
      f3Desc: "Dagim assists eligible commercial farmers and cooperatives with customs clearance and investment certificates.",
      f4Title: "Field Delivery & Operator Training",
      f4Desc: "Direct transport to your farm with complete operator safety orientation and first-service inspection.",
    },
    productsPage: {
      title: "Agricultural Tractor Inventory",
      subtitle: "Explore high-performance 4WD and 2WD tractors from Massey Ferguson, Lovol, New Holland, and John Deere in Ethiopia.",
      searchPlaceholder: "Search by model, brand, or horsepower...",
      allBrands: "All Brands",
      allHPs: "All Horsepower",
      allAvailability: "All Availability",
      clearFilters: "Reset Filters",
      showingResults: "Displaying tractors",
      noResults: "No tractors match your filter criteria.",
      requestSpecSheet: "Download Spec Sheet & Quote",
    },
    contactForm: {
      title: "Request a Tractor Price Quote",
      subtitle: "Fill out the form below or message Dagim Melese directly on WhatsApp for an immediate quotation.",
      nameLabel: "Full Name",
      phoneLabel: "Phone Number (e.g., 0911234567)",
      emailLabel: "Email Address (Optional)",
      regionLabel: "Your Region / Location",
      productLabel: "Interested Tractor Model",
      farmSizeLabel: "Farm Size (Hectares - Optional)",
      messageLabel: "Tell Us About Your Farm or Inquiries",
      submitButton: "Send Inquiry to Dagim",
      submitting: "Submitting Inquiry...",
      successMessage: "Thank you! Dagim Melese has received your inquiry and will contact you promptly.",
      errorMessage: "An error occurred while submitting your inquiry. Please contact Dagim via WhatsApp or phone directly.",
    },
  },
  am: {
    common: {
      brandName: "ቴክሃፍ ትሬዲንግ",
      representativeName: "ዳግም መለሰ",
      representativeTitle: "የግብርና ማሽነሪ እና ትራክተር ሽያጭ ባለሙያ",
      callNow: "አሁን ይደውሉ",
      chatWhatsapp: "ዋትስአፕ በዳግም",
      requestQuote: "የዋጋ ማቅረቢያ ይጠይቁ",
      viewInventory: "የትራክተሮች ዝርዝር",
      inStock: "መጋዘን ውስጥ ዝግጁ",
      preOrder: "በቅድመ ትዕዛዝ የሚቀርብ",
      outOfStock: "ለጊዜው ያለቀ",
      horsepower: "የፈረስ ጉልበት (HP)",
      engine: "ሞተር",
      transmission: "ማርሽ ሳጥን",
      drive: "የጉተታ አይነት",
      price: "ዋጋ",
      details: "ዝርዝር መግለጫ",
      contactUs: "ዳግምን ያነጋግሩ",
      allRightsReserved: "መብቱ በህግ የተጠበቀ ነው። ቴክሃፍ ትሬዲንግ ኢትዮጵያ።",
      verifiedDistributor: "ህጋዊና የታመነ የግብርና ማሽነሪ አስመጪ",
      dutyFreeAvailable: "ከቀረጥ ነፃ የግዢ ማማከር አገልግሎት",
    },
    nav: {
      home: "ዋና ገጽ",
      tractors: "ትራክተሮችና ማሽነሪዎች",
      aboutDagim: "ስለ ዳግም መለሰ",
      serviceAreas: "የአገልግሎት ክልሎች",
      testimonials: "የአርሶ አደሮች ምስክርነት",
      contact: "ዋጋ ይጠይቁ",
      adminPortal: "አድሚን ዳሽቦርድ",
    },
    hero: {
      badge: "ቴክሃፍ ትሬዲንግ • የዳግም መለሰ ትራክተር ሽያጭ",
      headline: "ለኢትዮጵያ ገበሬዎች የታመኑ የትራክተር አማራጮች",
      subheadline: "ጥራት ያላቸው ትራክተሮች፣ ኦሪጅናል መለዋወጫዎች እና የመስክ የቴክኒክ ድጋፍ በኦሮሚያ፣ አማራ፣ ሲዳማ፣ ሶማሌ ክልል እና አዲስ አበባ።",
      consultantIntro: "በቴክሃፍ ትሬዲንግ ከፍተኛ የትራክተር ሽያጭ አማካሪ የሆኑትን ዳግም መለሰን ያግኙ። ተስማሚውን ማሽን እንዲመርጡ ከቀረጥ ነፃ የሰነድ ዝግጅት እና የ1 ዓመት ዋስትና ጋር ያማክራሉ።",
      talkToDagim: "ዳግምን በቀጥታ ያነጋግሩ",
      browseTractors: "ትራክተሮችን ይመልከቱ",
      statsTractors: "የተረከቡ ትራክተሮች",
      statsFarmers: "ረክተው የገዙ አርሶ አደሮች",
      statsRegions: "የሚሸፈኑ ክልሎች",
      statsWarranty: "የ1 ዓመት የመስክ ዋስትና",
    },
    features: {
      whyTekhaf: "የኢትዮጵያ አርሶ አደሮች ቴክሃፍ ትሬዲንግንና ዳግም መለሰን ለምን ይመርጣሉ?",
      whyTekhafSub: "ትራክተር ብቻ አንሸጥም፤ ለእርሻዎ ዘላቂ ምርታማነት አብረን እንቆማለን።",
      f1Title: "ለኢትዮጵያ አፈር ተስማሚ ማሽኖች",
      f1Desc: "ከደጋው ከባድ ጥቁር አፈር እስከ ቆላማው መስኖ ተፋሰስ ድረስ የሚቋቋሙ ብርቱ ትራክተሮች።",
      f2Title: "ኦሪጅናል ፐርኪንስ እና የፋብሪካ መለዋወጫዎች",
      f2Desc: "በአዲስ አበባ መጋዘናችን የተሟሉ ፊልተሮች፣ የሃይድሮሊክ ክፍሎች እና ሞተር መለዋወጫዎች።",
      f3Title: "ከቀረጥ ነፃ የሰነድ ማማከር",
      f3Desc: "ለኢንቨስትመንትና አርሶ አደሮች ማህበራት ከቀረጥ ነፃ የጉምሩክ ሰነድ ማስተናገድ ድጋፍ።",
      f4Title: "እስከ እርሻ ማድረስና ስልጠና",
      f4Desc: "ትራክተሩን እስከ እርሻዎ ማጓጓዝ እንዲሁም ለአሽከርካሪዎች የተሟላ የደህንነት እና አጠቃቀም ስልጠና።",
    },
    productsPage: {
      title: "የትራክተሮች ማውጫ",
      subtitle: "የሜሲ ፈርጉሰን፣ ሎቮል፣ ኒው ሆላንድ እና ጆን ዲር የግብርና ትራክተሮችን ይመርምሩ።",
      searchPlaceholder: "በሞዴል፣ በብራንድ ወይም በፈረስ ጉልበት ይፈልጉ...",
      allBrands: "ሁሉም ብራንዶች",
      allHPs: "ሁሉም የፈረስ ጉልበት",
      allAvailability: "ሁሉም ሁኔታዎች",
      clearFilters: "አጣራውን አጥፋ",
      showingResults: "የተገኙ ትራክተሮች",
      noResults: "በመረጡት መስፈርት የተገኘ ትራክተር የለም።",
      requestSpecSheet: "የዝርዝር መረጃ እና ዋጋ ይጠይቁ",
    },
    contactForm: {
      title: "የትራክተር ዋጋ ማቅረቢያ ይጠይቁ",
      subtitle: "ከታች ያለውን ቅጽ ይሙሉ ወይም በቀጥታ በዋትስአፕ ከዳግም መለሰ ጋር ይገናኙ።",
      nameLabel: "ሙሉ ስም",
      phoneLabel: "ስልክ ቁጥር (ምሳሌ፡ 0911234567)",
      emailLabel: "ኢሜይል (አማራጭ)",
      regionLabel: "የእርሻዎ ክልል / ቦታ",
      productLabel: "የሚፈልጉት የትራክተር አይነት",
      farmSizeLabel: "የእርሻ ስፋት በሄክታር (አማራጭ)",
      messageLabel: "ስለ እርሻዎ ተጨማሪ መረጃ ይፃፉልን",
      submitButton: "ጥያቄውን ለዳግም ላክ",
      submitting: "በመላክ ላይ...",
      successMessage: "እናመሰግናለን! ዳግም መለሰ ጥያቄዎን ተቀብሏል፣ በአፋጣኝ ያነጋግርዎታል።",
      errorMessage: "ስህተት ተፈጥሯል። እባክዎ በስልክ ወይም በዋትስአፕ በቀጥታ ያነጋግሩን።",
    },
  },
  or: {
    common: {
      brandName: "Tekhaf Trading",
      representativeName: "Daagim Mallasaa",
      representativeTitle: "Ogeessa Gurgurtaa Maashinoota Qonnaa",
      callNow: "Amma Bilbilaa",
      chatWhatsapp: "WhatsApp Daagim",
      requestQuote: "Gatii Gaafadhaa",
      viewInventory: "Tiraakteroota Ilaalaa",
      inStock: "Kuusaa Keessa Jira",
      preOrder: "Ajajaan Kan Dhihaatu",
      outOfStock: "Yeroof Dhumatee Jira",
      horsepower: "Humna Fardaa (HP)",
      engine: "Mootora",
      transmission: "Giiyarii",
      drive: "Akaakuu Guuttuu",
      price: "Gatii",
      details: "Bal'ina Isaa",
      contactUs: "Daagim Qunnamaa",
      allRightsReserved: "Mirgi hundaa kan eegame. Tekhaf Trading Itoophiyaa.",
      verifiedDistributor: "Dhiheessaa Maashinoota Qonnaa Seera Qabeessa",
      dutyFreeAvailable: "Gorsa Gurgurtaa Qaphxii Qaraxaa Malee",
    },
    nav: {
      home: "Fuula Duraa",
      tractors: "Tiraakteroota & Maashinoota",
      aboutDagim: "Waa'ee Daagim Mallasaa",
      serviceAreas: "Naannoolee Tajaajilaa",
      testimonials: "Muuxannoo Qonnaan Bulaa",
      contact: "Gatii Gaafadhaa",
      adminPortal: "Seensa Bulchiinsaa",
    },
    hero: {
      badge: "Tekhaf Trading • Gurgurtaa Tiraakteraa Daagim Mallasaa",
      headline: "Qonnaan Bulaa Itoophiyaaf Furmaata Tiraakteraa Amanamaa",
      subheadline: "Tiraakteroota qulqullina olaanaa qaban, suphaa fi qorannoo lafaa waliin Oromiyaa, Amaaraa, Sidaamaa fi Finfinnee keessatti.",
      consultantIntro: "Daagim Mallasaa, Gorsaa Gurgurtaa Tiraakteraa Tekhaf Trading waliin hojjedhaa. Maashinii sirrii filachuu fi waraqaa qaraxa malee qopheessuuf isin gargaara.",
      talkToDagim: "Daagim Waliin Dubbadhaa",
      browseTractors: "Tiraakteroota Filadhaa",
      statsTractors: "Tiraakteroota Dabarfaman",
      statsFarmers: "Qonnaan Bultoota Gammadani",
      statsRegions: "Naannoolee Tajaajilaman",
      statsWarranty: "Wabii Waggaa Tokkoo",
    },
    features: {
      whyTekhaf: "Maaliif Qonnaan Bultoonni Tekhaf Trading fi Daagim Filatu?",
      whyTekhafSub: "Tiraakterii qofa miti kan gurgurru; qonna keessaniif bu'a-qabeessummaa itti fufiinsa qabu mirkaneessina.",
      f1Title: "Biyyoo Itoophiyaaf Kan Mijaahu",
      f1Desc: "Biyyoo koticha Arsiitii hanga sulula jallisiitti qoramee kan filatame.",
      f2Title: "Qoqqowwan Jijjiirraa Qaamaa Oriinaala",
      f2Desc: "Kuusaa Finfinnee keessaa meeshaalee qulqullina qaban yeroo hunda argamu.",
      f3Title: "Gorsa Qaraxa Malee Galchuu",
      f3Desc: "Waldaalee fi qonnaan bultootaaf gorsa waraqaa qaraxa dhabamsiisuu.",
      f4Title: "Bakka Qonnaatti Dhiheessuu fi Leenjii",
      f4Desc: "Konkolaachiftootaaf leenjii of-eeggannoo fi tajaajila suphaa jalqabaa waliin.",
    },
    productsPage: {
      title: "Tarree Tiraakterootaa",
      subtitle: "Tiraakteroota Massey Ferguson, Lovol, New Holland fi John Deere filadhaa.",
      searchPlaceholder: "Moodeela, humna ykn gosaan barbaadaa...",
      allBrands: "Gosa Hunda",
      allHPs: "Humna Hunda",
      allAvailability: "Haala Hunda",
      clearFilters: "Qulqulleessi",
      showingResults: "Tiraakteroota argaman",
      noResults: "Tiraakteriin ulaagaa kanaan walsimu hin argamne.",
      requestSpecSheet: "Oodeeffannoo fi Gatii Gaafadhaa",
    },
    contactForm: {
      title: "Gatii Tiraakteraa Gaafadhaa",
      subtitle: "Unka armaan gadii guutaa ykn karaa WhatsApp Daagim Mallasaa qunnamaa.",
      nameLabel: "Maqaa Guutuu",
      phoneLabel: "Lakkoofsa Bilbilaa (fkn: 0911234567)",
      emailLabel: "Imeelii (Filannoo)",
      regionLabel: "Naannoo / Bakka Qonnaa",
      productLabel: "Moodeela Tiraakteraa Barbaaddan",
      farmSizeLabel: "Bal'ina Lafa Qonnaa (Hektaaraan)",
      messageLabel: "Waa'ee Qonna Keessanii Nuuf Ibsaa",
      submitButton: "Daagimitti Ergaa",
      submitting: "Ergamaa jira...",
      successMessage: "Galatoomaa! Daagim ergaa keessan argeera, dafee isin qunnama.",
      errorMessage: "Dogoggorri uumameera. Maaloo bilbilaan qunnamaa.",
    },
  },
  so: {
    common: {
      brandName: "Tekhaf Trading",
      representativeName: "Dagim Melese",
      representativeTitle: "Khabiirka Iibka Mashiinada Beeraha",
      callNow: "Hadda Wac",
      chatWhatsapp: "Kala Hadal WhatsApp",
      requestQuote: "Codso Qiimaha",
      viewInventory: "Eeg Cagafyada",
      inStock: "Bakhaarka Diyaar Ku Ah",
      preOrder: "Dalab Hore Lagu Heli Karo",
      outOfStock: "Waqtigan Waa Dhamaaday",
      horsepower: "Awoodda Fardaha (HP)",
      engine: "Matoorka",
      transmission: "Giriinka",
      drive: "Nooca Wadista",
      price: "Qiimaha",
      details: "Faahfaahinta",
      contactUs: "La Xiriir Dagim",
      allRightsReserved: "Xuquuqda oo dhan way dhowran tahay. Tekhaf Trading Itoobiya.",
      verifiedDistributor: "Qaybiyaha Rasmiga ah ee Qalabka Beeraha",
      dutyFreeAvailable: "La-talinta Canshuur Dhaafka ee Ganacsiga Beeraha",
    },
    nav: {
      home: "Bogga Hore",
      tractors: "Cagafyada & Mashiinada",
      aboutDagim: "Ku Saabsan Dagim Melese",
      serviceAreas: "Goobaha Adeegga",
      testimonials: "Sheekooyinka Beeralayda",
      contact: "Codso Qiimo",
      adminPortal: "Maamulka CRM",
    },
    hero: {
      badge: "Tekhaf Trading • Dhaqdhaqaaqa Iibka Dagim Melese",
      headline: "Xalalka Cagafyada ee Lagu Kalsoon Yahay ee Beeralayda Itoobiya",
      subheadline: "Cagafyo awood leh, qalab tayo sare leh, iyo taageero farsamo oo toos ah Oromia, Amhara, Sidama, Deegaanka Soomaalida iyo Addis Ababa.",
      consultantIntro: "La kulan Dagim Melese, Khabiirka Sare ee Iibka Cagafyada ee Tekhaf Trading. Wuxuu kaa caawinayaa doorashada mashiinka kugu habboon iyo waraaqaha canshuur dhaafka.",
      talkToDagim: "Toos ula Hadal Dagim",
      browseTractors: "Baadh Cagafyada",
      statsTractors: "Cagafyo La Gaarsiiyay",
      statsFarmers: "Beeralay Ku Qanacsan",
      statsRegions: "Deegaannada La Gaaray",
      statsWarranty: "1 Sano oo Damaanad ah",
    },
    features: {
      whyTekhaf: "Maxay Beeralayda Itoobiya u Doortaan Tekhaf Trading & Dagim?",
      whyTekhafSub: "Ma iibino oo keliya cagafyada; waxaan dammaanad qaadaynaa wax soo saarka beerahaaga.",
      f1Title: "Mashiino Ku Habboon Carrada Itoobiya",
      f1Desc: "Laga soo bilaabo dhulka sare ilaa dooxooyinka wabiyada ee waraabka.",
      f2Title: "Qaybaha Spare Parts ee Rasmiga ah",
      f2Desc: "Bakhaarka Addis Ababa oo buuxa miirayaasha iyo qaybaha matoorka.",
      f3Title: "Hagidda Canshuur Dhaafka",
      f3Desc: "Dagim wuxuu caawiyaa shirkadaha iyo iskaashatooyinka beeraha canshuur dhaafka.",
      f4Title: "Gaarsiinta Beerta & Tababarka",
      f4Desc: "Gaarsiin toos ah beertaada iyo tababar darawalka ah.",
    },
    productsPage: {
      title: "Cagafyada Beeraha",
      subtitle: "Dooro cagafyada Massey Ferguson, Lovol, New Holland iyo John Deere.",
      searchPlaceholder: "Ku raadi nooca, awoodda ama astaanta...",
      allBrands: "Dhammaan Noocyada",
      allHPs: "Dhammaan Awoodaha",
      allAvailability: "Dhammaan Xaaladaha",
      clearFilters: "Dib u deji",
      showingResults: "Cagafyada la helay",
      noResults: "Lama helin cagaf waafaqsan shuruudahaaga.",
      requestSpecSheet: "Codso Warbixin iyo Qiimo",
    },
    contactForm: {
      title: "Codso Qiimaha Cagafta",
      subtitle: "Buuxi foomka ama kala hadal Dagim Melese toos WhatsApp.",
      nameLabel: "Magaca oo Buuxa",
      phoneLabel: "Telefoonka (tusaale: 0911234567)",
      emailLabel: "Iimaylka (Ikhtiyaari)",
      regionLabel: "Deegaankaaga / Goobta Beerta",
      productLabel: "Nooca Cagafta Aad Rabto",
      farmSizeLabel: "Baaxadda Beerta (Hektar)",
      messageLabel: "Faahfaahin ku saabsan beertaada",
      submitButton: "U Dir Fariinta Dagim",
      submitting: "Waa la dirayaa...",
      successMessage: "Mahadsanid! Dagim Melese wuu helay fariintaada, si degdeg ah ayuu kula soo xiriiri doonaa.",
      errorMessage: "Khalad ayaa dhacay. Fadlan toos u wac ama WhatsApp ku qor.",
    },
  },
  sid: {
    common: {
      brandName: "Tekhaf Trading",
      representativeName: "Daagim Mallase",
      representativeTitle: "Gashootu Maashine Hornyo Rosicho",
      callNow: "Xa'mmo Bilbille",
      chatWhatsapp: "WhatsApp Daagimi",
      requestQuote: "Woxxanno Xa'mmo",
      viewInventory: "Tiraakiterre La'e",
      inStock: "Kuusaho Noo",
      preOrder: "Hedo Widoonni",
      outOfStock: "Xa'mmo Geeshsha Goofino",
      horsepower: "Fardote Wolqa (HP)",
      engine: "Mootore",
      transmission: "Giyare",
      drive: "Guurrannote Gari",
      price: "Woxxa",
      details: "Tenne La'e",
      contactUs: "Daagimi Leedo Hasaawe",
      allRightsReserved: "Baalunku higgetenni aguramino. Tekhaf Trading Itoophiya.",
      verifiedDistributor: "Ammanamino Gashootu Maashine Ayiiddicho",
      dutyFreeAvailable: "Qaraxa Karsamokkinni Hasaawisiisaano",
    },
    nav: {
      home: "Hanafo",
      tractors: "Tiraakiterre & Maashine",
      aboutDagim: "Daagim Mallase Daafira",
      serviceAreas: "Loosu Qooxe",
      testimonials: "Gashootu Hasaawa",
      contact: "Woxxanno Xa'mmo",
      adminPortal: "Gashshootu Seensa",
    },
    hero: {
      badge: "Tekhaf Trading • Daagim Mallase Tiraakitere Hirate",
      headline: "Itoophiyu Gashshootaho Ammanamino Tiraakiterre Furmaata",
      subheadline: "Dancha Tiraakiterre, ooriijinaale karsote uduunne nna gashshootu la'anno karsote taje Sidaamu, Oromiyu, Amaaru nna Hawassi qooxeessira.",
      consultantIntro: "Tekhaf Trading giddo roore tiraakitere aana lende ikkino Daagim Mallase hasaawisa. Dancha maashine doodhanno gede qara qaraxa karsamokkinni leellishanno.",
      talkToDagim: "Daagimi Leedo Hasaawi",
      browseTractors: "Tiraakiterre La'e",
      statsTractors: "Uynoonni Tiraakiterre",
      statsFarmers: "Hagiidhinori Gashshaanote",
      statsRegions: "Soorronni Qooxeessa",
      statsWarranty: "Mitte Diri Taashsho",
    },
    features: {
      whyTekhaf: "Itoophiyu Gashshaanote Tekhaf Trading nna Daagimi Mayira Doodhitanno?",
      whyTekhafSub: "Tiraakitere calla dihinnanni; gashshootikki dancha laalo afi'ranno gede kaajjishshanno.",
      f1Title: "Itoophiyu Baattora Ikkitanno Maashine",
      f1Desc: "Tiniira nna bayicho la'e kaajjado tiraakiterre uynanni.",
      f2Title: "Ooriijinaale Perkins Uduunne",
      f2Desc: "Finfinnete kuusi giddo baalunku karsote uduunni yannate no.",
      f3Title: "Qaraxa Karsamokkinni Gorsa",
      f3Desc: "Uurrinshate nna gashshootaho qaraxa hoolanno gede taje aanno.",
      f4Title: "Gashshootu Bayicho Geeshsha Eessanna Ronsiisa",
      f4Desc: "Bayicho eessinanni nna loosaasine dancha giddichimmatenni ronsiisanni.",
    },
    productsPage: {
      title: "Tiraakiterre Baala",
      subtitle: "Massey Ferguson, Lovol, New Holland nna John Deere maashine doodhi.",
      searchPlaceholder: "Modelatenni, brandetenni hasi...",
      allBrands: "Baalunku Brand",
      allHPs: "Baalunku Wolqa",
      allAvailability: "Baalunku Noo Gari",
      clearFilters: "Qolate",
      showingResults: "Afantino Tiraakiterre",
      noResults: "Tenne gede tiraakitere diafantino.",
      requestSpecSheet: "Taje nna Woxxanno Xa'mmo",
    },
    contactForm: {
      title: "Tiraakiterrete Woxxa Xa'mi",
      subtitle: "Hanni woro noo borro wonshi woy WhatsApp Daagimi leedo hasaawi.",
      nameLabel: "Wo'ma Su'ma",
      phoneLabel: "Bilbilu Kiiro (lawishshaho: 0911234567)",
      emailLabel: "Imeele (Hasidhiro)",
      regionLabel: "Gashshootikki Qooxeessa",
      productLabel: "Hasidhanno Tiraakitere",
      farmSizeLabel: "Gashshootu Baatto Hektaaretenni",
      messageLabel: "Gashshootikki Daafira Kulie",
      submitButton: "Daagimiraho Soyi",
      submitting: "Soyanni no...",
      successMessage: "Galataminoommo! Daagim Mallase mashalaqqe afi'rino, heeshshikkinni hasaawisannohe.",
      errorMessage: "Sora karsantino. Hanni bilbiletenni hasaawisiisinke.",
    },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] || dictionaries.en;
}
