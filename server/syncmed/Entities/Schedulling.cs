namespace syncmed.Entities
{
    public class Schedulling
    {
        protected Schedulling() { }

        public Schedulling(DateTime date, TimeSpan hour, int idPatient, int idProfessional, string? obs)
        {
            Date = date;
            Hour = hour;
            IdPatient = idPatient;
            IdProfessional = idProfessional;
            Obs = obs;
        }

        public int Id { get; private set; }
        public DateTime Date { get; private set; }
        public TimeSpan Hour { get; private set; }
        public int IdPatient { get; private set; }
        public int IdProfessional { get; private set; }
        public string? Obs { get; private set; }
    }
}
