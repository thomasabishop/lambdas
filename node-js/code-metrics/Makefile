.PHONY: clean build

clean:
	rm -rf .aws-sam

build:
	sam build

start: 
	make build && sam local start-api --port 3001 --env-vars /home/thomas/repos/lambdas/node-js/code-metrics/env/local.env.json

deploy: 
	make build && sam deploy
