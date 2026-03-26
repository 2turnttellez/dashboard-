'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Phone,
  MapPin,
  Bike,
  Car,
  Store
} from 'lucide-react'
import type { Order, OrderStatus, OrderItem, OrderChannel, MenuItem } from '@/lib/types'
import { mockOrders, mockOrderItems, mockOrderChannels, mockMenuItems } from '@/lib/data'

const sourceConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  'ch_rappi': { label: 'Rappi', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: <Bike className="h-4 w-4" /> },
  'ch_ubereats': { label: 'Uber Eats', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: <Car className="h-4 w-4" /> },
  'ch_domicilio': { label: 'A Domicilio', color: 'bg-[#926c15]/20 text-[#926c15] border-[#926c15]/30', icon: <ShoppingBag className="h-4 w-4" /> },
  'ch_mostrador': { label: 'Mostrador', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: <Store className="h-4 w-4" /> },
  'ch_mesa': { label: 'Mesa', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: <Store className="h-4 w-4" /> },
}

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  'Pending': { label: 'Pendiente', color: 'bg-yellow-500/20 text-yellow-500', icon: <Clock className="h-4 w-4" /> },
  'Preparing': { label: 'Preparando', color: 'bg-blue-500/20 text-blue-400', icon: <Clock className="h-4 w-4" /> },
  'Out for Delivery': { label: 'En Camino / Listo', color: 'bg-purple-500/20 text-purple-400', icon: <Bike className="h-4 w-4" /> },
  'Completed': { label: 'Entregado', color: 'bg-green-500/20 text-green-400', icon: <CheckCircle className="h-4 w-4" /> },
  'Cancelled': { label: 'Cancelado', color: 'bg-red-500/20 text-red-500', icon: <XCircle className="h-4 w-4" /> },
}

export function OrdersDashboard() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [orderItemsState, setOrderItemsState] = useState<OrderItem[]>(mockOrderItems)
  const [activeTab, setActiveTab] = useState<'all' | string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newOrder, setNewOrder] = useState<Partial<Order>>({
    channel_id: 'ch_domicilio',
    order_status: 'Pending',
  })
  const [newItemsTemp, setNewItemsTemp] = useState<Partial<OrderItem>[]>([])
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(1)

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.channel_id === activeTab)

  const pendingCount = orders.filter(o => o.order_status === 'Pending').length
  const preparingCount = orders.filter(o => o.order_status === 'Preparing').length
  const readyCount = orders.filter(o => o.order_status === 'Completed').length // Actually Completed in new schema

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(order => 
      order.order_id === orderId ? { ...order, order_status: newStatus } : order
    ))
  }

  const addItemToOrder = () => {
    const menuItem = mockMenuItems.find(m => m.item_id === selectedMenuItem)
    if (menuItem && quantity > 0) {
      setNewItemsTemp([
        ...newItemsTemp,
        {
          order_item_id: Date.now().toString(),
          item_id: menuItem.item_id,
          quantity: quantity,
          unit_price: menuItem.price,
          subtotal: menuItem.price * quantity
        }
      ])
      setSelectedMenuItem('')
      setQuantity(1)
    }
  }

  const handleAddOrder = () => {
    if (newOrder.customer_name && newItemsTemp.length > 0) {
      const totalAmount = newItemsTemp.reduce((sum, item) => sum + (item.subtotal || 0), 0)
      const orderId = `ord_new_${Date.now()}`
      
      const order: Order = {
        order_id: orderId,
        channel_id: newOrder.channel_id || 'ch_domicilio',
        customer_name: newOrder.customer_name || 'Desconocido',
        customer_phone: newOrder.customer_phone,
        delivery_address: newOrder.delivery_address,
        total_amount: totalAmount,
        payment_method: 'Cash', // Default
        order_status: 'Pending',
        order_date: new Date(),
        notes: newOrder.notes,
        created_at: new Date(),
        updated_at: new Date()
      }

      const finalItems = newItemsTemp.map(i => ({ ...i, order_id: orderId } as OrderItem))
      
      setOrders([order, ...orders])
      setOrderItemsState([...orderItemsState, ...finalItems])
      
      setNewOrder({ channel_id: 'ch_domicilio', order_status: 'Pending' })
      setNewItemsTemp([])
      setIsAddDialogOpen(false)
    }
  }

  const getItemsForOrder = (orderId: string) => {
    return orderItemsState.filter(item => item.order_id === orderId)
  }

  const getMenuItemName = (itemId: string) => {
    return mockMenuItems.find(m => m.item_id === itemId)?.item_name || 'Item Desconocido'
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pedidos</h1>
          <p className="text-muted-foreground">Gestiona los pedidos de todas las plataformas</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#926c15] hover:bg-[#926c15]/80 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Pedido
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">Agregar Nuevo Pedido</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-foreground">Plataforma</Label>
                <Select
                  value={newOrder.channel_id}
                  onValueChange={(value) => setNewOrder({ ...newOrder, channel_id: value })}
                >
                  <SelectTrigger className="bg-secondary border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {mockOrderChannels.map(ch => (
                      <SelectItem key={ch.channel_id} value={ch.channel_id}>{ch.channel_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Nombre del Cliente</Label>
                <Input
                  value={newOrder.customer_name || ''}
                  onChange={(e) => setNewOrder({ ...newOrder, customer_name: e.target.value })}
                  className="bg-secondary border-border text-foreground"
                  placeholder="Nombre completo"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Teléfono</Label>
                <Input
                  value={newOrder.customer_phone || ''}
                  onChange={(e) => setNewOrder({ ...newOrder, customer_phone: e.target.value })}
                  className="bg-secondary border-border text-foreground"
                  placeholder="555-1234"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Dirección</Label>
                <Input
                  value={newOrder.delivery_address || ''}
                  onChange={(e) => setNewOrder({ ...newOrder, delivery_address: e.target.value })}
                  className="bg-secondary border-border text-foreground"
                  placeholder="Dirección de entrega"
                />
              </div>

              {/* Items */}
              <div className="space-y-2">
                <Label className="text-foreground">Productos del Menú</Label>
                <div className="grid grid-cols-4 gap-2">
                  <Select value={selectedMenuItem} onValueChange={setSelectedMenuItem}>
                    <SelectTrigger className="bg-secondary border-border text-foreground col-span-2">
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border h-60">
                      {mockMenuItems.filter(m => m.is_available).map(m => (
                        <SelectItem key={m.item_id} value={m.item_id}>{m.item_name} (${m.price})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={quantity || 1}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="bg-secondary border-border text-foreground col-span-1"
                    placeholder="Cant."
                    min={1}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addItemToOrder}
                    className="col-span-1 border-border text-foreground px-0"
                  >
                    Agregar
                  </Button>
                </div>
                {newItemsTemp.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {newItemsTemp.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm text-muted-foreground bg-secondary/50 p-2 rounded">
                        <span>{item.quantity}x {getMenuItemName(item.item_id!)}</span>
                        <span>${item.subtotal}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-medium text-foreground pt-2 border-t border-border">
                      <span>Total:</span>
                      <span>${newItemsTemp.reduce((sum, item) => sum + (item.subtotal || 0), 0)}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Notas</Label>
                <Textarea
                  value={newOrder.notes || ''}
                  onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                  className="bg-secondary border-border text-foreground"
                  placeholder="Instrucciones especiales..."
                />
              </div>

              <Button 
                onClick={handleAddOrder}
                className="w-full bg-[#926c15] hover:bg-[#926c15]/80 text-white"
                disabled={!newOrder.customer_name || newItemsTemp.length === 0}
              >
                Crear Pedido
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pedidos</p>
                <p className="text-2xl font-bold text-foreground">{orders.length}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-[#926c15]" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-500">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Preparando</p>
                <p className="text-2xl font-bold text-blue-400">{preparingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completados</p>
                <p className="text-2xl font-bold text-green-400">{readyCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs by platform */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)}>
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="all" className="data-[state=active]:bg-[#926c15] data-[state=active]:text-white">
            Todos
          </TabsTrigger>
          {mockOrderChannels.map(ch => (
            <TabsTrigger 
              key={ch.channel_id} 
              value={ch.channel_id} 
              className="data-[state=active]:bg-[#926c15] data-[state=active]:text-white"
            >
              {ch.channel_name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredOrders.map((order) => {
              const items = getItemsForOrder(order.order_id)
              const cfg = sourceConfig[order.channel_id] || sourceConfig['ch_domicilio']
              return (
                <Card key={order.order_id} className="bg-card border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={`${cfg.color}`}>
                          {cfg.icon}
                          <span className="ml-1">{cfg.label}</span>
                        </Badge>
                        <span className="text-sm font-mono text-muted-foreground">
                          {order.order_id.slice(-5).toUpperCase()}
                        </span>
                      </div>
                      <Badge className={statusConfig[order.order_status].color}>
                        {statusConfig[order.order_status].icon}
                        <span className="ml-1">{statusConfig[order.order_status].label}</span>
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-foreground">{order.customer_name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {order.customer_phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {order.customer_phone}
                      </div>
                    )}
                    {order.delivery_address && (
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{order.delivery_address}</span>
                      </div>
                    )}

                    <div className="border-t border-border pt-3 space-y-1">
                      {items.map((item) => (
                        <div key={item.order_item_id} className="flex justify-between text-sm">
                          <span className="text-foreground">{item.quantity}x {getMenuItemName(item.item_id)}</span>
                          <span className="text-muted-foreground">${item.subtotal}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-semibold text-foreground pt-2 border-t border-border">
                        <span>Total:</span>
                        <span className="text-[#926c15]">${order.total_amount}</span>
                      </div>
                    </div>

                    {order.order_status !== 'Completed' && order.order_status !== 'Cancelled' && (
                      <div className="flex gap-2 pt-2">
                        {order.order_status === 'Pending' && (
                          <Button 
                            size="sm" 
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                            onClick={() => updateOrderStatus(order.order_id, 'Preparing')}
                          >
                            Preparar
                          </Button>
                        )}
                        {order.order_status === 'Preparing' && (
                          <Button 
                            size="sm" 
                            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
                            onClick={() => updateOrderStatus(order.order_id, 'Out for Delivery')}
                          >
                            En Camino
                          </Button>
                        )}
                        {order.order_status === 'Out for Delivery' && (
                          <Button 
                            size="sm" 
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                            onClick={() => updateOrderStatus(order.order_id, 'Completed')}
                          >
                            Entregado
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                          onClick={() => updateOrderStatus(order.order_id, 'Cancelled')}
                        >
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No hay pedidos en esta categoria</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
