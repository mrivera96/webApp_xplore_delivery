import { FormGroup } from "@angular/forms";

export function BlankSpacesValidator(controlName: string) {

  return (formGroup: FormGroup)=> {
    const control = formGroup.controls[controlName]
    let value = control?.value
    if(typeof(value) == "number" ){

    }else{
      if (control.errors && !control.errors.required) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      if(value != null && value?.trim() === ''){
        control.setErrors({ required: true })
      }
    }
  }

}
