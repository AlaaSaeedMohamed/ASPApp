using API.Data;
using API.DTOs;
using API.Entities;
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
        public async Task<ActionResult<IEnumerable<MembersDto>>> GetUsers()
        {
            // await method to make the code asynchronous
            var users = await _userRepository.GetUsersAsync();
            var UserToReturn = _mapper.Map<IEnumerable<MembersDto>>(users);
            return Ok(UserToReturn);
        }


        [HttpGet("{username}")]
        public async Task<ActionResult<MembersDto>> GetUserbyUsername(string username)
        {
            var user = await _userRepository.GetUserByUserNameAsync(username);
            return _mapper.Map<MembersDto>(user);
        }
    }
}