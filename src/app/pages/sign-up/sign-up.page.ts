import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlankSpacesValidator } from 'src/app/helpers/blank-spaces.validator';
import { MustMatch } from 'src/app/helpers/must-match.validator';
import { PasswordValidate } from 'src/app/helpers/password.validator';
import { Customer } from 'src/app/models/customer';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  newCustomer: Customer = {}
  phoneMask: any
  nCustomerForm: FormGroup
  constructor(
    private formBuilder: FormBuilder
  ) {

  }

  ngOnInit() {
    this.initialize()
  }

  get controls() {
    return this.nCustomerForm.controls
  }

  initialize() {
    this.nCustomerForm = this.formBuilder.group({
      nomRepresentante: ['', [
        Validators.required,
        Validators.maxLength(80)]],
      numTelefono: ['', [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9)]],
      email: ['', [
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"),
        Validators.maxLength(50)]],
      newPass: ['', [Validators.required, Validators.minLength(8)]],
      confirmNewPass: ['', [Validators.required]]
    }, {
      validator:
        [
          MustMatch('newPass', 'confirmNewPass'),
          PasswordValidate('newPass'),
          BlankSpacesValidator('newPass'),
        ]
    })
  }

  formSubmit(form) {
    console.log(form)

  }

  phoneMasking(_event) {
    let event = _event?.target?.value

    let newVal = event?.replace(/\D/g, '');
    /*if (backspace && newVal.length <= 6) {
      newVal = newVal.substring(0, newVal.length - 1);
    }*/
    if (newVal?.length === 0) {
      newVal = '';
    } else if (newVal?.length > 4) {
      newVal = newVal.replace(/^(\d{0,4})(\d{0,4})/, '$1-$2');
    }

    this.controls.numTelefono.setValue(newVal)
  }

}
