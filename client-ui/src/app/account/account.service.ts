import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, ReplaySubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  apiUrl = environment.apiUrl;
  // replay subject will cache one user at one time
  private currentUserSource = new ReplaySubject<IUser>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  getCurrentUser(token: string) {
    // if user is not login, set current user to null
    if (token === null) {
      this.currentUserSource.next(null);
      return of(null);
    }
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get(this.apiUrl + 'account', { headers }).pipe(
      map((user: IUser) => {
        localStorage.setItem('token', user.token);
        this.currentUserSource.next(user);
      })
    );
  }

  login(values: any) {
    return this.http.post(this.apiUrl + 'account/login', values).pipe(
      map((user: IUser) => {
        // if something in the user
        if (user) {
          // set token to local storage
          localStorage.setItem('token', user.token);
          // save the user into the current user source
          this.currentUserSource.next(user);
        }
      })
    );
  }

  register(values: any) {
    return this.http.post(this.apiUrl + 'account/register', values).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }

  logout() {
    // remove the token from local storage
    localStorage.removeItem('token');
    // set current user equals to null
    this.currentUserSource.next(null);
    // redirect user back to home page
    this.router.navigateByUrl('/');
  }

  checkEmailExists(email: string) {
    return this.http.get(this.apiUrl + 'account/emailexists?email=' + email);
  }

  getUserAddress() {
    return this.http.get<IAddress>(this.apiUrl + 'account/address');
  }

  updateUserAddress(address: IAddress) {
    return this.http.put<IAddress>(this.apiUrl + 'account/address', address);
  }
}
