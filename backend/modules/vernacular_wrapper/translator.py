"""
Vernacular & Regional Language Translation Engine
Translates emergency alerts, advice, and UI labels into Indian regional languages
with phonetic pronunciation and optional TTS speech metadata.
"""

import os
import re
import json
from typing import Dict, Any, List, Optional
try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

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

# Rich offline dictionary for instant translation of waste categories & handling tips
OFFLINE_DICTIONARY: Dict[str, Dict[str, Any]] = {
    "hi": {
        "biodegradable (organic & wet waste)": {"translated": "जैविक (गीला कचरा)", "phonetic": "Jaivik (Geela Kachra)"},
        "non-biodegradable / recyclable (dry waste)": {"translated": "गैर-जैविक / पुनर्चक्रण योग्य (सूखा कचरा)", "phonetic": "Gair-jaivik / Punarchakran yogya (Sookha Kachra)"},
        "hazardous / biomedical waste": {"translated": "खतरनाक / बायोमेडिकल कचरा", "phonetic": "Khatarnak / Biomedical Kachra"},
        "e-waste & electronics": {"translated": "ई-कचरा और इलेक्ट्रॉनिक्स", "phonetic": "E-kachra aur electronics"},
        "general waste / unclassified": {"translated": "सामान्य कचरा / अवर्गीकृत", "phonetic": "Samanya kachra"},
        "recyclable (metals & alloys)": {"translated": "पुनर्चक्रण योग्य (धातु और मिश्र धातु)", "phonetic": "Punarchakran yogya (Dhatu)"},
        "recyclable (paper & cardboard)": {"translated": "पुनर्चक्रण योग्य (कागज और कार्डबोर्ड)", "phonetic": "Punarchakran yogya (Kagaj)"},
        "non-biodegradable (plastic & polymers)": {"translated": "गैर-जैविक (प्लास्टिक और पॉलिमर)", "phonetic": "Gair-jaivik (Plastic)"},

        # Tips
        "ideal for home composting or biogas! keep sealed in a biodegradable bag.": {
            "translated": "🌱 घरेलू खाद या बायोगैस के लिए आदर्श! बायोडिग्रेडेबल बैग में बंद रखें।",
            "phonetic": "Gharelu khaad ya biogas ke liye aadarsh! Biodegradable bag mein band rakhein."
        },
        "rinse and flatten bottles or paper before disposal.": {
            "translated": "♻️ निपटान से पहले बोतलों या कागज को धोएं और समतल करें।",
            "phonetic": "Niptan se pehle botlon ya kagaj ko dhoyen aur samtal karein."
        },
        "wrap securely and label as hazardous. requires specialized handling.": {
            "translated": "☣️ सुरक्षित रूप से लपेटें और खतरनाक के रूप में लेबल करें। विशेष हैंडलिंग की आवश्यकता है।",
            "phonetic": "Surakshit roop se lapeetein aur khatarnak ke roop mein label karein."
        },
        "deposit at an authorized e-waste collection point.": {
            "translated": "⚡ किसी अधिकृत ई-कचरा संग्रह केंद्र पर जमा करें।",
            "phonetic": "Kisi adhikrit e-kachra sangrah kendra par jama karein."
        },
        "check municipal segregated collection guidelines.": {
            "translated": "ℹ️ नगर निगम के पृथक कचरा संग्रह दिशानिर्देशों की जांच करें।",
            "phonetic": "Nagar nigam ke prithak kachra sangrah dishanirdeshon ki jaanch karein."
        },
        "rinse food cans clean and press lid flaps inward to protect sanitation personnel.": {
            "translated": "⚙️ भोजन के डिब्बे धोकर साफ करें और ढक्कन को अंदर की ओर दबाएं।",
            "phonetic": "Bhojan ke dibbe dhokar saaf karein aur dhakkan ko andar dabayein."
        }
    },
    "ta": {
        "biodegradable (organic & wet waste)": {"translated": "மக்கும் குப்பை (ஈரக் கழிவு)", "phonetic": "Makkum kuppai (Eera kazhivu)"},
        "non-biodegradable / recyclable (dry waste)": {"translated": "மக்காத குப்பை (உலர் கழிவு)", "phonetic": "Makkaadha kuppai (Ular kazhivu)"},
        "hazardous / biomedical waste": {"translated": "அபாயகரமான கழிவு", "phonetic": "Abhayagaramaana kazhivu"},
        "e-waste & electronics": {"translated": "மின்சாரக் கழிவு (இ-வேஸ்ட்)", "phonetic": "Minsara kazhivu"}
    },
    "te": {
        "biodegradable (organic & wet waste)": {"translated": "జీవ విచ్ఛిన్నమయ్యే (తడి చెత్త)", "phonetic": "Jeeva vichinnamayye (Tadi chetta)"},
        "non-biodegradable / recyclable (dry waste)": {"translated": "పొడి చెత్త (రీసైకిల్ व्यర్థాలు)", "phonetic": "Podi chetta"}
    },
    "kn": {
        "biodegradable (organic & wet waste)": {"translated": "ಸಾವಯವ (ಹಸಿ ತ್ಯಾಜ್ಯ)", "phonetic": "Saavayava (Hasi tyaajya)"},
        "non-biodegradable / recyclable (dry waste)": {"translated": "ಒಣ ತ್ಯಾಜ್ಯ (ಮರುಬಳಕೆ)", "phonetic": "Ona tyaajya"}
    },
    "mr": {
        "biodegradable (organic & wet waste)": {"translated": "जैविक (ओला कचरा)", "phonetic": "Jaivik (Ola kachra)"},
        "non-biodegradable / recyclable (dry waste)": {"translated": "सुका कचरा (पुनर्वापर योग्य)", "phonetic": "Suka kachra"}
    },
    "bn": {
        "biodegradable (organic & wet waste)": {"translated": "পচনশীল (ভেজা বর্জ্য)", "phonetic": "Pochonshil (Bheja borjo)"},
        "non-biodegradable / recyclable (dry waste)": {"translated": "অপচনশীল (শুকনো বর্জ্য)", "phonetic": "Opochonshil"}
    },
    "gu": {
        "biodegradable (organic & wet waste)": {"translated": "જૈવિક (ભીનો કચરો)", "phonetic": "Jaivik (Bhino kachro)"},
        "non-biodegradable / recyclable (dry waste)": {"translated": "સૂકો કચરો (રિસાયકલ)", "phonetic": "Suko kachro"}
    },
    "ml": {
        "biodegradable (organic & wet waste)": {"translated": "ജൈവ മാലിന്യം (ഈർപ്പമുള്ള)", "phonetic": "Jaiva maalinyam"},
        "non-biodegradable / recyclable (dry waste)": {"translated": "അജൈവ മാലിന്യം (ഉണങ്ങിയ)", "phonetic": "Ajaiva maalinyam"}
    },
    "pa": {
        "biodegradable (organic & wet waste)": {"translated": "ਗਿੱਲਾ ਕੂੜਾ (ਜੈਵਿਕ)", "phonetic": "Gilla kooda"},
        "non-biodegradable / recyclable (dry waste)": {"translated": "ਸੁੱਕਾ ਕੂੜਾ (ਰੀਸਾਈਕਲ)", "phonetic": "Sukka kooda"}
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

    def _normalize(self, text: str) -> str:
        # Strip emojis and leading/trailing punctuation/spaces
        cleaned = re.sub(r'[^\w\s\(\)/&\-]', '', text).strip().lower()
        return cleaned

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
        norm_key = self._normalize(text)

        # 1. Check offline dictionary (using normalized key matching)
        if target_lang in OFFLINE_DICTIONARY:
            lang_dict = OFFLINE_DICTIONARY[target_lang]
            for key, entry in lang_dict.items():
                if key == norm_key or key in norm_key or norm_key in key:
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
