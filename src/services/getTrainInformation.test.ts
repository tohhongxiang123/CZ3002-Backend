import getTrainInformation from "./getTrainInformation"

describe("Train Information", () => {
    test("Returns train information if found", async () => {
        await expect(getTrainInformation("NS1")).resolves
            .toHaveProperty('id')
    })

    test("Returns undefined if train stop code is invalid", async () => {
        await expect(getTrainInformation("NONEXISTENT_TRAIN_CODE")).resolves.toBeUndefined()
    })
})