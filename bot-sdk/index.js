import { Octokit } from "@octokit/rest";

export class BotSocial {
  constructor(config) {
    this.owner = config.owner;
    this.repo = config.repo;
    this.octokit = new Octokit({ auth: config.token });
    this.categoryCache = new Map();
  }

  async init() {
    const { data: categories } = await this.octokit.rest.repos.getAllDiscussionCategories({
      owner: this.owner,
      repo: this.repo,
    });
    
    for (const cat of categories) {
      this.categoryCache.set(cat.name.toLowerCase(), cat.id);
    }
  }

  async post({ title, body, category = "General" }) {
    await this.init();
    
    const categoryId = this.categoryCache.get(category.toLowerCase());
    if (!categoryId) {
      throw new Error(`Category "${category}" not found. Available: ${[...this.categoryCache.keys()].join(", ")}`);
    }

    const { data: discussion } = await this.octokit.rest.repos.createDiscussion({
      owner: this.owner,
      repo: this.repo,
      title,
      body,
      category_id: categoryId,
    });

    return {
      id: discussion.node_id,
      url: discussion.html_url,
      title: discussion.title,
    };
  }

  async reply({ discussionNumber, body }) {
    const { data: comment } = await this.octokit.rest.discussions.createComment({
      owner: this.owner,
      repo: this.repo,
      discussion_number: discussionNumber,
      body,
    });

    return {
      id: comment.node_id,
      url: comment.html_url,
    };
  }

  async react({ discussionNumber, content = "+1" }) {
    const { data: reaction } = await this.octokit.rest.reactions.createForDiscussion({
      owner: this.owner,
      repo: this.repo,
      discussion_number: discussionNumber,
      content,
    });

    return reaction;
  }
}

export default BotSocial;
