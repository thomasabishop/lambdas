.PHONY: clean build

clean:
	rm -rf .aws-sam

build:
	sam build

start: 
	npx nodemon
