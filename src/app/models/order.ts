import { Delivery } from './delivery';
import { State } from './state';
import { User } from './user';

export interface Order {
    idDetalle?: number
  idDelivery?: number
  nFactura?: string
  nomDestinatario?: string
  numCel?: string
  direccion?: string
  distancia?: string
  tiempo?: string
  estado?: State
  conductor?: User
  auxiliar?: User
  tarifaBase?: number
  recargo?: number
  cTotal?: number
  instrucciones?: string
  fechaEntrega?: Date
  delivery?: Delivery
  idEstado?: number
  idConductor?: number
  idAuxiliar?: number
  observaciones?: string
  coordsDestino?: string
  cargosExtra?: number
  tomarFoto?: boolean
  photography?: any[]
  extra_charges?: any[]
  time?: any
  efectivoRecibido?: number
}
