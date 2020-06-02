import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder,  Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup,FormControl } from '@angular/forms';
@Component({
    selector     : 'login',
    templateUrl  : './login.component.html',
    styleUrls    : ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class LoginComponent implements OnInit
{
   
    loginForm = new FormGroup({
        email: new FormControl(''),
        password: new FormControl(''),
      });  
      
    // loginForm: FormGroup;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder

    )
   
    {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    // ngOnInit(): void
    // {
    //     this.loginForm = this._formBuilder.group(
        // {
    //         email   : ['', [Validators.required, Validators.email]],
    //         password: ['', Validators.required]
    //     }
    // );
    // }
ngOnInit():void
{
    this.loginForm=this._formBuilder.group(
        {
            email:['',[Validators.required,Validators.email]],
            password:['',Validators.minLength(6),Validators.maxLength(15)]
        }
    );
}
login()
{
    console.log(this.loginForm)
   
}

}
