using System.Threading.RateLimiting;
using Cracow360.Api.Common;
using Cracow360.Api.Endpoints;
using Cracow360.Application.DTOs;
using Cracow360.Infrastructure;
using Cracow360.Infrastructure.Persistence.Seeding;

var builder = WebApplication.CreateBuilder(args);

// Register Infrastructure and Application layers (Clean Architecture DI)
builder.Services.AddCracow360Infrastructure(builder.Configuration, builder.Environment.ContentRootPath);

// Standard RFC 7807 problem details for structured error responses
builder.Services.AddProblemDetails();

// ASP.NET Core native health checks for container orchestrators and uptime monitoring
builder.Services.AddHealthChecks();

// Per-IP Rate Limiter protecting the public DeepSeek AI Assistant endpoint from bot spam & credit exhaustion
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.OnRejected = async (context, token) =>
    {
        context.HttpContext.Response.ContentType = "application/json";
        var throttledResponse = new WawelekChatResponseDto(
            Reply: "🐉 **Chwileczkę, złapmy oddech!** Wysyłasz pytania szybciej niż tramwaj linii 50 pędzi przez estakadę! Odczekaj proszę kilkanaście sekund przed kolejnym pytaniem, żebym nie przegrzał moich smoczych skrzydeł.",
            MascotState: "idle",
            SuggestedFollowUps: [],
            IsAiPowered: false,
            UsedLiveCityContext: false,
            ModelUsed: "rate-limiter-guard",
            TimestampUtc: DateTime.UtcNow
        );
        await context.HttpContext.Response.WriteAsJsonAsync(throttledResponse, cancellationToken: token);
    };

    options.AddPolicy(WawelekAssistantEndpoints.RateLimitPolicyName, httpContext =>
    {
        var forwardedFor = httpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault();
        var clientIp = !string.IsNullOrWhiteSpace(forwardedFor)
            ? forwardedFor.Split(',')[0].Trim()
            : httpContext.Connection.RemoteIpAddress?.ToString() ?? "anonymous-ip";

        return RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: clientIp,
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 10,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
                AutoReplenishment = true
            });
    });
});

// OpenAPI & Swagger documentation configuration
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

// Configure CORS for local development (Vite dev server and preview server)
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins(
                  "http://localhost:5173",
                  "http://127.0.0.1:5173",
                  "http://localhost:4173",
                  "http://127.0.0.1:4173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Enable global exception handling middleware mapping unhandled exceptions to ProblemDetails
app.UseExceptionHandler();

// Automatically initialize SQLite database and seed from JSON contract files on startup
using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
    var contractsPath = DataPathResolver.ResolveContractsPath(app.Environment, app.Configuration);
    await seeder.SeedAsync(contractsPath);
}

// Enable Swagger UI documentation in development mode
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Kraków360 API v1");
        c.RoutePrefix = "swagger";
    });
}

// Apply CORS policy for frontend client communication
app.UseCors("FrontendPolicy");

// Apply native IP Rate Limiter middleware
app.UseRateLimiter();

// Map health checks endpoint for container probes
app.MapHealthChecks("/health").WithTags("System");

// Map modular Minimal API endpoint groups
app.MapSystemEndpoints();
app.MapDistrictEndpoints();
app.MapPoiEndpoints();
app.MapLiveAtmosphereEndpoints();
app.MapAccessibilityEndpoints();
app.MapTourismEndpoints();
app.MapWawelekAssistantEndpoints();

// Redirect root route directly to Swagger documentation
app.MapGet("/", () => Results.Redirect("/swagger")).ExcludeFromDescription();

app.Run();
