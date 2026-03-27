'use client'

import { useState, useMemo } from 'react'
import { format, subDays } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts'
import { generateAnalyticsData, mockContent, mockContentAnalytics } from '@/lib/data'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Eye,
  Users,
  Heart,
  TrendingUp,
  CalendarIcon,
  ExternalLink,
} from 'lucide-react'
import type { DateRange } from 'react-day-picker'

const chartConfig: ChartConfig = {
  impressions: {
    label: 'Impresiones',
    color: 'var(--chart-1)',
  },
  reach: {
    label: 'Alcance',
    color: 'var(--chart-2)',
  },
  engagement: {
    label: 'Interacción',
    color: 'var(--chart-3)',
  },
  followers: {
    label: 'Seguidores',
    color: 'var(--chart-4)',
  },
}

const dateRangePresets = [
  { label: 'Últimos 7 días', value: '7' },
  { label: 'Últimos 14 días', value: '14' },
  { label: 'Últimos 30 días', value: '30' },
  { label: 'Últimos 90 días', value: '90' },
]

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [preset, setPreset] = useState('30')

  const analyticsDataMap = useMemo(() => {
    const days = preset ? parseInt(preset) : 30
    const rawData = generateAnalyticsData(days)
    // Map to recharts friendly format
    return rawData.map(d => ({
      date: typeof d.period_start === 'string' ? d.period_start : d.period_start.toISOString(),
      impressions: d.total_impressions,
      reach: d.total_reach,
      engagement: d.total_engagements,
      followers: d.total_followers
    }))
  }, [preset])

  const totals = useMemo(() => {
    return {
      impressions: analyticsDataMap.reduce((sum, d) => sum + d.impressions, 0),
      reach: analyticsDataMap.reduce((sum, d) => sum + d.reach, 0),
      engagement: analyticsDataMap.reduce((sum, d) => sum + d.engagement, 0),
      followers: analyticsDataMap[analyticsDataMap.length - 1]?.followers || 0,
      followerGrowth:
        analyticsDataMap.length > 1
          ? analyticsDataMap[analyticsDataMap.length - 1].followers -
            analyticsDataMap[0].followers
          : 0,
    }
  }, [analyticsDataMap])

  const engagementRate = useMemo(() => {
    if (totals.reach === 0) return 0
    return ((totals.engagement / totals.reach) * 100).toFixed(2)
  }, [totals])

  const handlePresetChange = (value: string) => {
    setPreset(value)
    const days = parseInt(value)
    setDateRange({
      from: subDays(new Date(), days),
      to: new Date(),
    })
  }
  
  // Create Top Posts derived from mock data
  const topPosts = useMemo(() => {
    return mockContentAnalytics
      .map(analytics => {
        const post = mockContent.find(c => c.content_id === analytics.content_id)
        return {
          id: analytics.content_id,
          title: post?.title || 'Contenido',
          impressions: analytics.impressions,
          engagement: analytics.engagement_rate,
          likes: analytics.likes
        }
      })
      .sort((a,b) => b.impressions - a.impressions)
      .slice(0, 5)
  }, [])

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Estadísticas</h1>
            <p className="text-sm text-muted-foreground">
              Analiza el rendimiento de tu contenido
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={preset} onValueChange={handlePresetChange}>
              <SelectTrigger className="w-[140px] bg-secondary border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {dateRangePresets.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal bg-secondary border-border text-foreground">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'LLL dd', { locale: es })} -{' '}
                        {format(dateRange.to, 'LLL dd, y', { locale: es })}
                      </>
                    ) : (
                      format(dateRange.from, 'LLL dd, y', { locale: es })
                    )
                  ) : (
                    <span>Selecciona fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover border-border" align="end">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  className="bg-popover text-foreground"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Impresiones Totales
              </CardTitle>
              <Eye className="h-4 w-4 text-[#926c15]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {totals.impressions.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500 font-medium">+12.5%</span> vs periodo anterior
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tasa de Interacción
              </CardTitle>
              <Heart className="h-4 w-4 text-[#926c15]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{engagementRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500 font-medium">+2.1%</span> vs periodo anterior
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Seguidores
              </CardTitle>
              <Users className="h-4 w-4 text-[#926c15]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {totals.followers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500 font-medium">
                  +{(totals.followerGrowth ?? 0).toLocaleString()}
                </span>{' '}
                nuevos seguidores
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Alcance Total
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-[#926c15]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {totals.reach.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500 font-medium">+8.3%</span> vs periodo anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Impressions Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Impresiones en el Tiempo</CardTitle>
              <CardDescription>Impresiones diarias del periodo seleccionado</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full text-foreground">
                <AreaChart
                  data={analyticsDataMap}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="fillImpressions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#926c15" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#926c15" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => format(new Date(value), 'MMM d', { locale: es })}
                    tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.7 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.7 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent indicator="line" className="bg-popover border-border text-foreground" />} />
                  <Area
                    type="monotone"
                    dataKey="impressions"
                    stroke="#926c15"
                    strokeWidth={2}
                    fill="url(#fillImpressions)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Engagement Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Métricas de Interacción</CardTitle>
              <CardDescription>Interacción diaria del periodo seleccionado</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full text-foreground">
                <BarChart
                  data={analyticsDataMap}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => format(new Date(value), 'MMM d', { locale: es })}
                    tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.7 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.7 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent indicator="dot" className="bg-popover border-border text-foreground" />} />
                  <Bar
                    dataKey="engagement"
                    fill="#926c15"
                    radius={[4, 4, 0, 0]}
                    opacity={0.8}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Follower Growth Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Crecimiento de Seguidores</CardTitle>
              <CardDescription>Monitorea el crecimiento de tu audiencia</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full text-foreground">
                <AreaChart
                  data={analyticsDataMap}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="fillFollowers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ade80" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => format(new Date(value), 'MMM d', { locale: es })}
                    tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.7 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                    tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.7 }}
                    domain={['dataMin - 500', 'dataMax + 500']}
                  />
                  <ChartTooltip content={<ChartTooltipContent indicator="line" className="bg-popover border-border text-foreground" />} />
                  <Area
                    type="monotone"
                    dataKey="followers"
                    stroke="#4ade80"
                    strokeWidth={2}
                    fill="url(#fillFollowers)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Top Performing Posts */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Mejores Publicaciones</CardTitle>
              <CardDescription>Tu mejor contenido de este periodo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPosts.length > 0 ? topPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className="flex items-center gap-4 rounded-lg border border-border p-3 transition-colors hover:bg-secondary/40"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-[#926c15] text-sm font-bold border border-[#926c15]/20">
                      #{index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{post.title}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span>{post.impressions.toLocaleString()} vistas</span>
                        <span>{post.engagement}% interacción</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-[#926c15]/10 text-[#926c15] border-[#926c15]/20 font-medium">
                        {post.likes.toLocaleString()} likes
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                     <p className="text-muted-foreground">No hay publicaciones con métricas registradas en este periodo.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
