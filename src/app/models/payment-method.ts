import { Customer } from './customer';

export interface PaymentMethod {
    idFormaPago?: number
    token_card?: string
    mes?: number
    anio?: number
    cvv?: string
    idCliente?: number
    cliente?: Customer
}
