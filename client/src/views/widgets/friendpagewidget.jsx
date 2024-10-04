import { useState } from 'react';
import { Button, Input, Avatar } from "@mui/material";
import { Search, UserPlus, Check } from "lucide-react";

const suggestedFriends = [
  { id: 1, name: "Jane Doe", mutualFriends: 5, avatarUrl: "/placeholder.svg?height=40&width=40" },
  { id: 2, name: "John Smith", mutualFriends: 3, avatarUrl: "/placeholder.svg?height=40&width=40" },
  { id: 3, name: "Alice Johnson", mutualFriends: 7, avatarUrl: "/placeholder.svg?height=40&width=40" },
  { id: 4, name: "Bob Williams", mutualFriends: 2, avatarUrl: "/placeholder.svg?height=40&width=40" },
];

export default function FriendPageWidget() {
  const [searchQuery, setSearchQuery] = useState("");
  const [friendRequests, setFriendRequests] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const handleAddFriend = (friendId) => {
    if (!friendRequests.includes(friendId)) {
      setFriendRequests([...friendRequests, friendId]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Find Friends</h1>
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <Input
          type="text"
          placeholder="Search for friends"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit">
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </form>
      <h2 className="text-2xl font-semibold mb-4">People You May Know</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {suggestedFriends.map((friend) => (
          <div key={friend.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
            <div className="flex items-center">
              <Avatar src={friend.avatarUrl} alt={friend.name} className="h-12 w-12 mr-4" />
              <div>
                <h3 className="font-semibold">{friend.name}</h3>
                <p className="text-sm text-gray-500">{friend.mutualFriends} mutual friends</p>
              </div>
            </div>
            <Button
              variant={friendRequests.includes(friend.id) ? "secondary" : "default"}
              onClick={() => handleAddFriend(friend.id)}
              disabled={friendRequests.includes(friend.id)}
            >
              {friendRequests.includes(friend.id) ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> Added
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" /> Add Friend
                </>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
