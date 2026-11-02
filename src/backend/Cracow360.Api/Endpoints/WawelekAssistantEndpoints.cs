using System.Threading;
using System.Threading.RateLimiting;
using Cracow360.Api.Common;
using Cracow360.Application.DTOs;
using Cracow360.Application.Interfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Cracow360.Api.Endpoints;

/// <summary>
/// Minimal API route configuration for Stage 10: "Wawelek" AI Assistant (/api/assistant).
/// Exposes endpoints for conversational queries grounded in Kraków360 municipal datasets,
/// live atmosphere telemetry, and DeepSeek Platform LLM completions.
/// Protected by per-IP rate limiting to prevent automated bot abuse on public deployments.
/// </summary>
public static class WawelekAssistantEndpoints
{
    public const string RateLimitPolicyName = "WawelekAssistantIpRateLimit";

    public static IEndpointRouteBuilder MapWawelekAssistantEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/assistant")
            .WithTags("Wawelek AI Assistant (Stage 10 - DeepSeek & Live City Knowledge)");

        // GET /api/assistant/metadata - Retrieves assistant configuration status and suggested starter prompts
        group.MapGet("/metadata", async (
            IWawelekAssistantService assistantService,
            CancellationToken cancellationToken) =>
        {
            var metadata = await assistantService.GetMetadataAsync(cancellationToken);
            return Results.Ok(metadata);
        })
        .WithName("GetWawelekAssistantMetadata")
        .WithSummary("Retrieves readiness status, model metadata, and tab-aware starter questions for the Wawelek AI Assistant.")
        .Produces<WawelekAssistantMetadataDto>(StatusCodes.Status200OK);

        // POST /api/assistant/chat - Sends a conversational prompt to the Wawelek AI Assistant (rate-limited per client IP)
        group.MapPost("/chat", async (
            WawelekChatRequestDto request,
            IWawelekAssistantService assistantService,
            CancellationToken cancellationToken) =>
        {
            var response = await assistantService.SendMessageAsync(request, cancellationToken);
            return Results.Ok(response);
        })
        .RequireRateLimiting(RateLimitPolicyName)
        .WithName("SendWawelekChatMessage")
        .WithSummary("Processes a user message with ephemeral session history, live Krakow weather/AQI telemetry, and DeepSeek LLM completion.")
        .Produces<WawelekChatResponseDto>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status429TooManyRequests);

        return app;
    }
}
