const express = require("express");
const db = require("../config/db");
const axios = require("axios");
const userCollection = db.collection("users");

/**
 * Middleware for cheat prevention
 */
const preventCheating = async (userUid, points) => {
  const scoreRef = db.collection("scores").doc(userUid);
  const snap = await scoreRef.get();
  const data = snap.exists ? snap.data() : {};

  const now = Date.now();

  // Check cool-off period
  if ((data.coolOff || now) > now) {
    throw new Error("User is in a cool-off period.");
  }

  // Manage event times
  const times = (data.eventTimes = data.eventTimes || []);
  times.push(now);
  if (times.length > 10) {
    let total = 0;
    for (let i = 1; i < times.length; i++) {
      total += times[i] - times[i - 1];
    }
    const average = total / times.length;

    // Frequent attempts logic
    if (average < 5000) {
      data.errorCount = (data.errorCount || 0) + 1;
      if (data.errorCount > 20) {
        data.coolOff = now + 1000 * 60 * 60; // 1 hour cool-off
      }
    } else {
      data.errorCount = Math.max(0, (data.errorCount || 0) - 1);
    }

    // Extremely fast attempts
    if (average < 500) {
      data.coolOff = Math.max(data.coolOff || 0, now + 1000 * 60 * 5); // 5-minute cool-off
    }

    // Block attempts with average < 1 second
    if (average < 1000) {
      throw new Error("Suspiciously fast scoring attempts detected.");
    }

    // Keep only the last 20 events
    data.eventTimes = times.slice(-20);
  }

  // Save updated data
  await scoreRef.set(data);

  return data;
};

/**
 * Initialize or get the user's scores document
 */
const initializeScoreDoc = async (userUid) => {
  const scoreRef = db.collection("scores").doc(userUid);
  const snap = await scoreRef.get();

  if (!snap.exists) {
    // Create initial score data if the document doesn't exist
    await scoreRef.set({
      score: 0,
      achievements: {},
      eventTimes: [],
      errorCount: 0,
      coolOff: null,
    });
  }
};

/**
 * Award points to the user
 */
exports.awardPoints = async (req, res) => {
  const { points = 1, achievement } = req.body;

  const userId = req.user;
  try {
    // Validate points range
    const safePoints = Math.max(0, Math.min(points, 20));

    // Initialize scores if it doesn't exist
    await initializeScoreDoc(userId);

    // Cheat prevention
    await preventCheating(userId, safePoints);

    // Award points
    const scoreRef = db.collection("scores").doc(userId);
    const snap = await scoreRef.get();
    const data = snap.exists ? snap.data() : {};

    data.score = (data.score || 0) + safePoints;

    // Add achievement if provided
    if (achievement) {
      data.achievements = data.achievements || {};
      data.achievements[achievement] = Date.now();
    }

    await scoreRef.set(data);

    res.status(200).send({ message: "Points awarded successfully.", data });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

/**
 * Add achievement to the user
 */
exports.addAchievement = async (req, res) => {
  const { points = 10, achievement } = req.body;

  const userId = req.user;

  try {
    // Validate points range
    const safePoints = Math.min(points, 50);

    // Initialize scores if it doesn't exist
    await initializeScoreDoc(userId);

    // Cheat prevention
    await preventCheating(userId, safePoints);

    // Add achievement and award points if new
    const scoreRef = db.collection("scores").doc(userId);
    const snap = await scoreRef.get();
    const data = snap.exists ? snap.data() : {};

    data.achievements = data.achievements || {};
    if (!data.achievements[achievement]) {
      data.achievements[achievement] = Date.now();
      data.score = (data.score || 0) + safePoints;
    }

    await scoreRef.set(data);

    res.status(200).send({ message: "Achievement added successfully.", data });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.getLeaderboard = async (req, res) => {
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

    // Combine users with scores and sort by score in descending order
    const leaderboard = userDocs
      .map((userDoc) => {
        const userData = userDoc.data();
        const userId = userDoc.id; // user ID is the doc ID
        return {
          id: userId,
          username: userData.email,
          score: scoresMap[userId] || 0, // Default to 0 if no score exists
        };
      })
      .sort((a, b) => b.score - a.score) // Sort by score in descending order
      .slice(0, 10); // Get the top 10 users

    res.status(200).send(leaderboard);
  } catch (error) {
    res.status(500).send({ message: "Error fetching leaderboard", error });
  }
};

const rankThresholds = [
  {
    score: 0,
    rank: 1,
    imageUrl:
      "https://storage.googleapis.com/achievement_literify/Ranked/1.png",
  },
  {
    score: 50,
    rank: 2,
    imageUrl:
      "https://storage.googleapis.com/achievement_literify/Ranked/2.png",
  },
  {
    score: 150,
    rank: 3,
    imageUrl:
      "https://storage.googleapis.com/achievement_literify/Ranked/3.png",
  },
  {
    score: 300,
    rank: 4,
    imageUrl:
      "https://storage.googleapis.com/achievement_literify/Ranked/4.png",
  },
  {
    score: 500,
    rank: 5,
    imageUrl:
      "https://storage.googleapis.com/achievement_literify/Ranked/5.png",
  },
  {
    score: 750,
    rank: 6,
    imageUrl:
      "https://storage.googleapis.com/achievement_literify/Ranked/6.png",
  },
  {
    score: 1000,
    rank: 7,
    imageUrl:
      "https://storage.googleapis.com/achievement_literify/Ranked/7.png",
  },
  {
    score: 1500,
    rank: 8,
    imageUrl:
      "https://storage.googleapis.com/achievement_literify/Ranked/8.png",
  },
  {
    score: 2000,
    rank: 9,
    imageUrl:
      "https://storage.googleapis.com/achievement_literify/Ranked/9.png",
  },
];
//check kalo udh rankup apa blm
const checkRankUp = (score) => {
  let currentRank = rankThresholds[0]; // Default to first rank
  for (let i = rankThresholds.length - 1; i >= 0; i--) {
    if (score >= rankThresholds[i].score) {
      currentRank = rankThresholds[i];
      break;
    }
  }
  return currentRank;
};

exports.incrementScore = async (req, res) => {
  const { points } = req.body;

  const userId = req.user;

  try {
    // Validate points range
    const safePoints = Math.max(0, Math.min(points, 20));

    // Initialize scores if it doesn't exist
    await initializeScoreDoc(userId);

    // Cheat prevention kek yg diatas
    await preventCheating(userId, safePoints);

    // Update score
    const scoreRef = db.collection("scores").doc(userId);
    const userRef = db.collection("users").doc(userId);
    const snap = await scoreRef.get();
    const data = snap.exists ? snap.data() : {};

    // Increment score
    data.score = (data.score || 0) + safePoints;

    // Check rank
    const newRank = checkRankUp(data.score);
    const userRank = data.rank || 1;

    let responseData = {
      score: data.score,
      rank: data.rank || userRank,
      rankUpImageUrl: data.rankUpImageUrl || null,
    };

    if (newRank.rank > userRank) {
      // kalo user ranked up
      data.rank = newRank.rank;
      data.rankUpImageUrl = newRank.imageUrl;

      const response = await axios.get(
        "https://random-word-api.herokuapp.com/word"
      );
      const randomWord = response.data[0];

      const userSnap = await userRef.get();
      const userData = userSnap.exists ? userSnap.data() : {};

      userData.achievements = userData.achievements || [];
      userData.achievements.push(randomWord);
      await userRef.set(userData, { merge: true });

      responseData.achievement = randomWord;
    }

    // Save updated data
    await scoreRef.set(data);

    // Response
    res.status(200).send({
      message: "Score incremented successfully.",
      data: responseData,
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

/**
 * Track streaks for completed books real
 */
exports.trackStreak = async (req, res) => {
  const { completedNumber } = req.body;
  const userId = req.user;

  try {
    const userRef = db.collection("users").doc(userId);
    const scoreRef = db.collection("scores").doc(userId);
    const snap = await scoreRef.get();
    const data = snap.exists ? snap.data() : {};

    const now = new Date();
    const today = now.toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

    data.points = data.points || 0; // Start points at 0 if undefined
    data.lastCompletionDate = data.lastCompletionDate || today;
    data.streak = data.streak || 0; // Start streak at 0 if undefined

    const lastCompletionDate = new Date(data.lastCompletionDate);
    const differenceInDays = Math.floor(
      (now - lastCompletionDate) / (1000 * 60 * 60 * 24)
    );

    if (differenceInDays === 1) {
      // User completed a book the next day, increase streak
      data.streak += 1;
    } else if (differenceInDays > 1) {
      // Streak is broken, reset to 1
      data.streak = 1;
    }

    data.lastCompletionDate = today;

    data.points += completedNumber;

    const userSnap = await userRef.get();
    const userData = userSnap.exists ? userSnap.data() : {};
    userData.booksRead = (userData.booksRead || 0) + completedNumber;

    await userRef.set(userData);
    await scoreRef.set(data);

    res.status(200).send({
      message: "Streak tracked successfully.",
      data: {
        points: data.points,
        streak: data.streak,
        lastCompletionDate: data.lastCompletionDate,
        booksRead: userData.booksRead,
      },
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
