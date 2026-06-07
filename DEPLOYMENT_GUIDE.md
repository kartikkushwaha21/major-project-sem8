# Deployment and Operations Guide

This guide provides step-by-step instructions on how to manage the Docker containers, Jenkins pipeline, and Kubernetes cluster for the EduElevate project.

## 1. Docker Operations

### See Running Containers
To see which containers are currently running on your machine:
```bash
docker ps
```

### See All Containers (including stopped ones)
```bash
docker ps -a
```

### See Docker Images
To see the images you have built (like `kartik2111/ed:backend`):
```bash
docker images
```

### Build Images Manually (Optional)
If you want to build without Jenkins:
```bash
# Backend
cd backend
docker build -t kartik2111/ed:backend .

# Frontend
cd ../frontend
docker build -t kartik2111/ed:frontend .
```

---

## 2. Jenkins Complete Setup Guide

This section covers everything from initial Jenkins configuration to running your first pipeline.

### Step 1: Install Necessary Plugins (If "Git" option is missing)
If you do not see the **Git** option in the SCM dropdown, you must install the Git plugin:
1. Go to **Manage Jenkins** -> **Plugins** -> **Available Plugins**.
2. Search for **"Git"**.
3. Check the box for the **Git** plugin and click **Install**.
4. **IMPORTANT**: Check the box **"Restart Jenkins when installation is complete"**. Jenkins will not show the Git option until it restarts.
5. Also ensure these are installed:
   - **Docker Pipeline** (For `docker` commands in Jenkinsfile)
   - **Pipeline** (Core pipeline support)

### Step 2: Configure Docker Hub Credentials
1. Navigate to **Manage Jenkins** -> **Credentials** -> **System** -> **Global credentials (unrestricted)**.
2. Click **Add Credentials**.
3. **Kind**: Username with password.
4. **Username**: `kartik2111` (Your Docker Hub ID).
5. **Password**: Your Docker Hub Password or Personal Access Token.
6. **ID**: `docker-hub-credentials` (**IMPORTANT**: This MUST match exactly what is in the Jenkinsfile).
7. **Description**: `Docker Hub Login`.
8. Click **Create**.

### Step 3: Configure Global Tools (If needed)
If Jenkins can't find `docker` or `git`, go to **Manage Jenkins** -> **Global Tool Configuration**:
- **Docker**: Add Docker installations if not picked up from the system path.
- **Git**: Ensure the path to the Git executable is correct.

### Step 4: Create the Pipeline Job
1. From the Jenkins home page, click **New Item**.
2. **Enter Name**: `EduElevate-Full-Stack`.
3. **Select**: `Pipeline` and click **OK**.
4. **Build Triggers (Optional)**: Check `GitHub hook trigger for GITScm polling` if you want automatic builds on every code push.
5. **Pipeline Section**:
   - **Definition**: `Pipeline script from SCM`.
   - **SCM**: `Git`.
   - **Repository URL**: Enter your GitHub repo URL (e.g., `https://github.com/your-username/ed.git`).
   - **Branch Specifier**: `*/main` or `*/master`.
   - **Script Path**: `Jenkinsfile` (Ensure this is correct relative to the repo root).
6. Click **Save**.

### Step 5: Troubleshooting Jenkins Permissions
If you get a `permission denied` error when Jenkins tries to run Docker commands:
- **Windows**: Ensure the user running Jenkins has permissions to the Docker pipe.
- **Linux**: Run `sudo usermod -aG docker jenkins` and restart Jenkins.

### Step 6: Running the Build
1. Click **Build Now**.
2. Click on the build number (e.g., `#1`) to see the **Console Output**.
3. Once finished, you will see a green **Stage View** showing the timing for build, push, and deploy.

---

## 3. Kubernetes Operations

### Enable Kubernetes (Docker Desktop)
1. Open Docker Desktop Settings.
2. Go to **Kubernetes** tab.
3. Check **Enable Kubernetes** and click **Apply & Restart**.

### Deploy the Project
Run this command from the `major-project-sem8` directory:
```powershell
kubectl apply -f k8s/
```

### Check Resources
```powershell
# See everything in the namespace
kubectl get all -n eduelevate

# See logs for the backend
kubectl logs -l app=backend -n eduelevate
```

### Accessing the App
- **Frontend**: [http://localhost:30000](http://localhost:30000)
- **Backend API**: [http://localhost:30001](http://localhost:30001)

---

## 4. Kubernetes Dashboard

### Install the Dashboard
If you don't have it installed:
```powershell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml
```

### Access the Dashboard
1. Run the proxy:
   ```powershell
   kubectl proxy
   ```
2. Open this URL:
   [http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/](http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/)

### Get Login Token
1. Create a sample user (or use existing ones).
2. Run this to get a token:
   ```powershell
   kubectl -n kubernetes-dashboard create token admin-user
   ```
   (Note: You may need to create the `admin-user` ServiceAccount first).

---

## Troubleshooting
- **Pod Status**: If a pod is `ImagePullBackOff`, ensure you have pushed the images to Docker Hub and they are public (or configured ImagePullSecrets).
- **Database Connection**: The backend is configured to connect to `mongodb-service:27017`. Ensure the MongoDB pod is running.
