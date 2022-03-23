import getBusInformation from "./getBusInformation"

describe("Bus Information", () => {
    test("Returns bus information if valid", async () => {
        const info = await getBusInformation("10", "76059")
        expect(info!.length).not.toBeLessThan(0)
    })

    test("Returns null if non-existent bus stop code given", async () => {
        await expect(getBusInformation("10", "asdf")).resolves.toBeNull()
    })

    test("Returns null if non-existent bus number given", async () => {
        await expect(getBusInformation("asdf", "76059")).resolves.toBeNull()
    })
})