import React, { Component } from 'react';

import Price from './Price';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: '2rem',
    marginRight: '2rem',
    paddingTop: '1rem',
    borderTop: '1px solid #333'
  },
  label: {
    marginRight: '5px',
  },
};

class Total extends Component {
  render() {
    const { items } = this.props;
    //<Total items = .....>

    // `items` is the same variable as this.state.items in `App.js`
    // `Object.keys(items)` is an array of keys of the object `items`, which is `[1, 2]`
    // in this case
    // `.map(k => items[k])` will transform the array of keys to an array of the actual
    // items, what `map` here does is for each key, the correponding value is returned
    // now I have all the items as an array
    // `.reduce((prev, item) => prev + item.price * item.quantity, 0)` loops through`the
    // items array pair by pair; for each item, I add the product of its price and
    // quantity to previous sum and returned it. `0` is the initial value.
    // By now I have the sum of prices all items. `.toFixed(2)` gives the sum with
    // two decimal precision
    
    //items is now passed ...
    const totalPrice = Object.keys(items)
      .map(k => items[k])
      .reduce((prev, item) => prev + item.price * item.quantity, 0)
      .toFixed(2);

    return (
      <div
        style={styles.container}
      >
        <span
          style={styles.label}
        >Total:</span>
        <Price
          price={totalPrice}
        />
      </div>
    );
  }
}

export default Total;
