#!/bin/bash
localpath=`pwd`
echo "Running git pull on $localpath"
#stash the local changes
git stash
#pull the repo of master branch from origin
git pull origin master 
#add your own script here for server restart options