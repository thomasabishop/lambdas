.PHONY: clean build

clean:
	rm -rf .aws-sam

build:
	sam build

start-api: 
	sam build
	sam local start-api --env-vars /home/thomas/repos/lambdas/code-metrics-lambda/env/local.env.json 
