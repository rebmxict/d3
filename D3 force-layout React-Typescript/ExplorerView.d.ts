/// <reference types="react" />
import * as React from 'react';
declare class Explorer extends React.Component<any, any> {
    private data;
    private tree;
    private svg;
    private nodeContainer;
    private linkContainer;
    private node;
    private link;
    private simulation;
    state: {
        nodes: any[];
        relations: any[];
    };
    toggleCollapse(node: any): void;
    draw(): void;
    ticked(): void;
    componentDidMount(): Promise<void>;
    render(): JSX.Element;
}
export default Explorer;
