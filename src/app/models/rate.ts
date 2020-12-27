import { Category } from './category';
import { Customer } from './customer';
import { RateType } from './rate-type';

export interface Rate {
    idTarifaDelivery?: number
    descTarifa?: string
    idCategoria?: number
    entregasMinimas?: number
    entregasMaximas?: number
    precio?: number
    idCliente?: number
    category?: Category
    cliente?: Customer
    rate_type?: RateType
    idTipoTarifa?: number
    rate_detail?: any[]
    datesToShow?: any[]
}
