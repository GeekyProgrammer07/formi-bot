import express, { Request, Response } from "express";
import * as fs from "fs";
import { parse } from "csv-parse/sync";
import { RoomInfo } from "../types/RoomInfo";
import { HotelRules } from "../types/HotelRules";
import { Price } from "../types/Price";
import { Staff } from "../types/Staff";
import { estimateTokenCount } from "../utilities/estimatedTokenCount";

let id = 1;

export const convertToJson = async (req: Request, res: Response) => {
    try {
        const roomInfo = parse<RoomInfo>(
            fs.readFileSync("./src/assets/files/rooom-information.csv"),
            { columns: true, skip_empty_lines: true }
        );

        const hotelRules = parse<HotelRules>(
            fs.readFileSync("./src/assets/files/hotel-rules.csv"),
            { columns: true, skip_empty_lines: true }
        );

        const priceInfo = parse<Price>(
            fs.readFileSync("./src/assets/files/price.csv"),
            { columns: true, skip_empty_lines: true }
        );

        const staffQuery = parse<Staff>(
            fs.readFileSync("./src/assets/files/staff-queries.csv"),
            { columns: true, skip_empty_lines: true }
        );

        const jsonData: any[] = [];

        for (const room of roomInfo) {
            const roomName = room["room_name"];
            const bedrooms = room["Number_of_Bedrooms"] || "N/A";
            const bathrooms = room["Number_of_Bathrooms"] || "N/A";
            const maxGuests = room["Max_Guests"] || "N/A";

            const amenities: string[] = [];
            if (room["baby_cot_available"] === "Yes") amenities.push("baby cot");
            if (room["pool_available"] === "Yes") {
                amenities.push(
                    `pool (Size: ${room["Width_(Pool_Size)"] || "N/A"}x${room["Length_(Pool_Size)"] || "N/A"}, Depth: ${room["Depth_1_(Pool_Size)"] || "N/A"} - ${room["Depth_2_(Pool_Size)"] || "N/A"})`
                );
            }
            if (room["gym"] === "Yes") amenities.push("gym");
            if (room["Wifi_Connectivity_(Guest_Basic_Queries)"]) amenities.push("Wi-Fi (100 Mbps)");
            if (room["Toiletries_(additional_Facility)"] === "Yes") amenities.push("toiletries");
            if (room["Bedsheets_and_Towels_(additional_Facility)"] === "Yes") amenities.push("bedsheets, towels");

            let visitorPolicy = "";
            let cancellationPolicy = "";
            let kidsPolicy = "";

            if (hotelRules.length > 0) {
                visitorPolicy = hotelRules[0]["Visitor_Policy"] || "";
                cancellationPolicy = hotelRules[0]["cancellation_policy"] || "";
                kidsPolicy = hotelRules[0]["Kids_Policy_(Guest_Basic_Queries)"] || "";
            }

            let price = "";
            const priceObj = priceInfo.find((p: any) => p["Property_Name"] === roomName);
            if (priceObj && priceObj["price"]) {
                price = `${priceObj["price"]} INR`;
            }

            const roomEntry = {
                id: `${id}`,
                name: roomName,
                bedrooms,
                bathrooms,
                max_guests: maxGuests,
                amenities,
                visitor_policy: visitorPolicy,
                cancellation_policy: cancellationPolicy,
                kids_policy: kidsPolicy,
                price,
                speciality: room["Speciality_(additional_Information)"] || "N/A",
                issues: room["Issues_(additional_Information)"] || "N/A",
                cook_charges: room["Cook_Charges_(Guest_Basic_Queries)"] || "N/A",
                availability: `${room["Total_number_of_rooms_Available"] || "N/A"} rooms available`,
                token_count: estimateTokenCount(
                    `${roomName} ${bedrooms} ${bathrooms} ${maxGuests} ${amenities.join(" ")} ${visitorPolicy} ${cancellationPolicy} ${kidsPolicy} ${price}`
                ),
            };

            jsonData.push(roomEntry);
            id++;
        }

        res.json(jsonData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to process CSV files" });
    }
};
