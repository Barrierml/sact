(()=>{"use strict";function t(t,e){let n;if(n=t.attrsMap[e]){t.attrsMap[e]=null;for(let n=0,o=t.attrs.length;n<o;n++)if(t.attrs[n].name===e){t.attrs.splice(n,1);break}}return n}function e(t){return t&&"object"==typeof t&&null!==t}const n=new RegExp("{{\\s*([\\w\\.]+)\\s*}}");function o(t){let e=n.exec(t);return!!e&&[e[1],e.index,e.index+e[0].length]}const r=/^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/,s=/^\s*((?:s-[\w-]+:|@|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/,i="[a-zA-Z_][\\-\\.0-9_a-zA-Z]*",l=`((?:${i}\\:)?${i})`,a=new RegExp(`^<${l}`),c=/^\s*(\/?)>/,f=new RegExp(`^<\\/${l}[^>]*>`),u=/^<!DOCTYPE [^>]+>/i,p=/^<!\--/,d=/^<!\[/;function h(t){let e={};for(let n of t)e[n.name]=n.value;return e}let m=0;const g=/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/;function $(e){let n;return(n=t(e,"s-for"))?function(t,e){const n=e.match(/([^]*?)\s+(?:in|of)\s+([^]*)/);if(!n)throw new Error("无效 s-for 表达式: "+e);return`_f_(${n[2]},function(${n[1].trim().replace("(","").replace(")","")}){\n      return ${$(t)}\n    })`}(e,n):(n=t(e,"s-if"))?function(t,e){return`(${e}) ? ${$(t)} : null`}(e,n):"template"===e.tagName?x(e):`_c_('${e.tagName}', ${function(e){if(!e.attrs.length)return"{}";let n="{",o="attrs:{",r={},s=!1,i=!1,l=!1,a="props:{";const c=t(e,"s:class")||t(e,"s-bind:class")||t(e,":class");c&&(n+=`class: ${c},`);const f=t(e,"class");f&&(n+=`staticClass: "${f}",`);for(let t=0,c=e.attrs.length;t<c;t++){let c=e.attrs[t],f=c.name,u=c.value;if(/^s-bind:|^:|s:/.test(f))f=f.replace(/^:|^s-bind:|^s:/,""),"style"===f?n+=`style: ${u},`:"key"===f?n+=`key: (${u}),`:/^(value|selected|checked|muted)$/.test(f)?(i=!0,a+=`"${f}": (${u}),`):(s=!0,o+=`"${f}": (${u}),`);else if(/^@|^s-on:|^s@/.test(f)){const t=y(f);f=v(f),l=!0,f=f.replace(/^@|^s-on:|s@/,""),b(r,f,u,t)}else s=!0,o+=`"${f}": (${JSON.stringify(u)}),`}return s&&(n+=o.slice(0,-1)+"},"),i&&(n+=a.slice(0,-1)+"},"),l&&(n+=function(t){let e="on:{";for(let n in t)e+=`"${n}":${A(t[n])},`;return e.slice(0,-1)+"}"}(r)),n.replace(/,$/,"")+"}"}(e)}, ${x(e)},${m++})`}function y(t){const e=t.match(/\.[^\.]+/g);if(e)return e.map((t=>t.slice(1)))}function v(t){return t.replace(/\.[^\.]+/g,"")}function b(t,e,n,o){const r=o&&o.indexOf("capture");r>-1&&(o.splice(r,1),e="!"+e);const s={value:n,modifiers:o},i=t[e];Array.isArray(i)?i.push(s):t[e]=i?[i,s]:s}const w={stop:"$event.stopPropagation();",prevent:"$event.preventDefault();"};function A(t){if(t){if(Array.isArray(t))return`[${t.map(A).join(",")}]`;if(t.modifiers&&t.modifiers.length){let e="function($event){";for(let n=0;n<t.modifiers.length;n++){let o=t.modifiers[n];e+=w[o]}return e+(g.test(t.value)?t.value+"()":t.value)+"}"}return g.test(t.value)?t.value:`function($event){${t.value}}`}return"function(){}"}function x(t){return t.children.length?"["+t.children.map((t=>t.tagName?$(t):function(t){if(" "===t)return'" "';{const e=function(t){if(!n.test(t))return null;let e,r="";for(;e=o(t);)0===e[1]?r+=`(${e[0]})+`:r+=`'${t.substring(0,e[1]).trim()}' +(${e[0]})+`,t=t.substring(e[2]);return t?r+="'"+t.trim()+"'":r=r.substr(0,r.length-1),r}(t);return e?"String("+e+")":JSON.stringify(t)}}(t))).join(",")+"]":"undefined"}function k(t,n,o){return new Proxy(n,{set(t,e,n,o){let r=Reflect.set(t,e,n,o);return function(t,e){let n=O.get(t);if(n){let t=n.get(e);if(t)for(let e of t)M(e)}}(t,e),r},get(n,o,r){const s=Reflect.get(n,o,r);return function(t,e,n){let o=O.get(t);o||O.set(t,o=new Map);let r=o.get(e);r||o.set(e,r=new Set),n&&!r.has(n)&&r.add(n)}(n,o,t),e(s)||Array.isArray(s)?k(t,s):s}})}const O=new WeakMap,_=[];let C=!1,R={},E=!1;function N(){C=!0}function S(){var t;C=!0,t=K,H.push((()=>{t&&t.call(undefined)})),P||(P=!0,L())}function M(t){let e=t.cid;E||R[e]||(R[e]=!0,_.push(t)),C||S()}function K(){let t;E=!0;for(let e=0;e<_.length;e++)t=_[e],t.notify&&t.notify();_.length=0,C=!1,E=!1,R={}}const H=[];let L,P=!1;function z(){P=!1;const t=H.slice(0);H.length=0;for(let e=0;e<t.length;e++)t[e]()}if("undefined"!=typeof Promise){const t=Promise.resolve();L=()=>{t.then(z)}}else if(isIE||"undefined"==typeof MutationObserver||!isNative(MutationObserver)&&"[object MutationObserverConstructor]"!==MutationObserver.toString())L="undefined"!=typeof setImmediate&&isNative(setImmediate)?()=>{setImmediate(z)}:()=>{setTimeout(z,0)};else{let t=1;const e=new MutationObserver(z),n=document.createTextNode(String(t));e.observe(n,{characterData:!0}),L=()=>{t=(t+1)%2,n.data=String(t)}}class T{constructor(t,e,n,o,r,s,i){this.context=t,this.tag=s?"_text_":e,this.data=n,this.componentOptions=r,this.parent=void 0,this.text=s?e:void 0,this.key=n?.key,this.element=void 0,this.zid=i,this.children=j(o,t,this)}getParentEle(){let t=this.parent;for(;t&&!t.element;)t=t.parent;return t?.element}}function j(t,e,n){let o=[];if(t){for(let r of t)Array.isArray(r)?o=o.concat(j(r,e,n)):"string"==typeof r?o.push(new T(e,r,void 0,void 0,void 0,!0)):r&&o.push(r);return o.map((t=>(t.parent=n,t)))}}function I(t,n){t.$options=n,function(t){const e=t.$options;t.callHooks=function(n){let o=e[n];o&&"function"==typeof o&&o.apply(t)}}(t),t.callHooks("beforeCreate"),function(t){const e=t.$options;let{props:n}=e;"function"==typeof n?t.props=n():n&&(t.props=n)}(t),function(t){const e=t.$options;e.ele&&(t.$ele=document.querySelector(e.ele),t.$template=t.$ele.outerHTML),e.template&&(t.$template=e.template)}(t),function(t){const n=t.$options;if(e(n.method)){let{method:e}=n;for(let o of Reflect.ownKeys(e)){if("function"===(e[o],!1))throw new Error(`${o} 不为function，请检查！`);t[o]=n.method[o].bind(t)}}t._c_=(e,n,o,r)=>function(t,e,n,o,r){const{componentList:s,components:i}=t;return s&&s.includes(e)?function(t,e,n,o,r,s){return new T(n,"sact-component-"+s+"-"+r,e,void 0,{Ctor:t,tag:r,children:j(o)},!1,s)}(i[e],n,t,o,e,r):"slot"===e?function(t,e,n){if(t.$slot){let n=e?.attrs?.name;return n?t.$slot[n]||null:t.$slot.default}return n}(t,n,o):new T(t,e,n,o,void 0,!1,r)}(t,e,n,o,r),t._f_=(t,e)=>function(t,e){let n=[];if(Array.isArray(t))n=t.map(e);else if("object"==typeof t){let o=0;for(let r of Reflect.ownKeys(t))n.push(e(r,o))}else if("string"==typeof t)for(let o of t)n.push(e(o));return n}(t,e)}(t),function(t){const e=t.$options;let n=e.data;e.data&&"function"==typeof e.data&&(n=n.apply(t)),!1===e.reactive?t.data=n:t.data=k(t,n||{})}(t),function(t){const n=t.$options;let{isComponent:o,component:r,isAbstract:s}=n;if(o&&(t.isComponent=!0,t.isAbstract=s,t.name=n.name),t.componentList=[],e(r))for(let e of Reflect.ownKeys(r))t.componentList.push(e);t.components=r||{},t.cid=Number.parseInt(100*Math.random())}(t),function(t){const e=t.$options;!0===t.isAbstract?t._render=()=>null:(t.$createVnode=function(t){const e=$(t);return new Function(`with(this){\n        with(data){\n             return ${e}\n        }\n    }`)}(function(t){const e=[];let n,o,i,l=0;for(;t;){n=t;let o,r,s,l=t.indexOf("<");if(0===l){if(p.test(t)){const e=t.indexOf("--\x3e");if(e>=0){m(e+3);continue}}const e=t.match(u);if(e){console.log("处理html声明"),m(e[0].length);continue}const n=t.match(f);if(n){m(n[0].length),$(n[1]);continue}const o=g();o&&y(o)}if(l>=0){for(r=t.slice(l);!(f.test(r)||a.test(r)||p.test(r)||d.test(r)||(s=r.indexOf("<",1),s<0));)l+=s,r=t.slice(l);o=t.substring(0,l)}l<0&&(o=t),o&&(m(o.length),o.replace(/\s+/g,"")&&(i?e[e.length-1].children.push(o):i=o))}return i;function m(e){l+=e,t=t.substring(e)}function g(){const e=t.match(a);if(e){const n={tagName:e[1],attrs:[],start:l};let o,i;for(m(e[0].length);!(o=t.match(c))&&(i=t.match(s)||t.match(r));)i.start=l,m(i[0].length),i.end=l,n.attrs.push(i);if(o)return n.unarySlash=o[1],m(o[0].length),n.end=l,n}}function $(t,n,r){let s,i;if(t){for(i=t.toLowerCase(),s=e.length-1;s>=0&&e[s].tagName!==i;s--);if(s>=0)for(let t=e.length-1;t>s;t--)e[s].children.push(e[t]),e[t].parent=e[s];s&&(e[s].parent=e[s-1],e[s-1].children.push(e[s])),o=s?e[s-1]:e[s],e.length=s}else console.log("标签：《"+t+"》,没有找到闭合的标签！")}function y(t){let n=t.tagName,r=t.unarySlash,[s,l]=function(e){const n=e.length,o=new Array(n);for(let e=0;e<n;e++){const n=t.attrs[e],r=n[3]||n[4]||n[5]||"";o[e]={name:n[1],value:r}}return[o,h(o)]}(t.attrs),a={tagName:n,attrs:s,attrsMap:l,children:[]};i||(i=a),r||"input"===n?(a.parent=o,i&&i!==a&&e[e.length-1].children.push(a)):e.push(a)}}(t.$template)),t._render=()=>t.$createVnode.apply(t));let{render:n}=e;n&&"function"==typeof n&&(t._render=e=>n.apply(t,[t._c_,e]))}(t),t.callHooks("created"),function(t){let e=t.getplug();if(e)for(let n of e)n.install&&n.install.call(n,t)}(t)}const Z={insert(t,e,n){n?e.insertBefore(t,n):e.appendChild(t)},remove(t){const e=t.parentNode;e&&e.removeChild(t)},replace(t,e){const n=t.parentNode;n&&n.replaceChild(e,t)},next:t=>t?.nextElementSibling,pre:t=>t?.previousElementSibling,setElementText(t,e){t.textContent=e},setAttribute(t,e,n){t.setAttribute(e,n)},removeAttribute(t,e){t.removeAttribute(e)}};function D(t,e){if(e){let n;n=U(t),Z.replace(e,n)}else{let e=t.warpSact.wrapVnode,n=e.getParentEle(),o=t.element||U(t),r=e.parent.children.indexOf(e)-1,s=e.parent.children[r].element;Z.insert(o,n,Z.next(s))}}function V(t,e){var n,o,r,s;"_text_"===t.tag?t.text!==e.text&&(s=e.text,t.element.textContent=s):t.componentOptions&&e.componentOptions?function(t,e){let n=t.componentOptions.Ctor;n.$slot=W(e.componentOptions.children),n.props=Y(n,e.data),n.patch(),e.componentOptions.Ctor=n}(t,e):(function(t,e){let n,o=t.data,r=e.data;F(o,r,"class")||(n=r.staticClass||"",Z.setAttribute(t.element,"class",n+" "+r.class)),F(o,r,"style")||Z.setAttribute(t.element,"style",r.style),B(o.attrs,r.attrs,"attrs",t.element),B(o.props,r.props,"props",t.element)}(t,e),n=t.children,o=e.children,r=t.element,n?.length>0&&0===o?.length?n.forEach((t=>{G(t)})):0===n?.length&&o?.length>0?Q(r,o):1===n?.length&&1===o?.length&&J(n[0],o[0])?V(n[0],o[0]):n&&o&&function(t,e,n){let o,r,s=0,i=0,l=e.length-1,a=n.length-1,c=e[0],f=n[0],u=e[l],p=n[a];for(;s<=l&&i<=a;)if(J(c,f))V(c,f),c=e[++s],f=n[++i];else{if(!J(u,p))break;V(u,p),u=e[--l],p=n[--a]}--s<l&&(o=e.slice(s+1,l+1)),--i<a&&(r=n.slice(i+1,a+1)),o||(o=[]),r||(r=[]);let d=e[s];for(let e of r){let n=!1;for(let r of o)if(!r.patched&&J(e,r)){Z.insert(r.element,t,Z.next(d.element)),q(e,r)&&(e.componentOptions=r.componentOptions),e.element=r.element,r.patched=!0,d=e,n=!0;break}if(!n){let n=U(e);Z.insert(n,t,Z.next(d?.element)),d=e}}for(let t of o)t.patched||G(t)}(r,n,o)),e.element=t.element}function J(t,e){return t?.tag===e?.tag&&t?.key===e?.key}function q(t,e){return t.componentOptions&&e.componentOptions}function B(t,e,n,o){let r=[];if(e&&t){for(let s of Reflect.ownKeys(e))F(e,t,s)||("attrs"===n?Z.setAttribute(o,s,e[s]):o[s]=e[s],r.push(s));for(let s of Reflect.ownKeys(t))F(e,t,s)||r.includes(s)||("attrs"===n?Z.removeAttribute(o,s):o[newAttr]=null)}}function F(t,e,n){return t[n]===e[n]}function U(t){if("_text_"===t.tag)return t.element=document.createTextNode(t.text),t.element;if(t.componentOptions)return function(t,e){let{Ctor:n,children:o}=e,{key:r,data:s}=t;n=e.Ctor=n(),n.wrapVnode=t;let i=Y(n,s);n.$slot=W(o);let l=null,a=n.$vnode=n._render(i);return n.callHooks("beforeMount"),a&&(l=n.$ele=n.$vnode.element=t.element=U(a),Z.setAttribute(l,t.tag,""),r&&Z.setAttribute(l,"key",r)),n.callHooks("mounted"),l}(t,t.componentOptions);let{tag:e,data:n,children:o,key:r}=t,s=t.element=document.createElement(e);return n&&function(t,e,n){let o="";for(let r of Reflect.ownKeys(e)){switch(r){case"attrs":et(t,e[r]);break;case"on":tt(t,e[r],n);break;case"props":X(t,e[r]);break;default:"staticClass"===r||"class"===r?o+=e[r]+" ":Z.setAttribute(t,r,e[r])}""!==o&&Z.setAttribute(t,"class",o)}}(s,n,t.context),o&&Q(s,o),r&&Z.setAttribute(s,"key",r),t.element=s,s}function W(t){let e={};if(Array.isArray(t))return e.default=t,e}function Y(t,n){let o=t.props;o||(t.props=o={});let{attrs:r,on:s,props:i}=n;for(let t of[r,s,i])if(e(t))for(let e of Reflect.ownKeys(t))o[e]=r[e];return o}function G(t){t.componentOptions&&t.componentOptions.Ctor.destory(),Z.remove(t.element)}function Q(t,e){if(Array.isArray(e))for(let n of e){let e=U(n);Array.isArray(e)?e.map((e=>{t.appendChild(e)})):e&&t.appendChild(e)}}function X(t,e){for(let n of Reflect.ownKeys(e))t[n]=e[n]}function tt(t,e,n){for(let o of Reflect.ownKeys(e))t.addEventListener(o,(function(){if("function"!=typeof e[o])throw new Error(`${o} 不是一个合法的函数，请检查！`);N(),e[o].apply(n,arguments),S()}))}function et(t,e){for(let n of Reflect.ownKeys(e))Z.setAttribute(t,n,e[n])}const nt=[];class ot{constructor(t){this.$ele=void 0,I(this,t),!this.isComponent&&this.render()}getplug(){return nt}render(){this.$vnode=this._render(),this.callHooks("beforeMount"),D(this.$vnode,this.$ele),this.callHooks("mounted")}patch(){let t=this.$vnode;var e,n;this.$vnode=this._render(this.props),this.$vnode&&(this.$vnode.warpSact=this),this.callHooks("beforeUpdate"),(e=t)!==(n=this.$vnode)&&(e&&!n?G(e):J(e,n)?V(e,n):D(n,e?.element)),this.callHooks("update")}notify(){this.patch()}destory(){this.callHooks("beforeDestory"),function(t){for(let e of Reflect.ownKeys(O))for(let n of Reflect.ownKeys(e))e[n].has(t)&&e[n].delete(t)}(this)}}ot.component=function(t){return function(){return new ot({...t,isComponent:!0})}},ot.use=function(t){nt.push(t)};const rt=ot.component({name:"keep-alive",data:()=>({old:!0,cache:[]}),isAbstract:!0,reactive:!1,mounted(){let t=this.$slot.default[0];t&&(this.data.cache[0]=t)},render(){let t=this.$slot.default[0];return t&&1===this.data.cache?.length&&!this.data.old?(this.data.old=!0,this.data.cache[0]):t?(this.data.cache[0]=t,this.data.old=!0,t):void(this.data.old=!1)}}),st={install(t){t.componentList.push("keep-alive"),t.components["keep-alive"]=rt}};ot.use(st),window.Sact=ot})();