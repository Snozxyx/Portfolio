import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  role: text("role").notNull().default("reader"), // admin, editor, author, reader
  bio: text("bio"),
  avatar: text("avatar"),
  isBanned: boolean("is_banned").default(false).notNull(),
  canPost: boolean("can_post").default(true).notNull(),
  isMuted: boolean("is_muted").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const siteSettings = pgTable("site_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  maintenanceMode: boolean("maintenance_mode").default(false).notNull(),
  maintenanceMessage: text("maintenance_message"),
  siteTitle: text("site_title").default("Snozxyx Portfolio"),
  siteDescription: text("site_description"),
  siteLogo: text("site_logo"),
  favicon: text("favicon"),
  ogImage: text("og_image"),
  footerMessage: text("footer_message"),
  // Home page content
  homeHeroTitle: text("home_hero_title"),
  homeHeroSubtitle: text("home_hero_subtitle"),
  homeAboutText: text("home_about_text"),
  // Contact info
  contactEmail: text("contact_email"),
  contactGithub: text("contact_github"),
  contactLinkedin: text("contact_linkedin"),
  contactTwitter: text("contact_twitter"),
  // Page visibility
  showAnimePage: boolean("show_anime_page").default(true).notNull(),
  showGamesPage: boolean("show_games_page").default(true).notNull(),
  showAnimeWidget: boolean("show_anime_widget").default(true).notNull(),
  showGamesWidget: boolean("show_games_widget").default(true).notNull(),
  // Steam profile
  steamProfileId: text("steam_profile_id"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const announcements = pgTable("announcements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("info"), // info, warning, alert
  displayType: text("display_type").notNull().default("banner"), // banner, popup, notification
  isActive: boolean("is_active").default(true).notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const activityLogs = pgTable("activity_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  action: text("action").notNull(), // create, update, delete, login, logout
  entityType: text("entity_type").notNull(), // post, comment, user, project, skill
  entityId: varchar("entity_id"),
  details: text("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  techStack: text("tech_stack").array().notNull(),
  features: text("features").array().notNull(),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  imageUrl: text("image_url"),
  order: text("order").notNull(),
});

export const skills = pgTable("skills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  proficiency: text("proficiency").notNull(),
  icon: text("icon"),
});

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  authorId: varchar("author_id").notNull(),
  tags: text("tags").array().notNull().default(sql`'{}'::text[]`),
  category: text("category"),
  published: boolean("published").default(false).notNull(),
  status: text("status").notNull().default("draft"), // draft, pending_review, approved, published, rejected
  stars: integer("stars").default(0).notNull(),
  views: integer("views").default(0).notNull(),
  readTime: integer("read_time"),
  coverImage: text("cover_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  publishedAt: timestamp("published_at"),
});

export const blogComments = pgTable("blog_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull(),
  authorId: varchar("author_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const postStars = pgTable("post_stars", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull(),
  userId: varchar("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const animeEntries = pgTable("anime_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  clipUrl: text("clip_url"),
  status: text("status").notNull().default("watching"), // watching, completed, plan_to_watch
  rating: integer("rating"),
  episodes: integer("episodes"),
  notes: text("notes"),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
  stars: true,
  views: true,
}).extend({
  status: z.string().optional(),
});

export const insertCommentSchema = createInsertSchema(blogComments).omit({
  id: true,
  createdAt: true,
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAnimeSchema = createInsertSchema(animeEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateSiteSettingsSchema = createInsertSchema(siteSettings).omit({
  id: true,
  updatedAt: true,
}).partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginSchema>;
export type User = typeof users.$inferSelect;
export type SafeUser = Omit<User, 'password'>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type BlogPostWithAuthor = BlogPost & {
  author: SafeUser;
};

export type BlogComment = typeof blogComments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type CommentWithAuthor = BlogComment & {
  author: SafeUser;
};

export type PostStar = typeof postStars.$inferSelect;

export type SiteSettings = typeof siteSettings.$inferSelect;

export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;

export type AnimeEntry = typeof animeEntries.$inferSelect;
export type InsertAnime = z.infer<typeof insertAnimeSchema>;

export type ActivityLog = typeof activityLogs.$inferSelect;

export type ActivityLog = typeof activityLogs.$inferSelect;