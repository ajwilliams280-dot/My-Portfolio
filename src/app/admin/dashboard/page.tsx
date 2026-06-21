"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, LogOut, Trash2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("video");
  const [subcategory, setSubcategory] = useState("");
  const [customSubcategory, setCustomSubcategory] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaLink, setMediaLink] = useState("");
  const [featured, setFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Posts State
  const [posts, setPosts] = useState<any[]>([]);

  // Profile State
  const [profileName, setProfileName] = useState("");
  const [profileIdentity, setProfileIdentity] = useState("");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profileUploading, setProfileUploading] = useState(false);
  const [currentProfileImageUrl, setCurrentProfileImageUrl] = useState("");

  async function fetchPosts() {
    const { data } = await supabase
      .from("photos")
      .select("*")
      .order("uploadDate", { ascending: false });
    
    if (data) {
      setPosts(data.map(item => ({
        id: item.id,
        title: item.title,
        category: item.category,
        subcategory: item.photoCategories?.[0] || "",
        featured: item.featured,
      })));
    }
  }

  async function fetchProfile() {
    const { data } = await supabase
      .from("settings")
      .select("*")
      .eq("id", "profile")
      .single();
    
    if (data) {
      setProfileName(data.name || "");
      setProfileIdentity(data.identity || "");
      setCurrentProfileImageUrl(data.profile_image_url || "");
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log("getSession result:", session, error);
      if (!session) {
        console.log("No session found in getSession!");
        router.push("/admin/login");
      } else {
        setUser(session.user);
        fetchPosts();
        fetchProfile();
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("onAuthStateChange:", event, session);
      if (event === 'SIGNED_OUT') {
        router.push("/admin/login");
      } else if (session) {
        setUser(session.user);
        fetchPosts();
        fetchProfile();
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase.auth]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let finalMediaUrl = mediaLink;

      if (mediaFile) {
        const folderName = category === "music" ? "music" : category === "videography" ? "videos" : "photos";
        const fileName = `${folderName}/${Date.now()}_${mediaFile.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from("portfolio-photos")
          .upload(fileName, mediaFile, { upsert: false });
          
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("portfolio-photos")
          .getPublicUrl(fileName);
          
        finalMediaUrl = publicUrlData.publicUrl;
      }

      const finalSubcategory = subcategory === "Custom" ? customSubcategory : subcategory;

      const { error } = await supabase.from("photos").insert({
        title,
        description,
        category: category,
        photoCategories: finalSubcategory ? [finalSubcategory] : [],
        mediaUrl: finalMediaUrl,
        thumbnailUrl: finalMediaUrl,
        featured,
        uploadDate: new Date().toISOString(),
        tags: [],
        autoTags: []
      });

      if (error) throw error;

      setTitle("");
      setDescription("");
      setMediaFile(null);
      setMediaLink("");
      setCategory("video");
      setSubcategory("");
      setCustomSubcategory("");
      setFeatured(false);
      fetchPosts();
    } catch (err: any) {
      console.error("Error uploading: ", err);
      alert(`Failed to upload: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileUploading(true);

    try {
      let finalImageUrl = currentProfileImageUrl;

      if (profileFile) {
        const fileName = `${Date.now()}_${profileFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("profile")
          .upload(fileName, profileFile, { upsert: false });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("profile")
          .getPublicUrl(fileName);
          
        finalImageUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabase.from("settings").update({
        name: profileName,
        identity: profileIdentity,
        profile_image_url: finalImageUrl,
        updated_at: new Date().toISOString()
      }).eq("id", "profile");

      if (error) throw error;

      setProfileFile(null);
      setCurrentProfileImageUrl(finalImageUrl);
      alert("Profile updated successfully!");
    } catch (err: any) {
      console.error("Error updating profile: ", err);
      alert(`Failed to update profile: ${err.message}`);
    } finally {
      setProfileUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await supabase.from("photos").delete().eq("id", id);
      fetchPosts();
    } catch (err: any) {
      console.error("Error deleting: ", err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const defaultSubcategories: Record<string, string[]> = {
    video: ["Short Film", "Music Video", "Commercial", "Documentary"],
    photo: ["Street", "Portrait", "Landscape", "Event"],
    music: ["Beats", "Cinematic", "Afro", "Instrumental"]
  };

  if (loading) return null;
  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid md:grid-cols-2 gap-12 mt-20">
      {/* Upload Form */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-widest uppercase">
            Add <span className="text-accent">Content</span>
          </h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors">
            <LogOut size={16} /> Logout
          </button>
        </div>

        <form onSubmit={handleUpload} className="p-8 rounded-xl bg-foreground/5 border border-foreground/10 flex flex-col gap-6">
          <div>
            <label className="block text-sm uppercase tracking-widest text-foreground/70 mb-2">Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-background/50 border border-foreground/10 rounded-lg p-4 focus:outline-none focus:border-accent text-foreground" />
          </div>

          <div>
            <label className="block text-sm uppercase tracking-widest text-foreground/70 mb-2">Category</label>
            <select value={category} onChange={e => {
              setCategory(e.target.value);
              setSubcategory("");
              setCustomSubcategory("");
            }} className="w-full bg-background/50 border border-foreground/10 rounded-lg p-4 focus:outline-none focus:border-accent text-foreground">
              <option value="video">Videography</option>
              <option value="photo">Photography</option>
              <option value="music">Music</option>
            </select>
          </div>

          <div>
            <label className="block text-sm uppercase tracking-widest text-foreground/70 mb-2">Subcategory</label>
            <select value={subcategory} onChange={e => {
              setSubcategory(e.target.value);
              if (e.target.value !== "Custom") setCustomSubcategory("");
            }} className="w-full bg-background/50 border border-foreground/10 rounded-lg p-4 focus:outline-none focus:border-accent text-foreground mb-2">
              <option value="" disabled>Select Subcategory</option>
              {defaultSubcategories[category].map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
              <option value="Custom">Custom (Type your own)</option>
            </select>
            {subcategory === "Custom" && (
               <input type="text" value={customSubcategory} onChange={e => setCustomSubcategory(e.target.value)} required placeholder="Enter custom subcategory" className="w-full bg-background/50 border border-foreground/10 rounded-lg p-4 focus:outline-none focus:border-accent text-foreground" />
            )}
          </div>

          <div>
            <label className="block text-sm uppercase tracking-widest text-foreground/70 mb-2">Media File (Upload)</label>
            <input type="file" onChange={e => setMediaFile(e.target.files?.[0] || null)} className="w-full bg-background/50 border border-foreground/10 rounded-lg p-4 focus:outline-none focus:border-accent text-foreground" />
          </div>

          <div className="text-center text-sm text-foreground/40 font-bold uppercase tracking-widest py-2">OR</div>

          <div>
            <label className="block text-sm uppercase tracking-widest text-foreground/70 mb-2">Media Link (YouTube/Vimeo)</label>
            <input type="url" value={mediaLink} onChange={e => setMediaLink(e.target.value)} className="w-full bg-background/50 border border-foreground/10 rounded-lg p-4 focus:outline-none focus:border-accent text-foreground" placeholder="https://" />
          </div>

          <div>
            <label className="block text-sm uppercase tracking-widest text-foreground/70 mb-2">Description / Notes</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-background/50 border border-foreground/10 rounded-lg p-4 focus:outline-none focus:border-accent text-foreground resize-none" />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={e => setFeatured(e.target.checked)}
              className="w-5 h-5 bg-background/50 border border-foreground/10 rounded focus:outline-none focus:border-accent text-accent"
            />
            <label htmlFor="featured" className="text-sm uppercase tracking-widest text-foreground/70 cursor-pointer">
              Mark as Featured
            </label>
          </div>

          <button type="submit" disabled={uploading || (!mediaFile && !mediaLink)} className="w-full bg-accent hover:bg-accent/80 transition-colors disabled:opacity-50 text-white font-bold uppercase tracking-widest py-4 rounded-lg flex justify-center items-center gap-2">
            {uploading ? "Uploading..." : <><Plus size={20} /> Publish</>}
          </button>
        </form>
      </div>

      {/* Manage Posts */}
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold tracking-widest uppercase mb-8 pb-4 border-b border-foreground/10">Manage Posts</h2>
        <div className="flex-1 overflow-y-auto pr-4 space-y-4 max-h-[70vh] custom-scrollbar">
          {posts.map(post => (
            <div key={post.id} className="p-4 rounded-lg bg-background/50 border border-foreground/10 flex items-center justify-between group hover:border-foreground/30 transition-colors">
              <div>
                <p className="font-bold tracking-widest">{post.title}</p>
                <p className="text-sm text-accent uppercase tracking-widest mt-1">
                  {post.category} {post.subcategory && <span className="opacity-50">• {post.subcategory}</span>}
                  {post.featured && <span className="ml-2 px-2 py-1 bg-accent text-noir text-xs rounded">Featured</span>}
                </p>
              </div>
              <button onClick={() => handleDelete(post.id)} className="p-3 bg-red-500/10 text-red-500 rounded-lg opacity-50 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {posts.length === 0 && (
            <p className="text-foreground/50 text-center py-8">No content uploaded yet.</p>
          )}
        </div>
      </div>

      {/* Profile Settings */}
      <div className="md:col-span-2 mt-4 pt-12 border-t border-foreground/10">
        <h2 className="text-2xl font-bold tracking-widest uppercase mb-8">Profile Settings</h2>
        <form onSubmit={handleUpdateProfile} className="p-8 rounded-xl bg-foreground/5 border border-foreground/10 flex flex-col gap-6 max-w-2xl">
          <div>
            <label className="block text-sm uppercase tracking-widest text-foreground/70 mb-2">Creator Name</label>
            <input type="text" value={profileName} onChange={e => setProfileName(e.target.value)} className="w-full bg-background/50 border border-foreground/10 rounded-lg p-4 focus:outline-none focus:border-accent text-foreground" placeholder="Alton" />
          </div>

          <div>
            <label className="block text-sm uppercase tracking-widest text-foreground/70 mb-2">Short Identity / Bio</label>
            <input type="text" value={profileIdentity} onChange={e => setProfileIdentity(e.target.value)} className="w-full bg-background/50 border border-foreground/10 rounded-lg p-4 focus:outline-none focus:border-accent text-foreground" placeholder="filmmaker, photographer, music producer" />
          </div>

          <div>
            <label className="block text-sm uppercase tracking-widest text-foreground/70 mb-2">Profile Image</label>
            {currentProfileImageUrl && (
              <img src={currentProfileImageUrl} alt="Current Profile" className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-accent" />
            )}
            <input type="file" onChange={e => setProfileFile(e.target.files?.[0] || null)} className="w-full bg-background/50 border border-foreground/10 rounded-lg p-4 focus:outline-none focus:border-accent text-foreground" accept="image/*" />
          </div>

          <button type="submit" disabled={profileUploading} className="w-full bg-accent hover:bg-accent/80 transition-colors disabled:opacity-50 text-white font-bold uppercase tracking-widest py-4 rounded-lg mt-2">
            {profileUploading ? "Updating Profile..." : "Save Profile Update"}
          </button>
        </form>
      </div>

    </div>
  );
}
