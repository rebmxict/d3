import * as React from 'react';
import * as d3 from 'd3';
import * as _ from 'lodash';

import { UrbanLayout } from '../../components/Layout';
import Header from '../../components/Header';
import SVGGrid from '../../components/SVGGrid';

import NodeFactory from '../../factories/NodeFactory';

import './style.css';

class Explorer extends React.Component<any, any> {
  constructor() {
    super();

    this.mouseOver = this.mouseOver.bind(this);
    this.isConnected = this.isConnected.bind(this);
    this.mouseOut = this.mouseOut.bind(this);
    this.positionLink = this.positionLink.bind(this);
    this.positionNode = this.positionNode.bind(this);
    this.dragended = this.dragended.bind(this);
    this.dragged = this.dragged.bind(this);
    this.dragstarted = this.dragstarted.bind(this);
    this.ticked = this.ticked.bind(this);
    this.click = this.click.bind(this);
    this.update = this.update.bind(this);
    this.get_node_name_from_relation = this.get_node_name_from_relation.bind(this);
    this.get_node_elem_from_relation = this.get_node_elem_from_relation.bind(this);
    this.getNestedChildren = this.getNestedChildren.bind(this);
  }

    private svg: any;
    private link: any;
    private node: any;
    private simulation: any;
    private linkedByIndex: any;
    private markerGroup: any;
    private edgelabels: any;
    private edgepaths: any;
    private graph: any;
    private textpath: any;
    private data_temp: any;
    // private nodeEnter: any;
    // private linkEnter: any;

    // on each tick, update node and link positions
    ticked() {
        this.link.attr("d", this.positionLink)
            .attr("marker-end", 'url(#arrowhead)');

        this.node.attr("transform", this.positionNode);
    }

    click (d) {
        let collection_sid = d.id;
        let data_temp = NodeFactory.populateRelations(536);
    
        // let temp_relation_data = [], temp_node_data = [];
        // let obj = this;
    
        // this.data_temp.nodes.forEach(function(d, i) {
        //     let tmpe_node_data_elem = {};
        //     tmpe_node_data_elem["name"] = d.name;
        //     tmpe_node_data_elem["id"] = d.id;
        //     temp_node_data.push(tmpe_node_data_elem);
        // });
    
        // this.data_temp.relations.forEach(function(d, i) {
        //     if(d.sourceNodeId != d.targetNodeId) {
        //     let temp_data_elem = {};
        //     temp_data_elem["source"] = d.sourceNodeId;
        //     temp_data_elem["target"] = d.targetNodeId;
        //     temp_data_elem["value"] = d.id;
        //     temp_relation_data.push(temp_data_elem);
        //     }
        // });
        console.log(d.id);
        console.log(data_temp);
        // this.graph.links.push({"source": 535, "target": 541, "value": "5555"});

        // this.update();
        // this.simulation.restart();
    }

    dragstarted(d) {
        if (!d3.event.active) 
        this.simulation.alphaTarget(0.3).restart()
        this.simulation.restart();
        this.simulation.alpha(0.3);
        d.fx = d.x;
        d.fy = d.y;
    }
    
    dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }
    
    dragended(d) {
        if (!d3.event.active) 
        this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        this.simulation.alphaTarget(0.1);
    }

    // links are drawn as curved paths between nodes,
    // through the intermediate nodes
    positionLink(d) {
        var offset = 30;

        var midpoint_x = (d.source.x + d.target.x) / 2;
        var midpoint_y = (d.source.y + d.target.y) / 2;

        var dx = (d.target.x - d.source.x);
        var dy = (d.target.y - d.source.y);

        var normalise = Math.sqrt((dx * dx) + (dy * dy));

        var offSetX = midpoint_x + offset*(dy/normalise);
        var offSetY = midpoint_y - offset*(dx/normalise);

            // var ttargetx = 0, ttargety = 0, ttaroffset = 26;
            // var r = Math.sqrt((d.target.x - d.source.x) * (d.target.x - d.source.x) + (d.target.y - d.source.y) * (d.target.y - d.source.y));
            // if (d.source.x < d.target.x && d.source.y < d.target.y) {
            //     ttargetx = d.source.x + ((r - ttaroffset) / r) * Math.abs(d.target.x - d.source.x);
            //     ttargety = d.source.y + ((r - ttaroffset) / r) * Math.abs(d.target.y - d.source.y);
            // }
            // if (d.source.x > d.target.x && d.source.y < d.target.y) {
            //     ttargetx = d.source.x - ((r - ttaroffset) / r) * Math.abs(d.target.x - d.source.x);
            //     ttargety = d.source.y + ((r - ttaroffset) / r) * Math.abs(d.target.y - d.source.y);
            // }
            // if (d.source.x < d.target.x && d.source.y > d.target.y) {
            //     ttargetx = d.source.x + ((r - ttaroffset) / r) * Math.abs(d.target.x - d.source.x);
            //     ttargety = d.source.y - ((r - ttaroffset) / r) * Math.abs(d.target.y - d.source.y);
            // }
            // if (d.source.x > d.target.x && d.source.y > d.target.y) {
            //     ttargetx = d.source.x - ((r - ttaroffset) / r) * Math.abs(d.target.x - d.source.x);
            //     ttargety = d.source.y - ((r - ttaroffset) / r) * Math.abs(d.target.y - d.source.y);
            // }

        return "M" + d.source.x + "," + d.source.y +
            "S" + offSetX + "," + offSetY +
            " " + d.target.x + "," + d.target.y;
    }

    // move the node based on forces calculations
    positionNode(d) {
        // keep the node within the boundaries of the svg
        if (d.x < 0) {
            d.x = 0
        };
        if (d.y < 0) {
            d.y = 0
        };
        if (d.x > window.innerWidth) {
            d.x = window.innerWidth
        };
        if (d.y > window.innerHeight) {
            d.y = window.innerHeight
        };
        return "translate(" + d.x + "," + d.y + ")";
    }

    // check the dictionary to see if nodes are linked
    isConnected(a, b) {
        return this.linkedByIndex[a.index + "," + b.index] || this.linkedByIndex[b.index + "," + a.index] || a.index == b.index;
    }

    // fade nodes on hover
    mouseOver(opacity) {
        let tmp_this = this;
        return function(d) {
            // check all other nodes to see if they're connected
            // to this one. if so, keep the opacity at 1, otherwise
            // fade
            tmp_this.node.style("stroke-opacity", function(o) {
                var thisOpacity = tmp_this.isConnected(d, o) ? 1 : opacity;
                return thisOpacity;
            });
            tmp_this.node.style("fill-opacity", function(o) {
                var thisOpacity = tmp_this.isConnected(d, o) ? 1 : opacity;
                return thisOpacity;
            });
            // also style link accordingly
            tmp_this.link.style("stroke-opacity", function(o) {
                return o.source === d || o.target === d ? 1 : opacity;
            });
            tmp_this.link.style("stroke", function(o){
                return o.source === d || o.target === d ? o.source.colour : "#ddd";
            });
        };
    }

    mouseOut() {
        this.node.style("stroke-opacity", 1);
        this.node.style("fill-opacity", 1);
        this.link.style("stroke-opacity", 1);
        this.link.style("stroke", "#ddd");
        this.markerGroup.style("stroke-opacity", 1);
        this.markerGroup.style("fill-opacity", 1);
    }

    update() {
        // set the nodes, links
        var nodes = this.graph.nodes;
        var links = this.graph.links;

        this.link = this.svg.selectAll(".paths_s").selectAll(".link")
            .data(links);

        this.link.exit().remove();

        var linkEnter = this.link.enter()
            .append("path")
            .attr('id', function(d, i) { return "path" + i; })
            .attr("class", "link")
            .attr('stroke', function(d){
                return "#ddd";
            })
            .attr('marker-end','url(#arrowhead)');
        
        this.link = linkEnter.merge(this.link)

        //Create an SVG text element and append a textPath element
        this.textpath = this.svg.selectAll(".paths_s").selectAll(".textpath")
            .data(links)
            .enter()
            .append("text")
            .append("textPath") //append a textPath to the text element
            .attr("xlink:href", function(d, i){ return "#path" + i; }) //place the ID of the path here
            .style("text-anchor","middle") //place the text halfway on the arc
            .attr("startOffset", "50%")
            .text("Yay, my text is on a wavy path");

        // add the nodes to the graphic
        this.node = this.svg.selectAll(".nodes_s").selectAll(".node")
            .data(nodes)
        
        this.node.exit().remove();

        var nodeEnter = this.node.enter()
            .append("g")
            .attr("class", "node")
            .on("click", this.click)
            .call(d3.drag()
                .on("start", this.dragstarted)
                .on("drag", this.dragged)
                .on("end", this.dragended));
        
        // a circle to represent the node
        nodeEnter.append("circle")
            .attr("r", 20)
            .attr("fill", function(d) {
                return d.colour;
            })
            // .on("mouseover", this.mouseOver(.2))
            // .on("mouseout", this.mouseOut);
            .append("title")
            .text(function(d) {
                return d.id;
            });
    
        // add a label to each node
        nodeEnter.append("text")
            .attr("dx", 20)
            .attr("dy", ".35em")
            .text(function(d) {
                return d.id;
            })
            .style("stroke", "black")
            .style("stroke-width", 0.5)
            .style("fill", function(d) {
                return d.colour;
            });

        this.node = nodeEnter.merge(this.node);
    
        // add the nodes to the simulation and
        // tell it what to do on each tick
        this.simulation
            .nodes(nodes);
    
        // add the links to the simulation
        this.simulation
            .force("link")
            .links(links);

        let linkedByIndex = {};
        links.forEach(function(d) {
            linkedByIndex[d.source + "," + d.target] = 1;
        });
        this.linkedByIndex = linkedByIndex;
    }

    get_node_name_from_relation(id) {
        let node_name;
        this.data_temp.nodes.forEach(function(d) {
            if(d.id == id) {
            node_name = d.uuid;
            }
        });
        return node_name;
    }

    get_node_elem_from_relation(id) {
        let node_elem = {};
        this.data_temp.nodes.forEach(function(d) {
            if(d.id == id) {
            node_elem["name"] = d.createdByUserUuid;
            node_elem["id"] = d.id;
            node_elem["children"] = [];
            }
        });
        return node_elem;
    }

    getNestedChildren(arr, parent) {
        var out = []
        for (var i in arr) {
            if (arr[i].parent == parent) {
                var children = this.getNestedChildren(arr, arr[i].name)

                if (children.length) {
                    arr[i].children = children
                }
                out.push(arr[i])
            }
        }
        return out
    }

  async componentDidMount() {
    let collection_sid = 536;
    this.data_temp = await NodeFactory.populateRelations(collection_sid);

    let temp_relation_data = [], temp_node_data = [];
    let obj = this;

    this.data_temp.nodes.forEach(function(d, i) {
        let tmpe_node_data_elem = {};
        tmpe_node_data_elem["name"] = d.name;
        tmpe_node_data_elem["id"] = d.id;
        temp_node_data.push(tmpe_node_data_elem);
    });

    this.data_temp.relations.forEach(function(d, i) {
        if(d.sourceNodeId != d.targetNodeId) {
        let temp_data_elem = {};
        temp_data_elem["source"] = d.sourceNodeId;
        temp_data_elem["target"] = d.targetNodeId;
        temp_data_elem["value"] = d.id;
        temp_relation_data.push(temp_data_elem);
        }
    });

    // var result = {"nodes": []};
    // result["children"] = this.getNestedChildren(temp_relation_data, collection_sid);
    
    this.svg = d3.select(this.refs.svg);

    this.markerGroup = this.svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '-0 -5 10 10')
        .attr('refX', 23)
        .attr('refY', -2)
        .attr('orient', 'auto')
        .attr('markerWidth', 13)
        .attr('markerHeight', 13)
        .attr('xoverflow', 'visible')
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#999')
        .style('stroke','none');

    this.svg.append("g").attr("class", "paths_s");
    this.svg.append("g").attr("class", "nodes_s");
    this.svg.append("g").attr("class", "texts_s");
    // this.svg = this.svg.call(d3.zoom().scaleExtent([1 / 2, 8]).on("zoom", this.zoomed));
    // this.transform = d3.zoomIdentity;

    var width = window.innerWidth;
    var height = window.innerHeight;

    this.simulation = d3.forceSimulation()
    // pull nodes together based on the links between them
    .force("link", d3.forceLink().distance(function(d) {return 300;}).id(function(d) {
        return d.id;
    })
    .strength(0.025))
    // push nodes apart to space them out
    .force("charge", d3.forceManyBody().strength(-200))
    // add some collision detection so they don't overlap
    .force("collide", d3.forceCollide().radius(12))
    // and draw them around the centre of the space
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", this.ticked);
  
    // load the grap
    this.graph = {
      "nodes": temp_node_data,
      "links": temp_relation_data
    }

    this.update();
  }

  render() {
    return (
      <UrbanLayout>
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
};

export default Explorer
