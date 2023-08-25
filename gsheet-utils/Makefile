.PHONY: clean build

clean:
	rm -rf .aws-sam

build:
	sam build

start: 
	make build && sam local invoke UpdateSheetFunction --event events/event.json --env-vars env.json

deploy: 
	make build && sam deploy	

