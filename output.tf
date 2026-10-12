output "bucketname" {
  value = aws_s3_bucket.staticweb.bucket_regional_domain_name
}

output "cloudfront_domain" {
  value = aws_cloudfront_distribution.s3_distribution.domain_name
}