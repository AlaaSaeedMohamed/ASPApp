import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/Pagination';
import { User } from 'src/app/_models/user';
import { userParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  //members$: Observable<Member[]> | undefined;
  members: Member[] | undefined;
  pagination: Pagination | undefined;
  userParams: userParams | undefined;
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}]

  constructor(private membersService: MembersService) { 
    this.userParams = this.membersService.getUserParams();
  }

  ngOnInit(): void {
    //this.members$ = this.membersService.getMembers()
    this.loadMembers();
    
  }

  loadMembers()
  {
    if (this.userParams) {
      this.membersService.setUserParams(this.userParams)
      this.membersService.getMembers(this.userParams).subscribe({
        next: response => {
          if (response.result && response.pagination) {
            this.members = response.result;
            this.pagination = response.pagination;
          }
        }
      })
    }

  }

  resetFilters() {
      this.userParams = this.membersService.resetUserParams();
      this.loadMembers();
    
  }

  pageChanged(event: any) {
    if (this.userParams && this.userParams?.pageNumber !== event.page){
      this.userParams.pageNumber = event.page;
      this.membersService.setUserParams(this.userParams)
      this.loadMembers();
    }

  }


  
}
