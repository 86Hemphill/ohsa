import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import ohHell from "../images/ohHell.jpg"
import newGame from "../images/newGame.jpg"
import "../styling/index.css"
import GatsbyImage from "gatsby-image"

const IndexPage = () => (
  <div id="main">
    <img id="ohimg" src={ohHell} alt="Oh Hell Logo" />
    <Link id="ngLink" to="/players">
      <img id="ngImg" src={newGame} alt="New Game" />
    </Link>
    {/* <img id="ngimg" src={newGame} alt="New Game" /> */}
  </div>
)

export default IndexPage
