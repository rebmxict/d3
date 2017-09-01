/// <reference types="react" />
import * as React from 'react';
import './style.css';
declare class Explorer extends React.Component<any, any> {
    constructor();
    private svg;
    private link;
    private node;
    private simulation;
    private linkedByIndex;
    private markerGroup;
    private edgelabels;
    private edgepaths;
    private graph;
    private textpath;
    private data_temp;
    ticked(): void;
    click(d: any): void;
    dragstarted(d: any): void;
    dragged(d: any): void;
    dragended(d: any): void;
    positionLink(d: any): string;
    positionNode(d: any): string;
    isConnected(a: any, b: any): any;
    mouseOver(opacity: any): (d: any) => void;
    mouseOut(): void;
    update(): void;
    get_node_name_from_relation(id: any): any;
    get_node_elem_from_relation(id: any): {};
    getNestedChildren(arr: any, parent: any): any[];
    componentDidMount(): Promise<void>;
    render(): JSX.Element;
}
export default Explorer;
