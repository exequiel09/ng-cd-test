import { Component, Input, NgModule } from '@angular/core';

@Component({
  selector: 'hello',
  template: `<h1>Hello {{name}}!</h1>`,
  styles: [`h1 { font-family: Lato; }`],
})
export class HelloComponent {
  @Input() name: string;
}

@NgModule({
  declarations: [HelloComponent],
  exports: [HelloComponent],
})
export class HelloComponentModule {}
