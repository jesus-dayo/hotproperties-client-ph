import {Property} from './property';

export class PropertyResponsePaginated {
  content: Property[];
  first: boolean;
  last: boolean;
  'number': number;
  numberOfElements: number;
  name: string;
  description: string;
  price: string;
  pageable: {};
  size: number;
  sort: {};
  totalElements: number;
  totalPages: number;
}
