export interface UITranslations {
  // Brand Header
  brandTitle: string;
  brandSubtitle: string;

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

  // Booking Form
  doorstepPickupTitle: string;
  doorstepPickupSubtitle: string;
  customerNameLabel: string;
  customerNamePlaceholder: string;
  preferredDateLabel: string;
  addressLabel: string;
  addressPlaceholder: string;
  wasteStreamLabel: string;
  prepTipHeader: string;
  dryRecyclablesTag: string;
  notesLabel: string;
  notesPlaceholder: string;
  confirmBookingBtn: string;
  confirmingMsg: string;
  bookingSuccessTitle: string;
  bookingRef: string;
  bookAnotherBtn: string;

  // Classification Widget
  widgetTitle: string;
  widgetSubtitle: string;
  searchPlaceholder: string;
  identifyBtn: string;
  quickTestsLabel: string;
  classificationResultHeader: string;
  matchLabel: string;
  verifiedStreamProcessed: string;
  co2AvoidedPrefix: string;
  kgProcessedSuffix: string;

  // Floating Hub
  modulesHub: string;
}

export const I18N_DICTIONARY: Record<string, UITranslations> = {
  en: {
    brandTitle: 'CleanCarbon Tracks',
    brandSubtitle: 'Smart Municipal Waste & Circular Telematics',

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
    heroSubtitle: 'Never miss garbage collection again. Schedule doorstep pickups for recyclable streams, identify segregation bin types with AI, and track municipal sanitation trucks in real-time.',
    schedulePickupBtn: 'Schedule Pickup',
    liveTruckRadarBtn: 'Live Truck Radar',

    doorstepPickupTitle: 'Municipal Waste Doorstep Pickup',
    doorstepPickupSubtitle: 'Fast, verified on-demand doorstep booking',
    customerNameLabel: 'Customer Name',
    customerNamePlaceholder: 'e.g. Aarav Sharma',
    preferredDateLabel: 'Preferred Date',
    addressLabel: 'Service Location / Address',
    addressPlaceholder: 'e.g. Flat 402, Green Glen Towers, Sector 4',
    wasteStreamLabel: 'Waste Stream',
    prepTipHeader: 'PREPARATION TIP',
    dryRecyclablesTag: 'Dry Recyclables',
    notesLabel: 'Quantity / Handling Notes (Optional)',
    notesPlaceholder: 'e.g. 2 large sacks, please call before arriving',
    confirmBookingBtn: 'Confirm Service Booking',
    confirmingMsg: 'Confirming with Municipality...',
    bookingSuccessTitle: 'Appointment Confirmed!',
    bookingRef: 'Booking Reference:',
    bookAnotherBtn: 'Book Another Pickup',

    widgetTitle: 'Smart Waste Categorizer & Circular Impact',
    widgetSubtitle: 'AI-assisted segregation engine with real-time carbon offset telemetry',
    searchPlaceholder: 'Search item (e.g. plastic bottle, banana peel, battery, cardboard)...',
    identifyBtn: 'Identify',
    quickTestsLabel: 'Quick tests:',
    classificationResultHeader: 'CLASSIFICATION RESULT',
    matchLabel: 'Match',
    verifiedStreamProcessed: 'Verified Stream Processed',
    co2AvoidedPrefix: 'CO₂ Avoided:',
    kgProcessedSuffix: 'kg CO₂ / kg processed',

    modulesHub: 'Enterprise Modules Hub',
  },
  hi: {
    brandTitle: 'क्लिनकार्बन ट्रैक्स',
    brandSubtitle: 'स्मार्ट नगर निगम कचरा प्रबंधन एवं सर्कुलर टेलीमैटिक्स',

    residentPortal: 'रेजिडेंट पोर्टल',
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
    fromLandfills: 'लैंडफिल से बचाया गया',
    netOffset: 'कुल कार्बन ऑफसेट',
    electricTrucks: 'इलेक्ट्रिक / जीपीएस ट्रक',

    integratedSolution: 'एकीकृत नगर निगम समाधान',
    heroTitle: 'घर-घर कचरा पृथक्करण, डायनेमिक रूटिंग और कार्बन ट्रैकिंग',
    heroSubtitle: 'कचरा संग्रहण कभी न छूटने दें। पुनर्चक्रण योग्य कचरे के लिए घर-घर पिकअप शेड्यूल करें, एआई के साथ बिन प्रकारों की पहचान करें और वास्तविक समय में स्वच्छता ट्रकों को ट्रैक करें।',
    schedulePickupBtn: 'पिकअप शेड्यूल करें',
    liveTruckRadarBtn: 'लाइव ट्रक राडार',

    doorstepPickupTitle: 'नगर निगम कचरा डोरस्टेप पिकअप',
    doorstepPickupSubtitle: 'तेज, सत्यापित ऑन-डिमांड पिकअप बुकिंग',
    customerNameLabel: 'ग्राहक का नाम',
    customerNamePlaceholder: 'जैसे: आरव शर्मा',
    preferredDateLabel: 'पसंदीदा तारीख',
    addressLabel: 'सेवा स्थान / पता',
    addressPlaceholder: 'जैसे: फ्लैट 402, ग्रीन ग्लेन टावर्स, सेक्टर 4',
    wasteStreamLabel: 'कचरा श्रेणी (वेस्ट स्ट्रीम)',
    prepTipHeader: 'तैयारी टिप',
    dryRecyclablesTag: 'सूखा कचरा (पुनर्चक्रण)',
    notesLabel: 'मात्रा / हैंडलिंग नोट्स (वैकल्पिक)',
    notesPlaceholder: 'जैसे: 2 बड़े बोरे, आने से पहले कॉल करें',
    confirmBookingBtn: 'सेवा बुकिंग की पुष्टि करें',
    confirmingMsg: 'नगर निगम से पुष्टि हो रही है...',
    bookingSuccessTitle: 'बुकिंग सफलतापूर्वक संपन्न!',
    bookingRef: 'बुकिंग संदर्भ संख्या:',
    bookAnotherBtn: 'एक और पिकअप बुक करें',

    widgetTitle: 'स्मार्ट कचरा श्रेणीकरण और सर्कुलर प्रभाव',
    widgetSubtitle: 'रियल-टाइम कार्बन ऑफसेट टेलीमेट्री के साथ एआई पृथक्करण इंजन',
    searchPlaceholder: 'कचरा खोजें (जैसे: प्लास्टिक बोतल, केले का छिलका, बैटरी)...',
    identifyBtn: 'पहचानें (Identify)',
    quickTestsLabel: 'त्वरित परीक्षण:',
    classificationResultHeader: 'श्रेणीकरण परिणाम (CLASSIFICATION RESULT)',
    matchLabel: 'सटीकता',
    verifiedStreamProcessed: 'सत्यापित कचरा प्रसंस्कृत',
    co2AvoidedPrefix: 'CO₂ बचत:',
    kgProcessedSuffix: 'किग्रा CO₂ / किग्रा प्रसंस्कृत',

    modulesHub: 'एंटरप्राइज मॉड्यूल हब',
  },
  ta: {
    brandTitle: 'கிளீன்கார்பன் டிராக்ஸ்',
    brandSubtitle: 'ஸ்மார்ட் கழிவு மேலாண்மை மற்றும் டெலிமேடிக்ஸ்',

    residentPortal: 'குடிமகன் சேவை',
    smartCategorizer: 'கழிவு வகைப்பாடு',
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

    doorstepPickupTitle: 'நகராட்சி கழிவு சேகரிப்பு',
    doorstepPickupSubtitle: 'விரைவான வீட்டு வாசல் முன்பதிவு',
    customerNameLabel: 'வாடிக்கையாளர் பெயர்',
    customerNamePlaceholder: 'எ.கா. ஆரவ் சர்மா',
    preferredDateLabel: 'விரும்பும் தேதி',
    addressLabel: 'முகவரி / இடம்',
    addressPlaceholder: 'எ.கா. பிளாட் 402, கிரீன் கார்டன்',
    wasteStreamLabel: 'கழிவு வகை',
    prepTipHeader: 'தயாரிப்பு குறிப்பு',
    dryRecyclablesTag: 'உலர் மறுசுழற்சி',
    notesLabel: 'அளவு / குறிப்புகள்',
    notesPlaceholder: 'எ.கா. 2 பெரிய பைகள்',
    confirmBookingBtn: 'முன்பதிவை உறுதிசெய்',
    confirmingMsg: 'உறுதி செய்யப்படுகிறது...',
    bookingSuccessTitle: 'முன்பதிவு முடிந்தது!',
    bookingRef: 'குறிப்பு எண்:',
    bookAnotherBtn: 'மற்றொரு முன்பதிவு',

    widgetTitle: 'AI கழிவு வகைப்பாடு மற்றும் சுற்றுச்சூழல் தாக்கம்',
    widgetSubtitle: 'நேரலை கார்பன் கணக்கீட்டுடன் கூடிய கழிவு பிரித்தெடுக்கும் முறை',
    searchPlaceholder: 'பொருளைத் தேடுங்கள் (எ.கா. பிளாஸ்டிக் பாட்டில்)...',
    identifyBtn: 'கண்டறி',
    quickTestsLabel: 'விரைவு சோதனைகள்:',
    classificationResultHeader: 'வகைப்பாடு முடிவு',
    matchLabel: 'பொருத்தம்',
    verifiedStreamProcessed: 'சரிபார்க்கப்பட்ட கழிவு',
    co2AvoidedPrefix: 'CO₂ சேமிப்பு:',
    kgProcessedSuffix: 'கிலோ CO₂ / கிலோ',

    modulesHub: 'நிறுவன தொகுதி மையம்',
  },
  te: {
    brandTitle: 'క్లీన్‌కార్బన్ ట్రాక్స్',
    brandSubtitle: 'స్మార్ట్ మున్సిపల్ వేస్ట్ అండ్ సర్క్యులర్ టెలిమాటిక్స్',

    residentPortal: 'పౌర సేవలు',
    smartCategorizer: 'వ్యర్థాల వర్గీకరణ',
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

    doorstepPickupTitle: 'ఇంటి వద్ద వ్యర్థాల సేకరణ',
    doorstepPickupSubtitle: 'వేగవంతమైన డిమాండ్ బుకింగ్',
    customerNameLabel: 'వినియోగదారుని పేరు',
    customerNamePlaceholder: 'ఉదా. ఆరవ్ శర్మ',
    preferredDateLabel: 'కోరుకున్న తేదీ',
    addressLabel: 'చిరునామా / ప్రాంతం',
    addressPlaceholder: 'ఉదా. ఫ్లాట్ 402, గ్రీన్ విల్లాస్',
    wasteStreamLabel: 'వ్యర్థాల రకం',
    prepTipHeader: 'చిట్కా',
    dryRecyclablesTag: 'పొడి రీసైకిల్',
    notesLabel: 'పరిమాణం / గమనికలు',
    notesPlaceholder: 'ఉదా. 2 పెద్ద సంచులు',
    confirmBookingBtn: 'బుకింగ్‌ను నిర్ధారించండి',
    confirmingMsg: 'స్థిరీకరిస్తోంది...',
    bookingSuccessTitle: 'బుకింగ్ పూర్తయింది!',
    bookingRef: 'రెఫరెన్స్ సంఖ్య:',
    bookAnotherBtn: 'మరొకటి బుక్ చేయండి',

    widgetTitle: 'AI వ్యర్థాల వర్గీకరణ మరియు ప్రభావం',
    widgetSubtitle: 'రియల్ టైమ్ కార్బన్ ట్రాకింగ్‌తో వ్యర్థాల వర్గీకరణ',
    searchPlaceholder: 'వస్తువును శోధించండి (ఉదా. ప్లాస్టిక్ బాటిల్)...',
    identifyBtn: 'గుర్తించు',
    quickTestsLabel: 'త్వరిత పరీక్షలు:',
    classificationResultHeader: 'వర్గీకరణ ఫలితం',
    matchLabel: 'సామర్థ్యం',
    verifiedStreamProcessed: 'ధృవీకరించబడిన వ్యర్థాలు',
    co2AvoidedPrefix: 'CO₂ ఆదా:',
    kgProcessedSuffix: 'కిలో CO₂ / కిలో',

    modulesHub: 'మాడ్యూల్స్ హబ్',
  }
};

export function getTranslation(lang: string = 'en'): UITranslations {
  return I18N_DICTIONARY[lang] || I18N_DICTIONARY.hi || I18N_DICTIONARY.en;
}
