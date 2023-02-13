

using API.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : DbContext
    {
        
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<AppUser> Users { get; set; }
        public DbSet<Likes> Likes { get; set; }
        public DbSet<Books> Books { get; set; }

        protected override void OnModelCreating(ModelBuilder builder) 
        {
            base.OnModelCreating(builder);
            builder.Entity<Likes>()
                .HasKey(k => new {k.SourceUserId, k.TargetUserId});

            builder.Entity<Likes>()
                .HasOne(s => s.SourceUser)
                .WithMany(l => l.LikedUsers)
                .HasForeignKey(s => s.SourceUserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Likes>()
                .HasOne(s => s.TargetUser)
                .WithMany(l => l.LikedByUsers)
                .HasForeignKey(s => s.TargetUserId)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
} 