Single IP address accelerates access from anywhere (many servers across the world share this one IP).

Used by [[Azure Front Door]] as:
0. User connects to nearby edge with this IP
1. This edge moves through Microsoft's private backbone to reach server
2. AFD maintains TCP + TLS sessions with backend
