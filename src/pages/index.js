import { graphql } from 'gatsby'
import React from 'react'
import get from 'lodash/get'
import { map, round, union, orderBy, filter } from 'lodash'

import Meta from 'components/Meta'
import Layout from 'components/Layout'

class BlogIndex extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      quarterBacks: get(this.props.data, 'allDataJson.edges[0].node.QBS'),
      runningBacks: get(this.props.data, 'allDataJson.edges[0].node.RBS'),
      wideReceivers: get(this.props.data, 'allDataJson.edges[0].node.WRS'),
      tightEnds: get(this.props.data, 'allDataJson.edges[0].node.TES'),
    }
  }

  draftPlayer(position, player) {
    this.setState((state, props) => ({
      [position]: filter(state[position], ({ Player }) => Player !== player),
    }))
  }

  render() {
    const quarterBacks = map(
      this.state.quarterBacks,
      ({ VORP, Player, FPTS }) => ({
        VORP: round(FPTS - this.state.quarterBacks[18].FPTS, 2),
        Player,
      })
    )
    const runningBacks = map(
      this.state.runningBacks,
      ({ VORP, Player, FPTS }) => ({
        VORP: round(FPTS - this.state.runningBacks[35].FPTS, 2),
        Player,
      })
    )
    const wideReceivers = map(
      this.state.wideReceivers,
      ({ VORP, Player, FPTS }) => ({
        VORP: round(FPTS - this.state.wideReceivers[35].FPTS, 2),
        Player,
      })
    )
    const tightEnds = map(this.state.tightEnds, ({ VORP, Player, FPTS }) => ({
      VORP: round(FPTS - this.state.tightEnds[18].FPTS, 2),
      Player,
    }))

    const allPlayers = orderBy(
      union(quarterBacks, runningBacks, wideReceivers, tightEnds),
      ['VORP'],
      ['desc']
    )

    return (
      <Layout location={this.props.location}>
        <Meta site={get(this.props.data, 'site.meta')} />
        <div className="container-fluid">
          <div className="row">
            <table className="table col">
              <thead>
                <tr>
                  <th scope="col">Player</th>
                  <th scope="col">VORP</th>
                </tr>
              </thead>
              <tbody>
                {allPlayers.map(({ Player, VORP }, i) => (
                  <tr scope="row" key={i}>
                    <td>{Player}</td>
                    <td>{VORP}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="table col">
              <thead>
                <tr>
                  <th scope="col">Player</th>
                  <th scope="col">VORP</th>
                </tr>
              </thead>
              <tbody>
                {quarterBacks.map(({ Player, VORP }, i) => (
                  <tr
                    scope="row"
                    key={i}
                    onClick={() => this.draftPlayer('quarterBacks', Player)}
                  >
                    <td>{Player}</td>
                    <td>{VORP}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="table col">
              <thead>
                <tr>
                  <th scope="col">Player</th>
                  <th scope="col">VORP</th>
                </tr>
              </thead>
              <tbody>
                {runningBacks.map(({ Player, VORP }, i) => (
                  <tr
                    scope="row"
                    key={i}
                    onClick={() => this.draftPlayer('runningBacks', Player)}
                  >
                    <td>{Player}</td>
                    <td>{VORP}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="table col">
              <thead>
                <tr>
                  <th scope="col">Player</th>
                  <th scope="col">VORP</th>
                </tr>
              </thead>
              <tbody>
                {wideReceivers.map(({ Player, VORP }, i) => (
                  <tr
                    scope="row"
                    key={i}
                    onClick={() => this.draftPlayer('wideReceivers', Player)}
                  >
                    <td>{Player}</td>
                    <td>{VORP}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table className="table col">
              <thead>
                <tr>
                  <th scope="col">Player</th>
                  <th scope="col">VORP</th>
                </tr>
              </thead>
              <tbody>
                {tightEnds.map(({ Player, VORP }, i) => (
                  <tr
                    scope="row"
                    key={i}
                    onClick={() => this.draftPlayer('tightEnds', Player)}
                  >
                    <td>{Player}</td>
                    <td>{VORP}</td>
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
