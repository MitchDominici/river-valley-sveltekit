function exportEventCSV() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var folder = DriveApp.getFolderById('18lzxsWJFhZz0RBmPrkPVBMiOdG-g4SFj');

    var year = new Date().getFullYear();
    var month = String(new Date().getMonth() + 1).padStart(2, '0');
    var fileName = `${year}_${month}.csv`;

    var eventSheet = sheet.getSheetByName(`${year}_${month}`);


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