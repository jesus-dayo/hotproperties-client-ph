import {ChangeDetectorRef, Component, Inject, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatIconRegistry, MatPaginator, MatTableDataSource} from '@angular/material';
import {PropertyService} from '.././property.service';
import {LoginService} from '.././login.service';
import {Property} from '.././property';
import {PropertyType} from '.././propertyType';
import {City} from '.././city';
import {PropertyImage} from '.././propertyImages';
import {ActivatedRoute, Router} from '@angular/router';
import {FileHolder} from '.././fileHolder';
import {DomSanitizer} from '@angular/platform-browser';
import {UploadFileService} from '../upload-file.service';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import * as _ from 'lodash';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    providers: [UploadFileService],
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
    properties: Property[];
    displayedColumns = ['image', 'name', 'price', 'rooms', 'type', 'category', 'location', 'action'];
    dataSource: MatTableDataSource<Property>;
    panelOpenState = false;
    public popoverTitleSold = 'Change Status';
    public popoverMessageSold = 'Mark property as Sold?';
    public popoverTitleCancel = 'Change Status';
    public popoverMessageCancel = 'Mark property as Cancelled?';
    public confirmClicked = false;
    public cancelClicked = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private propertyService: PropertyService,
        private loginService: LoginService,
        public _DomSanitizer: DomSanitizer,
        public dialog: MatDialog,
        private changeDetectorRefs: ChangeDetectorRef,
        iconRegistry: MatIconRegistry,
    ) {
        iconRegistry.addSvgIcon(
            'clear',
            _DomSanitizer.bypassSecurityTrustResourceUrl('assets/img/ic_clear_black_24px.svg'));
        iconRegistry.addSvgIcon(
            'monetize',
            _DomSanitizer.bypassSecurityTrustResourceUrl('assets/img/ic_monetization_on_black_24px.svg'));
        iconRegistry.addSvgIcon(
            'build',
            _DomSanitizer.bypassSecurityTrustResourceUrl('assets/img/baseline-build-24px.svg'));
    }

    ngOnInit(): void {
        if (this.loginService.isLoggedIn()) {
            this.getProperties();
        } else {
            this.router.navigate(['login']);
        }
    }

    logout(): void {
        this.loginService.logout();
        this.router.navigate(['login']);
    }

    addProperty(): void {
        this.router.navigate(['admin/addProperty']);
    }

    updateProperty(propertyId: number): void {
        this.router.navigate(['admin/updateProperty/' + propertyId]);
    }

    getProperties(): void {
        this.propertyService.getPropertiesNew()
            .subscribe(res => {
                this.properties = res.content;
                this.dataSource = new MatTableDataSource<Property>(this.properties);
                this.dataSource.paginator = this.paginator;
                this.changeDetectorRefs.detectChanges();
                this.paginator._changePageSize(this.paginator.pageSize);
            });
    }

    markAsSold(propertyId): void {
        this.propertyService.sold(propertyId).subscribe(res => {
            this.getProperties();
        });
    }

    markAsCancelled(propertyId): void {
        this.propertyService.cancel(propertyId).subscribe(res => {
            this.getProperties();
        });
    }

    @ViewChild(MatPaginator) paginator: MatPaginator;

}

@Component({
    selector: 'update-dialog',
    templateUrl: './updateProperty.html',
    providers: [UploadFileService],
    styleUrls: ['./admin.component.scss']
})
export class UpdateDialog {

    constructor(
        public dialogRef: MatDialogRef<UpdateDialog>,
        @Inject(UploadFileService) private uploadService: UploadFileService,
        @Inject(Router) private router: Router,
        @Inject(PropertyService) public propertyService: PropertyService,
		@Inject(ToastsManager) public toastr: ToastsManager,
		@Inject(ViewContainerRef) vcr: ViewContainerRef,
        @Inject(MAT_DIALOG_DATA) public data: any) {
			this.toastr.setRootViewContainerRef(vcr);
        if (data.property.images) {
            for (let i = 0; i < data.property.images.length; i++) {
                this.uploadedImages.push(data.property.images[i].image);
            }
            if (data.property.profileImage) {
                this.profileImages.push(data.property.profileImage.image);
            }
        }
    }

    profileImage: File;
    additionalImages: File[] = [];
    addImage: PropertyImage = new PropertyImage();
    propImage: PropertyImage = new PropertyImage();
    latitude = this.data.property.latitude;
    longitude = this.data.property.longitude;
    propertyDevList: Property[];
    panelOpenState = false;

    uploadedImages: string[] = [];
    profileImages: string[] = [];

    showSuccess() {
        alert('Save successful');
    }

    showError() {
        alert('Please fill in all required fields.');
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

    onNoClick(): void {
        this.dialogRef.close();
    }

	validate(): boolean {
        if (!this.data.property.propertyName || !this.data.property.description || !this.data.property.propertyType
            || !this.data.property.city) {
            return true;
        }
        // new development
        if (this.data.property.category == 3) {
            if (!this.data.property.parentId) {
                return true;
            }
        }
        if (this.data.property.category != 2) {
            if (!this.data.property.price) {
                this.data.property.price = 0;
            }
            if (!this.data.property.rooms) {
                this.data.property.rooms = 0;
            }
            if (!this.data.property.bath) {
                this.data.property.bath = 0;
            }
        }

	}

    onSave() {
        if (this.validate()) {
            this.showError();
            return;
        }
        this.data.property.status = 1;
        this.data.property.latitude = this.latitude;
        this.data.property.longitude = this.longitude;
        this.propertyService.update(this.data.property)
            .subscribe(propResponse => {
                if (this.profileImage) {
                    this.propImage.propertyId = propResponse.propertyId;
                    this.propImage.profile = true;
                    this.uploadService.uploadfile(this.profileImage, this.propImage);
                }
                if (this.additionalImages && this.additionalImages.length > 0) {
                    this.addImage.propertyId = propResponse.propertyId;
                    this.addImage.profile = false;
                    for (let i = 0; i < this.additionalImages.length; i++) {
                        const addImageData = this.uploadService.uploadfile(this.additionalImages[i], this.addImage);
                    }
                }
               this.showSuccess();
               this.dialogRef.close();
            });
    }

    onUploadProfileFinished(file: FileHolder) {
        //        this.data.property.image = file.src;
        this.profileImage = file.file;
    }

    onChoseLocation(event) {
        this.latitude = event.coords.lat;
        this.longitude = event.coords.lng;
    }

    customStyle = {
        layout: {
            'margin': '10px',
        },
    };

    onUploadFinished(file: FileHolder) {
        //        this.data.property.additionalImage.push(file);
        //        this.uploadService.uploadfile(file.file);
        this.additionalImages.push(file.file);
    }

    onRemoved(file: FileHolder) {
        const imgToDelete = _.find(this.data.property.images, function (o) {
            return o.image == file.src;
        });
        if (imgToDelete) {
            this.uploadService.deleteFile(imgToDelete);
        } else {
            this.additionalImages.splice(this.additionalImages.indexOf(file.file), 1);
        }
    }

    onRemovedProfile(file: FileHolder) {
        if (this.data.property.profileImage) {
            this.uploadService.deleteFile(this.data.property.profileImage);
            this.data.property.profileImage = undefined;
        } else {
            this.profileImage = undefined;
        }

    }

    onChangeCategory(event) {
        this.propertyDevList = [];
        if (event.value == 3) {
            this.propertyService.listDevPropertiesForSelect()
                .subscribe(res => {
                    this.propertyDevList = res;
                });
        }
    }

    onSelectDevProperty(val) {
        if (this.propertyDevList && this.propertyDevList.length > 0) {
            const parent = _.find(this.propertyDevList, function (o) {
                return o.propertyId == val;
            });
            this.data.property.city = parent.city;
            this.latitude = parent.latitude;
            this.longitude = parent.longitude;
        }
    }

    compareFn(city1: City, city2: City) {
        return city1 && city2 ? city1.id === city2.id : city1 === city2;
    }

    comparePropertyType(type1: PropertyType, type2: PropertyType) {
        return type1 && type2 ? type1.id === type2.id : type1 === type2;
    }
}
