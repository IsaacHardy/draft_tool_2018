import { graphql } from 'gatsby'
import React from 'react'
import get from 'lodash/get'
import { forEach, remove, map, round, union, orderBy } from 'lodash'

import Meta from 'components/Meta'
import Layout from 'components/Layout'

class BlogIndex extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      quarterBacks: map(
        get(this.props.data, 'allDataJson.edges[0].node.QBS'),
        player => ({
          value: round(
            player.FPTS -
              get(this.props.data, 'allDataJson.edges[0].node.QBS[20].FPTS'),
            2
          ),
          ...player,
        })
      ),
      runningBacks: map(
        get(this.props.data, 'allDataJson.edges[0].node.RBS'),
        player => ({
          value: round(
            player.FPTS -
              get(this.props.data, 'allDataJson.edges[0].node.RBS[35].FPTS'),
            2
          ),
          ...player,
        })
      ),
      wideReceivers: map(
        get(this.props.data, 'allDataJson.edges[0].node.WRS'),
        player => ({
          value: round(
            player.FPTS -
              get(this.props.data, 'allDataJson.edges[0].node.WRS[35].FPTS'),
            2
          ),
          ...player,
        })
      ),
      tightEnds: map(
        get(this.props.data, 'allDataJson.edges[0].node.TES'),
        player => ({
          value: round(
            player.FPTS -
              get(this.props.data, 'allDataJson.edges[0].node.TES[18].FPTS'),
            2
          ),
          ...player,
        })
      ),
      allPlayers: [],
    }
  }

  componentWillMount() {
    this.setState({
      allPlayers: orderBy(
        union(
          this.state.quarterBacks,
          this.state.runningBacks,
          this.state.wideReceivers,
          this.state.tightEnds
        ),
        ['value'],
        ['desc']
      ),
    })
  }

  draftPlayer(position, player) {
    this.setState({
      [position]: remove(
        this.state[position],
        ({ Player }) => Player !== player
      ),
      allPlayers: remove(
        this.state.allPlayers,
        ({ Player }) => Player !== player
      ),
    })
  }

  calculateBaseline(position, index) {
    return this.state[position][index].FPTS
  }

  render() {
    console.log(this.state.allPlayers)
    return (
      <Layout location={this.props.location}>
        <Meta site={get(this.props.data, 'site.meta')} />
        <div className="container-fluid">
          <div className="row">
            <table className="table col">
              <thead>
                <tr>
                  <th scope="col">Player</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                {this.state.allPlayers.map(({ Player, value }, i) => (
                  <tr scope="row" key={i}>
                    <td>{Player}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="table col">
              <thead>
                <tr>
                  <th scope="col">Player</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                {this.state.quarterBacks.map(({ Player, value }, i) => (
                  <tr
                    scope="row"
                    key={i}
                    onClick={() => this.draftPlayer('quarterBacks', Player)}
                  >
                    <td>{Player}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="table col">
              <thead>
                <tr>
                  <th scope="col">Player</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                {this.state.runningBacks.map(({ Player, FPTS }, i) => (
                  <tr
                    scope="row"
                    key={i}
                    onClick={() => this.draftPlayer('runningBacks', Player)}
                  >
                    <td>{Player}</td>
                    <td>
                      {round(
                        FPTS - this.calculateBaseline('runningBacks', 35),
                        2
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="table col">
              <thead>
                <tr>
                  <th scope="col">Player</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                {this.state.wideReceivers.map(({ Player, FPTS }, i) => (
                  <tr
                    scope="row"
                    key={i}
                    onClick={() => this.draftPlayer('wideReceivers', Player)}
                  >
                    <td>{Player}</td>
                    <td>
                      {round(
                        FPTS - this.calculateBaseline('wideReceivers', 35),
                        2
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="table col">
              <thead>
                <tr>
                  <th scope="col">Player</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                {this.state.tightEnds.map(({ Player, FPTS }, i) => (
                  <tr
                    scope="row"
                    key={i}
                    onClick={() => this.draftPlayer('tightEnds', Player)}
                  >
                    <td>{Player}</td>
                    <td>
                      {round(FPTS - this.calculateBaseline('tightEnds', 20), 2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  {
    allDataJson {
      edges {
        node {
          TES {
            Player
            Team
            REC
            TDS
            FL
            FPTS
          }
          WRS {
            Player
            Team
            REC
            YDS
            TDS
            ATT
            FL
            FPTS
          }
          QBS {
            Player
            Team
            ATT
            CMP
            YDS
            TDS
            INTS
            FL
            FPTS
          }
          RBS {
            Player
            Team
            ATT
            YDS
            TDS
            REC
            FL
            FPTS
          }
        }
      }
    }
  }
`
