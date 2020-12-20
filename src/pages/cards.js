import React from "react"
import { Form, FormInput } from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import icon from "../images/gatsby-icon.png"
import "../styling/cards.css"
import { render } from "react-dom"
import addPlayers from "../images/addPlayers.png"


  export default class Cards extends React.Component {

    state = {
      names: []
    }

    addPlayer = (e) => {
      e.preventDefault();
      let nameInput = document.querySelector('#nameInput').value;
      this.state.names.push(nameInput);
      console.log(this.state.names)
      console.log(nameInput);
    }

    render() {
      return (
        <div id="main">
          <form id="form">
            <h1>How Many Cards?</h1>
            <input id="nameInput" type="text" name="firstName" />
            <button id="addBtn" type="submit" onClick={this.addPlayer}>Start Game!</button>
          </form>
        </div>
      )
    }
  }

