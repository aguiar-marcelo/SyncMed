namespace syncmed.Models
{
    public class SchedullingOutputModel
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan Hour { get; set; }
        public string? Obs { get; set; }

        public PatientDto Patient { get; set; } = default!;
        public ProfessionalDto Professional { get; set; } = default!;
    }
}
