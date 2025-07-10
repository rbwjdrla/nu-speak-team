# Nu Speak

AI 기반 개인 맞춤형 뉴스 추천 시스템 프로젝트입니다.

## 프로젝트 개요

nu:speak은 AI-Agent를 통해 사용자에게 실시간 개인 맞춤형 뉴스를 추천하고, 요약/음성/만화 등 다양한 형식으로 콘텐츠를 가공해 제공하는 차세대 뉴스 소비 플랫폼입니다.

## 시스템 구성

-   **프론트엔드:** React (Tailwind CSS)
-   **백엔드:** Node.js (Express)
-   **데이터베이스:** PostgreSQL
-   **AI 에이전트:** LangChain 등 (예정)

## 시작하기

이 프로젝트를 로컬 환경에서 실행하려면 다음 단계를 따르세요.

### 1. 필수 설치 항목

프로젝트를 실행하기 전에 다음 소프트웨어가 시스템에 설치되어 있는지 확인하세요.

-   **Node.js & npm:** 백엔드 및 프론트엔드 애플리케이션 실행에 필요합니다. [Node.js 공식 웹사이트](https://nodejs.org/)에서 다운로드 및 설치할 수 있습니다.
-   **PostgreSQL:** 백엔드 데이터베이스로 사용됩니다. [PostgreSQL 공식 웹사이트](https://www.postgresql.org/download/)에서 다운로드 및 설치할 수 있습니다.
    -   **데이터베이스 설정:** `nuspeak`이라는 이름의 데이터베이스를 생성해야 합니다. (예: `CREATE DATABASE nuspeak;`)
    -   `psql` 명령어를 사용하려면 PostgreSQL 설치 경로의 `bin` 디렉토리가 시스템 PATH 환경 변수에 추가되어 있어야 합니다.

### 2. 프로젝트 설정

1.  **저장소 클론:**

    ```bash
    git clone https://github.com/rbwjdrla/nu-speak-team.git
    cd nu-speak-team
    ```

2.  **백엔드 설정:**

    ```bash
    cd nuspeak/backend
    npm install
    # 데이터베이스 테이블 생성 (PostgreSQL이 설치되어 있고 PATH에 추가된 경우)
    # psql -U postgres -d nuspeak -f setup.sql
    # 위 명령이 작동하지 않으면, setup.sql 파일을 열어 SQL 쿼리를 수동으로 실행하세요.
    cd ../..
    ```

3.  **프론트엔드 설정:**

    ```bash
    cd nuspeak/frontend
    npm install
    cd ../..
    ```

### 3. 프로젝트 실행

1.  **백엔드 서버 실행:**

    ```bash
    cd nuspeak/backend
    node index.js &
    cd ../..
    ```

2.  **프론트엔드 애플리케이션 실행:**

    ```bash
    cd nuspeak/frontend
    npm start
    cd ../..
    ```

## 현재 진행 상황

-   **백엔드:** Node.js 프로젝트 초기화, Express, CORS, JWT, Bcrypt, pg 모듈 설치 및 기본 서버 구조(회원가입/로그인 라우트) 설정 완료. PostgreSQL 연결 구성 및 `users` 테이블 생성을 위한 `setup.sql` 파일 준비.
-   **프론트엔드:** React 애플리케이션 생성, Tailwind CSS 및 관련 의존성 설치 및 설정 완료.

자세한 내용은 `PROGRESS.md` 파일을 참조하세요.

## 미해결 문제점

-   **PostgreSQL `psql` 명령어 찾을 수 없음:** `psql` 명령어가 시스템 PATH에 제대로 설정되지 않아 `setup.sql` 실행에 문제가 있습니다. 수동으로 데이터베이스를 생성하고 SQL 쿼리를 실행해야 할 수 있습니다.
-   **Tailwind CSS `npx` 및 직접 실행 문제:** `npx tailwindcss init -p` 명령어가 제대로 작동하지 않아 `postcss.config.js` 및 `tailwind.config.js` 파일을 수동으로 생성했습니다. 이 문제의 근본 원인 파악이 필요합니다.

자세한 내용은 `ISSUES.md` 파일을 참조하세요.