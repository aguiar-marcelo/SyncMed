using System.ComponentModel.DataAnnotations;

namespace syncmed.Models
{
    public class ProfessionalInputModel
    {
        [Required] public string Name { get; set; } = default!;
        public string? Contact { get; set; }
        public string? ContactSecundary { get; set; }
        [EmailAddress] public string? Email { get; set; }
        [Required] public int IdSpecialty { get; set; }
    }
}
