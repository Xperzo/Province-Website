from flask import Flask, request, jsonify, send_from_directory
import json
import difflib
import re

app = Flask(__name__, static_folder='.', static_url_path='')

# =========================================================
# 1) Chargement du brain : faq.json
# =========================================================

with open("faq.json", encoding="utf-8") as f:
    FAQ = json.load(f)

ALL_QUESTIONS = []      # questions normalisées
Q_TO_INDEX = {}         # question_norm -> index dans FAQ
Q_TOKENS = {}           # question_norm -> set de mots importants

STOPWORDS = {
    # français
    "quels", "quelles", "quel", "quelle",
    "est", "sont", "les", "des", "de", "la", "le", "du", "au", "aux",
    "en", "dans", "à", "a", "un", "une",
    "cest", "c'est", "questce", "quoi",
    "comment", "je", "puis", "peux", "peut", "m", "me",
    "mon", "ma", "mes", "ton", "ta", "tes",
    "pour", "sur", "avec",
    # anglais
    "what", "is", "the", "are", "do", "does", "how", "where", "when",
    "why", "which", "about", "tell", "me",
    # arabe / darija (simplifié)
    "ما", "هي", "شنو", "واش", "في", "ف", "كيفاش", "من", "على"
}


def tokenize(text: str):
    """Découpe en mots FR/EN/AR et enlève les petits mots inutiles."""
    words = re.findall(r"[a-zA-Z0-9\u0600-\u06FF]+", text.lower())
    tokens = {w for w in words if w not in STOPWORDS and len(w) > 2}
    return tokens


# Préparer l'index des questions du FAQ
for idx, item in enumerate(FAQ):
    q = item.get("question")
    if not q:
        continue
    q_norm = q.strip().lower()
    ALL_QUESTIONS.append(q_norm)
    Q_TO_INDEX[q_norm] = idx
    Q_TOKENS[q_norm] = tokenize(q_norm)


# =========================================================
# 2) Détection de langue + salutations / remerciements
# =========================================================

def detect_language(text: str) -> str:
    """
    Retourne: 'fr', 'en', 'ma', 'ar'
    """
    txt = text.strip()

    # caractères arabes -> arabe / darija
    if any('\u0600' <= ch <= '\u06FF' for ch in txt):
        if any(w in txt for w in ["شنو", "فين", "واش", "كيفاش", "بغيت"]):
            return "ma"
        return "ar"

    lower = txt.lower()
    # heuristique anglais
    if any(w in lower for w in ["what", "how", "where", "why", "when", "which", "program", "center"]):
        return "en"

    # sinon on part sur français
    return "fr"


def detect_greetings(message: str):
    msg = message.lower().strip()
    greetings = {
        "fr": ["bonjour", "bonsoir", "salut", "slt", "coucou"],
        "ma": ["salam", "slm", "salam kho", "salam khouya"],
        "ar": ["السلام عليكم", "السلام", "مرحبا"],
        "en": ["hello", "hi", "hey", "yo", "good morning", "good evening"]
    }
    for lang, words in greetings.items():
        if any(w in msg for w in words):
            return lang
    return None


def greeting_reply(lang: str) -> str:
    if lang == "fr":
        return ("👋 Bonjour, je suis le chatbot de l’OFPPT Province Settat.\n"
                "Pose-moi tes questions sur les filières, les centres, les secteurs, "
                "les conditions d’admission et la localisation des établissements.")
    if lang == "en":
        return ("👋 Hello! I am the chatbot for OFPPT in Settat province.\n"
                "You can ask me about programs, centers, sectors, admission conditions and locations.")
    if lang == "ma":
        return ("👋 سلام، أنا شات بوت ديال OFPPT فإقليم سطات.\n"
                "سولني على الفيلات، المراكز، السكطورات، شروط القبول واللوكيز ديال المراكز.")
    if lang == "ar":
        return ("👋 مرحبا، أنا المساعد الرقمي للأوفپط بإقليم سطات.\n"
                "يمكنك سؤالي عن الشعب، المراكز، القطاعات، شروط الولوج ومواقع مؤسسات التكوين.")
    return greeting_reply("fr")


def detect_thanks(message: str) -> bool:
    msg = message.lower().strip()
    thanks_words = [
        "merci", "mercii", "shokran", "choukran", "chokrane",
        "thanks", "thank you", "barakallah fik", "allah yjazik", "allay jaski"
    ]
    return any(word in msg for word in thanks_words)


def small_talk_response(message: str, lang: str):
    """Réponses humaines pour 'merci', 'ok', etc."""
    if detect_thanks(message):
        return {
            "fr": "😊 Avec plaisir ! Si tu as une autre question sur l’OFPPT Province Settat, je suis là.",
            "ma": "😊 مرحبا خويا/ختي! إلا عندك شي سؤال آخر على OFPPT فسطات أنا موجود.",
            "ar": "😊 على الرحب والسعة! إذا كان لديك أي سؤال آخر حول الأوفپط بإقليم سطات فأنا هنا.",
            "en": "😊 You're welcome! If you have any other question about OFPPT in Settat province, I'm here."
        }.get(lang, "😊 Avec plaisir !")

    # petites réponses genre "ok", "d'accord", "hm", "??"
    msg = message.strip()
    if len(msg) <= 3 or msg.lower() in {"ok", "d'accord", "dac", "hmm", "??"}:
        return {
            "fr": "👍 D’accord. Tu peux par exemple demander : "
                  "`filières en ISTA2`, `inscription`, `BTP`, `digital`, `gestion des entreprises`…",
            "ma": "👍 واخي! تقدر تسول بحال: "
                  "`فيلات ISTA2`, `التسجيل`, `BTP`, `digital`, `gestion des entreprises`…",
            "ar": "👍 جيد! يمكنك أن تسأل مثلاً: "
                  "`الشعب في ISTA2`, `طريقة التسجيل`, `BTP`, `digital`, `gestion des entreprises`…",
            "en": "👍 Okay! You can ask things like: "
                  "`ISTA2 programs`, `registration`, `BTP`, `digital`, `business management`…"
        }.get(lang)
    return None


# =========================================================
# 3) Réponses spéciales par mots-clés (ofppt, btp, digital…)
# =========================================================

def adapt_lang(fr_answer: str, lang: str) -> str:
    """Ajoute une petite intro selon la langue, mais garde le contenu FR."""
    if lang == "fr":
        return fr_answer
    if lang == "en":
        return "Here is some information (in French):\n\n" + fr_answer
    if lang == "ma":
        return "ها شوية ديال المعلومات (بالفرنسية):\n\n" + fr_answer
    if lang == "ar":
        return "إليك بعض المعلومات (باللغة الفرنسية):\n\n" + fr_answer
    return fr_answer


def keyword_intent(message: str, lang: str):
    """Réponses rapides basées sur quelques mots-clés globaux."""
    tokens = tokenize(message)
    if not tokens:
        return None

    t = {w.lower() for w in tokens}

    # --- OFPPT général ---
    if "ofppt" in t:
        fr = (
            "L’OFPPT (Office de la Formation Professionnelle et de la Promotion du Travail) "
            "est l’organisme public qui gère la formation professionnelle au Maroc. "
            "Dans la province de Settat, il regroupe plusieurs centres et complexes "
            "(Settat, Ben Ahmed, École Mohammed VI BTP, etc.) avec des filières dans "
            "le digital, le génie électrique, le BTP, la gestion & commerce, etc."
        )
        return adapt_lang(fr, lang)

    # --- Villes ---
    if "settat" in t:
        fr = (
            "À Settat, l’OFPPT propose plusieurs filières dans différents secteurs "
            "(Digital & IT, Génie Électrique, Génie Mécanique, Gestion & Commerce, BTP, etc.). "
            "Tu peux demander : « filières en ISTA2 », « filières en ISTA NTIC2 », "
            "ou « filières à Settat » pour avoir la liste détaillée."
        )
        return adapt_lang(fr, lang)

    if "ben" in t or "benahmed" in t or "ahmed" in t:
        fr = (
            "À Ben Ahmed, l’OFPPT dispose d’un complexe de formation avec plusieurs filières "
            "techniques et de gestion. Tu peux demander : « filières à Ben Ahmed » "
            "pour voir la liste détaillée."
        )
        return adapt_lang(fr, lang)

    if "elbrouj" in t or "brouj" in t:
        fr = (
            "À El Brouj, certaines filières OFPPT sont proposées selon les années et les besoins. "
            "Pour plus de détails, consulte la page Offre de formation ou demande une filière précise."
        )
        return adapt_lang(fr, lang)

    # --- Secteurs ---
    secteur_btp = {"btp", "batiment", "bâtiment", "construction"}
    secteur_digital = {"digital", "informatique", "dev", "programmation"}
    secteur_ge = {"electrique", "électrique", "electricite", "électricité"}
    secteur_gestion = {"gestion", "commerce", "commercial", "commerciaux"}
    secteur_tourisme = {"tourisme", "hotel", "hôtel", "hotellerie", "hôtellerie", "restauration"}
    secteur_textile = {"textile", "habillement", "vetement", "vêtement"}

    if t & secteur_btp:
        fr = (
            "Le secteur BTP (Bâtiment & Travaux Publics) regroupe des filières liées "
            "au chantier, à la sécurité, à la maintenance des engins, au dessin de bâtiment, etc. "
            "Dans la province de Settat, plusieurs filières BTP sont proposées, surtout à "
            "l’École Mohammed VI BTP et dans certains complexes."
        )
        return adapt_lang(fr, lang)

    if t & secteur_digital:
        fr = (
            "Le secteur Digital & IT regroupe des filières comme Développement Digital, "
            "Infrastructure Digitale, Support Informatique, etc. "
            "Ces filières préparent aux métiers du développement, des réseaux et des systèmes."
        )
        return adapt_lang(fr, lang)

    if t & secteur_ge:
        fr = (
            "Le secteur Génie Électrique couvre des filières comme Électricité d’Installation, "
            "Électromécanique des Systèmes Automatisés, etc. "
            "Ces formations mènent aux métiers d’électricien, de maintenance industrielle, etc."
        )
        return adapt_lang(fr, lang)

    if t & secteur_gestion:
        fr = (
            "Le secteur Gestion & Commerce regroupe des filières comme Gestion des Entreprises, "
            "Techniques de Vente, Assistant Administratif, etc. "
            "Elles préparent aux métiers de l’administration, de la comptabilité et du commerce."
        )
        return adapt_lang(fr, lang)

    if t & secteur_tourisme:
        fr = (
            "Le secteur Tourisme, Hôtellerie & Restauration propose des formations en service, "
            "cuisine, hébergement, réception, etc. "
            "Il prépare aux métiers des hôtels, restaurants et structures touristiques."
        )
        return adapt_lang(fr, lang)

    if t & secteur_textile:
        fr = (
            "Le secteur Textile & Habillement concerne les métiers de la confection, "
            "du modélisme, de la coupe et de la production textile."
        )
        return adapt_lang(fr, lang)

    return None


# =========================================================
# 4) Recherche intelligente dans le FAQ
# =========================================================

def find_faq_answer(message: str):
    """Cherche la meilleure question dans faq.json avec un vrai score."""
    msg_norm = message.strip().lower()
    msg_tokens = tokenize(msg_norm)
    if not msg_tokens:
        return None

    # 1) ne garder QUE les questions qui partagent au moins 1 mot important
    candidats = []
    for q_norm in ALL_QUESTIONS:
        if msg_tokens & Q_TOKENS[q_norm]:
            candidats.append(q_norm)

    if not candidats:
        return None

    # 2) calcul d'un score (chars + tokens) pour chaque candidat
    best_q = None
    best_score = 0.0

    for q_norm in candidats:
        char_score = difflib.SequenceMatcher(None, msg_norm, q_norm).ratio()
        inter = len(msg_tokens & Q_TOKENS[q_norm])
        union = len(msg_tokens | Q_TOKENS[q_norm])
        token_score = inter / union if union else 0
        score = 0.5 * char_score + 0.5 * token_score
        if score > best_score:
            best_score = score
            best_q = q_norm

    # 3) si le score est trop faible -> on considère qu'on n'a rien trouvé
    if not best_q or best_score < 0.35:
        return None

    idx = Q_TO_INDEX[best_q]
    item = FAQ[idx]
    return item.get("answer")


def fallback_message(lang: str) -> str:
    if lang == "fr":
        return ("Je n'ai pas trouvé une réponse précise dans ma base, "
                "mais je réponds uniquement sur l’OFPPT dans la province de Settat "
                "(filières, centres, secteurs, admission, localisation...). "
                "Essaie avec des mots-clés comme : `ISTA2`, `BTP`, `digital`, "
                "`inscription`, `gestion des entreprises`, etc.")
    if lang == "en":
        return ("I couldn't find an exact answer. I only answer questions related to "
                "OFPPT in Settat province (programs, centers, sectors, admission, locations...).")
    if lang == "ma":
        return ("مالقيتش جواب مضبوط فالداتا، حيت أنا كنخدم غير على OFPPT فإقليم سطات "
                "(الفيلات، المراكز، السكطورات، شروط القبول، اللوكيز...). "
                "جرب كلمات بحال: ISTA2, BTP, digital, التسجيل، gestion des entreprises…")
    if lang == "ar":
        return ("لم أجد جواباً دقيقاً في قاعدة المعطيات، "
                "لأنني أجيب فقط عن الأسئلة المتعلقة بالأوفپط في إقليم سطات "
                "(الشعب، المراكز، القطاعات، شروط الولوج، المواقع...).")
    return "Je n'ai pas trouvé de réponse pour cette question."


# =========================================================
# 5) Orchestrateur principal
# =========================================================

def trouver_reponse(message: str) -> str:
    lang = detect_language(message)

    # 1) bonjour / salam / hi
    if detect_greetings(message):
        return greeting_reply(lang)

    # 2) merci / ok / hm...
    talk = small_talk_response(message, lang)
    if talk:
        return talk

    # 3) mots-clés globaux (ofppt, settat, btp...)
    kw_answer = keyword_intent(message, lang)
    if kw_answer:
        return kw_answer

    # 4) recherche dans le brain faq.json
    base_answer = find_faq_answer(message)
    if base_answer:
        return adapt_lang(base_answer, lang)

    # 5) sinon -> message d’aide
    return fallback_message(lang)


# =========================================================
# 6) Routes Flask
# =========================================================

@app.route("/")
def index():
    # sert ton index.html existant
    return send_from_directory(".", "index.html")


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json() or {}
    message = data.get("message", "")
    reply = trouver_reponse(message)
    return jsonify({"reply": reply})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000, debug=True)
