import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm, FormsModule } from '@angular/forms';
import { AuthService } from "../auth.service";
import { Subscription } from "rxjs";
@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy{
    authStatusSub: Subscription;
    isLoading = false;
    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
            authStatus => {
                if (!authStatus) {
                 this.isLoading = false;
                }
            }
        );
     }

    onLogin(form: NgForm) {
        if (form.invalid) {
            return;
        }
        this.authService.login(form.value.email, form.value.password);
    }

    ngOnDestroy(): void {
        this.authStatusSub.unsubscribe();
    }
}
