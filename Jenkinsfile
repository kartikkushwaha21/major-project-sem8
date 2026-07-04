pipeline {
    agent any

    triggers {
        // This polls SCM every minute as a backup to the Webhook
        pollSCM('* * * * *')
    }

    environment {
        DOCKER_HUB_REPO = 'kartik2111/ed'
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                script {
                    dir('backend') {
                        bat "docker build -t ${DOCKER_HUB_REPO}:backend ."
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    dir('frontend') {
                        bat "docker build -t ${DOCKER_HUB_REPO}:frontend ."
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        // bat "docker login -u ${DOCKER_USER} -p ${DOCKER_PASS}"
                        bat '''
                        echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                        '''
                        bat "docker push ${DOCKER_HUB_REPO}:backend"
                        bat "docker push ${DOCKER_HUB_REPO}:frontend"
                    }
                }
            }
        }
        stage('Kubernetes Test') {
            steps {
                bat 'kubectl config current-context'
                bat 'kubectl get nodes'
    }
}

        stage('Deploy to Kubernetes') {
            steps {
                bat "kubectl apply -f k8s/namespace.yaml"
                bat "kubectl apply -f k8s/secrets.yaml"
                bat "kubectl apply -f k8s/mongodb.yaml"
                bat "kubectl apply -f k8s/backend.yaml"
                bat "kubectl apply -f k8s/frontend.yaml"
            }
        }
    }

    post {
        always {
            bat "docker logout"
        }
    }
}
