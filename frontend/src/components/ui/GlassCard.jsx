import React from 'react';

const GlassCard = ({ children, className = '', ...props }) => (
  <div className={`glass rounded-3xl p-5 sm:p-6 shadow-glow ${className}`} {...props}>
    {children}
  </div>
);

export default GlassCard;
