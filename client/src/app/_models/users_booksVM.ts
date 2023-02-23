import { Book } from "./book";
import { Member } from "./member";
import { User } from "./user";

export interface searchVM {

    bBooks: Book[];
    uUsers: Member[];
    
}
