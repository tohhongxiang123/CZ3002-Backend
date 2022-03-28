import getRoute from "./getRoute";
import fetch from 'node-fetch'

jest.mock('node-fetch', () => jest.fn())

describe("Get Route", () => {
    test("Gets route as expected", async () => {
        const expectedResponse = { plan: { itineraries: [{ legs: "Route here" }] } };
        (fetch as jest.MockedFunction<any>).mockImplementation(() => Promise.resolve({ json: () => expectedResponse }))

        const response = await getRoute({ start: [1, 2], end: [3, 4], date: "22-11-22", time: "2200" })
        expect(response).toEqual(expectedResponse.plan.itineraries[0].legs)
    })

    test("Throws error if error in fetching route", async () => {
        const expectedResponse = { error: "Invalid path" };
        (fetch as jest.MockedFunction<any>).mockImplementation(() => Promise.resolve({ json: () => expectedResponse }))

        await expect(getRoute({ start: [1, 2], end: [3, 4], date: "22-11-22", time: "2200" })).rejects.toThrow()
    })

    test("Throws error if route is not found", async () => {
        const expectedResponse = { plan: { itineraries: [] } };
        (fetch as jest.MockedFunction<any>).mockImplementation(() => Promise.resolve({ json: () => expectedResponse }))

        await expect(getRoute({ start: [1, 2], end: [3, 4], date: "22-11-22", time: "2200" })).rejects.toThrow()
    })
})