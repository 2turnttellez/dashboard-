'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Plus,
  Pencil,
  UtensilsCrossed,
  Beef,
  Coffee,
  Cookie,
  Sparkles,
  Flame,
  Wine,
  PartyPopper
} from 'lucide-react'
import type { MenuItem, MenuCategory, MenuItemType } from '@/lib/types'
import { mockMenuItems, mockMenuCategories } from '@/lib/data'

export function MenuDashboard() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems)
  const [activeCategoryId, setActiveCategoryId] = useState<'all' | string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  
  // Create a default formdata payload based on the new schema
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    category_id: mockMenuCategories[0]?.category_id || '',
    is_available: true,
    item_type: 'Food'
  })

  // Help mapping category IDs to their objects
  const categoryMap = new Map(mockMenuCategories.map((c) => [c.category_id, c]))

  const filteredItems = activeCategoryId === 'all'
    ? menuItems
    : menuItems.filter(item => item.category_id === activeCategoryId)

  const toggleAvailability = (itemId: string) => {
    setMenuItems(menuItems.map(item =>
      item.item_id === itemId ? { ...item, is_available: !item.is_available } : item
    ))
  }

  const handleSaveItem = () => {
    if (formData.item_name && formData.price && formData.category_id) {
      if (editingItem) {
        setMenuItems(menuItems.map(item =>
          item.item_id === editingItem.item_id
            ? { ...item, ...formData, updated_at: new Date() } as MenuItem
            : item
        ))
      } else {
        const newItem: MenuItem = {
          item_id: `mi_new_${Date.now()}`,
          item_name: formData.item_name,
          description: formData.description || '',
          price: formData.price,
          category_id: formData.category_id,
          item_type: formData.item_type as MenuItemType || 'Food',
          is_available: formData.is_available ?? true,
          created_at: new Date(),
          updated_at: new Date()
        }
        setMenuItems([...menuItems, newItem])
      }
      setFormData({ category_id: mockMenuCategories[0]?.category_id || '', is_available: true, item_type: 'Food' })
      setEditingItem(null)
      setIsAddDialogOpen(false)
    }
  }

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item)
    setFormData(item)
    setIsAddDialogOpen(true)
  }

  const availableCount = menuItems.filter(i => i.is_available).length

  // Dynamically assign icons based on category group/name
  const getCategoryIcon = (category: MenuCategory) => {
    const name = category.category_name.toLowerCase()
    if (name.includes('carne') || name.includes('burrito') || name.includes('taco')) return <Beef className="h-4 w-4" />
    if (name.includes('postre')) return <Cookie className="h-4 w-4" />
    if (name.includes('cerveza') || name.includes('coctel') || name.includes('coctelería') || name.includes('destilados') || name.includes('favoritos')) return <Wine className="h-4 w-4" />
    if (category.category_group === 'Drinks') return <Coffee className="h-4 w-4" />
    if (name.includes('caldo') || name.includes('sopa')) return <Flame className="h-4 w-4" />
    if (name.includes('grupo') || name.includes('snack')) return <PartyPopper className="h-4 w-4" />
    return <UtensilsCrossed className="h-4 w-4" />
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Menú Digital</h1>
          <p className="text-muted-foreground">Administra los productos de tu menú</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open)
          if (!open) {
            setEditingItem(null)
            setFormData({ category_id: mockMenuCategories[0]?.category_id || '', is_available: true, item_type: 'Food' })
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-[#926c15] hover:bg-[#926c15]/80 text-white shadow-lg transition-transform hover:scale-[1.02]">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-h-[90vh] overflow-y-auto w-full max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-foreground text-xl">
                {editingItem ? 'Editar Producto' : 'Agregar Producto'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-5 mt-4">
              <div className="space-y-2">
                <Label className="text-foreground font-medium">Nombre del platillo/bebida</Label>
                <Input
                  value={formData.item_name || ''}
                  onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                  className="bg-secondary/50 border-input text-foreground focus-visible:ring-[#926c15]"
                  placeholder="Ej. Burrito Especial"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-medium">Descripción</Label>
                <Textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-secondary/50 border-input text-foreground focus-visible:ring-[#926c15]"
                  placeholder="Descripción de los ingredientes..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Precio ($)</Label>
                  <Input
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="bg-secondary/50 border-input text-foreground focus-visible:ring-[#926c15]"
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Categoría</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  >
                    <SelectTrigger className="bg-secondary/50 border-input text-foreground focus-visible:ring-[#926c15]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border max-h-[250px]">
                      {mockMenuCategories.map((cat) => (
                        <SelectItem key={cat.category_id} value={cat.category_id} className="cursor-pointer">
                          <span className="flex items-center gap-2">
                            <span className="text-muted-foreground">{getCategoryIcon(cat)}</span>
                            {cat.category_name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                 <Label className="text-foreground font-medium">Clasificación Interna</Label>
                 <Select
                   value={formData.item_type || 'Food'}
                   onValueChange={(value) => setFormData({ ...formData, item_type: value as MenuItemType })}
                 >
                   <SelectTrigger className="bg-secondary/50 border-input text-foreground focus-visible:ring-[#926c15]">
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent className="bg-popover border-border">
                     <SelectItem value="Food">Comida</SelectItem>
                     <SelectItem value="Drink">Bebida</SelectItem>
                     <SelectItem value="Dessert">Postre</SelectItem>
                     <SelectItem value="Extra">Extra</SelectItem>
                   </SelectContent>
                 </Select>
              </div>

              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border mt-2">
                <div className="space-y-0.5">
                  <Label className="text-foreground font-medium">Disponibilidad</Label>
                  <p className="text-xs text-muted-foreground">Mostrar este ítem en el menú público</p>
                </div>
                <Switch
                  checked={formData.is_available}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
                  className="data-[state=checked]:bg-[#926c15]"
                />
              </div>

              <Button
                onClick={handleSaveItem}
                className="w-full bg-[#926c15] hover:bg-[#926c15]/90 text-white font-semibold h-11"
              >
                {editingItem ? 'Guardar Cambios' : 'Agregar Producto'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Productos</p>
                <p className="text-3xl font-bold text-foreground mt-1">{menuItems.length}</p>
              </div>
              <div className="p-3 bg-[#926c15]/10 rounded-full">
                <UtensilsCrossed className="h-6 w-6 text-[#926c15]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Disponibles</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-3xl font-bold text-foreground">{availableCount}</p>
                  <p className="text-sm text-green-500 font-medium">{Math.round((availableCount/menuItems.length)*100)}% online</p>
                </div>
              </div>
              <div className="p-3 bg-green-500/10 rounded-full">
                <Sparkles className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Tabs */}
      <Tabs value={activeCategoryId} onValueChange={(v) => setActiveCategoryId(v)} className="w-full">
        <TabsList className="bg-transparent border-b border-border w-full flex-wrap h-auto gap-2 p-0 justify-start rounded-none">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-[#926c15]/10 data-[state=active]:text-[#926c15] data-[state=active]:border-b-2 data-[state=active]:border-[#926c15] rounded-none px-4 py-2 text-muted-foreground transition-all"
          >
            Todos
          </TabsTrigger>
          {mockMenuCategories.map((cat) => (
            <TabsTrigger
              key={cat.category_id}
              value={cat.category_id}
              className="data-[state=active]:bg-[#926c15]/10 data-[state=active]:text-[#926c15] data-[state=active]:border-b-2 data-[state=active]:border-[#926c15] rounded-none px-4 py-2 text-muted-foreground transition-all"
            >
              <span className="flex items-center gap-2">
                {getCategoryIcon(cat)}
                {cat.category_name}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategoryId} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => {
              const category = categoryMap.get(item.category_id)
              return (
                <Card
                  key={item.item_id}
                  className={`bg-card border-border hover:border-[#926c15]/30 transition-all duration-200 shadow-sm hover:shadow-md ${!item.is_available ? 'opacity-50 grayscale-[0.3]' : ''}`}
                >
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-foreground leading-tight text-lg line-clamp-2">{item.item_name}</h3>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="shrink-0 text-muted-foreground hover:text-foreground h-8 w-8 -mt-1 -mr-2 hover:bg-secondary/80"
                        onClick={() => openEditDialog(item)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-grow">
                      {item.description || <span className="italic opacity-50">Sin descripción</span>}
                    </p>

                    <div className="mt-4 pt-4 border-t border-border/50">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline" className="bg-secondary/30 text-xs font-normal border-border/60 flex items-center gap-1.5 py-0.5">
                          <span className="opacity-70">{category ? getCategoryIcon(category) : <UtensilsCrossed className="h-3 w-3" />}</span>
                          {category ? category.category_name : 'Misc'}
                        </Badge>
                        <span className="text-xl font-bold tracking-tight text-[#926c15]">${item.price}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={item.is_available}
                            onCheckedChange={() => toggleAvailability(item.item_id)}
                            className="scale-75 origin-left data-[state=checked]:bg-green-500"
                          />
                          <span className={`text-xs uppercase font-bold tracking-widest ${item.is_available ? 'text-green-500' : 'text-muted-foreground'}`}>
                            {item.is_available ? 'Disponible' : 'Agotado'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          {filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-border rounded-xl mt-4 bg-secondary/10">
              <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                <UtensilsCrossed className="h-8 w-8 text-muted-foreground/60" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">No hay productos</h3>
              <p className="text-muted-foreground text-center max-w-sm">No se encontraron productos para esta categoría. Intenta agregar uno nuevo.</p>
              <Button 
                variant="outline" 
                className="mt-6 border-[#926c15]/20 text-[#926c15] hover:bg-[#926c15]/10"
                onClick={() => {
                  setFormData({ category_id: activeCategoryId !== 'all' ? activeCategoryId : (mockMenuCategories[0]?.category_id || ''), is_available: true, item_type: 'Food' })
                  setEditingItem(null)
                  setIsAddDialogOpen(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" /> Agregar a esta categoría
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
