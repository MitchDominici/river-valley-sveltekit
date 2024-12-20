function exportSheetToCSV() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = sheet.getSheets();
    var folder = DriveApp.getFolderById('1PS53jP86w0UsaG5D3ZC8YMissZmA3mKM');

    if (!folder) {
        throw new Error('Invalid folder ID');
    }

    sheets.forEach(function(sheet) {
        var csvContent = convertToCSV(sheet);
        console.log(csvContent);
        var fileName = sheet.getName() + '.csv';
        console.log(fileName);
        var files = folder.getFilesByName(fileName);
        console.log(files);
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