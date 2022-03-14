import { API_URL } from "../constants"
import { OneMapRouteResponse } from "../types"
import getAuthToken from "./getAuthToken"
import fetch from "node-fetch"

type GetRouteParams = {
    start: [number, number], 
    end: [number, number],
    date: string,
    time: string,
}

export interface IGetRoute {
    (params: GetRouteParams): OneMapRouteResponse
}

/**
 * 
 * @param params - Parameters for getting a route
 * @param params.start - Start coordinates 
 * @param params.end - End coordinates
 * @param params.date - String representing the date the route starts (YYYY-MM-DD, e.g. 2022-03-14)
 * @param params.time - String representing the time the route starts (HH:MM:SS, e.g. 12:00:00)
 * @returns route - Describes the steps taken in a route
 */
export default async function getRoute(params: GetRouteParams) {
    const token = await getAuthToken()
    const start = `${params.start[0]},${params.start[1]}`
    const end = `${params.end[0]},${params.end[1]}`
    const { date, time } = params

    const data = await fetch(`${API_URL}/routingsvc/route?` + new URLSearchParams({
        start, end, token, date, time, routeType: "pt", mode: "transit"
    })).then(res => res.json()) as OneMapRouteResponse

    return data
}