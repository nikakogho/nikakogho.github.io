Also known as AFD.
[[Azure]] service that sits at front and reroutes to the right region and app instance and also acts as a cache, firewall, closest backend finder, all happening at the edge before hitting your server.
Global L7 [[Load Balancer]].

`User → Azure Front Door → Best Region → App`

## Global Load Balancing
User connects to closest edge location and gets rerouted to closest healthy server

## Acceleration
Uses [[Anycast Acceleration]].
0. User connects to nearby edge
1. This edge moves through Microsoft's private backbone to reach server
2. AFD maintains TCP + TLS sessions with backend

## Firewall
Blocks attacks like SQL injection and such

## CDN
Front door can cache static content of images, JS, CSS, Videos...

## Custom Domains
Automatic certificate management

## Health Checks
Auto checks backend health and if one region goes down traffic is auto rerouted to another

## Do NOT Use If
- If we need L7 (application layer) control
	- [[Azure Application Gateway]] is L7 load balancer and is better here, and is often what AFD redirects to per region like `AFD -> (region) Azure App Gateway -> VM / Container`
- If we need L4 (transport layer) control like port forwarding