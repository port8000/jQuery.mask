describe("jQuery.mask", function() {
  var target;

  beforeEach(function () {
    target = $('<div id="mask-target"></div>');
    target.appendTo('body');
  });

  afterEach(function () {
    target.remove();
    $('.ui-mask').remove();
  });

  it("should mask an element", function() {
    target.mask();
    expect($('.ui-mask').length).toBe(1);
    expect($('.ui-mask')[0]).toBe(target.data('mask')[0]);
    target.unmask();
  });

  it("should unmask an element", function() {
    target.mask().unmask({ callback: function() {
      expect($('.ui-mask').length).toBe(0);
      expect($('.ui-mask')[0]).toBe(undefined);
    } });
  });

  it("should match the element's dimensions", function() {
    target.css({
      width: 101,
      height: 123,
      paddingTop: 7,
      paddingRight: 4
    });
    var pos = target.offset(), w = target.outerWidth(),
        h = target.outerHeight();
    target.mask({ callback: function() {
      var mask = target.data('mask');
      expect(mask.width()).toBe(105);
      expect(mask.height()).toBe(130);
      expect(mask.offset().top).toBe(pos.top);
      expect(mask.offset().left).toBe(pos.left);
    } });
  });

  it("should toggle the mask", function() {
    target.toggleMask({ callback: function() {
      expect(target.data('mask').length).toBe(1);
    } });
    target.toggleMask({ callback: function() {
      expect(target.data('mask')).toBe(undefined);
    } });
    target.toggleMask({ callback: function() {
      expect(target.data('mask')).toBe(undefined);
    } }, false);
    target.toggleMask({ callback: function() {
      expect(target.data('mask').length).toBe(1);
    } }, true);
  });

  it("should detect masking", function() {
    expect(target.mask().isMasked()).toBe(true);
    target.unmask({ callback: function() {
      expect(target.isMasked()).toBe(false);
    } });
    expect(target.mask().filter(':masked').length).toBe(1);
  });

  it("should put content in the mask", function() {
    target.mask({ content: '<big>test</big>' });
    expect(target.data('mask').find('big').length).toBe(1);
  });

  it("should remove and restore tabindex", function() {
    target.attr('tabindex', '3').mask();
    expect(target.attr('tabindex')).toBe(-1);
    target.unmask({
      callback: function() {
        expect(target.attr('tabindex')).toBe('3');
      }
    });
  });

  it("should fire events", function() {
    var m = 0, u = 0;
    target.on('masked', function() { m++; })
          .on('unmasked', function() { u++; })
          .mask({
            effect: function() { return this; },
            callback: function() {
              this.unmask({
                effect: function() { return this; },
                callback: function() {
                  window.setTimeout(function() {
                    expect(m+u).toBe(2);
                  }, 50);
                }
              });
            }
          });
  });

  describe("The whole page", function() {

    it("should be masked with window", function() {
      $(window).mask({ callback: function() {
        expect($('.ui-mask').length).toBe(1);
        var mask = $(document.body).data('mask');
        expect(mask.width()).toBe($(document.documentElement).width());
      } });
    });

    it("should be masked with document", function() {
      $(document).mask({ callback: function() {
        expect($('.ui-mask').length).toBe(1);
        var mask = $(document.body).data('mask');
        expect(mask.width()).toBe($(document.documentElement).width());
      } });
    });

    it("should be masked with document.body", function() {
      $(document.body).mask({ callback: function() {
        expect($('.ui-mask').length).toBe(1);
        var mask = $(document.body).data('mask');
        expect(mask.width()).toBe($(document.documentElement).width());
      } });
    });

    it("should be masked with document.documentElement", function() {
      $(document.documentElement).mask({ callback: function() {
        expect($('.ui-mask').length).toBe(1);
        var mask = $(document.body).data('mask');
        expect(mask.width()).toBe($(document.documentElement).width());
      } });
    });

    it("should be masked with any of those in the collection", function() {
      var i = $('<i></i>').appendTo('body').add(document);
      i.mask({ callback: function() {
        expect($('.ui-mask').length).toBe(1);
        var mask = $(document.body).data('mask');
        expect(mask.width()).toBe($(document.documentElement).width());
      } });
    });

  });

});
