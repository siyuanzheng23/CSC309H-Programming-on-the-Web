import React, { Component } from 'react';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  flexItem: {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 'auto',
    textAlign: 'left',
    marginLeft:'10%'
  },
  name: {
    flexBasis: '50%',
    textAlign: 'left',
  },
};

class CartHeader extends Component {
  render() {
    return (
      <div
        style={styles.container}
      >
        <div
          style={Object.assign({}, styles.flexItem, styles.name)}
        >Item Name</div>
        <div
          style={styles.flexItem}
        >Quantity</div>
        <div
          style={styles.flexItem}
        >Price</div>
      </div>
    );
  }
}

export default CartHeader;
