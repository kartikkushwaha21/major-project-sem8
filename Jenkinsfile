pipeline {
    agent any

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
                        sh "docker build -t ${DOCKER_HUB_REPO}:backend ."
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    dir('frontend') {
                        sh "docker build -t ${DOCKER_HUB_REPO}:frontend . "
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh "docker login -u ${DOCKER_USER} -p ${DOCKER_PASS}"
                        sh "docker push ${DOCKER_HUB_REPO}:backend"
                        sh "docker push ${DOCKER_HUB_REPO}:frontend"
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // This assumes kubectl is configured on the Jenkins agent
                    sh "kubectl apply -f k8s/namespace.yaml"
                    sh "kubectl apply -f k8s/secrets.yaml"
                    sh "kubectl apply -f k8s/mongodb.yaml"
                    sh "kubectl apply -f k8s/backend.yaml"
                    sh "kubectl apply -f k8s/frontend.yaml"
                }
            }
        }
    }

    post {
        always {
            sh "docker logout"
        }
    }
}
