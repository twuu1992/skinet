import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IProduct } from '../shared/models/product';
import { ShopService } from './shop.service';
import { IType } from '../shared/models/productType';
import { IBrand } from '../shared/models/brand';
import { ShopParams } from '../shared/models/shopParams';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  // get the element (child) of this view
  // static is true means the search bar is always available
  @ViewChild('search', { static: false }) searchTerm: ElementRef;
  products: IProduct[];
  types: IType[];
  brands: IBrand[];
  shopParams: ShopParams;
  totalCount: number;
  sortOptions = [
    { name: 'Alphabetic', value: 'name' },
    { name: 'Price: Low to High', value: 'priceAsc' },
    { name: 'Price: High to Low', value: 'priceDesc' },
  ];

  constructor(private shopService: ShopService) {
    this.shopParams = this.shopService.getShopParams();
  }

  ngOnInit() {
    this.getProducts(true);
    this.getTypes();
    this.getBrands();
  }

  getProducts(useCache = false) {
    this.shopService.getProducts(useCache).subscribe(
      (response) => {
        // console.log(response);
        this.products = response.data;
        this.totalCount = response.count;
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
    const param = this.shopService.getShopParams();
    param.brandId = brandId;
    param.pageIndex = 1;
    this.shopService.setShopParams(param);
    this.getProducts();
  }

  onTypeSelected(typeId: number) {
    const param = this.shopService.getShopParams();
    param.typeId = typeId;
    param.pageIndex = 1;
    this.shopService.setShopParams(param);
    this.getProducts();
  }

  // sort
  onSortSelected(sort: string) {
    const param = this.shopService.getShopParams();
    param.sort = sort;
    this.shopService.setShopParams(param);
    this.getProducts();
  }

  // pagination
  onPageChanged(event: any) {
    // console.log(event);
    // only triggered by the actual page number is changed (click the pager button)
    const param = this.shopService.getShopParams();
    if (param.pageIndex !== event.page) {
      param.pageIndex = event.page;
      this.shopService.setShopParams(param);
      this.getProducts(true);
    }
  }

  onSearch() {
    const param = this.shopService.getShopParams();
    param.search = this.searchTerm.nativeElement.value;
    param.pageIndex = 1;
    this.shopService.setShopParams(param);
    this.getProducts();
  }

  onReset() {
    this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.shopService.setShopParams(this.shopParams);
    this.getProducts();
  }
}
