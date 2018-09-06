import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { throwError } from 'rxjs';
import { catchError } from "rxjs/internal/operators/catchError";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ErrorComponent } from "./error.component";
// this interceptor will catch the error status of the HTTP requests
// after the execution
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private dialog: MatDialog) {}
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                // return the error object
                let errorMessage = 'Unknown error occured';
                if (error.error.message) {
                    errorMessage = error.error.message;
                }
                this.dialog.open(ErrorComponent, {data: {message: errorMessage}});
                console.log('errorinterceptor-', error);
                return throwError(error);
            })
        );
    }
}
