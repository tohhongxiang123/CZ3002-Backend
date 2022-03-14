import { LegsEntity } from "../types/OneMapResponse"
import getBusInformation from "./getBusInformation"
import getTrainInformation from "./getTrainInformation"

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

/**
 * From a given route, for each leg, find all the latest timing that each public transport operates until 
 * If the leg does not use public transport (e.g. walking), the timing returned is null
 * @param route - The route to get timings from
 * @param todaysDay - The day for today (0-6, 0 being sunday and 6 being saturday)
 * @returns An array which contains the lastTiming and duration information for each leg, corresponding to the route
 */
async function getPublicTransportTimingFromRoute(route: LegsEntity[], todaysDay: number) {
    const information = [] as { lastTiming: string | null, duration: number }[] // duration is in seconds, last timing is 24h format string
    // const todaysDay = currentDateAndTime.getDay()
    
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

    return information
}

export default getPublicTransportTimingFromRoute