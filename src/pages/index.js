import * as React from "react"
import { Link, graphql } from 'gatsby'

import Layout from "../components/layout"
import Seo from "../components/seo"
import Nav from "../components/nav"
import GithubSvg from "../assets/github.svg"
import TwitterSvg from "../assets/twitter.svg"
import RssSvg from "../assets/rss.svg"

const Index = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.nodes

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Home" />
      <Nav categories={data.site.siteMetadata.categories}/>
      <hr />
      <article className="introduction">
        <h6>GRITsteel's</h6>
        <p>new Home</p>
      </article>
      <section className="icons">
        <a href="https://www.github.com/stonesteel1023" target="_blank" rel="noreferrer">
          <GithubSvg width={18} height={18}/>
        </a>
        <a href="https://www.twitter.com/stonesteel1023" target="_blank" rel="noreferrer">
          <TwitterSvg width={18} height={18}/>
        </a>
        <Link to="/atom.xml">
          <RssSvg width={18} height={18}/> 
        </Link>
      </section>

      <hr />
      <h6>최신글</h6>
      <ol style={{ listStyle: `none` }}>
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

export default Index

export const pageQuery = graphql`
  query RecentPost {
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
      sort: { fields: [frontmatter___date], order: DESC },
      limit: 5
      filter: {frontmatter: {draft: {ne: true}}}
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
