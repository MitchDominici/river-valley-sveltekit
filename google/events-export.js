function exportEventCSV() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var eventSheet = sheet.getSheetByName('Sheet1');
    var folder = DriveApp.getFolderById('1ps4F-XPCVRSur-hS7aRiiuZILUMtdPiE');

    var year = new Date().getFullYear();
    var month = String(new Date().getMonth() + 1).padStart(2, '0');
    var fileName = `${year}_${month}.csv`;

    var csvContent = convertToCSV(eventSheet);

    var files = folder.getFilesByName(fileName);
    if (files.hasNext()) {
        files.next().setContent(csvContent);
    } else {
        folder.createFile(fileName, csvContent);
    }
}

function convertToCSV(sheet) {
    var data = sheet.getDataRange().getValues();
    return data.map(row => row.map(str => `"${str}"`).join('|')).join('\n');
}

function onEdit(e) {
    exportEventCSV();
}