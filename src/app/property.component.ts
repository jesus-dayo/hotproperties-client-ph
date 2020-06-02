import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Property} from './property';
import {PropertyType} from './propertyType';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {PropertyService} from './property.service';
import {DomSanitizer, Meta, Title} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import * as propertytypes from './propertytypes';
import * as cityph from './cityph';
import * as _ from 'lodash';

declare var $: any;
declare const ga: any;

@Component({
    selector: 'app-property',
    templateUrl: './property.component.html',
    styleUrls: ['./property.component.scss', '../../node_modules/bootstrap/dist/css/bootstrap.css', '../assets/css/mdb.css']
})
export class PropertyComponent implements OnInit, AfterViewInit {

    properties: Property[] = [];
    private _opened = true;
    checked = false;
    loaded = false;
    indeterminate = false;
    align = 'start';
    disabled = false;
    cities: { label: string, value: number }[];
    selectedCity: { label: string, value: number };
    propertyType: PropertyType[];
    selectedPropertyType: { label: string, value: number };

    constructor(
        private route: ActivatedRoute,
        private propertyService: PropertyService,
        public _DomSanitizer: DomSanitizer,
        private router: Router,
        iconRegistry: MatIconRegistry,
        private meta: Meta,
        private titleService: Title
    ) {
        iconRegistry.addSvgIcon(
        'garage',
        _DomSanitizer.bypassSecurityTrustResourceUrl('assets/img/private-garage.svg'));
        iconRegistry.addSvgIcon(
        'pool',
        _DomSanitizer.bypassSecurityTrustResourceUrl('assets/img/swimming-pool.svg'));
        iconRegistry.addSvgIcon(
        'gym',
        _DomSanitizer.bypassSecurityTrustResourceUrl('assets/img/exercise.svg'));
        iconRegistry.addSvgIcon(
        'area',
        _DomSanitizer.bypassSecurityTrustResourceUrl('assets/img/square-layouting-with-black-square-in-east-area.svg'));
        iconRegistry.addSvgIcon(
        'court',
        _DomSanitizer.bypassSecurityTrustResourceUrl('assets/img/basketball-court.svg'));
        iconRegistry.addSvgIcon(
        'room',
        _DomSanitizer.bypassSecurityTrustResourceUrl('assets/img/sleep.svg'));
        iconRegistry.addSvgIcon(
        'bath',
        _DomSanitizer.bypassSecurityTrustResourceUrl('assets/img/toilet.svg'));
        iconRegistry.addSvgIcon(
        'home',
        _DomSanitizer.bypassSecurityTrustResourceUrl('assets/img/baseline-home-24px.svg'));
        iconRegistry.addSvgIcon(
        'location',
        _DomSanitizer.bypassSecurityTrustResourceUrl('assets/img/baseline-location_on-24px.svg'));
        iconRegistry.addSvgIcon(
        'search',
        _DomSanitizer.bypassSecurityTrustResourceUrl('assets/img/baseline-search-24px.svg'));

         this.route.params.subscribe(params => {
             this.getProperties();
             const locationId = this.route.snapshot.paramMap.get('cityName');
             let propTypeId = this.route.snapshot.paramMap.get('propTypeName');
             if (propTypeId.toUpperCase() === 'CONDOMINIUM' || propTypeId.toUpperCase() === 'CONDO') {
                 propTypeId = 'CONDOMINIUM';
                 this.selectedPropertyType = {label: 'CONDOMINIUM', value: 2};
             }
             if (propTypeId.toUpperCase() === 'HOUSE-AND-LOT') {
                 propTypeId = 'HOUSE AND LOT';
                 this.selectedPropertyType = {label: 'HOUSE AND LOT', value: 1};
             }
             if (propTypeId.toUpperCase() == 'OFFICE-SPACE') {
                 propTypeId = 'OFFICE SPACE';
                 this.selectedPropertyType = {label: 'OFFICE SPACE', value: 3};
             }
             if (propTypeId.toUpperCase() == 'CONDO-HOUSE-OFFICESPACE') {
                 propTypeId = 'ALL';
             }
             let locationTitle = 'Philippines';
             let propertyTitle = 'Condo,House And Lot';
             if (locationId.toUpperCase() != 'ALL') {
                 const selectCity = _.find(cityph.CITY, function (o) {
                     return o.citymunDesc.toUpperCase() == locationId.toUpperCase();
                 });
                 if (selectCity) {
                     this.selectedCity = {label: selectCity.citymunDesc, value: selectCity.id};
                     const lower = locationId.toLowerCase();
                     locationTitle = lower.charAt(0).toUpperCase() + lower.substr(1);
                 }
             }
             if (propTypeId != 'ALL') {
                 let lower = propTypeId.toLowerCase();
                 if (lower == 'condominium') {
                     lower = 'condo';
                 }
                 propertyTitle = lower.charAt(0).toUpperCase() + lower.substr(1);
             }
             this.titleService.setTitle(propertyTitle + ' for sale in ' + locationTitle + ' | HotPropertiesPh');
             const decription = 'Buy ' + propertyTitle + ' in ' + locationTitle + '. Our ' + propertyTitle + ' listing is always up to date, inquire now and our licensed real estate brokers will be happy to assist you.';
             const attributeSelector = 'name="description"';
             this.meta.removeTag(attributeSelector);
             this.meta.addTag({name: 'description', content: decription});
             this.meta.addTag({name: 'author', content: 'HotPropertiesPh'});
         });

             this.cities = $.map(cityph.CITY, function (value, key) {
                     return {
                         label: value.citymunDesc,
                         value: value.id
                     };
                 });
             this.propertyType =  $.map(propertytypes.PROPERTYTYPE, function (value, key) {
                     return {
                         label: value.name,
                         value: value.id
                     };
                 });
            this.cities = _.orderBy(this.cities, ['label'], ['asc']);
            this.propertyType = _.orderBy(this.propertyType, ['label'], ['asc']);
    }

    compareProp(o1: any, o2: any): boolean {
        if (!o1 || !o2) {
            return false;
        }
      return o1.label === o2.label;
    }

    compareLoc(o1: any, o2: any): boolean {
        if (!o1 || !o2) {
            return false;
        }
      return o1.label === o2.label;
    }

    ngAfterViewInit(): void {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
            (<any>window).ga('set', 'page', event.urlAfterRedirects);
            (<any>window).ga('send', 'pageview');
          }
        });
      }

    ngOnInit(): void {
        this.getProperties();
    }

    search() {
//         this.propertyService.getProperties($("#locationId").val(),$("#propTypeId").val())
//      .subscribe(propList => {
//          this.properties = propList;
//        console.log(this.properties);
//             });
        let propTypeName = 'ALL';
        let cityName = 'ALL';
        if (this.selectedPropertyType) {
            propTypeName = this.selectedPropertyType.label;
        }
        if (this.selectedCity) {
            cityName = this.selectedCity.label;
        }
        if (propTypeName == 'CONDOMINIUM') {
            propTypeName = 'condo';
        }
        if (propTypeName == 'HOUSE AND LOT') {
            propTypeName = 'house-and-lot';
        }
        if (propTypeName == 'OFFICE SPACE') {
            propTypeName = 'office-space';
        }
        if (propTypeName == 'ALL') {
            propTypeName = 'condo-house-officespace';
        }

        this.router.navigate(['for-sale/' + propTypeName + '/' + cityName.toLowerCase()]);
    }

    //
    //    private _toggleSidebar() {
    //        this._opened = !this._opened;
    //    }

    getProperties(): void {
        const locationId = this.route.snapshot.paramMap.get('cityName');
        let propTypeId = this.route.snapshot.paramMap.get('propTypeName');
        if (propTypeId.toUpperCase() === 'CONDOMINIUM' || propTypeId.toUpperCase() === 'CONDO') {
            propTypeId = 'CONDOMINIUM';
        }
        if (propTypeId.toUpperCase() === 'HOUSE-AND-LOT') {
            propTypeId = 'HOUSE AND LOT';
        }
        if (propTypeId.toUpperCase() == 'OFFICE-SPACE') {
            propTypeId = 'OFFICE SPACE';
        }
        if (propTypeId.toUpperCase() == 'CONDO-HOUSE-OFFICESPACE') {
            propTypeId = 'ALL';
        }
        const selectedPropertyType = _.find(propertytypes.PROPERTYTYPE, function (o) {
            return o.name == propTypeId;
        });
        const selectedCity = _.find(cityph.CITY, function (o) {
            return o.citymunDesc.toUpperCase() == locationId.toUpperCase();
        });
        let cityId = 0;
        let propertyTypeId = 0;
        if (selectedCity) {
            cityId = selectedCity.id;
        }
        if (selectedPropertyType) {
            propertyTypeId = selectedPropertyType.id;
        }
        this.propertyService.getProperties(cityId, propertyTypeId)
            .subscribe(res => {
                this.properties = res.content;
                this.loaded = true;
            });
    }

    viewProperty(propertyId: number): void {
        this.router.navigate(['property/' + propertyId]);
    }
}
