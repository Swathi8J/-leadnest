import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = '';
  password = '';
  error: string | null = null;
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  async submit(): Promise<void> {
    this.error = null;
    this.loading = true;
    try {
      await this.authService.login(this.email, this.password);
      await this.router.navigateByUrl('/');
    } catch {
      this.error = 'Could not sign in. Check the email and password and try again.';
    } finally {
      this.loading = false;
    }
  }
}
