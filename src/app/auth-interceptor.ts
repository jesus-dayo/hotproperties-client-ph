import {Inject, Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(@Inject(LOCAL_STORAGE) private localStorage: WebStorageService) {
    }

    intercept(req: HttpRequest<any>,
              next: HttpHandler): Observable<HttpEvent<any>> {

        const idToken = this.localStorage.get('id_token');

        if (idToken) {
            const cloned = req.clone({
                headers: req.headers.set('Authorization',
                    idToken)
            });

            return next.handle(cloned);
        } else {
            return next.handle(req);
        }
    }
}
