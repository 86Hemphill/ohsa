import React from "react"
import { Form, FormInput } from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import icon from "../images/gatsby-icon.png"
import "../styling/cards.css"
import { render } from "react-dom"
import addPlayers from "../images/addPlayers.png"
import cards from "../images/cards.png"


  export default class Cards extends React.Component {

    state = {
      names: [],
      cards: []
    }

    componentDidMount() {
        const names = this.props.location.state.names;
        this.setState({
            names: {names}
        })
    }

    selectCards = (e) => {
      e.preventDefault();
      let cardAmt = document.querySelector('#cardAmt').value;
      this.state.cards.push(cardAmt);
    }

    render() {
      return (
        <div id="main">
          <form id="form">
            <img id="cardsImg" src={cards} alt="How Many Cards" />
            <input id="cardAmt" type="text" />
            <button id="startGame" type="submit" onClick={this.selectCards}>Start Game!</button>
          </form>
        </div>
      )
    }
  }

