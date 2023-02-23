using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;

namespace API.ViewModels
{
    public class SearchVM
    {
        public List<UserDto> Users { get; set; }
        public List<BooksDto> Boooks { get; set; }



    }
}