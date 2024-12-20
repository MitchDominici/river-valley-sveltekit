function exportEventCSV() {
    var ui = SpreadsheetApp.getUi();

    var yearResponse = ui.prompt('Enter Year (YYYY):', ui.ButtonSet.OK_CANCEL);
    if (yearResponse.getSelectedButton() == ui.Button.CANCEL) return;
    var year = yearResponse.getResponseText();

    var monthResponse = ui.prompt('Enter Month (1-12):', ui.ButtonSet.OK_CANCEL);
    if (monthResponse.getSelectedButton() == ui.Button.CANCEL) return;
    var month = String(monthResponse.getResponseText()).padStart(2, '0');

    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var folder = DriveApp.getFolderById('18lzxsWJFhZz0RBmPrkPVBMiOdG-g4SFj');

    var fileName = `${year}_${month}.csv`;
    var eventSheet = sheet.getSheetByName(`${year}_${month}`);

    if (!eventSheet) {
        ui.alert(`Sheet ${year}_${month} not found`);
        return;
    }

    var csvContent = convertToCSV(eventSheet);

    var files = folder.getFilesByName(fileName);
    if (files.hasNext()) {
        files.next().setContent(csvContent);
        ui.alert('File updated successfully');
    } else {
        folder.createFile(fileName, csvContent);
        ui.alert('File created successfully');
    }
}

function convertToCSV(sheet) {
    var data = sheet.getDataRange().getValues();
    return data.map(row => row.map(str => `"${str}"`).join(',')).join('\n');
}

function onOpen() {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('Publish')
        .addItem('Publish to site', 'exportEventCSV')
        .addToUi();
}