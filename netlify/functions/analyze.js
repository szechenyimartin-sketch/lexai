const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = 'claude-sonnet-4-5';

// ============================================================
// STEP 1: Struktúra felismerés
// ============================================================
async function detectStructure(text, type) {
  const prompt = `Te egy tapasztalt magyar ügyvéd vagy. Elemezd a szerződés struktúráját.

SZERZŐDÉS SZÖVEGE (első 3000 karakter):
${text.substring(0, 3000)}

Válaszolj CSAK valid JSON-ban:
{
  "type": "szerződés típusa",
  "parties": ["1. fél neve és szerepe", "2. fél neve és szerepe"],
  "subject": "szerződés tárgya 1-2 mondatban",
  "chapters": [
    {"title": "fejezet/pont neve", "start_hint": "első néhány szó", "key_issues": ["potenciális probléma"]}
  ],
  "total_estimate": "becsült oldalszám",
  "governing_law": "alkalmazandó jog (pl. PTK)",
  "red_flags": ["első ránézésre gyanús dolog"]
}`;

  const resp = await client.messages.create({
    model: MODEL, max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }]
  });
  return parseJSON(resp.content[0].text);
}

// ============================================================
// STEP 2: Párhuzamos mélyelemzés (max 3 rész egyszerre)
// ============================================================
async function analyzeSection(sectionText, sectionNum, totalSections, structure, perspective, pageFrom, pageTo) {
  const perspectiveNote = buildPerspectiveNote(perspective);

  const prompt = `Te egy tapasztalt magyar ügyvéd vagy. Ez a szerződés ${sectionNum}/${totalSections}. része (~${pageFrom}-${pageTo}. oldal).

SZERZŐDÉS ADATAI:
- Típus: ${structure.type || 'ismeretlen'}
- Felek: ${(structure.parties || []).join(' / ')}
- Tárgy: ${structure.subject || ''}
- Elemzési nézőpont: ${perspectiveNote}

ELEMZENDŐ SZÖVEGRÉSZ:
${sectionText}

Feladatod: RÉSZLETES jogi elemzés. Minden problémás pontot azonosíts:
- Pontos helymegjelöléssel (fejezet, bekezdés, pont)
- Eredeti problémás szöveg idézésével
- Konkrét, BEILLESZTHETŐ javítási szöveggel
- PTK paragrafus hivatkozással

Válaszolj CSAK valid JSON-ban:
{
  "score": 75,
  "issues": [
    {
      "severity": "kritikus|figyelmeztetés|info",
      "title": "probléma rövid neve",
      "location": "pl. 3. fejezet 2. pont",
      "original_text": "az eredeti problémás szöveg (max 150 karakter)",
      "description": "részletes magyarázat miért probléma, ${perspectiveNote} szempontjából",
      "legal_ref": "PTK §",
      "fix_text": "KONKRÉT beilleszthető javítási szöveg – amit szó szerint be lehet másolni",
      "fix_reason": "miért ez a megoldás"
    }
  ],
  "missing": [
    {
      "item": "hiányzó elem neve",
      "importance": "kötelező|ajánlott|opcionális",
      "why": "miért fontos",
      "suggestion": "javasolt beilleszthető szöveg"
    }
  ],
  "positives": ["pozitívum 1", "pozitívum 2"]
}`;

  const resp = await client.messages.create({
    model: MODEL, max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }]
  });
  return parseJSON(resp.content[0].text);
}

// ============================================================
// STEP 3: Keresztellenőrzés (ellentmondások fejezetek között)
// ============================================================
async function crossCheck(text, allIssues, structure) {
  const issuesSummary = allIssues.slice(0, 10).map(i => i.title).join(', ');

  const prompt = `Te egy tapasztalt magyar ügyvéd vagy. Ellenőrizd az alábbi szerződésben a FEJEZETEK KÖZÖTTI ELLENTMONDÁSOKAT és HIÁNYOSSÁGOKAT.

Szerződés típusa: ${structure.type || 'ismeretlen'}
Felek: ${(structure.parties || []).join(' / ')}
Már azonosított problémák: ${issuesSummary}

SZERZŐDÉS (első 6000 karakter):
${text.substring(0, 6000)}

Keress:
1. Ellentmondásokat fejezetek között (pl. egyik helyen 30 napos felmondás, másik helyen 60 napos)
2. Hiányzó kötelező elemeket (PTK szerint)
3. Belső következetlenségeket (felek neve, dátumok, összegek)
4. Joghézagokat (nem szabályozott fontos helyzeteket)

Válaszolj CSAK valid JSON-ban:
{
  "contradictions": [
    {
      "title": "ellentmondás neve",
      "location_a": "hol szerepel az egyik",
      "location_b": "hol szerepel a másik",
      "description": "mi az ellentmondás",
      "fix": "hogyan kell feloldani"
    }
  ],
  "mandatory_missing": [
    {
      "item": "hiányzó kötelező elem",
      "legal_ref": "PTK §",
      "fix": "javasolt szöveg"
    }
  ],
  "consistency_issues": ["következetlenség 1", "következetlenség 2"]
}`;

  const resp = await client.messages.create({
    model: MODEL, max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }]
  });
  return parseJSON(resp.content[0].text);
}

// ============================================================
// STEP 4: Ügyvédi összefoglaló
// ============================================================
async function buildSummary(structure, allIssues, crossCheckResult, perspective, estPages) {
  const critical = allIssues.filter(i => i.severity === 'kritikus');
  const warnings = allIssues.filter(i => i.severity === 'figyelmeztetés');
  const perspectiveNote = buildPerspectiveNote(perspective);

  const prompt = `Te egy tapasztalt magyar ügyvéd vagy. Készíts ÜGYVÉDI ÖSSZEFOGLALÓT.

Elemzett szerződés: ${structure.type || 'ismeretlen'}, ~${estPages} oldal
Nézőpont: ${perspectiveNote}
Kritikus problémák száma: ${critical.length}
Figyelmeztetések száma: ${warnings.length}
Keresztellenőrzési problémák: ${(crossCheckResult.contradictions || []).length} ellentmondás

Top kritikus problémák:
${critical.slice(0, 5).map(i => `- ${i.title}: ${i.description}`).join('\n')}

Kötelező hiányosságok:
${(crossCheckResult.mandatory_missing || []).map(m => `- ${m.item}`).join('\n')}

Válaszolj CSAK valid JSON-ban:
{
  "score": 65,
  "verdict": "1 mondatos összítélet a szerződés állapotáról",
  "perspective_note": "mit jelent ez ${perspectiveNote} szempontjából konkrétan",
  "summary": "4-5 mondatos ügyvédi összefoglaló közérthetően",
  "top_actions": [
    "1. LEGSÜRGŐSEBB: konkrét teendő szövegjavaslattal",
    "2. FONTOS: konkrét teendő",
    "3. AJÁNLOTT: konkrét teendő"
  ],
  "risk_level": "magas|közepes|alacsony",
  "recommendation": "aláírható-e így / mit kell még tenni előtte"
}`;

  const resp = await client.messages.create({
    model: MODEL, max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }]
  });
  return parseJSON(resp.content[0].text);
}

// ============================================================
// HELPERS
// ============================================================
function buildPerspectiveNote(perspective) {
  if (!perspective || perspective.includes('kiegyensuly')) return 'mindkét fél';
  if (perspective.includes('ugyfel')) return 'az ügyfél / megbízó / vásárló';
  return 'az ellenérdekű fél / szolgáltató / eladó';
}

function splitIntoSections(text, maxChunkSize = 12000) {
  if (text.length <= maxChunkSize) return [text];
  const paragraphs = text.split(/\n\n+/);
  const sections = [];
  let current = '';
  for (const para of paragraphs) {
    if ((current + para).length > maxChunkSize && current.length > 0) {
      sections.push(current.trim());
      current = para;
    } else {
      current += (current ? '\n\n' : '') + para;
    }
  }
  if (current.trim()) sections.push(current.trim());
  return sections.length ? sections : [text];
}

function dedup(arr, key) {
  const seen = {};
  return arr.filter(x => {
    const k = key ? (x[key] || '') : x;
    if (seen[k]) return false;
    seen[k] = true;
    return true;
  });
}

function parseJSON(raw) {
  if (!raw) return {};
  let c = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  const start = c.indexOf('{');
  if (start < 0) return {};
  c = c.substring(start);
  try { return JSON.parse(c); } catch (e) {
    // Javítás próbálkozás
    try {
      c = c.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
      let opens = 0, closes = 0;
      for (const ch of c) { if (ch === '{') opens++; if (ch === '}') closes++; }
      for (let i = 0; i < opens - closes; i++) c += '}';
      return JSON.parse(c);
    } catch (e2) { return {}; }
  }
}

// ============================================================
// MAIN HANDLER
// ============================================================
exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { text, type, perspective } = JSON.parse(event.body || '{}');

    if (!text || text.length < 30) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Nincs szöveg megadva' }) };
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'API kulcs nincs beállítva a szerveren' }) };
    }

    const estPages = Math.max(1, Math.round(text.length / 1800));

    // STEP 1: Struktúra
    const structure = await detectStructure(text, type);

    // STEP 2: Szekciók párhuzamos elemzése (max 3)
    const sections = splitIntoSections(text, 12000);
    const sectionsToAnalyze = sections.length <= 3
      ? sections
      : [sections[0], sections[Math.floor(sections.length / 2)], sections[sections.length - 1]];

    const sectionPromises = sectionsToAnalyze.map((section, idx) => {
      const pageFrom = Math.round(idx * (estPages / sectionsToAnalyze.length)) + 1;
      const pageTo = Math.round((idx + 1) * (estPages / sectionsToAnalyze.length));
      return analyzeSection(section, idx + 1, sectionsToAnalyze.length, structure, perspective, pageFrom, pageTo);
    });

    const sectionResults = await Promise.all(sectionPromises);

    // Összegyűjtés
    let allIssues = [];
    let allMissing = [];
    let allPositives = [];
    let scores = [];

    for (const r of sectionResults) {
      if (r.score) scores.push(r.score);
      if (r.issues) allIssues = allIssues.concat(r.issues);
      if (r.missing) allMissing = allMissing.concat(r.missing);
      if (r.positives) allPositives = allPositives.concat(r.positives);
    }

    // STEP 3: Keresztellenőrzés
    const crossCheckResult = await crossCheck(text, allIssues, structure);

    // Ellentmondások hozzáadása kritikus issueként
    if (crossCheckResult.contradictions) {
      for (const c of crossCheckResult.contradictions) {
        allIssues.push({
          severity: 'kritikus',
          title: 'Ellentmondás: ' + c.title,
          location: c.location_a + ' vs. ' + c.location_b,
          original_text: '',
          description: c.description,
          legal_ref: '',
          fix_text: c.fix,
          fix_reason: 'Belső ellentmondás feloldása'
        });
      }
    }

    if (crossCheckResult.mandatory_missing) {
      for (const m of crossCheckResult.mandatory_missing) {
        allMissing.push({
          item: m.item,
          importance: 'kötelező',
          why: m.legal_ref,
          suggestion: m.fix
        });
      }
    }

    // STEP 4: Összefoglaló
    const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 50;
    const summary = await buildSummary(structure, allIssues, crossCheckResult, perspective, estPages);

    // Végeredmény összerakása
    const result = {
      score: summary.score || avgScore,
      verdict: summary.verdict || 'Az elemzés elkészült.',
      perspective_note: summary.perspective_note || '',
      recommendation: summary.recommendation || '',
      risk_level: summary.risk_level || 'közepes',
      structure: {
        type: structure.type,
        parties: structure.parties,
        subject: structure.subject,
        red_flags: structure.red_flags
      },
      issues: dedup(allIssues, 'title').slice(0, 25),
      missing: dedup(allMissing, 'item').slice(0, 15),
      positives: allPositives.filter((v, i, a) => a.indexOf(v) === i).slice(0, 8),
      summary: summary.summary || 'Az elemzés elkészült.',
      top_actions: summary.top_actions || [],
      _pages: estPages,
      _sections_analyzed: sectionsToAnalyze.length,
      _contradictions: (crossCheckResult.contradictions || []).length
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };

  } catch (err) {
    console.error('Analyze error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Szerverhiba: ' + err.message })
    };
  }
};
