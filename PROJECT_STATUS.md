# Nu Speak 프로젝트 현황

이 문서는 Nu Speak 프로젝트의 현재 진행 상황, 해결된 문제, 그리고 향후 계획을 요약합니다.

## 1. 프로젝트 개요

nu:speak은 AI-Agent를 통해 사용자에게 실시간 개인 맞춤형 뉴스를 추천하고, 요약/음성/만화 등 다양한 형식으로 콘텐츠를 가공해 제공하는 차세대 뉴스 소비 플랫폼입니다.

-   **프론트엔드:** React (Tailwind CSS)
-   **백엔드:** Node.js (Express)
-   **데이터베이스:** PostgreSQL
-   **AI 에이전트:** LangChain 등 (예정)

## 2. 완료된 작업

### 백엔드 설정 (`nuspeak/backend`)

-   Node.js 프로젝트 초기화 및 `express`, `cors`, `jsonwebtoken`, `bcrypt`, `pg` 등 핵심 의존성 모듈 설치 완료.
-   PostgreSQL 데이터베이스 연결(`db.js`) 구성 완료.
-   기본적인 서버 구조 설정 및 사용자 회원가입(`/register`), 로그인(`/login`)을 위한 기본 API 엔드포인트 구현 완료.
-   `users` 테이블 생성을 위한 `setup.sql` 스크립트 작성 완료.
-   **NewsAPI.org 연동:**
    -   `node-fetch` 모듈 설치 및 백엔드에 NewsAPI.org 연동 엔드포인트 (`/news`) 구현 완료.
    -   NewsAPI 키를 환경 변수(`NEWS_API_KEY`)로 관리하도록 설정.
-   **JWT 인증 및 사용자 선호도 관리:**
    -   `express-jwt` 모듈 설치 및 JWT 인증 미들웨어 구현 완료.
    -   JWT Secret을 환경 변수(`JWT_SECRET`)로 관리하도록 설정.
    -   `users` 테이블에 `preferences` 컬럼 추가 및 데이터베이스 스키마 업데이트 완료.
    -   사용자 선호도 조회 (`GET /user/preferences`) 및 업데이트 (`POST /user/preferences`) API 엔드포인트 구현 완료.
    -   `/news` 엔드포인트에서 로그인한 사용자의 선호도를 기반으로 NewsAPI.org 쿼리를 동적으로 생성하도록 로직 구현 완료.

### 프론트엔드 설정 (`nuspeak/frontend`)

-   `create-react-app`을 사용한 React 프로젝트 생성 완료.
-   Tailwind CSS, PostCSS, Autoprefixer 설치 및 프로젝트 연동 설정 완료.
-   `tailwind.config.js`, `postcss.config.js` 설정 및 `src/index.css`에 Tailwind 지시문 추가 완료.
-   `axios`, `tailwindcss-animate` 등 필요한 프론트엔드 의존성 모듈 설치 완료.
-   **메인 페이지 (`MainPage.js`) 디자인 및 기능 구현:**
    -   `nuspeak-homepage`의 메인 페이지 디자인을 참고하여 `MainPage.js` 레이아웃 및 Tailwind CSS 스타일 적용 완료.
    -   메인 페이지 문구 및 텍스트 정렬 수정 완료.
    -   불필요한 버튼 제거 완료.
    -   백엔드 `/news` 엔드포인트와 연동하여 실제 뉴스 기사 목록 표시 기능 구현 완료.
-   **사용자 선호도 선택 팝업 구현:**
    -   `PreferenceModal.js` 컴포넌트 구현 완료.
    -   로그인 성공 시 (또는 회원가입 후 자동 로그인 시) 사용자의 선호도가 설정되어 있지 않으면 `PreferenceModal`이 표시되도록 로직 구현 완료.
    -   선택된 선호도를 백엔드 API로 전송하는 기능 구현 완료.
-   **로그인/회원가입 플로우 개선:**
    -   로그인 성공 시 메인 페이지로 이동하도록 `Login.js` 수정 완료.
    -   회원가입 성공 후 자동 로그인 및 선호도 팝업 로직 트리거되도록 `Register.js` 및 `App.js` 수정 완료.

## 3. 발생 가능한 문제점 및 해결 방안 (Potential Issues and Solutions)

프로젝트 진행 중 발생할 수 있는 일반적인 문제점과 해결 방안을 안내합니다.

-   **문제점: `npm install` 또는 `npm start` 시 모듈 관련 오류**
    -   **원인:** `package.json`에 명시된 의존성 모듈이 제대로 설치되지 않았거나, 버전 충돌이 발생했을 수 있습니다.
    -   **해결:** 해당 프로젝트 디렉토리(`nuspeak/backend` 또는 `nuspeak/frontend`)에서 `npm install`을 다시 실행하여 모든 의존성을 설치합니다. `npm cache clean --force` 후 재시도하거나, `node_modules` 폴더와 `package-lock.json` 파일을 삭제한 후 `npm install`을 다시 실행해 볼 수 있습니다.

-   **문제점: 포트 충돌 (`Something is already running on port XXXX`)**
    -   **원인:** 백엔드(기본 3001) 또는 프론트엔드(기본 3000) 포트가 다른 애플리케이션에 의해 이미 사용 중입니다.
    -   **해결:** 해당 포트를 사용 중인 프로세스를 종료합니다. Windows의 경우 명령 프롬프트에서 `netstat -ano | findstr :XXXX` (XXXX는 포트 번호)로 PID를 찾고, `taskkill /PID YOUR_PID_HERE /F`로 종료합니다. 또는 `PORT=YYYY npm start`와 같이 다른 포트를 지정하여 실행합니다.

-   **문제점: 환경 변수 미설정 또는 잘못된 설정**
    -   **원인:** `NEWS_API_KEY` 또는 `JWT_SECRET` 환경 변수가 백엔드 서버를 실행하는 터미널 세션에 올바르게 설정되지 않았습니다.
    -   **해결:** 백엔드 서버를 실행하기 전에 `set NEWS_API_KEY=YOUR_KEY` 및 `set JWT_SECRET=YOUR_SECRET` (Windows CMD 기준) 명령어를 **동일한 터미널**에서 실행했는지 확인합니다. 오타나 불필요한 공백이 없는지 주의 깊게 확인합니다.

-   **문제점: NewsAPI.org에서 뉴스 가져오기 실패 (`Failed to fetch news` 또는 빈 뉴스 목록)**
    -   **원인:**
        1.  `NEWS_API_KEY`가 유효하지 않거나, 요청 제한에 도달했을 수 있습니다.
        2.  NewsAPI.org의 특정 엔드포인트(예: `top-headlines`)가 해당 쿼리(예: `country=kr`)에 대한 뉴스를 제공하지 않을 수 있습니다.
        3.  백엔드 서버에서 NewsAPI.org로의 네트워크 연결 문제가 발생했을 수 있습니다.
    -   **해결:**
        1.  NewsAPI.org 대시보드에서 API 키의 유효성을 확인하고, 직접 브라우저에서 API URL을 테스트하여 응답을 확인합니다.
        2.  백엔드 코드에서 `everything` 엔드포인트와 더 넓은 검색어(`q=korea&language=ko`)를 사용하는지 확인합니다.
        3.  백엔드 서버 터미널에 출력되는 로그(`Error fetching news:`)를 확인하여 구체적인 오류 메시지를 파악합니다.

-   **문제점: `TypeError: fetch is not a function` (백엔드)**
    -   **원인:** `node-fetch` 모듈이 Node.js 환경에서 `fetch` 함수로 올바르게 임포트되지 않았습니다.
    -   **해결:** `nuspeak/backend/index.js` 파일에서 `const fetch = require('node-fetch').default;`와 같이 `node-fetch`를 `default` 속성으로 임포트하도록 수정합니다.

-   **문제점: 프론트엔드 스타일/레이아웃 문제 (예: 배경색, 정렬)**
    -   **원인:** Tailwind CSS 설정(`tailwind.config.js`, `postcss.config.js`)이 올바르지 않거나, CSS 변수 해석에 문제가 있거나, 브라우저 캐싱 문제일 수 있습니다.
    -   **해결:**
        1.  `tailwind.config.js`의 색상 정의가 `rgb()`와 같이 명확한 값으로 설정되었는지 확인합니다.
        2.  `postcss-preset-env`와 같은 PostCSS 플러그인이 설치 및 설정되었는지 확인합니다.
        3.  프론트엔드 개발 서버를 완전히 재시작하고, 브라우저 캐시를 지운 후(Ctrl+Shift+R 또는 Cmd+Shift+R) 다시 확인합니다.

-   **문제점: 로그인/회원가입 후 예상과 다른 동작 (예: 팝업이 바로 뜸)**
    -   **원인:** 로그인/회원가입 성공 후 리다이렉션 로직이나 상태 관리 로직이 예상과 다르게 작동합니다.
    -   **해결:** `App.js`, `Login.js`, `Register.js` 파일의 `onLoginSuccess` 콜백 호출 및 `navigate` 로직을 확인하여 의도한 대로 동작하는지 검토합니다.

## 4. 향후 계획

-   사용자 피드백 반영 및 UI/UX 개선.
-   뉴스 요약, 음성 변환, 만화 변환 등 AI 에이전트 기능 구현.
-   추천 시스템 고도화 (사용자 행동 로그 기반).
-   배포 환경 구축 및 최적화.