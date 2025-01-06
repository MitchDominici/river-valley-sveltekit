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

        publishSheetToJson(sheet, folder);
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

function publishSheetToJson(sheet, folder) {
    try {
        const data = sheet.getDataRange().getValues();
        const headers = data.shift();
        const newJsonData = data.map(row => {
            let obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index];
            });
            return obj;
        });


        const fileName = `${sheet.getName()}.json`;
        const existingFile = getFileByName(folder, fileName);

        let combinedJsonData = [];
        if (existingFile) {
            const content = existingFile.getBlob().getDataAsString();
            combinedJsonData = JSON.parse(content); // Parse existing JSON data
        }

        combinedJsonData = combinedJsonData.concat(newJsonData); // Add new data

        const fileContent = JSON.stringify(combinedJsonData, null, 2);

        if (existingFile) {
            existingFile.setContent(fileContent); // Update existing file
            SpreadsheetApp.getUi().alert(`JSON file updated: ${fileName}`);
        } else {
            folder.createFile(fileName, fileContent); // Create new file
            SpreadsheetApp.getUi().alert(`JSON file created: ${fileName}`);
        }
    } catch (error) {
        SpreadsheetApp.getUi().alert(`Error: ${error.message}`);
    }
}