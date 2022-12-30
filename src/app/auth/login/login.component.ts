import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginForm } from 'src/app/interfaces/login-form.interface';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email!: string;

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false]
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService:UsuarioService
  ) { }

  ngOnInit(): void {
    let email = localStorage.getItem('email') || '';
    //Si el usuario escogió redordar sesión 
    if (email.length > 0) {
      this.loginForm.setValue({'email': email, 'password': '', 'remember': true}); 
    }
  }

  login() {
    //console.log(this.loginForm.value);
    const loginObj: LoginForm = { 
      email: this.loginForm.get('email')!.value,
      password: this.loginForm.get('password')!.value,
      remember: this.loginForm.get('remember')!.value
    };
    this.usuarioService.login(loginObj)
      .subscribe({
        next: (resp) => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          Swal.fire('Error', error.message, 'error');
        }
      });
    //this.router.navigateByUrl('/');
  }

}
