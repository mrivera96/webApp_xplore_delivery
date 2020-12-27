export interface Customer {
    idCliente?: number
    nomEmpresa?: string
    nomRepresentante?: string
    numIdentificacion?: string
    numTelefono?: string
    email?: string
    isActivo?: boolean
    subtotal?: number
    paid?: number
    montoGracia?: number
    balance?: number
    /* payments?: Payment[]
    deliveries?: Delivery[] */
    subtotalShow?: string
    paidShow?: string
    balanceShow?: string
    enviarNotificaciones?: boolean
}
