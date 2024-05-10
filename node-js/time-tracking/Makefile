.PHONY: clean build

clean:
	rm -rf .aws-sam

build:
	sam build

start: 
	make build && sam local start-api --docker-network host --port 3000 --env-vars /home/thomas/repos/lambdas/node-js/time-tracking/env/local.env.json

deploy: 
	make build && sam deploy	
