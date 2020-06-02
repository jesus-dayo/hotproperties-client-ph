import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {PropertyService} from '.././property.service';
import {Property} from '.././property';
import {PropertyType} from '.././propertyType';
import {City} from '.././city';
import {PropertyImage} from '.././propertyImages';
import {FileHolder} from '.././fileHolder';
import {UploadFileService} from '../upload-file.service';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import * as propertytypes from '.././propertytypes';
import * as cityph from '.././cityph';
import * as _ from 'lodash';

@Component({
    selector: 'app-updateproperty',
    templateUrl: './updateproperty.component.html',
    styleUrls: ['./updateproperty.component.scss']
})
export class UpdatepropertyComponent implements OnInit {

  isLinear = false;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;
    fourthFormGroup: FormGroup;
    fifthFormGroup: FormGroup;
    profileImage: FileHolder;
    profileImageWidth: number;
    profileImageHeight: number;
    profileImageSize: number;
    additionalImages: FileHolder[] = [];
    addImage: PropertyImage = new PropertyImage();
    propImage: PropertyImage = new PropertyImage();
    latitude: number;
    longitude: number;
    propertyDevList: Property[];
    panelOpenState = false;
    imageChangedEvent: any = '';
    imageChangedEventAddImage: any = '';
    public property: Property;
    propertyTypes: PropertyType[];
    cities: City[];
    currentAdditionalImage: FileHolder;
    saving: boolean;
    uploadedImages: string[] = [];
    profileImages: string[] = [];
    loading: boolean;

    constructor(private route: ActivatedRoute,
                private _formBuilder: FormBuilder,
                private uploadService: UploadFileService,
                private router: Router,
                public propertyService: PropertyService,
                public toastr: ToastsManager,
                vcr: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vcr);
    }

  ngOnInit() {
    this.loading = true;
    this.cities = _.orderBy(cityph.CITY, ['citymunDesc'], ['asc']);
  this.propertyTypes = propertytypes.PROPERTYTYPE;
    this.getProperty();
  }

  getProperty(): void {
    const propertyId = this.route.snapshot.paramMap.get('propertyId');
    this.propertyService.getProperty(Number(propertyId))
        .subscribe(prop => {
          this.property = prop;
            if (prop.images) {
                for (let i = 0; i < prop.images.length; i++) {
                    this.uploadedImages.push(prop.images[i].image);
                }
                if (prop.profileImage) {
                    this.profileImages.push(prop.profileImage.image);
                }
                this.latitude = prop.latitude;
                this.longitude = prop.longitude;
                this.loading = false;
                if (prop.category == 3) {
                    this.propertyService.listDevPropertiesForSelect()
                        .subscribe(res => {
                            this.propertyDevList = res;
                        });
                }
        }
        });
    }

    fileChangeEvent(event: any): void {
      this.imageChangedEvent = event;
    }

    imageCropped(image: string) {
      this.profileImage.src = image;
    }

    fileChangeEventAdditional(event: any): void {
      this.imageChangedEventAddImage = event;
    }
    imageCroppedAdditional(image: string) {
      this.currentAdditionalImage.src = image;
    }
    imageLoaded() {
      // show cropper
    }
    loadImageFailed() {
      // show message
    }

      showSuccess() {
          alert('Save successful');
        }

        showError(message) {
          alert(message);
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

    validate(): boolean {
        if (!this.property.propertyName) {
            this.showError('Property Name is required.');
            return true;
        }
        if (!this.property.description) {
            this.showError('Property Description is required.');
            return true;
        }
        if (!this.property.propertyType) {
            this.showError('Property Type is required.');
            return true;
        }
        if (!this.property.city) {
            this.showError('City is required.');
            return true;
        }
        // new development
        if (this.property.category == 3) {
            if (!this.property.parentId) {
                this.showError('Select a parent property is required.');
                return true;
            }
        }
        if (this.property.category != 2) {
            if (!this.property.price) {
                this.property.price = '0';
            }
            if (!this.property.rooms) {
                this.property.rooms = 0;
            }
            if (!this.property.bath) {
                this.property.bath = 0;
            }
        }

    }

      onSave() {
          if (this.validate()) {
              return;
          }
          this.property.status = 1;
          this.property.latitude = this.latitude;
          this.property.longitude = this.longitude;
          this.saving = true;
          this.propertyService.update(this.property)
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
                 this.saving = false;
                this.backToAdmin();
              });
      }

    backToAdmin() {
        this.router.navigate(['admin']);
    }

      onUploadProfileFinished(file: FileHolder) {
          //        this.property.image = file.src;
          this.profileImage = file;
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
        //        this.property.additionalImage.push(file);
        //        this.uploadService.uploadfile(file.file);
        if (this.currentAdditionalImage) {
            this.additionalImages.push(this.currentAdditionalImage);
        }
        this.currentAdditionalImage = file;
    }

    nextAdditionalImage() {
        if (this.currentAdditionalImage) {
            this.additionalImages.push(this.currentAdditionalImage);
        }
    }

    onRemoved(file: FileHolder) {
        const imgToDelete = _.find(this.property.images, function (o) {
            return o.image == file.src;
        });
        if (imgToDelete) {
            this.uploadService.deleteFile(imgToDelete);
        } else {
            this.additionalImages.splice(this.additionalImages.indexOf(file), 1);
        }
      }

      onRemovedProfile(file: FileHolder) {
          if (this.property.profileImage) {
              this.uploadService.deleteFile(this.property.profileImage);
              this.property.profileImage = undefined;
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
            this.property.city = parent.city;
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

    compareParentProperty(parentId1: number, parentId2: number) {
        return parentId1 && parentId2 ? parentId1 === parentId2 : parentId1 === parentId2;
    }
}
