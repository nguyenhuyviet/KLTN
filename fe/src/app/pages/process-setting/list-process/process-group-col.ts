import { Input, OnInit } from '@angular/core';
import { Component } from '@angular/core';

@Component({

    template: `{{renderValue}}`
})
export class ProcessGroupCol implements OnInit {

    renderValue: string;

    @Input() value: any;
    @Input() rowData: any;

    ngOnInit() {
       this.renderValue = this.value? this.value.ProcessGroupName : '';

    }
}