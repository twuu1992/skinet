import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { ShopComponent } from './shop.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

const routes: Routes = [
  { path: '', component: ShopComponent },
  {
    path: ':id',
    component: ProductDetailsComponent,
    // use alias to match the actual value of Breadcrumb service in product detail component
    data: { breadcrumb: { alias: 'productDetails' } },
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopRoutingModule {}
