import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Inject,
  PLATFORM_ID,
  NgZone,
} from '@angular/core';
import { PaypalService } from '../../services/paypal.service';
import { isPlatformBrowser } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit {
  @ViewChild('paypal', { static: true }) paypalElement!: ElementRef;

  producto = {
    descripcion: 'producto en venta',
    precio: 200.0,
    img: 'imagen',
  };

  constructor(
    private paypalService: PaypalService,
    @Inject(PLATFORM_ID) private platformId: Object, // Inyección de PLATFORM_ID
    private ngZone: NgZone // Inyección de NgZone
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Solo en el navegador
      this.ngZone.runOutsideAngular(() => {
        this.paypalService
          .loadPaypalScript()
          .then(() => {
            this.initPaypal();
          })
          .catch((error: any) => {
            console.error('Error al cargar el SDK de PayPal:', error);
          });
      });
    } else {
      console.warn('PayPal SDK no puede ser cargado porque estamos en SSR');
    }
  }

  initPaypal() {
    if (typeof window !== 'undefined' && (window as any).paypal) {
      (window as any).paypal
        .Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: this.producto.descripcion,
                  amount: {
                    currency_code: 'MXN',
                    value: this.producto.precio,
                  },
                },
              ],
            });
          },
          onApprove: (data: any, actions: any) => {
            return actions.order.capture().then((details: any) => {
              alert(
                'Transaction completed by ' + details.payer.name.given_name
              );
            });
          },
        })
        .render(this.paypalElement.nativeElement);
    } else {
      console.error('PayPal SDK no está cargado');
    }
  }
}
