import React, { Component, Children } from "react";
import { compose, connect } from "react-redux";
import PropTypes from "prop-types";
import { Provider as ReduxProvider } from "react-redux";
import { createStore } from "./store";

class Initializer extends Component {
  static propTypes = {
    options: PropTypes.object
  };

  constructor(props) {
    super(props);

    if (props.provider) {
      props.onInit(props.provider);
    } else if (window.web3 && window.web3.currentProvider) {
      props.onInit(window.web3.currentProvider);
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
    onInit: provider =>
      dispatch({
        type: "WEB3/INIT",
        provider
      })
  };
};

const EnhancedInitializer = connect(state => state, mapDispatchToProps)(
  Initializer
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
          <EnhancedInitializer {...this.props}>
            {this.props.children}
          </EnhancedInitializer>
        </ReduxProvider>
      );
    } else {
      console.log("existing store found")
      return (
        <EnhancedInitializer {...this.props}>
          {this.props.children}
        </EnhancedInitializer>
      );
    }
  }
}

Provider.contextTypes = {
  store: PropTypes.object
};

export default Provider;
