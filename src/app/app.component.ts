import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  from: string = 'EUR';
  to: string = 'USD';
  amount: number = 0;
  exchange: { [key: string]: number } = {};
  result: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.api();
  }

  api() {
    const api = 'https://api.nbp.pl/api/exchangerates/tables/A?format=json';

    interface Rate {
      code: string;
      mid: number;
    }

    this.http.get<any[]>(api).subscribe((data: any[]) => {
      if (data.length > 0 && data[0].rates) {
        const euro = data[0].rates.find((rate: Rate) => rate.code === 'EUR')?.mid;
        const dolar = data[0].rates.find((rate: Rate) => rate.code === 'USD')?.mid;
        const chf = data[0].rates.find((rate: Rate) => rate.code === 'CHF')?.mid;
        const nok = data[0].rates.find((rate: Rate) => rate.code === 'NOK')?.mid;

      if (euro && dolar) {
        this.exchange['EUR-USD'] = euro / dolar;
        this.exchange['USD-EUR'] = dolar / euro;
      } if (euro && chf) {
        this.exchange['EUR-CHF'] = euro / chf;
        this.exchange['CHF-EUR'] = chf / euro;
      } if (dolar && chf) {
        this.exchange['CHF-USD'] = chf / dolar;
        this.exchange['USD-CHF'] = dolar / chf;
      } if (nok && chf) {
        this.exchange['CHF-NOK'] = chf / nok;
        this.exchange['NOK-CHF'] = nok / chf;
      } if(nok && dolar) {
        this.exchange['NOK-USD'] = nok / dolar;
        this.exchange['USD-NOK'] = dolar / nok;
      } if(nok && euro) {
        this.exchange['EUR-NOK'] = euro / nok;
        this.exchange['NOK-EUR'] = nok / euro;
      }
    }});
  }

  convert() {
    const calculate = `${this.from}-${this.to}`;

    if (calculate in this.exchange) {
      this.result = this.amount * this.exchange[calculate];
    } else {
      this.result = null;
    }
  }
}
