pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'mario322/react-app'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    // 브랜치 이름 추출 (예: origin/develop → develop)
                    env.CURRENT_BRANCH = env.GIT_BRANCH.replaceFirst(/^origin\//, '')
                    echo "✅ 현재 브랜치: ${env.CURRENT_BRANCH}"

                    // 브랜치 기반 태그 및 포트 설정
                    if (env.CURRENT_BRANCH == 'main') {
                        env.TAG = 'prod'
                        env.PORT = '3000'
                    } else if (env.CURRENT_BRANCH == 'develop') {
                        env.TAG = 'dev'
                        env.PORT = '3001'
                    } else {
                        error "❌ 지원하지 않는 브랜치입니다: ${env.CURRENT_BRANCH}"
                    }
                }
            }
        }

        stage('Docker Build') {
            steps {
                withCredentials([string(credentialsId: 'REACT_API_URL', variable: 'API_URL')]) {
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

        stage('Docker Run') {
            steps {
                sh '''
                    docker stop react-container-$TAG || true
                    docker rm react-container-$TAG || true
                    docker run -d -p $PORT:3000 --name react-container-$TAG $DOCKER_IMAGE:$TAG
                '''
            }
        }
    }
}
