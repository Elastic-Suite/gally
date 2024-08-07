## Opensearch Docker Images

The Dockerfile adn configuration used to build the `gally_opensearch2_gpu` image come from https://github.com/opensearch-project/docker-images

We need to build a custom one in order to change the base image to nvidia/cuda in order to enable gpu acceleration.
