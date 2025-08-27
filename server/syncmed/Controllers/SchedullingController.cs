using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using syncmed.Entities;
using syncmed.Models;

namespace syncmed.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SchedullingController : ControllerBase
    {
        private readonly string _connectionString;
        public SchedullingController(IConfiguration cfg)
        {
            _connectionString = cfg.GetConnectionString("syncmed");
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            const string SQL = @"
                SELECT
                    s.Id                 AS Id,
                    s.[date]             AS [Date],
                    s.[hour]             AS [Hour],
                    s.obs                AS Obs,
                    p.Id                 AS PatientId,
                    p.Id                 AS Id,
                    p.Name               AS Name,
                    p.Contact            AS Contact,
                    p.ContactSecundary   AS ContactSecundary,
                    p.Email              AS Email,
                    pr.Id                AS ProfessionalId,
                    pr.Id                AS Id,
                    pr.Name              AS Name,
                    pr.Contact           AS Contact,
                    pr.ContactSecundary  AS ContactSecundary,
                    pr.Email             AS Email,
                    sp.Id                AS SpecialtyId,
                    sp.Id                AS Id,
                    sp.Name              AS Name
                FROM schedulling s
                JOIN patient      p  ON p.Id  = s.idPatient
                JOIN professional pr ON pr.Id = s.idProfessional
                JOIN specialty    sp ON sp.Id = pr.IdSpecialty
                ORDER BY s.Id DESC;";

            await using var db = new SqlConnection(_connectionString);

            var list = await db.QueryAsync<
                SchedullingOutputModel, PatientDto, ProfessionalDto, SpecialtyDto, SchedullingOutputModel>(
                SQL,
                (s, pat, pro, sp) => { pro.Specialty = sp; s.Patient = pat; s.Professional = pro; return s; },
                splitOn: "PatientId,ProfessionalId,SpecialtyId"
            );

            return Ok(list);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            const string SQL = @"
                SELECT
                    s.Id                 AS Id,
                    s.[date]             AS [Date],
                    s.[hour]             AS [Hour],
                    s.obs                AS Obs,
                    p.Id                 AS PatientId,
                    p.Id                 AS Id,
                    p.Name               AS Name,
                    p.Contact            AS Contact,
                    p.ContactSecundary   AS ContactSecundary,
                    p.Email              AS Email,
                    pr.Id                AS ProfessionalId,
                    pr.Id                AS Id,
                    pr.Name              AS Name,
                    pr.Contact           AS Contact,
                    pr.ContactSecundary  AS ContactSecundary,
                    pr.Email             AS Email,
                    sp.Id                AS SpecialtyId,
                    sp.Id                AS Id,
                    sp.Name              AS Name
                FROM schedulling s
                JOIN patient      p  ON p.Id  = s.idPatient
                JOIN professional pr ON pr.Id = s.idProfessional
                JOIN specialty    sp ON sp.Id = pr.IdSpecialty
                WHERE s.Id = @id;";

            await using var db = new SqlConnection(_connectionString);

            var item = (await db.QueryAsync<
                SchedullingOutputModel, PatientDto, ProfessionalDto, SpecialtyDto, SchedullingOutputModel>(
                SQL,
                (s, pat, pro, sp) => { pro.Specialty = sp; s.Patient = pat; s.Professional = pro; return s; },
                new { id },
                splitOn: "PatientId,ProfessionalId,SpecialtyId"
            )).SingleOrDefault();

            if (item is null) return NotFound();
            return Ok(item);
        }

        [HttpGet("by-date")]
        public async Task<IActionResult> GetByDate(
        [FromQuery] DateTime date,
        [FromQuery(Name = "professionalId")] int[]? professionalIds = null)
        {
            if (date == default)
                return BadRequest(new { error = "date is required (use YYYY-MM-DD)" });

            var hasFilter = professionalIds is { Length: > 0 };

            const string BASE_SELECT = @"
                SELECT
                    s.Id                 AS Id,
                    s.[date]             AS [Date],
                    s.[hour]             AS [Hour],
                    s.obs                AS Obs,
                    p.Id                 AS PatientId,
                    p.Id                 AS Id,
                    p.Name               AS Name,
                    p.Contact            AS Contact,
                    p.ContactSecundary   AS ContactSecundary,
                    p.Email              AS Email,
                    pr.Id                AS ProfessionalId,
                    pr.Id                AS Id,
                    pr.Name              AS Name,
                    pr.Contact           AS Contact,
                    pr.ContactSecundary  AS ContactSecundary,
                    pr.Email             AS Email,
                    sp.Id                AS SpecialtyId,
                    sp.Id                AS Id,
                    sp.Name              AS Name
                FROM schedulling s
                JOIN patient      p  ON p.Id  = s.idPatient
                JOIN professional pr ON pr.Id = s.idProfessional
                JOIN specialty    sp ON sp.Id = pr.IdSpecialty
                WHERE s.[date] = @Date";

            var sql = hasFilter
                ? BASE_SELECT + " AND pr.Id IN @ProfessionalIds ORDER BY s.[hour] ASC, s.Id DESC;"
                : BASE_SELECT + " ORDER BY s.[hour] ASC, s.Id DESC;";

            await using var db = new SqlConnection(_connectionString);

            var rows = await db.QueryAsync<
                SchedullingOutputModel, PatientDto, ProfessionalDto, SpecialtyDto, SchedullingOutputModel>(
                sql,
                (s, pat, pro, sp) => { pro.Specialty = sp; s.Patient = pat; s.Professional = pro; return s; },
                hasFilter
                    ? new { Date = date.Date, ProfessionalIds = professionalIds }
                    : new { Date = date.Date },
                splitOn: "PatientId,ProfessionalId,SpecialtyId"
            );

            return Ok(rows);
        }

        [HttpGet("scheduled-dates")]
        public async Task<IActionResult> GetScheduledDates()
        {
            const string SQL = @"
                SELECT DISTINCT s.[date] AS [Date]
                FROM schedulling s
                ORDER BY s.[date] ASC;";

            await using var db = new SqlConnection(_connectionString);

            var rows = await db.QueryAsync<DateTime>(SQL);

            var dates = rows.Select(d => d.ToString("yyyy-MM-dd")).ToList();
            return Ok(dates);
        }


        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SchedullingInputModel req)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            if (!TimeSpan.TryParse(req.Hour, out var hour))
                return BadRequest(new { error = "Invalid hour format. Use HH:mm" });

            const string CHECK_PAT = "SELECT COUNT(1) FROM patient WHERE id = @IdPatient;";
            const string CHECK_PRO = "SELECT COUNT(1) FROM professional WHERE id = @IdProfessional;";

            const string CHECK_DUP = @"
                SELECT COUNT(1)
                FROM schedulling
                WHERE [date] = @Date
                  AND idPatient = @IdPatient
                  AND idProfessional = @IdProfessional;";

                    const string INS = @"
                INSERT INTO schedulling ([date], [hour], idPatient, idProfessional, obs)
                VALUES (@Date, @Hour, @IdPatient, @IdProfessional, @Obs);
                SELECT CAST(SCOPE_IDENTITY() AS int);";

                    const string SEL = @"
                SELECT
                    id             AS Id,
                    [date]         AS [Date],
                    [hour]         AS [Hour],
                    idPatient      AS IdPatient,
                    idProfessional AS IdProfessional,
                    obs            AS Obs
                FROM schedulling
                WHERE id = @Id;";

            await using var db = new SqlConnection(_connectionString);

            var patExists = await db.ExecuteScalarAsync<int>(CHECK_PAT, new { req.IdPatient });
            if (patExists == 0) return BadRequest(new { error = "Patient not found." });

            var proExists = await db.ExecuteScalarAsync<int>(CHECK_PRO, new { req.IdProfessional });
            if (proExists == 0) return BadRequest(new { error = "Professional not found." });

            var dup = await db.ExecuteScalarAsync<int>(CHECK_DUP, new
            {
                Date = req.Date.Date,
                req.IdPatient,
                req.IdProfessional
            });
            if (dup > 0)
                return Conflict(new { error = "This patient already has a scheduling with this professional on the selected date." });

            var newId = await db.ExecuteScalarAsync<int>(INS, new
            {
                Date = req.Date.Date,
                Hour = hour,
                req.IdPatient,
                req.IdProfessional,
                req.Obs
            });

            var created = await db.QuerySingleAsync<Schedulling>(SEL, new { Id = newId });
            return CreatedAtAction(nameof(GetById), new { id = newId }, created);
        }


        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] SchedullingInputModel req)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            if (!TimeSpan.TryParse(req.Hour, out var hour))
                return BadRequest(new { error = "Invalid hour format. Use HH:mm" });

            const string CHECK_PAT = "SELECT COUNT(1) FROM patient WHERE id = @IdPatient;";
            const string CHECK_PRO = "SELECT COUNT(1) FROM professional WHERE id = @IdProfessional;";

            const string UPD = @"
                UPDATE schedulling SET
                    [date]         = @Date,
                    [hour]         = @Hour,
                    idPatient      = @IdPatient,
                    idProfessional = @IdProfessional,
                    obs            = @Obs
                WHERE id = @Id;";

            const string SEL = @"
                SELECT
                    id                   AS Id,
                    [date]               AS [Date],
                    [hour]               AS [Hour],
                    idPatient            AS IdPatient,
                    idProfessional       AS IdProfessional,
                    obs                  AS Obs
                FROM schedulling
                WHERE id = @Id;";

            await using var db = new SqlConnection(_connectionString);

            var patExists = await db.ExecuteScalarAsync<int>(CHECK_PAT, new { req.IdPatient });
            if (patExists == 0) return BadRequest(new { error = "Patient not found." });

            var proExists = await db.ExecuteScalarAsync<int>(CHECK_PRO, new { req.IdProfessional });
            if (proExists == 0) return BadRequest(new { error = "Professional not found." });

            var affected = await db.ExecuteAsync(UPD, new
            {
                Id = id,
                Date = req.Date.Date,
                Hour = hour,
                req.IdPatient,
                req.IdProfessional,
                req.Obs
            });

            if (affected == 0) return NotFound();

            var updated = await db.QuerySingleAsync<Schedulling>(SEL, new { Id = id });
            return Ok(updated);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            const string DEL = @"DELETE FROM schedulling WHERE id = @Id;";
            await using var db = new SqlConnection(_connectionString);
            var affected = await db.ExecuteAsync(DEL, new { Id = id });
            if (affected == 0) return NotFound();
            return NoContent();
        }
    }
}
