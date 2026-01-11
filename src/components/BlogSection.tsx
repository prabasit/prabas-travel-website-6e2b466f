
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2, Calendar, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import BlogPost from './BlogPost';

interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  author_id: string;
  is_published: boolean;
  published_at: string;
  created_at: string;
  team_members?: {
    name: string;
  };
}

const BlogSection = () => {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts();
    loadLikedPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          team_members (
            name
          )
        `)
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;

      const formattedPosts = data?.map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt || '',
        content: post.content || '',
        image: post.image_url || 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=250&fit=crop',
        category: post.category || 'General',
        author: post.team_members?.name || 'Admin',
        date: new Date(post.published_at || post.created_at).toLocaleDateString(),
        likes: 0, // Will be fetched separately
        comments: 0, // Will be fetched separately
        readTime: Math.ceil((post.content?.length || 500) / 200) + ' min read'
      })) || [];

      setBlogPosts(formattedPosts);
      
      // Fetch likes and comments count for each post
      await fetchPostStats(formattedPosts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPostStats = async (posts: any[]) => {
    try {
      const updatedPosts = await Promise.all(
        posts.map(async (post) => {
          const [likesRes, commentsRes] = await Promise.all([
            supabase.from('blog_likes').select('id', { count: 'exact' }).eq('blog_id', post.id),
            supabase.from('blog_comments').select('id', { count: 'exact' }).eq('blog_id', post.id).eq('is_approved', true)
          ]);

          return {
            ...post,
            likes: likesRes.count || 0,
            comments: commentsRes.count || 0
          };
        })
      );

      setBlogPosts(updatedPosts);
    } catch (error) {
      console.error('Error fetching post stats:', error);
    }
  };

  const loadLikedPosts = () => {
    const email = localStorage.getItem('user_email');
    if (email) {
      // In a real app, you'd fetch this from the database
      const liked = localStorage.getItem(`liked_posts_${email}`);
      if (liked) {
        setLikedPosts(JSON.parse(liked));
      }
    }
  };

  const handleLike = async (postId: string) => {
    let email = localStorage.getItem('user_email');
    
    if (!email) {
      email = prompt('Please enter your email to like this post:');
      if (!email) return;
      localStorage.setItem('user_email', email);
    }

    try {
      const isCurrentlyLiked = likedPosts.includes(postId);
      
      if (isCurrentlyLiked) {
        // Unlike
        await supabase
          .from('blog_likes')
          .delete()
          .eq('blog_id', postId)
          .eq('user_email', email);
        
        setLikedPosts(prev => prev.filter(id => id !== postId));
        setBlogPosts(prev => prev.map(post => 
          post.id === postId ? { ...post, likes: post.likes - 1 } : post
        ));
      } else {
        // Like
        await supabase
          .from('blog_likes')
          .insert([{ blog_id: postId, user_email: email }]);
        
        setLikedPosts(prev => [...prev, postId]);
        setBlogPosts(prev => prev.map(post => 
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        ));
      }

      // Save to localStorage for persistence
      const updatedLikes = isCurrentlyLiked 
        ? likedPosts.filter(id => id !== postId)
        : [...likedPosts, postId];
      localStorage.setItem(`liked_posts_${email}`, JSON.stringify(updatedLikes));
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleShare = async (post: any) => {
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: `${window.location.origin}/blog/${post.id}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(shareData.url);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareData.url);
    }
  };

  const openPost = (post: any) => {
    setSelectedPost(post);
    setIsPostOpen(true);
  };

  if (loading) {
    return (
      <section id="blog" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Travel Blog</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay updated with the latest travel guides, tips, and stories from Nepal.
            </p>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="blog" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Travel Blog</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay updated with the latest travel guides, tips, and stories from Nepal. 
              Our experts share insights to help you plan the perfect adventure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary/90">
                    {post.category}
                  </Badge>
                </div>
                
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{post.readTime}</span>
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center space-x-1 hover:text-red-500 transition-colors ${
                          likedPosts.includes(post.id) ? 'text-red-500' : ''
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${likedPosts.includes(post.id) ? 'fill-current' : ''}`} />
                        <span>{post.likes}</span>
                      </button>
                      
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </div>
                      
                      <button 
                        onClick={() => handleShare(post)}
                        className="flex items-center space-x-1 hover:text-primary transition-colors"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => openPost(post)}
                  >
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {blogPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blog posts available at the moment.</p>
            </div>
          )}

          {blogPosts.length > 0 && (
            <div className="text-center mt-12">
              <Button size="lg">View All Blog Posts</Button>
            </div>
          )}
        </div>
      </section>

      {selectedPost && (
        <BlogPost 
          post={selectedPost} 
          isOpen={isPostOpen} 
          onClose={() => setIsPostOpen(false)} 
        />
      )}
    </>
  );
};

export default BlogSection;
