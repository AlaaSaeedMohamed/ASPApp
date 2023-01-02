using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    
    // inheritance
    public class UsersController : BaseApiController
    {
        // dependency injection
        private readonly DataContext _context;
        //constructor
        public UsersController(DataContext context)
        {
            
            _context = context;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        {
            // await method to make the code asynchronous
            var users = await _context.Users.ToListAsync();

            return users;
        }


        //getting a particular user by their id
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<AppUser>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            return user;
        }
    }
}