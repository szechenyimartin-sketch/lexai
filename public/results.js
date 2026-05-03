function renderResult(r){
  document.getElementById('analyze-loading').classList.remove('show');
  var fel1=r.fel1_score||50,fel2=r.fel2_score||50;
  var fel1Name=r.fel1_name||'1. Fél',fel2Name=r.fel2_name||'2. Fél';
  var perFel1=r.per_esely_fel1||Math.round(fel1/(fel1+fel2)*100);
  var perFel2=r.per_esely_fel2||100-perFel1;
  var merleg=r.merleg||'kiegyensulyozott';
  var merlegC=merleg==='fel1_eros'?'#185FA5':merleg==='fel2_eros'?'#C67C1A':'#1A7A4A';
  var merlegT=merleg==='fel1_eros'?'⚖ '+fel1Name+' erősebb pozícióban':merleg==='fel2_eros'?'⚖ '+fel2Name+' erősebb pozícióban':'⚖ Kiegyensúlyozott szerződés';

  // ── FELSŐ PANEL ──────────────────────────────────────────────
  document.getElementById('score-container').innerHTML=
    '<div style="background:white;border:1px solid #E8E3DA;border-radius:6px;padding:2rem;margin-bottom:1.5rem">'+
    '<div style="text-align:center;margin-bottom:1.5rem">'+
    '<div style="font-size:11px;font-weight:700;color:'+merlegC+';letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px">'+merlegT+'</div>'+
    '<div style="font-family:Cormorant,serif;font-size:22px;font-weight:600;color:#0A0F1A;line-height:1.3">'+r.verdict+'</div>'+
    '</div>'+
    '<div style="margin-bottom:1.5rem">'+
    '<div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:8px">'+
    '<div style="text-align:left"><div style="font-size:11px;font-weight:700;color:#185FA5">'+fel1Name+'</div><div style="font-size:28px;font-weight:700;color:#185FA5;font-family:Cormorant,serif">'+fel1+'<span style="font-size:14px">/100</span></div></div>'+
    '<div style="font-size:12px;color:#9AA3B0;text-align:center">védettségi szint</div>'+
    '<div style="text-align:right"><div style="font-size:11px;font-weight:700;color:#C67C1A">'+fel2Name+'</div><div style="font-size:28px;font-weight:700;color:#C67C1A;font-family:Cormorant,serif">'+fel2+'<span style="font-size:14px">/100</span></div></div>'+
    '</div>'+
    '<div style="height:16px;background:#FDF5E6;border-radius:10px;overflow:hidden;border:1px solid #F0D9A8">'+
    '<div style="height:100%;width:'+fel1+'%;background:#185FA5;border-radius:10px"></div>'+
    '</div>'+
    '</div>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem">'+
    '<div style="background:#EEF4FC;border:1px solid #A8C4E8;border-radius:5px;padding:1.25rem;text-align:center">'+
    '<div style="font-size:10px;font-weight:700;color:#185FA5;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px">Védettségi arány – '+fel1Name+'</div>'+
    '<div style="font-size:42px;font-weight:700;color:#185FA5;font-family:Cormorant,serif;line-height:1">'+perFel1+'%</div>'+
    '<div style="font-size:11px;color:#6B7587;margin-top:4px">szerződéses védettség</div>'+
    '</div>'+
    '<div style="background:#FDF5E6;border:1px solid #F0D9A8;border-radius:5px;padding:1.25rem;text-align:center">'+
    '<div style="font-size:10px;font-weight:700;color:#C67C1A;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px">Védettségi arány – '+fel2Name+'</div>'+
    '<div style="font-size:42px;font-weight:700;color:#C67C1A;font-family:Cormorant,serif;line-height:1">'+perFel2+'%</div>'+
    '<div style="font-size:11px;color:#6B7587;margin-top:4px">szerződéses védettség</div>'+
    '</div>'+
    '</div>'+
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem">'+
    '<div style="background:#EEF4FC;border:1px solid #A8C4E8;border-radius:5px;padding:1rem">'+
    '<div style="font-size:10px;font-weight:700;color:#185FA5;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px">Javaslatok – '+fel1Name+'</div>'+
    (r.fel1_javaslatok||[]).map(function(j,i){return '<div style="font-size:12px;color:#2C3444;padding:5px 0;border-bottom:1px solid rgba(168,196,232,0.3);line-height:1.55"><span style="color:#185FA5;font-weight:700">'+(i+1)+'.</span> '+j+'</div>';}).join('')+
    '</div>'+
    '<div style="background:#FDF5E6;border:1px solid #F0D9A8;border-radius:5px;padding:1rem">'+
    '<div style="font-size:10px;font-weight:700;color:#C67C1A;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px">Javaslatok – '+fel2Name+'</div>'+
    (r.fel2_javaslatok||[]).map(function(j,i){return '<div style="font-size:12px;color:#2C3444;padding:5px 0;border-bottom:1px solid rgba(240,217,168,0.4);line-height:1.55"><span style="color:#C67C1A;font-weight:700">'+(i+1)+'.</span> '+j+'</div>';}).join('')+
    '</div>'+
    '</div>'+
    (r.top_actions&&r.top_actions.length?
    '<div style="background:#FDF8EE;border:1px solid #F0D9A8;border-radius:5px;padding:1rem">'+
    '<div style="font-size:10px;font-weight:700;color:#B8912A;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px">Legsürgősebb teendők</div>'+
    r.top_actions.map(function(a,i){return '<div style="font-size:13px;color:#0A0F1A;padding:4px 0;display:flex;gap:8px;line-height:1.55"><span style="color:#B8912A;font-weight:700;flex-shrink:0">'+(i+1)+'.</span>'+a+'</div>';}).join('')+
    '</div>':'') +
    (r._mock?'<div style="margin-top:1rem;padding:8px 12px;background:#FFF8E8;border:1px solid #F0D9A8;border-radius:4px;font-size:11px;color:#B8912A;text-align:center">⚠️ MOCK MÓD – Ez teszt adat, nem valódi elemzés. API költség: 0 Ft</div>':'')+
    (r._cost?'<div style="margin-top:8px;padding:6px 12px;background:#F0F7FF;border:1px solid #A8C4E8;border-radius:4px;font-size:11px;color:#185FA5;text-align:center">💰 API költség: ~'+r._cost.cost_huf+' Ft ($'+r._cost.cost_usd+') · '+r._cost.input_tokens+' input + '+r._cost.output_tokens+' output token</div>':'')+
    '</div>';

  // ── KONKRÉT JAVÍTÁSI JAVASLATOK ──────────────────────────────
  var fixesHtml='';
  if(r.issues&&r.issues.length){
    fixesHtml=r.issues.map(function(issue){
      var sev=issue.severity||'figyelmeztetés';
      var cls=sev==='kritikus'?'critical':sev==='figyelmeztetés'?'warning':'info';
      var sevBg=sev==='kritikus'?'#C0392B':sev==='figyelmeztetés'?'#C67C1A':'#185FA5';
      var sevL=sev==='kritikus'?'KRITIKUS':sev==='figyelmeztetés'?'FIGYELMEZTETÉS':'INFO';
      var favC=issue.favors==='fel1'?'#185FA5':issue.favors==='fel2'?'#C67C1A':'#1A7A4A';
      var favL=issue.favors==='fel1'?'▶ '+fel1Name:issue.favors==='fel2'?'▶ '+fel2Name:'⚖ Mindkét fél';
      var hatas1=issue.impactA||issue.fel1_impact||'';
      var hatas2=issue.impactB||issue.fel2_impact||'';
      return '<div class="deep-issue '+cls+'" onclick="this.classList.toggle(\'open\')" style="cursor:pointer;margin-bottom:10px">'+
        '<div style="display:flex;align-items:flex-start;gap:8px;flex-wrap:wrap;margin-bottom:4px">'+
        '<div style="flex:1;min-width:180px">'+
        '<div style="font-size:14px;font-weight:600;color:#0A0F1A;margin-bottom:3px">'+issue.title+'</div>'+
        (issue.location?'<div style="font-size:11px;color:#9AA3B0">📍 '+issue.location+(issue.legal_ref?' · <em>'+issue.legal_ref+'</em>':'')+'</div>':'')+
        '</div>'+
        '<span style="font-size:10px;font-weight:700;padding:3px 9px;border-radius:10px;background:'+sevBg+';color:white;white-space:nowrap">'+sevL+'</span>'+
        '<span style="font-size:10px;font-weight:600;padding:3px 9px;border-radius:10px;color:'+favC+';white-space:nowrap;border:1px solid '+favC+'">'+favL+'</span>'+
        '<span style="font-size:10px;color:#9AA3B0">▼ részletek</span>'+
        '</div>'+
        '<div class="deep-issue-body">'+
        (issue.original_text?'<div style="font-size:12px;color:#C0392B;text-decoration:line-through;font-style:italic;background:#FDF0EE;padding:8px 10px;border-radius:3px;margin-bottom:10px;line-height:1.5;border:1px solid #F0C4BE">📄 Eredeti szöveg: '+issue.original_text+'</div>':'')+
        '<div style="font-size:13px;color:#6B7587;line-height:1.7;margin-bottom:12px;font-weight:300">'+issue.description+'</div>'+
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">'+
        '<div style="background:#EEF4FC;border-radius:4px;padding:10px;border:1px solid #A8C4E8">'+
        '<div style="font-size:10px;font-weight:700;color:#185FA5;margin-bottom:5px;text-transform:uppercase">'+fel1Name+' hatása</div>'+
        '<div style="font-size:12px;color:#2C3444;line-height:1.55">'+(hatas1||'–')+'</div>'+
        '</div>'+
        '<div style="background:#FDF5E6;border-radius:4px;padding:10px;border:1px solid #F0D9A8">'+
        '<div style="font-size:10px;font-weight:700;color:#C67C1A;margin-bottom:5px;text-transform:uppercase">'+fel2Name+' hatása</div>'+
        '<div style="font-size:12px;color:#2C3444;line-height:1.55">'+(hatas2||'–')+'</div>'+
        '</div>'+
        '</div>'+
        (issue.fix_text?'<div style="background:#EDF7F2;border:1px solid #A8DFC0;border-radius:4px;padding:12px">'+
        '<div style="font-size:10px;font-weight:700;color:#1A7A4A;text-transform:uppercase;margin-bottom:6px">✓ Javasolt javítás</div>'+
        '<div style="font-size:13px;color:#0A0F1A;line-height:1.65">'+issue.fix_text+'</div>'+
        '</div>':'')+
        '</div>'+
        '</div>';
    }).join('');
  }
  document.getElementById('fixes-container').innerHTML=fixesHtml||'<div style="color:#9AA3B0;font-size:13px">Nem azonosítottunk javítandó pontot.</div>';
  document.getElementById('regen-chips').innerHTML='';

  // ── TÁRGYALÁSI SEGÉDLET (bal oldal – risks-container) ────────
  var tH='';
  var _cardId=0;
  function _mkCard(bg,border,titleC,title,desc,fix){
    _cardId++;
    var id='_card'+_cardId;
    return '<div style="padding:8px 12px;background:'+bg+';border:1px solid '+border+';border-radius:4px;margin-bottom:6px;cursor:pointer" onclick="var x=document.getElementById(\''+id+'\');x.style.display=x.style.display===\'block\'?\'none\':\'block\'">'+
      '<div style="font-size:12px;font-weight:600;color:'+titleC+';margin-bottom:3px">'+title+' <span style="font-size:10px;color:#9AA3B0">▼</span></div>'+
      '<div style="font-size:11px;color:#6B7587;line-height:1.5">'+desc.substring(0,80)+'...</div>'+
      '<div id="'+id+'" style="display:none;margin-top:8px;padding-top:8px;border-top:1px solid '+border+'">'+
      '<div style="font-size:11px;color:#2C3444;line-height:1.6;margin-bottom:6px">'+desc+'</div>'+
      (fix?'<div style="background:#EDF7F2;border:1px solid #A8DFC0;border-radius:3px;padding:8px;font-size:11px;color:#1A7A4A;line-height:1.5">✓ '+fix+'</div>':'')+
      '</div></div>';
  }
  if(r.issues&&r.issues.length){
    var kritikus=r.issues.filter(function(i){return i.severity==='kritikus';});
    var figyelmeztet=r.issues.filter(function(i){return i.severity==='figyelmeztetés';});
    tH+='<div style="margin-bottom:1rem">'+
      '<div style="font-size:11px;font-weight:700;color:#C0392B;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px">🔴 Ezeket mindenképpen újra kell tárgyalni</div>'+
      kritikus.map(function(iss){return _mkCard('#FDF0EE','#F0C4BE','#C0392B',iss.title,iss.description||'',iss.fix_text||'');}).join('')+
    '</div>';
    if(figyelmeztet.length){
      tH+='<div style="margin-bottom:1rem">'+
        '<div style="font-size:11px;font-weight:700;color:#C67C1A;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px">🟡 Ezeket érdemes módosítani</div>'+
        figyelmeztet.map(function(iss){return _mkCard('#FDF5E6','#F0D9A8','#C67C1A',iss.title,iss.description||'',iss.fix_text||'');}).join('')+
      '</div>';
    }
    tH+='<div style="background:#EDF7F2;border:1px solid #A8DFC0;border-radius:5px;padding:1rem;margin-bottom:1rem">'+
      '<div style="font-size:11px;font-weight:700;color:#1A7A4A;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px">✅ Amit el lehet fogadni</div>'+
      (r.positives||[]).map(function(p){return '<div style="font-size:12px;color:#2C3444;padding:4px 0;display:flex;gap:6px;line-height:1.5"><span style="color:#1A7A4A;flex-shrink:0">✓</span>'+(typeof p==='object'?p.title:p)+'</div>';}).join('')+
    '</div>';
    tH+='<div style="background:#F0F7FF;border:1px solid #A8C4E8;border-radius:5px;padding:1rem">'+
      '<div style="font-size:11px;font-weight:700;color:#185FA5;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px">📋 Aláírás előtt ellenőrizze</div>'+
      (r.top_actions||[]).map(function(a,i){return '<div style="font-size:12px;color:#2C3444;padding:4px 0;display:flex;gap:8px;align-items:flex-start;line-height:1.5"><span style="background:#185FA5;color:white;border-radius:50%;width:16px;height:16px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;flex-shrink:0;margin-top:1px">'+(i+1)+'</span>'+a+'</div>';}).join('')+
    '</div>';
  }
  document.getElementById('risks-container').innerHTML=tH||'<div style="color:#9AA3B0;font-size:13px">Nem azonosítottunk tárgyalási pontot.</div>';

  // ── HIÁNYOSSÁGOK → "AMIT BELE KELL TENNI" ───────────────────
  var mH='';
  if(r.issues&&r.issues.length){
    var fixable=r.issues.filter(function(i){return i.fix_text&&i.fix_text.length>10;});
    if(fixable.length){
      mH='<div style="font-size:11px;color:#9AA3B0;margin-bottom:10px">Ezeket a klauzulákat javasoljuk hozzáadni vagy módosítani:</div>';
      fixable.forEach(function(iss,idx){
        var mid='mcard'+idx;
        var sevC=iss.severity==='kritikus'?'#C0392B':'#C67C1A';
        mH+='<div style="padding:10px 12px;border-left:3px solid '+sevC+';background:white;border-radius:0 4px 4px 0;margin-bottom:8px;border:1px solid #E8E3DA;cursor:pointer" onclick="(function(){var x=document.getElementById(\''+mid+'\');x.style.display=x.style.display===\'block\'?\'none\':\'block\'})()">'+
          '<div style="font-size:11px;font-weight:600;color:'+sevC+';margin-bottom:2px">'+iss.title+' <span style="font-size:10px;color:#9AA3B0">▼</span></div>'+
          '<div style="font-size:11px;color:#6B7587;line-height:1.5">'+iss.fix_text.substring(0,80)+'...</div>'+
          '<div id="'+mid+'" style="display:none;margin-top:8px;padding-top:8px;border-top:1px solid #E8E3DA">'+
          '<div style="font-size:12px;color:#2C3444;line-height:1.6;font-style:italic;margin-bottom:6px">"'+iss.fix_text+'"</div>'+
          (iss.description?'<div style="font-size:11px;color:#6B7587;line-height:1.5;margin-top:4px">'+iss.description+'</div>':'')+
          '</div>'+
          '</div>';
      });
    } else {
      mH='<div style="color:#9AA3B0;font-size:13px">Lásd a részletes elemzésben fent.</div>';
    }
  }
  document.getElementById('missing-container').innerHTML=mH||'<div style="color:#9AA3B0;font-size:13px">Nem azonosítottunk hiányosságot.</div>';
  // ── POZITÍVUMOK ───────────────────────────────────────────────
  var posH='';
  (r.positives||[]).forEach(function(p){
    if(typeof p==='object'&&p.title){
      posH+='<div class="tag-pos"><strong>'+p.title+'</strong></div>';
    }else{
      posH+='<div class="tag-pos">'+p+'</div>';
    }
  });
  document.getElementById('pos-container').innerHTML=posH||'<div style="color:#9AA3B0;font-size:13px">–</div>';

  // ── ÖSSZEFOGLALÁS – kétoszlopos ───────────────────────────────
  // Fel1 hátrányos: ahol favors=fel2 (tehát a másik fél javára szól)
  var fel1Negativ=r.issues?r.issues.filter(function(i){return i.favors==='fel2';}):[]; 
  // Fel2 hátrányos: ahol favors=fel1
  var fel2Negativ=r.issues?r.issues.filter(function(i){return i.favors==='fel1';}):[]; 
  // Mindkét félre hátrányos
  var mindketto=r.issues?r.issues.filter(function(i){return i.favors==='mindketto'||i.favors==='mindkét fél';}):[]; 
  
  function makeSumCards(issues, prefix){
    if(!issues.length) return '<div style="font-size:11px;color:#1A7A4A">✓ Nem azonosítottunk hátrányos pontot</div>';
    return issues.map(function(iss,idx){
      var cid=prefix+'_'+idx;
      var sc=iss.severity==='kritikus'?'#C0392B':'#C67C1A';
      return '<div style="padding:5px 0 5px 8px;border-left:2px solid '+sc+';margin-bottom:5px;cursor:pointer" onclick="(function(){var x=document.getElementById(\''+cid+'\');x.style.display=x.style.display===\'block\'?\'none\':\'block\'})()">'+
        '<div style="font-size:11px;color:'+sc+';font-weight:600">'+iss.title+' <span style="color:#9AA3B0;font-size:10px;font-weight:400">▼</span></div>'+
        '<div id="'+cid+'" style="display:none;margin-top:4px">'+
        '<div style="font-size:11px;color:#6B7587;line-height:1.5;margin-bottom:4px">'+(iss.description||'')+'...</div>'+
        (iss.fix_text?'<div style="font-size:11px;color:#1A7A4A;font-style:italic">✓ '+iss.fix_text+'...</div>':'')+
        '</div></div>';
    }).join('');
  }

  document.getElementById('summary-container').innerHTML=
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">'+
    '<div style="background:#EEF4FC;border:1px solid #A8C4E8;border-radius:5px;padding:1rem">'+
    '<div style="font-size:11px;font-weight:700;color:#185FA5;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px">'+fel1Name+' helyzete</div>'+
    '<div style="font-size:13px;color:#2C3444;margin-bottom:10px"><span style="font-weight:600">Védettség:</span> '+fel1+'/100 ('+perFel1+'%)</div>'+
    (fel2Negativ.length?'<div style="font-size:11px;font-weight:700;color:#C0392B;margin-bottom:6px">⚠ Hátrányos pontok ('+fel2Negativ.length+'):</div>'+makeSumCards(fel2Negativ,'f1n'):'<div style="font-size:11px;color:#1A7A4A">✓ Nincsenek hátrányos pontok</div>')+
    (mindketto.length?'<div style="font-size:11px;font-weight:700;color:#C67C1A;margin-top:8px;margin-bottom:6px">⚡ Mindkét felet érintő ('+mindketto.length+'):</div>'+makeSumCards(mindketto,'f1m'):'')+
    '</div>'+
    '<div style="background:#FDF5E6;border:1px solid #F0D9A8;border-radius:5px;padding:1rem">'+
    '<div style="font-size:11px;font-weight:700;color:#C67C1A;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px">'+fel2Name+' helyzete</div>'+
    '<div style="font-size:13px;color:#2C3444;margin-bottom:10px"><span style="font-weight:600">Védettség:</span> '+fel2+'/100 ('+perFel2+'%)</div>'+
    (fel1Negativ.length?'<div style="font-size:11px;font-weight:700;color:#C0392B;margin-bottom:6px">⚠ Hátrányos pontok ('+fel1Negativ.length+'):</div>'+makeSumCards(fel1Negativ,'f2n'):'<div style="font-size:11px;color:#1A7A4A">✓ Nincsenek hátrányos pontok</div>')+
    (mindketto.length?'<div style="font-size:11px;font-weight:700;color:#C67C1A;margin-top:8px;margin-bottom:6px">⚡ Mindkét felet érintő ('+mindketto.length+'):</div>'+makeSumCards(mindketto,'f2m'):'')+
    '</div>'+
    '</div>'+
    '<div style="background:#FDF8EE;border:1px solid #F0D9A8;border-radius:5px;padding:1.25rem">'+
    (r._pages?'<div style="font-size:11px;color:#9AA3B0;margin-bottom:8px">~'+r._pages+' oldal · '+r._sections+' részben elemezve</div>':'')+
    '<div style="font-size:14px;color:#0A0F1A;line-height:1.8;font-weight:300">'+r.summary+'</div>'+
    '</div>';

  document.getElementById('analyze-results').classList.add('show');
  setTimeout(function(){document.getElementById('analyze-results').scrollIntoView({behavior:'smooth'});},100);
}
