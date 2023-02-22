import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, take } from 'rxjs';
import { searchVM } from '../_models/users_booksVM';
import { SearchService } from '../_services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  results : searchVM[] =[]

  constructor(public searchService: SearchService, private route: ActivatedRoute){}

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults() {
    const SearchString = this.route.snapshot.paramMap.get('SearchString');
    if(!SearchString) return;
    this.searchService.getSearch(SearchString).subscribe({
      
      next: result => {
        this.results = result;
        localStorage.setItem('results', JSON.stringify(this.results));

      }
    });
  }
}
