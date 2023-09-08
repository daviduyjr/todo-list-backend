build:
	rm -rf dist
	node_modules/.bin/tsc --outdir dist
	cp package.json dist/package.json
	mkdir dist/config
	mkdir dist/aws
	cp config/default.js dist/config/default.js
	cp aws/${stage}/resources.yml dist/aws/resources.yml
	cp config/${stage}.json dist/config/${stage}.json
	cp serverless/${stage}/serverless.yml dist/serverless.yml
	cd dist; npm install --ignore-scripts --only=prod

deploy:
	make build stage=${stage}
	cd dist; ../node_modules/.bin/serverless deploy --stage ${stage} --region ${region}

build-local:
	rm -rf dist
	node_modules/.bin/tsc --outdir dist
	cp package.json dist/package.json
	mkdir dist/config
	mkdir dist/aws
	cp config/default.js dist/config/default.js
	cp aws/${stage}/resources.yml dist/aws/resources.yml
	cp config/${stage}.json dist/config/${stage}.json
	grep -vwE "(NODE_CONFIG_DIR|NODE_PATH|ssm|resources)" serverless/${stage}/serverless.yml > dist/serverless.yml
	cd dist; npm install --ignore-scripts --only=prod

start:
	cd dist; ../node_modules/.bin/serverless offline --ignoreJWTSignature --httpPort ${port} --stage ${stage}
