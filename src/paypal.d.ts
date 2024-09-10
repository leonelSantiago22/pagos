declare namespace paypal {
  interface ButtonsOptions {
    createOrder: (data: any, actions: any) => Promise<any>;
    onApprove: (data: any, actions: any) => Promise<any>;
  }

  function Buttons(options: ButtonsOptions): any;
}

declare var paypal: {
  Buttons: typeof paypal.Buttons;
};
