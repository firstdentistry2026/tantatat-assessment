# TANTATAT Candidate Assessment — Deploy Bundle

ชุดไฟล์สำหรับนำขึ้น **Netlify** (ผูกกับ **GitHub**) — เว็บแบบ static ไฟล์เดียวจบ ไม่ต้องมี build step

## ไฟล์ในชุดนี้
| ไฟล์ | หน้าที่ |
|------|---------|
| `index.html` | เว็บแบบทดสอบทั้งหมด (ผู้สมัคร + HR Admin ในไฟล์เดียว) — self-contained มีโลโก้/สคริปต์/เฉลยเข้ารหัสฝังอยู่ในตัว |
| `netlify.toml` | ตั้งค่า Netlify (publish ที่ root, ไม่มี build command) |
| `.gitignore` | ไฟล์ที่ไม่ต้องขึ้น Git |
| `apps_script_Code.gs` | โค้ด Google Apps Script (ตัวรับคำตอบไปเก็บใน Google Sheet) |

> **รหัสเข้า HR Admin:** `2468`
> เฉลยถูกเข้ารหัส AES-GCM ด้วยรหัสนี้ — เปลี่ยนรหัสต้องเข้ารหัสเฉลยใหม่ (แจ้งได้ถ้าต้องการ)

---

## ส่วนที่ 1 — ขึ้น GitHub + Netlify

### A) สร้าง GitHub repo
1. สร้าง repo ใหม่บน GitHub (เช่น `tantatat-assessment`) — Public หรือ Private ก็ได้
2. อัปโหลดไฟล์ทั้งหมดในโฟลเดอร์นี้เข้า repo (ผ่านเว็บ GitHub: **Add file → Upload files** ลากไฟล์ทั้งหมดเข้าไป แล้ว Commit)
   - หรือใช้ git:
     ```bash
     git init
     git add .
     git commit -m "TANTATAT assessment"
     git branch -M main
     git remote add origin https://github.com/<user>/tantatat-assessment.git
     git push -u origin main
     ```

### B) เชื่อม Netlify กับ GitHub
1. เข้า https://app.netlify.com → **Add new site → Import an existing project**
2. เลือก **GitHub** → เลือก repo `tantatat-assessment`
3. ตั้งค่า build:
   - **Build command:** เว้นว่าง
   - **Publish directory:** `.` (จุด = root)
4. กด **Deploy** — เสร็จแล้วจะได้ URL เช่น `https://<ชื่อ>.netlify.app`
5. (ถ้าต้องการ) เปลี่ยนชื่อ site: **Site configuration → Change site name**

> ทุกครั้งที่ push โค้ดใหม่ขึ้น GitHub branch `main` Netlify จะ deploy ให้อัตโนมัติ

---

## ส่วนที่ 2 — Google Apps Script (ตัวเก็บคำตอบ)

1. สร้าง Google Sheet ใหม่ · แถวแรกใส่ header: `timestamp | name | position | contact | duration | answers`
2. เมนู **Extensions → Apps Script** → ลบโค้ดเดิม วางโค้ดจาก `apps_script_Code.gs`
3. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Authorize → คัดลอก **Web app URL** (ลงท้าย `/exec`)
5. เปิด `index.html` หาบรรทัดนี้แล้ววาง URL `/exec`:
   ```js
   const ENDPOINT_URL = "วาง_URL_/exec_ที่นี่";
   ```

> ⚠️ แก้โค้ด `.gs` ภายหลัง → **Deploy → Manage deployments → (ดินสอ) → Version: New version → Deploy** (URL เดิมไม่เปลี่ยน)

---

## ส่วนที่ 3 — ให้ HR อ่านผลจาก Google Sheet

หน้า HR Admin ดึงข้อมูลผ่านลิงก์ **Publish to web (CSV)** ของ Sheet:
1. ใน Sheet: **File → Share → Publish to web** → เลือกชีต, รูปแบบ **CSV** → **Publish** → คัดลอกลิงก์ (ลงท้าย `output=csv`)
2. เปิด `index.html` หาบรรทัด:
   ```js
   const DEFAULT_CSV_URL = "วาง_ลิงก์_CSV_ที่นี่";
   ```
   วางลิงก์ CSV ลงไป (มีฝังลิงก์ตัวอย่างไว้แล้ว เปลี่ยนเป็นของคุณได้)
3. เข้าโหมด HR Admin (รหัส `2468`) → กด **โหลด/รีเฟรช** หรือใช้ **วางข้อมูลเอง**

> หมายเหตุ: เมื่อ deploy บน Netlify (https จริง) การดึง CSV จะทำงานได้ปกติ — ปัญหา “Failed to fetch” เกิดเฉพาะตอนเปิดไฟล์แบบ file:// หรือในพรีวิว sandbox เท่านั้น

---

## สรุป flow การทำงาน
```
ผู้สมัครเปิดเว็บ Netlify → ทำ 60 ข้อ (จับเวลา 60 นาที) → กดส่ง
        │  (hidden form POST)
        ▼
Apps Script /exec → เขียนลง Google Sheet
        │  (Publish to web → CSV)
        ▼
HR Admin (รหัส 2468) → โหลด CSV → ดูคะแนน/เปรียบเทียบ/Export PDF-PNG-CSV
```
