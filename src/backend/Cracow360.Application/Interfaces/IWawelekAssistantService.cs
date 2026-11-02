using System.Threading;
using System.Threading.Tasks;
using Cracow360.Application.DTOs;

namespace Cracow360.Application.Interfaces;

/// <summary>
/// Service contract for the "Wawelek" AI Assistant powered by DeepSeek Platform
/// and grounded in Kraków360 municipal datasets, live weather/AQI telemetry, and project context.
/// </summary>
public interface IWawelekAssistantService
{
    /// <summary>
    /// Retrieves assistant readiness status, model metadata, and tab-aware starter prompts.
    /// </summary>
    Task<WawelekAssistantMetadataDto> GetMetadataAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Processes a user chat turn with conversation history, current UI context, live Krakow telemetry,
    /// and DeepSeek LLM completion (or intelligent local data fallback if API key is not configured).
    /// </summary>
    Task<WawelekChatResponseDto> SendMessageAsync(
        WawelekChatRequestDto request,
        CancellationToken cancellationToken = default);
}
