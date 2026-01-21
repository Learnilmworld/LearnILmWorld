import { google } from "googleapis";
import fs from "fs";

const auth = new google.auth.GoogleAuth({
    keyFile: "google-drive.json",
    scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

export const uploadToDrive = async (filePath, fileName, folderId) => {
    const response = await drive.files.create({
        requestBody: {
            name: fileName,
            parents: [folderId],
        },
        media: {
            body: fs.createReadStream(filePath),
        },
    });

    // Make file public
    await drive.permissions.create({
        fileId: response.data.id,
        requestBody: { role: "reader", type: "anyone" },
    });

    return `https://drive.google.com/uc?id=${response.data.id}`;
};
