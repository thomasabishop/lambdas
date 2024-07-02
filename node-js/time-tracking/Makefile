MIGRATION_SCRIPT=./scripts/migrate.sh
BACKUP_SCRIPT=./scripts/backup.sh

.PHONY: clean build migrate db-up

clean:
	rm -rf .aws-sam

build:
	sam build

api-start: db-up
	@echo "Starting local API Gateway development server at port:3000..."
	make build && sam local start-api --port 3000 --docker-network time-tracking_sam-local --env-vars /home/thomas/repos/lambdas/node-js/time-tracking/env/dev.env.json

db-up:
	@echo "Starting Docker local DynamoDB instance: 'timetracking_dynamodb_dev'", 
	docker-compose up -d --remove-orphans || { echo "Failed to start Docker services"; exit 1; }

migrate: db-up 
	@echo "Migrating production DB data to local development instance..."
	@bash $(MIGRATION_SCRIPT) || { echo "Migration failed"; exit 1; }

backup: migrate
	@echo "Running backup of synchronised development instance..."
	@bash $(BACKUP_SCRIPT) || { echo "Backup failed"; exit 1; }


deploy: 
	make build && sam deploy	
