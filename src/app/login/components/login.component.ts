import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService) { }

  ngOnInit() {

  }

  onSubmit(loginForm: NgForm) {
    this.authService.login(loginForm.value.email, loginForm.value.password);
    loginForm.reset();
  }

  ngOnDestroy(): void {

  }
}
