#!/bin/bash

fuser -k 3333/udp
fuser -k 3334/udp
fuser -k 3335/udp
fuser -k 8080/tcp
sleep 2
node server.js &
pd -nogui -noadc -rt -blocksize 512 ./pd/main.pd
