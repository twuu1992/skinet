import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { IOrder } from 'src/app/shared/models/orders';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {
  order: IOrder;
  constructor(
    private orderService: OrderService,
    private activedRoute: ActivatedRoute,
    private bcService: BreadcrumbService
  ) {
    this.bcService.set('@OrderDetail', '');
  }

  ngOnInit() {
    // console.log(this.activedRoute);
    this.orderService
      .getOrderById(+this.activedRoute.snapshot.paramMap.get('id'))
      .subscribe(
        (order: IOrder) => {
          this.order = order;
          this.bcService.set(
            '@OrderDetail',
            `Order# ${order.id} - ${order.status}`
          );
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
