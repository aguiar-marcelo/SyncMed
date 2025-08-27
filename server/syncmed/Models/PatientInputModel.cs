using System.ComponentModel.DataAnnotations;

namespace syncmed.Models
{
    public class PatientInputModel
    {
        [Required] public string Name { get; set; } = default!;
        [Required] public DateTime BirthDate { get; set; }
        [Required] public string Contact { get; set; } = default!;
        public string? ContactSecundary { get; set; } = string.Empty;
        [Required] public string Email { get; set; } = default!;
    }
}
