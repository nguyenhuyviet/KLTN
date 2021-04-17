import { Input, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { ProcessStatusEnum } from '../../../enums/process-status.enum';

@Component({

    template: `{{renderValue}}`
})
export class ProcessStatusCol implements OnInit {

    renderValue: string;

    @Input() value: string | number;
    @Input() rowData: any;

    ngOnInit() {
        switch (this.value) {
            case ProcessStatusEnum.Active:
                this.renderValue = "Đang hoạt động";
                break;
            case ProcessStatusEnum.InActive:
                this.renderValue = "Ngưng hoạt động";
                break;
            case ProcessStatusEnum.Draf:
                this.renderValue = "Phác thảo";
                break;
            case ProcessStatusEnum.Stop:
                this.renderValue = "Ngừng sử dụng";
                break;
            default:
                this.renderValue = "Không xác định";
                break;
        }

    }
}