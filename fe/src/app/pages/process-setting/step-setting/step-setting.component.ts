import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode } from '../../../enums/form-mode.enum';
import { ProcessService } from '../../../services/process.service';

@Component({
  selector: 'app-step-setting',
  templateUrl: './step-setting.component.html',
  styleUrls: ['./step-setting.component.scss']
})
export class StepSettingComponent implements OnInit {

  isLoading = false;
  isLoadingStep = false;
  processID = -1;
  currentProcess;
  isEditInput = false;
  isShowInputStepName = false;
  stepAddSidebarName = "";
  currentStep;
  formMode = FormMode;

  @ViewChild('inputStepNameElm') inputStepNameElm: ElementRef;
  @ViewChild('inputProcessNameElm') inputProcessNameElm: ElementRef;

  constructor(
    private processSV: ProcessService,
    private route: ActivatedRoute,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.processID = +params['id']; // (+) converts string 'id' to a number         
      if (this.processID && !isNaN(this.processID)) {
        this.getAllStepByProcessID()
      } else {
        this.router.navigateByUrl("not-found");
      }
    });

    this.route.queryParamMap.subscribe(queryParams => {
      if (queryParams[`params`].stepId) {
        const stepID = +queryParams[`params`].stepId;
        this.getStepByID(queryParams[`params`].stepId);
      }
    });
  }



  getAllStepByProcessID() {
    this.isLoading = true;
    this.processSV.getAllStepByProcessID(this.processID).subscribe(data => {
      if (data && data.Data) {
        this.currentProcess = data.Data;
        if (this.currentProcess.ProcessSteps && this.currentProcess.ProcessSteps.length > 0) {
          this.currentStep = this.currentProcess.ProcessSteps[0];
        }
      }
      this.isLoading = false;
    });
  }

  showEditProcessName() {
    this.isEditInput = true;
    setTimeout(() => {
      if (this.inputProcessNameElm) {
        this.inputProcessNameElm.nativeElement.focus();
      }

    }, 300);
  }
  updateProcessName() {
    this.isEditInput = false;
  }

  addSidebarStep() {
    if (!this.stepAddSidebarName && !this.stepAddSidebarName.trim()) {
      this.currentProcess.push({ ProcessName: this.stepAddSidebarName });
      this.hideInputStepName();
    } else {

    }
  }


  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (this.isShowInputStepName) {

      if (this.inputStepNameElm && this.inputStepNameElm.nativeElement.contains(event.target)) {

      } else if (this.stepAddSidebarName == "") {

        this.hideInputStepName();
      }
    }

  }
  showInputStepName(e) {
    e.preventDefault();
    e.stopPropagation();
    this.isShowInputStepName = true;

    setTimeout(() => {
      if (this.inputStepNameElm) {
        this.inputStepNameElm.nativeElement.focus();
      }

    }, 300);
  }
  hideInputStepName() {
    this.isShowInputStepName = false;
    this.stepAddSidebarName = "";
  }

  showStep(step) {
    this.router.navigate([`/pages/process/stepSetting/${this.currentProcess.ProcessId}`], { queryParams: { stepId: step.ProcessStepId } });
  }


  getStepByID(stepID) {
    this.isLoadingStep = true;
    this.processSV.getStepByID(this.processID, stepID).subscribe(data => {
      if (data && data.Data) {
        this.currentStep = data.Data;
      } else {
        this.router.navigateByUrl("not-found");

      }
      this.isLoading = false;
    });
  }
}
