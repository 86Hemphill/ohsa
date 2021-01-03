import React from "react"
import { Form, FormInput } from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import icon from "../images/gatsby-icon.png"
import "../styling/cards.css"
import { render } from "react-dom"
import addPlayers from "../images/addPlayers.png"
import cardsImg from "../images/cardsImg.png"

export default class Cards extends React.Component {
    constructor(props) {
        super(props)
  
        this.state = {
            names: this.props.location.state.names,
            hands: [],
            cards: [],
            cardAmt: "",
        }
      }

  setCardAmt = e => {
    const { name, value } = e.target
    this.setState({ [name]: value })    
    this.setCards(value);
  }

  setCards = x => {
    const cards = []
    for (let i = x; i >= 0; i--) {
      if (i === 0) {
        for (let j = 1; j <= x; j++) {
          cards.push(j)
        }
      } else {
        cards.push(i)
      }
    }
    this.setState({ cards: cards })
  }

  render() {
    return (
      <div id="main">
        <form id="form">
          <img id="cardsImg" src={cardsImg} alt="How Many Cards" />
          <input
            id="cardAmt"
            type="text"
            name="cardAmt"
            value={this.state.cardAmt}
            onChange={this.setCardAmt}
          />
          <Link to="/scoreboard" state={this.state}>
            <button id="startGame" type="submit">
              Start Game!
            </button>
          </Link>
        </form>
      </div>
    )
  }
}