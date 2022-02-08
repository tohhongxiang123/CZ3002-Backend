import fetch from "node-fetch"
import { API_URL } from "../constants"
import { OneMapRouteResponse } from "../types"
import getAuthToken from "./getAuthToken"
import getBusInformation from "./getBusInformation"
import getTrainInformation from "./getTrainInformation"

type GetRouteParams = {
    start: [number, number],
    end: [number, number],
}

/**
 * @param {GetRouteParams} params
 * @property {string} start The start point in lat,lng (WGS84) format.
 * @property {string} end The end point in lat,lng (WGS84) format
 */
const getLastRoute = async (params: GetRouteParams) => {
    // prepare data
    const start = `${params.start[0]},${params.start[1]}`
    const end = `${params.end[0]},${params.end[1]}`
    const token = await getAuthToken()

    const currentDateAndTime = new Date() // get current datetime
    const date = currentDateAndTime.toISOString().
        replace(/T/, ' ').      // replace T with a space
        replace(/\..+/, '')     // delete the dot and everything after
        .split(' ')[0]
    const time = "12:00:00" // set a default time first, to find a route

    // fetch from API
    const data = await fetch(`${API_URL}/routingsvc/route?` + new URLSearchParams({
        start, end, token, date, time, routeType: "pt", mode: "transit"
    })).then(res => res.json()) as OneMapRouteResponse

    // return null if no itinerary exists
    if (!data.plan.itineraries || data.plan.itineraries.length == 0) {
        throw new Error("No route found")
    }

    // get route
    const route = data.plan.itineraries[0].legs!

    // get timing information and duration only from each step in the route
    // used to calculate the time to start the journey
    const information = [] as { lastTiming: string | null, duration: number }[] // duration is in seconds, last timing is 24h format string
    const todaysDay = currentDateAndTime.getDay()
    
    for (let i = 0; i < route.length; i++) {
        const leg = route[i]
        const duration = leg.duration // duration is in seconds
        const from = leg.from.name
        const to = leg.to.name

        const mode = leg.mode // WALK, BUS, SUBWAY
        if (mode === "BUS") {
            const busNumber = leg.route // get bus number
            const startingBusStopCode = leg.from.stopCode!
            const stopSequence = leg.from.stopSequence!

            // get bus last timing based on stop sequence and day of week
            const busInformation = await getBusInformation(busNumber, startingBusStopCode)

            if (!busInformation) {
                throw new Error(`No bus information for bus number ${busNumber} at bus stop ${startingBusStopCode}`)
            }

            let busTimings = busInformation.find(time => time.StopSequence === stopSequence) // find correct stop sequence

            let lastTiming;
            if (!busTimings) { // if there is no last bus
                lastTiming = null
            } else if (todaysDay === 0) { // if today is a sunday
                lastTiming = busTimings.SUN_LastBus
            } else if (todaysDay === 6) { // if today is a saturday
                lastTiming = busTimings.SAT_LastBus
            } else { // if today is a weekday
                lastTiming = busTimings.WD_LastBus
            }

            information.push({ lastTiming, duration })
        } else if (mode === "SUBWAY") {
            const line = leg.route // get mrt line
            const startingMrtStopCode = leg.from.stopCode!
            const endingMrtStopCode = leg.to.stopCode!
            const startingMrtSequenceNumber = leg.from.stopSequence!
            const endingMrtSequenceNumber = leg.to.stopSequence!
            const route = leg.route

            // get last arrival time for mrt at startingStop
            const trainInformation = await getTrainInformation(startingMrtStopCode)

            if (!trainInformation) {
                throw new Error(`Undefined train information for code ${startingMrtStopCode}`)
            }

            const direction = getDirection(startingMrtSequenceNumber, endingMrtSequenceNumber, route)
            const lastTiming = trainInformation.lines
                .find((line: any) => line.line === route)!.timings
                .find((timing: any) => timing.dest === direction)!.last

            information.push({ lastTiming, duration })
        } else {
            information.push({ lastTiming: null, duration })
        }
    }

    // get the public transport timing that ends the earliest
    let minTimingIndex = -1
    let minTiming = Infinity
    for (let i = 0; i < information.length; i++) {
        const { lastTiming } = information[i]
        if (!lastTiming) {
            continue
        }

        let parsedLastTiming = parseInt(lastTiming) // convert string to number
        if (parsedLastTiming < 400) {
            parsedLastTiming += 2400 // to make sure that 0000 is later than 2359
        }

        if (parsedLastTiming < minTiming) {
            minTiming = parsedLastTiming
            minTimingIndex = i
        }
    }

    // if you can literally go home anytime you want
    if (minTimingIndex < 0) {
        minTiming = 2400 + 600 // we just set a latest timing of 6am 
    }

    // sums up all durations before minTimingIndex
    const totalDuration = information.slice(0, minTimingIndex).map(info => info.duration).reduce((a, b) => a + b, 0)

    // find the latest time to begin the journey
    let d = new Date()
    d.setHours(Math.floor(minTiming / 100))
    d.setMinutes(minTiming % 100)
    let timeToLeave = (new Date(d.getTime() - totalDuration * 100000 / 60)).getTime()

    // modify all the timings to start from timeToLeave
    for (let i = 0; i < route.length; i++) {
        route[i].startTime = timeToLeave
        route[i].endTime = timeToLeave + route[i].duration * 1000

        timeToLeave += route[i].duration * 1000
    }

    return route
}

export default getLastRoute

/**
 * 
 * @param startingMrtStopCode Stop code of starting MRT station, e.g. NS1
 * @param endingMrtStopCode Stop code of ending MRT station, e.g. NS11
 * @return Direction to check
 */
function getDirection(startingMrtSequenceNumber: number, endingMrtSequenceNumber: number, route: string) {
    if (route === "CG") {
        if (startingMrtSequenceNumber < endingMrtSequenceNumber) {
            return "Tanah Merah"
        } else {
            return "Changi Airport"
        }
    } else if (route === "EW") {
        if (startingMrtSequenceNumber < endingMrtSequenceNumber) {
            return "Pasir Ris"
        } else {
            return "Tuas Link"
        }
    } else if (route === "NS") {
        if (startingMrtSequenceNumber < endingMrtSequenceNumber) {
            return "Marina South Pier"
        } else {
            return "Jurong East"
        }
    } else if (route === "CE") {
        if (startingMrtSequenceNumber < endingMrtSequenceNumber) {
            return "Stadium"
        } else {
            return "Marina South Pier"
        }
    } else if (route === "CC") {
        if (startingMrtSequenceNumber < endingMrtSequenceNumber) {
            return "HarbourFront"
        } else {
            return "Dhoby Ghaut"
        }
    } else if (route === "DT") {
        if (startingMrtSequenceNumber < endingMrtSequenceNumber) {
            return "Expo"
        } else {
            return "Bukit Panjang"
        }
    } else if (route === "BP") {
        return "Choa Chu Kang"
    } else if (route === "NE") {
        if (startingMrtSequenceNumber < endingMrtSequenceNumber) {
            return "Punggol"
        } else {
            return "HarbourFront"
        }
    } else if (route === "SW") {
        return "West Loop (Anti-Clockwise)"
    } else if (route === "SE") {
        return "East Loop (Clockwise)"
    } else if (route === "PW") {
        return "West Loop (Anti-Clockwise)"
    } else {
        return "East Loop (Anti-Clockwise)"
    }
}