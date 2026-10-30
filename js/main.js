(function(){
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const pages=[["index.html","Home"],["about.html","About"],["services.html","Services"],["portfolio.html","Portfolio"],["contact.html","Contact"]];
const cur=(location.pathname.split("/").pop().replace(/\.html$/,"")||"index")+".html";
let saved=null;try{saved=localStorage.getItem("theme")}catch(e){}
document.documentElement.dataset.theme=saved||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");

/* shared header, footer and scroll-to-top */
const links=pages.map(([h,t])=>`<a href="${h}"${h===cur?' class="active" aria-current="page"':""}>${t}</a>`).join("");
$("#site-header").outerHTML=`<header class="site-header"><div class="wrap nav"><a class="logo" href="index.html">Roast<span>&amp;</span>Co</a>
<nav class="nav-links" id="menu" aria-label="Main">${links}<button class="icon-btn" id="theme" aria-label="Toggle dark mode"></button></nav>
<button class="icon-btn burger" id="burger" aria-label="Open menu" aria-expanded="false">&#9776;</button></div></header>`;
$("#site-footer").outerHTML=`<footer><div class="foot"><div><a class="logo" href="index.html">Roast<span>&amp;</span>Co</a><p>A neighbourhood coffee shop with small-batch roasting and pastries baked next door.</p></div>
<div><h4>Explore</h4><nav aria-label="Footer"><ul>${pages.map(([h,t])=>`<li><a href="${h}">${t}</a></li>`).join("")}</ul></nav></div>
<div><h4>Visit</h4><ul><li>12 Bean Street, Karachi</li><li>Open daily, 8am to 10pm</li><li>hello@roastandco.example</li></ul></div></div>
<div class="foot-bottom"><small>&copy; ${new Date().getFullYear()} Roast &amp; Co. Coffee. Photos via Unsplash.</small></div></footer>
<button class="icon-btn to-top" id="top" aria-label="Back to top">&uarr;</button>`;

/* hide any photo that fails to load so the warm gradient behind it shows instead */
const hide=i=>i.classList.add("broken");
$$("img").forEach(i=>{if(i.complete&&i.naturalWidth===0)hide(i)});
document.addEventListener("error",e=>{if(e.target.tagName==="IMG")hide(e.target)},true);

/* 1 responsive menu */
const menu=$("#menu"),burger=$("#burger");
burger.onclick=()=>{const o=menu.classList.toggle("open");burger.setAttribute("aria-expanded",o)};
$$("#menu a").forEach(a=>a.onclick=()=>{menu.classList.remove("open");burger.setAttribute("aria-expanded",false)});

/* 2 dark mode */
const tb=$("#theme"),paint=()=>tb.innerHTML=document.documentElement.dataset.theme==="dark"?"&#9728;":"&#9790;";
paint();tb.onclick=()=>{const t=document.documentElement.dataset.theme==="dark"?"light":"dark";document.documentElement.dataset.theme=t;try{localStorage.setItem("theme",t)}catch(e){}paint()};

/* 3 scroll to top */
const top=$("#top");addEventListener("scroll",()=>top.classList.toggle("show",scrollY>400),{passive:true});
top.onclick=()=>scrollTo({top:0,behavior:"smooth"});

/* 4 typing animation */
const ty=$("#typing");
if(ty){const w=ty.dataset.words.split(","),still=matchMedia("(prefers-reduced-motion: reduce)").matches;let i=0,j=0,del=false;
if(still)ty.textContent=w[0];else(function tick(){const s=w[i];ty.textContent=s.slice(0,j);
if(!del&&j===s.length){del=true;return setTimeout(tick,1400)}
if(del&&j===0){del=false;i=(i+1)%w.length}
j+=del?-1:1;setTimeout(tick,del?50:95)})()}

/* 5 animated counters + reveal */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);
if(e.target.dataset.count){const n=+e.target.dataset.count,t0=performance.now();
(function f(t){const p=Math.min((t-t0)/1600,1);e.target.textContent=Math.floor(n*(1-Math.pow(1-p,3)))+(e.target.dataset.suffix||"");if(p<1)requestAnimationFrame(f)})(t0)}
else e.target.classList.add("in")}),{threshold:.25});
$$("[data-count],.reveal").forEach(el=>io.observe(el));

/* 6 image slider */
const sl=$(".slider");
if(sl){const tr=$(".track",sl),n=tr.children.length;let k=0,t;
const go=x=>{k=(x+n)%n;tr.style.transform=`translateX(-${k*100}%)`},auto=()=>{clearInterval(t);t=setInterval(()=>go(k+1),5000)};
$(".prev",sl).onclick=()=>{go(k-1);auto()};$(".next",sl).onclick=()=>{go(k+1);auto()};auto();
sl.onmouseenter=()=>clearInterval(t);sl.onmouseleave=auto}

/* 7 FAQ accordion */
$$(".faq-q").forEach(q=>q.onclick=()=>{const it=q.parentElement,open=!it.classList.contains("open");
$$(".faq-item").forEach(o=>{o.classList.remove("open");$(".faq-q",o).setAttribute("aria-expanded",false);$(".faq-a",o).style.maxHeight=0});
if(open){it.classList.add("open");q.setAttribute("aria-expanded",true);const a=$(".faq-a",it);a.style.maxHeight=a.scrollHeight+"px"}});

/* 8 form validation */
const f=$("#contact-form");
if(f){const rules={name:v=>v.trim().length>=2||"Enter your name (at least 2 characters).",
email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)||"Enter a valid email, like name@example.com.",
subject:v=>v.trim().length>=3||"Add a short subject (at least 3 characters).",
message:v=>v.trim().length>=10||"Write at least 10 characters so we can help."};
const check=el=>{const r=rules[el.name](el.value),ok=r===true;el.parentElement.classList.toggle("invalid",!ok);$(".error",el.parentElement).textContent=ok?"":r;return ok};
$$("input[id],textarea",f).forEach(el=>el.addEventListener("input",()=>check(el)));
f.addEventListener("submit",e=>{e.preventDefault();const ok=$$("input[id],textarea",f).map(check).every(Boolean),m=$(".success",f);
if(ok){const b=$("button",f);b.disabled=true;fetch("/",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams(new FormData(f)).toString()}).then(r=>{if(!r.ok)throw 0;m.style.display="block";m.style.background="";m.style.color="";m.textContent="Message sent. We'll reply within one business day.";f.reset()}).catch(()=>{m.style.display="block";m.style.background="#fde2e2";m.style.color="#8a1c1c";m.textContent="Sorry, that did not send. Please email us directly."}).finally(()=>b.disabled=false)}else{m.style.display="none";$(".invalid input,.invalid textarea",f).focus()}})}
/* 9 menu filter */
$$(".tab").forEach(b=>b.onclick=()=>{$$(".tab").forEach(t=>t.classList.toggle("active",t===b));
$$(".menu-item").forEach(i=>i.classList.toggle("hide",b.dataset.f!=="all"&&i.dataset.cat!==b.dataset.f))});
})();
