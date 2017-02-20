import React, { Component } from 'react';

import QuantitySelect from './QuantitySelect';
import Price from './Price';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: '1rem',
    paddingButton: '1rem',
    alignItems: 'center',
  },
  flexItem: {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 'auto',
    textAlign: 'right',
  },
  title: {
    flexBasis: '50%',
    textAlign: 'left',
  },
};

class Item extends Component {
  constructor() {
    super();

    this.updateQuantityHelp = this.updateQuantityHelp.bind(this);
  }

  updateQuantityHelp(newQuantity) {
    const { updateQuantity, item: { id } } = this.props;

    updateQuantity(id, newQuantity);
  }

  render() {
    const { item: { name, price, quantity } } = this.props;
    //props passed in from the parent. recall..

    return (
      <div
        style={styles.container}
      >
        <div
          style={Object.assign({}, styles.flexItem, styles.title)}
        >{name}</div>
        <QuantitySelect
          style={styles.flexItem}
          quantity={quantity}
          updateQuantityHelp={this.updateQuantityHelp}
        />
        <Price
          style={styles.flexItem}
          price={price}
        />
      </div>
    );
  }
}

export default Item;
