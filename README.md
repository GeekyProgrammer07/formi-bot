## Overview

This project implements a Voice AI agent using Retell AI, integrated with Express.js APIs, Google Sheets for conversation logging, and Redis for caching.

## Development Log

- **Session 1 (11:30 PM - 12:00 AM)**:
  - Goal: Set up project, install dependencies including Redis, configure Google Sheets API.
  - Progress: Initialized Node.js project, created Express server, set up Redis client, configured Google Sheets credentials.
    <br><br>
- **Session 2 (12:30 PM - 3:00 AM)**:
  - Goal: Parse multiple CSV files, convert them into JSON, and prepare them for the next processing step.
  - Progress:
    - Parsed different CSV files and converted them into structured JSON format.
    - Restructured the project structure to have a cleaner and modular setup.
    - Added routing logic.
    - Took longer than expected due to multiple issues in the CSV files that required cleaning and fixing.
      <br><br>
- **Session 3 (3:30 AM - 7:00 AM)**:
  - Goal: Improve the JSON structure, implement chunking, and set up caching and routing.
  - Progress: 
    - Implemented chunkify logic to split JSON data into smaller, manageable pieces.
    - Reworked previously generated JSON data into a more detailed, granular structure for easier chunking.
    - Added Redis caching to store and retrieve chunks efficiently.
    - Fixed and improved routing setup for the Express server.
