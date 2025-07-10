# Nu Speak 프로젝트 문제점

이 문서는 Nu Speak 프로젝트의 초기 설정 및 개발 과정에서 발생한 문제점들을 요약합니다.

## 1. PostgreSQL `psql` 명령어 찾을 수 없음

**설명:**

`psql -U postgres -d nuspeak -f setup.sql` 명령어를 사용하여 PostgreSQL에 `users` 테이블을 생성하려 할 때, "'psql'은 내부 또는 외부 명령, 실행할 수 있는 프로그램, 또는 배치 파일이 아닙니다."라는 오류가 발생했습니다.

**영향:**

-   `users` 테이블을 자동으로 생성할 수 없었습니다.
-   필요한 데이터베이스 스키마 없이는 백엔드 서버가 올바르게 작동하지 않습니다.

**해결 (수동 개입 필요):**

-   **PostgreSQL 설치 확인:** PostgreSQL이 시스템에 올바르게 설치되어 있는지 확인해야 합니다.
-   **PATH 환경 변수 추가:** `psql.exe`가 포함된 디렉토리(예: `C:\Program Files\PostgreSQL\<버전>\bin`)가 시스템의 PATH 환경 변수에 추가되었는지 확인해야 합니다.
-   **데이터베이스 생성:** `setup.sql` 스크립트를 실행하기 전에 `nuspeak` 데이터베이스를 수동으로 생성해야 합니다.

## 2. Git 푸시 권한 거부

**설명:**

원격 저장소(`rbwjdrla/nu-speak-team.git`)로 `git push`를 여러 번 시도했지만, `blessing0782` 계정에 대해 "권한 거부" 오류가 발생했습니다.

**영향:**

-   로컬 커밋을 원격 저장소에 푸시할 수 없어 협업 및 백업이 불가능했습니다.

**해결:**

-   **GitHub 개인 액세스 토큰(PAT):** 비밀번호 대신 개인 액세스 토큰(PAT)을 사용하여 인증함으로써 문제가 해결되었습니다.
-   **Windows 자격 증명 관리자:** 새로운 인증 정보(PAT)를 입력하도록 프롬프트를 띄우기 위해 Windows 자격 증명 관리자에서 기존 Git 자격 증명을 삭제해야 했습니다.

## 3. Tailwind CSS `npx` 및 직접 실행 문제

**설명:**

`npx tailwindcss init -p` 및 직접 실행(`node_modules/.bin/tailwindcss.cmd init -p`)을 사용하여 Tailwind CSS 구성을 초기화하려 했지만, "'tailwind'은 내부 또는 외부 명령, 실행할 수 있는 프로그램, 또는 배치 파일이 아닙니다."라는 오류가 발생했습니다.

**영향:**

-   Tailwind CSS 구성 파일(`postcss.config.js`, `tailwind.config.js`)을 자동으로 생성할 수 없었습니다.

**해결 (수동 파일 생성):**

-   `postcss.config.js` 및 `tailwind.config.js` 파일은 수동으로 생성하고 올바른 내용으로 채워 넣었습니다.
-   `@tailwind` 지시문은 `src/index.css`에 수동으로 추가되었습니다.

**추가 조사 필요:**

-   `tailwindcss`에 대한 `npx` 및 직접 실행 실패의 근본 원인은 아직 불분명합니다. 이는 시스템 PATH, npm 구성 또는 특정 Windows 환경 문제와 관련이 있을 수 있습니다. 해결책은 구현되었지만, 이 근본적인 문제를 이해하고 해결하는 것이 향후 개발에 도움이 될 것입니다.