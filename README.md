# Oleevia DocFlow (DMS)

Internal document workflow for purchase requests, renewals, TA/DA claims, and approvals.

## 9-stage procurement pipeline (Purchase & Renewal)

1. **Quote Analysis** — compare vendor quotes
2. **Collect Suggestion** — from the responsible person
3. **Evaluation & Recommendation**
4. **Proforma Invoice** — upload
5. **Pre-Audit**
6. **Audit**
7. **Approval** — select vendor
8. **Fund Processing** — accounts releases funds
9. **Upload Final Invoice** → Completed

Other types (TA/DA, CEO): Pending → Approved → Paid.

## Demo logins

| Role | Employee ID | Password |
|------|-------------|----------|
| Admin | OGC100 | Admin@123 |
| User | OGC111 | Welcome@123 |
| Approver | OGC112 | Welcome@123 |
| Accounts | OGC113 | Welcome@123 |

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Vercel (public link)

1. Go to https://vercel.com/new
2. Import this GitHub repo **or** drag-and-drop the project folder
3. Framework: **Vite**
4. Deploy and copy the URL

## Notes

- Demo data in browser localStorage
- Passwords hashed client-side (SHA-256 + salt)
