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
      names: this.props.location.state.names,
      hands: [],
      cards: []
    }

    selectCards = (e) => {
    //   e.preventDefault();
      let cardAmt = document.querySelector('#cardAmt').value;
      this.state.hands.push(cardAmt);
      this.setCards(cardAmt);
      console.log(this.state.names);
      console.log(this.state.hands);
    }

    setCards = (x) => {
        for (let i = x; i >= 0; i--) {
            if (i === 0) {
                for (let i = 1; i <= x; i++) {
                    this.state.cards.push(i);
                }
            }  
            this.state.cards.push(i);
        }
        this.state.cards.pop();
    }

    render() {
      return (
        <div id="main">
          <form id="form">
            <img id="cardsImg" src={cards} alt="How Many Cards" />
            <input id="cardAmt" type="text" />
            <Link  to="/scoreboard" state={this.state}><button id="startGame" type="submit" onClick={this.selectCards}>Start Game!</button></Link>
          </form>
        </div>
      )
    }
  }

