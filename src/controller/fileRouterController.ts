import express, { Request, Response } from "express";
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import { RoomInfo } from "../types/RoomInfo";
import { HotelRules } from "../types/HotelRules";
import { Price } from "../types/Price";
import { Staff } from "../types/Staff";
import { estimateTokenCount } from "../utilities/estimatedTokenCount";

let id = 1;

export const convertToJson = async (req: Request, res: Response) => {
    try {
        const roomInfo = parse<RoomInfo>(fs.readFileSync('./src/assets/files/rooom-information.csv'), {
            columns: true,
            skip_empty_lines: true,
        });
        const hotelRules = parse<HotelRules>(fs.readFileSync('./src/assets/files/hotel-rules.csv'), {
            columns: true,
            skip_empty_lines: true,
        });
        const priceInfo = parse<Price>(fs.readFileSync('./src/assets/files/price.csv'), {
            columns: true,
            skip_empty_lines: true,
        });
        const staffQuery = parse<Staff>(fs.readFileSync('./src/assets/files/staff-queries.csv'), {
            columns: true,
            skip_empty_lines: true,
        });

        const jsonData = [];

        for (const room of roomInfo) {
            const roomName = room['room_name'];

            let description = `${roomName}: ${room['Number_of_Bedrooms'] || 'N/A'} bedrooms, ${room['Number_of_Bathrooms'] || 'N/A'} bathrooms, max ${room['Max_Guests'] || 'N/A'} guests.`;
            
            const amenities = [];
            if (room['baby_cot_available'] === 'Yes') amenities.push('baby cot');
            if (room['pool_available'] === 'Yes') {
                amenities.push(
                    `pool (Size: ${room['Width_(Pool_Size)'] || 'N/A'}x${room['Length_(Pool_Size)'] || 'N/A'}, Depth: ${room['Depth_1_(Pool_Size)'] || 'N/A'} - ${room['Depth_2_(Pool_Size)'] || 'N/A'})`
                );
            }
            
            if (room['gym'] === 'Yes') amenities.push('gym');
            if (room['Wifi_Connectivity_(Guest_Basic_Queries)']) {
                amenities.push('Wi-Fi (100 Mbps)');
            }
            if (room['Toiletries_(additional_Facility)'] === 'Yes') {
                amenities.push('toiletries');
            }
            if (room['Bedsheets_and_Towels_(additional_Facility)'] === 'Yes') {
                amenities.push('bedsheets, towels');
            }
            if (amenities.length) {
                description += ` Includes ${amenities.join(', ')}.`;
            }

            if (hotelRules.length > 0) {
                const rules = hotelRules[0];
                if (rules['Visitor_Policy']) {
                    description += ` Visitor Policy: ${rules['Visitor_Policy']}.`;
                }
                if (rules['cancellation_policy']) {
                    description += ` Cancellation Policy: ${rules['cancellation_policy']}.`;
                }
                if (rules['Kids_Policy_(Guest_Basic_Queries)']) {
                    description += ` Kids Policy: ${rules['Kids_Policy_(Guest_Basic_Queries)']}.`;
                }
            }

            const price = priceInfo.find((p: any) => p['Property_Name'] === roomName);
            if (price && price['price']) {
                description += ` Price: ${price['price']} INR.`;
            }

            if (room['Speciality_(additional_Information)']) {
                description += ` Speciality: ${room['Speciality_(additional_Information)']}.`;
            }
            if (room['Issues_(additional_Information)']) {
                description += ` Issues: ${room['Issues_(additional_Information)']}.`;
            }
            if (room['Cook_Charges_(Guest_Basic_Queries)']) {
                description += ` Cook charges: ${room['Cook_Charges_(Guest_Basic_Queries)']} INR per meal per person.`;
            }

            const roomEntry = {
                id: `${id}`,
                name: roomName,
                description,
                availability: `${room['Total_number_of_rooms_Available'] || 'N/A'} rooms available`,
                token_count: Math.floor(estimateTokenCount(description)),
            };
            id++;

            jsonData.push(roomEntry);
        }
        res.json(jsonData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process CSV files' });
    }
}