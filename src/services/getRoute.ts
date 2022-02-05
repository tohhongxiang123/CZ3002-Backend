import fetch from "node-fetch"
import { API_URL } from "../constants"
import getAuthToken from "./getAuthToken"

type GetRouteParams = {
    start: [number, number], 
    end: [number, number],
    date: string,
    time: string,
}

/**
 * @param {GetRouteParams} params
 * @property {string} start The start point in lat,lng (WGS84) format.
 * @property {string} end The end point in lat,lng (WGS84) format
 * @property {string} date The date of the selected start point in YYYY-MM-DD.
 * @property {string} time The time of the selected start point in [HH][MM][SS]. The time uses the 24-hour clock system.
 */
const getRoute = async (params: GetRouteParams) => {
    const start = `${params.start[0]},${params.start[1]}`
    const end = `${params.end[0]},${params.end[1]}`
    const token = await getAuthToken()
    const data = await fetch(`${API_URL}/routingsvc/route?` + new URLSearchParams({
        start, end, token, date: params.date, time: params.time
    }))
}