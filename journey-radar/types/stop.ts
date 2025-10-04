import {GeoPosition} from "@/types/geo-position";

export interface Stop {
    id: string;
    code: string;
    name: string;
    position: GeoPosition;
}