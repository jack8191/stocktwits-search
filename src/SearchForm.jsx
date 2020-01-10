import React from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import SymbolList from './SymbolList';

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stockSymbols: [],
      value: '',
      message: '',
      twits: [],
      symbolsToRemove: '',
      symbolsToAdd: [],
    };
  }

  componentDidUpdate(prevProps, prevState) {
    clearInterval(this.timer)
    if (prevState.stockSymbols !== this.state.stockSymbols) {
      this.searchTwits();
    }
    this.timer = setInterval(() => {
      if (this.state.stockSymbols) {
        return this.searchTwits();
      }
    }, 10000);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  onSymbolButtonClick = (symbolToRemove) => {
    const filteredSymbols = this.state.stockSymbols.filter((stockSymbol) => stockSymbol !== symbolToRemove);
    this.setState({
      stockSymbols: filteredSymbols,
    });
  };


  handleChange = (event) => {
    const upperCaseTarget = event.target.value.toUpperCase();
    const splitTarget = upperCaseTarget.split(' ');
    const combinedTarget = this.state.stockSymbols.concat(splitTarget)
    const filteredTarget = [...new Set(combinedTarget)]
    this.setState({
      value: event.target.value,
      symbolsToAdd: filteredTarget,
    });
  };

  searchTwits() {
    const { stockSymbols } = this.state;
    this.setState({
      twits: [],
    });
    if (stockSymbols) {
      stockSymbols.forEach((symbol) => {
        fetch(`http://localhost:8000/${symbol}`, {
          method: 'GET',
        })
          .then((res) => {
            if (!res.ok) {
              this.setState({
                message: 'Search failed. Please try again.',
              });
              return Promise.reject(res.statusText);
            }
            return res.json();
          })
          .then((res) => {
            const updatedTwits = this.state.twits.concat(res);
            this.setState({
              twits: updatedTwits,
              message: '',
            });
          });
      });
    }
  }

  addInputToState(event) {
    event.preventDefault();
    if (this.state.stockSymbols.length > 9) {
      this.setState({
        message: 'Max number of symbols reached.',
      });
    }
      const { stockSymbols, symbolsToAdd } = this.state;
      const combinedSymbols = stockSymbols.concat(symbolsToAdd)
      const validatedSymbols = [...new Set(combinedSymbols)]
      this.setState({
        stockSymbols: validatedSymbols,
        value: '',
        message: '',
        symbolsToAdd: [],
      });
  }


  render() {
    const { message } = this.state;
    if (this.state.stockSymbols.length >= 1) {
      return (
        <Col>
          <h1>Stocktwit Searcher</h1>
          <p>Enter stock symbols to search. You may input multiple symbols with spaces separating.</p>
          <Form onSubmit={(event) => this.addInputToState(event)}>
            <Form.Group controlId="formStockSymbols">
              <Form.Label>Search</Form.Label>
              <Form.Control required type="text" placeholder="Input stock symbols" value={this.state.value} onChange={(event) => this.handleChange(event)} />
              {message}
            </Form.Group>
            <Button variant="primary" type="submit">
            Submit
            </Button>
          </Form>
          <SymbolList twitList={this.state.twits} remove={this.onSymbolButtonClick} />
        </Col>
      );
    }

    return (
      <Col>
        <h1>Stocktwit Searcher</h1>
        <p>Enter stock symbols to search. You may input multiple symbols with spaces separating.</p>
        <Form onSubmit={(event) => this.addInputToState(event)}>
          <Form.Group controlId="formStockSymbols">
            <Form.Label>Search</Form.Label>
            <Form.Control required type="text" placeholder="Input stock symbols" value={this.state.value} onChange={(event) => this.handleChange(event)} />
            {message}
          </Form.Group>
          <Button variant="primary" type="submit">
          Submit
          </Button>
        </Form>
      </Col>
    );
  }
}

export default SearchForm;
