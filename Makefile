
SHELL := /bin/bash

.DEFAULT_GOAL := help
.PHONY: help start

help:
	@echo "Usage: make <target>"
	@echo
	@echo "Targets:"
	@echo "  start    Run: npx quartz build --serve"
	@echo "  help     Show this help"

start:
	@command -v npx >/dev/null 2>&1 || { echo >&2 "npx not found. Install Node.js/npm."; exit 1; }
	@echo "Running: npx quartz build --serve"
	@npx quartz build --serve


