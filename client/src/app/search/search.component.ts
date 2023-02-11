import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { searchVM } from '../_models/users_booksVM';
import { SearchService } from '../_services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  result : searchVM[] | undefined

  constructor(public searchService: SearchService, private route: ActivatedRoute){}

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults() {
    const search = this.route.snapshot.paramMap.get('search');
    if(!search) return;
    this.searchService.getSearch(search);
  }
}
