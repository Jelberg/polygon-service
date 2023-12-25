import axios, { AxiosError } from 'axios';
import { wl } from '../data/watchlist';
import { env_polygon } from '../enviroments';

const apiKey = env_polygon.key;
const polygonApiUrl = 'https://api.polygon.io';

// Constants for error messages
const ERROR_MESSAGES = {
  EMPTY_DATA: 'The WL array is empty.',
  UNDEFINED_RESULTS: 'Polygon returned undefined results',
  NOT_ENOUGH_DATA: 'Not enough data to calculate the variation.',
  EXCEEDED_REQUEST_LIMIT: 'You have exceeded the maximum number of requests per minute.',
  GENERAL_ERROR: 'An error occurred.',
};

/**
 * Function that retrieves information from the watchlist
 */
export async function getWatchlistInfo() {
  try {
    // Check if watchlist is empty
    if (wl.length === 0) {
      console.error('Data is Empty.');
      throw new Error(ERROR_MESSAGES.EMPTY_DATA);
    }

    const date = new Date();
    date.setDate(date.getDate() - 1);
    const formatDate = date.toISOString().split('T')[0];
    const response = [];

    // Use Promise.all to concurrently fetch information for each element in the watchlist
    await Promise.all(
      wl.map(async (element) => {
        try {
          // Construct the API endpoint for each element in the watchlist
          const endpoint = `/v2/aggs/ticker/${element.ticket.toUpperCase()}/range/1/minute/${formatDate}/${formatDate}?adjusted=true&sort=desc&limit=2&apiKey=${apiKey}`;
          // Make the API request
          const quote = await axios.get(polygonApiUrl + endpoint);
          const results = quote.data;

          // Check if the results are undefined
          if (!results) {
            throw new Error(ERROR_MESSAGES.UNDEFINED_RESULTS);
          }

          // Check if there are enough data points to calculate the variation
          if (results.length >= 2) {
            const first = results[0];
            const last = results[results.length - 1];

            const variation = last.c - first.c;
            const value = first.c.toFixed(2);

            const fluctuation = (variation / first.c) * 100;

            // Assign the sign to a variable to know if it goes up or down in value
            const signal = variation >= 0 ? '+' : '-';
            const summary = `${variation.toFixed(2)}$ (${fluctuation.toFixed(2)}%)`;

            response.push({
              company: wl.filter((t) => t.ticket.toUpperCase() === element.ticket.toUpperCase()),
              quote: quote.data,
              signal,
              value,
              summary,
            });
            console.log(response);
          } else {
            // If there is not enough data, throw a new error with a specific message
            throw new Error(ERROR_MESSAGES.NOT_ENOUGH_DATA);
          }
        } catch (error) {
          console.error('Error in the request:', error.message);
          // Re-throw the error to be caught in the outer catch block
          throw error;
        }
      })
    );
    return response;
  } catch (error) {
    // Handle the specific error here before calling the handleErrors function
    console.log('entrooo en el ultimo error')
    return handleErrors(error);
  }
}

/**
 * Utility function to handle errors consistently
 * @param {Error} error
 * @returns {Object} - Object containing status and message
 */
function handleErrors(error: Error) {
  const errorMessage = getErrorMessage(error);
  const status = getErrorStatus(error);
  throw { status, message: errorMessage };
}

/**
 * Get the error message based on the exception
 * @param {Error} error
 * @returns {string}
 */
function getErrorMessage(error: Error) {
  switch (error.message) {
    case ERROR_MESSAGES.NOT_ENOUGH_DATA:
      return ERROR_MESSAGES.NOT_ENOUGH_DATA;
    // Add more cases as needed
    default:
      return ERROR_MESSAGES.GENERAL_ERROR;
  }
}

/**
 * Get the status code based on the exception
 * @param {Error} error
 * @returns {number}
 */
function getErrorStatus(error: Error) {
  switch (error.message) {
    case ERROR_MESSAGES.NOT_ENOUGH_DATA:
      return 400; 
    case ERROR_MESSAGES.EXCEEDED_REQUEST_LIMIT:
      return 429; 
    case ERROR_MESSAGES.UNDEFINED_RESULTS:
      return 400;
    case ERROR_MESSAGES.EMPTY_DATA:
      return 400; 
    default:
      return 500; // Internal Server Error
  }
}


/**
 * Function to wait for a period of time
 * @param {number} ms - milliseconds to wait
 * @returns {Promise<void>}
 */
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Gets information about the company based on the ticket
 * @param {string} ticker
 * @returns {Promise<any>}
 */
export async function getInfoCompanyByTicker(ticker) {
  try {
    const endpoint = `/v1/meta/symbols/${ticker.toUpperCase()}/company?apiKey=${apiKey}`;
    const response = await axios.get(polygonApiUrl + endpoint);
    return response.data;
  } catch (error) {
    handleErrors(error);
  }
}

/**
 * Gets the value difference of a ticket per minute for the previous day
 * @param {string} ticker
 * @returns {Promise<any>}
 */
export async function getQuoteInfoByTicker(ticker) {
  try {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const formatDate = date.toISOString().split('T')[0];
    const endpoint = `/v2/aggs/ticker/${ticker.toUpperCase()}/range/1/minute/${formatDate}/${formatDate}?adjusted=true&sort=desc&limit=${env_polygon.limit}&apiKey=${apiKey}`;
    const response = await axios.get(polygonApiUrl + endpoint);
    return response.data;
  } catch (error) {
    handleErrors(error);
  }
}
