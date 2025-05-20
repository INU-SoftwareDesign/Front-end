pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'mario322/react-app-test'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.CURRENT_BRANCH = 'develop'
                    env.TAG = "dev-${env.BUILD_NUMBER}"
                    env.PORT = '3001'
                    echo "✅ 테스트 브랜치: develop"
                    echo "📦 이미지 태그: ${env.TAG}"
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
/*
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
                        sh 'sonar-scanner -Dsonar.login=$SONAR_TOKEN'
                    }
                }
            }
        }
*/
        stage('Docker Build') {
            steps {
                withCredentials([string(credentialsId: 'REACT_API_URL_TEST', variable: 'API_URL')]) {
                    sh '''
                        echo "🌐 API URL: $API_URL"
                        docker build --build-arg REACT_APP_API_BASE_URL=$API_URL -t $DOCKER_IMAGE:$TAG .
                    '''
                }
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([string(credentialsId: 'dockerhub-token', variable: 'DOCKER_TOKEN')]) {
                    sh '''
                        echo "$DOCKER_TOKEN" | docker login -u mario322 --password-stdin
                        docker push $DOCKER_IMAGE:$TAG
                    '''
                }
            }
        }

        stage('Update GitOps') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'github-cred', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
                    sh '''
                        git config --global user.name "Jenkins"
                        git config --global user.email "jenkins@example.com"

                        git clone https://$GIT_USER:$GIT_TOKEN@github.com/platypus322/DevOps.git
                        cd DevOps/helm/frontend/dev

                        sed -i "s/tag:.*/tag: $TAG/" values.yaml

                        git add values.yaml
                        git commit -m "🔄 Update frontend-dev image tag to $TAG"
                        git push origin main
                    '''
                }
            }
        }
    }

    post {
        always {
            echo "🧹 디스크 정리 시작"
            sh 'docker container prune -f'
            sh 'docker rmi $DOCKER_IMAGE:$TAG || true'
            cleanWs()
        }
    }
}
