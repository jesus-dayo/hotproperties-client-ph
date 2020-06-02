import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Property} from './property';

declare const ga: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit {
    propertysearch: FormGroup;
    properties: Property[];
    public submitted: boolean;
    public displayHome = true;

    constructor(
        private router: Router,
        iconRegistry: MatIconRegistry,
        public _DomSanitizer: DomSanitizer,
        private route: ActivatedRoute
    ) {
          iconRegistry.addSvgIcon(
          'horizontal',
          _DomSanitizer.bypassSecurityTrustResourceUrl('assets/img/baseline-horizontal_split-24px.svg'));
          /*this.route.url.subscribe(url =>{
             if(url[0].path != "home" && url[0].path != "" && url[0].path != "/"){
                this.displayHome = true;
             }else{
                this.displayHome = false;
             }
          });*/
        }

        ngAfterViewInit(): void {
          this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                (<any>window).ga('set', 'page', event.urlAfterRedirects);
                (<any>window).ga('send', 'pageview');
              }
            });
          }

    ngOnInit() {
        this.propertysearch = new FormGroup(
            {
                location: new FormControl(''),
                propType: new FormControl('')
            }
        );
        this.properties = [];
    }

    admin() {
        this.router.navigate(['admin']);
    }

}

export interface PropertySearch {
    location: string;
    propType: string;
}
