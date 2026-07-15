// THE GLITCH — shared behaviour

let revealObserver, introObserver;

function typeIntro(el){
  if(el.dataset.typed) return;
  el.dataset.typed = '1';
  const fullHTML = el.innerHTML;
  const fullText = el.textContent;
  el.innerHTML = '';
  el.classList.add('is-typing');
  let ci = 0;
  const step = () => {
    if(ci <= fullText.length){
      el.innerHTML = fullText.slice(0, ci) + '<span class="caret">▍</span>';
      ci++;
      setTimeout(step, 14 + Math.random()*18);
    } else {
      el.innerHTML = fullHTML;
      el.classList.remove('is-typing');
    }
  };
  step();
}

// Exposed so pages that inject content after an async DB fetch (About, Projects)
// can re-scan for new .reveal / .glitch-intro elements once rendered.
window.GlitchUI = {
  refresh(root){
    root = root || document;
    if(revealObserver){
      root.querySelectorAll('.reveal').forEach(el => {
        if(el.dataset.observed) return;
        el.dataset.observed = '1';
        revealObserver.observe(el);
      });
    }
    if(introObserver){
      root.querySelectorAll('.glitch-intro .bubble').forEach(el => {
        if(el.dataset.introObserved) return;
        el.dataset.introObserved = '1';
        introObserver.observe(el);
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {

  // set data-text for glitch headings automatically
  document.querySelectorAll('.glitch').forEach(el => {
    if(!el.getAttribute('data-text')) el.setAttribute('data-text', el.textContent);
  });

  // mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if(toggle && links){
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', links.classList.contains('open'));
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  // ambient floating pixel field
  const field = document.querySelector('.pixel-field');
  if(field){
    const count = window.innerWidth < 700 ? 14 : 26;
    for(let i=0;i<count;i++){
      const p = document.createElement('div');
      p.className = 'pixel';
      const size = 3 + Math.random()*9;
      p.style.width = size+'px';
      p.style.height = size+'px';
      p.style.left = Math.random()*100+'vw';
      p.style.top = Math.random()*100+'vh';
      p.style.opacity = (0.12 + Math.random()*0.3).toFixed(2);
      p.style.animationDuration = (4+Math.random()*6)+'s';
      p.style.animationDelay = (Math.random()*4)+'s';
      field.appendChild(p);
    }
  }

  // scroll reveal
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('in');
        revealObserver.unobserve(e.target);
      }
    });
  }, {threshold:.15});

  // -------- Glitch intro bubbles (mascot "presenting" a section) — typing effect --------
  introObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        typeIntro(entry.target);
        introObserver.unobserve(entry.target);
      }
    });
  }, {threshold:.4});

  // observe whatever is already in the DOM at load time
  window.GlitchUI.refresh(document);

  // -------- Glitch companion (persistent guide, stays on screen) --------
  const companionEl = document.querySelector('.companion');
  if(companionEl){
    let lines = [];
    try{ lines = JSON.parse(document.body.dataset.glitchLines || '[]'); }catch(e){ lines = []; }
    if(lines.length){
      const bubble = companionEl.querySelector('.companion-bubble');
      const avatar = companionEl.querySelector('.companion-avatar');
      const ping = companionEl.querySelector('.companion-ping');
      let i = 0;
      let typeTimer = null;
      let cycleTimer = null;

      // types a line into the bubble; the bubble stays visible (no auto-hide)
      const say = (text) => {
        clearTimeout(typeTimer);
        bubble.classList.add('show');
        let ci = 0;
        const typeNext = () => {
          bubble.innerHTML = text.slice(0, ci) + '<span class="caret">▍</span>';
          if(ci <= text.length){
            ci++;
            typeTimer = setTimeout(typeNext, 16 + Math.random()*20);
          }
        };
        typeNext();
      };

      const scheduleNext = () => {
        clearTimeout(cycleTimer);
        cycleTimer = setTimeout(() => {
          i = (i + 1) % lines.length;
          say(lines[i]);
          scheduleNext();
        }, 9000);
      };

      // clicking the avatar jumps straight to the next line
      avatar.addEventListener('click', () => {
        if(ping) ping.remove();
        i = (i + 1) % lines.length;
        say(lines[i]);
        scheduleNext();
      });

      // first message, after the boot sequence (if any) or shortly after load,
      // then keeps auto-cycling through the rest — bubble never disappears
      const delay = document.body.dataset.boot === 'true' ? 3200 : 1000;
      setTimeout(() => {
        say(lines[0]);
        scheduleNext();
      }, delay);
    }
  }

  // -------- Boot sequence (home page only, once per session) --------
  const bootEl = document.querySelector('.boot-overlay');
  if(bootEl){
    if(sessionStorage.getItem('glitchBooted')){
      bootEl.remove();
    } else {
      const linesEl = bootEl.querySelector('.boot-lines');
      const mascotEl = bootEl.querySelector('.boot-mascot');
      const skipBtn = bootEl.querySelector('.boot-skip');
      const script = [
        'waking up The Glitch ...'
      ];
      let out = '';
      let li = 0, ci = 0;

      const finish = () => {
        sessionStorage.setItem('glitchBooted', '1');
        bootEl.classList.add('hide');
        setTimeout(() => bootEl.remove(), 700);
      };

      const typeNext = () => {
        if(li >= script.length){
          mascotEl.classList.add('in');
          setTimeout(finish, 1300);
          return;
        }
        const line = script[li];
        if(ci <= line.length){
          const soFar = out + '<span class="done">' + line.slice(0, ci) + '<span class="boot-cursor"></span></span>';
          linesEl.innerHTML = soFar;
          ci++;
          setTimeout(typeNext, 18 + Math.random()*22);
        } else {
          out += '<span class="done">✓ ' + line + '</span><br>';
          li++; ci = 0;
          setTimeout(typeNext, 160);
        }
      };
      skipBtn.addEventListener('click', finish);
      setTimeout(typeNext, 350);
    }
  }

});
