using System.ComponentModel.DataAnnotations;

namespace syncmed.Models
{
    public class SchedullingInputModel
    {
        [Required]
        public DateTime Date { get; set; }

        [Required]
        [RegularExpression(@"^\d{2}:\d{2}$", ErrorMessage = "Hour must be in HH:mm format")]
        public string Hour { get; set; } = default!;

        [Required]
        public int IdPatient { get; set; }

        [Required]
        public int IdProfessional { get; set; }

        public string? Obs { get; set; }
    }
}
