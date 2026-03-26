'use client'

import { useState } from 'react'
import type { Content } from '@/lib/types'
import { mockContent, mockContentAnalytics } from '@/lib/data'
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

export function ContentDashboard() {
  const [posts, setPosts] = useState<Content[]>(mockContent)
  const [activeTab, setActiveTab] = useState<PostStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Content | null>(null)

  const filteredPosts = posts.filter((post) => {
    const matchesStatus = activeTab === 'all' || post.status === activeTab
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.caption.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleAddPost = (postData: Omit<Content, 'content_id' | 'created_at' | 'updated_at' | 'account_id'>) => {
    if (editingPost) {
      setPosts(
        posts.map((p) =>
          p.content_id === editingPost.content_id
            ? { ...p, ...postData, updated_at: new Date() } as Content
            : p
        )
      )
      setEditingPost(null)
    } else {
      const newPost: Content = {
        ...postData,
        content_id: `post_new_${Date.now()}`,
        account_id: 'acc_ig', // Default mapping
        created_at: new Date(),
        updated_at: new Date(),
      }
      setPosts([newPost, ...posts])
    }
  }

  const handleEditPost = (post: Content) => {
    setEditingPost(post)
    setDialogOpen(true)
  }

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter((p) => p.content_id !== id))
  }

  const getStatusCount = (status: PostStatus | 'all') => {
    if (status === 'all') return posts.length
    return posts.filter((p) => p.status === status).length
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Contenido</h1>
            <p className="text-sm text-muted-foreground">Gestiona el contenido de redes sociales</p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="bg-[#926c15] hover:bg-[#926c15]/80 text-white shadow-md transition-transform hover:scale-[1.02]">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Publicación
          </Button>
        </div>
      </header>

      {/* Content */}
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
                  className="data-[state=active]:bg-secondary data-[state=active]:text-foreground text-muted-foreground"
                >
                  <tab.icon className="mr-1.5 h-4 w-4" />
                  {tab.label}
                  <span className="ml-1.5 rounded-full bg-secondary px-2 py-0.5 text-xs text-foreground border border-border/50 shadow-sm">
                    {getStatusCount(tab.value)}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="relative max-w-sm flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar publicaciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-secondary/50 border-input text-foreground focus-visible:ring-[#926c15]"
              />
            </div>
          </div>

          {statusTabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-6">
              {filteredPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 bg-secondary/10">
                  <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                    <Inbox className="h-8 w-8 text-muted-foreground/60" />
                  </div>
                  <p className="mb-2 text-sm font-medium text-foreground">
                    No hay publicaciones
                  </p>
                  <p className="mb-4 text-xs text-muted-foreground/70 max-w-[250px] text-center">
                    {searchQuery
                      ? 'Intenta con otro término de búsqueda'
                      : 'Agrega una nueva publicación para comenzar a organizar tu feed'}
                  </p>
                  {!searchQuery && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDialogOpen(true)}
                      className="border-[#926c15]/30 text-[#926c15] hover:bg-[#926c15]/10"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Crear Publicación
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredPosts.map((post) => {
                    const analytics = mockContentAnalytics.find(a => a.content_id === post.content_id)
                    return (
                      <PostCard
                        key={post.content_id}
                        post={post}
                        analytics={analytics}
                        onEdit={handleEditPost}
                        onDelete={handleDeletePost}
                      />
                    )
                  })}
                </div>
              )}
            </TabsContent>
          ))}
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
