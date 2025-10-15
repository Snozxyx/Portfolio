
import { storage } from "./storage";

async function seed() {
  console.log("Starting database seeding...");

  // Check if admin user already exists
  const existingAdmin = await storage.getUserByEmail("technoplayz9@gmail.com");
  
  if (!existingAdmin) {
    // Create admin user
    const admin = await storage.createUser({
      username: "Admin",
      email: "technoplayz9@gmail.com",
      password: "admins",
      displayName: "Snozxyx",
      role: "admin",
      canPost: true,
      isBanned: false,
      isMuted: false,
    });
    
    console.log("✅ Admin user created:", admin.displayName);
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
