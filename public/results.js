function renderResult(r){
  document.getElementById('analyze-loading').classList.remove('show');
  var fel1=r.fel1_score||50,fel2=r.fel2_score||50;
  var fel1Name=r.fel1_name||'1. Fél',fel2Name=r.fel2_name||'2. Fél';
  var perFel1=r.per_esely_fel1||Math.round(fel1/(fel1+fel2)*100);
  var perFel2=r.per_esely_fel2||100-perFel1;
  var merleg=r.merleg||'kiegyensulyozott';
  var merlegC=merleg==='fel1_eros'?'#185FA5':merleg==='fel2_eros'?'#C67C1A':'#1A7A4A';
  var merlegT=merleg==='fel1_eros'?'⚖ '+fel1Name+' erősebb pozícióban':merleg==='fel2_eros'?'⚖ '+fel2Name+' erősebb pozícióban':'⚖ Kiegyensúlyozott szerződés';

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

  var fixesHtml='';
  if(r.issues&&r.issues.length){
    fixesHtml=r.issues.map(function(issue){
      var sev=issue.severity||'figyelmeztetés';
      var cls=sev==='kritikus'?'critical':sev==='figyelmeztetés'?'warning':'info';
      var sevBg=sev==='kritikus'?'#C0392B':sev==='figyelmeztetés'?'#C67C1A':'#185FA5';
      var sevL=sev==='kritikus'?'KRITIKUS':sev==='figyelmeztetés'?'FIGYELMEZTETÉS':'INFO';
      var favC=issue.favors==='fel1'?'#185FA5':issue.favors==='fel2'?'#C67C1A':'#1A7A4A';
      var favL=issue.favors==='fel1'?'▶ '+fel1Name:issue.favors==='fel2'?'▶ '+fel2Name:'⚖ Mindkét fél';

      // Hatás mezők – támogatja mindkét elnevezést (impactA/impactB és fel1_impact/fel2_impact)
      var hatas1 = issue.impactA || issue.fel1_impact || '';
      var hatas2 = issue.impactB || issue.fel2_impact || '';

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
        '<div style="font-size:12px;color:#2C3444;line-height:1.55">'+(hatas1||'Nem meghatározható')+'</div>'+
        '</div>'+
        '<div style="background:#FDF5E6;border-radius:4px;padding:10px;border:1px solid #F0D9A8">'+
        '<div style="font-size:10px;font-weight:700;color:#C67C1A;margin-bottom:5px;text-transform:uppercase">'+fel2Name+' hatása</div>'+
        '<div style="font-size:12px;color:#2C3444;line-height:1.55">'+(hatas2||'Nem meghatározható')+'</div>'+
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
  var rH='';
  if(r.issues&&r.issues.length){
    var crit=r.issues.filter(function(i){return i.severity==='kritikus';});
    rH=(crit.length?'<div style="font-size:11px;font-weight:700;color:#C0392B;text-transform:uppercase;margin-bottom:6px">Kritikus ('+crit.length+')</div>':'')+
      r.issues.slice(0,10).map(function(iss){
        var c=iss.severity==='kritikus'?'high':iss.severity==='figyelmeztetés'?'med':'low';
        var h1=iss.impactA||iss.fel1_impact||'';
        var h2=iss.impactB||iss.fel2_impact||'';
        return '<div class="risk-item '+c+'" style="cursor:pointer;flex-direction:column" onclick="var b=this.querySelector(\'.rx\');b.style.display=b.style.display===\'none\'?\'block\':\'none\'">'+
          '<div style="display:flex;gap:12px;align-items:flex-start;width:100%">'+
          '<div class="risk-bar"></div>'+
          '<div style="flex:1"><div class="risk-title">'+iss.title+'</div>'+
          (iss.location?'<div style="font-size:11px;color:#9AA3B0">📍 '+iss.location+'</div>':'')+
          '<div class="risk-desc">'+(iss.description||'').substring(0,120)+'...</div></div>'+
          '<span style="font-size:10px;color:#9AA3B0">▼</span></div>'+
          '<div class="rx" style="display:none;margin-top:10px;padding-top:10px;border-top:1px solid rgba(0,0,0,0.1);width:100%">'+
          '<div style="font-size:13px;color:#2C3444;line-height:1.6;margin-bottom:8px">'+(iss.description||'')+'</div>'+
          (h1||h2?'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">'+
          '<div style="background:#EEF4FC;border-radius:4px;padding:8px;border:1px solid #A8C4E8"><div style="font-size:10px;font-weight:700;color:#185FA5;margin-bottom:4px">'+fel1Name+' hatása</div><div style="font-size:12px;color:#2C3444">'+(h1||'–')+'</div></div>'+
          '<div style="background:#FDF5E6;border-radius:4px;padding:8px;border:1px solid #F0D9A8"><div style="font-size:10px;font-weight:700;color:#C67C1A;margin-bottom:4px">'+fel2Name+' hatása</div><div style="font-size:12px;color:#2C3444">'+(h2||'–')+'</div></div></div>':'')+
          (iss.fix_text?'<div style="background:#EDF7F2;border:1px solid #A8DFC0;border-radius:4px;padding:10px"><div style="font-size:10px;font-weight:700;color:#1A7A4A;margin-bottom:4px">✓ Javasolt javítás</div><div style="font-size:12px;color:#0A0F1A;line-height:1.6">'+iss.fix_text+'</div></div>':'')+
          '</div></div>';
      }).join('');
  }
  document.getElementById('risks-container').innerHTML=rH||'<div style="color:#9AA3B0;font-size:13px">Nem azonosítottunk kockázatot.</div>';
  document.getElementById('missing-container').innerHTML='<div style="color:#9AA3B0;font-size:13px">Lásd a részletes elemzésben fent.</div>';
  var posH='';
  (r.positives||[]).forEach(function(p){
    if(typeof p==='object'&&p.title){
      posH+='<div class="tag-pos" style="cursor:pointer" onclick="this.querySelector(\'.pd\').style.display=this.querySelector(\'.pd\').style.display===\'none\'?\'block\':\'none\'"><strong>'+p.title+'</strong><div class="pd" style="display:none;font-size:12px;margin-top:4px">'+p.description+'</div></div>';
    }else{
      posH+='<div class="tag-pos">'+p+'</div>';
    }
  });
  document.getElementById('pos-container').innerHTML=posH||'<div style="color:#9AA3B0;font-size:13px">–</div>';
  document.getElementById('summary-container').innerHTML=
    '<div class="summary-box">'+
    (r._pages?'<div style="font-size:11px;color:#9AA3B0;margin-bottom:8px">~'+r._pages+' oldal · '+r._sections+' részben elemezve</div>':'')+
    r.summary+'</div>';
  document.getElementById('analyze-results').classList.add('show');
  setTimeout(function(){document.getElementById('analyze-results').scrollIntoView({behavior:'smooth'});},100);
}
