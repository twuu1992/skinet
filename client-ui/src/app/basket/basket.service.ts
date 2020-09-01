import { Injectable } from '@angular/core';
import { env } from 'process';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { IBasket, IBasketItem, Basket } from '../shared/models/basket';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  baseUrl = environment.apiUrl;
  // declare an observable behaviour subject of basket
  private basketSource = new BehaviorSubject<IBasket>(null);
  // observable basket
  basket$ = this.basketSource.asObservable();

  constructor(private http: HttpClient) {}

  getBasket(id: string) {
    return this.http.get(this.baseUrl + 'basket?id=' + id).pipe(
      map((basket: IBasket) => {
        this.basketSource.next(basket);
        console.log(this.getCurrentBasket());
      })
    );
  }
  // consume the post method and get the responded basket to set the observable behaviour subject
  setBasket(basket: IBasket) {
    return this.http.post(this.baseUrl + 'basket', basket).subscribe(
      (response: IBasket) => {
        this.basketSource.next(response);
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getCurrentBasket() {
    return this.basketSource.value;
  }

  addItemToBasket(item: IProduct, quantity = 1) {
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(
      item,
      quantity
    );
    // check the current basket is null
    let basket = this.getCurrentBasket();
    if (basket === null) {
      basket = this.createBasket();
    }

    basket.items = this.addOrUpdateBasketItem(
      basket.items,
      itemToAdd,
      quantity
    );
    // persist the basket into redis
    this.setBasket(basket);
  }

  private addOrUpdateBasketItem(
    items: IBasketItem[],
    itemToAdd: IBasketItem,
    quantity: number
  ): IBasketItem[] {
    // find the index of the itemToAdd
    const index = items.findIndex((i) => i.id === itemToAdd.id);
    // if not found, add to basket items
    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      // otherwise, add the quantity of that basket item
      items[index].quantity += quantity;
    }
    return items;
  }

  private createBasket(): IBasket {
    const basket = new Basket();
    // create a new basket on the browser's local storage if they don't have a basket
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

  private mapProductItemToBasketItem(
    item: IProduct,
    quantity: number
  ): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      quantity,
      pictureUrl: item.pictureUrl,
      brand: item.productBrand,
      type: item.productType,
    };
  }
}
