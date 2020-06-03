import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { TROY_LOGO, LAYOUT_STRUCTURE } from 'app/util/constants';
import { AuthService } from '../../../../service/auth.service';
@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})

export class LoginComponent implements OnInit, OnDestroy {

    /* loginForm = new FormGroup({
        email: new FormControl(''),
        password: new FormControl(''),
    }); */

    loginForm: FormGroup;
    logoPath = TROY_LOGO;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private authservice:AuthService
    ) {
        // Configure the layout
        this._fuseConfigService.config = LAYOUT_STRUCTURE;
    }

    ngOnInit(): void {
        this.loginForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]]
        });
    }

    login(value) { this.authservice.login(value).subscribe(Response => {
        console.log(Response);
        

        });
        console.log(value);
    }

    ngOnDestroy() {
        this.loginForm = null;
        this._fuseConfigService = null;
        this._formBuilder = null;
        this.logoPath = null;
    }

}
