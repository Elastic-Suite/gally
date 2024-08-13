# Configure the Azure provider
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.115.0"
    }
    docker = {
      source  = "kreuzwerker/docker"
      version = "3.0.2"
    }
  }

  required_version = ">= 1.9.4"
}

provider "azurerm" {
  features {}
}

provider "docker" {
  registry_auth {
    address  = azurerm_container_registry.cr.login_server
    username = azurerm_container_registry.cr.admin_username
    password = azurerm_container_registry.cr.admin_password
  }
}
