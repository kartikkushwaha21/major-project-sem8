# EduElevate (LEARN & IMPROVE)

Full-stack educational platform for course creation, enrollment, payments (Razorpay), progress tracking, and more — containerized with Docker, orchestrated with Kubernetes, automated with Jenkins CI/CD, and monitored with Prometheus & Grafana.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Quick Start (Local Development)](#quick-start-local-development)
- [🐳 Docker](#-docker)
- [☸️ Kubernetes](#️-kubernetes)
- [🔧 CI/CD with Jenkins](#-cicd-with-jenkins)
- [📊 Monitoring (Prometheus & Grafana)](#-monitoring-prometheus--grafana)
- [📈 Node Exporter & Kube State Metrics](#-node-exporter--kube-state-metrics)
- [🔑 Environment Variables & Secrets](#-environment-variables--secrets)
- [🛠️ Troubleshooting](#️-troubleshooting)

---

## Tech Stack

| Layer       | Technology                                                              |
|-------------|-------------------------------------------------------------------------|
| **Backend** | Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Cloudinary, Razorpay, Nodemailer |
| **Frontend**| React, Redux Toolkit, Tailwind CSS, React Router, Axios, Chart.js       |
| **Container**| Docker, Docker Compose                                                  |
| **Orchestration** | Kubernetes (K8s)                                                   |
| **CI/CD**   | Jenkins (Pipeline as Code)                                              |
| **Monitoring** | Prometheus, Grafana, Node Exporter, kube-state-metrics                |

---

## Features

- User authentication with OTP verification & password reset
- Course creation & management (CRUD)
- Course enrollment with Razorpay payment gateway
- Course progress tracking
- Ratings & reviews system
- Instructor & Student dashboards
- File uploads via Cloudinary
- Email notifications (Nodemailer)
- Contact form submissions
- **Docker containerization** (backend + frontend)
- **Kubernetes deployment** (scalable microservices)
- **Jenkins CI/CD pipeline** (automated build, push, deploy)
- **Prometheus monitoring** (metrics scraping)
- **Grafana dashboards** (visual monitoring)

---

## Quick Start (Local Development)

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Git

### Backend

```bash
cd backend
npm install
npm start
```

Server runs on **http://localhost:4000** (or the PORT configured in `.env`)

### Frontend

```bash
cd frontend
npm install
npm start
```

App runs on **http://localhost:3000**

> **Note:** Create `.env` files in both `backend/` and `frontend/` directories. See [development_log.md](development_log.md) for required environment variables.

---

## 🐳 Docker

This project is fully containerized. Both backend and frontend have their own `Dockerfile`.

### View Running Containers

```bash
docker ps
```

### View All Containers (Including Stopped)

```bash
docker ps -a
```

### View Docker Images

```bash
docker images
```

### Build Docker Images Manually

#### Backend

```bash
cd backend
docker build -t kartik2111/ed:backend .
```

#### Frontend

```bash
cd frontend
docker build -t kartik2111/ed:frontend .
```

### Run Containers Locally

#### Backend

```bash
docker run -d -p 4000:4000 --name ed-backend kartik2111/ed:backend
```

#### Frontend

```bash
docker run -d -p 3000:80 --name ed-frontend kartik2111/ed:frontend
```

### Push Images to Docker Hub

```bash
docker login
docker push kartik2111/ed:backend
docker push kartik2111/ed:frontend
```

### Docker Image Details

| Service   | Base Image    | Exposed Port | Dockerfile Location         |
|-----------|---------------|-------------|-----------------------------|
| Backend   | node:18-alpine| 4000        | `backend/Dockerfile`        |
| Frontend  | node:18-alpine (build) → nginx:alpine (serve) | 80 | `frontend/Dockerfile` |

---

## ☸️ Kubernetes

All Kubernetes manifests are located in the `k8s/` directory.

### Enable Kubernetes (Docker Desktop)

1. Open Docker Desktop Settings
2. Go to **Kubernetes** tab
3. Check **Enable Kubernetes**
4. Click **Apply & Restart**

### Deploy the Entire Project

From the `major-project-sem8` directory, run:

```bash
kubectl apply -f k8s/
```

This applies all manifests in the correct order (namespace, secrets, MongoDB, backend, frontend, monitoring).

### Deploy Individual Components

```bash
# Namespace
kubectl apply -f k8s/namespace.yaml

# Secrets
kubectl apply -f k8s/secrets.yaml

# Database
kubectl apply -f k8s/mongodb.yaml

# Backend
kubectl apply -f k8s/backend.yaml

# Frontend
kubectl apply -f k8s/frontend.yaml
```

### Check Resource Status

```bash
# View all resources in the namespace
kubectl get all -n eduelevate

# View pods
kubectl get pods -n eduelevate

# View services
kubectl get svc -n eduelevate

# View deployments
kubectl get deploy -n eduelevate
```

### View Logs

```bash
# Backend logs
kubectl logs -l app=backend -n eduelevate

# Frontend logs
kubectl logs -l app=frontend -n eduelevate

# MongoDB logs
kubectl logs -l app=mongodb -n eduelevate
```

### Access the Application

| Service          | NodePort | URL                           |
|------------------|----------|-------------------------------|
| **Frontend**     | 30000    | http://localhost:30000        |
| **Backend API**  | 30001    | http://localhost:30001        |

### Kubernetes Resource Summary

| Manifest File                | Resource Type         | Description                          |
|-----------------------------|----------------------|--------------------------------------|
| `k8s/namespace.yaml`         | Namespace            | `eduelevate` namespace               |
| `k8s/secrets.yaml`           | Secret               | JWT, Razorpay, Cloudinary, Mail creds |
| `k8s/mongodb.yaml`           | Deployment + Service | MongoDB database                     |
| `k8s/backend.yaml`           | Deployment + Service | Node.js backend API (NodePort: 30001)|
| `k8s/frontend.yaml`          | Deployment + Service | React frontend (NodePort: 30000)     |
| `k8s/prometheus.yaml`        | ConfigMap + Deployment + Service | Prometheus monitoring (NodePort: 30090) |
| `k8s/grafana.yaml`           | Deployment + Service | Grafana dashboards (NodePort: 30092) |
| `k8s/node-exporter.yaml`     | DaemonSet + Service  | Node-level metrics exporter          |
| `k8s/kube-state-metrics.yaml"| Deployment + Service | Kubernetes cluster state metrics     |
| `k8s/kube-state-metrics-rbac.yaml` | ServiceAccount + ClusterRole + ClusterRoleBinding | RBAC for kube-state-metrics |
| `k8s/prometheus-node-exporter-configmap.yaml` | ConfigMap | Updated Prometheus config including node-exporter & kube-state-metrics |

### Kubernetes Dashboard (Optional)

#### Install the Dashboard

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml
```

#### Access the Dashboard

```bash
kubectl proxy
```

Then open: http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/

#### Get Login Token

```bash
kubectl -n kubernetes-dashboard create token admin-user
```

> **Note:** You may need to create the `admin-user` ServiceAccount first.

---

## 🔧 CI/CD with Jenkins

The project includes a complete CI/CD pipeline defined in the `Jenkinsfile` at the project root.

### Pipeline Stages

1. **Checkout** — Pulls latest code from the Git repository
2. **Build Backend** — Builds Docker image `kartik2111/ed:backend`
3. **Build Frontend** — Builds Docker image `kartik2111/ed:frontend`
4. **Push to Docker Hub** — Logs in and pushes both images
5. **Kubernetes Test** — Verifies kubectl context and node status
6. **Deploy to Kubernetes** — Applies all k8s manifests (namespace, secrets, MongoDB, backend, frontend)

### Step 1: Install Required Jenkins Plugins

Go to **Manage Jenkins** → **Plugins** → **Available Plugins** and install:

- **Git** — For Git SCM support
- **Docker Pipeline** — For Docker commands in the Jenkinsfile
- **Pipeline** — Core pipeline support

> **Important:** After installing the Git plugin, check **"Restart Jenkins when installation is complete"** for the Git option to appear in the SCM dropdown.

### Step 2: Configure Docker Hub Credentials in Jenkins

1. Go to **Manage Jenkins** → **Credentials** → **System** → **Global credentials (unrestricted)**
2. Click **Add Credentials**
3. Set:
   - **Kind**: Username with password
   - **Username**: `kartik2111` (your Docker Hub username)
   - **Password**: Your Docker Hub password or Personal Access Token
   - **ID**: `docker-hub-credentials` (⚠️ **Must match exactly** with the Jenkinsfile)
   - **Description**: `Docker Hub Login`
4. Click **Create**

### Step 3: Create the Pipeline Job

1. From Jenkins home page, click **New Item**
2. **Enter name**: `EduElevate-Full-Stack`
3. **Select**: `Pipeline` → Click **OK**
4. **Build Triggers (Optional)**: Check `GitHub hook trigger for GITScm polling` for automatic builds
5. **Pipeline Section**:
   - **Definition**: `Pipeline script from SCM`
   - **SCM**: `Git`
   - **Repository URL**: `https://github.com/your-username/ed.git`
   - **Branch Specifier**: `*/main` (or `*/master`)
   - **Script Path**: `Jenkinsfile`
6. Click **Save**

### Step 4: Run the Pipeline

1. Click **Build Now**
2. Click on the build number (e.g., `#1`) to see **Console Output**
3. A green **Stage View** will show timing for each stage

### Step 5: Jenkins Permission Fix (Linux)

If Jenkins gets `permission denied` for Docker commands:

```bash
sudo usermod -aG docker jenkins
# Then restart Jenkins
```

> **Windows:** Ensure the Jenkins service user has permissions to the Docker pipe.

---

## 📊 Monitoring (Prometheus & Grafana)

### Prometheus

Prometheus is deployed in the `eduelevate` namespace with a custom configuration that scrapes:

- **Backend API**: `backend-service:4000`
- **Node Exporter**: `node-exporter:9100`
- **Kube State Metrics**: `kube-state-metrics:8080`

#### Access Prometheus UI

```bash
# Port-forward to localhost
kubectl -n eduelevate port-forward service/prometheus-service 9092:9090
```

Open **http://localhost:9092** in your browser.

#### Run PromQL Queries

In the Prometheus UI, go to the **Graph** tab and run queries like:

```promql
# Backend request duration (if available)
rate(http_request_duration_seconds_sum[5m])

# Memory usage
process_resident_memory_bytes{job="eduelevate-backend"}

# CPU usage
rate(process_cpu_seconds_total{job="eduelevate-backend"}[1m])
```

#### Prometheus Configuration

The Prometheus config is defined in a ConfigMap at `k8s/prometheus.yaml`. To update the scrape configuration:

1. Edit the ConfigMap
2. Apply with `kubectl apply -f k8s/prometheus.yaml`
3. Restart the deployment: `kubectl -n eduelevate rollout restart deployment/prometheus`

#### Prometheus Resource Details

| Item                   | Detail                              |
|------------------------|-------------------------------------|
| Image                  | `prom/prometheus:latest`            |
| Port                   | 9090                                |
| NodePort               | 30090                               |
| Scrape Interval        | 15s                                 |
| Config File            | `k8s/prometheus.yaml`               |

### Grafana

Grafana is deployed for visualizing metrics collected by Prometheus.

#### Access Grafana

```bash
# Port-forward to localhost
kubectl -n eduelevate port-forward service/grafana-service 3003:3002
```

Or access directly via NodePort: **http://localhost:30092**

#### Login Credentials

| Field     | Value   |
|-----------|---------|
| Username  | `admin` |
| Password  | `admin` |

> **Note:** After first login, Grafana will prompt you to change the password.

#### Connect Prometheus as a Data Source

1. Log in to Grafana
2. Go to **Configuration** → **Data Sources** → **Add data source**
3. Select **Prometheus**
4. Set **URL**: `http://prometheus-service:9090` (internal Kubernetes DNS) or `http://localhost:9092` (if port-forwarding)
5. Click **Save & Test**

#### Import Dashboards

1. Go to **+** → **Import**
2. Enter a dashboard ID from [Grafana Dashboards](https://grafana.com/grafana/dashboards/):

| Dashboard Name              | ID  |
|-----------------------------|-----|
| Node Exporter Full          | 1860|
| Prometheus 2.0 Stats        | 3662|
| Kubernetes Cluster Monitoring | 315  |

3. Select the Prometheus data source
4. Click **Import**

#### Grafana Resource Details

| Item                   | Detail                              |
|------------------------|-------------------------------------|
| Image                  | `grafana/grafana:latest`            |
| Internal Port          | 3000                                |
| NodePort               | 30092                               |
| Default Admin Password | `admin`                             |
| Manifest File          | `k8s/grafana.yaml`                  |

---

## 📈 Node Exporter & Kube State Metrics

### Node Exporter

Node Exporter runs as a **DaemonSet** (one pod per node) and exposes hardware/OS metrics.

#### Deploy Node Exporter

```bash
kubectl apply -f k8s/node-exporter.yaml
```

#### Verify Node Exporter is Running

```bash
kubectl get pods -n eduelevate -l app=node-exporter
```

#### Update Prometheus to Scrape Node Exporter

The `k8s/prometheus-node-exporter-configmap.yaml` contains an updated Prometheus config that scrapes `node-exporter:9100`. Apply it:

```bash
kubectl apply -f k8s/prometheus-node-exporter-configmap.yaml
kubectl -n eduelevate rollout restart deployment/prometheus
```

#### Useful Node Exporter PromQL Queries

```promql
# CPU usage per node
100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Memory usage per node
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100

# Disk usage
(node_filesystem_size_bytes{mountpoint="/"} - node_filesystem_free_bytes{mountpoint="/"}) / node_filesystem_size_bytes{mountpoint="/"} * 100

# Network I/O
rate(node_network_receive_bytes_total[5m])
```

### Kube State Metrics

Kube State Metrics generates metrics about the state of Kubernetes objects (deployments, pods, nodes, etc.).

#### Deploy Kube State Metrics

```bash
# First apply RBAC
kubectl apply -f k8s/kube-state-metrics-rbac.yaml

# Then deploy the service
kubectl apply -f k8s/kube-state-metrics.yaml
```

#### Verify Kube State Metrics

```bash
kubectl get pods -n eduelevate -l app=kube-state-metrics
```

#### Update Prometheus Config (if not already done)

Apply the comprehensive configmap that includes kube-state-metrics:

```bash
kubectl apply -f k8s/kube-prometheus-additional-configmap.yaml
kubectl -n eduelevate rollout restart deployment/prometheus
```

#### Useful Kube State Metrics PromQL Queries

```promql
# Number of deployments per namespace
count(kube_deployment_info) by (namespace)

# Pod status
sum(kube_pod_status_phase{phase="Running"}) by (namespace)

# Memory requests vs actual usage
sum(kube_pod_container_resource_requests{resource="memory"}) by (namespace)
```

### Quick Validation (All Monitoring Components)

```bash
# Port-forward Prometheus
kubectl -n eduelevate port-forward service/prometheus-service 9092:9090

# Port-forward Grafana
kubectl -n eduelevate port-forward service/grafana-service 3003:3002

# Check all pods are running
kubectl get pods -n eduelevate
```

Then open:
- **Prometheus**: http://localhost:9092
- **Grafana**: http://localhost:3003 (login: admin/admin)

---

## 🔑 Environment Variables & Secrets

### Local Development (.env files)

For local development, create `.env` files in `backend/` and `frontend/` directories. Required variables are documented in [development_log.md](development_log.md).

### Kubernetes Secrets

The `k8s/secrets.yaml` file contains the following secrets (configured via `stringData`):

| Secret Key       | Description                           |
|------------------|---------------------------------------|
| `JWT_SECRET`     | JWT signing secret                    |
| `RAZORPAY_KEY`   | Razorpay API key                      |
| `RAZORPAY_SECRET`| Razorpay API secret                   |
| `MAIL_USER`      | Gmail username for Nodemailer         |
| `MAIL_PASS`      | Gmail app password for Nodemailer     |
| `CLOUD_NAME`     | Cloudinary cloud name                 |
| `API_KEY`        | Cloudinary API key                    |
| `API_SECRET`     | Cloudinary API secret                 |

> **⚠️ Production Warning:** Update these values before deploying to production. The current values are for development/testing only.

To update secrets:

```bash
# Edit the secrets.yaml file with your values
kubectl apply -f k8s/secrets.yaml
```

---

## 🛠️ Troubleshooting

### Docker Issues

| Problem                          | Solution                                                       |
|----------------------------------|---------------------------------------------------------------|
| `docker: command not found`      | Install Docker Desktop from https://www.docker.com/products/docker-desktop/ |
| Permission denied (Linux)        | Run `sudo usermod -aG docker $USER` and log out/in            |
| Port already in use              | Change the port mapping, e.g., `-p 4001:4000`                 |

### Kubernetes Issues

| Problem                          | Solution                                                       |
|----------------------------------|---------------------------------------------------------------|
| `kubectl: command not found`     | Kubernetes CLI comes with Docker Desktop. Ensure it's enabled. |
| `ImagePullBackOff`               | Ensure images are pushed to Docker Hub and are public (or configure `imagePullSecrets`) |
| `CrashLoopBackOff`               | Check logs: `kubectl logs <pod-name> -n eduelevate`           |
| MongoDB connection failure       | Ensure MongoDB pod is running: `kubectl get pods -n eduelevate -l app=mongodb` |
| No resources found               | Ensure you're in the correct namespace: `kubectl get all -n eduelevate` |

### Jenkins Issues

| Problem                          | Solution                                                       |
|----------------------------------|---------------------------------------------------------------|
| Git option not showing in SCM    | Install Git plugin and restart Jenkins                        |
| `docker: command not found` in pipeline | Install Docker Pipeline plugin; ensure Docker is in Jenkins system PATH |
| Permission denied for Docker     | Add Jenkins user to docker group (Linux) or check Windows Docker pipe permissions |
| Credentials not found            | Ensure credential ID is exactly `docker-hub-credentials`      |

### Prometheus & Grafana Issues

| Problem                          | Solution                                                       |
|----------------------------------|---------------------------------------------------------------|
| Prometheus shows no targets      | Check ConfigMap: `kubectl describe configmap prometheus-config -n eduelevate` |
| Grafana can't connect to Prometheus | Ensure Prometheus service is running: `kubectl get svc -n eduelevate prometheus-service` |
| Node Exporter metrics not appearing | Verify Node Exporter pods: `kubectl get pods -n eduelevate -l app=node-exporter` |
| Grafana "invalid password"       | Default is `admin`/`admin`. If changed, delete the pod to reset: `kubectl delete pod -l app=grafana -n eduelevate` |

### General Debugging Commands

```bash
# Check all resources in the namespace
kubectl get all -n eduelevate

# Describe a failing pod
kubectl describe pod <pod-name> -n eduelevate

# Stream logs from a pod
kubectl logs -f <pod-name> -n eduelevate

# Execute a command inside a pod
kubectl exec -it <pod-name> -n eduelevate -- /bin/sh

# Port-forward a service for local access
kubectl port-forward service/<service-name> <local-port>:<service-port> -n eduelevate
```

---

## 📁 Project Structure

```
major-project-sem8/
├── backend/               # Node.js/Express backend
│   ├── config/            # DB, Cloudinary, Razorpay config
│   ├── controllers/       # Route handlers
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routes
│   ├── middlewares/       # Auth & other middlewares
│   ├── mail/              # Email templates
│   ├── utils/             # Helper utilities
│   ├── data/              # Seed data
│   ├── scripts/           # Seed scripts
│   ├── Dockerfile         # Backend container definition
│   └── index.js           # Server entry point
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── slices/        # Redux slices
│   │   ├── services/      # API calls
│   │   ├── hooks/         # Custom hooks
│   │   ├── data/          # Static data
│   │   └── utils/         # Utilities
│   ├── public/            # Static assets
│   ├── Dockerfile         # Frontend container (multi-stage)
│   └── package.json
├── k8s/                   # Kubernetes manifests
│   ├── namespace.yaml     # eduelevate namespace
│   ├── secrets.yaml       # Sensitive configs
│   ├── mongodb.yaml       # Database
│   ├── backend.yaml       # Backend API
│   ├── frontend.yaml      # Frontend UI
│   ├── prometheus.yaml    # Monitoring
│   ├── grafana.yaml       # Visualization
│   ├── node-exporter.yaml # Node metrics
│   └── kube-state-metrics.yaml  # Cluster metrics
├── Jenkinsfile            # CI/CD pipeline definition
├── DEPLOYMENT_GUIDE.md    # Detailed ops instructions
└── README.md              # This file
```

---

## 👨‍💻 Author

Built by **Kartik Kushwaha**

---

*For detailed development process and API docs, see [development_log.md](development_log.md). For step-by-step operational instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).*

