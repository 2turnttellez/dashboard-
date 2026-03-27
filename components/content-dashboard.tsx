'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Content } from '@/lib/types'
import { mockContentAnalytics } from '@/lib/data'
import { supabase } from '@/lib/supabase'
import { PostCard } from '@/components/post-card'
import { AddPostDialog } from '@/components/add-post-dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Plus, Search, Clock, FileEdit, CheckCircle, Inbox } from 'lucide-react'

type PostStatus = Content['status']

const statusTabs: { value: PostStatus | 'all'; label: string; icon: React.ElementType }[] = [
  { value: 'all', label: 'Todos', icon: Inbox },
  { value: 'Scheduled', label: 'Programados', icon: Clock },
  { value: 'Draft', label: 'Borradores', icon: FileEdit },
  { value: 'Published', label: 'Publicados', icon: CheckCircle },
  { value: 'Backlog', label: 'Ideas', icon: Inbox },
]

function mapDbStatusToUi(status?: string | null): PostStatus {
  switch ((status || '').toLowerCase()) {
    case 'scheduled':
      return 'Scheduled'
    case 'published':
      return 'Published'
    case 'backlog':
      return 'Backlog'
    case 'draft':
    default:
      return 'Draft'
  }
}

function mapUiStatusToDb(status: PostStatus): string {
  switch (status) {
    case 'Scheduled':
      return 'scheduled'
    case 'Published':
      return 'published'
    case 'Backlog':
      return 'backlog'
    case 'Draft':
    default:
      return 'draft'
  }
}

function mapDbPostToContent(p: any): Content {
  const postTypeMap: Record<string, PostType> = {
    'post': 'Post',
    'reel': 'Reel',
    'story': 'Story',
    'carousel': 'Carousel',
  }

  return {
    content_id: p.id,
    account_id: 'acc_ig',
    title: p.title || '',
    caption: p.description || '',
    post_type: postTypeMap[p.type?.toLowerCase()] || 'Post',
    platform: p.platform || 'Instagram',
    status: mapDbStatusToUi(p.status),
    scheduled_date: p.scheduled_date ? new Date(p.scheduled_date) : undefined,
    media_url: p.media_url || undefined,
    media_type: p.media_type || 'image',
    thumbnail_url: p.thumbnail_url || undefined,
    created_at: p.created_at ? new Date(p.created_at) : new Date(),
    updated_at: p.created_at ? new Date(p.created_at) : new Date(),
  }
}

export function ContentDashboard() {
  const [posts, setPosts] = useState<Content[]>([])
  const [activeTab, setActiveTab] = useState<PostStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Content | null>(null)
  const [loading, setLoading] = useState(true)
  
  const searchParams = useSearchParams()
  const cardRefs = useRef<Record<string, HTMLDivElement>>({})

  // Scroll y highlight cuando postId viene del query param
  useEffect(() => {
    const highlightedPostId = searchParams?.get('postId')
    
    if (highlightedPostId && cardRefs.current[highlightedPostId]) {
      const cardElement = cardRefs.current[highlightedPostId]
      
      // Scroll suave hacia la card
      setTimeout(() => {
        cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        
        // Agregar highlight temporal
        cardElement.classList.add('ring-2', 'ring-[#926c15]', 'shadow-lg')
        
        // Remover highlight después de 3 segundos
        const timer = setTimeout(() => {
          cardElement.classList.remove('ring-2', 'ring-[#926c15]', 'shadow-lg')
        }, 3000)

        return () => clearTimeout(timer)
      }, 100)
    }
  }, [searchParams])

  const fetchPosts = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts:', error)
      setPosts([])
      setLoading(false)
      return
    }

    const mappedPosts = (data || []).map(mapDbPostToContent)
    setPosts(mappedPosts)
    setLoading(false)
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const filteredPosts = posts.filter((post) => {
    const matchesStatus = activeTab === 'all' || post.status === activeTab
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.caption.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesSearch
  })

  const handleAddPost = async (
    postData: Omit<Content, 'content_id' | 'created_at' | 'updated_at' | 'account_id'>
  ) => {
    if (editingPost) {
      const { error } = await supabase
        .from('posts')
        .update({
          title: postData.title,
          description: postData.caption,
          status: mapUiStatusToDb(postData.status),
          type: postData.post_type?.toLowerCase(),
          platform: postData.platform,
          scheduled_date: postData.scheduled_date
            ? new Date(postData.scheduled_date).toISOString()
            : null,
          media_url: postData.media_url,
        })
        .eq('id', editingPost.content_id)

      if (error) {
        console.error('Error updating post:', error)
        return
      }

      setEditingPost(null)
      setDialogOpen(false)
      await fetchPosts()
      return
    }

    const { error } = await supabase.from('posts').insert({
      title: postData.title,
      description: postData.caption,
      status: mapUiStatusToDb(postData.status),
      type: postData.post_type?.toLowerCase(),
      platform: postData.platform,
      scheduled_date: postData.scheduled_date
        ? new Date(postData.scheduled_date).toISOString()
        : null,
      media_url: postData.media_url,
    })

    if (error) {
      console.error('Error creating post:', error)
      return
    }

    setDialogOpen(false)
    await fetchPosts()
  }

  const handleEditPost = (post: Content) => {
    setEditingPost(post)
    setDialogOpen(true)
  }

  const handleDeletePost = async (id: string) => {
    try {
      // Obtener el post para conseguir la media_url
      const { data: postData, error: fetchError } = await supabase
        .from('posts')
        .select('media_url')
        .eq('id', id)
        .single()

      if (fetchError) {
        console.error('Error fetching post:', fetchError)
        return
      }

      // Si existe media_url, borrar el archivo del storage
      if (postData?.media_url) {
        try {
          // Extraer el nombre del archivo de la URL
          const filePath = postData.media_url.split('/').pop()
          
          if (filePath) {
            console.log('🗑️ Deleting file from storage:', filePath)
            
            const { error: storageError } = await supabase.storage
              .from('media')
              .remove([filePath])

            if (storageError) {
              console.error('⚠️ Error deleting file from storage:', storageError)
              // Continuar con la eliminación del post aunque falle el storage
            } else {
              console.log('✅ File deleted from storage')
            }
          }
        } catch (storageException) {
          console.error('⚠️ Storage cleanup exception:', storageException)
          // Continuar con la eliminación del post
        }
      }

      // Borrar la fila de posts
      const { error: deleteError } = await supabase.from('posts').delete().eq('id', id)

      if (deleteError) {
        console.error('Error deleting post:', deleteError)
        return
      }

      console.log('✅ Post deleted from database')
      await fetchPosts()
    } catch (error) {
      console.error('Error in handleDeletePost:', error)
    }
  }

  const getStatusCount = (status: PostStatus | 'all') => {
    if (status === 'all') return posts.length
    return posts.filter((p) => p.status === status).length
  }

  return (
    <div className="flex flex-col">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Contenido</h1>
            <p className="text-sm text-muted-foreground">
              Gestiona el contenido de redes sociales
            </p>
          </div>

          <Button
            onClick={() => {
              setEditingPost(null)
              setDialogOpen(true)
            }}
            className="bg-[#926c15] text-white shadow-md transition-transform hover:scale-[1.02] hover:bg-[#926c15]/80"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nueva Publicación
          </Button>
        </div>
      </header>

      <div className="flex-1 p-6">
        <Tabs
          value={activeTab}
          onValueChange={(v: string) => setActiveTab(v as PostStatus | 'all')}
          className="space-y-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
              {statusTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="text-muted-foreground data-[state=active]:bg-secondary data-[state=active]:text-foreground"
                >
                  <tab.icon className="mr-1.5 h-4 w-4" />
                  {tab.label}
                  <span className="ml-1.5 rounded-full bg-secondary px-2 py-0.5 text-xs">
                    {getStatusCount(tab.value)}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar publicaciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            {loading ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                Cargando contenido...
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card/50 py-16 text-center">
                <p className="text-sm text-muted-foreground">
                  No hay publicaciones todavía.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredPosts.map((post) => (
                  <div
                    key={post.content_id}
                    ref={(el) => {
                      if (el) cardRefs.current[post.content_id] = el
                    }}
                  >
                    <PostCard
                      post={post}
                      analytics={mockContentAnalytics[post.content_id]}
                      onEdit={() => handleEditPost(post)}
                      onDelete={() => handleDeletePost(post.content_id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AddPostDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setEditingPost(null)
        }}
        onSave={handleAddPost}
        editPost={editingPost}
      />
    </div>
  )
}