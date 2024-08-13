locals {
  condition_alaphanumeric_regex         = "^[a-zA-Z0-9]+$"
  condition_alaphanumeric_error_message = "Alpha numeric characters only are allowed in '%s'"
}

variable "gally_prefix" {
  description = "Prefix used on resource names (gally by default)"
  type        = string
  default     = "gally"

  validation {
    condition     = can(regex(local.condition_alaphanumeric_regex, var.gally_prefix))
    error_message = format(local.condition_alaphanumeric_error_message, "gally_prefix")
  }
}

variable "project_name" {
  description = "Your project name"
  type        = string

  validation {
    condition     = can(regex(local.condition_alaphanumeric_regex, var.project_name))
    error_message = format(local.condition_alaphanumeric_error_message, "project_name")
  }
}

variable "location" {
  description = "The Azure Region where the resources should exist"
  type        = string
}

variable "gally_version" {
  description = "Gally version to deploy"
  type        = string
  default     = "2.0"
}

variable "redis_version" {
  description = "Redis version to deploy"
  type        = string
  default     = "6.2"
}

variable "composer_auth" {
  description = "Composer auth"
  type        = string
  default     = ""
}

variable "postgres" {
  description = "Postgres config"
  type        = map(string)
  default = {
    version  = "16"
    db       = "api"
    user     = "api"
    password = "ChangeMe"
    charset  = "utf8"
  }
}

variable "php" {
  description = "php config"
  type        = map(string)
  default = {
    app_env    = "prod"
    app_secret = "!ChangeMe!"
  }
}

variable "containers" {
  description = "containers config"
  type        = map(object({ label : string, exposed_port : number, target_port : number }))
  default = {
    database = {
      label        = "database"
      exposed_port = 5432
      target_port  = 5432
    }
    redis = {
      label        = "redis"
      exposed_port = 6379
      target_port  = 6379
    }
    search = {
      label        = "search"
      exposed_port = 9200
      target_port  = 9200
    }
    search-ml = {
      label        = "search-ml"
      exposed_port = 9200
      target_port  = 9200
    }
    pwa = {
      label        = "pwa"
      exposed_port = 3000
      target_port  = 3000
    }
    php = {
      label        = "php"
      exposed_port = 9000
      target_port  = 9000
    }
    router = {
      label        = "router"
      exposed_port = 80
      target_port  = 80
    }
    varnish = {
      label        = "varnish"
      exposed_port = 80
      target_port  = 8080
    }
  }
}

