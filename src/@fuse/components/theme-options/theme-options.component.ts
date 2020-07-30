import { DOCUMENT } from '@angular/common';
import { Component, HostBinding, Inject, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'fuse-theme-options',
    templateUrl: './theme-options.component.html',
    styleUrls: ['./theme-options.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class FuseThemeOptionsComponent implements OnInit, OnDestroy {
    fuseConfig: any;
    form: FormGroup;
    @HostBinding('class.bar-closed')
    barClosed: boolean;
    private _unsubscribeAll: Subject<any>;

    constructor(
        @Inject(DOCUMENT) private document: any,
        private _formBuilder: FormBuilder,
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _renderer: Renderer2
    ) {
        this.barClosed = true;
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.form = this._formBuilder.group({
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this._fuseNavigationService.removeNavigationItem('custom-function');
    }

    private _resetFormValues(value): void {
        switch (value) {
        }
    }

    toggleSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }
}
