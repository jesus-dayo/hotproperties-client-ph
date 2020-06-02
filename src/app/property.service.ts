import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {catchError, map, tap} from 'rxjs/operators';

import {Property} from './property';
import {PropertyResponse} from './propertyResponse';
import {PropertyResponsePaginated} from './propertyResponsePaginated';
import {MessageService} from './message.service';
import {Images} from './images';

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class PropertyService {

    private propertyUrl = 'http://localhost:5001/api/property/manage/v1';  // URL to web api

    constructor(
        private http: HttpClient,
        private messageService: MessageService) { }

    /** GET properties from the server */
    //  getProperties (): Observable<Property[]> {
    //    return this.http.get<Property[]>(this.propertyUrl)
    //      .pipe(
    //        tap(properties => this.log(`fetched heroes`)),
    //        catchError(this.handleError('getProperties', []))
    //      );
    //  }

    /** GET hero by id. Return `undefined` when id not found */
    getPropertyNo404<Data>(locationId: number, propTypeId: number): Observable<Property> {
        const url = `${this.propertyUrl}/listPageByLocationAndType?location=${locationId}&type=${propTypeId}`;
        return this.http.get<Property[]>(url)
            .pipe(
            map(properties => properties[0]),
            tap(h => {
                const outcome = h ? `fetched` : `did not find`;
                this.log(`${outcome} location id=${locationId}`);
            }),
            catchError(this.handleError<Property>(`getProperty id=${locationId}`))
            );
    }

    /** GET property by id. Will 404 if id not found */
    getProperties(locationId: number, propTypeId: number): Observable<PropertyResponsePaginated> {
        const url = `${this.propertyUrl}/listPageByLocationAndType?location=${locationId}&type=${propTypeId}`;
        return this.http.get(url)
        .map(this.handleSuccess);
    }

    getSimilarProperties(locationId: number, propTypeId: number, id: number): Observable<Property[]> {
        const url = `${this.propertyUrl}/findByLocationIdAndTypeIdAndStatusAndIdNot?location=${locationId}&type=${propTypeId}&id=${id}`;
        return this.http.get(url)
            .map(this.handleSuccess);
    }

    getProperty(propTypeId: number): Observable<Property> {
        const url = `${this.propertyUrl}/getProperty?propertyId=${propTypeId}`;
        return this.http.get(url)
        .map(this.handleSuccess);
    }

    getDevProperty(propTypeId: number): Observable<Property> {
        const url = `${this.propertyUrl}/getDevProperty?propertyId=${propTypeId}`;
        return this.http.get(url)
        .map(this.handleSuccess);
    }

    getPropertiesNew(): Observable<PropertyResponsePaginated> {
        const url = `${this.propertyUrl}/getPropertiesNew`;
        return this.http.get(url)
        .map(this.handleSuccess);
    }

    listFeaturedProperties(): Observable<Property[]> {
        const url = `${this.propertyUrl}/listFeaturedProperties`;
        return this.http.get(url)
            .map(this.handleSuccess);
    }

    listDevelopmentProperties(): Observable<Property[]> {
        const url = `${this.propertyUrl}/listDevelopmentProperties`;
        return this.http.get(url)
            .map(this.handleSuccess);
    }

    listDevPropertiesForSelect(): Observable<Property[]> {
        const url = `${this.propertyUrl}/listDevPropertiesForSelect`;
        return this.http.get(url)
            .map(this.handleSuccess);
    }

    sold(propId: number): Observable<string> {
        const url = `${this.propertyUrl}/sold?propertyId=${propId}`;
        return this.http.get(url)
        .map(this.handleSuccess);
    }

    cancel(propId: number): Observable<string> {
        const url = `${this.propertyUrl}/cancel?propertyId=${propId}`;
        return this.http.get(url)
        .map(this.handleSuccess);
    }

    create(property: Property): Observable<PropertyResponse> {
        const url = `${this.propertyUrl}/create`;
        return this.http.post(url, property, httpOptions)
            .map(this.handleSuccess);
    }

    update(property: Property): Observable<PropertyResponse> {
        const url = `${this.propertyUrl}/update`;
        return this.http.post(url, property, httpOptions)
            .map(this.handleSuccess);
    }

    uploadImages(images: Images[]): Observable<string> {
        const url = `${this.propertyUrl}/uploadMultipleImage`;
        return this.http.post(url, images, httpOptions)
            .map(this.handleSuccess);
    }

    uploadImage(image: Images): Observable<string> {
        const url = `${this.propertyUrl}/uploadImage`;
        return this.http.post(url, image, httpOptions)
            .map(this.handleSuccess);
    }

    deleteImage(image: Images): Observable<string> {
        const url = `${this.propertyUrl}/deleteImage`;
        return this.http.post(url, image, httpOptions)
            .map(this.handleSuccess);
    }

    /* GET properties by location and type */
    searchProperties(locationId: number, propTypeId: number): Observable<PropertyResponsePaginated> {
        return this.http.get(`${this.propertyUrl}/listPageByLocationAndType?location=${locationId}&type=${propTypeId}`)
      .map(this.handleSuccess);
    }

    handleSuccess(response: Response) { // the return here is any, as you dont know how do the POJO(s) generated by response.json() look like
        let body;

        if (response) {
            body = response;
        }

        return body || {};
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    /** Log a HeroService message with the MessageService */
    private log(message: string) {
        this.messageService.add('HeroService: ' + message);
    }
}
