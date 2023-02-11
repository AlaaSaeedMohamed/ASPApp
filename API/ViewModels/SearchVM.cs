using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.ViewModels
{
    public class SearchVM
    {
        public List<AppUser> Users { get; set; }
        public List<Books> Boooks { get; set; }



    }
}