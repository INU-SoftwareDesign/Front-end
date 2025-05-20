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
                    env.CURRENT_BRANCH = env.GIT_BRANCH.replaceFirst(/^origin\//, '')
                    echo "✅ 현재 브랜치: ${env.CURRENT_BRANCH}"

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

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        /*stage('Unit Test') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    sh 'npm test'
                }
            }
        }*/

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
                        sh 'sonar-scanner -Dsonar.login=$SONAR_TOKEN'
                        
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

    }

        stage('Update GitOps') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'github-cred', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
                    sh '''
                        git config --global user.name "Jenkins"
                        git config --global user.email "jenkins@example.com"
                        git clone https://$GIT_USER:$GIT_TOKEN@github.com/your-org/DevOps.git
                        cd DevOps/helm/backend/prod

                        sed -i "s/tag:.*/tag: $TAG/" values.yaml

                        git add values.yaml
                        git commit -m "🔄 Update backend-prod image tag to $TAG"
                        git push origin main
                    '''
                }
            }
        }


    post {
        always {
            echo "🧹 디스크 정리 시작"

            // 중지된 컨테이너 제거
            sh 'docker container prune -f'

            // 빌드된 이미지 삭제
            sh 'docker rmi $DOCKER_IMAGE:$TAG || true'

            // Jenkins 워크스페이스 정리
            cleanWs()
        }
    }
}
