import { Locale } from "./config";

export interface Dictionary {
  common: {
    representativeName: string;
    representativeTitle: string;
    companyName: string;
    callNow: string;
    contactDagim: string;
    sendInquiry: string;
    viewInventory: string;
    inStock: string;
    preOrder: string;
    outOfStock: string;
    horsepower: string;
    engine: string;
    transmission: string;
    drive: string;
    details: string;
    allRightsReserved: string;
  };
  nav: {
    home: string;
    tractors: string;
    about: string;
    serviceAreas: string;
    contact: string;
    adminPortal: string;
  };
  hero: {
    subheadlinePrefix: string;
    consultantIntro: string;
    contactButton: string;
    browseTractors: string;
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
    inquireTractor: string;
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
      representativeName: "Dagim Melese",
      representativeTitle: "Agricultural Machinery Specialist",
      companyName: "Tekhaf Trading",
      callNow: "Call",
      contactDagim: "Contact Dagim",
      sendInquiry: "Send Inquiry",
      viewInventory: "View Inventory",
      inStock: "In Stock",
      preOrder: "Pre-Order",
      outOfStock: "Unavailable",
      horsepower: "Horsepower",
      engine: "Engine",
      transmission: "Transmission",
      drive: "Drive",
      details: "View Details",
      allRightsReserved: "All rights reserved.",
    },
    nav: {
      home: "Home",
      tractors: "Tractors",
      about: "About",
      serviceAreas: "Locations",
      contact: "Contact",
      adminPortal: "Admin",
    },
    hero: {
      subheadlinePrefix: "Agricultural Machinery Specialist at",
      consultantIntro: "Connecting Ethiopian farms, unions, and agribusinesses with reliable machinery, genuine spare parts, and dedicated field support.",
      contactButton: "Get in Touch",
      browseTractors: "Explore Tractors",
    },
    productsPage: {
      title: "Tractor Inventory",
      subtitle: "Commercial agricultural tractors available through Tekhaf Trading in Ethiopia.",
      searchPlaceholder: "Search models, brands, or horsepower...",
      allBrands: "All Brands",
      allHPs: "All Horsepower",
      allAvailability: "All Availability",
      clearFilters: "Reset Filters",
      showingResults: "Tractors available",
      noResults: "No tractors match your criteria.",
      inquireTractor: "Inquire About Tractor",
    },
    contactForm: {
      title: "Send an Inquiry",
      subtitle: "Submit your inquiry below or reach out directly to discuss machinery requirements.",
      nameLabel: "Full Name",
      phoneLabel: "Phone Number",
      emailLabel: "Email Address (Optional)",
      regionLabel: "Location / Region",
      productLabel: "Tractor Model of Interest",
      farmSizeLabel: "Farm Size (Hectares - Optional)",
      messageLabel: "Message / Requirements",
      submitButton: "Send Inquiry",
      submitting: "Sending...",
      successMessage: "Thank you. Dagim Melese has received your inquiry and will respond promptly.",
      errorMessage: "Could not submit. Please call or reach out via WhatsApp.",
    },
  },
  am: {
    common: {
      representativeName: "ዳግም መለሰ",
      representativeTitle: "የግብርና ማሽነሪ ባለሙያ",
      companyName: "ቴክሃፍ ትሬዲንግ",
      callNow: "ይደውሉ",
      contactDagim: "ዳግምን ያነጋግሩ",
      sendInquiry: "ጥያቄ ይላኩ",
      viewInventory: "ትራክተሮችን ይመልከቱ",
      inStock: "ክምችት አለ",
      preOrder: "በቅድመ ትዕዛዝ",
      outOfStock: "ያለቀ",
      horsepower: "የፈረስ ጉልበት (HP)",
      engine: "ሞተር",
      transmission: "ማርሽ",
      drive: "የጉተታ አይነት",
      details: "ዝርዝር",
      allRightsReserved: "መብቱ በህግ የተጠበቀ ነው።",
    },
    nav: {
      home: "ዋና ገጽ",
      tractors: "ትራክተሮች",
      about: "ስለ ዳግም",
      serviceAreas: "የአገልግሎት ክልሎች",
      contact: "ያነጋግሩ",
      adminPortal: "አድሚን",
    },
    hero: {
      subheadlinePrefix: "የግብርና ማሽነሪ ሽያጭ ባለሙያ በ",
      consultantIntro: "ለኢትዮጵያ አርሶ አደሮች እና የእርሻ ድርጅቶች አስተማማኝ ትራክተሮች እና የቴክኒክ ድጋፍ ማቅረብ።",
      contactButton: "ዳግምን ያነጋግሩ",
      browseTractors: "ትራክተሮችን ይመርምሩ",
    },
    productsPage: {
      title: "የትራክተሮች ዝርዝር",
      subtitle: "በቴክሃፍ ትሬዲንግ የሚቀርቡ የግብርና ትራክተሮች።",
      searchPlaceholder: "በሞዴል ወይም በብራንድ ይፈልጉ...",
      allBrands: "ሁሉም ብራንዶች",
      allHPs: "ሁሉም ጉልበት",
      allAvailability: "ሁሉም ሁኔታዎች",
      clearFilters: "አጣራውን አጥፋ",
      showingResults: "የተገኙ ትራክተሮች",
      noResults: "የተገኘ ትራክተር የለም።",
      inquireTractor: "ስለ ትራክተሩ ይጠይቁ",
    },
    contactForm: {
      title: "ጥያቄዎን ይላኩ",
      subtitle: "ከታች ያለውን ቅጽ በመሙላት ወይም በቀጥታ በመደወል ያነጋግሩን።",
      nameLabel: "ሙሉ ስም",
      phoneLabel: "ስልክ ቁጥር",
      emailLabel: "ኢሜይል (አማራጭ)",
      regionLabel: "የእርሻዎ ክልል",
      productLabel: "የሚፈልጉት ትራክተር",
      farmSizeLabel: "የእርሻ ስፋት (ሄክታር)",
      messageLabel: "መልዕክት",
      submitButton: "ላክ",
      submitting: "በመላክ ላይ...",
      successMessage: "እናመሰግናለን። ዳግም መለሰ ጥያቄዎን ተቀብሏል።",
      errorMessage: "ስህተት ተፈጥሯል። እባክዎ በቀጥታ ይደውሉ።",
    },
  },
  or: {
    common: {
      representativeName: "Daagim Mallasaa",
      representativeTitle: "Ogeessa Maashinoota Qonnaa",
      companyName: "Tekhaf Trading",
      callNow: "Bilbilaa",
      contactDagim: "Daagim Qunnamaa",
      sendInquiry: "Gaaffii Ergaa",
      viewInventory: "Tiraakteroota Ilaalaa",
      inStock: "Kuusaa Jira",
      preOrder: "Ajajaan",
      outOfStock: "Dhumateera",
      horsepower: "Humna (HP)",
      engine: "Mootora",
      transmission: "Giiyarii",
      drive: "Akaakuu Guuttuu",
      details: "Bal'ina",
      allRightsReserved: "Mirgi hundaa kan eegame.",
    },
    nav: {
      home: "Fuula Duraa",
      tractors: "Tiraakteroota",
      about: "Waa'ee",
      serviceAreas: "Bakkeewwan",
      contact: "Qunnamtii",
      adminPortal: "Bulchiinsa",
    },
    hero: {
      subheadlinePrefix: "Ogeessa Gurgurtaa Maashinoota Qonnaa",
      consultantIntro: "Qonnaan bultootaa fi dhaabbilee qonnaaf tiraakteroota amansiisaa dhiheessuu.",
      contactButton: "Nu Qunnamaa",
      browseTractors: "Tiraakteroota Filadhaa",
    },
    productsPage: {
      title: "Tarree Tiraakterootaa",
      subtitle: "Tiraakteroota qonnaa Tekhaf Trading dhiheessu.",
      searchPlaceholder: "Barbaadaa...",
      allBrands: "Gosa Hunda",
      allHPs: "Humna Hunda",
      allAvailability: "Haala Hunda",
      clearFilters: "Qulqulleessi",
      showingResults: "Kan argaman",
      noResults: "Hin argamne.",
      inquireTractor: "Waa'ee Tiraakteraa Gaafadhaa",
    },
    contactForm: {
      title: "Gaaffii Keessan Ergaa",
      subtitle: "Unka armaan gadii guutaa nu qunnamaa.",
      nameLabel: "Maqaa Guutuu",
      phoneLabel: "Bilbila",
      emailLabel: "Imeelii",
      regionLabel: "Naannoo",
      productLabel: "Moodeela Tiraakteraa",
      farmSizeLabel: "Bal'ina Lafa Qonnaa",
      messageLabel: "Ergaa",
      submitButton: "Ergaa",
      submitting: "Ergamaa jira...",
      successMessage: "Galatoomaa. Daagim ergaa keessan argeera.",
      errorMessage: "Dogoggorri uumameera.",
    },
  },
  so: {
    common: {
      representativeName: "Dagim Melese",
      representativeTitle: "Khabiirka Mashiinada Beeraha",
      companyName: "Tekhaf Trading",
      callNow: "Wac",
      contactDagim: "La Xiriir Dagim",
      sendInquiry: "Dir Codsi",
      viewInventory: "Eeg Cagafyada",
      inStock: "Diyaar Ah",
      preOrder: "Dalab Hore",
      outOfStock: "Wuu Dhamaaday",
      horsepower: "Awoodda (HP)",
      engine: "Matoorka",
      transmission: "Giriinka",
      drive: "Wadista",
      details: "Faahfaahinta",
      allRightsReserved: "Xuquuqda oo dhan way dhowran tahay.",
    },
    nav: {
      home: "Bogga Hore",
      tractors: "Cagafyada",
      about: "Ku Saabsan",
      serviceAreas: "Goobaha",
      contact: "Xiriir",
      adminPortal: "Maamulka",
    },
    hero: {
      subheadlinePrefix: "Khabiirka Iibka Mashiinada Beeraha ee",
      consultantIntro: "Cagafyo awood leh iyo taageero farsamo oo toos ah beeralayda Itoobiya.",
      contactButton: "La Xiriir",
      browseTractors: "Baadh Cagafyada",
    },
    productsPage: {
      title: "Cagafyada Diyaar Ah",
      subtitle: "Cagafyo tayo sare leh oo laga helo Tekhaf Trading.",
      searchPlaceholder: "Raadi...",
      allBrands: "Dhammaan",
      allHPs: "Awoodaha",
      allAvailability: "Xaaladaha",
      clearFilters: "Dib u deji",
      showingResults: "Cagafyada la helay",
      noResults: "Lama helin.",
      inquireTractor: "Faahfaahin Weydii",
    },
    contactForm: {
      title: "Dir Fariin",
      subtitle: "Buuxi foomka si aad xiriir ula sameyso Dagim.",
      nameLabel: "Magaca",
      phoneLabel: "Telefoonka",
      emailLabel: "Iimaylka",
      regionLabel: "Deegaanka",
      productLabel: "Nooca Cagafta",
      farmSizeLabel: "Baaxadda Beerta",
      messageLabel: "Fariinta",
      submitButton: "Dir",
      submitting: "Waa la dirayaa...",
      successMessage: "Mahadsanid. Dagim wuu helay fariintaada.",
      errorMessage: "Khalad ayaa dhacay.",
    },
  },
  sid: {
    common: {
      representativeName: "Daagim Mallase",
      representativeTitle: "Gashootu Maashine Rosicho",
      companyName: "Tekhaf Trading",
      callNow: "Bilbille",
      contactDagim: "Daagimi Leedo Hasaawe",
      sendInquiry: "Mashalaqqe Soyi",
      viewInventory: "Tiraakiterre La'e",
      inStock: "Kuusaho Noo",
      preOrder: "Ajajaan",
      outOfStock: "Goofino",
      horsepower: "Wolqa (HP)",
      engine: "Mootore",
      transmission: "Giyare",
      drive: "Gari",
      details: "Tenne La'e",
      allRightsReserved: "Baalunku aguramino.",
    },
    nav: {
      home: "Hanafo",
      tractors: "Tiraakiterre",
      about: "Daafira",
      serviceAreas: "Qooxe",
      contact: "Hasaawisiisa",
      adminPortal: "Gashshoota",
    },
    hero: {
      subheadlinePrefix: "Gashshootu Maashine Hornyo Rosicho",
      consultantIntro: "Itoophiyu gashshootaho ammanamino tiraakiterre nna dancha looso eessanna aanno.",
      contactButton: "Hasaawi",
      browseTractors: "Tiraakiterre Doodhi",
    },
    productsPage: {
      title: "Tiraakiterre Baala",
      subtitle: "Tekhaf Trading giddo noo gashshootu tiraakiterre.",
      searchPlaceholder: "Hasi...",
      allBrands: "Baalunku Brand",
      allHPs: "Baalunku Wolqa",
      allAvailability: "Noo Gari",
      clearFilters: "Qolate",
      showingResults: "Afantino",
      noResults: "Diafantino.",
      inquireTractor: "Xa'mmo",
    },
    contactForm: {
      title: "Mashalaqqe Soyi",
      subtitle: "Woro noo borro wonshi Daagimi leedo hasaawi.",
      nameLabel: "Su'ma",
      phoneLabel: "Bilbila",
      emailLabel: "Imeele",
      regionLabel: "Qooxeessa",
      productLabel: "Tiraakitere",
      farmSizeLabel: "Baattote Bal'ina",
      messageLabel: "Borro",
      submitButton: "Soyi",
      submitting: "Soyanni...",
      successMessage: "Galataminoommo. Daagim mashalaqqe afi'rino.",
      errorMessage: "Sora karsantino.",
    },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] || dictionaries.en;
}
