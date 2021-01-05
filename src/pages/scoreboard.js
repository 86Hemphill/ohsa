import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import "../styling/scoreboard.css"


export default class Cards extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
        names: [],
        hands: [],
        cards: [],
        players: []
    }
  }

  componentDidMount() {
    if (typeof window === "undefined") {
      return
    }
    this.setState(() => ({ names: this.props.location.state.names }))
    this.setState(() => ({ hands: this.props.location.state.hands }))
    this.setState(() => ({ cards: this.props.location.state.cards }))
    this.setState(() => ({ players: this.props.location.state.players }))
  }

  setBid = () => {
    //
  }

  render() {
    return (
      <div id="main">
        <table>
          <thead>
            <tr>
                <th>
                </th>
              {this.state.names.map((name, i) => (
                <th key={i} className="playerNames">
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {this.state.cards.map((card, i) => (
              <tr key={i}>
                <td className="cardNumbers">
                  {card}
                </td>
                {this.state.names.map((name, i) => (
                  <td key={i} className="tricks" onClick={() => this.setBid(name)}></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}
