using API.DTOs;
using API.Entities;
using API.Extensions;
using API.ViewModels;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {

        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MembersDto>()
            .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain).URL))
            .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalcuateAge()));;
            CreateMap<Photo, PhotoDto>();

            CreateMap<MemberUpdateDto, AppUser>();
            CreateMap<RegisterDto, AppUser>();
            CreateMap<SearchDto, SearchVM>();
            CreateMap<Books, BooksDto>();
            CreateMap<AppUser, UserDto>();
            CreateMap<AppUser, MembersDto>();





        }
    }
}