import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getBasketballStats, getPlayerProgression } from './api';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://collegebbdevelopapp.netlify.app', // Corrected URL with 'bb'
        'https://*.netlify.app' // Allow any netlify subdomain
      ]
    : [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173'
      ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.get('/basketball-stats', async (req, res) => {
  try {
    const convertedData = await getBasketballStats();
    
    res.json({ 
      message: 'Data fetched and converted successfully', 
      totalPlayers: convertedData.length,
      sampleData: convertedData.slice(0, 5),
      players: convertedData
    });
  } catch (error) {
    console.error('Error fetching basketball stats:', error);
    res.status(500).json({ error: 'Failed to fetch basketball stats' });
  }
});

app.get('/player-image/:playerName', async (req, res) => {
  try {
    const { playerName } = req.params;
    
    // Convert player name to sports reference format
    // "Bruce Thornton" -> "bruce-thornton"
    const formattedName = playerName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '-')        // Replace spaces with hyphens
      .trim();
    
    // Sports reference URL pattern - you might need to adjust the date/ID
    const imageUrl = `https://www.sports-reference.com/req/202505131/cbb/images/players/${formattedName}-1.jpg`;
    
    // Check if image exists by making a HEAD request
    const imageResponse = await fetch(imageUrl, { method: 'HEAD' });
    
    if (imageResponse.ok) {
      res.json({ 
        success: true, 
        imageUrl: imageUrl,
        playerName: playerName 
      });
    } else {
      res.json({ 
        success: false, 
        imageUrl: null,
        playerName: playerName,
        message: 'Image not found'
      });
    }
    
  } catch (error) {
    console.error('Error fetching player image:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch player image',
      imageUrl: null 
    });
  }
});

app.get('/player-progression/:playerName', async (req, res) => {
  try {
    const { playerName } = req.params;
    const startYear = req.query.startYear ? parseInt(req.query.startYear as string) : 2022;
    
    const progression = await getPlayerProgression(playerName, startYear);
    
    res.json({ 
      success: true,
      playerName: playerName,
      progression: progression,
      totalYears: progression.length
    });
    
  } catch (error) {
    console.error('Error fetching player progression:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch player progression',
      progression: []
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});
