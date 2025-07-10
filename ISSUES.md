# Nu Speak Project Issues

This document outlines the issues encountered during the setup and initial development of the Nu Speak project.

## 1. PostgreSQL `psql` Command Not Found

**Description:**

When attempting to create the `users` table in PostgreSQL using `psql -U postgres -d nuspeak -f setup.sql`, the command failed with a "'psql' is not recognized as an internal or external command" error.

**Impact:**

-   The `users` table could not be automatically created.
-   Backend server will not function correctly without the necessary database schema.

**Resolution (Manual Intervention Required):**

-   **Verify PostgreSQL Installation:** Ensure PostgreSQL is correctly installed on the system.
-   **Add to PATH:** Confirm that the directory containing `psql.exe` (e.g., `C:\Program Files\PostgreSQL\<version>\bin`) is added to the system's PATH environment variable.
-   **Database Creation:** The `nuspeak` database must be created manually before running the `setup.sql` script.

## 2. Git Push Permission Denied

**Description:**

Multiple attempts to `git push` to the remote repository (`rbwjdrla/nu-speak-team.git`) resulted in a "Permission denied" error for the `blessing0782` account.

**Impact:**

-   Local commits could not be pushed to the remote repository, preventing collaboration and backup.

**Resolution:**

-   **GitHub Personal Access Token (PAT):** The issue was resolved by using a Personal Access Token (PAT) for authentication instead of a password.
-   **Windows Credential Manager:** It was necessary to clear existing Git credentials from the Windows Credential Manager to prompt for new authentication details (PAT).

## 3. Tailwind CSS `npx` and Direct Execution Issues

**Description:**

Attempts to initialize Tailwind CSS configuration using `npx tailwindcss init -p` and direct execution (`node_modules/.bin/tailwindcss.cmd init -p`) failed with "'tailwind' is not recognized as an internal or external command" errors.

**Impact:**

-   Tailwind CSS configuration files (`postcss.config.js`, `tailwind.config.js`) could not be generated automatically.

**Resolution (Manual File Creation):**

-   The `postcss.config.js` and `tailwind.config.js` files were manually created and populated with the correct content.
-   The `@tailwind` directives were manually added to `src/index.css`.

**Further Investigation Needed:**

-   The root cause of `npx` and direct execution failures for `tailwindcss` remains unclear. This could be related to system PATH, npm configuration, or specific Windows environment quirks. While a workaround was implemented, understanding and resolving this underlying issue would be beneficial for future development.