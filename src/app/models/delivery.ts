import { Category } from './category';
import { Order } from './order';
import { State } from './state';

export interface Delivery {
    idDelivery?: number
  nomCliente?: string
  numIdentificacion?: string
  numCelular?: string
  fechaReserva?: string
  dirRecogida?: string
  email?: string
  idCategoria?: string
  idEstado?: number
  estado?: State
  detalle?: Order[]
  category?: Category
  tarifaBase?: number
  recargos?: number
  cargosExtra?: number
  total?: number
  isPagada?: boolean
  idCliente?: number
  entregas?: number
  instrucciones?: string
  cantidad?: string
  descCategoria?: string
  fechaNoFormatted?: string
  coordsOrigen?: string
  isConsolidada?: boolean
  isRuteo?: boolean
  distTotal?: number
}
