// ================================================================
//  AN AN HOA NGU - Standalone Apps Script
//  Deploy as: Web App - Execute as: Me - Access: Anyone
// ================================================================

var SHEET_ID = '1pcvqHGz7d8iqp2tluwp71cce0liK-FL35MhaNa1pHsU';
var SHEET_NAME = 'Leads Landing Page';
var NOTIFY_EMAIL = 'ananhoangu@gmail.com';

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

function doGet(e) {
  return ContentService
    .createTextOutput('An An Hoa Ngu - Apps Script dang hoat dong!')
    .setMimeType(ContentService.MimeType.TEXT);
}

function writeToSheet(data) {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'STT', 'Thời gian', 'Họ và tên', 'Số điện thoại',
      'Tỉnh / Thành phố', 'Mục tiêu', 'Hình thức học', 'Nguồn form',
      'UTM Source', 'UTM Medium', 'UTM Campaign', 'URL trang', 'Trạng thái'
    ]);
    var header = sheet.getRange(1, 1, 1, 13);
    header.setBackground('#bf2436');
    header.setFontColor('#ffffff');
    header.setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  var lastRow = sheet.getLastRow();

  sheet.appendRow([
    lastRow,
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
    'Mới — chưa liên hệ'
  ]);
}

function sendNotification(data) {
  if (!NOTIFY_EMAIL) return;
  var subject = 'Lead moi - ' + data.name;
  var body = 'Ho ten: ' + data.name + '\n'
    + 'SDT: ' + data.phone + '\n'
    + 'Tinh/TP: ' + (data.city || '-') + '\n'
    + 'Hinh thuc: ' + (data.hinhthuc || '-') + '\n'
    + 'Nguon: ' + data.source + '\n'
    + 'Thoi gian: ' + data.timestamp;
  MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}
