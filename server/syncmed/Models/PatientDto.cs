namespace syncmed.Models
{
    public class PatientDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string Contact { get; set; } = default!;
        public string? ContactSecundary { get; set; }
        public string Email { get; set; } = default!;
    }
}