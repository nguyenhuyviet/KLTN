
import { EventEmitter, Injectable, Output } from '@angular/core';



@Injectable({ providedIn: 'root' })
export class TransferService {

    @Output() onshowChangePassword = new EventEmitter();

    showPopupChangePassword(isFisttimeLogin = false){
        this.onshowChangePassword.emit(isFisttimeLogin);
    }
}
