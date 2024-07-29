variable "instance_sg_name" {
  type = string
  default = "curata-instance-sg"
} 

variable "alb_sg_name" {
  type = string
  default = "curata-alb-sg"
} 

variable "curata_vpc_id" {
  type        = string
}
