const db = require("../config/db");
const bcrypt = require("bcryptjs");

const userCollection = db.collection("users");

exports.createUser = async (req, res) => {
  const { id, email, username, firstName, lastName, level } = req.body;

  if (!id || !email || !firstName || !lastName || !level) {
    return res.status(400).send({ message: "All fields are required" });
  }

  const isEmailExist = await userCollection.where("email", "==", email).get();
  const isUsernameExist = await userCollection.where("username", "==", username).get();

  if (!isEmailExist.empty) {
    return res.status(400).send({ message: "Email already exists" });
  }

  if (!isUsernameExist.empty) {
    return res.status(400).send({ message: "Username already exists" });
  }

  try {
    const newUser = {
      id,
      email,
      username,
      firstName,
      lastName,
      level: level || "beginner",
      createdAt: new Date().toISOString(),
    };

    const docRef = await userCollection.doc(id).set(newUser);
    res.status(201).send({ id: docRef.id, ...newUser });
  } catch (error) {
    res.status(500).send({ message: "Error creating user", error });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users
    const userResponse = await userCollection.get();
    const userDocs = userResponse.docs;

    // Fetch all scores
    const scoresResponse = await db.collection("scores").get();
    const scoresMap = {};
    scoresResponse.forEach((doc) => {
      scoresMap[doc.id] = doc.data().score || 0;
      
    });

    // Combine users with scores
    const responseArray = userDocs.map((userDoc) => {
      const userData = userDoc.data();
      const userId = userDoc.id; // user ID is the doc ID
      const { password, ...safeUserData } = userData 
      return {
        id: userId,
        ...safeUserData,
        score: scoresMap[userId] || 0, // Default to 0 if no score for the said user exists
      };
    });

    res.status(200).send(responseArray);
  } catch (error) {
    res.status(500).send({ message: "Error fetching users", error });
  }
};

exports.getUsersbyID = async (req, res) => {
  const id = req.user;

  try {
    // Fetch user by ID
    const userDoc = await userCollection.doc(id).get();

    if (!userDoc.exists) {
      return res.status(404).send({ message: "User not found" });
    }

    const userData = userDoc.data();
    const { password, ...safeUserData } = userData 

    // Fetch the score for the user
    const scoreDoc = await db.collection("scores").doc(id).get();
    const score = scoreDoc.exists ? scoreDoc.data().score || 0 : 0;

    // Return combined data
    res.status(200).send({ id, ...safeUserData, score });
  } catch (error) {
    res.status(500).send({ message: "Error fetching user", error });
  }
};

exports.updateUser = async(req, res) => {
  const id = req.user;
  const updates = req.body;

  try {
    await userCollection.doc(id).update(updates);
    res.status(200).send({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error updating user", error });
  }
}

exports.deleteUser = async(req, res) => {
  const { id } = req.params;

  try {
    await userCollection.doc(id).delete();
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting user", error });
  }
}

exports.getUserEmail= async (req, res) => {
  try {
    const { username } = req.params;

    const hasUsername = await userCollection.where("username", "==", username).get();
    if (hasUsername.empty) {
      return res.status(404).send({ message: "User not found" });
    }

    const userEmail = userResponse.docs[0].data().email;
    if (!userEmail) {
      return res.status(404).send({ message: "Email not found" });
    }
    
    res.status(200).send(userEmail);
  } catch (error) {
    res.status(500).send({ message: "Error fetching user", error });
  }
}