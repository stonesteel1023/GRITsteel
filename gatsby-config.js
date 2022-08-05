module.exports = {
  siteMetadata: {
    title: `GRITsteel's new home`,
    author: {
      name: `최석철`,
      summary: `stonesteel`,
    },
    description: `New Home`,
    siteUrl: `https://stonesteel1023.github.io/`,
    social: {
      twitter: `bestalign`,
    },
    categories: [
      { name: `home`, url: `/`, displayText: `Home`, priority: 0, generatePage: false },
      { name: `til`, url: `/til`, displayText: `TIL`, description: `Today I Learned`, priority: 1, generatePage: true },
      { name: `scrab`, url: `/scrab`, displayText: `scrab`, description: `퍼온글`, priority: 2, generatePage: true },
      { name: `daily`, url: `/daily`, displayText: `일기`, description: `매일 생각`, priority: 3, generatePage: true },
    ]
  },
  plugins: [
    `gatsby-plugin-image`,
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /assets/
        }
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/til`,
        name: `til`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/reading`,
        name: `reading`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: `gatsby-remark-table-of-contents`,
            options: {
              exclude: "Table of Contents",
              tight: false,
              ordered: false,
              fromHeading: 2,
              toHeading: 6,
              className: "table-of-contents"
            },
          },
          `gatsby-remark-autolink-headers`,
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-37673421-2`,
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.nodes.map(node => {
                return Object.assign({}, node.frontmatter, {
                  description: node.excerpt,
                  date: node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + node.fields.slug,
                  guid: site.siteMetadata.siteUrl + node.fields.slug,
                  custom_elements: [{ "content:encoded": node.html }],
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                  filter: {frontmatter: {draft: {ne: true}}}
                ) {
                  nodes {
                    excerpt
                    html
                    fields {
                      slug
                    }
                    frontmatter {
                      title
                      date
                    }
                  }
                }
              }
            `,
            output: "/atom.xml",
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `GRITsteel's new home`,
        short_name: `new home`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/icon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-react-helmet`,

    // below two plugins are to support the old post URLs, which were used on Hexo
    'gatsby-redirect-from',
    'gatsby-plugin-meta-redirect'
  ],
}
