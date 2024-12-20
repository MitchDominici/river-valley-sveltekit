function exportSheetToCSV() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = sheet.getSheets();
    var folder = DriveApp.getFolderById('1cNuhUlknoi-l4uwnUMP_norxrg1EYMfJ');

    if (!folder) {
        throw new Error('Invalid folder ID');
    }

    sheets.forEach(function(sheet) {
        var csvContent = convertToCSV(sheet);
        var fileName = sheet.getName() + '.csv';
        var files = folder.getFilesByName(fileName);
        if (files.hasNext()) {
            files.next().setContent(csvContent);
        } else {
            folder.createFile(fileName, csvContent);
        }
    });
}

function convertToCSV(sheet) {
    var data = sheet.getDataRange().getValues();
    return data.map(row => row.map(str => `"${str}"`).join(',')).join('\n');
}

function onEdit(e) {
    exportSheetToCSV();
}