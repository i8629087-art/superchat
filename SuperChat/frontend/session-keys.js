<script>
/* ===============================
   SESSION KEY LOGIN (REDESIGN)
   - Primary (MASTER) key: infinite lifetime, unlimited logins
   - One-time key: 10 minutes, 1 activation
   Works in Chrome + Android WebView.
================================ */

function normalizeKeyInput(v){
  return (v||'').toString().toUpperCase().replace(/[^A-Z0-9]/g,'').trim();
}

// Clipboard helper: Chrome + WebView friendly
async function copyTextUniversal(text){
  const t = (text||'').toString();
  if(!t) throw new Error('empty');
  // 1) modern clipboard
  try{
    if(navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext){
      await navigator.clipboard.writeText(t);
      return true;
    }
  }catch(e){}
  // 2) execCommand fallback
  try{
    const ta = document.createElement('textarea');
    ta.value = t;
    ta.setAttribute('readonly','');
    ta.style.position='fixed';
    ta.style.left='-9999px';
    ta.style.opacity='0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    if(ok) return true;
  }catch(e){}
  // 3) last resort: prompt/manual
  try{
    if(typeof setCustomModal === 'function'){
      setCustomModal({
        title: 'Скопируйте ключ',
        okText: 'Закрыть',
        html: `
          <div class="text-left">
            <div class="text-sm text-slate-400 mb-2">Автокопирование недоступно в этом браузере/WebView. Выделите и скопируйте вручную:</div>
            <input id="manualCopyKeyInput" class="input-field w-full font-mono" value="${t.replace(/"/g,'&quot;')}" readonly />
          </div>
        `
      });
      setTimeout(()=>{
        const i=document.getElementById('manualCopyKeyInput');
        if(i){ i.focus(); i.select(); try{i.setSelectionRange(0,i.value.length);}catch(e){} }
      }, 50);
      return false;
    }
  }catch(e){}
  window.prompt('Скопируйте ключ:', t);
  return false;
}

function toastSafe(msg){
  try{ if(typeof showToast==='function') showToast(msg); }catch(e){}
}

// --- Custom modal helpers (used by key login and copy fallbacks) ---
// Some builds were missing these functions which broke flows with "Модалка не инициализирована".
let __customModalCleanup = null;
function closeCustomModal(){
  const m = document.getElementById('custom-modal');
  if(!m) return;
  try{ if(typeof __customModalCleanup === 'function') __customModalCleanup(); }catch(e){}
  __customModalCleanup = null;
  m.classList.add('hidden');
}

function setCustomModal(opts){
  const m = document.getElementById('custom-modal');
  const titleEl = document.getElementById('modal-title');
  const msgEl = document.getElementById('modal-message');
  const okBtn = document.getElementById('modal-ok-button');
  const confirmWrap = document.getElementById('modal-confirm-buttons');
  const cancelBtn = document.getElementById('modal-cancel-button');
  const confirmBtn = document.getElementById('modal-confirm-button');
  if(!m || !titleEl || !msgEl || !okBtn || !confirmWrap || !cancelBtn || !confirmBtn){
    // fallback
    alert((opts && (opts.title || '')) + "\n" + (opts && (opts.message || '')));
    return;
  }

  const title = (opts && opts.title) ? String(opts.title) : '';
  const message = (opts && opts.message) ? String(opts.message) : '';
  const html = (opts && opts.html) ? String(opts.html) : '';
  const okText = (opts && opts.okText) ? String(opts.okText) : 'ОК';
  const cancelText = (opts && opts.cancelText) ? String(opts.cancelText) : 'Отмена';
  const confirmText = (opts && opts.confirmText) ? String(opts.confirmText) : 'Подтвердить';
  const mode = (opts && opts.mode) ? String(opts.mode) : 'ok'; // ok | confirm

  titleEl.textContent = title || 'Сообщение';
  if(html){
    msgEl.innerHTML = html;
  } else {
    msgEl.textContent = message || '';
  }

  okBtn.textContent = okText;
  cancelBtn.textContent = cancelText;
  confirmBtn.textContent = confirmText;

  // reset handlers
  if(typeof __customModalCleanup === 'function'){
    try{ __customModalCleanup(); }catch(e){}
  }

  const onOk = (opts && typeof opts.onOk === 'function') ? opts.onOk : null;
  const onCancel = (opts && typeof opts.onCancel === 'function') ? opts.onCancel : null;
  const onConfirm = (opts && typeof opts.onConfirm === 'function') ? opts.onConfirm : null;

  const escHandler = (e)=>{ if(e.key === 'Escape') closeCustomModal(); };
  document.addEventListener('keydown', escHandler);

  const backdropHandler = (e)=>{ if(e.target === m) closeCustomModal(); };
  m.addEventListener('click', backdropHandler);

  const okHandler = ()=>{
    try{ if(onOk) onOk(); }catch(e){}
    closeCustomModal();
  };
  const cancelHandler = ()=>{
    try{ if(onCancel) onCancel(); }catch(e){}
    closeCustomModal();
  };
  const confirmHandler = ()=>{
    try{ if(onConfirm) onConfirm(); }catch(e){}
    closeCustomModal();
  };

  okBtn.onclick = okHandler;
  cancelBtn.onclick = cancelHandler;
  confirmBtn.onclick = confirmHandler;

  if(mode === 'confirm'){
    okBtn.classList.add('hidden');
    confirmWrap.classList.remove('hidden');
  } else {
    confirmWrap.classList.add('hidden');
    okBtn.classList.remove('hidden');
  }

  __customModalCleanup = ()=>{
    document.removeEventListener('keydown', escHandler);
    try{ m.removeEventListener('click', backdropHandler); }catch(e){}
    okBtn.onclick = null;
    cancelBtn.onclick = null;
    confirmBtn.onclick = null;
  };

  m.classList.remove('hidden');
}

async function openSessionKeyLoginModal(){
  if(typeof setCustomModal !== 'function'){
    alert('Модалка не инициализирована. Обновите страницу.');
    return;
  }
  setCustomModal({
    title: 'Вход по ключу',
    okText: 'Закрыть',
    html: `
      <div class="text-left">
        <div class="text-sm text-slate-400 mb-2">
          Введите <b>одноразовый</b> или <b>основной</b> ключ.
        </div>
        <input id="keyLoginInput" class="input-field w-full font-mono" placeholder="XXXX-XXXX-XXXX-..." autocomplete="one-time-code" />
        <button id="keyLoginBtn" class="primary-button w-full mt-3">Войти</button>
        <div class="text-xs text-slate-500 mt-2">Совет: вставляйте ключ как есть — дефисы не важны.</div>
        <div id="keyLoginErr" class="text-sm text-red-400 mt-2 hidden"></div>
      </div>
    `
  });

  setTimeout(() => {
    const btn = document.getElementById('keyLoginBtn');
    const input = document.getElementById('keyLoginInput');
    const err = document.getElementById('keyLoginErr');
    if(!btn || !input || !err) return;

    const doLogin = async () => {
      err.classList.add('hidden');
      const key = normalizeKeyInput(input.value);
      if(key.length < 16){
        err.textContent = 'Введите корректный ключ';
        err.classList.remove('hidden');
        return;
      }
      btn.disabled = true;
      const oldText = btn.textContent;
      btn.textContent = 'Входим...';
      try{
        const res = await apiRequest('key_login', { key });
        if(res && res.success){
          try{ if(typeof closeCustomModal==='function') closeCustomModal(); }catch(e){}
          location.reload();
          return;
        }
        err.textContent = (res && res.error) ? res.error : 'Не удалось войти';
        err.classList.remove('hidden');
      }catch(e){
        err.textContent = 'Ошибка сети';
        err.classList.remove('hidden');
      }finally{
        btn.disabled = false;
        btn.textContent = oldText;
      }
    };

    btn.addEventListener('click', doLogin);
    input.addEventListener('keydown', (e)=>{ if(e.key==='Enter') doLogin(); });
    input.focus();
  }, 60);
}

// ===== Settings UI (keys) =====
function setText(id, text){
  const el=document.getElementById(id);
  if(el) el.textContent = text;
}
function setHint(id, text){
  const el=document.getElementById(id);
  if(el) el.textContent = text;
}

async function loadPrimaryKeyState(){
  // Returns key only if just created; otherwise only "exists"
  try{
    const res = await apiRequest('primary_key_get', {});
    if(!res || !res.success){
      setHint('primaryKeyHint', (res && res.error) ? res.error : 'Не удалось получить статус ключа');
      return;
    }
    if(res.primary_key){
      setText('primaryKeyValue', res.primary_key);
      setHint('primaryKeyHint', 'Сохраните ключ. Повторно он не отображается. Если потеряете — сгенерируйте новый (старый станет недействителен).');
    }else{
      setText('primaryKeyValue', '—');
      setHint('primaryKeyHint', 'Основной ключ уже создан и по безопасности не показывается. Если вы его потеряли — нажмите «Сгенерировать» (заменит старый).');
    }
  }catch(e){
    setHint('primaryKeyHint','Ошибка сети');
  }
}

async function regeneratePrimaryKey(){
  try{
    const res = await apiRequest('primary_key_regenerate', {});
    if(res && res.success && res.primary_key){
      setText('primaryKeyValue', res.primary_key);
      setHint('primaryKeyHint', 'Новый основной ключ создан. Сохраните его: старый ключ больше не работает.');
      toastSafe('Новый ключ создан');
      return;
    }
    setHint('primaryKeyHint', (res && res.error) ? res.error : 'Не удалось сгенерировать ключ');
  }catch(e){
    setHint('primaryKeyHint','Ошибка сети');
  }
}

async function generateSessionKey(){
  try{
    const res = await apiRequest('session_key_create', {});
    if(res && res.success && res.session_key){
      setText('sessionKeyValue', res.session_key);
      setHint('sessionKeyHint', 'Ключ действителен 10 минут и сработает 1 раз. Введите его на новом устройстве в «Войти по ключу».');
      toastSafe('Ключ создан');
      return;
    }
    setHint('sessionKeyHint', (res && res.error) ? res.error : 'Не удалось сгенерировать ключ');
  }catch(e){
    setHint('sessionKeyHint','Ошибка сети');
  }
}

async function copyPrimaryKey(){
  const v = (document.getElementById('primaryKeyValue')?.textContent || '').trim();
  if(!v || v==='—'){ toastSafe('Нет ключа на экране'); return; }
  try{ await copyTextUniversal(v); toastSafe('Скопировано'); }catch(e){ toastSafe('Не удалось скопировать'); }
}

async function copySessionKey(){
  const v = (document.getElementById('sessionKeyValue')?.textContent || '').trim();
  if(!v || v==='—'){ toastSafe('Нет ключа'); return; }
  try{ await copyTextUniversal(v); toastSafe('Скопировано'); }catch(e){ toastSafe('Не удалось скопировать'); }
}

// Auto-load status when Settings page is opened.
// If the app has a navigation callback, try to hook; otherwise run once after DOM ready.
(function(){
  function boot(){
    // Only run if settings elements exist on this page
    if(document.getElementById('primaryKeyValue') || document.getElementById('sessionKeyValue')){
      loadPrimaryKeyState();
    }
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  }else{
    boot();
  }
})();

(function(){
  const style=document.createElement('style');
  style.textContent=`.chat-loading-indicator{display:flex;align-items:center;justify-content:center;padding:18px;color:#94a3b8;font-weight:700}.chat-loading-indicator .dot{width:8px;height:8px;border-radius:999px;background:#60a5fa;margin:0 4px;animation:chatDot 1s infinite ease-in-out}.chat-loading-indicator .dot:nth-child(2){animation-delay:.15s}.chat-loading-indicator .dot:nth-child(3){animation-delay:.3s}@keyframes chatDot{0%,80%,100%{opacity:.35;transform:translateY(0)}40%{opacity:1;transform:translateY(-4px)}}.chat-gif-suggestion{margin:14px auto;max-width:220px;border:1px solid rgba(255,255,255,.08);background:linear-gradient(180deg,#111827,#0f172a);border-radius:20px;padding:12px;cursor:pointer;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.22)}.chat-gif-suggestion img{width:100%;height:140px;object-fit:cover;border-radius:14px;display:block;margin-bottom:8px}`;
  document.head.appendChild(style);
  const demoGif='https://media.tenor.com/ay-Yz2bnyHAAAAAC/hello-hi.gif';
  function ensureLoading(){ const list=document.getElementById('message-list'); if(!list) return; list.innerHTML='<div class="chat-loading-indicator"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>'; }
  async function sendGifCard(){ try{ if(typeof window.sendGifToChat==='function') return window.sendGifToChat(demoGif); if(typeof window.importAndSendGif==='function') return window.importAndSendGif(demoGif); }catch(e){} }
  function updateEmptyChatSuggestion(messages){ const list=document.getElementById('message-list'); if(!list) return; if(!Array.isArray(messages) || messages.length!==0) return; if(list.querySelector('.chat-gif-suggestion')) return; list.innerHTML='<div class="chat-gif-suggestion" id="chat-empty-gif"><img src="'+demoGif+'" alt="GIF"><div>Отправить GIF</div></div>'; const card=document.getElementById('chat-empty-gif'); if(card) card.onclick=()=>sendGifCard(); }
  const oldFetch=window.fetchMessages;
  if(typeof oldFetch==='function'){
    window.fetchMessages=async function(chatId, shouldScroll=false, options={}){ ensureLoading(); const res=await window.apiRequest('get_messages',{chat_id:chatId},false,{silent:!!(options&&options.silent)}); const list=document.getElementById('message-list'); if(res&&res.success&&list){ const raw=Array.isArray(res.messages)?res.messages.slice():[]; const msgs=(typeof window.getFilteredThreadMessages==='function')?window.getFilteredThreadMessages(raw.slice()):raw.slice(); if(msgs.length===0){ updateEmptyChatSuggestion(msgs); list.dataset.lastSignature='empty_'+String(chatId||''); return res; } } return oldFetch.call(this,chatId,shouldScroll,Object.assign({},options,{force:true})); };
  }
  function normAdminState(user){ return { blocked:!!user.is_blocked, frozen:!!user.is_frozen }; }
  window.openAdminRestrictionModal=function(userId, kind){
    const user=(window.adminPanelData?.users||[]).find(u=>String(u.id)===String(userId)); if(!user) return;
    const isBan=kind==='ban'; const title=isBan?(user.is_blocked?'Разблокировать пользователя':'Заблокировать пользователя'):(user.is_frozen?'Разморозить аккаунт':'Заморозить аккаунт');
    const html=`<div class="space-y-3 text-left"><label class="block">Причина<textarea id="adm-r-reason" class="input-field mt-2" rows="3" placeholder="Укажите причину">${isBan?'Нарушение правил':'Заморозка аккаунта'}</textarea></label><label class="block"><span class="text-sm text-slate-300">Срок в днях</span><input id="adm-r-days" type="number" min="1" max="3650" value="7" class="input-field mt-2"></label><label class="flex items-center gap-2 text-sm text-slate-300"><input id="adm-r-perm" type="checkbox"> Навсегда</label>${isBan?`<label class="flex items-center gap-2 text-sm text-slate-300"><input id="adm-r-ip" type="checkbox"> Блокировать IP</label><label class="flex items-center gap-2 text-sm text-slate-300"><input id="adm-r-device" type="checkbox"> Блокировать устройство</label>`:''}</div>`;
    if(window.setCustomModal){ setCustomModal({title, html, okText:(isBan?(user.is_blocked?'Разблокировать':'Заблокировать'):(user.is_frozen?'Разморозить':'Заморозить')), onOk:()=>window.adminAction(userId,isBan?'toggle_ban':'toggle_freeze',{reason:document.getElementById('adm-r-reason')?.value||'',days:parseInt(document.getElementById('adm-r-days')?.value||'7',10),permanent:document.getElementById('adm-r-perm')?.checked?1:0,ban_ip:document.getElementById('adm-r-ip')?.checked?1:0,ban_device:document.getElementById('adm-r-device')?.checked?1:0})}); return; }
    if(window.showModal) showModal(title, html, true, ()=>window.adminAction(userId,isBan?'toggle_ban':'toggle_freeze',{reason:document.getElementById('adm-r-reason')?.value||'',days:parseInt(document.getElementById('adm-r-days')?.value||'7',10),permanent:document.getElementById('adm-r-perm')?.checked?1:0,ban_ip:document.getElementById('adm-r-ip')?.checked?1:0,ban_device:document.getElementById('adm-r-device')?.checked?1:0}));
  };
  const oldSelect=window.selectAdminUser;
  if(typeof oldSelect==='function'){
    window.selectAdminUser=function(userId){ oldSelect(userId); setTimeout(()=>{ const user=(window.adminPanelData?.users||[]).find(u=>String(u.id)===String(userId)); const box=document.querySelector('#custom-modal .ap25-actions, #custom-modal .ap3-actions'); if(!user||!box) return; box.querySelectorAll('.hotfix-banfreeze').forEach(n=>n.remove()); const banBtn=document.createElement('button'); banBtn.type='button'; banBtn.className='secondary-button text-xs px-3 py-2 hotfix-banfreeze'; banBtn.textContent=user.is_blocked?'Разблокировать':'Заблокировать'; banBtn.onclick=()=>window.openAdminRestrictionModal(user.id,'ban'); const frBtn=document.createElement('button'); frBtn.type='button'; frBtn.className='secondary-button text-xs px-3 py-2 hotfix-banfreeze'; frBtn.textContent=user.is_frozen?'Разморозить':'Заморозить'; frBtn.onclick=()=>window.openAdminRestrictionModal(user.id,'freeze'); box.appendChild(banBtn); box.appendChild(frBtn); },60); };
  }
})();

</script>