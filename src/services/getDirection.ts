
/**
 * 
 * @param startingMrtStopCode Stop code of starting MRT station, e.g. NS1
 * @param endingMrtStopCode Stop code of ending MRT station, e.g. NS11
 * @return Direction to check
 */
export function getDirection(startingMrtSequenceNumber: number, endingMrtSequenceNumber: number, route: string) {
    if (route === "CG") {
        if (startingMrtSequenceNumber < endingMrtSequenceNumber) {
            return "Tanah Merah"
        } else {
            return "Changi Airport"
        }
    } else if (route === "EW") {
        if (startingMrtSequenceNumber > endingMrtSequenceNumber) {
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
        if (startingMrtSequenceNumber == 1) { // start at choa chu kang
            return "Service B via Petir"
        }

        if (startingMrtSequenceNumber >= 6) {
            return "Choa Chu Kang (Service A)"
        }

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

export default getDirection