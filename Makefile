BROWSER := firefox

build: package.json jquery.mask.js

package.json: src/version
	sed -i 's/^\( *"version":\).*$$/\1 "'$$(cat src/version | tr -d '\n')'",/' $@

jquery.mask.js: src/jquery.mask.js src/version
	{ echo -n '/*jQuery.mask '; \
	  cat src/version | tr -d '\n'; \
	  echo ' by Port8000, http://port8000.github.com/jQuery.mask, GPL+MIT license*/'; \
	  cat src/jquery.mask.js | uglifyjs -nc; \
	} > $@

test:
	jshint src/jquery.mask.js
	$(BROWSER) $$(pwd)/test/SpecRunner.html &

.PHONY: build test
