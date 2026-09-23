"""
chat.py — the "DECO" shopping assistant.

Two modes, picked automatically:

1. **AI mode** (if the ANTHROPIC_API_KEY environment variable is set): every
   message is sent to the Anthropic Messages API, along with a system prompt
   that grounds the model in Decorna's real catalog (names, prices,
   categories) pulled straight from the database, so it never invents a
   product or a price. This is what gives the assistant a real ChatGPT-style
   back-and-forth: free-form questions, follow-ups, multi-language replies.

2. **Fallback mode** (no API key, or the API call fails/times out): a
   keyword-based responder that still answers from the real product data —
   it can quote actual prices, suggest categories, and recognize greetings,
   thanks, and common intents in French / English / Arabic. It's not a
   language model, but it never contradicts the catalog either.

Nothing about mode 2 requires network access, so the assistant always
responds instantly even with zero configuration.
"""
import json
import os
import re
import urllib.error
import urllib.request

import db as db_module

ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"
ANTHROPIC_VERSION = "2023-06-01"
DEFAULT_MODEL = os.environ.get("DECORNA_CHAT_MODEL", "claude-3-5-haiku-20241022")
MAX_HISTORY_TURNS = 8  # keep the request small; the browser keeps the full transcript


def _catalog_context(db):
    """A short, plain-text summary of the live catalog for the system prompt."""
    rows = db.execute(
        "SELECT cat_key, name_fr, name_en, price FROM products WHERE is_active = 1 ORDER BY cat_key, id"
    ).fetchall()
    if not rows:
        return "Le catalogue est actuellement vide."
    lines = [f"- {r['name_fr']} / {r['name_en']} — {r['price']} MAD (catégorie: {r['cat_key']})" for r in rows]
    return "\n".join(lines)


def _system_prompt(db):
    return (
        "Tu es DECO, l'assistant virtuel du site Decorna, une petite entreprise scolaire "
        "de décoration recyclée fondée par des lycéens du Lycée Al Fath à Khemisset, au Maroc. "
        "Ils recyclent carton et plastique pour fabriquer des vases, lampes, cadres, paniers, "
        "horloges et objets muraux, entièrement à la main.\n\n"
        "Voici le catalogue réel actuellement en vente (ne mentionne jamais un produit ou un "
        "prix qui n'y figure pas) :\n" + _catalog_context(db) + "\n\n"
        "Consignes :\n"
        "- Réponds toujours dans la même langue que le message de la personne (français, "
        "anglais ou arabe).\n"
        "- Sois chaleureux, clair, et toujours honnête sur ce que tu sais ou non. Adapte la "
        "longueur de ta réponse à la question : une phrase pour une question simple, plus de "
        "détails si c'est demandé ou nécessaire.\n"
        "- Tu es avant tout l'assistant de Decorna : pour tout ce qui concerne la boutique "
        "(produits, prix, commandes, paiement, recyclage, contact), utilise uniquement les "
        "informations ci-dessus, jamais d'invention.\n"
        "- Le site propose deux modes de paiement : à la livraison, ou par carte (paiement de "
        "démonstration). Tu peux orienter vers les pages du site (Produits, Notre histoire, "
        "Contact, Panier), ou donner les coordonnées : Instagram @decorna_officiel, Facebook "
        "'Decorna Decornaofficiel', email decornacontact@gmail.com.\n"
        "- En dehors de la boutique, tu es un assistant généraliste normal : tu peux répondre "
        "à n'importe quelle question (culture générale, aide à la rédaction, explications, "
        "conseils déco ou bricolage, etc.) du mieux que tu peux, avec tes connaissances "
        "générales. Ne refuse et ne redirige pas une question simplement parce qu'elle ne "
        "concerne pas Decorna.\n"
    )


def _call_anthropic(api_key, system_prompt, history, message):
    messages = list(history[-MAX_HISTORY_TURNS:])
    messages.append({"role": "user", "content": message})

    payload = json.dumps({
        "model": DEFAULT_MODEL,
        "max_tokens": 1024,
        "system": system_prompt,
        "messages": messages,
    }).encode("utf-8")

    req = urllib.request.Request(
        ANTHROPIC_API_URL,
        data=payload,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "x-api-key": api_key,
            "anthropic-version": ANTHROPIC_VERSION,
        },
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read().decode("utf-8"))

    text_blocks = [b["text"] for b in data.get("content", []) if b.get("type") == "text"]
    reply = "\n".join(text_blocks).strip()
    if not reply:
        raise ValueError("Empty response from Anthropic API")
    return reply


# ---------------------------------------------------------------- fallback --

_INTENTS = [
    (re.compile(r"panier|achat|command|cart|buy|order|سلة|طلب", re.I),
     {"fr": "Pour ajouter un produit, clique sur \"Ajouter\" sur sa fiche, puis ouvre ton "
            "panier avec l'icône en haut à droite pour ajuster les quantités ou payer.",
      "en": "To add a product, click \"Add\" on its card, then open your cart from the "
            "top-right icon to adjust quantities or check out.",
      "ar": "لإضافة منتج، اضغط على \"أضف\" في بطاقته، ثم افتح سلتك من الأيقونة أعلى اليمين "
            "لضبط الكميات أو الدفع."}),
    (re.compile(r"prix|coût|cout|combien|price|cost|how much|سعر|ثمن", re.I), None),  # handled specially
    (re.compile(r"compte|profil|inscri|connex|login|account|profile|signup|حساب|تسجيل", re.I),
     {"fr": "Tu peux créer un compte ou te connecter depuis l'icône profil en haut à droite.",
      "en": "You can create an account or log in from the profile icon at the top right.",
      "ar": "يمكنك إنشاء حساب أو تسجيل الدخول من أيقونة الملف الشخصي أعلى اليمين."}),
    (re.compile(r"contact|instagram|facebook|email|mail|تواصل|بريد", re.I),
     {"fr": "Tu peux nous écrire sur Instagram @decorna_officiel, Facebook 'Decorna "
            "Decornaofficiel', ou par email à decornacontact@gmail.com.",
      "en": "You can reach us on Instagram @decorna_officiel, Facebook 'Decorna "
            "Decornaofficiel', or by email at decornacontact@gmail.com.",
      "ar": "يمكنك مراسلتنا عبر إنستغرام @decorna_officiel أو فيسبوك 'Decorna "
            "Decornaofficiel'، أو البريد الإلكتروني decornacontact@gmail.com."}),
    (re.compile(r"livrai|paiement|payment|delivery|cod|carte|card|شحن|توصيل|دفع", re.I),
     {"fr": "Deux modes de paiement : à la livraison, ou par carte bancaire (paiement de "
            "démonstration sur ce site).",
      "en": "Two payment options: cash on delivery, or by card (demo payment on this site).",
      "ar": "طريقتان للدفع: عند الاستلام، أو بالبطاقة البنكية (دفع تجريبي على هذا الموقع)."}),
    (re.compile(r"qui|histoire|lycee|lycée|khemisset|propos|who|about|story|school|قصة|مدرسة", re.I),
     {"fr": "Decorna est un projet mené par des lycéens du Lycée Al Fath à Khemisset : ils "
            "recyclent carton et plastique pour créer des objets de décoration faits main.",
      "en": "Decorna is a project run by high-schoolers at Lycée Al Fath in Khemisset: they "
            "recycle cardboard and plastic into handmade decor pieces.",
      "ar": "ديكورنا مشروع يقوده تلاميذ ثانوية الفتح بالخميسات: يعيدون تدوير الكرتون والبلاستيك "
            "لصنع قطع ديكور يدوية."}),
    (re.compile(r"bonjour|salut|slt|hello|hi\b|hey|مرحبا|سلام", re.I),
     {"fr": "Salut ! Comment puis-je t'aider à te repérer sur Decorna aujourd'hui ?",
      "en": "Hi! How can I help you find your way around Decorna today?",
      "ar": "مرحبًا! كيف يمكنني مساعدتك في التنقل داخل ديكورنا اليوم؟"}),
    (re.compile(r"merci|thanks|thank you|شكرا", re.I),
     {"fr": "Avec plaisir 🌿", "en": "My pleasure! 🌿", "ar": "بكل سرور! 🌿"}),
]

_FALLBACK_MSG = {
    "fr": "Je ne suis pas certain de bien comprendre, mais je peux t'aider à trouver un "
          "produit, expliquer notre démarche, ou te donner nos coordonnées — que veux-tu savoir ?",
    "en": "I'm not totally sure I follow, but I can help you find a product, explain what "
          "we do, or give you our contact info — what would you like to know?",
    "ar": "لست متأكدًا من فهمي الكامل، لكن يمكنني مساعدتك في إيجاد منتج أو شرح عملنا أو "
          "تزويدك بمعلومات التواصل — ماذا تريد أن تعرف؟",
}


def _detect_lang(text):
    if re.search(r"[\u0600-\u06FF]", text):
        return "ar"
    # A short list of common English function words is enough to distinguish
    # from French for this small assistant; anything else defaults to French,
    # which is the site's primary language.
    if re.search(r"\b(the|is|are|price|how|what|hello|hi|thanks)\b", text, re.I):
        return "en"
    return "fr"


_QUOTED_NAME_RE = re.compile(r'["\u201c]([^"\u201d]+)["\u201d]')


def _core_name(full_name):
    """Extract the distinctive part of a product name for loose matching,
    e.g. 'Vase "Mawja"' -> 'mawja'. Falls back to the full name if there's
    no quoted segment (some products, like the bubble vase, use one)."""
    if not full_name:
        return ""
    match = _QUOTED_NAME_RE.search(full_name)
    return (match.group(1) if match else full_name).lower().strip()


def _find_product_price(db, text, lang):
    rows = db.execute(
        "SELECT name_fr, name_en, price FROM products WHERE is_active = 1"
    ).fetchall()
    text_low = text.lower()
    for r in rows:
        core_fr = _core_name(r["name_fr"])
        core_en = _core_name(r["name_en"])
        if (core_fr and core_fr in text_low) or (core_en and core_en in text_low):
            return r
    return None


def fallback_reply(db, message):
    lang = _detect_lang(message)

    price_match = re.search(r"prix|coût|cout|combien|price|cost|how much|سعر|ثمن", message, re.I)
    if price_match:
        product = _find_product_price(db, message, lang)
        if product:
            name = product["name_fr"] if lang != "en" else product["name_en"]
            templates = {
                "fr": f"{name} coûte {product['price']} MAD.",
                "en": f"{name} costs {product['price']} MAD.",
                "ar": f"{name} — {product['price']} درهم.",
            }
            return templates[lang]

    for pattern, replies in _INTENTS:
        if replies is None:
            continue
        if pattern.search(message):
            return replies.get(lang, replies["fr"])

    return _FALLBACK_MSG[lang]


# ---------------------------------------------------------------- public ---

def get_reply(message, history):
    """Return (reply_text, source) where source is 'ai' or 'fallback'."""
    db = db_module.get_db()
    api_key = os.environ.get("ANTHROPIC_API_KEY")

    if api_key:
        try:
            system_prompt = _system_prompt(db)
            reply = _call_anthropic(api_key, system_prompt, history, message)
            return reply, "ai"
        except (urllib.error.URLError, ValueError, TimeoutError, json.JSONDecodeError):
            # Network hiccup, bad key, or unexpected response shape — degrade
            # gracefully instead of showing the visitor a broken chat.
            pass

    return fallback_reply(db, message), "fallback"
