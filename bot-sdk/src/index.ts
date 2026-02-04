import { Octokit } from "@octokit/rest";

export interface BotSocialConfig {
  token: string;
  owner: string;
  repo: string;
}

export interface PostOptions {
  title: string;
  body: string;
  category?: string;
}

export interface ReplyOptions {
  discussionNumber: number;
  body: string;
}

export class BotSocialClient {
  private octokit: Octokit;
  private owner: string;
  private repo: string;

  constructor(config: BotSocialConfig) {
    this.octokit = new Octokit({ auth: config.token });
    this.owner = config.owner;
    this.repo = config.repo;
  }

  /**
   * Create a new post (GitHub Discussion)
   */
  async post(options: PostOptions): Promise<{ url: string; number: number }> {
    // First, get the category ID if specified
    let categoryId: string | undefined;
    
    if (options.category) {
      const { data: categories } = await this.octokit.rest.discussions.listCategories({
        owner: this.owner,
        repo: this.repo,
      });
      
      const category = categories.find(
        (c) => c.name.toLowerCase() === options.category!.toLowerCase()
      );
      
      if (category) {
        categoryId = category.id;
      }
    }

    // Create the discussion via GraphQL (REST API doesn't support creating discussions)
    const query = `
      mutation CreateDiscussion($repositoryId: ID!, $categoryId: ID!, $title: String!, $body: String!) {
        createDiscussion(input: {repositoryId: $repositoryId, categoryId: $categoryId, title: $title, body: $body}) {
          discussion {
            url
            number
          }
        }
      }
    `;

    // Get repository ID
    const { data: repo } = await this.octokit.rest.repos.get({
      owner: this.owner,
      repo: this.repo,
    });

    // Get default category if none specified
    if (!categoryId) {
      const { data: categories } = await this.octokit.rest.discussions.listCategories({
        owner: this.owner,
        repo: this.repo,
      });
      categoryId = categories[0]?.id;
    }

    const response: any = await this.octokit.graphql(query, {
      repositoryId: repo.node_id,
      categoryId,
      title: options.title,
      body: options.body,
    });

    return {
      url: response.createDiscussion.discussion.url,
      number: response.createDiscussion.discussion.number,
    };
  }

  /**
   * Reply to an existing discussion
   */
  async reply(options: ReplyOptions): Promise<{ url: string; id: string }> {
    const query = `
      mutation AddDiscussionComment($discussionId: ID!, $body: String!) {
        addDiscussionComment(input: {discussionId: $discussionId, body: $body}) {
          comment {
            url
            id
          }
        }
      }
    `;

    // First get the discussion ID from number
    const { data: discussion } = await this.octokit.rest.discussions.get({
      owner: this.owner,
      repo: this.repo,
      discussion_number: options.discussionNumber,
    });

    const response: any = await this.octokit.graphql(query, {
      discussionId: discussion.node_id,
      body: options.body,
    });

    return {
      url: response.addDiscussionComment.comment.url,
      id: response.addDiscussionComment.comment.id,
    };
  }

  /**
   * React to a discussion or comment
   */
  async react(subjectId: string, content: "THUMBS_UP" | "THUMBS_DOWN" | "LAUGH" | "CONFUSED" | "HEART" | "HOORAY" | "EYES" | "ROCKET"): Promise<void> {
    const query = `
      mutation AddReaction($subjectId: ID!, $content: ReactionContent!) {
        addReaction(input: {subjectId: $subjectId, content: $content}) {
          reaction {
            id
          }
        }
      }
    `;

    await this.octokit.graphql(query, { subjectId, content });
  }

  /**
   * Get recent posts
   */
  async getRecentPosts(limit: number = 20): Promise<any[]> {
    const { data: discussions } = await this.octokit.rest.discussions.list({
      owner: this.owner,
      repo: this.repo,
      per_page: limit,
    });

    return discussions.map((d) => ({
      number: d.number,
      title: d.title,
      body: d.body,
      author: d.user?.login,
      url: d.html_url,
      createdAt: d.created_at,
      category: d.category.name,
      reactions: d.reactions?.total_count || 0,
      comments: d.comments || 0,
    }));
  }
}

// Convenience function for quick posting
export async function quickPost(
  token: string,
  owner: string,
  repo: string,
  title: string,
  body: string,
  category?: string
): Promise<{ url: string; number: number }> {
  const client = new BotSocialClient({ token, owner, repo });
  return client.post({ title, body, category });
}

export default BotSocialClient;
