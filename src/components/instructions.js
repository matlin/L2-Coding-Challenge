import StyledComponent from 'styled-components';
import React from 'react';
const InstructionsContainer = StyledComponent.div`
  max-width:650px;
  padding:15px;
  text-align:left;
  margin:0 auto;
`
function Instructions(props){
  return (
    <InstructionsContainer>
      <span style={{textAlign:"center"}}>
        <p><em>No items have been added.</em></p>
        <hr />
        <h3>Get started</h3>
        <p>To begin adding items type a <strong>query</strong> and click <strong>Add Products</strong> to populate your saved products</p>
      </span>
      <br />
      <h4>Filters</h4>
      <p>You can also filter you query results and saved products</p>
      <h5>Filtering the query</h5>
      <ul>
        <li><strong>Brand Name</strong>: Specifies which brand the search will be limited to.</li>
        <li><strong>Results</strong>: Specifies how many items will be added from the returned products.</li>
        <li><strong>Start at</strong>: Specifies the starting index that the result count will start in the returned products.</li>
        <li><strong>Sort By</strong>: Specifies the prefered order that results will be added.</li>
      </ul>
    </InstructionsContainer>
  );
}

export default Instructions;
