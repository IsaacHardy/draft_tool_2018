import { graphql } from 'gatsby'
import React from 'react'
import get from 'lodash/get'
import { forEach, remove, map, round } from 'lodash'

import Meta from 'components/Meta'
import Layout from 'components/Layout'

class BlogIndex extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      quarterBacks: get(this.props.data, 'allDataJson.edges[0].node.QBS'),
      runningBacks: get(this.props.data, 'allDataJson.edges[0].node.RBS'),
      wideReceiver: get(this.props.data, 'allDataJson.edges[0].node.WRS'),
      tightEnds: get(this.props.data, 'allDataJson.edges[0].node.TES'),
    }
  }

  draftPlayer(position, player) {
    this.setState({
      [position]: remove(
        this.state[position],
        ({ Player }) => Player !== player
      ),
    })
  }

  calculateBaseline(position, index) {
    return this.state[position][index].FPTS
  }

  render() {
    return (
      <Layout location={this.props.location}>
        <Meta site={get(this.props.data, 'site.meta')} />
        <div className="container">
          <div className="row">
            <div className="col">
              {this.state.quarterBacks.map(({ Player, FPTS }, i) => (
                <div
                  className="row"
                  key={i}
                  onClick={() => this.draftPlayer('quarterBacks', Player)}
                >
                  <div className="col">{Player}</div>
                  <div className="col">
                    {round(
                      FPTS - this.calculateBaseline('quarterBacks', 14),
                      2
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="col">
              {this.state.runningBacks.map(({ Player, FPTS }, i) => (
                <div
                  className="row"
                  key={i}
                  onClick={() => this.draftPlayer('runningBacks', Player)}
                >
                  <div className="col">{Player}</div>
                  <div className="col">
                    {round(
                      FPTS - this.calculateBaseline('runningBacks', 30),
                      2
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="col">
              {this.state.wideReceiver.map(({ Player, FPTS }, i) => (
                <div
                  className="row"
                  key={i}
                  onClick={() => this.draftPlayer('wideReceiver', Player)}
                >
                  <div className="col">{Player}</div>
                  <div className="col">
                    {round(
                      FPTS - this.calculateBaseline('wideReceiver', 35),
                      2
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="col">
              {this.state.tightEnds.map(({ Player, FPTS }, i) => (
                <div
                  className="row"
                  key={i}
                  onClick={() => this.draftPlayer('tightEnds', Player)}
                >
                  <div className="col">{Player}</div>
                  <div className="col">
                    {round(FPTS - this.calculateBaseline('tightEnds', 14), 2)}
                  </div>
                </div>
              ))}
            </div>
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
