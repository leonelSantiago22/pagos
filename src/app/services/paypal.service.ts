import { isPlatformBrowser } from '@angular/common';
import { Injectable } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaypalService {
  private scriptLoaded: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  loadPaypalScript(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.scriptLoaded && isPlatformBrowser(this.platformId)) {
        const script = document.createElement('script');
        script.src =
          'https://www.paypal.com/sdk/js?client-id=AV1i5QGxT3X6VbR0OcURo73ZUjUs1NEga5oGYl_Gm2EiEKRKPWi0T-QrTMnEF9jKYYQworGXnWSsDCeS&currency=MXN'; // Se añade el parámetro currency=MXN
        script.onload = () => {
          this.scriptLoaded = true;
          resolve();
        };
        script.onerror = () => {
          console.error('Error al cargar el SDK de PayPal');
          reject('Error al cargar el SDK de PayPal');
        };
        document.body.appendChild(script);
      } else {
        resolve(); // El SDK ya está cargado
      }
    });
  }
}
