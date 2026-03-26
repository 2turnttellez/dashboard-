export interface BrandSettings {
  brand_id: string
  brand_name: string
  logo_url: string
  primary_color: string // #926c15
  secondary_color: string
  created_at: Date
  updated_at: Date
}

export interface SocialAccount {
  account_id: string
  platform: 'Instagram' | 'Facebook' | 'TikTok' | 'YouTube'
  account_name: string
  handle: string
  profile_url: string
  is_active: boolean
  data_source: 'Metricool' | 'Manual' | 'API'
  created_at: Date
  updated_at: Date
}

export type PostStatus = 'Backlog' | 'Draft' | 'Scheduled' | 'Published'
export type PostType = 'Post' | 'Reel' | 'Story' | 'Carousel'

export interface Content {
  content_id: string
  account_id: string
  title: string
  caption: string
  platform: 'Instagram' | 'Facebook' | 'TikTok' | 'YouTube'
  post_type: PostType
  status: PostStatus
  scheduled_date?: Date
  published_date?: Date
  media_type?: 'image' | 'video'
  media_url?: string
  thumbnail_url?: string
  campaign?: string
  objective?: 'Awareness' | 'Engagement' | 'Conversion'
  tags: string[]
  notes?: string
  created_at: Date
  updated_at: Date
}

export interface ContentAnalytics {
  analytics_id: string
  content_id: string
  impressions: number
  reach: number
  views: number
  likes: number
  comments: number
  shares: number
  saves: number
  engagement_rate: number
  follower_gain: number
  collected_at: Date
}

export interface AccountAnalyticsSnapshot {
  snapshot_id: string
  account_id: string
  period_start: Date
  period_end: Date
  total_impressions: number
  total_reach: number
  total_engagements: number
  engagement_rate: number
  total_followers: number
  follower_growth: number
  top_post_id?: string
  source: 'Metricool' | 'Manual' | 'API'
  created_at: Date
}

export interface ContentCalendarEvent {
  calendar_event_id: string
  content_id: string
  platform: 'Instagram' | 'Facebook' | 'TikTok' | 'YouTube'
  event_date: Date
  display_color: string
  created_at: Date
}

export type MenuCategoryGroup = 'Food' | 'Drinks'

export interface MenuCategory {
  category_id: string
  category_name: string
  category_group: MenuCategoryGroup
  display_order: number
  created_at: Date
  updated_at: Date
}

export type MenuItemType = 'Food' | 'Drink' | 'Dessert' | 'Extra'

export interface MenuItem {
  item_id: string
  category_id: string
  item_name: string
  description: string
  price: number
  item_type: MenuItemType
  is_available: boolean
  image_url?: string
  created_at: Date
  updated_at: Date
}

export interface OrderChannel {
  channel_id: string
  channel_name: 'Rappi' | 'UberEats' | 'A domicilio' | 'Mostrador' | 'Mesa'
  is_active: boolean
  created_at: Date
}

export type OrderStatus = 'Pending' | 'Preparing' | 'Out for Delivery' | 'Completed' | 'Cancelled'
export type PaymentMethod = 'Cash' | 'Card' | 'Transfer' | 'App'

export interface Order {
  order_id: string
  channel_id: string
  customer_name: string
  customer_phone?: string
  delivery_address?: string
  total_amount: number
  payment_method: PaymentMethod
  order_status: OrderStatus
  order_date: Date
  notes?: string
  created_at: Date
  updated_at: Date
}

export interface OrderItem {
  order_item_id: string
  order_id: string
  item_id: string
  quantity: number
  unit_price: number
  subtotal: number
}

export interface ActivityLog {
  log_id: string
  entity_type: 'content' | 'order' | 'menu_item' | 'analytics'
  entity_id: string
  action_type: 'Created' | 'Updated' | 'Deleted' | 'Status Changed'
  old_value?: string
  new_value?: string
  user_id: string
  created_at: Date
}
