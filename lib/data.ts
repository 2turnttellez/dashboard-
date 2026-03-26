import {
  BrandSettings,
  SocialAccount,
  Content,
  ContentAnalytics,
  AccountAnalyticsSnapshot,
  ContentCalendarEvent,
  MenuCategory,
  MenuItem,
  OrderChannel,
  Order,
  OrderItem,
  ActivityLog
} from './types'

// Helper function to create dates easily
const daysAgo = (days: number) => {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d
}

// 1. Brand Settings
export const mockBrandSettings: BrandSettings = {
  brand_id: 'brand_1',
  brand_name: 'Mr. Burro',
  logo_url: '/logo.png', // Or use a placeholder
  primary_color: '#926c15',
  secondary_color: '#000000',
  created_at: daysAgo(365),
  updated_at: daysAgo(10)
}

// 2. Social Accounts
export const mockSocialAccounts: SocialAccount[] = [
  {
    account_id: 'acc_ig',
    platform: 'Instagram',
    account_name: 'Mr. Burro Oficial',
    handle: '@mrburro.oficial',
    profile_url: 'https://instagram.com/mrburro.oficial',
    is_active: true,
    data_source: 'Metricool',
    created_at: daysAgo(365),
    updated_at: daysAgo(1)
  },
  {
    account_id: 'acc_fb',
    platform: 'Facebook',
    account_name: 'Mr. Burro MX',
    handle: '@mrburromx',
    profile_url: 'https://facebook.com/mrburromx',
    is_active: true,
    data_source: 'Metricool',
    created_at: daysAgo(365),
    updated_at: daysAgo(1)
  }
]

// 3. Content
export const mockContent: Content[] = [
  {
    content_id: 'post_1',
    account_id: 'acc_ig',
    title: 'Promoción Burritos 2x1',
    caption: '¡Disfruta del auténtico sabor en Mr. Burro!',
    platform: 'Instagram',
    post_type: 'Carousel',
    status: 'Scheduled',
    scheduled_date: daysAgo(-2),
    media_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=500&auto=format&fit=crop',
    thumbnail_url: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=500&auto=format&fit=crop',
    campaign: 'Spring Promo',
    objective: 'Conversion',
    tags: ['#burritos', '#mrburro'],
    created_at: daysAgo(5),
    updated_at: daysAgo(1)
  },
  {
    content_id: 'post_2',
    account_id: 'acc_ig',
    title: 'Conoce al equipo',
    caption: 'Nuestro parrillero estrella en acción 🔥',
    platform: 'Instagram',
    post_type: 'Reel',
    status: 'Published',
    published_date: daysAgo(3),
    media_type: 'video',
    media_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop',
    tags: ['#behindthescenes', '#mrburro'],
    created_at: daysAgo(10),
    updated_at: daysAgo(3)
  }
]

// 4. Content Analytics
export const mockContentAnalytics: ContentAnalytics[] = [
  {
    analytics_id: 'an_post_2',
    content_id: 'post_2',
    impressions: 4500,
    reach: 3200,
    views: 4000,
    likes: 540,
    comments: 32,
    shares: 120,
    saves: 85,
    engagement_rate: 6.5,
    follower_gain: 12,
    collected_at: new Date()
  }
]

// 5. Account Analytics Snapshots (Generated for the last 30 days)
export const generateAnalyticsData = (days: number): AccountAnalyticsSnapshot[] => {
  const data: AccountAnalyticsSnapshot[] = []
  for (let i = days - 1; i >= 0; i--) {
    const date = daysAgo(i)
    const baseImpressions = 15000 + Math.random() * 10000
    const baseReach = baseImpressions * 0.7
    const baseEngagements = baseReach * 0.05
    data.push({
      snapshot_id: `snap_${i}`,
      account_id: 'acc_ig',
      period_start: date,
      period_end: date,
      total_impressions: Math.round(baseImpressions),
      total_reach: Math.round(baseReach),
      total_engagements: Math.round(baseEngagements),
      engagement_rate: 5.0 + Math.random() * 2,
      total_followers: 45000 + (days - i) * 15,
      follower_growth: 15,
      source: 'Metricool',
      created_at: new Date()
    })
  }
  return data
}
export const mockAccountAnalytics = generateAnalyticsData(30)

// 6. Content Calendar Events
export const mockCalendarEvents: ContentCalendarEvent[] = mockContent.map(c => ({
  calendar_event_id: `evt_${c.content_id}`,
  content_id: c.content_id,
  platform: c.platform,
  event_date: c.scheduled_date || c.published_date || new Date(),
  display_color: c.platform === 'Instagram' ? '#E1306C' : '#1877F2',
  created_at: c.created_at
}))

// 7. Menu Categories
export const mockMenuCategories: MenuCategory[] = [
  { category_id: 'cat_entradas', category_name: 'Entradas', category_group: 'Food', display_order: 1, created_at: daysAgo(30), updated_at: daysAgo(30) },
  { category_id: 'cat_caldoso', category_name: 'Lo Caldoso', category_group: 'Food', display_order: 2, created_at: daysAgo(30), updated_at: daysAgo(30) },
  { category_id: 'cat_grupo', category_name: 'En Grupo', category_group: 'Food', display_order: 3, created_at: daysAgo(30), updated_at: daysAgo(30) },
  { category_id: 'cat_burritos', category_name: 'Burritos', category_group: 'Food', display_order: 4, created_at: daysAgo(30), updated_at: daysAgo(30) },
  { category_id: 'cat_tacos', category_name: 'Tacos', category_group: 'Food', display_order: 5, created_at: daysAgo(30), updated_at: daysAgo(30) },
  { category_id: 'cat_postres', category_name: 'Postres', category_group: 'Food', display_order: 6, created_at: daysAgo(30), updated_at: daysAgo(30) },
  { category_id: 'cat_cocteleria', category_name: 'Coctelería', category_group: 'Drinks', display_order: 7, created_at: daysAgo(30), updated_at: daysAgo(30) },
  { category_id: 'cat_cerveza', category_name: 'Cerveza', category_group: 'Drinks', display_order: 8, created_at: daysAgo(30), updated_at: daysAgo(30) },
  { category_id: 'cat_destilados', category_name: 'Destilados', category_group: 'Drinks', display_order: 9, created_at: daysAgo(30), updated_at: daysAgo(30) },
  { category_id: 'cat_favoritos', category_name: 'Los Favoritos', category_group: 'Drinks', display_order: 10, created_at: daysAgo(30), updated_at: daysAgo(30) },
  { category_id: 'cat_extras', category_name: 'Extras', category_group: 'Drinks', display_order: 11, created_at: daysAgo(30), updated_at: daysAgo(30) }
]

// Helper to instantiate item
const createItem = (id: string, cat: string, name: string, desc: string, price: number, type: 'Food' | 'Drink' | 'Dessert' | 'Extra'): MenuItem => ({
  item_id: id,
  category_id: cat,
  item_name: name,
  description: desc,
  price,
  item_type: type,
  is_available: true,
  created_at: daysAgo(30),
  updated_at: daysAgo(30)
})

// 8. Menu Items
export const mockMenuItems: MenuItem[] = [
  // Entradas
  createItem('mi_1', 'cat_entradas', 'Guacamole', 'Con limón y pico de gallo.', 105, 'Food'),
  createItem('mi_2', 'cat_entradas', 'Papas', 'Crujientes y doradas.', 99, 'Food'),
  createItem('mi_3', 'cat_entradas', 'Dedos de queso', 'Con centro fundido.', 149, 'Food'),
  createItem('mi_4', 'cat_entradas', 'Alitas', 'Jugosas con salsa a elegir.', 152, 'Food'),
  createItem('mi_5', 'cat_entradas', 'Boneless', 'Crujiente con salsa a elegir.', 152, 'Food'),
  createItem('mi_6', 'cat_entradas', 'Nachos con queso', 'Totopo con cheddar, salsa y jalapeños.', 152, 'Food'),
  createItem('mi_7', 'cat_entradas', 'Tostada de Camarón', 'Salteado con aguacate.', 63, 'Food'),

  // Lo Caldoso
  createItem('mi_8', 'cat_caldoso', 'Sopa de Tortilla', 'Caldo rojo con tortilla crujiente, queso y aguacate.', 85, 'Food'),
  createItem('mi_9', 'cat_caldoso', 'Frijoles de la Abuela', 'Receta casera.', 59, 'Food'),

  // En Grupo
  createItem('mi_10', 'cat_grupo', 'Snack Burros', '3 burritos mixtos con papas.', 450, 'Food'),
  createItem('mi_11', 'cat_grupo', 'Snack Mixto', 'Alitas, boneless y dedos de queso.', 345, 'Food'),
  createItem('mi_12', 'cat_grupo', 'Alitas o Boneless x kilo', 'Salsa a elegir.', 389, 'Food'),
  createItem('mi_13', 'cat_grupo', 'Snack Papas', 'Francesa, gajo, reja y curly.', 195, 'Food'),

  // Burritos
  createItem('mi_14', 'cat_burritos', 'Bistec', 'Suave, a la plancha, jugosa y bien sellada. 20 cm con papas.', 165, 'Food'),
  createItem('mi_15', 'cat_burritos', 'Campechano', 'Res y longaniza. 20 cm con papas.', 160, 'Food'),
  createItem('mi_16', 'cat_burritos', 'Pastor', 'Con piña y sazón tradicional. 20 cm con papas.', 160, 'Food'),
  createItem('mi_17', 'cat_burritos', 'Pollo BBQ', 'Pechuga bañada y ahumada. 20 cm con papas.', 160, 'Food'),
  createItem('mi_18', 'cat_burritos', 'Milanesa de Res', 'Crujiente por fuera, tierna por dentro. 20 cm con papas.', 160, 'Food'),
  createItem('mi_19', 'cat_burritos', 'Vegetariano', 'Champiñón, lechuga, mexicana y queso. 20 cm con papas.', 140, 'Food'),
  createItem('mi_20', 'cat_burritos', 'Arrachera', 'Corte marinado e intenso. 20 cm con papas.', 175, 'Food'),
  createItem('mi_21', 'cat_burritos', 'Sirloin', 'Firme y jugoso, toque de parrilla. 20 cm con papas.', 175, 'Food'),
  createItem('mi_22', 'cat_burritos', 'Mar y Tierra', 'Arrachera y camarón salteado. 20 cm con papas.', 180, 'Food'),

  // Tacos
  createItem('mi_23', 'cat_tacos', 'Pastor', 'Clásicos al momento.', 44, 'Food'),
  createItem('mi_24', 'cat_tacos', 'Bistec', 'Clásicos al momento.', 44, 'Food'),
  createItem('mi_25', 'cat_tacos', 'Campechano', 'Clásicos al momento.', 44, 'Food'),
  createItem('mi_26', 'cat_tacos', 'Costilla', 'Clásicos al momento.', 44, 'Food'),
  createItem('mi_27', 'cat_tacos', 'Pechuga', 'Clásicos al momento.', 44, 'Food'),
  createItem('mi_28', 'cat_tacos', 'Chuleta', 'Clásicos al momento.', 44, 'Food'),
  createItem('mi_29', 'cat_tacos', 'Milanesa', 'Clásicos al momento.', 44, 'Food'),
  createItem('mi_30', 'cat_tacos', 'Arrachera', 'Cortes premium.', 64, 'Food'),
  createItem('mi_31', 'cat_tacos', 'Sirloin', 'Cortes premium.', 64, 'Food'),
  createItem('mi_32', 'cat_tacos', 'Ribeye', 'Cortes premium.', 64, 'Food'),
  createItem('mi_33', 'cat_tacos', 'Costilla / Longaniza toreados', 'Con chiles toreados.', 49, 'Food'),
  createItem('mi_34', 'cat_tacos', 'Taco tona', 'Con camarón y longaniza.', 79, 'Food'),

  // Postres
  createItem('mi_35', 'cat_postres', 'Brownie con Helado', '', 99, 'Dessert'),
  createItem('mi_36', 'cat_postres', 'Fresas con Crema', '', 85, 'Dessert'),

  // Coctelería
  createItem('mi_37', 'cat_cocteleria', 'Pepi Gin / Pepi Ron', '', 135, 'Drink'),
  createItem('mi_38', 'cat_cocteleria', 'Mojito', '', 135, 'Drink'),
  createItem('mi_39', 'cat_cocteleria', 'Mezcalita de tamarindo', '', 135, 'Drink'),
  createItem('mi_40', 'cat_cocteleria', 'Mango Manguito', '', 135, 'Drink'),
  createItem('mi_41', 'cat_cocteleria', 'Red Gin', '', 135, 'Drink'),
  createItem('mi_42', 'cat_cocteleria', 'Charly Blue', '', 135, 'Drink'),
  createItem('mi_43', 'cat_cocteleria', 'Cantarito Jalisciense', '', 135, 'Drink'),
  createItem('mi_44', 'cat_cocteleria', 'Sangría tradicional', '', 99, 'Drink'),

  // Cerveza
  createItem('mi_45', 'cat_cerveza', 'Bola (500 ml)', '', 80, 'Drink'),
  createItem('mi_46', 'cat_cerveza', 'Bola con Clamato', '', 100, 'Drink'),
  createItem('mi_47', 'cat_cerveza', 'Michelitro (1 L)', '', 125, 'Drink'),
  createItem('mi_48', 'cat_cerveza', 'Michelitro con Clamato', '', 155, 'Drink'),
  createItem('mi_49', 'cat_cerveza', 'Miche Burra', '', 179, 'Drink'),
  createItem('mi_50', 'cat_cerveza', 'Corona / Victoria (355 ml)', '', 66, 'Drink'),
  createItem('mi_51', 'cat_cerveza', 'Negra Modelo (355 ml)', '', 79, 'Drink'),
  createItem('mi_52', 'cat_cerveza', 'Modelo Especial (355 ml)', '', 79, 'Drink'),

  // Destilados
  createItem('mi_53', 'cat_destilados', 'Bacardi Blanco', '', 180, 'Drink'),
  createItem('mi_54', 'cat_destilados', 'Don Julio 70', '', 299, 'Drink'),
  createItem('mi_55', 'cat_destilados', 'Cuervo Tradicional Plata', '', 180, 'Drink'),
  createItem('mi_56', 'cat_destilados', '400 Conejos', '', 240, 'Drink'),
  createItem('mi_57', 'cat_destilados', 'Tanqueray', '', 215, 'Drink'),
  createItem('mi_58', 'cat_destilados', 'Torres 10', '', 240, 'Drink'),
  createItem('mi_59', 'cat_destilados', 'Absolut', '', 190, 'Drink'),
  createItem('mi_60', 'cat_destilados', 'JW Black Label', '', 299, 'Drink'),

  // Los Favoritos
  createItem('mi_61', 'cat_favoritos', 'Perla Negra', '', 149, 'Drink'),
  createItem('mi_62', 'cat_favoritos', 'Carajillo Licor 43', '', 170, 'Drink'),
  createItem('mi_63', 'cat_favoritos', 'Carajillo Baileys', '', 170, 'Drink'),
  createItem('mi_64', 'cat_favoritos', 'Vino de la casa', '', 89, 'Drink'),
  createItem('mi_65', 'cat_favoritos', 'Tinto de verano', '', 105, 'Drink'),
  createItem('mi_66', 'cat_favoritos', 'Clamato preparado', '', 79, 'Drink'),
  createItem('mi_67', 'cat_favoritos', 'Limonada con fresa', '', 69, 'Drink'),
  createItem('mi_68', 'cat_favoritos', 'Naranjada con maracuyá', '', 69, 'Drink'),

  // Extras
  createItem('mi_69', 'cat_extras', 'Café Americano', '', 49, 'Extra'),
  createItem('mi_70', 'cat_extras', 'Capuchino', '', 69, 'Extra'),
  createItem('mi_71', 'cat_extras', 'Té', '', 49, 'Extra'),
  createItem('mi_72', 'cat_extras', 'Tisanas', '', 59, 'Extra')
]

// 9. Order Channels
export const mockOrderChannels: OrderChannel[] = [
  { channel_id: 'ch_rappi', channel_name: 'Rappi', is_active: true, created_at: daysAgo(365) },
  { channel_id: 'ch_ubereats', channel_name: 'UberEats', is_active: true, created_at: daysAgo(365) },
  { channel_id: 'ch_domicilio', channel_name: 'A domicilio', is_active: true, created_at: daysAgo(365) }
]

// 10 & 11. Orders and Order Items
export const mockOrders: Order[] = [
  {
    order_id: 'ord_1',
    channel_id: 'ch_rappi',
    customer_name: 'Juan Pérez',
    customer_phone: '555-0192',
    delivery_address: 'Av. Insurgentes Sur 123',
    total_amount: 325,
    payment_method: 'App',
    order_status: 'Preparing',
    order_date: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  }
]

export const mockOrderItems: OrderItem[] = [
  {
    order_item_id: 'oi_1',
    order_id: 'ord_1',
    item_id: 'mi_14', // Burrito Bistec (165)
    quantity: 1,
    unit_price: 165,
    subtotal: 165
  },
  {
    order_item_id: 'oi_2',
    order_id: 'ord_1',
    item_id: 'mi_16', // Burrito Pastor (160)
    quantity: 1,
    unit_price: 160,
    subtotal: 160
  }
]

// 12. Activity Logs
export const mockActivityLogs: ActivityLog[] = [
  {
    log_id: 'log_1',
    entity_type: 'order',
    entity_id: 'ord_1',
    action_type: 'Created',
    user_id: 'system',
    created_at: new Date()
  }
]
