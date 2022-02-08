export interface TrainInformation {
    id: string
    code: string[]
    lines: Line[]
    name: string
}

export interface Line {
    line: string
    timings: Timing[]
}

export interface Timing {
    dest: string
    first_weekday?: string
    first_sat?: string
    first_sun?: string
    last: string
}
