import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import ExplorerView from './ExplorerView';

const stateToProps = ({explorer}: any, ownProps: any) => ({
  data: explorer.data,
  nodeId: explorer.nodeId
})

const dispatchToProps = (dispatch: any) => bindActionCreators({

}, dispatch)

// Wrap
const ExplorerViewContainer = connect(stateToProps, dispatchToProps)(ExplorerView);

export {
  ExplorerViewContainer as default,
}
