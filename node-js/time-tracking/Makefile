.PHONY: clean build

clean:
	rm -rf .aws-sam

build:
	sam build

start-dev: 
	make build && sam local start-api --port 3000 --docker-network time-tracking_sam-local --env-vars /home/thomas/repos/lambdas/node-js/time-tracking/env/dev.env.json

start-stage: 
	make build && sam local start-api --port 3001 --docker-network time-tracking_sam-local --env-vars /home/thomas/repos/lambdas/node-js/time-tracking/env/stage.env.json

deploy: 
	make build && sam deploy	
