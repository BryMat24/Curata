// ------ EC2 ALB-----------
resource "aws_lb" "curata_alb" {
  name               = var.alb_name
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.curata_alb_sg_id]
  subnets            = [for id in var.curata_public_subnet_ids : id]
  enable_deletion_protection = false

  tags = {
    Name = var.alb_name
  }
}

resource "aws_lb_target_group" "curata_tg" {
  name     = var.target_group_name
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.curata_vpc_id

  health_check {
    interval            = 30
    path                = "/course"
  }

  tags = {
    Name = var.target_group_name
  }
}

resource "aws_lb_listener" "curata_listener" {
  load_balancer_arn = aws_lb.curata_alb.arn
  port              = 80
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.curata_tg.arn
  }

  tags = {
    Name = var.listener_name
  }
}

// ------ EC2 ASG -----------
resource "aws_launch_template" "curata_launch_template" {
  name   = var.launch_template_name
  image_id      = var.ami
  instance_type = var.instance_type
  vpc_security_group_ids = [var.curata_instance_sg_id]
  user_data = base64encode(file("${path.module}/app.sh"))
}

resource "aws_autoscaling_group" "curata_asg" {
  name               = var.asg_name
  desired_capacity   = 1
  max_size           = 2
  min_size           = 1
  vpc_zone_identifier = [for subnet_id in var.curata_private_subnet_ids : subnet_id]
  target_group_arns = [aws_lb_target_group.curata_tg.arn]

  launch_template {
    id      = aws_launch_template.curata_launch_template.id
    version = "$Latest"
  }
}


