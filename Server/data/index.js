import bcrypt from "bcrypt";
import mongoose from "mongoose";

// Helper function to generate hashed passwords
const generatePassword = async () => await bcrypt.hash("abc123", 10);
const hashedPassword = await generatePassword();

// Set the admin's Object ID (replace this with the actual admin's Object ID in your database)
const adminId = new mongoose.Types.ObjectId("67101f55d1efbc79a80f0776");

// Create a sample user array
export const users = [
  {
    _id: new mongoose.Types.ObjectId(),
    firstName: "Nguyễn",
    lastName: "Quốc Khánh",
    userName: "quockhanh_01",
    mobile: "0333999999",
    email: "quockhanh01@gmail.com",
    intro: "Excited to connect with new professionals!",
    gender: "male",
    birthday: new Date(1995, 3, 25),
    status: "married",
    password: hashedPassword,
    picturePath: "002129ad-fad0-4d4c-844b-38ac8bb041a7.jpg",
    location: "District 1, Ho Chi Minh City",
    occupation: "Software Engineer",
    role: "user",
    friends: [],
    friendRequestsSent: [adminId], // Each user has sent a friend request to the admin
    friendRequestsReceived: [],
    savedPosts: [],
    joinedCampaigns: [],
  },
];

// Arrays for generating diverse user data
const firstNames = ["Nguyễn", "Trần", "Phạm", "Đỗ", "Hoàng", "Lê", "Bùi", "Võ", "Dương", "Lâm"];
const lastNames = ["Văn A", "Thị B", "Minh C", "Ngọc D", "Hoàng E", "An F", "Hùng G", "Bảo H", "Khánh I", "Dũng J"];
const occupations = ["Doctor", "Engineer", "Teacher", "Designer", "Writer", "Salesperson", "Chef", "Manager", "Accountant", "Consultant"];
const locations = [
  "Old Quarter, Hanoi", "City Center, Da Nang", "Beachside, Nha Trang",
  "Citadel, Hue", "Riverside, Can Tho", "Ha Long Bay, Quang Ninh", 
  "Coastal Area, Vung Tau", "City Center, Hai Phong", "Industrial Zone, Binh Duong"
];
const intros = [
  "Looking to network with amazing people!", "Let's connect and grow together.",
  "I am passionate about my field!", "Enjoying the journey and open to new ideas.",
  "Thrilled to be here and learn more!", "Let's achieve great things together.",
  "Excited to make new friends and connections!", "Open to collaborations and opportunities.",
  "Learning something new every day!", "Hello! I am here to contribute and connect."
];

for (let i = users.length; i < 40; i++) {
  users.push({
    _id: new mongoose.Types.ObjectId(),
    firstName: firstNames[i % firstNames.length],
    lastName: lastNames[i % lastNames.length],
    userName: `user_${i}_${Math.floor(1000 + Math.random() * 9000)}`, // Unique username
    mobile: `039${i.toString().padStart(4, "0")}`, // Unique mobile number
    email: `user_${i}_${Math.floor(1000 + Math.random() * 9000)}@gmail.com`, // Unique email
    intro: intros[i % intros.length],
    gender: i % 2 === 0 ? "male" : "female",
    birthday: new Date(1990 + (i % 10), (i % 12), (i % 28 + 1)),
    status: i % 3 === 0 ? "single" : "married",
    password: hashedPassword,
    picturePath: `profile_img${i}.jpg`,
    location: locations[i % locations.length],
    occupation: occupations[i % occupations.length],
    role: i % 9 === 0 ? "assistantAdmin" : "user",
    friends: users.slice(0, i % 3).map((user) => user._id), // Randomly assign friends
    friendRequestsSent: [adminId], // All users send friend requests to admin
    friendRequestsReceived: users.slice(1, (i % 2) + 1).map((user) => user._id), // Random friend requests received
    savedPosts: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()], // Saved post IDs
    joinedCampaigns: [new mongoose.Types.ObjectId()], // Joined campaign ID
  });
}
