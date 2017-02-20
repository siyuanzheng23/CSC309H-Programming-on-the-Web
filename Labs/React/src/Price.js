import React, { Component } from 'react';

const styles = {
  price: {
    color: '#F44336',
    fontWeight: '600',
    fontSize:'110%'
  },
};

class Price extends Component {
    
  /* Returns a 'div' containing the price from this.props.  If the price is
   * 42, then it should be displayed as 'CDN$ 42'
   * Apply the styles from above, and the style from this.props using the 
   * Object.assign mechanism.  
   * Tips: Where does this.props come from? Look for examples of applying
   * styles in other parts of the app.  */
  render() {
        // TODO
        return(
            <div style={Object.assign({}, styles.price, this.props.style)}>
            {'CDN$ '} {this.props.price}
            </div>
      );
  }
}

export default Price;
