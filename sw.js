if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(i[o])return;let c={};const d=e=>n(e,o),t={module:{uri:o},exports:c,require:d};i[o]=Promise.all(s.map((e=>t[e]||d(e)))).then((e=>(r(...e),c)))}}define(["./workbox-28fe7b12"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-BxzwcYlk.css",revision:null},{url:"assets/index-qrU1XHYM.js",revision:null},{url:"assets/workbox-window.prod.es5-NU22iWMg.js",revision:null},{url:"index.html",revision:"c0ceb9cf6440515cdd6031aeb098f045"},{url:"favicon.ico",revision:"a5caad8aa4629a1baa1ad91dcf3d869c"},{url:"img/icons/android-chrome-192x192.png",revision:"0b3d1198c6200343a9ebcfb7190776a2"},{url:"img/icons/android-chrome-512x512.png",revision:"3a57507c73d07482dd72d4e525a80b3e"},{url:"manifest.webmanifest",revision:"c9679e1211142dbda73c358ab5795f8a"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
