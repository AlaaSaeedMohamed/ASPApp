using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface ILikesRepository
    {
        Task<Likes> GetLikes(int sourceUserId, int targetUserId);
        Task<AppUser> GetUserWithLike(int userId);
        Task<IEnumerable<LikeDto>> GetUserLikes(string predicate, int userId);


        
    }
}