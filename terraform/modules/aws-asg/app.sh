#!/bin/bash

# Ensure the script runs as root
sudo su

# Navigate to the application directory
cd /home/ubuntu/curata/backend

# Start the application using PM2
pm2 start
pm2 startup
pm2 save