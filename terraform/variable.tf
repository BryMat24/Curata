variable "bucket_name" {
  type    = string
  default = "curata-remote-tfstate"
}

variable "bucket_key" {
  type    = string
  default = "terraform.tfstate"
}

variable "dynamodb_table" {
  type    = string
  default = "value"
}

variable "access_key" {
  type = string
}

variable "secret_key" {
  type = string
}

variable "region" {
  type    = string
  default = "ap-southeast-1"
}