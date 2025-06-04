pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'mario322/react-app-test'
        SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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'
    }

    stages {
        stage('Slack Notify Start') {
            steps {
                sh """
                curl -X POST -H 'Content-type: application/json' \
                --data '{"text":"🚀 [Jenkins] Frontend-dev 빌드 시작"}' \
                ${SLACK_WEBHOOK_URL}
                """
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.CURRENT_BRANCH = 'develop'      // 고정
                    env.TAG = "dev-${env.BUILD_NUMBER}"                 // 운영용 태그
                    env.PORT = '3001'                // 운영 포트
                    echo "✅ 운영 브랜치: develop"
                    echo "📦 이미지 태그: ${env.TAG}"
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
                    sh 'docker build --build-arg REACT_APP_API_BASE_URL="$API_URL" -t $DOCKER_IMAGE:$TAG .'
                }
            }
        }

        /*stage('Trivy Scan') {
            steps {
                sh '''
                    # Trivy 설치 (최초 1회만 설치되게 체크 가능)
                    if ! command -v trivy &> /dev/null; then
                        echo "Trivy not found. Installing..."
                        wget -q https://github.com/aquasecurity/trivy/releases/latest/download/trivy_0.50.1_Linux-64bit.deb
                        sudo dpkg -i trivy_0.50.1_Linux-64bit.deb
                    fi

                    echo "🔍 Trivy 보안 스캔 시작"
                    trivy image --exit-code 0 --format json -o trivy-report.json $DOCKER_IMAGE:$TAG

                    if grep -q '"Vulnerabilities": \[' trivy-report.json; then
                        echo "⚠️ 보안 취약점 발견됨. 슬랙 알림 발송 중..."
                        curl -X POST -H 'Content-type: application/json' \
                          --data '{"text":"🚨 Trivy: 보안 취약점이 발견되었습니다! (이미지: $DOCKER_IMAGE:$TAG)"}' \
                          $SLACK_WEBHOOK_URL
                    else
                        echo "✅ 취약점 없음"
                    fi
                '''
            }
        }*/


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
        success {
            sh """
            curl -X POST -H 'Content-type: application/json' \
            --data '{"text":"✅ [Jenkins] Frontend-dev 빌드 성공"}' \
            ${SLACK_WEBHOOK_URL}
            """
        }
        failure {
            sh """
            curl -X POST -H 'Content-type: application/json' \
            --data '{"text":"❌ [Jenkins] Frontend-dev 빌드 실패"}' \
            ${SLACK_WEBHOOK_URL}
            """
        }
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
