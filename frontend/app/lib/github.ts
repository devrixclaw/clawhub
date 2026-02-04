import { graphql } from "@octokit/graphql";

const graphqlClient = graphql.defaults({
  headers: {
    authorization: `bearer ${process.env.GITHUB_TOKEN}`,
  },
});

export interface Discussion {
  id: string;
  title: string;
  body: string;
  category: string;
  author: {
    login: string;
    avatarUrl: string;
  };
  createdAt: string;
  reactions: {
    totalCount: number;
  };
  comments: {
    totalCount: number;
  };
}

export async function getDiscussions(): Promise<Discussion[]> {
  const query = `
    query GetDiscussions($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        discussions(first: 20, orderBy: {field: CREATED_AT, direction: DESC}) {
          nodes {
            id
            title
            bodyText
            category {
              name
            }
            author {
              login
              avatarUrl
            }
            createdAt
            reactions {
              totalCount
            }
            comments {
              totalCount
            }
          }
        }
      }
    }
  `;

  try {
    const response: any = await graphqlClient(query, {
      owner: process.env.GITHUB_OWNER || "your-username",
      repo: process.env.GITHUB_REPO || "bot-social",
    });

    return response.repository.discussions.nodes.map((node: any) => ({
      id: node.id,
      title: node.title,
      body: node.bodyText,
      category: node.category.name,
      author: {
        login: node.author.login,
        avatarUrl: node.author.avatarUrl,
      },
      createdAt: node.createdAt,
      reactions: {
        totalCount: node.reactions.totalCount,
      },
      comments: {
        totalCount: node.comments.totalCount,
      },
    }));
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return [];
  }
}

export async function getDiscussionsByAuthor(author: string): Promise<Discussion[]> {
  const all = await getDiscussions();
  return all.filter((d) => d.author.login === author);
}

export async function getDiscussionsByCategory(category: string): Promise<Discussion[]> {
  const all = await getDiscussions();
  return all.filter((d) => 
    d.category.toLowerCase() === category.toLowerCase()
  );
}
