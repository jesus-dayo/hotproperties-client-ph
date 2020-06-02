import {AfterViewInit, Component, OnInit, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Property} from '.././property';
import {PropertyService} from '.././property.service';
import {Images} from '.././images';
import {TruncatePipe} from '.././truncatePipe';
import {Inquiry} from '.././inquiry/inquiry';
import {InquiryService} from '.././inquiry.service';
import {NgxGalleryImage, NgxGalleryOptions} from 'ngx-gallery';
import {NgxCarousel} from 'ngx-carousel';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {DomSanitizer, Meta, Title} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';
import {EmbedVideoService} from 'ngx-embed-video';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';

declare var $: any;
declare const ga: any;

@Component({
    selector: 'app-property-details',
    templateUrl: './property-details.component.html',
    styleUrls: ['./property-details.component.scss', '../../../node_modules/font-awesome/css/font-awesome.css',
        '../../assets/css/glyphicons.css', '../../../node_modules/bootstrap/dist/css/bootstrap.css']
})
export class PropertyDetailsComponent implements OnInit, AfterViewInit {
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];
    prop: Property;
    similarProperties: Property[];
    images: Images[];
    inquiry: Inquiry;
    inquiryProgress: boolean;
    contactForm: FormGroup;
    iframe_html: any;
    public carouselTileOneItems: Array<any> = [];
    public carouselTileOne: NgxCarousel;

    constructor(
        private route: ActivatedRoute,
        private propertyService: PropertyService,
        public _DomSanitizer: DomSanitizer,
        private router: Router,
        iconRegistry: MatIconRegistry,
        private embedService: EmbedVideoService,
        private fb: FormBuilder,
        private inquiryService: InquiryService,
        public toastr: ToastsManager,
        vcr: ViewContainerRef,
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
        'phone',
        _DomSanitizer.bypassSecurityTrustResourceUrl('assets/img/ic_perm_phone_msg_black_24px.svg'));

        this.toastr.setRootViewContainerRef(vcr);
        this.contactForm = fb.group({
          contactFormName: ['', Validators.required],
          contactFormEmail: ['', [Validators.required, Validators.email]],
          contactFormSubject: ['', Validators.required],
          contactFormMessage: ['', Validators.required]
        });

        this.carouselTileOne = {
           grid: { xs: 1, sm: 2, md: 3, lg: 4, all: 0 },
           speed: 2000,
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
         route.params.subscribe(val => {
           this.inquiry = new Inquiry();
             this.getProperty();
              window.scrollTo(0, 0);
         });
      }

      ngAfterViewInit(): void {
        this.router.events.subscribe(event => {
          if (event instanceof NavigationEnd) {
              (<any>window).ga('set', 'page', event.urlAfterRedirects);
              (<any>window).ga('send', 'pageview');
            }
          });
        }

  ngOnInit(): void  {
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

    inquire(): void {
        this.inquiryProgress = false;
        if (this.validateInquiry()) {
            this.inquiryProgress = true;
            this.inquiry.propertyName = this.prop.propertyName;
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

    private _opened = false;

  private _toggleSidebar() {
    this._opened = !this._opened;
  }

  getProperty(): void {
        const propTypeId = this.route.snapshot.paramMap.get('propTypeId');
        const propType = this.route.snapshot.paramMap.get('type');
        const location = this.route.snapshot.paramMap.get('location');
        this.propertyService.getProperty(Number(propTypeId))
            .subscribe(res => {
                this.prop = res;
                this.images = res.images;
                let transformedPropertyType = String(propType).replace(/-/g, ' ');
                transformedPropertyType = transformedPropertyType.charAt(0).toUpperCase() + transformedPropertyType.slice(1);
                let transformedLocation = String(location).replace(/-/g, ' ');
                transformedLocation = transformedLocation.charAt(0).toUpperCase() + transformedLocation.slice(1);
                if (this.prop.title) {
                    this.titleService.setTitle(this.prop.title);
                } else {
                    this.titleService.setTitle(transformedPropertyType + ' for Sale in ' + transformedLocation + ' - ' + this.prop.propertyName);
                }
                const attributeSelector = 'name="description"';
                if (this.prop.metadescription) {
                    this.meta.removeTag(attributeSelector);
                    this.meta.addTag({name: 'description', content: this.prop.metadescription});
                } else {
                    const truncatePipe = new TruncatePipe();
                    const decription = 'For sale ' + transformedPropertyType + ' - ' + this.prop.propertyName + '. ' + truncatePipe.transform(String(this.prop.description).replace(/<[^>]+>/gm, ''), '250');
                    this.meta.removeTag(attributeSelector);
                    this.meta.addTag({name: 'description', content: decription});
                }
                this.meta.addTag({name: 'author', content: 'HotPropertiesPh'});
                this.galleryImages = [];
                for (const o of this.images) {
                    if (!o.profile) {

                        this.galleryImages.push({
                            small: o.image,
                            medium: o.image,
                            big: o.image,
                            description: o.description
                        });
                    }
                }

            this.galleryOptions = [
                {},
                {'breakpoint': 768, 'width': '400px', 'height': '350px', 'thumbnailsColumns': 3},
                {'breakpoint': 576, 'width': '500px', 'height': '400px', 'thumbnailsColumns': 3},
                {'breakpoint': 375, 'width': '340px', 'height': '230px', 'thumbnailsColumns': 2},
                {'breakpoint': 360, 'width': '340px', 'height': '220px', 'thumbnailsColumns': 2},
                {'breakpoint': 320, 'width': '280px', 'height': '200px', 'thumbnailsColumns': 2}
            ];

                if (this.prop.youtubelink) {
                    this.iframe_html = this.embedService.embed(this.prop.youtubelink, {
                        query: {portrait: 0, color: '333'},
                        attr: {class: 'video'}
                    });
                }
                this.propertyService.getSimilarProperties(Number(this.prop.city.id), Number(this.prop.propertyType.id), Number(propTypeId))
          .subscribe(res => {
              this.similarProperties = res;

        });
            });
          }

        }
