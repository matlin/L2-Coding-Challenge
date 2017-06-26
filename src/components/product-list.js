import React from "react";
import { Button } from "react-bootstrap";
import StyledComponent from "styled-components";
import ReactDataGrid from "react-data-grid";
import Instructions from "./instructions.js";
import { Editors} from "react-data-grid-addons";
const { AutoComplete: AutoCompleteEditor } = Editors;

const cellHeight = 70;

const TableHeader = StyledComponent.div`
  text-align:center;
  width:100%;
  padding:5px;
  display:flex;
  align-items:center;
`;

const Thumbnail = StyledComponent.img`
  max-height: 50px;
  max-width: 50px;
  float:left;
`;

const CellWrapper = StyledComponent.div`
  white-space: normal;
  display: flex;
  justify-content:space-between;
  align-items: center;
  height: ${cellHeight}px
`;

const SearchBar = StyledComponent.div`
  border: 1px solid gray;
  padding: 2px;
  float:left;
  border-radius:5px;
  width:180px;
`;

class ProductList extends React.Component {

  createColumns = brands => {
    const brandOptions = brands.map((brand, i) => ({ id: i, title: brand }));
    const columns = [
      {
        key: "prod",
        formatter: FormatName,
        name: "Product",
        width: 300,
        resizable: true
      },
      {
        key: "brand",
        name: "Brand Name",
        editor: <AutoCompleteEditor options={brandOptions} />,
        sortable: true,
        resizable: true
      },
      { key: "cat", name: "Category", resizable: true },
      { key: "price", name: "Price", sortable: true, resizable: true },
      { key: "msrp", name: "MSRP", sortable: true, resizable: true },
      { key: "rating", formatter: StarRating, name: "Reviews", sortable: true },
      {
        key: "remove",
        width: 80,
        name: "Remove",
        formatter: DeleteButton,
        headerRenderer: <span className="glyphicon glyphicon-floppy-remove" />
      }
    ];
    return columns;
  };

  rowGetter(i) {
    if (this.props.loading) {
      return "Loading items";
    }
    const {
      thumbnailImage,
      productUrl,
      name,
      categoryPath,
      salePrice,
      msrp,
      customerRating,
      numReviews,
      itemId,
      brand
    } = this.props.items[i];
    return {
      prod: { thumbnail: thumbnailImage, name, link: productUrl },
      brand,
      cat: categoryPath.split("/").join(" > "),
      price: salePrice != null ? "$" + salePrice : "(none)",
      msrp: msrp != null ? "$" + msrp : "(none)",
      rating: { rating: customerRating, numReviews },
      key: itemId,
      remove: () => {
        this.props.removeItem(itemId);
      }
    };
  }

  handleGridRowsUpdated = action => {
    const { updated, fromRowData } = action;
    this.props.updateItem(fromRowData.key, updated);
  };

  render() {
    return (
      <div>
        <TableHeader>
          <SearchBar>
            <span className="glyphicon glyphicon-search" />
            <input
              onChange={event => {
                this.props.updateFilter(event.target.value);
              }}
              style={{ border: "none" }}
              type="text"
              name="search_filter"
            />
          </SearchBar>
          <span style={{ marginLeft: "calc(50% - 180px)" }}>
            {this.props.items.length} of {this.props.totalItems}
          </span>
        </TableHeader>
        <ReactDataGrid
          enableCellSelect={true}
          onGridSort={this.props.changeSort}
          columns={this.createColumns(this.props.brands)}
          rowGetter={this.rowGetter.bind(this)}
          rowsCount={this.props.items.length}
          onGridRowsUpdated={this.handleGridRowsUpdated}
          headerRowHeight={35}
          rowHeight={cellHeight}
          minHeight={500}
          emptyRowsView={Instructions}
        />
      </div>
    );
  }
}

function FormatName({ value }) {
  const { thumbnail, name, link } = value;
  return (
    <CellWrapper>
      <Thumbnail src={thumbnail} />{name}
      <a target="_blank" rel="noopener noreferrer" href={link}>
        <Button><span className="glyphicon glyphicon-new-window" /></Button>
      </a>
    </CellWrapper>
  );
}

function StarRating({ value }) {
  const { rating, numReviews } = value;
  if (rating == null || numReviews == null) return <span>(none)</span>;
  let stars = [];
  for (var i = 0; i < 5; i++) {
    if (i + 1 <= Math.floor(rating)) {
      stars.push(
        <span style={{ color: "gold" }} className="glyphicon glyphicon-star" />
      );
    } else {
      stars.push(<span className="glyphicon glyphicon-star-empty" />);
    }
  }
  return (
    <span style={{ whiteSpace: "nowrap" }}>
      {stars} ({numReviews})
    </span>
  );
}

function DeleteButton({ value: func }) {
  return (
    <Button>
      <span className="glyphicon glyphicon-remove" onClick={func} />
    </Button>
  );
}

export default ProductList;
