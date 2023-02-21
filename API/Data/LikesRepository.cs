using System.Security.Claims;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class LikesRepository : ILikesRepository
    {

        private readonly DataContext _context;


        public LikesRepository(DataContext context)
        {
            _context = context;

        }
        public async Task<Likes> GetUserLike(int sourceUserId, int targetUserId)
        {
            return await _context.Likess.FindAsync(sourceUserId, targetUserId);
        }

        public async Task<PagedList<LikeDto>> GetUserLikes(LikeParams likesParams)
        {
            var users = _context.Users.OrderBy(u => u.UserName).AsQueryable();
            var likes = _context.Likess.AsQueryable();

            if(likesParams.Predicate == "liked")
            {
                likes = likes.Where(like => like.SourceUserId == likesParams.UserId);
                users = likes.Select(like => like.TargetUser);
            }

            if(likesParams.Predicate == "likedBy")
            {
                likes = likes.Where(like => like.TargetUserId == likesParams.UserId);
                users = likes.Select(like => like.SourceUser);
            }

             var likedUsers = users.Select(user => new LikeDto
            {
                UserName = user.UserName,
                KnownAs = user.KnownAs,
                City = user.City,
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain).URL,
            });

            return await PagedList<LikeDto>.CreateAsync(likedUsers, likesParams.PageNumber, likesParams.PageSize);

        }

        public async Task<AppUser> GetUserWithLikes(int userId)
        {
            return await _context.Users.
            Include(x => x.LikedUsers).
            FirstOrDefaultAsync(x => x.Id == userId);
        }
    }
}