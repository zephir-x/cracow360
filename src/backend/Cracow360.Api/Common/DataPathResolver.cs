namespace Cracow360.Api.Common;

/// <summary>
/// Resolves file system paths to shared data contracts dynamically across
/// local IDE execution, published self-contained binaries, and Docker containers.
/// </summary>
public static class DataPathResolver
{
    public static string ResolveContractsPath(IHostEnvironment env, IConfiguration? config = null)
    {
        // 1. Check optional explicit configuration or environment variable (e.g. CONTRACTS_PATH)
        var explicitPath = config?["DataContractsPath"] ?? Environment.GetEnvironmentVariable("CONTRACTS_PATH");
        if (!string.IsNullOrWhiteSpace(explicitPath) && Directory.Exists(explicitPath))
        {
            return Path.GetFullPath(explicitPath);
        }

        // 2. Candidate locations: local subfolder, repository root, or binary execution directory
        var candidates = new[]
        {
            Path.Combine(env.ContentRootPath, "data", "contracts"),
            Path.GetFullPath(Path.Combine(env.ContentRootPath, "..", "..", "..", "data", "contracts")),
            Path.Combine(AppContext.BaseDirectory, "data", "contracts")
        };

        return candidates.FirstOrDefault(Directory.Exists) ?? candidates[1];
    }
}
