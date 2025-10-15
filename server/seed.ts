
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

  // Seed skills if none exist
  const existingSkills = await storage.getAllSkills();
  if (existingSkills.length === 0) {
    const sampleSkills = [
      { name: "JavaScript/TypeScript", category: "Languages", proficiency: "expert", icon: null },
      { name: "Python", category: "Languages", proficiency: "advanced", icon: null },
      { name: "Java", category: "Languages", proficiency: "intermediate", icon: null },
      { name: "C++", category: "Languages", proficiency: "intermediate", icon: null },
      { name: "React", category: "Frameworks", proficiency: "expert", icon: null },
      { name: "Next.js", category: "Frameworks", proficiency: "expert", icon: null },
      { name: "Node.js", category: "Frameworks", proficiency: "expert", icon: null },
      { name: "Express", category: "Frameworks", proficiency: "advanced", icon: null },
      { name: "Git", category: "Tools", proficiency: "expert", icon: null },
      { name: "Docker", category: "Tools", proficiency: "advanced", icon: null },
      { name: "AWS", category: "Tools", proficiency: "intermediate", icon: null },
      { name: "MongoDB", category: "Tools", proficiency: "advanced", icon: null },
      { name: "Discord.js", category: "Gaming Tech", proficiency: "expert", icon: null },
      { name: "Twitch API", category: "Gaming Tech", proficiency: "advanced", icon: null },
      { name: "OBS Studio", category: "Gaming Tech", proficiency: "advanced", icon: null },
      { name: "WebRTC", category: "Gaming Tech", proficiency: "intermediate", icon: null }
    ];

    for (const skill of sampleSkills) {
      await storage.createSkill(skill);
    }
    console.log("✅ Skills seeded:", sampleSkills.length, "skills added");
  } else {
    console.log("ℹ️  Skills already exist");
  }

  console.log("Database seeding complete!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
