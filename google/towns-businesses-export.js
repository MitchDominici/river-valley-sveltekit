function exportSheetToCSV() {
    var ui = SpreadsheetApp.getUi();
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = sheet.getSheets();
    var folder = DriveApp.getFolderById('1lFnxG53DmyHbgo6MVYMy7aT7XrGONLyf');

    if (!folder) {
        throw new Error('Invalid folder ID');
    }

    sheets.forEach(function(sheet) {
        var csvContent = convertToCSV(sheet);
        var fileName = sheet.getName() + '.csv';
        var files = folder.getFilesByName(fileName);
        if (files.hasNext()) {
            files.next().setContent(csvContent);
            ui.alert('File updated successfully');
        } else {
            folder.createFile(fileName, csvContent);
            ui.alert('File created successfully');
        }
    });
}

function convertToCSV(sheet) {
    var data = sheet.getDataRange().getValues();
    return data.map(row => row.map(str => `"${str}"`).join(',')).join('\n');
}

function onOpen() {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('Publish')
        .addItem('Publish to site', 'exportSheetToCSV')
        .addToUi();
}