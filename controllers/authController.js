const db = require("../config/db");
// const jwt = require("jsonwebtoken");
const userCollection = db.collection("users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const userSnapshot = await userCollection
    .where("email", "==", email)
    .limit(1)
    .get();

  if (userSnapshot.empty) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const user = userSnapshot.docs[0].data();
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const accessToken = jwt.sign(
    {
      userInfo: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        level: user.level,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    {
      userInfo: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        level: user.level,
      },
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // Store the refresh token in Firebase
  await db.collection("refreshTokens").add({
    token: refreshToken,
    userId: user.id,
    createdAt: new Date().toISOString(),
  });

  res.status(200).send({
    message: "Welcome!",
    user: userSnapshot.docs[0].data(),
    accessToken,
    refreshToken,
  });
};

exports.refreshUserToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "No refresh token provided" });
  }

  console.log("Refresh Token:", refreshToken);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        console.log("Error Verifying Token:", err);
        return res.status(403).json({ message: "Forbidden" });
      }

      console.log("Decoded Token:", decoded);
      console.log("Querying Firestore with id:", decoded.userInfo.id);

      try {
        // Query Firestore to get the user
        const userSnapshot = await userCollection
          .where("id", "==", decoded.userInfo.id)
          .limit(1)
          .get();

        if (userSnapshot.empty) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        const user = userSnapshot.docs[0].data();

        console.log("User Found:", user);

        // Generate a new access token
        const newAccessToken = jwt.sign(
          {
            userInfo: {
              id: user.id,
              email: user.email,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              level: user.level,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "7d" }
        );

        res.json({ accessToken: newAccessToken });
      } catch (error) {
        console.error("Error processing user data:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  );
};

exports.logoutUser = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "No refresh token provided" });
  }

  try {
    // Query Firestore for the refresh token
    const refreshTokenSnapshot = await db
      .collection("refreshTokens")
      .where("token", "==", refreshToken)
      .limit(1)
      .get();

    if (!refreshTokenSnapshot.empty) {
      // Delete the token from Firestore
      const tokenDoc = refreshTokenSnapshot.docs[0];
      await tokenDoc.ref.delete();
      console.log("Refresh token invalidated:", refreshToken);
    } else {
      console.log(
        "Token not found in Firestore. It might have already expired."
      );
    }

    res.status(200).json({ message: "User successfully logged out" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
