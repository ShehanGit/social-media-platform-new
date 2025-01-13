declare global {
    interface Window {
      grecaptcha: {
        render: (
          container: HTMLElement,
          params: {
            sitekey: string;
            callback: (token: string) => void;
          }
        ) => void;
        reset: () => void;
      };
      onloadCallback: () => void;
    }
  }
  
  export {};