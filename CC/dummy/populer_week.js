const express = require('express');
const app = express();

// Dummy data untuk buku populer minggu ini
const popularWeek = [
  {
    "book_title": "The Great Adventure",
    "authors": "John Doe",
    "genre": "Adventure",
    "publisher": "Adventure Press",
    "price": "$15.99",
    "average_rating": 4.5,
    "rating_count": 1500,
    "image": "https://example.com/images/adventure_book.jpg",
    "preview_link": "https://example.com/book/1",
    "info_link": "https://example.com/book/1/info"
  },
  {
    "book_title": "Mystery at Midnight",
    "authors": "Jane Smith",
    "genre": "Mystery",
    "publisher": "Mystery Books",
    "price": "$12.99",
    "average_rating": 4.3,
    "rating_count": 1200,
    "image": "https://example.com/images/mystery_book.jpg",
    "preview_link": "https://example.com/book/2",
    "info_link": "https://example.com/book/2/info"
  },
  {
    "book_title": "Love Lost",
    "authors": "Emma Brown",
    "genre": "Romance",
    "publisher": "Love Press",
    "price": "$10.99",
    "average_rating": 4.7,
    "rating_count": 1000,
    "image": "https://example.com/images/romance_book.jpg",
    "preview_link": "https://example.com/book/3",
    "info_link": "https://example.com/book/3/info"
  },
  {
    "book_title": "Tech Tomorrow",
    "authors": "Samuel Lee",
    "genre": "Technology",
    "publisher": "Tech Books",
    "price": "$18.99",
    "average_rating": 4.0,
    "rating_count": 800,
    "image": "https://example.com/images/tech_book.jpg",
    "preview_link": "https://example.com/book/4",
    "info_link": "https://example.com/book/4/info"
  },
  {
    "book_title": "Health Hacks",
    "authors": "Sarah Johnson",
    "genre": "Health",
    "publisher": "Health Books",
    "price": "$14.99",
    "average_rating": 4.2,
    "rating_count": 950,
    "image": "https://example.com/images/health_book.jpg",
    "preview_link": "https://example.com/book/5",
    "info_link": "https://example.com/book/5/info"
  },
  {
    "book_title": "The Silent Observer",
    "authors": "Michael White",
    "genre": "Suspense",
    "publisher": "Suspense Press",
    "price": "$13.99",
    "average_rating": 4.6,
    "rating_count": 1800,
    "image": "https://example.com/images/suspense_book.jpg",
    "preview_link": "https://example.com/book/6",
    "info_link": "https://example.com/book/6/info"
  },
  {
    "book_title": "Dark Secrets",
    "authors": "Alice Green",
    "genre": "Horror",
    "publisher": "Horror Books",
    "price": "$17.99",
    "average_rating": 4.1,
    "rating_count": 1300,
    "image": "https://example.com/images/horror_book.jpg",
    "preview_link": "https://example.com/book/7",
    "info_link": "https://example.com/book/7/info"
  },
  {
    "book_title": "Time Traveler's Diary",
    "authors": "George Smith",
    "genre": "Time Travel",
    "publisher": "Time Books",
    "price": "$20.99",
    "average_rating": 4.8,
    "rating_count": 2000,
    "image": "https://example.com/images/time_travel_book.jpg",
    "preview_link": "https://example.com/book/8",
    "info_link": "https://example.com/book/8/info"
  },
  {
    "book_title": "Deep Sea Exploration",
    "authors": "David Bell",
    "genre": "Science",
    "publisher": "Science Press",
    "price": "$22.99",
    "average_rating": 4.4,
    "rating_count": 1100,
    "image": "https://example.com/images/science_book.jpg",
    "preview_link": "https://example.com/book/9",
    "info_link": "https://example.com/book/9/info"
  },
  {
    "book_title": "Wild Adventures",
    "authors": "Nancy Grey",
    "genre": "Adventure",
    "publisher": "Adventure Press",
    "price": "$19.99",
    "average_rating": 4.7,
    "rating_count": 1500,
    "image": "https://example.com/images/adventure_book_2.jpg",
    "preview_link": "https://example.com/book/10",
    "info_link": "https://example.com/book/10/info"
  }
];

// API route untuk mendapatkan buku populer minggu ini
const popular_week = async (req, res) => {
  res.json({
    "Popular this week": popularWeek
  });
};

module.exports = { popular_week };