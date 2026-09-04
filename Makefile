
SHELL := /bin/bash

.DEFAULT_GOAL := help
.PHONY: help start
.PHONY: lint

help:
	@echo "Usage: make <target>"
	@echo
	@echo "Targets:"
	@echo "  start    Run: npm run quartz -- build --serve"
	@echo "  lint     Run markdown linter (fails if issues found)"
	@echo "  lint-fix Run markdown linter with auto-fix where possible"
	@echo "  help     Show this help"

start:
	@command -v npm >/dev/null 2>&1 || { echo >&2 "npm not found. Install Node.js/npm."; exit 1; }
	@echo "Running: npm run quartz -- build --serve"
	@npm run quartz -- build --serve

lint:
	@command -v npx >/dev/null 2>&1 || { echo >&2 "npx not found. Install Node.js/npm."; exit 1; }
	@echo "Running: npm run lint:md"
	@# Run the linter and capture output
	@npx -y markdownlint-cli2 "content/**/*.md" --config .markdownlint.json 2>&1 | tee md-lint-output.txt || true
	@if [ -s md-lint-output.txt ]; then \
		echo "Markdown lint issues found:"; \
		head -n 200 md-lint-output.txt; \
		exit 1; \
	else \
		echo "No markdownlint issues."; \
	fi

lint-fix:
	@command -v npx >/dev/null 2>&1 || { echo >&2 "npx not found. Install Node.js/npm."; exit 1; }
	@echo "Running: npm run lint:md:fix (this will modify files)"
	@npx -y markdownlint-cli2 "content/**/*.md" --config .markdownlint.json --fix
	@echo "Done. Review and commit changes if acceptable."


