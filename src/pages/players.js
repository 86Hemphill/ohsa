import React from "react"
import { Form, FormInput } from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import icon from "../images/gatsby-icon.png"
import "../styling/players.css"
import { render } from "react-dom"
import addPlayers from "../images/addPlayers.png"


  export default class PLAYERS extends React.Component {

    state = {
      names: []
    }

    addPlayer = (e) => {
      e.preventDefault();
      var nameInput = document.querySelector('#nameInput').value;
      this.state.names.push(nameInput);
      console.log(this.state.names);
      console.log(nameInput);
      document.querySelector('#nameInput').value = "";
    }

    render() {
      return (
        <div id="main">
          <form id="form">
            <img id="addPlayers" src={addPlayers} alt="Add Players"></img>
            <input id="nameInput" type="text" name="firstName" />
            <button id="addBtn" type="submit" onClick={this.addPlayer}>Submit</button>
            <Link id="cardsLink" to="/cards"><button id="cards" type="submit">Next</button></Link>
          </form>
        </div>
      )
    }
  }

