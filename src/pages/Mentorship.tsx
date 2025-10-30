import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageCircle, Plus, Tag } from "lucide-react";
import { auth, createForumPost, getForumPosts, addReplyToPost } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import type { ForumPost } from "@/types";

const COMMON_TAGS = ["Career Advice", "College", "Internships", "Resume Help", "Interview Tips", "Networking", "Skills Development", "Industry Insights"];

const Mentorship = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({ title: "", content: "", tags: [] as string[] });
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await getForumPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error loading posts:", error);
        toast({
          title: "Error loading posts",
          description: "Failed to load forum posts.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [toast]);

  const handleCreatePost = async () => {
    if (!currentUser) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to post.",
        variant: "destructive",
      });
      return;
    }

    try {
      const postData = {
        userId: currentUser.uid,
        userName: currentUser.email?.split('@')[0] || "Student",
        title: newPost.title,
        content: newPost.content,
        tags: newPost.tags,
        replies: [],
        createdAt: new Date(),
      };

      const postId = await createForumPost(postData);
      
      setPosts([{ ...postData, id: postId }, ...posts]);
      setNewPost({ title: "", content: "", tags: [] });
      
      toast({
        title: "Post created!",
        description: "Your question has been posted.",
      });
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post.",
        variant: "destructive",
      });
    }
  };

  const handleAddReply = async (postId: string) => {
    const content = replyContent[postId];
    if (!content?.trim()) return;

    if (!currentUser) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to reply.",
        variant: "destructive",
      });
      return;
    }

    try {
      const reply = {
        id: Date.now().toString(),
        userId: currentUser.uid,
        userName: currentUser.email?.split('@')[0] || "Student",
        content,
        createdAt: new Date(),
      };

      await addReplyToPost(postId, reply);

      const updated = posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            replies: [...post.replies, reply],
          };
        }
        return post;
      });

      setPosts(updated);
      setReplyContent({ ...replyContent, [postId]: "" });

      toast({
        title: "Reply posted!",
      });
    } catch (error) {
      console.error("Error adding reply:", error);
      toast({
        title: "Error",
        description: "Failed to post reply.",
        variant: "destructive",
      });
    }
  };

  const toggleTag = (tag: string) => {
    setNewPost({
      ...newPost,
      tags: newPost.tags.includes(tag) ? newPost.tags.filter((t) => t !== tag) : [...newPost.tags, tag],
    });
  };

  const filteredPosts = selectedTag ? posts.filter((post) => post.tags.includes(selectedTag)) : posts;

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">Mentorship Board</h1>
            <p className="text-muted-foreground text-lg">Ask questions and get advice from peers and mentors</p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 w-4 h-4" /> New Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Ask a Question</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Input placeholder="Question title" value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} />
                </div>
                <div>
                  <Textarea placeholder="Provide more details..." value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} rows={6} />
                </div>
                <div>
                  <div className="text-sm font-semibold mb-2">Select Tags:</div>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_TAGS.map((tag) => (
                      <Badge key={tag} variant={newPost.tags.includes(tag) ? "default" : "outline"} className="cursor-pointer" onClick={() => toggleTag(tag)}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button onClick={handleCreatePost} disabled={!newPost.title || !newPost.content} className="w-full">
                  Post Question
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6">
          <div className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Tag className="w-4 h-4" /> Filter by tag:
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant={selectedTag === null ? "default" : "outline"} className="cursor-pointer" onClick={() => setSelectedTag(null)}>
              All
            </Badge>
            {COMMON_TAGS.map((tag) => (
              <Badge key={tag} variant={selectedTag === tag ? "default" : "outline"} className="cursor-pointer" onClick={() => setSelectedTag(tag)}>
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="p-6">
              <div className="mb-4">
                <h3 className="text-2xl font-bold mb-2">{post.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>Posted by {post.userName}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2 mb-3">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-muted-foreground">{post.content}</p>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-4 text-sm font-semibold">
                  <MessageCircle className="w-4 h-4" />
                  {post.replies.length} Replies
                </div>

                {post.replies.map((reply) => (
                  <div key={reply.id} className="ml-6 mb-4 p-4 bg-secondary/30 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span className="font-semibold">{reply.userName}</span>
                      <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm">{reply.content}</p>
                  </div>
                ))}

                <div className="flex gap-2 mt-4">
                  <Input placeholder="Write a reply..." value={replyContent[post.id] || ""} onChange={(e) => setReplyContent({ ...replyContent, [post.id]: e.target.value })} onKeyDown={(e) => e.key === "Enter" && handleAddReply(post.id)} />
                  <Button onClick={() => handleAddReply(post.id)}>Reply</Button>
                </div>
              </div>
            </Card>
          ))}

          {filteredPosts.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No questions yet. Be the first to ask!</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mentorship;
