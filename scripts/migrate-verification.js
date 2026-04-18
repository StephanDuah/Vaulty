const { connectDB } = require("../lib/database");
const User = require("../lib/models/User");

async function migrateVerificationStatuses() {
  await connectDB();
  
  try {
    console.log("Starting verification status migration...");
    
    // Find users with old verification values
    const usersToUpdate = await User.find({
      verification: { $in: ["verification", "pending", "verified"] }
    });
    
    console.log(`Found ${usersToUpdate.length} users to migrate`);
    
    for (const user of usersToUpdate) {
      let newStatus = "not_verified"; // default
      
      // Check if user has professional verification data
      if (user.professionalVerification && user.professionalVerification.documents?.length > 0) {
        if (user.professionalVerification.verifiedAt) {
          newStatus = "professional_verified";
        } else {
          newStatus = "professional_pending";
        }
      } else if (user.identification) {
        if (user.verification === "verified") {
          newStatus = "id_verified";
        } else {
          newStatus = "id_pending";
        }
      }
      
      console.log(`Migrating user ${user._id}: ${user.verification} -> ${newStatus}`);
      
      await User.updateOne(
        { _id: user._id },
        { $set: { verification: newStatus } }
      );
    }
    
    console.log("Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrateVerificationStatuses();
