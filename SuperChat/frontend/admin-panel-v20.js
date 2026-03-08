<style id="admin-panel-overrides-v20">
body.admin-panel-open, html.admin-panel-open { overflow:auto !important; height:auto !important; }
#screen-container.admin-panel-free-scroll { position:relative !important; overflow-y:auto !important; overflow-x:hidden !important; height:auto !important; min-height:100dvh !important; -webkit-overflow-scrolling:touch; overscroll-behavior:auto; }
#screen-container.admin-panel-free-scroll > * { position:relative !important; height:auto !important; min-height:100dvh !important; overflow:visible !important; }
#admin_screen_content.admin-panel-v2-root { display:block !important; position:relative !important; inset:auto !important; width:100% !important; min-height:100dvh !important; height:auto !important; overflow:visible !important; transform:none !important; animation:none !important; }
#admin_panel_view.admin-v2-shell { display:block; width:100%; max-width:100%; min-height:100dvh; padding:12px; box-sizing:border-box; overflow:visible; }
#admin_panel_view.admin-v2-shell * { box-sizing:border-box; }
#admin_panel_view .admin-v2-header, #admin_panel_view .admin-v2-tabs, #admin_panel_view .admin-v2-body, #admin_panel_view .admin-v2-grid, #admin_panel_view .admin-v2-card, #admin_panel_view .admin-v2-list, #admin_panel_view .admin-v2-panel, #admin_panel_view .admin-v2-filters { position:static !important; overflow:visible !important; max-height:none !important; }
#admin_panel_view .admin-v2-header { display:flex; align-items:flex-start; gap:12px; flex-wrap:wrap; padding:16px; border-radius:24px; background:linear-gradient(180deg, rgba(17,24,39,.96), rgba(15,23,42,.92)); border:1px solid rgba(255,255,255,.08); box-shadow:0 18px 40px rgba(0,0,0,.22); margin-bottom:12px; }
#admin_panel_view .admin-v2-title { min-width:0; flex:1; }
#admin_panel_view .admin-v2-title h2 { margin:0; font-size:28px; line-height:1.1; font-weight:800; }
#admin_panel_view .admin-v2-title p { margin:6px 0 0; color:#94a3b8; font-size:14px; }
#admin_panel_view .admin-v2-back { display:inline-flex; align-items:center; gap:8px; }
#admin_panel_view .admin-v2-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; margin-bottom:12px; }
#admin_panel_view .admin-v2-stat { padding:16px; border-radius:22px; background:rgba(15,23,42,.92); border:1px solid rgba(255,255,255,.06); display:flex; align-items:center; gap:12px; min-width:0; }
#admin_panel_view .admin-v2-stat .value { font-size:26px; font-weight:800; color:#fff; }
#admin_panel_view .admin-v2-stat .label { font-size:12px; color:#94a3b8; margin-top:2px; }
#admin_panel_view .admin-v2-tabs { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px; }
#admin_panel_view .admin-v2-tab { display:inline-flex; align-items:center; gap:8px; padding:12px 14px; border-radius:16px; border:1px solid rgba(255,255,255,.08); background:rgba(15,23,42,.84); color:#e2e8f0; font-weight:700; }
#admin_panel_view .admin-v2-tab.is-active { background:linear-gradient(180deg, rgba(14,165,233,.24), rgba(59,130,246,.18)); border-color:rgba(56,189,248,.45); }
#admin_panel_view .admin-v2-body { display:block; }
#admin_panel_view .admin-v2-panel { padding-bottom:24px; }
#admin_panel_view .admin-v2-search { display:flex; align-items:center; gap:10px; padding:12px 14px; border-radius:18px; background:rgba(15,23,42,.92); border:1px solid rgba(255,255,255,.06); margin-bottom:12px; }
#admin_panel_view .admin-v2-search input { background:transparent; border:none; outline:none; color:#fff; width:100%; min-width:0; }
#admin_panel_view .admin-v2-list { display:flex; flex-direction:column; gap:10px; }
#admin_panel_view .admin-v2-card { width:100%; padding:14px; border-radius:20px; background:rgba(15,23,42,.92); border:1px solid rgba(255,255,255,.06); color:#fff; }
#admin_panel_view button.admin-v2-card { text-align:left; cursor:pointer; }
#admin_panel_view .admin-v2-row { display:flex; gap:12px; align-items:flex-start; min-width:0; }
#admin_panel_view .admin-v2-avatar { width:52px; height:52px; border-radius:50%; object-fit:cover; flex:0 0 auto; }
#admin_panel_view .admin-v2-meta { min-width:0; flex:1; }
#admin_panel_view .admin-v2-name { display:flex; align-items:center; gap:8px; flex-wrap:wrap; font-weight:800; }
#admin_panel_view .admin-v2-sub { font-size:13px; color:#94a3b8; margin-top:2px; word-break:break-word; }
#admin_panel_view .admin-v2-presence { font-size:12px; margin-top:4px; }
#admin_panel_view .admin-v2-chips { display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
#admin_panel_view .admin-v2-chip { display:inline-flex; align-items:center; gap:6px; padding:6px 10px; border-radius:999px; background:rgba(255,255,255,.06); font-size:12px; color:#e2e8f0; }
#admin_panel_view .admin-v2-side { display:flex; flex-direction:column; align-items:flex-end; gap:8px; flex:0 0 auto; }
#admin_panel_view .admin-v2-actions { display:flex; flex-wrap:wrap; gap:8px; margin-top:12px; }
#admin_panel_view .admin-v2-actions > button { display:inline-flex; align-items:center; gap:8px; }
#admin_panel_view .admin-v2-empty { padding:28px 16px; border-radius:20px; background:rgba(15,23,42,.7); border:1px dashed rgba(148,163,184,.28); color:#94a3b8; text-align:center; }
#admin_panel_view .admin-v2-two { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
#admin_panel_view .admin-v2-evidence { display:flex; gap:10px; align-items:flex-start; margin-top:12px; padding:10px; border-radius:16px; background:rgba(255,255,255,.04); }
#admin_panel_view .admin-v2-evidence img { width:90px; height:90px; object-fit:cover; border-radius:14px; }
#admin_panel_view .admin-v2-message { margin-top:12px; padding:12px; border-radius:16px; background:rgba(255,255,255,.04); }
#admin_panel_view .admin-v2-report-tabs { display:flex; gap:8px; margin-bottom:12px; flex-wrap:wrap; }
#admin_panel_view .admin-v2-role-row { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:12px 0; border-top:1px solid rgba(255,255,255,.06); }
#admin_panel_view .admin-v2-role-row:first-child { border-top:none; padding-top:0; }
#admin_panel_view .admin-v2-modal-head { display:flex; gap:12px; align-items:center; }
#admin_panel_view .admin-v2-form-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; }
#admin_panel_view .admin-v2-warning { color:#fca5a5; font-size:12px; margin-top:6px; }
#admin_panel_view .admin-v2-actor { display:flex; gap:10px; align-items:center; padding:10px; border-radius:16px; background:rgba(255,255,255,.04); cursor:pointer; }
#admin_panel_view .admin-v2-actor img { width:44px; height:44px; border-radius:50%; object-fit:cover; }
#admin_panel_view .admin-v2-blockquote { padding:12px; border-radius:16px; background:rgba(255,255,255,.04); color:#e2e8f0; }
@media (max-width: 760px) {
  #admin_panel_view.admin-v2-shell { padding:10px; }
  #admin_panel_view .admin-v2-header { padding:14px; border-radius:20px; }
  #admin_panel_view .admin-v2-title h2 { font-size:24px; }
  #admin_panel_view .admin-v2-grid, #admin_panel_view .admin-v2-two, #admin_panel_view .admin-v2-form-grid { grid-template-columns:minmax(0,1fr); }
  #admin_panel_view .admin-v2-tabs, #admin_panel_view .admin-v2-report-tabs { flex-wrap:nowrap; overflow-x:auto; overflow-y:hidden; scrollbar-width:none; }
  #admin_panel_view .admin-v2-tabs::-webkit-scrollbar, #admin_panel_view .admin-v2-report-tabs::-webkit-scrollbar { display:none; }
  #admin_panel_view .admin-v2-tab { white-space:nowrap; flex:0 0 auto; }
  #admin_panel_view .admin-v2-row { align-items:center; }
  #admin_panel_view .admin-v2-side { align-items:flex-start; width:100%; }
}
</style>
<script id="admin-panel-overrides-script-v20">
(function(){
  const ADMIN_TABS = [
    {key:'users', icon:'users', title:'Пользователи'},
    {key:'banned', icon:'block', title:'Блокировки'},
    {key:'reports', icon:'note', title:'Жалобы'},
    {key:'channels', icon:'megaphone', title:'Каналы'},
    {key:'roles', icon:'shield', title:'Роли'}
  ];

  function esc(v){ return (window.escapeHtml ? window.escapeHtml(String(v ?? '')) : String(v ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))); }
  function jsq(v){ return String(v ?? '').replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\n/g,' '); }
  function badge(icon, text, extra=''){ return `<span class="admin-v2-chip ${extra}">${window.adminSvg ? window.adminSvg(icon) : ''}<span>${esc(text)}</span></span>`; }
  function normaliseRoles(list){ return Array.isArray(list) ? list.map(r => typeof r === 'string' ? {key:r, name:r} : (r || {})) : []; }
  function meRoleKeys(){ return Array.isArray(window.currentUser?.roles) ? window.currentUser.roles.map(r => (r && typeof r === 'object') ? String(r.key || '') : String(r || '')).filter(Boolean) : []; }
  function rolePriorityMap(){
    const map = {project_team:100,special_admin:95,owner1:90,owner2:89,main_admin:85,deputy_admin:80,senior_admin:75,admin:70,senior_moderator:65,moderator:60,junior_moderator:55,helper:50,is_moderator:58};
    return map;
  }
  function maxPriorityFromRoles(keys, isModerator){
    const map = rolePriorityMap();
    let m = isModerator ? (map.is_moderator||58) : 0;
    (keys||[]).forEach(k => { m = Math.max(m, map[k] || 0); });
    return m;
  }
  function canTouchTarget(target){
    const mine = maxPriorityFromRoles(meRoleKeys(), !!window.currentUser?.is_moderator);
    const theirs = maxPriorityFromRoles(normaliseRoles(target.roles).map(r => String(r.key||'')), !!target.is_moderator);
    return String(window.currentUser?.id||'') !== String(target.id||'') && mine > theirs;
  }
  function adminStat(icon, value, label){ return `<div class="admin-v2-stat"><div>${window.adminSvg ? window.adminSvg(icon) : ''}</div><div><div class="value">${esc(value)}</div><div class="label">${esc(label)}</div></div></div>`; }

  window.setAdminScrollUnlocked = function(enabled){
    const body = document.body;
    const html = document.documentElement;
    const sc = document.getElementById('screen-container');
    if (enabled) {
      body.classList.add('admin-panel-open');
      html.classList.add('admin-panel-open');
      sc && sc.classList.add('admin-panel-free-scroll');
    } else {
      body.classList.remove('admin-panel-open');
      html.classList.remove('admin-panel-open');
      sc && sc.classList.remove('admin-panel-free-scroll');
    }
  };

  function buildAdminHeader(){
    return `<div class="admin-v2-header">
      <button type="button" class="secondary-button admin-v2-back" onclick="switchScreen('chats_list')">${window.adminSvg ? window.adminSvg('chat') : ''}<span>К чатам</span></button>
      <div class="admin-v2-title"><h2>Админ-панель</h2><p>Полностью переработанная панель: без закреплённых слоёв, с обычной прокруткой и рабочими действиями.</p></div>
    </div>`;
  }

  function buildAdminTabs(active){
    return `<div class="admin-v2-tabs">${ADMIN_TABS.map(tab => `<button type="button" class="admin-v2-tab ${tab.key===active?'is-active':''}" onclick="switchAdminTab('${tab.key}')">${window.adminSvg ? window.adminSvg(tab.icon) : ''}<span>${tab.title}</span></button>`).join('')}</div>`;
  }

  window.__legacyRenderAdminPanelView = async function(){
    const ok = await window.loadAdminData();
    if (!ok) { window.showModal && showModal('Ошибка', 'Не удалось загрузить админ-панель'); return; }
    const html = `<div id="admin_panel_view" class="admin-v2-shell">
      ${buildAdminHeader()}
      <div class="admin-v2-grid">
        ${adminStat('users', window.adminPanelData.stats.total_users || 0, 'Всего пользователей')}
        ${adminStat('bell', window.adminPanelData.stats.online_now || 0, 'Сейчас в мессенджере')}
      </div>
      ${buildAdminTabs(window.adminPanelData.activeTab || 'users')}
      <div id="admin-content-container" class="admin-v2-body"></div>
    </div>`;
    const sc = document.getElementById('screen-container');
    sc.innerHTML = `<div id="admin_screen_content" class="admin-panel-v2-root">${html}</div>`;
    window.setAdminScrollUnlocked(true);
    window.adminPanelData.activeTab = window.adminPanelData.activeTab || 'users';
    window.switchAdminTab(window.adminPanelData.activeTab);
    requestAnimationFrame(() => { try { sc.scrollTop = 0; } catch(e){} });
  };

  window.switchAdminTab = function(tab){
    window.adminPanelData.activeTab = tab;
    document.querySelectorAll('#admin_panel_view .admin-v2-tab').forEach(btn => btn.classList.toggle('is-active', btn.getAttribute('onclick')?.includes(`'${tab}'`)));
    const c = document.getElementById('admin-content-container');
    if (!c) return;
    if (tab === 'users') return window.renderUsersTab(c);
    if (tab === 'banned') return window.renderBannedTab(c);
    if (tab === 'reports') return window.renderReportsTab(c);
    if (tab === 'channels') return window.renderChannelsTab(c);
    return window.renderRolesTab(c);
  };

  function userPresenceLine(u){
    const p = u && u.presence ? u.presence : null;
    const base = p ? (p.status_label || (u.online ? 'в сети' : 'был(а) недавно')) : (u.online ? 'в сети' : 'был(а) недавно');
    const extra = p && p.status_text ? ` • ${p.status_text}` : '';
    return `${base}${extra}`;
  }

  function renderUserCard(u){
    const roles = normaliseRoles(u.roles);
    return `<button type="button" class="admin-v2-card" onclick="selectAdminUser('${jsq(u.id)}')">
      <div class="admin-v2-row">
        <img src="${esc(u.avatar || '/default.png')}" class="admin-v2-avatar" alt="">
        <div class="admin-v2-meta">
          <div class="admin-v2-name"><span>${esc(u.name || u.username || 'Пользователь')}</span>${u.is_verified ? (window.verifiedBadgeSvg ? window.verifiedBadgeSvg() : '') : ''}${u.online ? '<span class="w-2 h-2 rounded-full bg-green-500"></span>' : ''}</div>
          <div class="admin-v2-sub">@${esc(u.username || 'user')}</div>
          <div class="admin-v2-presence ${u.online ? 'text-green-400':'text-slate-400'}">${esc(userPresenceLine(u))}</div>
          <div class="admin-v2-chips">
            ${roles.map(r => `<span class="role-tag role-fx text-xs" style="background:${esc(r.color_bg || '#334155')};color:${esc(r.color_text || '#fff')}">${esc(r.name || r.key || r)}</span>`).join('')}
            ${u.is_moderator ? badge('shield','Модератор') : ''}
            ${(u.muted_until && (u.muted_until * 1000 > Date.now())) ? badge('bell','Мут') : ''}
          </div>
        </div>
        <div class="admin-v2-side">${badge('bolt', String(u.stars || 0))}</div>
      </div>
    </button>`;
  }

  window.renderUsersTab = function(container){
    container.innerHTML = `<div class="admin-v2-panel">
      <div class="admin-v2-search">${window.adminSvg ? window.adminSvg('search') : ''}<input id="admin-user-search" type="text" placeholder="Поиск по имени или логину" oninput="filterAdminUsers(this.value)"></div>
      <div id="admin-users-list" class="admin-v2-list">${(window.adminPanelData.users||[]).map(renderUserCard).join('') || '<div class="admin-v2-empty">Пользователей нет</div>'}</div>
    </div>`;
  };
  window.filterAdminUsers = function(query){
    const q = String(query || '').toLowerCase().trim();
    const list = document.getElementById('admin-users-list'); if (!list) return;
    const items = !q ? (window.adminPanelData.users||[]) : (window.adminPanelData.users||[]).filter(u => String(u.name||'').toLowerCase().includes(q) || String(u.username||'').toLowerCase().includes(q));
    list.innerHTML = items.length ? items.map(renderUserCard).join('') : '<div class="admin-v2-empty">Ничего не найдено</div>';
  };

  function actionBtn(cls, text, onclick, disabled){
    const disabledAttr = disabled ? 'disabled aria-disabled="true"' : '';
    return `<button type="button" class="${cls}" ${disabledAttr} onclick="${disabled ? '' : onclick}">${text}</button>`;
  }

  window.selectAdminUser = function(userId){
    const user = (window.adminPanelData.users||[]).find(u => String(u.id) === String(userId));
    if (!user) return;
    const modal = document.getElementById('custom-modal'); if (!modal) return;
    const title = document.getElementById('modal-title');
    const message = document.getElementById('modal-message');
    const okBtn = document.getElementById('modal-ok-button');
    const confirmWrap = document.getElementById('modal-confirm-buttons');
    const roleList = [
      ['project_team','Команда проекта'],['special_admin','Спец Админ'],['owner1','Владелец 1'],['owner2','Владелец 2'],['main_admin','Главный Админ'],['deputy_admin','Зам. Главного Админа'],['senior_admin','Старший администратор'],['admin','Администратор'],['senior_moderator','Старший модератор'],['moderator','Модератор'],['junior_moderator','Младший модератор'],['helper','Хелпер']
    ];
    const myKeys = meRoleKeys();
    const myMax = maxPriorityFromRoles(myKeys, !!window.currentUser?.is_moderator);
    const targetKeys = normaliseRoles(user.roles).map(r => String(r.key||''));
    const targetMax = maxPriorityFromRoles(targetKeys, !!user.is_moderator);
    const canManage = canTouchTarget(user);
    const canAssignSpecial = !!window.adminPanelData.can_assign_special;
    const roleRows = roleList.map(([key,label]) => {
      const special = ['project_team','special_admin','owner1','owner2'].includes(key);
      const rolePriority = rolePriorityMap()[key] || 0;
      const hasRole = targetKeys.includes(key);
      const allowed = canManage && myMax > rolePriority && (!special || canAssignSpecial) && !myKeys.includes(key);
      const verb = hasRole ? 'removerole' : 'setrole';
      const btnText = hasRole ? 'Снять' : 'Выдать';
      return `<div class="admin-v2-role-row"><div><div class="font-semibold text-white">${esc(label)}</div><div class="text-xs text-slate-500">${esc(key)}</div>${!allowed ? '<div class="admin-v2-warning">Недостаточно прав для изменения этой роли</div>' : ''}</div>${actionBtn(hasRole ? 'secondary-button text-xs px-3 py-2' : 'primary-button text-xs px-3 py-2', btnText, `adminAction('${jsq(user.id)}','${verb}','${key}')`, !allowed)}</div>`;
    }).join('');
    const verifiedText = user.is_verified ? 'Снять галочку' : 'Выдать галочку';
    const verifiedAction = user.is_verified ? 'unverify_user' : 'verify_user';
    const verifiedDisabled = !canManage;
    title.textContent = `Управление: ${user.name || user.username || 'Пользователь'}`;
    message.innerHTML = `<div class="space-y-4 text-left">
      <div class="admin-v2-modal-head"><img src="${esc(user.avatar || '/default.png')}" class="admin-v2-avatar" alt=""><div class="min-w-0"><div class="admin-v2-name"><span>${esc(user.name || user.username || 'Пользователь')}</span>${user.is_verified ? (window.verifiedBadgeSvg ? window.verifiedBadgeSvg('lg') : '') : ''}</div><div class="admin-v2-sub">@${esc(user.username || 'user')}</div><div class="admin-v2-presence ${user.online ? 'text-green-400':'text-slate-400'}">${esc(userPresenceLine(user))}</div></div></div>
      <div class="admin-v2-two">
        <div class="admin-v2-card"><div class="text-xs text-slate-400">Роли</div><div class="admin-v2-chips mt-2">${normaliseRoles(user.roles).map(r => `<span class="role-tag role-fx text-xs" style="background:${esc(r.color_bg || '#334155')};color:${esc(r.color_text || '#fff')}">${esc(r.name || r.key || '')}</span>`).join('') || '<span class="text-slate-500 text-sm">Нет ролей</span>'}</div></div>
        <div class="admin-v2-card"><div class="text-xs text-slate-400">Модерация</div><div class="admin-v2-chips mt-2">${user.is_moderator ? badge('shield','Модератор') : ''}${(user.muted_until && (user.muted_until*1000 > Date.now())) ? badge('bell','Мут до ' + new Date(user.muted_until*1000).toLocaleString()) : '<span class="text-slate-500 text-sm">Нет активного мута</span>'}</div></div>
      </div>
      <div class="admin-v2-actions">
        ${actionBtn('primary-button text-xs px-3 py-2', `${window.adminSvg ? window.adminSvg('bell') : ''}<span>Мут 24ч</span>`, `adminAction('${jsq(user.id)}','mute',{reason:'Нарушение правил',hours:24})`, !canManage)}
        ${actionBtn('secondary-button text-xs px-3 py-2', `${window.adminSvg ? window.adminSvg('unlock') : ''}<span>Снять мут</span>`, `adminAction('${jsq(user.id)}','unmute')`, !canManage)}
        ${actionBtn('primary-button text-xs px-3 py-2 bg-red-600 hover:bg-red-700', `${window.adminSvg ? window.adminSvg('block') : ''}<span>Бан</span>`, `openAdminBanModal('${jsq(user.id)}')`, !canManage)}
        ${actionBtn('secondary-button text-xs px-3 py-2', `${window.adminSvg ? window.adminSvg('verified') : ''}<span>${verifiedText}</span>`, `adminAction('${jsq(user.id)}','${verifiedAction}')`, verifiedDisabled)}
      </div>
      <div class="admin-v2-card"><div class="font-bold mb-2">Управление ролями</div>${roleRows}</div>
    </div>`;
    okBtn.classList.remove('hidden'); okBtn.textContent = 'Закрыть'; okBtn.onclick = () => modal.classList.add('hidden');
    confirmWrap.classList.add('hidden');
    modal.classList.remove('hidden');
  };

  window.openAdminBanModal = function(userId){
    const user = (window.adminPanelData.users||[]).find(u => String(u.id) === String(userId)); if (!user) return;
    const modal = document.getElementById('custom-modal');
    document.getElementById('modal-title').textContent = `Блокировка: ${user.name || user.username || 'Пользователь'}`;
    document.getElementById('modal-message').innerHTML = `<div class="space-y-4 text-left">
      <label class="block">Причина<input id="admin-ban-reason" class="input-field mt-2" maxlength="140" placeholder="Нарушение правил"></label>
      <div class="admin-v2-form-grid">
        <label class="block">Число<input id="admin-ban-duration-value" class="input-field mt-2" type="number" min="1" value="7"></label>
        <label class="block">Единица<select id="admin-ban-duration-unit" class="input-field mt-2"><option value="hours">Часы</option><option value="days" selected>Дни</option><option value="weeks">Недели</option><option value="months">Месяцы</option><option value="forever">Навсегда</option></select></label>
      </div>
      <div class="admin-v2-actions"><label class="admin-v2-chip"><input id="admin-ban-ip" type="checkbox" checked> <span>Блок по IP</span></label><label class="admin-v2-chip"><input id="admin-ban-device" type="checkbox" checked> <span>Блок по устройству</span></label></div>
    </div>`;
    document.getElementById('modal-ok-button').classList.add('hidden');
    document.getElementById('modal-confirm-buttons').classList.remove('hidden');
    document.getElementById('modal-confirm-button').textContent = 'Заблокировать';
    document.getElementById('modal-cancel-button').textContent = 'Отмена';
    document.getElementById('modal-confirm-button').onclick = () => {
      const payload = {reason: document.getElementById('admin-ban-reason')?.value || 'Нарушение правил', duration_value: document.getElementById('admin-ban-duration-value')?.value || 7, duration_unit: document.getElementById('admin-ban-duration-unit')?.value || 'days', permanent: document.getElementById('admin-ban-duration-unit')?.value === 'forever' ? 1 : 0, ban_ip: document.getElementById('admin-ban-ip')?.checked ? 1 : 0, ban_device: document.getElementById('admin-ban-device')?.checked ? 1 : 0};
      modal.classList.add('hidden');
      window.adminAction(userId,'ban',payload);
    };
    document.getElementById('modal-cancel-button').onclick = () => modal.classList.add('hidden');
    modal.classList.remove('hidden');
  };

  window.adminAction = async function(targetUserId, action, extraData){
    const data = {admin_action: action, target_user_id: targetUserId || ''};
    if (typeof extraData === 'string') {
      if (action === 'setrole' || action === 'removerole') data.role_key = extraData; else data.reason = extraData;
    } else if (extraData && typeof extraData === 'object') {
      Object.assign(data, extraData);
    }
    const res = await window.apiRequest('admin_action', data);
    if (!res || !res.success) { window.showModal && showModal('Ошибка', (res && res.error) || 'Не удалось выполнить действие'); return; }
    if (document.getElementById('custom-modal')) document.getElementById('custom-modal').classList.add('hidden');
    await window.loadAdminData();
    if (document.getElementById('admin_panel_view')) {
      const active = window.adminPanelData.activeTab || 'users';
      const c = document.getElementById('admin-content-container');
      if (c) window.switchAdminTab(active); else await window.renderAdminPanelView();
    }
    window.showModal && showModal('Успех', 'Действие выполнено');
  };

  window.renderBannedTab = function(container){
    const list = window.adminPanelData.banned_users || [];
    container.innerHTML = `<div class="admin-v2-panel"><div class="admin-v2-grid">${adminStat('block', list.length, 'Активных блокировок')}${adminStat('bell', (window.adminPanelData.users||[]).filter(u => u.muted_until && (u.muted_until * 1000 > Date.now())).length, 'Активных мутов')}</div><div class="admin-v2-list">${list.length ? list.map(u => `<div class="admin-v2-card"><div class="admin-v2-row"><img src="${esc(u.avatar)}" class="admin-v2-avatar" alt=""><div class="admin-v2-meta"><div class="admin-v2-name">${esc(u.name)}</div><div class="admin-v2-sub">@${esc(u.username)}</div><div class="text-sm text-red-300 mt-2">Причина: ${esc(u.block_reason || 'Нарушение правил')}</div><div class="admin-v2-chips mt-2">${u.ban_ip ? badge('block','IP') : ''}${u.ban_device ? badge('shield','Устройство') : ''}${badge('note', u.expires_at_formatted || 'Навсегда')}</div></div><div class="admin-v2-side"><button type="button" class="primary-button text-xs px-3 py-2 bg-green-600 hover:bg-green-700" onclick="adminAction('${jsq(u.id)}','unban')">${window.adminSvg ? window.adminSvg('unlock') : ''}<span>Разбанить</span></button></div></div></div>`).join('') : '<div class="admin-v2-empty">Нет активных блокировок</div>'}</div></div>`;
  };

  window.renderReportsTab = function(container){
    const active = window.adminReportsSubtab || 'user';
    const reports = (window.adminPanelData.reports || []).filter(r => String(r.type || 'user') === active);
    const actorCard = (actor, label) => `<button type="button" class="admin-v2-actor" onclick="${actor && actor.id ? `selectAdminUser('${jsq(actor.id)}')` : 'void(0)'}"><img src="${esc((actor && actor.avatar) || '/default.png')}" alt=""><div class="min-w-0"><div class="text-xs text-slate-400">${label}</div><div class="font-semibold truncate">${esc((actor && actor.name) || 'Пользователь')}</div><div class="text-xs text-slate-500 truncate">@${esc((actor && actor.username) || 'user')}</div></div></button>`;
    const statusBadge = s => s === 'pending' ? badge('bell','Ожидает') : (s === 'approved' ? badge('check','Одобрено') : badge('x','Отклонено'));
    container.innerHTML = `<div class="admin-v2-panel"><div class="admin-v2-report-tabs"><button type="button" class="admin-v2-tab ${active==='user'?'is-active':''}" onclick="switchAdminReportsSubtab('user')">На пользователей</button><button type="button" class="admin-v2-tab ${active==='message'?'is-active':''}" onclick="switchAdminReportsSubtab('message')">На сообщения</button></div>${reports.length ? `<div class="admin-v2-list">${reports.map(r => `<div class="admin-v2-card"><div class="flex items-start justify-between gap-3"><div><div class="font-bold">${esc(r.reason_label || 'Жалоба')}</div><div class="text-xs text-slate-500 mt-1">${esc(r.created_at_formatted || '')}</div></div><div>${statusBadge(r.status)}</div></div><div class="admin-v2-two mt-3">${actorCard(r.reporter_profile || {}, 'Кто подал')}${actorCard(r.target_profile || {}, r.type === 'message' ? 'На чьё сообщение' : 'На кого подана')}</div>${r.message && r.message.message_id ? `<div class="admin-v2-message"><div class="text-xs text-slate-400">Сообщение</div><div class="mt-2 whitespace-pre-wrap">${esc(r.message.preview || '')}</div></div>` : ''}${r.comment ? `<div class="admin-v2-blockquote mt-3">${esc(r.comment)}</div>` : ''}${r.evidence && r.evidence.url ? `<div class="admin-v2-evidence">${r.evidence.kind === 'photo' ? `<img src="${esc(r.evidence.url)}" alt="">` : badge('note','Файл')}<div class="min-w-0"><div class="text-xs text-slate-400">Доказательства</div><a href="${esc(r.evidence.url)}" target="_blank" rel="noopener" class="text-sky-300 break-all">${esc(r.evidence.name || r.evidence.url)}</a></div></div>` : ''}${r.admin_comment ? `<div class="text-xs text-slate-400 mt-3">Комментарий модератора: ${esc(r.admin_comment)}</div>` : ''}${r.status === 'pending' ? `<div class="admin-v2-actions"><button type="button" class="primary-button text-xs px-3 py-2" onclick="openReportReviewModal('${jsq(r.id)}','${jsq(r.target_user_id || '')}')">Рассмотреть</button><button type="button" class="secondary-button text-xs px-3 py-2" onclick="quickRejectReport('${jsq(r.id)}')">Отклонить</button></div>` : ''}</div>`).join('')}</div>` : '<div class="admin-v2-empty">Жалоб в этой вкладке пока нет</div>'}</div>`;
  };
  window.switchAdminReportsSubtab = function(type){ window.adminReportsSubtab = (type === 'message' ? 'message' : 'user'); const c = document.getElementById('admin-content-container'); if (c) window.renderReportsTab(c); };
  window.quickRejectReport = function(reportId){ window.adminAction('', 'review_report', {report_id: reportId, decision: 'reject', punishment: 'none', comment: 'Жалоба не была одобрена после проверки'}); };
  window.openReportReviewModal = function(reportId, targetUserId){
    const modal = document.getElementById('custom-modal'); if (!modal) return;
    document.getElementById('modal-title').textContent = 'Рассмотрение жалобы';
    document.getElementById('modal-message').innerHTML = `<div class="space-y-4 text-left"><div class="admin-v2-report-tabs"><button type="button" id="report-decision-approve" class="admin-v2-tab is-active" onclick="selectReportDecisionMode('approve')">Одобрить</button><button type="button" id="report-decision-reject" class="admin-v2-tab" onclick="selectReportDecisionMode('reject')">Отклонить</button></div><div id="report-approve-fields"><div id="report-punishment-grid" class="admin-v2-list">${[['none','Без наказания'],['warn','Предупреждение'],['mute_24h','Мут 24 часа'],['mute_7d','Мут 7 дней'],['ban','Бан'],['custom','Своё наказание']].map(([key,title]) => `<button type="button" class="admin-v2-card report-punish-option ${key==='warn'?'active':''}" data-punishment="${key}" onclick="selectReportPunishment('${key}')"><div class="font-bold">${title}</div></button>`).join('')}</div><div id="report-custom-fields" class="hidden space-y-3"><label class="block">Название наказания<input id="report-custom-title" class="input-field mt-2" maxlength="80"></label><div class="admin-v2-form-grid"><label class="block">Тип действия<select id="report-custom-mode" class="input-field mt-2"><option value="none">Только зафиксировать</option><option value="warn">Предупреждение</option><option value="mute">Мут</option><option value="ban">Бан</option></select></label><label class="block">Часы мута<input id="report-custom-hours" class="input-field mt-2" type="number" min="1" max="720" value="24"></label></div></div></div><div id="report-reject-fields" class="hidden"><label class="block">Причина отказа<select id="report-reject-reason" class="input-field mt-2"><option value="Недостаточно доказательств">Недостаточно доказательств</option><option value="Нарушение не подтверждено">Нарушение не подтверждено</option><option value="Жалоба дублирует уже рассмотренную">Жалоба дублирует уже рассмотренную</option><option value="Нужно больше контекста">Нужно больше контекста</option></select></label></div><label class="block">Комментарий администратора<textarea id="report-admin-comment" class="input-field w-full h-24 mt-2" placeholder="Комментарий к решению"></textarea></label></div>`;
    window.currentReportPunishment = 'warn'; window.currentReportDecisionMode = 'approve';
    window.selectReportPunishment('warn'); window.selectReportDecisionMode('approve');
    document.getElementById('modal-ok-button').classList.add('hidden');
    document.getElementById('modal-confirm-buttons').classList.remove('hidden');
    document.getElementById('modal-confirm-button').textContent = 'Сохранить решение';
    document.getElementById('modal-cancel-button').textContent = 'Отмена';
    document.getElementById('modal-confirm-button').onclick = () => {
      const mode = window.currentReportDecisionMode || 'approve';
      const comment = document.getElementById('report-admin-comment')?.value || '';
      let payload = {report_id: reportId, decision: mode, comment};
      if (mode === 'approve') {
        payload = Object.assign(payload, window.buildReportDecisionPayload(reportId, targetUserId, 'approve', comment));
      } else {
        const reason = document.getElementById('report-reject-reason')?.value || 'Недостаточно доказательств';
        payload.punishment = 'none'; payload.comment = comment.trim() ? `${reason}. ${comment.trim()}` : reason;
      }
      modal.classList.add('hidden');
      window.adminAction(targetUserId || '', 'review_report', payload);
    };
    document.getElementById('modal-cancel-button').onclick = () => modal.classList.add('hidden');
    modal.classList.remove('hidden');
  };
  window.selectReportDecisionMode = function(mode){
    window.currentReportDecisionMode = (mode === 'reject') ? 'reject' : 'approve';
    document.getElementById('report-decision-approve')?.classList.toggle('is-active', window.currentReportDecisionMode === 'approve');
    document.getElementById('report-decision-reject')?.classList.toggle('is-active', window.currentReportDecisionMode === 'reject');
    document.getElementById('report-approve-fields')?.classList.toggle('hidden', window.currentReportDecisionMode !== 'approve');
    document.getElementById('report-reject-fields')?.classList.toggle('hidden', window.currentReportDecisionMode !== 'reject');
  };
  window.selectReportPunishment = function(key){
    window.currentReportPunishment = key;
    document.querySelectorAll('#report-punishment-grid .report-punish-option').forEach(el => el.classList.toggle('active', el.dataset.punishment === key));
    document.getElementById('report-custom-fields')?.classList.toggle('hidden', key !== 'custom');
  };
  window.buildReportDecisionPayload = function(reportId, targetUserId, decision, comment){
    const key = window.currentReportPunishment || 'none';
    const payload = {report_id: reportId, decision, punishment: key === 'custom' ? 'custom' : key, comment};
    if (key === 'custom') {
      payload.custom_title = document.getElementById('report-custom-title')?.value || '';
      payload.custom_mode = document.getElementById('report-custom-mode')?.value || 'none';
      payload.custom_hours = document.getElementById('report-custom-hours')?.value || '24';
    }
    return payload;
  };

  window.renderChannelsTab = function(container){
    container.innerHTML = `<div class="admin-v2-panel"><div class="admin-v2-search">${window.adminSvg ? window.adminSvg('search') : ''}<input id="admin-channel-search" type="text" placeholder="Поиск по названию канала или @username" oninput="filterAdminChannels(this.value)"></div><div id="admin-channels-list" class="admin-v2-list"></div></div>`;
    window.filterAdminChannels('');
  };
  window.filterAdminChannels = function(query){
    const q = String(query || '').toLowerCase().trim();
    const items = !q ? (window.adminPanelData.channels||[]) : (window.adminPanelData.channels||[]).filter(ch => String(ch.name||'').toLowerCase().includes(q) || String(ch.username||'').toLowerCase().includes(q));
    const list = document.getElementById('admin-channels-list'); if (!list) return;
    list.innerHTML = items.length ? items.map(ch => `<div class="admin-v2-card"><div class="admin-v2-row"><div class="admin-v2-meta"><div class="admin-v2-name"><span>${esc(ch.name || 'Канал')}</span>${ch.is_verified ? (window.verifiedBadgeSvg ? window.verifiedBadgeSvg('lg') : '') : ''}</div><div class="admin-v2-sub">@${esc(ch.username || '')}</div><div class="text-xs text-slate-500 mt-1">Участников: ${Number(ch.member_count||0)}</div></div><div class="admin-v2-side"><button type="button" class="${ch.is_verified ? 'secondary-button' : 'primary-button'} text-xs px-3 py-2" onclick="confirmChannelVerification('${jsq(ch.id)}','${jsq(ch.name || 'Канал')}', ${ch.is_verified ? 'false' : 'true'})">${ch.is_verified ? 'Снять галочку' : 'Выдать галочку'}</button></div></div></div>`).join('') : '<div class="admin-v2-empty">Каналы не найдены</div>';
  };
  window.confirmChannelVerification = function(channelId, channelName, shouldVerify){
    const title = shouldVerify ? 'Выдать верификацию?' : 'Снять верификацию?';
    const body = shouldVerify ? `Вы действительно хотите дать верификацию (галочку) данному каналу?<br><strong>${esc(channelName || 'Канал')}</strong>` : `Вы действительно хотите снять верификацию у канала?<br><strong>${esc(channelName || 'Канал')}</strong>`;
    window.showModal && showModal(title, body, true, () => window.adminAction('', shouldVerify ? 'verify_channel' : 'unverify_channel', {channel_id: channelId}));
  };
  window.renderRolesTab = function(container){
    const rows = window.adminPanelData.role_policies || [];
    container.innerHTML = `<div class="admin-v2-panel"><div class="admin-v2-list">${rows.length ? rows.map(r => `<div class="admin-v2-card"><div class="font-bold text-lg">${esc(r.name || r.key)}</div><div class="text-xs text-slate-500 mb-2">${esc(r.key || '')}</div><div class="admin-v2-chips">${(r.rights || []).map(x => badge('shield', x)).join('')}</div></div>`).join('') : '<div class="admin-v2-empty">Политики ролей не найдены</div>'}</div></div>`;
  };
})();
</script>