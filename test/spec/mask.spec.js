describe("jQuery.mask", function() {
  var target, done;
  function waitsForDone() {
    waitsFor(function() { return done; });
  }

  beforeEach(function () {
    done = false;
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
  });

  it("should unmask an element", function() {
    runs(function() {
      target.mask().unmask({
        callback: function() { done = true; }
      });
    });
    waitsForDone();
    runs(function() {
      expect($('.ui-mask').length).toBe(0);
      expect($('.ui-mask')[0]).toBeUndefined();
      expect(target.data('mask')).toBeUndefined();
    });
  });

  it("should match the element's dimensions", function() {
    target.css({
      width: 101,
      height: 123,
      paddingTop: 7,
      paddingRight: 4
    });
    var pos = target.offset(), w = target.outerWidth(),
        h = target.outerHeight(), mask;
    runs(function() {
      target.mask({
        callback: function() {
          mask = target.data('mask');
        }
      });
    });
    waitsFor(function() { return mask !== undefined; });
    runs(function() {
      expect(mask.width()).toBe(105);
      expect(mask.height()).toBe(130);
      expect(mask.offset().top).toBe(pos.top);
      expect(mask.offset().left).toBe(pos.left);
    });
  });

  it("should toggle the mask", function() {
    runs(function() {
      target.toggleMask();
      expect(target.data('mask').length).toBe(1);
    });

    runs(function() {
      target.toggleMask({
        callback: function() { done = true; }
      });
    });
    waitsForDone();
    runs(function() {
      expect(target.data('mask')).toBeUndefined();
    });

    done = false;
    runs(function() {
      target.toggleMask({
        callback: function() { done = true; }
      }, false);
    });
    waitsForDone();
    runs(function() {
      expect(target.data('mask')).toBeUndefined();
    });

    runs(function() {
      target.toggleMask({}, true);
      expect(target.data('mask').length).toBe(1);
    });
  });

  it("should detect masking", function() {
    runs(function() {
      expect(target.mask().isMasked()).toBe(true);
      target.unmask({
        callback: function() {
          done = true;
        }
      });
    });
    waitsForDone();
    runs(function() {
      expect(target.isMasked()).toBe(false);
    });
  });

  it('should provide a :masked selector', function() {
    expect(target.mask().filter(':masked').length).toBe(1);
  });

  it("should put content in the mask", function() {
    target.mask({ content: '<big>test</big>' });
    expect(target.data('mask').find('big').length).toBe(1);
  });

  it("should remove and restore tabindex on the target", function() {
    runs(function() {
      target.attr('tabindex', '3').mask();
      expect(target.attr('tabindex')).toEqual(-1);
      target.unmask({
        callback: function() { done = true; }
      });
    });
    waitsForDone();
    runs(function() {
      expect(target.attr('tabindex')).toEqual(3);
    });
  });

  it("should remove and restore tabindex on the target's children", function() {
    runs(function() {
      target.append($('<input/>'))
            .append($('<textarea/>').attr('tabindex', '1'))
            .append($('<div/>').attr('tabindex', '2'))
            .mask();
      expect(target.find('input').attr('tabindex')).toEqual(-1);
      expect(target.find('textarea').attr('tabindex')).toEqual(-1);
      expect(target.find('div').attr('tabindex')).toEqual(-1);
      target.unmask({
        callback: function() { done = true; }
      });
    });
    waitsForDone();
    runs(function() {
      expect(target.find('input').attr('tabindex')).toEqual(0);
      expect(target.find('textarea').attr('tabindex')).toEqual(1);
      expect(target.find('div').attr('tabindex')).toEqual(2);
    });
  });

  it("should fire events", function() {
    var m = 0, u = 0;
    runs(function() {
      target.on('masked', function() { m++; })
            .on('unmasked', function() { u++; })
            .mask({
              callback: function() {
                this.unmask();
              }
            });
    });
    waitsFor(function() { return m+u === 2; });
    runs(function() {
      expect(m+u).toBe(2);
    });
  });

  it("should respect the delay param", function() {
    runs(function() {
      target.mask({
        effect: function() { return this; },
        delay: 100,
        callback: function() { done = true; }
      });
      expect(done).toBe(false);
    });
    waits(50);
    expect(done).toBe(false);
    waits(60);
    expect(done).toBe(false);
  });

  describe("The whole page", function() {
    function maskPage(d) {
      return function() {
        var done_ = false, target = $(d);
        runs(function() {
          target.mask({
            callback: function() { done_ = true; }
          });
        });
        waitsFor(function() { return done_; }, "window to be masked", 1000);
        runs(function() {
          var mask = $(document.body).data('mask');
          expect($('.ui-mask').length).toBe(1);
          expect(mask).not.toBeUndefined();
          expect(mask.width()).toBe($(document.documentElement).width());
          expect(mask.height()).toBe($(document.documentElement).height());
        });
      };
    }

    it("should be masked with window", maskPage(window));
    it("should be masked with document", maskPage(document));
    it("should be masked with document.body", maskPage('body')); // document.body doesn't exist yet...
    it("should be masked with document.documentElement",
        maskPage(document.documentElement));

    it("should be masked with any of those in the collection", function() {
      var i = $('<i></i>').appendTo('body').add(document);
      maskPage(i)();
    });

  });

});
