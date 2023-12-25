import axios, {} from 'axios';
import { wl } from '../data/watchlist';
import { env_polygon } from '../enviroments';

const apiKey = env_polygon.key;

/**
 * Function that retrieves information from the watchlist
 */
export async function getWatchlistInfo() {
  try {
    // "wl" is the list that the user would have as a preference, in this case, it's just mock data
    if (wl.length === 0) {
      console.error('Data is Empty.');
      throw new Error('The WL array is empty.');
    }

    const date = new Date();
    const currentDate = new Date();
    // Takes the previous day since the API has restrictions
    date.setDate(currentDate.getDate() - 1);
    const formatDate = date.toISOString().split('T')[0];
    let response = [];

    // Using Promise.all to wait for all promises to resolve
    await Promise.all(
      // Iterating over the list to fetch all tickets from the watchlist
      wl.map(async (element) => {
        try {
          let quote = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${element.ticket.toUpperCase()}/range/1/minute/${formatDate}/${formatDate}?adjusted=true&sort=desc&limit=2&apiKey=${apiKey}`);
          const results = quote.data;
          console.log(results);
          if (!results) throw new Error ('Polygon return undefined results')
          // To validate the price variation and calculate the percentage, the first and last variation quotes are obtained, and the average is calculated
          if (results.length >= 2) {
            const first = results[0];
            const last = results[results.length - 1];

            const variation = last.c - first.c;
            const value = first.c.toFixed(2);

            const fluctuation = (variation / first.c) * 100;

            // Assigns the sign to a variable to know if it goes up or down in value
            const signal = variation >= 0 ? '+' : '-';
            const summary = `${variation.toFixed(2)}$ (${fluctuation.toFixed(2)}%)`;

            // If, for some reason, the variation list is not obtained, it is not added to the result returned in the endpoint
            response.push({
              company: wl.filter((t) => t.ticket.toUpperCase() === element.ticket.toUpperCase()),
              quote: quote.data,
              signal: signal,
              value: value,
              summary: summary,
            });
            console.log(response);
          } else {
            console.error('Not enough data to calculate the variation.');
          }
        } catch (error) {
          console.error('Error in the request:', error.message);
          throw error;
        }
      })
    );

    return response;
  } catch (error) {
    // Aiming to catch the axios error related to the limit when querying the API
    if (error.isAxiosError && error.response.status === 429) {
      throw new Error('Error: You have exceeded the maximum number of requests per minute.');
    } else {
      throw new Error(error.message);
    }
  }
}

// Function to wait for a period of time
function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Gets information about the company based on the ticket
 * @param ticker
 * @returns
 */
export async function getInfoCompanyByTicker(ticker: string) {
  try {
    const response = await axios.get(`https://api.polygon.io/v1/meta/symbols/${ticker.toUpperCase()}/company?apiKey=${apiKey}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching stock details.');
  }
}

/**
 * Gets the value difference of a ticket per minute for the previous day
 * @param ticker
 * @returns
 */
export async function getQuoteInfoByTicker(ticker: string) {
  try {
    const date = new Date();
    const currentDate = new Date();
    // Takes the previous day since the API has restrictions
    date.setDate(currentDate.getDate() - 1);
    // Transforms the date format
    const formatDate = date.toISOString().split('T')[0];
    const response = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${ticker.toUpperCase()}/range/1/minute/${formatDate}/${formatDate}?adjusted=true&sort=desc&limit=${env_polygon.limit}&apiKey=${apiKey}`);

    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('Error fetching real-time quotes.');
  }
}
