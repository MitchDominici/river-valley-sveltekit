function exportSheetToJSON() {
    var ui = SpreadsheetApp.getUi();
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = sheet.getSheets();
    var folder = DriveApp.getFolderById('1lFnxG53DmyHbgo6MVYMy7aT7XrGONLyf');

    sheet = sheets.find(sheet => sheet.getName() === 'businesses' || sheet.getName() === 'towns');

    if (!folder) {
        throw new Error('Invalid folder ID');
    }

    let businesses = [];

    sheets.forEach(function(sheet) {
        const jsonData = getSheetAsJSON(sheet);
        businesses = businesses.concat(jsonData);
    });

    publishSheetToJson(sheet, folder, businesses);

}

function convertToCSV(sheet) {
    var data = sheet.getDataRange().getValues();
    return data.map(row => row.map(str => `"${str}"`).join(',')).join('\n');
}

function onOpen() {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('Publish')
        .addItem('Publish to site', 'exportSheetToJSON')
        .addToUi();
}

function publishSheetToJson(sheet, folder, newJsonData) {
    try {
        const fileName = `${sheet.getName()}.json`;
        const existingFile = getFileByName(folder, fileName);

        let combinedJsonData = [];
        if (existingFile) {
            const content = existingFile.getBlob().getDataAsString();
            combinedJsonData = JSON.parse(content); // Parse existing JSON data
        }

        // update existing data
        const existingData = combinedJsonData.filter(data => !newJsonData.some(newData => newData.name === data.name));

        combinedJsonData = existingData.concat(newJsonData);


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

function getSheetAsJSON(sheet){
    const data = sheet.getDataRange().getValues();
    const headers = data.shift();
    const newJsonData = data.map(row => {
        let obj = {};
        headers.forEach((header, index) => {
            obj[header] = row[index];
        });
        return obj;
    });
    return newJsonData;
}

function getFileByName(folder, fileName) {
    const files = folder.getFilesByName(fileName);
    return files.hasNext() ? files.next() : null;
}