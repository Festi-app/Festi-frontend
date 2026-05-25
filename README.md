# Festi Frontend

대학 축제 운영을 위한 웹 앱(PWA)입니다. 일반 사용자, 부스 관리자, 축제 총 관리자 세 가지 역할을 지원합니다.

---

## 기술 스택

| 분류 | 라이브러리 |
|------|-----------|
| UI | React 19, TypeScript 6, TailwindCSS 4 |
| 라우팅 | React Router v7 |
| 서버 상태 | TanStack Query v5 |
| 클라이언트 상태 | Zustand |
| 폼 | React Hook Form |
| HTTP | Axios |
| 빌드 | Vite 8 |

---

## 시작하기

```bash
# 의존성 설치
pnpm install

# 환경변수 설정
cp .env.example .env   # VITE_API_BASE_URL 설정

# 개발 서버 실행 (http://localhost:3000)
pnpm dev
```

> 개발 서버는 `/api`, `/media` 경로를 `http://localhost:8080` 으로 프록시합니다.

---

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 실행 (port 3000) |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm preview` | 빌드 결과 미리보기 |
| `pnpm lint` | ESLint 실행 |
| `pnpm format` | Prettier 포맷 |
| `pnpm format:check` | Prettier 포맷 검사 |

---

## 환경변수

`.env` 파일을 루트에 생성하고 아래 값을 설정합니다.

```env
VITE_API_BASE_URL=http://localhost:8080
```

값이 없으면 `http://localhost:8080`이 기본값으로 사용됩니다.

---

## 역할 & 라우트

### USER (일반 사용자)

| 경로 | 설명 |
|------|------|
| `/home` | 홈 |
| `/map` | 배치도 |
| `/booths?type=day\|night\|truck` | 부스 목록 |
| `/booth?type=...&id=...` | 부스 상세 |
| `/waiting` | 웨이팅 현황 |
| `/waiting/register` | 웨이팅 등록 |
| `/waiting/detail` | 웨이팅 상세 |
| `/me` | 마이페이지 |

### FESTIVAL_ADMIN (총 관리자)

| 경로 | 설명 |
|------|------|
| `/admin/festival` | 축제 설정 |
| `/admin/booths` | 부스 배치 |
| `/admin/trucks` | 푸드트럭 관리 |
| `/admin/booth-requests` | 부스 신청 관리 |
| `/admin/timetable` | 공연 타임테이블 |
| `/admin/notices` | 공지 관리 |

### BOOTH_MANAGER (부스 관리자)

| 경로 | 설명 |
|------|------|
| `/booth-admin/login` | 로그인 |
| `/booth-admin/register` | 회원가입 |
| `/booth-admin` | 대시보드 |

---

## 프로젝트 구조

```
src/
├── assets/        # 정적 리소스
├── components/    # 공통 컴포넌트
├── constants/     # 라우트·엔드포인트 상수
├── features/      # 기능 단위 모듈
├── hooks/         # 커스텀 훅
├── lib/           # axios 클라이언트 설정
├── pages/         # 페이지 컴포넌트
│   ├── Admin/
│   ├── BoothAdmin/
│   └── User/
├── stores/        # Zustand 스토어
├── types/         # TypeScript 타입 정의
└── utils/         # 유틸리티 함수
```

---

## 인증

JWT 토큰을 `localStorage`에 저장하며, 토큰의 `role` 클레임에 따라 접근 가능한 라우트가 분리됩니다.

| role | 접근 가능 영역 |
|------|--------------|
| `USER` | 일반 사용자 페이지 |
| `FESTIVAL_ADMIN` | 총 관리자 페이지 |
| `BOOTH_MANAGER` | 부스 관리자 페이지 |

API 요청 시 `Authorization: Bearer <token>` 헤더가 자동으로 첨부됩니다.

---

## PWA

홈 화면에 추가(standalone 모드)를 지원합니다. standalone 환경에서는 상단 safe-area 및 레이아웃이 자동으로 조정됩니다.
