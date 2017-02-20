import React, { Component } from 'react';

const styles = {
  container: {
    backgroundColor: '#f44336',
    // following line of code is from http://goratchet.com/
    backgroundImage: 'linear-gradient(45deg, #da0024, #0a1855)',
    paddingTop: '2rem',
    paddingBottom: '2rem',
    marginBottom: '1rem',
  },
  header: {
    marginTop: '0',
    marginBottom: '0',
    marginLeft: '2rem',
    marginRight: '2rem',
    color: '#fff',
  },
};

class Header extends Component {
  render() {
    return (
      <div
        style={styles.container}
      >
        <h1
          style={styles.header}
        >Shopping Cart</h1>
      </div>
    );
  }
}

export default Header;
