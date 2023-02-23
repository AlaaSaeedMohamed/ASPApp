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
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class SearchController: BaseApiController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public SearchController( DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }
        [HttpGet("{SearchString}")]
        public async Task<ActionResult<SearchDto>> Search(string SearchString)
        {

            var  users = await _context.Users.Where(o => o.UserName.ToLower().Contains(SearchString.ToLower())).ProjectTo<MembersDto>(_mapper.ConfigurationProvider).ToArrayAsync();
            var  boooks = await _context.Books.Where(o => o.Title.ToLower().Contains(SearchString.ToLower())).ProjectTo<BooksDto>(_mapper.ConfigurationProvider).ToArrayAsync();

            return new SearchDto 
            {
                UUsers = users,
                BBooks = boooks

                
            };
            

        }
    }
}