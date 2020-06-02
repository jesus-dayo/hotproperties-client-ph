import {City} from './city';
import {PropertyType} from './propertyType';
import {Images} from './images';

export class Property {
    propertyId: number;
    propertyName: string;
    parentId: number;
    description: string;
    price: string;
    maxPrice: string;
    rooms: number;
    maxRooms: number;
    propertyType: PropertyType;
    locationId: number;
    category: number;
    categoryName: string;
    status: number;
    bath: number;
    swimming: boolean;
    gym: boolean;
    city: City;
    sqm: number;
    maxSQM: number;
    garage: boolean;
    court: boolean;
    youtubelink: string;
    link: string;
    latitude: number;
    longitude: number;
    title: string;
    metadescription: string;
    images: Images[];
    profileImage: Images;
    childProperty: Property[];
}
