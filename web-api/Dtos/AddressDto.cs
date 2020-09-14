using System.ComponentModel.DataAnnotations;
using Core.Models.Identity;

namespace web_api.Dtos
{
    public class AddressDto
    {
        [Required]
        public string Street { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string State { get; set; }
        [Required]
        public string Postcode { get; set; }
    }
}