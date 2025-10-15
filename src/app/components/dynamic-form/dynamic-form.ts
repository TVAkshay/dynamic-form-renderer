import { Component, Input, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { Field, FormSchema } from '../../models/form-schemas';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dynamic-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './dynamic-form.html',
  styleUrl: './dynamic-form.css'
})
export class DynamicForm {
  @Input() schema!: FormSchema;
  @Input() initialValue: { [key: string]: any } = {};
  @Output() onSubmit = new EventEmitter<any>();
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    if (this.schema) {
      this.makeForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['schema'] && this.schema) {
      this.makeForm();
    }
  }

  checkDependency(field: Field) {
    if (!field.dependsOn) return;

    const dependentControl = this.form.get(field.dependsOn);
    const targetControl = this.form.get(field.name);

    if (!dependentControl || !targetControl) return;

    if (!dependentControl.value) {
      targetControl.disable({ emitEvent: false });
    }

    dependentControl.valueChanges.subscribe((value) => {
      if (value) {
        targetControl.enable({ emitEvent: false });
      } else {
        targetControl.setValue(this.getDefaultValueBasedOnType(field));
        targetControl.disable({ emitEvent: false });
      }
    });
  }

  getDefaultValueBasedOnType(field: Field) {
    if (field.type === 'checkbox') return false;
    if (field.type === 'multiselect') return [];
    return '';
  }

  makeForm() {
    if (this.schema) {
      const group: { [key: string]: FormControl } = {};

      this.schema.fields.forEach(field => {
        const validators = this.getValidatorsForField(field);
        let defaultValue: any = '';
        if (field.type === 'checkbox') defaultValue = false;
        if (field.type === 'multiselect') defaultValue = [];
        if (this.initialValue && this.initialValue.hasOwnProperty(field.name)) {
          defaultValue = this.initialValue[field.name];
        }
        group[field.name] = new FormControl(
          { value: defaultValue, disabled: field.disabled || false },
          validators
        );
      })
      this.form = new FormGroup(group);

      this.schema.fields.forEach(field => {
        this.checkDependency(field);
      });
    }
  }

  private getValidatorsForField(field: Field) {
    const validators: any[] = [];
    const v = field.validation;

    if (field.required) {
      validators.push(Validators.required);
    }

    if (v) {
      if (v.minLength != null) validators.push(Validators.minLength(v.minLength));
      if (v.maxLength != null) validators.push(Validators.maxLength(v.maxLength));
      if (v.min != null) validators.push(Validators.min(v.min));
      if (v.max != null) validators.push(Validators.max(v.max));
      if (v.pattern) {
        try {
          const re = new RegExp(v.pattern);
          validators.push(Validators.pattern(re));
        } catch (e) {
          console.warn(`Invalid regex for field ${field.name}:`, e);
        }
      }
    }
    return validators;
  }

  getErrorMessage(field: Field) {
    if (!this.form.get(field.name)?.touched) return '';

    const control = this.form.get(field.name);
    if (!control || !control.errors) return '';

    if (control.hasError('required')) return `${field.label} is required.`;

    const v = field.validation;
    if (control.hasError('pattern')) {
      return (v && v.message) ? v.message : `${field.label} has invalid format.`;
    }
    if (control.hasError('minlength')) {
      const req = control.getError('minlength').requiredLength;
      return (v && v.message) ? v.message : `${field.label} must be at least ${req} characters.`;
    }
    if (control.hasError('maxlength')) {
      const req = control.getError('maxlength').requiredLength;
      return (v && v.message) ? v.message : `${field.label} must be at most ${req} characters.`;
    }
    if (control.hasError('min')) {
      return (v && v.message) ? v.message : `${field.label} should be >= ${field.validation?.min}.`;
    }
    if (control.hasError('max')) {
      return (v && v.message) ? v.message : `${field.label} should be <= ${field.validation?.max}.`;
    }

    return (v && v.message) ? v.message : `${field.label} is invalid.`;
  }

  onSubmitEvent() {
    if (!this.form) return;
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(k => this.form.controls[k].markAsTouched());
    }

    if(this.form.valid) {
      this.onSubmit.emit(this.form.value);
    }
  }

}
