function renderResult(r) {
  document.getElementById('analyze-loading').classList.remove('show');

  var userParty = r.user_party || 'Ügyfél';
  var enNev = r.en_nev || userParty;
  var masikNev = r.masik_nev || 'Másik fél';
  var riskScore = r.risk_score || 50;
  var scoreColor = riskScore >= 70 ? '#1A7A4A' : riskScore >= 40 ? '#C67C1A' : '#C0392B';
  var scoreBg = riskScore >= 70 ? '#EDF7F2' : riskScore >= 40 ? '#FDF5E6' : '#FDF0EE';
  var scoreLabel = riskScore >= 70 ? 'Alacsony kockázat' : riskScore >= 40 ? 'Közepes kockázat' : 'Magas kockázat';

  // ── FEJLÉC ────────────────────────────────────────────────────────────────
  document.getElementById('score-container').innerHTML =
    // Fejléc sáv
    '<div style="background:#0A0F1A;border-radius:8px;padding:1.5rem 2rem;margin-bottom:1.5rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem">' +
      '<div>' +
        '<div style="font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:4px">Elemzés szemszöge</div>' +
        '<div style="font-family:Cormorant,serif;font-size:22px;font-weight:600;color:#D4AF5A">⚖️ ' + userParty + '</div>' +
        '<div style="font-size:12px;color:rgba(255,255,255,0.4);margin-top:2px">' + (r.contract_type || 'Szerződés') + ' · vs. ' + masikNev + '</div>' +
      '</div>' +
      '<div style="text-align:right">' +
        '<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px">Kockázati pontszám</div>' +
        '<div style="font-family:Cormorant,serif;font-size:48px;font-weight:700;color:' + scoreColor + ';line-height:1">' + riskScore + '</div>' +
        '<div style="font-size:11px;color:' + scoreColor + ';font-weight:600">' + scoreLabel + '</div>' +
      '</div>' +
    '</div>' +

    // Összefoglaló box
    '<div style="background:' + scoreBg + ';border:1px solid ' + scoreColor + '33;border-radius:6px;padding:1.25rem 1.5rem;margin-bottom:1.5rem">' +
      '<div style="font-size:11px;font-weight:700;color:' + scoreColor + ';text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px">📋 Összefoglalás</div>' +
      '<div style="font-size:14px;color:#2C3444;line-height:1.8;font-weight:300">' + (r.summary || '') + '</div>' +
    '</div>' +

    // Erőviszony
    (r.erőviszony ? renderEroviszony(r.erőviszony) : '') +

    // API költség
    (r._cost ? '<div style="padding:6px 12px;background:#F0F7FF;border:1px solid #A8C4E8;border-radius:4px;font-size:11px;color:#185FA5;text-align:center;margin-bottom:1rem">💰 API költség: ~' + r._cost.cost_huf + ' Ft ($' + r._cost.cost_usd + ') · ' + r._cost.input_tokens + ' input + ' + r._cost.output_tokens + ' output token</div>' : '') +

    // Mock jelzés
    (r._mock ? '<div style="padding:8px 12px;background:#FFF8E8;border:1px solid #F0D9A8;border-radius:4px;font-size:11px;color:#B8912A;text-align:center;margin-bottom:1rem">⚠️ MOCK MÓD – Teszt adat, nem valódi elemzés</div>' : '');

  // ── KRITIKUS PONTOK ───────────────────────────────────────────────────────
  var kritikusHtml = '';
  if (r.kritikus_pontok && r.kritikus_pontok.length) {
    kritikusHtml = r.kritikus_pontok.map(function(item, idx) {
      var id = 'krit_' + idx;
      return '<div style="background:#FDF0EE;border:1px solid #F0C4BE;border-radius:6px;padding:1rem;margin-bottom:10px;cursor:pointer" onclick="toggleCard(\'' + id + '\')">' +
        '<div style="display:flex;align-items:flex-start;gap:8px;flex-wrap:wrap">' +
          '<div style="flex:1">' +
            '<div style="font-size:14px;font-weight:600;color:#0A0F1A;margin-bottom:2px">' + item.title + '</div>' +
            (item.ptk_ref ? '<div style="font-size:11px;color:#1A7A4A">📜 ' + item.ptk_ref + '</div>' : '') +
          '</div>' +
          '<span style="font-size:10px;font-weight:700;padding:3px 10px;border-radius:10px;background:#C0392B;color:white">KRITIKUS</span>' +
          '<span style="font-size:10px;color:#9AA3B0">▼</span>' +
        '</div>' +
        '<div id="' + id + '" style="display:none;margin-top:10px;padding-top:10px;border-top:1px solid #F0C4BE">' +
          '<div style="font-size:13px;color:#6B7587;line-height:1.7;margin-bottom:10px">' + (item.desc || '') + '</div>' +
          (item.fix ? '<div style="background:#EDF7F2;border:1px solid #A8DFC0;border-radius:4px;padding:10px">' +
            '<div style="font-size:10px;font-weight:700;color:#1A7A4A;text-transform:uppercase;margin-bottom:5px">✓ Javasolt javítás</div>' +
            '<div style="font-size:13px;color:#0A0F1A;line-height:1.65">' + item.fix + '</div>' +
          '</div>' : '') +
        '</div>' +
      '</div>';
    }).join('');
  } else {
    kritikusHtml = '<div style="color:#1A7A4A;font-size:13px;padding:10px">✅ Nem azonosítottunk kritikus problémát!</div>';
  }
  document.getElementById('fixes-container').innerHTML = kritikusHtml;

  // ── TÁRGYALÁSI TIPPEK (regen-chips helyére) ───────────────────────────────
  var tippekHtml = '';
  if (r.tárgyalási_tippek && r.tárgyalási_tippek.length) {
    tippekHtml = r.tárgyalási_tippek.map(function(tip, i) {
      return '<div style="background:#EEF4FC;border:1px solid #A8C4E8;border-radius:4px;padding:10px 14px;margin-bottom:8px;font-size:13px;color:#1A4F8A;line-height:1.6">' +
        '<span style="font-weight:700;color:#185FA5">' + (i+1) + '.</span> ' + tip + '</div>';
    }).join('');
  } else {
    tippekHtml = '<div style="color:#9AA3B0;font-size:13px">–</div>';
  }
  document.getElementById('regen-chips').innerHTML = '';
  // Tárgyalási tippeket a regen panel elé rakjuk
  var regenPanel = document.querySelector('.regen-panel');
  if (regenPanel) {
    var tippDiv = document.createElement('div');
    tippDiv.className = 'card';
    tippDiv.style.marginBottom = '1.5rem';
    tippDiv.innerHTML = '<div class="card-label">💡 Tárgyalási tippek (' + userParty + ' számára)</div>' + tippekHtml;
    regenPanel.parentNode.insertBefore(tippDiv, regenPanel);
  }

  // ── KOCKÁZATOK (bal oldal) ─────────────────────────────────────────────────
  var risksHtml = '';
  // Javítható pontok
  if (r.javítható_pontok && r.javítható_pontok.length) {
    risksHtml += '<div style="margin-bottom:1rem">' +
      '<div style="font-size:11px;font-weight:700;color:#C67C1A;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px">🟡 Javítható pontok</div>' +
      r.javítható_pontok.map(function(item, idx) {
        var id = 'jav_' + idx;
        return '<div style="background:#FDF5E6;border:1px solid #F0D9A8;border-radius:4px;padding:9px 12px;margin-bottom:6px;cursor:pointer" onclick="toggleCard(\'' + id + '\')">' +
          '<div style="font-size:12px;font-weight:600;color:#C67C1A">' + item.title + (item.ptk_ref ? ' <span style="font-size:10px;color:#1A7A4A">📜' + item.ptk_ref + '</span>' : '') + ' <span style="color:#9AA3B0;font-size:10px">▼</span></div>' +
          '<div id="' + id + '" style="display:none;margin-top:6px;font-size:12px;color:#6B7587;line-height:1.6">' + (item.desc || '') + '</div>' +
        '</div>';
      }).join('') +
    '</div>';
  }
  // Erős pontok
  if (r.erős_pontok && r.erős_pontok.length) {
    risksHtml += '<div style="background:#EDF7F2;border:1px solid #A8DFC0;border-radius:5px;padding:1rem">' +
      '<div style="font-size:11px;font-weight:700;color:#1A7A4A;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px">✅ Erős pontok</div>' +
      r.erős_pontok.map(function(item) {
        return '<div style="font-size:12px;color:#2C3444;padding:5px 0;display:flex;gap:6px;line-height:1.5;border-bottom:1px solid rgba(168,223,192,0.3)">' +
          '<span style="color:#1A7A4A;flex-shrink:0">✓</span>' +
          '<div><strong>' + item.title + '</strong>' + (item.desc ? '<br><span style="color:#6B7587;font-size:11px">' + item.desc + '</span>' : '') + '</div>' +
        '</div>';
      }).join('') +
    '</div>';
  }
  document.getElementById('risks-container').innerHTML = risksHtml || '<div style="color:#9AA3B0;font-size:13px">–</div>';

  // ── HIÁNYZÓ KLAUZULÁK ─────────────────────────────────────────────────────
  var missingHtml = '';
  if (r.hiányzó_klauzulák && r.hiányzó_klauzulák.length) {
    missingHtml = r.hiányzó_klauzulák.map(function(item, idx) {
      var id = 'miss_' + idx;
      var fontC = item.fontosság === 'kötelező' ? '#C0392B' : item.fontosság === 'ajánlott' ? '#C67C1A' : '#185FA5';
      return '<div style="padding:8px 12px;border-left:3px solid ' + fontC + ';background:white;border-radius:0 4px 4px 0;margin-bottom:6px;border:1px solid #E8E3DA;cursor:pointer" onclick="toggleCard(\'' + id + '\')">' +
        '<div style="font-size:11px;font-weight:600;color:' + fontC + '">' + item.title + ' <span style="font-size:9px;font-weight:700;padding:2px 6px;border-radius:8px;background:' + fontC + '22">' + (item.fontosság || '') + '</span> <span style="color:#9AA3B0;font-size:10px">▼</span></div>' +
        '<div id="' + id + '" style="display:none;margin-top:6px;font-size:12px;color:#2C3444;line-height:1.6;font-style:italic">' + (item.javaslat || '') + '</div>' +
      '</div>';
    }).join('');
  } else {
    missingHtml = '<div style="color:#1A7A4A;font-size:13px">✅ Nem azonosítottunk hiányzó klauzulát.</div>';
  }
  document.getElementById('missing-container').innerHTML = missingHtml;

  // ── ALTERNATÍV SZÖVEGEK (pozitívumok helyén) ──────────────────────────────
  var altHtml = '';
  if (r.alternatív_szövegek && r.alternatív_szövegek.length) {
    altHtml = r.alternatív_szövegek.map(function(item, idx) {
      var id = 'alt_' + idx;
      return '<div style="background:#F0F7FF;border:1px solid #A8C4E8;border-radius:4px;padding:10px 12px;margin-bottom:8px;cursor:pointer" onclick="toggleCard(\'' + id + '\')">' +
        '<div style="font-size:12px;font-weight:600;color:#185FA5">📝 ' + item.cím + ' <span style="color:#9AA3B0;font-size:10px">▼ szöveg</span></div>' +
        '<div id="' + id + '" style="display:none;margin-top:8px;background:white;border:1px solid #A8C4E8;border-radius:4px;padding:10px;font-size:12px;color:#2C3444;line-height:1.7;font-style:italic">"' + (item.szöveg || '') + '"</div>' +
      '</div>';
    }).join('');
  } else {
    altHtml = '<div style="color:#9AA3B0;font-size:13px">–</div>';
  }
  document.getElementById('pos-container').innerHTML = altHtml;

  // ── PTK HIVATKOZÁSOK + ÖSSZEFOGLALÁS ──────────────────────────────────────
  var summaryHtml = '';
  // Ptk hivatkozások
  if (r.ptk_references && r.ptk_references.length) {
    summaryHtml += '<div style="background:#f0fff4;border:1px solid #a8dfc0;border-radius:5px;padding:1rem;margin-bottom:1rem">' +
      '<div style="font-size:11px;font-weight:700;color:#1A7A4A;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px">📜 Alkalmazott Ptk. §-ok</div>' +
      r.ptk_references.map(function(p) {
        return '<div style="font-size:12px;color:#2C3444;padding:3px 0"><strong>' + p.section + '</strong>' + (p.title ? ' – ' + p.title : '') + ' <span style="color:#9AA3B0;font-size:11px">(' + p.book + ')</span></div>';
      }).join('') +
    '</div>';
  }
  // Összefoglaló
  summaryHtml += '<div style="background:#FDF8EE;border:1px solid #F0D9A8;border-radius:5px;padding:1.25rem">' +
    '<div style="font-size:14px;color:#0A0F1A;line-height:1.8;font-weight:300">' + (r.summary || '') + '</div>' +
  '</div>';

  document.getElementById('summary-container').innerHTML = summaryHtml;

  // ── MEGJELENÍTÉS ──────────────────────────────────────────────────────────
  document.getElementById('analyze-results').classList.add('show');
  setTimeout(function() { document.getElementById('analyze-results').scrollIntoView({ behavior: 'smooth' }); }, 100);
}

// ── ERŐVISZONY WIDGET ─────────────────────────────────────────────────────────
function renderEroviszony(ev) {
  var enScore = ev.én_score || 50;
  var masikScore = ev.másik_score || 50;
  var enColor = enScore >= 60 ? '#1A7A4A' : enScore >= 40 ? '#C67C1A' : '#C0392B';
  var masikColor = masikScore >= 60 ? '#1A7A4A' : masikScore >= 40 ? '#C67C1A' : '#C0392B';
  return '<div style="background:white;border:1px solid #E8E3DA;border-radius:6px;padding:1.25rem;margin-bottom:1.5rem">' +
    '<div style="font-size:11px;font-weight:700;color:#9AA3B0;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px">⚖️ Erőviszony elemzés</div>' +
    '<div style="display:grid;grid-template-columns:1fr auto 1fr;gap:1rem;align-items:center;margin-bottom:12px">' +
      '<div style="text-align:center">' +
        '<div style="font-size:11px;font-weight:600;color:#185FA5;margin-bottom:4px">' + (ev.én_fél || 'Ön') + '</div>' +
        '<div style="font-family:Cormorant,serif;font-size:36px;font-weight:700;color:' + enColor + ';line-height:1">' + enScore + '</div>' +
        '<div style="font-size:10px;color:#9AA3B0">/100 pont</div>' +
      '</div>' +
      '<div style="font-size:20px;color:#9AA3B0">VS</div>' +
      '<div style="text-align:center">' +
        '<div style="font-size:11px;font-weight:600;color:#C67C1A;margin-bottom:4px">' + (ev.másik_fél || 'Másik fél') + '</div>' +
        '<div style="font-family:Cormorant,serif;font-size:36px;font-weight:700;color:' + masikColor + ';line-height:1">' + masikScore + '</div>' +
        '<div style="font-size:10px;color:#9AA3B0">/100 pont</div>' +
      '</div>' +
    '</div>' +
    '<div style="background:#FDF8EE;border-radius:4px;padding:8px 12px;font-size:12px;color:#6B7587;line-height:1.6">' + (ev.összefoglalás || '') + '</div>' +
  '</div>';
}

// ── TOGGLE HELPER ─────────────────────────────────────────────────────────────
function toggleCard(id) {
  var el = document.getElementById(id);
  if (el) el.style.display = el.style.display === 'block' ? 'none' : 'block';
}
