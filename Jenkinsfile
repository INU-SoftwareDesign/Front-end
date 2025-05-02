pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                git branch: 'feature/hjh',
                    url: 'https://github.com/INU-SoftwareDesign/Front-end.git'
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
