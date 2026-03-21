## 5. 주요 API

명세는 [openapi.yml](/Users/LJJ/Desktop/project/go/gugu/gugu-api/openapi.yml) 에 있다.

주요 엔드포인트:

- `GET /health`
- `POST /v1/auth/register/email`
- `POST /v1/auth/login/email`
- `POST /v1/auth/verify-email`
- `POST /v1/auth/oauth/login`

## 6. 요청 예시

회원가입:

```bash
curl -X POST http://localhost:8080/v1/auth/register/email \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@example.com",
    "password": "secret123!",
    "display_name": "Gugu User"
  }'(failed)net::ERR_CONNECTION_REFUSED
```

이메일 로그인:

```bash
curl -X POST http://localhost:8080/v1/auth/login/email \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@example.com",
    "password": "secret123!"
  }'
```

로그인 응답은 서버 세션 대신 JWT 토큰 묶음을 반환한다.

이메일 인증 코드는 Gmail SMTP로 발송한다.
개발 중 발송 없이 로그만 보려면 `MAIL_PROVIDER='log'` 로 바꾸면 된다.

## 7. 현재 제한 사항

- 프론트 앱 자체는 이 저장소에 없다.
- `DATABASE_URL` 이 없으면 저장소는 메모리 기반으로 동작한다.
- `DATABASE_URL` 이 있으면 Supabase(Postgres)를 실제 사용자/이메일 인증/OAuth 식별자 저장소로 사용한다.
