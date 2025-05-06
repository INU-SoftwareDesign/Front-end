pipeline {
    agent any

    environment {
        REACT_APP_API_URL = credentials('REACT_API_URL')  // Jenkins에 등록된 값 사용
    }

    stages {
        stage('Clone') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/INU-SoftwareDesign/Front-end.git'
            }
        }

        stage('Write .env') {
            steps {
                sh """
                    echo "REACT_APP_API_BASE_URL=${REACT_APP_API_URL}" > .env
                    cat .env
                """
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
                sh 'docker run -d -p 3000:3000 --env-file .env --name react-container react-app'
            }
        }
    }
}