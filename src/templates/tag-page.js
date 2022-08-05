import React from "react"
import PropTypes from "prop-types"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import Nav from "../components/nav"
import Seo from "../components/seo"

const Tags = ({ pageContext, data, location }) => {
  const { tag } = pageContext
  const { edges, totalCount } = data.allMarkdownRemark
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const tagHeader = `${totalCount} post${
    totalCount === 1 ? "" : "s"
  } tagged with "${tag}"`

  return (
    <Layout location={location} title={siteTitle}>
      <Seo 
        title={tag}
        description={tagHeader}
      />
      <Nav categories={data.site.siteMetadata.categories}/>
      <hr />
      <h6 className="tag-description">{tagHeader}</h6>
      <hr />
    
      <ol className="post-list" style={{ listStyle: `none` }}>
        {edges.map(({node}) => {
          const { slug } = node.fields
          const { title } = node.frontmatter

          return (
            <li key={slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <Link to={slug} itemProp="url">
                  <span itemProp="headline">{title}</span>
                </Link>
                <time>{node.frontmatter.date}</time>
              </article>
            </li>
          )
        })}
      </ol>

      <p></p>
      <Link to="/tags" className="all-tag-link">See all tags</Link>
    
    </Layout>
  )
}

Tags.propTypes = {
  pageContext: PropTypes.shape({
    tag: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
            }),
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
            }),
          }),
        }).isRequired
      ),
    }),
  }),
}

export default Tags

export const pageQuery = graphql`
  query($tag: String) {
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
      filter: {frontmatter: {tags: {in: [$tag]}, draft: {ne: true}}}
    ) {
      totalCount
      edges {
        node {
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
  }
`