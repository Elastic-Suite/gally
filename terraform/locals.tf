locals {
  gally_project_name                     = "${lower(var.gally_prefix)}${title(var.project_name)}"
  resource_group_name                    = "${local.gally_project_name}-rg"
  vnet_name                              = "${local.gally_project_name}-vnet"
  log_analytics_workspace_name           = "${local.gally_project_name}-law"
  container_app_env_name                 = "${local.gally_project_name}-cae"
  storage_account_name                   = lower("${local.gally_project_name}SA")
  container_app_environment_storage_name = lower("${local.gally_project_name}-caes")
  container_registry_name                = "${local.gally_project_name}Registry"
  #todo add /gally/ on image name between the login url and image name
  image_name         = "${azurerm_container_registry.cr.login_server}/gally/${var.gally_prefix}-%s:${var.gally_version}"
  container_name     = lower("${local.gally_project_name}-%s-ca")
  container_name_web = format(local.container_name, "web")

  docker_images_to_push = {
    varnish = {
      label   = "varnish"
      context = "../docker/varnish"
    }
    router = {
      label   = "router"
      context = "../docker/router"
    }
    php = {
      label   = "php"
      context = "../api"
      target  = "gally_php_prod"
      build_args = {
        COMPOSER_AUTH = var.composer_auth
      }
    }
    pwa = {
      label   = "pwa"
      context = "../front"
      target  = "gally_pwa_prod"
      build_args = {
        #   NEXT_PUBLIC_ENTRYPOINT       = null
        #   NEXT_PUBLIC_API_URL          = null
        NEXT_PUBLIC_API_ROUTE_PREFIX = var.router.api_prefix
        #   REACT_APP_API_URL            = null
      }
    }
    search = {
      label   = "search"
      context = "../docker/search"
      target  = "gally_opensearch2"
    }
    #     search-ml = {
    #       label      = "search-ml"
    #       context    = "../docker/search/"
    #       target     = "gally_opensearch2"
    #       build_args = {}
    #     }

  }
  containers = {
    database = {
      label        = var.containers.database.label
      name         = format(local.container_name, var.containers.database.label)
      image        = "postgres:16-alpine" #todo ajouter dans une variable
      exposed_port = var.containers.database.exposed_port
      target_port  = var.containers.database.target_port
      service      = "${format(local.container_name, var.containers.database.label)}:${var.containers.database.exposed_port}"
    }
    redis = {
      label        = var.containers.redis.label
      name         = format(local.container_name, var.containers.redis.label)
      service      = "${format(local.container_name, var.containers.redis.label)}:${var.containers.redis.exposed_port}"
      image        = "docker.io/bitnami/redis:6.2" #todo ajouter dans une variable
      exposed_port = var.containers.redis.exposed_port
      target_port  = var.containers.redis.target_port
    }
    search = {
      label        = var.containers.search.label
      name         = format(local.container_name, var.containers.search.label)
      service      = "${format(local.container_name, var.containers.search.label)}:${var.containers.search.exposed_port}"
      image        = format(local.image_name, local.docker_images_to_push.search.label)
      exposed_port = var.containers.search.exposed_port
      target_port  = var.containers.search.target_port
    }
    #     search-ml = {
    #       label        = var.containers.search-ml.label
    #       name         = format(local.container_name, var.containers.search-ml.label)
    #       service      = "${format(local.container_name, var.containers.search-ml.label)}:${var.containers.search-ml.exposed_port}"
    #       image        = format(local.image_name, local.docker_images_to_push.search-ml.label)
    #       exposed_port = var.containers.search-ml.exposed_port
    #       target_port  = var.containers.search-ml.target_port
    #     }
    pwa = {
      label        = var.containers.pwa.label
      name         = format(local.container_name, var.containers.pwa.label)
      service      = "${format(local.container_name, var.containers.pwa.label)}:${var.containers.pwa.exposed_port}"
      image        = format(local.image_name, local.docker_images_to_push.pwa.label)
      exposed_port = var.containers.pwa.exposed_port
      target_port  = var.containers.pwa.target_port
    }
    php = {
      label        = var.containers.php.label
      name         = format(local.container_name, var.containers.php.label)
      service      = "${local.container_name_web}:${var.containers.php.exposed_port}"
      image        = format(local.image_name, local.docker_images_to_push.php.label)
      exposed_port = var.containers.php.exposed_port
      target_port  = var.containers.php.target_port
    }
    router = {
      label        = var.containers.router.label
      name         = format(local.container_name, var.containers.router.label)
      service      = "${local.container_name_web}:${var.containers.router.exposed_port}"
      image        = format(local.image_name, local.docker_images_to_push.router.label)
      exposed_port = var.containers.router.exposed_port
      target_port  = var.containers.router.target_port
    }
    varnish = {
      label        = var.containers.varnish.label
      name         = format(local.container_name, var.containers.varnish.label)
      service      = "${format(local.container_name, var.containers.varnish.label)}:${var.containers.varnish.tcp_port}"
      image        = format(local.image_name, local.docker_images_to_push.varnish.label)
      exposed_port = var.containers.varnish.exposed_port
      target_port  = var.containers.varnish.target_port
      tcp_port     = var.containers.varnish.tcp_port
    }
  }
}
