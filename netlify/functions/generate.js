const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = 'claude-sonnet-4-5';

function parseJSON(raw) {
  if (!raw) return {};
  let c = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  const start = c.indexOf('{');
  if (start < 0) return {};
  c = c.substring(start);
  try { return JSON.parse(c); } catch (e) { return {}; }
}

// Smart hints - típusonkénti kötelező kikötések
async function getSmartHints(type, favor) {
  const prompt = `Magyar ügyvéd vagy. Adj konkrét listát: egy "${type}" típusú szerződésbe mit KELL belerakni "${favor}" érdekeinek védelmére.

Válaszolj CSAK JSON-ban:
{"hints":[
  {"text":"kikötés neve és rövid leírása","importance":"must|rec|opt","suggested_text":"javasolt szerződéses szöveg"}
]}

Legalább 8-10 konkrét elemet adj, importance szerint rendezve (must először).`;

  const resp = await client.messages.create({
    model: MODEL, max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }]
  });
  return parseJSON(resp.content[0].text);
}

// Szerződés generálás
async function generateContract(params) {
  const { type, favor, party1, party2, amount, deadline, date, level, details, special } = params;

  const system = `Te egy tapasztalt magyar ügyvéd vagy, aki komplex, teljes körű szerződéseket készít.
FELADAT: Készíts ${level} ${type}t a PTK alapján.
NÉZŐPONT: Védd ${favor} érdekeit.

KÖTELEZŐ ELEMEK (mind szerepeljen, kidolgozva):
1. Fejléc – szerződés megnevezése, felek TELJES adatai (név, székhely, adószám, cégjegyzékszám)
2. Preambulum – háttér, célok
3. Fogalommeghatározások – kulcsfogalmak definíciói
4. Szerződés tárgya – részletes leírás
5. Ellenérték és fizetési feltételek – összeg, határidők, bankszámla, késedelmi következmények
6. Teljesítési feltételek és határidők – mérföldkövek, átadás-átvétel rendje
7. Felek kötelezettségei – külön-külön részletezve
8. Szavatosság és jótállás (PTK 6:159§, 6:171§)
9. Felelősség korlátozás (PTK 6:152§)
10. Kötbér – késedelmi és meghiúsulási kötbér (PTK 6:185§)
11. Késedelmi kamat (PTK 6:155§)
12. Titoktartás és adatvédelem (GDPR)
13. Versenytilalom (ha releváns)
14. Felmondás és elállás feltételei (PTK 6:212§) – részletesen
15. Vis maior
16. Jogviták rendezése – választottbíróság vagy rendes bíróság, illetékesség
17. Vegyes és záró rendelkezések – módosítás, értesítések, részleges érvénytelenség
18. Aláírási blokk – dátum, hely, mindkét fél

STÍLUS: Professzionális, jogilag precíz, PTK §-ra hivatkozó, minden záradék teljes és végrehajtható.
Csak a szerződés szövegét add vissza – fejléctől az aláírásig!`;

  const user = `Szerződés típusa: ${type}
1. Fél (Megbízó/Eladó/stb.): ${party1 || '1. Fél [név, székhely, adószám]'}
2. Fél (Vállalkozó/Vevő/stb.): ${party2 || '2. Fél [név, székhely, adószám]'}
Összeg/Ellenérték: ${amount || 'a felek megállapodása szerint'}
Határidő/Időtartam: ${deadline || 'a felek megállapodása szerint'}
Aláírás dátuma: ${date || new Date().toLocaleDateString('hu-HU')}
Részletesség: ${level}

A szerződés tárgya és főbb feltételek:
${details}

Különleges kikötések és speciális rendelkezések:
${special || 'A szerződés típusának megfelelő szokásos kikötéseket vedd bele!'}

FONTOS: Legyen TELJES és RÉSZLETES! Minden bekezdés kidolgozva, minden jogi klauzula benne!`;

  const resp = await client.messages.create({
    model: MODEL, max_tokens: 8000,
    messages: [{ role: 'user', content: user }],
    system: system
  });
  return resp.content[0].text;
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
    const body = JSON.parse(event.body || '{}');
    const { action } = body;

    if (!process.env.ANTHROPIC_API_KEY) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'API kulcs nincs beállítva' }) };
    }

    if (action === 'hints') {
      const hints = await getSmartHints(body.type, body.favor);
      return { statusCode: 200, headers, body: JSON.stringify(hints) };
    }

    if (action === 'generate') {
      const contract = await generateContract(body);
      return { statusCode: 200, headers, body: JSON.stringify({ contract }) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Ismeretlen action' }) };

  } catch (err) {
    console.error('Generate error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Szerverhiba: ' + err.message }) };
  }
};
