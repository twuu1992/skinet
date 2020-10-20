import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IOrder } from '../shared/models/orders';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getOrders() {
    return this.http.get(this.baseUrl + 'orders');
  }

  getOrderById(id: number) {
    return this.http.get(this.baseUrl + 'orders/' + id);
  }
}
