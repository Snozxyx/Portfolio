
import { storage } from "./storage";

async function seed() {
  console.log("Starting database seeding...");

  // Check if admin user already exists
  const existingAdmin = await storage.getUserByUsername("admin");
  
  if (!existingAdmin) {
    // Create admin user
    const admin = await storage.createUser({
      username: "admin",
      email: "admin@example.com",
      password: "admin123", // Change this password after first login!
      displayName: "Admin User",
      role: "admin",
      canPost: true,
      isBanned: false,
      isMuted: false,
    });
    
    console.log("✅ Admin user created:", admin.username);
  } else {
    console.log("ℹ️  Admin user already exists");
  }

  // Check if site settings exist
  const settings = await storage.getSiteSettings();
  console.log("✅ Site settings initialized:", settings.siteTitle);

  console.log("Database seeding complete!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
