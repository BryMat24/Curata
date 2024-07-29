output "curata_vpc_id" {
  description = "List the ID of the vpc"
  value       = aws_vpc.curata_vpc.id
}

output "curata_public_subnet_ids" {
  description = "List of public subnet"
  value       = [for subnet in aws_subnet.curata_public_subnet : subnet.id]
}

output "curata_private_subnet_ids" {
  description = "List of private subnet"
  value       = [for subnet in aws_subnet.curata_private_subnet : subnet.id]
}

output "availability_zones" {
  description = "List of AZ used"
  value = var.availability_zones
}