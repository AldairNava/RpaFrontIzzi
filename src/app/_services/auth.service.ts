import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Route, Router } from '@angular/router';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }
  currentUser: BehaviorSubject<any> = new BehaviorSubject(null);

  //https://localhost/AD/Identity
  //BaseServerUrl = "http://localhost:8080/api/AD/"
  BaseServerUrl = "https://localhost:7079/AD/"

  JwtHelperService = new JwtHelperService();

  registerUser(user: Array<String>) {
    return this.http.post(
      this.BaseServerUrl + "CreateUser",
      {
        FirstName: user[0],
        LastName: user[1],
        Email: user[2],
        Mobile: user[3],
        Gender: user[4],
        Role: user[5],
        PWd: user[6]
      },
      {
        responseType: 'text',
      }
    );
  }

  getuser(id: String) {
    var tk = localStorage.getItem("token");
    var t = tk;

    const header = new HttpHeaders().set('Authorization', "Bearer ");
    const headers = { headers: header };
    return this.http.get(
      this.BaseServerUrl + id, headers);
  }

  loginuser(user: Array<String>) {
    return this.http.post(
      this.BaseServerUrl + "Identity",
      {
        Email: user[0],
        PWd: user[1]
      },
      {
        responseType: 'text',
      }
    );
  }

  loginusery(user: any) {
    return this.http.post<any>(
      this.BaseServerUrl + "Identity", {
        Email: user[0],
        PWd: user[1]
    })
      .pipe(map(user => {
        localStorage.setItem("TokenInfo", JSON.stringify(user));
        console.log(JSON.stringify(user));
        return user;
      }));
  }


  setToken() {
    var tk = localStorage.getItem("TokenInfo");
    const userInfo = JSON.parse(tk || "null");
    const data = userInfo ? {
      id: userInfo.id,
      email: userInfo.email,
      usrtoken: userInfo.token
    } : null;
    var xx = this.JwtHelperService.decodeToken(data?.usrtoken);
    localStorage.setItem("token", data?.usrtoken)
    console.log(xx);
    console.log(userInfo);
    this.router.navigateByUrl('home')
  }






  isLoggedin(): boolean {
    return localStorage.getItem("TokenInfo") ? true : false;
  }

  removeToken() {
    localStorage.removeItem("access_token");
    localStorage.removeItem('TokenInfo');
  }
}
