'use strict';

var React = require('react');
var d3 = require('d3');


module.exports = React.createClass({

  displayName: 'Arc',

  propTypes: {
    fill: React.PropTypes.string,
    d: React.PropTypes.string,
    startAngle: React.PropTypes.number,
    endAngle: React.PropTypes.number,
    innerRadius: React.PropTypes.number,
    outerRadius: React.PropTypes.number,
    labelTextFill: React.PropTypes.string,
    valueTextFill: React.PropTypes.string,
    sectorBorderColor: React.PropTypes.string,
    showInnerLabels: React.PropTypes.bool,
    showOuterLabels: React.PropTypes.bool
  },

  getDefaultProps:function() {
    return {
      labelTextFill: 'black',
      valueTextFill: 'white',
      showInnerLabels: true,
      showOuterLabels: true
    };
  },

  handleOnClick() {
    this.props.handleOnClick(this.props.label);
  },

  render:function() {
    var props = this.props;

    var arc = d3.svg.arc()
      .innerRadius(props.innerRadius)
      .outerRadius(props.outerRadius)
      .startAngle(props.startAngle)
      .endAngle(props.endAngle);

    return (
      React.createElement("g", {className: "rd3-piechart-arc"}, 
        React.createElement("path", {
          d: arc(), 
          fill: props.fill, 
          stroke: props.sectorBorderColor, 
          onMouseOver: props.handleMouseOver, 
          onMouseLeave: props.handleMouseLeave,
          onClick: this.handleOnClick}
        ), 
        props.showOuterLabels ? this.renderOuterLabel(props, arc) : null, 
        props.showInnerLabels ? this.renderInnerLabel(props, arc) : null
      )
    );
  },

  renderInnerLabel:function(props, arc) {
    // make value text can be formatted
    var formattedValue = props.valueTextFormatter(props.value);
    return (
        React.createElement("text", {
          className: "rd3-piechart-value", 
          transform: ("translate(" + arc.centroid() + ")"), 
          dy: ".35em", 
          style: {
            'shapeRendering': 'crispEdges',
            'textAnchor': 'middle',
            'fill': props.valueTextFill
          }}, 
           formattedValue 
        )
      );
  },

  renderOuterLabel:function(props, arc) {

    var rotate = ("rotate(" + ( (props.startAngle+props.endAngle)/2 * (180/Math.PI)) + ")");
    var positions = arc.centroid();
    var radius = props.outerRadius;
    var dist   = radius + 35;
    var angle  = (props.startAngle + props.endAngle) / 2;
    var x      = dist * (1.2 * Math.sin(angle));
    var y      = -dist * Math.cos(angle);
    var t = ("translate(" + x + "," + y + ")");

    return  (
      React.createElement("g", null, 
        React.createElement("line", {
          x1: "0", 
          x2: "0", 
          y1: -radius - 2, 
          y2: -radius - 26, 
          stroke: props.labelTextFill, 
          transform: rotate, 
          style: {
            'fill': props.labelTextFill,
            'strokeWidth': 2
          }
          }
        ), 
        React.createElement("text", {
          className: "rd3-piechart-label", 
          transform: t, 
          dy: ".35em", 
          style: {
            'textAnchor': 'middle',
            'fill': props.labelTextFill,
            'shapeRendering': 'crispEdges'
          }}, 
          props.label
        )
      )
    );
  }
});
