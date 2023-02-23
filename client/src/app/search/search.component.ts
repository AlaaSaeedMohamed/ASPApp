import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, take } from 'rxjs';
import { Member } from '../_models/member';
import { searchVM } from '../_models/users_booksVM';
import { MembersService } from '../_services/members.service';
import { PresenseService } from '../_services/presense.service';
import { SearchService } from '../_services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  results :searchVM | undefined;
  constructor(public searchService: SearchService, private route: ActivatedRoute,private memberService: MembersService, private toastr: ToastrService, public presenceService: PresenseService){}

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults() {
    const SearchString = this.route.snapshot.paramMap.get('SearchString');
    if(!SearchString) return ;
    this.searchService.getSearch(SearchString).subscribe({
      next: (result) => {
        this.results =  result;
        console.log(this.results);
        localStorage.setItem('results', JSON.stringify(this.results));

      }
    });
  }

  addLike(member: Member)
  {
    this.memberService.addLike(member.userName).subscribe({
      next:() => this.toastr.success('you have liked ' + member.knownAs)
    })
  }
}
