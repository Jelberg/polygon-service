import {  Request, Response } from "express";
import { getQuoteInfoByTicker } from "../services/apiService";

/**
 * Controller that handles responses and requests at the endpoint
 * @param req 
 * @param res 
 * @returns 
 */
export async function getQuoteTickerController(req: Request, res: Response) {
    try {
        const {ticker} = req.params;
        const result = await getQuoteInfoByTicker(ticker)
        return res.status(200).send(result)

    } catch (error) {
        const errorMessage = error.message || "An error occurred.";

        if (error.isAxiosError && error.response && error.response.status) {
            return res.status(error.response.status).send(errorMessage);
        } else {
            return res.status(500).send(errorMessage);
        }
    }
}