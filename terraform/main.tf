module "aws_vpc" {
  source = "./modules/aws-vpc"
}

module "aws_security_group" {
  source = "./modules/aws-security-group"
  curata_vpc_id = module.aws_vpc.curata_vpc_id
}

module "aws_asg" {
  source = "./modules/aws-asg"
  curata_instance_sg_id = module.aws_security_group.curata_instance_sg_id
  curata_alb_sg_id = module.aws_security_group.curata_alb_sg_id
  curata_public_subnet_ids = module.aws_vpc.curata_public_subnet_ids
  curata_private_subnet_ids = module.aws_vpc.curata_private_subnet_ids
  curata_vpc_id = module.aws_vpc.curata_vpc_id
  availability_zones = module.aws_vpc.availability_zones
} 