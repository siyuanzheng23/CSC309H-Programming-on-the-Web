import React, { Component } from 'react';



import Header from './Header';
import Cart from './Cart';
import Total from './Total';

class App extends Component {
  constructor() {
    super();


    this.state = {
      items: {
        1: {
          id: 1,
          name: 'Design Patterns: Elements of Reusable Object-Oriented Software',
          price: 57.71,
          quantity: 1,
        },
        2: {
          id: 2,
          name: 'React: Up & Running: Building Web Applications',
          price: 42.81,
          quantity: 1,
        },
      },
    };

    this.updateQuantity = this.updateQuantity.bind(this);
  }


  updateQuantity(id, newQuantity) {
    const newItem = Object.assign({}, this.state.items[id], {
      quantity: newQuantity,
    });

    this.setState({
      items: Object.assign({}, this.state.items, {
        [id]: newItem,
      }),
    });
  }

  render() {
    return (
      <div>
        <Header />
        <Cart
          items={this.state.items}
          updateQuantity={this.updateQuantity}
        />
        <Total
          items={this.state.items}
        />
      </div>
    );
  }
}

export default App;
