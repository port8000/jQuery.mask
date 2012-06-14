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

  if("should toggle the mask", function() {
    target.toggleMask({ callback: function() {
      expect(target.data('mask').length).toBe(1);
    } });
    target.toggleMask({ callback: function() {
      expect(target.data('mask')).toBe(undefined);
    } });
  });

});
