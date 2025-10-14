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
