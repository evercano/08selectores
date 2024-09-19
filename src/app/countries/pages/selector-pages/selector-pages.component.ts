import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCuntry } from '../../interfaces/country.interface';
import { HttpClient } from '@angular/common/http';
import { filter, Observable, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'countries-selector-pages',
  templateUrl: './selector-pages.component.html',
  styles: ``
})
export class SelectorPagesComponent implements OnInit{

  public countriesByRegion: SmallCuntry[] = [];
  public borders : SmallCuntry[] = [];
  public myForm :  FormGroup = this.fb.group({
    region : ['', Validators.required],
    country : ['', Validators.required],
    border : ['', Validators.required],
  })

  
  constructor(
    private fb : FormBuilder,
    private countriesService : CountriesService,    
  ){}

  ngOnInit(): void {
    this.onRegionChange();
    this.onCountryChange();
  }

  get regions() : Region []  {
    return this.countriesService.regions;
  }

  onRegionChange(): void{
    this.myForm.get('region')?.valueChanges
    .pipe(
      tap(() => this.myForm.get('country')?.setValue('') ),
      tap(() => this.borders = []),
      switchMap(region => this.countriesService.getCountriesByRegion(region)),      
    )
    .subscribe(countries => 
      {
        this.countriesByRegion = countries;
      });
  }

  onCountryChange(): void{
    this.myForm.get('country')?.valueChanges
    .pipe(
      tap(() => this.myForm.get('border')?.setValue('') ),
      filter((value:string) => value.length>0),
      switchMap((alphaCode) => this.countriesService.getCountryByAlphaCode(alphaCode)),
      switchMap((country) => this.countriesService.getContryBordersByCodes(country.borders)),
    )
    .subscribe(countries => {        
        this.borders = countries;
    });
  }


  

}
