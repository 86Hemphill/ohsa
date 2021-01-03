import React from "react"
import { Form, FormInput } from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import "../styling/players.css"
import { render } from "react-dom"
import addPlayers from "../images/addPlayers.png"
import addBtn from "../images/addBtn.png"


  export default class PLAYERS extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        names: []
      }
    
    }

    addPlayer = (e) => {
      e.preventDefault();
      const nameInput = document.querySelector('#nameInput').value;
      this.state.names.push(nameInput);
      const para = document.createElement("P");
      para.className = "names";
      const text = document.createTextNode(nameInput);
      para.appendChild(text);
      document.querySelector("#appendNames").appendChild(para);
      document.querySelector('#nameInput').value = "";
    }

    render() {
      return (
        <div id="main">
          <form id="form">
            <img id="addPlayers" src={addPlayers} alt="Add Players"></img>
            <div id="inputLine">
              <input id="nameInput" type="text" name="firstName" />
              <button id="addBtn" onClick={this.addPlayer}>ADD</button>
              <button id="cards" type="submit"><Link id="cardsLink" to="/cards" state={this.state}>DONE</Link></button>
            </div>
            {/* Append name div */}
            <div id="appendNames">

            </div>
          </form>
        </div>
      )
    }
  }

