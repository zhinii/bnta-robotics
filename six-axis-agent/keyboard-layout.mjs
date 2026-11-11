// The iPad keyboard changes the visible viewport independently of page height.
export function setupKeyboardLayout({window,document,onChange}){
  const viewport=window.visualViewport;
  if(!viewport)return;
  let expandedHeight=viewport.height,active=false,scrollPosition=0;
  function update(){
    const field=document.activeElement;
    const editing=field?.matches('#prompt,#api-key');
    const touch=window.navigator.maxTouchPoints>0||window.matchMedia('(pointer:coarse)').matches;
    if(!editing&&!active)expandedHeight=Math.max(viewport.height,window.innerHeight);
    const occluded=Math.max(expandedHeight,window.innerHeight)-viewport.height;
    const next=touch&&editing&&viewport.scale<1.1&&occluded>120;
    if(next&&!active)scrollPosition=window.scrollY;
    document.documentElement.style.setProperty('--visible-height',viewport.height+'px');
    document.documentElement.style.setProperty('--visible-width',viewport.width+'px');
    document.documentElement.style.setProperty('--visible-top',viewport.offsetTop+'px');
    document.documentElement.style.setProperty('--visible-left',viewport.offsetLeft+'px');
    if(next!==active){
      active=next;document.body.classList.toggle('is-typing',active);onChange(active);
      if(!active)window.requestAnimationFrame(()=>window.scrollTo({top:scrollPosition,behavior:'instant'}));
    }
  }
  viewport.addEventListener('resize',update);viewport.addEventListener('scroll',update);
  window.addEventListener('resize',update);
  document.addEventListener('focusin',update);
  document.addEventListener('focusout',()=>window.requestAnimationFrame(update));
  update();
}
