export interface VernacularTranslation {
  translatedText: string;
  phoneticRomanized: string;
}

export const VERNACULAR_DICTIONARY: Record<string, Record<string, VernacularTranslation>> = {
  hi: {
    "biodegradable (organic & wet waste)": {
      translatedText: "जैविक (गीला कचरा)",
      phoneticRomanized: "Jaivik (Geela Kachra)"
    },
    "non-biodegradable / recyclable (dry waste)": {
      translatedText: "गैर-जैविक / पुनर्चक्रण योग्य (सूखा कचरा)",
      phoneticRomanized: "Gair-jaivik / Punarchakran yogya (Sookha Kachra)"
    },
    "non-biodegradable (plastic & polymers)": {
      translatedText: "गैर-जैविक (प्लास्टिक और पॉलिमर)",
      phoneticRomanized: "Gair-jaivik (Plastic & Polymers)"
    },
    "recyclable (paper & cardboard)": {
      translatedText: "पुनर्चक्रण योग्य (कागज और कार्डबोर्ड)",
      phoneticRomanized: "Punarchakran yogya (Kagaj & Cardboard)"
    },
    "recyclable (metals & alloys)": {
      translatedText: "पुनर्चक्रण योग्य (धातु और मिश्र धातु)",
      phoneticRomanized: "Punarchakran yogya (Dhatu & Alloys)"
    },
    "hazardous / biomedical waste": {
      translatedText: "खतरनाक / बायोमेडिकल कचरा",
      phoneticRomanized: "Khatarnak / Biomedical Kachra"
    },
    "e-waste & electronics": {
      translatedText: "ई-कचरा और इलेक्ट्रॉनिक्स",
      phoneticRomanized: "E-kachra aur electronics"
    },
    "general waste / unclassified": {
      translatedText: "सामान्य कचरा / अवर्गीकृत",
      phoneticRomanized: "Samanya kachra"
    },
    // Handling Tips
    "ideal for home composting or biogas! keep sealed in a biodegradable bag.": {
      translatedText: "🌱 घरेलू खाद या बायोगैस के लिए आदर्श! बायोडिग्रेडेबल बैग में बंद रखें।",
      phoneticRomanized: "Gharelu khaad ya biogas ke liye aadarsh! Biodegradable bag mein band rakhein."
    },
    "rinse and flatten bottles or paper before disposal.": {
      translatedText: "♻️ निपटान से पहले बोतलों या कागज को धोएं और समतल करें।",
      phoneticRomanized: "Niptan se pehle botlon ya kagaj ko dhoyen aur samtal karein."
    },
    "wrap securely and label as hazardous. requires specialized handling.": {
      translatedText: "☣️ सुरक्षित रूप से लपेटें और खतरनाक के रूप में लेबल करें। विशेष हैंडलिंग की आवश्यकता है।",
      phoneticRomanized: "Surakshit roop se lapeetein aur khatarnak ke roop mein label karein."
    },
    "deposit at an authorized e-waste collection point.": {
      translatedText: "⚡ किसी अधिकृत ई-कचरा संग्रह केंद्र पर जमा करें।",
      phoneticRomanized: "Kisi adhikrit e-kachra sangrah kendra par jama karein."
    },
    "check municipal segregated collection guidelines.": {
      translatedText: "ℹ️ नगर निगम के पृथक कचरा संग्रह दिशानिर्देशों की जांच करें।",
      phoneticRomanized: "Nagar nigam ke prithak kachra sangrah dishanirdeshon ki jaanch karein."
    },
    "rinse food cans clean and press lid flaps inward to protect sanitation personnel.": {
      translatedText: "⚙️ भोजन के डिब्बे धोकर साफ करें और ढक्कन को अंदर की ओर दबाएं।",
      phoneticRomanized: "Bhojan ke dibbe dhokar saaf karein aur dhakkan ko andar dabayein."
    }
  },
  ta: {
    "biodegradable (organic & wet waste)": {
      translatedText: "மக்கும் குப்பை (ஈரக் கழிவு)",
      phoneticRomanized: "Makkum kuppai (Eera kazhivu)"
    },
    "non-biodegradable / recyclable (dry waste)": {
      translatedText: "மக்காத குப்பை (உலர் கழிவு)",
      phoneticRomanized: "Makkaadha kuppai (Ular kazhivu)"
    }
  },
  te: {
    "biodegradable (organic & wet waste)": {
      translatedText: "జీవ విచ్ఛిన్నమయ్యే (తడి చెత్త)",
      phoneticRomanized: "Jeeva vichinnamayye (Tadi chetta)"
    }
  },
  kn: {
    "biodegradable (organic & wet waste)": {
      translatedText: "ಸಾವಯವ (ಹಸಿ ತ್ಯಾಜ್ಯ)",
      phoneticRomanized: "Saavayava (Hasi tyaajya)"
    }
  },
  mr: {
    "biodegradable (organic & wet waste)": {
      translatedText: "जैविक (ओला कचरा)",
      phoneticRomanized: "Jaivik (Ola kachra)"
    }
  },
  bn: {
    "biodegradable (organic & wet waste)": {
      translatedText: "পচনশীল (ভেজা বর্জ্য)",
      phoneticRomanized: "Pochonshil (Bheja borjo)"
    }
  },
  gu: {
    "biodegradable (organic & wet waste)": {
      translatedText: "જૈવિક (ભીનો કચરો)",
      phoneticRomanized: "Jaivik (Bhino kachro)"
    }
  },
  ml: {
    "biodegradable (organic & wet waste)": {
      translatedText: "ജൈവ മാലിന്യം (ഈർപ്പമുള്ള)",
      phoneticRomanized: "Jaiva maalinyam"
    }
  },
  pa: {
    "biodegradable (organic & wet waste)": {
      translatedText: "ਗਿੱਲਾ ਕੂੜਾ (ਜੈਵਿਕ)",
      phoneticRomanized: "Gilla kooda"
    }
  }
};

export function getLocalVernacularTranslation(text: string, lang: string): VernacularTranslation | null {
  if (!text || lang === 'en' || !VERNACULAR_DICTIONARY[lang]) return null;
  
  const cleanKey = text.replace(/[^\w\s\(\)/&\-]/g, '').trim().toLowerCase();
  const dict = VERNACULAR_DICTIONARY[lang];
  
  for (const [key, val] of Object.entries(dict)) {
    if (key === cleanKey || cleanKey.includes(key) || key.includes(cleanKey)) {
      return val;
    }
  }
  
  return null;
}
