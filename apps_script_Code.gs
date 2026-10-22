/**
 * TANTATAT Candidate Assessment — Google Apps Script Web App
 * -----------------------------------------------------------
 * หน้าที่: รับคำตอบจากหน้าแบบทดสอบ (assessment.html / index.html) แล้วบันทึกลง Google Sheet
 *
 * วิธีติดตั้ง (ทำครั้งเดียว):
 *  1. สร้าง Google Sheet ใหม่ แถวแรก (header) ใส่: timestamp | name | position | contact | duration | answers
 *  2. ในชีตนั้น เมนู Extensions → Apps Script → ลบโค้ดเดิม วางโค้ดนี้แทน
 *  3. Deploy → New deployment → ประเภท "Web app"
 *       - Execute as: Me
 *       - Who has access: Anyone
 *  4. Authorize แล้วคัดลอก Web app URL (ลงท้าย /exec)
 *  5. เอา URL /exec นั้นไปวางใน index.html ที่บรรทัด:  const ENDPOINT_URL = "...";
 *
 * ⚠️ ถ้าแก้โค้ดนี้ภายหลัง: Deploy → Manage deployments → (ดินสอ) แก้ไข →
 *     Version: New version → Deploy  เพื่อให้ URL /exec เดิมไม่เปลี่ยน
 *     (อย่าสร้าง New deployment ใหม่ เพราะ URL จะเปลี่ยนและต้องไปแก้ index.html อีกรอบ)
 */

function doPost(e) {
  try {
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var p = (e && e.parameter) ? e.parameter : {};
    sh.appendRow([
      p.timestamp || new Date().toISOString(),
      p.name     || '',
      p.position || '',
      p.contact  || '',
      p.duration || '',
      p.answers  || ''
    ]);
    return ContentService.createTextOutput('OK');
  } catch (err) {
    return ContentService.createTextOutput('ERR: ' + err);
  }
}

// เปิด URL /exec ตรง ๆ เพื่อเช็กว่า Web App ยังทำงาน (ควรเห็นคำว่า alive)
function doGet() {
  return ContentService.createTextOutput('alive');
}
