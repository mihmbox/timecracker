import './projects.css';

import React from 'react';

var ProjectRow = React.createClass({
  render: function() {
    return (
      <div className="row">
        row-row
      </div>
    );
  }
});

function getItemsFromList() {
    const array = [];
    array.push(123);
    return array;
}

export default ProjectRow;
