import React from 'react';

const InfoBox = ({ title, description }) => (
  <div style={{ textAlign: 'left', padding: '1px', maxWidth: '200px', margin: '10px auto' }}>
    <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>{title}</h4>
    <p style={{ fontSize: '12px', color: '#555' }}>{description}</p>
  </div>
);

export default InfoBox;
