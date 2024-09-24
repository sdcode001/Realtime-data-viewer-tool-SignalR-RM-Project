import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TagValueService } from './tag-value.service';
import * as echarts from 'echarts';
import { EchartComponent } from "./echart/echart.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EchartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'realtime-data-viewer-tool';

  tagValueService = inject(TagValueService);

  tagValues:Map<any, any[]> = this.tagValueService.TagValueMap;

  async ngOnInit(){
    await this.tagValueService.connect();
  }

   ngDoCheck(){
      console.log(this.tagValues)
   }

}
