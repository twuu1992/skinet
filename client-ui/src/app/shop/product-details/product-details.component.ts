import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/shared/models/product';
import { ShopService } from '../shop.service';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  product: IProduct;

  constructor(
    private shopService: ShopService,
    private activateRoute: ActivatedRoute,
    private breadcrumbService: BreadcrumbService
  ) {
    this.breadcrumbService.set('@productDetails', '');
  }

  ngOnInit() {
    this.loadProduct();
  }

  loadProduct() {
    // get product id from route
    this.shopService
      .getProduct(+this.activateRoute.snapshot.paramMap.get('id'))
      .subscribe(
        (response) => {
          this.product = response;
          this.breadcrumbService.set('@productDetails', this.product.name);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
