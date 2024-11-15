# AWS Send Notification Service

AWS Send Notification Service는 서버리스 아키텍처를 기반으로 한 사용자 가입 시 이메일 알림을 보내는 시스템입니다. 이 프로젝트는 AWS Lambda, DynamoDB, Amazon SES, API Gateway를 사용하여 구현되었습니다.

## 기능

- 사용자 가입 시 DynamoDB에 사용자 정보 저장
- 가입한 사용자에게 환영 이메일 전송
- RESTful API를 통해 사용자 등록 요청 처리

## 기술 스택

- **AWS Lambda**: 서버리스 함수 실행
- **Amazon DynamoDB**: NoSQL 데이터베이스
- **Amazon SES**: 이메일 전송 서비스
- **API Gateway**: HTTP 요청을 Lambda로 전달

## 설치 및 실행

### 사전 요구 사항

- AWS 계정
- AWS CLI 설치 및 구성
- Node.js (최신 버전)

### 1. 프로젝트 클론

```bash
git clone <YOUR_REPOSITORY_URL>
cd aws-send-notification-service
```

### 2. 의존성 설치

```bash
npm install
```

### 3. AWS 리소스 배포

```bash
serverless deploy
```

### 4. API 테스트

가입 요청을 보내기 위해 Postman 또는 cURL을 사용할 수 있습니다.

```bash
curl -X POST https://your-api-endpoint/register \
-H "Content-Type: application/json" \
-d '{"userId": "testuser1", "email": "recipient@example.com"}'
```

## 사용 방법

1. 사용자가 `/register` 엔드포인트로 POST 요청을 보내면, 사용자 정보가 DynamoDB에 저장됩니다.
2. SES를 통해 사용자의 이메일로 환영 메시지가 전송됩니다.