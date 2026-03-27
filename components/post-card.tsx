'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import type { Content, ContentAnalytics } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Image as ImageIcon,
  Video,
  Layers,
  Film,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Calendar,
} from 'lucide-react'

const postTypeIcons: Record<string, any> = {
  Post: ImageIcon,
  Video: Video,
  Carousel: Layers,
  Reel: Film,
  Story: Clock,
}

const postTypeLabels: Record<string, string> = {
  Post: 'Post',
  Video: 'Video',
  Carousel: 'Carrusel',
  Reel: 'Reel',
  Story: 'Historia',
}

const postTypeBadgeColors: Record<string, string> = {
  Post: 'bg-[#926c15]/20 text-[#926c15]',
  Video: 'bg-chart-4/20 text-chart-4',
  Carousel: 'bg-chart-1/20 text-chart-1',
  Reel: 'bg-chart-3/20 text-chart-3',
  Story: 'bg-chart-5/20 text-chart-5',
}

interface PostCardProps {
  post: Content
  analytics?: ContentAnalytics
  onEdit?: (post: Content) => void
  onDelete?: (id: string) => void
}

export function PostCard({ post, analytics, onEdit, onDelete }: PostCardProps) {
  const [showPreview, setShowPreview] = useState(false)
  const TypeIcon = postTypeIcons[post.post_type] || ImageIcon

  return (
    <>
      <Card className="group overflow-hidden border-border/50 bg-card transition-all hover:border-[#926c15]/50 hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden bg-secondary/30">
          {post.media_type === 'video' && post.media_url ? (
            <video 
               src={post.media_url} 
               poster={post.thumbnail_url} 
               className="w-full h-full object-cover" 
               muted 
               loop 
               playsInline
               onMouseOver={e => e.currentTarget.play()}
               onMouseOut={e => e.currentTarget.pause()}
            />
          ) : post.media_url || post.thumbnail_url ? (
            <img src={post.media_url || post.thumbnail_url} alt={post.title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <TypeIcon className="h-12 w-12 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8 bg-background/80 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 border border-border/50"
              >
                <MoreVertical className="h-4 w-4 text-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-popover border-border">
              <DropdownMenuItem onClick={() => onEdit?.(post)} className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowPreview(true)} className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                Vista Previa
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer"
                onClick={() => onDelete?.(post.content_id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Quick status badge on image hover */}
          <div className="absolute bottom-2 left-2 opacity-0 transition-opacity group-hover:opacity-100">
             <Badge variant="outline" className="bg-background/80 backdrop-blur border-none text-[10px] font-semibold uppercase tracking-wider">
               {post.status}
             </Badge>
          </div>
        </div>
      <CardContent className="p-4 flex flex-col h-[180px]">
        <div className="mb-3 flex items-center justify-between gap-2">
          <Badge
            variant="secondary"
            className={postTypeBadgeColors[post.post_type] || postTypeBadgeColors.Post}
          >
            <TypeIcon className="mr-1 h-3 w-3" />
            {postTypeLabels[post.post_type] || post.post_type}
          </Badge>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
             {post.platform}
          </span>
        </div>
        <h3 className="mb-1.5 line-clamp-1 text-sm font-semibold text-foreground">
          {post.title}
        </h3>
        <p className="mb-3 line-clamp-2 text-xs text-muted-foreground flex-grow leading-relaxed">
          {post.caption || <span className="italic opacity-50">Sin descripción</span>}
        </p>
        
        <div className="space-y-1.5 mt-auto">
          {post.scheduled_date && (
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground/80">
              <Calendar className="h-3.5 w-3.5 text-[#926c15]" />
              {format(post.scheduled_date, 'MMM d, yyyy h:mm a')}
            </div>
          )}
          {post.published_date && (
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground/80">
              <Clock className="h-3.5 w-3.5 text-green-500" />
              Pub. {format(post.published_date, 'MMM d, yyyy')}
            </div>
          )}
          {analytics && (
            <div className="mt-3 flex items-center gap-4 border-t border-border/30 pt-3 text-[11px] font-semibold text-muted-foreground">
              <span className="flex items-center gap-1"><span className="text-foreground">{new Intl.NumberFormat('es-MX').format(analytics.likes)}</span> likes</span>
              <span className="flex items-center gap-1"><span className="text-foreground">{new Intl.NumberFormat('es-MX').format(analytics.comments)}</span> comm</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>

    {/* Preview Modal */}
    <Dialog open={showPreview} onOpenChange={setShowPreview}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">{post.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Media Preview */}
          {post.media_type === 'video' && post.media_url ? (
            <video 
              src={post.media_url} 
              poster={post.thumbnail_url}
              controls
              className="w-full rounded-lg border border-border max-h-[500px] object-contain bg-secondary/20"
            />
          ) : post.media_url || post.thumbnail_url ? (
            <img 
              src={post.media_url || post.thumbnail_url} 
              alt={post.title} 
              className="w-full rounded-lg border border-border max-h-[500px] object-contain bg-secondary/20"
            />
          ) : (
            <div className="flex h-60 items-center justify-center rounded-lg border border-dashed border-border bg-secondary/20">
              <div className="text-center">
                <TypeIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">Sin contenido multimedia</p>
              </div>
            </div>
          )}

          {/* Post Details */}
          <div className="space-y-3 border-t border-border pt-4">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Descripción</p>
              <p className="text-sm text-foreground mt-1">{post.caption || 'Sin descripción'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">Tipo</p>
                <Badge variant="secondary" className={postTypeBadgeColors[post.post_type] || postTypeBadgeColors.Post}>
                  {postTypeLabels[post.post_type] || post.post_type}
                </Badge>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">Plataforma</p>
                <Badge variant="outline" className="bg-secondary/50 border-border text-foreground">
                  {post.platform}
                </Badge>
              </div>
            </div>

            {post.scheduled_date && (
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">Fecha Programada</p>
                <p className="text-sm text-foreground mt-1">
                  {format(post.scheduled_date, 'dd MMM yyyy - HH:mm')}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}
