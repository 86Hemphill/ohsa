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
                        <th>Column1</th>
                        <th>Column2</th>
                        <th>Column3</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{this.props.location.state.names[0]}</td>
                        <td>{this.props.location.state.hands[0]}</td>
                    </tr>
                </tbody>
        </table>
        </div>
      )
    }
  }
