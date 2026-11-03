import React from 'react';
import { API_BASE_URL } from '../services/apiConfig';

interface PortalLogoProps {
  alt: string;
  className: string;
}

export const PortalLogo: React.FC<PortalLogoProps> = ({ alt, className }) => (
  <img src={`${API_BASE_URL}/logo`} alt={alt} className={className} />
);
