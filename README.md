# MathUtils.js

A lightweight JavaScript utility library providing basic math functions for arrays of numbers, including sum, average, min, max, and prime number checking.

## Features
- Calculate sum and average of number arrays
- Find minimum and maximum values
- Check if a number is prime

## Usage
Import the desired functions from the module and call them with the appropriate number or numeric array inputs.

## Architecture Overview

At a high level, the pipeline implements the following flow: [file:173][file:174]

1. Developer pushes code to GitHub (any branch, especially `main`). [file:173]  
2. GitHub Actions workflow `trivySC2.yml` runs: tests, Trivy scans, Docker build, image scan, push to Docker Hub. [file:173][file:174]  
3. The same workflow then updates the ECS task definition and deploys a new revision of the **MathUtilsApp-Service** service in the **Mathutils** ECS cluster on Fargate. [file:173][file:174]  
4. ECS tasks send logs and metrics to Amazon CloudWatch for observability. [file:174]  

The image naming convention is: anacarolr/task3-app:<GITHUB_SHA>


Each tag corresponds to a specific commit, providing traceability between code and running containers. [file:173][file:174]

---

## Project Structure

Key files and folders: [file:174]

- `MathUtils.js` – core math utility functions (sum, average, min, max, isPrime), used by the app and tests. [file:23][file:174]  
- `test2.js` – simple Node.js script that imports `MathUtils.js` and exercises its functions, used in the CI pipeline as a basic functional test. [file:121][file:173]  
- `Dockerfile` – builds the Node.js application image, exposes port 3000. [file:174]  
- `.github/workflows/trivySC2.yml` – main CI/CD pipeline described below. [file:173]  

There is also an ECS task definition family named **MathUtilsApp** in AWS, which is dynamically downloaded and updated by the workflow during deployment. [file:173][file:174]

---

## GitHub Actions Pipeline (`trivySC2.yml`)

The workflow is defined in `.github/workflows/trivySC2.yml` and is named **GitHub Actions Pipeline Math Utils App**. [file:173] It runs on:

- `push` to any branch (`'**'`)  
- `pull_request` events  

### Environment configuration

The following environment variables are defined at the workflow level: [file:173]

- `AWS_REGION=us-east-1` – AWS region where ECS runs.  
- `ECS_SERVICE=MathUtilsApp-Service` – ECS service name.  
- `ECS_CLUSTER=Mathutils` – ECS cluster name.  
- `ECS_TASK_DEFINITION=MathUtilsApp` – ECS task definition family to update.  
- `CONTAINER_NAME=App` – container name inside `containerDefinitions` in the task definition JSON.  
- `DOCKERHUB_USERNAME=anacarolr` – Docker Hub username.  

Secrets required in the repo: [file:173][file:174]

- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` – for ECS and CloudWatch access.  
- `AWS_REGION` (optional duplicate of env) – region configuration.  
- `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN` – to authenticate to Docker Hub.  

### Step‑by‑step pipeline

The `pipeline` job runs on `ubuntu-latest` and executes the following numbered steps. [file:173]

1. **Checkout code**  
   - Uses `actions/checkout@v4` to download the repository contents. [file:173]

2. **Set up Node.js**  
   - Uses `actions/setup-node@v4` with `node-version: '20'` to prepare the Node runtime. [file:173]

3. **Install dependencies**  
   - Runs `npm install` when a `package.json` is present. [file:173][file:174]

4. **Run MathUtils test script**  
   - Executes `node test2.js` to exercise the utility functions and confirm basic behaviour. [file:173][file:121]

5. **Trivy filesystem scan (source code)**  
   - Uses `aquasecurity/trivy-action@master` with `scan-type: 'fs'` and `scan-ref: '.'`.  
   - Reports `HIGH` and `CRITICAL` vulnerabilities found in the repository. [file:173][file:174]

6. **Build Docker image**  
   - Runs `docker build -t $DOCKERHUB_USERNAME/task3-app:${GITHUB_SHA} .`.  
   - Produces a commit‑tagged image, e.g. `anacarolr/task3-app:bfff21b5dc35ff8ce388cc4d8c5f520d60ae34c6`. [file:173][file:174]

7. **Trivy image scan (container)**  
   - Scans the built image with Trivy using `scan-type: 'image'` and the same image reference. [file:173][file:174]

8. **Login to Docker Hub**  
   - Uses `docker/login-action@v3` with `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`. [file:173][file:174]

9. **Push Docker image to Docker Hub**  
   - Runs `docker push $DOCKERHUB_USERNAME/task3-app:${GITHUB_SHA}`. [file:173][file:174]

10. **Configure AWS credentials**  
    - Uses `aws-actions/configure-aws-credentials@v1` with the AWS secrets and region. [file:173][file:25]

11. **Download current ECS task definition**  
    - Calls `aws ecs describe-task-definition --task-definition MathUtilsApp --query taskDefinition > task-definition-raw.json`.  
    - Captures the existing ECS configuration (CPU, memory, logs, container defs, etc.). [file:173][file:174]

12. **Clean task definition JSON**  
    - Uses `jq` to remove metadata fields that the `RegisterTaskDefinition` API cannot accept (e.g. `compatibilities`, `taskDefinitionArn`, `revision`, `status`, `registeredAt`, `registeredBy`, `requiresAttributes`, `enableFaultInjection`). [file:173][web:159]  
    - Writes cleaned JSON to `task-definition.json`. [file:173]

13. **Render updated ECS task definition**  
    - Uses `aws-actions/amazon-ecs-render-task-definition@v1`.  
    - Inputs: `task-definition: task-definition.json`, `container-name: App`, `image: anacarolr/task3-app:${GITHUB_SHA}`.  
    - Produces a new task definition revision referencing the Docker Hub image. [file:173][web:132]

14. **Deploy task definition to ECS Fargate**  
    - Uses `aws-actions/amazon-ecs-deploy-task-definition@v1`.  
    - Updates `MathUtilsApp-Service` in cluster `Mathutils` to use the new task definition.  
    - Waits for service stability before completing. [file:173][file:174]

If any step fails (tests, scans, build, push, or deployment), the workflow stops and the failure is visible in the GitHub Actions UI. [file:173][file:174]

---

## Running the App Locally

You can run the Math Utils App locally using Node or Docker. [file:174]

### Prerequisites

- Node.js 20+  
- Docker (for containerised runs)  

### Using Node directly

git clone https://github.com/aanacarolr/Task3.git cd Task3
Install dependencies (if package.json exists)
npm install
Run the test script
node test2.js
Run the main app (example, adjust if you have a dedicated server file)
node index.js


The app listens on port `3000`, and you can access it in a browser or via `curl` at:

http://localhost:3000


### Using Docker

Pull and run a built image from Docker Hub: [file:174]

docker pull anacarolr/task3-app:bfff21b5dc35ff8ce388cc4d8c5f520d60ae34c6 docker run -p 3000:3000 anacarolr/task3-app:bfff21b5dc35ff8ce388cc4d8c5f520d60ae34c6


Then open `http://localhost:3000` in a browser to interact with the app. [file:174]

---

## ECS Fargate Deployment

The ECS Fargate stack consists of: [file:174]

- **Cluster**: `Mathutils`  
- **Service**: `MathUtilsApp-Service` (Fargate launch type)  
- **Task definition family**: `MathUtilsApp`  
- **Container**: `App`, image `anacarolr/task3-app:<GITHUB_SHA>`, port `3000`, log driver `awslogs`.  

The GitHub Actions workflow automatically updates the task definition and redeploys the service whenever changes are pushed and the pipeline succeeds. [file:173][file:174]

---

## Observability

Logs and metrics are sent to **Amazon CloudWatch**: [file:174]

- Log group: `/ecs/MathUtilsApp` (configured via `awslogs` log driver).  
- Metrics: ECS service CPU and memory utilisation, running tasks, and other standard ECS metrics.  

These can be used to troubleshoot issues and verify that the latest deployment is healthy. [file:174]

---

## Future Improvements

Some potential enhancements for this project include: [file:174]

- Adding Jest unit tests in addition to the current `test2.js` script.  
- Managing ECS and networking with Terraform for full infrastructure‑as‑code.  
- Implementing blue/green or canary deployments and automated rollback based on health checks.  
- Creating CloudWatch alarms and dashboards for more advanced monitoring.  


