import React, { Component } from "react";
import ProductList from "./components/product-list.js";
import QueryBar from "./components/query-bar.js";
import "./App.css";
import WalmartSearch from "./walmart-search.js";
import Fuse from "fuse.js";

const apiKey = "mawgr37qxcnnkdd7nmubgeje";

class App extends Component {
  constructor() {
    super();
    const items = JSON.parse(window.localStorage.getItem("items")) || {};
    this.state = {
      query: {},
      sortDirection: "ASC",
      sortColumn: "NONE",
      filters: "",
      brands: this.updateBrands(items),
      items
    };
    this.api = new WalmartSearch(apiKey);
  }

  //gets all brands from items and updates states with counts
  updateBrands(items, oldItems = {}){
    let brands = Object.values(items).reduce((acc, curr) => {
      if (curr.brand == null) return acc;
      if (acc[curr.brand]) return Object.assign({}, acc, {[curr.brand]: acc[curr.brand]+1});
      return Object.assign({}, acc, {[curr.brand]: 1});
    }, oldItems);
    return brands;
  }

  //updates state and localStorage
  updateItems(newItems) {
    window.localStorage.setItem("items", JSON.stringify(newItems));
    this.setState({ items:  newItems, brands: this.updateBrands(newItems, this.state.brands)});
  }

  //takes a query and adds results to current collection of items
  addItems({ query, brand, numItems, sort, start }) {
    const queryObj = {
      query,
      facet: "on",
      "facet.filter": `brand:${brand}`,
      numItems,
      sort,
      start
    };
    this.api.search(queryObj).then(data => {
      if (data.totalResults === 0 || data.numResults === 0) {
        window.alert(data.message);
        return;
      }
      let itemsObj = {};
      for (let item of data.items) {
        itemsObj[item.itemId] = item;
      }
      let newItems = Object.assign({}, this.state.items, itemsObj);
      this.updateItems(newItems)
    });
  }

  //filters list with a fuzzy search query
  filter(list, query) {
    if (query == null || query.length === 0) return list;
    var options = {
      threshold: 0.4,
      findAllMatches: true,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ["name", "shortDescription", "longDescription"]
    };
    const fuse = new Fuse(list, options);
    return fuse.search(query);
  }

  sort(list, sortColumn, sortDirection) {
    let key;
    switch(sortColumn){
      case "price":
        key = "salePrice";
        break;
      case "rating":
        key="customerRating";
        break;
      default:
        key = sortColumn
    }
    const comparer = (a, b) => {
      if (a[key] === b[key]) return 0;
      if (sortDirection === 'ASC') {
        if (a[key] === undefined) return 1;
        return (a[key] > b[key]) ? 1 : -1;
      } else if (sortDirection === 'DESC') {
        if (a[key] === undefined) return 1;
        return (a[key] < b[key]) ? 1 : -1;
      }
    };

    const rows = sortDirection === 'NONE' ? list.concat() : list.concat().sort(comparer);
    return rows;
  }

  removeItem(id) {
    let items = JSON.parse(window.localStorage.getItem("items"));
    delete items[id];
    this.updateItems(items)
  }

  updateItem(key, vals){
    const newItem = Object.assign({}, this.state.items[key], vals);
    const newItems = Object.assign({}, this.state.items, {[key]: newItem});
    //update counts of brands
    const oldBrand = this.state.items[key].brand;
    const newBrand = newItem.brand;
    if (oldBrand !== newBrand){
      let decrement = {[oldBrand]: this.state.brands[oldBrand]-1};
      let increment = {[newBrand]: this.state.brands[newBrand]+1 || 1}
      this.setState({brands: Object.assign({}, this.state.brands, decrement, increment)});
    }
    this.updateItems(newItems);
  }

  render() {
    const items = this.sort(this.filter(
      Object.values(this.state.items),
      this.state.filter
    ), this.state.sortColumn, this.state.sortDirection);
    return (
      <div className="App">
        <QueryBar addItems={this.addItems.bind(this)} />
        <ProductList
          brands={Object.keys(this.state.brands)}
          totalItems={Object.keys(this.state.items).length}
          changeSort={(sortColumn, sortDirection) => {this.setState({sortColumn, sortDirection});}}
          removeItem={this.removeItem.bind(this)}
          updateItem={this.updateItem.bind(this)}
          updateFilter={query => {
            this.setState({ filter: query });
          }}
          items={items}
        />
      </div>
    );
  }
}

export default App;
