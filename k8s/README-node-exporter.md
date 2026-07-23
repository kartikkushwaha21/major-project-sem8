# Node Exporter + Prometheus scraping (add-on)

This folder contains Kubernetes manifests to deploy **node-exporter** and update Prometheus scraping so Grafana dashboards like **Node Exporter Full** work.

## What’s currently missing
Your current Prometheus config (`k8s/prometheus.yaml`) scrapes only:
- `backend-service:4000`

So metrics like `node_cpu_seconds_total`, `node_memory_MemTotal_bytes`, etc. are absent.

## What these changes do
1. Deploy `node-exporter` as a **DaemonSet** (runs on every node).
2. Expose it via a ClusterIP Service.
3. Update Prometheus config to scrape `node-exporter:9100`.

## Files
- `k8s/node-exporter.yaml` : DaemonSet + Service
- `k8s/prometheus-node-exporter-configmap.yaml` : updated ConfigMap

Apply order:
```bash
kubectl apply -f k8s/node-exporter.yaml
kubectl apply -f k8s/prometheus-node-exporter-configmap.yaml
kubectl -n eduelevate rollout restart deployment/prometheus
```

## Quick validation
Port-forward Prometheus:
```bash
kubectl -n eduelevate port-forward service/prometheus-service 9092:9090
```
Open http://localhost:9092
Then in Prometheus UI run:
```promql
node_cpu_seconds_total
```

