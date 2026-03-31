# NestJS Backend Starter

JWT 인증 및 역할 기반 접근 제어(RBAC)를 갖춘 NestJS 백엔드 스타터 프로젝트입니다.

## 기술 스택

- **Framework**: NestJS 11
- **Language**: TypeScript 5
- **Database**: MySQL + TypeORM
- **Auth**: JWT (Access Token + Refresh Token)
- **Password**: Argon2 해싱

## 프로젝트 구조

```
src/
├── auth/                  # JWT 인증 모듈
│   ├── dto/               # 로그인 DTO
│   └── strategy/          # JWT / JWT-Refresh 전략
├── users/                 # 유저 모듈
│   ├── dto/               # 회원가입, 유저 응답 DTO
│   └── entities/          # User 엔티티
├── common/                # 공통 유틸리티
│   ├── decorators/        # Auth, Roles 데코레이터
│   ├── guards/            # Auth, Roles 가드
│   ├── base_reponse.dto.ts
│   ├── http-exception.filter.ts
│   └── response.interceptor.ts
├── password/              # Argon2 패스워드 해싱 서비스
├── database/              # TypeORM 데이터베이스 모듈
└── config/                # 환경변수 설정
```

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열어 DB 접속 정보와 JWT 시크릿을 설정합니다.

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=your_database

PORT=3333

JWT_SECRET=your_jwt_secret        # 32자 이상 권장
JWT_SECRET_EXPIRE=15m

JWT_REFRESH=your_refresh_secret   # 32자 이상 권장
JWT_REFRESH_EXPIRE=7d
```

### 3. 실행

```bash
# 개발 모드
npm run start:dev

# 프로덕션 빌드
npm run build
npm run start:prod
```

## API 엔드포인트

### 인증

| Method | URL | 설명 | 인증 |
|--------|-----|------|------|
| POST | `/auth/login` | 로그인 (Access + Refresh 토큰 발급) | 불필요 |
| POST | `/auth/refresh` | Access 토큰 재발급 | Refresh 토큰 필요 |

### 유저

| Method | URL | 설명 | 인증 |
|--------|-----|------|------|
| GET | `/users/check-email?email=` | 이메일 중복 확인 | 불필요 |
| POST | `/users/join-user` | 회원가입 | 불필요 |

## 인증 흐름

```
1. POST /auth/login        → Access Token (15분) + Refresh Token (7일) 발급
2. API 요청 시             → Authorization: Bearer {access_token}
3. Access Token 만료 시    → POST /auth/refresh (Bearer {refresh_token}) → 새 Access Token 발급
```

## 응답 형식

### 성공

```json
{
  "success": true,
  "data": { ... },
  "statusCode": 200
}
```

### 실패

```json
{
  "success": false,
  "message": "에러 메시지",
  "errorCode": 401,
  "path": "/auth/login",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

## 역할(Role) 체계

| Level | 설명 |
|-------|------|
| 0 | 비활성 계정 |
| 1 | 일반 사용자 (기본값) |
| 9 | 관리자 |

라우트에 역할 제한을 적용하려면:

```typescript
@Get('admin-only')
@Auth()           // JWT 인증 필요
@Roles(9)         // level 9만 접근 가능
adminRoute() { ... }
```
