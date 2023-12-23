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
        return res.status(500).send(error)
    }
}