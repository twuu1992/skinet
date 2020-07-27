import { Component, OnInit } from '@angular/core';
import { IProduct } from '../shared/models/product';
import { ShopService } from './shop.service';
import { IType } from '../shared/models/productType';
import { IBrand } from '../shared/models/brand';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  products: IProduct[];
  types: IType[];
  brands: IBrand[];
  brandSelectedId = 0;
  typeSelectedId = 0;
  sortSelected = 'name';
  sortOptions = [
    { name: 'Alphabetic', value: 'name' },
    { name: 'Price: Low to High', value: 'priceAsc' },
    { name: 'Price: High to Low', value: 'priceDesc' },
  ];

  constructor(private shopService: ShopService) {}

  ngOnInit() {
    this.getProducts();
    this.getTypes();
    this.getBrands();
  }

  getProducts() {
    this.shopService
      .getProduct(this.brandSelectedId, this.typeSelectedId, this.sortSelected)
      .subscribe(
        (response) => {
          this.products = response.data;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getBrands() {
    this.shopService.getBrands().subscribe(
      (response) => {
        this.brands = [{ id: 0, name: 'All' }, ...response];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getTypes() {
    this.shopService.getTypes().subscribe(
      (response) => {
        this.types = [{ id: 0, name: 'All' }, ...response];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onBrandSelected(brandId: number) {
    this.brandSelectedId = brandId;
    this.getProducts();
  }

  onTypeSelected(typeId: number) {
    this.typeSelectedId = typeId;
    this.getProducts();
  }

  // sort
  onSortSelected(sort: string) {
    this.sortSelected = sort;
    this.getProducts();
  }
}
