variable "curata_vpc_id" {
  type = string
}

variable "curata_instance_sg_id" {
  type = string
}

variable "curata_alb_sg_id" {
  type = string
}

variable "curata_public_subnet_ids" {
  type = list(string)
}

variable "curata_private_subnet_ids" {
  type = list(string)
}

variable "availability_zones" {
  type = list(string)
}

variable "launch_template_name" {
  type = string
  default = "curata-template"
}

variable "instance_type" {
  type = string
  default = "t2.micro"
}

variable "ami" {
  type = string
  default = "ami-06bfdf472b4a9e4b3"
}

variable "asg_name" {
  type = string
  default = "curata-asg"
}

variable "alb_name" {
  type = string
  default = "curata-alb"
}

variable "target_group_name" {
  type = string
  default = "curata-tg"
}

variable "listener_name" {
  type = string
  default = "curata-listener"
}