using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    
    // inheritance
   [Authorize]
    public class UsersController : BaseApiController
    {
        // dependency injection
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        //constructor
        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            _mapper = mapper;
            _userRepository = userRepository;
        }
        [HttpGet]
        public async Task<ActionResult<PagedList<MembersDto>>> GetUsers([FromQuery]UserParams userParams)
        {
            // await method to make the code asynchronous
            var currentUser = await _userRepository.GetUserByUserNameAsync(User.GetUsername());
            userParams.CurrentUsername = currentUser.UserName;

            if(string.IsNullOrEmpty(userParams.Gender))
            {
                userParams.Gender = currentUser.Gender == "male" ? "female" : "male";
            }
            var users = await _userRepository.GetMembersAsync(userParams);
            Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages));
            return Ok(users);
        }

        [Authorize(Roles = "Member")]
        [HttpGet("{username}")]
        public async Task<ActionResult<MembersDto>> GetUserbyUsername(string username)
        {
            var user = await _userRepository.GetUserByUserNameAsync(username);
            return _mapper.Map<MembersDto>(user);
        }


        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto) 
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            var user = await _userRepository.GetUserByUserNameAsync(username);

            if (user == null) return NotFound();
            _mapper.Map(memberUpdateDto, user); // updates all the properties in memberUpdateDto and overwrite them in the user

            if (await _userRepository.SaveAllAsync()) return NoContent(); // to update DB

            return BadRequest("Failed to update DB"); // if it did not update the db with the previous if statement, the it sends a bad request 
        }
    }
}