(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[8],{776:function(e,t,s){"use strict";s.r(t);var u=s(14),n=s(29),c=s(39),r=s(389),o=s(0),a=s(45),i=s(22),b=s(1);t.default=function(){var e=Object(u.a)(),t=Object(u.b)(c.h),s=Object(a.i)().groupId;return Object(o.useEffect)((function(){var t=function(t){t.groupId!==s&&e(c.a.changeLastMessageGroup(t))};return i.v.emit(n.g.subscribeGroups),i.v.on(n.g.newMessageGroups,t),function(){i.v.emit(n.g.unsubscribeGroups),i.v.off(n.g.newMessageGroups,t)}}),[e,s]),Object(o.useEffect)((function(){e(c.a.getChatGroup())}),[t,e]),Object(b.jsx)(r.a,{})}}}]);
//# sourceMappingURL=8.e0a61ae1.chunk.js.map