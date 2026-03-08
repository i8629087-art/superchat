<script>
(function(){
  function initPasswordToggle(){
    var pwd = document.getElementById('password');
    var btn = document.getElementById('password-toggle');
    if(!pwd || !btn) return;

    // Prevent duplicate listeners if init runs multiple times
    var already = (btn.dataset && btn.dataset.pwdToggleInited === '1');

    function setState(isVisible){
      pwd.type = isVisible ? 'text' : 'password';
      btn.setAttribute('aria-label', isVisible ? 'Скрыть пароль' : 'Показать пароль');
      btn.setAttribute('title', isVisible ? 'Скрыть пароль' : 'Показать пароль');
      var icon = btn.querySelector('.pwd-toggle-icon');
      if(icon) 
      if(icon){
        icon.innerHTML = isVisible 
          ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19C7 19 2.73 15.11 1 12c.73-1.32 1.72-2.54 2.91-3.6"/>
               <path d="M1 1l22 22"/>
               <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
             </svg>`
          : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
               <circle cx="12" cy="12" r="3"/>
             </svg>`;
      }

    }

    setState(pwd.type === 'text'); // sync state (default: hidden)

    if(!already){
      if(btn.dataset) btn.dataset.pwdToggleInited = '1';
      btn.addEventListener('click', function(){
        setState(pwd.type !== 'text');
        try { pwd.focus({preventScroll:true}); } catch(e){ pwd.focus(); }
      });
    }
  }

  // expose for dynamic screen renders
  window.__initPasswordToggle = initPasswordToggle;

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initPasswordToggle);
  } else {
    initPasswordToggle();
  }
})();
</script>