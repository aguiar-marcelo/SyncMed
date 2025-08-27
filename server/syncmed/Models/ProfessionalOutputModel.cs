namespace syncmed.Models
{
    public class ProfessionalOutputModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string? Contact { get; set; }
        public string? ContactSecundary { get; set; }
        public string? Email { get; set; }
        public SpecialtyDto Specialty { get; set; } = default!;
    }
}
