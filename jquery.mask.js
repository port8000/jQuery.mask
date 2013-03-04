/*jQuery.mask 0.9.3 by Port8000, http://port8000.github.com/jQuery.mask, GPL+MIT license*/
(function(e,t,n,r){function i(r){var i=!1;return n.each([e,t,t.documentElement,t.body],function(e,t){if(r.index(t)>-1)return i=!0,!1}),i}function s(e,t,n){var r="mask.class";t=t||e.data("mask"),t.remove(),e.removeData("mask"),o(e,!1),a(e),e.removeAttr("aria-busy").removeAttr("aria-disabled"),e.data(r)&&e.removeClass(e.data(r)).removeData(r),e.trigger("unmasked"),n&&n.call(e,t)}function o(e,i){var s="mask.tabindex";e[0]===t.body?e=e.children().not(e.data("mask")):e=e.add("*",e),e.each(function(){var e=n(this);i?e.data(s,e.attr("tabindex")).attr("tabindex",-1).blur():e.data(s)!==r&&e.attr("tabindex",e.data(s)).removeData(s)})}function u(e){function n(e){if(t!==e.target&&!t.has(e.target).length)return e.stopPropagation(),e.preventDefault(),!1}var t=e.data("mask");e.data("mask.eventhandler",n),e.bind("click change focus select mousedown mouseup keydown keypress",n)}function a(e){var t=e.data("mask.eventhandler");t&&(e.unbind("click change focus select mousedown mouseup keydown keypress",t),e.removeData("mask.eventhandler"))}function f(e,r,i){var s,o,u;return i?(s={top:0,left:0},u=n(t.documentElement).outerHeight(!0),o=n(t.documentElement).outerWidth(!0)):(s=e.offset(),u=e.outerHeight(),o=e.outerWidth()),r.css({left:s.left,top:s.top,height:u,width:o}),r}n.fn.mask=function(e){var r=this,a=i(r);return a&&(r=n(t.body)),e=n.extend({effect:function(){return this.fadeIn("fast")},addClass:"",addMaskClass:"",content:!1,delay:0,focusable:!1,callback:n.noop},e),e.effect||(e.effect=function(){return this}),r.each(function(){var r=n(this),i=r.data("mask"),l;i&&s(r,i),i=n('<div class="ui-mask"/>').data("mask.parent",r),l=n('<div class="ui-mask-content"></div>').appendTo(i),e.addMaskClass&&i.addClass(e.addMaskClass),e.content?typeof e.content=="string"?l.html(e.content):l.append(e.content):l.addClass("ui-mask-empty"),r.data("mask",i).on("destroyed",function(){s(n(this))}),e.addClass&&(r.addClass(e.addClass),r.data("mask.class",e.addClass)),e.focusable?i.css("pointer-events","none"):(o(r,!0),u(r),r.attr("aria-busy","true").attr("aria-disabled","true")),e.effect.call(f(r,i,a).hide().appendTo(t.body).delay(e.delay)).promise().done(function(){r.trigger("masked",i),e.callback.call(r,i)})}),this},n.fn.unmask=function(e){var r=this,o=i(r);return o&&(r=n(t.body)),e=n.extend({effect:function(){return this.fadeOut("fast")},callback:n.noop},e),e.effect||(e.effect=function(){return this}),r.each(function(){var t=n(this),r=t.data("mask");r&&e.effect.call(r.stop(!0)).promise().done(function(){s(t,r,e.callback)})}),this},n.fn.adjustMask=function(){var e=this,r=i(e);return r&&(e=n(t.body)),e.each(function(){var e=n(this);f(e,e.data("mask"),r)}),this},n.fn.toggleMask=function(e,t){return t===r&&(t=!this.isMasked()),t?this.mask(e):this.unmask(e),this},n.fn.isMasked=function(){return i(this)?!!n(t.body).data("mask"):!!this.data("mask")},n.expr[":"].masked=function(e){return n(e).isMasked()}})(this,this.document,jQuery);