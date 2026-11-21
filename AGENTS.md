# **AGENTS.md – AI Coding Agent Instructions**  
## **1. Project Context**  
This repository contains an AI-assisted personal budgeting application focused initially on Filipino users.  
Before implementing features, read:  
- docs/architecture.md  
- spec.md  
- tasks.md  
Follow these documents as the project's source of truth.  
## **2. General Development Rules**  
- Keep implementations simple, modular, and maintainable.  
- Avoid unnecessary dependencies.  
- Follow established project conventions.  
- Do not introduce unrelated changes.  
- Do not implement features outside the approved scope.  
- Ask for clarification when requirements are ambiguous.  
- Explain significant technical decisions.  
## **3. Financial Data Rules**  
- Financial calculations must use application logic, not AI-generated arithmetic.  
- Use appropriate precision for monetary values.  
- Default currency is PHP (₱).  
- Validate financial inputs.  
- Never silently modify financial records.  
- Ensure dashboard totals match transaction records.  
## **4. AI Integration Rules**  
- Keep AI integration on the server side.  
- Never expose AI API keys in frontend code.  
- Send only necessary financial information to AI services.  
- Treat AI responses as recommendations, not authoritative financial calculations.  
- Handle API failures and unexpected responses gracefully.  
## **5. Security Rules**  
### **Secrets and API Keys**  
- Never expose API keys, access tokens, passwords, private keys, or credentials in frontend code.  
- Never hardcode secrets in source code, configuration files, or documentation.  
- Never commit .env files, credentials, or secret values to GitHub.  
- Use environment variables for all sensitive configuration.  
- Keep .env.example limited to variable names and safe placeholders.  
- Store production secrets in Vercel Environment Variables.  
- Store CI/CD credentials in GitHub Actions Secrets.  
- Never print, log, or expose secrets in application logs or error messages.  
- Use server-side API routes for services requiring secret API keys.  
- Never expose secret environment variables through public frontend environment prefixes.  
- Rotate any credentials accidentally exposed or committed.  
### **Authentication and Data Protection**  
- Enforce authentication and authorization.  
- Protect user-specific financial records.  
- Validate and sanitize external inputs.  
- Never bypass security checks for convenience.  
- Use HTTPS for production communication.  
- Apply least-privilege access to services and credentials.  
- Avoid sending unnecessary personal or financial information to external AI services.  
-    
## **6. Coding Standards**  
- Use clear and descriptive naming.  
- Prefer small, reusable functions.  
- Avoid duplicated logic.  
- Add comments only when they improve understanding.  
- Maintain consistent formatting.  
- Avoid unnecessary abstractions.  
## **7. Testing Requirements**  
- Add tests for new functionality.  
- Test financial calculations carefully.  
- Test edge cases and invalid inputs.  
- Run relevant tests before completing a task.  
- Never claim tests passed without actually running them.  
## **8. Git and GitHub Rules**  
- Work on feature branches whenever practical.  
- Use descriptive commit messages.  
- Keep commits focused.  
- Do not push directly to production without approval.  
- Do not overwrite existing user changes.  
- Review changes before committing.  
## **9. Development Workflow**  
For every task:  
1. Read the relevant documentation.  
2. Inspect the existing code.  
3. Understand the requirements.  
4. Propose an implementation approach.  
5. Make focused changes.  
6. Run relevant tests and checks.  
7. Review the resulting changes.  
8. Summarize what changed and any remaining issues.  
## **10. Definition of Done**  
A task is complete only when:  
- Requirements are satisfied.  
- Code follows project conventions.  
- Relevant tests pass.  
- Security concerns are addressed.  
- No unrelated files are modified.  
- Implementation details are summarized.  
   
