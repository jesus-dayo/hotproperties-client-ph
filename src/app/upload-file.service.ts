import {Injectable} from '@angular/core';
import {PropertyService} from './property.service';
import {Images} from './images';
import * as S3 from 'aws-sdk/clients/s3';

@Injectable()
export class UploadFileService {

  FOLDER = 'static/';
  imageData: any = {};

  constructor(public propertyService: PropertyService) {
  }

  uploadfile(file, image) {
    const propertyService = this.propertyService;
    const imageToUpload = image;
    const fileDetails = file.file;
    const filename = fileDetails.name.replace(/\s/g, '');
    const base64 = file.src;

    const buf = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64');

    const bucket = new S3(
        {
          accessKeyId: '',
          secretAccessKey: '',
          region: 'ap-southeast-1'
        }
    );

    const params = {
      Bucket: 'hotprop-bucket',
      Key: this.FOLDER + fileDetails.name,
      Body: buf,
      ContentEncoding: 'base64',
      ContentType: file.type
    };

    bucket.upload(params, function (err, data) {
      if (err) {
        return false;
      }
      imageToUpload.image = data.Location;
      imageToUpload.description = filename;
      propertyService.uploadImage(imageToUpload).subscribe(res => {

            });
      return true;
    });
  }

  deleteFile(image: Images) {
    const propertyService = this.propertyService;
    const bucket = new S3(
        {
          accessKeyId: '',
          secretAccessKey: '',
          region: 'ap-southeast-1'
        }
    );

    const params = {
      Bucket: 'hotprop-bucket',
      Key: this.FOLDER + image.description
    };

    bucket.deleteObject(params, function (err, data) {
      if (err) {
        return;
      }
      propertyService.deleteImage(image).subscribe(res => {
      });
    });
  }

}
