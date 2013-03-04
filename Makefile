BROWSER := firefox
SPEC_FILES := package.json mask.jquery.json component.json

build: $(SPEC_FILES) \
       jquery.mask.js css/jquery.mask.min.css

$(SPEC_FILES): src/version
	@echo "* expose version in $@"
	@sed -i 's/^\( *"version":\).*$$/\1 "'$$(cat src/version | tr -d '\n')'",/' $@

jquery.mask.js: src/jquery.mask.js src/version
	@echo "* build $@"
	@{ echo -n '/*jQuery.mask '; \
	  cat src/version | tr -d '\n'; \
	  echo ' by Port8000, http://port8000.github.com/jQuery.mask, GPL+MIT license*/'; \
	  cat src/jquery.mask.js | uglifyjs -nc; \
	} > $@

css/jquery.mask.min.css: css/jquery.mask.css
	@echo "* build minified CSS"
	@<$< cssmin >$@

test:
	jshint src/jquery.mask.js
	@for JSON in $(SPEC_FILES); do \
		echo "* lint $$JSON"; \
		jsonlint -q $$JSON; \
		if [ $$? != 0 ]; then exit 1; fi; \
	done
	@echo "* run browser tests in $(BROWSER)"
	@$(BROWSER) file://$$(pwd)/test/SpecRunner.html &

.PHONY: build test
