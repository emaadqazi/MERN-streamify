import User from "../models/Users.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;
        const recommendedUsers = await User.find({
            $and: [
                {_id: {$ne: currentUserId}}, // excludes the current user 
                {_id: {$nin: currentUser.friends}}, // exclude current user's friends
                {isOnBoarded: true} 
            ]
        })
        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.error("Error in getRecommendedUsers controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user.id).select("friends")
        .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error in getMyFriends controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export async function sendFriendRequest(req, res) {
    try {
        const myId = req.user.id;
        const { id:recipientId} = req.params
        // Prevent sending request to myself
        if (myId === recipientId) {
            return res.status(400).json({message: "You can't send a friend request to yourself"});
        }

        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({message: "Recipient not found"});
        }

        if (recipient.friends.includes(myId)) {
            return res.status(400).json({message: "You are already friends with this user"});
        }

        // Check if a request already exists 

        const existingRequest = await FriendRequest.findOne({
            $or: [
                {sender: myId, recipient: recipientId},
                {sender: recipientId, recipient: myId}

            ],
        });

        if (existingRequest) {
            return res.status(400).json({message: "A friend request already exists between you and the user."})
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });

        res.status(201).json({friendRequest});

    } catch (error) {
        console.error("Error in sendFriendRequest controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export async function acceptFriendRequest (req, res) {
    try {
        const {id:requestId} = req.params 

        const friendRequest = await FriendRequest.findById(requestId);

        // Trying to access friend that DNE
        if (!friendRequest) {
            return res.status(404).json({message: "Friend request not found"})
        }

        // Error check 
        if (friendRequest.recipient.toString() != req.user.id) {
            return res.status(404).json({message: "You are not authorized to accept this request"})
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        // Add each user to the other party's friends array
        // $addToSet: adds element to an array if it DNE
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient },
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender },
        });

        res.status(200).json({message: "Friend request accepted"})

    } catch (error) {
        console.log("Error in acceptFriendRequest controller", error.message);
        res.status(500).json({message: "Internal Server Error"})
    }
}

export async function getFriendRequest (req, res) {
    try {
        const incomingRequests = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending",
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

        const acceptedRequests = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted",
        }).populate("recipient", "fullName profilePic");

    } catch (error) {
        console.log("Error in getPendingFriendRequests controller", error.messsage);
        res.status(500).json({message: "Internal Server Error"});
    }
}
 export async function outgoingFriendRequests (req, res) {
    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id, 
            status: "pending",
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(outgoingRequests);

    } catch (error) {
        console.log("Error in outgoingFriendRequests controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    } 
 }