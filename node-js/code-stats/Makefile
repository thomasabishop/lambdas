.PHONY: clean build

clean:
	rm -rf .aws-sam

build:
	sam build

start: 
	make build && sudo sam local start-api --port 3003  --env-vars /home/thomas/repos/lambdas/node-js/code-stats/env/local.env.json

deploy: 
	make build && sam deploy	
