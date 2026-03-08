<script>
(function(){
  function unlockAdminScrollHard(){
    try{
      const html=document.documentElement, body=document.body, app=document.getElementById('app'), appMain=document.getElementById('app-main'), sc=document.getElementById('screen-container');
      [html,body,app,appMain,sc].forEach(el=>{ if(!el) return; el.classList.add('admin-v29-scroll'); });
      if(sc){
        sc.style.overflowY='auto';
        sc.style.overflowX='hidden';
        sc.style.height='auto';
        sc.style.maxHeight='none';
        sc.style.minHeight='100dvh';
        sc.style.webkitOverflowScrolling='touch';
        sc.style.paddingBottom='calc(220px + env(safe-area-inset-bottom))';
      }
      if(body){ body.style.overflowY='auto'; body.style.overflowX='hidden'; }
      if(appMain){ appMain.style.overflow='visible'; appMain.style.height='auto'; appMain.style.maxHeight='none'; }
      const root=document.getElementById('admin_screen_content');
      if(root){
        root.classList.add('admin-v29-root');
        root.style.position='relative';
        root.style.height='auto';
        root.style.minHeight='calc(100dvh + 220px)';
        root.style.overflow='visible';
        if(!document.getElementById('admin-v29-spacer')){
          const spacer=document.createElement('div');
          spacer.id='admin-v29-spacer';
          spacer.style.height='220px';
          spacer.style.pointerEvents='none';
          root.appendChild(spacer);
        }
      }
      const panel=document.getElementById('super-admin-panel');
      if(panel){
        panel.classList.add('admin-v29-panel');
        panel.style.paddingBottom='220px';
      }
    }catch(e){}
  }
  function resetAdminScrollHard(){
    try{
      const html=document.documentElement, body=document.body, app=document.getElementById('app'), appMain=document.getElementById('app-main'), sc=document.getElementById('screen-container');
      [html,body,app,appMain,sc].forEach(el=>{ if(!el) return; el.classList.remove('admin-v29-scroll'); });
      if(sc){ sc.style.paddingBottom=''; }
      if(body){ body.style.overflowY=''; body.style.overflowX=''; }
      if(appMain){ appMain.style.overflow=''; appMain.style.height=''; appMain.style.maxHeight=''; }
    }catch(e){}
  }
  if(!document.getElementById('admin-v29-style')){
    const st=document.createElement('style');
    st.id='admin-v29-style';
    st.textContent=`
      html.admin-v29-scroll,body.admin-v29-scroll,#app.admin-v29-scroll,#app-main.admin-v29-scroll,#screen-container.admin-v29-scroll{overflow-y:auto !important;overflow-x:hidden !important;height:auto !important;max-height:none !important;min-height:100dvh !important;}
      #screen-container.admin-v29-scroll{position:relative !important;display:block !important;-webkit-overflow-scrolling:touch !important;overscroll-behavior-y:auto !important;}
      #admin_screen_content.admin-v29-root{display:block !important;position:relative !important;top:auto !important;left:auto !important;right:auto !important;bottom:auto !important;width:100% !important;height:auto !important;max-height:none !important;min-height:calc(100dvh + 220px) !important;overflow:visible !important;transform:none !important;animation:none !important;padding-bottom:220px !important;}
      #super-admin-panel.admin-v29-panel{min-height:calc(100dvh + 120px) !important;padding-bottom:220px !important;}
      #super-admin-panel.admin-v29-panel .sap-card:last-child{margin-bottom:40px !important;}
      #admin-v29-spacer{display:block !important;}
    `;
    document.head.appendChild(st);
  }

  const oldRender=window.renderAdminPanelView;
  if(typeof oldRender==='function'){
    window.renderAdminPanelView=async function(){
      const out=await oldRender.apply(this, arguments);
      unlockAdminScrollHard();
      requestAnimationFrame(unlockAdminScrollHard);
      setTimeout(unlockAdminScrollHard, 120);
      return out;
    };
  }
  const oldOpenTab=window.openAdminTab;
  if(typeof oldOpenTab==='function'){
    window.openAdminTab=function(){
      const out=oldOpenTab.apply(this, arguments);
      requestAnimationFrame(unlockAdminScrollHard);
      setTimeout(unlockAdminScrollHard, 80);
      return out;
    };
  }
  const oldSwitch=window.switchScreen;
  if(typeof oldSwitch==='function'){
    window.switchScreen=function(screenName){
      if(screenName!=='admin_panel') resetAdminScrollHard();
      const out=oldSwitch.apply(this, arguments);
      if(screenName==='admin_panel'){
        requestAnimationFrame(unlockAdminScrollHard);
        setTimeout(unlockAdminScrollHard, 120);
      }
      return out;
    };
  }
  const oldMount=window.mountVerificationBotExperience;
  if(typeof oldMount==='function'){
    window.mountVerificationBotExperience=function(){
      const out=oldMount.apply(this, arguments);
      try{
        const footer=document.getElementById('verification-bot-footer');
        if(footer){ footer.innerHTML='🤖 Super Verification: подайте заявку на галочку профиля или канала прямо в чате и следите за статусом верификации.'; }
      }catch(e){}
      return out;
    };
  }
})();
</script>