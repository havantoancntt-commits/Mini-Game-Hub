import React from 'react';

const PayPalIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.326 4.229c.254.02.508.04.762.062 1.488.124 2.914.473 4.215 1.229 1.42.827 2.431 2.043 2.876 3.653.473 1.71-.166 3.32-.872 4.645-.705 1.325-1.77 2.318-3.13 2.938-1.285.589-2.734.832-4.246.685-1.956-.186-3.71-.99-5.07-2.438-.588-.63-1.01-1.38-1.264-2.227-.254-.847-.318-1.755-.166-2.664.15-1.037.548-2.01 1.226-2.83.659-.8 1.542-1.428 2.597-1.84.445-.175.91-.312 1.375-.417m3.172 1.458c-.14 0-.28.004-.42.012-.64.037-1.28.15-1.905.358-.625.207-1.226.5-1.769.907-.544.407-.98.92-1.29 1.527-.245.478-.41 1-.49 1.543-.08.543-.06 1.1.05 1.64.11.54.32 1.05.64 1.52.32.47.74.88 1.24 1.2.5.32 1.07.56 1.68.7.61.14 1.25.18 1.88.1.63-.08 1.24-.26 1.81-.54.57-.28 1.08-.66 1.5-1.12.42-.46.75-.99.96-1.58.21-.59.3-1.23.24-1.88-.06-.65-.26-1.27-.58-1.83-.32-.56-.76-1.05-1.28-1.43-.52-.38-1.1-.66-1.72-.82-.62-.16-1.25-.22-1.88-.16m-2.91 1.594c.316-.01.63-.02.946-.02.472 0 .944.02 1.412.08.47.06.92.17 1.34.36.42.19.79.46 1.09.8.3.34.52.75.64 1.2.12.45.13.92.04 1.38-.09.46-.28.9-.56 1.28-.28.38-.65.7-1.08.92-.43.22-.92.35-1.42.38-.5.03-1 .02-1.5-.02-.5-.04-1-.12-1.48-.26-.48-.14-.94-.34-1.34-.62-.4-.28-.73-.64-.96-1.06-.23-.42-.36-.88-.36-1.36 0-.48.11-.96.34-1.4.23-.44.56-.84 1-1.16.44-.32.94-.56 1.48-.7.25-.06.5-.1.75-.12z" />
    </svg>
);

const Footer: React.FC = () => {
  return (
    <footer className="w-full text-center py-6 mt-auto">
      <a 
        href="https://www.paypal.me/TOANVAIO" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center px-5 py-2.5 font-semibold text-slate-300 bg-slate-800/60 rounded-lg 
                   border border-slate-700 hover:border-cyan-400 hover:text-white
                   shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-cyan-500/10
                   transform hover:scale-105 transition-all duration-300 
                   focus:outline-none focus:ring-4 focus:ring-offset-2 
                   focus:ring-offset-slate-900 focus:ring-cyan-300"
        aria-label="Donate to the developer via PayPal"
      >
        <PayPalIcon />
        Support the Developer
      </a>
    </footer>
  );
};

export default Footer;
