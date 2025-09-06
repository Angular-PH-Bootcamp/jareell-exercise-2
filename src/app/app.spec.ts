import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.firstValue()).toBe(0);
    expect(component.operator()).toBe('');
    expect(component.allValues()).toBe('');
    expect(component.option()).toBe(1);
    expect(component.currentOption()).toBe('theme-1');
  });

  it('should change UI theme when onDesignChange is called', () => {
    component.onDesignChange();
    expect(component.option()).toBe(2);
    expect(component.currentOption()).toBe('theme-2');

    component.onDesignChange();
    expect(component.option()).toBe(3);
    expect(component.currentOption()).toBe('theme-3');

    component.onDesignChange();
    expect(component.option()).toBe(1);
    expect(component.currentOption()).toBe('theme-1');
  });

  it('should handle keyboard events correctly', () => {
    spyOn(component, 'analyzeKey');

    component.onHandleKeyboardEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(component.analyzeKey).toHaveBeenCalledWith('=');

    component.onHandleKeyboardEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
    expect(component.analyzeKey).toHaveBeenCalledWith('DEL');

    component.onHandleKeyboardEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(component.analyzeKey).toHaveBeenCalledWith('RESET');

    component.onHandleKeyboardEvent(new KeyboardEvent('keydown', { key: '*' }));
    expect(component.analyzeKey).toHaveBeenCalledWith('x');

    component.onHandleKeyboardEvent(new KeyboardEvent('keydown', { key: '5' }));
    expect(component.analyzeKey).toHaveBeenCalledWith('5');
  });

  it('should handle number inputs correctly', () => {
    component.onPress('5');
    expect(component.allValues()).toBe('5');

    component.onPress('7');
    expect(component.allValues()).toBe('57');
  });

  it('should handle decimal inputs correctly', () => {
    component.onPress('.');
    expect(component.allValues()).toBe('0.');

    component.onPress('5');
    expect(component.allValues()).toBe('0.5');

    component.onPress('.');
    expect(component.allValues()).toBe('0.5');
  });

  it('should handle operator inputs correctly', () => {
    component.allValues.set('10');
    component.onPress('+');
    expect(component.firstValue()).toBe(10);
    expect(component.operator()).toBe('+');
    expect(component.allValues()).toBe('');
  });

  it('should perform calculation on equals', () => {
    component.firstValue.set(10);
    component.operator.set('+');
    component.allValues.set('5');
    component.onPress('=');
    expect(component.allValues()).toBe('15');
    expect(component.operator()).toBe('');
    expect(component.firstValue()).toBe(0);
  });

  it('should handle DEL correctly', () => {
    component.allValues.set('123');
    component.onPress('DEL');
    expect(component.allValues()).toBe('123');
  });

  it('should handle RESET correctly', () => {
    component.firstValue.set(10);
    component.operator.set('+');
    component.allValues.set('5');
    component.onPress('RESET');
    expect(component.firstValue()).toBe(0);
    expect(component.operator()).toBe('');
    expect(component.allValues()).toBe('');
  });

  it('should chain operations correctly', () => {
    component.allValues.set('10');
    component.onPress('+');
    component.allValues.set('5');
    component.onPress('-');
    expect(component.firstValue()).toBe(15);
    expect(component.operator()).toBe('-');
    expect(component.allValues()).toBe('');
  });

  it('should not allow more than 15 characters', () => {
    component.allValues.set('123456789012345');
    component.onPress('6');
    expect(component.allValues()).toBe('123456789012345');
  });
});