(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{115:function(e,t,a){"use strict";var n=a(1);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=n(a(0)),o=n(a(122));var u=class extends r.default.Component{render(){return r.default.createElement(o.default,{location:this.props.location},r.default.createElement("h1",null,"Not Found"),r.default.createElement("p",null,"You just hit a route that doesn't exist... the sadness."))}};t.default=u},118:function(e,t,a){"use strict";var n=a(1);Object.defineProperty(t,"__esModule",{value:!0}),t.scale=t.rhythm=t.default=void 0;var r=n(a(134)),o=n(a(135));o.default.overrideThemeStyles=(()=>({"a.gatsby-resp-image-link":{boxShadow:"none"}})),delete o.default.googleFonts;const u=new r.default(o.default);var l=u;t.default=l;const i=u.rhythm;t.rhythm=i;const d=u.scale;t.scale=d},119:function(e,t,a){"use strict";var n=a(15),r=a(1);a(8),Object.defineProperty(t,"__esModule",{value:!0}),t.graphql=function(){throw new Error("It appears like Gatsby is misconfigured. Gatsby related `graphql` calls are supposed to only be evaluated at compile time, and then compiled away,. Unfortunately, something went wrong and the query was left in the compiled code.\n\n.Unless your site has a complex or custom babel/Gatsby configuration this is likely a bug in Gatsby.")},Object.defineProperty(t,"Link",{enumerable:!0,get:function(){return l.default}}),Object.defineProperty(t,"withPrefix",{enumerable:!0,get:function(){return l.withPrefix}}),Object.defineProperty(t,"navigate",{enumerable:!0,get:function(){return l.navigate}}),Object.defineProperty(t,"push",{enumerable:!0,get:function(){return l.push}}),Object.defineProperty(t,"replace",{enumerable:!0,get:function(){return l.replace}}),Object.defineProperty(t,"navigateTo",{enumerable:!0,get:function(){return l.navigateTo}}),Object.defineProperty(t,"PageRenderer",{enumerable:!0,get:function(){return i.default}}),Object.defineProperty(t,"parsePath",{enumerable:!0,get:function(){return d.default}}),t.StaticQuery=t.StaticQueryContext=void 0;var o=r(a(0)),u=r(a(6)),l=n(a(127)),i=r(a(120)),d=r(a(52));const c=o.default.createContext({});t.StaticQueryContext=c;const s=e=>o.default.createElement(c.Consumer,null,t=>e.data||t[e.query]&&t[e.query].data?(e.render||e.children)(e.data?e.data.data:t[e.query].data):o.default.createElement("div",null,"Loading (StaticQuery)"));t.StaticQuery=s,s.propTypes={data:u.default.object,query:u.default.string.isRequired,render:u.default.func,children:u.default.func}},120:function(e,t,a){e.exports=(e=>e&&e.default||e)(a(121))},121:function(e,t,a){"use strict";var n=a(1);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=n(a(29)),o=n(a(0)),u=n(a(6)),l=n(a(53)),i=n(a(7));const d=({location:e})=>{const t=i.default.getResourcesForPathnameSync(e.pathname);return o.default.createElement(l.default,(0,r.default)({location:e,pageResources:t},t.json))};d.propTypes={location:u.default.shape({pathname:u.default.string.isRequired}).isRequired};var c=d;t.default=c},122:function(e,t,a){"use strict";var n=a(1);Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=n(a(29)),o=n(a(0)),u=a(119),l=a(118);var i=class extends o.default.Component{render(){const e=this.props,t=e.location,a=e.title,n=e.children;let i;return i="/"===t.pathname?o.default.createElement("h1",{style:(0,r.default)({},(0,l.scale)(1.5),{marginBottom:(0,l.rhythm)(1.5),marginTop:0})},o.default.createElement(u.Link,{style:{boxShadow:"none",textDecoration:"none",color:"inherit"},to:"/"},a)):o.default.createElement("h3",{style:{fontFamily:"Montserrat, sans-serif",marginTop:0,marginBottom:(0,l.rhythm)(-1)}},o.default.createElement(u.Link,{style:{boxShadow:"none",textDecoration:"none",color:"inherit"},to:"/"},a)),o.default.createElement("div",{style:{marginLeft:"auto",marginRight:"auto",maxWidth:(0,l.rhythm)(24),padding:`${(0,l.rhythm)(1.5)} ${(0,l.rhythm)(.75)}`}},i,n)}};t.default=i}}]);
//# sourceMappingURL=component---src-pages-404-js-8e8b10edbae24849078d.js.map