(()=>{"use strict";var e={498:function(e,r,o){var n=o(893),t=o(294),l=o(745),i=o(900),a=o(482);let d=a.ZP.div`
  flex: 1;
  background-color:rgb(0, 47, 167);
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
`,s=document.getElementById("root");s&&l.createRoot(s).render((0,n.jsx)(t.StrictMode,{children:(0,n.jsx)(e=>{let r=(0,t.useRef)(null),[o,l]=(0,t.useState)(!1);return(0,n.jsxs)("div",{className:"App",id:"App",children:[(0,n.jsxs)(d,{children:[(0,n.jsxs)("button",{onClick:()=>{var e;let n=null==(e=r.current)?void 0:e.editor;o?(null==n||n.hidePreview(),l(!1)):(null==n||n.showPreview("desktop"),l(!0))},children:[o?"Hide":"Show"," Preview"]}),(0,n.jsx)("button",{onClick:()=>{var e;let o=null==(e=r.current)?void 0:e.editor;null==o||o.saveDesign(e=>{console.log("saveDesign",e),alert("Design JSON has been logged in your developer console.")})},children:"Save Design"}),(0,n.jsx)("button",{onClick:()=>{var e;let o=null==(e=r.current)?void 0:e.editor;null==o||o.exportHtml(e=>{let{design:r,html:o}=e;console.log("exportHtml----",o)})},children:"Export HTML"})]}),(0,n.jsx)(i.default,{ref:r,onReady:e=>{}})]})},{})}))}},r={};function o(n){var t=r[n];if(void 0!==t)return t.exports;var l=r[n]={exports:{}};return e[n](l,l.exports,o),l.exports}o.m=e,o.n=e=>{var r=e&&e.__esModule?()=>e.default:()=>e;return o.d(r,{a:r}),r},o.d=(e,r)=>{for(var n in r)o.o(r,n)&&!o.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:r[n]})},o.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),o.nc=void 0,(()=>{var e=[];o.O=(r,n,t,l)=>{if(n){l=l||0;for(var i=e.length;i>0&&e[i-1][2]>l;i--)e[i]=e[i-1];e[i]=[n,t,l];return}for(var a=1/0,i=0;i<e.length;i++){for(var[n,t,l]=e[i],d=!0,s=0;s<n.length;s++)(!1&l||a>=l)&&Object.keys(o.O).every(e=>o.O[e](n[s]))?n.splice(s--,1):(d=!1,l<a&&(a=l));if(d){e.splice(i--,1);var u=t();void 0!==u&&(r=u)}}return r}})(),o.rv=()=>"1.3.10",(()=>{var e={980:0};o.O.j=r=>0===e[r];var r=(r,n)=>{var t,l,[i,a,d]=n,s=0;if(i.some(r=>0!==e[r])){for(t in a)o.o(a,t)&&(o.m[t]=a[t]);if(d)var u=d(o)}for(r&&r(n);s<i.length;s++)l=i[s],o.o(e,l)&&e[l]&&e[l][0](),e[l]=0;return o.O(u)},n=self.webpackChunkemail_generate=self.webpackChunkemail_generate||[];n.forEach(r.bind(null,0)),n.push=r.bind(null,n.push.bind(n))})(),o.ruid="bundler=rspack@1.3.10";var n=o.O(void 0,["361","305"],function(){return o(498)});n=o.O(n)})();