
## ironSource Test


## Prerequisites

- Node.js with NPM
- gulp
- Docker
- Docker Compose
    

## Deploy

    npm run build-docker
    npm run test-docker
    npm run start-docker
    
note: to run test on verbose mode:

    npm run test-docker -- --verbose
    
## Stop
    npm run stop-docker
    
## Deploy Without Docker
    npm install
    gulp build

Edit `config.json` to meet your configuration if you like, then:

    npm test
    npm start

Now you may go to: <http://localhost:80>

## API documentation
    /docs
    