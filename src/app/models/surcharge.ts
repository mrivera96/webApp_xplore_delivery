import { Category } from './category';
import { Customer } from './customer';
import { RateType } from './rate-type';

export interface Surcharge {
    idRecargo?: number
    descRecargo?: string
    kilomMinimo?: number
    kilomMaximo?: number
    monto?: number
    idCliente?: number
    idCategoria?: number
    customer?: Customer
    category?: Category
    delivery_type?: RateType
    idTipoEnvio?: number
}
