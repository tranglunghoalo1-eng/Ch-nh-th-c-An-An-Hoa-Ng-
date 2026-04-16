// ================================================================
//  AN AN HOA NGỮ — Google Apps Script nhận data từ Landing Page
//  Deploy as: Web App → Execute as: Me → Access: Anyone
// ================================================================

var SHEET_NAME = 'Leads Landing Page'; // Tên tab trong Google Sheet
var NOTIFY_EMAIL = 'ananhoangu@gmail.com'; // Email nhận thông báo (để trống '' nếu không cần)

// ----------------------------------------------------------------
// Hàm chính: nhận POST request từ landing page
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
    .createTextOutput('✅ An An Hoa Ngữ — Apps Script đang hoạt động!')
    .setMimeType(ContentService.MimeType.TEXT);
}

// ----------------------------------------------------------------
// Ghi data vào Google Sheet
// ----------------------------------------------------------------
function writeToSheet(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  // Tự động tạo sheet nếu chưa có
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Thêm header row
    sheet.appendRow([
      'STT',
      'Thời gian',
      'Họ và tên',
      'Số điện thoại',
      'Tỉnh / Thành phố',
      'Mục tiêu',
      'Hình thức học',
      'Nguồn form',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'URL trang',
      'Trạng thái'
    ]);
    // Format header
    var header = sheet.getRange(1, 1, 1, 13);
    header.setBackground('#bf2436');
    header.setFontColor('#ffffff');
    header.setFontWeight('bold');
    header.setFontSize(11);
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 50);   // STT
    sheet.setColumnWidth(2, 140);  // Thời gian
    sheet.setColumnWidth(3, 180);  // Họ tên
    sheet.setColumnWidth(4, 130);  // SĐT
    sheet.setColumnWidth(5, 130);  // Tỉnh
    sheet.setColumnWidth(6, 220);  // Mục tiêu
    sheet.setColumnWidth(7, 220);  // Hình thức
    sheet.setColumnWidth(8, 180);  // Nguồn form
    sheet.setColumnWidth(9, 110);  // UTM Source
    sheet.setColumnWidth(10, 110); // UTM Medium
    sheet.setColumnWidth(11, 150); // UTM Campaign
    sheet.setColumnWidth(12, 260); // URL
    sheet.setColumnWidth(13, 120); // Trạng thái
  }

  // Tính STT
  var lastRow = sheet.getLastRow();
  var stt = lastRow; // Row 1 là header, nên STT = lastRow (trước khi thêm)

  // Thêm dòng data mới
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
    'Mới — chưa liên hệ'
  ]);

  // Tô màu xen kẽ cho rows
  var newRow = sheet.getLastRow();
  if (newRow % 2 === 0) {
    sheet.getRange(newRow, 1, 1, 13).setBackground('#fff5f5');
  }
}

// ----------------------------------------------------------------
// Gửi email thông báo khi có lead mới
// ----------------------------------------------------------------
function sendNotification(data) {
  if (!NOTIFY_EMAIL) return;
  var subject = '🔔 Lead mới từ An An Hoa Ngữ Landing — ' + data.name;
  var body = [
    '📋 THÔNG TIN LEAD MỚI',
    '─────────────────────',
    '👤 Họ tên:       ' + data.name,
    '📞 Số điện thoại: ' + data.phone,
    '📍 Tỉnh/TP:      ' + (data.city || '(chưa điền)'),
    '🎯 Mục tiêu:     ' + (data.goal || '(chưa chọn)'),
    '📚 Hình thức:    ' + (data.hinhthuc || '(chưa chọn)'),
    '📌 Nguồn form:   ' + data.source,
    '🕐 Thời gian:    ' + data.timestamp,
    '',
    '─────────────────────',
    '📊 UTM Tracking',
    'utm_source:   ' + (data.utm_source   || '-'),
    'utm_medium:   ' + (data.utm_medium   || '-'),
    'utm_campaign: ' + (data.utm_campaign || '-'),
    '',
    '🔗 URL: ' + data.page_url,
    '',
    '⚡ Gọi lại ngay trong 30 phút để tăng tỷ lệ chuyển đổi!'
  ].join('\n');

  MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}
