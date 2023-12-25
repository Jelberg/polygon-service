# Polygon Service

This service, named "Polygon Service," connects to the Polygon IO Stock Market API to provide specific functionalities. It offers endpoints to interact with the Polygon API and retrieve information related to stock prices.

## Table of Contents

- [Endpoints](#endpoints)
- [Installation](#installation)
- [Tree](#tree)

## Endpoints

Here are three specific endpoints of the service:

| # | Method | Route                          | Description                                                  |
|---|--------|--------------------------------|--------------------------------------------------------------|
| 1 | GET    | /api/stock                     | Retrieves necessary information for the watchlist. Functions similarly to endpoint #3. |
| 2 | GET    | /api/stock/:ticker/company     | Retrieves company information based on the ticker.             |
| 3 | GET    | /api/stock/:ticker             | Retrieves information for the stock every 5 minutes, a total of 50 records from the previous day. |

Note 1: To access real-time information from the API, a subscription is required. Therefore, parameters from the previous day were used to calculate the stock variation.

Note 2: Ideally, the watchlist should be stored in a proper database. However, for the purposes of this project, a mock dataset is used, containing the ticker, company name, and logo. (The last two are included because using endpoints #2 and #3 together quickly exceeds the query limit per minute of the Polygon IO API.)

## Installation

Detailed instructions on how to install and set up the "Polygon Service." Include steps for installing dependencies, configuring environments, etc.

Note: Make sure you have the .env file in the root folder.

```bash
# Example installation commands
npm install
npm run start
```

## Tree

.
├── src/
│   ├── controllers/   # Handles service requests and responses
│   ├── data/          # Where mock data is stored
│   ├── loaders/       # Services and libraries that need to be initialized when the service starts
│   ├── routes/        # Endpoints routes
│   ├── services/      # Executes functions necessary for retrieving and operating on data
│   ├── utils/         # Basic functions and methods for use throughout the service, e.g., pipes
├── app.ts/            # Test cases
├── environments.ts/   # Compiled or distributable files
