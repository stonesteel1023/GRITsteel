import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Nav from "../components/nav"

const CategoryPageTemplate = ({data, location, pageContext}) => {
  const seoTitle = pageContext.categoryDisplayText
  const seoDescription = pageContext.categoryDescription
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
          title={seoTitle}
          description={seoDescription}
      />
      <Nav categories={data.site.siteMetadata.categories}/>
      <hr />
      <h6 className="category-description">{pageContext.categoryDescription}</h6>

      <hr />
      <ol className="post-list" style={{ listStyle: `none` }}>
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug

          return (
            <li key={post.fields.slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <Link to={post.fields.slug} itemProp="url">
                  <span itemProp="headline">{title}</span>
                </Link>
                <time>{post.frontmatter.date}</time>
              </article>
            </li>
          )
        })}
      </ol>
    </Layout>
  )
}

export default CategoryPageTemplate

export const pageQuery = graphql`
  query BlogPostsByCategory(
    $categoryName: String!
  ) {
    site {
      siteMetadata {
        title
        categories {
          displayText
          priority
          name
          url
        }
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC } 
      filter: {frontmatter: {draft: {ne: true}, category: {eq: $categoryName}}}
    ) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMM DD, YYYY")
          title
        }
      }
    }
  }
`