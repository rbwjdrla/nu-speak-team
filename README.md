# Nu Speak

AI 기반 개인 맞춤형 뉴스 추천 시스템 프로젝트입니다.

## 프로젝트 개요

nu:speak은 AI-Agent를 통해 사용자에게 실시간 개인 맞춤형 뉴스를 추천하고, 요약/음성/만화 등 다양한 형식으로 콘텐츠를 가공해 제공하는 차세대 뉴스 소비 플랫폼입니다.

## 시작하기

프로젝트를 로컬 환경에서 설정하고 실행하는 방법에 대한 가이드입니다.

### 1. 필수 설치 항목

프로젝트를 실행하기 위해 다음 소프트웨어가 설치되어 있어야 합니다:

-   **Node.js**: v14 이상 (npm 포함)
-   **PostgreSQL**: 데이터베이스 서버

### 2. 환경 변수 설정

프로젝트는 민감한 정보를 환경 변수로 관리합니다. 백엔드 서버를 실행하기 전에 다음 환경 변수를 설정해야 합니다.

#### a. NewsAPI Key (`NEWS_API_KEY`)

-   **용도**: 뉴스 데이터를 가져오기 위한 NewsAPI.org의 API 키입니다.
-   **획득 방법**: [NewsAPI.org](https://newsapi.org/)에 접속하여 무료 개발자 계정을 생성하고 API 키를 발급받으세요. (한국 뉴스 지원)
-   **설정 방법**: 백엔드 서버를 실행할 터미널에서 다음 명령어를 입력합니다. `YOUR_NEWS_API_KEY`를 발급받은 실제 키로 대체하세요.
    -   **Windows (명령 프롬프트)**:
        ```cmd
        set NEWS_API_KEY=YOUR_NEWS_API_KEY
        ```
    -   **Windows (PowerShell)**:
        ```powershell
        $env:NEWS_API_KEY="YOUR_NEWS_API_KEY"
        ```

#### b. JWT Secret (`JWT_SECRET`)

-   **용도**: 사용자 인증(JWT)을 위한 비밀 키입니다. 이 키는 직접 생성해야 합니다.
-   **획득 방법**: 강력하고 예측 불가능한 문자열을 직접 생성합니다. 최소 32자 이상, 대소문자, 숫자, 특수문자를 포함하는 것이 좋습니다. 예를 들어, Node.js 환경에서 다음 명령어를 실행하여 생성할 수 있습니다:
    ```bash
    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
    ```
-   **설정 방법**: `NEWS_API_KEY`를 설정한 **동일한 터미널**에서 다음 명령어를 입력합니다. `YOUR_GENERATED_JWT_KEY`를 방금 생성한 실제 키로 대체하세요.
    -   **Windows (명령 프롬프트)**:
        ```cmd
        set JWT_SECRET=YOUR_GENERATED_JWT_KEY
        ```
    -   **Windows (PowerShell)**:
        ```powershell
        $env:JWT_SECRET="YOUR_GENERATED_JWT_KEY"
        ```

### 3. 데이터베이스 설정

1.  PostgreSQL 서버가 실행 중인지 확인합니다.
2.  PostgreSQL 클라이언트(예: `psql`, pgAdmin)에 접속합니다.
3.  `nuspeak` 데이터베이스를 생성합니다:
    ```sql
    CREATE DATABASE nuspeak;
    ```
4.  생성된 `nuspeak` 데이터베이스에 연결합니다:
    ```sql
    \c nuspeak;
    ```
5.  테이블 스키마를 적용합니다. `D:/github/nu-speak-team/nuspeak/backend/setup.sql` 파일의 경로를 정확히 지정해야 합니다:
    ```sql
    \i D:/github/nu-speak-team/nuspeak/backend/setup.sql
    ```
    (만약 `psql` 명령어를 찾을 수 없다면, PostgreSQL 설치 경로의 `bin` 디렉토리를 시스템 PATH 환경 변수에 추가해야 합니다.)

### 4. 백엔드 실행

1.  **환경 변수 설정**: 위 2단계에서 설명한 `NEWS_API_KEY`와 `JWT_SECRET` 환경 변수를 백엔드 서버를 실행할 터미널에 설정합니다.
2.  백엔드 디렉토리로 이동하여 의존성 모듈을 설치합니다:
    ```bash
    cd nuspeak/backend
    npm install
    ```
3.  백엔드 서버를 실행합니다:
    ```bash
    node index.js
    ```
    서버는 기본적으로 `http://localhost:3001`에서 실행됩니다.

### 5. 프론트엔드 실행

1.  프론트엔드 디렉토리로 이동하여 의존성 모듈을 설치합니다:
    ```bash
    cd nuspeak/frontend
    npm install
    ```
2.  프론트엔드 개발 서버를 실행합니다:
    ```bash
    npm start
    ```
    개발 서버는 기본적으로 `http://localhost:3000`에서 실행되며, 웹 브라우저가 자동으로 열립니다.

### 6. 문제 해결 (Troubleshooting)

-   **`Something is already running on port XXXX`**: 해당 포트를 사용 중인 다른 애플리케이션을 종료하거나, `PORT=YYYY npm start`와 같이 다른 포트를 지정하여 실행합니다.
    -   Windows에서 포트 사용 프로세스 찾기: `netstat -ano | findstr :XXXX` (XXXX는 포트 번호)
    -   프로세스 종료: `taskkill /PID YOUR_PID_HERE /F`
-   **`Failed to fetch news` 또는 뉴스 표시 안됨**: 
    -   백엔드 서버가 실행 중인지 확인합니다.
    -   백엔드 서버 터미널에 오류 메시지가 없는지 확인합니다. (`TypeError: fetch is not a function` 등)
    -   `NEWS_API_KEY`가 올바르게 설정되었는지 확인합니다. (NewsAPI.org에서 직접 테스트)
    -   브라우저 캐시를 지우고 새로고침합니다 (Ctrl+Shift+R 또는 Cmd+Shift+R).
-   **메인 페이지 배경색/스타일 문제**: 
    -   `tailwind.config.js` 및 `postcss.config.js` 설정이 올바른지 확인합니다.
    -   브라우저 캐시를 지우고 새로고침합니다.

## 프로젝트 현황

자세한 진행 상황 및 이슈 관리는 [PROJECT_STATUS.md](./PROJECT_STATUS.md) 파일을 참조하세요.