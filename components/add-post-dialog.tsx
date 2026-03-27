'use client'

import { useState, useRef, useEffect } from 'react'
import { format } from 'date-fns'
import type { Content } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon, UploadCloud, X, Image as ImageIcon, Film } from 'lucide-react'
import { cn } from '@/lib/utils'

type PostStatus = Content['status']
type PostType = Content['post_type']
type Platform = Content['platform']

interface AddPostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (post: Omit<Content, 'content_id' | 'created_at' | 'updated_at' | 'account_id'>) => void
  editPost?: Content | null
}

const postTypes: { value: PostType; label: string }[] = [
  { value: 'Post', label: 'Post (Imagen)' },
  { value: 'Reel', label: 'Reel / Short' },
  { value: 'Story', label: 'Historia' },
  { value: 'Carousel', label: 'Carrusel' },
]

const statuses: { value: PostStatus; label: string }[] = [
  { value: 'Backlog', label: 'Ideas / Backlog' },
  { value: 'Draft', label: 'Borrador' },
  { value: 'Scheduled', label: 'Programado' },
  { value: 'Published', label: 'Publicado' },
]

const platforms: { value: Platform; label: string }[] = [
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Facebook', label: 'Facebook' },
  { value: 'TikTok', label: 'TikTok' },
  { value: 'YouTube', label: 'YouTube' },
]

export function AddPostDialog({
  open,
  onOpenChange,
  onSave,
  editPost,
}: AddPostDialogProps) {
  const [title, setTitle] = useState(editPost?.title || '')
  const [caption, setCaption] = useState(editPost?.caption || '')
  const [postType, setPostType] = useState<PostType>(editPost?.post_type || 'Post')
  const [status, setStatus] = useState<PostStatus>(editPost?.status || 'Backlog')
  const [platform, setPlatform] = useState<Platform>(editPost?.platform || 'Instagram')
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    editPost?.scheduled_date
  )

  // Media state
  const [mediaUrl, setMediaUrl] = useState<string>(editPost?.media_url || '')
  const [mediaType, setMediaType] = useState<'image' | 'video' | undefined>(editPost?.media_type)
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(editPost?.thumbnail_url || '')
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Efecto para cargar valores cuando se abre el diálogo para editar
  useEffect(() => {
    if (open && editPost) {
      setTitle(editPost.title)
      setCaption(editPost.caption)
      setPostType(editPost.post_type)
      setStatus(editPost.status)
      setPlatform(editPost.platform)
      setScheduledDate(editPost.scheduled_date)
      setMediaUrl(editPost.media_url || '')
      setMediaType(editPost.media_type)
      setThumbnailUrl(editPost.thumbnail_url || '')
    } else if (!open) {
      // Resetear cuando se cierra el diálogo
      resetForm()
    }
  }, [open, editPost])

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    
    if (!file) {
      console.log('No file selected')
      return
    }

    console.log('📤 Upload triggered:', file.name)

    try {
      const timestamp = Date.now()
      const randomStr = Math.random().toString(36).substring(2, 10)
      const extension = file.name.split('.').pop()
      const fileName = `${timestamp}-${randomStr}.${extension}`

      console.log('🚀 about to upload to supabase')

      const { error } = await supabase.storage
        .from('media')
        .upload(fileName, file)

      console.log('📦 upload result:', error)

      if (error) {
        console.error('❌ Upload error:', error)
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from('media')
        .getPublicUrl(fileName)

      const publicUrl = publicUrlData.publicUrl
      console.log('🔗 Public URL:', publicUrl)

      setMediaUrl(publicUrl)

      if (file.type.startsWith('video/')) {
        setMediaType('video')
        setThumbnailUrl('')
      } else {
        setMediaType('image')
        setThumbnailUrl(publicUrl)
      }
    } catch (error) {
      console.error('❌ Upload exception:', error)
    }
  }

  const clearMedia = () => {
    setMediaUrl('')
    setMediaType(undefined)
    setThumbnailUrl('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSave = () => {
    onSave({
      title,
      caption,
      post_type: postType,
      status,
      platform,
      scheduled_date: status === 'Scheduled' ? scheduledDate : undefined,
      published_date: status === 'Published' ? new Date() : undefined,
      media_url: mediaUrl || undefined,
      media_type: mediaType || undefined,
      thumbnail_url: thumbnailUrl || undefined,
      tags: [],
    })
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setTitle('')
    setCaption('')
    setPostType('Post')
    setStatus('Backlog')
    setPlatform('Instagram')
    setScheduledDate(undefined)
    setMediaUrl('')
    setMediaType(undefined)
    setThumbnailUrl('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {editPost ? 'Editar Publicación' : 'Nueva Idea de Publicación'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-5 py-4">
          
          {/* Media Upload Section */}
          <div className="grid gap-2">
            <Label className="text-foreground">Contenido Multimedia</Label>
            {!mediaUrl ? (
              <div 
                className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center bg-secondary/20 hover:bg-secondary/40 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-foreground">Sube un archivo</p>
                <p className="text-xs text-muted-foreground mt-1">Arrastra tu imagen/video o haz clic para buscar</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                />
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden border border-border bg-black/10 group aspect-video">
                {mediaType === 'video' ? (
                  <video src={mediaUrl} className="w-full h-full object-contain" controls />
                ) : (
                  <img src={mediaUrl} alt="Preview" className="w-full h-full object-contain" />
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                   <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={clearMedia}
                      className="h-8 w-8 shadow-sm"
                   >
                     <X className="h-4 w-4" />
                   </Button>
                </div>
                {/* Type Badge */}
                <div className="absolute top-2 left-2 bg-background/80 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-border/50">
                  {mediaType === 'video' ? <Film className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                  {mediaType}
                </div>
              </div>
            )}
            
            {/* Optional Thumbnail input for videos if needed */}
            {mediaUrl && mediaType === 'video' && (
              <div className="mt-2 text-xs">
                 <Label className="text-muted-foreground mb-1 block">URL de Portada (Opcional)</Label>
                 <Input 
                   value={thumbnailUrl} 
                   onChange={e => setThumbnailUrl(e.target.value)} 
                   placeholder="https://...imagen.jpg"
                   className="h-8 bg-secondary/50 border-border text-foreground"
                 />
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title" className="text-foreground">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Escribe el título"
              className="bg-secondary/50 border-input focus-visible:ring-[#926c15] text-foreground"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="caption" className="text-foreground">Descripción</Label>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Escribe la descripción aquí..."
              rows={4}
              className="bg-secondary/50 border-input focus-visible:ring-[#926c15] text-foreground"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-foreground">Tipo de Post</Label>
              <Select value={postType} onValueChange={(v: string) => setPostType(v as PostType)}>
                <SelectTrigger className="bg-secondary border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {postTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="text-foreground">Plataforma</Label>
              <Select value={platform} onValueChange={(v: string) => setPlatform(v as Platform)}>
                <SelectTrigger className="bg-secondary border-border text-foreground">
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
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-foreground">Estado</Label>
              <Select value={status} onValueChange={(v: string) => setStatus(v as PostStatus)}>
                <SelectTrigger className="bg-secondary border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {statuses.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {status === 'Scheduled' && (
              <div className="grid gap-2">
                <Label className="text-foreground">Fecha Programada</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'justify-start text-left font-normal bg-secondary border-border text-foreground',
                        !scheduledDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {scheduledDate ? format(scheduledDate, 'PPP') : 'Selecciona fecha'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
                    <Calendar
                      mode="single"
                      selected={scheduledDate}
                      onSelect={setScheduledDate}
                      className="bg-popover text-foreground"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="sticky bottom-0 bg-card pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-border text-foreground">
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!title || !caption} className="bg-[#926c15] hover:bg-[#926c15]/80 text-white font-semibold">
            {editPost ? 'Guardar Cambios' : 'Agregar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
