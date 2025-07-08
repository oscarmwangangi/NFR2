import React from 'react';
import PropTypes from 'prop-types';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="custom-tooltip relative bg-[#1a1a1a] text-white px-3 py-2 rounded shadow-md">
      <div className="text-sm font-semibold">{payload[0].name}</div>
      <div className="text-xs">{payload[0].value} orders</div>
      <div className="tooltip-arrow" />
    </div>
  );
};
export default CustomTooltip;