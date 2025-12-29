[[Containerization|Container]] management app for complicated distributed setups.
Has control plane (master node) and data plane (worker nodes).
Your app runs in a pod in a worker node.
![kubernetes_architecture_brief.png](kubernetes_architecture_brief.png)

Pods are grouped with **Deployments** for scaling + self-healing and exposed via **Services**.
**Cluster** has a master node (can be one or multiple machines) managing worker nodes, running health-checks, auto-scaling.

We describe what we want in architecture in YAML and Kubernetes acts real-time to match it.

## etcd

Distributed key-value DB storing cluster state

## kubectl

CLI tool for Kubernetes.
Uses config file from `.kube/config`

Basic commands:

```
kubectl get pods
kubectl get nodes
kubectl get services
kubectl get deployments
kubectl get all
```
