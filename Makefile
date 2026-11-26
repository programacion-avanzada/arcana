
SHELL := /bin/bash

.DEFAULT_GOAL := help
.PHONY: help start
.PHONY: lint deploy

help:
	@echo "Usage: make <target>"
	@echo
	@echo "Targets:"
	@echo "  start    Run: npm run quartz -- build --serve"
	@echo "  lint     Run markdown linter (fails if issues found)"
	@echo "  lint-fix Run markdown linter with auto-fix where possible"
	@echo "  deploy   Run: git push"
	@echo "  help     Show this help"

start:
	@command -v npm >/dev/null 2>&1 || { echo >&2 "npm not found. Install Node.js/npm."; exit 1; }
	@echo "Running: npm run quartz -- build --serve"
	@npm run quartz -- build --serve

lint:
	@command -v npx >/dev/null 2>&1 || { echo >&2 "npx not found. Install Node.js/npm."; exit 1; }
	@npx -y markdownlint-cli2 "content/**/*.md" --config .markdownlint.json && echo "No markdownlint issues."

lint-fix:
	@command -v npx >/dev/null 2>&1 || { echo >&2 "npx not found. Install Node.js/npm."; exit 1; }
	@echo "Running: npm run lint:md:fix (this will modify files)"
	@npx -y markdownlint-cli2 "content/**/*.md" --config .markdownlint.json --fix
	@echo "Done. Review and commit changes if acceptable."



deploy:
	git push
