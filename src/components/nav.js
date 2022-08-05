import { Link } from "gatsby"
import * as React from "react"

const Nav = ({categories}) => {
  categories.sort((first, second) => { return first.priority > second.priority })

  return (
    <nav className="menu">
      {
        categories.map( (category) => {
          return <Link to={category.url} key={category.name}><span>{category.displayText}</span></Link>
        })
      }
    </nav>
  )
}

export default Nav