import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";

@Component({
    templateUrl: './error-component.html'
})
export class ErrorComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}) {
        console.log('error component', data );
    }
    message = 'An unknown error occured';

}
