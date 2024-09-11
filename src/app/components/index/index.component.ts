import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Inject,
  PLATFORM_ID,
  NgZone,
  AfterViewInit,
} from '@angular/core';
import { PaypalService } from '../../services/paypal.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importa FormsModule para usar ngModel
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, FormsModule], // Asegúrate de incluir FormsModule
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit, AfterViewInit {
  currentStep: number = 0;
  maxSteps: number = 3;
  stepsArray: number[] = [];
  nombre: string = ''; // Para almacenar el nombre ingresado
  clave: string = ''; // Para almacenar la clave ingresada
  errorMessage: string = ''; // Para mostrar un mensaje de error si es necesario

  // Define los valores correctos para el nombre y la clave
  private validName: string = 'Juan';
  private validClave: string = '1234';

  producto = {
    descripcion: 'producto en venta',
    precio: 200.0,
    img: 'imagen',
  };

  @ViewChild('paypal', { static: false }) paypalElement!: ElementRef;

  constructor(
    private paypalService: PaypalService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private router: Router
  ) {
    this.stepsArray = Array.from({ length: this.maxSteps }, (_, i) => i);
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    // No inicializamos PayPal aquí, lo haremos cuando lleguemos al paso final
  }

  // Función para validar tanto el nombre como la clave
  validateAndProceed() {
    if (
      this.nombre.trim().toLowerCase() === this.validName.toLowerCase() &&
      this.clave === this.validClave
    ) {
      this.errorMessage = ''; // Limpiar el mensaje de error si todo es correcto
      this.nextStep(); // Avanza al siguiente paso
    } else {
      // Si no coinciden, muestra el mensaje de error
      this.errorMessage =
        'El nombre o la clave son incorrectos. Intenta de nuevo.';
    }
  }

  nextStep() {
    if (this.currentStep < this.maxSteps - 1) {
      this.currentStep++;

      // Verificamos si hemos llegado al último paso
      if (this.currentStep === this.maxSteps - 1) {
        this.initPaypal();
      }
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  isCurrentStep(step: number): boolean {
    return this.currentStep === step;
  }

  initPaypal() {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        this.paypalService
          .loadPaypalScript()
          .then(() => {
            this.renderPaypalButton();
          })
          .catch((error: any) => {
            console.error('Error al cargar el SDK de PayPal:', error);
          });
      });
    }
  }

  renderPaypalButton() {
    if (!this.paypalElement) {
      console.error('El elemento #paypal no fue encontrado');
      return;
    }

    if (typeof window !== 'undefined' && (window as any).paypal) {
      const buttons = (window as any).paypal.Buttons({
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
            Swal.fire({
              title: 'Pago realizado con éxito!',
              text: 'Tu transacción ha sido completada.',
              icon: 'success',
            });

            // Reiniciar al primer paso
            this.ngZone.run(() => {
              this.currentStep = 0; // Regresar al paso inicial
            });
          });
        },
      });

      buttons.render(this.paypalElement.nativeElement);
    } else {
      console.error('PayPal SDK no está cargado');
    }
  }

  navigate() {
    this.router.navigate(['/']);
  }
}
