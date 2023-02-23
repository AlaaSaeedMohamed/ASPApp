using API.Entities;

namespace API.DTOs
{
    public class SearchDto
    {

        public IEnumerable<BooksDto> BBooks { get; set; }
        public IEnumerable<MembersDto> UUsers { get; set; }


    }
}