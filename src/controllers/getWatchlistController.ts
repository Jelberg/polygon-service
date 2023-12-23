import {  Request, Response } from "express";
import { getWatchlistInfo } from "../services/apiService";

/**
 * Controller that handles responses and requests at the endpoint
 * @param req 
 * @param res 
 * @returns 
 */
export async function getWatchlistController(req: Request, res: Response) {
    try {
        const result = await getWatchlistInfo()
        return res.status(200).send(result)

    } catch (error) {
        return res.status(500).send(error)
    }
}