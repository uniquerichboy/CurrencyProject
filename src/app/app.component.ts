import { Injectable, NgModule, Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
@Injectable()
export class AppComponent {

  constructor(private socket: Socket) {
    this.socket.on('allPrice', (response: any) => {

      this.wallets = [];
      response.forEach((data: any) => {
        this.wallets.push(data);
      });
      
      // Обнуляем цвет
      setTimeout(() => {
        response.forEach((data: any) => {
          data.status = 0;
        });
      }, 700);
      this.loading = true;
    });
  }

  wallets: any = [];
  loading: boolean = false;
  status: number = 0;
  
  ngOnInit(){
   
  }

  git(){
    location.href="https://github.com/frozenwork";
  }
}
 