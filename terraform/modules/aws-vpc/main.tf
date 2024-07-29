resource "aws_vpc" "curata_vpc" {
  cidr_block = var.vpc_cidr

  tags = {
    Name = "curata_vpc"
  }
}

// ------- subnet ------------
resource "aws_subnet" "curata_public_subnet" {
  vpc_id = aws_vpc.curata_vpc.id
  for_each = {
    for idx, az in var.availability_zones : az => {
      cidr_block        = var.public_subnet_cidrs[idx]
      availability_zone = az
    }
  }

  map_public_ip_on_launch = true
  cidr_block = each.value.cidr_block
  availability_zone = each.key
  tags = {
    Name = "curata_public_subnet-${each.key}"
  }
}

resource "aws_subnet" "curata_private_subnet" {
  vpc_id = aws_vpc.curata_vpc.id
  for_each = {
    for idx, az in var.availability_zones : az => {
        cidr_block        = var.private_subnet_cidrs[idx]
        availability_zone = az
    }
  }

  map_public_ip_on_launch = false
  cidr_block = each.value.cidr_block
  availability_zone = each.key
  tags = {
    Name = "curata_private_subnet-${each.key}"
  }
}

// ------- igw ------------
resource "aws_internet_gateway" "curata_igw" {
  vpc_id = aws_vpc.curata_vpc.id

  tags = {
    Name = "curata_igw"
  }
}

// ------- NAT ------------
resource "aws_eip" "curata-eip" {
  domain = "vpc"
  depends_on = [aws_internet_gateway.curata_igw]
}

resource "aws_nat_gateway" "curata_natgw" {
  allocation_id = aws_eip.curata-eip.id
  subnet_id     = aws_subnet.curata_public_subnet[var.availability_zones[0]].id

  tags = {
    Name = "curata-natgw"
  }

  depends_on = [aws_internet_gateway.curata_igw]
}
 
// ------- public route table ------------
resource "aws_route_table" "curata_public_route_table" {
  vpc_id = aws_vpc.curata_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.curata_igw.id
  }

  route {
    cidr_block = var.vpc_cidr
    gateway_id = "local"
  }

  tags = {
    Name = "curata_public_route_table"
  }
}

resource "aws_route_table_association" "public_route_assosciation" {
  subnet_id      = each.value.id
  route_table_id = aws_route_table.curata_public_route_table.id
  for_each = aws_subnet.curata_public_subnet
}

// ------- private route table ------------
resource "aws_route_table" "curata_private_route_table" {
  vpc_id = aws_vpc.curata_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_nat_gateway.curata_natgw.id
  }

  route {
    cidr_block = var.vpc_cidr
    gateway_id = "local"
  }

  tags = {
    Name = "curata_private_route_table"
  }
}

resource "aws_route_table_association" "private_route_assosciation" {
  subnet_id      = each.value.id
  route_table_id = aws_route_table.curata_private_route_table.id
  for_each = aws_subnet.curata_private_subnet
}

// ------- network ACL ------------
resource "aws_network_acl" "curata_public_nacl" {
  vpc_id = aws_vpc.curata_vpc.id

  tags = {
    Name = "curata_public_nacl"
  }
}

resource "aws_network_acl_rule" "public_inbound_http" {
  network_acl_id = aws_network_acl.curata_public_nacl.id
  rule_number    = 100
  protocol       = "tcp"
  rule_action    = "allow"
  cidr_block     = "0.0.0.0/0"
  from_port      = 80
  to_port        = 80
  egress         = false
}

resource "aws_network_acl_rule" "public_inbound_https" {
  network_acl_id = aws_network_acl.curata_public_nacl.id
  rule_number    = 110
  protocol       = "tcp"
  rule_action    = "allow"
  cidr_block     = "0.0.0.0/0"
  from_port      = 443
  to_port        = 443
  egress         = false
}

resource "aws_network_acl_rule" "public_outbound_all" {
  network_acl_id = aws_network_acl.curata_public_nacl.id
  rule_number    = 100
  protocol       = "-1"
  rule_action    = "allow"
  cidr_block     = "0.0.0.0/0"
  from_port      = 0
  to_port        = 0
  egress         = true
}

resource "aws_network_acl" "curata_private_nacl" {
  vpc_id = aws_vpc.curata_vpc.id

  tags = {
    Name = "curata_private_nacl"
  }
}

resource "aws_network_acl_rule" "private_inbound_http" {
  network_acl_id = aws_network_acl.curata_private_nacl.id
  rule_number    = 100
  protocol       = "tcp"
  rule_action    = "allow"
  cidr_block     = var.vpc_cidr
  from_port      = 80           
  to_port        = 80
  egress         = false
}

resource "aws_network_acl_rule" "private_inbound_https" {
  network_acl_id = aws_network_acl.curata_private_nacl.id
  rule_number    = 110
  protocol       = "tcp"
  rule_action    = "allow"
  cidr_block     = var.vpc_cidr 
  from_port      = 443           
  to_port        = 443
  egress         = false
}

resource "aws_network_acl_rule" "private_outbound" {
  network_acl_id = aws_network_acl.curata_private_nacl.id
  rule_number    = 100
  protocol       = "-1"
  rule_action    = "allow"
  cidr_block     = "0.0.0.0/0"
  from_port      = 0
  to_port        = 0
  egress         = true
}
