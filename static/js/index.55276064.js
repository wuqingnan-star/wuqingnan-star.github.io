(()=>{"use strict";var e={498:function(e,t,r){var o=r(676),n=r(271),l=r(751),i=r(754),a=r(436);let u=new(r(452)).R("re_RQ15tPwC_FfjUorPZ4ohXLozH9HVUNa9C"),s=a.ZP.div`
  flex: 1;
  background-color: rgb(0, 47, 167);
  color: #000;
  padding: 10px;
  display: flex;
  max-height: 70px;

  h1 {
    flex: 1;
    font-size: 16px;
    text-align: left;
  }

  button {
    flex: 1;
    padding: 10px;
    margin-left: 10px;
    font-size: 14px;
    font-weight: bold;
    background-color: #000;
    color: #fff;
    border: 0px;
    max-width: 150px;
    cursor: pointer;
  }
`,d=document.getElementById("root");d&&l.createRoot(d).render((0,o.jsx)(n.StrictMode,{children:(0,o.jsx)(e=>{let t=(0,n.useRef)(null),[r,l]=(0,n.useState)(!1),a=async()=>{let{data:e,error:t}=await u.emails.send({from:"Keny <@starmax>",to:["keny55555@outlook.com"],subject:"Hello world",html:"<strong>It works!</strong>"});console.log({data:e}),t&&console.log({error:t})};return(0,o.jsxs)("div",{className:"App",id:"App",children:[(0,o.jsxs)(s,{children:[(0,o.jsxs)("button",{onClick:()=>{var e;let o=null==(e=t.current)?void 0:e.editor;r?(null==o||o.hidePreview(),l(!1)):(null==o||o.showPreview("desktop"),l(!0))},children:[r?"Hide":"Show"," Preview"]}),(0,o.jsx)("button",{onClick:()=>{var e;let r=null==(e=t.current)?void 0:e.editor;null==r||r.saveDesign(e=>{console.log("saveDesign",e),alert("Design JSON has been logged in your developer console.")})},children:"Save Design"}),(0,o.jsx)("button",{onClick:()=>{var e;let r=null==(e=t.current)?void 0:e.editor;null==r||r.exportHtml(e=>{let{design:t,html:r}=e;console.log("exportHtml----",r),console.log("design-----------------"+t)})},children:"Export HTML"}),(0,o.jsx)("button",{onClick:a,children:"Send Email"})]}),(0,o.jsx)(i.default,{ref:t,onReady:e=>{}})]})},{})}))}},t={};function r(o){var n=t[o];if(void 0!==n)return n.exports;var l=t[o]={exports:{}};return e[o](l,l.exports,r),l.exports}r.m=e,r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},(()=>{var e,t=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__;r.t=function(o,n){if(1&n&&(o=this(o)),8&n||"object"==typeof o&&o&&(4&n&&o.__esModule||16&n&&"function"==typeof o.then))return o;var l=Object.create(null);r.r(l);var i={};e=e||[null,t({}),t([]),t(t)];for(var a=2&n&&o;"object"==typeof a&&!~e.indexOf(a);a=t(a))Object.getOwnPropertyNames(a).forEach(e=>{i[e]=()=>o[e]});return i.default=()=>o,r.d(l,i),l}})(),r.d=(e,t)=>{for(var o in t)r.o(t,o)&&!r.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},r.f={},r.e=e=>Promise.all(Object.keys(r.f).reduce((t,o)=>(r.f[o](e,t),t),[])),r.u=e=>"static/js/async/"+e+".4c722214.js",r.miniCssF=e=>""+e+".css",r.h=()=>"5c45a8d68b23f9be",r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={},t="email-generate:";r.l=function(o,n,l,i){if(e[o])return void e[o].push(n);if(void 0!==l)for(var a,u,s=document.getElementsByTagName("script"),d=0;d<s.length;d++){var c=s[d];if(c.getAttribute("src")==o||c.getAttribute("data-webpack")==t+l){a=c;break}}a||(u=!0,(a=document.createElement("script")).charset="utf-8",a.timeout=120,r.nc&&a.setAttribute("nonce",r.nc),a.setAttribute("data-webpack",t+l),a.src=o),e[o]=[n];var f=function(t,r){a.onerror=a.onload=null,clearTimeout(p);var n=e[o];if(delete e[o],a.parentNode&&a.parentNode.removeChild(a),n&&n.forEach(function(e){return e(r)}),t)return t(r)},p=setTimeout(f.bind(null,void 0,{type:"timeout",target:a}),12e4);a.onerror=f.bind(null,a.onerror),a.onload=f.bind(null,a.onload),u&&document.head.appendChild(a)}})(),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.nc=void 0,(()=>{var e=[];r.O=(t,o,n,l)=>{if(o){l=l||0;for(var i=e.length;i>0&&e[i-1][2]>l;i--)e[i]=e[i-1];e[i]=[o,n,l];return}for(var a=1/0,i=0;i<e.length;i++){for(var[o,n,l]=e[i],u=!0,s=0;s<o.length;s++)(!1&l||a>=l)&&Object.keys(r.O).every(e=>r.O[e](o[s]))?o.splice(s--,1):(u=!1,l<a&&(a=l));if(u){e.splice(i--,1);var d=n();void 0!==d&&(t=d)}}return t}})(),r.p="/",r.rv=()=>"1.3.10",(()=>{var e={980:0};r.f.j=function(t,o){var n=r.o(e,t)?e[t]:void 0;if(0!==n)if(n)o.push(n[2]);else{var l=new Promise((r,o)=>n=e[t]=[r,o]);o.push(n[2]=l);var i=r.p+r.u(t),a=Error();r.l(i,function(o){if(r.o(e,t)&&(0!==(n=e[t])&&(e[t]=void 0),n)){var l=o&&("load"===o.type?"missing":o.type),i=o&&o.target&&o.target.src;a.message="Loading chunk "+t+" failed.\n("+l+": "+i+")",a.name="ChunkLoadError",a.type=l,a.request=i,n[1](a)}},"chunk-"+t,t)}},r.O.j=t=>0===e[t];var t=(t,o)=>{var n,l,[i,a,u]=o,s=0;if(i.some(t=>0!==e[t])){for(n in a)r.o(a,n)&&(r.m[n]=a[n]);if(u)var d=u(r)}for(t&&t(o);s<i.length;s++)l=i[s],r.o(e,l)&&e[l]&&e[l][0](),e[l]=0;return r.O(d)},o=self.webpackChunkemail_generate=self.webpackChunkemail_generate||[];o.forEach(t.bind(null,0)),o.push=t.bind(null,o.push.bind(o))})(),r.ruid="bundler=rspack@1.3.10";var o=r.O(void 0,["361","951"],function(){return r(498)});o=r.O(o)})();