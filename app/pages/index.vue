<template>
  <div class="page-wrap">
    <nav>
      <a href="#" class="on" @click.prevent="scrollToTop">Home</a>
      <a href="#doors" @click.prevent="selectDoor(0)">Web Development</a>
      <a href="#doors" @click.prevent="selectDoor(1)">App Development</a>
      <a href="#doors" @click.prevent="selectDoor(2)">UI/UX Design</a>
      <a href="#doors" @click.prevent="selectDoor(3)">Graphic Design</a>
      <a href="#story" @click.prevent="scrollToStory">My story</a>
      <a href="#">Contact</a>
    </nav>
    <main class="hero">
      <div class="cord" ref="cord" role="button" tabindex="0" aria-label="Pull the cord to switch between light and dark"><i></i></div>
      <span class="hint">Pull me</span>
      <div class="copy">
        <div class="status"><b></b>Available for freelance work</div>
        <h1>Hi, I’m Ayushman.<span class="am">I am a</span></h1>
        <div class="book" aria-live="polite"><div class="page" ref="pg">{{ role }}</div></div>
        <div class="cta"><a class="btn" href="#">Start a project <i>↗</i></a><a class="l" href="#">See my work</a></div>
      </div>
    </main>
    <section class="magic-sec" id="doors" ref="doorsSection" :class="{ 'in-view': sectionVisible }">
    <h2>Magic happens behind the doors</h2>
    <div class="magic" :class="{ row }" id="magic">
      <div class="doors" ref="doorsWrap"></div>
      <div class="info" ref="info" :class="{ swap: infoSwap }"></div>
    </div>
    <button class="viewall" @click="toggleRow">{{ row ? 'One door at a time' : 'See all doors' }}</button>
    <div class="page2" ref="page2" :class="{ on: pageOpen }" :aria-hidden="!pageOpen">
      <button class="p2back" @click="closePage">← Back to doors</button>
      <div class="p2in" ref="page2Content"></div>
    </div>
  </section>

  <section class="story-sec" id="story" ref="storySection">
    <div class="glow-story" ref="glow"></div>
    <div class="wrap-story">
      <div class="left-story">
        <div class="eyebrow-story"><b></b>My story</div>
        <h2>Let’s go back in time.</h2>
        <div class="year-story" id="yearStory" aria-label="2025">2025</div>
        <div class="range-story" id="rangeStory"></div>
        <div class="count-story"><b id="numStory">01 / 04</b><span><i id="barStory"></i></span></div>
      </div>
      <div class="right-story" id="rightStory">
        <div class="rail-story"><i id="fillStory"></i></div>
      </div>
    </div>
    <section class="hire-story"><div>
      <div class="st-story"><b></b>Available for new work</div>
      <h2>Got a project?<span>Let’s build it together.</span></h2>
      <p>I’m taking on new freelance work: websites, apps, interfaces and visual content. Tell me what you’re building and I’ll get back to you within a day.</p>
      <div class="cta-story"><a class="btn-story" href="#">Start a project <i>↗</i></a><a class="l-story" href="#">See my work</a></div>
    </div></section>
  </section>
</div>

</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { doorsData, type Door } from '~/data/doors'
import { storyData } from '~/data/story'

const roles = ['App Developer', 'UI/UX Designer', 'Graphic Designer', 'Web Developer']
const i = ref(0)
const role = ref(roles[0])
const pg = ref<HTMLElement | null>(null)
const cord = ref<HTMLElement | null>(null)
const row = ref(false)

let timer: ReturnType<typeof setInterval> | null = null
let y0: number | null = null

// Story timeline refs (top-level)
const storySection = ref<HTMLElement | null>(null)
const glow = ref<HTMLElement | null>(null)
const infoSwap = ref(false)
const doorsWrap = ref<HTMLElement | null>(null)
const info = ref<HTMLElement | null>(null)
const doorsSection = ref<HTMLElement | null>(null)
const page2 = ref<HTMLElement | null>(null)
const page2Content = ref<HTMLElement | null>(null)
const pageOpen = ref(false)
const sectionVisible = ref(false)
const doors = ref<HTMLElement[]>([])
let cur = 0
let openD: HTMLElement | null = null
let doorTimer: ReturnType<typeof setInterval> | null = null

const SV = doorsData
const D = [
  "Fast, accessible websites built around your goals, planned, designed and shipped as one smooth process.",
  "Mobile apps that feel native on iOS and Android, from the first wireframe to the store release.",
  "Interfaces shaped by real research and tested as prototypes before a single line of code is written.",
  "Visual identities and creatives that make a brand recognisable everywhere it shows up."
]
const STEPS = [["Discover","We align on goals, users and scope."],["Design","I shape the look, flow and details."],["Deliver","Build, test, launch and keep supporting."]]

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function scrollToStory() {
  storySection.value?.scrollIntoView({ behavior: 'smooth' })
}

function show(k: number, fade: boolean) {
  cur = k
  doors.value.forEach((d, j) => d.classList.toggle('on', j === k))
  const put = () => {
    const s = SV[k]
    if (s && info.value) {
      info.value.innerHTML = `<h3>${s.t}</h3><small>${s.s}</small><ul>${s.l.map((x) => `<li>${x}</li>`).join('')}</ul>`
    }
    infoSwap.value = false
  }
  if (fade) {
    infoSwap.value = true
    setTimeout(put, 300)
  } else {
    put()
  }
}

function auto() {
  if (doorTimer) clearInterval(doorTimer)
  doorTimer = setInterval(() => {
    if (!row.value && !openD) show((cur + 1) % SV.length, true)
  }, 3800)
}

function closeAll() {
  doors.value.forEach((d) => d.classList.remove('open'))
  openD = null
}

function openPage(k: number) {
  const s = SV[k]
  if (!s || !page2.value || !page2Content.value) return
  page2.value.style.setProperty('--c', s.c)
  page2Content.value.innerHTML = `<span class="p2tag">0${k+1} / 04 · ${s.pl.replace('<br>',' ')}</span><div class="p2t">${s.t}</div><p class="p2s">${s.s}</p><p class="p2d">${D[k]}</p><div class="p2grid"><div><h4>What you get</h4><ul>${s.l.map(x=>`<li>${x}</li>`).join('')}</ul></div><div><h4>How it works</h4><ol>${STEPS.map((x,i)=>`<li><b>${i+1}. ${x[0]}</b>${x[1]}</li>`).join('')}</ol></div></div><a class="p2cta" href="#">Start a project ↗</a>`
  pageOpen.value = true
  page2.value.scrollTop = 0
  document.body.style.overflow = 'hidden'
}

function selectDoor(k: number) {
  closeAll()
  row.value = false
  show(k, false)
  auto()
  doorsSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function closePage() {
  pageOpen.value = false
  document.body.style.overflow = ''
}

function toggleRow() {
  closeAll()
  row.value = !row.value
  if (row.value) {
    if (doorTimer) clearInterval(doorTimer)
  } else {
    auto()
  }
}

const isDark = () => {
  const r = document.documentElement
  return r.dataset.theme ? r.dataset.theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
}
const flip = () => {
  document.documentElement.dataset.theme = isDark() ? 'light' : 'dark'
}

onMounted(() => {
  timer = setInterval(() => {
    if (!pg.value) return
    pg.value.classList.add('flip')
    setTimeout(() => {
      i.value = (i.value + 1) % roles.length
      role.value = roles[i.value]
      pg.value?.classList.remove('flip')
    }, 470)
  }, 2600)

  const c = cord.value
  let down: ((e: PointerEvent) => void) | null = null
  let move: ((e: PointerEvent) => void) | null = null
  let up: ((e: PointerEvent) => void) | null = null
  let cancel: (() => void) | null = null
  let key: ((e: KeyboardEvent) => void) | null = null
  if (c) {
    down = (e: PointerEvent) => { y0 = e.clientY; c.classList.add('drag'); c.setPointerCapture(e.pointerId) }
    move = (e: PointerEvent) => { if (y0 === null) return; c.style.setProperty('--p', Math.max(0, Math.min(110, e.clientY - y0)) + 'px') }
    up = (e: PointerEvent) => {
      if (y0 === null) return
      const d = e.clientY - y0
      y0 = null
      c.classList.remove('drag')
      c.style.setProperty('--p', '0px')
      if (d > 45) flip()
    }
    cancel = () => { y0 = null; c.classList.remove('drag'); c.style.setProperty('--p', '0px') }
    key = (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip() } }
    c.addEventListener('pointerdown', down)
    c.addEventListener('pointermove', move)
    c.addEventListener('pointerup', up)
    c.addEventListener('pointercancel', cancel)
    c.addEventListener('keydown', key)
  }

  // Magic doors section reveal
  let io: IntersectionObserver | null = null
  if (doorsSection.value) {
    io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) sectionVisible.value = true })
    }, { threshold: 0.15 })
    io.observe(doorsSection.value)
  }

  // Render doors
  const wrap = doorsWrap.value
  if (wrap) {
    wrap.innerHTML = SV.map((s, k) => `<button class="door" style="--c:${s.c}" data-k="${k}" aria-label="${s.t}"><span class="arch"><span class="well"><span class="inside"><b>${s.t}</b><em>${s.s}</em><i>Click again to enter →</i></span><span class="leaf"><span class="plate">${s.pl}</span><span class="handle"></span><span class="enter">Click to enter</span></span></span></span></button>`).join('')
    doors.value = [...wrap.children] as HTMLElement[]
    doors.value.forEach((d, k) => {
      d.addEventListener('click', (e) => {
        e.stopPropagation()
        if (openD === d) { openPage(k); return }
        closeAll()
        if (doorTimer) clearInterval(doorTimer)
        if (!row.value) show(k, false)
        d.classList.add('open')
        openD = d
      })
    })
    show(0, false)
    auto()
  }

  const onSectionClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (openD && !target.closest('.viewall,.info,.door')) { closeAll(); if (!row.value) auto() }
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (pageOpen.value) closePage()
      else if (openD) { closeAll(); if (!row.value) auto() }
    }
  }
  if (doorsSection.value) doorsSection.value.addEventListener('click', onSectionClick)
  document.addEventListener('keydown', onKey)

  let curScroll: (() => void) | null = null
  let curMove: ((e: PointerEvent) => void) | null = null

  // Story timeline

  function initStory() {
    const rightStory = document.getElementById('rightStory')
    if (!(rightStory instanceof HTMLElement)) return

    rightStory.innerHTML = '<div class="rail-story"><i id="fillStory"></i></div>'
    const railEl = rightStory.querySelector('.rail-story')
    const storyMarkup = storyData.map((e, k) =>
      '<article class="item-story" tabindex="0" data-k="' + k + '">' +
      '<small>' + e.r + '</small><h3>' + e.t + '</h3><em>' + e.o + '</em>' +
      '<ul>' + e.l.map(x => '<li>' + x + '</li>').join('') + '</ul></article>'
    ).join('')
    if (railEl) railEl.insertAdjacentHTML('afterend', storyMarkup)
    else rightStory.insertAdjacentHTML('beforeend', storyMarkup)

    const itemsStory = [...rightStory.querySelectorAll('.item-story')] as HTMLElement[]
    let curStory = -1

    function setStory(k:number) {
      if (k===curStory) return
      const story = storyData[k]
      if (!story) return
      curStory = k
      itemsStory.forEach((n,j)=>n.classList.toggle('on',j===k))
      const rangeEl = document.getElementById('rangeStory')
      const numEl = document.getElementById('numStory')
      const barEl = document.getElementById('barStory')
      const yearEl = document.getElementById('yearStory')
      if (rangeEl) rangeEl.textContent = story.r
      if (numEl) numEl.textContent = '0'+(k+1)+' / 0'+storyData.length
      if (barEl) barEl.style.transform = 'scaleX('+(k+1)/storyData.length+')'
      if (yearEl) {
        yearEl.textContent = String(story.y)
        yearEl.setAttribute('aria-label', String(story.y))
        yearEl.classList.remove('chg')
        void yearEl.offsetWidth
        yearEl.classList.add('chg')
      }
    }

    function tickStory() {
      if (!(rightStory instanceof HTMLElement)) return
      const m = innerHeight*.5
      let b=0, bd=1e9
      itemsStory.forEach((n,j)=>{
        const r = (n as HTMLElement).getBoundingClientRect()
        const d = Math.abs(r.top+60-m)
        if (d < bd){ bd=d; b=j }
      })
      setStory(b)
      const r = rightStory.getBoundingClientRect()
      const p = Math.max(0,Math.min(1,(innerHeight*.5-r.top)/(r.height)))
      const fillEl = document.getElementById('fillStory')
      if (fillEl) fillEl.style.height = Math.round(p*r.height*.9)+'px'
    }

    const tickScroll = () => tickStory()
    addEventListener('scroll', tickScroll, {passive:true})
    curScroll = tickScroll
    itemsStory.forEach((n,j)=>{
      const go=()=>scrollTo({top:scrollY + (n as HTMLElement).getBoundingClientRect().top - innerHeight*.4,behavior:'smooth'})
      n.addEventListener('click', go)
      n.addEventListener('keydown', (e:any)=>{ if(e.key==='Enter'){ e.preventDefault(); go() } })
    })
    const g = glow.value
    if (g) {
      curMove = (e)=>{
        g.style.setProperty('--mx', e.clientX+'px')
        g.style.setProperty('--my', e.clientY+'px')
      }
      addEventListener('pointermove', curMove)
    }
    setStory(0)
    tickStory()
  }

  initStory()

  onUnmounted(() => {
    if (timer) clearInterval(timer)
    if (doorTimer) clearInterval(doorTimer)
    if (io) io.disconnect()
    if (doorsSection.value) doorsSection.value.removeEventListener('click', onSectionClick)
    document.removeEventListener('keydown', onKey)
    if (curScroll) removeEventListener('scroll', curScroll)
    if (curMove) removeEventListener('pointermove', curMove)
    document.body.style.overflow = ''
  })
})
</script>
<style>
:root{--bg:#f2eee7;--fg:#161514;--mute:#9b958a;--card:#fff;--pill:#161514;--pillfg:#fff;--disc:#e6ddcc;--glow:rgba(217,154,43,0);--sh:0 20px 34px -14px rgba(40,30,10,.38)}
:root[data-theme=dark]{--bg:#0c0c0c;--fg:#f4f2ee;--mute:#77736c;--card:#f4f2ee;--pill:#f4f2ee;--pillfg:#161514;--disc:#1a1917;--glow:rgba(217,154,43,.22);--sh:0 20px 34px -14px rgba(0,0,0,.9)}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#0c0c0c;--fg:#f4f2ee;--mute:#77736c;--card:#f4f2ee;--pill:#f4f2ee;--pillfg:#161514;--disc:#1a1917;--glow:rgba(217,154,43,.22);--sh:0 20px 34px -14px rgba(0,0,0,.9)}}
*{box-sizing:border-box}
html,body{margin:0;background:var(--bg)}
.page-wrap{margin:0;background:var(--bg);color:var(--fg);font-family:"Plus Jakarta Sans",system-ui,sans-serif;transition:background .6s,color .6s;overflow-x:hidden;min-height:100vh}
nav{display:flex;align-items:center;justify-content:center;gap:6px;padding:20px 28px;font-size:12.5px;flex-wrap:nowrap;overflow-x:auto;white-space:nowrap;scrollbar-width:none}
nav::-webkit-scrollbar{display:none}
nav a{color:var(--fg);text-decoration:none;padding:6px 10px;border-radius:20px;opacity:.75;transition:opacity .2s,background .2s}
nav a:hover,nav a.on{opacity:1;background:color-mix(in srgb,var(--fg) 9%,transparent)}
.hero{position:relative;max-width:1180px;margin:0 auto;padding:0 28px;min-height:calc(100vh - 70px);min-height:calc(100svh - 70px);display:grid;grid-template-columns:1.05fr .95fr;align-items:end;overflow:hidden}
.copy{align-self:center;padding:30px 0 90px;position:relative;z-index:2}
.status{display:inline-flex;align-items:center;gap:8px;font-size:12px;color:var(--mute);margin-bottom:20px}
.status b{width:7px;height:7px;border-radius:50%;background:#35c46a;box-shadow:0 0 0 4px rgba(53,196,106,.18)}
h1{font-size:clamp(38px,5.4vw,68px);line-height:1.03;letter-spacing:-.035em;margin:0;font-weight:600}
h1 .am{display:block;color:var(--mute)}
.book{position:relative;margin-top:38px;width:min(340px,100%);height:78px}
.book::before{content:"";position:absolute;top:-10px;left:16px;right:16px;height:12px;background:repeating-linear-gradient(90deg,transparent 0 9px,var(--fg) 9px 11px);opacity:.5;border-radius:6px}
.page{position:absolute;inset:0;background:var(--card);color:#161514;border-radius:14px;box-shadow:var(--sh);display:flex;align-items:center;padding:0 26px;font-size:27px;font-weight:600;letter-spacing:-.02em;transform-origin:top center;backface-visibility:hidden}
.page.flip{animation:fl .48s ease-in forwards}
@keyframes fl{to{transform:perspective(600px) rotateX(-95deg);opacity:0}}
.cta{display:flex;gap:20px;align-items:center;margin-top:34px;font-size:13.5px}
.btn{display:inline-flex;align-items:center;gap:12px;background:var(--pill);color:var(--pillfg);border-radius:30px;padding:9px 9px 9px 18px;font-weight:600;font-size:13px;text-decoration:none;transition:transform .2s}
.btn:hover{transform:translateY(-2px)}
.btn i{width:24px;height:24px;border-radius:50%;background:var(--pillfg);color:var(--pill);display:grid;place-items:center;font-style:normal}
.cta a.l{color:var(--fg);text-decoration:none;opacity:.8;border-bottom:1px solid var(--mute)}
.stage{position:relative;align-self:end;justify-self:center;width:min(400px,100%);line-height:0}
.stage::before{content:"";position:absolute;left:50%;bottom:-22%;width:100%;aspect-ratio:1;transform:translateX(-50%);border-radius:50%;background:var(--disc);transition:background .6s}
.hero::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 92% 18%,var(--glow),transparent 42%);transition:background .6s;pointer-events:none}
.stage img{position:relative;z-index:1;width:auto;max-width:100%;max-height:calc(100svh - 130px);height:auto;margin:0 auto;display:block;filter:drop-shadow(0 18px 20px rgba(0,0,0,.28));transition:filter .6s,transform .4s;animation:rise .9s cubic-bezier(.2,.8,.2,1) both}
.stage img:hover{transform:scale(1.03)}
:root[data-theme=dark] .stage img{filter:grayscale(1) contrast(1.08) brightness(.8) drop-shadow(0 18px 20px rgba(0,0,0,.8))}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .stage img{filter:grayscale(1) contrast(1.08) brightness(.8) drop-shadow(0 18px 20px rgba(0,0,0,.8))}}
@keyframes rise{from{transform:translateY(40px);opacity:0}}
.cord{position:absolute;right:5%;top:0;width:24px;margin-right:-12px;height:calc(100px + var(--p,0px));cursor:grab;touch-action:none;z-index:5;transform-origin:top center;animation:sw 3.4s ease-in-out infinite alternate;transition:height .45s cubic-bezier(.3,1.7,.5,1)}
.cord::before{content:"";position:absolute;left:11px;top:0;bottom:6px;width:2px;background:var(--fg)}
.cord i{position:absolute;bottom:-4px;left:5px;width:14px;height:14px;border-radius:50%;background:#d99a2b;box-shadow:0 0 20px #d99a2b}
.cord.drag{animation:none;transition:none;cursor:grabbing}
@keyframes sw{from{transform:rotate(-3deg)}to{transform:rotate(3deg)}}
.hint{position:absolute;right:calc(5% + 22px);top:66px;font-size:11px;color:var(--mute);z-index:2}
.foot{position:absolute;left:28px;bottom:24px;font-size:11px;color:var(--mute);z-index:2}
@media(max-width:760px){.hero{grid-template-columns:1fr;min-height:auto}.copy{padding:20px 0 40px}.stage{justify-self:center;width:min(330px,82vw)}.foot,.hint{display:none}}
@media(prefers-reduced-motion:reduce){.cord{animation:none}.page.flip,.stage img{animation:none}}
.magic-sec{position:relative;background:radial-gradient(ellipse 70% 50% at 50% 0%,#262a2a,#151717 70%);color:#f4f2ee;padding:90px 28px 110px;min-height:100vh;min-height:100svh;overflow:hidden}
.magic-sec::after{content:"";position:absolute;left:0;right:0;bottom:0;height:22%;background:linear-gradient(transparent,#0b0c0c)}
.magic-sec h2{max-width:1000px;margin:0 auto 70px;font-size:clamp(30px,5vw,58px);line-height:1.05;letter-spacing:-.03em;font-weight:700;text-shadow:0 0 26px rgba(255,255,255,.28)}
.magic{display:flex;align-items:flex-end;justify-content:center;gap:70px;max-width:1000px;margin:0 auto;position:relative;z-index:1}
.doors{display:flex;align-items:flex-end;justify-content:center;height:370px;transition:height .6s cubic-bezier(.3,.8,.3,1);flex:0 0 auto}
.door{position:relative;border:0;background:none;padding:0;height:100%;flex:0 0 0;width:0;opacity:0;overflow:hidden;cursor:pointer;transition:width .65s cubic-bezier(.3,.8,.3,1),opacity .4s,margin .6s,filter .4s,transform .4s}
.door.on{flex:0 0 210px;width:210px;opacity:1}
.magic.row .doors:hover .door:not(:hover){filter:blur(7px) brightness(.7);opacity:.55;transform:scale(.96)}
.inside i{font-style:normal;font-size:10px;font-weight:700;margin-top:10px;background:#3b2a06;color:#f6e09a;padding:5px 10px;border-radius:12px}
.page2{position:fixed;inset:0;z-index:100;overflow:auto;padding:90px 28px 60px;color:#f4f2ee;background:radial-gradient(ellipse 80% 60% at 20% 0%,color-mix(in srgb,var(--c,#2b4a8b) 40%,#0f1111),#0b0c0c 72%);opacity:0;visibility:hidden;transform:translateY(30px);transition:opacity .5s,transform .6s cubic-bezier(.3,.8,.3,1),visibility 0s .6s}
.page2.on{opacity:1;visibility:visible;transform:none;transition-delay:0s}
.p2back{position:fixed;top:22px;left:28px;z-index:101;background:#ffffff14;color:#f4f2ee;border:1px solid #ffffff30;border-radius:20px;padding:8px 16px;font:600 12px "Plus Jakarta Sans",sans-serif;cursor:pointer}
.p2in{max-width:900px;margin:0 auto}
.p2tag{display:inline-block;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#0f1111;background:var(--c);padding:6px 12px;border-radius:14px;font-weight:700}
.p2t{font-size:clamp(38px,7vw,84px);font-weight:700;letter-spacing:-.04em;line-height:1;margin:22px 0 12px}
.p2s{font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#9aa09f;margin:0 0 20px}
.p2d{font-size:19px;line-height:1.5;max-width:620px;color:#e3e0da;margin:0 0 40px}
.p2grid{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-bottom:44px}
.p2grid h4{margin:0 0 16px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#9aa09f}
.p2grid ul,.p2grid ol{margin:0;padding:0;list-style:none;display:grid;gap:12px;font-size:15px}
.p2grid li{padding:14px 16px;border-radius:12px;background:#ffffff0d;border-left:3px solid var(--c)}
.p2grid li b{display:block;margin-bottom:3px}
.p2cta{display:inline-flex;gap:10px;align-items:center;background:#f4f2ee;color:#161514;border-radius:30px;padding:12px 22px;font-weight:700;font-size:14px;text-decoration:none}
@media(max-width:760px){.p2grid{grid-template-columns:1fr}}
.arch{display:block;height:100%;padding:13px 13px 0;border-radius:999px 999px 0 0;background:linear-gradient(#53585a,#2b2e2f);box-shadow:inset 0 0 0 2px rgba(255,255,255,.06),0 30px 50px -10px rgba(0,0,0,.7);transition:border-radius .6s}
.leaf{position:relative;display:block;height:100%;border-radius:999px 999px 0 0;background:repeating-linear-gradient(90deg,var(--c) 0 8px,color-mix(in srgb,var(--c) 72%,#000) 8px 10px);box-shadow:inset 0 0 40px rgba(0,0,0,.35);transition:border-radius .6s}
.plate{position:absolute;left:50%;top:26%;transform:translateX(-50%);width:62%;padding:7px 4px;border-radius:3px;background:linear-gradient(135deg,#f0d27a,#b98a2c 55%,#e6c365);color:#3b2a06;font:700 9px/1.25 "Plus Jakarta Sans",sans-serif;letter-spacing:.14em;text-align:center;box-shadow:0 2px 6px rgba(0,0,0,.5)}
.handle{position:absolute;right:16%;top:58%;width:26px;height:8px;border-radius:5px;background:linear-gradient(#f0d27a,#b98a2c);box-shadow:0 2px 4px rgba(0,0,0,.5)}
.handle::before{content:"";position:absolute;left:-6px;top:-4px;width:15px;height:15px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#f6e09a,#b98a2c)}
.enter{position:absolute;left:50%;bottom:22%;transform:translateX(-50%);background:#fff;color:#161514;font:600 10px "Plus Jakarta Sans",sans-serif;padding:5px 11px;border-radius:14px;white-space:nowrap;box-shadow:0 4px 14px rgba(0,0,0,.5)}
.info{flex:0 1 380px;padding-bottom:30px;transition:opacity .4s}
.info.swap{opacity:0}
.info h3{margin:0;font-size:26px;letter-spacing:-.02em;font-weight:600}
.info small{display:block;margin:8px 0 18px;font-size:10.5px;letter-spacing:.16em;color:#8b908f;text-transform:uppercase}
.info ul{list-style:none;margin:0;padding:0;display:grid;gap:11px;font-size:14px;color:#d9d6d0}
.info li{display:flex;gap:11px;align-items:center}
.info li::before{content:"✓";flex:0 0 auto;width:17px;height:17px;border-radius:50%;background:#e9a6a1;color:#2b1210;font-size:10px;font-weight:700;display:grid;place-items:center}
.magic.row{gap:0;max-width:1100px}
.magic.row .doors{flex:1;height:450px}
.magic.row .door{flex:1 1 0;width:auto;opacity:1;margin:0 .8%}
.magic.row .arch,.magic.row .leaf{border-radius:14px 14px 0 0}
.magic.row .enter{display:none}
.magic.row .plate{top:12%;width:58%;font-size:11px}
.magic.row .info{display:none}
.door:focus-visible{outline:2px solid #fff;outline-offset:4px}
@media(max-width:760px){.magic{flex-direction:column;align-items:center;gap:30px}.door.on{flex-basis:190px;width:190px}.magic.row .doors{height:300px}.magic.row .plate{font-size:7px;letter-spacing:.06em}.magic-sec{padding-top:60px}}
.well{position:relative;display:block;height:100%;perspective:900px}
.leaf{position:absolute!important;inset:0;height:auto!important;transform-origin:left center;transition:transform .95s cubic-bezier(.55,0,.2,1),border-radius .6s;backface-visibility:hidden}
.inside{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;padding:0 14px 0 52px;border-radius:999px 999px 0 0;background:radial-gradient(ellipse at 50% 55%,#fff4cf,#f1c76a 45%,#a8691a);color:#3b2a06;transition:border-radius .6s}
.inside b{font-size:16px;letter-spacing:-.02em}
.inside em{font-style:normal;font-size:11px;opacity:.75}
.magic.row .inside{border-radius:14px 14px 0 0;padding-left:70px}
.door.open .leaf{transform:rotateY(82deg)}
.door.open .arch{background:linear-gradient(#6b6454,#3a3528)}
.viewall{display:block;margin:46px auto 0;position:relative;z-index:2;background:transparent;color:#d9d6d0;border:1px solid #5a5f5f;border-radius:20px;padding:8px 16px;font:600 12px "Plus Jakarta Sans",sans-serif;cursor:pointer}
.viewall:hover{background:#ffffff14}
.magic-sec{opacity:0;transform:translateY(40px);transition:opacity .8s ease,transform .8s ease}
  .magic-sec.in-view{opacity:1;transform:translateY(0)}

  .story-sec{position:relative;background:var(--bg);color:var(--fg);overflow-x:hidden}
  .glow-story{position:fixed;inset:0;background:radial-gradient(ellipse 60% 50% at var(--mx,20%) var(--my,20%),rgba(150,150,60,.18),transparent 65%);pointer-events:none}
  .wrap-story{position:relative;max-width:1180px;margin:0 auto;padding:0 28px;display:grid;grid-template-columns:1fr 1fr;align-items:start;gap:70px}
  .left-story{position:sticky;top:0;align-self:start;z-index:2;height:100vh;height:100svh;display:flex;flex-direction:column;justify-content:center;padding-bottom:40px;overflow:visible;background:var(--bg)}
  .eyebrow-story{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--mute);margin-bottom:18px}
  .eyebrow-story b{width:7px;height:7px;border-radius:50%;background:#d99a2b;box-shadow:0 0 0 4px rgba(217,154,43,.2)}
  .left-story h2{margin:0;font-size:clamp(28px,3.6vw,46px);letter-spacing:-.03em;line-height:1.05;font-weight:600}
  .year-story{display:block;width:max-content;max-width:100%;font-size:clamp(84px,13vw,176px);font-weight:700;letter-spacing:-.05em;line-height:1;margin:22px 0 14px;white-space:nowrap}
  .dg{display:block;height:1em;overflow:hidden;width:.62em}
  .dg div{transition:transform .8s cubic-bezier(.2,.9,.2,1)}
  .dg i{display:block;height:1em;font-style:normal;text-align:center}
  @keyframes gl{0%{filter:blur(9px);opacity:.4;transform:translateY(10px)}60%{filter:blur(1.5px);opacity:.9}100%{filter:none;opacity:1;transform:none}}.year-story.chg{animation:gl .75s ease-out}
  .range-story{font:500 12px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em;color:var(--mute);text-transform:uppercase;transition:opacity .3s}
  .count-story{display:flex;align-items:center;gap:12px;margin-top:18px;font:500 12px ui-monospace,Menlo,monospace;color:var(--mute)}
  .count-story span{position:relative;width:120px;height:2px;background:color-mix(in srgb,var(--fg) 20%,transparent)}
  .count-story span i{position:absolute;inset:0;background:#d99a2b;transform-origin:left;transform:scaleX(.2);transition:transform .6s;box-shadow:0 0 10px #d99a2b}
  .right-story{position:relative;padding:34vh 0 30vh 34px}
  .rail-story{position:absolute;left:0;top:0;bottom:0;width:1px;background:color-mix(in srgb,var(--fg) 20%,transparent)}
  .rail-story i{position:sticky;top:0;display:block;width:1px;height:0;background:#d99a2b}
  .item-story{position:relative;min-height:56vh;opacity:.3;transform:translateX(18px);transition:opacity .5s,transform .6s cubic-bezier(.2,.9,.2,1);cursor:pointer}
  .item-story.on{opacity:1;transform:none}
  .item-story::before{content:"";position:absolute;left:-39px;top:6px;width:11px;height:11px;border-radius:50%;background:var(--bg);border:2px solid var(--mute);transition:.4s}
  .item-story.on::before{border-color:#d99a2b;background:#d99a2b;box-shadow:0 0 16px #d99a2b;transform:scale(1.15)}
  .item-story small{display:block;font:500 11px ui-monospace,Menlo,monospace;letter-spacing:.14em;color:var(--mute);margin-bottom:10px}
  .item-story h3{margin:0 0 4px;font-size:clamp(22px,2.6vw,30px);letter-spacing:-.025em;font-weight:600}
  .item-story em{display:block;font-style:normal;font-size:13px;color:#d99a2b;margin-bottom:14px}
  .item-story ul{margin:0;padding:0;list-style:none;display:grid;gap:9px;font-size:14px;line-height:1.55;color:var(--mute);max-width:430px}
  .item-story li{display:flex;gap:10px}
  .item-story li::before{content:"–";color:#d99a2b}
  .hire-story{position:relative;max-width:1180px;margin:0 auto;padding:60px 28px 110px;text-align:left}
  .hire-story>div{border:1px solid color-mix(in srgb,var(--fg) 15%,transparent);border-radius:22px;padding:clamp(28px,5vw,60px);background:color-mix(in srgb,var(--fg) 3%,var(--bg))}
  .hire-story .st-story{display:inline-flex;align-items:center;gap:8px;font-size:11px;letter-spacing:.14em;color:var(--mute);text-transform:uppercase;margin-bottom:22px}
  .hire-story .st-story b{width:7px;height:7px;border-radius:50%;background:#35c46a;box-shadow:0 0 0 4px rgba(53,196,106,.18)}
  .hire-story h2{font-size:clamp(34px,5.4vw,68px);line-height:1.03;letter-spacing:-.035em}
  .hire-story h2 span{display:block;color:var(--mute)}
  .hire-story p{max-width:480px;font-size:14.5px;line-height:1.6;color:var(--mute);margin:22px 0 30px}
  .cta-story{display:flex;gap:20px;align-items:center;font-size:13.5px;flex-wrap:wrap}
  .btn-story{display:inline-flex;align-items:center;gap:12px;background:var(--pill);color:var(--pillfg);border-radius:30px;padding:9px 9px 9px 18px;font-weight:600;font-size:13px;text-decoration:none;transition:transform .2s}
  .btn-story:hover{transform:translateY(-2px)}
  .btn-story i{width:24px;height:24px;border-radius:50%;background:var(--pillfg);color:var(--pill);display:grid;place-items:center;font-style:normal}
  .cta-story a.l-story{color:var(--fg);text-decoration:none;opacity:.8;border-bottom:1px solid var(--mute)}
  @media(max-width:820px){.wrap-story{grid-template-columns:.8fr 1.2fr;gap:18px;padding:0 18px}.left-story{padding-bottom:20px}.year-story{flex-wrap:wrap;width:1.3em;font-size:min(25vw,110px);margin:14px 0 10px}.left-story h2{font-size:19px}.eyebrow-story{margin-bottom:10px;font-size:11px}.range-story{font-size:9.5px;letter-spacing:.08em;line-height:1.5}.count-story{gap:8px;font-size:11px}.count-story span{width:46px}.right-story{padding:34vh 0 30vh 20px}.item-story{min-height:50vh}.item-story::before{left:-25px;width:10px;height:10px}.item-story h3{font-size:19px}.item-story small{font-size:9.5px;letter-spacing:.08em}.item-story ul{font-size:12.5px}.hire-story{padding:40px 18px 90px}}
  @media(prefers-reduced-motion:reduce){.dg div,.item-story,.count-story span i{transition:none}}

</style>