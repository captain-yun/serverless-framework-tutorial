# AWS Image Resize Service

Automatically resizes images uploaded to an S3 bucket using AWS Lambda.

## Setup

1. Install dependencies:
```npm install```
```npm rebuild sharp --platform=linux --arch=x64```

2. Deploy the service:
```serverless deploy```

## Usage

1. Upload an image to the source bucket: `your-source-bucket-name`
2. Resized image will automatically appear in target bucket: `your-target-bucket-name`
