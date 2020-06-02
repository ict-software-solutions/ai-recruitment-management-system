import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';
import { LAYOUT_STRUCTURE } from 'app/util/constants';

@Component({
    selector     : 'coming-soon',
    templateUrl  : './coming-soon.component.html',
    styleUrls    : ['./coming-soon.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ComingSoonComponent implements OnInit
{
    comingSoonForm: FormGroup;

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
        this._fuseConfigService.config = LAYOUT_STRUCTURE;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.comingSoonForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }
}
