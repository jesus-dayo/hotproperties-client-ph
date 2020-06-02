import {PropertyType} from './propertyType';
import {City} from './city';
import {Images} from './images';

export class PropertyResponse {
    propertyId: number;
    parentId: number;
    propertyName: string;
    description: string;
    categoryName: string;
    price: string;
    maxPrice: string;
    rooms: number;
    maxRooms: number;
    propertyType: PropertyType;
    city: City;
    bath: number;
    swimming: boolean;
    gym: boolean;
    country: string;
    street: string;
    province: string;
    postal: string;
    sqm: number;
    maxSQM: number;
    garage: boolean;
    court: boolean;
    youtubelink: string;
    latitude: number;
    longitude: number;
    title: string;
    metadescription: string;
    images: Images[];
    profileImage: Images;
    childProperty: PropertyResponse[];
}
