const path = require(`path`)
const _ = require(`lodash`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  const categoryPage = path.resolve(`./src/templates/category-page.js`)
  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const tagPage = path.resolve("src/templates/tag-page.js")

  // fetch category info
  const categoryInfo = await graphql(
    `
      {
        site {
          siteMetadata {
            categories {
              displayText
              name
              url
              description
              priority
              generatePage
            }
          }
        }
      }
    `
  )
  const categories = categoryInfo.data.site.siteMetadata.categories
  
  // create category pages
  categories
    .filter((category) => category.generatePage )
    .forEach((category) => {
    reporter.info('creating page - ' + category.name + ', ' + category.displayText + ', ' + category.priority)
    createPage({
      path: category.url,
      component: categoryPage,
      context: {
        categoryName: category.name,
        categoryDisplayText: category.displayText,
        categoryDescription: category.description
      }
    })
  })

  // create tags page
  const tagsResult = await graphql(`
    {
      postsRemark: allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              tags
            }
          }
        }
      }
      tagsGroup: allMarkdownRemark {
        group(field: frontmatter___tags) {
          fieldValue
        }
      }
    }
  `)

  // handle errors
  if (tagsResult.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  // Make tag pages
  tagsResult.data.tagsGroup.group.forEach(tag => {
    createPage({
      path: `/tags/${_.kebabCase(tag.fieldValue)}/`,
      component: tagPage,
      context: {
        tag: tag.fieldValue,
      },
    })
  })

  // Query posts for each category
  // This is because we want to have prev & next post in the same category
  for (let index = 0; index < categories.length; index++) {
    reporter.info('fetching posts under a category ' + categories[index].name)
    const result = await graphql(
        `
          query postQuery ($category: String!){
            allMarkdownRemark(
              sort: { fields: [frontmatter___date], order: ASC }
              filter: {frontmatter: {draft: {ne: true}, category: {eq: $category}}}
              limit: 1000
            ) {
              nodes {
                id
                fields {
                  slug
                }
              }
            }
          }
        `
    , { category: categories[index].name })

    if (result.errors) {
      reporter.panicOnBuild(
        `There was an error loading your blog posts`,
        result.errors
      )
      return
    }

    const posts = result.data.allMarkdownRemark.nodes

    // Create blog posts pages
    if (posts.length > 0) {
      posts.forEach((post, index) => {
        const previousPostId = index === 0 ? null : posts[index - 1].id
        const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id

        createPage({
          path: post.fields.slug,
          component: blogPost,
          context: {
            id: post.id,
            previousPostId,
            nextPostId,
          },
        })
      })
    }
  }
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const category = node.frontmatter.category
    const path = createFilePath({ node, getNode })
    const value = `/` + category + path

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
      categories: [Category]
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type Category {
      name: String
      url: String
      displayText: String
      description: String
      priority: Int
      generatePage: Boolean
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      category: String
      description: String
      date: Date @dateformat
      updated: Date @dateformat
      tags: [String]
      draft: Boolean
    }

    type Fields {
      slug: String
    }
  `)
}
