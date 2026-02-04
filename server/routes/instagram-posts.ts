import { Request, Response } from "express";

interface InstagramPost {
  id: string;
  media_type: string;
  media_url: string;
  permalink: string;
  caption?: string;
  timestamp?: string;
}

export async function handleInstagramPosts(
  _req: Request,
  res: Response
): Promise<void> {
  // Get Instagram access token from environment
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const instagramBusinessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

  // Fallback posts (hardcoded or from cache)
  const fallbackPosts: InstagramPost[] = [];

  // If no credentials, return fallback
  if (!accessToken || !instagramBusinessAccountId) {
    console.log("⚠ Instagram credentials not configured");
    console.log("⚠ To enable Instagram feed:");
    console.log("  1. Create an Instagram App at https://developers.facebook.com/");
    console.log("  2. Get your Instagram Business Account ID");
    console.log("  3. Generate an access token");
    console.log("  4. Set INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ACCOUNT_ID environment variables");
    res.json(fallbackPosts);
    return;
  }

  try {
    // Fetch media from Instagram Graph API
    // API endpoint: GET /{business-account-id}/media
    const url = `https://graph.instagram.com/v18.0/${instagramBusinessAccountId}/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${accessToken}`;

    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.log(`Instagram API returned status ${response.status}`);
      const errorData = await response.json().catch(() => ({}));
      console.log("Instagram API error:", errorData);
      res.json(fallbackPosts);
      return;
    }

    const data = await response.json();

    if (data.data && Array.isArray(data.data)) {
      // Transform and filter posts (only keep carousel and image posts)
      const posts: InstagramPost[] = data.data
        .filter((post: any) => {
          // Include carousel and image posts
          return post.media_type === "IMAGE" || post.media_type === "CAROUSEL_ALBUM";
        })
        .map((post: any) => ({
          id: post.id,
          media_type: post.media_type,
          media_url: post.media_url,
          permalink: post.permalink,
          caption: post.caption ? post.caption.substring(0, 150) : undefined,
          timestamp: post.timestamp,
        }))
        .slice(0, 6); // Get only the latest 6 posts

      console.log(`✓ Instagram API: Fetched ${posts.length} posts`);
      res.json(posts);
    } else {
      console.log("⚠ Instagram API: No media data returned");
      res.json(fallbackPosts);
    }
  } catch (error) {
    console.log("Instagram API fetch failed:", error instanceof Error ? error.message : error);
    res.json(fallbackPosts);
  }
}
