using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Books
    {
        [Key]
        public int Id { get; set; }

        public string Title { get; set; }

    }
}