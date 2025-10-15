import { Component } from '@angular/core';
import { DynamicForm } from './components/dynamic-form/dynamic-form';
import { FormSchema } from './models/form-schemas';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [DynamicForm, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  submittedJson: Record<string, any> = {};
  initialValue: any = {};
  schemaText: string = '';
  schemaError: string = '';

  schema: FormSchema = {
    title: 'User Registration',
    fields: [
      { label: 'Full Name', name: 'fullName', type: 'text', required: true },
      {
        label: 'Email',
        name: 'email',
        type: 'text',
        required: true,
        validation: {
          pattern: '^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$',
          message: 'Invalid email address'
        }
      },
      { label: 'Date of Birth', name: 'dob', type: 'date' },
      { label: 'Gender', name: 'gender', type: 'dropdown', options: ['Male', 'Female', 'Other'], required: true },
      { label: 'Hobbies', name: 'hobbies', type: 'multiselect', options: ['Reading', 'Sports', 'Music', 'Travel'] },
      { label: 'Subscribe to newsletter', name: 'subscribe', type: 'checkbox' },
      { label: 'About Yourself', name: 'about', type: 'textarea' }
    ],
  };

  ngOnInit() {
    this.schemaText = JSON.stringify(this.schema, null, 2);
  }

  onSchemaChange() {
    try {
      const parsed = JSON.parse(this.schemaText);

      if (parsed && parsed.title && Array.isArray(parsed.fields)) {
        this.schema = parsed;
        this.schemaError = '';
      } else {
        this.schemaError = 'Schema must have "title" and "fields" properties';
      }
    } catch (e) {
      this.schemaError = 'Invalid JSON format';
    }
  }

  onSubmit(event: any) {
    this.submittedJson = event;
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

}
