import { Component, OnInit } from '@angular/core';
import { graphviz } from 'd3-graphviz';
import { wasmFolder } from '@hpcc-js/wasm';
import { ApiService } from '../services/api.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-analyzer',
  templateUrl: './analyzer.component.html',
  styleUrls: ['./analyzer.component.css'],
})
export class AnalyzerComponent implements OnInit {
  input_compiler: string = '';
  output_compiler: string = '';
  filename: string = '';
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
    this.api.getImage({ text: this.input_compiler }).subscribe((data) => {
      if (data.graph != undefined) {
        wasmFolder('/assets'); // set the folder for wasm files
        graphviz('#graph').renderDot(data.graph);
      } else if (data.cout != undefined) {
        this.output_compiler = data.cout;
      }
    });
  }
}
