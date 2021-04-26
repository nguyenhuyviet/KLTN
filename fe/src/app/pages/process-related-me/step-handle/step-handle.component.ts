import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProcessExecutionService } from '../../../services/process-exe.service';

@Component({
  selector: 'ngx-step-handle',
  templateUrl: './step-handle.component.html',
  styleUrls: ['./step-handle.component.scss']
})
export class StepHandleComponent implements OnInit {


  processExeID;

  isLoading = false;

  currentStep;

  listPrevStep;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private processExeSV: ProcessExecutionService,
  ) { }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.processExeID = +params['processExecutionId']; // (+) converts string 'id' to a number         
      if (this.processExeID && !isNaN(this.processExeID)) {
          
      } else {
        this.router.navigateByUrl("not-found");
      }
    });
  }
  

  backToProcess() {

  }
}
