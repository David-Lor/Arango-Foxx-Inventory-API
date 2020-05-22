.DEFAULT_GOAL := help

zip:
	zip -r entities_api.zip . -x "node_modules/*" ".git/*" ".vscode/*" ".idea/*"

install-dev-deps:
	npm install --only=dev

help: ## show this help.
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'