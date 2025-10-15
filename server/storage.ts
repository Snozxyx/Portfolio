import { type User, type InsertUser, type Project, type InsertProject, type Skill, type InsertSkill, type BlogPost, type InsertBlogPost, type BlogComment, type InsertComment, type PostStar, type SafeUser, type SiteSettings, type Announcement, type InsertAnnouncement, type AnimeEntry, type InsertAnime, type ActivityLog } from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<SafeUser>;
  verifyPassword(username: string, password: string): Promise<User | null>;
  getAllUsers(): Promise<SafeUser[]>;
  deleteUser(id: string): Promise<boolean>;
  updateUserRole(id: string, role: string): Promise<SafeUser | undefined>;
  toggleUserPosting(userId: string, canPost: boolean): Promise<SafeUser | undefined>;
  toggleUserBan(userId: string, isBanned: boolean): Promise<SafeUser | undefined>;
  toggleUserMute(userId: string, isMuted: boolean): Promise<SafeUser | undefined>;

  // Projects
  getAllProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  // Skills
  getAllSkills(): Promise<Skill[]>;
  getSkill(id: string): Promise<Skill | undefined>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: string, skill: Partial<InsertSkill>): Promise<Skill | undefined>;
  deleteSkill(id: string): Promise<boolean>;

  // Blog Posts
  getAllPosts(publishedOnly?: boolean): Promise<BlogPost[]>;
  getPost(id: string): Promise<BlogPost | undefined>;
  getPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getPostsByAuthor(authorId: string): Promise<BlogPost[]>;
  createPost(post: InsertBlogPost): Promise<BlogPost>;
  updatePost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deletePost(id: string): Promise<boolean>;
  updatePostPublishStatus(id: string, published: boolean): Promise<BlogPost | undefined>;
  updatePostStatus(id: string, status: string): Promise<BlogPost | undefined>;
  pinPost(id: string): Promise<BlogPost | undefined>;
  unpinPost(id: string): Promise<BlogPost | undefined>;


  // Comments
  getCommentsByPost(postId: string): Promise<BlogComment[]>;
  createComment(comment: InsertComment): Promise<BlogComment>;
  deleteComment(id: string): Promise<boolean>;

  // Stars
  toggleStar(postId: string, userId: string): Promise<{ starred: boolean; count: number }>;
  getStarCount(postId: string): Promise<number>;
  hasUserStarred(postId: string, userId: string): Promise<boolean>;

  // Site Settings
  getSiteSettings(): Promise<SiteSettings>;
  updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings>;
  toggleMaintenanceMode(): Promise<void>;

  // Announcements
  getAllAnnouncements(activeOnly?: boolean): Promise<Announcement[]>;
  getAnnouncement(id: string): Promise<Announcement | undefined>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: string, announcement: Partial<InsertAnnouncement>): Promise<Announcement | undefined>;
  deleteAnnouncement(id: string): Promise<boolean>;

  // Anime
  getAllAnime(): Promise<AnimeEntry[]>;
  getAnime(id: string): Promise<AnimeEntry | undefined>;
  createAnime(anime: InsertAnime): Promise<AnimeEntry>;
  updateAnime(id: string, anime: Partial<InsertAnime>): Promise<AnimeEntry | undefined>;
  deleteAnime(id: string): Promise<boolean>;

  // Activity Logs
  getAllActivityLogs(limit?: number): Promise<ActivityLog[]>;
  createActivityLog(log: Omit<ActivityLog, 'id' | 'createdAt'>): Promise<ActivityLog>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projects: Map<string, Project>;
  private skills: Map<string, Skill>;
  private blogPosts: Map<string, BlogPost>;
  private blogComments: Map<string, BlogComment>;
  private postStars: Map<string, PostStar>;
  private siteSettings: Map<string, SiteSettings>;
  private announcements: Map<string, Announcement>;
  private animeEntries: Map<string, AnimeEntry>;
  private activityLogs: ActivityLog[];


  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.skills = new Map();
    this.blogPosts = new Map();
    this.blogComments = new Map();
    this.postStars = new Map();
    this.siteSettings = new Map();
    this.announcements = new Map();
    this.animeEntries = new Map();
    this.activityLogs = [];


    this.seedData();
  }

  private seedData() {
    // Sample admin user
    const adminUser: User = {
      id: randomUUID(),
      username: "admin",
      email: "admin@example.com",
      password: bcrypt.hashSync("admins", 10),
      displayName: "Admin User",
      role: "admin",
      canPost: true,
      isBanned: false,
      isMuted: false,
      bio: null,
      avatar: null,
      createdAt: new Date()
    };
    this.users.set(adminUser.id, adminUser);

    // Sample reader user
    const sampleUser: User = {
      id: randomUUID(),
      username: "testuser",
      email: "test@example.com",
      password: bcrypt.hashSync("password123", 10),
      displayName: "Test User",
      role: "reader",
      canPost: false,
      isBanned: false,
      isMuted: false,
      bio: null,
      avatar: null,
      createdAt: new Date()
    };
    this.users.set(sampleUser.id, sampleUser);

    const adminId = adminUser.id;
    const sampleUserId = sampleUser.id;


    // Sample Projects
    const sampleProjects: InsertProject[] = [
      {
        name: "StreamBot Pro",
        description: "Advanced Discord bot for streaming communities with real-time notifications and custom commands",
        techStack: ["Node.js", "Discord.js", "MongoDB", "WebSocket"],
        features: [
          "Live stream notifications",
          "Custom command system",
          "User analytics dashboard",
          "Multi-platform integration"
        ],
        githubUrl: "https://github.com/snozxyx/streambot-pro",
        liveUrl: "",
        imageUrl: "",
        order: "1"
      },
      {
        name: "GameHub Platform",
        description: "Full-stack gaming community platform with matchmaking and tournament features",
        techStack: ["React", "TypeScript", "Express", "PostgreSQL"],
        features: [
          "Real-time matchmaking",
          "Tournament brackets",
          "Player statistics",
          "In-app chat system"
        ],
        githubUrl: "https://github.com/snozxyx/gamehub",
        liveUrl: "https://gamehub.snozxyx.dev",
        imageUrl: "",
        order: "2"
      },
      {
        name: "Stream Analytics",
        description: "Analytics dashboard for content creators to track stream performance and audience engagement",
        techStack: ["Next.js", "Tailwind", "Prisma", "Charts.js"],
        features: [
          "Real-time viewer metrics",
          "Engagement analytics",
          "Revenue tracking",
          "Custom reports"
        ],
        githubUrl: "https://github.com/snozxyx/stream-analytics",
        liveUrl: "",
        imageUrl: "",
        order: "3"
      }
    ];

    sampleProjects.forEach(project => {
      const id = randomUUID();
      this.projects.set(id, { 
        ...project, 
        id,
        githubUrl: project.githubUrl || null,
        liveUrl: project.liveUrl || null,
        imageUrl: project.imageUrl || null
      });
    });

    // Sample Skills
    const sampleSkills: InsertSkill[] = [
      { name: "JavaScript/TypeScript", category: "Languages", proficiency: "expert", icon: "" },
      { name: "Python", category: "Languages", proficiency: "advanced", icon: "" },
      { name: "Java", category: "Languages", proficiency: "intermediate", icon: "" },
      { name: "C++", category: "Languages", proficiency: "intermediate", icon: "" },
      { name: "React", category: "Frameworks", proficiency: "expert", icon: "" },
      { name: "Next.js", category: "Frameworks", proficiency: "expert", icon: "" },
      { name: "Node.js", category: "Frameworks", proficiency: "expert", icon: "" },
      { name: "Express", category: "Frameworks", proficiency: "advanced", icon: "" },
      { name: "Git", category: "Tools", proficiency: "expert", icon: "" },
      { name: "Docker", category: "Tools", proficiency: "advanced", icon: "" },
      { name: "AWS", category: "Tools", proficiency: "intermediate", icon: "" },
      { name: "MongoDB", category: "Tools", proficiency: "advanced", icon: "" },
      { name: "Discord.js", category: "Gaming Tech", proficiency: "expert", icon: "" },
      { name: "Twitch API", category: "Gaming Tech", proficiency: "advanced", icon: "" },
      { name: "OBS Studio", category: "Gaming Tech", proficiency: "advanced", icon: "" },
      { name: "WebRTC", category: "Gaming Tech", proficiency: "intermediate", icon: "" }
    ];

    sampleSkills.forEach(skill => {
      const id = randomUUID();
      this.skills.set(id, { 
        ...skill, 
        id,
        icon: skill.icon || null
      });
    });

    // Sample Blog Posts
    const samplePosts: InsertBlogPost[] = [
      {
        title: "Building Real-Time Discord Bots with Node.js",
        content: "Learn how to create powerful Discord bots that can handle real-time events and provide amazing experiences for your community...",
        excerpt: "A comprehensive guide to building Discord bots with modern JavaScript",
        authorId: adminId,
        tags: ["Discord", "Node.js", "Bot Development"],
        published: true
      },
      {
        title: "Streaming Technology: The Future of Content Creation",
        content: "Exploring the latest trends in streaming technology and how they're shaping the future of content creation...",
        excerpt: "An in-depth look at modern streaming platforms and technologies",
        authorId: adminId,
        tags: ["Streaming", "Technology", "Content Creation"],
        published: true
      }
    ];

    samplePosts.forEach(post => {
      const id = randomUUID();
      const slug = this.generateSlug(post.title);
      this.blogPosts.set(id, { 
        id, 
        slug,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || null,
        authorId: post.authorId,
        tags: post.tags || [],
        category: post.category || null,
        published: post.published || false,
        status: "published", 
        stars: 0, 
        views: 0, 
        readTime: 5, 
        coverImage: post.coverImage || null,
        createdAt: new Date(), 
        updatedAt: new Date(), 
        publishedAt: new Date() 
      });
    });

    // Sample Comments
    const sampleComments: InsertComment[] = [
      {
        postId: Array.from(this.blogPosts.values())[0].id, // Comment on the first post
        authorId: sampleUserId, // Comment by the sample user
        content: "Great post! Very informative.",
      },
      {
        postId: Array.from(this.blogPosts.values())[0].id,
        authorId: adminId, // Comment by the admin
        content: "Thanks for the feedback!",
      },
      {
        postId: Array.from(this.blogPosts.values())[1].id, // Comment on the second post
        authorId: sampleUserId,
        content: "Interesting read on streaming tech.",
      },
    ];

    sampleComments.forEach(comment => {
      const id = randomUUID();
      this.blogComments.set(id, { ...comment, id, createdAt: new Date() });
    });

    // Sample Site Settings
    this.siteSettings.set("settings", {
      id: randomUUID(),
      maintenanceMode: false,
      maintenanceMessage: "The website is currently under maintenance. Please check back soon.",
      siteTitle: "Snozxyx Portfolio",
      siteDescription: "A modern portfolio showcasing projects, skills, and blog posts",
      siteLogo: null,
      favicon: null,
      ogImage: null,
      footerMessage: "Built with passion and code",
      homeHeroTitle: null,
      homeHeroSubtitle: null,
      homeAboutText: null,
      contactEmail: null,
      contactGithub: null,
      contactLinkedin: null,
      contactTwitter: null,
      showAnimePage: true,
      showGamesPage: true,
      showAnimeWidget: true,
      showGamesWidget: true,
      steamProfileId: null,
      updatedAt: new Date()
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  async getAllUsers(): Promise<SafeUser[]> {
    return Array.from(this.users.values()).map(({ password, ...user }) => user);
  }

  async createUser(insertUser: InsertUser): Promise<SafeUser> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const id = randomUUID();
    const user: User = {
      id,
      username: insertUser.username,
      email: insertUser.email,
      password: hashedPassword,
      displayName: insertUser.displayName || null,
      role: insertUser.role || "reader",
      bio: insertUser.bio || null,
      avatar: insertUser.avatar || null,
      isBanned: insertUser.isBanned !== undefined ? insertUser.isBanned : false,
      canPost: insertUser.canPost !== undefined ? insertUser.canPost : false,
      isMuted: insertUser.isMuted !== undefined ? insertUser.isMuted : false,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async verifyPassword(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  async updateUserRole(id: string, role: string): Promise<SafeUser | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    user.role = role;
    this.users.set(id, user);

    const { password, ...safeUser } = user;
    return safeUser;
  }

  async toggleUserPosting(userId: string, canPost: boolean): Promise<SafeUser | undefined> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.canPost = canPost;
    this.users.set(userId, user);

    const { password, ...safeUser } = user;
    return safeUser;
  }

  async toggleUserBan(userId: string, isBanned: boolean): Promise<SafeUser | undefined> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.isBanned = isBanned;
    this.users.set(userId, user);

    const { password, ...safeUser } = user;
    return safeUser;
  }

  async toggleUserMute(userId: string, isMuted: boolean): Promise<SafeUser | undefined> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.isMuted = isMuted;
    this.users.set(userId, user);

    const { password, ...safeUser } = user;
    return safeUser;
  }

  // Projects
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort((a, b) => a.order.localeCompare(b.order));
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = { 
      ...insertProject, 
      id,
      githubUrl: insertProject.githubUrl || null,
      liveUrl: insertProject.liveUrl || null,
      imageUrl: insertProject.imageUrl || null
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;

    const updated = { ...project, ...updates };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Skills
  async getAllSkills(): Promise<Skill[]> {
    return Array.from(this.skills.values());
  }

  async getSkill(id: string): Promise<Skill | undefined> {
    return this.skills.get(id);
  }

  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const id = randomUUID();
    const skill: Skill = { 
      ...insertSkill, 
      id,
      icon: insertSkill.icon || null
    };
    this.skills.set(id, skill);
    return skill;
  }

  async updateSkill(id: string, updates: Partial<InsertSkill>): Promise<Skill | undefined> {
    const skill = this.skills.get(id);
    if (!skill) return undefined;

    const updated = { ...skill, ...updates };
    this.skills.set(id, updated);
    return updated;
  }

  async deleteSkill(id: string): Promise<boolean> {
    return this.skills.delete(id);
  }

  // Blog Posts
  async getAllPosts(publishedOnly = true): Promise<BlogPost[]> {
    let allPosts = Array.from(this.blogPosts.values());

    if (publishedOnly) {
      allPosts = allPosts.filter(p => p.published);
    }

    // Sort: admin posts first, then by created date
    allPosts.sort((a, b) => {
      const userA = this.users.get(a.authorId);
      const userB = this.users.get(b.authorId);

      if (userA?.role === 'admin' && userB?.role !== 'admin') return -1;
      if (userA?.role !== 'admin' && userB?.role === 'admin') return 1;

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return allPosts.map(post => {
      const author = this.users.get(post.authorId);
      return {
        ...post,
        author: author ? { ...author, password: undefined } : null,
      };
    });
  }

  async getPost(id: string): Promise<BlogPost | undefined> {
    const post = this.blogPosts.get(id);
    if (!post) return undefined;

    // Just return the post without adding author
    return post;
  }

  async getPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const post = Array.from(this.blogPosts.values()).find(p => p.slug === slug);
    if (!post) return undefined;

    // Just return the post without adding author
    return post;
  }

  async getPostsByAuthor(authorId: string): Promise<BlogPost[]> {
    const posts = Array.from(this.blogPosts.values())
      .filter(p => p.authorId === authorId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return posts;
  }

  private generateSlug(title: string): string {
    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Ensure uniqueness
    let uniqueSlug = slug;
    let counter = 1;
    while (Array.from(this.blogPosts.values()).some(p => p.slug === uniqueSlug)) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    return uniqueSlug;
  }

  async createPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const slug = this.generateSlug(insertPost.title);

    // Calculate read time (average 200 words per minute)
    const wordCount = insertPost.content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    const post: BlogPost = {
      id,
      slug,
      title: insertPost.title,
      content: insertPost.content,
      excerpt: insertPost.excerpt || null,
      authorId: insertPost.authorId,
      tags: insertPost.tags || [],
      category: insertPost.category || null,
      published: insertPost.published !== undefined ? insertPost.published : false,
      status: insertPost.status || "draft",
      stars: 0,
      views: 0,
      readTime,
      coverImage: insertPost.coverImage || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: insertPost.published ? new Date() : null,
    };
    this.blogPosts.set(id, post);
    return post;
  }

  async updatePost(id: string, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const post = this.blogPosts.get(id);
    if (!post) return undefined;

    const updated = { ...post, ...updates, updatedAt: new Date() };
    this.blogPosts.set(id, updated);
    return updated;
  }

  async deletePost(id: string): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  async updatePostPublishStatus(id: string, published: boolean): Promise<BlogPost | undefined> {
    const post = this.blogPosts.get(id);
    if (!post) return undefined;

    const updated = { ...post, published, publishedAt: published ? new Date() : null };
    this.blogPosts.set(id, updated);
    return updated;
  }

  async updatePostStatus(id: string, status: string): Promise<BlogPost | undefined> {
    const post = this.blogPosts.get(id);
    if (!post) return undefined;

    const updated = { ...post, status, updatedAt: new Date() };
    this.blogPosts.set(id, updated);
    return updated;
  }

  async pinPost(id: string): Promise<BlogPost | undefined> {
    // In-memory: Simulate pinning by moving to the front of a hypothetical sorted list
    // For now, we'll just update the post object. A real implementation might add a 'pinned' flag.
    const post = this.blogPosts.get(id);
    if (!post) return undefined;
    // For simplicity, let's add a flag, assuming schema can be updated
    // If not, this would require more complex sorting logic
    const pinnedPost = { ...post, pinned: true };
    this.blogPosts.set(id, pinnedPost);
    return pinnedPost;
  }

  async unpinPost(id: string): Promise<BlogPost | undefined> {
    const post = this.blogPosts.get(id);
    if (!post) return undefined;
    const unpinnedPost = { ...post, pinned: false };
    this.blogPosts.set(id, unpinnedPost);
    return unpinnedPost;
  }

  // Comments
  async getCommentsByPost(postId: string): Promise<BlogComment[]> {
    const comments = Array.from(this.blogComments.values())
      .filter(c => c.postId === postId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return comments;
  }

  async createComment(insertComment: InsertComment): Promise<BlogComment> {
    const id = randomUUID();
    const comment: BlogComment = {
      ...insertComment,
      id,
      createdAt: new Date()
    };
    this.blogComments.set(id, comment);
    return comment;
  }

  async deleteComment(id: string): Promise<boolean> {
    return this.blogComments.delete(id);
  }

  // Stars
  async toggleStar(postId: string, userId: string): Promise<{ starred: boolean; count: number }> {
    const existingStar = Array.from(this.postStars.values())
      .find(s => s.postId === postId && s.userId === userId);

    if (existingStar) {
      this.postStars.delete(existingStar.id);
      const post = this.blogPosts.get(postId);
      if (post) {
        post.stars = Math.max(0, post.stars - 1);
        this.blogPosts.set(postId, post);
      }
      return { starred: false, count: post?.stars || 0 };
    } else {
      const id = randomUUID();
      const star: PostStar = { id, postId, userId, createdAt: new Date() };
      this.postStars.set(id, star);
      const post = this.blogPosts.get(postId);
      if (post) {
        post.stars += 1;
        this.blogPosts.set(postId, post);
      }
      return { starred: true, count: post?.stars || 1 };
    }
  }

  async getStarCount(postId: string): Promise<number> {
    const post = this.blogPosts.get(postId);
    return post?.stars || 0;
  }

  async hasUserStarred(postId: string, userId: string): Promise<boolean> {
    return Array.from(this.postStars.values())
      .some(s => s.postId === postId && s.userId === userId);
  }

  async incrementViews(postId: string): Promise<void> {
    const post = this.blogPosts.get(postId);
    if (post) {
      post.views = (post.views || 0) + 1;
      this.blogPosts.set(postId, post);
    }
  }

  // Site Settings
  async getSiteSettings(): Promise<SiteSettings> {
    const settings = this.siteSettings.get("settings");

    if (!settings) {
      // Create default settings if none exist
      const defaultSettings: SiteSettings = {
        id: randomUUID(),
        maintenanceMode: false,
        maintenanceMessage: "We're currently performing maintenance. Please check back soon.",
        siteTitle: "Snozxyx Portfolio",
        siteDescription: "A modern portfolio showcasing projects, skills, and blog posts",
        siteLogo: null,
        favicon: null,
        ogImage: null,
        footerMessage: "Built with passion and code",
        homeHeroTitle: null,
        homeHeroSubtitle: null,
        homeAboutText: null,
        contactEmail: null,
        contactGithub: null,
        contactLinkedin: null,
        contactTwitter: null,
        showAnimePage: true,
        showGamesPage: true,
        showAnimeWidget: true,
        showGamesWidget: true,
        steamProfileId: null,
        updatedAt: new Date()
      };
      this.siteSettings.set("settings", defaultSettings);
      return defaultSettings;
    }

    return settings;
  }

  async updateSiteSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
    const currentSettings = await this.getSiteSettings();
    const updatedSettings = { 
      ...currentSettings, 
      ...updates,
      updatedAt: new Date()
    };
    this.siteSettings.set("settings", updatedSettings);
    return updatedSettings;
  }

  async toggleMaintenanceMode(): Promise<void> {
    const currentSettings = await this.getSiteSettings();
    currentSettings.maintenanceMode = !currentSettings.maintenanceMode;
    currentSettings.updatedAt = new Date();
    this.siteSettings.set("settings", currentSettings);
  }

  // Announcements
  async getAllAnnouncements(activeOnly = false): Promise<Announcement[]> {
    let announcements = Array.from(this.announcements.values());
    
    if (activeOnly) {
      const now = new Date();
      announcements = announcements.filter(a => {
        if (!a.isActive) return false;
        if (a.startDate && new Date(a.startDate) > now) return false;
        if (a.endDate && new Date(a.endDate) < now) return false;
        return true;
      });
    }

    return announcements.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getAnnouncement(id: string): Promise<Announcement | undefined> {
    return this.announcements.get(id);
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const id = randomUUID();
    const announcement: Announcement = {
      id,
      title: insertAnnouncement.title,
      message: insertAnnouncement.message,
      type: insertAnnouncement.type || "info",
      displayType: insertAnnouncement.displayType || "banner",
      isActive: insertAnnouncement.isActive !== undefined ? insertAnnouncement.isActive : true,
      startDate: insertAnnouncement.startDate || null,
      endDate: insertAnnouncement.endDate || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.announcements.set(id, announcement);
    return announcement;
  }

  async updateAnnouncement(id: string, updates: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    const announcement = this.announcements.get(id);
    if (!announcement) return undefined;

    const updated = { 
      ...announcement, 
      ...updates,
      updatedAt: new Date()
    };
    this.announcements.set(id, updated);
    return updated;
  }

  async deleteAnnouncement(id: string): Promise<boolean> {
    return this.announcements.delete(id);
  }

  // Anime methods
  async getAllAnime(): Promise<AnimeEntry[]> {
    const entries = Array.from(this.animeEntries.values());
    return entries.sort((a, b) => a.order - b.order);
  }

  async getAnime(id: string): Promise<AnimeEntry | undefined> {
    return this.animeEntries.get(id);
  }

  async createAnime(insertAnime: InsertAnime): Promise<AnimeEntry> {
    const id = randomUUID();
    const anime: AnimeEntry = {
      id,
      name: insertAnime.name,
      imageUrl: insertAnime.imageUrl || null,
      videoUrl: insertAnime.videoUrl || null,
      clipUrl: insertAnime.clipUrl || null,
      status: insertAnime.status || "watching",
      rating: insertAnime.rating || null,
      episodes: insertAnime.episodes || null,
      notes: insertAnime.notes || null,
      order: insertAnime.order || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.animeEntries.set(id, anime);
    return anime;
  }

  async updateAnime(id: string, updates: Partial<InsertAnime>): Promise<AnimeEntry | undefined> {
    const anime = this.animeEntries.get(id);
    if (!anime) return undefined;

    const updated = { 
      ...anime, 
      ...updates,
      updatedAt: new Date()
    };
    this.animeEntries.set(id, updated);
    return updated;
  }

  async deleteAnime(id: string): Promise<boolean> {
    return this.animeEntries.delete(id);
  }

  // Activity Log methods
  async getAllActivityLogs(limit: number = 100): Promise<ActivityLog[]> {
    return this.activityLogs
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async createActivityLog(log: Omit<ActivityLog, 'id' | 'createdAt'>): Promise<ActivityLog> {
    const activityLog: ActivityLog = {
      id: randomUUID(),
      ...log,
      createdAt: new Date()
    };
    this.activityLogs.push(activityLog);
    // Keep only last 1000 logs
    if (this.activityLogs.length > 1000) {
      this.activityLogs = this.activityLogs.slice(-1000);
    }
    return activityLog;
  }
}

// PostgreSQL Storage Implementation using Drizzle ORM
import { db } from "./db";
import { eq, and, desc, sql as drizzleSql } from "drizzle-orm";
import { 
  users, 
  projects, 
  skills, 
  blogPosts, 
  blogComments, 
  postStars, 
  siteSettings,
  announcements,
  animeEntries,
  activityLogs
} from "@shared/schema";

export class DbStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async getAllUsers(): Promise<SafeUser[]> {
    const allUsers = await db.select().from(users);
    return allUsers.map(({ password, ...user }) => user);
  }

  async createUser(insertUser: InsertUser): Promise<SafeUser> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const result = await db.insert(users).values({
      username: insertUser.username,
      email: insertUser.email,
      password: hashedPassword,
      displayName: insertUser.displayName,
      role: insertUser.role || "reader",
      bio: insertUser.bio,
      avatar: insertUser.avatar,
      isBanned: insertUser.isBanned ?? false,
      canPost: insertUser.canPost ?? false,
      isMuted: insertUser.isMuted ?? false,
    }).returning();
    
    const { password, ...safeUser } = result[0];
    return safeUser;
  }

  async verifyPassword(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return true;
  }

  async updateUserRole(id: string, role: string): Promise<SafeUser | undefined> {
    const result = await db.update(users)
      .set({ role })
      .where(eq(users.id, id))
      .returning();
    
    if (result.length === 0) return undefined;
    const { password, ...safeUser } = result[0];
    return safeUser;
  }

  async toggleUserPosting(userId: string, canPost: boolean): Promise<SafeUser | undefined> {
    const result = await db.update(users)
      .set({ canPost })
      .where(eq(users.id, userId))
      .returning();
    
    if (result.length === 0) return undefined;
    const { password, ...safeUser } = result[0];
    return safeUser;
  }

  async toggleUserBan(userId: string, isBanned: boolean): Promise<SafeUser | undefined> {
    const result = await db.update(users)
      .set({ isBanned })
      .where(eq(users.id, userId))
      .returning();
    
    if (result.length === 0) return undefined;
    const { password, ...safeUser } = result[0];
    return safeUser;
  }

  async toggleUserMute(userId: string, isMuted: boolean): Promise<SafeUser | undefined> {
    const result = await db.update(users)
      .set({ isMuted })
      .where(eq(users.id, userId))
      .returning();
    
    if (result.length === 0) return undefined;
    const { password, ...safeUser } = result[0];
    return safeUser;
  }

  // Projects
  async getAllProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(projects.order);
  }

  async getProject(id: string): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return result[0];
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const result = await db.insert(projects).values(insertProject).returning();
    return result[0];
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const result = await db.update(projects)
      .set(updates)
      .where(eq(projects.id, id))
      .returning();
    
    return result[0];
  }

  async deleteProject(id: string): Promise<boolean> {
    await db.delete(projects).where(eq(projects.id, id));
    return true;
  }

  // Skills
  async getAllSkills(): Promise<Skill[]> {
    return await db.select().from(skills);
  }

  async getSkill(id: string): Promise<Skill | undefined> {
    const result = await db.select().from(skills).where(eq(skills.id, id)).limit(1);
    return result[0];
  }

  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const result = await db.insert(skills).values(insertSkill).returning();
    return result[0];
  }

  async updateSkill(id: string, updates: Partial<InsertSkill>): Promise<Skill | undefined> {
    const result = await db.update(skills)
      .set(updates)
      .where(eq(skills.id, id))
      .returning();
    
    return result[0];
  }

  async deleteSkill(id: string): Promise<boolean> {
    await db.delete(skills).where(eq(skills.id, id));
    return true;
  }

  // Blog Posts
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async getAllPosts(publishedOnly = true): Promise<BlogPost[]> {
    if (publishedOnly) {
      return await db.select()
        .from(blogPosts)
        .where(eq(blogPosts.published, true))
        .orderBy(desc(blogPosts.createdAt));
    }
    
    return await db.select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.createdAt));
  }

  async getPost(id: string): Promise<BlogPost | undefined> {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    return result[0];
  }

  async getPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    return result[0];
  }

  async getPostsByAuthor(authorId: string): Promise<BlogPost[]> {
    return await db.select()
      .from(blogPosts)
      .where(eq(blogPosts.authorId, authorId))
      .orderBy(desc(blogPosts.createdAt));
  }

  async createPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    let slug = this.generateSlug(insertPost.title);
    
    // Ensure slug uniqueness
    let uniqueSlug = slug;
    let counter = 1;
    while (true) {
      const existing = await db.select().from(blogPosts).where(eq(blogPosts.slug, uniqueSlug)).limit(1);
      if (existing.length === 0) break;
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    // Calculate read time
    const wordCount = insertPost.content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    const result = await db.insert(blogPosts).values({
      slug: uniqueSlug,
      title: insertPost.title,
      content: insertPost.content,
      excerpt: insertPost.excerpt,
      authorId: insertPost.authorId,
      tags: insertPost.tags || [],
      category: insertPost.category,
      published: insertPost.published ?? false,
      status: insertPost.status || "draft",
      readTime,
      coverImage: insertPost.coverImage,
      publishedAt: insertPost.published ? new Date() : null,
    }).returning();
    
    return result[0];
  }

  async updatePost(id: string, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const result = await db.update(blogPosts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    
    return result[0];
  }

  async deletePost(id: string): Promise<boolean> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return true;
  }

  async updatePostPublishStatus(id: string, published: boolean): Promise<BlogPost | undefined> {
    const result = await db.update(blogPosts)
      .set({ 
        published, 
        publishedAt: published ? new Date() : null 
      })
      .where(eq(blogPosts.id, id))
      .returning();
    
    return result[0];
  }

  async updatePostStatus(id: string, status: string): Promise<BlogPost | undefined> {
    const result = await db.update(blogPosts)
      .set({ status, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    
    return result[0];
  }

  async pinPost(id: string): Promise<BlogPost | undefined> {
    // Note: Pin functionality would require a 'pinned' column in schema
    return await this.getPost(id);
  }

  async unpinPost(id: string): Promise<BlogPost | undefined> {
    // Note: Unpin functionality would require a 'pinned' column in schema
    return await this.getPost(id);
  }

  // Comments
  async getCommentsByPost(postId: string): Promise<BlogComment[]> {
    return await db.select()
      .from(blogComments)
      .where(eq(blogComments.postId, postId))
      .orderBy(desc(blogComments.createdAt));
  }

  async createComment(insertComment: InsertComment): Promise<BlogComment> {
    const result = await db.insert(blogComments).values(insertComment).returning();
    return result[0];
  }

  async deleteComment(id: string): Promise<boolean> {
    await db.delete(blogComments).where(eq(blogComments.id, id));
    return true;
  }

  // Stars
  async toggleStar(postId: string, userId: string): Promise<{ starred: boolean; count: number }> {
    const existingStar = await db.select()
      .from(postStars)
      .where(and(
        eq(postStars.postId, postId),
        eq(postStars.userId, userId)
      ))
      .limit(1);

    if (existingStar.length > 0) {
      await db.delete(postStars).where(eq(postStars.id, existingStar[0].id));
      await db.update(blogPosts)
        .set({ stars: drizzleSql`GREATEST(${blogPosts.stars} - 1, 0)` })
        .where(eq(blogPosts.id, postId));
      
      const post = await this.getPost(postId);
      return { starred: false, count: post?.stars || 0 };
    } else {
      await db.insert(postStars).values({ postId, userId });
      await db.update(blogPosts)
        .set({ stars: drizzleSql`${blogPosts.stars} + 1` })
        .where(eq(blogPosts.id, postId));
      
      const post = await this.getPost(postId);
      return { starred: true, count: post?.stars || 1 };
    }
  }

  async getStarCount(postId: string): Promise<number> {
    const post = await this.getPost(postId);
    return post?.stars || 0;
  }

  async hasUserStarred(postId: string, userId: string): Promise<boolean> {
    const result = await db.select()
      .from(postStars)
      .where(and(
        eq(postStars.postId, postId),
        eq(postStars.userId, userId)
      ))
      .limit(1);
    
    return result.length > 0;
  }

  async incrementViews(postId: string): Promise<void> {
    await db.update(blogPosts)
      .set({ views: drizzleSql`${blogPosts.views} + 1` })
      .where(eq(blogPosts.id, postId));
  }

  // Site Settings
  async getSiteSettings(): Promise<SiteSettings> {
    const result = await db.select().from(siteSettings).limit(1);
    
    if (result.length === 0) {
      // Create default settings
      const defaultSettings = await db.insert(siteSettings).values({
        maintenanceMode: false,
        maintenanceMessage: "We're currently performing maintenance. Please check back soon.",
        siteTitle: "Snozxyx Portfolio",
        siteDescription: "A modern portfolio showcasing projects, skills, and blog posts",
        footerMessage: "Built with passion and code",
      }).returning();
      
      return defaultSettings[0];
    }
    
    return result[0];
  }

  async updateSiteSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.getSiteSettings();
    const result = await db.update(siteSettings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(siteSettings.id, current.id))
      .returning();
    
    return result[0];
  }

  async toggleMaintenanceMode(): Promise<void> {
    const current = await this.getSiteSettings();
    await db.update(siteSettings)
      .set({ 
        maintenanceMode: !current.maintenanceMode,
        updatedAt: new Date()
      })
      .where(eq(siteSettings.id, current.id));
  }

  // Announcements
  async getAllAnnouncements(activeOnly = false): Promise<Announcement[]> {
    if (activeOnly) {
      return await db.select()
        .from(announcements)
        .where(eq(announcements.isActive, true))
        .orderBy(desc(announcements.createdAt));
    }
    
    return await db.select()
      .from(announcements)
      .orderBy(desc(announcements.createdAt));
  }

  async getAnnouncement(id: string): Promise<Announcement | undefined> {
    const result = await db.select().from(announcements).where(eq(announcements.id, id)).limit(1);
    return result[0];
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const result = await db.insert(announcements).values({
      title: insertAnnouncement.title,
      message: insertAnnouncement.message,
      type: insertAnnouncement.type || "info",
      displayType: insertAnnouncement.displayType || "banner",
      isActive: insertAnnouncement.isActive ?? true,
      startDate: insertAnnouncement.startDate,
      endDate: insertAnnouncement.endDate,
    }).returning();
    
    return result[0];
  }

  async updateAnnouncement(id: string, updates: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    const result = await db.update(announcements)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(announcements.id, id))
      .returning();
    
    return result[0];
  }

  async deleteAnnouncement(id: string): Promise<boolean> {
    await db.delete(announcements).where(eq(announcements.id, id));
    return true;
  }

  // Anime methods
  async getAllAnime(): Promise<AnimeEntry[]> {
    const result = await db.select().from(animeEntries).orderBy(animeEntries.order);
    return result;
  }

  async getAnime(id: string): Promise<AnimeEntry | undefined> {
    const result = await db.select().from(animeEntries).where(eq(animeEntries.id, id)).limit(1);
    return result[0];
  }

  async createAnime(insertAnime: InsertAnime): Promise<AnimeEntry> {
    const result = await db.insert(animeEntries).values({
      name: insertAnime.name,
      imageUrl: insertAnime.imageUrl,
      videoUrl: insertAnime.videoUrl,
      clipUrl: insertAnime.clipUrl,
      status: insertAnime.status || "watching",
      rating: insertAnime.rating,
      episodes: insertAnime.episodes,
      notes: insertAnime.notes,
      order: insertAnime.order || 0,
    }).returning();
    
    return result[0];
  }

  async updateAnime(id: string, updates: Partial<InsertAnime>): Promise<AnimeEntry | undefined> {
    const result = await db.update(animeEntries)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(animeEntries.id, id))
      .returning();
    
    return result[0];
  }

  async deleteAnime(id: string): Promise<boolean> {
    await db.delete(animeEntries).where(eq(animeEntries.id, id));
    return true;
  }

  // Activity Log methods
  async getAllActivityLogs(limit: number = 100): Promise<ActivityLog[]> {
    const result = await db.select()
      .from(activityLogs)
      .orderBy(desc(activityLogs.createdAt))
      .limit(limit);
    return result;
  }

  async createActivityLog(log: Omit<ActivityLog, 'id' | 'createdAt'>): Promise<ActivityLog> {
    const result = await db.insert(activityLogs).values(log).returning();
    return result[0];
  }
}

// Use DbStorage for production (PostgreSQL)
export const storage = new DbStorage();