# jQuery.mask

## Mask any Element

This jQuery plugin masks and unmasks elements, so you can handle them without
annoying user interaction taking place.

See the [live demo](http://port8000.github.com/jQuery.mask/demo/demo.html).

## Installation

Place the jquery.mask.js file and the jquery.mask.css file on your server and
include them:

    <script src="/static/js/jquery.js"></script>
    <script src="/static/js/jquery.mask.js"></script>
    <link rel="stylesheet" href="/static/css/jquery.mask.css" />

Optionally you can embed jquery.event.destroyed from the
[jQuery++ project](http://jquerypp.com/). This automatically unmasks any
element, when it gets removed.

## Usage

Let's assume, you have a button, that should get masked on click and unmasked,
after the respective action has finished:

    $button.on('click', function() {
      $(this).mask();            // mask the element
      // do the action here
      $(this).unmask();          // remove the mask again
    });

In real-life applications you will usually do the unmasking in a callback or
success/error handling function. You can mask the whole browser window, if any
of `window`, `document`, `<body>` or `<html>` appear in the jQuery collection:

    $(window).mask();            // produces the same result as
    $('a').add(document).mask(); // or
    $('body').mask();

If you want to access the mask element directly, you can use

    $button.data('mask');

When you want to check, if an element is masked, or filter all masked
elements, you can do this as well:

    $button.isMasked();          // check if the element is masked
    $('button:masked');          // get all masked elements

Finally, you can react on masking events:

    $button.on('masked', function(event, mask) {
        // paint the mask green when visible
        mask.css('background', 'green');
    });

    $button.on('unmasked', function(event) {
        alert('You have successfully unmasked the element.');
    });

## Options

Use the following options to configure jQuery.mask:

* `effect` - the effect function to display the mask. For no effect at all use
  `null`
* `addClass` - additional class to give to the masked target element.
* `addMaskClass` - additional class to give to the mask.
* `content` - content to place into the mask. The default is to keep the mask
  empty.
* `delay` - delay the display of the mask. This is useful, when the masking
  action is usually short and you want to prevent a flicker in that case. When
  `unmask` is called during that time, no mask will be shown.
* `focusable` - whether the masked element can be accessed. The default is to
  prevent this. When set to `true`, both keyboard and mouse access are
  possible through the mask.
* `callback` - a callback function that gets called after masking the element.
  It gets the currently masked element (jQuery object) as `this` and the mask
  itself (jQuery object) passed as argument.

## License

The plugin is released under both the GPL and MIT License.

## Author

The plugin was written by Manuel Strehl,
[@m_strehl](http://twitter.com/m_strehl), and open-sourced by Port 8000 UG.

