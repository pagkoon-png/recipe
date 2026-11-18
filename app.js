const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const taglines=["레시피는 정답이 아니라, 내가 만드는 요리의 시작입니다.","오늘의 냉장고가 오늘의 레시피가 됩니다.","조금 바꿔도, 나만의 맛이 될 수 있어요.","재료가 달라지면 레시피도 달라져야 하니까.","남은 재료도 새로운 한 끼의 재료가 됩니다.","원래 레시피에 나만의 한 끗을 더해보세요.","바꾸고, 조정하고, 다시 맛보세요.","같은 레시피라도 오늘의 선택은 다를 수 있으니까."];
$('#tagline').textContent=taglines[Math.floor(Math.random()*taglines.length)];
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),2300)}
function navigate(page){$$('.page').forEach(p=>p.classList.toggle('active-page',p.id===page));$$('.nav-link').forEach(a=>a.classList.toggle('active',a.dataset.page===page));location.hash=page;window.scrollTo({top:0,behavior:'smooth'})}
$$('[data-page]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();navigate(a.dataset.page)}));$$('[data-go]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.go)));$('.brand').addEventListener('click',e=>{e.preventDefault();navigate('home')});
function addIngredient(name='',amount='',unit='g'){const row=document.createElement('div');row.className='ingredient-row';row.innerHTML=`<input class="ing-name" placeholder="재료명" aria-label="재료명"><input class="ing-amount" type="number" min="0" step="any" placeholder="양" aria-label="재료량"><input class="ing-unit" value="g" aria-label="단위"><button class="remove-row" aria-label="재료 삭제">×</button>`;row.querySelector('.ing-name').value=name;row.querySelector('.ing-amount').value=amount;row.querySelector('.ing-unit').value=unit;$('#ingredient-rows').append(row)}
$('#add-ingredient').onclick=()=>addIngredient();
function addSub(){const r=document.createElement('div');r.className='sub-row';r.innerHTML='<input class="sub-from" placeholder="기존 재료"><span>→</span><input class="sub-to" placeholder="대체 재료"><button class="remove-row" aria-label="대체 삭제">×</button>';$('#substitution-rows').append(r)}
$('#add-sub').onclick=addSub;
function addRatio(){const r=document.createElement('div');r.className='ratio-row';r.innerHTML='<select class="ratio-name"><option>적앙금</option><option>한천 분말</option><option>설탕</option><option>올리고당</option><option>물</option><option>기타 재료</option></select><span>→</span><input class="ratio-value" type="number" min="0" step="any" placeholder="변경량"><small>g</small><button class="remove-row" aria-label="변경 삭제">×</button>';$('#ratio-rows').append(r)}
$('#add-ratio').onclick=addRatio;
document.addEventListener('click',e=>{if(e.target.classList.contains('remove-row'))e.target.closest('.ingredient-row,.sub-row,.ratio-row')?.remove()});
$$('[data-ingredient]').forEach(b=>b.onclick=()=>{const t=$('#pantry'),v=b.dataset.ingredient;const parts=t.value.split(/[,，\n]/).map(x=>x.trim()).filter(Boolean);if(!parts.includes(v))parts.push(v);t.value=parts.join(', ')});
const recommendedRecipes=[
  {
    name:'김치볶음밥',icon:'🍳',items:['김치','밥','달걀','대파','양파'],time:'약 15분',
    desc:'김치와 밥을 볶아 간단하게 만드는 한 끼.',
    ingredients:[['김치','100 g'],['밥','1공기'],['달걀','1개'],['대파','약간'],['양파','1/4개']],
    steps:['팬에 식용유를 두르고 대파와 양파를 볶는다.','김치를 넣고 충분히 볶아 향을 낸다.','밥을 넣고 고르게 섞어 볶는다.','마지막에 달걀을 곁들이고 간을 맞춘다.']
  },
  {
    name:'두부 달걀부침',icon:'🥚',items:['두부','달걀','대파'],time:'약 15분',
    desc:'두부에 달걀물을 입혀 노릇하게 부쳐봐.',
    ingredients:[['두부','1/2모'],['달걀','2개'],['대파','약간'],['소금','약간']],
    steps:['두부의 물기를 닦고 먹기 좋은 크기로 자른다.','달걀을 풀어 소금과 대파를 섞는다.','두부에 달걀물을 입혀 중불에서 앞뒤로 노릇하게 굽는다.']
  },
  {
    name:'토마토 달걀볶음',icon:'🍅',items:['토마토','달걀','대파'],time:'약 10분',
    desc:'토마토의 산뜻함과 부드러운 달걀이 잘 어울려.',
    ingredients:[['토마토','2개'],['달걀','2개'],['대파','약간'],['소금','약간']],
    steps:['토마토를 먹기 좋은 크기로 자른다.','달걀을 풀어 먼저 살짝 볶아 덜어둔다.','대파와 토마토를 볶은 뒤 달걀을 다시 넣고 섞는다.']
  },
  {
    name:'양파 달걀덮밥',icon:'🍚',items:['양파','달걀','밥'],time:'약 15분',
    desc:'양파를 충분히 볶아 밥 위에 올리는 메뉴.',
    ingredients:[['양파','1/2개'],['달걀','2개'],['밥','1공기'],['간장','1큰술']],
    steps:['양파를 얇게 썰어 팬에서 충분히 볶는다.','간장과 물을 넣어 양파에 간을 한다.','달걀물을 넣고 반숙 정도로 익힌다.','밥 위에 올려 완성한다.']
  },
  {
    name:'두부 김치볶음',icon:'🥬',items:['두부','김치','대파'],time:'약 20분',
    desc:'볶은 김치와 따뜻한 두부를 곁들여.',
    ingredients:[['두부','1모'],['김치','150 g'],['대파','약간'],['설탕','1작은술']],
    steps:['두부를 데치거나 살짝 구워 따뜻하게 준비한다.','김치와 대파를 팬에 넣고 볶는다.','필요하면 설탕을 소량 넣어 신맛을 조절한다.','두부와 볶은 김치를 함께 담는다.']
  }
];

let selectedRecommendedRecipe=null;

function openRecommendedRecipe(recipe){
  selectedRecommendedRecipe=recipe;
  $('#recipe-modal-title').textContent=recipe.name;
  $('#recipe-modal-desc').textContent=`${recipe.desc} · ${recipe.time}`;
  $('#recipe-modal-ingredients').innerHTML=recipe.ingredients.map(([n,v])=>`<div class="recipe-ingredient-line"><span>${escapeHTML(n)}</span><b>${escapeHTML(v)}</b></div>`).join('');
  $('#recipe-modal-steps').innerHTML=recipe.steps.map(x=>`<li>${escapeHTML(x)}</li>`).join('');
  $('#recipe-modal').hidden=false;
  $('#recipe-modal').setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
}

function closeRecommendedRecipe(){
  $('#recipe-modal').hidden=true;
  $('#recipe-modal').setAttribute('aria-hidden','true');
  document.body.style.overflow='';
}

function recipeToText(recipe){
  return `${recipe.name}

재료
${recipe.ingredients.map(([n,v])=>`- ${n}: ${v}`).join('\n')}

조리 순서
${recipe.steps.map((x,i)=>`${i+1}. ${x}`).join('\n')}

※ RE:CIPE 추천 레시피`;
}

$('#find-recipes').onclick=()=>{
  const have=$('#pantry').value.split(/[,，\n]/).map(x=>x.trim().toLowerCase()).filter(Boolean);
  if(!have.length){toast('재료를 하나 이상 입력해줘.');return}
  const ranked=recommendedRecipes.map(r=>({
    ...r,
    matched:r.items.filter(x=>have.some(h=>h.includes(x)||x.includes(h))),
    missing:r.items.filter(x=>!have.some(h=>h.includes(x)||x.includes(h)))
  })).filter(r=>r.matched.length>=2).sort((a,b)=>b.matched.length-a.matched.length);

  const box=$('#recommend-results');
  if(!ranked.length){
    box.innerHTML='<div class="empty-state"><div class="empty-bowl">☁</div><strong>딱 맞는 예시 레시피를 찾지 못했어.</strong><span>재료를 더 입력하거나 다른 조합으로 시도해봐.</span></div>';
    return;
  }

  box.innerHTML=ranked.map((r,i)=>`<article class="recipe-result" data-recipe-index="${recommendedRecipes.indexOf(r)}" tabindex="0" role="button">
    <div class="recipe-icon">${r.icon}</div>
    <div>
      <h3>${r.name}</h3>
      <p>${r.desc}</p>
      <span class="match-label">일치 ${r.matched.length}개 · ${r.time} · ${r.missing.length?'부족: '+r.missing.join(', '):'주요 재료 보유'}</span>
    </div>
    <span class="recipe-open">레시피 보기 →</span>
  </article>`).join('');

  $$('#recommend-results .recipe-result').forEach(card=>{
    const recipe=recommendedRecipes[Number(card.dataset.recipeIndex)];
    card.addEventListener('click',()=>openRecommendedRecipe(recipe));
    card.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){e.preventDefault();openRecommendedRecipe(recipe)}
    });
  });
};

$('#copy-recommended-recipe').onclick=async()=>{
  if(!selectedRecommendedRecipe)return;
  const text=recipeToText(selectedRecommendedRecipe);
  try{
    await navigator.clipboard.writeText(text);
    toast('레시피를 클립보드에 복사했어.');
  }catch(e){
    const ta=document.createElement('textarea');
    ta.value=text;
    document.body.appendChild(ta);
    ta.select();
    try{document.execCommand('copy');toast('레시피를 복사했어.')}catch(_){toast('복사 권한을 사용할 수 없어.')}
    ta.remove();
  }
};

$('#move-recommended-recipe').onclick=()=>{
  if(!selectedRecommendedRecipe)return;
  const r=selectedRecommendedRecipe;
  $('#recipe-name').value=r.name;
  $('#ingredient-rows').innerHTML='';
  r.ingredients.forEach(([name,amount])=>{
    const m=String(amount).match(/^([\d.]+)\s*(.*)$/);
    addIngredient(name,m?m[1]:amount,m?m[2]:'');
  });
  $('#method').value=r.steps.map((x,i)=>`${i+1}. ${x}`).join('\n');
  closeRecommendedRecipe();
  navigate('variation');
  toast('레시피를 변형 화면으로 옮겼어.');
};

$$('[data-close-recipe]').forEach(el=>el.addEventListener('click',closeRecommendedRecipe));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#recipe-modal').hidden)closeRecommendedRecipe();});

$('#change-mode').onchange=()=>{const m=$('#change-mode').value;$('#substitution-area').hidden=m==='ratio';$('#ratio-area').hidden=m==='sub'};
$('#recipe-photo').onchange=e=>{const f=e.target.files[0];if(!f)return;if(!['image/jpeg','image/png','image/webp'].includes(f.type)){toast('JPG, PNG, WEBP 파일만 첨부할 수 있어.');e.target.value='';return}$('#photo-status').textContent=`첨부됨: ${f.name} (${Math.round(f.size/1024)}KB). 미리보기용 첨부이며 사진 속 문자를 자동으로 읽지는 않아.`};
function readIngredients(){return $$('.ingredient-row').map(r=>({name:r.querySelector('.ing-name').value.trim(),amount:Number(r.querySelector('.ing-amount').value),unit:r.querySelector('.ing-unit').value.trim()||'g'})).filter(x=>x.name&&Number.isFinite(x.amount))}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
let lastResult='';
$('#analyze').onclick=()=>{const original=readIngredients();if(!original.length){toast('재료와 사용량을 한 개 이상 입력해줘.');return}const mode=$('#change-mode').value;let changed=original.map(x=>({...x}));const substitutions=mode!=='ratio'?$$('.sub-row').map(r=>({from:r.querySelector('.sub-from').value.trim(),to:r.querySelector('.sub-to').value.trim()})).filter(x=>x.from&&x.to):[];const ratios=mode!=='sub'?$$('.ratio-row').map(r=>({name:r.querySelector('.ratio-name').value,value:Number(r.querySelector('.ratio-value').value)})).filter(x=>Number.isFinite(x.value)&&x.value>=0):[];const warnings=[];substitutions.forEach(s=>{const item=changed.find(x=>x.name===s.from);if(item){item.name=s.to;warnings.push(`${s.from}을(를) ${s.to}(으)로 대체했어. 두 재료의 기능과 사용량이 같다고 볼 수 없으므로 제품별 사용 조건을 확인해야 해.`)}else warnings.push(`입력한 기존 재료 '${s.from}'를 재료 목록에서 찾지 못해 대체를 적용하지 않았어.`)});ratios.forEach(r=>{const item=changed.find(x=>x.name===r.name);if(item){const old=item.amount;item.amount=r.value;warnings.push(`${r.name}: ${old}${item.unit} → ${r.value}${item.unit}로 변경했어.`)}else warnings.push(`${r.name}은(는) 기존 재료 목록에 없어 변경하지 않았어.`)});const goal=$('#goal').value.trim();const name=$('#recipe-name').value.trim()||'나의 레시피';const isAgar=original.some(x=>/한천/.test(x.name))&&substitutions.some(x=>/한천/.test(x.from)&&/젤라틴/.test(x.to));if(isAgar)warnings.push('한천과 젤라틴은 응고 원리와 사용 조건이 달라 1:1 중량 대체로 취급하면 안 돼. 젤라틴 제품의 권장 사용량과 용해·냉각 조건을 별도로 확인하고 소량 테스트해줘.');if(substitutions.some(x=>/버터/.test(x.from)&&/오일/.test(x.to)))warnings.push('버터는 수분과 고형 지방, 풍미를 함께 제공하지만 오일은 대부분 액상 지방이야. 반죽 구조와 수분 균형이 달라질 수 있어.');if(ratios.some(x=>/앙금/.test(x.name)&&x.value>0)){const before=original.find(x=>x.name===ratios.find(y=>y.name===x.name)?.name);if(before){const factor=ratios.find(x=>x.name===before.name).value/before.amount;warnings.push(`앙금 양 변화 배수는 ${factor.toFixed(2)}배야. 물·당류·응고제도 같은 비율로 늘리면 원하는 맛과 질감이 보장되는 것은 아니므로 각각의 기능을 보고 조정해야 해.`)}}if(!warnings.length)warnings.push('변경 조건이 입력되지 않았거나 적용 가능한 항목이 없어. 대체·변경 재료를 확인해줘.');const method=$('#method').value.trim();const methodLines=method?method.split(/\n|(?<=\.)\s+/).map(x=>x.trim()).filter(Boolean):['조리 순서가 입력되지 않았어. 기존 조리법을 추가해줘.'];const feasibility=isAgar?'낮음 · 조건 확인 필요':'보통 · 테스트 권장';const result={name,original,changed,warnings,methodLines,goal,substitutions,ratios,feasibility};$('#output-title').textContent=name+' — 변형 결과';$('#evaluation').innerHTML=`<div class="eval-card"><span>실제 조리 가능성</span><strong>${feasibility}</strong><small>입력 정보만으로 성공 여부를 확정할 수 없어.</small></div><div class="eval-card"><span>맛과 향의 변화</span><strong>목표 기반 예상</strong><small>${escapeHTML(goal||'변형 목적 미입력')}</small></div><div class="eval-card"><span>완성도 판단</span><strong>소량 테스트 필요</strong><small>관능 평가 및 실제 조리 검증 전에는 확정 불가.</small></div>`;const list=a=>a.map(x=>`<div class="ingredient-line"><span>${escapeHTML(x.name)}</span><b>${x.amount} ${escapeHTML(x.unit)}</b></div>`).join('');$('#original-list').innerHTML=list(original);$('#changed-list').innerHTML=changed.map(x=>{const old=original.find(o=>o.name===x.name);return `<div class="ingredient-line"><span>${escapeHTML(x.name)}</span><b class="changed-value">${x.amount} ${escapeHTML(x.unit)}</b></div>`}).join('');$('#method-result').innerHTML=`<ol>${methodLines.map(x=>`<li>${escapeHTML(x)}</li>`).join('')}</ol><p><b>변경 목적:</b> ${escapeHTML(goal||'미입력')}</p><p>위 조리 순서는 원문을 보존한 초안이야. 대체 재료에 맞춰 용해·가열·냉각 단계가 달라질 수 있어.</p>`;$('#notes-result').innerHTML=`<ul>${warnings.map(x=>`<li>${escapeHTML(x)}</li>`).join('')}</ul>`;$('#variation-output').hidden=false;lastResult=`${name} 변형 결과\n목적: ${goal}\n\n기존 재료:\n${original.map(x=>`${x.name}: ${x.amount}${x.unit}`).join('\n')}\n\n변형 재료:\n${changed.map(x=>`${x.name}: ${x.amount}${x.unit}`).join('\n')}\n\n조리 순서:\n${methodLines.join('\n')}\n\n주의 및 보정 메모:\n${warnings.map(x=>'• '+x).join('\n')}\n\n이 결과는 단순 배합 계산과 일반 참고 메모이며 실제 조리 검증 결과가 아닙니다.`;$('#variation-output').scrollIntoView({behavior:'smooth',block:'start'})};
$('#copy-result').onclick=async()=>{if(!lastResult)return;try{await navigator.clipboard.writeText(lastResult);toast('변형 결과를 복사했어.')}catch(e){toast('복사 권한을 사용할 수 없어. 브라우저 설정을 확인해줘.')}};
$('#print-result').onclick=()=>window.print();
if(location.hash&&['home','recommend','variation'].includes(location.hash.slice(1)))navigate(location.hash.slice(1));
