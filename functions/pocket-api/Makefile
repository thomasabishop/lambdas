.PHONY: clean build

clean:
	rm -rf .aws-sam

build:
	sam build

start: 
	make build && sam local start-api --env-vars /home/thomas/repos/lambdas/functions/pocket-api/env/local.env.json

deploy: 
	make build && sam deploy	

