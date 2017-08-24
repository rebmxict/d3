import * as React from 'react';
import * as d3 from 'd3';
import * as _ from 'lodash';

import { UrbanLayout } from '../../components/Layout';
import Header from '../../components/Header';
import SVGGrid from '../../components/SVGGrid';

import NodeFactory from '../../factories/NodeFactory';

const selectedNodeId = 505;

class Explorer extends React.Component<any, any> {
  private data: any;
  private tree: any;
  private svg: any;

  private nodeContainer: any;
  private linkContainer: any;

  private node: any;
  private link: any;

  private simulation: any;

  state = {
    nodes: [],
    relations: []
  }

  toggleCollapse(node: any) {
    const nodes = _.map(this.state.nodes, (n: any) => {
      return {
        ...n,
        collapse: n.id === node.id ? !node.collapse : n.collapse
      }
    });


    this.setState(state => ({
      nodes: nodes
    }), () => {
      this.draw()
    })
  }

  draw() {
    const relations = _(this.state.relations)
      .filter((relation: any) => {
        const nodeIds = _(this.state.nodes).filter((node: any) => node.collapse).map('id').value();

        return nodeIds.indexOf(relation.targetNodeId) !== -1 || nodeIds.indexOf(relation.sourceNodeId) !== -1;
      }).map((relation: any) => {
        return {
          source: relation.sourceNodeId,
          target: relation.targetNodeId,
          name: relation.name,
          id: relation.id
        }
      }).value()

    const connectedNodes = _.uniq(_.map(relations, 'source').concat(_.map(relations, 'target')));

    const nodes = _.filter(this.state.nodes, (n: any) => {
      return n.id === selectedNodeId || connectedNodes.indexOf(n.id) !== -1;
    });

    this.node = this.nodeContainer.selectAll('.node-g').data(nodes, d => d.id);

    this.node.exit().remove();

    this.node = this.node.enter().append('g').attr('class', 'node-g')

    this.node
      .append('text')
      .text(d => d.name)

    this.node
      .append('circle')
      .attr('data-collapse', d => d.collapse)
      .attr('data-node-id', d => d.id)
      .attr('class', 'node')
      .attr('stroke', '#333')
      .attr('fill', '#feca28')
      .attr('r', 25)
      .on('click', (d) => this.toggleCollapse(d))

    this.link = this.linkContainer.selectAll('.relation').data(relations, d => d.id);

    this.link
      .exit()
      .remove();

    this.link = this.link
      .enter()
      .append("line")
      .attr('class', 'relation')
      .attr('stroke-width', 5)
      .attr('stroke', '#333')
      .merge(this.link)

    this.simulation.nodes(nodes).on('tick', d => this.ticked());
    this.simulation.force('link').links(relations);
    this.simulation.alpha(1).restart();
  }

  ticked() {
    this.link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    this.node.attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')
    // this.node.attr('cx', d => d.x).attr('cy', d => d.y);
  }

  async componentDidMount() {
    this.svg = d3.select(this.refs.svg);

    this.linkContainer = this.svg.append('g').attr('class', 'relations');
    this.nodeContainer = this.svg.append('g').attr('class', 'nodes');

    const data: any = await NodeFactory.populateRelations(selectedNodeId);

    this.simulation = d3.forceSimulation()
      .force("link", d3.forceLink().distance(150).id(d => d.id))
      // .force("collide", d3.forceCollide(d => 48).iterations(16))
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
      .alphaTarget(1)
      .force("y", d3.forceY())
      .force("x", d3.forceX())

    // Construct tree!
    const root = _.find(data.nodes, (node: any) => node.id === selectedNodeId);
    this.tree = {
      ...root,
      collapse: false,
      children: _.filter(data.nodes, (node: any) => node.id !== selectedNodeId)
    }

    this.setState({
      relations: data.relations,
      nodes: _.map(data.nodes, (d) => {
        return {
          ...d,
          collapse: false
        }
      })
    }, () => this.draw())
  }

  render() {
    return (
      <UrbanLayout>
        <Header />
        <div className="borderless main-content">
          <svg
            width={window.innerWidth}
            height={window.innerHeight}
            style={{ background: '#ffffff' }}
            ref={'svg'}
          >
            <SVGGrid svg={this.refs.svg} />
          </svg>
        </div>
      </UrbanLayout>
    );
  }
}

export default Explorer
