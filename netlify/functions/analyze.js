const Anthropic = require('@anthropic-ai/sdk');
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function parseJSON(raw) {
  if (!raw) return {};
  let c = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  const start = c.indexOf('{');
  if (start < 0) return {};
  c = c.substring(start);
  try { return JSON.parse(c); } catch(e) {
    try {
      c = c.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      let op=0, cl=0;
      for(const ch of c){ if(ch==='{')op++; if(ch==='}')cl++; }
      for(let i=0;i<op-cl;i++) c+='}';
      return JSON.parse(c);
    } catch(e2) { return {}; }
  }
}

function buildPerspective(p) {
  if(!p || p.includes('kiegyensuly')) return 'mindkét fél szempontjából egyensúlyosan';
  if(p.includes('ugyfel')) return 'az ügyfél / megbízó / vásárló érdekei szerint';
  return 'az ellenérdekű fél / szolgáltató / eladó érdekei szerint';
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  try {
    const { text, type, perspective } = JSON.parse(event.body || '{}');
    if (!text || text.length < 30) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Nincs szöveg' }) };
    if (!process.env.ANTHROPIC_API_KEY) return { statusCode: 500, headers, body: JSON.stringify({ error: 'API kulcs hiányzik' }) };

    const estPages = Math.max(1, Math.round(text.length / 1800));
    const perspNote = buildPerspective(perspective);

    // Max 14000 karakter küldünk - kb 8 oldal részletes elemzéshez elegendő
    // Nagy dokumentumnál az elejét + a végét vesszük
    let sendText = text;
    if (text.length > 14000) {
      const firstPart = text.substring(0, 9000);
      const lastPart = text.substring(text.length - 5000);
      sendText = firstPart + '\n\n[...dokumentum középső része...]\n\n' + lastPart;
    }

    const prompt = `Te egy tapasztalt magyar ügyvéd vagy. Végezz TELJES KÖRŰ JOGI ELEMZÉST.

ELEMZÉSI NÉZŐPONT: ${perspNote}
SZERZŐDÉS TÍPUSA: ${type || 'automatikus felismerés'}
BECSÜLT TERJEDELEM: ~${estPages} oldal

SZERZŐDÉS SZÖVEGE:
${sendText}

FELADATOD - minden pontot vizsgálj meg:
1. Felek adatai és azonosítása
2. Szerződés tárgya és ellenérték
3. Fizetési feltételek és határidők
4. Késedelmi kamat (PTK 6:155§)
5. Kötbér szabályozás (PTK 6:185§)
6. Felmondás és elállás (PTK 6:212§)
7. Felelősség korlátozás (PTK 6:152§)
8. Szavatosság és jótállás (PTK 6:159§)
9. Titoktartás és GDPR
10. Vitarendezés és illetékesség
11. Fejezetek közötti ellentmondások
12. Hiányzó kötelező elemek

FONTOS: Minden problémánál adj KONKRÉT, BEILLESZTHETŐ javítási szöveget magyarul!

Válaszolj KIZÁRÓLAG valid JSON-ban:
{
  "score": 65,
  "verdict": "1 mondatos összítélet",
  "perspective_note": "mit jelent ez ${perspNote} konkrétan",
  "recommendation": "aláírható-e így / mit kell tenni előtte",
  "risk_level": "magas|közepes|alacsony",
  "structure": {
    "type": "felismert típus",
    "parties": ["1. fél neve és szerepe", "2. fél neve és szerepe"],
    "subject": "szerződés tárgya",
    "red_flags": ["azonnali piros zászló 1", "piros zászló 2"]
  },
  "issues": [
    {
      "severity": "kritikus|figyelmeztetés|info",
      "title": "probléma neve",
      "location": "pl. 3. fejezet 2. pont",
      "original_text": "eredeti problémás szöveg (max 120 kar)",
      "description": "részletes magyarázat ${perspNote}",
      "legal_ref": "PTK §",
      "fix_text": "KONKRÉT beilleszthető javítási szöveg magyarul",
      "fix_reason": "miért ez a megoldás"
    }
  ],
  "missing": [
    {
      "item": "hiányzó elem",
      "importance": "kötelező|ajánlott|opcionális",
      "why": "miért fontos",
      "suggestion": "javasolt szöveg"
    }
  ],
  "positives": ["pozitívum 1", "pozitívum 2"],
  "summary": "3-4 mondatos összefoglalás ${perspNote}",
  "top_actions": [
    "1. LEGSÜRGŐSEBB: konkrét teendő",
    "2. FONTOS: konkrét teendő",
    "3. AJÁNLOTT: konkrét teendő"
  ]
}`;

    const resp = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }]
    });

    const raw = resp.content[0].text;
    const result = parseJSON(raw);

    if (!result.score) result.score = 50;
    if (!result.issues) result.issues = [];
    if (!result.missing) result.missing = [];
    if (!result.positives) result.positives = [];
    if (!result.top_actions) result.top_actions = [];
    if (!result.structure) result.structure = {};

    result._pages = estPages;

    return { statusCode: 200, headers, body: JSON.stringify(result) };

  } catch(err) {
    console.error('Analyze error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Szerverhiba: ' + err.message }) };
  }
};
