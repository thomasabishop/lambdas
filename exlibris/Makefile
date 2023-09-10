.PHONY: clean build

clean:
	rm -rf .aws-sam

build:
	sam build

start: 
	make build && sam local start-api --docker-network exlibris-network --env-vars /home/thomas/repos/lambdas/exlibris/env/local.env.json

deploy: 
	make build && sam deploy	
