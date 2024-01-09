.PHONY: clean build

clean:
	rm -rf .aws-sam

build:
	sam build

start: 
	make build && sam local start-api --port 3003  --env-vars /home/thomas/repos/lambdas/node-js/code-durations/env/local.env.json

deploy: 
	make build && sam deploy	
