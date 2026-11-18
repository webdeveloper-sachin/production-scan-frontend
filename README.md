# Production Scan Frontend (React + Vite + Tailwind)

```bash
npm install
npm run dev          # PC par: http://localhost:5173
npm run dev:phone    # phone se camera test: https://<PC-IP>:5173 (https zaroori)
```
Backend ke liye `.env` (VITE_PROXY_TARGET) dekho. Production build: `npm run build`.

## Pages
- `/scan`  : default page. Employee ID se login, phir QR scan (Employee: tailor / cutting master)
- `/my-earnings` : employee ki apni kamai, date/range, styles, PDF/CSV
- `/admin/login` : admin login
- `/admin/dashboard`, `orders`, `orders/sync`, `rates`, `styles`, `team`, `statements`

## CSV formats
- Orders: `style_number,size,color,channel`
- Rates: `pattern_number,rate`
- Styles: `style_number,pattern_number`  (pehle rates upload karo)
Har page par "Download template" button hai.
