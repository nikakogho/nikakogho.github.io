Framework for building robot apps

Core parts are nodes, topics, master, services, parameter server and ActionLib

## Nodes
Processes that run and do one task like sensor processing or control

## Topics
For async talking
Channels through which nodes send and receive **messages**

## ROS Master
Keeps track of nodes and lets them find each other when setting up topics and services

## Services
For synchronous talking of request-response between nodes
One node offers a service and another can send request to it and wait for reply

## Parameter Server
Shared dictionary on network accessible from APIs that stores configs

## ActionLib
Combines ideas of topics and services to give cancellable tasks