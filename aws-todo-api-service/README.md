# Serverless Todo API

Serverless Todo API는 AWS Lambda와 DynamoDB를 사용하여 구현된 간단한 Todo 리스트 애플리케이션입니다. 이 프로젝트는 RESTful API를 통해 Todo 항목을 생성, 조회, 수정 및 삭제할 수 있는 기능을 제공합니다.

## 기능

- Todo 항목 생성
- Todo 항목 목록 조회
- 특정 Todo 항목 조회
- Todo 항목 수정
- Todo 항목 삭제

## 기술 스택

- **AWS Lambda**: 서버리스 함수 실행
- **Amazon DynamoDB**: NoSQL 데이터베이스
- **API Gateway**: HTTP 요청을 Lambda로 전달
- **Node.js**: 서버리스 함수의 런타임

## 설치 및 실행

### 사전 요구 사항

- AWS 계정
- AWS CLI 설치 및 구성
- Node.js (최신 버전)

### 1. 프로젝트 클론

git clone <YOUR_REPOSITORY_URL>
cd serverless-todo-api

### 2. 의존성 설치

npm install

### 3. AWS 리소스 배포

serverless deploy


### 4. API 테스트

Todo API를 테스트하기 위해 Postman 또는 cURL을 사용할 수 있습니다.

#### Todo 생성

curl -X POST https://your-api-endpoint/todos \
-H "Content-Type: application/json" \
-d '{"title": "New Todo", "completed": false}'

#### Todo 목록 조회

curl https://your-api-endpoint/todos

#### 특정 Todo 조회

curl https://your-api-endpoint/todos/{id}

#### Todo 수정

curl -X PUT https://your-api-endpoint/todos/{id} \
-H "Content-Type: application/json" \
-d '{"title": "Updated Todo", "completed": true}'

#### Todo 삭제

curl -X DELETE https://your-api-endpoint/todos/{id}

