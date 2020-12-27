import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-card',
  templateUrl: './create-card.page.html',
  styleUrls: ['./create-card.page.scss'],
})
export class CreateCardPage implements OnInit {
  months = [
    { l: 'Enero', v: 1 },
    { l: 'Febrero', v: 2 },
    { l: 'Marzo', v: 3 },
    { l: 'Abril', v: 4 },
    { l: 'Mayo', v: 5 },
    { l: 'Junio', v: 6 },
    { l: 'Julio', v: 7 },
    { l: 'Agosto', v: 8 },
    { l: 'Septiembre', v: 9 },
    { l: 'Octubre', v: 10 },
    { l: 'Noviembre', v: 11 },
    { l: 'Diciembre', v: 12 },
  ]

  years = [2021]

  nCardForm: FormGroup

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.initialize()
    this.incrementYears()
  }

  initialize(){
    this.nCardForm = this.formBuilder.group({
      cardNumber:[],
      expDate:[],
      cvv:[]
    })
  }

  incrementYears(){
    for(let i = 0; i < 35; i++){
      let nYear = this.years[i] + 1
      this.years.push(nYear)
    }
  }

}
