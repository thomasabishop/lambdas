.PHONY: clean build

clean:
	rm -rf .aws-sam

build:
	sam build

start: 
	make build && sam local invoke SaveArticlesFunction --env-vars env.json

deploy: 
	make build && sam deploy	

