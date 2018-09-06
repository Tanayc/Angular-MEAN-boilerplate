import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit, OnDestroy {

    authStatusSub: Subscription;
    isLoading = false;
    constructor(public authService: AuthService) {

    }

    ngOnInit(): void {
       this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
           authStatus => {
               if (!authStatus) {
                this.isLoading = false;
               }
           }
       );
    }

    onSignup(form: NgForm) {
        if (form.invalid) {
            return;
        }
        this.authService.createUser(form.value.email, form.value.password);
        this.isLoading = true;
    }

    ngOnDestroy(): void {
        this.authStatusSub.unsubscribe();
    }
}
