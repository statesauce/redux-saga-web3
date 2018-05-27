import React, { Component, Children } from "react";
import { compose, connect } from "react-redux";
import PropTypes from "prop-types";
import { Provider as ReduxProvider } from "react-redux";
import { createStore } from "./store";

class Provider extends Component {
  static propTypes = {
    options: PropTypes.object
  };

  constructor(props) {
    super(props);

    if (props.provider) {
      props.onInitSauce(props.provider);
    } else if (window.web3 && window.web3.currentProvider) {
      props.onInitSauce(window.web3.currentProvider);
    } else {
      throw new Error("Web3 Provider not injected or provided");
    }
  }

  render() {
    return Children.only(this.props.children);
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onInitSauce: provider =>
      dispatch({
        type: "WEB3/INIT",
        provider
      })
  };
};

const EnhancedProvider = connect(state => state, mapDispatchToProps)(
  Provider
);

class Provider extends Component {
  constructor(props, context) {
    super(props, context);

    // Redux store not available
    if (!context.store) {
      this.store = createStore();
    }
  }

  render() {
    if (this.store) {
      return (
        <ReduxProvider store={this.store}>
          <EnhancedProvider {...this.props}>
            {this.props.children}
          </EnhancedProvider>
        </ReduxProvider>
      );
    } else {
      console.log("existing store found")
      return (
        <EnhancedProvider {...this.props}>
          {this.props.children}
        </EnhancedProvider>
      );
    }
  }
}

Provider.contextTypes = {
  store: PropTypes.object
};

export default Provider;
