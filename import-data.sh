echo "Initializing replica set"
docker exec -ti $(docker ps -q -f name=mongo) /bin/bash -c "echo 'rs.initiate()' | mongo"
