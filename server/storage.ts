import { type User, type InsertUser, type Project, type InsertProject, type Skill, type InsertSkill, type BlogPost, type InsertBlogPost, type BlogComment, type InsertComment, type PostStar, type SafeUser } from "@shared/schema";
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
  getSiteSettings(): Promise<any>;
  updateSiteSettings(settings: any): Promise<void>;
  toggleMaintenanceMode(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projects: Map<string, Project>;
  private skills: Map<string, Skill>;
  private blogPosts: Map<string, BlogPost>;
  private blogComments: Map<string, BlogComment>;
  private postStars: Map<string, PostStar>;
  private siteSettings: Map<string, any>;


  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.skills = new Map();
    this.blogPosts = new Map();
    this.blogComments = new Map();
    this.postStars = new Map();
    this.siteSettings = new Map();


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
      bio: null,
      avatar: null,
      createdAt: new Date()
    };
    this.users.set(adminUser.id, adminUser);

    // Sample user
    const sampleUser: User = {
      id: randomUUID(),
      username: "testuser",
      email: "test@example.com",
      password: bcrypt.hashSync("password123", 10),
      displayName: "Test User",
      role: "user",
      canPost: true,
      isBanned: false,
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
      this.projects.set(id, { ...project, id });
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
      this.skills.set(id, { ...skill, id });
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
      this.blogPosts.set(id, { ...post, id, slug, stars: 0, views: 0, readTime: 5, createdAt: new Date(), updatedAt: new Date(), publishedAt: new Date() });
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
      maintenanceMode: false,
      maintenanceMessage: "The website is currently under maintenance. Please check back soon."
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
      ...insertUser,
      id,
      password: hashedPassword,
      createdAt: new Date(),
      role: insertUser.role || "user",
      canPost: insertUser.canPost !== undefined ? insertUser.canPost : true,
      isBanned: insertUser.isBanned !== undefined ? insertUser.isBanned : false,
      bio: insertUser.bio || null,
      avatar: insertUser.avatar || null
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


  // Projects
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort((a, b) => a.order.localeCompare(b.order));
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = { ...insertProject, id };
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
    const skill: Skill = { ...insertSkill, id };
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

    const author = this.users.get(post.authorId);
    return {
      ...post,
      author: author ? { ...author, password: undefined } : null,
    };
  }

  async getPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const post = Array.from(this.blogPosts.values()).find(p => p.slug === slug);
    if (!post) return undefined;

    const author = this.users.get(post.authorId);
    return {
      ...post,
      author: author ? { ...author, password: undefined } : null,
    };
  }

  async getPostsByAuthor(authorId: string): Promise<BlogPost[]> {
    const posts = Array.from(this.blogPosts.values())
      .filter(p => p.authorId === authorId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return posts.map(post => {
      const author = this.users.get(post.authorId);
      return {
        ...post,
        author: author ? { ...author, password: undefined } : null,
      };
    });
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
      ...insertPost,
      id,
      slug,
      stars: 0,
      views: 0,
      readTime,
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

    return comments.map(comment => {
      const author = this.users.get(comment.authorId);
      return {
        ...comment,
        author: author ? { ...author, password: undefined } : null,
      };
    });
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
  async getSiteSettings(): Promise<any> {
    const settings = this.siteSettings.get("settings");

    if (!settings) {
      // Create default settings if none exist
      const defaultSettings = {
        maintenanceMode: false,
        maintenanceMessage: "We're currently performing maintenance. Please check back soon."
      };
      this.siteSettings.set("settings", defaultSettings);
      return defaultSettings;
    }

    return settings;
  }

  async updateSiteSettings(settings: any): Promise<void> {
    this.siteSettings.set("settings", { ...this.siteSettings.get("settings"), ...settings });
  }

  async toggleMaintenanceMode(): Promise<void> {
    const currentSettings = this.siteSettings.get("settings");
    if (currentSettings) {
      currentSettings.maintenanceMode = !currentSettings.maintenanceMode;
      this.siteSettings.set("settings", currentSettings);
    }
  }
}

export const storage = new MemStorage();