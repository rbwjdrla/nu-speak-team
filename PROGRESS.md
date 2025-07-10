# Nu Speak 프로젝트 진행 상황

이 문서는 Nu Speak 프로젝트의 현재 진행 상황을 요약하며, 백엔드 및 프론트엔드 구성 요소의 설정을 자세히 설명합니다.

## 1. 백엔드 설정

**위치:** `nuspeak/backend`

**설명:**

-   Node.js 프로젝트를 초기화했습니다.
-   백엔드 서버에 필요한 핵심 의존성 모듈들을 설치했습니다.
-   사용자 회원가입 및 로그인 라우트를 포함한 기본적인 서버 구조를 설정했습니다.
-   PostgreSQL 데이터베이스 연결을 구성했습니다.

**설치된 모듈 및 프레임워크 (package.json 기준):**

-   `express`: Node.js를 위한 웹 프레임워크.
-   `cors`: 교차 출처 리소스 공유(CORS)를 활성화하기 위한 미들웨어.
-   `jsonwebtoken`: JSON 웹 토큰(JWT) 생성 및 검증을 위한 라이브러리.
-   `bcrypt`: 비밀번호 해싱을 위한 라이브러리.
-   `pg`: Node.js를 위한 PostgreSQL 클라이언트.

**생성된 파일:**

-   `package.json`: Node.js 프로젝트 설정 파일.
-   `package-lock.json`: 의존성 잠금 파일.
-   `db.js`: PostgreSQL 데이터베이스 연결 풀 설정 파일.
-   `index.js`: `/register` 및 `/login` 라우트를 포함하는 메인 백엔드 서버 파일.
-   `setup.sql`: PostgreSQL에 `users` 테이블을 생성하기 위한 SQL 스크립트.

## 2. 프론트엔드 설정

**위치:** `nuspeak/frontend`

**설명:**

-   `create-react-app`을 사용하여 새로운 React 애플리케이션을 생성했습니다.
-   Tailwind CSS 및 관련 PostCSS 의존성 모듈들을 설치했습니다.
-   React 프로젝트에서 Tailwind CSS를 사용하도록 구성했습니다.

**설치된 모듈 및 프레임워크 (package.json 기준):**

-   `react`, `react-dom`, `react-scripts`: 핵심 React 애플리케이션 의존성.
-   `@testing-library/jest-dom`, `@testing-library/react`, `@testing-library/user-event`: 테스트 유틸리티.
-   `web-vitals`: 웹 바이탈 측정을 위한 라이브러리.
-   `tailwindcss`: 유틸리티 우선 CSS 프레임워크.
-   `postcss`: JavaScript 플러그인으로 CSS를 변환하는 도구.
-   `autoprefixer`: CSS를 파싱하고 벤더 프리픽스를 추가하는 PostCSS 플러그인.

**수정/생성된 파일:**

-   `package.json`: React 프로젝트 설정 파일 (Tailwind CSS 스크립트 추가).
-   `package-lock.json`: 의존성 잠금 파일.
-   `postcss.config.js`: Tailwind CSS 및 Autoprefixer를 위한 PostCSS 설정 파일.
-   `tailwind.config.js`: Tailwind CSS 설정 파일.
-   `src/index.css`: Tailwind CSS 기본, 컴포넌트, 유틸리티 지시문을 포함하도록 수정.