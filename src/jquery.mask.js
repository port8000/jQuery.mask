/**
 * jQuery.mask
 *
 * Mask any DOM element by hiding it below another element, the mask
 *
 * Copyright (c) 2012 Port 8000 GmbH
 * License: Published under both the GPL and MIT License
 */
(function(window, document, $, undefined) {

  /**
   * check if a global (window, body, ...) is in the current collection
   */
  function check_global(target) {
    var is_global = false;
    // find out, if there is any "global" node in the current selection
    $.each([window, document, document.documentElement, document.body],
        function(i, v) {
          if (target.index(v) > -1) {
            is_global = true;
            return false;
          }
        });
    return is_global;
  }

  /**
   * remove the mask now
   */
  function removeMask(cur, mask, callback) {
    var k = 'mask.class';
    mask = mask || cur.data('mask');
    mask.remove();
    cur.removeData('mask');

    // reset the focus disabling
    handleTabindex(cur, false);
    cur.removeAttr('aria-busy')
       .removeAttr('aria-disabled');
    if (cur.data(k)) {
      // if any special classes were set, remove them
      cur.removeClass(cur.data(k)).removeData(k);
    }

    cur.trigger('unmasked');
    if (callback) {
      callback.call(cur, mask);
    }
  }

  /**
   * remove or restore the tabindex
   */
  function handleTabindex(root, remove) {
    var k = 'mask.tabindex';
    if (root[0] === document.body) {
      root = root.children().not(root.data('mask'));
    } else {
      root = root.add('*', root);
    }
    root.each(function() {
      var $this = $(this);
      if (remove) {
        $this.data(k, $this.attr('tabindex'))
              .attr('tabindex', -1).blur();
      } else {
        if ($this.data(k) !== undefined) {
          $this.attr('tabindex', $this.data(k))
                .removeData(k);
        }
      }
    });
  }

  function positionMask(cur, mask, is_global) {
      var pos, w, h;

      if (is_global) {
        pos = {top: 0, left: 0};
        // we want to catch any margins in this case, too
        h = $(document.documentElement).outerHeight(true);
        w = $(document.documentElement).outerWidth(true);
      } else {
        pos = cur.offset();
        h = cur.outerHeight();
        w = cur.outerWidth();
      }
      mask.css({
        left: pos.left,
        top: pos.top,
        height: h,
        width: w
      });
      return mask;
  }

  /**
   * mask an element by an overlay
   *
   * - If the collection contains, body, window or such, the <body> will
   *   be masked only
   * - Triggers masked.mask on completion
   */
  $.fn.mask = function(o) {
    var target = this,
        is_global = check_global(target);

    // if a global node is present, we mask only the <body>
    if (is_global) {
      target = $(document.body);
    }

    o = $.extend({
      // the effect to show the mask, must return `this`
      effect: function() { return this.fadeIn('fast'); },
      //additional classes to set on the target
      addClass: '',
      //additional classes to set on the mask
      addMaskClass: '',
      // additional content to put in the mask
      content: false,
      // add a delay to show the mask
      delay: 0,
      // whether the element may still be focused when masked
      focusable: false,
      // what to do after masking
      callback: $.noop
    }, o);

    // mask each element individually
    target.each(function() {
      var cur = $(this),
          mask = cur.data('mask');

      if (mask) {
        // if the element is already masked, unmask first
        removeMask(cur, mask);
      }

      // create the mask (and fill it with content, if wanted)
      mask = $('<div class="ui-mask">'+
                 '<div class="ui-mask-content"></div>'+
               '</div>').data('mask-parent', cur);
      if (o.addMaskClass) {
        mask.addClass(o.addMaskClass);
      }
      if (o.content) {
        if (typeof o.content === 'string') {
          mask.find('div').html(o.content);
        } else {
          mask.find('div').append(o.content);
        }
      } else {
        mask.find('div').addClass('ui-mask-empty');
      }

      cur.data('mask', mask).on('destroyed', function() {
            // if the element gets destroyed, and jquery.event.destroyed by
            // jQuery++ is in place, also remove its mask
            removeMask($(this));
          });
      if (o.addClass) {
        cur.addClass(o.addClass);
        cur.data('mask.class', o.addClass);
      }

      if (! o.focusable) {
        // prevent element from getting the focus
        handleTabindex(cur, true);
        cur.attr('aria-busy', 'true')
           .attr('aria-disabled', 'true');
      } else {
        // let the mask be transparent for the mouse
        mask.css('pointer-events', 'none');
      }

      // call the show effect
      o.effect.call(
          // position the mask to meet the dimensions of the target
          positionMask(cur, mask, is_global).hide()
            // append it to the body
            .appendTo(document.body)
            // show it with the pre-defined effect
            .delay(o.delay)
        )
        // and fire the masked event afterwards
        .promise().done(function() {
          cur.trigger('masked', mask);
          o.callback.call(cur, mask);
        });

    });

    return this;
  };

  /**
   * remove all masks from the collection
   *
   * - Triggers unmasked.mask on completion
   */
  $.fn.unmask = function(o) {
    var target = this,
        is_global = check_global(target);

    // if a global node is present, we unmask only the <body>
    // to stay consistent with .mask()
    if (is_global) {
      target = $(document.body);
    }

    o = $.extend({
      // the effect to hide the mask, must return `this`
      effect: function() { return this.fadeOut('fast'); },
      // a callback, when the mask is removed
      callback: $.noop
    }, o);

    target.each(function() {
      var cur = $(this),
           mask = cur.data('mask');

      if (mask) {

        o.effect.call(mask.stop(true)).promise().done(function() {
          removeMask(cur, mask, o.callback);
        });

      }

    });

    return this;
  };

  /**
   * adjust the mask's position (useful when target position changed)
   */
  $.fn.adjustMask = function() {
    var target = this,
        is_global = check_global(target);

    if (is_global) {
      target = $(document.body);
    }

    target.each(function() {
      var cur = $(this);
      positionMask(cur, cur.data('mask'), is_global);
    });

    return this;
  };

  /**
   * toggle the masking state
   */
  $.fn.toggleMask = function(o, state) {
    if (state === undefined) {
      state = !this.isMasked();
    }
    if (state) {
      this.mask(o);
    } else {
      this.unmask(o);
    }
    return this;
  };

  /**
   * check, if an element is masked
   */
  $.fn.isMasked = function() {
    if (check_global(this)) {
      return !!$(document.body).data('mask');
    }
    return !!this.data('mask');
  };

  /**
   * expose a ":masked" pseudo-selector
   */
  $.expr[':'].masked = function(obj) {
    return $(obj).isMasked();
  };

})(this, this.document, jQuery);
