# general todo:
# purge varnish not working when we launch  .bin/console h:f:l
# https not working
# add managed service for redis and postgres
# move the tfstate in secure place and then remove it from .gitignore ?
# what is the difference between "Consumption" and "Workload profiles" for Azure Container Apps ?
# when we try to create a new version on an azure container app  the new container is stick on the status activating (is it because the php container is corrupted ?t)
# manage dependencies between resource
# At the first terraform apply there is an error about the fact that the docker images not exist, even if the images have been pushed in the registry, it's just an latency error relaunch the apply, this error should be managed with a dependency ?

# Resource Group
resource "azurerm_resource_group" "rg" {
  name     = local.resource_group_name
  location = var.location
}

# Container registry
resource "azurerm_container_registry" "cr" {
  #todo limiter l'utilisation du regisstre à des utilisateurs, car tout le monde peut pousser et récupérer des images
  # voir dans la doc comment encrypter la connexion
  location            = azurerm_resource_group.rg.location
  name                = local.container_registry_name
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "Basic" #todo check is Standard is better in our case ?
  admin_enabled       = true
}

# build images
resource "docker_image" "build_images" {
  for_each     = local.docker_images_to_push
  name         = format(local.image_name, each.key)
  keep_locally = false

  build {
    no_cache   = true
    context    = "${path.cwd}/${each.value.context}"
    target     = try(each.value.target, null)
    build_args = try(each.value.build_args, {})
  }

  triggers = {
    #todo check what it does and if it works
    dir_sha1 = sha1(join("", [for f in fileset(path.cwd, "${each.value.context}/*") : filesha1(f)]))
  }
}

resource "docker_registry_image" "push_image_to_cr" {
  for_each      = local.docker_images_to_push
  name          = docker_image.build_images[each.key].name
  keep_remotely = false

  triggers = {
    #todo check what it does and if it works
    dir_sha1 = sha1(join("", [for f in fileset(path.cwd, "${each.value.context}/*") : filesha1(f)]))
  }
}

resource "azurerm_log_analytics_workspace" "law" {
  location            = azurerm_resource_group.rg.location
  name                = local.log_analytics_workspace_name
  resource_group_name = azurerm_resource_group.rg.name
}

# Virtual network todo: remove if not used
# resource "azurerm_virtual_network" "vnet" {
#   name                = local.vnet_name
#   address_space       = ["10.0.0.0/16"]
#   location            = azurerm_resource_group.rg.location
#   resource_group_name = azurerm_resource_group.rg.name
# }

resource "azurerm_container_app_environment" "acae" {
  location                   = azurerm_resource_group.rg.location
  name                       = local.container_app_env_name
  resource_group_name        = azurerm_resource_group.rg.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.law.id
}

resource "azurerm_storage_account" "sa" {
  name                     = local.storage_account_name
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard" #todo default value ?
  account_replication_type = "LRS"      #todo default value ?
}

resource "azurerm_storage_share" "php-static-files-share" {
  name                 = "${var.gally_prefix}-php-static-files"
  storage_account_name = azurerm_storage_account.sa.name
  quota                = 1 #todo default value ?
}

resource "azurerm_storage_share" "os2-data-share" {
  name                 = "${var.gally_prefix}-os2-data"
  storage_account_name = azurerm_storage_account.sa.name
  quota                = 20 #todo default value ?
}

resource "azurerm_container_app_environment_storage" "php-static-files-caes" {
  name                         = "php-static-files-caes"
  container_app_environment_id = azurerm_container_app_environment.acae.id
  account_name                 = azurerm_storage_account.sa.name
  share_name                   = azurerm_storage_share.php-static-files-share.name
  access_key                   = azurerm_storage_account.sa.primary_access_key
  access_mode                  = "ReadWrite"
}

resource "azurerm_container_app_environment_storage" "os2-data-caes" {
  name                         = "os2-data-caes"
  container_app_environment_id = azurerm_container_app_environment.acae.id
  account_name                 = azurerm_storage_account.sa.name
  share_name                   = azurerm_storage_share.os2-data-share.name
  access_key                   = azurerm_storage_account.sa.primary_access_key
  access_mode                  = "ReadWrite"
}

resource "azurerm_container_app" "database" {
  container_app_environment_id = azurerm_container_app_environment.acae.id
  name                         = local.containers.database.name
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  secret {
    name  = "db-password"
    value = var.postgres.password
  }

  template {
    container {
      name   = local.containers.database.label
      image  = local.containers.database.image
      cpu    = "1"
      memory = "2Gi"
      env {
        name  = "POSTGRES_DB"
        value = var.postgres.db
      }
      env {
        name  = "POSTGRES_USER"
        value = var.postgres.user
      }
      env {
        name        = "POSTGRES_PASSWORD"
        secret_name = "db-password"
      }
    }
    max_replicas = 1
    min_replicas = 1
  }

  ingress {
    transport    = "tcp"
    target_port  = local.containers.database.target_port
    exposed_port = local.containers.database.exposed_port
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
}

resource "azurerm_container_app" "redis" {
  container_app_environment_id = azurerm_container_app_environment.acae.id
  name                         = local.containers.redis.name
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  template {
    container {
      name   = local.containers.redis.label
      image  = local.containers.redis.image
      cpu    = "1"
      memory = "2Gi"
      env {
        name  = "ALLOW_EMPTY_PASSWORD"
        value = "yes"
      }
    }
    max_replicas = 1
    min_replicas = 1
  }

  ingress {
    transport    = "tcp"
    target_port  = local.containers.redis.target_port
    exposed_port = local.containers.redis.exposed_port
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
}

resource "azurerm_container_app" "search" {
  container_app_environment_id = azurerm_container_app_environment.acae.id
  name                         = local.containers.search.name
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  secret {
    name  = "registry-password"
    value = azurerm_container_registry.cr.admin_password
  }


  registry {
    server               = azurerm_container_registry.cr.login_server
    username             = azurerm_container_registry.cr.admin_username
    password_secret_name = "registry-password"
  }

  template {
    volume {
      name         = "os2-data"
      storage_type = "AzureFile"
      storage_name = azurerm_container_app_environment_storage.os2-data-caes.name
    }
    container {
      name   = local.containers.search.label
      image  = local.containers.search.image
      cpu    = "2"
      memory = "4Gi"
      env {
        name  = "OPENSEARCH_JAVA_OPTS"
        value = "-Xms1g -Xmx1g"
      }
      env {
        name  = "DISABLE_SECURITY_PLUGIN"
        value = "true"
      }
      env {
        name  = "cluster.name"
        value = "os-docker-cluster"
      }
      env {
        name  = "cluster.routing.allocation.disk.threshold_enabled"
        value = "false"
      }
      #       env {
      #         name  = "cluster.initial_cluster_manager_nodes"
      #         value = "opensearch-node-data"
      #       }
      env {
        name  = "node.name"
        value = "opensearch-node-data"
      }
      env {
        name  = "bootstrap.memory_lock"
        value = "true"
      }
      #       env {
      #         name  = "discovery.seed_hosts"
      #         value = local.containers.search.service
      #       }
      env {
        name  = "plugins.ml_commons.allow_registering_model_via_url"
        value = "true"
      }
      env {
        name  = "plugins.ml_commons.native_memory_threshold"
        value = "100"
      }
      env {
        name  = "plugins.ml_commons.jvm_heap_memory_threshold"
        value = "100"
      }
      env {
        name  = "discovery.type"
        value = "single-node"
      }
      env {
        name  = "plugins.ml_commons.only_run_on_ml_node"
        value = "false"
      }
      volume_mounts {
        name = "os2-data"
        path = "/usr/share/opensearch/data"
      }
    }
    max_replicas = 1
    min_replicas = 1
  }

  ingress {
    transport    = "tcp"
    target_port  = local.containers.search.target_port
    exposed_port = local.containers.search.exposed_port
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
}

# resource "azurerm_container_app" "search-ml" {
#   container_app_environment_id = azurerm_container_app_environment.acae.id
#   name                         = local.containers.search-ml.name
#   resource_group_name          = azurerm_resource_group.rg.name
#   revision_mode                = "Single"
#
#   secret {
#     name  = "registry-password"
#     value = azurerm_container_registry.cr.admin_password
#   }
#
#
#   registry {
#     server               = azurerm_container_registry.cr.login_server
#     username             = azurerm_container_registry.cr.admin_username
#     password_secret_name = "registry-password"
#   }
#
#   template {
#     container {
#       name   = local.containers.search-ml.label
#       image  = local.containers.search-ml.image
#       cpu    = "2"
#       memory = "4Gi"
#       env {
#         name  = "OPENSEARCH_JAVA_OPTS"
#         value = "-Xms1g -Xmx1g"
#       }
#       env {
#         name  = "DISABLE_SECURITY_PLUGIN"
#         value = "true"
#       }
#       env {
#         name  = "cluster.name"
#         value = "os-docker-cluster"
#       }
#       env {
#         name  = "cluster.routing.allocation.disk.threshold_enabled"
#         value = "false"
#       }
#       env {
#         name  = "cluster.initial_cluster_manager_nodes"
#         value = "opensearch-node-data"
#       }
#       env {
#         name  = "node.name"
#         value = "opensearch-node-ml"
#       }
#       env {
#         name  = "node.roles"
#         value = "ml"
#       }
#       env {
#         name  = "bootstrap.memory_lock"
#         value = "true"
#       }
#       env {
#         name  = "discovery.seed_hosts"
#         value = local.containers.search.service
#       }
#       env {
#         name  = "plugins.ml_commons.allow_registering_model_via_url"
#         value = "true"
#       }
#       env {
#         name  = "plugins.ml_commons.native_memory_threshold"
#         value = "100"
#       }
#       env {
#         name  = "plugins.ml_commons.jvm_heap_memory_threshold"
#         value = "100"
#       }
#     }
#     max_replicas = 1
#     min_replicas = 1
#   }
#
#   ingress {
#     transport    = "tcp"
#     target_port  = local.containers.search-ml.target_port
#     exposed_port = local.containers.search-ml.exposed_port
#     traffic_weight {
#       percentage      = 100
#       latest_revision = true
#     }
#   }
# }

# resource "azurerm_container_app" "php" {
#   container_app_environment_id = azurerm_container_app_environment.acae.id
#   name                         = local.containers.php.name
#   resource_group_name          = azurerm_resource_group.rg.name
#   revision_mode                = "Single"
#
#   secret {
#     name  = "registry-password"
#     value = azurerm_container_registry.cr.admin_password
#   }
#
#   registry {
#     server               = azurerm_container_registry.cr.login_server
#     username             = azurerm_container_registry.cr.admin_username
#     password_secret_name = "registry-password"
#   }
#
#   template {
#     volume {
#       name         = "php-static-files"
#       storage_type = "AzureFile"
#       storage_name = azurerm_container_app_environment_storage.php-static-files-caes.name
#     }
#
#     container {
#       name   = local.docker_images_to_push.php.label
#       image  = local.containers.php.image
#       cpu    = "1"
#       memory = "2Gi"
#       env {
#         name  = "APP_ENV"
#         value = var.php.app_env
#       }
#       env {
#         name  = "APP_SECRET"
#         value = var.php.app_secret
#       }
#       env {
#         name  = "SERVER_NAME"
#         value = azurerm_container_app.router.ingress[0].fqdn
#       }
#       env {
#         name  = "TRUSTED_PROXIES"
#         value = format(local.container_name, var.containers.router.label)
#       }
#       env {
#         name  = "TRUSTED_HOSTS"
#         value = azurerm_container_app.router.ingress[0].fqdn
#       }
#       env {
#         name  = "CORS_ALLOW_ORIGIN"
#         value = "^${azurerm_container_app.pwa.ingress[0].fqdn}$"
#       }
#       env {
#         name  = "DATABASE_URL"
#         value = "postgresql://${var.postgres.user}:${var.postgres.password}@${local.containers.database.service}/${var.postgres.db}?serverVersion=${var.postgres.version}&charset=${var.postgres.charset}"
#       }
#       env {
#         name  = "REDIS_SERVER"
#         value = local.containers.redis.service
#       }
#       env {
#         name  = "ELASTICSEARCH_URL"
#         value = "http://${local.containers.search.service}/"
#       }
#       env {
#         name  = "GALLY_CATALOG_MEDIA_URL"
#         value = "#todo how to solve ?"
#       }
#       volume_mounts {
#         name = "php-static-files"
#         path = "/app/public"
#       }
#     }
#     max_replicas = 1
#     min_replicas = 1
#   }
#
#   ingress {
#     transport    = "tcp"
#     target_port  = local.containers.php.target_port
#     exposed_port = local.containers.php.exposed_port
#     traffic_weight {
#       percentage      = 100
#       latest_revision = true
#     }
#   }
#
#   depends_on = [
#     azurerm_container_app.database,
#     azurerm_container_app.redis,
#     azurerm_container_app.search
#   ]
# }

resource "azurerm_container_app" "pwa" {
  container_app_environment_id = azurerm_container_app_environment.acae.id
  name                         = local.containers.pwa.name
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  secret {
    name  = "registry-password"
    value = azurerm_container_registry.cr.admin_password
  }

  registry {
    server               = azurerm_container_registry.cr.login_server
    username             = azurerm_container_registry.cr.admin_username
    password_secret_name = "registry-password"
  }

  template {
    container {
      name   = local.docker_images_to_push.pwa.label
      image  = local.containers.pwa.image
      cpu    = "1"
      memory = "2Gi"
      env {
        name  = "NEXT_PUBLIC_ENTRYPOINT"
        value = "$(CONTAINER_APP_HOSTNAME)"
      }
      env {
        name  = "NEXT_PUBLIC_API_URL"
        value = "${format(local.container_name, local.docker_images_to_push.php.label)}:9000"
      }
    }
    max_replicas = 1
    min_replicas = 1
  }
  ingress {
    transport    = "tcp"
    target_port  = local.containers.pwa.target_port
    exposed_port = local.containers.pwa.exposed_port
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
}

resource "azurerm_container_app" "web" {
  container_app_environment_id = azurerm_container_app_environment.acae.id
  name                         = local.container_name_web
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  secret {
    name  = "registry-password"
    value = azurerm_container_registry.cr.admin_password
  }


  registry {
    server               = azurerm_container_registry.cr.login_server
    username             = azurerm_container_registry.cr.admin_username
    password_secret_name = "registry-password"
  }

  template {
    volume {
      name         = "php-static-files"
      storage_type = "AzureFile"
      storage_name = azurerm_container_app_environment_storage.php-static-files-caes.name
    }
    container {
      name   = local.docker_images_to_push.router.label
      image  = local.containers.router.image
      cpu    = "0.5"
      memory = "1Gi"
      env {
        name  = "API_SERVER_NAME"
        value = "$(CONTAINER_APP_HOSTNAME)"
      }
      env {
        name  = "API_UPSTREAM"
        value = "127.0.0.1:${local.containers.php.exposed_port}"
      }
      env {
        name  = "PWA_SERVER_NAME"
        value = azurerm_container_app.pwa.ingress[0].fqdn
      }
      env {
        name  = "PWA_UPSTREAM"
        value = local.containers.pwa.service
      }
      env {
        name  = "EXAMPLE_UPSTREAM"
        value = local.containers.pwa.service
      }
      volume_mounts {
        name = "php-static-files"
        path = "/app/public"
      }
    }
    container {
      name   = local.docker_images_to_push.php.label
      image  = local.containers.php.image
      cpu    = "1"
      memory = "2Gi"
      env {
        name  = "APP_ENV"
        value = var.php.app_env
      }
      env {
        name  = "APP_SECRET"
        value = var.php.app_secret
      }
      #           env {
      #               name  = "SERVER_NAME"
      #               value = azurerm_container_app.web.ingress[0].fqdn
      #           }
      env {
        name  = "TRUSTED_PROXIES"
        value = "127.0.0.1"
      }
      env {
        name  = "TRUSTED_HOSTS"
        value = "^${local.container_name_web}|${local.containers.varnish.name}|127.0.0.1$$"
      }
      env {
        name  = "CORS_ALLOW_ORIGIN"
        value = "^${azurerm_container_app.pwa.ingress[0].fqdn}$"
      }
      env {
        name  = "DATABASE_URL"
        value = "postgresql://${var.postgres.user}:${var.postgres.password}@${local.containers.database.service}/${var.postgres.db}?serverVersion=${var.postgres.version}&charset=${var.postgres.charset}"
      }
      env {
        name  = "REDIS_SERVER"
        value = local.containers.redis.service
      }
      env {
        name  = "ELASTICSEARCH_URL"
        value = "http://${local.containers.search.service}/"
      }
      env {
        name  = "GALLY_CATALOG_MEDIA_URL"
        value = "https://googlle.fr" #todo update value
      }
      env {
        name  = "VARNISH_URL"
        value = "http://${local.containers.php.service}/"
      }


      volume_mounts {
        name = "php-static-files"
        path = "/app/public"
      }
    }
    max_replicas = 1
    min_replicas = 1
  }
  ingress {
    transport    = "tcp"
    target_port  = local.containers.router.target_port
    exposed_port = local.containers.router.exposed_port
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  depends_on = [
    azurerm_container_app.pwa,
    docker_image.build_images["router"], #todo if image is updated this resource should be replaced, not working
    docker_image.build_images["php"]     #todo if image is updated this resource should be replaced, not working
  ]
}

resource "azurerm_container_app" "varnish" {
  container_app_environment_id = azurerm_container_app_environment.acae.id
  name                         = local.containers.varnish.name
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  secret {
    name  = "registry-password"
    value = azurerm_container_registry.cr.admin_password
  }

  registry {
    server               = azurerm_container_registry.cr.login_server
    username             = azurerm_container_registry.cr.admin_username
    password_secret_name = "registry-password"
  }

  template {
    /*
        todo ajouter le volume
        volume {
            name         = "php-static-files"
            storage_type = "AzureFile"
            storage_name = azurerm_container_app_environment_storage.php-static-files-caes.name
        }*/
    container {
      name   = local.docker_images_to_push.varnish.label
      image  = local.containers.varnish.image
      cpu    = "1"
      memory = "2Gi"
      env {
        name  = "VARNISH_SIZE"
        value = "512M"
      }
      env {
        name  = "VARNISH_HTTP_PORT"
        value = local.containers.varnish.target_port
      }
      env {
        name  = "BACKEND_PORT"
        value = local.containers.router.exposed_port
      }
      env {
        name  = "BACKEND_HOST"
        value = local.container_name_web
      }
      env {
        name  = "PHP_UPSTREAM"
        value = local.container_name_web
      }
      env {
        name  = "VARNISH_BAN_IP_CHECK_DISABLED"
        value = "1"
      }
    }
    max_replicas = 1
    min_replicas = 1
  }
  ingress {
    allow_insecure_connections = true
    external_enabled           = true
    target_port                = local.containers.varnish.target_port
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  depends_on = [
    azurerm_container_app.web,
    docker_image.build_images["varnish"] #todo if image is updated this resource should be replaced, not working
  ]
}
