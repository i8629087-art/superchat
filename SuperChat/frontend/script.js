<script>
        let loginStage = 'loading'; 
        let currentChatId = null;
        let editingMessageId = null; // ID сообщения, которое редактируем
        let currentUser = {};
        document.addEventListener('DOMContentLoaded', () => { try { updateAdminAccessUI(); } catch(e) {} });
        let chatsData = [];
        let notifications = [];
        let channels = [];
        let groups = [];
        let news = [];
        let messagesPollInterval = null;
        let notificationsPollInterval = null;
        let chatPollRate = 2000;
        let notificationsPollRate = 5000;
        const GIFTS_STORE = {
	            // === Старые подарки (важно: не удалять, чтобы старые инвентари/сообщения работали) ===
	            'bear':      { id: 1,  emoji: '🐻', price: 10,   name: 'Мишка',          desc:'Классика из старого магазина', grad:'linear-gradient(135deg,#7c3aed,#1d4ed8)', accent:'#7c3aed', model:'legacy', hidden_shop:true },
	            'heart':     { id: 2,  emoji: '❤️', price: 15,   name: 'Сердце',         desc:'Тепло и забота',               grad:'linear-gradient(135deg,#fb7185,#ef4444)', accent:'#ef4444', model:'legacy', hidden_shop:true },
	            'champagne': { id: 3,  emoji: '🍾', price: 20,   name: 'Шампанское',     desc:'Праздничный вайб',             grad:'linear-gradient(135deg,#f59e0b,#10b981)', accent:'#f59e0b', model:'legacy', hidden_shop:true },
	            'cat':       { id: 4,  emoji: '😻', price: 50,   name: 'Котик',          desc:'Милота на максимум',           grad:'linear-gradient(135deg,#22c55e,#06b6d4)', accent:'#22c55e', model:'legacy', hidden_shop:true },
	            'duck':      { id: 5,  emoji: '🦆', price: 20,   name: 'Утка',           desc:'Кря-кря',                      grad:'linear-gradient(135deg,#60a5fa,#34d399)', accent:'#60a5fa', model:'legacy', hidden_shop:true },
'halloween': { id: 7,  emoji: '🎃', price: 300,  name: 'Буу...',         desc:'Страшно красиво',              grad:'linear-gradient(135deg,#fb7185,#f59e0b)', accent:'#f59e0b', model:'legacy', hidden_shop:true },
	            'santa':     { id: 8,  emoji: '🎅', price: 100,  name: 'Санта',          desc:'Новогодний подарок',           grad:'linear-gradient(135deg,#ef4444,#22c55e)', accent:'#22c55e', model:'legacy', hidden_shop:true },
	            'lemon':     { id: 9,  emoji: '🍋', price: 200,  name: 'Лимон',          desc:'Кислинка дня',                 grad:'linear-gradient(135deg,#fde047,#22c55e)', accent:'#fde047', model:'legacy', hidden_shop:true },
	            'burger':    { id: 10, emoji: '🍔', price: 500,  name: 'Бургер',         desc:'Самый вкусный',                grad:'linear-gradient(135deg,#fb7185,#f59e0b)', accent:'#fb7185', model:'legacy', hidden_shop:true },
	            'panda':     { id: 11, emoji: '🐼', price: 1000, name: 'Панда',          desc:'Редкий гость',                 grad:'linear-gradient(135deg,#94a3b8,#111827)', accent:'#94a3b8', model:'legacy', hidden_shop:true },
	            'chr':       { id: 12, emoji: '🎄', price: 2000, name: 'С новым годом!', desc:'Праздник в чате',              grad:'linear-gradient(135deg,#22c55e,#38bdf8)', accent:'#22c55e', model:'legacy', hidden_shop:true },

            // === Обычные подарки (покупка за ⚡) ===
            'rose':     { id: 101, emoji: '🌹', price: 25,  name: 'Алый букет',      desc: 'Классика, которая всегда в тему',      grad: 'linear-gradient(135deg,#ff4d6d,#c9184a)', accent:'#ff4d6d', model: 'petals' },
            'choco':    { id: 102, emoji: '🍫', price: 40,  name: 'Шоколадный бокс', desc: 'Сладкий комплимент без слов',           grad: 'linear-gradient(135deg,#7f5539,#b08968)', accent:'#b08968', model: 'bar' },
            'coffee':   { id: 103, emoji: '☕', price: 55,  name: 'Арома-кофе',      desc: 'Энергия + уют в одной кружке',         grad: 'linear-gradient(135deg,#8d99ae,#2b2d42)', accent:'#8d99ae', model: 'steam' },
            'sparkle':  { id: 104, emoji: '✨', price: 75,  name: 'Искра удачи',     desc: 'Чуть магии на хороший день',           grad: 'linear-gradient(135deg,#ffd166,#ef476f)', accent:'#ffd166', model: 'stars' },
            'cake':     { id: 105, emoji: '🎂', price: 120, name: 'Праздничный торт',desc: 'Для дня рождения и не только',          grad: 'linear-gradient(135deg,#ffafcc,#a2d2ff)', accent:'#a2d2ff', model: 'layers' },
            'perfume':  { id: 106, emoji: '🧴', price: 160, name: 'Парфюм',          desc: 'Тонкий аромат настроения',              grad: 'linear-gradient(135deg,#b8c0ff,#ffd6ff)', accent:'#b8c0ff', model: 'bottle' },
            'gamepad':  { id: 107, emoji: '🎮', price: 220, name: 'Геймпад',         desc: 'Для настоящего игрока',                grad: 'linear-gradient(135deg,#00f5d4,#00bbf9)', accent:'#00bbf9', model: 'pad' },
            'camera':   { id: 108, emoji: '📷', price: 280, name: 'Камера',          desc: 'Лови моменты красиво',                 grad: 'linear-gradient(135deg,#cdb4db,#ffc8dd)', accent:'#cdb4db', model: 'lens' },
            'crown':    { id: 109, emoji: '👑', price: 420, name: 'Корона',          desc: 'Для короля или королевы чата',         grad: 'linear-gradient(135deg,#f9c74f,#f9844a)', accent:'#f9c74f', model: 'crown' },
            'diamond':  { id: 110, emoji: '💎', price: 650, name: 'Алмаз',           desc: 'Редкий блеск и статус',                grad: 'linear-gradient(135deg,#48cae4,#023e8a)', accent:'#48cae4', model: 'gem' },
            'ufo':      { id: 111, emoji: '🛸', price: 900, name: 'НЛО',             desc: 'Подарок не с этой планеты',            grad: 'linear-gradient(135deg,#80ffdb,#6930c3)', accent:'#80ffdb', model: 'ufo' },
	            // Dragon NFT (available in shop + can be sold on auction)
	            'dragon': { id: 112, emoji: '🐉', name: 'Дракон NFT', price: 2800, type: 'nft', desc: 'NFT-подарок с огненным эффектом', grad: 'linear-gradient(135deg,#ff4d00,#7c3aed)', accent: '#ff4d00', model: 'dragon_fire', fx: 'dragon' },
	            'phoenix': { id: 202, emoji: '🪽', name: 'Феникс NFT', price: 3600, type: 'nft', desc: 'NFT-подарок с холодным эффектом возрождения и аурой пепла', grad: 'linear-gradient(135deg,#0ea5e9,#8b5cf6 55%,#facc15)', accent: '#38bdf8', model: 'phoenix_aurora', fx: 'phoenix' },
        };

        document.addEventListener('DOMContentLoaded', function() {
            const savedTheme = localStorage.getItem('vox_theme') || 'default';
            applyTheme(savedTheme);
            // Premium design settings (rounding/blur/glass)
            applyDesignSettings();
            applyPowerSaveMode();
            applyLowSpecMode();
            applyMobileLiteMode();

            // Polling rates (optimize for mobile/low-spec)
            try{
                const lowSpecEnabled = localStorage.getItem('vox_low_spec') === '1';
                const isMobile = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
                if (lowSpecEnabled || isMobile){
                    chatPollRate = 3500;
                    notificationsPollRate = 9000;
                }
            }catch(e){}

            try { initGlobalPlayer(); } catch(e) {}
            try { applyScrollFxPreference(); } catch(e) {}
            try { registerPushNotifications(); } catch(e) {}
            try { warmEffectAssetsOnBoot(); } catch(e) {}
        });

        
        function __escapeHtml(s){
            return String(s ?? '')
                .replace(/&/g,'&amp;')
                .replace(/</g,'&lt;')
                .replace(/>/g,'&gt;')
                .replace(/"/g,'&quot;')
                .replace(/'/g,'&#39;');
        }
        function __formatModalMessage(message){
            const raw = String(message ?? '');
            // If message contains trusted UI markup (inputs, layout, gift cards, etc.) — render as HTML
            const looksHtml = /<\s*(input|div|span|br|p|h\d|button|img|strong|ul|li|table|tr|td|th|a)\b/i.test(raw);
            if (looksHtml) return raw;

            // Otherwise render as safe HTML + поддержка **жирного**
            let s = raw;
            // убираем мусорные маркеры типа /strong, ** и т.п.
            s = s.replace(/\/?strong\b/gi, '');
            // переносы строк
            s = s.replace(/\r\n/g,'\n');
            // экранируем
            s = __escapeHtml(s);
            // markdown **bold**
            s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
            // одиночные * (часто как артефакт)
            s = s.replace(/\*/g, '');
            // \n -> <br>
            s = s.replace(/\n/g,'<br>');
            return s;
        }

        function showModal(title, message, isConfirm = false, onConfirm = null) {
            const modal = document.getElementById('custom-modal');
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                if (window.currentUser && currentUser && currentUser.active_effect) {
                    if (currentUser.active_effect && getEffectPalette(currentUser.active_effect)) modalContent.classList.add(`${currentUser.active_effect}-effect-bg`);
                }
            }

            document.getElementById('modal-title').textContent = title;

            const msgEl = document.getElementById('modal-message');
            if (msgEl) msgEl.innerHTML = __formatModalMessage(message);

            document.getElementById('modal-ok-button').textContent = 'ОК';
            document.getElementById('modal-confirm-button').textContent = 'Подтвердить';
            document.getElementById('modal-cancel-button').textContent = 'Отмена';
            document.getElementById('modal-ok-button').classList.toggle('hidden', isConfirm);
            document.getElementById('modal-confirm-buttons').classList.toggle('hidden', !isConfirm);
            document.getElementById('modal-confirm-buttons').classList.remove('single-action');
            document.getElementById('modal-cancel-button').classList.remove('hidden');
            document.getElementById('modal-confirm-button').style.width = '';
            document.getElementById('modal-cancel-button').style.width = '';

            if (!isConfirm && onConfirm) {
                document.getElementById('modal-ok-button').onclick = () => {
                    modal.classList.add('hidden');
                    onConfirm();
                };
            } else if (!isConfirm && !onConfirm) {
                document.getElementById('modal-ok-button').onclick = () => {
                    modal.classList.add('hidden');
                };
            }

            if (isConfirm) {
                document.getElementById('modal-confirm-button').onclick = () => {
                    modal.classList.add('hidden');
                    if (onConfirm) onConfirm();
                };
                document.getElementById('modal-cancel-button').onclick = () => {
                    modal.classList.add('hidden');
                };
            }

            modal.classList.remove('hidden');
            setTimeout(() => { try{ refreshGift3dControls(); }catch(e){} }, 0);
        }

        function setModalSingleAction(label, onConfirm){
            const wrap = document.getElementById('modal-confirm-buttons');
            const confirmBtn = document.getElementById('modal-confirm-button');
            const cancelBtn = document.getElementById('modal-cancel-button');
            if (!wrap || !confirmBtn || !cancelBtn) return;
            wrap.classList.remove('hidden');
            wrap.classList.add('single-action');
            cancelBtn.classList.add('hidden');
            confirmBtn.textContent = label || 'Подтвердить';
            confirmBtn.onclick = async () => {
                const modal = document.getElementById('custom-modal');
                if (modal) modal.classList.add('hidden');
                if (typeof onConfirm === 'function') await onConfirm();
            };
        }

        // =========================================================
        // Center Gift Toast (send confirmation + receive)
        // =========================================================
        let giftToastTimer = null;
        const __seenGiftNotificationIds = new Set();
        const __seenGiftMessageIds = new Set();

        function hideGiftToast(){
            const toast = document.getElementById('gift-toast');
            if (!toast) return;
            try{ toast.classList.remove('show'); }catch(e){}
            if (giftToastTimer) { clearTimeout(giftToastTimer); giftToastTimer = null; }
            setTimeout(() => {
                try{ toast.classList.add('hidden'); }catch(e){}
            }, 200);
        }

        function guessEmojiFromText(txt){
    const t = String(txt || '');
    try{
        const m = t.match(/\p{Extended_Pictographic}/u);
        if (m && m[0]) return m[0];
    }catch(e){
        // Fallback for browsers without Unicode property escapes
        const m2 = t.match(/[🎁🌹🍫☕✨🎂🧴🎮📷👑💎🛸🐉🍭]/);
        if (m2 && m2[0]) return m2[0];
    }
    return '🎁';
}

function extractNumberFromText(txt){
    try{
        const m = String(txt||'').match(/(\d{1,9})/);
        return m ? m[1] : null;
    }catch(e){ return null; }
}

function extractGiftEmojiFromSystemText(txt){
            const t = String(txt || '');
            try{
                const arr = Array.from(t.matchAll(/\p{Extended_Pictographic}/gu)).map(m => m[0]);
                if (arr.length >= 2) return arr[1];
                if (arr.length === 1) return arr[0];
            }catch(e){
                // fallback: try to find the second known emoji
                const known = Array.from(t.matchAll(/[🎁🌹🍫☕✨🎂🧴🎮📷👑💎🛸🐉🍭]/g)).map(m => m[0]);
                if (known.length >= 2) return known[1];
                if (known.length === 1) return known[0];
            }
            return '🎁';
        }

                function getGiftMetaByAny(opts = {}){
            const key = opts.giftKey || opts.gift_key || opts.key || null;
            const emoji = String(opts.emoji || opts.gift_emoji || '');
            const name = String(opts.name || opts.gift_name || '');
            if (key && GIFTS_STORE[key]) return { key, gift: GIFTS_STORE[key] };
            const byEmoji = Object.keys(GIFTS_STORE).find(k => String(GIFTS_STORE[k]?.emoji || '') === emoji);
            if (byEmoji) return { key: byEmoji, gift: GIFTS_STORE[byEmoji] };
            const byName = Object.keys(GIFTS_STORE).find(k => name && String(GIFTS_STORE[k]?.name || '').toLowerCase() === name.toLowerCase());
            if (byName) return { key: byName, gift: GIFTS_STORE[byName] };
            return null;
        }

        function showGiftToast(opts = {}){
            const toast = document.getElementById('gift-toast');
            if (!toast) return;

            const meta = getGiftMetaByAny(opts) || null;
            const g = meta ? meta.gift : null;

            const emoji = String((opts.emoji || (g && g.emoji)) || '🎁');
            const title = String(opts.title || 'Подарок');
            const text  = String(opts.text || (g && g.desc) || '');
            const duration = (opts.duration === 0) ? 0 : (Number(opts.duration) || 2600);

            const card = toast.querySelector('.gift-toast-card');
            const preview = document.getElementById('gift-toast-preview');
            if (card && g && g.grad) {
                try{ card.style.background = `radial-gradient(circle at 18% 12%, var(--fx-overlay-1), transparent 58%), radial-gradient(circle at 82% 88%, var(--fx-overlay-2), transparent 62%), ${g.grad}`; }catch(e){}
            } else if (card) {
                try{ card.style.background = ''; }catch(e){}
            }
            if (preview && g && g.grad) {
                try{ preview.style.background = g.grad; }catch(e){}
            } else if (preview) {
                try{ preview.style.background = ''; }catch(e){}
            }

            const eEl = document.getElementById('gift-toast-emoji');
            const tEl = document.getElementById('gift-toast-title');
            const xEl = document.getElementById('gift-toast-text');
            if (eEl) eEl.textContent = emoji;
            if (tEl) tEl.textContent = title;
            if (xEl) xEl.textContent = text;

            toast.classList.remove('fx-dragon');
            if (meta && meta.key === 'dragon') toast.classList.add('fx-dragon');
            toast.classList.remove('hidden');
            requestAnimationFrame(() => {
                try{ toast.classList.add('show'); }catch(e){}
            });

            toast.onclick = () => hideGiftToast();
            if (giftToastTimer) { clearTimeout(giftToastTimer); giftToastTimer = null; }
            if (duration > 0) {
                giftToastTimer = setTimeout(() => hideGiftToast(), duration);
            }
	        }

        // ESC closes gift toast
        document.addEventListener('keydown', (e) => {
            try{
                if (e && (e.key === 'Escape' || e.key === 'Esc')) hideGiftToast();
            }catch(err){}
        });


        function getDeviceFingerprint(){
            try {
                let id = localStorage.getItem('vox_device_fp');
                if (!id) {
                    id = 'dv:' + Math.random().toString(36).slice(2) + ':' + Date.now().toString(36);
                    localStorage.setItem('vox_device_fp', id);
                }
                return id;
            } catch(e) {
                return 'dv:fallback';
            }
        }

        let __presenceTimer = null;
        async function pingPresence(state){
            if (!currentUser || !currentUser.id) return;
            try{
                const res = await apiRequest('presence_ping', { presence_state: state || (document.hidden ? 'background' : 'active') }, false, { silent:true });
                if (res && res.success && res.user_presence) {
                    currentUser.presence = res.user_presence;
                }
            }catch(e){}
        }
        function startPresenceHeartbeat(){
            if (__presenceTimer) clearInterval(__presenceTimer);
            pingPresence(document.hidden ? 'background' : 'active');
            __presenceTimer = setInterval(() => pingPresence(document.hidden ? 'background' : 'active'), 25000);
        }
        function stopPresenceHeartbeat(){
            if (__presenceTimer) clearInterval(__presenceTimer);
            __presenceTimer = null;
        }
        document.addEventListener('visibilitychange', () => { if (currentUser && currentUser.id) pingPresence(document.hidden ? 'background' : 'active'); });
        window.addEventListener('focus', () => { if (currentUser && currentUser.id) pingPresence('active'); });

        // options.silent=true -> не показывать модалку при сетевых ошибках (для фонового поллинга)
        async function apiRequest(action, data = {}, isForm = false, options = {}) {
            const silent = !!(options && options.silent);
            const url = '/api';

            // Mark requests as AJAX/JSON so the firewall returns JSON (and doesn't false-positive so easily)
            const headers = {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            };
            if (!isForm) {
                headers['Content-Type'] = 'application/x-www-form-urlencoded';
                data = new URLSearchParams({ action, device_fingerprint: getDeviceFingerprint(), ...data }).toString();
            } else {
                // Ensure action exists in FormData
                try{
                    if (data instanceof FormData) {
                        if (!data.has('action')) data.append('action', action);
                    }
                }catch(e){}
            }

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: isForm ? data : new URLSearchParams(data)
                });

                const ct = (response.headers.get('content-type') || '').toLowerCase();
                let payload = null;
                let text = '';

                if (ct.includes('application/json')) {
                    try { payload = await response.json(); } catch(e) { payload = null; }
                }
                if (!payload) {
                    try { text = await response.text(); } catch(e) { text = ''; }
                }

                if (!response.ok) {
                    // Prefer structured JSON errors from backend/firewall
                    if (payload && typeof payload === 'object') {
                        // App-level block message
                        if (payload.success === false && (payload.blocked || (payload.error && String(payload.error).includes('заблокирован')))) {
                            showModal('Блокировка', payload.error, false, () => { try{ document.getElementById('custom-modal').classList.add('hidden'); }catch(e){} if (currentUser && currentUser.id) logout(); });
                            return { success: false, error: payload.error, blocked: true };
                        }
                        return payload;
                    }
                    const msg = (text && String(text).trim()) ? String(text).trim() : ('HTTP ' + response.status);
                    return { success: false, error: msg, http_status: response.status };
                }

                if (payload && typeof payload === 'object') {
                    // App-level block message
                    if (payload.success === false && (payload.blocked || (payload.error && String(payload.error).includes('заблокирован')))) {
                        showModal('Блокировка', payload.error, false, () => { try{ document.getElementById('custom-modal').classList.add('hidden'); }catch(e){} if (currentUser && currentUser.id) logout(); });
                        return { success: false, error: payload.error, blocked: true };
                    }
                    return payload;
                }

                // If server replied non-JSON (unexpected)
                const msg = (text && String(text).trim()) ? String(text).trim() : 'Неверный ответ сервера';
                return { success: false, error: msg };

            } catch (error) {
                console.error('API Request Error:', error);

                // AbortError often happens during navigation / fast polling — don't scare the user
                const isAbort = (error && (error.name === 'AbortError' || String(error.message || '').toLowerCase().includes('aborted')));
                if (!silent && !isAbort) {
                    showModal('Ошибка сети или сервера', error.message || 'Произошла ошибка при обращении к серверу.');
                }
                return { success: false, error: error.message };
            }
        }


        // Upload-progress helper (for banner upload on mobile/slow connections)
        function apiRequestWithProgress(formData, onProgress){
            return new Promise((resolve) => {
                try{
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', 'index.php', true);
                    try{ xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); }catch(e){}
                    try{ xhr.setRequestHeader('Accept', 'application/json'); }catch(e){}
                    xhr.responseType = 'text';

                    xhr.onload = () => {
                        const text = xhr.responseText || '';
                        try{
                            const json = JSON.parse(text);
                            resolve(json);
                        }catch(e){
                            resolve({ success:false, error:'Некорректный ответ сервера' });
                        }
                    };
                    xhr.onerror = () => resolve({ success:false, error:'Ошибка сети' });
                    if (xhr.upload && typeof onProgress === 'function'){
                        xhr.upload.onprogress = (evt) => {
                            try{
                                if (evt && evt.lengthComputable){
                                    onProgress(evt.loaded, evt.total);
                                } else {
                                    onProgress(evt.loaded, null);
                                }
                            }catch(e){}
                        };
                    }
                    try{ if (formData && !formData.has('device_fingerprint')) formData.append('device_fingerprint', getDeviceFingerprint()); }catch(e){}
                    xhr.send(formData);
                }catch(e){
                    console.error('apiRequestWithProgress error', e);
                    resolve({ success:false, error: e.message || 'Ошибка' });
                }
            });
        }

        function changeTheme(theme) {
            localStorage.setItem('vox_theme', theme);
            applyTheme(theme);
        }

        function applyTheme(theme) {
            const root = document.documentElement;
            const allowed = new Set(['default','nebula','dark','blue','oled','rose','emerald','purple','sunset']);
            const t = allowed.has(theme) ? theme : 'default';

            root.classList.remove('theme-default','theme-nebula','theme-dark','theme-blue','theme-oled','theme-rose','theme-emerald','theme-purple','theme-sunset');
            root.classList.add(`theme-${t}`);

            // Keep gift FX vars in sync with selected theme (when no exclusive effect is active)
            try{ syncFxVarsToTheme(); }catch(e){}
        }

        // Privacy settings (who can message / gift)
        let privacySaveTimer = null;
        function setPrivacyStatus(text, isError = false){
            const el = document.getElementById('privacy-save-status');
            if (!el) return;
            el.textContent = text || '';
            el.classList.toggle('text-red-400', !!isError);
            el.classList.toggle('text-slate-400', !isError);
            if (privacySaveTimer) clearTimeout(privacySaveTimer);
            if (text) {
                privacySaveTimer = setTimeout(() => {
                    try { el.textContent = ''; } catch(e) {}
                }, 1800);
            }
        }

        async function onPrivacySettingChange(){
            const mSel = document.getElementById('privacy-messages');
            const gSel = document.getElementById('privacy-gifts');
            if (!mSel || !gSel) return;
            const messages_from = String(mSel.value || 'everyone');
            const gifts_from = String(gSel.value || 'everyone');
            setPrivacyStatus('Сохранение…');
            const res = await apiRequest('set_privacy_settings', { messages_from, gifts_from });
            if (res && res.success) {
                if (!currentUser) currentUser = {};
                currentUser.privacy = res.privacy || { messages_from, gifts_from };
                setPrivacyStatus('Сохранено');
            } else {
                setPrivacyStatus((res && res.error) ? res.error : 'Не удалось сохранить', true);
            }
        }

        // Click handler for pretty segmented privacy controls
        function setPrivacyChoice(kind, value){
            const id = (kind === 'messages') ? 'privacy-messages' : 'privacy-gifts';
            const el = document.getElementById(id);
            if (!el) return;
            el.value = String(value || 'everyone');

            const seg = document.querySelector(`.privacy-segment[data-kind="${kind}"]`);
            if (seg) {
                seg.querySelectorAll('.seg-btn').forEach(btn => {
                    btn.classList.toggle('is-active', String(btn.dataset.value) === String(value));
                });
            }
            onPrivacySettingChange();
        }

        /* =========================================================
           Premium iOS design controls (saved in localStorage)
           - vox_ui_radius: number (px)
           - vox_ui_blur: number (px)
           - vox_ui_glass: number (percent 4..18)
           ========================================================= */
        function applyDesignSettings() {
            const root = document.documentElement;

            const radius = Number(localStorage.getItem('vox_ui_radius')) || 22;
            const blur = Number(localStorage.getItem('vox_ui_blur')) || 34;
            const glassPct = Number(localStorage.getItem('vox_ui_glass')) || 7;

            const safeRadius = Math.max(10, Math.min(44, radius));
            const safeBlur = Math.max(0, Math.min(80, blur));
            const safePct = Math.max(2, Math.min(24, glassPct));
            const a = +(safePct / 100).toFixed(2);

            // Colors are computed once and then pushed into CSS variables.
            const glassBg = `rgba(255,255,255,${a})`;
            const glassBg2 = `rgba(255,255,255,${Math.min(a + 0.03, 0.22).toFixed(2)})`;
            const glassBorder = `rgba(255,255,255,${Math.min(a + 0.09, 0.30).toFixed(2)})`;
            const glassBorderStrong = `rgba(255,255,255,${Math.min(a + 0.15, 0.38).toFixed(2)})`;
            const inputBg = `rgba(255,255,255,${Math.min(a + 0.02, 0.18).toFixed(2)})`;

            root.style.setProperty('--ui-radius', `${safeRadius}px`);
            root.style.setProperty('--ui-radius-lg', `${Math.round(safeRadius * 1.25)}px`);
            root.style.setProperty('--ui-radius-sm', `${Math.max(12, Math.round(safeRadius * 0.72))}px`);
            root.style.setProperty('--ui-radius-bubble', `${Math.round(safeRadius * 1.0)}px`);
            root.style.setProperty('--ui-blur', `${safeBlur}px`);
            root.style.setProperty('--glass-bg', glassBg);
            root.style.setProperty('--glass-bg-2', glassBg2);
            root.style.setProperty('--glass-border', glassBorder);
            root.style.setProperty('--glass-border-strong', glassBorderStrong);
            root.style.setProperty('--input-bg', inputBg);
            root.style.setProperty('--input-border', glassBorder);

            // Live labels in Settings (if the screen is open)
            const rv = document.getElementById('ui-radius-value');
            if (rv) rv.textContent = `${safeRadius}px`;
            const bv = document.getElementById('ui-blur-value');
            if (bv) bv.textContent = `${safeBlur}px`;
            const gv = document.getElementById('ui-glass-value');
            if (gv) gv.textContent = `${safePct}%`;
        }


// Энергосберегающий режим (меньше blur/анимаций)
function applyPowerSaveMode(){
    const enabled = localStorage.getItem('vox_power_save') === '1';
    document.body.classList.toggle('power-save', enabled);
    try{ document.body.setAttribute('data-power-save', enabled ? '1' : '0'); }catch(e){}
}

function setPowerSave(enabled){
    localStorage.setItem('vox_power_save', enabled ? '1' : '0');
    applyPowerSaveMode();
    applyMobileLiteMode();
    renderCurrentScreen();
}



// Режим для слабых устройств (максимально упрощает эффекты/blur/анимации)
function applyLowSpecMode(){
    const enabled = localStorage.getItem('vox_low_spec') === '1';
    document.body.classList.toggle('low-spec', enabled);
    try{ document.body.setAttribute('data-low-spec', enabled ? '1' : '0'); }catch(e){}
}

function setLowSpec(enabled){
    localStorage.setItem('vox_low_spec', enabled ? '1' : '0');
    applyLowSpecMode();
    applyMobileLiteMode();
    renderCurrentScreen();

            // Polling rates (optimize for mobile/low-spec)
            try{
                const lowSpecEnabled = localStorage.getItem('vox_low_spec') === '1';
                const isMobile = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
                if (lowSpecEnabled || isMobile){
                    chatPollRate = 3500;
                    notificationsPollRate = 9000;
                }
            }catch(e){}

}

let __fxPreloadPromise = null;
let __scrollFxTimer = null;

async function preloadEffectsPackage(force = false){
    try{
        if (!force && hasPackageInstalled('effects')) return true;
        if (__fxPreloadPromise) return __fxPreloadPromise;
        __fxPreloadPromise = (async () => {
            try{ await downloadPackage('effects', true); return true; }
            catch(e){ return false; }
            finally{ __fxPreloadPromise = null; }
        })();
        return await __fxPreloadPromise;
    }catch(e){ return false; }
}

function installScrollPerfGuards(){
    const onScrollLike = () => {
        try{
            document.body.classList.add('fx-scroll-optimizing');
            if (__scrollFxTimer) clearTimeout(__scrollFxTimer);
            __scrollFxTimer = setTimeout(() => {
                try{ document.body.classList.remove('fx-scroll-optimizing'); }catch(e){}
            }, 140);
        }catch(e){}
    };
    ['scroll','touchmove','wheel'].forEach(evt => window.addEventListener(evt, onScrollLike, { passive: true }));
}

async function warmEffectAssetsOnBoot(){
    try{
        installScrollPerfGuards();
        const run = () => preloadEffectsPackage(false);
        if ('requestIdleCallback' in window) requestIdleCallback(run, { timeout: 1200 });
        else setTimeout(run, 500);
    }catch(e){}
}

async function downloadPackage(kind, silent = false){
    const assets = [];
    if (kind === 'effects'){
        // preload icons/effects assets (local files only)
        assets.push('/default.png','/default-avatar.png','/bot_avatar.png');
    } else if (kind === 'gifts3d') {
        assets.push('/default.png','/default-avatar.png');
    } else {
        // core libs
        assets.push('/qrcode.min.js','/jsQR.js','/qrcodejs.LICENSE.txt','/default.png','/default-avatar.png','/bot_avatar.png');
    }

    // Cache API works in modern browsers + many Android WebView,
    // but some environments (older WebView / restricted browsers) don't support it.
    // Fallback: warm up the regular HTTP cache via fetch() and remember a marker in localStorage.
    try{
        if ('caches' in window && typeof caches.open === 'function'){
            const cache = await caches.open('vox-packages-v1');
            await cache.addAll(assets.map(a => a));
            localStorage.setItem('vox_pkg_'+kind, String(Date.now()));
            if (!silent) showModal('Готово', `Пакет "${kind}" скачан. Загружено файлов: ${assets.length}`);
            try{ refreshGift3dControls(); }catch(e){}
            return;
        }

        // Fallback (no Cache API): prefetch to browser cache
        const results = [];
        for (const url of assets){
            try{
                const res = await fetch(url, { cache: 'force-cache' });
                // Some servers block opaque caching; still counts as warmed if fetched
                if (res && (res.ok || res.type === 'opaque')) results.push(url);
            }catch(e){}
        }
        localStorage.setItem('vox_pkg_'+kind, String(Date.now()));
        if (!silent) showModal('Готово', `Пакет "${kind}" скачан. Загружено файлов: ${results.length}/${assets.length}. (Совместимый режим)`);
        try{ refreshGift3dControls(); }catch(e){}
    }catch(e){
        console.error(e);
        showModal('Ошибка', 'Не удалось скачать пакет (возможно, оффлайн или блокировка кеша)');
    }
}

async function clearPackagesCache(){
    try{
        // Clear Cache API cache if possible
        if ('caches' in window){
            try{ await caches.delete('vox-packages-v1'); }catch(e){}
        }
        // Clear fallback markers
        try{
            Object.keys(localStorage || {}).forEach(k => {
                if (String(k).startsWith('vox_pkg_')) localStorage.removeItem(k);
            });
        }catch(e){}
        showModal('Готово', 'Кэш пакетов очищен');
    }catch(e){
        showModal('Ошибка', 'Не удалось очистить кэш');
    }
}



        function setUiRadius(value) {
            localStorage.setItem('vox_ui_radius', String(value));
            applyDesignSettings();
        }

        function setUiBlur(value) {
            localStorage.setItem('vox_ui_blur', String(value));
            applyDesignSettings();
        }

        function setUiGlass(value) {
            localStorage.setItem('vox_ui_glass', String(value));
            applyDesignSettings();
        }

        function resetDesignSettings() {
            localStorage.removeItem('vox_ui_radius');
            localStorage.removeItem('vox_ui_blur');
            localStorage.removeItem('vox_ui_glass');
            applyDesignSettings();
            // Re-render settings so sliders jump back to defaults
            try { renderSettingsView(); } catch (e) {}
        }

        // ФУНКЦИИ ДЛЯ БЛОКИРОВКИ ПОЛЬЗОВАТЕЛЕЙ

        async function blockUser(targetUserId, targetUserName) {
            const reason = prompt(`Введите причину блокировки пользователя ${targetUserName}:`, 'Нарушение правил');
            
            if (reason === null) return;
            
            if (!reason.trim()) {
                showModal('Ошибка', 'Необходимо указать причину блокировки.');
                return;
            }
            
            const result = await apiRequest('block_user', {
                target_user_id: targetUserId,
                reason: reason.trim()
            });
            
            if (result.success) {
                try {
                    const bannerPrev = document.getElementById('banner-preview');
                    const bannerPr = document.getElementById('banner-upload-progress');
                    const bannerBar = document.getElementById('banner-upload-progress-bar');
                    const bannerSt = document.getElementById('banner-upload-status');
                    if (bannerPrev) bannerPrev.classList.remove('is-uploading');
                    if (bannerPr) bannerPr.classList.add('hidden');
                    if (bannerBar) bannerBar.style.width = '0%';
                    if (bannerSt) bannerSt.classList.add('hidden');
                } catch(e) {}
                const bInp = document.getElementById('banner-upload');
                if (bInp) bInp.value = '';
                hideCaptcha();
                showModal('Успех', `Пользователь ${targetUserName} заблокирован.`, false, () => {
                    // Обновляем интерфейс при необходимости
                });
            } else {
                showModal('Ошибка', result.error || 'Не удалось заблокировать пользователя.');
            }
        }

        async function unblockUser(targetUserId, targetUserName) {
            showModal(
                'Разблокировать пользователя?',
                `Вы уверены, что хотите разблокировать пользователя <strong>${targetUserName}</strong>?`,
                true,
                async () => {
                    const result = await apiRequest('unblock_user', {
                        target_user_id: targetUserId
                    });
                    
                    if (result.success) {
                hideCaptcha();
                        showModal('Успех', `Пользователь ${targetUserName} разблокирован.`, false, () => {
                            // Обновляем интерфейс при необходимости
                        });
                    } else {
                        showModal('Ошибка', result.error || 'Не удалось разблокировать пользователя.');
                    }
                }
            );
        }

        async function showBlockedUsers() {
            const result = await apiRequest('get_blocked_users');
            
            if (result.success) {
                hideCaptcha();
                const modal = document.getElementById('custom-modal');
                document.getElementById('modal-title').textContent = 'Заблокированные пользователи';
                
                let blockedUsersHtml = '';
                if (result.blocked_users.length > 0) {
                    blockedUsersHtml = result.blocked_users.map(user => {
                        const dispName = escapeHtml(user.name || '');
                        const dispUsername = escapeHtml(user.username || '');
                        const dispReason = escapeHtml(user.block_reason || '');
                        const dispBy = escapeHtml(user.blocked_by || '');
                        const dispAt = escapeHtml(user.blocked_at_formatted || '');
                        const avatar = escapeHtml(user.avatar || '/default.png');
                        const safeId = String(user.id || '').replace(/'/g, "\\'");
                        const safeNameJs = String(user.name || '').replace(/\\/g, "\\\\").replace(/'/g, "\\'");
                        return `
                            <div class="member-item">
                                <div class="admin-user-meta">
                                    <img src="${avatar}" alt="Аватар" class="w-10 h-10 rounded-full mr-3" loading="lazy" referrerpolicy="no-referrer">
                                    <div>
                                        <p class="font-semibold">${dispName}</p>
                                        <p class="text-sm text-slate-400">@${dispUsername}</p>
                                        <p class="text-xs text-red-400">Причина: ${dispReason}</p>
                                        <p class="text-xs text-slate-500">Заблокировал: ${dispBy} • ${dispAt}</p>
                                    </div>
                                </div>
                                <button class="primary-button bg-green-600 hover:bg-green-700 text-sm px-3 py-1" 
                                        onclick="unblockUser('${safeId}', '${safeNameJs}')">
                                    Разблокировать
                                </button>
                            </div>
                        `;
                    }).join('');
                } else {
                    blockedUsersHtml = '<p class="text-slate-400 text-center py-4">Нет заблокированных пользователей.</p>';
                }
                
                
                document.getElementById('modal-message').innerHTML = `
                    <div class="max-h-96 overflow-y-auto">
                        ${blockedUsersHtml}
                    </div>
                `;
                
                document.getElementById('modal-ok-button').classList.remove('hidden');
                document.getElementById('modal-confirm-buttons').classList.add('hidden');
                document.getElementById('modal-ok-button').onclick = () => {
                    modal.classList.add('hidden');
                };
                
                modal.classList.remove('hidden');
            } else {
                showModal('Ошибка', result.error || 'Не удалось загрузить список заблокированных пользователей.');
            }
        }

        // ФУНКЦИИ ДЛЯ РАБОЧИХ ССЫЛОК

        function createInviteLink(type, username) {
            const baseUrl = window.location.origin + window.location.pathname;
            return `${baseUrl}?join=${type}:${username}`;
        }

        function copyJoinLink(username, type) {
            const joinUrl = createInviteLink(type, username);
            
            navigator.clipboard.writeText(joinUrl).then(() => {
                showModal('Ссылка скопирована!', `Ссылка для присоединения скопирована в буфер обмена: ${joinUrl}`, false);
            }).catch(() => {
                showModal('Ошибка', 'Не удалось скопировать ссылку.');
            });
        }

        function handleJoinLinks() {
            const urlParams = new URLSearchParams(window.location.search);
            const joinParam = urlParams.get('join');
            
            if (joinParam) {
                const [type, username] = joinParam.split(':');
                if (type && username) {
                    showModal('Присоединение к сообществу', `Вы хотите присоединиться к сообществу @${username}?`, true, () => {
                        joinCommunityByUsername(username);
                        // Очищаем URL параметры
                        const newUrl = window.location.pathname;
                        window.history.replaceState({}, document.title, newUrl);
                    });
                }
            }
        }

        // Функции для новостей
        function renderNewsView() {
            const html = `
                <div id="news_view" class="p-4 flex flex-col h-full">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="section-title">Новости</h2>
                        ${currentUser.is_moderator ? `
                            <button onclick="showCreateNewsModal()" class="primary-button text-sm">
                                📝 Выложить новость
                            </button>
                        ` : ''}
                    </div>
                    
                    <div id="news-list" class="space-y-4 flex-grow overflow-y-auto">
                        <p class="text-slate-400 text-center py-8">Загрузка новостей...</p>
                    </div>
                </div>
            `;
            document.getElementById('screen-container').innerHTML = `<div id="news_screen_content" class="screen-content">${html}</div>`;
            
            // Загружаем новости
            fetchNews();
        }

        function showCreateNewsModal() {
            const modal = document.getElementById('custom-modal');
            document.getElementById('modal-title').textContent = 'Создать новость';
            document.getElementById('modal-message').innerHTML = `
                <div class="space-y-3">
                    <input type="text" id="news-title" placeholder="Заголовок новости" class="input-field" maxlength="100">
                    <textarea id="news-content" placeholder="Содержание новости" class="input-field h-32 resize-none" maxlength="1000"></textarea>
                </div>
            `;

            const ipCb = document.getElementById('ban-by-ip');
            const devCb = document.getElementById('ban-by-device');
            if (mode === 'ip') { if (ipCb) ipCb.checked = true; if (devCb) devCb.checked = false; }
            else if (mode === 'device') { if (ipCb) ipCb.checked = false; if (devCb) devCb.checked = true; }
            else { if (ipCb) ipCb.checked = true; if (devCb) devCb.checked = true; }
            ['ban-by-ip','ban-by-device'].forEach(id => { const el = document.getElementById(id); if (el) el.addEventListener('change', () => { const wrap = el.closest('.admin-scope-card'); if (wrap) wrap.classList.toggle('active', el.checked); }); const wrap = el && el.closest('.admin-scope-card'); if (wrap && el) wrap.classList.toggle('active', el.checked); });
            document.getElementById('modal-ok-button').classList.add('hidden');
            document.getElementById('modal-confirm-buttons').classList.remove('hidden');
            
            document.getElementById('modal-confirm-button').textContent = 'Опубликовать';
            document.getElementById('modal-confirm-button').onclick = () => {
                const title = document.getElementById('news-title').value.trim();
                const content = document.getElementById('news-content').value.trim();
                
                if (title.length < 2) {
                    showModal('Ошибка', 'Заголовок новости должен содержать минимум 2 символа.');
                    return;
                }
                
                if (content.length < 5) {
                    showModal('Ошибка', 'Содержание новости должно содержать минимум 5 символов.');
                    return;
                }
                
                modal.classList.add('hidden');
                createNews(title, content);
            };
            
            document.getElementById('modal-cancel-button').onclick = () => {
                modal.classList.add('hidden');
            };

            modal.classList.remove('hidden');
        }

        async function createNews(title, content) {
            const result = await apiRequest('create_news', { title, content });
            
            if (result.success) {
                hideCaptcha();
                showModal('Успех!', 'Новость успешно опубликована!', false, () => {
                    fetchNews();
                    switchScreen('news');
                });
            } else {
                showModal('Ошибка', result.error || 'Не удалось создать новость.');
            }
        }

        async function fetchNews() {
            const result = await apiRequest('get_news');
            if (result.success) {
                hideCaptcha();
                news = result.news;
                renderNewsList();
            } else {
                console.error('Ошибка загрузки новостей:', result.error);
            }
        }

        function renderNewsList() {
            const newsList = document.getElementById('news-list');
            if (!newsList) return;

            if (news.length === 0) {
                newsList.innerHTML = '<p class="text-slate-400 text-center py-8">Новостей пока нет.</p>';
                return;
            }

            const newsHtml = news.map(newsItem => {
                const date = new Date(newsItem.created_at * 1000).toLocaleString();
                
                return `
                    <div class="news-item">
                        <div class="news-header">
                            <div class="news-author">
                                <img src="${newsItem.author_avatar}" alt="Аватар" class="w-10 h-10 rounded-full mr-3">
                                <div>
                                    <h3 class="font-bold">${newsItem.author_name}</h3>
                                    <p class="text-sm text-slate-400">${date}</p>
                                </div>
                            </div>
                            ${currentUser.is_moderator ? `
                                <button onclick="confirmDeleteNews('${newsItem.id}', '${newsItem.title.replace(/'/g, "\\'")}')" class="text-red-500 hover:text-red-400 transition-colors">
                                    🗑️
                                </button>
                            ` : ''}
                        </div>
                        
                        <h4 class="text-xl font-bold mb-3 gradient-text">${newsItem.title}</h4>
                        
                        <div class="news-content">
                            ${newsItem.content.replace(/\n/g, '<br>')}
                        </div>
                        
                        <div class="news-footer">
                            <span>📰 Новость</span>
                        </div>
                    </div>
                `;
            }).join('');

            newsList.innerHTML = newsHtml;
        }

        function confirmDeleteNews(newsId, newsTitle) {
            showModal(
                'Удалить новость?',
                `Вы уверены, что хотите удалить новость "<strong>${newsTitle}</strong>"?`,
                true,
                () => deleteNews(newsId)
            );
        }

        async function deleteNews(newsId) {
            const result = await apiRequest('delete_news', { news_id: newsId });
            
            if (result.success) {
                hideCaptcha();
                showModal('Успех', 'Новость удалена.', false, () => {
                    fetchNews();
                });
            } else {
                showModal('Ошибка', result.error || 'Не удалось удалить новость.');
            }
        }

        async function checkUsername() {
            const username = document.getElementById('username').value.toLowerCase().trim();
            const password = document.getElementById('password').value;
            const button = document.getElementById('auth-button');
            const messageEl = document.getElementById('auth-message');
        
            // Очищаем предыдущее сообщение
            messageEl.textContent = '';
            messageEl.classList.remove('text-green-400', 'text-red-400');
        
            if (username.length < 3 || password.length < 6) {
                messageEl.textContent = 'Логин (3+ символов) и пароль (6+ символов) обязательны.';
                messageEl.classList.add('text-red-400');
                return;
            }
        
            const originalText = button.innerHTML;
            button.disabled = true;
            button.innerHTML = '<span class="loading-circle bg-white-accent"></span> Проверка...';
        
            const result = await apiRequest('check_username', { username });
        
            if (result.success) {
                hideCaptcha();
                if (result.exists) {
                    messageEl.textContent = `Пользователь @${username} найден. Нажмите, чтобы войти.`;
                    messageEl.classList.add('text-green-400');
                    button.innerHTML = 'Войти';
                    loginStage = 'login';
                    try { updateAuthStageUI(loginStage); } catch(e) {}
                } else {
                    messageEl.textContent = `Пользователь @${username} не найден. Нажмите, чтобы зарегистрироваться.`;
                    messageEl.classList.add('text-green-400');
                    button.innerHTML = 'Зарегистрироваться';
                    loginStage = 'register';
                    try { updateAuthStageUI(loginStage); } catch(e) {}
                }
            } else {
                messageEl.textContent = result.error || 'Произошла ошибка при проверке логина.';
                messageEl.classList.add('text-red-400');
                button.innerHTML = originalText;
            }
        
            button.disabled = false;
            
            // Прокручиваем сообщение в видимую область (для мобильных)
            setTimeout(() => {
                messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }

        async function registerLogin() {
            const username = document.getElementById('username').value.toLowerCase().trim();
            const password = document.getElementById('password').value;
            const button = document.getElementById('auth-button');

            if (username.length < 3 || password.length < 6) {
                document.getElementById('auth-message').textContent = 'Логин (3+ символов) и пароль (6+ символов) обязательны.';
                return;
            }

            // Доп. шаг только для регистрации: подтверждение пароля (логика API не меняется)
            if (loginStage === 'register') {
                const confirmEl = document.getElementById('password-confirm');
                const confirmPwd = (confirmEl && confirmEl.value) ? confirmEl.value : '';
                const msg = document.getElementById('auth-message');

                // Очистка цвета, если было
                msg.classList.remove('text-green-400', 'text-red-400');

                if (!confirmPwd) {
                    msg.textContent = 'Подтвердите пароль для регистрации.';
                    msg.classList.add('text-red-400');
                    return;
                }
                if (confirmPwd !== password) {
                    msg.textContent = 'Пароли не совпадают. Проверьте и попробуйте снова.';
                    msg.classList.add('text-red-400');
                    return;
                }
            }


            const originalText = button.innerHTML;
            button.disabled = true;
            button.innerHTML = '<span class="loading-circle bg-white-accent"></span> Вход...';

            const captcha_token = (document.getElementById('captcha-token')||{}).value || '';
            const captcha_answer = (document.getElementById('captcha-answer')||{}).value || '';
            const result = await apiRequest('register_login', { username, password, captcha_token, captcha_answer });

            if (result.success) {
                hideCaptcha();
                if (result.status === 'login') {
                    showModal('Добро пожаловать!', `С возвращением, ${result.name}!`, false, () => {
                        checkAuthAndRoute();
                    });
                } else if (result.status === 'register_new') {
                    showModal('Добро пожаловать!', `Аккаунт @${username} успешно зарегистрирован. Пожалуйста, завершите настройку профиля.`, false, () => {
                        checkAuthAndRoute();
                    });
                }
            } else {
                if (result && result.captcha_required) {
                    showCaptcha(result.captcha_question, result.captcha_token);
                    const msg = document.getElementById('auth-message');
                    if (msg) { msg.textContent = result.error || 'Введите капчу.'; msg.classList.add('text-red-400'); }
                    button.innerHTML = originalText;
                    button.disabled = false;
                    return;
                }
                showModal('Ошибка', result.error || 'Не удалось войти/зарегистрироваться.');
                button.innerHTML = originalText;
                button.disabled = false;
            }
        }

                

// ==================== CAPTCHA UI ====================
function showCaptcha(question, token) {
    const wrap = document.getElementById('captcha-wrap');
    const q = document.getElementById('captcha-question');
    const t = document.getElementById('captcha-token');
    const a = document.getElementById('captcha-answer');
    if (!wrap || !q || !t || !a) return;
    wrap.style.display = 'block';
    q.textContent = question || 'Подтвердите, что вы не робот';
    t.value = token || '';
    a.value = '';
    setTimeout(() => { try { a.focus(); } catch(e) {} }, 50);
}

function hideCaptcha() {
    const wrap = document.getElementById('captcha-wrap');
    const t = document.getElementById('captcha-token');
    const a = document.getElementById('captcha-answer');
    if (wrap) wrap.style.display = 'none';
    if (t) t.value = '';
    if (a) a.value = '';
}

async function refreshCaptcha() {
    const res = await apiRequest('get_captcha', {});
    if (res && res.success) {
        showCaptcha(res.question, res.token);
    } else {
        showModal('Ошибка', res.error || 'Не удалось получить капчу.');
    }
}

function renderWelcomeScreen() {
            const html = `
                <div id="welcome_view" class="auth-shell" data-stage="loading">
                    <div class="auth-bg" aria-hidden="true">
                        <div class="auth-orb auth-orb--a"></div>
                        <div class="auth-orb auth-orb--b"></div>
                        <div class="auth-orb auth-orb--c"></div>
                    </div>

                    <div class="auth-card">
                        <!-- Desktop only: left hero panel -->
                        <div class="auth-hero" aria-hidden="true">
                            <div class="auth-hero__inner">
                                <div class="auth-hero__mark">S</div>
                                <div class="auth-hero__name">Super Chat</div>
                                <div class="auth-hero__desc">Мессенджер в стиле Telegram: быстро, чисто, без лишнего шума.</div>

                                <div class="auth-hero__bubble">
                                    <div class="auth-hero__bubble__in">Привет 👋</div>
                                    <div class="auth-hero__bubble__out">Давай начнём</div>
                                </div>
                            </div>
                        </div>

                        <!-- Form -->
                        <div class="auth-body">
                            <div class="auth-logo" aria-label="Super Chat">
                                <div class="auth-logo__mark" aria-hidden="true">S</div>
                            </div>

                            <div class="auth-title">
                                <h1 class="auth-title__name">Super Chat</h1>
                                <p class="auth-title__sub" id="auth-subtitle">Вход или регистрация — без лишних шагов</p>
                            </div>

                            <div class="auth-form">
                                <label class="auth-field">
                                    <span class="auth-field__label">Логин</span>
                                    <div class="auth-field__control">
                                        <span class="auth-field__prefix">@</span>
                                        <input type="text" id="username" placeholder="username" class="auth-input" autocomplete="off" autocapitalize="none" spellcheck="false">
                                    </div>
                                </label>

                                <label class="auth-field">
                                    <span class="auth-field__label">Пароль</span>
                                    <div class="auth-field__control auth-field__control--pwd">
                                        <input type="password" id="password" placeholder="••••••••" class="auth-input" autocomplete="current-password">
                                        <button type="button" class="pwd-toggle" id="password-toggle" aria-label="Показать пароль" title="Показать пароль">
                                            <span class="pwd-toggle-icon" aria-hidden="true"></span>
                                        </button>
                                    </div>
                                </label>

                                <!-- Extra only for registration (без ломания логики: backend не трогаем) -->
                                <label class="auth-field auth-only-register">
                                    <span class="auth-field__label">Подтвердите пароль</span>
                                    <div class="auth-field__control">
                                        <input type="password" id="password-confirm" placeholder="••••••••" class="auth-input" autocomplete="new-password">
                                    </div>
                                </label>

                                <div class="auth-register-box auth-only-register">
                                    <div class="auth-register-box__icon">✨</div>
                                    <div class="auth-register-box__text">
                                        <div class="auth-register-box__title">Регистрация</div>
                                        <div class="auth-register-box__sub">После регистрации вы сможете выбрать имя и аватар.</div>
                                    </div>
                                </div>

                                <p id="auth-message" class="auth-hint" aria-live="polite"></p>

                                <div id="captcha-wrap" class="auth-field" style="display:none;">
                                    <span class="auth-field__label">Проверка безопасности</span>
                                    <div class="auth-field__control" style="gap:10px; display:flex; align-items:center;">
                                        <div style="flex:1;">
                                            <div id="captcha-question" style="color:rgba(255,255,255,0.85); font-size:14px; margin-bottom:6px;"></div>
                                            <input type="text" id="captcha-answer" placeholder="Ответ" class="auth-input" autocomplete="off" inputmode="numeric" pattern="[0-9]*" />
                                            <input type="hidden" id="captcha-token" value="" />
                                        </div>
                                        <button type="button" class="pwd-toggle" id="captcha-refresh" aria-label="Обновить капчу" title="Обновить" style="width:42px;height:42px;border-radius:12px;">↻</button>
                                    </div>
                                    <div class="auth-hint" style="margin-top:6px;">Капча появляется только когда нужно (регистрация или подозрительная активность).</div>
                                </div>


                                <button id="auth-button" class="auth-primary" style="width:100%;" onclick="handleAuthClick()">
                                    Продолжить
                                </button>

                                
                                <button type="button" id="qr-login-button" class="secondary-button w-full mt-3" onclick="openSessionKeyLoginModal()">
                                    🔑 Войти по ключу
                                </button>
                                <div class="auth-hint" style="margin-top:8px;">
                                    На другом устройстве откройте Super Chat → Настройки → Сессионный ключ → Сгенерировать, затем введите ключ здесь.
                                </div>

                                <div class="auth-terms">
                                    Нажимая кнопку, вы соглашаетесь с
                                    <a href="#" id="project-rules-link">правилами проекта</a>.
                                </div>

                                <div class="auth-foot">
                                    <span class="auth-foot__dot"></span>
                                    <span class="auth-foot__text">Ваши данные защищены. Никакой рекламы.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.getElementById('screen-container').innerHTML = `<div id="welcome_screen_content" class="screen-content">${html}</div>`;

            // Re-init password eye toggle because this screen is rendered dynamically
            try { window.__initPasswordToggle && window.__initPasswordToggle(); } catch(e) {}

            // Stage init
            loginStage = 'loading';
            try { updateAuthStageUI(loginStage); } catch(e) {}

            // Reset stage on input changes (so "Войти/Зарегистрироваться" stays correct)
            try {
                const u = document.getElementById('username');
                const p = document.getElementById('password');
                const pc = document.getElementById('password-confirm');
                const btn = document.getElementById('auth-button');
                const msg = document.getElementById('auth-message');

                const resetStage = () => {
                    if (loginStage !== 'loading') {
                        loginStage = 'loading';
                        btn.innerHTML = 'Продолжить';
                        btn.disabled = false;
                        msg.textContent = '';
                        msg.classList.remove('text-green-400', 'text-red-400');
                        updateAuthStageUI(loginStage);
                    }
                };

                u && u.addEventListener('input', resetStage);
                p && p.addEventListener('input', resetStage);
                pc && pc.addEventListener('input', () => { /* keep */ });

                const rulesLink = document.getElementById('project-rules-link');
                rulesLink && rulesLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    openProjectRules();
                });

                const cr = document.getElementById('captcha-refresh');
                cr && cr.addEventListener('click', (e) => { e.preventDefault(); refreshCaptcha(); });
            } catch(e) {}
        }
        
        // =========================================================
        // Auth UI helpers (Telegram-like)
        // =========================================================
        function updateAuthStageUI(stage) {
            const root = document.getElementById('welcome_view');
            if (root) root.dataset.stage = stage || 'loading';

            const sub = document.getElementById('auth-subtitle');
            if (!sub) return;

            if (stage === 'login') {
                sub.textContent = 'Добро пожаловать обратно — войдите в аккаунт';
            } else if (stage === 'register') {
                sub.textContent = 'Создайте аккаунт за минуту';
            } else {
                sub.textContent = 'Вход или регистрация — без лишних шагов';
            }
        }

        function acceptProjectRulesFromAuth() {
            // Используем существующий флаг проекта, чтобы не ломать логику
            try { localStorage.setItem('privacy_accepted', 'true'); } catch(e) {}
        }

        function openProjectRules() {
            const overlay = document.getElementById('privacy-overlay');
            if (!overlay) return;

            overlay.dataset.mode = 'manual';
            overlay.style.display = 'flex';
            overlay.style.opacity = '1';
            overlay.style.transition = '';

            try {
                const card = overlay.querySelector('.privacy-card');
                card && card.focus({ preventScroll: false });
            } catch(e) {}
        }

        function closeProjectRules() {
            const overlay = document.getElementById('privacy-overlay');
            if (!overlay) return;
            if (overlay.dataset.mode !== 'manual') return;

            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.25s ease';

            setTimeout(() => {
                overlay.style.display = 'none';
                overlay.style.opacity = '1';
                overlay.style.transition = '';
            }, 250);
        }

        function handleAuthClick() {
            // Нажатие кнопки = согласие с правилами проекта (и/или политикой)
            try { acceptProjectRulesFromAuth && acceptProjectRulesFromAuth(); } catch(e) {}

            if (loginStage === 'loading') {
                checkUsername();
            } else if (loginStage === 'login' || loginStage === 'register') {
                registerLogin();
            }
        }

        function renderSetupScreen() {
            const html = `
                <div id="setup_view" class="flex flex-col items-center justify-center h-full p-6">
                    
<div style="display:flex;flex-direction:column;align-items:center;margin-bottom:30px;">
    <div style="width:90px;height:90px;border-radius:28px;
        background:linear-gradient(145deg,#5B7CFF,#7C9CFF);
        box-shadow:0 20px 40px rgba(91,124,255,0.6),
                   inset 0 4px 10px rgba(255,255,255,0.4);
        display:flex;align-items:center;justify-content:center;
        font-size:40px;color:white;font-weight:bold;">
        💬
    </div>
</div>

<div class="text-center mb-8">
                        <h1 class="text-3xl font-bold mb-2 gradient-text">Настройка профиля</h1>
                        <p class="text-slate-300 text-center">Укажите ваше отображаемое имя и аватарку, чтобы начать общение.</p>
                    </div>
                    
                    <div class="w-full max-w-sm space-y-4 text-center">
                        <img id="avatar-preview" src="${escapeHtml(currentUser.avatar || '/default.png')}" alt="Аватар" class="avatar-preview mx-auto mb-4" referrerpolicy="no-referrer">

                        <input type="file" id="avatar-upload" accept="image/*" class="hidden" onchange="previewAvatar(this.files[0])">
                        <label for="avatar-upload" class="secondary-button cursor-pointer inline-block">
                            Выбрать аватар
                        </label>

                        <input type="text" id="display-name" placeholder="Отображаемое имя (как вас будут видеть)" 
                               value="${escapeHtml(currentUser.name || '')}"
                               maxlength="30"
                               class="input-field">
                        
                        <p id="setup-status" class="text-center text-sm text-red-400 h-5"></p>

                        <button id="setup-button" class="primary-button w-full" onclick="completeSetup()">
                            Завершить настройку
                        </button>
                    </div>
                </div>
            `;
             document.getElementById('screen-container').innerHTML = `<div id="setup_screen_content" class="screen-content">${html}</div>`;
        }

        function previewAvatar(file) {
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.getElementById('avatar-preview').src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        
}

        
        function setBannerPreview(url) {
            const el = document.getElementById('banner-preview');
            const clearBtn = document.getElementById('banner-clear-btn');
            if (!el) return;

            const fallback = (currentUser && (currentUser.avatar || currentUser.avatar_url)) ? (currentUser.avatar || currentUser.avatar_url) : '/default.png';
            const img = url || fallback;

            if (url) {
                el.classList.add('has-image');
                el.classList.remove('fallback-avatar');
                if (clearBtn) clearBtn.classList.remove('hidden');
            } else {
                el.classList.remove('has-image');
                el.classList.add('fallback-avatar');
                if (clearBtn) clearBtn.classList.add('hidden');
            }
            el.style.setProperty('--banner-image', `url('${img}')`);
        }

        
function previewBanner(file) {
            const st = document.getElementById('banner-upload-status');
            const pr = document.getElementById('banner-upload-progress');
            const bar = document.getElementById('banner-upload-progress-bar');
            const prev = document.getElementById('banner-preview');

            if (!file) {
                if (st) st.classList.add('hidden');
                if (pr) pr.classList.add('hidden');
                if (bar) bar.style.width = '0%';
                if (prev) prev.classList.remove('is-uploading');
                return;
            }

            const max = 3 * 1024 * 1024; // 3MB (server limit)
            if (file.size > max) {
                showModal('Ошибка', 'Размер баннера не должен превышать 3 МБ');
                const inp = document.getElementById('banner-upload');
                if (inp) inp.value = '';
                if (st) { st.textContent = ''; st.classList.add('hidden'); }
                if (pr) pr.classList.add('hidden');
                if (bar) bar.style.width = '0%';
                if (prev) prev.classList.remove('is-uploading');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setBannerPreview(e.target.result);
                if (st) {
                    st.textContent = `Выбран баннер: ${file.name}`;
                    st.classList.remove('hidden');
                }
                if (pr) pr.classList.add('hidden');
                if (bar) bar.style.width = '0%';
            };
            reader.readAsDataURL(file);
        }

        async function clearProfileBanner() {
            showModal('Подтвердите', 'Удалить баннер профиля?', true, async () => {
                const res = await apiRequest('clear_profile_banner');
                if (res.success) {
                    if (currentUser) currentUser.banner = null;
                    // reset input
                    const inp = document.getElementById('banner-upload');
                    if (inp) inp.value = '';
                    setBannerPreview(null);
                    const st = document.getElementById('banner-upload-status');
                    const pr = document.getElementById('banner-upload-progress');
                    const bar = document.getElementById('banner-upload-progress-bar');
                    const prev = document.getElementById('banner-preview');
                    if (st) st.classList.add('hidden');
                    if (pr) pr.classList.add('hidden');
                    if (bar) bar.style.width = '0%';
                    if (prev) prev.classList.remove('is-uploading');
                    showModal('Готово', 'Баннер удалён.');
                } else {
                    showModal('Ошибка', res.error || 'Не удалось удалить баннер.');
                }
            });
        }

        // ====== Profile music helpers ======
        function previewProfileMusic(file) {
            const input = document.getElementById('profile-music-upload');
            const panel = document.getElementById('profile-music-preview');
            if (!file || !panel) return;

            const max = 5 * 1024 * 1024;
            if (file.size > max) {
                showModal('Ошибка', 'Размер музыки не должен превышать 5 МБ');
                if (input) input.value = '';
                return;
            }

            const allowed = ['mp3','ogg','wav','m4a','aac'];
            const ext = (file.name.split('.').pop() || '').toLowerCase();
            if (!allowed.includes(ext)) {
                showModal('Ошибка', 'Недопустимый формат. Разрешены: ' + allowed.join(', '));
                if (input) input.value = '';
                return;
            }

            const url = URL.createObjectURL(file);
            panel.innerHTML = `
                <div class="flex flex-col gap-2">
                    <div class="flex items-center justify-between gap-2">
                        <div class="min-w-0">
                            <div class="font-semibold truncate">${escapeHtml(file.name)}</div>
                            <div class="text-xs text-slate-400">${formatBytes(file.size)} • ${ext.toUpperCase()}</div>
                        </div>
                        <button class="primary-button bg-slate-700 hover:bg-slate-600 text-xs px-3 py-2" type="button" onclick="clearSelectedProfileMusic()">Сброс</button>
                    </div>
                    <audio controls src="${url}" class="w-full h-8" preload="none"></audio>
                </div>
            `;
        }


        // Быстрый плюсик: открыть выбор музыки из профиля (перекидывает в редактирование и открывает выбор файла)
        function openProfileMusicPicker() {
            try {
                switchScreen('edit_profile');
                // Ждём отрисовку экрана
                setTimeout(() => {
                    const input = document.getElementById('profile-music-upload');
                    if (input) input.click();
                }, 450);
            } catch (e) {
                console.error(e);
            }
        }

        function clearSelectedProfileMusic() {
            const input = document.getElementById('profile-music-upload');
            const panel = document.getElementById('profile-music-preview');
            if (input) input.value = '';
            if (panel) {
                panel.innerHTML = (currentUser.profile_music && currentUser.profile_music.url)
                    ? `
                        <div class="flex flex-col gap-2">
                            <div class="flex items-center justify-between gap-2">
                                <div class="min-w-0">
                                    <div class="font-semibold truncate">${escapeHtml(currentUser.profile_music.original_name || 'Музыка')}</div>
                                    <div class="text-xs text-slate-400">${formatBytes(currentUser.profile_music.size || 0)} • ${(currentUser.profile_music.ext || 'audio').toUpperCase()}</div>
                                </div>
                                <button class="primary-button bg-red-600 hover:bg-red-700 text-xs px-3 py-2" type="button" onclick="clearProfileMusic()">Удалить</button>
                            </div>
                            <button type="button" class="secondary-button w-full mt-2" data-url="${currentUser.profile_music.url}" data-title="${escapeHtml(currentUser.profile_music.original_name || 'Музыка')}" onclick="playGlobalTrack(this.dataset.url, this.dataset.title)">▶️ Воспроизвести в плеере</button>
                            <button type="button" class="secondary-button w-full mt-2" data-url="${currentUser.profile_music.url}" data-title="${escapeHtml(currentUser.profile_music.original_name || 'Музыка')}" onclick="openAddToPlaylistDialog(this.dataset.url, this.dataset.title)">➕ В плейлист</button>
                        </div>
                    `
                    : `<span class="text-slate-400">Музыка не выбрана</span>`;
            }
        }

        async function clearProfileMusic() {
            const result = await apiRequest('clear_profile_music');
            if (result.success) {
                hideCaptcha();
                currentUser.profile_music = null;
                clearSelectedProfileMusic();
                try { updateDrawerProfile(); } catch(e) {}
                showModal('Успех', 'Музыка профиля удалена.');
            } else {
                showModal('Ошибка', result.error || 'Не удалось удалить музыку профиля.');
            }
        }

        async function completeSetup() {
            const name = document.getElementById('display-name').value.trim();
            const avatarFile = document.getElementById('avatar-upload')?.files?.[0];
            const bannerFile = document.getElementById('banner-upload')?.files?.[0];
            const button = document.getElementById('setup-button');
            const statusText = document.getElementById('setup-status');

            if (name.length < 1) {
                statusText.textContent = 'Отображаемое имя не может быть пустым.';
                return;
            }

            button.disabled = true;
            button.innerHTML = '<span class="loading-circle bg-white-accent"></span> Сохранение...';
            statusText.textContent = '';

            // Banner UI is optional on this screen (may be absent)
            const bannerPrev = document.getElementById('banner-preview');
            const bannerSt = document.getElementById('banner-upload-status');
            const bannerPr = document.getElementById('banner-upload-progress');
            const bannerBar = document.getElementById('banner-upload-progress-bar');

            try {
                if (bannerFile) {
                    if (bannerPrev) bannerPrev.classList.add('is-uploading');
                    if (bannerSt) { bannerSt.textContent = 'Загрузка баннера… 0%'; bannerSt.classList.remove('hidden'); }
                    if (bannerPr) bannerPr.classList.remove('hidden');
                    if (bannerBar) bannerBar.style.width = '0%';
                }

                const formData = new FormData();
                formData.append('action', 'complete_setup');
                formData.append('name', name);
                if (avatarFile) {
                    formData.append('avatar', avatarFile);
                }
                if (bannerFile) {
                    formData.append('banner', bannerFile);
                }

                const musicFile = document.getElementById('profile-music-upload')?.files?.[0];
                if (musicFile) {
                    formData.append('profile_music', musicFile);
                }

                let result;
                if (bannerFile) {
                    result = await apiRequestWithProgress(formData, (loaded, total) => {
                        if (!bannerSt && !bannerBar) return;
                        if (total) {
                            const pct = Math.max(0, Math.min(100, Math.round((loaded / total) * 100)));
                            if (bannerBar) bannerBar.style.width = pct + '%';
                            if (bannerSt) bannerSt.textContent = `Загрузка баннера… ${pct}%`;
                        } else {
                            if (bannerSt) bannerSt.textContent = 'Загрузка баннера…';
                        }
                    });
                } else {
                    result = await apiRequest('complete_setup', formData, true);
                }

                if (result.success) {
                    hideCaptcha();
                    showModal('Успех!', `Профиль <strong>${result.name}</strong> настроен.`, false, () => {
                        checkAuthAndRoute();
                    });
                } else {
                    showModal('Ошибка', result.error || 'Не удалось завершить настройку профиля.');
                    button.innerHTML = 'Завершить настройку';
                    button.disabled = false;

                    if (bannerPrev) bannerPrev.classList.remove('is-uploading');
                    if (bannerPr) bannerPr.classList.add('hidden');
                    if (bannerBar) bannerBar.style.width = '0%';
                    if (bannerFile && bannerSt) bannerSt.textContent = 'Не удалось загрузить баннер. Попробуйте ещё раз.';
                }
            } catch (e) {
                console.error('completeSetup error:', e);
                showModal('Ошибка', 'Не удалось завершить настройку профиля. Проверьте соединение и попробуйте снова.');
                button.innerHTML = 'Завершить настройку';
                button.disabled = false;

                if (bannerPrev) bannerPrev.classList.remove('is-uploading');
                if (bannerPr) bannerPr.classList.add('hidden');
                if (bannerBar) bannerBar.style.width = '0%';
            }
        }

        async function logout() {
            await apiRequest('logout');
            currentUser = {};
            currentChatId = null;
            stopPresenceHeartbeat();
            try { applyGlobalEffectTheme(null); } catch(e) {}
                try { updateDrawerProfile(); } catch(e) {}
            try { updateDrawerProfile(); } catch(e) {}
            if (messagesPollInterval) clearInterval(messagesPollInterval);
            if (notificationsPollInterval) clearInterval(notificationsPollInterval);
            window.__screenHistoryBootstrapped = false;
                switchScreen('welcome');
        }

        async function fetchChats() {
            const result = await apiRequest('get_chats');
            if (result.success) {
                hideCaptcha();
                chatsData = result.chats;
                if (currentScreen === 'chats_list') {
                    renderChatsList();
                }
            } else {
                console.error('Ошибка загрузки чатов:', result.error);
            }
        }

        function renderChatsList() {
    const unreadCount = notifications.filter(n => !n.read).length;
    const badgeHtml = unreadCount > 0 ? `
        <span id="chats-notification-badge" class="notification-badge">${unreadCount}</span>
    ` : '';

    const qRaw = (window.__chats_search_q || '');

    const html = `
    <div class="p-4">
        ${renderRequiredPackageBanner()}
        <h2 class="section-title">Чаты ${badgeHtml}</h2>

        <div class="chats-search-wrap">
            <div class="chats-searchbox">
                <span class="chats-search-ico" aria-hidden="true"><svg class="tg-svg" style="width:18px;height:18px"><use href="#ico-search"></use></svg></span>
                <input
                    type="search"
                    data-role="search"
                    id="chats-search-input"
                    class="chats-search-input"
                    placeholder="${t('Поиск по чатам…')}"
                    value="${escapeHtml(qRaw)}"
                    oninput="onChatsSearchInput(this.value)"
                >
                <button
                    class="chats-search-clear"
                    id="chats-search-clear"
                    type="button"
                    onclick="clearChatsSearch()"
                    aria-label="Очистить"
                >✕</button>
            </div>
        </div>

        <div id="chats-list-container" class="space-y-2 overflow-y-auto"></div>
    </div>
    `;
    document.getElementById('screen-container').innerHTML = `<div id="chats_list_screen_content" class="screen-content">${html}</div>`;

    // Render list items and sync search UI state
    renderChatsListItems();
    const inp = document.getElementById('chats-search-input');
    if (inp) inp.value = qRaw;
}

function onChatsSearchInput(value){
    window.__chats_search_q = value;
    renderChatsListItems();
}

function clearChatsSearch(){
    window.__chats_search_q = '';
    const inp = document.getElementById('chats-search-input');
    if (inp) inp.value = '';
    renderChatsListItems();
    if (inp) inp.focus();
}

function getChatPresenceText(chat){
    const p = (chat && chat.presence) ? chat.presence : null;
    if (!p) return '';
    const base = p.status_label || (p.is_online ? 'в сети' : 'был(а) недавно');
    const extra = p.status_text ? ` • ${p.status_text}` : '';
    return `${base}${extra}`;
}

function renderPresenceBadgeLine(chat, mode = 'list'){
    if (!chat || chat.type !== 'private' || !chat.presence) return '';
    const p = chat.presence || {};
    const dot = p.is_online ? '<span class="chat-presence-dot"></span>' : '';
    const text = escapeHtml(getChatPresenceText(chat));
    if (mode === 'header') {
        return `<div class="chat-header-status">${dot}<span class="label">${text}</span></div>`;
    }
    return `<div class="chat-presence-line">${dot}<span class="chat-presence-text">${text}</span></div>`;
}

function renderChatsListItems(){
    const listEl = document.getElementById('chats-list-container');
    if (!listEl) return;

    const q = (window.__chats_search_q || '').trim().toLowerCase();

    const filtered = q ? chatsData.filter(chat => {
        const name = String(chat.name || '').toLowerCase();
        const last = String(chat.last_message || '').toLowerCase();
        const id = String(chat.id || '').toLowerCase();
        return name.includes(q) || last.includes(q) || id.includes(q);
    }) : chatsData;

    const chatsHtml = filtered.map(chat => {
        const lastMessage = chat.last_message ? chat.last_message.substring(0, 50) + (chat.last_message.length > 50 ? '...' : '') : 'Нет сообщений';
        const isGeneral = chat.type === 'general';
        const isChannel = chat.type === 'channel';
        const isGroup = chat.type === 'group';
        const isBot = chat.type === 'bot';
        const time = chat.last_timestamp ? new Date(chat.last_timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

        const otherId = chat.other_id || null;
        const otherAvatar = chat.avatar || '';

        let icon = '💬';
        if (isGeneral) icon = '🌐';
        if (isChannel) icon = '📢';
        if (isGroup) icon = '👥';
        if (isBot) icon = '🤖';

        return `
            <div class="chat-item ${isBot ? 'bot-chat' : ''}" 
                 onclick="switchScreen('chat_view', { chatId: '${chat.id}', chatName: '${String(chat.name || '').replace(/'/g, "\\'")}', chatType: '${chat.type}', interlocutorId: '${otherId}', interlocutorAvatar: '${otherAvatar}', isBotChat: ${isBot} })">

                ${chat.avatar ? `
                    <img src="${chat.avatar}" alt="Аватар" class="w-12 h-12 rounded-full object-cover mr-3 flex-shrink-0">
                ` : `
                    <div class="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center mr-3 flex-shrink-0 text-xl">
                        ${icon}
                    </div>
                `}

                <div class="flex-grow min-w-0">
                    <div class="flex justify-between items-center">
                        <h3 class="font-bold truncate text-white">${escapeHtml(chat.name)} ${chat.is_verified && window.verifiedBadgeSvg ? window.verifiedBadgeSvg('sm') : ''} ${isChannel || isGroup ? `(${chat.member_count || 0})` : ''} ${chat.is_admin ? '<span class="admin-badge ml-1">Админ</span>' : ''}</h3>
                        <span class="text-xs text-slate-400 flex-shrink-0">${time}</span>
                    </div>
                    <p class="text-sm text-slate-400 truncate">${escapeHtml(lastMessage)}</p>
                    ${renderPresenceBadgeLine(chat, 'list')}
                </div>
            </div>
        `;
    }).join('');

    listEl.innerHTML = chatsHtml || '<p class="text-slate-400 text-center py-8">Ничего не найдено.</p>';

    const clearBtn = document.getElementById('chats-search-clear');
    if (clearBtn) clearBtn.classList.toggle('hidden', !q);
}

        

        function renderChatView({ chatId, chatName, chatType, interlocutorId, interlocutorAvatar, isBotChat = false }) {
            currentChatData = { chatId, chatName, chatType, interlocutorId, interlocutorAvatar, isBotChat };

            const isPrivate = chatType === 'private';
            const isChannel = chatType === 'channel';
            const isGroup = chatType === 'group';
            const isBot = isBotChat;
            const displayChatName = isPrivate 
                ? chatsData.find(c => c.id === chatId)?.name || chatName
                : chatName;

            const isAdmin = (isChannel || isGroup) && chatsData.find(c => c.id === chatId)?.is_admin;

            const chatViewHTML = `
                <div id="chat_view" class="flex flex-col h-full">
                    <div class="ios-topbar flex items-center justify-between p-3 bg-slate-900 shadow-md flex-shrink-0">
                        <button onclick="switchScreen('chats_list')" class="text-primary text-xl mr-3">←</button>
                        
                        <div class="flex items-center flex-grow min-w-0 ${(isPrivate && !isBot) || isChannel || isGroup ? 'cursor-pointer' : ''}" 
                             ${isPrivate && !isBot ? `data-action="open-profile" data-user-id="${interlocutorId}"` : ''}
                             ${(isChannel || isGroup) ? `onclick="showChannelProfile('${chatId}')"` : ''}>
                             ${isPrivate && !isBot ? `<img src="${interlocutorAvatar}" alt="Аватар" class="w-10 h-10 rounded-full object-cover mr-3 flex-shrink-0">` : ''}
                            <div class="chat-header-meta">
                                <h2 class="text-xl font-bold truncate">${displayChatName} ${((chatsData||[]).find(c => String(c.id) === String(chatId))?.is_verified && window.verifiedBadgeSvg) ? window.verifiedBadgeSvg('sm') : ''} ${isChannel ? '📢' : ''}${isGroup ? '👥' : ''}${isBot ? ' 🤖' : ''}</h2>
                                ${isPrivate && !isBot ? renderPresenceBadgeLine((chatsData || []).find(c => String(c.id) === String(chatId)), 'header') : ''}
                            </div>
                            ${(isChannel || isGroup) && isAdmin ? '<span class="admin-badge ml-2">Админ</span>' : ''}
                        </div>
                        
                        ${isBot ? `
                            <button class="primary-button text-sm ml-4 bg-blue-600 hover:bg-blue-700" onclick="showActiveSessions()">
                                Сессии
                            </button>
                        ` : ''}
                        
                        ${isChannel && isAdmin ? `
                            <button class="text-primary text-sm ml-4" onclick="showChannelSettings('${chatId}', '${displayChatName.replace(/'/g, "\\'")}')">
                                Настройки
                            </button>
                        ` : ''}
                        
                        ${isPrivate && !isBot ? `
                            <button class="chat-more-btn ml-2" onclick="openPrivateChatMenu('${chatId}','${interlocutorId}','${displayChatName.replace(/'/g, "\\'")}')" aria-label="Меню"><svg class="tg-svg tg-svg--more"><use href="#ico-more-vert"></use></svg></button>
                        ` : ''}
                        ${(isChannel || isGroup) ? `
                            <button class="text-red-500 text-sm ml-4" onclick="confirmLeaveCommunity('${chatId}', '${displayChatName.replace(/'/g, "\\'")}', '${chatType}')">
                                Покинуть
                            </button>
                        ` : ''}
                    </div>

                    <div id="pinned-bar" class="pinned-bar hidden" onclick="onPinnedBarClick(event)"></div>

                    <div id="comment-thread-banner" class="hidden flex-shrink-0"></div>

                    <div id="message-list" class="messages-container flex-grow">
                        <p class="text-slate-500 text-center py-4">Сообщений нет. Начните общение!</p>
                    </div>

                    <div id="attachment-menu" class="hidden absolute bottom-20 left-4 bg-slate-800 border border-slate-600 rounded-xl shadow-xl p-2 z-50 w-48 animate-fade-in">
                        <button type="button" onclick="triggerFileInput('photo-upload')" class="flex items-center w-full p-3 hover:bg-slate-700 rounded-lg text-left mb-1 transition-colors">
                            <span class="text-xl mr-3">🖼️</span> Изображение
                        </button>
                        <button type="button" onclick="triggerFileInput('video-upload')" class="flex items-center w-full p-3 hover:bg-slate-700 rounded-lg text-left mb-1 transition-colors">
                            <span class="text-xl mr-3">🎬</span> Видео
                        </button>
                        <button type="button" onclick="triggerFileInput('audio-upload')" class="flex items-center w-full p-3 hover:bg-slate-700 rounded-lg text-left mb-1 transition-colors">
                            <span class="text-xl mr-3">🎵</span> Музыка (MP3)
                        </button>
                        <button type="button" onclick="triggerFileInput('file-upload')" class="flex items-center w-full p-3 hover:bg-slate-700 rounded-lg text-left transition-colors">
                            <span class="text-xl mr-3">📁</span> Файл
                        </button>
                    </div>

                    <div id="sticker-panel" class="hidden absolute bottom-20 left-4 right-4 bg-slate-800 border border-slate-600 rounded-xl shadow-xl p-3 z-50 animate-fade-in">
                        <div class="flex items-center gap-2 mb-2">
	                            <button type="button" id="sticker-tab-emoji" class="sticker-tab is-active" onclick="switchStickerTab('emoji')" aria-label="Эмодзи" title="Эмодзи">😊</button>
	                            <button type="button" id="sticker-tab-gif" class="sticker-tab" onclick="switchStickerTab('gif')" aria-label="GIF" title="GIF">GIF</button>
                            <div class="flex-grow"></div>
                            <button type="button" class="sticker-close" onclick="hideStickerPanel()" aria-label="Закрыть">✕</button>
                        </div>

                        <div id="sticker-emoji" class="sticker-body">
                            <div id="emoji-grid" class="emoji-grid"></div>
                        </div>

                        <div id="sticker-gif" class="sticker-body hidden">
                            <div class="flex items-center gap-2 mb-2">
                                <input id="gif-search" type="text" class="input-field flex-grow" placeholder="Поиск GIF…" maxlength="40" oninput="onGifSearchInput(this.value)">
                                <button type="button" class="secondary-button" onclick="loadTrendingGifs()" title="Популярные">🔥</button>
                            </div>
                            <div id="gif-grid" class="gif-grid"></div>
                            <p class="text-xs text-slate-400 mt-2">Популярные GIF загружаются из Tenor. При отправке GIF сохраняется на сервере, чтобы его видели все.</p>
                        </div>
                    </div>

                    <div id="file-preview-panel" class="hidden absolute bottom-20 left-4 right-4 bg-slate-800 border-l-4 border-primary rounded-r-lg p-3 shadow-lg flex justify-between items-center z-40">
                        <div class="flex items-center overflow-hidden">
                            <span id="preview-icon" class="text-2xl mr-3">📄</span>
                            <div class="min-w-0">
                                <p id="preview-name" class="font-bold text-sm truncate text-white">filename.txt</p>
                                <p id="preview-info" class="text-xs text-slate-400">5 MB • zip</p>
                            </div>
                        </div>
                        <button type="button" onclick="clearAttachments()" class="text-red-400 hover:text-red-300 ml-2 text-xl px-2">✕</button>
                    </div>

                    <form id="message-form" class="chat-composer flex items-center flex-shrink-0 relative" onsubmit="event.preventDefault(); sendMessage()" style="${isBot ? 'display: none;' : ''}">
                        <input type="file" id="photo-upload" accept="image/*" class="hidden" onchange="handleFileSelect(this, 'photo')">
                    <input type="file" id="video-upload" accept="video/mp4,video/webm,video/quicktime,video/*" class="hidden" onchange="handleFileSelect(this, 'video')">
                        <input type="file" id="audio-upload" accept=".mp3,.ogg,.wav,.m4a,.aac" class="hidden" onchange="handleFileSelect(this, 'audio')">
                        <input type="file" id="file-upload" accept=".newtrobat,.catrobat,.txt,.zip,.apk" class="hidden" onchange="handleFileSelect(this, 'file')">

                        <button type="button" onclick="toggleAttachmentMenu()" class="chat-icon-btn chat-attach-btn" aria-label="Вложения"><svg class="tg-svg" aria-hidden="true"><use href="#ico-plus"></use></svg></button>

                        ${isPrivate && !isBot ? `<button type="button" onclick="openChatGiftShop('${interlocutorId}','${displayChatName.replace(/'/g, "\\'")}')" class="chat-icon-btn" aria-label="Подарки"><svg class="tg-svg" aria-hidden="true"><use href="#ico-gift"></use></svg></button>` : ''}

                        <div class="composer-input-wrap flex-grow min-w-0 relative">
                            <textarea id="message-input" placeholder="${isChannel && !isAdmin ? 'Только администраторы могут писать' : 'Сообщение...'}" 
                                  maxlength="200" rows="1" class="input-field composer-textarea w-full" ${isChannel && !isAdmin ? 'disabled' : ''}></textarea>
                            <button type="button" onclick="toggleStickerPanel()" class="composer-inline-btn" aria-label="Эмодзи и GIF"><svg class="tg-svg" aria-hidden="true"><use href="#ico-emoji"></use></svg></button>
                        </div>
                        
                        <button type="submit" class="tg-send-btn ml-2" ${isChannel && !isAdmin ? 'disabled' : ''} aria-label="Отправить"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="#fff"/></svg></button>
                    </form>

                    ${isBot ? `
                        <div class="p-4 bg-slate-800 text-center text-slate-400 text-sm">
                            🤖 Это чат с ботом Super Chat. Вы не можете отправлять сообщения.
                        </div>
                    ` : ''}
                </div>
            `;
            document.getElementById('screen-container').innerHTML = `<div id="chat_view_screen_content" class="screen-content">${chatViewHTML}</div>`;

            // Инициализация панели ввода (textarea авто-рост + Enter=отправка)
            setupComposerUI();
            // Пин-бар и блокировки в личных чатах
            try{ updatePinnedBar(null); }catch(e){}
            try{ refreshPrivateBlockStatus(); }catch(e){}

            const messagesContainer = document.querySelector('.messages-container');
            if (messagesContainer) {
                messagesContainer.scrollTop = 0;
            }
        }
        
        // Логика меню вложений
        function toggleAttachmentMenu() {
            const menu = document.getElementById('attachment-menu');
            menu.classList.toggle('hidden');
        }

        function triggerFileInput(id) {
            document.getElementById('attachment-menu').classList.add('hidden');
            document.getElementById(id).click();
        }

        /* ===============================
           Эмодзи + GIF панель (стикеры)
           - на мобиле экономит место: кнопка внутри поля ввода
           =============================== */
        let gifSearchTimer = null;
        let gifLastQuery = '';
        let emojiGridBuilt = false;

        function toggleStickerPanel(){
            const panel = document.getElementById('sticker-panel');
            if (!panel) return;
            // Apply current gift/theme effect to this panel too
            panel.classList.remove('lolpol-effect-bg','dragon-effect-bg','phoenix-effect-bg');
            if (window.currentUser && currentUser && currentUser.active_effect && getEffectPalette(currentUser.active_effect)) {
                panel.classList.add(`${currentUser.active_effect}-effect-bg`);
            }
            // закрываем меню вложений, чтобы не накладывались
            const attachMenu = document.getElementById('attachment-menu');
            if (attachMenu) attachMenu.classList.add('hidden');

            const willShow = panel.classList.contains('hidden');
            panel.classList.toggle('hidden');

            if (willShow) {
                switchStickerTab('emoji');
                const grid = document.getElementById('emoji-grid');
                if (!emojiGridBuilt || (grid && grid.children.length === 0)) buildEmojiGrid();
                // подгрузим популярные гифки заранее (не мешает, если пользователь не откроет вкладку)
                loadTrendingGifs();
                const gs = document.getElementById('gif-search');
                if (gs) gs.value = '';
            }
        }

        function hideStickerPanel(){
            const panel = document.getElementById('sticker-panel');
            if (panel) panel.classList.add('hidden');
        }

        function switchStickerTab(tab){
            const emojiTab = document.getElementById('sticker-tab-emoji');
            const gifTab = document.getElementById('sticker-tab-gif');
            const emojiBody = document.getElementById('sticker-emoji');
            const gifBody = document.getElementById('sticker-gif');
            if (!emojiTab || !gifTab || !emojiBody || !gifBody) return;

            const isEmoji = tab === 'emoji';
            emojiTab.classList.toggle('is-active', isEmoji);
            gifTab.classList.toggle('is-active', !isEmoji);
            emojiBody.classList.toggle('hidden', !isEmoji);
            gifBody.classList.toggle('hidden', isEmoji);
        }

        function buildEmojiGrid(){
            const grid = document.getElementById('emoji-grid');
            if (!grid) return;

            const emojis = [
                '😀','😁','😂','🤣','😊','😍','😘','😎','🤔','😴','😢','😭','😡','🤯','👍','👎','👏','🙏','🔥','💯','🎉','✨','❤️','💔','⭐','✅','❌','⚡','🍀','🍕','🎧','🎮','📎','📌','🚀'
            ];

            grid.innerHTML = emojis.map(e => `
                <button type="button" class="emoji-btn" onclick="insertEmoji('${e.replace(/'/g, "\\'")}')">${e}</button>
            `).join('');
            emojiGridBuilt = true;
        }

        function insertEmoji(emoji){
            const input = document.getElementById('message-input');
            if (!input || input.disabled) return;
            try{
                const start = input.selectionStart ?? input.value.length;
                const end = input.selectionEnd ?? input.value.length;
                const before = input.value.slice(0, start);
                const after = input.value.slice(end);
                input.value = before + emoji + after;
                const pos = start + emoji.length;
                input.setSelectionRange(pos, pos);
                input.focus();
                autoGrowTextarea(input);
            }catch(e){
                input.value += emoji;
                input.focus();
                autoGrowTextarea(input);
            }
        }

        function onGifSearchInput(q){
            const query = (q || '').trim();
            gifLastQuery = query;
            if (gifSearchTimer) clearTimeout(gifSearchTimer);
            gifSearchTimer = setTimeout(() => {
                if (gifLastQuery.length < 2) {
                    loadTrendingGifs();
                } else {
                    searchGifs(gifLastQuery);
                }
            }, 250);
        }

        async function loadTrendingGifs(){
            await fetchTenorGifs('trending', '');
        }

        async function searchGifs(query){
            await fetchTenorGifs('search', query);
        }

        async function fetchTenorGifs(mode, query){
            const grid = document.getElementById('gif-grid');
            if (!grid) return;
            grid.innerHTML = `<div class="text-slate-300 text-sm">Загрузка GIF…</div>`;

            // IMPORTANT: load GIFs via backend proxy (mobile/webview friendly, no CORS issues)
            try{
                const res = await apiRequest('tenor_proxy', { mode, query });
                if (!res || !res.success) {
                    throw new Error((res && res.error) ? res.error : 'Tenor недоступен');
                }
                const mapped = Array.isArray(res.items) ? res.items : [];
                renderGifGrid(mapped);
            }catch(e){
                console.warn('Tenor proxy failed', e);
                grid.innerHTML = `<div class="text-slate-300 text-sm">Не удалось загрузить GIF. Попробуйте позже.</div>`;
            }
        }

        function renderGifGrid(items){
            const grid = document.getElementById('gif-grid');
            if (!grid) return;
            if (!items || items.length === 0) {
                grid.innerHTML = `<div class="text-slate-300 text-sm">Ничего не найдено.</div>`;
                return;
            }
            grid.innerHTML = items.map(it => `
                <div class="gif-item" onclick="pickGif('${String(it.fullUrl).replace(/'/g, "\\'")}')">
                    <img loading="lazy" decoding="async" referrerpolicy="no-referrer" src="${it.previewUrl}" alt="GIF">
                </button>
            `).join('');
        }

        async function pickGif(url){
            if (!currentChatId) return;
            hideStickerPanel();
            // импортируем GIF на сервер → получаем upload_token
            setPreviewStatus('Импорт GIF…');
            const panel = document.getElementById('file-preview-panel');
            if (panel) panel.classList.remove('hidden');
            const icon = document.getElementById('preview-icon');
            const name = document.getElementById('preview-name');
            if (icon) icon.textContent = '🖼️';
            if (name) name.textContent = 'GIF';

            const res = await apiRequest('import_gif', { chat_id: currentChatId, gif_url: url });
            if (res && res.success && res.upload_token) {
                currentAttachment = {
                    type: 'photo',
                    file: { name: 'GIF', size: (res.file && res.file.size) ? res.file.size : 0 },
                    upload_token: res.upload_token,
                    uploaded: true,
                    upload_id: null
                };
                const sizeMB = ((currentAttachment.file.size || 0) / (1024*1024)).toFixed(2);
                setPreviewStatus(`Готово • ${sizeMB} MB`);
                const sendButton = document.querySelector('#message-form button[type="submit"]');
                if (sendButton) sendButton.disabled = false;
            } else {
                showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось добавить GIF.');
                clearAttachments();
            }
        }

        function setupComposerUI(){
            const input = document.getElementById('message-input');
            if (!input) return;
            if (input.dataset && input.dataset.bound === '1') {
                autoGrowTextarea(input);
                return;
            }
            if (input.dataset) input.dataset.bound = '1';

            input.addEventListener('input', () => autoGrowTextarea(input));
            input.addEventListener('keydown', (e) => {
                // Enter -> send, Shift+Enter -> новая строка
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    // если открыт выбор эмодзи/GIF, не мешаем отправке
                    sendMessage();
                }
            });
            autoGrowTextarea(input);
        }

        function autoGrowTextarea(el){
            if (!el) return;
            // reset
            el.style.height = 'auto';
            const max = 120;
            const h = Math.min(el.scrollHeight || 44, max);
            el.style.height = h + 'px';
        }

        let currentAttachment = null; // { type: 'photo'|'audio'|'file', file: FileObj }

        async function handleFileSelect(input, type) {
            const file = input.files[0];
            if (!file) return;

            // Валидация на клиенте
            if (type === 'audio') {
                const max = 5 * 1024 * 1024;
                if (file.size > max) {
                    showModal('Ошибка', 'Размер музыки не должен превышать 5 МБ');
                    input.value = '';
                    return;
                }
                const allowedAudio = ['mp3','ogg','wav','m4a','aac'];
                const ext = (file.name.split('.').pop() || '').toLowerCase();
                if (!allowedAudio.includes(ext)) {
                    showModal('Ошибка', 'Недопустимый формат музыки. Разрешены: ' + allowedAudio.join(', '));
                    input.value = '';
                    return;
                }
            } else if (type === 'file') {
                if (file.size > 10 * 1024 * 1024) {
                    showModal('Ошибка', 'Размер файла не должен превышать 10 МБ');
                    input.value = '';
                    return;
                }
                const allowed = ['down', 'newtrobat', 'up', 'catrobat', 'txt', 'zip', 'apk'];
                const ext = file.name.split('.').pop().toLowerCase();
                if (!allowed.includes(ext)) {
                    showModal('Ошибка', 'Недопустимое расширение. Разрешены: ' + allowed.join(', '));
                    input.value = '';
                    return;
                }
            }

            else if (type === 'video') {
                const max = 25 * 1024 * 1024;
                if (file.size > max) {
                    showModal('Ошибка', 'Размер видео не должен превышать 25 МБ');
                    input.value = '';
                    return;
                }
                const allowedVideo = ['mp4','webm','mov','m4v'];
                const ext = (file.name.split('.').pop() || '').toLowerCase();
                if (!allowedVideo.includes(ext)) {
                    showModal('Ошибка', 'Недопустимый формат видео. Разрешены: ' + allowedVideo.join(', '));
                    input.value = '';
                    return;
                }
            }

            // Очищаем другие инпуты
            if (type !== 'photo') document.getElementById('photo-upload').value = '';
            if (type !== 'audio') document.getElementById('audio-upload').value = '';
            if (type !== 'file') document.getElementById('file-upload').value = '';
            if (type !== 'video') document.getElementById('video-upload').value = '';

            currentAttachment = { type, file, upload_token: null, uploaded: false, upload_id: null };
            showPreview(file, type);
            await uploadCurrentAttachment();
        }

        function showPreview(file, type) {
            const panel = document.getElementById('file-preview-panel');
            const icon = document.getElementById('preview-icon');
            const name = document.getElementById('preview-name');
            const info = document.getElementById('preview-info');

            panel.classList.remove('hidden');
            name.textContent = file.name;
            
            const sizeMB = (file.size / (1024*1024)).toFixed(2) + ' MB';
            const ext = file.name.split('.').pop();

            if (type === 'photo') {
                icon.textContent = '🖼️';
                info.textContent = sizeMB;
            } else if (type === 'audio') {
                icon.textContent = '🎵';
                info.textContent = `${sizeMB} • ${(ext || 'audio').toLowerCase()}`;
            } else if (type === 'video') {
                icon.textContent = '🎬';
                info.textContent = `${sizeMB} • ${(ext || 'video').toLowerCase()}`;
            } else {
                icon.textContent = '📁';
                info.textContent = `${sizeMB} • ${ext}`;
            }
        }


        function setPreviewStatus(text, isError = false) {
            const info = document.getElementById('preview-info');
            if (!info) return;
            info.textContent = text;
            if (isError) {
                info.classList.add('text-red-300');
            } else {
                info.classList.remove('text-red-300');
            }
        }

        // Сначала загружаем вложение на сервер, затем отправляем сообщение с upload_token
        async function uploadCurrentAttachment() {
            if (!currentAttachment || !currentAttachment.file || !currentChatId) return;

            const sendButton = document.querySelector('#message-form button[type="submit"]');
            if (sendButton) sendButton.disabled = true;

            const uploadId = (Date.now().toString(36) + Math.random().toString(36).slice(2));
            currentAttachment.upload_id = uploadId;
            currentAttachment.uploaded = false;
            currentAttachment.upload_token = null;

            setPreviewStatus('Загрузка…');

            const fd = new FormData();
            fd.append('action', 'upload_attachment');
            fd.append('chat_id', currentChatId);
            fd.append('kind', currentAttachment.type);
            fd.append('attachment', currentAttachment.file);

            const res = await apiRequest('upload_attachment', fd, true);

            // Если пользователь уже сменил вложение/чат — игнорируем результат
            if (!currentAttachment || currentAttachment.upload_id !== uploadId) {
                return;
            }

            if (res && res.success && res.upload_token) {
                currentAttachment.upload_token = res.upload_token;
                currentAttachment.uploaded = true;

                const f = currentAttachment.file;
                const sizeMB = (f.size / (1024 * 1024)).toFixed(2) + ' MB';
                const ext = (f.name.split('.').pop() || '').toLowerCase();

                if (currentAttachment.type === 'photo') {
                    setPreviewStatus(`Готово • ${sizeMB}`);
                } else {
                    setPreviewStatus(`Готово • ${sizeMB} • ${ext || currentAttachment.type}`);
                }

                if (sendButton) sendButton.disabled = false;
            } else {
                if (sendButton) sendButton.disabled = false;
                showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось загрузить файл.');
                clearAttachments();
            }
        }

        function clearAttachments() {
            document.getElementById('photo-upload').value = '';
            document.getElementById('audio-upload').value = '';
            document.getElementById('file-upload').value = '';
            const vu = document.getElementById('video-upload');
            if (vu) vu.value = '';
            document.getElementById('file-preview-panel').classList.add('hidden');
            currentAttachment = null;
            const sendButton = document.querySelector('#message-form button[type="submit"]');
            if (sendButton) sendButton.disabled = false;
        }

        // Клик вне меню закрывает его
        document.addEventListener('click', function(e) {
            const menu = document.getElementById('attachment-menu');
            const btn = document.querySelector('button[onclick="toggleAttachmentMenu()"]');
            const clickedAttachBtn = btn ? btn.contains(e.target) : false;
            if (menu && !menu.classList.contains('hidden') && !menu.contains(e.target) && !clickedAttachBtn) {
                menu.classList.add('hidden');
            }

            const sp = document.getElementById('sticker-panel');
            const spBtn = document.querySelector('button[onclick="toggleStickerPanel()"]');
            if (sp && !sp.classList.contains('hidden')) {
                const clickedBtn = spBtn ? spBtn.contains(e.target) : false;
                if (!sp.contains(e.target) && !clickedBtn) {
                    sp.classList.add('hidden');
                }
            }
        });

        // Делегированный клик по аватарке/имени: открыть профиль (в чате/каналах/общем)
        document.addEventListener('click', function(e) {
            const el = e.target.closest('[data-action="open-profile"]');
            if (!el) return;
            e.preventDefault();

            // Закрываем меню вложений, если оно открыто
            const menu = document.getElementById('attachment-menu');
            if (menu) menu.classList.add('hidden');

            e.stopPropagation();
            const uid = el.getAttribute('data-user-id');
            if (uid) showUserProfileModal(uid);
        }, true);


        function renderSearchUsersView(mode, giftData = {}) {
            const isGiftMode = mode === 'gift_search';
            const title = isGiftMode ? `Поиск получателя ${giftData.emoji} ${giftData.name}` : 'Начать новый чат';
            const placeholder = 'Введите логин или имя пользователя...';

            const selfGiftButton = isGiftMode ? `
                <button class="primary-button w-full mt-4 bg-green-600 hover:bg-green-700" 
                        onclick="sendGiftToRecipient('${currentUser.id}', '${giftData.key}', '${giftData.emoji}', '${giftData.name}', '${currentUser.name}')">
                    🎁 Подарить Себе
                </button>
                <p class="text-slate-400 text-center my-3 border-b border-slate-700 pb-2">Или найдите другого пользователя:</p>
            ` : '';

            const html = `
                <div id="${mode}_view" class="p-4 flex flex-col h-full">
                    <h2 class="section-title">${title}</h2>
                    
                    ${selfGiftButton}

                    <input type="text" id="search-input" placeholder="${placeholder}" 
                           oninput="searchUsers('${mode}', '${giftData.key || ''}', '${giftData.emoji || ''}', '${giftData.name || ''}')"
                           class="input-field mb-4">
                    
                    <div id="search-results" class="space-y-2 flex-grow overflow-y-auto">
                        <p class="text-slate-400 text-center py-8">Начните вводить текст для поиска.</p>
                    </div>
                </div>
            `;
            document.getElementById('screen-container').innerHTML = `<div id="${mode}_screen_content" class="screen-content">${html}</div>`;
        }

        function renderAddChatView() {
            renderSearchUsersView('add_chat');
        }

        async function searchUsers(mode, giftKey, giftEmoji, giftName) {
            const query = document.getElementById('search-input').value.trim();
            const resultsContainer = document.getElementById('search-results');

            if (query.length < 2) {
                resultsContainer.innerHTML = '<p class="text-slate-400 text-center py-8">Начните вводить текст для поиска.</p>';
                return;
            }
            
            resultsContainer.innerHTML = '<p class="text-center py-4"><span class="loading-circle bg-white-accent"></span> Поиск...</p>';

            const result = await apiRequest('search_users', { query });
            
            if (result.success && result.users.length > 0) {
                const usersHtml = result.users.map(user => {
                    const safeId = String(user.id || '').replace(/'/g, "\\'");
                    const safeNameJs = String(user.name || '').replace(/\\/g, "\\\\").replace(/'/g, "\\'");
                    const buttonAction = mode === 'add_chat' 
                        ? `createPrivateChat('${safeId}', '${safeNameJs}')` 
                        : `sendGiftToRecipient('${safeId}', '${giftKey}', '${giftEmoji}', '${giftName}', '${safeNameJs}')`;
                    
                    const buttonText = mode === 'add_chat' ? 'Начать чат' : 'Подарить';

                    return `
                        <div class="card flex items-center justify-between">
                            <div class="flex items-center">
                                <img src="${escapeHtml(user.avatar || '/default.png')}" alt="Аватар" class="w-12 h-12 rounded-full object-cover mr-3" loading="lazy" referrerpolicy="no-referrer">
                                <div>
                                    <h4 class="font-bold">${escapeHtml(user.name || '')}</h4>
                                    <p class="text-sm text-slate-400">@${escapeHtml(user.username || '')}</p>
                                </div>
                            </div>
                            <button class="primary-button px-4 py-2 text-sm" onclick="${buttonAction}">
                                ${buttonText}
                            </button>
                        </div>
                    `;
                }).join('');
                resultsContainer.innerHTML = usersHtml;
            } else {
                resultsContainer.innerHTML = '<p class="text-red-400 text-center py-8">Пользователи не найдены.</p>';
            }
        }

        async function createPrivateChat(targetUserId, targetName) {
            const result = await apiRequest('create_private_chat', { target_user_id: targetUserId });

            if (result.success) {
                hideCaptcha();
                showModal('Чат создан', `Вы начали чат с <strong>${targetName}</strong>.`, false, () => {
                    fetchChats().then(() => {
                        const newChatData = chatsData.find(c => c.id === result.chat_id);
                        if (newChatData) {
                            switchScreen('chat_view', { 
                                chatId: newChatData.id, 
                                chatName: newChatData.name, 
                                chatType: newChatData.type, 
                                interlocutorId: newChatData.other_id, 
                                interlocutorAvatar: newChatData.avatar 
                            });
                        } else {
                             window.__screenHistoryBootstrapped = false;
                    switchScreen('chats_list');
                        }
                    });
                });

            } else {
                showModal('Ошибка', result.error || 'Не удалось создать чат.');
            }
        }

        async function fetchMessages(chatId, shouldScroll = false, options = {}) {
            const silent = !!(options && options.silent);
            const force = !!(options && options.force);
            const result = await apiRequest('get_messages', { chat_id: chatId }, false, { silent });
            const list = document.getElementById('message-list');

            if (result.success && list) {
                const rawMessages = Array.isArray(result.messages) ? result.messages.slice() : [];
                const messages = getFilteredThreadMessages(rawMessages.slice());
                try{ renderThreadBanner(); }catch(e){}


                // Пин-бар
                try{ updatePinnedBar(result.pinned_message); }catch(e){}
                try{ if (window.__messagesCache) { window.__messagesCache[String(chatId)] = messages; } }catch(e){}

                // --- МОЩНЫЙ ФИКС №1: Проверка на изменения ---
                // Раньше подпись учитывала только длину и lastMsg.id → реакции/редактирование
                // не обновлялись. Теперь сервер отдаёт last_update/hidden_sig.
                const lastMsg = (messages.length > 0) ? messages[messages.length - 1] : null;
                const lastId = lastMsg ? (lastMsg.id ?? '') : '';
                const lastUpdate = (result && (result.last_update ?? result.lastUpdate)) ? (result.last_update ?? result.lastUpdate) : 0;
                const pinnedId = (result && (result.pinned_message_id ?? result.pinned_message_id)) ? (result.pinned_message_id ?? '') : '';
                const hiddenSig = (result && (result.hidden_sig ?? result.hiddenSig)) ? (result.hidden_sig ?? '') : '0';
                const dataSignature = `${messages.length}_${lastId}_${lastUpdate}_${pinnedId}_${hiddenSig}`;

                if (!force && !shouldScroll && list.dataset.lastSignature === dataSignature) {
                    return;
                }
                list.dataset.lastSignature = dataSignature;

                // --- МОЩНЫЙ ФИКС №2: Умный скролл ---
                // Запоминаем, где юзер находится СЕЙЧАС.
                // В column-reverse 0 - это самый низ. При скролле вверх число становится отрицательным.
                const currentScroll = list.scrollTop;
                
                // Проверяем, находится ли юзер внизу (допускаем погрешность 50px)
                // Math.abs нужен, так как в Chrome скролл вверх идет в минус.
                const isUserAtBottom = Math.abs(currentScroll) < 50;

                // Генерируем HTML
                const messagesHtml = renderMessages(messages);
                
                // Обновляем чат
                list.innerHTML = messagesHtml;

                // Gift toast for new system gift messages (only for receiver)
                try{
                    rawMessages.forEach(m => {
                        if (!m || m.type !== 'system_gift') return;
                        const mid = String((m.id ?? m.message_id ?? m.msg_id ?? '') || '');
                        if (!mid) return;
                        if (__seenGiftMessageIds.has(mid)) return;
                        __seenGiftMessageIds.add(mid);

                        // Only show when gift came from someone else
                        if (String(m.sender_id || '') === String(currentUser.id || '')) return;
                        const emoji = extractGiftEmojiFromSystemText(m.content || '🎁');
                        const sender = String(m.sender_name || 'Пользователь');
                        const clean = String(m.content || '').replace(/^\s*🎁\s*/,'');
                        showGiftToast({
                            emoji,
                            title: '🎁 Вам подарок!',
                            text: `${sender} ${clean}`
                        });
                    });
                }catch(e){}

                // --- МОЩНЫЙ ФИКС №3: Восстановление позиции ---
                if (shouldScroll) {
                    // Сценарий 1: Ты сам отправил сообщение -> летим вниз
                    list.scrollTop = 0;
                } else if (isUserAtBottom) {
                    // Сценарий 2: Ты был внизу и пришло новое сообщение -> остаемся внизу (видим новое)
                    list.scrollTop = 0;
                } else {
                    // Сценарий 3: Ты читал историю наверху -> ВОЗВРАЩАЕМ тебя ровно туда, где ты был
                    list.scrollTop = currentScroll;
                }

                // Jump to favorite message if requested
                try{
                    if (window.__pendingFavJump && String(window.__pendingFavJump.chatId) === String(chatId)){
                        const mid = window.__pendingFavJump.msgId;
                        window.__pendingFavJump = null;
                        setTimeout(() => { try{ jumpToMessage(mid); }catch(e){} }, 80);
                    }
                }catch(e){}

            } else if (result.success && currentScreen === 'chat_view') {
                // Редкий случай: если экран не готов, перерисовываем целиком
                switchScreen('chat_view', currentChatData);
            } else {
                console.error('Ошибка загрузки сообщений:', result.error);
            }
        }

        function renderMessages(messages) {
            // Эта функция теперь ТОЛЬКО генерирует HTML строку
            // Она больше не трогает DOM и скролл напрямую
            
            messages.reverse(); // Переворачиваем для column-reverse

            let lastDate = null;
            
            const messagesHtml = messages.map(message => {
                try{
                    const se = message.sender_effect || ((currentUser && message.sender_id === currentUser.id) ? (currentUser.active_effect || null) : null);
                    if (se) message.sender_effect = se;
                }catch(e){}
                const messageDate = new Date(message.timestamp * 1000);
                const messageDateStr = messageDate.toLocaleDateString();
                
                let dateSeparator = '';
                if (lastDate !== messageDateStr) {
                    lastDate = messageDateStr;
                    const today = new Date().toLocaleDateString();
                    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString();
                    
                    let displayDate;
                    if (messageDateStr === today) {
                        displayDate = 'Сегодня';
                    } else if (messageDateStr === yesterday) {
                        displayDate = 'Вчера';
                    } else {
                        displayDate = messageDate.toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        });
                    }
                    
                    dateSeparator = `<div class="date-separator"><span class="date-separator-line">${displayDate}</span></div>`;
                }

                const isSystem = message.type === 'system' || message.type === 'system_gift' || message.type === 'system_boost';
                const isSecurity = message.type === 'security';
                const isOutgoing = message.sender_id === currentUser.id;
                const isBot = message.sender_id === 'security_bot' || message.sender_id === 'verification_bot';

                if (isSystem) {
                    const sysText = escapeHtml(message.content || '');
            return `${dateSeparator}<div class=\"system-message-row\"><div class=\"message-bubble message-system text-center italic mt-2\">${sysText}</div></div>`;
                }

                const content = message.type === 'photo' 
                    ? `<img src="${message.file_path}" alt="Фото" class="max-w-full rounded-lg" onclick="window.open(this.src)">` 
                    : escapeHtml(message.content || '');
                
                const senderName = isOutgoing ? 'Вы' : (message.sender_name || 'Неизвестный');
        const senderNameSafe = escapeHtml(senderName);
                let bubbleClass = isOutgoing ? 'message-outgoing' : 'message-incoming';
                

                if (isSecurity) {
                    bubbleClass += ' security-message';
                }

                const containerClass = isOutgoing ? 'flex justify-end' : 'message-with-avatar';
                
                const showAvatar = (currentChatData.chatType === 'general' || currentChatData.chatType === 'channel' || currentChatData.chatType === 'group' || isBot) && !isOutgoing;

                let html = '';
                if (showAvatar) {
                    html = `
                        ${dateSeparator}
                        <div class="${containerClass}">
                            <img src="${message.sender_avatar}" alt="Аватар" class="avatar ${message.sender_effect==='dragon'?'fx-dragon-ring':''}" ${!isBot ? `data-action="open-profile" data-user-id="${message.sender_id}"` : ''}>
                            <div class="flex flex-col">
                                <p class="text-xs font-semibold mb-1 text-slate-400">${senderNameSafe}</p>
                                <div class="message-bubble ${bubbleClass} shadow-md">${content}</div>
                                <span class="text-xs text-slate-500 mt-1">${new Date(message.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    `;
                } else {
                    html = `
                        ${dateSeparator}
                        <div class="${isOutgoing ? 'flex justify-end' : 'flex justify-start'}">
                            <div class="flex flex-col">
                                <div class="message-bubble ${bubbleClass} shadow-md">${content}</div>
                                <span class="text-xs text-slate-500 mt-1 ${isOutgoing ? 'text-right' : 'text-left'}">${new Date(message.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    `;
                }
                return html;
            }).join('');

            return messagesHtml;
        }

        function renderMessages(messages) {
    // Генерирует HTML (TG-like), без прямой работы со скроллом (скроллом управляет fetchMessages)
    messages.reverse();
    let lastDate = null;
    const messagesHtml = messages.map(message => {
                try{
                    const se = message.sender_effect || ((currentUser && message.sender_id === currentUser.id) ? (currentUser.active_effect || null) : null);
                    if (se) message.sender_effect = se;
                }catch(e){}
        const messageDate = new Date(message.timestamp * 1000);
        const messageDateStr = messageDate.toLocaleDateString();
        
        let dateSeparator = '';
        if (lastDate !== messageDateStr) {
            lastDate = messageDateStr;
            const today = new Date().toLocaleDateString();
            const yesterday = new Date(Date.now() - 86400000).toLocaleDateString();
            
            let displayDate;
            if (messageDateStr === today) {
                displayDate = 'Сегодня';
            } else if (messageDateStr === yesterday) {
                displayDate = 'Вчера';
            } else {
                displayDate = messageDate.toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
            }
            
            dateSeparator = `<div class="date-separator"><span class="date-separator-line">${displayDate}</span></div>`;
        }

        const isSystem = message.type === 'system' || message.type === 'system_gift' || message.type === 'system_boost';
        const isSecurity = message.type === 'security';
        const isOutgoing = message.sender_id === currentUser.id;
        const isBot = message.sender_id === 'security_bot' || message.sender_id === 'verification_bot';

        const msgId = (message && (message.id ?? message.message_id ?? message.msg_id ?? message.mid)) ?? null;
        // Favorites state (local on device)
        let isFav = false;
        try{ if (msgId !== null && typeof isFavoriteMessage === 'function') { isFav = isFavoriteMessage(currentChatId, msgId); } }catch(e){}
        const favBtn = (msgId !== null)
            ? `<button class="msg-fav-btn ${isFav ? 'is-fav' : ''}" type="button" data-fav-btn="1" data-chat-id="${currentChatId}" data-msg-id="${msgId}" data-outgoing="${isOutgoing ? 1 : 0}" title="${isFav ? 'Убрать из избранного' : 'В избранное'}">${isFav ? '⭐' : '☆'}</button>`
            : '';

        if (isSystem) {
            const raw = String(message.content || '');

            // Красивый вид для system_gift (показываем весь подарок)
            if (message.type === 'system_gift') {
                const emoji = String(message.gift_emoji || extractGiftEmojiFromSystemText(raw) || guessEmojiFromText(raw) || '🎁');
                let baseKey = message.gift_key || null;
                if (!baseKey) {
                    baseKey = Object.keys(GIFTS_STORE).find(k => String((GIFTS_STORE[k] && GIFTS_STORE[k].emoji) || '') === emoji) || null;
                }
                const g = baseKey ? GIFTS_STORE[baseKey] : null;
                const safeTitle = escapeHtml(g ? g.name : 'Подарок');
                const safeSub = escapeHtml(raw);
                const style = (g && g.grad) ? `--gift-grad:${g.grad};` : '';
                const fxClass = (baseKey === 'dragon') ? 'fx-dragon' : ((baseKey === 'phoenix') ? 'fx-phoenix' : '');
                return `${dateSeparator}
                    <div class="system-message-row">
                        <div class="system-gift-card ${fxClass}" style="${style}">
                            <div class="system-gift-inner">
                                ${renderGiftVisual({ emoji }, { className: 'system-gift-art' })}
                                <div class="text-left">
                                    <div class="system-gift-title">🎁 ${safeTitle}</div>
                                    <div class="system-gift-sub">${safeSub}</div>
                                </div>
                            </div>
                        </div>
                    </div>`;
            }

            // Красивый вид для system_boost (перевод ⚡)
            if (message.type === 'system_boost') {
                const gross = parseInt(message.amount_gross ?? extractNumberFromText(raw) ?? '0', 10) || 0;
                const net = parseInt(message.amount_net ?? '0', 10) || 0;
                const fee = parseInt(message.fee_pct ?? '25', 10) || 25;
                const safeSub = escapeHtml(raw);
                return `${dateSeparator}
                    <div class="system-message-row">
                        <div class="system-gift-card" style="--gift-grad:linear-gradient(135deg,#0ea5e9,#7c3aed);">
                            <div class="system-gift-inner">
                                <div class="system-gift-art"><div class="system-gift-emoji">⚡</div></div>
                                <div class="text-left">
                                    <div class="system-gift-title">⚡ ${t('Перевод бустов')}</div>
                                    <div class="system-gift-sub">${safeSub}</div>
                                    ${gross ? `<div class="text-xs text-slate-200 mt-1">${t('Списано')}: <b>${gross} ⚡</b> • ${t('Получено')}: <b>${net} ⚡</b> • ${t('Комиссия')}: ${fee}%</div>` : ``}
                                </div>
                            </div>
                        </div>
                    </div>`;
            }

            const sysText = escapeHtml(raw);
            return `${dateSeparator}<div class="system-message-row"><div class="message-bubble message-system text-center italic mt-2">${sysText}</div></div>`;
        }

        // Определение контента сообщения
        let content = '';
        let showAvatar = (currentChatData.chatType === 'general' || currentChatData.chatType === 'channel' || currentChatData.chatType === 'group' || isBot) && !isOutgoing;
        
        if (message.type === 'photo') {
            content = `<img src="${message.file_path}" alt="Фото" class="max-w-full rounded-lg cursor-pointer" onclick="window.open(this.src)">`;
        } 
        else if (message.type === 'audio') {
            content = `
                <div class="audio-message p-2 min-w-[200px]">
                    <div class="flex items-center mb-2">
                        <div class="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center mr-3 text-white flex-shrink-0">🎵</div>
                        <div class="overflow-hidden min-w-0">
                            <p class="text-sm font-bold truncate text-white">${escapeHtml(message.file_name || 'Музыка')}</p>
                            <p class="text-xs text-slate-300">${escapeHtml(formatBytes(message.file_size || 0))} • ${escapeHtml((message.file_ext || 'AUDIO').toUpperCase())}</p>
                        </div>
                    </div>
                    <audio controls src="${message.file_path}" class="w-full h-8" preload="none">
                        Ваш браузер не поддерживает аудио элемент.
                    </audio>
                </div>
            `;
            // Для аудио скрываем аватар, чтобы не мешал плееру
            showAvatar = false;
        }
        else if (message.type === 'file') {
            const safeName = String(message.file_name || 'file').replace(/'/g, "\\'");
            const safePath = String(message.file_path || '').replace(/'/g, "\\'");
            const safeExt = String(message.file_ext || '').replace(/'/g, "\\'");
            const safeSize = String(message.file_size || '').replace(/'/g, "\\'");

            content = `
                <div class="file-message p-2 min-w-[200px]">
                    <div class="flex items-center mb-3">
                        <div class="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mr-3 border border-slate-600 flex-shrink-0">
                            <span class="text-2xl">📄</span>
                        </div>
                        <div class="overflow-hidden min-w-0">
                            <p class="font-bold text-sm truncate text-white mb-1">${escapeHtml(message.file_name || 'Файл')}</p>
                            <div class="flex items-center gap-2">
                                <span class="text-xs bg-slate-600 px-2 py-1 rounded uppercase">${escapeHtml(message.file_ext || 'FILE')}</span>
                                <span class="text-xs text-slate-400">${escapeHtml(formatBytes(message.file_size || 0))}</span>
                            </div>
                        </div>
                    </div>
                    
                    <button onclick="addToFileManager('${safePath}', '${safeName}', '${safeSize}', '${safeExt}')" 
                            class="primary-button w-full text-xs py-2 bg-slate-700 hover:bg-slate-600 border border-slate-500 flex items-center justify-center gap-2">
                        📥 Добавить в Файловый менеджер
                    </button>
                </div>
            `;
            // Для файлов скрываем аватар
            showAvatar = false;
        }
        else if (message.type === 'video') {
            content = `
                <div class="video-message p-2 min-w-[220px]">
                    <div class="flex items-center mb-2">
                        <div class="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3 text-white flex-shrink-0">🎬</div>
                        <div class="overflow-hidden min-w-0">
                            <p class="text-sm font-bold truncate text-white">${escapeHtml(message.file_name || 'Видео')}</p>
                            <p class="text-xs text-slate-300">${escapeHtml(formatBytes(message.file_size || 0))} • ${escapeHtml((message.file_ext || 'VIDEO').toUpperCase())}</p>
                        </div>
                    </div>
                    <video controls src="${message.file_path}" class="w-full rounded-lg" preload="metadata"></video>
                </div>
            `;
            // Для видео скрываем аватар, чтобы ширины хватало
            showAvatar = false;
        }
        else {
            // Обычный текст
            content = escapeHtml(message.content || '');
        }
        
        const senderName = isOutgoing ? 'Вы' : (message.sender_name || 'Неизвестный');
        const senderNameSafe = escapeHtml(senderName);
        let bubbleClass = isOutgoing ? 'message-outgoing' : 'message-incoming';
        

        if (isSecurity) {
            bubbleClass += ' security-message';
        }

        const containerClass = isOutgoing ? 'flex justify-end' : 'message-with-avatar';
        
        let html = '';
        if (showAvatar) {
            html = `
                ${dateSeparator}
                <div class="${containerClass}" data-msg-id="${msgId ?? ''}">
                    <img src="${message.sender_avatar}" alt="Аватар" class="avatar ${message.sender_effect==='dragon'?'fx-dragon-ring':''}" ${!isBot ? `data-action="open-profile" data-user-id="${message.sender_id}"` : ''}>
                    <div class="flex flex-col max-w-[85%]">
                        <p class="text-xs font-semibold mb-1 text-slate-400 ml-1">${senderNameSafe}</p>
                        <div class="bubble-actions ${isOutgoing ? 'outgoing' : 'incoming'}">
                            ${isOutgoing ? favBtn : ''}
                            <div class="message-bubble ${bubbleClass} shadow-md" data-msg-id="${msgId ?? ''}" data-action="msg-menu">${content}</div>
                            ${!isOutgoing ? favBtn : ''}
                        </div>
                        ${renderReactionsRow(message, msgId)}
                        ${(currentChatData.chatType === 'channel' && msgId) ? `<div class="mt-2"><button class="secondary-button text-xs px-3 py-1 channel-comment-btn" type="button" onclick="event.stopPropagation(); openLinkedDiscussionGroup('${currentChatId}','${msgId}','${_musicSafeJs(message.content || message.file_name || 'Пост')}')"><svg class="tg-svg" aria-hidden="true"><use href="#ico-comments"></use></svg><span>Комментарии</span></button></div>` : ''}
                        <span class="text-xs text-slate-500 mt-1 ml-1">${new Date(message.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
            `;
        } else {
            html = `
                ${dateSeparator}
                <div class="${isOutgoing ? 'flex justify-end' : 'flex justify-start'}" data-msg-id="${msgId ?? ''}">
                    <div class="flex flex-col max-w-[85%]">
                        <div class="bubble-actions ${isOutgoing ? 'outgoing' : 'incoming'}">
                            ${isOutgoing ? favBtn : ''}
                            <div class="message-bubble ${bubbleClass} shadow-md" data-msg-id="${msgId ?? ''}" data-action="msg-menu">${content}</div>
                            ${!isOutgoing ? favBtn : ''}
                        </div>
                        ${renderReactionsRow(message, msgId)}
                        ${(currentChatData.chatType === 'channel' && msgId) ? `<div class="mt-2 ${isOutgoing ? 'text-right' : 'text-left'}"><button class="secondary-button text-xs px-3 py-1 channel-comment-btn" type="button" onclick="event.stopPropagation(); openLinkedDiscussionGroup('${currentChatId}','${msgId}','${_musicSafeJs(message.content || message.file_name || 'Пост')}')"><svg class="tg-svg" aria-hidden="true"><use href="#ico-comments"></use></svg><span>Комментарии</span></button></div>` : ''}
                        <span class="text-xs text-slate-500 mt-1 ${isOutgoing ? 'text-right' : 'text-left'} mr-1">${new Date(message.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
            `;
        }
        return html;
    }).join('');
    return messagesHtml;
}

        function pulseComposer(){
            const form = document.getElementById('message-form');
            if (!form) return;
            form.classList.remove('composer-pulse');
            // restart animation
            void form.offsetWidth;
            form.classList.add('composer-pulse');
            setTimeout(() => form.classList.remove('composer-pulse'), 500);
        }

        async function sendMessage() {
    const input = document.getElementById('message-input');
    const content = input.value.trim();
    const sendButton = document.querySelector('#message-form button[type="submit"]');

    if (!content && !currentAttachment) {
        showModal('Ошибка', 'Сообщение не может быть пустым.');
        return;
    }
    
    sendButton.disabled = true;

    // ЛОГИКА РЕДАКТИРОВАНИЯ
    if (editingMessageId) {
        const result = await apiRequest('edit_message', {
            chat_id: currentChatId,
            message_id: editingMessageId,
            new_content: content
        });

        if (result.success) {
                hideCaptcha();
            cancelEditMessage(); // Сброс режима
            fetchMessages(currentChatId); // Обновляем чат
        } else {
            showModal('Ошибка', result.error || 'Не удалось изменить сообщение');
        }
        sendButton.disabled = false;
        return; // Выходим, чтобы не отправлять как новое
    }

    // ЛОГИКА ОТПРАВКИ НОВОГО (старый код)
    const formData = new FormData();
    formData.append('action', 'send_message');
    formData.append('chat_id', currentChatId);
    if (window.commentThreadContext && String(window.commentThreadContext.linkedGroupId || '') === String(currentChatId || '')) {
        formData.append('comment_thread_channel_id', window.commentThreadContext.channelId || '');
        formData.append('comment_thread_message_id', window.commentThreadContext.messageId || '');
        formData.append('comment_thread_title', window.commentThreadContext.title || '');
        formData.append('comment_thread_preview', window.commentThreadContext.preview || '');
        formData.append('is_channel_comment', '1');
    }
    formData.append('content', content);
    if (currentAttachment) {
        if (!currentAttachment.uploaded || !currentAttachment.upload_token) {
            showModal('Подождите', 'Файл ещё загружается. Попробуйте отправить сообщение через секунду.');
            sendButton.disabled = false;
            return;
        }
        formData.append('upload_token', currentAttachment.upload_token);
    }
    
    const result = await apiRequest('send_message', formData, true);

    if (result.success) {
                hideCaptcha();
        input.value = '';
        autoGrowTextarea(input);
        clearAttachments();
        fetchMessages(currentChatId, true);
        fetchChats();
    } else {
        if (result.error && result.error.includes('заблокирован')) {
            showModal('Аккаунт заблокирован', result.error, false, () => logout());
        } else {
            showModal('Ошибка', result.error || 'Не удалось отправить сообщение.');
        }
    }
    
    sendButton.disabled = false;
}

        function confirmDeleteChat(chatId, chatName) {
            showModal('Удалить чат?', `Вы уверены, что хотите удалить чат с <strong>${chatName}</strong>? Это действие необратимо.`, true, () => {
                deleteChat(chatId);
            });
        }
        
        async function confirmDeleteChannel(channelId, channelName){
        // Скрываем окно настроек, чтобы показать модалку подтверждения
        document.getElementById('channel-settings-modal').classList.add('hidden');
        
        showModal(
            'Удалить канал?', 
            `Вы уверены, что хотите <strong>НАВСЕГДА удалить</strong> канал "${channelName}"? <br>Все участники будут исключены, а история сообщений удалена.`, 
            true, 
            async () => {
                const result = await apiRequest('delete_chat', { chat_id: channelId });
                if (result.success) {
                hideCaptcha();
                    showModal('Успех', 'Канал успешно удален.', false, () => {
                        switchScreen('channels_groups');
                    });
                } else {
                    showModal('Ошибка', result.error || 'Не удалось удалить канал.');
                }
            }
        );
    }

        async function deleteChat(chatId) {
            const result = await apiRequest('delete_chat', { chat_id: chatId });
            if (result.success) {
                hideCaptcha();
                showModal('Успех', 'Чат удален.', false, () => {
                    window.__screenHistoryBootstrapped = false;
                    switchScreen('chats_list');
                });
            } else {
                showModal('Ошибка', result.error || 'Не удалось удалить чат.');
            }
        }

        async function fetchNotifications(silent = false) {
            const result = await apiRequest('get_notifications', {}, false, { silent: !!silent });
            if (result.success) {
                hideCaptcha();
                notifications = Array.isArray(result.notifications) ? result.notifications : [];

                try{
                    const fresh = notifications
                        .filter(n => n && !n.read && n.id && !__seenNotificationIds.has(String(n.id)))
                        .sort((a,b) => (a.timestamp||0) - (b.timestamp||0));
                    for (const n of fresh){
                        const title = String(n.title || 'Уведомление');
                        const message = String(n.message || 'У вас новое событие');
                        if (n.type === 'gift') {
                            const emoji = guessEmojiFromText(message || title || '🎁');
                            showGiftToast({ emoji, title: '🎁 Вам подарок!', text: message || 'Вам подарили подарок' });
                        } else {
                            showSiteNoticeToast(title, message);
                        }
                        try{ await showNativeNotification(title, message); }catch(e){}
                        try{ __seenNotificationIds.add(String(n.id)); }catch(e){}
                    }
                }catch(e){}

                updateNotificationBadge();
                if (currentScreen === 'notifications') {
                    renderNotificationsView();
                }
            }
        }

        function updateNotificationBadge() {
    const unreadCount = notifications.filter(n => !n.read).length;

    // Old tab-bar badge (kept for compatibility even if tab-bar hidden)
    const mainBadge = document.getElementById('notification-badge');
    if (mainBadge) {
        if (unreadCount > 0) {
            mainBadge.textContent = unreadCount;
            mainBadge.classList.remove('hidden');
        } else {
            mainBadge.classList.add('hidden');
        }
    }

    // New: drawer badge (mobile) + desktop sidebar badge
    const tgBadge = document.getElementById('tg-notification-badge');
    const desktopBadge = document.getElementById('desktop-notification-badge');

    [tgBadge, desktopBadge].forEach((el) => {
        if (!el) return;
        if (unreadCount > 0) {
            el.textContent = unreadCount;
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    });
}

        function renderNotificationsView() {
            const notificationsHtml = notifications.length > 0 ? 
                notifications.map(notification => `
                    <div class="card mb-3 ${notification.read ? 'opacity-70' : 'border-l-4 border-primary'}">
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <h4 class="font-bold ${notification.read ? 'text-slate-400' : 'text-white'}">${notification.title}</h4>
                                <p class="text-sm mt-1">${notification.message}</p>
                                <p class="text-xs text-slate-500 mt-2">${new Date(notification.timestamp * 1000).toLocaleString()}</p>
                            </div>
                            ${!notification.read ? `
                                <button onclick="markNotificationAsRead('${notification.id}')" class="primary-button text-sm px-3 py-1 ml-2">
                                    Прочитано
                                </button>
                            ` : ''}
                        </div>
                    </div>
                `).join('') :
                '<p class="text-slate-400 text-center py-8">У вас пока нет уведомлений.</p>';

            const html = `
                <div id="notifications_view" class="p-4 flex flex-col h-full">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="section-title">Уведомления</h2>
                        <div class="flex gap-2 flex-wrap">
                            <button onclick="enablePushNotifications()" class="secondary-button text-sm">Включить push</button>
                            ${notifications.length > 0 ? `
                            <button onclick="confirmClearNotifications()" class="secondary-button text-sm">
                                Очистить все
                            </button>
                        ` : ''}
                        </div>
                    </div>
                    <div id="notifications-list" class="flex-grow overflow-y-auto">
                        ${notificationsHtml}
                    </div>
                </div>
            `;
            document.getElementById('screen-container').innerHTML = `<div id="notifications_screen_content" class="screen-content">${html}</div>`;
        }

        async function markNotificationAsRead(notificationId) {
            const result = await apiRequest('mark_notification_read', { notification_id: notificationId });
            if (result.success) {
                hideCaptcha();
                fetchNotifications();
            }
        }

        function confirmClearNotifications() {
            showModal('Очистить уведомления?', 'Вы уверены, что хотите удалить все уведомления?', true, clearNotifications);
        }

        async function clearNotifications() {
            const result = await apiRequest('clear_notifications');
            if (result.success) {
                hideCaptcha();
                fetchNotifications();
            }
        }

        async function fetchChannels() {
            const result = await apiRequest('get_channels');
            if (result.success) {
                hideCaptcha();
                channels = result.channels;
            }
        }

        async function fetchGroups() {
            const result = await apiRequest('get_groups');
            if (result.success) {
                hideCaptcha();
                groups = result.groups;
            }
        }



        let __musicHubState = { waveSeed: 'auto', waveTerms: [], queue: [], recommendations: [], newReleases: [] };

        function _musicSafeJs(value){ return String(value || '').replace(/\\/g,'\\\\').replace(/'/g, "\\'"); }
        function _musicCoverHtml(src, fallback = '♪'){ const art = String(src || '').trim(); return art ? `<div class="music-cover"><img src="${escapeHtml(art)}" alt=""></div>` : `<div class="music-cover">${fallback}</div>`; }
        function _musicReleaseArt(src){ const art = String(src || '').trim(); return art ? `<div class="music-release-art"><img src="${escapeHtml(art)}" alt=""></div>` : `<div class="music-release-art">♫</div>`; }
        function _musicPlayableButton(it, label = 'Слушать'){
            const mode = String((it && it.mode) || 'open');
            const url = _musicSafeJs(it && (it.url || it.open_url));
            const title = _musicSafeJs(it && (it.title || 'Трек'));
            if (!url) return '';
            if (mode === 'play') return `<button class="primary-button" type="button" onclick="playGlobalTrack('${url}','${title}')">${label}</button>`;
            if (mode === 'embed') return `<button class="primary-button" type="button" onclick="showExternalEmbedModal('${url}','${title}')">${label}</button>`;
            return `<button class="secondary-button" type="button" onclick="window.open('${url}','_blank','noopener')">Открыть</button>`;
        }
        function playMusicWaveQueue(startIndex = 0){
            const arr = Array.isArray(__musicHubState.queue) ? __musicHubState.queue : [];
            if (!arr.length) return;
            const playable = arr.map(it => ({
                url: it.url || it.open_url,
                title: it.title || 'Трек',
                meta: { artwork: it.artwork || '', artist: it.artist || '', note: it.note || '', source: it.source || 'Wave', mode: it.mode || 'open', open_url: it.open_url || it.url || '' }
            })).filter(it => !!it.url);
            if (!playable.length) return;
            playGlobalTrack(playable[Math.max(0, Math.min(playable.length - 1, Number(startIndex) || 0))].url, playable[Math.max(0, Math.min(playable.length - 1, Number(startIndex) || 0))].title, {
                queue: playable,
                index: Math.max(0, Math.min(playable.length - 1, Number(startIndex) || 0)),
                source: { type:'mywave', seed: __musicHubState.waveSeed || 'auto', terms: __musicHubState.waveTerms || [] },
                autoplay: true
            });
        }
        function renderMusicRecommendations(items){
            const root = document.getElementById('music-recommendations-results');
            if (!root) return;
            const arr = Array.isArray(items) ? items : [];
            __musicHubState.recommendations = arr;
            if (!arr.length){ root.innerHTML = '<div class="text-sm text-slate-400">Рекомендации появятся после первого поиска или запуска волны.</div>'; return; }
            root.innerHTML = arr.map((it, idx) => `
                <div class="music-reco-card">
                    ${_musicCoverHtml(it.artwork)}
                    <div class="min-w-0">
                        <div class="music-reco-title">${idx + 1}. ${escapeHtml(it.title || 'Трек')}</div>
                        <div class="music-reco-sub">${escapeHtml(it.artist || it.source || 'Для тебя')}${it.note ? ' • ' + escapeHtml(it.note) : ''}</div>
                        <div class="music-actions">${_musicPlayableButton(it)}${it.open_url ? `<button class="secondary-button" type="button" onclick="window.open('${_musicSafeJs(it.open_url)}','_blank','noopener')">Источник</button>` : ''}</div>
                    </div>
                </div>`).join('');
        }
        function renderMusicNewReleases(items){
            const root = document.getElementById('music-new-releases');
            if (!root) return;
            const arr = Array.isArray(items) ? items : [];
            __musicHubState.newReleases = arr;
            if (!arr.length){ root.innerHTML = '<div class="text-sm text-slate-400">Свежие релизы скоро подтянутся.</div>'; return; }
            root.innerHTML = arr.map(it => `
                <div class="music-release-card">
                    ${_musicReleaseArt(it.artwork)}
                    <div>
                        <div class="music-release-title">${escapeHtml(it.title || 'Релиз')}</div>
                        <div class="music-release-sub">${escapeHtml(it.artist || it.source || 'Release')}${it.note ? ' • ' + escapeHtml(it.note) : ''}</div>
                    </div>
                    <div class="music-actions">${_musicPlayableButton(it, 'Открыть')}${it.open_url && it.mode !== 'open' ? `<button class="secondary-button" type="button" onclick="window.open('${_musicSafeJs(it.open_url)}','_blank','noopener')">Источник</button>` : ''}</div>
                </div>`).join('');
        }

        async function renderMusicHubView(){
            const initial = await apiRequest('search_music_catalog', { query: '' });
            const playlists = (initial && initial.success && Array.isArray(initial.playlists)) ? initial.playlists : [];
            const html = `
                <div id="music_hub_view" class="p-4 flex flex-col h-full overflow-y-auto">
                    <div class="music-page">
                        <section class="music-hero-shell tg-tinted-surface">
                            <div class="music-hero-top">
                                <div>
                                    <div class="music-kicker"><span>●</span><span>CVG Music</span></div>
                                    <div class="music-hero-title">Моя волна, рекомендации и новые релизы в одном музыкальном экране</div>
                                    <div class="music-hero-copy">Интерфейс собран как современный стриминг-хаб: быстрый поиск, бесконечная волна, персональные рекомендации, свежие релизы и публичное прослушивание без регистрации там, где это разрешено площадкой.</div>
                                    <div class="music-hero-pills">
                                        <div class="music-hero-pill">Моя волна</div>
                                        <div class="music-hero-pill">Рекомендации для тебя</div>
                                        <div class="music-hero-pill">Новые релизы</div>
                                        <div class="music-hero-pill">Без регистрации где возможно</div>
                                    </div>
                                </div>
                                <button class="primary-button text-sm" onclick="document.getElementById('player-overlay')?.classList.remove('hidden')">Открыть плеер</button>
                            </div>
                            <div class="music-search-shell">
                                <input id="music-search-input" class="music-search-input" placeholder="Искать треки, артистов, релизы, плейлисты, площадки" onkeydown="if(event.key==='Enter'){ performMusicSearch(); }">
                                <button class="primary-button" onclick="performMusicSearch()">Найти</button>
                                <button class="secondary-button" onclick="runMyWave()">Запустить волну</button>
                            </div>
                            <div class="music-search-note">Прямо внутри приложения без регистрации играют локальные треки, Deezer preview, Apple Music preview и SoundCloud embed. Для остальных сервисов остаются быстрые переходы.</div>
                        </section>
                        <div class="music-overview-grid">
                            <div class="music-column">
                                <section class="music-panel">
                                    <div class="music-panel-header">
                                        <div><div class="music-panel-title">Моя волна</div><div class="music-panel-sub">Поток на базе запроса, похожих треков и свежих открытых источников</div></div>
                                        <div class="flex items-center gap-2"><span id="music-wave-seed" class="text-xs text-slate-400">Сид: auto</span><button class="secondary-button" type="button" onclick="playMusicWaveQueue(0)">Играть всё</button></div>
                                    </div>
                                    <div id="music-wave-results" class="music-wave-grid"></div>
                                </section>
                                <section class="music-panel">
                                    <div class="music-panel-header"><div><div class="music-panel-title">Рекомендуем</div><div class="music-panel-sub">Сочетание локальной музыки, похожих треков и топа площадок</div></div></div>
                                    <div id="music-recommendations-results" class="music-reco-grid"></div>
                                </section>
                                <section class="music-panel">
                                    <div class="music-panel-header"><div><div class="music-panel-title">Площадки</div><div class="music-panel-sub">Быстрые входы в каталоги и открытые источники</div></div></div>
                                    <div id="music-services-results" class="music-service-grid"></div>
                                </section>
                            </div>
                            <aside class="music-column">
                                <section class="music-panel">
                                    <div class="music-panel-header"><div><div class="music-panel-title">Новые релизы</div><div class="music-panel-sub">Свежие альбомы и заметные релизы</div></div></div>
                                    <div id="music-new-releases" class="music-release-grid"></div>
                                </section>
                                <section class="music-panel">
                                    <div class="music-panel-header"><div><div class="music-panel-title">Локальная музыка и быстрый плей</div><div class="music-panel-sub">Из мессенджера и публичных источников с мгновенным запуском</div></div></div>
                                    <div id="music-search-results" class="music-local-grid text-sm text-slate-400">Загружаю музыкальную подборку…</div>
                                </section>
                                <section class="music-panel">
                                    <div class="music-panel-header"><div><div class="music-panel-title">Плейлисты сообщества</div><div class="music-panel-sub">Открытые подборки внутри приложения</div></div></div>
                                    <div id="music-public-playlists" class="music-playlists-list"></div>
                                </section>
                            </aside>
                        </div>
                    </div>
                </div>`;
            document.getElementById('screen-container').innerHTML = `<div class="screen-content">${html}</div>`;
            renderMusicHubPlaylists(playlists);
            renderMusicServices((initial && initial.external_sources) || []);
            renderMusicWave((initial && initial.wave) || { queue: [], seed: 'auto', terms: [] });
            renderMusicRecommendations((initial && initial.recommendations) || []);
            renderMusicNewReleases((initial && initial.new_releases) || []);
            const root = document.getElementById('music-search-results');
            if (initial && initial.success) {
                const tracks = Array.isArray(initial.tracks) ? initial.tracks : [];
                const externalTracks = Array.isArray(initial.external_tracks) ? initial.external_tracks : [];
                if (root) root.innerHTML = renderExternalMusicResults(externalTracks) + (tracks.length ? tracks.slice(0, 8).map(tr => {
                    const url = _musicSafeJs(tr.url || '');
                    const title = _musicSafeJs(tr.title || 'Музыка');
                    const key = String(tr.track_key || '');
                    return `<div class="music-track-card"><div class="music-track-top"><div><div class="music-track-title">${escapeHtml(tr.title || 'Музыка')}</div><div class="music-track-sub">${escapeHtml(tr.sender_name || 'Пользователь')}</div></div><span class="music-badge">Messenger</span></div><div class="music-actions"><button class="primary-button" type="button" onclick="playGlobalTrack('${url}','${title}')">▶ Слушать</button><button class="secondary-button" type="button" onclick="openAddToPlaylistDialog('${url}','${title}')">+ В плейлист</button><button class="secondary-button" type="button" onclick="openTrackCommentsSheet('${key}','${title}')">💬 Комменты</button></div></div>`;
                }).join('') : '<div class="text-sm text-slate-400">Начни поиск, чтобы получить точную подборку.</div>');
            }
        }

        function renderMusicHubPlaylists(playlists){
            const root = document.getElementById('music-public-playlists');
            if (!root) return;
            const arr = Array.isArray(playlists) ? playlists : [];
            if (!arr.length){ root.innerHTML = '<div class="text-sm text-slate-400">Пока нет публичных плейлистов.</div>'; return; }
            root.innerHTML = arr.map(pl => `
                <div class="music-playlist-row">
                    <div class="min-w-0">
                        <div class="music-track-title">${escapeHtml(pl.name || 'Плейлист')}</div>
                        <div class="music-inline-stat">${escapeHtml(pl.owner_name || 'Пользователь')} • ${Number(pl.track_count || 0)} треков</div>
                    </div>
                    <button class="secondary-button" type="button" onclick="openPlaylistSheet('${String(pl.id||'').replace(/'/g, "\'")}')">Открыть</button>
                </div>`).join('');
        }

        function renderMusicServices(items){
            const root = document.getElementById('music-services-results');
            if (!root) return;
            const arr = Array.isArray(items) ? items : [];
            if (!arr.length){ root.innerHTML = '<div class="text-sm text-slate-400">Поиск откроет доступные площадки.</div>'; return; }
            root.innerHTML = arr.map(it => `
                <div class="music-service-card">
                    <div class="music-service-top">
                        <div>
                            <div class="music-service-name">${escapeHtml(it.name || 'Сервис')}</div>
                            <div class="music-service-sub">${escapeHtml(it.subtitle || '')}</div>
                        </div>
                        <span class="music-badge">${escapeHtml(it.kind || 'catalog')}</span>
                    </div>
                    <div class="music-actions"><button class="secondary-button" type="button" onclick="window.open('${String(it.url||'').replace(/'/g, "\'")}','_blank','noopener')">Открыть</button></div>
                </div>`).join('');
        }

        function renderMusicWave(payload){
            const root = document.getElementById('music-wave-results');
            const seed = document.getElementById('music-wave-seed');
            __musicHubState.waveSeed = (payload && payload.seed) || 'auto';
            __musicHubState.waveTerms = Array.isArray(payload && payload.terms) ? payload.terms : [];
            __musicHubState.queue = Array.isArray(payload && payload.queue) ? payload.queue : [];
            if (seed) seed.textContent = `Сид: ${escapeHtml(__musicHubState.waveSeed)}`;
            if (!root) return;
            const arr = __musicHubState.queue;
            if (!arr.length){ root.innerHTML = '<div class="text-sm text-slate-400">Запусти поиск или нажми «Запустить волну» — соберу живой поток рекомендаций.</div>'; return; }
            root.innerHTML = arr.map((it, idx) => `
                <div class="music-wave-card">
                    ${_musicCoverHtml(it.artwork)}
                    <div class="min-w-0">
                        <div class="music-wave-title">${idx + 1}. ${escapeHtml(it.title || 'Трек')}</div>
                        <div class="music-wave-sub">${escapeHtml(it.artist || it.source || 'Wave')}${it.note ? ' • ' + escapeHtml(it.note) : ''}</div>
                        <div class="music-actions">${_musicPlayableButton(it)}<button class="secondary-button" type="button" onclick="playMusicWaveQueue(${idx})">В очередь</button>${it.open_url ? `<button class="secondary-button" type="button" onclick="window.open('${_musicSafeJs(it.open_url)}','_blank','noopener')">Источник</button>` : ''}</div>
                    </div>
                </div>`).join('');
        }

        function renderExternalMusicResults(items){
            const arr = Array.isArray(items) ? items : [];
            if (!arr.length) return '';
            return `
                <div class="mb-3 text-xs uppercase tracking-[0.24em] text-slate-500">Площадки без регистрации</div>
                <div class="space-y-3 mb-4">${arr.map(it => {
                    const mode = String(it.mode || 'open');
                    const url = String(it.url || '').replace(/\\/g,'\\\\').replace(/'/g, "\'");
                    const openUrl = String(it.open_url || it.url || '').replace(/\\/g,'\\\\').replace(/'/g, "\'");
                    const title = String(it.title || 'Трек').replace(/\\/g,'\\\\').replace(/'/g, "\'");
                    const artist = escapeHtml(it.artist || it.source || 'Music');
                    const art = String(it.artwork || '').trim();
                    const artHtml = art ? `<img src="${escapeHtml(art)}" alt="" class="w-12 h-12 rounded-xl object-cover border border-slate-700">` : `<div class="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">♪</div>`;
                    let primary = `<button class="secondary-button" type="button" onclick="window.open('${openUrl}','_blank','noopener')">Открыть</button>`;
                    if (mode === 'play') primary = `<button class="primary-button" type="button" onclick="playGlobalTrack('${url}','${title}')">▶ Слушать</button>`;
                    if (mode === 'embed') primary = `<button class="primary-button" type="button" onclick="showExternalEmbedModal('${url}','${title}')">▶ Слушать</button>`;
                    const secondary = openUrl ? `<button class="secondary-button" type="button" onclick="window.open('${openUrl}','_blank','noopener')">↗ Источник</button>` : '';
                    return `<div class="music-track-card"><div class="flex items-center gap-3">${artHtml}<div class="min-w-0 flex-1"><div class="music-track-title">${escapeHtml(it.title || 'Трек')}</div><div class="music-track-sub">${artist}${it.note ? ' • ' + escapeHtml(it.note) : ''}</div></div><span class="music-badge">${escapeHtml(it.source || 'Source')}</span></div><div class="music-actions mt-3">${primary}${secondary}</div></div>`;
                }).join('')}</div>`;
        }

        async function runMyWave(){
            await performMusicSearch(true);
        }

        async function performMusicSearch(forceWave = false){
            const q = (document.getElementById('music-search-input')?.value || '').trim();
            const res = await apiRequest('search_music_catalog', { query: q });
            const root = document.getElementById('music-search-results');
            if (!root) return;
            if (!res || !res.success){ root.innerHTML = '<div class="text-sm text-red-400">Не удалось выполнить поиск.</div>'; return; }
            renderMusicHubPlaylists(res.playlists || []);
            renderMusicServices(res.external_sources || []);
            renderMusicWave(res.wave || { queue: [], seed: q || 'auto', terms: [] });
            renderMusicRecommendations(res.recommendations || []);
            renderMusicNewReleases(res.new_releases || []);
            const tracks = Array.isArray(res.tracks) ? res.tracks : [];
            const externalTracks = Array.isArray(res.external_tracks) ? res.external_tracks : [];
            if (!tracks.length && !externalTracks.length){ root.innerHTML = '<div class="text-sm text-slate-400">Ничего не найдено. Попробуй другой запрос или запусти волну.</div>'; if (forceWave) playMusicWaveQueue(0); return; }
            const externalHtml = renderExternalMusicResults(externalTracks);
            root.innerHTML = externalHtml + tracks.map(tr => {
                const url = _musicSafeJs(tr.url || '');
                const title = _musicSafeJs(tr.title || 'Музыка');
                const key = String(tr.track_key || '');
                return `
                    <div class="music-track-card">
                        <div class="music-track-top">
                            <div>
                                <div class="music-track-title">${escapeHtml(tr.title || 'Музыка')}</div>
                                <div class="music-track-sub">${escapeHtml(tr.sender_name || 'Пользователь')}</div>
                            </div>
                            <span class="music-badge">Messenger</span>
                        </div>
                        <div class="music-actions">
                            <button class="primary-button" type="button" onclick="playGlobalTrack('${url}','${title}')">▶ Слушать</button>
                            <button class="secondary-button" type="button" onclick="openAddToPlaylistDialog('${url}','${title}')">+ В плейлист</button>
                            <button class="secondary-button" type="button" onclick="openTrackCommentsSheet('${key}','${title}')">💬 Комменты</button>
                        </div>
                    </div>`;
            }).join('');
            if (forceWave) playMusicWaveQueue(0);
        }

        async function openTrackCommentsSheet(trackKey, trackTitle){
            const res = await apiRequest('get_track_comments', { track_key: trackKey });
            const items = (res && res.success && Array.isArray(res.comments)) ? res.comments : [];
            const listHtml = items.length ? items.map(c => `
                <div class="tg-tinted-surface rounded-xl p-3 border border-slate-700 mb-2">
                    <div class="text-sm font-bold">${escapeHtml(c.user_name || 'Пользователь')}</div>
                    <div class="text-sm mt-1">${escapeHtml(c.text || '')}</div>
                    <div class="text-xs text-slate-500 mt-2">${new Date((c.timestamp || 0) * 1000).toLocaleString()}</div>
                </div>`).join('') : '<div class="text-sm text-slate-400">Комментариев пока нет.</div>';
            const html = `
                <div class="sheet-head">
                    <div class="sheet-title">Комментарии к песне</div>
                    <div class="sheet-sub">${escapeHtml(trackTitle || 'Музыка')}</div>
                </div>
                <div style="padding:10px 12px 0;">
                    <textarea id="track-comment-input" class="input-field w-full" maxlength="500" placeholder="Оставить комментарий"></textarea>
                </div>
                <div class="sheet-actions">
                    <button class="sheet-btn" type="button" onclick="submitTrackComment('${trackKey}','${String(trackTitle||'').replace(/'/g, "\\'")}')"><span class="sheet-ico">💬</span>Отправить</button>
                    <button class="sheet-btn" type="button" onclick="closeSheet()"><span class="sheet-ico">✕</span>Закрыть</button>
                </div>
                <div style="padding:0 10px 12px; max-height:45vh; overflow:auto;">${listHtml}</div>`;
            openSheet(html);
        }

        async function submitTrackComment(trackKey, trackTitle){
            const text = (document.getElementById('track-comment-input')?.value || '').trim();
            if (!text){ showModal('Комментарий', 'Введите текст комментария.'); return; }
            const res = await apiRequest('add_track_comment', { track_key: trackKey, text });
            if (res && res.success){ hideCaptcha(); openTrackCommentsSheet(trackKey, trackTitle); }
            else showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось отправить комментарий.');
        }

        async function openChannelCommentsSheet(chatId, messageId, preview){
            const res = await apiRequest('get_channel_comments', { chat_id: chatId, message_id: messageId });
            const items = (res && res.success && Array.isArray(res.comments)) ? res.comments : [];
            const body = items.length
                ? items.map(c => `<div class="tg-tinted-surface rounded-2xl p-3 border border-white/8"><div class="text-sm font-bold">${escapeHtml(c.user_name || c.sender_name || 'Пользователь')}</div><div class="text-xs text-slate-400 mt-1">${formatTime(c.timestamp || Date.now()/1000)}</div><div class="text-sm mt-2 whitespace-pre-wrap">${escapeHtml(c.text || c.content || '')}</div></div>`).join('')
                : '<div class="text-sm text-slate-400">Пока нет комментариев. Напиши первым.</div>';
            const linkedBtn = (res && res.linked_group_id)
                ? `<button class="secondary-button text-xs px-3 py-1" type="button" onclick="openLinkedDiscussionGroup('${chatId}','${messageId}','${_musicSafeJs((res && res.post_preview) || preview || '')}')">Открыть группу</button>`
                : '';
            openBottomSheet(`
                <div class="sheet-title">Комментарии к посту</div>
                <div class="text-xs text-slate-400">${escapeHtml((res && res.post_preview) || preview || 'Пост')}</div>
                <div class="space-y-3 mt-3 mb-3 max-h-[46vh] overflow-y-auto">${body}</div>
                <div class="space-y-2">
                    <textarea id="channel-comment-input" class="input-field w-full h-24" maxlength="500" placeholder="Написать комментарий"></textarea>
                    <div class="flex items-center justify-between gap-2 mt-2">
                        <button class="secondary-button text-xs px-3 py-1" type="button" onclick="submitChannelComment('${chatId}','${messageId}','${_musicSafeJs(preview || '')}')">Отправить</button>
                        ${linkedBtn}
                    </div>
                </div>
            `);
        }

        async function submitChannelComment(chatId, messageId, preview){
            const text = (document.getElementById('channel-comment-input')?.value || '').trim();
            if (!text){ showModal('Комментарий', 'Введите текст комментария.'); return; }
            const res = await apiRequest('add_channel_comment', { chat_id: chatId, message_id: messageId, text });
            if (res && res.success){ hideCaptcha(); openChannelCommentsSheet(chatId, messageId, preview); }
            else showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось отправить комментарий.');
        }

        async function openChatById(chatId){
            const id = String(chatId || '').trim();
            if (!id) return false;
            try { await fetchChats(); } catch(e) {}
            const entry = Array.isArray(chatsData) ? chatsData.find(c => String(c.id || '') === id) : null;
            if (!entry) {
                showModal('Ошибка', 'Не удалось открыть чат или группу.');
                return false;
            }
            switchScreen('chat_view', {
                chatId: entry.id,
                chatName: entry.name,
                chatType: entry.type,
                interlocutorId: entry.other_id || null,
                interlocutorAvatar: entry.avatar || '/default.png'
            });
            return true;
        }

        async function openLinkedDiscussionGroup(channelId, messageId, preview){
            const res = await apiRequest('get_channel_comments', { chat_id: channelId, message_id: messageId });
            if (!res || !res.success){
                showModal('Комментарии', (res && res.error) ? res.error : 'Не удалось открыть комментарии.');
                return;
            }
            if (!res.linked_group_id){
                await openChannelCommentsSheet(channelId, messageId, preview);
                return;
            }
            window.commentThreadContext = {
                channelId,
                messageId,
                linkedGroupId: res.linked_group_id,
                title: res.thread_title || 'Обсуждение поста',
                preview: res.post_preview || preview || ''
            };
            const opened = await openChatById(res.linked_group_id);
            if (!opened) {
                await openChannelCommentsSheet(channelId, messageId, preview);
                return;
            }
            setTimeout(() => { try { renderThreadBanner(); loadMessages(); } catch(e){} }, 60);
        }

        function getFilteredThreadMessages(messages){
            const ctx = window.commentThreadContext || null;
            if (!ctx || String(currentChatId || '') !== String(ctx.linkedGroupId || '')) return Array.isArray(messages) ? messages : [];
            return (Array.isArray(messages) ? messages : []).filter(msg => String(msg.comment_thread_channel_id || '') === String(ctx.channelId || '') && String(msg.comment_thread_message_id || '') === String(ctx.messageId || ''));
        }

        function renderThreadBanner(){
            const host = document.getElementById('comment-thread-banner');
            if (!host) return;
            const ctx = window.commentThreadContext || null;
            if (!ctx || String(currentChatId || '') !== String(ctx.linkedGroupId || '')) {
                host.classList.add('hidden');
                host.innerHTML = '';
                return;
            }
            host.classList.remove('hidden');
            host.innerHTML = `
                <div class="mx-3 mb-2 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3">
                    <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0">
                            <div class="text-sm font-bold text-white">${escapeHtml(ctx.title || 'Обсуждение поста')}</div>
                            <div class="text-xs text-slate-400 mt-1 line-clamp-2">${escapeHtml(ctx.preview || 'Комментарии к посту канала')}</div>
                        </div>
                        <button class="secondary-button text-xs px-3 py-1" type="button" onclick="closeDiscussionThread()">Закрыть</button>
                    </div>
                </div>`;
        }

        function closeDiscussionThread(){
            window.commentThreadContext = null;
            renderThreadBanner();
            loadMessages();
        }


        function buildEvidencePickerHtml(inputId, labelText){
            return `
                <label class="report-proof-picker" for="${inputId}">
                    <div>
                        <div class="font-semibold text-white">${labelText}</div>
                        <div class="report-proof-name" id="${inputId}-name">Можно прикрепить скриншот, фото или файл</div>
                    </div>
                    <span class="secondary-button !px-3 !py-2">Выбрать файл</span>
                    <input id="${inputId}" type="file" accept="image/*,.pdf,.txt,.doc,.docx,.zip,.rar">
                </label>`;
        }

        function bindEvidencePicker(inputId){
            const input = document.getElementById(inputId);
            const nameEl = document.getElementById(`${inputId}-name`);
            if (!input || !nameEl) return;
            input.addEventListener('change', () => {
                const file = input.files && input.files[0];
                nameEl.textContent = file ? `${file.name} • ${(file.size/1024/1024).toFixed(2)} MB` : 'Можно прикрепить скриншот, фото или файл';
            });
        }

        async function submitReportFormData(actionName, payload, evidenceInputId){
            const fd = new FormData();
            fd.append('action', actionName);
            fd.append('device_fingerprint', getDeviceFingerprint());
            Object.entries(payload || {}).forEach(([k,v]) => fd.append(k, v == null ? '' : String(v)));
            const fileInput = evidenceInputId ? document.getElementById(evidenceInputId) : null;
            if (fileInput && fileInput.files && fileInput.files[0]) fd.append('evidence', fileInput.files[0]);
            return apiRequest(actionName, fd, true);
        }

        async function openReportMessageModal(messageId) {
            const msgs = (window.__messagesCache && window.__messagesCache[String(currentChatId)]) ? window.__messagesCache[String(currentChatId)] : [];
            const msg = Array.isArray(msgs) ? msgs.find(m => String(m.id) === String(messageId)) : null;
            if (!msg) return showModal('Ошибка', 'Сообщение не найдено.');
            if (String(currentChatId) !== 'general') return showModal('Жалоба', 'Жалобы на сообщения доступны только в Общем чате.');
            if (msg.sender_id === currentUser.id) return showModal('Жалоба', 'Нельзя пожаловаться на своё сообщение.');
            const reasonsRes = await apiRequest('get_report_reasons');
            const reasons = (reasonsRes && reasonsRes.success) ? (reasonsRes.reasons || {}) : {};
            const options = Object.entries(reasons).map(([key, label]) => `<option value="${escapeHtml(key)}">${escapeHtml(label)}</option>`).join('');
            const senderName = escapeHtml(msg.sender_name || 'Пользователь');
            const preview = escapeHtml(shortMsgPreview(msg));
            showModal('Жалоба на сообщение', `
                <div class="text-left space-y-3">
                    <div class="rounded-2xl border border-white/10 bg-slate-900/60 p-3">
                        <div class="text-sm font-semibold text-white">${senderName}</div>
                        <div class="text-xs text-slate-400 mt-1">Общий чат</div>
                        <div class="text-sm text-slate-200 mt-2 whitespace-pre-wrap">${preview}</div>
                    </div>
                    <label class="block">Причина<select id="report-message-reason" class="input-field mt-2">${options}</select></label>
                    <label class="block">Комментарий<textarea id="report-message-comment" class="input-field w-full h-24 mt-2" placeholder="Что нарушает это сообщение?"></textarea></label>
                    ${buildEvidencePickerHtml('report-message-evidence','Доказательства')}
                </div>`, true, async () => {
                    const reason = document.getElementById('report-message-reason')?.value || 'other';
                    const comment = document.getElementById('report-message-comment')?.value || '';
                    const result = await submitReportFormData('submit_message_report', { chat_id: currentChatId, message_id: messageId, reason, comment }, 'report-message-evidence');
                    if (result && result.success) { hideCaptcha(); showModal('Жалоба отправлена', 'Жалоба отлично подана , ожидайте рассмотрения'); }
                    else showModal('Ошибка', (result && result.error) ? result.error : 'Не удалось отправить жалобу.');
                });
            bindEvidencePicker('report-message-evidence');
        }


        function openReportUserModal(userId) {
            apiRequest('get_user_profile', { user_id: userId }).then(res => {
                if (!res || !res.success) return showModal('Ошибка', 'Не удалось загрузить профиль для жалобы.');
                const user = res.user || {};
                const reasons = user.report_reasons || {};
                const options = Object.entries(reasons).map(([key, label]) => `<option value="${escapeHtml(key)}">${escapeHtml(label)}</option>`).join('');
                showModal('Жалоба на пользователя', `
                    <div class="text-left space-y-3">
                        <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-3">
                            <img src="${escapeHtml(user.avatar || '/default.png')}" alt="" class="w-12 h-12 rounded-full object-cover">
                            <div class="min-w-0">
                                <div class="font-semibold text-white truncate">${escapeHtml(user.name || user.username || 'Пользователь')}</div>
                                <div class="text-xs text-slate-400 truncate">@${escapeHtml(user.username || 'user')}</div>
                            </div>
                        </div>
                        <label class="block">Причина<select id="report-reason" class="input-field mt-2">${options}</select></label>
                        <label class="block">Комментарий<textarea id="report-comment" class="input-field w-full h-24 mt-2" placeholder="Что произошло?"></textarea></label>
                        ${buildEvidencePickerHtml('report-evidence','Доказательства')}
                    </div>`, true, async () => {
                        const reason = document.getElementById('report-reason')?.value || 'other';
                        const comment = document.getElementById('report-comment')?.value || '';
                        const result = await submitReportFormData('submit_user_report', { target_user_id: userId, reason, comment }, 'report-evidence');
                        if (result && result.success) { hideCaptcha(); showModal('Жалоба отправлена', 'Жалоба отлично подана , ожидайте рассмотрения'); }
                        else showModal('Ошибка', (result && result.error) ? result.error : 'Не удалось отправить жалобу.');
                    });
                bindEvidencePicker('report-evidence');
                const confirmBtn = document.getElementById('modal-confirm-button'); if (confirmBtn) confirmBtn.textContent = 'Подать жалобу';
                const cancelBtn = document.getElementById('modal-cancel-button'); if (cancelBtn) cancelBtn.textContent = 'Отмена';
                const upm = document.getElementById('user-profile-modal');
                if (upm) upm.classList.add('hidden');
            });
        }



        async function renderChannelsGroupsView() {
    // 1. Получаем списки моих каналов (старая логика)
    await fetchChannels();
    await fetchGroups();
    
    // 2. Получаем данные для Дискавери (Новая логика)
    let recommendations = [];
    let topChannels = [];
    
    try {
        const discResult = await apiRequest('get_channel_discovery');
        if (discResult.success) {
            recommendations = discResult.recommendations;
            topChannels = discResult.top;
        }
    } catch (e) {
        console.error('Ошибка загрузки рекомендаций');
    }

    // Рендер функции для карточки канала
    const renderDiscoveryCard = (ch) => `
        <div class="discovery-card">
            <div class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center mr-3 text-lg">📢</div>
                <div>
                    <h4 class="font-bold text-sm">${escapeHtml(ch.name || '')}</h4>
                    <p class="text-xs text-slate-400">@${escapeHtml(ch.username || '')} • 👥 ${ch.members ? ch.members.length : 0}</p>
                </div>
            </div>
            <button class="primary-button text-xs px-2 py-1 h-8" onclick="joinCommunityByUsername('${String(ch.username || '').replace(/'/g, "\\'")}')">Вступить</button>
        </div>
    `;

    // Генерируем HTML для рекомендаций
    const recsHtml = recommendations.length ? recommendations.map(renderDiscoveryCard).join('') : '<p class="text-slate-500 text-sm">Нет рекомендаций</p>';
    
    // Генерируем HTML для топа
    const topHtml = topChannels.length ? topChannels.map((ch, index) => `
        <div class="discovery-card border-yellow-500/30">
            <div class="flex items-center">
                <span class="mr-3 font-bold text-yellow-500 text-xl">#${index + 1}</span>
                <div class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center mr-3 text-lg">📢</div>
                <div>
                    <h4 class="font-bold text-sm">${escapeHtml(ch.name || '')}</h4>
                    <p class="text-xs text-slate-400">👥 ${ch.members ? ch.members.length : 0} участников</p>
                </div>
            </div>
            <button class="primary-button text-xs px-2 py-1 h-8" onclick="joinCommunityByUsername('${String(ch.username || '').replace(/'/g, "\\'")}')">Вступить</button>
        </div>
    `).join('') : '<p class="text-slate-500 text-sm">Топ пуст</p>';

    // Старый список моих каналов/групп
    const myChannelsHtml = channels.length > 0 ? channels.map(c => renderMyCommunityItem(c, 'channel')).join('') : '<p class="text-slate-400 text-center py-4">Вы не состоите в каналах.</p>';
    const myGroupsHtml = groups.length > 0 ? groups.map(g => renderMyCommunityItem(g, 'group')).join('') : '<p class="text-slate-400 text-center py-4">Вы не состоите в группах.</p>';

    const html = `
        <div id="channels_groups_view" class="p-4 flex flex-col h-full overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
                <h2 class="section-title">S-Society</h2>
                <div class="flex gap-2">
                    <button onclick="showCreateCommunityModal()" class="primary-button text-sm">➕ Канал/Группа</button>
                </div>
            </div>

            <div class="mb-6">
                <div class="relative">
  <span class="absolute left-3 top-1/2 -translate-y-1/2 opacity-70 pointer-events-none"><svg class="tg-svg" style="width:18px;height:18px"><use href="#ico-search"></use></svg></span>
  <input type="text" id="community-search-input" placeholder="Поиск: название, ссылка или @username" oninput="searchCommunities()" class="input-field pl-10" style="padding-left:54px;">
</div>
                <div id="community-search-results" class="space-y-3 mt-2"></div>
            </div>

            <div class="mb-6">
                <h3 class="text-lg font-bold mb-2 gradient-text">✨ Рекомендации</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                    ${recsHtml}
                </div>
            </div>
            <div class="mb-6">
                <h3 class="text-lg font-bold mb-2 gradient-text">🏆 Топ каналов</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">${topHtml}</div>
            </div>
            <div class="mb-6">
                <div class="flex items-center justify-between mb-2"><h3 class="text-lg font-bold gradient-text">📢 Мои каналы</h3><button class="secondary-button text-sm" onclick="showJoinByLinkModal()">🔎 Найти</button></div>
                <div class="space-y-2">${myChannelsHtml}</div>
            </div>
            <div class="mb-2">
                <h3 class="text-lg font-bold mb-2 gradient-text">👥 Мои группы</h3>
                <div class="space-y-2">${myGroupsHtml}</div>
            </div>
        
    `;
    document.getElementById('screen-container').innerHTML = `<div id="channels_groups_screen_content" class="screen-content">${html}</div>`;
}

// Вспомогательная функция для рендера моих групп (чтобы не дублировать код внутри)
function renderMyCommunityItem(item, type) {
    const isAdmin = in_array(currentUser.id, item.admins || []);
    const icon = type === 'channel' ? '📢' : '👥';
    const safeId = String(item.id || '').replace(/'/g, "\'");
    const safeNameJs = String(item.name || '').replace(/\\/g, "\\\\").replace(/'/g, "\'");
    const dispName = escapeHtml(item.name || '');
    const dispUsername = escapeHtml(item.username || '');
    const settingsBtn = isAdmin ? `<button class="secondary-button text-xs px-3 py-1" onclick="event.stopPropagation(); showChannelSettings('${safeId}','${safeNameJs}')">⚙️ Настройки</button>` : '';
    return `
        <div class="channel-item cursor-pointer" onclick="switchScreen('chat_view', { chatId: '${safeId}', chatName: '${safeNameJs}', chatType: '${type}', isBotChat: false })">
            <div class="flex items-center flex-1 min-w-0">
                <div class="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center mr-3 text-xl">${icon}</div>
                <div class="flex-1 min-w-0">
                    <h3 class="font-bold truncate flex items-center gap-1"><span class="truncate">${dispName}</span>${item.is_verified ? verifiedBadgeSvg() : ''}${isAdmin ? '<span class="admin-badge ml-2">Админ</span>' : ''}</h3>
                    <p class="text-xs text-slate-500 mt-1 truncate">@${dispUsername}</p>
                </div>
            </div>
            <div class="ml-2 flex-shrink-0">${settingsBtn}</div>
        </div>
    `;
}

        function showCreateCommunityModal() {
            const modal = document.getElementById('custom-modal');
            document.getElementById('modal-title').textContent = 'Создать канал/группу';
            document.getElementById('modal-message').innerHTML = `
                <div class="space-y-3">
                    <select id="community-type" class="input-field" onchange="onCommunityTypeChange(this.value)">
                        <option value="channel">📢 Канал</option>
                        <option value="group">👥 Группа</option>
                    </select>
                    <input type="text" id="community-name" placeholder="Название канала (Только Латинские буквы)" class="input-field" maxlength="50" 
       oninput="this.value = this.value.replace(/[^a-zA-Z0-9 ]/g, '');">
                    <textarea id="community-description" placeholder="Описание (необязательно)" class="input-field" rows="3" maxlength="200"></textarea>
                </div>
            `;
            try{ onCommunityTypeChange(document.getElementById('community-type').value); }catch(e){}

            document.getElementById('modal-ok-button').classList.add('hidden');
            document.getElementById('modal-confirm-buttons').classList.remove('hidden');
            
            document.getElementById('modal-confirm-button').textContent = 'Создать';
            document.getElementById('modal-confirm-button').onclick = () => {
                const type = document.getElementById('community-type').value;
                const name = document.getElementById('community-name').value.trim();
                const description = document.getElementById('community-description').value.trim();
                
                if (name.length < 2) {
                    showModal('Ошибка', 'Название должно содержать минимум 2 символа.');
                    return;
                }
                
                modal.classList.add('hidden');
                createCommunity(type, name, description);
            };
            
            document.getElementById('modal-cancel-button').onclick = () => {
                modal.classList.add('hidden');
            };

            modal.classList.remove('hidden');
        }

        
        function onCommunityTypeChange(type){
            const inp = document.getElementById('community-name');
            if (!inp) return;
            inp.placeholder = (type === 'group')
                ? 'Название группы (Только Латинские буквы)'
                : 'Название канала (Только Латинские буквы)';
        }

function showJoinByLinkModal() {
            const modal = document.getElementById('custom-modal');
            document.getElementById('modal-title').textContent = 'Найти канал/группу';
            document.getElementById('modal-message').innerHTML = `
                <div class="space-y-3">
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 -translate-y-1/2 opacity-70 pointer-events-none"><svg class="tg-svg" style="width:18px;height:18px"><use href="#ico-search"></use></svg></span>
                      <input type="text" id="community-query" placeholder="Название, ссылка или @username" class="input-field pl-10">
                    </div>
                    <p class="text-sm text-slate-400">Можно вставить ссылку, например: https://your-messenger.com/my_channel</p>
                </div>
            `;

            document.getElementById('modal-ok-button').classList.add('hidden');
            document.getElementById('modal-confirm-buttons').classList.remove('hidden');
            
            document.getElementById('modal-confirm-button').textContent = 'Присоединиться';
            document.getElementById('modal-confirm-button').onclick = () => {
                const raw = document.getElementById('community-query').value.trim();
                const query = normalizeCommunityQuery(raw);
                if (query.length < 2) {
                    showModal('Ошибка', 'Введите название, ссылку или @username.');
                    return;
                }
                modal.classList.add('hidden');
                // Если похоже на точный username — пробуем быстро присоединиться
                joinCommunityByUsername(query);

            };
            
            document.getElementById('modal-cancel-button').onclick = () => {
                modal.classList.add('hidden');
            };

            modal.classList.remove('hidden');
        }

        async function createCommunity(type, name, description) {
            const action = type === 'channel' ? 'create_channel' : 'create_group';
            const result = await apiRequest(action, { name, description });
            
            if (result.success) {
                hideCaptcha();
                const communityType = type === 'channel' ? 'канал' : 'группу';
                showModal('Успех!', `Вы создали ${communityType} "${name}". Username: @${result.username}`, false, () => {
                    fetchChannels();
                    fetchGroups();
                    renderChannelsGroupsView();
                });
            } else {
                showModal('Ошибка', result.error || 'Не удалось создать S-Society.');
            }
        }

        
        async function joinCommunityByUsername(username) {
            const infoResult = await apiRequest('get_channel_group_by_username', { username });
            
            if (infoResult.success) {
                const action = infoResult.type === 'channel' ? 'join_channel' : 'join_group';
                const communityName = infoResult.data.name;
                const joinResult = await apiRequest(action, { 
                    username: username // Передаем username, а не channel_id или group_id
                });
                
                if (joinResult.success) {
                    const communityType = infoResult.type === 'channel' ? 'канал' : 'группу';
                    showModal('Успех!', `Вы присоединились к ${communityType} "${communityName}".`, false, () => {
                        // Обновляем все необходимые списки
                        fetchChannels();
                        fetchGroups();
                        fetchChats();
                        renderChannelsGroupsView(); // Обновляем страницу каналов/групп
                    });
                } else {
                    showModal('Ошибка', joinResult.error || 'Не удалось присоединиться к S-Society.');
                }
            } else {
                showModal('Ошибка', infoResult.error || 'Сообщество не найдено.');
            }
        }

                function normalizeCommunityQuery(input) {
            let q = String(input || '').trim();
            if (!q) return '';
            // remove surrounding spaces
            q = q.replace(/^\s+|\s+$/g, '');
            // если вставили ссылку — берём последний сегмент пути
            const lower = q.toLowerCase();
            // убираем протокол
            q = q.replace(/^https?:\/\//i, '');
            // убираем параметры/якоря
            q = q.split('?')[0].split('#')[0];
            // если есть домен/пути — берём последний сегмент
            if (q.includes('/')) {
                const parts = q.split('/');
                q = parts[parts.length - 1] || parts[parts.length - 2] || q;
            }
            // убираем @
            q = q.replace(/^@/, '');
            // если всё ещё есть слэши (на всякий) — берём последний сегмент
            if (q.includes('/')) q = q.split('/').filter(Boolean).pop() || q;
            return q.trim().toLowerCase();
        }
    

async function searchCommunities() {
            const queryRaw = document.getElementById('community-search-input').value.trim();
            const query = normalizeCommunityQuery(queryRaw);
            const resultsContainer = document.getElementById('community-search-results');

            if (query.length < 2) {
                resultsContainer.innerHTML = '<p class="text-slate-400 text-center py-8">Начните вводить текст для поиска сообществ.</p>';
                return;
            }
            
            resultsContainer.innerHTML = '<p class="text-center py-4"><span class="loading-circle bg-white-accent"></span> Поиск...</p>';

            const result = await apiRequest('search_channels_groups', { query });
            
            if (result.success && result.results.length > 0) {
                const resultsHtml = result.results.map(community => {
                    const isChannel = community.type === 'channel';
                    const icon = isChannel ? '📢' : '👥';
                    const typeName = isChannel ? 'Канал' : 'Группа';
                    const safeUsernameJs = String(community.username || '').replace(/'/g, "\\'");
                    const joinAction = isChannel ? 
                        `joinCommunityByUsername('${safeUsernameJs}')` : 
                        `joinCommunityByUsername('${safeUsernameJs}')`;

                    return `
                        <div class="search-result-item">
                            <div class="flex items-center">
                                <div class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center mr-3 text-lg">
                                    ${icon}
                                </div>
                                <div>
                                    <h4 class="font-bold">${escapeHtml(community.name || '')}</h4>
                                    <p class="text-sm text-slate-400">${typeName} • @${escapeHtml(community.username || '')}</p>
                                    <p class="text-xs text-slate-500">Участников: ${community.members?.length || 0}</p>
                                </div>
                            </div>
                            <button class="primary-button text-sm px-3 py-1" onclick="${joinAction}">
                                Присоединиться
                            </button>
                        </div>
                    `;
                }).join('');
                resultsContainer.innerHTML = resultsHtml;
            } else {
                resultsContainer.innerHTML = '<p class="text-red-400 text-center py-8">Сообщества не найдены.</p>';
            }
        }

        function confirmLeaveCommunity(communityId, communityName, type) {
            const typeName = type === 'channel' ? 'канал' : 'группу';
            showModal(`Покинуть ${typeName}?`, `Вы уверены, что хотите покинуть ${typeName} <strong>${communityName}</strong>?`, true, () => {
                leaveCommunity(communityId, type);
            });
        }

        async function leaveCommunity(communityId, type) {
            const action = type === 'channel' ? 'leave_channel' : 'leave_group';
            
            const result = await apiRequest(action, { 
                chat_id: communityId
            });
            
            if (result.success) {
                hideCaptcha();
                const typeName = type === 'channel' ? 'канал' : 'группу';
                showModal('Успех!', `Вы покинули ${typeName}.`, false, () => {
                    fetchChannels();
                    fetchGroups();
                    fetchChats();
                    switchScreen('channels_groups');
                });
            } else {
                showModal('Ошибка', result.error || 'Не удалось покинуть сообщество.');
            }
        }

        async function showChannelSettings(channelId, channelName) {
            const settingsResult = await apiRequest('get_channel_settings', { channel_id: channelId });
            
            if (!settingsResult.success) {
                showModal('Ошибка', settingsResult.error || 'Не удалось загрузить настройки канала.');
                return;
            }

            // Получаем инфо из кэша
            let channelInfo = channels.find(c => c.id === channelId);
            if (!channelInfo) {
                const chat = chatsData.find(c => c.id === channelId);
                if (chat) channelInfo = { username: chat.username, privacy: chat.privacy || 'public' };
            }
            if (!channelInfo || !channelInfo.username) {
                 await fetchChannels();
                 channelInfo = channels.find(c => c.id === channelId) || { username: 'unknown', privacy: 'public', description: '' };
            }

            const membersResult = await apiRequest('get_channel_members', { channel_id: channelId });
            if (!membersResult.success) return;

            const modal = document.getElementById('channel-settings-modal');
            const content = document.getElementById('channel-settings-content');
            
            const communityType = (channelInfo && channelInfo.type) || (settingsResult.settings && settingsResult.settings.type) || 'channel';
            const communityKind = communityType === 'group' ? 'группы' : 'канала';
            document.getElementById('channel-settings-title').textContent = `Настройки ${communityKind}`;
            
            const isAllWrite = settingsResult.settings && settingsResult.settings.allow_all_write === true;
            const isPrivate = channelInfo.privacy === 'private';
            const inviteLink = `${window.location.origin}${window.location.pathname}?join=channel:${channelInfo.username}`;
            const description = channelInfo.description || 'Описание отсутствует';

            content.innerHTML = `
                <div class="card mb-4 p-4 text-center">
                    <h3 class="text-xl font-bold mb-1">${channelName}</h3>
                    <p class="text-slate-400 text-sm mb-3">@${channelInfo.username}</p>
                    
                    <button class="secondary-button text-sm w-full mb-2" onclick="openRenameChannelModal('${channelId}', '${channelName.replace(/'/g, "\\'")}')">
                        ✏️ Изменить название
                    </button>
                </div>

                <div class="card mb-4 p-4 text-center">
                    <h4 class="font-bold mb-2">Описание ${communityKind}</h4>
                    <p class="text-sm text-slate-300 mb-3 italic break-words">${description.replace(/\n/g, '<br>')}</p>
                    <button class="secondary-button text-sm w-full" onclick="openEditDescriptionModal('${channelId}', '${description.replace(/'/g, "\\'").replace(/\n/g, "\\n")}')">
                        ✏️ Изменить описание
                    </button>
                </div>

                <div class="card mb-4 p-4">
                    <h4 class="font-bold mb-2">Тип ${communityKind}</h4>
                    <div class="flex flex-col gap-2">
                        <label class="flex items-center justify-between p-2 rounded hover:bg-slate-800 cursor-pointer">
                            <div>
                                <span class="font-semibold">🌐 Публичный</span>
                                <p class="text-xs text-slate-400">Виден в поиске и топе</p>
                            </div>
                            <input type="radio" name="privacy_type" value="public" ${!isPrivate ? 'checked' : ''} onchange="updateChannelPrivacy('${channelId}', 'public')">
                        </label>
                        <label class="flex items-center justify-between p-2 rounded hover:bg-slate-800 cursor-pointer">
                            <div>
                                <span class="font-semibold">🔒 Частный</span>
                                <p class="text-xs text-slate-400">Доступ только по ссылке</p>
                            </div>
                            <input type="radio" name="privacy_type" value="private" ${isPrivate ? 'checked' : ''} onchange="updateChannelPrivacy('${channelId}', 'private')">
                        </label>
                    </div>
                </div>

                <div class="card mb-4 p-4">
                    <h4 class="font-bold mb-2">Ссылка-приглашение</h4>
                    <div class="flex gap-2">
                        <input type="text" value="${inviteLink}" readonly class="input-field text-sm text-slate-400" id="invite-link-input">
                        <button class="primary-button px-3" onclick="copyChannelLink()">📋</button>
                    </div>
                    <p class="text-xs text-slate-500 mt-2">Переход по ссылке автоматически откроет этот канал.</p>
                </div>

                ${(communityType === 'channel') ? `<div class="card mb-4 p-4">
                    <h4 class="font-bold mb-2">Комментарии под постами</h4>
                    <p class="text-xs text-slate-400 mb-3">Привяжи группу к каналу. Эта группа будет использоваться как комментарии к постам.</p>
                    <select id="linked-group-select" class="input-field mb-2">
                        <option value="">Без группы</option>
                        ${(settingsResult.available_groups || []).map(g => `<option value="${g.id}" ${(settingsResult.settings.linked_group_id === g.id) ? 'selected' : ''}>${escapeHtml(g.name || g.username || 'Группа')}</option>`).join('')}
                    </select>
                    <button class="secondary-button text-sm w-full" onclick="updateLinkedGroup('${channelId}')">Сохранить привязку группы</button>
                </div>` : ''}

                <div class="card mb-4 flex justify-between items-center p-4">
                    <div>
                        <h4 class="font-bold">Разрешить писать всем</h4>
                        <p class="text-xs text-slate-400">Если выключено, пишут только админы</p>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="allow-all-write" ${isAllWrite ? 'checked' : ''} onchange="updateChannelSettingsJS('${channelId}')">
                    </label>
                </div>

                <div class="card mb-5">
                    <h4 class="font-bold mb-3">Администраторы (${settingsResult.admins.length})</h4>
                    <div class="space-y-2">
                        ${settingsResult.admins.map(admin => `
                            <div class="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                                <div class="flex items-center">
                                    <img src="${escapeHtml(admin.avatar || '/default.png')}" alt="Аватар" class="w-8 h-8 rounded-full mr-3" loading="lazy" referrerpolicy="no-referrer">
                                    <div>
                                        <p class="font-semibold text-sm">${escapeHtml(admin.name || '')}</p>
                                        <p class="text-xs text-slate-400">@${escapeHtml(admin.username || '')}</p>
                                    </div>
                                </div>
                                <span class="admin-badge">Админ</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="mt-3 pt-3 border-t border-slate-700">
                         <input type="text" id="new-admin-search" placeholder="Логин пользователя" class="input-field mb-2 text-sm">
                         <button class="primary-button w-full text-sm" onclick="searchAndAddAdmin('${channelId}')">Назначить админом</button>
                    </div>
                </div>

                <div class="card mb-5">
                    <h4 class="font-bold mb-3">Участники (${membersResult.members.length})</h4>
                    <button class="secondary-button w-full text-sm" onclick="showChannelMembers('${channelId}', '${channelName.replace(/'/g, "\\'")}')">
                        Показать всех участников
                    </button>
                </div>
                
                <button class="primary-button bg-red-600 hover:bg-red-700 w-full mt-4" onclick="confirmDeleteChannel('${channelId}', '${channelName.replace(/'/g, "\\'")}')">
                    🗑️ Удалить канал
                </button>
            `;

            modal.classList.remove('hidden');
        }

        // --- Новые функции для настроек канала ---

        function openRenameChannelModal(channelId, currentName) {
            // Скрываем окно настроек временно
            document.getElementById('channel-settings-modal').classList.add('hidden');

            const modal = document.getElementById('custom-modal');
            document.getElementById('modal-title').textContent = 'Изменить название';
            document.getElementById('modal-message').innerHTML = `
                <input type="text" id="new-channel-name" class="input-field" value="${currentName}" placeholder="Новое название">
            `;

            document.getElementById('modal-ok-button').classList.add('hidden');
            document.getElementById('modal-confirm-buttons').classList.remove('hidden');
            
            // Кнопка Сохранить
            document.getElementById('modal-confirm-button').textContent = 'Сохранить';
            document.getElementById('modal-confirm-button').onclick = () => saveChannelName(channelId);
            
            // Кнопка Отмена (возвращает в настройки)
            document.getElementById('modal-cancel-button').onclick = () => {
                modal.classList.add('hidden');
                document.getElementById('channel-settings-modal').classList.remove('hidden');
            };

            modal.classList.remove('hidden');
        }

        async function saveChannelName(channelId) {
            const newName = document.getElementById('new-channel-name').value.trim();
            if (newName.length < 2) {
                alert('Название слишком короткое');
                return;
            }

            const result = await apiRequest('update_channel_settings', {
                channel_id: channelId,
                new_name: newName
            });

            if (result.success) {
                hideCaptcha();
                // Обновляем данные локально
                const ch = channels.find(c => c.id === channelId);
                if (ch) ch.name = newName;
                
                // Закрываем модалку редактирования
                document.getElementById('custom-modal').classList.add('hidden');
                
                // Переоткрываем настройки с новыми данными
                showChannelSettings(channelId, newName);
                
                // Обновляем список чатов на фоне
                fetchChats();
            } else {
                showModal('Ошибка', result.error);
            }
        }

        async function updateChannelPrivacy(channelId, privacyType) {
            const result = await apiRequest('update_channel_settings', {
                channel_id: channelId,
                privacy: privacyType
            });
            
            if (result.success) {
                hideCaptcha();
                // Обновляем локально
                const ch = channels.find(c => c.id === channelId);
                if (ch) ch.privacy = privacyType;
                
                // Уведомление не обязательно, переключатель сам показывает состояние, 
                // но можно обновить кэш каналов
                fetchChannels();
            } else {
                showModal('Ошибка', result.error || 'Не удалось изменить приватность');
                // Возвращаем переключатель назад (переоткрываем настройки)
                const ch = channels.find(c => c.id === channelId);
                showChannelSettings(channelId, ch ? ch.name : 'Канал');
            }
        }

        function copyChannelLink() {
            const copyText = document.getElementById("invite-link-input");
            
            // Выбор текста (для мобильных и десктопов)
            copyText.select();
            copyText.setSelectionRange(0, 99999); 

            // API буфера обмена
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(copyText.value).then(() => {
                    showModal('Ссылка скопирована', 'Ссылка успешно скопирована в буфер обмена.');
                }).catch(err => {
                    console.error('Ошибка копирования: ', err);
                    // Fallback через execCommand
                    try {
                        document.execCommand('copy');
                        showModal('Ссылка скопирована', 'Ссылка успешно скопирована.');
                    } catch (e) {
                        showModal('Ошибка', 'Не удалось скопировать ссылку.');
                    }
                });
            } else {
                // Fallback для старых браузеров
                document.execCommand('copy');
                showModal('Ссылка скопирована', 'Ссылка успешно скопирована.');
            }
        }

        async function updateChannelSettingsJS(channelId) {
        const checkbox = document.getElementById('allow-all-write');
        const allowAllWrite = checkbox.checked;
        
        // Отправляем на сервер
        const result = await apiRequest('update_channel_settings', {
            channel_id: channelId,
            allow_all_write: allowAllWrite ? 'true' : 'false'
        });
        
        if (!result.success) {
            showModal('Ошибка', result.error || 'Не удалось сохранить настройку.');
            checkbox.checked = !allowAllWrite; // Возвращаем обратно при ошибке
        }
    }

        async function updateLinkedGroup(channelId) {
            const linkedGroupId = document.getElementById('linked-group-select')?.value || '';
            const result = await apiRequest('update_channel_settings', { channel_id: channelId, linked_group_id: linkedGroupId });
            if (result && result.success) {
                hideCaptcha();
                const settingsModal = document.getElementById('channel-settings-modal');
                if (settingsModal) settingsModal.classList.add('hidden');
                showModal('Успех', linkedGroupId ? 'Группа сохранена и привязана к каналу.' : 'Привязка группы снята.', false, async () => {
                    document.getElementById('custom-modal')?.classList.add('hidden');
                    if (linkedGroupId) await openChatById(linkedGroupId);
                    else if (String(currentChatId || '') !== String(channelId || '')) await openChatById(channelId);
                });
            }
            else showModal('Ошибка', (result && result.error) ? result.error : 'Не удалось сохранить привязку.');
        }

        async function searchAndAddAdmin(channelId) {
            const username = document.getElementById('new-admin-search').value.trim();
            
            if (!username) {
                showModal('Ошибка', 'Введите логин пользователя.');
                return;
            }

            const searchResult = await apiRequest('search_users', { query: username });
            
            if (searchResult.success && searchResult.users.length > 0) {
                const user = searchResult.users[0];
                
                showModal(
                    'Добавить администратора?',
                    `Вы уверены, что хотите назначить <strong>${user.name}</strong> (@${user.username}) администратором канала?`,
                    true,
                    async () => {
                        const result = await apiRequest('add_channel_admin', {
                            channel_id: channelId,
                            target_user_id: user.id
                        });
                        
                        if (result.success) {
                hideCaptcha();
                            showModal('Успех', `${user.name} теперь администратор канала.`, false, () => {
                                const channelName = document.getElementById('channel-settings-title').textContent.replace('Настройки: ', '');
                                showChannelSettings(channelId, channelName);
                            });
                        } else {
                            showModal('Ошибка', result.error || 'Не удалось добавить администратора.');
                        }
                    }
                );
            } else {
                showModal('Ошибка', 'Пользователь не найден.');
            }
        }

        async function showChannelMembers(channelId, channelName) {
    // Сначала скрываем модальное окно настроек канала
    document.getElementById('channel-settings-modal').classList.add('hidden');
    
    const result = await apiRequest('get_channel_members', { channel_id: channelId });
    
    if (result.success) {
                hideCaptcha();
        const modal = document.getElementById('custom-modal');
        document.getElementById('modal-title').textContent = `Участники: ${channelName}`;
        
        let membersHtml = '';
        if (result.members.length > 0) {
            membersHtml = result.members.map(member => {
                const dispName = escapeHtml(member.name || '');
                const dispUsername = escapeHtml(member.username || '');
                const avatar = escapeHtml(member.avatar || '/default.png');
                const safeMemberId = String(member.id || '').replace(/'/g, "\\'");
                const safeNameJs = String(member.name || '').replace(/\\/g, "\\\\").replace(/'/g, "\\'");
                return `
                <div class="member-item">
                    <div class="flex items-center">
                        <img src="${avatar}" alt="Аватар" class="w-10 h-10 rounded-full mr-3" loading="lazy" referrerpolicy="no-referrer">
                        <div>
                            <p class="font-semibold">${dispName}</p>
                            <p class="text-sm text-slate-400">@${dispUsername}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        ${member.is_admin ? '<span class="admin-badge">Админ</span>' : ''}
                        ${!member.is_admin ? `
                            <button class="primary-button text-sm px-3 py-1" onclick="addAsAdmin('${channelId}', '${safeMemberId}', '${safeNameJs}')">
                                Сделать админом
                            </button>
                        ` : member.id !== currentUser.id ? `
                            <button class="secondary-button text-sm px-3 py-1 bg-red-600 hover:bg-red-700" onclick="removeAdmin('${channelId}', '${safeMemberId}', '${safeNameJs}')">
                                Убрать админа
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
            }).join('');
        } else {
            membersHtml = '<p class="text-slate-400 text-center py-4">Участников нет.</p>';
        }
        
        document.getElementById('modal-message').innerHTML = `
            <div class="max-h-96 overflow-y-auto">
                ${membersHtml}
            </div>
        `;
        
        document.getElementById('modal-ok-button').classList.remove('hidden');
        document.getElementById('modal-confirm-buttons').classList.add('hidden');
        document.getElementById('modal-ok-button').onclick = () => {
            modal.classList.add('hidden');
        };
        
        modal.classList.remove('hidden');
    } else {
        showModal('Ошибка', result.error || 'Не удалось загрузить список участников.');
    }
}

        async function addAsAdmin(channelId, userId, userName) {
            showModal(
                'Добавить администратора?',
                `Вы уверены, что хотите назначить <strong>${userName}</strong> администратором канала?`,
                true,
                async () => {
                    const result = await apiRequest('add_channel_admin', {
                        channel_id: channelId,
                        target_user_id: userId
                    });
                    
                    if (result.success) {
                hideCaptcha();
                        showModal('Успех', `${userName} теперь администратор канала.`, false, () => {
                            const channelName = document.getElementById('modal-title').textContent.replace('Участники: ', '');
                            showChannelMembers(channelId, channelName);
                        });
                    } else {
                        showModal('Ошибка', result.error || 'Не удалось добавить администратора.');
                    }
                }
            );
        }

        async function removeAdmin(channelId, userId, userName) {
            showModal(
                'Убрать администратора?',
                `Вы уверены, что хотите снять <strong>${userName}</strong> с должности администратора?`,
                true,
                async () => {
                    const result = await apiRequest('remove_channel_admin', {
                        channel_id: channelId,
                        target_user_id: userId
                    });
                    
                    if (result.success) {
                hideCaptcha();
                        showModal('Успех', `${userName} больше не администратор канала.`, false, () => {
                            const channelName = document.getElementById('modal-title').textContent.replace('Участники: ', '');
                            showChannelMembers(channelId, channelName);
                        });
                    } else {
                        showModal('Ошибка', result.error || 'Не удалось убрать администратора.');
                    }
                }
            );
        }

        async function showActiveSessions() {
            const result = await apiRequest('get_active_sessions');
            
            if (result.success) {
                hideCaptcha();
                const modal = document.getElementById('custom-modal');
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                if (window.currentUser && currentUser && currentUser.active_effect) {
                    if (currentUser.active_effect && getEffectPalette(currentUser.active_effect)) modalContent.classList.add(`${currentUser.active_effect}-effect-bg`);
                }
            }

                document.getElementById('modal-title').textContent = 'Активные сессии';
                
                let sessionsHtml = '';
                if (result.sessions.length > 0) {
                    sessionsHtml = result.sessions.map(session => {
                        const deviceIcon = session.device_type === 'Mobile' ? '📱' : 
                                         session.device_type === 'Tablet' ? '📟' : '💻';
                        
                        return `
                            <div class="session-item ${session.is_current ? 'current-session' : ''}">
                                <div class="flex items-center flex-1">
                                    <span class="device-icon">${deviceIcon}</span>
                                    <div class="flex-1">
                                        <p class="font-semibold">${session.device_type} • ${session.browser}</p>
                                        <p class="text-sm text-slate-400">IP: ${session.ip}</p>
                                        <p class="text-xs text-slate-500">
                                            Вход: ${session.login_time_formatted} | 
                                            Активность: ${session.last_activity_formatted}
                                        </p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    ${session.auth_via === 'qr' ? '<span class="admin-badge bg-blue-600">QR</span>' : ''}
                                    ${session.is_current ? '<span class="admin-badge bg-green-600">Текущая</span>' : ''}
                                </div>
                            </div>
                        `;
                    }).join('');
                } else {
                    sessionsHtml = '<p class="text-slate-400 text-center py-4">Активных сессий нет.</p>';
                }
                
                document.getElementById('modal-message').innerHTML = `
                    <div class="mb-4">
                        <p class="text-sm text-slate-400">Здесь отображаются все активные сессии вашего аккаунта за последние 24 часа.</p>
                    </div>
                    <div class="max-h-96 overflow-y-auto">
                        ${sessionsHtml}
                    </div>
                `;
                
                document.getElementById('modal-ok-button').classList.remove('hidden');
                document.getElementById('modal-confirm-buttons').classList.add('hidden');
                document.getElementById('modal-ok-button').onclick = () => {
                    modal.classList.add('hidden');
                };
                
                modal.classList.remove('hidden');
            } else {
                showModal('Ошибка', result.error || 'Не удалось загрузить информацию о сессиях.');
            }
        }

        function in_array(needle, haystack) {
            return haystack.indexOf(needle) !== -1;
        }

        // Экранирование текста (фикс обрезаний/поломки верстки из-за спецсимволов)
        
        function formatBytes(bytes) {
            const b = Number(bytes || 0);
            if (!isFinite(b) || b <= 0) return '0 B';
            const k = 1024;
            const sizes = ['B','KB','MB','GB'];
            const i = Math.min(sizes.length - 1, Math.floor(Math.log(b) / Math.log(k)));
            const num = b / Math.pow(k, i);
            return (i === 0 ? num.toFixed(0) : num.toFixed(2)) + ' ' + sizes[i];
        }

        // ===== Global music player (Telegram-like) =====
        // Upgraded: queue, repeat, shuffle, expanded + fullscreen UI, playlists

        let __pendingPlaylistIdFromUrl = null;
        (function detectPlaylistParam(){
            try{
                const sp = new URLSearchParams(window.location.search || '');
                const pid = (sp.get('playlist') || '').trim();
                if (pid && /^[a-f0-9]{32}$/i.test(pid)) {
                    __pendingPlaylistIdFromUrl = pid.toLowerCase();
                    sp.delete('playlist');
                    const qs = sp.toString();
                    const newUrl = window.location.pathname + (qs ? ('?' + qs) : '') + window.location.hash;
                    try{ window.history.replaceState({}, document.title, newUrl); }catch(e){}
                }
            }catch(e){}
        })();

        let _globalPlayerState = {
            url: null,
            title: null,
            queue: [], // [{url,title,meta?}]
            index: -1,
            repeat: (localStorage.getItem('gp_repeat') || 'off'), // off | one | all
            shuffle: (localStorage.getItem('gp_shuffle') === '1'),
            volume: (() => {
                const v = parseFloat(localStorage.getItem('gp_volume') || '1');
                return (isFinite(v) ? Math.max(0, Math.min(1, v)) : 1);
            })(),
            source: null // {type:'playlist', id, name}
        };

        // UI refs (filled in initGlobalPlayer)
        let _gpUI = null;

        
        // Inline SVG icons (replaces emojis)
        const _GP_ICONS = {
            play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7.2v9.6a1 1 0 0 0 1.5.86l8.2-4.8a1 1 0 0 0 0-1.72l-8.2-4.8A1 1 0 0 0 9 7.2z" fill="currentColor"/></svg>',
            pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.8 6.6c0-.6.5-1.1 1.1-1.1h1.6c.6 0 1.1.5 1.1 1.1v10.8c0 .6-.5 1.1-1.1 1.1H8.9c-.6 0-1.1-.5-1.1-1.1V6.6zm8.6 0c0-.6.5-1.1 1.1-1.1h1.6c.6 0 1.1.5 1.1 1.1v10.8c0 .6-.5 1.1-1.1 1.1h-1.6c-.6 0-1.1-.5-1.1-1.1V6.6z" fill="currentColor"/></svg>',
            prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 6.8v10.4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M10 12l9-5.2v10.4L10 12z" fill="currentColor"/></svg>',
            next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 6.8v10.4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M14 12 5 6.8v10.4L14 12z" fill="currentColor"/></svg>',
            close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
            chevronDown: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 9.5 12 15l5.5-5.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
            fullscreen: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4H4v5M15 4h5v5M9 20H4v-5M20 20h-5v-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
            repeatOff: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10l-2-2M17 17H7l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 7v5M17 17v-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
            repeatOne: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10l-2-2M17 17H7l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 7v5M17 17v-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12.5 10.2v4.2M12.5 10.2l-1 .8M12.5 10.2l1 .8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
            shuffle: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 4h4v4M16 4l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 17h4l7-10h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 16v4h-4M20 20l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 7h4l2.6 3.6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
            plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
            heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.4 4.9 13.8a4.8 4.8 0 0 1 6.8-6.8L12 7.3l.3-.3a4.8 4.8 0 0 1 6.8 6.8L12 20.4z" fill="currentColor"/></svg>',
            share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 8a3 3 0 1 0-2.8-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M8 12a3 3 0 1 0 0 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18 16a3 3 0 1 0 0 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M14.7 9.2l-6.1 3.6m6.1 6l-6.1-3.6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
            volume: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 7 9H4v6h3l4 4V5z" fill="currentColor"/><path d="M16 8.6a4.5 4.5 0 0 1 0 6.8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 6.5a7.5 7.5 0 0 1 0 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.55"/></svg>',
            queue: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 7h12M6 12h12M6 17h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M17 16.5v-5l4 2.5-4 2.5z" fill="currentColor"/></svg>',
            playlist: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 7h12M6 12h12M6 17h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M10.5 16.8V10.2a1 1 0 0 1 1.4-.9l5.6 2.5a1 1 0 0 1 0 1.8l-5.6 2.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        };

        function _gpSetIcon(el, name){
            if (!el) return;
            const svg = _GP_ICONS[name] || '';
            el.innerHTML = svg;
        }
function _fmtTime(sec) {
            sec = Math.max(0, Math.floor(Number(sec) || 0));
            const m = Math.floor(sec / 60);
            const s = sec % 60;
            return `${m}:${s.toString().padStart(2, '0')}`;
        }

        function _gpCurTrack(){
            const q = Array.isArray(_globalPlayerState.queue) ? _globalPlayerState.queue : [];
            const i = Number(_globalPlayerState.index);
            if (!isFinite(i) || i < 0 || i >= q.length) return null;
            return q[i] || null;
        }

        function _gpSetPrefs(){
            try{ localStorage.setItem('gp_repeat', _globalPlayerState.repeat || 'off'); }catch(e){}
            try{ localStorage.setItem('gp_shuffle', _globalPlayerState.shuffle ? '1' : '0'); }catch(e){}
            try{ localStorage.setItem('gp_volume', String(_globalPlayerState.volume ?? 1)); }catch(e){}
        }

        function updateFabForPlayer(){
            const playerEl = document.getElementById('global-player');
            const fab = document.getElementById('tg-fab');
            if (!playerEl || !fab) return;
            const active = !playerEl.classList.contains('hidden');
            document.body.classList.toggle('player-active', active);

            if (active){
                // Measure current player height and raise FAB so it doesn't block the STOP button
                const h = Math.ceil(playerEl.getBoundingClientRect().height || 0);
                const offset = Math.max(64, h + 10); // +gap
                document.documentElement.style.setProperty('--tg-player-offset', `${offset}px`);
            } else {
                document.documentElement.style.removeProperty('--tg-player-offset');
            }
        }

        function _gpOpenOverlay(){
            if (!_gpUI || !_gpUI.overlay) return;
            _gpUI.overlay.classList.remove('hidden');
            document.body.classList.add('player-overlay-open');
            _gpRenderQueue();
            _gpRenderPlaylists();
            _gpUpdateOverlayUI();
            // refresh playlists (best effort)
            fetchMyPlaylists(true).then(() => _gpRenderPlaylists()).catch(() => {});
        }

        function _gpCloseOverlay(){
            if (!_gpUI || !_gpUI.overlay) return;
            _gpUI.overlay.classList.add('hidden');
            _gpUI.overlay.classList.remove('is-full');
            document.body.classList.remove('player-overlay-open');
            try{
                if (document.fullscreenElement) document.exitFullscreen();
            }catch(e){}
        }

        function _gpToggleOverlayFullscreen(){
            if (!_gpUI || !_gpUI.overlay || !_gpUI.panel) return;
            const ov = _gpUI.overlay;
            const panel = _gpUI.panel;

            const wantsFull = !ov.classList.contains('is-full');
            ov.classList.toggle('is-full', wantsFull);

            // Try Fullscreen API (best effort)
            try{
                if (wantsFull){
                    if (!document.fullscreenElement && panel.requestFullscreen) {
                        panel.requestFullscreen().catch(() => {});
                    }
                } else {
                    if (document.fullscreenElement && document.exitFullscreen) {
                        document.exitFullscreen().catch(() => {});
                    }
                }
            }catch(e){}
        }

        function _gpEnsureQueueForSingle(url, title){
            _globalPlayerState.queue = [{ url, title: title || 'Музыка' }];
            _globalPlayerState.index = 0;
            _globalPlayerState.source = null;
        }

        function _gpLoadAndPlayTrack(track, autoplay = true){
            const playerEl = document.getElementById('global-player');
            const audioEl = document.getElementById('global-audio');
            const titleEl = document.getElementById('global-player-title');
            if (!audioEl || !playerEl || !titleEl || !track || !track.url) return;

            const t = (track.title || 'Музыка').toString();
            titleEl.textContent = t;
            _globalPlayerState.title = t;

            // apply saved volume
            audioEl.volume = Math.max(0, Math.min(1, Number(_globalPlayerState.volume) || 1));

            const url = track.url;
            if (_globalPlayerState.url !== url) {
                _globalPlayerState.url = url;
                audioEl.src = url;
                audioEl.currentTime = 0;
            }

            playerEl.classList.remove('hidden');
            updateFabForPlayer();

            _gpUpdateOverlayUI();
            _gpRenderQueue();

            if (autoplay) {
                audioEl.play().catch(() => {
                    // Autoplay can be blocked until user gesture; show UI anyway
                });
            }
        }

        function _gpPlayIndex(idx, autoplay = true){
            const q = Array.isArray(_globalPlayerState.queue) ? _globalPlayerState.queue : [];
            if (!q.length) return;
            const i = Math.max(0, Math.min(q.length - 1, Number(idx) || 0));
            _globalPlayerState.index = i;
            _gpLoadAndPlayTrack(q[i], autoplay);
        }

        function _gpNext(autoplay = true){
            const q = Array.isArray(_globalPlayerState.queue) ? _globalPlayerState.queue : [];
            if (!q.length) return;

            // shuffle
            if (_globalPlayerState.shuffle && q.length > 1){
                let next = Math.floor(Math.random() * q.length);
                if (next === _globalPlayerState.index) next = (next + 1) % q.length;
                _gpPlayIndex(next, autoplay);
                return;
            }

            if (_globalPlayerState.index < q.length - 1){
                _gpPlayIndex(_globalPlayerState.index + 1, autoplay);
                return;
            }

            if (_globalPlayerState.repeat === 'all'){
                _gpPlayIndex(0, autoplay);
                return;
            }
            if (_globalPlayerState.source && _globalPlayerState.source.type === 'mywave'){
                const audioEl = document.getElementById('global-audio');
                const seed = (_globalPlayerState.source.seed || (_gpCurTrack() && _gpCurTrack().title) || 'discover');
                const inp = document.getElementById('music-search-input'); if (inp && !String(inp.value || '').trim()) inp.value = seed;
                if (audioEl) audioEl.pause();
                performMusicSearch(false).then(() => {
                    const q = Array.isArray(__musicHubState.queue) ? __musicHubState.queue : [];
                    const playable = q.map(it => ({ url: it.url || it.open_url, title: it.title || 'Трек', meta: { artwork: it.artwork || '', artist: it.artist || '', note: it.note || '', source: it.source || 'Wave', mode: it.mode || 'open', open_url: it.open_url || it.url || '' } })).filter(it => !!it.url);
                    if (playable.length){
                        _globalPlayerState.queue = playable;
                        _globalPlayerState.index = 0;
                        _globalPlayerState.source = { type:'mywave', seed: seed, terms: __musicHubState.waveTerms || [] };
                        _gpLoadAndPlayTrack(_gpCurTrack(), autoplay);
                    } else { _gpUpdateOverlayUI(); }
                }).catch(() => { _gpUpdateOverlayUI(); });
                return;
            }
            // otherwise stop at end
            try{
                const audioEl = document.getElementById('global-audio');
                if (audioEl) audioEl.pause();
            }catch(e){}
            _gpUpdateOverlayUI();
        }

        function _gpPrev(){
            const audioEl = document.getElementById('global-audio');
            const q = Array.isArray(_globalPlayerState.queue) ? _globalPlayerState.queue : [];
            if (!q.length) return;

            const cur = Number(audioEl && audioEl.currentTime ? audioEl.currentTime : 0);
            if (cur > 3){
                if (audioEl) audioEl.currentTime = 0;
                return;
            }

            if (_globalPlayerState.shuffle && q.length > 1){
                let prev = Math.floor(Math.random() * q.length);
                if (prev === _globalPlayerState.index) prev = (prev + 1) % q.length;
                _gpPlayIndex(prev, true);
                return;
            }

            if (_globalPlayerState.index > 0){
                _gpPlayIndex(_globalPlayerState.index - 1, true);
                return;
            }
            if (_globalPlayerState.repeat === 'all'){
                _gpPlayIndex(q.length - 1, true);
            }
        }

        function _gpCycleRepeat(){
            const m = (_globalPlayerState.repeat || 'off');
            _globalPlayerState.repeat = (m === 'off') ? 'all' : (m === 'all' ? 'one' : 'off');
            _gpSetPrefs();
            _gpUpdateOverlayUI();
        }

        function _gpToggleShuffle(){
            _globalPlayerState.shuffle = !_globalPlayerState.shuffle;
            _gpSetPrefs();
            _gpUpdateOverlayUI();
        }

        function _gpOnEnded(){
            const audioEl = document.getElementById('global-audio');
            if (_globalPlayerState.repeat === 'one'){
                try{
                    if (audioEl){
                        audioEl.currentTime = 0;
                        audioEl.play().catch(() => {});
                    }
                }catch(e){}
                return;
            }
            _gpNext(true);
        }

        function _gpUpdateOverlayUI(){
            if (!_gpUI) return;
            const audioEl = document.getElementById('global-audio');
            const t = _gpCurTrack();
            const title = (t && t.title) ? t.title : (_globalPlayerState.title || 'Музыка');

            // cover (if provided)
            try{
                const coverUrl = (t && t.meta && t.meta.cover) ? String(t.meta.cover) : 'default-avatar.png';
                if (_gpUI.ovCover) _gpUI.ovCover.src = coverUrl;
                if (_gpUI.miniCover) _gpUI.miniCover.src = coverUrl;
            }catch(e){}


            if (_gpUI.ovTitleMini) _gpUI.ovTitleMini.textContent = title;
            if (_gpUI.ovTitle) _gpUI.ovTitle.textContent = title;
            _gpRenderSoundCloudRecommendations();

            const q = Array.isArray(_globalPlayerState.queue) ? _globalPlayerState.queue : [];
            const qLen = q.length;
            const idx = (_globalPlayerState.index >= 0) ? (_globalPlayerState.index + 1) : 0;
            const srcName = (_globalPlayerState.source && _globalPlayerState.source.name) ? ` • ${_globalPlayerState.source.name}` : '';
            if (_gpUI.ovSub) _gpUI.ovSub.textContent = `Очередь: ${idx}/${qLen}${srcName}`;

            // buttons states
            if (_gpUI.btnShuffle) _gpUI.btnShuffle.classList.toggle('pc-btn--active', !!_globalPlayerState.shuffle);
            if (_gpUI.btnRepeat){
                _gpUI.btnRepeat.classList.toggle('pc-btn--active', _globalPlayerState.repeat !== 'off');
                _gpSetIcon(_gpUI.btnRepeat, (_globalPlayerState.repeat === 'one') ? 'repeatOne' : 'repeatOff');
            }
            if (_gpUI.btnPlay){
                const paused = !!(audioEl && audioEl.paused);
                _gpSetIcon(_gpUI.btnPlay, paused ? 'play' : 'pause');
            }

            // time + seek + volume
            const dur = Number(audioEl && audioEl.duration ? audioEl.duration : 0);
            const cur = Number(audioEl && audioEl.currentTime ? audioEl.currentTime : 0);
            if (_gpUI.ovCur) _gpUI.ovCur.textContent = _fmtTime(cur);
            if (_gpUI.ovDur) _gpUI.ovDur.textContent = _fmtTime(dur);

            if (_gpUI.ovSeek && dur > 0){
                if (!_gpUI.__isSeekingOverlay) {
                    _gpUI.ovSeek.value = String(Math.round((cur / dur) * 1000));
                }
            } else if (_gpUI.ovSeek && !_gpUI.__isSeekingOverlay) {
                _gpUI.ovSeek.value = '0';
            }

            if (_gpUI.ovVol){
                const vv = Math.round((Number(_globalPlayerState.volume) || 1) * 100);
                _gpUI.ovVol.value = String(vv);
            }
        }

        function _gpUpdateMiniUI(){
            if (!_gpUI) return;
            const audioEl = document.getElementById('global-audio');
            const seekEl = _gpUI.miniSeek;
            const timeEl = _gpUI.miniTime;
            const toggleBtn = _gpUI.miniToggle;
            if (!audioEl || !seekEl || !timeEl || !toggleBtn) return;

            const dur = audioEl.duration || 0;
            const cur = audioEl.currentTime || 0;
            if (dur > 0) {
                if (!_gpUI.__isSeekingMini) {
                    seekEl.value = String(Math.round((cur / dur) * 1000));
                }
                timeEl.textContent = `${_fmtTime(cur)} / ${_fmtTime(dur)}`;
            } else {
                if (!_gpUI.__isSeekingMini) seekEl.value = '0';
                timeEl.textContent = `${_fmtTime(cur)}`;
            }
            _gpSetIcon(toggleBtn, audioEl.paused ? 'play' : 'pause');
            _gpUpdateOverlayUI();
        }

        // Public API: play a single track (kept for backward compatibility)
        function playGlobalTrack(url, titleText = 'Музыка', opts = null) {
            if (!url) return;
            const t = (titleText || 'Музыка').toString();

            // If caller provides a queue, use it
            if (opts && Array.isArray(opts.queue) && opts.queue.length){
                const q = opts.queue.map(x => ({ url: x.url, title: x.title || 'Музыка', meta: x.meta || null })).filter(x => !!x.url);
                _globalPlayerState.queue = q;
                _globalPlayerState.index = Math.max(0, Math.min(q.length - 1, Number(opts.index) || 0));
                _globalPlayerState.source = opts.source || null;
                _gpLoadAndPlayTrack(_gpCurTrack(), opts.autoplay !== false);
                return;
            }

            // Otherwise treat it as a single-track queue
            _gpEnsureQueueForSingle(url, t);
            _gpLoadAndPlayTrack(_gpCurTrack(), true);
        }

        // Convenience: play a queue (array of {url,title})
        function playGlobalQueue(tracks, startIndex = 0, sourceMeta = null){
            const q = Array.isArray(tracks) ? tracks.map(x => ({ url: x.url, title: x.title || 'Музыка', meta: x.meta || null })).filter(x => !!x.url) : [];
            if (!q.length) return;
            _globalPlayerState.queue = q;
            _globalPlayerState.index = Math.max(0, Math.min(q.length - 1, Number(startIndex) || 0));
            _globalPlayerState.source = sourceMeta || null;
            _gpLoadAndPlayTrack(_gpCurTrack(), true);
        }

        // ---- Playlists (server-backed) ----
        let __myPlaylistsCache = null;
        let __myPlaylistsFetchedAt = 0;
        window.__pendingTrackToAdd = null;

        async function fetchMyPlaylists(force = false){
            if (!currentUser || !currentUser.id) return [];
            const now = Date.now();
            if (!force && Array.isArray(__myPlaylistsCache) && (now - __myPlaylistsFetchedAt) < 15000) return __myPlaylistsCache;
            const res = await apiRequest('get_my_playlists', {});
            if (res && res.success){
                hideCaptcha();
                __myPlaylistsCache = Array.isArray(res.playlists) ? res.playlists : [];
                __myPlaylistsFetchedAt = now;
                return __myPlaylistsCache;
            }
            return Array.isArray(__myPlaylistsCache) ? __myPlaylistsCache : [];
        }

        function getFavoritesPlaylist(playlists = null){
            const pls = Array.isArray(playlists) ? playlists : (Array.isArray(__myPlaylistsCache) ? __myPlaylistsCache : []);
            return pls.find(pl => String(pl.system_key || '') === 'favorites') || null;
        }
        async function ensureFavoritesPlaylist(){
            const pls = await fetchMyPlaylists(true);
            return getFavoritesPlaylist(pls);
        }
        async function addTrackToFavorites(trackUrl, trackTitle){
            if (!trackUrl) return;
            const fav = await ensureFavoritesPlaylist();
            if (!fav || !fav.id){ showModal('Любимые песни', 'Не удалось подготовить плейлист «Любимые песни».'); return; }
            const res = await apiRequest('add_track_to_playlist', { playlist_id: fav.id, track_url: trackUrl, track_title: trackTitle || 'Музыка' });
            if (res && res.success){
                hideCaptcha();
                await fetchMyPlaylists(true);
                _gpRenderPlaylists();
                showModal('Любимые песни', res.dedup ? 'Трек уже есть в любимых.' : 'Трек добавлен в любимые.');
            } else {
                showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось добавить в любимые.');
            }
        }
        async function searchSoundCloudTracks(query){ const q = String(query || '').trim(); if (q.length < 2) return { success:false, error:'Введите минимум 2 символа.' }; return await apiRequest('search_soundcloud_tracks', { query:q, limit:10 }, false, { silent:true }); }
        function renderSoundCloudSearchResults(payload){ const host = document.getElementById('player-sc-search-results'); const status = document.getElementById('player-sc-search-status'); if (!host || !status) return; const items = Array.isArray(payload && payload.items) ? payload.items : []; const fallbackUrl = String((payload && payload.fallback_url) || '').trim(); if (!items.length) { const warn = payload && payload.warning ? escapeHtml(payload.warning) : 'По запросу ничего не найдено.'; host.innerHTML = fallbackUrl ? `<div class="player-empty">${warn}<div class="mt-2"><a class="player-link" href="${escapeHtml(fallbackUrl)}" target="_blank" rel="noopener noreferrer">Открыть поиск SoundCloud</a></div></div>` : `<div class="player-empty">${warn}</div>`; status.textContent = payload && payload.query ? `Запрос: ${payload.query}` : ''; return; } status.textContent = `Найдено: ${items.length}`; host.innerHTML = items.map((it, idx) => { const title = escapeHtml(it.title || 'Трек'); const artist = escapeHtml(it.artist || 'SoundCloud'); const genre = escapeHtml(it.genre || ''); const url = escapeHtml(it.url || '#'); const art = String(it.artwork || '').trim(); const artHtml = art ? `<img src="${escapeHtml(art)}" alt="">` : '♪'; const sub = [artist, genre].filter(Boolean).join(' • '); return `<div class="player-sc-card"><div class="player-sc-art">${artHtml}</div><div class="player-sc-meta"><div class="player-sc-title">${idx+1}. ${title}</div><div class="player-sc-sub">${sub || 'Открыть на SoundCloud'}</div></div><div class="player-sc-actions"><button class="player-sc-open" type="button" onclick="window.open('${url}','_blank','noopener')">Открыть</button></div></div>`; }).join(''); }
        async function runSoundCloudSearch(query){ const input = document.getElementById('player-sc-search-input'); const status = document.getElementById('player-sc-search-status'); const host = document.getElementById('player-sc-search-results'); const q = String(query || (input ? input.value : '') || '').trim(); if (!status || !host) return; if (q.length < 2) { status.textContent = 'Введите минимум 2 символа.'; host.innerHTML = ''; return; } status.textContent = 'Ищу треки в SoundCloud…'; host.innerHTML = '<div class="player-empty">Загрузка…</div>'; const res = await searchSoundCloudTracks(q); if (!res || res.success === false) { status.textContent = (res && res.error) ? res.error : 'Не удалось выполнить поиск.'; host.innerHTML = ''; return; } renderSoundCloudSearchResults(res); }

        function buildSoundCloudRecommendations(track){
            const raw = String((track && track.title) || '').trim();
            if (!raw) return [];
            const cleaned = raw.replace(/\s+/g, ' ').trim();
            const parts = cleaned.split(/[-–—]/).map(s => s.trim()).filter(Boolean);
            const base = parts[0] || cleaned;
            const alt = parts.slice(1).join(' ') || cleaned;
            const queries = [cleaned, base + ' remix', alt + ' live', base + ' mix'].filter(Boolean);
            return queries.slice(0,4).map((q, idx) => ({
                title: idx === 0 ? cleaned : q,
                sub: idx === 0 ? 'Похожее на текущий трек' : 'Поиск и подборки SoundCloud',
                url: 'https://soundcloud.com/search/sounds?q=' + encodeURIComponent(q)
            }));
        }
        function _gpRenderSoundCloudRecommendations(){
            const host = document.getElementById('player-sc-recommendations');
            if (!host) return;
            const recs = buildSoundCloudRecommendations(_gpCurTrack());
            if (!recs.length){
                host.innerHTML = '<div class="player-empty">Запустите трек, чтобы увидеть рекомендации из SoundCloud.</div>';
                return;
            }
            host.innerHTML = recs.map((r, idx) => `<a class="player-rec-card" href="${r.url}" target="_blank" rel="noopener"><div class="meta"><div class="title">${escapeHtml(r.title)}</div><div class="sub">${escapeHtml(r.sub)}</div></div><button type="button" class="secondary-button text-sm">Открыть</button></a>`).join('');
        }

        function _gpRenderPlaylists(){
            if (!_gpUI || !_gpUI.plList) return;
            // render from cache (async refresh in background)
            const pls = Array.isArray(__myPlaylistsCache) ? __myPlaylistsCache : [];
            if (!pls.length){
                _gpUI.plList.innerHTML = '';
                if (_gpUI.plEmpty) _gpUI.plEmpty.classList.remove('hidden');
                return;
            }
            if (_gpUI.plEmpty) _gpUI.plEmpty.classList.add('hidden');
            _gpUI.plList.innerHTML = pls.map(pl => {
                const name = escapeHtml(pl.name || 'Плейлист');
                const cnt = Number(pl.track_count || 0);
                const badge = String(pl.system_key || '') === 'favorites' ? '<span class="small">❤️ Любимые</span>' : '';
                return `
                    <div class="player-item">
                        <div class="name">${name}</div>
                        <div class="small">${cnt} треков ${badge}</div>
                        <button type="button" aria-label="Открыть" onclick="openPlaylistSheet('${pl.id}')"><svg class="tg-svg tg-svg--more"><use href="#ico-more-vert"></use></svg></button>
                    </div>
                `;
            }).join('');
        }

        function _gpRenderQueue(){
            if (!_gpUI || !_gpUI.queueList) return;
            const q = Array.isArray(_globalPlayerState.queue) ? _globalPlayerState.queue : [];
            if (!q.length){
                _gpUI.queueList.innerHTML = '';
                if (_gpUI.queueEmpty) _gpUI.queueEmpty.classList.remove('hidden');
                return;
            }
            if (_gpUI.queueEmpty) _gpUI.queueEmpty.classList.add('hidden');
            const curIdx = Number(_globalPlayerState.index);
            _gpUI.queueList.innerHTML = q.map((t, i) => {
                const name = escapeHtml(t.title || 'Музыка');
                const active = (i === curIdx) ? 'is-active' : '';
                return `
                    <div class="player-item ${active}">
                        <div class="name">${name}</div>
                        <button type="button" aria-label="Играть" onclick="_gpPlayIndex(${i}, true)">▶️</button>
                    </div>
                `;
            }).join('');
        }

        async function openCreatePlaylistSheet(){
            const html = `
                <div class="sheet-head">
                    <div class="sheet-title">Новый плейлист</div>
                    <div class="sheet-sub">Соберите песни и делитесь ссылкой с друзьями</div>
                </div>
                <div style="padding: 10px 12px 0;">
                    <input id="pl-name" class="input-field w-full" placeholder="Название" maxlength="40" />
                    <textarea id="pl-desc" class="input-field w-full mt-2" placeholder="Описание (необязательно)" maxlength="200"></textarea>
                    <label class="flex items-center gap-2 mt-2 text-sm" style="color:rgba(255,255,255,0.82);">
                        <input id="pl-public" type="checkbox" />
                        Публичный (по ссылке)
                    </label>
                </div>
                <div class="sheet-actions">
                    <button class="sheet-btn" type="button" onclick="submitCreatePlaylist();"><span class="sheet-ico">✅</span>Создать</button>
                    <button class="sheet-btn" type="button" onclick="closeSheet();"><span class="sheet-ico">✕</span>Отмена</button>
                </div>
            `;
            openSheet(html);
            setTimeout(() => { try{ document.getElementById('pl-name')?.focus(); }catch(e){} }, 50);
        }

        async function submitCreatePlaylist(){
            const name = (document.getElementById('pl-name')?.value || '').trim();
            const description = (document.getElementById('pl-desc')?.value || '').trim();
            const is_public = (document.getElementById('pl-public')?.checked) ? 1 : 0;
            if (!name){
                showModal('Плейлист', 'Введите название плейлиста.');
                return;
            }
            const res = await apiRequest('create_playlist', { name, description, is_public });
            if (res && res.success){
                hideCaptcha();
                closeSheet();
                await fetchMyPlaylists(true);
                _gpRenderPlaylists();
                showModal('Плейлист', 'Плейлист создан.');
            } else {
                showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось создать плейлист.');
            }
        }

        async function openAddToPlaylistDialog(trackUrl, trackTitle){
            if (!currentUser || !currentUser.id){
                showModal('Плейлист', 'Сначала войдите в аккаунт.');
                return;
            }
            if (!trackUrl) return;
            window.__pendingTrackToAdd = { url: trackUrl, title: trackTitle || 'Музыка' };
            const pls = await fetchMyPlaylists(true);

            if (!pls.length){
                closeSheet();
                await openCreatePlaylistSheet();
                return;
            }

            const items = pls.map(pl => {
                const nm = escapeHtml(pl.name || 'Плейлист');
                return `<button class="sheet-btn" type="button" onclick="addPendingTrackToPlaylist('${pl.id}'); closeSheet();"><span class="sheet-ico">🎵</span>${nm}</button>`;
            }).join('');

            const html = `
                <div class="sheet-head">
                    <div class="sheet-title">Добавить в плейлист</div>
                    <div class="sheet-sub">Выберите плейлист</div>
                </div>
                <div class="sheet-actions">
                    ${items}
                    <button class="sheet-btn" type="button" onclick="openCreatePlaylistSheet();"><span class="sheet-ico">➕</span>Новый плейлист</button>
                    <button class="sheet-btn" type="button" onclick="closeSheet();"><span class="sheet-ico">✕</span>Отмена</button>
                </div>
            `;
            openSheet(html);
        }

        async function addPendingTrackToPlaylist(playlistId){
            const t = window.__pendingTrackToAdd;
            if (!t || !t.url) return;
            const res = await apiRequest('add_track_to_playlist', { playlist_id: playlistId, track_url: t.url, track_title: t.title });
            if (res && res.success){
                hideCaptcha();
                await fetchMyPlaylists(true);
                _gpRenderPlaylists();
                showModal('Плейлист', 'Трек добавлен.');
            } else {
                showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось добавить трек.');
            }
        }

        async function openPlaylistSheet(playlistId){
            const res = await apiRequest('get_playlist', { playlist_id: playlistId });
            if (!res || !res.success){
                showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось открыть плейлист.');
                return;
            }
            hideCaptcha();
            const pl = res.playlist || {};
            const tracks = Array.isArray(pl.tracks) ? pl.tracks : [];
            const title = escapeHtml(pl.name || 'Плейлист');
            const desc = escapeHtml(pl.description || '');
            const pub = !!pl.is_public;

            const trackRows = tracks.length ? tracks.map((tr, idx) => {
                const tn = escapeHtml(tr.title || 'Музыка');
                const tid = String(tr.id || '');
                return `
                    <div class="player-item">
                        <div class="name">${tn}</div>
                        <button type="button" aria-label="Играть" onclick="playerPlayPlaylist('${pl.id}', ${idx}); closeSheet();">▶️</button>
                        <button type="button" aria-label="Удалить" onclick="playerRemoveTrackFromPlaylist('${pl.id}','${tid}');">✕</button>
                    </div>
                `;
            }).join('') : `<div class="player-empty">Нет треков. Добавьте треки из чатов или из плеера.</div>`;

            const html = `
                <div class="sheet-head">
                    <div class="sheet-title">${title}</div>
                    <div class="sheet-sub">${tracks.length} треков${pl.owner_name ? ' • Автор: ' + escapeHtml(pl.owner_name) : ''}</div>
                </div>
                ${desc ? `<div style="padding:10px 14px 0; color: rgba(255,255,255,0.78); font-size: 13px;">${desc}</div>` : ''}
                <div class="sheet-actions">
                    <button class="sheet-btn" type="button" onclick="playerPlayPlaylist('${pl.id}', 0); closeSheet();"><span class="sheet-ico">▶️</span>Слушать</button>
                    <button class="sheet-btn" type="button" onclick="playerSharePlaylist('${pl.id}');"><span class="sheet-ico">🔗</span>Поделиться</button>
                    <button class="sheet-btn" type="button" onclick="openEditPlaylistSheet('${pl.id}');"><span class="sheet-ico">⚙️</span>Настройки</button>
                    <button class="sheet-btn danger" type="button" onclick="playerDeletePlaylist('${pl.id}');"><span class="sheet-ico">🗑️</span>Удалить плейлист</button>
                    <button class="sheet-btn" type="button" onclick="closeSheet();"><span class="sheet-ico"><svg class="tg-svg" aria-hidden="true"><use href="#ico-x"></use></svg></span>Закрыть</button>
                </div>
                <div style="padding: 0 10px 12px;">
                    ${trackRows}
                </div>
            `;
            openSheet(html);
        }

        async function openEditPlaylistSheet(pid){
            const res = await apiRequest('get_playlist', { playlist_id: pid });
            if (!res || !res.success){
                showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось загрузить плейлист.');
                return;
            }
            hideCaptcha();
            const pl = res.playlist || {};
            const name = String(pl.name || '');
            const desc = String(pl.description || '');
            const isPublic = !!pl.is_public;

            const html = `
                <div class="sheet-head">
                    <div class="sheet-title">Настройки плейлиста</div>
                    <div class="sheet-sub">Переименовать / сделать публичным</div>
                </div>
                <div style="padding: 10px 12px 0;">
                    <input id="pl-edit-name" class="input-field w-full" placeholder="Название" maxlength="40" value="${escapeHtml(name)}" />
                    <textarea id="pl-edit-desc" class="input-field w-full mt-2" placeholder="Описание" maxlength="200">${escapeHtml(desc)}</textarea>
                    <label class="flex items-center gap-2 mt-2 text-sm" style="color:rgba(255,255,255,0.82);">
                        <input id="pl-edit-public" type="checkbox" ${isPublic ? 'checked' : ''} />
                        Публичный (по ссылке)
                    </label>
                </div>
                <div class="sheet-actions">
                    <button class="sheet-btn" type="button" onclick="submitEditPlaylist('${pid}');"><span class="sheet-ico">✅</span>Сохранить</button>
                    <button class="sheet-btn" type="button" onclick="closeSheet();"><span class="sheet-ico">✕</span>Отмена</button>
                </div>
            `;
            openSheet(html);
        }

        async function submitEditPlaylist(pid){
            const name = (document.getElementById('pl-edit-name')?.value || '').trim();
            const description = (document.getElementById('pl-edit-desc')?.value || '').trim();
            const is_public = (document.getElementById('pl-edit-public')?.checked) ? 1 : 0;
            if (!name){
                showModal('Плейлист', 'Введите название.');
                return;
            }
            const res = await apiRequest('update_playlist', { playlist_id: pid, name, description, is_public });
            if (res && res.success){
                hideCaptcha();
                closeSheet();
                await fetchMyPlaylists(true);
                _gpRenderPlaylists();
                showModal('Плейлист', 'Сохранено.');
            } else {
                showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось сохранить.');
            }
        }

        async function playerDeletePlaylist(pid){
            closeSheet();
            showModal('Удалить плейлист?', 'Это действие необратимо.', true, async () => {
                const res = await apiRequest('delete_playlist', { playlist_id: pid });
                if (res && res.success){
                    hideCaptcha();
                    await fetchMyPlaylists(true);
                    _gpRenderPlaylists();
                    showModal('Плейлист', 'Плейлист удалён.');
                } else {
                    showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось удалить.');
                }
            });
        }

        async function playerRemoveTrackFromPlaylist(pid, trackId){
            const res = await apiRequest('remove_track_from_playlist', { playlist_id: pid, track_id: trackId });
            if (res && res.success){
                hideCaptcha();
                // re-open sheet to refresh
                await fetchMyPlaylists(true);
                _gpRenderPlaylists();
                openPlaylistSheet(pid);
            } else {
                showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось удалить трек.');
            }
        }

        async function playerPlayPlaylist(pid, startIndex = 0){
            const res = await apiRequest('get_playlist', { playlist_id: pid });
            if (!res || !res.success){
                showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось загрузить плейлист.');
                return;
            }
            hideCaptcha();
            const pl = res.playlist || {};
            const tracks = Array.isArray(pl.tracks) ? pl.tracks : [];
            const q = tracks.map(t => ({ url: t.url, title: t.title || 'Музыка' })).filter(t => !!t.url);
            if (!q.length){
                showModal('Плейлист', 'В этом плейлисте пока нет треков.');
                return;
            }
            playGlobalQueue(q, startIndex, { type: 'playlist', id: pid, name: pl.name || 'Плейлист' });
            _gpOpenOverlay();
        }

        async function playerSharePlaylist(pid){
            const link = (() => {
                try{
                    return `${location.origin}${location.pathname}?playlist=${encodeURIComponent(pid)}`;
                }catch(e){
                    return `?playlist=${encodeURIComponent(pid)}`;
                }
            })();

            // Try native share
            try{
                if (navigator.share){
                    await navigator.share({ title: 'Плейлист', text: 'Плейлист SuperChat', url: link });
                    return;
                }
            }catch(e){}

            // Copy to clipboard
            try{
                if (navigator.clipboard && navigator.clipboard.writeText){
                    await copyTextCompat(text);
                    showModal('Ссылка скопирована', link);
                    return;
                }
            }catch(e){}

            // Fallback
            showModal('Ссылка на плейлист', link);
        }

        async function importPlaylist(pid){
            const res = await apiRequest('import_playlist', { playlist_id: pid });
            if (res && res.success){
                hideCaptcha();
                await fetchMyPlaylists(true);
                _gpRenderPlaylists();
                showModal('Плейлист', 'Плейлист добавлен к вам.');
            } else {
                showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось импортировать плейлист.');
            }
        }

        async function openSharedPlaylist(pid){
            if (!pid) return;
            const res = await apiRequest('get_playlist', { playlist_id: pid });
            if (!res || !res.success){
                showModal('Плейлист', (res && res.error) ? res.error : 'Плейлист не найден или недоступен.');
                return;
            }
            hideCaptcha();
            const pl = res.playlist || {};
            const tracks = Array.isArray(pl.tracks) ? pl.tracks : [];
            const title = escapeHtml(pl.name || 'Плейлист');
            const author = pl.owner_name ? escapeHtml(pl.owner_name) : '';
            const html = `
                <div class="sheet-head">
                    <div class="sheet-title">${title}</div>
                    <div class="sheet-sub">${tracks.length} треков${author ? ' • Автор: ' + author : ''}</div>
                </div>
                <div class="sheet-actions">
                    <button class="sheet-btn" type="button" onclick="playerPlayPlaylist('${pl.id}', 0); closeSheet();"><span class="sheet-ico">▶️</span>Слушать</button>
                    <button class="sheet-btn" type="button" onclick="importPlaylist('${pl.id}'); closeSheet();"><span class="sheet-ico">➕</span>Добавить к себе</button>
                    <button class="sheet-btn" type="button" onclick="playerSharePlaylist('${pl.id}');"><span class="sheet-ico">🔗</span>Скопировать ссылку</button>
                    <button class="sheet-btn" type="button" onclick="closeSheet();"><span class="sheet-ico"><svg class="tg-svg" aria-hidden="true"><use href="#ico-x"></use></svg></span>Закрыть</button>
                </div>
            `;
            openSheet(html);
        }

        async function _gpHandlePendingPlaylistOpen(){
            if (!__pendingPlaylistIdFromUrl) return;
            const pid = __pendingPlaylistIdFromUrl;
            __pendingPlaylistIdFromUrl = null;
            // ensure user is logged in
            if (!currentUser || !currentUser.id){
                // will be picked up after login
                __pendingPlaylistIdFromUrl = pid;
                return;
            }
            await openSharedPlaylist(pid);
        }

        async function _gpShareCurrentTrack(){
            const tr = _gpCurTrack();
            if (!tr || !tr.url) return;
            const txt = `🎵 ${tr.title || 'Музыка'}\n${tr.url}`;

            (async () => {
                try{
                    if (navigator.share){
                        await navigator.share({ title: tr.title || 'Музыка', text: txt, url: tr.url });
                        return;
                    }
                }catch(e){}
                try{
                    if (navigator.clipboard && navigator.clipboard.writeText){
                        await copyTextCompat(text);
                        showModal('Скопировано', txt);
                        return;
                    }
                }catch(e){}
                showModal('Трек', txt);
            })();
        }

        function _gpSwitchTab(which){
            if (!_gpUI) return;
            const isQueue = (which === 'queue');
            _gpUI.tabQueue?.classList.toggle('is-active', isQueue);
            _gpUI.tabPlaylists?.classList.toggle('is-active', !isQueue);
            _gpUI.tabContentQueue?.classList.toggle('hidden', !isQueue);
            _gpUI.tabContentPlaylists?.classList.toggle('hidden', isQueue);
            if (!isQueue){
                // refresh playlists in case changed
                fetchMyPlaylists(true).then(() => _gpRenderPlaylists());
            }
        }

        function initGlobalPlayer() {
            const playerEl = document.getElementById('global-player');
            const audioEl = document.getElementById('global-audio');
            const toggleBtn = document.getElementById('global-player-toggle');
            const closeBtn = document.getElementById('global-player-close');
            const seekEl = document.getElementById('global-player-seek');
            const titleEl = document.getElementById('global-player-title');
            const timeEl = document.getElementById('global-player-time');

                        const miniCover = document.getElementById('global-player-cover');
// overlay
            const overlay = document.getElementById('player-overlay');
            const panel = document.getElementById('player-panel');
            const ovClose = document.getElementById('player-overlay-close');
            const ovFs = document.getElementById('player-overlay-fullscreen');
            const ovTitleMini = document.getElementById('player-overlay-title-mini');
            const ovSub = document.getElementById('player-overlay-sub');
            const ovTitle = document.getElementById('player-overlay-title');
                        const ovCover = document.getElementById('player-overlay-cover');
const ovSeek = document.getElementById('player-overlay-seek');
            const ovCur = document.getElementById('player-overlay-cur');
            const ovDur = document.getElementById('player-overlay-dur');
            const ovPrev = document.getElementById('player-overlay-prev');
            const ovPlay = document.getElementById('player-overlay-play');
            const ovNext = document.getElementById('player-overlay-next');
            const ovRepeat = document.getElementById('player-overlay-repeat');
            const ovShuffle = document.getElementById('player-overlay-shuffle');
            const ovAdd = document.getElementById('player-overlay-add');
            const ovFav = document.getElementById('player-overlay-favorite');
            const ovShareTrack = document.getElementById('player-overlay-share-track');
            const ovVol = document.getElementById('player-overlay-volume');
            const tabQueue = document.getElementById('player-tab-queue');
            const tabPlaylists = document.getElementById('player-tab-playlists');
            const tabContentQueue = document.getElementById('player-tab-content-queue');
            const tabContentPlaylists = document.getElementById('player-tab-content-playlists');
            const queueList = document.getElementById('player-queue');
            const queueEmpty = document.getElementById('player-queue-empty');
            const plList = document.getElementById('player-playlists');
            const plEmpty = document.getElementById('player-playlists-empty');
            const plCreate = document.getElementById('player-create-playlist');

            if (!playerEl || !audioEl || !toggleBtn || !closeBtn || !seekEl || !titleEl || !timeEl) return;

            _gpUI = {
                overlay, panel,
                miniToggle: toggleBtn,
                miniSeek: seekEl,
                miniTime: timeEl,
                miniTitle: titleEl,
                miniCover,
                miniClose: closeBtn,
                ovClose, ovFs,
                ovTitleMini, ovSub, ovTitle, ovCover, ovSeek, ovCur, ovDur,
                btnPrev: ovPrev, btnPlay: ovPlay, btnNext: ovNext,
                btnRepeat: ovRepeat, btnShuffle: ovShuffle,
                btnAdd: ovAdd, btnFav: ovFav, btnShareTrack: ovShareTrack,
                ovVol,
                tabQueue, tabPlaylists, tabContentQueue, tabContentPlaylists,
                queueList, queueEmpty,
                plList, plEmpty, plCreate,
                __isSeekingMini: false,
                __isSeekingOverlay: false,
            };
            // set initial icons
            _gpSetIcon(toggleBtn, 'pause');
            _gpSetIcon(closeBtn, 'close');
            _gpSetIcon(ovClose, 'chevronDown');
            _gpSetIcon(ovFs, 'fullscreen');
            _gpSetIcon(ovPrev, 'prev');
            _gpSetIcon(ovPlay, 'pause');
            _gpSetIcon(ovNext, 'next');
            _gpSetIcon(ovRepeat, 'repeatOff');
            _gpSetIcon(ovShuffle, 'shuffle');
            _gpSetIcon(ovAdd, 'plus');
            _gpSetIcon(ovFav, 'heart');
            _gpSetIcon(ovShareTrack, 'share');
            const volIcon = panel && panel.querySelector('.player-vol span');
            if (volIcon) volIcon.innerHTML = _GP_ICONS.volume;


            // apply initial prefs
            if (!['off','one','all'].includes(_globalPlayerState.repeat)) _globalPlayerState.repeat = 'off';
            audioEl.volume = Math.max(0, Math.min(1, Number(_globalPlayerState.volume) || 1));
            _gpSetPrefs();

            // Mini player events
            audioEl.addEventListener('timeupdate', _gpUpdateMiniUI);
            audioEl.addEventListener('loadedmetadata', _gpUpdateMiniUI);
            audioEl.addEventListener('play', () => {
                playerEl.classList.remove('hidden');
                _gpUpdateMiniUI();
                updateFabForPlayer();
            });
            audioEl.addEventListener('pause', _gpUpdateMiniUI);
            audioEl.addEventListener('ended', () => {
                _gpUpdateMiniUI();
                _gpOnEnded();
            });

            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (audioEl.paused) {
                    audioEl.play().catch(() => {
                        showModal('Музыка', 'Нажмите ▶️ ещё раз, чтобы начать воспроизведение (браузер мог заблокировать авто-плей).');
                    });
                } else {
                    audioEl.pause();
                }
            });

            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                audioEl.pause();
                audioEl.currentTime = 0;
                audioEl.removeAttribute('src');
                audioEl.load();
                _globalPlayerState.url = null;
                _globalPlayerState.title = null;
                _globalPlayerState.queue = [];
                _globalPlayerState.index = -1;
                _globalPlayerState.source = null;
                playerEl.classList.add('hidden');
                updateFabForPlayer();
                _gpCloseOverlay();
            });

            seekEl.addEventListener('input', () => { _gpUI.__isSeekingMini = true; });
            seekEl.addEventListener('change', () => {
                const dur = audioEl.duration || 0;
                if (dur > 0) {
                    const v = (Number(seekEl.value) || 0) / 1000;
                    audioEl.currentTime = v * dur;
                }
                _gpUI.__isSeekingMini = false;
                _gpUpdateMiniUI();
            });

            // Open overlay when tapping mini player bar (except buttons/slider)
            playerEl.addEventListener('click', (e) => {
                try{
                    if (e.target.closest('button') || e.target.closest('input')) return;
                    if (playerEl.classList.contains('hidden')) return;
                    _gpOpenOverlay();
                }catch(err){}
            });

            // Overlay events
            if (overlay && panel){
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) _gpCloseOverlay();
                });
            }
            ovClose?.addEventListener('click', (e) => { e.preventDefault(); _gpCloseOverlay(); });
            ovFs?.addEventListener('click', (e) => { e.preventDefault(); _gpToggleOverlayFullscreen(); });

            ovPlay?.addEventListener('click', (e) => {
                e.preventDefault();
                if (audioEl.paused) audioEl.play().catch(() => {});
                else audioEl.pause();
                _gpUpdateOverlayUI();
            });
            ovPrev?.addEventListener('click', (e) => { e.preventDefault(); _gpPrev(); });
            ovNext?.addEventListener('click', (e) => { e.preventDefault(); _gpNext(true); });
            ovRepeat?.addEventListener('click', (e) => { e.preventDefault(); _gpCycleRepeat(); });
            ovShuffle?.addEventListener('click', (e) => { e.preventDefault(); _gpToggleShuffle(); });
            ovAdd?.addEventListener('click', (e) => {
                e.preventDefault();
                const tr = _gpCurTrack();
                if (tr && tr.url) openAddToPlaylistDialog(tr.url, tr.title || 'Музыка');
            });
            ovShareTrack?.addEventListener('click', (e) => { e.preventDefault(); _gpShareCurrentTrack(); });

            ovVol?.addEventListener('input', () => {
                const vv = Math.max(0, Math.min(100, Number(ovVol.value) || 0));
                _globalPlayerState.volume = vv / 100;
                audioEl.volume = _globalPlayerState.volume;
                _gpSetPrefs();
            });

            // overlay seek
            ovSeek?.addEventListener('input', () => { _gpUI.__isSeekingOverlay = true; });
            ovSeek?.addEventListener('change', () => {
                const dur = audioEl.duration || 0;
                if (dur > 0) {
                    const v = (Number(ovSeek.value) || 0) / 1000;
                    audioEl.currentTime = v * dur;
                }
                _gpUI.__isSeekingOverlay = false;
                _gpUpdateOverlayUI();
            });

            tabQueue?.addEventListener('click', () => _gpSwitchTab('queue'));
            tabPlaylists?.addEventListener('click', () => _gpSwitchTab('playlists'));
            plCreate?.addEventListener('click', () => openCreatePlaylistSheet());
            document.getElementById('player-sc-search-btn')?.addEventListener('click', () => runSoundCloudSearch());
            document.getElementById('player-sc-search-input')?.addEventListener('keydown', (e) => { if (e && e.key === 'Enter') { e.preventDefault(); runSoundCloudSearch(); } });

            // ESC closes overlay
            document.addEventListener('keydown', (e) => {
                try{
                    if (!overlay || overlay.classList.contains('hidden')) return;
                    if (e && (e.key === 'Escape' || e.key === 'Esc')) _gpCloseOverlay();
                }catch(err){}
            });

            // keep FAB aligned with player on orientation changes
            window.addEventListener('resize', () => {
                if (!playerEl.classList.contains('hidden')) updateFabForPlayer();
            });

            // initial render
            _gpUpdateMiniUI();

            // preload playlists cache (best-effort)
            fetchMyPlaylists(true).then(() => { _gpRenderPlaylists(); }).catch(() => {});

            // If opened by a playlist link, show it after auth is ready
            setTimeout(() => { try{ _gpHandlePendingPlaylistOpen(); }catch(e){} }, 500);
        }



function escapeHtml(str) {
            return String(str ?? '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }


function escapeJsString(str) {
            return String(str ?? '')
                .replace(/\\/g, '\\\\')
                .replace(/'/g, "\\'")
                .replace(/\r?\n/g, ' ');
        }

        // Палитры для подсветки профиля цветом активного эксклюзивного подарка
        function getEffectPalette(effect) {
            const palettes = {
                lolpol:  { accent: '#ef4444', glow: 'rgba(239,68,68,0.45)',  glow2: 'rgba(239,68,68,0.22)',  border: 'rgba(252,165,165,0.85)' },
                dragon:  { accent: '#ff4d00', glow: 'rgba(255,77,0,0.45)',  glow2: 'rgba(124,58,237,0.22)', border: 'rgba(255,180,0,0.65)' },
                phoenix: { accent: '#38bdf8', glow: 'rgba(56,189,248,0.40)', glow2: 'rgba(168,85,247,0.26)', border: 'rgba(250,204,21,0.72)' },
            };
            const p = palettes[effect] || null;
            if (!p) return null;
            const rgb = hexToRgb(p.accent);
            return { ...p, accentRgb: `${rgb.r},${rgb.g},${rgb.b}` };
        }

        function isNftGiftKey(key){
            return !!(key && GIFTS_STORE[key] && GIFTS_STORE[key].type === 'nft');
        }

        function hasPackageInstalled(kind){
            try { return !!localStorage.getItem('vox_pkg_' + kind); } catch(e) { return false; }
        }

        const PACKAGE_REGISTRY = {
            core: {
                id: 'core',
                title: 'Необходимый пакет',
                desc: 'Базовые ресурсы интерфейса и оптимизаций. Нужен для стабильной работы приложения.',
                required: true,
                assets: ['/default.png','/default-avatar.png','/bot_avatar.png','/qrcode.min.js','/jsQR.js','/qrcodejs.LICENSE.txt']
            },
            effects: {
                id: 'effects',
                title: 'Пакет эффектов',
                desc: 'Облегчённые ассеты и мягкие визуальные эффекты для интерфейса.',
                required: false,
                assets: ['/default.png','/default-avatar.png','/bot_avatar.png']
            },
            notifications: {
                id: 'notifications',
                title: 'Пакет уведомлений',
                desc: 'Иконки и системные ресурсы для всплывающих уведомлений в браузере.',
                required: false,
                assets: ['/default-avatar.png','/bot_avatar.png']
            }
        };
        const __packageRuntimeState = {};
        const __seenNotificationIds = new Set();
        let __siteToastSeed = 0;

        function getPackageMeta(kind){ return PACKAGE_REGISTRY[kind] || null; }
        function getPackageStorageKey(kind){ return 'vox_pkg_' + String(kind || ''); }
        function getPackageState(kind){
            const meta = getPackageMeta(kind);
            const busy = __packageRuntimeState[kind] || null;
            const installed = hasPackageInstalled(kind);
            let installedAt = 0;
            try{ installedAt = Number(localStorage.getItem(getPackageStorageKey(kind)) || 0); }catch(e){}
            return {
                kind,
                meta,
                installed,
                installedAt,
                busy: !!busy,
                progress: busy ? Number(busy.progress || 0) : (installed ? 100 : 0),
                label: busy ? (busy.label || 'Подготовка…') : (installed ? 'Установлен' : (meta && meta.required ? 'Требуется' : 'Не установлен'))
            };
        }
        function isRequiredPackageMissing(){ return !hasPackageInstalled('core'); }
        function renderRequiredPackageBanner(){
            if (!isRequiredPackageMissing()) return '';
            return `<div class="pkg-banner"><div><strong>Установите необходимый пакет</strong><div class="text-sm text-slate-300 mt-1">Без него приложение работает, но чаще показывает баннеры и не включает оптимизации для телефона.</div></div><button class="primary-button text-sm px-3 py-2 bg-amber-500 hover:bg-amber-600" onclick="downloadPackage('core')">Установить</button></div>`;
        }
        function getPackageChipHtml(state){
            const cls = state.busy ? 'busy' : (state.installed ? 'ok' : (state.meta && state.meta.required ? 'warn' : ''));
            return `<span class="pkg-chip ${cls}">${escapeHtml(state.label)}</span>`;
        }
        function renderPackagesPanelHtml(context = 'settings'){
            const order = ['core','effects','notifications'];
            const cards = order.map(kind => {
                const st = getPackageState(kind);
                const meta = st.meta;
                if (!meta) return '';
                const requiredCls = meta.required ? 'is-required' : '';
                const busyCls = st.busy ? 'is-busy' : '';
                const sub = meta.required ? 'Обязателен' : 'Необязателен';
                const installedAt = st.installedAt ? new Date(st.installedAt).toLocaleString() : 'ещё не скачан';
                const mainAction = st.installed
                    ? `<button class="secondary-button text-sm" onclick="removePackage('${kind}')">Удалить</button>`
                    : `<button class="primary-button text-sm px-3 py-2 bg-violet-600 hover:bg-violet-700" onclick="downloadPackage('${kind}')">Скачать</button>`;
                const reloadAction = `<button class="secondary-button text-sm" onclick="downloadPackage('${kind}', false, { force: true })">Пересобрать</button>`;
                return `<div class="pkg-card ${requiredCls} ${busyCls}">
                    <div class="pkg-card-head">
                        <div class="min-w-0">
                            <div class="pkg-card-title">${escapeHtml(meta.title)}</div>
                            <div class="pkg-card-sub">${escapeHtml(meta.desc)}</div>
                        </div>
                        ${getPackageChipHtml(st)}
                    </div>
                    <div class="text-xs text-slate-400">${sub} • Файлов: ${meta.assets.length} • Последняя установка: ${escapeHtml(installedAt)}</div>
                    <div class="pkg-progress"><span style="width:${Math.max(0, Math.min(100, st.progress))}%"></span></div>
                    <div class="text-xs text-slate-300">${escapeHtml(st.label)} ${st.busy ? ('• ' + Math.round(st.progress) + '%') : ''}</div>
                    <div class="pkg-actions">${mainAction}${reloadAction}</div>
                </div>`;
            }).join('');
            return `${context === 'settings' ? renderRequiredPackageBanner() : ''}<div class="settings-card mt-4"><div class="flex justify-between items-center gap-3"><div><h4 class="font-bold">📦 Пакеты</h4><p class="text-sm text-slate-400">Скачивание, удаление, пересборка и хранение пакетов прямо в браузере.</p></div><button class="secondary-button text-sm" onclick="clearPackagesCache()">Удалить всё</button></div><div class="pkg-grid mt-3">${cards}</div></div>`;
        }
        function rerenderPackagePanels(){
            try{ const host = document.getElementById('settings-packages-panel'); if (host) host.innerHTML = renderPackagesPanelHtml('settings'); }catch(e){}
            try{ const host2 = document.getElementById('file-manager-packages-panel'); if (host2) host2.innerHTML = renderPackagesPanelHtml('manager'); }catch(e){}
            try{ refreshGift3dControls(); }catch(e){}
        }
        function isScrollFxEnabled(){
            try{ return localStorage.getItem('vox_scroll_fx_enabled') !== '0'; }catch(e){ return true; }
        }
        function applyScrollFxPreference(){
            try{ document.body.setAttribute('data-scroll-fx', isScrollFxEnabled() ? '1' : '0'); }catch(e){}
            return isScrollFxEnabled();
        }
        function setScrollFxEnabled(enabled){
            try{ localStorage.setItem('vox_scroll_fx_enabled', enabled ? '1' : '0'); }catch(e){}
            applyScrollFxPreference();
            showModal('Настройки', enabled ? 'Эффекты при скролле включены.' : 'Эффекты при скролле отключены.');
        }
        function applyMobileLiteMode(){
            let enabled = false;
            try{
                const saved = localStorage.getItem('vox_mobile_lite');
                if (saved === '1') enabled = true;
                else if (saved === '0') enabled = false;
                else enabled = false;
            }catch(e){}
            try{ document.body.setAttribute('data-mobile-lite', enabled ? '1' : '0'); }catch(e){}
            return enabled;
        }
        function isMobileLiteMode(){
            try{ return document.body.getAttribute('data-mobile-lite') === '1'; }catch(e){ return false; }
        }
        function isGift3dEnabled(){
            try{
                if (isMobileLiteMode()) return false;
                if (localStorage.getItem('vox_gifts_3d_enabled') !== '1') return false;
                if (!hasPackageInstalled('effects')) return false;
                if (localStorage.getItem('vox_low_spec') === '1' || localStorage.getItem('vox_power_save') === '1') return false;
                return true;
            }catch(e){ return false; }
        }
        function refreshGift3dControls(){
            try{
                const enabled = isGift3dEnabled();
                const installed = hasPackageInstalled('effects');
                const toggle = document.getElementById('gifts-3d-toggle');
                if (toggle) {
                    toggle.checked = enabled;
                    toggle.disabled = !installed || isMobileLiteMode();
                }
                document.querySelectorAll('[data-gifts3d-action]').forEach(btn => {
                    const action = isMobileLiteMode() ? 'mobile-disabled' : (enabled ? 'disable' : (installed ? 'enable' : 'download'));
                    btn.dataset.gifts3dAction = action;
                    if (action === 'disable') {
                        btn.textContent = 'Выключить';
                        btn.className = 'primary-button text-sm px-3 py-2 bg-amber-600 hover:bg-amber-700';
                        btn.onclick = () => setGift3dEnabled(false);
                    } else if (action === 'enable') {
                        btn.textContent = 'Включить';
                        btn.className = 'primary-button text-sm px-3 py-2 bg-emerald-600 hover:bg-emerald-700';
                        btn.onclick = () => setGift3dEnabled(true);
                    } else if (action === 'mobile-disabled') {
                        btn.textContent = 'Недоступно на телефоне';
                        btn.className = 'primary-button text-sm px-3 py-2 bg-slate-700';
                        btn.onclick = () => showModal('3D подарки', 'На телефонах 3D-вид отключён для плавности интерфейса.');
                    } else {
                        btn.textContent = 'Скачать пакет эффектов';
                        btn.className = 'primary-button text-sm px-3 py-2 bg-slate-700 hover:bg-slate-600';
                        btn.onclick = () => downloadPackage('effects');
                    }
                });
            }catch(e){}
        }
        function setGift3dEnabled(enabled){
            try{
                if (isMobileLiteMode() && enabled){
                    showModal('3D подарки', 'На телефонах 3D-подарки отключены ради производительности.');
                    refreshGift3dControls();
                    return;
                }
                if (enabled && !hasPackageInstalled('effects')){
                    showModal('Нужен пакет', 'Чтобы включить 3D-подарки, сначала скачайте пакет эффектов.');
                    refreshGift3dControls();
                    return;
                }
                localStorage.setItem('vox_gifts_3d_enabled', enabled ? '1' : '0');
                refreshGift3dControls();
                renderCurrentScreen();
            }catch(e){}
        }
        async function downloadPackage(kind, silent = false, opts = {}){
            const meta = getPackageMeta(kind);
            if (!meta){
                if (!silent) showModal('Пакеты', 'Неизвестный пакет.');
                return false;
            }
            if (__packageRuntimeState[kind] && __packageRuntimeState[kind].busy) return false;
            __packageRuntimeState[kind] = { busy: true, progress: 2, label: 'Подготовка…' };
            rerenderPackagePanels();
            try{
                const force = !!(opts && opts.force);
                const cacheName = 'vox-packages-v2';
                let done = 0;
                const total = Math.max(1, meta.assets.length);
                const update = (label, extra = 0) => {
                    __packageRuntimeState[kind] = { busy: true, progress: Math.max(2, Math.min(100, ((done + extra) / total) * 100)), label };
                    rerenderPackagePanels();
                };
                let cache = null;
                if ('caches' in window && typeof caches.open === 'function') cache = await caches.open(cacheName);
                for (const asset of meta.assets){
                    update('Загрузка ' + asset.split('/').pop(), 0.25);
                    const res = await fetch(asset, { cache: force ? 'reload' : 'force-cache' });
                    if (!res || (!res.ok && res.type !== 'opaque')) throw new Error('Не удалось скачать ' + asset);
                    if (cache) { try{ await cache.put(asset, res.clone()); }catch(e){} }
                    done += 1;
                    update('Сохранение…');
                }
                localStorage.setItem(getPackageStorageKey(kind), String(Date.now()));
                if (kind === 'core') localStorage.setItem('vox_pkg_banner_dismissed', '0');
                __packageRuntimeState[kind] = { busy: false, progress: 100, label: 'Установлен' };
                rerenderPackagePanels();
                if (!silent) showModal('Пакеты', `Пакет «${meta.title}» готов.`);
                return true;
            }catch(e){
                console.error(e);
                delete __packageRuntimeState[kind];
                rerenderPackagePanels();
                if (!silent) showModal('Ошибка', e && e.message ? e.message : 'Не удалось скачать пакет');
                return false;
            }finally{
                if (__packageRuntimeState[kind] && !__packageRuntimeState[kind].busy) {
                    setTimeout(() => { delete __packageRuntimeState[kind]; rerenderPackagePanels(); }, 900);
                }
            }
        }
        async function removePackage(kind){
            const meta = getPackageMeta(kind);
            if (!meta) return;
            try{
                const cacheName = 'vox-packages-v2';
                if ('caches' in window && typeof caches.open === 'function'){
                    const cache = await caches.open(cacheName);
                    for (const asset of meta.assets){ try{ await cache.delete(asset); }catch(e){} }
                }
                localStorage.removeItem(getPackageStorageKey(kind));
                if (kind === 'effects') localStorage.setItem('vox_gifts_3d_enabled', '0');
                rerenderPackagePanels();
                showModal('Пакеты', `Пакет «${meta.title}» удалён.`);
            }catch(e){
                showModal('Ошибка', 'Не удалось удалить пакет.');
            }
        }
        async function clearPackagesCache(){
            try{
                if ('caches' in window){ try{ await caches.delete('vox-packages-v2'); }catch(e){} }
                Object.keys(localStorage || {}).forEach(k => {
                    if (String(k).startsWith('vox_pkg_')) localStorage.removeItem(k);
                });
                localStorage.setItem('vox_gifts_3d_enabled', '0');
                rerenderPackagePanels();
                showModal('Пакеты', 'Все пакеты удалены.');
            }catch(e){
                showModal('Ошибка', 'Не удалось очистить кэш');
            }
        }
        function ensureSiteToastStack(){
            let stack = document.getElementById('site-toast-stack');
            if (!stack){
                stack = document.createElement('div');
                stack.id = 'site-toast-stack';
                stack.className = 'site-toast-stack';
                document.body.appendChild(stack);
            }
            return stack;
        }
        function showSiteNoticeToast(title, text){
            try{
                const stack = ensureSiteToastStack();
                const el = document.createElement('div');
                el.className = 'site-toast';
                el.id = 'site-toast-' + (++__siteToastSeed);
                el.innerHTML = `<div class="site-toast-title">${escapeHtml(title || 'Уведомление')}</div><div class="site-toast-text">${escapeHtml(text || '')}</div>`;
                stack.appendChild(el);
                requestAnimationFrame(() => el.classList.add('show'));
                setTimeout(() => {
                    el.classList.remove('show');
                    setTimeout(() => { try{ el.remove(); }catch(e){} }, 200);
                }, 4200);
            }catch(e){}
        }
        async function registerPushNotifications(){
            try{
                if (!('Notification' in window) || !('serviceWorker' in navigator)) return false;
                const reg = await navigator.serviceWorker.register('/sw.js');
                window.__voxSwReg = reg;
                return true;
            }catch(e){ return false; }
        }
        async function enablePushNotifications(){
            if (!hasPackageInstalled('notifications')){
                showModal('Уведомления', 'Сначала установите пакет уведомлений.');
                return;
            }
            try{
                const ok = await registerPushNotifications();
                if (!ok) throw new Error('service worker unavailable');
                const perm = await Notification.requestPermission();
                if (perm === 'granted') showModal('Уведомления', 'Браузерные push-уведомления включены.');
                else showModal('Уведомления', 'Браузер не разрешил уведомления.');
            }catch(e){
                showModal('Уведомления', 'Не удалось включить браузерные уведомления.');
            }
        }
        async function showNativeNotification(title, body){
            try{
                if (!('Notification' in window) || Notification.permission !== 'granted') return false;
                const reg = window.__voxSwReg || (('serviceWorker' in navigator) ? await navigator.serviceWorker.getRegistration('/sw.js') : null);
                const options = { body: String(body || ''), icon: '/default-avatar.png', badge: '/default-avatar.png', tag: 'vox-notification' };
                if (reg && reg.showNotification){ await reg.showNotification(String(title || 'Уведомление'), options); return true; }
                new Notification(String(title || 'Уведомление'), options);
                return true;
            }catch(e){ return false; }
        }
        function renderGiftVisual(gift, opts = {}){
            const emoji = escapeHtml(String((gift && gift.emoji) || opts.emoji || '🎁'));
            const cls = String(opts.className || '');
            if (isGift3dEnabled()) {
                const key = escapeHtml(String((gift && gift.key) || opts.key || ''));
                return `<div class="${cls} is-3d gift-key-${key}"><div class="gift-art-visual"><div class="gift-model-3d"><div class="gift-emoji">${emoji}</div></div></div></div>`;
            }
            const key2 = escapeHtml(String((gift && gift.key) || opts.key || ''));
            return `<div class="${cls} gift-key-${key2}"><div class="gift-art-visual"><div class="gift-emoji">${emoji}</div></div></div>`;
        }

        function getOwnedNftKeys(){
            const out = new Set();
            try{
                const giftsObj = (window.currentUser && currentUser && currentUser.gifts) ? currentUser.gifts : {};
                for (const [giftId, g] of Object.entries(giftsObj)) {
                    const meta = getGiftMetaByAny({ gift_id: giftId, ...(typeof g === 'object' ? g : {}), emoji: (typeof g === 'string' ? g : (g && g.emoji)) }) || null;
                    const key = (typeof g === 'object' && g && g.key) ? g.key : ((meta && meta.giftKey) ? meta.giftKey : '');
                    if (isNftGiftKey(key)) out.add(key);
                }
            }catch(e){}
            return Array.from(out);
        }

        function getEffectSettings(){
            const s = (currentUser && currentUser.effect_settings) ? currentUser.effect_settings : {};
            const powerSave = localStorage.getItem('vox_power_save') === '1';
            const lowSpec = localStorage.getItem('vox_low_spec') === '1';
            const base = {
                preset: s.preset || (lowSpec ? 'minimal' : 'full'),
                intensity: Math.max(0, Math.min(100, parseInt(s.intensity ?? 70, 10) || 70)),
                animation_speed: Math.max(30, Math.min(180, parseInt(s.animation_speed ?? 100, 10) || 100)),
                particles: !!Number(s.particles ?? 1),
            };
            if (powerSave) return { ...base, preset: 'minimal', intensity: Math.min(base.intensity, 28), animation_speed: Math.min(base.animation_speed, 72), particles: false };
            if (lowSpec) return { ...base, preset: 'minimal', intensity: Math.min(base.intensity, 38), animation_speed: Math.min(base.animation_speed, 88), particles: false };
            if (document.body && document.body.classList.contains('fx-scroll-optimizing')) return { ...base, intensity: Math.min(base.intensity, 34), animation_speed: Math.min(base.animation_speed, 82), particles: false };
            return base;
        }



        // Глобальная тема по активному эксклюзивному подарку (на всё приложение)
        const DEFAULT_PRIMARY_COLORS = {
            primary: '#2AABEE',
            dark: '#229ED9',
            light: '#55C7FF'
        };

        function clamp01(x){ return Math.max(0, Math.min(1, x)); }

        function hexToRgb(hex){
            const h = String(hex || '').replace('#','').trim();
            if (h.length === 3){
                const r = parseInt(h[0] + h[0], 16);
                const g = parseInt(h[1] + h[1], 16);
                const b = parseInt(h[2] + h[2], 16);
                return { r, g, b };
            }
            if (h.length === 6){
                const r = parseInt(h.slice(0,2), 16);
                const g = parseInt(h.slice(2,4), 16);
                const b = parseInt(h.slice(4,6), 16);
                return { r, g, b };
            }
            return { r: 99, g: 102, b: 241 };
        }

        function rgbToHex({r,g,b}){
            const to = (n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2,'0');
            return `#${to(r)}${to(g)}${to(b)}`;
        }

        function mixRgb(a, b, t){
            const u = 1 - t;
            return {
                r: Math.round(a.r * u + b.r * t),
                g: Math.round(a.g * u + b.g * t),
                b: Math.round(a.b * u + b.b * t),
            };
        }

        function lighten(hex, t){
            const rgb = hexToRgb(hex);
            return rgbToHex(mixRgb(rgb, {r:255,g:255,b:255}, clamp01(t)));
        }

        function darken(hex, t){
            const rgb = hexToRgb(hex);
            return rgbToHex(mixRgb(rgb, {r:0,g:0,b:0}, clamp01(t)));
        }

        function rgbaFromHex(hex, a){
            const {r,g,b} = hexToRgb(hex);
            return `rgba(${r},${g},${b},${a})`;
        }

        // Keep FX vars aligned with selected theme (when no exclusive effect is active)
        function syncFxVarsToTheme(){
            try{
                if (document.body && document.body.getAttribute('data-effect')) return;
            }catch(e){}
            const root = document.documentElement;
            const cs = getComputedStyle(root);
            let primary = (cs.getPropertyValue('--primary') || '').trim();
            if (!primary) primary = (DEFAULT_PRIMARY_COLORS && DEFAULT_PRIMARY_COLORS.primary) ? DEFAULT_PRIMARY_COLORS.primary : '#2AABEE';
            if (!primary.startsWith('#')) {
                // if theme returned e.g. "2AABEE" (rare)
                if (/^[0-9a-fA-F]{6}$/.test(primary)) primary = `#${primary}`;
            }
            // Fallback if parsing failed
            if (!primary || !primary.startsWith('#')) primary = (DEFAULT_PRIMARY_COLORS && DEFAULT_PRIMARY_COLORS.primary) ? DEFAULT_PRIMARY_COLORS.primary : '#2AABEE';

            root.style.setProperty('--fx-accent', primary);
            root.style.setProperty('--fx-glow', rgbaFromHex(primary, 0.35));
            root.style.setProperty('--fx-glow2', rgbaFromHex(primary, 0.18));
            root.style.setProperty('--fx-border', rgbaFromHex(primary, 0.55));
            root.style.setProperty('--fx-active-bg', rgbaFromHex(primary, 0.12));
            root.style.setProperty('--fx-tab-grad-1', rgbaFromHex(primary, 0.22));
            root.style.setProperty('--fx-tab-grad-2', rgbaFromHex(primary, 0.12));
            root.style.setProperty('--fx-overlay-1', rgbaFromHex(primary, 0.20));
            root.style.setProperty('--fx-overlay-2', rgbaFromHex(primary, 0.12));
            root.style.setProperty('--fx-overlay-opacity', '0');
        }

        function applyGlobalEffectTheme(effect){
            const root = document.documentElement;
            const palette = getEffectPalette(effect);
            const fxSettings = getEffectSettings();

            if (!palette){
                document.body.removeAttribute('data-effect');

                // reset primary accent (let theme drive it)
                root.style.removeProperty('--primary');
                root.style.removeProperty('--primary-dark');
                root.style.removeProperty('--primary-light');
                root.style.removeProperty('--primary-rgb');

                // reset fx vars to theme (so tabs/glow match current theme)
                try{ syncFxVarsToTheme(); }catch(e){}
                
                // reset ultra-theme vars
                root.style.removeProperty('--fx-app-bg');
                root.style.removeProperty('--fx-surface-a');
                root.style.removeProperty('--fx-surface-b');
                root.style.removeProperty('--fx-surface-strong');
                root.style.removeProperty('--fx-text-dim');
                root.style.removeProperty('--fx-text-muted');
                root.style.removeProperty('--dark-bg');
                root.style.removeProperty('--dark-card');
return;
            }

            document.body.setAttribute('data-effect', effect);

            const primary = palette.accent;
            root.style.setProperty('--primary', primary);
            root.style.setProperty('--primary-dark', darken(primary, 0.18));
            root.style.setProperty('--primary-light', lighten(primary, 0.14));

            
            const prgb = hexToRgb(primary);
            if (prgb) root.style.setProperty('--primary-rgb', `${prgb.r},${prgb.g},${prgb.b}`);
// fx vars used across the UI
            root.style.setProperty('--fx-accent', primary);
            root.style.setProperty('--fx-glow', palette.glow);
            root.style.setProperty('--fx-glow2', palette.glow2);
            root.style.setProperty('--fx-border', palette.border);
            root.style.setProperty('--fx-active-bg', rgbaFromHex(primary, 0.14));
            root.style.setProperty('--fx-tab-grad-1', rgbaFromHex(primary, 0.22));
            root.style.setProperty('--fx-tab-grad-2', rgbaFromHex(primary, 0.12));
            root.style.setProperty('--fx-overlay-1', rgbaFromHex(primary, Math.max(0.08, fxSettings.intensity / 420)));
            root.style.setProperty('--fx-overlay-2', rgbaFromHex(primary, Math.max(0.05, fxSettings.intensity / 520)));
            root.style.setProperty('--fx-overlay-opacity', String(Math.max(0.10, fxSettings.intensity / 100)));
            root.style.setProperty('--fx-speed-mult', String(Math.max(0.45, fxSettings.animation_speed / 100)));
            root.style.setProperty('--fx-particles-opacity', fxSettings.particles ? String(Math.max(0.08, fxSettings.intensity / 210)) : '0');
            root.style.setProperty('--fx-surface-motion', (fxSettings.preset === 'minimal') ? '0' : '1');
            // Ultra-theme: recolor whole app background + surfaces (so the UI looks completely different)
            const baseTop = darken(primary, 0.86);
            const baseBottom = darken(primary, 0.94);
            const glowA = rgbaFromHex(primary, 0.55);
            const glowB = rgbaFromHex(lighten(primary, 0.22), 0.38);

            root.style.setProperty(
                '--fx-app-bg',
                `radial-gradient(circle at 20% 8%, ${glowA}, transparent 58%),
                 radial-gradient(circle at 82% 92%, ${glowB}, transparent 62%),
                 linear-gradient(180deg, ${baseTop}, ${baseBottom})`
            );

            root.style.setProperty('--fx-surface-a', rgbaFromHex(primary, 0.18));
            root.style.setProperty('--fx-surface-b', 'rgba(15,23,42,0.78)');
            root.style.setProperty('--fx-surface-strong', rgbaFromHex(darken(primary, 0.82), 0.90));
            root.style.setProperty('--fx-text-dim', 'rgba(241,245,249,0.82)');
            root.style.setProperty('--fx-text-muted', 'rgba(226,232,240,0.62)');

            // Also shift base vars used by many screens (non-tailwind parts)
            root.style.setProperty('--dark-bg', baseBottom);
            root.style.setProperty('--dark-card', rgbaFromHex(darken(primary, 0.78), 0.60));
            try{ if (effect) preloadEffectsPackage(false); }catch(e){}

        }

        async function showUserProfileModal(userId) {
    const result = await apiRequest('get_user_profile', { user_id: userId });
    
    if (result.success) {
                hideCaptcha();
        const user = result.user;
        const modalContent = document.querySelector('#user-profile-modal .modal-content');
        if (modalContent) modalContent.classList.add('scrollable');
        
        
		// Apply profile modal visual effect (UI only; does not translate user content)
		modalContent.classList.remove('dragon-effect-bg','lolpol-effect-bg','phoenix-effect-bg');
		if (user.active_effect && getEffectPalette(user.active_effect)) {
		    modalContent.classList.add(`${user.active_effect}-effect-bg`);
		}

        document.getElementById('modal-profile-avatar').src = user.avatar_url || user.avatar;

        const bannerEl = document.getElementById('modal-profile-banner');
        if (bannerEl) {
            const fallback = user.avatar_url || user.avatar || '/default.png';
            const img = user.banner || fallback;

            if (user.banner) {
                bannerEl.classList.add('has-image');
                bannerEl.classList.remove('fallback-avatar');
            } else {
                bannerEl.classList.remove('has-image');
                bannerEl.classList.add('fallback-avatar');
            }
            bannerEl.style.setProperty('--banner-image', `url('${img}')`);
        }

        document.getElementById('modal-profile-name').innerHTML = `${escapeHtml(user.name || '')}${user.is_official ? verifiedBadgeSvg('lg') : ''}`;
        
        document.getElementById('modal-profile-username').textContent = `@${user.username || ''}`;
        const presenceEl = document.getElementById('modal-profile-presence');
        if (presenceEl) {
            const p = user.presence || {};
            const dot = p.is_online ? '<span class="user-presence-dot"></span>' : '';
            const custom = p.status_text ? `<span class="user-status-chip">${escapeHtml(p.status_text)}</span>` : '';
            presenceEl.innerHTML = `${dot}<span>${escapeHtml(p.status_label || (p.is_online ? 'в сети' : 'был(а) недавно'))}</span>${custom}`;
        }
        
        document.getElementById('modal-profile-bio').textContent = user.bio;

        const oldActionsBlock = document.getElementById('modal-profile-actions');
        if (oldActionsBlock) oldActionsBlock.remove();
        const actionsBlock = document.createElement('div');
        actionsBlock.id = 'modal-profile-actions';
        actionsBlock.className = 'info-block mt-4';
        const canReport = !!user.can_report;
        actionsBlock.innerHTML = canReport ? `<div class="flex"><button class="secondary-button w-full flex items-center justify-center gap-2" type="button" onclick="openReportUserModal('${user.id}')"><svg class="tg-svg" aria-hidden="true"><use href="#ico-flag"></use></svg><span>Пожаловаться</span></button></div>` : '';

        // Генерируем роли для модального окна
        const rolesHtml = (user.roles && user.roles.length > 0) 
            ? user.roles.map(role => `
                <span class="role-tag role-fx" style="--role-bg: ${role.color_bg}; --role-text: ${role.color_text}; background: var(--role-bg); color: var(--role-text); border: none; margin-right: 8px; margin-bottom: 8px; display: inline-flex;">
                    <span class="role-label">${role.name}</span>
                    <span class="role-sparkles" aria-hidden="true"></span>
                </span>
            `).join('')
            : '<p class="text-slate-500">Нет ролей</p>';

        // Вставляем роли ПЕРЕД подарками
        const modalMessage = document.querySelector('#user-profile-modal .modal-content');
        
        // Удаляем старый блок ролей, если есть
        const oldRolesBlock = document.getElementById('modal-profile-roles');
        if (oldRolesBlock) oldRolesBlock.remove();
        
        // Создаем новый блок ролей
        const rolesBlock = document.createElement('div');
        rolesBlock.id = 'modal-profile-roles';
        rolesBlock.className = 'info-block mt-4';
        rolesBlock.innerHTML = `
            <div class="block-title">РОЛИ</div>
            <div class="roles-grid">
                ${rolesHtml}
            </div>
        `;
        
        // Вставляем после био и перед подарками
        const bioElement = document.getElementById('modal-profile-bio');
        bioElement.insertAdjacentElement('afterend', actionsBlock);
        
        // Музыка профиля
        const oldMusicBlock = document.getElementById('modal-profile-music');
        if (oldMusicBlock) oldMusicBlock.remove();

        const musicBlock = document.createElement('div');
        musicBlock.id = 'modal-profile-music';
        musicBlock.className = 'info-block mt-4';
        const isSelfProfile = (currentUser && user && user.id && currentUser.id && String(user.id) === String(currentUser.id));
        // ВАЖНО: раньше тут был баг (ветка else ссылалась на musicTitleHtml до инициализации),
        // из-за чего профиль других пользователей не открывался.
        const musicTitleHtml = isSelfProfile
            ? `<div class="flex items-center justify-between"><div class="block-title" style="margin-bottom:0;">МУЗЫКА</div><button class="text-xl text-slate-300 hover:text-primary transition-colors" aria-label="Добавить музыку" onclick="openProfileMusicPicker(); document.getElementById('user-profile-modal').classList.add('hidden');">➕</button></div>`
            : `<div class="block-title" style="margin-bottom:0;">МУЗЫКА</div>`;

        if (user.profile_music && user.profile_music.url) {
            const pmName = escapeHtml(user.profile_music.original_name || 'Музыка');
            const pmExt = escapeHtml((user.profile_music.ext || 'audio').toUpperCase());
            const pmSize = formatBytes(user.profile_music.size || 0);
            const pmUrl = user.profile_music.url;
            musicBlock.innerHTML = `
                ${musicTitleHtml}
                <div class="p-2">
                    <div class="font-semibold truncate">${pmName}</div>
                    <div class="text-xs text-slate-400 mb-2">${pmSize} • ${pmExt}</div>
                    <button type="button" class="secondary-button w-full mt-2" data-url="${pmUrl}" data-title="${pmName}" onclick="playGlobalTrack(this.dataset.url, this.dataset.title)">▶️ Воспроизвести в плеере</button>
                    <button type="button" class="secondary-button w-full mt-2" data-url="${pmUrl}" data-title="${pmName}" onclick="openAddToPlaylistDialog(this.dataset.url, this.dataset.title)">➕ В плейлист</button>
                </div>
            `;
        } else {
            musicBlock.innerHTML = `
                ${musicTitleHtml}
                <p class="text-slate-500">Музыка не выбрана.</p>
            `;
        }
bioElement.insertAdjacentElement('afterend', rolesBlock);

        rolesBlock.insertAdjacentElement('afterend', musicBlock);

        const oldPlaylistBlock = document.getElementById('modal-profile-playlist');
        if (oldPlaylistBlock) oldPlaylistBlock.remove();
        const playlistBlock = document.createElement('div');
        playlistBlock.id = 'modal-profile-playlist';
        playlistBlock.className = 'info-block mt-4';
        if (user.profile_playlist && user.profile_playlist.id) {
            playlistBlock.innerHTML = `<div class="block-title">ПЛЕЙЛИСТ</div><div class="profile-playlist-card"><div class="spotify-mini"><div class="spotify-mini-cover">🎼</div><div class="spotify-mini-meta"><div class="spotify-mini-title">${escapeHtml(user.profile_playlist.name || 'Плейлист')}</div><div class="spotify-mini-sub">${Number(user.profile_playlist.tracks_count||0)} треков • ${escapeHtml(user.profile_playlist.description || 'Открытый плейлист')}</div></div></div><button type="button" class="secondary-button w-full mt-3" onclick="openPublicPlaylist('${escapeHtml(user.profile_playlist.id)}')">▶️ Открыть плейлист</button></div>`;
        } else {
            playlistBlock.innerHTML = `<div class="block-title">ПЛЕЙЛИСТ</div><p class="text-slate-500">Плейлист не выбран.</p>`;
        }
        musicBlock.insertAdjacentElement('afterend', playlistBlock);

        // Подарки
        const giftsContainer = document.getElementById('modal-profile-gifts');
	        try {
	            if (user.gifts && Object.keys(user.gifts).length > 0) {
	                const groups = {};
	                Object.entries(user.gifts).forEach(([gid, g]) => {
	                    const emoji = (typeof g === 'string') ? g : (g && g.emoji ? g.emoji : '🎁');
	                    const key = (typeof g === 'object' && g) ? (g.key || '') : '';
	                    let storeKey = key;
	                    if (!storeKey) {
	                        storeKey = Object.keys(GIFTS_STORE).find(k => GIFTS_STORE[k] && GIFTS_STORE[k].emoji === emoji) || '';
	                    }
	                    const title = (storeKey && GIFTS_STORE[storeKey]) ? GIFTS_STORE[storeKey].name : (typeof g === 'object' && g && g.name ? g.name : 'Подарок');
	                    const groupKey = storeKey || emoji;
	                    if (!groups[groupKey]) groups[groupKey] = { emoji, title, count: 0 };
	                    groups[groupKey].count++;
	                });
	                const giftsHtml = Object.values(groups).map(gr => `
	                    <div class="flex items-center justify-between py-2">
	                        <div class="flex items-center gap-2 min-w-0">
	                            <span class="text-2xl">${escapeHtml(gr.emoji)}</span>
	                            <span class="text-sm font-semibold truncate">${escapeHtml(gr.title)}</span>
	                        </div>
	                        <span class="text-sm text-slate-300 font-semibold">x${gr.count}</span>
	                    </div>
	                `).join('');
	                giftsContainer.innerHTML = giftsHtml;
	            } else {
	                giftsContainer.innerHTML = '<p class="text-slate-500">Подарков нет.</p>';
	            }
	        } catch (e) {
	            console.error('profile gifts render failed', e);
	            giftsContainer.innerHTML = '<p class="text-slate-500">Подарков нет.</p>';
	        }
        // Кнопка "Написать" (ЛС)
        const existingDmBtn = modalContent.querySelector('.dm-button');
        if (existingDmBtn) existingDmBtn.remove();

        if (user.id && currentUser && user.id !== currentUser.id && user.id !== 'security_bot') {
            const dmButton = document.createElement('button');
            dmButton.className = 'primary-button mt-4 w-full dm-button';
            dmButton.innerHTML = `<span class="flex items-center justify-center gap-2"><svg class="tg-svg" style="width:18px;height:18px"><use href="#ico-mail"></use></svg><span>${t('Написать')}</span></span>`;
            dmButton.onclick = () => startDirectMessageFromProfile(user);
            modalContent.appendChild(dmButton);
        }



        // Кнопка блокировки для модераторов
        const existingBlockBtn = modalContent.querySelector('.block-button');
        if (existingBlockBtn) existingBlockBtn.remove();

        if (currentUser.is_moderator && user.id !== currentUser.id) {
            const blockButton = document.createElement('button');
            blockButton.className = 'primary-button bg-red-600 hover:bg-red-700 mt-4 w-full block-button';
            blockButton.textContent = '🚫 Заблокировать пользователя';
            blockButton.onclick = () => {
                document.getElementById('user-profile-modal').classList.add('hidden');
                blockUser(user.id, user.name);
            };
            modalContent.appendChild(blockButton);
        }

        document.getElementById('user-profile-modal').classList.remove('hidden');
    } else {
        showModal('Ошибка', result.error || 'Не удалось загрузить профиль.');
    }

        async function startDirectMessageFromProfile(user) {
            try {
                const targetId = user?.id;
                if (!targetId || !currentUser || targetId === currentUser.id) return;

                const result = await apiRequest('create_private_chat', { target_user_id: targetId });
                if (!result.success) {
                    showModal('Ошибка', result.error || 'Не удалось создать чат.');
                    return;
                }
                hideCaptcha();

                // Обновляем список чатов и открываем ЛС
                await fetchChats();
                const chatId = result.chat_id;

                const interlocutorAvatar = user.avatar_url || user.avatar || '';
                switchScreen('chat_view', { chatId: String(chatId), chatName: '', chatType: 'private', interlocutorId: String(targetId), interlocutorAvatar: interlocutorAvatar, isBotChat: false });

                // Закрываем профиль
                document.getElementById('user-profile-modal').classList.add('hidden');
            } catch (e) {
                console.error(e);
                showModal('Ошибка', 'Не удалось открыть личные сообщения.');
            }
        }

}
        
        function renderEditProfileView() {
            const html = `
                <div id="edit_profile_view" class="flex flex-col h-full p-6">
                    <div class="flex items-center p-3 bg-slate-900 shadow-md flex-shrink-0 mb-4">
                        <button onclick="switchScreen('profile')" class="text-primary text-xl mr-3">←</button>
                        <h2 class="text-2xl font-bold">Изменить профиль</h2>
                    </div>
                    
                    <div class="w-full max-w-sm space-y-4 mx-auto text-center flex-grow overflow-y-auto">
                        <p class="text-slate-400 text-sm mb-4">Ваш логин: <strong>@${currentUser.username}</strong></p>
                    
                        <img id="avatar-preview" src="${currentUser.avatar}" alt="Аватар" class="avatar-preview mx-auto mb-4">

                        <input type="file" id="avatar-upload" accept="image/*" class="hidden" onchange="previewAvatar(this.files[0])">
                        <label for="avatar-upload" class="secondary-button cursor-pointer inline-block">
                            Выбрать новый аватар
                        </label>

                        <div class="mt-4 p-4 rounded-xl border border-slate-700 bg-slate-900/40 text-left">
                            <div class="font-bold mb-2">🖼️ Баннер профиля</div>
                            <div id="banner-preview" class="profile-banner mb-3 ${currentUser.banner ? 'has-image' : 'fallback-avatar'}" style="--banner-image: url('${String(currentUser.banner || currentUser.avatar || '/default.png').replace(/'/g, '%27').replace(/\)/g, '%29')}')"></div>
                            <input type="file" id="banner-upload" accept="image/*" class="hidden" onchange="previewBanner(this.files[0])">
                            <div class="flex items-center gap-2 flex-wrap">
                                <label for="banner-upload" class="secondary-button cursor-pointer inline-block">Выбрать баннер</label>
                                <button id="banner-clear-btn" class="primary-button bg-red-600 hover:bg-red-700 text-xs px-3 py-2 ${currentUser.banner ? '' : 'hidden'}" type="button" onclick="clearProfileBanner()">Удалить</button>
                            </div>
                            <div id="banner-upload-status" class="text-xs text-slate-300 mt-2 hidden"></div>
                            <div id="banner-upload-progress" class="banner-upload-progress mt-2 hidden"><div id="banner-upload-progress-bar"></div></div>
                            <div class="text-xs text-slate-500 mt-2">Баннер виден всем пользователям (фон за аватаркой).</div>
                        </div>

                        <input type="text" id="display-name" placeholder="Отображаемое имя (как вас будут видеть)" 
                               value="${escapeHtml(currentUser.name || '')}"
                               maxlength="30"
                               class="input-field">
                        
                        <textarea id="profile-bio" placeholder="Описание профиля (о себе)" 
                                 maxlength="200"
                                 class="input-field h-24 resize-none">${escapeHtml(currentUser.bio || '')}</textarea>
                        <p class="text-xs text-slate-500 text-left">${String(currentUser.bio || '').length}/200 символов</p>
                        <input type="text" id="profile-status-text" placeholder="Статус, как в Telegram" value="${escapeHtml(currentUser.status_text || '')}" maxlength="120" class="input-field">
                        <label class="block text-left text-sm text-slate-300">Кто видит время последнего входа
                            <select id="profile-last-seen-privacy" class="input-field mt-2">
                                <option value="everyone" ${(currentUser.privacy && currentUser.privacy.last_seen === 'everyone') ? 'selected' : ''}>Все</option>
                                <option value="friends" ${(currentUser.privacy && currentUser.privacy.last_seen === 'friends') ? 'selected' : ''}>Только друзья</option>
                                <option value="nobody" ${(currentUser.privacy && currentUser.privacy.last_seen === 'nobody') ? 'selected' : ''}>Никто</option>
                            </select>
                        </label>
                        
                        
                        <div class="mt-4 p-4 rounded-xl border border-slate-700 bg-slate-900/40 text-left">
                            <div class="font-bold mb-2">🎵 Музыка профиля (до 5 МБ)</div>
                            <input type="file" id="profile-music-upload" accept=".mp3,.ogg,.wav,.m4a,.aac" class="hidden" onchange="previewProfileMusic(this.files[0])">
                            <label for="profile-music-upload" class="secondary-button cursor-pointer inline-block mb-2">
                                Выбрать музыку
                            </label>
                            <div id="profile-music-preview" class="text-sm text-slate-300">
                                ${currentUser.profile_music && currentUser.profile_music.url ? `
                                    <div class="flex flex-col gap-2">
                                        <div class="flex items-center justify-between gap-2">
                                            <div class="min-w-0">
                                                <div class="font-semibold truncate">${escapeHtml(currentUser.profile_music.original_name || 'Музыка')}</div>
                                                <div class="text-xs text-slate-400">${formatBytes(currentUser.profile_music.size || 0)} • ${(currentUser.profile_music.ext || 'audio').toUpperCase()}</div>
                                            </div>
                                            <button class="primary-button bg-red-600 hover:bg-red-700 text-xs px-3 py-2" type="button" onclick="clearProfileMusic()">Удалить</button>
                                        </div>
                                        <button type="button" class="secondary-button w-full mt-2" data-url="${currentUser.profile_music.url}" data-title="${escapeHtml(currentUser.profile_music.original_name || 'Музыка')}" onclick="playGlobalTrack(this.dataset.url, this.dataset.title)">▶️ Воспроизвести в плеере</button>
                                        <button type="button" class="secondary-button w-full mt-2" data-url="${currentUser.profile_music.url}" data-title="${escapeHtml(currentUser.profile_music.original_name || 'Музыка')}" onclick="openAddToPlaylistDialog(this.dataset.url, this.dataset.title)">➕ В плейлист</button>
                                    </div>
                                ` : `<span class="text-slate-400">Музыка не выбрана</span>`}
                            </div>
                            <div class="text-xs text-slate-500 mt-2">Файл будет виден в вашем профиле и в профилях для других.</div>
                        </div>

<p id="edit-status" class="text-center text-sm text-red-400 h-5"></p>

                        <button id="update-button" class="primary-button w-full mt-6" onclick="updateProfile()">
                            Сохранить изменения
                        </button>
                    </div>
                </div>
            `;
            document.getElementById('screen-container').innerHTML = `<div id="edit_profile_screen_content" class="screen-content">${html}</div>`;
        }

        async function updateProfile() {
            const name = document.getElementById('display-name').value.trim();
            const bio = document.getElementById('profile-bio').value.trim();
            const avatarFile = document.getElementById('avatar-upload').files[0];
            const bannerFile = document.getElementById('banner-upload')?.files?.[0];
            const statusValue = (document.getElementById('profile-status-text')?.value || '').trim();
            const lastSeenPrivacy = (document.getElementById('profile-last-seen-privacy')?.value || (currentUser.privacy && currentUser.privacy.last_seen) || 'everyone');
            const button = document.getElementById('update-button');
            const statusText = document.getElementById('edit-status');

            const bannerPrev = document.getElementById('banner-preview');
            const bannerSt = document.getElementById('banner-upload-status');
            const bannerPr = document.getElementById('banner-upload-progress');
            const bannerBar = document.getElementById('banner-upload-progress-bar');

            if (name.length < 1) {
                statusText.textContent = 'Отображаемое имя не может быть пустым.';
                return;
            }

            button.disabled = true;
            button.innerHTML = '<span class="loading-circle bg-white-accent"></span> Сохранение...';
            statusText.textContent = '';

            const formData = new FormData();
            formData.append('action', 'update_profile');
            formData.append('name', name);
            formData.append('bio', bio);
            formData.append('status_text', statusValue);
            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }
            if (bannerFile) {
                formData.append('banner', bannerFile);
            }

            // Музыка профиля (если выбрана)
            const musicFile = document.getElementById('profile-music-upload')?.files?.[0];
            if (musicFile) {
                formData.append('profile_music', musicFile);
            }

            let result;
            if (bannerFile) {
                result = await apiRequestWithProgress(formData, (loaded, total) => {
                    if (!bannerSt && !bannerBar) return;
                    if (total) {
                        const pct = Math.max(0, Math.min(100, Math.round((loaded / total) * 100)));
                        if (bannerBar) bannerBar.style.width = pct + '%';
                        if (bannerSt) bannerSt.textContent = `Загрузка баннера… ${pct}%`;
                    } else {
                        if (bannerSt) bannerSt.textContent = 'Загрузка баннера…';
                    }
                });
            } else {
                result = await apiRequest('update_profile', formData, true);
            }

            if (result.success) {
                hideCaptcha();
                currentUser.name = name;
                currentUser.bio = bio;
                currentUser.status_text = result.status_text || statusValue;
                if (result.new_avatar) {
                     currentUser.avatar = result.new_avatar;
                }

                if (typeof result.profile_music !== 'undefined') {
                     currentUser.profile_music = result.profile_music;
                }
                if (typeof result.profile_playlist !== 'undefined') {
                     currentUser.profile_playlist = result.profile_playlist;
                }
                if (typeof result.banner !== 'undefined') {
                     currentUser.banner = result.banner;
                }

                const privacyRes = await apiRequest('set_privacy_settings', { messages_from: (currentUser.privacy && currentUser.privacy.messages_from) || 'everyone', gifts_from: (currentUser.privacy && currentUser.privacy.gifts_from) || 'everyone', last_seen: lastSeenPrivacy }, false, { silent:true });
                if (privacyRes && privacyRes.success) currentUser.privacy = privacyRes.privacy || currentUser.privacy;
                showModal('Успех!', `Профиль <strong>${name}</strong> обновлен.`, false, () => {
                    fetchChats().then(() => switchScreen('profile')); 
                });
            } else {
                showModal('Ошибка', result.error || 'Не удалось обновить профиль.');
                if (bannerPrev) bannerPrev.classList.remove('is-uploading');
                if (bannerPr) bannerPr.classList.add('hidden');
                if (bannerBar) bannerBar.style.width = '0%';
                // keep bannerSt visible with error text if banner selected
                if (bannerFile && bannerSt) bannerSt.textContent = 'Не удалось загрузить баннер. Попробуйте ещё раз.';
                button.innerHTML = 'Сохранить изменения';
                button.disabled = false;
            }
        }


        function getProfilePlaylistHtml(user, isSelf){
            const pl = user && user.profile_playlist ? user.profile_playlist : null;
            const addBtn = isSelf ? `<button class="text-xl text-slate-300 hover:text-primary transition-colors" aria-label="Выбрать плейлист" onclick="openProfilePlaylistPicker()">🎼</button>` : '';
            if (!pl) return `<div class="info-block tg-tinted-surface mb-6"><div class="flex items-center justify-between"><div class="block-title" style="margin-bottom:0;">ПЛЕЙЛИСТ</div>${addBtn}</div><span class="text-slate-400 text-sm">Плейлист не выбран</span></div>`;
            const tracksCount = Number(pl.tracks_count || 0);
            const title = escapeHtml(pl.name || 'Плейлист');
            const descr = escapeHtml(pl.description || 'Открытый плейлист в профиле');
            const btns = `<div class="mt-3 grid grid-cols-1 gap-2">` + `<button type="button" class="secondary-button w-full" onclick="openPublicPlaylist('${escapeHtml(pl.id)}')">▶️ Открыть плейлист</button>` + (isSelf ? `<button type="button" class="secondary-button w-full" onclick="clearProfilePlaylist()">🗑️ Убрать из профиля</button>` : '') + `</div>`;
            return `<div class="info-block tg-tinted-surface mb-6"><div class="flex items-center justify-between"><div class="block-title" style="margin-bottom:0;">ПЛЕЙЛИСТ</div>${addBtn}</div><div class="profile-playlist-card mt-2"><div class="spotify-mini"><div class="spotify-mini-cover">🎼</div><div class="spotify-mini-meta"><div class="spotify-mini-title">${title}</div><div class="spotify-mini-sub">${tracksCount} треков • ${descr}</div></div></div>${btns}</div></div>`;
        }
        async function openProfilePlaylistPicker(){ try{ await fetchMyPlaylists(true); }catch(e){} const items = Array.isArray(__myPlaylistsCache) ? __myPlaylistsCache.filter(p => p && p.id) : []; if (!items.length) { showModal('Плейлист', 'Сначала создайте плейлист в плеере.'); return; } showModal('Плейлист в профиле', `<div class="space-y-2 max-h-80 overflow-y-auto">${items.map(pl => `<button class="sheet-btn" type="button" onclick="setProfilePlaylist('${escapeHtml(pl.id)}')"><span class="sheet-ico">🎼</span>${escapeHtml(pl.name || 'Плейлист')}<span class="text-xs text-slate-400 ml-2">${Number(pl.tracks_count||0)} треков${pl.is_public ? '' : ' • скрыт'}</span></button>`).join('')}</div>`, false); }
        async function setProfilePlaylist(playlistId){ const res = await apiRequest('update_profile', { name: currentUser.name || '', bio: currentUser.bio || '', profile_playlist_id: playlistId }); if (res && res.success) { if (typeof res.profile_playlist !== 'undefined') currentUser.profile_playlist = res.profile_playlist; document.getElementById('custom-modal')?.classList.add('hidden'); renderProfileView(); } else showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось сохранить плейлист'); }
        async function clearProfilePlaylist(){ const res = await apiRequest('update_profile', { name: currentUser.name || '', bio: currentUser.bio || '', profile_playlist_id: '' }); if (res && res.success) { currentUser.profile_playlist = null; renderProfileView(); } else showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось убрать плейлист'); }
        async function openPublicPlaylist(playlistId){ await openPlaylistSheet(playlistId); }

        function renderProfileView() {
    const palette = getEffectPalette(currentUser.active_effect);
    const profileRootClass = palette ? 'profile-exclusive' : '';
    const profileRootStyle = palette ? `style="--exclusive-accent:${palette.accent}; --exclusive-accent-rgb:${palette.accentRgb}; --exclusive-glow:${palette.glow}; --exclusive-glow2:${palette.glow2}; --exclusive-border:${palette.border};"` : '';

    const effectClass = (currentUser.active_effect && getEffectPalette(currentUser.active_effect)) ? `${currentUser.active_effect}-effect-bg` : '';

    // Генерируем HTML для ролей
    const rolesHtml = (currentUser.roles && currentUser.roles.length > 0) 
        ? currentUser.roles.map(role => `
            <span class="role-tag role-fx" style="--role-bg: ${role.color_bg}; --role-text: ${role.color_text}; background: var(--role-bg); color: var(--role-text); border: none;">
                <span class="role-label">${role.name}</span>
                <span class="role-sparkles" aria-hidden="true"></span>
            </span>
        `).join('')
        : '<span class="text-slate-400 text-sm">Нет ролей</span>';

    const profileContent = `
        <div id="profile_view" class="p-4 flex flex-col h-full overflow-y-auto ${profileRootClass} scrollable" ${profileRootStyle}>
            <div class="profile-header-strip card tg-tinted-surface flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold">Мой профиль</h2>
                <div class="flex gap-2">
                    <button class="text-xl text-slate-400 hover:text-primary transition-colors" aria-label="Изменить профиль" onclick="switchScreen('edit_profile')">✏️</button>
                </div>
            </div>
        
            
            <div class="card tg-tinted-surface mb-6 ${effectClass} profile-card ${profileRootClass}">
                <div class="profile-banner ${currentUser.banner ? 'has-image' : 'fallback-avatar'}" style="--banner-image: url('${currentUser.banner || currentUser.avatar || '/default.png'}')"></div>
                <div class="flex items-center mt-3">
                    <img src="${currentUser.avatar || '/default.png'}" alt="Аватар" class="avatar-preview profile-avatar-over mr-4 relative z-10">
                    <div class="flex-1 relative z-10 min-w-0">
                        <h3 class="text-xl font-bold truncate">${escapeHtml(currentUser.name)}</h3>
                        <p class="text-slate-400 text-sm flex items-center gap-1 flex-wrap"><span>@${escapeHtml(currentUser.username)}</span>${currentUser.is_official ? verifiedBadgeSvg() : ''}${currentUser.is_moderator ? ' <span class="text-red-500 font-semibold">(Модератор)</span>' : ''}</p>
                        <p class="text-slate-500 text-sm mt-2">${escapeHtml(currentUser.bio || 'Описание профиля не указано')}</p>
                    </div>
                    <button onclick="switchScreen('edit_profile')" class="text-slate-400 hover:text-primary transition-colors ml-2 text-xl relative z-10">✏️</button>
                </div>
            </div>


            <!-- НОВЫЙ БЛОК: РОЛИ (в том же стиле, что и баланс) -->
            <div class="info-block tg-tinted-surface ${effectClass} mb-4">
                <div class="block-title">РОЛИ</div>
                <div class="roles-grid">
                    ${rolesHtml}
                </div>
            </div>
            

            <div class="info-block tg-tinted-surface ${effectClass} mb-6">
                <div class="flex items-center justify-between"><div class="block-title" style="margin-bottom:0;">МУЗЫКА ПРОФИЛЯ</div><button class="text-xl text-slate-300 hover:text-primary transition-colors" aria-label="Добавить музыку" onclick="openProfileMusicPicker()">➕</button></div>
                ${currentUser.profile_music && currentUser.profile_music.url ? `
                    <div class="p-2">
                        <div class="font-semibold truncate">${escapeHtml(currentUser.profile_music.original_name || 'Музыка')}</div>
                        <div class="text-xs text-slate-400 mb-2">${formatBytes(currentUser.profile_music.size || 0)} • ${(currentUser.profile_music.ext || 'audio').toUpperCase()}</div>
                        <button type="button" class="secondary-button w-full mt-2" data-url="${currentUser.profile_music.url}" data-title="${escapeHtml(currentUser.profile_music.original_name || 'Музыка')}" onclick="playGlobalTrack(this.dataset.url, this.dataset.title)">▶️ Воспроизвести в плеере</button>
                        <button type="button" class="secondary-button w-full mt-2" data-url="${currentUser.profile_music.url}" data-title="${escapeHtml(currentUser.profile_music.original_name || 'Музыка')}" onclick="openAddToPlaylistDialog(this.dataset.url, this.dataset.title)">➕ В плейлист</button>
                    </div>
                ` : `<span class="text-slate-400 text-sm">Музыка не выбрана</span>`}
            </div>

            ${getProfilePlaylistHtml(currentUser, true)}

            <div class="info-block tg-tinted-surface ${effectClass} mb-6">
                <div class="block-title">БАЛАНС</div>
                <div class="balance-row" style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
                    <div class="flex items-center gap-2">
                        <span class="star-icon">⚡</span>
                        <span class="balance-amount">${currentUser.stars ?? 0}</span>
                    </div>
                    <button class="secondary-button" style="padding:10px 14px; white-space:nowrap;" onclick="openStarsTransferGlobalModal()">⚡ ${t('Перевод бустов')}</button>
                </div>
            </div>
            
            <div class="card mb-6 tg-tinted-surface security-card-exclusive ${effectClass}">
                <h3 class="text-xl font-bold mb-3 border-b border-slate-700 pb-2">Безопасность</h3>
                <div class="space-y-3">
                    <button class="primary-button w-full flex items-center justify-center gap-2" onclick="showFileManager()">📂 Файловый менеджер</button>
                    <button class="primary-button w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2" onclick="showActiveSessions()">🔐 Активные сессии</button>
                    <button class="primary-button w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2" onclick="switchScreen('chat_view', { chatId: 'security_bot_${currentUser.id}', chatName: 'Super Chat', chatType: 'bot', isBotChat: true })">🤖 Чат с ботом Super Chat</button>
                    ${currentUser.is_moderator ? `
            <div class="card mb-6 tg-tinted-surface">
                <h3 class="text-xl font-bold mb-3">Модерация</h3>
                <div class="space-y-3">
                    <button class="primary-button w-full bg-red-600 hover:bg-red-700" onclick="showBlockedUsers()">
                        🚫 Управление блокировками
                    </button>
                    <button class="primary-button w-full bg-orange-600 hover:bg-orange-700" onclick="adminConfirmClearChat()">
                        🧹 Очистить общий чат
                    </button>
                    <button class="primary-button w-full bg-purple-600 hover:bg-purple-700" onclick="switchScreen('admin_panel')">
                        🛡️ Открыть админ-панель
                    </button>
                </div>
            </div>
        ` : ''}
                </div>
            </div>
            
            <h3 class="text-xl font-bold mb-3 border-t border-slate-700 pt-4">Инвентарь подарков</h3>
            <div class="mb-4">
                <input type="text" 
                       id="gift-search-input" 
                       placeholder="🔎 Поиск подарков по названию..." 
                       oninput="filterGifts()" 
                       class="input-field w-full">
            </div>
            <div id="gifts-inventory" class="space-y-3">
                ${renderGiftsInventory(currentUser.gifts)}
            </div>

                <div class="grid grid-cols-1 gap-3 mt-6">
                    <button class="primary-button w-full bg-red-600 hover:bg-red-700" onclick="logout()">Выход</button>
                </div>
        </div>
    `;
    document.getElementById('screen-container').innerHTML = `<div id="profile_screen_content" class="screen-content">${profileContent}</div>`;
}

        function renderSettingsView() {
            const currentTheme = localStorage.getItem('vox_theme') || 'default';
            const uiLang = getUiLang();
            const uiRadius = Number(localStorage.getItem('vox_ui_radius')) || 22;
            const uiBlur = Number(localStorage.getItem('vox_ui_blur')) || 34;
            const uiGlass = Number(localStorage.getItem('vox_ui_glass')) || 7;
            const powerSave = localStorage.getItem('vox_power_save') === '1';
            const lowSpec = localStorage.getItem('vox_low_spec') === '1';
            const privacy = (window.currentUser && currentUser && currentUser.privacy) ? currentUser.privacy : {};
            const privacyMessages = (privacy && privacy.messages_from) ? privacy.messages_from : 'everyone';
            const privacyGifts = (privacy && privacy.gifts_from) ? privacy.gifts_from : 'everyone';
            // прозрачность стекла в %
            
            const settingsContent = `
                <div id="settings_view" class="p-4 flex flex-col h-full overflow-y-auto">
                    <div class="flex items-center p-3 bg-slate-900 shadow-md flex-shrink-0 mb-4">
                        <button onclick="switchScreen('profile')" class="text-primary text-xl mr-3">←</button>
                        <h2 class="text-2xl font-bold">${t('Настройки')}</h2>
                    </div>


                    <div class="card mb-6 tg-tinted-surface">
                        <h3 class="text-xl font-bold mb-2 border-b border-slate-700 pb-2">${t('Язык')}</h3>
                        <div class="settings-item flex items-center justify-between gap-3">
                            <div class="min-w-0">
                                <h4 class="font-bold">${t('Язык')}</h4>
                                <p class="text-sm text-slate-400">RU / EN</p>
                            </div>
                            <select class="input-field" style="max-width:180px" onchange="setUiLang(this.value)">
                                <option value="ru" selected>Русский</option>
                            </select>
                        </div>
                        <div class="text-xs text-slate-500 mt-2">Переключение применится сразу (некоторые экраны могут оставаться на русском).</div>
                    </div>

                    <div class="card mb-6 tg-tinted-surface">
                        <h3 class="text-xl font-bold mb-2 border-b border-slate-700 pb-2">Социальные</h3>
                        <div class="settings-item flex items-center justify-between">
                            <div>
                                <h4 class="font-bold">Друзья</h4>
                                <p class="text-sm text-slate-400">Запросы, управление и список друзей</p>
                            </div>
                            <button class="primary-button" onclick="switchScreen('friends')">Открыть</button>
                        </div>
                    </div>

                    <div class="card mb-6 tg-tinted-surface">
    <h3 class="text-xl font-bold mb-2 border-b border-slate-700 pb-2">Сессионный ключ</h3>
    <div class="settings-item flex items-center justify-between gap-3">
        <div class="min-w-0">
            <h4 class="font-bold">Войти на новом устройстве</h4>
            <p class="text-sm text-slate-400">Сгенерируйте одноразовый ключ на этом устройстве и введите его на новом устройстве для входа.</p>
        </div>
        <button class="primary-button" onclick="generateSessionKey()">Сгенерировать</button>
    </div>
    
<div class="mt-3 grid gap-3">
  <div class="p-4 rounded-2xl border border-slate-700 bg-slate-900/40">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <div class="text-base font-bold">Основной ключ</div>
        <div class="text-xs text-slate-400 mt-1">Для восстановления доступа. Бессрочный, можно использовать сколько угодно раз. Храните в надёжном месте.</div>
      </div>
      <span class="text-xs px-2 py-1 rounded-full border border-slate-700 text-slate-300">MASTER</span>
    </div>

    <div class="mt-3 flex items-center gap-2">
      <code id="primaryKeyValue" class="text-sm sm:text-base font-mono break-all select-all">—</code>
      <button type="button" class="secondary-button" onclick="copyPrimaryKey()" style="padding:8px 12px; white-space:nowrap;">Копировать</button>
    </div>
    <div id="primaryKeyHint" class="text-xs text-slate-500 mt-2">Нажмите «Сгенерировать», чтобы создать новый основной ключ (старый станет недействительным).</div>

    <div class="mt-3 flex flex-wrap gap-2">
      <button type="button" class="primary-button" onclick="regeneratePrimaryKey()">Сгенерировать</button>
    </div>
  </div>

  <div class="p-4 rounded-2xl border border-slate-700 bg-slate-900/40">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <div class="text-base font-bold">Одноразовый ключ</div>
        <div class="text-xs text-slate-400 mt-1">Для входа на новое устройство. Действует 10 минут и сработает только один раз.</div>
      </div>
      <span class="text-xs px-2 py-1 rounded-full border border-slate-700 text-slate-300">1× / 10m</span>
    </div>

    <div class="mt-3 flex items-center gap-2">
      <code id="sessionKeyValue" class="text-sm sm:text-base font-mono break-all select-all">—</code>
      <button type="button" class="secondary-button" onclick="copySessionKey()" style="padding:8px 12px; white-space:nowrap;">Копировать</button>
    </div>
    <div id="sessionKeyHint" class="text-xs text-slate-500 mt-2">Нажмите «Сгенерировать», затем введите ключ на новом устройстве в «Войти по ключу».</div>

    <div class="mt-3 flex flex-wrap gap-2">
      <button type="button" class="primary-button" onclick="generateSessionKey()">Сгенерировать</button>
    </div>
  </div>
</div>
                    </div>

                    <div class="card mb-6 tg-tinted-surface">
                        <h3 class="text-xl font-bold mb-2 border-b border-slate-700 pb-2">Конфиденциальность</h3>
                        <div class="settings-item flex items-center justify-between gap-3">
                            <div class="min-w-0">
                                <h4 class="font-bold">Кто может писать вам</h4>
                                <p class="text-sm text-slate-400">Ограничения действуют в личных чатах</p>
                            </div>
                            <div class="privacy-segment" data-kind="messages" role="radiogroup" aria-label="Кто может писать">
                                <button type="button" class="seg-btn ${privacyMessages === 'everyone' ? 'is-active' : ''}" data-value="everyone" onclick="setPrivacyChoice('messages','everyone')">Все</button>
                                <button type="button" class="seg-btn ${privacyMessages === 'friends' ? 'is-active' : ''}" data-value="friends" onclick="setPrivacyChoice('messages','friends')">Друзья</button>
                                <button type="button" class="seg-btn ${privacyMessages === 'nobody' ? 'is-active' : ''}" data-value="nobody" onclick="setPrivacyChoice('messages','nobody')">Никто</button>
                            </div>
                            <input type="hidden" id="privacy-messages" value="${privacyMessages}">
                        </div>
                        <div class="settings-item flex items-center justify-between gap-3">
                            <div class="min-w-0">
                                <h4 class="font-bold">Кто может дарить подарки</h4>
                                <p class="text-sm text-slate-400">Ограничения действуют для отправки 🎁</p>
                            </div>
                            <div class="privacy-segment" data-kind="gifts" role="radiogroup" aria-label="Кто может дарить">
                                <button type="button" class="seg-btn ${privacyGifts === 'everyone' ? 'is-active' : ''}" data-value="everyone" onclick="setPrivacyChoice('gifts','everyone')">Все</button>
                                <button type="button" class="seg-btn ${privacyGifts === 'friends' ? 'is-active' : ''}" data-value="friends" onclick="setPrivacyChoice('gifts','friends')">Друзья</button>
                                <button type="button" class="seg-btn ${privacyGifts === 'nobody' ? 'is-active' : ''}" data-value="nobody" onclick="setPrivacyChoice('gifts','nobody')">Никто</button>
                            </div>
                            <input type="hidden" id="privacy-gifts" value="${privacyGifts}">
                        </div>
                        <div id="privacy-save-status" class="text-xs text-slate-400 mt-2"></div>
                    </div>
                    
                    <!-- Настройки темы -->
                    <div class="card mb-6 tg-tinted-surface">
                        <h3 class="text-xl font-bold mb-2 border-b border-slate-700 pb-2">Тема оформления</h3>
                        <p class="text-sm text-slate-400 mb-4">Темы меняют весь интерфейс: чаты, панели и настройки.</p>
                        <div class="space-y-3">

                            <div class="settings-item theme-item">
                                <div class="flex items-center gap-3">
                                    <div class="theme-swatch" style="--sw-a:#2AABEE;--sw-b:#55C7FF;--sw-rgb:42,171,238"></div>
                                    <div>
                                        <h4 class="font-bold">По умолчанию</h4>
                                        <p class="text-sm text-slate-400">Текущая базовая тема Super Chat</p>
                                    </div>
                                </div>
                                <input type="radio" name="theme" value="default" ${currentTheme === 'default' ? 'checked' : ''} onchange="changeTheme('default')" class="w-5 h-5">
                            
</div>

                            <div class="settings-item theme-item">
                                <div class="flex items-center gap-3">
                                    <div class="theme-swatch" style="--sw-a:#A855F7;--sw-b:#EC4899;--sw-rgb:168,85,247"></div>
                                    <div>
                                        <h4 class="font-bold">Черно‑фиолетовая</h4>
                                        <p class="text-sm text-slate-400">Глубокий чёрный + фиолетовый неон, фон‑градиенты в чатах</p>
                                    </div>
                                </div>
                                <input type="radio" name="theme" value="nebula" ${currentTheme === 'nebula' ? 'checked' : ''} onchange="changeTheme('nebula')" class="w-5 h-5">
                            </div>

                            <div class="settings-item theme-item">

                                <div class="flex items-center gap-3">
                                    <div class="theme-swatch" style="--sw-a:#38BDF8;--sw-b:#7DD3FC;--sw-rgb:56,189,248"></div>
                                    <div>
                                        <h4 class="font-bold">Темная (яркая)</h4>
                                        <p class="text-sm text-slate-400">Более насыщенные акценты и контраст</p>
                                    </div>
                                </div>
                                <input type="radio" name="theme" value="dark" ${currentTheme === 'dark' ? 'checked' : ''} onchange="changeTheme('dark')" class="w-5 h-5">
                            </div>

                            <div class="settings-item theme-item">
                                <div class="flex items-center gap-3">
                                    <div class="theme-swatch" style="--sw-a:#3B82F6;--sw-b:#60A5FA;--sw-rgb:59,130,246"></div>
                                    <div>
                                        <h4 class="font-bold">Синяя</h4>
                                        <p class="text-sm text-slate-400">Темная тема с холодными акцентами</p>
                                    </div>
                                </div>
                                <input type="radio" name="theme" value="blue" ${currentTheme === 'blue' ? 'checked' : ''} onchange="changeTheme('blue')" class="w-5 h-5">
                            </div>

                            <div class="settings-item theme-item">
                                <div class="flex items-center gap-3">
                                    <div class="theme-swatch" style="--sw-a:#22C1FF;--sw-b:#99F6E4;--sw-rgb:34,193,255"></div>
                                    <div>
                                        <h4 class="font-bold">OLED (черный)</h4>
                                        <p class="text-sm text-slate-400">Глубокий черный фон и неон</p>
                                    </div>
                                </div>
                                <input type="radio" name="theme" value="oled" ${currentTheme === 'oled' ? 'checked' : ''} onchange="changeTheme('oled')" class="w-5 h-5">
                            </div>

                            

                            <div class="settings-item theme-item">
                                <div class="flex items-center gap-3">
                                    <div class="theme-swatch" style="--sw-a:#F43F5E;--sw-b:#FB7185;--sw-rgb:244,63,94"></div>
                                    <div>
                                        <h4 class="font-bold">Розовая</h4>
                                        <p class="text-sm text-slate-400">Яркая и сочная</p>
                                    </div>
                                </div>
                                <input type="radio" name="theme" value="rose" ${currentTheme === 'rose' ? 'checked' : ''} onchange="changeTheme('rose')" class="w-5 h-5">
                            </div>

                            <div class="settings-item theme-item">
                                <div class="flex items-center gap-3">
                                    <div class="theme-swatch" style="--sw-a:#10B981;--sw-b:#34D399;--sw-rgb:16,185,129"></div>
                                    <div>
                                        <h4 class="font-bold">Изумрудная</h4>
                                        <p class="text-sm text-slate-400">Зеленые акценты и свежий тон</p>
                                    </div>
                                </div>
                                <input type="radio" name="theme" value="emerald" ${currentTheme === 'emerald' ? 'checked' : ''} onchange="changeTheme('emerald')" class="w-5 h-5">
                            </div>

                            <div class="settings-item theme-item">
                                <div class="flex items-center gap-3">
                                    <div class="theme-swatch" style="--sw-a:#A855F7;--sw-b:#C084FC;--sw-rgb:168,85,247"></div>
                                    <div>
                                        <h4 class="font-bold">Фиолетовая</h4>
                                        <p class="text-sm text-slate-400">Космический стиль</p>
                                    </div>
                                </div>
                                <input type="radio" name="theme" value="purple" ${currentTheme === 'purple' ? 'checked' : ''} onchange="changeTheme('purple')" class="w-5 h-5">
                            </div>

                            <div class="settings-item theme-item">
                                <div class="flex items-center gap-3">
                                    <div class="theme-swatch" style="--sw-a:#F97316;--sw-b:#FB7185;--sw-rgb:249,115,22"></div>
                                    <div>
                                        <h4 class="font-bold">Закат</h4>
                                        <p class="text-sm text-slate-400">Теплая тема с градиентом</p>
                                    </div>
                                </div>
                                <input type="radio" name="theme" value="sunset" ${currentTheme === 'sunset' ? 'checked' : ''} onchange="changeTheme('sunset')" class="w-5 h-5">
                            </div>

                        </div>
                    </div>

<!-- Дизайн / Скругление / Стекло -->
                    <div class="card mb-6">
                        <h3 class="text-xl font-bold mb-4 border-b border-slate-700 pb-2">Дизайн</h3>

                        <div class="space-y-4">
                            <div class="settings-item">
                                <div class="flex-1 min-w-0">
                                    <h4 class="font-bold">Скругление интерфейса</h4>
                                    <p class="text-sm text-slate-400">Радиус карточек, панелей, сообщений и нижнего меню</p>
                                </div>
                                <span id="ui-radius-value" class="text-sm text-slate-300 font-semibold whitespace-nowrap">${uiRadius}px</span>
                            </div>
                            <input type="range" min="12" max="38" step="1" value="${uiRadius}" class="ios-range" oninput="setUiRadius(this.value)">

                            <div class="settings-item">
                                <div class="flex-1 min-w-0">
                                    <h4 class="font-bold">Размытие стекла</h4>
                                    <p class="text-sm text-slate-400">Сила blur-эффекта для панелей (glassmorphism)</p>
                                </div>
                                <span id="ui-blur-value" class="text-sm text-slate-300 font-semibold whitespace-nowrap">${uiBlur}px</span>
                            </div>
                            <input type="range" min="0" max="60" step="1" value="${uiBlur}" class="ios-range" oninput="setUiBlur(this.value)">

                            <div class="settings-item">
                                <div class="flex-1 min-w-0">
                                    <h4 class="font-bold">Прозрачность стекла</h4>
                                    <p class="text-sm text-slate-400">Насколько «плотное» стекло (0% — почти невидимо)</p>
                                </div>
                                <span id="ui-glass-value" class="text-sm text-slate-300 font-semibold whitespace-nowrap">${uiGlass}%</span>
                            </div>
                            <input type="range" min="4" max="18" step="1" value="${uiGlass}" class="ios-range" oninput="setUiGlass(this.value)">

                            <button class="secondary-button w-full" onclick="resetDesignSettings()">Сбросить настройки дизайна</button>
                        </div>
                    </div>


<!-- Производительность -->
<div class="card mb-6">
    <h3 class="text-xl font-bold mb-4 border-b border-slate-700 pb-2">Производительность</h3>
    <div class="settings-item">
        <div class="flex items-center">
            <span class="text-2xl mr-3">🔋</span>
            <div>
                <h4 class="font-bold">Энергосберегающий режим</h4>
                <p class="text-sm text-slate-400">Меньше размытия и анимаций — быстрее интерфейс и экономия батареи</p>
            </div>
        </div>
        <label class="toggle-switch" title="Энергосберегающий режим">
            <input type="checkbox" id="power-save-toggle" ${powerSave ? 'checked' : ''} onchange="setPowerSave(this.checked)">
            <span class="toggle-slider"></span>
        </label>
    </div>
</div>

    <div class="settings-item">
        <div class="flex items-center">
            <span class="text-2xl mr-3">🚀</span>
            <div>
                <h4 class="font-bold">Оптимизация для слабых устройств</h4>
                <p class="text-sm text-slate-400">Отключает тяжелые эффекты и размытие — лучше FPS</p>
            </div>
        </div>
        <label class="toggle-switch" title="Оптимизация для слабых устройств">
            <input type="checkbox" id="low-spec-toggle" ${lowSpec ? 'checked' : ''} onchange="setLowSpec(this.checked)">
            <span class="toggle-slider"></span>
        </label>
    </div>
    <div class="settings-item mt-3">
        <div class="flex items-center">
            <span class="text-2xl mr-3"><svg class="tg-svg" aria-hidden="true"><use href="#ico-star"></use></svg></span>
            <div>
                <h4 class="font-bold">Эффекты при скролле</h4>
                <p class="text-sm text-slate-400">Вы сами решаете, оставлять ли плавные эффекты и подсветку при прокрутке интерфейса.</p>
            </div>
        </div>
        <label class="toggle-switch" title="Эффекты при скролле">
            <input type="checkbox" id="scroll-fx-toggle" ${(localStorage.getItem('vox_scroll_fx_enabled') !== '0') ? 'checked' : ''} onchange="setScrollFxEnabled(this.checked)">
            <span class="toggle-slider"></span>
        </label>
    </div>
    <div id="settings-packages-panel">${renderPackagesPanelHtml('settings')}</div>
    <div class="settings-item mt-3">
        <div class="flex items-center">
            <span class="text-2xl mr-3">🧊</span>
            <div>
                <h4 class="font-bold">3D подарки</h4>
                <p class="text-sm text-slate-400">На телефонах автоматически отключаются. На ПК можно включить только после установки пакета эффектов.</p>
            </div>
        </div>
        <label class="toggle-switch" title="3D подарки">
            <input type="checkbox" id="gifts-3d-toggle" ${(hasPackageInstalled('effects') && localStorage.getItem('vox_gifts_3d_enabled') === '1' && !isMobileLiteMode()) ? 'checked' : ''} ${(hasPackageInstalled('effects') && !isMobileLiteMode()) ? '' : 'disabled'} onchange="setGift3dEnabled(this.checked)">
            <span class="toggle-slider"></span>
        </label>
    </div>
</div>


                    <!-- Информация о приложении -->
                    <div class="card mb-6">
                        <h3 class="text-xl font-bold mb-4 border-b border-slate-700 pb-2">О приложении</h3>
                        <div class="space-y-3">
                            <div class="version-beta-card">
                                <div>
                                    <div class="version-beta-card__title">Версия Super Chat</div>
                                    <div class="version-beta-card__sub">Текущая сборка обновлена и работает в beta-режиме.</div>
                                </div>
                                <div class="version-beta-card__badge"><svg class="tg-svg" aria-hidden="true"><use href="#ico-star"></use></svg><span>beta</span></div>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            `;
            document.getElementById('screen-container').innerHTML = `<div id="settings_screen_content" class="screen-content">${settingsContent}</div>`;
        }

        function renderShopView() {
    const shopContent = `
        <div id="shop_view" class="p-4 flex flex-col h-full overflow-y-auto">
            <h2 class="section-title">Магазин подарков</h2>
            
            <div class="mb-6 card flex justify-between items-center">
                <span class="text-lg font-semibold">Ваш баланс:</span>
                <span id="shop-stars-balance" class="stars-badge">${currentUser.stars ?? 0} ⚡</span>
            </div>

            <!-- ТОЛЬКО ТРИ ВКЛАДКИ -->
            <div class="shop-tabs">
                <button id="basic-gifts-tab" class="shop-tab-button active">Подарки</button>
                <button id="auction-tab" class="shop-tab-button">Аукцион</button>
                <button id="subscriptions-tab" class="shop-tab-button">Подписки</button>
            </div>

            <!-- Контейнер для динамического контента -->
            <div id="shop-content-container">
                ${renderGiftsContent()}
            </div>
        </div>
    `;
    
    document.getElementById('screen-container').innerHTML = `<div id="shop_screen_content" class="screen-content">${shopContent}</div>`;
    
    // Обработчики вкладок
    document.getElementById('basic-gifts-tab').addEventListener('click', () => switchShopTab('gifts'));
    document.getElementById('auction-tab').addEventListener('click', () => switchShopTab('auction'));
    document.getElementById('subscriptions-tab').addEventListener('click', () => switchShopTab('subscriptions'));
}

// Функция рендера подарков
function renderGiftsContent() {
    // helper: render one gift card
    const renderGiftCard = (key, gift) => {
        const canAfford = (currentUser.stars ?? 0) >= Number(gift.price || 0);
        const style = `--gift-grad:${gift.grad || 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.9))'}; --gift-accent:${gift.accent || 'var(--primary)'};`;
	        const nftBadge = (gift && gift.type === 'nft') ? `<div class="gift-nft-ribbon">NFT</div>` : '';
        return `
            <div class="gift-item" style="${style}">
	                ${nftBadge}
                ${renderGiftVisual(gift, { className: 'gift-art' })}
                <div class="gift-name">${escapeHtml(gift.name || 'Подарок')}</div>
                <div class="gift-desc">${escapeHtml(gift.desc || '')}</div>
                <div class="gift-meta-row">
                    <div class="gift-id-badge">ID: ${escapeHtml(String(gift.id ?? key))}</div>
                    <div class="gift-price-badge">${escapeHtml(String(gift.price || 0))} ⚡</div>
                </div>
                <button class="primary-button w-full ${!canAfford ? 'disabled' : ''}"
                        onclick="attemptBuyGift('${key}', ${Number(gift.price || 0)})"
                        ${!canAfford ? 'disabled' : ''}>
                    Купить
                </button>
            </div>
        `;
    };

    const keys = Object.keys(GIFTS_STORE)
        .filter(k => {
            const g = GIFTS_STORE[k];
            if (!g) return false;
            if (g.price === null || g.price === undefined) return false;
            // скрываем legacy-подарки из магазина, но сохраняем их для профиля/сообщений
            if (g.hidden_shop) return false;
            return true;
        });

    return `
        <div id="gifts-content">
            <h3 class="text-xl font-bold mb-3">Доступные подарки</h3>
            <div id="gift-shop-list" class="grid grid-cols-2 gap-4">
                ${keys.map(key => renderGiftCard(key, GIFTS_STORE[key])).join('')}
            </div>
        </div>
    `;
}

// Функция рендера аукциона
function renderAuctionContent() {
    // Список NFT в инвентаре (которые можно выставлять)
    const nftKeys = Object.keys(GIFTS_STORE).filter(isNftGiftKey);
    const nftMap = {};
    // Group NFT gifts by key so we can выставлять 1 или несколько
    try{
        const giftsObj = (window.currentUser && currentUser && currentUser.gifts) ? currentUser.gifts : {};
        for (const [giftId, g] of Object.entries(giftsObj)) {
            const meta = getGiftMetaByAny({ gift_id: giftId, ...(typeof g === 'object' ? g : {}), emoji: (typeof g === 'string' ? g : (g && g.emoji)) }) || null;
            const key = (typeof g === 'object' && g && g.key) ? g.key : ((meta && meta.giftKey) ? meta.giftKey : '');
            if (!key || !nftKeys.includes(key)) continue;
            const gift = GIFTS_STORE[key] || (meta ? meta.gift : null);
            if (!gift || gift.type !== 'nft') continue;

            if (!nftMap[key]) nftMap[key] = { key, ids: [], count: 0, gift };
            nftMap[key].ids.push(String(giftId));
            nftMap[key].count += 1;
        }
    }catch(e){}

    // expose grouped ids for sell modal (so qty works)
    try{
        window.__giftGroupIds = window.__giftGroupIds || {};
        for (const [k, grp] of Object.entries(nftMap)) {
            window.__giftGroupIds[k] = grp.ids.slice();
        }
    }catch(e){}

    const nftItems = Object.values(nftMap).map(grp => ({
        key: grp.key,
        ids: grp.ids,
        count: grp.count,
        emoji: (grp.gift && grp.gift.emoji) ? grp.gift.emoji : '🎁',
        name: (grp.gift && grp.gift.name) ? grp.gift.name : grp.key,
        grad: (grp.gift && grp.gift.grad) ? grp.gift.grad : 'linear-gradient(135deg,#334155,#0f172a)',
        accent: (grp.gift && grp.gift.accent) ? grp.gift.accent : '#94a3b8',
    }));

const sellGrid = (nftItems.length === 0)
        ? `<div class="text-center text-slate-400 py-6">У вас нет NFT для аукциона</div>`
        : `
            <div class="grid grid-cols-1 gap-3">
                ${nftItems.map(it => `
                    <div class="gift-card" style="--gift-accent:${it.accent};">
                        <div class="gift-fx"></div>
                        ${renderGiftVisual({ emoji: it.emoji }, { className: 'gift-art' })}
                        <div class="gift-info">
                            <div class="gift-name">${it.name}</div>
                            <div class="gift-desc text-slate-300 text-sm">NFT из инвентаря • x${it.count}</div>
                        </div>
                        <button class="primary-button w-full" onclick="openAuctionSellModal('','${it.key}')">Выставить</button>
                    </div>
                `).join('')}
            </div>
        `;

    return `
        <div id="auction-content">
            <h3 class="text-xl font-bold mb-2 text-center">Аукцион</h3>
            <div id="auction-items-list" class="space-y-3">
                <p class="text-center text-slate-400 py-8">Загрузка...</p>
            </div>

            <div class="mt-8">
                <h4 class="text-lg font-bold mb-3 text-center">Выставить NFT прямо из инвентаря</h4>
                ${sellGrid}
            </div>
        </div>
    `;
}


// Функция рендера подписок (ТОЛЬКО ЗДЕСЬ)
function renderSubscriptionsContent() {
    return `
        <div id="subscriptions-content">
            <h3 class="text-xl font-bold mb-4 gradient-text">Подписки SuperChat</h3>
            
            <!-- Premium карточка -->
            <div class="subscription-card premium-card mb-4">
                <div class="subscription-corner">
                    <span class="corner-text">Premium</span>
                </div>
                <div class="subscription-header">
                    <span class="subscription-icon">👑</span>
                    <h4 class="subscription-title">Premium</h4>
                </div>
                
                <ul class="subscription-features">
                    <li>• История (3 в день)</li>
                    <li>• Super Chat Бизнес</li>
                    <li>• Полная кастомизация</li>
                    <li>• Premium Статус (галочка)</li>
                    <li>• Подсветка сообщений</li>
                    <li>• Файлы до 500 МБ</li>
                    <li>• Чат «Избранное»</li>
                    <li>• Приоритетная поддержка</li>
                </ul>
                
                <div class="subscription-footer">
                    <span class="subscription-price">300 ⚡</span>
                    <button class="subscription-buy-btn premium-btn" onclick="buySubscription('premium')">Купить Premium</button>
                </div>
            </div>
            
            <!-- Gold карточка -->
            <div class="subscription-card gold-card mb-4">
                <div class="subscription-corner">
                    <span class="corner-text">Gold</span>
                </div>
                <div class="subscription-header">
                    <span class="subscription-icon">⭐</span>
                    <h4 class="subscription-title">Gold</h4>
                </div>
                
                <ul class="subscription-features">
                    <li>• История (2 в день)</li>
                    <li>• Super Chat Бизнес</li>
                    <li>• Кастомизация профиля</li>
                    <li>• Gold Статус (галочка)</li>
                    <li>• Подсветка сообщений</li>
                    <li>• Файлы до 300 МБ</li>
                    <li>• Чат «Избранное»</li>
                </ul>
                
                <div class="subscription-footer">
                    <span class="subscription-price">250 ⚡</span>
                    <button class="subscription-buy-btn gold-btn" onclick="buySubscription('gold')">Купить Gold</button>
                </div>
            </div>
            
            <!-- Silver карточка -->
            <div class="subscription-card silver-card">
                <div class="subscription-corner">
                    <span class="corner-text">Silver</span>
                </div>
                <div class="subscription-header">
                    <span class="subscription-icon">🔮</span>
                    <h4 class="subscription-title">Silver</h4>
                </div>
                
                <ul class="subscription-features">
                    <li>• История (1 в день)</li>
                    <li>• Кастомизация профиля</li>
                    <li>• Silver Статус (галочка)</li>
                    <li>• Файлы до 200 МБ</li>
                    <li>• Чат «Избранное»</li>
                </ul>
                
                <div class="subscription-footer">
                    <span class="subscription-price">200 ⚡</span>
                    <button class="subscription-buy-btn silver-btn" onclick="buySubscription('silver')">Купить Silver</button>
                </div>
            </div>
            
            <div class="text-center mt-4 text-slate-400 text-xs">
                * Все цены указаны в молниях за месяц
            </div>
        </div>
    `;
}

// Функция переключения вкладок (ПОЛНОСТЬЮ меняет контент)
function switchShopTab(tab) {
    // Обновляем активный класс на кнопках
    document.querySelectorAll('.shop-tab-button').forEach(btn => btn.classList.remove('active'));
    
    const container = document.getElementById('shop-content-container');
    
    if (tab === 'gifts') {
        document.getElementById('basic-gifts-tab').classList.add('active');
        container.innerHTML = renderGiftsContent();
    } else if (tab === 'auction') {
        document.getElementById('auction-tab').classList.add('active');
        container.innerHTML = renderAuctionContent();
        fetchAuctionItems(); // Загружаем данные аукциона
    } else if (tab === 'subscriptions') {
        document.getElementById('subscriptions-tab').classList.add('active');
        container.innerHTML = renderSubscriptionsContent();
    }
}

// Функция переключения основных вкладок




// Обновленная функция переключения вкладок
function setActiveShopTab(tab) {
    // Убираем активный класс со всех кнопок
    document.querySelectorAll('.shop-tab-button').forEach(btn => btn.classList.remove('active'));
    
    // Скрываем все контенты
    document.getElementById('basic-gifts-content').classList.add('hidden');
    document.getElementById('auction-content').classList.add('hidden');
    document.getElementById('subscriptions-content').classList.add('hidden');
    document.getElementById('lolpol-content').classList.add('hidden');

    // Активируем выбранную вкладку
    if (tab === 'basic-gifts') {
        document.getElementById('basic-gifts-tab').classList.add('active');
        document.getElementById('basic-gifts-content').classList.remove('hidden');
    } else if (tab === 'auction') {
        document.getElementById('auction-tab').classList.add('active');
        document.getElementById('auction-content').classList.remove('hidden');
        fetchAuctionItems(); // Загружаем аукцион
    } else if (tab === 'subscriptions') {
        document.getElementById('subscriptions-tab').classList.add('active');
        document.getElementById('subscriptions-content').classList.remove('hidden');
    }
}



// Функция открытия скрытой вкладки LolPol
function openLolPolAuction() {
    // Скрываем основные вкладки
    document.getElementById('basic-gifts-content').classList.add('hidden');
    document.getElementById('auction-content').classList.add('hidden');
    
    // Показываем LolPol вкладку
    document.getElementById('lolpol-content').classList.remove('hidden');
    
    // Убираем выделение с вкладок (чтобы не было активной)
    document.querySelectorAll('.shop-tab-button').forEach(btn => btn.classList.remove('active'));
    
    // Загружаем лоты
    fetchAuctionItems();
}

// Функция открытия скрытой вкладки LolPol
function openLolPolAuction() {
    // Скрываем основные вкладки
    document.getElementById('basic-gifts-content').classList.add('hidden');
    document.getElementById('auction-content').classList.add('hidden');
    
    // Показываем LolPol вкладку
    document.getElementById('lolpol-content').classList.remove('hidden');
    
    // Убираем выделение с вкладок (чтобы не было активной)
    document.querySelectorAll('.shop-tab-button').forEach(btn => btn.classList.remove('active'));
    
    // Загружаем лоты
    fetchAuctionItems();
}

// Вспомогательная функция для переключения вкладок магазина
function setActiveShopTab(tab) {
    // Снимаем active со всех кнопок
    document.querySelectorAll('.shop-tab-button').forEach(btn => btn.classList.remove('active'));
    
    // Скрываем все контенты
    document.getElementById('basic-gifts-content').classList.add('hidden');
    document.getElementById('auction-content').classList.add('hidden');
    document.getElementById('lolpol-content').classList.add('hidden');

    // Активируем выбранную
    if (tab === 'basic-gifts') {
        document.getElementById('basic-gifts-tab').classList.add('active');
        document.getElementById('basic-gifts-content').classList.remove('hidden');
    } else if (tab === 'auction') {
        document.getElementById('auction-tab').classList.add('active');
        document.getElementById('auction-content').classList.remove('hidden');
    } else if (tab === 'lolpol') {
        document.getElementById('lolpol-tab').classList.add('active');
        document.getElementById('lolpol-content').classList.remove('hidden');
    }
}

        // Функция переключения на под-вкладку LolPol
function switchToLolPolSubtab() {
    document.getElementById('lolpol-subtab').classList.remove('hidden');
    fetchAuctionItems();  // Загрузка списка
}

        async function attemptBuyGift(giftKey, price) {
            showModal(
                'Подтверждение покупки', 
                `Вы хотите купить **${GIFTS_STORE[giftKey].emoji} ${GIFTS_STORE[giftKey].name}** за **${price} ⚡**?`, 
                true, 
                async () => {
                    const result = await apiRequest('buy_gift', { gift_key: giftKey });
                    if (result.success) {
                hideCaptcha();
                        currentUser.stars = result.new_stars;
                        
                        showModal('Куплено!', `Вы купили ${result.gift_emoji} ${result.gift_name}. Ваш баланс: ${result.new_stars} ⚡.`, false, () => {
                            const giftData = {
                                key: result.gift_key, 
                                emoji: result.gift_emoji, 
                                name: result.gift_name
                            };
                            switchScreen('gift_search', giftData);
                        });
                    } else {
                        showModal('Ошибка покупки', result.error || 'Не удалось купить подарок.');
                    }
                }
            );
        }

        // Gift panel from chat: buy & send directly to the current interlocutor
        function openChatGiftShop(recipientId, recipientName){
            try {
                if (!recipientId || !currentUser || !currentUser.id) return;
                if (String(recipientId) === String(currentUser.id)) {
                    showModal('Ошибка', 'Нельзя отправить подарок самому себе из чата');
                    return;
                }
                const safeName = escapeHtml(recipientName || '');
                const balance = Number(currentUser.stars || 0);

                const gifts = Object.entries(GIFTS_STORE)
                    .filter(([k,g]) => g && g.price !== null && g.price !== undefined && !g.hidden_shop && !g.hidden_send)
                    .sort((a,b) => (a[1].price||0) - (b[1].price||0));

                const giftCards = gifts.map(([key, g]) => {
                    const canAfford = balance >= Number(g.price || 0);
                    const btn = canAfford
                        ? `<button class="primary-button w-full" onclick="buyAndSendGift('${String(recipientId).replace(/'/g,"\\'")}', '${String(key).replace(/'/g,"\\'")}')">${t('Подарить')}</button>`
                        : `<button class="secondary-button w-full" disabled>${t('Не хватает')} ⚡</button>`;
                    return `
                        <div class="gift-mini-card" style="--gift-grad:${escapeHtml((g.grad || '') ? g.grad : 'rgba(15,23,42,0.56)')};">
                            <div class="gift-mini-emoji">${escapeHtml(g.emoji || '🎁')}</div>
                            <div class="gift-mini-name">${escapeHtml(g.name || 'Подарок')}</div>
                            <div class="gift-mini-price">${escapeHtml(String(g.price || 0))} ⚡</div>
                            ${btn}
                        </div>
                    `;
                }).join('');

                const feePct = 25;
                const starsPanel = `
                    <div class="text-xs text-slate-400 mb-3">${t('Баланс')}: <span class="text-white font-bold">${balance} ⚡</span></div>
                    <div class="mb-2">
                        <label class="text-sm text-slate-200">${t('Сумма')}</label>
                        <input id="stars-transfer-amount" type="number" class="input-field mt-1" min="1" max="999999" placeholder="${t('Введите количество бустов')}">
                    </div>
                    <div id="stars-transfer-hint" class="text-xs text-slate-300 mb-3">${t('Комиссия')} ${feePct}% — ${t('получатель получит на')} ${feePct}% ${t('меньше')}.</div>
                    <button class="primary-button w-full" onclick="transferStarsToUser('${String(recipientId).replace(/'/g,"\\'")}', ${feePct})">${t('Отправить бусты')}</button>
                `;

                const html = `
                    <div class="sheet-head">
                        <div class="sheet-title">${t('Отправить')} <span class="text-primary">${safeName}</span></div>
                        <button type="button" class="sheet-close-btn" aria-label="Закрыть" onclick="closeSheet()">✕</button>
                    </div>
                    <div class="p-3">
                        <div class="flex gap-2 mb-3">
                            <button class="chat-sheet-tab active" id="chat-gifts-tab" type="button" onclick="switchChatGiftSheetTab('gifts')">${t('Подарки')}</button>
                            <button class="chat-sheet-tab" id="chat-stars-tab" type="button" onclick="switchChatGiftSheetTab('stars')">${t('Бусты')}</button>
                        </div>
                        <div id="chat-gift-sheet-gifts">
                            <div class="gift-mini-grid">${giftCards}</div>
                        </div>
                        <div id="chat-gift-sheet-stars" class="hidden">
                            ${starsPanel}
                        </div>
                    </div>
                `;
                openSheet(html);
            } catch(e) {
                console.error(e);
                showModal('Ошибка', 'Не удалось открыть панель');
            }
        }

        function switchChatGiftSheetTab(tab){
            const gTab = document.getElementById('chat-gifts-tab');
            const sTab = document.getElementById('chat-stars-tab');
            const gPane = document.getElementById('chat-gift-sheet-gifts');
            const sPane = document.getElementById('chat-gift-sheet-stars');
            if (!gTab || !sTab || !gPane || !sPane) return;
            if (tab === 'stars'){
                gTab.classList.remove('active'); sTab.classList.add('active');
                gPane.classList.add('hidden'); sPane.classList.remove('hidden');
            } else {
                sTab.classList.remove('active'); gTab.classList.add('active');
                sPane.classList.add('hidden'); gPane.classList.remove('hidden');
            }
        }

        async function transferStarsToUser(recipientId, feePct){
            const amount = parseInt(document.getElementById('stars-transfer-amount')?.value || '0', 10);
            if (!(amount >= 1 && amount <= 999999)){
                showModal('Ошибка', 'Укажите сумму от 1 до 999999 ⚡');
                return;
            }
            const net = Math.max(0, Math.floor(amount * (100 - feePct) / 100));
            try{ closeSheet(); }catch(e){}
            showModal(t('Подтвердите'), `${t('Вы отправляете')} <b>${amount} ⚡</b>. ${t('Комиссия')}: ${feePct}%. ${t('Получатель получит')}: <b>${net} ⚡</b>.`, true, async () => {
                const res = await apiRequest('transfer_stars', { recipient_id: recipientId, amount });
                if (res && res.success){
                    hideCaptcha();
                    try{ closeSheet(); }catch(e){}
                    try{ await fetchCurrentUser(); }catch(e){}
                    showGiftToast({ emoji:'⚡', giftKey:'stars', title:t('Готово'), text:`${t('Отправлено')}: ${amount} ⚡ → @${res.recipient_username}. ${t('Списано')}: ${amount} ⚡. ${t('Получено')}: ${net} ⚡.`, duration:2600 });
                } else {
                    showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось перевести бусты');
                }
            });
        }

        
        function openStarsTransferGlobalModal(){
            const feePct = 25;
            const chats = Array.isArray(chatsData) ? chatsData : [];
            const chatItems = chats
                .filter(c => c && c.other_id)
                .map(c => {
                    const otherId = String(c.other_id);
                    const name = String(c.name || '');
                    const unameRaw = String(c.username || c.id || '').replace(/^@/, '');
                    const uname = unameRaw ? ('@' + unameRaw) : '';
                    const ava = String(c.avatar || c.photo || c.avatar_url || c.other_avatar || c.other_photo || 'default-avatar.png');
                    const title = name || uname || otherId;
                    const sub = (uname && title !== uname) ? `<div class="chat-pick-sub">${escapeHtml(uname)}</div>` : '';
                    return `<button type="button" class="chat-pick-item" data-chat-id="${escapeHtml(otherId)}" onclick="selectBoostChat(this)">
                                <img class="chat-pick-ava" src="${escapeHtml(ava)}" onerror="this.src='default-avatar.png'">
                                <div class="chat-pick-text">
                                    <div class="chat-pick-title">${escapeHtml(title)}</div>
                                    ${sub}
                                </div>
                            </button>`;
                })
                .join('');
            showModal(t('Перевод бустов'), `
                <div class="text-sm text-slate-200 mb-2">${t('Можно ввести @username / ссылку, либо выбрать чат')}</div>
                <input id="stars-to-username" class="input-field mb-2" placeholder="@username / ссылка/username">
                <div class="text-xs text-slate-400 mb-1">${t('или выберите чат')}</div>
                <div class="chat-picker mb-2" id="boost-chat-picker">
                    ${chatItems || `<div class="text-xs text-slate-400 p-2">${t('Чаты не найдены')}</div>`}
                </div>
                <input type="hidden" id="stars-to-chat" value="">
                <input id="stars-transfer-amount-global" type="number" class="input-field mb-2" min="1" max="999999" placeholder="${t('Сумма (⚡)')}" oninput="try{const a=parseInt(this.value||'0',10);const net=Math.max(0,Math.floor(a*(100-${feePct})/100));document.getElementById('stars-transfer-net-global').textContent = a?('${t('Получатель получит')}: '+net+' ⚡ (${t('комиссия')} ${feePct}%)'):'';}catch(e){}">
                <div id="stars-transfer-net-global" class="text-xs text-slate-300 mb-2"></div>
                <div class="text-xs text-slate-400">${t('Комиссия')}: ${feePct}%. ${t('Вы списываете сумму полностью, получатель получает на 25% меньше')}.</div>
            `, true, async () => {
                const amount = parseInt(document.getElementById('stars-transfer-amount-global')?.value || '0', 10);
                if (!(amount >= 1 && amount <= 999999)){
                    showModal('Ошибка', 'Укажите сумму от 1 до 999999 ⚡');
                    return;
                }
                const chatSel = String(document.getElementById('stars-to-chat')?.value || '').trim();
                const raw = String(document.getElementById('stars-to-username')?.value || '').trim();
                let recipient_id = chatSel || '';
                let username = '';
                if (!recipient_id && raw){
                    username = normalizeUsernameInput(raw);
                }
                if (!recipient_id && !username){
                    showModal('Ошибка', t('Укажите получателя'));
                    return;
                }
                const net = Math.max(0, Math.floor(amount * (100 - feePct) / 100));
                showModal(t('Подтвердите'), `${t('Списать')} <b>${amount} ⚡</b>. ${t('Комиссия')}: ${feePct}%. ${t('Получатель получит')}: <b>${net} ⚡</b>.`, true, async () => {
                    const payload = { amount };
                    if (recipient_id) payload.recipient_id = recipient_id;
                    if (username) payload.username = username;
                    const res = await apiRequest('transfer_stars', payload);
                    if (res && res.success){
                        hideCaptcha();
                        try{ await fetchCurrentUser(); }catch(e){}
                        showModal(t('Готово'), `${t('Отправлено')}: ${amount} ⚡ → @${escapeHtml(res.recipient_username)}. ${t('Получено')}: ${net} ⚡.`);
                    } else {
                        showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось перевести бусты');
                    }
                });
            });
        }

        function selectBoostChat(btn){
            try{
                const id = btn?.getAttribute('data-chat-id') || '';
                const hidden = document.getElementById('stars-to-chat');
                if (hidden) hidden.value = String(id);
                // highlight
                document.querySelectorAll('#boost-chat-picker .chat-pick-item').forEach(el => el.classList.remove('active'));
                btn.classList.add('active');
                // clear manual input to avoid ambiguity
                const u = document.getElementById('stars-to-username');
                if (u) u.value = '';
            }catch(e){}
        }


        function normalizeUsernameInput(input){
            let v = String(input || '').trim();
            v = v.replace(/^https?:\/\//i,'');
            v = v.replace(/^t\.me\//i,'');
            v = v.replace(/^@/,'');
            v = v.split(/[\s\/?#&]+/)[0];
            return v;
        }

async function buyAndSendGift(recipientId, giftKey){
            const g = GIFTS_STORE[giftKey];
            if (!g || g.price === null || g.price === undefined) {
                showModal('Ошибка', 'Подарок не найден');
                return;
            }

            // Close the sheet immediately (requested UX)
            try{ closeSheet(); }catch(e){}
            showGiftToast({
                emoji: String(g.emoji || '🎁'),
                giftKey: giftKey,
                title: 'Отправляем подарок…',
                text: `${g.name} уже летит к получателю`,
                duration: 1400
            });

            const res = await apiRequest('buy_and_send_gift', { recipient_id: recipientId, gift_key: giftKey });
            if (res && res.success) {
                hideCaptcha();
                if (!currentUser) currentUser = {};
                if (typeof res.new_stars !== 'undefined') currentUser.stars = res.new_stars;

                showGiftToast({
                    emoji: String(res.gift_emoji || g.emoji || '🎁'),
                    giftKey: giftKey,
                    title: '✅ Подарок доставлен',
                    text: `Вы подарили ${res.gift_name} пользователю ${res.recipient_name} • Баланс: ${res.new_stars} ⚡`,
                    duration: 2600
                });

                // Refresh chat if we are inside it
                try { if (currentChatId) { await fetchMessages(currentChatId, false, { force: true }); } } catch(err) {}
            } else {
                showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось отправить подарок');
            }
        }

        async function sendGiftToRecipient(recipientId, giftKey, giftEmoji, giftName, recipientName) {
            const currentModal = document.getElementById('custom-modal');
            if (!currentModal.classList.contains('hidden')) currentModal.classList.add('hidden');

            const result = await apiRequest('send_gift', {
                recipient_id: recipientId,
                gift_key: giftKey,
                gift_emoji: giftEmoji,
                gift_name: giftName
            });

            if (result.success) {
                hideCaptcha();
                if (result.is_self) {
                     showModal('Подарок себе!', `Вы добавили ${giftEmoji} ${giftName} в свой инвентарь!`, false, () => {
                         fetchCurrentUser().then(() => switchScreen('profile'));
                     });
                } else {
                     showModal('Подарок отправлен!', `Вы отправили ${result.gift_emoji} ${giftName} пользователю ${result.recipient_name}! Уведомление отправлено в чат.`, false, () => {
                         window.__screenHistoryBootstrapped = false;
                    switchScreen('chats_list');
                     });
                }
                
            } else {
                 showModal('Ошибка отправки', result.error || 'Не удалось отправить подарок.');
            }
        }
        
        function renderGiftsInventory(gifts, filterQuery = '') {
    // For bulk actions in UI
    window.__giftGroupIds = {};
    if (!gifts || Object.keys(gifts).length === 0) {
        return '<p class="text-slate-400 text-sm text-center py-4">Ваш инвентарь подарков пуст.</p>';
    }

    const giftGroups = {};
    Object.entries(gifts).forEach(([giftId, giftData]) => {
    // Получаем emoji из данных
        const giftEmoji = typeof giftData === 'string' ? giftData : (giftData.emoji || giftData);
        
        // Получаем key из данных или находим по emoji
        let baseKey = typeof giftData === 'object' ? giftData.key : null;
        if (!baseKey) {
            baseKey = Object.keys(GIFTS_STORE).find(key => 
                GIFTS_STORE[key].emoji === giftEmoji
            );
        }
        
	        
        if (baseKey === 'casino') {
            return;
        }
if (baseKey && GIFTS_STORE[baseKey]) {
            if (!giftGroups[baseKey]) {
                giftGroups[baseKey] = {
                    key: baseKey,
                    emoji: giftEmoji,
	                    name: GIFTS_STORE[baseKey].name || 'Подарок',
	                    price: GIFTS_STORE[baseKey].price ? Math.floor(GIFTS_STORE[baseKey].price * 0.5) : 0,
                    count: 0,
                    ids: []
                };
            }
            giftGroups[baseKey].count++;
            giftGroups[baseKey].ids.push(giftId);
        }
    });

    // Фильтрация по поисковому запросу
    const filteredGroups = Object.values(giftGroups).filter(group => {
        if (!filterQuery) return true;
        
        const nameMatch = group.name.toLowerCase().includes(filterQuery);
        const emojiMatch = group.emoji.toLowerCase().includes(filterQuery);
        const keyMatch = group.key.toLowerCase().includes(filterQuery);
        
        return nameMatch || emojiMatch || keyMatch;
    }).sort((a, b) => {
        const an = isNftGiftKey(a.key) ? 0 : 1;
        const bn = isNftGiftKey(b.key) ? 0 : 1;
        if (an !== bn) return an - bn;
        if ((b.count || 0) !== (a.count || 0)) return (b.count || 0) - (a.count || 0);
        return String(a.name || '').localeCompare(String(b.name || ''), 'ru');
    });

    if (filteredGroups.length === 0 && filterQuery) {
        return `<p class="text-slate-400 text-sm text-center py-4">Подарки по запросу "${filterQuery}" не найдены.</p>`;
    }

    return filteredGroups.map(group => {
        try{ window.__giftGroupIds[group.key] = group.ids.slice(); }catch(e){}
        let actionButton = '';
        
        // Логика эффектов
        if (isNftGiftKey(group.key)) {
            const isEquipped = currentUser.active_effect === group.key;
            const btnText = isEquipped ? 'Снять' : 'Применить';
            let btnColor = 'bg-blue-600 hover:bg-blue-700';
            
            if (isEquipped) btnColor = 'bg-slate-600 hover:bg-slate-700';
            else if (group.key === 'lolpol') btnColor = 'bg-red-600 hover:bg-red-700';
            else if (group.key === 'dragon') btnColor = 'bg-orange-600 hover:bg-orange-700';
            else if (group.key === 'phoenix') btnColor = 'bg-sky-600 hover:bg-sky-700';
            
            actionButton = `<button class="primary-button ${btnColor} text-sm px-3 py-1 mr-2" onclick="toggleUserEffect('${group.key}')">${btnText}</button>`;
        }

        // Логика продажи
        let sellButton = '';
        if (isNftGiftKey(group.key)) {
            // NFT/эффект-подарки продаются только через аукцион
            sellButton = `
                <button class="primary-button bg-emerald-600 hover:bg-emerald-700 text-sm px-3 py-1"
                        onclick="openAuctionSellModal('', '${group.key}')">
                    На аукцион${group.count>1 ? ` (x${group.count})` : ''}
                </button>
                <p class="text-xs text-slate-400 mt-2">Продажа только через аукцион</p>
            `;
        } else {
            sellButton = `
                <button class="primary-button bg-yellow-600 hover:bg-yellow-700 text-sm px-3 py-1"
                        onclick="attemptSellGift('${group.ids[0]}', ${group.price}, '${group.emoji}', '${group.name}')">
                    Продать (${group.price} ⚡)
                </button>
            `;
        }

        return `
            <div class="inventory-item">
                <div class="flex items-center">
                    <div class="mr-3" style="width:54px;height:54px;">${renderGiftVisual({ emoji: group.emoji }, { className: 'gift-art' })}</div>
                    <div>
                        <h4 class="font-bold">${group.name}</h4>
                        <p class="text-sm text-slate-400">В инвентаре: x${group.count}${isNftGiftKey(group.key) ? ` • NFT ID: ${escapeHtml(String((GIFTS_STORE[group.key]||{}).id || group.key))}` : ''}</p>
                    </div>
                </div>
                <div class="flex items-center mt-2 w-full justify-end flex-wrap gap-2">
                    ${actionButton}
                    ${isNftGiftKey(group.key) ? `<button class="primary-button bg-violet-600 hover:bg-violet-700 text-sm px-3 py-1" onclick="openEffectSettingsModal('${group.key}')">Настроить FX</button>` : ''}
                    ${sellButton}
                </div>
            </div>
        `;
    }).join('');
}
        
        async function toggleUserEffect(effectName) {
            let savedPreset = {};
            try{ savedPreset = JSON.parse(localStorage.getItem('vox_effect_preset_' + effectName) || '{}') || {}; }catch(e){}
            const result = await apiRequest('toggle_effect', { effect: effectName, ...savedPreset });
            
            if (result.success) {
                hideCaptcha();
                currentUser.active_effect = result.active_effect;
                if (result.effect_settings) currentUser.effect_settings = result.effect_settings;
                try { applyGlobalEffectTheme(currentUser.active_effect); } catch(e) {}
                try { updateAdminAccessUI(); } catch(e) {}
                try { updateDrawerProfile(); } catch(e) {}
                try { updateDrawerProfile(); } catch(e) {}
                showModal('Успех', result.active_effect ? 'Эффект применен!' : 'Эффект снят.', false, () => {
                    renderProfileView();
                });
            } else {
                showModal('Ошибка', result.error || 'Не удалось изменить эффект.');
            }
        }
        

        async function openEffectSettingsModal(effectKey) {
            if (!isNftGiftKey(effectKey)) {
                showModal('Ошибка', 'Этот подарок не поддерживает настройку эффекта.');
                return;
            }
            const active = String((currentUser && currentUser.active_effect) || '');
            const current = getEffectSettings();
            const gift = GIFTS_STORE[effectKey] || {};
            showModal(`Настройка эффекта ${gift.emoji || '✨'} ${gift.name || effectKey}`, `
                <div class="space-y-3 text-left">
                    <div class="text-sm text-slate-300">Можно сохранить стиль даже для оптимизации слабых устройств.</div>
                    <div>
                        <label class="text-sm block mb-1">Режим</label>
                        <select id="fx-preset" class="input-field">
                            <option value="minimal" ${current.preset==='minimal'?'selected':''}>Minimal</option>
                            <option value="balanced" ${current.preset==='balanced'?'selected':''}>Balanced</option>
                            <option value="full" ${current.preset==='full'?'selected':''}>Full</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-sm block mb-1">Интенсивность</label>
                        <input id="fx-intensity" type="range" min="0" max="100" value="${current.intensity}" class="w-full">
                    </div>
                    <div>
                        <label class="text-sm block mb-1">Скорость анимации</label>
                        <input id="fx-speed" type="range" min="30" max="180" value="${current.animation_speed}" class="w-full">
                    </div>
                    <label class="flex items-center gap-2 text-sm"><input id="fx-particles" type="checkbox" ${current.particles ? 'checked' : ''}> Частицы и свечение</label>
                    ${active !== effectKey ? `<div class="text-xs text-amber-300">Сейчас активен другой эффект. Настройки сохранятся и применятся после активации ${gift.name || effectKey}.</div>` : ''}
                </div>
            `, true, async () => {
                const payload = {
                    preset: document.getElementById('fx-preset')?.value || 'full',
                    intensity: parseInt(document.getElementById('fx-intensity')?.value || '70', 10),
                    animation_speed: parseInt(document.getElementById('fx-speed')?.value || '100', 10),
                    particles: document.getElementById('fx-particles')?.checked ? 1 : 0,
                };
                let res;
                if (active === effectKey) {
                    res = await apiRequest('update_effect_settings', payload);
                } else {
                    try{ localStorage.setItem('vox_effect_preset_' + effectKey, JSON.stringify(payload)); }catch(e){}
                    res = { success: true, active_effect: active || null, effect_settings: payload, local_only: true };
                }
                if (res && res.success) {
                    hideCaptcha();
                    if (active === effectKey) currentUser.effect_settings = res.effect_settings || payload;
                    if (active === effectKey) { try { applyGlobalEffectTheme(currentUser.active_effect); } catch(e) {} }
                    showModal('Успех', active === effectKey ? 'Параметры NFT-эффекта сохранены.' : 'Параметры сохранены. Они применятся после включения этого NFT-эффекта.', false, () => renderProfileView());
                } else {
                    showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось сохранить настройки эффекта');
                }
            });
        }

        async function fetchAuctionItems() {
    const result = await apiRequest('list_auction_items');
    if (result.success) {
                hideCaptcha();
        const list = document.getElementById('auction-items-list');
        list.innerHTML = '';
        if (result.items.length === 0) {
            list.innerHTML = '<p class="text-center text-slate-400 py-8">Нет подарков на аукционе</p>';
        } else {
            result.items.forEach(item => {
                const isOwn = item.seller_id === currentUser.id;
	                const isNft = isNftGiftKey(String(item.gift_key || ''));
                const feePct = 10;
                const net = Math.max(0, Math.floor((Number(item.price)||0) * (100-feePct) / 100));
                const fxClass = (item.gift_key === 'dragon') ? 'fx-dragon' : ((item.gift_key === 'phoenix') ? 'fx-phoenix' : '');
                const button = isOwn ? 
                    `<div class="auction-item-actions">
                        <button class="primary-button bg-indigo-600 hover:bg-indigo-700 text-sm px-3 py-1" onclick="openAuctionEditPriceModal('${item.id}', ${Number(item.price)||0})">Изменить цену</button>
                        <button class="primary-button bg-gray-600 hover:bg-gray-700 text-sm px-3 py-1" onclick="cancelAuctionItem('${item.id}')">Отменить</button>
                     </div>` :
                    `<div class="auction-item-actions"><button class="primary-button bg-green-600 hover:bg-green-700 text-sm px-3 py-1" onclick="buyAuctionItem('${item.id}')">Купить</button></div>`;
                
                list.innerHTML += `
                    <div class="auction-item ${fxClass}">
	                        ${isNft ? '<div class="auction-nft-badge">NFT</div>' : ''}
                        <div class="mb-2 mx-auto" style="width:88px;height:88px;">${renderGiftVisual({ emoji: item.gift_emoji }, { className: 'gift-art' })}</div>
                        <h4 class="font-bold text-md mb-1">${item.gift_name}</h4>
                        <p class="text-white">Цена: ${item.price} ⚡</p>
                        ${isOwn ? `<p class="text-xs text-slate-300">Комиссия ${feePct}%: получите ${net} ⚡</p>` : ''}
                        <p class="text-white text-sm">Продавец: @${item.seller_username}</p>
                        ${button}
                    </div>
                `;
            });
        }
    }
}

async function openAuctionEditPriceModal(lotId, currentPrice){
    const feePct = 10;
    showModal('Изменить цену', `
        <input id="auction-edit-price" type="number" class="input-field mb-2" min="1" max="999999" value="${Number(currentPrice)||1}">
        <div class="text-xs text-slate-400">Комиссия ${feePct}%. Покупатель платит указанную цену, вы получите на ${feePct}% меньше.</div>
    `, true, async () => {
        const price = parseInt(document.getElementById('auction-edit-price')?.value || '0', 10);
        if (!(price >= 1 && price <= 999999)) {
            showModal('Ошибка', 'Укажите цену от 1 до 999999 ⚡');
            return;
        }
        const res = await apiRequest('update_auction_price', { lot_id: lotId, price });
        if (res && res.success) {
            hideCaptcha();
            fetchAuctionItems();
            showModal('Успех', 'Цена обновлена');
        } else {
            showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось изменить цену');
        }
    });
}


async function openAuctionSellModal(giftId, giftKey){
    // защита: казино полностью запрещён
    if (giftKey === 'casino') {
        showModal('Ошибка', 'Этот подарок удалён и недоступен.');
        return;
    }

    const meta = getGiftMetaByAny({ giftKey, gift_key: giftKey }) || null;
    const g = meta ? meta.gift : (GIFTS_STORE[giftKey] || null);
    const emoji = String((g && g.emoji) || '🎁');
    const name  = String((g && g.name)  || giftKey);

    const feePct = 10;
    const idsAll = (giftId && String(giftId).trim() !== '') ? [String(giftId)] : (window.__giftGroupIds && window.__giftGroupIds[giftKey] ? window.__giftGroupIds[giftKey].slice() : []);
    const maxQty = Math.max(1, idsAll.length || 1);

    showModal(`Выставить ${name}`, `
        <div class="text-center mb-3">
            <div class="gift-card mx-auto" style="max-width: 320px; --gift-accent:${(g && g.accent) ? g.accent : '#94a3b8'};">
                <div class="gift-fx"></div>
                <div class="gift-art" style="background:${(g && g.grad) ? g.grad : 'linear-gradient(135deg,#334155,#0f172a)'}">
                    <div class="gift-model" style="font-size:64px">${emoji}</div>
                </div>
                <div class="gift-info">
                    <div class="gift-name">${__escapeHtml(name)}</div>
                    <div class="gift-desc text-slate-300 text-sm">Выберите цену и подтвердите</div>
                </div>
            </div>
        </div>

        <input id="auction-price-generic" type="number" class="input-field mb-2" placeholder="Цена (1–999999)" min="1" max="999999" value="5000" oninput="try{const p=parseInt(this.value||'0',10);const net=Math.max(0,Math.floor(p*(100-${feePct})/100));document.getElementById('auction-net-hint').textContent = net ? ('После комиссии ${feePct}% вы получите: '+net+' ⚡') : '';}catch(e){}">
        ${maxQty>1 ? `
            <div class="flex items-center gap-2 mb-2">
                <input id="auction-qty-toggle" type="checkbox" onchange="try{document.getElementById('auction-qty-wrap').classList.toggle('hidden', !this.checked);}catch(e){}">
                <label for="auction-qty-toggle" class="text-sm text-slate-200">Выставить несколько</label>
            </div>
            <div id="auction-qty-wrap" class="hidden">
                <input id="auction-qty" type="number" class="input-field mb-2" placeholder="Количество (1–${maxQty})" min="1" max="${maxQty}" value="1">
            </div>
        ` : ''}
        <div id="auction-net-hint" class="text-xs text-slate-300 mb-1">После комиссии ${feePct}% вы получите: ${Math.max(0,Math.floor(5000*(100-feePct)/100))} ⚡</div>
        <div class="text-xs text-slate-400">Комиссия аукциона ${feePct}%. Покупатель платит указанную цену, вы получите на ${feePct}% меньше.</div>
    `, true, async () => {
        const price = parseInt(document.getElementById('auction-price-generic')?.value || '0', 10);
        if (!(price >= 1 && price <= 999999)) {
            showModal('Ошибка', 'Укажите цену от 1 до 999999 ⚡');
            return;
        }

        let qty = 1;
        if (maxQty>1) {
            const multi = !!document.getElementById('auction-qty-toggle')?.checked;
            if (multi) {
                qty = parseInt(document.getElementById('auction-qty')?.value || '1', 10);
                if (!(qty >= 1 && qty <= maxQty)) {
                    showModal('Ошибка', `Укажите количество от 1 до ${maxQty}`);
                    return;
                }
            }
        }


        if (!idsAll || !idsAll.length) {
            showModal('Ошибка', 'Подарок не найден в инвентаре');
            return;
        }

        let result;
        if (qty > 1) {
            const ids = idsAll.slice(0, qty);
            result = await apiRequest('sell_to_auction_bulk', { gift_ids: JSON.stringify(ids), gift_key: giftKey, price });
        } else {
            const idOne = idsAll[0] || giftId;
            result = await apiRequest('sell_to_auction', { gift_id: idOne, gift_key: giftKey, price });
        }

        if (result && result.success) {
            hideCaptcha();
            await fetchCurrentUser();
            fetchAuctionItems();
            if (qty > 1) {
                const ok = (result.lot_ids || []).length;
                const err = (result.errors || []).length;
                showModal('Успех', `${emoji} ${name}: выставлено ${ok} шт.${err ? ' Ошибок: '+err : ''}`);
            } else {
                showModal('Успех', `${emoji} ${name} выставлен на аукцион!`);
            }
        } else {
            showModal('Ошибка', (result && result.error) ? result.error : 'Не удалось выставить');
        }
    });
}

async function showSellLolPolModal(){
    let lolpolGiftId = null;
	for (const [giftId, g] of Object.entries(currentUser.gifts || {})) {
		const emoji = (typeof g === 'string') ? g : (g && g.emoji ? g.emoji : '');
		const key = (typeof g === 'object' && g) ? (g.key || '') : '';
		if (key === 'lolpol' || emoji === '🍭') {
            lolpolGiftId = giftId;
            break;
        }
    }
    if (!lolpolGiftId) {
        showModal('Ошибка', 'У вас нет LolPol для продажи.');
        return;
    }

    showModal('Выставить LolPol на продажу', `
        <input id="auction-price" type="number" class="input-field mb-4" placeholder="Цена в бустовах (1–9999)" min="1" max="9999" value="5000">
    `, true, async () => {
        const price = parseInt(document.getElementById('auction-price').value);
        if (price >= 1 && price <= 9999) {
            const result = await apiRequest('sell_to_auction', { gift_id: lolpolGiftId, gift_key: 'lolpol', price });
            if (result.success) {
                hideCaptcha();
                await fetchCurrentUser();  // Обновляем данные
                fetchAuctionItems();        // Обновляем список лотов
                showModal('Успех', 'LolPol выставлен на аукцион!');
            } else {
                showModal('Ошибка', result.error || 'Не удалось выставить');
            }
        } else {
            showModal('Ошибка', 'Укажите цену от 1 до 9999 ⚡');
        }
    });
}



async function cancelAuctionItem(lotId){
    showModal('Снять лот?', 'Лот будет снят с аукциона и вернётся в ваш инвентарь.', true, async () => {
        const res = await apiRequest('cancel_auction_item', { lot_id: lotId });
        if (res && res.success) {
            hideCaptcha();
            try{ await fetchCurrentUser(); }catch(e){}
            try{ await fetchAuctionItems(); }catch(e){}
            showModal('Успех', 'Лот снят с аукциона');
        } else {
            showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось снять лот');
        }
    });
}

async function buyAuctionItem(lotId) {
    const result = await apiRequest('buy_auction_item', { lot_id: lotId });
    if (result.success) {
                hideCaptcha();
        currentUser.stars = result.new_stars;
        fetchCurrentUser();
        fetchAuctionItems();
        showModal('Успех', 'Подарок куплен!');
    } else {
        showModal('Ошибка', result.error);
    }
}

        async function attemptSellGift(giftId, refundAmount, giftEmoji, giftName){
            showModal(
                'Продать подарок?', 
                `Вы уверены, что хотите продать один <strong>${giftEmoji} ${giftName}</strong> за <strong>${refundAmount} ⚡</strong>?`, 
                true, 
                async () => {
                    const result = await apiRequest('sell_gift', { gift_id: giftId });
                    if (result.success) {
                hideCaptcha();
                        currentUser.stars = result.new_stars;
                        // Обновляем инвентарь
                        if (currentUser.gifts && currentUser.gifts[giftId]) {
                            delete currentUser.gifts[giftId];
                        }
                        
                        showModal('Продано!', `Вы продали ${giftEmoji} ${giftName}. Баланс: ${result.new_stars} ⚡.`, false, () => {
                            renderProfileView();
                        });
                    } else {
                        showModal('Ошибка продажи', result.error || 'Не удалось продать подарок.');
                    }
                }
            );
        }

        function confirmClearChat() {
            showModal(
                'Очистить Общий Чат?', 
                'Вы уверены, что хотите **полностью** очистить историю Общего Чата? Это действие **необратимо**.', 
                true, 
                clearGeneralChat
            );
        }

        async function clearGeneralChat() {
            const result = await apiRequest('clear_general_chat');
            if (result.success) {
                hideCaptcha();
                showModal('Успех', `Общий чат очищен. Удалено сообщений: ${result.count}.`, false, () => {
                    if (currentChatData.chatId === 'general') {
                         fetchMessages(currentChatData.chatId, true);
                    }
                });
            } else {
                showModal('Ошибка', result.error || 'Не удалось очистить чат. Возможно, вы не модератор.');
            }
        }

        let currentScreen = 'loading';
        let currentChatData = {};


        /* =========================================================
           UI LANGUAGE (RU/EN)
           Key: vox_ui_lang
           ========================================================= */
        const UI_LANG_KEY = 'vox_ui_lang';
        function getUiLang(){
            return (localStorage.getItem(UI_LANG_KEY) || 'ru');
        }
        function setUiLang(lang){
            const v = 'ru';
            localStorage.setItem(UI_LANG_KEY, v);
            applyI18n();
            try{ switchScreen(currentScreen || 'chats_list'); }catch(e){}
        }
        const I18N = {
            en: {
                'Чаты':'Chats',
                'Новый':'New',
                'Уведом.':'Notif.',
                'Друзья':'Friends',
                'Новости':'News',
                'Заметки':'Notes',
                'Избран.':'Saved',
                'Каналы/Гр.':'Channels/Groups',
                'Магазин':'Shop',
                'Профиль':'Profile',
                'Настр.':'Settings',
                'Админка':'Admin',
                'Настройки':'Settings',
                'Язык':'Language',
                'Поиск по чатам…':'Search chats…',
                'Сообщение...':'Message…',
                'Покинуть':'Leave',
                'Написать':'Message',
                'Вступить':'Join',
                'Нет рекомендаций':'No recommendations',
                'Топ пуст':'Top is empty',
                'участников':'members',
                'Вы не состоите в каналах.':'You are not in any channels.',
                'Вы не состоите в группах.':'You are not in any groups.',
                'S-Society':'S-Society',
                '➕ Канал/Группа':'➕ Channel/Group',
                'Создать канал/группу':'Create channel/group',
                '📢 Канал':'📢 Channel',
                '👥 Группа':'👥 Group',
                'Название канала (Только Латинские буквы)':'Channel name (Latin letters only)',
                'Название группы (Только Латинские буквы)':'Group name (Latin letters only)',
                'Описание (необязательно)':'Description (optional)',
                'Поиск: название, ссылка или @username':'Search: name, link, or @username',
                'Поиск:':'Search:',
                'Плейлист':'Playlist',
                'Отправить':'Send',
                'Удалить':'Delete',
                'Отмена':'Cancel',
                'Закрыть':'Close',
                'Создать':'Create',
                'Поиск':'Search',

            }
        };
        function t(str){
            const lang = getUiLang();
            if (lang === 'en' && I18N.en[str]) return I18N.en[str];
            return str;
        }
function __storeOrig(el, prop, val){
            const key = 'i18nOrig' + prop;
            if (el.dataset && el.dataset[key] === undefined){
                el.dataset[key] = val ?? '';
            }
        }
        function __restoreOrig(el, prop){
            const key = 'i18nOrig' + prop;
            if (el.dataset && el.dataset[key] !== undefined){
                return el.dataset[key];
            }
            return null;
        }
        function __translateStr(s){
            const lang = getUiLang();
            if (!s) return s;
            if (lang === 'en' && I18N.en[s]) return I18N.en[s];
            return s;
        }
        function applyAutoI18n(root=document.body){
            const lang = getUiLang();
            const skipSel = [
                '#messages', '.messages', '.tg-msg-list', '.chat-messages', '.message', '.tg-bubble',
                '.chat-item-title', '.channel-item h3', '.channel-item p.username', '.community-name',
                '[data-no-i18n]'
            ];
            const shouldSkip = (el) => {
                for (const s of skipSel){
                    try{ if (el.closest && el.closest(s)) return true; }catch(e){}
                }
                return false;
            };

            // Translate/restore placeholders, titles, aria-labels
            root.querySelectorAll('*').forEach(el=>{
                if (shouldSkip(el)) return;

                // placeholder
                if (typeof el.placeholder === 'string' && el.placeholder.length){
                    if (lang === 'en'){
                        __storeOrig(el, 'Placeholder', el.placeholder);
                        el.placeholder = __translateStr(el.placeholder);
                    } else {
                        const o = __restoreOrig(el, 'Placeholder');
                        if (o !== null) el.placeholder = o;
                    }
                }
                // title
                if (typeof el.title === 'string' && el.title.length){
                    if (lang === 'en'){
                        __storeOrig(el, 'Title', el.title);
                        el.title = __translateStr(el.title);
                    } else {
                        const o = __restoreOrig(el, 'Title');
                        if (o !== null) el.title = o;
                    }
                }
                // aria-label
                const aria = el.getAttribute && el.getAttribute('aria-label');
                if (aria){
                    if (lang === 'en'){
                        __storeOrig(el, 'Aria', aria);
                        el.setAttribute('aria-label', __translateStr(aria));
                    } else {
                        const o = __restoreOrig(el, 'Aria');
                        if (o !== null) el.setAttribute('aria-label', o);
                    }
                }

                // Translate simple text nodes on leaf elements only
                if (el.childElementCount === 0 && el.textContent){
                    const raw = el.textContent;
                    const trimmed = raw.trim();
                    if (!trimmed) return;

                    if (lang === 'en'){
                        if (I18N.en[trimmed]){
                            __storeOrig(el, 'Text', raw);
                            // Preserve surrounding whitespace
                            const lead = raw.match(/^\s*/)?.[0] || '';
                            const tail = raw.match(/\s*$/)?.[0] || '';
                            el.textContent = lead + I18N.en[trimmed] + tail;
                        }
                    } else {
                        const o = __restoreOrig(el, 'Text');
                        if (o !== null) el.textContent = o;
                    }
                }
            });
        }

        function applyI18n(){
            const lang = getUiLang();
            const navCfg = {
                chats_list: {ru:{txt:'Чаты', title:'Чаты'}, en:{txt:'Chats', title:'Chats'}},
                add_chat: {ru:{txt:'Новый', title:'Новый чат'}, en:{txt:'New', title:'New chat'}},
                notifications: {ru:{txt:'Уведом.', title:'Уведомления'}, en:{txt:'Notif.', title:'Notifications'}},
                friends: {ru:{txt:'Друзья', title:'Друзья'}, en:{txt:'Friends', title:'Friends'}},
                news: {ru:{txt:'Новости', title:'Новости'}, en:{txt:'News', title:'News'}},
                notes: {ru:{txt:'Заметки', title:'Заметки (локально)'}, en:{txt:'Notes', title:'Notes (local)'}},
                favorites: {ru:{txt:'Избран.', title:'Избранные сообщения'}, en:{txt:'Saved', title:'Saved messages'}},
                channels_groups: {ru:{txt:'Каналы/Гр.', title:'Каналы/Группы'}, en:{txt:'Ch/Groups', title:'Channels/Groups'}},
                shop: {ru:{txt:'Магазин', title:'Магазин'}, en:{txt:'Shop', title:'Shop'}},
                profile: {ru:{txt:'Профиль', title:'Профиль'}, en:{txt:'Profile', title:'Profile'}},
                settings: {ru:{txt:'Настр.', title:'Настройки'}, en:{txt:'Settings', title:'Settings'}},
                admin_panel: {ru:{txt:'Админка', title:'Админ-панель'}, en:{txt:'Admin', title:'Admin panel'}}
            };
            document.querySelectorAll('#desktop-sidebar .tg-side-item').forEach(btn=>{
                const key = btn.getAttribute('data-nav');
                const cfg = navCfg[key];
                if (!cfg) return;
                const v = cfg.ru;
                const txtEl = btn.querySelector('.tg-side-txt');
                if (txtEl) txtEl.textContent = v.txt;
                btn.title = v.title;
            });
        
            // Auto-translate all UI text except message contents / chat & community names
            try{ applyAutoI18n(document.getElementById('screen-container') || document.body); }catch(e){}
            try{ applyAutoI18n(document.getElementById('custom-modal') || document.body); }catch(e){}
        }

        
        /* =========================================================
           NOTES (ПК): локальные заметки на устройстве (localStorage)
           Ключ: vox_notes_v1
           ========================================================= */
        const NOTES_STORAGE_KEY = 'vox_notes_v1';
        let __notes_loaded = false;
        let notesState = { items: [], activeId: null };

        function loadNotesState(){
            try{
                const raw = localStorage.getItem(NOTES_STORAGE_KEY);
                if (raw){
                    const parsed = JSON.parse(raw);
                    if (parsed && Array.isArray(parsed.items)){
                        notesState.items = parsed.items;
                        notesState.activeId = parsed.activeId || (parsed.items[0] && parsed.items[0].id) || null;
                        return;
                    }
                }
            }catch(e){ console.warn('Notes load failed', e); }
            // Default note
            const id = 'n_' + Date.now();
            notesState.items = [{ id, title: 'Моя заметка', body: '', updated: Date.now() }];
            notesState.activeId = id;
            saveNotesState();
        }

        function saveNotesState(){
            try{
                localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify({
                    items: notesState.items,
                    activeId: notesState.activeId
                }));
            }catch(e){ console.warn('Notes save failed', e); }
        }

        

        function downloadTextFileToDownloads(text, filename, mime = 'text/plain'){
            try{
                const blob = new Blob([text], { type: mime + ';charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                setTimeout(() => URL.revokeObjectURL(url), 1500);
                return true;
            }catch(e){
                console.warn('Download failed', e);
                return false;
            }
        }

        
        function exportNotesToDownloads(){
            ensureNotesLoaded();
            const now = new Date();
            const notes = [...(notesState.items || [])].sort((a,b) => (b.updated||0) - (a.updated||0));
            const exportedAt = now.toLocaleString('ru-RU', { year:'numeric', month:'long', day:'2-digit', hour:'2-digit', minute:'2-digit' });

            const safe = (s) => String(s ?? '').replace(/\r/g, '');
            const slugify = (s) => safe(s).toLowerCase()
                .replace(/[^a-z0-9а-яё\s-]/gi,'')
                .trim()
                .replace(/\s+/g,'-')
                .replace(/-+/g,'-');

            let md = '';
            md += `# 📝 Заметки SuperChat\n\n`;
            md += `**Экспорт:** ${exportedAt}\n\n`;
            md += `**Всего заметок:** ${notes.length}\n\n`;
            md += `---\n\n`;

            if (notes.length){
                md += `## 📚 Содержание\n`;
                notes.forEach((n, i) => {
                    const title = safe(n.title || `Заметка ${i+1}`) || `Заметка ${i+1}`;
                    const anchor = slugify(`note-${i+1}-${title}`);
                    md += `- [${title}](#${anchor})\n`;
                });
                md += `\n---\n\n`;
            } else {
                md += `_Пока нет заметок._\n\n`;
            }

            notes.forEach((n, i) => {
                const title = safe(n.title || `Заметка ${i+1}`) || `Заметка ${i+1}`;
                const anchor = slugify(`note-${i+1}-${title}`);
                const upd = n.updated ? new Date(n.updated).toLocaleString('ru-RU', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' }) : '';
                md += `## ${i+1}. ${title}\n`;
                md += `<a id="${anchor}"></a>\n\n`;
                if (upd) md += `*Обновлено:* ${upd}\n\n`;
                const body = safe(n.body || '').trim();
                md += body ? `${body}\n\n` : `_Пусто_\n\n`;
                md += `---\n\n`;
            });

            const fname = `SuperChat_notes_${now.toISOString().slice(0,10)}.md`;
            const ok = downloadTextFileToDownloads(md, fname, 'text/markdown');
            if (!ok){
                showModal('Ошибка', 'Не удалось сохранить заметки на устройство. Попробуйте другой браузер/устройство.');
            }
        }


function ensureNotesLoaded(){
            if (__notes_loaded) return;
            __notes_loaded = true;
            loadNotesState();
        }

        function getActiveNote(){
            return notesState.items.find(n => n.id === notesState.activeId) || null;
        }

        function fmtNoteTime(ts){
            try{
                const d = new Date(ts);
                return d.toLocaleString(undefined, { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' });
            }catch(e){ return ''; }
        }

        function setNotesTab(tab){
            const root = document.getElementById('notes_view');
            if (!root) return;
            root.dataset.tab = tab;
            root.querySelectorAll('[data-notes-tab]').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-notes-tab') === tab);
            });
        }

        function renderNotesView(){
            ensureNotesLoaded();

            const container = document.getElementById('screen-container');
            container.innerHTML = `
                <div id="notes_view" class="screen-content pc-notes-root" data-tab="list">
                    <div class="pc-notes-mobile-tabs" role="tablist" aria-label="Заметки: вкладки">
                        <button class="pc-notes-tab active" data-notes-tab="list" type="button">Список</button>
                        <button class="pc-notes-tab" data-notes-tab="edit" type="button">Редактор</button>
                    </div>

                    <div class="pc-notes-shell">
                        <div class="pc-notes-pane pc-notes-pane-list">
                            <div class="pc-notes-head">
                                <div class="pc-notes-title">Заметки</div>
                                <div class="pc-notes-actions">
                                    <button class="pc-notes-btn" id="pc-note-add" title="Новая заметка" type="button">➕</button>
                                    <button class="pc-notes-btn" id="pc-note-del" title="Удалить" type="button">🗑️</button>
                                    <button class="pc-notes-btn" data-note-export="1" title="Скачать заметки (в Загрузки)" type="button">⬇️</button>
                                </div>
                            </div>
                            <div style="padding:10px;">
                                <input id="pc-note-search" class="pc-notes-search" placeholder="Поиск по заметкам…">
                            </div>
                            <div class="pc-notes-list" id="pc-notes-list"></div>
                        </div>

                        <div class="pc-notes-pane pc-notes-pane-editor">
                            <div class="pc-notes-head">
                                <div class="pc-notes-title">Редактор</div>
                                <div class="pc-notes-actions">
                                    <button class="pc-notes-btn" id="pc-note-clear" title="Очистить текст" type="button">🧽</button>
                                    <button class="pc-notes-btn" data-note-export="1" title="Скачать заметки (в Загрузки)" type="button">⬇️</button>
                                </div>
                            </div>
                            <div class="pc-notes-editor">
                                <input id="pc-note-title" class="pc-note-title" placeholder="Название заметки">
                                <textarea id="pc-note-body" class="pc-note-body" placeholder="Пиши тут… (сохраняется автоматически на устройстве)"></textarea>
                                <div class="pc-note-hint">Хранится локально в браузере/приложении (localStorage). Очистка данных устройства удалит заметки.</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            const root = document.getElementById('notes_view');
            if (root){
                root.querySelectorAll('[data-notes-tab]').forEach(btn => {
                    btn.onclick = () => setNotesTab(btn.getAttribute('data-notes-tab'));
                });
                setNotesTab('list');
            }

            // Wire actions
            const addBtn = document.getElementById('pc-note-add');
            const delBtn = document.getElementById('pc-note-del');
            const clearBtn = document.getElementById('pc-note-clear');
            const searchEl = document.getElementById('pc-note-search');

                        const exportBtns = root ? root.querySelectorAll('[data-note-export]') : [];
if (addBtn) addBtn.onclick = () => pcAddNote();
            if (delBtn) delBtn.onclick = () => pcDeleteActiveNote();
            if (clearBtn) clearBtn.onclick = () => {
                const a = getActiveNote();
                if (!a) return;
                a.body = '';
                a.updated = Date.now();
                saveNotesState();
                pcRenderActiveNote();
                pcRenderNotesList(searchEl ? searchEl.value : '');
            };
            if (searchEl) searchEl.oninput = () => pcRenderNotesList(searchEl.value);

            
            if (exportBtns && exportBtns.length){
                exportBtns.forEach(b => b.onclick = () => exportNotesToDownloads());
            }
pcRenderNotesList('');
            pcRenderActiveNote();
        }

        function pcRenderNotesList(filter=''){
            const list = document.getElementById('pc-notes-list');
            if (!list) return;

            const q = (filter || '').trim().toLowerCase();
            const items = [...notesState.items].sort((a,b) => (b.updated||0) - (a.updated||0))
                .filter(n => !q || (n.title||'').toLowerCase().includes(q) || (n.body||'').toLowerCase().includes(q));

            if (items.length === 0){
                list.innerHTML = `<div style="padding:14px; color: var(--pc-muted);">Ничего не найдено.</div>`;
                return;
            }

            list.innerHTML = items.map(n => {
                const snippet = (n.body || '').replace(/\s+/g,' ').trim().slice(0, 64);
                const active = (n.id === notesState.activeId) ? 'active' : '';
                return `
                    <div class="pc-note-item ${active}" data-note-id="${n.id}">
                        <div class="t">${escapeHtml(n.title || 'Без названия')}</div>
                        <div class="s">${escapeHtml(snippet || '—')} • ${fmtNoteTime(n.updated || Date.now())}</div>
                    </div>
                `;
            }).join('');

            list.querySelectorAll('[data-note-id]').forEach(el => {
                el.onclick = () => {
                    notesState.activeId = el.getAttribute('data-note-id');
                    saveNotesState();
                    pcRenderNotesList(filter);
                    pcRenderActiveNote();
                    // Mobile: jump to editor
                    if (document.documentElement.dataset.layout !== 'desktop'){
                        setNotesTab('edit');
                    }
                };
            });
        }

        let __notes_save_t = null;
        function pcRenderActiveNote(){
            const tEl = document.getElementById('pc-note-title');
            const bEl = document.getElementById('pc-note-body');
            if (!tEl || !bEl) return;

            const note = getActiveNote();
            if (!note){
                tEl.value = '';
                bEl.value = '';
                tEl.disabled = true;
                bEl.disabled = true;
                return;
            }

            tEl.disabled = false;
            bEl.disabled = false;

            tEl.value = note.title || '';
            bEl.value = note.body || '';

            tEl.oninput = () => {
                note.title = tEl.value;
                note.updated = Date.now();
                saveNotesState();
                pcRenderNotesList((document.getElementById('pc-note-search')||{}).value || '');
            };

            bEl.oninput = () => {
                note.body = bEl.value;
                note.updated = Date.now();
                clearTimeout(__notes_save_t);
                __notes_save_t = setTimeout(() => {
                    saveNotesState();
                    pcRenderNotesList((document.getElementById('pc-note-search')||{}).value || '');
                }, 250);
            };
        }

        function pcAddNote(){
            const id = 'n_' + Date.now();
            const title = 'Новая заметка';
            notesState.items.push({ id, title, body: '', updated: Date.now() });
            notesState.activeId = id;
            saveNotesState();
            const searchEl = document.getElementById('pc-note-search');
            if (searchEl) searchEl.value = '';
            pcRenderNotesList('');
            pcRenderActiveNote();
            if (document.documentElement.dataset.layout !== 'desktop'){
                setNotesTab('edit');
            }
            // focus
            setTimeout(() => {
                const titleEl = document.getElementById('pc-note-title');
                if (titleEl) titleEl.focus();
            }, 0);
        }

        function pcDeleteActiveNote(){
            const note = getActiveNote();
            if (!note) return;
            showModal('Удалить заметку?', `Удалить “<strong>${escapeHtml(note.title || 'Без названия')}</strong>”?`, true, () => {
                notesState.items = notesState.items.filter(n => n.id !== note.id);
                if (notesState.items.length === 0){
                    const id = 'n_' + Date.now();
                    notesState.items = [{ id, title: 'Моя заметка', body: '', updated: Date.now() }];
                    notesState.activeId = id;
                }else{
                    notesState.activeId = notesState.items[0].id;
                }
                saveNotesState();
                pcRenderNotesList((document.getElementById('pc-note-search')||{}).value || '');
                pcRenderActiveNote();
            });
        }


        /* =========================================================
           FAVORITES (Избранные): локально на устройстве (localStorage)
           Ключ: vox_favorites_v1
           ========================================================= */
        const FAVORITES_STORAGE_KEY = 'vox_favorites_v1';
        let __favorites_loaded = false;
        let favoritesState = { items: [] };

        window.__messagesCache = window.__messagesCache || {};
        window.__pendingFavJump = null;

        function ensureFavoritesLoaded(){
            if (__favorites_loaded) return;
            __favorites_loaded = true;
            loadFavoritesState();
        }

        function loadFavoritesState(){
            try{
                const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
                if (raw){
                    const parsed = JSON.parse(raw);
                    if (parsed && Array.isArray(parsed.items)){
                        favoritesState.items = parsed.items;
                        return;
                    }
                }
            }catch(e){ console.warn('Favorites load failed', e); }
            favoritesState.items = [];
            saveFavoritesState();
        }

        function saveFavoritesState(){
            try{
                localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify({ items: favoritesState.items }));
            }catch(e){ console.warn('Favorites save failed', e); }
        }

        function favKey(chatId, msgId){
            return `${String(chatId)}::${String(msgId)}`;
        }

        function isFavoriteMessage(chatId, msgId){
            ensureFavoritesLoaded();
            const k = favKey(chatId, msgId);
            return favoritesState.items.some(it => (it && it.key) === k);
        }

        function normalizeFavFromMessage(chatId, msg){
            const chatIdStr = String(chatId);
            const msgId = (msg && (msg.id ?? msg.message_id ?? msg.msg_id ?? msg.mid)) ?? null;
            if (msgId === null) return null;

            let chatName = (currentChatData && currentChatData.chatId && String(currentChatData.chatId) === chatIdStr && currentChatData.chatName)
                ? currentChatData.chatName
                : null;
            if (!chatName && Array.isArray(window.chatsData)){
                const c = window.chatsData.find(x => String(x.id) === chatIdStr);
                if (c) chatName = c.name || c.title || null;
            }
            chatName = chatName || `Чат ${chatIdStr}`;

            const isOutgoing = (currentUser && msg.sender_id === currentUser.id);
            const senderName = isOutgoing ? 'Вы' : (msg.sender_name || 'Пользователь');

            let text = '';
            if (msg.type === 'photo') text = '🖼️ Фото';
            else if (msg.type === 'audio') text = `🎵 Аудио: ${msg.file_name || 'MP3'}`;
            else if (msg.type === 'file') text = `📄 Файл: ${msg.file_name || 'Файл'}`;
            else if (msg.type === 'security') text = `🔐 ${msg.content || ''}`;
            else text = msg.content || '';

            return {
                key: favKey(chatIdStr, msgId),
                chatId: chatIdStr,
                chatName,
                msgId: String(msgId),
                type: msg.type || 'text',
                senderId: msg.sender_id || '',
                senderName,
                timestamp: msg.timestamp ? Number(msg.timestamp) : null,
                addedAt: Date.now(),
                text: String(text || ''),
                file_path: msg.file_path || '',
                file_name: msg.file_name || '',
                note: ''
            };
        }

        function toggleFavoriteMessage(chatId, msgId){
            ensureFavoritesLoaded();
            const chatIdStr = String(chatId);
            const msgIdStr = String(msgId);
            const k = favKey(chatIdStr, msgIdStr);

            const idx = favoritesState.items.findIndex(it => it && it.key === k);
            if (idx >= 0){
                favoritesState.items.splice(idx, 1);
                saveFavoritesState();
                return { added:false };
            }

            let msg = null;
            try{
                const cache = window.__messagesCache && window.__messagesCache[chatIdStr];
                if (Array.isArray(cache)){
                    msg = cache.find(m => String((m && (m.id ?? m.message_id ?? m.msg_id ?? m.mid)) ?? '') === msgIdStr) || null;
                }
            }catch(e){}

            const item = msg ? normalizeFavFromMessage(chatIdStr, msg) : ({
                key: k,
                chatId: chatIdStr,
                chatName: `Чат ${chatIdStr}`,
                msgId: msgIdStr,
                type: 'text',
                senderId: '',
                senderName: '',
                timestamp: null,
                addedAt: Date.now(),
                text: '',
                file_path: '',
                file_name: '',
                note: ''
            });

            favoritesState.items.unshift(item);
            if (favoritesState.items.length > 1000) favoritesState.items.length = 1000;
            saveFavoritesState();
            return { added:true };
        }

        function updateFavButtonsForMessage(chatId, msgId){
            try{
                const on = isFavoriteMessage(chatId, msgId);
                const esc = (s) => (window.CSS && CSS.escape) ? CSS.escape(String(s)) : String(s);
                document.querySelectorAll(`[data-fav-btn][data-chat-id="${esc(chatId)}"][data-msg-id="${esc(msgId)}"]`).forEach(btn => {
                    btn.classList.toggle('is-fav', on);
                    btn.textContent = on ? '⭐' : '☆';
                    btn.title = on ? 'Убрать из избранного' : 'В избранное';
                });
            }catch(e){}
        }

        document.addEventListener('click', (e) => {
            const btn = e.target && e.target.closest ? e.target.closest('[data-fav-btn]') : null;
            if (!btn) return;
            e.preventDefault();
            e.stopPropagation();
            const chatId = btn.getAttribute('data-chat-id') || currentChatId;
            const msgId = btn.getAttribute('data-msg-id');
            if (!chatId || !msgId) return;
            toggleFavoriteMessage(chatId, msgId);
            updateFavButtonsForMessage(chatId, msgId);
            if (currentScreen === 'favorites'){
                try{ renderFavoritesList(); }catch(e){}
            }
        }, { passive:false });

        function showTextEditorModal(title, placeholder, initialValue, onSave){
            const modal = document.getElementById('custom-modal');
            const msgEl = document.getElementById('modal-message');
            document.getElementById('modal-title').textContent = title;

            msgEl.innerHTML = `
                <div class="text-left">
                    <textarea id="modal-textarea" class="input-field" style="min-height:140px; resize: vertical;" placeholder="${escapeHtml(placeholder || '')}"></textarea>
                    <div class="text-xs text-slate-400 mt-2">Сохраняется локально на устройстве.</div>
                </div>
            `;

            const ta = msgEl.querySelector('#modal-textarea');
            if (ta) ta.value = initialValue || '';

            const okBtn = document.getElementById('modal-ok-button');
            okBtn.classList.remove('hidden');
            okBtn.textContent = 'Сохранить';
            okBtn.onclick = () => {
                modal.classList.add('hidden');
                const val = ta ? ta.value : '';
                if (onSave) onSave(String(val || ''));
            };

            document.getElementById('modal-confirm-buttons').classList.add('hidden');
            modal.classList.remove('hidden');
            setTimeout(() => { try{ ta && ta.focus(); }catch(e){} }, 60);
        }

        function openFavorite(chatId, msgId){
            const chatIdStr = String(chatId);
            const msgIdStr = String(msgId);
            window.__pendingFavJump = { chatId: chatIdStr, msgId: msgIdStr };

            let c = null;
            try{
                if (Array.isArray(window.chatsData)) c = window.chatsData.find(x => String(x.id) === chatIdStr) || null;
            }catch(e){}

            if (c){
                switchScreen('chat_view', {
                    chatId: c.id,
                    chatName: c.name,
                    chatType: c.type,
                    interlocutorId: c.other_id,
                    interlocutorAvatar: c.avatar
                });
            } else {
                switchScreen('chat_view', { chatId: chatIdStr });
            }
        }

        function jumpToMessage(msgId){
            try{
                const esc = (s) => (window.CSS && CSS.escape) ? CSS.escape(String(s)) : String(s);
                const el = document.querySelector(`.message-bubble[data-msg-id="${esc(msgId)}"]`) || document.querySelector(`[data-msg-id="${esc(msgId)}"]`);
                if (!el) return;
                el.scrollIntoView({ block: 'center', behavior: 'smooth' });
                el.classList.add('msg-highlight');
                setTimeout(() => { try{ el.classList.remove('msg-highlight'); }catch(e){} }, 2200);
            }catch(e){}
        }

        function exportFavoritesToDownloads(){
            ensureFavoritesLoaded();
            const now = new Date();
            const exportedAt = now.toLocaleString('ru-RU', { year:'numeric', month:'long', day:'2-digit', hour:'2-digit', minute:'2-digit' });

            const items = [...(favoritesState.items || [])].sort((a,b) => (b.addedAt||0) - (a.addedAt||0));
            const safe = (s) => String(s ?? '').replace(/\r/g, '');

            let md = '';
            md += `# 🔖 Избранные сообщения SuperChat\n\n`;
            md += `**Экспорт:** ${exportedAt}\n\n`;
            md += `**Всего:** ${items.length}\n\n`;
            md += `---\n\n`;

            if (!items.length){
                md += `_Пока нет избранных сообщений._\n`;
            } else {
                const byChat = new Map();
                items.forEach(it => {
                    const k = `${it.chatName || 'Чат'} (ID: ${it.chatId})`;
                    if (!byChat.has(k)) byChat.set(k, []);
                    byChat.get(k).push(it);
                });

                for (const [chatLabel, arr] of byChat.entries()){
                    md += `## 💬 ${safe(chatLabel)}\n\n`;
                    arr.forEach((it, i) => {
                        const time = it.timestamp ? new Date(Number(it.timestamp) * 1000).toLocaleString('ru-RU', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' }) : '';
                        const head = `${it.senderName || ''}${time ? ' — ' + time : ''}`.trim();
                        md += `### ${i+1}. ${safe(head || 'Сообщение')}\n\n`;
                        if (it.type && it.type !== 'text') md += `*Тип:* \`${safe(it.type)}\`\n\n`;
                        if (it.file_name || it.file_path){
                            const fileLine = it.file_name ? safe(it.file_name) : safe(it.file_path);
                            md += `*Файл:* ${fileLine}\n\n`;
                        }
                        if (it.msgId) md += `*ID сообщения:* \`${safe(it.msgId)}\`\n\n`;
                        const text = safe(it.text || '').trim();
                        md += text ? `${text}\n\n` : `_Пусто_\n\n`;
                        if (it.note && String(it.note).trim()){
                            md += `> 📝 **Заметка:** ${safe(it.note).trim().replace(/\n/g,'\n> ')}\n\n`;
                        }
                        md += `---\n\n`;
                    });
                }
            }

            const fname = `SuperChat_favorites_${now.toISOString().slice(0,10)}.md`;
            const ok = downloadTextFileToDownloads(md, fname, 'text/markdown');
            if (!ok){
                showModal('Ошибка', 'Не удалось сохранить избранное на устройство. Попробуйте другой браузер/устройство.');
            }
        }

        function renderFavoritesView(){
            ensureFavoritesLoaded();
            const container = document.getElementById('screen-container');
            container.innerHTML = `
                <div id="favorites_view" class="screen-content favs-root">
                    <div class="favs-head">
                        <div class="favs-title">Избранное</div>
                        <div class="favs-actions">
                            <button class="favs-btn" id="fav-export" title="Скачать в Markdown (.md)">⬇️</button>
                            <button class="favs-btn" id="fav-clear" title="Очистить избранное">🗑️</button>
                        </div>
                    </div>

                    <div class="favs-toolbar">
                        <input id="fav-search" class="favs-search" placeholder="Поиск по избранному…">
                        <select id="fav-chat-filter" class="favs-select" title="Фильтр по чату"></select>
                    </div>

                    <div id="favs-list" class="favs-list"></div>
                </div>
            `;

            const search = document.getElementById('fav-search');
            const filter = document.getElementById('fav-chat-filter');
            const exportBtn = document.getElementById('fav-export');
            const clearBtn = document.getElementById('fav-clear');

            if (exportBtn) exportBtn.onclick = () => exportFavoritesToDownloads();
            if (clearBtn) clearBtn.onclick = () => {
                showModal('Очистить избранное?', 'Удалить все избранные сообщения с этого устройства?', true, () => {
                    favoritesState.items = [];
                    saveFavoritesState();
                    renderFavoritesList();
                });
            };

            if (search) search.oninput = () => renderFavoritesList();
            if (filter) filter.onchange = () => renderFavoritesList();

            const chats = new Map();
            (favoritesState.items || []).forEach(it => {
                const id = String(it.chatId || '');
                const name = String(it.chatName || `Чат ${id}`);
                if (id) chats.set(id, name);
            });

            if (filter){
                const opts = [`<option value="">Все чаты</option>`];
                for (const [id, name] of chats.entries()){
                    opts.push(`<option value="${escapeHtml(id)}">${escapeHtml(name)}</option>`);
                }
                filter.innerHTML = opts.join('');
            }

            renderFavoritesList();
        }

        function renderFavoritesList(){
            ensureFavoritesLoaded();
            const list = document.getElementById('favs-list');
            if (!list) return;

            const q = (document.getElementById('fav-search')?.value || '').toLowerCase().trim();
            const chatFilter = (document.getElementById('fav-chat-filter')?.value || '').trim();

            let items = [...(favoritesState.items || [])].sort((a,b) => (b.addedAt||0) - (a.addedAt||0));
            if (chatFilter) items = items.filter(it => String(it.chatId) === String(chatFilter));
            if (q){
                items = items.filter(it => {
                    const hay = `${it.chatName||''} ${it.senderName||''} ${it.text||''} ${it.note||''}`.toLowerCase();
                    return hay.includes(q);
                });
            }

            if (!items.length){
                list.innerHTML = `<div class="text-slate-400 text-center py-10">Нет избранных сообщений.</div>`;
                return;
            }

            list.innerHTML = items.map(it => {
                const time = it.timestamp ? new Date(Number(it.timestamp) * 1000).toLocaleString('ru-RU', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '';
                const sub = `${it.senderName || ''}${time ? ' • ' + time : ''}`.trim();
                const body = escapeHtml(String(it.text || '')).replace(/\n/g,'<br>');
                const note = (it.note && String(it.note).trim())
                    ? `<div class="fav-note">📝 ${escapeHtml(String(it.note)).replace(/\n/g,'<br>')}</div>`
                    : '';
                const safeChat = String(it.chatId).replace(/'/g,"\\'");
                const safeMsg = String(it.msgId).replace(/'/g,"\\'");
                return `
                    <div class="fav-card" data-fav-item="1" data-chat-id="${escapeHtml(String(it.chatId))}" data-msg-id="${escapeHtml(String(it.msgId))}">
                        <div class="fav-meta">
                            <div class="fav-meta-left">
                                <div class="fav-chat">${escapeHtml(String(it.chatName || 'Чат'))}</div>
                                <div class="fav-sub">${escapeHtml(sub || '')}</div>
                            </div>
                            <div class="fav-actions">
                                <button class="fav-mini" title="Открыть сообщение" onclick="openFavorite('${safeChat}', '${safeMsg}')">↗️</button>
                                <button class="fav-mini" title="Заметка" onclick="editFavoriteNote('${safeChat}', '${safeMsg}')">📝</button>
                                <button class="fav-mini" title="Удалить" onclick="removeFavorite('${safeChat}', '${safeMsg}')">🗑️</button>
                            </div>
                        </div>
                        <div class="fav-body">${body || '<span class="text-slate-400">Пусто</span>'}</div>
                        ${note}
                    </div>
                `;
            }).join('');
        }

        function removeFavorite(chatId, msgId){
            ensureFavoritesLoaded();
            const k = favKey(String(chatId), String(msgId));
            const idx = favoritesState.items.findIndex(it => it && it.key === k);
            if (idx >= 0){
                favoritesState.items.splice(idx, 1);
                saveFavoritesState();
                updateFavButtonsForMessage(chatId, msgId);
                if (currentScreen === 'favorites') renderFavoritesList();
            }
        }

        function editFavoriteNote(chatId, msgId){
            ensureFavoritesLoaded();
            const k = favKey(String(chatId), String(msgId));
            const it = favoritesState.items.find(x => x && x.key === k) || null;
            if (!it){
                showModal('Ошибка', 'Не удалось найти это сообщение в избранном.');
                return;
            }
            showTextEditorModal('Заметка к избранному', 'Напиши комментарий к этому сообщению…', it.note || '', (val) => {
                it.note = String(val || '').trim();
                saveFavoritesState();
                if (currentScreen === 'favorites') renderFavoritesList();
            });
        }


        
        // =========================================================
        // Friends (друзья): requests + management
        // =========================================================
        let friendsCache = { friends: [], incoming: [], outgoing: [] };
        let friendsTab = 'friends';
        let friendsSearchTimer = null;

        async function fetchFriendsCache(){
            const res = await apiRequest('get_friends', {});
            if (res && res.success){
                hideCaptcha();
                friendsCache = {
                    friends: Array.isArray(res.friends) ? res.friends : [],
                    incoming: Array.isArray(res.incoming) ? res.incoming : [],
                    outgoing: Array.isArray(res.outgoing) ? res.outgoing : []
                };
                return true;
            }
            return false;
        }

        function renderFriendsView(){
            const container = document.getElementById('screen-container');
            container.innerHTML = `
                <div id="friends_view" class="p-4 flex flex-col h-full overflow-y-auto">
                    <div class="flex items-center p-3 bg-slate-900 shadow-md flex-shrink-0 mb-4">
                        <button onclick="switchScreen('chats_list')" class="text-primary text-xl mr-3">←</button>
                        <h2 class="text-2xl font-bold">Друзья</h2>
                        <div class="flex-grow"></div>
                        <button class="secondary-button text-sm" onclick="refreshFriendsScreen()" title="Обновить">⟳</button>
                    </div>

                    <div class="card mb-4 tg-tinted-surface">
                        <div class="flex gap-2 mb-3">
                            <button id="friends-tab-friends" class="secondary-button px-3 py-2" onclick="setFriendsTab('friends')">👥 Друзья</button>
                            <button id="friends-tab-requests" class="secondary-button px-3 py-2" onclick="setFriendsTab('requests')">📥 Запросы <span id="friends-req-badge" class="ml-1" style="opacity:.8"></span></button>
                            <div class="flex-grow"></div>
                        </div>
                        <div class="flex flex-col gap-2">
                            <input id="friends-search" class="input-field" placeholder="Поиск пользователей (для запроса в друзья)…" maxlength="50" oninput="onFriendsSearchInput(this.value)">
                            <div id="friends-search-results" class="hidden"></div>
                            <p class="text-xs text-slate-400">Запрос можно отправить из личного чата через ⋯ или через поиск здесь.</p>
                        </div>
                    </div>

                    <div id="friends-content" class="space-y-2"></div>
                </div>
            `;

            setFriendsTab(friendsTab || 'friends');
            refreshFriendsScreen();
        }

        async function refreshFriendsScreen(){
            const ok = await fetchFriendsCache();
            if (!ok){
                showModal('Ошибка', 'Не удалось загрузить список друзей');
                return;
            }
            updateFriendsBadges();
            renderFriendsContent();
        }

        function updateFriendsBadges(){
            const badge = document.getElementById('friends-req-badge');
            const n = (friendsCache.incoming?.length||0) + (friendsCache.outgoing?.length||0);
            if (badge){
                badge.textContent = n ? `(${n})` : '';
            }
        }

        function setFriendsTab(tab){
            friendsTab = tab;
            const b1 = document.getElementById('friends-tab-friends');
            const b2 = document.getElementById('friends-tab-requests');
            if (b1) b1.classList.toggle('is-active', tab==='friends');
            if (b2) b2.classList.toggle('is-active', tab==='requests');
            renderFriendsContent();
        }

        function renderFriendRow(u, actionsHtml){
            const name = escapeHtml(u.name || u.username || 'Пользователь');
            const username = u.username ? '@' + escapeHtml(u.username) : '';
            const av = escapeHtml(u.avatar_url || u.avatar || '/default-avatar.png');
            return `
              <div class="settings-item flex items-center justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  <img src="${av}" class="w-11 h-11 rounded-full object-cover flex-shrink-0" alt="">
                  <div class="min-w-0">
                    <div class="font-bold truncate">${name}</div>
                    <div class="text-sm text-slate-400 truncate">${username}</div>
                  </div>
                </div>
                <div class="flex gap-2 flex-shrink-0">${actionsHtml||''}</div>
              </div>
            `;
        }

        function renderFriendsContent(){
            const box = document.getElementById('friends-content');
            if (!box) return;

            if (friendsTab === 'requests'){
                const incoming = friendsCache.incoming || [];
                const outgoing = friendsCache.outgoing || [];
                const parts = [];

                parts.push(`<div class="text-sm text-slate-400 mb-2">Входящие</div>`);
                if (!incoming.length){
                    parts.push(`<div class="text-slate-500 text-center py-4">Нет входящих запросов</div>`);
                } else {
                    parts.push(incoming.map(u => renderFriendRow(u, `
                        <button class="primary-button px-3 py-2" onclick="acceptFriendRequest('${String(u.id).replace(/'/g,"\\'")}')">Принять</button>
                        <button class="secondary-button px-3 py-2" onclick="declineFriendRequest('${String(u.id).replace(/'/g,"\\'")}')">Отклонить</button>
                    `)).join(''));
                }

                parts.push(`<div class="text-sm text-slate-400 mt-5 mb-2">Исходящие</div>`);
                if (!outgoing.length){
                    parts.push(`<div class="text-slate-500 text-center py-4">Нет исходящих запросов</div>`);
                } else {
                    parts.push(outgoing.map(u => renderFriendRow(u, `
                        <button class="secondary-button px-3 py-2" onclick="cancelFriendRequest('${String(u.id).replace(/'/g,"\\'")}')">Отменить</button>
                    `)).join(''));
                }

                box.innerHTML = parts.join('');
                return;
            }

            const list = friendsCache.friends || [];
            if (!list.length){
                box.innerHTML = `<div class="text-slate-500 text-center py-8">Друзей пока нет.</div>`;
                return;
            }

            box.innerHTML = list.map(u => renderFriendRow(u, `
                <button class="secondary-button px-3 py-2" onclick="openChatWithUser('${String(u.id).replace(/'/g,"\\'")}')">Чат</button>
                <button class="secondary-button px-3 py-2" onclick="removeFriend('${String(u.id).replace(/'/g,"\\'")}')">Удалить</button>
            `)).join('');
        }

        async function openChatWithUser(userId){
            try{
                const found = (chatsData || []).find(c => c.type==='private' && (c.interlocutor_id===userId || c.interlocutorId===userId));
                if (found){
                    openChat(found.id, found.name, 'private', userId, found.avatar || found.interlocutor_avatar || '/default-avatar.png', false);
                    return;
                }
            }catch(e){}

            const res = await apiRequest('create_chat', { target_user_id: userId });
            if (res && res.success){
                hideCaptcha();
                await fetchChats();
                const chatId = res.chat_id;
                const chat = (chatsData || []).find(c => c.id === chatId);
                openChat(chatId, (chat?.name||'Чат'), 'private', userId, chat?.avatar||chat?.avatar_url||'/default-avatar.png', false);
            } else {
                showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось открыть чат');
            }
        }

        async function sendFriendRequest(targetUserId){
            const res = await apiRequest('send_friend_request', { target_user_id: targetUserId });
            if (res && res.success){
                hideCaptcha();
                await refreshFriendsScreen();
                return true;
            }
            showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось отправить запрос');
            return false;
        }

        async function cancelFriendRequest(targetUserId){
            const res = await apiRequest('cancel_friend_request', { target_user_id: targetUserId });
            if (res && res.success){
                hideCaptcha();
                await refreshFriendsScreen();
                return true;
            }
            showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось отменить запрос');
            return false;
        }

        async function acceptFriendRequest(fromUserId){
            const res = await apiRequest('accept_friend_request', { from_user_id: fromUserId });
            if (res && res.success){
                hideCaptcha();
                await refreshFriendsScreen();
                return true;
            }
            showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось принять запрос');
            return false;
        }

        async function declineFriendRequest(fromUserId){
            const res = await apiRequest('decline_friend_request', { from_user_id: fromUserId });
            if (res && res.success){
                hideCaptcha();
                await refreshFriendsScreen();
                return true;
            }
            showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось отклонить запрос');
            return false;
        }

        async function removeFriend(friendUserId){
            showModal('Удалить из друзей?', 'Пользователь будет удалён из друзей.', true, async () => {
                const res = await apiRequest('remove_friend', { friend_user_id: friendUserId });
                if (res && res.success){
                    hideCaptcha();
                    await refreshFriendsScreen();
                } else {
                    showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось удалить');
                }
            });
        }

        async function onFriendsSearchInput(val){
            const q = String(val||'').trim();
            const box = document.getElementById('friends-search-results');
            if (!box) return;
            if (friendsSearchTimer) clearTimeout(friendsSearchTimer);
            if (q.length < 2){
                box.classList.add('hidden');
                box.innerHTML = '';
                return;
            }
            friendsSearchTimer = setTimeout(async () => {
                const res = await apiRequest('search_users', { query: q });
                if (!res || !res.success){
                    box.classList.add('hidden');
                    return;
                }
                const users = Array.isArray(res.users) ? res.users.slice(0, 20) : [];
                if (!users.length){
                    box.classList.remove('hidden');
                    box.innerHTML = `<div class="text-slate-500 text-sm p-2">Никого не найдено</div>`;
                    return;
                }
                box.classList.remove('hidden');
                box.innerHTML = users.map(u => {
                    const uid = String(u.id||'').replace(/'/g, "\\'");
                    return renderFriendRow({ id: u.id, name: u.name, username: u.username, avatar: u.avatar_url || u.avatar }, `
                        <button class="primary-button px-3 py-2" onclick="sendFriendRequest('${uid}')">Добавить</button>
                    `);
                }).join('');
            }, 250);
        }
function renderAndAnimateNewScreen(screenName, data) {
            if (screenName === 'welcome') {
                renderWelcomeScreen();
            } else if (screenName === 'setup') {
                renderSetupScreen();
            } else if (screenName === 'chats_list') {
                renderChatsList();
            } else if (screenName === 'chat_view') {
                renderChatView(data);
            } else if (screenName === 'profile') {
                renderProfileView();
            } else if (screenName === 'edit_profile') {
                renderEditProfileView();
            } else if (screenName === 'shop') {
                renderShopView();
            } else if (screenName === 'add_chat') {
                renderAddChatView();
            } else if (screenName === 'gift_search') {
                renderSearchUsersView('gift_search', data);
            } else if (screenName === 'notifications') {
                renderNotificationsView();
            } else if (screenName === 'news') {
                renderNewsView();
            } else if (screenName === 'channels_groups') {
                renderChannelsGroupsView();
            } else if (screenName === 'notes') {
                renderNotesView();
            } else if (screenName === 'favorites') {
                renderFavoritesView();
            } else if (screenName === 'friends') {
                renderFriendsView();
            } else if (screenName === 'settings') {
                renderSettingsView();
            } else if (screenName === 'admin_panel') {
                renderAdminPanelView();
            }
            
            const newScreenEl = document.getElementById('screen-container').firstElementChild;
            if (newScreenEl) {
                 newScreenEl.classList.add('screen-enter-start');
                 void newScreenEl.offsetWidth; 
                 newScreenEl.classList.remove('screen-enter-start');
                 newScreenEl.classList.add('screen-enter-end');
            }

            if (screenName === 'chats_list') {
                fetchChats();
            } else if (screenName === 'chat_view') {
                fetchMessages(currentChatId, true);
                // фоновый поллинг без модалок при кратких сетевых сбоях
                messagesPollInterval = setInterval(() => fetchMessages(currentChatId, false, { silent:true }), chatPollRate);
            } else if (screenName === 'notifications') {
                fetchNotifications();
            } else if (screenName === 'news') {
                fetchNews();
            } else if (screenName === 'channels_groups') {
                fetchChannels();
                fetchGroups();
            }
        }

function filterGifts() {
    const query = document.getElementById('gift-search-input').value.toLowerCase().trim();
    const giftsContainer = document.getElementById('gifts-inventory');
    
    if (!giftsContainer) return;
    
    // Создаем временный контейнер для поиска по данным currentUser.gifts
    const filteredHtml = renderGiftsInventory(currentUser.gifts, query);
    giftsContainer.innerHTML = filteredHtml;
}

        
        // =========================================================
        // Responsive Telegram-like shell (mobile vs desktop)
        // =========================================================
        const ROOT_SCREENS = new Set(['chats_list','notifications','friends','news','channels_groups','shop','notes','favorites','profile','settings']);
        let lastRootScreen = 'chats_list';
        let currentLayout = null;

        function isMobileLayout(){
            try{
                return window.matchMedia('(max-width: 900px), (hover: none) and (pointer: coarse)').matches;
            }catch(e){
                return window.innerWidth <= 900;
            }
        }

        function applyLayoutMode(){
            const layout = isMobileLayout() ? 'mobile' : 'desktop';
            if (layout === currentLayout) return;
            currentLayout = layout;
            document.documentElement.dataset.layout = layout;
        }

        function normalizeNavTarget(screenName){
            if (screenName === 'music_hub') return 'chats_list';
            if (screenName === 'chat_view') return 'chats_list';
            if (screenName === 'edit_profile') return 'profile';
            if (screenName === 'gift_search') return 'shop';
            return screenName;
        }

        function setActiveNav(screenName){
            const target = normalizeNavTarget(screenName);
            document.querySelectorAll('[data-nav].active').forEach(el => el.classList.remove('active'));
            document.querySelectorAll(`[data-nav="${target}"]`).forEach(el => el.classList.add('active'));
        }

        function setTopbarTitle(screenName){
            if (screenName === 'music_hub') screenName = 'chats_list';
            const titles = {
                chats_list: 'Чаты',
                add_chat: 'Новый чат',
                notifications: 'Уведомления',
                news: 'Новости',
                channels_groups: 'Каналы / группы',
                shop: 'Магазин',
                profile: 'Профиль',
                settings: 'Настройки',
                friends: 'Друзья',
                notes: 'Заметки',
                favorites: 'Избранное',
                gift_search: 'Магазин',
                edit_profile: 'Профиль'
            };
            const titleEl = document.getElementById('tg-title');
            if (titleEl) titleEl.textContent = titles[screenName] || 'Super Chat';
        }

        function openDrawer(){
            // Ensure we show real, актуальные данные в шторке
            document.body.classList.add('tg-drawer-open');
            try{
                if (!currentUser || !currentUser.id){
                    Promise.resolve(fetchCurrentUser())
                      .then(() => { try{ updateDrawerProfile(); } catch(e){} })
                      .catch(() => { try{ updateDrawerProfile(); } catch(e){} });
                } else {
                    try{ updateDrawerProfile(); } catch(e){}
                }
            }catch(e){
                try{ updateDrawerProfile(); } catch(e){}
            }
        }
        function closeDrawer(){
            document.body.classList.remove('tg-drawer-open');
        }

        function updateDrawerProfile(){
            const avatar = document.getElementById('tg-drawer-avatar');
            const nameEl = document.getElementById('tg-drawer-name');
            const userEl = document.getElementById('tg-drawer-username');
            const starsEl = document.getElementById('tg-drawer-stars');

            if (!avatar || !nameEl || !userEl || !starsEl) return;

            const u = currentUser || {};
            // Имя: показываем то, что реально есть (без "Гость" и "@username")
            const safeName = String((u.name || u.display_name || u.full_name || u.email || u.phone || '')).trim();
            nameEl.textContent = safeName || 'Пользователь';

            // Username: если нет — показываем ID (или скрываем строку)
            const safeUser = String((u.username || u.login || '')).trim();
            if (safeUser){
                userEl.textContent = '@' + safeUser;
                userEl.classList.remove('hidden');
            } else if (u.id !== null && u.id !== undefined){
                userEl.textContent = 'ID: ' + u.id;
                userEl.classList.remove('hidden');
            } else {
                userEl.textContent = '';
                userEl.classList.add('hidden');
            }

            avatar.src = u.avatar || '/default-avatar.png';

            const stars = typeof u.stars === 'number' ? u.stars : (u.balance_stars ?? null);
            if (stars === null || stars === undefined){
                starsEl.classList.add('hidden');
            }else{
                starsEl.textContent = `⚡ ${stars}`;
                starsEl.classList.remove('hidden');
            }
        }

        function updateShellForScreen(screenName){
            applyLayoutMode();
            document.body.setAttribute('data-screen', screenName);

            const isAuth = ['welcome', 'setup'].includes(screenName);

            const topbar = document.getElementById('tg-topbar');
            const sidebar = document.getElementById('desktop-sidebar');
            const tabBar = document.getElementById('tab-bar');

            if (tabBar) tabBar.style.display = 'none'; // always off (we replaced it)

            // Desktop sidebar only when logged in screens
            if (sidebar){
                const showSidebar = (!isAuth) && (document.documentElement.dataset.layout === 'desktop');
                sidebar.classList.toggle('hidden', !showSidebar);
            }

            // Mobile topbar only on mobile and not auth screens
            if (topbar){
                const showTopbar = (!isAuth) && (document.documentElement.dataset.layout === 'mobile') && (screenName !== 'chat_view');
                topbar.classList.toggle('hidden', !showTopbar);
            }

            // Topbar nav button: hamburger on root screens, back arrow on deep screens
            const navBtn = document.getElementById('tg-nav-btn');
            if (navBtn){
                if (ROOT_SCREENS.has(screenName)){
                    navBtn.innerHTML = '<svg class="tg-svg tg-svg--burger" aria-hidden="true"><use href="#ico-burger"></use></svg>';
                    navBtn.onclick = () => openDrawer();
                }else{
                    navBtn.innerHTML = '<span class="tg-back" aria-hidden="true">←</span>';
                    navBtn.onclick = () => switchScreen(lastRootScreen || 'chats_list');
                }
            }

            setTopbarTitle(screenName);
            setActiveNav(screenName);

            // Close drawer on screen change
            closeDrawer();
        }

        function initShellEvents(){
            // Drawer item click → navigation
            const drawer = document.getElementById('tg-drawer');
            if (drawer){
                drawer.addEventListener('click', (e) => {
                    const item = e.target.closest('[data-nav]');
                    if (!item) return;
                    const target = item.getAttribute('data-nav');
                    closeDrawer();
                    switchScreen(target);
                });
            }

            // Desktop sidebar navigation
            const sidebar = document.getElementById('desktop-sidebar');
            if (sidebar){
                sidebar.addEventListener('click', (e) => {
                    const item = e.target.closest('[data-nav]');
                    if (!item) return;
                    switchScreen(item.getAttribute('data-nav'));
                });
            }

            // FAB
            const fab = document.getElementById('tg-fab');
            if (fab){
                fab.addEventListener('click', () => switchScreen('add_chat'));
            }

            // Close drawer on ESC
            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') closeDrawer();
            });

            // Apply layout on resize/orientation
            let t = null;
            const onResize = () => {
                clearTimeout(t);
                t = setTimeout(() => {
                    applyLayoutMode();
                    updateShellForScreen(currentScreen || 'welcome');
                }, 120);
            };
            window.addEventListener('resize', onResize);
            window.addEventListener('orientationchange', onResize);

            applyLayoutMode();
        }

function buildScreenState(screenName, data = {}) {
            return {
                screen: screenName,
                data: data || {},
                chatId: (data && data.chatId) ? data.chatId : null,
                t: Date.now()
            };
        }

        function switchScreen(screenName, data = {}, options = {}) {
            if (messagesPollInterval) {
                clearInterval(messagesPollInterval);
                messagesPollInterval = null;
            }


            if (ROOT_SCREENS.has(screenName)) {
                lastRootScreen = screenName;
            }

            if (screenName !== 'admin_panel') setAdminScrollUnlocked(false);
            updateShellForScreen(screenName);

            const navState = buildScreenState(screenName, data);
            const shouldWriteHistory = !options.fromHistory;
            try {
                if (shouldWriteHistory) {
                    if (!window.__screenHistoryBootstrapped) {
                        history.replaceState(navState, document.title);
                        window.__screenHistoryBootstrapped = true;
                    } else {
                        history.pushState(navState, document.title);
                    }
                }
            } catch(e) {}

            const currentScreenEl = document.getElementById('screen-container').firstElementChild;
            const previousScreen = currentScreen;
            currentScreen = screenName;
            currentChatId = data.chatId || null;
            currentChatData = data;
            const navToken = (window.__screenNavToken = (window.__screenNavToken || 0) + 1);

            const renderTarget = () => {
                if (navToken !== window.__screenNavToken) return;
                document.getElementById('screen-container').innerHTML = '';
                renderAndAnimateNewScreen(screenName, data);
            };

            if (currentScreenEl && !['welcome', 'setup'].includes(previousScreen) && !options.instant) {
                currentScreenEl.classList.add('screen-leave-end');
                setTimeout(renderTarget, 220);
            } else {
                renderTarget();
            }

            setTimeout(() => {
                if (navToken !== window.__screenNavToken) return;
                const hasContent = !!document.getElementById('screen-container').firstElementChild;
                if (!hasContent) renderTarget();
            }, 420);
        }

        window.addEventListener('popstate', (event) => {
            const st = event.state || null;
            if (!st || !st.screen) {
                switchScreen(lastRootScreen || 'chats_list', {}, { fromHistory: true, instant: true });
                return;
            }
            switchScreen(st.screen, st.data || {}, { fromHistory: true, instant: true });
        });

        async function fetchCurrentUser() {
            const authResult = await apiRequest('get_current_user');
            if (authResult.logged_in) {
                 currentUser = authResult.user;
                 startPresenceHeartbeat();
                 try { applyGlobalEffectTheme(currentUser.active_effect); } catch(e) {}
                 try { updateAdminAccessUI(); } catch(e) {}
            } else {
                 stopPresenceHeartbeat();
            }

        }
        
        async function showUserProfile(userId) {
            // Backward-compatible wrapper (use the main profile modal)
            return showUserProfileModal(userId);
        }

function closeModalIfTarget(event) {
    if (event.target.id === 'profile-modal') {
        document.getElementById('profile-modal').remove();
    }
}

        async function checkAuthAndRoute() {
            const authResult = await apiRequest('get_current_user');
            
            if (authResult.logged_in) {
                currentUser = authResult.user;
                startPresenceHeartbeat();
                try { applyGlobalEffectTheme(currentUser.active_effect); } catch(e) {}
                try { updateDrawerProfile(); } catch(e) {}
                if (authResult.setup_needed) {
                    switchScreen('setup');
                } else {
                    window.__screenHistoryBootstrapped = false;
                    switchScreen('chats_list');
                    // фоновый поллинг уведомлений без модалок при сетевых сбоях
                    notificationsPollInterval = setInterval(() => fetchNotifications(true), notificationsPollRate);
                    handleJoinLinks();
                    // если страница открыта по ссылке на плейлист
                    try { _gpHandlePendingPlaylistOpen(); } catch(e) {}
                }
            } else {
                stopPresenceHeartbeat();
                try { applyGlobalEffectTheme(null); } catch(e) {}
                try { updateAdminAccessUI(); } catch(e) {}
                try { updateDrawerProfile(); } catch(e) {}
                window.__screenHistoryBootstrapped = false;
                switchScreen('welcome');
            }
        }

        document.getElementById('tab-bar').addEventListener('click', (event) => {
            const tabButton = event.target.closest('.tab-button');
            if (tabButton) {
                switchScreen(tabButton.getAttribute('data-tab'));
            }
        });

        initShellEvents();
        checkAuthAndRoute();
        
        // --- ФУНКЦИИ ФАЙЛОВОГО МЕНЕДЖЕРА (ЭТАП 6) ---

        async function addToFileManager(path, name, size, ext) {
            const result = await apiRequest('add_to_file_manager', {
                file_path: path,
                file_name: name,
                file_size: size,
                file_ext: ext
            });
            
            if (result.success) {
                hideCaptcha();
                showModal('Успех', `Файл <strong>${name}</strong> добавлен в ваш файловый менеджер.`);
            } else {
                showModal('Ошибка', result.error || 'Не удалось сохранить файл.');
            }
        }

        async function showFileManager() {
            const result = await apiRequest('get_user_files');
            
            if (!result.success) {
                showModal('Ошибка', 'Не удалось загрузить файлы.');
                return;
            }

            const modal = document.getElementById('custom-modal');
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                if (window.currentUser && currentUser && currentUser.active_effect) {
                    if (currentUser.active_effect && getEffectPalette(currentUser.active_effect)) modalContent.classList.add(`${currentUser.active_effect}-effect-bg`);
                }
            }

            document.getElementById('modal-title').textContent = 'Файловый менеджер';
            
            let html = '';
            
            const packageCardHtml = `<div id="file-manager-packages-panel">${renderPackagesPanelHtml('manager')}</div>`;

            if (result.files.length === 0) {
                html = `<div class="space-y-3">${packageCardHtml}<p class="text-slate-400 text-center py-6">Нет добавленных файлов.</p></div>`;
            } else {
                const fileListJson = encodeURIComponent(JSON.stringify(result.files));
                html = `
                    <div class="space-y-3">
                        <input id="file-manager-search" class="input-field" placeholder="Поиск по имени или расширению" oninput="filterFileManagerList()">
                        <div class="flex flex-wrap gap-2">
                            <button class="primary-button text-sm px-3 py-1" onclick="setFileManagerQuickFilter('all')">Все</button>
                            <button class="primary-button text-sm px-3 py-1 bg-slate-700" onclick="setFileManagerQuickFilter('image')">Изображения</button>
                            <button class="primary-button text-sm px-3 py-1 bg-slate-700" onclick="setFileManagerQuickFilter('audio')">Аудио</button>
                            <button class="primary-button text-sm px-3 py-1 bg-slate-700" onclick="setFileManagerQuickFilter('docs')">Документы</button>
                        </div>
                        <div class="text-xs text-slate-400">Можно быстро отфильтровать и скачать только нужные файлы.</div>
                        ${packageCardHtml}
                        <div id="file-manager-list" class="space-y-2 max-h-96 overflow-y-auto pr-1" data-files="${fileListJson}">`;
                result.files.forEach(file => {
                    const safeName = (file.name || '').replace(/'/g, "\\'");
                    const safePath = (file.path || '').replace(/'/g, "\\'");
                    const dispName = escapeHtml(file.name || '');
                    const dispExt = escapeHtml(file.ext || '');
                    const dispSize = escapeHtml(file.size || '');
                    
                    html += `
                        <div class="flex items-center justify-between tg-tinted-surface p-3 rounded-lg border border-slate-700">
                            <div class="flex items-center overflow-hidden mr-2">
                                <span class="text-xl mr-3">📄</span>
                                <div class="min-w-0">
                                    <p class="font-bold text-sm truncate text-white">${dispName}</p>
                                    <p class="text-xs text-slate-400 uppercase">${dispExt} • ${dispSize}</p>
                                </div>
                            </div>
                            <div class="flex gap-2 flex-shrink-0">
                                <button onclick="confirmDownload('${safePath}', '${file.ext}')" class="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg text-sm">
                                    ⬇️
                                </button>
                                <button onclick="deleteFile('${file.id}')" class="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg text-sm">
                                    🗑️
                                </button>
                            </div>
                        </div>
                    `;
                });
                html += '</div></div>';
                setTimeout(() => { try { window.__fileManagerQuickFilter = 'all'; filterFileManagerList(); } catch(e){} }, 0);
            }

            document.getElementById('modal-message').innerHTML = html;
            
            // Настраиваем кнопки модального окна
            const okBtn = document.getElementById('modal-ok-button');
            okBtn.classList.remove('hidden');
            okBtn.textContent = 'Закрыть';
            okBtn.onclick = () => modal.classList.add('hidden');
            
            document.getElementById('modal-confirm-buttons').classList.add('hidden');
            
            modal.classList.remove('hidden');
        }


        function setFileManagerQuickFilter(mode){
            window.__fileManagerQuickFilter = mode || 'all';
            filterFileManagerList();
        }

        function filterFileManagerList(){
            const list = document.getElementById('file-manager-list');
            if (!list) return;
            let files = [];
            try { files = JSON.parse(decodeURIComponent(list.dataset.files || '[]')); } catch(e) {}
            const q = String(document.getElementById('file-manager-search')?.value || '').trim().toLowerCase();
            const quick = String(window.__fileManagerQuickFilter || 'all');
            const isTypeMatch = (ext) => {
                ext = String(ext || '').toLowerCase();
                if (quick === 'all') return true;
                if (quick === 'image') return ['png','jpg','jpeg','gif','webp','svg'].includes(ext);
                if (quick === 'audio') return ['mp3','ogg','wav','m4a','aac'].includes(ext);
                if (quick === 'docs') return ['pdf','doc','docx','txt','zip','rar'].includes(ext);
                return true;
            };
            const filtered = files.filter(file => {
                const name = String(file.name || '').toLowerCase();
                const ext = String(file.ext || '').toLowerCase();
                if (!isTypeMatch(ext)) return false;
                if (!q) return true;
                return name.includes(q) || ext.includes(q);
            });
            list.innerHTML = filtered.length ? filtered.map(file => {
                const safeName = String(file.name || '').replace(/'/g, "\'");
                const safePath = String(file.path || '').replace(/'/g, "\'");
                const dispName = escapeHtml(file.name || '');
                const dispExt = escapeHtml(file.ext || '');
                const dispSize = escapeHtml(file.size || '');
                return `
                    <div class="flex items-center justify-between tg-tinted-surface p-3 rounded-lg border border-slate-700">
                        <div class="flex items-center overflow-hidden mr-2">
                            <span class="text-xl mr-3">📄</span>
                            <div class="min-w-0">
                                <p class="font-bold text-sm truncate text-white">${dispName}</p>
                                <p class="text-xs text-slate-400 uppercase">${dispExt} • ${dispSize}</p>
                            </div>
                        </div>
                        <div class="flex gap-2 flex-shrink-0">
                            <button onclick="confirmDownload('${safePath}', '${file.ext}')" class="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg text-sm">⬇️</button>
                            <button onclick="deleteFile('${file.id}')" class="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg text-sm">🗑️</button>
                        </div>
                    </div>`;
            }).join('') : '<p class="text-slate-400 text-center py-6">Ничего не найдено по фильтру.</p>';
        }

        function confirmDownload(path, ext) {
            if (!/^\/uploads\//.test(String(path || ''))) {
                showModal('Ошибка', 'Некорректный путь файла');
                return;
            }

            const dangerousExts = ['apk', 'zip', 'exe', 'bat', 'sh'];
            let warningText = 'Вы собираетесь скачать файл.';
            
            if (dangerousExts.includes(ext.toLowerCase())) {
                warningText = `⚠️ <strong>Внимание!</strong> Вы собираетесь скачать файл формата <strong>.${ext}</strong>. <br><br>Вы несете риск при скачивании файла. Вы уверены, что хотите скачать файл, в котором возможно вирус?`;
            }

            // Создаем временное модальное окно для предупреждения
            const warningModalHtml = `
                <div id="download-warning-modal" class="modal" style="z-index: 60;">
                    <div class="modal-content text-center border-2 border-red-500">
                        <div class="text-4xl mb-4">⚠️</div>
                        <h3 class="text-xl font-bold mb-3 text-red-500">Предупреждение о безопасности</h3>
                        <p class="mb-6 text-slate-300">${warningText}</p>
                        
                        <div class="flex flex-col gap-3">
                            <button id="trust-download-btn" class="primary-button bg-red-600 hover:bg-red-700 w-full">
                                Да, я доверяю отправителю!
                            </button>
                            <button onclick="document.getElementById('download-warning-modal').remove()" class="secondary-button w-full">
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', warningModalHtml);
            
            // Удаляем размытие фона основного модального окна, чтобы было видно новое
            document.getElementById('download-warning-modal').classList.remove('hidden');
            
            document.getElementById('trust-download-btn').onclick = () => {
                // Скачивание
                const link = document.createElement('a');
                link.href = path;
                link.download = path.split('/').pop();
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Удаляем окно предупреждения
                document.getElementById('download-warning-modal').remove();
                
                // Закрываем файловый менеджер
                document.getElementById('custom-modal').classList.add('hidden');
            };
        }

        async function deleteFile(fileId) {
            const result = await apiRequest('delete_user_file', { file_id: fileId });
            if (result.success) {
                hideCaptcha();
                // Обновляем список
                showFileManager();
            } else {
                showModal('Ошибка', 'Не удалось удалить файл');
            }
        }
        
        function startEditMessage(msgId, content) {
    editingMessageId = msgId;
    const input = document.getElementById('message-input');
    const form = document.getElementById('message-form');
    const btn = form.querySelector('button[type="submit"]');

    // Декодируем HTML сущности обратно (на всякий случай)
    const txt = document.createElement("textarea");
    txt.innerHTML = content;
    input.value = txt.value;
    
    input.focus();
    form.classList.add('edit-mode-active');
    btn.innerHTML = '✏️'; // Меняем значок кнопки отправки
    
    // Можно добавить кнопку отмены, если нужно, или просто по клику вне
    // Но пока сделаем просто: если юзер сотрет текст и нажмет энтер - ошибка, если просто сотрет - можно сбросить
}

function cancelEditMessage() {
    editingMessageId = null;
    const input = document.getElementById('message-input');
    const form = document.getElementById('message-form');
    const btn = form.querySelector('button[type="submit"]');

    input.value = '';
    form.classList.remove('edit-mode-active');
    btn.innerHTML = '➤';
}



/* =========================================================
   TG-like message actions + reactions + pin
   ========================================================= */
function canPinCurrentChat(){
    if (!currentChatData) return false;
    const t = currentChatData.chatType;
    if (t === 'private') return true;
    if (t === 'general') return !!(currentUser && currentUser.is_moderator);
    if (t === 'channel' || t === 'group') {
        const meta = (Array.isArray(chatsData) ? chatsData.find(c => c.id === currentChatId) : null);
        return !!(meta && meta.is_admin);
    }
    return false;
}

function canDeleteForAll(msg){
    if (!msg || !currentChatData) return false;
    const t = currentChatData.chatType;
    if (t === 'private') return true;
    if (t === 'general') {
        return !!(currentUser && currentUser.is_moderator);
    }
    if (t === 'channel' || t === 'group') {
        const meta = (Array.isArray(chatsData) ? chatsData.find(c => c.id === currentChatId) : null);
        return !!(meta && meta.is_admin);
    }
    return false;
}
function canEditMessage(msg){
    if (!msg || !currentUser) return false;
    if ((msg.sender_id || '') === currentUser.id) return true;
    return !!currentUser.is_moderator;
}

function shortMsgPreview(msg){
    if (!msg) return '';
    if (msg.type === 'photo') return '📷 Фото';
    if (msg.type === 'audio') return '🎵 Музыка';
    if (msg.type === 'video') return '🎬 Видео';
    if (msg.type === 'file') return '📎 Файл';
    const s = String(msg.content || '').replace(/\s+/g,' ').trim();
    return s.length > 80 ? s.slice(0,80) + '…' : s;
}

function renderReactionsRow(message, msgId){
    try{
        if (!message || !message.reactions || typeof message.reactions !== 'object') return '';
        const entries = Object.entries(message.reactions).filter(([k,v]) => Array.isArray(v) && v.length > 0);
        if (!entries.length) return '';
        const pills = entries.map(([emoji, users]) => {
            const count = users.length;
            const active = users.includes(currentUser.id);
            const safeEmoji = escapeHtml(String(emoji));
            return `<button type="button" class="reaction-pill ${active ? 'is-active' : ''}" data-action="reaction-toggle" data-msg-id="${msgId ?? ''}" data-emoji="${safeEmoji}">${safeEmoji} <span class="opacity-80">${count}</span></button>`;
        }).join('');
        return `<div class="msg-reactions" role="group" aria-label="Реакции">${pills}</div>`;
    }catch(e){
        return '';
    }
}

function ensureSheetRoot(){
    let root = document.getElementById('sheet-root');
    if (!root){
        root = document.createElement('div');
        root.id = 'sheet-root';
        document.body.appendChild(root);
    }
    return root;
}

function applyEffectsToEl(el){
    if (!el) return;
    el.classList.remove('lolpol-effect-bg','dragon-effect-bg','phoenix-effect-bg');
    if (currentUser && currentUser.active_effect && getEffectPalette(currentUser.active_effect)) {
        el.classList.add(`${currentUser.active_effect}-effect-bg`);
    }
}

function openSheet(innerHtml){
    const root = ensureSheetRoot();
    root.innerHTML = `
        <div class="sheet-overlay" id="sheet-overlay">
            <div class="sheet" id="sheet-box">${innerHtml}</div>
        </div>
    `;
    const overlay = document.getElementById('sheet-overlay');
    const box = document.getElementById('sheet-box');
    applyEffectsToEl(box);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeSheet();
    });
}

function closeSheet(){
    const root = document.getElementById('sheet-root');
    if (root) root.innerHTML = '';
}

async function toggleReaction(msgId, emoji){
    const res = await apiRequest('toggle_reaction', { chat_id: currentChatId, message_id: msgId, emoji });
    if (res && res.success){
        hideCaptcha();
        // Оптимистично обновляем UI сразу (без ожидания поллинга)
        try{
            const key = String(currentChatId);
            window.__messagesCache = window.__messagesCache || {};
            const msgs = window.__messagesCache[key];
            if (Array.isArray(msgs)){
                const m = msgs.find(x => String(x.id) === String(msgId));
                if (m){
                    if (!m.reactions || typeof m.reactions !== 'object') m.reactions = {};

                    // Telegram-like: у одного пользователя может быть только 1 реакция на сообщение
                    const hadSame = Array.isArray(m.reactions[emoji]) && m.reactions[emoji].includes(currentUser.id);

                    // Снимаем все реакции текущего пользователя
                    for (const [em, users] of Object.entries(m.reactions)) {
                        if (!Array.isArray(users)) continue;
                        const filtered = users.filter(u => u !== currentUser.id);
                        if (filtered.length === 0) delete m.reactions[em];
                        else m.reactions[em] = Array.from(new Set(filtered));
                    }

                    // Если нажали на другую реакцию — ставим её. Если на ту же — просто снимаем.
                    if (!hadSame) {
                        if (!Array.isArray(m.reactions[emoji])) m.reactions[emoji] = [];
                        m.reactions[emoji] = Array.from(new Set([...m.reactions[emoji], currentUser.id]));
                    }
                    m.updated_at = Math.floor(Date.now()/1000);

                    const list = document.getElementById('message-list');
                    const bubble = list ? list.querySelector(`.message-bubble[data-msg-id="${String(msgId)}"]`) : null;
                    const col = bubble ? bubble.closest('.bubble-actions')?.parentElement : null;
                    if (col){
                        const existing = col.querySelector('.msg-reactions');
                        if (existing) existing.remove();
                        const rowHtml = renderReactionsRow(m, msgId);
                        if (rowHtml){
                            const actions = col.querySelector('.bubble-actions');
                            if (actions) actions.insertAdjacentHTML('afterend', rowHtml);
                        }
                    }
                }
            }
        }catch(e){}
        // обновление без модалок (реакция уже поставилась)
        fetchMessages(currentChatId, false, { silent:true, force:true });
    } else {
        showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось поставить реакцию');
    }
}

async function pinMessage(msgId){
    const res = await apiRequest('pin_message', { chat_id: currentChatId, message_id: msgId });
    if (res && res.success){
        hideCaptcha();
        fetchMessages(currentChatId, false, { silent:true, force:true });
    } else showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось закрепить');
}

async function unpinMessage(){
    const res = await apiRequest('unpin_message', { chat_id: currentChatId });
    if (res && res.success){
        hideCaptcha();
        fetchMessages(currentChatId, false, { silent:true, force:true });
    } else showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось открепить');
}

async function deleteForMe(msgId){
    const res = await apiRequest('delete_message_for_me', { chat_id: currentChatId, message_id: msgId });
    if (res && res.success){
        hideCaptcha();
        fetchMessages(currentChatId, false, { silent:true, force:true });
    } else showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось удалить');
}

async function deleteForAll(msgId){
    showModal('Удалить у всех?', 'Сообщение будет удалено у всех участников.', true, async () => {
        const res = await apiRequest('delete_message_for_all', { chat_id: currentChatId, message_id: msgId });
        if (res && res.success){
            hideCaptcha();
            fetchMessages(currentChatId, false, { silent:true, force:true });
        } else showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось удалить');
    });
}


function ensurePcMsgMenuRoot(){
    let root = document.getElementById('pc-msgmenu-root');
    if (!root){
        root = document.createElement('div');
        root.id = 'pc-msgmenu-root';
        document.body.appendChild(root);
    }
    return root;
}

function closePcMsgMenu(){
    const root = document.getElementById('pc-msgmenu-root');
    if (root) root.innerHTML = '';
    document.removeEventListener('pointerdown', __pcMsgMenuOutside, true);
    document.removeEventListener('keydown', __pcMsgMenuEsc, true);
    window.removeEventListener('resize', closePcMsgMenu, true);
    window.removeEventListener('scroll', closePcMsgMenu, true);
}

function __pcMsgMenuOutside(e){
    const menu = document.getElementById('pc-msgmenu');
    if (!menu) return;
    if (!menu.contains(e.target)) closePcMsgMenu();
}

function __pcMsgMenuEsc(e){
    if (e.key === 'Escape') closePcMsgMenu();
}
function openPcMsgMenu(innerHtml, anchorEl){
    const root = ensurePcMsgMenuRoot();
    root.innerHTML = `<div class="pc-msgmenu" id="pc-msgmenu" role="menu">${innerHtml}<div class="pc-close-row"><button class="pc-close" type="button" onclick="closePcMsgMenu()">Закрыть</button></div></div>`;
    const menu = document.getElementById('pc-msgmenu');
    if (!menu) return;
    try{ applyEffectsToEl(menu); }catch(e){}

    requestAnimationFrame(() => {
        const m = document.getElementById('pc-msgmenu');
        if (!m) return;

        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        const pad = 12;

        const rect = anchorEl ? anchorEl.getBoundingClientRect() : {left: vw/2, top: vh/2, right: vw/2, bottom: vh/2, width:0, height:0};

        const isDesktop = (document.documentElement.dataset.layout === 'desktop') && !window.matchMedia('(max-width: 900px)').matches;
        if (!isDesktop){
            m.style.width = Math.min(320, vw - pad*2) + 'px';
        }

        const mw = Math.min(m.offsetWidth || 260, vw - pad*2);
        const mh = Math.min(m.offsetHeight || 220, vh - pad*2);

        const spaceAbove = rect.top - pad;
        const spaceBelow = (vh - rect.bottom) - pad;
        const preferAbove = rect.bottom > vh * 0.62;

        let openAbove;
        if (spaceBelow < mh + 10 && spaceAbove >= mh + 10) openAbove = true;
        else if (spaceAbove < mh + 10 && spaceBelow >= mh + 10) openAbove = false;
        else openAbove = preferAbove;

        let left;
        if (isDesktop){
            left = rect.right + 10;
            if (left + mw > vw - pad) left = rect.left - mw - 10;
        } else {
            left = rect.left + (rect.width||0)/2 - mw/2;
        }

        let top = openAbove ? (rect.top - mh - 10) : (rect.bottom + 10);

        if (!openAbove && (top + mh > vh - pad) && spaceAbove > spaceBelow){
            const alt = rect.top - mh - 10;
            if (alt >= pad) top = alt;
        }
        if (openAbove && (top < pad) && spaceBelow > spaceAbove){
            const alt = rect.bottom + 10;
            if (alt + mh <= vh - pad) top = alt;
        }

        left = Math.max(pad, Math.min(left, vw - mw - pad));
        top = Math.max(pad, Math.min(top, vh - mh - pad));

        m.style.left = left + 'px';
        m.style.top = top + 'px';
    });

    setTimeout(() => {
        document.addEventListener('pointerdown', __pcMsgMenuOutside, true);
        document.addEventListener('keydown', __pcMsgMenuEsc, true);
        window.addEventListener('resize', closePcMsgMenu, true);
        window.addEventListener('scroll', closePcMsgMenu, true);
    }, 0);
}

function startEditMessageFromMenu(msgId){
    try{
        const msgs = (window.__messagesCache && window.__messagesCache[String(currentChatId)]) ? window.__messagesCache[String(currentChatId)] : [];
        const msg = Array.isArray(msgs) ? msgs.find(m => String(m.id) === String(msgId)) : null;
        if (!msg) return;
        // extra UI guard: edit only own message
        if (!currentUser || msg.sender_id !== currentUser.id) return;
        startEditMessage(msgId, msg.content || '');
    }catch(e){}
}

function openMessageActions(msgId){
    try{ closePcMsgMenu(); }catch(e){}
    const msgs = (window.__messagesCache && window.__messagesCache[String(currentChatId)]) ? window.__messagesCache[String(currentChatId)] : [];
    const msg = Array.isArray(msgs) ? msgs.find(m => String(m.id) === String(msgId)) : null;
    if (!msg) return;

    const isOutgoing = msg.sender_id === currentUser.id;
    const pinnedNow = (window.__currentPinned && window.__currentPinned.id) ? (String(window.__currentPinned.id) === String(msgId)) : false;

    const quick = ['👍','❤️','😂','🔥','😢','😡','🎉','👏'];
    const quickRow = `
        <div class="sheet-react">
          ${quick.map(e => `<button class="react-btn" type="button" onclick="toggleReaction('${msgId}','${e.replace(/'/g, "\'")}'); closePcMsgMenu();" aria-label="Реакция ${e}">${e}</button>`).join('')}
        </div>
    `;

    const actions = [];

    // Audio messages: play in global player / add to playlist
    if (msg.type === 'audio' && msg.file_path){
        const safeUrl = String(msg.file_path || '').replace(/\\/g,'/').replace(/'/g, "\\'");
        const safeTitle = String(msg.file_name || msg.content || 'Музыка')
            .replace(/\\/g, "\\\\")
            .replace(/'/g, "\\'")
            .replace(/\r?\n/g, ' ')
            .trim();
        actions.push(`<button class="sheet-btn" type="button" onclick="playGlobalTrack('${safeUrl}','${safeTitle}'); closePcMsgMenu();"><span class="sheet-ico">▶️</span>В плеер</button>`);
        actions.push(`<button class="sheet-btn" type="button" onclick="openAddToPlaylistDialog('${safeUrl}','${safeTitle}'); closePcMsgMenu();"><span class="sheet-ico">➕</span>В плейлист</button>`);
        actions.push(`<button class="sheet-btn" type="button" onclick="addTrackToFavorites('${safeUrl}','${safeTitle}'); closePcMsgMenu();"><span class="sheet-ico"><svg class="tg-svg" aria-hidden="true"><use href="#ico-favorites"></use></svg></span>В любимые</button>`);
    }

    if (canEditMessage(msg) && msg.type === 'text' && (msg.content || '').trim().length){
        actions.push(`<button class="sheet-btn" type="button" onclick="startEditMessageFromMenu('${msgId}'); closePcMsgMenu();"><span class="sheet-ico">✏️</span>Изменить</button>`);
    }

    if (canPinCurrentChat()){
        actions.push(pinnedNow
            ? `<button class="sheet-btn" type="button" onclick="unpinMessage(); closePcMsgMenu();"><span class="sheet-ico">📌</span>Открепить</button>`
            : `<button class="sheet-btn" type="button" onclick="pinMessage('${msgId}'); closePcMsgMenu();"><span class="sheet-ico">📌</span>Закрепить</button>`);
    }

    if (currentChatData && currentChatData.chatType === 'channel'){
        const preview = shortMsgPreview(msg).replace(/\\/g, "\\\\").replace(/'/g, "\'");
        actions.push(`<button class="sheet-btn" type="button" onclick="event.stopPropagation(); openLinkedDiscussionGroup('${currentChatId}','${msgId}','${preview}'); closePcMsgMenu();"><span class="sheet-ico"><svg class="tg-svg comment-ico" aria-hidden="true"><use href="#ico-comments"></use></svg></span>Комментарии</button>`);
    }

    if (String(currentChatId || '') === 'general' && msg.sender_id !== currentUser.id){
        actions.push(`<button class="sheet-btn message-report-action" type="button" onclick="openReportMessageModal('${msgId}'); closePcMsgMenu();"><span class="sheet-ico"><svg class="tg-svg" aria-hidden="true"><use href="#ico-flag"></use></svg></span><span>Пожаловаться</span></button>`);
    }

    actions.push(`<button class="sheet-btn" type="button" onclick="deleteForMe('${msgId}'); closePcMsgMenu();"><span class="sheet-ico">🗑️</span>Удалить у меня</button>`);

    if (canDeleteForAll(msg)){
        actions.push(`<button class="sheet-btn danger" type="button" onclick="deleteForAll('${msgId}'); closePcMsgMenu();"><span class="sheet-ico">🧨</span>Удалить у всех</button>`);
    }

    const inner = `
        <div class="sheet-head">
            <div class="sheet-sub">Сообщение: ${escapeHtml(shortMsgPreview(msg))}</div>
        </div>
        ${quickRow}
        <div class="sheet-actions">${actions.join('')}</div>
    `;

    closeSheet();
    const esc = (window.CSS && CSS.escape) ? CSS.escape(String(msgId)) : String(msgId).replace(/"/g,'\"');
    const anchor = document.querySelector(`.message-bubble[data-action="msg-menu"][data-msg-id="${esc}"]`);
    openPcMsgMenu(inner, anchor);
}


function updatePinnedBar(pinnedMsg){
    const bar = document.getElementById('pinned-bar');
    if (!bar) return;
    window.__currentPinned = pinnedMsg || null;
    if (!pinnedMsg || !pinnedMsg.id){
        bar.classList.add('hidden');
        bar.innerHTML = '';
        return;
    }
    const snippet = escapeHtml(shortMsgPreview(pinnedMsg));
    const canUnpin = canPinCurrentChat();
    bar.classList.remove('hidden');
    bar.innerHTML = `
        <span class="pin-ico">📌</span>
        <div class="min-w-0 flex-1">
          <div class="pin-title">Закреплено</div>
          <div class="pin-snippet">${snippet}</div>
        </div>
        ${canUnpin ? `<button class="pin-x" type="button" onclick="event.stopPropagation(); unpinMessage();" aria-label="Открепить">✕</button>` : ''}
    `;
    applyEffectsToEl(bar);
}

function onPinnedBarClick(e){
    try{
        if (!window.__currentPinned || !window.__currentPinned.id) return;
        jumpToMessage(window.__currentPinned.id);
    }catch(err){}
}

// Делегирование кликов: реакции и меню сообщений
document.addEventListener('click', function(e){
    const r = e.target.closest('[data-action="reaction-toggle"]');
    if (r){
        e.preventDefault();
        e.stopPropagation();
        const mid = r.getAttribute('data-msg-id');
        const emoji = r.getAttribute('data-emoji');
        if (mid && emoji) toggleReaction(mid, emoji);
        return;
    }
    const bubble = e.target.closest('.message-bubble[data-action="msg-menu"][data-msg-id]');
    if (!bubble) return;
    // не открываем панель, если клик по управлению медиа/кнопке/ссылке
    if (e.target.closest('audio,video,button,a,input,textarea')) return;
    e.preventDefault();
    openMessageActions(bubble.getAttribute('data-msg-id'));
});

/* =========================================================
   Private chat menu (⋯): block/unblock + delete chat
   ========================================================= */
let __privateBlockStatus = null;
let __privateFriendStatus = null;

async function refreshPrivateFriendStatus(){
    if (!currentChatData || currentChatData.chatType !== 'private' || !currentChatData.interlocutorId) return;
    const res = await apiRequest('get_friend_status', { target_user_id: currentChatData.interlocutorId });
    if (res && res.success){
        hideCaptcha();
        __privateFriendStatus = res.status || 'none';
    }
}

async function refreshPrivateBlockStatus(){
    if (!currentChatData || currentChatData.chatType !== 'private' || !currentChatData.interlocutorId) return;
    const res = await apiRequest('get_user_block_status', { target_user_id: currentChatData.interlocutorId });
    if (res && res.success){
        hideCaptcha();
        __privateBlockStatus = { blocked_by_me: !!res.blocked_by_me, blocked_me: !!res.blocked_me };
        updatePrivateBlockUI();
    }
}

function updatePrivateBlockUI(){
    const form = document.getElementById('message-form');
    const ta = document.getElementById('message-input');
    if (!form || !ta || !__privateBlockStatus) return;
    const disabled = __privateBlockStatus.blocked_by_me || __privateBlockStatus.blocked_me;
    ta.disabled = disabled;
    const sendBtn = form.querySelector('button[type="submit"]');
    if (sendBtn) sendBtn.disabled = disabled;
    const attachBtn = form.querySelector('.chat-attach-btn');
    if (attachBtn) attachBtn.disabled = disabled;
    const emojiBtn = form.querySelector('.composer-inline-btn');
    if (emojiBtn) emojiBtn.disabled = disabled;
    if (disabled){
        ta.placeholder = __privateBlockStatus.blocked_by_me ? 'Вы заблокировали пользователя' : 'Вы заблокированы';
    } else {
        ta.placeholder = 'Сообщение...';
    }
}

async function openPrivateChatMenu(chatId, otherId, chatName){
    // private-chat options bottom sheet
    await refreshPrivateBlockStatus(otherId);

    // friend status
    let fr = __privateFriendStatus || 'none';
    try{
        const frRes = await apiRequest('get_friend_status', { target_user_id: otherId });
        if (frRes && frRes.success){
            hideCaptcha();
            fr = frRes.status || 'none';
            __privateFriendStatus = fr;
        }
    }catch(e){}

    const st = __privateBlockStatus || { blocked_by_me: false, blocked_me: false };

    const friendBtns = (() => {
        if (st.blocked_by_me || st.blocked_me) return '';
        if (fr === 'friends') return `
            <button class="sheet-btn" type="button" onclick="removeFriendFromMenu('${otherId}'); closeSheet();"><span class="sheet-ico"><svg class="tg-svg" aria-hidden="true"><use href="#ico-user-minus"></use></svg></span>Удалить из друзей</button>
        `;
        if (fr === 'outgoing') return `
            <button class="sheet-btn" type="button" onclick="cancelFriendRequestFromMenu('${otherId}'); closeSheet();"><span class="sheet-ico"><svg class="tg-svg" aria-hidden="true"><use href="#ico-clock"></use></svg></span>Отменить запрос</button>
        `;
        if (fr === 'incoming') return `
            <button class="sheet-btn" type="button" onclick="acceptFriendRequestFromMenu('${otherId}'); closeSheet();"><span class="sheet-ico"><svg class="tg-svg" aria-hidden="true"><use href="#ico-check"></use></svg></span>Принять запрос</button>
            <button class="sheet-btn" type="button" onclick="declineFriendRequestFromMenu('${otherId}'); closeSheet();"><span class="sheet-ico"><svg class="tg-svg" aria-hidden="true"><use href="#ico-x"></use></svg></span>Отклонить запрос</button>
        `;
        return `
            <button class="sheet-btn" type="button" onclick="sendFriendRequestFromMenu('${otherId}'); closeSheet();"><span class="sheet-ico"><svg class="tg-svg" aria-hidden="true"><use href="#ico-user-plus"></use></svg></span>Добавить в друзья</button>
        `;
    })();

    const blockBtn = st.blocked_by_me
        ? `<button class="sheet-btn" type="button" onclick="userUnblock('${otherId}'); closeSheet();"><span class="sheet-ico"><svg class="tg-svg" aria-hidden="true"><use href="#ico-unlock"></use></svg></span>Разблокировать</button>`
        : `<button class="sheet-btn" type="button" onclick="userBlock('${otherId}'); closeSheet();"><span class="sheet-ico"><svg class="tg-svg" aria-hidden="true"><use href="#ico-block"></use></svg></span>Заблокировать</button>`;

    const html = `
        <div class="sheet-head">
            <div class="sheet-title">${escapeHtml(chatName || 'Чат')}</div>
            <div class="sheet-sub">Настройки личного чата</div>
        </div>
        <div class="sheet-actions">
            ${friendBtns}
            <button class="sheet-btn" type="button" onclick="switchScreen('friends'); closeSheet();"><span class="sheet-ico"><svg class="tg-svg" aria-hidden="true"><use href="#ico-users"></use></svg></span>Открыть друзей</button>
            ${blockBtn}
            <button class="sheet-btn danger" type="button" onclick="deleteChat('${chatId}'); closeSheet();"><span class="sheet-ico"><svg class="tg-svg" aria-hidden="true"><use href="#ico-trash"></use></svg></span>Удалить чат</button>
            <button class="sheet-btn" type="button" onclick="closeSheet();"><span class="sheet-ico"><svg class="tg-svg" aria-hidden="true"><use href="#ico-x"></use></svg></span>Закрыть</button>
        </div>
    `;

    openSheet(html);
}

async function userBlock(uid){
    const res = await apiRequest('user_block', { target_user_id: uid });
    if (res && res.success){
        hideCaptcha();
        await refreshPrivateBlockStatus();
    } else showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось заблокировать');
}
async function userUnblock(uid){
    const res = await apiRequest('user_unblock', { target_user_id: uid });
    if (res && res.success){
        hideCaptcha();
        await refreshPrivateBlockStatus();
    } else showModal('Ошибка', (res && res.error) ? res.error : 'Не удалось разблокировать');
}


async function sendFriendRequestFromMenu(uid){
    await sendFriendRequest(uid);
    await refreshPrivateFriendStatus();
}
async function cancelFriendRequestFromMenu(uid){
    await cancelFriendRequest(uid);
    await refreshPrivateFriendStatus();
}
async function acceptFriendRequestFromMenu(uid){
    await acceptFriendRequest(uid);
    await refreshPrivateFriendStatus();
}
async function declineFriendRequestFromMenu(uid){
    await declineFriendRequest(uid);
    await refreshPrivateFriendStatus();
}
async function removeFriendFromMenu(uid){
    const res = await apiRequest('remove_friend', { friend_user_id: uid });
    if (res && res.success) hideCaptcha();
    await refreshPrivateFriendStatus();
}

async function deleteMessageAction(msgId){
    showModal('Удалить сообщение?', 'Вы уверены?', true, async () => {
        const result = await apiRequest('delete_message_for_all', {
            chat_id: currentChatId,
            message_id: msgId
        });
        
        if (result.success) {
                hideCaptcha();
            fetchMessages(currentChatId);
        } else {
            showModal('Ошибка', result.error || 'Не удалось удалить');
        }
    });
}

// --- Логика изменения описания канала ---
        function openEditDescriptionModal(channelId, currentDesc) {
            if (currentDesc === 'Описание отсутствует') currentDesc = '';
            
            document.getElementById('channel-settings-modal').classList.add('hidden');
            const modal = document.getElementById('custom-modal');
            document.getElementById('modal-title').textContent = 'Изменить описание';
            
            document.getElementById('modal-message').innerHTML = `
                <textarea id="new-channel-desc" class="input-field h-32 resize-none" placeholder="Новое описание" maxlength="200">${currentDesc}</textarea>
                <p class="text-xs text-slate-500 mt-1">Максимум 200 символов</p>
            `;

            document.getElementById('modal-ok-button').classList.add('hidden');
            document.getElementById('modal-confirm-buttons').classList.remove('hidden');
            
            document.getElementById('modal-confirm-button').textContent = 'Сохранить';
            document.getElementById('modal-confirm-button').onclick = () => saveChannelDescription(channelId);
            
            document.getElementById('modal-cancel-button').onclick = () => {
                modal.classList.add('hidden');
                document.getElementById('channel-settings-modal').classList.remove('hidden');
            };

            modal.classList.remove('hidden');
        }

        async function saveChannelDescription(channelId) {
            const newDesc = document.getElementById('new-channel-desc').value.trim();
            
            const result = await apiRequest('update_channel_settings', {
                channel_id: channelId,
                new_description: newDesc
            });

            if (result.success) {
                hideCaptcha();
                const ch = channels.find(c => c.id === channelId);
                if (ch) ch.description = newDesc;
                
                document.getElementById('custom-modal').classList.add('hidden');
                
                // Переоткрываем настройки
                const channelName = ch ? ch.name : 'Канал';
                showChannelSettings(channelId, channelName);
                fetchChannels(); // обновляем кэш
            } else {
                showModal('Ошибка', result.error);
            }
        }

        // --- Логика профиля канала (при клике на название) ---
        async function showChannelProfile(channelId) {
            // Загружаем инфо
            const result = await apiRequest('get_channel_info', { channel_id: channelId });
            
            if (result.success) {
                hideCaptcha();
                const info = result.info;
                const modal = document.getElementById('custom-modal');
                
                // Формируем контент
                const inviteLink = `${window.location.origin}${window.location.pathname}?join=channel:${info.username}`;
                
                const isGroupProfile = info.type === 'group';
                document.getElementById('modal-title').textContent = isGroupProfile ? 'Профиль группы' : 'Профиль канала';
                
                document.getElementById('modal-message').innerHTML = `
                    <div class="flex flex-col items-center mb-4">
                        <div class="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center text-4xl mb-3 border-4 border-slate-800 shadow-lg">
                            ${isGroupProfile ? '👥' : '📢'}
                        </div>
                        <h3 class="text-2xl font-bold text-white flex items-center justify-center gap-1"><span>${info.name}</span>${info.is_verified ? verifiedBadgeSvg('xl') : ''}</h3>
                        <p class="text-slate-400">@${info.username}</p>
                    </div>
                    
                    <div class="bg-slate-800 rounded-xl p-4 mb-4 text-left">
                        <h4 class="font-bold text-sm text-slate-500 mb-1 uppercase">Описание</h4>
                        <p class="text-white whitespace-pre-wrap">${info.description || 'Описание отсутствует'}</p>
                    </div>
                    
                    <div class="bg-slate-800 rounded-xl p-4 mb-4 text-left">
                        <h4 class="font-bold text-sm text-slate-500 mb-1 uppercase">Ссылка приглашение</h4>
                        <div class="flex gap-2 mt-2">
                            <input type="text" value="${inviteLink}" readonly class="input-field text-sm text-slate-400 flex-grow" id="profile-invite-link">
                            <button class="primary-button px-3" onclick="copyProfileLink()">📋</button>
                        </div>
                    </div>
                    
                    <p class="text-center text-slate-500 text-sm">👥 Участников: ${info.members_count}</p>
                    ${info.is_admin ? `<button class="secondary-button w-full mt-4" onclick="document.getElementById('custom-modal').classList.add('hidden'); showChannelSettings('${escapeJsString(channelId)}', '${escapeJsString(info.name || '')}')">⚙️ Настройки ${isGroupProfile ? 'группы' : 'канала'}</button>` : ''}
                `;                // Настройка кнопок
                document.getElementById('modal-ok-button').classList.remove('hidden');
                document.getElementById('modal-ok-button').textContent = 'Закрыть';
                document.getElementById('modal-confirm-buttons').classList.add('hidden');
                
                document.getElementById('modal-ok-button').onclick = () => {
                    modal.classList.add('hidden');
                };

                modal.classList.remove('hidden');
            } else {
                showModal('Ошибка', 'Не удалось загрузить информацию о канале.');
            }
        }

        function copyProfileLink() {
            const copyText = document.getElementById("profile-invite-link");
            copyText.select();
            copyText.setSelectionRange(0, 99999);
            
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(copyText.value);
            } else {
                document.execCommand('copy');
            }
            // Визуальная индикация копирования (меняем иконку)
            const btn = document.querySelector('button[onclick="copyProfileLink()"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<svg class="tg-svg" aria-hidden="true"><use href="#ico-check"></use></svg>'; 
            setTimeout(() => btn.innerHTML = originalText, 1500);
        }

        // ========== ADMIN PANEL ==========
        let adminPanelData = {
            stats: { total_users: 0, online_now: 0 },
            users: [],
            banned_users: [],
            can_assign_special: false,
            special_roles: ['project_team', 'special_admin', 'owner1', 'owner2'],
            selected_user_id: null,
            ban_reason: '',
            reports: [],
            role_policies: []
        };


        function adminSvg(name) {
            return `<svg class="tg-svg" aria-hidden="true"><use href="#ico-${name}"></use></svg>`;
        }

        function adminBtnLabel(icon, text) {
            return `${adminSvg(icon)}<span>${text}</span>`;
        }
        function verifiedBadgeSvg(size = '') {
            const cls = size ? ` verify-badge--${size}` : '';
            return `<span class="verify-badge${cls}" title="Верифицировано"><svg class="tg-svg" aria-hidden="true"><use href="#ico-verified"></use></svg></span>`;
        }

        // Проверка, есть ли у пользователя доступ к админ-панели
        function userHasAdminAccess() {
            if (!currentUser) return false;

            const adminRoles = [
                'project_team', 'special_admin', 'owner1', 'owner2',
                'main_admin', 'deputy_admin', 'senior_admin', 'admin',
                'senior_moderator', 'moderator', 'junior_moderator', 'helper'
            ];

            const roleKeys = Array.isArray(currentUser.roles)
                ? currentUser.roles.map(role => {
                    if (!role) return '';
                    if (typeof role === 'string') return role;
                    if (typeof role === 'object') return String(role.key || role.id || role.name || '');
                    return String(role);
                }).filter(Boolean)
                : [];

            return roleKeys.some(roleKey => adminRoles.includes(roleKey)) || !!currentUser.is_moderator;
        }

        function updateAdminAccessUI() {
            document.querySelectorAll('[data-nav="admin_panel"]').forEach(el => {
                const preferredDisplay = el.dataset.adminDisplay || getComputedStyle(el).display || '';
                if (!el.dataset.adminDisplay && preferredDisplay !== 'none') {
                    el.dataset.adminDisplay = preferredDisplay;
                }
                el.style.display = el.dataset.adminDisplay || '';
                el.hidden = false;
                el.setAttribute('aria-hidden', 'false');
            });
            document.querySelectorAll('#profile-view button, #profile-screen button').forEach(el => {
                const handler = String(el.getAttribute('onclick') || '');
                if (handler.includes("switchScreen('admin_panel')")) {
                    const preferredDisplay = el.dataset.adminDisplay || getComputedStyle(el).display || '';
                    if (!el.dataset.adminDisplay && preferredDisplay !== 'none') {
                        el.dataset.adminDisplay = preferredDisplay;
                    }
                    el.style.display = el.dataset.adminDisplay || '';
                    el.hidden = false;
                }
            });
        }

        // Загрузка данных для админ-панели
        async function loadAdminData() {
            console.log('loadAdminData started');
            
            try {
                const statsResult = await apiRequest('admin_stats');
                console.log('API Response:', statsResult);
                
                if (!statsResult.success) {
                    console.error('API Error:', statsResult.error);
                    showModal('Ошибка', statsResult.error || 'Не удалось загрузить статистику');
                    return false;
                }
                
                adminPanelData.stats = {
                    total_users: statsResult.total_users,
                    online_now: statsResult.online_now
                };
                adminPanelData.users = statsResult.users || [];
                adminPanelData.reports = statsResult.reports || [];
                adminPanelData.role_policies = statsResult.role_policies || [];
                adminPanelData.channels = statsResult.channels || [];
                adminPanelData.can_assign_special = !!(currentUser && Array.isArray(currentUser.roles) && currentUser.roles.some(r => ['project_team','special_admin','owner1','owner2'].includes(r.key || r)));
                const bannedResult = await apiRequest('admin_banned');
                adminPanelData.banned_users = (bannedResult && bannedResult.success) ? (bannedResult.banned || []) : [];
                
                console.log('adminPanelData after load:', adminPanelData);
                return true;
                
            } catch (e) {
                console.error('Error in loadAdminData:', e);
                return false;
            }
        }

        function setAdminScrollUnlocked(enabled){
            try{
                const html = document.documentElement;
                const body = document.body;
                const app = document.getElementById('app');
                const appMain = document.getElementById('app-main');
                const screenContainer = document.getElementById('screen-container');
                const adminScreen = document.getElementById('admin_screen_content');
                [html, body, app, appMain].forEach((el) => {
                    if (!el) return;
                    if (enabled){
                        el.classList.add('admin-scroll-unlocked');
                        el.style.overflowY = 'auto';
                        el.style.overflowX = 'hidden';
                        el.style.height = 'auto';
                        el.style.minHeight = '100dvh';
                    } else {
                        el.classList.remove('admin-scroll-unlocked');
                        el.style.overflowY = '';
                        el.style.overflowX = '';
                        el.style.height = '';
                        el.style.minHeight = '';
                    }
                });
                if (screenContainer){
                    screenContainer.classList.toggle('admin-scroll-unlocked', !!enabled);
                    if (enabled){
                        screenContainer.style.position = 'relative';
                        screenContainer.style.display = 'block';
                        screenContainer.style.overflowY = 'auto';
                        screenContainer.style.overflowX = 'hidden';
                        screenContainer.style.height = 'auto';
                        screenContainer.style.minHeight = '100dvh';
                        screenContainer.style.webkitOverflowScrolling = 'touch';
                        screenContainer.scrollTop = 0;
                    } else {
                        screenContainer.style.position = '';
                        screenContainer.style.display = '';
                        screenContainer.style.overflowY = '';
                        screenContainer.style.overflowX = '';
                        screenContainer.style.height = '';
                        screenContainer.style.minHeight = '';
                        screenContainer.style.webkitOverflowScrolling = '';
                    }
                }
                if (adminScreen){
                    adminScreen.classList.toggle('admin-scroll-unlocked', !!enabled);
                    if (enabled){
                        adminScreen.classList.add('admin-screen-root');
                        adminScreen.style.position = 'relative';
                        adminScreen.style.height = 'auto';
                        adminScreen.style.minHeight = '100dvh';
                        adminScreen.style.overflow = 'visible';
                        adminScreen.style.transform = 'none';
                        adminScreen.style.animation = 'none';
                    } else {
                        adminScreen.classList.remove('admin-screen-root');
                        adminScreen.style.position = '';
                        adminScreen.style.height = '';
                        adminScreen.style.minHeight = '';
                        adminScreen.style.overflow = '';
                        adminScreen.style.transform = '';
                        adminScreen.style.animation = '';
                    }
                }
                if (enabled) {
                    requestAnimationFrame(() => {
                        try { window.scrollTo(0,0); } catch(e) {}
                        try { screenContainer && (screenContainer.scrollTop = 0); } catch(e) {}
                    });
                }
            }catch(e){}
        }

        // Основной рендер админ-панели
        async function legacyRenderAdminPanelViewBootstrap() {
            console.log('renderAdminPanelView started');
    
            if (!await loadAdminData()) {
                console.log('loadAdminData failed');
                window.__screenHistoryBootstrapped = false;
                    switchScreen('chats_list');
                return;
            }
            
            console.log('Rendering with data:', adminPanelData);
            
            const html = `
                <div id="admin_panel_view" class="admin-shell">
                    <div class="admin-fixed-shell">
                        <div class="admin-topbar">
                            <button onclick="switchScreen('chats_list')" class="admin-back-btn secondary-button !px-3 !py-2">${adminSvg('chat')}<span>К чатам</span></button>
                            <div class="min-w-0 flex-1">
                                <h2 class="text-2xl font-bold leading-tight">Админ-панель</h2>
                                <div class="text-sm text-slate-400">Модерация, блокировки, жалобы и роли</div>
                            </div>
                        </div>
                        <div class="admin-summary-row">
                            <div class="admin-hero-card">
                                <div class="admin-hero-card__eyebrow">${adminSvg('shield')}<span>Панель управления</span></div>
                                <div class="admin-hero-card__title">Все важные действия — на месте</div>
                                <div class="admin-hero-card__text">Панель переработана для телефона и ПК: без бокового скролла, с нормальной прокруткой и более стабильными карточками.</div>
                            </div>
                            <div class="admin-stat-grid">
                                <div class="admin-stat-card">
                                    <div class="admin-stat-card__icon">${adminSvg('users')}</div>
                                    <div class="admin-stat-copy"><div class="value">${adminPanelData.stats.total_users}</div><div class="label">Всего пользователей</div></div>
                                </div>
                                <div class="admin-stat-card">
                                    <div class="admin-stat-card__icon">${adminSvg('bell')}</div>
                                    <div class="admin-stat-copy"><div class="value">${adminPanelData.stats.online_now}</div><div class="label">Сейчас в мессенджере</div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="admin-tabbar-wrap">
                        <div class="admin-tabbar">
                            <button id="admin-tab-users" class="primary-button admin-tab-btn" onclick="switchAdminTab('users')">${adminBtnLabel('users','Пользователи')}</button>
                            <button id="admin-tab-banned" class="secondary-button admin-tab-btn" onclick="switchAdminTab('banned')">${adminBtnLabel('block','Блокировки')}</button>
                            <button id="admin-tab-reports" class="secondary-button admin-tab-btn" onclick="switchAdminTab('reports')">${adminBtnLabel('note','Жалобы')}</button>
                            <button id="admin-tab-channels" class="secondary-button admin-tab-btn" onclick="switchAdminTab('channels')">${adminBtnLabel('megaphone','Каналы')}</button>
                            <button id="admin-tab-roles" class="secondary-button admin-tab-btn" onclick="switchAdminTab('roles')">${adminBtnLabel('shield','Роли')}</button>
                        </div>
                    </div>
                    <div id="admin-content-container" class="admin-scroll-area"></div>
                </div>
            `;
            
            document.getElementById('screen-container').innerHTML = `<div id="admin_screen_content" class="admin-screen-root admin-scroll-unlocked">${html}</div>`;
            setAdminScrollUnlocked(true);
            
            if (!window.adminReportsSubtab) window.adminReportsSubtab = 'user';
            switchAdminTab('users');
        }

        // Переключение вкладок админ-панели
        function switchAdminTab(tab) {
            const buttons = {
                users: document.getElementById('admin-tab-users'),
                banned: document.getElementById('admin-tab-banned'),
                reports: document.getElementById('admin-tab-reports'),
                channels: document.getElementById('admin-tab-channels'),
                roles: document.getElementById('admin-tab-roles')
            };
            const container = document.getElementById('admin-content-container');
            Object.entries(buttons).forEach(([key, btn]) => { if (btn) btn.className = (key === tab ? 'primary-button admin-tab-btn' : 'secondary-button admin-tab-btn'); });
            if (tab === 'users') return renderUsersTab(container);
            if (tab === 'banned') return renderBannedTab(container);
            if (tab === 'reports') return renderReportsTab(container);
            if (tab === 'channels') return renderChannelsTab(container);
            return renderRolesTab(container);
        }

        // Рендер вкладки с пользователями
        function renderUsersTab(container) {
            const searchHtml = `
                <div class="mb-4 admin-search-wrap">
                    ${adminSvg('search')}
                    <input type="text" id="admin-user-search" placeholder="Поиск по имени или логину" class="input-field" oninput="filterAdminUsers(this.value)">
                </div>
                <div id="admin-users-list" class="space-y-3">
                    ${renderUsersList(adminPanelData.users)}
                </div>
            `;
            container.innerHTML = searchHtml;
        }

        // Фильтрация пользователей
        function filterAdminUsers(query) {
            const q = query.toLowerCase().trim();
            const list = document.getElementById('admin-users-list');
            if (!list) return;
            
            const filtered = q ? adminPanelData.users.filter(u => 
                (u.name || '').toLowerCase().includes(q) || 
                (u.username || '').toLowerCase().includes(q)
            ) : adminPanelData.users;
            
            list.innerHTML = renderUsersList(filtered);
        }

        // Рендер списка пользователей
        function renderUsersList(users) {
            return users.map(u => `
                <button type="button" class="admin-user-card cursor-pointer hover:border-primary transition-all" onclick="selectAdminUser('${u.id}')">
                    <div class="flex items-center">
                        <img src="${u.avatar}" alt="" class="admin-user-avatar">
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2">
                                <span class="font-bold truncate">${escapeHtml(u.name || u.username)}</span>${u.is_verified ? verifiedBadgeSvg() : ''}
                                ${u.online ? '<span class="w-2 h-2 bg-green-500 rounded-full" title="Онлайн"></span>' : ''}
                            </div>
                            <div class="text-sm text-slate-400">@${escapeHtml(u.username)}</div>
                            <div class="text-xs ${u.online ? 'text-green-400' : 'text-slate-500'}">${escapeHtml((u.presence && ((u.presence.status_label || '') + ((u.presence.status_text || '') ? (' • ' + u.presence.status_text) : ''))) || (u.online ? 'в сети' : 'был(а) недавно'))}</div>
                            <div class="flex flex-wrap gap-1 mt-1">
                                ${(u.roles || []).map(r => `
                                    <span class="role-tag role-fx text-xs" style="background: ${r.color_bg || '#6B4F4F'}; color: ${r.color_text || '#FFFFFF'}; padding: 2px 6px;">
                                        ${r.name || r}
                                    </span>
                                `).join('')}
                                ${u.is_moderator ? `<span class="role-tag text-xs bg-blue-600">${adminSvg('shield')}<span class="role-label">Модератор</span></span>` : ''}
                                ${u.muted_until && (u.muted_until * 1000 > Date.now()) ? `<span class="role-tag text-xs bg-amber-600">${adminSvg('bell')}<span class="role-label">Мут</span></span>` : ''}
                            </div>
                        </div>
                        <div class="admin-side-metric ml-2">${adminSvg('bolt')}<span>${u.stars || 0}</span></div>
                    </div>
                </div>
            `).join('');
        }

        // Выбор пользователя для управления
        async function selectAdminUser(userId) {
            const user = adminPanelData.users.find(u => String(u.id) === String(userId));
            if (!user) return;
            const modal = document.getElementById('custom-modal');
            if (!modal) return;
            adminPanelData.selected_user_id = userId;
            const allRoles = [
                { key: 'project_team', name: 'Команда проекта', special: true, legacy_rank: 100 },
                { key: 'special_admin', name: 'Спец Админ', special: true, legacy_rank: 95 },
                { key: 'owner1', name: 'Владелец 1', special: true, legacy_rank: 90 },
                { key: 'owner2', name: 'Владелец 2', special: true, legacy_rank: 89 },
                { key: 'main_admin', name: 'Главный Админ', special: false, legacy_rank: 85 },
                { key: 'deputy_admin', name: 'Зам. Главного Админа', special: false, legacy_rank: 80 },
                { key: 'senior_admin', name: 'Старший Администратор', special: false, legacy_rank: 75 },
                { key: 'admin', name: 'Администратор', special: false, legacy_rank: 70 },
                { key: 'senior_moderator', name: 'Старший модератор', special: false, legacy_rank: 65 },
                { key: 'moderator', name: 'Модератор', special: false, legacy_rank: 60 },
                { key: 'junior_moderator', name: 'Младший модератор', special: false, legacy_rank: 55 },
                { key: 'helper', name: 'Хелпер', special: false, legacy_rank: 50 }
            ];
            const roleKeys = Array.isArray(user.roles) ? user.roles.map(r => (r && typeof r === 'object') ? (r.key || '') : String(r || '')) : [];
            const myRoleKeys = Array.isArray(currentUser?.roles) ? currentUser.roles.map(r => (r && typeof r === 'object') ? (r.key || '') : String(r || '')) : [];
            const myLegacyRank = Math.max(currentUser?.is_moderator ? 58 : 0, ...myRoleKeys.map(k => (allRoles.find(x => x.key === k)?.legacy_rank || 0)));
            const targetLegacyRank = Math.max(user.is_moderator ? 58 : 0, ...roleKeys.map(k => (allRoles.find(x => x.key === k)?.legacy_rank || 0)));
            const canManageTargetUser = myLegacyRank > targetLegacyRank && String(currentUser?.id || '') !== String(user.id || '');
            const rolesHtml = allRoles.map(role => {
                const hasRole = roleKeys.includes(role.key);
                const canTouchRole = canManageTargetUser && myLegacyRank > (role.legacy_rank || 0) && (!role.special || !!adminPanelData.can_assign_special) && !myRoleKeys.includes(role.key);
                const action = hasRole ? 'removerole' : 'setrole';
                const label = hasRole ? 'Снять' : 'Выдать';
                return `
                    <div class="admin-role-row">
                        <div class="min-w-0">
                            <div class="font-semibold text-white">${escapeHtml(role.name)}</div>
                            <div class="text-xs text-slate-400">${escapeHtml(role.key)}</div>
                        </div>
                        <button class="${hasRole ? 'secondary-button' : 'primary-button'} admin-chip-btn text-xs px-3 py-2 ${canTouchRole ? '' : 'admin-role-action disabled'}" onclick="adminAction('${user.id}','${action}','${role.key}')">${label}</button>
                    </div>`;
            }).join('');
            document.getElementById('modal-title').textContent = `Управление: ${escapeHtml(user.name || user.username || 'Пользователь')}`;
            document.getElementById('modal-message').innerHTML = `
                <div class="text-left space-y-4">
                    <div class="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/70 border border-white/10">
                        <img src="${escapeHtml(user.avatar || '/default.png')}" alt="" class="w-14 h-14 rounded-full object-cover">
                        <div class="min-w-0">
                            <div class="font-bold text-lg flex items-center gap-2"><span class="truncate">${escapeHtml(user.name || user.username || 'Пользователь')}</span>${user.is_verified ? verifiedBadgeSvg('lg') : ''}</div>
                            <div class="text-sm text-slate-400 truncate">@${escapeHtml(user.username || 'user')}</div>
                            <div class="text-xs ${user.online ? 'text-green-400' : 'text-slate-500'} mt-1">${escapeHtml((user.presence && ((user.presence.status_label || '') + ((user.presence.status_text || '') ? (' • ' + user.presence.status_text) : ''))) || (user.online ? 'в сети' : 'был(а) недавно'))}</div>
                        </div>
                    </div>
                    <div class="admin-modal-section">
                        <h4 class="admin-modal-title">${adminSvg('shield')}<span>Роли и доступ</span></h4>
                        <div class="space-y-1">${rolesHtml}</div>
                        ${canManageTargetUser ? '' : '<div class="admin-role-hint">Этим аккаунтом нельзя управлять: его ранг не ниже вашего, либо это ваш собственный аккаунт.</div>'}
                    </div>
                    <div class="admin-modal-section">
                        <h4 class="admin-modal-title">${adminSvg('settings')}<span>Модерация</span></h4>
                        <div class="admin-action-grid">
                            <button class="primary-button admin-action-btn text-xs px-3 py-2 ${user.is_moderator ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} ${canManageTargetUser ? '' : 'admin-role-action disabled'}" onclick="adminAction('${user.id}','${user.is_moderator ? 'removeadmin' : 'setadmin'}')">${user.is_moderator ? adminBtnLabel('block','Снять модератора') : adminBtnLabel('check','Сделать модератором')}</button>
                            <button class="primary-button admin-action-btn text-xs px-3 py-2 bg-amber-600 hover:bg-amber-700 ${canManageTargetUser ? '' : 'admin-role-action disabled'}" onclick="showMuteUserModal('${user.id}')">${user.muted_until && (user.muted_until * 1000 > Date.now()) ? adminBtnLabel('bell','Изменить мут') : adminBtnLabel('bell','Выдать мут')}</button>
                            <button class="primary-button admin-action-btn text-xs px-3 py-2 bg-red-600 hover:bg-red-700 ${canManageTargetUser ? '' : 'admin-role-action disabled'}" onclick="showBanUserModal('${user.id}','all')">${adminBtnLabel('block','Блокировка')}</button>
                            <button class="secondary-button admin-action-btn text-xs px-3 py-2 ${canManageTargetUser ? '' : 'admin-role-action disabled'}" onclick="adminAction('${user.id}','warn')">${adminBtnLabel('note','Предупреждение')}</button>
                            <button class="secondary-button admin-action-btn text-xs px-3 py-2 ${canManageTargetUser ? '' : 'admin-role-action disabled'}" onclick="adminAction('${user.id}','${user.is_verified ? 'unverify_user' : 'verify_user'}')">${user.is_verified ? adminBtnLabel('x','Снять галочку') : adminBtnLabel('verified','Выдать галочку')}</button>
                            ${user.muted_until && (user.muted_until * 1000 > Date.now()) ? `<button class="secondary-button admin-action-btn text-xs px-3 py-2 ${canManageTargetUser ? '' : 'admin-role-action disabled'}" onclick="adminAction('${user.id}','unmute')">${adminBtnLabel('check','Снять мут')}</button>` : ''}
                        </div>
                    </div>
                </div>`;
            document.getElementById('modal-ok-button').classList.remove('hidden');
            document.getElementById('modal-ok-button').textContent = 'Готово';
            document.getElementById('modal-confirm-buttons').classList.add('hidden');
            document.getElementById('modal-ok-button').onclick = () => { modal.classList.add('hidden'); };
            modal.classList.remove('hidden');
        }

        // Показать модалку бана с полем для причины
        function showMuteUserModal(userId) {
            const user = adminPanelData.users.find(u => u.id === userId);
            if (!user) return;
            const modal = document.getElementById('custom-modal');
            document.getElementById('modal-title').textContent = `Мут: ${escapeHtml(user.name)}`;
            document.getElementById('modal-message').innerHTML = `
                <div class="text-left space-y-3"> 
                    <div class="text-xs text-slate-400">Мут действует только на Общий чат. Личные сообщения и остальные чаты остаются доступными.</div>
                    <label class="block">Срок
                        <select id="mute-hours-input" class="input-field mt-2"> 
                            <option value="1">1 час</option>
                            <option value="6">6 часов</option>
                            <option value="24" selected>24 часа</option>
                            <option value="72">3 дня</option>
                            <option value="168">7 дней</option>
                            <option value="720">30 дней</option>
                        </select>
                    </label>
                    <label class="block">Причина
                        <textarea id="mute-reason-input" class="input-field w-full h-24 mt-2" placeholder="Причина мута">Нарушение правил</textarea>
                    </label>
                </div>`;
            document.getElementById('modal-ok-button').classList.add('hidden');
            document.getElementById('modal-confirm-buttons').classList.remove('hidden');
            document.getElementById('modal-confirm-button').textContent = 'Выдать мут';
            document.getElementById('modal-confirm-button').onclick = () => {
                const reason = (document.getElementById('mute-reason-input')?.value || '').trim();
                const hours = parseInt(document.getElementById('mute-hours-input')?.value || '24', 10);
                modal.classList.add('hidden');
                adminAction(userId, 'mute', { reason, hours });
            };
            document.getElementById('modal-cancel-button').onclick = () => modal.classList.add('hidden');
            modal.classList.remove('hidden');
        }

        function showBanUserModal(userId, mode = 'all') {
            const user = adminPanelData.users.find(u => u.id === userId);
            if (!user) return;
            const modal = document.getElementById('custom-modal');
            document.getElementById('modal-title').textContent = `Блокировка: ${escapeHtml(user.name)}`;
            document.getElementById('modal-message').innerHTML = `
                <div class="text-left space-y-3">
                    <label class="block">Причина
                        <textarea id="ban-reason-input" class="input-field w-full h-24 mt-2" placeholder="Укажите причину блокировки...">Нарушение правил</textarea>
                    </label>
                    <div class="report-ban-duration">
                        <label class="block">Длительность
                            <input id="ban-duration-value" type="number" min="1" value="7" class="input-field mt-2">
                        </label>
                        <label class="block">Единица
                            <select id="ban-duration-unit" class="input-field mt-2">
                                <option value="hours">Часы</option>
                                <option value="days" selected>Дни</option>
                                <option value="weeks">Недели</option>
                                <option value="months">Месяцы</option>
                                <option value="forever">Навсегда</option>
                            </select>
                        </label>
                    </div>
                    <div class="admin-ban-scope-grid">
                        <label class="admin-scope-card report-ban-flag" id="ban-card-ip"><input id="ban-by-ip" type="checkbox" checked> <div><div class="font-semibold">Блокировать по IP</div><div class="text-xs text-slate-400 mt-1">Перекрывает вход с текущего IP</div></div></label>
                        <label class="admin-scope-card report-ban-flag" id="ban-card-device"><input id="ban-by-device" type="checkbox" checked> <div><div class="font-semibold">Блокировать по устройству</div><div class="text-xs text-slate-400 mt-1">Фингерпринт браузера/устройства</div></div></label>
                        <div class="admin-scope-card active"><div class="font-semibold">Комбинированная защита</div><div class="text-xs text-slate-400 mt-1">Можно оставить один или оба флага</div></div>
                    </div>
                </div>`;
            const ipCb = document.getElementById('ban-by-ip');
            const devCb = document.getElementById('ban-by-device');
            if (mode === 'ip') {
                if (ipCb) ipCb.checked = true;
                if (devCb) devCb.checked = false;
            } else if (mode === 'device') {
                if (ipCb) ipCb.checked = false;
                if (devCb) devCb.checked = true;
            } else {
                if (ipCb) ipCb.checked = true;
                if (devCb) devCb.checked = true;
            }
            ['ban-by-ip','ban-by-device'].forEach(id => {
                const el = document.getElementById(id);
                const wrap = el ? el.closest('.admin-scope-card') : null;
                if (wrap && el) wrap.classList.toggle('active', !!el.checked);
                if (el) el.addEventListener('change', () => {
                    const card = el.closest('.admin-scope-card');
                    if (card) card.classList.toggle('active', !!el.checked);
                });
            });
            document.getElementById('modal-ok-button').classList.add('hidden');
            document.getElementById('modal-confirm-buttons').classList.remove('hidden');
            document.getElementById('modal-confirm-button').textContent = 'Заблокировать';
            document.getElementById('modal-confirm-button').onclick = () => {
                const reason = (document.getElementById('ban-reason-input')?.value || '').trim();
                const duration_value = parseInt(document.getElementById('ban-duration-value')?.value || '7', 10);
                const duration_unit = document.getElementById('ban-duration-unit')?.value || 'days';
                const permanent = duration_unit === 'forever';
                if (!reason) { showModal('Ошибка', 'Укажите причину блокировки'); return; }
                modal.classList.add('hidden');
                adminAction(userId, 'ban', {
                    reason,
                    duration_value,
                    duration_unit,
                    permanent,
                    ban_ip: document.getElementById('ban-by-ip')?.checked ? 1 : 0,
                    ban_device: document.getElementById('ban-by-device')?.checked ? 1 : 0
                });
            };
            document.getElementById('modal-cancel-button').onclick = () => { modal.classList.add('hidden'); };
            modal.classList.remove('hidden');
        }

        // Подтверждение удаления пользователя
        function confirmDeleteUser(userId) {
            const user = adminPanelData.users.find(u => u.id === userId);
            showModal(
                '⚠️ ПОЛНОЕ УДАЛЕНИЕ ПОЛЬЗОВАТЕЛЯ',
                `Вы уверены, что хотите НАВСЕГДА удалить пользователя <strong>${escapeHtml(user?.name || '')}</strong>?<br><br>
                Все его сообщения, чаты и данные будут безвозвратно удалены.`,
                true,
                () => adminAction(userId, 'deleteuser')
            );
        }

        // Выполнение админ-действия
        async function adminAction(targetUserId, action, extraData = null) {
            let data = {
                admin_action: action,
                target_user_id: targetUserId
            };
            
            if (action === 'ban' && extraData) {
                if (typeof extraData === 'string') { data.reason = extraData; } else { Object.assign(data, extraData); }
            } else if (action === 'setrole' || action === 'removerole') {
                data.role_key = extraData;
            } else if (action === 'mute' && extraData) {
                data.reason = extraData.reason || 'Нарушение правил';
                data.hours = extraData.hours || 24;
            } else if (action === 'review_report' && extraData) {
                data.report_id = extraData.report_id;
                data.decision = extraData.decision;
                data.punishment = extraData.punishment;
                data.comment = extraData.comment || '';
                if (extraData.custom_title != null) data.custom_title = extraData.custom_title;
                if (extraData.custom_mode != null) data.custom_mode = extraData.custom_mode;
                if (extraData.custom_hours != null) data.custom_hours = extraData.custom_hours;
            } else if (extraData && typeof extraData === 'object') {
                Object.assign(data, extraData);
            }
            
            const result = await apiRequest('admin_action', data);
            
            if (result.success) {
                hideCaptcha();
                showModal('Успех', 'Действие выполнено', false, async () => {
                    await loadAdminData();
                    if (document.getElementById('admin_panel_view')) {
                        await renderAdminPanelView();
                    }
                    document.getElementById('custom-modal').classList.add('hidden');
                });
            } else {
                showModal('Ошибка', result.error || 'Не удалось выполнить действие');
            }
        }

        function renderReportsTab(container) {
            const reports = Array.isArray(adminPanelData.reports) ? adminPanelData.reports : [];
            const activeType = window.adminReportsSubtab || 'user';
            const reportTypes = [
                { key: 'user', title: 'На пользователей' },
                { key: 'message', title: 'На сообщения' }
            ];
            const filtered = reports.filter(r => String(r.type || 'user') === activeType);
            const statusBadge = (status) => status === 'pending'
                ? '<span class="role-tag text-xs bg-amber-700">Ожидает</span>'
                : (status === 'approved' ? '<span class="role-tag text-xs bg-green-700">Одобрено</span>' : '<span class="role-tag text-xs bg-slate-700">Отклонено</span>');
            const actorCard = (actor, label) => {
                const targetId = String((actor && actor.id) || '');
                const clickable = targetId ? `onclick="selectAdminUser('${targetId}')"` : '';
                return `
                <button type="button" class="admin-report-actor w-full text-left" ${clickable}>
                    <img src="${escapeHtml((actor && actor.avatar) || '/default.png')}" alt="">
                    <div class="admin-report-actor__meta">
                        <div class="text-xs text-slate-400">${label}</div>
                        <div class="font-semibold text-white truncate">${escapeHtml((actor && actor.name) || 'Пользователь')}</div>
                        <div class="text-xs text-slate-500 truncate">@${escapeHtml((actor && actor.username) || 'user')}</div>
                    </div>
                </button>`;
            };
            container.innerHTML = `
                <div class="admin-report-type-tabs">
                    ${reportTypes.map(tab => `<button class="admin-report-type-tab ${tab.key === activeType ? 'is-active' : ''}" type="button" onclick="switchAdminReportsSubtab('${tab.key}')">${tab.title}</button>`).join('')}
                </div>
                ${!filtered.length ? '<div class="admin-report-empty">Жалоб в этой вкладке пока нет</div>' : `<div class="space-y-3">${filtered.map(r => {
                    const reporter = r.reporter_profile || {};
                    const target = r.target_profile || {};
                    const evidence = r.evidence || {};
                    const message = r.message || {};
                    return `
                    <div class="admin-report-card p-4 rounded-2xl">
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <div class="font-bold">${escapeHtml(r.reason_label || 'Жалоба')} · ${r.type === 'message' ? 'Сообщение' : 'Пользователь'}</div>
                                <div class="text-xs text-slate-500 mt-1">${escapeHtml(r.created_at_formatted || '')}</div>
                            </div>
                            ${statusBadge(r.status)}
                        </div>
                        <div class="grid md:grid-cols-2 gap-3 mt-3">
                            ${actorCard(reporter,'Кто подал')}
                            ${actorCard(target, r.type === 'message' ? 'На чьё сообщение' : 'На кого подана')}
                        </div>
                        ${message && message.message_id ? `<div class="admin-report-message"><div class="text-xs text-slate-400">Сообщение из общего чата</div><div class="text-sm text-slate-100 mt-2 whitespace-pre-wrap">${escapeHtml(message.preview || '')}</div></div>` : ''}
                        ${r.comment ? `<div class="text-sm mt-3 whitespace-pre-wrap text-slate-200">${escapeHtml(r.comment)}</div>` : ''}
                        ${evidence && evidence.url ? `<div class="admin-report-evidence">${evidence.kind === 'photo' ? `<img src="${escapeHtml(evidence.url)}" alt="">` : `<div class="admin-side-metric">${adminSvg('note')}<span>Файл</span></div>`}<div class="min-w-0"><div class="text-xs text-slate-400">Доказательства</div><a href="${escapeHtml(evidence.url)}" target="_blank" rel="noopener" class="text-sm text-sky-300 break-all">${escapeHtml(evidence.name || evidence.url)}</a></div></div>` : ''}
                        ${r.admin_comment ? `<div class="text-xs text-slate-400 mt-3">Комментарий админа: ${escapeHtml(r.admin_comment)}</div>` : ''}
                        ${r.status === 'pending' ? `<div class="admin-report-actions"><button class="primary-button text-xs px-3 py-2 bg-amber-600 hover:bg-amber-700" onclick="openReportReviewModal('${r.id}','${r.target_user_id}')">Рассмотреть</button><button class="secondary-button text-xs px-3 py-2" onclick="quickRejectReport('${r.id}')">Отклонить</button></div>` : ''}
                    </div>`;
                }).join('')}</div>`}
            `;
        }

        function switchAdminReportsSubtab(type){
            window.adminReportsSubtab = type === 'message' ? 'message' : 'user';
            const container = document.getElementById('admin-content-container');
            if (container) renderReportsTab(container);
        }



        function renderChannelsTab(container) {
            const items = Array.isArray(adminPanelData.channels) ? adminPanelData.channels : [];
            container.innerHTML = `
                <div class="mb-4 admin-search-wrap">
                    ${adminSvg('search')}
                    <input type="text" id="admin-channel-search" placeholder="Поиск по названию канала или @username" class="input-field" oninput="filterAdminChannels(this.value)">
                </div>
                <div id="admin-channels-list" class="space-y-3">${renderAdminChannelsList(items)}</div>
            `;
        }
        function filterAdminChannels(query) {
            const q = String(query || '').toLowerCase().trim();
            const list = document.getElementById('admin-channels-list');
            if (!list) return;
            const items = !q ? (adminPanelData.channels || []) : (adminPanelData.channels || []).filter(ch => (String(ch.name||'').toLowerCase().includes(q) || String(ch.username||'').toLowerCase().includes(q)));
            list.innerHTML = renderAdminChannelsList(items);
        }
        function renderAdminChannelsList(items) {
            if (!items.length) return '<div class="admin-report-empty">Каналы не найдены</div>';
            return items.map(ch => `
                <div class="admin-channel-card">
                    <div class="flex items-center justify-between gap-3">
                        <div class="min-w-0 flex-1">
                            <div class="flex items-center gap-1 text-lg font-bold"><span class="truncate">${escapeHtml(ch.name || 'Канал')}</span>${ch.is_verified ? verifiedBadgeSvg('lg') : ''}</div>
                            <div class="text-sm text-slate-400 truncate">@${escapeHtml(ch.username || '')}</div>
                            <div class="text-xs text-slate-500 mt-1">Участников: ${Number(ch.member_count || 0)}</div>
                        </div>
                        <button class="primary-button admin-action-btn text-xs px-3 py-2 ${ch.is_verified ? 'bg-slate-700 hover:bg-slate-600' : 'bg-sky-600 hover:bg-sky-700'}" onclick="confirmChannelVerification('${ch.id}','${escapeJsString(ch.name || 'Канал')}', ${ch.is_verified ? 'false' : 'true'})">${ch.is_verified ? adminBtnLabel('x','Снять галочку') : adminBtnLabel('verified','Выдать галочку')}</button>
                    </div>
                </div>
            `).join('');
        }
        function confirmChannelVerification(channelId, channelName, shouldVerify) {
            const title = shouldVerify ? 'Выдать верификацию?' : 'Снять верификацию?';
            const body = shouldVerify
                ? `Вы действительно хотите дать верификацию (галочку) данному каналу?<br><strong>${escapeHtml(channelName || 'Канал')}</strong>`
                : `Вы действительно хотите снять верификацию у канала?<br><strong>${escapeHtml(channelName || 'Канал')}</strong>`;
            showModal(title, body, true, () => adminAction('', shouldVerify ? 'verify_channel' : 'unverify_channel', { channel_id: channelId }));
        }

        function renderRolesTab(container) {
            const rows = Array.isArray(adminPanelData.role_policies) ? adminPanelData.role_policies : [];
            container.innerHTML = `<div class="space-y-3">${rows.map(r => `
                <div class="admin-role-card p-4 rounded-xl border border-slate-700">
                    <div class="font-bold text-lg">${escapeHtml(r.name || r.key)}</div>
                    <div class="text-xs text-slate-500 mb-2">${escapeHtml(r.key || '')}</div>
                    <div class="flex flex-wrap gap-2">${(r.rights || []).map(x => `<span class="role-tag text-xs bg-slate-700">${escapeHtml(x)}</span>`).join('')}</div>
                </div>`).join('')}</div>`;
        }

        function quickRejectReport(reportId) {
            adminAction('', 'review_report', { report_id: reportId, decision: 'reject', punishment: 'none', comment: 'Жалоба не была одобрена после проверки' });
        }

        function openReportReviewModal(reportId, targetUserId) {
            const modal = document.getElementById('custom-modal');
            const content = document.getElementById('modal-message');
            document.getElementById('modal-title').textContent = 'Рассмотрение жалобы';
            const punishments = [
                { key: 'none', title: 'Без наказания', sub: 'Подтвердить жалобу без санкции' },
                { key: 'warn', title: 'Предупреждение', sub: 'Добавить предупреждение' },
                { key: 'mute_24h', title: 'Мут 24 часа', sub: 'Ограничить общий чат на сутки' },
                { key: 'mute_7d', title: 'Мут 7 дней', sub: 'Серьёзное ограничение на неделю' },
                { key: 'ban', title: 'Бан', sub: 'Полная блокировка аккаунта' },
                { key: 'custom', title: 'Своё наказание', sub: 'Задать санкцию вручную' }
            ];
            content.innerHTML = `
                <div class="space-y-4 text-left">
                    <div class="text-sm text-slate-300">Сначала выбери решение: одобрить жалобу или отклонить её. Поля наказания и причины отказа больше не смешиваются.</div>
                    <div class="admin-report-type-tabs">
                        <button type="button" id="report-decision-approve" class="admin-report-type-tab is-active" onclick="selectReportDecisionMode('approve')">Одобрить жалобу</button>
                        <button type="button" id="report-decision-reject" class="admin-report-type-tab" onclick="selectReportDecisionMode('reject')">Отклонить жалобу</button>
                    </div>
                    <div id="report-approve-fields">
                        <div id="report-punishment-grid" class="report-punish-grid">
                            ${punishments.map(item => `
                                <button type="button" class="report-punish-option ${item.key === 'warn' ? 'active' : ''}" data-punishment="${item.key}" onclick="selectReportPunishment('${item.key}')">
                                    <div class="report-punish-option__title">${item.title}</div>
                                    <div class="report-punish-option__sub">${item.sub}</div>
                                </button>
                            `).join('')}
                        </div>
                        <div id="report-custom-fields" class="report-custom-fields">
                            <label class="block">Название наказания
                                <input id="report-custom-title" class="input-field mt-2" maxlength="80" placeholder="Например: Ограничение на публикации">
                            </label>
                            <label class="block">Тип действия
                                <select id="report-custom-mode" class="input-field mt-2">
                                    <option value="none">Только зафиксировать</option>
                                    <option value="warn">Предупреждение</option>
                                    <option value="mute">Мут</option>
                                    <option value="ban">Бан</option>
                                </select>
                            </label>
                            <label class="block">Длительность мута (часы)
                                <input id="report-custom-hours" class="input-field mt-2" type="number" min="1" max="720" value="24">
                            </label>
                        </div>
                    </div>
                    <div id="report-reject-fields" class="hidden">
                        <label class="block">Причина отказа
                            <select id="report-reject-reason" class="input-field mt-2">
                                <option value="Недостаточно доказательств">Недостаточно доказательств</option>
                                <option value="Нарушение не подтверждено">Нарушение не подтверждено</option>
                                <option value="Жалоба дублирует уже рассмотренную">Дубликат уже рассмотренной жалобы</option>
                                <option value="Нужно больше контекста">Нужно больше контекста</option>
                            </select>
                        </label>
                    </div>
                    <label class="block">Комментарий администратора
                        <textarea id="report-admin-comment" class="input-field w-full h-24 mt-2" placeholder="Объясни решение"></textarea>
                    </label>
                </div>`;
            window.currentReportPunishment = 'warn';
            window.currentReportDecisionMode = 'approve';
            selectReportPunishment('warn');
            document.getElementById('modal-ok-button').classList.add('hidden');
            document.getElementById('modal-confirm-buttons').classList.remove('hidden');
            document.getElementById('modal-confirm-button').textContent = 'Сохранить решение';
            document.getElementById('modal-cancel-button').textContent = 'Закрыть';
            document.getElementById('modal-confirm-button').onclick = () => {
                const decisionMode = window.currentReportDecisionMode || 'approve';
                const comment = document.getElementById('report-admin-comment')?.value || '';
                let payload;
                if (decisionMode === 'reject') {
                    const reason = document.getElementById('report-reject-reason')?.value || 'Недостаточно доказательств';
                    payload = buildReportDecisionPayload(reportId, targetUserId, 'reject', comment.trim() ? `${reason}. ${comment.trim()}` : reason);
                } else {
                    payload = buildReportDecisionPayload(reportId, targetUserId, 'approve', comment);
                }
                modal.classList.add('hidden');
                adminAction(targetUserId || '', 'review_report', payload);
            };
            document.getElementById('modal-cancel-button').onclick = () => { modal.classList.add('hidden'); };
            modal.classList.remove('hidden');
        }

        function selectReportDecisionMode(mode){
            window.currentReportDecisionMode = mode === 'reject' ? 'reject' : 'approve';
            document.getElementById('report-decision-approve')?.classList.toggle('is-active', window.currentReportDecisionMode === 'approve');
            document.getElementById('report-decision-reject')?.classList.toggle('is-active', window.currentReportDecisionMode === 'reject');
            document.getElementById('report-approve-fields')?.classList.toggle('hidden', window.currentReportDecisionMode !== 'approve');
            document.getElementById('report-reject-fields')?.classList.toggle('hidden', window.currentReportDecisionMode !== 'reject');
        }

        // Рендер вкладки забаненных
        
        function selectReportPunishment(key){
            window.currentReportPunishment = key;
            document.querySelectorAll('#report-punishment-grid .report-punish-option').forEach(el => {
                el.classList.toggle('active', el.dataset.punishment === key);
            });
            const custom = document.getElementById('report-custom-fields');
            if (custom) custom.classList.toggle('show', key === 'custom');
        }

        function buildReportDecisionPayload(reportId, targetUserId, decision, comment){
            const key = window.currentReportPunishment || 'none';
            const payload = { report_id: reportId, decision, punishment: key === 'custom' ? 'custom' : key, comment };
            if (key === 'custom') {
                payload.custom_title = document.getElementById('report-custom-title')?.value || '';
                payload.custom_mode = document.getElementById('report-custom-mode')?.value || 'none';
                payload.custom_hours = document.getElementById('report-custom-hours')?.value || '24';
            }
            return payload;
        }

        window.selectAdminUser = selectAdminUser;
        window.openReportReviewModal = openReportReviewModal;
        window.quickRejectReport = quickRejectReport;
        window.switchAdminReportsSubtab = switchAdminReportsSubtab;
        window.openLinkedDiscussionGroup = openLinkedDiscussionGroup;
        window.openReportMessageModal = openReportMessageModal;

function renderBannedTab(container) {
            if (adminPanelData.banned_users.length === 0) {
                container.innerHTML = '<p class="text-center text-slate-400 py-8">Нет забаненных пользователей</p>';
                return;
            }
            
            const html = `
                <div class="grid grid-cols-2 gap-3 mb-4">
                    <div class="admin-stat-card text-center"><div class="admin-stat-card__icon">${adminSvg('block')}</div><div><div class="text-2xl font-bold">${adminPanelData.banned_users.length}</div><div class="text-xs text-slate-400 mt-1">Активных блокировок</div></div></div>
                    <div class="admin-stat-card text-center"><div class="admin-stat-card__icon">${adminSvg('bell')}</div><div><div class="text-2xl font-bold">${adminPanelData.users.filter(u => u.muted_until && (u.muted_until * 1000 > Date.now())).length}</div><div class="text-xs text-slate-400 mt-1">Активных мутов</div></div></div>
                </div>
                <div class="space-y-3">
                    ${adminPanelData.banned_users.map(u => `
                        <div class="admin-ban-card p-3 border-red-500/30">
                            <div class="flex items-center">
                                <img src="${u.avatar}" alt="" class="admin-user-avatar">
                                <div class="flex-1 min-w-0">
                                    <div class="font-bold">${escapeHtml(u.name)}</div>
                                    <div class="text-sm text-slate-400">@${escapeHtml(u.username)}</div>
                                    <div class="text-xs text-red-400 mt-1">Причина: ${escapeHtml(u.block_reason)}</div>
                                    <div class="flex flex-wrap gap-2 mt-2">${u.ban_ip ? `<span class="admin-info-chip">${adminSvg('block')}<span>IP</span></span>` : ''}${u.ban_device ? `<span class="admin-info-chip">${adminSvg('shield')}<span>Устройство</span></span>` : ''}</div>
                                    <div class="text-xs text-slate-500 mt-2">Заблокировал: ${escapeHtml(u.blocked_by)} • ${u.blocked_at_formatted}</div><div class="text-xs text-slate-400">Срок: ${escapeHtml(u.expires_at_formatted || 'Навсегда')}</div>
                                </div>
                                <button class="primary-button bg-green-600 hover:bg-green-700 text-sm px-3 py-2"
                                        onclick="adminAction('${u.id}', 'unban')">
                                    ${adminBtnLabel('unlock','Разбанить')}</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            container.innerHTML = html;
        }

        // Очистка общего чата (из админ-панели)
        function adminConfirmClearChat() {
            showModal(
                'Очистить Общий Чат?',
                'Вы уверены, что хотите **полностью** очистить историю Общего Чата? Это действие **необратимо**.',
                true,
                async () => {
                    const result = await apiRequest('clear_general_chat');
                    if (result.success) {
                        hideCaptcha();
                        showModal('Успех', `Общий чат очищен. Удалено сообщений: ${result.count}.`);
                    } else {
                        showModal('Ошибка', result.error || 'Не удалось очистить чат');
                    }
                }
            );
        }

    </script>