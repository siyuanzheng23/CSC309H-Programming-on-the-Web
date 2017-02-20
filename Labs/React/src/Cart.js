import React, { Component } from 'react';

import CartHeader from './CartHeader';
import Item from './Item';

const styles = {
  container: {
    marginLeft: '2rem',
    marginRight: '2rem',
    marginTop: '1rem',
    marginBottom: '1rem',
  },
};

class Cart extends Component {
  render() {
    const { items, updateQuantity } = this.props;
    // <cart items = {''} , updateQuantity = {''}/>

    return (
      <div
        style={styles.container}
      >
        <CartHeader />
        {
          Object.values(items).map((item, i) => {
            return (
              <Item
                item={item}
                key={`cart-${i}`}
                updateQuantity={updateQuantity}
              />
            );
          })
        }
      </div>
    );
  }
}

export default Cart;
