import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { ApiService } from '../services/api.service';
import { IRenderSymbol } from '../services/IRenderSymbol';

@Component({
  selector: 'app-interpeter',
  templateUrl: './interpeter.component.html',
  styleUrls: ['./interpeter.component.css'],
})
export class InterpeterComponent implements OnInit {
  input_compiler: string = '';
  output_compiler: string = '';
  filename: string = '';

  symbols: IRenderSymbol[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {}

  handleFile(event: any) {
    const upload = event.target.files[0];
    from(upload!.text()).subscribe((data) => {
      this.input_compiler = data as string;
    });
  }

  downloadToFile(content: string, filename: string, contentType: string) {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });

    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();

    URL.revokeObjectURL(a.href);
  }

  save() {
    this.downloadToFile(
      this.input_compiler,
      `${this.filename}.txt`,
      'text/plain'
    );
  }

  onClickParser() {
    this.api.getApiData({ text: this.input_compiler }).subscribe((data) => {
      this.output_compiler = data.cout;
      if (data.table != undefined) {
        this.symbols = data.table;
      }
    });
  }
}
