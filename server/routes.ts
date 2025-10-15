import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertSkillSchema, insertUserSchema, loginSchema, insertBlogPostSchema, insertCommentSchema } from "@shared/schema";
import "./types";
import { registerRssRoutes } from "./routes/rss";
import { registerSitemapRoutes } from "./routes/sitemap";

// Maintenance mode middleware
async function checkMaintenanceMode(req: any, res: any, next: any) {
  // Skip maintenance check for auth endpoints, admin settings, and public settings
  if (req.path.startsWith('/api/auth') || req.path === '/api/admin/settings' || req.path === '/api/settings') {
    return next();
  }

  const settings = await storage.getSiteSettings();

  if (settings.maintenanceMode) {
    // Allow admin to bypass maintenance mode
    if (req.session.userId) {
      const user = await storage.getUser(req.session.userId);
      if (user?.role === 'admin') {
        return next();
      }
    }
    return res.status(503).json({
      error: "Site is under maintenance",
      message: settings.maintenanceMessage || "We're currently performing maintenance. Please check back soon."
    });
  }

  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply maintenance mode check globally
  app.use(checkMaintenanceMode);

  // Middleware to check if user is admin
  const requireAdmin = async (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }

    next();
  };

  // Middleware to check if user is at least editor
  const requireEditor = async (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user || !['admin', 'editor'].includes(user.role)) {
      return res.status(403).json({ error: "Editor access required" });
    }

    next();
  };

  // Middleware to check if user can create posts
  const requireAuthor = async (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user || !['admin', 'editor', 'author'].includes(user.role)) {
      return res.status(403).json({ error: "Author access required" });
    }

    if (user.isBanned) {
      return res.status(403).json({ error: "Your account has been banned" });
    }

    if (!user.canPost) {
      return res.status(403).json({ error: "Posting disabled for your account" });
    }

    next();
  };

  // Middleware to check if user is banned or muted
  const checkUserStatus = async (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return next(); // Not logged in is OK for public routes
    }

    const user = await storage.getUser(req.session.userId);
    if (user?.isBanned) {
      return res.status(403).json({ error: "Your account has been banned" });
    }

    next();
  };


  // Authentication Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(validatedData.email);

      if (existingEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const user = await storage.createUser(validatedData);
      req.session.userId = user.id;
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid registration data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const user = await storage.verifyPassword(username, password);

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.userId = user.id;
      const { password: _, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      res.status(400).json({ error: "Invalid login data" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password, ...safeUser } = user;
    res.json(safeUser);
  });

  // Blog Posts Routes
  app.get("/api/blog/posts", async (req, res) => {
    try {
      const publishedOnly = req.query.published !== 'false';
      const posts = await storage.getAllPosts(publishedOnly);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch posts" });
    }
  });

  app.get("/api/blog/posts/:id", async (req, res) => {
    try {
      // Try to get post by ID first, then by slug
      let post = await storage.getPost(req.params.id);
      if (!post) {
        post = await storage.getPostBySlug(req.params.id);
      }
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch post" });
    }
  });

  app.post("/api/blog/posts", requireAuthor, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);

      const validatedData = insertBlogPostSchema.parse({
        ...req.body,
        authorId: req.session.userId
      });

      // Authors and non-admins/editors need to set status to pending_review
      if (user!.role === 'author') {
        validatedData.status = 'pending_review';
        validatedData.published = false;
      } else if (['admin', 'editor'].includes(user!.role)) {
        // Admins and editors can publish directly
        validatedData.status = validatedData.published ? 'published' : 'draft';
      }

      const post = await storage.createPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ error: "Invalid post data" });
    }
  });

  app.patch("/api/blog/posts/:id", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      const post = await storage.getPost(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Admin and editors can edit any post
      // Authors can only edit their own posts
      if (user.role !== 'admin' && user.role !== 'editor' && post.authorId !== req.session.userId) {
        return res.status(403).json({ error: "Not authorized" });
      }

      const updated = await storage.updatePost(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: "Failed to update post" });
    }
  });

  app.delete("/api/blog/posts/:id", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      const post = await storage.getPost(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Admin can delete any post, others can only delete their own
      if (user.role !== 'admin' && post.authorId !== req.session.userId) {
        return res.status(403).json({ error: "Not authorized" });
      }

      await storage.deletePost(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete post" });
    }
  });

  // Comments Routes
  app.get("/api/blog/posts/:id/comments", async (req, res) => {
    try {
      const comments = await storage.getCommentsByPost(req.params.id);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  app.post("/api/blog/posts/:id/comments", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const user = await storage.getUser(req.session.userId);
      if (user?.isBanned) {
        return res.status(403).json({ error: "Your account has been banned" });
      }

      if (user?.isMuted) {
        return res.status(403).json({ error: "Your account has been muted" });
      }

      const validatedData = insertCommentSchema.parse({
        ...req.body,
        postId: req.params.id,
        authorId: req.session.userId
      });
      const comment = await storage.createComment(validatedData);
      res.status(201).json(comment);
    } catch (error) {
      res.status(400).json({ error: "Invalid comment data" });
    }
  });

  // Stars Routes
  app.post("/api/blog/posts/:id/star", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const result = await storage.toggleStar(req.params.id, req.session.userId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to toggle star" });
    }
  });

  app.get("/api/blog/posts/:id/star", async (req, res) => {
    try {
      const count = await storage.getStarCount(req.params.id);
      const starred = req.session.userId
        ? await storage.hasUserStarred(req.params.id, req.session.userId)
        : false;
      res.json({ count, starred });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch star status" });
    }
  });

  // View tracking
  app.post("/api/blog/posts/:id/view", async (req, res) => {
    try {
      await storage.incrementViews(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to track view" });
    }
  });

  // Projects Routes
  app.get("/api/projects", async (_req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ error: "Invalid project data" });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.updateProject(req.params.id, req.body);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(400).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProject(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // User Profile Routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const { password, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Skills Routes
  app.get("/api/skills", async (_req, res) => {
    try {
      const skills = await storage.getAllSkills();
      res.json(skills);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch skills" });
    }
  });

  app.get("/api/skills/:id", async (req, res) => {
    try {
      const skill = await storage.getSkill(req.params.id);
      if (!skill) {
        return res.status(404).json({ error: "Skill not found" });
      }
      res.json(skill);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch skill" });
    }
  });

  app.post("/api/skills", async (req, res) => {
    try {
      const validatedData = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill(validatedData);
      res.status(201).json(skill);
    } catch (error) {
      res.status(400).json({ error: "Invalid skill data" });
    }
  });

  app.patch("/api/skills/:id", async (req, res) => {
    try {
      const skill = await storage.updateSkill(req.params.id, req.body);
      if (!skill) {
        return res.status(404).json({ error: "Skill not found" });
      }
      res.json(skill);
    } catch (error) {
      res.status(400).json({ error: "Failed to update skill" });
    }
  });

  app.delete("/api/skills/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteSkill(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Skill not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete skill" });
    }
  });

  // Admin Routes
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.delete("/api/admin/comments/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteComment(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete comment" });
    }
  });

  app.get("/api/admin/settings", requireAdmin, async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/admin/settings", requireAdmin, async (req, res) => {
    try {
      const settings = await storage.updateSiteSettings(req.body);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // Admin - User Management
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.patch("/api/admin/users/:id/role", requireAdmin, async (req, res) => {
    try {
      const { role } = req.body;
      if (!['admin', 'editor', 'author', 'reader'].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }
      const user = await storage.updateUserRole(req.params.id, role);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user role" });
    }
  });

  app.patch("/api/admin/users/:id/ban", requireAdmin, async (req, res) => {
    try {
      const { isBanned } = req.body;
      const user = await storage.toggleUserBan(req.params.id, isBanned);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user ban status" });
    }
  });

  app.patch("/api/admin/users/:id/mute", requireAdmin, async (req, res) => {
    try {
      const { isMuted } = req.body;
      const user = await storage.toggleUserMute(req.params.id, isMuted);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user mute status" });
    }
  });

  app.patch("/api/admin/users/:id/posting", requireAdmin, async (req, res) => {
    try {
      const { canPost } = req.body;
      const user = await storage.toggleUserPosting(req.params.id, canPost);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user posting permission" });
    }
  });

  // Admin - Announcements
  app.get("/api/announcements", async (req, res) => {
    try {
      const activeOnly = req.query.active === 'true';
      const announcements = await storage.getAllAnnouncements(activeOnly);
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch announcements" });
    }
  });

  app.get("/api/announcements/:id", async (req, res) => {
    try {
      const announcement = await storage.getAnnouncement(req.params.id);
      if (!announcement) {
        return res.status(404).json({ error: "Announcement not found" });
      }
      res.json(announcement);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch announcement" });
    }
  });

  // Public settings endpoint (for checking maintenance mode, etc)
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      // Only return safe public fields
      const publicSettings = {
        maintenanceMode: settings.maintenanceMode,
        maintenanceMessage: settings.maintenanceMessage,
        siteTitle: settings.siteTitle,
        siteDescription: settings.siteDescription,
        siteLogo: settings.siteLogo,
        favicon: settings.favicon,
        ogImage: settings.ogImage,
        footerMessage: settings.footerMessage
      };
      res.json(publicSettings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/admin/announcements", requireAdmin, async (req, res) => {
    try {
      const announcement = await storage.createAnnouncement(req.body);
      res.status(201).json(announcement);
    } catch (error) {
      res.status(400).json({ error: "Failed to create announcement" });
    }
  });

  app.patch("/api/admin/announcements/:id", requireAdmin, async (req, res) => {
    try {
      const announcement = await storage.updateAnnouncement(req.params.id, req.body);
      if (!announcement) {
        return res.status(404).json({ error: "Announcement not found" });
      }
      res.json(announcement);
    } catch (error) {
      res.status(400).json({ error: "Failed to update announcement" });
    }
  });

  app.delete("/api/admin/announcements/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteAnnouncement(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete announcement" });
    }
  });

  // Admin - Post Status Management
  app.patch("/api/admin/posts/:id/status", requireAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const validStatuses = ['draft', 'pending_review', 'approved', 'published', 'rejected'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      const post = await storage.updatePostStatus(req.params.id, status);
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to update post status" });
    }
  });

  // Register RSS feed routes
  registerRssRoutes(app);
  
  // Register sitemap routes
  registerSitemapRoutes(app);

  const httpServer = createServer(app);

  return httpServer;
}