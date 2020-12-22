import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import icon from "../images/gatsby-icon.png"
import "../styling/scoreboard.css"
import { render } from "react-dom"


  export default class Cards extends React.Component {

    state = {
      names: [],
      cards: []
    }

    componentDidMount() {
        const names = this.props.location.state.names;
        const cards = this.props.location.state.cards;
        this.setState({
            names: {names},
            cards: {cards}
        })
    }


    render() {
      return (
        <div id="main">
          <p>{this.state.names}</p>
          <p>{this.state.cards}</p>
        </div>
      )
    }
  }