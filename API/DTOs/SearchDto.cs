namespace API.DTOs
{
    public class SearchDto
    {
        public string username { get; set; }
        public string title { get; set; }

        public List<BooksDto> BBooks { get; set; } = new List<BooksDto>();
        public List<UserDto> UUsers { get; set; } = new List<UserDto>();


    }
}