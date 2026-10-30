// Resonance line-lyric timing engine. No audio capture or external runtime dependency.
(() => {
  /* Bundled js-yaml 4.1.1, MIT license:
(The MIT License)

Copyright (C) 2011-2015 by Vitaly Puzrin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

  */
  const LyricYAML=(()=>{const exports={};const module={exports};
/*! js-yaml 4.1.1 https://github.com/nodeca/js-yaml @license MIT */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).jsyaml={})}(this,function(e){"use strict";function t(e){return null==e}var n={isNothing:t,isObject:function(e){return"object"==typeof e&&null!==e},toArray:function(e){return Array.isArray(e)?e:t(e)?[]:[e]},repeat:function(e,t){var n,i="";for(n=0;n<t;n+=1)i+=e;return i},isNegativeZero:function(e){return 0===e&&Number.NEGATIVE_INFINITY===1/e},extend:function(e,t){var n,i,r,o;if(t)for(n=0,i=(o=Object.keys(t)).length;n<i;n+=1)e[r=o[n]]=t[r];return e}};function i(e,t){var n="",i=e.reason||"(unknown reason)";return e.mark?(e.mark.name&&(n+='in "'+e.mark.name+'" '),n+="("+(e.mark.line+1)+":"+(e.mark.column+1)+")",!t&&e.mark.snippet&&(n+="\n\n"+e.mark.snippet),i+" "+n):i}function r(e,t){Error.call(this),this.name="YAMLException",this.reason=e,this.mark=t,this.message=i(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=(new Error).stack||""}r.prototype=Object.create(Error.prototype),r.prototype.constructor=r,r.prototype.toString=function(e){return this.name+": "+i(this,e)};var o=r;function a(e,t,n,i,r){var o="",a="",l=Math.floor(r/2)-1;return i-t>l&&(t=i-l+(o=" ... ").length),n-i>l&&(n=i+l-(a=" ...").length),{str:o+e.slice(t,n).replace(/\t/g,"→")+a,pos:i-t+o.length}}function l(e,t){return n.repeat(" ",t-e.length)+e}var c=function(e,t){if(t=Object.create(t||null),!e.buffer)return null;t.maxLength||(t.maxLength=79),"number"!=typeof t.indent&&(t.indent=1),"number"!=typeof t.linesBefore&&(t.linesBefore=3),"number"!=typeof t.linesAfter&&(t.linesAfter=2);for(var i,r=/\r?\n|\r|\0/g,o=[0],c=[],s=-1;i=r.exec(e.buffer);)c.push(i.index),o.push(i.index+i[0].length),e.position<=i.index&&s<0&&(s=o.length-2);s<0&&(s=o.length-1);var u,p,f="",d=Math.min(e.line+t.linesAfter,c.length).toString().length,h=t.maxLength-(t.indent+d+3);for(u=1;u<=t.linesBefore&&!(s-u<0);u++)p=a(e.buffer,o[s-u],c[s-u],e.position-(o[s]-o[s-u]),h),f=n.repeat(" ",t.indent)+l((e.line-u+1).toString(),d)+" | "+p.str+"\n"+f;for(p=a(e.buffer,o[s],c[s],e.position,h),f+=n.repeat(" ",t.indent)+l((e.line+1).toString(),d)+" | "+p.str+"\n",f+=n.repeat("-",t.indent+d+3+p.pos)+"^\n",u=1;u<=t.linesAfter&&!(s+u>=c.length);u++)p=a(e.buffer,o[s+u],c[s+u],e.position-(o[s]-o[s+u]),h),f+=n.repeat(" ",t.indent)+l((e.line+u+1).toString(),d)+" | "+p.str+"\n";return f.replace(/\n$/,"")},s=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],u=["scalar","sequence","mapping"];var p=function(e,t){if(t=t||{},Object.keys(t).forEach(function(t){if(-1===s.indexOf(t))throw new o('Unknown option "'+t+'" is met in definition of "'+e+'" YAML type.')}),this.options=t,this.tag=e,this.kind=t.kind||null,this.resolve=t.resolve||function(){return!0},this.construct=t.construct||function(e){return e},this.instanceOf=t.instanceOf||null,this.predicate=t.predicate||null,this.represent=t.represent||null,this.representName=t.representName||null,this.defaultStyle=t.defaultStyle||null,this.multi=t.multi||!1,this.styleAliases=function(e){var t={};return null!==e&&Object.keys(e).forEach(function(n){e[n].forEach(function(e){t[String(e)]=n})}),t}(t.styleAliases||null),-1===u.indexOf(this.kind))throw new o('Unknown kind "'+this.kind+'" is specified for "'+e+'" YAML type.')};function f(e,t){var n=[];return e[t].forEach(function(e){var t=n.length;n.forEach(function(n,i){n.tag===e.tag&&n.kind===e.kind&&n.multi===e.multi&&(t=i)}),n[t]=e}),n}function d(e){return this.extend(e)}d.prototype.extend=function(e){var t=[],n=[];if(e instanceof p)n.push(e);else if(Array.isArray(e))n=n.concat(e);else{if(!e||!Array.isArray(e.implicit)&&!Array.isArray(e.explicit))throw new o("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");e.implicit&&(t=t.concat(e.implicit)),e.explicit&&(n=n.concat(e.explicit))}t.forEach(function(e){if(!(e instanceof p))throw new o("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(e.loadKind&&"scalar"!==e.loadKind)throw new o("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(e.multi)throw new o("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),n.forEach(function(e){if(!(e instanceof p))throw new o("Specified list of YAML types (or a single Type object) contains a non-Type object.")});var i=Object.create(d.prototype);return i.implicit=(this.implicit||[]).concat(t),i.explicit=(this.explicit||[]).concat(n),i.compiledImplicit=f(i,"implicit"),i.compiledExplicit=f(i,"explicit"),i.compiledTypeMap=function(){var e,t,n={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}};function i(e){e.multi?(n.multi[e.kind].push(e),n.multi.fallback.push(e)):n[e.kind][e.tag]=n.fallback[e.tag]=e}for(e=0,t=arguments.length;e<t;e+=1)arguments[e].forEach(i);return n}(i.compiledImplicit,i.compiledExplicit),i};var h=d,g=new p("tag:yaml.org,2002:str",{kind:"scalar",construct:function(e){return null!==e?e:""}}),m=new p("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(e){return null!==e?e:[]}}),y=new p("tag:yaml.org,2002:map",{kind:"mapping",construct:function(e){return null!==e?e:{}}}),b=new h({explicit:[g,m,y]});var A=new p("tag:yaml.org,2002:null",{kind:"scalar",resolve:function(e){if(null===e)return!0;var t=e.length;return 1===t&&"~"===e||4===t&&("null"===e||"Null"===e||"NULL"===e)},construct:function(){return null},predicate:function(e){return null===e},represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});var v=new p("tag:yaml.org,2002:bool",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t=e.length;return 4===t&&("true"===e||"True"===e||"TRUE"===e)||5===t&&("false"===e||"False"===e||"FALSE"===e)},construct:function(e){return"true"===e||"True"===e||"TRUE"===e},predicate:function(e){return"[object Boolean]"===Object.prototype.toString.call(e)},represent:{lowercase:function(e){return e?"true":"false"},uppercase:function(e){return e?"TRUE":"FALSE"},camelcase:function(e){return e?"True":"False"}},defaultStyle:"lowercase"});function w(e){return 48<=e&&e<=57||65<=e&&e<=70||97<=e&&e<=102}function k(e){return 48<=e&&e<=55}function C(e){return 48<=e&&e<=57}var x=new p("tag:yaml.org,2002:int",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t,n=e.length,i=0,r=!1;if(!n)return!1;if("-"!==(t=e[i])&&"+"!==t||(t=e[++i]),"0"===t){if(i+1===n)return!0;if("b"===(t=e[++i])){for(i++;i<n;i++)if("_"!==(t=e[i])){if("0"!==t&&"1"!==t)return!1;r=!0}return r&&"_"!==t}if("x"===t){for(i++;i<n;i++)if("_"!==(t=e[i])){if(!w(e.charCodeAt(i)))return!1;r=!0}return r&&"_"!==t}if("o"===t){for(i++;i<n;i++)if("_"!==(t=e[i])){if(!k(e.charCodeAt(i)))return!1;r=!0}return r&&"_"!==t}}if("_"===t)return!1;for(;i<n;i++)if("_"!==(t=e[i])){if(!C(e.charCodeAt(i)))return!1;r=!0}return!(!r||"_"===t)},construct:function(e){var t,n=e,i=1;if(-1!==n.indexOf("_")&&(n=n.replace(/_/g,"")),"-"!==(t=n[0])&&"+"!==t||("-"===t&&(i=-1),t=(n=n.slice(1))[0]),"0"===n)return 0;if("0"===t){if("b"===n[1])return i*parseInt(n.slice(2),2);if("x"===n[1])return i*parseInt(n.slice(2),16);if("o"===n[1])return i*parseInt(n.slice(2),8)}return i*parseInt(n,10)},predicate:function(e){return"[object Number]"===Object.prototype.toString.call(e)&&e%1==0&&!n.isNegativeZero(e)},represent:{binary:function(e){return e>=0?"0b"+e.toString(2):"-0b"+e.toString(2).slice(1)},octal:function(e){return e>=0?"0o"+e.toString(8):"-0o"+e.toString(8).slice(1)},decimal:function(e){return e.toString(10)},hexadecimal:function(e){return e>=0?"0x"+e.toString(16).toUpperCase():"-0x"+e.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),I=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var S=/^[-+]?[0-9]+e/;var O=new p("tag:yaml.org,2002:float",{kind:"scalar",resolve:function(e){return null!==e&&!(!I.test(e)||"_"===e[e.length-1])},construct:function(e){var t,n;return n="-"===(t=e.replace(/_/g,"").toLowerCase())[0]?-1:1,"+-".indexOf(t[0])>=0&&(t=t.slice(1)),".inf"===t?1===n?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:".nan"===t?NaN:n*parseFloat(t,10)},predicate:function(e){return"[object Number]"===Object.prototype.toString.call(e)&&(e%1!=0||n.isNegativeZero(e))},represent:function(e,t){var i;if(isNaN(e))switch(t){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===e)switch(t){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===e)switch(t){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(n.isNegativeZero(e))return"-0.0";return i=e.toString(10),S.test(i)?i.replace("e",".e"):i},defaultStyle:"lowercase"}),j=b.extend({implicit:[A,v,x,O]}),T=j,N=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),F=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");var E=new p("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:function(e){return null!==e&&(null!==N.exec(e)||null!==F.exec(e))},construct:function(e){var t,n,i,r,o,a,l,c,s=0,u=null;if(null===(t=N.exec(e))&&(t=F.exec(e)),null===t)throw new Error("Date resolve error");if(n=+t[1],i=+t[2]-1,r=+t[3],!t[4])return new Date(Date.UTC(n,i,r));if(o=+t[4],a=+t[5],l=+t[6],t[7]){for(s=t[7].slice(0,3);s.length<3;)s+="0";s=+s}return t[9]&&(u=6e4*(60*+t[10]+ +(t[11]||0)),"-"===t[9]&&(u=-u)),c=new Date(Date.UTC(n,i,r,o,a,l,s)),u&&c.setTime(c.getTime()-u),c},instanceOf:Date,represent:function(e){return e.toISOString()}});var M=new p("tag:yaml.org,2002:merge",{kind:"scalar",resolve:function(e){return"<<"===e||null===e}}),L="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";var _=new p("tag:yaml.org,2002:binary",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t,n,i=0,r=e.length,o=L;for(n=0;n<r;n++)if(!((t=o.indexOf(e.charAt(n)))>64)){if(t<0)return!1;i+=6}return i%8==0},construct:function(e){var t,n,i=e.replace(/[\r\n=]/g,""),r=i.length,o=L,a=0,l=[];for(t=0;t<r;t++)t%4==0&&t&&(l.push(a>>16&255),l.push(a>>8&255),l.push(255&a)),a=a<<6|o.indexOf(i.charAt(t));return 0===(n=r%4*6)?(l.push(a>>16&255),l.push(a>>8&255),l.push(255&a)):18===n?(l.push(a>>10&255),l.push(a>>2&255)):12===n&&l.push(a>>4&255),new Uint8Array(l)},predicate:function(e){return"[object Uint8Array]"===Object.prototype.toString.call(e)},represent:function(e){var t,n,i="",r=0,o=e.length,a=L;for(t=0;t<o;t++)t%3==0&&t&&(i+=a[r>>18&63],i+=a[r>>12&63],i+=a[r>>6&63],i+=a[63&r]),r=(r<<8)+e[t];return 0===(n=o%3)?(i+=a[r>>18&63],i+=a[r>>12&63],i+=a[r>>6&63],i+=a[63&r]):2===n?(i+=a[r>>10&63],i+=a[r>>4&63],i+=a[r<<2&63],i+=a[64]):1===n&&(i+=a[r>>2&63],i+=a[r<<4&63],i+=a[64],i+=a[64]),i}}),D=Object.prototype.hasOwnProperty,U=Object.prototype.toString;var q=new p("tag:yaml.org,2002:omap",{kind:"sequence",resolve:function(e){if(null===e)return!0;var t,n,i,r,o,a=[],l=e;for(t=0,n=l.length;t<n;t+=1){if(i=l[t],o=!1,"[object Object]"!==U.call(i))return!1;for(r in i)if(D.call(i,r)){if(o)return!1;o=!0}if(!o)return!1;if(-1!==a.indexOf(r))return!1;a.push(r)}return!0},construct:function(e){return null!==e?e:[]}}),Y=Object.prototype.toString;var R=new p("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:function(e){if(null===e)return!0;var t,n,i,r,o,a=e;for(o=new Array(a.length),t=0,n=a.length;t<n;t+=1){if(i=a[t],"[object Object]"!==Y.call(i))return!1;if(1!==(r=Object.keys(i)).length)return!1;o[t]=[r[0],i[r[0]]]}return!0},construct:function(e){if(null===e)return[];var t,n,i,r,o,a=e;for(o=new Array(a.length),t=0,n=a.length;t<n;t+=1)i=a[t],r=Object.keys(i),o[t]=[r[0],i[r[0]]];return o}}),B=Object.prototype.hasOwnProperty;var K=new p("tag:yaml.org,2002:set",{kind:"mapping",resolve:function(e){if(null===e)return!0;var t,n=e;for(t in n)if(B.call(n,t)&&null!==n[t])return!1;return!0},construct:function(e){return null!==e?e:{}}}),P=T.extend({implicit:[E,M],explicit:[_,q,R,K]}),W=Object.prototype.hasOwnProperty,H=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,$=/[\x85\u2028\u2029]/,G=/[,\[\]\{\}]/,V=/^(?:!|!!|![a-z\-]+!)$/i,Z=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function J(e){return Object.prototype.toString.call(e)}function Q(e){return 10===e||13===e}function z(e){return 9===e||32===e}function X(e){return 9===e||32===e||10===e||13===e}function ee(e){return 44===e||91===e||93===e||123===e||125===e}function te(e){var t;return 48<=e&&e<=57?e-48:97<=(t=32|e)&&t<=102?t-97+10:-1}function ne(e){return 120===e?2:117===e?4:85===e?8:0}function ie(e){return 48<=e&&e<=57?e-48:-1}function re(e){return 48===e?"\0":97===e?"":98===e?"\b":116===e||9===e?"\t":110===e?"\n":118===e?"\v":102===e?"\f":114===e?"\r":101===e?"":32===e?" ":34===e?'"':47===e?"/":92===e?"\\":78===e?"":95===e?" ":76===e?"\u2028":80===e?"\u2029":""}function oe(e){return e<=65535?String.fromCharCode(e):String.fromCharCode(55296+(e-65536>>10),56320+(e-65536&1023))}function ae(e,t,n){"__proto__"===t?Object.defineProperty(e,t,{configurable:!0,enumerable:!0,writable:!0,value:n}):e[t]=n}for(var le=new Array(256),ce=new Array(256),se=0;se<256;se++)le[se]=re(se)?1:0,ce[se]=re(se);function ue(e,t){this.input=e,this.filename=t.filename||null,this.schema=t.schema||P,this.onWarning=t.onWarning||null,this.legacy=t.legacy||!1,this.json=t.json||!1,this.listener=t.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function pe(e,t){var n={name:e.filename,buffer:e.input.slice(0,-1),position:e.position,line:e.line,column:e.position-e.lineStart};return n.snippet=c(n),new o(t,n)}function fe(e,t){throw pe(e,t)}function de(e,t){e.onWarning&&e.onWarning.call(null,pe(e,t))}var he={YAML:function(e,t,n){var i,r,o;null!==e.version&&fe(e,"duplication of %YAML directive"),1!==n.length&&fe(e,"YAML directive accepts exactly one argument"),null===(i=/^([0-9]+)\.([0-9]+)$/.exec(n[0]))&&fe(e,"ill-formed argument of the YAML directive"),r=parseInt(i[1],10),o=parseInt(i[2],10),1!==r&&fe(e,"unacceptable YAML version of the document"),e.version=n[0],e.checkLineBreaks=o<2,1!==o&&2!==o&&de(e,"unsupported YAML version of the document")},TAG:function(e,t,n){var i,r;2!==n.length&&fe(e,"TAG directive accepts exactly two arguments"),i=n[0],r=n[1],V.test(i)||fe(e,"ill-formed tag handle (first argument) of the TAG directive"),W.call(e.tagMap,i)&&fe(e,'there is a previously declared suffix for "'+i+'" tag handle'),Z.test(r)||fe(e,"ill-formed tag prefix (second argument) of the TAG directive");try{r=decodeURIComponent(r)}catch(t){fe(e,"tag prefix is malformed: "+r)}e.tagMap[i]=r}};function ge(e,t,n,i){var r,o,a,l;if(t<n){if(l=e.input.slice(t,n),i)for(r=0,o=l.length;r<o;r+=1)9===(a=l.charCodeAt(r))||32<=a&&a<=1114111||fe(e,"expected valid JSON character");else H.test(l)&&fe(e,"the stream contains non-printable characters");e.result+=l}}function me(e,t,i,r){var o,a,l,c;for(n.isObject(i)||fe(e,"cannot merge mappings; the provided source object is unacceptable"),l=0,c=(o=Object.keys(i)).length;l<c;l+=1)a=o[l],W.call(t,a)||(ae(t,a,i[a]),r[a]=!0)}function ye(e,t,n,i,r,o,a,l,c){var s,u;if(Array.isArray(r))for(s=0,u=(r=Array.prototype.slice.call(r)).length;s<u;s+=1)Array.isArray(r[s])&&fe(e,"nested arrays are not supported inside keys"),"object"==typeof r&&"[object Object]"===J(r[s])&&(r[s]="[object Object]");if("object"==typeof r&&"[object Object]"===J(r)&&(r="[object Object]"),r=String(r),null===t&&(t={}),"tag:yaml.org,2002:merge"===i)if(Array.isArray(o))for(s=0,u=o.length;s<u;s+=1)me(e,t,o[s],n);else me(e,t,o,n);else e.json||W.call(n,r)||!W.call(t,r)||(e.line=a||e.line,e.lineStart=l||e.lineStart,e.position=c||e.position,fe(e,"duplicated mapping key")),ae(t,r,o),delete n[r];return t}function be(e){var t;10===(t=e.input.charCodeAt(e.position))?e.position++:13===t?(e.position++,10===e.input.charCodeAt(e.position)&&e.position++):fe(e,"a line break is expected"),e.line+=1,e.lineStart=e.position,e.firstTabInLine=-1}function Ae(e,t,n){for(var i=0,r=e.input.charCodeAt(e.position);0!==r;){for(;z(r);)9===r&&-1===e.firstTabInLine&&(e.firstTabInLine=e.position),r=e.input.charCodeAt(++e.position);if(t&&35===r)do{r=e.input.charCodeAt(++e.position)}while(10!==r&&13!==r&&0!==r);if(!Q(r))break;for(be(e),r=e.input.charCodeAt(e.position),i++,e.lineIndent=0;32===r;)e.lineIndent++,r=e.input.charCodeAt(++e.position)}return-1!==n&&0!==i&&e.lineIndent<n&&de(e,"deficient indentation"),i}function ve(e){var t,n=e.position;return!(45!==(t=e.input.charCodeAt(n))&&46!==t||t!==e.input.charCodeAt(n+1)||t!==e.input.charCodeAt(n+2)||(n+=3,0!==(t=e.input.charCodeAt(n))&&!X(t)))}function we(e,t){1===t?e.result+=" ":t>1&&(e.result+=n.repeat("\n",t-1))}function ke(e,t){var n,i,r=e.tag,o=e.anchor,a=[],l=!1;if(-1!==e.firstTabInLine)return!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=a),i=e.input.charCodeAt(e.position);0!==i&&(-1!==e.firstTabInLine&&(e.position=e.firstTabInLine,fe(e,"tab characters must not be used in indentation")),45===i)&&X(e.input.charCodeAt(e.position+1));)if(l=!0,e.position++,Ae(e,!0,-1)&&e.lineIndent<=t)a.push(null),i=e.input.charCodeAt(e.position);else if(n=e.line,Ie(e,t,3,!1,!0),a.push(e.result),Ae(e,!0,-1),i=e.input.charCodeAt(e.position),(e.line===n||e.lineIndent>t)&&0!==i)fe(e,"bad indentation of a sequence entry");else if(e.lineIndent<t)break;return!!l&&(e.tag=r,e.anchor=o,e.kind="sequence",e.result=a,!0)}function Ce(e){var t,n,i,r,o=!1,a=!1;if(33!==(r=e.input.charCodeAt(e.position)))return!1;if(null!==e.tag&&fe(e,"duplication of a tag property"),60===(r=e.input.charCodeAt(++e.position))?(o=!0,r=e.input.charCodeAt(++e.position)):33===r?(a=!0,n="!!",r=e.input.charCodeAt(++e.position)):n="!",t=e.position,o){do{r=e.input.charCodeAt(++e.position)}while(0!==r&&62!==r);e.position<e.length?(i=e.input.slice(t,e.position),r=e.input.charCodeAt(++e.position)):fe(e,"unexpected end of the stream within a verbatim tag")}else{for(;0!==r&&!X(r);)33===r&&(a?fe(e,"tag suffix cannot contain exclamation marks"):(n=e.input.slice(t-1,e.position+1),V.test(n)||fe(e,"named tag handle cannot contain such characters"),a=!0,t=e.position+1)),r=e.input.charCodeAt(++e.position);i=e.input.slice(t,e.position),G.test(i)&&fe(e,"tag suffix cannot contain flow indicator characters")}i&&!Z.test(i)&&fe(e,"tag name cannot contain such characters: "+i);try{i=decodeURIComponent(i)}catch(t){fe(e,"tag name is malformed: "+i)}return o?e.tag=i:W.call(e.tagMap,n)?e.tag=e.tagMap[n]+i:"!"===n?e.tag="!"+i:"!!"===n?e.tag="tag:yaml.org,2002:"+i:fe(e,'undeclared tag handle "'+n+'"'),!0}function xe(e){var t,n;if(38!==(n=e.input.charCodeAt(e.position)))return!1;for(null!==e.anchor&&fe(e,"duplication of an anchor property"),n=e.input.charCodeAt(++e.position),t=e.position;0!==n&&!X(n)&&!ee(n);)n=e.input.charCodeAt(++e.position);return e.position===t&&fe(e,"name of an anchor node must contain at least one character"),e.anchor=e.input.slice(t,e.position),!0}function Ie(e,t,i,r,o){var a,l,c,s,u,p,f,d,h,g=1,m=!1,y=!1;if(null!==e.listener&&e.listener("open",e),e.tag=null,e.anchor=null,e.kind=null,e.result=null,a=l=c=4===i||3===i,r&&Ae(e,!0,-1)&&(m=!0,e.lineIndent>t?g=1:e.lineIndent===t?g=0:e.lineIndent<t&&(g=-1)),1===g)for(;Ce(e)||xe(e);)Ae(e,!0,-1)?(m=!0,c=a,e.lineIndent>t?g=1:e.lineIndent===t?g=0:e.lineIndent<t&&(g=-1)):c=!1;if(c&&(c=m||o),1!==g&&4!==i||(d=1===i||2===i?t:t+1,h=e.position-e.lineStart,1===g?c&&(ke(e,h)||function(e,t,n){var i,r,o,a,l,c,s,u=e.tag,p=e.anchor,f={},d=Object.create(null),h=null,g=null,m=null,y=!1,b=!1;if(-1!==e.firstTabInLine)return!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=f),s=e.input.charCodeAt(e.position);0!==s;){if(y||-1===e.firstTabInLine||(e.position=e.firstTabInLine,fe(e,"tab characters must not be used in indentation")),i=e.input.charCodeAt(e.position+1),o=e.line,63!==s&&58!==s||!X(i)){if(a=e.line,l=e.lineStart,c=e.position,!Ie(e,n,2,!1,!0))break;if(e.line===o){for(s=e.input.charCodeAt(e.position);z(s);)s=e.input.charCodeAt(++e.position);if(58===s)X(s=e.input.charCodeAt(++e.position))||fe(e,"a whitespace character is expected after the key-value separator within a block mapping"),y&&(ye(e,f,d,h,g,null,a,l,c),h=g=m=null),b=!0,y=!1,r=!1,h=e.tag,g=e.result;else{if(!b)return e.tag=u,e.anchor=p,!0;fe(e,"can not read an implicit mapping pair; a colon is missed")}}else{if(!b)return e.tag=u,e.anchor=p,!0;fe(e,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else 63===s?(y&&(ye(e,f,d,h,g,null,a,l,c),h=g=m=null),b=!0,y=!0,r=!0):y?(y=!1,r=!0):fe(e,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),e.position+=1,s=i;if((e.line===o||e.lineIndent>t)&&(y&&(a=e.line,l=e.lineStart,c=e.position),Ie(e,t,4,!0,r)&&(y?g=e.result:m=e.result),y||(ye(e,f,d,h,g,m,a,l,c),h=g=m=null),Ae(e,!0,-1),s=e.input.charCodeAt(e.position)),(e.line===o||e.lineIndent>t)&&0!==s)fe(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return y&&ye(e,f,d,h,g,null,a,l,c),b&&(e.tag=u,e.anchor=p,e.kind="mapping",e.result=f),b}(e,h,d))||function(e,t){var n,i,r,o,a,l,c,s,u,p,f,d,h=!0,g=e.tag,m=e.anchor,y=Object.create(null);if(91===(d=e.input.charCodeAt(e.position)))a=93,s=!1,o=[];else{if(123!==d)return!1;a=125,s=!0,o={}}for(null!==e.anchor&&(e.anchorMap[e.anchor]=o),d=e.input.charCodeAt(++e.position);0!==d;){if(Ae(e,!0,t),(d=e.input.charCodeAt(e.position))===a)return e.position++,e.tag=g,e.anchor=m,e.kind=s?"mapping":"sequence",e.result=o,!0;h?44===d&&fe(e,"expected the node content, but found ','"):fe(e,"missed comma between flow collection entries"),f=null,l=c=!1,63===d&&X(e.input.charCodeAt(e.position+1))&&(l=c=!0,e.position++,Ae(e,!0,t)),n=e.line,i=e.lineStart,r=e.position,Ie(e,t,1,!1,!0),p=e.tag,u=e.result,Ae(e,!0,t),d=e.input.charCodeAt(e.position),!c&&e.line!==n||58!==d||(l=!0,d=e.input.charCodeAt(++e.position),Ae(e,!0,t),Ie(e,t,1,!1,!0),f=e.result),s?ye(e,o,y,p,u,f,n,i,r):l?o.push(ye(e,null,y,p,u,f,n,i,r)):o.push(u),Ae(e,!0,t),44===(d=e.input.charCodeAt(e.position))?(h=!0,d=e.input.charCodeAt(++e.position)):h=!1}fe(e,"unexpected end of the stream within a flow collection")}(e,d)?y=!0:(l&&function(e,t){var i,r,o,a,l=1,c=!1,s=!1,u=t,p=0,f=!1;if(124===(a=e.input.charCodeAt(e.position)))r=!1;else{if(62!==a)return!1;r=!0}for(e.kind="scalar",e.result="";0!==a;)if(43===(a=e.input.charCodeAt(++e.position))||45===a)1===l?l=43===a?3:2:fe(e,"repeat of a chomping mode identifier");else{if(!((o=ie(a))>=0))break;0===o?fe(e,"bad explicit indentation width of a block scalar; it cannot be less than one"):s?fe(e,"repeat of an indentation width identifier"):(u=t+o-1,s=!0)}if(z(a)){do{a=e.input.charCodeAt(++e.position)}while(z(a));if(35===a)do{a=e.input.charCodeAt(++e.position)}while(!Q(a)&&0!==a)}for(;0!==a;){for(be(e),e.lineIndent=0,a=e.input.charCodeAt(e.position);(!s||e.lineIndent<u)&&32===a;)e.lineIndent++,a=e.input.charCodeAt(++e.position);if(!s&&e.lineIndent>u&&(u=e.lineIndent),Q(a))p++;else{if(e.lineIndent<u){3===l?e.result+=n.repeat("\n",c?1+p:p):1===l&&c&&(e.result+="\n");break}for(r?z(a)?(f=!0,e.result+=n.repeat("\n",c?1+p:p)):f?(f=!1,e.result+=n.repeat("\n",p+1)):0===p?c&&(e.result+=" "):e.result+=n.repeat("\n",p):e.result+=n.repeat("\n",c?1+p:p),c=!0,s=!0,p=0,i=e.position;!Q(a)&&0!==a;)a=e.input.charCodeAt(++e.position);ge(e,i,e.position,!1)}}return!0}(e,d)||function(e,t){var n,i,r;if(39!==(n=e.input.charCodeAt(e.position)))return!1;for(e.kind="scalar",e.result="",e.position++,i=r=e.position;0!==(n=e.input.charCodeAt(e.position));)if(39===n){if(ge(e,i,e.position,!0),39!==(n=e.input.charCodeAt(++e.position)))return!0;i=e.position,e.position++,r=e.position}else Q(n)?(ge(e,i,r,!0),we(e,Ae(e,!1,t)),i=r=e.position):e.position===e.lineStart&&ve(e)?fe(e,"unexpected end of the document within a single quoted scalar"):(e.position++,r=e.position);fe(e,"unexpected end of the stream within a single quoted scalar")}(e,d)||function(e,t){var n,i,r,o,a,l;if(34!==(l=e.input.charCodeAt(e.position)))return!1;for(e.kind="scalar",e.result="",e.position++,n=i=e.position;0!==(l=e.input.charCodeAt(e.position));){if(34===l)return ge(e,n,e.position,!0),e.position++,!0;if(92===l){if(ge(e,n,e.position,!0),Q(l=e.input.charCodeAt(++e.position)))Ae(e,!1,t);else if(l<256&&le[l])e.result+=ce[l],e.position++;else if((a=ne(l))>0){for(r=a,o=0;r>0;r--)(a=te(l=e.input.charCodeAt(++e.position)))>=0?o=(o<<4)+a:fe(e,"expected hexadecimal character");e.result+=oe(o),e.position++}else fe(e,"unknown escape sequence");n=i=e.position}else Q(l)?(ge(e,n,i,!0),we(e,Ae(e,!1,t)),n=i=e.position):e.position===e.lineStart&&ve(e)?fe(e,"unexpected end of the document within a double quoted scalar"):(e.position++,i=e.position)}fe(e,"unexpected end of the stream within a double quoted scalar")}(e,d)?y=!0:!function(e){var t,n,i;if(42!==(i=e.input.charCodeAt(e.position)))return!1;for(i=e.input.charCodeAt(++e.position),t=e.position;0!==i&&!X(i)&&!ee(i);)i=e.input.charCodeAt(++e.position);return e.position===t&&fe(e,"name of an alias node must contain at least one character"),n=e.input.slice(t,e.position),W.call(e.anchorMap,n)||fe(e,'unidentified alias "'+n+'"'),e.result=e.anchorMap[n],Ae(e,!0,-1),!0}(e)?function(e,t,n){var i,r,o,a,l,c,s,u,p=e.kind,f=e.result;if(X(u=e.input.charCodeAt(e.position))||ee(u)||35===u||38===u||42===u||33===u||124===u||62===u||39===u||34===u||37===u||64===u||96===u)return!1;if((63===u||45===u)&&(X(i=e.input.charCodeAt(e.position+1))||n&&ee(i)))return!1;for(e.kind="scalar",e.result="",r=o=e.position,a=!1;0!==u;){if(58===u){if(X(i=e.input.charCodeAt(e.position+1))||n&&ee(i))break}else if(35===u){if(X(e.input.charCodeAt(e.position-1)))break}else{if(e.position===e.lineStart&&ve(e)||n&&ee(u))break;if(Q(u)){if(l=e.line,c=e.lineStart,s=e.lineIndent,Ae(e,!1,-1),e.lineIndent>=t){a=!0,u=e.input.charCodeAt(e.position);continue}e.position=o,e.line=l,e.lineStart=c,e.lineIndent=s;break}}a&&(ge(e,r,o,!1),we(e,e.line-l),r=o=e.position,a=!1),z(u)||(o=e.position+1),u=e.input.charCodeAt(++e.position)}return ge(e,r,o,!1),!!e.result||(e.kind=p,e.result=f,!1)}(e,d,1===i)&&(y=!0,null===e.tag&&(e.tag="?")):(y=!0,null===e.tag&&null===e.anchor||fe(e,"alias node should not have any properties")),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):0===g&&(y=c&&ke(e,h))),null===e.tag)null!==e.anchor&&(e.anchorMap[e.anchor]=e.result);else if("?"===e.tag){for(null!==e.result&&"scalar"!==e.kind&&fe(e,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+e.kind+'"'),s=0,u=e.implicitTypes.length;s<u;s+=1)if((f=e.implicitTypes[s]).resolve(e.result)){e.result=f.construct(e.result),e.tag=f.tag,null!==e.anchor&&(e.anchorMap[e.anchor]=e.result);break}}else if("!"!==e.tag){if(W.call(e.typeMap[e.kind||"fallback"],e.tag))f=e.typeMap[e.kind||"fallback"][e.tag];else for(f=null,s=0,u=(p=e.typeMap.multi[e.kind||"fallback"]).length;s<u;s+=1)if(e.tag.slice(0,p[s].tag.length)===p[s].tag){f=p[s];break}f||fe(e,"unknown tag !<"+e.tag+">"),null!==e.result&&f.kind!==e.kind&&fe(e,"unacceptable node kind for !<"+e.tag+'> tag; it should be "'+f.kind+'", not "'+e.kind+'"'),f.resolve(e.result,e.tag)?(e.result=f.construct(e.result,e.tag),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):fe(e,"cannot resolve a node with !<"+e.tag+"> explicit tag")}return null!==e.listener&&e.listener("close",e),null!==e.tag||null!==e.anchor||y}function Se(e){var t,n,i,r,o=e.position,a=!1;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap=Object.create(null),e.anchorMap=Object.create(null);0!==(r=e.input.charCodeAt(e.position))&&(Ae(e,!0,-1),r=e.input.charCodeAt(e.position),!(e.lineIndent>0||37!==r));){for(a=!0,r=e.input.charCodeAt(++e.position),t=e.position;0!==r&&!X(r);)r=e.input.charCodeAt(++e.position);for(i=[],(n=e.input.slice(t,e.position)).length<1&&fe(e,"directive name must not be less than one character in length");0!==r;){for(;z(r);)r=e.input.charCodeAt(++e.position);if(35===r){do{r=e.input.charCodeAt(++e.position)}while(0!==r&&!Q(r));break}if(Q(r))break;for(t=e.position;0!==r&&!X(r);)r=e.input.charCodeAt(++e.position);i.push(e.input.slice(t,e.position))}0!==r&&be(e),W.call(he,n)?he[n](e,n,i):de(e,'unknown document directive "'+n+'"')}Ae(e,!0,-1),0===e.lineIndent&&45===e.input.charCodeAt(e.position)&&45===e.input.charCodeAt(e.position+1)&&45===e.input.charCodeAt(e.position+2)?(e.position+=3,Ae(e,!0,-1)):a&&fe(e,"directives end mark is expected"),Ie(e,e.lineIndent-1,4,!1,!0),Ae(e,!0,-1),e.checkLineBreaks&&$.test(e.input.slice(o,e.position))&&de(e,"non-ASCII line breaks are interpreted as content"),e.documents.push(e.result),e.position===e.lineStart&&ve(e)?46===e.input.charCodeAt(e.position)&&(e.position+=3,Ae(e,!0,-1)):e.position<e.length-1&&fe(e,"end of the stream or a document separator is expected")}function Oe(e,t){t=t||{},0!==(e=String(e)).length&&(10!==e.charCodeAt(e.length-1)&&13!==e.charCodeAt(e.length-1)&&(e+="\n"),65279===e.charCodeAt(0)&&(e=e.slice(1)));var n=new ue(e,t),i=e.indexOf("\0");for(-1!==i&&(n.position=i,fe(n,"null byte is not allowed in input")),n.input+="\0";32===n.input.charCodeAt(n.position);)n.lineIndent+=1,n.position+=1;for(;n.position<n.length-1;)Se(n);return n.documents}var je={loadAll:function(e,t,n){null!==t&&"object"==typeof t&&void 0===n&&(n=t,t=null);var i=Oe(e,n);if("function"!=typeof t)return i;for(var r=0,o=i.length;r<o;r+=1)t(i[r])},load:function(e,t){var n=Oe(e,t);if(0!==n.length){if(1===n.length)return n[0];throw new o("expected a single document in the stream, but found more")}}},Te=Object.prototype.toString,Ne=Object.prototype.hasOwnProperty,Fe=65279,Ee={0:"\\0",7:"\\a",8:"\\b",9:"\\t",10:"\\n",11:"\\v",12:"\\f",13:"\\r",27:"\\e",34:'\\"',92:"\\\\",133:"\\N",160:"\\_",8232:"\\L",8233:"\\P"},Me=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],Le=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function _e(e){var t,i,r;if(t=e.toString(16).toUpperCase(),e<=255)i="x",r=2;else if(e<=65535)i="u",r=4;else{if(!(e<=4294967295))throw new o("code point within a string may not be greater than 0xFFFFFFFF");i="U",r=8}return"\\"+i+n.repeat("0",r-t.length)+t}function De(e){this.schema=e.schema||P,this.indent=Math.max(1,e.indent||2),this.noArrayIndent=e.noArrayIndent||!1,this.skipInvalid=e.skipInvalid||!1,this.flowLevel=n.isNothing(e.flowLevel)?-1:e.flowLevel,this.styleMap=function(e,t){var n,i,r,o,a,l,c;if(null===t)return{};for(n={},r=0,o=(i=Object.keys(t)).length;r<o;r+=1)a=i[r],l=String(t[a]),"!!"===a.slice(0,2)&&(a="tag:yaml.org,2002:"+a.slice(2)),(c=e.compiledTypeMap.fallback[a])&&Ne.call(c.styleAliases,l)&&(l=c.styleAliases[l]),n[a]=l;return n}(this.schema,e.styles||null),this.sortKeys=e.sortKeys||!1,this.lineWidth=e.lineWidth||80,this.noRefs=e.noRefs||!1,this.noCompatMode=e.noCompatMode||!1,this.condenseFlow=e.condenseFlow||!1,this.quotingType='"'===e.quotingType?2:1,this.forceQuotes=e.forceQuotes||!1,this.replacer="function"==typeof e.replacer?e.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function Ue(e,t){for(var i,r=n.repeat(" ",t),o=0,a=-1,l="",c=e.length;o<c;)-1===(a=e.indexOf("\n",o))?(i=e.slice(o),o=c):(i=e.slice(o,a+1),o=a+1),i.length&&"\n"!==i&&(l+=r),l+=i;return l}function qe(e,t){return"\n"+n.repeat(" ",e.indent*t)}function Ye(e){return 32===e||9===e}function Re(e){return 32<=e&&e<=126||161<=e&&e<=55295&&8232!==e&&8233!==e||57344<=e&&e<=65533&&e!==Fe||65536<=e&&e<=1114111}function Be(e){return Re(e)&&e!==Fe&&13!==e&&10!==e}function Ke(e,t,n){var i=Be(e),r=i&&!Ye(e);return(n?i:i&&44!==e&&91!==e&&93!==e&&123!==e&&125!==e)&&35!==e&&!(58===t&&!r)||Be(t)&&!Ye(t)&&35===e||58===t&&r}function Pe(e,t){var n,i=e.charCodeAt(t);return i>=55296&&i<=56319&&t+1<e.length&&(n=e.charCodeAt(t+1))>=56320&&n<=57343?1024*(i-55296)+n-56320+65536:i}function We(e){return/^\n* /.test(e)}function He(e,t,n,i,r,o,a,l){var c,s,u=0,p=null,f=!1,d=!1,h=-1!==i,g=-1,m=Re(s=Pe(e,0))&&s!==Fe&&!Ye(s)&&45!==s&&63!==s&&58!==s&&44!==s&&91!==s&&93!==s&&123!==s&&125!==s&&35!==s&&38!==s&&42!==s&&33!==s&&124!==s&&61!==s&&62!==s&&39!==s&&34!==s&&37!==s&&64!==s&&96!==s&&function(e){return!Ye(e)&&58!==e}(Pe(e,e.length-1));if(t||a)for(c=0;c<e.length;u>=65536?c+=2:c++){if(!Re(u=Pe(e,c)))return 5;m=m&&Ke(u,p,l),p=u}else{for(c=0;c<e.length;u>=65536?c+=2:c++){if(10===(u=Pe(e,c)))f=!0,h&&(d=d||c-g-1>i&&" "!==e[g+1],g=c);else if(!Re(u))return 5;m=m&&Ke(u,p,l),p=u}d=d||h&&c-g-1>i&&" "!==e[g+1]}return f||d?n>9&&We(e)?5:a?2===o?5:2:d?4:3:!m||a||r(e)?2===o?5:2:1}function $e(e,t,n,i,r){e.dump=function(){if(0===t.length)return 2===e.quotingType?'""':"''";if(!e.noCompatMode&&(-1!==Me.indexOf(t)||Le.test(t)))return 2===e.quotingType?'"'+t+'"':"'"+t+"'";var a=e.indent*Math.max(1,n),l=-1===e.lineWidth?-1:Math.max(Math.min(e.lineWidth,40),e.lineWidth-a),c=i||e.flowLevel>-1&&n>=e.flowLevel;switch(He(t,c,e.indent,l,function(t){return function(e,t){var n,i;for(n=0,i=e.implicitTypes.length;n<i;n+=1)if(e.implicitTypes[n].resolve(t))return!0;return!1}(e,t)},e.quotingType,e.forceQuotes&&!i,r)){case 1:return t;case 2:return"'"+t.replace(/'/g,"''")+"'";case 3:return"|"+Ge(t,e.indent)+Ve(Ue(t,a));case 4:return">"+Ge(t,e.indent)+Ve(Ue(function(e,t){var n,i,r=/(\n+)([^\n]*)/g,o=(l=e.indexOf("\n"),l=-1!==l?l:e.length,r.lastIndex=l,Ze(e.slice(0,l),t)),a="\n"===e[0]||" "===e[0];var l;for(;i=r.exec(e);){var c=i[1],s=i[2];n=" "===s[0],o+=c+(a||n||""===s?"":"\n")+Ze(s,t),a=n}return o}(t,l),a));case 5:return'"'+function(e){for(var t,n="",i=0,r=0;r<e.length;i>=65536?r+=2:r++)i=Pe(e,r),!(t=Ee[i])&&Re(i)?(n+=e[r],i>=65536&&(n+=e[r+1])):n+=t||_e(i);return n}(t)+'"';default:throw new o("impossible error: invalid scalar style")}}()}function Ge(e,t){var n=We(e)?String(t):"",i="\n"===e[e.length-1];return n+(i&&("\n"===e[e.length-2]||"\n"===e)?"+":i?"":"-")+"\n"}function Ve(e){return"\n"===e[e.length-1]?e.slice(0,-1):e}function Ze(e,t){if(""===e||" "===e[0])return e;for(var n,i,r=/ [^ ]/g,o=0,a=0,l=0,c="";n=r.exec(e);)(l=n.index)-o>t&&(i=a>o?a:l,c+="\n"+e.slice(o,i),o=i+1),a=l;return c+="\n",e.length-o>t&&a>o?c+=e.slice(o,a)+"\n"+e.slice(a+1):c+=e.slice(o),c.slice(1)}function Je(e,t,n,i){var r,o,a,l="",c=e.tag;for(r=0,o=n.length;r<o;r+=1)a=n[r],e.replacer&&(a=e.replacer.call(n,String(r),a)),(ze(e,t+1,a,!0,!0,!1,!0)||void 0===a&&ze(e,t+1,null,!0,!0,!1,!0))&&(i&&""===l||(l+=qe(e,t)),e.dump&&10===e.dump.charCodeAt(0)?l+="-":l+="- ",l+=e.dump);e.tag=c,e.dump=l||"[]"}function Qe(e,t,n){var i,r,a,l,c,s;for(a=0,l=(r=n?e.explicitTypes:e.implicitTypes).length;a<l;a+=1)if(((c=r[a]).instanceOf||c.predicate)&&(!c.instanceOf||"object"==typeof t&&t instanceof c.instanceOf)&&(!c.predicate||c.predicate(t))){if(n?c.multi&&c.representName?e.tag=c.representName(t):e.tag=c.tag:e.tag="?",c.represent){if(s=e.styleMap[c.tag]||c.defaultStyle,"[object Function]"===Te.call(c.represent))i=c.represent(t,s);else{if(!Ne.call(c.represent,s))throw new o("!<"+c.tag+'> tag resolver accepts not "'+s+'" style');i=c.represent[s](t,s)}e.dump=i}return!0}return!1}function ze(e,t,n,i,r,a,l){e.tag=null,e.dump=n,Qe(e,n,!1)||Qe(e,n,!0);var c,s=Te.call(e.dump),u=i;i&&(i=e.flowLevel<0||e.flowLevel>t);var p,f,d="[object Object]"===s||"[object Array]"===s;if(d&&(f=-1!==(p=e.duplicates.indexOf(n))),(null!==e.tag&&"?"!==e.tag||f||2!==e.indent&&t>0)&&(r=!1),f&&e.usedDuplicates[p])e.dump="*ref_"+p;else{if(d&&f&&!e.usedDuplicates[p]&&(e.usedDuplicates[p]=!0),"[object Object]"===s)i&&0!==Object.keys(e.dump).length?(!function(e,t,n,i){var r,a,l,c,s,u,p="",f=e.tag,d=Object.keys(n);if(!0===e.sortKeys)d.sort();else if("function"==typeof e.sortKeys)d.sort(e.sortKeys);else if(e.sortKeys)throw new o("sortKeys must be a boolean or a function");for(r=0,a=d.length;r<a;r+=1)u="",i&&""===p||(u+=qe(e,t)),c=n[l=d[r]],e.replacer&&(c=e.replacer.call(n,l,c)),ze(e,t+1,l,!0,!0,!0)&&((s=null!==e.tag&&"?"!==e.tag||e.dump&&e.dump.length>1024)&&(e.dump&&10===e.dump.charCodeAt(0)?u+="?":u+="? "),u+=e.dump,s&&(u+=qe(e,t)),ze(e,t+1,c,!0,s)&&(e.dump&&10===e.dump.charCodeAt(0)?u+=":":u+=": ",p+=u+=e.dump));e.tag=f,e.dump=p||"{}"}(e,t,e.dump,r),f&&(e.dump="&ref_"+p+e.dump)):(!function(e,t,n){var i,r,o,a,l,c="",s=e.tag,u=Object.keys(n);for(i=0,r=u.length;i<r;i+=1)l="",""!==c&&(l+=", "),e.condenseFlow&&(l+='"'),a=n[o=u[i]],e.replacer&&(a=e.replacer.call(n,o,a)),ze(e,t,o,!1,!1)&&(e.dump.length>1024&&(l+="? "),l+=e.dump+(e.condenseFlow?'"':"")+":"+(e.condenseFlow?"":" "),ze(e,t,a,!1,!1)&&(c+=l+=e.dump));e.tag=s,e.dump="{"+c+"}"}(e,t,e.dump),f&&(e.dump="&ref_"+p+" "+e.dump));else if("[object Array]"===s)i&&0!==e.dump.length?(e.noArrayIndent&&!l&&t>0?Je(e,t-1,e.dump,r):Je(e,t,e.dump,r),f&&(e.dump="&ref_"+p+e.dump)):(!function(e,t,n){var i,r,o,a="",l=e.tag;for(i=0,r=n.length;i<r;i+=1)o=n[i],e.replacer&&(o=e.replacer.call(n,String(i),o)),(ze(e,t,o,!1,!1)||void 0===o&&ze(e,t,null,!1,!1))&&(""!==a&&(a+=","+(e.condenseFlow?"":" ")),a+=e.dump);e.tag=l,e.dump="["+a+"]"}(e,t,e.dump),f&&(e.dump="&ref_"+p+" "+e.dump));else{if("[object String]"!==s){if("[object Undefined]"===s)return!1;if(e.skipInvalid)return!1;throw new o("unacceptable kind of an object to dump "+s)}"?"!==e.tag&&$e(e,e.dump,t,a,u)}null!==e.tag&&"?"!==e.tag&&(c=encodeURI("!"===e.tag[0]?e.tag.slice(1):e.tag).replace(/!/g,"%21"),c="!"===e.tag[0]?"!"+c:"tag:yaml.org,2002:"===c.slice(0,18)?"!!"+c.slice(18):"!<"+c+">",e.dump=c+" "+e.dump)}return!0}function Xe(e,t){var n,i,r=[],o=[];for(et(e,r,o),n=0,i=o.length;n<i;n+=1)t.duplicates.push(r[o[n]]);t.usedDuplicates=new Array(i)}function et(e,t,n){var i,r,o;if(null!==e&&"object"==typeof e)if(-1!==(r=t.indexOf(e)))-1===n.indexOf(r)&&n.push(r);else if(t.push(e),Array.isArray(e))for(r=0,o=e.length;r<o;r+=1)et(e[r],t,n);else for(r=0,o=(i=Object.keys(e)).length;r<o;r+=1)et(e[i[r]],t,n)}function tt(e,t){return function(){throw new Error("Function yaml."+e+" is removed in js-yaml 4. Use yaml."+t+" instead, which is now safe by default.")}}var nt=p,it=h,rt=b,ot=j,at=T,lt=P,ct=je.load,st=je.loadAll,ut={dump:function(e,t){var n=new De(t=t||{});n.noRefs||Xe(e,n);var i=e;return n.replacer&&(i=n.replacer.call({"":i},"",i)),ze(n,0,i,!0,!0)?n.dump+"\n":""}}.dump,pt=o,ft={binary:_,float:O,map:y,null:A,pairs:R,set:K,timestamp:E,bool:v,int:x,merge:M,omap:q,seq:m,str:g},dt=tt("safeLoad","load"),ht=tt("safeLoadAll","loadAll"),gt=tt("safeDump","dump"),mt={Type:nt,Schema:it,FAILSAFE_SCHEMA:rt,JSON_SCHEMA:ot,CORE_SCHEMA:at,DEFAULT_SCHEMA:lt,load:ct,loadAll:st,dump:ut,YAMLException:pt,types:ft,safeLoad:dt,safeLoadAll:ht,safeDump:gt};e.CORE_SCHEMA=at,e.DEFAULT_SCHEMA=lt,e.FAILSAFE_SCHEMA=rt,e.JSON_SCHEMA=ot,e.Schema=it,e.Type=nt,e.YAMLException=pt,e.default=mt,e.dump=ut,e.load=ct,e.loadAll=st,e.safeDump=gt,e.safeLoad=dt,e.safeLoadAll=ht,e.types=ft,Object.defineProperty(e,"__esModule",{value:!0})});

return module.exports;})();
  const number = value => value !== null && value !== '' && Number.isFinite(Number(value)) ? Number(value) : null;
  function finalize(rows,duration) {
    rows=rows.filter(l=>Number.isFinite(l.start)&&l.start>=0).sort((a,b)=>a.start-b.start);
    return rows.map((line,index)=>{
      const next=rows[index+1]?.start ?? duration;
      let end=line.end>line.start?line.end:next;
      if(!(end>line.start)) end=line.start+5000;
      // Preserve explicit provider ends; cap otherwise unbounded line gaps.
      if(!(line.end>line.start))end=Math.min(end,line.start+8000);
      return {...line,end};
    });
  }
  function spotify(payload,duration) {
    const lyrics=payload?.lyrics;
    if(!lyrics || !['LINE_SYNCED','SYLLABLE_SYNCED'].includes(lyrics.syncType)) return [];
    const english=(lyrics.alternatives||[]).find(alt=>typeof alt.language==='string'&&/^en(?:-|$)/i.test(alt.language));
    const translated=!/^en(?:-|$)/i.test(lyrics.language||'')&&Array.isArray(english?.lines)?english.lines:[];
    const clean=value=>String(value).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
    return finalize((lyrics.lines||[]).map((line,index)=>{
      const text=String(line.words??''),start=number(line.startTimeMs);
      const candidate=translated[index],translation=typeof candidate==='string'?candidate:typeof candidate?.words==='string'?candidate.words:typeof candidate?.text==='string'?candidate.text:'';
      return {text,start:start??NaN,end:number(line.endTimeMs),translation:translation&&clean(translation)!==clean(text)?translation.trim():''};
    }),duration);
  }
  function lrc(input,duration) {
    const offset=Number(String(input).match(/\[offset:([+-]?\d+)\]/i)?.[1]||0);
    const rows=[];
    for(const raw of String(input||'').split(/\r?\n/)) {
      const tags=Array.from(raw.matchAll(/\[(\d+):(\d{2}(?:\.\d+)?)\]/g));
      if(!tags.length)continue;
      const body=raw.slice(tags.at(-1).index+tags.at(-1)[0].length);
      for(const tag of tags)rows.push({start:(Number(tag[1])*60+Number(tag[2]))*1000+offset,text:body.replace(/<\d+:\d{2}(?:\.\d+)?>/g,'')});
    }
    return finalize(rows,duration);
  }
  const compact=text=>String(text||'').replace(/\s+/g,' ').trim();
  function timed(rows,duration){
    return finalize(rows,duration).filter(row=>row.start<duration&&row.end<=duration+1000).slice(0,1500).map(row=>{
      const words=Array.isArray(row.words)?row.words.slice(0,400):[];
      let previous=row.start;
      const valid=words.length&&(words.length>1||!(/\s/.test(row.text.trim())))&&words.every(word=>{const ok=typeof word.text==='string'&&word.text.length<1000&&Number.isFinite(word.start)&&Number.isFinite(word.end)&&word.start>=row.start&&word.start>=previous&&word.end>word.start&&word.end<=row.end;previous=word.end;return ok;})&&compact(words.map(w=>w.text).join(''))===compact(row.text);
      return {...row,words:valid?words:[]};
    });
  }
  function lyricsfile(input,duration){
    if(typeof input!=='string'||input.length>500000||/(?:^|[ \t])[&*][\w-]+/m.test(input))return [];
    try{
      const data=LyricYAML.load(input,{schema:LyricYAML.JSON_SCHEMA});
      if(!Array.isArray(data?.lines)||data.lines.length>1500)return [];
      return timed(data.lines.map(line=>({text:String(line.text||''),start:number(line.start_ms),end:number(line.end_ms),words:Array.isArray(line.words)?line.words.map(w=>({text:w.text,start:number(w.start_ms),end:number(w.end_ms)})):[]})),duration);
    }catch{return [];}
  }
  function clock(value){
    if(typeof value!=='string')return NaN;
    if(/^\d+(?:\.\d+)?ms$/.test(value))return parseFloat(value);
    if(/^\d+(?:\.\d+)?s$/.test(value))return parseFloat(value)*1000;
    if(!/^\d+(?::\d{2}){1,2}(?:\.\d+)?$/.test(value))return NaN;
    return value.split(':').reduce((sum,part)=>sum*60+Number(part),0)*1000;
  }
  function ttml(input,duration){
    if(typeof DOMParser!=='function'||typeof input!=='string'||input.length>500000||/<!DOCTYPE|<!ENTITY/i.test(input))return [];
    try{
      const doc=new DOMParser().parseFromString(input,'application/xml');if(doc.querySelector('parsererror'))return [];
      const lines=[...doc.getElementsByTagNameNS('*','p')];if(lines.length>1500)return [];
      const rows=lines.map(p=>{
        let text='',words=[];
        function walk(node){
          if(node.nodeType===3){const value=node.textContent.replace(/\s+/g,' ');text+=value;if(words.length&&/^\s+$/.test(value))words.at(-1).text+=value;return;}
          if(node.nodeType!==1)return;
          const role=node.getAttribute('ttm:role')||'';if(/translation|roman/i.test(role))return;
          const descendants=[...node.getElementsByTagNameNS('*','span')].some(n=>n.hasAttribute('begin'));
          const start=clock(node.getAttribute('begin')),end=clock(node.getAttribute('end'));
          if(node.localName==='span'&&!descendants&&Number.isFinite(start)&&Number.isFinite(end)){
            const value=node.textContent.replace(/\s+/g,' ');text+=value;words.push({text:value,start,end});return;
          }
          for(const child of node.childNodes)walk(child);
        }
        walk(p);
        // Trim formatting whitespace without changing syllable boundaries.
        if(words.length){words[0].text=words[0].text.trimStart();words[words.length-1].text=words.at(-1).text.trimEnd();}
        return {text:text.trim(),start:clock(p.getAttribute('begin')),end:clock(p.getAttribute('end')),words};
      });
      return timed(rows,duration);
    }catch{return [];}
  }
  function qrc(input,duration){
    if(typeof input!=='string'||input.length>500000||/<!DOCTYPE|<!ENTITY/i.test(input))return [];
    // Read the attribute directly: XML DOM parsing normalizes attribute newlines.
    const envelope=input.match(/\bLyricContent\s*=\s*(["'])([\s\S]*?)\1/);
    if(!envelope)return [];
    const entities={amp:'&',quot:'"',apos:"'",lt:'<',gt:'>'};
    const body=envelope[2].replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt);/gi,(match,key)=>{
      if(key[0]!=='#')return entities[key.toLowerCase()]||match;
      const code=key[1].toLowerCase()==='x'?parseInt(key.slice(2),16):Number(key.slice(1));
      return code>0&&code<=0x10ffff?String.fromCodePoint(code):'';
    });
    const rows=[];
    for(const raw of body.split(/\r?\n/)){
      const header=raw.trim().match(/^\[(\d+),(\d+)\]([\s\S]*)$/);if(!header)continue;
      if(rows.length>=1500)return [];
      const start=Number(header[1]),length=Number(header[2]),rest=header[3],words=[];let cursor=0;
      for(const token of rest.matchAll(/\((\d+),(\d+)\)/g)){
        if(words.length>=400)return [];
        const begin=Number(token[1]);words.push({text:rest.slice(cursor,token.index),start:begin,end:begin+Number(token[2])});cursor=token.index+token[0].length;
      }
      const text=words.map(w=>w.text).join('')+rest.slice(cursor);
      if(/^(?:lyrics by|composed by|arranged by|producer|作词|作曲|编曲|制作人)\s*[:：]/i.test(text.trim()))continue;
      rows.push({text:text.trim(),start,end:length?start+length:undefined,words});
    }
    return timed(rows,duration);
  }
  function wordProgress(word,time){return Math.max(0,Math.min(1,(time-word.start)/Math.max(1,word.end-word.start)));}
  function matchesTiming(candidate,baseline,duration){
    if(!candidate.some(row=>row.words?.length)||candidate.some(row=>row.end>duration+1000))return false;
    const clean=value=>String(value||'').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
    const base=baseline.filter(row=>clean(row.text).length>3),rows=candidate.filter(row=>clean(row.text).length>3);
    if(!base.length||!rows.length)return false;
    const differences=[];for(const row of rows){const matches=base.filter(b=>clean(b.text)===clean(row.text));if(matches.length)differences.push(Math.min(...matches.map(b=>Math.abs(b.start-row.start))));}
    differences.sort((a,b)=>a-b);
    return differences.length>=Math.min(3,base.length)&&differences.length>=Math.min(base.length,rows.length)*.6&&differences[Math.floor(differences.length/2)]<=2000;
  }
  function active(rows,time) {
    let low=0,high=rows.length;
    while(low<high){const mid=(low+high)>>1;if(rows[mid].start<=time)low=mid+1;else high=mid;}
    const index=low-1;
    return {line:index<0||time>=rows[index].end?-1:index};
  }
  globalThis.ResonanceLyrics={finalize,spotify,lrc,active,timed,lyricsfile,ttml,qrc,clock,wordProgress,matchesTiming};
})();

// NAME: Resonance Display
// AUTHOR: Local customization
// VERSION: 4.17.0-experimental.1
// DESCRIPTION: Album-focused Spotify listening view with synced lyrics, track-analysis visuals and playback controls.
(() => {
  if (document.getElementById('resonance-launch')) return;
  const css = document.createElement('style');
  css.textContent = `
  #resonance-launch {position:fixed;right:260px;top:19px;z-index:999;color:#c9e5be;background:#20291f;border:1px solid #c9e5be40;border-radius:22px;padding:9px 16px;font:600 12px sans-serif;cursor:pointer;-webkit-app-region:no-drag}
  #resonance-root {position:fixed;inset:0;z-index:10000;background:#0c1010;--accent:#bfdcb3;--accent-rgb:191,220,179;color:#f4f5ef;font-family:inherit;display:flex;flex-direction:column;overflow:hidden}
  #resonance-root[hidden] {display:none!important}
  #resonance-root * {box-sizing:border-box}
  #resonance-bg {position:absolute;inset:-100px;background-size:cover;background-position:center;filter:blur(80px) brightness(.25);opacity:.6;pointer-events:none}
  #resonance-header {position:relative;display:flex;justify-content:space-between;align-items:center;padding:46px 38px 20px;gap:20px}
  #resonance-root #resonance-brand {background:transparent;border:0;padding:0;font:500 20px sans-serif;letter-spacing:1px;color:var(--accent)}
  #resonance-brand-wrap {position:relative;flex-shrink:0}
  #resonance-themes {position:absolute;top:38px;left:0;z-index:5;width:280px;padding:16px;background:#151b19f5;border:1px solid #ffffff20;border-radius:14px;box-shadow:0 16px 50px #0006}
  #resonance-themes[hidden] {display:none}
  #resonance-visual-label {font-size:11px;color:#ffffff90;margin:20px 0 10px}
  #resonance-visual-options {display:flex;gap:6px;flex-wrap:wrap}
  #resonance-root #resonance-visual-options button {font-size:11px;border:1px solid #ffffff20;border-radius:16px;background:transparent;padding:7px 10px;color:#ffffff90}
  #resonance-root #resonance-visual-options button[aria-pressed="true"] {color:var(--accent);border-color:var(--accent);background:rgba(var(--accent-rgb),.08)}
  #resonance-theme-label {font-size:11px;color:#ffffff90;margin-bottom:12px}
  #resonance-swatches {display:flex;gap:12px}
  #resonance-root #resonance-swatches button {width:30px;height:30px;border-radius:50%;background:var(--swatch);border:2px solid transparent;box-shadow:0 0 0 2px transparent}
  #resonance-root #resonance-swatches button[aria-pressed="true"] {border-color:#151b19;box-shadow:0 0 0 2px var(--swatch)}
  #resonance-swatches button:focus-visible {outline:2px solid white;outline-offset:4px}
  #resonance-root #resonance-swatches button[data-theme="album"] {background:conic-gradient(#e8a0a0,#e8d28f,#a8d8a0,#8fc4e8,#b9a3e8,#e8a0a0)}
  #resonance-sync-value {font:11px monospace;color:#ffffffa0;min-width:56px;text-align:center;align-self:center}
  #resonance-sync-hint {font-size:10px;color:#ffffff60;margin-top:6px}
  #resonance-debug {position:absolute;left:14px;top:96px;z-index:6;pointer-events:none;font:10px/1.55 monospace;color:#d8f0d0;background:rgba(0,0,0,.62);border:1px solid #ffffff20;border-radius:8px;padding:8px 10px;white-space:pre;display:none}
  #resonance-root[data-debug="on"] #resonance-debug {display:block}
  #resonance-root button {color:inherit;cursor:pointer;-webkit-app-region:no-drag;font:inherit}
  #resonance-header-right {min-width:0;display:flex;flex-direction:column;align-items:flex-end;gap:12px}
  #resonance-source {max-width:min(55vw,600px);font:11px -apple-system,BlinkMacSystemFont,sans-serif;letter-spacing:.3px;color:#ffffff80;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  #resonance-actions {display:flex;gap:10px}
  #resonance-actions button {border:1px solid #ffffff35;border-radius:22px;background:#0002;padding:9px 15px;font-size:12px}
  #resonance-content {position:relative;flex:1;display:grid;grid-template-columns:min(36vw,46vh) minmax(0,1fr);align-items:center;gap:5vw;width:86vw;max-width:1180px;align-self:center;padding:15px 0 0;min-height:0}
  :is(#resonance-cover,#resonance-cover-prev) {grid-column:1;grid-row:1;width:100%;height:auto;aspect-ratio:1;object-fit:cover;border-radius:18px;box-shadow:0 24px 80px #0007;flex-shrink:0;background:linear-gradient(140deg,#345443,#101715)}
  #resonance-info {grid-column:2;grid-row:1;min-width:0;width:100%;overflow:hidden;text-align:center;padding:0 12px}
  #resonance-kicker {font:11px monospace;letter-spacing:3px;color:var(--accent);margin-bottom:22px}
  #resonance-title {font-size:clamp(27px,4.6vw,75px);font-weight:600;letter-spacing:-.04em;line-height:1.08;margin:0 0 22px;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
  #resonance-artist {font-size:clamp(18px,2vw,32px);color:#ffffffb5;margin-bottom:13px;line-height:1.35;overflow-wrap:anywhere}
  #resonance-album {font-size:clamp(13px,1.2vw,19px);color:#ffffff70}
  #resonance-root[data-motion="punch"] #resonance-waves {height:13vh;min-height:70px}
  #resonance-waves {flex-shrink:0;position:relative;width:90%;height:8vh;min-height:45px;align-self:center;pointer-events:none}
  #resonance-player {position:relative;display:flex;flex-direction:column;align-items:center;gap:18px;padding:0 32px 18px}
  #resonance-progress {display:flex;align-items:center;gap:15px;width:min(530px,80vw);font:11px monospace;color:#ffffff90}
  #resonance-track {appearance:none;-webkit-appearance:none;min-width:0;flex:1;height:24px;margin:0;background:transparent;cursor:pointer;touch-action:none;-webkit-app-region:no-drag}
  #resonance-track::-webkit-slider-runnable-track {height:4px;border-radius:3px;background:linear-gradient(to right,var(--accent) var(--progress,0%),#ffffff20 var(--progress,0%))}
  #resonance-track::-webkit-slider-thumb {appearance:none;-webkit-appearance:none;width:12px;height:12px;border-radius:50%;background:var(--accent);margin-top:-4px;opacity:0;transition:opacity .15s}
  #resonance-track:hover::-webkit-slider-thumb,#resonance-track:focus-visible::-webkit-slider-thumb {opacity:1}
  #resonance-track:focus-visible {outline:1px solid rgba(var(--accent-rgb),.5);outline-offset:3px;border-radius:6px}
  #resonance-track:disabled {opacity:.4;cursor:default}
  #resonance-up-next {z-index:1;font:inherit;color:inherit;text-align:left;cursor:pointer;position:absolute;right:0;bottom:14px;max-width:46%;padding:10px 16px;border:1px solid #ffffff15;border-radius:12px;background:#ffffff08;animation:resonance-preview .35s ease-out}
  #resonance-up-next[hidden] {display:none}
  #resonance-up-next-label {font:10px monospace;letter-spacing:2px;color:var(--accent);margin-bottom:5px}
  #resonance-up-next-title {font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  #resonance-up-next-artist {font-size:12px;color:#ffffff80;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  @keyframes resonance-preview {from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
  @media(prefers-reduced-motion:reduce) {#resonance-up-next{animation:none}}
  #resonance-controls {display:flex;align-items:center;gap:26px}
  #resonance-controls button {width:52px;height:52px;border:0;border-radius:50%;background:transparent;display:grid;place-items:center;font-size:25px}
  #resonance-controls button:hover {background:#ffffff20}
  #resonance-controls button svg {width:22px;height:22px;display:block}
  #resonance-controls #resonance-shuffle {margin-right:12px;color:#ffffff70}
  #resonance-controls #resonance-shuffle[aria-pressed="true"] {color:var(--accent);background:rgba(var(--accent-rgb),.08)}
  #resonance-controls #resonance-like {margin-left:12px;color:#ffffff90}
  #resonance-controls #resonance-like[aria-pressed="true"] {color:var(--accent)}
  #resonance-like[aria-pressed="true"] path {fill:currentColor}
  #resonance-controls button:disabled {opacity:.4;cursor:default}
  #resonance-controls #resonance-toggle {width:62px;height:62px;background:var(--accent);color:#111}
  #resonance-caption {position:relative;text-align:center;font:10px monospace;letter-spacing:1.5px;color:#ffffff65;padding:0 15px 18px}
  #resonance-status {font:11px sans-serif;color:#ffd19b;min-height:14px}
  #resonance-lyrics {position:relative;flex-shrink:0;width:86vw;max-width:1180px;align-self:center;min-height:90px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:10px;padding:8px 0}
  #resonance-lyric-line {white-space:nowrap;max-width:100%;text-align:center;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI Variable Text","Segoe UI","Helvetica Neue",sans-serif;font-size:32px;line-height:1.35;font-weight:650;letter-spacing:-.035em;color:#f4f5f1;overflow:hidden;min-height:44px;will-change:opacity,transform}
  #resonance-root #resonance-lyric-line {font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI Variable Text","Segoe UI",sans-serif;font-weight:650;letter-spacing:-.035em;border:0;background:transparent;padding:0;cursor:pointer}
  #resonance-root #resonance-lyric-line:disabled {cursor:default}
  #resonance-root[data-keyword-emphasis="on"] #resonance-lyric-line .resonance-keyword {color:var(--lyric-album-color,#e2e5e2);-webkit-text-stroke:.65px rgba(0,0,0,.85);paint-order:stroke fill;text-shadow:0 1px 3px #0002;transition:color 1s ease,text-shadow 1s ease}
  #resonance-lyric-line:focus-visible,#resonance-expanded-lines button:focus-visible {outline:1px solid var(--accent);outline-offset:4px;border-radius:6px}
  #resonance-lyric-tools {display:flex;align-items:center;gap:14px}
  #resonance-root #resonance-expand-lyrics {background:transparent;border:0;padding:5px;color:#ffffff90;font-size:11px}
  #resonance-expanded-lyrics {grid-column:2;grid-row:1;min-width:0;width:100%;height:42vh;overflow:auto;padding:0 12px;z-index:1;overscroll-behavior:contain;scrollbar-width:none;mask-image:linear-gradient(transparent,#000 12%,#000 88%,transparent)}
  #resonance-expanded-lyrics[hidden] {display:none}
  #resonance-expanded-lines {display:flex;flex-direction:column;gap:16px;align-items:center;padding-block:calc(21vh - 24px)}
  #resonance-root #resonance-expanded-lines button {font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI Variable Text","Segoe UI",sans-serif;font-weight:650;font-size:clamp(16px,2vw,30px);letter-spacing:-.03em;line-height:1.3;border:0;background:transparent;padding:3px 6px;text-align:center;color:#ffffff60;transition:color .28s;white-space:normal}
  #resonance-root #resonance-expanded-lines button[aria-current="true"] {color:#f4f5f1}
  #resonance-root #resonance-expanded-lines button:hover {color:var(--accent)}
  #resonance-expanded-note {text-align:center;color:#ffffff70;font-size:14px}
  #resonance-song-summary {position:absolute;top:8px;left:0;width:100%;height:44px;text-align:center;pointer-events:none}
  #resonance-song-summary[hidden] {display:none}
  #resonance-summary-title {font-size:16px;line-height:18px;font-weight:600}
  #resonance-summary-artist,#resonance-summary-album {font-size:11px;line-height:13px;color:#ffffff90}
  #resonance-song-summary div {white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  #resonance-lyric-note {font:10px monospace;color:#ffffff60;letter-spacing:.5px}
  #resonance-header,#resonance-player,#resonance-caption {transition:opacity .35s}
  #resonance-root[data-idle="true"] #resonance-header,#resonance-root[data-idle="true"] #resonance-player,#resonance-root[data-idle="true"] #resonance-caption {opacity:0;pointer-events:none}
  #resonance-controls #resonance-repeat {color:#ffffff70;position:relative}
  #resonance-controls #resonance-repeat[aria-pressed="true"] {color:var(--accent);background:rgba(var(--accent-rgb),.08)}
  #resonance-repeat[data-mode="2"]::after {content:'1';position:absolute;font:700 9px sans-serif;top:21px;left:24px;background:#172017;padding:0 2px}
  #resonance-queue {position:absolute;z-index:2;right:28px;top:140px;width:min(350px,calc(100vw - 40px));max-height:65vh;overflow:auto;background:#151b19f5;border:1px solid #ffffff20;border-radius:18px;padding:20px;box-shadow:0 16px 70px #0007}
  #resonance-queue[hidden] {display:none}
  #resonance-queue h2 {font-size:16px;margin:0 0 16px}
  #resonance-queue-list {padding-left:22px;margin:0;color:#ffffff70}
  #resonance-queue-list li {padding:10px 0 10px 5px}
  #resonance-queue-list strong {display:block;color:#f4f5ef;font-size:14px;font-weight:550}
  #resonance-queue-list small {display:block;margin-top:4px;font-size:12px}
  @media(max-width:800px) {#resonance-controls{gap:10px}#resonance-controls #resonance-shuffle,#resonance-controls #resonance-like{margin:0}}
  @media(prefers-reduced-motion:reduce) {#resonance-header,#resonance-player,#resonance-caption{transition:none}}
  @media(max-height:720px) {:is(#resonance-cover,#resonance-cover-prev){max-height:40vh;width:40vh;max-width:100%}#resonance-lyrics{min-height:74px}#resonance-waves{height:6vh;min-height:30px}#resonance-header{padding-top:38px;padding-bottom:12px}#resonance-title{font-size:clamp(23px,4vw,55px)}}
  @media(max-width:800px) {#resonance-launch{right:205px;padding:9px}#resonance-header{padding:40px 20px 12px}#resonance-content{gap:25px;padding:15px 0}#resonance-title{font-size:30px}}

  #resonance-themes {max-height:calc(100vh - 165px);overflow:auto}
  .resonance-setting-label {font-size:11px;color:#ffffff90;margin:18px 0 9px}
  .resonance-setting-options {display:flex;flex-wrap:wrap;gap:6px}
  #resonance-root .resonance-setting-options button {font-size:11px;border:1px solid #ffffff20;border-radius:16px;background:transparent;padding:7px 10px;color:#ffffff90}
  #resonance-root .resonance-setting-options button[aria-pressed="true"] {color:var(--accent);border-color:var(--accent);background:rgba(var(--accent-rgb),.08)}
  #resonance-aurora {position:absolute;inset:0;pointer-events:none;overflow:hidden;opacity:0;transition:opacity 1.5s}
  .resonance-palette-layer {position:absolute;inset:-15%;opacity:0;transition:opacity 2.4s ease;filter:blur(24px) saturate(1.45) brightness(.9);animation:resonance-aurora-drift 28s ease-in-out infinite alternate;will-change:auto;animation-play-state:paused}
  #resonance-root[data-background="ambient"] #resonance-aurora {opacity:.96}
  #resonance-root[data-background="ambient"] #resonance-bg {opacity:0}
  #resonance-root:is([data-background="dark"],[data-background="accent"]) #resonance-bg {opacity:0}
  #resonance-accent-bg {position:absolute;inset:0;pointer-events:none;opacity:0;background:linear-gradient(145deg,rgba(var(--accent-rgb),.42) 0%,rgba(var(--accent-rgb),.17) 48%,rgba(var(--accent-rgb),.035) 100%),#0b1012;transition:opacity 1.5s}
  #resonance-root[data-background="accent"] #resonance-accent-bg {opacity:1}
  #resonance-root[data-background="dark"] {background:#080b0c}
  #resonance-root[data-background="artwork"] #resonance-bg {filter:blur(65px) brightness(.38);opacity:.8}
  #resonance-bg {transition:opacity 1.6s,filter 1.6s}
  @keyframes resonance-aurora-drift {from{transform:translate(-3%,-2%) rotate(-7deg) scale(1)}to{transform:translate(3%,3%) rotate(8deg) scale(1.12)}}

  #resonance-artwork {transform:translateX(var(--art-kick,0px)) rotate(var(--art-tilt,0deg)) scale(var(--art-pulse,1));transform-origin:center}
  #resonance-beat-glow {position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 35% 48%,rgba(var(--accent-rgb),.24),transparent 65%);opacity:var(--beat-glow,0)}
  #resonance-root[data-layout="center"] #resonance-content {grid-template-columns:1fr;grid-template-rows:minmax(0,1fr) auto;gap:16px;justify-items:center}
  #resonance-root[data-layout="center"] #resonance-artwork {grid-column:1;grid-row:1;width:min(30vh,32vw);max-height:100%}
  #resonance-root[data-layout="center"] #resonance-info {grid-column:1;grid-row:2}
  #resonance-root[data-layout="center"] #resonance-title {font-size:clamp(24px,3vw,46px);margin-bottom:8px}
  #resonance-root[data-layout="center"] #resonance-kicker {display:none}
  #resonance-root[data-layout="center"] #resonance-artist {font-size:20px;margin-bottom:6px}
  #resonance-root:is([data-layout="lyrics"],[data-layout="karaoke"]) #resonance-artwork {display:none}
  #resonance-root:is([data-layout="lyrics"],[data-layout="karaoke"]) #resonance-content {display:block;width:min(88vw,1100px);padding:0}
  #resonance-root:is([data-layout="lyrics"],[data-layout="karaoke"]) #resonance-info {display:none}
  #resonance-root:is([data-layout="lyrics"],[data-layout="karaoke"]) #resonance-expanded-lyrics {position:absolute;inset:0;height:100%;padding:0 4vw}
  #resonance-root:is([data-layout="lyrics"],[data-layout="karaoke"]) #resonance-expanded-lines {padding-block:24vh;gap:25px}
  #resonance-root:is([data-layout="lyrics"],[data-layout="karaoke"]) #resonance-song-summary {position:relative;top:auto;height:auto;flex-shrink:0}
  #resonance-root[data-layout="lyrics"] #resonance-expanded-lines button {font-size:clamp(24px,3vw,44px)}
  #resonance-root[data-layout="karaoke"] #resonance-expanded-lines button {font-size:clamp(32px,4.8vw,76px);font-weight:750;line-height:1.16}
  #resonance-root:is([data-layout="lyrics"],[data-layout="karaoke"]) #resonance-lyric-line {display:none}
  #resonance-root:is([data-layout="lyrics"],[data-layout="karaoke"]) #resonance-lyrics {min-height:0;padding-top:8px;padding-bottom:8px}
  @media(max-height:720px) {#resonance-root[data-layout="center"] #resonance-artwork{width:24vh}#resonance-root[data-layout="karaoke"] #resonance-expanded-lines button{font-size:clamp(26px,4vw,50px)}}

  #resonance-root:is([data-layout="left"],[data-layout="center"]) #resonance-lyrics {height:110px;min-height:0;overflow:hidden;transition:height .7s cubic-bezier(.22,1,.36,1),padding .7s cubic-bezier(.22,1,.36,1),opacity .3s}
  #resonance-root[data-art-no-lyrics="true"] #resonance-lyrics {height:30px;padding-top:0;padding-bottom:0}
  #resonance-root[data-art-no-lyrics="true"][data-lyrics-enabled="false"] #resonance-lyrics {height:0;opacity:0}
  #resonance-root #resonance-lyric-line {max-height:90px;opacity:1;transition:opacity .22s ease,max-height .7s cubic-bezier(.22,1,.36,1),min-height .7s cubic-bezier(.22,1,.36,1)}
  #resonance-root[data-art-no-lyrics="true"] #resonance-lyric-line {max-height:0;min-height:0;overflow:hidden;opacity:0;pointer-events:none}
  #resonance-root[data-art-no-lyrics="true"] #resonance-lyric-note {display:none}
  #resonance-artwork,#resonance-info {translate:0 0;transition:translate .7s cubic-bezier(.22,1,.36,1)}
  #resonance-root[data-art-no-lyrics="true"] :is(#resonance-artwork,#resonance-info) {translate:0 8px}
  #resonance-single-line-setting[hidden] {display:none}
  @media(prefers-reduced-motion:reduce) {#resonance-root #resonance-lyrics,#resonance-artwork,#resonance-info,#resonance-root #resonance-lyric-line {transition:none!important}}
  #resonance-artwork {grid-column:1;grid-row:1;position:relative;width:100%;aspect-ratio:1;min-width:0}
  #resonance-disc {position:absolute;inset:0}
  #resonance-root :is(#resonance-cover,#resonance-cover-prev) {width:100%;height:100%;max-width:none;max-height:none;object-fit:cover}
  #resonance-root[data-artwork="vinyl"] #resonance-disc {border-radius:50%;background:radial-gradient(circle at 35% 25%,#303333,#080a0a 65%);box-shadow:0 20px 60px #0009}
  #resonance-root[data-artwork="vinyl"] :is(#resonance-cover,#resonance-cover-prev) {position:absolute;inset:28%;width:44%;height:44%;border-radius:50%;box-shadow:none}
  #resonance-grooves,#resonance-spindle,#resonance-tonearm {display:none;pointer-events:none}
  #resonance-root[data-artwork="vinyl"] #resonance-grooves {display:block;position:absolute;inset:3%;border-radius:50%;background:repeating-radial-gradient(circle,transparent 0 3px,#ffffff09 3.5px 4px);mask-image:radial-gradient(circle,transparent 32%,#000 33%)}
  #resonance-root[data-artwork="vinyl"] #resonance-spindle {display:block;position:absolute;left:49%;top:49%;width:2%;height:2%;border-radius:50%;background:#111;box-shadow:0 0 0 2px #ffffff50}
  #resonance-root[data-artwork="vinyl"] #resonance-tonearm {display:block;position:absolute;right:-1%;top:0;width:6px;height:65%;background:linear-gradient(90deg,#666,#ccc,#777);border-radius:4px;transform-origin:50% 4%;transform:rotate(8deg);transition:transform .6s linear;box-shadow:3px 3px 8px #0007}
  #resonance-tonearm::before {content:'';position:absolute;top:-3px;left:-5px;width:16px;height:16px;border-radius:50%;background:#777;box-shadow:0 0 0 4px #252929}
  #resonance-tonearm::after {content:'';position:absolute;bottom:-8px;left:-3px;width:13px;height:28px;background:#a7aaa7;border-radius:3px;transform:rotate(-16deg)}
  #resonance-grain {position:absolute;inset:0;pointer-events:none;opacity:0;mix-blend-mode:soft-light;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Cpath fill='white' filter='url(%23n)' d='M0 0h180v180H0z'/%3E%3C/svg%3E")}
  #resonance-root[data-artwork="vinyl"] #resonance-grain {opacity:.13}
  #resonance-root[data-lyric-style="animated"] #resonance-expanded-lines button {filter:blur(.9px);opacity:.65;transition:filter .6s,opacity .6s,color .6s,transform .65s}
  #resonance-root[data-lyric-style="animated"] #resonance-expanded-lines button[aria-current="true"] {filter:blur(0);opacity:1;transform:scale(1.025)}
  #resonance-root[data-lyric-style="animated"] #resonance-expanded-lines button:hover,#resonance-root[data-lyric-style="animated"] #resonance-expanded-lines button:focus-visible {filter:blur(0);opacity:1}
  .resonance-interlude-note {display:inline-block;font-family:"Apple Symbols","Segoe UI Symbol",-apple-system,sans-serif;font-size:24px;font-style:normal;line-height:1;color:var(--lyric-ink,var(--accent));animation:resonance-interlude 1.8s ease-in-out infinite;animation-play-state:paused}
  .resonance-interlude-note:nth-child(2) {animation-delay:.2s}.resonance-interlude-note:nth-child(3) {animation-delay:.4s}
  #resonance-root[data-playing="true"] .resonance-interlude-note {animation-play-state:running}
  #resonance-root #resonance-expanded-lines button:not([aria-current="true"]) .resonance-interlude-note {animation:none;opacity:.5}
  @keyframes resonance-interlude {0%,100%{opacity:.3;transform:translateY(2px) scale(.75)}50%{opacity:1;transform:translateY(-3px) scale(1)}}
  @media(max-height:720px) {#resonance-artwork{width:40vh;max-width:100%}}
  @media(prefers-reduced-motion:reduce) {.resonance-palette-layer,#resonance-disc,.resonance-interlude-note{animation:none!important}.resonance-palette-layer,#resonance-tonearm,#resonance-expanded-lines button{transition:none!important}}

  #resonance-disc > img {position:absolute;inset:0;transition:opacity .85s ease;border-radius:18px}
  #resonance-cover-prev[hidden] {display:none}
  #resonance-queue {width:min(450px,calc(100vw - 40px));max-height:calc(100vh - 180px);animation:resonance-drawer .28s cubic-bezier(.22,1,.36,1)}
  #resonance-queue-header {display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
  #resonance-queue-header h2 {margin:0}
  #resonance-root #resonance-queue-close {border:0;border-radius:50%;width:28px;height:28px;background:#ffffff0c;font-size:14px}
  #resonance-queue-list {padding:0;list-style:none}
  #resonance-queue-list li {display:flex;align-items:center;gap:8px;padding:6px 0}
  #resonance-root .resonance-queue-track {display:flex;align-items:center;gap:12px;width:100%;min-width:0;text-align:left;border:0;background:transparent;padding:5px;border-radius:8px}
  #resonance-root .resonance-queue-track:not(:disabled):hover {background:#ffffff0c}
  .resonance-queue-thumb {width:44px;height:44px;object-fit:cover;background:#ffffff0c;border-radius:5px;flex-shrink:0}
  .resonance-queue-info {min-width:0;flex:1}
  #resonance-queue strong,#resonance-queue small {display:block;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}
  #resonance-queue strong {font-size:13px;font-weight:550}
  #resonance-queue small {font-size:11px;margin-top:4px;color:#ffffff70}
  .resonance-queue-duration {font:10px monospace;color:#ffffff70;flex-shrink:0}
  #resonance-queue-current {padding:4px 0 12px;border-bottom:1px solid #ffffff15}
  #resonance-queue-current strong {color:var(--accent)}
  #resonance-queue-current-label {font:10px monospace;letter-spacing:1px;color:var(--accent);margin-bottom:8px}
  .resonance-queue-move {display:flex;flex-direction:column;gap:2px}
  #resonance-root .resonance-queue-move button {border:0;background:#ffffff08;width:25px;height:24px;border-radius:5px;font-size:13px}
  #resonance-root .resonance-queue-move button:disabled {opacity:.2;cursor:default}
  #resonance-root #resonance-queue-more {border:1px solid #ffffff20;border-radius:18px;background:transparent;padding:7px 12px;font-size:11px;margin-top:12px}
  #resonance-queue-more[hidden] {display:none}
  #resonance-queue-status {font-size:11px;color:#ffd19b;margin-top:10px;line-height:1.4}
  @keyframes resonance-drawer {from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:translateX(0)}}
  @media(prefers-reduced-motion:reduce) {#resonance-disc > img{transition:none}#resonance-queue{animation:none}}

  #resonance-root #resonance-lyric-line {min-height:66px}
  #resonance-root .resonance-translation {display:block;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:13px;font-weight:400;letter-spacing:0;line-height:1.4;color:#ffffff95;white-space:normal;margin-top:5px;max-width:100%;text-align:center}
  #resonance-root #resonance-expanded-lines .resonance-translation {font-size:clamp(11px,1vw,14px)}
  #resonance-song-summary {top:18px}

  #resonance-album-panel {position:absolute;right:28px;top:140px;width:min(460px,calc(100vw - 40px));max-height:calc(100vh - 180px);overflow:auto;z-index:3;background:#141a19fa;backdrop-filter:blur(20px);border:1px solid #ffffff20;border-radius:18px;padding:22px;box-shadow:0 20px 70px #0007;animation:resonance-drawer .28s cubic-bezier(.22,1,.36,1)}
  #resonance-album-panel[hidden] {display:none}
  #resonance-album-panel-header {display:flex;align-items:center;justify-content:space-between;gap:15px;margin-bottom:20px}
  #resonance-album-panel-header h2 {font-size:16px;margin:0}
  #resonance-root #resonance-album-panel-close {border:0;background:#ffffff0c;border-radius:50%;width:28px;height:28px;font-size:14px}
  #resonance-album-panel h3 {font-size:20px;line-height:1.25;letter-spacing:-.025em;margin:0 0 8px}
  #resonance-album-panel h4 {font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:1.5px;color:var(--accent);margin:23px 0 10px}
  #resonance-album-panel p {font-size:12px;line-height:1.65;color:#ffffff90;margin:6px 0;overflow-wrap:anywhere}
  #resonance-album-panel a {color:var(--accent);font-size:11px}
  #resonance-album-panel ul {padding-left:16px;margin:8px 0}
  #resonance-album-panel li {font-size:12px;color:#ffffff95;line-height:1.6;margin:5px 0}
  #resonance-album-tracklist {list-style:none;padding:0!important}
  #resonance-album-tracklist li {display:flex;align-items:baseline;gap:10px;padding:5px 0}
  #resonance-album-tracklist li[aria-current="true"] {color:var(--accent)}
  .resonance-album-track-name {flex:1;min-width:0}
  .resonance-album-track-number,.resonance-album-track-time {font:10px monospace;color:#ffffff65;flex-shrink:0}
  #resonance-root #resonance-album-open {font-size:11px;background:transparent;border:1px solid #ffffff25;border-radius:18px;padding:8px 12px;margin-top:15px}
  @media(prefers-reduced-motion:reduce) {#resonance-album-panel{animation:none}}

  #resonance-queue-tools {display:flex;gap:6px;margin-left:auto;margin-right:8px}
  #resonance-root:not([hidden]):not([data-page-hidden="true"])[data-background="ambient"][data-playing="true"][data-power="balanced"] .resonance-palette-layer {animation-play-state:running;will-change:transform}
  #resonance-root[data-power="low"] :is(#resonance-waves,#resonance-beat-glow) {visibility:hidden}
  #resonance-root[data-power="low"] .resonance-palette-layer {filter:none;animation:none;will-change:auto}
  #resonance-root[data-power="low"] .resonance-interlude-note {animation:none}
  #resonance-root[data-power="low"] #resonance-expanded-lines button {filter:none!important;transform:none!important;transition:none!important}
  #resonance-root[data-power="low"] :is(#resonance-search-panel,#resonance-album-panel) {backdrop-filter:none}
  #resonance-search-results {max-height:min(280px,calc(100vh - 290px));overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#ffffff30 transparent}
  #resonance-root #resonance-search-more {display:block;border:1px solid #ffffff20;border-radius:12px;background:#ffffff08;color:var(--accent);font-size:11px;width:100%;padding:8px;margin-top:8px}
  #resonance-root #resonance-search-more[hidden] {display:none}
  #resonance-root #resonance-search-more:disabled {opacity:.4}
  #resonance-root #resonance-album {font:inherit;font-size:clamp(13px,1.2vw,19px);border:0;background:transparent;padding:0;cursor:pointer}
  #resonance-root #resonance-album:hover:not(:disabled) {text-decoration:underline;text-underline-offset:4px}
  #resonance-root #resonance-album:disabled {cursor:default}
  #resonance-root #resonance-queue-tools button {font-size:11px;padding:6px 9px;border:1px solid #ffffff20;border-radius:12px;background:#ffffff06;color:#f4f5ef}
  #resonance-root #resonance-queue-tools button:disabled {opacity:.35;cursor:default}
  #resonance-root .resonance-queue-remove {flex-shrink:0;width:28px;height:28px;padding:0;border:0;border-radius:50%;background:transparent;color:#ffffff85;font-size:20px}
  #resonance-root .resonance-queue-remove:hover:not(:disabled) {background:#ffffff12;color:#ffb9b9}
  #resonance-root .resonance-queue-remove:disabled {opacity:.25;cursor:default}
  #resonance-root #resonance-search-toggle {width:36px;height:34px;padding:8px;display:grid;place-items:center;flex-shrink:0}
  #resonance-search-panel {position:absolute;z-index:6;top:112px;right:28px;width:min(360px,calc(100vw - 40px));max-height:calc(100vh - 150px);overflow:auto;padding:12px;background:#141a19fa;backdrop-filter:blur(24px);border:1px solid #ffffff25;border-radius:16px;box-shadow:0 18px 60px #0006;animation:resonance-drawer .22s cubic-bezier(.22,1,.36,1);color:#f4f5ef}
  #resonance-search-panel[hidden] {display:none}
  #resonance-search-field {display:flex;gap:8px;align-items:center;border-bottom:1px solid #ffffff20;padding-bottom:10px;margin-bottom:8px}
  #resonance-root #resonance-search-input {min-width:0;flex:1;background:transparent;border:0;color:#f4f5ef;font-family:inherit;font-size:14px;padding:7px 4px;outline-offset:2px}
  #resonance-search-tabs {display:flex;gap:6px;margin:8px 0}
  #resonance-search-tabs button {flex:1;padding:7px;border:1px solid #ffffff20;border-radius:20px;background:transparent;color:inherit;font:inherit;font-size:12px}
  #resonance-search-tabs button[aria-pressed="true"] {background:#ffffff20;border-color:var(--accent)}
  #resonance-search-input::placeholder {color:#ffffff80}
  #resonance-root #resonance-search-close {border:0;background:#ffffff0c;border-radius:50%;width:28px;height:28px;padding:0;color:#f4f5ef}
  .resonance-search-row {display:flex;align-items:center;gap:10px;padding:7px 2px;min-height:50px}
  .resonance-search-thumb {width:36px;height:36px;object-fit:cover;border-radius:5px;flex-shrink:0}
  .resonance-search-info {min-width:0;flex:1}
  #resonance-root .resonance-result-name {display:block;width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left;font-family:inherit;font-size:13px;font-weight:500;background:transparent;border:0;color:#f4f5ef;padding:3px 0}
  .resonance-search-info small {display:block;font-size:11px;color:#ffffff85;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  #resonance-root .resonance-add-queue {width:30px;height:30px;flex-shrink:0;border:1px solid #ffffff25;background:#ffffff08;color:#f4f5ef;border-radius:50%;padding:0;font-size:18px}
  #resonance-root .resonance-add-queue:hover:not(:disabled) {color:var(--accent);border-color:var(--accent);background:#ffffff12}
  #resonance-root .resonance-add-queue:disabled {opacity:.35;cursor:default}
  #resonance-search-status {font-size:12px;color:#ffffff90;line-height:1.5;padding:4px}
  #resonance-root #resonance-search-all {background:transparent;border:0;border-top:1px solid #ffffff15;border-radius:0;margin-top:8px;padding:12px 4px 2px;width:100%;text-align:left;font-size:11px;color:var(--accent)}
  #resonance-root .resonance-artist-link {font:inherit;color:inherit;line-height:inherit;padding:0;background:transparent;border:0;cursor:pointer}
  #resonance-root .resonance-artist-link:hover {text-decoration:underline;text-underline-offset:4px}
  #resonance-root .resonance-album-track-name {text-align:left;font:inherit;color:inherit;background:transparent;border:0;padding:4px 0;cursor:pointer}
  #resonance-root .resonance-album-track-name:hover:not(:disabled) {color:var(--accent)}
  #resonance-album-tracklist li {align-items:center}
  @media(max-width:620px) {#resonance-search-panel {top:140px;right:20px;max-height:calc(100vh - 165px)}}
  @media(prefers-reduced-motion:reduce) {#resonance-search-panel {animation:none}}
`;
  css.textContent+=`
  #resonance-root #resonance-lyric-line,#resonance-root #resonance-expanded-lines button[aria-current="true"] {color:var(--lyric-ink,#f4f5f1)}
  #resonance-root #resonance-expanded-lines button {color:rgba(var(--lyric-ink-rgb,244,245,241),.65)}
  #resonance-root :is(.resonance-translation,#resonance-lyric-note,#resonance-expanded-note,#resonance-expand-lyrics) {color:rgba(var(--lyric-ink-rgb,244,245,241),.75)}
  #resonance-root[data-lyric-contrast="dark"] #resonance-lyric-line {text-shadow:0 1px 2px #ffffff20}
  `;
  css.textContent+=`
  #resonance-themes {width:316px;max-width:calc(100vw - 40px);padding:16px 18px;scrollbar-width:thin;scrollbar-color:#ffffff30 transparent}
  .resonance-menu-heading {font-size:15px;font-weight:600;letter-spacing:-.02em;margin:0 0 10px;color:#f4f5ef}
  .resonance-setting-group {border-top:1px solid #ffffff12}
  .resonance-setting-group summary {list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;padding:13px 0;color:#ffffffbb;font-size:12px;font-weight:550}
  .resonance-setting-group summary::-webkit-details-marker {display:none}
  .resonance-setting-group summary::after {content:'+';font-size:16px;color:#ffffff65;font-weight:400}
  .resonance-setting-group[open] summary::after {content:'−'}
  .resonance-group-content {padding:0 0 17px}
  #resonance-root .resonance-group-content .resonance-setting-label,#resonance-root #resonance-visual-label {margin:15px 0 8px;font-size:10px;line-height:1.5;color:#ffffff80}
  #resonance-root .resonance-group-content>:first-child {margin-top:0}
  #resonance-root .resonance-setting-options button,#resonance-root #resonance-visual-options button {min-height:32px;padding:6px 11px;line-height:1.35}
  #resonance-root button:focus-visible,.resonance-setting-group summary:focus-visible {outline:2px solid var(--accent);outline-offset:3px}
  #resonance-swatches {gap:12px;flex-wrap:wrap}
  #resonance-artwork {width:min(100%,var(--art-max-size,46vh));justify-self:center}
  #resonance-root[data-layout="center"] #resonance-artwork {width:min(30vh,32vw,var(--art-max-size,30vh))}
  #resonance-info,#resonance-summary-title {color:var(--lyric-ink,#f4f5ef)}
  #resonance-artist {color:rgba(var(--lyric-ink-rgb,244,245,241),.8)}
  #resonance-album,#resonance-summary-artist,#resonance-summary-album {color:rgba(var(--lyric-ink-rgb,244,245,241),.65)}
  #resonance-header-right {max-width:100%}
  #resonance-actions {flex-wrap:wrap;justify-content:flex-end}
  #resonance-source {color:rgba(var(--lyric-ink-rgb,244,245,241),.65)}
  #resonance-root #resonance-actions button {color:var(--lyric-ink,#f4f5ef);border-color:rgba(var(--lyric-ink-rgb,244,245,241),.28)}
  @media(max-width:860px) {#resonance-header{gap:12px}#resonance-header-right{flex:1;min-width:0}#resonance-source{max-width:100%}}
  @media(max-width:620px) {#resonance-header{flex-wrap:wrap;padding-top:36px}#resonance-header-right{flex-basis:100%;gap:8px}#resonance-actions{gap:6px}#resonance-actions button{font-size:11px;padding:7px 10px}#resonance-content{width:90vw;gap:20px;grid-template-columns:min(34vw,36vh) minmax(0,1fr)}#resonance-title{font-size:24px;margin-bottom:12px}#resonance-artist{font-size:16px}#resonance-kicker{margin-bottom:12px;font-size:9px;letter-spacing:2px}}
  @media(max-height:720px) {#resonance-root[data-layout="center"]:not([data-art-no-lyrics="true"]) #resonance-lyrics{height:90px}#resonance-root[data-layout="center"] #resonance-lyric-line{min-height:44px}#resonance-root #resonance-artwork{width:min(40vh,100%,var(--art-max-size,40vh))}#resonance-root[data-layout="center"] #resonance-artwork{width:min(24vh,32vw,var(--art-max-size,24vh))}#resonance-kicker{margin-bottom:12px}#resonance-title{margin-bottom:12px}#resonance-artist{margin-bottom:8px}#resonance-info{max-height:100%}#resonance-player{gap:12px;padding-bottom:12px}}
`;
  css.textContent+=`
  #resonance-root[data-layout="karaoke"] #resonance-content {display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);grid-template-rows:minmax(0,1fr);width:86vw;max-width:1280px;gap:5vw;padding:12px 0 0;align-items:center}
  #resonance-root[data-layout="karaoke"] #resonance-artwork {display:block;grid-column:1;grid-row:1;width:min(100%,48vh,var(--art-max-size,48vh));justify-self:center;align-self:center}
  #resonance-root[data-layout="karaoke"] #resonance-expanded-lyrics {position:relative;inset:auto;grid-column:2;grid-row:1;width:100%;height:100%;min-height:0;padding:0 12px;scrollbar-width:thin}
  #resonance-root[data-layout="karaoke"] #resonance-expanded-lines {padding-block:24vh;gap:22px;align-items:flex-start}
  #resonance-root[data-layout="karaoke"] #resonance-expanded-lines button {font-size:clamp(23px,3.2vw,48px);font-weight:700;line-height:1.25;text-align:left;transform-origin:left center;padding-inline:4px;max-width:100%}
  #resonance-root[data-layout="karaoke"] #resonance-summary-title {font-size:clamp(17px,1.6vw,23px);line-height:1.3;max-width:80vw;margin:0 auto 4px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}
  #resonance-root[data-layout="karaoke"] :is(#resonance-summary-artist,#resonance-summary-album) {font-size:12px;line-height:1.5}
  #resonance-root[data-layout="karaoke"] #resonance-lyrics {padding:10px 0 4px}
  @media(max-width:620px) {
    #resonance-root[data-layout="karaoke"] #resonance-content {width:90vw;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,.4fr) minmax(0,.6fr);gap:12px;padding:0}
    #resonance-root[data-layout="karaoke"] #resonance-artwork {grid-column:1;grid-row:1;width:auto;height:min(100%,22vh);max-width:42vw;aspect-ratio:1}
    #resonance-root[data-layout="karaoke"] #resonance-expanded-lyrics {grid-column:1;grid-row:2;padding:0 8px}
    #resonance-root[data-layout="karaoke"] #resonance-expanded-lines {padding-block:14vh;align-items:center;gap:16px}
    #resonance-root[data-layout="karaoke"] #resonance-expanded-lines button {font-size:clamp(20px,5vw,30px);text-align:center;transform-origin:center}
  }
  @media(max-height:620px) and (min-width:621px) {
    #resonance-root[data-layout="karaoke"] #resonance-artwork {width:min(100%,36vh,var(--art-max-size,36vh))}
    #resonance-root[data-layout="karaoke"] #resonance-expanded-lines button {font-size:clamp(22px,3vw,36px)}
  }
`;
  css.textContent+=`
  #resonance-root #resonance-expanded-lyrics {scrollbar-width:thin;scrollbar-color:transparent transparent}
  #resonance-root #resonance-expanded-lyrics[data-scrolling="true"] {scrollbar-color:#ffffff45 transparent}
  #resonance-expanded-lyrics::-webkit-scrollbar {width:6px;background:transparent}
  #resonance-expanded-lyrics::-webkit-scrollbar-thumb {background:transparent;border-radius:6px}
  #resonance-expanded-lyrics[data-scrolling="true"]::-webkit-scrollbar-thumb {background:#ffffff45}
  #resonance-expanded-lyrics[data-scrolling="true"]::-webkit-scrollbar-thumb:hover {background:#ffffff75}
  `;
  css.textContent+=`
  #resonance-root #resonance-summary-artist {display:block;width:100%;margin:4px 0 5px;padding:0;line-height:1.5;font-size:12px;pointer-events:auto;background:none;border:0;color:inherit;cursor:pointer}
  #resonance-root #resonance-summary-album {pointer-events:auto;border:0;background:transparent;padding:0;font:inherit;font-size:12px;line-height:1.5;color:rgba(var(--lyric-ink-rgb,244,245,241),.65)}
  #resonance-root .resonance-album-title-play {font:inherit;letter-spacing:inherit;line-height:inherit;color:inherit;background:transparent;border:0;padding:0;text-align:left}
  #resonance-root :is(#resonance-summary-album,.resonance-album-title-play):hover:not(:disabled) {text-decoration:underline;text-underline-offset:4px}
  `;
  css.textContent+=`
  #resonance-root .resonance-timed-word {background:linear-gradient(to right,var(--lyric-ink,#f4f5ef) var(--word-progress,0%),rgba(var(--lyric-ink-rgb,244,245,241),.35) var(--word-progress,0%));background-clip:text;-webkit-background-clip:text;color:transparent;-webkit-text-fill-color:transparent;-webkit-text-stroke:0;white-space:pre-wrap}
  #resonance-root #resonance-expanded-lines button:not([aria-current="true"]) .resonance-timed-word {background:none;color:inherit;-webkit-text-fill-color:currentColor}
  #resonance-root[data-power="low"] .resonance-timed-word {background:none;color:inherit;-webkit-text-fill-color:currentColor}
  `;
  document.head.append(css);
  const diagnosticEvents=[];let lastMetadataUpdate=0,lastPlayerAvailability='';
  function recordDiagnostic(stage,result,error=null,status=null){
    const message=String(error?.message||'').replace(/https?:\/\/[^\s]+/gi,'[url]').replace(/spotify:[\w:]+/g,'[entity]').replace(/(?:[A-Za-z]:[\\/]|\/(?:Users|home)\/)[^\s]+/g,'[local-path]').replace(/(?:Bearer\s+|(?:token|authorization|cookie|password|api[_-]?key)\s*[:=])[^\r\n]*/gi,'[redacted]').slice(0,280);
    const where=String(error?.stack||'').match(/(?:resonanceDisplay|display-ui|lyrics-engine)\.js:\d+:\d+/)?.[0]||'';
    diagnosticEvents.push({at:new Date().toISOString(),stage,result,...(status!==null&&Number.isFinite(Number(status))?{status:Number(status)}:{}),...(message?{message}:{}),...(where?{where}:{})});
    if(diagnosticEvents.length>40)diagnosticEvents.shift();
  }
  window.addEventListener('error',event=>{if(/resonanceDisplay|display-ui|lyrics-engine/.test(event.filename||''))recordDiagnostic('javascript','error',event.error||{message:event.message});});
  window.addEventListener('unhandledrejection',event=>{if(/resonanceDisplay|display-ui|lyrics-engine/.test(event.reason?.stack||''))recordDiagnostic('javascript','unhandled-rejection',event.reason);});
  const launch = document.createElement('button');
  launch.id = 'resonance-launch'; launch.textContent = 'Resonance'; launch.title = 'Open artwork-focused listening view';
  const root = document.createElement('section'); root.id = 'resonance-root'; root.hidden = true;
  root.setAttribute('aria-label','Resonance listening view');
  root.innerHTML = `<div id="resonance-bg"></div><div id="resonance-aurora" aria-hidden="true"><div id="resonance-palette-a" class="resonance-palette-layer"></div><div id="resonance-palette-b" class="resonance-palette-layer"></div></div><div id="resonance-accent-bg" aria-hidden="true"></div><div id="resonance-beat-glow" aria-hidden="true"></div><div id="resonance-debug" aria-hidden="true"></div><div id="resonance-grain" aria-hidden="true"></div><header id="resonance-header"><div id="resonance-brand-wrap"><button id="resonance-brand" aria-label="Resonance appearance" aria-expanded="false" aria-controls="resonance-themes" title="Colors and visualizer">resonance</button><div id="resonance-themes" hidden role="dialog" aria-label="Resonance settings"><div class="resonance-menu-heading">Settings</div><details class="resonance-setting-group" open><summary>Look & layout</summary><div class="resonance-group-content"><div id="resonance-theme-label">Accent color</div><div id="resonance-swatches"></div><div class="resonance-setting-label">Background</div><div id="resonance-background-options" class="resonance-setting-options"></div><div class="resonance-setting-label">Mesh color rotation</div><div id="resonance-mesh-rotation-options" class="resonance-setting-options"></div><div class="resonance-setting-label">Artwork</div><div id="resonance-artwork-options" class="resonance-setting-options"></div><div class="resonance-setting-label">Layout</div><div id="resonance-layout-options" class="resonance-setting-options"></div></div></details><details class="resonance-setting-group"><summary>Visualizer</summary><div class="resonance-group-content"><div id="resonance-visual-label">Visualizer</div><div id="resonance-visual-options"></div><div class="resonance-setting-label">Motion</div><div id="resonance-motion-options" class="resonance-setting-options"></div><div id="resonance-analysis-info" style="font-size:10px;line-height:1.5;color:#ffffff70;margin-top:10px">Checking analysis availability</div><div class="resonance-setting-label">Beat pulse</div><div id="resonance-beat-ui-options" class="resonance-setting-options"></div></div></details><details class="resonance-setting-group"><summary>Lyrics</summary><div class="resonance-group-content"><div class="resonance-setting-label">Lyrics</div><div id="resonance-lyric-style-options" class="resonance-setting-options"></div><div class="resonance-setting-label">Word highlighting</div><div id="resonance-word-sync-options" class="resonance-setting-options"></div><div class="resonance-setting-options"><button id="resonance-timing-retry" title="Retry lyric timing; provider cooldowns still apply">Retry lyrics</button></div><div class="resonance-setting-label">Lyric timing (this song)</div><div id="resonance-sync-options" class="resonance-setting-options"><span id="resonance-sync-value">0.0s</span></div><div id="resonance-sync-hint">[ shows lyrics earlier · ] later · \\ resets</div><div id="resonance-single-line-setting"><div class="resonance-setting-label">Single-line lyrics · artwork layouts</div><div id="resonance-single-line-options" class="resonance-setting-options"></div><div class="resonance-setting-label">Keyword emphasis</div><div id="resonance-keyword-emphasis-options" class="resonance-setting-options"></div></div></div></details><details class="resonance-setting-group"><summary>Advanced</summary><div class="resonance-group-content"><div class="resonance-setting-label">Power usage</div><div id="resonance-power-options" class="resonance-setting-options"></div><div class="resonance-setting-label">Troubleshooting</div><div class="resonance-setting-options"><button id="resonance-diagnostics-save">Capture diagnostics</button><button id="resonance-diagnostics-copy">Copy diagnostics</button></div><div id="resonance-diagnostics-status" role="status" style="font-size:11px;line-height:1.5;margin-top:8px">Local report only. No tokens, account details or lyric text.</div><div class="resonance-setting-label">Debug overlay (D)</div><div id="resonance-debug-options" class="resonance-setting-options"></div></div></details></div></div><div id="resonance-header-right"><div id="resonance-source" aria-label="Playback source"></div><div id="resonance-actions"><button id="resonance-search-toggle" aria-label="Search Spotify" title="Search Spotify" aria-expanded="false" aria-controls="resonance-search-panel"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg></button><button id="resonance-album-panel-toggle" aria-expanded="false" aria-controls="resonance-album-panel">Album</button><button id="resonance-queue-toggle" aria-expanded="false" aria-controls="resonance-queue">Queue</button><button id="resonance-fullscreen">Fullscreen</button><button id="resonance-exit">Back to Spotify</button></div></div></header><section id="resonance-search-panel" hidden role="search" aria-label="Search Spotify"><div id="resonance-search-field"><input id="resonance-search-input" type="search" maxlength="160" placeholder="Search songs" aria-label="Search Spotify" autocomplete="off"><button id="resonance-search-close" aria-label="Close search">✕</button></div><div id="resonance-search-tabs" role="group" aria-label="Search category"></div><div id="resonance-search-results"></div><button id="resonance-search-more" hidden>More results</button><div id="resonance-search-status" role="status" aria-live="polite"></div><button id="resonance-search-all">Open full Spotify search ↗</button></section><aside id="resonance-album-panel" hidden aria-label="Album details"><div id="resonance-album-panel-header"><h2>Album details</h2><button id="resonance-album-panel-close" aria-label="Close album details">✕</button></div><div id="resonance-album-panel-content"></div></aside><aside id="resonance-queue" hidden aria-label="Upcoming songs"><div id="resonance-queue-header"><h2>Queue</h2><div id="resonance-queue-tools"><button id="resonance-queue-refresh" title="Refresh from Spotify’s current queue">Refresh</button><button id="resonance-queue-clear" title="Clear queued songs; Spotify may continue the current playlist">Clear</button></div><button id="resonance-queue-close" aria-label="Collapse queue">✕</button></div><div id="resonance-queue-current" aria-label="Currently playing"></div><div class="resonance-setting-label">Up next</div><ol id="resonance-queue-list"></ol><div id="resonance-queue-empty">No upcoming songs</div><button id="resonance-queue-more">Show more</button><div id="resonance-queue-status" role="status"></div></aside><main id="resonance-content"><div id="resonance-artwork"><div id="resonance-disc"><img id="resonance-cover-prev" alt="" aria-hidden="true" hidden><img id="resonance-cover" alt="Current album artwork"><div id="resonance-grooves"></div><div id="resonance-spindle"></div></div><div id="resonance-tonearm" aria-hidden="true"></div></div><div id="resonance-info"><div id="resonance-kicker">YOUR LISTENING SPACE</div><h1 id="resonance-title">Ready for music</h1><div id="resonance-artist">Play a song in Spotify</div><button id="resonance-album" title="Play album" disabled></button></div><section id="resonance-expanded-lyrics" hidden aria-label="Scrolling lyrics"><div id="resonance-expanded-lines"></div><div id="resonance-expanded-note"></div></section><button id="resonance-up-next" hidden aria-label="Play next song"><div id="resonance-up-next-label">UP NEXT</div><div id="resonance-up-next-title"></div><div id="resonance-up-next-artist"></div></button></main><section id="resonance-lyrics" aria-label="Current lyric"><div id="resonance-song-summary" hidden aria-label="Song details"><div id="resonance-summary-title"></div><button id="resonance-summary-artist" class="resonance-artist-link"></button><button id="resonance-summary-album" title="Play album" disabled></button></div><button id="resonance-lyric-line" disabled title="Seek to this lyric"></button><div id="resonance-lyric-tools"><div id="resonance-lyric-note"></div><button id="resonance-expand-lyrics" aria-expanded="false" aria-controls="resonance-expanded-lyrics">Lyrics + artwork</button></div></section><canvas id="resonance-waves" aria-hidden="true"></canvas><div id="resonance-player"><div id="resonance-progress"><span id="resonance-elapsed">0:00</span><input id="resonance-track" type="range" min="0" max="1" step="1000" value="0" aria-label="Song position" disabled><span id="resonance-duration">0:00</span></div><div id="resonance-controls"><button id="resonance-shuffle" aria-label="Enable shuffle" title="Enable shuffle" aria-pressed="false"></button><button id="resonance-previous" aria-label="Previous track" title="Previous track">⏮</button><button id="resonance-toggle" aria-label="Play or pause" title="Play or pause">▶</button><button id="resonance-next" aria-label="Next track" title="Next track">⏭</button><button id="resonance-repeat" aria-label="Repeat off" title="Repeat off" aria-pressed="false"></button><button id="resonance-like" aria-label="Add to Liked Songs" title="Add to Liked Songs" aria-pressed="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg></button></div><div id="resonance-status" role="status"></div></div><footer id="resonance-caption">AMBIENT WAVES · ESC TO RETURN</footer>`;
  document.body.append(launch,root);
  const get = id => document.getElementById('resonance-'+id);
  let visualDirty=true,canvasSize=null;
  const themes={sage:[191,220,179],sky:[161,203,236],lavender:[199,181,234],rose:[235,177,191],amber:[232,201,143]};
  let accentRGB=themes.sage,currentLyricPalette=[],accentName='sage',accentTween=0;
  function paintAccent(rgb){visualDirty=true;accentRGB=rgb;root.style.setProperty('--accent-rgb',rgb.join(','));root.style.setProperty('--accent','rgb('+rgb.join(',')+')');updateLyricContrast();}
  // Pick the most vivid album color, keep its hue, and lift it to a readable light accent.
  function albumAccent(colors){
    const palette=(colors||[]).filter(c=>/^#[0-9a-f]{6}$/i.test(c)).map(c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)));
    if(!palette.length)return null;
    const vivid=rgb=>{const mx=Math.max(...rgb),mn=Math.min(...rgb);return mx?(mx-mn)/mx*mx:0;};
    const chromatic=palette.filter(rgb=>Math.max(...rgb)-Math.min(...rgb)>=28&&(Math.max(...rgb)-Math.min(...rgb))/Math.max(1,Math.max(...rgb))>=.2);
    if(!chromatic.length)return [120,180,255];
    const pick=chromatic.sort((a,b)=>vivid(b)-vivid(a))[0],[r,g,b]=pick.map(v=>v/255);
    const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;
    if(d<.08)return [120,180,255];
    let h=mx===r?((g-b)/d)%6:mx===g?(b-r)/d+2:(r-g)/d+4;h*=60;if(h<0)h+=360;
    const l=.68,s=Math.max(.72,Math.min(.9,d/Math.max(.01,1-Math.abs(mx+mn-1)))),c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h/60)%2-1)),m=l-c/2;
    const q=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];
    return q.map(v=>Math.round((v+m)*255));
  }
  function applyAccent(target,animate){
    cancelAnimationFrame(accentTween);
    if(!animate||matchMedia('(prefers-reduced-motion: reduce)').matches){paintAccent(target);return;}
    const from=accentRGB.slice(),start=performance.now();
    const step=now=>{const t=Math.min(1,(now-start)/700),e=1-Math.pow(1-t,3);paintAccent(from.map((v,i)=>Math.round(v+(target[i]-v)*e)));if(t<1)accentTween=requestAnimationFrame(step);};
    accentTween=requestAnimationFrame(step);
  }
  function setTheme(name,persist=true){
    if(name!=='album'&&!themes[name])name='sage';
    accentName=name;
    applyAccent(name==='album'?(albumAccent(currentLyricPalette)||accentRGB):themes[name],name==='album'&&persist);
    for(const button of get('swatches').children)button.setAttribute('aria-pressed',String(button.dataset.theme===name));
    if(persist)try{localStorage.setItem('resonance-accent',name);}catch{}
  }
  for(const [name,rgb] of Object.entries(themes)){const button=document.createElement('button');button.dataset.theme=name;button.title=name[0].toUpperCase()+name.slice(1);button.setAttribute('aria-label',button.title);button.style.setProperty('--swatch','rgb('+rgb.join(',')+')');button.onclick=()=>setTheme(name);get('swatches').append(button);}
  {const button=document.createElement('button');button.dataset.theme='album';button.title='Match album';button.setAttribute('aria-label','Match album artwork');button.style.setProperty('--swatch','#c9c3d8');button.onclick=()=>setTheme('album');get('swatches').append(button);}
  let storedTheme='sage';try{storedTheme=localStorage.getItem('resonance-accent')||'sage';}catch{}setTheme(storedTheme,false);
  let visualStyle='waves';
  const visualStyles={waves:'Waves',ribbon:'Ribbon',bars:'Bars',dots:'Dots',off:'Off'};
  function setVisualStyle(name,persist=true){
    visualDirty=true;visualStyle=visualStyles[name]?name:'waves';
    for(const button of get('visual-options').children)button.setAttribute('aria-pressed',String(button.dataset.visual===visualStyle));
    if(persist)try{localStorage.setItem('resonance-visual-style',visualStyle);}catch{}
  }
  for(const [name,label] of Object.entries(visualStyles)){const button=document.createElement('button');button.textContent=label;button.dataset.visual=name;button.onclick=()=>setVisualStyle(name);get('visual-options').append(button);}
  let storedVisual='waves';try{storedVisual=localStorage.getItem('resonance-visual-style')||'waves';}catch{}setVisualStyle(storedVisual,false);
  function appearanceOption(key,values,fallback){
    const container=get(key+'-options');
    const apply=(value,persist=true)=>{
      visualDirty=true;canvasSize=null;
      if(!Object.hasOwn(values,value))value=fallback;root.dataset[key.replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=value;
      for(const button of container.children)button.setAttribute('aria-pressed',String(button.dataset.value===value));
      if(persist)try{localStorage.setItem('resonance-'+key,value);}catch{}
      if(key==='background')updateLyricContrast();
      if(key==='layout'){if(persist)lyricFallbackLayout='';syncLayout();}
      if(key==='single-line')syncLyricsVisibility();
      if(key==='word-sync'&&persist){lyricKey='';expandedRowsKey='';desiredLyricRow=null;update();}
      if(key==='power'&&persist&&!root.hidden){analysisURI='';update();}
    };
    for(const [value,label] of Object.entries(values)){const button=document.createElement('button');button.textContent=label;button.dataset.value=value;button.onclick=()=>{apply(value);if(key==='lyric-style'){expandedKey='';syncLyricsVisibility();} };container.append(button);}
    let stored=fallback;try{stored=localStorage.getItem('resonance-'+key)||fallback;}catch{}apply(stored,false);return apply;
  }
  const MODES={
    punch:{rise:.018,fall:.16,beat:1.25,amplitude:1.65,drift:1.8,normalize:true,grid:false,detail:.38,pulseRise:.025,pulseFall:.12,flash:true},
    calm:{rise:.25,fall:.6,beat:.16,amplitude:.72,drift:.65,normalize:false,grid:false,detail:.10},
    tight:{rise:.05,fall:.25,beat:.65,amplitude:1,drift:1,normalize:true,grid:false,detail:.24},
    flow:{rise:.18,fall:.45,beat:.42,amplitude:.92,drift:1,normalize:true,grid:true,detail:.16}
  };
  const setMotion=appearanceOption('motion',{calm:'Calm',tight:'Tight',flow:'Flow',punch:'Punch'},'calm');
  const motionMode=()=>MODES[root.dataset.motion]||MODES.calm;
  const setWordSync=appearanceOption('word-sync',{on:'Auto',off:'Off'},'on');
  const setMeshRotation=appearanceOption('mesh-rotation',{off:'Off',time:'Time',beats:'Beats'},'off');
  const setBackground=appearanceOption('background',{dark:'Dark',artwork:'Artwork',ambient:'Mesh',accent:'Accent'},'ambient');
  const setPower=appearanceOption('power',{balanced:'Balanced',low:'Low power'},'balanced');
  const setDebug=appearanceOption('debug',{on:'On',off:'Off'},'off');
  const setBeatUI=appearanceOption('beat-ui',{on:'On',off:'Off'},'on');
  const setArtworkMode=appearanceOption('artwork',{cover:'Cover',vinyl:'Vinyl'},'cover');
  const setKeywordEmphasis=appearanceOption('keyword-emphasis',{on:'On',off:'Off'},'on');
  const setLyricStyle=appearanceOption('lyric-style',{off:'Off',classic:'Classic',animated:'Animated'},'animated');
  function paletteFromPixels(pixels){
    const bins=new Map();
    for(let i=0;i<pixels.length;i+=4){
      if(pixels[i+3]<128)continue;
      const rgb=[pixels[i],pixels[i+1],pixels[i+2]],key=rgb.map(n=>Math.floor(n/32)).join(',');
      const bin=bins.get(key)||{n:0,sum:[0,0,0]};bin.n++;rgb.forEach((v,j)=>bin.sum[j]+=v);bins.set(key,bin);
    }
    const ranked=[...bins.values()].sort((a,b)=>b.n-a.n).map(bin=>({rgb:bin.sum.map(v=>Math.round(v/bin.n)),n:bin.n}));
    if(!ranked.length)return [];
    const selected=[ranked[0].rgb],distance=(a,b)=>Math.hypot(...a.map((v,j)=>v-b[j]));
    const saturation=rgb=>(Math.max(...rgb)-Math.min(...rgb))/Math.max(1,Math.max(...rgb));
    // Keep the dominant tone and reserve space for distinct colorful details,
    // rather than letting a large neutral background occupy every palette slot.
    let candidates=ranked.filter(bin=>bin.n>=2&&saturation(bin.rgb)>.18);
    while(selected.length<8&&candidates.length){
      candidates=candidates.filter(bin=>selected.every(color=>distance(color,bin.rgb)>55));
      if(!candidates.length)break;
      const score=bin=>Math.min(...selected.map(color=>distance(color,bin.rgb)))*(saturation(bin.rgb)+.25)*Math.sqrt(bin.n);
      let best=0,bestScore=-1;candidates.forEach((bin,index)=>{const value=score(bin);if(value>bestScore){best=index;bestScore=value;}});
      selected.push(candidates.splice(best,1)[0].rgb);
    }
    for(const bin of ranked){if(selected.length>=8)break;if(selected.every(color=>distance(color,bin.rgb)>55))selected.push(bin.rgb);}
    return selected.map(color=>'#'+color.map(v=>v.toString(16).padStart(2,'0')).join(''));
  }
  let paletteGeneration=0,paletteSlot=false;
  const paletteCache=new Map();
  function relativeLuminance(rgb){return rgb.map(v=>{const x=v/255;return x<=.04045?x/12.92:Math.pow((x+.055)/1.055,2.4);}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);}
  function contrastRatio(a,b){const x=relativeLuminance(a),y=relativeLuminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
  function lyricContrast(colors,background,accent){
    const palette=colors.filter(c=>/^#[0-9a-f]{6}$/i.test(c)).map(c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)));
    const average=[0,1,2].map(i=>palette.length?palette.reduce((sum,c)=>sum+c[i],0)/palette.length:30);
    // Estimate the visible treatment, not just the raw cover's brightness.
    const bg=background==='dark'?[8,11,12]:background==='accent'?accent.map((v,i)=>v*.22+[11,16,18][i]*.78):average.map(v=>Math.round(v*(background==='artwork'?.38*.8:.72*.86)+8));
    const white=[244,245,241],black=[20,25,26],darkText=contrastRatio(black,bg)>contrastRatio(white,bg),text=darkText?black:white;
    const score=rgb=>(Math.max(...rgb)-Math.min(...rgb))*1.5+Math.max(...rgb)*.2;
    palette.sort((a,b)=>score(b)-score(a));
    // Keep emphasis album-derived and dark, independently of the UI accent.
    const colored=palette.filter(rgb=>Math.max(...rgb)-Math.min(...rgb)>=25);
    const source=(colored.length?colored:palette)[0]||[65,70,70];
    const peak=Math.max(...source),factor=peak>105?105/peak:1;
    let emphasis=source.map(v=>Math.round(v*factor));
    if(darkText)while(contrastRatio(emphasis,bg)<4.5&&Math.max(...emphasis)>0)emphasis=emphasis.map(v=>Math.max(0,v-3));
    return {text,emphasis,bg,darkText};
  }
  function updateLyricContrast(){
    const result=lyricContrast(currentLyricPalette,root.dataset.background||'ambient',accentRGB);
    const rgb=c=>'rgb('+c.join(',')+')';root.style.setProperty('--lyric-ink',rgb(result.text));root.style.setProperty('--lyric-ink-rgb',result.text.join(','));
    root.style.setProperty('--lyric-album-color',rgb(result.emphasis));root.style.setProperty('--lyric-album-rgb',result.emphasis.join(','));
    root.dataset.lyricContrast=result.darkText?'dark':'light';
  }
  let meshColors=[],meshOffset=0;const meshState={elapsed:0,beat:null,mode:''};
  function meshStep(state,delta,beat,mode){
    if(state.mode!==mode){state.mode=mode;state.elapsed=0;state.beat=null;}
    if(mode==='time')state.elapsed+=Math.max(0,delta)/12;
    else if(mode==='beats'&&Number.isFinite(beat)){if(state.beat!==null){const change=beat-state.beat;if(change>=0&&change<=4)state.elapsed+=change/32;}state.beat=beat;}
    if(state.elapsed<1)return false;state.elapsed%=1;return true;
  }
  function showPalette(colors){
    if(!colors.length)return;
    currentLyricPalette=colors;updateLyricContrast();
    if(accentName==='album'){const match=albumAccent(colors);if(match)applyAccent(match,true);}
    meshColors=colors.slice();meshOffset=0;meshState.elapsed=0;meshState.beat=null;renderMesh(colors);
  }
  function renderMesh(colors,rotating=false){
    const c=colors.filter(color=>/^#[0-9a-f]{6}$/i.test(color)).slice(0,8);if(!c.length)return;
    const base=c.slice();while(c.length<5)c.push(base[c.length%base.length]);
    const next=get(paletteSlot?'palette-a':'palette-b'),old=get(paletteSlot?'palette-b':'palette-a');paletteSlot=!paletteSlot;
    const positions=[[16,18],[84,15],[52,60],[10,80],[87,83],[47,7],[35,94],[95,48]];
    const splashes=c.map((color,index)=>{const [x,y]=positions[index];return 'radial-gradient(ellipse 40% 44% at '+x+'% '+y+'%,'+color+'d9 0%,'+color+'99 28%,transparent 100%)';});
    next.style.background=[...splashes,'linear-gradient(135deg,#101719,#101218)'].join(',');
    next.style.backgroundSize=c.map(()=>'100% 100%').concat('100% 100%').join(',');next.style.backgroundRepeat='no-repeat';
    next.style.transitionDuration=old.style.transitionDuration=rotating?'8s':'2.4s';
    next.style.opacity='1';old.style.opacity='0';
  }
  async function loadPalette(image,uri){
    const generation=++paletteGeneration;
    currentLyricPalette=[];updateLyricContrast();
    if(!image){showPalette(['#233535','#28352f','#242b3d']);return;}
    if(paletteCache.has(image)){showPalette(paletteCache.get(image));return;}
    let colors=[];
    try{
      const picture=document.createElement('img');picture.crossOrigin='anonymous';
      await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Image timeout')),6000);picture.onload=()=>{clearTimeout(timer);resolve();};picture.onerror=()=>{clearTimeout(timer);reject(Error('Image unavailable'));};picture.src=image;});
      const canvas=document.createElement('canvas');canvas.width=32;canvas.height=32;const ctx=canvas.getContext('2d');ctx.drawImage(picture,0,0,32,32);colors=paletteFromPixels(ctx.getImageData(0,0,32,32).data);
    }catch{}
    if(colors.length<3)try{const presets=await withTimeout(Spicetify.colorExtractor(uri),5000,'Palette timeout');colors=[...new Set(Object.values(presets||{}).filter(c=>/^#[0-9a-f]{6}$/i.test(c)))].slice(0,5);}catch{}
    if(generation!==paletteGeneration)return;
    if(colors.length){if(paletteCache.size>=30)paletteCache.delete(paletteCache.keys().next().value);paletteCache.set(image,colors);showPalette(colors);}
  }
  get('brand').onclick=()=>{get('themes').hidden=!get('themes').hidden;get('brand').setAttribute('aria-expanded',String(!get('themes').hidden));wakeControls();};
  let artwork = '', phase = 0, previous = 0, frame = 0, oldFocus;
  let savingURI = '', checkedURI = '';
  const savedTracks = new Map();
  let fallbackPlayerState=null;
  function wrapperPlayerState(){
    try{for(const state of [Spicetify.Player.data,Spicetify.Player.origin?._state])if(state?.item?.uri)return state;}catch{}
    return null;
  }
  function refreshPlayerState(){
    fallbackPlayerState=null;
    if(wrapperPlayerState()){if(lastPlayerAvailability!=='wrapper')recordDiagnostic('player-state','wrapper-available');lastPlayerAvailability='wrapper';return;}
    try{const state=Spicetify.Platform?.PlayerAPI?.getState?.();if(state?.item?.uri)fallbackPlayerState=state;}catch(error){recordDiagnostic('player-state','direct-state-error',error);}
    const available=fallbackPlayerState?'direct-fallback':'missing';if(available!==lastPlayerAvailability)recordDiagnostic('player-state',available);lastPlayerAvailability=available;
  }
  function playerState(){return wrapperPlayerState()||fallbackPlayerState;}
  function currentTrack(){return playerState()?.item||null;}
  function playbackDuration(){
    if(fallbackPlayerState)return Math.max(0,Number(fallbackPlayerState.duration)||0);
    try{return Spicetify.Player.getDuration()||0;}catch{return 0;}
  }
  function playbackProgress(){
    const state=fallbackPlayerState;
    if(state){const elapsed=!state.isPaused&&Number.isFinite(state.timestamp)?Math.max(0,Date.now()-state.timestamp):0;return Math.min(playbackDuration(),Math.max(0,(Number(state.positionAsOfTimestamp)||0)+elapsed));}
    try{return Spicetify.Player.getProgress()||0;}catch{return 0;}
  }
  function artistCredits(track) {
    const meta=track?.metadata||{},names=[];
    const add=name=>{if(typeof name==='string'&&name.trim()&&!names.includes(name.trim()))names.push(name.trim());};
    for(const artist of track?.artists||[])add(artist.name);
    if(!names.length) {
      add(meta.artist_name);
      Object.keys(meta).filter(key=>/^artist_name:\d+$/.test(key)).sort((a,b)=>Number(a.split(':')[1])-Number(b.split(':')[1])).forEach(key=>add(meta[key]));
    }
    // Spotify credits do not reliably distinguish featured artists from collaborators.
    return names.join(', ');
  }
  function currentURI() { return currentTrack()?.uri || ''; }
  function renderHeart() {
    const uri = currentURI(), available = /^spotify:track:[A-Za-z0-9]+$/.test(uri);
    const saved = savedTracks.get(uri) === true;
    const label = savingURI === uri && uri ? 'Saving to Liked Songs…' : (saved ? 'Remove from Liked Songs' : 'Add to Liked Songs');
    get('like').disabled = !available || savingURI === uri || (!savedTracks.has(uri)&&heartChecks.has(uri));
    get('like').setAttribute('aria-pressed', String(saved));
    get('like').setAttribute('aria-label', label); get('like').title = label;
  }
  const heartChecks=new Map(),heartVersions=new Map();
  async function checkHeart() {
    const uri=currentURI();
    renderHeart();
    if(!/^spotify:track:[A-Za-z0-9]+$/.test(uri)||checkedURI===uri)return;
    if(heartChecks.has(uri))return heartChecks.get(uri);
    const api=window.Spicetify?.Platform?.LibraryAPI;
    if(!api?.contains)return;
    const version=heartVersions.get(uri)||0;
    const request=(async()=>{
      try {
        const [saved]=await withTimeout(Promise.resolve().then(()=>api.contains(uri)),7000);
        if((heartVersions.get(uri)||0)!==version)return;
        savedTracks.set(uri,Boolean(saved));checkedURI=uri;
      }catch {checkedURI=uri;}
      finally {heartChecks.delete(uri);if(currentURI()===uri)renderHeart();}
    })();
    heartChecks.set(uri,request);renderHeart();
    return request;
  }
  get('like').onclick=async()=>{
    const uri=currentURI();
    if(!/^spotify:track:[A-Za-z0-9]+$/.test(uri)||savingURI)return;
    savingURI=uri;renderHeart();text('status','');
    try {
      if(!savedTracks.has(uri)){
        checkedURI='';await checkHeart();
        if(currentURI()!==uri)return;
        if(!savedTracks.has(uri))throw Error('Saved state unavailable');
      }
      const wasSaved=savedTracks.get(uri)===true;
      const api=window.Spicetify?.Platform?.LibraryAPI;
      if(!api?.add||!api?.remove)throw Error('Library unavailable');
      heartVersions.set(uri,(heartVersions.get(uri)||0)+1);
      await withTimeout(wasSaved?api.remove({uris:[uri]}):api.add({uris:[uri]}),7000);
      savedTracks.set(uri,!wasSaved);checkedURI=uri;
      if(currentURI()===uri)flashStatus(wasSaved?'Removed from Liked Songs':'Added to Liked Songs');
    }catch(error) {
      if(error?.message==='Timed out'){savedTracks.delete(uri);checkedURI='';}
      if(currentURI()===uri)text('status',operationError(error,'Couldn’t update Liked Songs. Try the heart again.'));
    }finally {savingURI='';renderHeart();}
  };
  const icons = {
    repeat:'<path d="m17 2 4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4m14-1v2a3 3 0 0 1-3 3H3"/>',
    shuffle:'<path d="M3 6h3c4 0 8 12 12 12h3m-4-4 4 4-4 4M3 18h3c1.4 0 3-1.5 4.5-3.5M14 9.5C15.5 7.5 16.8 6 18 6h3m-4-4 4 4-4 4"/>',
    previous:'<path d="M5 4v16M19 5 7 12l12 7Z"/>',
    next:'<path d="M19 4v16M5 5l12 7-12 7Z"/>',
    play:'<path d="m8 5 11 7-11 7Z"/>',
    pause:'<path d="M7 5v14M17 5v14"/>'
  };
  function icon(id,name) { if(get(id).dataset.icon!==name) { get(id).innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" aria-hidden="true">'+icons[name]+'</svg>';get(id).dataset.icon=name;} }
  icon('previous','previous'); icon('next','next'); icon('shuffle','shuffle'); icon('repeat','repeat');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let statusTimer,statusAnimation,statusGeneration=0;
  const text = (id,value) => {
    if(id==='status'){statusGeneration++;clearTimeout(statusTimer);statusAnimation?.cancel();statusAnimation=null;}
    if(get(id).textContent !== value)get(id).textContent=value;
  };
  function flashStatus(message) {
    text('status',message);const generation=statusGeneration;
    statusTimer=setTimeout(()=>{
      if(generation!==statusGeneration)return;
      const status=get('status');
      if(reduced.matches||typeof status.animate!=='function'){text('status','');return;}
      statusAnimation=status.animate([{opacity:1},{opacity:0}],{duration:450,easing:'ease-out',fill:'forwards'});
      statusAnimation.onfinish=()=>{if(generation===statusGeneration)text('status','');};
    },2400);
  }
  function operationError(error,fallback){recordDiagnostic('playback-operation','unconfirmed',error);return error?.message==='Timed out'?'Spotify hasn’t confirmed this action yet. Check its current state before retrying.':fallback;}
  async function withTimeout(request,ms,message='Timed out'){
    let timer;
    try{return await Promise.race([request,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error(message)),ms);})]);}
    finally{clearTimeout(timer);}
  }
  function native(selector) { return document.querySelector(selector); }
  function playing() {
    try {
      const state = fallbackPlayerState||window.Spicetify?.Player?.origin?._state||playerState();
      if(typeof state?.isPaused === 'boolean') return !state.isPaused;
    } catch {}
    const toggle = native('[data-testid="control-button-playpause"]');
    return !!toggle && /pause/i.test(toggle.getAttribute('aria-label') || '');
  }
  let lyricRevision=0;
  let lyricKey='', lyricRows=[], lyricSource='', lyricLoad=0;
  // Per-song lyric timing nudge in ms. Negative shows lyrics earlier, positive later.
  let lyricOffsets={},lyricOffset=0;
  try{const stored=JSON.parse(localStorage.getItem('resonance-lyric-offsets')||'{}');
    if(stored&&typeof stored==='object'&&!Array.isArray(stored))for(const [uri,value] of Object.entries(stored).slice(-300))if(/^spotify:track:[A-Za-z0-9]+$/.test(uri)&&Number.isFinite(value))lyricOffsets[uri]=Math.max(-5000,Math.min(5000,Math.round(value/100)*100));
  }catch{}
  function syncOffsetUI(){const label=get('sync-value');if(label)label.textContent=(lyricOffset>0?'+':'')+(lyricOffset/1000).toFixed(1)+'s';}
  function nudgeLyrics(delta){
    const uri=currentURI();if(!/^spotify:track:[A-Za-z0-9]+$/.test(uri)||!Number.isFinite(delta))return;
    if(lyricKey.split('|')[0]!==uri){lyricOffset=lyricOffsets[uri]||0;}
    lyricOffset=delta===0?0:Math.max(-5000,Math.min(5000,lyricOffset+delta));
    if(lyricOffset)lyricOffsets[uri]=lyricOffset;else delete lyricOffsets[uri];
    try{const keys=Object.keys(lyricOffsets);if(keys.length>300)delete lyricOffsets[keys[0]];localStorage.setItem('resonance-lyric-offsets',JSON.stringify(lyricOffsets));}catch{}
    syncOffsetUI();drawLyrics();
    flashStatus(lyricOffset?'Lyrics '+(lyricOffset<0?'earlier':'later')+' by '+Math.abs(lyricOffset/1000).toFixed(1)+'s':'Lyric timing reset');
  }
  for(const [label,delta] of [['− 0.1s',-100],['+ 0.1s',100],['Reset',0]]){const button=document.createElement('button');button.textContent=label;button.onclick=()=>nudgeLyrics(delta);get('sync-options').append(button);}
  syncOffsetUI();
  let expandedLyrics=false,expandedKey='';
  let lyricFallbackLayout='',lyricSettled=false;
  let showLyrics=true, lyricState='Play a song to see lyrics';
  const lyricCache=new Map();
  get('timing-retry').onclick=()=>{lyricCache.delete(lyricKey);lyricKey='';update();};
  function fitLyric() {
    const line=get('lyric-line');line.style.fontSize='32px';
    const width=get('lyrics').clientWidth;
    if(width>0&&line.scrollWidth>width) line.style.fontSize=Math.max(11,32*width/line.scrollWidth)+'px';
  }
  const normalize=value=>String(value||'').normalize('NFKD').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
  const timingBackoff=new Map();let timingAbort=null;
  async function timingJSON(url){
    const host=url.startsWith('https://api.betterlyrics.org/')?'better':'lrclib';
    const endpoint=url.includes('/qq/getLyrics')?'better-qq':host;
    if((timingBackoff.get(endpoint)||0)>Date.now()||(timingBackoff.get(host+'-rate')||0)>Date.now())return null;
    const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),5000);timingAbort=abort;
    try{
      // Better Lyrics does not send browser CORS headers. Use the same public
      // proxy template as Spicetify external requests; never attach Spotify auth.
      const template=localStorage.getItem('spicetify:corsProxyTemplate')||'https://cors-proxy.spicetify.app/{url}';
      const requestURL=host==='better'&&template.startsWith('https://')&&template.includes('{url}')?template.replace('{url}',url):url;
      const response=await fetch(requestURL,{signal:abort.signal,headers:host==='lrclib'?{'X-User-Agent':'Resonance/4.17 (https://github.com/Game0ver247/resonance)'}:{}});
      recordDiagnostic('timing-'+endpoint,response.ok?'response':'http-error',null,response.status||null);
      if(!response.ok){
        // A missing key can reject just this uncached query. Do not disable other songs.
        if([403,429,503].includes(response.status)){const retry=Number(response.headers?.get?.('Retry-After'));timingBackoff.set(response.status===429?host+'-rate':endpoint,Date.now()+(response.status===403?3600000:Math.max(60,Number.isFinite(retry)?retry:60)*1000));}
        return null;
      }
      return await response.json();
    }catch(error){recordDiagnostic('timing-'+endpoint,'request-error',error);return null;}finally{clearTimeout(timer);if(timingAbort===abort)timingAbort=null;}
  }
  async function enrichTiming(meta,duration,baseline,lrclib,isCurrent){
    if(!baseline.length&&!lrclib?.hasWordSync)return null;
    const query=new URLSearchParams({s:meta.title,a:meta.artist_name||'',al:meta.album_title||'',d:String(Math.round(duration/1000))});
    const data=baseline.length?await timingJSON('https://api.betterlyrics.org/getLyrics?'+query):null;
    if(!isCurrent())return null;
    if(data?.ttml&&(!Number.isFinite(data.score)||data.score>=.85)){
      const rows=ResonanceLyrics.ttml(data.ttml,duration);
      if(ResonanceLyrics.matchesTiming(rows,baseline,duration)){recordDiagnostic('timing-match','accepted-ttml');return {rows,source:'Better Lyrics'};}
      recordDiagnostic('timing-match','ttml-rejected-or-no-word-data');
    }
    const qq=baseline.length?await timingJSON('https://api.betterlyrics.org/qq/getLyrics?'+query):null;
    if(!isCurrent())return null;
    if(qq?.provider==='qq'&&typeof qq.lyrics==='string'){
      const rows=ResonanceLyrics.qrc(qq.lyrics,duration);
      if(ResonanceLyrics.matchesTiming(rows,baseline,duration)){recordDiagnostic('timing-match','accepted-qrc');return {rows,source:'Better Lyrics QQ'};}
      recordDiagnostic('timing-match','qrc-rejected-or-no-word-data');
    }
    const q=new URLSearchParams({track_name:meta.title,artist_name:meta.artist_name||'',album_name:meta.album_title||'',duration:String(Math.round(duration/1000))});
    const record=lrclib||await timingJSON('https://lrclib.net/api/get?'+q);
    if(!isCurrent())return null;
    if(record?.hasWordSync!==true||normalize(record.trackName)!==normalize(meta.title)||normalize(record.artistName)!==normalize(meta.artist_name)||!Number.isFinite(record.duration)||Math.abs(record.duration*1000-duration)>2500)return null;
    if(meta.album_title&&record.albumName&&normalize(record.albumName)!==normalize(meta.album_title))return null;
    const rows=ResonanceLyrics.lyricsfile(record.lyricsfile,duration);
    if(!rows.some(row=>row.words?.length))return null;
    if(baseline.length&&!ResonanceLyrics.matchesTiming(rows,baseline,duration))return null;
    recordDiagnostic('timing-match','accepted-lyricsfile');return {rows,source:'LRCLIB'};
  }
  async function loadLyrics(meta,duration) {
    if(!(duration>0))return;
    const uri=currentURI(),key=uri+'|'+(meta.title||'')+'|'+root.dataset.wordSync;
    if(key===lyricKey)return;
    timingAbort?.abort();timingAbort=null;
    get('lyric-line').disabled=true;get('lyric-line').onclick=null;expandedKey='';
    lyricRevision++;lyricKey=key;lyricOffset=Number(lyricOffsets[uri])||0;syncOffsetUI();const generation=++lyricLoad;lyricRows=[];lyricSettled=false;lyricState='Finding lyrics…';lyricSource='';
    if(!uri.startsWith('spotify:track:')||!meta.title){lyricState='Play a song to see lyrics';return;}
    const cached=lyricCache.get(key);
    if(cached&&!(cached.expires<Date.now())){lyricRows=cached.rows;lyricSource=cached.source;lyricState=cached.state;lyricSettled=true;return;}
    lyricCache.delete(key);
    // Remember "no lyrics" only when every source gave a definite answer, never after a timeout or network error.
    let answered=true,lrclibRecord=null;
    const accept=(rows,source)=>{
      if(generation!==lyricLoad||!rows.length)return false;
      lyricRevision++;lyricRows=rows;lyricSource=source;lyricState='';return true;
    };
    try {
      const endpoint='https://spclient.wg.spotify.com/color-lyrics/v2/track/'+encodeURIComponent(uri.split(':')[2])+'?format=json&vocalRemoval=false&market=from_token&clientLanguage=en';
      const payload=await withTimeout(Spicetify.CosmosAsync.get(endpoint),6500,'Lyrics timeout');
      if(!payload?.lyrics||!Array.isArray(payload.lyrics.lines)||payload.error)answered=false;
      recordDiagnostic('spotify-lyrics',payload?.error?'provider-error':'response',null,payload?.code||null);
      accept(ResonanceLyrics.spotify(payload,duration),'Spotify');
    }catch(error){recordDiagnostic('spotify-lyrics','request-error',error,error?.status??error?.code??null);if((error?.status??error?.code)!==404)answered=false;}
    if(generation!==lyricLoad)return;
    // Only request the fallback when Spotify supplies no synced lines.
    if(!lyricRows.length) {
      const abort=new AbortController(),timeout=setTimeout(()=>abort.abort(),7000);
      try {
        const query=new URLSearchParams({track_name:meta.title,artist_name:meta.artist_name||'',album_name:meta.album_title||'',duration:String(Math.round(duration/1000))});
        const response=await fetch('https://lrclib.net/api/get?'+query,{signal:abort.signal});
        if(response.ok){const data=await response.json();lrclibRecord=data;
          if(typeof data?.trackName!=='string'||typeof data?.instrumental!=='boolean')answered=false;
          if(generation!==lyricLoad)return;
          const validTitle=!data.trackName||normalize(data.trackName)===normalize(meta.title);
          const validDuration=!data.duration||Math.abs(data.duration*1000-duration)<2500;
          if(validTitle&&validDuration){const rows=ResonanceLyrics.lrc(data.syncedLyrics,duration);accept(rows,'LRCLIB');if(data.instrumental&&!lyricRows.length)lyricState='Instrumental';}
        }else if(response.status!==404)answered=false;
      }catch{answered=false;}finally{clearTimeout(timeout);}
    }
    if(generation!==lyricLoad)return;
    lyricSettled=true;
    if(root.dataset.wordSync==='on'){
      const baseline=lyricRows,upgrade=await enrichTiming(meta,duration,baseline,lrclibRecord,()=>generation===lyricLoad);
      if(generation!==lyricLoad)return;
      if(upgrade){for(const row of upgrade.rows){const original=baseline.find(line=>normalize(line.text)===normalize(row.text));if(original?.translation)row.translation=original.translation;}accept(upgrade.rows,upgrade.source);}
    }
    if(!lyricRows.length&&lyricState!=='Instrumental')lyricState='Synced lyrics unavailable for this song';
    if(lyricCache.size>=50)lyricCache.delete(lyricCache.keys().next().value);
    if(lyricRows.length)lyricCache.set(key,{rows:lyricRows,source:lyricSource,state:lyricState,expires:root.dataset.wordSync==='on'&&!lyricRows.some(row=>row.words?.length)?Date.now()+300000:undefined});
    else if(answered)lyricCache.set(key,{rows:[],source:'',state:lyricState,expires:Date.now()+600000});
  }
  // Local visual heuristic, not word timing or a language-understanding service.
  const lyricStopWords=new Set(("a an the and or but so if as at by for from in into of off on out to up with without i me my mine myself you your yours yourself he him his she her hers it its we us our ours they them their theirs this that these those is am are was were be been being do does did done have has had having can could will would shall should may might must not no yes just really very even ever never all any some something anything everything nothing someone anyone everyone only still then than when where what who why how there here now again too more most much such each every both same other another own don't doesn't didn't can't won't wouldn't isn't aren't wasn't weren't i'm i've i'll i'd you're you've you'll you'd he's she's we're we've they're they've it's that's there's oh ooh ah yeah hey la na de la el los las un una y en que por para con es mi tu se le les des une et je te il elle nous vous ne pas au aux du ce ça c'est der die das ein eine und ich du er sie wir ihr im zu mit von ist nicht mein dein").split(/\s+/));
  const lyricStrongWords=new Set('love heart hearts heartbreak broken lonely alone dream dreams night nights forever lost pain fire burn burning falling rain tears crying dance dancing kiss kisses home hope heaven hell soul souls freedom free wild beautiful darkness light silence remember forget goodbye stay alive dead die fear afraid'.split(' '));
  function lyricKeywords(line){
    const words=[...String(line).matchAll(/[\p{L}\p{N}]+(?:['’][\p{L}]+)*/gu)];
    const candidates=words.map((match,index)=>{const key=match[0].toLowerCase().replace(/’/g,"'");return {start:match.index,end:match.index+match[0].length,key,index,score:(lyricStrongWords.has(key)?8:0)+Math.min(key.length,10)*.35};}).filter(w=>w.key.length>=3&&!lyricStopWords.has(w.key)&&!/^[0-9]+$/.test(w.key));
    const limit=words.length>=10?3:words.length>=6?2:1,seen=new Set();
    return candidates.sort((a,b)=>b.score-a.score||a.index-b.index).filter(w=>{if(seen.has(w.key))return false;seen.add(w.key);return true;}).slice(0,limit).sort((a,b)=>a.start-b.start);
  }
  function lyricOriginalContent(button,row,fallback){
    button.replaceChildren();button._lyricRow=row;
    const instrumental=/^(?:\s|[♪♫♬🎵🎶])+$/u.test(fallback);
    button.setAttribute('aria-label',instrumental?'Instrumental interlude':fallback);
    if(instrumental){for(const symbol of ['♪','♪','♪']){const note=document.createElement('span');note.className='resonance-interlude-note';note.textContent=symbol;note.setAttribute('aria-hidden','true');note.style.margin='0 4px';button.append(note);}return;}
    if(row?.words?.length&&root.dataset.wordSync==='on'){
      button._timedSpans=row.words.map(word=>{const span=document.createElement('span');span.className='resonance-timed-word';span.textContent=word.text;span.style.setProperty('--word-progress','0%');button.append(span);return span;});return;
    }
    button._timedSpans=null;
    const keywords=row&&button.id==='resonance-lyric-line'?lyricKeywords(fallback):[];
    if(!keywords.length){button.textContent=fallback;return;}
    let cursor=0;
    for(const keyword of keywords){
      if(keyword.start>cursor){const plain=document.createElement('span');plain.textContent=fallback.slice(cursor,keyword.start);button.append(plain);}
      const emphasis=document.createElement('span');emphasis.className='resonance-keyword';emphasis.textContent=fallback.slice(keyword.start,keyword.end);button.append(emphasis);cursor=keyword.end;
    }
    if(cursor<fallback.length){const plain=document.createElement('span');plain.textContent=fallback.slice(cursor);button.append(plain);}
  }
  function lyricContent(button,row,fallback){
    lyricOriginalContent(button,row,fallback);
    if(!row?.translation)return;
    const subtitle=document.createElement('small');subtitle.className='resonance-translation';subtitle.lang='en';subtitle.dir='auto';subtitle.textContent=row.translation;button.append(subtitle);
    button.setAttribute('aria-label',fallback+'. English translation: '+row.translation);
  }
  let desiredLyric='',desiredLyricURI='',desiredLyricStart,desiredLyricRow, lineAnimation, transitionGeneration=0;
  function setLyricLine(value, smooth=true, row=null) {
    if(value===desiredLyric&&desiredLyricURI===currentURI()&&desiredLyricStart===row?.start&&desiredLyricRow===row)return;
    desiredLyric=value;desiredLyricURI=currentURI();desiredLyricStart=row?.start;desiredLyricRow=row;const token=++transitionGeneration;
    const line=get('lyric-line');lineAnimation?.cancel();
    const uri=currentURI();
    const replace=()=>{lyricContent(line,row,value);line.disabled=!row;line.onclick=row?()=>seekLyric(uri,row.start):null;fitLyric();};
    if(!smooth||reduced.matches||root.dataset.power==='low'||!line.textContent||typeof line.animate!=='function'){replace();return;}
    lineAnimation=line.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-4px)'}],{duration:130,easing:'ease-in',fill:'forwards'});
    lineAnimation.onfinish=()=>{
      if(token!==transitionGeneration)return;
      lineAnimation.cancel();replace();
      lineAnimation=line.animate([{opacity:0,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,easing:'cubic-bezier(.22,1,.36,1)'});
    };
  }
  function paintTimedLine(button,position){
    const row=button?._lyricRow;if(!button?._timedSpans||!row?.words)return;
    button._timedSpans.forEach((span,index)=>{const value=(reduced.matches?(position>=row.words[index].start?100:0):Math.round(ResonanceLyrics.wordProgress(row.words[index],position)*100))+'%';if(span._progress!==value){span.style.setProperty('--word-progress',value);span._progress=value;}});
  }
  function drawLyrics() {
    if(!showLyrics)return;
    syncLyricFallback();
    let position=0;try{position=playbackProgress();}catch{}
    position-=lyricOffset;
    const selected=ResonanceLyrics.active(lyricRows,position),timedRow=lyricRows[selected.line],row=timedRow&&/[\p{L}\p{N}]/u.test(timedRow.text)?timedRow:null;
    setLyricLine(row?.text || (lyricRows.length?'♪':lyricState),!!row,row);
    renderExpanded(position,selected.line);
    if(root.dataset.wordSync==='on'&&root.dataset.power!=='low')paintTimedLine(expandedLyrics?expandedButtons[selected.line]:get('lyric-line'),position);
    text('lyric-note',lyricSettled&&!lyricRows.length?lyricState:row ? lyricSource+(row.words?.length&&root.dataset.wordSync==='on'?' · Word sync':' · Line sync') : (lyricRows.length?lyricSource+' · Instrumental break':''));
  }
  async function seekLyric(uri,start) {
    if(uri!==currentURI()||!Number.isFinite(start))return;
    try{await Spicetify.Player.seek(Math.round(Math.max(0,Math.min(start+lyricOffset,playbackDuration()))));drawLyrics();update();}
    catch{flashStatus('Couldn’t seek to this lyric.');}
  }
  let expandedRowsKey='',expandedButtons=[];
  function renderExpanded(position,active) {
    if(!expandedLyrics)return;
    let anchor=active;
    if(anchor<0){anchor=lyricRows.findIndex(row=>row.start>position);if(anchor<0)anchor=lyricRows.length-1;}
    const rowsKey=lyricKey+'|'+lyricRevision+'|'+lyricRows.length,rebuilt=rowsKey!==expandedRowsKey;
    const list=get('expanded-lines'),pane=get('expanded-lyrics');
    text('expanded-note',lyricRows.length?'':lyricState);
    if(rebuilt){
      expandedRowsKey=rowsKey;list.replaceChildren();expandedButtons=[];
      const uri=currentURI();
      for(const row of lyricRows){const button=document.createElement('button');lyricContent(button,row,row.text||'♪');button.title='Seek to '+fmt(row.start);button.onclick=()=>seekLyric(uri,row.start);list.append(button);expandedButtons.push(button);}
    }
    const key=rowsKey+'|'+anchor+'|'+active;
    if(key===expandedKey&&!rebuilt)return;expandedKey=key;
    expandedButtons.forEach((button,index)=>button.setAttribute('aria-current',String(index===active)));
    const target=expandedButtons[anchor];
    if(target&&typeof pane.scrollTo==='function'){const top=target.offsetTop-pane.offsetTop-pane.clientHeight/2+target.offsetHeight/2;scrollLyrics(pane,top,reduced.matches||rebuilt||root.dataset.power==='low');}
  }
  let lyricScroll=0;
  let scrollbarIdle=0,scrollbarDragging=false;
  function hideLyricScrollbar(){scrollbarDragging=false;clearTimeout(scrollbarIdle);get('expanded-lyrics').dataset.scrolling='false';}
  function revealLyricScrollbar(){
    const pane=get('expanded-lyrics');pane.dataset.scrolling='true';clearTimeout(scrollbarIdle);
    scrollbarIdle=setTimeout(()=>{if(!scrollbarDragging)pane.dataset.scrolling='false';},900);
  }
  const lyricsPane=get('expanded-lyrics');
  lyricsPane.onwheel=lyricsPane.ontouchmove=revealLyricScrollbar;
  lyricsPane.onkeydown=event=>{if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key))revealLyricScrollbar();};
  lyricsPane.onpointerdown=event=>{if(event.clientX>=lyricsPane.getBoundingClientRect().right-12){scrollbarDragging=true;revealLyricScrollbar();}};
  lyricsPane.onpointermove=()=>{if(scrollbarDragging)revealLyricScrollbar();};
  const endScrollbarDrag=()=>{if(scrollbarDragging){scrollbarDragging=false;revealLyricScrollbar();}};
  lyricsPane.onpointerup=lyricsPane.onpointercancel=endScrollbarDrag;
  document.addEventListener('pointerup',endScrollbarDrag);
  function scrollLyrics(pane,top,immediate=false){
    cancelAnimationFrame(lyricScroll);
    if(immediate||root.dataset.lyricStyle!=='animated'){pane.scrollTo({top,behavior:immediate?'instant':'smooth'});return;}
    const start=Number(pane.scrollTop)||0,from=performance.now(),distance=top-start;
    function step(now){if(root.hidden||document.hidden||!expandedLyrics)return;const t=Math.min(1,(now-from)/850),spring=1-Math.exp(-7*t)*Math.cos(4*t);pane.scrollTo({top:t===1?top:start+distance*spring,behavior:'instant'});if(t<1)lyricScroll=requestAnimationFrame(step);}
    lyricScroll=requestAnimationFrame(step);
  }
  let returnLayout='left';
  function syncLyricFallback(){
    const unavailable=lyricSettled&&!lyricRows.length;
    if(unavailable&&expandedLyrics){lyricFallbackLayout=root.dataset.layout;root.dataset.layout=returnLayout;syncLayout();}
    else if(!unavailable&&lyricFallbackLayout&&lyricRows.length){root.dataset.layout=lyricFallbackLayout;lyricFallbackLayout='';syncLayout();}
  }
  function syncLayout(){
    const layout=root.dataset.layout||'left';
    if(layout==='left'||layout==='center')returnLayout=layout;
    expandedLyrics=layout==='lyrics'||layout==='karaoke';expandedKey='';
    get('expanded-lyrics').hidden=!expandedLyrics;
    get('info').style.visibility=expandedLyrics?'hidden':'visible';get('lyric-line').style.visibility=expandedLyrics?'hidden':'';
    get('song-summary').hidden=!expandedLyrics;
    get('expand-lyrics').textContent=expandedLyrics?'Exit lyrics view':'Lyrics + artwork';get('expand-lyrics').setAttribute('aria-expanded',String(expandedLyrics));
    if(expandedLyrics&&root.dataset.lyricStyle==='off')setLyricStyle('animated');
    syncLyricsVisibility();
    drawLyrics();fitArtwork();
  }
  function toggleExpanded(){
    if(expandedLyrics)setLayout(returnLayout);else {returnLayout=root.dataset.layout==='center'?'center':'left';setLayout('karaoke');}
    wakeControls();
  }
  get('expand-lyrics').onclick=toggleExpanded;
  function syncLyricsVisibility(){
    const enabled=root.dataset.lyricStyle!=='off';
    if(!enabled&&expandedLyrics)toggleExpanded();
    showLyrics=enabled;get('lyrics').style.visibility=enabled?'visible':'hidden';
    const artLayout=!expandedLyrics,hideSingle=artLayout&&(!enabled||root.dataset.singleLine==='off'||(lyricSettled&&!lyricRows.length));
    root.dataset.artNoLyrics=String(hideSingle);root.dataset.lyricsEnabled=String(enabled);
    get('lyric-line').setAttribute('aria-hidden',String(hideSingle||expandedLyrics));get('lyric-line').inert=hideSingle||expandedLyrics;
    get('single-line-setting').hidden=!artLayout;

  }

  const setLayout=appearanceOption('layout',{left:'Art left',center:'Art centered',lyrics:'Lyrics only',karaoke:'Lyrics + artwork'},'left');
  const setSingleLine=appearanceOption('single-line',{on:'On',off:'Off'},'on');
  function fitArtwork(){
    const content=get('content'),height=content.clientHeight;
    if(!height)return;
    const metadata=root.dataset.layout==='center'?get('info').offsetHeight+16:0;
    const size=Math.max(0,height-metadata-(root.dataset.layout==='center'?16:28));
    root.style.setProperty('--art-max-size',size+'px');
  }
  if(typeof ResizeObserver==='function'){
    const artworkSizer=new ResizeObserver(fitArtwork);
    artworkSizer.observe(get('content'));artworkSizer.observe(get('info'));
    new ResizeObserver(()=>{visualDirty=true;canvasSize=null;}).observe(get('waves'));
  }
  window.addEventListener('resize',()=>{visualDirty=true;canvasSize=null;fitLyric();fitArtwork();expandedKey='';});
  let shuffleBusy=false;
  function shuffleState() {
    try { const state=Spicetify.Player.getShuffle(); if(typeof state==='boolean')return state; }catch{}
    const button=native('[data-testid="control-button-shuffle"]');
    return button?.getAttribute('aria-checked')==='true'||button?.getAttribute('aria-pressed')==='true'||(/disable.*shuffle/i.test(button?.getAttribute('aria-label')||''));
  }
  function renderShuffle() {
    const enabled=shuffleState(),button=get('shuffle');
    button.setAttribute('aria-pressed',String(enabled));button.setAttribute('aria-label',enabled?'Disable shuffle':'Enable shuffle');button.title=enabled?'Disable shuffle':'Enable shuffle';
    const nativeButton=native('[data-testid="control-button-shuffle"]');
    button.disabled=shuffleBusy||!currentURI()||(nativeButton?.disabled===true||nativeButton?.getAttribute('aria-disabled')==='true');
  }
  get('shuffle').onclick=async()=>{
    if(shuffleBusy)return;shuffleBusy=true;renderShuffle();text('status','');
    try {
      if(!Spicetify.Player?.setShuffle)throw Error('Unavailable');
      await withTimeout(Spicetify.Player.setShuffle(!shuffleState()),7000);
      setTimeout(renderShuffle,350);
    }catch(error){text('status',operationError(error,'Shuffle is unavailable for this playback.'));}
    finally{shuffleBusy=false;renderShuffle();}
  };
  function playerAPI(){return Spicetify.Platform?.PlayerAPI||Spicetify.Player.origin;}
  function queuedTracks() {
    try {
      const state=playerState();
      const items=state?.nextItems?.length?state.nextItems:Spicetify.Queue?.nextTracks||[];
      return items.map(item=>item.contextTrack||item.track||item).filter(track=>track?.metadata?.title).slice(0,100);
    }catch{return [];}
  }
  function queueIdentity(track){return {uri:track.uri,uid:track.uid||null};}
  function sameQueueTrack(a,b){return a?.uid&&b?.uid?a.uid===b.uid:a?.uri===b?.uri;}
  function trackDuration(track){const meta=track?.metadata||{};const value=Number(track?.duration?.milliseconds??meta.duration_ms??meta.duration??0);return Number.isFinite(value)&&value>0?value:0;}
  function trackImage(track){const meta=track?.metadata||{};let image=meta.image_small_url||meta.image_url||meta.image_large_url||track?.images?.[0]?.url||track?.album?.images?.[0]?.url||'';if(image.startsWith('spotify:image:'))image='https://i.scdn.co/image/'+image.split(':').pop();return /^https:/.test(image)?image:'';}
  let queueKey='',repeatBusy=false,queueBusy=false,queueExpanded=false;
  async function queueAction(track,action,direction=0){
    if(queueBusy)return;
    const tracks=queuedTracks(),matches=tracks.filter(t=>sameQueueTrack(t,track)),index=tracks.findIndex(t=>sameQueueTrack(t,track));
    if(index<0||matches.length!==1){text('queue-status','The queue changed. Try again.');queueKey='';renderQueue();return;}
    const api=playerAPI();queueBusy=true;queueKey='';renderQueue();text('queue-status','');
    try{
      if(action==='jump'){
        if(typeof api?.skipToNext!=='function'||Spicetify.Player.data?.restrictions?.canSkipNext===false)throw Error('Jump is unavailable');
        await withTimeout(api.skipToNext(queueIdentity(tracks[index])),7000);
      }else if(action==='remove'){
        if(typeof api?.removeFromQueue==='function')await withTimeout(api.removeFromQueue([queueIdentity(tracks[index])]),7000);
        else if(typeof Spicetify.removeFromQueue==='function')await withTimeout(Spicetify.removeFromQueue([queueIdentity(tracks[index])]),7000);
        else throw Error('Remove is unavailable');
      }else{
        const target=tracks[index+direction];if(!target||typeof api?.reorderQueue!=='function')throw Error('Reorder is unavailable');
        await withTimeout(api.reorderQueue([queueIdentity(tracks[index])],direction<0?{before:queueIdentity(target)}:{after:queueIdentity(target)}),7000);
      }
    }catch(error){text('queue-status',operationError(error,'Spotify couldn’t update this queue. Use its queue view for this action.'));}
    finally{queueBusy=false;queueKey='';renderQueue();setTimeout(()=>{queueKey='';renderQueue();},350);}
  }
  function queueTrackButton(track,current=false){
    const button=document.createElement('button');button.className='resonance-queue-track';
    button.disabled=current||queueBusy||Spicetify.Player.data?.restrictions?.canSkipNext===false||typeof playerAPI()?.skipToNext!=='function';button.title=current?'Currently playing':'Play '+track.metadata.title;
    const image=document.createElement('img');image.className='resonance-queue-thumb';image.alt='';const src=trackImage(track);if(src)image.src=src;image.onerror=()=>{image.style.visibility='hidden';};
    const info=document.createElement('div');info.className='resonance-queue-info';const title=document.createElement('strong'),artist=document.createElement('small');title.textContent=track.metadata.title;artist.textContent=artistCredits(track);info.append(title,artist);
    const duration=document.createElement('span');duration.className='resonance-queue-duration';duration.textContent=trackDuration(track)?fmt(trackDuration(track)):'—';
    button.append(image,info,duration);if(!current)button.onclick=()=>queueAction(track,'jump');return button;
  }
  function renderQueue() {
    if(get('queue').hidden)return;
    const tracks=queuedTracks(),current=currentTrack();
    get('queue-clear').disabled=queueBusy||!tracks.length||typeof playerAPI()?.clearQueue!=='function';get('queue-refresh').disabled=queueBusy;
    const key=JSON.stringify([current?.uri,playing(),queueBusy,queueExpanded,tracks.map(t=>[t.uri,t.uid,t.metadata.title,artistCredits(t),trackDuration(t),trackImage(t)])]);
    if(key===queueKey)return;queueKey=key;get('queue-list').replaceChildren();get('queue-current').replaceChildren();
    if(current?.metadata?.title){const label=document.createElement('div');label.id='resonance-queue-current-label';label.textContent=playing()?'NOW PLAYING':'PAUSED';get('queue-current').append(label,queueTrackButton(current,true));}
    const visible=tracks.slice(0,queueExpanded?100:5),canReorder=typeof playerAPI()?.reorderQueue==='function';
    visible.forEach((track,index)=>{
      const row=document.createElement('li');row.append(queueTrackButton(track));
      if(canReorder){const actions=document.createElement('div');actions.className='resonance-queue-move';for(const direction of [-1,1]){const button=document.createElement('button');button.textContent=direction<0?'↑':'↓';button.setAttribute('aria-label','Move '+track.metadata.title+(direction<0?' up':' down'));button.disabled=queueBusy||index+direction<0||index+direction>=tracks.length;button.onclick=()=>queueAction(track,'move',direction);actions.append(button);}row.append(actions);}
      const remove=document.createElement('button');remove.className='resonance-queue-remove';remove.textContent='×';remove.title='Remove from queue';remove.setAttribute('aria-label','Remove '+track.metadata.title+' from queue');
      remove.disabled=queueBusy||tracks.filter(item=>sameQueueTrack(item,track)).length!==1||(typeof playerAPI()?.removeFromQueue!=='function'&&typeof Spicetify.removeFromQueue!=='function');
      remove.onclick=()=>queueAction(track,'remove');row.append(remove);
      get('queue-list').append(row);
    });
    get('queue-empty').hidden=tracks.length>0;get('queue-more').hidden=tracks.length<=5;get('queue-more').textContent=queueExpanded?'Show fewer':'Show all '+tracks.length+' songs';
  }
  function refreshQueue(){if(queueBusy)return;queueKey='';renderQueue();text('queue-status','');wakeControls();}
  async function clearQueue(){
    const api=playerAPI();if(queueBusy||!queuedTracks().length||typeof api?.clearQueue!=='function')return;
    queueBusy=true;queueKey='';renderQueue();text('queue-status','');
    try{await withTimeout(api.clearQueue(),7000);flashStatus('Cleared queued songs');}
    catch(error){text('queue-status',operationError(error,'Spotify couldn’t clear the queue. Try again.'));}
    finally{queueBusy=false;queueKey='';renderQueue();setTimeout(()=>{queueKey='';renderQueue();},350);}
  }
  get('queue-refresh').onclick=refreshQueue;get('queue-clear').onclick=clearQueue;
  function toggleQueue(){if(!get('search-panel').hidden)toggleSearch(false);get('queue').hidden=!get('queue').hidden;if(!get('queue').hidden){get('album-panel').hidden=true;get('album-panel-toggle').setAttribute('aria-expanded','false');}get('queue-toggle').setAttribute('aria-expanded',String(!get('queue').hidden));queueKey='';renderQueue();wakeControls();}
  get('queue-toggle').onclick=toggleQueue;get('queue-close').onclick=toggleQueue;
  get('queue-more').onclick=()=>{queueExpanded=!queueExpanded;queueKey='';renderQueue();};
  function entityURI(value,type){return new RegExp('^spotify:'+type+':[A-Za-z0-9]+$').test(value||'')?value:'';}
  function openEntity(uri){
    const match=/^spotify:(artist|album|track):([A-Za-z0-9]+)$/.exec(uri||'');
    if(!match||typeof Spicetify.Platform?.History?.push!=='function'){flashStatus('Open this item from Spotify’s search.');return;}
    Spicetify.Platform.History.push('/'+match[1]+'/'+match[2]);close();
  }
  function openSpotifySearch(query){
    if(!query||typeof Spicetify.Platform?.History?.push!=='function')return;
    Spicetify.Platform.History.push('/search/'+encodeURIComponent(query));close();
  }
  async function playContext(uri,options={}){
    if(!/^spotify:(track|album|playlist):[A-Za-z0-9]+$/.test(uri||''))return;
    try{
      if(typeof Spicetify.Player.playUri!=='function')throw Error('Playback unavailable');
      await withTimeout(Spicetify.Player.playUri(uri,{},options),7000);
    }catch(error){flashStatus(operationError(error,'Couldn’t play this '+uri.split(':')[1]+'. Try again in Spotify.'));}
  }
  const playTrack=uri=>entityURI(uri,'track')?playContext(uri):undefined;
  async function playAlbum(uri){if(!entityURI(uri,'album'))return;openAlbum(uri);return playContext(uri);}
  async function playPlaylist(uri){if(!entityURI(uri,'playlist'))return;toggleSearch(false,false);get('album-panel').hidden=true;get('album-panel-toggle').setAttribute('aria-expanded','false');get('queue').hidden=false;get('queue-toggle').setAttribute('aria-expanded','true');queueKey='';renderQueue();return playContext(uri);}
  function playAlbumTrack(album,track){return entityURI(album,'album')&&entityURI(track,'track')?playContext(album,{skipTo:{uri:track}}):undefined;}
  function addQueueButton(track){
    const button=document.createElement('button');button.className='resonance-add-queue';button.textContent='+';button.title='Add to queue';button.setAttribute('aria-label','Add '+track.name+' to queue');
    const available=()=>typeof Spicetify.addToQueue==='function'||typeof playerAPI()?.addToQueue==='function';
    button.disabled=!entityURI(track.uri,'track')||!available();
    button.onclick=async()=>{
      if(button.disabled)return;button.disabled=true;button.textContent='…';
      try{
        if(typeof Spicetify.addToQueue==='function')await withTimeout(Spicetify.addToQueue([{uri:track.uri}]),7000);
        else if(typeof playerAPI()?.addToQueue==='function')await withTimeout(playerAPI().addToQueue([{uri:track.uri}]),7000);
        else throw Error('Queue unavailable');
        flashStatus('Added to queue');queueKey='';renderQueue();
      }catch(error){flashStatus(operationError(error,'Couldn’t add to queue. Try again.'));}
      finally{button.textContent='+';button.disabled=!available();}
    };
    return button;
  }
  function artistEntities(track){
    const entries=[],seen=new Set(),meta=track?.metadata||{};
    const add=(name,uri)=>{if(name&&!seen.has(name)){seen.add(name);entries.push({name,uri:entityURI(uri,'artist')});}};
    for(const artist of track?.artists||[])add(artist.name||artist.profile?.name,artist.uri);
    add(meta.artist_name,meta.artist_uri);
    for(const key of Object.keys(meta).filter(key=>/^artist_name:\d+$/.test(key)).sort((a,b)=>Number(a.split(':')[1])-Number(b.split(':')[1])))add(meta[key],meta[key.replace('artist_name','artist_uri')]);
    return entries;
  }
  let artistLinksKey='';
  function renderArtistLinks(fallback){
    const artists=artistEntities(currentTrack()),key=JSON.stringify([artists,fallback]);if(key===artistLinksKey)return;artistLinksKey=key;
    const parent=get('artist');parent.replaceChildren();
    if(!artists.length){parent.textContent=fallback||'Play a song in Spotify';return;}
    artists.forEach((artist,index)=>{
      if(index){const separator=document.createElement('span');separator.textContent=', ';parent.append(separator);}
      const button=document.createElement('button');button.className='resonance-artist-link';button.textContent=artist.name;button.title='Search '+artist.name;button.onclick=()=>searchArtist(artist.name);parent.append(button);
    });
  }
  get('search-panel').hidden=true;
  let searchGeneration=0,searchTimer,searchPage=null,searchCategory='track';
  async function searchArtist(name){toggleSearch(true);get('search-input').value=name;return setSearchCategory('track');}
  function setSearchCategory(type){
    if(!['track','album','playlist'].includes(type))return;
    searchCategory=type;clearTimeout(searchTimer);
    for(const button of get('search-tabs').children)button.setAttribute('aria-pressed',String(button.dataset.type===type));
    get('search-input').placeholder='Search '+({track:'songs',album:'albums',playlist:'playlists'}[type]);
    return runSearch(get('search-input').value);
  }
  for(const [type,label] of [['track','Songs'],['album','Albums'],['playlist','Playlists']]){const button=document.createElement('button');button.textContent=label;button.dataset.type=type;button.setAttribute('aria-pressed',String(type==='track'));button.onclick=()=>setSearchCategory(type);get('search-tabs').append(button);}
  function toggleSearch(open=get('search-panel').hidden,restoreFocus=true){
    clearTimeout(searchTimer);searchGeneration++;searchPage=null;get('search-more').hidden=true;
    get('search-panel').hidden=!open;get('search-toggle').setAttribute('aria-expanded',String(open));
    if(open){get('album-panel').hidden=true;get('album-panel-toggle').setAttribute('aria-expanded','false');get('queue').hidden=true;get('queue-toggle').setAttribute('aria-expanded','false');get('themes').hidden=true;get('brand').setAttribute('aria-expanded','false');get('search-input').focus();}
    else{get('search-results').replaceChildren();get('search-input').value='';text('search-status','');if(restoreFocus)get('search-toggle').focus();}
    wakeControls();
  }
  function normalizeSearch(raw,limit=6,type='all'){
    const search=raw?.data?.searchV2;
    let items=search?.topResultsV2?.itemsV2;
    if(!Array.isArray(items)){
      const keys=type==='all'?['tracksV2','albumsV2','playlists']:type==='track'?['tracksV2']:type==='album'?['albumsV2']:['playlists'];
      items=keys.flatMap(key=>search?.[key]?.items||[]);
      if(!items.length)items=(type==='all'?['track','artist','album','playlist']:[type]).flatMap(kind=>(raw?.[kind+'s']?.items||[]));
    }
    return items.map(row=>row?.item?.data||row?.data||row).map(item=>{
      const kind=/^spotify:(track|artist|album|playlist):[A-Za-z0-9]+$/.exec(item?.uri||'')?.[1];
      const name=item?.name||item?.profile?.name;if(!kind||!name||(type!=='all'&&type!==kind))return null;
      const artists=item.artists?.items||item.artists||[],owner=item.ownerV2?.data||item.owner||{};
      const ownerId=owner.username||owner.id||owner.uri?.split(':').pop()||'';
      const image=item.albumOfTrack?.coverArt?.sources?.[0]?.url||item.visuals?.avatarImage?.sources?.[0]?.url||item.coverArt?.sources?.[0]?.url||item.images?.items?.[0]?.sources?.[0]?.url||item.images?.[0]?.url||'';
      return {uri:item.uri,type:kind,name,ownerId,subtitle:kind==='playlist'?'Playlist · '+(owner.name||owner.display_name||ownerId||'Spotify'):kind==='artist'?'Artist':artists.map(a=>a.name||a.profile?.name).filter(Boolean).join(', ')||'Album',image:/^https:/.test(image)?image:''};
    }).filter(Boolean).slice(0,limit);
  }
  function searchIsCurrent(page){return searchPage===page&&page.generation===searchGeneration&&page.type===searchCategory&&!get('search-panel').hidden&&String(get('search-input').value||'').trim().slice(0,160)===page.query;}
  // Search route definitions are lazy-loaded by Spotify. Read only the three
  // persisted-query descriptors from the installed local route; never execute it.
  let searchDefinitionsPromise;
  async function searchDefinition(type){
    const name={track:'searchTracks',album:'searchAlbums',playlist:'searchPlaylists'}[type];
    const definitions=Spicetify.GraphQL?.Definitions;
    if(definitions?.[name])return definitions[name];
    if(!definitions)return null;
    if(!searchDefinitionsPromise)searchDefinitionsPromise=(async()=>{
      const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),2500),found={};
      try{
        const response=await fetch('/xpui-routes-search.js',{signal:abort.signal});
        if(!response.ok)return found;
        const source=await response.text();
        for(const match of source.matchAll(/new [\w.$]+\("(searchTracks|searchAlbums|searchPlaylists)","query","([a-f0-9]{64})",null\)/g))found[match[1]]={name:match[1],operation:'query',sha256Hash:match[2],value:null};
      }catch{}finally{clearTimeout(timer);}
      return found;
    })();
    return (await searchDefinitionsPromise)[name]||null;
  }
  async function requestSearch(query,limit,type){
    const definitions=Spicetify.GraphQL?.Definitions;
    const category=await searchDefinition(type);
    const definition=category||definitions?.searchModalResults;
    if(definition&&Spicetify.GraphQL?.Request)try{
      const raw=await withTimeout(Spicetify.GraphQL.Request(definition,{limit,numberOfTopResults:limit,offset:0,searchTerm:query,includeAuthors:false,includePreReleases:false,includeAlbumPreReleases:false}),7000);
      const block=raw?.data?.searchV2?.[{track:'tracksV2',album:'albumsV2',playlist:'playlists'}[type]];
      const rows=block?.items||raw?.data?.searchV2?.topResultsV2?.itemsV2;
      if(Array.isArray(rows))return {raw,more:block?.pagingInfo?.nextOffset!=null||rows.length>=limit};
    }catch{}
    const params=new URLSearchParams({q:query,type,limit:String(Math.min(50,limit))});
    const raw=await withTimeout(Spicetify.CosmosAsync.get('https://api.spotify.com/v1/search?'+params),7000);
    if(!raw?.[type+'s'])throw Error('Search unavailable');
    return {raw,more:(raw[type+'s']?.items?.length||0)>=Math.min(50,limit)};
  }
  function appendSearchResults(page,results){
    for(const result of results){
      if(page.seen.has(result.uri))continue;page.seen.add(result.uri);
      const row=document.createElement('div');row.className='resonance-search-row';
      const info=document.createElement('div');info.className='resonance-search-info';
      const name=document.createElement('button');name.className='resonance-result-name';name.textContent=result.name;name.title=result.type==='artist'?'Open '+result.name:'Play '+result.name;const activate=()=>result.type==='track'?playTrack(result.uri):result.type==='album'?playAlbum(result.uri):result.type==='playlist'?playPlaylist(result.uri):searchArtist(result.name);name.onclick=activate;
      const subtitle=document.createElement('small');subtitle.textContent=result.subtitle+(result.type==='album'?' · Album':'');info.append(name,subtitle);
      if(result.image){const image=document.createElement('img');image.src=result.image;image.alt='';image.className='resonance-search-thumb';image.onerror=()=>{image.hidden=true;};row.append(image);}
      row.append(info);if(result.type==='track')row.append(addQueueButton(result));
      else row.onclick=event=>{if(event.target!==name)return activate();};
      get('search-results').append(row);
    }
  }
  async function runSearch(query,generation=++searchGeneration){
    query=String(query||'').trim().slice(0,160);
    const page=searchPage={query,generation,type:searchCategory,limit:8,seen:new Set(),busy:true,more:false};
    get('search-results').replaceChildren();get('search-results').scrollTop=0;get('search-more').hidden=true;
    if(query.length<2){page.busy=false;text('search-status','Type at least 2 characters');return;}
    text('search-status','Searching…');
    try{
      const response=await requestSearch(query,page.limit,page.type);if(!searchIsCurrent(page))return;
      // Keep the first view compact; remaining items appear only on demand.
      const results=normalizeSearch(response.raw,8,page.type);
      appendSearchResults(page,results.slice(0,6));page.more=response.more||results.length>page.seen.size;
      text('search-status',page.seen.size?'':'No results. Try another name.');
    }catch{if(searchIsCurrent(page))text('search-status','Spotify search is unavailable. Open full search below.');}
    finally{if(searchIsCurrent(page)){page.busy=false;get('search-more').hidden=!page.more;get('search-more').disabled=false;}}
  }
  async function loadMoreSearch(){
    const page=searchPage;if(!page||page.busy||!page.more||!searchIsCurrent(page))return;
    page.busy=true;get('search-more').disabled=true;text('search-status','Loading more…');
    const limit=Math.min(60,page.limit+12);
    try{
      // Top-result queries expose a result count rather than a cursor. Fetch a
      // larger ranked window, deduplicate, and bound it to avoid endless work.
      const response=await requestSearch(page.query,limit,page.type);if(!searchIsCurrent(page))return;
      const before=page.seen.size,results=normalizeSearch(response.raw,limit,page.type);
      appendSearchResults(page,results);page.limit=limit;
      page.more=limit<60&&response.more&&(page.type==='playlist'||page.seen.size>before);
      text('search-status',page.more?'':'End of preview · open full search for more');
    }catch{if(searchIsCurrent(page))text('search-status','Couldn’t load more. Try More results again.');}
    finally{if(searchIsCurrent(page)){page.busy=false;get('search-more').disabled=false;get('search-more').hidden=!page.more;}}
  }
  get('search-more').onclick=loadMoreSearch;
  get('search-results').onscroll=()=>{
    const list=get('search-results');
    if(list.scrollHeight>list.clientHeight&&list.scrollTop+list.clientHeight>=list.scrollHeight-64)return loadMoreSearch();
  };
  get('summary-artist').onclick=()=>searchArtist(artistCredits(currentTrack()));
  get('album').onclick=get('summary-album').onclick=()=>playAlbum(albumURI());
  get('search-toggle').onclick=()=>toggleSearch();get('search-close').onclick=()=>toggleSearch(false);
  get('search-input').oninput=()=>{
    clearTimeout(searchTimer);searchPage=null;get('search-more').hidden=true;const generation=++searchGeneration,query=get('search-input').value;
    get('search-results').replaceChildren();text('search-status','');
    searchTimer=setTimeout(()=>runSearch(query,generation),300);
  };
  get('search-input').onkeydown=event=>{if(event.key==='Enter'){event.preventDefault();clearTimeout(searchTimer);runSearch(get('search-input').value);}};
  get('search-all').onclick=()=>openSpotifySearch(String(get('search-input').value||'').trim());
  function albumURI(){const track=currentTrack();return track?.album?.uri||track?.metadata?.album_uri||'';}
  function normalizeAlbum(raw){
    const artistItems=raw?.artists?.items||raw?.artists||[],trackBlock=raw?.tracksV2||raw?.tracks||{};
    const tracks=(trackBlock.items||[]).map((item,index)=>{const t=item.track||item;return {uri:t.uri||'',name:t.name||t.metadata?.title||'',number:t.trackNumber||t.track_number||index+1,disc:t.discNumber||t.disc_number||1,duration:Number(t.duration?.totalMilliseconds??t.duration_ms??t.duration?.milliseconds??0)||0};}).filter(t=>t.name);
    const copyrights=raw?.copyright?.items||raw?.copyrights?.items||raw?.copyrights||[];
    return {name:raw?.name||'',uri:raw?.uri||'',artistRefs:Array.isArray(artistItems)?artistItems.map(a=>({name:a.profile?.name||a.name||'',uri:entityURI(a.uri,'artist')})).filter(a=>a.name):[],artists:Array.isArray(artistItems)?artistItems.map(a=>a.profile?.name||a.name||'').filter(Boolean):[],date:raw?.date?.isoString||raw?.release_date||String(raw?.date?.year||''),label:typeof raw?.label==='string'?raw.label:raw?.label?.name||'',copyrights:Array.isArray(copyrights)?copyrights.map(c=>c.text||'').filter(Boolean):[],description:typeof raw?.description==='string'?raw.description.replace(/<[^>]*>/g,''):raw?.description?.text||'',tracks,total:Number(trackBlock.totalCount??trackBlock.total??tracks.length)||tracks.length};
  }
  function normalizeCredits(raw){
    raw=raw?.data||raw;
    const items=[...(raw?.trackUnion?.creditsTrait?.contributors?.items||[])],people=new Map();
    for(const role of raw?.roleCredits||[])for(const person of role.artists||[])items.push({name:person.name,role:role.roleTitle||role.role||''});
    for(const person of items){if(!person.name)continue;const roles=people.get(person.name)||new Set();if(person.role)roles.add(person.role);people.set(person.name,roles);}
    return [...people].map(([name,roles])=>({name,roles:[...roles]}));
  }
  async function fetchAlbum(uri){
    const fallback={name:'getAlbum',operation:'query',sha256Hash:'11c9cad9cb24c4f9e25ef9456f68621cfd6006a90f679e729c1d2f2fd70dfe16',value:null};
    const definition=Spicetify.GraphQL?.Definitions?.getAlbum||Spicetify.GraphQL?.Definitions?.queryAlbumTracks||fallback;
    let album;
    try{if(Spicetify.GraphQL?.Request){
      const response=await withTimeout(Spicetify.GraphQL.Request(definition,{uri,locale:'',offset:0,limit:50}),10000);
      if(response?.data?.albumUnion?.name)album=normalizeAlbum(response.data.albumUnion);
      for(let offset=50;album&&offset<Math.min(album.total,500);offset+=50){
        const page=await withTimeout(Spicetify.GraphQL.Request(definition,{uri,locale:'',offset,limit:50}),10000);
        const more=normalizeAlbum(page?.data?.albumUnion);if(!more.tracks.length)break;album.tracks.push(...more.tracks);
      }
    }
    }catch{}
    if(!album){const raw=await withTimeout(Spicetify.CosmosAsync.get('https://api.spotify.com/v1/albums/'+encodeURIComponent(uri.split(':')[2])),10000);if(!raw?.name)throw Error('Album unavailable');album=normalizeAlbum(raw);}
    return album;
  }
  async function fetchCredits(uri){
    const fallback={name:'queryTrackCreditsGroupedModal',operation:'query',sha256Hash:'f135fb9be58a72d041ab5d214d817021a272405d883860468e2627afb01a3ca9',value:null};
    const definition=Spicetify.GraphQL?.Definitions?.queryTrackCreditsGroupedModal||fallback;
    if(Spicetify.GraphQL?.Request)try{const credits=normalizeCredits(await withTimeout(Spicetify.GraphQL.Request(definition,{trackUri:uri,contributorsLimit:100,contributorsOffset:0}),10000));if(credits.length)return credits;}catch{}
    try{return normalizeCredits(await withTimeout(Spicetify.CosmosAsync.get('https://spclient.wg.spotify.com/track-credits-view/v0/experimental/'+encodeURIComponent(uri.split(':')[2])+'/credits'),7000));}catch{return [];}
  }

  function matchAlbumBackground(page,title,artist){
    const base=normalize(title.replace(/\s*\((?:deluxe|expanded|remaster|anniversary)[^)]*\)/ig,''));
    const pageTitle=normalize((page.title||'').replace(/\s*\([^)]*\)\s*$/,''));
    const extract=page.extract||'';
    return !!artist&&base.length>0&&pageTitle===base&&normalize(extract).includes(normalize(artist))&&/\b(album|EP|compilation|record)\b/i.test(extract);
  }
  // Resolves to a background, null when Wikipedia has no verified match, or undefined when the lookup was skipped or failed.
  async function fetchAlbumBackground(title,artist){
    if(!title||!artist)return undefined;
    const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),7000);
    try{
      const query=new URLSearchParams({action:'query',generator:'search',gsrsearch:'"'+title+'" "'+artist+'" album',gsrlimit:'3',gsrnamespace:'0',prop:'extracts|info',exintro:'1',explaintext:'1',exsentences:'3',inprop:'url',format:'json',origin:'*'});
      const response=await fetch('https://en.wikipedia.org/w/api.php?'+query,{signal:abort.signal});if(!response.ok)return undefined;
      const data=await response.json();
      if(data?.error||!data?.query?.pages||typeof data.query.pages!=='object')return undefined;
      const pages=Object.values(data.query.pages),page=pages.find(p=>matchAlbumBackground(p,title,artist));
      if(!page||!/^https:\/\/en\.wikipedia\.org\//.test(page.fullurl||''))return null;
      const words=page.extract.trim().split(/\s+/);return {text:words.slice(0,100).join(' ')+(words.length>100?'…':''),url:page.fullurl};
    }catch{return undefined;}finally{clearTimeout(timer);}
  }
  let albumDetailsKey='',albumDetailsGeneration=0,albumDetails=null,selectedAlbum='';
  function openAlbum(uri){
    selectedAlbum=uri;toggleSearch(false,false);get('queue').hidden=true;get('queue-toggle').setAttribute('aria-expanded','false');get('album-panel').hidden=false;get('album-panel-toggle').setAttribute('aria-expanded','true');albumDetailsKey='';loadAlbumDetails();wakeControls();
  }
  const albumCache=new Map(),creditsCache=new Map(),backgroundCache=new Map();
  function remember(cache,key,value){if(cache.size>=30)cache.delete(cache.keys().next().value);cache.set(key,value);return value;}
  function renderAlbumDetails(){
    if(!albumDetails||get('album-panel').hidden)return;
    const box=get('album-panel-content');box.replaceChildren();const model=albumDetails,album=model.album;
    const add=(tag,value,parent=box)=>{const node=document.createElement(tag);node.textContent=value;parent.append(node);return node;};
    const heading=add('h3',''),albumTitle=add('button',album?.name||model.title||'Album',heading);albumTitle.className='resonance-album-title-play';albumTitle.title='Play album';albumTitle.disabled=!entityURI(model.uri,'album');albumTitle.onclick=()=>playAlbum(model.uri);
    const credits=add('p',''),artists=album?.artistRefs?.length?album.artistRefs:[{name:album?.artists.join(', ')||model.artist,uri:''}];
    artists.forEach((artist,index)=>{if(index)add('span',', ',credits);const link=add('button',artist.name,credits);link.className='resonance-artist-link';link.onclick=()=>searchArtist(artist.name);});
    if(album){
      const facts=[album.date?.slice(0,4),album.total+' tracks',album.label].filter(Boolean);add('p',facts.join(' · '));
      if(album.description){add('h4','About this album');add('p',album.description);}
      if(album.tracks.length){add('h4','Tracklist');const list=add('ol','');list.id='resonance-album-tracklist';for(const track of album.tracks){const row=add('li','',list);row.setAttribute('aria-current',String(track.uri===model.trackURI));const number=add('span',String(track.number).padStart(2,'0'),row);number.className='resonance-album-track-number';const name=add('button',track.name,row);name.className='resonance-album-track-name';name.disabled=!entityURI(track.uri,'track');name.title='Play '+track.name;name.onclick=()=>playAlbumTrack(model.uri,track.uri);const time=add('span',track.duration?fmt(track.duration):'—',row);time.className='resonance-album-track-time';row.append(addQueueButton(track));}
        const duration=album.tracks.reduce((sum,t)=>sum+t.duration,0);if(duration)add('p',(album.tracks.length===album.total?'Runtime: ':'Loaded tracks: ')+Math.floor(duration/60000)+' minutes');
        if(album.tracks.length<album.total)add('p',album.tracks.length+' of '+album.total+' tracks available here.');
      }
      for(const copyright of album.copyrights)add('p',copyright);
    }else add('p',model.albumDone?'Album metadata unavailable for this release.':'Loading album details…');
    add('h4','Credits · '+model.trackTitle);
    if(model.credits?.length){const list=add('ul','');for(const person of model.credits)add('li',person.name+(person.roles.length?' — '+person.roles.join(', '):''),list);}
    else add('p',model.creditsDone?'Detailed song credits are unavailable.':'Loading song credits…');
    if(!album?.description){add('h4','Album background');if(model.background){add('p',model.background.text);const link=add('a','Wikipedia · read more');link.href=model.background.url;link.target='_blank';link.rel='noopener noreferrer';}else add('p',model.backgroundDone?'No verified album background found.':'Looking for sourced album background…');}
    if(/^spotify:album:[A-Za-z0-9]+$/.test(model.uri)){const button=add('button','Play album');button.id='resonance-album-open';button.onclick=()=>playAlbum(model.uri);}
  }
  function loadAlbumDetails(){
    if(get('album-panel').hidden)return;
    const uri=selectedAlbum||albumURI(),trackURI=uri===albumURI()?currentURI():'',key=uri+'|'+trackURI;
    if(key===albumDetailsKey)return;albumDetailsKey=key;const generation=++albumDetailsGeneration,meta=currentTrack()?.metadata||{};
    albumDetails={uri,trackURI,title:uri===albumURI()?meta.album_title||'':'',artist:(currentTrack()?.artists?.[0]?.name||meta.artist_name||''),trackTitle:trackURI?meta.title||'Current song':'Select a song',album:null,credits:[],creditsDone:!trackURI,background:null};renderAlbumDetails();
    const current=()=>generation===albumDetailsGeneration;
    if(!/^spotify:album:[A-Za-z0-9]+$/.test(uri)){albumDetails.albumDone=albumDetails.creditsDone=albumDetails.backgroundDone=true;renderAlbumDetails();return;}
    (albumCache.has(uri)?Promise.resolve(albumCache.get(uri)):fetchAlbum(uri).then(value=>remember(albumCache,uri,value))).then(value=>{if(current())albumDetails.album=value;}).catch(()=>{}).finally(()=>{if(current()){albumDetails.albumDone=true;renderAlbumDetails();}});
    if(trackURI)(creditsCache.has(trackURI)?Promise.resolve(creditsCache.get(trackURI)):fetchCredits(trackURI).then(value=>remember(creditsCache,trackURI,value))).then(value=>{if(current())albumDetails.credits=value;}).catch(()=>{}).finally(()=>{if(current()){albumDetails.creditsDone=true;renderAlbumDetails();}});
    const title=albumDetails.title,artist=albumDetails.artist;
    (backgroundCache.has(uri)?Promise.resolve(backgroundCache.get(uri)):fetchAlbumBackground(title,artist).then(value=>value===undefined?null:remember(backgroundCache,uri,value))).then(value=>{if(current())albumDetails.background=value;}).finally(()=>{if(current()){albumDetails.backgroundDone=true;renderAlbumDetails();}});
  }
  function toggleAlbumDetails(){
    if(!get('search-panel').hidden)toggleSearch(false);
    const panel=get('album-panel');panel.hidden=!panel.hidden;get('album-panel-toggle').setAttribute('aria-expanded',String(!panel.hidden));
    if(!panel.hidden){selectedAlbum='';get('queue').hidden=true;get('queue-toggle').setAttribute('aria-expanded','false');albumDetailsKey='';loadAlbumDetails();}wakeControls();
  }
  get('album-panel-toggle').onclick=toggleAlbumDetails;get('album-panel-close').onclick=toggleAlbumDetails;
  function repeatMode(){try{return Spicetify.Player.getRepeat();}catch{return Spicetify.Player.data?.repeat||0;}}
  function renderRepeat(){const mode=repeatMode(),button=get('repeat'),label=['Repeat off','Repeat all','Repeat one'][mode]||'Repeat off';button.dataset.mode=String(mode);button.setAttribute('aria-pressed',String(mode>0));button.setAttribute('aria-label',label);button.title=label;button.disabled=repeatBusy||!currentURI();}
  get('repeat').onclick=async()=>{if(repeatBusy)return;repeatBusy=true;renderRepeat();try{await withTimeout(Spicetify.Player.setRepeat((repeatMode()+1)%3),7000);}catch(error){flashStatus(operationError(error,'Repeat is unavailable for this playback.'));}finally{repeatBusy=false;renderRepeat();setTimeout(renderRepeat,350);}};
  let idleTimer;
  function canHideControls(){return !root.hidden&&document.fullscreenElement===root&&playing()&&get('themes').hidden&&get('queue').hidden&&get('album-panel').hidden&&get('search-panel').hidden&&!seekingURI&&!(document.activeElement?.matches(':focus-visible')&&(get('header').contains(document.activeElement)||get('player').contains(document.activeElement)))&&!(document.activeElement?.matches(':focus-visible')&&get('lyrics').contains(document.activeElement));}
  function wakeControls(){root.dataset.idle='false';clearTimeout(idleTimer);if(!root.hidden)idleTimer=setTimeout(()=>{idleTimer=null;if(canHideControls())root.dataset.idle='true';},3000);}
  root.onpointermove=root.onpointerdown=root.onkeydown=root.onfocusin=wakeControls;
  document.addEventListener('fullscreenchange',wakeControls);
  const fmt = ms => `${Math.floor(Math.max(0,ms)/60000)}:${String(Math.floor(Math.max(0,ms)/1000)%60).padStart(2,'0')}`;
  let seekingURI='',seekCanceled=false;
  function paintPosition(position,duration) {
    const bar=get('track');bar.value=String(position);bar.style.setProperty('--progress',(duration>0?Math.min(100,Math.max(0,position/duration*100)):0)+'%');
    bar.setAttribute('aria-valuetext',fmt(position)+' of '+fmt(duration));text('elapsed',fmt(position));
  }
  get('track').onpointerdown=()=>{seekingURI=currentURI();seekCanceled=false;};
  get('track').onkeydown=event=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','PageUp','PageDown'].includes(event.key)){seekingURI=currentURI();seekCanceled=false;}};
  get('track').oninput=()=>{if(seekCanceled)return;if(!seekingURI)seekingURI=currentURI();paintPosition(Number(get('track').value),Number(get('track').max));};
  get('track').onchange=async()=>{
    const uri=seekingURI||currentURI(),position=Math.round(Number(get('track').value)),canceled=seekCanceled;seekingURI='';seekCanceled=false;
    if(canceled||!uri||uri!==currentURI()){update();return;}
    try {await Spicetify.Player.seek(Math.max(0,Math.min(position,playbackDuration())));}
    catch {flashStatus('Couldn’t seek in this song.');}
    setTimeout(update,250);
  };
  get('track').onpointercancel=()=>{seekCanceled=true;seekingURI='';update();};
  get('track').onblur=()=>{seekCanceled=true;seekingURI='';update();};
  function renderUpNext(progress,duration) {
    const preview=get('up-next');preview.hidden=true;
    if(!(duration>0&&duration-progress<=20000&&duration-progress>0))return;
    try {
      const state=playerState();
      const repeat=repeatMode()===2;
      const queued=repeat?currentTrack():(state?.nextItems?.[0]||Spicetify.Queue?.nextTracks?.[0]);
      const track=queued?.contextTrack||queued?.track||queued;
      const meta=track?.metadata||{};
      if(!meta.title)return;
      text('up-next-label',repeat?'ON REPEAT':'UP NEXT');text('up-next-title',meta.title);text('up-next-artist',artistCredits(track));preview.hidden=false;
    }catch{}
  }
  function playbackSource() {
    try {
      const state=playerState(),context=state?.context||{},meta=context.metadata||{};
      const uri=context.uri||'',type=uri.split(':')[1]||'';
      const labels={playlist:'Playlist',album:'Album',artist:'Artist',station:'Radio',radio:'Radio',collection:'Liked Songs',search:'Search'};
      let name=meta.context_description||meta.context_name||meta.title||meta.name||'';
      // Match the current context, rather than the page the user happens to browse.
      if(!name&&uri&&document.querySelectorAll){
        const path='/'+uri.replace(/^spotify:/,'').replaceAll(':','/');
        for(const link of document.querySelectorAll('a[href]')) {
          const href=link.getAttribute('href')||'';
          if((href===uri||href.split('?')[0].endsWith(path))&&link.textContent?.trim()){name=link.textContent.trim();break;}
        }
      }
      const label=labels[type]||(uri.includes('radio')?'Radio':'');
      if(name)return 'PLAYING FROM '+(label?label+' · ':'')+name;
      if(label)return 'PLAYING FROM '+label;
      return currentURI()?'PLAYING FROM Spotify':'Choose a song in Spotify';
    }catch{return 'PLAYING FROM Spotify';}
  }
  let analysisURI='',analysis=null,analysisGeneration=0,waveResponse=.65;
  let visualChannels=[.65,.65,.65],visualPitches=Array(12).fill(.5),visualBrightness=.5,visualHue=0,visualSectionEnergy=1,visualBeat=0;
  const analysisCache=new Map();
  function cacheAnalysis(uri,data){if(analysisCache.size>=20&&!analysisCache.has(uri))analysisCache.delete(analysisCache.keys().next().value);analysisCache.set(uri,data);}
  async function loadAnalysis() {
    const uri=currentURI();if(uri===analysisURI)return;analysisURI=uri;analysis=null;
    const generation=++analysisGeneration;
    if(!/^spotify:track:[A-Za-z0-9]+$/.test(uri)){text('caption','AMBIENT WAVES · ESC TO RETURN');text('analysis-info','Track analysis is unavailable for this item.');return;}
    text('caption','CHECKING TRACK ANALYSIS · ESC TO RETURN');text('analysis-info','Checking Spotify track analysis…');
    const accept=data=>{
      if(generation!==analysisGeneration)return;
      analysis=data?prepareAnalysis(data):null;visualDirty=true;
      const info=analysisCapabilities(analysis);
      text('caption',analysis?'TRACK-SYNCED WAVES'+(info.pitches&&info.timbre?' · TIMBRE + PITCH':'')+(info.sections?' · '+info.sections+' SECTIONS':'')+' · ESC TO RETURN':'ANALYSIS UNAVAILABLE · AMBIENT WAVES · ESC TO RETURN');
      text('analysis-info',analysis?info.segments+' segments · '+info.sections+' sections · '+(info.timbre?'12 timbre features':'No timbre data')+' · '+(info.pitches?'12 pitch classes':'No pitch data'):'Spotify did not return usable analysis. Ambient motion is active.');
      get('waves').title='Rhythm / attack · Harmony / pitch · Texture / brightness. Analysis-derived, not measured frequency bands.';

    };
    if(analysisCache.has(uri)){accept(analysisCache.get(uri));return;}
    try {
      if(typeof Spicetify.getAudioData!=='function')throw Error('API unavailable');
      const data=await withTimeout(Spicetify.getAudioData(uri),8000,'Analysis timeout');
      const valid=data&&Array.isArray(data.segments)&&data.segments.some(s=>Number.isFinite(s.start)&&Number.isFinite(s.loudness_max));
      cacheAnalysis(uri,valid?data:null);accept(valid?data:null);
      console.info('[Resonance] Track analysis',valid?'available':'unavailable');
    }catch(error){recordDiagnostic('analysis','request-error',error);accept(null);console.info('[Resonance] Track analysis unavailable',error?.message||'Request failed');}
  }
  const clamp01=value=>Number.isFinite(value)?Math.max(0,Math.min(1,value)):0;
  function analysisCapabilities(data){return {segments:data?.segments?.length||0,sections:data?.sections?.length||0,timbre:!!data?.segments?.some(s=>Array.isArray(s.timbre)&&s.timbre.length>=12&&s.timbre.every(Number.isFinite)),pitches:!!data?.segments?.some(s=>Array.isArray(s.pitches)&&s.pitches.length>=12&&s.pitches.every(Number.isFinite))};}
  function prepareAnalysis(data){
    const clean=rows=>(Array.isArray(rows)?rows:[]).filter(row=>Number.isFinite(row?.start)&&row.start>=0).slice().sort((a,b)=>a.start-b.start);
    const segments=clean(data.segments),stats=Array.from({length:12},(_,index)=>{
      const values=segments.map(s=>s.timbre?.[index]).filter(Number.isFinite).sort((a,b)=>a-b);
      const at=fraction=>values[Math.floor((values.length-1)*fraction)]||0;
      return {center:at(.5),scale:Math.max(1,(at(.9)-at(.1))/2)};
    });
    const levels=segments.map(s=>s.loudness_max).filter(Number.isFinite).sort((a,b)=>a-b);
    const floor=levels[Math.floor((levels.length-1)*.1)]??-45,ceiling=levels[Math.floor((levels.length-1)*.9)]??0;
    return {...data,segments,beats:clean(data.beats),sections:clean(data.sections),timbreStats:stats,loudnessRange:{floor,span:Math.max(12,ceiling-floor)}};
  }
  function markerAt(rows,time){let low=0,high=rows.length;while(low<high){const mid=(low+high)>>1;if(rows[mid].start<=time)low=mid+1;else high=mid;}const index=low-1;return {index,row:rows[index]};}
  const ambientFeatures={energy:.65,channels:[.65,.65,.65],pitches:Array(12).fill(.5),brightness:.5,hue:0,sectionEnergy:1,pulse:0,confidence:0,beatPos:null,tempo:110,timbre:Array(12).fill(.5)};
  function needsAnalysis(){return root.dataset.power!=='low'&&(visualStyle!=='off'||root.dataset.beatUi!=='off'||root.dataset.artwork==='vinyl'||(root.dataset.background==='ambient'&&root.dataset.meshRotation==='beats')||root.dataset.debug==='on');}
  function analysisFeatures(data,position,mode=motionMode()){
    if(!data)return ambientFeatures;
    const time=Math.max(0,Number.isFinite(position)?position/1000:0),segments=data.segments||[];
    const selected=markerAt(segments,time),segment=selected.row,bm=markerAt(data.beats||[],time),beat=bm.row,sectionMarker=markerAt(data.sections||[],time),section=sectionMarker.row;
    const peak=Number.isFinite(segment?.loudness_max)?segment.loudness_max:-45;
    let db=peak;
    if(segment&&Number.isFinite(segment.duration)&&segment.duration>0){
      const elapsed=Math.max(0,time-segment.start),peakTime=Math.max(.01,Math.min(segment.duration,segment.loudness_max_time||.06));
      const start=Number.isFinite(segment.loudness_start)?segment.loudness_start:peak;
      const nextStart=segments[selected.index+1]?.loudness_start;
      const end=Number.isFinite(nextStart)?nextStart:Number.isFinite(segment.loudness_end)&&segment.loudness_end<=peak?segment.loudness_end:peak;
      db=elapsed<peakTime?start+(peak-start)*clamp01(elapsed/peakTime):peak+(end-peak)*clamp01((elapsed-peakTime)/Math.max(.01,segment.duration-peakTime));
    }
    const range=mode.normalize&&data.loudnessRange?data.loudnessRange:{floor:-45,span:45};
    const loudness=clamp01((db-range.floor)/range.span),age=beat?time-beat.start:Infinity;
    const beatPos=beat&&Number.isFinite(beat.duration)&&beat.duration>0?bm.index+clamp01(age/Math.max(.05,beat.duration)):null;
    const tempo=Number.isFinite(data.track?.tempo)&&data.track.tempo>0?data.track.tempo:110;
    const pulse=age>=0&&age<Math.min(beat?.duration||0,.65)?Math.sin(Math.PI*clamp01(age/(mode.pulseRise||.12))/2)*Math.exp(-Math.max(0,age-(mode.pulseRise||.12))/(mode.pulseFall||.32))*(.35+.65*clamp01(beat.confidence??.5)):0;
    const timbre=(index)=>{const value=segment?.timbre?.[index];if(!Number.isFinite(value))return .5;const stats=data.timbreStats?.[index]||{center:0,scale:60};return .5+.5*Math.tanh((value-stats.center)/stats.scale);};
    const brightness=timbre(1),flatness=timbre(2),attack=timbre(3);
    const pitches=Array.from({length:12},(_,index)=>Number.isFinite(segment?.pitches?.[index])?clamp01(segment.pitches[index]):.5);
    const total=pitches.reduce((sum,value)=>sum+value,0),concentration=total>0?Math.max(...pitches)/total:0;
    const harmonic=clamp01((concentration-1/12)/(1-1/12));
    const sectionEnergy=section&&Number.isFinite(section.loudness)?.88+.24*clamp01((section.loudness+35)/35):1;
    const energy=.35+loudness*.40+pulse*mode.beat;
    return {energy,pulse,confidence:clamp01(beat?.confidence??0),channels:[(.32+loudness*.35+pulse*mode.beat+attack*.12)*sectionEnergy,(.38+loudness*.35+harmonic*.25+flatness*.08+(mode.flash?pulse*.65:0))*sectionEnergy,(.28+loudness*.30+brightness*.4+(1-harmonic)*.08+(mode.flash?pulse*.85:0))*sectionEnergy],pitches,brightness,beatPos,tempo,timbre:Array.from({length:12},(_,i)=>timbre(i)),hue:section?[-9,-4,3,8,0][sectionMarker.index%5]:0,sectionEnergy};
  }
  function analysisResponse(data,position){return analysisFeatures(data,position).energy;}
  let artworkGeneration=0,readyArtwork='';
  function transitionArtwork(image){
    const generation=++artworkGeneration,cover=get('cover'),previous=get('cover-prev');
    previous.hidden=!readyArtwork;if(readyArtwork)previous.src=readyArtwork;cover.style.opacity='0';
    if(!image){readyArtwork='';cover.removeAttribute('src');previous.hidden=true;return;}
    cover.onload=()=>{if(generation!==artworkGeneration)return;readyArtwork=image;cover.style.opacity='1';setTimeout(()=>{if(generation===artworkGeneration)previous.hidden=true;},900);};
    cover.onerror=()=>{if(generation!==artworkGeneration)return;cover.style.opacity='0';};cover.src=image;
    if(cover.complete&&cover.naturalWidth>0)cover.onload();
  }
  let tonearmTransform='';
  function renderTonearm(position,duration){
    const transform=root.dataset.artwork==='vinyl'?'rotate('+Number((8+20*clamp01(duration>0?position/duration:0)).toFixed(3))+'deg)':'';
    if(transform!==tonearmTransform){get('tonearm').style.transform=transform;tonearmTransform=transform;}
  }
  function update() {
    if(root.hidden||document.hidden) return;
    lastMetadataUpdate=Date.now();refreshPlayerState();syncLyricsVisibility();if(needsAnalysis())loadAnalysis();
    else if(root.dataset.power==='low')text('caption','LOW POWER · VISUAL EFFECTS PAUSED · ESC TO RETURN');
    text('source',playbackSource());get('source').title=get('source').textContent;
    let meta = {};
    try { meta = currentTrack()?.metadata || {}; } catch {}
    const title = meta.title || native('[data-testid="context-item-link"]')?.textContent || '';
    const artist = artistCredits(currentTrack()) || native('[data-testid="context-item-info-subtitles"]')?.textContent || '';
    text('title',title || 'Ready for music'); renderArtistLinks(artist); text('album',meta.album_title || '');get('album').disabled=!entityURI(albumURI(),'album');
    text('summary-title',title||'Ready for music');text('summary-artist',artist);text('summary-album',meta.album_title||'');get('summary-album').disabled=!entityURI(albumURI(),'album');
    root.dataset.playing=String(playing());
    text('kicker',playing() ? 'NOW PLAYING' : 'READY WHEN YOU ARE');
    icon('toggle',playing() ? 'pause' : 'play');
    checkHeart(); renderShuffle(); renderRepeat(); renderQueue();loadAlbumDetails();
    if(!canHideControls())root.dataset.idle='false';else if(!idleTimer&&root.dataset.idle!=='true')wakeControls();
    get('toggle').setAttribute('aria-label',playing() ? 'Pause' : 'Play');
    let image = meta.image_xlarge_url || meta.image_large_url || native('[data-testid="now-playing-widget"] img')?.src || native('.main-nowPlayingWidget-coverArt img')?.src || native('img[data-testid="cover-art-image"]')?.src || '';
    if(image.startsWith('spotify:image:')) image = 'https://i.scdn.co/image/'+image.split(':').pop();
    if(image !== artwork) {
      artwork = image;loadPalette(image,currentURI());
      if(image && /^(https:|spotify:)/.test(image)) { transitionArtwork(image); get('bg').style.backgroundImage = `url(${JSON.stringify(image)})`; }
      else { transitionArtwork(''); get('bg').style.backgroundImage = ''; }
    }
    let progress = 0, duration = 0;
    try { progress = playbackProgress(); duration = playbackDuration(); } catch {}
    if(seekingURI&&seekingURI!==currentURI()){seekCanceled=true;seekingURI='';}
    get('track').max=String(Math.max(1,duration));get('track').disabled=!(duration>0)||!currentURI();
    if(!seekingURI)paintPosition(progress,duration);
    renderUpNext(progress,duration);renderTonearm(progress,duration);
    text('duration',native('[data-testid="playback-duration"]')?.textContent || fmt(duration));
    if(root.dataset.lyricStyle!=='off')loadLyrics(meta,duration);

  }
  function captureDiagnostics(){
    const settings={};for(const key of ['layout','background','artwork','motion','power','lyricStyle','wordSync','singleLine','meshRotation','beatUi','debug'])settings[key]=root.dataset[key]||null;
    let wrapperHasItem=false,originHasItem=false;try{wrapperHasItem=!!Spicetify.Player.data?.item?.uri;originHasItem=!!Spicetify.Player.origin?._state?.item?.uri;}catch{}
    const agent=typeof navigator==='object'?navigator:null;
    return {
      format:'resonance-diagnostics-v1',version:'4.17.0-experimental.1',capturedAt:new Date().toISOString(),
      environment:{platform:agent?.platform||'unknown',userAgent:agent?.userAgent||'unknown',spotifyVersion:String(Spicetify.Platform?.version||'unknown')},settings,
      playback:{wrapperHasItem,originHasItem,directFallbackActive:!!fallbackPlayerState,itemType:currentURI().split(':')[1]||null,playing:playing(),positionMs:playbackProgress(),durationMs:playbackDuration()},
      lyrics:{source:lyricSource||null,lineCount:lyricRows.length,wordLineCount:lyricRows.filter(row=>row.words?.length).length,wordCount:lyricRows.reduce((sum,row)=>sum+(row.words?.length||0),0),offsetMs:lyricOffset,settled:lyricSettled,cacheEntries:lyricCache.size},
      analysis:analysisCapabilities(analysis),
      rendering:{viewHidden:root.hidden,pageHidden:!!document.hidden,reducedMotion:reduced.matches,metadataAgeMs:lastMetadataUpdate?Date.now()-lastMetadataUpdate:null,idleTimerPending:!!frameTimer,canvasPixels:[get('waves').width,get('waves').height]},
      recentEvents:diagnosticEvents.slice()
    };
  }
  function diagnosticsText(){return JSON.stringify(captureDiagnostics(),null,2);}
  get('diagnostics-save').onclick=()=>{
    try{
      const url=URL.createObjectURL(new Blob([diagnosticsText()],{type:'application/json'})),link=document.createElement('a');
      link.href=url;link.download='resonance-diagnostics-'+new Date().toISOString().replace(/[:.]/g,'-')+'.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
      text('diagnostics-status','Report prepared locally. If Spotify blocks the download, use Copy diagnostics.');
    }catch{text('diagnostics-status','Download unavailable in this client. Use Copy diagnostics.');}
  };
  get('diagnostics-copy').onclick=async()=>{
    try{const content=diagnosticsText();if(Spicetify.Platform?.ClipboardAPI?.copy)await Spicetify.Platform.ClipboardAPI.copy(content);else await navigator.clipboard.writeText(content);text('diagnostics-status','Diagnostics copied. Paste into a text file or your bug report.');}
    catch{text('diagnostics-status','Clipboard unavailable. Try Capture diagnostics.');}
  };
  function control(selector,action) {
    text('status','');
    const button = native(selector);
    if(button && !button.disabled && button.getAttribute('aria-disabled') !== 'true') { button.click(); setTimeout(update,350); return; }
    try {
      const result = Spicetify.Player[action]();
      Promise.resolve(result).catch(() => text('status','Spotify could not complete that command.'));
      setTimeout(update,350);
    } catch { text('status','This control is unavailable for the current Spotify playback.'); }
  }
  get('previous').onclick = () => control('[data-testid="control-button-skip-back"]','back');
  get('toggle').onclick = () => control('[data-testid="control-button-playpause"]','togglePlay');
  get('up-next').onclick=()=>{if(!get('up-next').hidden)control('[data-testid="control-button-skip-forward"]','next');};
  get('next').onclick = () => control('[data-testid="control-button-skip-forward"]','next');
  function smoothResponse(value,target,delta,mode={rise:.18,fall:.45}){return value+(target-value)*(1-Math.exp(-Math.max(0,delta)/(target>value?mode.rise:mode.fall)));}
  let visualTimbre=Array(12).fill(.5),phaseState={uri:'',mode:'',position:null,offset:0};
  function nextPhase(current,features,position,delta,uri,modeName,state){
    const mode=MODES[modeName]||MODES.calm;
    if(!mode.grid){state.position=null;state.mode=modeName;return current+delta*mode.drift;}
    // One 2π cycle per four detected beats; no assumption about time signature.
    const target=features.beatPos!==null?features.beatPos*Math.PI/2:null;
    if(target===null){state.position=null;return current+delta*Math.max(.6,Math.min(1.8,features.tempo/110));}
    const seek=state.position===null||state.uri!==uri||state.mode!==modeName||Math.abs(position-state.position-delta*1000)>350;
    if(seek)state.offset=Math.atan2(Math.sin(current-target),Math.cos(current-target));
    state.offset*=Math.exp(-delta/.18);
    state.position=position;state.uri=uri;state.mode=modeName;
    return target+state.offset;
  }
  const visualCanvas=get('waves'),visualDisc=get('disc');
  let vinylState={angle:0,speed:0},uiPulse=0;
  function vinylStep(state,tempo,isPlaying,delta,reduce=false){
    if(reduce){state.speed=0;return state;}
    const target=isPlaying?Math.max(8,Math.min(32,(Number.isFinite(tempo)&&tempo>0?tempo:110)*.16)):0;
    const tau=target>state.speed?.65:.75,blend=1-Math.exp(-delta/tau),before=state.speed;
    state.speed+=(target-state.speed)*blend;if(state.speed<.01)state.speed=0;
    state.angle=(state.angle+(before+state.speed)/2*delta)%360;
    return state;
  }
  let debugFps=0,debugStamp=0,lastCanvasURI='',lastCanvasPosition=-1,lastHue='',lastPulse='',lastGlow='',lastDisc='',lastKick='',lastTilt='';
  function paintDebug(now,delta,position,f,mode){
    if(delta>0)debugFps+=(1/delta-debugFps)*.1;
    if(now-debugStamp<120)return;debugStamp=now;
    const t=Math.max(0,position/1000),a=analysis,n=v=>Number.isFinite(v)?v.toFixed(2):'–';
    const seg=a?markerAt(a.segments||[],t):{index:-1},bt=a?markerAt(a.beats||[],t):{index:-1},sec=a?markerAt(a.sections||[],t):{index:-1};
    get('debug').textContent=[
      'FPS '+debugFps.toFixed(0)+'  motion '+(root.dataset.motion||'calm')+'  style '+visualStyle,
      'time '+t.toFixed(2)+'s  tempo '+(a?Math.round(f.tempo)+' BPM':'–'),
      a?'seg '+(seg.index+1)+'/'+(a.segments||[]).length+'  beat '+(bt.index+1)+'/'+(a.beats||[]).length+'  sec '+(sec.index+1)+'/'+(a.sections||[]).length:'analysis: none (ambient)',
      'energy '+n(f.energy)+'  pulse '+n(f.pulse)+'  conf '+n(f.confidence),
      'rhythm '+n(f.channels[0])+'  harmony '+n(f.channels[1])+'  texture '+n(f.channels[2]),
      'bright '+n(f.brightness)+'  sectionE '+n(f.sectionEnergy)+'  hue '+visualHue.toFixed(1),
      'lyrics '+(lyricSource||'–')+'  rows '+lyricRows.length+'  offset '+lyricOffset+'ms',
      'accent '+accentName+'  rgb('+accentRGB.join(',')+')'
    ].join('\n');
  }
  let frameTimer=0;
  function stopDrawing(){cancelAnimationFrame(frame);clearTimeout(frameTimer);frameTimer=0;}
  function startDrawing(){stopDrawing();frame=requestAnimationFrame(draw);}
  function draw(now) {
    if(root.hidden||document.hidden)return;
    const lowPower=root.dataset.power==='low',isPlaying=playing();
    const idle=lowPower||reduced.matches||(!isPlaying&&vinylState.speed===0),interval=idle?100:1000/30;
    // Idle states redraw at ~10 fps, so wait on a timer instead of waking for every display frame.
    if(idle)frameTimer=setTimeout(()=>{frameTimer=0;frame=requestAnimationFrame(draw);},interval-8);
    else frame=requestAnimationFrame(draw);
    if(!idle&&now-previous<interval-.5)return;
    const delta = previous ? Math.min((now-previous)/1000,.1) : 0;

    previous=now;
    drawLyrics();
    let position=0;try{position=playbackProgress();}catch{}
    const mode=motionMode(),features=needsAnalysis()&&(isPlaying||root.dataset.debug==='on')?analysisFeatures(analysis,position,mode):ambientFeatures;
    if(root.dataset.debug==='on')paintDebug(now,delta,position,features,mode);
    const pulseTarget=!lowPower&&!reduced.matches&&isPlaying&&root.dataset.beatUi!=='off'&&features.confidence>.55?features.pulse*(.25+.75*clamp01((features.channels[0]-.4)/1.2)):0;
    uiPulse=reduced.matches?0:smoothResponse(uiPulse,pulseTarget,delta,{rise:.018,fall:.16});
    const pulse=String(1+uiPulse*.045),glow=String(uiPulse*.55);
    if(pulse!==lastPulse){get('artwork').style.setProperty('--art-pulse',pulse);lastPulse=pulse;}
    const kick=(uiPulse*1.8*Math.sin((features.beatPos||0)*Math.PI)).toFixed(2)+'px',tilt=(uiPulse*.4*Math.sin((features.beatPos||0)*Math.PI)).toFixed(3)+'deg';
    if(kick!==lastKick){get('artwork').style.setProperty('--art-kick',kick);lastKick=kick;}
    if(tilt!==lastTilt){get('artwork').style.setProperty('--art-tilt',tilt);lastTilt=tilt;}
    if(!lowPower&&!reduced.matches&&isPlaying&&root.dataset.background==='ambient'&&meshStep(meshState,delta,features.beatPos,root.dataset.meshRotation)&&meshColors.length){meshOffset=(meshOffset+1)%meshColors.length;renderMesh([...meshColors.slice(meshOffset),...meshColors.slice(0,meshOffset)],true);}
    if(glow!==lastGlow){get('beat-glow').style.opacity=glow;lastGlow=glow;}
    vinylStep(vinylState,features.tempo,isPlaying,delta,reduced.matches||lowPower||root.dataset.artwork!=='vinyl');
    const disc=root.dataset.artwork==='vinyl'?'rotate('+vinylState.angle+'deg)':'';
    if(disc!==lastDisc){visualDisc.style.transform=disc;lastDisc=disc;}
    const uri=currentURI();
    if(uri!==lastCanvasURI||(!isPlaying&&position!==lastCanvasPosition))visualDirty=true;
    lastCanvasURI=uri;lastCanvasPosition=position;
    if(!visualDirty&&(!isPlaying||lowPower||reduced.matches||visualStyle==='off'))return;
    visualDirty=false;
    if(!lowPower&&!reduced.matches&&isPlaying){
      phase=nextPhase(phase,features,position,delta,analysisURI,root.dataset.motion,phaseState);
      waveResponse=smoothResponse(waveResponse,features.energy,delta,mode);
      visualChannels=visualChannels.map((value,index)=>smoothResponse(value,features.channels[index],delta,mode));
      const blend=1-Math.exp(-delta/.32),sectionBlend=1-Math.exp(-delta/1.8);
      visualPitches=visualPitches.map((value,index)=>value+(features.pitches[index]-value)*blend);
      visualTimbre=visualTimbre.map((value,index)=>value+(features.timbre[index]-value)*blend);
      visualBeat=smoothResponse(visualBeat,mode.flash&&features.confidence>.7?features.pulse:0,delta,{rise:.015,fall:.12});
      visualBrightness+=(features.brightness-visualBrightness)*blend;
      visualHue+=(features.hue-visualHue)*sectionBlend;visualSectionEnergy+=(features.sectionEnergy-visualSectionEnergy)*sectionBlend;
    }

    const canvas=visualCanvas,rect=canvasSize||(canvasSize=canvas.getBoundingClientRect()),scale=Math.min(devicePixelRatio||1,1.25);
    const w=rect.width,h=rect.height;
    if(canvas.width!==Math.round(w*scale)||canvas.height!==Math.round(h*scale)) {canvas.width=Math.round(w*scale);canvas.height=Math.round(h*scale);}
    const ctx=canvas.getContext('2d'); ctx.setTransform(scale,0,0,scale,0,0);ctx.clearRect(0,0,w,h);
    if(visualStyle==='off'||lowPower)return;
    const hue='hue-rotate('+Math.round(visualHue)+'deg)';if(hue!==lastHue){canvas.style.filter=hue;lastHue=hue;}
    const flash=mode.flash?visualBeat:0;
    const ink=accentRGB.map(v=>Math.round(v+(255-v)*Math.min(.65,flash*.65)));
    const color=alpha=>`rgba(${ink.join(',')},${Math.min(.95,alpha*visualSectionEnergy*(mode.flash?1.65+flash*.6:1))})`;
    ctx.shadowBlur=mode.flash?5+flash*12:0;ctx.shadowColor=color(.5);
    const spatialEnergy=u=>{
      if(!analysis)return Math.max(.2,Math.min(1.25,waveResponse));
      const slot=Math.min(1,Math.floor(u*2)),mix=Math.min(1,u*2-slot),local=visualChannels[slot]*(1-mix)+visualChannels[slot+1]*mix;
      const pitchPosition=u*11,pitchIndex=Math.min(10,Math.floor(pitchPosition)),pitchMix=pitchPosition-pitchIndex,pitch=visualPitches[pitchIndex]*(1-pitchMix)+visualPitches[pitchIndex+1]*pitchMix;return Math.max(.2,Math.min(1.3,local*(.88+pitch*.24)*(.9+visualTimbre[Math.round(u*11)]*mode.detail)));
    };

    ctx.lineCap='round';
    if(visualStyle==='bars'||visualStyle==='dots') {
      const count=visualStyle==='bars'?56:72,spacing=w/(count+1);
      for(let i=0;i<count;i++){
        const u=(i+1)/(count+1),shape=.35+.65*Math.pow(Math.sin(u*Math.PI),.7),sway=.7+.3*Math.sin(u*16+(mode.grid?phase:phase*.7));
        const size=Math.min(h*.40,h*.32*spatialEnergy(u)*mode.amplitude*shape*sway+2),x=(i+1)*spacing;
        ctx.beginPath();ctx.strokeStyle=color(.22+shape*.3);ctx.lineWidth=visualStyle==='dots'?(mode.flash?4.5:3):Math.min(mode.flash?7:5,spacing*(mode.flash?.55:.35));
        if(visualStyle==='bars'){ctx.moveTo(x,h/2-size);ctx.lineTo(x,h/2+size);}
        else {const y=h/2+Math.sin(u*12+(mode.grid?phase:phase*.5))*size;ctx.moveTo(x,y);ctx.lineTo(x+.1,y);}
        ctx.stroke();
      }
      return;
    }
    const rows=visualStyle==='ribbon'?4:9;
    const points=[],step=Math.max(3,w/320);
    for(let x=0;x<=w;x+=step){const u=x/Math.max(w,1);points.push({x,u,energy:spatialEnergy(u),envelope:Math.sin(u*Math.PI),cross:Math.cos(u*4-(mode.grid?0:phase*.25))});}
    for(let row=0;row<rows;row++) {ctx.beginPath();ctx.strokeStyle=color(visualStyle==='ribbon'?.22+row*.055:.12+row*.035);ctx.lineWidth=(visualStyle==='ribbon'?2:row===4?1.5:1)*(mode.flash?1.7:1);
      for(const {x,u,energy,envelope,cross} of points) {const offset=(row-(rows-1)/2)*(visualStyle==='ribbon'?3:2.5);
        const amplitude=Math.min(h*.31*energy*mode.amplitude,Math.max(0,h/2-Math.abs(offset)-3));
        const y=h/2+Math.sin(u*(visualStyle==='ribbon'?7:9+visualBrightness*2)+(mode.grid?-phase:phase*.55)+row*.22)*cross*envelope*amplitude+offset;
        x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }ctx.stroke();}
  }

  function close() { hideLyricScrollbar();toggleSearch(false); cancelAnimationFrame(lyricScroll);clearTimeout(idleTimer);root.dataset.idle='false';root.hidden=true;stopDrawing();if(document.fullscreenElement===root) document.exitFullscreen().catch(()=>{});oldFocus?.focus(); }
  launch.onclick = () => {oldFocus=document.activeElement;root.hidden=false;visualDirty=true;canvasSize=null;checkedURI='';update();wakeControls();get('exit').focus();previous=0;fitArtwork();startDrawing();};
  get('exit').onclick=close;
  get('fullscreen').onclick=async()=>{try{if(document.fullscreenElement===root) await document.exitFullscreen();else await root.requestFullscreen();}catch{text('status','Use Spotify’s View menu to enter fullscreen.');}};
  document.addEventListener('pointerdown',event=>{
    if(root.hidden)return;
    for(const [panelId,toggleId] of [['themes','brand'],['queue','queue-toggle'],['album-panel','album-panel-toggle'],['search-panel','search-toggle']]){
      const panel=get(panelId),toggle=get(toggleId),target=event.target;
      if(panel.hidden||target===panel||target===toggle||panel.contains(target)||toggle.contains(target))continue;
      if(panelId==='search-panel')toggleSearch(false,false);
      else{panel.hidden=true;toggle.setAttribute('aria-expanded','false');}
    }
    wakeControls();
  });
  document.addEventListener('keydown',event=>{
    if(root.hidden||event.key!=='Escape')return;
    if(!get('search-panel').hidden)toggleSearch(false);
    else if(!get('themes').hidden){get('themes').hidden=true;get('brand').setAttribute('aria-expanded','false');get('brand').focus();}
    else close();
    event.preventDefault();event.stopPropagation();
  });
  document.addEventListener('keydown',e=>{
    if(root.hidden||e.metaKey||e.ctrlKey||e.altKey)return;
    const target=e.target,tag=(target?.tagName||'').toLowerCase();
    if((tag==='input'&&target.type!=='range')||tag==='textarea'||target?.isContentEditable)return;
    if(e.key==='[')nudgeLyrics(-100);else if(e.key===']')nudgeLyrics(100);else if(e.key==='\\')nudgeLyrics(0);
    else if((e.key==='d'||e.key==='D')&&!e.repeat)setDebug(root.dataset.debug==='on'?'off':'on');else return;
    e.preventDefault();e.stopPropagation();wakeControls();
  });
  document.addEventListener('visibilitychange',()=>{
    root.dataset.pageHidden=String(!!document.hidden);if(document.hidden)hideLyricScrollbar();stopDrawing();cancelAnimationFrame(lyricScroll);
    if(!document.hidden&&!root.hidden){previous=0;visualDirty=true;canvasSize=null;expandedKey='';update();startDrawing();}
  });
  setInterval(update,500);
  if(globalThis.__RESONANCE_TEST__) globalThis.__RESONANCE_TEST_API__={recordDiagnostic,captureDiagnostics,setWordSync,meshStep,setMeshRotation,setSearchCategory,searchArtist,playAlbum,loadMoreSearch,setPower,playTrack,addQueueButton,openEntity,artistEntities,toggleSearch,runSearch,normalizeSearch,loadLyrics,drawLyrics,setLyricLine,flashStatus,renderUpNext,artistCredits,queuedTracks,canHideControls,wakeControls,playbackSource,seekLyric,toggleExpanded,setTheme,albumAccent,nudgeLyrics,paintDebug,loadAnalysis,analysisResponse,analysisFeatures,prepareAnalysis,analysisCapabilities,setVisualStyle,setMotion,setLayout,setBeatUI,vinylStep,MODES,nextPhase,smoothResponse,setBackground,setArtworkMode,setLyricStyle,setSingleLine,setKeywordEmphasis,lyricKeywords,lyricContrast,contrastRatio,paletteFromPixels,showPalette,lyricContent,scrollLyrics,syncLyricsVisibility,queueAction,trackDuration,trackImage,transitionArtwork,normalizeAlbum,normalizeCredits,matchAlbumBackground,toggleAlbumDetails,loadAlbumDetails};
  console.info('[Resonance] Artwork display ready');
})();
