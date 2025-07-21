import { type BasketballStats } from "../types/basketballStats";
import { API_ENDPOINTS } from "../config/api";

// Image cache to avoid duplicate requests
const imageCache = new Map<string, string | null>();
const pendingRequests = new Map<string, Promise<string | null>>();

//fetch to backend to grab basketball stats object
export const fetchBasketballStats = async () => {
  const response = await fetch(API_ENDPOINTS.basketballStats);
  const data = await response.json();
  return data.players; 
};

export const fetchPlayerByPid = async (pid: number): Promise<BasketballStats | null> => {
  const response = await fetch(API_ENDPOINTS.basketballStats);
  const data = await response.json();
  const players: BasketballStats[] = data.players;
  
  const player = players.find((p: BasketballStats) => p.pid === pid);
  return player || null;
};

export const fetchPlayerImage = async (playerName: string): Promise<string | null> => {
  // Check cache first
  if (imageCache.has(playerName)) {
    return imageCache.get(playerName) || null;
  }

  // Check if request is already pending
  if (pendingRequests.has(playerName)) {
    return await pendingRequests.get(playerName)!;
  }

  // Create new request with timeout and error handling
  const imageRequest = async (): Promise<string | null> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(
        API_ENDPOINTS.playerImage(playerName),
        { 
          signal: controller.signal,
          headers: {
            'Cache-Control': 'max-age=3600' // Cache for 1 hour
          }
        }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const result = data.success ? data.imageUrl : null;
      
      // Cache the result
      imageCache.set(playerName, result);
      return result;
      
    } catch (error) {
      // Cache failed attempts to avoid repeated requests
      imageCache.set(playerName, null);
      
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn(`Image request timeout for ${playerName}`);
      } else {
        console.warn(`Error fetching player image for ${playerName}:`, error);
      }
      return null;
    } finally {
      // Clean up pending request
      pendingRequests.delete(playerName);
    }
  };

  // Store pending request
  const promise = imageRequest();
  pendingRequests.set(playerName, promise);
  
  return await promise;
};
