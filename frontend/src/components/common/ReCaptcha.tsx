import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface ReCaptchaProps {
  onVerify: (token: string | null) => void;
}

export const ReCaptcha: React.FC<ReCaptchaProps> = ({ onVerify }) => {
  const SITE_KEY = '6Lf9jbMqAAAAAABfIcQB5lQ7SRnmDaCoVD7L_zr1'; // Your site key

  return (
    <ReCAPTCHA
      sitekey={SITE_KEY}
      onChange={onVerify}
      className="transform scale-90" // Adjust size if needed
    />
  );
};