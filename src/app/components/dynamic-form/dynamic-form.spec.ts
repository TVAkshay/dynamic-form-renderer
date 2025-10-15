import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicForm } from './dynamic-form';

describe('DynamicForm', () => {
  let component: DynamicForm;
  let fixture: ComponentFixture<DynamicForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not throw an error without schema', () => {
    expect(component).toBeTruthy();
  });

  it('should render title without Fields', () => {
      component.schema = { title: 'Test Form', fields: [] };
      component.makeForm();
      fixture.detectChanges();
      expect(fixture.nativeElement.innerHTML).toContain('Test Form');
  });

  it('should not render submit button without Fields', () => {
    component.schema = { title: 'Test Form', fields: [] };
    component.makeForm();
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).not.toContain('Submit');
  });

  it('should show fields with type text', () => {
    component.schema = { title: 'Test Form', fields: [{ label: 'Test', name: 'test', type: 'text' }] };
    component.makeForm();
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain('Test');
  });

  it('should show validation on required fields', () => {
    component.schema = { title: 'Test Form', fields: [{ label: 'Test', name: 'test', type: 'text', required: true }] };
    component.makeForm();
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML).toContain('Test is required.');
  });


});
