import {Component, Inject, OnInit, ViewContainerRef} from '@angular/core';
import {LoginService} from '.././login.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Credentials} from '.././credentials';
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  credentials: Credentials;

  constructor(private loginService: LoginService, private http: HttpClient, private router: Router
      , @Inject(LOCAL_STORAGE) private localStorage: WebStorageService,
              @Inject(ToastsManager) public toastr: ToastsManager,
              @Inject(ViewContainerRef) vcr: ViewContainerRef) {
      	this.toastr.setRootViewContainerRef(vcr);
  }

  login() {
    if (this.credentials && this.credentials.username && this.credentials.password) {
      this.loginService.authenticate(this.credentials).subscribe(resp => {
            if (resp.headers.get('Authorization')) {
              this.setSession(resp.headers.get('Authorization'));
              this.router.navigateByUrl('admin');
            } else {
              this.showError();
            }
          },
          error => {
            this.showError();
      });
    }
    return false;
  }

  private setSession(authResult) {
        //const expiresAt = moment().add(authResult.expiresIn,'second');

        this.localStorage.set('id_token', authResult);
        //this.localStorage.set("expires_at", JSON.stringify(expiresAt.valueOf()) );
    }

    showSuccess() {
      this.toastr.success('Success', 'Login Successful');
      }

      showError() {
        this.toastr.error('ERROR', 'Login Failed');
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

  ngOnInit() {
    this.credentials = new Credentials();
  }

}
