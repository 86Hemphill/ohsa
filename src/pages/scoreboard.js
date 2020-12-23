import React from "react"
import { Link } from "gatsby"
import { useTable } from 'react-table'


import Layout from "../components/layout"
import SEO from "../components/seo"
import icon from "../images/gatsby-icon.png"
import "../styling/scoreboard.css"
import { render } from "react-dom"
  

  export default class Cards extends React.Component {

    state = {
      names: this.props.location.state.names,
      hands: this.props.location.state.hands,
      cards: this.props.location.state.cards
    }


    render() {
        console.log(this.state.cards);
      return (
        <div id="main">
            <table>
                <thead>
                    <tr>
                        <th></th>
                        {this.state.cards.map((card, i) => (
                        <th key={i} className="cardNumbers">{card}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {this.state.names.map((name, i) => (
                        <tr>
                            <td key={i} className="names">{name}</td>,
                            {this.state.cards.map((card, i) => (
                                <td key={i} className="tricks"></td>
                            ))}
                        </tr>
                    ))}
                </tbody>
        </table>
        </div>
      )
    }
  }
