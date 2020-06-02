import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Property} from './property';
import {Inquiry} from './inquiry/inquiry';
import {PropertyService} from './property.service';
import {InquiryService} from './inquiry.service';
import {City} from './city';
import {PropertyType} from './propertyType';
import {NavigationEnd, Router} from '@angular/router';
import {DomSanitizer, Meta, Title} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {NgxCarousel} from 'ngx-carousel';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import * as propertytypes from './propertytypes';
import * as cityph from './cityph';
import * as _ from 'lodash';

declare var $: any;
declare const ga: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./app.component.css', './home.component.scss', '../../node_modules/bootstrap/dist/css/bootstrap.css'
        , '../assets/font-awesome/css/font-awesome.css', '../assets/font-awesome/css/font-awesome.css',
        '../assets/simple-line-icons/css/simple-line-icons.css',
        '../assets/css/glyphicons.css', '../assets/css/landing-page.css', '../assets/css/app.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
    public propertysearch: FormGroup;
    featuredproperties: Property[];
    newdevproperties: Property[];
    cities: City[];
    selectedCity: { label: string, value: number };
    propertyType: PropertyType[];
    selectedPropertyType: { label: string, value: number };
    public submitted: boolean;
    slides: Property[];
    public carouselTileOneItems: Array<any> = [];
    public carouselTileOne: NgxCarousel;
    public carouselTileTwo: NgxCarousel;
    contactForm: FormGroup;
    public inquiry: Inquiry;
    inquiryProgress: boolean;

    constructor(
        private propertyService: PropertyService,
        private router: Router,
        private changeDetectionRef: ChangeDetectorRef,
        public _DomSanitizer: DomSanitizer,
        iconRegistry: MatIconRegistry,
        private fb: FormBuilder,
        private inquiryService: InquiryService,
        public toastr: ToastsManager,
        vcr: ViewContainerRef,
        private meta: Meta,
        private titleService: Title
    ) {
          iconRegistry.addSvgIcon(
          'home',
          _DomSanitizer.bypassSecurityTrustResourceUrl('assets/img/baseline-home-24px.svg'));
          iconRegistry.addSvgIcon(
          'location',
          _DomSanitizer.bypassSecurityTrustResourceUrl('assets/img/baseline-location_on-24px.svg'));
          iconRegistry.addSvgIcon(
          'search',
          _DomSanitizer.bypassSecurityTrustResourceUrl('assets/img/baseline-search-24px.svg'));
          iconRegistry.addSvgIcon(
          'checkcircle',
          _DomSanitizer.bypassSecurityTrustResourceUrl('assets/img/baseline-check_circle_outline-24px.svg'));
          iconRegistry.addSvgIcon(
          'horizontal',
          _DomSanitizer.bypassSecurityTrustResourceUrl('assets/img/baseline-horizontal_split-24px.svg'));
          this.toastr.setRootViewContainerRef(vcr);
          this.contactForm = fb.group({
            contactFormName: ['', Validators.required],
            contactFormEmail: ['', [Validators.required, Validators.email]],
            contactFormSubject: ['', Validators.required],
            contactFormMessage: ['', Validators.required]
          });
          this.meta.addTag({ name: 'description', content: 'Buy condo,house and lot, office space from experienced licensed brokers. Streamrock Realty Corporation is a duly registered real estate brokerage company affiliated and accredited with Ayala Land and its residential brands Ayala Land Premier, Alveo Land, and Avida Land. the company was registered with the Securities and Exchange Commission (SEC) on Feburary 2012.Streamrock Realty Corporation is dedicated to provide professional real estate services to its growing client' });
        this.meta.addTag({name: 'author', content: 'HotPropertiesPh'});
        this.titleService.setTitle('Condo,House and Lot,Office Space for Sale | HotPropertiesPh');

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
        this.inquiry = new Inquiry();
        this.propertysearch = new FormGroup(
            {
                locationId: new FormControl(''),
                propTypeId: new FormControl('')
            }
        );
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
        this.getFeaturedProperties();
        this.getNewDevProperties();

      this.carouselTileOne = {
         grid: { xs: 1, sm: 2, md: 3, lg: 4, all: 0 },
         speed: 1000,
         interval: 50000,
         point: {
           visible: true,
           pointStyles: `
             .ngxcarouselPoint {
               list-style-type: none;
               text-align: center;
               padding: 12px;
               margin: 0;
               white-space: nowrap;
               overflow: auto;
               box-sizing: border-box;
             }
             .ngxcarouselPoint li {
               display: inline-block;
               border-radius: 50%;
               background: #6b6b6b;
               padding: 5px;
               margin: 0 3px;
               transition: .4s;
             }
             .ngxcarouselPoint li.active {
                 border: 2px solid rgba(0, 0, 0, 0.55);
                 transform: scale(1.2);
                 background: transparent;
               }
           `
         },
         load: 2,
         loop: true,
         touch: true,
         easing: 'ease',
         animation: 'lazy'
       };

       this.carouselTileTwo = {
          grid: { xs: 1, sm: 2, md: 3, lg: 3, all: 0 },
          speed: 800,
          interval: 0,
          point: {
            visible: true,
            pointStyles: `
              .ngxcarouselPoint {
                list-style-type: none;
                text-align: center;
                padding: 12px;
                margin: 0;
                white-space: nowrap;
                overflow: auto;
                box-sizing: border-box;
              }
              .ngxcarouselPoint li {
                display: inline-block;
                border-radius: 50%;
                background: #6b6b6b;
                padding: 5px;
                margin: 0 3px;
                transition: .4s;
              }
              .ngxcarouselPoint li.active {
                  border: 2px solid rgba(0, 0, 0, 0.55);
                  transform: scale(1.2);
                  background: transparent;
                }
            `
          },
          load: 2,
          loop: false,
          touch: true,
          easing: 'ease',
          animation: 'lazy'
        };

    }

    showSuccess(message: string) {
        this.toastr.success(message, 'Success!');
    }

    showError(message: string) {
        this.toastr.error(message, 'Oops!');
    }

      showWarning() {
        this.toastr.warning('You are being warned.', 'Alert!');
      }

    showInfo() {
        this.toastr.info('Just some information for you.');
    }

    showCustom() {
        this.toastr.custom('<span style="color: red">Message in red.</span>', null, {enableHTML: true});
    }

    openLink(url: string) {
        window.open(url, '_blank');
    }

    getFeaturedProperties(): void {
        this.propertyService.listFeaturedProperties()
            .subscribe(res => {
                this.featuredproperties = res;
                if (!this.changeDetectionRef['destroyed']) {
                    this.changeDetectionRef.detectChanges();
                }
                //this.slides = _.chunk(this.featuredproperties, 3);
                this.slides = this.featuredproperties;
            });
    }

    getNewDevProperties(): void {
         this.propertyService.listDevelopmentProperties()
            .subscribe(res => {
                this.newdevproperties = res;
                if (!this.changeDetectionRef['destroyed']) {
    this.changeDetectionRef.detectChanges();
}
//                this.slides = _.chunk(this.newdevproperties, 3);
//                console.log(this.slides);
            });
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

    inquire(): void {
        this.inquiryProgress = false;
        if (this.validateInquiry()) {
            this.inquiryProgress = true;
            this.inquiryService.inquire(this.inquiry).subscribe(res => {
                this.inquiry = new Inquiry();
                this.showSuccess('Inquiry has been sent. The broker will contact you immediately.');
                this.inquiryProgress = false;
            });
        }
    }

    validateInquiry(): boolean {
        if (!this.inquiry.name) {
            this.showError('name is a required field');
            return false;
        }
        if (!this.inquiry.email) {
            this.showError('email is a required field');
            return false;
        }
        if (!this.inquiry.phone) {
            this.showError('phone is a required field');
            return false;
        }
        if (!this.inquiry.message) {
            this.showError('message is a required field');
            return false;
        }
        return true;
    }

}

export interface PropertySearch {
    locationId: string;
    propTypeId: string;
}
