using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using AutoMapper;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly ITokenService _tokenService;
        private readonly DataContext _context;
        private readonly IMapper _mapper;


        public AccountController(DataContext context, ITokenService tokenService, IMapper mapper)
        {
            _mapper = mapper;
            _tokenService = tokenService;
            _context = context;
        }

        [HttpPost("register")] //POST: api/account/register
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {

            if(await UserExists(registerDto.Username)) 
            {
                return BadRequest("Username Already Exists");
            }

            var user = _mapper.Map<AppUser>(registerDto);

            HttpContext.Session.SetInt32("ID",user.Id);


            using var hmac = new HMACSHA512();  // using keyword to despose it ourselves not by the garbage collector
            
            user.UserName = registerDto.Username.ToLower();
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
            user.PasswordSalt = hmac.Key;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user),
                KnownAs = user.KnownAs
            };
        }

        [HttpPost("login")]  //POST: api/account/login
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.UserName == loginDto.Username);

            if( user == null)
            {
                return Unauthorized("invalid Username");
            }

            using var hmac = new HMACSHA512(user.PasswordSalt);

            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i])
                {
                    return Unauthorized("invalid Password");
                }
            }


            HttpContext.Session.SetInt32("ID",user.Id);

            //var role = await _context.Users.FirstAsync(x => x.Role == loginDto.Role);

            if(loginDto.Role != user.Role)
            {
                return Unauthorized("invalid");
            }

            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user),
                KnownAs = user.KnownAs,
                Role = user.Role,
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.URL

            };
        }

        private async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(x => x.UserName == username.ToLower());
        }
    }
}