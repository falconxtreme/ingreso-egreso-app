import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent implements OnInit {
  constructor(private _authService: AuthService, private _router: Router) {}

  ngOnInit(): void {}

  public logout() {
    Swal.fire('Espere por favor...', '', 'info');
    Swal.showLoading();
    this._authService
      .logout()
      .then((resp) => {
        Swal.close();
        console.log(resp);
        this._router.navigate(['/login']);
      })
      .catch((err) => {
        Swal.fire('Oops', err.message, 'error');
        console.error(err);
      });
  }
}
