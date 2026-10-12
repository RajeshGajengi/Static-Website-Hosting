# 🚀 Deploy a Static Website on AWS S3 Using CloudFront and Terraform


## 📌 Project Overview

This project demonstrates how to deploy a static website on Amazon S3 and distribute its content globally through Amazon CloudFront, using Terraform to provision and manage AWS infrastructure as code (IaC).

The infrastructure is designed to keep the S3 bucket private while allowing CloudFront to securely retrieve website content using Origin Access Control (OAC).

The project also demonstrates automated website file uploads, content-type configuration, HTTPS redirection, and infrastructure management through reusable Terraform configuration.

## 🎯 Project Objectives
- Deploy a static website using Amazon S3.
- Provision AWS infrastructure using Terraform.
- Configure Amazon CloudFront as a content delivery network (CDN).
- Secure the S3 origin using CloudFront Origin Access Control (OAC).
- Block direct public access to the S3 bucket.
- Automatically upload website files using Terraform.
- Configure MIME types for common static website assets.
- Understand cloud infrastructure provisioning, security, and deployment workflows.



## Architecture

![alt text](public/architecture%20diagram.png)

<!-- The project follows this request flow:

                  Website Visitor
                         |
                         v
                  HTTPS Request
                         |
                         v
              Amazon CloudFront CDN
                         |
                         | Signed Origin Request
                         v
              CloudFront Origin Access
                    Control (OAC)
                         |
                         v
                 Private Amazon S3
                    Bucket Origin
                         |
                         v
                Static Website Files
             HTML | CSS | JavaScript
                  Images | Assets -->


### Architecture Components
Component	Purpose
- Terraform	Defines and provisions AWS infrastructure as code.
- Amazon S3	Stores static website files and assets.
- S3 Public Access Block	Prevents public access through S3 bucket policies and ACLs.
- Amazon CloudFront	Distributes website content through AWS edge locations.
- Origin Access Control (OAC)	Allows CloudFront to make authenticated requests to the private S3 origin.
- S3 Bucket Policy	Grants the CloudFront distribution permission to read website objects.


## 🛠️ Technologies Used
- Cloud Provider: Amazon Web Services (AWS)
- Infrastructure as Code: Terraform
- Object Storage: Amazon S3
- Content Delivery Network: Amazon CloudFront
- Access Management: IAM and S3 bucket policies
- Origin Security: CloudFront Origin Access Control (OAC)
- Configuration Language: HashiCorp Configuration Language (HCL)


## ✨ Features
#### 1. Infrastructure as Code
All AWS resources are defined using Terraform, making the infrastructure repeatable, version-controlled, and easier to maintain.

#### 2. Private S3 Bucket
The S3 bucket is configured with all four public access block settings enabled. Website objects are not intended to be publicly accessible directly from S3.

#### 3. CloudFront Content Delivery
CloudFront distributes website content to visitors through its global edge network, helping reduce latency and improve content delivery performance.

#### 4. Secure Origin Access
CloudFront Origin Access Control signs requests to the S3 origin using AWS Signature Version 4 (SigV4). The S3 bucket policy should authorize only the intended CloudFront distribution.

#### 5. Automated Website File Uploads
Terraform's fileset() function discovers files inside the website/ directory, while for_each creates an S3 object resource for each discovered file.

#### 6. Automatic Content-Type Detection
The configuration maps common file extensions to appropriate MIME types, including HTML, CSS, JavaScript, JSON, PNG, JPEG, SVG, and text files. Unknown extensions receive application/octet-stream.

#### 7. HTTPS Redirection
CloudFront is configured to redirect HTTP requests to HTTPS, ensuring that visitors use an encrypted connection.



## 📂 Project Structure
```
terraform-static-website/
├── main.tf                 # AWS infrastructure resources
├── variables.tf            # Input variable definitions
├── outputs.tf              # Useful deployment outputs
├── providers.tf            # AWS provider configuration
├── versions.tf             # Terraform and provider constraints
├── terraform.tfvars        # Environment-specific variable values
├── .gitignore              # Files excluded from version control
├── website/
│   ├── index.html          # Website entry point
│   ├── style.css           # Website styling
│   ├── script.js           # Client-side JavaScript
│   └── assets/             # Images and other static assets
└── README.md               # Project documentation
```
>Note: This is a suggested repository structure. Adjust the filenames to match your actual project.



## ⚙️ Prerequisites

Before deploying this project, ensure you have:
- An AWS account.
- Terraform installed locally.
- AWS CLI installed and configured.
- AWS credentials with the required permissions to manage S3, CloudFront, and related resources.
- A static website containing an index.html file.
- Access to an AWS region supported by the required resources.


Verify your installations:
```
terraform version
aws --version
aws sts get-caller-identity
```
The last command verifies that your AWS CLI is authenticated and identifies the active AWS account.


## 🚀 Deployment Guide
### Step 1: Clone the Repository
```
git clone <YOUR_REPOSITORY_URL>
cd terraform-static-website
```
Replace <YOUR_REPOSITORY_URL> with your Git repository URL.

### Step 2: Configure AWS Credentials
Configure the AWS CLI using your preferred authentication method.

For a local development environment, you can use:

```
aws configure
```
For production or CI/CD environments, prefer IAM roles or another short-lived credential mechanism rather than hardcoded access keys.


### Step 3: Configure Terraform Variables
Define your bucket variables in variables.tf:

```
variable "bucket_name" {
  description = "Globally unique name for the S3 bucket"
  type        = string
}

variable "bucket_prefix" {
  description = "Prefix used to identify CloudFront resources"
  type        = string
}
```

Create or update terraform.tfvars:
```
bucket_name   = "your-unique-static-website-bucket"
bucket_prefix = "static-website"
```

Choose an S3 bucket name that is globally unique and meets AWS naming requirements.

### Step 4: Initialize Terraform
Download the required providers and initialize the working directory:
```terraform init```

### Step 5: Validate the Configuration
Format and validate your Terraform files:
```
terraform fmt -recursive
terraform validate
```

### Step 6: Review the Execution Plan
Preview the infrastructure changes before applying them:
```
terraform plan
```
Review the proposed resources and confirm that the plan matches your intended configuration.

### Step 7: Deploy the Infrastructure
Create the AWS resources:
```
terraform apply
```
Review the plan and type yes when prompted.

Terraform will provision the configured S3 bucket, CloudFront distribution, Origin Access Control, bucket policy, and website objects.

### Step 8: Access the Website
After deployment completes, retrieve the CloudFront distribution domain name from the AWS Console or define an output in Terraform:

```
output "cloudfront_domain_name" {
  description = "Domain name of the CloudFront distribution"
  value       = aws_cloudfront_distribution.s3_distribution.domain_name
}
```
Run:
```
terraform output cloudfront_domain_name
```
Open the resulting domain using HTTPS:

https://<CLOUDFRONT_DOMAIN_NAME>
CloudFront deployment can take several minutes before the distribution becomes available.



## 🔐 Security Considerations
Security is an important part of this project.

S3 Public Access Block: Keeps direct public access to the bucket restricted.
CloudFront OAC: Uses signed requests to access objects in the private S3 origin.
Least Privilege: The bucket policy should grant only s3:GetObject to the intended CloudFront distribution.
HTTPS: Redirects HTTP viewer requests to HTTPS.
Credential Management: AWS credentials should never be committed to the repository.
Terraform State: State files can contain sensitive infrastructure details and should not be committed to Git.


**Important Bucket Policy Correction**
The aws:SourceArn condition in the S3 bucket policy must reference the actual CloudFront distribution ARN.

Use this Terraform expression:
```
"aws:SourceArn" = aws_cloudfront_distribution.s3_distribution.arn
```

For example, within the policy document:

```
Condition = {
  StringEquals = {
    "AWS:SourceArn" = aws_cloudfront_distribution.s3_distribution.arn
  }
}
```

Terraform's jsonencode() accepts HCL objects, so the policy can be expressed with HCL-style assignments inside the object. Use the exact AWS condition key casing shown in your chosen policy convention and ensure the ARN is evaluated as a Terraform reference, not stored as a literal string.

Also, make sure the bucket policy has a valid dependency relationship with the distribution and OAC. If Terraform reports a dependency cycle, restructure the policy or use a separate policy document/resource strategy to avoid it.


## 🧹 Infrastructure Cleanup
To remove the infrastructure created by Terraform, run:
```
terraform destroy
```
Review the proposed deletion and confirm when prompted.

Important: Terraform may be unable to delete an S3 bucket while it contains objects. Empty the bucket first or implement an appropriate cleanup strategy. Do not run this command against shared or production infrastructure without reviewing the impact.



## 🧠 Key Learnings

This project provides hands-on experience with several important cloud and DevOps concepts.

**Terraform and Infrastructure as Code**
Defining AWS resources declaratively.
Using input variables to make infrastructure configurable.
Understanding resource dependencies and Terraform's execution graph.
Using for_each to manage multiple S3 objects.
Using fileset() to discover website files dynamically.
Using filemd5() to help detect changes in uploaded files.
Applying formatting, validation, planning, and deployment workflows.

**AWS Storage and Security**
Understanding S3 buckets, objects, ARNs, and bucket policies.
Configuring S3 Block Public Access.
Understanding why a private S3 bucket is preferable for a CloudFront-backed website.
Learning how CloudFront OAC signs origin requests.
Applying least-privilege access principles.

**Content Delivery and Web Hosting**
Understanding the role of a CDN.
Configuring a CloudFront distribution and S3 origin.
Enforcing HTTPS for viewer requests.
Setting default cache behavior and cache TTLs.
Configuring MIME types for static website assets.


**Troubleshooting and Operations**
Diagnosing access-denied responses caused by bucket policies.
Understanding CloudFront deployment delays.
Reviewing Terraform plans before making infrastructure changes.
Recognizing the importance of cache invalidation when publishing updated website content.


## 🔮 Future Improvements

The following improvements can make this project more production-ready.

#### 1. Modularize the Terraform Configuration
Split the infrastructure into reusable modules for S3, CloudFront, and shared configuration. This improves maintainability and enables reuse across environments.

#### 2. Add Remote Terraform State
Configure an S3 backend with appropriate state locking for collaborative workflows. Enable versioning and restrict access to the state bucket.

#### 3. Add a CI/CD Pipeline
Integrate GitHub Actions or another CI/CD platform to automatically run:
```
terraform fmt -check
terraform validate
terraform plan
A reviewed and controlled deployment stage
```
Use GitHub OIDC and AWS IAM roles to avoid storing long-lived AWS credentials in repository secrets.

#### 4. Configure a Custom Domain
Use Amazon Route 53 and an AWS Certificate Manager certificate to serve the website through a custom domain over HTTPS. For CloudFront, the ACM certificate must be provisioned in us-east-1.

<!-- #### 5. Improve Cache Management
Configure cache policies and object-specific caching. Add CloudFront invalidations or versioned asset filenames to ensure updated website files become available promptly.

#### 6. Add Environment Support
Support development, staging, and production environments using separate variable files, appropriately isolated state, and environment-specific resource settings.

#### 7. Add Monitoring and Logging
Integrate CloudFront access logs, CloudWatch monitoring, alarms, and appropriate S3 logging to improve observability and troubleshooting.

#### 8. Add AWS WAF
Consider AWS WAF to protect the CloudFront distribution against common web exploits and unwanted traffic, based on the website's risk profile.

#### 9. Add Automated Security Checks
Integrate tools such as Checkov, Trivy, or TFLint to identify infrastructure misconfigurations, improve Terraform quality, and enforce coding standards.

#### 10. Improve Website Deployment Reliability
Separate infrastructure provisioning from website publishing when appropriate. Consider immutable or versioned assets, deployment validation, and a rollback strategy. -->





## 📚 Official Documentation
- Terraform Documentation
- AWS Provider for Terraform
- Amazon S3 Documentation
- Amazon CloudFront Documentation
- CloudFront Origin Access Control
- S3 Block Public Access
- Terraform S3 Backend



## 👨‍💻 Project Summary

This project demonstrates how to provision a static website hosting architecture using Terraform, Amazon S3, and Amazon CloudFront.

It combines infrastructure automation, private object storage, CDN configuration, and access-control policies to build a foundation for secure and maintainable static website delivery.

The project can be extended with CI/CD automation, custom domains, centralized state management, monitoring, and automated security checks to move toward a more production-ready deployment workflow.


---
If you found this project useful, consider giving the repository a ⭐ on GitHub.




<!-- Portfolio tip: Add a screenshot of the deployed website and a simple architecture diagram to your repository. A short section showing the deployment URL, a successful terraform apply, and the security design will make the project more compelling to recruiters. -->


<!-- Keep secrets and state out of Git. Add .terraform/, *.tfstate, *.tfstate.*, and sensitive variable files to .gitignore. Commit .terraform.lock.hcl so provider selections remain reproducible. -->