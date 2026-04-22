// ================================================================
//  AN AN HOA NGU - Google Apps Script nhan data tu Landing Page
//  Deploy as: Web App > Execute as: Me > Access: Anyone
// ================================================================

var SHEET_NAME = 'Leads Landing Page';
var NOTIFY_EMAIL = 'ananhoangu@gmail.com';

// ----------------------------------------------------------------
// Ham chinh: nhan POST request tu landing page
// ----------------------------------------------------------------
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    writeToSheet(data);
    if (NOTIFY_EMAIL) sendNotification(data);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET request (test)
function doGet(e) {
  return ContentService
    .createTextOutput('An An Hoa Ngu - Apps Script dang hoat dong!')
    .setMimeType(ContentService.MimeType.TEXT);
}

// ----------------------------------------------------------------
// Ghi data vao Google Sheet
// ----------------------------------------------------------------
function writeToSheet(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'STT',
      'Thoi gian',
      'Ho va ten',
      'So dien thoai',
      'Tinh / Thanh pho',
      'Muc tieu',
      'Hinh thuc hoc',
      'Nguon form',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'URL trang',
      'Trang thai'
    ]);
    var header = sheet.getRange(1, 1, 1, 13);
    header.setBackground('#bf2436');
    header.setFontColor('#ffffff');
    header.setFontWeight('bold');
    header.setFontSize(11);
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 50);
    sheet.setColumnWidth(2, 140);
    sheet.setColumnWidth(3, 180);
    sheet.setColumnWidth(4, 130);
    sheet.setColumnWidth(5, 130);
    sheet.setColumnWidth(6, 220);
    sheet.setColumnWidth(7, 220);
    sheet.setColumnWidth(8, 180);
    sheet.setColumnWidth(9, 110);
    sheet.setColumnWidth(10, 110);
    sheet.setColumnWidth(11, 150);
    sheet.setColumnWidth(12, 260);
    sheet.setColumnWidth(13, 120);
  }

  var lastRow = sheet.getLastRow();
  var stt = lastRow;

  sheet.appendRow([
    stt,
    data.timestamp    || new Date().toLocaleString('vi-VN'),
    data.name         || '',
    data.phone        || '',
    data.city         || '',
    data.goal         || '',
    data.hinhthuc     || '',
    data.source       || '',
    data.utm_source   || '',
    data.utm_medium   || '',
    data.utm_campaign || '',
    data.page_url     || '',
    'Moi - chua lien he'
  ]);

  var newRow = sheet.getLastRow();
  if (newRow % 2 === 0) {
    sheet.getRange(newRow, 1, 1, 13).setBackground('#fff5f5');
  }
}

// ----------------------------------------------------------------
// Gui email thong bao khi co lead moi
// ----------------------------------------------------------------
function sendNotification(data) {
  if (!NOTIFY_EMAIL) return;
  var subject = 'Lead moi tu An An Hoa Ngu Landing - ' + data.name;
  var body = [
    'THONG TIN LEAD MOI',
    '---------------------',
    'Ho ten:        ' + data.name,
    'So dien thoai: ' + data.phone,
    'Tinh/TP:       ' + (data.city || '(chua dien)'),
    'Muc tieu:      ' + (data.goal || '(chua chon)'),
    'Hinh thuc:     ' + (data.hinhthuc || '(chua chon)'),
    'Nguon form:    ' + data.source,
    'Thoi gian:     ' + data.timestamp,
    '',
    '---------------------',
    'UTM Tracking',
    'utm_source:   ' + (data.utm_source   || '-'),
    'utm_medium:   ' + (data.utm_medium   || '-'),
    'utm_campaign: ' + (data.utm_campaign || '-'),
    '',
    'URL: ' + data.page_url,
    '',
    'Goi lai ngay trong 30 phut de tang ty le chuyen doi!'
  ].join('\n');

  MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}
