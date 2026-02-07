import { Request, Response } from "express";

interface InstagramPost {
  id: string;
  image_url: string;
  caption?: string;
  likes?: number;
  comments?: number;
  url: string;
  timestamp?: string;
}

export async function handleInstagramPosts(
  _req: Request,
  res: Response
): Promise<void> {
  const instagramUsername = "otofinansglobal";
  const fallbackPosts: InstagramPost[] = [];

  try {
    // Fetch from Instagram's public JSON endpoint
    // This endpoint returns GraphQL data for the public profile
    const url = `https://www.instagram.com/${instagramUsername}/?__a=1&__d=dis`;

    const response = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      console.log(`Instagram public endpoint returned status ${response.status}`);
      res.json(fallbackPosts);
      return;
    }

    const data = await response.json();

    // Navigate the GraphQL response structure
    // Path: user > edge_owner_to_timeline_media > edges
    const timelineEdges = data?.data?.user?.edge_owner_to_timeline_media?.edges;

    if (timelineEdges && Array.isArray(timelineEdges)) {
      const posts: InstagramPost[] = timelineEdges
        .slice(0, 6) // Get only the latest 6 posts
        .map((edge: any) => {
          const node = edge.node;
          return {
            id: node.id,
            image_url: node.display_url,
            caption: node.edge_media_to_caption?.edges?.[0]?.node?.text || "",
            likes: node.edge_liked_by?.count || node.edge_media_preview_like?.count || 0,
            comments: node.edge_media_to_comment?.count || 0,
            url: `https://www.instagram.com/p/${node.shortcode}/`,
            timestamp: new Date(node.taken_at_timestamp * 1000).toISOString(),
          };
        });

      console.log(`✓ Instagram public API: Fetched ${posts.length} posts from @${instagramUsername}`);
      res.json(posts);
    } else {
      console.log("⚠ Instagram public API: Could not find timeline data in response");
      res.json(fallbackPosts);
    }
  } catch (error) {
    console.log(
      "Instagram public API fetch failed:",
      error instanceof Error ? error.message : error
    );
    console.log("This might be due to:");
    console.log("  - Instagram rate-limiting (try again in a few minutes)");
    console.log("  - Private Instagram account");
    console.log("  - Instagram blocking the request");
    res.json(fallbackPosts);
  }
}
