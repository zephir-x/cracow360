using Cracow360.Api.Endpoints;
using Cracow360.Infrastructure;
using Cracow360.Infrastructure.Persistence.Seeding;

var builder = WebApplication.CreateBuilder(args);

// Register Infrastructure and Application layers (Clean Architecture DI)
builder.Services.AddCracow360Infrastructure(builder.Configuration, builder.Environment.ContentRootPath);

// OpenAPI & Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new()
    {
        Title = "Kraków360 Smart City API",
        Version = "v1",
        Description = "Analytical and predictive platform API for Kraków360 (Open Data App Competition - City of Krakow)"
    });
});

// Configure CORS for local development (React + Vite)
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Automatically initialize SQLite database and seed from JSON contract files
using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
    var contractsPath = Path.GetFullPath(Path.Combine(app.Environment.ContentRootPath, "..", "..", "..", "data", "contracts"));
    await seeder.SeedAsync(contractsPath);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Kraków360 API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("FrontendPolicy");

// Map modular Minimal API endpoint groups
app.MapSystemEndpoints();
app.MapDistrictEndpoints();
app.MapPoiEndpoints();

app.MapGet("/", () => Results.Redirect("/swagger")).ExcludeFromDescription();

app.Run();
