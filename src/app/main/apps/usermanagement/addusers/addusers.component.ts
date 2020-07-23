import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { Product } from 'app/main/apps/usermanagement/addusers/addusers.model';
import { EcommerceProductService } from 'app/main/apps/usermanagement/addusers/addusers.service';
import { usertype } from 'app/models/user-type';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'usermanagement-adduser',
    templateUrl: './addusers.component.html',
    styleUrls: ['./addusers.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class EcommerceProductComponent implements OnInit, OnDestroy {
    product: Product;
    pageType: string;
    productForm: FormGroup;
    show = false;
    hide = true;
    form: FormGroup;
    checked = false;
    indeterminate = false;
    labelPosition: 'before' | 'after' = 'after';
    disabled = false;
    shown: boolean;

    usertype: usertype[] = [
        { value: 'Employee'},
        { value: 'Client'},
        { value: 'Candidate'}
    ];
   roleName = ['Admin', 'Manager', 'Candidate Consultant', 'Client Consultant', 'Candidate View', 'client', 'customer'];

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private ecommerceProductService: EcommerceProductService,
        private formBuilder: FormBuilder,
        private location: Location,
        private matSnackBar: MatSnackBar) {
        this.product = new Product();
        this._unsubscribeAll = new Subject();
    }

    changePassword() {
        this.show = !this.show;
    }

    ngOnInit(): void {
        this.form = this.buildForm();
        this.ecommerceProductService.onProductChanged.pipe(takeUntil(this._unsubscribeAll))
            .subscribe(product => {
                if (product) {
                    this.product = new Product(product);
                    this.pageType = 'edit';
                } else {
                    this.pageType = 'new';
                    this.product = new Product();
                }
                this.productForm = this.createProductForm();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
        this.product = null;
        this.pageType = null;
        this.productForm = null;
        this.show = null;
        this.hide = null;
        this.form = null;
        this.checked = null;
        this.indeterminate = null;
        this.labelPosition = null;
        this.disabled = null;
        this.shown = null;
        this.usertype = null;
        this.roleName = null;
        this.ecommerceProductService = null;
        this.formBuilder = null;
        this.location = null;
        this.matSnackBar = null
    }

    buildForm() {
        return this.formBuilder.group({
            firstName: ['', Validators.required],
            secondName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', Validators.required],
            mobile: ['', Validators.required],
            dob: ['', Validators.required],
            validFrom:['',Validators.required],
            validTo:['',Validators.required],
            passwordSince:['',Validators.required],
            passwordExpiryDate:['',Validators.required],
            password: ['', Validators.required],
            passwordNew: ['', [Validators.minLength(8), Validators.maxLength(15)]],
            check1: [''],
        });
    }

    createProductForm(): FormGroup {
        return this.formBuilder.group({
            id: [this.product.id],
            fname: [this.product.fname],
            sname: [this.product.sname],
            lname: [this.product.lname],
            email: [this.product.email],
            name: [this.product.username],
            handle: [this.product.handle],
            description: [this.product.description],
            categories: [this.product.categories],
            tags: [this.product.tags],
            images: [this.product.images],
            priceTaxExcl: [this.product.priceTaxExcl],
            priceTaxIncl: [this.product.priceTaxIncl],
            taxRate: [this.product.taxRate],
            comparedPrice: [this.product.comparedPrice],
            quantity: [this.product.quantity],
            sku: [this.product.sku],
            width: [this.product.width],
            height: [this.product.height],
            depth: [this.product.depth],
            weight: [this.product.weight],
            extraShippingFee: [this.product.extraShippingFee],
            active: [this.product.active]
        });
    }

    saveProduct(): void {
        const data = this.productForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);
        this.ecommerceProductService.saveProduct(data).then(() => {
            this.ecommerceProductService.onProductChanged.next(data);
            this.matSnackBar.open('Product saved', 'OK', {
                verticalPosition: 'top',
                duration: 2000
            });
        });
    }

    addProduct(): void {
        const data = this.productForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);
        this.ecommerceProductService.addProduct(data).then(() => {
            this.ecommerceProductService.onProductChanged.next(data);
            this.matSnackBar.open('Product added', 'OK', {
                verticalPosition: 'top',
                duration: 2000
            });
            this.location.go('apps/e-commerce/products/' + this.product.id + '/' + this.product.handle);
        });
    }

}
