export interface UITranslations {
  // Navigation
  residentPortal: string;
  smartCategorizer: string;
  fleetRadar: string;
  reportIssue: string;
  municipalAdmin: string;
  driverView: string;

  // Pulse & Metrics Grid
  pulseTitle: string;
  pulseSubtitle: string;
  liveSync: string;
  pickupsThisWeek: string;
  wasteDiverted: string;
  co2Saved: string;
  activeSmartFleet: string;
  fromLandfills: string;
  netOffset: string;
  electricTrucks: string;

  // Hero Section
  integratedSolution: string;
  heroTitle: string;
  heroSubtitle: string;
  schedulePickupBtn: string;
  liveTruckRadarBtn: string;

  // Smart Categorizer / Classification Widget
  categorizerTitle: string;
  categorizerSubtitle: string;
  searchPlaceholder: string;
  identifyBtn: string;
  quickTests: string;
  identifiedStream: string;
  carbonOffsetPotential: string;
  divertedFromLandfill: string;
  dosLabel: string;
  dontsLabel: string;
  lifecycleFactLabel: string;

  // Booking Form
  bookingTitle: string;
  bookingSubtitle: string;
  fullName: string;
  preferredDate: string;
  pickupAddress: string;
  wasteCategory: string;
  preparationTip: string;
  quantityNotes: string;
  confirmBookingBtn: string;
  confirmingMsg: string;
  bookingSuccessTitle: string;
  bookingRef: string;
  bookAnotherBtn: string;
}

export const I18N_DICTIONARY: Record<string, UITranslations> = {
  en: {
    residentPortal: 'Resident Portal',
    smartCategorizer: 'Smart Categorizer',
    fleetRadar: 'Fleet Radar',
    reportIssue: 'Report Issue',
    municipalAdmin: 'Municipal Admin',
    driverView: 'Driver View',

    pulseTitle: 'City Environmental Pulse',
    pulseSubtitle: 'Live telemetry and sustainability indicators',
    liveSync: 'Live Sync Active',
    pickupsThisWeek: 'Pickups This Week',
    wasteDiverted: 'Waste Diverted',
    co2Saved: 'CO₂ Emissions Saved',
    activeSmartFleet: 'Active Smart Fleet',
    fromLandfills: 'From Landfills',
    netOffset: 'Net Offset',
    electricTrucks: 'Electric / GPS Trucks',

    integratedSolution: 'Integrated Municipal Solution',
    heroTitle: 'Doorstep Waste Segregation, Dynamic Routing & Carbon Tracking',
    heroSubtitle: 'Schedule doorstep pickups for recyclable streams, identify segregation bin types with AI, and track municipal sanitation trucks in real-time.',
    schedulePickupBtn: 'Schedule Pickup',
    liveTruckRadarBtn: 'Live Truck Radar',

    categorizerTitle: 'AI-Powered Smart Waste Categorizer',
    categorizerSubtitle: 'Instant segregation rules, bin mapping, and carbon offsets',
    searchPlaceholder: 'Search item (e.g. plastic bottle, banana peel, battery, cardboard)...',
    identifyBtn: 'Identify',
    quickTests: 'Quick tests:',
    identifiedStream: 'Identified Stream',
    carbonOffsetPotential: 'Carbon Offset potential',
    divertedFromLandfill: '100% Diverted from Landfill',
    dosLabel: 'RECOMMENDED (DOs)',
    dontsLabel: 'AVOID (DON\'Ts)',
    lifecycleFactLabel: 'CIRCULAR ECONOMY FACT',

    bookingTitle: 'Schedule On-Demand Waste Pickup',
    bookingSubtitle: 'Book doorstep pickup for segregated waste streams',
    fullName: 'Full Name',
    preferredDate: 'Preferred Date',
    pickupAddress: 'Pickup Address / Landmark',
    wasteCategory: 'Primary Waste Category',
    preparationTip: 'Preparation Tip',
    quantityNotes: 'Quantity / Special Notes (Optional)',
    confirmBookingBtn: 'Book Doorstep Pickup',
    confirmingMsg: 'Confirming with Municipality...',
    bookingSuccessTitle: 'Pickup Scheduled!',
    bookingRef: 'Confirmation Ref:',
    bookAnotherBtn: 'Book Another Pickup',
  },
  hi: {
    residentPortal: 'रेजिडेंट पोर्टल (नागरिक सेवा)',
    smartCategorizer: 'स्मार्ट कचरा श्रेणीकरण',
    fleetRadar: 'इको-वाहन राडार',
    reportIssue: 'समस्या रिपोर्ट करें',
    municipalAdmin: 'नगर निगम एडमिन',
    driverView: 'ड्राइवर टर्मिनल',

    pulseTitle: 'शहर पर्यावरण पल्स',
    pulseSubtitle: 'लाइव टेलीमेट्री और स्थिरता संकेतक',
    liveSync: 'लाइव सिंक सक्रिय',
    pickupsThisWeek: 'इस सप्ताह पिकअप',
    wasteDiverted: 'कचरा पुनर्चक्रण दर',
    co2Saved: 'CO₂ उत्सर्जन बचत',
    activeSmartFleet: 'सक्रिय स्मार्ट वाहन',
    fromLandfills: 'लैंडफिल से बचाया',
    netOffset: 'कुल कार्बन ऑफसेट',
    electricTrucks: 'इलेक्ट्रिक / जीपीएस ट्रक',

    integratedSolution: 'एकीकृत नगर निगम समाधान',
    heroTitle: 'घर-घर कचरा पृथक्करण, डायनेमिक रूटिंग और कार्बन ट्रैकिंग',
    heroSubtitle: 'पुनर्चक्रण योग्य कचरे के लिए डोरस्टेप पिकअप शेड्यूल करें, एआई के साथ बिन प्रकारों की पहचान करें और वास्तविक समय में स्वच्छता ट्रकों को ट्रैक करें।',
    schedulePickupBtn: 'पिकअप शेड्यूल करें',
    liveTruckRadarBtn: 'लाइव ट्रक राडार',

    categorizerTitle: 'एआई-संचालित स्मार्ट कचरा श्रेणीकरण',
    categorizerSubtitle: 'तत्काल पृथक्करण नियम, बिन मैपिंग और कार्बन ऑफसेट',
    searchPlaceholder: 'कचरा खोजें (जैसे प्लास्टिक बोतल, केले का छिलका, बैटरी, कार्डबोर्ड)...',
    identifyBtn: 'पहचानें (Search)',
    quickTests: 'त्वरित परीक्षण:',
    identifiedStream: 'पहचाना गया कचरा प्रकार',
    carbonOffsetPotential: 'कार्बन ऑफसेट क्षमता',
    divertedFromLandfill: '100% लैंडफिल से बचाया गया',
    dosLabel: 'अनुशंसित (क्या करें)',
    dontsLabel: 'वर्जित (क्या न करें)',
    lifecycleFactLabel: 'सर्कुलर इकोनॉमी तथ्य',

    bookingTitle: 'ऑन-डिमांड कचरा पिकअप शेड्यूल करें',
    bookingSubtitle: 'पृथक कचरा श्रेणियों के लिए घर-घर पिकअप बुक करें',
    fullName: 'पूरा नाम',
    preferredDate: 'पसंदीदा तारीख',
    pickupAddress: 'पिकअप पता / लैंडमार्क',
    wasteCategory: 'प्राथमिक कचरा श्रेणी',
    preparationTip: 'तैयारी टिप',
    quantityNotes: 'मात्रा / विशेष टिप्पणी (वैकल्पिक)',
    confirmBookingBtn: 'डोरस्टेप पिकअप बुक करें',
    confirmingMsg: 'नगर निगम से पुष्टि हो रही है...',
    bookingSuccessTitle: 'पिकअप सफलतापूर्वक शेड्यूल हुआ!',
    bookingRef: 'पुष्टि संदर्भ:',
    bookAnotherBtn: 'एक और पिकअप बुक करें',
  },
  ta: {
    residentPortal: 'குடிமகன் சேவை',
    smartCategorizer: 'ஸ்மார்ட் கழிவு வகைப்பாடு',
    fleetRadar: 'வாகன ரேடார்',
    reportIssue: 'புகார் அளிக்கவும்',
    municipalAdmin: 'நகராட்சி நிர்வாகம்',
    driverView: 'ஓட்டுநர் முனையம்',

    pulseTitle: 'நகர சுற்றுச்சூழல் துடிப்பு',
    pulseSubtitle: 'நேரலை தொலை அளவியல் மற்றும் நிலைத்தன்மை',
    liveSync: 'நேரலை இணைப்பு செயலில் உள்ளது',
    pickupsThisWeek: 'இந்த வார சேகரிப்புகள்',
    wasteDiverted: 'மீட்கப்பட்ட கழிவுகள்',
    co2Saved: 'CO₂ சேமிப்பு',
    activeSmartFleet: 'செயலில் உள்ள வாகனங்கள்',
    fromLandfills: 'குப்பைமேட்டில் இருந்து மீட்டது',
    netOffset: 'நிகர கார்பன் சேமிப்பு',
    electricTrucks: 'மின்சார வாகனங்கள்',

    integratedSolution: 'ஒருங்கிணைந்த நகராட்சி தீர்வு',
    heroTitle: 'வீட்டு வாசலில் கழிவு சேகரிப்பு மற்றும் கார்பன் கண்காணிப்பு',
    heroSubtitle: 'மறுசுழற்சி செய்யக்கூடிய கழிவுகளுக்கான சேகரிப்பை திட்டமிடுங்கள் மற்றும் தூய்மைப் பணிகளை நேரலையில் கண்காணியுங்கள்.',
    schedulePickupBtn: 'சேகரிப்பு நேரம்',
    liveTruckRadarBtn: 'வாகன ரேடார்',

    categorizerTitle: 'AI கழிவு வகைப்படுத்தி',
    categorizerSubtitle: 'உடனடி பிரித்தெடுக்கும் விதிகள் மற்றும் கார்பன் கணக்கீடு',
    searchPlaceholder: 'பொருளைத் தேடுங்கள் (எ.கா. பிளாஸ்டிக் பாட்டில், வாழைப்பழத் தோல்)...',
    identifyBtn: 'கண்டறி',
    quickTests: 'விரைவு சோதனைகள்:',
    identifiedStream: 'கண்டறியப்பட்ட கழிவு வகை',
    carbonOffsetPotential: 'கார்பன் சேமிப்பு திறன்',
    divertedFromLandfill: '100% மீட்கப்பட்டது',
    dosLabel: 'செய்ய வேண்டியவை',
    dontsLabel: 'தவிர்க்க வேண்டியவை',
    lifecycleFactLabel: 'சுழற்சி பொருளாதார தகவல்',

    bookingTitle: 'கழிவு சேகரிப்பை பதிவு செய்',
    bookingSubtitle: 'வீட்டு வாசலில் கழிவு சேகரிப்பு முன்பதிவு',
    fullName: 'முழு பெயர்',
    preferredDate: 'விரும்பும் தேதி',
    pickupAddress: 'முகவரி / அடையாளம்',
    wasteCategory: 'முதன்மை கழிவு வகை',
    preparationTip: 'தயாரிப்பு குறிப்பு',
    quantityNotes: 'அளவு / குறிப்புகள்',
    confirmBookingBtn: 'முன்பதிவு செய்',
    confirmingMsg: 'உறுதி செய்யப்படுகிறது...',
    bookingSuccessTitle: 'சேகரிப்பு திட்டமிடப்பட்டது!',
    bookingRef: 'குறிப்பு எண்:',
    bookAnotherBtn: 'மற்றொரு முன்பதிவு',
  },
  te: {
    residentPortal: 'పౌర సేవలు',
    smartCategorizer: 'స్మార్ట్ వ్యర్థాల వర్గీకరణ',
    fleetRadar: 'వాహన రాడార్',
    reportIssue: 'ఫిర్యాదు చేయండి',
    municipalAdmin: 'మున్సిపల్ అడ్మిన్',
    driverView: 'డ్రైవర్ టెర్మినల్',

    pulseTitle: 'నగర పర్యావరణ స్థితి',
    pulseSubtitle: 'లైవ్ టెలిమెట్రీ మరియు స్థిరత్వం',
    liveSync: 'లైవ్ సింక్ యాక్టివ్',
    pickupsThisWeek: 'ఈ వారం సేకరణలు',
    wasteDiverted: 'పునర్వినియోగ వ్యర్థాలు',
    co2Saved: 'CO₂ ఆదా',
    activeSmartFleet: 'యాక్టివ్ వాహనాలు',
    fromLandfills: 'ల్యాండ్‌ఫిల్ నుండి రక్షించబడింది',
    netOffset: 'మొత్తం కార్బన్ ఆదా',
    electricTrucks: 'ఎలక్ట్రిక్ వాహనాలు',

    integratedSolution: 'సమన్వయ మున్సిపల్ పరిష్కారం',
    heroTitle: 'ఇంటి వద్ద వ్యర్థాల సేకరణ మరియు కార్బన్ ట్రాకింగ్',
    heroSubtitle: 'రీసైకిల్ చేయగల వ్యర్థాల కోసం సేకరణను షెడ్యూల్ చేయండి మరియు వాహనాలను లైవ్‌లో ట్రాక్ చేయండి.',
    schedulePickupBtn: 'సేకరణ షెడ్యూల్ చేయండి',
    liveTruckRadarBtn: 'లైవ్ రాడార్',

    categorizerTitle: 'AI వ్యర్థాల వర్గీకరణ',
    categorizerSubtitle: 'తక్షణ విభజన నియమాలు మరియు కార్బన్ లెక్కింపు',
    searchPlaceholder: 'వస్తువును శోధించండి (ఉదా. ప్లాస్టిక్ బాటిల్, అరటి తొక్క)...',
    identifyBtn: 'గుర్తించు',
    quickTests: 'త్వరిత పరీక్షలు:',
    identifiedStream: 'గుర్తించబడిన రకం',
    carbonOffsetPotential: 'కార్బన్ ఆదా సామర్థ్యం',
    divertedFromLandfill: '100% రక్షించబడింది',
    dosLabel: 'చేయవలసినవి',
    dontsLabel: 'చేయకూడనివి',
    lifecycleFactLabel: 'రీసైక్లింగ్ సమాచారం',

    bookingTitle: 'వ్యర్థాల సేకరణను బుక్ చేయండి',
    bookingSubtitle: 'ఇంటి వద్ద వ్యర్థాల సేకరణ బుకింగ్',
    fullName: 'పూర్తి పేరు',
    preferredDate: 'కోరుకున్న తేదీ',
    pickupAddress: 'చిరునామా / ల్యాండ్‌మార్క్',
    wasteCategory: 'ప్రధాన వ్యర్థాల రకం',
    preparationTip: 'చిట్కా',
    quantityNotes: 'పరిమాణం / గమనికలు',
    confirmBookingBtn: 'బుక్ చేయండి',
    confirmingMsg: 'స్థిరీకరిస్తోంది...',
    bookingSuccessTitle: 'సేకరణ షెడ్యూల్ చేయబడింది!',
    bookingRef: 'రెఫరెన్స్ సంఖ్య:',
    bookAnotherBtn: 'మరొకటి బుక్ చేయండి',
  }
};

export function getTranslation(lang: string = 'en'): UITranslations {
  return I18N_DICTIONARY[lang] || I18N_DICTIONARY.hi || I18N_DICTIONARY.en;
}
