'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  ChevronLeft,
  ChevronRight,
  Instagram,
  Youtube,
  Music2,
  Facebook,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type PlatformType = 'Instagram' | 'YouTube' | 'TikTok' | 'Facebook'

type CalendarPost = {
  content_id: string
  title: string
  caption: string
  platform: PlatformType
  status: 'Scheduled' | 'Published' | 'Draft' | 'Backlog'
  scheduled_date: Date | null
  published_date: Date | null
}

type PostRow = {
  id: string
  title: string
  description: string | null
  type: string | null
  platform: string | null
  status: string | null
  scheduled_date: string | null
  created_at: string | null
}

const platformIcons: Record<PlatformType, React.ElementType> = {
  Instagram: Instagram,
  YouTube: Youtube,
  TikTok: Music2,
  Facebook: Facebook,
}

const platformColors: Record<PlatformType, string> = {
  Instagram: 'bg-[#E1306C]/10 text-[#E1306C] border-[#E1306C]/20',
  YouTube: 'bg-[#FF0000]/10 text-[#FF0000] border-[#FF0000]/20',
  TikTok: 'bg-foreground/10 text-foreground border-foreground/20',
  Facebook: 'bg-[#1877F2]/10 text-[#1877F2] border-[#1877F2]/20',
}

const statusColors: Record<CalendarPost['status'], string> = {
  Scheduled: 'border-l-[#926c15]',
  Published: 'border-l-green-500',
  Draft: 'border-l-yellow-500',
  Backlog: 'border-l-muted-foreground',
}

const platforms: { value: PlatformType | 'all'; label: string }[] = [
  { value: 'all', label: 'Todas las Plataformas' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Facebook', label: 'Facebook' },
  { value: 'TikTok', label: 'TikTok' },
  { value: 'YouTube', label: 'YouTube' },
]

function mapTypeToPlatform(type: string | null): PlatformType {
  const normalized = (type || '').toLowerCase()

  if (normalized.includes('youtube')) return 'YouTube'
  if (normalized.includes('facebook')) return 'Facebook'
  if (normalized.includes('tiktok')) return 'TikTok'
  return 'Instagram'
}

function mapStatus(status: string | null): CalendarPost['status'] {
  const normalized = (status || '').toLowerCase()

  if (
    normalized === 'scheduled' ||
    normalized === 'programado' ||
    normalized === 'programados'
  ) {
    return 'Scheduled'
  }

  if (
    normalized === 'published' ||
    normalized === 'publicado' ||
    normalized === 'publicados'
  ) {
    return 'Published'
  }

  if (
    normalized === 'draft' ||
    normalized === 'borrador' ||
    normalized === 'borradores'
  ) {
    return 'Draft'
  }

  return 'Backlog'
}

function mapPost(row: PostRow): CalendarPost {
  return {
    content_id: row.id,
    title: row.title,
    caption: row.description || '',
    platform: (row.platform?.toLowerCase() === 'youtube' ? 'YouTube' : 
               row.platform?.toLowerCase() === 'tiktok' ? 'TikTok' :
               row.platform?.toLowerCase() === 'facebook' ? 'Facebook' :
               row.platform?.toLowerCase() === 'instagram' ? 'Instagram' : 'Instagram') as PlatformType,
    status: mapStatus(row.status),
    scheduled_date: row.scheduled_date ? parseISO(row.scheduled_date) : null,
    published_date: null,
  }
}

export function ContentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType | 'all'>('all')
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [posts, setPosts] = useState<CalendarPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPosts() {
      setLoading(true)

      const { data, error } = await supabase
        .from('posts')
        .select('id, title, description, type, platform, status, scheduled_date, created_at')
        .not('scheduled_date', 'is', null)
        .order('scheduled_date', { ascending: true })

      if (error) {
        console.error('Error cargando calendario:', error)
        setPosts([])
        setLoading(false)
        return
      }

      const mapped = ((data as PostRow[] | null) || []).map(mapPost)
      setPosts(mapped)
      setLoading(false)
    }

    loadPosts()
  }, [])

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }, [currentDate])

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (selectedPlatform !== 'all' && post.platform !== selectedPlatform) {
        return false
      }
      return true
    })
  }, [posts, selectedPlatform])

  const getPostsForDay = (day: Date): CalendarPost[] => {
    return filteredPosts.filter((post) => {
      const postDate = post.scheduled_date || post.published_date
      return postDate && isSameDay(postDate, day)
    })
  }

  const selectedDayPosts = selectedDay ? getPostsForDay(selectedDay) : []
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  return (
    <div className="flex flex-col">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Calendario</h1>
            <p className="text-sm text-muted-foreground">
              Planifica y visualiza tu contenido programado
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={selectedPlatform}
              onValueChange={(v: string) => setSelectedPlatform(v as PlatformType | 'all')}
            >
              <SelectTrigger className="w-[220px] bg-secondary border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {platforms.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <div className="flex flex-1 gap-6 p-6">
        <div className="flex-1">
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-secondary/50 border-border text-foreground hover:bg-secondary"
                  onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <CardTitle className="text-lg capitalize">
                  {format(currentDate, 'MMMM yyyy', { locale: es })}
                </CardTitle>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-secondary/50 border-border text-foreground hover:bg-secondary"
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
                className="border-[#926c15] text-[#926c15] hover:bg-[#926c15]/10 font-medium"
              >
                Hoy
              </Button>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  Cargando...
                </div>
              ) : (
                <>
                  <div className="mb-2 grid grid-cols-7 gap-1">
                    {weekDays.map((day) => (
                      <div
                        key={day}
                        className="py-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day) => {
                      const dayPosts = getPostsForDay(day)
                      const isCurrentMonth = isSameMonth(day, currentDate)
                      const isToday = isSameDay(day, new Date())
                      const isSelected = selectedDay && isSameDay(day, selectedDay)

                      return (
                        <TooltipProvider key={day.toISOString()}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => setSelectedDay(day)}
                                className={cn(
                                  'relative flex min-h-[110px] flex-col rounded-lg border p-2 text-left transition-all duration-200',
                                  isCurrentMonth
                                    ? 'border-border bg-card hover:bg-secondary/40'
                                    : 'border-transparent bg-secondary/10 text-muted-foreground/50',
                                  isToday && 'ring-2 ring-[#926c15]',
                                  isSelected && 'border-[#926c15] bg-[#926c15]/5'
                                )}
                              >
                                <span
                                  className={cn(
                                    'mb-1 text-sm font-medium h-6 w-6 flex items-center justify-center rounded-full',
                                    isToday ? 'bg-[#926c15] text-white' : ''
                                  )}
                                >
                                  {format(day, 'd')}
                                </span>

                                <div className="mt-1 flex w-full flex-col gap-1.5 overflow-hidden">
                                  {dayPosts.slice(0, 3).map((post) => {
                                    const Icon = platformIcons[post.platform]

                                    return (
                                      <Link
                                        key={post.content_id}
                                        href={`/?postId=${post.content_id}`}
                                        scroll={true}
                                        className={cn(
                                          'flex items-center gap-1.5 truncate rounded-md border-l-2 bg-secondary/60 px-2 py-1 text-xs transition-all hover:shadow-md hover:bg-secondary/80',
                                          statusColors[post.status]
                                        )}
                                      >
                                        <Icon className="h-3 w-3 flex-shrink-0 opacity-70" />
                                        <span className="truncate font-medium">{post.title}</span>
                                      </Link>
                                    )
                                  })}

                                  {dayPosts.length > 3 && (
                                    <div className="mt-0.5 pl-1 text-[10px] font-medium text-muted-foreground">
                                      + {dayPosts.length - 3} más
                                    </div>
                                  )}
                                </div>
                              </button>
                            </TooltipTrigger>

                            {dayPosts.length > 0 && (
                              <TooltipContent
                                side="right"
                                className="max-w-[200px] bg-popover border-border text-foreground"
                              >
                                <div className="space-y-1">
                                  <p className="font-medium">{format(day, 'MMMM d, yyyy')}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {dayPosts.length} post{dayPosts.length > 1 ? 's' : ''}
                                  </p>
                                </div>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      )
                    })}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-border px-2 pt-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Estado:
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-[#926c15]" />
                      <span className="text-xs text-foreground font-medium">Programado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                      <span className="text-xs text-foreground font-medium">Publicado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                      <span className="text-xs text-foreground font-medium">Borrador</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground" />
                      <span className="text-xs text-foreground font-medium">Ideas</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="w-80 shrink-0">
          <Card className="sticky top-6 bg-card border-border shadow-sm">
            <CardHeader className="bg-secondary/20 pb-4">
              <CardTitle className="text-base font-semibold text-foreground capitalize">
                {selectedDay
                  ? format(selectedDay, 'EEEE, d MMMM')
                  : 'Selecciona un día'}
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-4">
              {selectedDay ? (
                selectedDayPosts.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDayPosts.map((post) => {
                      const Icon = platformIcons[post.platform]
                      const postDate = post.scheduled_date || post.published_date

                      return (
                        <Link
                          key={post.content_id}
                          href={`/?postId=${post.content_id}`}
                          scroll={true}
                          className={cn(
                            'block rounded-lg border border-border/50 bg-secondary/20 p-4 border-l-4 transition-all hover:shadow-md hover:opacity-90 hover:scale-[1.02]',
                            statusColors[post.status]
                          )}
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-[10px] px-2 py-0 h-5 border font-semibold',
                                platformColors[post.platform]
                              )}
                            >
                              <Icon className="mr-1 h-3 w-3" />
                              {post.platform}
                            </Badge>

                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              {post.status}
                            </span>
                          </div>

                          <h4 className="mb-1 text-sm font-semibold text-foreground leading-snug">
                            {post.title}
                          </h4>

                          <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
                            {post.caption}
                          </p>

                          {postDate && (
                            <div className="mt-auto flex items-center gap-1.5 border-t border-border/40 pt-2 text-[11px] font-medium text-muted-foreground">
                              <span className="opacity-70">Hora:</span>
                              <span className="text-foreground">
                                {format(postDate, 'h:mm a')}
                              </span>
                            </div>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-10 text-center">
                    <div className="mb-3 rounded-full bg-secondary/50 p-4">
                      <Instagram className="h-6 w-6 text-muted-foreground/60" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      Día libre de contenido
                    </p>
                    <p className="mt-1 max-w-[200px] text-xs text-muted-foreground">
                      No hay publicaciones programadas para esta fecha
                    </p>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center py-12 text-center opacity-70">
                  <p className="text-sm text-muted-foreground">
                    Haz clic en un día del calendario para ver los detalles
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}