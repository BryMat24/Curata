output "curata_instance_sg_id" {
    description = "List the security group ID for EC2 instances"
    value = aws_security_group.curata_alb_sg.id
}

output "curata_alb_sg_id" {
    description = "List the security group ID for ALB"
    value = aws_security_group.curata_alb_sg.id
}