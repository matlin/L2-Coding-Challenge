import React, { Component } from "react";
import PropTypes from 'prop-types';
import StyledComponent from "styled-components";
import { FormGroup, FormControl, Button } from "react-bootstrap";

const StyledInput = StyledComponent.span`
  margin:10px;
  white-space: nowrap;
`;

const AdvancedOptions = StyledComponent.div`
  max-width: ${props => (props.show ? "1000px" : "0px")};
  white-space:nowrap;
  overflow:hidden;
  display:flex;
  align-items:center;
  transition: max-width 0.2s;
`;

class QueryBar extends Component {
  constructor() {
    super();
    this.state = {
      showAdvanced: false,
      searchParams: {
        query: "",
        brand: "",
        numResults: null,
        startAt: 0,
        sort: "relevance"
      }
    };
  }

  updateInputState = event => {
    const newSearchParams = Object.assign({}, this.state.searchParams, {
      [event.target.id]: event.target.value
    });
    this.setState({ searchParams: newSearchParams });
  };

  addProducts = () => {
    this.props.addItems(this.state.searchParams);
  };

  static propTypes = {
    addItems: PropTypes.func.isRequired
  }

  render() {
    return (
      <div>
        <form>
          <FormGroup
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
            onChange={this.updateInputState}
          >
            <StyledInput>
              <FormControl id="query" placeholder="Query (required)" />
            </StyledInput>
            <AdvancedOptions show={this.state.showAdvanced}>
              <StyledInput>
                <FormControl id="brand" placeholder="Brand Name" />
              </StyledInput>
              <StyledInput>
                <FormControl id="numItems" placeholder="Results" />
              </StyledInput>
              <StyledInput>
                <FormControl id="start" placeholder="Start at" />
              </StyledInput>
              <StyledInput>
                Sort By:
                <select id="sort" title="Sort By">
                  <option value="relevance">Relevance</option>
                  <option value="price">Price</option>
                  <option value="title">Title</option>
                  <option value="bestseller">Bestseller</option>
                  <option value="customerRating">Customer Rating</option>
                  <option value="new">New</option>
                </select>
              </StyledInput>
            </AdvancedOptions>
            <a
              onClick={() => {
                this.setState({ showAdvanced: !this.state.showAdvanced });
              }}
            >
              {this.state.showAdvanced ? "Hide Advanced" : "Show Advanced"}
            </a>
            <StyledInput>
              <Button onClick={this.addProducts} bsStyle="primary">
                Add Products
              </Button>
            </StyledInput>
          </FormGroup>
        </form>
      </div>
    );
  }
}

export default QueryBar;
