import { Request, Response } from "express";
import { getWatchlistInfo } from "../services/apiService";

/**
 * Controller that handles responses and requests at the endpoint
 * @param req 
 * @param res 
 * @returns 
 */
export async function getWatchlistController(req: Request, res: Response) {
    try {
        const result = await getWatchlistInfo();
        return res.status(200).send(result);
    } catch (error) {

        const errorMessage = error.message || "An error occurred.";

        if (error.isAxiosError && error.response && error.response.status) {
            return res.status(error.response.status).send(errorMessage);
    } else if (error.status) {
        // Use the status from the error object
        return res.status(error.status).send(errorMessage);
        } else {
            return res.status(500).send(errorMessage);
        }
    }
}
