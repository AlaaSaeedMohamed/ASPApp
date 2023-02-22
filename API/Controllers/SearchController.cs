using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using API.ViewModels;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class SearchController: BaseApiController
    {
        private readonly DataContext _context;

        public SearchController( DataContext context)
        {
            _context = context;
        }
        [HttpGet("{SearchString}")]
        public SearchVM Search(string SearchString)
        {
              var  users = _context.Users.Where(o => o.UserName.ToLower().Contains(SearchString.ToLower())).ToList();
              var  boooks = _context.Books.Where(o => o.Title.ToLower().Contains(SearchString.ToLower())).ToList();

            return new SearchVM 
            {
                Users = users,
                Boooks = boooks
                
            };
            

        }
    }
}