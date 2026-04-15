import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase client for server-side operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper function to validate and get user from access token
async function authenticateUser(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return { user: null, error: 'No authorization token provided' };
  }

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    console.error('Authentication error while validating user token:', error);
    return { user: null, error: 'Invalid or expired token' };
  }

  return { user, error: null };
}

// Input validation and sanitization helpers
function sanitizeString(input: string): string {
  return input.trim().slice(0, 1000); // Limit length to prevent abuse
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  return { valid: true };
}

// Health check endpoint
app.get("/make-server-7bfbe619/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint
app.post("/make-server-7bfbe619/auth/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    // Validate input
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    if (!validateEmail(email)) {
      return c.json({ error: 'Invalid email format' }, 400);
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return c.json({ error: passwordValidation.message }, 400);
    }

    const sanitizedName = sanitizeString(name);
    if (sanitizedName.length < 2) {
      return c.json({ error: 'Name must be at least 2 characters long' }, 400);
    }

    // Create user
    const { data, error } = await supabase.auth.admin.createUser({
      email: email.toLowerCase().trim(),
      password,
      user_metadata: { name: sanitizedName },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error('Error creating user during signup:', error);
      return c.json({ error: error.message }, 400);
    }

    // Initialize user progress in KV store
    const userId = data.user.id;
    const initialProgress = {
      completedLessons: [],
      points: 0,
      streak: 0,
      lastVisit: new Date().toISOString(),
      perfectScores: 0,
      lessonScores: {},
      earnedAchievements: [],
      userName: sanitizedName,
      userId
    };

    await kv.set(`user_progress:${userId}`, initialProgress);

    return c.json({ 
      success: true, 
      user: { 
        id: data.user.id, 
        email: data.user.email,
        name: sanitizedName 
      } 
    });
  } catch (error) {
    console.error('Unexpected error during signup:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Get user progress endpoint (requires authentication)
app.get("/make-server-7bfbe619/progress", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  
  if (error || !user) {
    return c.json({ error: error || 'Unauthorized' }, 401);
  }

  try {
    const progress = await kv.get(`user_progress:${user.id}`);
    
    if (!progress) {
      // Initialize if doesn't exist
      const initialProgress = {
        completedLessons: [],
        points: 0,
        streak: 0,
        lastVisit: new Date().toISOString(),
        perfectScores: 0,
        lessonScores: {},
        earnedAchievements: [],
        userName: user.user_metadata?.name || 'User',
        userId: user.id
      };
      await kv.set(`user_progress:${user.id}`, initialProgress);
      return c.json({ progress: initialProgress });
    }

    return c.json({ progress });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return c.json({ error: 'Failed to fetch progress' }, 500);
  }
});

// Update user progress endpoint (requires authentication)
app.post("/make-server-7bfbe619/progress", async (c) => {
  const { user, error } = await authenticateUser(c.req.raw);
  
  if (error || !user) {
    return c.json({ error: error || 'Unauthorized' }, 401);
  }

  try {
    const body = await c.req.json();
    const { progress } = body;

    if (!progress) {
      return c.json({ error: 'Progress data is required' }, 400);
    }

    // Validate progress data structure
    if (typeof progress.points !== 'number' || progress.points < 0) {
      return c.json({ error: 'Invalid points value' }, 400);
    }

    if (!Array.isArray(progress.completedLessons)) {
      return c.json({ error: 'Invalid completed lessons format' }, 400);
    }

    // Ensure user can only update their own progress
    progress.userId = user.id;

    await kv.set(`user_progress:${user.id}`, progress);
    return c.json({ success: true, progress });
  } catch (error) {
    console.error('Error updating user progress:', error);
    return c.json({ error: 'Failed to update progress' }, 500);
  }
});

// Get leaderboard endpoint (public, but sanitized)
app.get("/make-server-7bfbe619/leaderboard", async (c) => {
  try {
    const allProgress = await kv.getByPrefix('user_progress:');
    
    // Sort by points and take top 100 to prevent abuse
    const leaderboard = allProgress
      .map((item: any) => ({
        userName: sanitizeString(item.userName || 'Anonymous'),
        points: Math.max(0, Math.floor(item.points || 0)),
        streak: Math.max(0, Math.floor(item.streak || 0)),
        completedLessons: Math.max(0, Math.floor(item.completedLessons?.length || 0))
      }))
      .sort((a: any, b: any) => b.points - a.points)
      .slice(0, 100);

    return c.json({ leaderboard });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return c.json({ error: 'Failed to fetch leaderboard' }, 500);
  }
});

Deno.serve(app.fetch);