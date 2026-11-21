# **System Architecture – AI-Assisted Budgeting App**  
## **1. Project Overview**  
An AI-assisted personal budgeting application designed for Filipino employees and young professionals.  
The application helps users track expenses, manage budgets, monitor cash flow, and receive AI-powered financial insights.  
## **2. Technology and Development Tools**  
  
|  |  |  
| - | - |  
| **Tool** |  **Purpose** |  
| Bolt |  UI prototyping |  
| Codex |  Development, testing, code review |  
| Cursor |  Code editing and inspection |  
| GitHub |  Version control and collaboration |  
| GitHub Actions |  Automated CI/CD checks |  
| Vercel |  Application hosting |  
| OpenAI API |  AI-powered insights |  
  
## **3. Core Application Modules**  
- **Expense Tracking:** Record and categorize expenses manually.  
- **Budget Management:** Create monthly budgets and spending limits.  
- **Recurring Bills:** Track recurring payments and reminders.  
- **Cash Flow:** Monitor income, payday, and projected expenses.  
- **AI Financial Insights:** Analyze spending patterns and provide recommendations.  
- **Savings Recommendations:** Suggest realistic ways to improve savings.  
Future enhancement: Bank and e-wallet integrations.  
## **4. High-Level Architecture**  
### **Frontend**  
- User interface and dashboard  
- Expense and budget management  
- Financial reports and visualizations  
- AI insights interface  
### **Backend**  
- Authentication and authorization  
- Expense and income processing  
- Budget calculations  
- Recurring bill management  
- AI request handling  
### **Database**  
- User profiles  
- Income records  
- Expense records  
- Budget information  
- Recurring bills  
- AI insight history  
### **AI Integration**  
- OpenAI API  
- Spending pattern analysis  
- Personalized budgeting recommendations  
- Savings suggestions  
**Important:** Financial calculations must be handled by application logic or database queries, not delegated to AI. AI should interpret verified financial data and explain insights.  
## **5. Application Flow**  
1. User signs in.  
2. User records income and expenses.  
3. Application stores financial records.  
4. Backend calculates balances, budgets, and spending patterns.  
5. AI receives relevant, minimized financial summaries.  
6. AI generates insights and recommendations.  
7. User views results on the dashboard.  
## **6. Security and Privacy**  
- Protect user financial information.  
- Secure authentication and authorization.  
- Never expose API keys in frontend code.  
- Store production secrets in Vercel environment variables.  
- Use GitHub Actions secrets for CI/CD credentials.  
- Never commit .env files.  
- Validate and authorize all financial data operations.  
- Send only necessary financial information to AI services.  
## **7. Deployment Architecture**  
- GitHub: Source of truth.  
- GitHub Actions: Automated linting, type checking, testing, and deployment checks.  
- Vercel: Preview and production deployments.  
- OpenAI: Runtime AI services.  
## **8. Development Strategy**  
1. Establish architecture and technology decisions.  
2. Finalize product requirements.  
3. Define AI coding instructions.  
4. Break development into small tasks.  
5. Prototype UI using Bolt.  
6. Implement features using Codex.  
7. Review and test changes.  
8. Merge approved changes through GitHub.  
9. Deploy through Vercel.  
## **9. Pending Technical Decisions**  
Finalize before implementation:  
- Frontend framework  
- Backend/API architecture  
- Database provider  
- Authentication provider  
- Hosting and database integration  
- AI model and API configuration  
## **10. Architecture Principles**  
- Keep the MVP simple.  
- Prioritize financial data accuracy.  
- Protect user privacy.  
- Separate AI responsibilities from financial calculations.  
- Build modular and maintainable components.  
- Use automated testing before deployment.  
   
