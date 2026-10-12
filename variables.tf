variable "region" {
  description = "The AWS region to create resources in."
  type        = string
  default     = "ap-southeast-2"
}

variable "bucket_name" {
  default = "devops-static-web-app"
}

variable "bucket_prefix" {
  description = "Prefix for the S3 bucket name."
  type        = string
  default     = "my-static-website-"
}