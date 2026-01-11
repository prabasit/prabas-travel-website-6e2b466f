
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, MessageCircle, Share2, Calendar, User, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  date: string;
  likes: number;
  comments: number;
  readTime: string;
}

interface Comment {
  id: string;
  author_name: string;
  author_email: string;
  comment_text: string;
  created_at: string;
  is_approved: boolean;
}

interface BlogPostProps {
  post: BlogPost;
  isOpen: boolean;
  onClose: () => void;
}

const BlogPost = ({ post, isOpen, onClose }: BlogPostProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCount, setCommentCount] = useState(post.comments);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchComments();
      checkIfLiked();
    }
  }, [isOpen, post.id]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('blog_id', post.id)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
      setCommentCount(data?.length || 0);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const checkIfLiked = async () => {
    const email = localStorage.getItem('user_email');
    if (!email) return;

    try {
      const { data, error } = await supabase
        .from('blog_likes')
        .select('id')
        .eq('blog_id', post.id)
        .eq('user_email', email)
        .single();

      if (data && !error) {
        setIsLiked(true);
      }
    } catch (error) {
      // User hasn't liked this post
    }
  };

  const handleLike = async () => {
    let email = localStorage.getItem('user_email');
    
    if (!email) {
      email = prompt('Please enter your email to like this post:');
      if (!email) return;
      localStorage.setItem('user_email', email);
    }

    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('blog_likes')
          .delete()
          .eq('blog_id', post.id)
          .eq('user_email', email);

        if (error) throw error;
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
        toast({
          title: "Unliked",
          description: "You've removed your like from this post",
        });
      } else {
        // Like
        const { error } = await supabase
          .from('blog_likes')
          .insert([{
            blog_id: post.id,
            user_email: email
          }]);

        if (error) throw error;
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
        toast({
          title: "Liked!",
          description: "Thanks for liking this post",
        });
      }
    } catch (error) {
      console.error('Error handling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  const handleComment = async () => {
    if (!userName.trim() || !userEmail.trim() || !commentText.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('blog_comments')
        .insert([{
          blog_id: post.id,
          author_name: userName,
          author_email: userEmail,
          comment_text: commentText
        }]);

      if (error) throw error;

      toast({
        title: "Comment Submitted",
        description: "Your comment has been submitted for approval",
      });

      setCommentText('');
      // Don't clear name and email for better UX
      localStorage.setItem('user_name', userName);
      localStorage.setItem('user_email', userEmail);
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: "Error",
        description: "Failed to submit comment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Blog post link copied to clipboard",
        });
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Blog post link copied to clipboard",
      });
    }
  };

  // Load saved user data
  useEffect(() => {
    const savedName = localStorage.getItem('user_name');
    const savedEmail = localStorage.getItem('user_email');
    if (savedName) setUserName(savedName);
    if (savedEmail) setUserEmail(savedEmail);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{post.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Blog Post Header */}
          <div className="space-y-4">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-64 object-cover rounded-lg"
            />
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{post.date}</span>
                </div>
                <span>{post.readTime}</span>
              </div>
              <Badge>{post.category}</Badge>
            </div>
          </div>

          {/* Blog Content */}
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content || post.excerpt }} />
          </div>

          {/* Interaction Buttons */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isLiked 
                      ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{likeCount}</span>
                </button>
                
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-gray-600" />
                  <span>{commentCount}</span>
                </div>
                
                <button 
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t pt-6 space-y-6">
            <h3 className="text-xl font-semibold">Comments</h3>
            
            {/* Add Comment Form */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h4 className="font-medium">Add a Comment</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                </div>
                <Textarea
                  placeholder="Write your comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={3}
                />
                <Button onClick={handleComment} disabled={loading}>
                  <Send className="h-4 w-4 mr-2" />
                  {loading ? 'Submitting...' : 'Submit Comment'}
                </Button>
              </CardContent>
            </Card>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium">{comment.author_name}</h5>
                        <span className="text-sm text-muted-foreground">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.comment_text}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPost;
