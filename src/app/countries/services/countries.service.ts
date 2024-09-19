import { Injectable } from '@angular/core';
import { Country, Region, SmallCuntry } from '../interfaces/country.interface';
import { combineLatest, map, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class CountriesService {
    private _regions : Region[] = [Region.Africa,Region.Americas,Region.Asia,Region.Europe,Region.Oceania,];
    private baseURL : string = 'https://restcountries.com/v3.1';
    // private baseURL : string = 'https://restcountries.com/v3.1/region/europe?fields=name,cca3,borders';

    constructor(
        private http:HttpClient
    ) { }   
    
    get regions () : Region[] {
        return [...this._regions];
    }

    getCountriesByRegion(region : Region) : Observable<SmallCuntry[]>{
        if(!region) return of([]);
        const url = `${this.baseURL}/region/${region}??fields=name,cca3,borders`;
        return this.http.get<Country[]>(url).
        pipe(
          map(countries => countries.map(country => ({
            name : country.name.common,
            cca3 : country.cca3,
            borders: country.borders ?? []
          }))),          
        );    
    }

    getCountryByAlphaCode(alphaCode :  string): Observable<SmallCuntry>{
        const url = `${this.baseURL}/alpha/${alphaCode}?fields=name,cca3,borders`;
        return this.http.get<Country>(url)
        .pipe(
           map(country => ({
            name : country.name.common,
            cca3 : country.cca3,
            borders: country.borders ?? []
          }))
        );
    }

    getContryBordersByCodes (borders : string []) : Observable<SmallCuntry[]>{
      if(!borders || borders.length==0) return of([]);
      const countryRequests : Observable<SmallCuntry>[] = [];
      borders.forEach (code=>{
        const request = this.getCountryByAlphaCode(code);
        countryRequests.push(request);
      }) 

      return combineLatest(countryRequests);

    }
    
}