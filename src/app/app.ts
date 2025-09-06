import { NgFor } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BUTTONS, STATE } from './constants';
import { ThemeOptionDirective } from './theme-option.directive';

@Component({
  selector: 'app-root',
  imports: [NgFor, ThemeOptionDirective],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
   btns: any[] = BUTTONS;

   // Logic properties
  firstValue = signal<string>('0');
  operator = signal<string>('');
  allValues = signal<string>('');
  lastValue = signal<string>('');
  shouldReset = signal<boolean>(false);

  // Design properties
  state: string[] = STATE;
  option = signal<number>(1);
  currentOption = signal<string>(this.state[0]);

  onDesignChange() {
    this.changeUI();
  }

  @HostListener('document:keydown', ['$event'])
  onHandleKeyboardEvent(event: KeyboardEvent) {
    let customKey = event.key;
    this.handleKeyboardEvent(customKey);
  }

  onPress(key: string) {
    this.analyzeKey(key);
  }

  changeUI() {
    this.option.update(value => value > 2 ? 1 : value + 1);
    this.currentOption.set(this.state[this.option() - 1]);
  }


  handleKeyboardEvent(key: string) {
    switch (key) {
      case 'Enter':
        key = '=';
        break;
      case 'Backspace':
        key = 'DEL';
        break;
      case 'Escape':
        key = 'RESET';
        break;
      case '*':
        key = 'x';
        break;
      default:
        break;
    }
    this.analyzeKey(key);
  }

  analyzeKey(key: string) {
    switch (key) {
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        if (this.shouldReset()) {
          this.allValues.set(key);
          this.shouldReset.set(false);
        } else {
          this.allValues.set(this.allValues() + key);
        }
        break;
      case '.':
        if (!this.allValues().includes('.')) {
          this.allValues.set(this.allValues() + key);
        }
        break;
      case '+':
      case '-':
      case 'x':
      case '/':
        this.compute(key);
        break;
      case '=':
        this.compute(key);
        break;
      case 'DEL':
        if (this.allValues()) {
          this.allValues.set(this.allValues().slice(0, this.allValues().length - 1));
        }
        break;
      case 'RESET':
        this.allValues.set('');
        this.operator.set('');
        this.firstValue.set('0');
        break;
      default:
        break;
    }
  }

  compute(key: string) {
    if (key === '=') {
      if (this.allValues() === '' || this.operator() === '') return;

      const result = this.calculate();
      this.allValues.set(String(result));
      this.firstValue.set('0');
      this.operator.set('');
      this.shouldReset.set(true);
    } else { // Operator
      if (this.operator() !== '' && this.allValues()  !== '') {
        const result = this.calculate();
        this.firstValue.set(String(result));
        this.allValues.set('');
      } else if (this.firstValue() === '0') {
        this.firstValue.set(this.allValues());
         this.allValues.set('');
      }
      this.operator.set(key);
    }
  }

  calculate(): number {
    const first = parseFloat(this.firstValue());
    const second = parseFloat(this.allValues());

    switch (this.operator()) {
      case '+': return first + second;
      case '-': return first - second;
      case 'x': return first * second;
      case '/': return first / second;
      default: return second;
    }
  }
}
