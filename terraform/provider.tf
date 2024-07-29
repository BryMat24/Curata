terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.60.0"
    }
  }
  backend "s3" {
      bucket         = var.bucket_name
      key            = var.bucket_key
      region         = var.region
      dynamodb_table = var.dynamodb_table
      encrypt        = true
  }  
}

provider "aws" {
  region     = var.region
  access_key = var.access_key
  secret_key = var.secret_key
}