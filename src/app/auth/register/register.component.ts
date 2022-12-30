import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css' ]
})
export class RegisterComponent implements OnInit {

  public formSubmitted = false;

  public registerForm = this.fb.group({
    nombre: [ 'Adniel', Validators.required ],
    email: ['test@gmail.com', [Validators.required, Validators.email]],
    password: ['123456', Validators.required],
    password2: ['123456', Validators.required],
    terminos: [true, Validators.required],
  }, {
    validators: this.passwordsIguales('password', 'password2')
  });

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
  }

  crearUsuario() {
    this.formSubmitted = true;
    //console.log(this.registerForm.value);
        
    if ( this.registerForm.invalid ) {
      return;
    } 

    this.usuarioService.crearUsuario(this.registerForm.value)
      .subscribe({
        next: (resp) => {
          console.log('Usuario creado');
          console.log(resp);
        },
        error: (error) => {
          Swal.fire('Error', error.error.msg, 'error');
        }
      });
  }

  campoNoValido( campo: string ): boolean {
    
    if (this.registerForm.get(campo)?.invalid && this.formSubmitted ) {
      return true;
    }
    return false;
  }

  aceptaTerminos() {
    return !this.registerForm.get('terminos')?.value && this.formSubmitted;
  }

  contrasennasNoValidas() {
    const pass1 = this.registerForm.get('password');
    const pass2 = this.registerForm.get('password2');

    if ( (pass1?.value !== pass2?.value) && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  }

  passwordsIguales(pass1: string, pass2: string) {
    return ( formGroup: FormGroup ) => {
      const pass1Control = formGroup.get(pass1);
      const pass2Control = formGroup.get(pass2);

      if (pass1Control?.value === pass2Control?.value) {
        pass2Control?.setErrors(null);
      } else {
        pass2Control?.setErrors({ noEsIgual: true });
      }
    }
  }

}
