Most popular tool for [[Containerization]].
Has its own cli and uses Dockerfile for steps on how to containerize.
Sometimes works along with [[Kubernetes]].

We use Dockerfile to create **image**, then this image can be run as a container.

Docker Desktop lets us do this on Windows.

## Docker Compose
CLI tool of Docker for quickly spinning up and tearing down multi-container apps:
- We give details in `docker-compose.yml`
- `docker compose up` starts everything
- `docker compose down` shuts down everything