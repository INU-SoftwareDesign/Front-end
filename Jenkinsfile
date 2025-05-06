pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/INU-SoftwareDesign/Front-end.git'
            }
        }

        stage('Write .env') {
            steps {
                withCredentials([string(credentialsId: 'REACT_API_URL', variable: 'API_URL')]) {
                    sh '''
                        echo "REACT_APP_API_BASE_URL=$API_URL" > .env
                        cp .env ./src/.env
                        cat ./src/.env
                    '''
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t react-app .'
            }
        }

        stage('Docker Run') {
            steps {
                sh 'docker stop react-container || true'
                sh 'docker rm react-container || true'
                sh 'docker run -d -p 3000:3000 --name react-container react-app'
            }
        }
    }
}
