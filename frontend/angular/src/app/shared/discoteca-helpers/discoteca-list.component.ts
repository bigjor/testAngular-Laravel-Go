import { Component, Input } from '@angular/core';

import { Discoteca, DiscotecaListConfig, DiscotecasService } from '../../core';
@Component({
  selector: 'app-discoteca-list',
  styleUrls: ['discoteca-list.component.css'],
  templateUrl: './discoteca-list.component.html'
})
export class DiscotecaListComponent {
  constructor (
    private discotecasService: DiscotecasService
  ) {}

  @Input() limit: number;
  @Input()
  set config(config: DiscotecaListConfig) {
    if (config) {
      this.query = config;
      this.currentPage = 1;
      this.runQuery();
    }
  }

  query: DiscotecaListConfig;
  results: Discoteca[];
  loading = false;
  currentPage = 1;
  totalPages: Array<number> = [1];

  setPageTo(pageNumber) {
    this.currentPage = pageNumber;
    this.runQuery();
  }

  runQuery() {
    this.loading = true;
    this.results = [];

    // Create limit and offset filter (if necessary)
    if (this.limit) {
      this.query.filters.limit = this.limit;
      this.query.filters.offset =  (this.limit * (this.currentPage - 1));
    }

    this.discotecasService.query(this.query)
    .subscribe(data => {
      this.loading = false;
      this.results = data.discotecas;

      // Used from http://www.jstips.co/en/create-range-0...n-easily-using-one-line/
      this.totalPages = Array.from(new Array(Math.ceil(data.discotecasCount / this.limit)), (val, index) => index + 1);
    });
  }
}
