import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  IBasket,
  IBasketItem,
  Basket,
  IBasketTotals,
} from '../shared/models/basket';
import { IProduct } from '../shared/models/product';
import { IDeliveryMethods } from '../shared/models/deliveryMethods';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  baseUrl = environment.apiUrl;
  // declare an observable behaviour subject of basket
  private basketSource = new BehaviorSubject<IBasket>(null);
  // observable basket
  basket$ = this.basketSource.asObservable();
  shipping = 0;

  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null);
  basketTotal$ = this.basketTotalSource.asObservable();

  constructor(private http: HttpClient) {}

  getBasket(id: string) {
    return this.http.get(this.baseUrl + 'basket?id=' + id).pipe(
      map((basket: IBasket) => {
        this.basketSource.next(basket);
        // after get the basket from api
        this.calculateTotals();
      })
    );
  }
  // consume the post method and get the responded basket to set the observable behaviour subject
  setBasket(basket: IBasket) {
    return this.http.post(this.baseUrl + 'basket', basket).subscribe(
      (response: IBasket) => {
        this.basketSource.next(response);
        // after set the basket
        this.calculateTotals();
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

  // add quantity of items
  incrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasket();
    const foundItemIndex = basket.items.findIndex((i) => i.id === item.id);
    basket.items[foundItemIndex].quantity++;
    this.setBasket(basket);
  }
  // decrease quantity of items
  decrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasket();
    const foundItemIndex = basket.items.findIndex((i) => i.id === item.id);
    // if quantity greater than 1, decrease; otherwise, remove item.
    if (basket.items[foundItemIndex].quantity > 1) {
      basket.items[foundItemIndex].quantity--;
      this.setBasket(basket);
    } else {
      this.removeItemFromBasket(item);
    }
  }

  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasket();
    // check if can find the value of item in the basket
    if (basket.items.some((i) => i.id === item.id)) {
      // delete
      basket.items = basket.items.filter((i) => i.id !== item.id);
      // check if the basket items more than 1, update basket
      // otherwise delete the basket
      if (basket.items.length > 0) {
        this.setBasket(basket);
      } else {
        this.deleteBasket(basket);
      }
    }
  }

  // delete local basket
  deleteLocalBasket(id: string) {
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket_id');
  }

  deleteBasket(basket: IBasket) {
    // delete basket from database first
    // then delete local basket
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe(
      () => {
        // remove the source
        this.basketSource.next(null);
        this.basketTotalSource.next(null);
        // remove the basket from local storage
        localStorage.removeItem('basket_id');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // calculate totals
  private calculateTotals() {
    const basket = this.getCurrentBasket();
    const shipping = this.shipping;
    // reduce each of the item and calculate price * quantity
    const subtotal = basket.items.reduce((a, b) => b.price * b.quantity + a, 0);
    const total = subtotal + shipping;
    // set the next value of observable
    this.basketTotalSource.next({ shipping, subtotal, total });
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

  setShippingPrice(deliveryMethod: IDeliveryMethods) {
    this.shipping = deliveryMethod.price;
    this.calculateTotals();
  }
}
