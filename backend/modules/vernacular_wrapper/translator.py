"""
Vernacular & Regional Language Translation Engine
Translates emergency alerts, advice, and UI labels into Indian regional languages
with phonetic pronunciation and optional TTS speech metadata.
"""

import os
import json
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

load_dotenv()

SUPPORTED_LANGUAGES: Dict[str, str] = {
    "en": "English",
    "hi": "Hindi (हिन्दी)",
    "ta": "Tamil (தமிழ்)",
    "te": "Telugu (తెలుగు)",
    "kn": "Kannada (ಕನ್ನಡ)",
    "mr": "Marathi (मराठी)",
    "bn": "Bengali (বাংলা)",
    "gu": "Gujarati (ગુજરાતી)",
    "ml": "Malayalam (മലയാളം)",
    "pa": "Punjabi (ਪੰਜਾਬੀ)"
}

# Offline dictionary fallback for essential waste & environmental terms
OFFLINE_DICTIONARY: Dict[str, Dict[str, Any]] = {
    "hi": {
        "Biodegradable (Organic & Wet Waste)": {"translated": "जैविक (गीला कचरा)", "phonetic": "Jaivik (Geela Kachra)"},
        "Non-biodegradable / Recyclable (Dry Waste)": {"translated": "गैर-जैविक / पुनर्चक्रण योग्य (सूखा कचरा)", "phonetic": "Gair-jaivik / Punarchakran yogya (Sookha Kachra)"},
        "Hazardous / Biomedical Waste": {"translated": "खतरनाक / बायोमेडिकल कचरा", "phonetic": "Khatarnak / Biomedical Kachra"},
        "E-Waste & Electronics": {"translated": "ई-कचरा और इलेक्ट्रॉनिक्स", "phonetic": "E-kachra aur electronics"},
        "Rinse and flatten bottles or paper before disposal.": {"translated": "निपटान से पहले बोतलों या कागज को धोएं और समतल करें।", "phonetic": "Niptan se pehle botlon ya kagaj ko dhoyen aur samtal karein."},
        "Ideal for home composting or biogas! Keep sealed in a biodegradable bag.": {"translated": "घरेलू खाद या बायोगैस के लिए आदर्श! बायोडिग्रेडेबल बैग में सील रखें।", "phonetic": "Gharelu khaad ya biogas ke liye aadarsh! Biodegradable bag mein seal rakhein."},
        "Wrap securely and label as hazardous. Requires specialized handling.": {"translated": "सुरक्षित रूप से लपेटें और खतरनाक के रूप में लेबल करें। विशेष हैंडलिंग की आवश्यकता है।", "phonetic": "Surakshit roop se lapeetein aur khatarnak ke roop mein label karein."},
        "Deposit at an authorized E-waste collection point.": {"translated": "किसी अधिकृत ई-कचरा संग्रह केंद्र पर जमा करें।", "phonetic": "Kisi adhikrit e-kachra sangrah kendra par jama karein."}
    },
    "ta": {
        "Biodegradable (Organic & Wet Waste)": {"translated": "மக்கும் குப்பை (ஈரக் கழிவு)", "phonetic": "Makkum kuppai (Eera kazhivu)"},
        "Non-biodegradable / Recyclable (Dry Waste)": {"translated": "மக்காத குப்பை / மறுசுழற்சி (உலர் கழிவு)", "phonetic": "Makkaadha kuppai / Marusuzharchi"},
        "E-Waste & Electronics": {"translated": "மின்சாரக் கழிவு (இ-வேஸ்ட்)", "phonetic": "Minsara kazhivu (E-waste)"}
    },
    "te": {
        "Biodegradable (Organic & Wet Waste)": {"translated": "జీవ విచ్ఛిన్నమయ్యే (తడి చెత్త)", "phonetic": "Jeeva vichinnamayye (Tadi chetta)"},
        "Non-biodegradable / Recyclable (Dry Waste)": {"translated": "పొడి చెత్త / రీసైకిల్ వ్యర్థాలు", "phonetic": "Podi chetta / Recycle vyarthalu"}
    },
    "kn": {
        "Biodegradable (Organic & Wet Waste)": {"translated": "ಸಾವಯವ (ಹಸಿ ತ್ಯಾಜ್ಯ)", "phonetic": "Saavayava (Hasi tyaajya)"},
        "Non-biodegradable / Recyclable (Dry Waste)": {"translated": "ಒಣ ತ್ಯಾಜ್ಯ (ಮರುಬಳಕೆ)", "phonetic": "Ona tyaajya (Marubalake)"}
    },
    "mr": {
        "Biodegradable (Organic & Wet Waste)": {"translated": "जैविक (ओला कचरा)", "phonetic": "Jaivik (Ola kachra)"},
        "Non-biodegradable / Recyclable (Dry Waste)": {"translated": "सुका कचरा (पुनर्वापर योग्य)", "phonetic": "Suka kachra (Punarvaapar yogya)"}
    },
    "bn": {
        "Biodegradable (Organic & Wet Waste)": {"translated": "পচনশীল (ভেজা বর্জ্য)", "phonetic": "Pochonshil (Bheja borjo)"},
        "Non-biodegradable / Recyclable (Dry Waste)": {"translated": "অপচনশীল / রিসাইকেলযোগ্য (শুকনো বর্জ্য)", "phonetic": "Opochonshil (Shukno borjo)"}
    },
    "gu": {
        "Biodegradable (Organic & Wet Waste)": {"translated": "જૈવિક (ભીનો કચરો)", "phonetic": "Jaivik (Bhino kachro)"},
        "Non-biodegradable / Recyclable (Dry Waste)": {"translated": "સૂકો કચરો (રિસાયકલ योग्य)", "phonetic": "Suko kachro"}
    },
    "ml": {
        "Biodegradable (Organic & Wet Waste)": {"translated": "ജൈവ മാലിന്യം (ഈർപ്പമുള്ള മാലിന്യം)", "phonetic": "Jaiva maalinyam"},
        "Non-biodegradable / Recyclable (Dry Waste)": {"translated": "അജൈവ മാലിന്യം (ഉണങ്ങിയ മാലിന്യം)", "phonetic": "Ajaiva maalinyam"}
    },
    "pa": {
        "Biodegradable (Organic & Wet Waste)": {"translated": "ਗਿੱਲਾ ਕੂੜਾ (ਜੈਵਿਕ)", "phonetic": "Gilla kooda (Jaivik)"},
        "Non-biodegradable / Recyclable (Dry Waste)": {"translated": "ਸੁੱਕਾ ਕੂੜਾ (ਰੀਸਾਈਕਲ ਯੋਗ)", "phonetic": "Sukka kooda"}
    }
}

class VernacularTranslator:
    def __init__(self):
        self.groq_client = None
        api_key = os.getenv("GROQ_API_KEY")
        if api_key and not api_key.startswith("your_"):
            try:
                from groq import Groq
                self.groq_client = Groq(api_key=api_key)
            except Exception as exc:
                print(f"VernacularTranslator: Groq init skipped: {exc}")

    def translate_text(self, text: str, target_lang: str) -> Dict[str, Any]:
        target_lang = target_lang.lower().strip()
        if target_lang == "en" or not text or not text.strip():
            return {
                "source_text": text,
                "target_language_code": "en",
                "target_language_name": "English",
                "translated_text": text,
                "phonetic_romanized": text,
                "engine": "passthrough"
            }

        lang_name = SUPPORTED_LANGUAGES.get(target_lang, "Hindi")

        # 1. Check offline dictionary
        if target_lang in OFFLINE_DICTIONARY and text in OFFLINE_DICTIONARY[target_lang]:
            entry = OFFLINE_DICTIONARY[target_lang][text]
            return {
                "source_text": text,
                "target_language_code": target_lang,
                "target_language_name": lang_name,
                "translated_text": entry["translated"],
                "phonetic_romanized": entry["phonetic"],
                "engine": "offline_dictionary"
            }

        # 2. Try Groq LLM Translation if configured
        if self.groq_client:
            try:
                prompt = f"""
Translate the following waste/environmental text into natural {lang_name} ({target_lang}).
Provide both the native script translation and a romanized phonetic pronunciation (in English letters).

TEXT: "{text}"

OUTPUT JSON ONLY:
{{
  "translated_text": "native script translation",
  "phonetic_romanized": "phonetic english pronunciation"
}}
"""
                response = self.groq_client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": "You are a professional Indian regional language translator. Output valid JSON only."},
                        {"role": "user", "content": prompt}
                    ],
                    model="openai/gpt-oss-120b",
                    temperature=0.1,
                    max_tokens=250
                )
                raw = response.choices[0].message.content
                match = re.search(r'(\{[\s\S]*\})', raw)
                if match:
                    parsed = json.loads(match.group(1))
                    return {
                        "source_text": text,
                        "target_language_code": target_lang,
                        "target_language_name": lang_name,
                        "translated_text": parsed.get("translated_text", text),
                        "phonetic_romanized": parsed.get("phonetic_romanized", text),
                        "engine": "groq_llm"
                    }
            except Exception as exc:
                print(f"Groq translation error: {exc}")

        # Fallback response
        return {
            "source_text": text,
            "target_language_code": target_lang,
            "target_language_name": lang_name,
            "translated_text": f"[{lang_name}] {text}",
            "phonetic_romanized": text,
            "engine": "fallback"
        }

translator = VernacularTranslator()
