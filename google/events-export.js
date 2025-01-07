function exportEventJSON() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();

    console.log('sheet:', sheet.getName());

    var folder = DriveApp.getFolderById('1lFnxG53DmyHbgo6MVYMy7aT7XrGONLyf');

    publishSheetToJson(sheet, folder)
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

        combinedJsonData = combinedJsonData.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t['Event Name'] === value['Event Name']
            ))
        )


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

function onOpen() {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('Publish')
        .addItem('Publish to site', 'exportEventJSON')
        .addToUi();
}


function getFileByName(folder, fileName) {
    const files = folder.getFilesByName(fileName);
    return files.hasNext() ? files.next() : null;
}





