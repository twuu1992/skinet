import { Component, OnInit } from '@angular/core';
import { IOrder } from '../shared/models/orders';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  orders: IOrder[];
  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.getOrdersForUser();
  }

  getOrdersForUser() {
    this.orderService.getOrders().subscribe(
      (orders: IOrder[]) => {
        this.orders = orders.sort((a, b) => b.id - a.id);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
