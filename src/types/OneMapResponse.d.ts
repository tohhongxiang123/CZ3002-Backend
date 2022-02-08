export interface OneMapRouteResponse {
    requestParameters: RequestParameters;
    plan: Plan;
    debugOutput: DebugOutput;
    elevationMetadata: ElevationMetadata;
}
export interface RequestParameters {
    date: string;
    preferredRoutes: string;
    walkReluctance: string;
    fromPlace: string;
    transferPenalty: string;
    maxWalkDistance: string;
    maxTransfers: string;
    otherThanPreferredRoutesPenalty: string;
    numItineraries: string;
    waitAtBeginningFactor: string;
    mode: string;
    arriveBy: string;
    showIntermediateStops: string;
    toPlace: string;
    time: string;
}
export interface Plan {
    date: number;
    from: FromOrTo;
    to: FromOrTo;
    itineraries?: (Itinerary)[] | null;
}
export interface FromOrTo {
    name: string;
    lon: number;
    lat: number;
    orig: string;
    vertexType: string;
}
export interface Itinerary {
    duration: number;
    startTime: number;
    endTime: number;
    walkTime: number;
    transitTime: number;
    waitingTime: number;
    walkDistance: number;
    walkLimitExceeded: boolean;
    elevationLost: number;
    elevationGained: number;
    transfers: number;
    legs?: (LegsEntity)[] | null;
    tooSloped: boolean;
    fare: string;
}
export interface LegsEntity {
    startTime: number;
    endTime: number;
    departureDelay: number;
    arrivalDelay: number;
    realTime: boolean;
    distance: number;
    pathway: boolean;
    mode: string;
    route: string;
    agencyTimeZoneOffset: number;
    interlineWithPreviousLeg: boolean;
    from: From;
    to: To;
    legGeometry: LegGeometry;
    rentedBike: boolean;
    transitLeg: boolean;
    duration: number;
    intermediateStops?: (ToOrIntermediateStopsEntityOrFrom | null)[] | null;
    steps?: (StepsEntity | null)[] | null;
    numIntermediateStops: number;
    agencyName?: string | null;
    agencyUrl?: string | null;
    routeType?: number | null;
    routeId?: string | null;
    agencyId?: string | null;
    tripId?: string | null;
    serviceDate?: string | null;
    routeShortName?: string | null;
    routeLongName?: string | null;
}
export interface From {
    name: string;
    lon: number;
    lat: number;
    departure: number;
    orig?: string | null;
    vertexType: string;
    stopId?: string | null;
    stopCode?: string | null;
    arrival?: number | null;
    stopIndex?: number | null;
    stopSequence?: number | null;
}
export interface To {
    name: string;
    stopId?: string | null;
    stopCode?: string | null;
    lon: number;
    lat: number;
    arrival: number;
    departure?: number | null;
    stopIndex?: number | null;
    stopSequence?: number | null;
    vertexType: string;
    orig?: string | null;
}
export interface LegGeometry {
    points: string;
    length: number;
}
export interface ToOrIntermediateStopsEntityOrFrom {
    name: string;
    stopId: string;
    stopCode: string;
    lon: number;
    lat: number;
    arrival: number;
    departure: number;
    stopIndex: number;
    stopSequence: number;
    vertexType: string;
}
export interface StepsEntity {
    distance: number;
    relativeDirection: string;
    streetName: string;
    absoluteDirection: string;
    stayOn: boolean;
    area: boolean;
    bogusName: boolean;
    lon: number;
    lat: number;
    elevation?: (null)[] | null;
}
export interface DebugOutput {
    precalculationTime: number;
    pathCalculationTime: number;
    pathTimes?: (number)[] | null;
    renderingTime: number;
    totalTime: number;
    timedOut: boolean;
}
export interface ElevationMetadata {
    ellipsoidToGeoidDifference: number;
    geoidElevation: boolean;
}
