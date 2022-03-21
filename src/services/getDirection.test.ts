import getDirection from "./getDirection"

describe("Get Direction", () => {
    test("NS Line returns correct direction", () => {
        expect(getDirection(1, 20, "NS")).toBe("Marina South Pier")
        expect(getDirection(1, 2, "NS")).toBe("Marina South Pier")
        expect(getDirection(2, 20, "NS")).toBe("Marina South Pier")

        expect(getDirection(20, 5, "NS")).toBe("Jurong East")
        expect(getDirection(2, 1, "NS")).toBe("Jurong East")
    })

    test("EW Line returns correct direction", () => {
        expect(getDirection(4, 33, "EW")).toBe("Tuas Link")
        expect(getDirection(33, 4, "EW")).toBe("Pasir Ris")
    })

    test("CG Line returns correct direction", () => {
        expect(getDirection(1, 3, "CG")).toBe("Tanah Merah")
        expect(getDirection(3, 1, "CG")).toBe("Changi Airport")
    })

    test("CE Line returns correct direction", () => {
        expect(getDirection(1, 2, "CE")).toBe("Stadium")
        expect(getDirection(2, 1, "CE")).toBe("Marina South Pier")
    })

    test("CC Line returns correct direction", () => {
        expect(getDirection(1, 2, "CC")).toBe("HarbourFront")
        expect(getDirection(2, 1, "CC")).toBe("Dhoby Ghaut")
    })

    test("DT Line returns correct direction", () => {
        expect(getDirection(1, 2, "DT")).toBe("Expo")
        expect(getDirection(2, 1, "DT")).toBe("Bukit Panjang")
    })

    test("BP Line returns correct direction", () => {
        expect(getDirection(1, 2, "BP")).toBe("Service B via Petir") // cck towards bukit panjang
        expect(getDirection(2, 1, "BP")).toBe("Choa Chu Kang") // towards cck
        expect(getDirection(9, 1, "BP")).toBe("Choa Chu Kang (Service A)") // bukit panjang towards cck 
    })

    test("NE Line returns correct direction", () => {
        expect(getDirection(1, 2, "NE")).toBe("Punggol")
        expect(getDirection(2, 1, "NE")).toBe("HarbourFront")
    })
})