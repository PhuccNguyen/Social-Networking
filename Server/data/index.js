// import mongoose from 'mongoose';

// const userIds = [
//   new mongoose.Types.ObjectId(),
//   new mongoose.Types.ObjectId(),
//   new mongoose.Types.ObjectId(),
//   new mongoose.Types.ObjectId(),
//   new mongoose.Types.ObjectId(),
//   new mongoose.Types.ObjectId(),
//   new mongoose.Types.ObjectId(),
// ]

// // Generate unique ObjectIds for users
// // const userIds = Array.from({ length: 7 }, () => new mongoose.Types.ObjectId());

// export const users = [
//   {
//     _id: userIds[0],
//     firstName: "sample",
//     lastName: "me",
//     userName: "sample5555",
//     mobile: "0999934234",
//     email: "sample5555@gmail.com",
//     intro: "Wellcome my profile",
//     address: "123 Test St, Test City, TC",
//     gender: "Non-binary",
//     birthday: new Date("1999-01-01"),
//     status: "Active",
//     password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
//     picturePath: "p11.jpeg",
//     friends: [],
//     location: "San Fran, CA",
//     occupation: "Software Engineer",
//     viewedProfile: 14561,
//     impressions: 888822,
//     lastLogin: new Date(),
//     createdAt: 1115211422,
//     updatedAt: 1115211422,
//   },
//   {
//     _id: userIds[1],
//     firstName: "Steve",
//     lastName: "Ralph",
//     userName: "steveralph",
//     mobile: "0987654321",
//     email: "thataaa@gmail.com",
//     intro: "Hi! I'm Steve.",
//     address: "456 Another St, Another City, AC",
//     gender: "Male",
//     birthday: new Date("2000-05-10"),
//     status: "Active",
//     password: "$!FEAS@!O)_IDJda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
//     picturePath: "p3.jpeg",
//     friends: [],
//     location: "New York, CA",
//     occupation: "Degenerate",
//     viewedProfile: 12351,
//     impressions: 55555,
//     lastLogin: new Date(),
//     createdAt: 1115211422,
//     updatedAt: 1115211422,
//   },

//   {
//     _id: userIds[2],
//     firstName: "Alice",
//     lastName: "Wonder",
//     userName: "alicewonder",
//     mobile: "6789012345",
//     email: "alicewonder@gmail.com",
//     intro: "Hello! I'm Alice Wonder",
//     address: "456 Wonder St, Wonder City, WC",
//     gender: "Female",
//     birthday: new Date("1998-04-12"),
//     status: "Active",
//     password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
//     picturePath: "p10.jpeg",
//     friends: [],
//     location: "Wonderland, WL",
//     occupation: "Adventurer",
//     viewedProfile: 12345,
//     impressions: 98765,
//     lastLogin: new Date(),
//   },

//   {
//     _id: userIds[3],
//     firstName: "Whatcha",
//     lastName: "Doing",
//     userName: "whatchadoing",
//     mobile: "04353535345",
//     email: "whatchadoing@gmail.com",
//     intro: "Hello! I'm Whatcha Doing",
//     address: "123 Doing St, Doing City, DC",
//     gender: "Female",
//     birthday: new Date("1992-03-15"),
//     status: "Active",
//     password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
//     picturePath: "p6.jpeg",
//     friends: [],
//     location: "Korea, CA",
//     occupation: "Educator",
//     viewedProfile: 41024,
//     impressions: 55316,
//     lastLogin: new Date(),
//     createdAt: 1289897762,
//     updatedAt: 1288075389,
//   },
//   {
//     _id: userIds[4],
//     firstName: "Jane",
//     lastName: "Doe",
//     userName: "janedoe",
//     mobile: "2345678901",
//     email: "janedoe@gmail.com",
//     intro: "Hi! I'm Jane Doe",
//     address: "456 Doe St, Doe City, DC",
//     gender: "Female",
//     birthday: new Date("1995-08-25"),
//     status: "Active",
//     password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
//     picturePath: "p5.jpeg",
//     friends: [],
//     location: "Utah, CA",
//     occupation: "Hacker",
//     viewedProfile: 40212,
//     impressions: 7758,
//     lastLogin: new Date(),
//     createdAt: 1289897762,
//     updatedAt: 1288075389,
//   },
//   {
//     _id: userIds[5],
//     firstName: "Hong",
//     lastName: "Pham",
//     userName: "hongpham7077",
//     mobile: "0344445677",
//     email: "hongpham7077@gmail.com",
//     intro: "Hello! I'm Hong Pham",
//     address: "Go Vap, Ho Chi Minh City, Viet Nam",
//     gender: "Female",
//     birthday: new Date("2002-01-10"),
//     status: "Active",
//     password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
//     picturePath: "p7.jpeg",
//     friends: [],
//     location: "Los Angeles, CA",
//     occupation: "Journalist",
//     viewedProfile: 976,
//     impressions: 4658,
//     lastLogin: new Date(),
//     createdAt: 1289898992,
//     updatedAt: 1288067559,
//   },
//   {
//     _id: userIds[6],
//     firstName: "Carly",
//     lastName: "Vowel",
//     userName: "carlyvowel",
//     mobile: "4567890123",
//     email: "carlyvowel@gmail.com",
//     intro: "Hi! I'm Carly Vowel",
//     address: "012 Vowel St, Vowel City, VC",
//     gender: "Female",
//     birthday: new Date("1993-07-14"),
//     status: "Active",
//     password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
//     picturePath: "p8.jpeg",
//     friends: [],
//     location: "Chicago, IL",
//     occupation: "Nurse",
//     viewedProfile: 1510,
//     impressions: 77579,
//     lastLogin: new Date(),
//     createdAt: 4455697762,
//     updatedAt: 8674475389,
//   },

// ];

// export const posts = [
//   {
//     _id: new mongoose.Types.ObjectId(),
//     userId: userIds[1],
//     firstName: "Steve",
//     lastName: "Ralph",
//     location: "New York, CA",
//     description: "Some really long random description",
//     picturePath: "post1.jpeg",
//     UserpicturePath: "p3.jpeg",
//     createDate: new Date(),
//     status: "Published",
//     likes: new Map([
//       [userIds[0], true],
//       [userIds[2], true],
//       [userIds[3], true],
//       [userIds[4], true],
//     ]),
//     comments: [
//       "random comment",
//       "another random comment",
//       "yet another random comment",
//     ],
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     userId: userIds[3],
//     firstName: "Whatcha",
//     lastName: "Doing",
//     location: "Korea, CA",
//     description:
//       "Another really long random description. This one is longer than the previous one.",
//     picturePath: "post2.jpeg",
//     UserpicturePath: "p6.jpeg",
//     createDate: new Date(),
//     status: "Draft",
//     likes: new Map([
//       [userIds[6], true],
//       [userIds[4], true],
//       [userIds[1], true],
//       [userIds[2], true],
//     ]),
//     comments: [
//       "one more random comment",
//       "and another random comment",
//       "no more random comments",
//       "I lied, one more random comment",
//     ],
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     userId: userIds[4],
//     firstName: "Jane",
//     lastName: "Doe",
//     location: "Utah, CA",
//     description:
//       "This is the last really long random description. This one is longer than the previous one.",
//     picturePath: "post3.jpeg",
//     UserpicturePath: "p5.jpeg",
//     createDate: new Date(),
//     status: "Published",
//     likes: new Map([
//       [userIds[1], true],
//       [userIds[6], true],
//       [userIds[3], true],
//       [userIds[5], true],
//     ]),
//     comments: [
//       "one more random comment",
//       "I lied, one more random comment",
//       "I lied again, one more random comment",
//       "Why am I doing this?",
//       "I'm bored",
//     ],
//   },
// ];