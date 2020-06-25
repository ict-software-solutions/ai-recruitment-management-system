import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Product } from 'app/main/apps/usermanagement/product/product.model';
import { EcommerceProductService } from 'app/main/apps/usermanagement/product/product.service';
interface usertype {
    value: string;
    viewValue: string;
  }
  interface userrole {
    value: string;
    viewValue: string;
  }
@Component({
    selector     : 'e-commerce-product',
    templateUrl  : './product.component.html',
    styleUrls    : ['./product.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
    
})
export class EcommerceProductComponent implements OnInit, OnDestroy
{
    product: Product;
    pageType: string;
    productForm: FormGroup;

    usertype: usertype [] = [
        {value: 'employee-0', viewValue: 'Employee'},
        {value: 'client-1', viewValue: 'Client'},
        {value: 'candidate-2', viewValue: 'Candidate'}
      ];
      userrole: userrole [] = [
        {value: 'Admin', viewValue: 'Admin'},
        {value: 'Manager', viewValue: 'Manager'},
        {value: 'CandidateConsultant', viewValue: 'Candidate Consultant'},
        {value: 'ClientConsultant', viewValue: 'Client Consultant'},
        {value: 'CandidateView', viewValue: 'Candidate View'},
        {value: 'client', viewValue: 'Client'},
        {value: 'customer', viewValue: 'Customer'}
      ];
      show = false;
      hide = true;
      form: FormGroup;
      checked = false;
      indeterminate = false;
      labelPosition: 'before' | 'after' = 'after';
      disabled = false;
    // Private
    private _unsubscribeAll: Subject<any>;
    shown: boolean;

    /**
     * Constructor
     *
     * @param {EcommerceProductService} _ecommerceProductService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     */
    constructor(
        private _ecommerceProductService: EcommerceProductService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar
    )
    {
        // Set the default
        this.product = new Product();

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    changePassword(checked) {
        // alert(this.show1);
        console.log(this.show);
        this.show = !this.show;
        // alert(this.show1);
        console.log(this.show);
  }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {     this.form = this._formBuilder.group({
        firstName: ['', Validators.required],
        secondName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', Validators.required],
        mobile: ['', Validators.required],
        companyname: ['', Validators.required],
        position: ['', Validators.required],
        address: ['', Validators.required],
        postalcode: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        country: ['', Validators.required],
        password: ['', Validators.required],
        passwordNew: ['', [Validators.minLength(8), Validators.maxLength(15)]],
        check: [''],

    });
        // Subscribe to update product on changes
        this._ecommerceProductService.onProductChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(product => {

                if ( product )
                {
                    this.product = new Product(product);
                    this.pageType = 'edit';
                }
                else
                {
                    this.pageType = 'new';
                    this.product = new Product();
                }

                this.productForm = this.createProductForm();
            });
    }
    // checked(value){
    //     if(document.getElementById('abc').checked==true){
    //       this.shown= true
    //     }
    //     else if(document.getElementById('abc').checked==false)
    //       this.shown= false;
    //   }
    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create product form
     *
     * @returns {FormGroup}
     */
    createProductForm(): FormGroup
    {
        return this._formBuilder.group({
            id              : [this.product.id],
            fname           : [this.product.fname],
            sname              : [this.product.sname],
            lname             : [this.product.lname],
            email             : [this.product.email],
            name            : [this.product.username],
            handle          : [this.product.handle],
            description     : [this.product.description],
            categories      : [this.product.categories],
            tags            : [this.product.tags],
            images          : [this.product.images],
            priceTaxExcl    : [this.product.priceTaxExcl],
            priceTaxIncl    : [this.product.priceTaxIncl],
            taxRate         : [this.product.taxRate],
            comparedPrice   : [this.product.comparedPrice],
            quantity        : [this.product.quantity],
            sku             : [this.product.sku],
            width           : [this.product.width],
            height          : [this.product.height],
            depth           : [this.product.depth],
            weight          : [this.product.weight],
            extraShippingFee: [this.product.extraShippingFee],
            active          : [this.product.active],
            // validfrom         : [this.product.active]
            // active          : [this.product.active]
        });
    }

    /**
     * Save product
     */
    saveProduct(): void
    {
        const data = this.productForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);

        this._ecommerceProductService.saveProduct(data)
            .then(() => {

                // Trigger the subscription with new data
                this._ecommerceProductService.onProductChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Product saved', 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });
            });
    }

    /**
     * Add product
     */
    addProduct(): void
    {
        const data = this.productForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);

        this._ecommerceProductService.addProduct(data)
            .then(() => {

                // Trigger the subscription with new data
                this._ecommerceProductService.onProductChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Product added', 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });

                // Change the location with new one
                this._location.go('apps/e-commerce/products/' + this.product.id + '/' + this.product.handle);
            });
    }
 
}
