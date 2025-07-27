import { v4 as uuidv4 } from 'uuid';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import { Request, Response } from 'express';

dotenv.config();

export const conversationLogs = async (req: Request, res: Response) => {
    try {
        const call = req.body;
        const auth = new google.auth.GoogleAuth({
            keyFile: './src/assets/data/credentials.json',
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = process.env.SHEET_ID;

        const timestamp = new Date();
        const callId = uuidv4();

        const values = [[
            callId,
            call.callTime,
            call.phoneNumber,
            call.callOutcome,
            call.checkInDate,
            call.checkOutDate,
            call.customerName,
            call.roomName,
            call.numberOfGuests,
            call.callSummary,
            timestamp
        ]];

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1!A:K',
            valueInputOption: 'USER_ENTERED',
            requestBody: { values }
        });

        res.status(200).json({ message: 'Call details logged successfully', callId });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to log call details' });
    }
}