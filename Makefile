BROWSER := firefox

build: jquery.mask.js

jquery.mask.js: src/jquery.mask.js
	{ echo '/*!jQuery.mask by Port8000, http://port8000.github.com/jQuery.mask, GPL+MIT license*/'; cat $^ | uglifyjs -nc; } > $@

test:
	jshint src/jquery.mask.js
	$(BROWSER) $$(pwd)/test/SpecRunner.html &

.PHONY: build test
